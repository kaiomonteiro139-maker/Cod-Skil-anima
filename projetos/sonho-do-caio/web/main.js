// "O Sonho do Caio" (Parte 1): toon world + canvas character cards, rendered frame by frame.
import * as THREE from "./three.module.js";
import * as P from "./paint.js";
import * as T from "./toon.js";
import { shotAt, FPS, TOTAL } from "./story.js";

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 900);

// ---------- helpers ----------
let SEED = 21; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const gradMap = (() => { const d = new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });
const TEXEL = 2.2;
function tbox(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, density = TEXEL) {
  const g = new THREE.BoxGeometry(w, h, d); const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / density, uv.getY(i) * dims[f][1] / density); }
  const m = new THREE.Mesh(g, mat); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
function plane(w, h, mat, x, y, z, rx = 0, ry = 0, parent = scene, density = TEXEL) {
  const g = new THREE.PlaneGeometry(w, h); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / density, uv.getY(i) * h / density);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); parent.add(m); return m;
}
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const canvasMat = (c, extra = {}) => new THREE.MeshToonMaterial({ map: c.isTexture ? c : P.tex(c, false), gradientMap: gradMap, ...extra });

// ---------- textures ----------
function dirtTex() { const [c, g] = cv(512, 512); g.fillStyle = "#b9814f"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) { g.globalAlpha = 0.18; g.fillStyle = rnd() > 0.5 ? "#a06a3c" : "#cf9a64"; g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 10 + rnd() * 50, 6 + rnd() * 24, rnd() * 3, 0, 7); g.fill(); }
  g.globalAlpha = 0.6; for (let i = 0; i < 300; i++) { g.fillStyle = rnd() > 0.5 ? "#8a5a34" : "#e0b07a"; g.beginPath(); g.arc(rnd() * 512, rnd() * 512, 1 + rnd() * 2.5, 0, 7); g.fill(); }
  g.globalAlpha = 1; return P.tex(c); }
function brickTex(base = "#b5653a") { const [c, g] = cv(512, 512); g.fillStyle = "#8a7a6a"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) for (let x = -64 + ((y / 32) % 2) * 32; x < 512; x += 64) { g.fillStyle = P.hex(base, 0.85 + rnd() * 0.3); g.fillRect(x + 3, y + 3, 58, 26); }
  return P.tex(c); }
function weedTex() { const [c, g] = cv(512, 512); g.fillStyle = "#6f8a3a"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "#55702c" : "#8aa048"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 10, y - 6 - rnd() * 10); g.stroke(); }
  return P.tex(c); }
const PASTEL = ["#e7c26a", "#d9785a", "#6fa8c9", "#9ac27a", "#ece6d6", "#c99ad0", "#f0a860", "#7ac0b0"];
const TX = { dirt: dirtTex(), brick: brickTex(), weed: weedTex(), concrete: P.plaster("#9a958a", { cracks: 3 }), tiles: P.tiles("#d8e2dc", "#b8c4bf"), floor: P.tiles("#8a5a3a", "#74482c"),
  plaster: PASTEL.map((c) => P.plaster(c, { cracks: 2, damp: true })), wood: P.planks("#7a5232", { n: 4 }), door: P.planks("#3a6ea5", { vertical: true, n: 4 }) };
TX.dirt.repeat.set(1, 1);

// ---------- sky ----------
const [skyC, skyG] = cv(8, 256); const skyTex = P.tex(skyC, false);
const sky = add(new THREE.SphereGeometry(700, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }));
let skyKey = ""; function paintSky(c) { const k = c.join(); if (k === skyKey) return; skyKey = k;
  const gr = skyG.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, c[0]); gr.addColorStop(0.4, c[1]); gr.addColorStop(0.5, c[2]); gr.addColorStop(1, c[2]); skyG.fillStyle = gr; skyG.fillRect(0, 0, 8, 256); skyTex.needsUpdate = true; }
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.16, "rgba(255,236,170,1)"); gr.addColorStop(0.2, "rgba(255,200,120,0.6)"); gr.addColorStop(0.55, "rgba(255,150,80,0.18)"); gr.addColorStop(1, "rgba(255,120,60,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return P.tex(c, false); })();
const SUNSPR = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, fog: false })); scene.add(SUNSPR);
const SUNDIR = new THREE.Vector3(-1, 0.16, 0.25).normalize();
const starGeo = new THREE.BufferGeometry(); { const a = []; for (let i = 0; i < 900; i++) { const th = rnd() * 6.283, ph = Math.acos(0.15 + rnd() * 0.85); a.push(Math.sin(ph) * Math.cos(th) * 600, Math.cos(ph) * 600, Math.sin(ph) * Math.sin(th) * 600); }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(a, 3)); }
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xe6ecff, size: 2, sizeAttenuation: false, fog: false })); scene.add(stars);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0xffe2c0, 0x5a3a2a, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffc890, 2.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 140 }); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.03;
scene.add(sun); scene.add(sun.target);
const lampL = new THREE.PointLight(0xffc27a, 0, 9, 1.4); scene.add(lampL);
const fillL = new THREE.PointLight(0xffe0b8, 0, 12, 1.5); scene.add(fillL);

// ---------- SET 1: campinho + favela hill (origin) ----------
const groundM = toon(0xffffff, TX.weed); TX.weed.repeat.set(1, 1);
plane(400, 400, groundM, 0, -0.01, 0, -Math.PI / 2, 0, scene, 4);
const field = plane(30, 18, toon(0xffffff, TX.dirt), 0, 0.005, 0, -Math.PI / 2, 0, scene, 9);
// hill behind the field (-z), rising
const hill = plane(220, 120, toon(0xffffff, TX.dirt), 0, 12, -70, -Math.PI / 2 + 0.42, 0, scene, 9);
const hillY = (z) => Math.max(0, (-z - 12) * Math.tan(0.42));
function shack(x, z, w, h, d, k, opts = {}) {
  const y0 = hillY(z) - 0.3, g = grp(scene, x, y0, z), m = toon(0xffffff, k < 0 ? TX.brick : TX.plaster[k % TX.plaster.length]);
  tbox(w, h, d, m, 0, 0, 0, g);
  tbox(w + 0.2, 0.18, d + 0.2, toon(0x9a958a, TX.concrete), 0, h, 0, g);
  const win = toon(0x1c1a22); const nW = Math.max(1, Math.floor(w / 2));
  for (let i = 0; i < nW; i++) { tbox(0.7, 0.8, 0.05, win, -w / 2 + (i + 0.5) * (w / nW), h * 0.45, d / 2 + 0.01, g); }
  if (opts.door) tbox(0.85, 1.9, 0.05, toon(0xffffff, TX.door), w / 2 - 0.8, 0.3, d / 2 + 0.02, g);
  if (rnd() > 0.5) { const t = add(new THREE.CylinderGeometry(0.45, 0.4, 0.75, 14), toon(0x2f74c8), -w / 4, h + 0.55, -d / 4, g); }
  if (rnd() > 0.6) for (let i = 0; i < 4; i++) tbox(0.04, 0.6, 0.04, toon(0x6a4a3a), -w / 2 + 0.2 + i * 0.3, h + 0.18, -d / 2 + 0.2, g);
  if (opts.varal || rnd() > 0.7) { const cols = [0xe5483b, 0xffffff, 0x2d6fd0, 0xf2c230, 0x2fb36a];
    for (let i = 0; i < 4; i++) { const cl = plane(0.35, 0.45, toon(cols[(i + Math.floor(x)) % 5], null, { side: THREE.DoubleSide }), -w / 2 + 0.5 + i * 0.5, h + 0.95, d / 2 - 0.3, 0, 0, g); } }
  return g;
}
let kk = 0;
for (let row = 0; row < 9; row++) { const z = -15 - row * 5.5; for (let x = -55 + (row % 2) * 3; x < 55; x += 5 + rnd() * 3) { const w = 3.5 + rnd() * 2.5, h = 2.6 + rnd() * 3.2;
  shack(x, z, w, h, 4, rnd() > 0.82 ? -1 : kk++, { door: rnd() > 0.5 }); } }
// side rows of houses around the field (left/right)
for (let z = -8; z < 14; z += 5.5) { shack(-21 - rnd() * 2, z, 4.5, 3 + rnd() * 2.5, 4.5, kk++); shack(21 + rnd() * 2, z, 4.5, 3 + rnd() * 2.5, 4.5, rnd() > 0.7 ? -1 : kk++); }
// low brick wall behind the far touchline
for (let x = -15; x < 15; x += 3) tbox(3, 1.1, 0.25, toon(0xffffff, TX.brick), x + 1.5, 0, -9.6);
// utility poles + sagging wires
const wireM = new THREE.LineBasicMaterial({ color: 0x1a1418 });
const POLES = [[-16, -11], [-4, -11], [8, -11], [17, -11]];
for (const [x, z] of POLES) { add(new THREE.CylinderGeometry(0.1, 0.13, 8, 8), toon(0x7a7a72), x, 4, z); tbox(1.6, 0.1, 0.1, toon(0x5a5a54), x, 7.4, z); }
for (let i = 0; i < POLES.length - 1; i++) for (const dy of [7.5, 7.0, 6.6]) { const pts = []; const [x0, z0] = POLES[i], [x1, z1] = POLES[i + 1];
  for (let k = 0; k <= 16; k++) { const u = k / 16; pts.push(new THREE.Vector3(x0 + (x1 - x0) * u, dy - Math.sin(u * Math.PI) * 0.7, z0 + (z1 - z0) * u)); }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM)); }
// kites
const KITES = []; for (let i = 0; i < 5; i++) { const g = grp(scene, -20 + i * 11, 18 + rnd() * 8, -25 - rnd() * 15);
  const kc = document.createElement("canvas"); kc.width = kc.height = 128; const kg = kc.getContext("2d"); const cols = ["#e5483b", "#f2c230", "#2d6fd0", "#2fb36a", "#c94fd0"];
  kg.fillStyle = cols[i]; kg.beginPath(); kg.moveTo(64, 0); kg.lineTo(128, 52); kg.lineTo(64, 128); kg.lineTo(0, 52); kg.fill(); kg.fillStyle = "#ffffff"; kg.beginPath(); kg.moveTo(64, 0); kg.lineTo(64, 128); kg.lineTo(0, 52); kg.fill();
  add(new THREE.PlaneGeometry(1.4, 1.6), new THREE.MeshBasicMaterial({ map: P.tex(kc, false), transparent: true, side: THREE.DoubleSide, fog: false }), 0, 0, 0, g);
  const tl = []; for (let k = 0; k < 8; k++) tl.push(new THREE.Vector3(Math.sin(k) * 0.2, -0.8 - k * 0.35, 0)); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tl), new THREE.LineBasicMaterial({ color: cols[i] })));
  KITES.push(g); }
// flip-flop goals (chinelos) at both ends
function chinelo(x, z, ry, col) { const g = grp(scene, x, 0, z); g.rotation.y = ry;
  const sole = add(new THREE.CylinderGeometry(0.06, 0.06, 0.025, 14), toon(col), 0, 0.012, 0, g); sole.scale.set(1, 1, 2.3);
  const st = add(new THREE.TorusGeometry(0.05, 0.008, 6, 14, Math.PI), toon(0xffffff), 0, 0.025, 0.02, g); st.rotation.y = Math.PI / 2; return g; }
for (const ex of [-13.2, 13.2]) for (const s of [-1, 1]) { chinelo(ex, s * 0.62, 0.2, 0x2d6fd0); chinelo(ex + 0.1, s * 0.62 + 0.16, -0.15, 0x2d6fd0); }
// the torn cleat on a rock at the touchline
const CLEAT = grp(scene, -6.0, 0, 8.3); CLEAT.rotation.y = 0.6;
{ const rk = add(new THREE.IcosahedronGeometry(0.35, 1), toon(0x8a8478), 0, 0.12, 0, CLEAT); rk.scale.set(1.3, 0.6, 1);
  const sh = grp(CLEAT, 0, 0.3, 0); sh.scale.setScalar(1.6); const upper = toon(0xf2f2f2), sole = toon(0x2a2a30);
  const b = add(new THREE.SphereGeometry(0.1, 16, 10), upper, 0, 0.06, 0.02, sh); b.scale.set(0.9, 0.75, 2.0);
  tbox(0.17, 0.03, 0.38, sole, 0, -0.03, 0.02, sh);
  for (const [sx, sz] of [[-0.05, -0.12], [0.05, -0.12], [-0.05, 0.12], [0.05, 0.12], [0, 0.0]]) add(new THREE.CylinderGeometry(0.014, 0.01, 0.03, 6), sole, sx, -0.045, sz, sh);
  add(new THREE.CircleGeometry(0.045, 12), glow(0x0a0a0a), 0.09, 0.07, 0.08, sh).rotation.y = Math.PI / 2; // the hole
  const flap = tbox(0.16, 0.012, 0.12, sole, 0, -0.06, 0.24, sh); flap.rotation.x = 0.5; // sole coming off
  add(new THREE.TorusGeometry(0.035, 0.006, 6, 12), toon(0xf2f2f2), 0, 0.12, -0.05, sh); // laces
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const st = tbox(0.006, 0.08, 0.018, toon(0xe5483b), s * 0.09, 0.0, -0.06 + k * 0.05, sh); st.rotation.x = 0.4; } }
// the ball
function ballTex() { const [c, g] = cv(512, 256); g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#1c1a20";
  for (let i = 0; i < 12; i++) { const x = (i % 6) * 86 + (i < 6 ? 0 : 43), y = i < 6 ? 70 : 186; g.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 - 1.57; g.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26); } g.fill(); }
  return P.tex(c, false); }
const BALL = add(new THREE.SphereGeometry(0.11, 24, 16), toon(0xffffff, ballTex()));
// sideline: a plastic chair and a crate for the scout scene
tbox(0.5, 0.45, 0.4, toon(0x2f74c8), 9, 0, 10.6);

// ---------- SET 2: favela alley with stairs (x = 200) ----------
const AX = 200;
{ for (let i = 0; i < 16; i++) { tbox(2.2, 0.18 * (i + 1), 0.35, toon(0xffffff, TX.concrete), AX, 0, 6 - i * 0.35); }
  tbox(2.2, 2.9, 6, toon(0xffffff, TX.concrete), AX, 0, -3.6 - 3);
  for (let i = 0; i < 6; i++) { const z = 5 - i * 2.2, y0 = Math.max(0, (6 - z) / 0.35 * 0.18 - 0.4);
    tbox(0.25, 4 + i * 0.5, 2.2, toon(0xffffff, TX.plaster[(i + 2) % 8]), AX - 1.25, y0 - 1, z);
    tbox(0.25, 4.2 + i * 0.4, 2.2, toon(0xffffff, i % 3 === 0 ? TX.brick : TX.plaster[(i + 5) % 8]), AX + 1.25, y0 - 1, z);
    tbox(0.05, 0.7, 0.7, toon(0x1c1a22), AX - 1.11, y0 + 1.2, z, scene); }
  for (let k = 0; k < 4; k++) { const pts = []; for (let j = 0; j <= 12; j++) { const u = j / 12; pts.push(new THREE.Vector3(AX - 1.2 + 2.4 * u, 5.5 + k * 0.4 - Math.sin(u * Math.PI) * 0.4, 3 - k * 2.5)); } scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireM)); } }
const ADOOR_Z = -0.2, ATOP = 16 * 0.18; // the landing at the top
const HOUSEDOOR = grp(scene, AX + 1.13, ATOP, -1.5); { tbox(0.06, 2.0, 0.9, toon(0xffffff, TX.door), 0, 0, 0, HOUSEDOOR, 1.2);
  const n = add(new THREE.PlaneGeometry(0.3, 0.2), canvasMat(P.signText(["17"], { w: 256, h: 170, size: 120, bg: "#f2f2f2", fg: "#2d6fd0" })), -0.04, 2.15, 0, HOUSEDOOR); n.rotation.y = -Math.PI / 2; }

// ---------- SET 3: house interior (x = 300): kitchen + bed corner ----------
const IX = 300;
let CUP, POT, WALLET, WFLAP, NOTE, COINS;
{ const R = grp(scene); const wallM = toon(0xffffff, TX.plaster[4]);
  plane(7, 6, toon(0xffffff, TX.floor), IX, 0.001, 0, -Math.PI / 2, 0, R, 1.6);
  tbox(7, 2.7, 0.15, wallM, IX, 0, -3, R); tbox(0.15, 2.7, 6, wallM, IX - 3.5, 0, 0, R); tbox(0.15, 2.7, 6, wallM, IX + 3.5, 0, 0, R);
  plane(7, 6, toon(0xd8d0c0), IX, 2.7, 0, Math.PI / 2, 0, R);
  plane(3, 1.1, toon(0xffffff, TX.tiles), IX + 1.5, 1.35, -2.92, 0, 0, R, 1.0);
  // cupboard (open, almost empty)
  CUP = grp(R, IX + 2.3, 1.45, -2.75); tbox(1.1, 0.75, 0.4, toon(0xf2efe6), 0, 0, 0, CUP); tbox(1.0, 0.02, 0.36, toon(0xe0dbd0), 0, 0.37, 0.02, CUP);
  tbox(0.2, 0.28, 0.12, toon(0xf2f2f2), -0.3, 0.02, 0.08, CUP); add(new THREE.PlaneGeometry(0.18, 0.1), canvasMat(P.signText(["ARROZ"], { w: 256, h: 140, size: 70, bg: "#ffffff", fg: "#c0392b" })), -0.3, 0.17, 0.141, CUP);
  add(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), toon(0xb0b4bc), 0.25, 0.08, 0.05, CUP);
  for (const s of [-1, 1]) { const d = tbox(0.53, 0.72, 0.03, toon(0xe8e2d4), 0, 0, 0, grp(CUP, s * 0.55, 0.02, 0.2)); d.position.x = s * 0.265; d.parent.rotation.y = s * -1.9; }
  // stove + pot
  tbox(0.6, 0.85, 0.55, toon(0xf2f2f2), IX + 0.7, 0, -2.65, R); POT = add(new THREE.CylinderGeometry(0.17, 0.15, 0.17, 16), toon(0x9aa0a8), IX + 0.6, 0.94, -2.6, R);
  // fridge
  tbox(0.7, 1.7, 0.65, toon(0xe8ecee), IX + 3.0, 0, -2.6, R);
  // table + chairs (plastic tablecloth)
  const tc = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#e5483b"; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2) g.fillRect(x * 32, y * 32, 32, 32); return P.tex(c); })();
  tbox(1.2, 0.05, 0.8, toon(0xffffff, tc), IX + 1.3, 0.74, -0.6, R, 0.6); for (const [dx, dz] of [[-0.55, -0.35], [0.55, -0.35], [-0.55, 0.35], [0.55, 0.35]]) tbox(0.05, 0.74, 0.05, toon(0x8a8a8a), IX + 1.3 + dx, 0, -0.6 + dz, R);
  // wallet on the table
  WALLET = grp(R, IX + 1.3, 0.79, -0.45);
  tbox(0.2, 0.012, 0.1, toon(0x5a3a24), 0, 0, 0, WALLET); WFLAP = grp(WALLET, 0, 0.012, -0.05); tbox(0.2, 0.012, 0.1, toon(0x6a4630), 0, 0, 0.05, WFLAP);
  const nc = (() => { const [c, g] = cv(256, 128); g.fillStyle = "#c9a0d0"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#7a4a8a"; g.fillRect(8, 8, 240, 112); g.fillStyle = "#e8d0ee"; g.fillRect(16, 16, 224, 96);
    g.fillStyle = "#5a2a6a"; g.font = "900 64px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("10", 186, 66); g.font = "700 22px 'DejaVu Sans'"; g.fillText("REAIS", 70, 66); return P.tex(c, false); })();
  NOTE = add(new THREE.PlaneGeometry(0.15, 0.075), new THREE.MeshToonMaterial({ map: nc, gradientMap: gradMap }), 0, 0.02, 0.0, WALLET); NOTE.rotation.x = -Math.PI / 2;
  COINS = grp(WALLET, 0.055, 0.016, 0.02); for (const [cx, cz] of [[0, 0], [0.035, 0.012]]) { const co = add(new THREE.CylinderGeometry(0.0135, 0.0135, 0.003, 18), toon(0xd8b850), cx, 0.003, cz, COINS); }
  // window over the bed (night favela outside)
  const wc = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#0b1230"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70; i++) { g.fillStyle = rnd() > 0.5 ? "#ffd27a" : "#ffb04a"; g.fillRect(rnd() * 256, 120 + rnd() * 136, 4, 5); }
    for (let i = 0; i < 40; i++) { g.fillStyle = "#ffffff"; g.fillRect(rnd() * 256, rnd() * 110, 2, 2); } return P.tex(c, false); })();
  plane(1.0, 0.9, new THREE.MeshBasicMaterial({ map: wc }), IX - 2.0, 1.65, -2.92, 0, 0, R); tbox(1.1, 0.06, 0.1, toon(0xffffff), IX - 2.0, 1.17, -2.88, R);
  // mattress on the floor + poster
  tbox(1.9, 0.2, 0.9, toon(0x6a8ac0), IX - 2.3, 0, -1.6, R); tbox(0.5, 0.12, 0.7, toon(0xf2f2f2), IX - 3.0, 0.2, -1.6, R);
  const pc = (() => { const [c, g] = cv(256, 360); g.fillStyle = "#2fb36a"; g.fillRect(0, 0, 256, 360); g.fillStyle = "#f2c230"; g.beginPath(); g.ellipse(128, 120, 46, 50, 0, 0, 7); g.fill();
    g.fillStyle = "#f2c230"; g.fillRect(70, 170, 116, 130); g.fillStyle = "#2d6fd0"; g.font = "900 90px 'DejaVu Sans'"; g.textAlign = "center"; g.fillText("10", 128, 270);
    g.fillStyle = "#ffffff"; g.font = "900 34px 'DejaVu Sans'"; g.fillText("CRAQUE", 128, 340); return P.tex(c, false); })();
  const poster = plane(0.6, 0.84, new THREE.MeshToonMaterial({ map: pc, gradientMap: gradMap }), IX - 3.42, 1.55, -1.5, 0, Math.PI / 2, R); }
const BALLIN = add(new THREE.SphereGeometry(0.11, 24, 16), toon(0xffffff, BALL.material.map));

// ---------- SET 4: bus station (x = 400) ----------
const BX = 400;
{ tbox(14, 4, 0.3, toon(0xffffff, TX.plaster[4]), BX, 0, -3); plane(16, 12, toon(0xffffff, TX.concrete), BX, 0.002, 0, -Math.PI / 2, 0, scene, 3);
  const sg = add(new THREE.PlaneGeometry(4.2, 0.8), canvasMat(P.signText(["RODOVIÁRIA"], { w: 1024, h: 200, size: 120, bg: "#1f4a8a", fg: "#ffffff" })), BX, 3.4, -2.82);
  tbox(3.0, 2.2, 0.5, toon(0x2f74c8), BX - 2.2, 0, -2.6); tbox(2.6, 0.9, 0.1, glow(0x1a1a24), BX - 2.2, 1.0, -2.34);
  const bc = (() => { const [c, g] = cv(768, 1024); g.fillStyle = "#14161c"; g.fillRect(0, 0, 768, 1024); g.fillStyle = "#f2c230"; g.font = "900 64px 'DejaVu Sans'"; g.textAlign = "center";
    g.fillText("PASSAGENS", 384, 90); g.fillStyle = "#3a3f48"; g.fillRect(40, 120, 688, 6);
    const rows = [["CAMPINAS", "R$ 240"], ["SÃO PAULO", "R$ 300"], ["SANTOS", "R$ 320"]];
    rows.forEach(([d, p], i) => { const y = 250 + i * 270, hi = d === "SÃO PAULO"; if (hi) { g.fillStyle = "#e5483b"; g.fillRect(24, y - 90, 720, 240); }
      g.fillStyle = hi ? "#ffffff" : "#c9ced6"; g.font = `900 ${hi ? 80 : 62}px 'DejaVu Sans'`; g.fillText(d, 384, y); g.font = `900 ${hi ? 110 : 70}px 'DejaVu Sans'`; g.fillStyle = hi ? "#ffd23f" : "#e6e9ee"; g.fillText(p, 384, y + (hi ? 115 : 85)); });
    return P.tex(c, false); })();
  add(new THREE.PlaneGeometry(1.5, 2.0), new THREE.MeshBasicMaterial({ map: bc }), BX + 2.2, 1.9, -2.83);
  // bus
  const bus = grp(scene, BX - 1, 0, 3.2); tbox(10, 2.9, 2.5, toon(0xf2f2f2), 0, 0.45, 0, bus); tbox(10.02, 0.3, 2.52, toon(0x2d6fd0), 0, 1.2, 0, bus);
  for (let i = 0; i < 8; i++) tbox(1.05, 0.9, 2.54, toon(0x1a2230), -4.2 + i * 1.2, 1.9, 0, bus);
  for (const x of [-3.2, 3.2]) for (const s of [-1, 1]) { const w = add(new THREE.CylinderGeometry(0.48, 0.48, 0.3, 18), toon(0x1a1a1a), x, 0.48, s * 1.2, bus); w.rotation.x = Math.PI / 2; }
  const dc = add(new THREE.PlaneGeometry(1.8, 0.35), canvasMat(P.signText(["SÃO PAULO"], { w: 1024, h: 200, size: 120, bg: "#14161c", fg: "#ffb030" })), -5.01, 3.0, 0, bus); dc.rotation.y = -Math.PI / 2; }

// bucket (mother) + rooftop slab for the last scene
const BUCKET = grp(scene); { add(new THREE.CylinderGeometry(0.15, 0.12, 0.26, 16, 1, true), toon(0x2f9ac8, null, { side: THREE.DoubleSide }), 0, 0.13, 0, BUCKET);
  const hd = add(new THREE.TorusGeometry(0.14, 0.008, 6, 16, Math.PI), toon(0x444444), 0, 0.26, 0, BUCKET); add(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 6), toon(0xe5c040), 0.05, 0.5, 0, BUCKET).rotation.z = 0.15; }
const LAJE = grp(scene, -18, 0, 12); { tbox(5, 3.2, 5, toon(0xffffff, TX.brick), 0, 0, 0, LAJE); tbox(5.3, 0.18, 5.3, toon(0xffffff, TX.concrete), 0, 3.2, 0, LAJE);
  add(new THREE.CylinderGeometry(0.5, 0.45, 0.8, 16), toon(0x2f74c8), -1.4, 3.8, -1.4, LAJE); for (let i = 0; i < 5; i++) tbox(0.04, 0.7, 0.04, toon(0x6a4a3a), 1.9, 3.38, -2 + i * 0.4, LAJE); }
// shadows for everything built so far
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } });
sky.castShadow = false;

// ---------- character cards ----------
const SU = 0.0022;
class Card {
  constructor(cw = 600, ch = 1000, su = SU) {
    this.c = document.createElement("canvas"); this.c.width = cw * 2; this.c.height = ch * 2; this.g = this.c.getContext("2d");
    this.tex = P.tex(this.c, false);
    const geo = new THREE.PlaneGeometry(cw * su, ch * su); geo.translate(0, ch * su / 2 - (ch - 975) * su * (ch === 1000 ? 1 : 0), 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: ch === 1000, alphaTest: ch === 1000 ? 0.4 : 0.02, fog: false });
    this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.renderOrder = 2; scene.add(this.mesh); this.key = "";
    if (ch === 1000) { this.mesh.castShadow = true; this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.tex, alphaTest: 0.5 }); }
    const bc = document.createElement("canvas"); bc.width = bc.height = 64; const bg = bc.getContext("2d"); const gr = bg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(0,0,0,0.45)"); gr.addColorStop(1, "rgba(0,0,0,0)"); bg.fillStyle = gr; bg.fillRect(0, 0, 64, 64);
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.45), new THREE.MeshBasicMaterial({ map: P.tex(bc, false), transparent: true, depthWrite: false }));
    this.blob.rotation.x = -Math.PI / 2; scene.add(this.blob);
  }
  draw(key, fn) { if (key === this.key) return; this.key = key; const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.c.width, this.c.height); g.setTransform(2, 0, 0, 2, 0, 0); fn(new T.Pen(g), g); this.tex.needsUpdate = true; }
  place(x, y, z, cam, o = {}) {
    this.mesh.visible = true; this.mesh.position.set(x, y, z); this.mesh.rotation.set(0, Math.atan2(cam.x - x, cam.z - z), o.roll || 0);
    const s = o.scale ?? 1; this.mesh.scale.set(s * (o.flip ? -1 : 1), s, 1); this.mat.color.setRGB(...(o.tint || [1, 1, 1]));
    this.blob.visible = o.blob !== false; this.blob.position.set(x, (o.floor ?? y) + 0.02, z);
  }
  hide() { this.mesh.visible = false; this.blob.visible = false; }
}
const OUT = {
  caio: { jacket: "#f2c230", pants: "#2f8a4a", boots: "#7a4a2a", hat: "hair", hair: "#17100c", skin: "#9a5e38", build: "kid", buttons: "#2f8a4a" },
  mae: { jacket: "#4f9ab8", dress: "#4f9ab8", pants: "#3a3a48", boots: "#e8e0d0", hat: "longhair", hair: "#17100c", skin: "#8a5534" },
  olheiro: { jacket: "#1f2f5a", pants: "#2a2a30", boots: "#f2f2f2", hat: "cap", cap: "#d8333a", skin: "#e8b48e", build: "stout", buttons: "#f2c230" },
  k1: { jacket: "#e5483b", pants: "#2a2a3a", boots: "#6a4228", hat: "hair", hair: "#2a1a10", skin: "#c99067", build: "kid" },
  k2: { jacket: "#ffffff", pants: "#3b5b9a", boots: "#a86b45", hat: "cap", cap: "#2fb36a", skin: "#e8c0a0", build: "kid" },
  k3: { jacket: "#2d6fd0", pants: "#1f1f24", boots: "#5a3a24", hat: "hair", hair: "#5a3b2a", skin: "#7a4a2a", build: "kid" },
};
const cardPool = {};
const fxCards = []; for (let i = 0; i < 6; i++) { const c = new Card(512, 512, 0.002); c.blob.visible = false; fxCards.push(c); }
const qz = (v, s = 0.05) => Math.round(v / s) * s;
const actorKey = (o) => JSON.stringify(o, (k, v) => typeof v === "number" ? qz(v, 0.02) : v);
const FX_DRAW = {
  tears: (p, g, t) => { g.lineCap = "round"; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const ph = (t * 1.6 + k / 3) % 1;
      g.globalAlpha = 1 - ph; g.fillStyle = "#8fd0ff"; g.strokeStyle = "#241726"; g.lineWidth = 6; g.beginPath(); g.ellipse(256 + s * (70 + ph * 40), 200 + ph * 200, 14, 20, 0, 0, 7); g.fill(); g.stroke(); } g.globalAlpha = 1; },
  stars: (p, g, t) => T.fxStars(p, t),
  burst: (p, g, t) => T.fxBurst(p, t, "#fff3b0"),
  puff: (p, g, t) => T.fxPuff(p, t),
  speed: (p, g, t) => { g.strokeStyle = "#ffffff"; g.lineCap = "round"; for (let i = 0; i < 6; i++) { const y = 80 + i * 70, o = ((t * 900 + i * 97) % 300); g.globalAlpha = 0.8; g.lineWidth = 10; g.beginPath(); g.moveTo(40 + o, y); g.lineTo(200 + o, y); g.stroke(); } g.globalAlpha = 1; },
  shout: (p, g, t) => { const s = 1 + 0.08 * Math.sin(t * 30); g.translate(256, 256); g.scale(s, s); g.rotate(-0.12); g.font = "900 120px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = 22; g.strokeStyle = "#241726"; g.strokeText("MÃE!!", 0, 0); g.fillStyle = "#ffd23f"; g.fillText("MÃE!!", 0, 0); },
  heart: (p, g, t) => { const s = 0.8 + 0.2 * Math.sin(t * 8); g.translate(256, 256); g.scale(s, s); g.fillStyle = "#e5483b"; g.strokeStyle = "#241726"; g.lineWidth = 16;
    g.beginPath(); g.moveTo(0, 120); g.bezierCurveTo(-200, -20, -110, -170, 0, -60); g.bezierCurveTo(110, -170, 200, -20, 0, 120); g.fill(); g.stroke(); },
  ques: (p, g, t) => { g.translate(256, 256); g.font = "900 300px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round"; g.lineWidth = 30; g.strokeStyle = "#241726"; g.strokeText("?", 0, 10); g.fillStyle = "#ffffff"; g.fillText("?", 0, 10); },
};
// the invitation paper (held / close-up)
const PAPER = grp(scene); { const pc = (() => { const [c, g] = cv(512, 680); g.fillStyle = "#fbf8ef"; g.fillRect(0, 0, 512, 680);
    g.fillStyle = "#1f2f5a"; g.beginPath(); g.moveTo(256, 40); g.lineTo(340, 70); g.lineTo(330, 170); g.lineTo(256, 215); g.lineTo(182, 170); g.lineTo(172, 70); g.closePath(); g.fill();
    g.fillStyle = "#d8333a"; g.fillRect(200, 100, 112, 26); g.fillStyle = "#ffffff"; g.font = "900 40px 'DejaVu Sans'"; g.textAlign = "center"; g.fillText("★", 256, 175);
    g.fillStyle = "#1f2f5a"; g.font = "900 70px 'DejaVu Sans'"; g.fillText("TESTE", 256, 320); g.font = "800 46px 'DejaVu Sans'"; g.fillStyle = "#14161c"; g.fillText("SÁBADO • 9H", 256, 410);
    g.fillStyle = "#d8333a"; g.font = "900 56px 'DejaVu Sans'"; g.fillText("SÃO PAULO", 256, 490); g.fillStyle = "#6b7280"; g.font = "600 28px 'DejaVu Sans'"; g.fillText("Categoria Sub-17", 256, 560);
    g.strokeStyle = "#14161c"; g.lineWidth = 3; g.beginPath(); g.moveTo(140, 630); g.quadraticCurveTo(220, 600, 260, 630); g.quadraticCurveTo(300, 655, 380, 615); g.stroke(); return P.tex(c, false); })();
  add(new THREE.PlaneGeometry(0.21, 0.28), new THREE.MeshToonMaterial({ map: pc, gradientMap: gradMap, side: THREE.DoubleSide }), 0, 0, 0, PAPER); }

// ---------- post (ink + grade) ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 900 }, res: { value: new THREE.Vector2(W, H) },
    flash: { value: 0 }, dark: { value: 0 }, vig: { value: 0.45 }, sat: { value: 1.1 }, gain: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 0 }, inkR: { value: 1.5 * W / 1080 * 1.5 }, bloom: { value: 0.0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, flash, dark, vig, sat, seed, inkR, bloom; uniform vec2 res; uniform vec3 gain;
    varying vec2 vUv;
    float lz(vec2 uv){ float d = texture2D(tD, uv).x; return -perspectiveDepthToViewZ(d, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb;
      float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 o = vec2(cos(a), sin(a)) * inkR / res; float dn = lz(vUv + o); e = max(e, (dn - d0) / d0); }
      float ink = smoothstep(0.06, 0.13, e) * (1.0 - smoothstep(50.0, 160.0, d0));
      c = mix(c, vec3(0.08, 0.05, 0.06), ink * 0.9);
      // soft glow of bright areas (golden hour haze)
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 14.0 / res; vec3 s = texture2D(tC, vUv + o).rgb; bl += max(s - 0.75, 0.0); }
      c += bl / 12.0 * bloom;
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, sat); c *= gain;
      vec2 v = vUv - 0.5; v.x *= 0.75; c *= 1.0 - vig * smoothstep(0.25, 0.78, length(v));
      c += (hash(vUv * res) - 0.5) * 0.025;
      c = mix(c, vec3(1.0, 0.97, 0.9), flash); c *= 1.0 - dark;
      gl_FragColor = vec4(c, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- light presets ----------
const LIGHT = {
  golden: { sky: ["#3d6fa8", "#f2b27a", "#ffd9a0"], hemi: [0xffe2c0, 0x6a4a30, 1.15], sun: 2.8, sunC: 0xffbf80, fog: [0xf0c898, 40, 260], tint: [1, 0.96, 0.9], sat: 1.12, gain: [1.06, 1.0, 0.92], bloom: 0.9, stars: false, sunVis: true },
  dusk: { sky: ["#2a2c5a", "#c06a6a", "#f2a070"], hemi: [0xd0a8c0, 0x3a2a30, 0.95], sun: 1.3, sunC: 0xff9070, fog: [0xc08080, 30, 200], tint: [0.98, 0.88, 0.9], sat: 1.05, gain: [1.04, 0.96, 0.98], bloom: 0.6, stars: false, sunVis: true },
  night: { sky: ["#05081a", "#101a3a", "#1a2448"], hemi: [0x3a4a80, 0x0a0a14, 0.55], sun: 0, sunC: 0x8aa0ff, fog: [0x0a0e20, 20, 120], tint: [0.75, 0.82, 1.0], sat: 1.0, gain: [0.95, 1.0, 1.08], bloom: 0.3, stars: true, sunVis: false },
  inside: { sky: ["#1a1a2a", "#1a1a2a", "#1a1a2a"], hemi: [0xffe0c0, 0x3a2a20, 0.8], sun: 0, sunC: 0xffffff, fog: null, tint: [1, 0.92, 0.84], sat: 1.0, gain: [1.04, 0.98, 0.92], bloom: 0.4, stars: false, sunVis: false },
  insideNight: { sky: ["#05081a", "#05081a", "#05081a"], hemi: [0x5a6aa0, 0x1a1420, 0.55], sun: 0, sunC: 0xffffff, fog: null, tint: [0.82, 0.86, 1.0], sat: 0.95, gain: [0.95, 0.98, 1.08], bloom: 0.3, stars: false, sunVis: false },
  station: { sky: ["#3a3a6a", "#d08a6a", "#f2b080"], hemi: [0xf0d0c0, 0x4a3a30, 1.0], sun: 1.6, sunC: 0xffb080, fog: [0xd0a090, 30, 200], tint: [1, 0.95, 0.92], sat: 1.05, gain: [1.03, 0.98, 0.95], bloom: 0.5, stars: false, sunVis: false },
};

// ---------- frame ----------
const V = (a) => new THREE.Vector3(...a);
window.renderFrame = async (f) => {
  const t = f / FPS, S = shotAt(t), st = S.fn(t, t - S.t0, S);
  const L = LIGHT[st.light || "golden"];
  paintSky(L.sky); hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2] * (st.hemiK ?? 1);
  sun.intensity = (st.sunI ?? L.sun); sun.color.setHex(L.sunC); stars.visible = L.stars;
  scene.fog = L.fog ? new THREE.Fog(L.fog[0], L.fog[1], L.fog[2]) : null;
  const c = st.cam; camera.position.set(...c.pos); camera.lookAt(V(c.look)); camera.fov = c.fov ?? 40; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  sky.position.copy(camera.position); stars.position.copy(camera.position);
  // sun follows the active set so shadows land where we look
  const focus = st.focus ? V(st.focus) : V(c.look);
  sun.target.position.copy(focus); sun.position.copy(focus).add(SUNDIR.clone().multiplyScalar(60)); sun.target.updateMatrixWorld();
  SUNSPR.visible = L.sunVis && st.sunVis !== false; SUNSPR.position.copy(camera.position).add(SUNDIR.clone().multiplyScalar(600)); SUNSPR.scale.setScalar(st.sunSize ?? 150);
  lampL.intensity = st.lamp ?? 0; if (st.lampPos) lampL.position.set(...st.lampPos);
  fillL.intensity = st.fill ?? 0; if (st.fillPos) fillL.position.set(...st.fillPos);
  KITES.forEach((k, i) => { k.position.y += 0; k.rotation.z = Math.sin(t * 1.3 + i) * 0.25; k.rotation.y = Math.sin(t * 0.7 + i) * 0.3; });
  // props
  BALL.visible = !!st.ball; if (st.ball) { BALL.position.set(...st.ball.pos); BALL.scale.set(1, st.ball.squash ?? 1, 1); BALL.rotation.set(st.ball.spin ?? 0, 0, (st.ball.spin ?? 0) * 0.6); BALL.position.y += 0.11 * ((st.ball.squash ?? 1) - 1); }
  BALLIN.visible = !!st.ballIn; if (st.ballIn) BALLIN.position.set(...st.ballIn);
  PAPER.visible = !!st.paper; if (st.paper) { PAPER.position.set(...st.paper.pos); if (st.paper.face) PAPER.lookAt(camera.position); else PAPER.rotation.set(...(st.paper.rot || [0, 0, 0])); PAPER.rotateZ(st.paper.roll ?? 0); }
  WFLAP.rotation.x = -(st.wallet ?? 0) * 2.6; NOTE.visible = (st.wallet ?? 0) > 0.5; COINS.visible = (st.wallet ?? 0) > 0.5;
  HOUSEDOOR.rotation.y = -(st.door ?? 0) * 1.4;
  BUCKET.visible = !!st.bucket; if (st.bucket) BUCKET.position.set(...st.bucket);
  // actors
  const used = new Set();
  for (const a of st.actors || []) {
    const id = a.key || a.id; used.add(id);
    const C = cardPool[id] || (cardPool[id] = new Card());
    const o = OUT[a.id];
    C.draw((a.side ? "S" : "F") + actorKey(a.opts), (p) => (a.side ? T.bodySide : T.bodyFront)(p, o, a.opts));
    C.place(a.pos[0], a.pos[1], a.pos[2], camera.position, { tint: a.tint || L.tint, scale: a.scale ?? (o.build === "kid" ? 1.05 : 1), flip: a.flip, roll: a.roll, blob: a.blob, floor: a.floor });
  }
  for (const k in cardPool) if (!used.has(k)) cardPool[k].hide();
  fxCards.forEach((cc) => cc.hide());
  (st.fx || []).forEach((e, i) => { const C = fxCards[i];
    C.draw(e.type + qz(e.t, 0.034), (p, g) => FX_DRAW[e.type](p, g, e.t));
    C.place(e.pos[0], e.pos[1], e.pos[2], camera.position, { scale: e.scale ?? 1, blob: false, roll: e.roll || 0 }); C.mesh.material.opacity = e.alpha ?? 1; });
  // render
  renderer.setRenderTarget(rt); renderer.render(scene, camera);
  post.uniforms.flash.value = st.flash ?? 0; post.uniforms.dark.value = st.dark ?? 0; post.uniforms.vig.value = st.vig ?? 0.45; post.uniforms.seed.value = f * 0.37;
  post.uniforms.sat.value = L.sat * (st.satK ?? 1); post.uniforms.gain.value.set(...L.gain); post.uniforms.bloom.value = L.bloom;
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  og.drawImage(glc, 0, 0);
  if (st.overlay) st.overlay(og, W, H, t);
  return out.toDataURL("image/jpeg", 0.93);
};
window.TOTAL = TOTAL;
window.ready = true;
