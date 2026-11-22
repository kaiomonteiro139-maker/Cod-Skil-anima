// Shot plan — "O sapinho que tá secando". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const FP = [0, 0, 0.1];
const tRain = wt("seguiu", L.L4) + 0.05;
const pond = (t) => t < tRain ? 0 : 0.25 * ease(lin(t, tRain + 0.3, tRain + 1.8));
const dry = (o = {}) => ({ pos: FP, yaw: 0.2, tired: 1, sweat: true, ...o });
export function build() {
  // 0. HOOK (Fahh): tired frog, tongue out, on cracked mud
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.4 + 0.3 * Math.sin(t * 8), pond: 0, frog: dry(), cam: push(t, 0, L.L2, [0.3, 0.6, 1.7], [0, 0.3, FP[2]], [0.22, 0.52, 1.35], [0, 0.3, FP[2]], 44, 40) }));
  // 1. only a mud puddle left (wide)
  shot(L.L2, (t) => ({ red: 0.2, pond: 0, frog: dry(), cam: push(t, L.L2, L.L3, [2.2, 1.8, 4.0], [0.1, 0.2, 0.4], [1.8, 1.5, 3.3], [0.1, 0.2, 0.4], 48, 45) }));
  // 2. every follower sends one raindrop
  shot(L.L3, (t) => ({ pond: 0, frog: dry({ tired: 0.8, yaw: -0.3 }), cam: push(t, L.L3, L.L4, [-1.4, 0.8, 2.4], [0, 0.35, FP[2]], [-1.1, 0.75, 2.0], [0, 0.35, FP[2]], 46, 44) }));
  // 3. someone followed! — a cloud arrives and rains, the puddle grows, the frog jumps
  shot(L.L4, (t) => { const happy = t > tRain + 0.6; return { pond: pond(t), cloud: t > tRain - 0.4 ? { k: lin(t, tRain - 0.4, tRain + 0.1), rain: t > tRain + 0.1 } : null,
    frog: { pos: FP, yaw: 0.2, tired: happy ? 0 : 1 - lin(t, tRain, tRain + 0.6), jump: happy && t < tRain + 2.0, happy: happy ? 1 : 0 }, cam: push(t, L.L4, L.L5, [0.3, 0.9, 3.0], [0.15, 0.75, 0.3], [0.25, 0.88, 2.7], [0.15, 0.78, 0.3], 52, 50) }; });
  // 4. it rained a little — he needs 1.000 drops (pull back: the pond is still tiny)
  shot(L.L5, (t) => ({ pond: pond(t), cloud: { k: 1, rain: false }, frog: { pos: FP, yaw: 0.2, tired: 0.3, happy: 0 }, cam: push(t, L.L5, L.L6, [0.8, 1.2, 2.6], [0, 0.3, 0.3], [1.8, 3.0, 5.0], [0, 0.2, 0.3], 44, 46) }));
  // 5. follow now and save him — close on his big eyes
  shot(L.L6, (t) => ({ pond: pond(t), frog: { pos: FP, yaw: 0, tired: 0.4, happy: 0, sweat: true }, cam: push(t, L.L6, VEND + 2.2, [0.08, 0.6, 2.0], [0, 0.34, FP[2]], [0.06, 0.56, 1.7], [0, 0.34, FP[2]], 42, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tRain ? 0.02 : lerp(0.02, 0.06, ease(lin(t, tRain + 0.3, tRain + 1.8))), icon: "💧", label: "LAGOA:", numX: 340, col: "#2a9ad8" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 GOTA 🌧️", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 GOTAS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tRain - 0.35, tRain - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
