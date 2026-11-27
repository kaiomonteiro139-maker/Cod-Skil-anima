// Shot plan — "A abelhinha sem flores". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const BP = [0.2, 0.62, 0.05], FL = [0.45, 0.76, 0.27];
const tGrow = wt("seguiu", L.L4) + 0.05;
const grow = (t) => t < tGrow ? 0 : lin(t, tGrow, tGrow + 0.9) * 1.6;
const tired = (o = {}) => ({ pos: BP, yaw: 0.3, tired: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.4 + 0.3 * Math.sin(t * 8), bee: tired(), cam: push(t, 0, L.L2, [0.3, 0.8, 0.75], [0.15, 0.62, 0.0], [0.26, 0.75, 0.6], [0.15, 0.62, 0.0], 42, 38) }));
  shot(L.L2, (t) => ({ red: 0.2, bee: tired(), cam: push(t, L.L2, L.L3, [1.6, 1.2, 2.8], [0.1, 0.5, -0.3], [1.3, 1.1, 2.3], [0.1, 0.5, -0.3], 48, 45) }));
  shot(L.L3, (t) => ({ bee: tired({ tired: 0.8 }), cam: push(t, L.L3, L.L4, [-0.5, 0.95, 1.3], [0.15, 0.6, 0], [-0.4, 0.9, 1.1], [0.15, 0.6, 0], 44, 42) }));
  shot(L.L4, (t) => { const g = grow(t), fly = t > tGrow + 0.7, u = lin(t, tGrow + 0.7, tGrow + 1.6);
    return { grow: g, bee: { pos: fly ? L3(BP, FL, ease(u)) : BP, yaw: 0.3, tired: fly ? 0 : 1 - lin(t, tGrow, tGrow + 0.6), fly, happy: t > tGrow ? 1 : 0 }, cam: push(t, L.L4, L.L5, [0.55, 0.95, 1.9], [0.32, 0.72, 0.15], [0.5, 0.95, 1.7], [0.38, 0.8, 0.2], 46, 44) }; });
  shot(L.L5, (t) => ({ grow: 2, bee: { pos: FL, yaw: 0.3, tired: 0, happy: 0, fly: false }, cam: push(t, L.L5, L.L6, [0.8, 1.1, 1.8], [0.3, 0.7, 0.1], [1.6, 2.0, 4.0], [0.2, 0.6, -0.2], 44, 46) }));
  shot(L.L6, (t) => ({ grow: 2, bee: { pos: FL, yaw: 0, tired: 0.3, happy: 0, fly: false }, cam: push(t, L.L6, VEND + 2.2, [FL[0] + 0.05, FL[1] + 0.12, FL[2] + 1.05], [FL[0], FL[1] + 0.0, FL[2]], [FL[0] + 0.04, FL[1] + 0.1, FL[2] + 0.85], [FL[0], FL[1] + 0.0, FL[2]], 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tGrow ? 0.0 : lerp(0.0, 0.04, ease(lin(t, tGrow, tGrow + 1.0))), icon: "🌸", label: "FLORES:", numX: 360, col: "#f06aa0" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 FLOR 🌸", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 FLORES", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tGrow - 0.35, tGrow - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
