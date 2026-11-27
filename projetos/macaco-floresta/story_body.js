// Shot plan — "O macaco que vendeu a floresta". L.<id>/E.<id> = line start/end, wt(word, after) = word time. Opens with the "Fahh" SFX at 0 s.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 1.8) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const MS = [1.6, 0, 0.6], MAN = [3.3, 0, 1.4], PILE = [2.7, 0, 1.9], LAST = [0, 0, -2];
const NT = 150;
// trees visible behind the monkey from a camera (to make them fall in the hook)
const behind = (cam, look, n) => { const dx = look[0] - cam[0], dz = look[2] - cam[2], L = Math.hypot(dx, dz); return (window.TREE_XZ || []).map(([x, z], i) => { const vx = x - cam[0], vz = z - cam[2], d = Math.hypot(vx, vz); return { i, d, c: (vx * dx + vz * dz) / (d * L) }; }).filter((o) => o.c > 0.8 && o.d > 5 && o.d < 22).sort((a, b) => a.d - b.d).slice(0, n).map((o) => o.i); };
export function build() {
  // 0. HOOK (Fahh at 0 s): the monkey proudly holds up his banana while the forest falls behind him
  shot(0, (t) => { const cam = [MS[0] + 0.5, 1.15, MS[2] + 2.3], look = [MS[0], 0.95, MS[2]]; const fall = behind(cam, look, 5);
    return { light: "day", shake: Math.max(0, 1 - t / 0.6), mon: { pos: MS, sit: 0, happy: 1, banana: true, armsUp: 0.95 + 0.05 * Math.sin(t * 6), jump: true, headYaw: -0.15 }, cut: 0, falling: fall.map((i, k) => [i, lin(t, 0.15 + k * 0.45, 0.9 + k * 0.45)]),
      dozer: { pos: [MS[0] - 3.5, 0, MS[2] - 8], yaw: 0.6 }, cam: push(t, 0, L.L2, cam, look, [cam[0] - 0.2, 1.05, cam[2] - 0.6], look, 50, 44) }; });
  // 1. a man arrives: one banana for every tree
  shot(L.L2, (t) => ({ light: "day", mon: { pos: MS, yaw: 0.9, sit: 1, happy: 0.4, headYaw: 0.2 }, man: { pos: MAN, yaw: -2.2, offer: lin(t, wt("banana", L.L2) - 0.3, wt("banana", L.L2) + 0.2) }, cut: 0,
    cam: push(t, L.L2, L.L3, [2.4, 1.6, 6.2], [2.5, 0.9, 1.0], [2.5, 1.45, 5.0], [2.5, 0.95, 1.0], 54, 48) }));
  // 2. best deal in the world — he jumps for joy
  shot(L.L3, (t) => ({ light: "day", mon: { pos: MS, sit: 0, happy: 1, jump: true, armsUp: 1, banana: true }, man: { pos: MAN, yaw: -2.2, offer: 0.4 }, cut: 0,
    cam: push(t, L.L3, L.L4, [MS[0] + 0.3, 1.0, MS[2] + 2.6], [MS[0], 0.95, MS[2]], [MS[0] + 0.1, 0.95, MS[2] + 2.0], [MS[0], 0.95, MS[2]], 50, 46) }));
  // 3. one tree... ten... a hundred — aerial, the forest disappears, the pile grows
  shot(L.L4, (t) => { const t1 = wt("uma", L.L4), t10 = wt("dez", L.L4), t100 = wt("cem", L.L4);
    const cut = t < t10 ? 0 : t < t100 ? 1 + Math.floor(9 * lin(t, t10, t10 + 0.3)) : 10 + Math.floor((NT - 10) * lin(t, t100, t100 + 0.9));
    const falling = t < t10 ? [[0, lin(t, t1, t1 + 0.5)]] : t < t100 ? [] : [[cut, 0.5], [cut + 1, 0.8]];
    const a = 0.4 + (t - L.L4) * 0.12; return { light: "day", mon: { pos: MS, happy: 1, armsUp: 0.8, jump: true, banana: true }, cut, falling, pile: { pos: PILE, n: cut < 1 ? 0 : 6 + cut * 2.2 }, dozer: { pos: [-8 + (t - L.L4) * 3, 0, 9], yaw: 0.2 },
      cam: { pos: [Math.sin(a) * 16, 34, Math.cos(a) * 16], look: [0, 0, 0], fov: 55 } }; });
  // 4. he climbs to eat on top of the last tree
  shot(L.L5, (t) => { const u = lin(t, L.L5, L.L6 - 0.2), h = lerp(0.2, (window.LAST_H || 12.6) - 0.6, ss(u));
    return { light: "day", cut: NT, pile: { pos: PILE, n: 340 }, mon: { pos: [LAST[0], h, LAST[2] + 0.48], yaw: Math.PI, climb: u < 1, banana: true, happy: 0.8 },
      cam: { pos: [LAST[0] + 1.6, h + 0.6, LAST[2] + 3.4], look: [LAST[0], h + 0.4, LAST[2]], fov: 52 } }; });
  // 5. ...and there was no other tree to climb — the camera rises: only stumps
  shot(L.L6, (t) => { const top = (window.LAST_TOP || 14) - 0.2, u = ease(lin(t, L.L6, L.L7)), sad = t > wt("tocos", L.L6) - 1.2;
    return { light: "day", cut: NT, pile: { pos: PILE, n: 340 }, mon: { pos: [LAST[0], top, LAST[2]], sit: 1, happy: sad ? -0.8 : 0.3, banana: true, headYaw: Math.sin(t * 1.4) * 0.6 },
      cam: { pos: [LAST[0] + lerp(2.4, 9, u), top + lerp(1.2, 9, u), LAST[2] + lerp(3.6, 15, u)], look: [LAST[0], top - lerp(0, 4, u), LAST[2]], fov: lerp(48, 58, u) } }; });
  // 6. a thousand bananas... and nowhere to live (dusk)
  shot(L.L7, (t) => ({ light: "dusk", vig: 0.5, cut: NT, pile: { pos: PILE, n: 400 }, mon: { pos: [PILE[0] - 0.9, 0, PILE[2] + 0.2], sit: 1, happy: -1, banana: true, yaw: 0.3 },
    cam: push(t, L.L7, L.L8, [PILE[0] + 0.6, 1.7, PILE[2] + 4.8], [PILE[0] - 0.4, 0.7, PILE[2]], [PILE[0] + 0.4, 1.4, PILE[2] + 3.8], [PILE[0] - 0.5, 0.75, PILE[2]], 52, 46) }));
  // 7. be careful what you trade for what's easy — close on the sad face
  shot(L.L8, (t) => { const m = [PILE[0] - 0.9, 0, PILE[2] + 0.2]; return { light: "dusk", vig: 0.55, cut: NT, pile: { pos: PILE, n: 400 }, mon: { pos: m, sit: 1, happy: -1, banana: true, yaw: 0.3, eat: 0.4 },
    cam: push(t, L.L8, L.L9, [m[0] + 0.55, 1.0, m[2] + 1.9], [m[0], 0.9, m[2]], [m[0] + 0.4, 0.98, m[2] + 1.45], [m[0], 0.9, m[2]], 44, 38) }; });
  // 8. share it — pull back over the bare land, the last tree alone
  shot(L.L9, (t) => { const u = ease(lin(t, L.L9, VEND + 1.8)); return { light: "dusk", vig: 0.45, cut: NT, pile: { pos: PILE, n: 400 }, mon: { pos: [PILE[0] - 0.9, 0, PILE[2] + 0.2], sit: 1, happy: -1, banana: true, yaw: 0.3 },
    cam: { pos: [PILE[0] + lerp(2, 10, u), lerp(2.5, 14, u), PILE[2] + lerp(5, 22, u)], look: [0, lerp(1, 0, u), lerp(1, -1, u)], fov: 52 } }; });
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  const tb = wt("banana", 0); if (t > tb && t < tb + 0.25) st.a.flash = 0.35 * (1 - lin(t, tb, tb + 0.25));
  if (t > TOTAL / FPS - 0.4) st.dark = lin(t, TOTAL / FPS - 0.4, TOTAL / FPS); return st; }
