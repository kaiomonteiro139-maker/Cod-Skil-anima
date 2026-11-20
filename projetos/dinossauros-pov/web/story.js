// POV shot plan for "E se você acordasse na época dos dinossauros?" — times in seconds (line starts from lines.json).
export const FPS = 30;
export const TOTAL = Math.round(87 * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b, e = ss) => e(cl((t - a) / (b - a)));
const PI = Math.PI;
/** piecewise smooth keys: K = [[t, value(array)]...] */
function track(t, K) { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return L3(va, vb, ss((t - a) / (b - a))); } return K[K.length - 1][1]; }
const shake = (t, hits, amp = 0.02, d = 0.35) => { let s = 0; for (const h of hits) if (t > h && t < h + d) s += Math.sin((t - h) * 60) * amp * (1 - (t - h) / d); return s; };

// ---------- arm poses (camera space; arm local +y = fingers, -y = elbow) ----------
const POSE = {
  low: { L: [[-0.26, -0.5, -0.36], [-1.0, PI, 0.25]], R: [[0.26, -0.5, -0.36], [-1.0, PI, -0.25]] },
  idle: { L: [[-0.21, -0.39, -0.36], [-1.05, PI, 0.3]], R: [[0.21, -0.39, -0.36], [-1.05, PI, -0.3]] },
  shield: { L: [[-0.1, -0.1, -0.3], [0.2, PI, 0.22]], R: [[0.11, -0.09, -0.3], [0.2, PI, -0.22]] },
  push: { L: [[-0.26, -0.46, -0.28], [-1.25, PI, 0.1]], R: [[0.26, -0.46, -0.28], [-1.25, PI, -0.1]] },
  cup: { L: [[-0.08, -0.2, -0.2], [0.5, 0.4, -0.5]], R: [[0.08, -0.2, -0.2], [0.5, -0.4, 0.5]] },
  reach: { L: [[-0.26, -0.5, -0.36], [-1.0, PI, 0.25]], R: [[0.1, -0.2, -0.42], [-1.6, 0, 0.1]] },
  log: { L: [[-0.19, -0.27, -0.42], [-1.45, PI, 0.12]], R: [[0.2, -0.28, -0.42], [-1.45, PI, -0.12]] },
  palms: { L: [[-0.11, -0.22, -0.34], [-0.3, 0, 0.25]], R: [[0.11, -0.22, -0.34], [-0.3, 0, -0.25]] },
  guard: { L: [[-0.05, -0.24, -0.3], [0.3, PI, 0.35]], R: [[0.2, -0.22, -0.31], [0.3, PI, -0.3]] },
};
function arms(t, K, trem = 0) {
  let i = 0; while (i < K.length - 1 && t >= K[i + 1][0]) i++;
  const [ta, pa] = K[i], nx = K[i + 1]; const u = nx ? seg(t, nx[0] - 0.55, nx[0]) : 0; const pb = nx ? nx[1] : pa;
  const out = {};
  for (const s of ["L", "R"]) { const A = POSE[pa][s], B = POSE[pb][s]; const p = L3(A[0], B[0], u), r = L3(A[1], B[1], u);
    const k = trem * (s === "L" ? 1 : 1.3); p[0] += Math.sin(t * 31 + (s === "L" ? 0 : 2)) * 0.004 * k; p[1] += Math.sin(t * 27 + 1) * 0.004 * k;
    out[s] = { p, r }; }
  return out;
}
// head motion: breathing bob + small sway
const bob = (t, a = 1) => [Math.sin(t * 1.3) * 0.006 * a, Math.sin(t * 2.4) * 0.008 * a, 0];

// ---------- creatures ----------
const pteros = (t) => [0, 1, 2, 3].map((i) => { const u = (t * 0.07 + i * 0.11) % 1; return { pos: [lerp(-30, 40, u) + i * 5, 13 + i * 2 + Math.sin(t * 0.5 + i) * 1.5, -24 - i * 6], yaw: PI / 2, bank: 0.1 * Math.sin(t + i), flap: t * 5 + i * 1.7 }; });
const raptorsAt = (t) => [0, 1, 2].map((i) => { const t0 = 36.0 + i * 0.75, u = (t - t0) / 2.2; if (u < 0 || u > 1) return null;
  return { pos: [lerp(-9, 9, u), 0, -2.4 - i * 0.7], yaw: PI / 2, phase: (t - t0) * 16 }; });
const MOMP = { pos: [-3.9, 0, -6.0], yaw: 0.9, neck: 0.35, head: 0.5 };
const NESTP = [-2.6, 0, -4.9];

// ---------- the timeline ----------
export function stateAt(t) {
  const st = { light: "day", vig: 0.5 };
  if (t < 12.7) { // lying on the ground, the head right next to your face (profile), then it roars and leaves
    const sn = shake(t, [3.0], 0.03) + shake(t, [7.0, 7.4, 7.8, 8.2, 8.6], 0.025, 0.4) + shake(t, [10.6, 11.35, 12.1], 0.04, 0.4);
    const look = track(t, [[0, [-0.55, 0.85, -1.6]], [6.4, [-0.5, 0.85, -1.6]], [7.0, [-0.3, 1.0, -1.6]], [9.0, [-0.3, 1.0, -1.6]], [10.6, [-0.3, 2.6, -2.0]], [12.7, [0.0, 2.6, -2.4]]]);
    st.cam = { pos: [0 + sn, 0.3 + bob(t, 2)[1], 0.2], look: [look[0] + sn * 2, look[1], look[2]], fov: 78, roll: sn * 40 };
    const hp = track(t, [[0, [-1.55, 0.85, -1.6]], [2.4, [-1.45, 0.82, -1.5]], [3.0, [-1.25, 0.76, -1.35]], [6.4, [-1.3, 0.78, -1.4]], [7.0, [-1.1, 1.0, -1.95]], [9.0, [-1.1, 1.05, -2.0]], [10.4, [-1.6, 4.6, -3.8]], [12.7, [-2, 6.5, -6]]]);
    const yaw = track(t, [[0, [1.15]], [6.4, [1.1]], [7.0, [0.6]], [9.0, [0.6]], [10.4, [0.9]]])[0];
    const pitch = track(t, [[0, [0.12]], [3.0, [0.18]], [6.4, [0.12]], [7.0, [0.05]], [9.0, [0.0]], [10.4, [-0.4]]])[0];
    const sniff = t < 6.4 ? Math.sin(t * 4.2) * 0.015 : 0;
    const roar = t > 6.9 && t < 9.0 ? seg(t, 6.9, 7.2) * (1 - seg(t, 8.7, 9.0)) : 0;
    st.head = { pos: [hp[0] + (roar ? Math.sin(t * 22) * 0.03 : 0), hp[1] + sniff, hp[2]], yaw: yaw + (roar ? Math.sin(t * 9) * 0.06 : 0), pitch, roll: roar ? Math.sin(t * 7) * 0.05 : 0,
      jaw: 0.05 + 0.04 * Math.sin(t * 3) + (t > 2.95 && t < 3.25 ? 0.12 : 0) + roar * 0.7 };
    st.arms = arms(t, [[0, "low"], [3.3, "guard"], [10.6, "low"]], t < 10.8 ? 1.5 : 0.4);
    st.dark = t < 0.25 ? 0.55 : t < 0.5 ? 0.9 : t < 0.9 ? 0.9 * (1 - seg(t, 0.5, 0.9)) : 0;
    st.vig = 0.75;
    return st;
  }
  // T-rex walks away (seen once you sit up), from z -9 to -30
  const trexWalk = (t) => { const u = cl((t - 10.5) / 9); return { pos: [0.4, 0, lerp(-9, -30, u)], yaw: PI, walk: t < 19.5 ? 1 : 0, phase: (t - 10.5) * 2.6, headPitch: 0.15 }; };
  if (t < 25.0) { // sit up, stand, look around: volcano, pteros
    const p = track(t, [[12.7, [0, 0.32, 0.15]], [13.8, [0, 0.85, 0.1]], [17.0, [0, 0.85, 0.1]], [18.0, [0, 1.62, 0.1]]]);
    const lk = track(t, [[12.7, [0, 2.6, -2.2]], [13.8, [0.2, 2.2, -8]], [16.8, [0.3, 2.6, -14]], [18.2, [0, 1.75, -6]], [19.6, [-1.6, 1.85, -5.2]], [20.6, [-3.2, 3.0, -5.2]], [22.0, [-3.1, 3.1, -5.4]], [23.0, [0.6, 3.8, -4.5]], [25.0, [1.6, 3.9, -4.3]]]);
    const b = bob(t, t > 18 ? 1.5 : 1);
    st.cam = { pos: [p[0] + b[0], p[1] + b[1], p[2]], look: lk, fov: 76 };
    st.trex = t < 21 ? trexWalk(t) : null; st.pteros = t > 19 ? pteros(t) : null;
    st.arms = arms(t, [[12.7, "low"], [12.9, "push"], [17.2, "push"], [18.0, "idle"]], 0.4);
    return st;
  }
  if (t < 35.3) { // "Alô?" — nobody; the little mammal at the burrow
    const crouch = seg(t, 31.2, 32.2);
    const p = L3([0, 1.62, 0.1], [1.05, 0.7, 0.3], crouch);
    const lk = track(t, [[25.0, [1.6, 3.9, -4.3]], [25.8, [0, 1.8, -6]], [27.6, [-2.5, 1.7, -5]], [29.0, [2.0, 1.6, -5]], [30.4, [2.0, 1.0, -2.0]], [31.2, [1.5, 0.15, -0.3]], [32.2, [1.5, 0.12, -0.28]], [35.3, [1.5, 0.12, -0.28]]]);
    const b = bob(t, 1.4); st.cam = { pos: [p[0] + b[0], p[1] + b[1], p[2]], look: lk, fov: 76 };
    st.pteros = pteros(t);
    const em = seg(t, 30.5, 31.3); st.mammal = em > 0 ? { pos: [1.47, 0.02 + em * 0.08 - 0.08, -0.25 + em * 0.04], yaw: -0.7 + Math.sin(t * 3) * 0.2, pitch: -0.25 + Math.sin(t * 6) * 0.05 } : null;
    st.arms = arms(t, [[25.0, "idle"], [25.4, "cup"], [27.6, "idle"], [32.5, "reach"]], 0.4);
    return st;
  }
  if (t < 40.9) { // raptors! duck behind the log
    const duck = seg(t, 35.5, 36.0);
    const p = L3([1.05, 0.7, 0.3], [-0.45, 0.74, -0.32], duck);
    const lk = t < 35.5 ? L3([1.5, 0.12, -0.28], [-4, 0.8, -5], seg(t, 35.3, 35.5)) : track(t, [[35.5, [-4, 0.9, -5]], [36.2, [-3, 0.85, -5]], [37.3, [-1, 0.85, -5]], [38.6, [1.5, 0.85, -5.5]], [40.9, [3, 0.85, -5.5]]]);
    const b = bob(t, 2.2); st.cam = { pos: [p[0] + b[0], p[1] + b[1], p[2]], look: lk, fov: 76 };
    st.mammal = t < 35.4 ? { pos: [1.47, 0.02 - seg(t, 35.3, 35.4) * 0.1, -0.21], yaw: -0.7 } : null;
    st.raptors = raptorsAt(t); st.log = true;
    st.arms = arms(t, [[35.3, "reach"], [35.9, "log"]], 1.2);
    st.dark = seg(t, 40.6, 40.9, (x) => x);
    return st;
  }
  // ---------------- nights ----------------
  st.light = "night"; st.vig = 0.7;
  const skyLook = [0.28 * 6, 1.62 + 0.62 * 6, -6];
  const blackout = (a, b) => (t >= a && t < b ? 1 : 0);
  if (t < 50.4) { // night 1
    const lk = track(t, [[41.4, [0, 2.2, -6]], [43.5, [0.6, 3.2, -6]], [45.6, [1.4, 5.0, -6]], [50.4, [1.6, 5.3, -6]]]);
    const b = bob(t); st.cam = { pos: [0 + b[0], 1.62 + b[1], 0.1], look: lk, fov: lerp(76, 62, seg(t, 46.4, 50)) };
    st.ast = t > 45.6 ? 0.05 + 0.015 * Math.sin(t * 8) : 0;
    st.arms = arms(t, [[41, "low"]], 0); st.dark = Math.max(blackout(40.9, 41.5), 1 - seg(t, 41.5, 42.0, (x) => x), seg(t, 50.0, 50.4, (x) => x));
    return st;
  }
  if (t < 55.6) { // night 2
    const b = bob(t); st.cam = { pos: [0.1 + b[0], 1.62 + b[1], 0.1], look: [1.5, 5.2, -6], fov: lerp(66, 58, seg(t, 51, 55.6)) };
    st.ast = 0.13 + 0.015 * Math.sin(t * 6); st.arms = arms(t, [[50, "low"]], 0);
    st.dark = Math.max(blackout(50.4, 51.0), 1 - seg(t, 51.0, 51.4, (x) => x), seg(t, 55.2, 55.6, (x) => x));
    return st;
  }
  // night 3: the rock with a tail, red horizon, then the nest / burrow / hands
  st.sky = ["#120a1e", "#3a1a2a", "#7a3420"]; st.fogc = 0x1a0c10; st.tint = [1.0, 0.85, 0.85];
  const grow = seg(t, 56.0, 81.5, (x) => x);
  st.ast = 0.3 + 0.55 * grow; st.astLight = 1.5 + 6 * grow;
  const quake = t > 64 ? 0.004 + 0.012 * seg(t, 64, 81.5, (x) => x) : 0; const qx = Math.sin(t * 43) * quake, qy = Math.sin(t * 37 + 1) * quake;
  const b = bob(t, 1.3);
  const lk = track(t, [[56.0, [1.5, 5.2, -6]], [63.4, [1.6, 5.4, -6]], [66.0, [0.6, 3.0, -6]], [68.5, [0, 1.6, -6]], [70.4, [-1.6, 1.3, -5.0]], [71.6, [-2.6, 0.4, -4.9]], [73.4, [-2.6, 0.4, -4.9]], [74.4, [1.5, 0.1, -0.3]], [77.2, [1.5, 0.1, -0.3]], [78.2, [-2.0, 0.2, -4.2]], [79.4, [-2.0, 0.2, -4.2]], [80.2, [0, 0.4, -0.9]]]);
  st.cam = { pos: [0 + b[0] + qx, 1.62 + b[1] + qy - 0.3 * seg(t, 79.4, 80.4), 0.1], look: lk, fov: t < 63.4 ? lerp(60, 52, seg(t, 56, 63.4)) : lerp(52, 76, seg(t, 63.4, 66)), roll: qx * 60 };
  st.mom = MOMP; const fallen = t > 77.5;
  st.baby = fallen ? { pos: [-1.9, 0.05, -4.1], yaw: 0.6, roll: 1.1, neck: -0.2, head: Math.sin(t * 9) * 0.3 } : { pos: [NESTP[0] + 0.25, 0.08, NESTP[2] + 0.3], yaw: 0.4 + Math.sin(t * 2) * 0.3, neck: -0.2, head: -0.3 + Math.sin(t * 6) * 0.15 };
  const mIn = seg(t, 76.4, 77.0); st.mammal = t > 73.0 ? { pos: [1.47, 0.02 - mIn * 0.12, -0.21], yaw: -1.0 + Math.sin(t * 4) * 0.2, pitch: -0.3 } : null;
  st.arms = arms(t, [[56, "low"], [79.6, "palms"]], t > 79 ? 2.2 : 0.5);
  st.flash = 0.08 * seg(t, 72, 81.5, (x) => x * x) + (t > 79.5 ? 0.12 * seg(t, 79.5, 81.6) : 0);
  st.dark = Math.max(blackout(55.6, 56.0), 1 - seg(t, 56.0, 56.4, (x) => x));
  if (t >= 81.8) { // end-card poll over the blurred, darkened last frame
    st.blur = 14; st.dark = 0.5 * seg(t, 81.8, 82.3); st.overlay = (g, W, H, tt) => poll(g, W, H, tt);
  }
  return st;
}

// ---------------- end-card poll (format from docs/ESTILO_POV.md) ----------------
const back = (x) => { x = cl(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function poll(g, W, H, t) {
  const k = W / 1080, sc = (a) => (t < a ? 0 : back((t - a) / 0.35));
  const T = (s, size, y, fill, weight = 800) => { g.font = `${weight} ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.14; g.strokeStyle = "rgba(10,8,12,0.9)"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  const pop = (x, y, s, fn) => { if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s * k, s * k); fn(); g.restore(); };
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  pop(W / 2, H * 0.25, sc(82.0), () => { T("66 MILHÕES DE ANOS · EP. 01", 40, -90, "#5fe08a", 700); T("O que você faria?", 92, 10, "#ffffff"); });
  const btn = (a, y, letter, label, filled) => pop(W / 2, y, sc(a), () => {
    if (filled) { g.fillStyle = "#e5483b"; rr(g, -440, -78, 880, 156, 34); g.fill(); }
    else { g.fillStyle = "rgba(16,20,24,0.92)"; rr(g, -440, -78, 880, 156, 34); g.fill(); g.strokeStyle = "#5fe08a"; g.lineWidth = 7; rr(g, -440, -78, 880, 156, 34); g.stroke(); }
    g.fillStyle = filled ? "#ffffff" : "#5fe08a"; g.beginPath(); g.arc(-360, 0, 46, 0, 7); g.fill();
    g.fillStyle = filled ? "#e5483b" : "#101418"; g.font = `900 56px "DejaVu Sans", Arial, sans-serif`; g.fillText(letter, -360, 3);
    g.textAlign = "left"; g.font = `800 48px "DejaVu Sans", Arial, sans-serif`; g.fillStyle = "#ffffff"; g.fillText(label, -290, 3); g.textAlign = "center"; });
  btn(82.6, H * 0.42, "A", "Corre pra toca e se salva", true);
  btn(83.1, H * 0.52, "B", "Volta pra salvar o filhote", false);
  pop(W / 2, H * 0.635, sc(83.7), () => { T("Comenta A ou B ▼", 62, 0, "#ffffff"); T("a maioria decide o Ep. 02", 40, 72, "#cfd6df", 600); });
}
