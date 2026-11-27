  CLOCK.hh.rotation.z = -(st.clock ?? t * 0.05) / 12 * 6.28; CLOCK.mh.rotation.z = -(st.clock ?? t * 0.05) * 6.28;
  const day = st.daylight ?? 0; WIN.sky.material.color.setHex(day > 0.5 ? 0x8fd0ff : 0x1c2a5a); WIN.moon.visible = day < 0.5; LAMP.intensity = day > 0.5 ? 0.3 : 1.2;
  if (st.guy) { poseGuy(st.guy, t); GUY.red.opacity = 1; } else GUY.g.visible = false;
  GHOSTS.forEach((g, i) => { g.visible = (st.ghosts ?? 0) > 0; if (!g.visible) return; const a = t * 0.7 + i * 1.26; g.position.set(0.4 + Math.cos(a) * 1.5, 1.6 + Math.sin(t * 1.3 + i) * 0.5, Math.sin(a) * 1.2 - 0.3); g.scale.setScalar(Math.min(1, st.ghosts) * (1 + 0.1 * Math.sin(t * 5 + i))); g.lookAt(camera.position); });
  ZZ.forEach((z, i) => { z.visible = !!st.zzz; if (!st.zzz) return; const ph = (t * 0.5 + i / 3) % 1; const H0 = GUY.head.getWorldPosition(new THREE.Vector3()); z.position.set(H0.x + 0.2 + ph * 0.4, H0.y + 0.3 + ph * 0.8, H0.z + 0.2); z.scale.setScalar(0.15 + ph * 0.2); z.material.opacity = 1 - ph; });
