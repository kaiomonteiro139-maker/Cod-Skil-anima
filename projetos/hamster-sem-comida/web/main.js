// "O peixinho com 1 gota d'água" — cracked aquarium on a table, cute 3D fish, leaking drips, pouring cup, water bar + follow overlays.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf2d9b8); const camera = new THREE.PerspectiveCamera(45, W / H, 0.02, 100); scene.add(camera);
let SEED = 4; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([120, 120, 120, 255, 195, 195, 195, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent);
const SPH = new THREE.SphereGeometry(1, 24, 16), CYL = new THREE.CylinderGeometry(1, 1, 1, 24), CONE = new THREE.ConeGeometry(1, 1, 16);
// ---------- room ----------
const wallTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#e9c9a0"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,0.08)" : "rgba(120,80,40,0.05)"; g.fillRect(i * 64, 0, 64, 512); } const t = tex(c); t.repeat.set(4, 2); return t; })();
const woodTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#a8743f"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(70,40,20,0.35)"; g.lineWidth = 3; for (let i = 0; i < 26; i++) { const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 10, 340, y - 10, 512, y + 4); g.stroke(); } for (let y = 0; y < 512; y += 128) { g.strokeStyle = "rgba(50,30,15,0.6)"; g.lineWidth = 5; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } const t = tex(c); t.repeat.set(2, 1); return t; })();
const WALL = add(new THREE.PlaneGeometry(14, 8), toon(0xffffff, wallTex), 0, 3, -2.2); const FLOOR = add(new THREE.PlaneGeometry(14, 10), toon(0x7a5232), 0, 0, 2); FLOOR.rotation.x = -Math.PI / 2;
const TABLE = grp(scene, 0, 0, 0); box(3.4, 0.12, 1.6, toon(0xffffff, woodTex), 0, 0.88, 0, TABLE); for (const [x, z] of [[-1.55, -0.65], [1.55, -0.65], [-1.55, 0.65], [1.55, 0.65]]) box(0.1, 0.88, 0.1, toon(0x6a4026), x, 0, z, TABLE);
const TOP = 1.0;
// window with daylight + plant + frame on the wall
const WIN = grp(scene, -2.2, 2.6, -2.18); add(new THREE.PlaneGeometry(1.5, 1.3), basic(0xbfe6ff), 0, 0, 0, WIN); for (const [w, h, x, y] of [[1.62, 0.08, 0, 0.66], [1.62, 0.08, 0, -0.66], [0.08, 1.4, -0.77, 0], [0.08, 1.4, 0.77, 0], [0.05, 1.3, 0, 0]]) box(w, h, 0.06, toon(0xf6f2ea), x, y - h / 2, 0.02, WIN);
const POT = grp(scene, 1.35, TOP, -0.35); add(CYL, toon(0xd8684a), 0, 0.15, 0, POT).scale.set(0.15, 0.3, 0.15); for (let k = 0; k < 6; k++) { const l = add(SPH, toon(0x3f9a3a), Math.cos(k) * 0.08, 0.42 + k * 0.03, Math.sin(k) * 0.08, POT); l.scale.set(0.08, 0.2, 0.04); l.rotation.z = Math.cos(k) * 0.6; }
const FRAME = grp(scene, 1.8, 2.8, -2.18); box(0.9, 0.7, 0.05, toon(0x6a4026), 0, -0.35, 0, FRAME); add(new THREE.PlaneGeometry(0.75, 0.55), toon(0x7ac0e0), 0, 0, 0.03, FRAME);
// ---------- cage ----------
const AW = 1.5, AH = 0.95, AD = 0.85; const AQ = grp(scene, 0, TOP + 0.02, 0);
box(AW + 0.08, 0.12, AD + 0.08, toon(0x3fa8d8), 0, -0.02, 0, AQ); const BED = add(new THREE.PlaneGeometry(AW, AD), toon(0xf2d9a0), 0, 0.105, 0, AQ); BED.rotation.x = -Math.PI / 2;
for (let i = 0; i < 70; i++) { const s2 = add(SPH, toon(rnd() < 0.5 ? 0xe8c890 : 0xd8b070), (rnd() - 0.5) * (AW - 0.1), 0.11, (rnd() - 0.5) * (AD - 0.1), AQ); s2.scale.set(0.05, 0.012, 0.03); s2.rotation.y = rnd() * 3; }
const barM = toon(0xd8dce4); const BARS = grp(AQ);
for (let i = 0; i <= 20; i++) { const x = -AW / 2 + i * AW / 20; for (const z of [-AD / 2, AD / 2]) { if (z > 0 && x > 0.15 && x < 0.55) continue; add(CYL, barM, x, 0.1 + AH / 2, z, BARS).scale.set(0.006, AH, 0.006); } }
for (let i = 0; i <= 11; i++) { const z = -AD / 2 + i * AD / 11; for (const x of [-AW / 2, AW / 2]) add(CYL, barM, x, 0.1 + AH / 2, z, BARS).scale.set(0.006, AH, 0.006); }
for (const y of [0.1 + AH, 0.55]) { for (const z of [-AD / 2, AD / 2]) { const r = add(CYL, barM, 0, y, z, BARS); r.scale.set(0.01, AW, 0.01); r.rotation.z = Math.PI / 2; } for (const x of [-AW / 2, AW / 2]) { const r = add(CYL, barM, x, y, 0, BARS); r.scale.set(0.01, AD, 0.01); r.rotation.x = Math.PI / 2; } }
// wheel, little house, water bottle
const WHEEL = grp(AQ, -0.45, 0.42, -0.15); { const ring = add(new THREE.TorusGeometry(0.28, 0.02, 8, 40), toon(0xf2c230), 0, 0, 0, WHEEL); for (let k = 0; k < 14; k++) { const r = add(CYL, toon(0xf2c230), Math.cos(k / 14 * 6.28) * 0.28, Math.sin(k / 14 * 6.28) * 0.28, 0, WHEEL); r.scale.set(0.008, 0.14, 0.008); r.rotation.x = Math.PI / 2; } box(0.04, 0.32, 0.04, toon(0xe5483b), 0, -0.6, -0.08, WHEEL); }
const HUT = grp(AQ, 0.45, 0.1, -0.22); box(0.36, 0.26, 0.3, toon(0xe8a050), 0, 0, 0, HUT); const roof = add(CONE, toon(0xd8484a), 0, 0.38, 0, HUT); roof.scale.set(0.3, 0.2, 0.26); roof.rotation.y = Math.PI / 4; add(new THREE.CircleGeometry(0.08, 20), toon(0x3a2414), 0, 0.1, 0.151, HUT);
const BOT = grp(AQ, -0.72, 0.55, 0.15); add(CYL, new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.6 }), 0, 0.15, 0, BOT).scale.set(0.05, 0.3, 0.05); const spout = add(CYL, barM, 0.03, -0.03, 0, BOT); spout.scale.set(0.008, 0.12, 0.008); spout.rotation.z = 0.8;
// food bowl (fill 0..1) near the cage door
const BOWL = grp(AQ, 0.32, 0.1, 0.18); add(new THREE.CylinderGeometry(0.15, 0.11, 0.08, 24, 1, true), toon(0x2fb36a, null, { side: THREE.DoubleSide }), 0, 0.04, 0, BOWL); add(CYL, toon(0x2fb36a), 0, 0.004, 0, BOWL).scale.set(0.11, 0.008, 0.11);
const SEEDG = new THREE.SphereGeometry(1, 8, 6); const seedM = [toon(0x2a2a30), toon(0xe8dcc0)];
const SEEDS = []; for (let i = 0; i < 40; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 0.11; const m = add(SEEDG, seedM[i % 2], Math.cos(a) * r, 0.02 + (i / 40) * 0.05, Math.sin(a) * r, BOWL); m.scale.set(0.022, 0.012, 0.012); m.rotation.y = rnd() * 3; SEEDS.push(m); }
const FALL = Array.from({ length: 14 }, (_, i) => { const m = add(SEEDG, seedM[i % 2], 0, 0, 0); m.scale.set(0.022, 0.012, 0.012); return m; });
// ---------- the hamster ----------
const HAM = (() => { const g = grp(scene); const fur = toon(0xe8a860), cream = toon(0xfff2dc), pink = toon(0xf4a0a8), ink = toon(0x141014), wht = basic(0xffffff);
  const body = grp(g); const b = add(SPH, fur, 0, 0.11, 0, body); b.scale.set(0.15, 0.12, 0.18); const bel = add(SPH, cream, 0, 0.09, 0.06, body); bel.scale.set(0.12, 0.09, 0.13);
  const head = grp(body, 0, 0.15, 0.13); add(SPH, fur, 0, 0, 0, head).scale.set(0.12, 0.11, 0.1); const face = add(SPH, cream, 0, -0.03, 0.05, head); face.scale.set(0.09, 0.07, 0.07);
  const cheeks = []; for (const s of [-1, 1]) { const c = add(SPH, cream, s * 0.075, -0.035, 0.04, head); c.scale.setScalar(0.045); cheeks.push(c); add(SPH, pink, s * 0.07, -0.02, 0.09, head).scale.set(0.02, 0.012, 0.01); }
  add(SPH, pink, 0, -0.015, 0.11, head).scale.set(0.014, 0.01, 0.01);
  for (const s of [-1, 1]) { add(SPH, fur, s * 0.08, 0.09, -0.01, head).scale.set(0.04, 0.045, 0.02); add(SPH, pink, s * 0.08, 0.09, 0.003, head).scale.set(0.025, 0.03, 0.01); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.05, 0.02, 0.085); const ball = add(SPH, ink, 0, 0, 0, e); ball.scale.set(0.022, 0.026, 0.015); add(SPH, wht, 0.007, 0.009, 0.012, e).scale.setScalar(0.007); eyes.push(ball); }
  const brows = []; for (const s of [-1, 1]) { const br = add(CYL, ink, s * 0.05, 0.06, 0.08, head); br.scale.set(0.004, 0.03, 0.004); br.rotation.z = Math.PI / 2; brows.push(br); }
  const paws = []; for (const s of [-1, 1]) { const p = add(SPH, pink, s * 0.05, -0.07, 0.07, head); p.scale.setScalar(0.022); paws.push(p); }
  const feet = []; for (const [x, z] of [[-0.08, -0.1], [0.08, -0.1]]) { const f = add(SPH, pink, x, 0.01, z, body); f.scale.set(0.03, 0.015, 0.04); feet.push(f); }
  return { g, body, head, cheeks, eyes, brows, paws };
})();
/** hamster: { pos (cage-local), yaw, weak 0..1 (lying flat, sad), eat 0..1 (cheeks puffed, chewing), run, jump, look } */
function poseHam(p, t) { const Hm = HAM; Hm.g.visible = true; const ap = AQ.position, wk = p.weak ?? 0, eat = p.eat ?? 0;
  Hm.g.position.set(ap.x + p.pos[0], ap.y + p.pos[1] + (p.jump ? Math.abs(Math.sin(t * 9)) * 0.12 : 0) + (p.run ? Math.abs(Math.sin(t * 16)) * 0.02 : 0), ap.z + p.pos[2]); Hm.g.rotation.y = p.yaw ?? 0;
  Hm.body.scale.set(1 + 0.12 * wk, 1 - 0.3 * wk + 0.02 * Math.sin(t * (wk ? 2 : 6)), 1); Hm.body.rotation.z = wk * 0.15; Hm.head.rotation.x = 0.35 * wk - (p.look ?? 0) * 0.2; Hm.head.position.y = 0.15 - 0.05 * wk;
  Hm.cheeks.forEach((c) => c.scale.setScalar(0.045 * (1 + 0.6 * eat + 0.08 * eat * Math.sin(t * 18)))); Hm.paws.forEach((pw, i) => (pw.position.y = -0.07 + eat * 0.03 * Math.abs(Math.sin(t * 18 + i))));
  Hm.eyes.forEach((e) => (e.scale.y = (((t * 1000) % 3000) < 110 ? 0.004 : 0.026) * (1 - 0.6 * wk))); Hm.brows.forEach((br, i) => { br.rotation.z = Math.PI / 2 + (i ? -1 : 1) * 0.5 * (p.sad ?? wk); br.visible = (p.sad ?? wk) > 0.2; }); }
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-3, 5, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);
const aqLight = new THREE.PointLight(0xffe0b0, 0.8, 3, 1.5); aqLight.position.set(0, TOP + 1.1, 0.2); scene.add(aqLight);
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); WALL.castShadow = FLOOR.castShadow = false; BARS.traverse((o) => (o.castShadow = false));
// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.02 }, far: { value: 100 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 4.2 * Math.min(W, H) / 1080 }, vig: { value: 0.35 }, red: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig, red; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.02, 0.06, e) * (1.0 - smoothstep(20.0, 60.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 18.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.85, 0.0); }
      c += bl / 12.0; c = mix(c, vec3(0.07, 0.05, 0.05), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      vec2 v = vUv - 0.5; float vg = smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); c *= 1.0 - vig * vg; c = mix(c, vec3(0.9, 0.1, 0.1), red * vg * 0.6); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
// ---------- overlays ----------
const U = Math.min(W, H) / 1080; const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const popS = (k) => (k <= 0 ? 0 : k < 1 ? 0.4 + 0.6 * k + 0.18 * Math.sin(k * Math.PI) : 1);
function waterBar(g, e, t) { const s = popS(e.k); if (!s) return; g.save(); g.translate(W / 2, H * 0.1); g.scale(s, s); const bw = 760 * U, bh = 150 * U, low = e.v < 0.1, blink = low && (t * 2.5) % 1 < 0.5;
  g.fillStyle = "rgba(0,0,0,0.3)"; rr(g, -bw / 2 + 8 * U, -bh / 2 + 12 * U, bw, bh, 36 * U); g.fill(); g.fillStyle = "#fbf7ee"; rr(g, -bw / 2, -bh / 2, bw, bh, 36 * U); g.fill(); g.lineWidth = 9 * U; g.strokeStyle = blink ? "#e5323f" : "#140c10"; g.stroke();
  g.textAlign = "left"; g.textBaseline = "middle"; g.font = `${70 * U}px "Noto Color Emoji"`; g.fillText(e.icon || "💧", -bw / 2 + 28 * U, -12 * U);
  g.fillStyle = "#140c10"; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.fillText(e.label || "ÁGUA:", -bw / 2 + 125 * U, -28 * U); g.fillStyle = low ? "#e5323f" : (e.col || "#2a9ad8"); g.font = `900 ${60 * U}px "Inter", "DejaVu Sans"`; g.fillText(`${Math.round(e.v * 100)}%`, -bw / 2 + (e.numX || 300) * U, -26 * U);
  const x0 = -bw / 2 + 125 * U, w0 = bw - 160 * U, y0 = 20 * U, h0 = 34 * U; g.fillStyle = "#d8d4cc"; rr(g, x0, y0, w0, h0, h0 / 2); g.fill(); g.fillStyle = low ? "#e5323f" : (e.col || "#2a9ad8"); rr(g, x0, y0, Math.max(h0, w0 * e.v), h0, h0 / 2); g.fill(); g.lineWidth = 4 * U; g.strokeStyle = "#140c10"; rr(g, x0, y0, w0, h0, h0 / 2); g.stroke(); g.restore(); }
function tagPill(g, e) { const s = popS(e.k); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.22)); g.scale(s, s); g.rotate(-0.03); g.font = `900 ${54 * U}px "Inter", "DejaVu Sans"`; const tw = g.measureText(e.text).width + 70 * U, bh = 100 * U;
  g.fillStyle = e.bg || "#ffd23f"; rr(g, -tw / 2, -bh / 2, tw, bh, 24 * U); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = "#140c10"; g.stroke(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 0, 4 * U); g.restore(); }
function followBtn(g, e, t) { const k = Math.min(1, e.k), tap = e.tap ?? 0, s = popS(k) * (1 + 0.06 * Math.sin(t * 10) * (tap > 0 ? 0 : 1)); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.85)); g.scale(s, s); const done = tap > 0.5, bw = 470 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, bh / 2); g.fill(); g.fillStyle = done ? "#3a3d44" : "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(done ? "✓ Seguindo" : "+ Seguir", 0, 4 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 150 * U + m * 60 * U, 110 * U + m * 60 * U); } g.restore(); }
// ---------- render ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 45; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.015 * st.shake; camera.position.y += Math.sin(t * 47) * 0.015 * st.shake; } camera.updateProjectionMatrix();
  WHEEL.rotation.z = (st.wheel ?? 0) * t * -8;
  const fill = st.bowl ?? 0; SEEDS.forEach((m, i) => (m.visible = i / SEEDS.length < fill)); FALL.forEach((m) => (m.visible = false));
  if (st.pour) { const ap = AQ.position; FALL.forEach((m, i) => { const ph = (st.pour * 3 + i / FALL.length) % 1; m.visible = st.pour > 0 && st.pour < 1; m.position.set(ap.x + 0.32 + Math.sin(i * 2.3) * 0.06, ap.y + 1.3 - ph * 1.15, ap.z + 0.18 + Math.cos(i * 1.7) * 0.05); m.rotation.z = t * 6 + i; }); }
  if (st.ham) poseHam(st.ham, t); else HAM.g.visible = false;
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
