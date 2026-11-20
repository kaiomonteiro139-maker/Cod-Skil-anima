// Illustrated-story sample: a bedroom at 3 a.m., hand-drawn look (thick brown ink, painted textures, warm/cool light, falling specks).
import * as THREE from "./three.module.js";
import * as P from "./paint.js";
import * as T from "./toon.js";
import { stateAt, FPS, TOTAL } from "./story.js";

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 960), H = +(q.get("h") || 540);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H; const tg = tmp.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);

let SEED = 31; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const gradMap = (() => { const d = new Uint8Array([95, 95, 95, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });
function tbox(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, density = 1.6) {
  const g = new THREE.BoxGeometry(w, h, d); const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / density, uv.getY(i) * dims[f][1] / density); }
  const m = new THREE.Mesh(g, mat); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
function plane(w, h, mat, x, y, z, rx = 0, ry = 0, parent = scene, density = 1.6) {
  const g = new THREE.PlaneGeometry(w, h); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / density, uv.getY(i) * h / density);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); parent.add(m); return m;
}
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const tx = (c, rep = true) => P.tex(c, rep);
const INK = "#2a1a12";

// ---------- hand-drawn textures (lines inside the surfaces) ----------
function wallTex() { const [c, g] = cv(512, 512); g.fillStyle = "#56627e"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#5b6884" : "#525e7a"; g.fillRect(i * 64, 0, 64, 512); }
  g.strokeStyle = "rgba(42,26,18,0.25)"; g.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = rnd() * 512, y = rnd() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 30, y + 10 + rnd() * 30); g.stroke(); }
  return tx(c); }
function woodTex(base = "#7a5232", n = 6) { const [c, g] = cv(512, 512); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { const y = i * 512 / n; g.fillStyle = P.hex(base, 0.9 + rnd() * 0.2); g.fillRect(0, y, 512, 512 / n); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke();
    g.strokeStyle = "rgba(42,26,18,0.35)"; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = y + 10 + rnd() * (512 / n - 20); g.beginPath(); g.moveTo(rnd() * 100, yy); g.bezierCurveTo(150, yy - 6, 300, yy + 6, 380 + rnd() * 130, yy); g.stroke(); }
    g.beginPath(); g.moveTo(rnd() * 512, y); g.lineTo(rnd() * 512, y + 512 / n); g.stroke(); }
  return tx(c); }
function blanketTex() { const [c, g] = cv(512, 512); g.fillStyle = "#4c5c80"; g.fillRect(0, 0, 512, 512);
  g.lineCap = "round"; for (let i = 0; i < 14; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = "rgba(30,22,30,0.55)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 40, y + 20 + rnd() * 30, x + 90 + rnd() * 60, y + rnd() * 40); g.stroke();
    g.strokeStyle = "rgba(160,180,220,0.35)"; g.lineWidth = 6; g.beginPath(); g.moveTo(x + 6, y - 8); g.quadraticCurveTo(x + 46, y + 10, x + 90, y - 6); g.stroke(); }
  return tx(c); }
function rugTex() { const [c, g] = cv(512, 340); g.fillStyle = "#8a5a3a"; g.fillRect(0, 0, 512, 340); g.strokeStyle = "#d8b06a"; g.lineWidth = 10; g.strokeRect(20, 20, 472, 300);
  g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(40, 40, 432, 260); for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(42,26,18,0.4)"; g.beginPath(); g.moveTo(60 + i * 70, 60); g.lineTo(90 + i * 70, 280); g.stroke(); } return tx(c, false); }
function posterTex(kind) { const [c, g] = cv(300, 420); g.fillStyle = kind ? "#2d3a5a" : "#c9a66b"; g.fillRect(0, 0, 300, 420); g.strokeStyle = INK; g.lineWidth = 10; g.strokeRect(5, 5, 290, 410);
  if (kind) { g.fillStyle = "#e8c860"; g.beginPath(); g.arc(150, 170, 70, 0, 7); g.fill(); g.fillStyle = "#2d3a5a"; g.beginPath(); g.arc(178, 150, 62, 0, 7); g.fill(); g.fillStyle = "#f0e6d0"; g.font = "900 40px 'DejaVu Sans'"; g.textAlign = "center"; g.fillText("SONHE", 150, 330); }
  else { g.fillStyle = "#3a6a8a"; g.beginPath(); g.moveTo(40, 330); g.lineTo(140, 150); g.lineTo(200, 240); g.lineTo(260, 180); g.lineTo(260, 330); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); }
  return tx(c, false); }
const TX = { wall: wallTex(), floor: woodTex("#6e4a2e", 7), wood: woodTex("#8a5c38", 5), dark: woodTex("#4a3426", 5), blanket: blanketTex() };

// ---------- the room (back wall z = -2.25, side walls x = ±2.6) ----------
const wallM = toon(0xffffff, TX.wall);
plane(5.2, 4.6, toon(0xffffff, TX.floor), 0, 0, 0, -Math.PI / 2, 0, scene, 1.4);
plane(5.2, 2.8, wallM, 0, 1.4, -2.25, 0, 0); plane(4.6, 2.8, wallM, -2.6, 1.4, 0, 0, Math.PI / 2); plane(4.6, 2.8, wallM, 2.6, 1.4, 0, 0, -Math.PI / 2);
plane(5.2, 4.6, toon(0x3a3446), 0, 2.8, 0, Math.PI / 2, 0);
tbox(5.2, 0.12, 0.04, toon(0xffffff, TX.dark), 0, 0, -2.22);
// window with night sky + curtains
const winC = (() => { const [c, g] = cv(512, 512); const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0a1230"); gr.addColorStop(1, "#22305a"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) { g.fillStyle = "rgba(255,255,255," + (0.4 + rnd() * 0.6) + ")"; g.fillRect(rnd() * 512, rnd() * 380, 2 + rnd() * 2, 2 + rnd() * 2); }
  g.fillStyle = "#0e1428"; for (let i = 0; i < 9; i++) { const w = 40 + rnd() * 50, h = 60 + rnd() * 120; g.fillRect(i * 58, 512 - h, w, h); g.fillStyle = "#ffcf7a"; for (let k = 0; k < 4; k++) if (rnd() > 0.55) g.fillRect(i * 58 + 8 + rnd() * (w - 16), 512 - h + 10 + rnd() * (h - 20), 6, 8); g.fillStyle = "#0e1428"; }
  return tx(c, false); })();
add(new THREE.PlaneGeometry(1.2, 1.1), new THREE.MeshBasicMaterial({ map: winC }), 0.35, 1.65, -2.24);
for (const [w, h, x, y] of [[1.32, 0.07, 0.35, 2.2], [1.32, 0.07, 0.35, 1.1], [0.07, 1.1, -0.27, 1.65], [0.07, 1.1, 0.97, 1.65], [0.05, 1.1, 0.35, 1.65], [1.2, 0.05, 0.35, 1.65]]) { const m = tbox(w, h, 0.06, toon(0xe8e0d0), x, y - h / 2, -2.22); }
for (const s of [-1, 1]) { const cu = tbox(0.42, 1.55, 0.05, toon(0x2e3a5a), 0.35 + s * 0.78, 0.95, -2.18); }
// posters
add(new THREE.PlaneGeometry(0.5, 0.7), toon(0xffffff, posterTex(1)), -1.55, 1.85, -2.23); add(new THREE.PlaneGeometry(0.42, 0.58), toon(0xffffff, posterTex(0)), -0.85, 1.95, -2.23);
// bed (along the back wall, left)
const bedW = toon(0xffffff, TX.wood);
tbox(2.0, 0.32, 1.25, bedW, -1.35, 0, -1.5); tbox(0.08, 0.9, 1.25, bedW, -2.35, 0, -1.5);
tbox(1.92, 0.16, 1.2, toon(0xe8e4dc), -1.35, 0.32, -1.5);
const blanket = tbox(1.5, 0.14, 1.26, toon(0xffffff, TX.blanket), -1.05, 0.4, -1.47); blanket.rotation.y = 0.04;
for (const z of [-1.8, -1.25]) { const pw = add(new THREE.SphereGeometry(0.3, 16, 10), toon(0xdcd8e4), -2.0, 0.6, z); pw.scale.set(0.55, 0.32, 0.9); }
// nightstand + lamp + clock
tbox(0.5, 0.55, 0.42, toon(0xffffff, TX.dark), -2.3, 0, -0.55);
add(new THREE.CylinderGeometry(0.05, 0.07, 0.25, 10), toon(0x6a4a3a), -2.3, 0.68, -0.6);
const shade = add(new THREE.CylinderGeometry(0.11, 0.19, 0.2, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xffc070, side: THREE.DoubleSide }), -2.3, 0.88, -0.6);
const clockC = (() => { const [c, g] = cv(256, 128); g.fillStyle = "#16120e"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#ff5a3a"; g.font = "900 78px 'DejaVu Sans Mono'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("03:12", 128, 66); return tx(c, false); })();
const clock = tbox(0.22, 0.1, 0.08, toon(0x2a2420), -2.18, 0.55, -0.38); add(new THREE.PlaneGeometry(0.19, 0.08), new THREE.MeshBasicMaterial({ map: clockC }), -2.18, 0.6, -0.339);
// bookshelf on the left wall
const shelf = grp(scene, -2.45, 0, 0.75); tbox(0.3, 1.9, 0.9, toon(0xffffff, TX.wood), 0, 0, 0, shelf);
for (let r = 0; r < 4; r++) { let z = -0.4; while (z < 0.38) { const w = 0.04 + rnd() * 0.05, h = 0.25 + rnd() * 0.15; tbox(0.22, h, w, toon([0xc0392b, 0x2d6fd0, 0xe8c860, 0x2f8a5a, 0xd8d0c0, 0x8e44ad][Math.floor(rnd() * 6)]), 0.03, 0.1 + r * 0.45, z + w / 2, shelf); z += w + 0.005; } }
// desk (back wall, right) + monitor + lamp + mug + keyboard + chair
const desk = grp(scene, 1.55, 0, -1.85);
tbox(1.5, 0.05, 0.7, toon(0xffffff, TX.wood), 0, 0.74, 0, desk); for (const s of [-1, 1]) tbox(0.06, 0.74, 0.66, toon(0xffffff, TX.dark), s * 0.7, 0, 0, desk);
tbox(0.08, 0.32, 0.08, toon(0x2a2a30), 0, 0.79, -0.15, desk); tbox(0.3, 0.02, 0.2, toon(0x2a2a30), 0, 0.79, -0.15, desk);
tbox(0.95, 0.56, 0.05, toon(0x1a1a20), 0, 1.0, -0.17, desk);
const [scrC, scrG] = cv(1024, 576); const scrTex = tx(scrC, false);
const SCREEN = add(new THREE.PlaneGeometry(0.89, 0.5), new THREE.MeshBasicMaterial({ map: scrTex, color: 0xb8c0cc }), 0, 1.28, -0.142, desk);
tbox(0.55, 0.02, 0.18, toon(0x2a2a30), 0, 0.77, 0.12, desk); tbox(0.08, 0.02, 0.12, toon(0x2a2a30), 0.42, 0.77, 0.14, desk);
add(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 14), toon(0xe8e0d0), -0.55, 0.82, 0.1, desk);
const dl = grp(desk, 0.6, 0.77, -0.15); tbox(0.14, 0.02, 0.14, toon(0x2a2a30), 0, 0, 0, dl); const arm1 = add(new THREE.CylinderGeometry(0.012, 0.012, 0.45), toon(0x2a2a30), -0.05, 0.22, 0.02, dl); arm1.rotation.z = 0.35;
const dshade = add(new THREE.ConeGeometry(0.1, 0.14, 14, 1, true), toon(0x2a2a30, null, { side: THREE.DoubleSide }), -0.18, 0.43, 0.08, dl); dshade.rotation.z = 0.9;
for (let i = 0; i < 3; i++) { const p = tbox(0.21, 0.004, 0.28, toon(0xf4efe2), 0.3 - i * 0.02, 0.77 + i * 0.004, 0.18 + i * 0.01, desk); p.rotation.y = 0.2 + i * 0.1; }
const chair = grp(scene, 1.5, 0, -1.05); tbox(0.5, 0.06, 0.48, toon(0x2a2a30), 0, 0.46, 0, chair); tbox(0.48, 0.62, 0.06, toon(0x2a2a30), 0, 0.5, 0.24, chair); add(new THREE.CylinderGeometry(0.03, 0.03, 0.45), toon(0x1a1a20), 0, 0.23, 0, chair);
// rug
add(new THREE.PlaneGeometry(1.8, 1.2), toon(0xffffff, rugTex()), -0.4, 0.004, -0.2).rotation.x = -Math.PI / 2;
// the hero seen from behind (3D), sitting at the desk
const BACK = grp(scene, 1.5, 0, -1.02); { const shirt = toon(0x232328), sk = toon(0xf7f5f0), hairM = toon(0x5e3c22);
  const torso = add(new THREE.SphereGeometry(1, 20, 14), shirt, 0, 0.86, 0, BACK); torso.scale.set(0.2, 0.3, 0.13);
  add(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), sk, 0, 1.15, -0.01, BACK);
  const head = add(new THREE.SphereGeometry(0.125, 20, 14), sk, 0, 1.3, -0.01, BACK); head.scale.set(1, 1.08, 1);
  for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.03, 10, 8), sk, s * 0.125, 1.29, -0.01, BACK);
  const hair = add(new THREE.SphereGeometry(0.138, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), hairM, 0, 1.31, 0.012, BACK); hair.rotation.x = 0.35;
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, sp = add(new THREE.ConeGeometry(0.035, 0.09, 6), hairM, Math.cos(a) * 0.1, 1.38 + Math.sin(i * 1.7) * 0.03, 0.05 + Math.sin(a) * 0.07, BACK); sp.rotation.set(0.9 + Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.9); }
  for (const s of [-1, 1]) { const up = add(new THREE.CylinderGeometry(0.055, 0.05, 0.26, 10), shirt, s * 0.21, 0.95, -0.04, BACK); up.rotation.set(0.5, 0, s * 0.25);
    const fa = add(new THREE.CylinderGeometry(0.035, 0.032, 0.32, 10), sk, s * 0.2, 0.8, -0.27, BACK); fa.rotation.set(1.45, 0, s * -0.15);
    const hd = add(new THREE.SphereGeometry(0.04, 10, 8), sk, s * 0.17, 0.79, -0.43, BACK); hd.scale.set(1.2, 0.6, 1.4); } }
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } });

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0x5a6aa0, 0x1a1420, 0.55); scene.add(hemi);
const moon = new THREE.DirectionalLight(0x8aa4ff, 0.6); moon.position.set(1.5, 3, -6); scene.add(moon);
const lampL = new THREE.PointLight(0xffa850, 6, 7, 1.3); lampL.position.set(-2.25, 1.0, -0.55); lampL.castShadow = true; lampL.shadow.mapSize.set(1024, 1024); lampL.shadow.bias = -0.002; scene.add(lampL);
const phoneL = new THREE.PointLight(0x7fc8ff, 0, 2.2, 1.6); scene.add(phoneL);
const monL = new THREE.PointLight(0xa8d0ff, 0, 3.5, 1.4); monL.position.set(1.55, 1.28, -1.6); scene.add(monL);
const deskL = new THREE.PointLight(0xffb060, 0, 3, 1.5); deskL.position.set(1.95, 1.15, -1.8); scene.add(deskL);
// soft glow sprites
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tx(c, false); })();
const mkGlow = (col, s) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.setScalar(s); scene.add(sp); return sp; };
const gLamp = mkGlow(0xffb060, 1.1); gLamp.position.set(-2.3, 0.9, -0.6);
const gPhone = mkGlow(0x8fd4ff, 0.9); const gMon = mkGlow(0x9fc8ff, 1.6); gMon.position.set(1.55, 1.28, -1.95);

// ---------- character (2D card) ----------
const HERO = { jacket: "#232328", pants: "#1c1c22", boots: "#2a2a30", hat: "hair", hair: "#5e3c22", skin: "#f7f5f0", buttons: "#3a3a42" };
class Card {
  constructor() { this.c = document.createElement("canvas"); this.c.width = 1200; this.c.height = 2000; this.g = this.c.getContext("2d"); this.tex = tx(this.c, false);
    const geo = new THREE.PlaneGeometry(1.32, 2.2); geo.translate(0, 1.1 - 25 * 0.0022, 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, alphaTest: 0.4 }); this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.renderOrder = 2; scene.add(this.mesh); this.key = "";
    this.mesh.castShadow = true; this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.tex, alphaTest: 0.5 }); }
  draw(key, fn) { if (key === this.key) return; this.key = key; const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 1200, 2000); g.setTransform(2, 0, 0, 2, 0, 0); fn(new T.Pen(g)); this.tex.needsUpdate = true; }
}
const hero = new Card();
const qz = (v, s = 0.05) => Math.round(v / s) * s;

// ---------- post: thick brown ink, paper grain, glow ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 200 }, res: { value: new THREE.Vector2(W, H) }, seed: { value: 0 }, inkR: { value: 2.4 * H / 1080 }, vig: { value: 0.45 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, seed, inkR, vig; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.04, 0.10, e);
      vec3 bl = vec3(0.0); for (int i = 0; i < 16; i++) { float a = float(i) * 0.3927; vec2 o = vec2(cos(a), sin(a)) * 22.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.8, 0.0); }
      c += bl / 16.0 * 0.9;
      c = mix(c, vec3(0.16, 0.10, 0.07), ink * 0.95);
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float paper = hash(floor(vUv * res / 2.0)) * 0.05 + hash(floor(vUv * res / 9.0)) * 0.04;
      c *= 0.97 + paper; c = mix(c, c * vec3(1.03, 0.99, 0.95), 0.6);
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.3, 0.85, length(v * vec2(1.0, 0.8)));
      gl_FragColor = vec4(c, 1.0);
    }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- monitor screen UI (generic, original) ----------
function drawScreen(typed, t) { const g = scrG; g.fillStyle = "#f4f5f7"; g.fillRect(0, 0, 1024, 576); g.fillStyle = "#e1e4ea"; g.fillRect(0, 0, 1024, 54);
  for (const [x, c] of [[24, "#ff5f57"], [52, "#febc2e"], [80, "#28c840"]]) { g.fillStyle = c; g.beginPath(); g.arc(x, 27, 9, 0, 7); g.fill(); }
  g.fillStyle = "#ffffff"; g.fillRect(120, 12, 600, 30); g.fillStyle = "#8a909c"; g.font = "500 18px 'DejaVu Sans'"; g.fillText("estudio.videos.com/criar-canal", 136, 33);
  g.fillStyle = "#e5483b"; g.beginPath(); g.roundRect(40, 84, 54, 38, 9); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(60, 93); g.lineTo(78, 103); g.lineTo(60, 113); g.fill();
  g.fillStyle = "#1c1f26"; g.font = "800 28px 'DejaVu Sans'"; g.fillText("Estúdio", 108, 113);
  g.font = "900 52px 'DejaVu Sans'"; g.fillText("Criar seu canal", 260, 210);
  g.fillStyle = "#d8dce4"; g.beginPath(); g.arc(512, 300, 56, 0, 7); g.fill(); g.fillStyle = "#9aa2b0"; g.beginPath(); g.arc(512, 288, 22, 0, 7); g.fill(); g.beginPath(); g.ellipse(512, 336, 36, 20, 0, Math.PI, 0); g.fill();
  g.fillStyle = "#6b7280"; g.font = "600 22px 'DejaVu Sans'"; g.fillText("Nome do canal", 290, 398);
  g.strokeStyle = "#2d6fd0"; g.lineWidth = 4; g.beginPath(); g.roundRect(286, 410, 452, 60, 10); g.stroke();
  g.fillStyle = "#1c1f26"; g.font = "800 32px 'DejaVu Sans'"; g.fillText(typed, 304, 452); const w = g.measureText(typed).width;
  if (Math.floor(t * 2.2) % 2 === 0) g.fillRect(308 + w, 424, 4, 34);
  g.fillStyle = typed.length > 8 ? "#2d6fd0" : "#aab4c6"; g.beginPath(); g.roundRect(392, 494, 240, 52, 26); g.fill(); g.fillStyle = "#fff"; g.font = "800 22px 'DejaVu Sans'"; g.textAlign = "center"; g.fillText("CRIAR CANAL", 512, 528); g.textAlign = "left";
  scrTex.needsUpdate = true; }

// ---------- falling specks overlay ----------
const SPECKS = Array.from({ length: 170 }, (_, i) => ({ x: rnd(), y: rnd(), s: rnd() < 0.12 ? 3 + rnd() * 3 : 0.8 + rnd() * 1.6, v: 0.04 + rnd() * 0.06, a: 0.35 + rnd() * 0.55, w: rnd() * 6 }));
function specks(g, t) { for (const p of SPECKS) { const y = (p.y + t * p.v) % 1, x = (p.x - t * p.v * 0.45 + Math.sin(t * 0.8 + p.w) * 0.004 + 1) % 1;
  g.globalAlpha = p.a; g.fillStyle = "#ffffff"; const r = p.s * H / 1080 * 1.6; g.beginPath(); g.ellipse(x * W, y * H, r * 0.8, r * 1.4, -0.45, 0, 7); g.fill(); } g.globalAlpha = 1; }

// ---------- one render pass for a state ----------
const V = (a) => new THREE.Vector3(...a);
function renderState(st, t, f) {
  const c = st.cam; camera.position.set(...c.pos); camera.lookAt(V(c.look)); camera.fov = c.fov ?? 40; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  lampL.intensity = st.lamp ?? 6; gLamp.material.opacity = Math.min(1, (st.lamp ?? 6) / 6);
  phoneL.intensity = st.phone ? 2.6 * (0.9 + 0.1 * Math.sin(t * 7)) : 0; gPhone.visible = !!st.phone; if (st.phone) { phoneL.position.set(...st.phone); gPhone.position.set(...st.phone); }
  monL.intensity = st.mon ?? 1.2; gMon.material.opacity = Math.min(1, (st.mon ?? 1.2) / 2.5); deskL.intensity = st.desk ?? 0;
  drawScreen(st.typed ?? "", t);
  BACK.visible = !!st.back;
  const a = st.hero; hero.mesh.visible = !!a;
  if (a) { hero.draw(JSON.stringify(a.opts, (k, v) => (typeof v === "number" ? qz(v, 0.02) : v)), (p) => T.bodyFront(p, HERO, a.opts));
    hero.mesh.position.set(...a.pos); hero.mesh.rotation.set(0, Math.atan2(camera.position.x - a.pos[0], camera.position.z - a.pos[2]), 0); hero.mesh.scale.setScalar(a.scale ?? 1); hero.mat.color.setRGB(...(a.tint || [1, 1, 1])); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.seed.value = f * 0.37; post.uniforms.vig.value = st.vig ?? 0.45;
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
}
window.renderFrame = async (f) => {
  const t = f / FPS, S = stateAt(t);
  renderState(S.a, t, f); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.b && S.mix > 0) { renderState(S.b, t, f); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); og.globalAlpha = 1; }
  specks(og, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.94);
};
window.TOTAL = TOTAL; window.ready = true;
