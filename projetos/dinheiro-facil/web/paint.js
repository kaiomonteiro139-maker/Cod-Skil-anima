// Painted canvas textures: flat colours with darker seams and a little grime.
import * as THREE from "./three.module.js";

let SEED = 7;
const rnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
export const hex = (c, k = 1) => {
  const n = parseInt(c.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, "0");
  return "#" + ch((n >> 16) & 255) + ch((n >> 8) & 255) + ch(n & 255);
};
const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
export const tex = (c, rep = true) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.anisotropy = 4;
  return t;
};
const grime = (g, w, h, col, n = 40, a = 0.12) => {
  for (let i = 0; i < n; i++) {
    g.globalAlpha = a * rnd();
    g.fillStyle = col;
    g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 60, 6 + rnd() * 30, rnd() * 3, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
};
const crack = (g, x, y, len, col, w = 3) => {
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y);
  let a = rnd() * 6.28;
  for (let i = 0; i < 6; i++) { a += (rnd() - 0.5) * 1.4; x += Math.cos(a) * len / 6; y += Math.sin(a) * len / 6; g.lineTo(x, y); }
  g.stroke();
};

export function asphalt() {
  const [c, g] = cv(512, 512);
  g.fillStyle = "#3a3d46"; g.fillRect(0, 0, 512, 512);
  grime(g, 512, 512, "#23252c", 60, 0.35);
  grime(g, 512, 512, "#4a4e58", 30, 0.25);
  for (let i = 0; i < 5; i++) crack(g, rnd() * 512, rnd() * 512, 160, "#1b1c22", 3);
  return tex(c);
}
export function roadLine() {
  const [c, g] = cv(64, 512);
  g.fillStyle = "#3a3d46"; g.fillRect(0, 0, 64, 512);
  g.fillStyle = "#c9c19a"; g.fillRect(22, 40, 20, 220);
  grime(g, 64, 512, "#23252c", 10, 0.5);
  return tex(c);
}
export function plaster(base, opts = {}) {
  const [c, g] = cv(512, 512);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  grime(g, 512, 512, hex(base, 0.7), 50, 0.25);
  grime(g, 512, 512, hex(base, 1.15), 20, 0.2);
  if (opts.damp) { // damp stains running down from the top
    for (let i = 0; i < 6; i++) {
      const x = rnd() * 512, w = 30 + rnd() * 60, h = 120 + rnd() * 260;
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(40,45,30,0.45)"); gr.addColorStop(1, "rgba(40,45,30,0)");
      g.fillStyle = gr; g.fillRect(x, 0, w, h);
    }
  }
  for (let i = 0; i < (opts.cracks ?? 3); i++) crack(g, rnd() * 512, rnd() * 512, 140, hex(base, 0.45), 3);
  if (opts.brick) { // plaster fallen off, bricks showing
    for (let k = 0; k < 2; k++) {
      const x0 = rnd() * 380, y0 = rnd() * 380;
      g.fillStyle = "#8a4a36"; g.beginPath(); g.ellipse(x0 + 60, y0 + 50, 70, 50, rnd(), 0, 7); g.fill();
      g.save(); g.clip();
      g.strokeStyle = "#4d2a20"; g.lineWidth = 4;
      for (let y = y0; y < y0 + 110; y += 22) { g.beginPath(); g.moveTo(x0 - 20, y); g.lineTo(x0 + 140, y); g.stroke();
        for (let x = x0 - 20 + ((y / 22) % 2) * 22; x < x0 + 140; x += 44) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 22); g.stroke(); } }
      g.restore();
    }
  }
  return tex(c);
}
export function planks(base, opts = {}) {
  const [c, g] = cv(512, 512);
  const n = opts.n ?? 6, vert = opts.vertical ?? false;
  for (let i = 0; i < n; i++) {
    const k = 0.85 + rnd() * 0.3;
    g.fillStyle = hex(base, k);
    if (vert) g.fillRect((i * 512) / n, 0, 512 / n, 512); else g.fillRect(0, (i * 512) / n, 512, 512 / n);
    g.fillStyle = hex(base, 0.45);
    if (vert) g.fillRect((i * 512) / n, 0, 5, 512); else g.fillRect(0, (i * 512) / n, 512, 5);
    for (let j = 0; j < 4; j++) { // grain
      g.strokeStyle = hex(base, 0.7); g.lineWidth = 2; g.beginPath();
      if (vert) { const x = (i + rnd()) * 512 / n; g.moveTo(x, rnd() * 512); g.lineTo(x + 3, rnd() * 512); }
      else { const y = (i + rnd()) * 512 / n; g.moveTo(rnd() * 512, y); g.lineTo(rnd() * 512, y + 3); }
      g.stroke();
    }
  }
  if (opts.rot) grime(g, 512, 512, "#2a2a1c", 30, 0.35);
  return tex(c);
}
export function tiles(a, b) {
  const [c, g] = cv(512, 512);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * 64, y * 64, 64, 64);
    g.strokeStyle = hex(a, 0.55); g.lineWidth = 3; g.strokeRect(x * 64, y * 64, 64, 64);
  }
  grime(g, 512, 512, "#1a120c", 30, 0.2);
  return tex(c);
}
export function wallpaper(base, stripe) {
  const [c, g] = cv(512, 512);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) { g.fillStyle = stripe; g.fillRect(x + 24, 0, 16, 512);
    for (let y = 20; y < 512; y += 64) { g.beginPath(); g.arc(x + 56, y, 6, 0, 7); g.fill(); } }
  grime(g, 512, 512, hex(base, 0.6), 30, 0.25);
  for (let i = 0; i < 3; i++) crack(g, rnd() * 512, rnd() * 512, 100, hex(base, 0.5), 2);
  return tex(c);
}
export function dirt() {
  const [c, g] = cv(512, 512);
  g.fillStyle = "#3d3a2c"; g.fillRect(0, 0, 512, 512);
  grime(g, 512, 512, "#2a281e", 50, 0.4);
  for (let i = 0; i < 220; i++) { // weed tufts
    const x = rnd() * 512, y = rnd() * 512;
    g.strokeStyle = rnd() < 0.5 ? "#3f5a2c" : "#556b30"; g.lineWidth = 3;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 14, y - 8 - rnd() * 10); g.stroke(); }
  }
  return tex(c);
}
export function roofTiles(base) {
  const [c, g] = cv(512, 512);
  g.fillStyle = hex(base, 0.6); g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 40) for (let x = -40 + ((y / 40) % 2) * 32; x < 512; x += 64) {
    g.fillStyle = hex(base, 0.85 + rnd() * 0.3); g.beginPath(); g.ellipse(x + 32, y + 26, 30, 22, 0, 0, Math.PI); g.fill();
  }
  return tex(c);
}

/** carved / painted sign text, read from the front (no mirroring: plane faces +z) */
export function signText(lines, opts = {}) {
  const w = opts.w ?? 1024, h = opts.h ?? 256;
  const [c, g] = cv(w, h);
  g.fillStyle = opts.bg ?? "#6b5a3e"; g.fillRect(0, 0, w, h);
  grime(g, w, h, "#2a2218", 30, 0.35);
  g.strokeStyle = "#241726"; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14);
  g.fillStyle = opts.fg ?? "#e9dcbc"; g.textAlign = "center"; g.textBaseline = "middle";
  const fs = opts.size ?? 110;
  g.font = `900 ${fs}px "DejaVu Sans", Arial, sans-serif`;
  lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * fs * 1.1));
  if (opts.rust) grime(g, w, h, "#5a2a14", 25, 0.5);
  return tex(c, false);
}

/** a small paper tag stapled on a delivery bag: order date */
export function receipt(date, n) {
  const [c, g] = cv(256, 320);
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 256, 320);
  g.fillStyle = "#241726"; g.textAlign = "center";
  g.font = `900 46px "DejaVu Sans", Arial, sans-serif`; g.fillText("PEDIDO", 128, 64);
  g.font = `700 34px "DejaVu Sans Mono", monospace`; g.fillText("#" + n, 128, 112);
  g.fillStyle = "#c7302c"; g.font = `900 60px "DejaVu Sans", Arial, sans-serif`; g.fillText(date, 128, 200);
  g.fillStyle = "#241726"; for (let i = 0; i < 4; i++) g.fillRect(40, 236 + i * 18, 176 - (i % 2) * 50, 7);
  g.strokeStyle = "#241726"; g.lineWidth = 8; g.strokeRect(4, 4, 248, 312);
  return tex(c, false);
}

/** delivery app screen */
export function phoneApp() {
  const [c, g] = cv(360, 720);
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 360, 720);
  g.fillStyle = "#e5483b"; g.fillRect(0, 0, 360, 110);
  g.fillStyle = "#fff"; g.textAlign = "left";
  g.font = `900 34px "DejaVu Sans", Arial, sans-serif`; g.fillText("ÚLTIMA CORRIDA", 22, 70);
  // map
  g.fillStyle = "#26303d"; g.fillRect(16, 130, 328, 300);
  g.strokeStyle = "#3b4a5c"; g.lineWidth = 10;
  for (const [a, b, c2, d] of [[16, 200, 344, 240], [120, 130, 160, 430], [16, 360, 344, 330], [260, 130, 240, 430]]) { g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke(); }
  g.strokeStyle = "#ffcc33"; g.lineWidth = 8; g.setLineDash([16, 10]);
  g.beginPath(); g.moveTo(60, 410); g.lineTo(140, 300); g.lineTo(250, 260); g.lineTo(280, 170); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#e5483b"; g.beginPath(); g.arc(280, 160, 20, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(280, 160, 8, 0, 7); g.fill();
  g.fillStyle = "#9aa4b2"; g.font = `700 26px "DejaVu Sans", Arial, sans-serif`; g.fillText("CLIENTE", 22, 490);
  g.fillStyle = "#fff"; g.font = `900 64px "DejaVu Sans", Arial, sans-serif`; g.fillText("Júlia", 22, 560);
  g.fillStyle = "#9aa4b2"; g.font = `700 24px "DejaVu Sans", Arial, sans-serif`; g.fillText("00:00  •  Rua das Acácias, 13", 22, 610);
  g.fillStyle = "#2fb36a"; g.fillRect(22, 640, 316, 56); g.fillStyle = "#fff"; g.font = `900 30px "DejaVu Sans", Arial, sans-serif`; g.textAlign = "center"; g.fillText("ACEITAR", 180, 678);
  return c;
}
/** no-signal screen (redrawn with blinking) */
export function phoneNoSignal(g, blink, searching = false, t = 0) {
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 360, 720);
  g.fillStyle = "#cfd6df"; g.textAlign = "center";
  g.font = `700 30px "DejaVu Sans", Arial, sans-serif`; g.fillText("00:47", 180, 46);
  if (searching) {
    for (let i = 0; i < 4; i++) { g.fillStyle = i <= Math.floor(t * 4) % 4 ? "#cfd6df" : "#3a404a"; g.fillRect(110 + i * 38, 260 - i * 34, 26, 40 + i * 34); }
    g.fillStyle = "#cfd6df"; g.font = `800 38px "DejaVu Sans", Arial, sans-serif`; g.fillText("Procurando", 180, 400); g.fillText("rede...", 180, 450);
    return;
  }
  // signal bars, empty, with a red X
  for (let i = 0; i < 4; i++) { g.strokeStyle = "#5b6472"; g.lineWidth = 6; g.strokeRect(110 + i * 38, 260 - i * 34, 26, 40 + i * 34); }
  if (blink) { g.strokeStyle = "#ff3b30"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(120, 160); g.lineTo(250, 290); g.moveTo(250, 160); g.lineTo(120, 290); g.stroke(); }
  g.fillStyle = "#ff3b30"; g.font = `900 64px "DejaVu Sans", Arial, sans-serif`; g.fillText("SEM", 180, 420); g.fillText("SINAL", 180, 494);
  g.fillStyle = "#7d8694"; g.font = `700 24px "DejaVu Sans", Arial, sans-serif`; g.fillText("Nenhuma rede disponível", 180, 560);
}
/** lock screen: still no signal, but the delivery app pushes "Pedido entregue" (k: 0..1 slide-in) */
export function phoneDelivered(g, t, k = 1) {
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 360, 720);
  g.textAlign = "center"; g.fillStyle = "#cfd6df"; g.font = `700 30px "DejaVu Sans", Arial, sans-serif`; g.fillText("00:52", 180, 46);
  g.fillStyle = "#ff3b30"; g.font = `800 22px "DejaVu Sans", Arial, sans-serif`; g.fillText("SEM SINAL", 180, 80);
  g.fillStyle = "#cfd6df"; g.font = `200 110px "DejaVu Sans", Arial, sans-serif`; g.fillText("00:52", 180, 600);
  const y = -330 + 430 * (1 - Math.pow(1 - Math.min(1, k), 3));
  g.fillStyle = "#f4f4f6"; g.beginPath(); g.roundRect(14, y, 332, 330, 28); g.fill();
  g.fillStyle = "#e5483b"; g.beginPath(); g.roundRect(14, y, 332, 70, [28, 28, 0, 0]); g.fill();
  g.fillStyle = "#fff"; g.font = `900 26px "DejaVu Sans", Arial, sans-serif`; g.fillText("ÚLTIMA CORRIDA", 180, y + 46);
  g.fillStyle = "#2fb36a"; g.beginPath(); g.arc(180, y + 140, 48, 0, 7); g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 14; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(155, y + 140); g.lineTo(173, y + 160); g.lineTo(207, y + 120); g.stroke();
  g.fillStyle = "#14161c"; g.font = `900 40px "DejaVu Sans", Arial, sans-serif`; g.fillText("PEDIDO", 180, y + 238); g.fillText("ENTREGUE", 180, y + 284);
  g.fillStyle = "#6b7280"; g.font = `700 20px "DejaVu Sans", Arial, sans-serif`; g.fillText("Corrida finalizada", 180, y + 316);
}
