// Shot plan — "O macaco que achou um celular". Opens with Fahh. L.<id>/E.<id> line times, wt(word, after) word times.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.0) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const MS = [1.6, 0, 0.6];
const tPost = wt("postou", L.L2), tGain = wt("ganhou", L.L2), tMil = wt("mil", L.L3), tMi = wt("milhão", L.L3);
const fol = (t) => t < tMil ? "1" : t < tMi ? "1.000" : "1.000.000";
const selfieCam = { pos: [MS[0] + 0.15, 1.15, MS[2] + 0.9], look: [MS[0], 1.05, MS[2]], fov: 48 };
const lionPos = (t) => [MS[0] + 0.2, 0, lerp(-7.5, MS[2] - 2.3, ss(lin(t, L.L6 - 0.5, L.L7 + 0.3)))];
export function build() {
  // 0. HOOK (Fahh): the monkey finds a glowing phone
  shot(0, (t) => ({ light: "day", shake: Math.max(0, 1 - t / 0.6), mon: { pos: MS, sit: 1, happy: t > wt("famoso", 0) - 0.3 ? 1 : 0.2, phone: fol(0), face: "cam", headYaw: Math.sin(t * 3) * 0.1, jump: t < 0.6 }, cam: push(t, 0, L.L2, [MS[0] + 0.5, 1.0, MS[2] + 1.9], [MS[0], 0.85, MS[2]], [MS[0] + 0.3, 0.95, MS[2] + 1.4], [MS[0], 0.85, MS[2]], 46, 42) }));
  // 1. a selfie, a post... one follower
  shot(L.L2, (t) => ({ light: "day", flash: t > tPost && t < tPost + 0.25 ? 0.8 * (1 - lin(t, tPost, tPost + 0.25)) : 0, mon: { pos: MS, sit: 1, happy: 1, phone: fol(t), selfie: true }, cam: push(t, L.L2, L.L3, [MS[0] - 0.9, 1.3, MS[2] + 1.8], [MS[0], 1.0, MS[2]], [MS[0] - 0.6, 1.2, MS[2] + 1.5], [MS[0], 1.0, MS[2]], 48, 44) }));
  // 2. then a thousand, then a million — he jumps for joy
  shot(L.L3, (t) => ({ light: "day", mon: { pos: MS, happy: 1, jump: true, phone: fol(t), face: "cam" }, cam: push(t, L.L3, L.L4, [MS[0] + 0.8, 1.4, MS[2] + 3.4], [MS[0], 0.8, MS[2]], [MS[0] + 0.6, 1.3, MS[2] + 2.8], [MS[0], 0.8, MS[2]], 50, 46) }));
  // 3. stopped climbing, stopped eating... only the screen (day → dusk, bananas untouched)
  shot(L.L4, (t) => ({ light: t < wt("só", L.L4) ? "day" : "dusk", vig: 0.5, mon: { pos: MS, sit: 1, happy: -0.2, phone: "1.000.000", lookUp: -0.6 }, pile: { pos: [MS[0] + 1.1, 0, MS[2] - 0.6], n: 12 },
    cam: push(t, L.L4, L.L5, [MS[0] + 2.2, 2.4, MS[2] + 3.2], [MS[0], 0.6, MS[2]], [MS[0] + 0.5, 1.0, MS[2] + 1.3], [MS[0], 0.75, MS[2]], 52, 42) }));
  // 4. a notification: "the lion started following you"
  shot(L.L5, (t) => ({ light: "dusk", vig: 0.5, mon: { pos: MS, sit: 1, happy: t > wt("leão", L.L5) ? 1 : 0, phone: "1.000.001", lookUp: -0.6 }, cam: push(t, L.L5, L.L6, [MS[0] + 0.4, 1.05, MS[2] + 1.5], [MS[0], 0.85, MS[2]], [MS[0] + 0.3, 1.0, MS[2] + 1.15], [MS[0], 0.85, MS[2]], 44, 40) }));
  // 5. he thought it was just another fan... the lion creeps up behind him
  shot(L.L6, (t) => ({ light: "dusk", vig: 0.55, mon: { pos: MS, sit: 1, happy: 1, phone: "1.000.001", lookUp: -0.6 }, lion: { pos: lionPos(t), yaw: 0, walk: t * 0.45, lid: 0.3, brow: 1, mouth: 0.15, headPitch: 0.15 },
    cam: push(t, L.L6, L.L7, [MS[0] + 0.5, 1.05, MS[2] + 2.8], [MS[0] + 0.1, 0.85, MS[2] - 4], [MS[0] + 0.4, 1.0, MS[2] + 2.2], [MS[0] + 0.1, 0.9, MS[2] - 4], 46, 42) }));
  // 6. but the lion was REALLY following him! — he turns, the lion roars, he flees up the tree
  shot(L.L7, (t) => { const tv = wt("verdade", L.L7), up = ss(lin(t, tv + 0.1, tv + 0.9)); return { light: "dusk", vig: 0.5, shake: t > tv - 0.1 && t < tv + 0.6 ? 1 : 0,
    mon: { pos: L3(MS, [0.25, 3.2, -1.55], up), yaw: t > tv ? Math.PI : 0, sit: 1 - up, happy: -1, armsUp: 1, climb: up > 0 && up < 1, phone: up < 0.2 ? "1.000.001" : null, headYaw: t < tv ? Math.PI * 0.8 * lin(t, L.L7, L.L7 + 0.5) : 0 },
    lion: { pos: [MS[0] + 0.2, 0, MS[2] - 2.0], yaw: 0, mouth: seg2(t, tv - 0.2, tv + 0.2), lid: 0.2, brow: 1 },
    cam: push(t, L.L7, L.L8, [MS[0] + 2.4, 1.5, MS[2] + 3.2], [MS[0] - 0.2, 1.1, MS[2] - 1.0], [MS[0] + 2.8, 2.0, MS[2] + 3.6], [MS[0] - 0.4, 1.6, MS[2] - 1.0], 52, 54) }; });
  // 7. put the phone down a bit... but first, follow! — monkey safe up the tree, the lion sniffing the phone
  shot(L.L8, (t) => ({ light: "dusk", mon: { pos: [0.25, 3.2, -1.55], yaw: Math.PI, climb: false, sit: 1, happy: 0.5 }, lion: { pos: [MS[0] - 0.3, 0, MS[2] - 0.6], yaw: 2.6, headPitch: 0.35, lid: 0.5 },
    cam: push(t, L.L8, VEND + 2.0, [2.8, 2.2, 4.6], [0.6, 1.8, -0.8], [3.4, 2.6, 5.6], [0.6, 1.9, -0.8], 52, 54) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
const seg2 = (t, a, b) => ss(lin(t, a, b));
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  if (t >= tGain - 0.1 && t < L.L4) st.post = { k: lin(t, tGain - 0.1, tGain + 0.25), n: fol(t), inner: { light: "day", mon: { pos: MS, sit: 1, happy: 1, phone: "1", selfie: true }, cam: selfieCam } };
  const tn = wt("notificação", L.L5) - 0.1; if (t >= tn && t < L.L6 + 0.8) st.notif = { k: ease(lin(t, tn, tn + 0.35)) };
  if (t >= wt("segue", L.L8) - 0.1) st.follow = { k: lin(t, wt("segue", L.L8) - 0.1, wt("segue", L.L8) + 0.2) };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
