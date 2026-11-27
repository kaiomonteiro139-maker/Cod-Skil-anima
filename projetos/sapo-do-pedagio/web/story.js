const L = {"L1": 0.62, "L2": 4.489, "L3": 7.092, "L4": 11.443, "L5": 14.375, "L6": 20.034, "L7": 24.406, "L8": 29.122, "L9": 33.208, "L10": 35.637, "L11": 38.614, "L12": 42.68};
const E = {"L1": 4.239, "L2": 6.942, "L3": 11.243, "L4": 14.175, "L5": 19.834, "L6": 24.206, "L7": 28.922, "L8": 33.008, "L9": 35.437, "L10": 38.314, "L11": 42.38, "L12": 44.639};
const VEND = 44.639;
const WT = [["Esse", 0.62], ["sapo", 0.8], ["virou", 1.22], ["o", 1.4], ["bicho", 1.52], ["mais", 1.72], ["rico", 1.96], ["da", 2.28], ["floresta...", 2.46], ["sem", 2.86], ["trabalhar", 3.04], ["um", 3.38], ["único", 3.64], ["dia!", 3.86], ["Ele", 4.42], ["morava", 4.62], ["em", 5.0], ["cima", 5.18], ["da", 5.38], ["única", 5.58], ["ponte", 5.92], ["do", 6.32], ["rio.", 6.52], ["E", 7.0], ["um", 7.18], ["dia,", 7.3], ["ele", 7.6], ["teve", 7.94], ["uma", 8.12], ["ideia:", 8.32], ["quem", 9.02], ["quisesse", 9.14], ["passar,", 9.62], ["ia", 10.3], ["ter", 10.5], ["que", 10.66], ["pagar.", 10.78], ["Uma", 11.443], ["mosca", 11.62], ["por", 11.96], ["bicho.", 12.14], ["E", 13.06], ["todo", 13.18], ["mundo", 13.36], ["pagou.", 13.64], ["Na", 14.34], ["outra", 14.52], ["semana,", 14.76], ["eram", 15.42], ["duas", 15.6], ["moscas.", 15.88], ["Depois,", 17.02], ["cinco.", 17.56], ["Depois,", 18.84], ["dez!", 19.2], ["Os", 20.04], ["bichos", 20.18], ["reclamavam...", 20.48], ["mas", 21.16], ["pagavam.", 21.26], ["Não", 22.24], ["tinha", 22.56], ["outro", 22.82], ["jeito", 23.12], ["de", 23.4], ["atravessar.", 23.58], ["Até", 24.38], ["que", 24.6], ["uma", 24.76], ["tartaruga", 24.9], ["velha", 25.42], ["falou:", 25.74], ["eu", 26.38], ["sei", 26.5], ["nadar.", 26.64], ["Sobe", 27.52], ["nas", 27.88], ["minhas", 28.02], ["costas!", 28.28], ["Ela", 29.18], ["não", 29.26], ["cobrou", 29.44], ["nada.", 29.78], ["Só", 30.78], ["pediu", 31.04], ["que", 31.38], ["cada", 31.52], ["um", 31.82], ["ajudasse", 31.94], ["o", 32.36], ["próximo.", 32.5], ["Em", 33.16], ["um", 33.3], ["mês,", 33.44], ["ninguém", 33.82], ["mais", 34.02], ["passava", 34.26], ["pela", 34.7], ["ponte.", 34.9], ["E", 35.66], ["o", 35.72], ["sapo,", 35.78], ["cercado", 36.32], ["de", 36.74], ["moscas,", 36.88], ["ficou", 37.36], ["sozinho.", 37.56], ["Quem", 38.58], ["cobra", 38.76], ["caro", 39.12], ["demais", 39.5], ["pela", 39.74], ["ajuda...", 39.98], ["um", 40.22], ["dia", 40.4], ["descobre", 40.52], ["que", 41.06], ["não", 41.18], ["era", 41.34], ["o", 41.52], ["único", 41.64], ["caminho.", 41.84], ["Manda", 42.62], ["isso", 42.88], ["pra", 43.16], ["alguém", 43.4], ["que", 43.64], ["precisa", 43.84], ["ouvir.", 44.14]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "O sapo do pedágio" (fábula curta). Hook: the frog is already rich.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const FP = [0, 0.28, -0.2];
const rich = (o = {}) => ({ pos: FP, yaw: 0.15, crown: 1, scale: 1.3, happy: 1, ...o });
const plain = (o = {}) => ({ pos: FP, yaw: 0.2, ...o });
const tollAt = (t) => (t < wt("duas", L.L5) ? 1 : t < wt("cinco", L.L5) ? 2 : t < wt("dez", L.L5) ? 5 : 10);
const TP = [-1.1, -0.28, 1.4];
const queue = (t, o = {}) => ({ pup: { pos: [-2.2, 0, 0.9], yaw: 0.9, sit: 1, sad: 1, ears: -1, ...o }, bear: { pos: [-2.9, 0, 0.3], yaw: 0.8, sad: 1, hug: 1 } });
export function build() {
  shot(0, (t) => ({ frog: rich(), flies: 1, glint: 1, buzz: 0.4, toll: 10, cam: push(t, 0, L.L2, [0.45, 1.35, 1.75], [0.2, 0.55, -0.2], [0.35, 1.25, 1.45], [0.15, 0.58, -0.2], 44, 40) }));
  shot(L.L2, (t) => ({ frog: plain(), cam: push(t, L.L2, L.L3, [3.2, 2.4, 5.8], [0, 0.2, 0], [2.6, 2.0, 4.8], [0, 0.25, 0], 46, 44) }));
  shot(L.L3, (t) => ({ frog: plain({ happy: t > wt("ideia", L.L3) ? 1 : 0, yaw: 0.1 }), cam: push(t, L.L3, wt("quem", L.L3), [0.35, 1.25, 1.55], [0, 0.48, -0.2], [0.3, 1.2, 1.35], [0, 0.5, -0.2], 42, 40) }));
  shot(wt("quem", L.L3), (t) => ({ frog: plain({ happy: 1, yaw: -0.6 }), toll: 1, signK: lin(t, wt("pagar", L.L3) - 0.2, wt("pagar", L.L3) + 0.2), cam: push(t, wt("quem", L.L3), L.L4, [-1.1, 1.3, 2.1], [-2.15, 0.85, -0.5], [-1.25, 1.28, 1.85], [-2.2, 0.85, -0.5], 48, 46) }));
  shot(L.L4, (t) => { const u = lin(t, L.L4, E.L4 + 0.1), x = u < 0.4 ? lerp(-2.6, -0.5, u / 0.4) : u < 0.6 ? -0.5 : lerp(-0.5, 2.4, (u - 0.6) / 0.4); const pay = lin(t, lerp(L.L4, E.L4, 0.42), lerp(L.L4, E.L4, 0.58));
    return { frog: plain({ happy: 1, yaw: -0.3 }), toll: 1, flies: pay >= 1 ? 0.03 : 0.01, pay, pup: { pos: [x, 0.28, 0.25], yaw: Math.PI / 2, run: u < 0.4 || u > 0.6 ? t : null, sad: 0.5, ears: 0 }, cam: push(t, L.L4, L.L5, [0.4, 1.3, 3.4], [-0.5, 0.4, 0], [0.6, 1.2, 3.0], [-0.2, 0.4, 0], 46, 44) }; });
  shot(L.L5, (t) => ({ frog: plain({ happy: 1 }), toll: tollAt(t), flies: 0.15, cam: push(t, L.L5, wt("dez", L.L5) - 0.2, [-1.55, 1.3, 1.75], [-2.42, 1.0, -0.5], [-1.7, 1.25, 1.45], [-2.42, 1.02, -0.52], 42, 40) }));
  shot(wt("dez", L.L5) - 0.2, (t) => ({ frog: rich({ scale: lerp(1.0, 1.25, lin(t, wt("dez", L.L5), E.L5)), crown: 1 }), toll: 10, flies: lerp(0.3, 0.6, lin(t, wt("dez", L.L5), E.L5)), glint: 1, cam: push(t, wt("dez", L.L5) - 0.2, L.L6, [0.45, 1.35, 1.7], [0.2, 0.55, -0.2], [0.38, 1.3, 1.45], [0.2, 0.55, -0.2], 42, 40) }));
  shot(L.L6, (t) => ({ frog: rich({ scale: 1.25 }), toll: 10, flies: 0.7, ...queue(t), cam: push(t, L.L6, L.L7, [-3.0, 1.4, 3.2], [-2.3, 0.5, 0.2], [-2.7, 1.3, 2.8], [-2.2, 0.5, 0.2], 46, 44) }));
  shot(L.L7, (t) => { const up = ease(lin(t, L.L7, L.L7 + 0.8)), hop = ease(lin(t, wt("sobe", L.L7), wt("costas", L.L7) + 0.3)); const q = queue(t, { sad: 1 - hop, ears: hop > 0 ? 1 : -1 });
    q.pup.pos = L3([-2.2, 0, 0.9], [TP[0], 0.08, TP[2]], hop); q.pup.pos[1] += Math.sin(hop * Math.PI) * 0.4; q.pup.yaw = 0.9 + hop * 0.7; if (hop > 0) q.pup.sit = 1;
    return { tur: { pos: [TP[0], lerp(-0.7, TP[1], up), TP[2]], yaw: -1.2, flip: 0, sad: 0, happy: 1 }, toll: 10, flies: 0.7, frog: rich({ scale: 1.25 }), ...q, cam: push(t, L.L7, L.L8, [0.3, 1.4, 4.4], [-1.5, 0.3, 1.0], [0.1, 1.3, 4.0], [-1.5, 0.3, 1.0], 48, 46) }; });
  shot(L.L8, (t) => { const x = lerp(TP[0], 1.15, ease(lin(t, L.L8, E.L8))); return { tur: { pos: [x, TP[1], TP[2]], yaw: Math.PI / 2, flip: 0, flail: 1, happy: 1, sad: 0 }, pup: { pos: [x, 0.08, TP[2]], yaw: Math.PI / 2, sit: 1, wag: 1, ears: 1, tongue: 1 }, bear: queue(t).bear, frog: rich({ scale: 1.25 }), flies: 0.7, toll: 10,
    cam: { pos: [x + 0.3, 0.75, TP[2] + 2.3], look: [x, 0.15, TP[2]], fov: 46 } }; });
  shot(L.L9, (t) => { const x = lerp(TP[0], 1.15, ease(lin(t, L.L9, E.L9 + 0.5))); return { tur: { pos: [x, TP[1], TP[2]], yaw: Math.PI / 2, flip: 0, flail: 1, happy: 1, sad: 0 }, bear: { pos: [x, 0.08, TP[2]], yaw: Math.PI / 2, happy: 1 }, frog: rich({ scale: 1.25, happy: 0 }), flies: 0.8, toll: 10,
    cam: push(t, L.L9, L.L10, [3.6, 3.2, 6.0], [0, 0, 0.6], [3.0, 2.8, 5.2], [0, 0, 0.6], 46, 44) }; });
  shot(L.L10, (t) => ({ frog: rich({ scale: 1.3, happy: 0, tired: 0.6, crown: 1 }), flies: 1, buzz: 1, toll: 10, cam: push(t, L.L10, L.L11, [0.4, 1.3, 1.5], [0.15, 0.58, -0.2], [0.8, 1.7, 2.8], [0.1, 0.45, -0.2], 40, 44) }));
  shot(L.L11, (t) => { const x = lerp(-1.2, 1.2, ((t - L.L11) / 4) % 1); return { vig: 0.2, tur: { pos: [x, TP[1], TP[2] + 1.0], yaw: Math.PI / 2, flip: 0, flail: 1, happy: 1, sad: 0 }, pup: { pos: [x, 0.08, TP[2] + 1.0], yaw: Math.PI / 2, sit: 1, wag: 1, ears: 1 }, frog: rich({ scale: 1.3, happy: 0, tired: 0.6 }), flies: 1, toll: 10,
    cam: push(t, L.L11, L.L12, [2.6, 2.2, 5.6], [0, 0.1, 1.6], [1.8, 2.8, 4.6], [0, 0.1, 1.4], 46, 48) }; });
  shot(L.L12, (t) => ({ frog: rich({ happy: 0, tired: 0.5 }), flies: 1, buzz: 0.6, toll: 10, cam: push(t, L.L12, VEND + 2.2, [0.45, 1.35, 1.75], [0.2, 0.55, -0.2], [0.35, 1.25, 1.45], [0.15, 0.58, -0.2], 44, 40) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
