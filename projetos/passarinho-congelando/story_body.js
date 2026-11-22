// Shot plan — "O passarinho congelando". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const BP = [0, 0.95, 0.0];
const tWarm = wt("seguiu", L.L4) + 0.05;
const cold = (o = {}) => ({ pos: BP, yaw: 0.25, cold: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.35 + 0.25 * Math.sin(t * 8), bird: cold(), cam: push(t, 0, L.L2, [0.12, 1.25, 0.85], [0, 1.15, 0], [0.09, 1.22, 0.68], [0, 1.15, 0], 42, 38) }));
  shot(L.L2, (t) => ({ red: 0.15, bird: cold(), cam: push(t, L.L2, L.L3, [1.6, 1.5, 3.2], [0, 1.0, 0], [1.3, 1.4, 2.6], [0, 1.0, 0], 48, 45) }));
  shot(L.L3, (t) => ({ bird: cold({ yaw: -0.3, cold: 0.9 }), cam: push(t, L.L3, L.L4, [-0.7, 1.3, 1.5], [0, 1.1, 0], [-0.55, 1.28, 1.25], [0, 1.1, 0], 44, 42) }));
  shot(L.L4, (t) => { const on = t > tWarm; return { ray: on ? lin(t, tWarm, tWarm + 0.6) : 0, flash: on && t < tWarm + 0.3 ? 0.5 * (1 - lin(t, tWarm, tWarm + 0.3)) : 0,
    bird: { pos: BP, yaw: 0.25, cold: on ? 1 - lin(t, tWarm, tWarm + 0.8) : 1, scarf: on ? lin(t, tWarm, tWarm + 0.3) : 0, flap: on && t > tWarm + 0.4 && t < tWarm + 1.6, happy: on ? 1 : 0 },
    cam: push(t, L.L4, L.L5, [0.2, 1.3, 1.2], [0, 1.15, 0], [0.16, 1.28, 1.0], [0, 1.15, 0], 46, 44) }; });
  shot(L.L5, (t) => ({ ray: 0.6, bird: { pos: BP, yaw: 0.25, cold: 0.4, scarf: 1 }, cam: push(t, L.L5, L.L6, [0.5, 1.3, 1.6], [0, 1.05, 0], [1.4, 2.0, 4.2], [0, 0.9, 0], 44, 46) }));
  shot(L.L6, (t) => ({ ray: 0.3, bird: { pos: BP, yaw: 0, cold: 0.6, scarf: 1 }, cam: push(t, L.L6, VEND + 2.2, [0.04, 1.24, 0.8], [0, 1.16, 0], [0.03, 1.22, 0.66], [0, 1.16, 0], 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tWarm ? 0.01 : lerp(0.01, 0.05, ease(lin(t, tWarm, tWarm + 1.0))), icon: "🔥", label: "CALOR:", numX: 330, col: "#ff8a3a" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 CACHECOL 🧣", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 CACHECÓIS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tWarm - 0.35, tWarm - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
