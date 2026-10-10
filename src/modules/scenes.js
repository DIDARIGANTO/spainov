/** SCENES — loader, hero choreography, 3D lens, scroll-driven reveals. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

export function initScenes({ lenis, isMobile, lens }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- split hero name
  const chars = Array.from(document.querySelectorAll('[data-split]')).flatMap(splitChars);
  gsap.set(chars, { yPercent: 105 });
  gsap.set('.hero__status, .hero__row > *', { opacity: 0, y: 20 });
  gsap.set('.hero__img', { clipPath: 'inset(30% 20% 0% 20%)', scale: 1.2 });
  gsap.set('#nav', { opacity: 0, y: -20 });
  gsap.set('#stage', { opacity: 0 });

  // ---------- loader
  function playIntro(onDone) {
    const count = document.getElementById('loaderCount'), bar = document.getElementById('loaderBar');
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to(o, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { count.textContent = Math.round(o.v); bar.style.width = `${o.v}%`; } })
      .to('#loader', { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.15')
      .add(() => document.getElementById('loader').remove())
      .to('#nav', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .to(chars, { yPercent: 0, duration: 1.2, stagger: 0.035, ease: 'power4.out' }, '-=0.7')
      .to('.hero__status', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.9')
      .to('.hero__row > *', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.7')
      .to('#stage', { opacity: 1, duration: 1.2 }, '-=0.9')
      .add(() => onDone && onDone(), '-=0.6');
    if (reduced) tl.timeScale(2);
  }

  // ---------- 3D lens: floats beside the name, dissolves as the hero image opens
  if (lens) {
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom 60%', scrub: true,
      onUpdate: (st) => { lens.setProgress(st.progress); lens.setVisible(st.progress < 0.98); },
      onRefresh: (st) => lens.setVisible(st.progress < 0.98),
    });
    lenis.on('scroll', ({ velocity }) => lens.setScrollVelocity(velocity));
  }

  // ---------- hero image: opens to full bleed on scroll
  gsap.to('.hero__img', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero__media', start: 'top bottom', end: 'top top', scrub: true } });
  gsap.to('.hero__name', { yPercent: -20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // ---------- marquee driven by scroll velocity
  const track = document.getElementById('marquee');
  if (track) {
    let x = 0, dir = -1, speed = 1;
    const half = () => track.scrollWidth / 2;
    lenis.on('scroll', ({ velocity }) => { if (velocity) dir = velocity > 0 ? -1 : 1; speed = 1 + Math.min(8, Math.abs(velocity) * 0.4); });
    gsap.ticker.add(() => {
      x += dir * speed * 0.8; speed += (1 - speed) * 0.05;
      const h = half(); if (x <= -h) x += h; if (x > 0) x -= h;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  }

  // ---------- counters
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = +el.dataset.count, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
  });

  // ---------- section titles: line rise
  gsap.utils.toArray('.sec-title, .contact__title .line > *').forEach((el) => {
    gsap.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  gsap.utils.toArray('.sec-head').forEach((h) => {
    gsap.fromTo(h, { '--line': 0 }, { '--line': 1, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });

  // ---------- work: image wipe + parallax
  gsap.utils.toArray('.case').forEach((c, i) => {
    const m = c.querySelector('.case__media');
    gsap.fromTo(m, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
    gsap.fromTo(c.querySelector('.case__meta'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
    if (!isMobile) gsap.fromTo(c, { y: 40 + (i % 3) * 30 }, { y: -(40 + (i % 3) * 30), ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ---------- about: word-by-word highlight on scroll
  const big = document.querySelector('.about__big');
  if (big) {
    const words = big.textContent.split(' ');
    big.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    const ws = big.querySelectorAll('.w');
    ScrollTrigger.create({
      trigger: big, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (st) => { const n = Math.round(st.progress * ws.length); ws.forEach((w, i) => { w.style.opacity = i < n ? 1 : 0.18; }); },
    });
  }
  gsap.fromTo('.about__portrait .media', { clipPath: 'inset(0 0 100% 0)', scale: 1.15 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: '.about__portrait', start: 'top 85%', once: true } });

  // ---------- instagram rail: horizontal drift with scroll
  const rail = document.getElementById('instaRail');
  if (rail) gsap.fromTo(rail, { x: 0 }, { x: () => -(rail.scrollWidth - window.innerWidth), ease: 'none', scrollTrigger: { trigger: '.insta', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });

  // ---------- generic reveals
  gsap.utils.toArray('.sec-sub, .sec-link, .num, .acc__item, .process__list li, .about__p, .about__facts li, .about__text .btn, .contact__grid > div').forEach((el) => el.setAttribute('data-reveal', ''));
  ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }) });

  // ---------- nav background on scroll
  ScrollTrigger.create({ start: 60, end: 'max', onToggle: (st) => document.getElementById('nav').classList.toggle('is-scrolled', st.isActive) });

  // ---------- nav active
  ['#work', '#services', '#about', '#contact'].forEach((sel) => ScrollTrigger.create({
    trigger: sel, start: 'top 50%', end: 'bottom 50%',
    onToggle: (st) => document.querySelectorAll(`.nav__links a[href="${sel}"]`).forEach((a) => a.classList.toggle('is-active', st.isActive)),
  }));

  window.addEventListener('load', () => ScrollTrigger.refresh());
  return { playIntro };
}
