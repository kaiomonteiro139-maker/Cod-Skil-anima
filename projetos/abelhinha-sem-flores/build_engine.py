s=open('/root/shorts/hamster/web/main.js').read()
a=s.index('// ---------- room ----------'); b=s.index('// ---------- lights ----------')
new=open('beach_section.js').read()
s=s[:a]+new+s[b:]
s=s.replace("const aqLight = new THREE.PointLight(0xffe0b0, 0.8, 3, 1.5); aqLight.position.set(0, TOP + 1.1, 0.2); scene.add(aqLight);","")
s=s.replace("WALL.castShadow = FLOOR.castShadow = false; BARS.traverse((o) => (o.castShadow = false));","SAND.castShadow = SEA.castShadow = false;")
s=s.replace("sun.position.set(-3, 5, 4);","sun.position.set(-4, 8, 3);")
a=s.index('  WHEEL.rotation.z'); b=s.index('  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value')
s=s[:a]+open('render_section.js').read()+s[b:]
open('web/main.js','w').write(s)
