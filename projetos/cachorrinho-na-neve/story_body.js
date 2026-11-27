// Shot plan — "O cachorrinho na neve". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const PP = [0, 0, 0.45];
const tWarm = wt("seguiu", L.L4) + 0.05;
const H = [0, 0.82, 0.62];
const sad = (o = {}) => ({ pos: PP, yaw: 0, sit: 1, sad: 1, ears: -1, shiver: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.35 + 0.25 * Math.sin(t * 8), pup: sad({ headPitch: 0.15 }), cam: push(t, 0, L.L2, [0.15, 0.95, 2.05], H, [0.1, 0.9, 1.8], H, 42, 38) }));
  shot(L.L2, (t) => ({ red: 0.15, pup: sad({ headYaw: Math.sin(t * 1.5) * 0.5 }), cam: push(t, L.L2, L.L3, [2.2, 1.8, 3.8], [0, 0.6, 0], [1.8, 1.6, 3.2], [0, 0.6, 0], 48, 45) }));
  shot(L.L3, (t) => ({ pup: sad({ headPitch: -0.15 }), cam: push(t, L.L3, L.L4, [-1.0, 1.0, 2.0], [0, 0.7, 0.4], [-0.8, 0.95, 1.7], [0, 0.7, 0.4], 44, 42) }));
  shot(L.L4, (t) => { const on = t > tWarm; return { wall: on ? lin(t, tWarm, tWarm + 0.5) * 1.8 : 0, flash: on && t < tWarm + 0.3 ? 0.5 * (1 - lin(t, tWarm, tWarm + 0.3)) : 0,
    pup: on ? { pos: PP, yaw: 0, sit: 1, sad: 0, ears: 1, shiver: 0, wag: 1, tongue: t > tWarm + 0.4 ? 1 : 0, bark: t > tWarm + 0.5 && t < tWarm + 0.9 ? 0.8 : 0, headYaw: -0.4 * lin(t, tWarm, tWarm + 0.4) } : sad(),
    cam: push(t, L.L4, L.L5, [0.4, 1.0, 2.4], [0, 0.65, 0.2], [0.35, 1.0, 2.1], [0, 0.65, 0.2], 46, 44) }; });
  shot(L.L5, (t) => ({ wall: 2, pup: { pos: PP, yaw: 0, sit: 1, sad: 0.3, ears: 0.3, shiver: 0.5, wag: 0.4 }, cam: push(t, L.L5, L.L6, [0.6, 1.0, 2.3], [0, 0.6, 0.2], [2.0, 2.3, 5.2], [0, 0.5, 0], 44, 46) }));
  shot(L.L6, (t) => ({ wall: 2, pup: { pos: PP, yaw: 0, sit: 1, sad: 0.7, ears: -0.5, shiver: 0.8, wag: 0, headPitch: 0.1 }, cam: push(t, L.L6, VEND + 2.2, [0.06, 0.9, 2.0], H, [0.04, 0.88, 1.75], H, 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tWarm ? 0.0 : lerp(0.0, 0.05, ease(lin(t, tWarm, tWarm + 1.0))), icon: "🏠", label: "CASINHA:", numX: 380, col: "#ff8a3a" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 PEDAÇO 🪵", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 PEDAÇOS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tWarm - 0.35, tWarm - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
