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
const html = readFileSync('index.html', 'utf8')
  .replace('<link rel="stylesheet" href="../assets/icons/phosphor/style.css">', `<style>${icons}</style>`)
  .replace('<link rel="stylesheet" href="src/styles.css">', `<style>${css}</style>`)
  .replace('<script type="module" src="dist/main.js"></script>', () => `<script type="module">${js}</script>`);

writeFileSync('dist/preview.html', html);
console.log('dist/preview.html', Math.round(html.length / 1024) + ' KB');
