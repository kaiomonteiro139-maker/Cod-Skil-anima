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
