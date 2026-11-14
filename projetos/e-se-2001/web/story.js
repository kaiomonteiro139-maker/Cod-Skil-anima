
import { shotAt as sampleShotAt } from "./story_sample.js";
const TIMING = {"P": [[0.0, 0.88], [1.3, 6.76], [7.38, 9.4], [10.08, 15.98], [16.4, 17.34], [17.86, 19.71], [20.0, 23.8], [24.24, 29.72], [30.14, 38.5], [38.88, 41.7], [41.98, 47.86], [48.1, 53.66], [54.24, 55.2], [55.66, 65.02], [65.44, 69.46], [69.88, 78.2], [78.72, 80.54], [80.54, 82.98], [83.4, 90.26], [90.72, 92.52], [93.1, 96.28], [96.6, 99.0], [99.58, 100.74], [100.88, 104.24], [104.24, 107.32], [107.62, 108.5], [108.88, 119.06], [119.5, 122.1], [122.44, 127.52], [127.82, 131.64], [131.98, 134.34], [134.74, 135.85], [135.92, 141.9], [142.22, 145.7], [146.04, 153.88], [154.12, 156.88], [157.46, 164.58], [164.98, 167.5], [167.98, 170.0], [170.9, 172.0], [173.713, 176.533], [177.233, 184.113], [185.253, 187.593], [188.073, 195.573], [196.013, 199.893], [201.653, 202.173], [202.173, 202.346], [202.693, 203.06], [203.793, 206.833], [207.233, 214.113], [215.153, 215.673], [216.653, 223.193], [223.713, 224.233], [224.973, 229.353], [229.673, 235.373], [235.793, 240.873], [241.293, 242.913], [243.393, 249.573], [250.033, 250.913], [251.373, 255.973], [256.473, 257.053], [258.053, 259.493], [259.653, 261.593], [262.013, 263.293], [263.633, 274.233], [274.633, 278.893], [279.433, 283.693], [284.353, 295.453], [295.953, 296.513], [296.513, 298.113], [298.813, 302.393], [302.953, 304.893], [305.353, 307.233], [307.733, 308.113], [308.913, 314.153], [314.153, 315.613]], "WP": [[0.0, 0.3], [1.3, 1.42, 1.98, 2.14, 2.83, 3.42, 3.54, 3.84, 4.16, 4.28, 5.04, 5.14, 5.2, 5.74, 6.38], [7.38, 7.68, 7.86, 7.94, 8.86, 8.995, 9.13, 9.265], [10.08, 10.18, 10.26, 10.38, 11.02, 11.12, 11.5, 11.76, 11.92, 12.08, 12.24, 12.4, 12.56, 13.06, 13.26, 13.38, 13.66, 13.8, 14.5, 14.92, 15.08, 15.16, 15.5], [16.4, 16.58, 16.78, 17.02], [17.86, 17.96, 18.36, 19.51], [20.0, 20.24, 20.38, 20.56, 21.34, 21.52, 21.74, 21.86, 21.94, 22.18, 22.44, 23.2, 23.38, 23.48], [24.24, 24.38, 24.48, 24.84, 25.12, 25.44, 25.52, 26.08, 26.26, 26.44, 27.26, 27.44, 27.82, 28.0, 28.36, 28.74, 28.9, 29.0, 29.18, 29.32], [30.14, 30.4, 30.74, 30.86, 31.5, 31.64, 32.34, 32.38, 32.66, 32.88, 33.0, 33.64, 33.74, 34.62, 34.72, 35.06, 35.32, 35.9, 36.74, 36.78, 36.9, 37.26, 37.9, 38.04], [38.88, 39.12, 39.4, 39.5, 40.34, 40.72, 40.88, 41.04, 41.22], [41.98, 42.08, 42.48, 42.62, 42.88, 44.0, 44.16, 44.3, 44.44, 44.58, 45.02, 45.16, 45.46, 45.86, 46.4, 46.58, 46.9, 47.18, 47.5], [48.1, 48.28, 48.92, 49.14, 49.6, 49.76, 49.96, 50.22, 50.5, 50.8, 50.94, 51.32, 51.62, 52.4, 52.62, 52.76, 53.02, 53.34], [54.24, 54.5, 54.88], [55.66, 55.86, 56.24, 56.7, 57.24, 57.56, 58.46, 58.56, 59.16, 59.44, 59.66, 60.02, 60.78, 60.96, 61.2, 61.5, 61.72, 62.01, 62.14, 62.5, 62.76, 62.86, 63.72, 64.04, 64.26, 64.32, 64.44, 64.7], [65.44, 65.58, 65.78, 66.16, 66.22, 66.36, 67.04, 67.14, 67.84, 67.98, 68.32, 68.92], [69.88, 70.12, 70.5, 70.66, 71.04, 71.36, 71.8, 72.32, 72.58, 72.86, 73.6, 73.64, 74.0, 74.16, 74.68, 75.06, 75.84, 76.04, 76.22, 76.24, 76.32, 76.6, 77.0, 77.2, 77.66, 77.88], [78.72, 79.14, 79.72, 80.08], [80.54, 81.08, 81.92, 82.1, 82.28, 82.7, 82.82], [83.4, 83.56, 83.685, 83.81, 83.935, 84.36, 84.48, 84.72, 85.08, 85.48, 86.46, 86.86, 86.98, 87.08, 87.72, 87.82, 88.62, 88.68, 89.52, 89.86], [90.72, 90.84, 91.18, 91.38, 91.66, 91.82, 92.08], [93.1, 93.68, 94.22, 94.64, 94.76, 95.5, 95.66], [96.6, 96.86, 97.56, 97.82, 98.0, 98.22, 98.52, 98.74], [99.58, 99.84, 100.1, 100.54], [100.88, 101.12, 101.32, 102.04, 102.12, 102.4, 102.54, 102.86, 103.08, 103.2, 103.547, 103.893], [104.24, 104.66, 104.88, 105.06, 105.36, 105.44, 105.82, 105.96, 106.38, 106.44, 106.76, 106.82, 107.0], [107.62, 107.72, 108.14], [108.88, 108.92, 109.12, 109.58, 109.62, 109.94, 110.38, 110.52, 110.62, 110.72, 110.82, 111.5, 111.86, 112.38, 112.74, 112.8, 113.18, 113.32, 113.98, 114.26, 114.66, 114.92, 115.02, 115.66, 116.04, 116.32, 116.68, 117.22, 117.62, 117.84, 118.18, 118.52], [119.5, 119.64, 119.82, 120.52, 120.7, 120.86, 121.14, 121.22, 121.54, 121.7], [122.44, 122.54, 122.86, 123.14, 123.5, 123.66, 124.38, 125.1, 125.86, 126.02, 126.18, 126.84, 127.09, 127.16], [127.82, 128.06, 128.46, 128.56, 129.3, 129.46, 130.04, 130.24, 130.6, 131.3], [131.98, 132.24, 132.52, 132.72, 132.86, 133.18, 133.48, 133.6, 133.9], [134.74, 134.9, 135.18, 135.65], [135.92, 136.26, 136.44, 137.1, 137.22, 137.613, 137.887, 138.16, 138.9, 138.94, 139.2, 139.36, 139.548, 139.616, 139.684, 139.752, 140.44, 141.22, 141.28], [142.22, 142.38, 142.7, 143.38, 143.54, 143.86, 143.86, 144.36, 144.72, 145.18, 145.36], [146.04, 146.2, 146.44, 146.6, 146.96, 147.14, 147.18, 147.28, 147.6, 147.82, 148.18, 148.5, 149.06, 149.42, 149.74, 149.92, 150.48, 151.02, 151.58, 152.06, 152.36, 152.64, 152.92, 153.24, 153.54], [154.12, 154.32, 154.42, 154.64, 155.22, 156.12, 156.39, 156.5], [157.46, 157.6, 158.06, 158.26, 158.68, 158.96, 159.14, 159.5, 159.72, 160.56, 160.8, 161.12, 161.91, 162.52, 162.74, 163.24, 163.5, 163.94], [164.98, 165.2, 166.1, 166.36, 166.48, 166.54, 166.8, 167.0, 167.16], [167.98, 168.22, 168.52, 168.64, 169.22, 169.36, 169.56, 169.66], [170.9, 171.42], [173.713, 174.033, 174.273, 175.153, 175.693, 176.013], [177.233, 177.433, 177.633, 178.293, 178.473, 178.833, 179.333, 179.453, 180.453, 180.853, 181.353, 181.693, 181.953, 182.773, 183.093, 183.593, 183.733], [185.253, 185.893, 186.173, 186.593, 186.673, 186.853, 186.953, 187.053], [188.073, 188.273, 188.393, 188.653, 189.553, 189.733, 190.093, 190.873, 191.093, 191.273, 191.493, 192.353, 192.533, 192.728, 192.923, 193.118, 193.673, 194.033, 194.313, 194.413, 194.493, 194.673, 194.873, 195.073], [196.013, 196.273, 196.393, 196.513, 196.793, 197.753, 198.033, 198.393, 198.993, 199.233, 199.353], [201.653, 201.826, 202.0], [202.173], [202.693], [203.793, 204.033, 204.493, 204.693, 204.893, 205.253, 205.673, 205.773, 206.293, 206.413], [207.233, 207.493, 207.793, 207.993, 209.053, 209.233, 209.453, 209.573, 209.833, 210.173, 210.793, 211.253, 211.353, 211.513, 211.633, 211.873, 212.713, 212.973, 213.093, 213.333, 213.453], [215.153, 215.326, 215.5], [216.653, 216.813, 217.013, 217.533, 217.653, 217.813, 218.103, 218.173, 218.413, 218.553, 218.833, 219.013, 219.193, 220.073, 220.353, 220.413, 220.893, 220.993, 222.173, 222.313, 222.633], [223.713, 223.886, 224.06], [224.973, 225.233, 225.433, 225.633, 226.093, 226.433, 226.693, 226.973, 227.933, 228.113, 228.273, 228.373, 228.473, 228.853], [229.673, 229.993, 230.313, 230.593, 230.833, 231.093, 231.293, 232.033, 232.473, 232.613, 232.773, 233.113, 233.253, 233.953, 234.153, 234.333, 234.733], [235.793, 236.033, 236.373, 236.783, 236.873, 237.053, 237.353, 237.513, 237.853, 238.173, 239.073, 239.253, 239.573, 240.173], [241.293, 241.533, 241.753, 241.973, 242.173, 242.333, 242.573], [243.393, 243.593, 244.553, 244.673, 245.033, 245.413, 245.653, 245.693, 245.933, 246.273, 246.593, 247.473, 247.653, 248.433, 248.553, 248.713, 249.113], [250.033, 250.273, 250.433], [251.373, 251.733, 252.013, 252.813, 252.993, 253.313, 253.653, 253.873, 254.793, 255.453, 255.593], [256.473, 256.666, 256.86], [258.053, 258.493, 258.713, 258.933], [259.653, 260.013, 260.053, 260.433, 260.853, 261.293], [262.013, 262.213, 262.453, 262.573, 262.793], [263.633, 263.813, 264.253, 264.733, 265.633, 266.113, 266.173, 266.653, 266.793, 267.213, 267.853, 268.153, 268.333, 268.753, 269.093, 269.313, 270.273, 271.253, 272.073, 272.593, 272.793, 273.593, 273.693], [274.633, 275.273, 275.393, 275.733, 276.273, 276.433, 277.153, 277.833, 278.073, 278.533], [279.433, 279.613, 279.753, 280.693, 280.868, 281.043, 281.218, 281.913, 282.073, 282.233, 282.393, 283.053, 283.213, 283.373, 283.533], [284.353, 284.553, 284.733, 284.853, 285.113, 285.593, 285.813, 285.953, 286.513, 287.073, 287.793, 288.713, 289.233, 289.613, 289.733, 290.713, 291.213, 291.453, 292.373, 293.313, 294.073, 294.613, 294.793], [295.953, 296.193], [296.513, 297.053, 297.373, 297.713], [298.813, 299.063, 299.193, 299.453, 299.573, 299.993, 300.153, 300.298, 300.443, 300.588, 300.733, 301.753, 301.913, 302.033], [302.953, 303.053, 303.113, 303.633, 304.433, 304.573], [305.353, 306.133, 306.533, 306.973], [307.733, 307.853], [308.913, 309.073, 309.613, 309.753, 309.933, 310.113, 310.293, 310.473, 310.753, 311.053, 311.173, 311.513, 311.693, 312.493, 312.613, 312.953, 313.133, 313.213, 313.633], [314.153, 314.653, 314.953, 315.113]], "WARP": [[0, 0], [0.3, 0.72], [1.3, 2.06], [1.42, 2.52], [1.98, 3.06], [2.14, 3.18], [2.83, 3.26], [3.42, 4.64], [3.54, 4.82], [3.84, 5.04], [4.16, 5.26], [4.28, 5.34], [5.04, 6.04], [5.14, 6.46], [5.2, 6.52], [5.74, 6.9], [6.38, 7.1], [7.38, 8.46], [7.68, 9.14], [7.86, 9.28], [7.94, 9.36], [8.86, 10.12], [8.995, 10.42], [9.13, 10.66], [9.265, 10.82], [10.08, 12.14], [10.18, 12.52], [10.26, 12.62], [10.38, 12.76], [11.02, 13.4], [11.12, 13.46], [11.5, 13.68], [11.76, 13.88], [11.92, 14.04], [12.08, 14.18], [12.24, 14.26], [12.4, 14.46], [12.56, 14.54], [13.06, 14.74], [13.26, 14.92], [13.38, 15.0], [13.66, 15.28], [13.8, 15.54], [14.5, 16.04], [14.92, 16.46], [15.08, 16.56], [15.16, 16.8], [15.5, 17.1], [16.4, 18.92], [16.58, 19.38], [16.78, 19.5], [17.02, 19.58], [17.86, 21.0], [17.96, 21.2], [18.36, 21.44], [19.51, 21.7], [19.71, 22.5], [20.01, 22.58]]};
export const FPS = 30;
export const TOTAL = Math.round(318.6 * FPS);
const P = (i) => TIMING.P[i][0], E = (i) => TIMING.P[i][1], w = (i, k) => TIMING.WP[i][Math.min(k, TIMING.WP[i].length - 1)];
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const back = (x) => { x = cl(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, t0, t1, e = ss) => e((t - t0) / (t1 - t0));
function keys(t, K, creep = 0.012) {
  let i = 0; while (i < K.length - 1 && t > K[i + 1][0]) i++;
  const A = K[i], B = K[Math.min(i + 1, K.length - 1)];
  const u = B === A ? 0 : (B[5] || ss)((t - A[0]) / (B[0] - A[0]));
  const pos = L3(A[1], B[1], u), look = L3(A[2], B[2], u);
  pos[0] += Math.sin(t * 0.7) * creep; pos[1] += Math.sin(t * 0.93 + 1) * creep * 0.6;
  return { pos, look, fov: lerp(A[3] ?? 40, B[3] ?? 40, u), roll: lerp(A[4] ?? 0, B[4] ?? 0, u) };
}
/** two-key glide over the whole shot */
const glide = (t, t0, t1, p0, l0, p1, l1, f0 = 40, f1 = f0, r0 = 0, r1 = r0, creep = 0.012) => keys(t, [[t0, p0, l0, f0, r0], [t1, p1, l1, f1, r1]], creep);
const blink = (t, seed = 1) => ((t * 1000 + seed * 777) % 3300) < 110;
const warpIntro = (t) => { const A = TIMING.WARP; for (let i = 1; i < A.length; i++) if (t <= A[i][0]) { const [a0, b0] = A[i - 1], [a1, b1] = A[i]; return b0 + (b1 - b0) * (t - a0) / (a1 - a0); } return A[A.length - 1][1]; };

// ---- places ----
const HP = [-0.6, 0.56, -1.3];               // hero sitting in bed
const HFACE = [-0.6, 1.42, -1.3];
const DESKSEAT = [-1.3, 0.45, 0.9];          // hero at the desk chair
const CRT = [-1.798, 0.97, 0.9], CRTCAM = [-1.22, 1.0, 0.9];
const TVS = [1.9, 1.01, -0.036];
const SX = -60, TX0 = 100, BX = 200, OX = 300, LX = 400;
const hero = (opts, extra = {}) => ({ id: "hero", pos: HP, opts: { mode: "sit", seed: 5, ...opts }, ...extra });
const termPOV = (t, t0, t1, push = 0.08) => glide(t, t0, t1, [-0.6, 1.22, -1.18], [-0.6, 0.86, -0.77], [-0.6, 1.22 - push, -1.18 + push * 0.9], [-0.6, 0.86, -0.77], 40, 38, 0, 0, 0.002);
const crtCam = (t, t0, t1) => glide(t, t0, t1, [-1.1, 1.02, 0.92], CRT, [-1.3, 1.0, 0.9], CRT, 30, 28, 0, 0, 0.003);
const say = (t, a, b) => t >= a && t < b;

const S = [];
const shot = (t0, fn) => S.push({ t0, fn });
// ---------------- PART A ----------------
shot(0, (t) => { const tt = warpIntro(t); const sh = sampleShotAt(tt); const st = sh.fn(tt, tt - sh.t0, sh); return { light: "morning", ...st, overlay: null }; });
// 6: "pega o celular"
shot(P(6) - 0.1, (t) => ({ light: "morning", actors: [hero({ expr: "neutral", facing: 1, look: 1, blink: blink(t, 3), prop: t > w(6, 12) - 0.3 ? "phone" : null })],
  cam: glide(t, P(6) - 0.1, P(7), [0.2, 1.35, 0.4], [-0.3, 1.2, -1.4], [0.05, 1.38, 0.0], [-0.35, 1.25, -1.4], 40, 36) }));
// 7: brick phone close-up, snake game
shot(P(7) - 0.1, (t) => ({ light: "morning", brick: [-0.25, 1.3, -0.62], brickRoll: -0.15, snakeT: Math.max(0, t - w(7, 15)),
  cam: glide(t, P(7) - 0.1, P(8), [-0.2, 1.36, -0.25], [-0.25, 1.3, -0.62], [-0.22, 1.33, -0.36], [-0.25, 1.29, -0.62], 30, 28, 0, 0, 0.002) }));
// 8: TV news about the blackout
shot(P(8) - 0.1, (t) => ({ light: "morning", tv: t < w(8, 3) ? "static" : "news", tvOpt: { multa: t > w(8, 20) - 0.2 },
  cam: glide(t, P(8) - 0.1, P(9), [0.7, 1.12, 0.42], TVS, [1.3, 1.06, 0.15], TVS, 38, 32) }));
// 9: battery 100 %
shot(P(9) - 0.1, (t) => t < w(9, 4) - 0.1
  ? { light: "morning", actors: [hero({ expr: "neutral", blink: blink(t, 3) }, { tint: [0.92, 1, 1.05] })], cam: glide(t, P(9) - 0.1, w(9, 4), [-0.2, 1.3, 0.4], [-0.6, 1.1, -1.0], [-0.3, 1.27, 0.1], [-0.6, 1.1, -1.0], 38) }
  : { light: "morning", termMode: "battery", termT: t, termOpt: { pct: 100 }, lap: 4, cam: termPOV(t, w(9, 4) - 0.1, P(10)) });
// 10: no charger on the planet — hero shock + battery icon
shot(P(10) - 0.1, (t) => ({ light: "morning", lap: 4,
  actors: [hero({ expr: t > w(10, 5) ? "shock" : "neutral", blink: t < w(10, 5) && blink(t, 3) }, { tint: [0.92, 1, 1.05] })],
  fx: t > w(10, 8) ? [{ type: "battery", t: 0, o: { pct: 100 }, pos: [0.0, 1.55, -1.25], scale: 0.32 }] : [],
  flash: say(t, w(10, 5), w(10, 5) + 0.12) ? 0.3 : 0,
  cam: glide(t, P(10) - 0.1, P(11), [-0.15, 1.45, 0.55], [-0.35, 1.4, -1.3], [-0.25, 1.45, 0.05], [-0.35, 1.42, -1.3], 40, 36) }));
// 11: every command costs battery
shot(P(11) - 0.1, (t) => { const pct = Math.round(100 - 3 * seg(t, P(11), E(11), (x) => x));
  return { light: "morning", lap: 4, actors: [hero({ expr: "worried", blink: blink(t, 3) }, { tint: [0.92, 1, 1.05] })],
    fx: [{ type: "battery", t: 0, o: { pct }, pos: [0.0, 1.55, -1.25], scale: 0.32 }],
    cam: glide(t, P(11) - 0.1, P(12), [-0.3, 1.45, 0.1], [-0.4, 1.42, -1.3], [-0.42, 1.45, -0.25], [-0.45, 1.43, -1.3], 36, 33) }; });
// 12: deep breath
shot(P(12) - 0.1, (t) => ({ light: "morning", lap: 4, actors: [hero({ expr: "relief", blink: t < E(12) }, { tint: [0.92, 1, 1.05] })],
  cam: glide(t, P(12) - 0.1, P(13), [-0.45, 1.43, -0.4], HFACE, [-0.48, 1.43, -0.55], HFACE, 34, 32) }));
// 13: Orkut / YouTube / Wikipédia / touch phone — on the desk CRT
shot(P(13) - 0.1, (t) => { const k = [w(13, 3), w(13, 6), w(13, 12), 1e9];
  const mode = t < k[0] ? ["404", { url: "www.orkut.com" }] : t < k[1] ? ["404", { url: "www.youtube.com" }] : t < k[2] ? ["wiki", {}] : ["future", {}];
  return { light: "morning", crt: mode[0], crtOpt: mode[1], crtT: t, flash: [k[0], k[1], k[2]].some((x) => say(t, x - 0.05, x + 0.05)) ? 0.15 : 0,
    cam: glide(t, P(13) - 0.1, P(14), [-1.05, 1.03, 0.95], CRT, [-1.25, 1.0, 0.9], CRT, 30, 28, 0, 0, 0.003) }; });
// 14: an intelligence that writes programs by itself
shot(P(14) - 0.1, (t) => t < w(14, 7)
  ? { light: "morning", lap: 4, actors: [hero({ expr: "grin", blink: blink(t, 3) }, { tint: [0.92, 1, 1.05] })], cam: glide(t, P(14) - 0.1, w(14, 7), [0.1, 1.35, 0.5], [-0.6, 1.15, -1.1], [-0.1, 1.33, 0.2], [-0.6, 1.15, -1.1], 40) }
  : { light: "morning", lap: 4, termMode: "code", termT: t - w(14, 7), termOpt: { rate: 7 }, cam: termPOV(t, w(14, 7), P(15)) });
// 15: the "what if" rule: it works offline
shot(P(15) - 0.1, (t) => ({ light: "morning", lap: 4, actors: [hero({ expr: t > w(15, 8) ? "smile" : "neutral", blink: blink(t, 3), look: 0 }, { tint: [0.92, 1, 1.05] })],
  fx: t > w(15, 11) ? [{ type: "nowifi", t: 0, pos: [-1.15, 1.5, -1.25], scale: 0.3 }] : [],
  cam: (() => { const a = lerp(-0.5, 0.45, seg(t, P(15) - 0.1, P(16), (x) => x)); return { pos: [-0.6 + Math.sin(a) * 1.8, 1.45, -1.3 + Math.cos(a) * 1.8], look: [-0.6, 1.25, -1.3], fov: 38 }; })() }));
// 16-17: "Agora sim. Primeiro comando." / typing "Cria um site pra mim."
shot(P(16) - 0.1, (t) => ({ light: "morning", lap: 4, termMode: "prompt", termT: t, cam: termPOV(t, P(16) - 0.1, P(17), 0.06) }));
shot(P(17), (t) => ({ light: "morning", lap: 4, termMode: "type", termT: Math.max(0, t - w(17, 2)), termOpt: { text: "Cria um site pra mim.", rate: 14 }, cam: termPOV(t, P(17), P(18), 0.1) }));
// 18: in 2001 a site took weeks: team, meetings, coffee
shot(P(18) - 0.1, (t) => { const mugs = 3 + Math.floor(9 * seg(t, w(18, 15), E(18), (x) => x));
  return { light: "indoor", mugs, actors: [
    { id: "prog1", pos: [OX - 2.55, 0, -0.05], opts: { expr: t > w(18, 15) ? "dazed" : "stern", seed: 11, blink: blink(t, 5) } },
    { id: "prog2", pos: [OX - 1.45, 0, -0.05], opts: { expr: t > w(18, 15) ? "nervous" : "neutral", seed: 12, blink: blink(t, 6) } },
    { id: "prog3", pos: [OX - 2.0, 0, -0.35], opts: { expr: t > w(18, 12) ? "pained" : "neutral", seed: 13, blink: blink(t, 7) } }],
    fx: t > w(18, 5) && t < w(18, 12) ? [{ type: "question", t, pos: [OX - 2.0, 1.85, -0.3], scale: 0.32 }] : [],
    cam: glide(t, P(18) - 0.1, P(19), [OX - 2.0, 1.7, 3.2], [OX - 2.0, 1.0, 0.2], [OX - 2.0, 1.45, 2.2], [OX - 2.0, 0.95, 0.3], 40, 38) }; });
// 19: Claude Code does it in two minutes
shot(P(19) - 0.1, (t) => ({ light: "morning", lap: 4, termMode: "code", termT: t - P(19) + 0.2, termOpt: { rate: 6, done: 1.6 }, cam: termPOV(t, P(19) - 0.1, P(20), 0.12) }));
// 20: menu, photos, contact form — on the CRT
shot(P(20) - 0.1, (t) => ({ light: "morning", crt: "site", crtT: t, crtOpt: { menu: w(20, 0) - 0.1, fotos: w(20, 1) - 0.1, form: w(20, 2) - 0.1, ok: w(20, 5) - 0.2 }, cam: crtCam(t, P(20) - 0.1, P(21)) }));
// 21: smile, now upload it
shot(P(21) - 0.1, (t) => ({ light: "morning", lap: 3, actors: [hero({ expr: "grin", blink: blink(t, 3) }, { tint: [0.92, 1, 1.05] })],
  cam: glide(t, P(21) - 0.1, P(22), [-0.3, 1.42, 0.1], HFACE, [-0.42, 1.42, -0.3], HFACE, 36, 33) }));
// 22: the modem
shot(P(22) - 0.1, (t) => ({ light: "morning", modem: true, fx: t > w(22, 3) ? [{ type: "horn", t: ((t - w(22, 3)) % 0.6) / 0.6, pos: [-1.72, 0.74, 0.63], scale: 0.22 }] : [],
  cam: glide(t, P(22) - 0.1, P(23), [-1.25, 1.0, 0.55], [-1.79, 0.79, 0.63], [-1.42, 0.92, 0.6], [-1.79, 0.79, 0.63], 38, 34, 0, 0, 0.003) }));
// 23: three hours later, 40 %
shot(P(23) - 0.1, (t) => ({ light: "morning", crt: "upload", crtT: t, crtOpt: { pct: lerp(36, 40, seg(t, P(23), E(23))) }, cam: crtCam(t, P(23) - 0.1, P(24)) }));
// 24: mom picks up the phone
shot(P(24), (t) => ({ light: "indoor", actors: [{ id: "mom", pos: [SX + 0.55, 0, -1.15], opts: { expr: t > w(24, 5) ? "grin" : "smile", seed: 21, prop: t > w(24, 3) ? "phone" : null, blink: blink(t, 8) } }],
  cam: glide(t, P(24), P(25), [SX - 0.6, 1.5, 1.6], [SX + 0.6, 1.3, -1.3], [SX - 0.2, 1.48, 1.0], [SX + 0.65, 1.32, -1.3], 40, 36) }));
// 25: connection drops
shot(P(25) - 0.1, (t) => ({ light: "morning", crt: "lost", crtT: t, flash: say(t, P(25), P(25) + 0.1) ? 0.25 : 0, cam: crtCam(t, P(25) - 0.1, P(26)) }));
// 26: first lesson of 2001: wait for midnight
shot(P(26) - 0.1, (t) => { const mid = w(26, 30); const late = t > w(26, 8);
  if (t < w(26, 18)) return { light: late ? "night" : "morning", crt: "lost", lap: 0, laptop: false,
    actors: [{ id: "hero", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: late ? "dazed" : "worried", blink: blink(t, 3) }, tint: late ? [0.62, 0.72, 0.98] : undefined }],
    dark: say(t, w(26, 8) - 0.15, w(26, 8) + 0.1) ? 0.9 : 0,
    cam: glide(t, P(26) - 0.1, w(26, 18), [-0.2, 1.35, 2.1], [-1.4, 1.0, 0.8], [-0.4, 1.32, 1.7], [-1.4, 1.0, 0.8], 40, 37) };
  return { light: "night", laptop: false, clock: t < mid ? "23:59" : "00:00", modem: t > mid,
    fx: t > mid && t < mid + 0.6 ? [{ type: "beep", t: (t - mid) / 0.6, pos: [0.56, 0.56, -1.82], scale: 0.18 }] : [],
    cam: glide(t, w(26, 18), P(27), [0.47, 0.8, -1.38], [0.56, 0.62, -1.88], [0.52, 0.72, -1.55], [0.56, 0.62, -1.88], 36, 32, 0, 0, 0.004) }; });
// 27: next morning, the bakery on the corner (street)
shot(P(27) - 0.1, (t) => { const u = seg(t, P(27), E(27) + 0.3, (x) => x), x = lerp(TX0 - 6, TX0 - 2.6, u);
  return { light: "street", actors: [{ id: "hero", pos: [x, 0, -3.6], opts: { mode: "stroll", phase: u * 5, seed: 5, expr: "smile", facing: 1, blink: blink(t, 3) } }],
    cam: glide(t, P(27) - 0.1, P(28), [TX0 - 5.5, 1.7, 2.5], [TX0 - 4.5, 1.6, -4.5], [TX0 - 1.5, 1.8, 2.8], [TX0 - 1.4, 2.0, -5.5], 42, 40) }; });
// 28: the owner writes everything in a notebook
shot(P(28) - 0.1, (t) => t < w(28, 6)
  ? { light: "indoor", actors: [{ id: "baker", pos: [BX + 0.1, 0, -1.4], opts: { expr: "neutral", seed: 31, blink: blink(t, 9), look: 1 } }],
      cam: glide(t, P(28) - 0.1, w(28, 6), [BX - 0.6, 1.55, 2.4], [BX + 0.1, 1.35, -1.4], [BX - 0.3, 1.55, 1.6], [BX + 0.1, 1.38, -1.4], 40, 36) }
  : { light: "indoor", paper: { mode: "fiado", pos: [BX + 0.55, 1.08, -0.5], rot: [-Math.PI / 2, 0, 0.12] },
      cam: glide(t, w(28, 6), P(29), [BX + 0.55, 1.62, -0.1], [BX + 0.55, 1.08, -0.52], [BX + 0.55, 1.5, -0.2], [BX + 0.55, 1.08, -0.52], 38, 34, 0, 0, 0.003) });
// 29: you offer a program; he laughs; "isso demora meses, garoto"
shot(P(29) - 0.1, (t) => { const laugh = t > w(29, 4) - 0.1 && t < w(29, 6);
  return { light: "indoor", actors: [
    { id: "baker", pos: [BX + 0.1, 0, -1.4], opts: { expr: laugh ? "laugh" : t > w(29, 6) ? "smile" : "neutral", seed: 31, headTilt: laugh ? 6 * Math.sin(t * 18) : 0, blink: blink(t, 9) } },
    { id: "hero", pos: [BX - 1.25, 0, 0.55], opts: { back: true, seed: 5 } }],
    fx: laugh ? [{ type: "laugh", t, pos: [BX + 0.75, 1.5, -1.3], scale: 0.32 }] : [],
    cam: glide(t, P(29) - 0.1, P(30), [BX - 1.2, 1.6, 2.2], [BX, 1.35, -1.0], [BX - 0.9, 1.58, 1.8], [BX + 0.05, 1.38, -1.1], 40, 37) }; });
// 30: next day with the program ready (bakery PC)
shot(P(30) - 0.1, (t) => ({ light: "indoor", bakpc: t > w(30, 4),
  cam: glide(t, P(30) - 0.1, P(31) - 0.05, [BX + 0.55, 1.45, 0.35], [BX + 1.14, 1.24, -0.67], [BX + 0.85, 1.33, -0.1], [BX + 1.14, 1.24, -0.67], 36, 32, 0, 0, 0.003) }));
// 31: he stops laughing
shot(P(31) - 0.05, (t) => ({ light: "indoor", bakpc: true, actors: [{ id: "baker", pos: [BX + 0.1, 0, -1.4], opts: { expr: "shock", seed: 31 } }],
  cam: glide(t, P(31) - 0.05, P(32), [BX - 0.15, 1.52, 0.4], [BX + 0.1, 1.45, -1.4], [BX - 0.05, 1.5, 0.0], [BX + 0.1, 1.46, -1.4], 34, 30, 0, -2) }));
// 32: then the lan house, the 1,99 store, the driving school (street dolly)
shot(P(32) - 0.1, (t) => { const k = [P(32), w(32, 5), w(32, 9), w(32, 15), E(32) + 0.4]; let i = 0; while (i < 3 && t > k[i + 1] - 0.4) i++;
  const xa = TX0 + i * 10, xb = TX0 + Math.min(3, i + 1) * 10, u = seg(t, k[i + 1] - 0.4, k[i + 1] + 0.1); const x = i < 3 ? lerp(xa, xb, u) : xa;
  return { light: "street", actors: [{ id: "hero", pos: [x - 1.2, 0, -3.4], opts: { mode: u > 0 && u < 1 ? "stroll" : "stand", phase: t * 2, seed: 5, expr: "grin", blink: blink(t, 3), prop: "bag" } }],
    cam: { pos: [x + 0.8, 1.9, 3.2], look: [x, 2.2, -5.5], fov: 44 } }; });
// 33: fastest programmer in Brazil — newspaper on the bakery counter
shot(P(33) - 0.1, (t) => ({ light: "indoor", paper: { mode: "jornal", pos: [BX + 0.55, 1.08, -0.45], rot: [-Math.PI / 2, 0, -0.05] },
  fx: t > w(33, 5) ? [{ type: "stars", t, pos: [BX + 1.05, 1.1, -0.45], scale: 0.2 }] : [],
  cam: glide(t, P(33) - 0.1, P(34), [BX + 0.55, 1.85, 0.0], [BX + 0.55, 1.08, -0.47], [BX + 0.55, 1.62, -0.15], [BX + 0.55, 1.08, -0.47], 38, 34, 0, 0, 0.002) }));
// 34: dot-com crash on the CRT
shot(P(34) - 0.1, (t) => ({ light: "morning", crt: "news2001", crtT: t - P(34), cam: crtCam(t, P(34) - 0.1, P(35)) }));
// 35: but your programs work and make profit
shot(P(35) - 0.1, (t) => t < w(35, 5)
  ? { light: "morning", crt: "profit", crtT: t - P(35), cam: crtCam(t, P(35) - 0.1, w(35, 5)) }
  : { light: "morning", lap: 3, actors: [hero({ expr: "grin", blink: blink(t, 3) })], fx: [{ type: "coins", t, pos: [-0.6, 1.0, -1.5], scale: 0.5 }],
      cam: glide(t, w(35, 5), P(36), [-0.3, 1.45, 0.3], [-0.6, 1.35, -1.3], [-0.4, 1.45, 0.0], [-0.6, 1.38, -1.3], 38, 35) });
// 36: investor in a suit, air-conditioned room
shot(P(36) - 0.1, (t) => { const ac = t > w(36, 9) - 0.2;
  return { light: "indoor", actors: [
    { id: "investor", pos: [OX + 0.6, 0, -1.55], opts: { expr: "smile", seed: 41, blink: blink(t, 10) } },
    { id: "hero", pos: [OX - 1.15, 0, 0.9], opts: { back: true, seed: 5 } }],
    fx: ac ? [{ type: "wind", t, pos: [OX + 2.4, 1.55, -2.2], scale: 0.4 }] : [],
    cam: ac ? glide(t, w(36, 9) - 0.2, P(37), [OX + 1.6, 1.9, -0.6], [OX + 2.4, 2.1, -2.4], [OX + 1.8, 1.95, -1.1], [OX + 2.4, 2.15, -2.4], 40, 36)
      : glide(t, P(36) - 0.1, w(36, 9) - 0.2, [OX - 0.9, 1.65, 2.6], [OX + 0.6, 1.3, -1.2], [OX - 0.5, 1.6, 2.0], [OX + 0.6, 1.3, -1.3], 40, 38) }; });
// 37: "Qual é o tamanho da sua equipe?"
shot(P(37) - 0.1, (t) => ({ light: "indoor", actors: [{ id: "investor", pos: [OX + 0.6, 0, -1.55], opts: { expr: t > w(37, 2) ? "stern" : "smile", seed: 41, look: -1, blink: blink(t, 10), headTilt: 4 } }],
  cam: glide(t, P(37) - 0.1, P(38), [OX + 0.4, 1.5, 0.4], [OX + 0.6, 1.45, -1.55], [OX + 0.45, 1.5, 0.0], [OX + 0.6, 1.46, -1.55], 36, 33) }));
// 38: you look at the backpack with the laptop
shot(P(38) - 0.1, (t) => ({ light: "indoor", actors: [{ id: "hero", pos: [OX + 0.45, 0, 0.6], opts: { expr: "smile", seed: 5, look: 1, facing: 1, blink: blink(t, 3) } }],
  cam: t < w(38, 4) ? glide(t, P(38) - 0.1, w(38, 4), [OX + 0.1, 1.5, 2.2], [OX + 0.45, 1.4, 0.6], [OX + 0.2, 1.48, 1.9], [OX + 0.5, 1.4, 0.6], 40, 38)
    : glide(t, w(38, 4), P(39) - 0.2, [OX + 1.2, 0.85, 1.4], [OX + 1.05, 0.45, 0.6], [OX + 1.15, 0.75, 1.15], [OX + 1.05, 0.45, 0.6], 38, 34) }));
// 39: "Somos... dois."
shot(P(39) - 0.2, (t) => ({ light: "indoor", actors: [{ id: "hero", pos: [OX + 0.45, 0, 0.6], opts: { expr: t > w(39, 1) - 0.1 ? "grin" : "smile", seed: 5, blink: false, headTilt: t > w(39, 1) ? 5 : 0 } }],
  cam: glide(t, P(39) - 0.2, 173.6, [OX + 0.6, 1.5, 2.1], [OX + 0.45, 1.45, 0.6], [OX + 0.55, 1.48, 1.6], [OX + 0.45, 1.46, 0.6], 36, 33) }));
// ---------------- PART B ----------------
const PROGS = (t, e1 = "stern", e2 = "stern", e3 = "stern") => [
  { id: "prog1", pos: [LX - 0.9, 0, 0.3], opts: { expr: e1, seed: 11, look: 1, facing: 1, blink: blink(t, 5) } },
  { id: "prog2", pos: [LX - 0.1, 0, 0.55], opts: { expr: e2, seed: 12, look: 1, facing: 1, blink: blink(t, 6) } },
  { id: "prog3", pos: [LX + 0.6, 0, 0.2], opts: { expr: e3, seed: 13, look: 1, facing: 1, blink: blink(t, 7) } }];
// 40: success draws attention (lan house)
shot(173.6, (t) => ({ light: "lan", lanMode: "game", actors: [...PROGS(t, "neutral", "smile", "neutral"), { id: "hero", pos: [LX + 2.3, 0.0, -0.9], opts: { mode: "sit", seed: 5, expr: "grin", blink: blink(t, 3) } }],
  cam: glide(t, 173.6, P(41), [LX - 2.4, 1.7, 3.4], [LX + 0.6, 1.1, -0.5], [LX - 1.6, 1.65, 2.8], [LX + 0.8, 1.1, -0.6], 42, 40) }));
// 41: the other programmers get suspicious (close-ups)
shot(P(41) - 0.1, (t) => { const k = [P(41), w(41, 6), w(41, 11)]; const i = t < k[1] ? 0 : t < k[2] ? 1 : 2; const ids = ["prog1", "prog2", "prog3"], xs = [LX - 0.9, LX - 0.1, LX + 0.6], zs = [0.3, 0.55, 0.2];
  return { light: "lan", actors: PROGS(t, i === 0 ? "stern" : "neutral", i === 1 ? "stern" : "neutral", i === 2 ? "stern" : "neutral"),
    fx: [{ type: "question", t, pos: [xs[i] + 0.35, 1.75, zs[i]], scale: 0.22 }],
    cam: glide(t, k[i] - 0.1, (k[i + 1] ?? P(42)), [xs[i] - 0.25, 1.5, zs[i] + 1.3], [xs[i], 1.45, zs[i]], [xs[i] - 0.15, 1.5, zs[i] + 1.0], [xs[i], 1.46, zs[i]], 36, 33) }; });
// 42: one of them asks to see your computer
shot(P(42) - 0.1, (t) => { const u = seg(t, P(42), E(42)), x = lerp(LX - 0.1, LX + 1.6, u);
  return { light: "lan", actors: [{ id: "prog2", pos: [x, 0, lerp(0.55, -0.3, u)], opts: { mode: u < 1 ? "stroll" : "stand", phase: u * 3, seed: 12, expr: "stern", wave: t > w(42, 4) ? 0.2 : undefined } },
    { id: "hero", pos: [LX + 2.3, 0.0, -0.9], opts: { mode: "sit", seed: 5, expr: t > w(42, 4) ? "nervous" : "neutral", blink: blink(t, 3), prop: "bag" } }],
    cam: glide(t, P(42) - 0.1, P(43), [LX + 0.2, 1.6, 2.6], [LX + 1.6, 1.0, -0.6], [LX + 0.6, 1.55, 2.2], [LX + 1.9, 1.0, -0.7], 42, 38) }; });
// 43: you can't show it — thin laptop vs the fat CRT
shot(P(43) - 0.1, (t) => t < w(43, 3)
  ? { light: "lan", actors: [{ id: "hero", pos: [LX + 2.3, 0.0, -0.9], opts: { mode: "sit", seed: 5, expr: "nervous", prop: "bag", blink: blink(t, 3) } }], cam: glide(t, P(43) - 0.1, w(43, 3), [LX + 2.15, 1.25, 0.5], [LX + 2.3, 1.05, -0.9], [LX + 2.2, 1.22, 0.25], [LX + 2.3, 1.05, -0.9], 36) }
  : { light: "morning", laptopPos: [-1.6, 0.77, 0.6], crt: "off", lap: 3, fx: t > w(43, 14) ? [{ type: "question", t, pos: [-1.65, 1.35, 0.55], scale: 0.2 }] : [],
      cam: glide(t, w(43, 3), P(44), [-0.6, 1.25, 1.5], [-1.75, 0.95, 0.75], [-0.9, 1.15, 1.25], [-1.75, 0.93, 0.75], 38, 34) });
// 44: a bigger problem; every night you check the battery (night bedroom)
shot(P(44) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: "worried", blink: blink(t, 3) }, { tint: [0.6, 0.85, 1.1] })],
  cam: glide(t, P(44) - 0.1, 201.4, [0.0, 1.4, 0.6], [-0.6, 1.2, -1.2], [-0.25, 1.4, 0.1], [-0.6, 1.25, -1.2], 40, 36) }));
// 45-47: 80 / 60 / 40
shot(201.4, (t) => { const pct = t < P(46) ? 80 : t < P(47) ? 60 : 40;
  return { light: "night", lap: 7, termMode: "battery", termT: t, termOpt: { pct }, flash: [P(46), P(47)].some((x) => say(t, x, x + 0.06)) ? 0.12 : 0, cam: termPOV(t, 201.4, P(48), 0.12) }; });
// 48: each program costs a piece of the future
shot(P(48) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: "worried", blink: blink(t, 3) }, { tint: [0.6, 0.85, 1.1] })],
  fx: [{ type: "battery", t: 0, o: { pct: Math.round(lerp(40, 35, seg(t, P(48), E(48)))) }, pos: [0.0, 1.5, -1.25], scale: 0.3 }],
  cam: glide(t, P(48) - 0.1, P(49), [-0.2, 1.45, 0.3], [-0.4, 1.4, -1.3], [-0.35, 1.45, -0.15], [-0.45, 1.42, -1.3], 38, 34) }));
// 49: saving: only at dawn, lights off, like a secret
shot(P(49) - 0.1, (t) => ({ light: "night", lap: 8, sun: 0, actors: [hero({ expr: "neutral", look: 0, blink: blink(t, 3) }, { tint: [0.45, 0.7, 1.05] })],
  vig: 0.75, clock: "03:12",
  cam: glide(t, P(49) - 0.1, P(50), [1.5, 1.9, 1.6], [-0.6, 1.0, -1.2], [1.0, 1.7, 0.8], [-0.6, 1.05, -1.2], 44, 40) }));
// 50: 20 %
shot(P(50) - 0.15, (t) => ({ light: "night", lap: 7, termMode: "battery", termT: t, termOpt: { pct: 20 }, cam: termPOV(t, P(50) - 0.15, P(51), 0.05) }));
// 51: you can't change the world with one battery: one last wish
shot(P(51) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: t > w(51, 13) ? "neutral" : "worried", blink: blink(t, 3), look: 0 }, { tint: [0.55, 0.8, 1.1] })],
  cam: (() => { const a = lerp(0.5, -0.35, seg(t, P(51) - 0.1, P(52), (x) => x)); return { pos: [-0.6 + Math.sin(a) * 1.4, 1.45, -1.3 + Math.cos(a) * 1.4], look: [-0.6, 1.32, -1.3], fov: 36 }; })() }));
// 52: 3 %
shot(P(52) - 0.15, (t) => ({ light: "night", lap: 7, termMode: "battery", termT: t, termOpt: { pct: 3 }, cam: termPOV(t, P(52) - 0.15, P(53), 0.05) }));
// 53: the blinking line: next command?
shot(P(53) - 0.1, (t) => ({ light: "night", lap: 7, termMode: "prompt", termT: t, termOpt: { pct: 3, q: t > w(53, 6) - 0.2 ? "Qual é o seu próximo comando?" : "" }, cam: termPOV(t, P(53) - 0.1, P(54), 0.1) }));
// 54: lottery numbers... crossed out
shot(P(54) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: t > w(54, 6) ? "neutral" : "grin", look: 1, facing: 1, blink: blink(t, 3) }, { tint: [0.55, 0.8, 1.1] })],
  fx: [{ type: "lottery", t: t - P(54), o: { cross: t > w(54, 6) }, pos: [0.15, 1.35, -1.25], scale: 0.42 }],
  cam: glide(t, P(54) - 0.1, P(55), [-0.15, 1.45, 0.75], [-0.25, 1.4, -1.3], [-0.2, 1.45, 0.45], [-0.25, 1.42, -1.3], 40, 37) }));
// 55: the next social network, the next billion-dollar app
shot(P(55) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: "smile", look: -1, facing: -1, blink: blink(t, 3) }, { tint: [0.55, 0.8, 1.1] })],
  fx: [{ type: "apps", t: t - P(55), o: { cross: t > E(55) - 0.4 }, pos: [-1.35, 1.35, -1.25], scale: 0.42 }],
  cam: glide(t, P(55) - 0.1, P(56), [-1.0, 1.45, 0.75], [-0.95, 1.4, -1.3], [-0.95, 1.45, 0.45], [-0.95, 1.42, -1.3], 40, 37) }));
// 56: a better idea
shot(P(56) - 0.1, (t) => ({ light: "night", lap: 7, actors: [hero({ expr: t > w(56, 3) ? "grin" : "neutral", blink: blink(t, 3) }, { tint: [0.55, 0.8, 1.1] })],
  fx: t > w(56, 3) - 0.1 ? [{ type: "idea", t, pos: [-0.25, 1.48, -1.32], scale: 0.2 }] : [],
  flash: say(t, w(56, 3), w(56, 3) + 0.1) ? 0.2 : 0,
  cam: glide(t, P(56) - 0.1, P(57), [-0.5, 1.55, -0.1], [-0.6, 1.55, -1.3], [-0.55, 1.55, -0.35], [-0.6, 1.58, -1.3], 36, 33) }));
// 57: typing "Me ensina tudo..."
shot(P(57) - 0.1, (t) => ({ light: "night", lap: 7, termMode: "type", termT: Math.max(0, t - w(57, 2)), termOpt: { pct: 3, text: "Me ensina tudo o que você sabe sobre programar. Do começo. Do jeito mais simples.", rate: 15 }, cam: termPOV(t, P(57) - 0.1, P(58), 0.1) }));
// 58: and it teaches
shot(P(58) - 0.1, (t) => ({ light: "night", lap: 7, termMode: "code", termT: t - P(58) + 0.3, termOpt: { pct: 2, lessons: true, rate: 9 }, cam: termPOV(t, P(58) - 0.1, P(59), 0.12) }));
// 59: page by page, onto CDs
shot(P(59) - 0.1, (t) => ({ light: "night", lap: 7, cds: Math.floor(lerp(1, 24, seg(t, P(59), E(59) + 0.3, (x) => x))),
  actors: [hero({ expr: "stern", blink: blink(t, 3) }, { tint: [0.55, 0.8, 1.1] })],
  cam: glide(t, P(59) - 0.1, P(60), [0.35, 1.25, 0.2], [-0.25, 0.9, -1.0], [0.2, 1.15, -0.15], [-0.2, 0.95, -1.0], 40, 36) }));
// 60: 1 %
shot(P(60) - 0.15, (t) => ({ light: "night", lap: 6, termMode: "battery", termT: t, termOpt: { pct: 1 }, cam: termPOV(t, P(60) - 0.15, P(61), 0.05) }));
// 61: the screen goes black
shot(P(61) - 0.3, (t) => ({ light: "night", lap: lerp(6, 0, seg(t, P(61), E(61))), termMode: "battery", termT: t, termOpt: { pct: 1, fade: seg(t, P(61), E(61), (x) => x) }, cam: termPOV(t, P(61) - 0.3, P(62), 0.04) }));
// 62: the laptop never turns on again
shot(P(62) - 0.1, (t) => ({ light: "night", lap: 0, termMode: "black", cds: 24, actors: [hero({ expr: "pained", blink: blink(t, 3), headTilt: -4 }, { tint: [0.4, 0.5, 0.85] })],
  vig: 0.8, cam: glide(t, P(62) - 0.1, P(63), [0.4, 1.6, 1.2], [-0.6, 1.15, -1.2], [0.25, 1.62, 0.85], [-0.6, 1.15, -1.2], 40, 38) }));
// 63: but you don't stand still
shot(P(63) - 0.1, (t) => ({ light: "morning", lap: 0, termMode: "black", cds: 24, actors: [hero({ expr: "stern", blink: blink(t, 3) })],
  flash: say(t, P(63) - 0.1, P(63)) ? 0.4 : 0,
  cam: glide(t, P(63) - 0.1, P(64), [-0.45, 1.43, -0.5], HFACE, [-0.5, 1.43, -0.65], HFACE, 34, 31) }));
// 64: study each CD, learn for real, publish everything for free
shot(P(64) - 0.1, (t) => { const k1 = w(64, 8), k2 = w(64, 13);
  if (t < k1) return { light: "morning", laptop: false, crt: "tutorial", crtOpt: { part: 1 }, actors: [{ id: "hero", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: "stern", blink: blink(t, 3) } }],
    cam: glide(t, P(64) - 0.1, k1, [-0.2, 1.35, 2.1], [-1.4, 1.0, 0.8], [-0.35, 1.33, 1.75], [-1.45, 1.0, 0.8], 40, 37) };
  if (t < k2) return { light: "morning", laptop: false, crt: "tutorial", crtOpt: { part: 2 }, cam: crtCam(t, k1, k2) };
  return { light: "morning", laptop: false, crt: "forum", crtT: t - k2, crtOpt: { part: 3 }, cam: crtCam(t, k2, P(65)) }; });
// 65: thousands learn; then they teach others (lan house with kids)
shot(P(65) - 0.1, (t) => ({ light: "lan", lanMode: "tutorial", actors: [
  { id: "kid1", pos: [LX - 3.0, 0.0, -1.05], opts: { mode: "sit", seed: 51, expr: "grin", blink: blink(t, 11) } },
  { id: "kid2", pos: [LX - 1.75, 0.0, -1.05], opts: { mode: "sit", seed: 52, expr: "smile", blink: blink(t, 12) } },
  { id: "kid3", pos: [LX - 0.5, 0.0, -1.05], opts: { mode: "sit", seed: 53, expr: "grin", blink: blink(t, 13) } },
  { id: "prog3", key: "teacher", pos: [LX + 1.0, 0, -0.6], opts: { seed: 13, expr: "smile", wave: t > w(65, 5) ? 0.5 + 0.5 * Math.sin(t * 6) : undefined, blink: blink(t, 7) } }],
  cam: glide(t, P(65) - 0.1, P(66), [LX - 3.6, 1.45, 1.4], [LX - 2.4, 1.0, -1.3], [LX + 0.0, 1.5, 1.6], [LX + 0.6, 1.0, -1.1], 42, 40) }));
// 66: years go by: 2005, 2010, 2020 (calendar)
shot(P(66) - 0.1, (t) => { const yrs = [[w(66, 3), 2005], [w(66, 6), 2010], [w(66, 9), 2020]]; let y = 2001; for (const [k, v] of yrs) if (t > k - 0.1) y = v;
  return { light: "morning", year: y, month: "JANEIRO", flash: yrs.some(([k]) => say(t, k - 0.1, k - 0.02)) ? 0.25 : 0,
    cam: glide(t, P(66) - 0.1, P(67), [0.95, 1.62, -1.25], [0.95, 1.6, -2.2], [0.95, 1.61, -1.5], [0.95, 1.6, -2.2], 34, 30, 0, 0, 0.003) }; });
// 67: one day, a news story (smartphone, 2026)
shot(P(67) - 0.1, (t) => t < w(67, 7)
  ? { light: "morning", year: 2026, month: "JANEIRO", laptop: false, actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: "neutral", prop: "phone", blink: blink(t, 3) } }],
      cam: glide(t, P(67) - 0.1, w(67, 7), [-0.2, 1.35, 2.1], [-1.35, 1.1, 0.85], [-0.4, 1.33, 1.8], [-1.35, 1.1, 0.85], 40, 38) }
  : { light: "morning", year: 2026, smart: [-0.3, 1.2, 1.55], smartRoll: 0.05,
      cam: glide(t, w(67, 7), P(68), [-0.05, 1.3, 1.95], [-0.3, 1.2, 1.55], [-0.14, 1.25, 1.78], [-0.3, 1.2, 1.55], 30, 24, 0, 0, 0.002) });
// 68-69: you stop... and think of that laptop (dusty on the shelf with CDs)
shot(P(68) - 0.1, (t) => t < P(69)
  ? { light: "morning", year: 2026, laptop: false, actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: "shock", prop: "phone" } }],
      cam: glide(t, P(68) - 0.1, P(69), [-0.75, 1.42, 1.9], [-1.3, 1.35, 0.9], [-0.85, 1.42, 1.65], [-1.3, 1.36, 0.9], 36, 33) }
  : { light: "morning", year: 2026, termMode: "black", lap: 0, cds: 24,
      cam: glide(t, P(69), P(70), [-0.15, 1.25, -0.2], [-0.45, 0.85, -0.9], [-0.25, 1.1, -0.45], [-0.45, 0.85, -0.9], 38, 34) });
// 70-71: the Claude who taught you learned from the internet... and the internet learned from you
shot(P(70) - 0.1, (t) => ({ light: "morning", year: 2026, termMode: "black", lap: 0, cds: 24,
  fx: [{ type: "loop", t: t - P(70), pos: [-0.5, 0.6, -0.95], scale: 0.5 }],
  cam: glide(t, P(70) - 0.1, P(71), [-0.25, 1.1, -0.45], [-0.45, 0.85, -0.9], [-0.1, 1.35, 0.25], [-0.5, 0.95, -0.9], 34, 40) }));
shot(P(71) - 0.1, (t) => ({ light: "morning", year: 2026, laptop: false, actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: t > w(71, 3) ? "smile" : "neutral", blink: blink(t, 3) } }],
  cam: glide(t, P(71) - 0.1, P(72), [-0.4, 1.4, 2.0], [-1.3, 1.3, 0.9], [-0.7, 1.4, 1.7], [-1.3, 1.32, 0.9], 38, 34) }));
// 72: so... who taught whom?
shot(P(72) - 0.1, (t) => ({ light: "morning", year: 2026, laptop: false, actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: "dazed", blink: false } }],
  vig: 0.7, cam: glide(t, P(72) - 0.1, P(73), [-0.85, 1.4, 1.75], [-1.3, 1.36, 0.9], [-1.05, 1.38, 1.35], [-1.3, 1.37, 0.9], 34, 28, 0, -5, 0.004) }));
// 73-75: "E você?" — talks to the camera; final question + comments
shot(P(73) - 0.1, (t) => ({ light: "morning", year: 2026, laptop: false, actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: t > P(74) ? "grin" : "smile", look: 0, blink: blink(t, 3), wave: t > P(75) ? 0.5 + 0.5 * Math.sin(t * 6) : undefined } }],
  cam: glide(t, P(73) - 0.1, E(75) + 0.4, [-1.0, 1.36, 1.55], [-1.3, 1.3, 0.9], [-0.95, 1.34, 2.1], [-1.3, 1.25, 0.9], 34, 38) }));
// end card
shot(E(75) + 0.4, (t) => ({ light: "morning", year: 2026, laptop: false, dark: 0.55 * seg(t, E(75) + 0.4, E(75) + 0.9),
  actors: [{ id: "hero", o: "hero2", pos: DESKSEAT, opts: { mode: "sit", seed: 5, expr: "grin", blink: blink(t, 3) } }],
  cam: glide(t, E(75) + 0.4, 318.6, [-0.95, 1.34, 2.1], [-1.3, 1.25, 0.9], [-0.9, 1.34, 2.3], [-1.3, 1.25, 0.9], 38, 39),
  overlay: (g, W, H) => endCard(g, W, H, t) }));

// THUMBNAIL (outside the video timeline): t >= 2000
shot(2000, (t) => { const v = (globalThis.THUMBV ?? 0);
  const cams = [
    { pos: [0.35, 1.42, 0.55], look: [0.05, 1.38, -1.3], fov: 42 },
    { pos: [0.05, 1.4, 0.2], look: [0.2, 1.42, -1.3], fov: 46 },
    { pos: [-0.05, 1.32, -0.15], look: [0.1, 1.45, -1.6], fov: 50 },
    { pos: [0.0, 1.38, 0.15], look: [0.05, 1.36, -1.3], fov: 48 },
    { pos: [0.1, 1.36, 0.35], look: [0.15, 1.33, -1.3], fov: 46 } ];
  return { light: "morning", lap: 6, year: 2001,
    actors: [hero({ expr: "shock", blink: false }, { tint: [0.95, 1, 1.06] })],
    cam: cams[v] }; });
S.sort((a, b) => a.t0 - b.t0);
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : 1e9;
export const SHOTS = S;
export const shotAt = (t) => { let s = S[0]; for (const x of S) if (t >= x.t0) s = x; return s; };
function endCard(g, W, H, t) {
  const k = H / 1080, t0 = E(75) + 0.5, sc = (a) => (t < a ? 0 : back(cl((t - a) / 0.35)));
  g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const txt = (s, size, y, fill) => { g.font = `900 ${size}px "DejaVu Sans", Arial, sans-serif`; g.lineWidth = size * 0.18; g.strokeStyle = "#140c16"; g.strokeText(s, 0, y); g.fillStyle = fill; g.fillText(s, 0, y); };
  const a = sc(t0), b = sc(t0 + 0.4), c = sc(t0 + 1.0);
  if (a > 0) { g.save(); g.translate(W / 2, H * 0.32); g.scale(a * k, a * k); txt("E SE VOCÊ ACORDASSE", 96, 0, "#ffffff"); g.restore(); }
  if (b > 0) { g.save(); g.translate(W / 2, H * 0.49); g.scale(b * k, b * k); txt("EM 2001?", 190, 0, "#ffd23f"); g.restore(); }
  if (c > 0) { g.save(); g.translate(W / 2, H * 0.7); g.scale(c * k, c * k); txt("COMENTA O SEU PRIMEIRO COMANDO ↓", 56, 0, "#ffffff"); g.restore(); }
}
