/**
 * SCENES — the film. Every section is a scrubbed GSAP timeline pinned with
 * CSS sticky, so each scroll physically transforms one scene into the next.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from './ui.js';
import { t } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

const vw = (n) => (window.innerWidth * n) / 100;
const vh = (n) => (window.innerHeight * n) / 100;
const vmin = (n) => (Math.min(window.innerWidth, window.innerHeight) * n) / 100;

export function initScenes({ lens, sound, lenis, isMobile }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------ HERO
  const heroChars = Array.from(document.querySelectorAll('.hero__word .ch'));
  gsap.set(heroChars, { yPercent: 110, rotateX: -30 });
  gsap.set('.hero__stats, .hero__scroll, .hero__meta', { opacity: 0, y: 16 });

  function playHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(heroChars, { yPercent: 0, rotateX: 0, duration: 1.4, stagger: { each: 0.028, from: 'start' } }, 0)
      .to('.hero__meta', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.6)
      .to('.hero__stats', { opacity: 1, y: 0, duration: 1 }, 0.8)
      .to('.hero__scroll', { opacity: 1, y: 0, duration: 1 }, 1.0)
      .fromTo('#nav', { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.4);
    return tl;
  }

  // hero exits upward with motion blur as the lens takes over
  gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  })
    .to('.hero__title', { yPercent: -30, opacity: 0, filter: 'blur(14px)', ease: 'none' }, 0)
    .to('.hero__stats', { yPercent: -60, opacity: 0, ease: 'none' }, 0)
    .to('.hero__scroll, .hero__meta', { opacity: 0, ease: 'none' }, 0);

  // lens morph: hero bottom → intro end
  ScrollTrigger.create({
    trigger: '#intro',
    start: 'top bottom',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (st) => { lens.setProgress(st.progress); lens.setVisible(st.progress < 1); },
    onRefresh: (st) => lens.setVisible(st.progress < 1),
  });
  if (lenis) lenis.on('scroll', ({ velocity }) => lens.setScrollVelocity(velocity));

  // ------------------------------------------------------------ INTRO
  const frame = document.getElementById('introFrame');
  const frameUI = frame.querySelector('.frame-ui');
  const words = Array.from(document.querySelectorAll('.intro__word'));

  const phoneW = () => Math.min(vh(38), 340);
  const browserW = () => Math.min(vw(72), 980);

  gsap.set(frame, { width: () => vmin(22), height: () => vmin(22), borderRadius: () => `${vmin(11)}px`, opacity: 0, scale: 0.6 });

  const intro = gsap.timeline({
    scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    defaults: { ease: 'none' },
  });
  intro
    // lens → video frame (zoom through the glass)
    .to(frame, { opacity: 1, scale: 1, duration: 0.08 }, 0)
    .to(frame, { width: () => vw(100), height: () => vh(100), borderRadius: '0px', duration: 0.24, ease: 'power2.inOut' }, 0.08)
    .fromTo('#flash', { opacity: 0 }, { opacity: 0.9, duration: 0.02, ease: 'power4.in' }, 0.27)
    .to('#flash', { opacity: 0, duration: 0.07, ease: 'power2.out' }, 0.29)
    .to(frameUI, { opacity: 1, duration: 0.06 }, 0.28)
    .fromTo(words[0], { opacity: 0, scale: 1.4, filter: 'blur(24px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.12, ease: 'power3.out' }, 0.3)
    .to(words[0], { opacity: 0, scale: 0.88, filter: 'blur(16px)', duration: 0.08, ease: 'power2.in' }, 0.44)
    // video frame → smartphone
    .to(frame, { width: () => phoneW(), height: () => phoneW() * 19 / 9, borderRadius: '34px', duration: 0.14, ease: 'power3.inOut' }, 0.5)
    .to(frameUI, { opacity: 0, duration: 0.05 }, 0.5)
    .fromTo(words[1], { opacity: 0, scale: 1.4, filter: 'blur(24px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.12, ease: 'power3.out' }, 0.58)
    .to(words[1], { opacity: 0, scale: 0.88, filter: 'blur(16px)', duration: 0.08, ease: 'power2.in' }, 0.7)
    // smartphone → browser window
    .to(frame, { width: () => browserW(), height: () => browserW() * 10.5 / 16, borderRadius: '10px', duration: 0.14, ease: 'power3.inOut' }, 0.74)
    .fromTo(words[2], { opacity: 0, scale: 1.4, filter: 'blur(24px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.12, ease: 'power3.out' }, 0.82)
    .to(words[2], { opacity: 0, scale: 0.88, filter: 'blur(16px)', duration: 0.06, ease: 'power2.in' }, 0.94)
    // dissolve
    .to(frame, { opacity: 0, scale: 0.92, duration: 0.08, ease: 'power2.in' }, 0.92);

  // ------------------------------------------------------------ NUMBERS: 4000+ → 200+ → 7
  const digits = document.getElementById('countDigits');
  const plus = document.getElementById('countPlus');
  const cLabel = document.getElementById('countLabel');
  const cSub = document.getElementById('countSub');
  const cRail = Array.from(document.querySelectorAll('.count__rail i'));
  const numberEl = document.querySelector('.count__number');
  const PHASES = [
    { to: 4000, pad: 4, plus: true, label: t('count.videos'), sub: t('count.videos.sub') },
    { to: 200, pad: 3, plus: true, label: t('count.projects'), sub: t('count.projects.sub') },
    { to: 7, pad: 1, plus: false, label: t('count.years'), sub: t('count.years.sub') },
  ];
  const ease = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return 1 - Math.pow(1 - t, 3); };
  let lastPhase = -1;
  function renderCount(p) {
    const phase = p < 0.42 ? 0 : p < 0.74 ? 1 : 2;
    const ph = PHASES[phase];
    if (phase !== lastPhase) {
      lastPhase = phase;
      cLabel.textContent = ph.label; cSub.textContent = ph.sub;
      cRail.forEach((d, i) => d.classList.toggle('is-on', i <= phase));
      gsap.fromTo(numberEl, { filter: 'blur(18px)', scale: 0.86, opacity: 0.2 }, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', overwrite: true });
      sound.tick();
    }
    let v, showPlus;
    if (phase === 0) {
      v = Math.round(ease(0.04, 0.3, p) * 4000);
      if (p > 0.31 && p < 0.35) v = 4000 - Math.floor((p - 0.31) / 0.01);   // 3999 · 3998 · 3997 · 3996
      if (p >= 0.35) v = 4000;
      showPlus = p >= 0.35;
    } else if (phase === 1) {
      v = Math.round(ease(0.44, 0.62, p) * 200);
      showPlus = p >= 0.63;
    } else { v = 7; showPlus = false; }
    digits.textContent = String(v).padStart(ph.pad, '0');
    plus.style.opacity = showPlus ? 1 : 0;
    plus.style.transform = showPlus ? 'none' : 'translateX(-20px)';
  }
  renderCount(0);
  gsap.timeline({
    scrollTrigger: { trigger: '#projects', start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: (st) => renderCount(st.progress) },
    defaults: { ease: 'none' },
  })
    .fromTo('.count__number', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
    .fromTo('.count__label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.08 }, 0.04)
    .fromTo('[data-strip="1"] .strip__track', { xPercent: 0 }, { xPercent: -40, duration: 1 }, 0)
    .fromTo('[data-strip="-1"] .strip__track', { xPercent: -40 }, { xPercent: 0, duration: 1 }, 0);

  // ------------------------------------------------------------ 01 MOBILE
  const phone = document.getElementById('phone');
  const slides = Array.from(document.querySelectorAll('.phone__slide'));
  const phoneTag = document.getElementById('phoneTag');
  const phoneCounter = document.getElementById('phoneCounter');
  const phoneTags = Array.from(document.querySelectorAll('[data-phone-tag]'));
  let slideIdx = 0;
  function setSlide(i) {
    if (i === slideIdx) return;
    slideIdx = i;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    phoneTags.forEach((t, k) => t.classList.toggle('is-active', k === i));
    phoneTag.textContent = phoneTags[i].dataset.phoneTag;
    phoneCounter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    sound.tick();
  }
  phoneTags[0].classList.add('is-active');
  gsap.timeline({
    scrollTrigger: {
      trigger: '#mobile', start: 'top top', end: 'bottom bottom', scrub: 0.8,
      onUpdate: (st) => setSlide(Math.min(slides.length - 1, Math.floor(st.progress * slides.length))),
    },
    defaults: { ease: 'none' },
  })
    .fromTo(phone, { rotateY: -34, rotateX: 8, y: 80, scale: 0.9 }, { rotateY: 34, rotateX: -6, y: -40, scale: 1, duration: 1 }, 0);
  gsap.fromTo(phone, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '#mobile', start: 'top 60%' } });
  phoneTags.forEach((t, i) => t.addEventListener('click', () => setSlide(i)));

  // ------------------------------------------------------------ 02 SOCIAL
  const chips = Array.from(document.querySelectorAll('[data-chip]'));
  const feedCells = Array.from(document.querySelectorAll('.feed__cell'));
  const flowWords = Array.from(document.querySelectorAll('.social__flow span'));
  const social = gsap.timeline({
    scrollTrigger: {
      trigger: '#social', start: 'top top', end: 'bottom bottom', scrub: 0.8,
      onUpdate: (st) => flowWords.forEach((w, i) => w.classList.toggle('is-lit', st.progress > (i + 1) / (flowWords.length + 1))),
    },
    defaults: { ease: 'none' },
  });
  chips.forEach((c, i) => {
    const a = (i / chips.length) * Math.PI * 2;
    social.fromTo(c,
      { x: Math.cos(a) * vw(30), y: Math.sin(a) * vh(40), rotate: (i % 2 ? 1 : -1) * 25, scale: 0.5, opacity: 0, filter: 'blur(8px)' },
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' },
      0.1 + i * 0.05);
  });
  social.fromTo('.feed', { rotateY: 28, rotateX: -6, scale: 0.85, opacity: 0 }, { rotateY: -8, rotateX: 2, scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
  feedCells.forEach((c, i) => social.to(c, { opacity: 1, scale: 1, duration: 0.12, ease: 'power3.out' }, 0.25 + i * 0.045));
  social.to(chips, { y: (i) => (i % 2 ? -14 : 14), duration: 0.3 }, 0.7);

  // ------------------------------------------------------------ 03 WEB
  const browser = document.getElementById('browser');
  const site = document.getElementById('site');
  const panels = Array.from(document.querySelectorAll('.panel'));
  gsap.timeline({
    scrollTrigger: { trigger: '#web', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
    defaults: { ease: 'none' },
  })
    .fromTo(browser, { rotateX: 42, rotateY: -30, z: -300, scale: 0.8, opacity: 0 }, { rotateX: 0, rotateY: 0, z: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0)
    .fromTo(site, { y: 0 }, { y: () => -(site.scrollHeight - browser.clientHeight + 36), duration: 0.5, ease: 'power1.inOut' }, 0.35)
    .to(browser, { rotateY: 14, rotateX: -6, duration: 0.3, ease: 'power2.inOut' }, 0.7)
    .fromTo(panels, { opacity: 0, z: -200, scale: 0.6, x: (i) => (i % 2 ? 120 : -120) }, { opacity: 1, z: 60, scale: 1, x: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, 0.45);

  // ------------------------------------------------------------ PROCESS
  const steps = Array.from(document.querySelectorAll('.step'));
  const stepChars = steps.map((s) => splitChars(s.querySelector('[data-letters]')));
  const dots = Array.from(document.querySelectorAll('.process__dots i'));
  const processLabel = document.getElementById('processLabel');
  const scatter = (chars, amp = 1) => chars.map((_, i) => ({
    x: (Math.sin(i * 12.9898) * 43758.5453 % 1) * vw(40) * amp,
    y: (Math.cos(i * 78.233) * 12345.678 % 1) * vh(40) * amp,
    rotate: (Math.sin(i * 3.7) * 90) * amp,
  }));

  const proc = gsap.timeline({
    scrollTrigger: {
      trigger: '#process', start: 'top top', end: 'bottom bottom', scrub: 0.7,
      onUpdate: (st) => {
        const i = Math.min(4, Math.floor(st.progress * 5));
        dots.forEach((d, k) => d.classList.toggle('is-on', k <= i));
        processLabel.textContent = `0${i + 1} / 05`;
      },
    },
    defaults: { ease: 'none' },
  });
  // each step owns [i, i+1] on the timeline
  steps.forEach((step, i) => {
    const chars = stepChars[i];
    const from = scatter(chars, 1);
    proc.set(step, { opacity: 1 }, i)
      .fromTo(chars, {
        x: (k) => from[k].x, y: (k) => from[k].y, rotate: (k) => from[k].rotate, opacity: 0, filter: 'blur(12px)',
      }, { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.02, ease: 'power3.out' }, i)
      .fromTo(step.querySelector('.step__sub'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, i + 0.3);
    if (i < steps.length - 1) {
      const to = scatter(chars, 0.5);
      proc.to(chars, { x: (k) => -to[k].x, y: (k) => -to[k].y * 0.6, opacity: 0, filter: 'blur(10px)', duration: 0.25, stagger: 0.015, ease: 'power2.in' }, i + 0.75)
        .to(step.querySelector('.step__sub'), { opacity: 0, duration: 0.15 }, i + 0.8)
        .set(step, { opacity: 0 }, i + 1);
    }
  });
  // SHOT — frame corners draw in, then collapse into a line
  const frameEls = document.querySelectorAll('[data-step="shot"] .step__frame i');
  proc.fromTo(frameEls, { scale: 2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power3.out' }, 1.2)
    .to('[data-step="shot"] .step__frame', { scaleY: 0.02, y: vh(30), opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.75);
  // EDIT — timeline clips grow, playhead sweeps, then clips morph into feed tiles
  const clips = document.querySelectorAll('[data-step="edit"] .step__timeline i');
  const playhead = document.querySelector('[data-step="edit"] .step__timeline b');
  proc.fromTo(clips, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power3.out' }, 2.1)
    .fromTo(playhead, { left: '0%' }, { left: '100%', duration: 0.45, ease: 'none' }, 2.3)
    .to(clips, { scaleY: 2.4, y: -vh(10), opacity: 0, duration: 0.25, stagger: 0.02, ease: 'power2.in' }, 2.75)
    .to(playhead, { opacity: 0, duration: 0.1 }, 2.75);
  // PUBLISH — feed tiles pop in, then shrink into data points
  const tiles = document.querySelectorAll('[data-step="publish"] .step__feed i');
  proc.fromTo(tiles, { scale: 0, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'back.out(1.6)' }, 3.1)
    .to(tiles, { scale: 0.1, y: (k) => -vh(10) - k * 12, opacity: 0, duration: 0.25, stagger: 0.02, ease: 'power2.in' }, 3.75);
  // GROW — the chart draws upward
  const path = document.getElementById('growPath');
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  proc.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 4.1)
    .fromTo('.step__chart', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 4.05);

  // ------------------------------------------------------------ REVEALS
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { yPercent: 110, rotate: 2 }, {
      yPercent: 0, rotate: 0, duration: 1.3, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
  gsap.utils.toArray('.lead, .list, .index, .about__roles, .about__stats, .work__foot, .contact__card').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  gsap.fromTo('.portrait', { clipPath: 'inset(12% 8% 12% 8%)', scale: 1.1 }, {
    clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.6, ease: 'power4.out',
    scrollTrigger: { trigger: '.portrait', start: 'top 80%' },
  });
  gsap.fromTo('.portrait__type span', { yPercent: 100, opacity: 0 }, {
    yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.1, ease: 'power4.out',
    scrollTrigger: { trigger: '.portrait', start: 'top 70%' },
  });
  gsap.fromTo('.contact__sub span', { y: 16, opacity: 0 }, {
    y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact__sub', start: 'top 90%' },
  });
  ScrollTrigger.batch('.work__item', {
    start: 'top 92%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }),
  });

  // ------------------------------------------------------------ NAV ACTIVE + SCENE SOUND
  const map = { work: '#work', mobile: '#mobile', about: '#about', contact: '#contact' };
  Object.entries(map).forEach(([id, sel]) => {
    ScrollTrigger.create({
      trigger: sel, start: 'top 50%', end: 'bottom 50%',
      onToggle: (st) => document.querySelectorAll(`.nav__links a[href="${sel}"]`).forEach((a) => a.classList.toggle('is-active', st.isActive)),
    });
  });
  document.querySelectorAll('[data-scene]').forEach((sec) => {
    ScrollTrigger.create({ trigger: sec, start: 'top 60%', onEnter: () => sound.whoosh(), onEnterBack: () => sound.whoosh() });
  });

  // refresh once media/fonts settle
  window.addEventListener('load', () => ScrollTrigger.refresh());
  return { playHero, refresh: () => ScrollTrigger.refresh() };
}
