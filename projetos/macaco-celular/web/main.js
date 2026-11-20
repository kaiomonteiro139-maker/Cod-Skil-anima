// "O macaco que vendeu a floresta" — jungle clearing, 3D toon monkey, businessman, bulldozer, falling trees, banana pile.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 400); scene.add(camera); scene.fog = new THREE.Fog(0xcfe6c8, 30, 140);
let SEED = 3; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([115, 115, 115, 255, 190, 190, 190, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent);
const SPH = new THREE.SphereGeometry(1, 20, 14), CYL = new THREE.CylinderGeometry(1, 1, 1, 14), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 14), CONE = new THREE.ConeGeometry(1, 1, 12);
// ---------- ground ----------
const grassTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#4f8f3a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 800; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(30,70,25,0.5)" : "rgba(130,190,80,0.45)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - 8 - rnd() * 10); g.stroke(); } const t = tex(c); t.repeat.set(50, 50); return t; })();
const dirtTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#8a6a44"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "60,40,25" : "170,140,100"},0.3)`; g.beginPath(); g.ellipse(rnd() * 512, rnd() * 512, 4 + rnd() * 10, 3 + rnd() * 6, 0, 0, 7); g.fill(); } const t = tex(c); t.repeat.set(30, 30); return t; })();
const GROUND = add(new THREE.PlaneGeometry(300, 300), toon(0xffffff, grassTex)); GROUND.rotation.x = -Math.PI / 2;
const DIRT = add(new THREE.CircleGeometry(1, 64), toon(0xffffff, dirtTex), 0, 0.01, 0); DIRT.rotation.x = -Math.PI / 2; // grows as the forest is cut
// ---------- trees (cuttable) ----------
const leafCols = [0x2f7a32, 0x3f9a3a, 0x2a6a2e, 0x4fa844]; const bark = toon(0x6a4a2e), stumpTop = toon(0xd8b07a);
function jungleTree(x, z, s, big = false) { const g = grp(scene, x, 0, z); const t = grp(g); const h = (big ? 9 : 4.5 + rnd() * 3) * s;
  add(CYL, bark, 0, h / 2, 0, t).scale.set(0.28 * s * (big ? 1.4 : 1), h, 0.28 * s * (big ? 1.4 : 1));
  const n = big ? 6 : 3 + Math.floor(rnd() * 3); for (let k = 0; k < n; k++) { const c = add(SPH, toon(leafCols[Math.floor(rnd() * 4)]), (rnd() - 0.5) * 1.8 * s, h + (rnd() - 0.2) * 1.0 * s, (rnd() - 0.5) * 1.8 * s, t); const r = (1.3 + rnd() * 0.8) * s * (big ? 1.4 : 1); c.scale.set(r, r * 0.7, r); }
  for (let k = 0; k < 2; k++) { const v = add(CYL, toon(0x3a7a2a), (rnd() - 0.5) * 1.2 * s, h - 1.2, (rnd() - 0.5) * 1.2 * s, t); v.scale.set(0.03, 2.2, 0.03); }
  const stump = grp(g); add(CYL, bark, 0, 0.3, 0, stump).scale.set(0.3 * s * (big ? 1.4 : 1), 0.6, 0.3 * s * (big ? 1.4 : 1)); add(CYL, stumpTop, 0, 0.61, 0, stump).scale.set(0.28 * s * (big ? 1.4 : 1), 0.02, 0.28 * s * (big ? 1.4 : 1)); stump.visible = false;
  return { g, t, stump, h, x, z, fallDir: rnd() * Math.PI * 2 }; }
const LAST = jungleTree(0, -2, 1.0, true); window.LAST_H = LAST.h; window.LAST_TOP = Math.max(...LAST.t.children.filter((m) => m.geometry === SPH).map((m) => m.position.y + m.scale.y));
const TREES = []; for (let i = 0; i < 150; i++) { const a = rnd() * Math.PI * 2, r = 6 + Math.pow(rnd(), 0.7) * 38; const x = Math.cos(a) * r, z = Math.sin(a) * r - 2; if (Math.hypot(x - 4, z - 6) < 4) continue; TREES.push(jungleTree(x, z, 0.8 + rnd() * 0.5)); }
TREES.sort((A, B) => Math.hypot(B.x, B.z) - Math.hypot(A.x, A.z)); window.TREE_XZ = TREES.map((T) => [T.x, T.z]);
// ---------- monkey ----------
const MON = (() => { const g = grp(scene); const fur = toon(0x7a4a2a), face = toon(0xf0c89a), ink = toon(0x1a1214), wht = basic(0xffffff);
  const body = grp(g); const torso = add(CAPS, fur, 0, 0.55, 0, body); torso.scale.set(0.26, 0.2, 0.22); const belly = add(SPH, face, 0, 0.52, 0.12, body); belly.scale.set(0.19, 0.24, 0.13);
  const legs = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.14, 0.32, 0); add(CAPS, fur, 0, -0.14, 0, pv).scale.set(0.07, 0.12, 0.07); add(SPH, face, 0, -0.3, 0.05, pv).scale.set(0.08, 0.04, 0.11); legs.push(pv); }
  const arms = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.26, 0.78, 0); add(CAPS, fur, 0, -0.22, 0, pv).scale.set(0.06, 0.2, 0.06); add(SPH, face, 0, -0.46, 0, pv).scale.setScalar(0.07); arms.push(pv); }
  const tail = grp(body, 0, 0.4, -0.2); for (let i = 0; i < 8; i++) { const a = i / 7 * 4.0; add(SPH, fur, 0, 0.1 + Math.sin(a) * 0.2 + i * 0.03, -0.1 - Math.cos(a) * 0.2 - i * 0.03, tail).scale.setScalar(0.045); }
  const head = grp(body, 0, 1.08, 0.02); add(SPH, fur, 0, 0, 0, head).scale.set(0.3, 0.28, 0.27);
  const mask = add(SPH, face, 0, -0.04, 0.14, head); mask.scale.set(0.22, 0.2, 0.15); const muz = add(SPH, face, 0, -0.1, 0.24, head); muz.scale.set(0.15, 0.1, 0.1);
  for (const s of [-1, 1]) { add(SPH, fur, s * 0.3, 0.02, 0, head).scale.set(0.1, 0.11, 0.05); add(SPH, face, s * 0.31, 0.02, 0.02, head).scale.set(0.065, 0.075, 0.04); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.085, 0.04, 0.25); const b = add(SPH, ink, 0, 0, 0, e); b.scale.set(0.045, 0.055, 0.03); add(SPH, wht, 0.014, 0.018, 0.025, e).scale.setScalar(0.014); const brow = add(CAPS, fur, 0, 0.075, 0.01, e); brow.scale.set(0.012, 0.03, 0.012); brow.rotation.z = Math.PI / 2; eyes.push({ e, b, brow, s }); }
  for (const s of [-1, 1]) add(SPH, ink, s * 0.03, -0.06, 0.33, head).scale.set(0.012, 0.01, 0.01);
  const smile = add(new THREE.TorusGeometry(0.07, 0.013, 6, 18, Math.PI), ink, 0, -0.12, 0.33, head); smile.rotation.z = Math.PI;
  const frown = add(new THREE.TorusGeometry(0.06, 0.013, 6, 18, Math.PI), ink, 0, -0.17, 0.33, head);
  return { g, body, torso, legs, arms, tail, head, eyes, smile, frown };
})();
const BANANA_GEO = new THREE.TorusGeometry(0.15, 0.06, 8, 16, Math.PI * 0.7); const bananaMat = toon(0xf4d03f);
const handBanana = add(BANANA_GEO, bananaMat, 0, -0.5, 0.06, MON.arms[1]); handBanana.rotation.set(0, Math.PI / 2, 0.3);
/** monkey pose: { pos, yaw, sit, happy (-1 sad..1 happy), armsUp, eat, banana, climb (on a trunk), bob, headYaw, scale } */
function poseMon(p, t) { const M = MON; M.g.visible = true; M.g.position.set(...p.pos); M.g.rotation.y = p.yaw ?? 0; M.g.scale.setScalar(p.scale ?? 1);
  const sit = p.sit ?? 0, up = p.armsUp ?? 0, hap = p.happy ?? 0.5, jump = p.jump ? Math.abs(Math.sin(t * 7)) * 0.25 : 0;
  M.body.position.y = -0.2 * sit + jump + (p.bob ? Math.sin(t * 3) * 0.02 : 0); M.legs.forEach((l, i) => (l.rotation.x = -1.3 * sit + (p.climb ? Math.sin(t * 8 + i * 3) * 0.6 : 0)));
  M.arms.forEach((a, i) => { a.rotation.z = (i ? 1 : -1) * (0.25 + 2.3 * up) + (p.jump ? Math.sin(t * 14) * 0.2 : 0); a.rotation.x = p.climb ? -2.6 + Math.sin(t * 8 + i * 3) * 0.4 : (i === 1 ? -1.2 * (p.eat ?? 0) : 0); });
  M.head.rotation.y = p.headYaw ?? 0; M.head.rotation.x = -0.25 * (p.lookUp ?? 0) + 0.25 * Math.max(0, -hap); M.head.rotation.z = Math.sin(t * 1.6) * 0.05;
  M.smile.visible = hap >= 0; M.frown.visible = hap < 0; M.smile.scale.setScalar(0.7 + 0.5 * Math.max(0, hap));
  M.eyes.forEach((e) => { e.b.scale.y = ((t * 1000 + 300) % 3400) < 120 ? 0.01 : 0.055; e.brow.rotation.z = Math.PI / 2 - e.s * 0.5 * Math.max(0, -hap); e.brow.position.y = 0.075 - 0.01 * Math.max(0, -hap); });
  M.tail.rotation.x = Math.sin(t * 2) * 0.2; handBanana.visible = !!p.banana; PHONE.visible = !!p.phone;
  if (p.phone) { const show = p.face === "cam"; M.arms.forEach((a, i) => a.rotation.set(p.selfie && i === 0 ? -2.6 : -1.15, 0, (i ? -1 : 1) * 0.55)); PHONE.position.set(p.selfie ? -0.12 : 0, p.selfie ? 1.42 : 0.82, p.selfie ? 0.42 : 0.36);
    PHONE.rotation.set(show ? -0.15 : 0.25, show ? 0 : Math.PI, 0); M.head.rotation.x = p.selfie ? -0.15 : show ? 0 : 0.35; if (scrKey !== p.phone) { scrKey = p.phone; drawScreen(p.phone); } } }
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
function poseLion(p, t) { const L = LION; L.g.visible = true; L.g.position.set(p.pos[0], 0, p.pos[2]); L.g.rotation.y = p.yaw ?? 0;
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
LION.g.scale.setScalar(1.0); LION.g.visible = false;
const PHONE = grp(MON.body, 0, 0.82, 0.36); { box(0.13, 0.24, 0.016, toon(0x141418), 0, -0.12, 0, PHONE); }
const [scrC, scrG] = cv(256, 460); const scrTex = tex(scrC, false); const SCR = add(new THREE.PlaneGeometry(0.115, 0.205), new THREE.MeshBasicMaterial({ map: scrTex }), 0, 0, 0.0095, PHONE);
const PG = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(160,210,255,0.9)"); gr.addColorStop(1, "rgba(160,210,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); PG.scale.setScalar(0.22); PG.position.set(0, 0, 0.04); PHONE.add(PG);
function drawScreen(n) { const g = scrG; g.fillStyle = "#f4f6f8"; g.fillRect(0, 0, 256, 460); g.fillStyle = "#e5323f"; g.fillRect(0, 0, 256, 70); g.fillStyle = "#fff"; g.font = '900 34px "DejaVu Sans"'; g.textAlign = "center"; g.fillText("macaco.oficial", 128, 48);
  g.fillStyle = "#7a4a2a"; g.beginPath(); g.arc(128, 180, 70, 0, 7); g.fill(); g.fillStyle = "#f0c89a"; g.beginPath(); g.ellipse(128, 195, 48, 42, 0, 0, 7); g.fill(); g.fillStyle = "#141014"; g.beginPath(); g.arc(108, 175, 9, 0, 7); g.arc(148, 175, 9, 0, 7); g.fill();
  g.fillStyle = "#141014"; g.font = '900 44px "DejaVu Sans"'; g.fillText(n, 128, 330); g.font = '700 26px "DejaVu Sans"'; g.fillText("seguidores", 128, 365); scrTex.needsUpdate = true; }
let scrKey = "";
// ---------- businessman (bean with hat + suit) ----------
const MAN = (() => { const g = grp(scene); const suit = toon(0x3a3f4a), skin = toon(0xf0d0b0), ink = toon(0x1a1214);
  const b = add(CAPS, suit, 0, 0.8, 0, g); b.scale.set(0.32, 0.45, 0.28); add(SPH, skin, 0, 1.6, 0, g).scale.setScalar(0.28); const tie = add(CONE, toon(0xc0392b), 0, 1.15, 0.27, g); tie.scale.set(0.06, 0.3, 0.03); tie.rotation.x = Math.PI;
  add(CYL, ink, 0, 1.84, 0, g).scale.set(0.3, 0.05, 0.3); add(CYL, ink, 0, 1.97, 0, g).scale.set(0.2, 0.25, 0.2);
  for (const s of [-1, 1]) add(SPH, ink, s * 0.09, 1.63, 0.25, g).scale.set(0.025, 0.03, 0.02); const sm = add(new THREE.TorusGeometry(0.08, 0.014, 6, 16, Math.PI), ink, 0, 1.52, 0.26, g); sm.rotation.z = Math.PI;
  const arm = grp(g, 0.34, 1.2, 0); add(CAPS, suit, 0, -0.25, 0, arm).scale.set(0.07, 0.22, 0.07); add(SPH, skin, 0, -0.5, 0, arm).scale.setScalar(0.07); const ban = add(BANANA_GEO, bananaMat, 0, -0.58, 0.05, arm); ban.rotation.y = Math.PI / 2;
  box(0.4, 0.3, 0.1, toon(0x5a3a22), -0.42, 0.45, 0, g); return { g, arm, ban }; })();
// ---------- bulldozer ----------
const DOZER = (() => { const g = grp(scene); const y = toon(0xf2b81f), d = toon(0x2a2a30); box(2.4, 1.0, 1.6, y, 0, 0.5, 0, g); box(1.1, 1.0, 1.3, y, -0.4, 1.5, 0, g); add(new THREE.PlaneGeometry(0.9, 0.6), toon(0x9fd8ff), 0.16, 2.0, 0, g).rotation.y = Math.PI / 2;
  for (const s of [-1, 1]) box(2.8, 0.55, 0.4, d, 0, 0, s * 0.95, g); box(0.25, 1.1, 2.4, y, 1.55, 0.05, 0, g); return g; })();
// ---------- banana pile (instanced) ----------
const PILE = new THREE.InstancedMesh(BANANA_GEO, bananaMat, 400); scene.add(PILE); PILE.castShadow = true; PILE.frustumCulled = false;
const PILEPOS = []; for (let i = 0; i < 400; i++) { const lvl = Math.floor(Math.cbrt(i * 1.6)); const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * (1.3 - lvl * 0.15); PILEPOS.push([Math.cos(a) * r, 0.05 + lvl * 0.13 + rnd() * 0.06, Math.sin(a) * r, rnd() * 6.28, rnd() * 6.28]); }
const M4 = new THREE.Matrix4(), QQ = new THREE.Quaternion(), EE = new THREE.Euler(), V = new THREE.Vector3(), S1 = new THREE.Vector3(1, 1, 1);
function setPile(p) { const n = Math.round(p.n ?? 0); for (let i = 0; i < n; i++) { const [x, y, z, a, b] = PILEPOS[i]; QQ.setFromEuler(EE.set(a, b, 0)); M4.compose(V.set(p.pos[0] + x, y, p.pos[2] + z), QQ, S1); PILE.setMatrixAt(i, M4); } PILE.count = n; PILE.instanceMatrix.needsUpdate = true; PILE.visible = n > 0; }
// ---------- sky + light ----------
const [skyC, skyG] = cv(64, 512); const skyTex = tex(skyC, false); const SKY = add(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false })); SKY.renderOrder = -1;
const LP = { day: { top: "#4aa0e0", mid: "#a8d8f0", hor: "#e8f4e0", hemi: [0xfff4e0, 0x406a30, 1.05], sun: [0xfff0d0, 2.3], dir: [-0.5, 0.85, 0.5], fog: 0xd8ecd8, fogN: 35 },
  dusk: { top: "#3a3a7a", mid: "#e0785a", hor: "#ffc070", hemi: [0xffc890, 0x5a3a40, 0.9], sun: [0xffa860, 2.3], dir: [-0.8, 0.3, 0.5], fog: 0xe8a070, fogN: 30 } };
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 140 }); scene.add(sun, sun.target);
let skyKey = ""; function applyLight(name, look) { const L = LP[name]; if (skyKey !== name) { skyKey = name; const gr = skyG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, L.top); gr.addColorStop(0.42, L.mid); gr.addColorStop(0.5, L.hor); gr.addColorStop(1, L.hor); skyG.fillStyle = gr; skyG.fillRect(0, 0, 64, 512); skyTex.needsUpdate = true; }
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2]; sun.color.setHex(L.sun[0]); sun.intensity = L.sun[1]; const d = new THREE.Vector3(...L.dir).normalize(); sun.target.position.set(look[0], 0, look[2]); sun.position.copy(sun.target.position).addScaledVector(d, 60); sun.target.updateMatrixWorld();
  scene.fog.color.setHex(L.fog); scene.fog.near = L.fogN; scene.fog.far = L.fogN * 4; }
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } }); GROUND.castShadow = DIRT.castShadow = false;
// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 4.8 * Math.min(W, H) / 1080 }, vig: { value: 0.35 }, shake: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.012, 0.04, e) * (1.0 - smoothstep(55.0, 150.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 20.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.85, 0.0); }
      c += bl / 12.0; c = mix(c, vec3(0.07, 0.05, 0.05), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
// ---------- render ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 50; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.04 * st.shake; camera.position.y += Math.sin(t * 47) * 0.04 * st.shake; } camera.updateProjectionMatrix();
  applyLight(st.light || "day", c.look);
  // forest state: cut = number of trees already gone; falling = [index, 0..1] trees currently falling
  const cut = st.cut ?? 0; TREES.forEach((T, i) => { const f = (st.falling || []).find((x) => x[0] === i); if (f) { T.t.visible = true; T.stump.visible = false; T.t.rotation.set(0, 0, 0); T.t.rotateOnAxis(new THREE.Vector3(Math.cos(T.fallDir), 0, Math.sin(T.fallDir)), (Math.PI / 2) * f[1] ** 2); }
    else { const gone = i < cut; T.t.visible = !gone; T.stump.visible = gone; T.t.rotation.set(0, 0, 0); } });
  LAST.t.visible = !st.lastCut; LAST.stump.visible = !!st.lastCut; DIRT.scale.setScalar(1 + 40 * Math.min(1, cut / TREES.length));
  if (st.mon) poseMon(st.mon, t); else MON.g.visible = false; if (st.lion) poseLion(st.lion, t); else LION.g.visible = false;
  if (st.man) { MAN.g.visible = true; MAN.g.position.set(...st.man.pos); MAN.g.rotation.y = st.man.yaw ?? 0; MAN.arm.rotation.x = -1.2 * (st.man.offer ?? 0); MAN.ban.visible = (st.man.offer ?? 0) > 0.3; } else MAN.g.visible = false;
  if (st.dozer) { DOZER.visible = true; DOZER.position.set(...st.dozer.pos); DOZER.rotation.y = st.dozer.yaw ?? 0; } else DOZER.visible = false;
  setPile(st.pile || { n: 0, pos: [0, 0, 0] });
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
const U = Math.min(W, H) / 1080; const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const popS = (k) => (k <= 0 ? 0 : k < 1 ? 0.4 + 0.6 * k + 0.18 * Math.sin(k * Math.PI) : 1);
function postCard(g, e) { const s = popS(e.k); if (!s) return; g.save(); g.translate(W / 2, H * 0.36); g.scale(s, s); g.rotate(0.03); const pw = 560 * U, ph = 760 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -pw / 2 + 12 * U, -ph / 2 + 16 * U, pw, ph, 50 * U); g.fill(); g.fillStyle = "#141418"; rr(g, -pw / 2, -ph / 2, pw, ph, 50 * U); g.fill();
  g.save(); rr(g, -pw / 2 + 20 * U, -ph / 2 + 20 * U, pw - 40 * U, ph - 230 * U, 34 * U); g.clip(); g.drawImage(e.img, -pw / 2 + 20 * U, -ph / 2 + 20 * U, pw - 40 * U, ph - 230 * U); g.restore();
  g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${96 * U}px "Inter", "DejaVu Sans"`; g.fillText(e.n, 0, ph / 2 - 130 * U); g.font = `700 ${40 * U}px "Inter", "DejaVu Sans"`; g.fillStyle = "#c8ccd4"; g.fillText("seguidores", 0, ph / 2 - 60 * U); g.restore(); }
function notif(g, e) { const k = Math.min(1, e.k); if (k <= 0) return; g.save(); g.translate(W / 2, H * 0.14 - (1 - k) * 260 * U); const bw = 920 * U, bh = 190 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 8 * U, -bh / 2 + 12 * U, bw, bh, 40 * U); g.fill(); g.fillStyle = "rgba(250,250,252,0.97)"; rr(g, -bw / 2, -bh / 2, bw, bh, 40 * U); g.fill();
  g.font = `${100 * U}px "Noto Color Emoji"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("🦁", -bw / 2 + 100 * U, 6 * U); g.textAlign = "left"; g.fillStyle = "#141418"; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.fillText("leao.rei", -bw / 2 + 190 * U, -30 * U);
  g.font = `600 ${42 * U}px "Inter", "DejaVu Sans"`; g.fillStyle = "#3a3d44"; g.fillText("começou a seguir você", -bw / 2 + 190 * U, 34 * U); g.fillStyle = "#8a8d94"; g.font = `600 ${34 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "right"; g.fillText("agora", bw / 2 - 40 * U, -40 * U); g.restore(); }
function followBtn(g, e, t) { const s = popS(Math.min(1, e.k)) * (1 + 0.06 * Math.sin(t * 10)); if (!s) return; g.save(); g.translate(W / 2, H * 0.84); g.scale(s, s); const bw = 470 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, bh / 2); g.fill(); g.fillStyle = "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+ Seguir", 0, 4 * U); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 160 * U, 110 * U + Math.sin(t * 6) * 15 * U); g.restore(); }
const snap = document.createElement("canvas"); snap.width = Math.round(W / 2); snap.height = Math.round(H / 2);
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  if (S.post) { renderState(S.post.inner, t); snap.getContext('2d').drawImage(glc, 0, 0, snap.width, snap.height); }
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.post) postCard(og, { ...S.post, img: snap }); if (S.notif) notif(og, S.notif); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
