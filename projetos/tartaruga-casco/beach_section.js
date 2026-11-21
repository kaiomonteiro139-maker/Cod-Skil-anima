// ---------- beach ----------
scene.background = new THREE.Color(0x8fd0f0);
const sandTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#f2d494"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "200,160,90" : "255,240,200"},0.5)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); } for (let i = 0; i < 20; i++) { g.strokeStyle = "rgba(200,160,90,0.4)"; g.lineWidth = 3; const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 14, 340, y - 14, 512, y); g.stroke(); } const t = tex(c); t.repeat.set(12, 12); return t; })();
const SAND = add(new THREE.PlaneGeometry(80, 80), toon(0xffffff, sandTex), 0, 0, 0); SAND.rotation.x = -Math.PI / 2;
const SEA = add(new THREE.PlaneGeometry(200, 120), toon(0x2fa8c8), 0, 0.01, -66); SEA.rotation.x = -Math.PI / 2;
const FOAM = add(new THREE.PlaneGeometry(200, 0.8), basic(0xffffff), 0, 0.02, -6.2); FOAM.rotation.x = -Math.PI / 2;
const WET = add(new THREE.PlaneGeometry(200, 2.5), toon(0xd8b878), 0, 0.005, -4.8); WET.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#2f8fe0"); gr.addColorStop(0.45, "#8fd0f0"); gr.addColorStop(0.5, "#e8f6ff"); gr.addColorStop(1, "#e8f6ff"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.25, "rgba(255,240,170,1)"); gr.addColorStop(0.32, "rgba(255,220,120,0.6)"); gr.addColorStop(1, "rgba(255,200,100,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(26); SUNS.position.set(-12, 30, -60); scene.add(SUNS);
function palm(x, z, s, lean) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); let px = 0, py = 0; for (let i = 0; i < 7; i++) { const sg = add(CYL, toon(0x9a6a3a), px, py + 0.35, 0, g); sg.scale.set(0.16 - i * 0.01, 0.7, 0.16 - i * 0.01); sg.rotation.z = -lean * i / 7; px += Math.sin(lean * i / 7) * 0.7; py += 0.68; }
  const top = grp(g, px, py + 0.1, 0); for (let k = 0; k < 7; k++) { const l = add(SPH, toon(0x3f9a3a), Math.cos(k * 0.9) * 0.7, -0.15, Math.sin(k * 0.9) * 0.7, top); l.scale.set(1.0, 0.07, 0.3); l.rotation.y = -k * 0.9; l.rotation.z = -0.35; } return g; }
palm(-3.2, -2.5, 1.2, 0.35); palm(3.8, -3.5, 1.0, -0.3); palm(-6, -4, 1.1, 0.2);
for (let i = 0; i < 12; i++) { const sh = add(SPH, toon([0xf6c0c8, 0xffffff, 0xf2d0a0][i % 3]), (rnd() - 0.5) * 8, 0.02, (rnd() - 0.3) * 5); sh.scale.set(0.07, 0.03, 0.05); }
const UMB = grp(scene, 2.4, 0, -1.6); add(CYL, toon(0xffffff), 0, 1.2, 0, UMB).scale.set(0.03, 2.4, 0.03); add(new THREE.ConeGeometry(1.2, 0.5, 8, 1, true), toon(0xe5483b, null, { side: THREE.DoubleSide }), 0, 2.35, 0, UMB);
const TOP = 0;
// ---------- the turtle ----------
const shellTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#3f8a3a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#24502a"; g.lineWidth = 10; g.fillStyle = "#58a84a";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 7; x++) { const cx = x * 90 + (y % 2) * 45, cy = y * 75; g.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.lineTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); } g.closePath(); g.fill(); g.stroke(); } return tex(c); })();
const TUR = (() => { const g = grp(scene); const root = grp(g); const skin = toon(0x9ad06a), ink = toon(0x141014), wht = basic(0xffffff), belly = toon(0xf2e0a0);
  const shell = add(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, shellTex), 0, 0.08, 0, root); shell.scale.set(0.42, 0.28, 0.5);
  const rim = add(new THREE.TorusGeometry(1, 0.06, 8, 40), toon(0x2f6a2a), 0, 0.08, 0, root); rim.scale.set(0.42, 0.5, 0.42); rim.rotation.x = Math.PI / 2;
  const plast = add(new THREE.CircleGeometry(1, 32), belly, 0, 0.075, 0, root); plast.scale.set(0.4, 0.48, 1); plast.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) { const l = add(new THREE.PlaneGeometry(0.5, 0.012), toon(0xc8b070), 0, 0.072, -0.2 + i * 0.18, root); l.rotation.x = Math.PI / 2; }
  const head = grp(root, 0, 0.07, 0.52); add(SPH, skin, 0, 0, 0.06, head).scale.set(0.13, 0.11, 0.14); add(CAPS, skin, 0, 0, -0.04, head).scale.set(0.07, 0.06, 0.07);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.07, 0.04, 0.14); add(SPH, wht, 0, 0, 0, e).scale.set(0.035, 0.04, 0.025); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.026, 0.015); add(SPH, wht, 0.008, 0.01, 0.025, e).scale.setScalar(0.007); eyes.push(p); }
  const brows = []; for (const s of [-1, 1]) { const br = add(CYL, ink, s * 0.07, 0.09, 0.14, head); br.scale.set(0.006, 0.05, 0.006); br.rotation.z = Math.PI / 2 + s * 0.4; brows.push(br); }
  const mouth = add(new THREE.TorusGeometry(0.03, 0.007, 6, 14, Math.PI), ink, 0, -0.04, 0.19, head);
  const legs = []; for (const [x, z, s] of [[-0.36, 0.28, -1], [0.36, 0.28, 1], [-0.32, -0.3, -1], [0.32, -0.3, 1]]) { const pv = grp(root, x, 0.06, z); const f = add(SPH, skin, s * 0.1, 0, 0, pv); f.scale.set(0.14, 0.04, 0.07); legs.push(pv); }
  const tail = add(CONE, skin, 0, 0.06, -0.55, root); tail.scale.set(0.04, 0.1, 0.04); tail.rotation.x = -Math.PI / 2;
  return { g, root, head, eyes, brows, mouth, legs };
})();
/** turtle: { pos, yaw, flip 0..1 (1 = on its back), rock (extra tilt), flail, sad, happy } */
function poseTur(p, t) { const T = TUR; T.g.visible = true; T.g.position.set(...p.pos); T.g.rotation.y = p.yaw ?? 0; const f = p.flip ?? 1;
  T.root.rotation.z = f * Math.PI + (p.rock ?? 0) + (p.flail ? Math.sin(t * 9) * 0.04 : 0); T.root.position.y = f * 0.3 + Math.abs(Math.sin(T.root.rotation.z)) * 0.18;
  T.legs.forEach((l, i) => { l.rotation.z = (p.flail ? Math.sin(t * 14 + i * 1.7) * 0.6 : 0); l.rotation.y = (p.flail ? Math.cos(t * 11 + i) * 0.4 : 0); });
  T.head.rotation.x = (p.flail ? Math.sin(t * 6) * 0.2 : 0) - 0.3 * f; T.head.rotation.y = Math.sin(t * 3) * 0.2 * (p.flail ? 1 : 0.3);
  const hap = (p.happy ?? 0) > 0; T.mouth.rotation.z = hap ? Math.PI : 0; T.mouth.position.y = hap ? -0.04 : -0.06; T.brows.forEach((b) => (b.visible = (p.sad ?? 1) > 0.2));
  T.eyes.forEach((e) => (e.scale.y = ((t * 1000) % 2800) < 110 ? 0.003 : 0.026)); }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.025, 0.035, 0.025); return d; });
const HAND = (() => { const g = grp(scene); const m = new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.85 }); const palmM = add(SPH, m, 0, 0, 0, g); palmM.scale.set(0.18, 0.22, 0.08); for (let k = 0; k < 4; k++) add(CAPS, m, -0.12 + k * 0.08, 0.26, 0, g).scale.set(0.035, 0.08, 0.035); const th = add(CAPS, m, 0.2, 0.05, 0, g); th.scale.set(0.035, 0.07, 0.035); th.rotation.z = -0.8; return g; })();
const GLOWS = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.9, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
