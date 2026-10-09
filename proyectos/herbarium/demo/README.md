# Herbarium · Demo de renovación de marca y sitio web

Demo para presentar a Comercializadora Herbarium una propuesta de rediseño de [herbarium.co.cr](https://herbarium.co.cr).

| Archivo | Qué es |
|---|---|
| `herbarium-demo.html` | **Entregable.** Un solo archivo: se abre con doble clic en cualquier navegador. |
| `herbarium-demo.ts` | Código fuente en TypeScript (datos, estilos, escena 3D, rutas e interacciones). |
| `build.mjs` | Compila el `.ts` y genera el `.html`, incrustando las imágenes de `assets/` si existen. |

Necesita internet al abrirse para cargar Three.js (cdnjs) y las tipografías (Google Fonts). Sin conexión funciona igual, con una portada ilustrada en lugar de la escena 3D.

## Qué incluye

- SPA con rutas: `#/inicio`, `#/productos`, `#/productos/<categoría>`, `#/productos/<categoría>/<producto>` (vista rápida), `#/nosotros`, `#/ingredientes`, `#/proceso`, `#/asistente`, `#/empresas`, `#/club`, `#/antes-y-despues`, `#/contacto` y `#/carrito`. Funcionan los botones atrás y adelante del navegador.
- Transición animada en cada cambio de vista, menú con la sección activa, ruta de ubicación y accesos a otras secciones al final de cada vista.
- Inicio como mapa de mosaicos, con historia, misión y visión visibles.
- Escena 3D con Three.js (sol con rayos, colinas en franjas, árbol y polen) que reacciona al mouse y cambia con el selector "Para tu bienestar / Para tu marca".
- Catálogo con las 10 categorías en el orden del sitio, 43 productos con los precios de la tienda, vista rápida y carrito de demostración.
- Asistente de 3 preguntas, tarjetas de ingredientes que giran en 3D, proceso "Del campo al frasco", cotizador de maquila y comparador antes/después.
- Pop-up de registro con código único, panel de registrados y exportación a CSV (Excel) o JSON. En la demo los registros se guardan solo en el navegador donde se abre.

## Completar con material del cliente

El sitio actual estaba bloqueado desde el entorno donde se construyó la demo, así que estas piezas quedan listas para conectar:

1. **Logo:** guardar el archivo como `assets/logo-herbarium.png` (o `.svg` / `.webp`). Mientras no exista, se muestra un emblema provisional armado con los motivos del logo.
2. **Fotos de producto:** guardar cada una como `assets/productos/<slug>.jpg` (el slug es el de la URL de la tienda, por ejemplo `unguento-cascabel`). También se pueden pegar URLs en `FOTOS_PRODUCTO` dentro del `.ts`.
3. **Portada actual:** guardar una captura como `assets/portada-actual.png` para el comparador.
4. **Tarifas de maquila:** completar `TARIFAS` en el `.ts` para que el cotizador calcule totales.

Después, regenerar el HTML:

```bash
npm i -g typescript   # una sola vez
node build.mjs
```

Todo dato no publicado aparece entre corchetes, por ejemplo `[N.º REGISTRO SANITARIO]`.
