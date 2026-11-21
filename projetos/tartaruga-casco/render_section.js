  FOAM.position.z = -6.2 + Math.sin(t * 1.2) * 0.25; SUNS.scale.setScalar(26 + Math.sin(t * 4) * 1.5);
  if (st.tur) { poseTur(st.tur, t); SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 3) % 1; d.visible = !!st.tur.sweat; d.position.set(st.tur.pos[0] + 0.12 * (i - 1), 0.55 - ph * 0.4, st.tur.pos[2] + 0.55); }); } else TUR.g.visible = false;
  HAND.visible = !!st.hand; GLOWS.forEach((g2) => (g2.visible = false));
  if (st.hand && st.tur) { const h = st.hand; HAND.position.set(st.tur.pos[0] + 0.8 - 0.35 * h.k, 0.35, st.tur.pos[2] + 0.1); HAND.rotation.set(0, -Math.PI / 2, 0.2); HAND.scale.setScalar(Math.max(0.01, Math.min(1, h.k * 3)));
    GLOWS.forEach((g2, i) => { const ph = (t * 1.5 + i / 10) % 1; g2.visible = true; g2.position.set(HAND.position.x + Math.cos(i * 2.4) * 0.3 * ph, 0.3 + ph * 0.6, HAND.position.z + Math.sin(i * 2.4) * 0.3 * ph); g2.scale.setScalar(0.06 * (1 - ph)); }); }
