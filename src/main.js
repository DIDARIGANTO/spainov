import './styles/base.css';
import './styles/ui.css';
import './styles/scenes.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { MEDIA } from './modules/data.js';
import { PAGE_MEDIA } from './modules/content.js';
import { initMedia } from './modules/media.js';
import { initCursor } from './modules/cursor.js';
import { initSound } from './modules/sound.js';
import { initUI } from './modules/ui.js';
import { initScenes } from './modules/scenes.js';
import { applyI18n } from './modules/i18n.js';

gsap.registerPlugin(ScrollTrigger);
const isMobile = window.matchMedia('(max-width: 960px)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);

const lenis = new Lenis({ lerp: isMobile ? 0.12 : 0.09, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

applyI18n(document);
Object.assign(MEDIA, PAGE_MEDIA);
const sound = initSound(document.getElementById('soundToggle'));
initMedia(document);
initCursor();
initUI({ lenis, sound, isMobile });

let lens = null;
async function bootLens() {
  if (isMobile) { document.getElementById('stage').style.display = 'none'; return; }
  try {
    const { createLens } = await import('./modules/lens.js');
    lens = createLens(document.getElementById('gl'), { isMobile });
    await Promise.race([lens.ready, new Promise((r) => setTimeout(r, 1500))]);
  } catch (err) {
    console.warn('[spainov] 3D disabled:', err);
    document.getElementById('stage').style.display = 'none';
  }
}
const fonts = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2000))]);
Promise.all([bootLens(), fonts]).then(() => {
  initScenes({ lenis, isMobile, lens }).playIntro(() => { lenis.start(); ScrollTrigger.refresh(); });
});

let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
