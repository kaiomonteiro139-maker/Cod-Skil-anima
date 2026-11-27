const L = {"L1": 0.62, "L2": 3.585, "L3": 8.177, "L4": 14.099, "L5": 19.767, "L6": 25.805};
const E = {"L1": 3.285, "L2": 7.977, "L3": 13.899, "L4": 19.567, "L5": 25.505, "L6": 30.71};
const VEND = 30.71;
const WT = [["E", 0.62], ["se", 0.72], ["você", 0.82], ["cavasse", 1.0], ["um", 1.42], ["buraco...", 1.54], ["até", 1.86], ["o", 2.1], ["outro", 2.22], ["lado", 2.42], ["da", 2.68], ["Terra?", 2.84], ["Saindo", 3.54], ["do", 3.98], ["Brasil,", 4.14], ["você", 4.8], ["ia", 5.04], ["sair", 5.2], ["no", 5.44], ["meio", 5.6], ["do", 5.76], ["Oceano", 5.94], ["Pacífico,", 6.24], ["perto", 7.06], ["do", 7.28], ["Japão!", 7.48], ["Mas", 8.14], ["o", 8.3], ["buraco", 8.46], ["mais", 8.78], ["fundo", 9.0], ["que", 9.36], ["já", 9.56], ["cavaram", 9.72], ["tem", 10.08], ["só", 10.22], ["doze", 10.42], ["quilômetros.", 10.76], ["E", 11.98], ["a", 12.22], ["Terra", 12.3], ["tem", 12.54], ["quase", 12.8], ["treze", 13.1], ["mil!", 13.5], ["Lá", 14.099], ["no", 14.24], ["centro,", 14.36], ["faz", 15.06], ["mais", 15.22], ["de", 15.44], ["cinco", 15.62], ["mil", 15.9], ["graus.", 16.08], ["Quase", 17.1], ["tão", 17.54], ["quente", 17.74], ["quanto", 18.02], ["a", 18.26], ["superfície", 18.76], ["do", 19.0], ["Sol!", 19.18], ["E", 19.767], ["se", 19.86], ["desse", 19.98], ["pra", 20.32], ["pular?", 20.48], ["Você", 21.34], ["ia", 21.72], ["cair", 21.88], ["por", 22.06], ["uns", 22.26], ["quarenta", 22.4], ["minutos,", 22.6], ["chegar", 23.54], ["do", 23.76], ["outro", 24.02], ["lado...", 24.28], ["e", 24.58], ["cair", 24.72], ["de", 24.9], ["volta!", 25.0], ["Você", 25.74], ["sabia", 25.96], ["disso?", 26.38], ["Comenta!", 27.4], ["E", 28.38], ["segue", 28.64], ["pra", 28.88], ["ver", 29.1], ["o", 29.28], ["próximo:", 29.42], ["e", 30.06], ["se", 30.16], ["você...", 30.22]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "E se você cavasse um buraco até o outro lado da Terra?". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const R = 3, tDive = wt("outro", L.L1), tJump = wt("pular", L.L5), tOther = wt("lado", wt("chegar", L.L5)) + 0.2, tBack = wt("volta", L.L5) + 0.3;
const digger = { pos: [0.85, 0, 0.1], yaw: -Math.PI / 2, arms: "dig", shovel: 1, lean: 0.25, face: "calm" };
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.6), dig: 1, guy: digger, cam: push(t, 0, tDive, [1.6, 3.6, 4.4], [0.1, 0.3, 0], [1.3, 3.1, 3.7], [0.1, 0.3, 0], 50, 46) }));
  shot(tDive, (t) => { const u = lin(t, tDive, L.L2); return { guy: { ...digger, arms: "down", face: "scared", headPitch: 0.6 }, dark: lin(t, L.L2 - 0.35, L.L2), cam: { pos: [0.02, lerp(2.6, -1.8, ease(u)), 0.02], look: [0, -6, 0], fov: lerp(55, 70, u) } }; });
  const top = (t) => ({ pos: [0.07, R, 0.07], yaw: Math.PI * 0.25, scale: 0.12, arms: "wave", face: "happy" });
  shot(L.L2, (t) => ({ space: 1, pins: 1, dark: 1 - lin(t, L.L2, L.L2 + 0.35), guy: top(t), cam: push(t, L.L2, L.L3, [9.0, 3.4, 9.0], [0, 0, 0], [8.0, 2.6, 8.0], [0, 0, 0], 50, 48) }));
  shot(L.L3, (t) => ({ space: 1, guy: top(t), cam: push(t, L.L3, L.L4, [1.6, R + 0.9, 1.6], [0.05, R - 0.2, 0.05], [1.2, R + 0.6, 1.2], [0.05, R - 0.3, 0.05], 45, 42) }));
  shot(L.L4, (t) => ({ space: 1, hot: lin(t, wt("cinco", L.L4), wt("cinco", L.L4) + 0.6), red: 0.15 + 0.1 * Math.sin(t * 5), cam: push(t, L.L4, L.L5, [3.0, 1.0, 3.0], [0, 0, 0], [1.6, 0.4, 1.6], [0, 0, 0], 46, 42) }));
  shot(L.L5, (t) => { let y = R; if (t > tJump && t < tOther) y = R * Math.cos(Math.PI * ease(lin(t, tJump, tOther))); else if (t >= tOther) y = -R * Math.cos(Math.PI * 0.6 * ease(lin(t, tBack - 0.2, E.L5 + 0.3))); if (t >= tOther && t < tBack - 0.2) y = -R;
    return { space: 1, pins: 1, guy: { pos: [0.07, y, 0.07], yaw: Math.PI * 0.25, scale: 0.32, arms: t > tJump ? "up" : "down", face: t > tJump ? "scared" : "calm" }, cam: { pos: [6.2, 0.6 + y * 0.5, 6.2], look: [0, y * 0.6, 0], fov: 46 } }; });
  shot(L.L6, (t) => ({ guy: { pos: [0.95, 0, 0.5], yaw: 0.35, arms: "wave", face: "happy", shovel: 0 }, cam: push(t, L.L6, VEND + 2.2, [1.7, 1.6, 3.4], [0.9, 1.25, 0.4], [1.5, 1.65, 3.0], [0.9, 1.3, 0.4], 44, 42) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
const lab = (text, t0, t1, t) => (t > t0 && t < t1 ? { text, k: lin(t, t0, t0 + 0.25), label: true, y: 0.2 } : null);
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = [lab("OCEANO PACÍFICO 🌊", wt("pacífico", L.L2) - 0.1, L.L3, t), lab("MAIS FUNDO JÁ FEITO: 12 KM", wt("doze", L.L3) - 0.1, wt("terra", L.L3) - 0.1, t), lab("ATÉ O OUTRO LADO: 12.742 KM", wt("terra", L.L3) - 0.1, L.L4, t),
    lab("🔥 +5.000 °C", wt("cinco", L.L4) - 0.1, L.L5, t), lab("⏱ ~40 MINUTOS", wt("quarenta", L.L5) - 0.1, L.L6, t)].filter(Boolean);
  if (t > wt("segue", L.L6) - 0.1) st.follow = { k: lin(t, wt("segue", L.L6) - 0.1, wt("segue", L.L6) + 0.2), tap: 0, hand: true };
  st.dark = Math.max(st.a.dark ?? 0, t > TOTAL / FPS - 0.35 ? lin(t, TOTAL / FPS - 0.35, TOTAL / FPS) : 0); return st; }
