// "O gato que fingiu de morto" — cozy living room, 3D toon cat (plays dead), owner, food bowl, hidden camera, viral-video overlay.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf2d9b8); const camera = new THREE.PerspectiveCamera(45, W / H, 0.02, 100); scene.add(camera);
let SEED = 6; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([120, 120, 120, 255, 195, 195, 195, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent);
const SPH = new THREE.SphereGeometry(1, 24, 16), CYL = new THREE.CylinderGeometry(1, 1, 1, 24), CONE = new THREE.ConeGeometry(1, 1, 16), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);
// ---------- room ----------
const wallTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#cfe0c8"; g.fillRect(0, 0, 512, 512); g.fillStyle = "rgba(255,255,255,0.35)"; for (let y = 0; y < 512; y += 64) for (let x = (y / 64) % 2 * 32; x < 512; x += 64) { g.beginPath(); g.arc(x + 16, y + 16, 5, 0, 7); g.fill(); } const t = tex(c); t.repeat.set(5, 3); return t; })();
const woodTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#b07a46"; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 512; y += 64) { g.fillStyle = `rgba(${rnd() < 0.5 ? "90,50,25" : "200,150,100"},0.25)`; g.fillRect(0, y, 512, 64); g.strokeStyle = "rgba(60,35,18,0.6)"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } const t = tex(c); t.repeat.set(4, 4); return t; })();
const WALL = add(new THREE.PlaneGeometry(16, 8), toon(0xffffff, wallTex), 0, 3, -3); const WALL2 = add(new THREE.PlaneGeometry(10, 8), toon(0xffffff, wallTex), -4.5, 3, 1); WALL2.rotation.y = Math.PI / 2;
const FLOOR = add(new THREE.PlaneGeometry(16, 12), toon(0xffffff, woodTex), 0, 0, 2); FLOOR.rotation.x = -Math.PI / 2;
const RUG = add(new THREE.CircleGeometry(1.6, 48), toon(0xd86a6a), 0.3, 0.005, 0.4); RUG.rotation.x = -Math.PI / 2; RUG.scale.set(1.3, 0.9, 1); const RUG2 = add(new THREE.RingGeometry(1.25, 1.4, 48), toon(0xf2e2c0), 0.3, 0.008, 0.4); RUG2.rotation.x = -Math.PI / 2; RUG2.scale.set(1.3, 0.9, 1);
const SOFA = grp(scene, 0.3, 0, -2.3); const sofaM = toon(0x4a7ac0); box(3.2, 0.45, 1.0, sofaM, 0, 0.12, 0, SOFA); box(3.2, 0.9, 0.3, sofaM, 0, 0.12, -0.45, SOFA); for (const s of [-1, 1]) box(0.3, 0.7, 1.0, sofaM, s * 1.6, 0.12, 0, SOFA); for (const s of [-0.75, 0.75]) box(1.4, 0.15, 0.8, toon(0x6a9ad8), s, 0.57, 0.05, SOFA);
for (const [x, c] of [[-1.0, 0xf2c230], [1.1, 0xe5483b]]) { const p = add(SPH, toon(c), x, 0.95, -0.25, SOFA); p.scale.set(0.28, 0.24, 0.1); p.rotation.z = 0.2; }
const WIN = grp(scene, 2.6, 2.4, -2.98); add(new THREE.PlaneGeometry(1.6, 1.4), basic(0xbfe6ff), 0, 0, 0, WIN); for (const [w, h, x, y] of [[1.72, 0.08, 0, 0.7], [1.72, 0.08, 0, -0.7], [0.08, 1.48, -0.82, 0], [0.08, 1.48, 0.82, 0], [0.05, 1.4, 0, 0]]) box(w, h, 0.06, toon(0xf6f2ea), x, y - h / 2, 0.02, WIN);
for (const s of [-1, 1]) box(0.45, 1.8, 0.05, toon(0xe8a050), s * 1.05, -0.9, 0.06, WIN);
// shelf with the hidden camera (on the left wall)
const SHELF = grp(scene, -4.45, 1.8, -0.6); box(0.35, 0.05, 1.4, toon(0x8a5a32), 0.12, 0, 0, SHELF); for (let i = 0; i < 5; i++) box(0.22, 0.28 + rnd() * 0.12, 0.08, toon([0xc0392b, 0x2d6fd0, 0xf2c230, 0x2fb36a, 0x8e44ad][i]), 0.12, 0.05, -0.55 + i * 0.1, SHELF);
const CAMR = grp(SHELF, 0.15, 0.05, 0.35); box(0.2, 0.14, 0.14, toon(0x2a2a30), 0, 0, 0, CAMR); const lens = add(CYL, toon(0x141418), 0.12, 0.07, 0, CAMR); lens.scale.set(0.05, 0.06, 0.05); lens.rotation.z = Math.PI / 2;
add(CYL, basic(0x3a6aa0), 0.155, 0.07, 0, CAMR).scale.set(0.035, 0.005, 0.035); CAMR.children[CAMR.children.length - 1].rotation.z = Math.PI / 2; const RECL = add(SPH, basic(0xff2020), 0.1, 0.13, -0.05, CAMR); RECL.scale.setScalar(0.018);
CAMR.rotation.y = -0.4;
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })();
const RECG = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff3030, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); RECG.scale.setScalar(0.15); RECL.add(RECG); RECG.scale.setScalar(6);
// lamp + plant
const LAMP = grp(scene, -2.4, 0, -2.4); add(CYL, toon(0x3a3a40), 0, 0.8, 0, LAMP).scale.set(0.03, 1.6, 0.03); const shade = add(new THREE.CylinderGeometry(0.18, 0.3, 0.35, 20, 1, true), toon(0xf6e2b0, null, { side: THREE.DoubleSide }), 0, 1.7, 0, LAMP);
const PLANT = grp(scene, 2.7, 0, -2.4); add(CYL, toon(0xd8684a), 0, 0.22, 0, PLANT).scale.set(0.22, 0.44, 0.22); for (let k = 0; k < 8; k++) { const l = add(SPH, toon(0x3f9a3a), Math.cos(k) * 0.15, 0.7 + k * 0.06, Math.sin(k) * 0.15, PLANT); l.scale.set(0.1, 0.3, 0.05); l.rotation.set(Math.sin(k) * 0.5, k, Math.cos(k) * 0.6); }
// food bowl (fill 0..1)
const BOWL = grp(scene, 1.4, 0, 0.9); add(new THREE.CylinderGeometry(0.22, 0.17, 0.12, 28, 1, true), toon(0xe5483b, null, { side: THREE.DoubleSide }), 0, 0.06, 0, BOWL); add(CYL, toon(0xe5483b), 0, 0.005, 0, BOWL).scale.set(0.17, 0.01, 0.17);
const KIB = []; for (let i = 0; i < 60; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 0.17; const k = add(SPH, toon(rnd() < 0.5 ? 0x9a5a2a : 0xc07a3a), Math.cos(a) * r, 0.03 + (i / 60) * 0.1, Math.sin(a) * r, BOWL); k.scale.setScalar(0.03); KIB.push(k); }
const BAG = grp(scene); box(0.3, 0.45, 0.14, toon(0xf2c230), 0, -0.22, 0, BAG); add(new THREE.PlaneGeometry(0.2, 0.15), toon(0xe5483b), 0, 0.02, 0.071, BAG); BAG.visible = false;
const KFALL = Array.from({ length: 10 }, () => { const k = add(SPH, toon(0x9a5a2a)); k.scale.setScalar(0.03); return k; });
// ---------- the cat ----------
const CAT = (() => { const g = grp(scene); const fur = toon(0x9aa0a8), light = toon(0xeceae6), stripe = toon(0x6a7078), pink = toon(0xf0a0b0), ink = toon(0x141014), wht = basic(0xffffff);
  const root = grp(g); const body = grp(root, 0, 0.3, 0); const torso = add(CAPS, fur, 0, 0, 0, body); torso.scale.set(0.2, 0.18, 0.2); torso.rotation.x = Math.PI / 2;
  const chest = add(SPH, light, 0, -0.02, 0.15, body); chest.scale.set(0.15, 0.15, 0.12); for (let i = 0; i < 3; i++) { const s = add(SPH, stripe, 0, 0.16, -0.12 + i * 0.12, body); s.scale.set(0.16, 0.035, 0.03); }
  const legs = []; for (const [x, z] of [[-0.1, 0.17], [0.1, 0.17], [-0.1, -0.17], [0.1, -0.17]]) { const pv = grp(body, x, -0.08, z); add(CAPS, fur, 0, -0.1, 0, pv).scale.set(0.055, 0.08, 0.055); add(SPH, light, 0, -0.2, 0.02, pv).scale.set(0.06, 0.04, 0.07); legs.push(pv); }
  const tail = grp(body, 0, 0.06, -0.3); for (let i = 0; i < 9; i++) add(SPH, i > 6 ? stripe : fur, 0, i * 0.045, -i * 0.02 - Math.sin(i * 0.3) * 0.03, tail).scale.setScalar(0.042);
  const head = grp(body, 0, 0.2, 0.25); add(SPH, fur, 0, 0, 0, head).scale.set(0.2, 0.18, 0.18); const mz = add(SPH, light, 0, -0.06, 0.13, head); mz.scale.set(0.1, 0.07, 0.07);
  add(SPH, pink, 0, -0.025, 0.19, head).scale.set(0.025, 0.018, 0.015);
  for (const s of [-1, 1]) { const ear = add(CONE, fur, s * 0.12, 0.17, 0, head); ear.scale.set(0.07, 0.12, 0.05); ear.rotation.z = -s * 0.3; const ei = add(CONE, pink, s * 0.12, 0.165, 0.02, head); ei.scale.set(0.04, 0.08, 0.02); ei.rotation.z = -s * 0.3;
    for (let k = 0; k < 2; k++) { const w = add(CYL, wht, s * 0.14, -0.05 - k * 0.025, 0.15, head); w.scale.set(0.004, 0.13, 0.004); w.rotation.z = s * (1.45 + k * 0.15); } }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.03, 0.15); const ball = add(SPH, toon(0xb8e070), 0, 0, 0, e); ball.scale.set(0.045, 0.05, 0.025); const p = add(SPH, ink, 0, 0, 0.018, e); p.scale.set(0.015, 0.04, 0.012); add(SPH, wht, 0.012, 0.018, 0.024, e).scale.setScalar(0.01);
    const xg = grp(e, 0, 0, 0.03); for (const r of [0.8, -0.8]) { const b = add(CYL, ink, 0, 0, 0, xg); b.scale.set(0.008, 0.08, 0.008); b.rotation.z = r; } xg.visible = false; eyes.push({ e, ball, p, xg }); }
  const tongue = add(SPH, pink, 0.02, -0.11, 0.17, head); tongue.scale.set(0.025, 0.04, 0.012); tongue.visible = false;
  const smile = add(new THREE.TorusGeometry(0.03, 0.006, 6, 14, Math.PI), ink, 0, -0.085, 0.19, head); smile.rotation.z = Math.PI;
  return { g, root, body, legs, tail, head, eyes, tongue, smile };
})();
/** cat: { pos, yaw, dead 0..1 (on its back, legs up, X eyes, tongue out), peek (one eye opens), sit, walk, look, happy } */
function poseCat(p, t) { const C = CAT; C.g.visible = true; C.g.position.set(...p.pos); C.g.rotation.y = p.yaw ?? 0; const d = p.dead ?? 0, sit = p.sit ?? 0, w = p.walk;
  C.root.rotation.z = d * Math.PI * 0.95; C.root.position.y = d * 0.62 + (w != null ? Math.abs(Math.sin(w * 9)) * 0.02 : 0); C.body.rotation.x = -0.45 * sit * (1 - d); C.body.position.y = 0.3 - 0.06 * sit;
  C.legs.forEach((l, i) => { l.rotation.x = (w != null ? Math.sin(w * 9 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.6 : 0) + (i >= 2 ? 1.0 : 0.3) * sit * (1 - d) + d * (Math.sin(t * 3 + i) * 0.05); l.rotation.z = d * (i % 2 ? 0.3 : -0.3); });
  C.head.rotation.y = p.look ?? 0; C.head.rotation.x = 0.4 * sit * (1 - d) - 0.2 * (p.lookUp ?? 0); C.head.rotation.z = d * 0.3 + Math.sin(t * 1.5) * 0.04 * (1 - d);
  C.tail.rotation.x = d ? -0.4 : -0.6 + Math.sin(t * 2.5) * 0.25; C.tail.rotation.z = Math.sin(t * 3) * 0.3 * (1 - d);
  C.eyes.forEach((e, i) => { const dead = d > 0.6 && !(p.peek && i === 1); e.ball.visible = e.p.visible = !dead; e.xg.visible = dead; const bl = ((t * 1000) % 3300) < 120 ? 0.1 : 1; e.ball.scale.y = 0.05 * bl * (p.squint ? 0.45 : 1); e.p.scale.y = 0.04 * bl * (p.wide ? 0.7 : 1); e.p.scale.x = p.wide ? 0.03 : 0.015; });
  C.tongue.visible = d > 0.6; C.smile.visible = (p.happy ?? 0) > 0 && d < 0.5; }
// ---------- owner (girl bean) ----------
const OWN = (() => { const g = grp(scene); const top = toon(0x2fb36a), skin = toon(0xe8b48e), hair = toon(0x6a3a1a), ink = toon(0x1a1214);
  const b = add(CAPS, top, 0, 0.75, 0, g); b.scale.set(0.27, 0.42, 0.24); for (const s of [-1, 1]) add(CAPS, toon(0x2a3a6a), s * 0.12, 0.25, 0, g).scale.set(0.09, 0.2, 0.09);
  const head = grp(g, 0, 1.52, 0); add(SPH, skin, 0, 0, 0, head).scale.setScalar(0.26); const hr = add(SPH, hair, 0, 0.06, -0.05, head); hr.scale.set(0.28, 0.27, 0.27); add(SPH, hair, 0, -0.1, -0.16, head).scale.set(0.24, 0.3, 0.14);
  for (const s of [-1, 1]) add(SPH, ink, s * 0.09, 0.0, 0.235, head).scale.set(0.028, 0.04, 0.02); const mouth = add(SPH, toon(0x8a2a2a), 0, -0.1, 0.235, head); mouth.scale.set(0.05, 0.03, 0.02);
  const arms = []; for (const s of [-1, 1]) { const pv = grp(g, s * 0.3, 1.05, 0); add(CAPS, top, 0, -0.18, 0, pv).scale.set(0.07, 0.17, 0.07); add(SPH, skin, 0, -0.38, 0, pv).scale.setScalar(0.07); arms.push(pv); }
  return { g, head, mouth, arms }; })();
function poseOwner(p, t) { OWN.g.visible = true; OWN.g.position.set(...p.pos); OWN.g.rotation.y = p.yaw ?? 0; const run = p.run; OWN.g.position.y = run != null ? Math.abs(Math.sin(run * 9)) * 0.06 : 0;
  OWN.arms.forEach((a, i) => { a.rotation.x = run != null ? Math.sin(run * 9 + i * Math.PI) * 0.8 : -1.3 * (p.pour ?? 0) * (i === 1 ? 1 : 0.3); a.rotation.z = (i ? 1 : -1) * (0.15 + 0.6 * (p.armsOut ?? 0)); });
  OWN.mouth.scale.y = 0.03 + 0.03 * (p.shout ?? 0) * Math.abs(Math.sin(t * 10)); OWN.g.rotation.x = 0.35 * (p.bend ?? 0); }
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(3, 6, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 }); scene.add(sun);
const lampPL = new THREE.PointLight(0xffd8a0, 1.0, 5, 1.5); lampPL.position.set(-2.4, 1.6, -2.3); scene.add(lampPL);
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial") { o.castShadow = true; o.receiveShadow = true; } }); WALL.castShadow = WALL2.castShadow = FLOOR.castShadow = RUG.castShadow = false;
// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.02 }, far: { value: 100 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 4.2 * Math.min(W, H) / 1080 }, vig: { value: 0.3 }, sat: { value: 1 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig, sat; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.02, 0.06, e) * (1.0 - smoothstep(20.0, 60.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 18.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.85, 0.0); }
      c += bl / 12.0; c = mix(c, vec3(0.07, 0.05, 0.05), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb; float l = dot(c, vec3(0.3, 0.59, 0.11)); c = mix(vec3(l), c, sat);
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
// ---------- overlays: REC frame (camera POV), viral phone card ----------
const U = Math.min(W, H) / 1080; const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const popS = (k) => (k <= 0 ? 0 : k < 1 ? 0.4 + 0.6 * k + 0.18 * Math.sin(k * Math.PI) : 1);
function recFrame(g, t) { g.save(); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 8 * U; const m = 60 * U, l = 110 * U;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { g.beginPath(); g.moveTo(x, y + sy * l); g.lineTo(x, y); g.lineTo(x + sx * l, y); g.stroke(); }
  if ((t * 2) % 1 < 0.6) { g.fillStyle = "#ff2a2a"; g.beginPath(); g.arc(m + 50 * U, m + 70 * U, 18 * U, 0, 7); g.fill(); } g.fillStyle = "#fff"; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.textBaseline = "middle"; g.fillText("REC", m + 85 * U, m + 72 * U); g.restore(); }
function viral(g, e, t) { const s = popS(e.k); if (!s) return; g.save(); g.translate(W / 2, H * 0.4); g.scale(s, s); g.rotate(-0.03); const pw = 560 * U, ph = 980 * U;
  g.fillStyle = "rgba(0,0,0,0.4)"; rr(g, -pw / 2 + 14 * U, -ph / 2 + 18 * U, pw, ph, 60 * U); g.fill(); g.fillStyle = "#141418"; rr(g, -pw / 2, -ph / 2, pw, ph, 60 * U); g.fill();
  g.save(); rr(g, -pw / 2 + 24 * U, -ph / 2 + 24 * U, pw - 48 * U, ph - 48 * U, 40 * U); g.clip(); g.drawImage(e.img, -pw / 2 + 24 * U, -ph / 2 + 24 * U, pw - 48 * U, ph - 48 * U); g.restore();
  g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.font = `900 ${44 * U}px "Inter", "DejaVu Sans"`; g.lineWidth = 8 * U; g.strokeStyle = "rgba(0,0,0,0.6)";
  const v = e.views ?? 0, txt = v >= 1e6 ? `${(v / 1e6).toFixed(v < 1e7 ? 1 : 0)} mi` : v >= 1e3 ? `${Math.round(v / 1e3)} mil` : `${Math.round(v)}`;
  g.font = `${56 * U}px "Noto Color Emoji"`; g.fillText("👁️", -pw / 2 + 50 * U, ph / 2 - 90 * U); g.font = `900 ${56 * U}px "Inter", "DejaVu Sans"`; g.strokeText(txt, -pw / 2 + 125 * U, ph / 2 - 88 * U); g.fillText(txt, -pw / 2 + 125 * U, ph / 2 - 88 * U);
  g.font = `${56 * U}px "Noto Color Emoji"`; g.fillText("❤️", pw / 2 - 130 * U, ph / 2 - 300 * U); g.fillText("💬", pw / 2 - 130 * U, ph / 2 - 200 * U); g.restore(); }
// ---------- render ----------
const snap = document.createElement("canvas"); snap.width = Math.round(W / 2); snap.height = Math.round(H / 2); let snapT = -1;
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 45; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.02 * st.shake; camera.position.y += Math.sin(t * 47) * 0.02 * st.shake; } camera.updateProjectionMatrix();
  const fill = st.bowl ?? 0.2; KIB.forEach((k, i) => (k.visible = i / KIB.length < fill)); RECL.visible = (t * 2) % 1 < 0.6 || !st.recBlink;
  BAG.visible = !!st.bag; KFALL.forEach((k) => (k.visible = false));
  if (st.bag) { BAG.position.set(...st.bag.pos); BAG.rotation.z = -(st.bag.tilt ?? 0) * 2.0; if ((st.bag.tilt ?? 0) > 0.6) KFALL.forEach((k, i) => { const ph = (t * 2.5 + i / 10) % 1; k.visible = true; k.position.set(st.bag.pos[0] + 0.12 + Math.sin(i) * 0.02, st.bag.pos[1] - ph * (st.bag.pos[1] - 0.12), st.bag.pos[2] + Math.cos(i) * 0.03); }); }
  if (st.cat) poseCat(st.cat, t); else CAT.g.visible = false; if (st.own) poseOwner(st.own, t); else OWN.g.visible = false;
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.3; post.uniforms.sat.value = st.sat ?? 1; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  if (S.viral) { renderState(S.viral.inner, t); snap.getContext("2d").drawImage(glc, 0, 0, snap.width, snap.height); }
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.b && S.mix > 0) { renderState(S.b, t); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); og.globalAlpha = 1; }
  if (S.a.rec) recFrame(og, t); if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.viral) viral(og, { ...S.viral, img: snap }, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
