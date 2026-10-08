/**
 * SOUND — minimal synthesized sound design (no audio files).
 * Off by default. Everything is generated with WebAudio:
 *   shutter  — camera shutter (noise burst + mechanical click)
 *   tick     — tiny interface click
 *   whoosh   — filtered noise sweep for scene transitions
 *   bass     — subtle sub pulse
 */
import { t } from './i18n.js';

export function initSound(toggleBtn) {
  let ctx = null;
  let master = null;
  let enabled = false;
  let noiseBuffer = null;

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    const len = ctx.sampleRate * 1.5;
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  function noise(duration, { freq = 1200, q = 0.8, type = 'bandpass', gain = 0.3, attack = 0.002, sweepTo = null } = {}) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + duration);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + duration + 0.05);
  }

  function tone(freq, duration, { type = 'sine', gain = 0.2, to = null } = {}) {
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + duration);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + duration + 0.05);
  }

  const api = {
    get enabled() { return enabled; },
    shutter() {
      if (!enabled) return;
      noise(0.05, { freq: 3200, q: 1.2, gain: 0.5, attack: 0.001 });
      tone(180, 0.06, { type: 'square', gain: 0.08, to: 60 });
      setTimeout(() => { if (enabled) noise(0.08, { freq: 2200, q: 1, gain: 0.35 }); }, 70);
    },
    clap() {
      if (!enabled) return;
      noise(0.09, { freq: 1800, q: 0.8, gain: 0.9, attack: 0.001 });
      tone(120, 0.12, { type: 'square', gain: 0.12, to: 40 });
      setTimeout(() => { if (enabled) noise(0.25, { freq: 600, q: 0.5, gain: 0.25, sweepTo: 150 }); }, 40);
    },
    tick() {
      if (!enabled) return;
      noise(0.03, { freq: 4000, q: 2, gain: 0.18, attack: 0.001 });
      tone(900, 0.03, { gain: 0.05, to: 500 });
    },
    whoosh() {
      if (!enabled) return;
      noise(0.55, { freq: 300, q: 0.6, gain: 0.22, attack: 0.12, sweepTo: 2400 });
    },
    bass() {
      if (!enabled) return;
      tone(55, 0.6, { gain: 0.25, to: 38 });
    },
    toggle() {
      ensure();
      if (ctx.state === 'suspended') ctx.resume();
      enabled = !enabled;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(enabled ? 0.9 : 0.0, ctx.currentTime + 0.25);
      document.body.dataset.sound = enabled ? 'on' : 'off';
      if (toggleBtn) {
        toggleBtn.classList.toggle('is-on', enabled);
        toggleBtn.setAttribute('aria-pressed', String(enabled));
        toggleBtn.querySelector('.sound__label').textContent = enabled ? t('sound.on') : t('sound.off');
      }
      if (enabled) setTimeout(() => api.shutter(), 120);
      return enabled;
    },
  };

  if (toggleBtn) toggleBtn.addEventListener('click', () => api.toggle());
  return api;
}
