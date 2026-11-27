// ---------- snowy field ----------
scene.background = new THREE.Color(0xc8d8e8);
const SNOW = add(new THREE.PlaneGeometry(120, 120), toon(0xf4f8ff), 0, 0, 0); SNOW.rotation.x = -Math.PI / 2;
for (let i = 0; i < 30; i++) { const m = add(SPH, toon(0xffffff), (rnd() - 0.5) * 30, -0.3, -4 - rnd() * 25); const s = 1 + rnd() * 3; m.scale.set(s * 1.5, s * 0.5, s); }
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#7a90b0"); gr.addColorStop(0.45, "#b8c8dc"); gr.addColorStop(0.5, "#e8eef6"); gr.addColorStop(1, "#e8eef6"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
function pine(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x5a3a22), 0, 0.4, 0, g).scale.set(0.12, 0.8, 0.12); for (let k = 0; k < 3; k++) { add(CONE, toon(0x2f6a4a), 0, 1.0 + k * 0.6, 0, g).scale.set(1.0 - k * 0.25, 1.0, 1.0 - k * 0.25); add(CONE, toon(0xffffff), 0, 1.15 + k * 0.6, 0, g).scale.set(0.75 - k * 0.2, 0.55, 0.75 - k * 0.2); } return g; }
for (const [x, z, s] of [[-2.6, -2.5, 1.2], [2.8, -3.6, 1.4], [-5, -6, 1.6], [5.5, -7, 1.5], [0.5, -9, 1.8], [-8, -10, 2]]) pine(x, z, s);
const FENCE = grp(scene, 0, 0, 0); for (const x of [-1.6, -0.8, 0, 0.8, 1.6]) { box(0.12, x === 0 ? 0.9 : 0.8, 0.12, toon(0x8a5a32), x, 0, 0, FENCE); add(CYL, toon(0xffffff), x, x === 0 ? 0.92 : 0.82, 0, FENCE).scale.set(0.085, 0.05, 0.085); } box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.55, 0.07, FENCE); box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.25, 0.07, FENCE);
const TOP = 0;
// ---------- the bird ----------
const BIRD = (() => { const g = grp(scene); const root = grp(g); const red = toon(0xd8483a), belly = toon(0xf2b080), ink = toon(0x141014), wht = basic(0xffffff), org = toon(0xf2a030);
  const body = add(SPH, red, 0, 0.12, 0, root); body.scale.set(0.12, 0.12, 0.12); const bel = add(SPH, belly, 0, 0.1, 0.05, root); bel.scale.set(0.09, 0.09, 0.08);
  const head = grp(root, 0, 0.25, 0.02); add(SPH, red, 0, 0, 0, head).scale.setScalar(0.085);
  const beak = add(CONE, org, 0, -0.01, 0.09, head); beak.scale.set(0.025, 0.05, 0.02); beak.rotation.x = Math.PI / 2;
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.04, 0.02, 0.065); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.018, 0.022, 0.01); add(SPH, wht, 0.006, 0.008, 0.008, e).scale.setScalar(0.006); eyes.push(p); const br = add(CYL, ink, 0, 0.03, 0.005, e); br.scale.set(0.004, 0.025, 0.004); br.rotation.z = Math.PI / 2 - s * 0.45; }
  for (const s of [-1, 1]) add(SPH, toon(0xf6a0a8), s * 0.055, -0.02, 0.055, head).scale.set(0.015, 0.01, 0.006);
  const wings = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.11, 0.15, -0.01); const w = add(SPH, toon(0xb8382a), s * 0.02, -0.03, -0.02, pv); w.scale.set(0.03, 0.08, 0.07); wings.push(pv); }
  const tail = add(CONE, toon(0xb8382a), 0, 0.12, -0.14, root); tail.scale.set(0.04, 0.1, 0.02); tail.rotation.x = -1.2;
  for (const s of [-1, 1]) { add(CYL, org, s * 0.04, 0.0, 0.02, root).scale.set(0.006, 0.04, 0.006); }
  const scarf = grp(root, 0, 0.2, 0.0); const sm = toon(0x2d6fd0); add(new THREE.TorusGeometry(0.075, 0.025, 8, 20), sm, 0, 0, 0, scarf).rotation.x = Math.PI / 2; for (let k = 0; k < 2; k++) { const tl = add(CAPS, sm, 0.05 + k * 0.025, -0.06, 0.07, scarf); tl.scale.set(0.02, 0.04, 0.01); tl.rotation.z = 0.3 + k * 0.2; }
  for (let k = 0; k < 6; k++) add(new THREE.TorusGeometry(0.076, 0.008, 6, 20, 0.4), toon(0xffffff), 0, 0, 0, scarf).rotation.set(Math.PI / 2, 0, k * 1.05);
  scarf.visible = false; const bodyMats = [red]; return { g, root, head, eyes, wings, scarf, red };
})();
/** bird: { pos, yaw, cold 0..1 (shiver, blue tint, puffed), scarf 0..1 (pop), happy, flap } */
function poseBird(p, t) { const B = BIRD; B.g.visible = true; B.g.position.set(...p.pos); B.g.rotation.y = p.yaw ?? 0; const c = p.cold ?? 0;
  B.root.position.x = c * Math.sin(t * 60) * 0.006; B.root.scale.setScalar(1 + 0.1 * c); B.red.color.setHex(c > 0.5 ? 0xb85a6a : 0xd8483a);
  B.head.rotation.z = Math.sin(t * 1.5) * 0.1; B.head.rotation.x = 0.2 * c; B.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.flap ? 0.6 + Math.sin(t * 30) * 0.6 : 0.1 * c)));
  B.scarf.visible = (p.scarf ?? 0) > 0; B.scarf.scale.setScalar(Math.max(0.01, Math.min(1, (p.scarf ?? 0) * 1.3))); B.root.position.y = p.flap ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
  B.eyes.forEach((e) => (e.scale.y = 0.022 * (((t * 1000) % 2900) < 110 ? 0.1 : 1 - 0.3 * c))); }
const SWEAT = Array.from({ length: 4 }, () => { const d = add(SPH, toon(0xffffff)); d.scale.setScalar(0.012); return d; });
const FLAKES = (() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.035 })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
const RAY = (() => { const [c, g] = cv(64, 256); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,230,150,0)"); gr.addColorStop(0.3, "rgba(255,230,150,0.55)"); gr.addColorStop(1, "rgba(255,230,150,0.0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); const m = add(new THREE.PlaneGeometry(0.9, 4), new THREE.MeshBasicMaterial({ map: tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); m.rotation.z = 0.35; return m; })();
