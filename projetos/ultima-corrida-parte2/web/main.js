// "A Última Corrida" (Parte 1): toon world + canvas cards, rendered frame by frame.
import * as THREE from "./three.module.js";
import * as P from "./paint.js";
import * as T from "./toon.js";
import { SHOTS, shotAt, FPS, TOTAL } from "./story.js";

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 720), H = +(q.get("h") || 1280);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 400);

// ---------- toon materials ----------
const gradMap = (() => {
  const d = new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const toon = (color, map, extra = {}) => new THREE.MeshToonMaterial({ color, map: map || null, gradientMap: gradMap, ...extra });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });

const TEXEL = 2.2; // metres per texture repeat
/** box with constant texel density (UVs scaled per face) */
function tbox(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, density = TEXEL) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / density, uv.getY(i) * dims[f][1] / density);
  }
  const m = new THREE.Mesh(g, mat); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
function plane(w, h, mat, x, y, z, rx = 0, ry = 0, parent = scene, density = TEXEL) {
  const g = new THREE.PlaneGeometry(w, h);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / density, uv.getY(i) * h / density);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); parent.add(m); return m;
}

// ---------- textures ----------
const TX = {
  asphalt: P.asphalt(), dirt: P.dirt(), line: P.roadLine(),
  plasterA: P.plaster("#8c8a7a", { damp: true, brick: true, cracks: 5 }), plasterB: P.plaster("#7a8a86", { damp: true, cracks: 4 }),
  plasterC: P.plaster("#9a7f6a", { damp: true, brick: true }), plasterLit: P.plaster("#c9b48f", { cracks: 2 }),
  plasterCity: P.plaster("#b9a98a", { cracks: 1 }),
  planks: P.planks("#6b5236", { rot: true }), plankV: P.planks("#5b4430", { vertical: true, n: 5 }), door: P.planks("#5e2c22", { vertical: true, n: 4 }),
  roof: P.roofTiles("#8a4a36"), floor: P.tiles("#6e5a46", "#57483a"),
  wall: P.wallpaper("#6c7a5a", "#5a6649"), ceiling: P.plaster("#4a4238", { cracks: 2 }), wood: P.planks("#7a5232", { n: 4 }),
};

// ---------- sky ----------
const skyC = document.createElement("canvas"); skyC.width = 8; skyC.height = 256;
{ const g = skyC.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, "#05070f"); gr.addColorStop(0.45, "#0d1430"); gr.addColorStop(0.62, "#1c2850"); gr.addColorStop(1, "#1c2850");
  g.fillStyle = gr; g.fillRect(0, 0, 8, 256); }
const skyTex = P.tex(skyC, false);
const sky = add(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false }));
const starGeo = new THREE.BufferGeometry(); { const a = []; let s = 3;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 700; i++) { const th = r() * 6.28, ph = 0.08 + r() * 1.3, R = 280; a.push(R * Math.cos(ph) * Math.cos(th), R * Math.sin(ph), R * Math.cos(ph) * Math.sin(th)); }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(a, 3)); }
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 1.6, sizeAttenuation: false, fog: false }));
scene.add(stars);
const moonC = document.createElement("canvas"); moonC.width = moonC.height = 256;
{ const g = moonC.getContext("2d"); const gr = g.createRadialGradient(128, 128, 40, 128, 128, 128);
  gr.addColorStop(0, "rgba(220,230,255,0.5)"); gr.addColorStop(1, "rgba(220,230,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#eef1ff"; g.beginPath(); g.arc(128, 128, 52, 0, 7); g.fill();
  g.fillStyle = "#cfd5ea"; for (const [x, y, r] of [[110, 112, 12], [146, 140, 9], [124, 150, 6]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }
const moon = add(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ map: P.tex(moonC, false), transparent: true, fog: false, depthWrite: false }), -60, 110, -230);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0x5068a8, 0x141820, 1.2); scene.add(hemi);
const moonL = new THREE.DirectionalLight(0xa8b8ff, 1.0); moonL.position.set(-30, 40, 20); scene.add(moonL);
const headL = new THREE.SpotLight(0xfff0c0, 0, 40, 0.42, 0.6, 1.2); scene.add(headL); scene.add(headL.target);
const povL = new THREE.SpotLight(0xfff0c0, 0, 40, 0.5, 0.6, 1.2); scene.add(povL); scene.add(povL.target);
const houseL = new THREE.PointLight(0xffa860, 0, 14, 1.4); houseL.position.set(9, 1.6, -62); scene.add(houseL);
const porchL = new THREE.PointLight(0xffa860, 0, 8, 1.6); porchL.position.set(5.2, 1.2, -62); scene.add(porchL);
const pendL = new THREE.PointLight(0xffb070, 0, 12, 1.3); pendL.position.set(300.6, 2.25, 0.3); scene.add(pendL);
const kitL = new THREE.PointLight(0x9fffc8, 0, 7, 1.4); kitL.position.set(302.3, 1.8, -5.0); scene.add(kitL);
const fillL = new THREE.PointLight(0xffb070, 0, 9, 1.5); fillL.position.set(299, 1.6, 2.5); scene.add(fillL);

// ---------- world: street ----------
const ground = plane(500, 500, toon(0xffffff, TX.dirt), 0, 0, 0, -Math.PI / 2, 0, scene, 4); ground.position.y = -0.01;
plane(6.4, 260, toon(0xffffff, TX.asphalt), 0, 0.005, -40, -Math.PI / 2, 0, scene, 4);
{ const m = toon(0xffffff, TX.line); m.map = TX.line.clone(); m.map.repeat.set(1, 260 / 6); m.map.needsUpdate = true;
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 260), new THREE.MeshToonMaterial({ color: 0xffffff, map: m.map, gradientMap: gradMap }));
  pl.rotation.x = -Math.PI / 2; pl.position.set(0, 0.012, -40); scene.add(pl); }
for (const s of [-1, 1]) tbox(1.8, 0.16, 260, toon(0x8a877c, TX.plasterB), s * 4.1, 0, -40);

const LAMPS = [];
function lamp(x, z, lit, lean = 0, broken = false) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const side = Math.sign(x) || 1;
  const pole = new THREE.Group(); g.add(pole); pole.rotation.z = lean * side;
  add(new THREE.CylinderGeometry(0.07, 0.1, 5, 8), toon(0x3b3f48), 0, 2.5, 0, pole);
  tbox(1.3, 0.08, 0.08, toon(0x3b3f48), -side * 0.6, 4.9, 0, pole);
  const head = add(new THREE.CylinderGeometry(0.12, 0.3, 0.22, 10), toon(0x2c2f36), -side * 1.2, 4.86, 0, pole);
  if (!broken) add(new THREE.SphereGeometry(0.16, 10, 6), lit ? glow(0xfff1b0) : toon(0x55585e), -side * 1.2, 4.72, 0, pole);
  if (lit) { // fake pool of light on the road
    const c = document.createElement("canvas"); c.width = c.height = 128; const gg = c.getContext("2d");
    const gr = gg.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,220,140,0.55)"); gr.addColorStop(1, "rgba(255,220,140,0)");
    gg.fillStyle = gr; gg.fillRect(0, 0, 128, 128);
    const pool = add(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({ map: P.tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), x - side * 1.2, 0.03, z);
    pool.rotation.x = -Math.PI / 2;
    const halo = add(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: P.tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), -side * 1.2, 4.7, 0, pole);
    LAMPS.push(halo);
  }
  return g;
}
const HALOS = [];
function house(x, z, opts = {}) {
  const side = Math.sign(x), g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const w = opts.w ?? 7, d = 6, h = opts.h ?? 3.2, wt = 0.22;
  const wallMat = toon(0xffffff, opts.tex ?? TX.plasterA);
  const fx = -side * d / 2; // front wall local x
  // side + back walls
  tbox(d, h, wt, wallMat, 0, 0, w / 2, g); tbox(d, h, wt, wallMat, 0, 0, -w / 2, g);
  tbox(wt, h, w, wallMat, side * d / 2, 0, 0, g);
  // front wall with door (at local z=0.6) and window (z=-1.8)
  const door = { z0: 0.1, z1: 1.2, h: 2.1 }, win = { z0: -2.6, z1: -1.2, y0: 1.0, y1: 2.1 };
  const seg = (z0, z1, y0, y1) => tbox(wt, y1 - y0, z1 - z0, wallMat, fx, y0, (z0 + z1) / 2, g);
  seg(-w / 2, win.z0, 0, h); seg(win.z1, door.z0, 0, h); seg(door.z1, w / 2, 0, h);
  seg(win.z0, win.z1, 0, win.y0); seg(win.z0, win.z1, win.y1, h); seg(door.z0, door.z1, door.h, h);
  // window
  const wm = opts.lit ? glow(0xffc070) : toon(0x0b0d12);
  const wp = plane(win.z1 - win.z0, win.y1 - win.y0, wm, fx + side * 0.06, (win.y0 + win.y1) / 2, (win.z0 + win.z1) / 2, 0, -side * Math.PI / 2, g);
  if (opts.lit) { // curtain silhouettes + glow halo
    for (const s of [-1, 1]) plane(0.35, 1.1, glow(0x7a3a2a), fx + side * 0.04, 1.55, (win.z0 + win.z1) / 2 + s * 0.52, 0, -side * Math.PI / 2, g);
    const c = document.createElement("canvas"); c.width = c.height = 128; const gg = c.getContext("2d");
    const gr = gg.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,190,110,0.5)"); gr.addColorStop(1, "rgba(255,190,110,0)");
    gg.fillStyle = gr; gg.fillRect(0, 0, 128, 128);
    const hl = plane(4.5, 3.5, new THREE.MeshBasicMaterial({ map: P.tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
      fx - side * 0.15, 1.55, (win.z0 + win.z1) / 2, 0, -side * Math.PI / 2, g);
    HALOS.push(hl);
  } else if (opts.boards !== false) { // boarded window
    for (const a of [0.5, -0.4]) { const b = tbox(wt * 0.4, 0.16, 1.7, toon(0xffffff, TX.planks), fx - side * 0.1, 1.45, (win.z0 + win.z1) / 2, g); b.rotation.x = a; }
  }
  // door
  let doorPivot = null;
  if (opts.door !== false) {
    doorPivot = new THREE.Group(); doorPivot.position.set(fx, 0, door.z1); g.add(doorPivot);
    const dm = tbox(0.08, door.h, door.z1 - door.z0, toon(0xffffff, TX.door), 0, 0, -(door.z1 - door.z0) / 2, doorPivot, 1.2);
    add(new THREE.SphereGeometry(0.045, 8, 6), toon(0xc9a24a), -side * 0.07, 1.0, -(door.z1 - door.z0) + 0.12, doorPivot);
    // dark interior behind the door
    plane(door.z1 - door.z0, door.h, opts.lit ? glow(0xffa860) : toon(0x07080c), fx + side * 0.5, door.h / 2, (door.z0 + door.z1) / 2, 0, -side * Math.PI / 2, g);
    if (opts.openDoor) doorPivot.rotation.y = side * 1.2;
  }
  // roof (gable along z) or ruined top
  if (opts.roof !== false) {
    const rm = toon(0xffffff, TX.roof), pitch = 0.5, half = d / 2 + 0.4, rl = half / Math.cos(pitch);
    for (const s of [-1, 1]) { const r = tbox(rl, 0.14, w + 0.6, rm, 0, 0, 0, g); r.position.set(s * half / 2, h + Math.tan(pitch) * half / 2, 0); r.rotation.z = -s * pitch; }
    const tri = new THREE.Shape([new THREE.Vector2(-d / 2, 0), new THREE.Vector2(d / 2, 0), new THREE.Vector2(0, Math.tan(pitch) * d / 2)]);
    for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), wallMat); m.position.set(0, h, s * w / 2); if (s < 0) m.rotation.y = Math.PI; g.add(m); }
  } else { // broken beams sticking up
    for (const [bz, a] of [[-1.5, 0.5], [1.2, -0.35], [2.6, 0.2]]) { const b = tbox(d * 0.9, 0.18, 0.18, toon(0xffffff, TX.planks), 0, h - 0.1, bz, g); b.rotation.z = a * side; }
  }
  return { g, doorPivot };
}
// city part (lit, normal) z > 6
for (let z = 14; z < 110; z += 11) { house(-9, z, { lit: true, tex: TX.plasterCity, boards: false }); house(9, z + 5, { lit: true, tex: TX.plasterLit, boards: false }); }
for (let z = 12; z < 110; z += 16) { lamp(-5, z, true); lamp(5, z + 8, true); }
// far city skyline glow
for (let i = 0; i < 26; i++) { const x = -80 + i * 6.5, h = 8 + ((i * 37) % 23); tbox(5.5, h, 5, toon(0x1a2238), x, 0, 170 + (i % 3) * 6); }
// abandoned neighbourhood z < 0
const roofless = new Set([-24, -46]);
const HOUSES = {};
for (const [x, z, o] of [[-9, -8, { tex: TX.plasterB }], [9, -10, { tex: TX.plasterA }], [-9, -19, { tex: TX.plasterC }], [9, -24, { tex: TX.plasterB, roof: false }],
  [-9, -31, { tex: TX.plasterA }], [9, -37, { tex: TX.plasterC, door: true, openDoor: true }], [-9, -44, { tex: TX.plasterB, roof: false }], [9, -49, { tex: TX.plasterA }],
  [-9, -56, { tex: TX.plasterC }], [-9, -68, { tex: TX.plasterA }], [9, -74, { tex: TX.plasterB }]]) HOUSES[z] = house(x, z, o);
const JH = house(9, -62.6, { tex: TX.plasterC, lit: true, boards: false }); // Júlia's house: door at world z = -62.6+0.65
const JDOOR = JH.doorPivot;
lamp(-5, -6, false); lamp(5, -16, false, 0, true); const BROKEN = lamp(-5, -12, false, 0.32, true); lamp(-5, -40, false); lamp(5, -52, false, -0.1);
// gate sign at the entrance
{ const g = new THREE.Group(); g.position.set(0, 0, 0.5); scene.add(g);
  for (const s of [-1, 1]) tbox(0.25, 4.4, 0.25, toon(0x4a3a2c, TX.plankV), s * 3.6, 0, 0, g);
  const sign = add(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshToonMaterial({ map: P.signText(["VILA ESPERANÇA"], { size: 104, rust: true }), gradientMap: gradMap }), 0, 3.65, 0.14, g);
  sign.rotation.z = -0.07;
  tbox(4.2, 0.12, 0.12, toon(0x2c2f36), 0, 4.25, 0.1, g);
}
// doghouse with a loose chain and a tipped bowl (left side, z -34)
{ const g = new THREE.Group(); g.position.set(-5.4, 0, -34); g.rotation.y = 0.5; scene.add(g);
  const m = toon(0xffffff, TX.planks);
  tbox(1.2, 0.9, 1.1, m, 0, 0, 0, g);
  for (const s of [-1, 1]) { const r = tbox(0.8, 0.07, 1.25, toon(0xffffff, TX.roof), s * 0.32, 1.05, 0, g); r.rotation.z = -s * 0.6; }
  plane(0.5, 0.6, toon(0x050608), 0.61, 0.32, 0, 0, Math.PI / 2, g);
  for (let i = 0; i < 9; i++) { const l = add(new THREE.TorusGeometry(0.06, 0.018, 6, 10), toon(0x8b8f96), 0.75 + i * 0.11, 0.03, 0.15 + Math.sin(i) * 0.12, g); l.rotation.x = Math.PI / 2; l.rotation.z = i % 2 ? 0.8 : 0; }
  const bowl = add(new THREE.CylinderGeometry(0.16, 0.11, 0.1, 14), toon(0xa53a33), 1.5, 0.08, -0.4, g); bowl.rotation.z = 1.3;
  const sign = add(new THREE.PlaneGeometry(0.7, 0.24), new THREE.MeshToonMaterial({ map: P.signText(["REX"], { w: 512, h: 170, size: 100, bg: "#7a5a3a" }), gradientMap: gradMap }), 0.62, 0.78, 0, g);
  sign.rotation.y = Math.PI / 2;
}
// tumbleweed-ish bushes / debris
for (let i = 0; i < 18; i++) { const z = -4 - i * 4.1, x = (i % 2 ? 1 : -1) * (5.3 + (i % 3) * 0.4);
  add(new THREE.IcosahedronGeometry(0.35 + (i % 4) * 0.12, 0), toon(i % 3 ? 0x2f4426 : 0x3e5530), x, 0.2, z); }

// ---------- motorbike ----------
const BIKE = new THREE.Group(); scene.add(BIKE);
const WHEELS = [];
{ const tire = toon(0x1b1d22), rim = toon(0x9aa2ad), red = toon(0xc8302c), dark = toon(0x262a33);
  for (const z of [-0.68, 0.68]) { const w = new THREE.Group(); w.position.set(0, 0.33, z); BIKE.add(w); WHEELS.push(w);
    const t = add(new THREE.TorusGeometry(0.26, 0.075, 8, 20), tire, 0, 0, 0, w); t.rotation.y = Math.PI / 2;
    const h = add(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 10), rim, 0, 0, 0, w); h.rotation.z = Math.PI / 2;
    for (let k = 0; k < 3; k++) { const s = tbox(0.03, 0.44, 0.03, rim, 0, -0.22, 0, w); s.rotation.x = (k * Math.PI) / 3; s.position.y = 0; } }
  const body = tbox(0.32, 0.3, 0.9, red, 0, 0.5, -0.05, BIKE); body.rotation.x = 0.08;
  tbox(0.28, 0.12, 0.62, toon(0x15161a), 0, 0.78, 0.25, BIKE); // seat
  tbox(0.36, 0.22, 0.42, red, 0, 0.72, -0.32, BIKE); // tank
  const fork = tbox(0.06, 0.75, 0.06, rim, 0, 0.3, -0.68, BIKE); fork.rotation.x = -0.35; fork.position.z = -0.6;
  tbox(0.8, 0.05, 0.05, dark, 0, 0.98, -0.55, BIKE); // handlebar
  const hl = add(new THREE.CylinderGeometry(0.11, 0.09, 0.1, 14), glow(0xfff4c8), 0, 0.95, -0.66, BIKE); hl.rotation.x = Math.PI / 2;
  // delivery box
  const box = tbox(0.55, 0.5, 0.5, red, 0, 0.88, 0.62, BIKE);
  tbox(0.57, 0.06, 0.52, toon(0x8e1e1c), 0, 1.38, 0.62, BIKE);
  // phone holder + phone
  const ph = new THREE.Group(); ph.position.set(-0.26, 1.12, -0.5); ph.rotation.x = -0.45; BIKE.add(ph);
  tbox(0.09, 0.17, 0.012, toon(0x111216), 0, -0.085, 0, ph);
  BIKE.userData.phone = ph;
  // headlight beam (fake volumetric cone)
  const c = document.createElement("canvas"); c.width = 64; c.height = 256; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,240,190,0)"); gr.addColorStop(1, "rgba(255,240,190,0.28)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const beam = add(new THREE.ConeGeometry(1.6, 9, 20, 1, true), new THREE.MeshBasicMaterial({ map: P.tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }), 0, 0.95, -5.2, BIKE);
  beam.rotation.x = -Math.PI / 2 - 0.06;
  BIKE.userData.beam = beam;
}
const phoneScreenC = document.createElement("canvas"); phoneScreenC.width = 360; phoneScreenC.height = 720;
const phoneScreenTex = P.tex(phoneScreenC, false);
const appC = P.phoneApp();
{ const scr = add(new THREE.PlaneGeometry(0.078, 0.156), new THREE.MeshBasicMaterial({ map: phoneScreenTex, fog: false }), 0, -0.085, 0.007, BIKE.userData.phone); }
const HPHONE = new THREE.Group(); scene.add(HPHONE);
tbox(0.09, 0.17, 0.012, toon(0x111216), 0, -0.085, 0, HPHONE);
add(new THREE.PlaneGeometry(0.078, 0.156), new THREE.MeshBasicMaterial({ map: phoneScreenTex, fog: false }), 0, 0, 0.007, HPHONE);
for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.03, 8, 6), toon(0x1c1f26), s * 0.05, -0.04, 0.0, HPHONE); // gloved fingers

// ---------- world: interior (offset x = 300) ----------
const IX = 300;
const ROOM = new THREE.Group(); scene.add(ROOM);
let IDOOR, KEY, KITCH, TRAPGLOW, CHAIR, MYBAG, PEND, TRAP, RUG;
{ const R = ROOM, wallM = toon(0xffffff, TX.wall);
  plane(8, 8, toon(0xffffff, TX.floor), IX, 0.001, 0, -Math.PI / 2, 0, R, 2.4);
  plane(8, 8, toon(0xffffff, TX.ceiling), IX, 2.8, 0, Math.PI / 2, 0, R);
  tbox(0.2, 2.8, 8, wallM, IX - 4, 0, 0, R); tbox(0.2, 2.8, 8, wallM, IX + 4, 0, 0, R);
  // front wall z=+4 with the front door at x=IX+0.5
  tbox(4.0, 2.8, 0.2, wallM, IX - 1.95, 0, 4, R); tbox(3.0, 2.8, 0.2, wallM, IX + 2.5, 0, 4, R); tbox(1.0, 0.7, 0.2, wallM, IX + 0.5, 2.1, 4, R);
  IDOOR = new THREE.Group(); IDOOR.position.set(IX + 0.01, 0, 3.92); R.add(IDOOR);
  plane(1.0, 2.1, toon(0x0b1020), IX + 0.5, 1.05, 4.12, 0, Math.PI, R); // night outside the doorway
  tbox(0.98, 2.1, 0.08, toon(0xffffff, TX.door), 0.49, 0, 0, IDOOR, 1.2);
  add(new THREE.SphereGeometry(0.04, 8, 6), toon(0xc9a24a), 0.87, 1.0, -0.06, IDOOR);
  tbox(0.12, 0.16, 0.04, toon(0xb08a3a), 0.87, 1.12, -0.06, IDOOR); // lock plate
  KEY = new THREE.Group(); KEY.position.set(0.87, 1.2, -0.09); IDOOR.add(KEY);
  tbox(0.012, 0.07, 0.012, toon(0xd8c26a), 0, -0.035, 0, KEY);
  add(new THREE.TorusGeometry(0.028, 0.009, 6, 14), toon(0xd8c26a), 0, -0.005 + 0.07, 0, KEY);
  KEY.rotation.z = 0;
  // back wall z=-4 with the kitchen doorway at x=IX+2.3
  tbox(5.7, 2.8, 0.2, wallM, IX - 1.15, 0, -4, R); tbox(1.0, 2.8, 0.2, wallM, IX + 3.5, 0, -4, R); tbox(1.1, 0.7, 0.2, wallM, IX + 2.3, 2.1, -4, R);
  // kitchen behind: cold tiles, fridge
  plane(3, 3, toon(0xffffff, P.tiles("#c9d6cf", "#a9b8b0")), IX + 2.3, 0.002, -5.5, -Math.PI / 2, 0, R, 1.2);
  tbox(3, 2.8, 0.2, toon(0x8fa59a), IX + 2.3, 0, -7, R); tbox(0.2, 2.8, 3, toon(0x8fa59a), IX + 3.8, 0, -5.5, R); tbox(0.2, 2.8, 3, toon(0x8fa59a), IX + 0.8, 0, -5.5, R);
  tbox(0.8, 1.8, 0.7, toon(0xd9dfdc), IX + 3.1, 0, -6.4, R);
  KITCH = add(new THREE.PlaneGeometry(0.6, 0.06), glow(0xd8ffe8), IX + 2.3, 2.7, -5.5, R); KITCH.rotation.x = Math.PI / 2;
  // helmet wall (x = IX-4): two rows of hooks
  const cols = [0xd33a32, 0x2d6fd0, 0xf2c230, 0x1f1f24, 0xe8e8e8, 0x2f9a5a, 0xf08a2c, 0x8e44ad, 0xc0392b, 0x34495e];
  let i = 0;
  for (const y of [2.15, 1.6, 1.05]) for (let z = 2.9; z >= -3.0; z -= 0.62) {
    const g = new THREE.Group(); g.position.set(IX - 3.72, y, z + (y === 1.6 ? 0.31 : 0)); R.add(g);
    tbox(0.18, 0.03, 0.03, toon(0x2a2a2a), -0.06, 0.2, 0, g);
    const c = cols[i++ % cols.length];
    const dome = add(new THREE.SphereGeometry(0.19, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), toon(c), 0, 0, 0, g);
    dome.rotation.z = -0.25;
    const vis = add(new THREE.SphereGeometry(0.195, 16, 6, -0.9, 1.8, Math.PI * 0.36, Math.PI * 0.14), toon(0x2b3442, null, { side: THREE.DoubleSide }), 0.005, 0, 0, g);
    vis.rotation.y = Math.PI / 2; vis.rotation.z = -0.25;
    add(new THREE.TorusGeometry(0.17, 0.015, 6, 20, Math.PI), toon(0x1a1a1a), 0, -0.05, 0, g).rotation.set(0, Math.PI / 2, Math.PI);
  }
  // table + chairs
  const wood = toon(0xffffff, TX.wood);
  tbox(1.9, 0.07, 1.0, wood, IX + 1.2, 0.74, 0.2, R, 1.2);
  for (const [dx, dz] of [[-0.85, -0.42], [0.85, -0.42], [-0.85, 0.42], [0.85, 0.42]]) tbox(0.07, 0.74, 0.07, wood, IX + 1.2 + dx, 0, 0.2 + dz, R);
  const chair = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; R.add(g);
    tbox(0.46, 0.05, 0.46, wood, 0, 0.45, 0, g, 1.2); for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) tbox(0.05, 0.45, 0.05, wood, a, 0, b, g);
    tbox(0.46, 0.55, 0.05, wood, 0, 0.5, -0.21, g, 1.2); return g; };
  CHAIR = chair(IX + 1.2, -0.65, 0); chair(IX + 1.2, 1.05, Math.PI);
  // three sealed delivery bags with dated receipts
  const bagM = toon(0xc9a36a), seal = toon(0xd8333a);
  [["14/03/26", 4471, 0.55], ["02/07/26", 5108, 0.95], ["21/09/26", 6032, 1.35]].forEach(([d, n, x], k) => {
    const g = new THREE.Group(); g.position.set(IX + x, 0.775, 0.32); g.rotation.y = (k - 1) * 0.08; R.add(g);
    tbox(0.34, 0.3, 0.28, bagM, 0, 0, 0, g, 0.8);
    tbox(0.36, 0.035, 0.3, toon(0xa8864f), 0, 0.12, 0, g);
    tbox(0.07, 0.07, 0.01, seal, 0, 0.2, 0.145, g);
    add(new THREE.PlaneGeometry(0.13, 0.163), new THREE.MeshToonMaterial({ map: P.receipt(d, n), gradientMap: gradMap }), 0.085, 0.09, 0.143, g);
  });
  MYBAG = new THREE.Group(); R.add(MYBAG);
  tbox(0.34, 0.3, 0.28, bagM, 0, 0, 0, MYBAG, 0.8); tbox(0.36, 0.035, 0.3, toon(0xa8864f), 0, 0.12, 0, MYBAG); tbox(0.07, 0.07, 0.01, seal, 0, 0.2, 0.145, MYBAG);
  MYBAG.visible = false;
  // a steaming pot
  add(new THREE.CylinderGeometry(0.16, 0.14, 0.18, 16), toon(0x6c7480), IX + 1.85, 0.865, 0.0, R);
  // pendant lamp
  PEND = new THREE.Group(); PEND.position.set(IX + 0.6, 2.8, 0.3); R.add(PEND);
  tbox(0.01, 0.45, 0.01, toon(0x111111), 0, -0.45, 0, PEND);
  add(new THREE.ConeGeometry(0.28, 0.22, 16, 1, true), toon(0x2f4a3a, null, { side: THREE.DoubleSide }), 0, -0.55, 0, PEND);
  add(new THREE.SphereGeometry(0.07, 10, 6), glow(0xffe0a0), 0, -0.62, 0, PEND);
  // rug + trapdoor peeking out, faint glow from the gap
  const rc = document.createElement("canvas"); rc.width = 512; rc.height = 340; { const g = rc.getContext("2d");
    g.fillStyle = "#7a2a24"; g.fillRect(0, 0, 512, 340); g.strokeStyle = "#d9a441"; g.lineWidth = 12; g.strokeRect(24, 24, 464, 292);
    g.fillStyle = "#4e1a18"; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(256, 170, 200 - k * 36, 120 - k * 22, 0, 0, 7); g.fill(); g.fillStyle = k % 2 ? "#4e1a18" : "#9a3a30"; } }
  TRAP = tbox(1.1, 0.02, 1.1, toon(0xffffff, P.planks("#4a3424", { n: 5 })), IX - 1.4, 0, 1.75, R, 1.1);
  TRAP.rotation.y = 0.15;
  TRAPGLOW = tbox(1.1, 0.025, 0.035, glow(0x8dff9e), IX - 1.42, 0, 2.31, R); TRAPGLOW.rotation.y = 0.15;
  RUG = plane(1.9, 1.3, toon(0xffffff, P.tex(rc, false)), IX - 1.0, 0.03, 1.1, -Math.PI / 2, 0, R, 99);
  RUG.rotation.z = 0.25; { const uv = RUG.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 99 / 1.9, uv.getY(k) * 99 / 1.3); }
  // window with curtains (right wall)
  plane(1.2, 1.1, toon(0x0a0d18), IX + 3.88, 1.6, 1.5, 0, -Math.PI / 2, R);
  for (const s of [-1, 1]) plane(0.45, 1.5, toon(0x6b2230), IX + 3.86, 1.5, 1.5 + s * 0.55, 0, -Math.PI / 2, R);
  // little side cabinet with a framed photo
  tbox(0.9, 0.8, 0.4, wood, IX + 3.5, 0, -2.4, R, 1.2);
}

// ---------- cards (characters + effects) ----------
const SU = 0.0022;
class Card {
  constructor(cw = 600, ch = 1000, su = SU) {
    this.c = document.createElement("canvas"); this.c.width = cw * 2; this.c.height = ch * 2; this.g = this.c.getContext("2d");
    this.tex = P.tex(this.c, false);
    const geo = new THREE.PlaneGeometry(cw * su, ch * su); geo.translate(0, ch * su / 2 - (ch - 975) * su * (ch === 1000 ? 1 : 0), 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: ch === 1000, alphaTest: ch === 1000 ? 0.4 : 0.02, fog: false });
    this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.renderOrder = 2; scene.add(this.mesh); this.key = ""; this.cw = cw; this.ch = ch;
    // contact blob
    const bc = document.createElement("canvas"); bc.width = bc.height = 64; const bg = bc.getContext("2d"); const gr = bg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); bg.fillStyle = gr; bg.fillRect(0, 0, 64, 64);
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ map: P.tex(bc, false), transparent: true, depthWrite: false }));
    this.blob.rotation.x = -Math.PI / 2; scene.add(this.blob);
  }
  draw(key, fn) {
    if (key === this.key) return; this.key = key;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.c.width, this.c.height); g.setTransform(2, 0, 0, 2, 0, 0);
    fn(new T.Pen(g), g); this.tex.needsUpdate = true;
  }
  place(x, y, z, cam, opts = {}) {
    this.mesh.visible = true; this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, Math.atan2(cam.x - x, cam.z - z), opts.roll || 0);
    const s = opts.scale ?? 1; this.mesh.scale.set(s * (opts.sx ?? 1), s * (opts.sy ?? 1), 1);
    this.mat.color.setRGB(...(opts.tint || [1, 1, 1]));
    this.blob.visible = opts.blob !== false; this.blob.position.set(x, (opts.floor ?? y) + 0.02, z);
  }
  hide() { this.mesh.visible = false; this.blob.visible = false; }
}
const MOTO = { jacket: "#e0533a", pants: "#2f3a4f", boots: "#1c1f26", hat: "helmet", cap: "#f2c230", skin: "#e8b48e" };
const JULIA = { jacket: "#8e1f3a", dress: "#8e1f3a", pants: "#3a2a30", boots: "#2a1a1e", hat: "longhair", hair: "#2a1a1e", skin: "#f3d6c2" };
const cards = { moto: new Card(), julia: new Card(600, 1000, 0.00212) };
const fxCards = []; for (let i = 0; i < 6; i++) { const c = new Card(512, 512, 0.002); c.blob.visible = false; fxCards.push(c); }
const qz = (v, s = 0.05) => Math.round(v / s) * s;
const actorKey = (o) => JSON.stringify(o, (k, v) => typeof v === "number" ? qz(v, 0.02) : v);

const FX_DRAW = {
  horn: (p, g, t) => { g.lineCap = "round"; for (let i = 0; i < 3; i++) { const r = 60 + i * 55 + t * 40, a = Math.max(0, 1 - t * 0.8 - i * 0.12);
      g.globalAlpha = a; g.strokeStyle = "#241726"; g.lineWidth = 26; g.beginPath(); g.arc(120, 256, r, -0.7, 0.7); g.stroke();
      g.strokeStyle = "#ffe066"; g.lineWidth = 14; g.beginPath(); g.arc(120, 256, r, -0.7, 0.7); g.stroke(); } g.globalAlpha = 1; },
  wisp: (p, g, t, col) => { g.lineCap = "round";
    for (let k = 0; k < 3; k++) { const x0 = 160 + k * 90, ph = t * 3 + k * 2; g.globalAlpha = 0.75;
      g.strokeStyle = col; g.lineWidth = 20; g.beginPath();
      for (let y = 480; y > 60; y -= 12) { const x = x0 + Math.sin(y / 50 + ph) * 26 * (1 - y / 600); if (y === 480) g.moveTo(x, y); else g.lineTo(x, y); }
      g.stroke(); } g.globalAlpha = 1; },
  bang: (p, g, t) => { const s = 1 + 0.15 * Math.sin(t * 20); g.translate(256, 256); g.scale(s, s);
    g.fillStyle = "#ffe066"; g.strokeStyle = "#241726"; g.lineWidth = 16; g.beginPath();
    for (let i = 0; i < 20; i++) { const a = (i / 20) * 6.283, r = i % 2 ? 110 : 220; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#241726"; g.font = "900 150px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("!", 0, 8); },
  click: (p, g, t) => { g.strokeStyle = "#241726"; g.lineWidth = 18; g.lineCap = "round"; const r0 = 70 + t * 160;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; g.globalAlpha = Math.max(0, 1 - t * 1.4); g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * (r0 + 70), 256 + Math.sin(a) * (r0 + 70)); g.stroke(); }
    g.globalAlpha = 1; },
  key: (p, g, t) => { g.translate(256, 256); g.lineJoin = "round";
    g.fillStyle = "#e8c860"; g.strokeStyle = "#241726"; g.lineWidth = 14;
    g.beginPath(); g.arc(0, -120, 70, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#241726"; g.beginPath(); g.arc(0, -120, 26, 0, 7); g.fill();
    g.fillStyle = "#e8c860"; g.beginPath(); g.rect(-22, -55, 44, 260); g.fill(); g.stroke();
    g.beginPath(); g.rect(22, 120, 60, 34); g.fill(); g.stroke(); g.beginPath(); g.rect(22, 170, 46, 30); g.fill(); g.stroke(); },
  splash: (p, g, t) => { g.translate(256, 400); g.lineCap = "round";
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.28, r = 60 + t * 330, y0 = Math.sin(a) * r + 300 * t * t;
      g.globalAlpha = Math.max(0, 1 - t * 1.1); g.fillStyle = "#cfe8ff"; g.strokeStyle = "#241726"; g.lineWidth = 10;
      g.beginPath(); g.ellipse(Math.cos(a) * r, y0, 22, 30, a + Math.PI / 2, 0, 7); g.fill(); g.stroke(); } g.globalAlpha = 1; },
  question: (p, g, t) => { const s = 0.9 + 0.1 * Math.sin(t * 6); g.translate(256, 256); g.scale(s, s);
    g.font = "900 330px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = 36; g.strokeStyle = "#241726"; g.strokeText("?", 0, 10); g.fillStyle = "#ffe066"; g.fillText("?", 0, 10); },
  toc: (p, g, t) => { const s = 0.7 + 0.5 * Math.min(1, t * 6); g.translate(256, 256); g.scale(s, s); g.rotate(-0.12);
    g.globalAlpha = Math.max(0, 1 - Math.max(0, t - 0.5) * 2);
    g.font = "900 150px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
    g.lineWidth = 26; g.strokeStyle = "#241726"; g.strokeText("TOC!", 0, 0); g.fillStyle = "#ffffff"; g.fillText("TOC!", 0, 0); g.globalAlpha = 1; },
  buzz: (p, g, t) => { g.strokeStyle = "#241726"; g.lineWidth = 16; g.lineCap = "round"; const o = Math.sin(t * 60) * 8;
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const x = 256 + s * (170 + i * 36) + o;
      g.beginPath(); g.moveTo(x, 180 + i * 20); g.lineTo(x + s * 10, 256); g.lineTo(x, 332 - i * 20); g.stroke(); } },
};

// ---------- post (ink + grade) ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) },
    flash: { value: 0 }, dark: { value: 0 }, vig: { value: 0.55 }, sat: { value: 1.0 }, gain: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 0 }, inkR: { value: 1.6 * W / 1080 * 1.5 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, flash, dark, vig, sat, seed, inkR; uniform vec2 res; uniform vec3 gain;
    varying vec2 vUv;
    float lz(vec2 uv){ float d = texture2D(tD, uv).x; return -perspectiveDepthToViewZ(d, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb;
      float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 o = vec2(cos(a), sin(a)) * inkR / res;
        float dn = lz(vUv + o); e = max(e, (dn - d0) / d0); }
      float ink = smoothstep(0.05, 0.12, e) * (1.0 - smoothstep(40.0, 120.0, d0));
      c = mix(c, vec3(0.055, 0.035, 0.06), ink * 0.92);
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, sat); c *= gain;
      vec2 v = vUv - 0.5; v.x *= 0.75; c *= 1.0 - vig * smoothstep(0.25, 0.75, length(v));
      c += (hash(vUv * res) - 0.5) * 0.035;
      c = mix(c, vec3(1.0), flash); c *= 1.0 - dark;
      gl_FragColor = vec4(c, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- lighting presets ----------
const LIGHT = {
  street: { hemi: [0x5068a8, 0x141820, 1.25], moon: 1.1, fog: [0x101833, 14, 95], bg: true, tint: [0.66, 0.72, 0.98], sat: 1.05, gain: [0.98, 1.0, 1.08] },
  city: { hemi: [0x6a74a8, 0x221c20, 1.5], moon: 1.0, fog: [0x1c2244, 25, 150], bg: true, tint: [0.8, 0.8, 0.95], sat: 1.1, gain: [1.04, 1.0, 1.0] },
  inside: { hemi: [0x6a5a5a, 0x16120f, 0.7], moon: 0, fog: null, bg: false, tint: [0.97, 0.86, 0.76], sat: 0.92, gain: [1.0, 0.95, 0.92] },
};
function applyLight(name) {
  const L = LIGHT[name];
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2];
  moonL.intensity = L.moon;
  scene.fog = L.fog ? new THREE.Fog(L.fog[0], L.fog[1], L.fog[2]) : null;
  sky.visible = stars.visible = moon.visible = L.bg;
  scene.background = new THREE.Color(L.bg ? 0x0d1430 : 0x000000);
  post.uniforms.sat.value = L.sat; post.uniforms.gain.value.set(...L.gain);
  return L;
}

// ---------- frame ----------
window.renderFrame = async (f) => {
  const t = f / FPS;
  const S = shotAt(t);
  const st = S.fn(t, t - S.t0, S);
  const L = applyLight(st.light);
  // reset dynamic lights
  headL.intensity = 0; povL.intensity = 0; houseL.intensity = 0; porchL.intensity = 0; pendL.intensity = 0; kitL.intensity = 0; fillL.intensity = 0;
  ROOM.visible = st.light === "inside";
  if (st.light !== "inside") { houseL.intensity = 18; }
  else { pendL.intensity = (st.pend ?? 1) * 17; kitL.intensity = (st.kit ?? 1) * 9; fillL.intensity = 3.5; }
  // camera
  const c = st.cam;
  camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look));
  camera.fov = c.fov ?? 40; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  // bike
  const b = st.bike || { pos: [2.6, 0, -61], yaw: 0, spin: 0, lean: 0, light: 0 };
  BIKE.position.set(...b.pos); BIKE.rotation.set(0, b.yaw || 0, b.lean || 0);
  WHEELS.forEach((w) => (w.rotation.x = -(b.spin || 0)));
  BIKE.userData.beam.visible = (b.light ?? 1) > 0 && b.beam !== false; BIKE.visible = st.light !== "inside";
  if ((b.light ?? 1) > 0 && st.light !== "inside") {
    BIKE.updateMatrixWorld(true);
    headL.intensity = 60 * (b.light ?? 1); const hp = new THREE.Vector3(0, 0.95, -0.7).applyMatrix4(BIKE.matrixWorld);
    headL.position.copy(hp); headL.target.position.copy(new THREE.Vector3(0, 0.2, -8).applyMatrix4(BIKE.matrixWorld));
  }
  if (st.pov) { povL.intensity = 38; povL.position.set(...c.pos); povL.target.position.set(...c.look); }
  // phone screen
  const sg = phoneScreenC.getContext("2d");
  if (st.screen === "app") sg.drawImage(appC, 0, 0); else if (st.screen === "delivered") P.phoneDelivered(sg, t, st.notifT ?? 1); else P.phoneNoSignal(sg, st.blink ?? true, st.screen === "search", t);
  HPHONE.visible = !!st.hphone; if (st.hphone) { HPHONE.position.set(...st.hphone); HPHONE.lookAt(camera.position); }
  phoneScreenTex.needsUpdate = true;
  // doors / props
  JDOOR.rotation.y = -(st.door ?? 0) * 1.6;
  porchL.intensity = (st.door ?? 0) * 14;
  KEY.rotation.z = -(st.key ?? 0) * Math.PI / 2; IDOOR.rotation.y = (st.idoor ?? 0) * 1.45;
  TRAPGLOW.material.color.setRGB(0.4 + 0.25 * Math.sin(t * 7), 1.0, 0.55);
  CHAIR.position.x = IX + 1.2 + (st.chair ?? 0) * 0.45; CHAIR.rotation.y = (st.chair ?? 0) * 0.35;
  MYBAG.visible = !!st.mybag; if (st.mybag) MYBAG.position.set(...st.mybag);
  BROKEN.rotation.z = 0;
  KEY.visible = !st.keyGone;
  TRAP.position.y = st.trapBump ?? 0; RUG.position.y = 0.03 + (st.trapBump ?? 0) * 0.6;
  TRAPGLOW.scale.set(1, 1, 1 + (st.trapGlow ?? 0) * 3);
  if (st.trapGlow) TRAPGLOW.material.color.setRGB(0.5 + 0.3 * st.trapGlow, 1.0, 0.6);
  // actors
  for (const k in cards) cards[k].hide();
  for (const a of st.actors || []) {
    const C = cards[a.id], o = a.id === "moto" ? MOTO : JULIA;
    C.draw(actorKey(a.opts), (p) => T.bodyFront(p, o, a.opts));
    C.place(a.pos[0], a.pos[1], a.pos[2], camera.position, { tint: a.tint || L.tint, scale: a.scale, sy: a.sy, roll: a.roll, blob: a.blob, floor: a.floor });
  }
  fxCards.forEach((c) => c.hide());
  (st.fx || []).forEach((e, i) => {
    const C = fxCards[i];
    C.draw(e.type + qz(e.t, 0.034) + (e.col || ""), (p, g) => FX_DRAW[e.type](p, g, e.t, e.col));
    C.place(e.pos[0], e.pos[1], e.pos[2], camera.position, { scale: e.scale ?? 1, blob: false, tint: e.tint || [1, 1, 1], roll: e.roll || 0 });
    C.mesh.material.opacity = e.alpha ?? 1;
  });
  // render
  renderer.setRenderTarget(rt); renderer.render(scene, camera);
  post.uniforms.flash.value = st.flash ?? 0; post.uniforms.dark.value = st.dark ?? 0; post.uniforms.vig.value = st.vig ?? 0.6; post.uniforms.seed.value = f * 0.37;
  post.uniforms.near.value = camera.near; post.uniforms.far.value = camera.far;
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  og.drawImage(glc, 0, 0);
  if (st.overlay) st.overlay(og, W, H);
  return out.toDataURL("image/jpeg", 0.93);
};
window.TOTAL = TOTAL;
window.ready = true;
