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
// ---------- space ----------
scene.background = new THREE.Color(0x03050c);
const STARS = (() => { const n = 2500, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const v = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(150 + rnd() * 30); pos.set([v.x, v.y, v.z], i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })); scene.add(m); return m; })();
const EARTH = (() => { const [c, x] = cv(1024, 512); x.fillStyle = "#2f7fd8"; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 30; i++) { const cx = rnd() * 1024, cy = 90 + rnd() * 330; x.fillStyle = rnd() < 0.7 ? "#4fb04a" : "#c8a860"; x.beginPath(); for (let k = 0; k < 9; k++) { const a = (k / 9) * 6.28, r = 30 + rnd() * 50; k ? x.lineTo(cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r) : x.moveTo(cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r); } x.fill(); }
  for (let i = 0; i < 40; i++) { x.fillStyle = "rgba(255,255,255,0.75)"; x.beginPath(); x.ellipse(rnd() * 1024, rnd() * 512, 30 + rnd() * 60, 8 + rnd() * 10, 0, 0, 7); x.fill(); }
  const m = add(new THREE.SphereGeometry(40, 64, 48), toon(0xffffff, tex(c, false)), 10, -52, -40); const halo = add(new THREE.SphereGeometry(41.2, 64, 48), new THREE.MeshBasicMaterial({ color: 0x7ac0ff, transparent: true, opacity: 0.25, side: THREE.BackSide, depthWrite: false }), 10, -52, -40); return m; })();
const SNOW = EARTH;
const STATION = (() => { const g = grp(scene, -4.5, 2.6, -6.5); const hull = toon(0xd8dce0);
  const m = add(CYL, hull, 0, 0, 0, g); m.scale.set(0.9, 4.2, 0.9); m.rotation.z = Math.PI / 2; for (const x of [-1.6, 0, 1.6]) { const r = add(new THREE.TorusGeometry(0.9, 0.05, 8, 32), toon(0xa8aeb4), x, 0, 0, g); r.rotation.y = Math.PI / 2; }
  for (const s of [-1, 1]) { const arm = cbox0(0.08, 0.08, 1.6, toon(0x8a8e94), 0, 0, s * 1.6, g); for (const k of [-1, 1]) { const p = cbox0(2.2, 0.04, 1.1, toon(0x2a4a9a), k * 1.2, 0, s * 2.4, g); } }
  const hatch = add(new THREE.CircleGeometry(0.42, 32), toon(0x1a1e24), 2.11, 0, 0, g); hatch.rotation.y = Math.PI / 2; const lit = add(new THREE.CircleGeometry(0.34, 32), basic(0xffd890), 2.12, 0, 0, g); lit.rotation.y = Math.PI / 2;
  return g; })();
function cbox0(w, h, d, m, x, y, z, p) { return add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p); }
const TOP = 0;
// ---------- the guy (blocky, winter clothes) ----------
const cbox = (w, h, d, m, x, y, z, p) => add(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const GUY = (() => { const g = grp(scene); const root = grp(g, 0, 0.95, 0); const body = grp(root); const red = toon(0xf0f0ec), jean = toon(0xe2e2de), skin = toon(0x9a6440), ink = toon(0x141014), wht = basic(0xffffff), hat = toon(0x2d6fd0), shoe = toon(0x8a8e94);
  const torso = cbox(0.56, 0.66, 0.32, red, 0, 0.36, 0, body); cbox(0.5, 0.6, 0.22, toon(0xd8d8d4), 0, 0.36, -0.26, body); cbox(0.24, 0.16, 0.04, toon(0x2d6fd0), 0, 0.5, 0.17, body); cbox(0.06, 0.04, 0.045, toon(0xe5323f), -0.06, 0.5, 0.18, body); cbox(0.06, 0.04, 0.045, toon(0xf2c230), 0.06, 0.5, 0.18, body); cbox(0.2, 0.06, 0.33, toon(0x2d6fd0), 0, 0.12, 0.0, body);
  const neck = grp(body, 0, 0.72, 0); const head = grp(neck, 0, 0.2, 0); add(SPH, skin, 0, 0, 0, head).scale.set(0.2, 0.22, 0.2);
  const cap = add(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x4a3a30), 0, 0.03, -0.02, head); cap.scale.set(0.212, 0.2, 0.212); for (const s of [-1, 1]) add(SPH, toon(0x2a2a2a), s * 0.2, 0.0, 0, head).scale.set(0.03, 0.07, 0.07);
  const eyes = []; for (const s of [-1, 1]) { const e = grp(head, s * 0.075, 0.0, 0.18); const w = add(SPH, wht, 0, 0, 0, e); w.scale.set(0.045, 0.05, 0.02); const p = add(SPH, ink, 0, 0, 0.015, e); p.scale.set(0.022, 0.028, 0.012); const br = add(CYL, ink, 0, 0.065, 0.01, e); br.scale.set(0.01, 0.06, 0.01); br.rotation.z = Math.PI / 2; eyes.push({ w, p, br, s }); }
  const mouth = add(SPH, toon(0x5a1a1a), 0, -0.1, 0.18, head); mouth.scale.set(0.05, 0.015, 0.015); const smile = add(new THREE.TorusGeometry(0.06, 0.014, 6, 14, Math.PI), ink, 0, -0.06, 0.19, head); smile.rotation.z = Math.PI;
  const arms = []; for (const s of [-1, 1]) { const pv = grp(body, s * 0.36, 0.62, 0); cbox(0.16, 0.6, 0.18, red, 0, -0.28, 0, pv); add(SPH, skin, 0, -0.62, 0, pv).scale.setScalar(0.085); arms.push(pv); }
  const shovel = grp(arms[1], 0, -0.62, 0.02); cbox(0.04, 1.1, 0.04, toon(0x8a5a32), 0, 0.05, 0.12, shovel).rotation.x = 1.2; const bl = cbox(0.22, 0.03, 0.28, toon(0x9aa4ac), 0, 0.27, 0.66, shovel); bl.rotation.x = 1.2; shovel.visible = false;
  const legs = []; for (const s of [-1, 1]) { const pv = grp(root, s * 0.14, 0.04, 0); cbox(0.22, 0.86, 0.24, jean, 0, -0.45, 0, pv); cbox(0.23, 0.12, 0.34, shoe, 0, -0.9, 0.05, pv); legs.push(pv); }
  return { g, root, body, neck, head, eyes, mouth, smile, arms, legs, shovel };
})();
/** guy: { pos, yaw, sink (m below ice), prone 0..1, roll (rad, spin on the long axis), arms 'flail'|'forward'|'up'|'down'|'wave', kick, walk phase, face 'scared'|'calm'|'happy', headYaw, lean } */
function poseGuy(p, t) { const G = GUY; G.g.visible = true; G.g.position.set(p.pos[0], p.pos[1] - (p.sink ?? 0), p.pos[2]); G.g.rotation.set(0, p.yaw ?? 0, 0);
  const pr = p.prone ?? 0, w = p.walk; G.root.rotation.set(pr * Math.PI / 2 + (p.lean ?? 0), 0, 0); G.root.position.y = 0.95 - pr * 0.75 + (w != null ? Math.abs(Math.sin(w * 7)) * 0.04 : 0) + (p.bob ? Math.sin(t * 3) * 0.04 : 0);
  G.root.rotation.y = 0; G.body.rotation.y = 0; G.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), p.roll ?? 0);
  const A = p.arms ?? "down"; G.arms.forEach((a, i) => { const s = i ? 1 : -1; let x = 0, z = s * 0.08;
    if (w != null && A === "down") x = Math.sin(w * 7 + i * Math.PI) * 0.6;
    if (A === "flail") { x = -2.4 + Math.sin(t * 14 + i * 2) * 0.7; z = s * (0.5 + Math.sin(t * 11 + i) * 0.3); }
    if (A === "forward") { x = -1.45 + Math.sin(t * 2 + i) * 0.05; z = s * 0.1; }
    if (A === "pull") { x = -1.5 + Math.sin(t * 5 + i * Math.PI) * 0.25; z = s * 0.15; }
    if (A === "up") { x = -2.9; z = s * 0.3; }
    if (A === "wave") { x = i ? -2.7 : 0; z = i ? 0.4 + Math.sin(t * 9) * 0.35 : -0.08; }
    if (A === "float") { x = -0.5 + Math.sin(t * 1.3 + i) * 0.25; z = s * (0.55 + Math.sin(t * 1.1 + i * 2) * 0.15); }
    if (A === "helmet") { x = -2.75; z = s * 0.55; }
    if (A === "throat") { x = -2.2; z = -s * 0.25; }
    if (A === "dig") { x = -0.9 + Math.sin(t * 7) * 0.5; z = s * 0.1; }
    if (A === "tuck") { x = -0.3; z = s * 0.05; }
    a.rotation.set(x, 0, z); });
  G.legs.forEach((l, i) => { let x = w != null ? Math.sin(w * 7 + i * Math.PI) * 0.55 : p.floaty ? -0.2 + Math.sin(t * 1.2 + i * 2) * 0.2 : 0; if (p.kick) x = Math.sin(t * 16 + i * Math.PI) * 0.5; l.rotation.set(x, 0, 0); });
  G.neck.rotation.set(-0.6 * pr + (p.headPitch ?? 0), p.headYaw ?? 0, 0);
  const f = p.face ?? "calm"; G.eyes.forEach((e) => { const bl = f === "ko" ? 0.08 : ((t * 1000) % 3100) < 110 ? 0.12 : 1; const big = f === "scared" ? 1.35 : 1; e.w.scale.set(0.045 * big, 0.05 * big * bl, 0.02); e.p.scale.set(0.022 * (f === "scared" ? 0.8 : 1), 0.028 * bl, 0.012); e.br.position.y = f === "scared" ? 0.09 : 0.065; e.br.rotation.z = Math.PI / 2 + e.s * (f === "scared" ? -0.35 : f === "happy" ? 0.1 : 0); });
  G.mouth.scale.set(f === "scared" ? 0.045 : f === "happy" ? 0.065 : 0.05, f === "scared" ? 0.05 + 0.015 * Math.sin(t * 20) : f === "happy" ? 0.03 : 0.015, 0.015); G.shovel.visible = !!p.shovel; G.mouth.position.y = -0.1; G.mouth.visible = f !== "happy"; G.smile.visible = f === "happy"; }
const DOT = (() => { const [c, g] = cv(64, 64); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return tex(c, false); })();
const HELM = (() => { const g = grp(scene); add(new THREE.SphereGeometry(0.33, 32, 24), new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.22, depthWrite: false }), 0, 0, 0, g); const rim = add(new THREE.TorusGeometry(0.27, 0.05, 10, 32), toon(0xd8dce0), 0, -0.24, 0, g); rim.rotation.x = Math.PI / 2;
  const [c, x] = cv(128, 128); const gr = x.createLinearGradient(0, 0, 128, 128); gr.addColorStop(0, "rgba(255,255,255,0.0)"); gr.addColorStop(0.45, "rgba(255,255,255,0.55)"); gr.addColorStop(0.55, "rgba(255,255,255,0.0)"); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  const sh = add(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: tex(c, false), transparent: true, depthWrite: false }), 0.05, 0.08, 0.3, g); return g; })();
const BUB = Array.from({ length: 10 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: DOT, color: 0xdff4ff, transparent: true, opacity: 0.9, depthWrite: false })); scene.add(s); return s; });
const TETHER = (() => { const m = add(new THREE.CylinderGeometry(0.015, 0.015, 1, 8), toon(0xf2c230)); return m; })();
// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a6a4a, 1.1)); const sun = new THREE.DirectionalLight(0xfff0d8, 2.0); sun.position.set(-4, 8, 3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005; Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 }); scene.add(sun);

scene.traverse((o) => { if (o.isMesh && o.material.type === "MeshToonMaterial" && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } }); EARTH.castShadow = false; EARTH.receiveShadow = false;
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
  if (e.label) { const tw2 = tw + 40 * U; g.fillStyle = "#fff"; rr(g, -tw2 / 2, -bh / 2, tw2, bh, bh / 2); g.fill(); g.lineWidth = 8 * U; g.strokeStyle = "#e5323f"; g.stroke(); g.fillStyle = "#e5323f"; g.beginPath(); g.arc(-tw2 / 2 + 45 * U, 0, 13 * U, 0, 7); g.fill(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 22 * U, 4 * U); } else { g.fillStyle = e.bg || "#ffd23f"; rr(g, -tw / 2, -bh / 2, tw, bh, 24 * U); g.fill(); g.lineWidth = 7 * U; g.strokeStyle = "#140c10"; g.stroke(); g.fillStyle = "#140c10"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(e.text, 0, 4 * U); } g.restore(); }
function followBtn(g, e, t) { const k = Math.min(1, e.k), tap = e.tap ?? 0, s = popS(k) * (1 + 0.06 * Math.sin(t * 10) * (tap > 0 ? 0 : 1)); if (!s) return; g.save(); g.translate(W / 2, H * (e.y ?? 0.85)); g.scale(s, s); const done = tap > 0.5, bw = 470 * U, bh = 120 * U;
  g.fillStyle = "rgba(0,0,0,0.35)"; rr(g, -bw / 2 + 6 * U, -bh / 2 + 10 * U, bw, bh, bh / 2); g.fill(); g.fillStyle = done ? "#3a3d44" : "#e5323f"; rr(g, -bw / 2, -bh / 2, bw, bh, bh / 2); g.fill(); g.lineWidth = 6 * U; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `900 ${58 * U}px "Inter", "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(done ? "✓ Seguindo" : "+ Seguir", 0, 4 * U);
  if (e.hand) { const m = 1 - Math.min(1, tap * 2); g.font = `${120 * U}px "Noto Color Emoji"`; g.fillText("👆", 150 * U + m * 60 * U, 110 * U + m * 60 * U); } g.restore(); }
// ---------- render ----------
function renderState(st, t) { const c = st.cam; camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look)); camera.fov = c.fov ?? 45; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180);
  if (st.shake) { camera.position.x += Math.sin(t * 61) * 0.015 * st.shake; camera.position.y += Math.sin(t * 47) * 0.015 * st.shake; } camera.updateProjectionMatrix();
  STARS.rotation.y = t * 0.004; EARTH.rotation.y = t * 0.02;
  if (st.guy) { poseGuy(st.guy, t); GUY.g.rotation.z = Math.sin(t * 0.6) * 0.12 * (st.guy.tumble ?? 1); GUY.g.rotation.x = Math.sin(t * 0.45) * 0.08 * (st.guy.tumble ?? 1); } else GUY.g.visible = false;
  GUY.g.updateMatrixWorld(true); const HP = GUY.head.getWorldPosition(new THREE.Vector3()); const HQ = GUY.head.getWorldQuaternion(new THREE.Quaternion());
  HELM.visible = st.helm != null; if (HELM.visible) { const off = new THREE.Vector3(0.5 * (st.helm ?? 0), 0.03 + (st.helm ?? 0) * 0.9, 0.1 * (st.helm ?? 0)).applyQuaternion(HQ); HELM.position.copy(HP).add(off); HELM.quaternion.copy(HQ); HELM.rotateZ((st.helm ?? 0) * 0.6); }
  BUB.forEach((b) => (b.visible = false)); if (st.boil) { const fw = new THREE.Vector3(0, -0.1, 0.2).applyQuaternion(HQ); BUB.forEach((b, i) => { const ph = (t * 1.6 + i / 10) % 1; b.visible = true; b.position.copy(HP).add(fw).add(new THREE.Vector3(Math.sin(i * 2.3) * 0.08 * (1 + ph), ph * 0.25, Math.cos(i * 1.7) * 0.06 + ph * 0.15).applyQuaternion(HQ)); b.scale.setScalar((0.025 + 0.02 * Math.sin(i)) * (1 - ph * 0.5) * st.boil); b.material.opacity = 0.9 * (1 - ph); }); }
  TETHER.visible = !!st.tether; if (st.tether) { const a = GUY.body.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.3, 0)), b = new THREE.Vector3(-2.39, 2.6, -6.5); const mid = a.clone().add(b).multiplyScalar(0.5); TETHER.position.copy(mid); TETHER.scale.set(1, a.distanceTo(b), 1); TETHER.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); }
  renderer.setRenderTarget(rt); renderer.render(scene, camera); post.uniforms.vig.value = st.vig ?? 0.35; post.uniforms.red.value = st.red ?? 0; renderer.setRenderTarget(null); renderer.render(postScene, postCam); }
window.renderFrame = async (f) => { const t = f / FPS, S = stateAt(t);
  renderState(S.a, t); og.globalAlpha = 1; og.drawImage(glc, 0, 0);
  if (S.a.flash) { og.fillStyle = `rgba(255,255,255,${S.a.flash})`; og.fillRect(0, 0, W, H); }
  if (S.bar) waterBar(og, S.bar, t); (S.tags || []).forEach((e) => tagPill(og, e)); if (S.follow) followBtn(og, S.follow, t);
  if (S.dark) { og.fillStyle = `rgba(0,0,0,${S.dark})`; og.fillRect(0, 0, W, H); }
  return out.toDataURL("image/jpeg", 0.93); };
window.TOTAL = TOTAL; window.ready = true;
