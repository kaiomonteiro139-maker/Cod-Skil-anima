// Shot plan for "O Sonho do Caio" (Parte 1). Times are the narration's line times (spans.json).
export const FPS = 30;
export const TOTAL = Math.round(62.0 * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const back = (x) => { x = cl(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b, e = ss) => e(cl((t - a) / (b - a)));
function keys(t, K, creep = 0.012) {
  let i = 0; while (i < K.length - 1 && t > K[i + 1][0]) i++;
  const A = K[i], B = K[Math.min(i + 1, K.length - 1)];
  const u = B === A ? 0 : (B[5] || ss)(cl((t - A[0]) / (B[0] - A[0])));
  const pos = L3(A[1], B[1], u), look = L3(A[2], B[2], u);
  pos[0] += Math.sin(t * 0.7) * creep; pos[1] += Math.sin(t * 0.93 + 1) * creep * 0.6;
  return { pos, look, fov: lerp(A[3] ?? 40, B[3] ?? 40, u), roll: lerp(A[4] ?? 0, B[4] ?? 0, u) };
}
const blink = (t, s = 1) => ((t * 1000 + s * 777) % 3300) < 110;
const AX = 200, ATOP = 16 * 0.18, IX = 300, BX = 400;
const stairY = (z) => cl(0.18 * ((6 - z) / 0.35 + 1), 0, ATOP);
// background kids running around the field (side view)
const kidsPlay = (t, n = 2) => [["k1", -4, -3, 0.9], ["k2", 3, -5, 1.1], ["k3", -8, -6, 0.8]].slice(0, n).map(([id, x0, z, sp], i) => {
  const x = x0 + Math.sin(t * 0.35 * sp + i) * 5, dir = Math.cos(t * 0.35 * sp + i) >= 0;
  return { id, key: id + "bg", side: true, flip: !dir, pos: [x, 0, z], opts: { mode: "march", phase: t * 1.6 * sp, stride: 0.8, expr: "grin", seed: 4 + i } }; });

export const SHOTS = [
  // 1. "Esse é o Caio. Ele tem quinze anos... e joga bola descalço." — juggling at golden hour
  { t0: 0, t1: 4.62, fn: (t) => {
    const ph = (t % 0.72) / 0.72, by = 0.12 + 1.05 * Math.sin(Math.PI * ph), hit = ph < 0.08 || ph > 0.92;
    return { light: "golden", ball: { pos: [0.08, by, 3.38], spin: t * 6, squash: hit ? 0.88 : 1 },
      actors: [{ id: "caio", pos: [0, 0, 3], opts: { expr: t < 1.7 ? "smile_closed" : "grin", mode: "stand", blink: blink(t, 3), look: 0, headTilt: Math.sin(t * 4.4) * 3, seed: 3 } }, ...kidsPlay(t)],
      cam: keys(t, [[0, [2.8, 1.35, 5.6], [0, 1.25, 3], 32], [1.8, [2.5, 1.2, 5.2], [0, 1.15, 3], 32], [3.2, [0.9, 0.32, 4.3], [0.05, 0.25, 3], 38], [4.62, [0.8, 0.3, 4.15], [0.05, 0.22, 3], 36]]) };
  } },
  // 2. "A chuteira rasgou faz dois anos." — the torn cleat on a rock
  { t0: 4.62, t1: 7.7, fn: (t) => ({ light: "golden", sunSize: 200,
      cam: keys(t, [[4.62, [-4.7, 0.75, 9.4], [-6, 0.4, 8.3], 34], [7.7, [-5.1, 0.65, 9.1], [-6, 0.4, 8.3], 30]], 0.004) }) },
  // 3. "Todo dia, ele treina no campinho de terra." — crane over the field and the favela
  { t0: 7.7, t1: 10.85, fn: (t) => { const x = -4 + (t - 7.7) * 1.6;
    return { light: "golden", ball: { pos: [x + 0.45, 0.11, 1.0], spin: t * 10 },
      actors: [{ id: "caio", side: true, pos: [x, 0, 1.0], opts: { mode: "march", phase: t * 1.7, stride: 0.9, expr: "grin", seed: 3 } }, ...kidsPlay(t, 3)],
      cam: keys(t, [[7.7, [10, 1.8, 15], [0, 1.2, 0], 40], [10.85, [11, 7.5, 18], [-2, 3.5, -14], 44]]) }; } },
  // 4. "Com uma bola murcha... e um gol feito de chinelo." — low shot, the kick through the flip-flops
  { t0: 10.85, t1: 13.8, fn: (t) => { const k = seg(t, 12.35, 13.3, eo), x = lerp(11.3, 14.6, k);
    return { light: "golden", ball: { pos: [x, 0.11, lerp(0.1, -0.05, k)], squash: t < 12.35 ? 0.74 : 0.8, spin: k * 30 },
      fx: t > 12.35 && t < 12.9 ? [{ type: "puff", t: (t - 12.35) / 0.55, pos: [11.2, 0.0, 0.1], scale: 0.35 }] : [],
      cam: keys(t, [[10.85, [10.7, 0.28, 0.55], [11.3, 0.1, 0.1], 34], [12.3, [9.9, 0.55, 0.25], [12.8, 0.12, 0.0], 40], [13.8, [9.7, 0.6, 0.2], [13.3, 0.12, 0.0], 40]], 0.004) }; } },
  // 5. "A mãe dele é faxineira." — she climbs the alley at dusk with the bucket
  { t0: 13.8, t1: 15.95, fn: (t) => { const z = lerp(5.2, 3.0, seg(t, 13.8, 15.95, (x) => x));
    return { light: "dusk", sunVis: false, bucket: [AX + 0.32, stairY(z) + 0.0, z + 0.05],
      actors: [{ id: "mae", pos: [AX, stairY(z), z], opts: { mode: "stroll", phase: t * 1.3, expr: "worried", blink: blink(t, 2), seed: 8 } }],
      cam: keys(t, [[13.8, [AX - 0.3, ATOP + 1.2, 0.6], [AX, 1.4, 4.5], 38], [15.95, [AX - 0.2, ATOP + 1.05, 0.9], [AX, 1.6, 3.6], 36]]) }; } },
  // 6. "Em casa, às vezes falta comida." — the almost empty cupboard
  { t0: 15.95, t1: 18.7, fn: (t) => ({ light: "inside", lamp: 6, lampPos: [IX + 1.4, 2.4, -1.0], fill: 3, fillPos: [IX + 0.5, 1.8, 1.5],
      actors: [{ id: "mae", pos: [IX + 1.5, 0, -1.7], opts: { mode: "stand", expr: "worried", blink: blink(t, 2), look: 1, facing: 1, seed: 8 } }],
      cam: keys(t, [[15.95, [IX + 0.6, 1.5, 1.6], [IX + 1.9, 1.4, -2.4], 40], [18.7, [IX + 1.0, 1.55, 0.5], [IX + 2.2, 1.5, -2.6], 36]]) }) },
  // 7. "Mas nunca falta sonho." — night, Caio on the mattress hugging the ball, the poster
  { t0: 18.7, t1: 21.3, fn: (t) => ({ light: "insideNight", lamp: 1.5, lampPos: [IX - 2.0, 1.6, -2.4], ballIn: [IX - 2.3, 0.62, -1.38],
      actors: [{ id: "caio", pos: [IX - 2.3, 0.2, -1.5], opts: { mode: "sit", expr: "relief", look: -1, facing: -1, seed: 3 } }],
      fx: t > 19.3 ? [{ type: "stars", t: (t - 19.3) * 0.6, pos: [IX - 2.6, 1.55, -1.5], scale: 0.3 }] : [],
      cam: keys(t, [[18.7, [IX - 0.6, 1.1, 1.0], [IX - 2.4, 0.95, -1.5], 40], [21.3, [IX - 1.0, 1.0, 0.3], [IX - 2.5, 1.0, -1.5], 36]]) }) },
  // 8. "Até que, numa tarde, um homem de boné para na beira do campo." — the scout arrives
  { t0: 21.3, t1: 25.4, fn: (t) => { const w = seg(t, 21.4, 23.6, (x) => x), op = L3([9.5, 0, 12.5], [6.5, 0, 9.8], ss(w));
    return { light: "golden",
      actors: [{ id: "olheiro", pos: op, opts: { mode: w < 1 ? "stroll" : "stand", phase: w * 3, expr: "neutral", blink: blink(t, 5), seed: 6 } }, ...kidsPlay(t, 3)],
      cam: keys(t, [[21.3, [3.5, 1.0, 5.0], [7.5, 1.3, 10.5], 40], [25.4, [4.2, 1.1, 6.0], [6.5, 1.35, 9.8], 34]]) }; } },
  // 9. "É um olheiro. De um time grande." — close on him, impressed
  { t0: 25.4, t1: 28.6, fn: (t) => ({ light: "golden",
      actors: [{ id: "olheiro", pos: [6.5, 0, 9.8], opts: { mode: "stand", expr: t < 27.0 ? "neutral" : "whistle", blink: blink(t, 5), look: -1, seed: 6 } }],
      fx: t > 27.0 ? [{ type: "burst", t: (t - 27.0) * 0.5, pos: [6.5, 1.0, 10.3], scale: 1.2, alpha: 0.5 }] : [],
      cam: keys(t, [[25.4, [5.6, 1.5, 7.6], [6.5, 1.5, 9.8], 32], [28.6, [5.95, 1.52, 8.3], [6.5, 1.55, 9.8], 28]], 0.005) }) },
  // 10. "Ele vê o Caio driblar três de uma vez..." — the dribble
  { t0: 28.6, t1: 31.35, fn: (t) => { const x = lerp(-5, 5.2, seg(t, 28.6, 31.35, (u) => u));
    const kid = (id, kx, tf) => ({ id, pos: [kx, 0, 1.2 + (id === "k2" ? -0.5 : 0.4)], opts: t > tf ? { mode: "fall", expr: "dazed", seed: 4 } : { mode: "stand", expr: "stern", look: -1, seed: 4 }, roll: t > tf ? 0 : 0 });
    const fx = [{ type: "speed", t: t, pos: [x - 1.0, 0.7, 1.0], scale: 0.6, alpha: 0.6 }];
    for (const [tf, kx] of [[29.4, -2], [30.0, 0], [30.6, 2.1]]) if (t > tf && t < tf + 0.6) fx.push({ type: "puff", t: (t - tf) / 0.6, pos: [kx, 0, 1.4], scale: 0.5 });
    return { light: "golden", ball: { pos: [x + 0.5 + Math.sin(t * 14) * 0.1, 0.11, 1.0], spin: t * 14 }, fx,
      actors: [{ id: "caio", side: true, pos: [x, 0, 1.0], opts: { mode: "march", phase: t * 2.6, stride: 1.2, expr: "grin", seed: 3 } }, kid("k1", -2, 29.4), kid("k2", 0, 30.0), kid("k3", 2.1, 30.6)],
      cam: keys(t, [[28.6, [x - 1, 1.3, 6.5], [x, 0.8, 1], 40], [31.35, [x - 0.6, 1.3, 6.5], [x, 0.8, 1], 40]].map((k, i) => [k[0], [lerp(-6, 4.6, i), 1.3, 6.5], [lerp(-5, 5.2, i), 0.8, 1.0], 40]), 0.01) }; } },
  // 11. "...e entrega um papel." — the hand-over at the sideline
  { t0: 31.35, t1: 32.62, fn: (t) => { const k = seg(t, 31.4, 32.3);
    return { light: "golden", paper: { pos: L3([6.25, 1.25, 9.4], [5.95, 1.15, 9.0], k), face: true },
      actors: [{ id: "caio", pos: [5.6, 0, 8.7], opts: { mode: "stand", expr: "shock", look: 1, facing: 1, seed: 3 } }, { id: "olheiro", pos: [6.6, 0, 9.4], opts: { mode: "stand", expr: "smile", look: -1, facing: -1, seed: 6 } }],
      cam: keys(t, [[31.35, [6.1, 1.4, 6.2], [6.1, 1.25, 9.0], 36], [32.62, [6.05, 1.35, 6.6], [6.1, 1.2, 9.0], 33]]) }; } },
  // 12. "Teste no sábado. Em São Paulo." — the paper, close
  { t0: 32.62, t1: 35.85, fn: (t) => ({ light: "golden", paper: { pos: [6.0, 1.3 + Math.sin(t * 9) * 0.003, 7.95], face: true, roll: 0.04 * Math.sin(t * 1.3) },
      cam: keys(t, [[32.62, [6.0, 1.32, 7.45], [6.0, 1.3, 7.95], 34], [35.85, [6.0, 1.31, 7.55], [6.0, 1.3, 7.95], 31]], 0.002) }) },
  // 13. "O Caio corre pra casa gritando." — up the alley, paper in hand
  { t0: 35.85, t1: 38.6, fn: (t) => { const z = lerp(5.6, 0.4, seg(t, 35.85, 38.4, (x) => x));
    return { light: "golden", sunVis: false, paper: { pos: [AX + 0.28, stairY(z) + 1.25, z + 0.15], face: true, roll: Math.sin(t * 12) * 0.2 },
      actors: [{ id: "caio", pos: [AX, stairY(z), z], opts: { mode: "march", phase: t * 2.4, expr: "laugh", seed: 3 } }],
      fx: t > 36.4 ? [{ type: "shout", t: t, pos: [AX - 0.45, stairY(z) + 1.9, z], scale: 0.5 }] : [],
      cam: keys(t, [[35.85, [AX + 0.2, ATOP + 1.4, -0.6], [AX, 1.2, 4.5], 38], [38.6, [AX + 0.3, ATOP + 1.3, -1.2], [AX, ATOP + 0.9, 1.0], 40]]) }; } },
  // 14. "A mãe chora de alegria." — at the door
  { t0: 38.6, t1: 41.05, fn: (t) => ({ light: "golden", sunVis: false, door: 1, paper: { pos: [AX - 0.05, ATOP + 1.15, -0.2], face: true, roll: 0.1 },
      actors: [{ id: "mae", pos: [AX + 0.45, ATOP, -0.7], opts: { mode: "stand", expr: "relief_open", look: -1, blink: false, seed: 8 } }, { id: "caio", pos: [AX - 0.35, ATOP, -0.35], opts: { mode: "stand", expr: "laugh", look: 1, seed: 3 } }],
      fx: [{ type: "tears", t: t - 38.6, pos: [AX + 0.45, ATOP + 1.15, -0.62], scale: 0.32 }, { type: "heart", t: t, pos: [AX + 0.05, ATOP + 2.15, -0.5], scale: 0.22 }, { type: "stars", t: (t - 38.6) * 0.5, pos: [AX, ATOP + 1.4, -0.4], scale: 0.7, alpha: 0.8 }],
      cam: keys(t, [[38.6, [AX - 0.1, ATOP + 1.45, 2.3], [AX + 0.05, ATOP + 1.25, -0.5], 36], [41.05, [AX - 0.05, ATOP + 1.42, 1.7], [AX + 0.05, ATOP + 1.3, -0.5], 32]]) }) },
  // 15. "Aí ela abre a carteira." — the wallet on the table
  { t0: 41.05, t1: 43.45, fn: (t) => ({ light: "inside", lamp: 5, lampPos: [IX + 1.3, 2.3, -0.4], wallet: seg(t, 41.6, 42.6),
      cam: keys(t, [[41.05, [IX + 1.3, 1.45, 0.4], [IX + 1.3, 0.79, -0.47], 36], [43.45, [IX + 1.3, 1.35, 0.15], [IX + 1.3, 0.79, -0.47], 33]], 0.003) }) },
  // 16. "Tem doze reais." — the contents, colour drains
  { t0: 43.45, t1: 45.65, fn: (t) => ({ light: "inside", lamp: 4, lampPos: [IX + 1.3, 2.3, -0.4], wallet: 1, satK: lerp(1, 0.55, seg(t, 43.6, 45.0)), vig: 0.7,
      cam: keys(t, [[43.45, [IX + 1.31, 1.3, -0.05], [IX + 1.31, 0.8, -0.45], 34], [45.65, [IX + 1.31, 1.22, -0.12], [IX + 1.31, 0.8, -0.45], 31]], 0.002) }) },
  // 17. "A passagem de ônibus custa trezentos." — the price board at the bus station
  { t0: 45.65, t1: 49.35, fn: (t) => ({ light: "station", satK: 0.85, vig: 0.6,
      actors: [{ id: "caio", pos: [BX + 1.2, 0, -0.6], opts: { back: true, mode: "stand", seed: 3 } }],
      cam: keys(t, [[45.65, [BX - 0.2, 1.5, 4.4], [BX + 1.6, 1.7, -2.8], 42], [47.4, [BX + 1.0, 1.7, 2.2], [BX + 2.1, 1.8, -2.8], 40], [49.35, [BX + 2.0, 1.85, 0.6], [BX + 2.2, 1.75, -2.83], 40]]) }) },
  // 18. "E agora... o Caio depende de você." + end card — the rooftop at sunset
  { t0: 49.35, t1: 63, fn: (t) => ({ light: "golden", sunSize: 220, ballIn: [-16.1, 3.62, 12.3],
      actors: [{ id: "caio", pos: [-16.15, 3.38, 12.05], floor: 3.38, opts: { mode: "sit", expr: t < 51.0 ? "worried" : "smile_closed", look: t < 50.6 ? -1 : 0, blink: blink(t, 3), seed: 3 } }],
      cam: keys(t, [[49.35, [-11.6, 4.1, 15.2], [-16.2, 3.9, 12.1], 40], [51.5, [-13.6, 4.15, 13.4], [-16.15, 4.05, 12.05], 32], [62, [-13.9, 4.2, 13.2], [-16.15, 4.15, 12.05], 30]]),
      dark: 0.42 * seg(t, 51.9, 52.6), overlay: (g, W, H, tt) => endCard(g, W, H, tt) }) },
];
export const shotAt = (t) => SHOTS.find((s) => t < s.t1) || SHOTS[SHOTS.length - 1];

// ---------------- end card: the goal (on-screen text) ----------------
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export const GOAL = { have: 0, need: 300 };
function endCard(g, W, H, t) {
  const k = W / 1080, sc = (a) => (t < a ? 0 : back((t - a) / 0.35));
  const pop = (x, y, s, fn) => { if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s * k, s * k); fn(); g.restore(); };
  const T = (s, size, y, fill, wgt = 900) => { g.font = `${wgt} ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.18; g.strokeStyle = "#140c16"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  pop(W / 2, H * 0.15, sc(52.1), () => { T("META DO CAIO", 92, -40, "#ffd23f"); T("PASSAGEM PRO TESTE", 56, 50, "#ffffff"); });
  pop(W / 2, H * 0.29, sc(52.6), () => {
    g.fillStyle = "#140c16"; rr(g, -440, -60, 880, 120, 60); g.fill(); g.fillStyle = "#2a2f38"; rr(g, -426, -46, 852, 92, 46); g.fill();
    const fr = Math.min(1, GOAL.have / GOAL.need) * cl((t - 52.9) / 0.8); if (fr > 0) { g.fillStyle = "#2fb36a"; rr(g, -426, -46, Math.max(92, 852 * fr), 92, 46); g.fill(); }
    T(`R$ ${GOAL.have} / R$ ${GOAL.need}`, 58, 2, "#ffffff"); });
  pop(W / 2, H * 0.41, sc(53.0), () => { g.rotate(-0.03); g.fillStyle = "#e5483b"; rr(g, -420, -70, 840, 140, 34); g.fill(); g.strokeStyle = "#140c16"; g.lineWidth = 10; rr(g, -420, -70, 840, 140, 34); g.stroke(); T("CADA SEGUIDOR = R$ 1", 64, 4, "#ffffff"); });
  pop(W / 2, H * 0.51, sc(55.0), () => T("ATÉ SÁBADO!", 60, 0, "#ffffff"));
  pop(W / 2, H * 0.585, sc(58.3), () => { T("A PARTE 2 MOSTRA", 50, 0, "#ffd23f"); T("SE O CAIO CONSEGUIU", 50, 62, "#ffd23f"); });
}
