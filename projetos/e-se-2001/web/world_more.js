
// =====================================================================
// Screens (canvas UIs) for the full video
// =====================================================================
const MONO = (w, s) => `${w} ${s}px "DejaVu Sans Mono", monospace`;
const rr2 = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
function win98(g, W, H, title, bg = "#ffffff") { // classic desktop window chrome
  g.fillStyle = "#3a6ea5"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#c0c0c0"; g.fillRect(14, 14, W - 28, H - 28);
  g.fillStyle = "#0a246a"; g.fillRect(18, 18, W - 36, 34);
  g.fillStyle = "#fff"; g.font = FONT(700, 20); g.textAlign = "left"; g.fillText(title, 28, 42);
  g.fillStyle = bg; g.fillRect(22, 58, W - 44, H - 80);
}
// ---- laptop terminal: mode-based ----
function batteryGlyph(g, x, y, w, h, pct, col) {
  g.strokeStyle = col; g.lineWidth = 6; g.strokeRect(x, y, w, h); g.fillStyle = col; g.fillRect(x + w, y + h * 0.3, 10, h * 0.4);
  g.fillRect(x + 8, y + 8, Math.max(0, (w - 16) * pct / 100), h - 16);
}
function drawTermMode(mode, t, opt = {}) {
  const g = termC[1];
  if (mode === "intro") return drawTerm(t);
  g.fillStyle = "#16181d"; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#2a2e36"; g.fillRect(0, 0, 1024, 44);
  for (const [x, c] of [[26, "#ff5f57"], [56, "#febc2e"], [86, "#28c840"]]) { g.fillStyle = c; g.beginPath(); g.arc(x, 22, 9, 0, 7); g.fill(); }
  g.textAlign = "left";
  const pct = opt.pct ?? 100, low = pct <= 20;
  // battery indicator in the title bar
  g.fillStyle = low ? "#ff5f57" : "#9aa4b2"; g.font = MONO(700, 22); g.textAlign = "right"; g.fillText(pct + "%", 960, 30); g.textAlign = "left";
  g.strokeStyle = low ? "#ff5f57" : "#9aa4b2"; g.lineWidth = 3; g.strokeRect(970, 12, 40, 20); g.fillStyle = low ? "#ff5f57" : "#9aa4b2"; g.fillRect(973, 15, 34 * pct / 100, 14);
  const line = (txt, y, col = "#e6edf3", size = 30) => { g.fillStyle = col; g.font = MONO(700, size); g.fillText(txt, 40, y); };
  const typed = (txt, rate = 18, t0 = 0) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0) * rate))));
  const cursor = () => (Math.floor(t * 2.5) % 2 ? "█" : " ");
  if (mode === "battery") {
    batteryGlyph(g, 300, 200, 380, 200, pct, low ? "#ff5f57" : pct <= 50 ? "#febc2e" : "#28c840");
    g.fillStyle = low ? "#ff5f57" : "#e6edf3"; g.font = FONT(900, 120); g.textAlign = "center"; g.fillText(pct + "%", 512, 560);
    if (low && Math.floor(t * 3) % 2) { g.fillStyle = "#ff5f57"; g.font = FONT(800, 32); g.fillText("BATERIA FRACA", 512, 120); }
  } else if (mode === "prompt") {
    line("~ $ claude", 100, "#7ee787");
    g.strokeStyle = "#5b6472"; g.lineWidth = 3; g.strokeRect(30, 420, 964, 90);
    line("> " + (opt.q ?? "Qual é o seu primeiro comando?") + cursor(), 477, "#e6edf3", 32);
  } else if (mode === "type") {
    line("~ $ claude", 100, "#7ee787");
    g.strokeStyle = "#5b6472"; g.lineWidth = 3; g.strokeRect(30, 380, 964, 160);
    const words = typed(opt.text, opt.rate ?? 16);
    const lines = []; let cur = "";
    for (const w of words.split(" ")) { if ((cur + " " + w).length > 46) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }
    lines.push(cur);
    lines.forEach((l, i) => line((i ? "  " : "> ") + l + (i === lines.length - 1 ? cursor() : ""), 432 + i * 44, "#e6edf3", 30));
  } else if (mode === "code") { // code pouring out
    const src = ["<html>", "  <head><title>Meu Site</title></head>", "  <body>", "    <nav>Início | Fotos | Contato</nav>", "    <h1>Bem-vindo!</h1>", "    <img src='foto1.jpg'>", "    <form action='contato'>", "      <input name='email'>", "      <button>Enviar</button>", "    </form>", "  </body>", "</html>"];
    const alt = ["def aula_1():", "    # variáveis guardam valores", "    nome = 'Brasil'", "    print('Olá,', nome)", "", "def aula_2():", "    # repetir com for", "    for i in range(3):", "        print(i)", "", "def aula_3():", "    # funções organizam o código"];
    const L = opt.lessons ? alt : src, n = Math.floor(t * (opt.rate ?? 6));
    line(opt.lessons ? "● Escrevendo: curso_de_programacao/" : "● Criando o site...", 90, "#e9a46a", 28);
    for (let i = 0; i < Math.min(L.length, n); i++) line(L[i], 140 + i * 38, i % 3 === 0 ? "#7ee787" : "#e6edf3", 26);
    if (opt.done && t > opt.done) { g.fillStyle = "#28c840"; g.fillRect(620, 560, 370, 56); g.fillStyle = "#06210e"; g.font = MONO(800, 28); g.fillText("✓ Pronto em 2 min", 640, 598); }
  } else if (mode === "black") {
    g.fillStyle = "#000"; g.fillRect(0, 0, 1024, 640);
  }
  if (opt.fade) { g.fillStyle = `rgba(0,0,0,${Math.min(1, opt.fade)})`; g.fillRect(0, 0, 1024, 640); }
  termTex.needsUpdate = true;
}
// ---- desk CRT monitor (640x500) ----
function browser(g, url, body) {
  win98(g, 640, 500, "Navegador");
  g.fillStyle = "#fff"; g.fillRect(26, 62, 588, 30); g.strokeStyle = "#808080"; g.strokeRect(26, 62, 588, 30);
  g.fillStyle = "#000"; g.font = MONO(700, 18); g.textAlign = "left"; g.fillText(url, 34, 83);
  g.save(); g.beginPath(); g.rect(22, 98, 596, 380); g.clip(); body(); g.restore();
}
function drawCRT(mode, t, opt = {}) {
  const g = crtC[1], W = 640, H = 500; g.textAlign = "left";
  if (mode === "off") { g.fillStyle = "#0b0f14"; g.fillRect(0, 0, W, H); }
  else if (mode === "404") browser(g, opt.url, () => { g.fillStyle = "#fff"; g.fillRect(22, 98, 596, 380); g.fillStyle = "#000"; g.font = FONT(800, 34); g.fillText("Página não encontrada", 50, 170); g.font = FONT(400, 20); g.fillText("O endereço " + opt.url, 50, 220); g.fillText("ainda não existe.", 50, 250); g.fillStyle = "#d8333a"; g.font = FONT(900, 80); g.fillText("?", 520, 260); });
  else if (mode === "wiki") browser(g, "www.wikipedia.org", () => { g.fillStyle = "#fff"; g.fillRect(22, 98, 596, 380); g.fillStyle = "#000"; g.textAlign = "center"; g.font = FONT(800, 36); g.fillText("Wikipédia", 320, 200); g.font = FONT(400, 20); g.fillText("A enciclopédia livre", 320, 240); g.fillStyle = "#3a6ea5"; g.fillText("nasceu em janeiro de 2001", 320, 300); g.beginPath(); g.arc(320, 380, 40, 0, 7); g.strokeStyle = "#555"; g.lineWidth = 4; g.stroke(); });
  else if (mode === "future") browser(g, "celular com tela de toque?", () => { g.fillStyle = "#fff"; g.fillRect(22, 98, 596, 380); g.fillStyle = "#000"; g.textAlign = "center"; g.font = FONT(800, 30); g.fillText("Tela de toque + aplicativos", 320, 190); g.fillStyle = "#d8333a"; g.font = FONT(900, 90); g.fillText("2007", 320, 320); g.fillStyle = "#555"; g.font = FONT(400, 20); g.fillText("(daqui a uns 6 anos)", 320, 370); });
  else if (mode === "site") { // the generated site, elements pop in
    win98(g, W, H, "Meu Site - Navegador", "#fff8ec");
    const s = (k) => t > k;
    g.fillStyle = "#e5483b"; g.fillRect(22, 58, 596, 70); g.fillStyle = "#fff"; g.font = FONT(900, 32); g.fillText("Meu Site", 40, 104);
    if (s(opt.menu ?? 0)) { g.fillStyle = "#241726"; g.fillRect(22, 128, 596, 34); g.fillStyle = "#fff"; g.font = FONT(700, 18); g.fillText("Início    Fotos    Contato", 40, 151); }
    if (s(opt.fotos ?? 0)) for (let i = 0; i < 3; i++) { g.fillStyle = ["#3f7fbf", "#2f9a5a", "#f2c230"][i]; g.fillRect(40 + i * 190, 180, 170, 120); g.fillStyle = "#fff"; g.beginPath(); g.arc(90 + i * 190, 220, 16, 0, 7); g.fill(); }
    if (s(opt.form ?? 0)) { g.fillStyle = "#241726"; g.font = FONT(800, 20); g.fillText("Contato", 40, 340); g.fillStyle = "#fff"; g.strokeStyle = "#999"; g.fillRect(40, 352, 380, 30); g.strokeRect(40, 352, 380, 30); g.fillRect(40, 392, 380, 30); g.strokeRect(40, 392, 380, 30); g.fillStyle = "#2fb36a"; g.fillRect(440, 392, 150, 30); g.fillStyle = "#fff"; g.fillText("Enviar", 478, 414); }
    if (s(opt.ok ?? 99)) { g.fillStyle = "#2fb36a"; g.font = FONT(900, 26); g.fillText("✓ Tudo funcionando", 330, 345); }
  } else if (mode === "upload") {
    win98(g, W, H, "Enviando arquivos...", "#c0c0c0");
    g.fillStyle = "#000"; g.font = FONT(700, 22); g.fillText("Enviando site para o servidor", 50, 130);
    const pct = opt.pct ?? 40; g.fillStyle = "#fff"; g.fillRect(50, 170, 540, 44); g.strokeStyle = "#808080"; g.strokeRect(50, 170, 540, 44);
    for (let i = 0; i < Math.floor(pct / 4); i++) { g.fillStyle = "#0a246a"; g.fillRect(56 + i * 21.4, 176, 17, 32); }
    g.fillStyle = "#000"; g.font = FONT(800, 40); g.fillText(Math.round(pct) + "%", 50, 280);
    g.font = FONT(400, 20); g.fillText("Velocidade: 3,2 KB/s", 50, 330); g.fillText("Tempo restante: 4 horas e 31 minutos", 50, 362);
  } else if (mode === "lost") {
    drawCRT("upload", t, { pct: 40 });
    g.fillStyle = "#c0c0c0"; g.fillRect(110, 150, 420, 210); g.strokeStyle = "#000"; g.lineWidth = 3; g.strokeRect(110, 150, 420, 210);
    g.fillStyle = "#0a246a"; g.fillRect(113, 153, 414, 32); g.fillStyle = "#fff"; g.font = FONT(700, 18); g.fillText("Erro de conexão", 122, 176);
    g.fillStyle = "#d8333a"; g.beginPath(); g.arc(170, 250, 30, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = FONT(900, 40); g.fillText("X", 156, 265);
    g.fillStyle = "#000"; g.font = FONT(700, 22); g.fillText("A conexão caiu.", 220, 245); g.font = FONT(400, 18); g.fillText("Linha telefônica ocupada.", 220, 275);
    g.fillStyle = "#c0c0c0"; g.strokeStyle = "#000"; g.strokeRect(280, 310, 90, 32); g.fillStyle = "#000"; g.fillText("OK", 310, 333);
  } else if (mode === "forum") {
    browser(g, "forum.programacao.com.br", () => {
      g.fillStyle = "#eef2f7"; g.fillRect(22, 98, 596, 380);
      const posts = [["TUTORIAL: aprenda a programar do zero - parte " + (opt.part ?? 1), "#0a246a"], ["re: valeu demais!! aprendi em 1 dia", "#333"], ["re: posta a parte 2 por favor", "#333"], ["re: obrigado, cara. de graça ainda!", "#333"], ["re: mostrei pro meu irmão, ele amou", "#333"]];
      const n = Math.min(posts.length, 1 + Math.floor(t * 2));
      for (let i = 0; i < n; i++) { g.fillStyle = "#fff"; g.fillRect(36, 112 + i * 70, 568, 58); g.strokeStyle = "#c3cbd6"; g.strokeRect(36, 112 + i * 70, 568, 58);
        g.fillStyle = posts[i][1]; g.font = FONT(i ? 400 : 800, i ? 18 : 19); g.fillText(posts[i][0], 50, 147 + i * 70); }
    });
  } else if (mode === "tutorial") {
    win98(g, W, H, "aula_" + (opt.part ?? 1) + ".txt - Bloco de Notas");
    g.fillStyle = "#000"; g.font = MONO(700, 20);
    ["AULA " + (opt.part ?? 1) + ": O QUE É PROGRAMAR", "", "Programar é dar instruções", "para o computador, passo a passo.", "", "Exemplo:", "   print('Olá, mundo!')", "", "Exercício: mude a mensagem."].forEach((l, i) => g.fillText(l, 36, 92 + i * 32));
  } else if (mode === "news2001") { // dot-com crash chart
    win98(g, W, H, "Notícias - Economia");
    g.fillStyle = "#000"; g.font = FONT(900, 28); g.fillText("BOLHA DA INTERNET ESTOURA", 36, 100); g.font = FONT(400, 18); g.fillText("Empresas .com quebram uma atrás da outra", 36, 130);
    g.strokeStyle = "#ccc"; g.lineWidth = 1; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(40, 170 + i * 60); g.lineTo(600, 170 + i * 60); g.stroke(); }
    const pts = [[40, 200], [120, 170], [200, 185], [260, 230], [330, 300], [400, 340], [470, 390], [540, 420], [600, 440]]; const n = Math.min(pts.length, 2 + Math.floor(t * 4));
    g.strokeStyle = "#d8333a"; g.lineWidth = 6; g.beginPath(); pts.slice(0, n).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
  } else if (mode === "profit") {
    win98(g, W, H, "Meus Clientes - Faturamento");
    g.fillStyle = "#000"; g.font = FONT(900, 26); g.fillText("Padaria  •  Lan house  •  Loja 1,99", 36, 100);
    const bars = [80, 120, 170, 230, 300]; const n = Math.min(bars.length, 1 + Math.floor(t * 3));
    for (let i = 0; i < n; i++) { g.fillStyle = "#2fb36a"; g.fillRect(70 + i * 105, 450 - bars[i], 70, bars[i]); }
    g.fillStyle = "#2fb36a"; g.font = FONT(900, 34); if (n >= 5) g.fillText("LUCRO ↑", 430, 150);
  }
  if (opt.scan !== false) { g.fillStyle = "rgba(0,0,0,0.08)"; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2); }
  crtTex.needsUpdate = true;
}
// ---- TV news (reuse tvC, 256x192 -> draw at 2x via scale) ----
const tv2C = cvs(512, 384); const tv2Tex = P.tex(tv2C[0], false);
function drawTV(mode, t, opt = {}) {
  const g = tv2C[1], W = 512, H = 384;
  if (mode === "static") { drawStatic(Math.floor(t * 30), 1); g.drawImage(tvC[0], 0, 0, W, H); tv2Tex.needsUpdate = true; return; }
  g.fillStyle = "#14325c"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#1e4a86"; g.fillRect(0, 0, W, 260);
  // anchor silhouette (generic)
  g.fillStyle = "#2b2b33"; g.beginPath(); g.ellipse(150, 260, 80, 70, 0, Math.PI, 0); g.fill(); g.fillStyle = "#e8b48e"; g.beginPath(); g.arc(150, 150, 46, 0, 7); g.fill();
  g.fillStyle = "#3a2a20"; g.beginPath(); g.arc(150, 136, 48, Math.PI, 0); g.fill();
  // bulb icon (energy)
  g.fillStyle = Math.floor(t * 2) % 2 ? "#ffd23f" : "#c9a020"; g.beginPath(); g.arc(380, 120, 50, 0, 7); g.fill(); g.fillStyle = "#888"; g.fillRect(360, 168, 40, 30);
  g.strokeStyle = "#d8333a"; g.lineWidth = 12; g.beginPath(); g.moveTo(320, 60); g.lineTo(440, 200); g.stroke();
  g.fillStyle = "#d8333a"; g.fillRect(0, 262, W, 40); g.fillStyle = "#fff"; g.font = FONT(900, 28); g.textAlign = "left"; g.fillText("PLANTÃO", 14, 292);
  g.fillStyle = "#f4f1ea"; g.fillRect(0, 302, W, 82); g.fillStyle = "#14325c"; g.font = FONT(900, opt.multa ? 28 : 32);
  g.fillText(opt.multa ? "GASTOU DEMAIS? PAGA MULTA" : "APAGÃO: BRASIL RACIONA ENERGIA", 14, 352);
  g.fillStyle = "rgba(0,0,0,0.1)"; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
  tv2Tex.needsUpdate = true;
}

// =====================================================================
// Hand-held insert props (placed per shot): brick phone, smartphone, newspaper, notebook page
// =====================================================================
const brickC = cvs(240, 180); const brickTex = P.tex(brickC[0], false);
function drawSnake(t) {
  const g = brickC[1]; g.fillStyle = "#9fc27a"; g.fillRect(0, 0, 240, 180);
  g.fillStyle = "#1f2a12"; g.font = MONO(700, 16); g.textAlign = "left"; g.fillText("PONTOS: " + Math.floor(t * 4) * 5, 10, 22);
  g.strokeStyle = "#1f2a12"; g.lineWidth = 3; g.strokeRect(6, 30, 228, 144);
  const n = 14, head = Math.floor(t * 8);
  for (let i = 0; i < n; i++) { const k = head - i; const x = 20 + ((k * 12) % 200 + 200) % 200, y = 80 + (Math.floor(k / 17) % 3) * 24; g.fillStyle = "#1f2a12"; g.fillRect(x, y, 10, 10); }
  g.fillRect(150, 140, 10, 10);
  brickTex.needsUpdate = true;
}
const BRICK = new THREE.Group(); scene.add(BRICK); BRICK.visible = false;
{ tbox(0.06, 0.14, 0.03, toon(0x3d4a5c), 0, -0.07, 0, BRICK);
  add(new THREE.PlaneGeometry(0.042, 0.032), new THREE.MeshBasicMaterial({ map: brickTex }), 0, 0.03, 0.0155, BRICK);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) tbox(0.012, 0.007, 0.004, toon(0x9aa3ad), -0.016 + k * 0.016, -0.06 - r * 0.012, 0.015, BRICK);
  tbox(0.008, 0.03, 0.008, toon(0x2a2e36), 0.018, 0.07, 0, BRICK); }
const smartC = cvs(360, 720); const smartTex = P.tex(smartC[0], false);
function drawSmart(t) {
  const g = smartC[1]; g.fillStyle = "#fff"; g.fillRect(0, 0, 360, 720);
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 360, 70); g.fillStyle = "#fff"; g.font = FONT(800, 24); g.textAlign = "left"; g.fillText("Notícias", 20, 46);
  g.fillStyle = "#e5483b"; g.font = FONT(900, 15); g.fillText("TECNOLOGIA • 2026", 20, 110);
  g.fillStyle = "#111"; g.font = FONT(900, 30);
  ["Inteligências", "artificiais", "aprendem lendo", "a internet"].forEach((l, i) => g.fillText(l, 20, 160 + i * 38));
  g.fillStyle = "#555"; g.font = FONT(400, 19);
  ["Bilhões de páginas: tutoriais,", "códigos e respostas em fóruns", "escritos por pessoas ao longo", "de décadas..."].forEach((l, i) => g.fillText(l, 20, 340 + i * 28));
  g.fillStyle = "#dfe6ee"; g.fillRect(20, 470, 320, 180); g.fillStyle = "#3f6fb5"; for (let i = 0; i < 18; i++) { g.beginPath(); g.arc(50 + (i % 6) * 52, 500 + Math.floor(i / 6) * 55, 9, 0, 7); g.fill(); }
  smartTex.needsUpdate = true;
}
const SMART = new THREE.Group(); scene.add(SMART); SMART.visible = false;
{ tbox(0.075, 0.155, 0.008, toon(0x14161c), 0, -0.0775, 0, SMART);
  add(new THREE.PlaneGeometry(0.068, 0.145), new THREE.MeshBasicMaterial({ map: smartTex }), 0, 0, 0.0045, SMART); }
const paperC = cvs(600, 800); const paperTex = P.tex(paperC[0], false); let paperMode = "";
function drawPaper(mode) {
  if (mode === paperMode) return; paperMode = mode; const g = paperC[1];
  if (mode === "fiado") {
    g.fillStyle = "#f6f0dc"; g.fillRect(0, 0, 600, 800); g.strokeStyle = "#9cc0e0"; g.lineWidth = 2; for (let y = 120; y < 800; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(600, y); g.stroke(); }
    g.strokeStyle = "#e08a8a"; g.beginPath(); g.moveTo(80, 0); g.lineTo(80, 800); g.stroke();
    g.fillStyle = "#1f3a8a"; g.font = `italic 700 54px "DejaVu Serif", serif`; g.textAlign = "left"; g.fillText("FIADO", 120, 90);
    g.font = `italic 400 34px "DejaVu Serif", serif`;
    ["D. Maria - 3 pães, 1 leite", "Seu João - bolo de fubá", "Zé da oficina - 10 pães", "Estoque: farinha 4 sacos", "Luz: R$ 87,40 (!!)", "Tia Cida - 2 sonhos"].forEach((l, i) => g.fillText(l, 100, 160 + i * 96));
  } else if (mode === "jornal") {
    g.fillStyle = "#efe9da"; g.fillRect(0, 0, 600, 800); g.fillStyle = "#111"; g.textAlign = "center";
    g.font = `900 64px "DejaVu Serif", serif`; g.fillText("O BAIRRO", 300, 80); g.fillRect(30, 100, 540, 4);
    g.font = FONT(900, 52); ["O PROGRAMADOR", "MAIS RÁPIDO", "DO BRASIL"].forEach((l, i) => g.fillText(l, 300, 190 + i * 62));
    g.fillStyle = "#777"; g.fillRect(60, 400, 230, 260); g.fillStyle = "#3f6fb5"; g.beginPath(); g.arc(175, 500, 60, 0, 7); g.fill();
    g.fillStyle = "#555"; for (let i = 0; i < 12; i++) g.fillRect(320, 410 + i * 22, 230 - (i % 3) * 30, 10);
  }
  paperTex.needsUpdate = true;
}
const PAPER = add(new THREE.PlaneGeometry(0.3, 0.4), new THREE.MeshToonMaterial({ map: paperTex, gradientMap: gradMap, side: THREE.DoubleSide }), 0, -50, 0); PAPER.visible = false;
// CDs stack (on the bed, next to the laptop)
const CDS = [];
for (let i = 0; i < 24; i++) { const g = new THREE.Group(); g.position.set(-0.15 + (i % 3) * 0.0, 0.75 + i * 0.012, -1.0 + 0); scene.add(g);
  add(new THREE.CylinderGeometry(0.06, 0.06, 0.008, 24), toon([0xd9dde2, 0xf2c230, 0x5684c4][i % 3]), 0, 0, 0, g); g.visible = false; CDS.push(g); }

// =====================================================================
// Living room with a wall phone (mom) — x = -60
// =====================================================================
const SX = -60;
{ plane(6, 6, toon(0xffffff, P.tiles("#b9a07a", "#a88e68")), SX, 0.001, 0, -Math.PI / 2, 0, scene, 1.6);
  const wm = toon(0xffffff, wallPaint("#e6c98f")); tbox(6, 2.7, 0.15, wm, SX, 0, -1.6); tbox(0.15, 2.7, 6, wm, SX - 2.6, 0, 0);
  const sofa = toon(0x7a4a5a); tbox(1.8, 0.45, 0.8, sofa, SX - 1.3, 0, -1.1); tbox(1.8, 0.5, 0.2, sofa, SX - 1.3, 0.45, -1.45);
  // wall phone
  const ph = new THREE.Group(); ph.position.set(SX + 0.9, 1.35, -1.52); scene.add(ph);
  tbox(0.2, 0.28, 0.08, toon(0xe6dcc0), 0, -0.14, 0, ph);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) tbox(0.035, 0.025, 0.01, toon(0xf8f4ea), -0.045 + k * 0.045, -0.02 - r * 0.045, 0.045, ph);
  add(new THREE.PlaneGeometry(0.55, 0.42), new THREE.MeshToonMaterial({ map: poster(0), gradientMap: gradMap }), SX - 1.2, 1.7, -1.52);
  tbox(0.5, 0.9, 0.4, toon(0x8a5d3a), SX + 2.0, 0, -1.3); add(new THREE.SphereGeometry(0.25, 12, 8), toon(0x2f8f5a), SX + 2.0, 1.15, -1.3);
}
const momL = new THREE.PointLight(0xffd7a8, 6, 8, 1.4); momL.position.set(SX + 0.5, 2.3, 1.0); scene.add(momL);

// =====================================================================
// Street with the shops — x = 100 (shops along x, facing +z)
// =====================================================================
const TX0 = 100;
const SHOPS = [["PADARIA", "#f2c230", "#8a4a26"], ["LAN HOUSE", "#2fb3e0", "#1d2a4a"], ["LOJA 1,99", "#e5483b", "#fff3c4"], ["AUTOESCOLA", "#2f9a5a", "#ffffff"]];
{ plane(80, 30, toon(0xffffff, P.asphalt()), TX0 + 15, 0.002, 6, -Math.PI / 2, 0, scene, 4);
  tbox(80, 0.15, 4, toon(0xffffff, P.tiles("#c9c3b4", "#b8b2a3")), TX0 + 15, 0, -4, scene, 1.2);
  SHOPS.forEach(([name, bg, fg], i) => {
    const x = TX0 + i * 10, wm = toon(0xffffff, P.plaster(["#e8d8b0", "#c9d6e6", "#f0c9b8", "#d6e6c9"][i], { cracks: 1 }));
    tbox(9.6, 4.6, 1, wm, x, 0, -6.5);
    add(new THREE.PlaneGeometry(6.5, 1.2), new THREE.MeshToonMaterial({ map: P.signText([name], { size: 120, bg, fg }), gradientMap: gradMap }), x, 3.6, -5.98);
    plane(1.4, 2.3, toon(0x2a2e36), x - 2.6, 1.15, -5.99);
    plane(3.6, 1.8, glow(0xcfe6ff, 0.9), x + 1.2, 1.4, -5.99);
    tbox(4.2, 0.1, 1.2, toon(0xffffff, P.planks(bg, { n: 6, vertical: true })), x + 1.2, 2.55, -5.4).rotation.x = 0.3;
  });
  // orelhão (public phone hood)
  const o = new THREE.Group(); o.position.set(TX0 + 4.8, 0, -3.4); scene.add(o);
  add(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), toon(0x6a6a6a), 0, 1.1, -0.2, o);
  const hood = add(new THREE.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), toon(0xf08a2c, null, { side: THREE.DoubleSide }), 0, 2.15, 0.05, o); hood.scale.set(1, 1.2, 0.9);
  tbox(0.2, 0.32, 0.12, toon(0x8a8f96), 0, 1.25, -0.14, o);
  for (let i = 0; i < 4; i++) { const tx = TX0 - 4 + i * 11; add(new THREE.CylinderGeometry(0.12, 0.16, 2.2, 8), toon(0x6b4a2e), tx + 0.6, 1.1, -5.4); add(new THREE.SphereGeometry(0.8, 14, 10), toon(0x3f8a3a), tx + 0.6, 2.6, -5.4); }
}
// =====================================================================
// Bakery interior — x = 200
// =====================================================================
const BX = 200; let BAKERY_PC;
const bakC = cvs(400, 300); const bakTex = P.tex(bakC[0], false);
function drawBakPC(on, t) { const g = bakC[1];
  if (!on) { g.fillStyle = "#0b0f14"; g.fillRect(0, 0, 400, 300); bakTex.needsUpdate = true; return; }
  g.fillStyle = "#3a6ea5"; g.fillRect(0, 0, 400, 300); g.fillStyle = "#c0c0c0"; g.fillRect(10, 10, 380, 280); g.fillStyle = "#0a246a"; g.fillRect(14, 14, 372, 26);
  g.fillStyle = "#fff"; g.font = FONT(700, 15); g.textAlign = "left"; g.fillText("Padaria - Sistema de Fiado", 22, 33);
  g.fillStyle = "#fff"; g.fillRect(18, 48, 364, 234); g.fillStyle = "#000"; g.font = MONO(700, 15);
  [["CLIENTE", "DEVE"], ["D. Maria", "R$ 4,50"], ["Seu João", "R$ 6,00"], ["Zé da oficina", "R$ 12,00"], ["Tia Cida", "R$ 3,00"]].forEach(([a, b], i) => { g.fillText(a, 30, 75 + i * 34); g.fillText(b, 270, 75 + i * 34); });
  g.fillStyle = "#2fb36a"; g.fillRect(30, 245, 160, 28); g.fillStyle = "#fff"; g.fillText("ESTOQUE OK", 48, 265);
  bakTex.needsUpdate = true; }
{ plane(8, 8, toon(0xffffff, P.tiles("#d9cfc0", "#c4b8a6")), BX, 0.001, 0, -Math.PI / 2, 0, scene, 1.4);
  const wm = toon(0xffffff, P.tiles("#f2efe6", "#e4dfd2")); tbox(8, 2.9, 0.15, wm, BX, 0, -2.4, scene, 0.9); tbox(0.15, 2.9, 8, wm, BX - 3.6, 0, 0, scene, 0.9); tbox(0.15, 2.9, 8, wm, BX + 3.6, 0, 0, scene, 0.9);
  // bread shelves on the back wall
  const wood = toon(0xffffff, P.planks("#8a5d3a", { n: 3 }));
  for (const y of [0.9, 1.4, 1.9]) { tbox(4.5, 0.05, 0.4, wood, BX, y, -2.15); for (let i = 0; i < 9; i++) { const b = add(new THREE.SphereGeometry(0.13, 10, 8), toon([0xd8a35a, 0xc98a42, 0xe3b874][i % 3]), BX - 2 + i * 0.5, y + 0.1, -2.12); b.scale.set(1.4, 0.7, 0.9); } }
  // counter with glass display
  tbox(3.6, 1.0, 0.7, toon(0xffffff, P.planks("#a0784e", { n: 4, vertical: true })), BX, 0, -0.7);
  tbox(3.7, 0.05, 0.8, toon(0xe8e2d4), BX, 1.0, -0.7);
  for (let i = 0; i < 6; i++) { const b = add(new THREE.SphereGeometry(0.09, 10, 8), toon(0xf0c9a0), BX - 1.2 + i * 0.25, 1.1, -0.6); b.scale.set(1.3, 0.8, 1); }
  // old beige PC on the counter (screen faces +z)
  const pc = new THREE.Group(); pc.position.set(BX + 1.2, 1.05, -0.85); pc.rotation.y = -0.3; scene.add(pc);
  tbox(0.42, 0.36, 0.38, toon(0xe2d9c2), 0, 0, 0, pc);
  add(new THREE.PlaneGeometry(0.32, 0.24), new THREE.MeshBasicMaterial({ map: bakTex }), 0, 0.19, 0.192, pc);
  BAKERY_PC = pc;
  add(new THREE.PlaneGeometry(1.4, 0.5), new THREE.MeshToonMaterial({ map: P.signText(["PÃO QUENTINHO"], { size: 70, w: 1024, h: 300, bg: "#8a4a26", fg: "#f2c230" }), gradientMap: gradMap }), BX, 2.45, -2.3);
}
const bakL = new THREE.PointLight(0xffd7a0, 10, 10, 1.3); bakL.position.set(BX, 2.6, 0.8); scene.add(bakL);
// =====================================================================
// Office (investor / dev team) — x = 300
// =====================================================================
const OX = 300; const MUGS = []; let AC_FLAP;
{ plane(9, 9, toon(0xffffff, P.tiles("#4a5a6e", "#465568")), OX, 0.001, 0, -Math.PI / 2, 0, scene, 3);
  const wm = toon(0xffffff, wallPaint("#c9d2dc")); tbox(9, 2.9, 0.15, wm, OX, 0, -2.6); tbox(0.15, 2.9, 9, wm, OX - 4, 0, 0); tbox(0.15, 2.9, 9, wm, OX + 4, 0, 0);
  // window with city
  plane(2.6, 1.4, glow(0x9fc6ea), OX - 1.8, 1.65, -2.51); for (let i = 0; i < 8; i++) { const h = 0.3 + (i * 37 % 7) / 10; plane(0.25, h, glow(0x6f8fb5), OX - 2.95 + i * 0.32, 0.95 + h / 2, -2.5); }
  // big desk
  const wood = toon(0xffffff, P.planks("#5a3a22", { n: 4 }));
  tbox(2.2, 0.08, 1.0, wood, OX + 0.6, 0.75, -1.0); tbox(2.2, 0.75, 0.08, wood, OX + 0.6, 0, -0.55);
  tbox(0.6, 1.1, 0.6, toon(0x1d1f26), OX + 0.6, 0, -1.9); // investor chair
  tbox(0.5, 0.5, 0.5, toon(0x1d1f26), OX + 0.6, 0, 0.35); // visitor chair
  // air conditioner on the wall
  const ac = new THREE.Group(); ac.position.set(OX + 2.4, 2.25, -2.45); scene.add(ac);
  tbox(1.0, 0.32, 0.25, toon(0xf2f2f2), 0, 0, 0, ac);
  AC_FLAP = tbox(0.9, 0.03, 0.08, toon(0xd0d0d0), 0, 0.02, 0.15, ac);
  // team table with coffee mugs
  tbox(1.2, 0.05, 1.2, wood, OX - 2.0, 0.72, 0.4); add(new THREE.CylinderGeometry(0.08, 0.1, 0.72, 10), toon(0x2b2b33), OX - 2.0, 0.36, 0.4);
  for (let i = 0; i < 12; i++) { const m = add(new THREE.CylinderGeometry(0.05, 0.045, 0.1, 12), toon([0xffffff, 0xd8333a, 0xf2c230, 0x3f6fb5][i % 4]), OX - 2.4 + (i % 4) * 0.25, 0.8 + Math.floor(i / 4) * 0.11, 0.2 + (i % 3) * 0.15); m.visible = false; MUGS.push(m); }
  for (let i = 0; i < 5; i++) tbox(0.3, 0.02, 0.22, toon(0xf8f8f8), OX - 1.8 + (i % 2) * 0.05, 0.75 + i * 0.02, 0.6);
  add(new THREE.SphereGeometry(0.3, 12, 8), toon(0x2f8f5a), OX + 3.3, 1.0, -2.0); tbox(0.4, 0.6, 0.4, toon(0x8a5d3a), OX + 3.3, 0, -2.0);
}
const offL = new THREE.PointLight(0xe8f0ff, 9, 11, 1.3); offL.position.set(OX, 2.6, 1.0); scene.add(offL);
// =====================================================================
// Lan house — x = 400 (row of PCs along x, screens face +z)
// =====================================================================
const LX = 400;
const lanC = cvs(320, 240); const lanTex = P.tex(lanC[0], false);
function drawLan(mode, t) { const g = lanC[1];
  if (mode === "tutorial") { g.fillStyle = "#fff"; g.fillRect(0, 0, 320, 240); g.fillStyle = "#0a246a"; g.fillRect(0, 0, 320, 26); g.fillStyle = "#fff"; g.font = FONT(700, 14); g.textAlign = "left"; g.fillText("aula_1.txt", 8, 18);
    g.fillStyle = "#000"; g.font = MONO(700, 14); ["AULA 1: O QUE É PROGRAMAR", "", "print('Olá, mundo!')", "", "Olá, mundo!"].forEach((l, i) => g.fillText(l, 12, 56 + i * 24)); }
  else { g.fillStyle = "#1a3a1a"; g.fillRect(0, 0, 320, 240); g.fillStyle = "#7dff8a"; g.font = MONO(700, 14); g.textAlign = "left";
    for (let i = 0; i < 9; i++) g.fillText(["> jogo carregando...", "Jogador1 entrou", "Jogador2 entrou", "MAPA: deserto", "Rodada " + (1 + Math.floor(t)), "> /mensagem oi", "Jogador3 saiu", "> pronto", "> ..."][i], 10, 24 + i * 24); }
  lanTex.needsUpdate = true; }
{ plane(10, 8, toon(0xffffff, P.tiles("#3a3f4a", "#343843")), LX, 0.001, 0, -Math.PI / 2, 0, scene, 1.4);
  const wm = toon(0xffffff, wallPaint("#3e4a6a")); tbox(10, 2.8, 0.15, wm, LX, 0, -2.2); tbox(0.15, 2.8, 8, wm, LX - 4.6, 0, 0); tbox(0.15, 2.8, 8, wm, LX + 4.6, 0, 0);
  plane(8, 0.08, glow(0x39d0ff), LX, 2.5, -2.12); // neon strip
  add(new THREE.PlaneGeometry(2.6, 0.7), new THREE.MeshToonMaterial({ map: P.signText(["R$ 1,50 a hora"], { size: 90, bg: "#1d2a4a", fg: "#39d0ff" }), gradientMap: gradMap }), LX + 2.6, 2.0, -2.12);
  tbox(8, 0.05, 0.8, toon(0xffffff, P.planks("#6b5236", { n: 3 })), LX - 0.5, 0.72, -1.6);
  for (let i = 0; i < 6; i++) { const x = LX - 3.6 + i * 1.25;
    tbox(0.42, 0.38, 0.4, toon(0xe2d9c2), x, 0.77, -1.75);
    add(new THREE.PlaneGeometry(0.32, 0.24), new THREE.MeshBasicMaterial({ map: lanTex }), x, 0.97, -1.548);
    tbox(0.4, 0.02, 0.14, toon(0xe2d9c2), x, 0.77, -1.35); }
}
const lanL = new THREE.PointLight(0x9fc6ff, 7, 10, 1.3); lanL.position.set(LX, 2.4, 1.0); scene.add(lanL);
// backpack with the laptop peeking out (office)
const BACKPACK = new THREE.Group(); BACKPACK.position.set(301.05, 0, 0.6); BACKPACK.rotation.y = -0.4; scene.add(BACKPACK);
{ tbox(0.36, 0.42, 0.2, toon(0x2f5f6a), 0, 0, 0, BACKPACK); const flap = tbox(0.37, 0.05, 0.22, toon(0x24484f), 0, 0.42, 0, BACKPACK);
  const lap = tbox(0.3, 0.012, 0.2, toon(0x9aa3ad), 0, 0.42, 0.02, BACKPACK); lap.rotation.x = -1.2; lap.position.set(0, 0.47, 0.02);
  add(new THREE.PlaneGeometry(0.2, 0.06), glow(0x7fd6ff), 0, 0.5, 0.115, BACKPACK); }
// desk chair in the bedroom (hero sits at the desk)
tbox(0.45, 0.45, 0.45, toon(0x3a3c44), -1.3, 0, 0.9);
