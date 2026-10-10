/**
 * LENS — the hero 3D object.
 * A physically-lit camera lens built procedurally (no external models),
 * which morphs on scroll:  CAMERA LENS → SMARTPHONE CAMERA → DIGITAL WINDOW.
 *
 * Public API:
 *   setProgress(p)   0..1 morph progress (driven by ScrollTrigger)
 *   setVisible(bool) pause rendering when off-screen
 *   setScrollVelocity(v)
 *   ready            Promise resolved after first frame
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function makeTextRing(text) {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0c0c0c';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#d8d6d0';
  ctx.font = '500 44px "Geist Mono", "SF Mono", Menlo, monospace';
  ctx.textBaseline = 'middle';
  let x = 20;
  const unit = text + '      ';
  while (x < c.width + 400) { ctx.fillText(unit, x, 64); x += ctx.measureText(unit).width; }
  // accent index mark
  ctx.fillStyle = '#e3a84f';
  ctx.fillRect(0, 40, 10, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createLens(canvas, { isMobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // studio environment for reflections: a dark room with long softboxes
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x050505);
  const softbox = (w, h, color, intensity, pos, look) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.material.color.multiplyScalar(intensity);
    m.position.set(...pos);
    m.lookAt(...look);
    studio.add(m);
  };
  softbox(14, 2.2, 0xfff3e0, 6, [0, 7, 4], [0, 0, 0]);        // top warm strip
  softbox(2.4, 12, 0xdfe8ff, 3.5, [-9, 0, 2], [0, 0, 0]);     // left cool tall strip
  softbox(1.6, 10, 0xffffff, 2.2, [8, -2, 3], [0, 0, 0]);     // right thin strip
  softbox(10, 1, 0xe3a84f, 1.2, [0, -7, -2], [0, 0, 0]);      // low amber rim
  scene.environment = pmrem.fromScene(studio, 0.02).texture;

  const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
  key.position.set(4, 5, 6);
  const rim = new THREE.DirectionalLight(0xcfd8ff, 1.6);
  rim.position.set(-6, -2, -3);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-3, 3, 5);
  scene.add(key, rim, fill);

  // ---------- materials ----------
  const metalBlack = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.85, roughness: 0.38 });
  const matte = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0.4, roughness: 0.75 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd6d6d6, metalness: 1, roughness: 0.16 });
  const darkChrome = new THREE.MeshStandardMaterial({ color: 0x5c5c5c, metalness: 1, roughness: 0.28 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.8, ior: 1.52,
    clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 0.5, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 480],
    envMapIntensity: 1.6, transparent: true, opacity: 1,
  });
  const coated = new THREE.MeshPhysicalMaterial({
    color: 0x1a1830, metalness: 0.3, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02,
    iridescence: 0.9, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 700], envMapIntensity: 2.2,
  });
  const deep = new THREE.MeshPhysicalMaterial({ color: 0x090a12, metalness: 0.2, roughness: 0.12, clearcoat: 0.8, envMapIntensity: 1.2 });
  const screenGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0e, metalness: 0.1, roughness: 0.18, transmission: 0.35, thickness: 0.3, ior: 1.45,
    clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.9, transparent: true, opacity: 0.75,
  });

  // ---------- LENS ----------
  const lens = new THREE.Group();
  const R = 1.5, L = 1.7;

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.96, L, 96, 1), metalBlack);
  barrel.rotation.x = Math.PI / 2;
  lens.add(barrel);

  const rear = new THREE.Mesh(new THREE.CircleGeometry(R * 0.96, 64), deep);
  rear.position.z = -L / 2 - 0.001;
  rear.rotation.y = Math.PI;
  lens.add(rear);

  const frontRing = new THREE.Mesh(new THREE.TorusGeometry(R - 0.03, 0.07, 24, 128), chrome);
  frontRing.position.z = L / 2;
  lens.add(frontRing);

  const frontLip = new THREE.Mesh(new THREE.RingGeometry(R * 0.86, R - 0.03, 128), metalBlack);
  frontLip.position.z = L / 2 + 0.01;
  lens.add(frontLip);

  // knurled focus ring (instanced ridges)
  const ridgeGeo = new THREE.BoxGeometry(0.05, 0.03, 0.52);
  const ridges = new THREE.InstancedMesh(ridgeGeo, darkChrome, 84);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
  for (let i = 0; i < 84; i++) {
    const a = (i / 84) * Math.PI * 2;
    p.set(Math.cos(a) * (R + 0.01), Math.sin(a) * (R + 0.01), -0.05);
    q.setFromEuler(new THREE.Euler(0, 0, a + Math.PI / 2));
    m.compose(p, q, s);
    ridges.setMatrixAt(i, m);
  }
  lens.add(ridges);

  // engraved text ring
  const textTex = makeTextRing('SPAINOV  50mm  1:1.8  ∅58    MOBILE · SOCIAL · WEB    ALMATY');
  const textRing = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.004, R + 0.004, 0.26, 128, 1, true),
    new THREE.MeshStandardMaterial({ map: textTex, metalness: 0.7, roughness: 0.45, color: 0xffffff })
  );
  textRing.rotation.x = Math.PI / 2;
  textRing.rotation.y = Math.PI;
  textRing.position.z = 0.48;
  lens.add(textRing);

  // front glass (spherical cap)
  const capR = 2.7, baseR = R * 0.86;
  const phi = Math.asin(baseR / capR);
  const frontGlass = new THREE.Mesh(new THREE.SphereGeometry(capR, 96, 48, 0, Math.PI * 2, 0, phi), glass);
  frontGlass.rotation.x = Math.PI / 2;
  frontGlass.position.z = L / 2 + 0.02 - capR;
  lens.add(frontGlass);

  // inner coated elements
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(R * 0.7, 0.035, 16, 96), chrome);
  innerRing.position.z = 0.35;
  lens.add(innerRing);
  const el1 = new THREE.Mesh(new THREE.CircleGeometry(R * 0.72, 96), coated);
  el1.position.z = 0.3;
  lens.add(el1);
  const el2 = new THREE.Mesh(new THREE.CircleGeometry(R * 0.55, 96), deep);
  el2.position.z = 0.05;
  lens.add(el2);

  // aperture blades
  const aperture = new THREE.Group();
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.quadraticCurveTo(0.55, 0.05, 0.75, 0.42);
  bladeShape.quadraticCurveTo(0.35, 0.5, 0, 0.52);
  bladeShape.lineTo(0, 0);
  const bladeGeo = new THREE.ShapeGeometry(bladeShape, 12);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0e0e10, metalness: 0.9, roughness: 0.4, side: THREE.DoubleSide });
  const blades = [];
  const N = 9;
  for (let i = 0; i < N; i++) {
    const pivot = new THREE.Group();
    const a = (i / N) * Math.PI * 2;
    pivot.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0);
    pivot.rotation.z = a + Math.PI;
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    pivot.add(blade);
    aperture.add(pivot);
    blades.push(pivot);
  }
  aperture.position.z = 0.08;
  lens.add(aperture);

  // small accent index on the barrel
  const index = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.12), new THREE.MeshStandardMaterial({ color: 0xe3a84f, emissive: 0xe3a84f, emissiveIntensity: 0.7, roughness: 0.4 }));
  index.position.set(0, R + 0.015, 0.75);
  lens.add(index);

  // ---------- SMARTPHONE CAMERA MODULE ----------
  const module = new THREE.Group();
  const plate = new THREE.Mesh(new RoundedBoxGeometry(3.4, 3.4, 0.36, 6, 0.6), matte);
  module.add(plate);
  const plateEdge = new THREE.Mesh(new RoundedBoxGeometry(3.46, 3.46, 0.3, 6, 0.62), darkChrome);
  plateEdge.position.z = -0.04;
  module.add(plateEdge);
  const camPositions = [[0.75, -0.75], [-0.75, -0.75], [0.75, 0.75]];
  camPositions.forEach(([x, y]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.06, 16, 64), chrome);
    ring.position.set(x, y, 0.22);
    const g = new THREE.Mesh(new THREE.CircleGeometry(0.48, 48), coated);
    g.position.set(x, y, 0.2);
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.3, 48), deep);
    d.position.set(x, y, 0.21);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 24, 0, Math.PI * 2, 0, Math.asin(0.46 / 0.9)), glass);
    dome.rotation.x = Math.PI / 2;
    dome.position.set(x, y, 0.24 - 0.9);
    module.add(ring, g, d, dome);
  });
  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshStandardMaterial({ color: 0xfff2d0, emissive: 0xffe3a8, emissiveIntensity: 0.6, roughness: 0.3 }));
  flash.position.set(-0.75, 0.75, 0.19);
  module.add(flash);
  const lidar = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), deep);
  lidar.position.set(-0.75, 0.3, 0.19);
  module.add(lidar);

  // ---------- DIGITAL WINDOW ----------
  const win = new THREE.Group();
  const outer = new THREE.Shape();
  const W = 5.4, H = 3.4, r = 0.28;
  const rr = (shape, w, h, rad) => {
    shape.moveTo(-w / 2 + rad, -h / 2);
    shape.lineTo(w / 2 - rad, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + rad);
    shape.lineTo(w / 2, h / 2 - rad);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - rad, h / 2);
    shape.lineTo(-w / 2 + rad, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - rad);
    shape.lineTo(-w / 2, -h / 2 + rad);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rad, -h / 2);
  };
  rr(outer, W, H, r);
  const hole = new THREE.Path();
  rr(hole, W - 0.12, H - 0.12, r - 0.05);
  outer.holes.push(hole);
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.08, bevelEnabled: false, curveSegments: 24 }), chrome);
  win.add(frame);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.12, H - 0.12), screenGlass);
  pane.position.z = 0.04;
  win.add(pane);
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.6 }));
  bar.position.set(0, H / 2 - 0.06 - 0.15, 0.05);
  win.add(bar);
  [0, 1, 2].forEach((i) => {
    const dotm = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), new THREE.MeshStandardMaterial({ color: i === 0 ? 0xe3a84f : 0x3a3a3a, emissive: i === 0 ? 0xe3a84f : 0x000000, emissiveIntensity: 0.5 }));
    dotm.position.set(-W / 2 + 0.3 + i * 0.16, H / 2 - 0.21, 0.06);
    win.add(dotm);
  });

  // ---------- ROOT ----------
  const root = new THREE.Group();
  root.add(lens, module, win);
  scene.add(root);

  // ---------- state ----------
  const state = {
    progress: 0,
    visible: true,
    pointer: { x: 0, y: 0 },
    tilt: { x: 0, y: 0 },
    drag: { active: false, lastX: 0, lastY: 0, rx: 0, ry: 0, vx: 0, vy: 0 },
    scrollVel: 0,
    aperture: 0.35,
    base: 1,
  };

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    state.base = Math.min(0.62, Math.max(0.4, camera.aspect * 0.4));
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    state.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (state.drag.active) {
      const dx = e.clientX - state.drag.lastX;
      const dy = e.clientY - state.drag.lastY;
      state.drag.vx = dx * 0.006; state.drag.vy = dy * 0.006;
      state.drag.ry += state.drag.vx; state.drag.rx += state.drag.vy;
      state.drag.lastX = e.clientX; state.drag.lastY = e.clientY;
    }
  }, { passive: true });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      state.drag.active = true;
      state.drag.lastX = e.clientX; state.drag.lastY = e.clientY;
      state.drag.vx = state.drag.vy = 0;
    });
    hero.style.touchAction = 'pan-y';
  }
  window.addEventListener('pointerup', () => { state.drag.active = false; });
  window.addEventListener('pointercancel', () => { state.drag.active = false; });

  // ---------- morph ----------
  const tmp = { lensScale: 1, lensX: 0, lensY: 0, lensZ: 0 };
  function applyMorph(p, t) {
    // LENS: full until 0.2, then shrinks & moves into the module's top-left camera
    const toModule = smooth(0.18, 0.46, p);
    const lensS = lerp(1, 0.33, toModule);
    lens.scale.setScalar(lensS);
    lens.position.set(lerp(0, -0.75, toModule), lerp(0, 0.75, toModule), lerp(0, 0.22, toModule));
    lens.visible = p < 0.6;
    // aperture breathes, closes as we leave
    const breathe = 0.35 + Math.sin(t * 0.8) * 0.08;
    const ap = lerp(breathe, 0.95, smooth(0.08, 0.22, p));
    blades.forEach((b, i) => { b.rotation.z = (i / N) * Math.PI * 2 + Math.PI + ap * 0.95; });

    // MODULE: grows in behind the lens, then flips away into the window
    const moduleIn = smooth(0.2, 0.46, p);
    const moduleOut = smooth(0.56, 0.78, p);
    const ms = lerp(0.001, 1, moduleIn) * lerp(1, 0.7, moduleOut);
    module.scale.setScalar(ms);
    module.rotation.y = lerp(0.9, 0, moduleIn) + lerp(0, -Math.PI / 2, moduleOut);
    module.rotation.x = lerp(-0.4, 0, moduleIn);
    module.position.z = lerp(-1.2, -0.1, moduleIn);
    module.visible = p > 0.17 && p < 0.8;

    // WINDOW: flips in from the module, then dissolves away as the real frame takes over
    const winIn = smooth(0.6, 0.82, p);
    const winOut = smooth(0.86, 1.0, p);
    const ws = lerp(0.35, 1, winIn) * lerp(1, 1.6, winOut);
    win.scale.setScalar(ws);
    win.rotation.y = lerp(Math.PI / 2, 0, winIn) + lerp(0, 0.25, winOut);
    win.position.z = lerp(-1, 0, winIn) + lerp(0, 3.5, winOut);
    win.visible = p > 0.58 && p < 0.995;
    screenGlass.opacity = 0.75 * (1 - winOut);
    chrome.opacity = 1;
  }

  let last = performance.now();
  let frames = 0;
  let readyResolve;
  const ready = new Promise((res) => { readyResolve = res; });

  function render(now) {
    requestAnimationFrame(render);
    if (!state.visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    const p = state.progress;

    // inertia on drag
    if (!state.drag.active) {
      state.drag.vx *= 0.92; state.drag.vy *= 0.92;
      state.drag.ry += state.drag.vx; state.drag.rx += state.drag.vy;
    }
    state.drag.rx = Math.max(-0.9, Math.min(0.9, state.drag.rx));

    // pointer parallax + scroll velocity tilt
    const px = state.pointer.x, py = state.pointer.y;
    state.tilt.x += ((py * 0.22 + state.scrollVel * 0.0012) - state.tilt.x) * 0.06;
    state.tilt.y += ((px * 0.35) - state.tilt.y) * 0.06;
    state.scrollVel *= 0.9;

    const idle = Math.sin(t * 0.5) * 0.08;
    const baseRx = -0.28 * (1 - p), baseRy = 0.55 * (1 - p);
    root.rotation.x = baseRx + state.tilt.x + state.drag.rx * (1 - p) + idle * 0.5;
    root.rotation.y = baseRy + state.tilt.y + state.drag.ry * (1 - p) + idle;
    root.rotation.z = Math.sin(t * 0.3) * 0.03;
    root.scale.setScalar(state.base);
    root.position.y = Math.sin(t * 0.7) * 0.06 - 0.15 + p * 1.6;
    root.position.x = 1.15 * (1 - p * 0.3);

    textRing.rotation.y = t * 0.08 + Math.PI;

    applyMorph(p, t);
    renderer.render(scene, camera);
    if (++frames === 2) readyResolve();
  }
  requestAnimationFrame(render);

  return {
    ready,
    setProgress(v) { state.progress = clamp01(v); },
    setVisible(v) {
      if (v === state.visible) return;
      state.visible = v;
      canvas.style.visibility = v ? 'visible' : 'hidden';
      if (v) last = performance.now();
    },
    setScrollVelocity(v) { state.scrollVel = v; },
    get progress() { return state.progress; },
  };
}
