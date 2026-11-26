const L = {"L1": 0.62, "L2": 4.248, "L3": 6.768, "L4": 9.688, "L5": 11.203, "L6": 16.431};
const E = {"L1": 3.948, "L2": 6.568, "L3": 9.388, "L4": 10.703, "L5": 16.131, "L6": 20.822};
const VEND = 20.822;
const WT = [["Essa", 0.62], ["corujinha", 0.84], ["tá", 1.28], ["sozinha", 1.44], ["na", 1.9], ["floresta", 2.06], ["escura...", 2.5], ["e", 2.84], ["tá", 2.96], ["morrendo", 3.04], ["de", 3.42], ["medo!", 3.56], ["Ela", 4.2], ["ainda", 4.42], ["é", 4.62], ["bebê...", 4.74], ["e", 5.02], ["qualquer", 5.04], ["barulho", 5.16], ["assusta", 5.7], ["ela.", 6.12], ["Cada", 6.74], ["curtida", 6.94], ["nesse", 7.4], ["vídeo", 7.58], ["acende", 7.9], ["um", 8.24], ["vagalume", 8.38], ["pra", 8.82], ["ela!", 9.04], ["Olha...", 9.66], ["alguém", 9.84], ["curtiu!", 10.14], ["Acendeu", 11.1], ["a", 11.6], ["primeira", 11.72], ["luz!", 11.96], ["Mas", 13.06], ["ela", 13.26], ["precisa", 13.44], ["de", 13.74], ["mil", 14.02], ["vagalumes", 14.14], ["pra", 14.64], ["floresta", 15.06], ["ficar", 15.32], ["clara.", 15.58], ["Curte", 16.42], ["e", 16.68], ["segue", 16.84], ["agora!", 17.0], ["No", 18.02], ["próximo", 18.2], ["vídeo,", 18.58], ["eu", 18.96], ["mostro", 19.28], ["a", 19.62], ["floresta", 19.72], ["toda", 20.04], ["acesa.", 20.26]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "A corujinha com medo do escuro". Opens with Fahh. Likes version.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const OP = [0.25, 1.27, 0.05], H = [0.25, 1.72, 0.05];
const tLike = wt("curtiu", L.L4) + 0.05;
const sc = (o = {}) => ({ pos: OP, yaw: 0.05, scared: 1, shiver: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.3 + 0.2 * Math.sin(t * 8), vig: 0.75, owl: sc(), cam: push(t, 0, L.L2, [0.35, 1.78, 0.95], H, [0.3, 1.75, 0.75], H, 42, 38) }));
  shot(L.L2, (t) => ({ vig: 0.75, owl: sc({ look: Math.sin(t * 3) * 0.7 }), cam: push(t, L.L2, L.L3, [1.8, 2.0, 3.2], [0, 1.3, -0.2], [1.5, 1.85, 2.7], [0, 1.3, -0.2], 48, 46) }));
  shot(L.L3, (t) => ({ vig: 0.75, owl: sc({ look: -0.2 }), cam: push(t, L.L3, L.L4, [-0.5, 1.9, 1.4], [0.25, 1.6, 0], [-0.4, 1.85, 1.2], [0.25, 1.6, 0], 44, 42) }));
  shot(L.L4, (t) => { const on = t > tLike; const k = on ? lin(t, tLike, tLike + 0.8) : 0; return { vig: 0.75 - 0.3 * k, lit: k, fly: k, flash: on && t < tLike + 0.25 ? 0.35 * (1 - lin(t, tLike, tLike + 0.25)) : 0,
    owl: on ? { pos: OP, yaw: 0.2, scared: 0, happy: 1, flap: t > tLike + 0.5 && t < tLike + 1.5, look: 0.4 } : sc(), cam: push(t, L.L4, L.L5, [0.9, 1.9, 1.9], [0.25, 1.55, 0], [0.8, 1.85, 1.7], [0.25, 1.55, 0], 46, 44) }; });
  shot(L.L5, (t) => ({ vig: 0.45, lit: 1, fly: 1, owl: { pos: OP, yaw: 0.1, scared: 0, happy: 1, look: 0.3 }, cam: push(t, L.L5, L.L6, [0.7, 1.85, 1.6], [0.25, 1.6, 0], [2.4, 2.8, 5.2], [0, 1.2, -0.4], 44, 48) }));
  shot(L.L6, (t) => ({ vig: 0.55, lit: 0.7, fly: 1, owl: sc({ scared: 0.4, shiver: 0, tears: 0 }), cam: push(t, L.L6, VEND + 2.2, [0.38, 1.8, 1.35], H, [0.34, 1.78, 1.12], H, 40, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tLike ? 0.0 : lerp(0.0, 0.05, ease(lin(t, tLike, tLike + 1.0))), icon: "✨", label: "LUZ:", numX: 260, col: "#f2c230" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 CURTIDA = +1 VAGALUME ✨", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 VAGALUMES", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.like = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tLike - 0.35, tLike - 0.05), hand: true };
  if (t > L.L6 - 0.1) { st.like = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: false, y: 0.55 }; st.follow = { k: lin(t, wt("segue", L.L6) - 0.1, wt("segue", L.L6) + 0.2), tap: 0, hand: true }; }
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
