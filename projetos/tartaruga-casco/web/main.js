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
// ---------- beach ----------
scene.background = new THREE.Color(0x8fd0f0);
const sandTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#f2d494"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "200,160,90" : "255,240,200"},0.5)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); } for (let i = 0; i < 20; i++) { g.strokeStyle = "rgba(200,160,90,0.4)"; g.lineWidth = 3; const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(170, y + 14, 340, y - 14, 512, y); g.stroke(); } const t = tex(c); t.repeat.set(12, 12); return t; })();
const SAND = add(new THREE.PlaneGeometry(80, 80), toon(0xffffff, sandTex), 0, 0, 0); SAND.rotation.x = -Math.PI / 2;
const SEA = add(new THREE.PlaneGeometry(200, 120), toon(0x2fa8c8), 0, 0.01, -66); SEA.rotation.x = -Math.PI / 2;
const FOAM = add(new THREE.PlaneGeometry(200, 0.8), basic(0xffffff), 0, 0.02, -6.2); FOAM.rotation.x = -Math.PI / 2;
const WET = add(new THREE.PlaneGeometry(200, 2.5), toon(0xd8b878), 0, 0.005, -4.8); WET.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#2f8fe0"); gr.addColorStop(0.45, "#8fd0f0"); gr.addColorStop(0.5, "#e8f6ff"); gr.addColorStop(1, "#e8f6ff"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.25, "rgba(255,240,170,1)"); gr.addColorStop(0.32, "rgba(255,220,120,0.6)"); gr.addColorStop(1, "rgba(255,200,100,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(26); SUNS.position.set(-12, 30, -60); scene.add(SUNS);
function palm(x, z, s, lean) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); let px = 0, py = 0; for (let i = 0; i < 7; i++) { const sg = add(CYL, toon(0x9a6a3a), px, py + 0.35, 0, g); sg.scale.set(0.16 - i * 0.01, 0.7, 0.16 - i * 0.01); sg.rotation.z = -lean * i / 7; px += Math.sin(lean * i / 7) * 0.7; py += 0.68; }
  const top = grp(g, px, py + 0.1, 0); for (let k = 0; k < 7; k++) { const l = add(SPH, toon(0x3f9a3a), Math.cos(k * 0.9) * 0.7, -0.15, Math.sin(k * 0.9) * 0.7, top); l.scale.set(1.0, 0.07, 0.3); l.rotation.y = -k * 0.9; l.rotation.z = -0.35; } return g; }
palm(-3.2, -2.5, 1.2, 0.35); palm(3.8, -3.5, 1.0, -0.3); palm(-6, -4, 1.1, 0.2);
for (let i = 0; i < 12; i++) { const sh = add(SPH, toon([0xf6c0c8, 0xffffff, 0xf2d0a0][i % 3]), (rnd() - 0.5) * 8, 0.02, (rnd() - 0.3) * 5); sh.scale.set(0.07, 0.03, 0.05); }
const UMB = grp(scene, 2.4, 0, -1.6); add(CYL, toon(0xffffff), 0, 1.2, 0, UMB).scale.set(0.03, 2.4, 0.03); add(new THREE.ConeGeometry(1.2, 0.5, 8, 1, true), toon(0xe5483b, null, { side: THREE.DoubleSide }), 0, 2.35, 0, UMB);
const TOP = 0;
// ---------- the turtle ----------
const shellTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#3f8a3a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#24502a"; g.lineWidth = 10; g.fillStyle = "#58a84a";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 7; x++) { const cx = x * 90 + (y % 2) * 45, cy = y * 75; g.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.lineTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); } g.closePath(); g.fill(); g.stroke(); } return tex(c); })();
const TUR = (() => { const g = grp(scene); const root = grp(g); const skin = toon(0x9ad06a), ink = toon(0x141014), wht = basic(0xffffff), belly = toon(0xf2e0a0);
  const shell = add(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xffffff, shellTex), 0, 0.08, 0, root); shell.scale.set(0.42, 0.28, 0.5);
  const rim = add(new THREE.TorusGeometry(1, 0.06, 8, 40), toon(0x2f6a2a), 0, 0.08, 0, root); rim.scale.set(0.42, 0.5, 0.42); rim.rotation.x = Math.PI / 2;
  const plast = add(new THREE.CircleGeometry(1, 32), belly, 0, 0.075, 0, root); plast.scale.set(0.4, 0.48, 1); plast.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) { const l = add(new THREE.PlaneGeometry(0.5, 0.012), toon(0xc8b070), 0, 0.072, -0.2 + i * 0.18, root); l.rotation.x = Math.PI / 2; }
  const head = grp(root, 0, 0.07, 0.52); add(SPH, skin, 0, 0, 0.06, head).scale.set(0.13, 0.11, 0.14); add(CAPS, skin, 0, 0, -0.04, head).scale.set(0.07, 0.06, 0.07);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.07, 0.04, 0.14); add(SPH, wht, 0, 0, 0, e).scale.set(0.035, 0.04, 0.025); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.026, 0.015); add(SPH, wht, 0.008, 0.01, 0.025, e).scale.setScalar(0.007); eyes.push(p); }
  const brows = []; for (const s of [-1, 1]) { const br = add(CYL, ink, s * 0.07, 0.09, 0.14, head); br.scale.set(0.006, 0.05, 0.006); br.rotation.z = Math.PI / 2 - s * 0.4; brows.push(br); }
  const mouth = add(new THREE.TorusGeometry(0.03, 0.007, 6, 14, Math.PI), ink, 0, -0.04, 0.19, head);
  const legs = []; for (const [x, z, s] of [[-0.36, 0.28, -1], [0.36, 0.28, 1], [-0.32, -0.3, -1], [0.32, -0.3, 1]]) { const pv = grp(root, x, 0.06, z); const f = add(SPH, skin, s * 0.1, 0, 0, pv); f.scale.set(0.14, 0.04, 0.07); legs.push(pv); }
  const tail = add(CONE, skin, 0, 0.06, -0.55, root); tail.scale.set(0.04, 0.1, 0.04); tail.rotation.x = -Math.PI / 2;
  return { g, root, head, eyes, brows, mouth, legs };
})();
/** turtle: { pos, yaw, flip 0..1 (1 = on its back), rock (extra tilt), flail, sad, happy } */
function poseTur(p, t) { const T = TUR; T.g.visible = true; T.g.position.set(...p.pos); T.g.rotation.y = p.yaw ?? 0; const f = p.flip ?? 1;
  T.root.rotation.z = f * Math.PI + (p.rock ?? 0) + (p.flail ? Math.sin(t * 9) * 0.04 : 0); T.root.position.y = f * 0.3 + Math.abs(Math.sin(T.root.rotation.z)) * 0.18;
  T.legs.forEach((l, i) => { l.rotation.z = (p.flail ? Math.sin(t * 14 + i * 1.7) * 0.6 : 0); l.rotation.y = (p.flail ? Math.cos(t * 11 + i) * 0.4 : 0); });
  T.head.rotation.set((p.flail ? Math.sin(t * 6) * 0.15 : 0) - 0.15, Math.sin(t * 3) * 0.2 * (p.flail ? 1 : 0.3), -T.root.rotation.z); T.head.position.y = 0.07 - 0.16 * f;
  const hap = (p.happy ?? 0) > 0; T.mouth.rotation.z = hap ? Math.PI : 0; T.mouth.position.y = hap ? -0.04 : -0.06; T.brows.forEach((b) => (b.visible = (p.sad ?? 1) > 0.2));
  T.eyes.forEach((e) => (e.scale.y = ((t * 1000) % 2800) < 110 ? 0.003 : 0.026)); }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.025, 0.035, 0.025); return d; });
const HAND = (() => { const g = grp(scene); const m = new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.85 }); const palmM = add(SPH, m, 0, 0, 0, g); palmM.scale.set(0.18, 0.22, 0.08); for (let k = 0; k < 4; k++) add(CAPS, m, -0.12 + k * 0.08, 0.26, 0, g).scale.set(0.035, 0.08, 0.035); const th = add(CAPS, m, 0.2, 0.05, 0, g); th.scale.set(0.035, 0.07, 0.035); th.rotation.z = -0.8; return g; })();
const GLOWS = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.9, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); SAND.castShadow = SEA.castShadow = false;
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
  FOAM.position.z = -6.2 + Math.sin(t * 1.2) * 0.25; SUNS.scale.setScalar(26 + Math.sin(t * 4) * 1.5);
  if (st.tur) { poseTur(st.tur, t); SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 3) % 1; d.visible = !!st.tur.sweat; d.position.set(st.tur.pos[0] + 0.12 * (i - 1), 0.55 - ph * 0.4, st.tur.pos[2] + 0.55); }); } else TUR.g.visible = false;
  HAND.visible = !!st.hand; GLOWS.forEach((g2) => (g2.visible = false));
  if (st.hand && st.tur) { const h = st.hand; HAND.position.set(st.tur.pos[0] + 0.8 - 0.35 * h.k, 0.35, st.tur.pos[2] + 0.1); HAND.rotation.set(0, -Math.PI / 2, 0.2); HAND.scale.setScalar(Math.max(0.01, Math.min(1, h.k * 3)));
    GLOWS.forEach((g2, i) => { const ph = (t * 1.5 + i / 10) % 1; g2.visible = true; g2.position.set(HAND.position.x + Math.cos(i * 2.4) * 0.3 * ph, 0.3 + ph * 0.6, HAND.position.z + Math.sin(i * 2.4) * 0.3 * ph); g2.scale.setScalar(0.06 * (1 - ph)); }); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
