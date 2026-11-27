// Reel 4 — "Ganhei na loteria". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory.py).
import { FPS as _F, push, hero, actor, closeV, phoneV, makeStateAt, seg, lin, blink, BEDHERO, X } from "./vlib.js";
export const FPS = _F;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const KX = X.kit, CX = X.caf;
const meBed = (t, expr, o = {}) => hero(BEDHERO, { mode: "sit", prop: o.prop ?? "phone", expr, blink: blink(t, 3), headTilt: o.tilt ?? Math.sin(t * 0.9) * 2 }, { tint: o.tint || [0.92, 0.95, 1.06] });
const tag = (t, text, t0, o = {}) => ({ text, k: seg(t, t0, t0 + 0.25, (x) => x), ...o });
const tWin = wt("quarenta", L.L1);
// 1. the draw
shot(0, (t) => ({ ...phoneV(t, 0, L.L2, "loto", { clock: "20:01", k: 6 * lin(t, 0.15, tWin - 0.2), win: seg(t, tWin, tWin + 0.3, (x) => x) }, { ps: { shake: t > tWin && t < tWin + 0.6 } }),
  flash: t > tWin ? 0.6 * (1 - lin(t, tWin, tWin + 0.3)) : 0, tag: t > tWin ? tag(t, "40 MILHÕES!", tWin, { y: 0.09 }) : undefined }), { cut: true });
// 2. nobody knows
shot(L.L2, (t) => ({ ...closeV(t, L.L2, L.L3, "bed", meBed(t, "creepy", { prop: null }), { fA: 50, fB: 40 }), spot: 0.45, fx: [{ type: "money", t: t - L.L2, pos: [-0.75, 1.75, -0.7], scale: 0.55 }] }), { cut: true });
// 3. mom and the bills
shot(L.L3, (t) => ({ light: "kit", actors: [actor("mae", [KX, 0.47, -0.75], { mode: "sit", expr: t < wt("reclama", L.L3) ? "worried" : "stern", blink: blink(t, 2), seed: 8, headTilt: Math.sin(t * 3) * 3 })],
  cam: push(t, L.L3, L.L4, [KX + 0.15, 1.55, 1.25], [KX, 0.95, -0.45], [KX + 0.05, 1.45, 0.75], [KX, 1.0, -0.5], 58, 52) }), { cut: true });
// 4. best friend asks for help
shot(L.L4, (t) => closeV(t, L.L4, L.L5, "caf", actor("c1", [CX - 0.75, 0.47, -0.82], { mode: "sit", expr: "sweet", blink: blink(t, 4), seed: 4, headTilt: 6 + Math.sin(t) * 2 })), { cut: true });
// 5. the cousin who vanished
shot(L.L5, (t) => ({ ...phoneV(t, L.L5, L.L7, "chat", { name: "Primo Jorge", clock: "09:47", msgs: [["her", "Saudade, primo!!"], ["her", "Bora marcar um churrasco?"]].slice(0, (t > L.L6 ? 1 : 0) + (t > L.L6 + 0.7 ? 1 : 0)) }, { light: "bedDay" }),
  tag: tag(t, "SUMIDO HÁ 5 ANOS", L.L5 + 0.2, { size: 84, y: 0.09, color: "#ff7a3a" }) }), { cut: true });
shot(L.L7, (t) => ({ ...closeV(t, L.L7, L.L8, "bedDay", meBed(t, "cold", { tint: [1, 1, 1] }), { fA: 46, fB: 34, d0: 1.3, d1: 0.95 }) }), { cut: true });
// 6. question + end card
shot(L.L8, (t) => ({ ...closeV(t, L.L8, L.L8 + 4, "bedDay", meBed(t, "nervous", { tint: [1, 1, 1], prop: null }), { fA: 56, fB: 50 }), fx: [{ type: "sweat", t: t - L.L8, pos: [-1.25, 1.55, -0.75], scale: 0.18 }] }), { cut: true });
export const stateAt = makeStateAt(SH, TOTAL, L.L8, { q: ["VOCÊ CONTA", "OU ESCONDE?"], a: "CONTO PRA|FAMÍLIA", b: "GUARDO|SEGREDO" });
