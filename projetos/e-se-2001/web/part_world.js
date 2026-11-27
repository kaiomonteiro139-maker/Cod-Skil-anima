
// ---------- lights ----------
scene.background = new THREE.Color(0x10131c);
const hemi = new THREE.HemisphereLight(0x8fa8d8, 0x3a2e28, 0.9); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffc98a, 1.5); sun.position.set(-6, 3.2, 0.8); scene.add(sun);
const fill = new THREE.PointLight(0xffd7a8, 4, 9, 1.4); fill.position.set(0.8, 2.3, 1.6); scene.add(fill);
const lapL = new THREE.PointLight(0x7fd6ff, 0, 2.2, 1.6); scene.add(lapL);
const tvL = new THREE.PointLight(0xc9d6ff, 0, 3, 1.6); scene.add(tvL);

// ---------- painters for this set ----------
const cvs = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const FONT = (w, s) => `${w} ${s}px "DejaVu Sans", Arial, sans-serif`;
function wallPaint(base) {
  const [c, g] = cvs(512, 512); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) { g.globalAlpha = 0.06; g.fillStyle = i % 2 ? "#ffffff" : "#000000"; g.beginPath(); g.ellipse(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 80, 20 + Math.random() * 40, 0, 0, 7); g.fill(); }
  g.globalAlpha = 1; return P.tex(c);
}
function poster(kind) {
  const [c, g] = cvs(400, 560);
  if (kind === 0) { // space poster
    g.fillStyle = "#1b1640"; g.fillRect(0, 0, 400, 560);
    for (let i = 0; i < 80; i++) { g.fillStyle = "#fff"; g.fillRect(Math.random() * 400, Math.random() * 560, 3, 3); }
    g.fillStyle = "#e8913a"; g.beginPath(); g.arc(200, 250, 110, 0, 7); g.fill();
    g.strokeStyle = "#f2d16b"; g.lineWidth = 14; g.beginPath(); g.ellipse(200, 250, 180, 40, -0.3, 0, 7); g.stroke();
    g.fillStyle = "#f2d16b"; g.font = FONT(900, 54); g.textAlign = "center"; g.fillText("ESPAÇO", 200, 480);
  } else { // guitar band poster (fictional)
    g.fillStyle = "#c23b3b"; g.fillRect(0, 0, 400, 560);
    g.fillStyle = "#1a1a1a"; g.beginPath(); g.ellipse(200, 330, 90, 110, 0, 0, 7); g.fill(); g.fillRect(185, 60, 30, 240);
    g.fillStyle = "#f4e3c2"; g.beginPath(); g.arc(200, 330, 30, 0, 7); g.fill();
    g.font = FONT(900, 60); g.textAlign = "center"; g.fillText("ROCK", 200, 520);
  }
  g.strokeStyle = "#241726"; g.lineWidth = 12; g.strokeRect(6, 6, 388, 548);
  return P.tex(c, false);
}
const calC = cvs(600, 800); const calTex = P.tex(calC[0], false); let calYear = null;
function calendarTex(year = 2001, month = "JUNHO") {
  if (calYear === year) return calTex; calYear = year;
  const [c, g] = calC;
  g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 600, 800);
  g.fillStyle = "#3f7fbf"; g.fillRect(0, 0, 600, 300); // picture: beach
  g.fillStyle = "#f2d16b"; g.beginPath(); g.arc(470, 90, 50, 0, 7); g.fill();
  g.fillStyle = "#e9d6a6"; g.fillRect(0, 220, 600, 80);
  g.fillStyle = "#2f8f5a"; g.fillRect(90, 110, 18, 120); g.beginPath(); g.ellipse(100, 110, 80, 26, 0.3, 0, 7); g.fill();
  g.fillStyle = "#241726"; g.textAlign = "center";
  g.font = FONT(900, 64); g.fillText(month, 300, 375);
  g.fillStyle = "#d8333a"; g.font = FONT(900, 150); g.fillText(String(year), 300, 520);
  g.fillStyle = "#241726"; g.font = FONT(700, 26);
  const days = ["D", "S", "T", "Q", "Q", "S", "S"]; days.forEach((d, i) => g.fillText(d, 60 + i * 80, 585));
  for (let k = 0; k < 30; k++) { const d = (k + 5), x = 60 + (d % 7) * 80, y = 625 + Math.floor(d / 7) * 34 - 34; if (y < 790) g.fillText(String(k + 1), x, y); }
  g.strokeStyle = "#241726"; g.lineWidth = 12; g.strokeRect(6, 6, 588, 788);
  calTex.needsUpdate = true; return calTex;
}
const clockC = cvs(256, 96); const clockTex = P.tex(clockC[0], false);
function drawClock(txt, on) {
  const g = clockC[1]; g.fillStyle = "#120808"; g.fillRect(0, 0, 256, 96);
  g.fillStyle = on ? "#ff3b2f" : "#3a1410"; g.font = `900 78px "DejaVu Sans Mono", monospace`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 52);
  clockTex.needsUpdate = true;
}
const tvC = cvs(256, 192); const tvTex = P.tex(tvC[0], false);
function drawStatic(seed, k) {
  const g = tvC[1], img = g.createImageData(256, 192); let s = seed * 9973 + 1;
  for (let i = 0; i < img.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = 40 + (s % 180) * k; img.data[i] = v * 0.9; img.data[i + 1] = v; img.data[i + 2] = v * 1.1; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.fillStyle = "#7dff8a"; g.font = `700 22px "DejaVu Sans Mono", monospace`; g.fillText("CH 03", 18, 32);
  tvTex.needsUpdate = true;
}
const crtC = cvs(640, 500); const crtTex = P.tex(crtC[0], false);
const termC = cvs(1024, 640); const termTex = P.tex(termC[0], false);
function drawTerm(t) { // t = seconds since the screen is shown
  const g = termC[1]; g.fillStyle = "#16181d"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#2a2e36"; g.fillRect(0, 0, 1024, 44);
  for (const [x, c] of [[26, "#ff5f57"], [56, "#febc2e"], [86, "#28c840"]]) { g.fillStyle = c; g.beginPath(); g.arc(x, 22, 9, 0, 7); g.fill(); }
  g.fillStyle = "#9aa4b2"; g.font = `700 22px "DejaVu Sans Mono", monospace`; g.textAlign = "center"; g.fillText("terminal", 512, 29); g.textAlign = "left";
  const cmd = "claude", typed = cmd.slice(0, Math.max(0, Math.min(cmd.length, Math.floor((t - 0.2) * 9))));
  g.font = `700 34px "DejaVu Sans Mono", monospace`;
  g.fillStyle = "#7ee787"; g.fillText("~ $", 30, 100); g.fillStyle = "#e6edf3"; g.fillText(typed, 120, 100);
  if (t > 1.1) {
    g.strokeStyle = "#e9a46a"; g.lineWidth = 4; g.strokeRect(30, 140, 964, 210);
    g.fillStyle = "#e9a46a"; g.font = `800 34px "DejaVu Sans Mono", monospace`; g.fillText("* Bem-vindo de volta!", 60, 200);
    g.fillStyle = "#9aa4b2"; g.font = `700 26px "DejaVu Sans Mono", monospace`; g.fillText("pasta: ~/meu-quarto", 60, 252);
    g.fillStyle = "#ffcc4d"; g.fillText("data do sistema: 14/06/2001  (?!)", 60, 300);
  }
  if (t > 1.9) {
    g.strokeStyle = "#5b6472"; g.lineWidth = 3; g.strokeRect(30, 420, 964, 90);
    g.fillStyle = "#e6edf3"; g.font = `700 32px "DejaVu Sans Mono", monospace`;
    const q = "> Qual é o seu primeiro comando?"; const n = Math.max(0, Math.min(q.length, Math.floor((t - 1.9) * 22)));
    g.fillText(q.slice(0, n) + (Math.floor(t * 2.5) % 2 ? "█" : " "), 54, 477);
  }
  termTex.needsUpdate = true;
}

// ---------- world: bedroom, June 2001 ----------
let WINDOW_GLOW; const SHAFTS = [];
const ROOMW = 5.2, ROOMD = 4.6, ROOMH = 2.7;
plane(ROOMW, ROOMD + 3, toon(0xffffff, P.planks("#9a6a42", { n: 7 })), 0, 0, 0.6, -Math.PI / 2, 0, scene, 1.6);
plane(ROOMW, ROOMD + 3, toon(0xd9d2c4), 0, ROOMH, 0.6, Math.PI / 2, 0);
const wallM = toon(0xffffff, wallPaint("#8fb3d9"));
tbox(ROOMW, ROOMH, 0.15, wallM, 0, 0, -2.3);
tbox(0.15, ROOMH, ROOMD + 3, wallM, -2.6, 0, 0.6);
tbox(0.15, ROOMH, ROOMD + 3, wallM, 2.6, 0, 0.6);
tbox(ROOMW, 0.1, 0.03, toon(0xf2efe6), 0, 0, -2.21); // skirting
// window with blinds on the left wall, morning sun streaming in
{ const g = new THREE.Group(); g.position.set(-2.52, 1.55, -0.6); scene.add(g);
  WINDOW_GLOW = plane(1.3, 1.1, glow(0xffe2b0), 0.02, 0, 0, 0, Math.PI / 2, g);
  for (let i = 0; i < 9; i++) tbox(0.03, 0.05, 1.3, toon(0xf2efe6), 0.06, -0.55 + i * 0.125, 0, g);
  tbox(0.08, 1.25, 0.08, toon(0xf2efe6), 0.04, -0.62, -0.68, g); tbox(0.08, 1.25, 0.08, toon(0xf2efe6), 0.04, -0.62, 0.68, g);
  const c = document.createElement("canvas"); c.width = 64; c.height = 256; const gg = c.getContext("2d");
  const gr = gg.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(255,214,150,0.22)"); gr.addColorStop(1, "rgba(255,214,150,0)"); gg.fillStyle = gr; gg.fillRect(0, 0, 64, 256);
  const shaftM = new THREE.MeshBasicMaterial({ map: P.tex(c, false), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 3.2), shaftM); SHAFTS.push(s); s.position.set(-1.6, 1.0 - i * 0.05, -0.85 + i * 0.18); s.rotation.set(0, 0.25, 1.05); scene.add(s); }
}
// posters + calendar on the back wall
add(new THREE.PlaneGeometry(0.62, 0.86), new THREE.MeshToonMaterial({ map: poster(0), gradientMap: gradMap }), -1.65, 1.75, -2.21);
add(new THREE.PlaneGeometry(0.55, 0.77), new THREE.MeshToonMaterial({ map: poster(1), gradientMap: gradMap }), 1.95, 1.7, -2.21);
const CAL = add(new THREE.PlaneGeometry(0.42, 0.56), new THREE.MeshToonMaterial({ map: calendarTex(), gradientMap: gradMap }), 0.95, 1.62, -2.215);
CAL.rotation.z = 0.03;
// bed
{ const wood = toon(0xffffff, P.planks("#7a5232", { n: 3 }));
  tbox(1.5, 0.32, 2.15, wood, -0.6, 0, -1.2);
  tbox(1.52, 0.9, 0.08, wood, -0.6, 0, -2.25);
  tbox(1.4, 0.24, 2.0, toon(0xf4f1ea), -0.6, 0.32, -1.2); // mattress, top at 0.56
  const pil = tbox(0.8, 0.16, 0.36, toon(0xf6f3ff), -0.6, 0.56, -1.98); pil.rotation.x = -0.25;
}
const BLANKET = tbox(1.48, 0.22, 1.12, toon(0xffffff, P.tiles("#2f4f8a", "#3a5d9a")), -0.6, 0.52, -0.62, scene, 0.8);
// nightstand + radio clock + landline phone
const wood2 = toon(0xffffff, P.planks("#8a5d3a", { n: 3 }));
tbox(0.75, 0.56, 0.48, wood2, 0.75, 0, -1.95);
const RADIO = new THREE.Group(); RADIO.position.set(0.56, 0.56, -1.9); scene.add(RADIO);
tbox(0.3, 0.12, 0.14, toon(0x2a2a30), 0, 0, 0, RADIO);
add(new THREE.PlaneGeometry(0.2, 0.075), new THREE.MeshBasicMaterial({ map: clockTex }), 0, 0.062, 0.071, RADIO);
tbox(0.08, 0.02, 0.05, toon(0x55555e), -0.08, 0.12, 0, RADIO);
const PHONE = new THREE.Group(); PHONE.position.set(0.93, 0.56, -1.88); PHONE.rotation.y = -0.35; scene.add(PHONE);
{ const beige = toon(0xe6dcc0);
  const body = tbox(0.22, 0.08, 0.2, beige, 0, 0, 0, PHONE); body.rotation.x = -0.12;
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) tbox(0.03, 0.012, 0.025, toon(0xf8f4ea), -0.04 + k * 0.04, 0.085, 0.07 - r * 0.035, PHONE);
  const hs = new THREE.Group(); hs.position.set(0, 0.11, -0.04); PHONE.add(hs);
  tbox(0.23, 0.04, 0.05, beige, 0, 0, 0, hs);
  for (const s of [-1, 1]) tbox(0.06, 0.05, 0.07, beige, s * 0.1, -0.02, 0, hs);
  // coiled cord (helix) from the handset down to the body
  const pts = []; for (let i = 0; i <= 260; i++) { const u = i / 260, a = u * 60;
    pts.push(new THREE.Vector3(-0.13 - 0.18 * Math.sin(u * 2.4) + 0.012 * Math.cos(a), 0.09 - 0.12 * Math.sin(u * 3.1) + 0.012 * Math.sin(a), -0.02 + 0.16 * u)); }
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.0045, 5), toon(0xe6dcc0), 0, 0, 0, PHONE);
}
// dresser + CRT TV (right side, facing the bed)
tbox(1.1, 0.75, 0.5, wood2, 2.2, 0, -0.1).rotation.y = Math.PI / 2;
const TV = new THREE.Group(); TV.position.set(2.15, 0.75, -0.1); TV.rotation.y = -Math.PI / 2 + 0.25; scene.add(TV);
{ tbox(0.62, 0.52, 0.5, toon(0x3a3c44), 0, 0, -0.05, TV);
  tbox(0.66, 0.06, 0.38, toon(0x2e3036), 0, 0, -0.05, TV);
  const scr = add(new THREE.SphereGeometry(0.9, 24, 16, -0.27, 0.54, Math.PI / 2 - 0.2, 0.4), new THREE.MeshBasicMaterial({ map: tvTex }), 0, 0.26, -0.64, TV); scr.rotation.y = Math.PI / 2;
  for (const s of [-1, 1]) { const a = tbox(0.012, 0.35, 0.012, toon(0x9aa2ad), s * 0.08, 0.52, -0.05, TV); a.rotation.z = s * 0.5; }
}
// desk with a beige PC, CRT monitor and a dial-up modem (front left)
const DESK = new THREE.Group(); DESK.position.set(-1.95, 0, 0.75); DESK.rotation.y = Math.PI / 2; scene.add(DESK);
const MODEM_LEDS = [];
{ const w = toon(0xffffff, P.planks("#a0784e", { n: 3 })), beige = toon(0xe2d9c2);
  tbox(1.3, 0.05, 0.6, w, 0, 0.72, 0, DESK); for (const [x, z] of [[-0.6, -0.25], [0.6, -0.25], [-0.6, 0.25], [0.6, 0.25]]) tbox(0.05, 0.72, 0.05, w, x, 0, z, DESK);
  tbox(0.42, 0.38, 0.4, beige, -0.15, 0.77, -0.05, DESK); // CRT monitor
  add(new THREE.PlaneGeometry(0.32, 0.25), new THREE.MeshBasicMaterial({ map: crtTex }), -0.15, 0.97, 0.152, DESK);
  tbox(0.2, 0.45, 0.42, beige, 0.45, 0.77, -0.05, DESK); // tower
  tbox(0.12, 0.012, 0.03, toon(0x555555), 0.45, 1.05, 0.165, DESK);
  tbox(0.45, 0.025, 0.15, beige, -0.15, 0.77, 0.2, DESK); // keyboard
  const modem = new THREE.Group(); modem.position.set(0.12, 0.77, 0.16); DESK.add(modem);
  tbox(0.24, 0.045, 0.16, toon(0x2b2d33), 0, 0, 0, modem);
  for (let i = 0; i < 6; i++) { const l = add(new THREE.SphereGeometry(0.008, 6, 4), glow(0x39ff6a), -0.08 + i * 0.03, 0.03, 0.081, modem); MODEM_LEDS.push(l); }
  // phone-line cable from the modem to the wall jack
  const pts = [new THREE.Vector3(0.12, 0.79, 0.08), new THREE.Vector3(0.2, 0.74, -0.15), new THREE.Vector3(0.35, 0.3, -0.28), new THREE.Vector3(0.5, 0.15, -0.3)];
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.006, 5), toon(0xe6dcc0), 0, 0, 0, DESK);
  DESK.userData.modem = modem;
}
// laptop from 2026 (on the blanket, screen facing the hero)
const LAPTOP = new THREE.Group(); LAPTOP.position.set(-0.6, 0.75, -0.9); scene.add(LAPTOP);
const LID = new THREE.Group(); LID.position.set(0, 0.012, -0.11); LAPTOP.add(LID);
{ const alu = toon(0x9aa3ad);
  tbox(0.36, 0.014, 0.24, alu, 0, 0, 0, LAPTOP);
  tbox(0.3, 0.002, 0.1, toon(0x2a2e36), 0, 0.014, 0.02, LAPTOP);
  tbox(0.36, 0.24, 0.008, alu, 0, 0, 0, LID); // lid (hinged at the back)
  const scr = add(new THREE.PlaneGeometry(0.33, 0.206), new THREE.MeshBasicMaterial({ map: termTex }), 0, 0.122, 0.0045, LID);
  LID.rotation.x = -0.25; // opened ~105 deg, screen faces +z (towards the hero sitting behind it? no: hero is at -z)
}
LAPTOP.rotation.y = Math.PI; // screen faces the hero (who sits behind it, at -z)
// clutter: CD tower, backpack
for (let i = 0; i < 8; i++) tbox(0.14, 0.012, 0.125, toon([0xd8333a, 0x3f6fb5, 0xf2c230, 0x2f9a5a][i % 4]), 1.9, 0.75 + i * 0.013, 0.55 + (i % 2) * 0.01);
tbox(0.4, 0.5, 0.25, toon(0x2f5f6a), 1.6, 0, 1.4).rotation.y = 0.4;
