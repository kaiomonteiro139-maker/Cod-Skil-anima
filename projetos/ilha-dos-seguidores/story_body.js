// Ilha dos Seguidores — episódio 1 (0 habitantes). L.<id>/E.<id> = line start/end, wt(word, after) = word time.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 4.2) * FPS);
export const RESIDENTS = [];   // next episodes: names from the comments (one house per name)
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const orbit = (a, r, h, look = [0, 0.6, 0], fov = 50) => ({ pos: [Math.sin(a) * r, h, Math.cos(a) * r], look, fov });
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const LOT = [0, 0.47, 5.6];
export function build() {
  // 1. hook: drone over the empty island
  shot(0, (t) => ({ cam: orbit(-0.9 + t * 0.22, lerp(24, 19, ease(t / L.L2)), lerp(14, 10, ease(t / L.L2))) }));
  shot(L.L2, (t) => { const u = lin(t, L.L2, L.L3); return { cam: orbit(-0.45 + u * 0.7, 11.5, 4.2, [0, 0.8, 0], 52) }; });
  // 2. every follower gets a little house — swoop to lot 1, ghost house pops on "casinha"
  shot(L.L3, (t) => ({ ghost: { lot: 0, k: lin(t, wt("casinha", L.L3) - 0.1, wt("casinha", L.L3) + 0.35) }, cam: push(t, L.L3, L.L3b, [3.5, 6.5, 15], [0, 0.8, 4.5], [1.6, 2.6, 10.4], [0, 1.1, 5.6], 50, 48) }));
  // 3. your name on the door sign
  shot(L.L3b, (t) => ({ ghost: { lot: 0, k: 1 }, cam: push(t, L.L3b, L.L4, [1.4, 2.9, 11.4], [0, 2.3, LOT[2]], [0.9, 2.8, 10.2], [0, 2.3, LOT[2]], 46, 42) }));
  // 4. comment your name → you appear living here next video
  shot(L.L4, (t) => ({ ghost: { lot: 0, k: 1, bean: lin(t, wt("você", L.L4) - 0.2, wt("você", L.L4) + 0.2) }, cam: push(t, L.L4, L.L5, [3.4, 2.3, 11.8], [0.3, 1.1, 5.9], [2.8, 2.0, 10.8], [0.3, 1.1, 5.9], 50, 46) }));
  // 5. how far will it grow? — pull up over the whole island
  shot(L.L5, (t) => { const u = ease(lin(t, L.L5, VEND + 4.2)); return { ghost: { lot: 0, k: 1, bean: 1 }, cam: orbit(0.25 + u * 0.6, lerp(12, 22, u), lerp(5, 15, u), [0, lerp(1.2, 0.4, u), lerp(3, 0, u)], 52) }; });
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  if (i > 0 && t < SH[i].t0 + 0.35) { st.b = st.a; st.a = SH[i - 1].fn(t); st.mix = ease((t - SH[i].t0) / 0.35); }
  const tz = wt("zero", 0) - 0.1; st.counter = { k: lin(t, tz, tz + 0.35), n: 0, pulse: t > L.L5 };
  const ts = wt("seguir", L.L3) - 0.1, tTap = wt("ganha", L.L3) + 0.25;
  if (t >= ts && t < L.L3b + 0.6) st.follow = { k: lin(t, ts, ts + 0.3), tap: lin(t, tTap, tTap + 0.3), hand: true };
  if (t >= L.L4 && t < L.L5) st.comment = { k: lin(t, L.L4, L.L4 + 0.3), type: lin(t, L.L4 + 0.4, L.L4 + 2.0) };
  const te = E.L5 + 0.5; if (t >= te) st.follow = { k: lin(t, te, te + 0.3), tap: 0, hand: true, y: 0.8 };
  if (t > TOTAL / FPS - 0.3) st.dark = lin(t, TOTAL / FPS - 0.3, TOTAL / FPS); return st; }
