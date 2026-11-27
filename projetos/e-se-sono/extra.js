// ---------- hallucinations + Zzz ----------
const GHOSTS = [0xb05aff, 0x4ae0a0, 0x4ac8ff, 0xff6ab0, 0xffd04a].map((col, i) => { const g = grp(scene); const b = add(SPH, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85 }), 0, 0, 0, g); b.scale.set(0.22, 0.26, 0.22);
  for (const s of [-1, 1]) { add(SPH, basic(0xffffff), s * 0.08, 0.05, 0.18, g).scale.setScalar(0.06); add(SPH, basic(0x140c10), s * 0.08, 0.05, 0.23, g).scale.setScalar(0.03); } g.visible = false; return g; });
const ZZ = [0, 1, 2].map(() => letterSprite("Z", "#ffffff"));
