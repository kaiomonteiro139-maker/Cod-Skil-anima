// ---------- dry garden ----------
scene.background = new THREE.Color(0xa8d4f0);
const dryTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#b8a060"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(140,110,50,0.5)" : "rgba(220,200,130,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - 8 - rnd() * 10); g.stroke(); } const t = tex(c); t.repeat.set(20, 20); return t; })();
const GRD = add(new THREE.PlaneGeometry(120, 120), toon(0xffffff, dryTex), 0, 0, 0); GRD.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f9ae0"); gr.addColorStop(0.45, "#a8d4f0"); gr.addColorStop(0.5, "#f0f4e8"); gr.addColorStop(1, "#f0f4e8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const FEN = grp(scene, 0, 0, -2.5); for (let i = -8; i <= 8; i++) { box(0.12, 0.9, 0.05, toon(0xf2efe6), i * 0.4, 0, 0, FEN); add(CONE, toon(0xf2efe6), i * 0.4, 0.95, 0, FEN).scale.set(0.07, 0.12, 0.03); } box(6.8, 0.07, 0.04, toon(0xf2efe6), 0, 0.6, 0.04, FEN); box(6.8, 0.07, 0.04, toon(0xf2efe6), 0, 0.25, 0.04, FEN);
const HIVE = grp(scene, 2.2, 0, -1.8); add(CYL, toon(0x6a4a2e), 0, 0.5, 0, HIVE).scale.set(0.05, 1.0, 0.05); for (let k = 0; k < 4; k++) add(SPH, toon(0xe8b040), 0, 1.15 - k * 0.12, 0, HIVE).scale.set(0.22 - k * 0.01 + (k === 1 || k === 2 ? 0.04 : 0), 0.08, 0.22); add(new THREE.CircleGeometry(0.05, 16), toon(0x3a2414), 0, 1.0, 0.24, HIVE);
function wilted(x, z, s, col) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); const st = add(CYL, toon(0x8a8a40), 0, 0.3, 0, g); st.scale.set(0.02, 0.6, 0.02); const hd = grp(g, 0, 0.6, 0); hd.rotation.z = 2.3; for (let k = 0; k < 6; k++) { const p = add(SPH, toon(col), Math.cos(k) * 0.07, 0, Math.sin(k) * 0.07, hd); p.scale.set(0.06, 0.015, 0.04); p.rotation.y = -k; } add(SPH, toon(0x6a4a22), 0, 0.01, 0, hd).scale.setScalar(0.04); return g; }
for (let i = 0; i < 16; i++) wilted((rnd() - 0.5) * 6, -0.5 - rnd() * 1.8, 0.8 + rnd() * 0.6, [0x9a7a5a, 0xa08a60, 0x8a7060][i % 3]);
const BED = wilted(0, 0, 1.5, 0x9a7a5a); // the bee's wilted flower
const TOP = 0;
// ---------- the new flower (grows on follow) ----------
const FLOW = (() => { const g = grp(scene, 0.45, 0, 0.25); const stem = add(CYL, toon(0x3f9a3a), 0, 0.3, 0, g); stem.scale.set(0.025, 0.6, 0.025); for (const s of [-1, 1]) { const l = add(SPH, toon(0x4fb04a), s * 0.07, 0.25, 0, g); l.scale.set(0.08, 0.02, 0.04); l.rotation.z = s * 0.4; }
  const head = grp(g, 0, 0.62, 0); for (let k = 0; k < 8; k++) { const p = add(SPH, toon(0xf06aa0), Math.cos(k / 8 * 6.28) * 0.09, 0, Math.sin(k / 8 * 6.28) * 0.09, head); p.scale.set(0.07, 0.02, 0.045); p.rotation.y = -k / 8 * 6.28; } add(SPH, toon(0xf2c230), 0, 0.015, 0, head).scale.set(0.055, 0.03, 0.055); head.rotation.x = 0.5; return { g, head }; })();
// ---------- the bee ----------
const BEE = (() => { const g = grp(scene); const root = grp(g); const yel = toon(0xf6c830), blk = toon(0x2a2228), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, yel, 0, 0, -0.04, root); body.scale.set(0.11, 0.1, 0.13); for (const z of [-0.08, -0.01]) { const b = add(new THREE.TorusGeometry(0.098, 0.022, 8, 24), blk, 0, 0, z, root); b.scale.set(1.08, 1.0, 1); }
  const sting = add(CONE, blk, 0, 0, -0.18, root); sting.scale.set(0.02, 0.05, 0.02); sting.rotation.x = -Math.PI / 2;
  const head = grp(root, 0, 0.03, 0.1); add(SPH, yel, 0, 0, 0, head).scale.setScalar(0.08);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.035, 0.015, 0.065); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.02, 0.025, 0.012); add(SPH, wht, 0.006, 0.009, 0.01, e).scale.setScalar(0.007); eyes.push(p); const br = add(CYL, ink, 0, 0.032, 0.004, e); br.scale.set(0.004, 0.025, 0.004); br.rotation.z = Math.PI / 2 - s * 0.45; }
  for (const s of [-1, 1]) { add(SPH, toon(0xf6a0a8), s * 0.05, -0.02, 0.055, head).scale.set(0.014, 0.009, 0.006); const an = grp(head, s * 0.03, 0.06, 0.02); add(CYL, blk, 0, 0.04, 0, an).scale.set(0.004, 0.08, 0.004); add(SPH, blk, 0, 0.085, 0, an).scale.setScalar(0.012); an.rotation.z = -s * 0.3; }
  const smile = add(new THREE.TorusGeometry(0.02, 0.005, 6, 12, Math.PI), ink, 0, -0.03, 0.075, head);
  const wings = []; const wm = new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide }); for (const s of [-1, 1]) { const pv = grp(root, s * 0.05, 0.08, -0.02); const w = add(SPH, wm, s * 0.07, 0.03, 0, pv); w.scale.set(0.08, 0.01, 0.05); wings.push(pv); }
  return { g, root, head, eyes, wings, smile };
})();
/** bee: { pos, yaw, tired 0..1 (lying on its side), fly, happy } */
function poseBee(p, t) { const B = BEE; B.g.visible = true; B.g.position.set(...p.pos); B.g.rotation.y = p.yaw ?? 0; const tr = p.tired ?? 0;
  B.root.rotation.z = 1.2 * tr; B.root.position.y = (p.fly ? Math.sin(t * 6) * 0.03 : 0); B.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.fly ? 0.3 + Math.sin(t * 60 + i * 3) * 0.6 : 0.1 + 0.05 * Math.sin(t * 2))));
  B.smile.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; B.smile.position.y = (p.happy ?? 0) > 0 ? -0.025 : -0.04; B.eyes.forEach((e) => (e.scale.y = 0.025 * (((t * 1000) % 2900) < 110 ? 0.1 : 1 - 0.4 * tr))); }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.015, 0.02, 0.015); return d; });
const SPARK = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff0a0, transparent: true, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
