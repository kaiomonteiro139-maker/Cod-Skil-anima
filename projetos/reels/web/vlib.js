// Shared helpers for vertical (1080x1920) reel shot plans. Sets: bedroom x=0, kitchen 20, café 40, office 60, street 80, faculdade 100, delegacia 120, court 140, market 160.
export const FPS = 30;
export const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
export const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
export const seg = (t, a, b, e = ss) => e(cl((t - a) / (b - a)));
export const lin = (t, a, b) => cl((t - a) / (b - a));
export const blink = (t, s = 1) => ((t * 1000 + s * 777) % 3100) < 120;
export const X = { bed: 0, kit: 20, caf: 40, off: 60, st: 80, fac: 100, del: 120, crt: 140, mkt: 160 };
export const push = (t, t0, t1, pA, lA, pB, lB, fA = 50, fB = fA, rA = 0, rB = rA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u), roll: lerp(rA, rB, u) }; };
export const actor = (id, pos, opts, extra = {}) => ({ id, pos, opts: { seed: 2, ...opts }, ...extra });
export const hero = (pos, opts, extra = {}) => actor("hero", pos, opts, extra);
export const BEDHERO = [-1.0, 0.47, -0.9];
/** vertical close-up on one actor (head in the upper third), slow push-in */
export function closeV(t, t0, t1, light, a, extra = {}) {
  const hy = a.pos[1] + (a.opts.mode === "stand" ? 1.45 : 0.92), [x, , z] = a.pos, side = extra.side ?? 0.12, d0 = extra.d0 ?? 1.55, d1 = extra.d1 ?? 1.15;
  return { light, ...extra, actors: [a, ...(extra.more || [])], cam: push(t, t0, t1, [x + side, hy + 0.05, z + d0], [x, hy - 0.2, z], [x + side * 0.4, hy + 0.02, z + d1], [x, hy - 0.17, z], extra.fA ?? 52, extra.fB ?? 46, extra.rA ?? -1, extra.rB ?? 0.5) };
}
/** first-person phone on the bed (or anywhere: pass cam) */
export const phoneV = (t, t0, t1, mode, scr = {}, extra = {}) => ({ light: "bed", phone: mode, scr, phoneShot: extra.ps || {}, vig: 0.5, ...extra,
  cam: extra.cam || push(t, t0, t1, [-0.95, 1.25, -0.2], [-1.4, 0.7, -1.6], [-0.95, 1.23, -0.24], [-1.4, 0.7, -1.6], 45, 41, -1.2, 0.8) });
/** shot list → stateAt with 0.4 s dissolves (unless cut) and an end card */
export function makeStateAt(SH, TOTAL, endAt, endCard) {
  SH.sort((a, b) => a.t0 - b.t0);
  return function stateAt(t) {
    let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++;
    const cur = SH[i]; const st = { a: cur.fn(t) };
    if (i > 0 && !cur.cut && t < cur.t0 + 0.4) { st.b = st.a; st.a = SH[i - 1].fn(t); st.mix = ss((t - cur.t0) / 0.4); }
    if (endCard && t >= endAt) st.end = { ...endCard, k: seg(t, endAt, endAt + 0.9, (x) => x) };
    if (t > TOTAL / FPS - 0.35) st.dark = seg(t, TOTAL / FPS - 0.35, TOTAL / FPS);
    return st;
  };
}
