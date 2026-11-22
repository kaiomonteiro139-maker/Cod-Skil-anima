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
// ---------- desert ----------
scene.background = new THREE.Color(0xf0d8a0);
const duneTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#f0c878"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 26; i++) { g.strokeStyle = "rgba(200,140,60,0.45)"; g.lineWidth = 4; const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 18, 340, y - 18, 512, y); g.stroke(); } for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "210,150,70" : "255,235,180"},0.5)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); } const t = tex(c); t.repeat.set(12, 12); return t; })();
const DES = add(new THREE.PlaneGeometry(120, 120), toon(0xffffff, duneTex), 0, 0, 0); DES.rotation.x = -Math.PI / 2;
for (const [x, z, sx, sy] of [[-8, -12, 9, 2.4], [6, -16, 11, 3.2], [16, -10, 7, 2.0], [-18, -8, 8, 2.6], [0, -26, 16, 4.5]]) { const d = add(SPH, toon(0xffffff, duneTex), x, -0.2, z); d.scale.set(sx, sy, sx * 0.6); }
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f90d8"); gr.addColorStop(0.45, "#a8d4ee"); gr.addColorStop(0.5, "#fff0c8"); gr.addColorStop(1, "#fff0c8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.28, "rgba(255,230,140,1)"); gr.addColorStop(0.36, "rgba(255,200,90,0.6)"); gr.addColorStop(1, "rgba(255,170,60,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(40); SUNS.position.set(-8, 26, -60); scene.add(SUNS);
function cactus(x, z, s) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); const m = toon(0x4f9a4a); add(CAPS, m, 0, 0.9, 0, g).scale.set(0.22, 0.7, 0.22); for (const sd of [-1, 1]) { const a = grp(g, sd * 0.22, 0.9 + sd * 0.15, 0); add(CAPS, m, sd * 0.18, 0, 0, a).scale.set(0.12, 0.1, 0.12); add(CAPS, m, sd * 0.3, 0.25, 0, a).scale.set(0.12, 0.22, 0.12); } return g; }
cactus(-2.6, -2.2, 1.0); cactus(3.0, -4.0, 1.3); cactus(-5.5, -6, 1.1);
for (let i = 0; i < 8; i++) { const r = add(SPH, toon(0xc8945a), (rnd() - 0.5) * 7, 0.04, (rnd() - 0.4) * 5); const s = 0.08 + rnd() * 0.2; r.scale.set(s * 1.3, s * 0.6, s); }
const SKULL = grp(scene, 1.5, 0, -0.8); add(SPH, toon(0xf4efe6), 0, 0.08, 0, SKULL).scale.set(0.14, 0.1, 0.18);
const TOP = 0;
// ---------- the penguin ----------
const PEN = (() => { const g = grp(scene); const root = grp(g); const blk = toon(0x2a2c38), wht = toon(0xf8f8f8), org = toon(0xf2a030), ink = toon(0x141014), W2 = basic(0xffffff);
  const body = add(SPH, blk, 0, 0.42, 0, root); body.scale.set(0.3, 0.42, 0.27); const bel = add(SPH, wht, 0, 0.38, 0.09, root); bel.scale.set(0.24, 0.34, 0.2);
  const head = grp(root, 0, 0.86, 0.03); add(SPH, blk, 0, 0, 0, head).scale.set(0.24, 0.22, 0.22); const face = add(SPH, wht, 0, -0.03, 0.12, head); face.scale.set(0.18, 0.15, 0.13);
  const beak = add(CONE, org, 0, -0.05, 0.28, head); beak.scale.set(0.06, 0.12, 0.045); beak.rotation.x = Math.PI / 2;
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.03, 0.235); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.034, 0.042, 0.018); add(SPH, W2, 0.011, 0.014, 0.014, e).scale.setScalar(0.011); eyes.push(p);
    for (const k of [0]) { const br = add(CYL, ink, 0, 0.05, 0.005, e); br.scale.set(0.006, 0.05, 0.006); br.rotation.z = Math.PI / 2 - s * 0.45; e.userData.br = br; } }
  for (const s of [-1, 1]) add(SPH, toon(0xf6a0a8), s * 0.12, -0.06, 0.2, head).scale.set(0.035, 0.02, 0.01);
  const fl = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.28, 0.55, 0); const f = add(SPH, blk, s * 0.04, -0.15, 0, pv); f.scale.set(0.05, 0.2, 0.1); fl.push(pv); }
  for (const s of [-1, 1]) { const ft = add(SPH, org, s * 0.1, 0.02, 0.12, root); ft.scale.set(0.08, 0.025, 0.12); }
  return { g, root, head, eyes, fl, body };
})();
/** penguin: { pos, yaw, melt 0..1 (droops), hug (flippers around the ice), jump, happy } */
function posePen(p, t) { const P = PEN; P.g.visible = true; P.g.position.set(...p.pos); P.g.rotation.y = p.yaw ?? 0; const m = p.melt ?? 0;
  const j = p.jump ? Math.abs(Math.sin(t * 8)) * 0.18 : 0; P.root.position.y = j; P.root.scale.set(1 + 0.12 * m, 1 - 0.18 * m + 0.02 * Math.sin(t * 2.5), 1 + 0.08 * m); P.head.rotation.x = 0.25 * m; P.head.rotation.z = Math.sin(t * 1.3) * 0.08 * (1 + m);
  P.fl.forEach((f, i) => { f.rotation.z = (i ? 1 : -1) * (p.hug ? -0.9 : 0.15 + 0.4 * m + (p.jump ? Math.abs(Math.sin(t * 16)) * 1.0 : 0)); f.rotation.x = p.hug ? -0.9 : 0; });
  P.eyes.forEach((e) => { e.scale.y = 0.042 * (((t * 1000) % 3000) < 110 ? 0.1 : 1 - 0.4 * m); e.parent.userData.br.visible = (p.happy ?? 0) <= 0; }); }
const SWEAT = Array.from({ length: 4 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.03, 0.042, 0.03); return d; });
const MELT = add(new THREE.CircleGeometry(1, 32), toon(0x8fd0f0, null, { transparent: true, opacity: 0.85 }), 0, 0.006, 0); MELT.rotation.x = -Math.PI / 2;
const ICE = (() => { const g = grp(scene); const m = new THREE.MeshToonMaterial({ color: 0xc8f0ff, gradientMap: gradMap, transparent: true, opacity: 0.85 }); add(new THREE.BoxGeometry(0.3, 0.3, 0.3), m, 0, 0, 0, g); add(new THREE.BoxGeometry(0.31, 0.06, 0.31), basic(0xffffff), 0, 0.12, 0, g); return g; })();
const SPARK = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); DES.castShadow = false;
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
  SUNS.scale.setScalar(40 + Math.sin(t * 4) * 2);
  if (st.pen) { posePen(st.pen, t); const P0 = st.pen.pos; MELT.position.set(P0[0], 0.006, P0[2] + 0.05); MELT.scale.setScalar(0.35 + 0.15 * (st.pen.melt ?? 0));
    SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 4) % 1; d.visible = !!st.pen.sweat; d.position.set(P0[0] + 0.2 * (i - 1.5), 1.0 - ph * 0.6, P0[2] + 0.22); }); } else PEN.g.visible = false;
  ICE.visible = !!st.ice; SPARK.forEach((s) => (s.visible = false));
  if (st.ice) { const P0 = st.pen.pos, k = st.ice.k; ICE.position.set(P0[0] + 0.02, k < 1 ? 3.0 - 2.68 * k * k : 0.32, P0[2] + 0.36); ICE.rotation.set(k < 1 ? t * 5 : 0.1, k < 1 ? t * 3 : 0.3, 0);
    if (k >= 1) SPARK.forEach((s, i) => { const ph = (t * 1.2 + i / 10) % 1; s.visible = true; s.position.set(ICE.position.x + Math.cos(i * 2.4) * 0.3, ICE.position.y + ph * 0.5, ICE.position.z + Math.sin(i * 2.4) * 0.2); s.scale.setScalar(0.05 * (1 - ph)); }); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
