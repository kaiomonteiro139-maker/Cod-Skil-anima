// ---------- night forest ----------
scene.background = new THREE.Color(0x0c1430);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#060a1c"); gr.addColorStop(0.45, "#16224a"); gr.addColorStop(0.5, "#1c2a50"); gr.addColorStop(1, "#1c2a50"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const MOON = add(new THREE.CircleGeometry(4, 32), new THREE.MeshBasicMaterial({ color: 0xe8e2c0, transparent: true, opacity: 0.6 }), 18, 30, -80);
const STARS = (() => { const n = 400, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = rnd() * 6.28, e = 0.2 + rnd() * 1.2; pos.set([Math.cos(a) * 120 * Math.cos(e), 120 * Math.sin(e), Math.sin(a) * 120 * Math.cos(e)], i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 })); scene.add(m); return m; })();
const GROUND = add(new THREE.PlaneGeometry(120, 120), toon(0x1e3a2a), 0, 0, 0); GROUND.rotation.x = -Math.PI / 2;
function ptree(x, z, s, col = 0x1a3a2a) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x3a2a20), 0, 1.0, 0, g).scale.set(0.18, 2.0, 0.18); for (let k = 0; k < 3; k++) add(CONE, toon(col), 0, 1.6 + k * 0.7, 0, g).scale.set(1.2 - k * 0.3, 1.3, 1.2 - k * 0.3); return g; }
for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI - Math.PI, r = 5 + rnd() * 14; ptree(Math.cos(a) * r * 1.4, -3 - rnd() * 16, 1.2 + rnd() * 1.4, [0x163024, 0x1a3a2a, 0x12281e][i % 3]); }
for (let i = 0; i < 30; i++) { const b = add(SPH, toon(0x22462e), (rnd() - 0.5) * 12, 0.1, -1 - rnd() * 4); b.scale.set(0.4 + rnd() * 0.4, 0.3 + rnd() * 0.2, 0.4); }
const TRUNK = add(CYL, toon(0x4a3426), -1.3, 1.5, -0.3); TRUNK.scale.set(0.35, 3.0, 0.35);
const BRANCH = add(CYL, toon(0x5a3e2c), -0.4, 1.2, 0.05); BRANCH.scale.set(0.08, 1.9, 0.08); BRANCH.rotation.z = Math.PI / 2 + 0.05;
for (const [x, y] of [[0.3, 1.32], [-0.1, 1.28], [0.45, 1.25]]) { const l = add(SPH, toon(0x2a5a34), x, y, 0.05); l.scale.set(0.09, 0.03, 0.06); l.rotation.z = 0.5; }
const HIDE = add(SPH, toon(0x1e3a26), -1.5, 3.4, -0.4); HIDE.scale.set(1.6, 1.0, 1.4);
const TOP = 0;
// ---------- the owlet ----------
const OWL = (() => { const g = grp(scene); const root = grp(g); const fl = toon(0x9a8a7a), lt = toon(0xe8dcc8), dk = toon(0x6a5a4c), ink = toon(0x141014), org = toon(0xf2a030), wht = basic(0xffffff);
  const body = add(SPH, fl, 0, 0.22, 0, root); body.scale.set(0.2, 0.22, 0.18); const bel = add(SPH, lt, 0, 0.2, 0.08, root); bel.scale.set(0.14, 0.16, 0.12);
  for (let k = 0; k < 6; k++) { const s = add(SPH, dk, (k % 3 - 1) * 0.05, 0.14 + Math.floor(k / 3) * 0.07, 0.19, root); s.scale.set(0.015, 0.008, 0.005); }
  const head = grp(root, 0, 0.47, 0.02); add(SPH, fl, 0, 0, 0, head).scale.set(0.2, 0.17, 0.17); const disc = add(SPH, lt, 0, -0.01, 0.1, head); disc.scale.set(0.16, 0.12, 0.08);
  for (const s of [-1, 1]) { const tuft = add(CONE, dk, s * 0.13, 0.15, 0, head); tuft.scale.set(0.04, 0.1, 0.03); tuft.rotation.z = -s * 0.4; }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.01, 0.16); const ir = add(SPH, new THREE.MeshBasicMaterial({ color: 0xffc830 }), 0, 0, 0, e); ir.scale.set(0.06, 0.06, 0.025); const pu = add(SPH, basic(0x140c10), 0, 0, 0.018, e); pu.scale.set(0.035, 0.035, 0.012); add(SPH, wht, 0.015, 0.018, 0.028, e).scale.setScalar(0.012);
    const lid = add(SPH, fl, 0, 0.03, 0.006, e); lid.scale.set(0.064, 0.03, 0.03); const br = add(CYL, dk, 0, 0.075, 0.01, e); br.scale.set(0.009, 0.06, 0.009); br.rotation.z = Math.PI / 2; eyes.push({ ir, pu, lid, br, s }); }
  const beak = add(CONE, org, 0, -0.04, 0.2, head); beak.scale.set(0.025, 0.05, 0.02); beak.rotation.x = Math.PI;
  const wings = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.18, 0.3, 0); const w = add(SPH, dk, s * 0.02, -0.09, 0, pv); w.scale.set(0.05, 0.13, 0.11); wings.push(pv); }
  for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) add(SPH, org, s * 0.07 + k * 0.018, 0.01, 0.1, root).scale.set(0.012, 0.012, 0.03);
  return { g, root, head, eyes, wings }; })();
/** owl: { pos, yaw, scared 0..1, shiver, happy, flap, look } */
function poseOwl(p, t) { const O = OWL; O.g.visible = true; O.g.position.set(p.pos[0] + (p.shiver ? Math.sin(t * 60) * 0.005 : 0), p.pos[1], p.pos[2]); O.g.rotation.y = p.yaw ?? 0; const sc = p.scared ?? 0;
  O.head.rotation.y = (p.look ?? 0) + (sc > 0.5 ? Math.sin(t * 2.2) * 0.5 : 0); O.head.rotation.z = Math.sin(t * 1.3) * 0.08; O.root.scale.set(1 - 0.06 * sc, 1 - 0.06 * sc, 1);
  O.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.flap ? 0.5 + Math.sin(t * 22) * 0.5 : sc > 0.5 ? -0.15 : 0.05)));
  O.root.position.y = p.flap ? Math.abs(Math.sin(t * 9)) * 0.06 : 0;
  O.eyes.forEach((e) => { const bl = ((t * 1000) % 2700) < 110 ? 1 : 0; const hap = p.happy ? 1 : 0; e.lid.position.y = hap ? 0.035 : 0.06 - 0.05 * bl; e.lid.scale.y = hap ? 0.04 : 0.03 + 0.04 * bl; e.lid.visible = hap || bl; e.pu.scale.setScalar(sc > 0.5 ? 0.022 : 0.035); e.pu.scale.z = 0.012; e.br.rotation.z = Math.PI / 2 - e.s * (sc > 0.5 ? 0.45 : hap ? -0.15 : 0.1); }); }
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const FLY = (() => { const g = grp(scene); const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(0.35); g.add(glow); const core = add(SPH, basic(0xfffbd0), 0, 0, 0, g); core.scale.setScalar(0.025); const L0 = new THREE.PointLight(0xfff0a0, 0, 4, 1.6); g.add(L0); g.visible = false; return { g, glow, L0 }; })();
const FAR = Array.from({ length: 14 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(0.12); scene.add(s); s.visible = false; return s; });
const TEARS = Array.from({ length: 2 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.014, 0.02, 0.014); return d; });
function lerp0(a, b, k) { return a + (b - a) * k; }
