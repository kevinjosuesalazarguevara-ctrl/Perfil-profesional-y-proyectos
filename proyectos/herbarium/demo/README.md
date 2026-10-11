# Herbarium · Demo de renovación de marca y sitio web

Demo para presentar a Comercializadora Herbarium una propuesta de rediseño de [herbarium.co.cr](https://herbarium.co.cr).

| Archivo | Qué es |
|---|---|
| `herbarium-demo.html` | **Entregable.** Un solo archivo: se abre con doble clic en cualquier navegador. |
| `herbarium-demo.ts` | Código fuente en TypeScript (datos, estilos, escena 3D, rutas e interacciones). |
| `build.mjs` | Compila el `.ts` y genera el `.html`, con Three.js, tipografías e imágenes de `assets/` incrustadas. |
| `serve.mjs` | Servidor local que abre la demo en el navegador. |
| `package.json` / `tsconfig.json` | Dependencias y configuración de TypeScript. |
| [`PROPUESTA.md`](./PROPUESTA.md) | Diagnóstico, decisiones, rendimiento, datos a validar y capturas. |
| [`PRESUPUESTO.md`](./PRESUPUESTO.md) | Estimación de precio en Costa Rica. |
| `capturas/` | Capturas de las vistas principales. |

## Para presentar

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
cd proyectos/herbarium/demo
npm install      # una sola vez
npm run demo     # compila el TypeScript y abre http://localhost:5173
```

Otros comandos: `npm run build` (solo genera el HTML) y `npm run check` (revisa los tipos).

El `herbarium-demo.html` ya generado también se puede abrir con doble clic. Incluye la escena 3D y las tipografías, así que **funciona sin internet**: no depende del wifi del lugar de la presentación.

**Medidor de FPS:** tecla **F** durante la demo, o agregar `?fps` al final de la dirección (por ejemplo `#/inicio?fps`). Muestra los cuadros por segundo, el peor cuadro y la resolución de la escena 3D.

**Rendimiento:** la escena 3D ajusta su resolución sola si el equipo no sostiene 60 FPS. Si hace falta, apaga el suavizado de bordes y dibuja la mitad del polen. Se pausa cuando no se ve o cuando hay un modal abierto. Las animaciones de la interfaz usan solo `transform` y `opacity`, que el navegador mueve sin repintar.

Antes de presentar, conviene limpiar los datos de prueba: **Vaciar carrito** en el carrito y **Borrar todo** en el panel del Club.

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

Después, regenerar el HTML con `npm run build`.

Todo dato no publicado aparece entre corchetes, por ejemplo `[N.º REGISTRO SANITARIO]`.
