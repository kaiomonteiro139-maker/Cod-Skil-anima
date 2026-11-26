// ---------- arctic sea ----------
scene.background = new THREE.Color(0xbcd4ea);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5f8ec8"); gr.addColorStop(0.45, "#bcd4ea"); gr.addColorStop(0.5, "#e8f2fa"); gr.addColorStop(1, "#e8f2fa"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const seaTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#1f5f9a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 160; i++) { g.strokeStyle = rnd() < 0.5 ? "rgba(120,190,240,0.5)" : "rgba(20,60,110,0.6)"; g.lineWidth = 3; g.beginPath(); const x = rnd() * 512, y = rnd() * 512; g.moveTo(x, y); g.quadraticCurveTo(x + 15, y - 6, x + 30, y); g.stroke(); } const t = tex(c); t.repeat.set(30, 30); return t; })();
const SEA = add(new THREE.PlaneGeometry(200, 200), toon(0xffffff, seaTex), 0, -0.05, 0); SEA.rotation.x = -Math.PI / 2;
for (const [x, z, s] of [[-8, -18, 3], [10, -24, 4], [-20, -30, 5], [22, -14, 2.5], [3, -40, 6]]) { const b = add(CONE, toon(0xf2f8ff), x, s * 0.4, z); b.scale.set(s * 1.4, s * 1.3, s); b.rotation.y = x; const c = add(new THREE.BoxGeometry(1, 1, 1), toon(0xdcecfa), x + s * 0.8, s * 0.2, z + 0.5); c.scale.set(s, s * 0.5, s * 0.8); }
function jag(r, n, seed) { const sh = new THREE.Shape(); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.82 + 0.18 * Math.abs(Math.sin(i * 7.7 + seed))); i ? sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } return new THREE.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: false }); }
const iceM = toon(0xeef8ff), iceSide = toon(0xb8dcf4);
const FLOE = (() => { const g = grp(scene); const m = new THREE.Mesh(jag(0.75, 11, 1), [iceM, iceSide]); m.rotation.x = -Math.PI / 2; m.position.y = 0.06; g.add(m); return g; })();
const CHUNK = (() => { const g = grp(scene); const m = new THREE.Mesh(jag(0.42, 8, 3), [iceM, iceSide]); m.rotation.x = -Math.PI / 2; m.position.y = 0.06; g.add(m); g.visible = false; return g; })();
const RINGS = Array.from({ length: 3 }, () => { const m = add(new THREE.RingGeometry(0.95, 1.0, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false }), 0, -0.03, 0); m.rotation.x = -Math.PI / 2; return m; });
const TOP = 0;
// ---------- the polar bear cub ----------
const BEAR = (() => { const g = grp(scene); const root = grp(g); const fur = toon(0xf8f6ee), cream = toon(0xeee6d0), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, fur, 0, 0.32, 0, root); body.scale.set(0.3, 0.32, 0.28); const bel = add(SPH, cream, 0, 0.3, 0.12, root); bel.scale.set(0.2, 0.22, 0.17);
  const feet = []; for (const s of [-1, 1]) { const f = add(SPH, fur, s * 0.15, 0.08, 0.2, root); f.scale.set(0.1, 0.08, 0.13); add(SPH, toon(0x3a3034), s * 0.15, 0.08, 0.32, root).scale.set(0.05, 0.04, 0.012); feet.push(f); }
  const arms = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.24, 0.45, 0.08); const a = add(CAPS, fur, 0, -0.1, 0.02, pv); a.scale.set(0.07, 0.08, 0.07); arms.push(pv); }
  const head = grp(root, 0, 0.72, 0.05); add(SPH, fur, 0, 0, 0, head).scale.set(0.22, 0.2, 0.2); const mz = add(SPH, cream, 0, -0.05, 0.16, head); mz.scale.set(0.1, 0.075, 0.08); add(SPH, ink, 0, -0.02, 0.24, head).scale.set(0.04, 0.03, 0.025);
  for (const s of [-1, 1]) { const ear = add(SPH, fur, s * 0.15, 0.15, -0.02, head); ear.scale.set(0.065, 0.065, 0.04); add(SPH, toon(0xe8b0b0), s * 0.15, 0.15, 0.01, head).scale.set(0.035, 0.035, 0.02); add(SPH, toon(0xf6a8b0), s * 0.13, -0.06, 0.15, head).scale.set(0.035, 0.022, 0.01); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.085, 0.04, 0.17); const b = add(SPH, ink, 0, 0, 0, e); b.scale.set(0.035, 0.045, 0.02); add(SPH, wht, 0.012, 0.016, 0.017, e).scale.setScalar(0.012); const br = add(CYL, ink, 0, 0.065, 0.005, e); br.scale.set(0.007, 0.05, 0.007); br.rotation.z = Math.PI / 2; eyes.push({ b, br, s }); }
  const frown = add(new THREE.TorusGeometry(0.03, 0.007, 6, 12, Math.PI), ink, 0, -0.1, 0.225, head); const smile = add(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), ink, 0, -0.085, 0.225, head); smile.rotation.z = Math.PI;
  return { g, root, head, eyes, arms, frown, smile }; })();
/** bear: { pos, yaw, sad 0..1, shiver, happy, hug (arms in), wave, lookDown } */
function poseBear(p, t) { const B = BEAR; B.g.visible = true; B.g.position.set(p.pos[0] + (p.shiver ? Math.sin(t * 60) * 0.006 : 0), p.pos[1], p.pos[2]); B.g.rotation.y = p.yaw ?? 0; const sd = p.sad ?? 0;
  B.root.position.y = (p.hop ? Math.abs(Math.sin(t * 9)) * 0.1 : 0); B.head.rotation.x = 0.25 * sd + (p.lookDown ?? 0) * 0.5; B.head.rotation.z = Math.sin(t * 1.3) * 0.06; B.head.rotation.y = p.headYaw ?? 0;
  B.arms.forEach((a, i) => { const s = i ? 1 : -1; a.rotation.set(p.wave && i ? -2.6 + Math.sin(t * 9) * 0.3 : p.hug ? -0.8 : -0.3, 0, s * (p.hug ? -0.6 : 0.2)); });
  B.eyes.forEach((e) => { const bl = ((t * 1000) % 3000) < 110 ? 0.12 : 1; e.b.scale.y = 0.045 * bl * (p.happy ? 0.7 : 1); e.br.rotation.z = Math.PI / 2 - e.s * 0.45 * sd; e.br.position.y = 0.065 + 0.01 * sd; });
  B.frown.visible = !p.happy; B.smile.visible = !!p.happy; }
const DRIPS = Array.from({ length: 6 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.setScalar(0.03); return d; });
const TEARS = Array.from({ length: 2 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.018, 0.026, 0.018); return d; });
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const SPARK = Array.from({ length: 12 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xbfefff, transparent: true, depthWrite: false })); scene.add(s); return s; });
const FLAKES = (() => { const n = 700, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOT, color: 0xffffff, size: 0.045, transparent: true, depthWrite: false })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
