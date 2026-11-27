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
