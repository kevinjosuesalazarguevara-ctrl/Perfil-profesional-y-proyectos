// Genera dist/preview.html: una sola página con CSS, JS, fuentes e imágenes incrustados,
// para abrirla en cualquier visor sin depender de rutas relativas.
// Si una imagen de assets/img todavía no existe, usa un degradado neutro en su lugar.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const b64 = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`;
const font = (path) => b64(path, 'font/woff2');

const css = readFileSync('src/styles.css', 'utf8')
  .replace('../../assets/fonts/Geist-Variable.woff2', font('../assets/fonts/Geist-Variable.woff2'))
  .replace('../../assets/fonts/GeistMono-Variable.woff2', font('../assets/fonts/GeistMono-Variable.woff2'));
const icons = readFileSync('../assets/icons/phosphor/style.css', 'utf8')
  .replace('./Phosphor.woff2', font('../assets/icons/phosphor/Phosphor.woff2'));
const js = readFileSync('dist/main.js', 'utf8');

const placeholder = (name) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 12;
  const l = 30 + h;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(0 0% ${l}%)"/><stop offset="1" stop-color="hsl(0 0% ${l - 14}%)"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

let html = readFileSync('index.html', 'utf8')
  .replace('<link rel="stylesheet" href="../assets/icons/phosphor/style.css">', () => `<style>${icons}</style>`)
  .replace('<link rel="stylesheet" href="src/styles.css">', () => `<style>${css}</style>`)
  .replace('<script type="module" src="dist/main.js"></script>', () => `<script type="module">${js}</script>`)
  .replace(/href="assets\/logo\/favicon\.svg"/, () => `href="${b64('assets/logo/favicon.svg', 'image/svg+xml')}"`)
  .replace(/src="(assets\/img\/[^"]+)"/g, (_, path) =>
    `src="${existsSync(path) ? b64(path, 'image/webp') : placeholder(path)}"`);

writeFileSync('dist/preview.html', html);
console.log('dist/preview.html', Math.round(html.length / 1024) + ' KB');
