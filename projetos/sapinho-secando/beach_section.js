// ---------- dried-up pond ----------
scene.background = new THREE.Color(0x9fd4f0);
const mudTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#b8935e"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "140,105,60" : "210,180,130"},0.45)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); }
  g.strokeStyle = "rgba(80,55,30,0.85)"; g.lineWidth = 4; for (let i = 0; i < 70; i++) { let x = rnd() * 512, y = rnd() * 512; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 70; y += (rnd() - 0.5) * 70; g.lineTo(x, y); } g.stroke(); } const t = tex(c); t.repeat.set(10, 10); return t; })();
const MUD = add(new THREE.PlaneGeometry(80, 80), toon(0xffffff, mudTex), 0, 0, 0); MUD.rotation.x = -Math.PI / 2;
const BANK = add(new THREE.RingGeometry(6, 40, 48), toon(0x6fa84a), 0, 0.02, 0); BANK.rotation.x = -Math.PI / 2;
const POND = add(new THREE.CircleGeometry(1, 40), toon(0x4f9ac8, null, { transparent: true, opacity: 0.9 }), 0.25, 0.012, 0.75); POND.rotation.x = -Math.PI / 2;
const POND2 = add(new THREE.RingGeometry(0.92, 1.0, 40), basic(0xd8f0ff), 0.25, 0.014, 0.75); POND2.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f9ae0"); gr.addColorStop(0.45, "#9fd4f0"); gr.addColorStop(0.5, "#f0f6e8"); gr.addColorStop(1, "#f0f6e8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.25, "rgba(255,240,170,1)"); gr.addColorStop(0.32, "rgba(255,220,120,0.6)"); gr.addColorStop(1, "rgba(255,200,100,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(26); SUNS.position.set(-10, 28, -60); scene.add(SUNS);
for (let i = 0; i < 30; i++) { const a = rnd() * 6.28, r = 2.5 + rnd() * 3; const g = grp(scene, Math.cos(a) * r, 0, Math.sin(a) * r - 1); for (let k = 0; k < 4; k++) { const rd = add(CYL, toon(0xb8a060), (rnd() - 0.5) * 0.15, 0.35, (rnd() - 0.5) * 0.15, g); rd.scale.set(0.015, 0.7 + rnd() * 0.5, 0.015); rd.rotation.z = (rnd() - 0.5) * 0.5; } }
for (let i = 0; i < 10; i++) { const r = add(SPH, toon(0x8a8478), (rnd() - 0.5) * 6, 0.05, (rnd() - 0.5) * 4 - 1); const s = 0.1 + rnd() * 0.25; r.scale.set(s * 1.3, s * 0.6, s); }
const PAD = add(new THREE.CircleGeometry(0.35, 20, 0.3, 5.7), toon(0x9a8a40), -0.9, 0.01, 0.9); PAD.rotation.x = -Math.PI / 2;
for (const [x, z, s] of [[-6, -6, 1.3], [5, -7, 1.0], [8, -3, 1.2]]) { const tr = grp(scene, x, 0, z); add(CYL, toon(0x6a4a2e), 0, 1.4, 0, tr).scale.set(0.2, 2.8, 0.2); const cn = add(SPH, toon(0x5a8a3a), 0, 3.2, 0, tr); cn.scale.set(1.6 * s, 1.3 * s, 1.6 * s); }
const TOP = 0;
// ---------- the frog ----------
const FROG = (() => { const g = grp(scene); const root = grp(g); const skin = toon(0x6fc04a), belly = toon(0xe8f0a0), spot = toon(0x3f8a2a), ink = toon(0x141014), wht = basic(0xffffff), pink = toon(0xf08a9a);
  const body = add(SPH, skin, 0, 0.2, 0, root); body.scale.set(0.3, 0.22, 0.28); const bel = add(SPH, belly, 0, 0.16, 0.12, root); bel.scale.set(0.22, 0.15, 0.17);
  for (const [x, z] of [[0.12, -0.1], [-0.15, -0.05], [0.02, 0.05]]) { const sp = add(SPH, spot, x, 0.38, z, root); sp.scale.set(0.05, 0.015, 0.05); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(root, s * 0.14, 0.4, 0.12); add(SPH, skin, 0, 0, 0, e).scale.setScalar(0.1); add(SPH, wht, 0, 0.01, 0.05, e).scale.set(0.08, 0.085, 0.06); const p = add(SPH, ink, 0, 0.0, 0.1, e); p.scale.set(0.045, 0.055, 0.02); add(SPH, wht, 0.015, 0.02, 0.115, e).scale.setScalar(0.014);
    const lid = add(SPH, skin, 0, 0.04, 0.03, e); lid.scale.set(0.105, 0.06, 0.1); eyes.push({ p, lid }); }
  const mouth = add(new THREE.TorusGeometry(0.17, 0.012, 6, 20, Math.PI), ink, 0, 0.22, 0.24, root); mouth.rotation.z = Math.PI;
  const tongue = add(CAPS, pink, 0, 0.17, 0.3, root); tongue.scale.set(0.04, 0.05, 0.02); tongue.rotation.x = 1.2;
  for (const s of [-1, 1]) add(SPH, pink, s * 0.2, 0.25, 0.2, root).scale.set(0.04, 0.025, 0.02);
  const legs = []; for (const [x, z, sx] of [[-0.24, -0.08, -1], [0.24, -0.08, 1], [-0.14, 0.2, -1], [0.14, 0.2, 1]]) { const pv = grp(root, x, 0.06, z); add(SPH, skin, sx * 0.04, 0, 0, pv).scale.set(0.1, 0.06, 0.13); add(SPH, skin, sx * 0.06, -0.04, 0.1, pv).scale.set(0.07, 0.02, 0.05); legs.push(pv); }
  return { g, root, body, eyes, mouth, tongue, legs };
})();
/** frog: { pos, yaw, tired 0..1 (droopy lids, tongue out, flattened), jump, happy } */
function poseFrog(p, t) { const F = FROG; F.g.visible = true; F.g.position.set(...p.pos); F.g.rotation.y = p.yaw ?? 0; const tr = p.tired ?? 0;
  const j = p.jump ? Math.abs(Math.sin(t * 7)) : 0; F.root.position.y = j * 0.35; F.root.scale.set(1 + 0.12 * tr, 1 - 0.2 * tr + 0.03 * Math.sin(t * (tr ? 2.5 : 5)), 1); F.legs.forEach((l, i) => (l.rotation.x = j * (i < 2 ? -0.8 : 0.6)));
  F.eyes.forEach((e) => { e.lid.position.y = 0.04 - 0.04 * tr; e.lid.scale.y = 0.06 + 0.05 * tr + (((t * 1000) % 3000) < 110 ? 0.05 : 0); }); F.tongue.visible = tr > 0.5; F.mouth.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; F.mouth.position.y = (p.happy ?? 0) > 0 ? 0.22 : 0.15; }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.025, 0.035, 0.025); return d; });
const CLOUD = grp(scene); for (const [x, y, s] of [[0, 0, 0.5], [0.45, -0.05, 0.38], [-0.45, -0.05, 0.4], [0.2, 0.2, 0.36], [-0.2, 0.18, 0.34]]) add(SPH, toon(0x9aa4b4), x, y, 0, CLOUD).scale.set(s, s * 0.75, s * 0.8);
const RAIN = (() => { const n = 70, pnt = new Float32Array(n * 6); const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pnt, 3)); const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x6fc0f0 })); m.frustumCulled = false; scene.add(m); return m; })();
