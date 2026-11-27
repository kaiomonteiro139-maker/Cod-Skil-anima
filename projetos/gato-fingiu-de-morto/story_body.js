// Shot plan — "O gato que fingiu de morto". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 1.8) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const CS = [0.4, 0, 0.5], BW = [1.4, 0, 0.9];
const tFall = 0.25;
const deadCat = (o = {}) => ({ pos: CS, yaw: 0.4, dead: 1, ...o });
export function build() {
  // 0. HOOK (Fahh): the cat drops dead, tongue out... then peeks with one eye
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.6), cat: { pos: CS, yaw: 0.4, dead: ss(lin(t, tFall, tFall + 0.25)), peek: t > wt("comida", 0) - 0.1, happy: 0 }, bowl: 0,
    cam: push(t, 0, L.L2, [CS[0] + 0.3, 0.55, CS[2] + 1.6], [CS[0], 0.35, CS[2]], [CS[0] + 0.2, 0.45, CS[2] + 1.1], [CS[0], 0.3, CS[2]], 45, 40) }));
  // 1. every time he dropped like that, the owner came running to fill the bowl
  shot(L.L2, (t) => { const tr = wt("dona", L.L2), u = lin(t, tr - 0.3, wt("encher", L.L2) - 0.2), tp = wt("pote", L.L2) - 0.3, pour = ss(lin(t, tp, tp + 0.3));
    const op = L3([3.6, 0, 1.6], [BW[0] + 0.55, 0, BW[2] + 0.1], ss(u)), up = t > E.L2 - 0.6;
    return { cat: { pos: up ? [BW[0] - 0.55, 0, BW[2] - 0.1] : CS, yaw: up ? 1.4 : 0.4, dead: up ? 0 : 1, peek: t > tp, happy: up ? 1 : 0, squint: up }, own: { pos: op, yaw: u < 1 ? -1.4 : -1.8, run: u < 1 && u > 0 ? t * 1.2 : null, pour, bend: pour * 0.5 },
      bag: pour > 0 ? { pos: [op[0] - 0.35, 0.85, op[2] - 0.05], tilt: pour } : null, bowl: lerp(0.1, 1, lin(t, tp + 0.2, tp + 1.4)),
      cam: push(t, L.L2, L.L3, [0.9, 1.6, 4.4], [1.0, 0.5, 0.6], [1.0, 1.4, 3.7], [1.1, 0.5, 0.7], 50, 46) }; });
  // 2. he did it once... ten times... fifty times (quick cuts, counter badge)
  const cuts = [["uma", [-0.8, 0.5, 2.0], 0.2], ["dez", [1.6, 0.9, 1.9], -0.5], ["cinquenta", [0.3, 2.2, 1.6], 0.0]];
  cuts.forEach(([w, cp, yaw], k) => shot(wt(w, L.L3) - 0.1, (t) => { const t0 = wt(w, L.L3) - 0.1, fall = ss(lin(t, t0, t0 + 0.2));
    return { flash: 0.4 * (1 - lin(t, t0, t0 + 0.15)), cat: deadCat({ yaw, dead: fall }), own: k > 0 ? { pos: [CS[0] - 1.1, 0, CS[2] - 0.7], yaw: 0.9, armsOut: 1, shout: 1 } : null, bowl: 0.3 + k * 0.3,
      cam: { pos: cp, look: [CS[0], 0.25, CS[2]], fov: 46 } }; }));
  // 3. until one day... he dropped, and nobody came (grey, silent)
  shot(L.L4, (t) => ({ sat: 0.35, vig: 0.55, cat: deadCat({ yaw: -0.2, dead: ss(lin(t, wt("caiu", L.L4) - 0.3, wt("caiu", L.L4))), peek: t > wt("ninguém", L.L4) }), bowl: 0,
    cam: push(t, L.L4, L.L5, [CS[0] - 2.0, 1.4, CS[2] + 3.0], [CS[0], 0.3, CS[2]], [CS[0] - 1.4, 1.0, CS[2] + 2.0], [CS[0], 0.3, CS[2]], 48, 44) }));
  // 4. he got up, looked around... and saw a camera
  shot(L.L5, (t) => { const tl = wt("olhou", L.L5); return { sat: 0.7, cat: { pos: CS, yaw: 0.2, dead: 1 - ss(lin(t, L.L5, L.L5 + 0.4)), sit: 1, look: t > tl ? Math.sin((t - tl) * 4) * 0.8 : 0, happy: 0 },
    cam: push(t, L.L5, L.L5 + 2.5, [CS[0] + 0.2, 0.55, CS[2] + 1.3], [CS[0], 0.42, CS[2]], [CS[0] + 0.15, 0.5, CS[2] + 1.0], [CS[0], 0.42, CS[2]], 44, 40) }; });
  shot(wt("câmera", L.L5) - 0.35, (t) => ({ recBlink: true, cat: { pos: CS, yaw: -0.9, sit: 1, look: -0.6, lookUp: 1, wide: true }, cam: push(t, wt("câmera", L.L5) - 0.35, L.L6, [-3.2, 1.9, 0.1], [-4.25, 1.95, -0.25], [-3.6, 1.92, -0.05], [-4.25, 1.95, -0.25], 40, 34) }));
  // 5. she recorded everything — camera POV with REC... then the phone: viral!
  shot(L.L6, (t) => ({ rec: true, cat: deadCat({ yaw: 0.4 }), bowl: 0.6, cam: { pos: [-3.95, 2.0, -0.2], look: [CS[0], 0.25, CS[2]], fov: 34 } }));
  shot(wt("e", L.L6 + 1.0) - 0.1, (t) => ({ cat: { pos: CS, yaw: 0.3, sit: 1, wide: true, lookUp: 0.3 }, bowl: 0.6, cam: push(t, wt("e", L.L6 + 1.0) - 0.1, L.L7, [CS[0] + 0.1, 0.5, CS[2] + 1.6], [CS[0], 0.45, CS[2]], [CS[0] + 0.1, 0.5, CS[2] + 1.9], [CS[0], 0.45, CS[2]], 44, 46) }));
  // 6. follow for more — the cat sits proudly
  shot(L.L7, (t) => ({ cat: { pos: CS, yaw: 0.3, sit: 1, happy: 1, squint: true }, bowl: 1, cam: push(t, L.L7, VEND + 1.8, [CS[0] + 0.2, 0.5, CS[2] + 1.2], [CS[0], 0.45, CS[2]], [CS[0] + 0.15, 0.48, CS[2] + 0.95], [CS[0], 0.45, CS[2]], 42, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  const tv = wt("e", L.L6 + 1.0) - 0.1; if (t >= tv && t < L.L7) st.viral = { k: lin(t, tv, tv + 0.35), views: 1e7 * Math.pow(lin(t, wt("viralizou", L.L6), wt("visualizações", L.L6) + 0.3), 2), inner: { rec: true, cat: { pos: [0.4, 0, 0.5], yaw: 0.4, dead: 1 }, bowl: 0.6, cam: { pos: [-3.95, 2.0, -0.2], look: [0.4, 0.25, 0.5], fov: 30 } } };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
