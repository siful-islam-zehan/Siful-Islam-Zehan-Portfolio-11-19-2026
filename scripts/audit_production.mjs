import http from 'http';
import { spawn } from 'child_process';
import path from 'path';

const PORT = 3001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function testUrl(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    return { status: res.status, ok: res.ok, headers: Object.fromEntries(res.headers.entries()), textLength: text.length, textSnippet: text.slice(0, 300) };
  } catch (err) {
    return { error: err.message };
  }
}

async function runAudit() {
  console.log('--- STARTING PRODUCTION SERVER AUDIT ON PORT', PORT, '---');
  
  // Start next start on 127.0.0.1:3001
  const server = spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });

  server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d}`));

  // Wait for server to start
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await sleep(1000);
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
  }

  if (!ready) {
    console.error('Server failed to start in 20s');
    server.kill();
    process.exit(1);
  }

  console.log('\n--- VERIFYING ENDPOINTS ---');

  // 1. Homepage
  const home = await testUrl(`${BASE_URL}/`);
  console.log('Homepage status:', home.status, 'HTML length:', home.textLength);
  
  // Check for schema JSON-LD
  const hasJsonLd = home.textSnippet?.includes('application/ld+json') || (await (await fetch(`${BASE_URL}/`)).text()).includes('application/ld+json');
  console.log('Has Schema.org JSON-LD:', hasJsonLd);

  // Check no preloaded iframe
  const fullHtml = await (await fetch(`${BASE_URL}/`)).text();
  const iframeCount = (fullHtml.match(/<iframe/g) || []).length;
  console.log('Initial preloaded iframes in HTML:', iframeCount, '(Should be 0)');

  // 2. Robots.txt
  const robots = await testUrl(`${BASE_URL}/robots.txt`);
  console.log('Robots.txt status:', robots.status, 'Snippet:\n', robots.textSnippet);

  // 3. Sitemap.xml
  const sitemap = await testUrl(`${BASE_URL}/sitemap.xml`);
  console.log('Sitemap.xml status:', sitemap.status, 'Snippet:\n', sitemap.textSnippet);

  // 4. Icon SVG
  const icon = await testUrl(`${BASE_URL}/icon.svg`);
  console.log('Icon.svg status:', icon.status);

  // 5. OpenGraph Image
  const og = await testUrl(`${BASE_URL}/og-image.png`);
  console.log('OG image status:', og.status, 'Length:', og.textLength);

  // 6. Case Study Route
  const caseStudy = await testUrl(`${BASE_URL}/works/grandpool`);
  console.log('Case Study /works/grandpool status:', caseStudy.status);

  // 7. 404 Route
  const notFound = await testUrl(`${BASE_URL}/some-missing-page-404`);
  console.log('Non-existent route status:', notFound.status, '(Should be 404)');

  // 8. Styleguide protection in production
  const styleguide = await testUrl(`${BASE_URL}/styleguide`);
  console.log('Styleguide status in production:', styleguide.status, '(Should be 404 - protected)');

  console.log('\n--- KILLING TEST SERVER ---');
  server.kill('SIGINT');
  process.exit(0);
}

runAudit().catch((err) => {
  console.error('Audit script error:', err);
  process.exit(1);
});
