// Shot plan for "A Última Corrida" (Parte 1). Times are the voiceover's word times (seconds).
export const FPS = 30;
export const TOTAL = Math.round(30.3 * FPS);
const WARP = [[0.0, 0.0], [0.9, 0.35], [1.549, 1.3], [3.317, 2.06], [8.779, 7.6], [10.645, 8.46], [12.953, 11.4], [14.941, 12.14], [20.759, 17.8], [22.851, 18.92], [23.665, 20.4], [25.305, 21.0], [26.443, 22.5], [26.8, 22.6], [30.3, 24.8]];
export const warp = (t) => { for (let i = 1; i < WARP.length; i++) if (t <= WARP[i][0]) { const [a0, b0] = WARP[i - 1], [a1, b1] = WARP[i]; return b0 + (b1 - b0) * (t - a0) / (a1 - a0); } return WARP[WARP.length - 1][1]; };
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


const HP = [-0.6, 0.56, -1.3]; // hero sitting in bed
const hero = (opts, extra = {}) => ({ id: "hero", pos: HP, opts: { mode: "sit", seed: 5, ...opts }, ...extra });
export const SHOTS = [
  { t0: 0, t1: 2.0, fn: (t) => ({
    actors: [hero({ expr: t < 0.72 ? "neutral" : t < 1.3 ? "dazed" : "nervous", blink: t < 0.72 ? true : blink(t, 3), headTilt: t < 0.72 ? -8 : 0 })],
    fx: t < 0.8 ? [{ type: "zzz", t: t / 0.8, pos: [-0.35, 1.5, -1.25], scale: 0.28 }] : [],
    cam: keys(t, [[0, [-0.42, 1.43, -0.2], [-0.6, 1.4, -1.3], 38], [2.0, [-0.45, 1.43, -0.42], [-0.6, 1.42, -1.3], 35]], 0.006) }) },
  { t0: 2.0, t1: 4.5, fn: (t) => ({
    clock: t < 2.5 ? "06:59" : "07:00", clockOn: t < 2.5 || Math.floor((t - 2.5) * 4) % 2 === 0,
    fx: t > 2.5 && t < 3.1 ? [{ type: "beep", t: (t - 2.5) / 0.6, pos: [0.56, 0.56, -1.82], scale: 0.18 }] : [],
    cam: keys(t, [[2.0, [0.47, 0.8, -1.38], [0.56, 0.62, -1.88], 36], [4.5, [0.52, 0.72, -1.55], [0.56, 0.62, -1.88], 32]], 0.004) }) },
  { t0: 4.5, t1: 6.0, fn: (t) => ({
    cam: keys(t, [[4.5, [0.85, 1.12, 0.35], [2.0, 1.0, -0.05], 38], [6.0, [1.2, 1.08, 0.2], [2.0, 1.0, -0.05], 34]], 0.005) }) },
  { t0: 6.0, t1: 8.3, fn: (t) => ({
    cam: keys(t, [[6.0, [0.68, 0.98, -1.38], [0.93, 0.63, -1.86], 36], [6.85, [0.7, 0.96, -1.4], [0.93, 0.63, -1.86], 36], [8.3, [1.12, 0.84, -1.5], [0.82, 0.62, -1.84], 34]], 0.004) }) },
  { t0: 8.3, t1: 12.0, fn: (t) => {
    const shock = t > 10.1;
    return { actors: [hero({ expr: shock ? "shock" : "neutral", facing: 1, look: 1, blink: !shock && blink(t, 3) })],
      flash: t > 10.1 && t < 10.25 ? 0.35 * (1 - (t - 10.1) / 0.15) : 0,
      cam: keys(t, [[8.3, [0.25, 1.45, 0.75], [-0.05, 1.35, -1.6], 40], [9.9, [0.35, 1.45, 0.55], [0.15, 1.4, -1.7], 40], [10.45, [0.92, 1.6, -1.5], [0.95, 1.6, -2.2], 34, -2, eo], [12.0, [0.93, 1.6, -1.6], [0.95, 1.6, -2.2], 32, -2.5]], 0.005) };
  } },
  { t0: 12.0, t1: 13.4, fn: (t) => ({ lap: 4,
    actors: [hero({ expr: "dazed", look: 0, blink: blink(t, 3) }, { tint: [0.85, 1.0, 1.08] })],
    cam: keys(t, [[12.0, [-0.15, 1.3, 0.45], [-0.6, 1.1, -1.0], 38], [13.4, [-0.3, 1.25, 0.05], [-0.6, 1.08, -1.0], 36]], 0.005) }) },
  { t0: 13.4, t1: 18.6, fn: (t) => ({ lap: 4, term: t - 13.4,
    cam: keys(t, [[13.4, [-0.6, 1.24, -1.2], [-0.6, 0.86, -0.77], 40], [15.0, [-0.6, 1.14, -1.07], [-0.6, 0.86, -0.77], 40], [18.6, [-0.6, 1.08, -1.0], [-0.6, 0.86, -0.77], 36]], 0.002) }) },
  { t0: 18.6, t1: 20.8, fn: (t) => ({ lap: 4, term: 9,
    actors: [hero({ expr: t < 19.55 ? "grin" : "worried", blink: blink(t, 3) }, { tint: [0.85, 1.0, 1.08] })],
    cam: keys(t, [[18.6, [-0.28, 1.4, 0.1], [-0.6, 1.3, -1.3], 36], [20.8, [-0.35, 1.42, -0.25], [-0.6, 1.34, -1.3], 33]], 0.005) }) },
  { t0: 20.8, t1: 22.6, fn: (t) => {
    const sh = t > 21.7 ? Math.sin(t * 70) * 0.006 * Math.max(0, 1 - (t - 21.7) * 1.2) : 0;
    return { modem: true,
      fx: t > 21.65 ? [{ type: "horn", t: ((t - 21.65) % 0.6) / 0.6, pos: [-1.72, 0.74, 0.63], scale: 0.22 }] : [],
      cam: keys(t, [[20.8, [-1.25, 1.0 + sh, 0.55], [-1.79, 0.79, 0.63], 38], [22.6, [-1.42, 0.92 + sh, 0.6], [-1.79, 0.79, 0.63], 34]], 0.003) };
  } },
  { t0: 22.6, t1: 25, fn: (t) => ({ lap: 4, term: 9, dark: 0.55 * seg(t, 22.6, 23.0), vig: 0.7,
    actors: [hero({ expr: "dazed", blink: blink(t, 3) }, { tint: [0.85, 1.0, 1.08] })],
    cam: keys(t, [[22.6, [-0.2, 1.35, 0.6], [-0.6, 1.2, -1.3], 38], [25, [-0.28, 1.36, 0.3], [-0.6, 1.25, -1.3], 36]], 0.004),
    overlay: (g, W, H) => title(g, W, H, t) }) },
];
export const shotAt = (t) => SHOTS.find((s) => t < s.t1) || SHOTS[SHOTS.length - 1];
function title(g, W, H, t) {
  const k = H / 1080, sc = (t0) => (t < t0 ? 0 : back(cl((t - t0) / 0.35)));
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const txt = (s, size, y, fill) => { g.font = `900 ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.18; g.strokeStyle = "#140c16"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  const a = sc(22.75), b = sc(23.2);
  if (a > 0) { g.save(); g.translate(W / 2, H * 0.4); g.scale(a * k, a * k); txt("E SE VOCÊ ACORDASSE", 96, 0, "#ffffff"); g.restore(); }
  if (b > 0) { g.save(); g.translate(W / 2, H * 0.57); g.scale(b * k, b * k); txt("EM 2001?", 190, 0, "#ffd23f"); g.restore(); }
}
