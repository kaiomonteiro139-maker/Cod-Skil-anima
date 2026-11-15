// Shot plan — "O cachorrinho que esperou 300 dias" (parte 1). L.<id>/E.<id> = line start/end, wt(word, after) = word time.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 1.8) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b) => ss((t - a) / (b - a));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const SPOT = [1.5, 0, -4.4], LANE = -1.6, FAR = 1.6;
const pupSit = (o = {}) => ({ pos: SPOT, yaw: 0, sit: 1, ears: -0.6, sad: 0.8, wet: true, ...o });
const faceCam = (d, h = 0.72, side = 0.25) => ({ from: [SPOT[0] + side, h, SPOT[2] + d], at: [SPOT[0], 0.72, SPOT[2]] });
// car arriving along the near lane (+x), braking at x = xs
const arrive = (t, t0, t1, xs) => { const u = lin(t, t0, t1); return lerp(xs - 22, xs, 1 - (1 - u) * (1 - u)); };
const leave = (t, t0, x0) => x0 + Math.max(0, t - t0) ** 2 * 3.2;

export function build() {
  // 1. HOOK — the puppy alone in the rain, every night
  shot(0, (t) => { const f = faceCam(lerp(2.3, 1.45, ease(t / L.L2)), 0.62); return { light: "rain", vig: 0.5, pup: pupSit({ headPitch: -0.1, tilt: Math.sin(t * 0.8) * 0.08 }), cam: { pos: f.from, look: f.at, fov: 46, roll: -1 } }; });
  // 2. the car stops at the station (that rainy Sunday)
  shot(L.L2, (t) => ({ light: "rain", car: { pos: [arrive(t, L.L2, wt("parou", L.L2) + 0.5, 1.2), 0, LANE], lights: true }, cam: push(t, L.L2, L.L3, [5.5, 1.6, -7.5], [0, 0.8, -1.6], [4.6, 1.5, -6.6], [0.8, 0.8, -1.6], 54, 50) }));
  // 3. the door opens, the puppy hops out... and the car leaves without him
  shot(L.L3, (t) => { const tOut = wt("abriu", L.L3) + 0.2, tGo = wt("embora", L.L3) - 0.2, hop = lin(t, tOut, tOut + 0.6), door = t < tGo ? seg(t, wt("abriu", L.L3) - 0.1, tOut + 0.1) : 1 - seg(t, tGo - 0.4, tGo);
    const cx = leave(t, tGo, 1.2), pp = [lerp(1.2, 1.4, hop), 0.35 * Math.sin(hop * Math.PI) + (hop < 0.05 ? 0.4 : 0), lerp(-1.5, -3.2, hop)];
    return { light: "rain", car: { pos: [cx, 0, LANE], lights: true, door }, pup: hop > 0 ? { pos: pp, yaw: t < tGo ? 0.2 : Math.PI / 2, wag: t < tGo ? 1 : 0.2, ears: t < tGo ? 0.6 : 0, headYaw: t > tGo ? 0.3 : 0, wet: true } : null,
      cam: push(t, L.L3, L.L4, [1.0, 1.25, -7.0], [1.3, 0.6, -2.2], [1.4, 1.15, -6.1], [1.6, 0.6, -2.4], 50, 46) }; });
  // 4. he ran after it until his little paws gave up
  shot(L.L4, (t) => { const u = lin(t, L.L4, L.L5), slow = 1 - 0.75 * u, px = 3 + 9 * (1 - (1 - u) ** 1.6);
    return { light: "rain", pup: { pos: [px, 0, LANE + 0.2], yaw: Math.PI / 2, run: t * slow * 1.4, ears: -0.3, sad: u, wet: true, bark: u < 0.5 ? 0.3 * Math.max(0, Math.sin(t * 7)) : 0 }, car: { pos: [px + 10 + u * 20, 0, LANE], lights: true },
      cam: { pos: [px - 0.9, 0.7, LANE + 2.8], look: [px + 0.5, 0.45, LANE + 0.2], fov: 52 } }; });
  // 5. he came back to the same spot... and sat down  (DIA 1)
  shot(L.L5, (t) => { const tSit = wt("sentou", L.L5), u = lin(t, L.L5, tSit - 0.3), pos = L3([4.6, 0, -2.4], SPOT, ss(u));
    return { light: "rain", vig: 0.5, pup: { pos, yaw: u < 1 ? -Math.PI * 0.6 + u * 0.4 : 0, run: u < 1 ? t * 0.8 : null, sit: seg(t, tSit - 0.2, tSit + 0.3), ears: -0.7, sad: 1, wet: true }, cam: push(t, L.L5, L.L6, [6.4, 1.3, 0.8], [2.6, 0.5, -3.6], [5.4, 1.1, 0.1], [2.0, 0.55, -4.0], 50, 44) }; });
  // 6. every red car that passed, the little tail wagged (DIA 30 day, DIA 100 dusk)
  const pass = (t, t0, dir = 1, z = LANE) => ({ pos: [dir * (-16 + (t - t0) * 12), 0, z], yaw: dir > 0 ? 0 : Math.PI });
  const montage = (light, k, carCol) => (t) => { const t0 = SH.find((s) => s.k === k).t0, cx = -16 + (t - t0) * 12, near = Math.abs(cx - SPOT[0]) < 5;
    return { light, pup: pupSit({ wet: light === "rain" || light === "night", sit: 1, ears: near ? 0.5 : -0.3, sad: near ? 0 : 0.6, wag: near ? 1 : 0, headYaw: cl((cx - SPOT[0]) / 8, -0.8, 0.8) }),
      car: carCol === "red" ? { pos: [cx, 0, LANE], lights: light !== "day", driver: true } : null, others: carCol === "red" ? [] : [null, { ...pass(t, t0), }],
      cam: push(t, t0, t0 + 2, [SPOT[0] + 0.7, 0.85, SPOT[2] - 2.0], [SPOT[0] - 0.7, 0.5, SPOT[2] + 3], [SPOT[0] + 0.6, 0.82, SPOT[2] - 1.7], [SPOT[0] - 0.7, 0.5, SPOT[2] + 3], 56, 52) }; };
  SH.push({ t0: L.L6, k: "m1", fn: null }); SH.push({ t0: wt("o", L.L6 + 0.6), k: "m2", fn: null });
  SH.find((s) => s.k === "m1").fn = montage("day", "m1", "red"); SH.find((s) => s.k === "m2").fn = montage("dusk", "m2", "red");
  // 7. and every car went away (DIA 200, night)
  shot(L.L7, (t) => ({ light: "night", vig: 0.5, pup: pupSit({ wet: false, ears: -0.8, sad: 1, headYaw: -0.5 }), car: { pos: [leave(t, L.L7 - 0.6, 6), 0, LANE], lights: true },
    cam: push(t, L.L7, L.L8, [SPOT[0] - 1.6, 0.9, SPOT[2] - 2.4], [SPOT[0] + 2.0, 0.5, SPOT[2] + 3], [SPOT[0] - 1.3, 0.85, SPOT[2] - 2.0], [SPOT[0] + 2.4, 0.5, SPOT[2] + 3], 52, 48) }));
  // 8. CTA — if you want him to find a home, follow the channel (button pops and gets tapped)
  shot(L.L8, (t) => { const f = faceCam(lerp(1.35, 0.95, ease(lin(t, L.L8, L.L9))), 0.68, 0.05); return { light: "night", vig: 0.45, pup: pupSit({ wet: false, ears: 0.2, sad: 0.6, tilt: 0.25 * Math.sin(t * 1.2), headPitch: -0.2 }), cam: { pos: f.from, look: [SPOT[0], 0.78, SPOT[2]], fov: 44 } }; });
  // 9. day 300: a red car stops right in front of him
  shot(L.L9, (t) => { const tStop = wt("parou", L.L9) + 0.3; return { light: "dusk", pup: pupSit({ wet: false, ears: lerp(-0.4, 0.9, seg(t, wt("carro", L.L9), tStop)), sad: 0.2, wag: t > tStop ? 0.6 : 0, headYaw: t < tStop ? -0.4 : 0 }),
    car: { pos: [arrive(t, L.L9, tStop, 1.6), 0, LANE], lights: true, driver: true }, cam: push(t, L.L9, L.L10, [SPOT[0] - 1.3, 0.85, SPOT[2] - 2.3], [SPOT[0] + 0.6, 0.6, (SPOT[2] + LANE) / 2], [SPOT[0] - 1.1, 0.8, SPOT[2] - 1.9], [SPOT[0] + 0.6, 0.6, (SPOT[2] + LANE) / 2], 56, 52) }; });
  // 10. the door opens, a girl reaches out her hand
  shot(L.L10, (t) => { const door = seg(t, L.L10, wt("abriu", L.L10) + 0.3), reach = seg(t, wt("estendeu", L.L10) - 0.1, wt("mão", L.L10));
    return { light: "dusk", car: { pos: [1.6, 0, LANE], lights: true, door, driver: true }, girl: door > 0.6 ? { pos: [1.2, 0, LANE - 1.3], yaw: Math.PI, crouch: 0.6 * reach, reach } : null, pup: pupSit({ wet: false, ears: 0.6, sad: 0, headPitch: -0.15 }),
      cam: push(t, L.L10, L.L11, [SPOT[0] + 2.4, 1.0, SPOT[2] - 1.0], [1.3, 0.8, LANE - 1.0], [SPOT[0] + 2.0, 0.95, SPOT[2] - 0.6], [1.3, 0.8, LANE - 1.2], 52, 46) }; });
  // 11. but he didn't get in. He looked at the road... and barked!
  shot(L.L11, (t) => { const tLook = wt("olhou", L.L11), tBark = wt("latiu", L.L11), look = seg(t, tLook - 0.1, tLook + 0.4), bark = t > tBark - 0.05 ? Math.max(0, Math.sin((t - tBark) * 14)) * (t < tBark + 0.9 ? 1 : 0) : 0;
    return { light: "dusk", car: { pos: [1.6, 0, LANE], lights: true, door: 1, driver: true }, girl: { pos: [1.2, 0, LANE - 1.3], yaw: Math.PI, crouch: 0.6, reach: 1, tilt: 0.15 },
      pup: pupSit({ wet: false, sit: lerp(1, 0.2, look), ears: 0.9, sad: 0, headYaw: -1.2 * look, bark, wag: 0.3 }),
      cam: push(t, L.L11, L.L12, [SPOT[0] - 2.1, 0.8, SPOT[2] + 0.5], [SPOT[0], 0.62, SPOT[2]], [SPOT[0] - 1.6, 0.75, SPOT[2] + 0.4], [SPOT[0], 0.64, SPOT[2]], 52, 46) }; });
  // 12. why? — looking down the road
  shot(L.L12, (t) => ({ light: "dusk", vig: 0.55, pup: pupSit({ wet: false, sit: 0.2, ears: 1, sad: 0, headYaw: -1.2 }), cam: push(t, L.L12, L.L13, [SPOT[0] + 1.6, 1.0, SPOT[2] - 1.5], [SPOT[0] - 4, 0.5, SPOT[2] + 2.2], [SPOT[0] + 1.3, 0.95, SPOT[2] - 1.2], [SPOT[0] - 4, 0.5, SPOT[2] + 2.2], 52, 46) }));
  // 13. part 2 is locked until 1.000 followers — the road into the sunset
  shot(L.L13, (t) => ({ light: "dusk", vig: 0.45, pup: pupSit({ wet: false, sit: 1, ears: 0.6, sad: 0, headYaw: -1.0 }), car: { pos: [1.6, 0, LANE], lights: true, door: 1, driver: true }, girl: { pos: [1.2, 0, LANE - 1.3], yaw: Math.PI, crouch: 0.6, reach: 0.6 },
    cam: push(t, L.L13, VEND + 1.8, [SPOT[0] - 4.2, 1.8, SPOT[2] - 1.0], [SPOT[0] + 0.3, 0.7, SPOT[2] + 1.2], [SPOT[0] - 5.6, 2.8, SPOT[2] - 1.8], [SPOT[0] + 0.3, 0.7, SPOT[2] + 1.2], 50, 54) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  const tSeg = wt("segue", L.L8), tTap = wt("agora", L.L8) + 0.15;
  if (t >= tSeg - 0.15 && t < L.L9) st.follow = { k: lin(t, tSeg - 0.15, tSeg + 0.25), tap: lin(t, tTap, tTap + 0.35), hand: true };
  if (t >= L.L13) st.goal = { k: lin(t, L.L13, L.L13 + 0.4), v: lerp(0.08, 0.32, ease(lin(t, L.L13 + 0.3, L.L13 + 2.5))) };
  if (t > TOTAL / FPS - 0.4) st.dark = lin(t, TOTAL / FPS - 0.4, TOTAL / FPS); return st; }
