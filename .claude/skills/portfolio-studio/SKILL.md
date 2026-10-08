---
name: portfolio-studio
description: Editar, rediseñar o animar el portafolio de Kevin Salazar (index.html, README y proyectos del repo perfil-profesional-y-proyectos), con librerías de animación gratuitas y, si están conectados, Canva, Figma o Adobe para gráficos.
---

# Portfolio Studio

Skill para mantener y mejorar el portafolio web y el perfil de GitHub de Kevin Josué Salazar Guevara.

## Estructura del repositorio

| Archivo | Qué es |
|---|---|
| `index.html` | Portafolio de una sola página (GitHub Pages, rama `main`, raíz) |
| `README.md` | Portada del perfil en GitHub (mismo contenido que el portafolio, en Markdown) |
| `proyectos/<nombre>/README.md` | Ficha de cada proyecto; agregarlo también al índice `proyectos/README.md` |
| `assets/` | Imágenes, íconos y animaciones (crear si no existe) |

**Regla de consistencia:** cualquier cambio de contenido (experiencia, proyecto, certificación) se aplica en `index.html` **y** en `README.md`. Si el cambio también afecta el CV, avisar al usuario para actualizar el .docx.

## Criterio de diseño

Antes de cualquier cambio visual (rediseño, nueva sección, animaciones), cargar el skill **taste-skill** (`design-taste-frontend`, en `.claude/skills/taste-skill/`) y seguir su proceso: leer el brief, declarar el "Design Read" en una línea y pasar su checklist final. La audiencia de este portafolio son recruiters y clientes empresariales de soluciones Microsoft: sobrio, confiable y profesional. Las reglas de identidad visual y privacidad de este skill tienen prioridad sobre las sugerencias genéricas de taste-skill.

## Identidad visual

- Referencia de estructura: https://je4nca.github.io/personal-portfolio/ (hero con foto, ticker, sobre mí con cifras, qué hago, experiencia con logos, credenciales, proyectos, contacto, selector ES/EN).
- Design Read vigente: portafolio personal para recruiters y clientes empresariales de soluciones Microsoft, tema único negro y verde, lenguaje técnico sobrio, movimiento ligado al scroll. Dials: VARIANCE 6, MOTION 6, DENSITY 4.
- Paleta (tema oscuro único, a propósito): fondo `#07090a`, superficies `#0f1513` / `#141c19`, líneas `#1d2723`, texto `#e4ece7`, secundario `#8b9a92`, verde `#4fd98f` (texto sobre verde: `#05150d`), verde profundo `#1f8a57`.
- Fondo: rejilla de puntos fija con un "escáner" verde que baja según el scroll (`animation-timeline: scroll(root)`, con animación lenta de respaldo). La capa `.bg` va en `z-index: 0` y el contenido en `z-index: 1`.
- Tipografías: Geist y Geist Mono autoalojadas en `assets/fonts/` (OFL). No usar Fraunces ni Inter.
- Íconos: Phosphor regular en `assets/phosphor/`; `style.css` incluye solo los íconos en uso (regenerar al agregar uno).
- Logos de empresas en `assets/logos/`: Accenture y Anthropic vienen de Simple Icons (CC0) y van inline como SVG. Tek Experts y Concentrix se cargan desde `tek-experts.png` y `concentrix.png` si existen; si no, se muestra el nombre. No dibujar logos a mano.
- Bilingüe: cada texto visible lleva `<span class="es">` y `<span class="en">`; al agregar contenido, escribir ambos idiomas.
- Forma: interactivos en pill (999px), paneles 16px, recuadros de logo 10px.
- Foto de perfil en `assets/kevin.webp` (4:5). Si no existe, el hero muestra las iniciales.
- Sin guiones largos (—) ni medios (–) en el texto visible.

## Animación con herramientas gratuitas

Usar solo librerías gratuitas cargadas por CDN (cdnjs o jsDelivr):

- **GSAP + ScrollTrigger** (gratis): entradas al hacer scroll, contadores en las estadísticas, línea de tiempo de experiencia.
- **CSS puro** (`@keyframes`, `transition`, `animation-timeline: view()` donde haya soporte): micro-interacciones en botones, chips y tarjetas.
- **Lottie** (`lottie-web`): animaciones vectoriales en `assets/*.json`, por ejemplo íconos animados en la sección de proyectos.

Reglas:
1. Envolver toda animación en `@media (prefers-reduced-motion: no-preference)` o comprobarlo en JS antes de animar.
2. El contenido debe verse completo aunque el JS no cargue: nada de `opacity: 0` en CSS que dependa de un script.
3. Animaciones cortas (200–700 ms) y sutiles; el portafolio es profesional, no un sitio de entretenimiento.

## Edición de gráficos y medios

- **Canva** (plan gratuito): banner de LinkedIn, imagen para compartir el portafolio (`og:image`, 1200×630), miniaturas de proyectos.
- **Figma** (plan gratuito): diseñar o ajustar secciones y traer el contexto del diseño al código.
- **Adobe** (Adobe Express tiene plan gratuito): edición rápida de imágenes y animación de diseños.

Si el conector no está activo en la sesión, hacer el trabajo con HTML, CSS y SVG y mencionarlo en una línea. Exportar los resultados a `assets/` en formatos web (`.webp`, `.svg`, `.json` para Lottie).

## Privacidad

El repositorio es público. No publicar teléfono ni correo personal en `index.html` ni en `README.md`; el contacto es LinkedIn y GitHub, salvo que Kevin pida lo contrario.

## Verificación antes de subir

1. Capturar `index.html` con Playwright a 1280 px y 390 px de ancho (página completa) y revisar las imágenes.
2. Confirmar que no hay scroll horizontal en móvil (`document.documentElement.scrollWidth` igual al ancho de la ventana).
3. Revisar que los enlaces del README apunten a rutas existentes.

## Publicación

- Commits en español, describiendo el cambio.
- `git push` a `main`; GitHub Pages publica en `https://kevinjosuesalazarguevara-ctrl.github.io/perfil-profesional-y-proyectos/` en uno o dos minutos.
