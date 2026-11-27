# Plano do canal: Lendas de Terror em Cartoon

## Objetivo e conta honesta
- **Meta do YPP (Programa de Parcerias):** 1.000 inscritos + 4.000 horas públicas em **vídeos longos** nos últimos 12 meses.
  As visualizações de Shorts **não contam** para as 4.000 horas. O caminho alternativo é 1.000 inscritos + 10 milhões de views de Shorts em 90 dias.
- **4.000 horas = 240.000 minutos.** Com vídeos de ~14 min e retenção média de ~5 min, isso dá cerca de **48 mil views em vídeos longos** até 1º/02/2027.
  É possível, mas ambicioso para um canal novo em ~9 semanas. Os Shorts são a vitrine que leva gente para os longos.
- **Risco do YPP:** a política de "conteúdo inautêntico" (antes chamada de "conteúdo repetitivo") recusa canais que parecem feitos em série a partir de um molde.
  Por isso, cada vídeo tem história, falas, estrutura e cenário próprios (veja "Anti-repetição"), e todo vídeo passa por aprovação humana antes de subir.

## Formatos
| Formato | Quando | Duração | Tela |
|---|---|---|---|
| Short | todo dia, 12h (Manaus) | 30–60 s | 1080x1920 |
| Longo (compilado) | quarta e domingo, 19h (Manaus) | 10–20 min (3–4 histórias completas de 3–4 min + abertura e encerramento) | 1920x1080 |

- O longo sai **antes** dos Shorts que ele contém. Assim, o "a história completa está no canal" de cada Short é sempre verdade, com link na descrição.
- Calendário completo: `calendario_60_dias.md` (60 Shorts + 18 longos, de 02/12/2026 a 31/01/2027).

## Identidade visual (igual em todos os vídeos)
- **Motor:** o mesmo 3D com sombreamento de desenho e contorno preto das nossas animações (`~/shorts`, base `hamster/web/main.js`).
- **Protagonista fixo:** o rapaz de casaco vermelho e gorro azul (`terror_common/guy.js`), que é o "você" das histórias. Ele aparece em quase todo episódio.
- **Paleta de terror:** cenas noturnas verde-azuladas e frias, com acentos em vermelho no perigo. Luz fluorescente que pisca, blecautes e brilho frio nas assombrações.
- **Assombrações:** cada lenda ganha um modelo próprio, com o mesmo traço (formas simples, olhos fundos com ponto branco e brilho azul).
- **Legenda:** a mesma em todo vídeo, palavra por palavra, em CAIXA ALTA, grande, com a palavra falada em amarelo, no terço inferior.
- **Encerramento do Short:** pílula vermelha "▶ HISTÓRIA COMPLETA NO CANAL".

## Som
- **Voz:** Piper "cadu", gerada como nas outras animações (6 tomadas por frase, escolhidas por transcrição), versão "terror": calma, clara e 1 semitom abaixo.
  Limpeza com `afftdn` e `agate`, e silêncio absoluto entre as frases.
- **Música:** pad lento em tom menor com caixinha de música, **~21 dB abaixo da voz**.
- **Efeitos:** os da biblioteca `sfx/` (suspense_hit, heartbeat, bass_drop, dramatic_sting) e efeitos tonais sintetizados. Nada de ambiência de ruído (chuva, vento ou chiado só aparecem na imagem).
- Volume final em -14 LUFS.

## Roteiro: anti-repetição
Cada Short usa uma estrutura diferente da do dia anterior (o calendário já distribui):
1. **Regra proibida:** "Nunca faça X…"
2. **Você em cena:** segunda pessoa, no presente.
3. **Relato de testemunha:** primeira pessoa ("Meu avô jurava que…").
4. **Começa pelo fim:** mostra o resultado e volta para explicar.
5. **Contagem:** de noites, de luas ou regressiva até a meia-noite.
6. **Desafio ao espectador:** "Repara no fundo da cena…", "Conta até três…".

Regras fixas:
- Gancho nos 2 primeiros segundos, com a voz começando no quadro 0.
- Uma virada no meio.
- Final em aberto com o CTA.
- Nenhuma frase de abertura se repete na mesma semana.

## Produção e custo de render
- **Short de ~35 s:** ~1.050 quadros, uns 20 min de render neste container (1 s por quadro).
- **Longo de 14 min:** ~25.000 quadros, cerca de 6–7 h em 1080p.
  Para dar conta de 2 por semana, render a 24 fps e reaproveitamento dos cenários dos Shorts (a história completa de cada Short usa o mesmo set).
- Os arquivos finais vão para `canal-terror/saida/` e os metadados para `canal-terror/metadados/`.

## Upload: pontos de atenção
- **Projeto de API não verificado:** vídeos enviados pela API por projetos criados depois de 28/07/2020 ficam **travados como privados** até o projeto passar pela auditoria do YouTube (formulário "YouTube API Services – Audit and Quota Extension").
  Enquanto a auditoria não sai, o `publishAt` não vai publicar. Dá para subir pela API e liberar manualmente no YouTube Studio, ou agendar pelo Studio.
- **Cota padrão:** 10.000 unidades por dia, e cada upload gasta ~1.600, então cabem uns 6 vídeos por dia. Thumbnails e playlists custam 50 cada.
- **Thumbnail personalizada:** exige canal verificado por telefone. Nos Shorts, o YouTube costuma mostrar um quadro do vídeo no feed, e a thumbnail enviada aparece em buscas e no canal.
- **Conteúdo sintético:** o script marca `containsSyntheticMedia = true` e `selfDeclaredMadeForKids = false`.

## Direitos
- Lendas folclóricas (Curupira, Matinta, Boto, Loira do Banheiro…) são de domínio público.
- "Annabelle" é ligado a uma franquia de cinema. Contamos a lenda da boneca de pano real (o caso que inspirou os filmes), com boneca de visual próprio e sem usar o nome, o rosto ou as cenas dos filmes. O título usa "boneca amaldiçoada", e "Annabelle" fica só como referência na descrição.
- Nada de tragédias reais com vítimas identificáveis.
