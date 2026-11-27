// ---------- old school bathroom at night ----------
scene.background = new THREE.Color(0x0a1014);
const tileTex = (base, line, rep) => { const [c, g] = cv(256, 256); g.fillStyle = base; g.fillRect(0, 0, 256, 256); g.strokeStyle = line; g.lineWidth = 6; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(256, i * 64); g.stroke(); } for (let i = 0; i < 25; i++) { g.fillStyle = "rgba(60,70,50,0.12)"; g.beginPath(); g.arc(rnd() * 256, rnd() * 256, 4 + rnd() * 18, 0, 7); g.fill(); } const t = tex(c); t.repeat.set(rep[0], rep[1]); return t; };
const FLOOR = add(new THREE.PlaneGeometry(12, 12), toon(0xffffff, tileTex("#c8ccc0", "#8a907e", [8, 8])), 0, 0, 0); FLOOR.rotation.x = -Math.PI / 2; const SNOW = FLOOR;
const wallT = tileTex("#a8c8b4", "#6a8a76", [10, 3]); const wallM = toon(0xffffff, wallT);
const BACK = box(12, 3.4, 0.2, wallM, 0, 0, -2.7); const LEFT = box(0.2, 3.4, 12, wallM, -2.7, 0, 0); const RIGHT = box(0.2, 3.4, 12, wallM, 2.9, 0, 0);
const CEIL = add(new THREE.PlaneGeometry(12, 12), toon(0x6a7a70), 0, 3.4, 0); CEIL.rotation.x = Math.PI / 2;
// three stalls on the back wall, the last one (x = 1.5) is hers
const STALLS = []; const doorM = toon(0x4a7a5a), partM = toon(0x5a8a6a), por = toon(0xf2f2ea);
for (let k = 0; k < 3; k++) { const x = -0.9 + k * 1.2; box(0.06, 2.0, 1.3, partM, x - 0.6, 0.1, -2.0); if (k === 2) box(0.06, 2.0, 1.3, partM, x + 0.6, 0.1, -2.0);
  const tg = grp(scene, x, 0, -2.45); add(CYL, por, 0, 0.2, 0.05, tg).scale.set(0.2, 0.4, 0.24); const bowl = add(new THREE.TorusGeometry(0.18, 0.05, 8, 20), por, 0, 0.42, 0.1, tg); bowl.rotation.x = Math.PI / 2; box(0.42, 0.4, 0.16, por, 0, 0.55, -0.12, tg); const handle = box(0.1, 0.03, 0.03, toon(0xb0b4b8), -0.16, 0.86, -0.03, tg); const wat = add(new THREE.CircleGeometry(0.15, 20), toon(0x7ab0c8), 0, 0.4, 0.1, tg); wat.rotation.x = -Math.PI / 2;
  const pv = grp(scene, x - 0.56, 0.12, -1.35); const door = box(1.08, 1.9, 0.05, doorM, 0.54, 0, 0, pv); box(0.06, 0.06, 0.06, toon(0xc0c0c0), 0.98, 0.95, 0.04, pv); STALLS.push({ pv, wat, tg }); }
const NUM = (() => { const [c, x] = cv(128, 128); x.fillStyle = "#f2f2ea"; x.beginPath(); x.arc(64, 64, 58, 0, 7); x.fill(); x.fillStyle = "#1a1214"; x.font = "900 80px DejaVu Sans"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("3", 64, 70); const m = add(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: tex(c, false) }), 0.54, 1.5, 0.04, STALLS[2].pv); return m; })();
// sinks + mirror on the left wall
const MIRROR = (() => { const g = grp(scene, -2.58, 0, 0.6); box(0.08, 1.0, 1.8, toon(0x9a9a92), 0, 1.4, 0, g); const m = add(new THREE.PlaneGeometry(1.7, 0.9), toon(0x8aa6b4), 0.05, 1.9, 0, g); m.rotation.y = Math.PI / 2; for (const z of [-0.45, 0.45]) { const s = add(SPH, por, 0.3, 0.9, z, g); s.scale.set(0.24, 0.08, 0.2); box(0.08, 0.9, 0.08, por, 0.3, 0, z, g); add(CYL, toon(0xb0b4b8), 0.12, 1.02, z, g).scale.set(0.02, 0.14, 0.02); } return g; })();
// fluorescent tubes
const TUBES = [-1.2, 0.6].map((z) => { const m = box(0.18, 0.06, 1.4, new THREE.MeshBasicMaterial({ color: 0xe8fff0 }), 0, 3.3, z); const L0 = new THREE.PointLight(0xdfffe8, 1.4, 7, 1.4); L0.position.set(0, 3.0, z); scene.add(L0); return { m, L0 }; });
const TOP = 0;
