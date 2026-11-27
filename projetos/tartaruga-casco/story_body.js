// Shot plan — "A tartaruga de casco pra baixo". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const TP = [0, 0, 0.5];
const tPush = wt("seguiu", L.L4) + 0.05;
// the push: she rocks up to ~70° and falls back on her shell
const rock = (t) => t < tPush ? 0 : (() => { const u = t - tPush; return u < 0.6 ? -1.2 * ease(u / 0.6) : u < 1.3 ? -1.2 + 1.35 * ease((u - 0.6) / 0.7) : 0.15 * Math.exp(-(u - 1.3) * 3) * Math.cos((u - 1.3) * 12); })();
const stuck = (o = {}) => ({ pos: TP, yaw: 0.35, flip: 1, flail: true, sad: 1, sweat: true, ...o });
export function build() {
  // 0. HOOK (Fahh): on her back in the blazing sun, flippers kicking
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.4 + 0.3 * Math.sin(t * 8), tur: stuck(), cam: push(t, 0, L.L2, [0.55, 0.75, 2.0], [0, 0.35, TP[2]], [0.4, 0.62, 1.6], [0, 0.35, TP[2]], 44, 40) }));
  // 1. she can't turn over alone (wide: hot empty beach)
  shot(L.L2, (t) => ({ red: 0.2, tur: stuck(), cam: push(t, L.L2, L.L3, [2.4, 1.6, 4.2], [0, 0.3, TP[2]], [2.0, 1.4, 3.5], [0, 0.3, TP[2]], 48, 45) }));
  // 2. every follower gives her a push
  shot(L.L3, (t) => ({ tur: stuck({ flail: false, sad: 0.6 }), cam: push(t, L.L3, L.L4, [-1.6, 0.9, 2.6], [0, 0.3, TP[2]], [-1.3, 0.85, 2.2], [0, 0.3, TP[2]], 46, 44) }));
  // 3. someone followed! — a glowing hand pushes, she rocks almost over... and falls back
  shot(L.L4, (t) => ({ tur: stuck({ rock: rock(t), flail: t > tPush, sad: t > tPush + 1.3 ? 0.4 : 0, happy: t > tPush && t < tPush + 1.0 ? 1 : 0 }), hand: t > tPush - 0.35 && t < tPush + 0.9 ? { k: lin(t, tPush - 0.35, tPush + 0.2) } : null,
    cam: push(t, L.L4, L.L5, [0.2, 0.7, 2.4], [0, 0.35, TP[2]], [0.1, 0.65, 2.1], [0, 0.35, TP[2]], 46, 44) }));
  // 4. she almost made it — still needs 1.000 pushes (pull back)
  shot(L.L5, (t) => ({ tur: stuck({ flail: true, sad: 0.8 }), cam: push(t, L.L5, L.L6, [0.8, 1.0, 2.6], [0, 0.3, TP[2]], [1.6, 2.2, 4.6], [0, 0.3, TP[2]], 44, 46) }));
  // 5. follow now and help her — close on her face looking at you
  shot(L.L6, (t) => ({ tur: stuck({ flail: false, sad: 0.7, sweat: true }), cam: push(t, L.L6, VEND + 2.2, [0.5, 0.48, 2.0], [0.18, 0.32, 1.0], [0.42, 0.44, 1.75], [0.18, 0.32, 1.0], 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tPush ? 0.01 : lerp(0.01, 0.05, ease(lin(t, tPush, tPush + 1.0))), icon: "💪", label: "FORÇA:", numX: 330, col: "#2fb36a" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 EMPURRÃO 🤚", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 EMPURRÕES", k: lin(t, wt("precisa", L.L5) - 0.2, wt("precisa", L.L5) + 0.1), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tPush - 0.35, tPush - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
