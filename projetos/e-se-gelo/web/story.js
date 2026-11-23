const L = {"L1": 0.62, "L2": 3.632, "L3": 9.611, "L4": 14.378, "L5": 18.783, "L6": 23.056, "L7": 25.704};
const E = {"L1": 3.332, "L2": 9.411, "L3": 14.178, "L4": 18.583, "L5": 22.856, "L6": 25.404, "L7": 30.578};
const VEND = 30.578;
const WT = [["E", 0.62], ["se", 0.72], ["o", 0.82], ["gelo", 0.92], ["quebrasse...", 1.18], ["e", 1.52], ["você", 1.7], ["caísse", 1.78], ["num", 2.2], ["lago", 2.34], ["congelado?", 2.58], ["O", 3.56], ["frio", 3.76], ["vai", 4.02], ["tirar", 4.18], ["o", 4.44], ["seu", 4.62], ["ar.", 4.78], ["Não", 5.52], ["entra", 5.7], ["em", 5.94], ["pânico!", 6.06], ["Em", 6.92], ["um", 7.12], ["minuto,", 7.24], ["a", 7.84], ["respiração", 7.9], ["volta", 8.5], ["ao", 8.72], ["normal.", 8.98], ["Agora,", 9.58], ["vira", 10.3], ["pro", 10.48], ["lado", 10.66], ["de", 10.88], ["onde", 11.04], ["você", 11.18], ["veio.", 11.46], ["Ali", 12.44], ["o", 12.68], ["gelo", 12.8], ["aguentou", 13.04], ["o", 13.48], ["seu", 13.62], ["peso.", 13.72], ["Coloca", 14.34], ["os", 14.6], ["braços", 14.92], ["em", 15.32], ["cima", 15.54], ["do", 15.78], ["gelo...", 15.9], ["e", 16.22], ["chuta", 16.24], ["as", 16.38], ["pernas,", 16.56], ["como", 17.1], ["se", 17.32], ["estivesse", 17.48], ["nadando.", 17.78], ["Saiu?", 18.82], ["Não", 19.74], ["levanta!", 19.96], ["Rola", 20.96], ["no", 21.22], ["gelo", 21.34], ["pra", 21.64], ["espalhar", 21.76], ["o", 22.14], ["seu", 22.32], ["peso.", 22.4], ["Depois,", 23.04], ["só", 23.86], ["fica", 24.02], ["de", 24.26], ["pé", 24.44], ["lá", 24.6], ["na", 24.76], ["margem.", 24.86], ["Você", 25.66], ["sabia", 25.9], ["disso?", 26.28], ["Comenta!", 27.26], ["E", 27.74], ["segue", 28.5], ["pra", 28.78], ["ver", 28.98], ["o", 29.16], ["próximo:", 29.28], ["e", 29.94], ["se", 30.02], ["você...", 30.08]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "E se você caísse num lago congelado?". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const tFall = wt("quebrasse", L.L1) + 0.12, tCalm = wt("minuto", L.L2), tTurn0 = wt("vira", L.L3), tTurn1 = wt("veio", L.L3) + 0.2;
const tArms = wt("braços", L.L4), tKick = wt("chuta", L.L4), tOut0 = wt("como", L.L4), tOut1 = E.L4 + 0.1, tRoll = wt("rola", L.L5);
const PRONE_Z = 1.55;
export function build() {
  shot(0, (t) => { const z = lerp(2.6, 0.2, ease(lin(t, 0, 0.95))); return { crack: lin(t, 0.55, tFall), shake: t > 0.55 ? 0.4 : 0,
    guy: { pos: [0, 0, z], yaw: Math.PI, walk: t < 0.95 ? t * 1.6 : null, face: t > 0.6 ? "scared" : "calm", headPitch: t > 0.6 ? 0.5 : 0, arms: t > 0.75 ? "up" : "down" },
    cam: { pos: [0.8, 2.3, z + 2.7], look: [0, 0.9, z - 1.2], fov: 50 } }; });
  shot(tFall, (t) => { const u = lin(t, tFall, tFall + 0.35); return { broke: 1, splash: lin(t, tFall, tFall + 0.8), shake: Math.max(0, 1 - (t - tFall) / 1.2) * 1.5, red: 0.3 + 0.2 * Math.sin(t * 8), flash: t < tFall + 0.15 ? 0.6 : 0, breath: 2,
    guy: { pos: [0, 0, 0], yaw: Math.PI, sink: lerp(0, 1.3, u) - Math.sin(t * 3) * 0.04, arms: "flail", face: "scared", bob: 1 },
    cam: push(t, tFall, L.L2, [0.6, 1.5, -3.0], [0, 0.4, 0], [0.4, 1.3, -2.4], [0, 0.5, 0], 46, 44) }; });
  shot(L.L2, (t) => { const calm = lin(t, tCalm, tCalm + 0.8); return { broke: 1, red: 0.2 * (1 - calm), breath: calm > 0.5 ? 1 : 2, shake: 0.25 * (1 - calm),
    guy: { pos: [0, 0, 0], yaw: Math.PI, sink: 1.18 - Math.sin(t * 2.5) * 0.03, arms: calm > 0.5 ? "tuck" : "flail", face: calm > 0.5 ? "calm" : "scared" },
    cam: push(t, L.L2, L.L3, [0.3, 0.85, -2.9], [0, 0.5, 0], [0.22, 0.8, -2.5], [0, 0.5, 0], 44, 42) }; });
  shot(L.L3, (t) => ({ broke: 1, breath: 1,
    guy: { pos: [0, 0, 0], yaw: lerp(Math.PI, 0, ease(lin(t, tTurn0, tTurn1))), sink: 1.18 - Math.sin(t * 2.5) * 0.03, arms: "tuck", face: "calm" },
    cam: push(t, L.L3, L.L4, [1.6, 3.8, -2.6], [0, 0, 1.0], [1.3, 3.3, -2.1], [0, 0, 1.2], 52, 50) }));
  shot(L.L4, (t) => { const o = ease(lin(t, tOut0, tOut1)); return { broke: 1, breath: 1,
    guy: { pos: [0, 0, lerp(0.05, PRONE_Z, o)], yaw: 0, sink: lerp(1.18, 0, o), prone: t < tArms ? 0 : lerp(0.35, 1, o), arms: t < tArms ? "tuck" : t < tOut0 ? "forward" : "pull", kick: t > tKick, face: "calm" },
    cam: { pos: [2.4 - 0.2 * o, 1.0, -0.1 + 1.3 * o], look: [0, 0.25, 0.2 + 1.2 * o], fov: 46 } }; });
  shot(E.L4 + 0.15, (t) => { const x = 2.0 * ease(lin(t, tRoll, E.L5)); return { broke: 1,
    guy: { pos: [x, -0.1, PRONE_Z], yaw: 0, prone: 1, roll: x / 0.26, arms: t < tRoll ? "forward" : "tuck", face: "calm" },
    cam: { pos: [x + 0.4, 2.3, PRONE_Z + 2.4], look: [x, 0, PRONE_Z - 0.2], fov: 48 } }; });
  shot(L.L6, (t) => ({ broke: 1, guy: { pos: [2.2, 0, 7.0], yaw: Math.PI, arms: "up", face: "happy", walk: null }, cam: push(t, L.L6, L.L7, [2.8, 1.3, 3.4], [2.2, 1.35, 7.0], [2.6, 1.3, 3.9], [2.2, 1.35, 7.0], 46, 44) }));
  shot(L.L7, (t) => ({ broke: 1, guy: { pos: [2.2, 0, 7.0], yaw: Math.PI, arms: "wave", face: "happy" }, cam: push(t, L.L7, VEND + 2.2, [2.35, 1.75, 4.7], [2.2, 1.5, 7.0], [2.3, 1.75, 5.05], [2.2, 1.52, 7.0], 42, 40) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
const lab = (text, t0, t1, t) => (t > t0 && t < t1 ? { text, k: lin(t, t0, t0 + 0.25), label: true, y: 0.2 } : null);
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = [lab("NÃO ENTRA EM PÂNICO!", wt("pânico", L.L2) - 0.1, L.L3, t), lab("VOLTA PELO MESMO LADO!", tTurn0, L.L4, t), lab("CHUTA E PUXA!", tKick, E.L4 + 0.1, t),
    lab("NÃO LEVANTA!", wt("não", L.L5), tRoll, t), lab("ROLA, NÃO ANDA!", tRoll, L.L6, t), lab("SALVO! ✅", L.L6 + 0.2, L.L7, t)].filter(Boolean);
  if (t > wt("segue", L.L7) - 0.1) st.follow = { k: lin(t, wt("segue", L.L7) - 0.1, wt("segue", L.L7) + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
