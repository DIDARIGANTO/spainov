/**
 * SCENES — clapperboard intro, hero choreography, draggable floating frames,
 * tickers, stat counters and scroll reveals.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScenes({ sound, lenis, isMobile }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------ CLAPPERBOARD
  const clap = document.getElementById('clap');
  const board = document.getElementById('clapBoard');
  const stick = document.getElementById('clapStick');
  const hint = clap.querySelector('.clap__hint');
  const take = document.getElementById('clapTake');

  gsap.set('.hero__meta, .hero__title, .hero__cta, .hero__stage', { opacity: 0, y: 30 });
  gsap.set('.float', { scale: 0, opacity: 0 });
  gsap.set(board, { rotateX: 18, y: 60, opacity: 0 });

  function playIntro(onDone) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(board, { rotateX: 0, y: 0, opacity: 1, duration: 0.9 }, 0)
      .to(hint, { opacity: 1, duration: 0.5 }, 0.5)
      // take counter flicks
      .add(() => { take.textContent = '02'; }, 0.95)
      .add(() => { take.textContent = '03'; }, 1.15)
      // the clap
      .to(stick, { rotate: 0, duration: 0.22, ease: 'power4.in' }, 1.35)
      .add(() => { sound.clap(); }, 1.57)
      .to(board, { y: 8, duration: 0.08, ease: 'power2.out' }, 1.57)
      .to(board, { y: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, 1.65)
      .to('#clap', { backgroundColor: '#f2f0ea', duration: 0.04 }, 1.57)
      .to('#clap', { backgroundColor: '#080808', duration: 0.25 }, 1.61)
      // board swings out, page comes in
      .to(hint, { opacity: 0, duration: 0.2 }, 1.9)
      .to(board, { rotateX: -60, y: -140, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.in', transformOrigin: '50% 0%' }, 2.0)
      .to(clap, { opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: () => clap.remove() }, 2.4)
      .to('#nav', { y: '0%', opacity: 1, duration: 1, ease: 'power3.out' }, 2.5)
      .to('.hero__meta', { opacity: 1, y: 0, duration: 0.8 }, 2.55)
      .to('.hero__title', { opacity: 1, y: 0, duration: 1 }, 2.65)
      .to('.hero__swash path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 3.1)
      .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, 2.85)
      .to('.hero__stage', { opacity: 1, y: 0, duration: 1 }, 3.0)
      .to('.float', { scale: 1, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)' }, 3.2)
      .to('#badge', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, 3.4)
      .add(() => onDone && onDone(), 2.6);
    if (reduced) tl.timeScale(1.8);
    return tl;
  }

  // ------------------------------------------------------------ FLOATING FRAMES (drag + float)
  const stage = document.getElementById('heroStage');
  const floats = Array.from(document.querySelectorAll('[data-float]'));
  floats.forEach((el, i) => {
    // idle float
    gsap.to(el, { y: `+=${10 + i * 3}`, duration: 2.6 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 });
    let dragging = false, ox = 0, oy = 0, bx = 0, by = 0;
    el.addEventListener('pointerdown', (e) => {
      dragging = true; el.classList.add('is-dragging'); el.setPointerCapture(e.pointerId);
      ox = e.clientX; oy = e.clientY;
      bx = gsap.getProperty(el, 'x'); by = gsap.getProperty(el, 'y');
      gsap.killTweensOf(el, 'y');
      sound.tick();
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      gsap.set(el, { x: bx + (e.clientX - ox), y: by + (e.clientY - oy), rotate: (e.clientX - ox) * 0.06 });
    });
    const up = () => {
      if (!dragging) return;
      dragging = false; el.classList.remove('is-dragging');
      gsap.to(el, { rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      // keep inside the stage
      const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
      let dx = 0, dy = 0;
      if (r.left < s.left - 20) dx = s.left - r.left; if (r.right > s.right + 20) dx = s.right - r.right;
      if (r.top < s.top - 40) dy = s.top - r.top; if (r.bottom > s.bottom + 40) dy = s.bottom - r.bottom;
      if (dx || dy) gsap.to(el, { x: `+=${dx}`, y: `+=${dy}`, duration: 0.7, ease: 'power3.out' });
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
  // hero parallax on scroll
  gsap.to('.strip', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  gsap.to(floats, { y: '+=120', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });

  // ------------------------------------------------------------ TICKERS
  const marquee = (el, dur, dir = 1) => {
    if (!el) return;
    const w = el.scrollWidth / 2;
    gsap.fromTo(el, { x: dir > 0 ? 0 : -w }, { x: dir > 0 ? -w : 0, duration: dur, ease: 'none', repeat: -1 });
  };
  marquee(document.getElementById('ticker1'), 40, 1);
  marquee(document.getElementById('ticker2'), 60, -1);

  // ------------------------------------------------------------ CITY parallax
  gsap.fromTo('.city__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.city', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ------------------------------------------------------------ STATS counters
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('ru-RU').replace(/\s/g, ' '); } }),
    });
  });

  // ------------------------------------------------------------ REVEALS
  const revealTargets = [
    '.city__title', '.city__text', '.belief__head .h2', '.belief__text p', '.ph', '.stat',
    '.hits__head', '.hits__sub', '.steps__head', '.steps__list li', '.steps > .pill', '.steps__note',
    '.menu-s__head', '.tabs', '.menu-s__foot', '.book__intro > *', '.form', '.where .h2', '.loc', '.faq .h2', '.faq__list',
  ];
  gsap.utils.toArray(revealTargets.join(',')).forEach((el) => el.setAttribute('data-reveal', ''));
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  });
  ScrollTrigger.batch('.hit', { start: 'top 95%', onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' }) });
  ScrollTrigger.batch('.mi', { start: 'top 95%', onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'power3.out' }) });

  // ------------------------------------------------------------ NAV ACTIVE
  [['#hits', '#hits'], ['#services', '#services'], ['#book', '#book'], ['#contacts', '#contacts']].forEach(([sel, href]) => {
    ScrollTrigger.create({
      trigger: sel, start: 'top 50%', end: 'bottom 50%',
      onToggle: (st) => document.querySelectorAll(`.nav__links a[href="${href}"]`).forEach((a) => a.classList.toggle('is-active', st.isActive)),
    });
  });
  // badge hides over the footer
  ScrollTrigger.create({ trigger: '.footer', start: 'top 90%', onEnter: () => gsap.to('#badge', { opacity: 0, scale: 0.6, duration: 0.4 }), onLeaveBack: () => gsap.to('#badge', { opacity: 1, scale: 1, duration: 0.4 }) });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  return { playIntro };
}
