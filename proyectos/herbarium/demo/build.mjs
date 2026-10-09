// Compila herbarium-demo.ts y lo empaqueta en herbarium-demo.html (un solo archivo).
// Uso: node build.mjs   (requiere TypeScript: npm i -g typescript)
// Si existen, incrusta: assets/logo-herbarium.*, assets/portada-actual.*, assets/productos/<slug>.*
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = mkdtempSync(join(tmpdir(), 'herb-'));
execFileSync('tsc', ['--target', 'ES2019', '--lib', 'ES2019,DOM,DOM.Iterable', '--strict', 'false', '--skipLibCheck',
  '--removeComments', 'false', '--outDir', out, join(here, 'herbarium-demo.ts')], { stdio: 'inherit' });
const js = readFileSync(join(out, 'herbarium-demo.js'), 'utf8');
rmSync(out, { recursive: true, force: true });

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const dataUri = f => `data:${MIME[extname(f).toLowerCase()]};base64,${readFileSync(f).toString('base64')}`;
const find = name => Object.keys(MIME).map(e => join(here, 'assets', name + e)).find(existsSync);

const assets = {};
const logo = find('logo-herbarium'); if (logo) assets.logo = dataUri(logo);
const portada = find('portada-actual'); if (portada) assets.portada = dataUri(portada);
const pdir = join(here, 'assets', 'productos');
if (existsSync(pdir)) {
  assets.productos = {};
  for (const f of readdirSync(pdir)) if (MIME[extname(f).toLowerCase()]) assets.productos[basename(f, extname(f))] = dataUri(join(pdir, f));
}

const favicon = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#DAEAF2" stroke="#248D3F" stroke-width="3"/><circle cx="32" cy="24" r="9" fill="#E7E401"/><path d="M4 46 Q20 36 34 43 T62 40 V56 A30 30 0 0 1 4 50z" fill="#248D3F"/></svg>');
const safe = s => s.replace(/<\/(script)/gi, '<\\/$1');

const html = `<!doctype html>
<html lang="es-CR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Herbarium · Productos naturales desde 2005</title>
<meta name="description" content="Demo de renovación de marca y sitio web para Comercializadora Herbarium, laboratorio costarricense de productos naturales.">
<meta name="theme-color" content="#0E2F3B">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Manrope:wght@400..800&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
<noscript><p style="padding:24px;font-family:sans-serif">Esta demo necesita JavaScript activado.</p></noscript>
<script>window.__HERB_ASSETS__=${safe(JSON.stringify(assets))};</script>
<script>
${safe(js)}
</script>
</body>
</html>
`;
writeFileSync(join(here, 'herbarium-demo.html'), html);
console.log(`herbarium-demo.html listo (${(html.length / 1024).toFixed(0)} KB) · logo: ${logo ? 'sí' : 'no'} · portada: ${portada ? 'sí' : 'no'} · fotos: ${Object.keys(assets.productos || {}).length}`);
