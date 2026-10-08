import './styles/base.css';
import './styles/ui.css';
import './styles/scenes.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initMedia } from './modules/media.js';
import { initCursor } from './modules/cursor.js';
import { initSound } from './modules/sound.js';
import { initUI } from './modules/ui.js';
import { initScenes } from './modules/scenes.js';
import { applyI18n } from './modules/i18n.js';

gsap.registerPlugin(ScrollTrigger);

const isMobile = window.matchMedia('(max-width: 960px)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- smooth scroll ----------
const lenis = new Lenis({ lerp: isMobile ? 0.12 : 0.085, smoothWheel: true, syncTouch: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ---------- preloader ----------
const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loaderCount');
const loaderBar = document.getElementById('loaderBar');
const loadState = { v: 0 };
const loaderTl = gsap.timeline();
loaderTl
  .to('.loader__name', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut' }, 0)
  .to(loadState, {
    v: 100, duration: 1.6, ease: 'power2.inOut',
    onUpdate: () => {
      loaderCount.textContent = String(Math.round(loadState.v)).padStart(3, '0');
      loaderBar.style.width = `${loadState.v}%`;
    },
  }, 0.1);

// ---------- boot ----------
applyI18n(document);
const sound = initSound(document.getElementById('soundToggle'));
initMedia(document);
initCursor();
const ui = initUI({ lenis, sound, isMobile });

let lens = {
  ready: Promise.resolve(),
  setProgress() {}, setVisible() {}, setScrollVelocity() {},
};

async function bootLens() {
  // 3D loads after the first paint so the preloader is instant
  try {
    const { createLens } = await import('./modules/lens.js');
    lens = createLens(document.getElementById('gl'), { isMobile });
    await lens.ready;
  } catch (err) {
    console.warn('[spainov] 3D disabled:', err);
    document.getElementById('stage').style.display = 'none';
  }
}

async function start() {
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  await Promise.all([bootLens(), fontsReady, new Promise((r) => loaderTl.eventCallback('onComplete', r))]);

  const scenes = initScenes({ lens, sound, lenis, isMobile });

  const out = gsap.timeline({
    onComplete: () => {
      loader.remove();
      lenis.start();
      ScrollTrigger.refresh();
    },
  });
  out
    .to('.loader__meta, .loader__bar', { opacity: 0, duration: 0.4 }, 0)
    .to('.loader__name', { yPercent: -40, opacity: 0, filter: 'blur(12px)', duration: 0.8, ease: 'power3.in' }, 0.05)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut' }, 0.3)
    .add(() => scenes.playHero(), 0.75);
  sound.bass();
}

if (reduced) gsap.globalTimeline.timeScale(1.6);
start();

// keep layout honest on orientation changes
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
