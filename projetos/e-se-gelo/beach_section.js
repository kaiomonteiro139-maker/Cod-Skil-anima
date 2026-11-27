// ---------- frozen lake ----------
scene.background = new THREE.Color(0xc8d8e8);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#6f8fb8"); gr.addColorStop(0.45, "#b8c8dc"); gr.addColorStop(0.5, "#e8eef6"); gr.addColorStop(1, "#e8eef6"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const iceTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#bfe0f0"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 60; i++) { g.strokeStyle = rnd() < 0.5 ? "rgba(255,255,255,0.7)" : "rgba(140,190,220,0.5)"; g.lineWidth = 2 + rnd() * 4; g.beginPath(); const x = rnd() * 512, y = rnd() * 512; g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 160, y + (rnd() - 0.5) * 40); g.stroke(); } for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); } const t = tex(c); t.repeat.set(8, 8); return t; })();
// ice sheet with a jagged hole at the origin
const HOLE_PTS = Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2, r = 0.95 + (i % 2 ? 0.18 : -0.05) + Math.sin(i * 7.3) * 0.08; return [Math.cos(a) * r, Math.sin(a) * r]; });
const ICE = (() => { const sh = new THREE.Shape(); sh.moveTo(-60, -60); sh.lineTo(60, -60); sh.lineTo(60, 60); sh.lineTo(-60, 60); sh.lineTo(-60, -60);
  const hp = new THREE.Path(); HOLE_PTS.forEach(([x, y], i) => (i ? hp.lineTo(x, y) : hp.moveTo(x, y))); hp.closePath(); sh.holes.push(hp);
  const geo = new THREE.ShapeGeometry(sh, 4); const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 10, p.getY(i) / 10);
  const m = add(geo, toon(0xffffff, iceTex), 0, 0, 0); m.rotation.x = -Math.PI / 2; m.visible = false; return m; })();
const ICEFULL = add(new THREE.PlaneGeometry(120, 120), toon(0xffffff, iceTex), 0, 0, 0); ICEFULL.rotation.x = -Math.PI / 2;
const SNOW = ICEFULL;
const WATER = add(new THREE.CircleGeometry(1.6, 32), toon(0x123a5a), 0, -0.12, 0); WATER.rotation.x = -Math.PI / 2; WATER.visible = false;
const RIM = (() => { const g = grp(scene); for (let i = 0; i < 18; i++) { const [x, y] = HOLE_PTS[i]; const k = add(new THREE.BoxGeometry(1, 1, 1), toon(0xe6f4fb), x * 1.03, -0.02, -y * 1.03, g); k.scale.set(0.32, 0.1, 0.16); k.rotation.y = Math.atan2(y, x) + Math.PI / 2; k.rotation.z = Math.sin(i * 3.1) * 0.15; } g.visible = false; return g; })();
const CHUNKS = Array.from({ length: 4 }, (_, i) => { const k = add(new THREE.BoxGeometry(1, 1, 1), toon(0xd8eef8), 0, -0.06, 0); k.scale.set(0.24 + 0.06 * (i % 2), 0.06, 0.2); k.visible = false; return k; });
const CRACK = (() => { const [c, g] = cv(512, 512); g.strokeStyle = "rgba(40,90,130,0.85)"; g.lineCap = "round"; const br = (x, y, a, l, w, d) => { if (d > 4 || l < 8) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); br(x2, y2, a + (rnd() - 0.5) * 0.9, l * 0.7, w * 0.7, d + 1); if (rnd() < 0.5) br(x2, y2, a + (rnd() - 0.5) * 1.6, l * 0.5, w * 0.6, d + 1); }; for (let i = 0; i < 11; i++) { const a0 = (i / 11) * 6.28 + rnd() * 0.4; br(256 + Math.cos(a0) * 108, 256 + Math.sin(a0) * 108, a0, 60, 7, 0); }
  const m = add(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: tex(c, false), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), 0, 0.006, 0); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; return m; })();
// footprints from the shore (+z) to the hole
for (let i = 0; i < 16; i++) { const f = add(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: 0x9cc4dc }), (i % 2 ? 0.13 : -0.13), 0.004, 1.4 + i * 0.55); f.rotation.x = -Math.PI / 2; f.scale.set(1, 1.6, 1); }
// shores: snow banks + pines
function pine(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x5a3a22), 0, 0.4, 0, g).scale.set(0.12, 0.8, 0.12); for (let k = 0; k < 3; k++) { add(CONE, toon(0x2f6a4a), 0, 1.0 + k * 0.6, 0, g).scale.set(1.0 - k * 0.25, 1.0, 1.0 - k * 0.25); add(CONE, toon(0xffffff), 0, 1.15 + k * 0.6, 0, g).scale.set(0.75 - k * 0.2, 0.55, 0.75 - k * 0.2); } return g; }
for (let i = 0; i < 14; i++) { const a = rnd(); pine(-14 + i * 2.2 + rnd(), -16 - rnd() * 4, 2.2 + rnd() * 1.2); }
for (let i = 0; i < 10; i++) pine(-12 + i * 2.6 + rnd(), 11 + rnd() * 3, 2 + rnd());
for (let i = 0; i < 20; i++) { const m = add(SPH, toon(0xf6faff), -20 + i * 2.2, -0.4, -14 - rnd() * 2); m.scale.set(2.5, 1.0, 1.6); }
for (let i = 0; i < 20; i++) { const m = add(SPH, toon(0xf6faff), -20 + i * 2.2, -0.4, 9 + rnd() * 1.5); m.scale.set(2.5, 0.8, 1.4); }
const SIGN = (() => { const g = grp(scene, 2.4, 0, 8.2); add(CYL, toon(0x6a4428), 0, 0.6, 0, g).scale.set(0.06, 1.2, 0.06); const [c, x] = cv(256, 128); x.fillStyle = "#f2c230"; x.fillRect(0, 0, 256, 128); x.fillStyle = "#1a1214"; x.font = "900 44px DejaVu Sans"; x.textAlign = "center"; x.fillText("GELO", 128, 55); x.fillText("FINO!", 128, 105); const p = add(new THREE.PlaneGeometry(0.9, 0.45), toon(0xffffff, tex(c, false)), 0, 1.25, 0.04, g); return g; })();
const TOP = 0;
// ---------- the guy (blocky, winter clothes) ----------
const cbox = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const GUY = (() => { const g = grp(scene); const root = grp(g, 0, 0.95, 0); const body = grp(root); const red = toon(0xd8343a), jean = toon(0x2a3f7a), skin = toon(0x9a6440), ink = toon(0x141014), wht = basic(0xffffff), hat = toon(0x2d6fd0), shoe = toon(0x1e1e22);
  const torso = cbox(0.56, 0.66, 0.32, red, 0, 0.36, 0, body); cbox(0.2, 0.06, 0.33, toon(0xb02a30), 0, 0.12, 0.0, body);
  const neck = grp(body, 0, 0.72, 0); const head = grp(neck, 0, 0.2, 0); add(SPH, skin, 0, 0, 0, head).scale.set(0.2, 0.22, 0.2);
  const cap = add(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hat, 0, 0.04, -0.01, head); cap.scale.set(0.215, 0.2, 0.215); add(new THREE.TorusGeometry(0.2, 0.04, 8, 24), toon(0xffffff), 0, 0.05, -0.01, head).rotation.x = Math.PI / 2; add(SPH, toon(0xffffff), 0, 0.25, -0.01, head).scale.setScalar(0.06);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.0, 0.18); const w = add(SPH, wht, 0, 0, 0, e); w.scale.set(0.045, 0.05, 0.02); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.028, 0.012); const br = add(CYL, ink, 0, 0.065, 0.01, e); br.scale.set(0.01, 0.06, 0.01); br.rotation.z = Math.PI / 2; eyes.push({ w, p, br, s }); }
  const mouth = add(SPH, toon(0x5a1a1a), 0, -0.1, 0.18, head); mouth.scale.set(0.05, 0.015, 0.015); const smile = add(new THREE.TorusGeometry(0.06, 0.014, 6, 14, Math.PI), ink, 0, -0.06, 0.19, head); smile.rotation.z = Math.PI;
  const arms = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.36, 0.62, 0); cbox(0.16, 0.6, 0.18, red, 0, -0.28, 0, pv); add(SPH, skin, 0, -0.62, 0, pv).scale.setScalar(0.085); arms.push(pv); }
  const legs = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.14, 0.04, 0); cbox(0.22, 0.86, 0.24, jean, 0, -0.45, 0, pv); cbox(0.23, 0.12, 0.34, shoe, 0, -0.9, 0.05, pv); legs.push(pv); }
  return { g, root, body, neck, head, eyes, mouth, smile, arms, legs };
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
    if (A === "tuck") { x = -0.3; z = s * 0.05; }
    a.rotation.set(x, 0, z); });
  G.legs.forEach((l, i) => { let x = w != null ? Math.sin(w * 7 + i * Math.PI) * 0.55 : 0; if (p.kick) x = Math.sin(t * 16 + i * Math.PI) * 0.5; l.rotation.set(x, 0, 0); });
  G.neck.rotation.set(-0.6 * pr + (p.headPitch ?? 0), p.headYaw ?? 0, 0);
  const f = p.face ?? "calm"; G.eyes.forEach((e) => { const bl = ((t * 1000) % 3100) < 110 ? 0.12 : 1; const big = f === "scared" ? 1.35 : 1; e.w.scale.set(0.045 * big, 0.05 * big * bl, 0.02); e.p.scale.set(0.022 * (f === "scared" ? 0.8 : 1), 0.028 * bl, 0.012); e.br.position.y = f === "scared" ? 0.09 : 0.065; e.br.rotation.z = Math.PI / 2 + e.s * (f === "scared" ? -0.35 : f === "happy" ? 0.1 : 0); });
  G.mouth.scale.set(f === "scared" ? 0.045 : f === "happy" ? 0.065 : 0.05, f === "scared" ? 0.05 + 0.015 * Math.sin(t * 20) : f === "happy" ? 0.03 : 0.015, 0.015); G.mouth.position.y = -0.1; G.mouth.visible = f !== "happy"; G.smile.visible = f === "happy"; }
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const SPLASH = Array.from({ length: 26 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xe8f6ff, transparent: true, depthWrite: false })); scene.add(s); return s; });
const BREATH = Array.from({ length: 3 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false })); scene.add(s); return s; });
const RING = (() => { const m = add(new THREE.RingGeometry(0.9, 1.0, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false }), 0, -0.1, 0); m.rotation.x = -Math.PI / 2; return m; })();
const FLAKES = (() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 10; pos[i * 3 + 1] = rnd() * 6; pos[i * 3 + 2] = (rnd() - 0.5) * 10; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOT, color: 0xffffff, size: 0.06, transparent: true, depthWrite: false })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
