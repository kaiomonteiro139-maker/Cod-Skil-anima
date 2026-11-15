// "Dinheiro fácil" — illustrated-story engine: hand-drawn look, 9 sets, cast cards, phone/monitor/TV screens.
import * as THREE from "./three.module.js";
import * as P from "./paint.js";
import * as T from "./toon.js";
const { stateAt, FPS, TOTAL } = await import("./" + (new URLSearchParams(location.search).get("story") || "story") + ".js");

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 960), H = +(q.get("h") || 540);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.03, 300); scene.add(camera);

let SEED = 41; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const gradMap = (() => { const d = new Uint8Array([95, 95, 95, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, map = null) => new THREE.MeshBasicMaterial({ color, map });
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
const sign = (lines, o = {}) => P.signText(lines, o);

// ---------- hand-drawn textures ----------
function wallTex(base, stripe = true) { const [c, g] = cv(512, 512); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  if (stripe) for (let i = 0; i < 8; i++) { g.fillStyle = P.hex(base, i % 2 ? 1.05 : 0.96); g.fillRect(i * 64, 0, 64, 512); }
  g.strokeStyle = "rgba(42,26,18,0.22)"; g.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = rnd() * 512, y = rnd() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 30, y + 10 + rnd() * 30); g.stroke(); }
  return tx(c); }
function woodTex(base = "#7a5232", n = 6) { const [c, g] = cv(512, 512); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < n; i++) { const y = i * 512 / n; g.fillStyle = P.hex(base, 0.9 + rnd() * 0.2); g.fillRect(0, y, 512, 512 / n); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke();
    g.strokeStyle = "rgba(42,26,18,0.35)"; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = y + 10 + rnd() * (512 / n - 20); g.beginPath(); g.moveTo(rnd() * 100, yy); g.bezierCurveTo(150, yy - 6, 300, yy + 6, 380 + rnd() * 130, yy); g.stroke(); } }
  return tx(c); }
function tileTex(a, b, n = 8) { const [c, g] = cv(512, 512); const s = 512 / n; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * s, y * s, s, s); }
  g.strokeStyle = "rgba(42,26,18,0.5)"; g.lineWidth = 3; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 512); g.moveTo(0, i * s); g.lineTo(512, i * s); g.stroke(); } return tx(c); }
function brickTex(base = "#9a5a3a") { const [c, g] = cv(512, 512); g.fillStyle = "#6a5a4e"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) for (let x = -64 + ((y / 32) % 2) * 32; x < 512; x += 64) { g.fillStyle = P.hex(base, 0.85 + rnd() * 0.3); g.fillRect(x + 3, y + 3, 58, 26); } return tx(c); }
function blanketTex() { const [c, g] = cv(512, 512); g.fillStyle = "#4c5c80"; g.fillRect(0, 0, 512, 512); g.lineCap = "round";
  for (let i = 0; i < 14; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = "rgba(30,22,30,0.55)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 40, y + 20 + rnd() * 30, x + 90 + rnd() * 60, y + rnd() * 40); g.stroke(); } return tx(c); }
const TX = { wallBlue: wallTex("#56627e"), wallBeige: wallTex("#cdb48a"), wallGray: wallTex("#7d8580", false), wallGreen: wallTex("#7a8a74", false), wallCream: wallTex("#e2d6b8"),
  floor: woodTex("#6e4a2e", 7), wood: woodTex("#8a5c38", 5), dark: woodTex("#4a3426", 5), light: woodTex("#b08a5a", 5), panel: woodTex("#6a4026", 3),
  kitTiles: tileTex("#e8e2d0", "#c9c2ae"), floorTiles: tileTex("#8a7a6a", "#74685a", 6), brick: brickTex(), asphalt: P.asphalt(), side: tileTex("#a8a296", "#968f84", 4), blanket: blanketTex() };

// ---------- generic room ----------
function room(cx, w, d, h, wall, floor, ceil = 0x3a3446) {
  const g = grp(scene, cx, 0, 0), wm = toon(0xffffff, wall);
  plane(w, d, toon(0xffffff, floor), 0, 0, 0, -Math.PI / 2, 0, g, 1.4); plane(w, h, wm, 0, h / 2, -d / 2, 0, 0, g); plane(d, h, wm, -w / 2, h / 2, 0, 0, Math.PI / 2, g); plane(d, h, wm, w / 2, h / 2, 0, 0, -Math.PI / 2, g);
  plane(w, d, toon(ceil), 0, h, 0, Math.PI / 2, 0, g); tbox(w, 0.1, 0.04, toon(0xffffff, TX.dark), 0, 0, -d / 2 + 0.02, g); return g; }
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tx(c, false); })();
const mkGlow = (col, s, parent = scene) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.scale.setScalar(s); parent.add(sp); return sp; };
const LIGHTS = []; // [light, setName, baseIntensity]
function plight(col, i, dist, x, y, z, set, shadow = false) { const l = new THREE.PointLight(col, i, dist, 1.4); l.position.set(x, y, z); if (shadow) { l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; } scene.add(l); LIGHTS.push([l, set, i]); return l; }
function chair(x, z, ry, parent, col = 0x6a4a3a) { const g = grp(parent, x, 0, z); g.rotation.y = ry; const m = toon(col); tbox(0.44, 0.05, 0.42, m, 0, 0.45, 0, g); for (const [a, b] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.17], [0.18, 0.17]]) tbox(0.04, 0.45, 0.04, m, a, 0, b, g); tbox(0.44, 0.5, 0.04, m, 0, 0.5, -0.19, g); return g; }

// ---------- screens (canvas textures) ----------
const [phC, phG] = cv(540, 1080); const phTex = tx(phC, false);
const [monC, monG] = cv(1024, 600); const monTex = tx(monC, false);
const [tvC, tvG] = cv(960, 540); const tvTex = tx(tvC, false);

// ---------- SET bedroom (x = 0) ----------
const BED = room(0, 5.2, 4.6, 2.8, TX.wallBlue, TX.floor, 0x5a5670);
{ const g = BED;
  const winC = (() => { const [c, g2] = cv(512, 512); const gr = g2.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0a1230"); gr.addColorStop(1, "#22305a"); g2.fillStyle = gr; g2.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) { g2.fillStyle = "rgba(255,255,255," + (0.4 + rnd() * 0.6) + ")"; g2.fillRect(rnd() * 512, rnd() * 380, 3, 3); }
    g2.fillStyle = "#0e1428"; for (let i = 0; i < 9; i++) { const w = 40 + rnd() * 50, h = 60 + rnd() * 120; g2.fillRect(i * 58, 512 - h, w, h); g2.fillStyle = "#ffcf7a"; for (let k = 0; k < 4; k++) if (rnd() > 0.55) g2.fillRect(i * 58 + 8 + rnd() * (w - 16), 512 - h + 10 + rnd() * (h - 20), 6, 8); g2.fillStyle = "#0e1428"; }
    return tx(c, false); })();
  add(new THREE.PlaneGeometry(1.2, 1.1), basic(0xffffff, winC), 0.35, 1.65, -2.29, g);
  for (const [w, h, x, y] of [[1.32, 0.07, 0.35, 2.2], [1.32, 0.07, 0.35, 1.1], [0.07, 1.1, -0.27, 1.65], [0.07, 1.1, 0.97, 1.65], [0.05, 1.1, 0.35, 1.65]]) tbox(w, h, 0.06, toon(0xe8e0d0), x, y - h / 2, -2.26, g);
  for (const s of [-1, 1]) tbox(0.42, 1.55, 0.05, toon(0x2e3a5a), 0.35 + s * 0.78, 0.95, -2.2, g);
  const bw = toon(0xffffff, TX.wood); tbox(2.0, 0.32, 1.25, bw, -1.35, 0, -1.5, g); tbox(0.08, 0.9, 1.25, bw, -2.35, 0, -1.5, g); tbox(1.92, 0.16, 1.2, toon(0xe8e4dc), -1.35, 0.32, -1.5, g);
  tbox(1.5, 0.14, 1.26, toon(0xffffff, TX.blanket), -1.05, 0.4, -1.47, g); for (const z of [-1.8, -1.25]) { const pw = add(new THREE.SphereGeometry(0.3, 16, 10), toon(0xdcd8e4), -2.0, 0.6, z, g); pw.scale.set(0.55, 0.32, 0.9); }
  tbox(0.5, 0.55, 0.42, toon(0xffffff, TX.dark), -2.3, 0, -0.55, g); add(new THREE.CylinderGeometry(0.05, 0.07, 0.25, 10), toon(0x6a4a3a), -2.3, 0.68, -0.6, g);
  add(new THREE.CylinderGeometry(0.11, 0.19, 0.2, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xffc070, side: THREE.DoubleSide }), -2.3, 0.88, -0.6, g); mkGlow(0xffb060, 1.0, g).position.set(-2.3, 0.9, -0.6);
  // desk + monitor + boleto + chips
  const desk = grp(g, 1.55, 0, -1.85); tbox(1.5, 0.05, 0.7, toon(0xffffff, TX.wood), 0, 0.74, 0, desk); for (const s of [-1, 1]) tbox(0.06, 0.74, 0.66, toon(0xffffff, TX.dark), s * 0.7, 0, 0, desk);
  tbox(0.08, 0.32, 0.08, toon(0x2a2a30), 0, 0.79, -0.15, desk); tbox(0.95, 0.56, 0.05, toon(0x1a1a20), 0, 1.0, -0.17, desk);
  add(new THREE.PlaneGeometry(0.89, 0.52), new THREE.MeshBasicMaterial({ map: monTex, color: 0xc0c8d4 }), 0, 1.28, -0.142, desk); mkGlow(0x9fc8ff, 1.4, desk).position.set(0, 1.28, -0.1);
  tbox(0.55, 0.02, 0.18, toon(0x2a2a30), 0, 0.77, 0.12, desk); add(new THREE.CylinderGeometry(0.045, 0.04, 0.1, 14), toon(0xe8e0d0), -0.55, 0.82, 0.1, desk);
  const bol = add(new THREE.PlaneGeometry(0.21, 0.29), toon(0xffffff, sign(["BOLETO", "R$ 1.240,00", "VENCIDO"], { w: 512, h: 700, size: 70, bg: "#f4efe2", fg: "#c0392b" })), 0.42, 0.793, 0.12, desk); bol.rotation.set(-Math.PI / 2, 0, 0.25);
  for (let i = 0; i < 4; i++) { const ch = tbox(0.06, 0.004, 0.085, toon([0xe5483b, 0x2d6fd0, 0xf2c230, 0x2fb36a][i]), -0.32 + i * 0.1, 0.79, 0.2 + (i % 2) * 0.05, desk); ch.rotation.y = i * 0.4; ch.name = "chip"; }
  const sh = grp(g, -2.45, 0, 0.75); tbox(0.3, 1.9, 0.9, toon(0xffffff, TX.wood), 0, 0, 0, sh);
  for (let r = 0; r < 4; r++) { let z = -0.4; while (z < 0.38) { const w = 0.04 + rnd() * 0.05, h = 0.25 + rnd() * 0.15; tbox(0.22, h, w, toon([0xc0392b, 0x2d6fd0, 0xe8c860, 0x2f8a5a, 0xd8d0c0, 0x8e44ad][Math.floor(rnd() * 6)]), 0.03, 0.1 + r * 0.45, z + w / 2, sh); z += w + 0.005; } }
  const ch = chair(1.5, -1.05, Math.PI, g, 0x2a2a30); }
plight(0xffa850, 6, 7, -2.25, 1.0, -0.55, "bed", true); plight(0xa8d0ff, 1.4, 3.5, 1.55, 1.28, -1.6, "bed"); plight(0xffb060, 1.6, 2.5, 1.95, 1.2, -1.5, "bed");

// ---------- SET kitchen + living (x = 20): table, TV, front door ----------
const KX = 20, KIT = room(KX, 5.4, 4.8, 2.7, TX.wallCream, TX.floorTiles, 0xd8cdb0);
let TVSCR, KDOOR;
{ const g = KIT; plane(3.2, 0.9, toon(0xffffff, TX.kitTiles), -0.9, 1.35, -2.38, 0, 0, g, 0.9);
  tbox(3.2, 0.88, 0.6, toon(0xffffff, TX.light), -0.9, 0, -2.08, g); tbox(3.22, 0.05, 0.62, toon(0xd8d2c4), -0.9, 0.88, -2.08, g);
  tbox(0.6, 0.02, 0.4, toon(0x9aa0a8), -1.4, 0.93, -2.08, g); add(new THREE.CylinderGeometry(0.15, 0.13, 0.18, 14), toon(0x6a7078), -0.2, 1.02, -2.05, g);
  tbox(0.75, 1.8, 0.65, toon(0xe8ecee), 1.3, 0, -2.05, g); add(new THREE.PlaneGeometry(0.06, 0.4), toon(0x9aa0a8), 1.0, 1.25, -1.72, g);
  const wc = (() => { const [c, g2] = cv(256, 256); g2.fillStyle = "#9fc8e8"; g2.fillRect(0, 0, 256, 256); g2.fillStyle = "#6a9a5a"; g2.fillRect(0, 170, 256, 86); return tx(c, false); })();
  const win = add(new THREE.PlaneGeometry(1.0, 0.7), basic(0xffffff, wc), -1.2, 1.85, -2.39, g); win.name = "kwin";
  for (const [w, h, x, y] of [[1.1, 0.06, -1.2, 2.2], [1.1, 0.06, -1.2, 1.5], [0.06, 0.7, -1.73, 1.85], [0.06, 0.7, -0.67, 1.85]]) tbox(w, h, 0.05, toon(0xf2efe6), x, y - h / 2, -2.37, g);
  // table + chairs + pendant
  const tcl = (() => { const [c, g2] = cv(256, 256); g2.fillStyle = "#f4efe2"; g2.fillRect(0, 0, 256, 256); g2.strokeStyle = "#5a8ac0"; g2.lineWidth = 8; for (let i = 0; i < 256; i += 32) { g2.beginPath(); g2.moveTo(i, 0); g2.lineTo(i, 256); g2.moveTo(0, i); g2.lineTo(256, i); g2.stroke(); } return tx(c); })();
  tbox(1.4, 0.05, 0.9, toon(0xffffff, tcl), 0, 0.74, 0.0, g, 0.7); for (const [a, b] of [[-0.62, -0.38], [0.62, -0.38], [-0.62, 0.38], [0.62, 0.38]]) tbox(0.05, 0.74, 0.05, toon(0x6a4a3a), a, 0, b, g);
  chair(-0.95, 0.0, Math.PI / 2, g); chair(0.95, 0.0, -Math.PI / 2, g); chair(0, -0.7, 0, g);
  for (const [x, z] of [[-0.35, 0.1], [0.35, -0.05]]) { add(new THREE.CylinderGeometry(0.13, 0.1, 0.03, 18), toon(0xf2f2f2), x, 0.78, z, g); }
  const papers = grp(g, 0.1, 0.77, 0.15); papers.name = "bills"; for (let i = 0; i < 5; i++) { const p = add(new THREE.PlaneGeometry(0.2, 0.27), toon(0xffffff, sign(["CONTA", "R$ " + (180 + i * 97) + ",00"], { w: 256, h: 340, size: 46, bg: "#f4efe2", fg: "#c0392b" })), (i - 2) * 0.1, i * 0.002, (i % 2) * 0.05, papers); p.rotation.set(-Math.PI / 2, 0, (i - 2) * 0.25); }
  const calc = tbox(0.1, 0.02, 0.15, toon(0x2a2a30), 0.4, 0.77, 0.25, g); calc.name = "calc";
  const pend = grp(g, 0, 2.7, 0); tbox(0.01, 0.6, 0.01, toon(0x222222), 0, -0.6, 0, pend); add(new THREE.ConeGeometry(0.25, 0.2, 16, 1, true), toon(0x2f4a3a, null, { side: THREE.DoubleSide }), 0, -0.7, 0, pend); add(new THREE.SphereGeometry(0.07, 10, 6), basic(0xffe0a0), 0, -0.76, 0, pend); mkGlow(0xffc070, 0.9, pend).position.set(0, -0.78, 0);
  // TV on a cabinet against the right wall, facing -x
  tbox(0.45, 0.55, 1.2, toon(0xffffff, TX.dark), 2.45, 0, 0.6, g); tbox(0.08, 0.62, 1.05, toon(0x141418), 2.5, 0.6, 0.6, g);
  TVSCR = add(new THREE.PlaneGeometry(0.98, 0.56), basic(0xffffff, tvTex), 2.455, 0.91, 0.6, g); TVSCR.rotation.y = -Math.PI / 2; mkGlow(0x9fb8ff, 1.2, g).position.set(2.3, 0.91, 0.6);
  // front door on the left wall
  KDOOR = grp(g, -2.68, 0, 1.4); tbox(0.06, 2.1, 0.95, toon(0xffffff, P.planks("#6a3a22", { vertical: true, n: 4 })), 0, 0, -0.475, KDOOR, 1.2); add(new THREE.SphereGeometry(0.04, 8, 6), toon(0xc9a24a), 0.06, 1.0, -0.85, KDOOR);
  add(new THREE.PlaneGeometry(0.95, 2.1), basic(0xd8e0f0), -2.72, 1.05, 0.925, g).rotation.y = Math.PI / 2;
  add(new THREE.PlaneGeometry(0.5, 0.7), toon(0xffffff, sign(["FAMÍLIA"], { w: 300, h: 420, size: 50, bg: "#c9a66b" })), -1.5, 1.7, -2.39, g).visible = false; }
plight(0xffc27a, 6, 7, KX, 1.95, 0, "kit", true); plight(0x9fb8ff, 0, 3, KX + 2.2, 0.9, 0.6, "kit");

// ---------- SET café (x = 40) ----------
const CX = 40, CAF = room(CX, 5.4, 4.8, 3.0, TX.brick, TX.floor, 0x3a2a22);
{ const g = CAF; tbox(2.2, 1.0, 0.6, toon(0xffffff, TX.dark), 1.4, 0, -1.9, g); tbox(2.22, 0.05, 0.62, toon(0xd8c8a8), 1.4, 1.0, -1.9, g);
  tbox(0.5, 0.45, 0.35, toon(0xb8bcc4), 1.0, 1.05, -2.0, g); tbox(0.08, 0.1, 0.08, toon(0x2a2a30), 1.0, 1.08, -1.8, g);
  add(new THREE.PlaneGeometry(1.4, 0.9), toon(0xffffff, sign(["CAFÉ", "Expresso  R$ 6", "Pão de queijo  R$ 5"], { w: 700, h: 450, size: 58, bg: "#1f2a24", fg: "#f2f2f2" })), -0.6, 2.0, -2.39, g);
  const tb = grp(g, -0.3, 0, -0.3); add(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 24), toon(0xffffff, TX.light), 0, 0.74, 0, tb); add(new THREE.CylinderGeometry(0.04, 0.06, 0.74, 10), toon(0x2a2a30), 0, 0.37, 0, tb);
  for (const s of [-1, 1]) { add(new THREE.CylinderGeometry(0.045, 0.035, 0.08, 14), toon(0xf4f1ea), s * 0.18, 0.8, 0.05, tb); add(new THREE.CylinderGeometry(0.03, 0.03, 0.005, 14), basic(0x4a2a14), s * 0.18, 0.841, 0.05, tb); add(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 16), toon(0xf4f1ea), s * 0.18, 0.765, 0.05, tb); }
  const wc = (() => { const [c, g2] = cv(512, 384); g2.fillStyle = "#cfe4f2"; g2.fillRect(0, 0, 512, 384); g2.fillStyle = "#b9a98a"; g2.fillRect(0, 200, 512, 184); for (let i = 0; i < 4; i++) { g2.fillStyle = ["#d9785a", "#6fa8c9", "#e7c26a", "#9ac27a"][i]; g2.fillRect(20 + i * 125, 90, 110, 130); } return tx(c, false); })();
  add(new THREE.PlaneGeometry(2.6, 1.6), basic(0xffffff, wc), -2.69, 1.5, 0.3, g).rotation.y = Math.PI / 2;
  for (const x of [-0.3, 1.2]) { const pd = grp(g, x, 3.0, -0.3); tbox(0.01, 0.8, 0.01, toon(0x222222), 0, -0.8, 0, pd); add(new THREE.SphereGeometry(0.1, 12, 8), basic(0xffe0a0), 0, -0.86, 0, pd); mkGlow(0xffc070, 0.8, pd).position.set(0, -0.86, 0); }
  for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.05, 0.04, 0.12, 10), toon([0xc0392b, 0xf2c230, 0x2fb36a][i % 3]), 0.6 + i * 0.25, 1.62, -2.3, g);
  chair(-0.75, -0.8, 0, g, 0x3a2a22); chair(0.15, -0.8, 0, g, 0x3a2a22);
  tbox(2.0, 0.04, 0.25, toon(0xffffff, TX.dark), 1.2, 1.55, -2.28, g); }
plight(0xffc890, 5, 8, CX - 0.3, 2.2, -0.3, "caf", true); plight(0xe0f0ff, 3, 6, CX - 2.2, 1.6, 0.3, "caf");

// ---------- SET scam room (x = 60): long table, laptops, phones ----------
const SX = 60, SCAM = room(SX, 6, 5, 2.8, TX.wallGray, TX.floorTiles, 0xb8bcc0);
{ const g = SCAM; tbox(3.6, 0.05, 1.0, toon(0xe8e8e8), 0, 0.74, -0.4, g); for (const [a, b] of [[-1.7, -0.85], [1.7, -0.85], [-1.7, 0.05], [1.7, 0.05]]) tbox(0.05, 0.74, 0.05, toon(0x6a6a70), a, 0, b, g);
  for (let i = 0; i < 4; i++) { const x = -1.35 + i * 0.9; const lp = grp(g, x, 0.77, -0.55); tbox(0.34, 0.015, 0.24, toon(0x2a2a30), 0, 0, 0, lp); const scr = tbox(0.34, 0.22, 0.01, toon(0x2a2a30), 0, 0, -0.12, lp); scr.rotation.x = -0.25;
    const s = add(new THREE.PlaneGeometry(0.31, 0.19), new THREE.MeshBasicMaterial({ map: monTex, color: 0xb8c0cc }), 0, 0.115, -0.1, lp); s.rotation.x = -0.25; mkGlow(0x9fc8ff, 0.5, lp).position.set(0, 0.12, -0.05);
    for (let k = 0; k < 3; k++) { const ph = tbox(0.07, 0.008, 0.14, toon(0x1a1a20), 0.25 + k * 0.08, 0, 0.05 + (k % 2) * 0.05, lp); ph.rotation.y = k * 0.3; } }
  const wb = (() => { const [c, g2] = cv(768, 480); g2.fillStyle = "#f4f4f2"; g2.fillRect(0, 0, 768, 480); g2.strokeStyle = "#2a2a30"; g2.lineWidth = 10; g2.strokeRect(5, 5, 758, 470);
    g2.fillStyle = "#c0392b"; g2.font = "900 64px 'DejaVu Sans'"; g2.fillText("META DO MÊS", 40, 100); g2.fillStyle = "#2a2a30"; g2.font = "800 48px 'DejaVu Sans'"; ["Equipe A  R$ 84 mil", "Equipe B  R$ 61 mil", "Equipe C  R$ 77 mil"].forEach((s, i) => g2.fillText(s, 40, 200 + i * 80)); return tx(c, false); })();
  add(new THREE.PlaneGeometry(1.6, 1.0), toon(0xffffff, wb), 2.98, 1.55, -0.6, g).rotation.y = -Math.PI / 2;
  const bl = (() => { const [c, g2] = cv(256, 256); g2.fillStyle = "#3a4458"; g2.fillRect(0, 0, 256, 256); g2.fillStyle = "#c8ccd4"; for (let y = 0; y < 256; y += 20) g2.fillRect(0, y, 256, 12); return tx(c, false); })();
  for (const x of [-1.6, 0.6]) add(new THREE.PlaneGeometry(1.3, 1.1), basic(0xffffff, bl), x, 1.7, -2.49, g);
  for (const x of [-1.2, 1.2]) { tbox(1.2, 0.05, 0.18, basic(0xf0f6ff), x, 2.72, 0, g); mkGlow(0xdfe8ff, 1.2, g).position.set(x, 2.6, 0); }
  for (const x of [-1.35, -0.45, 0.45, 1.35]) chair(x, 0.35, Math.PI, g, 0x2a2a30); }
plight(0xe0ecff, 5, 9, SX, 2.5, 0.2, "scam", true); plight(0xa8c8ff, 2, 4, SX, 1.0, -0.4, "scam");

// ---------- SET street (x = 80): house fronts, cars, lamp ----------
const RX = 80, STREET = grp(scene, RX, 0, 0);
let CAR_RED, CAR_DARK, CAR_POL;
{ const g = STREET; plane(60, 8, toon(0xffffff, TX.asphalt), 0, 0.001, 3.5, -Math.PI / 2, 0, g, 4); plane(60, 3, toon(0xffffff, TX.side), 0, 0.06, -1.0, -Math.PI / 2, 0, g, 1.5);
  tbox(60, 0.06, 0.2, toon(0x8a8478), 0, 0, 0.5, g); plane(80, 40, toon(0x5a6a4a), 0, -0.01, -20, -Math.PI / 2, 0, g, 8);
  const houses = [[-9, "#d9785a"], [-3, "#e7c26a"], [3, "#6fa8c9"], [9, "#9ac27a"], [15, "#e2d6b8"], [-15, "#c99ad0"]];
  for (const [x, col] of houses) { const hg = grp(g, x, 0, -4.5); tbox(5.4, 3.2, 4, toon(0xffffff, P.plaster(col, { cracks: 1 })), 0, 0, 0, hg);
    tbox(0.95, 2.05, 0.06, toon(0xffffff, P.planks("#6a3a22", { vertical: true, n: 4 })), -1.2, 0, 2.02, hg); for (const wx of [0.6, 1.8]) tbox(0.8, 0.8, 0.05, toon(0x1c2230), wx, 1.2, 2.02, hg);
    tbox(5.8, 0.18, 4.4, toon(0x9a958a), 0, 3.2, 0, hg); tbox(5.4, 1.0, 0.12, toon(0xffffff, brickTex("#b5653a")), 0, 0, 2.6, hg).position.x = 0.8; }
  // hero's house front door marker (x = 3 → door at x 1.8)
  const lamp = grp(g, 6, 0, 0.9); add(new THREE.CylinderGeometry(0.07, 0.09, 4.6, 8), toon(0x3b3f48), 0, 2.3, 0, lamp); tbox(1.0, 0.08, 0.08, toon(0x3b3f48), -0.45, 4.5, 0, lamp); add(new THREE.SphereGeometry(0.14, 10, 6), basic(0xfff1b0), -0.9, 4.42, 0, lamp); mkGlow(0xffe0a0, 2.2, lamp).position.set(-0.9, 4.4, 0);
  const car = (col, x, z, ry) => { const c = grp(g, x, 0, z); c.rotation.y = ry; const m = toon(col); tbox(3.8, 0.7, 1.7, m, 0, 0.3, 0, c); tbox(2.1, 0.6, 1.55, m, -0.2, 1.0, 0, c);
    for (const s of [-1, 1]) tbox(1.9, 0.45, 0.02, toon(0x1a2230), -0.2, 1.07, s * 0.78, c); tbox(0.02, 0.45, 1.4, toon(0x1a2230), 0.86, 1.07, 0, c);
    for (const xx of [-1.2, 1.2]) for (const s of [-1, 1]) { const w = add(new THREE.CylinderGeometry(0.33, 0.33, 0.22, 16), toon(0x141414), xx, 0.33, s * 0.82, c); w.rotation.x = Math.PI / 2; }
    for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.08, 8, 6), basic(0xfff6d0), 1.9, 0.75, s * 0.6, c); return c; };
  CAR_RED = car(0xd8333a, 1.2, 1.4, 0); CAR_DARK = car(0x24262c, 9.5, 2.6, Math.PI); CAR_POL = car(0xf2f2f2, -1.5, 2.6, Math.PI);
  tbox(3.8, 0.12, 1.72, toon(0x2d4a9a), 0, 0.62, 0, CAR_POL); tbox(0.6, 0.12, 0.3, basic(0x3a6aff), -0.2, 1.3, -0.2, CAR_POL); tbox(0.6, 0.12, 0.3, basic(0xff3a3a), -0.2, 1.3, 0.2, CAR_POL);
  const pl = add(new THREE.PlaneGeometry(1.2, 0.3), toon(0xffffff, sign(["POLÍCIA"], { w: 512, h: 128, size: 80, bg: "#2d4a9a", fg: "#ffffff" })), 0, 0.5, 0.87, CAR_POL); }
plight(0xffe0a0, 0, 12, RX + 5.1, 4.3, 0.9, "street", false);

// ---------- SET faculdade (x = 100, day) ----------
const FX = 100, FAC = grp(scene, FX, 0, 0);
{ const g = FAC; plane(60, 8, toon(0xffffff, TX.asphalt), 0, 0.001, 3.5, -Math.PI / 2, 0, g, 4); plane(60, 3, toon(0xffffff, TX.side), 0, 0.06, -1.0, -Math.PI / 2, 0, g, 1.5); plane(80, 40, toon(0x6a8a4a), 0, -0.01, -20, -Math.PI / 2, 0, g, 8);
  tbox(14, 7, 6, toon(0xffffff, P.plaster("#e2d6b8", { cracks: 1 })), 0, 0, -7, g); for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) tbox(1.0, 1.1, 0.05, toon(0x2a4058), -5.6 + i * 1.6, 1.4 + r * 1.9, -3.98, g);
  add(new THREE.PlaneGeometry(6, 0.9), toon(0xffffff, sign(["FACULDADE"], { w: 1400, h: 210, size: 150, bg: "#1f3a6a", fg: "#ffffff" })), 0, 6.3, -3.96, g);
  for (let i = 0; i < 4; i++) tbox(5 - i * 0.4, 0.15, 0.35, toon(0xb8b4a8), 0, i * 0.15, -3.6 + i * 0.3 - 0.9, g);
  for (const x of [-9, 9]) { add(new THREE.CylinderGeometry(0.15, 0.2, 2.5, 8), toon(0x6a4a2e), x, 1.25, -2.2, g); add(new THREE.IcosahedronGeometry(1.4, 1), toon(0x4a7a3a), x, 3.2, -2.2, g); } }

// ---------- SET delegacia (x = 120) ----------
const DX = 120, DEL = room(DX, 5, 4.6, 2.8, TX.wallGreen, TX.floorTiles, 0xc8ccc4);
{ const g = DEL; tbox(1.8, 0.05, 0.9, toon(0xffffff, TX.dark), 0, 0.75, -0.6, g); for (const [a, b] of [[-0.85, -1.0], [0.85, -1.0], [-0.85, -0.2], [0.85, -0.2]]) tbox(0.05, 0.75, 0.05, toon(0x3a3a40), a, 0, b, g);
  tbox(0.5, 0.36, 0.04, toon(0x1a1a20), -0.5, 0.78, -0.9, g); add(new THREE.PlaneGeometry(0.46, 0.3), new THREE.MeshBasicMaterial({ map: monTex, color: 0xb8c0cc }), -0.5, 0.98, -0.877, g);
  const fold = grp(g, 0.25, 0.78, -0.45); fold.name = "folder"; tbox(0.42, 0.04, 0.3, toon(0xc9a24a), 0, 0, 0, fold); add(new THREE.PlaneGeometry(0.3, 0.12), toon(0xffffff, sign(["INQUÉRITO"], { w: 512, h: 200, size: 90, bg: "#c9a24a", fg: "#2a1a12" })), 0, 0.042, 0, fold).rotation.x = -Math.PI / 2;
  for (let i = 0; i < 4; i++) tbox(0.5, 1.5, 0.45, toon(0x7a8078), -2.0 + i * 0.55, 0, -2.05, g);
  add(new THREE.PlaneGeometry(1.6, 0.4), toon(0xffffff, sign(["DELEGACIA DE POLÍCIA"], { w: 1024, h: 256, size: 90, bg: "#1f2f5a", fg: "#ffffff" })), 0.8, 2.25, -2.29, g);
  tbox(1.0, 0.05, 0.16, basic(0xf0f6ff), 0, 2.72, -0.4, g); chair(0, -1.3, 0, g, 0x2a2a30); chair(0, 0.3, Math.PI, g, 0x2a2a30); }
plight(0xe8f0e0, 5, 8, DX, 2.4, -0.2, "del", true);

// ---------- SET courtroom (x = 140) ----------
const JX = 140, CRT = room(JX, 6.4, 6, 3.4, TX.panel, TX.floor, 0x4a3426);
{ const g = CRT; tbox(3.0, 1.2, 0.8, toon(0xffffff, TX.dark), 0, 0.3, -2.3, g); tbox(3.4, 0.3, 1.2, toon(0xffffff, TX.dark), 0, 0, -2.3, g);
  add(new THREE.PlaneGeometry(1.0, 1.0), toon(0xffffff, (() => { const [c, g2] = cv(256, 256); g2.fillStyle = "#c9a24a"; g2.beginPath(); g2.arc(128, 128, 110, 0, 7); g2.fill(); g2.fillStyle = "#6a4026"; g2.font = "900 120px 'DejaVu Sans'"; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText("⚖", 128, 135); return tx(c, false); })()), 0, 2.6, -2.98, g);
  for (const z of [0.6, 1.6]) for (const x of [-1.6, 1.6]) { tbox(2.4, 0.08, 0.45, toon(0xffffff, TX.wood), x, 0.45, z, g); tbox(2.4, 0.6, 0.06, toon(0xffffff, TX.wood), x, 0.5, z - 0.22, g); for (const s of [-1, 1]) tbox(0.06, 0.45, 0.4, toon(0xffffff, TX.dark), x + s * 1.15, 0, z, g); }
  tbox(1.6, 0.05, 0.7, toon(0xffffff, TX.wood), -1.6, 0.75, -0.6, g); tbox(1.6, 0.05, 0.7, toon(0xffffff, TX.wood), 1.6, 0.75, -0.6, g);
  for (const x of [-2.4, 2.4]) { add(new THREE.SphereGeometry(0.1, 10, 8), basic(0xffe0a0), x, 2.8, -2.9, g); mkGlow(0xffc070, 0.9, g).position.set(x, 2.8, -2.85); } }
plight(0xffd8a0, 5, 10, JX, 3.0, 0.5, "crt", true);

// ---------- SET market job (x = 160) ----------
const MX = 160, MKT = room(MX, 7, 6, 3.2, TX.wallCream, TX.floorTiles, 0xe8e8e2);
{ const g = MKT; const cols = [0xe5483b, 0xf2c230, 0x2d6fd0, 0x2fb36a, 0xf08a2c, 0xc94fd0, 0xffffff];
  for (const z of [-1.8, 0.4]) { for (const x of [-1.8, 1.8]) { tbox(2.8, 1.9, 0.55, toon(0xd8d8d0), x, 0, z, g); for (let r = 0; r < 4; r++) { let xx = -1.3; while (xx < 1.3) { const w = 0.12 + rnd() * 0.1, h = 0.18 + rnd() * 0.2; tbox(w, h, 0.3, toon(cols[Math.floor(rnd() * cols.length)]), x + xx + w / 2, 0.1 + r * 0.46, z + 0.15, g); xx += w + 0.02; } } } }
  add(new THREE.PlaneGeometry(2.0, 0.5), toon(0xffffff, sign(["MERCADO BOM PREÇO"], { w: 1024, h: 256, size: 90, bg: "#e5483b", fg: "#ffffff" })), 0, 2.6, -2.98, g);
  for (let i = 0; i < 3; i++) tbox(0.5, 0.35, 0.4, toon(0xb08a5a), -0.3 + i * 0.1, i * 0.35 * 0 + (i === 2 ? 0.35 : 0), 1.3 + (i === 2 ? 0 : i * 0.45), g);
  for (const x of [-2, 0, 2]) { tbox(1.4, 0.05, 0.18, basic(0xf8fbff), x, 3.12, 0, g); } }
plight(0xf4f6ff, 5, 10, MX, 2.8, 0.5, "mkt", true);

// ---------- POV phone with hands (child of the camera) ----------
const PHONE = grp(camera); { const skin = toon(0xd8d4ca), slv = toon(0x232328);
  tbox(0.075, 0.15, 0.008, toon(0x141418), 0, -0.075, 0, PHONE, 1); add(new THREE.PlaneGeometry(0.068, 0.138), basic(0xffffff, phTex), 0, 0, 0.0045, PHONE);
  for (const s of [-1, 1]) { const hand = grp(PHONE, s * 0.04, -0.06, -0.004);
    const palm = add(new THREE.SphereGeometry(0.02, 12, 10), skin, s * 0.006, -0.004, -0.008, hand); palm.scale.set(0.75, 1.3, 0.6);
    for (let k = 0; k < 2; k++) { const f = add(new THREE.CapsuleGeometry(0.005, 0.016, 3, 6), skin, -s * 0.004, 0.022 - k * 0.012, 0.004, hand); f.rotation.z = s * 1.45; }
    const th = add(new THREE.CapsuleGeometry(0.0055, 0.02, 3, 6), skin, -s * 0.006, 0.012, 0.007, hand); th.rotation.z = -s * 0.6;
    const arm = add(new THREE.CylinderGeometry(0.018, 0.022, 0.2, 10), skin, s * 0.012, -0.11, -0.03, hand); arm.rotation.x = -0.45; arm.rotation.z = -s * 0.2;
    const sl = add(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 10), slv, s * 0.03, -0.22, -0.08, hand); sl.rotation.x = -0.45; sl.rotation.z = -s * 0.2; } }
PHONE.position.set(0, -0.005, -0.25);

const PHL = new THREE.PointLight(0x9fd4ff, 0, 1.5, 1.6); camera.add(PHL); PHL.position.set(0, 0, -0.2);

// hero seen from behind (3D), for desk shots
const BACK = grp(scene); { const shirt = toon(0x232328), sk = toon(0xf7f5f0), hairM = toon(0x5e3c22);
  add(new THREE.SphereGeometry(1, 20, 14), shirt, 0, 0.86, 0, BACK).scale.set(0.2, 0.3, 0.13); add(new THREE.CylinderGeometry(0.05, 0.06, 0.08, 12), sk, 0, 1.15, -0.01, BACK);
  add(new THREE.SphereGeometry(0.125, 20, 14), sk, 0, 1.3, -0.01, BACK).scale.set(1, 1.08, 1); for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.03, 10, 8), sk, s * 0.125, 1.29, -0.01, BACK);
  const hair = add(new THREE.SphereGeometry(0.138, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), hairM, 0, 1.31, 0.012, BACK); hair.rotation.x = 0.35;
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, sp = add(new THREE.ConeGeometry(0.035, 0.09, 6), hairM, Math.cos(a) * 0.1, 1.38 + Math.sin(i * 1.7) * 0.03, 0.05 + Math.sin(a) * 0.07, BACK); sp.rotation.set(0.9 + Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.9); }
  for (const s of [-1, 1]) { const up = add(new THREE.CylinderGeometry(0.055, 0.05, 0.26, 10), shirt, s * 0.21, 0.95, -0.04, BACK); up.rotation.set(0.5, 0, s * 0.25);
    const fa = add(new THREE.CylinderGeometry(0.035, 0.032, 0.32, 10), sk, s * 0.2, 0.8, -0.27, BACK); fa.rotation.set(1.45, 0, s * -0.15); add(new THREE.SphereGeometry(0.04, 10, 8), sk, s * 0.17, 0.79, -0.43, BACK).scale.set(1.2, 0.6, 1.4); } }
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } });

// ---------- cast (2D cards) ----------
const OUT = {
  hero: { jacket: "#232328", pants: "#1c1c22", boots: "#2a2a30", hat: "hair", hair: "#5e3c22", skin: "#f7f5f0", buttons: "#3a3a42" },
  heroWork: { jacket: "#2f8a4a", pants: "#1c1c22", boots: "#2a2a30", hat: "hair", hair: "#5e3c22", skin: "#f7f5f0", buttons: "#f2f2f2" },
  mae: { jacket: "#8a6a9a", dress: "#8a6a9a", pants: "#3a3a48", boots: "#5a3a2a", hat: "longhair", hair: "#3a2416", skin: "#c99067" },
  amiga: { jacket: "#e5487a", dress: "#e5487a", pants: "#2a2a30", boots: "#f2f2f2", hat: "longhair", hair: "#e0b450", skin: "#e8c0a0" },
  senhora: { jacket: "#7a5a8a", dress: "#7a5a8a", pants: "#3a3a48", boots: "#5a3a2a", hat: "hair", hair: "#d8d8d8", skin: "#e8c0a0", build: "stout" },
  pol: { jacket: "#2a3a5a", pants: "#1f2a40", boots: "#141414", hat: "cap", cap: "#1f2f5a", skin: "#c99067", buttons: "#c9a24a", build: "stout" },
  pol2: { jacket: "#2a3a5a", pants: "#1f2a40", boots: "#141414", hat: "cap", cap: "#1f2f5a", skin: "#8a5534", buttons: "#c9a24a" },
  delegado: { jacket: "#5a4a3a", pants: "#3a3028", boots: "#2a1a12", hat: "hair", hair: "#9a9a9a", skin: "#e8b48e", build: "stout", moustache: "#6a6a6a" },
  advogado: { jacket: "#3a3f4a", pants: "#2a2e36", boots: "#141414", hat: "hair", hair: "#2a1a12", skin: "#a86b45", buttons: "#e8e8e8" },
  juiz: { jacket: "#141418", pants: "#141418", boots: "#141418", hat: "hair", hair: "#cfcfcf", skin: "#e8c0a0", build: "stout", buttons: "#141418" },
  c1: { jacket: "#5a6a8a", pants: "#2a2a30", boots: "#2a2a30", hat: "cap", cap: "#2a2a30", skin: "#c99067" },
  c2: { jacket: "#8a3a3a", pants: "#2a2a30", boots: "#2a2a30", hat: "hair", hair: "#141414", skin: "#e8c0a0" },
  c3: { jacket: "#3a6a5a", pants: "#2a2a30", boots: "#2a2a30", hat: "longhair", hair: "#5a3a22", skin: "#8a5534" },
  v1: { jacket: "#c9a66b", pants: "#3a3a48", boots: "#5a3a2a", hat: "hair", hair: "#9a9a9a", skin: "#c99067", build: "stout" },
  v2: { jacket: "#6fa8c9", dress: "#6fa8c9", pants: "#3a3a48", boots: "#5a3a2a", hat: "longhair", hair: "#2a1a12", skin: "#e8c0a0" },
};
class Card {
  constructor() { this.c = document.createElement("canvas"); this.c.width = 1200; this.c.height = 2000; this.g = this.c.getContext("2d"); this.tex = tx(this.c, false);
    const geo = new THREE.PlaneGeometry(1.32, 2.2); geo.translate(0, 1.1 - 25 * 0.0022, 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, alphaTest: 0.4 }); this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.renderOrder = 2; scene.add(this.mesh); this.key = "";
    this.mesh.castShadow = true; this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.tex, alphaTest: 0.5 }); }
  draw(key, fn) { if (key === this.key) return; this.key = key; const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 1200, 2000); g.setTransform(2, 0, 0, 2, 0, 0); fn(new T.Pen(g)); this.tex.needsUpdate = true; }
}
const pool = {}; const qz = (v, s = 0.05) => Math.round(v / s) * s;
// small FX cards
class FxCard { constructor() { const [c, g] = cv(512, 512); this.c = c; this.g = g; this.tex = tx(c, false); this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false })); this.mesh.renderOrder = 3; scene.add(this.mesh); this.key = ""; } }
const FXC = Array.from({ length: 5 }, () => new FxCard());
const FXD = {
  tears: (g, t) => { for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const ph = (t * 1.6 + k / 3) % 1; g.globalAlpha = 1 - ph; g.fillStyle = "#8fd0ff"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.ellipse(256 + s * (70 + ph * 40), 200 + ph * 200, 14, 20, 0, 0, 7); g.fill(); g.stroke(); } g.globalAlpha = 1; },
  heart: (g, t) => { const s = 0.8 + 0.2 * Math.sin(t * 8); g.translate(256, 256); g.scale(s, s); g.fillStyle = "#e5483b"; g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.moveTo(0, 120); g.bezierCurveTo(-200, -20, -110, -170, 0, -60); g.bezierCurveTo(110, -170, 200, -20, 0, 120); g.fill(); g.stroke(); },
  money: (g, t) => { for (let k = 0; k < 5; k++) { const ph = (t * 0.5 + k / 5) % 1; g.save(); g.globalAlpha = 1 - ph; g.translate(100 + k * 80 + Math.sin(t * 3 + k) * 20, 460 - ph * 380); g.rotate(Math.sin(t * 2 + k) * 0.5); g.fillStyle = "#5fbf6a"; g.strokeStyle = INK; g.lineWidth = 6; g.fillRect(-50, -26, 100, 52); g.strokeRect(-50, -26, 100, 52); g.fillStyle = INK; g.font = "900 34px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", 0, 2); g.restore(); } },
  knock: (g, t) => { const s = 0.8 + 0.3 * Math.min(1, t * 6); g.translate(256, 256); g.scale(s, s); g.rotate(-0.1); g.font = "900 120px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round"; g.lineWidth = 22; g.strokeStyle = INK; g.strokeText("TOC TOC", 0, 0); g.fillStyle = "#ffffff"; g.fillText("TOC TOC", 0, 0); },
  heartbeat: (g, t) => { const s = 0.75 + 0.25 * Math.abs(Math.sin(t * 7)); g.translate(256, 256); g.scale(s, s); g.fillStyle = "#c0392b"; g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.moveTo(0, 120); g.bezierCurveTo(-200, -20, -110, -170, 0, -60); g.bezierCurveTo(110, -170, 200, -20, 0, 120); g.fill(); g.stroke(); },
  sweat: (g, t) => { const ph = (t * 1.2) % 1; g.globalAlpha = 1 - ph * 0.6; g.fillStyle = "#8fd0ff"; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(256, 150 + ph * 120); g.quadraticCurveTo(300, 260 + ph * 120, 256, 290 + ph * 120); g.quadraticCurveTo(212, 260 + ph * 120, 256, 150 + ph * 120); g.fill(); g.stroke(); g.globalAlpha = 1; },
  backpack: (g, t) => { g.lineJoin = "round"; g.strokeStyle = INK; g.lineWidth = 12; g.fillStyle = "#2d5a8a"; g.beginPath(); g.roundRect(116, 150, 280, 320, 60); g.fill(); g.stroke();
    g.fillStyle = "#24496f"; g.beginPath(); g.roundRect(156, 300, 200, 130, 30); g.fill(); g.stroke(); g.beginPath(); g.moveTo(186, 150); g.quadraticCurveTo(256, 60, 326, 150); g.stroke();
    g.strokeStyle = "#c9a24a"; g.lineWidth = 8; g.beginPath(); g.moveTo(170, 330); g.lineTo(342, 330); g.stroke(); g.fillStyle = "#e8e0d0"; g.fillRect(246, 322, 20, 30); },
  bagOpen: (g, t) => { g.lineJoin = "round"; g.strokeStyle = INK; g.lineWidth = 12; g.fillStyle = "#1e3f63"; g.beginPath(); g.ellipse(256, 230, 200, 70, 0, 0, 7); g.fill(); g.stroke();
    for (let i = 0; i < 9; i++) { const x = 120 + (i % 3) * 92 + (i > 5 ? 20 : 0), y = 170 + Math.floor(i / 3) * 34; g.save(); g.translate(x, y); g.rotate((i % 2 ? 0.12 : -0.1)); g.fillStyle = "#5fbf6a"; g.fillRect(-44, -22, 88, 44); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-44, -22, 88, 44);
      g.fillStyle = "#e8e0d0"; g.fillRect(-8, -22, 16, 44); g.fillStyle = INK; g.font = "900 26px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", -26, 2); g.restore(); }
    g.fillStyle = "#2d5a8a"; g.strokeStyle = INK; g.lineWidth = 12; g.beginPath(); g.moveTo(56, 230); g.quadraticCurveTo(70, 470, 256, 480); g.quadraticCurveTo(442, 470, 456, 230); g.quadraticCurveTo(256, 330, 56, 230); g.fill(); g.stroke();
    const k = 0.5 + 0.5 * Math.sin(t * 6); g.fillStyle = `rgba(255,240,150,${0.25 * k})`; g.beginPath(); g.ellipse(256, 200, 220, 90, 0, 0, 7); g.fill(); },
  receipt: (g, t) => { g.save(); g.translate(256, 256); g.rotate(-0.04); g.fillStyle = "#fbf7ee"; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.rect(-200, -245, 400, 490); g.fill(); g.stroke();
    g.fillStyle = "#2a6fb0"; g.fillRect(-200, -245, 400, 70); g.fillStyle = "#fff"; g.font = "900 34px 'DejaVu Sans'"; g.textAlign = "center"; g.fillText("✚ HOSPITAL SÃO LUCAS", 0, -198);
    g.fillStyle = "#14161c"; g.textAlign = "left"; const L = [["700 26px", "Paciente: Ana, 6 anos"], ["700 26px", "Cirurgia cardíaca"], ["900 34px", "R$ 50.000,00"], ["900 26px", "PAGAMENTO: AMANHÃ"], ["700 24px", "Responsável: Márcio"], ["700 24px", "(11) 9 7302-4418"]];
    L.forEach(([f, x], i) => { g.font = f + " 'DejaVu Sans'"; g.fillStyle = i === 3 ? "#c0392b" : "#14161c"; g.fillText(x, -175, -120 + i * 62); });
    if (t > 0) { const k = Math.min(1, t); g.strokeStyle = "rgba(229,72,59,0.9)"; g.lineWidth = 7; g.beginPath(); g.ellipse(-20, 58, 185 * k, 30, 0, 0, 7); g.stroke(); } g.restore(); },
};
const SCREENS = {};
import("./screens.js").then((m) => Object.assign(SCREENS, m));

// ---------- post: thick brown ink, paper grain, glow ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.03 }, far: { value: 300 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 2.4 * Math.min(W, H) / 1080 }, vig: { value: 0.45 }, sat: { value: 1 }, gain: { value: new THREE.Vector3(1, 1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig, sat; uniform vec2 res; uniform vec3 gain; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.04, 0.10, e) * (1.0 - smoothstep(40.0, 120.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 20.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.8, 0.0); }
      c += bl / 12.0 * 0.9;
      c = mix(c, vec3(0.16, 0.10, 0.07), ink * 0.95);
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, sat); c *= gain;
      float paper = hash(floor(vUv * res / 2.0)) * 0.05 + hash(floor(vUv * res / 9.0)) * 0.04; c *= 0.97 + paper;
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.3, 0.85, length(v * vec2(1.0, 0.8)));
      gl_FragColor = vec4(c, 1.0);
    }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- lighting presets per set ----------
const LP = {
  bed: { hemi: [0x5a6aa0, 0x1a1420, 0.55], bg: 0x0a1028 }, bedDay: { hemi: [0xd8e0f0, 0x6a5a4a, 1.2], bg: 0xcfe0f0 },
  kit: { hemi: [0xffe8c8, 0x6a5040, 1.0], bg: 0xcfe0f0 }, kitNight: { hemi: [0x8a7aa0, 0x2a2028, 0.6], bg: 0x0a1028 },
  caf: { hemi: [0xffe8d0, 0x5a4030, 1.05], bg: 0xcfe0f0 }, scam: { hemi: [0xc8d4ec, 0x3a4048, 0.85], bg: 0x202838 },
  street: { hemi: [0x5a6aa0, 0x141820, 0.6], bg: 0x0d1430 }, streetDawn: { hemi: [0xb0a8d0, 0x4a3a48, 0.95], bg: 0x9aa0c8 }, streetDay: { hemi: [0xfff0d8, 0x6a5a40, 1.3], bg: 0x9fc8e8 },
  fac: { hemi: [0xffe8c8, 0x6a5a40, 1.3], bg: 0xf0c890 }, del: { hemi: [0xd8e0d0, 0x3a4038, 0.9], bg: 0x202820 }, crt: { hemi: [0xffe0c0, 0x4a3020, 0.85], bg: 0x201410 }, mkt: { hemi: [0xf4f6ff, 0x6a6a60, 1.2], bg: 0xffffff },
};
const SETOF = { bed: "bed", bedDay: "bed", kit: "kit", kitNight: "kit", caf: "caf", scam: "scam", street: "street", streetDawn: "street", streetDay: "street", fac: "fac", del: "del", crt: "crt", mkt: "mkt" };
const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe0c0, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 80 }); scene.add(sun); scene.add(sun.target);

// ---------- falling specks + spotlight ----------
const SPECKS = Array.from({ length: 160 }, () => ({ x: rnd(), y: rnd(), s: rnd() < 0.12 ? 3 + rnd() * 3 : 0.8 + rnd() * 1.6, v: 0.04 + rnd() * 0.06, a: 0.35 + rnd() * 0.5, w: rnd() * 6 }));
function overlays(g, st, t) {
  if (st.spot) { const gr = g.createRadialGradient(W * (st.spotX ?? 0.5), H * (st.spotY ?? 0.45), H * 0.12, W * (st.spotX ?? 0.5), H * (st.spotY ?? 0.45), H * 0.75); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${0.92 * st.spot})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  for (const p of SPECKS) { const y = (p.y + t * p.v) % 1, x = (p.x - t * p.v * 0.45 + Math.sin(t * 0.8 + p.w) * 0.004 + 1) % 1; g.globalAlpha = p.a; g.fillStyle = "#ffffff"; const r = p.s * Math.min(W, H) / 1080 * 1.6; g.beginPath(); g.ellipse(x * W, y * H, r * 0.8, r * 1.4, -0.45, 0, 7); g.fill(); } g.globalAlpha = 1;
}

// ---------- render one state ----------
const V = (a) => new THREE.Vector3(...a);
const CHIPS = []; BED.traverse((o) => { if (o.name === "chip") CHIPS.push(o); });
function renderState(st, t) {
  const L = LP[st.light]; hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2] * (st.hemiK ?? 1); scene.background = new THREE.Color(L.bg);
  const set = SETOF[st.light];
  for (const [l, s, i] of LIGHTS) l.intensity = s === set ? i * (st.lightK?.[s] ?? 1) : 0;
  if (st.light === "street") LIGHTS.find((x) => x[1] === "street")[0].intensity = 14;
  const day = ["streetDay", "fac", "bedDay", "streetDawn"].includes(st.light); sun.intensity = day ? (st.light === "streetDawn" ? 0.8 : 2.2) : 0;
  const c = st.cam; camera.position.set(...c.pos); camera.lookAt(V(c.look)); camera.fov = c.fov ?? 40; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  sun.target.position.copy(V(c.look)); sun.position.copy(V(c.look)).add(new THREE.Vector3(-20, 30, 15)); sun.target.updateMatrixWorld();
  // screens
  if (SCREENS.phone) { SCREENS.phone(phG, st.phone || "lock", t, st.scr || {}); phTex.needsUpdate = true; SCREENS.monitor(monG, st.mon || "studio", t, st.scr || {}); monTex.needsUpdate = true; SCREENS.tv(tvG, st.tv || "off", t, st.scr || {}, T, OUT); tvTex.needsUpdate = true; }
  PHONE.visible = !!st.phoneShot; PHL.intensity = 0; if (st.phoneShot) { const p = st.phoneShot; PHONE.position.set(...(p.pos || [0, -0.005, -0.25])); PHONE.rotation.set(...(p.rot || [0, 0, 0])); PHONE.position.x += Math.sin(t * (p.shake ? 41 : 1.3)) * (p.shake ? 0.002 : 0.0015); }
  BACK.visible = !!st.back; if (st.back) { BACK.position.set(...st.back); BACK.rotation.y = st.backYaw ?? 0; }
  CHIPS.forEach((m) => (m.visible = !!st.chips));
  CAR_RED.visible = st.carRed !== false; CAR_DARK.visible = !!st.carDark; CAR_POL.visible = !!st.carPol; KDOOR.rotation.y = (st.kdoor ?? 0) * 1.3;
  // actors
  const used = new Set();
  for (const a of st.actors || []) { const id = a.key || a.id; used.add(id); const C = pool[id] || (pool[id] = new Card());
    C.draw(a.id + JSON.stringify(a.opts, (k, v) => (typeof v === "number" ? qz(v, 0.02) : v)), (p) => T.bodyFront(p, OUT[a.id], a.opts)); C.mesh.visible = true;
    C.mesh.position.set(...a.pos); C.mesh.rotation.set(0, Math.atan2(camera.position.x - a.pos[0], camera.position.z - a.pos[2]), 0); C.mesh.scale.setScalar(a.scale ?? 1); C.mat.color.setRGB(...(a.tint || [1, 1, 1])); }
  for (const k in pool) if (!used.has(k)) pool[k].mesh.visible = false;
  FXC.forEach((f) => (f.mesh.visible = false));
  (st.fx || []).forEach((e, i) => { const f = FXC[i]; const key = e.type + qz(e.t, 0.034); if (key !== f.key) { f.key = key; f.g.setTransform(1, 0, 0, 1, 0, 0); f.g.clearRect(0, 0, 512, 512); FXD[e.type](f.g, e.t); f.tex.needsUpdate = true; }
    f.mesh.visible = true; f.mesh.position.set(...e.pos); f.mesh.lookAt(camera.position); f.mesh.scale.setScalar(e.scale ?? 0.4); });
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.45; post.uniforms.sat.value = st.sat ?? 1; post.uniforms.gain.value.set(...(st.gain || [1, 1, 1]));
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
}
// ---------- big top label ("3 MESES DEPOIS"), pops in with k ----------
function tagText(g, e) { const u = Math.min(W, H) / 1080, k = Math.min(1, e.k ?? 1), sc = k < 1 ? 0.6 + 0.4 * k + 0.15 * Math.sin(k * Math.PI) : 1;
  g.save(); g.globalAlpha = Math.min(1, k * 2); g.translate(W / 2, H * (e.y ?? 0.15)); g.rotate(e.rot ?? -0.03); g.scale(sc, sc); g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  g.font = `900 ${Math.round((e.size || 110) * u)}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = 18 * u; g.strokeStyle = "#140c10"; g.strokeText(e.text, 0, 0); g.fillStyle = e.color || "#ffd23f"; g.fillText(e.text, 0, 0); g.restore(); }
// ---------- end card: question + A/B (poll for the comments) ----------
function endCard(g, e, t) { const k = Math.min(1, e.k), u = Math.min(W, H) / 1080, F = (w, z) => `${w} ${Math.round(z * u)}px "DejaVu Sans", Arial, sans-serif`;
  g.save(); g.fillStyle = `rgba(10,8,14,${0.62 * k})`; g.fillRect(0, 0, W, H); g.globalAlpha = k; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const txt = (s, x, y, z, fill = "#ffffff", w = 900) => { g.font = F(w, z); g.lineWidth = 14 * u; g.strokeStyle = "#140c10"; g.strokeText(s, x, y); g.fillStyle = fill; g.fillText(s, x, y); };
  const pop = (d) => { const q = Math.min(1, Math.max(0, (e.k - d) * 3)); return q <= 0 ? 0 : 1 + 0.12 * Math.sin(q * Math.PI) ; };
  let y = H * 0.27; const sq = pop(0); g.save(); g.translate(W / 2, y); g.scale(sq, sq); (e.q || []).forEach((l, i) => txt(l, 0, i * 112 * u, 96, i === (e.q.length - 1) ? "#ffd23f" : "#ffffff")); g.restore();
  [["A", e.a, "#2fb36a"], ["B", e.b, "#e5483b"]].forEach(([L, s, col], i) => { const sc = pop(0.25 + i * 0.2); if (!sc) return; const by = H * 0.47 + i * 250 * u; g.save(); g.translate(W / 2, by); g.scale(sc, sc);
    const bw = W * 0.84, bh = 190 * u; g.fillStyle = "#140c10"; g.beginPath(); g.roundRect(-bw / 2 + 8 * u, -bh / 2 + 10 * u, bw, bh, 34 * u); g.fill(); g.fillStyle = "#fbf7ee"; g.beginPath(); g.roundRect(-bw / 2, -bh / 2, bw, bh, 34 * u); g.fill(); g.lineWidth = 8 * u; g.strokeStyle = "#140c10"; g.stroke();
    g.fillStyle = col; g.beginPath(); g.arc(-bw / 2 + 105 * u, 0, 66 * u, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.font = F(900, 80); g.fillText(L, -bw / 2 + 105 * u, 4 * u);
    g.fillStyle = "#140c10"; g.textAlign = "left"; const lines = s.split("|"); lines.forEach((l, j) => { g.font = F(900, lines.length > 1 ? 54 : 60); g.fillText(l, -bw / 2 + 200 * u, (j - (lines.length - 1) / 2) * 62 * u + 4 * u); }); g.textAlign = "center"; g.restore(); });
  const bob = Math.sin(t * 5) * 10 * u; if (e.k > 0.75) { g.globalAlpha = Math.min(1, (e.k - 0.75) * 4); txt("COMENTA A OU B", W / 2, H * 0.78, 74); txt("▼", W / 2, H * 0.78 + 100 * u + bob, 74, "#ffd23f"); }
  g.restore(); }
window.renderFrame = async (f) => {
  if (!SCREENS.phone) await import("./screens.js").then((m) => Object.assign(SCREENS, m));
  const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0); overlays(og, S.a, t);
  if (S.b && S.mix > 0) { renderState(S.b, t); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); overlays(og, S.b, t); og.globalAlpha = 1; }
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.a.tag) tagText(og, S.a.tag);
  if (S.end) endCard(og, S.end, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.94);
};
window.TOTAL = TOTAL; window.ready = true;
