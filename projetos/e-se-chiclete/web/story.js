const L = {"L1": 0.12, "L2": 2.06, "L3": 6.754, "L4": 9.953, "L5": 12.919, "L6": 16.345, "L7": 21.881};
const E = {"L1": 1.76, "L2": 6.554, "L3": 9.753, "L4": 12.719, "L5": 16.145, "L6": 21.581, "L7": 26.762};
const VEND = 26.762;
const WT = [["E", 0.0], ["se", 0.22], ["você", 0.32], ["engolisse", 0.54], ["um", 1.0], ["chiclete?", 1.12], ["Dizem", 2.04], ["que", 2.42], ["ele", 2.56], ["fica", 2.64], ["sete", 2.88], ["anos", 3.3], ["grudado", 3.48], ["na", 3.98], ["sua", 4.12], ["barriga.", 4.3], ["Mas", 5.3], ["isso", 5.54], ["é", 5.8], ["mentira!", 5.92], ["O", 6.8], ["seu", 6.88], ["estômago", 7.0], ["não", 7.4], ["consegue", 7.58], ["digerir", 7.94], ["a", 8.48], ["borracha", 8.58], ["do", 8.88], ["chiclete...", 9.08], ["Então", 9.92], ["ele", 10.16], ["só", 10.32], ["passa", 10.5], ["direto", 10.7], ["pelo", 11.22], ["seu", 11.42], ["corpo,", 11.62], ["inteirinho.", 12.16], ["Em", 12.9], ["uns", 13.0], ["dois", 13.16], ["ou", 13.38], ["três", 13.56], ["dias,", 13.84], ["ele", 14.54], ["já", 14.72], ["saiu...", 14.88], ["junto", 15.18], ["com", 15.38], ["o", 15.62], ["cocô!", 15.74], ["O", 16.32], ["perigo", 16.44], ["é", 16.78], ["engolir", 16.86], ["muitos", 17.24], ["de", 17.58], ["uma", 17.78], ["vez.", 17.9], ["Aí", 18.9], ["eles", 19.14], ["podem", 19.3], ["formar", 19.58], ["uma", 20.02], ["bola", 20.16], ["e", 20.52], ["entupir", 20.74], ["tudo.", 21.08], ["Você", 21.84], ["sabia", 22.08], ["disso?", 22.48], ["Comenta!", 23.5], ["E", 24.54], ["segue", 24.76], ["pra", 24.98], ["ver", 25.18], ["o", 25.36], ["próximo:", 25.46], ["e", 26.14], ["se", 26.2], ["você...", 26.3]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "E se você engolisse um chiclete?". Starts straight with the narration (no meme intro).
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const GP = [0.4, 0, 0.3], tPop = 0.95, tGulp = 1.25;
const g0 = (o = {}) => ({ pos: GP, yaw: -0.1, arms: "down", face: "calm", ...o });
const XR = [0.5, 1.45, 2.4], XL = [0.4, 1.4, 0.3];
export function build() {
  shot(0, (t) => ({ bubble: t < tPop ? lin(t, 0.1, tPop) : 0, gum: t > tGulp ? 0.2 * lin(t, tGulp, L.L2) : 0.0, guy: g0({ face: t > tPop && t < tGulp + 0.3 ? "scared" : "calm", headPitch: t > tGulp && t < tGulp + 0.4 ? -0.35 : 0, arms: t > tGulp ? "belly" : "down" }),
    cam: push(t, 0, L.L2, [0.6, 1.85, 1.7], [0.4, 1.8, 0.3], [0.5, 1.8, 1.3], [0.4, 1.78, 0.3], 42, 38) }));
  shot(L.L2, (t) => ({ xray: lin(t, L.L2, L.L2 + 0.5), gum: 0.2, guy: g0({ face: t > wt("mentira", L.L2) ? "happy" : "scared" }), cam: push(t, L.L2, L.L3, [0.8, 1.6, 2.6], [0.4, 1.3, 0.3], ...[XR, XL], 46, 42) }));
  shot(L.L3, (t) => ({ xray: 1, acid: 1, gum: lerp(0.2, 0.5, lin(t, L.L3, L.L4)), guy: g0(), cam: push(t, L.L3, L.L4, XR, XL, [0.46, 1.4, 2.0], [0.4, 1.36, 0.3], 42, 40) }));
  shot(L.L4, (t) => ({ xray: 1, gum: lerp(0.5, 0.9, ease(lin(t, wt("passa", L.L4) - 0.2, E.L4))), guy: g0(), cam: push(t, L.L4, L.L5, [0.45, 1.3, 2.1], [0.4, 1.2, 0.3], [0.43, 1.28, 1.9], [0.4, 1.18, 0.3], 40, 40) }));
  shot(L.L5, (t) => ({ xray: lerp(1, 0.6, lin(t, L.L5, E.L5)), clock: t * 10, gum: lerp(0.9, 1.0, lin(t, wt("saiu", L.L5), wt("cocô", L.L5))), guy: g0({ face: "happy" }), cam: push(t, L.L5, L.L6, [1.6, 1.8, 3.6], [0.0, 1.5, -0.4], [1.3, 1.7, 3.1], [0.0, 1.5, -0.6], 48, 46) }));
  shot(L.L6, (t) => ({ xray: 1, many: lin(t, wt("formar", L.L6), wt("bola", L.L6) + 0.4), red: t > wt("entupir", L.L6) ? 0.3 : 0, guy: g0({ face: "scared" }), cam: push(t, L.L6, L.L7, XR, XL, [0.46, 1.4, 2.0], [0.4, 1.36, 0.3], 42, 40) }));
  shot(L.L7, (t) => ({ xray: 0, guy: g0({ face: "happy", arms: "wave" }), cam: push(t, L.L7, VEND + 2.2, [0.7, 1.7, 2.7], [0.4, 1.45, 0.3], [0.62, 1.7, 2.35], [0.4, 1.5, 0.3], 44, 42) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
const lab = (text, t0, t1, t, bg) => (t > t0 && t < t1 ? { text, k: lin(t, t0, t0 + 0.25), label: true, y: 0.085 } : null);
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = [lab("7 ANOS GRUDADO? 🤔", wt("sete", L.L2) - 0.1, wt("mentira", L.L2) - 0.1, t), lab("❌ MITO!", wt("mentira", L.L2) - 0.1, L.L3, t), lab("🧪 NÃO É DIGERIDO", wt("digerir", L.L3) - 0.1, L.L4, t),
    lab("➡️ PASSA INTEIRO", wt("passa", L.L4) - 0.1, L.L5, t), lab("📅 2 A 3 DIAS", wt("dois", L.L5) - 0.1, L.L6, t), lab("⚠️ MUITOS = PERIGO", wt("muitos", L.L6) - 0.1, L.L7, t)].filter(Boolean);
  if (t > wt("segue", L.L7) - 0.1) st.follow = { k: lin(t, wt("segue", L.L7) - 0.1, wt("segue", L.L7) + 0.2), tap: 0, hand: true };
  st.dark = t > TOTAL / FPS - 0.35 ? lin(t, TOTAL / FPS - 0.35, TOTAL / FPS) : 0; return st; }
