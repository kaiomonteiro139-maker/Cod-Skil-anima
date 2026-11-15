// Reel 1 — "Pix errado". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory.py).
import { FPS as _F, push, hero, closeV, phoneV, makeStateAt, seg, lin, blink, BEDHERO, X } from "./vlib.js";
export const FPS = _F;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const NUM = "(11) 9 8471-0032";
const bedHero = (t, expr, o = {}) => hero(BEDHERO, { mode: "sit", prop: o.prop ?? "phone", expr, blink: blink(t, 3), headTilt: o.tilt ?? Math.sin(t * 0.9) * 2 }, { tint: o.tint || [0.92, 0.95, 1.06] });
const tPix = 0.35, tMsg = [wt("pelo", L.L4) - 0.1, wt("era", L.L4) - 0.1, wt("dó", L.L5) - 0.4];
// 1. the money lands
shot(0, (t) => ({ ...phoneV(t, 0, L.L2, "pixIn", { k: seg(t, tPix, tPix + 0.35, (x) => x), val: "R$ 3.000,00", from: "Desconhecido", clock: "21:08" }, { ps: { shake: t > tPix && t < tPix + 0.5 } }), flash: 0.5 * (1 - lin(t, tPix, tPix + 0.25)) * (t > tPix ? 1 : 0) }), { cut: true });
shot(L.L2, (t) => ({ ...closeV(t, L.L2, L.L3, "bed", bedHero(t, t < L.L2 + 0.5 ? "shock" : "dazed")), fx: [{ type: "money", t: t - L.L2, pos: [-0.75, 1.75, -0.7], scale: 0.55 }] }));
// 2. the message
shot(L.L3, (t) => phoneV(t, L.L3, L.L5, "chat", { name: NUM, clock: "21:10", msgs: [["her", "Moço, mandei errado!!"], ["her", "Era o dinheiro do aluguel"], ["her", "Devolve por favor"]].slice(0, (t > L.L3 + 0.7 ? 1 : 0) + (t > tMsg[1] ? 1 : 0) + (t > tMsg[1] + 1.4 ? 1 : 0)) }), { cut: true });
shot(L.L5, (t) => closeV(t, L.L5, wt("devolve", L.L5) + 0.1, "bed", bedHero(t, "pained", { tilt: -6 })));
shot(wt("devolve", L.L5), (t) => phoneV(t, wt("devolve", L.L5), L.L6, "chat", { name: NUM, clock: "21:12", msgs: [["her", "Devolve por favor"], ["me", "Pronto, devolvi!"], ...(t > wt("hora", L.L5) + 0.3 ? [["her", "Deus te abençoe"]] : [])] }), { cut: true });
// 3. next day: the bank calls
shot(L.L6, (t) => phoneV(t, L.L6, L.L7, "call", { name: "Meu Banco", clock: "09:14" }, { light: "bedDay", ps: { shake: true } }), { cut: true });
shot(L.L7, (t) => phoneV(t, L.L7, wt("os", L.L7), "alert", { k: seg(t, wt("contestado", L.L7) - 0.1, wt("contestado", L.L7) + 0.25, (x) => x), bal: "R$ 12,40", red: true, clock: "09:15", lines: ["Pix contestado", "- R$ 3.000,00"] }, { light: "bedDay" }), { cut: true });
shot(wt("os", L.L7), (t) => ({ ...closeV(t, wt("os", L.L7), L.L8, "bedDay", bedHero(t, "shock", { tint: [1, 1, 1] }), { fA: 50, fB: 40 }), spot: 0.35 }), { cut: true });
// 4. the scammer is gone + the twist
shot(L.L8, (t) => phoneV(t, L.L8, wt("o", L.L8 + 0.6), "noreply", { name: NUM, clock: "09:21", sub: "", msgs: [["me", "Oi?"], ["me", "Cadê o dinheiro?"], ["me", "Me responde!"]] }, { light: "bedDay" }), { cut: true });
shot(wt("o", L.L8 + 0.6), (t) => ({ ...closeV(t, wt("o", L.L8 + 0.6), L.L9, "bed", bedHero(t, "pained", { tint: [0.82, 0.86, 1.05], prop: null }), { fA: 46, fB: 36 }), spot: 0.55 }), { cut: true });
// 5. the tip
shot(L.L9, (t) => phoneV(t, L.L9, L.L10, "alert", { k: seg(t, L.L9 + 0.3, L.L9 + 0.7, (x) => x), ok: true, clock: "09:30", bal: "R$ 12,40", lines: ["Devolução de Pix", "pelo app do banco"] }, { light: "bedDay" }), { cut: true });
// 6. question + end card
shot(L.L10, (t) => ({ light: "bed", actors: [bedHero(t, "worried")], cam: push(t, L.L10, L.L10 + 4, [0.0, 1.35, 1.0], [-1.0, 1.0, -0.9], [-0.35, 1.3, 0.55], [-1.0, 1.05, -0.9], 60, 54) }), { cut: true });
export const stateAt = makeStateAt(SH, TOTAL, L.L10, { q: ["E VOCÊ,", "O QUE FAZIA?"], a: "DEVOLVIA|NA HORA", b: "LIGAVA PRO|BANCO" });
