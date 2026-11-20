// Reel 5 — "O leite no mercado". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory.py).
import { FPS as _F, push, actor, makeStateAt, seg, lin, lerp, L3 as LV, blink, X } from "./vlib.js";
export const FPS = _F;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const MX = X.mkt, WP = [MX + 0.4, 0, -0.85], KP = [MX - 0.05, 0, -0.4], HP = [MX + 3.05, 0, -0.7];
const mom = (t, expr, o = {}) => actor("v2", WP, { mode: "stand", expr, blink: blink(t, 6), seed: 14, prop: "bag", look: o.look ?? 0, headTilt: o.tilt ?? 0 });
const kid = (t, expr) => actor("kid", KP, { mode: "stand", expr, blink: blink(t, 8), seed: 21, headTilt: Math.sin(t * 1.3) * 4 }, { scale: 0.66 });
const me = (t, expr) => actor("heroWork", HP, { mode: "stand", expr, blink: blink(t, 3), seed: 2 });
/** close-up looking +x/-x along the aisle (the camera stays in the aisle, never inside a shelf) */
const closeX = (t, t0, t1, p, hy, dir, o = {}) => push(t, t0, t1, [p[0] + dir * (o.d0 ?? 1.45), hy + 0.05, p[2] + 0.15], [p[0], hy - 0.18, p[2]], [p[0] + dir * (o.d1 ?? 1.1), hy + 0.02, p[2] + 0.08], [p[0], hy - 0.15, p[2]], o.fA ?? 52, o.fB ?? 45, -1, 0.5);
// 1. she hides the can
shot(0, (t) => { const u = seg(t, 0.4, 2.1); return { light: "mkt", actors: [mom(t, "nervous", { look: t < 1.2 ? -1 : 1 }), kid(t, "neutral")],
  fx: t < 2.35 ? [{ type: "milk", t, pos: LV([MX + 0.0, 1.3, -1.25], [MX + 0.62, 0.85, -0.6], u), scale: lerp(0.32, 0.2, u) }] : [],
  cam: push(t, 0, L.L2, [MX + 2.15, 1.5, -0.5], [MX + 0.45, 1.0, -0.8], [MX + 1.65, 1.4, -0.6], [MX + 0.5, 1.0, -0.8], 56, 48) }; }, { cut: true });
// 2. only you saw
shot(L.L2, (t) => ({ light: "mkt", actors: [me(t, "shock")], spot: 0.35, cam: closeX(t, L.L2, L.L3, HP, 1.62, -1, { fA: 52, fB: 44 }) }), { cut: true });
// 3. the hungry kid
shot(L.L3, (t) => ({ light: "mkt", actors: [mom(t, "worried"), kid(t, t < wt("morrendo", L.L3) ? "worried" : "pained")], fx: t > wt("morrendo", L.L3) ? [{ type: "sweat", t: t - L.L3, pos: [KP[0] + 0.12, 1.05, KP[2] + 0.1], scale: 0.12 }] : [],
  cam: push(t, L.L3, L.L4, [KP[0] + 1.25, 0.95, KP[2] + 0.35], [KP[0] - 0.05, 0.78, KP[2]], [KP[0] + 0.95, 0.92, KP[2] + 0.25], [KP[0], 0.8, KP[2]], 54, 46) }), { cut: true });
// 4. the security guard comes
shot(L.L4, (t) => { const u = lin(t, L.L4 + 0.3, L.L5 - 0.2); return { light: "mkt", spot: 0.3 + 0.25 * u,
  actors: [actor("seg", [lerp(MX - 2.9, MX - 0.9, u), 0, -0.6], { mode: u < 1 ? "stroll" : "stand", phase: t * 1.2, expr: "stern", seed: 22 }), mom(t, "scared", { look: -1 }), kid(t, "worried")],
  cam: push(t, L.L4, L.L5, [MX + 2.3, 1.65, -0.35], [MX - 1.0, 1.1, -0.75], [MX + 1.9, 1.55, -0.45], [MX - 0.6, 1.1, -0.75], 56, 50) }; }, { cut: true });
// 5. she looks at you
shot(L.L5, (t) => ({ light: "mkt", actors: [mom(t, "scared", { look: 0, tilt: -4 })], spot: 0.45, fx: t > wt("desesperada", L.L5) - 0.2 ? [{ type: "tears", t: t - L.L5, pos: [WP[0] + 0.06, 1.3, WP[2] + 0.12], scale: 0.3 }] : [],
  cam: closeX(t, L.L5, L.L6, WP, 1.42, 1, { fA: 48, fB: 38 }) }), { cut: true });
// 6. the price
shot(L.L6, (t) => ({ light: "mkt", vig: 0.55, fx: [{ type: "milkPrice", t: t > wt("vinte", L.L6) - 0.1 ? t - wt("vinte", L.L6) + 0.1 : 0, pos: [MX + 0.8, 1.42, -0.7], scale: 0.42 }],
  cam: push(t, L.L6, L.L7, [MX + 1.75, 1.42, -0.68], [MX + 0.8, 1.38, -0.7], [MX + 1.55, 1.42, -0.69], [MX + 0.8, 1.39, -0.7], 50, 46) }), { cut: true });
// 7. question + end card
shot(L.L7, (t) => ({ light: "mkt", actors: [me(t, "nervous")], fx: [{ type: "sweat", t: t - L.L7, pos: [HP[0] - 0.25, 1.95, HP[2] + 0.2], scale: 0.18 }], cam: closeX(t, L.L7, L.L7 + 4, HP, 1.62, -1, { fA: 56, fB: 50 }) }), { cut: true });
export const stateAt = makeStateAt(SH, TOTAL, L.L7, { q: ["E VOCÊ,", "O QUE FAZ?"], a: "ENTREGO PRO|SEGURANÇA", b: "PAGO DO|MEU BOLSO" });
