/**
 * CURSOR — dot + dynamic ring with contextual labels.
 * Labels come from `data-cursor` on any ancestor, with sensible
 * defaults for media (VIEW) and portfolio items (EXPLORE).
 */
import gsap from 'gsap';
import { t } from './i18n.js';

export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.getElementById('cursor');
  if (!fine || !root) return { setLabel() {} };

  const label = document.getElementById('cursorLabel');
  document.body.classList.add('has-cursor');

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const dot = { x: pos.x, y: pos.y };
  const ring = { x: pos.x, y: pos.y };
  const dotEl = root.querySelector('.cursor__dot');
  const ringEl = root.querySelector('.cursor__ring');
  let shown = false;

  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    if (!shown) { shown = true; root.classList.add('is-visible'); }
  }, { passive: true });
  document.addEventListener('mouseleave', () => root.classList.remove('is-visible'));
  document.addEventListener('mouseenter', () => root.classList.add('is-visible'));
  window.addEventListener('pointerdown', () => root.classList.add('is-down'));
  window.addEventListener('pointerup', () => root.classList.remove('is-down'));

  gsap.ticker.add(() => {
    dot.x += (pos.x - dot.x) * 0.55; dot.y += (pos.y - dot.y) * 0.55;
    ring.x += (pos.x - ring.x) * 0.18; ring.y += (pos.y - ring.y) * 0.18;
    dotEl.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
    ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
  });

  function resolve(target) {
    const el = target.closest('[data-cursor], .media');
    if (!el) return '';
    if (el.dataset.cursor) return el.dataset.cursor;
    if (el.classList.contains('media')) return 'VIEW';
    return '';
  }

  let current = '';
  function setLabel(text) {
    if (text === current) return;
    current = text;
    if (text) { const k = 'cursor.' + text.toLowerCase(); const tr = t(k); label.textContent = tr === k ? text : tr; root.classList.add('has-label'); }
    else root.classList.remove('has-label');
  }

  document.addEventListener('pointerover', (e) => setLabel(resolve(e.target)));
  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget || !resolve(e.relatedTarget)) setLabel('');
  });

  return { setLabel };
}
