# usage: python3 build.py <project_dir>  — room + guy + fx + <dir>/extra.js + <dir>/render_section.js → <dir>/web/main.js
import sys; D = sys.argv[1]; C = "/root/shorts/ese_common/"
s = open('/root/shorts/hamster/web/main.js').read()
a = s.index('// ---------- room ----------'); b = s.index('// ---------- lights ----------')
s = s[:a] + open(C + 'room.js').read() + open(C + 'guy.js').read() + open(C + 'fx.js').read() + open(D + '/extra.js').read() + s[b:]
s = s.replace("const aqLight = new THREE.PointLight(0xffe0b0, 0.8, 3, 1.5); aqLight.position.set(0, TOP + 1.1, 0.2); scene.add(aqLight);", "")
s = s.replace("WALL.castShadow = FLOOR.castShadow = false; BARS.traverse((o) => (o.castShadow = false));", "FLOOR.castShadow = BACK.castShadow = LEFT.castShadow = false;")
s = s.replace("scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-3, 5, 4);", "scene.add(new THREE.HemisphereLight(0xe8eeff, 0x6a5a4a, 1.0)); const sun = new THREE.DirectionalLight(0xfff0d8, 1.6); sun.position.set(2, 5, 4);")
a = s.index('  WHEEL.rotation.z'); b = s.index('  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value')
s = s[:a] + open(D + '/render_section.js').read() + s[b:]
s = s.replace("far: { value: 100 }", "far: { value: 400 }").replace("0.02, 100); scene.add(camera);", "0.02, 400); scene.add(camera);").replace("CONE = new THREE.ConeGeometry(1, 1, 16);", "CONE = new THREE.ConeGeometry(1, 1, 16), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);")
old = 'g.fillStyle = e.bg || "#ffd23f"; rr(g, -tw / 2, -bh / 2, tw, bh, 24 * U); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = "#140c10"; g.stroke(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 0, 4 * U);'
new = 'if (e.label) { const tw2 = tw + 40 * U; g.fillStyle = "#fff"; rr(g, -tw2 / 2, -bh / 2, tw2, bh, bh / 2); g.fill(); g.lineWidth = 8 * U; g.strokeStyle = "#e5323f"; g.stroke(); g.fillStyle = "#e5323f"; g.beginPath(); g.arc(-tw2 / 2 + 45 * U, 0, 13 * U, 0, 7); g.fill(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 22 * U, 4 * U); } else { ' + old + ' }'
assert old in s; s = s.replace(old, new)
open(D + '/web/main.js', 'w').write(s); print("built", D)
