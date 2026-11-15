"""Gera cenas.json (tempos), PLANO.md (tabela para editar) e PROMPTS.md (para gerar imagens/clipes).
uso: python3 tools/plano.py   (rodar dentro de producao/golpista)"""
import json, re, sys, unicodedata, os
sys.path.insert(0, os.path.dirname(__file__))
from cenas import ESTILO, PERSONAGENS, LUZES, CENAS, REAPROVEITA

FPS = 30

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))

W = json.load(open("audio/palavras.json", encoding="utf-8"))
dur = float(os.popen("ffprobe -v error -show_entries format=duration -of csv=p=0 audio/voz.mp3").read())
toks = [norm(w["w"]) for w in W]

pos, out = 0, []
for i, c in enumerate(CENAS, 1):
    key = [norm(k) for k in c["inicio"].split()]
    for j in range(pos, len(toks)):
        if toks[j:j + len(key)] == key:
            break
    else:
        sys.exit(f"cena {i}: não achei '{c['inicio']}' depois da palavra {pos}")
    pos = j + 1
    out.append(dict(c, n=i, w0=j))

for k, c in enumerate(out):
    # o corte acontece 2 quadros antes da primeira palavra da cena
    c["t0"] = 0.0 if k == 0 else round(max(W[c["w0"]]["s"] - 2 / FPS, out[k - 1]["t0"] + 0.5), 3)
for k, c in enumerate(out):
    c["t1"] = out[k + 1]["t0"] if k + 1 < len(out) else round(dur, 3)
    end_w = out[k + 1]["w0"] if k + 1 < len(out) else len(W)
    c["fala"] = " ".join(w["w"] for w in W[c["w0"]:end_w])
    c["dur"] = round(c["t1"] - c["t0"], 2)
    c["reaproveita"] = REAPROVEITA.get(c["n"], [])

json.dump([{k: c[k] for k in ("n", "t0", "t1", "dur", "luz", "quem", "acao", "camera", "img", "mov", "fala", "reaproveita")} | {"sfx": c.get("sfx", "")} for c in out],
          open("cenas.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def tc(t):
    return f"{int(t // 60)}:{t % 60:05.2f}"

def quem_txt(q):
    if not q:
        return "—"
    parts = []
    for p in q.split(","):
        p = p.strip()
        k, _, roupa = p.partition(":")
        parts.append(PERSONAGENS[k]["nome"].split(" (")[0] + (f" (roupa {roupa})" if roupa else ""))
    return ", ".join(parts)

# ---------- PLANO.md ----------
L = ["# Plano de cenas: \"Larguei a Faculdade Para Virar Golpista\"", "",
     f"Duração da narração: **{tc(dur)}** · **{len(out)} cenas** · média {dur / len(out):.1f} s por cena · "
     f"{sum(1 for c in out if not c['reaproveita'])} clipes novos para gerar.", "",
     "O corte de cada cena cai 2 quadros antes da primeira palavra dela. Tempos em minuto:segundo.", "",
     "| # | Início | Dur. | Fala | Luz | Quem | O que acontece | Câmera | Som |",
     "|---|---|---|---|---|---|---|---|---|"]
for c in out:
    L.append(f"| {c['n']} | {tc(c['t0'])} | {c['dur']:.1f}s | {c['fala']} | {LUZES[c['luz']][0]} | {quem_txt(c['quem'])} | "
             f"{c['acao']} | {c['camera']} | {c.get('sfx', '')} |")
L += ["", "## Mapa da luz por ato", "",
      "- **0:00–1:08 Decisão** — noite azul (dúvida) alternando com dia (faculdade, café).",
      "- **1:08–1:27 Primeiro golpe** — apagão com abajur: medo e tensão.",
      "- **1:27–2:07 Luxo** — manhã → dia → dourado. O vídeo fica mais claro e saturado.",
      "- **2:07–2:46 Culpa** — luz da TV, depois noite.",
      "- **2:46–3:18 Paranoia** — noite e apagão (roupa C cinza).",
      "- **3:18–4:26 Queda** — polícia azul/vermelha → fluorescente frio → pôr do sol morrendo.",
      "- **4:34–5:10 Hoje** — dia comum e calmo, fechando com a pergunta.", ""]
open("PLANO.md", "w", encoding="utf-8").write("\n".join(L))

# ---------- PROMPTS.md ----------
P = ["# Prompts de imagem e animação", "",
     "## Como usar", "",
     "1. **Gere primeiro as fichas de personagem** (abaixo) e escolha a melhor de cada um. Use-as como **imagem de referência** em todas as cenas (Midjourney `--cref`/Omni reference, ou referência de personagem no Gemini, GPT Image, Kling, Flow).",
     "2. Para cada cena, gere a **imagem** com: `prompt da cena + bloco de personagem + luz + estilo`. Já está tudo montado abaixo, é só copiar.",
     "3. Leve a imagem para o gerador de vídeo (Kling, Veo/Flow, Hailuo) com o **prompt de movimento**. Clipe de 5 s (ou 10 s se a cena passar de 5 s).",
     "4. Salve como `clipes/cena_01.mp4`, `clipes/cena_02.mp4`… (ou `imagens/cena_01.png` se for usar só a imagem). O script `montar.sh` faz o resto.",
     "5. **Nunca peça texto na imagem.** Telas de celular e notebook ficam borradas; os textos (\"PAGO\", \"CONTA BLOQUEADA\") entram na edição.", "",
     "## Estilo fixo (vai no fim de todo prompt)", "", "```", ESTILO, "```", "",
     "## Fichas de personagem", ""]
for k, p in PERSONAGENS.items():
    P += [f"### {p['nome']}", ""]
    if "roupas" in p:
        P.append(p["porque"])
        P.append("")
        for r, desc in p["roupas"].items():
            P += [f"**Roupa {r}:**", "```",
                  f"character reference sheet, front view, side view and three-quarter view, plus 4 facial expressions (neutral, worried, happy, shocked), {p['desc']}, wearing {desc}, plain light-grey background, {ESTILO}",
                  "```", ""]
    else:
        P += ["```", f"character reference sheet, front view, side view and three-quarter view, {p['desc']}, plain light-grey background, {ESTILO}", "```", ""]

P += ["## Cenas", ""]
for c in out:
    P += [f"### Cena {c['n']} · {tc(c['t0'])} · {c['dur']:.1f} s · {LUZES[c['luz']][0]}", "",
          f"> {c['fala']}", ""]
    if c["reaproveita"]:
        P += [f"**Não precisa gerar:** montagem com cortes rápidos dos clipes das cenas {', '.join(map(str, c['reaproveita']))}.", ""]
        continue
    chars = []
    for q in [x.strip() for x in c["quem"].split(",") if x.strip()]:
        k, _, r = q.partition(":")
        d = PERSONAGENS[k]["desc"]
        if r:
            d += ", wearing " + PERSONAGENS[k]["roupas"][r]
        chars.append(("the young woman" if k == "VOCE" else PERSONAGENS[k]["nome"].split(" (")[0].lower()) + ": " + d)
    img = c["img"] + (". Characters — " + "; ".join(chars) if chars else "") + ". Lighting: " + LUZES[c["luz"]][1] + ". " + ESTILO
    P += ["**Imagem:**", "```", img, "```", "**Movimento:**", "```",
          c["mov"] + ". Keep the exact same art style and character design, smooth subtle animation, no text, no morphing.", "```", ""]
open("PROMPTS.md", "w", encoding="utf-8").write("\n".join(P))

for c in out:
    print(f"{c['n']:2d} {tc(c['t0'])} {c['dur']:5.2f}s {c['luz']:8s} {c['fala'][:60]}")
