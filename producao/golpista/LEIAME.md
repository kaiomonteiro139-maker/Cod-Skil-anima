# Produção: "Larguei a Faculdade Para Virar Golpista"

## O que já está pronto
| Arquivo | O que é |
|---|---|
| `audio/voz.mp3` | Narração do ElevenLabs (5:10) |
| `audio/palavras.json` | Tempo de cada palavra do roteiro na narração |
| `PLANO.md` | As 64 cenas com tempo, fala, luz, personagens, ação, câmera e som |
| `PROMPTS.md` | Fichas de personagem + prompt de imagem e de movimento de cada cena |
| `legenda.ass` / `legenda.srt` | Legenda karaokê (queimada no vídeo) e legenda simples para subir no YouTube |
| `saida/previa.mp4` | Animatic: voz + efeitos + legenda + cartões no lugar das cenas (fica fora do git) |

## Passo a passo para o vídeo final
1. Gere as **fichas de personagem** de `PROMPTS.md` e escolha a melhor de cada um.
2. Gere a **imagem** de cada cena usando a ficha como referência. Salve em `imagens/cena_01.png`, `imagens/cena_02.png`…
3. Anime cada imagem (Kling, Veo/Flow, Hailuo) com o prompt de movimento. Salve em `clipes/cena_01.mp4`…
   - As cenas **61 e 64 não precisam ser geradas**: são montagens que reaproveitam outros clipes.
   - Pode misturar: a cena que tiver só imagem ganha zoom lento automático, e a que não tiver nada vira cartão.
4. Rode a montagem:
   ```bash
   cd producao/golpista
   python3 tools/montar.py            # vídeo final 1920x1080 -> saida/video_final.mp4
   python3 tools/montar.py --previa   # versão rápida 1280x720 para conferir
   python3 tools/montar.py --musica trilha.mp3 --musica-db -22   # com trilha opcional
   ```
   Requisitos: Python 3 com numpy e Pillow, ffmpeg com libass e a fonte Inter (Black Italic).

## O que a montagem faz sozinha
- Corta cada cena 2 quadros antes da primeira palavra dela.
- Clipe mais curto que a cena: desacelera até 35% e, se ainda faltar, congela o último quadro. Clipe mais longo: corta.
- Flash branco na entrada das cenas 38 (paranoia) e 46 (polícia).
- Partículas brancas caindo por cima do vídeo inteiro (como na referência).
- Legenda karaokê de 1 a 3 palavras, Inter Black Italic, palavra falada em amarelo.
- Efeitos sintetizados (`audio/sfx_cues.txt`): boom de abertura, swipe, clique de enviar, batida de coração, vibração, notificação, sting, batidas na porta e whooshes. Ficam ~10 dB abaixo da voz.
- Volume final a −14 LUFS, pico em −1 dB.

## Se mudar alguma coisa
- **Trocou a narração:** coloque o novo `audio/voz.mp3`, transcreva para `audio/whisper.json` e rode, nesta ordem: `tools/align.py`, `tools/plano.py` e `tools/sons.py`.
- **Mudou cenas, luz ou prompts:** edite `tools/cenas.py` e rode `python3 tools/plano.py`.
