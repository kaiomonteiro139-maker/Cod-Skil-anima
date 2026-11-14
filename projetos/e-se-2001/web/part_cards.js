// ---------- cards (characters + effects) ----------
const SU = 0.0022;
class Card {
  constructor(cw = 600, ch = 1000, su = SU) {
    this.c = document.createElement("canvas"); this.c.width = cw * 2; this.c.height = ch * 2; this.g = this.c.getContext("2d");
    this.tex = P.tex(this.c, false);
    const geo = new THREE.PlaneGeometry(cw * su, ch * su); geo.translate(0, ch * su / 2 - (ch - 975) * su * (ch === 1000 ? 1 : 0), 0);
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: ch === 1000, alphaTest: ch === 1000 ? 0.4 : 0.02, fog: false });
    this.mesh = new THREE.Mesh(geo, this.mat); this.mesh.renderOrder = 2; scene.add(this.mesh); this.key = ""; this.cw = cw; this.ch = ch;
    // contact blob
    const bc = document.createElement("canvas"); bc.width = bc.height = 64; const bg = bc.getContext("2d"); const gr = bg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)"); bg.fillStyle = gr; bg.fillRect(0, 0, 64, 64);
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ map: P.tex(bc, false), transparent: true, depthWrite: false }));
    this.blob.rotation.x = -Math.PI / 2; scene.add(this.blob);
  }
  draw(key, fn) {
    if (key === this.key) return; this.key = key;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.c.width, this.c.height); g.setTransform(2, 0, 0, 2, 0, 0);
    fn(new T.Pen(g), g); this.tex.needsUpdate = true;
  }
  place(x, y, z, cam, opts = {}) {
    this.mesh.visible = true; this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, Math.atan2(cam.x - x, cam.z - z), opts.roll || 0);
    const s = opts.scale ?? 1; this.mesh.scale.set(s * (opts.sx ?? 1), s * (opts.sy ?? 1), 1);
    this.mat.color.setRGB(...(opts.tint || [1, 1, 1]));
    this.blob.visible = opts.blob !== false; this.blob.position.set(x, (opts.floor ?? y) + 0.02, z);
  }
  hide() { this.mesh.visible = false; this.blob.visible = false; }
}
const MOTO = { jacket: "#e0533a", pants: "#2f3a4f", boots: "#1c1f26", hat: "helmet", cap: "#f2c230", skin: "#e8b48e" };
const JULIA = { jacket: "#8e1f3a", dress: "#8e1f3a", pants: "#3a2a30", boots: "#2a1a1e", hat: "longhair", hair: "#2a1a1e", skin: "#f3d6c2" };
const cards = { moto: new Card(), julia: new Card(600, 1000, 0.00212) };
const fxCards = []; for (let i = 0; i < 6; i++) { const c = new Card(512, 512, 0.002); c.blob.visible = false; fxCards.push(c); }
const qz = (v, s = 0.05) => Math.round(v / s) * s;
const actorKey = (o) => JSON.stringify(o, (k, v) => typeof v === "number" ? qz(v, 0.02) : v);

const FX_DRAW = {
  horn: (p, g, t) => { g.lineCap = "round"; for (let i = 0; i < 3; i++) { const r = 60 + i * 55 + t * 40, a = Math.max(0, 1 - t * 0.8 - i * 0.12);
      g.globalAlpha = a; g.strokeStyle = "#241726"; g.lineWidth = 26; g.beginPath(); g.arc(120, 256, r, -0.7, 0.7); g.stroke();
      g.strokeStyle = "#ffe066"; g.lineWidth = 14; g.beginPath(); g.arc(120, 256, r, -0.7, 0.7); g.stroke(); } g.globalAlpha = 1; },
  wisp: (p, g, t, col) => { g.lineCap = "round";
    for (let k = 0; k < 3; k++) { const x0 = 160 + k * 90, ph = t * 3 + k * 2; g.globalAlpha = 0.75;
      g.strokeStyle = col; g.lineWidth = 20; g.beginPath();
      for (let y = 480; y > 60; y -= 12) { const x = x0 + Math.sin(y / 50 + ph) * 26 * (1 - y / 600); if (y === 480) g.moveTo(x, y); else g.lineTo(x, y); }
      g.stroke(); } g.globalAlpha = 1; },
  bang: (p, g, t) => { const s = 1 + 0.15 * Math.sin(t * 20); g.translate(256, 256); g.scale(s, s);
    g.fillStyle = "#ffe066"; g.strokeStyle = "#241726"; g.lineWidth = 16; g.beginPath();
    for (let i = 0; i < 20; i++) { const a = (i / 20) * 6.283, r = i % 2 ? 110 : 220; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#241726"; g.font = "900 150px 'DejaVu Sans'"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("!", 0, 8); },
  click: (p, g, t) => { g.strokeStyle = "#241726"; g.lineWidth = 18; g.lineCap = "round"; const r0 = 70 + t * 160;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; g.globalAlpha = Math.max(0, 1 - t * 1.4); g.beginPath(); g.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0); g.lineTo(256 + Math.cos(a) * (r0 + 70), 256 + Math.sin(a) * (r0 + 70)); g.stroke(); }
    g.globalAlpha = 1; },
};

// ---------- post (ink + grade) ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
rt.depthTexture = new THREE.DepthTexture(W, H); rt.depthTexture.type = THREE.FloatType;
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, near: { value: 0.05 }, far: { value: 400 }, res: { value: new THREE.Vector2(W, H) },
    flash: { value: 0 }, dark: { value: 0 }, vig: { value: 0.55 }, sat: { value: 1.0 }, gain: { value: new THREE.Vector3(1, 1, 1) }, seed: { value: 0 }, inkR: { value: 1.6 * W / 1080 * 1.5 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    #include <packing>
    uniform sampler2D tC; uniform sampler2D tD; uniform float near, far, flash, dark, vig, sat, seed, inkR; uniform vec2 res; uniform vec3 gain;
    varying vec2 vUv;
    float lz(vec2 uv){ float d = texture2D(tD, uv).x; return -perspectiveDepthToViewZ(d, near, far); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb;
      float d0 = lz(vUv), e = 0.0;
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 o = vec2(cos(a), sin(a)) * inkR / res;
        float dn = lz(vUv + o); e = max(e, (dn - d0) / d0); }
      float ink = smoothstep(0.05, 0.12, e) * (1.0 - smoothstep(40.0, 120.0, d0));
      c = mix(c, vec3(0.055, 0.035, 0.06), ink * 0.92);
      c = linearToOutputTexel(vec4(c, 1.0)).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(l), c, sat); c *= gain;
      vec2 v = vUv - 0.5; v.x *= 0.75; c *= 1.0 - vig * smoothstep(0.25, 0.75, length(v));
      c += (hash(vUv * res) - 0.5) * 0.035;
      c = mix(c, vec3(1.0), flash); c *= 1.0 - dark;
      gl_FragColor = vec4(c, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

