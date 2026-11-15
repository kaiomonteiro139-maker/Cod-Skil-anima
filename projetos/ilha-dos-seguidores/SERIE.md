# Série "Ilha dos Seguidores"
Ilha-vila que começa com 0 habitantes. Cada seguidor que **comentar o nome** ganha uma casinha com plaquinha de nome no episódio seguinte.

- Episódio 1 (`video/ilha_dos_seguidores_ep1_celular.mp4`): ilha vazia, casa-fantasma "VOCÊ?", botão "+ Seguir", caixinha "Seu nome aqui…", contador HABITANTES: 0.
- Próximos episódios: o usuário manda a lista de nomes dos comentários → colocar em `RESIDENTS` no `story_body.js`
  (uma casa colorida por nome, nos lotes em anel; 10 lotes por anel — ampliar com novos anéis/bairros quando passar de 10).
  O contador e a placa "VILA DOS SEGUIDORES / HABITANTES: N" usam o número de nomes.
- Ideias de gancho: "Ontem essa ilha tinha 0 habitantes. Olha agora!", mostrar cada nome com zoom, e no final "comenta seu nome pra entrar no próximo".
- Voz do Claude (`tts_animada.py`, com limpeza de ruído), legenda CAIXA ALTA palavra por palavra, trilha alegre limpa (música -18 dB, efeitos -12 dB).
