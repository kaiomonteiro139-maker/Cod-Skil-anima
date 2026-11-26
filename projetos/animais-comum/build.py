# usage: python3 build.py <dir> <GROUND_NAME> — hamster engine + <dir>/beach_section.js + <dir>/render_section.js + like button → <dir>/web/main.js
import sys; D, GN = sys.argv[1], sys.argv[2]
s = open('/root/shorts/hamster/web/main.js').read()
a = s.index('// ---------- room ----------'); b = s.index('// ---------- lights ----------')
s = s[:a] + open(D + '/beach_section.js').read() + s[b:]
s = s.replace("const aqLight = new THREE.PointLight(0xffe0b0, 0.8, 3, 1.5); aqLight.position.set(0, TOP + 1.1, 0.2); scene.add(aqLight);", "")
s = s.replace("WALL.castShadow = FLOOR.castShadow = false; BARS.traverse((o) => (o.castShadow = false));", GN + ".castShadow = false;")
s = s.replace("sun.position.set(-3, 5, 4);", "sun.position.set(-4, 8, 3);")
a = s.index('  WHEEL.rotation.z'); b = s.index('  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value')
s = s[:a] + open(D + '/render_section.js').read() + s[b:]
s = s.replace("far: { value: 100 }", "far: { value: 400 }").replace("0.02, 100); scene.add(camera);", "0.02, 400); scene.add(camera);").replace("CONE = new THREE.ConeGeometry(1, 1, 16);", "CONE = new THREE.ConeGeometry(1, 1, 16), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);")
like = '''function likeBtn(g, e, t) { const s = popS(Math.min(1, e.k)); if (!s) return; const tap = e.tap ?? 0, on = tap > 0.5; g.save(); g.translate(W * 0.83, H * (e.y ?? 0.6)); g.scale(s * (on ? 1 + 0.25 * Math.max(0, 1 - (tap - 0.5) * 4) : 1 + 0.05 * Math.sin(t * 9)), s * (on ? 1 + 0.25 * Math.max(0, 1 - (tap - 0.5) * 4) : 1 + 0.05 * Math.sin(t * 9)));
  const r = 95 * U; g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.arc(6 * U, 10 * U, r, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = on ? "#e5323f" : "#140c10"; g.stroke();
  g.save(); g.scale(r / 80, r / 80); g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -40, -55, 0, -28); g.bezierCurveTo(40, -55, 60, -10, 0, 30); g.restore(); g.fillStyle = on ? "#e5323f" : "#ffffff"; g.fill(); g.lineWidth = 8 * U; g.strokeStyle = on ? "#b0202a" : "#140c10"; g.stroke();
  g.fillStyle = "#fff"; g.strokeStyle = "#140c10"; g.lineWidth = 9 * U; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; const lbl = on ? (e.count || "+1") : "Curtir"; g.strokeText(lbl, 0, r + 45 * U); g.fillText(lbl, 0, r + 45 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 40 * U + m * 70 * U, 120 * U + m * 70 * U); } g.restore(); }
// ---------- render ----------'''
assert '// ---------- render ----------' in s; s = s.replace('// ---------- render ----------', like, 1)
s = s.replace("if (S.follow) followBtn(og, S.follow, t);", "if (S.follow) followBtn(og, S.follow, t); if (S.like) likeBtn(og, S.like, t);")
assert "likeBtn(og, S.like" in s
open(D + '/web/main.js', 'w').write(s); print("built", D)
