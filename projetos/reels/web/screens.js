// Screen contents for the phone (540x1080), the monitors (1024x600) and the TV (960x540). All names and apps are fictional.
const F = (w, s) => `${w} ${s}px "DejaVu Sans", Arial, sans-serif`;
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
let CLK = "23:47";
function status(g, dark = true) { g.fillStyle = dark ? "#e8eaee" : "#1c1f26"; g.font = F(700, 26); g.textAlign = "left"; g.fillText(CLK, 30, 44); g.textAlign = "right"; g.fillText("▮▮▮ 78%", 510, 44); g.textAlign = "left"; }
function photo(g, x, y, w, h, kind) {
  g.save(); rr(g, x, y, w, h, 18); g.clip();
  if (kind === "beach") { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, "#5fb8f0"); gr.addColorStop(0.55, "#bfe8ff"); gr.addColorStop(0.56, "#2bb5c8"); gr.addColorStop(0.75, "#1e9ab0"); gr.addColorStop(0.76, "#f2dca0"); gr.addColorStop(1, "#e8c880"); g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.fillStyle = "#ffe066"; g.beginPath(); g.arc(x + w * 0.78, y + h * 0.2, h * 0.09, 0, 7); g.fill(); g.strokeStyle = "#6a4a2e"; g.lineWidth = 10; g.beginPath(); g.moveTo(x + w * 0.15, y + h); g.quadraticCurveTo(x + w * 0.2, y + h * 0.6, x + w * 0.3, y + h * 0.35); g.stroke();
    g.fillStyle = "#2f8a4a"; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(x + w * 0.3 + Math.cos(k * 1.3) * 40, y + h * 0.35 + Math.sin(k * 1.3) * 16, 50, 12, k * 1.3, 0, 7); g.fill(); } }
  else if (kind === "bag") { g.fillStyle = "#f4e8e0"; g.fillRect(x, y, w, h); g.fillStyle = "#c9a24a"; rr(g, x + w * 0.25, y + h * 0.35, w * 0.5, h * 0.45, 20); g.fill(); g.strokeStyle = "#8a6a2a"; g.lineWidth = 10; g.beginPath(); g.arc(x + w / 2, y + h * 0.36, w * 0.15, Math.PI, 0); g.stroke(); }
  else if (kind === "car") { g.fillStyle = "#cfd8e0"; g.fillRect(x, y, w, h); g.fillStyle = "#9aa2aa"; g.fillRect(x, y + h * 0.7, w, h * 0.3); g.fillStyle = "#e5483b"; rr(g, x + w * 0.12, y + h * 0.42, w * 0.76, h * 0.22, 20); g.fill(); rr(g, x + w * 0.28, y + h * 0.28, w * 0.42, h * 0.18, 30); g.fill(); g.fillStyle = "#1c2230"; for (const cx of [0.28, 0.72]) { g.beginPath(); g.arc(x + w * cx, y + h * 0.65, h * 0.07, 0, 7); g.fill(); } }
  else if (kind === "clothes") { g.fillStyle = "#e8e0f0"; g.fillRect(x, y, w, h); for (let k = 0; k < 3; k++) { g.fillStyle = ["#e5487a", "#2d6fd0", "#f2c230"][k]; rr(g, x + w * (0.12 + k * 0.28), y + h * 0.4, w * 0.22, h * 0.4, 12); g.fill(); g.fillStyle = "#2a2a30"; g.fillRect(x + w * (0.18 + k * 0.28), y + h * 0.34, w * 0.1, h * 0.08); } }
  g.restore();
}
export function phone(g, mode, t, s) {
  CLK = s.clock || "23:47";
  const dark = !["feed", "chat", "stories", "noreply", "alert"].includes(mode);
  g.fillStyle = dark ? "#14161c" : "#f6f6f8"; g.fillRect(0, 0, 540, 1080); status(g, dark);
  g.textAlign = "center";
  if (mode === "lock") { g.fillStyle = "#e8eaee"; g.font = F(200, 150); g.fillText("23:47", 270, 330); }
  else if (mode === "fatura" || mode === "bill2") {
    g.fillStyle = "#6a2ad0"; g.fillRect(0, 70, 540, 150); g.fillStyle = "#fff"; g.font = F(800, 40); g.fillText("Meu Banco", 270, 165);
    const rows = mode === "fatura" ? [["Fatura do cartão", "R$ 4.380,00", "VENCIDA"], ["Mensalidade faculdade", "3 atrasadas", "R$ 2.970,00"]] : [["Parcela do carro", "R$ 1.890,00", "VENCE AMANHÃ"], ["Fatura das viagens", "R$ 3.240,00", "VENCE EM 3 DIAS"]];
    rows.forEach(([a, b, c], i) => { const y = 280 + i * 330; g.fillStyle = "#1f232c"; rr(g, 30, y, 480, 290, 26); g.fill(); g.fillStyle = "#aab0bc"; g.font = F(700, 30); g.fillText(a, 270, y + 60); g.fillStyle = "#ffffff"; g.font = F(900, 66); g.fillText(b, 270, y + 150); g.fillStyle = "#ff4d4d"; rr(g, 120, y + 190, 300, 60, 30); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 28); g.fillText(c, 270, y + 230); }); }
  else if (mode === "feed") { const off = -(s.scroll ?? 0) * 900;
    g.fillStyle = "#1c1f26"; g.font = F(900, 40); g.fillText("Fotogram", 270, 120);
    [["beach", "Cancún, México"], ["bag", "Presente pra mim"], ["car", "Nova conquista"]].forEach(([k, cap], i) => { const y = 160 + i * 620 + off; if (y > 1080 || y < -620) return;
      g.fillStyle = "#e5487a"; g.beginPath(); g.arc(70, y + 40, 30, 0, 7); g.fill(); g.textAlign = "left"; g.fillStyle = "#1c1f26"; g.font = F(800, 28); g.fillText("bia.lux", 115, y + 50); photo(g, 20, y + 90, 500, 430, k);
      g.font = F(600, 26); g.fillText("❤ 2.341   " + cap, 30, y + 565); g.textAlign = "center"; }); }
  else if (mode === "chat" || mode === "noreply") {
    g.fillStyle = "#1f8a6a"; g.fillRect(0, 60, 540, 110); g.fillStyle = "#fff"; g.font = F(800, 36); g.textAlign = "left"; g.fillText(s.name || "Bia", 110, 132); g.fillStyle = "#e5487a"; g.beginPath(); g.arc(65, 118, 30, 0, 7); g.fill();
    if (mode === "noreply") { g.fillStyle = "#cfe8df"; g.font = F(500, 22); g.fillText(s.sub ?? "visto por último há 9 dias", 110, 160); }
    let y = 220; for (const [side, txt] of s.msgs || []) { const fs = s.big === false ? 28 : 36; g.font = F(700, fs); const w = Math.min(500, g.measureText(txt).width + 56); const x = side === "me" ? 520 - w : 20;
      g.fillStyle = side === "me" ? "#d8f8c8" : "#ffffff"; rr(g, x, y, w, fs * 2.7, 22); g.fill(); g.strokeStyle = "#d0d4dc"; g.lineWidth = 2; g.stroke(); g.fillStyle = "#1c1f26"; g.fillText(txt, x + 24, y + fs * 1.55, w - 44);
      if (side === "me") { g.fillStyle = mode === "noreply" ? "#9aa2ae" : "#3aa0e8"; g.font = F(700, 20); g.fillText(mode === "noreply" ? "✓" : "✓✓", x + w - 40, y + fs * 2.45); } y += fs * 3.1; }
    if (mode === "noreply") { g.fillStyle = "#fff2f2"; rr(g, 40, 860, 460, 120, 20); g.fill(); g.fillStyle = "#c0392b"; g.font = F(800, 28); g.textAlign = "center"; g.fillText("Este número não existe", 270, 930); }
    g.textAlign = "center"; }
  else if (mode === "pix") { const k = Math.min(1, (s.k ?? 1));
    g.fillStyle = "#e8eaee"; g.font = F(200, 120); g.fillText("02:14", 270, 260);
    g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * -120); g.fillStyle = "#f4f6f8"; rr(g, 30, 340, 480, 300, 30); g.fill();
    g.fillStyle = "#2fb36a"; g.beginPath(); g.arc(110, 420, 42, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 40); g.fillText("$", 110, 434);
    g.textAlign = "left"; g.fillStyle = "#6b7280"; g.font = F(700, 26); g.fillText("Pix recebido", 175, 410); g.fillStyle = "#14161c"; g.font = F(900, 58); g.fillText("R$ 4.870,00", 60, 540); g.fillStyle = "#6b7280"; g.font = F(500, 24); g.fillText("agora", 60, 600); g.restore(); g.textAlign = "center"; }
  else if (mode === "paid") { g.fillStyle = "#6a2ad0"; g.fillRect(0, 70, 540, 150); g.fillStyle = "#fff"; g.font = F(800, 40); g.fillText("Meu Banco", 270, 165);
    [["Fatura do cartão", "PAGA"], ["Dívidas da família", "QUITADAS"]].forEach(([a, b], i) => { const y = 300 + i * 300; g.fillStyle = "#1f232c"; rr(g, 30, y, 480, 250, 26); g.fill(); g.fillStyle = "#aab0bc"; g.font = F(700, 30); g.fillText(a, 270, y + 70); g.fillStyle = "#2fb36a"; g.font = F(900, 70); g.fillText("✓ " + b, 270, y + 170); }); }
  else if (mode === "stories") { photo(g, 0, 0, 540, 1080, s.story || "beach"); g.fillStyle = "rgba(255,255,255,0.85)"; for (let i = 0; i < 4; i++) g.fillRect(20 + i * 128, 24, 118, 6);
    g.textAlign = "left"; const cm = s.comments || []; cm.forEach((c, i) => { const y = 740 + i * 90; g.fillStyle = "rgba(0,0,0,0.55)"; rr(g, 24, y, 30 + c.length * 16, 66, 33); g.fill(); g.fillStyle = "#fff"; g.font = F(700, 28); g.fillText(c, 44, y + 44); }); g.textAlign = "center"; }
  else if (mode === "blocked") { g.fillStyle = "#6a2ad0"; g.fillRect(0, 70, 540, 150); g.fillStyle = "#fff"; g.font = F(800, 40); g.fillText("Meu Banco", 270, 165);
    g.fillStyle = "#ff4d4d"; g.beginPath(); g.arc(270, 420, 110, 0, 7); g.fill(); g.fillStyle = "#fff"; rr(g, 215, 400, 110, 90, 12); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 16; g.beginPath(); g.arc(270, 400, 36, Math.PI, 0); g.stroke();
    g.fillStyle = "#ff4d4d"; g.font = F(900, 52); g.fillText("CONTA", 270, 640); g.fillText("BLOQUEADA", 270, 705); g.fillStyle = "#aab0bc"; g.font = F(600, 26); g.fillText("Por determinação judicial", 270, 770); }
  else if (mode === "pixIn") { const k = Math.min(1, (s.k ?? 1));   // generic incoming Pix notification on the lock screen
    g.fillStyle = "#e8eaee"; g.font = F(200, 120); g.fillText(s.clock || "21:08", 270, 260);
    g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * -120); g.fillStyle = "#f4f6f8"; rr(g, 30, 340, 480, 330, 30); g.fill();
    g.fillStyle = "#2fb36a"; g.beginPath(); g.arc(110, 420, 42, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 40); g.fillText("$", 110, 434);
    g.textAlign = "left"; g.fillStyle = "#6b7280"; g.font = F(700, 26); g.fillText("Pix recebido", 175, 410); g.fillStyle = "#14161c"; g.font = F(900, 62); g.fillText(s.val || "R$ 3.000,00", 60, 540);
    g.fillStyle = "#6b7280"; g.font = F(600, 26); g.fillText("de " + (s.from || "Desconhecido"), 60, 600); g.fillText("agora", 60, 640); g.restore(); g.textAlign = "center"; }
  else if (mode === "alert") { const k = Math.min(1, (s.k ?? 1));       // bank app with a red alert card
    g.fillStyle = "#6a2ad0"; g.fillRect(0, 60, 540, 150); g.fillStyle = "#fff"; g.font = F(800, 40); g.fillText("Meu Banco", 270, 155);
    g.fillStyle = "#14161c"; g.font = F(700, 30); g.fillText("Saldo disponível", 270, 265); g.fillStyle = s.red ? "#e5483b" : "#14161c"; g.font = F(900, 72); g.fillText(s.bal || "R$ 0,00", 270, 345);
    g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 60 - 75); const AC = s.ok ? "#2fb36a" : "#e5483b"; g.fillStyle = s.ok ? "#effaf2" : "#fff0f0"; rr(g, 30, 460, 480, 360, 28); g.fill(); g.strokeStyle = AC; g.lineWidth = 6; g.stroke();
    g.fillStyle = AC; g.beginPath(); g.arc(270, 540, 46, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 60); g.fillText(s.ok ? "✓" : "!", 270, 562);
    (s.lines || ["Pix contestado", "- R$ 3.000,00"]).forEach((l, i) => { g.fillStyle = i === 1 ? AC : "#14161c"; let fz = i === 1 ? 60 : 40; g.font = F(900, fz); while (g.measureText(l).width > 430 && fz > 20) { fz -= 2; g.font = F(900, fz); } g.fillText(l, 270, 650 + i * 80); }); g.restore(); }
  else if (mode === "call") {                                          // incoming call
    g.fillStyle = "#1a1d26"; g.fillRect(0, 0, 540, 1080); g.fillStyle = "#aab0bc"; g.font = F(600, 30); g.fillText("chamada recebida", 270, 220);
    g.fillStyle = "#fff"; g.font = F(800, 52); g.fillText(s.name || "Banco", 270, 300); const pr = 1 + 0.08 * Math.sin(t * 9);
    g.fillStyle = s.avatar || "#6a2ad0"; g.beginPath(); g.arc(270, 500, 110 * pr, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 110); g.fillText((s.name || "B")[0], 270, 540);
    for (const [x, c] of [[140, "#e5483b"], [400, "#2fb36a"]]) { g.fillStyle = c; g.beginPath(); g.arc(x, 880, 64, 0, 7); g.fill(); } g.fillStyle = "#fff"; g.font = F(900, 50); g.fillText("✕", 140, 898); g.fillText("✆", 400, 898); }
  else if (mode === "empty") { g.fillStyle = "#e8eaee"; g.font = F(200, 120); g.fillText("19:02", 270, 260); g.fillStyle = "#7a808c"; g.font = F(600, 32); g.fillText("Nenhuma notificação", 270, 560); }
}
export function monitor(g, mode, t, s) {
  g.fillStyle = "#f4f5f7"; g.fillRect(0, 0, 1024, 600); g.fillStyle = "#e1e4ea"; g.fillRect(0, 0, 1024, 54);
  for (const [x, c] of [[24, "#ff5f57"], [52, "#febc2e"], [80, "#28c840"]]) { g.fillStyle = c; g.beginPath(); g.arc(x, 27, 9, 0, 7); g.fill(); }
  g.textAlign = "left";
  if (mode === "matricula") { g.fillStyle = "#1f3a6a"; g.fillRect(0, 54, 1024, 80); g.fillStyle = "#fff"; g.font = F(800, 34); g.fillText("Portal do Aluno", 40, 106);
    g.fillStyle = "#1c1f26"; g.font = F(800, 40); g.fillText("Trancamento de matrícula", 60, 210); g.fillStyle = "#6b7280"; g.font = F(600, 26); g.fillText("Administração • 3º período", 60, 260);
    const k = s.k ?? 1; g.fillStyle = k > 0.5 ? "#2fb36a" : "#c0392b"; rr(g, 60, 320, 904, 150, 20); g.fill(); g.fillStyle = "#fff"; g.font = F(900, 54); g.textAlign = "center"; g.fillText(k > 0.5 ? "✓ MATRÍCULA TRANCADA" : "CONFIRMAR TRANCAMENTO?", 512, 415); }
  else if (mode === "planilha") { g.fillStyle = "#1f8a4a"; g.fillRect(0, 54, 1024, 60); g.fillStyle = "#fff"; g.font = F(800, 28); g.fillText("contatos_semana.xls", 30, 94);
    const names = ["Jorge Almeida", "Rita de Cássia", "Maria Aparecida Souza", "Antônio Ferreira", "Luiza Martins", "Pedro Henrique", "Carmem Lúcia"];
    names.forEach((n, i) => { const y = 160 + i * 60, hi = s.hi && n.startsWith("Maria"); g.fillStyle = hi ? "#ffe066" : i % 2 ? "#ffffff" : "#eef1f5"; g.fillRect(20, y - 40, 984, 58);
      g.fillStyle = hi ? "#c0392b" : "#1c1f26"; g.font = F(hi ? 900 : 600, 30); g.fillText(n, 40, y); g.fillText(["68", "71", "73", "65", "70", "62", "77"][i] + " anos", 520, y); g.fillText("R$ " + ["3.200", "1.850", "8.400", "2.700", "4.100", "960", "5.300"][i], 760, y);
      g.strokeStyle = "#d0d4dc"; g.lineWidth = 2; g.strokeRect(20, y - 40, 984, 58); }); }
  else if (mode === "processo") { g.fillStyle = "#1f2f5a"; g.fillRect(0, 54, 1024, 70); g.fillStyle = "#fff"; g.font = F(800, 30); g.fillText("Inquérito • Estelionato • 8 meses de investigação", 30, 100);
    ["Transferências rastreadas: 214", "Mensagens apreendidas: 3.902", "Vítimas identificadas: 87"].forEach((l, i) => { g.fillStyle = "#1c1f26"; g.font = F(800, 40); g.fillText(l, 50, 220 + i * 110); }); }
  else if (mode === "vitimas") { g.fillStyle = "#1f2f5a"; g.fillRect(0, 54, 1024, 70); g.fillStyle = "#fff"; g.font = F(800, 30); g.fillText("Processo nº 0031872 • Vítimas", 30, 100);
    ["Jorge Almeida", "Rita de Cássia", "Maria Aparecida Souza", "Antônio Ferreira", "Luiza Martins"].forEach((n, i) => { const y = 190 + i * 75, hi = n.startsWith("Maria") && s.hi; if (hi) { g.fillStyle = "#ffe066"; g.fillRect(30, y - 48, 964, 66); } g.fillStyle = hi ? "#c0392b" : "#1c1f26"; g.font = F(hi ? 900 : 700, 38); g.fillText(n, 50, y); }); }
  else { g.fillStyle = "#1c1f26"; g.font = F(800, 40); g.fillText("Área de trabalho", 60, 200); }
}
export function tv(g, mode, t, s, T, OUT) {
  if (mode === "off") { g.fillStyle = "#0c0e12"; g.fillRect(0, 0, 960, 540); return; }
  const gr = g.createLinearGradient(0, 0, 0, 540); gr.addColorStop(0, "#1a3a7a"); gr.addColorStop(1, "#0a1a3a"); g.fillStyle = gr; g.fillRect(0, 0, 960, 540);
  g.fillStyle = "rgba(255,255,255,0.06)"; for (let i = 0; i < 12; i++) g.fillRect(i * 90, 0, 40, 540);
  if (!tv.card) { tv.card = document.createElement("canvas"); tv.card.width = 600; tv.card.height = 1000; tv.key = ""; }
  const key = "sen" + Math.round(t * 4) % 2; if (tv.key !== key) { tv.key = key; const cg = tv.card.getContext("2d"); cg.clearRect(0, 0, 600, 1000); T.bodyFront(new T.Pen(cg), OUT.senhora, { mode: "stand", expr: "pained", seed: 9, headTilt: Math.round(t * 4) % 2 ? 3 : -3 }); }
  g.drawImage(tv.card, 330, 20, 300, 500);
  // tears
  g.fillStyle = "#8fd0ff"; for (const sx of [-1, 1]) { const ph = (t * 1.4) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.ellipse(480 + sx * 34, 150 + ph * 70, 6, 9, 0, 0, 7); g.fill(); } g.globalAlpha = 1;
  g.fillStyle = "#c0392b"; g.fillRect(0, 410, 960, 60); g.fillStyle = "#fff"; g.font = F(900, 34); g.textAlign = "left"; g.fillText("IDOSA PERDE ECONOMIAS EM GOLPE", 24, 452);
  g.fillStyle = "#f4f4f4"; g.fillRect(0, 470, 960, 50); g.fillStyle = "#14161c"; g.font = F(800, 30); g.fillText(s.name ? "Maria Aparecida Souza, 73 anos" : "Dinheiro era para a cirurgia do marido", 24, 506);
  g.fillStyle = "#ffffff"; g.font = F(900, 26); g.fillText("● AO VIVO", 24, 44);
}
