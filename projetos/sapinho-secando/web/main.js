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
// ---------- dried-up pond ----------
scene.background = new THREE.Color(0x9fd4f0);
const mudTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#b8935e"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "140,105,60" : "210,180,130"},0.45)`; g.fillRect(rnd() * 512, rnd() * 512, 3, 3); }
  g.strokeStyle = "rgba(80,55,30,0.85)"; g.lineWidth = 4; for (let i = 0; i < 70; i++) { let x = rnd() * 512, y = rnd() * 512; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 70; y += (rnd() - 0.5) * 70; g.lineTo(x, y); } g.stroke(); } const t = tex(c); t.repeat.set(10, 10); return t; })();
const MUD = add(new THREE.PlaneGeometry(80, 80), toon(0xffffff, mudTex), 0, 0, 0); MUD.rotation.x = -Math.PI / 2;
const BANK = add(new THREE.RingGeometry(6, 40, 48), toon(0x6fa84a), 0, 0.02, 0); BANK.rotation.x = -Math.PI / 2;
const POND = add(new THREE.CircleGeometry(1, 40), toon(0x4f9ac8, null, { transparent: true, opacity: 0.9 }), 0.45, 0.012, 0.55); POND.rotation.x = -Math.PI / 2;
const POND2 = add(new THREE.RingGeometry(0.92, 1.0, 40), basic(0xd8f0ff), 0.45, 0.014, 0.55); POND2.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f9ae0"); gr.addColorStop(0.45, "#9fd4f0"); gr.addColorStop(0.5, "#f0f6e8"); gr.addColorStop(1, "#f0f6e8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const sunTex = (() => { const [c, g] = cv(256, 256); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.25, "rgba(255,240,170,1)"); gr.addColorStop(0.32, "rgba(255,220,120,0.6)"); gr.addColorStop(1, "rgba(255,200,100,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return tex(c, false); })();
const SUNS = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, depthWrite: false })); SUNS.scale.setScalar(26); SUNS.position.set(-10, 28, -60); scene.add(SUNS);
for (let i = 0; i < 30; i++) { const a = rnd() * 6.28, r = 2.5 + rnd() * 3; const g = grp(scene, Math.cos(a) * r, 0, Math.sin(a) * r - 1); for (let k = 0; k < 4; k++) { const rd = add(CYL, toon(0xb8a060), (rnd() - 0.5) * 0.15, 0.35, (rnd() - 0.5) * 0.15, g); rd.scale.set(0.015, 0.7 + rnd() * 0.5, 0.015); rd.rotation.z = (rnd() - 0.5) * 0.5; } }
for (let i = 0; i < 10; i++) { const r = add(SPH, toon(0x8a8478), (rnd() - 0.5) * 6, 0.05, (rnd() - 0.5) * 4 - 1); const s = 0.1 + rnd() * 0.25; r.scale.set(s * 1.3, s * 0.6, s); }
const PAD = add(new THREE.CircleGeometry(0.35, 20, 0.3, 5.7), toon(0x9a8a40), -0.9, 0.01, 0.9); PAD.rotation.x = -Math.PI / 2;
for (const [x, z, s] of [[-6, -6, 1.3], [5, -7, 1.0], [8, -3, 1.2]]) { const tr = grp(scene, x, 0, z); add(CYL, toon(0x6a4a2e), 0, 1.4, 0, tr).scale.set(0.2, 2.8, 0.2); const cn = add(SPH, toon(0x5a8a3a), 0, 3.2, 0, tr); cn.scale.set(1.6 * s, 1.3 * s, 1.6 * s); }
const TOP = 0;
// ---------- the frog ----------
const FROG = (() => { const g = grp(scene); const root = grp(g); const skin = toon(0x6fc04a), belly = toon(0xe8f0a0), spot = toon(0x3f8a2a), ink = toon(0x141014), wht = basic(0xffffff), pink = toon(0xf08a9a);
  const body = add(SPH, skin, 0, 0.2, 0, root); body.scale.set(0.3, 0.22, 0.28); const bel = add(SPH, belly, 0, 0.16, 0.12, root); bel.scale.set(0.22, 0.15, 0.17);
  for (const [x, z] of [[0.12, -0.1], [-0.15, -0.05], [0.02, 0.05]]) { const sp = add(SPH, spot, x, 0.38, z, root); sp.scale.set(0.05, 0.015, 0.05); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(root, s * 0.14, 0.4, 0.12); add(SPH, skin, 0, 0, 0, e).scale.setScalar(0.1); add(SPH, wht, 0, 0.01, 0.05, e).scale.set(0.08, 0.085, 0.06); const p = add(SPH, ink, 0, 0.0, 0.1, e); p.scale.set(0.045, 0.055, 0.02); add(SPH, wht, 0.015, 0.02, 0.115, e).scale.setScalar(0.014);
    const lid = add(SPH, skin, 0, 0.04, 0.03, e); lid.scale.set(0.105, 0.06, 0.1); eyes.push({ p, lid }); }
  const mouth = add(new THREE.TorusGeometry(0.17, 0.012, 6, 20, Math.PI), ink, 0, 0.22, 0.24, root); mouth.rotation.z = Math.PI;
  const tongue = add(CAPS, pink, 0, 0.17, 0.3, root); tongue.scale.set(0.04, 0.05, 0.02); tongue.rotation.x = 1.2;
  for (const s of [-1, 1]) add(SPH, pink, s * 0.2, 0.25, 0.2, root).scale.set(0.04, 0.025, 0.02);
  const legs = []; for (const [x, z, sx] of [[-0.24, -0.08, -1], [0.24, -0.08, 1], [-0.14, 0.2, -1], [0.14, 0.2, 1]]) { const pv = grp(root, x, 0.06, z); add(SPH, skin, sx * 0.04, 0, 0, pv).scale.set(0.1, 0.06, 0.13); add(SPH, skin, sx * 0.06, -0.04, 0.1, pv).scale.set(0.07, 0.02, 0.05); legs.push(pv); }
  return { g, root, body, eyes, mouth, tongue, legs };
})();
/** frog: { pos, yaw, tired 0..1 (droopy lids, tongue out, flattened), jump, happy } */
function poseFrog(p, t) { const F = FROG; F.g.visible = true; F.g.position.set(...p.pos); F.g.rotation.y = p.yaw ?? 0; const tr = p.tired ?? 0;
  const j = p.jump ? Math.abs(Math.sin(t * 7)) : 0; F.root.position.y = j * 0.35; F.root.scale.set(1 + 0.12 * tr, 1 - 0.2 * tr + 0.03 * Math.sin(t * (tr ? 2.5 : 5)), 1); F.legs.forEach((l, i) => (l.rotation.x = j * (i < 2 ? -0.8 : 0.6)));
  F.eyes.forEach((e) => { e.lid.position.y = 0.045 - 0.012 * tr; e.lid.scale.y = 0.05 + 0.03 * tr + (((t * 1000) % 3000) < 110 ? 0.05 : 0); }); F.tongue.visible = tr > 0.5; F.mouth.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; F.mouth.position.y = (p.happy ?? 0) > 0 ? 0.22 : 0.15; }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.025, 0.035, 0.025); return d; });
const CLOUD = grp(scene); for (const [x, y, s] of [[0, 0, 0.5], [0.45, -0.05, 0.38], [-0.45, -0.05, 0.4], [0.2, 0.2, 0.36], [-0.2, 0.18, 0.34]]) add(SPH, toon(0x9aa4b4), x, y, 0, CLOUD).scale.set(s, s * 0.75, s * 0.8);
const RAIN = (() => { const n = 70, pnt = new Float32Array(n * 6); const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pnt, 3)); const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x6fc0f0 })); m.frustumCulled = false; scene.add(m); return m; })();
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); MUD.castShadow = BANK.castShadow = false;
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
  SUNS.scale.setScalar(26 + Math.sin(t * 4) * 1.5); const pr = 0.32 + 1.3 * (st.pond ?? 0); POND.scale.set(pr * 1.2, pr, 1); POND2.scale.set(pr * 1.2, pr, 1);
  if (st.frog) { poseFrog(st.frog, t); SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 3) % 1; d.visible = !!st.frog.sweat; d.position.set(st.frog.pos[0] + 0.15 * (i - 1), 0.62 - ph * 0.4, st.frog.pos[2] + 0.28); }); } else FROG.g.visible = false;
  const cl = st.cloud; CLOUD.visible = !!cl; RAIN.visible = !!(cl && cl.rain);
  if (cl) { CLOUD.position.set(0.25, 1.55 + (1 - Math.min(1, cl.k * 2)) * 1.5, 0.75); CLOUD.scale.setScalar(Math.max(0.01, Math.min(1, cl.k * 2)));
    if (cl.rain) { const a = RAIN.geometry.attributes.position.array; for (let i = 0; i < a.length / 6; i++) { const x = 0.25 + Math.sin(i * 12.9898) * 0.6, z = 0.75 + Math.cos(i * 4.1) * 0.35, ph = (t * 1.6 + (i * 0.618) % 1) % 1, y = 1.35 - ph * 1.35; a[i * 6] = x; a[i * 6 + 1] = y; a[i * 6 + 2] = z; a[i * 6 + 3] = x; a[i * 6 + 4] = y + 0.15; a[i * 6 + 5] = z; } RAIN.geometry.attributes.position.needsUpdate = true; } }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
