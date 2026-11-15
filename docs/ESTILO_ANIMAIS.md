# Estilo "fábula de animais" (referência: reel "A cobra no poço com 300 ratos", @perguntaproceu)

Vídeo analisado frame a frame: 2:30, vertical 720x1280, 30 fps, 41 cortes (um plano a cada ~3,6 s).
Use este guia quando o usuário pedir **vídeo de animais**, **fábula** ou "igual ao da cobra e dos ratos".
A referência serve só de formato: histórias, bichos e cenários sempre originais.

## 1. Estrutura da história (o que prende)
| Parte | Tempo | O que acontece |
|---|---|---|
| Gancho | 0–9 s | Números contra: "UMA cobra, TREZENTOS ratos". Pergunta: "Adivinha quem virou o jantar de quem?" |
| Situação | 9–23 s | Como o animal chegou ali (chuva, caiu no poço, parede lisa). Olhos acendendo no escuro. |
| Virada | 23–42 s | Em vez de força, o animal usa **palavras/manipulação** (faz um discurso, promete algo). |
| Escalada | 42–86 s | A regra vai piorando aos poucos; contador "NOITE 1 → 30 → 60 → 90 → 150". Frase-chave curta repetida ("doente é o outro", "nunca era você… até ser"). |
| Final da fábula | 77–86 s | Imagem forte: o pequeno virou gigante; os últimos agradecem ao vilão. |
| Lição | 86–140 s | A fábula vira lição (no original, lição bíblica com versículos em cartões). |
| Chamado | 140–150 s | Frase para o espectador dizer + "manda pra alguém que…" (gera compartilhamento). Volta ao plano de abertura (fecha o círculo). |

Frases curtíssimas, uma ideia por frase, quase sem pausa (pausas médias de 0,35 s).

## 2. Visual
- **3D com sombreamento de desenho (toon/cel) + contorno preto grosso**, cores chapadas com 2–3 tons, sem texturas realistas.
- Animais **simples e fofos**: cobra = tubo grosso verde com losangos verde-escuros, olho amarelo com pupila de fenda, barriga clara com listras; ratos = cápsulas cinza-azuladas, orelhas grandes lilás, focinho redondo rosa, rabo fino, **olhos amarelos brilhando** no escuro. Muitos ratos (centenas) = multidão instanciada.
- Humanos (parte bíblica) = bonecos "feijão" brancos sem rosto, roupas simples, capacete nos soldados, auréola dourada.
- Cenários: poço de pedra (tijolos azul-acinzentados com contorno), fundo de terra marrom; Éden verde e claro com árvore e maçã vermelha; Jerusalém com tochas quentes; cruz no morro com raios de sol dourados.
- Luz: noite azul fria com névoa leve e brilho (glow) nos olhos; cenas de "lição" quentes e douradas. Fundo levemente desfocado (profundidade de campo) e um pouco de névoa entre os planos.
- Textura: limpa, sem granulação; leve brilho (bloom) nas luzes.

## 3. Câmera e movimento
- **Sempre em movimento lento**: empurrão (push-in) suave, leve giro na vista de cima, deslizamento lateral. Nunca parada.
- Planos variados: vista de cima do poço (abertura e final), close no rosto da cobra, nível do chão no meio dos ratos, contra-plongée da cobra erguida.
- Animação dos bichos: a cobra **ergue a cabeça e o pescoço** enquanto "fala", balança devagar, mostra a língua; ratos andam em grupo, tremem, apontam; respiração/balanço sutil sempre.
- Cortes secos a cada 2,5–5 s, no ritmo das frases.

## 4. Texto na tela (duas camadas)
1. **Manchete no topo** (~10–20% da altura): fonte **serifada pesada** (tipo Playfair Display Black), CAIXA ALTA, branca com sombra escura; a 2ª linha/palavra-chave em **amarelo-ouro** (ou **vermelho** para perigo: "QUEM?", "UMA PRAGA", "ATÉ SER!"). Resume a frase em 1–3 palavras e entra junto com ela.
2. **Legenda falada** (~70% da altura): fonte sem serifa negrito (tipo Inter), letras normais (não caixa alta), 1 linha de 3–6 palavras; **palavras ainda não ditas em cinza claro, já ditas em branco, palavras-chave em amarelo**.
- Selo/contador no canto superior direito quando há passagem de tempo ("🌙 NOITE 30").
- Cartões de citação (papel creme, aba amarela com a referência, texto serifado entre aspas) e placas de madeira ("SÓ OS DOENTES").
- @ do canal pequeno e discreto logo abaixo da legenda.

## 5. Som
- **Narrador masculino grave** (~100 Hz), tom de contador de história sério e calmo, **rápido** (~155 palavras/min), começa no quadro 0.
- Fundo **muito baixo**: ambiência/trilha suave cerca de **22–25 dB abaixo da voz** (quase imperceptível), chuva e vento nas cenas do poço.
- Volume final perto de **-14 LUFS**, faixa dinâmica pequena (voz bem comprimida).

## 6. Como fazemos aqui
- Motor three.js do projeto (sombreamento toon + contorno de tinta), mas com **bichos modelados em 3D** (tubos, esferas e cápsulas) em vez de cartões 2D; multidões com instâncias.
- Voz: a do usuário (ElevenLabs) ou a minha (Piper "cadu", mais grave e um pouco mais lenta que a dos reels).
- Legenda: palavra a palavra no estilo da seção 4 (cinza → branco, chave em amarelo) + manchete serifada no topo.
- 1080x1920, 30 fps; duração de 60–150 s (ou 30–60 s para versões curtas).

## 7. Primeiro vídeo feito neste estilo
`projetos/leao-sem-dentes/` ("O leão sem dentes", 67 s). Lições práticas:
- Voz Piper "cadu" grave (-2 semitons, length 0.98) com **6 tomadas por frase**, escolhendo a que a transcrição entende melhor (`tts_grave.py`).
- Evitar "as zebras"/"mais zebras": o "s + z" vira "hebras". Reescrever a frase ("a manada do rio").
- Bichos 3D feitos de esferas, cápsulas e cilindros; listras como faixas em volta das cápsulas (nunca em esfera, que vira "bola de praia").
- Manada grande com instâncias (corpo, pescoço e cabeça); vista de cima vira "pinos", então usar ângulo alto inclinado.
- Câmera nunca atrás do bicho que fala: perfil ou três quartos de frente. Juba com volume atrás da cabeça.

## 8. Shorts para ganhar seguidores (`projetos/cachorrinho-300-dias/`)
- Pedido para seguir **no meio** (~20 s), ligado à emoção ("Se você quer que esse cachorrinho encontre uma casa, segue o canal agora! Ele precisa de você!"),
  com botão "+ Seguir" animado que vira "✓ Seguindo".
- Final em aberto + "a parte 2 só sai quando a gente chegar em mil seguidores" com barra de meta 🔒.
- Áudio **sem ruído**: voz com `afftdn` + `agate`, música limpa, efeitos tonais (latido sintetizado, motor, clique). Chuva só na imagem.
- Números na manchete com fonte Inter (a Playfair desenha números "minúsculos").
