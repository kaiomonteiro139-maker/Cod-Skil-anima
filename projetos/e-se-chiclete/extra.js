// ---------- x-ray organs + gum ----------
const ORG = (() => { const g = grp(GUY.body); const pink = new THREE.MeshBasicMaterial({ color: 0xf0907a }), dk = new THREE.MeshBasicMaterial({ color: 0xc8604e });
  const eso = add(CYL, pink, -0.01, 0.6, 0.03, g); eso.scale.set(0.016, 0.2, 0.016);
  const sto = add(SPH, pink, -0.06, 0.42, 0.03, g); sto.scale.set(0.09, 0.065, 0.05); const sto2 = add(SPH, dk, -0.06, 0.42, 0.0, g); sto2.scale.set(0.1, 0.072, 0.04);
  const coil = add(new THREE.TorusGeometry(0.08, 0.022, 10, 32), pink, 0, 0.2, 0.03, g); const coil2 = add(new THREE.TorusGeometry(0.04, 0.018, 10, 24), dk, 0, 0.2, 0.03, g);
  g.visible = false; return g; })();
const GUMM = new THREE.MeshBasicMaterial({ color: 0xff2fd0 });
const GUMS = Array.from({ length: 7 }, () => { const m = add(SPH, GUMM, 0, 0, 0, GUY.body); m.scale.setScalar(0.035); m.renderOrder = 3; m.visible = false; return m; });
const BUBBLE = (() => { const m = add(SPH, new THREE.MeshBasicMaterial({ color: 0xff7ab8, transparent: true, opacity: 0.92 }), 0, -0.1, 0.22, GUY.head); m.visible = false; return m; })();
const ACID = Array.from({ length: 8 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0x9cff6a, transparent: true, depthWrite: false, depthTest: false })); s.renderOrder = 4; GUY.body.add(s); s.visible = false; return s; });
const GPATH = (u) => { const P = [[0, 0.82, 0.15], [-0.01, 0.68, 0.05], [-0.06, 0.42, 0.06]]; if (u < 0.2) { const k = u / 0.2; return k < 0.5 ? P[0].map((v, i) => v + (P[1][i] - v) * k * 2) : P[1].map((v, i) => v + (P[2][i] - v) * (k - 0.5) * 2); }
  if (u < 0.5) return P[2]; if (u < 0.6) { const k = (u - 0.5) / 0.1; return [-0.06 + 0.06 * k, 0.42 - 0.1 * k, 0.06]; } if (u < 0.9) { const a = ((u - 0.6) / 0.3) * Math.PI * 4 + Math.PI / 2; return [Math.cos(a) * 0.08 * (1 - (u - 0.6) * 1.5), 0.2 + Math.sin(a) * 0.08 * (1 - (u - 0.6) * 1.5), 0.07]; } const k = (u - 0.9) / 0.1; return [0, 0.2 - 0.3 * k, 0.07]; };
