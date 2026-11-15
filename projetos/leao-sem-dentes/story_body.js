// Shot plan — "O leão sem dentes". L.<id>/E.<id> = line start/end, wt(word, after) = word time (prepended by mkstory).
export const FPS = 30;
export const TOTAL = Math.round((VEND + 1.6) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b) => ss((t - a) / (b - a));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const talk = (t, a, b, k = 0.45) => (t > a && t < b ? k * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5)) : 0);
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const DEN = [2, 0, 2];
let S0 = 11; const R = () => { S0 = (S0 * 16807) % 2147483647; return (S0 - 1) / 2147483646; };
// herd layouts: [x, z, yaw, walking, graze]
const RING = []; for (let i = 0; i < 420; i++) { const a = R() * Math.PI * 2, r = 4.2 + Math.pow(R(), 0.8) * 11; RING.push([a, r, R()]); }
const ringHerd = (t, n = 420, spin = 0.0) => RING.slice(0, n).map(([a, r, k]) => { const aa = a + t * spin; const x = DEN[0] + Math.cos(aa) * r, z = DEN[2] + Math.sin(aa) * r; return [x, z, Math.atan2(DEN[0] - x, DEN[2] - z) + (k - 0.5) * 0.5, 0, k < 0.15 ? 1 : 0]; });
const RIVERH = []; for (let i = 0; i < 160; i++) RIVERH.push([-18 + R() * 30, -6.4 - R() * 1.5, R() * 6.28, 0, R() < 0.6 ? 1 : 0]);
const HILLH = []; for (let i = 0; i < 160; i++) HILLH.push([24 + R() * 12, 5 + R() * 13, R() * 6.28, 0, R() < 0.6 ? 1 : 0]);
const PARADE = []; for (let i = 0; i < 240; i++) PARADE.push([R() * 70, -3 - R() * 6, R()]);
const parade = (t) => PARADE.map(([x, z, k]) => [((x + t * 2.2) % 70) - 30, z, Math.PI / 2, 1, 0]);
const lionAt = (o) => ({ pos: DEN, yaw: 0, lid: 0.5, ...o });
const headCam = (p, yaw, d, h, side = 0) => { const hx = p[0] + Math.sin(yaw) * 1.25, hz = p[2] + Math.cos(yaw) * 1.25; return { at: [hx, h, hz], from: [hx + Math.sin(yaw) * d + Math.cos(yaw) * side, h + 0.1, hz + Math.cos(yaw) * d - Math.sin(yaw) * side] }; };

export function build() {
  // 1. HOOK — top-down spiral over the lion surrounded by zebras
  shot(0, (t) => { const a = 0.35 + t * 0.09; return { light: "day", vig: 0.5, lion: lionAt({ lie: 1, yaw: t * 0.1, lid: 0.3, headYaw: Math.sin(t) * 0.3 }), herd: ringHerd(t),
    cam: (() => { const r = lerp(12, 8.5, ease(t / L.L2)), b = 0.2 + t * 0.12; return { pos: [DEN[0] + Math.sin(b) * r, lerp(10, 6.5, ease(t / L.L2)), DEN[2] + Math.cos(b) * r], look: [DEN[0], 0.4, DEN[2]], fov: 52 }; })() }; });
  // 2. no teeth — close on the face, the mouth opens on "mordida"
  shot(L.L2, (t) => { const m = seg(t, wt("mordida", L.L2) - 0.25, wt("mordida", L.L2) + 0.25); const h = headCam(DEN, 0, 2.2, 1.65);
    return { light: "dusk", vig: 0.5, lion: lionAt({ mouth: m, lid: 0.45 - 0.2 * m, headPitch: -0.15 * m }), cam: push(t, L.L2, L.L3, h.from, h.at, [h.from[0], h.from[1] - 0.05, h.from[2] - 0.75], [h.at[0], h.at[1] - 0.05, h.at[2]], 40, 34) }; });
  // 3. old: he tries to chase and gives up
  shot(L.L3, (t) => { const u = lin(t, L.L3, L.L4), stop = wt("caçar", L.L3) + 0.2, lp = [lerp(-4, -1.4, ss(lin(t, L.L3, stop))), 0, 1], lie = seg(t, stop + 0.6, stop + 1.6);
    return { light: "day", lion: { pos: lp, yaw: Math.PI / 2, walk: t < stop ? t * 0.6 : null, lie, mouth: t > stop ? 0.35 + 0.15 * Math.sin(t * 9) : 0.1, lid: 0.55, headPitch: 0.15 * lie },
      zebras: [{ pos: [lerp(1.2, 9, ss(lin(t, L.L3 + 0.3, L.L4))), 0, 0.2], yaw: Math.PI / 2, walk: t * 1.6 }], dust: t < stop ? [{ pos: [lp[0] - 0.8, 0.2, 1.1], s: 0.8, a: 0.5 }] : [],
      cam: push(t, L.L3, L.L4, [-2.2, 1.6, 7.5], [-1.6, 0.9, 0.8], [0.2, 1.5, 6.2], [1.2, 0.9, 0.6], 55, 50) }; });
  // 4. 2.000 passing in front of him every day
  shot(L.L4, (t) => ({ light: "day", lion: lionAt({ lie: 1, headYaw: -0.4 + 0.8 * lin(t, L.L4, L.L5), lid: 0.4 }), herd: parade(t),
    cam: push(t, L.L4, L.L5, [DEN[0] - 0.8, 1.35, DEN[2] + 3.6], [DEN[0] + 1, 1.2, -6], [DEN[0] - 0.4, 1.25, DEN[2] + 3.1], [DEN[0] + 2, 1.3, -6], 58, 52) }));
  // 5. he stops running... and starts talking (sly)
  shot(L.L5, (t) => { const h = headCam(DEN, 0.4, 2.1, 0.95, 0.3); const s = seg(t, wt("começou", L.L5) - 0.2, wt("começou", L.L5) + 0.4);
    return { light: "dusk", vig: 0.5, lion: lionAt({ lie: 1, yaw: 0.4, lid: 0.45 + 0.35 * s, brow: s, headRoll: -0.1 * s, eyeX: s, mouth: 0.12 * s }), cam: push(t, L.L5, L.L6, h.from, h.at, [h.from[0] - 0.3, h.from[1], h.from[2] - 0.6], h.at, 44, 36) }; });
  // 6. whisper at the river
  const RV = [-3, 0, -3.6];
  shot(L.L6, (t) => ({ light: "day", lion: { pos: RV, yaw: Math.PI / 2, lie: 1, lid: 0.55, brow: 0.6, mouth: talk(t, wt("a", L.L6 + 2.4), E.L6), headYaw: 0.1 },
    zebras: [{ pos: [RV[0] + 2.9, 0, RV[2] + 0.15], yaw: -Math.PI / 2, graze: 0.35 }], herd: RIVERH,
    cam: push(t, L.L6, L.L7, [RV[0] + 3.4, 1.45, RV[2] + 5.0], [RV[0] + 1.5, 0.95, RV[2]], [RV[0] + 3.0, 1.35, RV[2] + 3.8], [RV[0] + 1.5, 0.95, RV[2]], 52, 46) }));
  // 7. whisper on the hill
  const HV = [14.5, 0, 9];
  shot(L.L7, (t) => { const gy = groundY(HV[0] + 1.3, HV[2]); return { light: "day", lion: { pos: HV, yaw: Math.PI / 2, lie: 1, lid: 0.55, brow: 0.6, mouth: talk(t, wt("a", L.L7 + 1.0), E.L7), headYaw: 0.1 },
    zebras: [{ pos: [HV[0] + 2.9, 0, HV[2] + 0.15], yaw: -Math.PI / 2, graze: 0.35 }], herd: HILLH,
    cam: push(t, L.L7, L.L8, [HV[0] + 3.6, gy + 1.5, HV[2] + 5.2], [HV[0] + 1.6, gy + 1.0, HV[2]], [HV[0] + 3.1, gy + 1.4, HV[2] + 4.0], [HV[0] + 1.6, gy + 1.0, HV[2]], 54, 47) }; });
  // 8. it wasn't true — the two herds glare at each other (aerial)
  const FACE = []; for (let i = 0; i < 120; i++) { const side = i % 2 ? 1 : -1; FACE.push([10 + side * (3 + R() * 6), -1 + R() * 7, side]); }
  shot(L.L8, (t) => ({ light: "day", vig: 0.45, lion: lionAt({ lie: 1, pos: [10, 0, 2.5], yaw: 0, lid: 0.75, brow: 0.7 }), herd: FACE.map(([x, z, sd]) => [x, z, -sd * Math.PI / 2 + Math.sin(x * 3) * 0.15, 0, 0]),
    cam: push(t, L.L8, L.L9, [10, 7.5, 16], [10, 0.6, 2.5], [10, 6.0, 12.5], [10, 0.6, 2.5], 56, 52) }));
  // 9. first, a shove by the river
  const P1 = [-1, 0, -4.4];
  shot(L.L9, (t) => { const te = wt("empurrão", L.L9), hit = t > te - 0.05, k = seg(t, te - 0.1, te + 0.35);
    return { light: "day", zebras: [{ pos: [P1[0] - 1.2 + 0.25 * k, 0, P1[2]], yaw: Math.PI / 2, lean: -0.12 * k, nod: 0.3 }, { pos: [P1[0] + 1.2 + 0.9 * k, 0, P1[2] + 0.1], yaw: -Math.PI / 2, lean: 0.25 * k * (1 - lin(t, te + 0.4, te + 1.2)) }],
      impact: hit && t < te + 0.45 ? [{ pos: [P1[0] + 0.2, 1.9, P1[2] + 0.3], s: 0.7, rot: t * 3 }] : [], dust: hit ? [{ pos: [P1[0] + 1.6, 0.3, P1[2] + 0.2], s: 1.2, a: 0.7 * (1 - lin(t, te, te + 1.4)) }] : [],
      cam: push(t, L.L9, L.L10, [P1[0] + 0.4, 1.6, P1[2] + 7.0], [P1[0] + 0.3, 1.25, P1[2]], [P1[0] + 0.4, 1.55, P1[2] + 5.6], [P1[0] + 0.4, 1.25, P1[2]], 52, 47) }; });
  // 10. then kicks — one against the other
  const P2 = [6, 0, 4];
  shot(L.L10, (t) => { const tk = wt("coices", L.L10), ph = (t - tk) * 2.2, k = t > tk - 0.1 ? Math.max(0, Math.sin(ph * Math.PI)) : 0, k2 = t > tk + 1.3 ? Math.max(0, Math.sin((ph - 1.4) * Math.PI)) : 0;
    return { light: "day", zebras: [{ pos: [P2[0] - 0.9, 0, P2[2]], yaw: -Math.PI / 2, kick: k }, { pos: [P2[0] + 1.25, 0, P2[2] + 0.2], yaw: Math.PI / 2 + 0.6, kick: k2, rear: 0.4 * k }, { pos: [P2[0] + 4, 0, P2[2] - 3], yaw: 0.4, kick: k2 }, { pos: [P2[0] + 5.6, 0, P2[2] - 3.4], yaw: -2.6, rear: 0.5 * k }],
      impact: k > 0.8 ? [{ pos: [P2[0] + 0.3, 1.2, P2[2] + 0.3], s: 0.6, rot: t * 4 }] : (k2 > 0.8 ? [{ pos: [P2[0] + 4.8, 1.2, P2[2] - 3], s: 0.5 }] : []),
      dust: [0, 1, 2].map((i) => ({ pos: [P2[0] + i * 0.8 - 0.4, 0.25, P2[2] + 0.4], s: 0.9 + 0.3 * Math.sin(t * 3 + i), a: 0.45 * (k + k2) })),
      cam: push(t, L.L10, L.L11, [P2[0] + 0.4, 1.6, P2[2] + 5.4], [P2[0] + 0.6, 1.1, P2[2] - 0.3], [P2[0] + 1.2, 1.5, P2[2] + 4.4], [P2[0] + 1.0, 1.1, P2[2] - 0.5], 56, 50) }; });
  // 11. every night, someone was left behind
  const P3 = [0, 0, 8];
  shot(L.L11, (t) => ({ light: "night", vig: 0.5, zebras: [{ pos: P3, yaw: 1.2, lie: 1, hurt: true, graze: 0.5 }], herd: RIVERH.slice(0, 50).map(([x, z], i) => [x + 2 + (i % 10) * 0.9, z + 20 + lin(t, L.L11, L.L12) * 8 + Math.floor(i / 10) * 1.3, Math.PI, 1, 0]),
    cam: push(t, L.L11, L.L12, [P3[0] - 1.2, 1.1, P3[2] - 3.4], [P3[0] + 0.5, 0.6, P3[2] + 4], [P3[0] - 0.7, 1.0, P3[2] - 2.7], [P3[0] + 0.5, 0.6, P3[2] + 4], 55, 50) }));
  // 12. the lion only waited
  shot(L.L12, (t) => { const h = headCam(DEN, -0.3, 3.2, 0.95, -0.4); return { light: "night", vig: 0.55, lion: lionAt({ lie: 1, yaw: -0.3, lid: 0.55, brow: 0.6, tail: Math.sin(t * 3) * 0.4 }),
    cam: push(t, L.L12, L.L13, h.from, h.at, [h.from[0] + 0.2, h.from[1] - 0.05, h.from[2] - 1.0], h.at, 46, 38) }; });
  // 13. the stripes were the same — two heads face to face
  const P4 = [4, 0, -1];
  shot(L.L13, (t) => ({ light: "day", zebras: [{ pos: [P4[0] - 1.75, 0, P4[2]], yaw: Math.PI / 2, nod: 0.15 }, { pos: [P4[0] + 1.75, 0, P4[2]], yaw: -Math.PI / 2, nod: 0.15 }],
    cam: push(t, L.L13, L.L14, [P4[0], 2.05, P4[2] + 3.4], [P4[0], 1.95, P4[2]], [P4[0], 2.05, P4[2] + 2.6], [P4[0], 1.95, P4[2]], 50, 44) }));
  // 14. each one swore the problem was the other one — arguing circle
  const P5 = [-6, 0, 6];
  shot(L.L14, (t) => ({ light: "day", zebras: [0, 1, 2, 3, 4].map((i) => { const a = i / 5 * Math.PI * 2; return { pos: [P5[0] + Math.cos(a) * 1.7, 0, P5[2] + Math.sin(a) * 1.7], yaw: Math.atan2(-Math.cos(a), -Math.sin(a)), nod: 1, rear: i === 2 ? 0.3 * Math.max(0, Math.sin(t * 4)) : 0 }; }),
    cam: push(t, L.L14, L.L15, [P5[0] + 3.4, 3.4, P5[2] + 5.0], [P5[0], 1.0, P5[2]], [P5[0] + 2.6, 3.0, P5[2] + 4.0], [P5[0], 1.0, P5[2]], 54, 48) }));
  // 15. in the end, fatter than ever
  shot(L.L15, (t) => { const a = 0.6 + lin(t, L.L15, L.L16) * 0.5; return { light: "dawn", lion: lionAt({ lie: 1, fat: 1, lid: 0.8, yaw: 0, tail: 0.3 }),
    cam: { pos: [DEN[0] + Math.sin(a) * 5.2, 2.0, DEN[2] + Math.cos(a) * 5.2], look: [DEN[0], 0.8, DEN[2]], fov: 48 } }; });
  // 16. the few left still argue about who started
  shot(L.L16, (t) => { const k = Math.max(0, Math.sin(t * 5)); return { light: "dusk", vig: 0.5, zebras: [{ pos: [-2, 0, 10], yaw: 1.4, kick: k }, { pos: [-0.2, 0, 10.4], yaw: -1.6, nod: 1 }, { pos: [4, 0, 13], yaw: -0.8, nod: 1 }, { pos: [5.4, 0, 12], yaw: 2.4, rear: 0.4 * k }, { pos: [9, 0, 9], yaw: 0, graze: 1 }],
    lion: lionAt({ pos: [2, 0, 3], lie: 1, fat: 1, lid: 0.85, yaw: 0.2 }), cam: push(t, L.L16, L.L17, [2.5, 6.5, 22], [2.5, 0.8, 9], [2.5, 5.5, 19], [2.5, 0.8, 9], 50, 46) }; });
  // 17. a toothless lion doesn't defeat you
  shot(L.L17, (t) => { const m = seg(t, wt("derrota", L.L17) - 0.3, wt("derrota", L.L17) + 0.3); const h = headCam(DEN, 0, 2.0, 0.9);
    return { light: "night", vig: 0.6, lion: lionAt({ lie: 1, fat: 1, mouth: m * 0.9, lid: 0.5, brow: 0.8 }), cam: push(t, L.L17, L.L18, h.from, h.at, [h.from[0], h.from[1], h.from[2] - 0.55], h.at, 42, 34) }; });
  // 18. ...he only needs you to fight whoever is by your side — two zebras together at sunrise
  shot(L.L18, (t) => ({ light: "dawn", zebras: [{ pos: [12, 0, -1.0], yaw: Math.PI * 0.85, graze: 0 }, { pos: [13.1, 0, -0.6], yaw: Math.PI * 0.85, graze: 0, nod: 0 }],
    cam: push(t, L.L18, L.L19, [10.6, 1.4, 4.5], [12.8, 1.6, -4], [11.0, 1.35, 3.6], [12.8, 1.7, -4], 52, 46) }));
  // 19. share it — back to the opening image (the circle closes)
  shot(L.L19, (t) => { const a = 0.35 + t * 0.09; return { light: "day", vig: 0.45, lion: lionAt({ lie: 1, fat: 1, yaw: t * 0.1, lid: 0.8 }), herd: ringHerd(t, 40, 0.0),
    cam: (() => { const u = ease(lin(t, L.L19, VEND + 1.6)), r = lerp(7, 12, u), b = 0.2 + t * 0.12; return { pos: [DEN[0] + Math.sin(b) * r, lerp(5.5, 10, u), DEN[2] + Math.cos(b) * r], look: [DEN[0], 0.4, DEN[2]], fov: 52 }; })() }; });
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  if (t > TOTAL / FPS - 0.5) st.dark = lin(t, TOTAL / FPS - 0.5, TOTAL / FPS); return st; }
