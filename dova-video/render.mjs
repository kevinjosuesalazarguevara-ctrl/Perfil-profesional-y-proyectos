// Renderiza scene.html fotograma a fotograma (30 fps, 15 s, 1080x1920) y lo codifica en MP4 con ffmpeg.
// Uso: node render.mjs   (requiere playwright y ffmpeg)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const FPS = 30, SECONDS = 15, OUT = 'dova-ugc-15s.mp4';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(resolve('scene.html')).href);
await page.evaluate(() => document.fonts.ready);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });

for (let f = 0; f < FPS * SECONDS; f++) {
  await page.evaluate((t) => window.render(t), f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f === 75 || f === 225 || f === 420) await page.screenshot({ path: `frame-${f}.jpg`, type: 'jpeg', quality: 90 });
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log('listo', OUT);
