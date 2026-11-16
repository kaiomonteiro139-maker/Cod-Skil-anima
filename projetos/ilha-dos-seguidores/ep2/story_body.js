// Ilha dos Seguidores — episódio 2 (14 moradores). Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 3.0) * FPS);
export const RESIDENTS = ["ANA INGRID", "ENZO GABRIEL", "ADRIAN", "BRAINIXX", "YZAK", "ANA ELISA", "HEITOR", "VALENTIM", "ALEXANDER", "LUCAS", "PEDRO", "PEDRO", "KAUAN", "TORADOR"];
export const NLOTS = 18, LOT_R = 6.0, LOT_S = 0.85;
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const lin = (t, a, b) => cl((t - a) / (b - a));
const lotA = (i) => (i / NLOTS) * Math.PI * 2 + Math.PI / 2;
const lotP = (i) => [Math.cos(lotA(i)) * LOT_R, 0.47, Math.sin(lotA(i)) * LOT_R];
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
// name word times (spoken order = RESIDENTS order)
const NAMEW = [["ana", L.L4], ["enzo", L.L4], ["adrian", L.L4], ["brainixx", L.L4], ["yzak", L.L4], ["ana", L.L4 + 4.5], ["heitor", L.L4], ["valentim", L.L5], ["alexander", L.L5], ["lucas", L.L5], ["pedro", L.L5], ["pedro", L.L5 + 3.2], ["kauan", L.L5], ["torador", L.L5]];
const NT = NAMEW.map(([w, a]) => wt(w, a));
const tReveal = wt("olha", L.L2) + 0.05;
const GHOST_LOT = 15;
export function build() {
  // 0. HOOK (Fahh): yesterday — the empty island, counter 0
  shot(0, (t) => ({ built: 0, count: 0, cam: { pos: [Math.sin(-0.6 + t * 0.25) * 18, 11, Math.cos(-0.6 + t * 0.25) * 18], look: [0, 0.6, 0], fov: 50 } }));
  // 1. "look at it now!" — flash cut: 14 houses, confetti
  shot(tReveal, (t) => { const a = 0.1 + (t - tReveal) * 0.28; return { built: 14, count: 14, cam: { pos: [Math.sin(a) * lerp(19, 15, ease(lin(t, tReveal, L.L4))), lerp(12, 8, ease(lin(t, tReveal, L.L4))), Math.cos(a) * lerp(19, 15, ease(lin(t, tReveal, L.L4)))], look: [0, 0.6, 0], fov: 52 } }; });
  // 2. name roll — the camera glides from house to house as each name is said
  shot(L.L4, (t) => { let k = 0; while (k + 1 < NT.length && t >= NT[k + 1] - 0.25) k++; const kk = k + (k + 1 < NT.length ? ease(lin(t, NT[k + 1] - 0.45, NT[k + 1] - 0.15)) : 0);
    const a = lerp(lotA(Math.floor(kk)), lotA(Math.min(13, Math.floor(kk) + 1)), kk - Math.floor(kk)); const r = LOT_R + 5.6;
    return { built: 14, count: 14, hl: t >= NT[0] - 0.2 ? Math.round(kk) : -1, cam: { pos: [Math.cos(a) * r, 2.6, Math.sin(a) * r], look: [Math.cos(a) * LOT_R, 1.75, Math.sin(a) * LOT_R], fov: 50 } }; });
  // 3. there are empty lots left — the ghost "VOCÊ?" house; subscribe + comment your name
  shot(E.L5 + 0.2, (t) => { const p = lotP(GHOST_LOT), a = lotA(GHOST_LOT), u = ease(lin(t, E.L5 + 0.2, VEND + 3.0)), r = LOT_R + lerp(4.0, 8.5, u);
    return { built: 14, count: 14, ghost: { lot: GHOST_LOT, k: lin(t, wt("lote", L.L6) - 0.1, wt("lote", L.L6) + 0.3), bean: lin(t, wt("casinha", L.L6) - 0.2, wt("casinha", L.L6) + 0.2) },
      cam: { pos: [Math.cos(a + 0.15 * u) * r, lerp(2.8, 7, u), Math.sin(a + 0.15 * u) * r], look: [p[0] * lerp(1, 0.6, u), 1.0, p[2] * lerp(1, 0.6, u)], fov: 50 } }; });
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  if (i > 0 && i !== 1 && t < SH[i].t0 + 0.35) { st.b = st.a; st.a = SH[i - 1].fn(t); st.mix = ease((t - SH[i].t0) / 0.35); }
  if (t >= tReveal && t < tReveal + 0.3) st.a.flash = 0.85 * (1 - lin(t, tReveal, tReveal + 0.3));
  const n = t < tReveal ? 0 : Math.round(14 * ease(lin(t, tReveal + 0.1, tReveal + 1.3)));
  st.counter = { k: lin(t, wt("zero", 0) - 0.15, wt("zero", 0) + 0.2), n, pulse: t >= tReveal && t < tReveal + 2 };
  if (t >= tReveal) st.confetti = { t0: tReveal };
  const ts = wt("inscreve", L.L6) - 0.1; if (t >= ts && t < wt("comenta", L.L6) - 0.1) st.follow = { k: lin(t, ts, ts + 0.3), tap: lin(t, ts + 0.6, ts + 0.9), hand: true, text: "Inscrever-se", doneText: "✓ Inscrito" };
  const tc = wt("comenta", L.L6) - 0.1; if (t >= tc && t < E.L6 + 0.4) st.comment = { k: lin(t, tc, tc + 0.3), type: lin(t, tc + 0.3, tc + 1.6) };
  if (t >= E.L6 + 0.4) st.follow = { k: lin(t, E.L6 + 0.4, E.L6 + 0.7), tap: 0, hand: true, text: "Inscrever-se", y: 0.8 };
  if (t > TOTAL / FPS - 0.3) st.dark = lin(t, TOTAL / FPS - 0.3, TOTAL / FPS); return st; }
