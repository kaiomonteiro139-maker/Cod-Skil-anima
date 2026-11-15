// "O cachorrinho que esperou 300 dias" — roadside gas station, 3D toon puppy/car/girl with ink outline, visual rain, follow button + goal bar overlays.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400); scene.add(camera); scene.fog = new THREE.Fog(0x202840, 30, 120);
let SEED = 5; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([110, 110, 110, 255, 190, 190, 190, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => { const m = add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent); return m; };
const SPH = new THREE.SphereGeometry(1, 22, 16), CYL = new THREE.CylinderGeometry(1, 1, 1, 16), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);
const signTex = (lines, o = {}) => { const [c, g] = cv(o.w || 512, o.h || 256); g.fillStyle = o.bg || "#c0392b"; g.fillRect(0, 0, c.width, c.height); g.fillStyle = o.fg || "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => { g.font = `900 ${o.size || 110}px "DejaVu Sans"`; g.fillText(l, c.width / 2, c.height / 2 + (i - (lines.length - 1) / 2) * (o.size || 110) * 1.1); }); return tex(c, false); };

// ---------- world ----------
const grassTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#5f8a3e"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 700; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(40,70,30,0.5)" : "rgba(140,180,90,0.45)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - 8 - rnd() * 10); g.stroke(); } const t = tex(c); t.repeat.set(40, 40); return t; })();
const roadTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#3a3d44"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "20,20,24" : "90,92,100"},0.35)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); }
  g.fillStyle = "#f2d14a"; for (let x = 0; x < 512; x += 128) g.fillRect(x, 248, 70, 16); g.fillStyle = "#e8e8e8"; g.fillRect(0, 30, 512, 10); g.fillRect(0, 472, 512, 10); const t = tex(c); t.repeat.set(30, 1); return t; })();
const concTex = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#9a9a96"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(60,60,60,0.5)"; g.lineWidth = 3; g.strokeRect(0, 0, 256, 256); for (let i = 0; i < 200; i++) { g.fillStyle = "rgba(70,70,70,0.25)"; g.fillRect(rnd() * 256, rnd() * 256, 2, 2); } const t = tex(c); t.repeat.set(8, 6); return t; })();
const GRASS = add(new THREE.PlaneGeometry(400, 400), toon(0xffffff, grassTex), 0, -0.02, 0); GRASS.rotation.x = -Math.PI / 2;
const ROAD = add(new THREE.PlaneGeometry(240, 7), toon(0xffffff, roadTex), 0, 0.0, 0); ROAD.rotation.x = -Math.PI / 2;
const APRON = add(new THREE.PlaneGeometry(22, 14), toon(0xffffff, concTex), 0, 0.01, -10.5); APRON.rotation.x = -Math.PI / 2;
const puddles = []; for (const [x, z, s] of [[3.6, -2.2, 1.1], [-2.5, -5.5, 1.6], [6, -8, 1.2], [-6, 1.6, 1.4], [9, -1.6, 0.9]]) { const p = add(new THREE.CircleGeometry(1, 24), toon(0x5a6a9a, null, { transparent: true, opacity: 0.85 }), x, 0.02, z); p.rotation.x = -Math.PI / 2; p.scale.set(s, s * 0.6, 1); puddles.push(p); }
// gas station: canopy, pillars, pumps, shop, sign
const ST = grp(scene, 0, 0, -8);
const white = toon(0xf2f2ee), red = toon(0xd8333a), dark = toon(0x2a2c32), glass = basic(0xffe9a8);
box(11, 0.5, 6.5, white, 0, 4.6, 0, ST); box(11.1, 0.32, 6.6, red, 0, 4.42, 0, ST);
for (const [x, z] of [[-4.6, -2.4], [4.6, -2.4], [-4.6, 2.4], [4.6, 2.4]]) box(0.35, 4.5, 0.35, white, x, 0, z, ST);
const canopyLights = []; for (const x of [-3, 0, 3]) { const l = add(new THREE.PlaneGeometry(1.6, 0.5), basic(0xfff6d8), x, 4.4, 0, ST); l.rotation.x = Math.PI / 2; canopyLights.push(l); }
for (const x of [-2, 2]) { box(0.8, 1.6, 0.6, red, x, 0, 0, ST); box(0.84, 0.5, 0.64, white, x, 1.6, 0, ST); add(new THREE.PlaneGeometry(0.5, 0.35), basic(0x9fd8ff), x, 1.15, 0.31, ST); }
box(1.6, 0.25, 1.0, toon(0xbcbcb6), -2, 0, 0, ST); box(1.6, 0.25, 1.0, toon(0xbcbcb6), 2, 0, 0, ST);
const SHOP = grp(ST, 0, 0, -6); box(9, 3.6, 5, toon(0xe8dcc0), 0, 0, 0, SHOP); box(9.2, 0.4, 5.2, red, 0, 3.6, 0, SHOP);
add(new THREE.PlaneGeometry(5, 1.8), glass, -1.2, 1.6, 2.51, SHOP); add(new THREE.PlaneGeometry(1.2, 2.2), basic(0xffd890), 2.8, 1.1, 2.51, SHOP);
add(new THREE.PlaneGeometry(4.2, 0.8), toon(0xffffff, signTex(["CONVENIÊNCIA"], { w: 1024, h: 200, size: 120, bg: "#1f3a6a" })), 0, 3.2, 2.62, SHOP);
const SIGN = grp(scene, -7.5, 0, -3.8); box(0.3, 6, 0.3, dark, 0, 0, 0, SIGN); const signPanel = add(new THREE.PlaneGeometry(2.6, 1.3), basic(0xffffff, { map: signTex(["POSTO", "24H"], { w: 512, h: 256, size: 96, bg: "#d8333a" }) }), 0, 6.6, 0.16, SIGN);
box(2.7, 1.4, 0.3, dark, 0, 5.9, 0, SIGN);
// street lamp + far background
const LAMP = grp(scene, 6.5, 0, -3.6); add(CYL, dark, 0, 3, 0, LAMP).scale.set(0.1, 6, 0.1); box(1.4, 0.1, 0.1, dark, -0.65, 5.95, 0, LAMP); const bulb = add(SPH, basic(0xfff0c0), -1.3, 5.85, 0, LAMP); bulb.scale.set(0.2, 0.12, 0.2);
for (let i = 0; i < 26; i++) { const x = (rnd() - 0.5) * 160, z = -30 - rnd() * 40; const tr = grp(scene, x, 0, z); add(CYL, toon(0x4a3424), 0, 1.2, 0, tr).scale.set(0.25, 2.4, 0.25); const c = add(SPH, toon(0x2f5a2a), 0, 3.4, 0, tr); const s = 1.6 + rnd() * 1.4; c.scale.set(s, s * 1.1, s); }
for (let i = 0; i < 20; i++) { const x = (rnd() - 0.5) * 160, z = 14 + rnd() * 40; const tr = grp(scene, x, 0, z); add(CYL, toon(0x4a3424), 0, 1.2, 0, tr).scale.set(0.25, 2.4, 0.25); const c = add(SPH, toon(0x2f5a2a), 0, 3.4, 0, tr); const s = 1.6 + rnd() * 1.4; c.scale.set(s, s * 1.1, s); }
for (let i = 0; i < 12; i++) { const h = add(SPH, toon(0x3f6a3a), (rnd() - 0.5) * 300, -6, -90 - rnd() * 30); h.scale.set(30 + rnd() * 20, 14 + rnd() * 8, 20); }
// sky
const [skyC, skyG] = cv(64, 512); const skyTex = tex(skyC, false);
const SKY = add(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false })); SKY.renderOrder = -1;
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })();
const glow = (col, s, x, y, z, parent = scene) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.setScalar(s); sp.position.set(x, y, z); parent.add(sp); return sp; };
const GLOWS = [glow(0xfff0c0, 2.4, -1.3, 5.85, 0, LAMP), glow(0xff6a6a, 3.6, 0, 6.6, 0.3, SIGN), ...[-3, 0, 3].map((x) => glow(0xfff6d8, 2.2, x, 4.2, 0, ST)), glow(0xffd890, 4, -1.2, 1.6, 2.8, SHOP)];
const SUN = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xfff0c0, fog: false, depthWrite: false })); scene.add(SUN);
const LP = {
  rain: { top: "#0c1226", mid: "#1d2a4a", hor: "#3a4a6a", hemi: [0x8090c0, 0x202030, 0.9], sun: [0xa0b8ff, 0.7], dir: [0.3, 0.8, 0.4], fog: 0x26324e, fogN: 22, grass: 0x8090b0, lamps: 1, sunCol: 0x000000, rain: 1 },
  night: { top: "#0a1030", mid: "#1c2c60", hor: "#34508a", hemi: [0x8a9ad8, 0x2a2840, 1.05], sun: [0xb0c8ff, 1.1], dir: [0.4, 0.7, -0.5], fog: 0x24345e, fogN: 28, grass: 0xa0a8d0, lamps: 1, sunCol: 0xe8eeff, rain: 0 },
  day: { top: "#5aa8e0", mid: "#a8d4ee", hor: "#e8eef0", hemi: [0xfff4e6, 0x6a7050, 1.05], sun: [0xfff0d0, 2.2], dir: [-0.5, 0.8, 0.5], fog: 0xdde8f0, fogN: 45, grass: 0xffffff, lamps: 0, sunCol: 0xfff7d8, rain: 0 },
  dusk: { top: "#3a3a7a", mid: "#e0785a", hor: "#ffc070", hemi: [0xffc890, 0x5a3a40, 0.9], sun: [0xffa860, 2.2], dir: [-0.8, 0.25, 0.6], fog: 0xf0a070, fogN: 35, grass: 0xffe0c0, lamps: 0.6, sunCol: 0xffc070, rain: 0 },
};
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 120 }); scene.add(sun, sun.target);
const canopyPL = new THREE.PointLight(0xfff0d0, 0, 18, 1.4); canopyPL.position.set(0, 4, -8); scene.add(canopyPL);
const lampPL = new THREE.PointLight(0xffe0a0, 0, 14, 1.4); lampPL.position.set(5.2, 5.6, -3.6); scene.add(lampPL);
let skyKey = "";
function applyLight(name, look) { const L = LP[name];
  if (skyKey !== name) { skyKey = name; const gr = skyG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, L.top); gr.addColorStop(0.42, L.mid); gr.addColorStop(0.5, L.hor); gr.addColorStop(1, L.hor); skyG.fillStyle = gr; skyG.fillRect(0, 0, 64, 512); skyTex.needsUpdate = true; }
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2]; sun.color.setHex(L.sun[0]); sun.intensity = L.sun[1];
  const d = new THREE.Vector3(...L.dir).normalize(); sun.target.position.set(look[0], 0, look[2]); sun.position.copy(sun.target.position).addScaledVector(d, 50); sun.target.updateMatrixWorld();
  SUN.visible = L.sunCol !== 0x000000; SUN.position.copy(camera.position).addScaledVector(d, 250); SUN.scale.setScalar(name === "night" ? 24 : 60); SUN.material.color.setHex(L.sunCol || 0xffffff);
  scene.fog.color.setHex(L.fog); scene.fog.near = L.fogN; scene.fog.far = L.fogN * 4; GRASS.material.color.setHex(L.grass);
  canopyPL.intensity = 9 * L.lamps; lampPL.intensity = 7 * L.lamps; GLOWS.forEach((g) => (g.visible = L.lamps > 0)); RAIN.visible = !!L.rain; }
// rain (visual only): streaks around the camera
const RAIN = (() => { const n = 1400, p = new Float32Array(n * 6); for (let i = 0; i < n; i++) { p[i * 6] = (rnd() - 0.5) * 16; p[i * 6 + 1] = rnd() * 10; p[i * 6 + 2] = (rnd() - 0.5) * 16; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xc8d8ff, transparent: true, opacity: 0.55, fog: false })); m.frustumCulled = false; scene.add(m); m.userData.base = p.slice(); return m; })();
function rainAt(t) { const p = RAIN.geometry.attributes.position.array, b = RAIN.userData.base; for (let i = 0; i < p.length / 6; i++) { const x = b[i * 6] + camera.position.x, z = b[i * 6 + 2] + camera.position.z, y = ((b[i * 6 + 1] - t * 9) % 10 + 10) % 10 + camera.position.y - 5;
  p[i * 6] = x; p[i * 6 + 1] = y; p[i * 6 + 2] = z; p[i * 6 + 3] = x + 0.03; p[i * 6 + 4] = y + 0.45; p[i * 6 + 5] = z; } RAIN.geometry.attributes.position.needsUpdate = true; }

// ---------- the puppy ----------
const PUP = (() => { const g = grp(scene); const fur = toon(0xd99a55), cream = toon(0xf6e2c0), darkF = toon(0x8a5530), ink = toon(0x1a1214), wht = basic(0xffffff), tongueM = toon(0xe0707a);
  const body = grp(g); const torso = add(CAPS, fur, 0, 0.42, 0, body); torso.scale.set(0.24, 0.24, 0.24); torso.rotation.x = Math.PI / 2; const chest = add(SPH, cream, 0, 0.4, 0.28, body); chest.scale.set(0.19, 0.2, 0.12);
  const legs = []; for (const [x, z] of [[-0.13, 0.22], [0.13, 0.22], [-0.13, -0.22], [0.13, -0.22]]) { const pv = grp(body, x, 0.36, z); add(CYL, fur, 0, -0.17, 0, pv).scale.set(0.065, 0.34, 0.065); add(SPH, cream, 0, -0.35, 0.03, pv).scale.set(0.075, 0.05, 0.09); legs.push(pv); }
  const tail = grp(body, 0, 0.5, -0.32); const tl = add(CAPS, fur, 0, 0.12, -0.04, tail); tl.scale.set(0.04, 0.12, 0.04); tl.rotation.x = -0.6;
  const neck = grp(body, 0, 0.58, 0.24); const head = grp(neck, 0, 0.2, 0.06);
  const skull = add(SPH, fur, 0, 0, 0, head); skull.scale.set(0.27, 0.25, 0.25); const muzz = add(SPH, cream, 0, -0.07, 0.19, head); muzz.scale.set(0.15, 0.11, 0.12);
  const nose = add(SPH, ink, 0, -0.02, 0.31, head); nose.scale.set(0.05, 0.035, 0.035);
  const jaw = grp(head, 0, -0.13, 0.12); add(SPH, cream, 0, -0.01, 0.07, jaw).scale.set(0.1, 0.04, 0.08); const tongue = add(SPH, tongueM, 0, -0.03, 0.12, jaw); tongue.scale.set(0.05, 0.02, 0.06);
  const mouthIn = add(SPH, basic(0x3a1418), 0, -0.13, 0.26, head); mouthIn.scale.set(0.07, 0.01, 0.03);
  const ears = []; for (const s of [-1, 1]) { const pv = grp(head, s * 0.2, 0.13, -0.02); const e = add(SPH, darkF, s * 0.05, -0.12, 0, pv); e.scale.set(0.07, 0.16, 0.11); e.rotation.z = s * 0.25; ears.push(pv); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.1, 0.03, 0.2); const ball = add(SPH, ink, 0, 0, 0, e); ball.scale.set(0.055, 0.065, 0.04); const hl = add(SPH, wht, 0.018, 0.022, 0.03, e); hl.scale.setScalar(0.017); const hl2 = add(SPH, wht, -0.015, -0.02, 0.032, e); hl2.scale.setScalar(0.008);
    const brow = add(CAPS, darkF, 0, 0.085, 0.02, e); brow.scale.set(0.012, 0.03, 0.012); brow.rotation.z = Math.PI / 2; eyes.push({ e, brow, s, ball }); }
  const spot = add(SPH, darkF, 0.08, 0.13, 0.12, head); spot.scale.set(0.09, 0.06, 0.06);
  return { g, body, torso, legs, tail, neck, head, jaw, tongue, mouthIn, ears, eyes };
})();
const blinkAt = (t, s) => ((t * 1000 + s * 997) % 3300) < 120;
/** pup: { pos, yaw, sit 0..1, run phase|null, wag 0..1, ears (-1 droop .. 1 perk), tilt, headYaw, headPitch, bark 0..1, sad 0..1, wet } */
function posePup(p, t) { const P = PUP; P.g.visible = true; P.g.position.set(...p.pos); P.g.rotation.y = p.yaw ?? 0; P.g.scale.setScalar(p.scale ?? 1);
  const sit = p.sit ?? 0, r = p.run; P.body.rotation.x = -0.55 * sit; P.body.position.y = -0.04 * sit + (r != null ? Math.abs(Math.sin(r * 9)) * 0.07 : 0); P.body.position.z = -0.1 * sit;
  P.legs.forEach((lg, i) => { let a = r == null ? 0 : Math.sin(r * 9 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.8; if (i >= 2) a += 1.25 * sit; else a += 0.45 * sit; lg.rotation.x = a; });
  P.neck.rotation.x = 0.5 * sit + (p.headPitch ?? 0) + 0.25 * (p.sad ?? 0); P.neck.rotation.y = p.headYaw ?? 0; P.head.rotation.z = (p.tilt ?? 0) + Math.sin(t * 1.3) * 0.04;
  const w = p.wag ?? 0; P.tail.rotation.z = Math.sin(t * 22) * 0.7 * w; P.tail.rotation.x = -0.4 * (1 - w) * (p.sad ?? 0) + 0.3 * w;
  const ear = p.ears ?? 0; P.ears.forEach((e, i) => { e.rotation.z = (i ? 1 : -1) * (0.25 - 0.35 * ear) + Math.sin(t * 3 + i) * 0.04; e.rotation.x = -0.2 * ear; });
  const b = p.bark ?? 0; P.jaw.rotation.x = 0.55 * b; P.mouthIn.scale.y = 0.01 + 0.05 * b; P.tongue.visible = (p.tongue ?? 0) > 0.5 || b > 0.3;
  P.eyes.forEach((e) => { const bl = blinkAt(t, 2) ? 0.15 : 1; e.ball.scale.y = 0.065 * bl; e.brow.position.y = 0.085 - 0.012 * (p.sad ?? 0); e.brow.rotation.z = Math.PI / 2 - e.s * 0.45 * (p.sad ?? 0); });
  P.torso.material.color.setHex(p.wet ? 0xb8834a : 0xd99a55); }

// ---------- the red car ----------
const CAR = (() => { const g = grp(scene); const body = toon(0xd8333a), win = toon(0x2a3448), tire = toon(0x141414), chrome = toon(0xd0d4d8);
  box(3.8, 0.7, 1.7, body, 0, 0.32, 0, g); const cab = box(2.1, 0.62, 1.55, body, -0.2, 1.02, 0, g); for (const s of [-1, 1]) add(new THREE.PlaneGeometry(1.85, 0.42), win, -0.2, 1.36, s * 0.78, g).rotation.y = s > 0 ? 0 : Math.PI;
  add(new THREE.PlaneGeometry(1.4, 0.44), win, 0.86, 1.34, 0, g).rotation.y = Math.PI / 2;
  for (const xx of [-1.2, 1.2]) for (const s of [-1, 1]) { const w = add(CYL, tire, xx, 0.34, s * 0.8, g); w.scale.set(0.34, 0.24, 0.34); w.rotation.x = Math.PI / 2; add(CYL, chrome, xx, 0.34, s * 0.93, g).scale.set(0.15, 0.02, 0.15); g.children[g.children.length - 1].rotation.x = Math.PI / 2; }
  const heads = [-1, 1].map((s) => add(SPH, basic(0xfff6d0), 1.9, 0.75, s * 0.55, g)); heads.forEach((h) => h.scale.set(0.05, 0.1, 0.16));
  const tails = [-1, 1].map((s) => add(SPH, basic(0xff3030), -1.9, 0.78, s * 0.6, g)); tails.forEach((h) => h.scale.set(0.05, 0.08, 0.14));
  const beams = [-1, 1].map((s) => glow(0xfff0c0, 2.2, 2.0, 0.75, s * 0.55, g)); const tailG = [-1, 1].map((s) => glow(0xff3030, 1.4, -2.0, 0.78, s * 0.6, g));
  // passenger door on the -z side (opens outward)
  const door = grp(g, 0.55, 0, -0.86); box(1.15, 1.0, 0.06, body, -0.58, 0.3, 0, door); add(new THREE.PlaneGeometry(1.0, 0.4), win, -0.58, 1.36, -0.035, door).rotation.y = Math.PI;
  const driver = grp(g, 0.1, 0.95, 0.35); add(SPH, toon(0x3a2a22), 0, 0.3, 0, driver).scale.setScalar(0.22);
  return { g, door, beams, tailG, driver };
})();
function poseCar(c) { CAR.g.visible = true; CAR.g.position.set(c.pos[0], 0, c.pos[2]); CAR.g.rotation.y = c.yaw ?? 0; CAR.door.rotation.y = (c.door ?? 0) * 1.1; CAR.beams.forEach((b) => (b.visible = !!c.lights)); CAR.tailG.forEach((b) => (b.visible = !!c.lights)); CAR.driver.visible = c.driver !== false; }
// extra passing cars (other colors)
const OTHERS = [0x2d6fd0, 0xf2c230, 0x2fb36a, 0xe8e8e8, 0xd8333a].map((col) => { const g = grp(scene); const m = toon(col); box(3.6, 0.7, 1.6, m, 0, 0.32, 0, g); box(2.0, 0.6, 1.5, m, -0.2, 1.02, 0, g);
  for (const xx of [-1.1, 1.1]) for (const s of [-1, 1]) { const w = add(CYL, toon(0x141414), xx, 0.32, s * 0.76, g); w.scale.set(0.32, 0.22, 0.32); w.rotation.x = Math.PI / 2; } [-1, 1].forEach((s) => glow(0xfff0c0, 2.0, 1.85, 0.72, s * 0.5, g)); return g; });

// ---------- the girl (bean person) ----------
const GIRL = (() => { const g = grp(scene); const dress = toon(0xe5487a), skin = toon(0xe8b48e), hair = toon(0x4a2a18), ink = toon(0x1a1214);
  const b = add(CAPS, dress, 0, 0.62, 0, g); b.scale.set(0.24, 0.32, 0.22); const head = grp(g, 0, 1.2, 0); add(SPH, skin, 0, 0, 0, head).scale.setScalar(0.22);
  const hr = add(SPH, hair, 0, 0.05, -0.04, head); hr.scale.set(0.235, 0.22, 0.23); for (const s of [-1, 1]) add(SPH, hair, s * 0.24, -0.05, -0.04, head).scale.setScalar(0.09);
  const bang = add(SPH, hair, 0, 0.13, 0.1, head); bang.scale.set(0.19, 0.08, 0.12);
  for (const s of [-1, 1]) { add(SPH, ink, s * 0.075, 0.0, 0.2, head).scale.set(0.025, 0.035, 0.02); add(SPH, toon(0xf08a8a), s * 0.12, -0.06, 0.17, head).scale.set(0.035, 0.02, 0.01); }
  const smile = add(new THREE.TorusGeometry(0.05, 0.01, 6, 16, Math.PI), ink, 0, -0.07, 0.205, head); smile.rotation.z = Math.PI;
  const arm = grp(g, 0.2, 0.85, 0.05); add(CAPS, skin, 0, -0.18, 0, arm).scale.set(0.05, 0.16, 0.05); const arm2 = grp(g, -0.2, 0.85, 0.05); add(CAPS, skin, 0, -0.18, 0, arm2).scale.set(0.05, 0.16, 0.05);
  for (const s of [-1, 1]) add(CAPS, skin, s * 0.09, 0.15, 0, g).scale.set(0.05, 0.1, 0.05);
  return { g, head, arm, arm2 };
})();
function poseGirl(p, t) { GIRL.g.visible = true; GIRL.g.position.set(...p.pos); GIRL.g.rotation.y = p.yaw ?? 0; GIRL.arm.rotation.x = -1.4 * (p.reach ?? 0) - 0.1; GIRL.arm.rotation.z = 0.15; GIRL.arm2.rotation.z = -0.15;
  GIRL.g.rotation.x = 0.25 * (p.crouch ?? 0); GIRL.g.position.y -= 0.15 * (p.crouch ?? 0); GIRL.head.rotation.z = Math.sin(t * 1.5) * 0.05 + (p.tilt ?? 0); }
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } });
GRASS.castShadow = ROAD.castShadow = APRON.castShadow = false;

// ---------- post: ink outline + bloom + vignette ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 5.0 * Math.min(W, H) / 1080 }, vig: { value: 0.35 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.012, 0.04, e) * (1.0 - smoothstep(50.0, 140.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 22.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.8, 0.0); }
      c += bl / 12.0 * 1.3; c = mix(c, vec3(0.06, 0.05, 0.06), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- 2D overlays: follow button, goal bar ----------
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function followBtn(g, e, t) { const u = Math.min(W, H) / 1080, k = Math.min(1, e.k), pulse = 1 + 0.06 * Math.sin(t * 10) * (e.tap ? 0 : 1), tap = e.tap ?? 0, s = (0.4 + 0.6 * k + 0.15 * Math.sin(k * Math.PI)) * pulse * (1 - 0.08 * Math.sin(Math.min(1, tap) * Math.PI));
  g.save(); g.globalAlpha = Math.min(1, k * 2); g.translate(W / 2, H * 0.83); g.scale(s, s); const done = tap > 0.5, bw = 470 * u, bh = 120 * u;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * u, -bh / 2 + 10 * u, bw, bh, bh / 2); g.fill();
  g.fillStyle = done ? "#3a3d44" : "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * u; g.strokeStyle = "#ffffff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * u}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(done ? "✓ Seguindo" : "+ Seguir", 0, 4 * u);
  if (e.hand) { const hx = 150 * u + (1 - Math.min(1, tap * 2)) * 60 * u, hy = 70 * u + (1 - Math.min(1, tap * 2)) * 60 * u; g.font = `${120 * u}px "Noto Color Emoji", "DejaVu Sans"`; g.fillText("👆", hx, hy + 40 * u); }
  g.restore(); }
function goalBar(g, e) { const u = Math.min(W, H) / 1080, k = Math.min(1, e.k); g.save(); g.globalAlpha = k; const bw = W * 0.8, bh = 46 * u, x = (W - bw) / 2, y = H * 0.81;
  g.fillStyle = "rgba(10,10,20,0.75)"; rr(g, x - 24 * u, y - 92 * u, bw + 48 * u, bh + 128 * u, 26 * u); g.fill();
  g.fillStyle = "#fff"; g.font = `800 ${40 * u}px "Inter", "DejaVu Sans"`; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("🔒 Parte 2: rumo a 1.000 seguidores", x, y - 46 * u);
  g.fillStyle = "#3a3d44"; rr(g, x, y, bw, bh, bh / 2); g.fill(); const f = Math.max(0.04, e.v ?? 0.5); const gr = g.createLinearGradient(x, 0, x + bw, 0); gr.addColorStop(0, "#ffd23f"); gr.addColorStop(1, "#ff7a3a"); g.fillStyle = gr; rr(g, x, y, bw * f, bh, bh / 2); g.fill();
  g.lineWidth = 4 * u; g.strokeStyle = "#fff"; rr(g, x, y, bw, bh, bh / 2); g.stroke(); g.restore(); }

// ---------- render one state ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.up.set(0, 1, 0); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 50; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  applyLight(st.light || "rain", c.look); if (RAIN.visible) rainAt(t);
  if (st.pup) posePup(st.pup, t); else PUP.g.visible = false;
  if (st.car) poseCar(st.car); else CAR.g.visible = false;
  OTHERS.forEach((o, i) => { const d = (st.others || [])[i]; o.visible = !!d; if (d) { o.position.set(d.pos[0], 0, d.pos[2]); o.rotation.y = d.yaw ?? 0; } });
  if (st.girl) poseGirl(st.girl, t); else GIRL.g.visible = false;
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.b && S.mix > 0) { renderState(S.b, t); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); og.globalAlpha = 1; }
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.follow) followBtn(og, S.follow, t); if (S.goal) goalBar(og, S.goal);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
