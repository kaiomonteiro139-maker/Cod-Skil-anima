// "O leão sem dentes" — savanna fable engine: 3D toon animals with black ink outline, sky presets, herds.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400); scene.add(camera);
scene.fog = new THREE.Fog(0xf0c890, 40, 160);
let SEED = 7; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([110, 110, 110, 255, 190, 190, 190, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const SPH = new THREE.SphereGeometry(1, 20, 14), CYL = new THREE.CylinderGeometry(1, 1, 1, 14), CONE = new THREE.ConeGeometry(1, 1, 12);
const CAPS = new THREE.CapsuleGeometry(1, 1, 6, 14);

// ---------- world: ground, river, hill, trees, rocks, sky ----------
export const RIVER_Z = -9, HILL = [26, 12, 16, 3.6]; // hill center x, z, radius, height
const groundY = (x, z) => { const d2 = ((x - HILL[0]) ** 2 + (z - HILL[1]) ** 2) / (HILL[2] ** 2); return d2 < 1 ? HILL[3] * (1 - d2) ** 1.6 : 0; };
window.groundY = groundY;
const grassTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#d9b25c"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) { const x = rnd() * 512, y = rnd() * 512, l = 6 + rnd() * 14; g.strokeStyle = rnd() < 0.5 ? "rgba(150,110,40,0.45)" : "rgba(245,215,130,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - l); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(160,120,60,0.18)"; g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 20 + rnd() * 40, 10 + rnd() * 20, 0, 0, 7); g.fill(); } const t = tex(c); t.repeat.set(40, 40); return t; })();
const groundGeo = new THREE.PlaneGeometry(300, 300, 150, 150); groundGeo.rotateX(-Math.PI / 2);
{ const p = groundGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); let y = groundY(x, z); if (Math.abs(z - RIVER_Z) < 2.6) y -= 0.35 * (1 - Math.abs(z - RIVER_Z) / 2.6); p.setY(i, y); } groundGeo.computeVertexNormals(); }
const GROUND = add(groundGeo, toon(0xffffff, grassTex)); GROUND.receiveShadow = true;
const waterTex = (() => { const [c, g] = cv(512, 128); g.fillStyle = "#3f8fc4"; g.fillRect(0, 0, 512, 128); g.strokeStyle = "rgba(220,240,255,0.7)"; g.lineWidth = 4; for (let i = 0; i < 18; i++) { const x = rnd() * 512, y = rnd() * 128; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 14, y - 5, x + 30, y); g.stroke(); } const t = tex(c); t.repeat.set(30, 1); return t; })();
const WATER = add(new THREE.PlaneGeometry(300, 4.2), toon(0xffffff, waterTex), 0, -0.12, RIVER_Z); WATER.rotation.x = -Math.PI / 2;
function acacia(x, z, s = 1) { const g = grp(scene, x, groundY(x, z), z); g.scale.setScalar(s); const bark = toon(0x5a3a22);
  const tr = add(CYL, bark, 0, 1.6, 0, g); tr.scale.set(0.16, 3.2, 0.16); tr.rotation.z = 0.08;
  for (const [a, l] of [[0.7, 1.4], [-0.6, 1.2], [0.1, 1.0]]) { const b = add(CYL, bark, Math.sin(a) * l * 0.5, 3.0 + Math.cos(a) * l * 0.4, 0, g); b.scale.set(0.08, l, 0.08); b.rotation.z = -a; }
  for (const [cx, cy, cz, r] of [[0, 3.75, 0, 2.2], [1.1, 3.6, 0.3, 1.4], [-1.2, 3.55, -0.2, 1.5]]) { const c = add(SPH, toon(0x3f6b2e), cx, cy, cz, g); c.scale.set(r, r * 0.28, r * 0.85); } return g; }
for (const [x, z, s] of [[-14, -2, 1.2], [9, -15, 1.0], [-30, 8, 1.4], [40, -4, 1.1], [-8, 20, 1.0], [18, 28, 1.3], [-45, -20, 1.5], [55, 20, 1.2], [3, 26, 0.9], [-22, -14, 1.1]]) acacia(x, z, s);
for (let i = 0; i < 40; i++) { const x = (rnd() - 0.5) * 120, z = (rnd() - 0.5) * 120; if (Math.abs(z - RIVER_Z) < 3 || Math.hypot(x, z) < 5) continue; const r = add(SPH, toon(rnd() < 0.5 ? 0x9a8a72 : 0x6f8a3a), x, groundY(x, z), z); const s = 0.3 + rnd() * 0.6; r.scale.set(s * 1.4, s * 0.6, s); }
// sky dome
const [skyC, skyG] = cv(64, 512); const skyTex = tex(skyC, false);
const SKY = add(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false })); SKY.renderOrder = -1;
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.8)"); gr.addColorStop(0.5, "rgba(255,255,255,0.18)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })();
const SUN = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xfff0c0, fog: false, depthWrite: false })); scene.add(SUN);
const STARS = new THREE.Points((() => { const g = new THREE.BufferGeometry(), p = []; for (let i = 0; i < 600; i++) { const a = rnd() * Math.PI * 2, e = 0.15 + rnd() * 1.2; p.push(Math.cos(a) * Math.cos(e) * 280, Math.sin(e) * 280, Math.sin(a) * Math.cos(e) * 280); } g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); return g; })(), new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true }));
scene.add(STARS);
const LP = {
  day: { top: "#5aa8e0", mid: "#a8d4ee", hor: "#f3e2b0", hemi: [0xfff4dc, 0x8a7040, 1.0], sun: [0xfff0d0, 2.4], sunDir: [-0.5, 0.8, 0.4], fog: 0xf3e2b0, fogN: 50, sunCol: 0xfff7d8, stars: 0, grass: 0xffffff },
  dusk: { top: "#3a3a7a", mid: "#e0785a", hor: "#ffc070", hemi: [0xffc890, 0x5a3a40, 0.85], sun: [0xffa860, 2.6], sunDir: [-0.8, 0.25, -0.6], fog: 0xf0a070, fogN: 35, sunCol: 0xffc070, stars: 0.15, grass: 0xffe0c0 },
  night: { top: "#0a1030", mid: "#1c2c60", hor: "#34508a", hemi: [0x8a9ad8, 0x2a2840, 1.15], sun: [0xb0c8ff, 1.5], sunDir: [0.4, 0.7, -0.5], fog: 0x1a2650, fogN: 25, sunCol: 0xe8eeff, stars: 1, grass: 0xb0b8e8 },
  dawn: { top: "#6a8ac8", mid: "#f0b0a0", hor: "#ffe0b0", hemi: [0xffe8d0, 0x6a5a50, 0.95], sun: [0xffd0a0, 2.2], sunDir: [0.8, 0.3, -0.5], fog: 0xffe0c0, fogN: 40, sunCol: 0xfff0c0, stars: 0, grass: 0xfff0e0 },
};
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 120 }); scene.add(sun, sun.target);
let skyKey = "";
function applyLight(name, look) { const L = LP[name];
  if (skyKey !== name) { skyKey = name; const gr = skyG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, L.top); gr.addColorStop(0.42, L.mid); gr.addColorStop(0.5, L.hor); gr.addColorStop(1, L.hor); skyG.fillStyle = gr; skyG.fillRect(0, 0, 64, 512); skyTex.needsUpdate = true; }
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2]; sun.color.setHex(L.sun[0]); sun.intensity = L.sun[1];
  const d = new THREE.Vector3(...L.sunDir).normalize(); sun.target.position.set(look[0], 0, look[2]); sun.position.copy(sun.target.position).addScaledVector(d, 60); sun.target.updateMatrixWorld();
  SUN.position.copy(camera.position).addScaledVector(d, 250); SUN.scale.setScalar(name === "night" ? 26 : 60); SUN.material.color.setHex(L.sunCol);
  scene.fog.color.setHex(L.fog); scene.fog.near = L.fogN; scene.fog.far = L.fogN * 4; STARS.material.opacity = L.stars; STARS.visible = L.stars > 0; GROUND.material.color.setHex(L.grass); }

// ---------- the lion ----------
const LION = (() => { const g = grp(scene); const fur = toon(0xd9a45a), light = toon(0xf0d29a), mane = toon(0x8a4a22), grey = toon(0x9a8a7a), dark = toon(0x2a1a14), gum = toon(0xd0707a), white = toon(0xffffff), eyeY = toon(0xf2c230);
  const body = grp(g, 0, 0, 0); const torso = add(SPH, fur, 0, 0.95, 0, body); torso.scale.set(0.62, 0.55, 1.15); const belly = add(SPH, light, 0, 0.78, 0.05, body); belly.scale.set(0.5, 0.42, 0.95);
  const legs = []; for (const [x, z] of [[-0.3, 0.7], [0.3, 0.7], [-0.3, -0.7], [0.3, -0.7]]) { const pivot = grp(body, x, 0.95, z); const l = add(CYL, fur, 0, -0.45, 0, pivot); l.scale.set(0.15, 0.9, 0.15); const paw = add(SPH, light, 0, -0.9, 0.06, pivot); paw.scale.set(0.18, 0.1, 0.22); legs.push(pivot); }
  const tail = grp(body, 0, 1.1, -1.05); const tl = add(CYL, fur, 0, 0, -0.45, tail); tl.scale.set(0.05, 0.9, 0.05); tl.rotation.x = Math.PI / 2; const tuft = add(SPH, mane, 0, 0, -0.95, tail); tuft.scale.setScalar(0.12);
  const neck = grp(body, 0, 1.25, 0.95); const head = grp(neck, 0, 0.25, 0.25);
  const mn = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; const m = add(SPH, i % 5 === 0 ? grey : mane, Math.cos(a) * 0.52, Math.sin(a) * 0.5, -0.12, head); m.scale.set(0.24, 0.24, 0.2); mn.push(m); }
  const mball = add(SPH, mane, 0, 0, -0.22, head); mball.scale.set(0.62, 0.64, 0.5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.26; const m = add(SPH, i % 4 === 0 ? grey : mane, Math.cos(a) * 0.42, Math.sin(a) * 0.42, -0.4, head); m.scale.set(0.24, 0.24, 0.24); }
  const skull = add(SPH, fur, 0, 0.02, 0.05, head); skull.scale.set(0.42, 0.4, 0.38);
  for (const s of [-1, 1]) { const ear = add(SPH, fur, s * 0.3, 0.33, -0.02, head); ear.scale.set(0.11, 0.11, 0.06); add(SPH, dark, s * 0.3, 0.33, 0.02, head).scale.set(0.06, 0.06, 0.03); }
  const muzzle = add(SPH, light, 0, -0.12, 0.33, head); muzzle.scale.set(0.24, 0.17, 0.2); const nose = add(SPH, dark, 0, -0.02, 0.5, head); nose.scale.set(0.09, 0.06, 0.05);
  const jaw = grp(head, 0, -0.2, 0.22); const jw = add(SPH, light, 0, -0.06, 0.12, jaw); jw.scale.set(0.18, 0.08, 0.16); const mouthIn = add(SPH, basic(0x3a1418), 0, -0.23, 0.45, head); mouthIn.scale.set(0.13, 0.02, 0.05);
  const gums = add(SPH, gum, 0, -0.2, 0.47, head); gums.scale.set(0.12, 0.03, 0.035); // pink toothless gums, shown when the mouth opens
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.16, 0.1, 0.33); const ball = add(SPH, white, 0, 0, 0, e); ball.scale.set(0.085, 0.07, 0.05); const iris = add(SPH, eyeY, 0, -0.005, 0.03, e); iris.scale.set(0.05, 0.05, 0.03); const pupil = add(SPH, dark, 0, -0.005, 0.05, e); pupil.scale.set(0.022, 0.035, 0.02);
    const lid = add(SPH, fur, 0, 0.03, 0.012, e); lid.scale.set(0.095, 0.06, 0.055); const brow = add(CYL, grey, 0, 0.08, 0.03, e); brow.scale.set(0.02, 0.15, 0.02); brow.rotation.z = Math.PI / 2 + s * 0.25; eyes.push({ e, lid, brow, iris, pupil, s }); }
  const whisk = []; for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { const w = add(CYL, toon(0xf4f0e8), s * 0.3, -0.1 - k * 0.05, 0.4, head); w.scale.set(0.006, 0.28, 0.006); w.rotation.z = s * (1.35 + k * 0.15); whisk.push(w); }
  return { g, body, torso, belly, legs, tail, neck, head, jaw, gums, mouthIn, eyes };
})();
/** pose: { pos, yaw, lie 0..1, fat 0..1, walk phase or null, headYaw, headPitch, mouth 0..1, lid 0..1 (1 = closed), tail, breathe t } */
function poseLion(p, t) { const L = LION; L.g.visible = true; L.g.position.set(p.pos[0], groundY(p.pos[0], p.pos[2]), p.pos[2]); L.g.rotation.y = p.yaw ?? 0;
  const lie = p.lie ?? 0, fat = p.fat ?? 0, br = 1 + 0.02 * Math.sin(t * 2.2);
  L.torso.scale.set((0.62 + 0.45 * fat) * br, (0.55 + 0.25 * fat) * br, 1.15 + 0.25 * fat); L.belly.scale.set(0.5 + 0.45 * fat, 0.42 + 0.3 * fat, 0.95 + 0.2 * fat); L.belly.position.y = 0.78 - 0.12 * fat;
  L.body.position.y = -0.62 * lie; const w = p.walk;
  L.legs.forEach((lg, i) => { const ph = w == null ? 0 : Math.sin(w * 6 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.45; lg.rotation.x = ph * (1 - lie) + (i < 2 ? -1.35 : 1.25) * lie; lg.rotation.z = 0; });
  if (w != null) L.body.position.y += Math.abs(Math.sin(w * 6)) * 0.04;
  L.neck.rotation.y = p.headYaw ?? 0; L.neck.rotation.x = (p.headPitch ?? 0) + 0.05 * lie; L.neck.position.y = 1.25 - 0.15 * lie;
  L.head.rotation.z = p.headRoll ?? 0;
  const m = p.mouth ?? 0; L.jaw.rotation.x = m * 0.7; L.mouthIn.scale.y = 0.02 + m * 0.1; L.mouthIn.position.y = -0.23 - m * 0.06; L.gums.visible = m > 0.25; L.gums.position.y = -0.2 - m * 0.015;
  L.eyes.forEach((e) => { const lid = Math.min(1, (p.lid ?? 0.45) + (blinkAt(t, 1.3) ? 1 : 0)); e.lid.position.y = 0.04 - 0.05 * lid; e.lid.scale.y = 0.04 + 0.05 * lid; e.iris.position.x = e.pupil.position.x = (p.eyeX ?? 0) * 0.02;
    e.brow.rotation.z = Math.PI / 2 + e.s * (0.25 + (p.brow ?? 0) * 0.35); });
  L.tail.rotation.y = Math.sin(t * 1.7) * 0.35 + (p.tail ?? 0); L.tail.rotation.x = -0.6 + 0.5 * lie; }
const blinkAt = (t, s) => ((t * 1000 + s * 997) % 3700) < 130;

// ---------- zebras ----------
const stripeTex = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#f6f4ee"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#1c1a1e";
  for (let i = 0; i < 9; i++) { const y = i * 18 + 50; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(80, y + 9, 170, y - 8, 256, y + 3); g.lineTo(256, y + 14); g.bezierCurveTo(170, y + 4, 80, y + 20, 0, y + 12); g.fill(); } return tex(c); })();
const ZM = { st: toon(0xffffff, stripeTex), dark: toon(0x1c1a1e), muz: toon(0x2a2628), white: toon(0xffffff), hoof: toon(0x2a2628), eye: toon(0x1a1416), hurt: toon(0xd84a4a) };
function makeZebra() { const g = grp(scene); const body = grp(g); const torso = add(CAPS, ZM.st, 0, 1.15, 0, body); torso.scale.set(0.4, 0.55, 0.42); torso.rotation.x = Math.PI / 2;
  const legs = []; for (const [x, z] of [[-0.2, 0.62], [0.2, 0.62], [-0.2, -0.62], [0.2, -0.62]]) { const pv = grp(body, x, 1.05, z); const l = add(CYL, ZM.st, 0, -0.5, 0, pv); l.scale.set(0.08, 1.0, 0.08); add(CYL, ZM.hoof, 0, -1.02, 0, pv).scale.set(0.085, 0.08, 0.085); legs.push(pv); }
  const tail = grp(body, 0, 1.3, -0.9); const tl = add(CYL, ZM.dark, 0, -0.3, -0.05, tail); tl.scale.set(0.03, 0.6, 0.03); tl.rotation.x = 0.2;
  const neck = grp(body, 0, 1.35, 0.72); const nk = add(CAPS, ZM.st, 0, 0.32, 0.1, neck); nk.scale.set(0.15, 0.32, 0.17); nk.rotation.x = 0.45; const maneR = add(CAPS, ZM.dark, 0, 0.42, -0.02, neck); maneR.scale.set(0.05, 0.3, 0.05); maneR.rotation.x = 0.45;
  const head = grp(neck, 0, 0.66, 0.32); const hd = add(CAPS, ZM.st, 0, -0.05, 0.18, head); hd.scale.set(0.16, 0.28, 0.17); hd.rotation.x = 1.25; const mz = add(SPH, ZM.muz, 0, -0.14, 0.48, head); mz.scale.set(0.13, 0.12, 0.13);
  for (const s of [-1, 1]) { const ear = add(CONE, ZM.st, s * 0.1, 0.17, 0.0, head); ear.scale.set(0.06, 0.2, 0.05); ear.rotation.z = -s * 0.35; const eb = add(SPH, ZM.white, s * 0.13, 0.05, 0.2, head); eb.scale.set(0.045, 0.05, 0.04); add(SPH, ZM.eye, s * 0.15, 0.05, 0.225, head).scale.set(0.028, 0.035, 0.025); }
  const hurt = add(SPH, ZM.hurt, 0.36, 1.2, -0.1, body); hurt.scale.set(0.05, 0.16, 0.2); hurt.visible = false;
  return { g, body, torso, legs, tail, neck, head, hurt, used: false };
}
const ZPOOL = []; const zebra = (i) => ZPOOL[i] || (ZPOOL[i] = makeZebra());
/** z: { pos, yaw, walk (phase) | null, graze 0..1, kick 0..1, rear 0..1, lean, headYaw, nod, lie, hurt, scale } */
function poseZebra(Z, p, t, i) { Z.g.visible = true; const y = groundY(p.pos[0], p.pos[2]); Z.g.position.set(p.pos[0], y, p.pos[2]); Z.g.rotation.y = p.yaw ?? 0; Z.g.scale.setScalar(p.scale ?? 1);
  const w = p.walk, k = p.kick ?? 0, r = p.rear ?? 0, lie = p.lie ?? 0, ph = i * 1.37;
  Z.body.rotation.x = -0.55 * k * 0.35 + 0.0 - 0.5 * r; Z.body.rotation.z = (p.lean ?? 0); Z.body.position.y = -0.8 * lie + (w != null ? Math.abs(Math.sin(w * 7 + ph)) * 0.05 : 0) + 0.35 * r;
  Z.body.rotation.x = 0.45 * k - 0.5 * r;
  Z.legs.forEach((lg, j) => { let a = w == null ? 0 : Math.sin(w * 7 + ph + (j === 0 || j === 3 ? 0 : Math.PI)) * 0.5;
    if (j >= 2) a += -1.15 * k * (0.7 + 0.3 * Math.sin(t * 18)); if (j < 2) a += -0.9 * r; a = a * (1 - lie) + (j < 2 ? -1.4 : 1.4) * lie; lg.rotation.x = a; });
  const graze = p.graze ?? 0; Z.neck.rotation.x = 1.15 * graze + 0.12 * Math.sin(t * 1.3 + ph) * (1 - graze) * 0.5 + (p.nod ? Math.sin(t * 9 + ph) * 0.12 * p.nod : 0) - 0.5 * k;
  Z.neck.rotation.y = p.headYaw ?? 0; Z.tail.rotation.z = Math.sin(t * 3 + ph) * 0.35; Z.hurt.visible = !!p.hurt; }
// big herd for wide shots (instanced: body, neck, head) — the "2.000"
const HERD = (() => { const N = 900; const body = new THREE.InstancedMesh(CAPS, ZM.st, N), nk = new THREE.InstancedMesh(CAPS, ZM.st, N), hd = new THREE.InstancedMesh(CAPS, ZM.st, N); [body, nk, hd].forEach((m) => { scene.add(m); m.castShadow = true; m.frustumCulled = false; }); return { N, body, nk, hd, list: [] }; })();
const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E3 = new THREE.Euler(), V3 = new THREE.Vector3(), S3 = new THREE.Vector3();
function setHerd(list, t) { const H = HERD; let n = 0;
  for (const z of list) { if (n >= H.N) break; const y = groundY(z[0], z[1]), yaw = z[2] ?? 0, bob = Math.abs(Math.sin(t * 6 + n)) * 0.04 * (z[3] ? 1 : 0), graze = z[4] ?? 0;
    Q.setFromEuler(E3.set(Math.PI / 2, yaw, 0, "YXZ")); M4.compose(V3.set(z[0], y + 1.15 + bob, z[1]), Q, S3.set(0.4, 0.55, 0.42)); H.body.setMatrixAt(n, M4);
    const fx = Math.sin(yaw), fz = Math.cos(yaw), nkx = 0.45 + graze * 1.2;
    Q.setFromEuler(E3.set(nkx, yaw, 0, "YXZ")); M4.compose(V3.set(z[0] + fx * 0.85, y + 1.55 - graze * 0.6 + bob, z[1] + fz * 0.85), Q, S3.set(0.15, 0.32, 0.17)); H.nk.setMatrixAt(n, M4);
    Q.setFromEuler(E3.set(1.25 + graze * 0.8, yaw, 0, "YXZ")); M4.compose(V3.set(z[0] + fx * (1.05 + graze * 0.3), y + 1.95 - graze * 1.2 + bob, z[1] + fz * (1.05 + graze * 0.3)), Q, S3.set(0.16, 0.28, 0.17)); H.hd.setMatrixAt(n, M4); n++; }
  for (const m of [H.body, H.nk, H.hd]) { m.count = n; m.instanceMatrix.needsUpdate = true; m.visible = n > 0; } }

// ---------- dust puffs + motion lines (FX sprites) ----------
const dustTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 60); gr.addColorStop(0, "rgba(235,215,170,0.95)"); gr.addColorStop(1, "rgba(235,215,170,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })();
const DUST = Array.from({ length: 24 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false })); scene.add(s); return s; });
const starTex = (() => { const [c, g] = cv(128, 128); g.translate(64, 64); g.fillStyle = "#ffd23f"; g.strokeStyle = "#140c10"; g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r = i % 2 ? 22 : 54; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); return tex(c, false); })();
const IMPACT = Array.from({ length: 4 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false, fog: false })); scene.add(s); return s; });
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = o === GROUND || o.receiveShadow; } });
GROUND.castShadow = false; WATER.castShadow = false;

// ---------- post: ink outline from depth + normals-ish, bloom, vignette ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 5.0 * Math.min(W, H) / 1080 }, vig: { value: 0.35 }, gain: { value: new THREE.Vector3(1, 1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig; uniform vec2 res; uniform vec3 gain; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.012, 0.04, e) * (1.0 - smoothstep(70.0, 180.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 18.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.85, 0.0); }
      c += bl / 12.0 * 1.1; c = mix(c, vec3(0.07, 0.05, 0.05), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb; c *= gain;
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- render one state ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.up.set(0, 1, 0); if (c.up) camera.up.set(...c.up); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 50; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  applyLight(st.light || "day", c.look);
  if (st.lion) poseLion(st.lion, t); else LION.g.visible = false;
  ZPOOL.forEach((z) => (z.g.visible = false)); (st.zebras || []).forEach((p, i) => poseZebra(zebra(i), p, t, i));
  setHerd(st.herd || [], t);
  DUST.forEach((d) => (d.visible = false)); (st.dust || []).forEach((d, i) => { const s = DUST[i]; if (!s) return; s.visible = true; s.position.set(...d.pos); s.scale.setScalar(d.s ?? 1); s.material.opacity = d.a ?? 0.8; });
  IMPACT.forEach((d) => (d.visible = false)); (st.impact || []).forEach((d, i) => { const s = IMPACT[i]; s.visible = true; s.position.set(...d.pos); s.scale.setScalar(d.s ?? 0.6); s.material.rotation = d.rot ?? 0; });
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.gain.value.set(...(st.gain || [1, 1, 1]));
  renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.b && S.mix > 0) { renderState(S.b, t); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); og.globalAlpha = 1; }
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
