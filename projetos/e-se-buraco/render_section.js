  const sp = !!st.space; YARD.visible = !sp; SPACE.visible = sp; scene.background.setHex(sp ? 0x050814 : 0xa8d4f0); DIRT.scale.setScalar(st.dirt ?? 1);
  if (sp) { EARTH.g.rotation.y = 0; EARTH.glow.scale.setScalar(1.4 + 0.15 * Math.sin(t * 6) + (st.hot ?? 0) * 0.8); PINS.forEach((p) => (p.visible = !!st.pins)); }
  if (st.guy) { poseGuy(st.guy, t); GUY.g.scale.setScalar(st.guy.scale ?? 1); } else GUY.g.visible = false;
  CLODS.forEach((c) => (c.visible = false)); if (st.dig) CLODS.forEach((c, i) => { const ph = (t * 1.4 + i / 10) % 1; c.visible = true; c.position.set(-0.2 - ph * 0.9, 0.2 + Math.sin(ph * Math.PI) * 0.9, 0.1 - ph * 0.4 + (i % 3) * 0.08); });
