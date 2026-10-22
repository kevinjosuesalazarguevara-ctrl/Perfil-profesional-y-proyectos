// Genera dist/preview.html: una sola página con CSS, JS y fuentes incrustados,
// para abrirla en cualquier visor sin depender de rutas relativas.
import { readFileSync, writeFileSync } from 'node:fs';

const font = (path) => `data:font/woff2;base64,${readFileSync(path).toString('base64')}`;

let css = readFileSync('src/styles.css', 'utf8')
  .replace('../../assets/fonts/Geist-Variable.woff2', font('../assets/fonts/Geist-Variable.woff2'))
  .replace('../../assets/fonts/GeistMono-Variable.woff2', font('../assets/fonts/GeistMono-Variable.woff2'));
const icons = readFileSync('../assets/icons/phosphor/style.css', 'utf8')
  .replace('./Phosphor.woff2', font('../assets/icons/phosphor/Phosphor.woff2'));

const js = readFileSync('dist/main.js', 'utf8');
let html = readFileSync('index.html', 'utf8')
  .replace('<link rel="stylesheet" href="../assets/icons/phosphor/style.css">', `<style>${icons}</style>`)
  .replace('<link rel="stylesheet" href="src/styles.css">', `<style>${css}</style>`)
  .replace('<script type="module" src="dist/main.js"></script>', () => `<script type="module">${js}</script>`);

// Visores con CSP estricta bloquean imágenes externas: se sustituyen por degradados incrustados.
const placeholder = (url) => {
  let h = 0;
  for (const c of url) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hue = 130 + (h % 50);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 38% 32%)"/><stop offset="1" stop-color="hsl(${hue + 25} 45% 16%)"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};
const finalHtml = html.replace(/https:\/\/picsum\.photos\/[^"]+/g, placeholder);

writeFileSync('dist/preview.html', finalHtml);
console.log('dist/preview.html', Math.round(finalHtml.length / 1024) + ' KB');
