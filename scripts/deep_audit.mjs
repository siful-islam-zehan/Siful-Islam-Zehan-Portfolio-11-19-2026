import { spawn } from 'child_process';

const PORT = 3003;
const CDP_PORT = 9226;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runAudit() {
  console.log('--- LAUNCHING NEXT.JS PRODUCTION SERVER (PORT ' + PORT + ') ---');
  const server = spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', String(PORT)], {
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });

  server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));

  let serverUp = false;
  for (let i = 0; i < 20; i++) {
    await sleep(1000);
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) {
        serverUp = true;
        break;
      }
    } catch {}
  }

  if (!serverUp) {
    console.error('Server failed to start');
    server.kill();
    process.exit(1);
  }

  console.log('\n--- LAUNCHING HEADLESS EDGE WITH CDP (PORT ' + CDP_PORT + ') ---');
  const browser = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-extensions',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  await sleep(2000);

  // Connect to CDP
  const versionRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
  const versionData = await versionRes.json();
  const wsUrl = versionData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Create new target for audit
  const { targetId } = await sendCommand('Target.createTarget', { url: `${BASE_URL}/` });
  const { sessionId } = await sendCommand('Target.attachToTarget', { targetId, flatten: true });

  function sendSessionCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });
  }

  await sendSessionCommand('Page.enable');
  await sendSessionCommand('DOM.enable');
  await sendSessionCommand('Runtime.enable');

  // Navigate to homepage
  console.log('Navigating to homepage...');
  await sendSessionCommand('Page.navigate', { url: `${BASE_URL}/` });
  await sleep(3500); // Allow GSAP to settle

  // 1. Audit Accessibility: Headings
  const headingsResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.innerText.trim().replace(/\\n/g, ' '),
        }));
        return JSON.stringify(headings);
      })()
    `,
    returnByValue: true,
  });
  const headings = JSON.parse(headingsResult.result.value);

  // 2. Audit Accessibility: Images & Alt Text
  const imagesResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.getAttribute('alt'),
          loading: img.getAttribute('loading'),
          hasAlt: img.hasAttribute('alt') && img.getAttribute('alt').trim().length > 0,
        }));
        return JSON.stringify(imgs);
      })()
    `,
    returnByValue: true,
  });
  const images = JSON.parse(imagesResult.result.value);

  // 3. Audit Accessibility: Landmarks
  const landmarksResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        return JSON.stringify({
          header: document.querySelectorAll('header, [role="banner"]').length,
          nav: document.querySelectorAll('nav, [role="navigation"]').length,
          main: document.querySelectorAll('main, [role="main"]').length,
          footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
          skipLink: !!document.querySelector('.skip-link'),
        });
      })()
    `,
    returnByValue: true,
  });
  const landmarks = JSON.parse(landmarksResult.result.value);

  // 4. Audit Links: Internal targets resolution
  const linksResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const anchorHrefs = Array.from(document.querySelectorAll('a[href^="#"]')).map(a => a.getAttribute('href'));
        const uniqueHrefs = Array.from(new Set(anchorHrefs));
        const unresolved = uniqueHrefs.filter(href => {
          const id = href.replace('#', '');
          return !document.getElementById(id);
        });
        return JSON.stringify({ totalInternal: anchorHrefs.length, uniqueHrefs, unresolved });
      })()
    `,
    returnByValue: true,
  });
  const links = JSON.parse(linksResult.result.value);

  // 5. Performance Timings (Navigation Timing API)
  const perfResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const [nav] = performance.getEntriesByType('navigation');
        const [fcp] = performance.getEntriesByType('paint').filter(p => p.name === 'first-contentful-paint');
        return JSON.stringify({
          dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
          tcp: Math.round(nav.connectEnd - nav.connectStart),
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          download: Math.round(nav.responseEnd - nav.responseStart),
          domInteractive: Math.round(nav.domInteractive),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          fcp: fcp ? Math.round(fcp.startTime) : null,
          transferSize: nav.transferSize,
        });
      })()
    `,
    returnByValue: true,
  });
  const perf = JSON.parse(perfResult.result.value);

  // 6. Responsive Check: Mobile 390x844 overflow
  await sendSessionCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(1000);

  const overflowMobileResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        return JSON.stringify({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        });
      })()
    `,
    returnByValue: true,
  });
  const overflowMobile = JSON.parse(overflowMobileResult.result.value);

  // 7. Responsive Check: Desktop 1440x900 overflow
  await sendSessionCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(1000);

  const overflowDesktopResult = await sendSessionCommand('Runtime.evaluate', {
    expression: `
      (() => {
        return JSON.stringify({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        });
      })()
    `,
    returnByValue: true,
  });
  const overflowDesktop = JSON.parse(overflowDesktopResult.result.value);

  console.log('\n================ AUDIT RESULTS ================');
  console.log('LANDMARKS:', landmarks);
  console.log('HEADINGS HIERARCHY (' + headings.length + ' headings found):');
  headings.forEach(h => console.log(`  <${h.tag}>: "${h.text.slice(0, 50)}"`));
  console.log('IMAGES AUDIT (' + images.length + ' images):');
  console.log('  All have non-empty alt tags:', images.every(i => i.hasAlt));
  console.log('INTERNAL ANCHOR LINKS:');
  console.log('  Total:', links.totalInternal, 'Unresolved targets:', links.unresolved);
  console.log('PERFORMANCE METRICS:');
  console.log(`  TTFB: ${perf.ttfb} ms`);
  console.log(`  DOM Interactive: ${perf.domInteractive} ms`);
  console.log(`  DOM Content Loaded: ${perf.domContentLoaded} ms`);
  console.log(`  FCP: ${perf.fcp} ms`);
  console.log(`  Transferred Document Size: ${perf.transferSize} bytes`);
  console.log('RESPONSIVE OVERFLOW AUDIT:');
  console.log(`  Mobile 390px: scrollWidth=${overflowMobile.scrollWidth}, clientWidth=${overflowMobile.clientWidth}, overflow=${overflowMobile.hasOverflow}`);
  console.log(`  Desktop 1440px: scrollWidth=${overflowDesktop.scrollWidth}, clientWidth=${overflowDesktop.clientWidth}, overflow=${overflowDesktop.hasOverflow}`);

  // Clean shutdown
  ws.close();
  browser.kill();
  server.kill('SIGINT');
  process.exit(0);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
