  FOAM.position.z = -6.2 + Math.sin(t * 1.2) * 0.25; SUNS.scale.setScalar(26 + Math.sin(t * 4) * 1.5);
  const wz = lerp0(-5.6, -0.9, st.wave ?? 0) + Math.sin(t * 1.4) * 0.12; WAVE.position.z = wz; WAVE.visible = true;
  if (st.crab) { poseCrab(st.crab, t); const P0 = st.crab.pos; SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 3) % 1; d.visible = (st.crab.hot ?? 0) > 0.5; d.position.set(P0[0] + 0.1 * (i - 1), P0[1] + 0.38 - ph * 0.3, P0[2] + 0.12); });
    HEAT.forEach((s, i) => { const ph = (t * 0.6 + i / 8) % 1; s.visible = (st.crab.hot ?? 0) > 0.5; s.position.set(P0[0] + Math.cos(i * 2.1) * 0.5, 0.05 + ph * 0.6, P0[2] + Math.sin(i * 2.1) * 0.4); s.material.opacity = 0.35 * (1 - ph); }); } else CRAB.g.visible = false;
