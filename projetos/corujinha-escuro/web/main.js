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
// ---------- night forest ----------
scene.background = new THREE.Color(0x0c1430);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#060a1c"); gr.addColorStop(0.45, "#16224a"); gr.addColorStop(0.5, "#1c2a50"); gr.addColorStop(1, "#1c2a50"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const MOON = add(new THREE.CircleGeometry(4, 32), new THREE.MeshBasicMaterial({ color: 0xe8e2c0, transparent: true, opacity: 0.6 }), 18, 30, -80);
const STARS = (() => { const n = 400, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = rnd() * 6.28, e = 0.2 + rnd() * 1.2; pos.set([Math.cos(a) * 120 * Math.cos(e), 120 * Math.sin(e), Math.sin(a) * 120 * Math.cos(e)], i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4 })); scene.add(m); return m; })();
const GROUND = add(new THREE.PlaneGeometry(120, 120), toon(0x1e3a2a), 0, 0, 0); GROUND.rotation.x = -Math.PI / 2;
function ptree(x, z, s, col = 0x1a3a2a) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); add(CYL, toon(0x3a2a20), 0, 1.0, 0, g).scale.set(0.18, 2.0, 0.18); for (let k = 0; k < 3; k++) add(CONE, toon(col), 0, 1.6 + k * 0.7, 0, g).scale.set(1.2 - k * 0.3, 1.3, 1.2 - k * 0.3); return g; }
for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI - Math.PI, r = 5 + rnd() * 14; ptree(Math.cos(a) * r * 1.4, -3 - rnd() * 16, 1.2 + rnd() * 1.4, [0x163024, 0x1a3a2a, 0x12281e][i % 3]); }
for (let i = 0; i < 30; i++) { const b = add(SPH, toon(0x22462e), (rnd() - 0.5) * 12, 0.1, -1 - rnd() * 4); b.scale.set(0.4 + rnd() * 0.4, 0.3 + rnd() * 0.2, 0.4); }
const TRUNK = add(CYL, toon(0x4a3426), -1.3, 1.5, -0.3); TRUNK.scale.set(0.35, 3.0, 0.35);
const BRANCH = add(CYL, toon(0x5a3e2c), -0.4, 1.2, 0.05); BRANCH.scale.set(0.08, 1.9, 0.08); BRANCH.rotation.z = Math.PI / 2 + 0.05;
for (const [x, y] of [[0.3, 1.32], [-0.1, 1.28], [0.45, 1.25]]) { const l = add(SPH, toon(0x2a5a34), x, y, 0.05); l.scale.set(0.09, 0.03, 0.06); l.rotation.z = 0.5; }
const HIDE = add(SPH, toon(0x1e3a26), -1.5, 3.4, -0.4); HIDE.scale.set(1.6, 1.0, 1.4);
const TOP = 0;
// ---------- the owlet ----------
const OWL = (() => { const g = grp(scene); const root = grp(g); const fl = toon(0x9a8a7a), lt = toon(0xe8dcc8), dk = toon(0x6a5a4c), ink = toon(0x141014), org = toon(0xf2a030), wht = basic(0xffffff);
  const body = add(SPH, fl, 0, 0.22, 0, root); body.scale.set(0.2, 0.22, 0.18); const bel = add(SPH, lt, 0, 0.2, 0.08, root); bel.scale.set(0.14, 0.16, 0.12);
  for (let k = 0; k < 6; k++) { const s = add(SPH, dk, (k % 3 - 1) * 0.05, 0.14 + Math.floor(k / 3) * 0.07, 0.19, root); s.scale.set(0.015, 0.008, 0.005); }
  const head = grp(root, 0, 0.47, 0.02); add(SPH, fl, 0, 0, 0, head).scale.set(0.2, 0.17, 0.17); const disc = add(SPH, lt, 0, -0.01, 0.1, head); disc.scale.set(0.16, 0.12, 0.08);
  for (const s of [-1, 1]) { const tuft = add(CONE, dk, s * 0.13, 0.15, 0, head); tuft.scale.set(0.04, 0.1, 0.03); tuft.rotation.z = -s * 0.4; }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.01, 0.16); const ir = add(SPH, new THREE.MeshBasicMaterial({ color: 0xffc830 }), 0, 0, 0, e); ir.scale.set(0.06, 0.06, 0.025); const pu = add(SPH, basic(0x140c10), 0, 0, 0.018, e); pu.scale.set(0.035, 0.035, 0.012); add(SPH, wht, 0.015, 0.018, 0.028, e).scale.setScalar(0.012);
    const lid = add(SPH, fl, 0, 0.03, 0.006, e); lid.scale.set(0.064, 0.03, 0.03); const br = add(CYL, dk, 0, 0.075, 0.01, e); br.scale.set(0.009, 0.06, 0.009); br.rotation.z = Math.PI / 2; eyes.push({ ir, pu, lid, br, s }); }
  const beak = add(CONE, org, 0, -0.04, 0.2, head); beak.scale.set(0.025, 0.05, 0.02); beak.rotation.x = Math.PI;
  const wings = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.18, 0.3, 0); const w = add(SPH, dk, s * 0.02, -0.09, 0, pv); w.scale.set(0.05, 0.13, 0.11); wings.push(pv); }
  for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) add(SPH, org, s * 0.07 + k * 0.018, 0.01, 0.1, root).scale.set(0.012, 0.012, 0.03);
  return { g, root, head, eyes, wings }; })();
/** owl: { pos, yaw, scared 0..1, shiver, happy, flap, look } */
function poseOwl(p, t) { const O = OWL; O.g.visible = true; O.g.position.set(p.pos[0] + (p.shiver ? Math.sin(t * 60) * 0.005 : 0), p.pos[1], p.pos[2]); O.g.rotation.y = p.yaw ?? 0; const sc = p.scared ?? 0;
  O.head.rotation.y = (p.look ?? 0) + (sc > 0.5 ? Math.sin(t * 2.2) * 0.5 : 0); O.head.rotation.z = Math.sin(t * 1.3) * 0.08; O.root.scale.set(1 - 0.06 * sc, 1 - 0.06 * sc, 1);
  O.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.flap ? 0.5 + Math.sin(t * 22) * 0.5 : sc > 0.5 ? -0.15 : 0.05)));
  O.root.position.y = p.flap ? Math.abs(Math.sin(t * 9)) * 0.06 : 0;
  O.eyes.forEach((e) => { const bl = ((t * 1000) % 2700) < 110 ? 1 : 0; const hap = p.happy ? 1 : 0; e.lid.position.y = hap ? 0.035 : 0.06 - 0.05 * bl; e.lid.scale.y = hap ? 0.04 : 0.03 + 0.04 * bl; e.lid.visible = hap || bl; e.pu.scale.setScalar(sc > 0.5 ? 0.022 : 0.035); e.pu.scale.z = 0.012; e.br.rotation.z = Math.PI / 2 - e.s * (sc > 0.5 ? 0.45 : hap ? -0.15 : 0.1); }); }
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const FLY = (() => { const g = grp(scene); const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(0.35); g.add(glow); const core = add(SPH, basic(0xfffbd0), 0, 0, 0, g); core.scale.setScalar(0.025); const L0 = new THREE.PointLight(0xfff0a0, 0, 4, 1.6); g.add(L0); g.visible = false; return { g, glow, L0 }; })();
const FAR = Array.from({ length: 14 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xfff27a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(0.12); scene.add(s); s.visible = false; return s; });
const TEARS = Array.from({ length: 2 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.014, 0.02, 0.014); return d; });
function lerp0(a, b, k) { return a + (b - a) * k; }
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); GROUND.castShadow = false;
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
function likeBtn(g, e, t) { const s = popS(Math.min(1, e.k)); if (!s) return; const tap = e.tap ?? 0, on = tap > 0.5; g.save(); g.translate(W * 0.83, H * (e.y ?? 0.6)); g.scale(s * (on ? 1 + 0.25 * Math.max(0, 1 - (tap - 0.5) * 4) : 1 + 0.05 * Math.sin(t * 9)), s * (on ? 1 + 0.25 * Math.max(0, 1 - (tap - 0.5) * 4) : 1 + 0.05 * Math.sin(t * 9)));
  const r = 95 * U; g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.arc(6 * U, 10 * U, r, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = on ? "#e5323f" : "#140c10"; g.stroke();
  g.save(); g.scale(r / 80, r / 80); g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -40, -55, 0, -28); g.bezierCurveTo(40, -55, 60, -10, 0, 30); g.restore(); g.fillStyle = on ? "#e5323f" : "#ffffff"; g.fill(); g.lineWidth = 8 * U; g.strokeStyle = on ? "#b0202a" : "#140c10"; g.stroke();
  g.fillStyle = "#fff"; g.strokeStyle = "#140c10"; g.lineWidth = 9 * U; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; const lbl = on ? (e.count || "+1") : "Curtir"; g.strokeText(lbl, 0, r + 45 * U); g.fillText(lbl, 0, r + 45 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 40 * U + m * 70 * U, 120 * U + m * 70 * U); } g.restore(); }
// ---------- render ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 45; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.015 * st.shake; camera.position.y += Math.sin(t * 47) * 0.015 * st.shake; } camera.updateProjectionMatrix();
  const lit = st.lit ?? 0; const HEMI = scene.children.find((o) => o.isHemisphereLight); if (HEMI) HEMI.intensity = 0.45 + 0.35 * lit; sun.intensity = 0.35 + 0.6 * lit; sun.color.setHex(0x9ab0ff);
  if (st.owl) { poseOwl(st.owl, t); const H0 = OWL.head.getWorldPosition(new THREE.Vector3()); TEARS.forEach((d, i) => { const ph = (t * 0.8 + i / 2) % 1; d.visible = (st.owl.scared ?? 0) > 0.5; d.position.set(H0.x + (i ? 0.09 : -0.09), H0.y - 0.04 - ph * 0.15, H0.z + 0.17); }); } else OWL.g.visible = false;
  const fk = st.fly ?? 0; FLY.g.visible = fk > 0; if (fk > 0) { const P = st.owl.pos, a = t * 1.3; const k = Math.min(1, fk); FLY.g.position.set(lerp0(P[0] + 1.6, P[0] + Math.cos(a) * 0.45, k), lerp0(P[1] + 1.2, P[1] + 0.55 + Math.sin(t * 2.3) * 0.12, k), lerp0(P[2] + 0.6, P[2] + 0.15 + Math.sin(a) * 0.35, k)); FLY.L0.intensity = 1.0 * k * (0.85 + 0.15 * Math.sin(t * 9)); FLY.glow.scale.setScalar(0.22 + 0.05 * Math.sin(t * 9)); }
  FAR.forEach((s, i) => { s.visible = (st.far ?? 0) > i / FAR.length; s.position.set(-3 + (i % 7) * 1.1 + Math.sin(t + i) * 0.2, 0.6 + Math.floor(i / 7) * 1.2 + Math.sin(t * 1.7 + i) * 0.2, -2.5 - (i % 3)); });
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t); if (S.like) likeBtn(og, S.like, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
