// Shot plan for "A Última Corrida" (Parte 1). Times are the voiceover's word times (seconds).
export const FPS = 30;
export const TOTAL = Math.round(60.5 * FPS); // 59.0 s of voice + 1.5 s hold on the poll
const IX = 300;
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const back = (x) => { x = cl(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, t0, t1, e = ss) => e((t - t0) / (t1 - t0));
/** camera keys [t, pos, look, fov, roll]: smootherstep glide between consecutive keys + a slow creep */
function keys(t, K, creep = 0.02) {
  let i = 0; while (i < K.length - 1 && t > K[i + 1][0]) i++;
  const A = K[i], B = K[Math.min(i + 1, K.length - 1)];
  const u = B === A ? 0 : (B[5] || ss)((t - A[0]) / (B[0] - A[0]));
  const pos = L3(A[1], B[1], u), look = L3(A[2], B[2], u);
  pos[0] += Math.sin(t * 0.7) * creep; pos[1] += Math.sin(t * 0.93 + 1) * creep * 0.6;
  return { pos, look, fov: lerp(A[3] ?? 40, B[3] ?? 40, u), roll: lerp(A[4] ?? 0, B[4] ?? 0, u) };
}
const blink = (t, seed = 1) => ((t * 1000 + seed * 777) % 3300) < 110;
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// bike travel along -z: cruise, then brake at the neighbourhood gate (stops at z = 2)
const bikeZ = (t) => (t < 7 ? 62 - 8 * t : 6 - (8 * cl(t - 7, 0, 1) - 4 * cl(t - 7, 0, 1) ** 2));
const bikeAt = (t, extra = {}) => {
  const z = bikeZ(t), bob = t < 8 ? Math.sin(t * 17) * 0.012 : 0;
  return { pos: [0.9, bob, z], yaw: 0, spin: (62 - z) / 0.33, lean: Math.sin(t * 1.3) * 0.02 * (t < 8 ? 1 : 0), light: 1, ...extra };
};
const rider = (b, opts, extra = {}) => ({ id: "moto", pos: add3(b.pos, [0, 0.62, Math.cos(b.yaw || 0) * 0.15]), floor: 0, blob: false, opts: { mode: "sit", seed: 3, ...opts }, ...extra });

// ---------------- shots ----------------
export const SHOTS = [
  { t0: 0, t1: 5.0, name: "ride", fn: (t, lt) => {
    const b = bikeAt(t);
    return { light: "city", bike: b,
      cam: { pos: add3(b.pos, [0.62 + 0.3 * ss(lt / 5), 1.32 + 0.25 * ss(lt / 5), -2.3 - 1.6 * ss(lt / 5)]), look: add3(b.pos, [0, 1.22, 0]), fov: 40, roll: 2 * Math.sin(t * 0.8) },
      actors: [rider(b, { expr: t < 2.3 ? "neutral" : "stern", blink: blink(t), headTilt: Math.sin(t * 2) * 2 })] };
  } },
  { t0: 5.0, t1: 7.0, name: "phone", fn: (t, lt) => {
    const b = bikeAt(t);
    return { light: "city", bike: b, screen: "app",
      cam: { pos: add3(b.pos, [-0.24, 1.4 - 0.04 * ss(lt / 2), -0.1 - 0.08 * ss(lt / 2)]), look: add3(b.pos, [-0.26, 1.1, -0.49]), fov: 34 - 6 * ss(lt / 2) } };
  } },
  { t0: 7.0, t1: 11.0, name: "gate", fn: (t, lt) => {
    const b = bikeAt(t);
    return { light: "street", bike: b,
      cam: keys(t, [[7, [1.6, 1.6, 9.8], [0.6, 1.4, 1.5], 42], [8.6, [1.2, 2.6, 9.8], [0.4, 1.6, -6], 42], [11, [0.6, 5.2, 11.5], [0, 1.4, -30], 44]]),
      actors: [rider(b, { expr: "neutral", back: true })], bike: { ...b, beam: false } };
  } },
  { t0: 11.0, t1: 15.6, name: "street", fn: (t, lt) => {
    const z = -3 - 7.2 * (t - 11), bob = Math.sin(t * 9) * 0.02;
    const look = keys(t, [[11, 0, [0.3, 1.5, -30]], [11.45, 0, [-4.2, 2.8, -12.5]], [12.3, 0, [-4.2, 2.6, -12.5]], [12.75, 0, [7, 2.6, -24]], [13.6, 0, [7, 2.4, -24]],
      [14.05, 0, [-5.2, 0.6, -34]], [15.2, 0, [-5.2, 0.6, -34]], [15.6, 0, [0, 1.4, -55]]].map((k) => [k[0], k[2], k[2]]), 0).look;
    return { light: "street", pov: true, bike: { pos: [0, -30, 0], light: 0 }, cam: { pos: [0.4, 1.55 + bob, z], look, fov: 46, roll: Math.sin(t * 1.1) * 1.5 } };
  } },
  { t0: 15.6, t1: 17.8, name: "litHouse", fn: (t, lt) => {
    const b = { pos: [lerp(0.9, 2.2, seg(t, 15.6, 17.8)), 0, lerp(-43.5, -55, seg(t, 15.6, 17.8, eo))], yaw: 0, spin: t * 20, light: 1, beam: false };
    return { light: "street", bike: b,
      cam: keys(t, [[15.6, [-0.6, 1.8, -38.5], [5.5, 1.7, -62], 40], [17.8, [0.2, 1.75, -45.5], [6, 1.7, -63.5], 34]]),
      actors: [rider(b, { expr: "neutral", back: true })] };
  } },
  { t0: 17.8, t1: 21.9, name: "horn", fn: (t, lt) => {
    const b = { pos: [2.6, 0, -60.9], yaw: Math.PI, spin: 0, light: 1, beam: false };
    const door = back(seg(t, 19.3, 20.1, (x) => x));
    const expr = t < 19.45 ? "neutral" : t < 20.6 ? "worried" : "scared";
    const actors = [rider(b, { expr, blink: blink(t), look: t > 19.4 ? 1 : 0, facing: t > 19.4 ? 1 : 0 })];
    if (t > 20.55) actors.push({ id: "julia", pos: [6.25, 0, -61.95], opts: { expr: "smile", seed: 8 }, tint: [0.06, 0.04, 0.06], blob: false });
    const fx = t > 18.1 && t < 19.2 ? [{ type: "horn", t: (t - 18.1) / 1.1, pos: [2.6, 0.55, -59.9], scale: 0.7 }] : [];
    return { light: "street", bike: b, door, fx, actors,
      cam: keys(t, [[17.8, [-1.5, 1.5, -55.4], [3.9, 1.15, -61.4], 40], [19.3, [-1.2, 1.5, -55.8], [4.1, 1.2, -61.5], 40], [21.9, [0.0, 1.5, -57.0], [4.9, 1.25, -61.7], 36]]) };
  } },
  { t0: 21.9, t1: 25.9, name: "julia", fn: (t, lt) => {
    const creepy = t > 24.4;
    return { light: "street", door: 1, bike: { pos: [2.6, 0, -60.9], yaw: Math.PI, light: 1, beam: false },
      actors: [{ id: "julia", pos: [6.15, 0.0, -61.95], opts: { expr: t < 22.3 ? "smile" : creepy ? "creepy" : "sweet", seed: 8, blink: !creepy && blink(t, 2), headTilt: creepy ? -6 * seg(t, 24.4, 24.9) : 0 },
        tint: [0.95, 0.82, 0.86], blob: false }],
      cam: keys(t, [[21.9, [3.2, 1.45, -61.75], [6.15, 1.32, -61.95], 40], [24.3, [3.85, 1.42, -61.85], [6.15, 1.35, -61.95], 38], [25.0, [4.55, 1.4, -61.9], [6.15, 1.38, -61.95], 34, -3, eo], [25.9, [4.65, 1.4, -61.9], [6.15, 1.38, -61.95], 34, -3.5]], 0.01) };
  } },
  { t0: 25.9, t1: 28.5, name: "invite", fn: (t, lt) => {
    const w = seg(t, 27.55, 28.5, (x) => x), mp = L3([3.9, 0, -60.3], [5.25, 0, -61.6], w);
    return { light: "street", door: 1, bike: { pos: [2.6, 0, -60.9], yaw: Math.PI, light: 0.6, beam: false },
      actors: [
        { id: "moto", pos: mp, opts: { mode: w > 0 ? "stroll" : "stand", phase: w * 3, back: true, seed: 3 } },
        { id: "julia", pos: [6.15, 0, -61.95], opts: { expr: t < 27.6 ? "sweet" : "smile", seed: 8, wave: t > 26.1 && t < 27.6 ? 0.5 + 0.5 * Math.sin((t - 26.1) * 9) : undefined, blink: blink(t, 2) }, tint: [0.95, 0.82, 0.86], blob: false }],
      cam: keys(t, [[25.9, [0.6, 1.75, -56.6], [5.4, 1.2, -61.6], 40], [28.5, [1.5, 1.7, -57.6], [5.8, 1.2, -61.8], 38]]) };
  } },
  { t0: 28.5, t1: 33.9, name: "enter", fn: (t, lt) => {
    const w = seg(t, 28.55, 29.9, (x) => x), mp = L3([IX + 0.5, 0, 4.7], [IX + 0.25, 0, 2.5], ss(w));
    const below = t > 31.55, worried = t > 31.5;
    const fx = [];
    if (t > 29.9) fx.push({ type: "wisp", t: t - 29.9, col: "#f4f1ea", pos: [IX + 1.85, 0.95, 0.0], scale: 0.55, alpha: Math.min(1, (t - 29.9) * 2) });
    if (t > 32.2) fx.push({ type: "wisp", t: t - 32.2, col: "#8dff9e", pos: [IX - 1.42, 0.0, 2.3], scale: 0.5, alpha: Math.min(0.9, (t - 32.2) * 2) });
    return { light: "inside", fx, idoor: 1 - seg(t, 30.2, 31.2) * 0.0,
      actors: [{ id: "moto", pos: mp, opts: { mode: w < 1 ? "stroll" : "stand", phase: w * 3.2, prop: "bag", expr: worried ? "worried" : t > 30.2 ? "smile_closed" : "neutral", blink: blink(t, 4), seed: 3, facing: worried ? -1 : 0, look: worried ? -1 : 0 } }],
      cam: keys(t, [[28.5, [IX - 0.9, 1.62, -1.5], [IX + 0.4, 1.25, 3.9], 40], [30.8, [IX - 0.75, 1.6, -1.3], [IX + 0.4, 1.2, 3.0], 38], [31.6, [IX - 0.75, 1.6, -1.3], [IX + 0.3, 1.15, 2.8], 38],
        [32.7, [IX - 0.45, 1.75, -0.7], [IX - 1.3, 0.05, 2.0], 42, 2], [33.9, [IX - 0.5, 1.65, -0.45], [IX - 1.35, 0.05, 2.1], 40, 3]]) };
  } },
  { t0: 33.9, t1: 38.1, name: "helmets", fn: (t, lt) => {
    return { light: "inside", idoor: 1,
      cam: keys(t, [[33.9, [IX - 0.6, 1.6, 3.4], [IX - 3.7, 1.55, 0.6], 42], [36.6, [IX - 0.6, 1.6, -0.9], [IX - 3.7, 1.55, -1.6], 42, 0, (x) => x],
        [37.4, [IX - 2.45, 2.13, 1.62], [IX - 3.72, 2.12, 1.66], 38, -3, eo], [38.1, [IX - 2.55, 2.13, 1.63], [IX - 3.72, 2.12, 1.66], 37, -3.5]], 0.01) };
  } },
  { t0: 38.1, t1: 41.4, name: "backTurned", fn: (t, lt) => {
    return { light: "inside", idoor: 1,
      actors: [
        { id: "julia", pos: [IX + 2.3, 0, -3.55], opts: { back: true, seed: 8, mode: "stand" }, tint: [0.82, 0.95, 0.9] },
        { id: "moto", pos: [IX - 0.22, 0, 1.25], opts: { expr: "nervous", prop: "bag", blink: blink(t, 4), seed: 3, look: 1, facing: 1 } }],
      cam: keys(t, [[38.1, [IX + 0.25, 1.55, 3.4], [IX + 1.3, 1.25, -3.2], 48], [41.4, [IX + 0.35, 1.5, 3.0], [IX + 1.45, 1.25, -3.3], 44]]) };
  } },
  { t0: 41.4, t1: 46.5, name: "orders", fn: (t, lt) => {
    const drop = seg(t, 43.25, 43.6, (x) => x * x);
    const bounce = t > 43.6 ? Math.abs(Math.sin((t - 43.6) * 14)) * 0.04 * Math.max(0, 1 - (t - 43.6) * 4) : 0;
    return { light: "inside", mybag: t > 43.2 ? [IX + 1.78, 0.775 + (1 - drop) * 0.6 + bounce, 0.45] : null,
      fx: t > 43.6 && t < 44.1 ? [{ type: "click", t: (t - 43.6) / 0.5, pos: [IX + 1.78, 0.75, 0.62], scale: 0.18 }] : [],
      cam: keys(t, [[41.4, [IX + 0.75, 1.55, 2.0], [IX + 1.05, 0.9, 0.3], 40], [43.0, [IX + 1.0, 1.4, 1.65], [IX + 1.15, 0.9, 0.35], 40], [44.1, [IX + 1.05, 1.35, 1.55], [IX + 1.2, 0.9, 0.35], 40],
        [45.3, [IX + 0.95, 1.16, 1.5], [IX + 0.95, 0.88, 0.45], 38, 0, eo], [46.5, [IX + 0.95, 1.14, 1.4], [IX + 0.95, 0.87, 0.45], 36]], 0.006) };
  } },
  { t0: 46.5, t1: 49.0, name: "noSignal", fn: (t, lt) => {
    const searching = t < 47.95;
    return { light: "inside", screen: searching ? "search" : "none", blink: Math.floor(t * 4) % 2 === 0, hphone: [IX + 0.22, 1.32, 1.72],
      actors: [{ id: "moto", pos: [IX + 0.2, 0, 1.15], opts: { expr: searching ? "worried" : "scared", seed: 3, prop: "phone", blink: blink(t, 4) } }],
      cam: keys(t, [[46.5, [IX + 0.26, 1.42, 2.25], [IX + 0.22, 1.33, 1.72], 40], [49.0, [IX + 0.25, 1.4, 2.08], [IX + 0.22, 1.32, 1.72], 38]], 0.004) };
  } },
  { t0: 49.0, t1: 49.95, name: "behindYou", fn: (t, lt) => {
    const shock = t > 49.5;
    return { light: "inside",
      actors: [{ id: "moto", pos: [IX + 0.2, 0, 1.4], opts: { expr: shock ? "shock" : "worried", seed: 3, look: shock ? -1 : 0 } }],
      fx: shock ? [{ type: "bang", t: t - 49.5, pos: [IX + 0.62, 1.55, 1.4], scale: 0.18 }] : [],
      cam: keys(t, [[49.0, [IX + 0.22, 1.47, 0.35], [IX + 0.2, 1.45, 1.4], 40], [49.95, [IX + 0.22, 1.47, 0.6], [IX + 0.2, 1.45, 1.4], 36]], 0.004) };
  } },
  { t0: 49.95, t1: 51.7, name: "key", fn: (t, lt) => {
    const k = seg(t, 50.45, 50.75, eo), shake = t > 50.45 && t < 50.7 ? Math.sin(t * 90) * 0.006 : 0;
    return { light: "inside", key: k, pend: 0.85,
      fx: t > 50.55 && t < 51.1 ? [{ type: "click", t: (t - 50.55) / 0.55, pos: [IX + 0.88, 1.06, 3.78], scale: 0.12 }] : [],
      cam: keys(t, [[49.95, [IX + 0.25, 1.3, 2.7], [IX + 0.8, 1.15, 3.86], 40, 0, eo], [50.4, [IX + 0.62, 1.22 + shake, 3.38], [IX + 0.88, 1.17, 3.86], 34, 0, eo], [51.7, [IX + 0.66, 1.21, 3.45], [IX + 0.88, 1.17, 3.86], 32, 2]], 0.003) };
  } },
  { t0: 51.7, t1: 54.7, name: "kitchen", fn: (t, lt) => {
    const w = seg(t, 51.75, 53.25, (x) => x), jp = L3([IX + 2.3, 0, -4.4], [IX + 1.85, 0, -1.9], ss(w));
    const fl = t > 52.2 && t < 53.6 ? (Math.sin(t * 37) > 0.3 ? 0.25 : 1) : 1;
    return { light: "inside", pend: fl, kit: 1.3,
      actors: [{ id: "julia", pos: jp, opts: { mode: w < 1 ? "stroll" : "stand", phase: w * 3, expr: t > 53.3 ? "creepy" : "smile", prop: t > 53.3 ? "palms" : null, seed: 8, blink: blink(t, 2) }, tint: [0.88, 0.92, 0.88] }],
      cam: keys(t, [[51.7, [IX - 0.3, 1.5, 2.0], [IX + 2.1, 1.2, -3.2], 40], [54.7, [IX + 0.2, 1.48, 1.0], [IX + 1.85, 1.25, -2.0], 38]]) };
  } },
  { t0: 54.7, t1: 56.6, name: "sit", fn: (t, lt) => {
    return { light: "inside", chair: seg(t, 54.75, 55.15, back), vig: 0.8, pend: 0.9,
      actors: [{ id: "julia", pos: [IX + 1.75, 0, -1.15], opts: { expr: "creepy", seed: 8, headTilt: 7, look: -1 }, tint: [0.8, 0.66, 0.64] }],
      cam: keys(t, [[54.7, [IX + 0.95, 1.42, 0.85], [IX + 1.75, 1.3, -1.15], 40], [56.6, [IX + 1.4, 1.42, -0.15], [IX + 1.75, 1.38, -1.15], 34, -5, (x) => x]], 0.004) };
  } },
  { t0: 56.6, t1: 61, name: "poll", fn: (t, lt) => {
    return { light: "inside", chair: 1, pend: 0.75, vig: 0.9, dark: 0.45 * seg(t, 56.6, 57.3),
      actors: [
        { id: "julia", pos: [IX + 1.75, 0, -1.15], opts: { expr: "creepy", seed: 8, headTilt: 5 }, tint: [0.8, 0.66, 0.64] },
        { id: "moto", pos: [IX + 0.15, 0, 1.0], opts: { back: true, seed: 3, prop: "bag" } }],
      cam: keys(t, [[56.6, [IX - 0.35, 1.7, 2.8], [IX + 1.1, 1.05, -1.0], 40], [60.5, [IX - 0.2, 1.65, 2.3], [IX + 1.1, 1.05, -1.0], 37]]),
      overlay: (g, W, H) => poll(g, W, H, t) };
  } },
];
export const shotAt = (t) => SHOTS.find((s) => t < s.t1) || SHOTS[SHOTS.length - 1];

// ---------------- end-card poll (on-screen text, asked for by the user) ----------------
function pop(g, W, x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); fn(); g.restore(); }
function poll(g, W, H, t) {
  const k = W / 1080;
  const sc = (t0) => (t < t0 ? 0 : back(cl((t - t0) / 0.35)));
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const txt = (s, size, y, fill) => { g.font = `900 ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.2; g.strokeStyle = "#140c16"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  const a = sc(56.64);
  if (a > 0) pop(g, W, W / 2, H * 0.24, a * k, () => { txt("VOCÊ FICA", 118, -70, "#ffffff"); txt("OU SAI?", 150, 75, "#ffd23f"); });
  const btn = (t0, x, label, col) => { const s = sc(t0); if (s <= 0) return;
    pop(g, W, x, H * 0.43, s * k, () => {
      g.fillStyle = "#140c16"; rr(g, -205, -82, 410, 164, 40); g.fill();
      g.fillStyle = col; rr(g, -192, -70, 384, 140, 32); g.fill();
      txt(label, 92, 4, "#ffffff"); }); };
  btn(57.4, W * 0.27, "FICA", "#2fb36a");
  btn(58.42, W * 0.73, "SAI", "#e5483b");
  const c = sc(59.0);
  if (c > 0) pop(g, W, W / 2, H * 0.53, c * k, () => { txt("COMENTA AÍ ↓", 64, 0, "#ffffff"); txt("A MAIORIA DECIDE A PARTE 2", 42, 72, "#ffd23f"); });
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
