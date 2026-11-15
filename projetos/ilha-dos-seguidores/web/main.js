// "Ilha dos Seguidores" — tiny island village; every follower who comments a name gets a house with a name sign.
// Residents come from the story module (export RESIDENTS = ["Ana", ...]); episode 1 has none, plus a ghost "VOCÊ?" house.
import * as THREE from "./three.module.js";
const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 540), H = +(q.get("h") || 960);
const SM = await import("./" + (q.get("story") || "story") + ".js"); const { stateAt, FPS, TOTAL } = SM; const RESIDENTS = SM.RESIDENTS || [];
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H; const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, W / H, 0.05, 500); scene.add(camera); scene.fog = new THREE.Fog(0xcfe8f5, 60, 260);
let SEED = 9; const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep = true) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
const gradMap = (() => { const d = new Uint8Array([120, 120, 120, 255, 195, 195, 195, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (color, map = null, extra = {}) => new THREE.MeshToonMaterial({ color, map, gradientMap: gradMap, ...extra });
const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const grp = (parent = scene, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
const box = (w, h, d, mat, x, y, z, parent = scene) => add(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, parent);
const SPH = new THREE.SphereGeometry(1, 22, 16), CYL = new THREE.CylinderGeometry(1, 1, 1, 18), CONE = new THREE.ConeGeometry(1, 1, 4), CAPS = new THREE.CapsuleGeometry(1, 1, 8, 16);
const label = (text, o = {}) => { const [c, g] = cv(o.w || 512, o.h || 160); g.fillStyle = o.bg || "#f4e2b8"; g.fillRect(0, 0, c.width, c.height); g.strokeStyle = o.border || "#6a4026"; g.lineWidth = 14; g.strokeRect(7, 7, c.width - 14, c.height - 14);
  g.fillStyle = o.fg || "#3a2414"; g.textAlign = "center"; g.textBaseline = "middle"; const lines = String(text).split("|"); lines.forEach((l, i) => { let fz = o.size || 86; g.font = `900 ${fz}px "DejaVu Sans"`; while (g.measureText(l).width > c.width - 50 && fz > 20) { fz -= 4; g.font = `900 ${fz}px "DejaVu Sans"`; } g.fillText(l, c.width / 2, c.height / 2 + (i - (lines.length - 1) / 2) * (o.size || 86) * 1.05 + 4); }); return tex(c, false); };

// ---------- sea, island, beach ----------
const seaTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#2fa8c8"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 5; g.lineCap = "round";
  for (let i = 0; i < 40; i++) { const x = rnd() * 512, y = rnd() * 512; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 12, y - 6, x + 26, y); g.stroke(); } const t = tex(c); t.repeat.set(30, 30); return t; })();
const SEA = add(new THREE.PlaneGeometry(600, 600), toon(0xffffff, seaTex), 0, 0, 0); SEA.rotation.x = -Math.PI / 2;
const SHALLOW = add(new THREE.CircleGeometry(15, 64), toon(0x6fd6dc, null, { transparent: true, opacity: 0.85 }), 0, 0.02, 0); SHALLOW.rotation.x = -Math.PI / 2;
const FOAM = add(new THREE.RingGeometry(10.4, 11.0, 64), basic(0xffffff, { transparent: true, opacity: 0.8 }), 0, 0.04, 0); FOAM.rotation.x = -Math.PI / 2;
const SAND = add(new THREE.CylinderGeometry(10.2, 10.8, 0.6, 64), toon(0xf2d99a), 0, 0.0, 0);
const grassTex = (() => { const [c, g] = cv(512, 512); g.fillStyle = "#7cc25a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 600; i++) { const x = rnd() * 512, y = rnd() * 512; g.strokeStyle = rnd() < 0.5 ? "rgba(60,120,40,0.5)" : "rgba(170,220,120,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 5, y - 7 - rnd() * 8); g.stroke(); } const t = tex(c); t.repeat.set(5, 5); return t; })();
const GRASS = add(new THREE.CylinderGeometry(8.6, 9.0, 0.7, 64), toon(0xffffff, grassTex), 0, 0.12, 0);
const TOP = 0.47; // grass surface height
// path ring + plaza
const PATH = add(new THREE.RingGeometry(3.0, 3.7, 64), toon(0xe8d6a8), 0, TOP + 0.01, 0); PATH.rotation.x = -Math.PI / 2;
const PLAZA = add(new THREE.CircleGeometry(2.2, 48), toon(0xe8d6a8), 0, TOP + 0.01, 0); PLAZA.rotation.x = -Math.PI / 2;
// big welcome sign + flag
const SIGN = grp(scene, 0, TOP, -0.6); for (const x of [-1.1, 1.1]) box(0.14, 1.8, 0.14, toon(0x6a4026), x, 0, 0, SIGN);
const signTexC = cv(1024, 512); const signTex = tex(signTexC[0], false); const signBoard = add(new THREE.PlaneGeometry(2.8, 1.4), toon(0xffffff, signTex), 0, 1.55, 0.08, SIGN); box(2.95, 1.5, 0.12, toon(0x6a4026), 0, 0.8, 0, SIGN);
function drawSign(n) { const [c, g] = signTexC; g.fillStyle = "#f4e2b8"; g.fillRect(0, 0, 1024, 512); g.strokeStyle = "#6a4026"; g.lineWidth = 24; g.strokeRect(12, 12, 1000, 488); g.fillStyle = "#3a2414"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = '900 104px "DejaVu Sans"'; g.fillText("VILA DOS", 512, 120); g.fillText("SEGUIDORES", 512, 235); g.fillStyle = "#c0392b"; g.font = '900 92px "DejaVu Sans"'; g.fillText(`HABITANTES: ${n}`, 512, 395); signTex.needsUpdate = true; }
const FLAG = grp(scene, 1.6, TOP, 0.8); add(CYL, toon(0xd8d8d8), 0, 1.6, 0, FLAG).scale.set(0.05, 3.2, 0.05); const flagCloth = add(new THREE.PlaneGeometry(0.9, 0.55, 8, 1), toon(0xe5483b, null, { side: THREE.DoubleSide }), 0.45, 2.9, 0, FLAG);
// lots in a ring (house plots)
export const LOTS = []; const NL = 10;
for (let i = 0; i < NL; i++) { const a = (i / NL) * Math.PI * 2 + Math.PI / 2, r = 5.6, x = Math.cos(a) * r, z = Math.sin(a) * r; const g = grp(scene, x, TOP, z); g.rotation.y = -a - Math.PI / 2;
  const dirt = add(new THREE.PlaneGeometry(1.9, 1.9), toon(0xb08a5a), 0, 0.015, 0, g); dirt.rotation.x = -Math.PI / 2;
  for (const [sx, sz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) box(0.06, 0.32, 0.06, toon(0xf2f2ee), sx, 0, sz, g);
  const post = box(0.06, 0.6, 0.06, toon(0x6a4026), 0.75, 0, 1.05, g); const lb = add(new THREE.PlaneGeometry(0.62, 0.22), toon(0xffffff, label(`LOTE ${i + 1}`, { size: 80 })), 0.75, 0.58, 1.09, g);
  LOTS.push({ g, a, x, z, lb, post }); }
// houses (built from RESIDENTS) and the ghost house
const HOUSE_COLS = [0xf2c2a0, 0xa8d8ea, 0xf6e7a1, 0xc8e6a0, 0xf4b6c2, 0xd7c4f0, 0xffd8a8, 0xb8e0d2, 0xf0d0b0, 0xe0e0e0];
function makeHouse(col, name, ghost = false) { const g = grp(scene); const op = ghost ? { transparent: true, opacity: 0.55, depthWrite: false } : {};
  box(1.3, 1.0, 1.2, toon(col, null, op), 0, 0, 0, g); const roof = add(CONE, toon(ghost ? 0xffffff : 0xd8484a, null, op), 0, 1.38, 0, g); roof.scale.set(1.05, 0.75, 1.0); roof.rotation.y = Math.PI / 4;
  box(0.32, 0.55, 0.04, toon(0x7a4a2a, null, op), 0, 0, 0.61, g); for (const s of [-1, 1]) add(new THREE.PlaneGeometry(0.28, 0.26), basic(0x9fd8ff, op), s * 0.4, 0.62, 0.61, g);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: label(name, { w: 512, h: 170, size: 96, bg: ghost ? "#fff3c4" : "#ffffff", border: ghost ? "#e5a80f" : "#3a2414" }), depthWrite: false })); sp.scale.set(1.5, 0.5, 1); sp.position.set(0, 2.45, 0); g.add(sp);
  return { g, sp }; }
const HOUSES = RESIDENTS.map((n, i) => { const L = LOTS[i % NL], h = makeHouse(HOUSE_COLS[i % HOUSE_COLS.length], n); h.g.position.set(L.x, TOP, L.z); h.g.rotation.y = L.g.rotation.y + Math.PI; L.lb.visible = L.post.visible = false; return h; });
const GHOST = makeHouse(0xffffff, "VOCÊ?", true);
// bean person (white, faceless like the reference) for the ghost lot
const BEAN = (() => { const g = grp(scene); const m = toon(0xfbfaf6, null, { transparent: true, opacity: 0.9 }); const b = add(CAPS, m, 0, 0.42, 0, g); b.scale.set(0.2, 0.22, 0.18); add(SPH, m, 0, 0.92, 0, g).scale.setScalar(0.2);
  const ink = toon(0x1a1214); for (const sx of [-1, 1]) add(SPH, ink, sx * 0.07, 0.95, 0.17, g).scale.set(0.025, 0.035, 0.02);
  const sm = add(new THREE.TorusGeometry(0.05, 0.012, 6, 16, Math.PI), ink, 0, 0.88, 0.185, g); sm.rotation.z = Math.PI;
  const arm = grp(g, 0.2, 0.62, 0); add(CAPS, m, 0, 0.16, 0, arm).scale.set(0.05, 0.13, 0.05); return { g, arm }; })();
// palms, rocks, dock, boat, lighthouse
function palm(x, z, s = 1, lean = 0.2) { const g = grp(scene, x, TOP, z); g.scale.setScalar(s); g.rotation.y = rnd() * 6.28; let px = 0, py = 0; const trunk = toon(0x9a6a3a);
  for (let i = 0; i < 6; i++) { const seg = add(CYL, trunk, px, py + 0.3, 0, g); seg.scale.set(0.13 - i * 0.008, 0.6, 0.13 - i * 0.008); seg.rotation.z = -lean * (i / 6); px += Math.sin(lean * i / 6) * 0.6; py += 0.58; }
  const top = grp(g, px, py + 0.1, 0); for (let k = 0; k < 7; k++) { const leaf = add(SPH, toon(0x3f9a3a), 0, 0, 0, top); leaf.scale.set(0.9, 0.06, 0.26); leaf.position.set(Math.cos(k * 0.9) * 0.6, -0.12, Math.sin(k * 0.9) * 0.6); leaf.rotation.y = -k * 0.9; leaf.rotation.z = -0.35; }
  for (let k = 0; k < 3; k++) add(SPH, toon(0x6a4a22), Math.cos(k * 2) * 0.12, -0.12, Math.sin(k * 2) * 0.12, top).scale.setScalar(0.1); return g; }
for (const [a, r, s] of [[0.2, 8.3, 1.1], [0.9, 8.6, 0.9], [1.9, 8.2, 1.2], [2.8, 8.5, 1.0], [3.6, 8.3, 1.15], [4.4, 8.6, 0.95], [5.3, 8.2, 1.1], [6.0, 8.4, 1.0], [1.4, 2.2, 0.8], [4.0, 2.3, 0.85]]) palm(Math.cos(a) * r, Math.sin(a) * r, s);
for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, r = 9.4 + rnd() * 1.2; const rk = add(SPH, toon(0x9a958a), Math.cos(a) * r, 0.2, Math.sin(a) * r); const s = 0.25 + rnd() * 0.4; rk.scale.set(s * 1.3, s * 0.7, s); }
const DOCK = grp(scene, 10.2, 0.35, 2.0); box(4.2, 0.12, 1.1, toon(0xa87a4a), 1.8, 0, 0, DOCK); for (const x of [0.2, 1.4, 2.6, 3.7]) for (const s of [-1, 1]) box(0.12, 0.7, 0.12, toon(0x6a4026), x, -0.6, s * 0.5, DOCK);
const BOAT = grp(scene, 13.6, 0.1, 3.4); add(SPH, toon(0xf2f2ee), 0, 0.2, 0, BOAT).scale.set(1.1, 0.35, 0.45); add(SPH, toon(0x2d6fd0), 0, 0.26, 0, BOAT).scale.set(1.12, 0.12, 0.47);
const LH = grp(scene, -6.6, TOP, -5.4); for (let i = 0; i < 5; i++) add(CYL, toon(i % 2 ? 0xe5483b : 0xf6f6f2), 0, 0.35 + i * 0.6, 0, LH).scale.set(0.62 - i * 0.05, 0.6, 0.62 - i * 0.05); add(CYL, basic(0xfff0b0), 0, 3.35, 0, LH).scale.set(0.38, 0.5, 0.38); add(CONE, toon(0xe5483b), 0, 3.85, 0, LH).scale.set(0.5, 0.5, 0.5);
const glowTex = (() => { const [c, g] = cv(128, 128); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); })();
const SPARK = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffe680, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(s); return s; });
const GULLS = Array.from({ length: 4 }, () => { const g = grp(scene); for (const s of [-1, 1]) { const w = add(new THREE.PlaneGeometry(0.5, 0.12), toon(0xffffff, null, { side: THREE.DoubleSide }), s * 0.25, 0, 0, g); w.userData.s = s; } return g; });
// sky + light
const [skyC, skyG] = cv(64, 512); { const gr = skyG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#3f9fe0"); gr.addColorStop(0.45, "#9fd4f2"); gr.addColorStop(0.5, "#e6f4fb"); gr.addColorStop(1, "#e6f4fb"); skyG.fillStyle = gr; skyG.fillRect(0, 0, 64, 512); }
const SKY = add(new THREE.SphereGeometry(400, 32, 16), new THREE.MeshBasicMaterial({ map: tex(skyC, false), side: THREE.BackSide, fog: false, depthWrite: false })); SKY.renderOrder = -1;
for (let i = 0; i < 9; i++) { const c = grp(scene, (rnd() - 0.5) * 300, 40 + rnd() * 30, -120 - rnd() * 100); for (let k = 0; k < 4; k++) add(SPH, basic(0xffffff, { fog: false }), k * 6 - 9, Math.sin(k) * 2, 0, c).scale.set(7, 4.5, 4); }
const hemi = new THREE.HemisphereLight(0xfff6e8, 0x6a8a70, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 120 }); sun.position.set(-20, 35, 25); scene.add(sun, sun.target);
scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); SEA.castShadow = false;

// ---------- post (ink outline + bloom + vignette) ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }); rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({ uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 500 }, res: { value: new THREE.Vector2(W, H) }, inkR: { value: 4.5 * Math.min(W, H) / 1080 }, vig: { value: 0.3 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `#include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, inkR, vig; uniform vec2 res; varying vec2 vUv;
    float lz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tD, uv).x, near, far); }
    void main(){ vec3 c = texture2D(tC, vUv).rgb; float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * inkR / res; e = max(e, (lz(vUv + o) - d0) / d0); }
      float ink = smoothstep(0.012, 0.04, e) * (1.0 - smoothstep(60.0, 160.0, d0));
      vec3 bl = vec3(0.0); for (int i = 0; i < 12; i++) { float a = float(i) * 0.5236; vec2 o = vec2(cos(a), sin(a)) * 20.0 / res; bl += max(texture2D(tC, vUv + o).rgb - 0.85, 0.0); }
      c += bl / 12.0 * 1.0; c = mix(c, vec3(0.07, 0.06, 0.07), ink * 0.95); c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      vec2 v = vUv - 0.5; c *= 1.0 - vig * smoothstep(0.35, 0.9, length(v * vec2(1.0, 0.75))); gl_FragColor = vec4(c, 1.0); }`, depthTest: false, depthWrite: false });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

// ---------- 2D overlays ----------
const U = Math.min(W, H) / 1080; const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const popS = (k) => (k <= 0 ? 0 : k < 1 ? 0.4 + 0.6 * k + 0.18 * Math.sin(k * Math.PI) : 1);
function counter(g, e, t) { const s = popS(e.k) * (1 + 0.05 * Math.sin(t * 6) * (e.pulse ? 1 : 0)); if (!s) return; g.save(); g.translate(W / 2, H * 0.11); g.scale(s, s);
  const bw = 700 * U, bh = 150 * U; g.fillStyle = "rgba(20,12,16,0.35)"; rr(g, -bw / 2 + 8 * U, -bh / 2 + 12 * U, bw, bh, 40 * U); g.fill(); g.fillStyle = "#fbf7ee"; rr(g, -bw / 2, -bh / 2, bw, bh, 40 * U); g.fill(); g.lineWidth = 9 * U; g.strokeStyle = "#140c10"; g.stroke();
  g.textAlign = "center"; g.textBaseline = "middle"; g.font = `${88 * U}px "Noto Color Emoji"`; g.fillText("🏝️", -bw / 2 + 95 * U, 6 * U);
  g.fillStyle = "#140c10"; g.font = `900 ${62 * U}px "Inter", "DejaVu Sans"`; g.fillText("HABITANTES:", 0, 4 * U); g.fillStyle = "#e5323f"; g.font = `900 ${96 * U}px "Inter", "DejaVu Sans"`; g.fillText(String(e.n ?? 0), 270 * U, 6 * U); g.restore(); }
function followBtn(g, e, t) { const k = Math.min(1, e.k), tap = e.tap ?? 0, s = popS(k) * (1 + 0.06 * Math.sin(t * 10) * (tap > 0 ? 0 : 1)); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.86)); g.scale(s, s); const done = tap > 0.5, bw = 470 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, bh / 2); g.fill(); g.fillStyle = done ? "#3a3d44" : "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(done ? "✓ Seguindo" : "+ Seguir", 0, 4 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 150 * U + m * 60 * U, 110 * U + m * 60 * U); } g.restore(); }
function commentPill(g, e, t) { const s = popS(Math.min(1, e.k)); if (!s) return; g.save(); g.translate(W / 2, H * 0.86); g.scale(s, s); const bw = 760 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, 30 * U); g.fill(); g.fillStyle = "#ffffff"; rr(g, -bw / 2, -bh / 2, bw, bh, 30 * U); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#140c10"; g.stroke();
  g.textAlign = "left"; g.textBaseline = "middle"; g.font = `${70 * U}px "Noto Color Emoji"`; g.fillText("💬", -bw / 2 + 30 * U, 6 * U); g.fillStyle = "#8a8a8a"; g.font = `700 ${50 * U}px "Inter", "DejaVu Sans"`;
  const txt = "Seu nome aqui...".slice(0, Math.floor(16 * Math.min(1, (e.type ?? 1)))); g.fillText(txt + ((t * 2) % 1 < 0.5 ? "|" : ""), -bw / 2 + 130 * U, 4 * U); g.fillStyle = "#e5323f"; g.textAlign = "right"; g.font = `900 ${50 * U}px "Inter", "DejaVu Sans"`; g.fillText("➤", bw / 2 - 34 * U, 4 * U); g.restore(); }

// ---------- render one state ----------
let signN = -1;
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 50; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  const n = st.count ?? RESIDENTS.length; if (n !== signN) { drawSign(n); signN = n; }
  seaTex.offset.set(t * 0.01, t * 0.006); FOAM.scale.setScalar(1 + 0.015 * Math.sin(t * 1.6)); FOAM.material.opacity = 0.6 + 0.25 * Math.sin(t * 1.6);
  flagCloth.geometry.attributes.position.array.forEach((v, i, a) => { if (i % 3 === 2) { const x = a[i - 2]; a[i] = Math.sin(t * 6 + x * 6) * 0.06 * (x + 0.45); } }); flagCloth.geometry.attributes.position.needsUpdate = true;
  GULLS.forEach((gl, i) => { const a = t * 0.25 + i * 1.6, r = 12 + i * 2; gl.position.set(Math.cos(a) * r, 7 + i * 0.8 + Math.sin(t + i), Math.sin(a) * r); gl.rotation.y = -a; gl.children.forEach((w) => (w.rotation.x = w.userData.s * Math.sin(t * 8 + i) * 0.5)); });
  // ghost house on a lot (k: 0..1 pop), bean waving
  const gh = st.ghost; GHOST.g.visible = !!gh; BEAN.g.visible = !!(gh && gh.bean);
  if (gh) { const L = LOTS[gh.lot]; const s = popS(gh.k); GHOST.g.position.set(L.x, TOP, L.z); GHOST.g.rotation.y = L.g.rotation.y + Math.PI; GHOST.g.scale.setScalar(Math.max(0.001, s) * (1 + 0.03 * Math.sin(t * 4))); L.lb.visible = L.post.visible = gh.k <= 0;
    if (gh.bean) { const f = new THREE.Vector3(Math.sin(GHOST.g.rotation.y), 0, Math.cos(GHOST.g.rotation.y)); BEAN.g.position.set(L.x + f.x * 1.0 + f.z * 0.5, TOP, L.z + f.z * 1.0 - f.x * 0.5); BEAN.g.rotation.y = GHOST.g.rotation.y; BEAN.g.scale.setScalar(popS(gh.bean)); BEAN.arm.rotation.z = -2.4 + Math.sin(t * 9) * 0.5; }
    SPARK.forEach((sp, i) => { const ph = (t * 0.8 + i / 10) % 1; sp.visible = gh.k > 0.2; sp.position.set(L.x + Math.cos(i * 2.4) * 1.2, TOP + 0.3 + ph * 2.6, L.z + Math.sin(i * 2.4) * 1.2); sp.scale.setScalar(0.35 * (1 - ph)); }); }
  else { SPARK.forEach((s) => (s.visible = false)); LOTS.forEach((L, i) => (L.lb.visible = L.post.visible = i >= RESIDENTS.length)); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.3; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.b && S.mix > 0) { renderState(S.b, t); og.globalAlpha = S.mix; og.drawImage(glc, 0, 0); og.globalAlpha = 1; }
  if (S.counter) counter(og, S.counter, t); if (S.follow) followBtn(og, S.follow, t); if (S.comment) commentPill(og, S.comment, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
