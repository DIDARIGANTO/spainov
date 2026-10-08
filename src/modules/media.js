/**
 * MEDIA — placeholder footage renderer + real video loader.
 *
 * Any `.media[data-media]` element becomes either:
 *   - a <video> (when MEDIA[id].src exists), muted, looped, played only in view
 *   - a procedural canvas "footage" placeholder: soft moving light fields,
 *     light leaks, scanlines and grain — cinematic, monochrome, easy to replace.
 *
 * One shared rAF loop drives only the placeholders currently in the viewport.
 */
import { MEDIA } from './data.js';

const TONES = {
  warm: { a: [38, 30, 24], b: [92, 72, 52], leak: [227, 168, 79] },
  cool: { a: [22, 26, 32], b: [58, 68, 84], leak: [150, 170, 200] },
  mono: { a: [20, 20, 20], b: [70, 70, 70], leak: [200, 200, 200] },
};

const active = new Set();
const all = [];
let noiseCanvas = null;
let rafId = 0;
let reduced = false;

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

function makeNoise() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 180 + Math.random() * 75;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 22;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

class Placeholder {
  constructor(el, id, cfg) {
    this.el = el;
    this.id = id;
    this.cfg = cfg;
    this.seed = hash(id);
    this.tone = TONES[cfg.tone] || TONES.mono;
    this.kind = cfg.kind || el.dataset.kind || 'footage';
    this.ratio = el.dataset.ratio || '16/9';
    const [rw, rh] = this.ratio.split('/').map(Number);
    const base = 220;
    this.w = rw >= rh ? base : Math.round(base * rw / rh);
    this.h = rw >= rh ? Math.round(base * rh / rw) : base;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.t0 = this.seed * 1000;
    el.appendChild(this.canvas);
    this.draw(0);
  }

  draw(time) {
    const { ctx, w, h, tone, seed } = this;
    const t = (time * 0.00022) + this.t0;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, `rgb(${tone.a.join(',')})`);
    g.addColorStop(1, `rgb(${Math.round(tone.a[0] * 0.6)},${Math.round(tone.a[1] * 0.6)},${Math.round(tone.a[2] * 0.6)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // soft moving light fields
    const blobs = 3;
    for (let i = 0; i < blobs; i++) {
      const ph = seed * 6.28 + i * 2.1;
      const x = w * (0.5 + 0.42 * Math.sin(t * (0.7 + i * 0.23) + ph));
      const y = h * (0.5 + 0.38 * Math.cos(t * (0.55 + i * 0.31) + ph * 1.3));
      const r = Math.max(w, h) * (0.35 + 0.2 * Math.sin(t * 0.9 + i));
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      const b = tone.b;
      rg.addColorStop(0, `rgba(${b[0]},${b[1]},${b[2]},${0.55 - i * 0.12})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }

    if (this.kind === 'portrait') {
      // editorial studio placeholder: backlit wall, dark head-and-shoulders silhouette
      ctx.save();
      const cx = w * 0.5, cy = h * 0.4;
      const wall = ctx.createRadialGradient(cx + w * 0.1, cy - h * 0.1, w * 0.05, cx, cy, w * 0.95);
      wall.addColorStop(0, 'rgba(210,205,195,0.95)');
      wall.addColorStop(0.45, 'rgba(120,116,108,0.9)');
      wall.addColorStop(1, 'rgba(20,20,20,1)');
      ctx.fillStyle = wall;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#070707';
      // shoulders
      ctx.beginPath();
      ctx.moveTo(-w * 0.1, h * 1.1);
      ctx.bezierCurveTo(-w * 0.05, h * 0.78, w * 0.22, h * 0.66, w * 0.42, h * 0.64);
      ctx.lineTo(w * 0.58, h * 0.64);
      ctx.bezierCurveTo(w * 0.78, h * 0.66, w * 1.05, h * 0.78, w * 1.1, h * 1.1);
      ctx.closePath();
      ctx.fill();
      // neck
      ctx.fillRect(w * 0.43, h * 0.5, w * 0.14, h * 0.17);
      // head
      ctx.beginPath();
      ctx.ellipse(cx, cy - h * 0.02, w * 0.17, h * 0.155, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // light leak sweep
    const lx = ((t * 0.35 + seed) % 1.4) * (w * 1.6) - w * 0.3;
    const leak = ctx.createLinearGradient(lx - w * 0.3, 0, lx + w * 0.3, h);
    const L = tone.leak;
    leak.addColorStop(0, `rgba(${L[0]},${L[1]},${L[2]},0)`);
    leak.addColorStop(0.5, `rgba(${L[0]},${L[1]},${L[2]},0.14)`);
    leak.addColorStop(1, `rgba(${L[0]},${L[1]},${L[2]},0)`);
    ctx.fillStyle = leak;
    ctx.fillRect(0, 0, w, h);

    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let y = (Math.floor(t * 40) % 3); y < h; y += 3) ctx.fillRect(0, y, w, 1);

    // grain
    if (noiseCanvas) {
      ctx.globalAlpha = 1;
      const ox = Math.floor(Math.random() * 64), oy = Math.floor(Math.random() * 64);
      ctx.drawImage(noiseCanvas, ox, oy, 64, 64, 0, 0, w, h);
    }

    // vignette
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }
}

function loop(time) {
  rafId = requestAnimationFrame(loop);
  if (reduced) return;
  // throttle to ~24fps for a filmic cadence and lower CPU
  if (time - (loop.last || 0) < 41) return;
  loop.last = time;
  active.forEach((p) => p.draw(time));
}

function attachImage(el, cfg) {
  const img = document.createElement('img');
  img.alt = cfg.alt || '';
  img.decoding = 'async';
  img.loading = 'lazy';
  img.src = cfg.img;
  img.className = 'kb';
  if (cfg.pos) img.style.objectPosition = cfg.pos;
  // every still gets its own slow camera move so the frame feels alive
  const seed = hash(el.dataset.media || cfg.img);
  img.style.setProperty('--kb-dur', `${14 + Math.round(seed * 10)}s`);
  img.style.setProperty('--kb-x', `${(seed - 0.5) * 6}%`);
  img.style.setProperty('--kb-y', `${((seed * 7) % 1 - 0.5) * 6}%`);
  img.style.animationDelay = `-${Math.round(seed * 12)}s`;
  el.classList.add('media--photo');
  el.appendChild(img);
  return img;
}

function attachVideo(el, cfg) {
  const v = document.createElement('video');
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = 'metadata';
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  if (cfg.poster) v.poster = cfg.poster;
  v.dataset.src = cfg.src;
  el.appendChild(v);
  return v;
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const item = e.target.__media;
    if (!item) return;
    if (e.isIntersecting) {
      if (item.video) {
        if (!item.video.src) item.video.src = item.video.dataset.src;
        item.video.play().catch(() => {});
      } else if (item.ph) active.add(item.ph);
    } else {
      if (item.video) item.video.pause();
      else if (item.ph) active.delete(item.ph);
    }
  });
}, { rootMargin: '20% 0px' });

export function mountMedia(el) {
  if (el.__media) return el.__media;
  const id = el.dataset.media;
  const cfg = MEDIA[id] || (MEDIA[id] = { tone: el.dataset.tone || ['warm', 'cool', 'mono'][Math.floor(hash(id) * 3)] });
  if (el.dataset.tone) cfg.tone = el.dataset.tone;
  const item = { el, id };
  if (cfg.src) item.video = attachVideo(el, cfg);
  else if (cfg.img || el.dataset.img) item.img = attachImage(el, { ...cfg, img: el.dataset.img || cfg.img, pos: el.dataset.pos || cfg.pos });
  else item.ph = new Placeholder(el, id, cfg);
  el.__media = item;
  all.push(item);
  io.observe(el);
  return item;
}

export function initMedia(root = document) {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!noiseCanvas) noiseCanvas = makeNoise();
  root.querySelectorAll('.media[data-media]').forEach(mountMedia);
  if (!rafId) rafId = requestAnimationFrame(loop);
}

/** Clone a media element's visual into another container (used by the project scene modal). */
export function createMedia(id, ratio, tone, img, pos) {
  const el = document.createElement('div');
  el.className = 'media';
  el.dataset.media = id;
  el.dataset.ratio = ratio;
  if (tone) el.dataset.tone = tone;
  if (img) el.dataset.img = img;
  if (pos) el.dataset.pos = pos;
  mountMedia(el);
  return el;
}
