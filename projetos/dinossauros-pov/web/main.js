// "E se você acordasse na época dos dinossauros?" — POV, toon world, rendered frame by frame.
import * as THREE from "./three.module.js";
import { FPS, TOTAL, stateAt } from "./story.js";

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(76, W / H, 0.03, 900); scene.add(camera);

// ---------- helpers ----------
let SEED = 11; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([80, 80, 80, 255, 160, 160, 160, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });
const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const ell = (rx, ry, rz, mat, parent, x = 0, y = 0, z = 0, seg = 20) => { const m = mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7)), mat, parent, x, y, z); m.scale.set(rx, ry, rz); return m; };
const grp = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
/** tapered box: front face (+z) scaled by fx, fy and dropped by dy */
function taperBox(w, h, d, fx, fy, dy = 0) {
  const g = new THREE.BoxGeometry(w, h, d, 2, 2, 4); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const u = (p.getZ(i) + d / 2) / d; const sx = 1 + (fx - 1) * u, sy = 1 + (fy - 1) * u;
    p.setX(i, p.getX(i) * sx); p.setY(i, p.getY(i) * sy + dy * u); }
  g.computeVertexNormals(); return g;
}
function cone(r0, r1, len, mat, parent, seg = 12) { const g = new THREE.CylinderGeometry(r1, r0, len, seg, 1); g.translate(0, len / 2, 0); return mesh(g, mat, parent); }

// ---------- textures ----------
function skinTex(base, dark, spots = 220, stripe = true) {
  const [c, g] = cv(512, 512); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  if (stripe) { g.fillStyle = dark; g.globalAlpha = 0.55; for (let i = 0; i < 9; i++) { g.beginPath(); const x = i * 60 + rnd() * 20; g.moveTo(x, 0); g.lineTo(x + 26, 0); g.lineTo(x + 10 + rnd() * 30, 512); g.lineTo(x - 12, 512); g.fill(); } }
  g.globalAlpha = 0.35; g.fillStyle = dark; for (let i = 0; i < spots; i++) { g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 3 + rnd() * 9, 3 + rnd() * 7, rnd() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 1; return tex(c);
}
function groundTex() {
  const [c, g] = cv(512, 512); g.fillStyle = "#6f7a3c"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 500; i++) { g.globalAlpha = 0.25; g.fillStyle = rnd() > 0.5 ? "#5a6430" : "#8a8a48"; g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 6 + rnd() * 30, 4 + rnd() * 14, rnd() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 120; i++) { g.globalAlpha = 0.5; g.fillStyle = "#7a5a36"; g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 4 + rnd() * 10, 3 + rnd() * 6, rnd() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 1; return tex(c);
}
function frondTex(col, dark) {
  const [c, g] = cv(256, 512); g.strokeStyle = dark; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.moveTo(128, 500); g.quadraticCurveTo(132, 250, 128, 10); g.stroke();
  for (let i = 0; i < 22; i++) { const y = 480 - i * 21, L = 110 * Math.sin(Math.PI * (0.15 + 0.85 * (i / 22))) ;
    for (const s of [-1, 1]) { g.fillStyle = col; g.beginPath(); g.moveTo(128, y); g.quadraticCurveTo(128 + s * L * 0.6, y - 30, 128 + s * L, y - 34); g.quadraticCurveTo(128 + s * L * 0.5, y - 10, 128, y + 4); g.fill();
      g.strokeStyle = dark; g.lineWidth = 3; g.stroke(); } }
  return tex(c, false);
}
const TX = { ground: groundTex(), trex: skinTex("#6f7440", "#3f4422", 260, false), raptor: skinTex("#a8743c", "#5a3418", 320, false), hadro: skinTex("#8a9a62", "#55623a", 160, false), bark: skinTex("#6b4a2e", "#3e2a18", 80) };
TX.ground.repeat.set(60, 60);
const FERN = frondTex("#4f8a3a", "#24461c"), FERN2 = frondTex("#6a9a3a", "#33521e");

// ---------- sky ----------
const [skyC, skyG] = cv(8, 256); const skyTex = tex(skyC, false);
const sky = mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }), scene);
let skyKey = "";
function paintSky(top, mid, hor) { const k = top + mid + hor; if (k === skyKey) return; skyKey = k;
  const gr = skyG.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(0.42, mid); gr.addColorStop(0.5, hor); gr.addColorStop(1, hor);
  skyG.fillStyle = gr; skyG.fillRect(0, 0, 8, 256); skyTex.needsUpdate = true; }
const starGeo = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 1400; i++) { const th = rnd() * 6.283, ph = Math.acos(rnd() * 0.95); a.push(Math.sin(ph) * Math.cos(th) * 500, Math.cos(ph) * 500, Math.sin(ph) * Math.sin(th) * 500); }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(a, 3)); }
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe6ecff, size: 2.2, sizeAttenuation: false, fog: false })); scene.add(stars);
// the asteroid: glow sprite + core + tail
const glowTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,255,240,1)"); gr.addColorStop(0.18, "rgba(255,230,170,0.95)"); gr.addColorStop(0.45, "rgba(255,140,60,0.35)"); gr.addColorStop(1, "rgba(255,90,30,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const tailTex = (() => { const [c, g] = cv(128, 512); const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(255,200,120,0)"); gr.addColorStop(1, "rgba(255,230,180,0.9)");
  g.fillStyle = gr; g.beginPath(); g.moveTo(64, 0); g.lineTo(10, 512); g.lineTo(118, 512); g.fill(); return tex(c, false); })();
const AST = grp(scene); const ASTDIR = new THREE.Vector3(0.28, 0.62, -1).normalize();
const astGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); AST.add(astGlow);
const astTail = mesh(new THREE.PlaneGeometry(1, 4), new THREE.MeshBasicMaterial({ map: tailTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), AST);
const astLight = new THREE.PointLight(0xff9a50, 0, 0, 0); scene.add(astLight);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x5a4a2a, 1.3); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d0, 2.2); sun.position.set(-40, 60, 30); scene.add(sun);
const moonL = new THREE.DirectionalLight(0x8aa0ff, 0); moonL.position.set(30, 50, -20); scene.add(moonL);
const camFill = new THREE.PointLight(0xffe6c8, 0, 3, 1.5); camera.add(camFill);

// ---------- ground + plants ----------
const ground = mesh(new THREE.PlaneGeometry(1200, 1200), toon(0xffffff, TX.ground), scene); ground.rotation.x = -Math.PI / 2;
const fernMat = new THREE.MeshToonMaterial({ map: FERN, gradientMap: gradMap, alphaTest: 0.5, side: THREE.DoubleSide });
const fernMat2 = new THREE.MeshToonMaterial({ map: FERN2, gradientMap: gradMap, alphaTest: 0.5, side: THREE.DoubleSide });
const frondGeo = (() => { const g = new THREE.PlaneGeometry(0.5, 1, 1, 4); g.translate(0, 0.5, 0); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setZ(i, -0.35 * y * y); } g.computeVertexNormals(); return g; })();
function fern(x, z, s = 1, mat = fernMat, n = 7) { const g = grp(scene, x, 0, z); const r0 = rnd() * 6;
  for (let i = 0; i < n; i++) { const f = mesh(frondGeo, mat, g); f.rotation.set(0, r0 + (i / n) * 6.283, 0); f.rotateX(-0.5 - rnd() * 0.3); f.scale.setScalar(s * (0.8 + rnd() * 0.4)); }
  return g; }
function cycad(x, z, h) { const g = grp(scene, x, 0, z); const bark = toon(0xffffff, TX.bark);
  const tr = cone(0.28, 0.22, h, bark, g, 10); for (let i = 0; i < 12; i++) { const f = mesh(frondGeo, i % 2 ? fernMat : fernMat2, g, 0, h, 0); f.rotation.set(0, (i / 12) * 6.283, 0); f.rotateX(-0.9 - rnd() * 0.4); f.scale.set(2.2, 3.2, 2.2); }
  return g; }
function conifer(x, z, h) { const g = grp(scene, x, 0, z); cone(0.35, 0.25, h * 0.35, toon(0xffffff, TX.bark), g, 8);
  const m = toon(0x2f5a34); for (let i = 0; i < 4; i++) { const c = mesh(new THREE.ConeGeometry(h * (0.32 - i * 0.06), h * 0.38, 9), m, g, 0, h * (0.38 + i * 0.17), 0); }
  return g; }
const clear = (x, z) => (Math.abs(x) < 3.2 && z > -34 && z < 3.5) || (x > -11 && x < 3 && z > -13 && z < 3) || (x > -2 && x < 14 && z > -45 && z < -2);
for (let i = 0; i < 520; i++) { const a = rnd() * 6.283, r = 1.2 + Math.pow(rnd(), 0.7) * 70; const x = Math.cos(a) * r, z = Math.sin(a) * r;
  if (Math.abs(x) < 1.1 && Math.abs(z) < 1.4) continue; if (x > 0.4 && x < 3.0 && z > -1.8 && z < 1.4) continue; if (x > -2.0 && x < 0.9 && z > -1.3 && z < -0.4) continue; if (x > -4.6 && x < -1.2 && z > -7.5 && z < -3.6) continue; if (x > -9 && x < 9 && z > -7.5 && z < -1.3) continue;
  fern(x, z, 0.9 + rnd() * 1.3, rnd() > 0.5 ? fernMat : fernMat2); }
for (let i = 0; i < 110; i++) { const a = rnd() * 6.283, r = 9 + rnd() * 90; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (clear(x, z)) continue;
  rnd() > 0.45 ? cycad(x, z, 2.5 + rnd() * 4) : conifer(x, z, 9 + rnd() * 14); }
// ferns right around the wake spot (frame the lying shot)
for (const [x, z, s] of [[-0.9, 0.5, 1.4], [-1.9, -0.6, 1.2], [-1.3, 1.0, 1.4], [0.2, 1.3, 1.2]]) fern(x, z, s);

// volcano + smoke
const VOLC = grp(scene, -95, 0, -175);
mesh(new THREE.CylinderGeometry(14, 95, 85, 28, 1, true), toon(0x4a3e3a), VOLC, 0, 42, 0);
mesh(new THREE.CircleGeometry(14, 24), glow(0xff7a2a), VOLC, 0, 84.6, 0).rotation.x = -Math.PI / 2;
const SMOKE = []; for (let i = 0; i < 9; i++) SMOKE.push(ell(10 + i * 3.5, 8 + i * 2.5, 10 + i * 3.5, toon(0x8a8076), VOLC, 0, 92 + i * 14, 0, 14));

// log (raptor hide) + burrow + nest
const LOG = grp(scene, -0.55, 0, -0.85); { const lm = toon(0xffffff, TX.bark); const l = mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.4, 14), lm, LOG, 0, 0.27, 0); l.rotation.z = Math.PI / 2; l.rotation.y = 0.08;
  mesh(new THREE.CircleGeometry(0.28, 14), toon(0xb08a5a), LOG, 1.2, 0.27, 0.1).rotation.y = Math.PI / 2; }
const BURROW = grp(scene, 1.5, 0, -0.6); BURROW.rotation.y = -0.7; { const m = ell(0.55, 0.22, 0.45, toon(0x7a5a36), BURROW, 0, 0, 0, 16);
  const hole = mesh(new THREE.CircleGeometry(0.16, 18), new THREE.MeshBasicMaterial({ color: 0x0a0604 }), BURROW, 0, 0.12, 0.33); hole.rotation.x = -0.6; }
const NEST = grp(scene, -2.6, 0, -4.9); { const m = mesh(new THREE.TorusGeometry(0.55, 0.22, 10, 20), toon(0x7a5a36), NEST, 0, 0.1, 0); m.rotation.x = -Math.PI / 2; m.scale.z = 0.6;
  mesh(new THREE.CircleGeometry(0.55, 18), toon(0x5a4228), NEST, 0, 0.06, 0).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 5; i++) { const a = i * 1.25; ell(0.11, 0.15, 0.11, toon(0xe8e0c8), NEST, Math.cos(a) * 0.25, 0.16, Math.sin(a) * 0.25, 12); } }

// ---------- creatures ----------
const tm = toon(0xffffff, TX.trex), dark = toon(0x1a1410), white = toon(0xf4efe0), mouthM = toon(0x6a1c1c), tongueM = toon(0xb0484a), eyeM = toon(0xf2c640);
/** T-rex head (with neck reaching back), pivot at the base of the skull; snout along +z */
function makeTrexHead() {
  const g = new THREE.Group(); scene.add(g);
  ell(0.36, 0.36, 0.5, tm, g, 0, 0.08, 0.3); const skull = mesh(taperBox(0.6, 0.5, 1.0, 0.62, 0.7, -0.04), tm, g, 0, 0.0, 0.72);
  ell(0.12, 0.07, 0.2, tm, g, 0.27, 0.32, 0.32); ell(0.12, 0.07, 0.2, tm, g, -0.27, 0.32, 0.32); // brow ridges
  for (const s of [-1, 1]) { const e = ell(0.07, 0.07, 0.07, eyeM, g, s * 0.3, 0.2, 0.36, 12); const p = ell(0.018, 0.06, 0.03, dark, g, s * 0.355, 0.2, 0.38, 8);
    ell(0.03, 0.025, 0.03, dark, g, s * 0.13, 0.12, 1.2, 8); }
  mesh(new THREE.BoxGeometry(0.44, 0.05, 0.95), mouthM, g, 0, -0.24, 0.62);
  for (const s of [-1, 1]) for (let z = 0.35; z < 1.18; z += 0.1) { const c = mesh(new THREE.ConeGeometry(0.03, 0.1, 6), white, g, s * (0.24 - (z - 0.35) * 0.07), -0.31, z); c.rotation.x = Math.PI; }
  const jaw = grp(g, 0, -0.22, 0.12);
  mesh(taperBox(0.56, 0.2, 1.1, 0.7, 0.8, 0.02), tm, jaw, 0, -0.1, 0.52);
  mesh(new THREE.BoxGeometry(0.36, 0.05, 0.8), tongueM, jaw, 0, 0.0, 0.52);
  for (const s of [-1, 1]) for (let z = 0.3; z < 1.0; z += 0.11) mesh(new THREE.ConeGeometry(0.026, 0.08, 6), white, jaw, s * (0.2 - (z - 0.3) * 0.06), 0.03, z);
  ell(0.45, 0.5, 0.75, tm, g, 0, 0.02, -0.35); ell(0.6, 0.68, 1.3, tm, g, 0, -0.05, -1.5); ell(0.75, 0.85, 1.4, tm, g, 0, -0.25, -2.7);
  g.userData.jaw = jaw; return g;
}
const HEAD = makeTrexHead();
const TREX = new THREE.Group(); scene.add(TREX);
{ ell(1.1, 1.25, 2.6, tm, TREX, 0, 3.2, 0, 24); ell(0.9, 1.0, 1.0, tm, TREX, 0, 3.4, 1.9);
  const tail = grp(TREX, 0, 3.4, -2.2); TREX.userData.tail = tail; let p = tail;
  for (let i = 0; i < 6; i++) { const s = grp(p, 0, i === 0 ? 0 : -0.1, i === 0 ? 0 : -1.05); ell(0.85 - i * 0.13, 0.9 - i * 0.14, 0.75, tm, s, 0, 0, -0.5, 14); p = s; tail.userData["s" + i] = s; }
  const legs = [];
  for (const sx of [-1, 1]) { const hip = grp(TREX, sx * 0.8, 3.0, 0.1); ell(0.5, 1.05, 0.65, tm, hip, 0, -0.55, 0.05);
    const knee = grp(hip, 0, -1.4, 0.25); const sh = cone(0.28, 0.22, 1.2, tm, knee, 10); sh.rotation.x = Math.PI - 0.35;
    const ank = grp(knee, 0, -1.15, -0.4); const ft = mesh(taperBox(0.45, 0.22, 0.75, 0.9, 0.7), tm, ank, 0, -0.35, 0.25);
    for (let k = -1; k <= 1; k++) { const cl = mesh(new THREE.ConeGeometry(0.05, 0.18, 6), dark, ank, k * 0.13, -0.38, 0.66); cl.rotation.x = Math.PI / 2; }
    legs.push({ hip, knee }); }
  TREX.userData.legs = legs;
  for (const sx of [-1, 1]) { const a = cone(0.09, 0.06, 0.55, tm, TREX, 8); a.position.set(sx * 0.65, 3.0, 2.3); a.rotation.x = 2.2; }
  ell(0.75, 0.85, 1.2, tm, TREX, 0, 4.0, 2.6); }
function raptor(c1, c2) {
  const g = new THREE.Group(); scene.add(g); const m = toon(0xffffff, TX.raptor), fe = toon(c1, null, { side: THREE.DoubleSide }), fe2 = toon(c2, null, { side: THREE.DoubleSide });
  ell(0.17, 0.2, 0.42, m, g, 0, 0.78, 0); ell(0.09, 0.09, 0.22, m, g, 0, 0.98, 0.42); const head = mesh(taperBox(0.14, 0.13, 0.32, 0.6, 0.6), m, g, 0, 1.1, 0.6);
  for (const s of [-1, 1]) { ell(0.02, 0.02, 0.02, dark, g, s * 0.06, 1.13, 0.62, 8); }
  const tail = grp(g, 0, 0.8, -0.38); ell(0.1, 0.1, 0.45, m, tail, 0, 0, -0.4); const tf = mesh(new THREE.PlaneGeometry(0.4, 0.55), fe, tail, 0, 0.02, -0.75); tf.rotation.x = -Math.PI / 2;
  for (const s of [-1, 1]) { const w = mesh(new THREE.PlaneGeometry(0.32, 0.22), s > 0 ? fe : fe2, g, s * 0.2, 0.82, 0.25); w.rotation.set(0.4, s * 1.2, 0); }
  const crest = mesh(new THREE.PlaneGeometry(0.08, 0.3), fe, g, 0, 1.05, 0.25); crest.rotation.set(-0.8, 0, 0);
  const legs = []; for (const s of [-1, 1]) { const hip = grp(g, s * 0.1, 0.72, 0.02); const l = cone(0.06, 0.03, 0.7, m, hip, 6); l.rotation.x = Math.PI; legs.push(hip); }
  g.userData.legs = legs; g.userData.tail = tail; return g;
}
const RAPTORS = [raptor(0x2d6fd0, 0xd8a03a), raptor(0xc0392b, 0x2d2d2d), raptor(0x2f9a5a, 0xd8a03a)];
function ptero() { const g = new THREE.Group(); scene.add(g); const m = toon(0x8a5a3a, null, { side: THREE.DoubleSide });
  ell(0.25, 0.25, 0.9, m, g); const h = mesh(taperBox(0.18, 0.2, 0.9, 0.2, 0.3), m, g, 0, 0.1, 1.1); const cr = mesh(taperBox(0.05, 0.4, 0.6, 1, 0.2), m, g, 0, 0.3, 0.6);
  const wg = new THREE.BufferGeometry(); wg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.5, 0, 0, -0.5, 3.6, 0, -0.2], 3)); wg.computeVertexNormals();
  const L = grp(g), R = grp(g); mesh(wg, m, R); const lw = mesh(wg, m, L); lw.scale.x = -1; g.userData.w = [L, R]; return g; }
const PTEROS = [ptero(), ptero(), ptero(), ptero()]; PTEROS.forEach((p) => p.scale.setScalar(1.6));
// mammal
const MAM = grp(scene); { const f = toon(0x7a5a3e), pk = toon(0xd88a8a);
  ell(0.07, 0.06, 0.1, f, MAM, 0, 0.06, 0); ell(0.05, 0.048, 0.055, f, MAM, 0, 0.09, 0.09); ell(0.012, 0.012, 0.012, pk, MAM, 0, 0.09, 0.145, 8);
  for (const s of [-1, 1]) { ell(0.02, 0.025, 0.008, pk, MAM, s * 0.035, 0.14, 0.075, 8); ell(0.011, 0.013, 0.011, dark, MAM, s * 0.026, 0.105, 0.128, 8); }
  const t = cone(0.012, 0.005, 0.12, pk, MAM, 6); t.position.set(0, 0.05, -0.08); t.rotation.x = -2.2; }
// hadrosaur mother + hatchling
function hadro(s = 1) { const g = new THREE.Group(); scene.add(g); const m = toon(0xffffff, TX.hadro), bill = toon(0xc9a86a);
  ell(1.0, 0.75, 2.0, m, g, 0, 0.75, 0); const neck = grp(g, 0, 1.15, 1.6); ell(0.32, 0.35, 0.8, m, neck, 0, 0.35, 0.45); const head = grp(neck, 0, 0.8, 1.0);
  ell(0.28, 0.3, 0.45, m, head); mesh(taperBox(0.34, 0.12, 0.45, 1.3, 0.8), bill, head, 0, -0.08, 0.45); for (const x of [-1, 1]) { ell(0.07, 0.07, 0.07, white, head, x * 0.24, 0.1, 0.1, 10); ell(0.04, 0.045, 0.04, dark, head, x * 0.27, 0.1, 0.13, 8); }
  const tail = grp(g, 0, 0.7, -1.8); ell(0.5, 0.4, 1.6, m, tail, 0, -0.2, -1.2);
  for (const x of [-1, 1]) { ell(0.32, 0.5, 0.6, m, g, x * 0.75, 0.35, -0.5); }
  g.scale.setScalar(s); g.userData.head = head; g.userData.neck = neck; return g; }
const MOM = hadro(1.25); const BABY = hadro(0.32);

// ---------- POV arms (children of the camera) ----------
const skin = toon(0xe8b48e), sleeve = toon(0x3a6ea5), nail = toon(0xf0c8b0);
function arm(side) {
  const g = new THREE.Group(); camera.add(g);
  const fore = cone(0.042, 0.035, 0.36, skin, g, 10); fore.rotation.x = Math.PI; fore.position.y = -0.03;
  const sl = cone(0.062, 0.058, 0.2, sleeve, g, 10); sl.rotation.x = Math.PI; sl.position.y = -0.34;
  mesh(new THREE.BoxGeometry(0.085, 0.095, 0.03), skin, g, 0, 0.045, 0);
  for (let i = 0; i < 4; i++) { const f = mesh(new THREE.CapsuleGeometry(0.0105, 0.05 - Math.abs(i - 1.5) * 0.008, 3, 8), skin, g, (i - 1.5) * 0.021 * -side, 0.12 - Math.abs(i - 1.5) * 0.006, 0.002); }
  const th = mesh(new THREE.CapsuleGeometry(0.012, 0.04, 3, 8), skin, g, 0.05 * side, 0.05, 0.012); th.rotation.z = -0.7 * side;
  return g;
}
const ARMS = { L: arm(-1), R: arm(1) };

// ---------- post (ink + grade) ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.03 }, far: { value: 900 }, res: { value: new THREE.Vector2(W, H) },
    flash: { value: 0 }, dark: { value: 0 }, vig: { value: 0.5 }, sat: { value: 1.05 }, gain: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 0 }, inkR: { value: 1.5 * W / 1080 * 1.5 }, tint: { value: new THREE.Vector3(1, 1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, flash, dark, vig, sat, seed, inkR; uniform vec2 res; uniform vec3 gain, tint;
    varying vec2 vUv;
    float lz(vec2 uv){ float d = texture2D(tD, uv).x; return -perspectiveDepthToViewZ(d, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb;
      float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 o = vec2(cos(a), sin(a)) * inkR / res;
        float dn = lz(vUv + o); e = max(e, (dn - d0) / d0); }
      float ink = smoothstep(0.06, 0.14, e) * (1.0 - smoothstep(60.0, 200.0, d0));
      c = mix(c, vec3(0.05, 0.035, 0.04), ink * 0.92);
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, sat); c *= gain * tint;
      vec2 v = vUv - 0.5; v.x *= 0.75; c *= 1.0 - vig * smoothstep(0.25, 0.75, length(v));
      c += (hash(vUv * res) - 0.5) * 0.03;
      c = mix(c, vec3(1.0, 0.97, 0.9), flash); c *= 1.0 - dark;
      gl_FragColor = vec4(c, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- frame ----------
const V = (a) => new THREE.Vector3(...a);
function placeArm(g, p) { if (!p) { g.visible = false; return; } g.visible = true; g.position.set(...p.p); g.rotation.set(...p.r); }
window.renderFrame = async (f) => {
  const t = f / FPS, st = stateAt(t);
  if (globalThis.THUMB) { const k = globalThis.THUMB; if (k.look) st.cam.look = k.look; if (k.pos) st.cam.pos = k.pos; if (k.fov) st.cam.fov = k.fov; st.cam.roll = k.roll ?? st.cam.roll; st.dark = 0; }
  // light
  const night = st.light === "night";
  if (night) { paintSky(st.sky?.[0] || "#060a1c", st.sky?.[1] || "#121a3a", st.sky?.[2] || "#1e2546"); hemi.color.setHex(0x3a4a80); hemi.groundColor.setHex(0x0a0a14); hemi.intensity = 0.95; sun.intensity = 0; moonL.intensity = 1.1;
    scene.fog = new THREE.Fog(st.fogc ?? 0x0c1028, 20, 260); stars.visible = true; post.uniforms.tint.value.set(...(st.tint || [0.75, 0.82, 1.05])); }
  else { paintSky("#7fb0dc", "#bcd6e2", "#efdcae"); hemi.color.setHex(0xd8e6ff); hemi.groundColor.setHex(0x6a5a32); hemi.intensity = 1.35; sun.intensity = 2.3; moonL.intensity = 0;
    scene.fog = new THREE.Fog(0xd9d6b8, 40, 650); stars.visible = false; post.uniforms.tint.value.set(...(st.tint || [1.0, 0.98, 0.94])); }
  scene.background = null;
  // camera
  const c = st.cam; camera.position.set(...c.pos); camera.up.set(0, 1, 0); camera.lookAt(V(c.look)); camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  camera.fov = c.fov ?? 76; camera.updateProjectionMatrix(); camFill.intensity = st.camFill ?? (night ? 0.6 : 0.4);
  sky.position.copy(camera.position); stars.position.copy(camera.position);
  // asteroid
  const a = st.ast ?? 0; AST.visible = a > 0;
  if (a > 0) { const p = camera.position.clone().add(ASTDIR.clone().multiplyScalar(480)); AST.position.copy(p);
    astGlow.scale.setScalar(10 + a * 95); astTail.visible = a > 0.3; astTail.scale.set(a * 30, a * 140, 1); astTail.position.set(-a * 40, a * 70, 0); astTail.lookAt(camera.position); astTail.rotateZ(0.5);
    astLight.position.copy(p); astLight.intensity = st.astLight ?? 0; }
  else astLight.intensity = 0;
  // volcano smoke drift
  SMOKE.forEach((s, i) => { s.position.x = Math.sin(t * 0.1 + i) * 4 + i * 3; });
  // T-rex
  const tr = st.trex; TREX.visible = !!tr;
  if (tr) { TREX.position.set(...tr.pos); TREX.rotation.set(0, tr.yaw ?? 0, 0); const ph = tr.phase ?? 0;
    TREX.userData.legs.forEach((L, i) => { const s = Math.sin(ph + i * Math.PI); L.hip.rotation.x = s * 0.45 * (tr.walk ?? 0); L.knee.rotation.x = Math.max(0, -Math.cos(ph + i * Math.PI)) * 0.5 * (tr.walk ?? 0); });
    const tail = TREX.userData.tail; for (let i = 0; i < 6; i++) tail.userData["s" + i].rotation.y = Math.sin(t * 1.6 - i * 0.6) * 0.06;
    TREX.position.y += Math.abs(Math.sin(ph)) * 0.08 * (tr.walk ?? 0); TREX.updateMatrixWorld(true); }
  const hd = st.head; HEAD.visible = !!hd || !!tr;
  if (hd) { HEAD.position.set(...hd.pos); HEAD.rotation.set(0, 0, 0); HEAD.rotateY(hd.yaw ?? 0); HEAD.rotateX(hd.pitch ?? 0); HEAD.rotateZ(hd.roll ?? 0); HEAD.userData.jaw.rotation.x = hd.jaw ?? 0; }
  else if (tr) { const p = new THREE.Vector3(0, 4.35, 3.55).applyMatrix4(TREX.matrixWorld); HEAD.position.copy(p); HEAD.rotation.set(0, 0, 0); HEAD.rotateY(tr.yaw ?? 0); HEAD.rotateX(tr.headPitch ?? 0.15); HEAD.userData.jaw.rotation.x = tr.jaw ?? 0; }
  // raptors
  RAPTORS.forEach((r, i) => { const d = st.raptors?.[i]; r.visible = !!d; if (!d) return; r.position.set(...d.pos); r.rotation.set(0, d.yaw ?? 0, 0);
    r.userData.legs.forEach((L, k) => (L.rotation.x = Math.sin(d.phase + k * Math.PI) * 0.8)); r.position.y = Math.abs(Math.sin(d.phase)) * 0.06; r.userData.tail.rotation.y = Math.sin(d.phase * 0.5) * 0.15; });
  PTEROS.forEach((p, i) => { const d = st.pteros?.[i]; p.visible = !!d; if (!d) return; p.position.set(...d.pos); p.rotation.set(0, d.yaw, d.bank ?? 0); const fl = Math.sin(d.flap) * 0.55;
    p.userData.w[0].rotation.z = -fl; p.userData.w[1].rotation.z = fl; });
  const mm = st.mammal; MAM.visible = !!mm; if (mm) { MAM.position.set(...mm.pos); MAM.rotation.set(mm.pitch ?? 0, mm.yaw ?? 0, 0); MAM.scale.setScalar(mm.scale ?? 1.5); }
  const mo = st.mom; MOM.visible = !!mo; if (mo) { MOM.position.set(...mo.pos); MOM.rotation.set(0, mo.yaw, 0); MOM.userData.neck.rotation.x = mo.neck ?? 0.4; MOM.userData.head.rotation.x = mo.head ?? 0.3; }
  const bb = st.baby; BABY.visible = !!bb; if (bb) { BABY.position.set(...bb.pos); BABY.rotation.set(0, bb.yaw, bb.roll ?? 0); BABY.userData.neck.rotation.x = bb.neck ?? -0.2; BABY.userData.head.rotation.x = bb.head ?? -0.3; }
  LOG.visible = !!st.log;
  // arms
  placeArm(ARMS.L, st.arms?.L); placeArm(ARMS.R, st.arms?.R);
  // render
  renderer.setRenderTarget(rt); renderer.render(scene, camera);
  post.uniforms.flash.value = st.flash ?? 0; post.uniforms.dark.value = st.dark ?? 0; post.uniforms.vig.value = st.vig ?? 0.5; post.uniforms.seed.value = f * 0.37;
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  og.filter = st.blur ? `blur(${st.blur * W / 1080}px)` : "none"; og.drawImage(glc, 0, 0); og.filter = "none";
  if (st.overlay) st.overlay(og, W, H, t);
  return out.toDataURL("image/jpeg", 0.93);
};
window.TOTAL = TOTAL;
window.ready = true;
