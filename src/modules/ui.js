/**
 * UI — navigation, menu, magnetic buttons, text splitting,
 * generated grids (contact sheet, social feed, portfolio) and the project scene.
 */
import gsap from 'gsap';
import { PROJECTS, REELS, PROFILE, reelUrl } from './data.js';
import { t, LANG } from './i18n.js';
import { createMedia, mountMedia } from './media.js';

export function splitChars(el) {
  if (el.dataset.splitDone) return Array.from(el.querySelectorAll('.ch'));
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const chars = [];
  for (const c of text) {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = c === ' ' ? ' ' : c;
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    chars.push(span);
  }
  el.dataset.splitDone = '1';
  return chars;
}

function pad(n, w = 2) { return String(n).padStart(w, '0'); }

const title = (p) => (LANG === 'en' && p.title_en) ? p.title_en : p.title;

export function initUI({ lenis, sound, isMobile }) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---------- split text ----------
  document.querySelectorAll('[data-split], [data-letters]').forEach(splitChars);

  // ---------- anchors via Lenis ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      sound.tick();
      lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });
  });

  // ---------- mobile menu ----------
  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuToggle');
  function closeMenu() {
    menu.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    lenis.start();
  }
  menuBtn.addEventListener('click', () => {
    const open = !menu.classList.contains('is-open');
    if (open) {
      menu.classList.add('is-open');
      menuBtn.classList.add('is-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      lenis.stop();
      sound.whoosh();
    } else closeMenu();
  });

  // ---------- magnetic buttons + light position ----------
  if (fine) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const strength = 0.35;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        btn.style.setProperty('--mx', `${x}px`);
        btn.style.setProperty('--my', `${y}px`);
        gsap.to(btn, { x: (x - r.width / 2) * strength, y: (y - r.height / 2) * strength, duration: 0.6, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
      btn.addEventListener('pointerenter', () => sound.tick());
    });
  }
  document.querySelectorAll('.btn').forEach((b) => b.addEventListener('click', () => sound.shutter()));

  // ---------- hero clock / timecode ----------
  const clock = document.getElementById('heroClock');
  const tc = document.getElementById('introTc');
  let frame = 0;
  setInterval(() => {
    frame = (frame + 1) % 24;
    const d = new Date();
    if (clock) clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(frame)}`;
    if (tc) tc.textContent = `00:00:${pad(d.getSeconds() % 60)}:${pad(frame)}`;
  }, 1000 / 24);

  // ---------- SOCIAL FEED ----------
  const feedGrid = document.getElementById('feedGrid');
  if (feedGrid) {
    const tones = ['warm', 'mono', 'cool', 'mono', 'warm', 'cool', 'mono', 'warm', 'cool'];
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'feed__cell';
      const r = REELS[(i * 4 + 1) % REELS.length];
      const m = createMedia(`feed-${i}`, '3/4', tones[i], r.img, '50% 30%');
      cell.appendChild(m);
      feedGrid.appendChild(cell);
    }
    const hl = document.getElementById('feedHl');
    if (hl) PROFILE.highlights.forEach((h) => {
      const sp = document.createElement('span');
      sp.innerHTML = `<img src="${h.img}" alt=""><em>${h.name}</em>`;
      sp.querySelector('em').style.fontStyle = 'normal';
      hl.appendChild(sp);
    });
  }

  // ---------- PORTFOLIO ----------
  const grid = document.getElementById('workGrid');
  const modes = document.getElementById('modes');
  const ink = document.getElementById('modesInk');
  let mode = 'film';
  let current = [];

  function renderGrid(animate = true) {
    current = PROJECTS.filter((p) => p.mode === mode);
    grid.innerHTML = '';
    current.forEach((p, i) => {
      const item = document.createElement('article');
      item.className = 'work__item';
      item.dataset.ratio = p.ratio;
      item.dataset.index = i;
      item.style.setProperty('--ar', p.ratio);
      const media = createMedia(p.media, p.ratio, p.tone, p.img, p.pos);
      const info = document.createElement('div');
      info.className = 'work__info';
      const likes = p.likes >= 10 ? `<span class="tech">♥ ${p.likes}</span>` : '';
      info.innerHTML = `
        <div class="top"><span class="tech">${pad(i + 1)} / ${pad(current.length)}</span><span class="tech">${p.year}</span></div>
        <div><h3>${title(p)}</h3><div class="meta"><span class="tech">${p.type}</span><span class="tech tech--dim">${p.service}</span>${likes}</div></div>`;
      const cap = document.createElement('div');
      cap.className = 'work__cap';
      cap.innerHTML = `<span>${title(p)}</span><span class="tech tech--dim">${p.type}${p.likes >= 10 ? ` · ♥ ${p.likes}` : ''}</span>`;
      item.append(media, info, cap);
      item.addEventListener('click', () => openScene(i));
      grid.appendChild(item);
    });
    const items = grid.querySelectorAll('.work__item');
    if (animate) {
      gsap.fromTo(items, { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.06, ease: 'power3.out', overwrite: true });
    } else gsap.set(items, { opacity: 1, y: 0 });
  }

  function moveInk(btn) {
    if (!ink || !btn) return;
    ink.style.width = `${btn.offsetWidth}px`;
    ink.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  }

  modes.querySelectorAll('.mode').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === mode) return;
      mode = btn.dataset.mode;
      modes.querySelectorAll('.mode').forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      moveInk(btn);
      sound.tick();
      renderGrid(true);
    });
  });
  renderGrid(false);
  requestAnimationFrame(() => moveInk(modes.querySelector('.mode.is-active')));
  window.addEventListener('resize', () => moveInk(modes.querySelector('.mode.is-active')));

  // ---------- PROJECT SCENE ----------
  const scene = document.getElementById('scene');
  const sceneMedia = document.getElementById('sceneMedia');
  let sceneIndex = 0;

  function fillScene(i) {
    const p = current[i];
    sceneIndex = i;
    sceneMedia.innerHTML = '';
    const m = createMedia(p.media, p.ratio, p.tone, p.img, p.pos);
    m.style.setProperty('--ar', p.ratio);
    sceneMedia.appendChild(m);
    const link = document.getElementById('sceneLink');
    if (link) {
      if (p.href) { link.href = p.href; link.style.display = ''; link.textContent = p.likes >= 10 ? t('scene.open.stats', { likes: p.likes, comments: p.comments }) : t('scene.open'); }
      else link.style.display = 'none';
    }
    document.getElementById('sceneIndex').textContent = `${pad(i + 1)} / ${pad(current.length)}`;
    document.getElementById('sceneTitle').textContent = title(p);
    document.getElementById('sceneType').textContent = p.type;
    document.getElementById('sceneYear').textContent = String(p.year);
    document.getElementById('sceneService').textContent = p.service;
    gsap.fromTo(m, { clipPath: 'inset(50% 0 50% 0)', scale: 1.1 }, { clipPath: 'inset(0% 0 0% 0)', scale: 1, duration: 1, ease: 'power4.out' });
    gsap.fromTo('#sceneTitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 });
  }
  function openScene(i) {
    fillScene(i);
    scene.classList.add('is-open');
    scene.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    lenis.stop();
    sound.shutter();
  }
  function closeScene() {
    scene.classList.remove('is-open');
    scene.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    lenis.start();
    sound.tick();
  }
  document.getElementById('sceneClose').addEventListener('click', closeScene);
  document.getElementById('scenePrev').addEventListener('click', () => { sound.tick(); fillScene((sceneIndex - 1 + current.length) % current.length); });
  document.getElementById('sceneNext').addEventListener('click', () => { sound.tick(); fillScene((sceneIndex + 1) % current.length); });
  window.addEventListener('keydown', (e) => {
    if (!scene.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeScene();
    if (e.key === 'ArrowRight') fillScene((sceneIndex + 1) % current.length);
    if (e.key === 'ArrowLeft') fillScene((sceneIndex - 1 + current.length) % current.length);
  });

  return { closeMenu, renderGrid };
}
