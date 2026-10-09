/**
 * UI — navigation, menu, magnetic pills, hits carousel, services tabs,
 * booking form (→ WhatsApp), FAQ accordion, tickers.
 */
import gsap from 'gsap';
import { REELS, PROFILE, reelUrl, WHATSAPP_NUMBER } from './data.js';
import { SERVICES, FAQ } from './content.js';
import { createMedia } from './media.js';
import { t, LANG } from './i18n.js';

const pad = (n, w = 2) => String(n).padStart(w, '0');
const title = (r) => (LANG === 'en' && r.title_en) ? r.title_en : r.title;

export function initUI({ lenis, sound, isMobile }) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      sound.tick();
      lenis.scrollTo(target, { offset: -60, duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
    });
  });

  // ---------- mobile menu ----------
  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuToggle');
  function closeMenu() {
    menu.classList.remove('is-open'); menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked'); lenis.start();
  }
  menuBtn.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open'); menuBtn.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked'); lenis.stop(); sound.whoosh();
  });

  // ---------- magnetic pills ----------
  if (fine) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        btn.style.setProperty('--mx', `${x}px`); btn.style.setProperty('--my', `${y}px`);
        gsap.to(btn, { x: (x - r.width / 2) * 0.3, y: (y - r.height / 2) * 0.3, duration: 0.6, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
      btn.addEventListener('pointerenter', () => sound.tick());
    });
  }
  document.querySelectorAll('.pill').forEach((b) => b.addEventListener('click', () => sound.shutter()));

  // ---------- timecode ----------
  const tc = document.getElementById('heroTc');
  let frame = 0;
  setInterval(() => {
    frame = (frame + 1) % 24;
    const d = new Date();
    if (tc) tc.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(frame)}`;
  }, 1000 / 24);
  const cd = document.getElementById('clapDate');
  if (cd) { const d = new Date(); cd.textContent = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`; }

  // ---------- tickers ----------
  const fill = (el, text, n = 8) => { if (!el) return; for (let i = 0; i < n; i++) { const s = document.createElement('span'); s.textContent = text; el.appendChild(s); } };
  fill(document.getElementById('ticker1'), t('ticker.1'), 10);
  const tags = ['REELS', 'SHORT FORM', 'PRODUCT', 'LIFESTYLE', 'EVENTS', 'BUSINESS', 'PEOPLE', 'SMM', 'WEB', 'STRATEGY', 'CONTENT', 'VISUAL'];
  const ribbon = document.getElementById('ticker2');
  if (ribbon) for (let k = 0; k < 3; k++) tags.forEach((x) => { const s = document.createElement('span'); s.textContent = x; ribbon.appendChild(s); });

  // ---------- HITS carousel ----------
  const track = document.getElementById('hitsTrack');
  const scroller = document.getElementById('hitsScroller');
  if (track) {
    const ghost = document.createElement('div'); ghost.className = 'hits__ghost'; ghost.textContent = 'SHOWREEL'; document.getElementById('hits').prepend(ghost);
    REELS.forEach((r, i) => {
      const a = document.createElement('article');
      a.className = 'hit';
      a.style.setProperty('--tilt', `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg`);
      const m = document.createElement('a');
      m.className = 'hit__media'; m.href = reelUrl(r); m.target = '_blank'; m.rel = 'noopener'; m.dataset.cursor = 'VIEW';
      m.appendChild(createMedia(`hit-${r.id}`, '4/5', 'mono', r.img, '50% 30%'));
      m.insertAdjacentHTML('beforeend', `<span class="hit__num">${pad(i + 1)}</span><span class="hit__play"></span>`);
      const likes = r.likes >= 10 ? `<i>♥ ${r.likes}</i>` : '';
      a.innerHTML = `
        <div class="hit__title"><b>${title(r)}</b>${likes}</div>
        <div class="hit__meta tech">${r.type}</div>
        <a class="hit__link" href="${reelUrl(r)}" target="_blank" rel="noopener" data-cursor="OPEN">${t('hits.open')} →</a>`;
      a.prepend(m);
      track.appendChild(a);
    });
    const end = document.createElement('article');
    end.className = 'hit hit--end';
    end.innerHTML = `<div class="hit__end"><h3>${t('hits.end.l1')}<em>${t('hits.end.l2')}</em></h3><a class="pill" href="${PROFILE.url}" target="_blank" rel="noopener" data-cursor="OPEN"><span>${t('hits.end.cta')}</span></a></div>`;
    track.appendChild(end);
    document.getElementById('hitsTotal').textContent = pad(REELS.length);

    const cur = document.getElementById('hitsCur');
    const bar = document.getElementById('hitsBar');
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const p = max > 0 ? scroller.scrollLeft / max : 0;
      cur.textContent = pad(Math.min(REELS.length, 1 + Math.round(p * (REELS.length - 1))));
      bar.style.width = `${10 + p * 90}%`;
    };
    scroller.addEventListener('scroll', update, { passive: true });
    update();
    // drag to scroll on desktop
    let down = false, sx = 0, sl = 0, moved = false;
    scroller.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; down = true; moved = false; sx = e.clientX; sl = scroller.scrollLeft; scroller.classList.add('is-dragging'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) moved = true; scroller.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; scroller.classList.remove('is-dragging'); });
    scroller.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    // vertical wheel → horizontal when hovering the carousel (desktop only)
    scroller.addEventListener('wheel', (e) => {
      if (isMobile) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      const atEdge = (e.deltaY < 0 && scroller.scrollLeft <= 0) || (e.deltaY > 0 && scroller.scrollLeft >= max - 1);
      if (atEdge || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      scroller.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  // ---------- SERVICES tabs ----------
  const list = document.getElementById('servList');
  const ctaText = document.getElementById('servCtaText');
  const servCta = document.getElementById('servCta');
  let tab = 'mobile';
  function renderServices(animate = true) {
    const s = SERVICES[tab];
    list.innerHTML = '';
    s.items.forEach((it) => {
      const el = document.createElement('div');
      el.className = 'mi';
      if (it.img) el.dataset.img = it.img;
      el.innerHTML = `<div class="mi__name">${it.n}</div><div class="mi__price">${t('serv.ask')}</div><div class="mi__desc">${it.d}</div><div class="mi__meta tech">${it.m}</div>`;
      list.appendChild(el);
    });
    ctaText.textContent = t('serv.cta', { tab: s.label });
    servCta.href = waLink(`${LANG === 'en' ? 'Ilyas, I would like to order: ' : 'Ильяс, хочу заказать: '}${s.label}`);
    if (animate) gsap.fromTo(list.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true });
  }
  document.querySelectorAll('#servTabs .tab').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.tab === tab) return;
    tab = b.dataset.tab;
    document.querySelectorAll('#servTabs .tab').forEach((x) => x.classList.toggle('is-active', x === b));
    sound.tick();
    renderServices();
  }));
  renderServices(false);

  // ---------- BOOKING → WhatsApp ----------
  const form = document.getElementById('bookForm');
  const done = document.getElementById('formDone');
  form.querySelectorAll('.seg input').forEach((inp) => inp.addEventListener('change', () => {
    form.querySelectorAll('.seg').forEach((s) => s.classList.toggle('is-active', s.contains(inp)));
    sound.tick();
  }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    if (!name || !phone) { form.classList.add('is-error'); form.querySelector(name ? '[name="phone"]' : '[name="name"]').focus(); sound.tick(); return; }
    form.classList.remove('is-error');
    const dirKey = fd.get('dir');
    const dir = SERVICES[dirKey] ? SERVICES[dirKey].label : dirKey;
    const msg = t('form.msg', { dir, format: fd.get('format') || '—', name, phone, date: fd.get('date') || '—', wish: (fd.get('wish') || '—').toString().trim() || '—' });
    window.open(waLink(msg), '_blank', 'noopener');
    done.hidden = false;
    gsap.fromTo(done, { opacity: 0 }, { opacity: 1, duration: 0.6 });
    sound.shutter();
  });

  // ---------- FAQ ----------
  const faq = document.getElementById('faqList');
  FAQ.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'qa';
    el.innerHTML = `<button class="qa__q" type="button" aria-expanded="false" data-cursor="OPEN"><span>${item.q}</span><i></i></button><div class="qa__a"><p>${item.a}</p></div>`;
    const btn = el.querySelector('.qa__q'); const ans = el.querySelector('.qa__a');
    btn.addEventListener('click', () => {
      const open = el.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      gsap.to(ans, { height: open ? 'auto' : 0, duration: 0.6, ease: 'power3.inOut' });
      sound.tick();
    });
    faq.appendChild(el);
    if (i === 0) { el.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); gsap.set(ans, { height: 'auto' }); }
  });

  return { closeMenu };
}

function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
