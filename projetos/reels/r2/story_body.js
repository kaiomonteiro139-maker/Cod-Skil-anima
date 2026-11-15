// Reel 2 — "O amigo do empréstimo". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory.py).
import { FPS as _F, push, hero, actor, closeV, phoneV, makeStateAt, seg, lin, blink, BEDHERO, X } from "./vlib.js";
export const FPS = _F;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const CX = X.caf, FPOS = [CX - 0.75, 0.47, -0.82], HPOS = [CX + 0.15, 0.47, -0.82];
const leo = (t, expr, o = {}) => actor("c2", FPOS, { mode: "sit", expr, blink: blink(t, 5), seed: 5, headTilt: o.tilt ?? Math.sin(t * 0.8) * 3 });
const meCaf = (t, expr) => hero(HPOS, { mode: "sit", expr, blink: blink(t, 3), look: -1 });
const meBed = (t, expr, o = {}) => hero(BEDHERO, { mode: "sit", prop: o.prop ?? "phone", expr, blink: blink(t, 3), headTilt: o.tilt ?? Math.sin(t * 0.9) * 2 }, { tint: o.tint || [0.92, 0.95, 1.06] });
const BEACH = { jacket: "#f2a03a", pants: "#2d6fd0", boots: "#f4f1ea", hat: "hair", hair: "#141414", skin: "#e8c0a0", buttons: "#ffffff" };
const tag = (t, text, t0, o = {}) => ({ text, k: seg(t, t0, t0 + 0.25, (x) => x), ...o });
// 1. the ask, at the café
shot(0, (t) => ({ light: "caf", actors: [leo(t, "sweet"), meCaf(t, "neutral")], cam: push(t, 0, L.L2, [CX + 0.05, 1.3, 1.9], [CX - 0.3, 1.0, -0.8], [CX - 0.15, 1.28, 1.25], [CX - 0.3, 1.02, -0.8], 60, 52) }), { cut: true });
shot(L.L2, (t) => closeV(t, L.L2, L.L3, "caf", leo(t, t < wt("paga", L.L2) ? "sweet" : "grin", { tilt: 6 })));
shot(L.L3, (t) => ({ ...closeV(t, L.L3, L.L4, "caf", meCaf(t, t < wt("afinal", L.L3) ? "neutral" : "smile_closed")), fx: [{ type: "money", t: t - L.L3, pos: [CX - 0.15, 1.6, -0.6], scale: 0.6 }] }));
// 2. one month, two, three (phone, the chat grows, day/night flips)
const MSG = [["me", "E aí, e o dinheiro?"], ["me", "Léo?"], ["me", "LÉO???"]];
shot(L.L4, (t) => ({ ...phoneV(t, L.L4, L.L5, "chat", { name: "Léo", clock: "19:40", msgs: MSG.slice(0, 1) }, { light: "bed" }), tag: tag(t, "1 MÊS", L.L4) }), { cut: true });
shot(L.L4b, (t) => ({ ...phoneV(t, L.L4, L.L5, "chat", { name: "Léo", clock: "08:12", msgs: MSG.slice(0, 2) }, { light: "bedDay" }), tag: tag(t, "2 MESES", L.L4b, { rot: 0.03 }) }), { cut: true });
shot(L.L4c, (t) => ({ ...phoneV(t, L.L4, L.L5, "chat", { name: "Léo", clock: "23:55", msgs: MSG }, { light: "bed" }), tag: tag(t, "3 MESES", L.L4c, { color: "#ff5a4a" }) }), { cut: true });
shot(L.L5, (t) => phoneV(t, L.L5, wt("não", L.L5), "noreply", { name: "Léo", sub: "online", note: "", clock: "23:58", msgs: [...MSG, ["me", "Responde aí!"]] }, { light: "bed" }), { cut: true });
shot(wt("não", L.L5), (t) => closeV(t, wt("não", L.L5), L.L6, "bed", meBed(t, "worried")), { cut: true });
// 3. the social feed → Cancún
shot(L.L6, (t) => phoneV(t, L.L6, L.L7, "feed", { user: "leo.vibes", clock: "13:02", scroll: 0.15 + 0.5 * seg(t, L.L6 + 0.3, L.L7 + 0.2, (x) => x) }, { light: "bedDay" }), { cut: true });
shot(L.L7, (t) => ({ ...phoneV(t, L.L7, wt("com", L.L7), "stories", { story: "beach", who: BEACH, whoOpts: { mode: "stand", expr: "grin", seed: 5 } }, { light: "bedDay" }), tag: tag(t, "CANCÚN", L.L7 + 0.15, { y: 0.12, color: "#3fd2ff" }) }), { cut: true });
shot(wt("com", L.L7), (t) => ({ ...closeV(t, wt("com", L.L7), L.L8, "bedDay", meBed(t, "shock", { tint: [1, 1, 1] }), { fA: 50, fB: 40 }), spot: 0.3 }), { cut: true });
shot(L.L8, (t) => phoneV(t, L.L8, L.L9, "stories", { story: "beach", who: BEACH, whoOpts: { mode: "stand", expr: "laugh", seed: 5 }, comments: t > wt("quem", L.L8) - 0.1 ? ["Quem tem amigo, tem tudo!"] : [] }, { light: "bedDay" }), { cut: true });
// 4. question + end card
shot(L.L9, (t) => ({ ...closeV(t, L.L9, L.L9 + 4, "bedDay", meBed(t, "angry", { tint: [1, 1, 1], prop: null }), { fA: 54, fB: 46 }) }), { cut: true });
export const stateAt = makeStateAt(SH, TOTAL, L.L9, { q: ["E AÍ,", "O QUE VOCÊ FAZ?"], a: "COBRO NOS|COMENTÁRIOS", b: "DEIXO|PRA LÁ" });
