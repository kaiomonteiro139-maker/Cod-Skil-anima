// Shot plan — "O hamster sem comida". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const Y = 1.02, HP = [0.05, 0.11, -0.28];
const tPour = wt("seguiu", L.L4) + 0.05;
const fill = (t) => t < tPour ? 0 : 0.35 * ease(lin(t, tPour, tPour + 1.2));
const weakHam = (o = {}) => ({ pos: HP, yaw: 0.5, weak: 1, sad: 1, ...o });
export function build() {
  // 0. HOOK (Fahh): weak hamster lying flat, red alarm
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.45 + 0.3 * Math.sin(t * 8), bowl: 0, ham: weakHam(), cam: push(t, 0, L.L2, [-0.12, Y + 0.32, 0.41], [0.05, Y + 0.16, -0.28], [-0.08, Y + 0.28, 0.38], [0.05, Y + 0.15, -0.28], 54, 48) }));
  // 1. his bowl is empty
  shot(L.L2, (t) => ({ red: 0.2, bowl: 0, ham: weakHam({ look: 0.5 }), cam: push(t, L.L2, L.L3, [0.42, Y + 0.55, 0.95], [0.32, Y + 0.12, 0.18], [0.38, Y + 0.45, 0.75], [0.32, Y + 0.12, 0.18], 40, 36) }));
  // 2. every follower drops one seed in here
  shot(L.L3, (t) => ({ bowl: 0, ham: weakHam({ weak: 0.8, look: 0.4 }), cam: push(t, L.L3, L.L4, [0.1, Y + 0.95, 2.6], [0.0, Y + 0.55, 0], [0.1, Y + 0.9, 2.3], [0.0, Y + 0.55, 0], 45, 43) }));
  // 3. someone followed! — seeds rain into the bowl, he jumps and stuffs his cheeks
  shot(L.L4, (t) => { const up = t > tPour + 0.3; return { bowl: fill(t), pour: lin(t, tPour - 0.1, tPour + 1.1), wheel: 0,
    ham: { pos: up ? [0.22, 0.11, 0.2] : HP, yaw: up ? 0.9 : 0.5, weak: up ? 0 : 1 - lin(t, tPour - 0.2, tPour + 0.3), jump: up && t < tPour + 1.0, eat: t > tPour + 1.0 ? 1 : 0, sad: 0 },
    cam: push(t, L.L4, L.L5, [0.4, Y + 0.6, 1.5], [0.25, Y + 0.2, 0.15], [0.38, Y + 0.48, 1.2], [0.25, Y + 0.18, 0.18], 44, 40) }; });
  // 4. still not enough — he needs 1.000 seeds (pull back, almost empty bowl)
  shot(L.L5, (t) => ({ bowl: 0.35, ham: { pos: [0.22, 0.11, 0.2], yaw: 0.9, eat: 0.6, sad: 0.6 }, cam: push(t, L.L5, L.L6, [0.6, Y + 0.7, 1.9], [0, Y + 0.3, 0], [1.1, Y + 1.0, 3.0], [0, Y + 0.35, 0], 44, 46) }));
  // 5. follow now and save him — he looks at you
  shot(L.L6, (t) => ({ bowl: 0.35, ham: { pos: [0.05, 0.11, -0.3], yaw: 0, eat: 0.3, sad: 0.4, look: 0.6 }, cam: push(t, L.L6, VEND + 2.2, [0.07, Y + 0.3, 0.41], [0.05, Y + 0.2, -0.3], [0.06, Y + 0.28, 0.38], [0.05, Y + 0.2, -0.3], 50, 46) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tPour ? 0.02 : lerp(0.02, 0.06, ease(lin(t, tPour, tPour + 1.2))), icon: "🌻", label: "COMIDA:", numX: 360, col: "#e8a03a" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 SEMENTE 🌻", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > L.L5 + 0.3 && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 SEMENTES", k: lin(t, wt("precisa", L.L5) - 0.2, wt("precisa", L.L5) + 0.1), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tPour - 0.35, tPour - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
