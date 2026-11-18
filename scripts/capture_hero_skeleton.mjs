import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CDP_PORT = 9235;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\yyft7\\.gemini\\antigravity\\brain\\bdb6edce-37c2-43db-8836-fd4b10564a87';
const TEMP_PROFILE = 'C:\\Users\\yyft7\\AppData\\Local\\Temp\\edge_hero_profile';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  const browser = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${TEMP_PROFILE}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let versionData = null;
  for (let i = 0; i < 15; i++) {
    await sleep(500);
    try {
      const versionRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (versionRes.ok) {
        versionData = await versionRes.json();
        break;
      }
    } catch {}
  }

  if (!versionData) {
    throw new Error('Edge CDP failed to respond');
  }
  const wsUrl = versionData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => (ws.onopen = resolve));

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

  const { targetId } = await sendCommand('Target.createTarget', { url: 'http://127.0.0.1:3000/' });
  const { sessionId } = await sendCommand('Target.attachToTarget', { targetId, flatten: true });

  function sendSessionCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });
  }

  await sendSessionCommand('Page.enable');
  await sendSessionCommand('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await sleep(2000);
  await sendSessionCommand('Page.reload', { ignoreCache: true });
  await sleep(3500);

  const shot = await sendSessionCommand('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(ARTIFACT_DIR, 'hero-skeleton-preview.png');
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved hero screenshot to:', outPath);

  ws.close();
  browser.kill();
  process.exit(0);
}

capture().catch(console.error);
