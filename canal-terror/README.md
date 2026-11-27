# Canal de Lendas de Terror: produção automática

Pasta com tudo o que o canal usa:
- o roteiro e a voz;
- a animação;
- a montagem com legenda, efeitos e música;
- os metadados e a thumbnail;
- o upload agendado no YouTube.

O plano completo está em [`PLANO.md`](PLANO.md) e o calendário de 60 dias em [`calendario_60_dias.md`](calendario_60_dias.md).

## Estrutura
```
canal-terror/
├── PLANO.md                  estratégia, identidade visual, regras de som e de roteiro
├── calendario_60_dias.md/.csv  60 Shorts + 18 longos com tema e estrutura de roteiro
├── gerar_calendario.py       gera o calendário (edite a lista LONGOS para mudar temas)
├── episodios/<nome>/         um projeto por vídeo (roteiro, cena, plano de câmera, áudio)
├── terror_common/            personagem fixo, efeitos e build do motor (comum a todos)
├── thumbs/                   thumbnails (JPG até 2 MB)
├── metadados/                título, descrição e tags de cada vídeo (JSON)
├── saida/                    vídeos finais (MP4) prontos para subir
└── youtube/
    ├── upload.py             fila de upload agendado (YouTube Data API v3)
    ├── fila.json             a fila: um item por vídeo
    └── requirements.txt
```

## 1. Programas necessários
- Python 3.11+ com `numpy` e `faster-whisper` (para conferir a voz).
- [Piper](https://github.com/rhasspy/piper) com a voz `pt_BR-cadu-medium.onnx` em `/root/voices/` (ou ajuste o caminho em `tts_terror.py`).
- Node 22 com `playwright` e Chromium, para renderizar os quadros.
- FFmpeg com `libass`, para a legenda queimada.

## 2. Fazer um episódio (Short)
Dentro de `episodios/<nome>/`:
```bash
# 1) escreva lines.json: [["L1", "frase", pausa_depois], ...]
python3 tts_terror.py .                                  # voz (6 tomadas por frase, escolhe a mais clara)
python3 align_words.py work/voice.wav work/spans.json work/words.json   # tempo de cada palavra
python3 ../../terror_common/build.py .                    # monta o motor 3D com cenário (set.js) + extras
python3 mkstory.py . story                                # plano de câmera (story_body.js) com os tempos da voz
STORY=story node render.mjs work/t "30,200,500" 4 540 960 # quadros de teste para conferir
python3 audio.py                                          # música baixa + efeitos de terror, -14 LUFS
python3 captions.py . 99                                  # legenda palavra por palavra
STORY=story RESUME=1 node render.mjs frames "0-N" 4 1080 1920   # render final (N = duração x 30 - 1)
bash finish.sh . nome_do_video                            # MP4 H.264 + AAC, ~10 MB, faststart
```
Para o longo (16:9), troque `1080 1920` por `1920 1080` no render e junte 3 ou 4 histórias completas.

## 3. Upload agendado no YouTube
### Uma vez só
1. No [Google Cloud Console](https://console.cloud.google.com/), crie um projeto e ative a **YouTube Data API v3**.
2. Em **Tela de permissão OAuth**, escolha "Externo" e adicione o seu e-mail como usuário de teste.
3. Em **Credenciais**, crie um "ID do cliente OAuth" do tipo **App para computador** e baixe o JSON.
4. Salve o arquivo como `canal-terror/youtube/client_secret.json`. Ele já está no `.gitignore`: **nunca suba esse arquivo para o GitHub**.
5. Instale as bibliotecas:
   ```bash
   cd canal-terror/youtube
   pip install -r requirements.txt
   ```

### A cada lote
```bash
python3 upload.py listar              # 1) confira a lista: título, data e hora (Manaus e UTC), avisos
python3 upload.py aprovar short-001   # 2) aprove um por um (ou: aprovar todos)
python3 upload.py enviar --teste      # 3) simulação: mostra o que vai ser enviado, sem enviar
python3 upload.py enviar              # 4) envio de verdade
```
- **Primeiro envio:** abre o navegador para você entrar na conta do canal. O acesso fica salvo em `youtube/token.json` (também no `.gitignore`), então não precisa logar de novo.
- **Como cada vídeo sobe:** privado, com publicação agendada (`publishAt`), `selfDeclaredMadeForKids = false` e `containsSyntheticMedia = true`. Depois vão a thumbnail e a inclusão na playlist; se a playlist não existir, o script cria.
- **Horários:** Shorts às 12h e longos às 19h, horário de Manaus/Boa Vista (UTC-4). Dá para mudar por vídeo com o campo `"hora"` na `fila.json`.
- **Envio interrompido:** se a internet cair no meio, rode `enviar` de novo. Ele pula os vídeos que já têm `youtube_id`.

### Importante antes de começar
- **Projeto de API novo:** os vídeos enviados pela API ficam **travados como privados** até o Google aprovar a auditoria do projeto. O pedido é feito no formulário *YouTube API Services – Audit and Quota Extension*. Enquanto isso, agende ou publique pelo YouTube Studio.
- **Thumbnail personalizada:** exige o canal verificado por telefone (youtube.com/verify).
- **Cota padrão:** 10.000 unidades por dia, o que dá ~6 uploads por dia.

## 4. Formato da fila (`youtube/fila.json`)
```json
{
  "id": "short-001", "tipo": "short", "data": "2026-12-03",
  "arquivo": "../saida/short-001_loira_do_banheiro.mp4", "thumbnail": "../thumbs/short-001.jpg",
  "titulo": "...", "descricao": "...", "tags": ["..."], "playlist": "Shorts de Terror",
  "aprovado": false, "youtube_id": null
}
```
