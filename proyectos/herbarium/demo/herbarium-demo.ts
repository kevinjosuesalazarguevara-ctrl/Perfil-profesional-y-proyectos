/* ==========================================================================
   Herbarium · Demo de renovación de marca y sitio web
   Fuente única en TypeScript. `node build.mjs` la compila y la empaqueta en
   herbarium-demo.html (un solo archivo que se abre con doble clic).

   Datos reales tomados de herbarium.co.cr (tienda, contacto y "¿Quiénes somos?").
   Todo lo que no está publicado va entre corchetes: [ASÍ].
   ========================================================================== */

declare const THREE: any;

/* --------------------------------------------------------------------------
   0. Recursos opcionales (logo, captura actual, fotos de producto)
   build.mjs los incrusta desde ./assets si existen. También se pueden pegar
   URLs reales de la tienda en FOTOS_PRODUCTO.
   -------------------------------------------------------------------------- */
interface Assets { logo?: string; portada?: string; productos?: Record<string, string> }
const ASSETS: Assets = (window as any).__HERB_ASSETS__ || {};

/** Pegá aquí la URL real de cada foto (slug → URL) si no usás la carpeta assets/productos. */
const FOTOS_PRODUCTO: Record<string, string> = {
  // 'unguento-cascabel': 'https://herbarium.co.cr/wp-content/uploads/....jpg',
};

/** Tarifas de maquila por unidad (₡). Vacío = el cotizador muestra marcadores. */
const TARIFAS: Partial<Record<CatSlug, number>> = {};

/* --------------------------------------------------------------------------
   1. Datos
   -------------------------------------------------------------------------- */
type CatSlug = 'unguentos' | 'capsulas' | 'colagenos' | 'cremas' | 'fibra' | 'jarabes' | 'te' | 'shampoo' | 'sebo' | 'proteinas';
type Pack = 'jar' | 'bottle' | 'pouch' | 'tube' | 'syrup' | 'box' | 'pump' | 'tin' | 'tub';
type Need = 'descanso' | 'movilidad' | 'digestion' | 'piel' | 'energia' | 'temporada';

interface Cat { slug: CatSlug; name: string; tagline: string; desc: string; color: string; accent: string; pack: Pack; format: 'tomar' | 'aplicar' }
interface Product {
  slug: string; name: string; cat: CatSlug; price: string | null; desc: string;
  use?: string; needs: Need[]; who?: 'h' | 'm'; url?: boolean; pack?: Pack; check?: string;
}

const CATS: Cat[] = [
  { slug: 'unguentos', name: 'Ungüentos', tagline: 'Masajes con tradición', desc: 'Fórmulas herbales para masajes localizados con árnica, caléndula, ortiga, romero y otras plantas de uso tradicional.', color: '#248D3F', accent: '#D5C835', pack: 'jar', format: 'aplicar' },
  { slug: 'capsulas', name: 'Cápsulas', tagline: 'Plantas en dosis prácticas', desc: 'Extractos vegetales y vitaminas en cápsulas para acompañar tu rutina diaria de bienestar.', color: '#0E2F3B', accent: '#8EB24F', pack: 'bottle', format: 'tomar' },
  { slug: 'colagenos', name: 'Colágenos', tagline: 'Cuidado desde adentro', desc: 'Colágeno hidrolizado en polvo y en cápsulas, con fórmulas pensadas para mujer y para hombre.', color: '#8EB24F', accent: '#E7E401', pack: 'pouch', format: 'tomar' },
  { slug: 'cremas', name: 'Cremas', tagline: 'Rutina de piel', desc: 'Cremas faciales y corporales con colágeno para la hidratación de todos los días.', color: '#248D3F', accent: '#DAEAF2', pack: 'tube', format: 'aplicar' },
  { slug: 'fibra', name: 'Fibra', tagline: 'Equilibrio diario', desc: 'Fibra para sumar a tu alimentación y ayudar a mantener un buen tránsito intestinal.', color: '#8EB24F', accent: '#403C31', pack: 'pouch', format: 'tomar' },
  { slug: 'jarabes', name: 'Jarabes', tagline: 'Temporada fría', desc: 'Jarabes herbales que acompañan los días de clima frío y lluvioso.', color: '#403C31', accent: '#D5C835', pack: 'syrup', format: 'tomar' },
  { slug: 'te', name: 'Té', tagline: 'Infusiones de la casa', desc: 'Herba-Tés e infusiones de 30 unidades con mezclas de plantas para cada momento del día.', color: '#248D3F', accent: '#E7E401', pack: 'box', format: 'tomar' },
  { slug: 'shampoo', name: 'Shampoo', tagline: 'Cabello con brillo', desc: 'Shampoos tipo equino con cebolla, lavanda y menta para el cuidado del cabello.', color: '#0E2F3B', accent: '#DAEAF2', pack: 'pump', format: 'aplicar' },
  { slug: 'sebo', name: 'Sebo', tagline: 'Receta clásica', desc: 'Sebo cubano El Indio, solo o con árbol de té o árnica, para masajes de toda la vida.', color: '#403C31', accent: '#E7E401', pack: 'tin', format: 'aplicar' },
  { slug: 'proteinas', name: 'Proteínas', tagline: 'Nutrición activa', desc: 'Full Protein en varios sabores para acompañar la actividad física y la nutrición diaria.', color: '#0E2F3B', accent: '#E7E401', pack: 'tub', format: 'tomar' },
];
const CAT = Object.fromEntries(CATS.map(c => [c.slug, c])) as Record<CatSlug, Cat>;

// Precios tal como aparecen en la tienda. `check` = el sitio muestra otro precio en otra página.
const PRODUCTS: Product[] = [
  // Ungüentos
  { slug: 'unguento-cascabel', name: 'Ungüento Cascabel', cat: 'unguentos', price: '₡4,990.00', url: true, needs: ['movilidad'], desc: 'Ungüento de efecto cálido para masajes que ayudan a activar la circulación de la zona.' },
  { slug: 'unguento-el-indio', name: 'Ungüento El Indio', cat: 'unguentos', price: '₡5,240.00', url: true, needs: ['temporada', 'movilidad'], desc: 'Ungüento tradicional para masajes en espalda y pecho; acompaña los días de temporada fría.' },
  { slug: 'unguento-de-ortiga', name: 'Ungüento de Ortiga', cat: 'unguentos', price: '₡4,990.00', url: true, needs: ['piel'], desc: 'Ortiga en un ungüento para masajes en piernas y para el cuidado de la piel.' },
  { slug: 'unguento-glucoflex', name: 'Ungüento Glucoflex', cat: 'unguentos', price: '₡5,145.00', url: true, needs: ['movilidad'], check: 'La tienda indica "más impuesto".', desc: 'Ungüento para masajes en articulaciones; acompaña tus rutinas de movilidad.' },
  { slug: 'unguento-arnica-y-calendula', name: 'Ungüento Árnica y Caléndula', cat: 'unguentos', price: '₡5,095.00', url: true, needs: ['movilidad'], desc: 'El clásico de árnica y caléndula para masajes después del esfuerzo físico.' },
  { slug: 'unguento-solda-consolda-y-romero', name: 'Ungüento Solda Consolda y Romero', cat: 'unguentos', price: '₡5,240.00', url: true, needs: ['movilidad'], desc: 'Consuelda y romero en un ungüento para masajes reconfortantes.' },
  { slug: 'unguento-solda-y-zaragundi', name: 'Ungüento Solda y Zaragundi', cat: 'unguentos', price: '₡5,240.00', url: true, needs: ['movilidad'], desc: 'Combinación tradicional para masajes localizados.' },
  // Cápsulas
  { slug: 'capsulas-cola-de-caballo', name: 'Cápsulas Cola de Caballo', cat: 'capsulas', price: '₡5,375.00', url: true, needs: ['piel'], use: '1 cápsula al día (según la tienda).', desc: 'Cola de caballo para acompañar el cuidado de cabello, piel y uñas.' },
  { slug: 'capsulas-ar-t-flex', name: 'Cápsulas Ar-T-Flex', cat: 'capsulas', price: '₡8,495.00', url: true, needs: ['movilidad'], desc: 'Fórmula para acompañar el bienestar de las articulaciones.' },
  { slug: 'capsulas-d-f-n-plus-x90', name: 'Cápsulas D-F-N PLUS x90', cat: 'capsulas', price: '₡6,935.00', needs: [], desc: 'Presentación de 90 cápsulas. [DESCRIPCIÓN DEL PRODUCTO]' },
  { slug: 'capsulas-energy-plus', name: 'Cápsulas Energy Plus', cat: 'capsulas', price: '₡5,720.00', needs: ['energia'], desc: 'Para acompañar días activos y de mayor demanda de energía.' },
  { slug: 'capsulas-valeriana-con-vitamina-c-y-b6', name: 'Cápsulas Valeriana con Vitamina C y B6', cat: 'capsulas', price: '₡7,250.00', check: 'Otra página de la tienda muestra ₡6,905.00.', needs: ['descanso'], desc: 'Valeriana con vitaminas C y B6 para acompañar la relajación y el descanso.' },
  { slug: 'capsulas-nopal-con-vitamina-c', name: 'Cápsulas Nopal con Vitamina C', cat: 'capsulas', price: '₡5,805.00', url: true, check: 'Otra página de la tienda muestra ₡5,525.00.', needs: ['digestion'], desc: 'Nopal con vitamina C, aliado de una alimentación balanceada.' },
  { slug: 'capsulas-cardo-max-cardomariano-con-vitamina-c-y-e', name: 'Cápsulas Cardo-Max Cardomariano con Vitamina C y E', cat: 'capsulas', price: '₡6,820.00', url: true, use: '1 cápsula al día (según la tienda).', needs: ['digestion'], desc: 'Cardo mariano con vitaminas C y E para acompañar el bienestar digestivo.' },
  // Colágenos
  { slug: 'colageno-hidrolizado', name: 'Colágeno Hidrolizado', cat: 'colagenos', price: '₡8,010.00', needs: ['piel', 'movilidad'], desc: 'Colágeno hidrolizado en polvo para acompañar el cuidado de piel y articulaciones.' },
  { slug: 'colageno-hidrolizado-mujer-guarana-damiana', name: 'Colágeno Hidrolizado Mujer Guaraná + Damiana con Vitamina C', cat: 'colagenos', price: '₡8,215.00', who: 'm', needs: ['piel', 'energia'], check: 'Validar el nombre exacto en la tienda.', desc: 'Colágeno en polvo con guaraná, damiana y vitamina C, formulado para mujer.' },
  { slug: 'colageno-hidrolizado-men-ginseng-maca', name: 'Colágeno Hidrolizado Men Ginseng + Maca', cat: 'colagenos', price: '₡8,215.00', who: 'h', needs: ['energia', 'movilidad'], desc: 'Colágeno en polvo con ginseng y maca, formulado para hombre.' },
  { slug: 'capsulas-colageno-hidrolizado-mujer', name: 'Cápsulas Colágeno Hidrolizado Mujer', cat: 'colagenos', price: '₡6,635.00', who: 'm', pack: 'bottle', needs: ['piel'], check: 'Validar el nombre exacto en la tienda.', desc: 'Colágeno en cápsulas para la rutina diaria de cuidado de la mujer.' },
  { slug: 'capsulas-colageno-hidrolizado-men-ginseng-maca', name: 'Cápsulas Colágeno Hidrolizado Men Ginseng + Maca', cat: 'colagenos', price: '₡5,980.00', url: true, who: 'h', pack: 'bottle', use: '1 cápsula al día (según la tienda).', needs: ['energia', 'movilidad'], desc: 'Colágeno con ginseng y maca en cápsulas, formulado para hombre.' },
  // Cremas
  { slug: 'crema-facial-colageno', name: 'Crema Facial Colágeno', cat: 'cremas', price: '₡5,265.00', url: true, check: 'La ficha del producto muestra ₡5,015.00.', needs: ['piel'], desc: 'Crema facial con colágeno para tu rutina diaria de hidratación.' },
  { slug: 'crema-corporal-colageno', name: 'Crema Corporal Colágeno', cat: 'cremas', price: '₡5,230.00', url: true, check: 'La ficha del producto muestra ₡4,980.00.', needs: ['piel'], desc: 'Crema corporal con colágeno que ayuda a mantener la piel suave e hidratada.' },
  // Fibra
  { slug: 'fibra-c-san-bolsa', name: 'Fibra C-San Bolsa', cat: 'fibra', price: '₡2,615.00', url: true, check: 'La ficha del producto muestra ₡2,930.00.', needs: ['digestion'], desc: 'Fibra para sumar a tu alimentación y ayudar al tránsito intestinal.' },
  // Jarabes
  { slug: 'jarabe-mi-elix-bronk', name: 'Jarabe Mi-Elix-Bronk', cat: 'jarabes', price: '₡5,135.00', url: true, needs: ['temporada'], desc: 'Jarabe herbal para acompañar los días de temporada fría. [INGREDIENTES]' },
  // Té
  { slug: 'herba-te-de-cipres', name: 'Herba-Té de Ciprés 30 uds', cat: 'te', price: '₡2,580.00', needs: ['temporada'], desc: 'Infusión de ciprés en presentación de 30 unidades.' },
  { slug: 'te-de-ortiga', name: 'Té de Ortiga 30 uds', cat: 'te', price: '₡2,555.00', needs: ['piel', 'digestion'], desc: 'Infusión de ortiga, 30 unidades.' },
  { slug: 'herba-te-ansite', name: 'Herba-Té Ansite 30 uds', cat: 'te', price: '₡2,490.00', needs: ['descanso'], desc: 'Tilo, menta, naranjo agrio y pasiflora: una mezcla para acompañar la calma de la noche.' },
  { slug: 'herba-te-cadider-plus', name: 'Herba-Té Cadider Plus 30 uds', cat: 'te', price: '₡3,285.00', needs: ['digestion'], desc: 'Orégano y menta en una infusión para después de las comidas.' },
  { slug: 'herba-te-curcuma-y-jengibre-con-miel', name: 'Herba-Té Cúrcuma y Jengibre con Miel de Abeja 30 uds', cat: 'te', price: '₡3,285.00', needs: ['temporada', 'energia'], desc: 'Cúrcuma, jengibre y miel de abeja en una taza cálida.' },
  { slug: 'te-juanilama', name: 'Té Juanilama 30 uds', cat: 'te', price: '₡2,625.00', needs: ['temporada', 'digestion'], desc: 'Juanilama, la infusión tradicional costarricense, en 30 unidades.' },
  { slug: 'te-sorosi', name: 'Té Sorosi', cat: 'te', price: '₡2,580.00', url: true, use: '2 al día; se puede endulzar con miel (según la tienda).', needs: ['digestion'], desc: 'Infusión de sorosi para tu rutina diaria.' },
  { slug: 'te-diente-de-leon-manzanilla-y-te-verde', name: 'Té Diente de León, Manzanilla y Té verde', cat: 'te', price: '₡2,580.00', url: true, needs: ['digestion', 'descanso'], desc: 'Diente de león, manzanilla y té verde en una mezcla suave.' },
  // Shampoo
  { slug: 'shampoo-de-equino', name: 'Shampoo de Equino', cat: 'shampoo', price: '₡4,780.00', needs: ['piel'], desc: 'Shampoo tipo equino para el cuidado y el brillo del cabello.' },
  { slug: 'shampoo-equino-lavanda-menta', name: 'Shampoo equino lavanda + menta', cat: 'shampoo', price: null, needs: ['piel'], desc: 'Shampoo tipo equino con lavanda y menta para una sensación fresca.' },
  { slug: 'shampoo-equino-de-cebolla', name: 'Shampoo Equino de Cebolla', cat: 'shampoo', price: null, needs: ['piel'], desc: 'Shampoo tipo equino con cebolla para el cuidado del cabello.' },
  // Sebo
  { slug: 'sebo-cubano-autentico-el-indio', name: 'Sebo Cubano Auténtico El Indio 30 g', cat: 'sebo', price: '₡3,025.00', needs: ['temporada', 'movilidad'], desc: 'El sebo cubano de siempre para masajes.' },
  { slug: 'sebo-cubano-el-indio-arbol-de-te', name: 'Sebo Cubano El Indio con Árbol de Té 30 g', cat: 'sebo', price: '₡3,860.00', needs: ['piel'], desc: 'Sebo cubano con árbol de té.' },
  { slug: 'sebo-cubano-el-indio-arnica', name: 'Sebo Cubano El Indio con Árnica 30 g', cat: 'sebo', price: '₡3,860.00', needs: ['movilidad'], desc: 'Sebo cubano con árnica para masajes después del esfuerzo.' },
  // Proteínas
  { slug: 'full-protein-fresa', name: 'Full Protein Fresa', cat: 'proteinas', price: '₡7,095.00', needs: ['energia'], desc: 'Proteína en polvo sabor fresa para acompañar la actividad física.' },
  { slug: 'full-protein-vainilla', name: 'Full Protein Vainilla', cat: 'proteinas', price: '₡7,095.00', needs: ['energia'], desc: 'Proteína en polvo sabor vainilla para tu nutrición diaria.' },
  { slug: 'full-protein-chocolate', name: 'Full Protein Chocolate', cat: 'proteinas', price: '₡7,095.00', needs: ['energia'], desc: 'Proteína en polvo sabor chocolate para después del entrenamiento.' },
  { slug: 'full-protein-frutas', name: 'Full Protein Frutas', cat: 'proteinas', price: '₡6,835.00', needs: ['energia'], desc: 'Proteína en polvo sabor frutas.' },
  { slug: 'full-protein-frutos-rojos', name: 'Full Protein Frutos Rojos', cat: 'proteinas', price: '₡7,460.00', needs: ['energia'], desc: 'Proteína en polvo sabor frutos rojos.' },
  { slug: 'full-protein-banano-granola', name: 'Full Protein Banano Granola', cat: 'proteinas', price: '₡7,460.00', needs: ['energia'], desc: 'Proteína en polvo sabor banano granola.' },
];
const BY_SLUG = Object.fromEntries(PRODUCTS.map(p => [p.slug, p])) as Record<string, Product>;
const inCat = (c: CatSlug) => PRODUCTS.filter(p => p.cat === c);

const EMPRESA = {
  nombre: 'Comercializadora Herbarium S.A.',
  telefono: '+506 7131-0701',
  telLink: '+50671310701',
  correo: 'info@herbarium.co.cr',
  direccion: 'Heredia, Ruta 126, Barva, La Amada, San Pedro de Barva',
  facebook: 'https://www.facebook.com/HerbariumCR',
  instagram: 'https://www.instagram.com/herbarium_costarica/',
  tienda: 'https://herbarium.co.cr',
};

// Texto de "¿Quiénes somos?" en herbarium.co.cr
const HISTORIA = [
  'Desde 2005, en Herbarium nos dedicamos a crear productos naturales que promueven el bienestar integral.',
  'Con más de 15 años de experiencia, seleccionamos cuidadosamente ingredientes como la manzanilla, el romero y la valeriana, con el fin de ofrecer soluciones naturales que cuidan de la persona y del medio ambiente.',
  'Creemos en el poder de la naturaleza para mejorar la vida de las personas, de forma sostenible y responsable.',
];
const MISION = 'Crear productos naturales de calidad que acompañen el bienestar integral de las familias, seleccionando con cuidado cada ingrediente y cuidando a las personas y al medio ambiente.';
const VISION = 'Ser el laboratorio costarricense de productos naturales de referencia, reconocido por la calidad de sus fórmulas, su transparencia y su forma sostenible y responsable de aprovechar la naturaleza.';
const VALORES = [
  ['Calidad', 'Ingredientes seleccionados y procesos controlados en cada lote.'],
  ['Naturaleza', 'Aprovechar las plantas de forma sostenible y responsable.'],
  ['Transparencia', 'Etiquetas claras, información honesta y sin promesas exageradas.'],
  ['Cercanía', 'Una empresa familiar de Barva, Heredia, al lado de sus clientes.'],
];

interface Ingredient { name: string; sci: string; kind: 'flor' | 'rama' | 'hoja' | 'raiz' | 'cola' | 'cardo' | 'nopal'; petal?: string; note: string; match: string[] }
const INGREDIENTES: Ingredient[] = [
  { name: 'Manzanilla', sci: 'Matricaria chamomilla', kind: 'flor', petal: '#ffffff', note: 'Flor de infusión clásica, asociada a la calma y a la sobremesa.', match: ['manzanilla'] },
  { name: 'Romero', sci: 'Salvia rosmarinus', kind: 'rama', note: 'Hierba aromática de uso tradicional en masajes reconfortantes.', match: ['romero'] },
  { name: 'Valeriana', sci: 'Valeriana officinalis', kind: 'flor', petal: '#F3E9F7', note: 'Raíz conocida por acompañar la relajación al final del día.', match: ['valeriana'] },
  { name: 'Árnica', sci: 'Arnica montana', kind: 'flor', petal: '#E7E401', note: 'Flor amarilla de montaña, clásica en masajes después del esfuerzo.', match: ['árnica', 'arnica'] },
  { name: 'Caléndula', sci: 'Calendula officinalis', kind: 'flor', petal: '#D5C835', note: 'Flor de pétalos dorados, tradicional en el cuidado de la piel.', match: ['caléndula', 'calendula'] },
  { name: 'Ortiga', sci: 'Urtica dioica', kind: 'hoja', note: 'Hoja de borde dentado usada en infusiones y preparaciones tópicas.', match: ['ortiga'] },
  { name: 'Cola de caballo', sci: 'Equisetum arvense', kind: 'cola', note: 'Planta articulada que acompaña el cuidado de cabello, piel y uñas.', match: ['cola de caballo'] },
  { name: 'Cúrcuma', sci: 'Curcuma longa', kind: 'raiz', note: 'Raíz dorada que da color y calidez a infusiones.', match: ['cúrcuma'] },
  { name: 'Jengibre', sci: 'Zingiber officinale', kind: 'raiz', note: 'Rizoma picante, compañero de las bebidas calientes en temporada fría.', match: ['jengibre'] },
  { name: 'Juanilama', sci: 'Lippia alba', kind: 'hoja', note: 'Hierba aromática muy costarricense, de infusión cotidiana.', match: ['juanilama'] },
  { name: 'Cardo mariano', sci: 'Silybum marianum', kind: 'cardo', note: 'Planta de flor espinosa que acompaña el bienestar digestivo.', match: ['cardo'] },
  { name: 'Nopal', sci: 'Opuntia ficus-indica', kind: 'nopal', note: 'Cactus de pencas verdes, aliado de una alimentación balanceada.', match: ['nopal'] },
];

const PASOS = [
  { t: 'Selección en origen', d: 'Elegimos las plantas por especie, parte usada y temporada de cosecha.', v: '[PROVEEDORES Y ORIGEN DE LA MATERIA PRIMA]' },
  { t: 'Recepción y control', d: 'Cada lote de materia prima se identifica, se revisa y se registra antes de entrar a producción.', v: '[PRUEBAS QUE SE REALIZAN AL RECIBIR]' },
  { t: 'Formulación', d: 'Fórmulas propias desarrolladas desde 2005 combinan plantas, vitaminas y bases de calidad.', v: '[RESPONSABLE TÉCNICO / REGENTE]' },
  { t: 'Elaboración', d: 'Ungüentos, cápsulas, tés, cremas y más se elaboran en Barva de Heredia.', v: '[VALIDAR UBICACIÓN DE LA PLANTA]' },
  { t: 'Control de calidad', d: 'Cada lote se revisa antes de liberarse y queda trazado con número de lote y fecha de vencimiento.', v: '[CERTIFICACIÓN BPM]' },
  { t: 'Envasado y etiquetado', d: 'Etiquetas claras con ingredientes, modo de uso y número de registro sanitario.', v: '[N.º REGISTRO SANITARIO]' },
  { t: 'Hasta tus manos', d: 'Distribución a farmacias, supermercados y tiendas naturistas, y venta en línea.', v: '[VALIDAR CANALES Y COBERTURA]' },
];

/* --------------------------------------------------------------------------
   2. Utilidades
   -------------------------------------------------------------------------- */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const priceNum = (p: string | null) => (p ? parseFloat(p.replace(/[₡,]/g, '')) : 0);
const money = (n: number) => '₡' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const priceHTML = (p: Product) => (p.price ? esc(p.price) : '<span class="ph">[PRECIO]</span>');
const ph = (s: string) => s.replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');

const mem: Record<string, any> = {};
const store = {
  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : (k in mem ? mem[k] : d); } catch { return k in mem ? mem[k] : d; } },
  set(k: string, v: any) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
};
const session = {
  get(k: string) { try { return sessionStorage.getItem(k); } catch { return mem['s_' + k] || null; } },
  set(k: string, v: string) { mem['s_' + k] = v; try { sessionStorage.setItem(k, v); } catch { /* */ } },
};

function download(name: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* --------------------------------------------------------------------------
   3. Íconos y gráficos de marca (SVG)
   -------------------------------------------------------------------------- */
const I = (d: string, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const IC = {
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: I('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  cart: I('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>'),
  close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  minus: I('<path d="M5 12h14"/>'),
  search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  leaf: I('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  download: I('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  copy: I('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
  phone: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: I('<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
  check: I('<path d="m5 12 5 5 9-10"/>'),
  menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  gift: I('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3 8 4s0 4 4 4zM12 8s1.5-5 4-4 0 4-4 4z"/>'),
  flask: I('<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>'),
  shield: I('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
  users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>'),
  play: I('<path d="M7 5v14l11-7z"/>'),
  pause: I('<path d="M8 5v14M16 5v14"/>'),
  trash: I('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  ext: I('<path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
};

/** Emblema provisional armado con los motivos del logo (sol, cielo, colinas y árbol).
 *  Se reemplaza solo cuando existe assets/logo-herbarium.(png|svg|webp). */
function emblem(size = 44) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2; const x1 = 32 + Math.cos(a) * 11, y1 = 22 + Math.sin(a) * 11, x2 = 32 + Math.cos(a) * 16, y2 = 22 + Math.sin(a) * 16;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join('');
  return `<svg class="emblem" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="emb-c"><circle cx="32" cy="32" r="30"/></clipPath></defs>
  <g clip-path="url(#emb-c)"><rect width="64" height="64" fill="#DAEAF2"/><circle cx="32" cy="22" r="8" fill="#E7E401"/><g stroke="#D5C835" stroke-width="2.2" stroke-linecap="round">${rays}</g>
  <path d="M-2 46 Q16 34 34 42 T66 38 V66 H-2z" fill="#8EB24F"/><path d="M-2 50 Q18 42 36 48 T66 46 V66 H-2z" fill="#E7E401"/><path d="M-2 54 Q20 47 38 53 T66 52 V66 H-2z" fill="#248D3F"/><path d="M-2 59 Q22 54 40 58 T66 58 V66 H-2z" fill="#D5C835"/>
  <path d="M31 50 v-12" stroke="#403C31" stroke-width="2.6" stroke-linecap="round"/><circle cx="31" cy="34" r="6.5" fill="#248D3F"/><circle cx="26" cy="37" r="4.5" fill="#248D3F"/><circle cx="36" cy="37" r="4.5" fill="#1d7a35"/></g>
  <circle cx="32" cy="32" r="30" fill="none" stroke="#248D3F" stroke-width="2.5"/></svg>`;
}
function logo(where: 'header' | 'footer') {
  const fallback = `<span class="logo-fb">${emblem(where === 'header' ? 42 : 56)}<span class="wordmark"><b>Herbarium</b><small>Productos naturales · Costa Rica</small></span></span>`;
  const src = ASSETS.logo || 'assets/logo-herbarium.png';
  return `<span class="logo logo-${where}" title="${ASSETS.logo ? 'Herbarium' : '[LOGO OFICIAL] Si no carga, colocá el archivo en assets/logo-herbarium.png'}"><img class="logo-img" src="${src}" alt="Herbarium" data-fb="logo">${fallback}</span>`;
}

const LEAF_TEX = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" fill="none" stroke="#0E2F3B" stroke-width="1.1" stroke-linecap="round"><path d="M30 70c10-30 40-40 60-38-4 26-26 46-60 38z"/><path d="M30 70 78 40"/><path d="M45 61l6-14M58 53l5-12M70 46l3-9"/><path d="M150 40c0 18 10 30 24 34"/><path d="M152 52c-8-2-14 2-16 8 8 2 14-2 16-8zM158 62c8-4 15-1 18 5-8 4-15 1-18-5z"/><circle cx="172" cy="150" r="5"/><g transform="translate(172 150)"><path d="M0-6v-8M0 6v8M-6 0h-8M6 0h8M-4-4l-6-6M4 4l6 6M-4 4l-6 6M4-4l6-6"/></g><path d="M40 180c14-20 30-26 44-24-2 14-18 28-44 24z"/><path d="M40 180 70 164"/><path d="M110 120c4 12 4 24 0 36M110 130c-8-2-12-8-12-14 8 0 12 6 12 14zM110 142c8-2 12-8 12-14-8 0-12 6-12 14z"/></svg>`);
const GRAIN = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.25 0 0 0 0 0.23 0 0 0 0 0.19 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`);
const HILLS_SVG = (op = 1, base = '') => `<svg class="hills-svg" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true" style="opacity:${op}">
  <path d="M0 120 C 220 40 420 60 640 110 S 1080 150 1440 70 V260 H0z" fill="#8EB24F"/>
  <path d="M0 150 C 260 90 480 110 720 150 S 1160 170 1440 120 V260 H0z" fill="#E7E401"/>
  <path d="M0 175 C 300 130 520 150 760 180 S 1180 190 1440 160 V260 H0z" fill="#248D3F"/>
  <path d="M0 205 C 320 170 560 185 800 210 S 1200 215 1440 195 V260 H0z" fill="#D5C835"/>
  <path d="M0 230 C 340 205 600 215 840 235 S 1220 238 1440 225 V260 H0z" fill="#248D3F"/>${base ? `<path d="M0 246 C 360 232 640 238 900 250 S 1240 250 1440 242 V260 H0z" fill="${base}"/>` : ''}</svg>`;

/** Ilustración botánica paramétrica para las tarjetas de ingredientes. */
function plantSVG(ing: Ingredient) {
  const k = ing.kind; let g = '';
  const stem = '<path d="M60 150 C 58 120 62 95 60 60" stroke="#248D3F" stroke-width="3" fill="none"/>';
  if (k === 'flor') {
    const petals = Array.from({ length: 14 }, (_, i) => `<ellipse cx="60" cy="38" rx="5" ry="15" transform="rotate(${i * (360 / 14)} 60 52) translate(0 -2)" fill="${ing.petal}" stroke="#D5C835" stroke-width=".6"/>`).join('');
    g = `${stem}<path d="M60 115 C 40 105 32 92 36 84 C 48 88 58 100 60 115z" fill="#8EB24F"/><path d="M61 98 C 80 90 88 78 84 70 C 72 74 62 86 61 98z" fill="#248D3F"/>${petals}<circle cx="60" cy="52" r="9" fill="#E7E401" stroke="#D5C835" stroke-width="2"/>`;
  } else if (k === 'rama') {
    const nd = Array.from({ length: 16 }, (_, i) => { const y = 140 - i * 6; const s = i % 2 ? 1 : -1; return `<path d="M60 ${y} q ${s * 16} -4 ${s * 22} -12" stroke="${i % 3 ? '#248D3F' : '#8EB24F'}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`; }).join('');
    g = `<path d="M60 150 C 60 110 58 70 62 40" stroke="#403C31" stroke-width="2.5" fill="none"/>${nd}`;
  } else if (k === 'hoja') {
    const leaf = (x: number, y: number, r: number, c: string) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C -14 -10 -16 -34 0 -50 C 16 -34 14 -10 0 0z" fill="${c}"/><path d="M0 -2 V -46" stroke="#DAEAF2" stroke-width="1.2" opacity=".7"/></g>`;
    g = `${stem}${leaf(60, 120, -50, '#8EB24F')}${leaf(60, 104, 48, '#248D3F')}${leaf(60, 84, -38, '#248D3F')}${leaf(60, 66, 30, '#8EB24F')}${leaf(60, 58, 0, '#248D3F')}`;
  } else if (k === 'raiz') {
    g = `<path d="M60 70 C 56 50 64 32 60 18" stroke="#248D3F" stroke-width="3" fill="none"/><path d="M60 40 C 46 30 44 16 48 10 C 58 18 62 30 60 40z" fill="#8EB24F"/><path d="M61 30 C 74 22 78 10 74 4 C 64 10 60 22 61 30z" fill="#248D3F"/>
    <path d="M34 92 C 30 72 50 66 60 74 C 72 64 94 70 90 90 C 100 98 96 118 80 116 C 74 132 50 132 44 118 C 26 120 22 100 34 92z" fill="#D5C835" stroke="#403C31" stroke-width="2"/><path d="M44 96 q 6 4 12 0 M62 104 q 6 4 12 0 M52 114 q 6 3 10 0" stroke="#403C31" stroke-width="1.5" fill="none"/>`;
  } else if (k === 'cola') {
    const segs = Array.from({ length: 9 }, (_, i) => { const y = 145 - i * 12; const w = 26 - i * 2; return `<path d="M60 ${y} l ${-w} -14 M60 ${y} l ${w} -14" stroke="#8EB24F" stroke-width="2" fill="none"/><rect x="57" y="${y - 12}" width="6" height="12" rx="2" fill="#248D3F"/><rect x="56" y="${y - 2}" width="8" height="2.5" fill="#403C31"/>`; }).join('');
    g = segs;
  } else if (k === 'cardo') {
    const sp = Array.from({ length: 18 }, (_, i) => `<line x1="60" y1="46" x2="${(60 + Math.cos(i / 18 * Math.PI * 2) * 22).toFixed(1)}" y2="${(46 + Math.sin(i / 18 * Math.PI * 2) * 16 - 8).toFixed(1)}" stroke="#D5C835" stroke-width="2"/>`).join('');
    g = `${stem}<path d="M60 120 C 36 112 30 96 40 92 L 46 100 L 48 90 L 56 104z" fill="#8EB24F"/><path d="M61 100 C 84 92 90 78 80 74 L 76 82 L 72 72 L 64 86z" fill="#248D3F"/>${sp}<ellipse cx="60" cy="56" rx="14" ry="12" fill="#248D3F"/><path d="M48 52 l6 6 6-6 6 6 6-6" stroke="#E7E401" stroke-width="1.6" fill="none"/>`;
  } else {
    g = `<ellipse cx="60" cy="118" rx="26" ry="32" fill="#248D3F"/><ellipse cx="38" cy="70" rx="17" ry="22" transform="rotate(-25 38 70)" fill="#8EB24F"/><ellipse cx="82" cy="66" rx="16" ry="21" transform="rotate(22 82 66)" fill="#248D3F"/><circle cx="82" cy="40" r="7" fill="#E7E401"/>
    ${[[52, 104], [68, 112], [58, 128], [44, 122], [74, 96], [36, 66], [42, 78], [86, 60], [78, 74]].map(([x, y]) => `<g stroke="#DAEAF2" stroke-width="1.2"><line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y - 4}"/><line x1="${x}" y1="${y}" x2="${x + 4}" y2="${y - 4}"/></g>`).join('')}`;
  }
  return `<svg class="plant" viewBox="0 0 120 160" aria-hidden="true">${g}</svg>`;
}

/* --------------------------------------------------------------------------
   4. Empaques 3D (CSS) — se usan mientras no esté la foto real del producto
   -------------------------------------------------------------------------- */
function shortName(n: string) {
  return n.replace(/^(Ungüento|Cápsulas|Herba-Té|Té|Shampoo|Sebo Cubano|Jarabe|Crema|Full Protein|Fibra)\s+/i, '').replace(/\s+\d+\s*(uds|g)$/i, '');
}
function packHTML(p: Product, size: 'sm' | 'md' | 'lg' = 'md') {
  const c = CAT[p.cat]; const t = p.pack || c.pack;
  return `<div class="pack pack-${t} pack-${size}" style="--pc:${c.color};--pa:${c.accent}" aria-hidden="true">
    <div class="pk-cap"></div><div class="pk-body"><div class="pk-label"><span class="pk-brand">${emblem(18)} Herbarium</span><span class="pk-name">${esc(shortName(p.name))}</span><span class="pk-cat">${esc(c.name)}</span></div></div><div class="pk-floor"></div></div>`;
}
function photoSrc(p: Product) { return (ASSETS.productos && ASSETS.productos[p.slug]) || FOTOS_PRODUCTO[p.slug] || ''; }
function media(p: Product, size: 'sm' | 'md' | 'lg' = 'md') {
  const src = photoSrc(p);
  if (src) return `<img class="pimg" src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" data-fb="pack" data-slug="${p.slug}" data-size="${size}">`;
  return `${packHTML(p, size)}<span class="photo-tag" title="Reemplazar por la foto real del producto">[FOTO REAL]</span>`;
}

/* --------------------------------------------------------------------------
   5. Estado: carrito, modo de portada, usuarios
   -------------------------------------------------------------------------- */
type CartItem = { slug: string; qty: number };
let cart: CartItem[] = store.get('herb_cart', []).filter((i: CartItem) => BY_SLUG[i.slug]);
let mode: 'bienestar' | 'marca' = store.get('herb_mode', 'bienestar');
interface User { id: string; nombre: string; correo: string; telefono: string; interes: string; codigo: string; fecha: string; origen: string }
const users = () => store.get<User[]>('herb_users', []);

function saveCart() { store.set('herb_cart', cart); updateCartBadge(); }
function cartCount() { return cart.reduce((a, i) => a + i.qty, 0); }
function addToCart(slug: string, qty = 1) {
  const it = cart.find(i => i.slug === slug); if (it) it.qty += qty; else cart.push({ slug, qty });
  saveCart(); const b = $('.cart-btn'); if (b) { b.classList.remove('bump'); void (b as HTMLElement).offsetWidth; b.classList.add('bump'); }
  toast(`${IC.check}<span>Agregaste <b>${esc(BY_SLUG[slug].name)}</b></span><a href="#/carrito" class="toast-link">Ver carrito ${IC.arrow}</a>`);
}
function updateCartBadge() { $$('.cart-count').forEach(e => { e.textContent = String(cartCount()); e.classList.toggle('on', cartCount() > 0); }); }

function newCode(): string {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const taken = new Set(users().map(u => u.codigo));
  for (;;) {
    const r = new Uint32Array(6); (window.crypto || (window as any).msCrypto).getRandomValues(r);
    const s = Array.from(r, x => A[x % A.length]).join('');
    const code = `HERB-${s.slice(0, 4)}-${s.slice(4)}`;
    if (!taken.has(code)) return code;
  }
}

/* --------------------------------------------------------------------------
   6. Estilos
   -------------------------------------------------------------------------- */
const STYLES = `
:root{--verde:#248D3F;--verde-d:#1b6e31;--sol:#E7E401;--dorado:#D5C835;--campo:#8EB24F;--petroleo:#0E2F3B;--tierra:#403C31;--cielo:#DAEAF2;
--papel:#F3F6EC;--tinta:#10272F;--muted:#55665d;--line:rgba(14,47,59,.12);--glass:rgba(255,255,255,.68);
--r:24px;--ease:cubic-bezier(.2,.8,.2,1);--spring:cubic-bezier(.34,1.56,.64,1);
--display:'Fraunces',Georgia,'Times New Roman',serif;--sans:'Manrope',system-ui,-apple-system,'Segoe UI',sans-serif;
--shadow:0 1px 0 rgba(255,255,255,.9) inset,0 30px 60px -32px rgba(14,47,59,.45),0 8px 18px -12px rgba(14,47,59,.25)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--papel);color:var(--tinta);font:16px/1.6 var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}
img{max-width:100%}
button,input,select,textarea{font:inherit;color:inherit}
::selection{background:var(--sol);color:var(--petroleo)}
.wrap{width:min(1240px,100% - 32px);margin-inline:auto}
.ph{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.82em;letter-spacing:-.01em;background:rgba(231,228,1,.38);color:var(--tierra);border:1px dashed rgba(64,60,49,.45);padding:.05em .4em;border-radius:6px;white-space:normal}
.dark .ph{background:rgba(231,228,1,.16);color:var(--sol);border-color:rgba(231,228,1,.45)}
.badge-val{display:inline-flex;align-items:center;gap:6px;font:600 11px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;padding:6px 10px;border-radius:999px;background:var(--sol);color:var(--petroleo)}
.ic{width:1.15em;height:1.15em;flex:none}
[hidden]{display:none!important}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

/* ---------- Fondos con motivos del logo ---------- */
.bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.bg-sky{position:absolute;inset:0;background:linear-gradient(180deg,var(--cielo) 0%,#e9f1e8 38%,var(--papel) 70%)}
.bg-sun{position:absolute;top:-38vmin;right:-26vmin;width:110vmin;aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle,rgba(231,228,1,.55) 0 9%,rgba(231,228,1,.18) 10% 16%,transparent 17%),repeating-conic-gradient(from 0deg,rgba(213,200,53,.22) 0 4deg,transparent 4deg 12deg);
  -webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%);animation:spin 160s linear infinite;will-change:transform}
.bg-hills{position:absolute;left:-5%;right:-5%;bottom:-2vh;height:30vh;opacity:.16;will-change:transform}
.hills-svg{width:100%;height:100%;display:block}
.bg-tex{position:absolute;inset:-10%;background-image:url("${LEAF_TEX}");background-size:260px;opacity:.07;transform:rotate(-4deg);will-change:transform}
.bg-grain{position:absolute;inset:0;background-image:url("${GRAIN}");opacity:.06}
#pollen{position:absolute;inset:0;width:100%;height:100%;will-change:contents}
@keyframes spin{to{transform:rotate(360deg)}}

/* ---------- Estructura ---------- */
.app{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column}
.topbar{background:var(--petroleo);color:#cfe0e6;font-size:12.5px}
.topbar .wrap{display:flex;gap:18px;align-items:center;justify-content:space-between;min-height:36px;flex-wrap:wrap}
.topbar a{text-decoration:none;opacity:.9}.topbar a:hover{opacity:1;color:var(--sol)}
.topbar .tb-l,.topbar .tb-r{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.topbar .dot{width:6px;height:6px;border-radius:50%;background:var(--sol);box-shadow:0 0 0 4px rgba(231,228,1,.18)}
header.site{position:sticky;top:0;z-index:40;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);background:rgba(243,246,236,.86);border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;align-items:center;gap:20px;min-height:74px}
.logo{display:inline-flex;align-items:center;text-decoration:none}
.logo-img{height:46px;width:auto;display:block}
.logo-footer .logo-img{height:64px}
.logo .logo-fb{display:none;align-items:center;gap:10px}
.logo.fb .logo-img{display:none}.logo.fb .logo-fb{display:inline-flex}
.wordmark{display:flex;flex-direction:column;line-height:1}
.wordmark b{font:600 24px/1 var(--display);letter-spacing:-.01em;color:var(--verde)}
.wordmark small{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:5px}
.logo-footer .wordmark b{color:#fff;font-size:30px}.logo-footer .wordmark small{color:#9fb8bf}
nav.main{position:relative;display:flex;gap:2px;margin-left:auto;align-items:center}
nav.main>a,nav.main .mm>a{position:relative;z-index:1;display:block;white-space:nowrap;text-decoration:none;font-weight:600;font-size:14px;padding:10px 12px;border-radius:999px;color:var(--petroleo);transition:color .3s}
nav.main a.active{color:#fff}
.nav-ind{position:absolute;z-index:0;top:0;height:100%;border-radius:999px;background:var(--verde);box-shadow:0 8px 20px -8px rgba(36,141,63,.8);transition:left .55s var(--spring),width .55s var(--spring),opacity .3s;opacity:0}
.mm{position:relative}
.mega{position:absolute;left:50%;top:calc(100% + 14px);transform:translate(-50%,8px);width:min(720px,90vw);padding:18px;border-radius:22px;background:rgba(255,255,255,.96);box-shadow:var(--shadow);border:1px solid var(--line);display:grid;grid-template-columns:repeat(5,1fr);gap:8px;opacity:0;visibility:hidden;transition:.3s var(--ease)}
.mega::before{content:"";position:absolute;inset:-16px 0 auto;height:16px}
.mm:hover .mega,.mm:focus-within .mega{opacity:1;visibility:visible;transform:translate(-50%,0)}
.mega a{display:flex;flex-direction:column;gap:2px;padding:12px;border-radius:14px;text-decoration:none;font-size:13px;font-weight:700;color:var(--petroleo)!important;background:linear-gradient(160deg,#fff,#f3f7ee)}
.mega a small{font-weight:500;color:var(--muted);font-size:11.5px}
.mega a:hover{background:var(--cielo)}
.mega .mega-all{grid-column:1/-1;flex-direction:row;justify-content:space-between;align-items:center;background:var(--petroleo);color:#fff!important}
.hdr-actions{display:flex;gap:8px;align-items:center}
.cart-btn{position:relative}
.cart-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--sol);color:var(--petroleo);font:800 11px/20px var(--sans);text-align:center;transform:scale(0);transition:transform .4s var(--spring)}
.cart-count.on{transform:scale(1)}
.cart-btn.bump{animation:bump .6s var(--spring)}
@keyframes bump{30%{transform:scale(1.18) rotate(-6deg)}60%{transform:scale(.95)}}
.btn.burger{display:none}
.crumbs{position:relative;z-index:2}
.crumbs .wrap{display:flex;align-items:center;gap:8px;min-height:44px;font-size:13px;color:var(--muted);flex-wrap:wrap}
.crumbs a{text-decoration:none;font-weight:600;color:var(--verde)}.crumbs a:hover{text-decoration:underline}
.crumbs .sep{opacity:.5}
.crumbs [aria-current]{color:var(--petroleo);font-weight:700}
.progress{position:fixed;left:0;top:0;height:3px;z-index:60;background:linear-gradient(90deg,var(--verde),var(--sol));transform-origin:0 50%;transform:scaleX(0);width:100%;will-change:transform}
main#view{flex:1;position:relative}

/* ---------- Botones ---------- */
.btn{--bg:var(--verde);--fg:#fff;position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:14px 22px;border-radius:999px;border:0;cursor:pointer;text-decoration:none;font-weight:700;font-size:15px;line-height:1.1;background:var(--bg);color:var(--fg);box-shadow:0 12px 26px -12px rgba(14,47,59,.55),inset 0 1px 0 rgba(255,255,255,.25);transition:transform .35s var(--spring),box-shadow .3s}
.btn::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.45) 50%,transparent 70%);transform:translateX(-120%);transition:transform .8s var(--ease)}
.btn:hover::after{transform:translateX(120%)}
.btn:hover{box-shadow:0 18px 34px -14px rgba(14,47,59,.65)}
.btn:active{transform:scale(.97)}
.btn .ic{transition:transform .35s var(--spring)}.btn:hover .ic:last-child{transform:translateX(3px)}
.btn-sun{--bg:var(--sol);--fg:var(--petroleo)}
.btn-dark{--bg:var(--petroleo);--fg:#fff}
.btn-ghost{--bg:rgba(255,255,255,.7);--fg:var(--petroleo);box-shadow:inset 0 0 0 1.5px rgba(14,47,59,.18)}
.dark .btn-ghost{--bg:rgba(255,255,255,.06);--fg:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.25)}
.btn-sm{padding:10px 15px;font-size:13.5px}
.btn-icon{padding:11px;border-radius:50%}
.btn[disabled]{opacity:.45;pointer-events:none}
.link{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--verde);text-decoration:none}
.link:hover .ic{transform:translateX(3px)}.link .ic{transition:transform .3s}
.dark .link{color:var(--sol)}

/* ---------- Tipografía ---------- */
.kicker{display:inline-flex;align-items:center;gap:8px;font:700 12px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--verde)}
.kicker::before{content:"";width:22px;height:2px;background:currentColor;border-radius:2px}
.dark .kicker{color:var(--sol)}
h1,h2,h3{font-family:var(--display);font-weight:500;letter-spacing:-.02em;margin:0;color:var(--petroleo)}
.dark h1,.dark h2,.dark h3{color:#fff}
h1{font-size:clamp(2.5rem,5.6vw,4.9rem);line-height:.98}
h2{font-size:clamp(2rem,4.2vw,3.4rem);line-height:1.02}
h3{font-size:clamp(1.25rem,2vw,1.6rem);line-height:1.15}
h1 em,h2 em{font-style:italic;color:var(--verde)}
.dark h1 em,.dark h2 em{color:var(--sol)}
.lead{font-size:clamp(1.02rem,1.4vw,1.2rem);color:var(--muted);max-width:60ch}
.dark .lead,.dark p{color:#c3d4d9}
.sec{padding:clamp(56px,8vw,110px) 0;position:relative}
.sec-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:36px;flex-wrap:wrap}
.sec-head>div{display:grid;gap:14px;max-width:760px}
.dark{background:var(--petroleo);color:#e4eef0;position:relative;overflow:hidden;isolation:isolate}
.dark::before{content:"";position:absolute;inset:-40%;z-index:-1;background:repeating-conic-gradient(from 0deg at 85% 0%,rgba(213,200,53,.09) 0 3deg,transparent 3deg 10deg);-webkit-mask:radial-gradient(circle at 85% 0%,#000,transparent 60%);mask:radial-gradient(circle at 85% 0%,#000,transparent 60%)}
.dark::after{content:"";position:absolute;inset:0;z-index:-1;background-image:url("${LEAF_TEX}");background-size:240px;opacity:.06;filter:invert(1)}
.panel{background:rgba(255,255,255,.84);border:1px solid rgba(255,255,255,.75);border-radius:var(--r);box-shadow:var(--shadow)}
.dark .panel{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.12);box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.round-top{border-radius:44px 44px 0 0}
.hills-edge{position:absolute;left:0;right:0;height:90px;pointer-events:none}
.hills-edge.top{top:-1px;transform:scaleY(-1)}

/* ---------- Transición entre vistas ---------- */
.wipe{position:fixed;inset:0;z-index:90;pointer-events:none;visibility:hidden;display:grid;place-items:center;overflow:hidden}
.wipe-disc{position:absolute;left:var(--x,50%);top:var(--y,50%);width:300vmax;height:300vmax;margin:-150vmax 0 0 -150vmax;border-radius:50%;background:radial-gradient(circle,#E7E401 0 1%,#248D3F 7%,#0E2F3B 32%);transform:scale(0);will-change:transform}
.wipe-inner{position:relative;opacity:0}
.wipe.on{visibility:visible;pointer-events:all}
.wipe-inner{display:grid;justify-items:center;gap:14px;color:#fff;text-align:center}
.wipe-sun{width:74px;height:74px;border-radius:50%;background:radial-gradient(circle,var(--sol) 0 38%,transparent 40%),repeating-conic-gradient(var(--dorado) 0 8deg,transparent 8deg 22deg);animation:spin 2.4s linear infinite}
.wipe-label{font:500 clamp(1.4rem,3vw,2.2rem)/1 var(--display);font-style:italic;letter-spacing:-.01em}
.wipe-path{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#cfe0e6}
.view-enter [data-r]{animation:rise .9s var(--ease) backwards;animation-delay:calc(var(--i,0) * 70ms + 60ms)}
@keyframes rise{from{opacity:0;transform:translate3d(0,28px,0) rotateX(8deg)}to{opacity:1;transform:none}}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.reveal.in{opacity:1;transform:none}

/* ---------- Portada ---------- */
.hero{position:relative;min-height:min(86vh,820px);display:flex;align-items:center;overflow:hidden;border-radius:0 0 48px 48px;isolation:isolate;transition:background 1s var(--ease)}
.hero::before{content:"";position:absolute;inset:0;z-index:-2;background:linear-gradient(180deg,#cfe4ee 0%,var(--cielo) 40%,#eef4e4 100%);transition:opacity 1s}
.hero::after{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(120% 90% at 80% 10%,#174456 0%,var(--petroleo) 55%,#081c24 100%);opacity:0;transition:opacity 1s var(--ease)}
.hero.marca::after{opacity:1}
.hero-stage{position:absolute;inset:0;z-index:-1}
.hero-stage canvas{display:block;width:100%!important;height:100%!important}
.hero-fade{position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(90deg,rgba(243,246,236,.92) 0%,rgba(243,246,236,.6) 34%,transparent 62%);transition:opacity 1s}
.hero.marca .hero-fade{background:linear-gradient(90deg,rgba(8,28,36,.9) 0%,rgba(8,28,36,.55) 36%,transparent 64%)}
.hero .wrap{position:relative;padding:72px 0 120px}
.hero-copy{max-width:640px;display:grid;gap:22px}
.hero.marca h1,.hero.marca .lead{color:#fff}.hero.marca h1 em{color:var(--sol)}.hero.marca .lead{color:#c8d9de}.hero.marca .kicker{color:var(--sol)}
.switch{position:relative;display:inline-grid;grid-template-columns:1fr 1fr;padding:5px;border-radius:999px;background:rgba(255,255,255,.65);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(14,47,59,.5);width:max-content;max-width:100%}
.switch button{position:relative;z-index:1;border:0;background:none;cursor:pointer;padding:11px 20px;border-radius:999px;font-weight:700;font-size:14px;color:var(--petroleo);transition:color .4s;white-space:nowrap}
.switch button.on{color:#fff}
.switch .knob{position:absolute;z-index:0;top:5px;bottom:5px;left:5px;width:calc(50% - 5px);border-radius:999px;background:var(--verde);transition:transform .6s var(--spring),background .6s}
.switch.marca .knob{transform:translateX(100%);background:var(--petroleo)}
.hero.marca .switch{background:rgba(255,255,255,.1);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}
.hero.marca .switch button{color:#fff}.hero.marca .switch .knob{background:var(--sol)}.hero.marca .switch button.on{color:var(--petroleo)}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.swap{display:grid}.swap>*{grid-area:1/1;transition:opacity .6s var(--ease),transform .6s var(--ease)}
.swap>[data-mode]{opacity:0;transform:translateY(14px);pointer-events:none}
.hero[data-m="bienestar"] .swap>[data-mode="bienestar"],.hero[data-m="marca"] .swap>[data-mode="marca"]{opacity:1;transform:none;pointer-events:auto}
.trust{display:flex;gap:10px;flex-wrap:wrap}
.trust span{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.7);box-shadow:inset 0 0 0 1px var(--line);color:var(--petroleo)}
.hero.marca .trust span{background:rgba(255,255,255,.08);color:#e3eef1;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}
.hero-hint{position:absolute;right:24px;bottom:28px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--petroleo);display:flex;gap:8px;align-items:center;padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.78)}
.hero.marca .hero-hint{color:#fff;background:rgba(255,255,255,.08)}
.no3d .hero-stage{background:radial-gradient(circle at 76% 26%,var(--sol) 0 7%,rgba(231,228,1,.3) 8% 14%,transparent 15%),repeating-conic-gradient(from 0deg at 76% 26%,rgba(213,200,53,.25) 0 4deg,transparent 4deg 12deg)}
.no3d .hero-stage::after{content:"";position:absolute;left:0;right:0;bottom:0;height:46%;background:url("data:image/svg+xml,${encodeURIComponent(HILLS_SVG().replace('class="hills-svg"', 'xmlns="http://www.w3.org/2000/svg"'))}") center bottom/100% 100% no-repeat}

/* ---------- Mapa (bento) ---------- */
.bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(150px,auto);gap:16px;grid-auto-flow:dense;perspective:1400px}
.tile{position:relative;overflow:hidden;border-radius:28px;padding:26px;text-decoration:none;color:var(--petroleo);display:flex;flex-direction:column;justify-content:space-between;gap:16px;min-height:150px;
  background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(255,255,255,.62));border:1px solid rgba(255,255,255,.8);box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .5s var(--ease),box-shadow .5s;isolation:isolate}
.tile:hover{box-shadow:0 1px 0 #fff inset,0 50px 80px -40px rgba(14,47,59,.55)}
.tile h3{font-size:clamp(1.3rem,2.2vw,2rem)}
.tile p{margin:0;color:var(--muted);font-size:14.5px;max-width:42ch}
.tile .t-cta{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:13.5px;color:var(--verde)}
.tile .t-art{position:absolute;inset:0;z-index:-1;transform:translateZ(-1px);transition:transform .8s var(--ease)}
.tile:hover .t-art{transform:scale(1.06)}
.tile .t-num{position:absolute;top:18px;right:22px;font:500 13px/1 var(--display);font-style:italic;color:var(--muted)}
.tile.dk{background:var(--petroleo);color:#fff;border-color:rgba(255,255,255,.1)}.tile.dk h3{color:#fff}.tile.dk p{color:#b9ccd2}.tile.dk .t-cta{color:var(--sol)}
.tile.gr{background:linear-gradient(160deg,var(--verde),#1a6c2f);color:#fff}.tile.gr h3{color:#fff}.tile.gr p{color:#d6efd9}.tile.gr .t-cta{color:var(--sol)}
.tile.sn{background:linear-gradient(160deg,#f3f17a,var(--sol));}.tile.sn p{color:#4d4a2a}.tile.sn .t-cta{color:var(--petroleo)}
.s3x3{grid-column:span 3;grid-row:span 3}.s3x2{grid-column:span 3;grid-row:span 2}.s2x2{grid-column:span 2;grid-row:span 2}.s2x1{grid-column:span 2}.s1x2{grid-column:span 1;grid-row:span 2}.s3x1{grid-column:span 3}.s4x1{grid-column:span 4}.s1x1{grid-column:span 1}.s6x1{grid-column:1/-1}
.t-cats{display:flex;flex-wrap:wrap;gap:6px}
.t-cats a{font-size:12.5px;font-weight:700;padding:7px 11px;border-radius:999px;background:rgba(255,255,255,.85);text-decoration:none;color:var(--petroleo);box-shadow:inset 0 0 0 1px var(--line);transition:.25s}
.t-cats a:hover{background:var(--verde);color:#fff}
.art-sun{background:radial-gradient(circle at 88% 12%,var(--sol) 0 8%,transparent 8.5%),repeating-conic-gradient(from 0deg at 88% 12%,rgba(213,200,53,.35) 0 4deg,transparent 4deg 13deg)}
.art-hills{background:linear-gradient(transparent 55%,transparent),url("data:image/svg+xml,${encodeURIComponent(HILLS_SVG().replace('class="hills-svg"', 'xmlns="http://www.w3.org/2000/svg"'))}") center bottom/140% 45% no-repeat}
.art-leaf{background-image:url("${LEAF_TEX}");background-size:200px;opacity:.14}
.t-packs{position:absolute;right:-10px;bottom:30px;display:flex;align-items:flex-end;gap:0;transform:translateZ(40px)}
.t-packs .pack{margin-left:-16px}

/* ---------- Esencia (historia, misión, visión) ---------- */
.essence{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:18px}
.ess{padding:30px;display:grid;gap:14px;align-content:start;position:relative;overflow:hidden}
.ess h3{display:flex;align-items:center;gap:10px}
.ess p{margin:0}
.ess .yr{font:500 clamp(3.4rem,7vw,5.4rem)/.9 var(--display);color:var(--sol);font-style:italic;letter-spacing:-.04em}
.ess .ic-big{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:rgba(231,228,1,.14);color:var(--sol)}

/* ---------- Categorías ---------- */
.cat-strip{display:grid;grid-template-columns:repeat(10,minmax(108px,1fr));gap:12px;overflow-x:auto;padding:6px 2px 18px;scroll-snap-type:x mandatory}
.cat-orb{scroll-snap-align:start;display:grid;justify-items:center;gap:10px;text-decoration:none;color:var(--petroleo);padding:18px 10px;border-radius:24px;background:rgba(255,255,255,.6);box-shadow:inset 0 0 0 1px rgba(255,255,255,.8);transition:transform .45s var(--spring),background .3s}
.cat-orb:hover{transform:translateY(-6px);background:#fff}
.cat-orb .orb{width:78px;height:78px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.7),transparent 45%),var(--c);box-shadow:inset -8px -10px 20px rgba(0,0,0,.18),0 14px 24px -12px var(--c);position:relative}
.cat-orb .orb .pack{transform:scale(.42);margin-top:-6px}
.cat-orb b{font-size:14px}.cat-orb small{color:var(--muted);font-size:11.5px;margin-top:-8px}
.cat-orb .n{font:500 12px/1 var(--display);font-style:italic;color:var(--muted)}

/* ---------- Tarjetas de producto ---------- */
.grid-p{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}
.pcard{position:relative;contain:paint;display:flex;flex-direction:column;border-radius:26px;background:linear-gradient(170deg,#fff,rgba(255,255,255,.7));border:1px solid rgba(255,255,255,.9);box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .5s var(--ease),box-shadow .4s;overflow:hidden}
.pcard .pm{position:relative;height:220px;display:grid;place-items:center;background:radial-gradient(circle at 50% 120%,color-mix(in srgb,var(--pc) 28%,transparent),transparent 60%),linear-gradient(180deg,var(--cielo),#f7faf2);overflow:hidden;cursor:pointer;text-decoration:none}
.pcard .pm::before{content:"";position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 118%,rgba(213,200,53,.18) 0 3deg,transparent 3deg 11deg);opacity:0;transition:opacity .6s}
.pcard:hover .pm::before{opacity:1}
.pcard .pm>*{transition:transform .7s var(--ease)}
.pcard:hover .pm .pack,.pcard:hover .pm .pimg{transform:translateY(-8px) scale(1.05) rotate(-2deg)}
.pcard .pb{padding:18px 18px 20px;display:grid;gap:8px;flex:1}
.pcard .pc{font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--verde);text-decoration:none}
.pcard h3{font:600 17px/1.25 var(--sans);letter-spacing:-.01em}
.pcard .pr{font:600 20px/1 var(--display);color:var(--petroleo)}
.pcard .pa{display:flex;gap:8px;margin-top:auto;padding-top:6px;flex-wrap:wrap}
.pcard .pa .btn{flex:1;padding:11px 12px;font-size:13px}
.pimg{max-height:88%;max-width:80%;object-fit:contain;filter:drop-shadow(0 18px 20px rgba(14,47,59,.3))}
.photo-tag{position:absolute;left:12px;top:12px;font:700 10px/1 ui-monospace,Menlo,monospace;padding:5px 7px;border-radius:6px;background:rgba(231,228,1,.85);color:var(--tierra)}
.shine{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.4),transparent 40%);opacity:0;transition:opacity .3s;z-index:3}
[data-tilt]:hover .shine{opacity:1}

/* ---------- Empaques CSS ---------- */
.pack{position:relative;display:flex;flex-direction:column;align-items:center;--w:96px;--h:130px;transform-style:preserve-3d}
.pack-sm{--k:.62}.pack-md{--k:1}.pack-lg{--k:1.9}
.pk-body{position:relative;width:calc(var(--w) * var(--k));height:calc(var(--h) * var(--k));border-radius:calc(14px * var(--k));
  background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(255,255,255,.18) 22%,rgba(255,255,255,.04) 40%,rgba(0,0,0,.1) 75%,rgba(0,0,0,.35)),var(--pc);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.3),0 calc(18px * var(--k)) calc(26px * var(--k)) calc(-10px * var(--k)) rgba(14,47,59,.5);display:grid;place-items:center}
.pk-cap{width:calc(var(--w) * .62 * var(--k));height:calc(18px * var(--k));border-radius:calc(6px * var(--k)) calc(6px * var(--k)) 2px 2px;margin-bottom:-2px;background:linear-gradient(90deg,#8d8530,var(--dorado) 30%,#f2ec9a 45%,var(--dorado) 60%,#7e7628)}
.pk-label{width:84%;padding:calc(8px * var(--k)) calc(6px * var(--k));border-radius:calc(6px * var(--k));background:linear-gradient(180deg,#fff,#f3f6ea);display:grid;gap:calc(3px * var(--k));justify-items:center;text-align:center;box-shadow:0 1px 0 rgba(0,0,0,.08)}
.pk-brand{display:flex;align-items:center;gap:3px;font:700 calc(7px * var(--k))/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--verde)}
.pk-brand .emblem{width:calc(12px * var(--k));height:calc(12px * var(--k))}
.pk-name{font:600 calc(10.5px * var(--k))/1.05 var(--display);color:var(--petroleo);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.pk-cat{font:800 calc(6px * var(--k))/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#fff;background:var(--pc);padding:calc(3px * var(--k)) calc(5px * var(--k));border-radius:99px}
.pk-floor{width:calc(var(--w) * 1.1 * var(--k));height:calc(12px * var(--k));border-radius:50%;background:radial-gradient(rgba(14,47,59,.35),transparent 70%);margin-top:calc(4px * var(--k))}
.pack-jar{--w:120px;--h:84px}.pack-jar .pk-cap{width:calc(126px * var(--k));height:calc(22px * var(--k));border-radius:calc(8px * var(--k))}
.pack-tin{--w:128px;--h:46px}.pack-tin .pk-cap{width:calc(134px * var(--k));height:calc(16px * var(--k));border-radius:calc(30px * var(--k)) calc(30px * var(--k)) 4px 4px}.pack-tin .pk-name{-webkit-line-clamp:1}.pack-tin .pk-label{padding:calc(4px*var(--k))}.pack-tin .pk-cat{display:none}
.pack-bottle{--w:84px;--h:132px}.pack-bottle .pk-body{border-radius:calc(18px * var(--k)) calc(18px * var(--k)) calc(12px * var(--k)) calc(12px * var(--k))}
.pack-syrup{--w:74px;--h:150px}.pack-syrup .pk-body{border-radius:calc(28px * var(--k)) calc(28px * var(--k)) calc(10px * var(--k)) calc(10px * var(--k))}.pack-syrup .pk-cap{width:calc(30px * var(--k));height:calc(24px * var(--k))}
.pack-pump{--w:78px;--h:150px}.pack-pump .pk-cap{width:calc(26px * var(--k));height:calc(30px * var(--k));border-radius:4px;box-shadow:calc(14px * var(--k)) calc(-10px * var(--k)) 0 calc(-6px * var(--k)) #d6d6d6}
.pack-tube{--w:76px;--h:150px}.pack-tube .pk-body{border-radius:calc(4px * var(--k)) calc(4px * var(--k)) calc(26px * var(--k)) calc(26px * var(--k));background:linear-gradient(90deg,rgba(0,0,0,.12),rgba(255,255,255,.7) 25%,rgba(255,255,255,.2) 50%,rgba(0,0,0,.18)),#f6f9f1}.pack-tube .pk-cap{order:3;width:calc(40px * var(--k));border-radius:2px 2px 8px 8px;margin:-2px 0 0}.pack-tube .pk-floor{order:4}
.pack-pouch{--w:104px;--h:132px}.pack-pouch .pk-cap{width:calc(104px * var(--k));height:calc(10px * var(--k));border-radius:3px;background:repeating-linear-gradient(90deg,var(--pc) 0 4px,color-mix(in srgb,var(--pc) 70%,#000) 4px 6px)}.pack-pouch .pk-body{border-radius:calc(6px * var(--k)) calc(6px * var(--k)) calc(18px * var(--k)) calc(18px * var(--k))}
.pack-box{--w:110px;--h:110px}.pack-box .pk-cap{display:none}.pack-box .pk-body{border-radius:calc(6px * var(--k));background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%),linear-gradient(90deg,rgba(0,0,0,.25),transparent 12%,transparent 88%,rgba(0,0,0,.25)),var(--pc)}
.pack-tub{--w:118px;--h:126px}.pack-tub .pk-cap{width:calc(124px * var(--k));height:calc(20px * var(--k));background:linear-gradient(90deg,#0a2129,#2a5262 40%,#0a2129)}

/* ---------- Catálogo ---------- */
.cat-layout{display:grid;grid-template-columns:260px 1fr;gap:28px;align-items:start}
.side{position:sticky;top:96px;padding:14px;display:grid;gap:4px}
.side h4{margin:6px 10px 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.side a{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:14px;text-decoration:none;font-weight:700;font-size:14px;color:var(--petroleo);transition:.25s}
.side a small{font-weight:600;color:var(--muted)}
.side a:hover{background:rgba(255,255,255,.8)}
.side a.on{background:var(--verde);color:#fff}.side a.on small{color:#d6efd9}
.cat-hero{position:relative;overflow:hidden;border-radius:34px;padding:clamp(28px,4vw,48px);display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:center;background:linear-gradient(135deg,var(--c),color-mix(in srgb,var(--c) 70%,#000));color:#fff;margin-bottom:26px;isolation:isolate}
.cat-hero h1{color:#fff;font-size:clamp(2.6rem,6vw,4.6rem)}
.cat-hero p{color:rgba(255,255,255,.86);max-width:52ch;margin:0}
.cat-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:repeating-conic-gradient(from 0deg at 92% 8%,rgba(231,228,1,.16) 0 3deg,transparent 3deg 11deg)}
.cat-hero .hills-svg{position:absolute;left:0;right:0;bottom:-2px;height:80px;z-index:-1;opacity:.35}
.cat-hero .packs{display:flex;justify-content:center;align-items:flex-end;gap:0;perspective:800px}
.cat-hero .packs .pack{margin:0 -12px;animation:floaty 6s ease-in-out infinite}
.cat-hero .packs .pack:nth-child(2){animation-delay:-2s;z-index:2}.cat-hero .packs .pack:nth-child(3){animation-delay:-4s}
@keyframes floaty{50%{transform:translateY(-12px) rotate(2deg)}}
.toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap}
.search{display:flex;align-items:center;gap:10px;padding:0 16px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);min-width:min(360px,100%)}
.search input{border:0;outline:0;background:none;padding:13px 0;width:100%}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{padding:9px 14px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none;background:rgba(255,255,255,.75);box-shadow:inset 0 0 0 1px var(--line);color:var(--petroleo);transition:.25s;border:0;cursor:pointer}
.chip:hover,.chip.on{background:var(--petroleo);color:#fff}
.cat-mosaic{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;grid-auto-flow:dense;margin-bottom:46px}
.cm{position:relative;overflow:hidden;border-radius:26px;padding:20px;min-height:180px;text-decoration:none;color:#fff;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(150deg,var(--c),color-mix(in srgb,var(--c) 65%,#000));box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .5s var(--ease);isolation:isolate}
.cm::before{content:"";position:absolute;inset:0;z-index:-1;background:repeating-conic-gradient(from 0deg at 100% 0%,rgba(231,228,1,.14) 0 3deg,transparent 3deg 10deg)}
.cm h3{color:#fff;font-size:1.6rem}.cm small{opacity:.85;font-weight:600}
.cm .pack{position:absolute;right:16px;bottom:10px;transition:transform .7s var(--ease)}
.cm:hover .pack{transform:translateY(-10px) rotate(-5deg) scale(1.06)}
.cm.big{grid-column:span 2;grid-row:span 2;min-height:376px}.cm.big h3{font-size:2.4rem}
.cm.wide{grid-column:span 2}
.cm .n{font:500 14px/1 var(--display);font-style:italic;opacity:.8}

/* ---------- Modal ---------- */
.modal{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:16px;visibility:hidden}
.modal.open{visibility:visible}
.modal .scrim{position:absolute;inset:0;background:rgba(8,28,36,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .45s}
.modal.open .scrim{opacity:1}
.dialog{position:relative;width:min(1000px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:32px;background:var(--papel);box-shadow:0 60px 120px -40px rgba(0,0,0,.6);transform:translateY(40px) scale(.94) rotateX(10deg);opacity:0;transition:transform .6s var(--spring),opacity .4s}
.modal.open .dialog{transform:none;opacity:1}
.dialog .x{position:absolute;top:14px;right:14px;z-index:5}
.qv{display:grid;grid-template-columns:1fr 1fr}
.qv-media{position:relative;min-height:440px;display:grid;place-items:center;background:radial-gradient(circle at 50% 110%,color-mix(in srgb,var(--pc) 40%,transparent),transparent 60%),linear-gradient(180deg,var(--cielo),#f7faf2);perspective:900px;overflow:hidden}
.qv-media::before{content:"";position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 115%,rgba(213,200,53,.22) 0 3deg,transparent 3deg 10deg);animation:spin 90s linear infinite;transform-origin:50% 115%;will-change:transform}
.qv-media .rot{transform-style:preserve-3d;transition:transform .2s linear}
.qv-media .pimg{max-height:340px}
.qv-info{padding:40px 34px 34px;display:grid;gap:14px;align-content:start}
.qv-info .pr{font:600 32px/1 var(--display);color:var(--petroleo)}
.qv-info dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:6px 0;font-size:14px}
.qv-info dt{color:var(--muted);font-weight:700}.qv-info dd{margin:0}
.qty{display:inline-flex;align-items:center;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line)}
.qty button{border:0;background:none;padding:10px 13px;cursor:pointer;display:grid;place-items:center}
.qty output{min-width:28px;text-align:center;font-weight:800}
.qv-nav{display:flex;justify-content:space-between;gap:8px;padding:14px 34px 26px;flex-wrap:wrap}
.note{font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:rgba(218,234,242,.6)}
.note.warn{background:rgba(231,228,1,.22);color:var(--tierra)}

/* ---------- Toast ---------- */
.toast{position:fixed;left:50%;bottom:22px;z-index:95;transform:translate(-50%,calc(100% + 60px));visibility:hidden;display:flex;gap:12px;align-items:center;padding:12px 14px 12px 16px;border-radius:999px;background:var(--petroleo);color:#fff;box-shadow:0 20px 40px -14px rgba(0,0,0,.5);transition:transform .55s var(--spring);font-size:14px;max-width:calc(100% - 24px)}
.toast.on{transform:translate(-50%,0);visibility:visible}
.toast .ic{color:var(--sol)}
.toast-link{color:var(--sol);font-weight:800;text-decoration:none;display:inline-flex;gap:6px;align-items:center;white-space:nowrap;padding-left:10px;border-left:1px solid rgba(255,255,255,.2)}

/* ---------- Ingredientes (flip 3D) ---------- */
.flip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;perspective:1600px}
.flip{position:relative;height:380px;cursor:pointer;border:0;padding:0;background:none;text-align:left;perspective:1200px}
.flip-in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1s var(--spring)}
.flip.on .flip-in{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:28px;padding:22px;display:flex;flex-direction:column;overflow:hidden;box-shadow:var(--shadow)}
.face.front{background:linear-gradient(170deg,#fff,#f0f5e8);border:1px solid #fff}
.face.front::before{content:"";position:absolute;left:-20%;right:-20%;top:-10%;height:70%;background:radial-gradient(circle at 70% 20%,rgba(231,228,1,.35),transparent 50%),repeating-conic-gradient(from 0deg at 70% 20%,rgba(213,200,53,.18) 0 3deg,transparent 3deg 12deg)}
.face.front .plant{position:relative;height:210px;margin:6px auto 0;filter:drop-shadow(0 14px 14px rgba(14,47,59,.18));transition:transform .8s var(--ease)}
.flip:hover .face.front .plant{transform:scale(1.06) rotate(-3deg)}
.face h3{font-size:1.7rem;margin-top:auto}
.face .sci{font-style:italic;color:var(--muted);font-size:13.5px}
.face .turn{position:absolute;right:16px;bottom:16px;display:inline-flex;gap:6px;align-items:center;font-size:12px;font-weight:800;color:var(--verde)}
.face.back{transform:rotateY(180deg);background:var(--petroleo);color:#e2edf0;gap:12px}
.face.back h3{color:#fff;margin:0}
.face.back p{margin:0;color:#c1d3d8;font-size:14.5px}
.face.back .uses{display:grid;gap:6px;margin-top:auto}
.face.back .uses a{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:13px;font-weight:700;text-decoration:none;color:#fff;padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.08)}
.face.back .uses a:hover{background:var(--verde)}

/* ---------- Proceso ---------- */
.steps{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;position:relative;margin-bottom:28px}
.steps svg.vine{position:absolute;left:0;right:0;top:26px;width:100%;height:12px;overflow:visible}
.step-b{position:relative;z-index:1;display:grid;justify-items:center;gap:10px;border:0;background:none;cursor:pointer;color:var(--muted);font-weight:700;font-size:12.5px;text-align:center}
.step-b .n{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:inset 0 0 0 2px var(--line),var(--shadow);font:600 18px/1 var(--display);color:var(--petroleo);transition:.5s var(--spring)}
.step-b.done .n{background:var(--campo);color:#fff;box-shadow:none}
.step-b.on .n{background:var(--sol);color:var(--petroleo);transform:scale(1.18);box-shadow:0 0 0 8px rgba(231,228,1,.25)}
.step-b.on{color:var(--petroleo)}
.step-stage{display:grid;grid-template-columns:1fr 1fr;gap:0;overflow:hidden;border-radius:34px;min-height:400px}
.step-art{position:relative;background:linear-gradient(180deg,var(--cielo),#eef5e6);overflow:hidden;display:grid;place-items:center}
.step-art .hills-svg{position:absolute;left:0;right:0;bottom:0;height:45%;transition:transform 1s var(--ease)}
.step-art .big-n{font:500 clamp(8rem,18vw,14rem)/1 var(--display);font-style:italic;color:rgba(14,47,59,.08);position:absolute;left:24px;top:0}
.step-art .s-ico{position:relative;width:150px;height:150px;border-radius:40px;display:grid;place-items:center;background:#fff;box-shadow:var(--shadow);color:var(--verde);animation:floaty 5s ease-in-out infinite}
.step-art .s-ico .ic{width:70px;height:70px;stroke-width:1.2}
.step-txt{padding:clamp(28px,4vw,52px);display:grid;gap:16px;align-content:center;background:#fff}
.step-txt .ctrl{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.step-anim{animation:rise .7s var(--ease) both}

/* ---------- Asistente ---------- */
.quiz{max-width:880px;margin:0 auto;padding:clamp(24px,4vw,44px);display:grid;gap:22px}
.qbar{height:8px;border-radius:99px;background:rgba(14,47,59,.08);overflow:hidden}
.qbar i{display:block;height:100%;background:linear-gradient(90deg,var(--verde),var(--sol));border-radius:inherit;transition:width .7s var(--spring)}
.qopts{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.qopt{display:flex;gap:14px;align-items:center;text-align:left;padding:18px;border-radius:20px;border:0;cursor:pointer;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);transition:transform .4s var(--spring),box-shadow .3s,background .3s;font-weight:700}
.qopt:hover{transform:translateY(-4px);box-shadow:inset 0 0 0 2px var(--verde),0 18px 30px -18px rgba(36,141,63,.6)}
.qopt .qi{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--cielo);color:var(--verde);flex:none}
.qopt small{display:block;font-weight:500;color:var(--muted);font-size:12.5px;margin-top:2px}
.qstep{animation:rise .6s var(--ease) both}

/* ---------- Formularios ---------- */
.form{display:grid;gap:14px}
.field{display:grid;gap:6px}
.field label,.field .lbl{font-size:13px;font-weight:800;color:var(--petroleo)}
.dark .field label,.dark .field .lbl{color:#fff}
.input,select.input,textarea.input{width:100%;padding:13px 15px;border-radius:14px;border:0;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);outline:none;transition:box-shadow .25s}
.input:focus{box-shadow:inset 0 0 0 2px var(--verde),0 0 0 5px rgba(36,141,63,.12)}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.checks{display:flex;flex-wrap:wrap;gap:8px}
.checks label{display:inline-flex;gap:8px;align-items:center;padding:10px 13px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);font-size:13.5px;font-weight:700;cursor:pointer}
.checks input{accent-color:var(--verde)}
input[type=range]{accent-color:var(--verde);width:100%}
.consent{display:flex;gap:10px;font-size:12.5px;color:var(--muted);align-items:flex-start}
.consent input{margin-top:3px;accent-color:var(--verde)}

/* ---------- Cotizador ---------- */
.quote{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;align-items:start}
.quote .sum{position:sticky;top:96px;padding:28px;display:grid;gap:14px}
.sum-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(255,255,255,.18);font-size:14px}
.sum-row span:first-child{color:#9fb8bf}
.sum-total{font:500 1.5rem/1.1 var(--display)}
.qty-big{font:500 clamp(2.4rem,5vw,3.4rem)/1 var(--display);color:var(--verde)}

/* ---------- Club / registro ---------- */
.club{display:grid;grid-template-columns:.95fr 1.05fr;gap:22px;align-items:start}
.club>*,.quote>*,.cart>*,.contact>*{min-width:0}
.promo-card{position:relative;overflow:hidden;border-radius:30px;padding:30px;color:#fff;background:linear-gradient(140deg,var(--verde),#145a27);isolation:isolate;display:grid;gap:16px}
.promo-card::before{content:"";position:absolute;inset:0;z-index:-1;background:repeating-conic-gradient(from 0deg at 100% 0%,rgba(231,228,1,.2) 0 3deg,transparent 3deg 11deg)}
.promo-card h2,.promo-card h3{color:#fff}
.promo-card .hills-svg{position:absolute;left:0;right:0;bottom:-2px;height:70px;opacity:.35;z-index:-1}
.code{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-radius:18px;background:rgba(255,255,255,.12);border:1.5px dashed rgba(231,228,1,.75);font:700 clamp(1.2rem,3vw,1.6rem)/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;color:var(--sol)}
.panel-users{padding:22px;display:grid;gap:16px}
.pu-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.stat{padding:14px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.stat b{display:block;font:500 1.9rem/1 var(--display);color:var(--verde)}
.stat span{font-size:12px;color:var(--muted);font-weight:700}
.tbl-wrap{overflow:auto;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);max-height:420px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:11px 12px;text-align:left;border-bottom:1px solid var(--line);white-space:nowrap}
th{position:sticky;top:0;background:#f6f9f0;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
td code{font-weight:800;color:var(--verde)}
tr.fresh td{animation:hl 2.4s ease}
@keyframes hl{0%{background:rgba(231,228,1,.55)}100%{background:transparent}}
.empty{padding:34px;text-align:center;color:var(--muted);display:grid;gap:8px;justify-items:center}
.reg-modal .dialog{width:min(860px,100%)}
.reg{display:grid;grid-template-columns:.9fr 1.1fr}
.reg .promo-card{border-radius:0;min-height:100%}
.reg .form{padding:34px}
.leafburst{position:fixed;inset:0;pointer-events:none;z-index:99}
.leafburst i{position:absolute;width:14px;height:20px;border-radius:0 100% 0 100%;background:var(--c);animation:fall var(--d) var(--ease) forwards}
@keyframes fall{from{transform:translate(0,0) rotate(0)}to{transform:translate(var(--dx),var(--dy)) rotate(var(--r));opacity:0}}
.gift-fab{position:fixed;right:18px;bottom:18px;z-index:70;display:inline-flex;gap:10px;align-items:center;padding:13px 18px;border-radius:999px;background:var(--sol);color:var(--petroleo);font-weight:800;border:0;cursor:pointer;box-shadow:0 18px 30px -12px rgba(14,47,59,.5)}
.gift-fab::after{content:"";position:absolute;inset:0;border-radius:inherit;border:3px solid rgba(231,228,1,.7);animation:pulse 3s ease-out infinite;pointer-events:none}
@keyframes pulse{0%{transform:scale(1);opacity:.9}70%,100%{transform:scale(1.35,1.6);opacity:0}}

/* ---------- Antes / después ---------- */
.cmp{position:relative;border-radius:30px;overflow:hidden;aspect-ratio:16/9;box-shadow:var(--shadow);user-select:none;touch-action:pan-y;background:#000}
.cmp .side-a,.cmp .side-b{position:absolute;inset:0}
.cmp .side-b{clip-path:inset(0 0 0 var(--pos,50%))}
.cmp .handle{position:absolute;top:0;bottom:0;left:var(--pos,50%);width:3px;margin-left:-1.5px;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.4);cursor:ew-resize}
.cmp .handle b{position:absolute;top:50%;left:50%;width:54px;height:54px;transform:translate(-50%,-50%);border-radius:50%;background:var(--sol);display:grid;place-items:center;color:var(--petroleo);box-shadow:0 10px 20px rgba(0,0,0,.3);font-size:18px}
.cmp .tag{position:absolute;top:16px;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.cmp .tag.a{left:16px;background:rgba(0,0,0,.6);color:#fff}.cmp .tag.b{right:16px;background:var(--sol);color:var(--petroleo)}
.old{position:absolute;inset:0;background:#0E2F3B;color:#d9e4e7;font-family:Arial,Helvetica,sans-serif;padding:2.2%;display:flex;flex-direction:column;gap:2.4%;font-size:clamp(7px,1.1vw,13px)}
.old .o-nav{display:flex;justify-content:space-between;align-items:center;padding:1% 2%;background:#0b2630}
.old .o-nav span{display:flex;gap:2em}
.old .o-logo{width:5em;height:2.4em;border:1px dashed #6d8b94;display:grid;place-items:center;font-size:.8em;color:#9fb8bf}
.old .o-banner{padding:4% 3%;background:#123a49;text-align:center;font-size:1.8em}
.old .o-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2%;flex:1}
.old .o-grid div{background:#fff;color:#333;display:flex;flex-direction:column;justify-content:flex-end;padding:4%;gap:4%;font-size:.9em}
.old .o-grid div::before{content:"";flex:1;background:#e6e6e6}
.old .o-grid em{font-style:normal;background:#ddd;padding:3%;text-align:center}
.old .o-note{position:absolute;left:3%;bottom:3%;font-size:.85em;background:rgba(0,0,0,.6);padding:.6em .9em;border-radius:6px;color:#fff}
.new{position:absolute;inset:0;background:linear-gradient(180deg,#cfe4ee,var(--cielo) 45%,#eef4e4);display:flex;align-items:center;padding:0 6%;overflow:hidden;font-size:clamp(7px,1.1vw,13px)}
.new::before{content:"";position:absolute;right:6%;top:-18%;width:46%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,var(--sol) 0 14%,rgba(231,228,1,.3) 15% 22%,transparent 23%),repeating-conic-gradient(rgba(213,200,53,.35) 0 4deg,transparent 4deg 12deg);-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%);animation:spin 60s linear infinite}
.new .hills-svg{position:absolute;left:0;right:0;bottom:0;height:42%}
.new .n-copy{position:relative;display:grid;gap:1em;max-width:52%}
.new .n-copy b{font:500 3.6em/1 var(--display);color:var(--petroleo);letter-spacing:-.02em}.new .n-copy b em{color:var(--verde)}
.new .n-copy span{color:var(--muted);font-size:1.15em}
.new .n-copy i{font-style:normal;justify-self:start;padding:.9em 1.4em;border-radius:99px;background:var(--verde);color:#fff;font-weight:800}
.new .n-nav{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:2% 4%;background:rgba(243,246,236,.8);font-weight:700;color:var(--petroleo)}
.new .n-nav .emblem{width:2.6em;height:2.6em}
.tl{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.next.vals a,.next.vals>div{color:var(--petroleo)}
.diag{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.diag .d{padding:20px;display:grid;gap:8px;align-content:start}
.diag .d b{display:flex;gap:10px;align-items:center;font-size:15px;color:var(--petroleo)}
.diag .d p{margin:0;font-size:14px;color:var(--muted)}
.diag .d .fix{font-size:13px;color:var(--verde);font-weight:700}
.sev{width:10px;height:10px;border-radius:50%;flex:none}

/* ---------- Carrito ---------- */
.cart{display:grid;grid-template-columns:1.4fr .8fr;gap:22px;align-items:start}
.ci{display:grid;grid-template-columns:90px 1fr auto;gap:16px;align-items:center;padding:14px;border-bottom:1px solid var(--line)}
.ci .cm-m{height:90px;border-radius:16px;background:linear-gradient(180deg,var(--cielo),#f7faf2);display:grid;place-items:center;overflow:hidden}
.ci .cm-m .pack{transform:scale(.55)}
.ci h3{font:700 15px/1.3 var(--sans)}
.ci .sub{font-size:12.5px;color:var(--muted)}

/* ---------- Seguí explorando ---------- */
.next{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.next a{position:relative;overflow:hidden;padding:22px;border-radius:24px;min-height:150px;display:flex;flex-direction:column;justify-content:space-between;text-decoration:none;color:var(--petroleo);background:rgba(255,255,255,.75);box-shadow:var(--shadow);transform-style:preserve-3d;transition:transform .5s var(--ease)}
.next a:nth-child(2){background:var(--petroleo);color:#fff}.next a:nth-child(3){background:linear-gradient(160deg,var(--verde),#196b2f);color:#fff}.next a:nth-child(4){background:linear-gradient(160deg,#f1ef80,var(--sol))}
.next a b{font:500 1.45rem/1.1 var(--display)}
.next a small{font-weight:800;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.75}
.next a .go{display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:13px}

/* ---------- Contacto y pie ---------- */
.contact{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.cinfo{display:grid;gap:12px}
.cinfo a,.cinfo div.ci2{display:flex;gap:14px;align-items:center;padding:18px;border-radius:20px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);text-decoration:none;transition:transform .4s var(--spring)}
.cinfo a:hover{transform:translateX(6px)}
.cinfo .ico{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--cielo);color:var(--verde);flex:none}
.cinfo small{display:block;color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
footer.site{position:relative;margin-top:80px;padding:120px 0 40px;background:var(--petroleo);color:#b7cbd1}
footer.site>.hills-svg{position:absolute;left:0;right:0;top:-109px;height:110px}
footer.site .fgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:30px}
footer.site h4{color:#fff;margin:0 0 12px;font-size:13px;letter-spacing:.14em;text-transform:uppercase}
footer.site a{display:block;text-decoration:none;padding:4px 0;color:#b7cbd1}
footer.site a:hover{color:var(--sol)}
footer.site a.btn{display:inline-flex;color:var(--petroleo)}
footer.site .legal{margin-top:46px;padding-top:22px;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:12.5px}
.demo-pill{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:99px;background:rgba(231,228,1,.15);color:var(--sol);font-weight:800}

/* ---------- Cursor y precarga ---------- */
.cursor{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;pointer-events:none;z-index:100;border:1.5px solid rgba(36,141,63,.6);transition:scale .3s var(--ease),background .3s,border-color .3s;will-change:transform}
.cursor.big{scale:1.9;background:rgba(231,228,1,.3);border-color:transparent}
.cursor-dot{position:fixed;left:0;top:0;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:var(--verde);pointer-events:none;z-index:100;will-change:transform}
.fps{position:fixed;left:12px;bottom:12px;z-index:130;font:700 12px/1 ui-monospace,Menlo,monospace;padding:8px 10px;border-radius:10px;background:rgba(14,47,59,.88);color:#E7E401;pointer-events:none;min-width:86px}
.loader{position:fixed;inset:0;z-index:120;display:grid;place-items:center;background:var(--petroleo);transition:opacity .8s var(--ease),visibility .8s}
.loader.done{opacity:0;visibility:hidden}
.loader .wipe-sun{width:90px;height:90px}
.loader p{margin:16px 0 0;color:#cfe0e6;font:500 1.4rem/1 var(--display);font-style:italic;text-align:center}

/* ---------- Responsive ---------- */
@media (max-width:1380px){.hdr-actions .btn-sun span{display:none}.hdr-actions .btn-sun{padding:11px;border-radius:50%}}
@media (max-width:1180px){
  nav.main{display:none}
  .btn.burger{display:inline-flex}
  .hdr-actions{margin-left:auto}
  nav.main.open{display:flex;position:fixed;inset:110px 12px auto;flex-direction:column;align-items:stretch;padding:14px;border-radius:24px;background:rgba(255,255,255,.98);box-shadow:var(--shadow);max-height:calc(100vh - 130px);overflow:auto}
  nav.main.open>a,nav.main.open .mm>a{padding:14px 16px;font-size:16px}
  nav.main.open .mega{position:static;transform:none;opacity:1;visibility:visible;width:auto;grid-template-columns:1fr 1fr;box-shadow:none;padding:6px 0 10px;background:none;border:0}
  nav.main.open .nav-ind{display:none}
  nav.main.open a.active{background:var(--verde);color:#fff}
  .essence{grid-template-columns:1fr 1fr}.essence .ess:first-child{grid-column:1/-1}
  .cat-layout{grid-template-columns:1fr}.side{position:static;display:flex;overflow-x:auto;gap:6px}.side h4{display:none}.side a{white-space:nowrap}
  .quote,.club,.cart,.contact{grid-template-columns:1fr}.quote .sum{position:static}
  footer.site .fgrid{grid-template-columns:1fr 1fr}
}
@media (max-width:760px){
  .topbar .tb-r{display:none}
  .bento{grid-template-columns:1fr 1fr}
  .s3x3,.s3x2,.s4x1,.s3x1{grid-column:span 2}.s3x3{grid-row:span 3}.s2x2,.s2x1{grid-column:span 2;grid-row:span 1}.s1x2{grid-column:span 1;grid-row:span 1}
  .essence{grid-template-columns:1fr}
  .hero{min-height:auto;border-radius:0 0 30px 30px}
  .hero-stage{opacity:.55}
  .hero .wrap{padding:48px 0 90px}
  .hero-fade{background:linear-gradient(180deg,rgba(243,246,236,.85),rgba(243,246,236,.55))!important}
  .hero.marca .hero-fade{background:linear-gradient(180deg,rgba(8,28,36,.85),rgba(8,28,36,.55))!important}
  .hero-hint{display:none}
  .cat-hero{grid-template-columns:1fr}.cat-hero .packs{display:none}
  .cat-mosaic{grid-template-columns:1fr 1fr}.cm.big{grid-column:span 2;grid-row:span 1;min-height:220px}
  .qv,.reg,.step-stage{grid-template-columns:1fr}.qv-media{min-height:280px}.step-art{min-height:220px}
  .steps{grid-template-columns:repeat(7,64px);overflow-x:auto;padding-bottom:6px}
  .next,.tl{grid-template-columns:1fr 1fr}
  .hdr-actions .btn-sun span{display:none}
  .row2,.stats{grid-template-columns:1fr}
  .ci{grid-template-columns:70px 1fr}.ci>div:last-child{grid-column:1/-1}
  .cmp{aspect-ratio:4/5}.old .o-grid{grid-template-columns:repeat(2,1fr)}.new .n-copy{max-width:80%}
  footer.site .fgrid{grid-template-columns:1fr}
  .gift-fab span{display:none}.gift-fab{padding:14px}
  .grid-p{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
  .pcard .pm{height:170px}.pcard .pa .btn{flex-basis:100%}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;

/* --------------------------------------------------------------------------
   7. Escena 3D (Three.js): sol con rayos, colinas en franjas, árbol, polen.
   Reacciona al mouse y cambia con el selector Bienestar / Marca.
   -------------------------------------------------------------------------- */
const Scene3D = (() => {
  let ok = false, renderer: any, scene: any, camera: any, canvas: HTMLCanvasElement | null = null;
  let sun: any, rays: any, halo: any, canopy: any, pollen: any, pollenVel: Float32Array, pollenSpd: Float32Array, leaves: any, lab: any;
  let raf = 0, running = false, visible = true, paused = false, last = 0, t = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, wx: 0, wy: 0 };
  let marcaK = 0, marcaTarget = 0, pulse = 0, burst: { x: number; y: number; t: number } | null = null;
  let io: IntersectionObserver | null = null;
  // Objetos reutilizados en cada cuadro (sin basura para el recolector)
  let V: any, FOG_A: any, FOG_B: any;
  // Calidad adaptativa: baja la resolución si el equipo no sostiene 60 fps
  let levels: number[] = [], level = 0, ema = 16.7, slowT = 0, fastT = 0, ups = 0, N = 0, aa = true;

  function circleTex(inner: string, outer: string) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
  }
  function stripeTex(a: string, b: string) {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d')!;
    g.fillStyle = a; g.fillRect(0, 0, 64, 64); g.fillStyle = b; for (let i = 0; i < 64; i += 16) g.fillRect(i, 0, 7, 64);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(.35, .35); t.rotation = .5; return t;
  }
  function hill(color: string, stripe: string, y: number, z: number, amp: number, freq: number, phase: number) {
    const W = 16, s = new THREE.Shape(); s.moveTo(-W, -3); s.lineTo(-W, y);
    for (let x = -W; x <= W; x += .4) s.lineTo(x, y + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase) * amp * .25);
    s.lineTo(W, -3); s.lineTo(-W, -3);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 1.4, bevelEnabled: true, bevelThickness: .25, bevelSize: .25, bevelSegments: 2, curveSegments: 2 });
    const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, map: stripeTex(color, stripe) }));
    m.position.set(0, -2.2, z); m.matrixAutoUpdate = false; m.updateMatrix(); return m;
  }

  function init(): boolean {
    if (ok) return true;
    if (typeof THREE === 'undefined') return false;
    const dpr = window.devicePixelRatio || 1;
    aa = dpr < 1.5;
    if (!makeRenderer()) return false;
    const base = Math.min(dpr, 1.5);
    levels = [base, base * .8, 1, .8, .65].filter((v, i, a) => v <= base && a.indexOf(v) === i).sort((a, b) => b - a);
    renderer.setPixelRatio(levels[0]);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#DAEAF2', 14, 30);
    camera = new THREE.PerspectiveCamera(42, 1, .1, 60);
    camera.position.set(0, 1.4, 11);
    V = new THREE.Vector3(); FOG_A = new THREE.Color('#DAEAF2'); FOG_B = new THREE.Color('#0E2F3B');

    scene.add(new THREE.HemisphereLight('#f4f9ff', '#403C31', .75));
    const dir = new THREE.DirectionalLight('#fff4c2', 1.1); dir.position.set(4, 6, 4); scene.add(dir);
    const fill = new THREE.DirectionalLight('#DAEAF2', .35); fill.position.set(-6, 2, 6); scene.add(fill);

    // Sol con rayos
    sun = new THREE.Group(); sun.position.set(4.2, 2.6, -5);
    sun.add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 20), new THREE.MeshBasicMaterial({ color: '#E7E401', fog: false })));
    rays = new THREE.Group();
    const rayLong = new THREE.ConeGeometry(.12, 1.4, 4), rayShort = new THREE.ConeGeometry(.08, .9, 4);
    const rayM1 = new THREE.MeshBasicMaterial({ color: '#D5C835', fog: false }), rayM2 = new THREE.MeshBasicMaterial({ color: '#E7E401', fog: false });
    for (let i = 0; i < 28; i++) {
      const long = i % 2 === 0;
      const ray = new THREE.Mesh(long ? rayLong : rayShort, long ? rayM1 : rayM2);
      const a = (i / 28) * Math.PI * 2, rr = 1.15 + (long ? .95 : .7);
      ray.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0); ray.rotation.z = a - Math.PI / 2; rays.add(ray);
    }
    sun.add(rays);
    halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: circleTex('rgba(231,228,1,0.65)', 'rgba(231,228,1,0)'), transparent: true, depthWrite: false, fog: false }));
    halo.scale.set(9, 9, 1); sun.add(halo);
    scene.add(sun);

    // Colinas en franjas
    scene.add(hill('#8EB24F', '#9cbe5e', 1.6, -6, .55, .35, 0));
    scene.add(hill('#D5C835', '#E7E401', 1.1, -4, .5, .42, 1.6));
    scene.add(hill('#248D3F', '#2a9a47', .7, -2.2, .45, .5, 3.1));
    scene.add(hill('#E7E401', '#D5C835', .2, -.6, .38, .55, 4.4));
    scene.add(hill('#248D3F', '#1f8239', -.4, 1.0, .32, .6, 5.6));

    // Árbol
    const tx = 1.3, ty = -2.2 + .7 + Math.sin(tx * .5 + 3.1) * .45 + Math.sin(tx * .5 * 2.3 + 3.1) * .45 * .25;
    const tree = new THREE.Group(); tree.position.set(tx, ty - .15, -1.6); tree.scale.setScalar(1.35);
    const bark = new THREE.MeshLambertMaterial({ color: '#403C31' });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.1, .2, 1.8, 8), bark); trunk.position.y = .9; tree.add(trunk);
    const branchG = new THREE.CylinderGeometry(.04, .08, .9, 6);
    [[-.35, 1.5, .5], [.4, 1.6, -.6], [0, 1.7, .1]].forEach(([x, y, r]) => { const br = new THREE.Mesh(branchG, bark); br.position.set(x / 2, y, 0); br.rotation.z = r; tree.add(br); });
    canopy = new THREE.Group(); canopy.position.y = 2.2;
    const greens = ['#248D3F', '#2b9b48', '#8EB24F', '#1d7a35'].map(c => new THREE.MeshLambertMaterial({ color: c }));
    // Normales por cara: aspecto facetado sin el costo de flatShading por píxel
    const ico = new THREE.IcosahedronGeometry(1, 1); ico.computeVertexNormals();
    [[0, .35, 0, .95], [-.75, 0, .2, .7], [.75, .05, -.1, .72], [-.35, -.15, .55, .6], [.4, -.1, .5, .6], [0, .1, -.6, .7], [-.5, .5, -.3, .55], [.5, .55, .25, .55]].forEach(([x, y, z, r], i) => {
      const m = new THREE.Mesh(ico, greens[i % 4]); m.position.set(x, y, z); m.scale.setScalar(r); canopy.add(m);
    });
    tree.add(canopy); scene.add(tree);

    // Hojas flotantes (modo bienestar): geometría y materiales compartidos
    leaves = new THREE.Group();
    const ls = new THREE.Shape(); ls.moveTo(0, 0); ls.quadraticCurveTo(.18, .2, 0, .5); ls.quadraticCurveTo(-.18, .2, 0, 0);
    const lg = new THREE.ShapeGeometry(ls, 4);
    const leafM = [new THREE.MeshLambertMaterial({ color: '#248D3F', side: THREE.DoubleSide }), new THREE.MeshLambertMaterial({ color: '#8EB24F', side: THREE.DoubleSide })];
    for (let i = 0; i < 26; i++) {
      const m = new THREE.Mesh(lg, leafM[i % 3 ? 0 : 1]);
      m.position.set(Math.random() * 9 - 1, Math.random() * 5 - 1, Math.random() * 4 - 2);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      m.userData = { s: .3 + Math.random() * .6, p: Math.random() * 6, y0: m.position.y };
      leaves.add(m);
    }
    scene.add(leaves);

    // Laboratorio flotante (modo marca): cápsulas y frascos con recursos compartidos
    lab = new THREE.Group(); lab.position.set(3, .9, 0); lab.visible = false;
    const r = .16, h = .34;
    const capCyl = new THREE.CylinderGeometry(r, r, h / 2, 16), capTop = new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), capBot = new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const mWhite = new THREE.MeshPhongMaterial({ color: '#ffffff', shininess: 60 }), mGreen = new THREE.MeshPhongMaterial({ color: '#248D3F', shininess: 60 }), mSun = new THREE.MeshPhongMaterial({ color: '#E7E401', shininess: 60 });
    const jarBody = new THREE.CylinderGeometry(.32, .32, .42, 24), jarLid = new THREE.CylinderGeometry(.34, .34, .14, 24), jarLabel = new THREE.CylinderGeometry(.325, .325, .22, 24, 1, true);
    const mGold = new THREE.MeshPhongMaterial({ color: '#D5C835', shininess: 90 }), jarM = ['#248D3F', '#0E2F3B', '#8EB24F'].map(c => new THREE.MeshPhongMaterial({ color: c, shininess: 40 }));
    for (let i = 0; i < 14; i++) {
      const g = new THREE.Group();
      if (i % 3 === 0) {
        const lid = new THREE.Mesh(jarLid, mGold); lid.position.y = .28;
        g.add(new THREE.Mesh(jarBody, jarM[(i / 3) % 3 | 0]), lid, new THREE.Mesh(jarLabel, mWhite));
      } else {
        const m1 = i % 2 ? mGreen : mSun;
        const a = new THREE.Mesh(capCyl, m1); a.position.y = h / 4;
        const b = new THREE.Mesh(capCyl, mWhite); b.position.y = -h / 4;
        const tp = new THREE.Mesh(capTop, m1); tp.position.y = h / 2;
        const bt = new THREE.Mesh(capBot, mWhite); bt.position.y = -h / 2;
        g.add(a, b, tp, bt);
      }
      g.userData = { a: (i / 14) * Math.PI * 2, r: 2.3 + (i % 3) * .5, y: (i % 5) * .35 - .7, sp: .25 + (i % 4) * .06 };
      g.scale.setScalar(.0001); lab.add(g);
    }
    scene.add(lab);

    // Polen
    N = 650; const pos = new Float32Array(N * 3), col = new Float32Array(N * 3); pollenVel = new Float32Array(N * 2); pollenSpd = new Float32Array(N);
    const palette = ['#E7E401', '#D5C835', '#ffffff', '#8EB24F'].map(c => new THREE.Color(c));
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * 20; pos[i * 3 + 1] = Math.random() * 9 - 3; pos[i * 3 + 2] = Math.random() * 9 - 6;
      const c = palette[i % 4]; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      pollenSpd[i] = .24 + (i % 7) * .024;
    }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pg.attributes.position.setUsage(THREE.DynamicDrawUsage);
    pollen = new THREE.Points(pg, new THREE.PointsMaterial({ size: .09, vertexColors: true, transparent: true, opacity: .9, depthWrite: false, map: circleTex('rgba(255,255,255,1)', 'rgba(255,255,255,0)') }));
    pollen.frustumCulled = false;
    scene.add(pollen);

    window.addEventListener('pointermove', e => { mouse.tx = (e.clientX / innerWidth) * 2 - 1; mouse.ty = -(e.clientY / innerHeight) * 2 + 1; }, { passive: true });
    document.addEventListener('visibilitychange', () => { last = 0; });
    ok = true; return true;
  }

  function onDown(e: PointerEvent) {
    const b = canvas!.getBoundingClientRect(); V.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1, .5).unproject(camera);
    V.sub(camera.position).normalize(); const k = -camera.position.z / V.z;
    burst = { x: camera.position.x + V.x * k, y: camera.position.y + V.y * k, t: 0 }; pulse = 1;
  }
  function makeRenderer(): boolean {
    let r: any;
    try { r = new THREE.WebGLRenderer({ antialias: aa, alpha: true, powerPreference: 'high-performance', stencil: false }); } catch { return false; }
    r.outputEncoding = THREE.sRGBEncoding;
    const old = canvas; renderer?.dispose(); renderer = r; canvas = r.domElement;
    canvas!.addEventListener('pointerdown', onDown);
    if (old && old.parentElement) old.replaceWith(canvas!);
    return true;
  }
  function resize() {
    if (!canvas || !canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w < 760 ? 14 : 11; camera.updateProjectionMatrix();
  }
  // Niveles: 0..n-1 = resolución; n = además sin suavizado de bordes; n+1 = además mitad del polen
  function setLevel(l: number) {
    level = l;
    if (l >= levels.length && aa) { aa = false; makeRenderer(); }
    renderer.setPixelRatio(levels[Math.min(l, levels.length - 1)]); resize();
    pollen.geometry.setDrawRange(0, l > levels.length ? N >> 1 : N);
    slowT = fastT = 0; ema = 16.7;
  }
  function adapt(ms: number) {
    ema += (ms - ema) * .15;
    if (ema > 19.5) { slowT += ms; fastT = 0; } else if (ema < 12.5) { fastT += ms; slowT = 0; } else { slowT = fastT = 0; }
    if (slowT > 700 && level < levels.length + 1) setLevel(level + 1);
    else if (fastT > 5000 && level > 0 && level < levels.length && ups < 2) { ups++; setLevel(level - 1); }
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible || paused) { last = 0; return; }
    const ms = last ? Math.min(now - last, 100) : 16.7; last = now;
    const dt = ms / 1000, k60 = ms / 16.7; t += dt;
    adapt(ms);
    const ease = (r: number) => 1 - Math.pow(1 - r, k60);
    mouse.x += (mouse.tx - mouse.x) * ease(.05); mouse.y += (mouse.ty - mouse.y) * ease(.05);
    marcaK += (marcaTarget - marcaK) * ease(.04);
    const sy = Math.min(window.scrollY / 800, 1);
    camera.position.x = mouse.x * 1.1; camera.position.y = 1.4 + mouse.y * .55 + sy * 1.2;
    camera.lookAt(0, .6 - sy * .6, 0);
    rays.rotation.z += dt * (.12 + marcaK * .2);
    pulse *= Math.pow(.94, k60); sun.scale.setScalar(1 + Math.sin(t * 1.6) * .03 + pulse * .25);
    sun.position.x = 4.2 + mouse.x * .5; sun.position.y = 2.6 + mouse.y * .3;
    halo.material.opacity = .85 - marcaK * .25 + pulse * .3;
    canopy.rotation.z = Math.sin(t * .9) * .035 + mouse.x * .05; canopy.rotation.x = Math.sin(t * .7) * .02;
    scene.fog.color.copy(FOG_A).lerp(FOG_B, marcaK);
    // Hojas y laboratorio: solo se actualizan y dibujan cuando se ven
    const leafS = 1 - marcaK; leaves.visible = leafS > .01;
    if (leaves.visible) for (const m of leaves.children) {
      const u = m.userData; m.position.y = u.y0 + Math.sin(t * u.s + u.p) * .4; m.rotation.x += .006 * u.s * k60; m.rotation.y += .01 * u.s * k60; m.scale.setScalar(leafS);
    }
    lab.visible = marcaK > .01;
    if (lab.visible) {
      for (const o of lab.children) {
        const u = o.userData; const a = u.a + t * u.sp;
        o.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + u.a) * .25, Math.sin(a) * u.r * .5);
        o.rotation.set(t * u.sp * 2, a, t * .5); o.scale.setScalar(marcaK);
      }
      lab.position.x = 3 + mouse.x * .4;
    }
    // Polen: sube, deriva y se aparta del mouse
    const p = pollen.geometry.attributes.position.array as Float32Array;
    V.set(mouse.x, mouse.y, .5).unproject(camera).sub(camera.position).normalize(); const kz = -camera.position.z / V.z;
    mouse.wx = camera.position.x + V.x * kz; mouse.wy = camera.position.y + V.y * kz;
    const doBurst = !!burst && burst.t < .05; if (burst) burst.t += dt;
    const damp = Math.pow(.92, k60), drift = Math.sin(t * .6), n = Math.min(N, pollen.geometry.drawRange.count);
    for (let j = 0; j < n; j++) {
      const i = j * 3, v = j * 2;
      p[i + 1] += pollenSpd[j] * dt; p[i] += (j & 1 ? drift : -drift) * .15 * dt;
      const dx = p[i] - mouse.wx, dy = p[i + 1] - mouse.wy; const dd = dx * dx + dy * dy;
      if (dd < 2.6 && p[i + 2] > -2.5) { const f = (2.6 - dd) * .012 * k60; pollenVel[v] += dx * f; pollenVel[v + 1] += dy * f; }
      if (doBurst) { const bx = p[i] - burst!.x, by = p[i + 1] - burst!.y, bd = bx * bx + by * by; if (bd < 9) { const f = (9 - bd) * .02; pollenVel[v] += bx * f; pollenVel[v + 1] += by * f; } }
      p[i] += pollenVel[v] * k60; p[i + 1] += pollenVel[v + 1] * k60; pollenVel[v] *= damp; pollenVel[v + 1] *= damp;
      if (p[i + 1] > 6) { p[i + 1] = -3; p[i] = (Math.random() - .5) * 20; }
    }
    pollen.geometry.attributes.position.needsUpdate = true;
    pollen.material.size = .09 + marcaK * .03;
    renderer.render(scene, camera);
  }

  return {
    mount(host: HTMLElement): boolean {
      if (!init()) return false;
      host.appendChild(canvas!); resize();
      io?.disconnect(); io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }); io.observe(host);
      if (!running) { running = true; last = 0; raf = requestAnimationFrame(frame); window.addEventListener('resize', resize); }
      return true;
    },
    stop() { if (running) { cancelAnimationFrame(raf); running = false; window.removeEventListener('resize', resize); } io?.disconnect(); visible = false; },
    setMode(m: string) { marcaTarget = m === 'marca' ? 1 : 0; pulse = .8; },
    pause(on: boolean) { paused = on; },
    /** true mientras la escena se está dibujando en pantalla (el polen 2D queda tapado). */
    active() { return running && visible && !paused; },
    quality() { return ok ? levels[Math.min(level, levels.length - 1)] : 0; },
    antialias() { return aa; },
    stats() { return ok ? { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, points: renderer.info.render.points, geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures } : null; },
  };
})();

/* --------------------------------------------------------------------------
   8. Polen 2D de fondo (todas las vistas), reacciona al mouse.
   Se dibuja a 1x y se detiene cuando la escena 3D o un modal lo tapan.
   -------------------------------------------------------------------------- */
let modalOpen = false;
function pollenBG() {
  const cv = $('#pollen') as HTMLCanvasElement; if (!cv || reduced) return;
  const g = cv.getContext('2d', { alpha: true, desynchronized: true } as any) as CanvasRenderingContext2D; let W = 0, H = 0, cleared = false, last = 0; const m = { x: -999, y: -999 };
  const cols = ['rgba(231,228,1,.55)', 'rgba(142,178,79,.55)', 'rgba(213,200,53,.55)'];
  const P = Array.from({ length: 36 }, (_, i) => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.6, s: 9 + Math.random() * 21, vx: 0, vy: 0, c: cols[i % 3] }));
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  size(); addEventListener('resize', size);
  addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; }, { passive: true });
  const loop = (now: number) => {
    requestAnimationFrame(loop);
    if (Scene3D.active() || modalOpen) { if (!cleared) { g.clearRect(0, 0, W, H); cleared = true; } last = 0; return; }
    cleared = false;
    const ms = last ? Math.min(now - last, 100) : 16.7; last = now; const k = ms / 16.7;
    g.clearRect(0, 0, W, H);
    for (const p of P) {
      let x = p.x * W, y = p.y * H; const dx = x - m.x, dy = y - m.y, d2 = dx * dx + dy * dy;
      if (d2 < 19600) { const d = Math.sqrt(d2) || 1; p.vx += dx / d * .6 * k; p.vy += dy / d * .6 * k; }
      const damp = Math.pow(.93, k); p.vx *= damp; p.vy *= damp; x += p.vx * k; y += p.vy * k - p.s * ms / 1000;
      if (y < -10) { y = H + 10; x = Math.random() * W; }
      p.x = x / W; p.y = y / H;
      g.fillStyle = p.c; g.beginPath(); g.arc(x, y, p.r, 0, 6.2832); g.fill();
    }
  };
  requestAnimationFrame(loop);
}

/* --------------------------------------------------------------------------
   9. Estructura fija: barra superior, encabezado, ruta, pie, overlays
   -------------------------------------------------------------------------- */
const NAV: [string, string][] = [
  ['inicio', 'Inicio'], ['productos', 'Productos'], ['nosotros', 'Nosotros'], ['ingredientes', 'Ingredientes'],
  ['proceso', 'Del campo al frasco'], ['asistente', 'Asistente'], ['empresas', 'Empresas'], ['club', 'Club'],
];
const TITLES: Record<string, string> = {
  inicio: 'Inicio', productos: 'Productos', nosotros: 'Nosotros', ingredientes: 'Ingredientes', proceso: 'Del campo al frasco',
  asistente: 'Asistente de bienestar', empresas: 'Empresas y maquila', club: 'Club Herbarium', 'antes-y-despues': 'Antes y después',
  contacto: 'Contacto', carrito: 'Carrito',
};

function shell() {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="loader" id="loader"><div style="display:grid;justify-items:center"><div class="wipe-sun"></div><p>Herbarium</p></div></div>
  <div class="progress" id="progress"></div>
  <div class="bg" aria-hidden="true"><div class="bg-sky"></div><div class="bg-sun"></div><div class="bg-tex"></div><div class="bg-hills">${HILLS_SVG()}</div><canvas id="pollen"></canvas><div class="bg-grain"></div></div>
  <div class="app">
    <div class="topbar"><div class="wrap">
      <div class="tb-l"><span class="dot"></span><span>Productos naturales desde 2005 · Barva, Heredia</span></div>
      <div class="tb-r"><a href="tel:${EMPRESA.telLink}">${EMPRESA.telefono}</a><a href="#/antes-y-despues">Ver antes y después</a><a href="#/contacto">Contacto</a></div>
    </div></div>
    <header class="site"><div class="wrap">
      <a href="#/inicio" aria-label="Herbarium, ir al inicio">${logo('header')}</a>
      <nav class="main" id="nav" aria-label="Principal"><span class="nav-ind" id="navInd"></span>
        ${NAV.map(([k, l]) => k === 'productos'
          ? `<div class="mm"><a href="#/productos" data-nav="productos">${l}</a><div class="mega">${CATS.map(c => `<a href="#/productos/${c.slug}">${c.name}<small>${c.tagline}</small></a>`).join('')}<a class="mega-all" href="#/productos">Ver los ${PRODUCTS.length} productos ${IC.arrow}</a></div></div>`
          : `<a href="#/${k}" data-nav="${k}">${l}</a>`).join('')}
      </nav>
      <div class="hdr-actions">
        <a class="btn btn-ghost btn-icon cart-btn" href="#/carrito" aria-label="Ir al carrito">${IC.cart}<span class="cart-count">0</span></a>
        <button class="btn btn-sun btn-sm" data-action="open-register">${IC.gift}<span>Registrate y obtené tu código</span></button>
        <button class="btn btn-ghost btn-icon burger" data-action="nav-toggle" aria-label="Abrir menú">${IC.menu}</button>
      </div>
    </div></header>
    <div class="crumbs" id="crumbs"><div class="wrap"></div></div>
    <main id="view" tabindex="-1"></main>
    <footer class="site">${HILLS_SVG(1, '#0E2F3B')}
      <div class="wrap">
        <div class="fgrid">
          <div style="display:grid;gap:16px;align-content:start">
            <a href="#/inicio" aria-label="Ir al inicio">${logo('footer')}</a>
            <p style="margin:0;max-width:40ch">${esc(HISTORIA[0])}</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-sun btn-sm" href="#/club" style="display:inline-flex">${IC.gift} Ir al Club Herbarium</a></div>
          </div>
          <div><h4>Productos</h4>${CATS.map(c => `<a href="#/productos/${c.slug}">${c.name}</a>`).join('')}</div>
          <div><h4>Herbarium</h4><a href="#/nosotros">Nuestra historia</a><a href="#/nosotros">Misión y visión</a><a href="#/ingredientes">Ingredientes</a><a href="#/proceso">Del campo al frasco</a><a href="#/asistente">Asistente de bienestar</a><a href="#/empresas">Maquila para empresas</a><a href="#/antes-y-despues">Antes y después</a></div>
          <div><h4>Contacto</h4><a href="tel:${EMPRESA.telLink}">${EMPRESA.telefono}</a><a href="mailto:${EMPRESA.correo}">${EMPRESA.correo}</a><a href="#/contacto">${EMPRESA.direccion}</a><a href="${EMPRESA.facebook}" target="_blank" rel="noopener">Facebook</a><a href="${EMPRESA.instagram}" target="_blank" rel="noopener">Instagram</a><a href="#/contacto">TikTok <span class="ph">[USUARIO]</span></a></div>
        </div>
        <div class="legal">
          <span>© 2026 ${EMPRESA.nombre} · Registro sanitario: <span class="ph">[N.º REGISTRO SANITARIO]</span></span>
          <span>Los productos naturales acompañan un estilo de vida saludable y no sustituyen la consulta médica.</span>
          <span class="demo-pill">${IC.spark} Demo de propuesta, no es el sitio oficial</span>
        </div>
      </div>
    </footer>
  </div>
  <div class="wipe" id="wipe"><div class="wipe-disc"></div><div class="wipe-inner"><div class="wipe-sun"></div><div class="wipe-label" id="wipeLabel"></div><div class="wipe-path" id="wipePath"></div></div></div>
  <div class="modal" id="modal" aria-hidden="true"><div class="scrim" data-action="close-modal"></div><div class="dialog" role="dialog" aria-modal="true" id="dialog"></div></div>
  <div class="toast" id="toast" role="status"></div>
  <button class="gift-fab" data-action="open-register" aria-label="Registrarme para recibir mi código de promoción">${IC.gift}<span>Obtené tu código</span></button>
  ${finePointer && !reduced ? '<div class="cursor" id="cursor"></div><div class="cursor-dot" id="cursorDot"></div>' : ''}
  `);
  const st = document.createElement('style'); st.textContent = STYLES; document.head.appendChild(st);
}

/* --------------------------------------------------------------------------
   10. Componentes compartidos
   -------------------------------------------------------------------------- */
function card(p: Product, i = 0) {
  const c = CAT[p.cat];
  return `<article class="pcard" data-tilt data-r style="--i:${i};--pc:${c.color}">
    <a class="pm" href="#/productos/${p.cat}/${p.slug}" aria-label="Abrir vista rápida de ${esc(p.name)}">${media(p)}</a><span class="shine"></span>
    <div class="pb"><a class="pc" href="#/productos/${p.cat}">${c.name}</a><h3>${esc(p.name)}</h3><div class="pr">${priceHTML(p)}</div>
      <div class="pa"><a class="btn btn-ghost" href="#/productos/${p.cat}/${p.slug}">Vista rápida</a><button class="btn" data-action="add" data-slug="${p.slug}" ${p.price ? '' : 'disabled title="Precio por confirmar"'}>${IC.plus} Agregar</button></div>
    </div></article>`;
}

function nextLinks(current: string) {
  const all: [string, string, string, string][] = [
    ['productos', 'Catálogo', 'Ver las 10 líneas de producto', '#/productos'],
    ['nosotros', 'Historia', 'Conocer nuestra historia, misión y visión', '#/nosotros'],
    ['asistente', 'Asistente', 'Encontrar mi producto en 3 preguntas', '#/asistente'],
    ['club', 'Club', 'Registrarme y obtener mi código', '#/club'],
    ['ingredientes', 'Plantas', 'Girar las tarjetas de ingredientes', '#/ingredientes'],
    ['proceso', 'Proceso', 'Ver cómo llega del campo al frasco', '#/proceso'],
    ['empresas', 'Empresas', 'Cotizar la maquila de mi marca', '#/empresas'],
    ['contacto', 'Contacto', 'Escribir o llamar a Herbarium', '#/contacto'],
  ];
  const pick = all.filter(a => a[0] !== current).slice(0, 4);
  return `<section class="sec" style="padding-top:20px"><div class="wrap"><div class="sec-head"><div><span class="kicker">Seguí explorando</span><h2>¿A dónde vamos <em>ahora</em>?</h2></div><a class="link" href="#/inicio">${IC.back} Volver al mapa del inicio</a></div>
  <div class="next">${pick.map(([, k, t, h], i) => `<a href="${h}" data-tilt data-r style="--i:${i}"><small>${k}</small><b>${t}</b><span class="go">Ir ${IC.arrow}</span></a>`).join('')}</div></div></section>`;
}

function essenceBlock(compact: boolean) {
  return `<div class="essence">
    <article class="panel ess" data-r style="--i:0"><span class="kicker">Nuestra historia</span><div class="yr">2005</div>
      ${HISTORIA.map(p => `<p>${esc(p)}</p>`).join('')}
      ${compact ? `<a class="link" href="#/nosotros">Leer la historia completa ${IC.arrow}</a>` : ''}</article>
    <article class="panel ess" data-r style="--i:1"><div class="ic-big">${IC.leaf}</div><h3>Misión</h3><p>${esc(MISION)}</p><span class="badge-val">${IC.spark} Propuesta · validar</span></article>
    <article class="panel ess" data-r style="--i:2"><div class="ic-big">${IC.sun}</div><h3>Visión</h3><p>${esc(VISION)}</p><span class="badge-val">${IC.spark} Propuesta · validar</span></article>
  </div>`;
}

/* --------------------------------------------------------------------------
   11. Vistas
   -------------------------------------------------------------------------- */
function vInicio() {
  const feat = ['unguento-arnica-y-calendula', 'capsulas-valeriana-con-vitamina-c-y-b6', 'herba-te-curcuma-y-jengibre-con-miel', 'colageno-hidrolizado', 'crema-facial-colageno', 'full-protein-banano-granola', 'shampoo-de-equino', 'sebo-cubano-el-indio-arnica'].map(s => BY_SLUG[s]);
  return `
  <section class="hero ${mode}" id="hero" data-m="${mode}">
    <div class="hero-stage" id="heroStage"></div><div class="hero-fade"></div>
    <div class="wrap"><div class="hero-copy">
      <div class="switch ${mode}" role="tablist" aria-label="Elegí tu camino">
        <span class="knob"></span>
        <button role="tab" data-action="mode" data-mode="bienestar" class="${mode === 'bienestar' ? 'on' : ''}">Para tu bienestar</button>
        <button role="tab" data-action="mode" data-mode="marca" class="${mode === 'marca' ? 'on' : ''}">Para tu marca</button>
      </div>
      <div class="swap">
        <div data-mode="bienestar" style="display:grid;gap:20px">
          <span class="kicker">Laboratorio costarricense desde 2005</span>
          <h1>La sabiduría de las plantas, con <em>rigor</em> de laboratorio.</h1>
          <p class="lead">Ungüentos, cápsulas, tés, colágenos y más: ${PRODUCTS.length} productos naturales de Herbarium para acompañar tu bienestar todos los días.</p>
          <div class="hero-ctas"><a class="btn" href="#/productos">Ver el catálogo ${IC.arrow}</a><a class="btn btn-ghost" href="#/asistente">Encontrar mi producto en 3 preguntas</a></div>
        </div>
        <div data-mode="marca" style="display:grid;gap:20px">
          <span class="kicker">Maquila y marca propia</span>
          <h1>Tu línea natural, <em>formulada</em> y elaborada por expertos.</h1>
          <p class="lead">Más de 15 años elaborando ungüentos, cápsulas, tés y cremas. Llevá tu marca al mercado con un laboratorio con trayectoria.</p>
          <div class="hero-ctas"><a class="btn btn-sun" href="#/empresas">Cotizar maquila ${IC.arrow}</a><a class="btn btn-ghost" href="#/proceso">Ver el proceso del campo al frasco</a></div>
        </div>
      </div>
      <div class="trust"><span>${IC.sun} Desde 2005</span><span>${IC.pin} Barva, Heredia</span><span>${IC.leaf} 10 líneas</span><span>${IC.shield} Reg. <span class="ph">[N.º]</span></span></div>
    </div></div>
    <div class="hero-hint">${IC.spark} Mové el mouse · hacé clic en la escena</div>
  </section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Mapa del sitio</span><h2>Elegí por dónde <em>empezar</em>.</h2></div><p class="lead" data-r style="--i:1">Cada mosaico te lleva a una sección. Volvés acá con el menú, la ruta de ubicación o el botón atrás del navegador.</p></div>
    <div class="bento">
      <a class="tile s3x3" href="#/productos" data-tilt data-r style="--i:0"><div class="t-art art-hills"></div><span class="shine"></span><span class="t-num">01</span>
        <div style="display:grid;gap:12px"><span class="kicker">Catálogo</span><h3>${PRODUCTS.length} productos en 10 líneas</h3><p>Desde ungüentos de tradición hasta proteínas para días activos, con precios de la tienda.</p></div>
        <div class="t-packs">${['unguento-cascabel', 'capsulas-energy-plus', 'herba-te-ansite', 'full-protein-fresa'].map(s => packHTML(BY_SLUG[s], 'sm')).join('')}</div>
        <span class="t-cta">Ver el catálogo completo ${IC.arrow}</span></a>
      <a class="tile s3x2 dk" href="#/nosotros" data-tilt data-r style="--i:1"><div class="t-art art-sun"></div><span class="shine"></span><span class="t-num">02</span>
        <div style="display:grid;gap:12px"><span class="kicker">Nosotros</span><h3>Una historia que empezó en 2005</h3><p>${esc(HISTORIA[0])}</p></div><span class="t-cta">Conocer historia, misión y visión ${IC.arrow}</span></a>
      <a class="tile s2x1 sn" href="#/asistente" data-tilt data-r style="--i:2"><span class="shine"></span><div><span class="kicker" style="color:var(--petroleo)">Asistente</span><h3>3 preguntas, tu recomendación</h3></div><span class="t-cta">Hacer el test ${IC.arrow}</span></a>
      <a class="tile s1x1 gr" href="#/club" data-tilt data-r style="--i:3"><span class="shine"></span><span class="kicker" style="color:var(--sol)">Club</span><h3 style="font-size:1.35rem">Tu código de promo</h3><span class="t-cta">Registrarme ${IC.arrow}</span></a>
      <a class="tile s2x2" href="#/proceso" data-tilt data-r style="--i:4"><div class="t-art art-sun" style="opacity:.6"></div><span class="shine"></span><span class="t-num">05</span><div style="display:grid;gap:12px"><span class="kicker">Proceso</span><h3>Del campo al frasco</h3><p>Siete pasos, de la selección de la planta a tus manos.</p></div><span class="t-cta">Recorrer el proceso ${IC.arrow}</span></a>
      <a class="tile s1x2" href="#/ingredientes" data-tilt data-r style="--i:5"><div class="t-art art-leaf"></div><span class="shine"></span><div style="display:grid;gap:10px"><span class="kicker">Plantas</span><h3>Ingredientes</h3></div>${plantSVG(INGREDIENTES[0]).replace('class="plant"', 'class="plant" style="height:130px"')}<span class="t-cta">Girar tarjetas ${IC.arrow}</span></a>
      <a class="tile s3x1 dk" href="#/empresas" data-tilt data-r style="--i:6"><span class="shine"></span><div style="display:grid;gap:8px"><span class="kicker">Empresas</span><h3>Maquila: tu marca, nuestra experiencia</h3></div><span class="t-cta">Abrir el cotizador ${IC.arrow}</span></a>
      <a class="tile s3x1" href="#/antes-y-despues" data-tilt data-r style="--i:7"><span class="shine"></span><div style="display:grid;gap:8px"><span class="kicker">Propuesta</span><h3>Antes y después</h3><p>Compará la portada actual con esta propuesta.</p></div><span class="t-cta">Abrir el comparador ${IC.arrow}</span></a>
      <a class="tile s6x1 gr" href="#/contacto" data-tilt data-r style="--i:8"><span class="shine"></span><div style="display:grid;gap:8px"><span class="kicker" style="color:var(--sol)">Contacto</span><h3>${EMPRESA.telefono}</h3><p>${EMPRESA.correo}</p></div><span class="t-cta">Ver datos de contacto ${IC.arrow}</span></a>
    </div>
  </div></section>

  <section class="sec dark round-top"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Quiénes somos</span><h2>Historia, misión y <em>visión</em>.</h2></div><a class="btn btn-ghost" href="#/nosotros" data-r style="--i:1">Ir a la sección Nosotros ${IC.arrow}</a></div>
    ${essenceBlock(true)}
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Nuestras líneas</span><h2>Diez líneas, <em>una</em> misma raíz.</h2></div><a class="link" href="#/productos" data-r>Ver todas ${IC.arrow}</a></div>
    <div class="cat-strip" data-r>${CATS.map((c, i) => `<a class="cat-orb" href="#/productos/${c.slug}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="orb" style="--c:${c.color}">${packHTML(inCat(c.slug)[0], 'sm')}</span><b>${c.name}</b><small>${inCat(c.slug).length} productos</small></a>`).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Favoritos</span><h2>Para empezar <em>hoy</em>.</h2></div><a class="link" href="#/asistente" data-r>¿No sabés cuál elegir? Hacé el test ${IC.arrow}</a></div>
    <div class="grid-p">${feat.map((p, i) => card(p, i)).join('')}</div>
  </div></section>

  <section class="sec" style="padding-top:0"><div class="wrap"><div class="promo-card" data-r style="grid-template-columns:1.2fr .8fr;align-items:center">${HILLS_SVG()}
    <div style="display:grid;gap:14px"><span class="kicker" style="color:var(--sol)">Club Herbarium</span><h2>Registrate y recibí tu <em style="color:var(--sol)">código</em> de bienvenida.</h2><p style="margin:0;color:#d6efd9">Un código único para tu primera compra: <span class="ph">[BENEFICIO A DEFINIR]</span></p></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end"><button class="btn btn-sun" data-action="open-register">${IC.gift} Registrarme ahora</button><a class="btn btn-ghost" href="#/club" style="--bg:rgba(255,255,255,.12);--fg:#fff">Ver el panel del club</a></div>
  </div></div></section>
  ${nextLinks('inicio')}`;
}

function vProductos() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Catálogo</span><h1>Productos <em>naturales</em>.</h1><p class="lead">${PRODUCTS.length} productos en 10 líneas, con los precios de la tienda en línea de Herbarium.</p></div></div>
    <div class="cat-mosaic">${CATS.map((c, i) => {
      const cls = i === 0 ? 'big' : (i === 6 || i === 9 ? 'wide' : '');
      const n = inCat(c.slug); const min = Math.min(...n.filter(p => p.price).map(p => priceNum(p.price)));
      return `<a class="cm ${cls}" href="#/productos/${c.slug}" style="--c:${c.color};--i:${i}" data-tilt data-r><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${c.name}</h3><small>${n.length} productos · desde ${money(min)}</small></div>${packHTML(n[0], cls === 'big' ? 'lg' : 'sm')}</a>`;
    }).join('')}</div>
    <div class="toolbar"><div><span class="kicker">Todos los productos</span></div>
      <label class="search"><span class="sr">Buscar producto</span>${IC.search}<input id="q" placeholder="Buscar: árnica, colágeno, té…" autocomplete="off"></label></div>
    <div class="chips" style="margin-bottom:18px">${CATS.map(c => `<a class="chip" href="#/productos/${c.slug}">${c.name}</a>`).join('')}</div>
    <div class="grid-p" id="allGrid">${PRODUCTS.map((p, i) => card(p, Math.min(i, 8))).join('')}</div>
    <p id="noRes" class="note" hidden>No encontramos productos con esa búsqueda. Probá con otra palabra o elegí una categoría.</p>
  </div></section>${nextLinks('productos')}`;
}

function vCategoria(slug: CatSlug) {
  const c = CAT[slug]; const list = inCat(slug); const idx = CATS.indexOf(c);
  const prev = CATS[(idx + CATS.length - 1) % CATS.length], next = CATS[(idx + 1) % CATS.length];
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="cat-hero" style="--c:${c.color}" data-r>${HILLS_SVG()}
      <div style="display:grid;gap:14px"><span class="kicker" style="color:var(--sol)">Línea ${String(idx + 1).padStart(2, '0')} de 10 · ${c.tagline}</span><h1>${c.name}</h1><p>${c.desc}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-sun btn-sm" href="#/asistente">Pedir una recomendación</a><a class="btn btn-ghost btn-sm" href="#/productos" style="--bg:rgba(255,255,255,.12);--fg:#fff">${IC.back} Todas las categorías</a></div></div>
      <div class="packs">${list.slice(0, 3).map(p => packHTML(p, 'md')).join('')}</div>
    </div>
    <div class="cat-layout">
      <aside class="panel side" aria-label="Categorías"><h4>Categorías</h4>${CATS.map(k => `<a href="#/productos/${k.slug}" class="${k.slug === slug ? 'on' : ''}">${k.name}<small>${inCat(k.slug).length}</small></a>`).join('')}</aside>
      <div>
        <div class="toolbar"><p style="margin:0;color:var(--muted);font-weight:600">${list.length} ${list.length === 1 ? 'producto' : 'productos'} en ${c.name}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-ghost btn-sm" href="#/productos/${prev.slug}">${IC.back} ${prev.name}</a><a class="btn btn-ghost btn-sm" href="#/productos/${next.slug}">${next.name} ${IC.arrow}</a></div></div>
        <div class="grid-p">${list.map((p, i) => card(p, i)).join('')}</div>
      </div>
    </div>
  </div></section>${nextLinks('productos')}`;
}

function vNosotros() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Nosotros</span><h1>Raíces en Barva, <em>mirada</em> en tu bienestar.</h1><p class="lead">Somos ${EMPRESA.nombre}, laboratorio costarricense de productos naturales.</p></div></div>
  </div></section>
  <section class="sec dark round-top" style="padding-top:70px"><div class="wrap">${essenceBlock(false)}</div></section>
  <section class="sec"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Línea de tiempo</span><h2>Nuestro <em>recorrido</em>.</h2></div></div>
    <div class="tl" data-r>
      ${[['2005', 'Nace Herbarium', 'Inicio de operaciones según el sitio oficial.'], ['[AÑO]', '[HITO]', '[Primera línea de productos, nueva planta, etc.]'], ['[AÑO]', '[HITO]', '[Registro, certificación o expansión]'], ['Hoy', `${PRODUCTS.length} productos`, '10 líneas y tienda en línea.']]
        .map(([y, t, d], i) => `<div class="panel" style="padding:22px;display:grid;gap:8px"><b style="font:500 2rem/1 var(--display);color:var(--verde)">${ph(y)}</b><b>${ph(t)}</b><span style="color:var(--muted);font-size:14px">${ph(d)}</span></div>`).join('')}
    </div>
    <div class="sec-head" style="margin-top:60px"><div data-r><span class="kicker">Valores</span><h2>Lo que nos <em>mueve</em>.</h2></div><span class="badge-val">${IC.spark} Propuesta · validar</span></div>
    <div class="next vals">${VALORES.map(([t, d], i) => `<div class="panel" data-r style="--i:${i};padding:24px;display:grid;gap:10px;align-content:start"><span class="ic-big" style="width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--cielo);color:var(--verde)">${[IC.shield, IC.leaf, IC.check, IC.users][i]}</span><b style="font:500 1.4rem/1 var(--display)">${t}</b><span style="color:var(--muted);font-size:14px">${d}</span></div>`).join('')}</div>
    <div class="sec-head" style="margin-top:60px"><div data-r><span class="kicker">Credibilidad</span><h2>Respaldo de <em>laboratorio</em>.</h2><p class="lead">Datos que el sector farmacéutico espera ver y que Herbarium debe confirmar.</p></div></div>
    <div class="diag">${[[IC.shield, 'Registro sanitario', '[N.º REGISTRO SANITARIO] ante el Ministerio de Salud'], [IC.flask, 'Buenas Prácticas de Manufactura', '[CERTIFICACIÓN BPM / ISO]'], [IC.users, 'Regencia', '[NOMBRE Y CÓDIGO DEL REGENTE]'], [IC.check, 'Trazabilidad', 'Número de lote y fecha de vencimiento en cada empaque [VALIDAR]']]
      .map(([i, t, d]) => `<div class="panel d" data-r><b><span class="ico" style="color:var(--verde)">${i}</span>${t}</b><p>${ph(d)}</p></div>`).join('')}</div>
  </div></section>${nextLinks('nosotros')}`;
}

function vIngredientes() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Ingredientes</span><h1>Conocé las <em>plantas</em>.</h1><p class="lead">Tocá cada tarjeta para girarla y ver en qué productos de Herbarium la encontrás. La manzanilla, el romero y la valeriana son los ingredientes que la empresa destaca en su historia.</p></div></div>
    <div class="flip-grid">${INGREDIENTES.map((ing, i) => {
      const uses = PRODUCTS.filter(p => ing.match.some(m => p.name.toLowerCase().includes(m) || p.desc.toLowerCase().includes(m))).slice(0, 3);
      return `<button class="flip" data-action="flip" data-r style="--i:${i % 8}" aria-label="Girar tarjeta de ${ing.name}">
        <div class="flip-in">
          <div class="face front">${plantSVG(ing)}<h3>${ing.name}</h3><span class="sci">${ing.sci}</span><span class="turn">Girar ${IC.arrow}</span></div>
          <div class="face back"><span class="kicker">${ing.sci}</span><h3>${ing.name}</h3><p>${ing.note}</p><p style="font-size:12.5px">Origen: <span class="ph">[ORIGEN DE LA MATERIA PRIMA]</span></p>
            <div class="uses">${uses.length ? uses.map(p => `<a href="#/productos/${p.cat}/${p.slug}" onclick="event.stopPropagation()">${esc(p.name)} ${IC.arrow}</a>`).join('') : `<a href="#/productos" onclick="event.stopPropagation()">Ver el catálogo ${IC.arrow}</a>`}</div></div>
        </div></button>`;
    }).join('')}</div>
  </div></section>${nextLinks('ingredientes')}`;
}

const STEP_ICONS = [IC.leaf, IC.search, IC.flask, IC.sun, IC.shield, IC.check, IC.cart];
function vProceso() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Proceso</span><h1>Del campo al <em>frasco</em>.</h1><p class="lead">Así acompaña Herbarium cada producto, paso a paso. Los datos entre corchetes deben confirmarse con el laboratorio.</p></div></div>
    <div class="steps" id="steps" data-r>
      <svg class="vine" viewBox="0 0 100 4" preserveAspectRatio="none"><path d="M4 2 H96" stroke="rgba(14,47,59,.12)" stroke-width="1" vector-effect="non-scaling-stroke"/><path id="vineP" d="M4 2 H96" stroke="#248D3F" stroke-width="3" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" style="transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)"/></svg>
      ${PASOS.map((s, i) => `<button class="step-b" data-action="step" data-i="${i}"><span class="n">${i + 1}</span><span>${s.t}</span></button>`).join('')}
    </div>
    <div class="step-stage panel" id="stepStage"></div>
  </div></section>${nextLinks('proceso')}`;
}
let stepI = 0, stepTimer = 0;
function renderStep(i: number) {
  stepI = (i + PASOS.length) % PASOS.length; const s = PASOS[stepI];
  $$('.step-b').forEach((b, k) => { b.classList.toggle('on', k === stepI); b.classList.toggle('done', k < stepI); });
  const vp = $('#vineP'); if (vp) vp.setAttribute('stroke-dashoffset', String(100 - (stepI / (PASOS.length - 1)) * 100));
  const st = $('#stepStage'); if (!st) return;
  st.innerHTML = `<div class="step-art"><span class="big-n">${stepI + 1}</span>${HILLS_SVG().replace('class="hills-svg"', `class="hills-svg" style="transform:translateX(${-stepI * 3}%) scaleX(1.2)"`)}<div class="s-ico step-anim">${STEP_ICONS[stepI]}</div></div>
    <div class="step-txt step-anim"><span class="kicker">Paso ${stepI + 1} de ${PASOS.length}</span><h2>${s.t}</h2><p class="lead" style="margin:0">${s.d}</p><p class="note">${IC.spark}<span>Dato a confirmar: ${ph(s.v)}</span></p>
      <div class="ctrl"><button class="btn btn-ghost btn-sm" data-action="step-prev">${IC.back} Paso anterior</button><button class="btn btn-sm" data-action="step-next">Siguiente paso ${IC.arrow}</button><button class="btn btn-dark btn-sm" data-action="step-play">${stepTimer ? IC.pause + ' Pausar recorrido' : IC.play + ' Reproducir recorrido'}</button></div></div>`;
}
function toggleStepPlay(force?: boolean) {
  const on = force ?? !stepTimer;
  if (stepTimer) { clearInterval(stepTimer); stepTimer = 0; }
  if (on) stepTimer = window.setInterval(() => { if (!$('#stepStage')) { clearInterval(stepTimer); stepTimer = 0; return; } renderStep(stepI + 1); }, 4200);
  renderStep(stepI);
}

/* ---------- Asistente ---------- */
const QUIZ = [
  { q: '¿Qué te gustaría acompañar?', k: 'need', o: [
    ['descanso', 'Descanso y relajación', 'Para cerrar el día con calma', IC.sun], ['movilidad', 'Movilidad y masajes', 'Articulaciones y músculos', IC.users],
    ['digestion', 'Bienestar digestivo', 'Después de las comidas', IC.leaf], ['piel', 'Piel y cabello', 'Rutina de cuidado personal', IC.spark],
    ['energia', 'Energía y actividad física', 'Días activos y entrenamiento', IC.play], ['temporada', 'Temporada fría', 'Clima frío y lluvioso', IC.shield]] },
  { q: '¿Cómo preferís usarlo?', k: 'format', o: [
    ['tomar', 'Para tomar', 'Té, cápsulas, polvo o jarabe', IC.flask], ['aplicar', 'Para aplicar', 'Ungüento, crema, sebo o shampoo', IC.leaf], ['any', 'Me da igual', 'Mostrame lo mejor para mí', IC.check]] },
  { q: '¿Para quién es?', k: 'who', o: [
    ['m', 'Para mí (mujer)', 'Fórmulas pensadas para mujer', IC.users], ['h', 'Para mí (hombre)', 'Fórmulas pensadas para hombre', IC.users], ['f', 'Para la familia', 'Opciones para todos', IC.users]] },
] as const;
let quizA: Record<string, string> = {}, quizStep = 0;
function vAsistente() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Asistente de bienestar</span><h1>Tu producto en <em>3 preguntas</em>.</h1><p class="lead">Respondé y te recomendamos productos reales del catálogo de Herbarium. No reemplaza la consulta con un profesional de salud.</p></div></div>
    <div class="panel quiz" id="quiz" data-r></div>
  </div></section>${nextLinks('asistente')}`;
}
function renderQuiz() {
  const el = $('#quiz'); if (!el) return;
  if (quizStep < 3) {
    const Q = QUIZ[quizStep];
    el.innerHTML = `<div class="qbar"><i style="width:${((quizStep) / 3) * 100 + 8}%"></i></div>
      <div class="qstep" style="display:grid;gap:18px"><span class="kicker">Pregunta ${quizStep + 1} de 3</span><h2>${Q.q}</h2>
      <div class="qopts">${Q.o.map(([v, t, d, ic]) => `<button class="qopt" data-action="quiz" data-k="${Q.k}" data-v="${v}"><span class="qi">${ic}</span><span>${t}<small>${d}</small></span></button>`).join('')}</div>
      ${quizStep > 0 ? `<button class="btn btn-ghost btn-sm" style="justify-self:start" data-action="quiz-back">${IC.back} Volver a la pregunta anterior</button>` : ''}</div>`;
    return;
  }
  const recs = recommend(quizA.need as Need, quizA.format, quizA.who);
  const labels = (k: string, v: string): string => ((QUIZ as any).find((q: any) => q.k === k).o.find((o: any) => o[0] === v) || [])[1] || '';
  el.innerHTML = `<div class="qbar"><i style="width:100%"></i></div><div class="qstep" style="display:grid;gap:18px">
    <span class="kicker">Tu recomendación</span><h2>Para <em>${(labels('need', quizA.need) || '').toLowerCase()}</em>, te sugerimos:</h2>
    <p class="note">${IC.check}<span>Elegiste: ${labels('need', quizA.need)} · ${labels('format', quizA.format)} · ${labels('who', quizA.who)}</span></p>
    <div class="grid-p">${recs.map((p, i) => card(p, i)).join('')}</div>
    <p class="note warn">${IC.shield}<span>Los productos naturales acompañan un estilo de vida saludable. Si estás embarazada, en lactancia, tomás medicamentos o tenés una condición de salud, consultá antes con un profesional.</span></p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost" data-action="quiz-restart">Volver a empezar el test</button><a class="btn" href="#/productos">Ver todo el catálogo ${IC.arrow}</a><button class="btn btn-sun" data-action="open-register">${IC.gift} Obtener mi código de promo</button></div></div>`;
  bindTilt(el);
}
function recommend(need: Need, format: string, who: string): Product[] {
  let list = PRODUCTS.filter(p => p.needs.includes(need));
  const f = list.filter(p => format === 'any' || CAT[p.cat].format === format); if (f.length) list = f;
  const score = (p: Product) => (p.who && p.who === who ? 3 : 0) - (p.who && who !== 'f' && p.who !== who ? 5 : 0) - (p.who && who === 'f' ? 1 : 0) + (p.needs[0] === need ? 1 : 0) + (p.price ? .5 : 0);
  return list.map((p, i) => ({ p, s: score(p) - i * .01 })).sort((a, b) => b.s - a.s).slice(0, 3).map(x => x.p);
}

/* ---------- Empresas / cotizador ---------- */
const PRESENTACIONES: Record<CatSlug, string[]> = {
  unguentos: ['Frasco 30 g', 'Frasco 60 g', 'Frasco 120 g'], capsulas: ['Frasco x30', 'Frasco x60', 'Frasco x90'], colagenos: ['Bolsa en polvo', 'Frasco de cápsulas'],
  cremas: ['Tubo', 'Frasco'], fibra: ['Bolsa'], jarabes: ['Frasco'], te: ['Caja de 30 sobres'], shampoo: ['Botella con dispensador'], sebo: ['Lata 30 g'], proteinas: ['Bote', 'Bolsa'],
};
function vEmpresas() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Empresas y maquila</span><h1>Tu marca, nuestra <em>experiencia</em>.</h1><p class="lead">Herbarium elabora productos naturales desde 2005. Configurá tu proyecto y generá una solicitud de cotización en segundos.</p></div></div>
    <div class="diag" style="margin-bottom:28px">${[[IC.flask, 'Formulación', 'Usá una fórmula de Herbarium o desarrollemos la tuya.'], [IC.leaf, 'Elaboración', 'Ungüentos, cápsulas, tés, cremas, shampoos y más.'], [IC.shield, 'Registro sanitario', 'Acompañamiento en el trámite [VALIDAR SERVICIO].'], [IC.spark, 'Marca propia', 'Etiqueta y empaque con tu identidad.']]
      .map(([i, t, d], k) => `<div class="panel d" data-r style="--i:${k}"><b><span style="color:var(--verde)">${i}</span>${t}</b><p>${ph(d)}</p></div>`).join('')}</div>
    <div class="quote">
      <form class="panel form" id="quoteForm" style="padding:28px" data-r>
        <h3>Cotizador de maquila</h3>
        <div class="row2"><div class="field"><label for="qType">Tipo de producto</label><select class="input" id="qType" name="tipo">${CATS.map(c => `<option value="${c.slug}">${c.name}</option>`).join('')}</select></div>
          <div class="field"><label for="qPres">Presentación</label><select class="input" id="qPres" name="pres"></select></div></div>
        <div class="field"><span class="lbl">Cantidad de unidades</span><div class="qty-big" id="qQtyOut">5 000</div><input type="range" id="qQty" name="qty" min="500" max="50000" step="500" value="5000" aria-label="Cantidad de unidades"><small style="color:var(--muted)">Mínimo de producción: <span class="ph">[MOQ]</span></small></div>
        <div class="field"><span class="lbl">Fórmula</span><div class="checks"><label><input type="radio" name="formula" value="Fórmula de Herbarium" checked> Fórmula de Herbarium</label><label><input type="radio" name="formula" value="Fórmula propia del cliente"> Fórmula propia</label><label><input type="radio" name="formula" value="Desarrollo de fórmula nueva"> Desarrollo nuevo</label></div></div>
        <div class="field"><span class="lbl">Servicios adicionales</span><div class="checks">${['Diseño de etiqueta', 'Trámite de registro sanitario', 'Fichas técnicas', 'Fotografía de producto'].map(s => `<label><input type="checkbox" name="serv" value="${s}"> ${s}</label>`).join('')}</div></div>
        <div class="row2"><div class="field"><label for="qCo">Empresa</label><input class="input" id="qCo" name="empresa" placeholder="Nombre de tu empresa" required></div><div class="field"><label for="qMail">Correo</label><input class="input" id="qMail" name="correo" type="email" placeholder="nombre@empresa.com" required></div></div>
        <button class="btn" type="submit">${IC.download} Generar solicitud de cotización</button>
      </form>
      <aside class="dark sum" style="border-radius:28px;--i:1" id="quoteSum" data-r></aside>
    </div>
  </div></section>${nextLinks('empresas')}`;
}
function quoteData() {
  const f = $('#quoteForm') as HTMLFormElement; if (!f) return null;
  const fd = new FormData(f); const tipo = fd.get('tipo') as CatSlug; const qty = +(fd.get('qty') || 5000);
  return { tipo, cat: CAT[tipo].name, pres: String(fd.get('pres') || ''), qty, formula: String(fd.get('formula')), serv: fd.getAll('serv').map(String), empresa: String(fd.get('empresa') || ''), correo: String(fd.get('correo') || '') };
}
function renderQuote(refreshPres = false) {
  const d = quoteData(); if (!d) return;
  const pres = $('#qPres') as HTMLSelectElement;
  if (refreshPres || !pres.options.length) { pres.innerHTML = PRESENTACIONES[d.tipo].map(p => `<option>${p}</option>`).join(''); d.pres = pres.value; }
  ($('#qQtyOut') as HTMLElement).textContent = d.qty.toLocaleString('es-CR');
  const t = TARIFAS[d.tipo];
  ($('#quoteSum') as HTMLElement).innerHTML = `<span class="kicker">Resumen en vivo</span><h3>${d.cat} · ${esc(d.pres)}</h3>
    <div><div class="sum-row"><span>Unidades</span><b>${d.qty.toLocaleString('es-CR')}</b></div>
    <div class="sum-row"><span>Fórmula</span><b>${d.formula}</b></div>
    <div class="sum-row"><span>Servicios</span><b style="text-align:right">${d.serv.length ? d.serv.join(', ') : 'Ninguno'}</b></div>
    <div class="sum-row"><span>Precio por unidad</span><b>${t ? money(t) : '<span class="ph">[TARIFA HERBARIUM]</span>'}</b></div>
    <div class="sum-row"><span>Plazo estimado</span><b><span class="ph">[PLAZO DE PRODUCCIÓN]</span></b></div></div>
    <div><small style="color:#9fb8bf">Total estimado</small><div class="sum-total">${t ? money(t * d.qty) : '<span class="ph">[SE CALCULA CON LAS TARIFAS]</span>'}</div></div>
    <p class="note" style="background:rgba(255,255,255,.06);color:#c3d4d9">${IC.spark}<span>Herbarium confirma precio y plazo al revisar la solicitud.</span></p>`;
}

/* ---------- Club ---------- */
function vClub() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Club Herbarium</span><h1>Registro con <em>promoción</em>.</h1><p class="lead">Así funciona el pop-up de registro: cada persona recibe un código único. Abajo está el panel para ver y exportar los registros (en esta demo se guardan solo en este navegador).</p></div>
      <button class="btn btn-sun" data-action="open-register" data-r>${IC.gift} Ver el pop-up de registro</button></div>
    <div class="club">
      <div class="promo-card" data-r>${HILLS_SVG()}<span class="kicker" style="color:var(--sol)">Registro</span><h2>Bienvenida con <em style="color:var(--sol)">beneficio</em>.</h2>
        <p style="margin:0;color:#d6efd9">Beneficio para la primera compra: <span class="ph">[BENEFICIO A DEFINIR]</span>. Vigencia: <span class="ph">[VIGENCIA]</span>.</p>
        ${regForm('club')}</div>
      <div class="panel panel-users" data-r style="--i:1" id="usersPanel"></div>
    </div>
  </div></section>${nextLinks('club')}`;
}
function regForm(origin: string) {
  return `<form class="form reg-form" data-origin="${origin}" novalidate>
    <div class="field"><label>Nombre completo</label><input class="input" name="nombre" required placeholder="Tu nombre" autocomplete="name"></div>
    <div class="row2"><div class="field"><label>Correo</label><input class="input" name="correo" type="email" required placeholder="tu@correo.com" autocomplete="email"></div>
    <div class="field"><label>Teléfono (opcional)</label><input class="input" name="telefono" placeholder="8888-8888" autocomplete="tel"></div></div>
    <div class="field"><label>¿Qué te interesa?</label><select class="input" name="interes">${CATS.map(c => `<option>${c.name}</option>`).join('')}<option>Maquila para mi marca</option></select></div>
    <label class="consent"><input type="checkbox" name="ok" required> <span>Acepto recibir promociones de Herbarium y el tratamiento de mis datos según la <span class="ph">[POLÍTICA DE PRIVACIDAD]</span>.</span></label>
    <p class="form-err note warn" hidden></p>
    <button class="btn btn-sun" type="submit">${IC.gift} Registrarme y recibir mi código</button>
  </form>`;
}
function renderUsers(highlight?: string) {
  const el = $('#usersPanel'); if (!el) return;
  const U = users(); const today = new Date().toISOString().slice(0, 10);
  const top = Object.entries(U.reduce((a: Record<string, number>, u) => { a[u.interes] = (a[u.interes] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1])[0];
  el.innerHTML = `<div class="pu-head"><div><span class="kicker">Panel de registros</span><h3 style="margin-top:6px">Usuarios registrados</h3></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" data-action="export-csv" ${U.length ? '' : 'disabled'}>${IC.download} Exportar a Excel (CSV)</button><button class="btn btn-ghost btn-sm" data-action="export-json" ${U.length ? '' : 'disabled'}>${IC.download} Exportar JSON</button><button class="btn btn-ghost btn-sm" data-action="clear-users" ${U.length ? '' : 'disabled'}>${IC.trash} Borrar todo</button></div></div>
    <div class="stats"><div class="stat"><b>${U.length}</b><span>Registrados</span></div><div class="stat"><b>${U.filter(u => u.fecha.slice(0, 10) === today).length}</b><span>Hoy</span></div><div class="stat"><b style="font-size:1.2rem;line-height:1.6rem">${top ? esc(top[0]) : '—'}</b><span>Interés principal</span></div></div>
    ${U.length ? `<div class="tbl-wrap"><table><thead><tr><th>#</th><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Interés</th><th>Código</th><th>Fecha</th><th>Origen</th><th></th></tr></thead><tbody>
      ${U.slice().reverse().map((u, i) => `<tr class="${u.id === highlight ? 'fresh' : ''}"><td>${U.length - i}</td><td>${esc(u.nombre)}</td><td>${esc(u.correo)}</td><td>${esc(u.telefono || '—')}</td><td>${esc(u.interes)}</td><td><code>${u.codigo}</code></td><td>${new Date(u.fecha).toLocaleString('es-CR')}</td><td>${esc(u.origen)}</td><td><button class="btn btn-ghost btn-icon btn-sm" data-action="delete-user" data-id="${u.id}" aria-label="Eliminar registro de ${esc(u.nombre)}">${IC.trash}</button></td></tr>`).join('')}
    </tbody></table></div>` : `<div class="empty">${emblem(56)}<b>Todavía no hay registros</b><span>Registrá a alguien con el formulario o con el pop-up y aparecerá aquí al instante.</span></div>`}`;
}
function registerUser(form: HTMLFormElement) {
  const fd = new FormData(form); const err = $('.form-err', form) as HTMLElement;
  const nombre = String(fd.get('nombre') || '').trim(), correo = String(fd.get('correo') || '').trim().toLowerCase();
  const msg = !nombre ? 'Escribí tu nombre.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? 'Revisá el correo: parece incompleto.' : !fd.get('ok') ? 'Para registrarte necesitamos tu aceptación.' : '';
  if (msg) { err.textContent = msg; err.hidden = false; return; }
  err.hidden = true;
  const U = users(); let u = U.find(x => x.correo === correo); const existed = !!u;
  if (!u) {
    u = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), nombre, correo, telefono: String(fd.get('telefono') || '').trim(), interes: String(fd.get('interes')), codigo: newCode(), fecha: new Date().toISOString(), origen: form.dataset.origin === 'popup' ? 'Pop-up' : 'Sección Club' };
    U.push(u); store.set('herb_users', U);
  }
  session.set('herb_popup', '1');
  showCode(u, existed);
  renderUsers(u.id);
  leafBurst();
}
function showCode(u: User, existed: boolean) {
  openModal(`<div class="reg"><div class="promo-card" style="border-radius:0">${HILLS_SVG()}<span class="kicker" style="color:var(--sol)">${existed ? 'Ya estabas registrado' : '¡Bienvenido al club!'}</span><h2>${esc(u.nombre.split(' ')[0])}, este es tu <em style="color:var(--sol)">código</em>.</h2><p style="margin:0;color:#d6efd9">Beneficio: <span class="ph">[BENEFICIO A DEFINIR]</span></p></div>
    <div class="form" style="padding:34px;align-content:center"><span class="kicker">Código único</span><div class="code" style="color:var(--verde);border-color:var(--verde);background:#fff"><span>${u.codigo}</span><button class="btn btn-ghost btn-icon btn-sm" data-action="copy" data-text="${u.codigo}" aria-label="Copiar código">${IC.copy}</button></div>
    <p style="margin:0;color:var(--muted)">Usalo en el carrito para aplicar tu promoción. Te lo enviamos a <b>${esc(u.correo)}</b> <span class="ph">[ENVÍO AUTOMÁTICO POR CORREO]</span>.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="#/productos" data-action="close-modal">Ir a comprar con mi código ${IC.arrow}</a><a class="btn btn-ghost" href="#/club" data-action="close-modal">Ver panel de registros</a></div></div></div>`, 'reg-modal');
}
function openRegister() {
  openModal(`<button class="btn btn-ghost btn-icon x" data-action="close-modal" aria-label="Cerrar registro">${IC.close}</button><div class="reg">
    <div class="promo-card" style="border-radius:0">${HILLS_SVG()}<span class="kicker" style="color:var(--sol)">Club Herbarium</span><h2>Tu bienestar tiene <em style="color:var(--sol)">premio</em>.</h2><p style="margin:0;color:#d6efd9">Registrate y recibí un código único para tu primera compra: <span class="ph">[BENEFICIO A DEFINIR]</span>.</p>
      <div style="display:grid;gap:8px;font-size:14px;color:#e4f4e6"><span>${IC.check} Código único e intransferible</span><span>${IC.check} Novedades y lanzamientos</span><span>${IC.check} Sin costo</span></div></div>
    <div style="padding:34px">${regForm('popup')}</div></div>`, 'reg-modal');
  session.set('herb_popup', '1');
}

/* ---------- Antes y después ---------- */
const DIAG: [string, string, string, string][] = [
  ['#c0392b', 'Fechas que se contradicen', 'La portada muestra "Desde el 2025" mientras "¿Quiénes somos?" dice "Desde 2005". Un perfil externo indica 2006.', 'Una sola fecha de fundación en todo el sitio.'],
  ['#c0392b', 'Precios distintos para el mismo producto', 'Ej.: Valeriana ₡7,250.00 vs ₡6,905.00; Crema Facial ₡5,265.00 vs ₡5,015.00; Fibra C-San ₡2,615.00 vs ₡2,930.00.', 'Precio único sincronizado desde el inventario.'],
  ['#c0392b', 'Afirmaciones médicas en fichas', 'Textos como "regenerar los huesos", "generar cartílago" o ayuda para "artritis" y "varices" son de riesgo regulatorio.', 'Lenguaje de bienestar: "ayuda a", "acompaña".'],
  ['#D5C835', 'Productos sin precio visible', 'Shampoo equino lavanda + menta y Shampoo Equino de Cebolla aparecen sin precio.', 'Precio o botón "Consultar disponibilidad".'],
  ['#D5C835', 'Títulos de página incompletos', 'Las pestañas muestran "Ungüento Cascabel - - Herbarium" o "Productos -": se ve descuidado y perjudica el SEO.', 'Títulos y descripciones por página.'],
  ['#D5C835', 'Sin misión, visión ni respaldo técnico', 'No se publican misión, visión, registro sanitario, BPM ni regencia: señales clave de credibilidad farmacéutica.', 'Sección Nosotros y sellos de respaldo.'],
  ['#8EB24F', 'Nombres sin tildes ni formato', '"CREMA FACIAL COLAGENO", "Arnica y Calendula": mayúsculas y tildes inconsistentes.', 'Guía de estilo para nombres de producto.'],
  ['#8EB24F', 'Marca dividida en dos dominios', 'herbariumcr.com sigue en línea con pie "2006-2016" y otro catálogo.', 'Redirigir al dominio oficial.'],
  ['#8EB24F', 'Experiencia lineal y plana', 'Fondo petróleo plano, catálogo genérico de tienda y sin rutas de decisión (test, maquila, club).', 'Mapa de inicio, asistente, cotizador y registro.'],
];
function vAntes() {
  const before = ASSETS.portada
    ? `<img src="${ASSETS.portada}" alt="Portada actual de herbarium.co.cr" style="width:100%;height:100%;object-fit:cover;object-position:top">`
    : `<div class="old"><div class="o-nav"><span class="o-logo">[LOGO]</span><span><i>Inicio</i><i>Productos</i><i>Sobre nosotros</i><i>Contáctanos</i></span></div><div class="o-banner">Desde el 2025</div>
       <div class="o-grid">${['Ungüento Cascabel ₡4,990.00', 'Cápsulas Energy Plus ₡5,720.00', 'Té Sorosi ₡2,580.00', 'Fibra C-San Bolsa ₡2,615.00'].map(t => `<div>${t}<em>Añadir al carrito</em></div>`).join('')}</div>
       <span class="o-note">Recreación esquemática · reemplazar por captura real (assets/portada-actual.png)</span></div>`;
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Propuesta</span><h1>Antes y <em>después</em>.</h1><p class="lead">Arrastrá el control para comparar la portada actual de herbarium.co.cr con la propuesta.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap" data-r><button class="btn btn-ghost btn-sm" data-action="compare" data-pos="96">Ver el antes</button><button class="btn btn-ghost btn-sm" data-action="compare" data-pos="50">Ver mitad y mitad</button><button class="btn btn-sm" data-action="compare" data-pos="4">Ver el después</button></div></div>
    <div class="cmp" id="cmp" style="--pos:50%" data-r>
      <div class="side-a">${before}</div>
      <div class="side-b"><div class="new"><div class="n-nav"><span style="display:flex;gap:.6em;align-items:center">${emblem(26)} Herbarium</span><span>Productos · Nosotros · Club</span></div>
        <div class="n-copy"><b>La sabiduría de las plantas, con <em>rigor</em> de laboratorio.</b><span>${PRODUCTS.length} productos naturales desde 2005.</span><i>Ver el catálogo →</i></div>${HILLS_SVG()}</div></div>
      <span class="tag a">Antes</span><span class="tag b">Después</span>
      <div class="handle" id="cmpH"><b>⇆</b></div>
    </div>
    <div class="sec-head" style="margin-top:60px"><div data-r><span class="kicker">Diagnóstico</span><h2>Qué <em>resolvemos</em>.</h2><p class="lead">Hallazgos del sitio actual. Rojo: afecta la credibilidad o el cumplimiento. Amarillo: afecta la conversión. Verde: mejora de experiencia.</p></div></div>
    <div class="diag">${DIAG.map(([c, t, d, f], i) => `<div class="panel d" data-r style="--i:${i % 6}"><b><span class="sev" style="background:${c}"></span>${t}</b><p>${esc(d)}</p><span class="fix">${IC.check} ${f}</span></div>`).join('')}</div>
  </div></section>${nextLinks('antes')}`;
}
function setCompare(pos: number) { const c = $('#cmp'); if (c) c.style.setProperty('--pos', Math.max(0, Math.min(100, pos)) + '%'); }

/* ---------- Contacto ---------- */
function vContacto() {
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('San Pedro de Barva, Heredia, Costa Rica');
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Contacto</span><h1>Hablemos de tu <em>bienestar</em>.</h1><p class="lead">Escribinos, llamanos o visitanos en Barva de Heredia.</p></div></div>
    <div class="contact">
      <div class="cinfo">
        <a href="tel:${EMPRESA.telLink}" data-r><span class="ico">${IC.phone}</span><span><small>Llamar</small><b>${EMPRESA.telefono}</b></span></a>
        <a href="mailto:${EMPRESA.correo}" data-r style="--i:1"><span class="ico">${IC.mail}</span><span><small>Escribir un correo</small><b>${EMPRESA.correo}</b></span></a>
        <a href="${maps}" target="_blank" rel="noopener" data-r style="--i:2"><span class="ico">${IC.pin}</span><span><small>Abrir en Google Maps</small><b>${EMPRESA.direccion}</b></span></a>
        <div class="ci2" data-r style="--i:3"><span class="ico">${IC.sun}</span><span><small>Horario</small><b><span class="ph">[HORARIO DE ATENCIÓN]</span></b></span></div>
        <div class="ci2" data-r style="--i:4"><span class="ico">${IC.phone}</span><span><small>WhatsApp</small><b><span class="ph">[CONFIRMAR SI ${EMPRESA.telefono} TIENE WHATSAPP]</span></b></span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;--i:5" data-r><a class="btn btn-ghost btn-sm" href="${EMPRESA.facebook}" target="_blank" rel="noopener">Abrir Facebook ${IC.ext}</a><a class="btn btn-ghost btn-sm" href="${EMPRESA.instagram}" target="_blank" rel="noopener">Abrir Instagram ${IC.ext}</a><a class="btn btn-ghost btn-sm" href="${EMPRESA.tienda}" target="_blank" rel="noopener">Ir a la tienda actual ${IC.ext}</a></div>
      </div>
      <form class="panel form" id="contactForm" style="padding:28px;--i:1" data-r>
        <h3>Envianos un mensaje</h3>
        <div class="row2"><div class="field"><label for="cN">Nombre</label><input class="input" id="cN" required placeholder="Tu nombre"></div><div class="field"><label for="cE">Correo</label><input class="input" id="cE" type="email" required placeholder="tu@correo.com"></div></div>
        <div class="field"><label for="cT">Motivo</label><select class="input" id="cT"><option>Consulta sobre un producto</option><option>Distribución para mi negocio</option><option>Maquila para mi marca</option><option>Otro</option></select></div>
        <div class="field"><label for="cM">Mensaje</label><textarea class="input" id="cM" rows="5" required placeholder="¿En qué te ayudamos?"></textarea></div>
        <button class="btn" type="submit">Enviar mensaje ${IC.arrow}</button>
        <p class="note">${IC.spark}<span>Demo: el formulario no envía datos. En producción se conecta a <span class="ph">[CORREO O CRM DE DESTINO]</span>.</span></p>
      </form>
    </div>
  </div></section>${nextLinks('contacto')}`;
}

/* ---------- Carrito ---------- */
function vCarrito() {
  return `<section class="sec" style="padding-top:24px"><div class="wrap">
    <div class="sec-head"><div data-r><span class="kicker">Carrito de demostración</span><h1>Tu <em>pedido</em>.</h1></div><a class="link" href="#/productos" data-r>${IC.back} Seguir comprando</a></div>
    <div class="cart" id="cartView"></div>
  </div></section>${nextLinks('carrito')}`;
}
function renderCart() {
  const el = $('#cartView'); if (!el) return;
  if (!cart.length) { el.innerHTML = `<div class="panel empty" style="grid-column:1/-1">${emblem(64)}<h3>Tu carrito está vacío</h3><span>Agregá productos desde el catálogo o pedí una recomendación.</span><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn" href="#/productos">Ir al catálogo ${IC.arrow}</a><a class="btn btn-ghost" href="#/asistente">Hacer el test de 3 preguntas</a></div></div>`; return; }
  const sub = cart.reduce((a, i) => a + priceNum(BY_SLUG[i.slug].price) * i.qty, 0);
  const applied = store.get<string>('herb_applied', '');
  el.innerHTML = `<div class="panel" style="padding:8px">${cart.map(i => { const p = BY_SLUG[i.slug]; return `<div class="ci"><a class="cm-m" href="#/productos/${p.cat}/${p.slug}" aria-label="Ver ${esc(p.name)}">${photoSrc(p) ? media(p, 'sm') : packHTML(p, 'sm')}</a>
      <div><h3>${esc(p.name)}</h3><div class="sub">${CAT[p.cat].name} · ${priceHTML(p)} c/u</div></div>
      <div style="display:flex;gap:10px;align-items:center"><div class="qty"><button data-action="qty-dec" data-slug="${p.slug}" aria-label="Quitar uno">${IC.minus}</button><output>${i.qty}</output><button data-action="qty-inc" data-slug="${p.slug}" aria-label="Agregar uno">${IC.plus}</button></div><b style="min-width:110px;text-align:right">${money(priceNum(p.price) * i.qty)}</b><button class="btn btn-ghost btn-icon btn-sm" data-action="remove" data-slug="${p.slug}" aria-label="Eliminar ${esc(p.name)}">${IC.trash}</button></div></div>`; }).join('')}</div>
    <aside class="dark sum" style="border-radius:28px;padding:28px;display:grid;gap:14px">
      <span class="kicker">Resumen</span>
      <div class="sum-row"><span>Productos</span><b>${cartCount()}</b></div>
      <div class="sum-row"><span>Subtotal</span><b>${money(sub)}</b></div>
      <div class="sum-row"><span>Promoción</span><b>${applied ? `<code style="color:var(--sol)">${applied}</code> · <span class="ph">[BENEFICIO]</span>` : '—'}</b></div>
      <div class="sum-row"><span>IVA</span><b><span class="ph">[VALIDAR SI EL PRECIO INCLUYE IVA]</span></b></div>
      <div class="sum-row"><span>Envío</span><b><span class="ph">[TARIFA DE ENVÍO]</span></b></div>
      <form id="codeForm" style="display:flex;gap:8px"><input class="input" name="code" placeholder="Código del club (HERB-…)" aria-label="Código de promoción" style="background:rgba(255,255,255,.95)"><button class="btn btn-sun btn-sm" type="submit">Aplicar código</button></form>
      <p class="code-msg note" hidden style="background:rgba(255,255,255,.06);color:#c3d4d9"></p>
      <button class="btn btn-sun" data-action="checkout">Finalizar pedido de demostración ${IC.arrow}</button>
      <button class="btn btn-ghost btn-sm" data-action="clear-cart">${IC.trash} Vaciar carrito</button>
    </aside>`;
}
function checkout() {
  const lines = cart.map(i => `• ${i.qty} × ${BY_SLUG[i.slug].name} (${BY_SLUG[i.slug].price || '[PRECIO]'})`).join('\n');
  const total = money(cart.reduce((a, i) => a + priceNum(BY_SLUG[i.slug].price) * i.qty, 0));
  const msg = `Hola Herbarium, quiero hacer este pedido:\n${lines}\nSubtotal: ${total}`;
  openModal(`<button class="btn btn-ghost btn-icon x" data-action="close-modal" aria-label="Cerrar">${IC.close}</button><div style="padding:40px;display:grid;gap:16px">
    <span class="kicker">Pedido de demostración</span><h2>¡Listo! Así se vería la <em>confirmación</em>.</h2>
    <pre style="white-space:pre-wrap;background:#fff;padding:18px;border-radius:16px;box-shadow:inset 0 0 0 1px var(--line);font:14px/1.6 var(--sans);margin:0">${esc(msg)}</pre>
    <p class="note">${IC.spark}<span>En producción: pago en línea <span class="ph">[PASARELA DE PAGO]</span> o envío del pedido por WhatsApp <span class="ph">[CONFIRMAR NÚMERO]</span>.</span></p>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/${EMPRESA.telLink.replace('+', '')}?text=${encodeURIComponent(msg)}">Enviar pedido por WhatsApp ${IC.ext}</a><button class="btn btn-ghost" data-action="close-modal">Seguir revisando el carrito</button></div></div>`);
}

function v404() {
  return `<section class="sec"><div class="wrap" style="display:grid;gap:18px;justify-items:start"><span class="kicker">Ruta no encontrada</span><h1>Esta página no <em>existe</em>.</h1><p class="lead">Volvé al mapa del inicio o elegí una sección del menú.</p><a class="btn" href="#/inicio">${IC.back} Volver al inicio</a></div></section>${nextLinks('')}`;
}

/* --------------------------------------------------------------------------
   12. Vista rápida (ruta #/productos/<categoría>/<producto>)
   -------------------------------------------------------------------------- */
let quickOpen = '', quickPushed = false, quickMoved = false;
function quickHTML(p: Product) {
  const c = CAT[p.cat]; const list = inCat(p.cat); const i = list.indexOf(p);
  const prev = list[(i + list.length - 1) % list.length], next = list[(i + 1) % list.length];
  return `<button class="btn btn-ghost btn-icon x" data-action="close-quick" aria-label="Cerrar vista rápida">${IC.close}</button>
  <div class="qv" style="--pc:${c.color}">
    <div class="qv-media" id="qvMedia"><div class="rot" id="qvRot">${media(p, 'lg')}</div></div>
    <div class="qv-info">
      <a class="kicker" href="#/productos/${p.cat}" style="text-decoration:none">${c.name}</a>
      <h2 style="font-size:clamp(1.8rem,3vw,2.6rem)">${esc(p.name)}</h2>
      <div class="pr">${priceHTML(p)}</div>
      <p style="margin:0;color:var(--muted)">${ph(esc(p.desc))}</p>
      <dl><dt>Modo de uso</dt><dd>${p.use ? esc(p.use) : '<span class="ph">[MODO DE USO]</span>'}</dd><dt>Ingredientes</dt><dd><span class="ph">[LISTA DE INGREDIENTES]</span></dd><dt>Registro</dt><dd><span class="ph">[N.º REGISTRO SANITARIO]</span></dd><dt>Presentación</dt><dd><span class="ph">[CONTENIDO NETO]</span></dd></dl>
      ${p.check ? `<p class="note warn">${IC.spark}<span>Validar precio o dato: ${esc(p.check)}</span></p>` : ''}
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="qty"><button data-action="qv-dec" aria-label="Quitar uno">${IC.minus}</button><output id="qvQty">1</output><button data-action="qv-inc" aria-label="Agregar uno">${IC.plus}</button></div>
        <button class="btn" data-action="qv-add" data-slug="${p.slug}" ${p.price ? '' : 'disabled'}>${IC.cart} Agregar al carrito</button>
      </div>
      ${p.url ? `<a class="link" href="${EMPRESA.tienda}/producto/${p.slug}/" target="_blank" rel="noopener">Ver la ficha en la tienda actual ${IC.ext}</a>` : ''}
      <p class="note">${IC.shield}<span>Producto natural. Acompaña un estilo de vida saludable y no sustituye la consulta médica.</span></p>
    </div>
  </div>
  <div class="qv-nav"><a class="btn btn-ghost btn-sm" href="#/productos/${p.cat}/${prev.slug}">${IC.back} ${esc(shortName(prev.name))}</a><a class="btn btn-ghost btn-sm" href="#/productos/${p.cat}">Ver toda la línea ${c.name}</a><a class="btn btn-ghost btn-sm" href="#/productos/${p.cat}/${next.slug}">${esc(shortName(next.name))} ${IC.arrow}</a></div>`;
}

/* --------------------------------------------------------------------------
   13. Modal, toast, efectos
   -------------------------------------------------------------------------- */
let modalKind = '';
function openModal(html: string, cls = '') {
  const m = $('#modal')!, d = $('#dialog')!;
  m.className = 'modal ' + cls; d.innerHTML = html; m.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => m.classList.add('open'));
  document.documentElement.style.overflow = 'hidden'; modalKind = cls || 'generic';
  modalOpen = true; Scene3D.pause(true);
  bindTilt(d);
  setTimeout(() => { const f = $('input,button,a', d) as HTMLElement | null; f?.focus({ preventScroll: true }); }, 350);
}
function closeModal() {
  const m = $('#modal')!; m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = ''; modalKind = ''; quickOpen = '';
  modalOpen = false; Scene3D.pause(false);
}
function closeQuick() {
  if (!quickOpen) return closeModal();
  const p = BY_SLUG[quickOpen];
  if (quickPushed && !quickMoved) history.back(); else location.hash = `#/productos/${p.cat}`;
}
let toastT = 0;
function toast(html: string) {
  const t = $('#toast')!; t.innerHTML = html; t.classList.add('on');
  clearTimeout(toastT); toastT = window.setTimeout(() => t.classList.remove('on'), 3400);
}
function leafBurst() {
  if (reduced) return;
  const w = document.createElement('div'); w.className = 'leafburst';
  const cols = ['#248D3F', '#8EB24F', '#E7E401', '#D5C835'];
  w.innerHTML = Array.from({ length: 46 }, (_, i) => `<i style="left:50%;top:45%;--c:${cols[i % 4]};--dx:${(Math.random() - .5) * 900}px;--dy:${(Math.random() - .2) * 700}px;--r:${Math.random() * 720}deg;--d:${1.2 + Math.random()}s"></i>`).join('');
  document.body.appendChild(w); setTimeout(() => w.remove(), 2600);
}

function bindTilt(root: ParentNode = document) {
  if (reduced || !finePointer) return;
  $$('[data-tilt]', root).forEach(el => {
    if ((el as any)._tilt) return; (el as any)._tilt = 1;
    const shine = el.querySelector('.shine') as HTMLElement | null;
    let r: DOMRect | null = null, px = 0, py = 0, queued = 0;
    const apply = () => {
      queued = 0; if (!r) return;
      const x = (px - r.left) / r.width, y = (py - r.top) / r.height;
      el.style.transform = `perspective(1000px) rotateX(${((.5 - y) * 9).toFixed(2)}deg) rotateY(${((x - .5) * 11).toFixed(2)}deg)`;
      if (shine) shine.style.background = `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%,rgba(255,255,255,.55),transparent 40%)`;
    };
    el.addEventListener('pointerenter', () => { r = el.getBoundingClientRect(); el.style.willChange = 'transform'; });
    el.addEventListener('pointermove', (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!r) r = el.getBoundingClientRect(); if (!queued) queued = requestAnimationFrame(apply); }, { passive: true });
    el.addEventListener('pointerleave', () => { if (queued) cancelAnimationFrame(queued); queued = 0; r = null; el.style.transform = ''; el.style.willChange = ''; });
  });
}
function bindReveal(root: ParentNode) {
  const els = $$('[data-r]', root);
  const vh = innerHeight;
  const below = els.filter(e => e.getBoundingClientRect().top > vh * 1.02);
  below.forEach(e => { e.removeAttribute('data-r'); e.classList.add('reveal'); });
  if (!below.length) return;
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
  below.forEach(e => io.observe(e));
}
function magnet() {
  if (reduced || !finePointer) return;
  let cur: HTMLElement | null = null, rect: DOMRect | null = null, ex = 0, ey = 0, queued = 0;
  const apply = () => { queued = 0; if (cur && rect) cur.style.translate = `${((ex - rect.left - rect.width / 2) * .18).toFixed(1)}px ${((ey - rect.top - rect.height / 2) * .28).toFixed(1)}px`; };
  document.addEventListener('pointermove', e => {
    const t = e.target as HTMLElement; let b = t.closest?.('.btn') as HTMLElement | null;
    if (b && b.closest('.pa')) b = null;
    if (b !== cur) { if (cur) cur.style.translate = ''; cur = b; rect = b ? b.getBoundingClientRect() : null; }
    if (!cur) return; ex = e.clientX; ey = e.clientY; if (!queued) queued = requestAnimationFrame(apply);
  }, { passive: true });
  addEventListener('scroll', () => { if (cur) { cur.style.translate = ''; cur = null; } }, { passive: true });
}
function cursor() {
  const c = $('#cursor'), d = $('#cursorDot'); if (!c || !d) return;
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  let raf = 0, big = false, last = 0;
  const loop = (now: number) => {
    const k = last ? Math.min((now - last) / 16.7, 4) : 1; last = now; const f = 1 - Math.pow(1 - .16, k);
    cx += (x - cx) * f; cy += (y - cy) * f; c.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > .3 ? requestAnimationFrame(loop) : (last = 0, 0);
  };
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY; d.style.transform = `translate3d(${x}px,${y}px,0)`;
    const b = !!(e.target as HTMLElement).closest?.('a,button,.flip,[data-tilt],input,select,label');
    if (b !== big) { big = b; c.classList.toggle('big', b); }
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
}
(window as any).__herbScene = Scene3D;
/** Medidor de FPS para la presentación: tecla F o #/...?fps en la dirección. */
function fpsMeter() {
  const el = document.createElement('div'); el.className = 'fps'; el.hidden = true; document.body.appendChild(el);
  let on = false, frames = 0, t0 = 0, raf = 0, worst = 0, prev = 0;
  const tick = (now: number) => {
    frames++; if (prev) worst = Math.max(worst, now - prev); prev = now;
    if (now - t0 >= 500) {
      const fps = Math.round(frames * 1000 / (now - t0)); const q = Scene3D.active() ? ` · 3D ${Scene3D.quality().toFixed(2)}x${Scene3D.antialias() ? '' : ' sin AA'}` : '';
      el.textContent = `${fps} FPS · ${worst.toFixed(0)} ms${q}`; el.style.color = fps >= 55 ? '#E7E401' : fps >= 40 ? '#f0b429' : '#ff6b6b';
      frames = 0; t0 = now; worst = 0;
    }
    raf = requestAnimationFrame(tick);
  };
  const toggle = (v = !on) => { on = v; el.hidden = !on; cancelAnimationFrame(raf); if (on) { frames = 0; prev = 0; t0 = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('keydown', e => { if ((e.key === 'f' || e.key === 'F') && !(e.target as HTMLElement).closest('input,textarea,select')) toggle(); });
  if (/[?&]fps\b/.test(location.search + location.hash)) toggle(true);
}
function scrollFX() {
  const pr = $('#progress')!, root = document.documentElement, hills = $('.bg-hills')!, tex = $('.bg-tex')!;
  let queued = 0, max = 1;
  const measure = () => { max = Math.max(1, root.scrollHeight - innerHeight); };
  const apply = () => {
    queued = 0; const y = scrollY;
    pr.style.transform = `scaleX(${Math.min(1, y / max).toFixed(4)})`;
    hills.style.transform = `translate3d(0,${(y * .04).toFixed(1)}px,0)`;
    tex.style.transform = `translate3d(0,${(-y * .06).toFixed(1)}px,0) rotate(-4deg)`;
  };
  const on = () => { if (!queued) queued = requestAnimationFrame(apply); };
  addEventListener('scroll', on, { passive: true });
  addEventListener('resize', () => { measure(); on(); });
  addEventListener('hashchange', () => setTimeout(() => { measure(); on(); }, 1400));
  new ResizeObserver(() => { measure(); on(); }).observe(document.body);
  measure(); apply();
}

/* --------------------------------------------------------------------------
   14. Router con transiciones
   -------------------------------------------------------------------------- */
interface Route { parts: string[] }
function parse(): Route {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, '').split('?')[0]).replace(/\/+$/, '');
  return { parts: h ? h.split('/') : ['inicio'] };
}
function viewKey(r: Route) { return r.parts[0] === 'productos' ? r.parts.slice(0, 2).join('/') : r.parts[0]; }
function crumbs(r: Route): [string, string][] {
  const c: [string, string][] = [['Inicio', '#/inicio']]; const [a, b, s] = r.parts;
  if (a === 'inicio') return c;
  c.push([TITLES[a] || 'Página no encontrada', '#/' + a]);
  if (a === 'productos' && b && CAT[b as CatSlug]) c.push([CAT[b as CatSlug].name, `#/productos/${b}`]);
  if (a === 'productos' && s && BY_SLUG[s]) c.push([BY_SLUG[s].name, `#/productos/${b}/${s}`]);
  return c;
}
let lastPt = { x: innerWidth / 2, y: innerHeight / 2 };
let currentKey = '', busy = false, again = false, first = true;

function render(r: Route) {
  const [a, b] = r.parts; let html = '';
  if (stepTimer) { clearInterval(stepTimer); stepTimer = 0; }
  switch (a) {
    case 'inicio': html = vInicio(); break;
    case 'productos': html = b ? (CAT[b as CatSlug] ? vCategoria(b as CatSlug) : v404()) : vProductos(); break;
    case 'nosotros': html = vNosotros(); break;
    case 'ingredientes': html = vIngredientes(); break;
    case 'proceso': html = vProceso(); break;
    case 'asistente': html = vAsistente(); break;
    case 'empresas': html = vEmpresas(); break;
    case 'club': html = vClub(); break;
    case 'antes-y-despues': html = vAntes(); break;
    case 'contacto': html = vContacto(); break;
    case 'carrito': html = vCarrito(); break;
    default: html = v404();
  }
  const v = $('#view')!; v.classList.remove('view-enter'); v.innerHTML = html;
  void v.offsetWidth; v.classList.add('view-enter');
  window.scrollTo(0, 0);
  // Montajes por vista
  if (a === 'inicio') {
    const stage = $('#heroStage')!; const hero = $('#hero')!; hero.className = 'hero ' + mode;
    if (!Scene3D.mount(stage)) hero.classList.add('no3d'); else Scene3D.setMode(mode);
  } else Scene3D.stop();
  if (a === 'proceso') { stepI = 0; renderStep(0); }
  if (a === 'asistente') { quizA = {}; quizStep = 0; renderQuiz(); }
  if (a === 'empresas') renderQuote(true);
  if (a === 'club') renderUsers();
  if (a === 'carrito') renderCart();
  if (a === 'antes-y-despues') bindCompare();
  bindTilt(v); bindReveal(v);
}
function chrome(r: Route) {
  const a = r.parts[0];
  $$('nav.main a[data-nav]').forEach(l => l.classList.toggle('active', l.dataset.nav === a));
  $$('nav.main a[data-nav]').forEach(l => l.toggleAttribute('aria-current', l.dataset.nav === a));
  moveInd();
  const c = crumbs(r);
  ($('#crumbs .wrap') as HTMLElement).innerHTML = `<span class="sr">Estás en:</span>` + c.map(([t, h], i) => i === c.length - 1 ? `<span aria-current="page">${esc(t)}</span>` : `<a href="${h}">${esc(t)}</a><span class="sep">›</span>`).join('');
  document.title = c.length > 1 ? `${c[c.length - 1][0]} · Herbarium` : 'Herbarium · Productos naturales desde 2005';
  $('#nav')?.classList.remove('open');
}
function moveInd() {
  const ind = $('#navInd'), act = $('nav.main a.active') as HTMLElement | null, nav = $('#nav');
  if (!ind || !nav) return;
  if (!act || getComputedStyle(nav).display === 'none') { ind.style.opacity = '0'; return; }
  const nr = nav.getBoundingClientRect(), ar = act.getBoundingClientRect();
  ind.style.left = ar.left - nr.left + 'px'; ind.style.width = ar.width + 'px'; ind.style.opacity = '1';
}
function syncQuick(r: Route) {
  const [a, b, s] = r.parts;
  if (a === 'productos' && s && BY_SLUG[s] && BY_SLUG[s].cat === b) {
    const p = BY_SLUG[s];
    if (quickOpen === s) return;
    const wasOpen = !!quickOpen;
    openModal(quickHTML(p), 'qv-modal'); quickOpen = s;
    if (!wasOpen) { quickPushed = !first && currentKey === viewKey(r) && !justRendered; quickMoved = false; } else quickMoved = true;
    bindQuickRotate();
  } else if (quickOpen) closeModal();
}
let justRendered = false;

async function wipe(label: string, path: string, fn: () => void) {
  const w = $('#wipe')!;
  if (reduced) { fn(); return; }
  ($('#wipeLabel') as HTMLElement).textContent = label; ($('#wipePath') as HTMLElement).textContent = path;
  const disc = $('.wipe-disc', w)!, inner = $('.wipe-inner', w)!;
  w.style.setProperty('--x', lastPt.x + 'px'); w.style.setProperty('--y', lastPt.y + 'px');
  w.classList.add('on');
  const ease = 'cubic-bezier(.7,0,.3,1)';
  const a1 = disc.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 520, easing: ease, fill: 'forwards' });
  const i1 = inner.animate([{ opacity: 0, transform: 'translate3d(0,14px,0)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 220, easing: 'ease-out', fill: 'forwards' });
  await a1.finished.catch(() => { });
  fn();
  await sleep(120);
  const a2 = w.animate([{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-100%,0)' }], { duration: 620, easing: ease, fill: 'forwards' });
  await a2.finished.catch(() => { });
  a1.cancel(); i1.cancel(); a2.cancel(); w.classList.remove('on');
}

async function onRoute() {
  if (busy) { again = true; return; }
  busy = true;
  try {
    const r = parse(); const key = viewKey(r);
    if (key !== currentKey) {
      const c = crumbs(r); const label = c[Math.min(c.length - 1, r.parts[0] === 'productos' ? 2 : 1)]?.[0] || 'Inicio';
      const go = () => { if (quickOpen) closeModal(); render(r); currentKey = key; chrome(r); justRendered = true; syncQuick(r); justRendered = false; };
      if (first) { go(); } else await wipe(label, c.map(x => x[0]).join(' › '), go);
    } else { chrome(r); syncQuick(r); }
    first = false;
  } finally {
    busy = false;
    if (again) { again = false; onRoute(); }
  }
}

/* --------------------------------------------------------------------------
   15. Interacciones por vista
   -------------------------------------------------------------------------- */
function bindQuickRotate() {
  const m = $('#qvMedia'), r = $('#qvRot'); if (!m || !r || reduced) return;
  m.addEventListener('pointermove', (e: PointerEvent) => { const b = m.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; r.style.transform = `rotateY(${x * 40}deg) rotateX(${-y * 20}deg) translateZ(30px)`; });
  m.addEventListener('pointerleave', () => { r.style.transform = ''; });
}
function bindCompare() {
  const c = $('#cmp'); if (!c) return; let drag = false;
  const set = (e: PointerEvent) => { const r = c.getBoundingClientRect(); setCompare(((e.clientX - r.left) / r.width) * 100); };
  c.addEventListener('pointerdown', e => { drag = true; c.setPointerCapture(e.pointerId); c.style.transition = ''; set(e); });
  c.addEventListener('pointermove', e => { if (drag) set(e); });
  c.addEventListener('pointerup', () => { drag = false; });
  if (!reduced) { let k = 0; const intro = () => { if (k > 60 || drag) return; setCompare(50 + Math.sin(k / 9) * 18); k++; requestAnimationFrame(intro); }; setTimeout(intro, 900); }
}
function setMode(m: 'bienestar' | 'marca') {
  mode = m; store.set('herb_mode', m);
  const hero = $('#hero'); if (!hero) return;
  hero.dataset.m = m; hero.classList.toggle('marca', m === 'marca'); hero.classList.toggle('bienestar', m === 'bienestar');
  const sw = $('.switch', hero)!; sw.classList.toggle('marca', m === 'marca');
  $$('button', sw).forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  Scene3D.setMode(m);
}

function exportUsers(kind: 'csv' | 'json') {
  const U = users(); const stamp = new Date().toISOString().slice(0, 10);
  if (kind === 'json') return download(`registros-herbarium-${stamp}.json`, JSON.stringify(U, null, 2), 'application/json');
  const cols: (keyof User)[] = ['nombre', 'correo', 'telefono', 'interes', 'codigo', 'fecha', 'origen'];
  const q = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '﻿' + [['Nombre', 'Correo', 'Teléfono', 'Interés', 'Código', 'Fecha', 'Origen'].map(q).join(';'), ...U.map(u => cols.map(c => q(c === 'fecha' ? new Date(u.fecha).toLocaleString('es-CR') : u[c])).join(';'))].join('\r\n');
  download(`registros-herbarium-${stamp}.csv`, csv, 'text/csv;charset=utf-8');
}

function onClick(e: MouseEvent) {
  lastPt = { x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2 };
  const t = e.target as HTMLElement; const el = t.closest('[data-action]') as HTMLElement | null;
  if (!el) return;
  const act = el.dataset.action!;
  const slug = el.dataset.slug || '';
  switch (act) {
    case 'add': addToCart(slug); break;
    case 'qty-inc': addToCart(slug); renderCart(); break;
    case 'qty-dec': { const it = cart.find(i => i.slug === slug); if (it) { it.qty--; if (it.qty <= 0) cart = cart.filter(i => i !== it); } saveCart(); renderCart(); break; }
    case 'remove': cart = cart.filter(i => i.slug !== slug); saveCart(); renderCart(); break;
    case 'clear-cart': cart = []; saveCart(); renderCart(); break;
    case 'qv-inc': case 'qv-dec': { const o = $('#qvQty')!; o.textContent = String(Math.max(1, +o.textContent! + (act === 'qv-inc' ? 1 : -1))); break; }
    case 'qv-add': addToCart(slug, +($('#qvQty')?.textContent || 1)); break;
    case 'mode': setMode(el.dataset.mode as any); break;
    case 'flip': el.classList.toggle('on'); break;
    case 'quiz': quizA[el.dataset.k!] = el.dataset.v!; quizStep++; renderQuiz(); break;
    case 'quiz-back': quizStep = Math.max(0, quizStep - 1); renderQuiz(); break;
    case 'quiz-restart': quizA = {}; quizStep = 0; renderQuiz(); break;
    case 'step': toggleStepPlay(false); renderStep(+el.dataset.i!); break;
    case 'step-prev': toggleStepPlay(false); renderStep(stepI - 1); break;
    case 'step-next': toggleStepPlay(false); renderStep(stepI + 1); break;
    case 'step-play': toggleStepPlay(); break;
    case 'open-register': e.preventDefault(); openRegister(); break;
    case 'close-modal': if (modalKind === 'qv-modal') { e.preventDefault(); closeQuick(); } else closeModal(); break;
    case 'close-quick': closeQuick(); break;
    case 'copy': navigator.clipboard?.writeText(el.dataset.text!).then(() => toast(`${IC.check}<span>Código copiado: <b>${el.dataset.text}</b></span>`), () => toast('Seleccioná el código y copiálo manualmente.')); break;
    case 'export-csv': exportUsers('csv'); toast(`${IC.download}<span>Exportaste los registros en CSV (abre en Excel).</span>`); break;
    case 'export-json': exportUsers('json'); toast(`${IC.download}<span>Exportaste los registros en JSON.</span>`); break;
    case 'clear-users': if (confirm('¿Borrar todos los registros de esta demo?')) { store.set('herb_users', []); renderUsers(); } break;
    case 'delete-user': store.set('herb_users', users().filter(u => u.id !== el.dataset.id)); renderUsers(); break;
    case 'checkout': checkout(); break;
    case 'compare': animateCompare(+el.dataset.pos!); break;
    case 'nav-toggle': $('#nav')?.classList.toggle('open'); break;
  }
}
function animateCompare(to: number) {
  const c = $('#cmp'); if (!c) return; const from = parseFloat(getComputedStyle(c).getPropertyValue('--pos')) || 50; const t0 = performance.now();
  const step = (n: number) => { const k = Math.min(1, (n - t0) / 700), e = 1 - Math.pow(1 - k, 3); setCompare(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function onSubmit(e: SubmitEvent) {
  const f = e.target as HTMLFormElement; e.preventDefault();
  if (f.classList.contains('reg-form')) return registerUser(f);
  if (f.id === 'quoteForm') {
    if (!f.reportValidity()) return;
    const d = quoteData()!; const folio = 'COT-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const txt = `SOLICITUD DE COTIZACIÓN · MAQUILA HERBARIUM\nFolio: ${folio}\nFecha: ${new Date().toLocaleString('es-CR')}\n\nEmpresa: ${d.empresa}\nCorreo: ${d.correo}\nProducto: ${d.cat}\nPresentación: ${d.pres}\nUnidades: ${d.qty.toLocaleString('es-CR')}\nFórmula: ${d.formula}\nServicios: ${d.serv.join(', ') || 'Ninguno'}\n\nPrecio por unidad: ${TARIFAS[d.tipo] ? money(TARIFAS[d.tipo]!) : '[TARIFA HERBARIUM]'}\nPlazo: [PLAZO DE PRODUCCIÓN]\n`;
    download(`${folio}.txt`, txt, 'text/plain;charset=utf-8'); leafBurst();
    toast(`${IC.check}<span>Solicitud <b>${folio}</b> generada y descargada.</span>`);
    return;
  }
  if (f.id === 'contactForm') { if (!f.reportValidity()) return; f.reset(); toast(`${IC.check}<span>Mensaje de demostración enviado. ¡Gracias!</span>`); return; }
  if (f.id === 'codeForm') {
    const code = String(new FormData(f).get('code') || '').trim().toUpperCase(); const msg = $('.code-msg') as HTMLElement;
    const ok = users().some(u => u.codigo === code);
    if (ok) { store.set('herb_applied', code); renderCart(); toast(`${IC.check}<span>Código <b>${code}</b> aplicado.</span>`); }
    else { msg.hidden = false; msg.textContent = 'Ese código no está registrado. Registrate en el Club para obtener el tuyo.'; }
  }
}

/* --------------------------------------------------------------------------
   16. Arranque
   -------------------------------------------------------------------------- */
function boot() {
  shell(); updateCartBadge();
  if (!location.hash || location.hash === '#' || location.hash === '#/') history.replaceState(null, '', '#/inicio');
  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit as any);
  document.addEventListener('pointerdown', e => { lastPt = { x: e.clientX, y: e.clientY }; }, { passive: true });
  document.addEventListener('input', e => { const t = e.target as HTMLElement;
    if (t.closest('#quoteForm')) renderQuote(t.id === 'qType');
    if (t.id === 'q') { const q = (t as HTMLInputElement).value.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); let n = 0;
      $$('#allGrid .pcard').forEach((c, i) => { const p = PRODUCTS[i]; const hay = (p.name + ' ' + CAT[p.cat].name + ' ' + p.desc).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); const show = !q || hay.includes(q); (c as HTMLElement).hidden = !show; if (show) n++; });
      ($('#noRes') as HTMLElement).hidden = n > 0; }
  });
  document.addEventListener('change', e => { if ((e.target as HTMLElement).closest('#quoteForm')) renderQuote((e.target as HTMLElement).id === 'qType'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalKind) { modalKind === 'qv-modal' ? closeQuick() : closeModal(); } });
  // Respaldo de imágenes: logo y fotos de producto
  document.addEventListener('error', e => {
    const img = e.target as HTMLImageElement; if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.fb === 'logo') img.closest('.logo')?.classList.add('fb');
    if (img.dataset.fb === 'pack') { const p = BY_SLUG[img.dataset.slug!]; if (p) img.outerHTML = packHTML(p, (img.dataset.size as any) || 'md'); }
  }, true);
  addEventListener('hashchange', onRoute);
  addEventListener('resize', moveInd);
  pollenBG(); scrollFX(); cursor(); magnet(); fpsMeter();
  onRoute();
  document.fonts?.ready.then(moveInd);
  setTimeout(() => $('#loader')?.classList.add('done'), reduced ? 0 : 900);
  // Pop-up de registro: una vez por sesión
  setTimeout(() => { if (!session.get('herb_popup') && !modalKind) openRegister(); }, 9000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
