# Portafolio de Kevin Josué Salazar Guevara

Sitio personal estático (una sola página) publicado con GitHub Pages desde `main`, en la raíz:
https://kevinjosuesalazarguevara-ctrl.github.io/perfil-profesional-y-proyectos/

Para cambios de contenido, diseño o animación, usar el skill `portfolio-studio` (`.claude/skills/portfolio-studio/`).
Para decisiones visuales, ese skill indica cargar `taste-skill`.

## Estructura

```
index.html            Portafolio completo (HTML, CSS y JS en línea), bilingüe ES/EN
README.md             Perfil profesional en inglés (portada del repo en GitHub)
proyectos/            Fichas de proyectos en Markdown, una carpeta por proyecto
assets/img/           Foto de perfil (kevin.webp) e imagen para compartir (og-image.png, 1200x630)
assets/logos/         Logos de empresas usados en Experiencia (PNG de una tinta)
assets/fonts/         Geist y Geist Mono autoalojadas (OFL)
assets/icons/phosphor Íconos Phosphor (MIT)
.claude/skills/       Skills de Claude Code para este repo
```

## Reglas

- **Repositorio público.** Nunca subir: teléfono, el CV (.docx o .pdf), claves o tokens, archivos `.env`,
  datos, precios o propuestas de clientes, ni la infraestructura técnica de proyectos de clientes
  (base de datos, hosting, proveedores). El correo sí se muestra porque Kevin lo pidió.
- El trabajo de clientes (por ejemplo, la demo de Herbarium) vive en repositorios **privados**.
- Hermes es trabajo de Accenture: solo se describe, no se sube código.
- Todo cambio de contenido (experiencia, proyectos, certificaciones) se aplica en `index.html` y en `README.md`.
- Cada texto visible del sitio lleva `<span class="es">` y `<span class="en">`.
- Sin guiones largos ni medios en el texto visible del sitio.
- No inventar métricas ni logros: solo datos que Kevin haya dado.

## Verificar y publicar

1. Capturar `index.html` con Playwright a 1280 px y 390 px y revisar; sin scroll horizontal en móvil.
2. Revisar que los enlaces del README y las rutas de `assets/` existan.
3. Commit en español y `git push` a `main`. GitHub Pages publica en uno o dos minutos.
