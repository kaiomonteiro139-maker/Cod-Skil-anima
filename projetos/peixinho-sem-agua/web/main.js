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
// ---------- aquarium ----------
const AW = 1.5, AH = 0.95, AD = 0.75; const AQ = grp(scene, 0, TOP + 0.02, 0);
const frameM = toon(0x2a2c32); for (const [x, z] of [[-AW / 2, -AD / 2], [AW / 2, -AD / 2], [-AW / 2, AD / 2], [AW / 2, AD / 2]]) box(0.04, AH, 0.04, frameM, x, 0, z, AQ);
box(AW + 0.06, 0.06, AD + 0.06, frameM, 0, -0.02, 0, AQ); for (const z of [-AD / 2, AD / 2]) box(AW + 0.04, 0.035, 0.035, frameM, 0, AH - 0.035, z, AQ); for (const x of [-AW / 2, AW / 2]) box(0.035, 0.035, AD + 0.04, frameM, x, AH - 0.035, 0, AQ);
const glassM = new THREE.MeshBasicMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
for (const [w, h, x, y, z, ry] of [[AW, AH, 0, AH / 2, AD / 2, 0], [AW, AH, 0, AH / 2, -AD / 2, 0], [AD, AH, -AW / 2, AH / 2, 0, Math.PI / 2], [AD, AH, AW / 2, AH / 2, 0, Math.PI / 2]]) { const p = add(new THREE.PlaneGeometry(w, h), glassM, x, y, z, AQ); p.rotation.y = ry; p.renderOrder = 5; }
// crack on the front glass (right side)
const crackTex = (() => { const [c, g] = cv(512, 512); g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 6; g.lineCap = "round"; const draw = (x, y, a, l, d) => { if (d > 4) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; g.lineWidth = 7 - d; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); draw(x2, y2, a + 0.5 * (rnd() - 0.3), l * 0.75, d + 1); if (rnd() < 0.7) draw(x2, y2, a - 0.8 + rnd() * 0.4, l * 0.55, d + 1); };
  for (let k = 0; k < 5; k++) draw(256, 300, k * 1.25 + 0.3, 90, 0); g.strokeStyle = "rgba(20,20,30,0.8)"; g.lineWidth = 3; g.beginPath(); g.arc(256, 300, 10, 0, 7); g.stroke(); return tex(c, false); })();
const CRACK = add(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, depthWrite: false }), 0.42, 0.2, AD / 2 + 0.005, AQ); CRACK.renderOrder = 7;
// gravel, plant, castle
for (let i = 0; i < 90; i++) { const s = add(SPH, toon([0xd8c8a8, 0xb89878, 0x9a8a7a, 0xe8d8b8][i % 4]), (rnd() - 0.5) * (AW - 0.12), 0.03, (rnd() - 0.5) * (AD - 0.12), AQ); s.scale.set(0.035, 0.025, 0.035); }
for (let k = 0; k < 5; k++) { const w = add(SPH, toon(0x3fa84a), -0.5 + k * 0.05, 0.18 + k * 0.05, -0.2, AQ); w.scale.set(0.03, 0.18, 0.03); w.rotation.z = (k - 2) * 0.18; }
const CAST = grp(AQ, 0.45, 0.04, -0.2); box(0.22, 0.2, 0.18, toon(0xb8b4c8), 0, 0, 0, CAST); for (const x of [-0.11, 0.11]) { box(0.07, 0.3, 0.07, toon(0xb8b4c8), x, 0, 0, CAST); add(CONE, toon(0xd85a6a), x, 0.36, 0, CAST).scale.set(0.05, 0.1, 0.05); } box(0.06, 0.09, 0.01, toon(0x2a2a40), 0, 0, 0.09, CAST);
// water body (height driven by level 0..1)
const WATER = add(new THREE.BoxGeometry(AW - 0.03, 1, AD - 0.03), new THREE.MeshBasicMaterial({ color: 0x4fb8e8, transparent: true, opacity: 0.42, depthWrite: false }), 0, 0.5, 0, AQ); WATER.renderOrder = 4;
const SURF = add(new THREE.PlaneGeometry(AW - 0.03, AD - 0.03), new THREE.MeshBasicMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.55, depthWrite: false }), 0, 0, 0, AQ); SURF.rotation.x = -Math.PI / 2; SURF.renderOrder = 6;
// drips + puddle
const DROPS = Array.from({ length: 4 }, () => { const d = add(SPH, toon(0x7fd0f5), 0, 0, 0, scene); d.scale.set(0.022, 0.032, 0.022); return d; });
const PUDDLE = add(new THREE.CircleGeometry(1, 32), toon(0x7fc8ea, null, { transparent: true, opacity: 0.75 }), 0.45, TOP + 0.003, AD / 2 + 0.25); PUDDLE.rotation.x = -Math.PI / 2;
// ---------- the fish ----------
const FISH = (() => { const g = grp(scene); const orange = toon(0xff8a2a), belly = toon(0xffe0b0), fin = toon(0xff6a1a, null, { side: THREE.DoubleSide }), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, orange, 0, 0, 0, g); body.scale.set(0.2, 0.15, 0.1); const bel = add(SPH, belly, 0.02, -0.05, 0, g); bel.scale.set(0.15, 0.08, 0.085);
  for (const s of [-1, 1]) { const st = add(SPH, toon(0xffffff), -0.05, 0.02, s * 0.075, g); st.scale.set(0.015, 0.11, 0.03); }
  const tail = grp(g, -0.19, 0, 0); const tf = add(CONE, fin, -0.09, 0, 0, tail); tf.scale.set(0.12, 0.14, 0.02); tf.rotation.z = Math.PI / 2;
  const dors = add(CONE, fin, 0, 0.15, 0, g); dors.scale.set(0.07, 0.09, 0.015); dors.rotation.z = 0.4;
  const sides = []; for (const s of [-1, 1]) { const pv = grp(g, 0.04, -0.04, s * 0.09); const f = add(SPH, fin, -0.03, 0, 0, pv); f.scale.set(0.05, 0.02, 0.03); sides.push(pv); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(g, 0.1, 0.04, s * 0.075); add(SPH, wht, 0, 0, 0, e).scale.set(0.055, 0.06, 0.035); const p = add(SPH, ink, 0.012, -0.005, s * 0.022, e); p.scale.set(0.035, 0.042, 0.02); add(SPH, wht, 0.022, 0.015, s * 0.035, e).scale.setScalar(0.011); add(SPH, wht, 0.005, -0.02, s * 0.036, e).scale.setScalar(0.006); eyes.push({ e, p }); }
  const mouth = add(new THREE.TorusGeometry(0.018, 0.006, 6, 14), ink, 0.195, -0.03, 0, g); mouth.rotation.y = Math.PI / 2;
  const brows = []; for (const s of [-1, 1]) { const b = add(CYL, ink, 0.1, 0.11, s * 0.075, g); b.scale.set(0.006, 0.05, 0.006); b.rotation.x = Math.PI / 2; brows.push(b); }
  return { g, tail, sides, eyes, mouth, brows };
})();
/** fish: { pos (local to aquarium), yaw, flop 0..1, jump 0..1, swim, sad, look (eyes to camera), scale } */
function poseFish(p, t) { const F = FISH; F.g.visible = true; const ap = AQ.position; const fl = p.flop ?? 0;
  const hop = fl * Math.abs(Math.sin(t * 7)) * 0.07 + (p.jump ?? 0) * 0.25;
  F.g.position.set(ap.x + p.pos[0], ap.y + p.pos[1] + hop, ap.z + p.pos[2]); F.g.rotation.set(0, p.yaw ?? 0, fl * (Math.PI / 2 - 0.3) + fl * Math.sin(t * 13) * 0.25 + (p.jump ?? 0) * 0.5 * Math.sin(t * 9));
  F.g.scale.setScalar(p.scale ?? 1); F.tail.rotation.y = Math.sin(t * (fl ? 16 : 7)) * (fl ? 0.7 : 0.35); F.sides.forEach((s, i) => (s.rotation.x = Math.sin(t * 8 + i * 3) * 0.5));
  const sad = p.sad ?? 0; F.brows.forEach((b, i) => { b.rotation.z = (i ? -1 : 1) * 0.5 * sad; b.position.y = 0.11 - 0.01 * sad; }); F.mouth.scale.set(1, 1 + 0.6 * sad + 0.5 * Math.abs(Math.sin(t * 9)) * fl, 1);
  F.eyes.forEach((e) => (e.p.position.z = (e.p.position.z > 0 ? 1 : -1) * (0.022 + 0.01 * (p.look ?? 0)))); }
// ---------- the cup ----------
const CUP = grp(scene); { const cm = new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.35, depthWrite: false }); const c = add(new THREE.CylinderGeometry(0.13, 0.1, 0.32, 24, 1, true), cm, 0, 0, 0, CUP); c.renderOrder = 8;
  add(new THREE.TorusGeometry(0.13, 0.008, 6, 24), toon(0xffffff), 0, 0.16, 0, CUP).rotation.x = Math.PI / 2; }
const CUPW = add(new THREE.CylinderGeometry(0.115, 0.095, 0.22, 24), new THREE.MeshBasicMaterial({ color: 0x4fb8e8, transparent: true, opacity: 0.7 }), 0, -0.04, 0, CUP);
const STREAM = add(new THREE.CylinderGeometry(0.03, 0.04, 1, 12), new THREE.MeshBasicMaterial({ color: 0x6fc8f0, transparent: true, opacity: 0.8 })); STREAM.renderOrder = 9;
const SPLASH = Array.from({ length: 8 }, () => { const s = add(SPH, toon(0xbfeaff), 0, 0, 0); s.scale.setScalar(0.02); return s; });
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-3, 5, 4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);
const aqLight = new THREE.PointLight(0x9fdcff, 1.2, 3, 1.5); aqLight.position.set(0, TOP + 1.1, 0.2); scene.add(aqLight);
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); WALL.castShadow = FLOOR.castShadow = false;
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
  g.textAlign = "left"; g.textBaseline = "middle"; g.font = `${70 * U}px "Noto Color Emoji"`; g.fillText("💧", -bw / 2 + 28 * U, -12 * U);
  g.fillStyle = "#140c10"; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.fillText("ÁGUA:", -bw / 2 + 125 * U, -28 * U); g.fillStyle = low ? "#e5323f" : "#2a9ad8"; g.font = `900 ${60 * U}px "Inter", "DejaVu Sans"`; g.fillText(`${Math.round(e.v * 100)}%`, -bw / 2 + 300 * U, -26 * U);
  const x0 = -bw / 2 + 125 * U, w0 = bw - 160 * U, y0 = 20 * U, h0 = 34 * U; g.fillStyle = "#d8d4cc"; rr(g, x0, y0, w0, h0, h0 / 2); g.fill(); g.fillStyle = low ? "#e5323f" : "#2a9ad8"; rr(g, x0, y0, Math.max(h0, w0 * e.v), h0, h0 / 2); g.fill(); g.lineWidth = 4 * U; g.strokeStyle = "#140c10"; rr(g, x0, y0, w0, h0, h0 / 2); g.stroke(); g.restore(); }
function tagPill(g, e) { const s = popS(e.k); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.22)); g.scale(s, s); g.rotate(-0.03); g.font = `900 ${54 * U}px "Inter", "DejaVu Sans"`; const tw = g.measureText(e.text).width + 70 * U, bh = 100 * U;
  g.fillStyle = e.bg || "#ffd23f"; rr(g, -tw / 2, -bh / 2, tw, bh, 24 * U); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = "#140c10"; g.stroke(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 0, 4 * U); g.restore(); }
function followBtn(g, e, t) { const k = Math.min(1, e.k), tap = e.tap ?? 0, s = popS(k) * (1 + 0.06 * Math.sin(t * 10) * (tap > 0 ? 0 : 1)); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.85)); g.scale(s, s); const done = tap > 0.5, bw = 470 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, bh / 2); g.fill(); g.fillStyle = done ? "#3a3d44" : "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(done ? "✓ Seguindo" : "+ Seguir", 0, 4 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 150 * U + m * 60 * U, 110 * U + m * 60 * U); } g.restore(); }
// ---------- render ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 45; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.015 * st.shake; camera.position.y += Math.sin(t * 47) * 0.015 * st.shake; } camera.updateProjectionMatrix();
  const lv = Math.max(0.02, st.level ?? 0.06) * (AH - 0.08); WATER.scale.y = lv; WATER.position.y = lv / 2 + 0.01; SURF.position.y = lv + 0.012; SURF.position.x = Math.sin(t * 3) * 0.003;
  DROPS.forEach((d, i) => { const ph = (t * 1.1 + i / DROPS.length) % 1; d.visible = st.leak !== false; d.position.set(AQ.position.x + 0.42 + (i % 2) * 0.03, AQ.position.y + 0.2 - ph * 0.22 - ph * ph * 0.1, AQ.position.z + AD / 2 + 0.03 + ph * 0.18); });
  PUDDLE.scale.set(0.12 + 0.1 * (st.puddle ?? 0.5), 0.08 + 0.06 * (st.puddle ?? 0.5), 1);
  if (st.fish) poseFish(st.fish, t); else FISH.g.visible = false;
  const cp = st.cup; CUP.visible = !!cp; STREAM.visible = !!(cp && cp.pour > 0.3); SPLASH.forEach((s) => (s.visible = false));
  if (cp) { const ap = AQ.position; CUP.position.set(ap.x + cp.pos[0], ap.y + cp.pos[1], ap.z + cp.pos[2]); CUP.rotation.set(0, 0, -(cp.pour ?? 0) * 1.9); CUPW.scale.y = Math.max(0.05, 1 - 0.8 * (cp.drain ?? 0)); CUP.scale.setScalar(popS(cp.k ?? 1) || 0.001);
    if (cp.pour > 0.3) { const sx = CUP.position.x + 0.15, sy = CUP.position.y + 0.02, ey = ap.y + lv; STREAM.position.set(sx, (sy + ey) / 2, CUP.position.z); STREAM.scale.set(1, sy - ey, 1);
      SPLASH.forEach((s, i) => { const ph = (t * 3 + i / 8) % 1; s.visible = true; s.position.set(sx + Math.cos(i * 2.4) * ph * 0.15, ey + Math.sin(ph * Math.PI) * 0.12, CUP.position.z + Math.sin(i * 2.4) * ph * 0.12); }); } }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
