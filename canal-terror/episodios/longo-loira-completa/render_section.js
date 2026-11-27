  scene.background.setHex(st.sky ?? 0x0a1014);
  const lt = st.light ?? 1; TUBES.forEach((tb, i) => { const f = lt * (st.flicker ? (Math.sin(t * 37 + i * 3) > -0.2 && Math.sin(t * 11.3 + i) > -0.7 ? 1 : 0.08) : 1); tb.L0.intensity = 1.4 * f; tb.m.material.color.setHex(f > 0.5 ? 0xe8fff0 : 0x2a3430); });
  HEMI.intensity = 0.25 + 0.55 * lt; sun.intensity = 0.15 + 0.85 * lt; HEMI.color.setHex(st.warm ? 0xfff0d8 : 0xcfe8e0);
  STALLS.forEach((s, i) => { s.pv.rotation.y = (st.doors?.[i] ?? 0); s.wat.rotation.z = st.flush === i ? t * 12 : 0; s.wat.material.color.setHex(st.flush === i ? 0x4a90c0 : 0x7ab0c8); });
  EXIT.rotation.y = -(st.exit ?? 0) + (st.rattle ? Math.sin(t * 40) * 0.015 : 0);
  { const a = DUST.geometry.attributes.position.array, b = DUST.userData.base; for (let i = 0; i < a.length / 3; i++) a[i * 3 + 1] = ((b[i * 3 + 1] + t * 0.05 + Math.sin(t + i) * 0.05) % 3.2); DUST.geometry.attributes.position.needsUpdate = true; }
  PUDDLES.forEach((m) => (m.visible = !!st.puddles)); FOG.material.opacity = st.fog ?? 0; TAPE.visible = !!st.tape; COTTON.visible = !!st.cotton;
  DRIP.visible = !!st.drip; if (st.drip) DRIP.position.y = 1.0 - ((t * 1.1) % 1) * 0.12;
  WAKE.flames.forEach((f, i) => f.scale.set(0.035, 0.07 + 0.012 * Math.sin(t * 13 + i * 2), 0.035));
  RAINW.visible = !!st.rain; if (st.rain) { const p = RAINW.geometry.attributes.position.array; for (let i = 0; i < p.length / 6; i++) { const x = st.rain[0] + ((i * 37) % 100) / 100 * 6 - 3, z = st.rain[2] + ((i * 53) % 100) / 100 * 4 - 2, y = 4 - ((t * 6 + i * 0.37) % 4); p.set([x, y, z, x - 0.02, y - 0.3, z], i * 6); } RAINW.geometry.attributes.position.needsUpdate = true; }
  if (st.guy) { poseGuy(st.guy, t); GUY.red.opacity = 1; GUY.g.scale.setScalar(st.guy.scale ?? 0.8); } else GUY.g.visible = false;
  if (st.ghost) poseGirl(GHOST, st.ghost, t); else GHOST.g.visible = false;
  if (st.gran) poseGirl(GRAN, { alive: 1, ...st.gran }, t); else GRAN.g.visible = false;
