# Video de DOVA

Video de motion graphics (sin personas) hecho en código con la marca de DOVA: negro `#0B0B0B`, lima `#C7FF3D`,
Space Grotesk e Inter. Sin voz; subtítulos integrados y efectos de sonido sintetizados (originales, sin licencias).

| Versión | Archivos en `out/` |
|---|---|
| Español vertical 1080x1920 | `dova-es-v-web.mp4` / `.webm`, `dova-es-v-poster.jpg` |
| Español horizontal 1920x1080 | `dova-es-h-web.mp4` / `.webm`, `dova-es-h-poster.jpg` |
| English vertical / horizontal | `dova-en-v-*`, `dova-en-h-*` |
| Subtítulos | `dova-es.vtt`, `dova-en.vtt` |

Las versiones de máxima calidad (`dova-{es,en}-{v,h}.mp4`) se generan con `./build.sh` y no se suben a git.

## Regenerar

Requisitos: Node, Playwright, ffmpeg, Python 3 con numpy.

```bash
./build.sh            # todas las versiones (unos 6 minutos)
node render.mjs es v out/prueba.mp4   # una sola
```

- `timeline.mjs`: textos y tiempos de cada escena y de cada sonido (una sola fuente para imagen y audio).
- `scene.html`: las animaciones. `synth.py`: los sonidos. `vtt.mjs`: subtítulos.

## Escena del sitio real (pendiente)

Si existen `assets/site-es.png` y `assets/site-en.png` (capturas verticales del sitio de DOVA a 390 px de ancho,
con `prefers-reduced-motion: reduce`), el video agrega una escena de 3,5 s con el sitio dentro de un celular.
Sin esas capturas la escena se omite.

## Integrar en el sitio de DOVA

1. Copiar `out/*-web.*`, `out/*-poster.jpg` y `out/*.vtt` a `public/assets/video/`.
2. Copiar `integration/VideoShowcase.astro` a `src/components/` y usar `<VideoShowcase lang="es" />`.
3. Si `public/_headers` define una CSP, agregar `media-src 'self'`.
