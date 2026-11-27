// Shot plan — "O peixinho com 1 gota d'água". Opens with Fahh at 0 s. L.<id>/E.<id> line times, wt(word, after) word time.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const AQY = 1.02, FISHP = [-0.1, 0.07, 0.05];
const tPour = wt("seguiu", L.L4) + 0.1, LV0 = 0.06, LV1 = 0.14;
const level = (t) => t < tPour ? LV0 : lerp(LV0, LV1, ease(lin(t, tPour, tPour + 1.6)));
const flopFish = (t, o = {}) => ({ pos: FISHP, yaw: 0.25, flop: 1, sad: 1, ...o });
export function build() {
  // 0. HOOK — Fahh: the fish flops in 2 cm of water, red alarm
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.5 + 0.3 * Math.sin(t * 8), level: level(t), fish: flopFish(t), cam: push(t, 0, L.L2, [0.15, AQY + 0.32, 1.05], [-0.08, AQY + 0.1, 0.05], [0.1, AQY + 0.26, 0.85], [-0.08, AQY + 0.1, 0.05], 40, 36) }));
  // 1. the tank cracked and is leaking
  shot(L.L2, (t) => ({ red: 0.25, level: level(t), puddle: 0.5 + 0.5 * lin(t, L.L2, L.L3), fish: flopFish(t, { flop: 0.6 }), cam: push(t, L.L2, L.L3, [0.9, AQY + 0.55, 2.0], [0.25, AQY + 0.25, 0.3], [0.75, AQY + 0.45, 1.6], [0.35, AQY + 0.2, 0.35], 42, 38) }));
  // 2. every follower pours one glass of water in here
  shot(L.L3, (t) => ({ level: level(t), fish: flopFish(t, { flop: 0.5, look: 1 }), cup: { pos: [0.1, 1.08, 0.05], k: lin(t, wt("copo", L.L3) - 0.25, wt("copo", L.L3) + 0.15), pour: 0 },
    cam: push(t, L.L3, L.L4, [0.0, AQY + 0.85, 2.6], [0.0, AQY + 0.6, 0], [0.0, AQY + 0.8, 2.3], [0.0, AQY + 0.62, 0], 45, 43) }));
  // 3. someone followed! — the glass pours, the water rises, the fish jumps for joy
  shot(L.L4, (t) => ({ level: level(t), leak: true, fish: { pos: [FISHP[0], FISHP[1] + (level(t) - LV0) * 0.8, FISHP[2]], yaw: 0.2, flop: t < tPour + 0.4 ? 0.4 : 0, jump: t > tPour + 0.4 && t < tPour + 1.6 ? 1 : 0, sad: t < tPour ? 0.6 : 0, look: 1 },
    cup: { pos: [-0.05, 0.95, 0.05], pour: ease(lin(t, tPour - 0.2, tPour + 0.2)), drain: lin(t, tPour + 0.2, tPour + 1.6) }, cam: push(t, L.L4, L.L5, [0.0, AQY + 0.55, 2.2], [-0.05, AQY + 0.3, 0], [0.0, AQY + 0.5, 1.9], [-0.05, AQY + 0.3, 0], 46, 44) }));
  // 4. not enough — he needs 1.000 glasses to swim again (pull back: the tank is still almost empty)
  shot(L.L5, (t) => ({ level: level(t), fish: { pos: [FISHP[0] + Math.sin(t * 1.2) * 0.1, FISHP[1] + (LV1 - LV0) * 0.8, FISHP[2]], yaw: Math.cos(t * 1.2) > 0 ? 0 : Math.PI, sad: 0.8 },
    cam: push(t, L.L5, L.L6, [0.6, AQY + 0.7, 2.0], [0, AQY + 0.3, 0], [1.2, AQY + 1.0, 3.2], [0, AQY + 0.35, 0], 44, 46) }));
  // 5. follow now and save him — the fish looks at you
  shot(L.L6, (t) => ({ level: level(t), fish: { pos: [0.0, FISHP[1] + (LV1 - LV0) * 0.8, 0.15], yaw: -0.55, sad: 0.5, look: 1 }, cam: push(t, L.L6, VEND + 2.2, [0.25, AQY + 0.28, 1.35], [0.02, AQY + 0.14, 0.15], [0.2, AQY + 0.25, 1.1], [0.02, AQY + 0.14, 0.15], 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  const pct = (lv) => lv === LV0 ? 0.03 : lerp(0.03, 0.08, (lv - LV0) / (LV1 - LV0));
  st.bar = { k: lin(t, 0.55, 0.9), v: pct(level(t)) };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 COPO 🥤", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > L.L5 + 0.3 && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 COPOS", k: lin(t, wt("precisa", L.L5) - 0.2, wt("precisa", L.L5) + 0.1), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tPour - 0.35, tPour - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
