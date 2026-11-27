// ---------- the ghost girl ----------
const GHOST = (() => { const g = grp(scene); const skin = toon(0xdce8ec), hair = toon(0xf2d470), dress = toon(0xf4f4f0), ink = basic(0x05080a);
  const dr = add(CONE, dress, 0, 0.55, 0, g); dr.scale.set(0.34, 1.1, 0.3); dr.material.transparent = true;
  const head = grp(g, 0, 1.28, 0); add(SPH, skin, 0, 0, 0, head).scale.set(0.17, 0.19, 0.17);
  const back = add(CAPS, hair, 0, -0.12, -0.08, head); back.scale.set(0.17, 0.25, 0.1); add(SPH, hair, 0, 0.07, -0.02, head).scale.set(0.185, 0.16, 0.18);
  for (const s of [-1, 1]) { const l = add(CAPS, hair, s * 0.15, -0.16, 0.02, head); l.scale.set(0.05, 0.22, 0.06); }
  for (const s of [-1, 1]) { add(SPH, ink, s * 0.062, 0.01, 0.15, head).scale.set(0.03, 0.038, 0.02); add(SPH, basic(0xffffff), s * 0.065, 0.005, 0.168, head).scale.setScalar(0.008); add(SPH, basic(0xffffff), s * 0.013, -0.055, 0.17, head).scale.setScalar(0.014); }
  add(SPH, toon(0x7a8a90), 0, -0.11, 0.155, head).scale.set(0.03, 0.012, 0.01);
  for (const s of [-1, 1]) { const a = add(CAPS, skin, s * 0.2, 0.75, 0, g); a.scale.set(0.04, 0.2, 0.04); a.rotation.z = s * 0.15; }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOTX(), color: 0x9ad8ff, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(1.4, 2.2, 1); glow.position.y = 0.9; g.add(glow);
  g.visible = false; return { g, head, glow }; })();
function DOTX() { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); }
const DUST = (() => { const n = 300, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 5; pos[i * 3 + 1] = rnd() * 3.2; pos[i * 3 + 2] = (rnd() - 0.5) * 5; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOTX(), color: 0xcfe8e0, size: 0.03, transparent: true, opacity: 0.5, depthWrite: false })); m.userData.base = pos.slice(); scene.add(m); return m; })();
