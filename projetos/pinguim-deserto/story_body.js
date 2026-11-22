// Shot plan — "O pinguim no deserto". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const PP = [0, 0, 0.2];
const tIce = wt("seguiu", L.L4) + 0.05;
const hot = (o = {}) => ({ pos: PP, yaw: 0.15, melt: 1, sweat: true, happy: 0, ...o });
export function build() {
  // 0. HOOK (Fahh): penguin melting in the desert, red heat
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.45 + 0.3 * Math.sin(t * 8), pen: hot(), cam: push(t, 0, L.L2, [0.25, 1.0, 2.2], [0, 0.72, PP[2]], [0.18, 0.9, 1.8], [0, 0.72, PP[2]], 44, 40) }));
  // 1. his last ice is gone (wide: endless desert, puddle under him)
  shot(L.L2, (t) => ({ red: 0.2, pen: hot(), cam: push(t, L.L2, L.L3, [2.6, 1.7, 4.4], [0, 0.5, PP[2]], [2.1, 1.5, 3.7], [0, 0.5, PP[2]], 48, 45) }));
  // 2. every follower sends an ice cube
  shot(L.L3, (t) => ({ pen: hot({ melt: 0.85, yaw: -0.25 }), cam: push(t, L.L3, L.L4, [-1.5, 1.1, 2.6], [0, 0.6, PP[2]], [-1.2, 1.0, 2.2], [0, 0.6, PP[2]], 46, 44) }));
  // 3. someone followed! — an ice cube drops from the sky, he hugs it, jumps
  shot(L.L4, (t) => { const k = lin(t, tIce - 0.15, tIce + 0.35), landed = k >= 1; return { ice: { k }, flash: landed && t < tIce + 0.55 ? 0.5 * (1 - lin(t, tIce + 0.35, tIce + 0.55)) : 0,
    pen: { pos: PP, yaw: 0.15, melt: landed ? 0.2 : 1, sweat: !landed, hug: landed, jump: landed && t > tIce + 0.4 && t < tIce + 1.2, happy: landed ? 1 : 0 }, cam: push(t, L.L4, L.L5, [0.3, 1.25, 3.0], [0, 0.8, PP[2]], [0.25, 1.15, 2.6], [0, 0.75, PP[2]], 50, 48) }; });
  // 4. he's better — but needs 1.000 cubes to go home (pull back)
  shot(L.L5, (t) => ({ ice: { k: 1 }, pen: { pos: PP, yaw: 0.15, melt: 0.35, hug: true, happy: 0 }, cam: push(t, L.L5, L.L6, [0.9, 1.4, 3.0], [0, 0.6, PP[2]], [2.2, 3.2, 6.0], [0, 0.5, PP[2]], 44, 46) }));
  // 5. follow now and save him — close on his face
  shot(L.L6, (t) => ({ ice: { k: 1 }, pen: { pos: PP, yaw: 0, melt: 0.5, sweat: true, happy: 0, hug: true }, cam: push(t, L.L6, VEND + 2.2, [0.06, 1.0, 2.1], [0, 0.78, PP[2]], [0.05, 0.96, 1.8], [0, 0.78, PP[2]], 42, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tIce + 0.35 ? 0.01 : lerp(0.01, 0.05, ease(lin(t, tIce + 0.35, tIce + 1.3))), icon: "🧊", label: "GELO:", numX: 300, col: "#3fb8e8" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 CUBO DE GELO 🧊", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 CUBOS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tIce - 0.35, tIce - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
