
// ---------- frame (full video) ----------
TV.traverse((o) => { if (o.material && o.material.map === tvTex) o.material.map = tv2Tex; });
const OUTFITS = {
  hero: { jacket: "#3f6fb5", pants: "#2f3a4f", boots: "#e8e8e8", hat: "hair", hair: "#4a3020", skin: "#e8b48e" },
  hero2: { jacket: "#3f6fb5", pants: "#2f3a4f", boots: "#e8e8e8", hat: "hair", hair: "#4a3020", skin: "#e8b48e", moustache: "#4a3020" },
  mom: { jacket: "#c25a7a", dress: "#c25a7a", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#5a3b2a", skin: "#f0c9a8" },
  baker: { jacket: "#f4f1ea", pants: "#5a5a66", boots: "#3a2a20", hat: "cap", cap: "#ffffff", skin: "#d9a37a", moustache: "#2a201a", build: "stout" },
  investor: { jacket: "#2b2f3a", pants: "#2b2f3a", boots: "#111111", hat: "hair", hair: "#1a1a1a", skin: "#f0c9a8", buttons: "#d9b44a" },
  prog1: { jacket: "#5d7a3a", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#2a201a", skin: "#c99067" },
  prog2: { jacket: "#8c3b4a", pants: "#2f3a4f", boots: "#222222", hat: "cap", cap: "#1d2a4a", skin: "#f5c9a0" },
  prog3: { jacket: "#b5653f", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#7a4a20", skin: "#ecd0b6", moustache: "#7a4a20" },
  kid1: { jacket: "#f08a2c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "cap", cap: "#e2453c", build: "kid", skin: "#e8b48e" },
  kid2: { jacket: "#2fb3a0", pants: "#3b3f52", boots: "#f4f1ea", hat: "hair", hair: "#2a1a10", build: "kid", skin: "#c99067" },
  kid3: { jacket: "#7b5ac9", dress: "#7b5ac9", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#d9a441", build: "kid", skin: "#f5c9a0" },
  lady: { jacket: "#d9a441", dress: "#d9a441", pants: "#3b3f52", boots: "#5a3b2a", hat: "bonnet", skin: "#ecd0b6" },
};
const cardPool = {};
FX_DRAW.zzz = (p, g, t) => { g.fillStyle = "#ffffff"; g.strokeStyle = "#241726"; g.lineWidth = 12; g.textAlign = "center";
  [[150, 400, 90], [260, 290, 120], [380, 170, 150]].forEach(([x, y, s], i) => { const a = Math.max(0, Math.min(1, t * 3 - i * 0.6));
    g.globalAlpha = a; g.font = `900 ${s}px "DejaVu Sans"`; g.strokeText("Z", x, y - t * 40); g.fillText("Z", x, y - t * 40); }); g.globalAlpha = 1; };
FX_DRAW.beep = FX_DRAW.click;
const ink = (g, w = 14) => { g.strokeStyle = "#241726"; g.lineWidth = w; g.lineJoin = "round"; g.lineCap = "round"; };
FX_DRAW.battery = (p, g, t, col, o) => { const pct = o.pct ?? 100, c = pct <= 20 ? "#ff4b3a" : pct <= 50 ? "#f2c230" : "#3ad46a";
  ink(g, 18); g.fillStyle = "#f4f1ea"; g.fillRect(70, 160, 340, 190); g.strokeRect(70, 160, 340, 190); g.fillStyle = "#241726"; g.fillRect(410, 220, 36, 70);
  g.fillStyle = c; g.fillRect(90, 180, 300 * pct / 100, 150);
  g.fillStyle = "#fff"; g.font = `900 92px "DejaVu Sans"`; g.textAlign = "center"; g.lineWidth = 14; g.strokeText(pct + "%", 240, 450); g.fillText(pct + "%", 240, 450); };
FX_DRAW.nowifi = (p, g, t) => { ink(g, 22); g.strokeStyle = "#fff";
  for (let i = 0; i < 3; i++) { g.lineWidth = 34; g.strokeStyle = "#241726"; g.beginPath(); g.arc(256, 360, 70 + i * 70, -2.4, -0.74); g.stroke(); g.lineWidth = 18; g.strokeStyle = "#ffffff"; g.beginPath(); g.arc(256, 360, 70 + i * 70, -2.4, -0.74); g.stroke(); }
  g.lineWidth = 40; g.strokeStyle = "#241726"; g.beginPath(); g.moveTo(110, 110); g.lineTo(400, 400); g.stroke(); g.lineWidth = 24; g.strokeStyle = "#ff4b3a"; g.stroke(); };
FX_DRAW.idea = (p, g, t) => { const s = 1 + 0.08 * Math.sin(t * 12); g.translate(256, 240); g.scale(s, s);
  g.fillStyle = "#fff3a0"; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; ink(g, 14); g.beginPath(); g.moveTo(Math.cos(a) * 150, Math.sin(a) * 150); g.lineTo(Math.cos(a) * 210, Math.sin(a) * 210); g.stroke(); }
  ink(g, 16); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(0, -20, 110, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#9aa3ad"; g.fillRect(-50, 85, 100, 60); g.strokeRect(-50, 85, 100, 60); };
FX_DRAW.lottery = (p, g, t, col, o) => { const nums = [7, 13, 22, 35, 41, 58];
  nums.forEach((n, i) => { const a = Math.min(1, Math.max(0, t * 4 - i * 0.5)); if (a <= 0) return; const x = 70 + (i % 3) * 185, y = 150 + Math.floor(i / 3) * 190;
    ink(g, 14); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, 72 * a, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#241726"; g.font = `900 64px "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, x, y + 4); });
  if (o.cross) { g.lineCap = "round"; g.lineWidth = 46; g.strokeStyle = "#241726"; g.beginPath(); g.moveTo(40, 40); g.lineTo(470, 470); g.moveTo(470, 40); g.lineTo(40, 470); g.stroke(); g.lineWidth = 28; g.strokeStyle = "#ff4b3a"; g.stroke(); } };
FX_DRAW.apps = (p, g, t, col, o) => { const ic = [["#e5483b", "♥"], ["#3f6fb5", "✉"], ["#2fb36a", "$"], ["#f2c230", "★"]];
  ic.forEach(([c, s], i) => { const a = Math.min(1, Math.max(0, t * 4 - i * 0.5)); if (a <= 0) return; const x = 140 + (i % 2) * 230, y = 140 + Math.floor(i / 2) * 230;
    ink(g, 14); g.fillStyle = c; rr2(g, x - 90 * a, y - 90 * a, 180 * a, 180 * a, 40 * a); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.font = `900 ${100 * a}px "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, x, y + 6); });
  if (o.cross) { g.lineCap = "round"; g.lineWidth = 46; g.strokeStyle = "#241726"; g.beginPath(); g.moveTo(40, 40); g.lineTo(470, 470); g.moveTo(470, 40); g.lineTo(40, 470); g.stroke(); g.lineWidth = 28; g.strokeStyle = "#ff4b3a"; g.stroke(); } };
FX_DRAW.loop = (p, g, t) => { g.translate(256, 256); g.rotate(t * 1.6); g.lineCap = "round";
  for (const k of [0, 1]) { g.lineWidth = 46; g.strokeStyle = "#241726"; g.beginPath(); g.arc(0, 0, 170, k * Math.PI + 0.3, k * Math.PI + 2.6); g.stroke(); g.lineWidth = 28; g.strokeStyle = "#ffd23f"; g.stroke();
    const a = k * Math.PI + 2.6, x = Math.cos(a) * 170, y = Math.sin(a) * 170; g.fillStyle = "#ffd23f"; g.lineWidth = 12; g.strokeStyle = "#241726"; g.beginPath(); g.moveTo(x + Math.cos(a) * 50, y + Math.sin(a) * 50); g.lineTo(x - Math.cos(a) * 50, y - Math.sin(a) * 50); g.lineTo(x + Math.cos(a + 1.57) * 60, y + Math.sin(a + 1.57) * 60); g.closePath(); g.fill(); g.stroke(); } };
FX_DRAW.coins = (p, g, t) => { for (let i = 0; i < 7; i++) { const x = 70 + i * 60, y = 460 - ((t * 300 + i * 90) % 460); ink(g, 10); g.fillStyle = "#ffd23f"; g.beginPath(); g.ellipse(x, y, 38, 38, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#c99a1a"; g.font = `900 44px "DejaVu Sans"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", x, y + 2); } };
FX_DRAW.question = (p, g, t) => { [[140, 300, 150], [330, 210, 200], [430, 360, 120]].forEach(([x, y, s], i) => { g.font = `900 ${s}px "DejaVu Sans"`; g.textAlign = "center"; g.lineWidth = 16; g.strokeStyle = "#241726"; const yy = y - Math.sin(t * 4 + i) * 12; g.strokeText("?", x, yy); g.fillStyle = "#ffffff"; g.fillText("?", x, yy); }); };
FX_DRAW.stars = (p, g, t) => { for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + t * 2, r = 150 + 40 * Math.sin(t * 5 + i); const x = 256 + Math.cos(a) * r, y = 256 + Math.sin(a) * r * 0.6;
  g.save(); g.translate(x, y); g.rotate(t * 3 + i); ink(g, 10); g.fillStyle = "#ffd23f"; g.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? 18 : 42; g.lineTo(Math.cos(k * 0.628) * rr, Math.sin(k * 0.628) * rr); } g.closePath(); g.fill(); g.stroke(); g.restore(); } };
FX_DRAW.laugh = (p, g, t) => { g.font = `900 110px "DejaVu Sans"`; g.textAlign = "center"; g.lineWidth = 14; g.strokeStyle = "#241726"; g.fillStyle = "#ffd23f";
  [["HA", 150, 200], ["HA", 330, 300], ["HA", 200, 420]].forEach(([s, x, y], i) => { const yy = y - Math.abs(Math.sin(t * 9 + i)) * 20; g.strokeText(s, x, yy); g.fillText(s, x, yy); }); };
FX_DRAW.wind = (p, g, t) => { g.lineCap = "round"; for (let i = 0; i < 4; i++) { const y = 120 + i * 90, x0 = ((t * 260 + i * 120) % 300) - 60; g.lineWidth = 22; g.strokeStyle = "#241726"; g.beginPath(); g.moveTo(x0, y); g.bezierCurveTo(x0 + 80, y - 30, x0 + 160, y + 30, x0 + 240, y); g.stroke(); g.lineWidth = 12; g.strokeStyle = "#cfefff"; g.stroke(); } };

const LIGHTS = {
  morning: { hemi: [0x8fa8d8, 0x3a2e28, 0.9], sun: 1.5, bg: 0x10131c, win: 0xffe2b0, shafts: true, tint: [1, 0.96, 0.92], vig: 0.45 },
  night: { hemi: [0x2c3a66, 0x0a0a12, 0.55], sun: 0, bg: 0x05060a, win: 0x1c2a52, shafts: false, tint: [0.62, 0.72, 0.98], vig: 0.6 },
  street: { hemi: [0xcfe2ff, 0x7a6a50, 1.25], sun: 1.6, bg: 0x8fc4f0, win: 0xffe2b0, shafts: true, tint: [1, 1, 1], vig: 0.3 },
  indoor: { hemi: [0xb9c6dc, 0x4a3a2e, 1.0], sun: 0.4, bg: 0x10131c, win: 0xffe2b0, shafts: false, tint: [1, 0.97, 0.94], vig: 0.4 },
  lan: { hemi: [0x5a6a9a, 0x1a1a24, 0.7], sun: 0, bg: 0x05060a, win: 0x1c2a52, shafts: false, tint: [0.82, 0.88, 1.0], vig: 0.55 },
};
const hidePos = (o) => { o.visible = false; };
window.renderFrame = async (f) => {
  const t = f / FPS, S = shotAt(t), st = S.fn(t, t - S.t0, S);
  const L = LIGHTS[st.light || "morning"];
  hemi.color.setHex(L.hemi[0]); hemi.groundColor.setHex(L.hemi[1]); hemi.intensity = L.hemi[2]; sun.intensity = st.sun ?? L.sun;
  scene.background = new THREE.Color(L.bg); WINDOW_GLOW.material.color.setHex(L.win); SHAFTS.forEach((s) => (s.visible = L.shafts));
  fill.intensity = st.light === "night" ? 0 : 4;
  const c = st.cam;
  camera.position.set(...c.pos); camera.lookAt(new THREE.Vector3(...c.look));
  camera.fov = c.fov ?? 40; camera.aspect = W / H; camera.rotateZ(((c.roll ?? 0) * Math.PI) / 180); camera.updateProjectionMatrix();
  // bedroom props
  drawClock(st.clock ?? "06:59", st.clockOn ?? true);
  if (st.tv) drawTV(st.tv, t, st.tvOpt || {}); else if (st.light === "night") drawTV("static", t);
  else drawTV("static", t);
  tvL.intensity = st.light === "night" ? 0.6 : 2.5; tvL.position.set(1.8, 1.05, -0.1);
  if (st.termMode) drawTermMode(st.termMode, st.termT ?? 0, st.termOpt || {}); else drawTerm(st.term ?? 0);
  lapL.intensity = st.lap ?? 2.5; lapL.position.set(-0.6, 1.0, -1.05);
  drawCRT(st.crt || "off", st.crtT ?? 0, st.crtOpt || {});
  MODEM_LEDS.forEach((l, i) => (l.visible = st.modem ? ((f + i * 3) % (5 + i)) < 3 : i === 0));
  calendarTex(st.year ?? 2001, st.month ?? "JUNHO");
  LAPTOP.visible = st.laptop !== false; if (st.laptopPos) LAPTOP.position.set(...st.laptopPos); else LAPTOP.position.set(-0.6, 0.75, -0.9);
  CDS.forEach((cd, i) => (cd.visible = i < (st.cds ?? 0)));
  // hand-held inserts
  for (const [obj, key] of [[BRICK, "brick"], [SMART, "smart"]]) { obj.visible = !!st[key]; if (st[key]) { obj.position.set(...st[key]); obj.lookAt(camera.position); obj.rotateZ(st[key + "Roll"] ?? 0); } }
  if (st.brick) drawSnake(st.snakeT ?? 0); if (st.smart) drawSmart(0);
  PAPER.visible = !!st.paper; if (st.paper) { drawPaper(st.paper.mode); PAPER.position.set(...st.paper.pos); PAPER.rotation.set(...(st.paper.rot || [-Math.PI / 2, 0, 0])); }
  drawBakPC(!!st.bakpc, t); drawLan(st.lanMode || "game", t);
  MUGS.forEach((m, i) => (m.visible = i < (st.mugs ?? 3)));
  AC_FLAP.rotation.x = 0.3 + 0.25 * Math.sin(t * 2);
  // actors
  const used = new Set();
  for (const a of st.actors || []) {
    const id = a.key || a.id; used.add(id);
    const C = cardPool[id] || (cardPool[id] = new Card(600, 1000, a.su || SU));
    C.draw(actorKey(a.opts) + (a.o || a.id), (p) => T.bodyFront(p, OUTFITS[a.o || a.id], a.opts));
    C.place(a.pos[0], a.pos[1], a.pos[2], camera.position, { tint: a.tint || L.tint, blob: a.blob ?? (a.pos[1] < 0.05), floor: a.floor, scale: a.scale });
  }
  for (const k in cardPool) if (!used.has(k)) cardPool[k].hide();
  for (const k in cards) cards[k].hide();
  fxCards.forEach((cc) => cc.hide());
  (st.fx || []).forEach((e, i) => {
    const C = fxCards[i];
    C.draw(e.type + qz(e.t, 0.034) + JSON.stringify(e.o || {}), (p, g) => FX_DRAW[e.type](p, g, e.t, e.col, e.o || {}));
    C.place(e.pos[0], e.pos[1], e.pos[2], camera.position, { scale: e.scale ?? 1, blob: false });
  });
  renderer.setRenderTarget(rt); renderer.render(scene, camera);
  post.uniforms.flash.value = st.flash ?? 0; post.uniforms.dark.value = st.dark ?? 0; post.uniforms.vig.value = st.vig ?? L.vig; post.uniforms.seed.value = f * 0.37;
  post.uniforms.near.value = camera.near; post.uniforms.far.value = camera.far; post.uniforms.sat.value = 1.08; post.uniforms.gain.value.set(1.03, 1.0, 0.98);
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  og.drawImage(glc, 0, 0);
  if (st.overlay) st.overlay(og, W, H, t);
  return out.toDataURL("image/jpeg", 0.95);
};
window.TOTAL = TOTAL;
window.ready = true;
