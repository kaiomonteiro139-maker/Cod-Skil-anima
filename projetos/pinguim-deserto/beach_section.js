// ---------- desert ----------
scene.background = new THREE.Color(0xf0d8a0);
const duneTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#f0c878"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(200,140,60,0.45)"; g.lineWidth = 4; const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 18, 340, y - 18, 512, y); g.stroke(); } for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "210,150,70" : "255,235,180"},0.5)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); } const t = tex(c); t.repeat.set(12, 12); return t; })();
const DES = add(new THREE.PlaneGeometry(120, 120), toon(0xffffff, duneTex), 0, 0, 0); DES.rotation.x = -Math.PI / 2;
for (const [x, z, sx, sy] of [[-8, -12, 9, 2.4], [6, -16, 11, 3.2], [16, -10, 7, 2.0], [-18, -8, 8, 2.6], [0, -26, 16, 4.5]]) { const d = add(SPH, toon(0xffffff, duneTex), x, -0.2, z); d.scale.set(sx, sy, sx * 0.6); }
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f90d8"); gr.addColorStop(0.45, "#a8d4ee"); gr.addColorStop(0.5, "#fff0c8"); gr.addColorStop(1, "#fff0c8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.28, "rgba(255,230,140,1)"); gr.addColorStop(0.36, "rgba(255,200,90,0.6)"); gr.addColorStop(1, "rgba(255,170,60,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(40); SUNS.position.set(-8, 26, -60); scene.add(SUNS);
function cactus(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); const m = toon(0x4f9a4a); add(CAPS, m, 0, 0.9, 0, g).scale.set(0.22, 0.7, 0.22); for (const sd of [-1, 1]) { const a = grp(g, sd * 0.22, 0.9 + sd * 0.15, 0); add(CAPS, m, sd * 0.18, 0, 0, a).scale.set(0.12, 0.1, 0.12); add(CAPS, m, sd * 0.3, 0.25, 0, a).scale.set(0.12, 0.22, 0.12); } return g; }
cactus(-2.6, -2.2, 1.0); cactus(3.0, -4.0, 1.3); cactus(-5.5, -6, 1.1);
for (let i = 0; i < 8; i++) { const r = add(SPH, toon(0xc8945a), (rnd() - 0.5) * 7, 0.04, (rnd() - 0.4) * 5); const s = 0.08 + rnd() * 0.2; r.scale.set(s * 1.3, s * 0.6, s); }
const SKULL = grp(scene, 1.5, 0, -0.8); add(SPH, toon(0xf4efe6), 0, 0.08, 0, SKULL).scale.set(0.14, 0.1, 0.18);
const TOP = 0;
// ---------- the penguin ----------
const PEN = (() => { const g = grp(scene); const root = grp(g); const blk = toon(0x2a2c38), wht = toon(0xf8f8f8), org = toon(0xf2a030), ink = toon(0x141014), W2 = basic(0xffffff);
  const body = add(SPH, blk, 0, 0.42, 0, root); body.scale.set(0.3, 0.42, 0.27); const bel = add(SPH, wht, 0, 0.38, 0.09, root); bel.scale.set(0.24, 0.34, 0.2);
  const head = grp(root, 0, 0.78, 0.03); add(SPH, blk, 0, 0, 0, head).scale.set(0.22, 0.2, 0.2); const face = add(SPH, wht, 0, -0.02, 0.08, head); face.scale.set(0.17, 0.15, 0.13);
  const beak = add(CONE, org, 0, -0.04, 0.2, head); beak.scale.set(0.05, 0.1, 0.04); beak.rotation.x = Math.PI / 2;
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.07, 0.03, 0.17); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.028, 0.034, 0.015); add(SPH, W2, 0.009, 0.012, 0.012, e).scale.setScalar(0.009); eyes.push(p);
    for (const k of [0]) { const br = add(CYL, ink, 0, 0.05, 0.005, e); br.scale.set(0.006, 0.05, 0.006); br.rotation.z = Math.PI / 2 - s * 0.45; e.userData.br = br; } }
  for (const s of [-1, 1]) add(SPH, toon(0xf6a0a8), s * 0.11, -0.05, 0.14, head).scale.set(0.03, 0.018, 0.01);
  const fl = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.28, 0.55, 0); const f = add(SPH, blk, s * 0.04, -0.15, 0, pv); f.scale.set(0.05, 0.2, 0.1); fl.push(pv); }
  for (const s of [-1, 1]) { const ft = add(SPH, org, s * 0.1, 0.02, 0.12, root); ft.scale.set(0.08, 0.025, 0.12); }
  return { g, root, head, eyes, fl, body };
})();
/** penguin: { pos, yaw, melt 0..1 (droops), hug (flippers around the ice), jump, happy } */
function posePen(p, t) { const P = PEN; P.g.visible = true; P.g.position.set(...p.pos); P.g.rotation.y = p.yaw ?? 0; const m = p.melt ?? 0;
  const j = p.jump ? Math.abs(Math.sin(t * 8)) * 0.18 : 0; P.root.position.y = j; P.root.scale.set(1 + 0.12 * m, 1 - 0.18 * m + 0.02 * Math.sin(t * 2.5), 1 + 0.08 * m); P.head.rotation.x = 0.25 * m; P.head.rotation.z = Math.sin(t * 1.3) * 0.08 * (1 + m);
  P.fl.forEach((f, i) => { f.rotation.z = (i ? 1 : -1) * (p.hug ? -0.9 : 0.15 + 0.4 * m + (p.jump ? Math.abs(Math.sin(t * 16)) * 1.0 : 0)); f.rotation.x = p.hug ? -0.9 : 0; });
  P.eyes.forEach((e) => { e.scale.y = ((t * 1000) % 3000) < 110 ? 0.1 : 1 - 0.4 * m; e.parent.userData.br.visible = (p.happy ?? 0) <= 0; }); }
const SWEAT = Array.from({ length: 4 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.03, 0.042, 0.03); return d; });
const MELT = add(new THREE.CircleGeometry(1, 32), toon(0x8fd0f0, null, { transparent: true, opacity: 0.85 }), 0, 0.006, 0); MELT.rotation.x = -Math.PI / 2;
const ICE = (() => { const g = grp(scene); const m = new THREE.MeshToonMaterial({ color: 0xc8f0ff, gradientMap: gradMap, transparent: true, opacity: 0.85 }); add(new THREE.BoxGeometry(0.3, 0.3, 0.3), m, 0, 0, 0, g); add(new THREE.BoxGeometry(0.31, 0.06, 0.31), basic(0xffffff), 0, 0.12, 0, g); return g; })();
const SPARK = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
