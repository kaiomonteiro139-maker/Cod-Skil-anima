// 10 s sample, illustrated-story format: shot A (bed, phone) dissolves into shot B (over-the-shoulder at the desk).
export const FPS = 30;
export const TOTAL = 300;
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ss = (x) => { x = cl(x); return x * x * x * (x * (6 * x - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const L3 = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const seg = (t, a, b, e = ss) => e(cl((t - a) / (b - a)));
const blink = (t, s = 1) => ((t * 1000 + s * 777) % 3100) < 120;
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * cl(x)); // slow, constant-feeling push

function shotA(t) { const u = ease(t / 5.2);
  return { lamp: 6, mon: 0.9, phone: [-0.98, 1.08, -0.72], vig: 0.5,
    hero: { pos: [-1.0, 0.47, -0.9], opts: { mode: "sit", prop: "phone", expr: t < 2.6 ? "neutral" : "worried", blink: blink(t, 3), look: 0, headTilt: -3 + Math.sin(t * 0.9) * 2, seed: 2 }, tint: [0.92, 0.95, 1.06] },
    cam: { pos: L3([0.25, 1.25, 1.35], [-0.55, 1.15, 0.45], u), look: L3([-1.0, 0.95, -1.0], [-1.0, 1.05, -0.9], u), fov: lerp(42, 34, u), roll: lerp(-1.5, 0.5, u) } }; }
function shotB(t) { const u = ease((t - 4.4) / 5.6), n = "Sonho Grande", typed = n.slice(0, Math.floor(seg(t, 6.4, 8.1, (x) => x) * n.length));
  return { lamp: 3.5, mon: 2.6, desk: 1.6, vig: 0.42, typed,
    back: true,
    cam: { pos: L3([2.15, 1.5, 0.35], [1.82, 1.36, -0.4], u), look: L3([1.45, 1.1, -2.0], [1.55, 1.24, -2.0], u), fov: lerp(42, 33, u), roll: lerp(1, -0.5, u) } }; }

export function stateAt(t) {
  if (t < 4.4) return { a: shotA(t) };
  if (t < 5.0) return { a: shotA(t), b: shotB(t), mix: seg(t, 4.4, 5.0) };
  return { a: shotB(t), dark: 0.5 * seg(t, 9.55, 10.0) };
}
