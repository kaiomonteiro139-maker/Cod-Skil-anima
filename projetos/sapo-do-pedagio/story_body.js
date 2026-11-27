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
