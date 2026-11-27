const L = {"L1": 0.62, "L2": 4.108, "L3": 6.124, "L4": 9.257, "L5": 10.719, "L6": 15.118};
const E = {"L1": 3.808, "L2": 5.924, "L3": 8.957, "L4": 10.219, "L5": 14.818, "L6": 19.509};
const VEND = 19.509;
const WT = [["Esse", 0.62], ["caranguejinho", 0.86], ["ficou", 1.34], ["preso", 1.56], ["longe", 2.02], ["do", 2.2], ["mar...", 2.38], ["numa", 2.54], ["areia", 2.693], ["quente", 3.0], ["demais!", 3.22], ["O", 4.14], ["mar", 4.22], ["tá", 4.3], ["longe", 4.5], ["demais", 4.76], ["pra", 5.1], ["ele", 5.34], ["chegar.", 5.52], ["Cada", 6.1], ["pessoa", 6.28], ["que", 6.68], ["seguir", 6.84], ["o", 7.06], ["canal", 7.18], ["faz", 7.38], ["uma", 7.62], ["onda", 7.8], ["chegar", 7.94], ["mais", 8.14], ["perto!", 8.48], ["Olha...", 9.2], ["alguém", 9.44], ["seguiu!", 9.7], ["A", 10.7], ["onda", 10.86], ["chegou", 11.02], ["perto!", 11.3], ["Mas", 12.32], ["ele", 12.48], ["precisa", 12.62], ["de", 12.9], ["mil", 13.18], ["ondas", 13.34], ["pra", 13.66], ["voltar", 13.84], ["pra", 14.1], ["casa.", 14.3], ["Segue", 15.12], ["agora", 15.46], ["e", 15.72], ["salva", 15.86], ["ele!", 16.12], ["No", 16.86], ["próximo", 17.08], ["vídeo,", 17.48], ["eu", 17.9], ["mostro", 18.2], ["se", 18.56], ["ele", 18.72], ["chegou", 18.84], ["no", 19.06], ["mar.", 19.22]];
const wt = (w, after = 0) => { const r = WT.find(([x, s]) => s >= after - 0.01 && x.toLowerCase().replace(/[^a-zà-ú]/g, '') === w); return r ? r[1] : after; };
// Shot plan — "O caranguejinho longe do mar". Opens with Fahh.
export const FPS = 30;
export const TOTAL = Math.round((VEND + 2.2) * FPS);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x));
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lin = (t, a, b) => cl((t - a) / (b - a));
const push = (t, t0, t1, pA, lA, pB, lB, fA = 45, fB = fA) => { const u = ease((t - t0) / (t1 - t0)); return { pos: L3(pA, pB, u), look: L3(lA, lB, u), fov: lerp(fA, fB, u) }; };
const SH = []; const shot = (t0, fn) => SH.push({ t0, fn });
const CP = [0, 0, 0.6];
const tWave = wt("seguiu", L.L4) + 0.05;
const wave = (t) => t < tWave ? 0 : 0.85 * ease(lin(t, tWave, tWave + 1.4));
const hot = (o = {}) => ({ pos: CP, yaw: 0.2, hot: 1, ...o });
export function build() {
  shot(0, (t) => ({ shake: Math.max(0, 1 - t / 0.7), red: 0.45 + 0.3 * Math.sin(t * 8), wave: 0, crab: hot(), cam: push(t, 0, L.L2, [0.15, 0.45, 1.5], [0, 0.22, CP[2]], [0.12, 0.4, 1.25], [0, 0.22, CP[2]], 44, 40) }));
  // the sea is too far: camera behind the crab looking at the distant water
  shot(L.L2, (t) => ({ red: 0.2, wave: 0, crab: hot({ yaw: Math.PI }), cam: push(t, L.L2, L.L3, [0.3, 0.7, 2.2], [0, 0.2, -4], [0.25, 0.6, 1.8], [0, 0.15, -4], 48, 46) }));
  shot(L.L3, (t) => ({ wave: 0, crab: hot({ yaw: -0.3, hot: 0.9 }), cam: push(t, L.L3, L.L4, [-0.9, 0.6, 1.8], [0, 0.22, CP[2]], [-0.75, 0.55, 1.55], [0, 0.22, CP[2]], 46, 44) }));
  shot(L.L4, (t) => { const on = t > tWave + 0.8; return { wave: wave(t), crab: { pos: CP, yaw: on ? Math.PI * 0.9 : 0.2, hot: on ? 0.2 : 1, dance: on, happy: on ? 1 : 0 }, cam: push(t, L.L4, L.L5, [1.6, 1.1, 2.4], [0, 0.15, -0.6], [1.4, 1.0, 2.1], [0, 0.15, -0.6], 50, 48) }; });
  shot(L.L5, (t) => ({ wave: wave(t), crab: { pos: CP, yaw: Math.PI * 0.9, hot: 0.4, happy: 0 }, cam: push(t, L.L5, L.L6, [0.8, 0.9, 2.2], [0, 0.15, -0.4], [2.2, 2.8, 4.4], [0, 0, -1.2], 46, 48) }));
  shot(L.L6, (t) => ({ wave: wave(t), crab: { pos: CP, yaw: 0, hot: 0.6, happy: 0 }, cam: push(t, L.L6, VEND + 2.2, [0.05, 0.4, 1.35], [0, 0.24, CP[2]], [0.04, 0.38, 1.15], [0, 0.24, CP[2]], 42, 38) }));
  SH.sort((a, b) => a.t0 - b.t0);
}
build();
export function stateAt(t) { let i = 0; while (i + 1 < SH.length && t >= SH[i + 1].t0) i++; const st = { a: SH[i].fn(t) };
  st.bar = { k: lin(t, 0.55, 0.9), v: t < tWave ? 0.01 : lerp(0.01, 0.05, ease(lin(t, tWave, tWave + 1.4))), icon: "🌊", label: "MAR:", numX: 280, col: "#2a9ad8" };
  if (t > wt("cada", L.L3) - 0.1 && t < L.L4) st.tags = [{ text: "+1 SEGUIDOR = +1 ONDA 🌊", k: lin(t, wt("cada", L.L3) - 0.1, wt("cada", L.L3) + 0.2) }];
  if (t > wt("mas", L.L5) && t < L.L6) st.tags = [{ text: "🔒 META: 1.000 ONDAS", k: lin(t, wt("mas", L.L5), wt("mas", L.L5) + 0.3), bg: "#ff8a5a" }];
  if (t > L.L4 - 0.1 && t < L.L5) st.follow = { k: lin(t, L.L4 - 0.1, L.L4 + 0.2), tap: lin(t, tWave - 0.35, tWave - 0.05), hand: true };
  if (t > L.L6 - 0.1) st.follow = { k: lin(t, L.L6 - 0.1, L.L6 + 0.2), tap: 0, hand: true };
  if (t > TOTAL / FPS - 0.35) st.dark = lin(t, TOTAL / FPS - 0.35, TOTAL / FPS); return st; }
