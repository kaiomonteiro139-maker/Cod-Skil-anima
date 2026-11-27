// ---------- backyard ----------
scene.background = new THREE.Color(0xa8d4f0);
const YARD = grp(scene);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f8ee0"); gr.addColorStop(0.45, "#a8d4f0"); gr.addColorStop(0.5, "#eaf4f0"); gr.addColorStop(1, "#eaf4f0"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false }), 0, 0, 0, YARD); SKY.renderOrder = -1;
const grassTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#5fb04a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1400; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(60,130,50,0.6)" : "rgba(140,210,100,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 4, y - 6 - rnd() * 8); g.stroke(); } const t = tex(c); return t; })();
const HOLE_PTS = Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2, r = 0.6 + Math.sin(i * 5.1) * 0.04; return [Math.cos(a) * r, Math.sin(a) * r]; });
const GRASS = (() => { const sh = new THREE.Shape(); sh.moveTo(-60, -60); sh.lineTo(60, -60); sh.lineTo(60, 60); sh.lineTo(-60, 60); sh.lineTo(-60, -60);
  const hp = new THREE.Path(); HOLE_PTS.forEach(([x, y], i) => (i ? hp.lineTo(x, y) : hp.moveTo(x, y))); hp.closePath(); sh.holes.push(hp);
  const geo = new THREE.ShapeGeometry(sh, 4); const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 3, p.getY(i) / 3);
  grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; const m = add(geo, toon(0xffffff, grassTex), 0, 0, 0, YARD); m.rotation.x = -Math.PI / 2; return m; })();
const SNOW = GRASS;
const PIT = (() => { const g = grp(YARD); const wall = add(new THREE.CylinderGeometry(0.6, 0.6, 6, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x3a2414, side: THREE.BackSide }), 0, -3, 0, g); const bot = add(new THREE.CircleGeometry(0.6, 32), basic(0x050302), 0, -2.0, 0, g); bot.rotation.x = -Math.PI / 2;
  const [c, x] = cv(64, 512); const gr = x.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#4a2c18"); gr.addColorStop(0.06, "#1a0e06"); gr.addColorStop(0.2, "#000000"); gr.addColorStop(1, "#000000"); x.fillStyle = gr; x.fillRect(0, 0, 64, 512); wall.material = new THREE.MeshBasicMaterial({ map: tex(c, false), side: THREE.BackSide }); return g; })();
const DIRT = (() => { const g = grp(YARD, -1.5, 0, -0.7); for (let i = 0; i < 9; i++) { const m = add(SPH, toon(0x7a4a28), (rnd() - 0.5) * 0.7, 0.05, (rnd() - 0.5) * 0.6, g); m.scale.set(0.3 + rnd() * 0.2, 0.18 + rnd() * 0.15, 0.3); } return g; })();
const HOUSE = (() => { const g = grp(YARD, 0, 0, -5); box(9, 3.2, 0.3, toon(0xf2e4c8), 0, 0, 0, g); box(1.1, 2.1, 0.08, toon(0xa8582a), 1.8, 0, 0.18, g); for (const x of [-2.4, -0.6]) { box(1.2, 1.0, 0.08, toon(0x8fc8f0), x, 1.2, 0.18, g); box(1.36, 0.1, 0.12, toon(0xffffff), x, 1.15, 0.2, g); } box(9.4, 0.3, 1.2, toon(0xb8483a), 0, 3.2, 0.3, g); return g; })();
for (let i = -7; i <= 7; i++) { const p = box(0.12, 1.0, 0.08, toon(0xf6f2e8), i * 0.5, 0, 3.5, YARD); } box(7.2, 0.08, 0.06, toon(0xf6f2e8), 0, 0.7, 3.46, YARD);
function tree(x, z, s) { const g = grp(YARD, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x6a4428), 0, 0.6, 0, g).scale.set(0.16, 1.2, 0.16); for (const [a, b, c, r] of [[0, 1.6, 0, 0.7], [0.4, 1.4, 0.2, 0.5], [-0.4, 1.45, -0.1, 0.55]]) add(SPH, toon(0x3f9a3a), a, b, c, g).scale.setScalar(r); }
tree(-4, -3, 1.4); tree(4.5, -2.5, 1.2); tree(-5, 2, 1.1);
const TOP = 0;
// ---------- space + Earth cutaway ----------
const SPACE = grp(scene); SPACE.visible = false;
const STARS = (() => { const n = 1500, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const v = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(80 + rnd() * 20); pos.set([v.x, v.y, v.z], i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35 })); SPACE.add(m); return m; })();
const R = 3;
const EARTH = (() => { const g = grp(SPACE); const [c, x] = cv(1024, 512); x.fillStyle = "#2f7fd8"; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 26; i++) { const cx = rnd() * 1024, cy = 90 + rnd() * 330; x.fillStyle = rnd() < 0.7 ? "#4fb04a" : "#c8a860"; x.beginPath(); for (let k = 0; k < 9; k++) { const a = (k / 9) * 6.28, r = 30 + rnd() * 50; k ? x.lineTo(cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r) : x.moveTo(cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r); } x.fill(); }
  x.fillStyle = "#f4f8ff"; x.fillRect(0, 0, 1024, 30); x.fillRect(0, 482, 1024, 30);
  add(new THREE.SphereGeometry(R, 64, 48, Math.PI, Math.PI * 1.5), toon(0xffffff, tex(c, false)), 0, 0, 0, g);
  const [lc, lx] = cv(512, 512); for (const [r, col] of [[1, "#7a4a2a"], [0.985, "#c8442a"], [0.8, "#e0622a"], [0.55, "#f29a2a"], [0.36, "#ffd04a"], [0.19, "#fff6b0"]]) { const gr = lx.createRadialGradient(256, 256, 0, 256, 256, 256 * r); gr.addColorStop(0, col); gr.addColorStop(1, col); lx.fillStyle = col; lx.beginPath(); lx.arc(256, 256, 256 * r, 0, 7); lx.fill(); }
  const lt = tex(lc, false); const fm = new THREE.MeshBasicMaterial({ map: lt, side: THREE.DoubleSide });
  const fA = add(new THREE.CircleGeometry(R, 64, -Math.PI / 2, Math.PI), fm, 0, 0, 0, g); fA.rotation.y = -Math.PI / 2;
  const fB = add(new THREE.CircleGeometry(R, 64, -Math.PI / 2, Math.PI), fm, 0, 0, 0, g);
  const tun = add(new THREE.CylinderGeometry(0.05, 0.05, 2 * R, 12), basic(0x140a06), 0.06, 0, 0.06, g);
  const glow = (() => { const [c2, x2] = cv(128, 128); const gr = x2.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,240,150,0.9)"); gr.addColorStop(1, "rgba(255,160,40,0)"); x2.fillStyle = gr; x2.fillRect(0, 0, 128, 128); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(c2, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.position.set(0.3, 0, 0.3); s.scale.setScalar(1.6); g.add(s); return s; })();
  return { g, tun, glow }; })();
function textSprite(text, bg, fg = "#140c10") { const [c, x] = cv(512, 128); x.fillStyle = bg; x.beginPath(); x.roundRect(6, 6, 500, 116, 58); x.fill(); x.lineWidth = 10; x.strokeStyle = "#140c10"; x.stroke(); x.fillStyle = fg; x.font = "900 60px DejaVu Sans"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 256, 68); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(c, false), transparent: true, depthTest: false })); s.scale.set(1.6, 0.4, 1); s.renderOrder = 5; SPACE.add(s); return s; }
const PINBR = textSprite("BRASIL", "#3fbf5a", "#fff"); PINBR.position.set(0.2, R + 0.45, 0.2);
const PINJP = textSprite("JAPÃO", "#ffffff"); PINJP.position.set(0.2, -R - 0.45, 0.2);
const PINS = [PINBR, PINJP];
// ---------- the guy (blocky, winter clothes) ----------
const cbox = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const GUY = (() => { const g = grp(scene); const root = grp(g, 0, 0.95, 0); const body = grp(root); const red = toon(0xd8343a), jean = toon(0x2a3f7a), skin = toon(0x9a6440), ink = toon(0x141014), wht = basic(0xffffff), hat = toon(0x2d6fd0), shoe = toon(0x1e1e22);
  const torso = cbox(0.56, 0.66, 0.32, red, 0, 0.36, 0, body); cbox(0.2, 0.06, 0.33, toon(0xb02a30), 0, 0.12, 0.0, body);
  const neck = grp(body, 0, 0.72, 0); const head = grp(neck, 0, 0.2, 0); add(SPH, skin, 0, 0, 0, head).scale.set(0.2, 0.22, 0.2);
  const cap = add(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hat, 0, 0.04, -0.01, head); cap.scale.set(0.215, 0.2, 0.215); add(new THREE.TorusGeometry(0.2, 0.04, 8, 24), toon(0xffffff), 0, 0.05, -0.01, head).rotation.x = Math.PI / 2; add(SPH, toon(0xffffff), 0, 0.25, -0.01, head).scale.setScalar(0.06);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.0, 0.18); const w = add(SPH, wht, 0, 0, 0, e); w.scale.set(0.045, 0.05, 0.02); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.028, 0.012); const br = add(CYL, ink, 0, 0.065, 0.01, e); br.scale.set(0.01, 0.06, 0.01); br.rotation.z = Math.PI / 2; eyes.push({ w, p, br, s }); }
  const mouth = add(SPH, toon(0x5a1a1a), 0, -0.1, 0.18, head); mouth.scale.set(0.05, 0.015, 0.015); const smile = add(new THREE.TorusGeometry(0.06, 0.014, 6, 14, Math.PI), ink, 0, -0.06, 0.19, head); smile.rotation.z = Math.PI;
  const arms = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.36, 0.62, 0); cbox(0.16, 0.6, 0.18, red, 0, -0.28, 0, pv); add(SPH, skin, 0, -0.62, 0, pv).scale.setScalar(0.085); arms.push(pv); }
  const shovel = grp(arms[1], 0, -0.62, 0.02); cbox(0.04, 1.1, 0.04, toon(0x8a5a32), 0, 0.05, 0.12, shovel).rotation.x = 1.2; const bl = cbox(0.22, 0.03, 0.28, toon(0x9aa4ac), 0, 0.27, 0.66, shovel); bl.rotation.x = 1.2; shovel.visible = false;
  const legs = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.14, 0.04, 0); cbox(0.22, 0.86, 0.24, jean, 0, -0.45, 0, pv); cbox(0.23, 0.12, 0.34, shoe, 0, -0.9, 0.05, pv); legs.push(pv); }
  return { g, root, body, neck, head, eyes, mouth, smile, arms, legs, shovel };
})();
/** guy: { pos, yaw, sink (m below ice), prone 0..1, roll (rad, spin on the long axis), arms 'flail'|'forward'|'up'|'down'|'wave', kick, walk phase, face 'scared'|'calm'|'happy', headYaw, lean } */
function poseGuy(p, t) { const G = GUY; G.g.visible = true; G.g.position.set(p.pos[0], p.pos[1] - (p.sink ?? 0), p.pos[2]); G.g.rotation.set(0, p.yaw ?? 0, 0);
  const pr = p.prone ?? 0, w = p.walk; G.root.rotation.set(pr * Math.PI / 2 + (p.lean ?? 0), 0, 0); G.root.position.y = 0.95 - pr * 0.75 + (w != null ? Math.abs(Math.sin(w * 7)) * 0.04 : 0) + (p.bob ? Math.sin(t * 3) * 0.04 : 0);
  G.root.rotation.y = 0; G.body.rotation.y = 0; G.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), p.roll ?? 0);
  const A = p.arms ?? "down"; G.arms.forEach((a, i) => { const s = i ? 1 : -1; let x = 0, z = s * 0.08;
    if (w != null && A === "down") x = Math.sin(w * 7 + i * Math.PI) * 0.6;
    if (A === "flail") { x = -2.4 + Math.sin(t * 14 + i * 2) * 0.7; z = s * (0.5 + Math.sin(t * 11 + i) * 0.3); }
    if (A === "forward") { x = -1.45 + Math.sin(t * 2 + i) * 0.05; z = s * 0.1; }
    if (A === "pull") { x = -1.5 + Math.sin(t * 5 + i * Math.PI) * 0.25; z = s * 0.15; }
    if (A === "up") { x = -2.9; z = s * 0.3; }
    if (A === "wave") { x = i ? -2.7 : 0; z = i ? 0.4 + Math.sin(t * 9) * 0.35 : -0.08; }
    if (A === "dig") { x = -0.9 + Math.sin(t * 7) * 0.5; z = s * 0.1; }
    if (A === "tuck") { x = -0.3; z = s * 0.05; }
    a.rotation.set(x, 0, z); });
  G.legs.forEach((l, i) => { let x = w != null ? Math.sin(w * 7 + i * Math.PI) * 0.55 : 0; if (p.kick) x = Math.sin(t * 16 + i * Math.PI) * 0.5; l.rotation.set(x, 0, 0); });
  G.neck.rotation.set(-0.6 * pr + (p.headPitch ?? 0), p.headYaw ?? 0, 0);
  const f = p.face ?? "calm"; G.eyes.forEach((e) => { const bl = ((t * 1000) % 3100) < 110 ? 0.12 : 1; const big = f === "scared" ? 1.35 : 1; e.w.scale.set(0.045 * big, 0.05 * big * bl, 0.02); e.p.scale.set(0.022 * (f === "scared" ? 0.8 : 1), 0.028 * bl, 0.012); e.br.position.y = f === "scared" ? 0.09 : 0.065; e.br.rotation.z = Math.PI / 2 + e.s * (f === "scared" ? -0.35 : f === "happy" ? 0.1 : 0); });
  G.mouth.scale.set(f === "scared" ? 0.045 : f === "happy" ? 0.065 : 0.05, f === "scared" ? 0.05 + 0.015 * Math.sin(t * 20) : f === "happy" ? 0.03 : 0.015, 0.015); G.shovel.visible = !!p.shovel; G.mouth.position.y = -0.1; G.mouth.visible = f !== "happy"; G.smile.visible = f === "happy"; }
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const CLODS = Array.from({ length: 10 }, () => { const m = add(SPH, toon(0x7a4a28)); m.scale.setScalar(0.06); return m; });
