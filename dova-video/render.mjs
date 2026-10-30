// Renderiza scene.html fotograma a fotograma (30 fps) y lo codifica con ffmpeg.
// Uso: node render.mjs <es|en> <v|h> <salida.mp4>
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import { buildTimeline } from './timeline.mjs';

const [lang = 'es', format = 'v', out = `dova-${lang}-${format}-silent.mp4`] = process.argv.slice(2);
const FPS = 30;
const SNAPS = (process.env.SNAP || '').split(',').filter(Boolean).map(Number);
const TL = buildTimeline(lang);
writeFileSync(`timeline-${lang}.json`, JSON.stringify(TL, null, 1));
const [W, H] = format === 'h' ? [1920, 1080] : [1080, 1920];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.addInitScript(({ TL, CFG }) => { window.TL = TL; window.CFG = CFG; }, { TL, CFG: { lang, format } });
await page.goto(pathToFileURL(resolve('scene.html')).href);
await page.evaluate(() => document.fonts.ready);
const total = Math.round(TL.duration * FPS);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const posterAt = Math.round((TL.scenes.cta.start + 1.9) * FPS);
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f === posterAt) await page.screenshot({ path: `dova-${lang}-${format}-poster.jpg`, type: 'jpeg', quality: 88 });
  if (process.env.SNAP && SNAPS.includes(f)) await page.screenshot({ path: `snap-${lang}-${format}-${f}.jpg`, type: 'jpeg', quality: 85 });
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log('listo', out, TL.duration + ' s');
