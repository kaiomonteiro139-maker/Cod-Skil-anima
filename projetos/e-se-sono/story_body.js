// Shot plan — "E se você ficasse 11 dias sem dormir?". Starts straight with the narration (no meme intro).
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const GP = [0.4, 0, 0.3], tA1 = wt("apagar", L.L4), tA2 = wt("segundos", L.L4), tDay = wt("seguidas", L.L6);
const g0 = (o = {}) => ({ pos: GP, yaw: -0.15, arms: "down", face: "tired", ...o });
export function build() {
  shot(0, (t) => ({ clock: t * 4, guy: g0({ arms: t > 0.6 && t < 1.9 ? "yawn" : "down", face: "tired" }), cam: push(t, 0, L.L2, [0.9, 1.7, 3.0], [0.4, 1.55, 0.3], [0.7, 1.7, 2.3], [0.4, 1.6, 0.3], 44, 40) }));
  shot(L.L2, (t) => ({ clock: t * 2, guy: g0({ sway: 1.2, headPitch: Math.sin(t * 1.7) * 0.15 }), cam: push(t, L.L2, L.L3, [1.3, 1.35, 3.8], [0.3, 1.35, 0.2], [1.0, 1.35, 3.3], [0.3, 1.4, 0.2], 46, 44) }));
  shot(L.L3, (t) => ({ clock: t * 2, ghosts: lin(t, wt("ver", L.L3) - 0.2, wt("ver", L.L3) + 0.4), guy: g0({ face: "scared", sway: 0.6, headYaw: Math.sin(t * 1.4) * 0.6 }), cam: { ...push(t, L.L3, L.L4, [0.2, 1.5, 3.9], [0.3, 1.5, 0], [0.5, 1.5, 3.4], [0.3, 1.5, 0], 50, 48), roll: Math.sin(t * 1.6) * 6 } }));
  shot(L.L4, (t) => { const off = (t > tA1 && t < tA1 + 0.45) || (t > tA2 && t < tA2 + 0.45); return { clock: t * 2, blink: off ? 1 : 0, guy: g0({ face: off ? "ko" : "tired", headPitch: off ? 0.5 : 0.1, sway: 0.8 }), cam: push(t, L.L4, L.L5, [0.6, 1.72, 2.2], [0.4, 1.78, 0.3], [0.55, 1.72, 1.9], [0.4, 1.78, 0.3], 42, 40) }; });
  shot(L.L5, (t) => ({ clock: t * 12, guy: g0({ sway: 1.5, face: "tired" }), cam: push(t, L.L5, L.L6, [2.4, 2.4, 4.2], [-0.2, 1.0, -0.8], [1.8, 2.0, 3.6], [-0.2, 1.1, -0.8], 50, 48) }));
  shot(L.L6, (t) => ({ clock: t * 6, daylight: t > tDay ? 1 : 0, zzz: 1, guy: { pos: [-1.75, 0, -1.0], yaw: 0, lie: 1, lieY: 0.8, face: "ko" }, cam: push(t, L.L6, L.L7, [0.7, 2.5, 1.6], [-1.75, 0.7, -1.2], [0.4, 2.3, 1.2], [-1.75, 0.7, -1.3], 46, 44) }));
  shot(L.L7, (t) => ({ daylight: 1, guy: g0({ face: "happy", arms: "wave" }), cam: push(t, L.L7, VEND + 2.2, [0.7, 1.7, 2.7], [0.4, 1.45, 0.3], [0.62, 1.7, 2.35], [0.4, 1.5, 0.3], 44, 42) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
const lab = (text, t0, t1, t) => (t > t0 && t < t1 ? { text, k: lin(t, t0, t0 + 0.25), label: true, y: 0.2 } : null);
const dayAt = (t) => (t < L.L2 ? null : t < L.L3 ? 1 : t < L.L4 ? 3 : t < L.L5 ? 5 : t < L.L6 ? Math.min(11, 5 + Math.floor(6 * lin(t, L.L5 + 0.3, wt("ficou", L.L5)) + 0.001)) : null);
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  const d = dayAt(t); st.tags = [d ? { text: `DIA ${d} SEM DORMIR`, k: 1, y: 0.1, bg: "#ffd23f" } : null,
    lab("🧠 CÉREBRO LENTO", wt("como", L.L2) - 0.1, L.L3, t), lab("👀 ALUCINAÇÕES", wt("ver", L.L3) - 0.1, L.L4, t), lab("💤 MICROCOCHILOS", tA1 - 0.1, L.L5, t),
    lab("📅 1964 · 11 DIAS ACORDADO", wt("mil", L.L5) - 0.1, L.L6, t), lab("😴 QUASE 15 HORAS DE SONO", wt("quinze", L.L6) - 0.1, L.L7, t)].filter(Boolean);
  if (t > wt("segue", L.L7) - 0.1) st.follow = { k: lin(t, wt("segue", L.L7) - 0.1, wt("segue", L.L7) + 0.2), tap: 0, hand: true };
  st.dark = Math.max(st.a.blink ?? 0, t > TOTAL / FPS - 0.35 ? lin(t, TOTAL / FPS - 0.35, TOTAL / FPS) : 0); return st; }
