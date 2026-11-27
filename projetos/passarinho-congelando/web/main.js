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
const FENCE = grp(scene, 0, 0, 0); for (const x of [-1.6, -0.8, 0, 0.8, 1.6]) { box(0.12, x === 0 ? 0.9 : 0.8, 0.12, toon(0x8a5a32), x, 0, 0, FENCE); add(CYL, toon(0xffffff), x, x === 0 ? 0.92 : 0.82, 0, FENCE).scale.set(0.085, 0.05, 0.085); } box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.55, 0.07, FENCE); box(3.4, 0.08, 0.06, toon(0x8a5a32), 0, 0.25, 0.07, FENCE);
const TOP = 0;
// ---------- the bird ----------
const BIRD = (() => { const g = grp(scene); const root = grp(g); const red = toon(0xd8483a), belly = toon(0xf2b080), ink = toon(0x141014), wht = basic(0xffffff), org = toon(0xf2a030);
  const body = add(SPH, red, 0, 0.12, 0, root); body.scale.set(0.12, 0.12, 0.12); const bel = add(SPH, belly, 0, 0.1, 0.05, root); bel.scale.set(0.09, 0.09, 0.08);
  const head = grp(root, 0, 0.25, 0.02); add(SPH, red, 0, 0, 0, head).scale.setScalar(0.085);
  const beak = add(CONE, org, 0, -0.01, 0.09, head); beak.scale.set(0.025, 0.05, 0.02); beak.rotation.x = Math.PI / 2;
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.04, 0.02, 0.065); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.018, 0.022, 0.01); add(SPH, wht, 0.006, 0.008, 0.008, e).scale.setScalar(0.006); eyes.push(p); const br = add(CYL, ink, 0, 0.03, 0.005, e); br.scale.set(0.004, 0.025, 0.004); br.rotation.z = Math.PI / 2 - s * 0.45; }
  for (const s of [-1, 1]) add(SPH, toon(0xf6a0a8), s * 0.055, -0.02, 0.055, head).scale.set(0.015, 0.01, 0.006);
  const wings = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.11, 0.15, -0.01); const w = add(SPH, toon(0xb8382a), s * 0.02, -0.03, -0.02, pv); w.scale.set(0.03, 0.08, 0.07); wings.push(pv); }
  const tail = add(CONE, toon(0xb8382a), 0, 0.12, -0.14, root); tail.scale.set(0.04, 0.1, 0.02); tail.rotation.x = -1.2;
  for (const s of [-1, 1]) { add(CYL, org, s * 0.04, 0.0, 0.02, root).scale.set(0.006, 0.04, 0.006); }
  const scarf = grp(root, 0, 0.2, 0.0); const sm = toon(0x2d6fd0); add(new THREE.TorusGeometry(0.075, 0.025, 8, 20), sm, 0, 0, 0, scarf).rotation.x = Math.PI / 2; for (let k = 0; k < 2; k++) { const tl = add(CAPS, sm, 0.05 + k * 0.025, -0.06, 0.07, scarf); tl.scale.set(0.02, 0.04, 0.01); tl.rotation.z = 0.3 + k * 0.2; }
  for (let k = 0; k < 6; k++) add(new THREE.TorusGeometry(0.076, 0.008, 6, 20, 0.4), toon(0xffffff), 0, 0, 0, scarf).rotation.set(Math.PI / 2, 0, k * 1.05);
  scarf.visible = false; const bodyMats = [red]; return { g, root, head, eyes, wings, scarf, red };
})();
/** bird: { pos, yaw, cold 0..1 (shiver, blue tint, puffed), scarf 0..1 (pop), happy, flap } */
function poseBird(p, t) { const B = BIRD; B.g.visible = true; B.g.position.set(...p.pos); B.g.rotation.y = p.yaw ?? 0; const c = p.cold ?? 0;
  B.root.position.x = c * Math.sin(t * 60) * 0.006; B.root.scale.setScalar(1 + 0.1 * c); B.red.color.setHex(c > 0.5 ? 0xb85a6a : 0xd8483a);
  B.head.rotation.z = Math.sin(t * 1.5) * 0.1; B.head.rotation.x = 0.2 * c; B.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.flap ? 0.6 + Math.sin(t * 30) * 0.6 : 0.1 * c)));
  B.scarf.visible = (p.scarf ?? 0) > 0; B.scarf.scale.setScalar(Math.max(0.01, Math.min(1, (p.scarf ?? 0) * 1.3))); B.root.position.y = p.flap ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
  B.eyes.forEach((e) => (e.scale.y = 0.022 * (((t * 1000) % 2900) < 110 ? 0.1 : 1 - 0.3 * c))); }
const SWEAT = Array.from({ length: 4 }, () => { const d = add(SPH, toon(0xffffff)); d.scale.setScalar(0.012); return d; });
const FLAKES = (() => { const n = 900, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, depthWrite: false, alphaTest: 0.3, map: (() => { const [c2, g2] = cv(64, 64); g2.fillStyle = "#fff"; g2.beginPath(); g2.arc(32, 32, 28, 0, 7); g2.fill(); return tex(c2, false); })() })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
const RAY = (() => { const [c, g] = cv(64, 256); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,230,150,0)"); gr.addColorStop(0.3, "rgba(255,230,150,0.55)"); gr.addColorStop(1, "rgba(255,230,150,0.0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); const m = add(new THREE.PlaneGeometry(0.9, 4), new THREE.MeshBasicMaterial({ map: tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); m.rotation.z = 0.35; return m; })();
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
  if (st.bird) { poseBird(st.bird, t); const P0 = st.bird.pos; SWEAT.forEach((d, i) => { const ph = (t * 1.5 + i / 4) % 1; d.visible = (st.bird.cold ?? 0) > 0.5; d.position.set(P0[0] + 0.12 * Math.cos(i * 1.6) * ph, P0[1] + 0.3 + ph * 0.15, P0[2] + 0.08); d.scale.setScalar(0.012 * (1 - ph)); }); } else BIRD.g.visible = false;
  RAY.visible = !!st.ray; if (st.ray) { const P0 = st.bird.pos; RAY.position.set(P0[0] - 0.5, P0[1] + 1.6, P0[2] - 0.2); RAY.material.opacity = Math.min(1, st.ray); RAY.scale.x = 0.5 + 0.5 * Math.min(1, st.ray); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
