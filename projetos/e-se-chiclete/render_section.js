  CLOCK.hh.rotation.z = -(st.clock ?? t * 0.05) / 12 * 6.28; CLOCK.mh.rotation.z = -(st.clock ?? t * 0.05) * 6.28;
  if (st.guy) { poseGuy(st.guy, t); GUY.red.opacity = 1 - 0.6 * (st.xray ?? 0); GUY.red.depthWrite = (st.xray ?? 0) < 0.1; } else GUY.g.visible = false;
  ORG.visible = (st.xray ?? 0) > 0.05; GUMS.forEach((m) => (m.visible = false));
  if (st.gum != null) { const m = GUMS[0]; m.visible = (st.xray ?? 0) > 0.05 || st.gum < 0.05; m.position.set(...GPATH(st.gum)); m.scale.setScalar(0.03); }
  if (st.many) GUMS.forEach((m, i) => { m.visible = true; const c = st.many; const a = i * 0.9 + t * 0.5, r = 0.07 * (1 - c) + 0.015; m.position.set(-0.06 + Math.cos(a) * r, 0.42 + Math.sin(a) * r * 0.8, 0.07); m.scale.setScalar(0.022 + 0.01 * c); });
  BUBBLE.visible = (st.bubble ?? 0) > 0; BUBBLE.scale.setScalar(Math.max(0.001, (st.bubble ?? 0) * 0.13));
  ACID.forEach((s, i) => { s.visible = !!st.acid; if (!st.acid) return; const ph = (t * 1.2 + i / 8) % 1; s.position.set(-0.06 + Math.sin(i * 2.1) * 0.05, 0.39 + ph * 0.08, 0.1); s.scale.setScalar(0.02 * (1 - ph) + 0.008); });
