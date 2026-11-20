// Shot plan for "Dinheiro fácil". S[i] / E[i] = start / end of sentence i of the narration (generated into story.js).
export const FPS = 30;
export const TOTAL = Math.round(310.4 * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b, e = ss) => e(cl((t - a) / (b - a)));
const blink = (t, s = 1) => ((t * 1000 + s * 777) % 3100) < 120;
const KX = 20, CX = 40, SX = 60, RX = 80, FX = 100, DX = 120, JX = 140, MX = 160;
/** slow camera push from A to B over the shot */
const push = (t, t0, t1, pA, lA, pB, lB, fA = 40, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn, o = {}) => SH.push({ t0, fn, cut: !!o.cut });
const hero = (pos, opts, extra = {}) => ({ id: "hero", pos, opts: { seed: 2, ...opts }, ...extra });
const mae = (pos, opts, extra = {}) => ({ id: "mae", pos, opts: { seed: 8, ...opts }, ...extra });
const PH = (mode, scr = {}, extra = {}) => ({ phone: mode, scr, phoneShot: extra });
// common framings
const BEDHERO = [-1.0, 0.47, -0.9];
const bedWide = (t, t0, t1, expr = "worried", extra = {}) => ({ light: "bed", ...extra, actors: [hero(BEDHERO, { mode: "sit", prop: "phone", expr, blink: blink(t, 3), headTilt: -3 + Math.sin(t * 0.9) * 2 }, { tint: [0.9, 0.94, 1.08] })],
  cam: push(t, t0, t1, [0.25, 1.25, 1.35], [-1.0, 0.95, -1.0], [-0.55, 1.15, 0.45], [-1.0, 1.05, -0.9], 42, 34, -1.5, 0.5) });
const bedPhone = (t, t0, t1, mode, scr = {}, extra = {}) => ({ light: "bed", ...PH(mode, scr, extra.ps || {}), cam: push(t, t0, t1, [-0.95, 1.25, -0.2], [-1.4, 0.7, -1.6], [-0.95, 1.22, -0.25], [-1.4, 0.7, -1.6], 40, 37), vig: 0.55, ...extra });
const kitTable = (t, t0, t1, light, mExpr, hExpr, extra = {}) => ({ light, ...extra, actors: [mae([KX, 0.47, -0.75], { mode: "sit", expr: mExpr, blink: blink(t, 2) }), hero([KX - 0.95, 0.47, 0.05], { mode: "sit", expr: hExpr, blink: blink(t, 3), look: 1 })],
  cam: push(t, t0, t1, [KX + 0.6, 1.4, 2.6], [KX - 0.3, 0.9, -0.3], [KX + 0.35, 1.3, 1.7], [KX - 0.35, 0.95, -0.35], 40, 36) });
const monShot = (t, t0, t1, mode, scr = {}, light = "bed") => ({ light, mon: mode, scr, vig: 0.5, cam: push(t, t0, t1, [1.55, 1.3, -1.05], [1.55, 1.28, -1.99], [1.55, 1.29, -1.3], [1.55, 1.28, -1.99], 44, 40) });
const scamWide = (t, t0, t1, hExpr, light = "scam", extra = {}) => ({ light, mon: "planilha", ...extra,
  actors: [{ id: "c1", pos: [SX - 1.35, 0.47, 0.35], opts: { mode: "sit", expr: "neutral", seed: 4, blink: blink(t, 4) } }, hero([SX - 0.45, 0.47, 0.35], { mode: "sit", expr: hExpr, blink: blink(t, 3), prop: "phone" }),
    { id: "c2", pos: [SX + 0.45, 0.47, 0.35], opts: { mode: "sit", expr: "smile", seed: 5, blink: blink(t, 5) } }, { id: "c3", pos: [SX + 1.35, 0.47, 0.35], opts: { mode: "sit", expr: "neutral", seed: 6, blink: blink(t, 6) } }],
  cam: push(t, t0, t1, [SX + 1.3, 1.55, -2.3], [SX - 0.4, 0.95, 0.35], [SX + 0.4, 1.45, -1.7], [SX - 0.45, 1.0, 0.35], 44, 38) });
const closeHero = (t, t0, t1, light, pos, expr, extra = {}) => { const hy = (extra.mode === "stand" ? 1.5 : 0.95);
  return { light, ...extra, actors: [hero(pos, { mode: extra.mode || "sit", expr, blink: extra.noBlink ? false : blink(t, 3), prop: extra.prop, headTilt: extra.tilt || 0 }, { tint: extra.tint })],
  cam: push(t, t0, t1, [pos[0] + 0.15, pos[1] + hy + 0.1, pos[2] + 1.5], [pos[0], pos[1] + hy, pos[2]], [pos[0] + 0.05, pos[1] + hy + 0.07, pos[2] + 1.05], [pos[0], pos[1] + hy + 0.03, pos[2]], 34, 30) }; };
const tvShot = (t, t0, t1, scr = {}) => ({ light: "kitNight", tv: "news", scr, vig: 0.55, cam: push(t, t0, t1, [KX + 1.55, 0.95, 0.6], [KX + 2.45, 0.91, 0.6], [KX + 1.75, 0.93, 0.6], [KX + 2.45, 0.91, 0.6], 44, 40) });

export function build(S, E) {
  // 1. hook
  shot(0, (t) => bedWide(t, 0, S[2], t < 2.4 ? "neutral" : "worried"));
  shot(S[2], (t) => bedPhone(t, S[2], S[3], "fatura"));
  shot(S[3], (t) => kitTable(t, S[3], S[4], "kitNight", "worried", "worried", {}));
  shot(S[4], (t) => ({ light: "kitNight", actors: [mae([KX, 0.47, -0.75], { mode: "sit", expr: t > S[4] + 1.5 && t < S[4] + 2.6 ? "relief" : "worried", blink: blink(t, 2), headTilt: Math.sin(t * 0.8) * 3 })],
    cam: push(t, S[4], S[5], [KX + 0.2, 1.45, 0.75], [KX, 1.4, -0.75], [KX + 0.1, 1.45, 0.35], [KX, 1.42, -0.75], 34, 30) }));
  shot(S[5], (t) => ({ light: "kitNight", spot: 0.5, cam: push(t, S[5], S[6], [KX + 0.1, 1.3, 0.55], [KX + 0.1, 0.77, 0.15], [KX + 0.1, 1.1, 0.4], [KX + 0.1, 0.77, 0.15], 36, 32) }), { cut: true });
  // 2. the friend
  shot(S[6], (t) => bedPhone(t, S[6], S[8], "feed", { scroll: seg(t, S[6] + 0.8, E[7], (x) => x) * 2 }));
  shot(S[8], (t) => bedPhone(t, S[8], S[10], "chat", { msgs: t < S[9] ? [["me", "Onde você tá trabalhando?"]] : [["me", "Onde você tá trabalhando?"], ["her", "Vem tomar um café comigo."]] }));
  const cafTwo = (t, t0, t1, fExpr, hExpr) => ({ light: "caf", actors: [{ id: "amiga", pos: [CX - 0.75, 0.47, -0.82], opts: { mode: "sit", expr: fExpr, blink: blink(t, 7), seed: 7 } }, hero([CX + 0.15, 0.47, -0.82], { mode: "sit", expr: hExpr, blink: blink(t, 3), look: -1 })],
    cam: push(t, t0, t1, [CX + 0.4, 1.35, 2.2], [CX - 0.3, 0.95, -0.6], [CX - 0.05, 1.3, 1.4], [CX - 0.3, 1.0, -0.7], 40, 36) });
  shot(S[10], (t) => cafTwo(t, S[10], S[13], "smile", t < S[12] ? "neutral" : "shock"));
  const cafFriend = (t, t0, t1, expr, fx) => ({ light: "caf", actors: [{ id: "amiga", pos: [CX - 0.75, 0.47, -0.82], opts: { mode: "sit", expr, blink: blink(t, 7), seed: 7, headTilt: Math.sin(t * 0.7) * 3 } }],
    fx: fx ? [{ type: "money", t: t - t0, pos: [CX - 0.45, 1.6, -0.6], scale: 0.7 }] : [], cam: push(t, t0, t1, [CX - 0.55, 1.45, 0.6], [CX - 0.75, 1.42, -0.82], [CX - 0.65, 1.45, 0.25], [CX - 0.75, 1.44, -0.82], 34, 30) });
  shot(S[13], (t) => cafFriend(t, S[13], S[14], "smile", true));
  shot(S[14], (t) => cafFriend(t, S[14], S[16], t < S[15] ? "sweet" : "creepy", false));
  // 3. the decision
  shot(S[16], (t) => bedWide(t, S[16], S[17], "worried", { spot: 0.3 }));
  shot(S[17], (t) => ({ light: "bed", spot: 0.15, cam: push(t, S[17], S[18], [-1.0, 1.5, -0.4], [-1.0, 2.8, -1.2], [-1.0, 1.5, -0.4], [-0.9, 2.8, -1.0], 50, 44) }));
  shot(S[18], (t) => ({ light: "bed", vig: 0.6, cam: push(t, S[18], S[19], [1.85, 1.25, -1.2], [1.97, 0.77, -1.73], [1.92, 1.1, -1.4], [1.97, 0.77, -1.73], 36, 30) }));
  shot(S[19], (t) => bedPhone(t, S[19], S[20], "chat", { msgs: [["me", "Onde você tá trabalhando?"], ["her", "Vem tomar um café comigo."], ...(t > S[19] + 1.4 ? [["me", "Tô dentro."]] : [])] }));
  shot(S[20], (t) => monShot(t, S[20], S[21], "matricula", { k: seg(t, S[20] + 1.2, S[20] + 1.4, (x) => x) }));
  shot(S[21], (t) => kitTable(t, S[21], S[23], "kit", t < S[22] ? "smile" : "relief_open", "smile_closed", { fx: t > S[22] ? [{ type: "tears", t: t - S[22], pos: [KX, 1.33, -0.68], scale: 0.32 }, { type: "heart", t, pos: [KX - 0.45, 1.75, -0.4], scale: 0.25 }] : [] }));
  // 4. first day
  shot(S[23], (t) => scamWide(t, S[23], S[24], "nervous"));
  shot(S[24], (t) => ({ light: "scam", ...PH("lock", {}, { shake: true }), cam: push(t, S[24], S[25], [SX - 0.45, 1.25, 0.6], [SX - 0.45, 0.8, -0.4], [SX - 0.45, 1.23, 0.55], [SX - 0.45, 0.8, -0.4], 40, 38) }));
  shot(S[25], (t) => ({ ...closeHero(t, S[25], S[26], "scam", [SX - 0.45, 0.47, 0.35], "nervous", { prop: "phone" }), fx: [{ type: "heartbeat", t: t - S[25], pos: [SX - 0.15, 1.15, 0.45], scale: 0.18 }, { type: "sweat", t: t - S[25], pos: [SX - 0.3, 1.55, 0.45], scale: 0.18 }] }));
  shot(S[26], (t) => ({ light: "scam", ...PH("pix", { k: seg(t, S[27] - 0.2, S[27] + 0.25, (x) => x) }, { shake: t < S[27] }), cam: push(t, S[26], S[28], [SX - 0.45, 1.25, 0.6], [SX - 0.45, 0.8, -0.4], [SX - 0.45, 1.23, 0.55], [SX - 0.45, 0.8, -0.4], 40, 37) }), { cut: true });
  shot(S[28], (t) => closeHero(t, S[28], S[30], "bed", BEDHERO, "shock", { prop: "phone", tint: [0.85, 0.92, 1.12], spot: 0.45 }));
  shot(S[30], (t) => ({ ...closeHero(t, S[30], S[31], "bed", BEDHERO, t < S[30] + 1.4 ? "worried" : "neutral", { prop: "phone", tint: [0.85, 0.9, 1.1] }), spot: 0.9 * (1 - seg(t, E[30] - 0.3, E[30] + 0.3)) }), { cut: true });
  // 5. it gets easy
  shot(S[31], (t) => scamWide(t, S[31], S[32], "smile_closed"));
  shot(S[32], (t) => bedPhone(t, S[32], S[34], "paid", {}, { light: "bedDay" }));
  shot(S[34], (t) => ({ light: "kit", actors: [mae([KX - 0.2, 0, -0.9], { mode: "stand", expr: "relief_open", blink: false }), hero([KX + 0.25, 0, -0.85], { mode: "stand", expr: "smile_closed", look: -1 })],
    fx: [{ type: "heart", t, pos: [KX + 0.02, 1.95, -0.7], scale: 0.28 }], cam: push(t, S[34], S[35], [KX + 0.3, 1.45, 1.4], [KX, 1.2, -0.9], [KX + 0.1, 1.4, 0.7], [KX, 1.25, -0.9], 40, 34) }));
  shot(S[35], (t) => ({ light: "streetDay", carRed: true, actors: [hero([RX + 3.0, 0.06, 0.6], { mode: "stand", expr: "grin", prop: "bag", blink: blink(t, 3) })],
    fx: [{ type: "money", t: t - S[35], pos: [RX + 2.4, 1.8, 0.8], scale: 0.9 }], cam: push(t, S[35], S[37], [RX + 5.5, 1.6, 6.5], [RX + 1.8, 1.0, 0.8], [RX + 4.6, 1.45, 4.6], [RX + 2.2, 1.0, 0.9], 40, 36) }));
  shot(S[37], (t) => bedPhone(t, S[37], S[39], "stories", { story: t < S[38] ? "beach" : "car", comments: t > S[38] + 1.6 ? ["Que vida, hein?", "Tá podendo!"] : [] }, { light: "bedDay" }));
  shot(S[39], (t) => scamWide(t, S[39], S[40], "cold", "scam", { hemiK: 0.75 }));
  shot(S[40], (t) => ({ ...monShot(t, S[40], S[41], "planilha", { hi: false }) }));
  // 6. the news
  shot(S[41], (t) => ({ ...kitTable(t, S[41], S[42], "kitNight", "neutral", "neutral"), tv: "news", cam: push(t, S[41], S[42], [KX - 1.6, 1.55, 2.0], [KX + 0.6, 0.9, 0.0], [KX - 1.2, 1.45, 1.5], [KX + 0.9, 0.9, 0.1], 44, 40) }));
  shot(S[42], (t) => tvShot(t, S[42], S[44]));
  shot(S[44], (t) => tvShot(t, S[44], S[45], { name: true }));
  shot(S[45], (t) => closeHero(t, S[45], S[46], "kitNight", [KX - 0.95, 0.47, 0.05], "shock", { noBlink: true }), { cut: true });
  shot(S[46], (t) => monShot(t, S[46], S[47], "planilha", { hi: t > S[46] + 0.5 }), { cut: true });
  shot(S[47], (t) => ({ light: "kitNight", tv: "news", actors: [mae([KX, 0.47, -0.75], { mode: "sit", expr: "stern", blink: blink(t, 2), headTilt: Math.sin(t * 5) * 6 * (t < S[47] + 2.2 ? 1 : 0) })],
    cam: push(t, S[47], S[48], [KX + 0.2, 1.45, 0.75], [KX, 1.4, -0.75], [KX + 0.1, 1.45, 0.35], [KX, 1.42, -0.75], 34, 30) }));
  shot(S[48], (t) => ({ ...closeHero(t, S[48], S[49], "kitNight", [KX - 0.95, 0.47, 0.05], "pained"), spot: 0.6 }));
  // 7. keeps going, paranoia
  shot(S[49], (t) => bedWide(t, S[49], S[50], "worried", { spot: 0.5 }));
  shot(S[50], (t) => bedPhone(t, S[50], S[53], "bill2"));
  shot(S[53], (t) => ({ light: "bed", chips: true, vig: 0.6, cam: push(t, S[53], S[55], [1.38, 1.2, -1.05], [1.38, 0.77, -1.62], [1.38, 1.05, -1.25], [1.38, 0.77, -1.62], 38, 32) }));
  shot(S[55], (t) => ({ light: "street", carRed: true, carDark: true, cam: push(t, S[55], S[57], [RX + 3.0, 3.3, -2.3], [RX + 9.5, 0.6, 2.6], [RX + 4.0, 3.1, -1.8], [RX + 9.5, 0.7, 2.6], 40, 30) }));
  shot(S[57], (t) => ({ ...closeHero(t, S[57], S[59], "bed", BEDHERO, "dazed", { tint: [0.8, 0.86, 1.05] }), spot: 0.55, fx: t > S[58] ? [{ type: "money", t: t - S[58], pos: [-0.6, 1.7, -0.6], scale: 0.5 }] : [] }));
  shot(S[59], (t) => bedPhone(t, S[59], S[62], t < S[61] ? "chat" : "noreply", { msgs: [["me", "Bia?"], ["me", "Tá aí?"], ["me", "Me responde"]] }));
  shot(S[62], (t) => ({ ...closeHero(t, S[62], S[64], "bed", BEDHERO, t < S[63] ? "worried" : "scared", { prop: "phone", tint: [0.85, 0.9, 1.1] }), spot: 0.5 + 0.4 * seg(t, S[63], E[63]) }));
  // 8. the police
  shot(S[64], (t) => ({ light: "streetDawn", carRed: true, carPol: true, actors: [{ id: "pol", pos: [RX + 1.6, 0.06, -1.9], opts: { mode: "stand", expr: "stern", seed: 11 } }, { id: "pol2", key: "pol2", pos: [RX + 2.5, 0.06, -1.7], opts: { mode: "stand", expr: "stern", seed: 12 } }],
    fx: t > E[64] - 0.9 && t < E[64] + 1.4 ? [{ type: "knock", t: t - (E[64] - 0.9), pos: [RX + 1.85, 1.9, -2.2], scale: 0.9 }] : [], cam: push(t, S[64], S[66], [RX + 6, 1.7, 5.5], [RX + 1.9, 1.1, -2.0], [RX + 4.6, 1.6, 3.6], [RX + 1.9, 1.15, -2.0], 40, 34) }), { cut: true });
  shot(S[66], (t) => ({ light: "kit", hemiK: 0.7, kdoor: 1, actors: [mae([KX - 2.0, 0, 0.6], { mode: "stand", expr: t < S[68] ? "worried" : "scared", blink: blink(t, 2) })],
    cam: push(t, S[66], S[69], [KX + 0.8, 1.5, 1.8], [KX - 2.0, 1.2, 0.6], [KX + 0.2, 1.5, 1.6], [KX - 2.0, 1.3, 0.6], 40, 34) }));
  shot(S[69], (t) => ({ light: "kit", hemiK: 0.7, kdoor: 1, actors: [{ id: "pol", pos: [KX - 1.2, 0, 0.9], opts: { mode: "stand", expr: "stern", seed: 11 } }, { id: "pol2", pos: [KX - 1.9, 0, 0.5], opts: { mode: "stand", expr: "stern", seed: 12 } }, mae([KX - 0.4, 0, -0.9], { mode: "stand", expr: "scared" })],
    cam: push(t, S[69], S[70], [KX + 1.8, 1.55, 2.0], [KX - 1.2, 1.2, 0.3], [KX + 1.4, 1.55, 1.7], [KX - 1.2, 1.25, 0.3], 42, 38) }), { cut: true });
  shot(S[70], (t) => ({ light: "kit", hemiK: 0.7, actors: [mae([KX - 0.4, 0, -0.9], { mode: "stand", expr: "cold", blink: false })], spot: 0.35,
    cam: push(t, S[70], S[71], [KX - 0.25, 1.5, 0.4], [KX - 0.4, 1.47, -0.9], [KX - 0.3, 1.5, 0.05], [KX - 0.4, 1.48, -0.9], 34, 28) }));
  shot(S[71], (t) => ({ light: "streetDawn", carRed: true, carPol: true, actors: [{ id: "pol", pos: [RX + 0.6, 0.06, -0.6], opts: { mode: "stand", prop: "bag", expr: "stern", seed: 11 } }, hero([RX + 1.6, 0.06, -1.3], { mode: "stand", expr: "pained" }),
    { id: "v1", pos: [RX + 5.2, 0.06, -0.9], opts: { mode: "stand", expr: "shock", seed: 13 } }, { id: "v2", pos: [RX + 6.0, 0.06, -1.1], opts: { mode: "stand", expr: "worried", seed: 14 } }],
    cam: push(t, S[71], S[74], [RX + 3.4, 1.6, 6.0], [RX + 2.5, 1.1, -0.8], [RX + 3.0, 1.55, 4.2], [RX + 2.6, 1.1, -0.9], 42, 38) }));
  shot(S[74], (t) => ({ light: "del", mon: "processo", actors: [{ id: "delegado", pos: [DX, 0.47, -1.35], opts: { mode: "sit", expr: "stern", blink: blink(t, 9), seed: 15 } }, hero([DX + 0.5, 0.47, 0.35], { mode: "sit", expr: "worried", blink: blink(t, 3) })],
    cam: push(t, S[74], S[75], [DX + 1.6, 1.5, 2.2], [DX + 0.1, 1.0, -0.6], [DX + 1.2, 1.45, 1.6], [DX + 0.1, 1.0, -0.6], 40, 36) }));
  shot(S[75], (t) => ({ light: "del", mon: "processo", vig: 0.55, cam: push(t, S[75], S[78], [DX - 0.5, 1.0, -0.35], [DX - 0.5, 0.98, -0.877], [DX - 0.5, 0.99, -0.5], [DX - 0.5, 0.98, -0.877], 44, 40) }), { cut: true });
  shot(S[78], (t) => bedPhone(t, S[78], S[79], "blocked", {}, { light: "bed" }), { cut: true });
  shot(S[79], (t) => ({ light: "streetDawn", carRed: true, carPol: true, actors: [{ id: "pol2", pos: [RX + 0.0, 0.06, 0.9], opts: { mode: "stand", expr: "stern", seed: 12 } }],
    cam: push(t, S[79], S[80], [RX + 4.0, 1.3, 5.0], [RX + 1.2, 0.8, 1.4], [RX + 3.4, 1.25, 4.2], [RX + 1.2, 0.8, 1.4], 40, 36) }));
  shot(S[80], (t) => bedPhone(t, S[80], S[81], "empty", {}, { light: "bed" }));
  shot(S[81], (t) => ({ ...closeHero(t, S[81], S[83], "bed", BEDHERO, "pained", { tint: [0.82, 0.86, 1.05] }), spot: 0.75 }));
  // 9. the hearing
  shot(S[83], (t) => ({ light: "crt", actors: [mae([JX - 2.0, 0.49, 1.7], { mode: "sit", expr: "worried", blink: blink(t, 2) }), hero([JX - 1.25, 0.49, 1.7], { mode: "sit", expr: "pained", blink: blink(t, 3) })],
    fx: t > S[85] ? [{ type: "heart", t, pos: [JX - 1.62, 1.0, 1.85], scale: 0.18 }] : [], cam: push(t, S[83], S[86], [JX - 1.0, 1.45, 4.4], [JX - 1.6, 1.1, 1.7], [JX - 1.4, 1.4, 3.3], [JX - 1.6, 1.15, 1.7], 40, 34) }));
  shot(S[86], (t) => ({ light: "crt", actors: [{ id: "advogado", pos: [JX + 0.9, 0, -0.3], opts: { mode: "stand", expr: "stern", blink: blink(t, 10), seed: 16, headTilt: Math.sin(t * 2) * 2 } }, { id: "juiz", pos: [JX, 0.3, -2.75], opts: { mode: "stand", expr: "neutral", seed: 17 } }],
    cam: push(t, S[86], S[89], [JX - 0.8, 1.45, 2.4], [JX + 0.5, 1.2, -1.0], [JX - 0.3, 1.45, 1.6], [JX + 0.7, 1.3, -0.8], 42, 36) }));
  shot(S[89], (t) => ({ light: "del", mon: "vitimas", scr: { hi: t > S[89] + 1.8 }, vig: 0.55, cam: push(t, S[89], S[90], [DX - 0.5, 1.0, -0.35], [DX - 0.5, 0.98, -0.877], [DX - 0.5, 0.99, -0.5], [DX - 0.5, 0.98, -0.877], 44, 40) }));
  shot(S[90], (t) => ({ ...closeHero(t, S[90], S[92], "crt", [JX - 1.25, 0.49, 1.7], "pained"), spot: 0.8 }));
  // 10. today
  shot(S[92], (t) => ({ light: "mkt", actors: [{ id: "heroWork", key: "hw", pos: [MX + 0.3, 0, -0.75], opts: { mode: "stand", expr: "neutral", prop: "bag", blink: blink(t, 3), seed: 2 } }],
    cam: push(t, S[92], S[94], [MX + 3.3, 1.55, -0.7], [MX + 0.3, 1.1, -0.75], [MX + 2.3, 1.5, -0.72], [MX + 0.3, 1.15, -0.75], 40, 34) }));
  shot(S[94], (t) => ({ light: "fac", actors: [hero([FX + lerp(-3, 1.5, seg(t, S[94], S[96], (x) => x)), 0.06, -0.6], { mode: t < S[95] + 1 ? "stroll" : "stand", phase: t * 1.1, expr: "worried", blink: blink(t, 3) })],
    cam: push(t, S[94], S[96], [FX - 1, 1.5, 6], [FX - 0.5, 2.2, -3], [FX + 0.5, 1.6, 4.8], [FX, 3.4, -4], 42, 44) }));
  shot(S[96], (t) => ({ ...closeHero(t, S[96], S[99], "fac", [FX + 1.5, 0.06, -0.6], t < S[98] ? "worried" : "neutral", { mode: "stand" }), spot: 0.25 + 0.35 * seg(t, S[97], S[99]) }));
  // 11. outro: question + montage back to the start
  shot(S[99], (t) => bedWide(t, S[99] - 6, S[99] + 4, "worried"), { cut: true });
  shot(S[100], (t) => kitTable(t, S[100] - 2, S[100] + 3, "kitNight", "worried", "worried"), { cut: true });
  shot(S[101], (t) => cafTwo(t, S[101] - 2, S[101] + 3, "smile", "neutral"), { cut: true });
  shot(S[101] + 1.0, (t) => scamWide(t, S[101], S[101] + 3, "nervous"), { cut: true });
  shot(S[102], (t) => bedWide(t, S[102] - 1, S[102] + 5, "worried"), { cut: true });
  SH.sort((a, b) => a.t0 - b.t0);
}
const XF = 0.5;
export function stateAt(t) {
  let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++;
  const cur = SH[i]; const st = { a: cur.fn(t) };
  if (i > 0 && !cur.cut && t < cur.t0 + XF) { st.b = st.a; st.a = SH[i - 1].fn(t); st.mix = ss((t - cur.t0) / XF); }
  if (t > TOTAL / FPS - 0.8) st.dark = seg(t, TOTAL / FPS - 0.8, TOTAL / FPS);
  return st;
}

const S = [0.0, 2.86, 4.8, 13.8, 17.86, 22.1, 23.68, 26.16, 30.56, 32.98, 36.0, 38.66, 39.88, 40.98, 44.86, 47.84, 49.66, 52.94, 54.32, 55.96, 58.9, 61.94, 66.04, 68.36, 70.36, 71.74, 76.54, 78.84, 79.78, 83.76, 87.42, 90.36, 93.16, 95.58, 100.62, 105.16, 108.02, 114.3, 117.54, 121.32, 124.64, 127.7, 134.34, 137.4, 141.92, 143.98, 145.42, 147.68, 154.04, 156.74, 160.84, 163.38, 165.32, 166.36, 169.4, 172.36, 174.86, 178.68, 180.94, 185.54, 189.14, 190.56, 192.94, 195.6, 198.92, 203.54, 205.3, 208.06, 209.08, 210.2, 213.66, 218.5, 222.62, 223.96, 226.08, 231.38, 232.84, 233.72, 235.36, 237.38, 239.16, 242.88, 244.0, 246.36, 249.94, 251.24, 252.38, 256.04, 259.7, 263.12, 266.88, 269.72, 274.94, 278.0, 282.66, 285.72, 291.76, 293.7, 296.76, 299.36, 302.26, 303.82, 305.64];
const E = [2.38, 4.2, 13.38, 17.48, 21.48, 23.12, 26.16, 30.4, 32.6, 35.32, 38.12, 39.58, 40.62, 44.44, 47.42, 49.02, 52.44, 53.9, 55.96, 58.32, 61.56, 65.5, 67.88, 69.74, 71.42, 76.1, 78.42, 79.78, 83.4, 86.92, 89.92, 92.8, 95.18, 100.12, 104.64, 108.02, 113.88, 117.06, 120.9, 124.26, 127.34, 133.94, 137.4, 141.54, 143.62, 145.1, 147.24, 153.66, 156.32, 160.26, 163.38, 164.9, 166.36, 169.12, 171.8, 174.38, 178.14, 180.28, 185.08, 188.58, 190.12, 192.38, 195.6, 198.44, 203.0, 204.76, 207.58, 208.66, 209.72, 213.28, 218.16, 222.28, 223.96, 225.64, 230.8, 232.52, 233.72, 234.94, 236.9, 238.84, 242.46, 243.7, 245.94, 249.48, 250.92, 252.38, 256.04, 259.24, 262.66, 266.48, 269.1, 274.34, 278.0, 282.16, 285.72, 291.32, 293.32, 296.26, 299.08, 301.86, 303.28, 305.64, 309.74];
build(S, E);
