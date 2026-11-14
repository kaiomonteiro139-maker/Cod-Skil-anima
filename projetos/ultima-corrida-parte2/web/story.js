// Shot plan for "A Última Corrida" (Parte 2). Times are the voiceover's word times (seconds).
export const FPS = 30;
export const TOTAL = Math.round(38.0 * FPS); // 34.2 s of voice + hold on the poll
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


const J = [IX + 1.75, 0, -1.15];                    // Júlia behind the table, by the pot
const POT = [IX + 1.85, 0.97, 0.0];
const JT = [0.82, 0.92, 0.86];
const hit = (t, x, d = 0.18) => t > x && t < x + d;
const shake = (t, xs, a = 0.012) => { let s = 0; for (const x of xs) if (t > x && t < x + 0.25) s += Math.sin((t - x) * 70) * a * (1 - (t - x) / 0.25); return s; };

export const SHOTS = [
  { t0: 0, t1: 1.4, name: "recap", fn: (t) => ({ light: "inside", chair: 1, pend: 0.75, vig: 0.9, dark: 0.45,
      actors: [{ id: "julia", pos: J, opts: { expr: "creepy", seed: 8, headTilt: 5 }, tint: [0.8, 0.66, 0.64] }],
      cam: keys(t, [[0, [IX - 0.2, 1.65, 2.3], [IX + 1.1, 1.05, -1.0], 37], [1.4, [IX - 0.1, 1.62, 2.1], [IX + 1.1, 1.05, -1.0], 35]]),
      overlay: (g, W, H) => recap(g, W, H, t) }) },
  { t0: 1.4, t1: 3.6, name: "decide", fn: (t) => {
      const turn = t > 3.1;
      return { light: "inside", chair: 1, pend: 0.85,
        actors: [{ id: "moto", pos: [IX + 0.45, 0, 1.75], opts: turn ? { back: true, seed: 3, mode: "stand" } : { expr: t < 2.2 ? "worried" : "stern", seed: 3, blink: blink(t, 4), look: t < 2.2 ? 1 : 0 } }],
        cam: keys(t, [[1.4, [IX + 0.9, 1.5, 0.15], [IX + 0.45, 1.35, 1.75], 40], [3.6, [IX + 0.75, 1.48, 0.55], [IX + 0.45, 1.38, 1.75], 36]], 0.006) };
    } },
  { t0: 3.6, t1: 5.62, name: "toDoor", fn: (t) => {
      const w = seg(t, 3.62, 5.4, (x) => x), mp = L3([IX + 0.45, 0, 1.75], [IX + 0.52, 0, 3.35], ss(w));
      return { light: "inside", pend: 0.85, keyGone: true,
        actors: [{ id: "moto", pos: mp, opts: { mode: w < 1 ? "stroll" : "stand", phase: w * 3.4, back: true, seed: 3 } }],
        cam: keys(t, [[3.6, [IX + 0.62, 1.62, 0.2], [IX + 0.5, 1.15, 4.0], 42], [5.62, [IX + 0.6, 1.58, 1.75], [IX + 0.5, 1.1, 4.0], 40]]) };
    } },
  { t0: 5.62, t1: 6.7, name: "locked", fn: (t) => {
      const xs = [5.66, 5.95, 6.25], sh = shake(t, xs, 0.006);
      return { light: "inside", pend: 0.9, keyGone: true, idoor: shake(t, xs, 0.004),
        fx: xs.filter((x) => hit(t, x, 0.3)).map((x) => ({ type: "click", t: (t - x) / 0.3, pos: [IX + 0.87, 1.0, 3.8], scale: 0.1 })),
        cam: keys(t, [[5.62, [IX + 0.72 + sh, 1.1, 3.38], [IX + 0.87, 1.04, 3.86], 34, 0, eo], [6.7, [IX + 0.75 + sh, 1.09, 3.45], [IX + 0.87, 1.04, 3.86], 32, 2]], 0.003) };
    } },
  { t0: 6.7, t1: 9.1, name: "fdp", fn: (t) => {
      const mad = t > 6.72;
      return { light: "inside", pend: 0.9, keyGone: true,
        actors: [{ id: "moto", pos: [IX + 0.5, 0, 3.3], opts: { expr: mad ? "angry" : "worried", seed: 3, blink: blink(t, 4), headTilt: mad ? 3 * Math.sin(t * 9) * Math.max(0, 1 - (t - 6.7)) : 0 } }],
        cam: keys(t, [[6.7, [IX + 0.62, 1.47, 2.05], [IX + 0.5, 1.4, 3.3], 40, 0, eo], [7.4, [IX + 0.58, 1.46, 2.35], [IX + 0.5, 1.42, 3.3], 36, -2, eo], [9.1, [IX + 0.56, 1.46, 2.5], [IX + 0.5, 1.43, 3.3], 33, -3]], 0.006) };
    } },
  { t0: 9.1, t1: 13.15, name: "keyPot", fn: (t) => {
      const holding = t < 11.0, fly = seg(t, 11.0, 11.6, (x) => x);
      const hand = add3(J, [0.27, 1.5, 0.06]);
      const kp = holding ? add3(hand, [0, -0.06, 0]) : [lerp(hand[0], POT[0], fly), lerp(hand[1], POT[1], fly) + Math.sin(fly * Math.PI) * 0.35, lerp(hand[2], POT[2], fly)];
      const fx = [];
      if (t < 11.6) fx.push({ type: "key", t: 0, pos: kp, scale: 0.24, roll: holding ? 0.45 * Math.sin((t - 9.1) * 7) : fly * 9 });
      if (t > 11.6 && t < 12.5) fx.push({ type: "splash", t: (t - 11.6) / 0.9, pos: [POT[0], POT[1] - 0.1, POT[2]], scale: 0.3 });
      fx.push({ type: "wisp", t: t - 9.1, col: "#f4f1ea", pos: [POT[0], POT[1] - 0.02, POT[2]], scale: t > 11.6 ? 0.5 : 0.3, alpha: t > 11.6 ? 0.95 : 0.6 });
      return { light: "inside", pend: 0.9, keyGone: true, fx,
        actors: [{ id: "julia", pos: J, opts: { expr: t < 10.9 ? "creepy" : "smile", seed: 8, blink: blink(t, 2), wave: holding ? 0.5 + 0.5 * Math.sin((t - 9.1) * 7) : undefined, headTilt: holding ? 4 : 0 }, tint: JT }],
        cam: keys(t, [[9.1, [IX + 0.65, 1.5, 1.7], [IX + 1.75, 1.35, -1.0], 40], [10.95, [IX + 0.85, 1.5, 1.25], [IX + 1.8, 1.35, -1.0], 38], [11.7, [IX + 1.45, 1.4, 0.95], [POT[0], 0.92, POT[2]], 38, 0, eo], [13.15, [IX + 1.55, 1.32, 0.75], [POT[0], 0.92, POT[2]], 34, 2]]) };
    } },
  { t0: 13.15, t1: 15.8, name: "delivered", fn: (t) => {
      const vib = t > 13.6 && t < 14.45 ? Math.sin(t * 95) * 0.004 : 0;
      return { light: "inside", pend: 0.85, screen: "delivered", notifT: seg(t, 14.45, 14.85, (x) => x), hphone: [IX + 0.22 + vib, 1.32, 1.72],
        fx: t > 13.6 && t < 14.45 ? [{ type: "buzz", t: t - 13.6, pos: [IX + 0.22, 1.24, 1.74], scale: 0.18 }] : [],
        actors: [{ id: "moto", pos: [IX + 0.2, 0, 1.15], opts: { expr: t > 15.0 ? "shock" : "worried", seed: 3, prop: "phone", blink: blink(t, 4) } }],
        cam: keys(t, [[13.15, [IX + 0.27, 1.43, 2.3], [IX + 0.22, 1.32, 1.72], 40], [15.8, [IX + 0.25, 1.4, 2.06], [IX + 0.22, 1.32, 1.72], 36]], 0.004) };
    } },
  { t0: 15.8, t1: 17.9, name: "bag", fn: (t) => ({ light: "inside", pend: 0.9, mybag: [IX + 1.78, 0.775, 0.55],
      fx: [{ type: "wisp", t: t - 15.8, col: "#f4f1ea", pos: [IX + 1.78, 1.0, 0.55], scale: 0.32, alpha: 0.8 }],
      cam: keys(t, [[15.8, [IX + 1.7, 1.35, 1.55], [IX + 1.78, 0.92, 0.55], 40], [17.9, [IX + 1.74, 1.18, 1.3], [IX + 1.78, 0.9, 0.55], 36]], 0.004) }) },
  { t0: 17.9, t1: 20.6, name: "whatWasDelivered", fn: (t) => {
      if (t < 19.35) return { light: "inside", pend: 0.8, vig: 0.8,
        actors: [{ id: "moto", pos: [IX + 0.2, 0, 1.4], opts: { expr: t < 18.75 ? "worried" : "scared", seed: 3, blink: blink(t, 4) } }],
        cam: keys(t, [[17.9, [IX + 0.22, 1.47, 0.3], [IX + 0.2, 1.45, 1.4], 40], [19.35, [IX + 0.22, 1.47, 0.55], [IX + 0.2, 1.45, 1.4], 35]], 0.004) };
      return { light: "inside", pend: 0.8, vig: 0.85,
        cam: keys(t, [[19.35, [IX - 1.0, 1.9, 1.0], [IX - 3.7, 1.7, 0.3], 44, 0, eo], [20.6, [IX - 2.3, 2.1, 1.35], [IX - 3.72, 2.0, 1.2], 40, -3]], 0.01) };
    } },
  { t0: 20.6, t1: 23.75, name: "knocks", fn: (t) => {
      const xs = [21.95, 22.3, 22.65];
      const bump = xs.reduce((a, x) => a + (t > x && t < x + 0.16 ? 0.025 * Math.sin(((t - x) / 0.16) * Math.PI) : 0), 0);
      const sh = shake(t, xs, 0.015);
      return { light: "inside", pend: 0.7, vig: 0.85, trapBump: bump, trapGlow: bump * 30,
        fx: xs.map((x, i) => (t > x && t < x + 0.9 ? { type: "toc", t: t - x, pos: [IX - 1.4 + [-0.06, 0.05, -0.02][i], 0.08 + i * 0.17, 1.9], scale: 0.24 } : null)).filter(Boolean),
        cam: keys(t, [[20.6, [IX - 1.0, 1.05 + sh, 3.5], [IX - 1.4, 0.0, 1.7], 44], [23.75, [IX - 1.15, 0.8 + sh, 3.1], [IX - 1.4, 0.0, 1.75], 40]], 0.004) };
    } },
  { t0: 23.75, t1: 25.9, name: "voiceBelow", fn: (t) => ({ light: "inside", pend: 0.55, vig: 0.9, trapGlow: 0.6 + 0.3 * Math.sin(t * 9),
      actors: [{ id: "moto", pos: [IX - 0.85, 0, 1.15], opts: { expr: t < 24.6 ? "scared" : "worried", seed: 3, blink: blink(t, 4), look: -1 }, tint: [0.62, 0.95, 0.7] }],
      cam: keys(t, [[23.75, [IX - 1.3, 0.3, 2.05], [IX - 0.85, 1.25, 1.15], 46], [25.9, [IX - 1.25, 0.38, 1.9], [IX - 0.85, 1.3, 1.15], 42, 3]], 0.004) }) },
  { t0: 25.9, t1: 30.62, name: "stopsSmiling", fn: (t) => {
      const cold = t > 26.8, fl = t > 27.9 && t < 28.9 ? (Math.sin(t * 41) > 0.2 ? 0.25 : 1) : 1;
      return { light: "inside", pend: 0.85 * fl, kit: 1.2, vig: 0.85, chair: 1,
        actors: [{ id: "julia", pos: J, opts: { expr: cold ? "cold" : "creepy", seed: 8, blink: !cold && blink(t, 2), headTilt: t > 29.0 ? 7 * seg(t, 29.0, 29.6) : 0 }, tint: [0.84, 0.7, 0.68] }],
        cam: keys(t, [[25.9, [IX + 0.95, 1.42, 0.85], [IX + 1.75, 1.32, -1.15], 40], [26.8, [IX + 1.15, 1.42, 0.45], [IX + 1.75, 1.36, -1.15], 38], [30.62, [IX + 1.45, 1.42, -0.2], [IX + 1.75, 1.38, -1.15], 33, -5, (x) => x]], 0.004) };
    } },
  { t0: 30.62, t1: 39, name: "poll", fn: (t) => ({ light: "inside", chair: 1, pend: 0.75, vig: 0.9, dark: 0.45 * seg(t, 30.62, 31.3), trapGlow: 0.5 + 0.3 * Math.sin(t * 5),
      actors: [
        { id: "julia", pos: J, opts: { expr: "cold", seed: 8, headTilt: 5 }, tint: [0.8, 0.66, 0.64] },
        { id: "moto", pos: [IX - 0.35, 0, 1.9], opts: { back: true, seed: 3 } }],
      cam: keys(t, [[30.62, [IX - 0.1, 2.0, 3.6], [IX + 0.1, 0.75, 0.2], 50], [38, [IX - 0.05, 1.95, 3.3], [IX + 0.1, 0.75, 0.2], 47]]),
      overlay: (g, W, H) => poll(g, W, H, t) }) },
];
export const shotAt = (t) => SHOTS.find((s) => t < s.t1) || SHOTS[SHOTS.length - 1];

// ---------------- recap stamp + end-card poll (on-screen text) ----------------
function recap(g, W, H, t) {
  const k = W / 1080, s = t < 0.05 ? 0 : back(cl((t - 0.05) / 0.35));
  if (s <= 0) return;
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  pop(g, W, W / 2, H * 0.3, s * k, () => {
    g.fillStyle = "#140c16"; rr(g, -230, -95, 460, 190, 46); g.fill();
    g.fillStyle = "#e5483b"; rr(g, -216, -81, 432, 162, 38); g.fill();
    g.font = `900 110px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = 20; g.strokeStyle = "#140c16"; g.strokeText("SAI", -40, 6); g.fillStyle = "#fff"; g.fillText("SAI", -40, 6);
    g.strokeStyle = "#140c16"; g.lineWidth = 34; g.lineCap = "round"; g.beginPath(); g.moveTo(95, 0); g.lineTo(130, 40); g.lineTo(190, -45); g.stroke();
    g.strokeStyle = "#ffd23f"; g.lineWidth = 18; g.stroke(); });
}
function pop(g, W, x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); fn(); g.restore(); }
function poll(g, W, H, t) {
  const k = W / 1080;
  const sc = (t0) => (t < t0 ? 0 : back(cl((t - t0) / 0.35)));
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const txt = (s, size, y, fill) => { g.font = `900 ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.2; g.strokeStyle = "#140c16"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  const a = sc(30.66);
  if (a > 0) pop(g, W, W / 2, H * 0.19, a * k, () => { txt("VOCÊ DESCE", 112, -66, "#ffffff"); txt("OU VOLTA?", 140, 70, "#ffd23f"); });
  const btn = (t0, y, label, col, sub) => { const s = sc(t0); if (s <= 0) return;
    pop(g, W, W / 2, y, s * k, () => {
      g.fillStyle = "#140c16"; rr(g, -440, -78, 880, 156, 40); g.fill();
      g.fillStyle = col; rr(g, -427, -65, 854, 130, 32); g.fill();
      txt(label, 72, 2, "#ffffff"); }); };
  btn(30.82, H * 0.355, "A) DESCE PRO PORÃO", "#2fb36a");
  btn(32.24, H * 0.455, "B) VOLTA PRA MESA", "#e5483b");
  const r = sc(33.32);
  if (r > 0) pop(g, W, W * 0.66, H * 0.512, r * k, () => { g.rotate(-0.05); txt("(SÓ NA RESENHA)", 58, 0, "#ffd23f"); });
  const c = sc(34.3);
  if (c > 0) pop(g, W, W / 2, H * 0.6, c * k, () => { txt("COMENTA AÍ ↓", 64, 0, "#ffffff"); txt("A MAIORIA DECIDE A PARTE 3", 42, 72, "#ffd23f"); });
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
