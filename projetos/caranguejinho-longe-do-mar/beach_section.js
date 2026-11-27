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
// ---------- incoming wave (advances with st.wave 0..1) ----------
const WAVE = grp(scene); const waveM = new THREE.MeshToonMaterial({ color: 0x5fc0e0, gradientMap: gradMap, transparent: true, opacity: 0.9 }); const WSHEET = add(new THREE.PlaneGeometry(30, 10), waveM, 0, 0.015, -5, WAVE); WSHEET.rotation.x = -Math.PI / 2;
const WFOAM = add(new THREE.PlaneGeometry(30, 0.35), basic(0xffffff), 0, 0.02, 0.05, WAVE); WFOAM.rotation.x = -Math.PI / 2;
// ---------- the crab ----------
const CRAB = (() => { const g = grp(scene); const root = grp(g); const red = toon(0xe5503b), lite = toon(0xf28a6a), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, red, 0, 0.12, 0, root); body.scale.set(0.2, 0.1, 0.15); const bel = add(SPH, lite, 0, 0.09, 0.03, root); bel.scale.set(0.16, 0.07, 0.12);
  const eyes = []; for (const s of [-1, 1]) { const st = add(CYL, red, s * 0.06, 0.24, 0.07, root); st.scale.set(0.012, 0.12, 0.012); const e = grp(root, s * 0.06, 0.31, 0.07); add(SPH, wht, 0, 0, 0, e).scale.setScalar(0.035); const p = add(SPH, ink, 0, 0, 0.022, e); p.scale.set(0.018, 0.022, 0.01); add(SPH, wht, 0.006, 0.008, 0.03, e).scale.setScalar(0.006); eyes.push(p);
    const br = add(CYL, ink, s * 0.06, 0.355, 0.08, root); br.scale.set(0.004, 0.035, 0.004); br.rotation.z = Math.PI / 2 - s * 0.45; }
  const mouth = add(new THREE.TorusGeometry(0.025, 0.006, 6, 12, Math.PI), ink, 0, 0.13, 0.15, root);
  for (const s of [-1, 1]) add(SPH, toon(0xf6a0a8), s * 0.1, 0.15, 0.13, root).scale.set(0.02, 0.012, 0.006);
  const claws = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.2, 0.14, 0.08); add(CYL, red, s * 0.05, 0, 0, pv).scale.set(0.02, 0.1, 0.02); pv.children[0].rotation.z = Math.PI / 2; const c = grp(pv, s * 0.13, 0.03, 0.02); add(SPH, red, 0, 0, 0, c).scale.set(0.07, 0.05, 0.04); const pin = add(SPH, red, s * 0.03, 0.04, 0, c); pin.scale.set(0.05, 0.025, 0.03); c.userData.pin = pin; claws.push({ pv, c }); }
  const legs = []; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const pv = grp(root, s * 0.16, 0.1, -0.05 + k * 0.05); const l = add(CYL, red, s * 0.06, -0.03, 0, pv); l.scale.set(0.012, 0.12, 0.012); l.rotation.z = s * 1.0; legs.push(pv); }
  return { g, root, eyes, mouth, claws, legs, red };
})();
/** crab: { pos, yaw, hot 0..1 (sad, sweat, flushed), dance, happy, walk } */
function poseCrab(p, t) { const C = CRAB; C.g.visible = true; C.g.position.set(...p.pos); C.g.rotation.y = p.yaw ?? 0; const h = p.hot ?? 0;
  C.root.position.y = p.dance ? Math.abs(Math.sin(t * 8)) * 0.08 : 0; C.root.rotation.z = p.dance ? Math.sin(t * 8) * 0.2 : h * Math.sin(t * 3) * 0.05;
  C.claws.forEach((c, i) => { c.pv.rotation.z = (i ? 1 : -1) * (p.dance ? 0.6 + Math.sin(t * 10 + i) * 0.5 : 0.1 - 0.2 * h); c.c.userData.pin.rotation.z = (i ? -1 : 1) * Math.abs(Math.sin(t * (p.dance ? 12 : 3))) * 0.4; });
  C.legs.forEach((l, i) => (l.rotation.x = (p.walk || p.dance) ? Math.sin(t * 14 + i * 1.3) * 0.4 : 0));
  C.mouth.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; C.mouth.position.y = (p.happy ?? 0) > 0 ? 0.14 : 0.12; C.red.color.setHex(h > 0.5 ? 0xf0402a : 0xe5503b);
  C.eyes.forEach((e) => (e.scale.y = 0.022 * (((t * 1000) % 2900) < 110 ? 0.1 : 1 - 0.3 * h))); }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.02, 0.028, 0.02); return d; });
const HEAT = Array.from({ length: 8 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffb070, transparent: true, opacity: 0.4, depthWrite: false })); s.scale.setScalar(0.08); scene.add(s); return s; });
const lerp0 = (a, b, k) => a + (b - a) * Math.max(0, Math.min(1, k));
