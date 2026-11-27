// Longo — "A Loira do Banheiro: a história completa" (16:9, 24 fps). Continua o Short #1.
export const FPS = 24;
export const TAIL = 12;  // tela final para os elementos de fim do YouTube
export const TOTAL = Math.round((VEND + TAIL) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 40, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const GM = [-1.55, 0, 0.6], GHB = [-0.75, 0.05, 0.95], HEADG = [-0.75, 1.3, 0.95];
const mirrorCam = (t, t0, t1, z0 = 0.75, f0 = 40, f1 = 36) => push(t, t0, t1, [-2.45, 1.45, z0], [0, 1.25, 0.75], [-2.3, 1.42, z0 + 0.05], [0, 1.27, 0.75], f0, f1);
const old = { sepia: 0.85, warm: 1, light: 1, vig: 0.55, sky: 0x9ab8d0 };
const ex = (...a) => wt(...a);
export function build() {
  // ---- recap
  shot(0, (t) => ({ light: 0.45, flicker: 1, red: 0.25, guy: { pos: GM, yaw: -Math.PI / 2, face: "scared" }, ghost: { pos: GHB, yaw: -Math.PI / 2, k: lin(t, 3.4, 3.8), tilt: 0.2 }, cam: mirrorCam(t, 0, L.L2) }));
  shot(L.L2, (t) => ({ light: 0.3, flicker: 1, red: 0.3, ghost: { pos: GHB, yaw: -Math.PI / 2, k: 1, tilt: 0.3 }, dark: lin(t, E.L2 - 0.4, E.L2 + 0.3), cam: push(t, L.L2, E.L2 + 0.3, [-1.8, 1.35, 0.98], HEADG, [-1.55, 1.33, 0.97], HEADG, 34, 28) }));
  // ---- flashback (sépia)
  shot(L.L3, (t) => ({ ...old, dark: 1 - lin(t, L.L3, L.L3 + 0.6), cam: push(t, L.L3, L.L4, [40.5, 1.4, 9.0], [40, 2.0, -3], [40.2, 1.7, 5.5], [40, 2.1, -3], 46, 44) }));
  shot(L.L4, (t) => ({ ...old, ghost: { pos: [0, 0, 30], yaw: 0.2, alive: 1, sad: 1 }, cam: push(t, L.L4, L.L5, [0.9, 1.5, 34.2], [0, 1.0, 30], [0.5, 1.4, 32.2], [0, 1.15, 30], 42, 38) }));
  shot(L.L5, (t) => { const z = lerp(32, 25.5, ease(lin(t, L.L5, ex("escondia", L.L5)))); return { ...old, ghost: { pos: [0.3, 0, z], yaw: Math.PI, alive: 1, run: 1 }, cam: { pos: [0.6, 1.6, z + 3.2], look: [0.2, 1.0, z - 1.0], fov: 46 } }; });
  shot(ex("escondia", L.L5), (t) => { const u = ease(lin(t, ex("escondia", L.L5), E.L5)); return { ...old, doors: [0, 0, lerp(1.2, 0.0, lin(t, E.L5 - 0.4, E.L5 + 0.3))], ghost: { pos: L3([2.2, 0, 1.2], [1.5, 0, -1.8], u), yaw: Math.PI + 0.4 * (1 - u), alive: 1, run: u < 1 }, cam: push(t, ex("escondia", L.L5), L.L6, [-0.6, 1.8, 2.6], [1.3, 0.9, -1.2], [-0.4, 1.75, 2.2], [1.4, 0.9, -1.4], 44, 42) }; });
  shot(L.L6, (t) => ({ ...old, ghost: { pos: [1.5, 0.1, -2.05], yaw: 0, alive: 1, sit: 1 }, cam: push(t, L.L6, L.L7, [1.75, 2.35, -1.45], [1.5, 0.85, -2.05], [1.7, 2.25, -1.5], [1.5, 0.9, -2.05], 50, 48) }));
  shot(L.L7, (t) => ({ ...old, light: 0.6, sky: 0x5a6470, rain: [40, 0, 2], cam: push(t, L.L7, ex("chão", L.L7), [40.6, 1.2, 8.0], [40, 1.8, -2], [40.4, 1.3, 7.0], [40, 1.8, -2], 46, 44) }));
  shot(ex("chão", L.L7), (t) => ({ ...old, light: 0.7, puddles: 1, drip: 1, cam: push(t, ex("chão", L.L7), L.L8, [1.0, 0.45, 0.8], [1.3, 0.0, -1.2], [1.1, 0.4, 0.4], [1.3, 0.0, -1.4], 46, 44) }));
  shot(L.L8, (t) => { const s = ex("escorregou", L.L8); return { ...old, light: 0.7, puddles: 1, ghost: { pos: L3([0.4, 0, 0.2], [1.2, 0, -1.0], ease(lin(t, L.L8, s + 0.2))), yaw: Math.PI - 0.6, alive: 1, run: t < s, fall: lin(t, s, s + 0.4) }, dark: t > s + 0.3 ? 1 : 0, cam: push(t, L.L8, E.L8, [2.2, 1.4, 1.8], [0.8, 0.6, -0.6], [2.0, 1.3, 1.5], [0.9, 0.5, -0.8], 44, 42) }; });
  shot(L.L9, (t) => ({ ...old, sepia: 0.9, light: 0.4, dark: 1 - lin(t, L.L9, L.L9 + 0.8), cam: push(t, L.L9, L.L10, [-40.6, 1.4, 2.2], [-40, 1.3, -0.8], [-40.2, 1.4, 0.9], [-40, 1.38, -0.8], 40, 36) }));
  shot(L.L10, (t) => ({ light: 0.3, flicker: 1, red: 0.2, ghost: { pos: GHB, yaw: -Math.PI / 2, k: 1, tilt: 0.25 }, cam: push(t, L.L10, L.L11, [-1.75, 1.33, 1.0], HEADG, [-1.5, 1.27, 0.97], [-0.75, 1.25, 0.95], 34, 24) }));
  // ---- de volta ao presente
  shot(L.L11, (t) => ({ light: 0.4, flicker: 1, guy: { pos: GM, yaw: -Math.PI / 2, face: "scared" }, dark: 1 - lin(t, L.L11, L.L11 + 0.8), cam: mirrorCam(t, L.L11, L.L12, 0.7, 44, 40) }));
  shot(L.L12, (t) => ({ light: 0.4, flicker: 1, guy: { pos: GM, yaw: -Math.PI / 2, face: "scared" }, cam: push(t, L.L12, L.L13, [-2.3, 1.42, 0.62], [-1.55, 1.38, 0.6], [-2.15, 1.4, 0.61], [-1.55, 1.38, 0.6], 40, 34) }));
  shot(L.L13, (t) => ({ light: 0.4, drip: 1, guy: { pos: GM, yaw: -Math.PI / 2, face: "scared" }, cam: push(t, L.L13, ex("voz", L.L13), [-1.75, 1.15, 0.45], [-2.27, 0.95, 0.15], [-1.85, 1.1, 0.35], [-2.27, 0.95, 0.15], 36, 32) }));
  shot(ex("voz", L.L13), (t) => ({ light: 0.35, flicker: 1, red: 0.2, guy: { pos: GM, yaw: -Math.PI / 2, face: "scared", headYaw: -0.3 }, ghost: { pos: [-1.35, 0.06, 1.0], yaw: -Math.PI / 2 - 0.4, k: lin(t, ex("voz", L.L13), ex("voz", L.L13) + 0.8), tilt: 0.3 }, cam: push(t, ex("voz", L.L13), L.L14, [-2.3, 1.45, 1.7], [-1.45, 1.3, 0.8], [-2.15, 1.42, 1.55], [-1.45, 1.3, 0.8], 40, 36) }));
  shot(L.L14, (t) => ({ light: 0.3, flicker: 1, red: 0.45, shake: 0.5, ghost: { pos: [-1.35, 0.06, 1.0], yaw: -Math.PI / 2 - 0.4, k: 1, tilt: 0.35 }, cam: push(t, L.L14, L.L15, [-2.0, 1.33, 1.25], [-1.35, 1.3, 1.0], [-1.9, 1.33, 1.2], [-1.35, 1.3, 1.0], 30, 26) }));
  shot(L.L15, (t) => { const u = ease(lin(t, L.L15, ex("puxa", L.L15))); return { light: 0.45, flicker: 1, rattle: t > ex("puxa", L.L15), shake: t > ex("trancada", L.L15) ? 0.5 : 0, guy: { pos: L3(GM, [2.3, 0, 1.5], u), yaw: Math.PI / 2, walk: u < 1 ? t * 2.2 : null, face: "scared", arms: u >= 1 ? "forward" : "down" }, cam: push(t, L.L15, L.L16, [-0.6, 2.0, 4.4], [1.2, 1.0, 1.0], [-0.2, 1.9, 4.0], [1.8, 1.0, 1.2], 46, 44) }; });
  const doorsAt = (t) => [-lin(t, ex("um", L.L17), ex("um", L.L17) + 0.6) * 1.1, -lin(t, ex("dois", L.L17), ex("dois", L.L17) + 0.6) * 1.1, lin(t, ex("três", L.L18), ex("descarga", L.L18)) * 1.2];
  shot(L.L16, (t) => ({ light: 0.45, flicker: 1, doors: doorsAt(t), flush: t > ex("descarga", L.L18) ? 2 : -1, guy: { pos: [2.3, 0, 1.5], yaw: -2.3, face: "scared" }, cam: push(t, L.L16, L.L19, [2.6, 1.7, 0.7], [0.3, 0.95, -1.7], [2.4, 1.6, 0.2], [0.8, 0.95, -1.8], 50, 44) }));
  shot(L.L19, (t) => ({ light: 0.35, flicker: 1, red: 0.35, doors: [-1.1, -1.1, 1.2], ghost: { pos: L3([1.5, 0.05, -1.9], [1.1, 0.05, -0.2], ease(lin(t, L.L19, E.L19))), yaw: 0.5, k: lin(t, L.L19, L.L19 + 0.5) }, guy: { pos: [2.3, 0, 1.5], yaw: -2.3, face: "scared" }, cam: push(t, L.L19, L.L20, [2.7, 1.45, 0.2], [1.2, 1.2, -0.9], [2.5, 1.42, 0.1], [1.1, 1.25, -0.6], 44, 38) }));
  // ---- lembrança da avó (sépia)
  shot(L.L20, (t) => ({ ...old, gran: { pos: [0.5, 0, 30], yaw: -0.9 }, guy: { pos: [-0.5, 0, 30.8], yaw: 2.3, face: "calm", scale: 0.55 }, cam: push(t, L.L20, L.L22, [-1.2, 1.3, 33.2], [0, 1.0, 30.3], [-0.8, 1.25, 32.3], [0.1, 1.05, 30.3], 42, 38) }));
  // ---- o ritual
  const GP = [1.9, 0, 1.3], GY = -2.3;
  shot(L.L22, (t) => ({ light: 0.35, flicker: 1, doors: [-1.1, -1.1, 1.2], ghost: { pos: [0.9, 0.05, 0.2], yaw: 0.85, k: 1, tilt: 0.3 }, guy: { pos: GP, yaw: GY, face: t > ex("fecha", L.L22) ? "ko" : "scared", headPitch: 0.6 * lin(t, ex("abaixa", L.L22), ex("abaixa", L.L22) + 0.5) }, cam: push(t, L.L22, L.L23, [2.9, 0.75, 0.0], [1.5, 1.0, 0.9], [2.75, 0.75, 0.1], [1.5, 1.05, 0.9], 44, 40) }));
  shot(L.L23, (t) => ({ light: 0.3, flicker: 1, guy: { pos: GP, yaw: GY, face: "ko", headPitch: 0.6 }, cam: push(t, L.L23, L.L24, [1.2, 1.3, 0.7], [1.9, 1.4, 1.3], [1.32, 1.32, 0.8], [1.9, 1.4, 1.3], 34, 30) }));
  shot(L.L24, (t) => ({ light: 0, dark: 0.92, guy: { pos: GP, yaw: GY, face: "ko", headPitch: 0.6 }, cam: { pos: [1.32, 1.32, 0.8], look: [1.9, 1.4, 1.3], fov: 30 } }));
  shot(L.L25, (t) => ({ light: lin(t, L.L25, L.L25 + 0.5), doors: [-1.1, -1.1, 1.2], exit: lin(t, ex("destranca", L.L25), ex("destranca", L.L25) + 0.8) * 1.0, guy: { pos: GP, yaw: GY + Math.sin(t * 0.8) * 0.4, face: "scared" }, cam: push(t, L.L25, L.L26, [-0.6, 2.3, 4.4], [0.6, 0.8, -0.8], [-0.4, 2.2, 4.0], [0.7, 0.8, -0.8], 48, 46) }));
  shot(L.L26, (t) => ({ light: 0.9, fog: lin(t, L.L27 - 0.2, L.L27 + 0.6), cam: push(t, L.L26, L.L28, [-0.6, 1.85, 0.9], [-2.6, 1.9, 0.6], [-0.9, 1.88, 0.75], [-2.6, 1.9, 0.6], 46, 44) }));
  // ---- no dia seguinte
  shot(L.L28, (t) => ({ light: 1, tape: 1, cam: push(t, L.L28, L.L29, [0.2, 1.8, 3.4], [1.3, 1.0, -1.4], [0.6, 1.7, 2.8], [1.4, 1.0, -1.5], 44, 42) }));
  shot(L.L29, (t) => ({ light: 1, tape: 1, doors: [0, 0, 1.2], cotton: t > ex("chão", L.L29), cam: push(t, L.L29, L.L30, [1.6, 1.0, -0.6], [1.45, 0.0, -2.0], [1.55, 0.55, -1.3], [1.45, 0.0, -2.0], 44, 34) }));
  shot(L.L30, (t) => ({ light: 0.35, flicker: 1, doors: [0, 0, lerp(0, 0.9, ease(lin(t, L.L30, E.L30)))], flush: t > ex("descarga", L.L30) ? 2 : -1, ghost: { pos: [1.5, 0.05, -1.95], yaw: 0, k: 0.45 * lin(t, ex("sozinha", L.L30), E.L30) }, cam: push(t, L.L30, L.L31, [1.6, 1.5, 1.6], [1.5, 1.0, -1.6], [1.55, 1.45, 0.6], [1.5, 1.05, -1.8], 44, 40) }));
  shot(L.L31, (t) => ({ light: 0.25, flicker: 1, doors: [0, 0, 0.9], ghost: { pos: [1.5, 0.05, -1.95], yaw: 0, k: 0.6 }, vig: 0.7, cam: push(t, L.L31, VEND + TAIL, [1.55, 1.45, 0.6], [1.5, 1.05, -1.8], [1.52, 1.4, -0.2], [1.5, 1.1, -1.9], 40, 34) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = []; if (t > VEND + 0.3) { st.tags.push({ text: "🔔 INSCREVA-SE NO CANAL", k: lin(t, VEND + 0.3, VEND + 0.6), y: 0.16, bg: "#e5323f" }); }
  st.dark = Math.max(st.a.dark ?? 0, t > VEND + 1 ? 0.45 : 0, t > TOTAL / FPS - 0.5 ? lin(t, TOTAL / FPS - 0.5, TOTAL / FPS) : 0); return st; }
