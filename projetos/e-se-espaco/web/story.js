const L = {"L1": 0.62, "L2": 3.154, "L3": 6.899, "L4": 10.718, "L5": 14.522, "L6": 18.399};
const E = {"L1": 2.854, "L2": 6.699, "L3": 10.518, "L4": 14.322, "L5": 18.099, "L6": 23.225};
const VEND = 23.225;
const WT = [["E", 0.62], ["se", 0.74], ["você", 0.82], ["tirasse", 1.06], ["o", 1.54], ["capacete...", 1.66], ["no", 2.12], ["espaço?", 2.28], ["Primeiro:", 3.1], ["você", 3.82], ["não", 4.0], ["ia", 4.26], ["explodir.", 4.46], ["Isso", 5.54], ["é", 5.74], ["coisa", 5.86], ["de", 6.06], ["filme!", 6.26], ["Mas", 6.84], ["a", 7.02], ["saliva", 7.18], ["na", 7.46], ["sua", 7.66], ["língua", 7.86], ["ia", 8.32], ["começar", 8.46], ["a", 8.72], ["ferver...", 8.94], ["mesmo", 9.2], ["sem", 9.5], ["calor", 9.76], ["nenhum.", 10.06], ["Em", 10.74], ["uns", 10.84], ["quinze", 11.0], ["segundos,", 11.26], ["você", 11.96], ["ia", 12.22], ["desmaiar,", 12.4], ["porque", 13.04], ["não", 13.12], ["tem", 13.36], ["oxigênio.", 13.62], ["Mas", 14.46], ["se", 14.66], ["alguém", 14.82], ["te", 14.98], ["puxasse", 15.12], ["de", 15.54], ["volta", 15.72], ["em", 15.94], ["menos", 16.14], ["de", 16.36], ["um", 16.54], ["minuto...", 16.64], ["dava", 17.08], ["pra", 17.24], ["sobreviver!", 17.42], ["Você", 18.34], ["sabia", 18.6], ["disso?", 19.02], ["Comenta!", 20.02], ["E", 21.12], ["segue", 21.28], ["pra", 21.52], ["ver", 21.7], ["o", 21.9], ["próximo:", 22.0], ["e", 22.64], ["se", 22.7], ["você...", 22.76]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "E se você tirasse o capacete no espaço?". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const P0 = [0, -1.0, 0], tCap = wt("capacete", L.L1), tBoil = wt("ferver", L.L3), tKo = wt("desmaiar", L.L4), tPull = wt("puxasse", L.L5);
const hel = (t) => (t < tCap ? 0 : lin(t, tCap, tCap + 0.7) + Math.max(0, t - tCap - 0.7) * 0.5);
const fl = (o = {}) => ({ pos: P0, yaw: 0.15, arms: "float", floaty: 1, face: "calm", ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.6), helm: hel(t), red: t > tCap ? 0.2 : 0, guy: fl({ arms: t > 0.9 && t < tCap + 0.8 ? "helmet" : "float", face: t > tCap ? "scared" : "calm" }), cam: push(t, 0, L.L2, [0.6, 1.1, 2.6], [0, 0.7, 0], [0.45, 1.0, 2.0], [0, 0.75, 0], 44, 40) }));
  shot(L.L2, (t) => ({ helm: hel(t), guy: fl({ face: "scared", arms: t > wt("explodir", L.L2) ? "float" : "throat" }), cam: push(t, L.L2, L.L3, [1.6, 0.9, 3.4], [0, 0.4, 0], [1.3, 0.9, 2.9], [0, 0.4, 0], 46, 44) }));
  shot(L.L3, (t) => ({ boil: lin(t, tBoil - 0.1, tBoil + 0.3), guy: fl({ face: "scared", arms: "float", headYaw: 0.15, tumble: 0.25 }), cam: push(t, L.L3, L.L4, [0.7, 1.0, 1.65], [0, 0.82, 0], [0.55, 0.95, 1.35], [0, 0.82, 0], 42, 40) }));
  shot(L.L4, (t) => { const ko = lin(t, tKo, tKo + 0.5); return { boil: 1 - ko, vig: 0.35 + 0.6 * ko, guy: fl({ face: ko > 0.5 ? "ko" : "scared", tumble: 1 + 2 * ko, headPitch: 0.3 * ko }), cam: push(t, L.L4, L.L5, [0.4, 1.0, 1.8], [0, 0.75, 0], [1.0, 1.4, 3.4], [0, 0.5, 0], 44, 46) }; });
  shot(L.L5, (t) => { const u = ease(lin(t, tPull + 0.3, E.L5)); return { vig: 0.6 - 0.25 * u, tether: t > tPull ? 1 : 0, guy: fl({ pos: L3(P0, [-2.2, 1.2, -5.9], u), face: u > 0.9 ? "calm" : "ko", tumble: 2, yaw: lerp(0.15, -1.2, u) }), cam: push(t, L.L5, E.L5 + 0.2, [2.6, 1.4, 4.8], [-0.8, 0.6, -2.0], [2.2, 1.6, 4.2], [-1.4, 1.2, -3.6], 50, 48) }; });
  shot(L.L6, (t) => ({ helm: 0, guy: fl({ face: "happy", arms: "wave" }), cam: push(t, L.L6, VEND + 2.2, [0.5, 1.05, 2.3], [0, 0.6, 0], [0.4, 1.0, 2.05], [0, 0.62, 0], 44, 42) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
const lab = (text, t0, t1, t) => (t > t0 && t < t1 ? { text, k: lin(t, t0, t0 + 0.25), label: true, y: 0.2 } : null);
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.tags = [lab("❌ NÃO EXPLODE", wt("explodir", L.L2) - 0.1, L.L3, t), lab("🫧 SALIVA FERVE", tBoil - 0.1, L.L4, t), lab("⏱ 15 SEGUNDOS", wt("quinze", L.L4) - 0.1, L.L5, t), lab("✅ MENOS DE 1 MINUTO", wt("menos", L.L5) - 0.1, L.L6, t)].filter(Boolean);
  if (t > wt("segue", L.L6) - 0.1) st.follow = { k: lin(t, wt("segue", L.L6) - 0.1, wt("segue", L.L6) + 0.2), tap: 0, hand: true };
  st.dark = t > TOTAL / FPS - 0.35 ? lin(t, TOTAL / FPS - 0.35, TOTAL / FPS) : 0; return st; }
