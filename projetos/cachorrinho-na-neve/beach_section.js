// ---------- snowy field ----------
scene.background = new THREE.Color(0xc8d8e8);
const SNOW = add(new THREE.PlaneGeometry(120, 120), toon(0xf4f8ff), 0, 0, 0); SNOW.rotation.x = -Math.PI / 2;
for (let i = 0; i < 30; i++) { const m = add(SPH, toon(0xffffff), (rnd() - 0.5) * 30, -0.3, -4 - rnd() * 25); const s = 1 + rnd() * 3; m.scale.set(s * 1.5, s * 0.5, s); }
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#7a90b0"); gr.addColorStop(0.45, "#b8c8dc"); gr.addColorStop(0.5, "#e8eef6"); gr.addColorStop(1, "#e8eef6"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
function pine(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x5a3a22), 0, 0.4, 0, g).scale.set(0.12, 0.8, 0.12); for (let k = 0; k < 3; k++) { add(CONE, toon(0x2f6a4a), 0, 1.0 + k * 0.6, 0, g).scale.set(1.0 - k * 0.25, 1.0, 1.0 - k * 0.25); add(CONE, toon(0xffffff), 0, 1.15 + k * 0.6, 0, g).scale.set(0.75 - k * 0.2, 0.55, 0.75 - k * 0.2); } return g; }
for (const [x, z, s] of [[-2.6, -2.5, 1.2], [2.8, -3.6, 1.4], [-5, -6, 1.6], [5.5, -7, 1.5], [0.5, -9, 1.8], [-8, -10, 2]]) pine(x, z, s);
const FENCE = grp(scene, 0.4, 0, -1.6); for (const x of [-1.6, -0.8, 0, 0.8, 1.6]) { box(0.12, x === 0 ? 0.9 : 0.8, 0.12, toon(0x8a5a32), x, 0, 0, FENCE); add(CYL, toon(0xffffff), x, x === 0 ? 0.92 : 0.82, 0, FENCE).scale.set(0.085, 0.05, 0.085); } box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.55, 0.07, FENCE); box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.25, 0.07, FENCE);
const TOP = 0;
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
  P.torso.material.color.setHex(p.wet ? 0xb8834a : 0xd99a55); P.snowcap.visible = (p.shiver ?? 0) > 0.3; }

const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
// ---------- the doghouse wall (pops in on follow) ----------
const HOUSE = (() => { const g = grp(scene, 0, 0, 0.05); const wood = toon(0xb8743a), dk = toon(0x7a4a24);
  for (let k = 0; k < 5; k++) box(0.24, 1.0, 0.08, k % 2 ? wood : toon(0xc8844a), -0.48 + k * 0.24, 0, 0, g);
  box(1.3, 0.08, 0.1, dk, 0, 0.98, 0.02, g); box(1.3, 0.08, 0.1, dk, 0, 0.1, 0.02, g); add(SPH, toon(0xffffff), 0, 1.05, 0, g).scale.set(0.7, 0.06, 0.1);
  return g; })();
const SPARK = Array.from({ length: 12 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff0a0, transparent: true, depthWrite: false })); s.scale.setScalar(0.05); scene.add(s); return s; });
const BREATH = Array.from({ length: 3 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })); scene.add(s); return s; });
const FLAKES = (() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOT, color: 0xffffff, size: 0.045, transparent: true, depthWrite: false })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
