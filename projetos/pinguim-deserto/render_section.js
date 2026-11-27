  SUNS.scale.setScalar(40 + Math.sin(t * 4) * 2);
  if (st.pen) { posePen(st.pen, t); const P0 = st.pen.pos; MELT.position.set(P0[0], 0.006, P0[2] + 0.05); MELT.scale.setScalar(0.35 + 0.15 * (st.pen.melt ?? 0));
    SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 4) % 1; d.visible = !!st.pen.sweat; d.position.set(P0[0] + 0.2 * (i - 1.5), 1.0 - ph * 0.6, P0[2] + 0.22); }); } else PEN.g.visible = false;
  ICE.visible = !!st.ice; SPARK.forEach((s) => (s.visible = false));
  if (st.ice) { const P0 = st.pen.pos, k = st.ice.k; ICE.position.set(P0[0] + 0.02, k < 1 ? 3.0 - 2.68 * k * k : 0.32, P0[2] + 0.36); ICE.rotation.set(k < 1 ? t * 5 : 0.1, k < 1 ? t * 3 : 0.3, 0);
    if (k >= 1) SPARK.forEach((s, i) => { const ph = (t * 1.2 + i / 10) % 1; s.visible = true; s.position.set(ICE.position.x + Math.cos(i * 2.4) * 0.3, ICE.position.y + ph * 0.5, ICE.position.z + Math.sin(i * 2.4) * 0.2); s.scale.setScalar(0.05 * (1 - ph)); }); }
