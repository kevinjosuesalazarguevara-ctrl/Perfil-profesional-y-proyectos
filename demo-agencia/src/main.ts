type Lang = 'es' | 'en';

const root = document.documentElement;

// Reemplazar por el número real (código de país 506 + número, sin signos)
const WHATSAPP = '50600000000';

function setLang(lang: Lang): void {
  root.dataset.lang = lang;
  root.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-es]').forEach((el) => {
    el.textContent = el.dataset[lang] ?? '';
  });
}

function initLang(): void {
  const start: Lang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  setLang(start);
  document.querySelectorAll<HTMLButtonElement>('[data-set]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.set as Lang));
  });
}

// Entrada al hacer scroll: guía la lectura en orden
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('seen'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('seen');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  items.forEach((el) => io.observe(el));
}

// Formulario con validación en línea (demo: sin envío a servidor)
type Field = 'nombre' | 'correo' | 'tipo';

const rules: Record<Field, (v: string) => boolean> = {
  nombre: (v) => v.length > 1,
  correo: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
  tipo: (v) => v !== '',
};

function validate(id: Field): boolean {
  const input = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
  const ok = rules[id](input.value.trim());
  input.closest('.field')?.classList.toggle('bad', !ok);
  return ok;
}

function initForm(): void {
  const form = document.getElementById('form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = (Object.keys(rules) as Field[]).map(validate);
    if (results.every(Boolean)) form.classList.add('done');
  });
}

function initRail(): void {
  const rail = document.getElementById('rail');
  document.querySelectorAll<HTMLButtonElement>('[data-rail]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.rail);
      rail?.scrollBy({ left: dir * 400, behavior: 'smooth' });
    });
  });
}

function initWhatsApp(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-wa]').forEach((a) => {
    a.href = `https://wa.me/${WHATSAPP}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

initLang();
initRail();
initWhatsApp();
initReveal();
initForm();
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
