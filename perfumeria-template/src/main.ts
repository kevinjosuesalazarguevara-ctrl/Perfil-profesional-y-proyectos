type Lang = 'es' | 'en';

interface BagItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const root = document.documentElement;

// Reemplazar por el número real (código de país 506 + número, sin signos)
const WHATSAPP = '50600000000';

const money = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

function currentLang(): Lang {
  return root.dataset.lang === 'en' ? 'en' : 'es';
}

function setLang(lang: Lang): void {
  root.dataset.lang = lang;
  root.lang = lang;
}

function initLang(): void {
  setLang((navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es');
  document.querySelectorAll<HTMLButtonElement>('[data-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.set as Lang);
      renderBag();
    });
  });
}

function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('seen'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('seen');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));
}

// Filtro de colección
function initFilter(): void {
  const grid = $('grid');
  const chips = document.querySelectorAll<HTMLButtonElement>('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter ?? 'all';
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      grid.classList.toggle('filtered', f !== 'all');
      grid.querySelectorAll<HTMLElement>('.prod').forEach((p) => {
        p.hidden = f !== 'all' && p.dataset.cat !== f;
      });
    });
  });
  grid.querySelectorAll<HTMLElement>('.prod').forEach((p) => {
    const price = p.querySelector('.price');
    if (price) price.textContent = money.format(Number(p.dataset.price));
  });
}

// Bolsa de compras: el pedido se envía por WhatsApp
const bag = new Map<string, BagItem>();

function total(): number {
  let sum = 0;
  bag.forEach((i) => (sum += i.price * i.qty));
  return sum;
}

function renderBag(): void {
  const list = $('bag-list');
  let count = 0;
  list.innerHTML = '';
  bag.forEach((item) => {
    count += item.qty;
    const li = document.createElement('li');
    const info = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = item.name;
    const small = document.createElement('small');
    small.textContent = money.format(item.price);
    const qty = document.createElement('div');
    qty.className = 'qty';
    for (const delta of [-1, 1]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = delta < 0 ? '-' : '+';
      b.setAttribute('aria-label', delta < 0 ? 'Quitar uno' : 'Agregar uno');
      b.addEventListener('click', () => change(item.id, delta));
      qty.append(b);
      if (delta < 0) {
        const n = document.createElement('span');
        n.textContent = String(item.qty);
        qty.append(n);
      }
    }
    info.append(name, small, qty);
    const line = document.createElement('span');
    line.textContent = money.format(item.price * item.qty);
    li.append(info, line);
    list.append(li);
  });
  $('bag-count').textContent = String(count);
  $('bag-total').textContent = money.format(total());
  $('bag-empty').hidden = count > 0;

  const wa = $<HTMLAnchorElement>('bag-wa');
  const lines = [...bag.values()].map((i) => `- ${i.qty} x ${i.name}`).join('\n');
  const intro = currentLang() === 'es' ? 'Hola, quiero pedir:' : 'Hi, I would like to order:';
  const msg = `${intro}\n${lines}\nTotal: ${money.format(total())}`;
  wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  wa.setAttribute('aria-disabled', String(count === 0));
}

function change(id: string, delta: number): void {
  const item = bag.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) bag.delete(id);
  renderBag();
}

function setBagOpen(open: boolean): void {
  $('bag').hidden = !open;
  $('bag-btn').setAttribute('aria-expanded', String(open));
}

function initBag(): void {
  document.querySelectorAll<HTMLElement>('.prod').forEach((p) => {
    p.querySelector('[data-add]')?.addEventListener('click', () => {
      const id = p.dataset.id ?? '';
      const existing = bag.get(id);
      if (existing) existing.qty += 1;
      else bag.set(id, { id, name: p.dataset.name ?? '', price: Number(p.dataset.price), qty: 1 });
      renderBag();
      setBagOpen(true);
    });
  });
  $('bag-btn').addEventListener('click', () => setBagOpen($('bag').hasAttribute('hidden')));
  $('bag-close').addEventListener('click', () => setBagOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setBagOpen(false);
  });
  renderBag();
}

// Correo de novedades (demo: sin envío a servidor)
function initNews(): void {
  const form = $<HTMLFormElement>('news');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $<HTMLInputElement>('correo');
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
    input.closest('.field')?.classList.toggle('bad', !ok);
    if (ok) form.classList.add('done');
  });
}

initLang();
initFilter();
initBag();
initNews();
initReveal();
document.querySelectorAll<HTMLAnchorElement>('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}`;
  a.target = '_blank';
  a.rel = 'noopener';
});
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
