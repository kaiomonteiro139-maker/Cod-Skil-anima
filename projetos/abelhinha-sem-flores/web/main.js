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
// ---------- dry garden ----------
scene.background = new THREE.Color(0xa8d4f0);
const dryTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#b8a060"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 900; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(140,110,50,0.5)" : "rgba(220,200,130,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 6, y - 8 - rnd() * 10); g.stroke(); } const t = tex(c); t.repeat.set(20, 20); return t; })();
const GRD = add(new THREE.PlaneGeometry(120, 120), toon(0xffffff, dryTex), 0, 0, 0); GRD.rotation.x = -Math.PI / 2;
const [skC, skG] = cv(64, 512); { const gr = skG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f9ae0"); gr.addColorStop(0.45, "#a8d4f0"); gr.addColorStop(0.5, "#f0f4e8"); gr.addColorStop(1, "#f0f4e8"); skG.fillStyle = gr; skG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skC, false), side: THREE.BackSide, depthWrite: false })); SKY.renderOrder = -1;
const FEN = grp(scene, 0, 0, -2.5); for (let i = -8; i <= 8; i++) { box(0.12, 0.9, 0.05, toon(0xf2efe6), i * 0.4, 0, 0, FEN); add(CONE, toon(0xf2efe6), i * 0.4, 0.95, 0, FEN).scale.set(0.07, 0.12, 0.03); } box(6.8, 0.07, 0.04, toon(0xf2efe6), 0, 0.6, 0.04, FEN); box(6.8, 0.07, 0.04, toon(0xf2efe6), 0, 0.25, 0.04, FEN);
const HIVE = grp(scene, 2.2, 0, -1.8); add(CYL, toon(0x6a4a2e), 0, 0.5, 0, HIVE).scale.set(0.05, 1.0, 0.05); for (let k = 0; k < 4; k++) add(SPH, toon(0xe8b040), 0, 1.15 - k * 0.12, 0, HIVE).scale.set(0.22 - k * 0.01 + (k === 1 || k === 2 ? 0.04 : 0), 0.08, 0.22); add(new THREE.CircleGeometry(0.05, 16), toon(0x3a2414), 0, 1.0, 0.24, HIVE);
function wilted(x, z, s, col) { const g = grp(scene, x, 0, z); g.scale.setScalar(s); const st = add(CYL, toon(0x8a8a40), 0, 0.3, 0, g); st.scale.set(0.02, 0.6, 0.02); const hd = grp(g, 0, 0.6, 0); hd.rotation.z = 2.3; for (let k = 0; k < 6; k++) { const p = add(SPH, toon(col), Math.cos(k) * 0.07, 0, Math.sin(k) * 0.07, hd); p.scale.set(0.06, 0.015, 0.04); p.rotation.y = -k; } add(SPH, toon(0x6a4a22), 0, 0.01, 0, hd).scale.setScalar(0.04); return g; }
for (let i = 0; i < 16; i++) wilted((rnd() - 0.5) * 6, -0.5 - rnd() * 1.8, 0.8 + rnd() * 0.6, [0x9a7a5a, 0xa08a60, 0x8a7060][i % 3]);
const BED = wilted(0, 0, 1.5, 0x9a7a5a); // the bee's wilted flower
const TOP = 0;
// ---------- the new flower (grows on follow) ----------
const FLOW = (() => { const g = grp(scene, 0.45, 0, 0.25); const stem = add(CYL, toon(0x3f9a3a), 0, 0.3, 0, g); stem.scale.set(0.025, 0.6, 0.025); for (const s of [-1, 1]) { const l = add(SPH, toon(0x4fb04a), s * 0.07, 0.25, 0, g); l.scale.set(0.08, 0.02, 0.04); l.rotation.z = s * 0.4; }
  const head = grp(g, 0, 0.62, 0); for (let k = 0; k < 8; k++) { const p = add(SPH, toon(0xf06aa0), Math.cos(k / 8 * 6.28) * 0.09, 0, Math.sin(k / 8 * 6.28) * 0.09, head); p.scale.set(0.07, 0.02, 0.045); p.rotation.y = -k / 8 * 6.28; } add(SPH, toon(0xf2c230), 0, 0.015, 0, head).scale.set(0.055, 0.03, 0.055); head.rotation.x = 0.5; return { g, head }; })();
// ---------- the bee ----------
const BEE = (() => { const g = grp(scene); const root = grp(g); const yel = toon(0xf6c830), blk = toon(0x2a2228), ink = toon(0x141014), wht = basic(0xffffff);
  const body = add(SPH, yel, 0, 0, -0.04, root); body.scale.set(0.11, 0.1, 0.13); for (const z of [-0.08, -0.01]) { const b = add(new THREE.TorusGeometry(0.098, 0.022, 8, 24), blk, 0, 0, z, root); b.scale.set(1.08, 1.0, 1); }
  const sting = add(CONE, blk, 0, 0, -0.18, root); sting.scale.set(0.02, 0.05, 0.02); sting.rotation.x = -Math.PI / 2;
  const head = grp(root, 0, 0.03, 0.1); add(SPH, yel, 0, 0, 0, head).scale.setScalar(0.08);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.035, 0.015, 0.065); const p = add(SPH, ink, 0, 0, 0, e); p.scale.set(0.02, 0.025, 0.012); add(SPH, wht, 0.006, 0.009, 0.01, e).scale.setScalar(0.007); eyes.push(p); const br = add(CYL, ink, 0, 0.032, 0.004, e); br.scale.set(0.004, 0.025, 0.004); br.rotation.z = Math.PI / 2 - s * 0.45; }
  for (const s of [-1, 1]) { add(SPH, toon(0xf6a0a8), s * 0.05, -0.02, 0.055, head).scale.set(0.014, 0.009, 0.006); const an = grp(head, s * 0.03, 0.06, 0.02); add(CYL, blk, 0, 0.04, 0, an).scale.set(0.004, 0.08, 0.004); add(SPH, blk, 0, 0.085, 0, an).scale.setScalar(0.012); an.rotation.z = -s * 0.3; }
  const smile = add(new THREE.TorusGeometry(0.02, 0.005, 6, 12, Math.PI), ink, 0, -0.03, 0.075, head);
  const wings = []; const wm = new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide }); for (const s of [-1, 1]) { const pv = grp(root, s * 0.05, 0.08, -0.02); const w = add(SPH, wm, s * 0.07, 0.03, 0, pv); w.scale.set(0.08, 0.01, 0.05); wings.push(pv); }
  return { g, root, head, eyes, wings, smile };
})();
/** bee: { pos, yaw, tired 0..1 (lying on its side), fly, happy } */
function poseBee(p, t) { const B = BEE; B.g.visible = true; B.g.position.set(...p.pos); B.g.rotation.y = p.yaw ?? 0; const tr = p.tired ?? 0;
  B.root.rotation.z = 1.2 * tr; B.root.position.y = (p.fly ? Math.sin(t * 6) * 0.03 : 0); B.wings.forEach((w, i) => (w.rotation.z = (i ? -1 : 1) * (p.fly ? 0.3 + Math.sin(t * 60 + i * 3) * 0.6 : 0.1 + 0.05 * Math.sin(t * 2))));
  B.smile.rotation.z = (p.happy ?? 0) > 0 ? Math.PI : 0; B.smile.position.y = (p.happy ?? 0) > 0 ? -0.025 : -0.04; B.eyes.forEach((e) => (e.scale.y = 0.025 * (((t * 1000) % 2900) < 110 ? 0.1 : 1 - 0.4 * tr))); }
const SWEAT = Array.from({ length: 3 }, () => { const d = add(SPH, toon(0x9fdcff)); d.scale.set(0.015, 0.02, 0.015); return d; });
const SPARK = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff0a0, transparent: true, depthWrite: false })); s.scale.setScalar(0.04); scene.add(s); return s; });
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); GRD.castShadow = false;
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
  const gr = st.grow ?? 0; FLOW.g.visible = gr > 0; FLOW.g.scale.set(1, Math.max(0.01, Math.min(1, gr * 1.4)), 1); FLOW.head.scale.setScalar(Math.max(0.01, Math.min(1, (gr - 0.4) * 2.2))); FLOW.head.rotation.z = Math.sin(t * 2) * 0.08;
  SPARK.forEach((s) => (s.visible = false)); if (gr > 0 && gr < 1.6) SPARK.forEach((s, i) => { const ph = (t * 1.4 + i / 10) % 1; s.visible = true; s.position.set(0.45 + Math.cos(i * 2.4) * 0.2, 0.2 + ph * 0.8, 0.25 + Math.sin(i * 2.4) * 0.2); s.scale.setScalar(0.05 * (1 - ph)); });
  if (st.bee) { poseBee(st.bee, t); const P0 = st.bee.pos; SWEAT.forEach((d, i) => { const ph = (t * 0.9 + i / 3) % 1; d.visible = (st.bee.tired ?? 0) > 0.5; d.position.set(P0[0] + 0.06 * (i - 1), P0[1] + 0.18 - ph * 0.2, P0[2] + 0.08); }); } else BEE.g.visible = false;
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
