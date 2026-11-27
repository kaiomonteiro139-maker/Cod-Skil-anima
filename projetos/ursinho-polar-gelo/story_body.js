// Shot plan — "O ursinho polar no gelo derretendo". Opens with Fahh. Likes version.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const BP = [0, 0, 0], H = [0, 1.0, 0];
const tLike = wt("curtiu", L.L4) + 0.05;
const sad = (o = {}) => ({ pos: BP, yaw: 0.1, sad: 1, shiver: 1, hug: 1, ...o });
const floeAt = (t) => (t < tLike ? lerp(0.62, 0.5, lin(t, 0, tLike)) : 0.5);
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.35 + 0.25 * Math.sin(t * 8), floe: floeAt(t), bear: sad(), cam: push(t, 0, L.L2, [0.15, 1.15, 1.35], H, [0.1, 1.1, 1.1], H, 42, 38) }));
  shot(L.L2, (t) => ({ red: 0.15, floe: floeAt(t), bear: sad({ lookDown: 1 }), cam: push(t, L.L2, L.L3, [2.4, 1.8, 3.4], [0, 0.4, 0], [2.0, 1.5, 2.8], [0, 0.4, 0], 46, 44) }));
  shot(L.L3, (t) => ({ floe: floeAt(t), bear: sad({ headYaw: -0.3 }), cam: push(t, L.L3, L.L4, [-0.9, 1.3, 2.0], [0, 0.8, 0], [-0.7, 1.25, 1.7], [0, 0.8, 0], 44, 42) }));
  shot(L.L4, (t) => { const on = t > tLike; return { floe: 0.5, chunk: on ? lin(t, tLike, tLike + 0.5) * 1.8 : 0, flash: on && t < tLike + 0.3 ? 0.5 * (1 - lin(t, tLike, tLike + 0.3)) : 0,
    bear: on ? { pos: BP, yaw: 0.3, sad: 0, happy: 1, hop: t > tLike + 0.4 && t < tLike + 1.4, headYaw: 0.5 } : sad(), cam: push(t, L.L4, L.L5, [0.8, 1.3, 2.3], [0.2, 0.6, 0], [0.7, 1.25, 2.0], [0.2, 0.6, 0], 46, 44) }; });
  shot(L.L5, (t) => ({ floe: 0.5, chunk: 2, bear: { pos: BP, yaw: 0.2, sad: 0.3, happy: 1 }, cam: push(t, L.L5, L.L6, [0.8, 1.2, 2.2], [0.15, 0.6, 0], [2.6, 3.0, 5.6], [0.1, 0.3, 0], 44, 46) }));
  shot(L.L6, (t) => ({ floe: 0.5, chunk: 2, bear: sad({ sad: 0.7, hug: 1 }), cam: push(t, L.L6, VEND + 2.2, [0.12, 1.12, 1.4], H, [0.08, 1.1, 1.15], H, 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tLike ? lerp(0.05, 0.03, lin(t, 0, tLike)) : lerp(0.03, 0.06, ease(lin(t, tLike, tLike + 1.0))), icon: "🧊", label: "GELO:", numX: 300, col: "#2a9ad8" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 CURTIDA = +1 PEDAÇO DE GELO 🧊", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 CURTIDAS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.like = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tLike - 0.35, tLike - 0.05), hand: true };
  if (t > L.L6 - 0.1) { st.like = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: false, y: 0.55 }; st.follow = { k: lin(t, wt("segue", L.L6) - 0.1, wt("segue", L.L6) + 0.2), tap: 0, hand: true }; }
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
