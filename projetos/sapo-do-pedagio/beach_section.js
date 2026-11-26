// ---------- river + bridge ----------
scene.background = new THREE.Color(0xa8d4f0);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f8ee0"); gr.addColorStop(0.45, "#a8d4f0"); gr.addColorStop(0.5, "#e8f4e8"); gr.addColorStop(1, "#e8f4e8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const waterTex = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#3a8ad0"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70; i++) { g.strokeStyle = rnd() < 0.5 ? "rgba(200,235,255,0.6)" : "rgba(30,90,150,0.5)"; g.lineWidth = 3; g.beginPath(); const x = rnd() * 256, y = rnd() * 256; g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 8, y + 18); g.stroke(); } const t = tex(c); t.repeat.set(3, 20); return t; })();
const RIVER = add(new THREE.PlaneGeometry(3.2, 80), toon(0xffffff, waterTex), 0, -0.25, 0); RIVER.rotation.x = -Math.PI / 2;
const grassTex = (() => { const [c, g] = cv(256, 256); g.fillStyle = "#5fb04a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 500; i++) { const x = rnd() * 256, y = rnd() * 256; g.strokeStyle = rnd() < 0.5 ? "rgba(60,130,50,0.6)" : "rgba(140,210,100,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 6 - rnd() * 6); g.stroke(); } const t = tex(c); t.repeat.set(10, 40); return t; })();
const GROUND = grp(scene); for (const s of [-1, 1]) { box(30, 0.6, 80, toon(0xffffff, grassTex), s * (1.6 + 15), -0.6, 0, GROUND); box(0.3, 0.62, 80, toon(0x8a6a44), s * 1.62, -0.62, 0, GROUND); }
const SNOW = RIVER;
function tree(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x6a4428), 0, 0.6, 0, g).scale.set(0.16, 1.2, 0.16); for (const [a, b, c, r] of [[0, 1.6, 0, 0.7], [0.4, 1.4, 0.2, 0.5], [-0.4, 1.45, -0.1, 0.55]]) add(SPH, toon(0x3f9a3a), a, b, c, g).scale.setScalar(r); }
for (let i = 0; i < 16; i++) { const s = i % 2 ? 1 : -1; tree(s * (3.5 + rnd() * 6), -4 - rnd() * 18, 1.2 + rnd() * 0.8); }
for (let i = 0; i < 10; i++) { const s = i % 2 ? 1 : -1; tree(s * (5 + rnd() * 4), 2 + rnd() * 6, 1 + rnd() * 0.5); }
for (let i = 0; i < 20; i++) { const s = i % 2 ? 1 : -1; const r = add(SPH, toon(0x8a8a90), s * (1.75 + rnd() * 0.3), -0.05, -10 + rnd() * 20); r.scale.set(0.15, 0.08, 0.12); }
const BRIDGE = (() => { const g = grp(scene, 0, 0, 0); const wd = toon(0xb07a48), dk = toon(0x7a4a24);
  for (let i = 0; i < 22; i++) box(0.19, 0.06, 1.0, i % 2 ? wd : toon(0xa46c40), -2.1 + i * 0.2, 0.22, 0, g);
  for (const x of [-1.3, 0, 1.3]) for (const z of [-0.48, 0.48]) box(0.1, 0.7, 0.1, dk, x, -0.45, z, g);
  for (const z of [-0.5, 0.5]) { box(4.4, 0.06, 0.06, dk, 0, 0.58, z, g); for (let i = 0; i < 9; i++) box(0.06, 0.34, 0.06, dk, -2.1 + i * 0.525, 0.28, z, g); }
  return g; })();
const SIGN = (() => { const g = grp(scene, -2.45, 0, -0.55); add(CYL, toon(0x6a4428), 0, 0.55, 0, g).scale.set(0.05, 1.1, 0.05); const [c, x] = cv(256, 192); const t = tex(c, false); const p = add(new THREE.PlaneGeometry(0.85, 0.64), new THREE.MeshBasicMaterial({ map: t }), 0, 1.1, 0.04, g); box(0.92, 0.7, 0.04, toon(0x7a4a24), 0, 0.75, 0.0, g); p.rotation.y = 0.35; g.children[2].rotation.y = 0.35;
  let last = -1; const draw = (n) => { if (n === last) return; last = n; x.fillStyle = "#f2e2b0"; x.fillRect(0, 0, 256, 192); x.fillStyle = "#1a1214"; x.font = "900 42px DejaVu Sans"; x.textAlign = "center"; x.fillText("PEDÁGIO", 128, 58); x.font = "900 74px DejaVu Sans"; x.fillStyle = n >= 5 ? "#c8202a" : "#1a1214"; x.fillText(n + " 🪰", 128, 150); t.needsUpdate = true; }; draw(1); g.visible = false; return { g, draw }; })();
const PILE = (() => { const g = grp(scene, 0.42, 0.25, -0.2); const flies = []; for (let i = 0; i < 90; i++) { const r = Math.sqrt(i / 90) * 0.28, a = i * 2.4; const h = (1 - r / 0.3) * 0.25 + 0.01 * (i % 3); const f = add(SPH, toon(0x2a2a30), Math.cos(a) * r, h, Math.sin(a) * r, g); f.scale.set(0.035, 0.025, 0.03); f.visible = false; flies.push(f); } return { g, flies }; })();
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
  const crown = grp(root, 0, 0.43, 0.0); const gold = toon(0xf2c230); add(new THREE.CylinderGeometry(0.11, 0.1, 0.07, 10, 1, true), gold, 0, 0.035, 0, crown).material.side = THREE.DoubleSide; for (let k = 0; k < 5; k++) { const c = add(CONE, gold, Math.cos(k * 1.256) * 0.1, 0.1, Math.sin(k * 1.256) * 0.1, crown); c.scale.set(0.025, 0.06, 0.025); } add(SPH, toon(0xe5323f), 0, 0.04, 0.105, crown).scale.setScalar(0.02); crown.visible = false;
  return { g, root, body, eyes, mouth, tongue, legs, crown };
})();
/** frog: { pos, yaw, tired 0..1 (droopy lids, tongue out, flattened), jump, happy } */
function poseFrog(p, t) { const F = FROG; F.g.visible = true; F.g.position.set(...p.pos); F.crown.visible = !!p.crown; F.g.scale.setScalar(p.scale ?? 1); F.g.rotation.y = p.yaw ?? 0; const tr = p.tired ?? 0;
  const j = p.jump ? Math.abs(Math.sin(t * 7)) : 0; F.root.position.y = j * 0.35; F.root.scale.set(1 + 0.12 * tr, 1 - 0.2 * tr + 0.03 * Math.sin(t * (tr ? 2.5 : 5)), 1); F.legs.forEach((l, i) => (l.rotation.x = j * (i < 2 ? -0.8 : 0.6)));
  F.eyes.forEach((e) => { e.lid.position.y = 0.04 - 0.04 * tr; e.lid.scale.y = 0.06 + 0.05 * tr + (((t * 1000) % 3000) < 110 ? 0.05 : 0); }); F.tongue.visible = tr > 0.5; F.mouth.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; F.mouth.position.y = (p.happy ?? 0) > 0 ? 0.22 : 0.15; }
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
// ---------- the puppy ----------
const PUP = (() => { const g = grp(scene); const fur = toon(0xd99a55), cream = toon(0xf6e2c0), darkF = toon(0x8a5530), ink = toon(0x1a1214), wht = basic(0xffffff), tongueM = toon(0xe0707a);
  const body = grp(g); const torso = add(CAPS, fur, 0, 0.42, 0, body); torso.scale.set(0.24, 0.24, 0.24); torso.rotation.x = Math.PI / 2; const chest = add(SPH, cream, 0, 0.4, 0.28, body); chest.scale.set(0.19, 0.2, 0.12);
  const legs = []; for (const [x, z] of [[-0.13, 0.22], [0.13, 0.22], [-0.13, -0.22], [0.13, -0.22]]) { const pv = grp(body, x, 0.36, z); add(CYL, fur, 0, -0.17, 0, pv).scale.set(0.065, 0.34, 0.065); add(SPH, cream, 0, -0.35, 0.03, pv).scale.set(0.075, 0.05, 0.09); legs.push(pv); }
  const tail = grp(body, 0, 0.5, -0.32); const tl = add(CAPS, fur, 0, 0.12, -0.04, tail); tl.scale.set(0.04, 0.12, 0.04); tl.rotation.x = -0.6;
  const neck = grp(body, 0, 0.58, 0.24); const head = grp(neck, 0, 0.2, 0.06);
  const skull = add(SPH, fur, 0, 0, 0, head); skull.scale.set(0.27, 0.25, 0.25); const muzz = add(SPH, cream, 0, -0.07, 0.19, head); muzz.scale.set(0.15, 0.11, 0.12);
  const nose = add(SPH, ink, 0, -0.02, 0.31, head); nose.scale.set(0.05, 0.035, 0.035);
  const jaw = grp(head, 0, -0.13, 0.12); add(SPH, cream, 0, -0.01, 0.07, jaw).scale.set(0.1, 0.04, 0.08); const tongue = add(SPH, tongueM, 0, -0.03, 0.12, jaw); tongue.scale.set(0.05, 0.02, 0.06);
  const mouthIn = add(SPH, basic(0x3a1418), 0, -0.13, 0.26, head); mouthIn.scale.set(0.07, 0.01, 0.03);
  const ears = []; for (const s of [-1, 1]) { const pv = grp(head, s * 0.2, 0.13, -0.02); const e = add(SPH, darkF, s * 0.05, -0.12, 0, pv); e.scale.set(0.07, 0.16, 0.11); e.rotation.z = s * 0.25; ears.push(pv); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.1, 0.03, 0.2); const ball = add(SPH, ink, 0, 0, 0, e); ball.scale.set(0.055, 0.065, 0.04); const hl = add(SPH, wht, 0.018, 0.022, 0.03, e); hl.scale.setScalar(0.017); const hl2 = add(SPH, wht, -0.015, -0.02, 0.032, e); hl2.scale.setScalar(0.008);
    const brow = add(CAPS, darkF, 0, 0.085, 0.02, e); brow.scale.set(0.012, 0.03, 0.012); brow.rotation.z = Math.PI / 2; eyes.push({ e, brow, s, ball }); }
  const spot = add(SPH, darkF, 0.08, 0.13, 0.12, head); spot.scale.set(0.09, 0.06, 0.06);
  const snowcap = add(SPH, toon(0xffffff), 0, 0.2, -0.02, head); snowcap.scale.set(0.16, 0.06, 0.14); const back = add(SPH, toon(0xffffff), 0, 0.64, -0.05, body); back.scale.set(0.16, 0.04, 0.2); back.visible = false;
  return { g, snowcap, body, torso, legs, tail, neck, head, jaw, tongue, mouthIn, ears, eyes };
})();
const blinkAt = (t, s) => ((t * 1000 + s * 997) % 3300) < 120;
/** pup: { pos, yaw, sit 0..1, run phase|null, wag 0..1, ears (-1 droop .. 1 perk), tilt, headYaw, headPitch, bark 0..1, sad 0..1, wet } */
function posePup(p, t) { const P = PUP; P.g.visible = true; P.g.position.set(p.pos[0] + (p.shiver ?? 0) * Math.sin(t * 70) * 0.008, p.pos[1], p.pos[2]); P.g.rotation.y = p.yaw ?? 0; P.g.scale.setScalar(p.scale ?? 1);
  const sit = p.sit ?? 0, r = p.run; P.body.rotation.x = -0.55 * sit; P.body.position.y = -0.04 * sit + (r != null ? Math.abs(Math.sin(r * 9)) * 0.07 : 0); P.body.position.z = -0.1 * sit;
  P.legs.forEach((lg, i) => { let a = r == null ? 0 : Math.sin(r * 9 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.8; if (i >= 2) a += 1.25 * sit; else a += 0.45 * sit; lg.rotation.x = a; });
  P.neck.rotation.x = 0.5 * sit + (p.headPitch ?? 0) + 0.25 * (p.sad ?? 0); P.neck.rotation.y = p.headYaw ?? 0; P.head.rotation.z = (p.tilt ?? 0) + Math.sin(t * 1.3) * 0.04;
  const w = p.wag ?? 0; P.tail.rotation.z = Math.sin(t * 22) * 0.7 * w; P.tail.rotation.x = -0.4 * (1 - w) * (p.sad ?? 0) + 0.3 * w;
  const ear = p.ears ?? 0; P.ears.forEach((e, i) => { e.rotation.z = (i ? 1 : -1) * (0.25 - 0.35 * ear) + Math.sin(t * 3 + i) * 0.04; e.rotation.x = -0.2 * ear; });
  const b = p.bark ?? 0; P.jaw.rotation.x = 0.55 * b; P.mouthIn.scale.y = 0.01 + 0.05 * b; P.tongue.visible = (p.tongue ?? 0) > 0.5 || b > 0.3;
  P.eyes.forEach((e) => { const bl = blinkAt(t, 2) ? 0.15 : 1; e.ball.scale.y = 0.065 * bl; e.brow.position.y = 0.085 - 0.012 * (p.sad ?? 0); e.brow.rotation.z = Math.PI / 2 - e.s * 0.45 * (p.sad ?? 0); });
  P.torso.material.color.setHex(p.wet ? 0xb8834a : 0xd99a55); P.snowcap.visible = false; }

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
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const BUZZ = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0x222228, transparent: true, depthWrite: false })); s.scale.setScalar(0.05); scene.add(s); return s; });
const GLINT = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff0a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(s); return s; });
const PAY = (() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0x222228, transparent: true, depthWrite: false })); s.scale.setScalar(0.07); scene.add(s); return s; })();
