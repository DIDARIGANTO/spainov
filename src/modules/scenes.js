/**
 * SCENES — the film.
 * Clapperboard → 3D lens hero → every section is a numbered scene with its own slate,
 * the nav carries a running timecode, film rail on the edge, cinematic reveals,
 * pinned showreel, cursor previews and a final FIN.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { t } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

const pad = (n, w = 2) => String(n).padStart(w, '0');

export function initScenes({ sound, lenis, isMobile, lens }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ------------------------------------------------------------ LINE SPLIT for masked reveals
  const mask = (sel) => gsap.utils.toArray(sel).forEach((el) => {
    if (el.dataset.masked) return;
    el.dataset.masked = '1';
    const w = document.createElement('span');
    w.className = 'mask';
    el.parentNode.insertBefore(w, el);
    w.appendChild(el);
    el.classList.add('mask__in');
  });
  mask('.hero__l1, .hero__l2, .city__title span, .city__title em, .h2 > span, .h2 > em');

  // ------------------------------------------------------------ CLAPPERBOARD
  const clap = document.getElementById('clap');
  const board = document.getElementById('clapBoard');
  const stick = document.getElementById('clapStick');
  const hint = clap.querySelector('.clap__hint');
  const take = document.getElementById('clapTake');

  gsap.set('.hero__meta, .hero__sub, .hero__cta, .hero__stage', { opacity: 0, y: 30 });
  gsap.set('.hero .mask__in', { yPercent: 110 });
  gsap.set('.float', { scale: 0, opacity: 0 });
  gsap.set(board, { rotateX: 18, y: 60, opacity: 0 });
  gsap.set('#stage', { opacity: 0 });

  function playIntro(onDone) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(board, { rotateX: 0, y: 0, opacity: 1, duration: 0.9 }, 0)
      .to(hint, { opacity: 1, duration: 0.5 }, 0.5)
      .add(() => { take.textContent = '02'; }, 0.95)
      .add(() => { take.textContent = '03'; }, 1.15)
      .to(stick, { rotate: 0, duration: 0.22, ease: 'power4.in' }, 1.35)
      .add(() => { sound.clap(); }, 1.57)
      .to(board, { y: 8, duration: 0.08, ease: 'power2.out' }, 1.57)
      .to(board, { y: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, 1.65)
      .to('#clap', { backgroundColor: '#f2f0ea', duration: 0.04 }, 1.57)
      .to('#clap', { backgroundColor: '#080808', duration: 0.25 }, 1.61)
      .to(hint, { opacity: 0, duration: 0.2 }, 1.9)
      .to(board, { rotateX: -60, y: -140, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.in', transformOrigin: '50% 0%' }, 2.0)
      .to(clap, { opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: () => clap.remove() }, 2.4)
      .to('#nav', { y: '0%', opacity: 1, duration: 1, ease: 'power3.out' }, 2.5)
      .to('#stage', { opacity: 1, duration: 1.2 }, 2.5)
      .to('.hero__meta', { opacity: 1, y: 0, duration: 0.8 }, 2.55)
      .to('.hero .mask__in', { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, 2.65)
      .to('.hero__swash path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 3.3)
      .to('.hero__sub', { opacity: 1, y: 0, duration: 0.8 }, 2.95)
      .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, 3.05)
      .to('.hero__stage', { opacity: 1, y: 0, duration: 1 }, 3.15)
      .to('.float', { scale: 1, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)' }, 3.3)
      .to('#badge', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, 3.5)
      .to('#rail', { opacity: 1, duration: 1 }, 3.2)
      .add(() => onDone && onDone(), 2.6);
    if (reduced) tl.timeScale(1.8);
    return tl;
  }

  // ------------------------------------------------------------ 3D LENS: lives behind the hero title, morphs away on scroll
  if (lens) {
    ScrollTrigger.create({
      trigger: '#hero', start: 'top top', end: 'bottom 40%', scrub: true,
      onUpdate: (st) => { lens.setProgress(st.progress); lens.setVisible(st.progress < 1); },
      onRefresh: (st) => lens.setVisible(st.progress < 1),
    });
    if (lenis) lenis.on('scroll', ({ velocity }) => lens.setScrollVelocity(velocity));
  }

  // ------------------------------------------------------------ SPOTLIGHT follows the cursor in the hero
  if (fine) {
    const hero = document.getElementById('hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`);
    }, { passive: true });
  }

  // ------------------------------------------------------------ FLOATING FRAMES (drag + float)
  const stage = document.getElementById('heroStage');
  const floats = Array.from(document.querySelectorAll('[data-float]'));
  floats.forEach((el, i) => {
    gsap.to(el, { y: `+=${10 + i * 3}`, duration: 2.6 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 });
    let dragging = false, ox = 0, oy = 0, bx = 0, by = 0;
    el.addEventListener('pointerdown', (e) => {
      dragging = true; el.classList.add('is-dragging'); el.setPointerCapture(e.pointerId);
      ox = e.clientX; oy = e.clientY; bx = gsap.getProperty(el, 'x'); by = gsap.getProperty(el, 'y');
      gsap.killTweensOf(el, 'y'); sound.tick();
    });
    el.addEventListener('pointermove', (e) => { if (dragging) gsap.set(el, { x: bx + (e.clientX - ox), y: by + (e.clientY - oy), rotate: (e.clientX - ox) * 0.06 }); });
    const up = () => {
      if (!dragging) return;
      dragging = false; el.classList.remove('is-dragging');
      gsap.to(el, { rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
      let dx = 0, dy = 0;
      if (r.left < s.left - 20) dx = s.left - r.left; if (r.right > s.right + 20) dx = s.right - r.right;
      if (r.top < s.top - 40) dy = s.top - r.top; if (r.bottom > s.bottom + 40) dy = s.bottom - r.bottom;
      if (dx || dy) gsap.to(el, { x: `+=${dx}`, y: `+=${dy}`, duration: 0.7, ease: 'power3.out' });
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
  gsap.to('.strip', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.to(floats, { y: '+=120', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
  gsap.to('.hero__title', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 0.6 } });

  // ------------------------------------------------------------ SCENE SLATES — every section gets a clapper slate
  document.querySelectorAll('[data-sc]').forEach((sec) => {
    if (sec.id === 'hero') return;
    const slate = document.createElement('div');
    slate.className = 'slate';
    slate.innerHTML = `<i class="slate__bar"><b></b><b></b><b></b><b></b></i><span class="slate__sc">SC.${sec.dataset.sc}</span><span class="slate__name">${t('sc.' + sec.dataset.scene)}</span><span class="slate__take">${t('sc.take')} 01</span><span class="slate__tc">00:00:00:00</span>`;
    sec.prepend(slate);
    const bar = slate.querySelector('.slate__bar');
    gsap.set(bar, { rotate: -22, transformOrigin: '0% 100%' });
    gsap.set(slate, { opacity: 0, x: -20 });
    ScrollTrigger.create({
      trigger: sec, start: 'top 75%', once: true,
      onEnter: () => {
        gsap.to(slate, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' });
        gsap.to(bar, { rotate: 0, duration: 0.28, ease: 'power4.in', delay: 0.3, onComplete: () => sound.tick() });
      },
    });
  });

  // ------------------------------------------------------------ TIMECODE + SCENE in the nav, synced to scroll
  const navTc = document.getElementById('navTc');
  const navScene = document.getElementById('navScene');
  const sections = Array.from(document.querySelectorAll('[data-sc]'));
  const slateTcs = Array.from(document.querySelectorAll('.slate__tc'));
  const tcFrom = (p) => { const total = Math.round(p * 24 * 150); const f = total % 24, sct = Math.floor(total / 24); return `00:${pad(Math.floor(sct / 60))}:${pad(sct % 60)}:${pad(f)}`; };
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (st) => {
      navTc.textContent = tcFrom(st.progress);
      let cur = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.5) cur = s; });
      navScene.textContent = `SC.${cur.dataset.sc}`;
    },
  });
  slateTcs.forEach((el) => {
    const sec = el.closest('[data-sc]');
    ScrollTrigger.create({ trigger: sec, start: 'top 75%', once: true, onEnter: () => { el.textContent = tcFrom(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)); } });
  });

  // ------------------------------------------------------------ FILM RAIL on the edge
  const railTrack = document.getElementById('railTrack');
  if (railTrack && !isMobile) {
    for (let i = 0; i < 60; i++) {
      const f = document.createElement('div');
      f.className = 'rail__frame';
      f.innerHTML = `<i></i><span>${pad(i + 1, 3)}</span>`;
      railTrack.appendChild(f);
    }
    gsap.to(railTrack, { y: () => -(railTrack.scrollHeight - window.innerHeight), ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.4, invalidateOnRefresh: true } });
  }

  // ------------------------------------------------------------ TICKERS
  const marquee = (el, dur, dir = 1) => { if (!el) return; const w = el.scrollWidth / 2; gsap.fromTo(el, { x: dir > 0 ? 0 : -w }, { x: dir > 0 ? -w : 0, duration: dur, ease: 'none', repeat: -1 }); };
  marquee(document.getElementById('ticker1'), 40, 1);
  marquee(document.getElementById('ticker2'), 60, -1);

  // ------------------------------------------------------------ CITY: parallax + wipe reveal
  gsap.fromTo('.city__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.city', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.city__bg', { clipPath: 'inset(12% 6% 12% 6% round 24px)', scale: 1.08 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'power2.out', scrollTrigger: { trigger: '.city', start: 'top 70%', end: 'top 10%', scrub: 0.6 } });

  // ------------------------------------------------------------ MASKED HEADLINES on enter
  gsap.utils.toArray('.mask__in').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // ------------------------------------------------------------ IMAGE WIPES
  gsap.utils.toArray('.ph .media, .loc__map, .strip').forEach((el, i) => {
    gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', scale: 1.1 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.3, ease: 'power4.out', delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // ------------------------------------------------------------ STATS counters with scramble
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('ru-RU'); }, onComplete: () => sound.tick() }),
    });
  });

  // ------------------------------------------------------------ SHOWREEL: pinned horizontal scroll on desktop
  const hitsScroller = document.getElementById('hitsScroller');
  const hitsTrack = document.getElementById('hitsTrack');
  if (hitsScroller && !isMobile) {
    const hits = document.getElementById('hits');
    const dist = () => hitsTrack.scrollWidth - window.innerWidth + 40;
    gsap.to(hitsTrack, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: hits, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (st) => {
          const n = document.querySelectorAll('.hit:not(.hit--end)').length;
          document.getElementById('hitsCur').textContent = pad(Math.min(n, 1 + Math.round(st.progress * (n - 1))));
          document.getElementById('hitsBar').style.width = `${10 + st.progress * 90}%`;
        },
      },
    });
    gsap.to('.hits__ghost', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: hits, start: 'top top', end: () => `+=${dist()}`, scrub: 0.6 } });
    hitsScroller.classList.add('is-pinned');
  }

  // ------------------------------------------------------------ 3D TILT on cards
  if (fine) {
    document.querySelectorAll('.hit__media, .loc, .ph').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -10, ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' }));
    });
  }

  // ------------------------------------------------------------ SERVICES: cursor preview image
  if (fine) {
    const prev = document.createElement('div');
    prev.className = 'preview';
    prev.innerHTML = '<img alt="">';
    document.body.appendChild(prev);
    const img = prev.querySelector('img');
    const px = gsap.quickTo(prev, 'x', { duration: 0.5, ease: 'power3' }), py = gsap.quickTo(prev, 'y', { duration: 0.5, ease: 'power3' });
    document.addEventListener('pointermove', (e) => { px(e.clientX); py(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const mi = e.target.closest('.mi');
      if (mi && mi.dataset.img) { img.src = mi.dataset.img; prev.classList.add('is-on'); gsap.fromTo(prev, { scale: 0.7, rotate: -6 }, { scale: 1, rotate: 3, duration: 0.5, ease: 'back.out(1.6)' }); }
    });
    document.addEventListener('pointerout', (e) => { const mi = e.target.closest('.mi'); if (mi && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.mi') === mi)) prev.classList.remove('is-on'); });
  }

  // ------------------------------------------------------------ REVEALS
  const revealTargets = ['.city__text', '.belief__text p', '.ph figcaption', '.stat', '.hits__sub', '.hits__progress', '.steps__eyebrow', '.steps__list li', '.steps > .pill', '.steps__note', '.tabs', '.lead', '.menu-s__foot', '.form', '.loc', '.faq__list'];
  gsap.utils.toArray(revealTargets.join(',')).forEach((el) => el.setAttribute('data-reveal', ''));
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }) });
  ScrollTrigger.batch('.mi', { start: 'top 95%', onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'power3.out' }) });
  if (isMobile) ScrollTrigger.batch('.hit', { start: 'top 95%', onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' }) });

  // ------------------------------------------------------------ FIN
  const fin = document.getElementById('fin');
  if (fin) {
    gsap.set('.fin__word', { scale: 0.6, opacity: 0 });
    ScrollTrigger.create({ trigger: fin, start: 'top 85%', once: true, onEnter: () => { gsap.to('.fin__word', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }); sound.clap(); } });
  }

  // ------------------------------------------------------------ NAV ACTIVE + badge
  [['#hits', '#hits'], ['#services', '#services'], ['#book', '#book'], ['#contacts', '#contacts']].forEach(([sel, href]) => {
    ScrollTrigger.create({ trigger: sel, start: 'top 50%', end: 'bottom 50%', onToggle: (st) => document.querySelectorAll(`.nav__links a[href="${href}"]`).forEach((a) => a.classList.toggle('is-active', st.isActive)) });
  });
  ScrollTrigger.create({ trigger: '.footer', start: 'top 90%', onEnter: () => gsap.to('#badge', { opacity: 0, scale: 0.6, duration: 0.4 }), onLeaveBack: () => gsap.to('#badge', { opacity: 1, scale: 1, duration: 0.4 }) });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  return { playIntro };
}
