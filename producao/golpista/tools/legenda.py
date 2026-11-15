"""Gera legenda karaokê (.ass): 1 a 3 palavras por vez, palavra falada em amarelo.
uso: python3 tools/legenda.py [largura altura]   -> legenda.ass (e legenda.srt simples)"""
import json, sys

W = int(sys.argv[1]) if len(sys.argv) > 1 else 1920
H = int(sys.argv[2]) if len(sys.argv) > 2 else 1080
k = H / 1080
words = json.load(open("audio/palavras.json", encoding="utf-8"))

# ---- agrupa em páginas de até 3 palavras; quebra em pontuação ou pausa
pages, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    end_punct = w["w"][-1] in ".?!:,;\"" or w["w"].endswith('."')
    gap = (nxt["s"] - w["e"]) if nxt else 9
    chars = sum(len(x["w"]) + 1 for x in cur)
    if len(cur) == 3 or end_punct or gap > 0.35 or chars > 20 or not nxt:
        pages.append(cur)
        cur = []

def t(s):
    s = max(0, s)
    return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"

def clean(x):
    return x.replace("{", "(").replace("}", ")")

YEL, WHT = r"{\c&H00F0FF&}", r"{\c&HFFFFFF&}"   # ASS usa BGR: amarelo = 00F0FF
ev = []
for pi, pg in enumerate(pages):
    nxt_page = pages[pi + 1][0]["s"] if pi + 1 < len(pages) else pg[-1]["e"] + 0.6
    page_end = min(nxt_page, pg[-1]["e"] + 0.6)
    for j, w in enumerate(pg):
        s = w["s"] if j else min(w["s"], pg[0]["s"])
        e = pg[j + 1]["s"] if j + 1 < len(pg) else page_end
        txt = " ".join((YEL if m == j else WHT) + clean(x["w"]) for m, x in enumerate(pg))
        # entrada da página com um "pop" curto
        pop = r"{\fscx92\fscy92\t(0,80,\fscx100\fscy100)}" if j == 0 else ""
        ev.append(f"Dialogue: 0,{t(s)},{t(e)},K,,0,0,0,,{pop}{txt}")

hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: K,Inter Black,{round(78 * k)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,-1,0,0,100,100,0,0,1,{round(6 * k, 1)},{round(2 * k, 1)},2,60,60,{round(118 * k)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open("legenda.ass", "w", encoding="utf-8").write(hdr + "\n".join(ev) + "\n")

# SRT simples (para subir no YouTube como legenda opcional)
srt = []
for i, pg in enumerate(pages, 1):
    def ts(s):
        return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)) % 1000:03d}"
    srt += [str(i), f"{ts(pg[0]['s'])} --> {ts(pg[-1]['e'])}", " ".join(w["w"] for w in pg), ""]
open("legenda.srt", "w", encoding="utf-8").write("\n".join(srt))
print(f"{len(pages)} páginas de legenda, {len(ev)} eventos")
