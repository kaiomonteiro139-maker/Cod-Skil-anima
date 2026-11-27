// Shot plan — Short #1 "A Loira do Banheiro". Hook at frame 0.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.4) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const tIn = wt("entra", L.L4), tClose = wt("fecha", L.L4), tP1 = wt("aperta", L.L4), tP2 = L.L5, tP3 = wt("terceira", L.L6), tOff = wt("luz", L.L6), tWho = wt("alguém", L.L7), tCot = wt("algodão", L.L7);
const press = (t) => (t > tP1 && t < tP1 + 0.5) || (t > tP2 && t < tP2 + 0.5) || (t > tP3 && t < tP3 + 0.5);
const flushing = (t) => (t > tP1 && t < tP1 + 1.2) || (t > tP2 && t < tP2 + 1.2) || (t > tP3 && t < tP3 + 1.0);
const IN = [1.5, 0, -1.85], HEADIN = [1.5, 1.75, -1.85];
export function build() {
  shot(0, (t) => ({ flicker: 1, red: 0.12, doors: [0, 0, 0.35], cam: push(t, 0, L.L2, [1.7, 1.4, 2.2], [1.5, 1.0, -2.2], [1.6, 1.35, 0.8], [1.5, 1.0, -2.2], 50, 46) }));
  shot(L.L2, (t) => { const g = t > wt("menina", L.L2) && t < wt("branco", L.L2) + 0.6; return { flicker: 1, doors: [0, 0, 0.35], ghost: g ? { pos: [1.45, 0, -1.05], k: 0.8 * (Math.sin(t * 23) > -0.6 ? 1 : 0.35) } : null, cam: push(t, L.L2, L.L3, [2.2, 2.1, 2.6], [1.0, 0.9, -1.6], [2.0, 2.0, 2.2], [1.1, 0.9, -1.6], 50, 48) }; });
  shot(L.L3, (t) => ({ doors: [0, 0, lerp(0.35, 1.3, ease(lin(t, L.L3, E.L3)))], light: 0.8, cam: push(t, L.L3, L.L4, [1.6, 1.5, 1.3], [1.5, 0.6, -2.4], [1.55, 1.4, 0.2], [1.5, 0.55, -2.4], 50, 46) }));
  shot(L.L4, (t) => { const u = ease(lin(t, L.L4 + 0.2, tIn + 0.4)); return { light: 0.85, doors: [0, 0, 1.3], guy: { pos: L3([2.3, 0, 1.2], [1.5, 0, -0.9], u), yaw: Math.PI + 0.5 * (1 - u), walk: u < 1 ? t * 1.4 : null, face: "calm", arms: "down" }, cam: push(t, L.L4, tIn + 0.4, [0.2, 1.7, 1.9], [1.6, 1.0, -0.6], [0.4, 1.65, 1.5], [1.5, 1.0, -1.0], 50, 48) }; });
  shot(tIn + 0.4, (t) => { const u = ease(lin(t, tIn + 0.4, tClose)); return { light: 0.8, flush: flushing(t) ? 2 : -1, doors: [0, 0, t < tClose ? 1.3 : lerp(1.3, 0, ease(lin(t, tClose, tClose + 0.5)))],
    guy: { pos: L3([1.5, 0, -0.9], IN, u), yaw: Math.PI, face: "calm", arms: press(t) ? "forward" : "down", headPitch: press(t) ? 0.4 : 0 }, cam: push(t, tIn + 0.4, L.L5, [1.75, 2.45, -2.55], [1.5, 0.95, -1.35], [1.72, 2.4, -2.5], [1.5, 1.0, -1.4], 60, 58) }; });
  shot(L.L5, (t) => ({ light: 0.8, flush: flushing(t) ? 2 : -1, doors: [0, 0, 0], guy: { pos: IN, yaw: Math.PI, face: t > wt("nada", L.L5) ? "scared" : "calm", arms: press(t) ? "forward" : "down", headYaw: t > wt("nada", L.L5) ? Math.sin(t * 2.5) * 0.6 : 0 }, cam: push(t, L.L5, L.L6, [1.68, 1.95, -2.58], [1.5, 1.4, -1.75], [1.65, 1.92, -2.55], [1.5, 1.42, -1.75], 54, 50) }));
  shot(L.L6, (t) => ({ light: t < tOff ? 0.8 : 0, flicker: t > tP3 && t < tOff ? 1 : 0, flush: flushing(t) ? 2 : -1, doors: [0, 0, 0], shake: t > tOff ? 0.4 : 0, guy: { pos: IN, yaw: Math.PI, face: "scared", arms: press(t) ? "forward" : "down" }, dark: t > tOff ? 0.9 : 0, cam: push(t, L.L6, L.L7, [1.75, 2.45, -2.55], [1.5, 1.0, -1.4], [1.72, 2.4, -2.5], [1.5, 1.05, -1.45], 58, 56) }));
  shot(L.L7, (t) => { const k = lin(t, tWho - 0.2, tWho + 0.2), zoom = ease(lin(t, tCot + 0.1, tCot + 1.2)); return { light: 0.45, flicker: 1, red: 0.25 * k, shake: k > 0 && k < 1 ? 0.8 : 0, doors: [0, 0, 0.9],
    guy: { pos: [-1.55, 0, 0.6], yaw: -Math.PI / 2, face: k > 0.5 ? "scared" : "calm", headYaw: 0 }, ghost: { pos: [-0.75, 0.05, 0.95], yaw: -Math.PI / 2, k, tilt: 0.2 },
    cam: { pos: L3([-2.5, 1.5, 0.65], [-1.8, 1.35, 0.98], zoom), look: L3([0.2, 1.3, 0.75], [-0.75, 1.3, 0.95], zoom), fov: lerp(50, 40, zoom) } }; });
  shot(L.L8, (t) => ({ light: 0.25, flicker: 1, red: 0.3, ghost: { pos: [-0.75, 0.05, 0.95], yaw: -Math.PI / 2, k: 1, tilt: 0.35 }, guy: null, dark: 0.25,
    cam: push(t, L.L8, VEND + 2.4, [-1.8, 1.35, 0.98], [-0.75, 1.3, 0.95], [-1.65, 1.34, 0.97], [-0.75, 1.3, 0.95], 40, 36) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = []; if (t > E.L8 + 0.2) st.tags.push({ text: "▶ HISTÓRIA COMPLETA NO CANAL", k: lin(t, E.L8 + 0.2, E.L8 + 0.5), y: 0.5, bg: "#e5323f" });
  st.dark = st.a.dark ?? 0; if (t > TOTAL / FPS - 0.3) st.dark = Math.max(st.dark, lin(t, TOTAL / FPS - 0.3, TOTAL / FPS)); return st; }
