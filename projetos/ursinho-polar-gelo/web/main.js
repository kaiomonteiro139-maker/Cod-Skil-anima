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
// ---------- arctic sea ----------
scene.background = new THREE.Color(0xbcd4ea);
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#5f8ec8"); gr.addColorStop(0.45, "#bcd4ea"); gr.addColorStop(0.5, "#e8f2fa"); gr.addColorStop(1, "#e8f2fa"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const seaTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#1f5f9a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 160; i++) { g.strokeStyle = rnd() < 0.5 ? "rgba(120,190,240,0.5)" : "rgba(20,60,110,0.6)"; g.lineWidth = 3; g.beginPath(); const x = rnd() * 512, y = rnd() * 512; g.moveTo(x, y); g.quadraticCurveTo(x + 15, y - 6, x + 30, y); g.stroke(); } const t = tex(c); t.repeat.set(30, 30); return t; })();
const SEA = add(new THREE.PlaneGeometry(200, 200), toon(0xffffff, seaTex), 0, -0.05, 0); SEA.rotation.x = -Math.PI / 2;
for (const [x, z, s] of [[-8, -18, 3], [10, -24, 4], [-20, -30, 5], [22, -14, 2.5], [3, -40, 6]]) { const b = add(CONE, toon(0xf2f8ff), x, s * 0.4, z); b.scale.set(s * 1.4, s * 1.3, s); b.rotation.y = x; const c = add(new THREE.BoxGeometry(1, 1, 1), toon(0xdcecfa), x + s * 0.8, s * 0.2, z + 0.5); c.scale.set(s, s * 0.5, s * 0.8); }
function jag(r, n, seed) { const sh = new THREE.Shape(); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.82 + 0.18 * Math.abs(Math.sin(i * 7.7 + seed))); i ? sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } return new THREE.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: false }); }
const iceM = toon(0xeef8ff), iceSide = toon(0xb8dcf4);
const FLOE = (() => { const g = grp(scene); const m = new THREE.Mesh(jag(0.75, 11, 1), [iceM, iceSide]); m.rotation.x = -Math.PI / 2; m.position.y = 0.06; g.add(m); return g; })();
const CHUNK = (() => { const g = grp(scene); const m = new THREE.Mesh(jag(0.42, 8, 3), [iceM, iceSide]); m.rotation.x = -Math.PI / 2; m.position.y = 0.06; g.add(m); g.visible = false; return g; })();
const RINGS = Array.from({ length: 3 }, () => { const m = add(new THREE.RingGeometry(0.95, 1.0, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false }), 0, -0.03, 0); m.rotation.x = -Math.PI / 2; return m; });
const TOP = 0;
// ---------- the polar bear cub ----------
const BEAR = (() => { const g = grp(scene); const root = grp(g); const fur = toon(0xf8f6ee), cream = toon(0xeee6d0), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, fur, 0, 0.32, 0, root); body.scale.set(0.3, 0.32, 0.28); const bel = add(SPH, cream, 0, 0.3, 0.12, root); bel.scale.set(0.2, 0.22, 0.17);
  const feet = []; for (const s of [-1, 1]) { const f = add(SPH, fur, s * 0.15, 0.08, 0.2, root); f.scale.set(0.1, 0.08, 0.13); add(SPH, toon(0x3a3034), s * 0.15, 0.08, 0.32, root).scale.set(0.05, 0.04, 0.012); feet.push(f); }
  const arms = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.24, 0.45, 0.08); const a = add(CAPS, fur, 0, -0.1, 0.02, pv); a.scale.set(0.07, 0.08, 0.07); arms.push(pv); }
  const head = grp(root, 0, 0.72, 0.05); add(SPH, fur, 0, 0, 0, head).scale.set(0.22, 0.2, 0.2); const mz = add(SPH, cream, 0, -0.05, 0.16, head); mz.scale.set(0.1, 0.075, 0.08); add(SPH, ink, 0, -0.02, 0.24, head).scale.set(0.04, 0.03, 0.025);
  for (const s of [-1, 1]) { const ear = add(SPH, fur, s * 0.15, 0.15, -0.02, head); ear.scale.set(0.065, 0.065, 0.04); add(SPH, toon(0xe8b0b0), s * 0.15, 0.15, 0.01, head).scale.set(0.035, 0.035, 0.02); add(SPH, toon(0xf6a8b0), s * 0.13, -0.06, 0.15, head).scale.set(0.035, 0.022, 0.01); }
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.085, 0.04, 0.17); const b = add(SPH, ink, 0, 0, 0, e); b.scale.set(0.035, 0.045, 0.02); add(SPH, wht, 0.012, 0.016, 0.017, e).scale.setScalar(0.012); const br = add(CYL, ink, 0, 0.065, 0.005, e); br.scale.set(0.007, 0.05, 0.007); br.rotation.z = Math.PI / 2; eyes.push({ b, br, s }); }
  const frown = add(new THREE.TorusGeometry(0.03, 0.007, 6, 12, Math.PI), ink, 0, -0.1, 0.225, head); const smile = add(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), ink, 0, -0.085, 0.225, head); smile.rotation.z = Math.PI;
  return { g, root, head, eyes, arms, frown, smile }; })();
/** bear: { pos, yaw, sad 0..1, shiver, happy, hug (arms in), wave, lookDown } */
function poseBear(p, t) { const B = BEAR; B.g.visible = true; B.g.position.set(p.pos[0] + (p.shiver ? Math.sin(t * 60) * 0.006 : 0), p.pos[1], p.pos[2]); B.g.rotation.y = p.yaw ?? 0; const sd = p.sad ?? 0;
  B.root.position.y = (p.hop ? Math.abs(Math.sin(t * 9)) * 0.1 : 0); B.head.rotation.x = 0.25 * sd + (p.lookDown ?? 0) * 0.5; B.head.rotation.z = Math.sin(t * 1.3) * 0.06; B.head.rotation.y = p.headYaw ?? 0;
  B.arms.forEach((a, i) => { const s = i ? 1 : -1; a.rotation.set(p.wave && i ? -2.6 + Math.sin(t * 9) * 0.3 : p.hug ? -0.8 : -0.3, 0, s * (p.hug ? -0.6 : 0.2)); });
  B.eyes.forEach((e) => { const bl = ((t * 1000) % 3000) < 110 ? 0.12 : 1; e.b.scale.y = 0.045 * bl * (p.happy ? 0.7 : 1); e.br.rotation.z = Math.PI / 2 - e.s * 0.45 * sd; e.br.position.y = 0.065 + 0.01 * sd; });
  B.frown.visible = !p.happy; B.smile.visible = !!p.happy; }
const DRIPS = Array.from({ length: 6 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.setScalar(0.03); return d; });
const TEARS = Array.from({ length: 2 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.018, 0.026, 0.018); return d; });
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const SPARK = Array.from({ length: 12 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xbfefff, transparent: true, depthWrite: false })); scene.add(s); return s; });
const FLAKES = (() => { const n = 700, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (rnd() - 0.5) * 8; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = (rnd() - 0.5) * 8; } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: DOT, color: 0xffffff, size: 0.045, transparent: true, depthWrite: false })); m.frustumCulled = false; m.userData.base = pos.slice(); scene.add(m); return m; })();
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); SEA.castShadow = false;
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
  { const a = FLAKES.geometry.attributes.position.array, b = FLAKES.userData.base; for (let i = 0; i < a.length / 3; i++) { a[i * 3] = b[i * 3] + camera.position.x + Math.sin(t + i) * 0.1; a[i * 3 + 1] = ((b[i * 3 + 1] - t * 0.5) % 5 + 5) % 5 - 1; a[i * 3 + 2] = b[i * 3 + 2] + camera.position.z - 2; } FLAKES.geometry.attributes.position.needsUpdate = true; }
  seaTex.offset.set(t * 0.004, t * 0.006); const fs = st.floe ?? 0.6; FLOE.scale.set(fs, 1, fs); FLOE.position.y = Math.sin(t * 1.4) * 0.02; FLOE.rotation.z = Math.sin(t * 1.1) * 0.03;
  const ck = st.chunk ?? 0; CHUNK.visible = ck > 0; CHUNK.position.set(0.55 * fs + 0.25, FLOE.position.y + (ck < 1 ? (1 - ck) * 1.2 : 0), 0.15); CHUNK.scale.setScalar(Math.min(1, 0.3 + ck));
  RINGS.forEach((r, i) => { const ph = (t * 0.4 + i / 3) % 1; r.scale.setScalar(fs * (0.8 + ph * 0.8)); r.material.opacity = 0.35 * (1 - ph); });
  if (st.bear) { poseBear(st.bear, t); BEAR.g.position.y += FLOE.position.y + 0.28; const H0 = BEAR.head.getWorldPosition(new THREE.Vector3()); TEARS.forEach((d, i) => { const ph = (t * 0.8 + i / 2) % 1; d.visible = (st.bear.sad ?? 0) > 0.5; d.position.set(H0.x + (i ? 0.09 : -0.09), H0.y - ph * 0.2, H0.z + 0.17); }); } else BEAR.g.visible = false;
  DRIPS.forEach((d, i) => { const ph = (t * 0.7 + i / 6) % 1, a = i * 1.05; d.visible = true; d.position.set(Math.cos(a) * 0.68 * fs, 0.15 - ph * 0.25, Math.sin(a) * 0.68 * fs); });
  SPARK.forEach((s) => (s.visible = false)); if (ck > 0 && ck < 1.8) SPARK.forEach((s, i) => { const ph = (t * 1.3 + i / 12) % 1; s.visible = true; s.position.set(CHUNK.position.x + Math.cos(i * 2.4) * 0.35, 0.2 + ph * 0.8, 0.15 + Math.sin(i * 2.4) * 0.3); s.scale.setScalar(0.07 * (1 - ph)); });
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t); if (S.like) likeBtn(og, S.like, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
