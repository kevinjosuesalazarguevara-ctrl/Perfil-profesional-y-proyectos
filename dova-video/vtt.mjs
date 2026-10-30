// Subtítulos WebVTT a partir de la misma línea de tiempo del video: node vtt.mjs <es|en>
import { buildTimeline } from './timeline.mjs';
const lang = process.argv[2] ?? 'es';
const TL = buildTimeline(lang);
const f = (s) => { const ms = Math.round(s * 1000); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}`; };
console.log('WEBVTT\n');
TL.chunks.forEach((c, i) => console.log(`${i + 1}\n${f(c.a)} --> ${f(c.b)}\n${TL.text[c.key]}\n`));
