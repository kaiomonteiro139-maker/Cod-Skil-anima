  waterTex.offset.y = -t * 0.25;
  if (st.frog) poseFrog(st.frog, t); else FROG.g.visible = false;
  if (st.tur) poseTur(st.tur, t); else TUR.g.visible = false;
  if (st.pup) posePup(st.pup, t); else PUP.g.visible = false;
  if (st.bear) poseBear(st.bear, t); else BEAR.g.visible = false;
  SIGN.g.visible = st.toll != null; if (st.toll != null) { SIGN.draw(st.toll); SIGN.g.scale.setScalar(Math.min(1, 0.4 + (st.signK ?? 1) * 0.6)); }
  const nf = Math.round((st.flies ?? 0) * PILE.flies.length); PILE.flies.forEach((f, i) => (f.visible = i < nf));
  BUZZ.forEach((b, i) => { b.visible = (st.buzz ?? 0) > i / 10; const a = t * (2 + i * 0.3) + i; b.position.set(0.42 + Math.cos(a) * (0.3 + 0.1 * (i % 3)), 0.55 + Math.sin(t * 3 + i) * 0.15, -0.2 + Math.sin(a) * 0.3); });
  GLINT.forEach((s, i) => { s.visible = !!st.glint; if (!st.glint) return; const ph = (t * 1.1 + i / 10) % 1; s.position.set(0.42 + Math.cos(i * 2.4) * 0.3, 0.3 + ph * 0.7, -0.2 + Math.sin(i * 2.4) * 0.3); s.scale.setScalar(0.08 * (1 - ph)); });
  PAY.visible = st.pay != null && st.pay < 1; if (PAY.visible) { const u = st.pay; PAY.position.set(-0.6 + 1.0 * u, 0.9 + Math.sin(u * Math.PI) * 0.4, 0.2 - 0.4 * u); }
