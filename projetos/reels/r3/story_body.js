// Reel 3 — "A mochila na rua". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory.py).
import { FPS as _F, push, hero, closeV, makeStateAt, seg, lin, blink, lerp, X } from "./vlib.js";
export const FPS = _F;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const RX = X.st, BAG = [RX + 5.3, 0.3, -0.55], HS = [RX + 4.55, 0.06, -0.85];
const me = (t, expr, o = {}) => hero(o.pos || HS, { mode: o.mode || "stand", expr, blink: blink(t, 3), look: o.look ?? 0, phase: o.phase ?? 0, headTilt: o.tilt ?? 0 });
const tOpen = wt("e", L.L2) - 0.05, tCash = wt("cinquenta", L.L2);
// 1. walking at night, the backpack on the sidewalk
shot(0, (t) => { const u = seg(t, 0, L.L2 - 0.3, (x) => x); const walking = u < 0.97;
  return { light: "street", carRed: false, actors: [me(t, u < 0.6 ? "neutral" : "shock", { pos: [lerp(RX + 3.75, HS[0], u), 0.06, HS[2]], mode: walking ? "stroll" : "stand", phase: t * 1.3 })],
    fx: [{ type: "backpack", t, pos: [BAG[0], 0.26, BAG[2]], scale: 0.55 }], cam: push(t, 0, L.L2, [RX + 4.3, 1.5, 3.3], [RX + 4.5, 0.85, -0.7], [RX + 4.7, 1.3, 2.3], [RX + 4.95, 0.75, -0.7], 60, 52) }; }, { cut: true });
// 2. it opens: cash
shot(L.L2, (t) => ({ light: "street", carRed: false, flash: t > tCash ? 0.55 * (1 - lin(t, tCash, tCash + 0.3)) : 0,
  fx: [{ type: t < tOpen ? "backpack" : "bagOpen", t, pos: BAG, scale: t < tOpen ? 0.55 : 0.75 }, ...(t > tCash ? [{ type: "money", t: t - tCash, pos: [BAG[0], 0.75, BAG[2] + 0.1], scale: 0.6 }] : [])],
  cam: push(t, L.L2, L.L3, [BAG[0] + 0.05, 1.25, BAG[2] + 0.75], [BAG[0], 0.25, BAG[2]], [BAG[0] + 0.02, 1.0, BAG[2] + 0.55], [BAG[0], 0.28, BAG[2]], 52, 44) }), { cut: true });
// 3. nobody saw — looking around
shot(L.L3, (t) => ({ ...closeV(t, L.L3, L.L4, "street", me(t, "nervous", { look: Math.sin((t - L.L3) * 3.2) > 0 ? 1 : -1 }), { carRed: false }), fx: [{ type: "sweat", t: t - L.L3, pos: [HS[0] - 0.25, 1.95, HS[2] + 0.1], scale: 0.18 }] }), { cut: true });
shot(wt("nenhuma", L.L3), (t) => ({ light: "street", carRed: false, cam: push(t, wt("nenhuma", L.L3), L.L4, [RX + 3.0, 3.6, 2.5], [RX + 8, 3.2, -4.4], [RX + 3.2, 3.6, 2.4], [RX + 11, 3.0, -4.4], 50, 48), spot: 0.3 }), { cut: true });
// 4. the receipt
shot(L.L4, (t) => ({ light: "street", carRed: false, vig: 0.5, fx: [{ type: "receipt", t: t > L.L6 ? (t - L.L6) * 2.2 : 0, pos: [BAG[0], 1.4, BAG[2]], scale: 0.4 }],
  cam: push(t, L.L4, L.L7, [BAG[0] + 0.04, 1.36, BAG[2] + 1.2], [BAG[0], 1.33, BAG[2]], [BAG[0] + 0.01, 1.37, BAG[2] + 0.98], [BAG[0], 1.35, BAG[2]], 50, 47, -1, 0.5) }), { cut: true });
// 5. the choice
shot(L.L7, (t) => ({ ...closeV(t, L.L7, L.L8, "street", me(t, "dazed"), { carRed: false }), fx: [{ type: "money", t: t - L.L7, pos: [HS[0] + 0.25, 2.05, HS[2] + 0.1], scale: 0.55 }] }), { cut: true });
shot(L.L8, (t) => ({ ...closeV(t, L.L8, L.L9, "street", me(t, "pained", { tilt: -5 }), { carRed: false, fA: 46, fB: 38 }), spot: 0.55, fx: [{ type: "heart", t, pos: [HS[0] + 0.3, 2.0, HS[2] + 0.1], scale: 0.2 }] }), { cut: true });
// 6. end card
shot(L.L9, (t) => ({ light: "street", carRed: false, actors: [me(t, "worried")], fx: [{ type: "backpack", t, pos: [HS[0] + 0.45, 0.22, HS[2] + 0.15], scale: 0.4 }],
  cam: push(t, L.L9, L.L9 + 3, [RX + 6.2, 1.45, 2.4], [HS[0], 1.0, HS[2]], [RX + 5.6, 1.4, 1.6], [HS[0], 1.05, HS[2]], 56, 50) }), { cut: true });
export const stateAt = makeStateAt(SH, TOTAL, L.L9, { q: ["E VOCÊ,", "O QUE FAZ?"], a: "DEVOLVO|A MOCHILA", b: "FICO COM|O DINHEIRO" });
