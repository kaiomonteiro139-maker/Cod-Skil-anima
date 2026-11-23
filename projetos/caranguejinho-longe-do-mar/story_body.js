// Shot plan — "O caranguejinho longe do mar". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const CP = [0, 0, 0.6];
const tWave = wt("seguiu", L.L4) + 0.05;
const wave = (t) => t < tWave ? 0 : 0.85 * ease(lin(t, tWave, tWave + 1.4));
const hot = (o = {}) => ({ pos: CP, yaw: 0.2, hot: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.45 + 0.3 * Math.sin(t * 8), wave: 0, crab: hot(), cam: push(t, 0, L.L2, [0.15, 0.45, 1.5], [0, 0.22, CP[2]], [0.12, 0.4, 1.25], [0, 0.22, CP[2]], 44, 40) }));
  // the sea is too far: camera behind the crab looking at the distant water
  shot(L.L2, (t) => ({ red: 0.2, wave: 0, crab: hot({ yaw: Math.PI }), cam: push(t, L.L2, L.L3, [0.3, 0.7, 2.2], [0, 0.2, -4], [0.25, 0.6, 1.8], [0, 0.15, -4], 48, 46) }));
  shot(L.L3, (t) => ({ wave: 0, crab: hot({ yaw: -0.3, hot: 0.9 }), cam: push(t, L.L3, L.L4, [-0.9, 0.6, 1.8], [0, 0.22, CP[2]], [-0.75, 0.55, 1.55], [0, 0.22, CP[2]], 46, 44) }));
  shot(L.L4, (t) => { const on = t > tWave + 0.8; return { wave: wave(t), crab: { pos: CP, yaw: on ? Math.PI * 0.9 : 0.2, hot: on ? 0.2 : 1, dance: on, happy: on ? 1 : 0 }, cam: push(t, L.L4, L.L5, [1.6, 1.1, 2.4], [0, 0.15, -0.6], [1.4, 1.0, 2.1], [0, 0.15, -0.6], 50, 48) }; });
  shot(L.L5, (t) => ({ wave: wave(t), crab: { pos: CP, yaw: Math.PI * 0.9, hot: 0.4, happy: 0 }, cam: push(t, L.L5, L.L6, [0.8, 0.9, 2.2], [0, 0.15, -0.4], [2.2, 2.8, 4.4], [0, 0, -1.2], 46, 48) }));
  shot(L.L6, (t) => ({ wave: wave(t), crab: { pos: CP, yaw: 0, hot: 0.6, happy: 0 }, cam: push(t, L.L6, VEND + 2.2, [0.05, 0.4, 1.35], [0, 0.24, CP[2]], [0.04, 0.38, 1.15], [0, 0.24, CP[2]], 42, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tWave ? 0.01 : lerp(0.01, 0.05, ease(lin(t, tWave, tWave + 1.4))), icon: "🌊", label: "MAR:", numX: 280, col: "#2a9ad8" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 ONDA 🌊", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 ONDAS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tWave - 0.35, tWave - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
