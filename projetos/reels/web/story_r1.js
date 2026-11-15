const L = {"L1": 0.12, "L2": 2.823, "L3": 4.148, "L4": 5.512, "L5": 9.484, "L6": 12.176, "L7": 14.453, "L8": 19.143, "L9": 22.636, "L10": 25.343};
const E = {"L1": 2.623, "L2": 3.898, "L3": 5.362, "L4": 9.184, "L5": 11.776, "L6": 14.303, "L7": 18.843, "L8": 22.286, "L9": 24.993, "L10": 27.417};
const VEND = 27.417;
const WT = [["Cai", 0.12], ["um", 0.265], ["Pix", 0.41], ["de", 0.7], ["três", 0.86], ["mil", 1.0], ["reais", 1.14], ["na", 1.42], ["sua", 1.9], ["conta!", 2.06], ["De", 2.78], ["um", 2.94], ["desconhecido.", 3.02], ["Aí", 4.14], ["chega", 4.3], ["a", 4.54], ["mensagem:", 4.7], ["Pelo", 5.5], ["amor", 5.66], ["de", 5.98], ["Deus,", 6.14], ["mandei", 6.68], ["errado!", 7.0], ["Era", 8.02], ["o", 8.16], ["dinheiro", 8.26], ["do", 8.48], ["aluguel!", 8.68], ["Você", 9.44], ["fica", 9.66], ["com", 9.96], ["dó,", 10.2], ["e", 10.42], ["devolve", 10.88], ["na", 11.2], ["hora.", 11.4], ["No", 12.14], ["outro", 12.36], ["dia,", 12.62], ["o", 13.34], ["banco", 13.44], ["te", 13.66], ["liga:", 13.9], ["o", 14.48], ["Pix", 14.56], ["foi", 14.8], ["contestado.", 15.02], ["Os", 16.36], ["três", 16.58], ["mil", 16.767], ["saíram", 17.14], ["da", 17.58], ["sua", 17.72], ["conta", 17.88], ["de", 18.22], ["novo!", 18.4], ["Prejuízo", 19.1], ["de", 19.52], ["três", 19.68], ["mil!", 20.107], ["O", 20.96], ["golpe", 21.12], ["era", 21.36], ["você", 21.5], ["devolver!", 21.72], ["O", 22.64], ["certo", 22.76], ["é", 22.94], ["devolver", 23.08], ["só", 23.44], ["pelo", 23.6], ["aplicativo", 23.82], ["do", 24.38], ["banco.", 24.5], ["E", 25.26], ["você?", 25.44], ["O", 26.44], ["que", 26.6], ["fazia?", 26.72]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
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
