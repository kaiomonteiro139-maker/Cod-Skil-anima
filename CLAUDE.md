# Preferências do usuário para vídeos

- **Legendas são obrigatórias em todo vídeo.** Legenda queimada no vídeo, sincronizada palavra por palavra com a locução
  (1 a 3 palavras por linha, em CAIXA ALTA, branca com contorno escuro, palavra falada destacada em amarelo, no terço inferior).
  Não repetir em legenda um texto que já está escrito na tela (ex.: a tela final de enquete).
- **Entrega:** sempre mandar o vídeo direto no chat (SendUserFile, display "attach") na **versão para celular**:
  H.264 Main 4.1, yuv420p, AAC, faststart, cerca de 10 MB. O usuário não consegue baixar pelo GitHub.
- Idioma: português do Brasil.

# Dois formatos de vídeo

- **"Vídeo POV"** → seguir `docs/ESTILO_POV.md` (resumo abaixo).
- **"Vídeo narrado"** → o formato de "A Última Corrida" (motoboy): um narrador conta a história em "você" e terceira pessoa,
  em desenho animado vertical (personagens 2D de cabeça redonda em mundo 3D com contorno preto), câmera que desliza,
  trilha **bem de fundo** (cerca de 17 dB abaixo da voz, nunca atrapalhando a locução) e efeitos cerca de 10 dB abaixo da voz, legenda palavra por palavra em CAIXA ALTA (palavra falada em amarelo)
  e tela final "VOCÊ FICA OU SAI?" com duas opções, para a votação decidir a próxima parte.
  Segue a skill cartoon-audio-short. Código-base do motoboy: `~/shorts/ultima-corrida` (só existe neste container).

# Vídeos "estilo ilustrado" (história em "você", horizontal, YouTube)

Quando o usuário pedir um vídeo **igual ao "Largando Tudo Para Viver de YouTube"**, ou um vídeo **ilustrado**, seguir `docs/ESTILO_ILUSTRADO.md`:
ilustração 2D com traço grosso e câmera sempre em movimento; personagem fixo (pele branca de boneco e roupa sempre igual);
luz quente do abajur contra luz fria da tela; partículas brancas caindo; narração em "você" a cerca de 165 ppm, começando no quadro 0
e quase sem pausas; trilha cerca de 10 dB abaixo da voz; legenda no rodapé em letras normais (palavra falada em amarelo);
final com pergunta, pedido de inscrição e montagem voltando ao começo.

# Vídeos "estilo POV"

Quando o usuário pedir um vídeo **estilo POV**, seguir o guia em `docs/ESTILO_POV.md`:
- câmera em primeira pessoa, com as mãos do protagonista visíveis, lente grande-angular e balanço de cabeça;
- mundo 3D com sombreamento de desenho e contorno preto, antagonista em 3D;
- só diálogo, sem narrador, com pausas de silêncio, drone que sobe, blecautes e luz piscando;
- legenda em frase inteira: **branca** para o protagonista e **vermelha** para o antagonista;
- tela final "O que você faria?" com opções A e B, "Comenta A ou B ▼" e "a maioria decide o Ep. 02";
- 75–90 s, 1080x1920, 30 fps.
A referência serve só de formato: histórias, personagens e cenários sempre originais.

# Vozes do ElevenLabs usadas
- **A Última Corrida (motoboy):** "James – Professional British Male", estabilidade 59, similaridade 47, modelo v4. Usar a mesma em todas as partes.
- **E se você acordasse em 2001:** Parte A com "Patrick – An engaging audiobook narrator" e Parte B com "Adam – Dominant, Firm" (estabilidade 50, similaridade 75, v4).

# Voz feita pelo Claude (quando o usuário pede)
- Piper pt_BR "cadu" com narração **animada e um pouco rápida**: length-scale ~0.95, frases de destaque com "!",
  pausas curtas, tom 1 semitom acima e brilho leve. Conferir com transcrição se as palavras-chave saem claras
  (ex.: "seguidor" precisou de length-scale 1.0 para não virar "servidor").

# Vídeos "estilo fábula de animais"
Quando o usuário pedir **vídeo de animais**, **fábula** ou igual ao "da cobra e dos 300 ratos", seguir `docs/ESTILO_ANIMAIS.md`:
3D com sombreamento de desenho e contorno preto, bichos simples e fofos (olhos brilhando no escuro), câmera sempre em movimento lento,
corte a cada ~3–4 s; gancho com números ("1 cobra, 300 ratos"), virada por manipulação, escalada com contador ("NOITE 30") e lição no final;
manchete serifada em CAIXA ALTA no topo (palavra-chave em amarelo/vermelho) + legenda palavra por palavra (cinza → branco, chave em amarelo);
narrador grave e rápido (~155 ppm) e trilha quase inaudível (~22–25 dB abaixo da voz); final com "manda pra alguém que…". Vertical 1080x1920.
