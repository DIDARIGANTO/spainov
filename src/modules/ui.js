/** UI — menu, anchors, magnetic buttons, clocks, work grid, services accordion, Instagram rail. */
import gsap from 'gsap';
import { REELS, reelUrl, WHATSAPP_NUMBER } from './data.js';
import { SERVICES, WORK } from './content.js';
import { createMedia } from './media.js';
import { t, LANG } from './i18n.js';

const pad = (n) => String(n).padStart(2, '0');
const wa = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function splitChars(el) {
  const text = el.textContent; el.setAttribute('aria-label', text); el.textContent = '';
  return [...text].map((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; el.appendChild(s); return s; });
}

export function initUI({ lenis, sound }) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href')); if (!target) return;
    e.preventDefault(); closeMenu(); lenis.scrollTo(target, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
  }));

  // menu
  const menu = document.getElementById('menu'), btn = document.getElementById('menuToggle');
  function closeMenu() { menu.classList.remove('is-open'); btn.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); lenis.start(); }
  btn.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open'); btn.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); lenis.stop();
  });

  // magnetic
  if (fine) document.querySelectorAll('[data-magnetic]').forEach((b) => {
    b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.6, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
  });

  // Astana clocks
  const clocks = ['navTime', 'contactTime', 'loaderTime'].map((id) => document.getElementById(id)).filter(Boolean);
  const tick = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Almaty' }));
    const s = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    clocks.forEach((c) => { c.textContent = s; });
  };
  tick(); setInterval(tick, 15000);

  // marquee text
  const mq = document.getElementById('marquee');
  if (mq) { const parts = t('marquee').split(' — ').filter(Boolean); for (let k = 0; k < 4; k++) parts.forEach((p) => { const s = document.createElement('span'); s.textContent = `${p} —`; mq.appendChild(s); }); }

  // work grid
  const grid = document.getElementById('workGrid');
  WORK.forEach((w, i) => {
    const a = document.createElement('a');
    a.className = `case case--${w.size}`; a.href = w.href; a.target = '_blank'; a.rel = 'noopener'; a.dataset.cursor = 'VIEW';
    const m = document.createElement('div'); m.className = 'case__media';
    m.appendChild(createMedia(`case-${w.id}`, '4/5', 'mono', w.img, w.pos));
    if (w.likes >= 10) m.insertAdjacentHTML('beforeend', `<span class="case__likes tech">♥ ${w.likes}</span>`);
    a.appendChild(m);
    a.insertAdjacentHTML('beforeend', `<div class="case__meta"><span class="case__n tech">${pad(i + 1)}</span><span class="case__title">${w.title}</span><span class="case__svc tech">${w.service}</span></div>`);
    grid.appendChild(a);
  });

  // services accordion
  const acc = document.getElementById('services-list');
  SERVICES.forEach((s, i) => {
    const item = document.createElement('div'); item.className = 'acc__item';
    item.innerHTML = `
      <button class="acc__head" type="button" aria-expanded="false" data-cursor="OPEN"><span class="acc__n">(${s.n})</span><span class="acc__title">${s.title}</span><span class="acc__icon"></span></button>
      <div class="acc__body"><div class="acc__inner">
        <div></div>
        <div><p class="acc__lead">${s.lead}</p><div class="acc__tags">${s.tags.map((x) => `<span>${x}</span>`).join('')}</div><p class="acc__fact tech">${s.fact}</p>
          <a class="btn btn--line acc__cta" href="${wa((LANG === 'en' ? 'Ilyas, I would like to order: ' : 'Ильяс, хочу заказать: ') + s.title)}" target="_blank" rel="noopener" data-cursor="OPEN"><span>${t('serv.cta')} → ${s.title}</span></a></div>
        <div class="acc__img"><img src="${s.img}" alt="" loading="lazy"></div>
      </div></div>`;
    const head = item.querySelector('.acc__head'), body = item.querySelector('.acc__body');
    head.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      acc.querySelectorAll('.acc__item.is-open').forEach((o) => { if (o !== item) { o.classList.remove('is-open'); o.querySelector('.acc__head').setAttribute('aria-expanded', 'false'); gsap.to(o.querySelector('.acc__body'), { height: 0, duration: 0.7, ease: 'power3.inOut' }); } });
      item.classList.toggle('is-open', open); head.setAttribute('aria-expanded', String(open));
      gsap.to(body, { height: open ? 'auto' : 0, duration: 0.8, ease: 'power3.inOut', onComplete: () => window.dispatchEvent(new Event('resize')) });
      sound.tick();
    });
    acc.appendChild(item);
    if (i === 0) { item.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); gsap.set(body, { height: 'auto' }); }
  });

  // instagram rail
  const rail = document.getElementById('instaRail');
  REELS.forEach((r) => {
    const a = document.createElement('a');
    a.className = 'ig'; a.href = reelUrl(r); a.target = '_blank'; a.rel = 'noopener'; a.dataset.cursor = 'VIEW';
    a.appendChild(createMedia(`ig-${r.id}`, '9/16', 'mono', r.img));
    const title = LANG === 'en' && r.title_en ? r.title_en : r.title;
    a.insertAdjacentHTML('beforeend', `<div class="ig__ov"><b>${title}</b><span class="tech">${r.type}</span></div>`);
    rail.appendChild(a);
  });

  return { closeMenu };
}
