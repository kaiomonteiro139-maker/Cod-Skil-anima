// ---------- the guy (blocky, winter clothes) ----------
const cbox = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const GUY = (() => { const g = grp(scene); const root = grp(g, 0, 0.95, 0); const body = grp(root); const red = toon(0xd8343a), jean = toon(0x2a3f7a), skin = toon(0x9a6440), ink = toon(0x141014), wht = basic(0xffffff), hat = toon(0x2d6fd0), shoe = toon(0x1e1e22);
  const torso = cbox(0.56, 0.66, 0.32, red, 0, 0.36, 0, body); cbox(0.2, 0.06, 0.33, toon(0xb02a30), 0, 0.12, 0.0, body);
  const neck = grp(body, 0, 0.72, 0); const head = grp(neck, 0, 0.2, 0); add(SPH, skin, 0, 0, 0, head).scale.set(0.2, 0.22, 0.2);
  const cap = add(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hat, 0, 0.04, -0.01, head); cap.scale.set(0.215, 0.2, 0.215); add(new THREE.TorusGeometry(0.2, 0.04, 8, 24), toon(0xffffff), 0, 0.05, -0.01, head).rotation.x = Math.PI / 2; add(SPH, toon(0xffffff), 0, 0.25, -0.01, head).scale.setScalar(0.06);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.0, 0.18); const w = add(SPH, wht, 0, 0, 0, e); w.scale.set(0.045, 0.05, 0.02); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.028, 0.012); const br = add(CYL, ink, 0, 0.065, 0.01, e); br.scale.set(0.01, 0.06, 0.01); br.rotation.z = Math.PI / 2; eyes.push({ w, p, br, s }); }
  const mouth = add(SPH, toon(0x5a1a1a), 0, -0.1, 0.18, head); mouth.scale.set(0.05, 0.015, 0.015); const smile = add(new THREE.TorusGeometry(0.06, 0.014, 6, 14, Math.PI), ink, 0, -0.06, 0.19, head); smile.rotation.z = Math.PI;
  const arms = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.36, 0.62, 0); cbox(0.16, 0.6, 0.18, red, 0, -0.28, 0, pv); add(SPH, skin, 0, -0.62, 0, pv).scale.setScalar(0.085); arms.push(pv); }
  const shovel = grp(arms[1], 0, -0.62, 0.02); cbox(0.04, 1.1, 0.04, toon(0x8a5a32), 0, 0.05, 0.12, shovel).rotation.x = 1.2; const bl = cbox(0.22, 0.03, 0.28, toon(0x9aa4ac), 0, 0.27, 0.66, shovel); bl.rotation.x = 1.2; shovel.visible = false;
  const legs = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.14, 0.04, 0); cbox(0.22, 0.86, 0.24, jean, 0, -0.45, 0, pv); cbox(0.23, 0.12, 0.34, shoe, 0, -0.9, 0.05, pv); legs.push(pv); }
  red.transparent = true; return { g, root, body, neck, head, eyes, mouth, smile, arms, legs, shovel, red };
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
    if (A === "float") { x = -0.5 + Math.sin(t * 1.3 + i) * 0.25; z = s * (0.55 + Math.sin(t * 1.1 + i * 2) * 0.15); }
    if (A === "belly") { x = -0.9; z = -s * 0.35; }
    if (A === "mouth") { x = i ? -2.3 : 0; z = i ? -0.35 : -0.08; }
    if (A === "yawn") { x = -2.9; z = s * 0.15; }
    if (A === "dig") { x = -0.9 + Math.sin(t * 7) * 0.5; z = s * 0.1; }
    if (A === "tuck") { x = -0.3; z = s * 0.05; }
    a.rotation.set(x, 0, z); });
  G.legs.forEach((l, i) => { let x = w != null ? Math.sin(w * 7 + i * Math.PI) * 0.55 : 0; if (p.kick) x = Math.sin(t * 16 + i * Math.PI) * 0.5; l.rotation.set(x, 0, 0); });
  G.neck.rotation.set(-0.6 * pr + (p.headPitch ?? 0), p.headYaw ?? 0, 0);
  const f = p.face ?? "calm"; G.eyes.forEach((e) => { const bl = f === "ko" ? 0.08 : f === "tired" ? 0.45 : ((t * 1000) % 3100) < 110 ? 0.12 : 1; const big = f === "scared" ? 1.35 : 1; e.w.scale.set(0.045 * big, 0.05 * big * bl, 0.02); e.p.scale.set(0.022 * (f === "scared" ? 0.8 : 1), 0.028 * bl, 0.012); e.br.position.y = f === "scared" ? 0.09 : 0.065; e.br.rotation.z = Math.PI / 2 + e.s * (f === "scared" ? -0.35 : f === "happy" ? 0.1 : 0); });
  G.mouth.scale.set(f === "scared" ? 0.045 : f === "happy" ? 0.065 : 0.05, f === "scared" ? 0.05 + 0.015 * Math.sin(t * 20) : f === "happy" ? 0.03 : 0.015, 0.015); G.shovel.visible = !!p.shovel; if (p.lie) { G.root.rotation.set(-Math.PI / 2, 0, 0); G.root.position.y = p.lieY ?? 0.55; G.neck.rotation.set(0, 0, 0); G.arms.forEach((a, i) => a.rotation.set(0, 0, (i ? 1 : -1) * 0.12)); G.legs.forEach((l) => l.rotation.set(0, 0, 0)); }
  G.root.rotation.z += (p.sway ?? 0) * Math.sin(t * 2.2) * 0.12; G.mouth.position.y = -0.1; G.mouth.visible = f !== "happy"; G.smile.visible = f === "happy"; }
