// "O peixinho com 1 gota d'água" — cracked aquarium on a table, cute 3D fish, leaking drips, pouring cup, water bar + follow overlays.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const { stateAt, FPS, TOTAL } = await import("./" + (q.get("story") || "story") + ".js");
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xf2d9b8); const camera = new THREE.PerspectiveCamera(45, W / H, 0.02, 400); scene.add(camera);
let SEED = 4; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([120, 120, 120, 255, 195, 195, 195, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent);
const SPH = new THREE.SphereGeometry(1, 24, 16), CYL = new THREE.CylinderGeometry(1, 1, 1, 24), CONE = new THREE.ConeGeometry(1, 1, 16), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);
// ---------- snowy field ----------
scene.background = new THREE.Color(0xc8d8e8);
const SNOW = add(new THREE.PlaneGeometry(120, 120), toon(0xf4f8ff), 0, 0, 0); SNOW.rotation.x = -Math.PI / 2;
for (let i = 0; i < 30; i++) { const m = add(SPH, toon(0xffffff), (rnd() - 0.5) * 30, -0.3, -4 - rnd() * 25); const s = 1 + rnd() * 3; m.scale.set(s * 1.5, s * 0.5, s); }
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#7a90b0"); gr.addColorStop(0.45, "#b8c8dc"); gr.addColorStop(0.5, "#e8eef6"); gr.addColorStop(1, "#e8eef6"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
function pine(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x5a3a22), 0, 0.4, 0, g).scale.set(0.12, 0.8, 0.12); for (let k = 0; k < 3; k++) { add(CONE, toon(0x2f6a4a), 0, 1.0 + k * 0.6, 0, g).scale.set(1.0 - k * 0.25, 1.0, 1.0 - k * 0.25); add(CONE, toon(0xffffff), 0, 1.15 + k * 0.6, 0, g).scale.set(0.75 - k * 0.2, 0.55, 0.75 - k * 0.2); } return g; }
for (const [x, z, s] of [[-2.6, -2.5, 1.2], [2.8, -3.6, 1.4], [-5, -6, 1.6], [5.5, -7, 1.5], [0.5, -9, 1.8], [-8, -10, 2]]) pine(x, z, s);
const FENCE = grp(scene, 0.4, 0, -1.6); for (const x of [-1.6, -0.8, 0, 0.8, 1.6]) { box(0.12, x === 0 ? 0.9 : 0.8, 0.12, toon(0x8a5a32), x, 0, 0, FENCE); add(CYL, toon(0xffffff), x, x === 0 ? 0.92 : 0.82, 0, FENCE).scale.set(0.085, 0.05, 0.085); } box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.55, 0.07, FENCE); box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.25, 0.07, FENCE);
const TOP = 0;
// ---------- the puppy ----------
const PUP = (() => { const g = grp(scene); const fur = toon(0xd99a55), cream = toon(0xf6e2c0), darkF = toon(0x8a5530), ink = toon(0x1a1214), wht = basic(0xffffff), tongueM = toon(0xe0707a);
  const body = grp(g); const torso = add(CAPS, fur, 0, 0.42, 0, body); torso.scale.set(0.24, 0.24, 0.24); torso.rotation.x = Math.PI / 2; const chest = add(SPH, cream, 0, 0.4, 0.28, body); chest.scale.set(0.19, 0.2, 0.12);
  const legs = []; for (const [x, z] of [[-0.13, 0.22], [0.13, 0.22], [-0.13, -0.22], [0.13, -0.22]]) { const pv = grp(body, x, 0.36, z); add(CYL, fur, 0, -0.17, 0, pv).scale.set(0.065, 0.34, 0.065); add(SPH, cream, 0, -0.35, 0.03, pv).scale.set(0.075, 0.05, 0.09); legs.push(pv); }
  const tail = grp(body, 0, 0.5, -0.32); const tl = add(CAPS, fur, 0, 0.12, -0.04, tail); tl.scale.set(0.04, 0.12, 0.04); tl.rotation.x = -0.6;
  const neck = grp(body, 0, 0.58, 0.24); const head = grp(neck, 0, 0.2, 0.06);
  const skull = add(SPH, fur, 0, 0, 0, head); skull.scale.set(0.27, 0.25, 0.25); const muzz = add(SPH, cream, 0, -0.07, 0.19, head); muzz.scale.set(0.15, 0.11, 0.12);
  const nose = add(SPH, ink, 0, -0.02, 0.31, head); nose.scale.set(0.05, 0.035, 0.035);
  const jaw = grp(head, 0, -0.13, 0.12); add(SPH, cream, 0, -0.01, 0.07, jaw).scale.set(0.1, 0.04, 0.08); const tongue = add(SPH, tongueM, 0, -0.03, 0.12, jaw); tongue.scale.set(0.05, 0.02, 0.06);
  const mouthIn = add(SPH, basic(0x3a1418), 0, -0.13, 0.26, head); mouthIn.scale.set(0.07, 0.01, 0.03);
  const ears = []; for (const s of [-1, 1]) { const pv = grp(head, s * 0.2, 0.13, -0.02); const e = add(SPH, darkF, s * 0.05, -0.12, 0, pv); e.scale.set(0.07, 0.16, 0.11); e.rotation.z = s * 0.25; ears.push(pv); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.1, 0.03, 0.2); const ball = add(SPH, ink, 0, 0, 0, e); ball.scale.set(0.055, 0.065, 0.04); const hl = add(SPH, wht, 0.018, 0.022, 0.03, e); hl.scale.setScalar(0.017); const hl2 = add(SPH, wht, -0.015, -0.02, 0.032, e); hl2.scale.setScalar(0.008);
    const brow = add(CAPS, darkF, 0, 0.085, 0.02, e); brow.scale.set(0.012, 0.03, 0.012); brow.rotation.z = Math.PI / 2; eyes.push({ e, brow, s, ball }); }
  const spot = add(SPH, darkF, 0.08, 0.13, 0.12, head); spot.scale.set(0.09, 0.06, 0.06);
  const snowcap = add(SPH, toon(0xffffff), 0, 0.2, -0.02, head); snowcap.scale.set(0.16, 0.06, 0.14); const back = add(SPH, toon(0xffffff), 0, 0.64, -0.05, body); back.scale.set(0.16, 0.04, 0.2); back.visible = false;
  return { g, snowcap, body, torso, legs, tail, neck, head, jaw, tongue, mouthIn, ears, eyes };
})();
const blinkAt = (t, s) => ((t * 1000 + s * 997) % 3300) < 120;
/** pup: { pos, yaw, sit 0..1, run phase|null, wag 0..1, ears (-1 droop .. 1 perk), tilt, headYaw, headPitch, bark 0..1, sad 0..1, wet } */
function posePup(p, t) { const P = PUP; P.g.visible = true; P.g.position.set(p.pos[0] + (p.shiver ?? 0) * Math.sin(t * 70) * 0.008, p.pos[1], p.pos[2]); P.g.rotation.y = p.yaw ?? 0; P.g.scale.setScalar(p.scale ?? 1);
  const sit = p.sit ?? 0, r = p.run; P.body.rotation.x = -0.55 * sit; P.body.position.y = -0.04 * sit + (r != null ? Math.abs(Math.sin(r * 9)) * 0.07 : 0); P.body.position.z = -0.1 * sit;
  P.legs.forEach((lg, i) => { let a = r == null ? 0 : Math.sin(r * 9 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.8; if (i >= 2) a += 1.25 * sit; else a += 0.45 * sit; lg.rotation.x = a; });
  P.neck.rotation.x = 0.5 * sit + (p.headPitch ?? 0) + 0.25 * (p.sad ?? 0); P.neck.rotation.y = p.headYaw ?? 0; P.head.rotation.z = (p.tilt ?? 0) + Math.sin(t * 1.3) * 0.04;
  const w = p.wag ?? 0; P.tail.rotation.z = Math.sin(t * 22) * 0.7 * w; P.tail.rotation.x = -0.4 * (1 - w) * (p.sad ?? 0) + 0.3 * w;
  const ear = p.ears ?? 0; P.ears.forEach((e, i) => { e.rotation.z = (i ? 1 : -1) * (0.25 - 0.35 * ear) + Math.sin(t * 3 + i) * 0.04; e.rotation.x = -0.2 * ear; });
  const b = p.bark ?? 0; P.jaw.rotation.x = 0.55 * b; P.mouthIn.scale.y = 0.01 + 0.05 * b; P.tongue.visible = (p.tongue ?? 0) > 0.5 || b > 0.3;
  P.eyes.forEach((e) => { const bl = blinkAt(t, 2) ? 0.15 : 1; e.ball.scale.y = 0.065 * bl; e.brow.position.y = 0.085 - 0.012 * (p.sad ?? 0); e.brow.rotation.z = Math.PI / 2 - e.s * 0.45 * (p.sad ?? 0); });
  P.torso.material.color.setHex(p.wet ? 0xb8834a : 0xd99a55); P.snowcap.visible = (p.shiver ?? 0) > 0.3; }

const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
// ---------- the doghouse wall (pops in on follow) ----------
const HOUSE = (() => { const g = grp(scene, 0, 0, 0.05); const wood = toon(0xb8743a), dk = toon(0x7a4a24);
  for (let k = 0; k < 5; k++) box(0.24, 1.0, 0.08, k % 2 ? wood : toon(0xc8844a), -0.48 + k * 0.24, 0, 0, g);
  box(1.3, 0.08, 0.1, dk, 0, 0.98, 0.02, g); box(1.3, 0.08, 0.1, dk, 0, 0.1, 0.02, g); add(SPH, toon(0xffffff), 0, 1.05, 0, g).scale.set(0.7, 0.06, 0.1);
  return g; })();
const SPARK = Array.from({ length: 12 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff0a0, transparent: true, depthWrite: false })); s.scale.setScalar(0.05); scene.add(s); return s; });
const BREATH = Array.from({ length: 3 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })); scene.add(s); return s; });
const FLAKES = (() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOT, color: 0xffffff, size: 0.045, transparent: true, depthWrite: false })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); SNOW.castShadow = false;
// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.02 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 4.2 * Math.min(W, H) / 1080 }, vig: { value: 0.35 }, red: { value: 0 } },
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
  { const a = FLAKES.geometry.attributes.position.array, b = FLAKES.userData.base; for (let i = 0; i < a.length / 3; i++) { a[i * 3] = b[i * 3] + camera.position.x + Math.sin(t + i) * 0.1; a[i * 3 + 1] = ((b[i * 3 + 1] - t * 0.6) % 5 + 5) % 5 - 1; a[i * 3 + 2] = b[i * 3 + 2] + camera.position.z - 2; } FLAKES.geometry.attributes.position.needsUpdate = true; }
  if (st.pup) posePup(st.pup, t); else PUP.g.visible = false;
  const hw = st.wall ?? 0; HOUSE.visible = hw > 0; HOUSE.scale.set(1, Math.max(0.01, Math.min(1, hw * 1.3)), 1);
  SPARK.forEach((s) => (s.visible = false)); if (hw > 0 && hw < 1.8) SPARK.forEach((s, i) => { const ph = (t * 1.3 + i / 12) % 1; s.visible = true; s.position.set(-0.6 + (i / 11) * 1.2, 0.1 + ph * 1.1, 0.15); s.scale.setScalar(0.06 * (1 - ph)); });
  BREATH.forEach((s) => (s.visible = false)); if (st.pup && (st.pup.shiver ?? 0) > 0.3) { const P0 = st.pup.pos; BREATH.forEach((s, i) => { const ph = (t * 0.8 + i / 3) % 1; s.visible = true; s.position.set(P0[0] + 0.03, P0[1] + 0.6 + ph * 0.1, P0[2] + 0.62 + ph * 0.25); s.scale.setScalar(0.04 + 0.12 * ph); s.material.opacity = 0.35 * (1 - ph); }); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
