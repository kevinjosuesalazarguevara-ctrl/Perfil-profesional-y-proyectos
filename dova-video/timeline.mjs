// Línea de tiempo única: la usan el render (imagen) y synth.py (sonido) para quedar sincronizados.
const TEXT = {
  es: {
    hola: 'Hola, somos DOVA', estudio: 'un estudio digital', cr: 'de Costa Rica.',
    diseno: 'Diseñamos tu sitio web', marca: 'y tu marca,', auto1: 'y automatizamos', auto2: 'lo repetitivo,',
    idioma: 'en español e inglés.',
    svc1: 'Sitios web y e-commerce,', svc2: 'branding,', svc3: 'automatización e IA', svc4: 'e integraciones.',
    p1: 'Escuchamos,', p2: 'diseñamos,', p3: 'construimos', p4: 'y mejoramos.',
    l1: 'Menos vueltas,', l2: 'más posibilidades.', cta: 'Cuéntanos tu proyecto.',
    foot: 'Estudio digital bilingüe', btn: 'Hablemos',
    services: ['Sitios web y e-commerce', 'Branding', 'Automatización e IA', 'Integraciones y consultoría'],
    steps: ['Escuchar', 'Diseñar', 'Construir', 'Mejorar'],
  },
  en: {
    hola: 'Hi, we are DOVA', estudio: 'a digital studio', cr: 'from Costa Rica.',
    diseno: 'We design your website', marca: 'and your brand,', auto1: 'and automate', auto2: 'the repetitive,',
    idioma: 'in Spanish and English.',
    svc1: 'Websites and e-commerce,', svc2: 'branding,', svc3: 'automation and AI', svc4: 'and integrations.',
    p1: 'We listen,', p2: 'design,', p3: 'build', p4: 'and improve.',
    l1: 'Fewer detours,', l2: 'more possibilities.', cta: 'Tell us about your project.',
    foot: 'Bilingual digital studio', btn: "Let's talk",
    services: ['Websites and e-commerce', 'Branding', 'Automation and AI', 'Integrations and consulting'],
    steps: ['Listen', 'Design', 'Build', 'Improve'],
  },
};

// [id, duración, [[clave de texto, duración], ...]]
function plan() {
  const p = [
    ['intro', 4.4, [['hola', 1.6, 0.3], ['estudio', 1.3], ['cr', 1.2]]],
    ['web', 1.8, [['diseno', 1.8]]],
    ['brand', 1.0, [['marca', 1.0]]],
    ['auto', 2.3, [['auto1', 1.2], ['auto2', 1.1]]],
    ['lang', 1.7, [['idioma', 1.7]]],
    ['services', 4.6, [['svc1', 1.4], ['svc2', 1.0], ['svc3', 1.1], ['svc4', 1.1]]],
    ['process', 4.2, [['p1', 1.0], ['p2', 1.0], ['p3', 1.1], ['p4', 1.1]]],
  ];
  p.push(['line', 2.5, [['l1', 1.1], ['l2', 1.4]]], ['cta', 2.5, [['cta', 2.5]]]);
  return p;
}

export function buildTimeline(lang = 'es') {
  const scenes = {}, chunks = [];
  let t = 0;
  for (const [id, dur, cs] of plan()) {
    scenes[id] = { start: t, dur };
    let ct = t + (cs[0][2] ?? 0);
    for (const [key, d] of cs) { chunks.push({ a: ct, b: ct + d, key }); ct += d; }
    t += dur;
  }
  const duration = Math.round(t * 100) / 100;
  const S = (id) => scenes[id].start;
  const sfx = [];
  const add = (k, tt, o = {}) => sfx.push({ k, t: tt, ...o });
  chunks.forEach((c) => add('tick', c.a));
  // actos y barridos de color
  ['web', 'lang', 'services', 'process', 'line', 'cta'].forEach((id) => add('whoosh', S(id) - 0.2, { d: 0.45, up: true, vol: 0.5 }));
  // logo y línea lima
  add('logo', 0.1); add('draw', 1.0, { d: 1.4, f: 320 });
  // web
  add('draw', S('web') + 0.2, { d: 0.35, f: 420 }); add('draw', S('web') + 0.6, { d: 0.35, f: 520 }); add('draw', S('web') + 0.8, { d: 0.35, f: 620 }); add('pop', S('web') + 1.4, { f: 330 });
  // marca
  [523, 587, 659, 784].forEach((f, i) => add('pop', S('brand') + 0.05 + 0.1 * i, { f, pan: -0.3 + 0.2 * i }));
  // automatización
  [392, 494, 587, 392].forEach((f, i) => add('node', S('auto') + 0.667 * i, { f }));
  // idioma
  add('toggle', S('lang') + 0.7);
  // servicios
  [0, 1, 2, 3].forEach((i) => { add('draw', S('services') + 0.1 + 0.25 * i, { d: 0.35, f: 380 + 70 * i }); });
  [1.4, 2.4, 3.5].forEach((o, i) => add('pop', S('services') + o, { f: 523 * Math.pow(1.122, i * 2) }));
  add('pop', S('services') + 0.05, { f: 523 });
  // proceso
  [0, 1.0, 2.0, 3.1].forEach((o, i) => add('node', S('process') + o + 0.1, { f: [392, 440, 523, 659][i] }));
  add('draw', S('process'), { d: 4.0, f: 260 });
  // más clics: cada elemento que aparece o se activa suena como un clic de interfaz
  add('click', 1.0, { vol: 0.7 });                                   // la línea lima arranca
  [0.2, 0.6, 0.8].forEach((o) => add('click', S('web') + o, { vol: 0.6, f: 2200 }));   // trazos del sitio
  [0.05, 0.15, 0.25, 0.35].forEach((o) => add('click', S('brand') + o, { vol: 0.5, f: 1700 })); // muestras de color
  [0, 1, 2, 3].forEach((i) => add('click', S('auto') + 0.667 * i, { vol: 0.7, f: 2600 }));       // nodos
  add('click', S('lang') + 0.7, { vol: 0.9, f: 1500 });              // interruptor ES/EN
  [0, 1, 2, 3].forEach((i) => add('click', S('services') + 0.1 + 0.25 * i, { vol: 0.55, f: 2000 })); // filas
  chunks.filter((c) => ['svc1', 'svc2', 'svc3', 'svc4'].includes(c.key)).forEach((c) => add('click', c.a, { vol: 0.8, f: 1800 }));
  chunks.filter((c) => ['p1', 'p2', 'p3', 'p4'].includes(c.key)).forEach((c) => add('click', c.a + 0.1, { vol: 0.9, f: 2100 })); // pasos
  add('click', S('line') + 1.4, { vol: 0.8, f: 2400 });
  // línea que se endereza
  add('vib', S('line') + 0.05); add('chime', S('line') + 1.4, { f: 1046 });
  // cierre: símbolo, cursor, clic
  add('whoosh', S('cta') + 0.05, { d: 0.7, up: true, vol: 0.5 });
  add('whoosh', S('cta') + 0.45, { d: 0.5, up: false, vol: 0.25 });
  add('click', S('cta') + 1.15, { vol: 1.2 }); add('chime', S('cta') + 1.2, { f: 784 }); add('chime', S('cta') + 1.3, { f: 1175, vol: 0.8 }); add('chime', S('cta') + 1.4, { f: 1568, vol: 0.5 });

  return { lang, duration, scenes, chunks, sfx, text: TEXT[lang] };
}
