# Fable-style text (docs/ESTILO_ANIMAIS.md): serif headline on top (2nd line in gold/red), spoken caption that turns
# grey → white word by word (keywords gold), and a counter badge during the escalation. Writes work/captions.ass (1080x1920).
import json, re
words = json.load(open("work/words.json")); spans = {s["id"]: s for s in json.load(open("work/spans.json"))}
IDS = [s["id"] for s in json.load(open("work/spans.json"))]
GOLD, RED, WHITE, GREY = "&H3FC8F5&", "&H3B48E5&", "&HFFFFFF&", "&H8C8C8C&"
HEAD = {
  "L1": ("1 FLORESTA.", "POR 1 BANANA.", GOLD), "L2": ("1 BANANA", "POR ÁRVORE.", GOLD), "L3": ("MELHOR NEGÓCIO", "DO MUNDO!", GOLD), "L4": ("ÁRVORES", "CORTADAS.", RED),
  "L5": ("A ÚLTIMA", "ÁRVORE.", GOLD), "L6": ("NENHUMA", "PRA SUBIR.", RED), "L7": ("1.000 BANANAS.", "NENHUM LAR.", RED), "L8": ("CUIDADO COM", "O FÁCIL.", GOLD), "L9": ("MANDA PRA", "ALGUÉM.", GOLD) }
_W = json.load(open("work/words.json")); _wt = lambda w, after: next(x["s"] for x in _W if x["s"] >= after - 0.01 and re.sub(r"[^\wÀ-ú]", "", x["w"].lower()) == w)
_l4 = spans["L4"]["s"]; _t10, _t100 = _wt("dez", _l4), _wt("cem", _l4)
BADGES = [(_l4, _t10, "1"), (_t10, _t100, "10"), (_t100, spans["L7"]["s"], "100")]
KEY = {"macaco", "floresta", "banana", "bananas", "árvore", "árvores", "selva", "cortar", "melhor", "negócio", "mundo", "dez", "cem", "última", "nenhuma", "tocos", "mil", "nenhum", "lugar", "viver", "cuidado", "fácil", "troca", "manda", "alguém"}
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h}:{m:02d}:{s:05.2f}"
core = lambda w: re.sub(r"[^\wÀ-ú]", "", w.lower())
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Head,Playfair Display,104,&H00FFFFFF,&H00FFFFFF,&H00141018,&H8C000000,0,0,0,0,100,100,0,0,1,3.5,6,8,70,70,215,1
Style: Cap,Inter,64,&H00FFFFFF,&H00FFFFFF,&H00141018,&H8C000000,-1,0,0,0,100,100,0,0,1,4.5,3,2,80,80,600,1
Style: Badge,Inter,54,&H00FFFFFF,&H00FFFFFF,&H00402418,&H00402418,-1,0,0,0,100,100,1,0,3,14,0,9,60,60,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
# headlines: from the line's start to the next line's start (pop-in)
for i, lid in enumerate(IDS):
    a = spans[lid]["s"]; b = spans[IDS[i + 1]]["s"] if i + 1 < len(IDS) else spans[lid]["e"] + 1.6
    l1, l2, col = HEAD[lid]
    dg = lambda x: re.sub(r"(\d[\d.]*)", lambda m: "{\\fnInter\\b1\\fscx92}" + m.group(1) + "{\\fnPlayfair Display\\b0\\fscx100}", x); l1, l2 = dg(l1), dg(l2)
    ev.append(f"Dialogue: 2,{ts(max(0, a - 0.05))},{ts(b)},Head,,0,0,0,,{{\\fad(60,0)\\t(0,140,\\fscx104\\fscy104)\\t(140,260,\\fscx100\\fscy100)}}{l1}\\N{{\\c{col}}}{l2}")
    pass
for a, b, n in BADGES: ev.append(f"Dialogue: 1,{ts(a)},{ts(b)},Badge,,0,0,0,,{{\\fad(80,0)}}ÁRVORES: {{\\c{GOLD}}}{n}")
# captions: chunks of ≤ 26 chars, break after punctuation; words already spoken white (keywords gold), the rest grey
chunks, cur = [], []
for w in words:
    if cur and len(" ".join(x["w"] for x in cur + [w])) > 26: chunks.append(cur); cur = []
    cur.append(w)
    if re.search(r"[.,?!:;]$|\.\.\.$", w["w"]): chunks.append(cur); cur = []
if cur: chunks.append(cur)
for ci, ch in enumerate(chunks):
    nxt = chunks[ci + 1][0]["s"] - 0.04 if ci + 1 < len(chunks) else ch[-1]["e"] + 0.8
    end = min(nxt, max(ch[-1]["e"] + 0.5, ch[-1]["s"] + 0.4))
    for i, w in enumerate(ch):
        s = max(0, w["s"] - (0.05 if i == 0 else 0)); e = ch[i + 1]["s"] if i + 1 < len(ch) else end
        if e <= s: continue
        parts = []
        for j, x in enumerate(ch):
            c = (GOLD if core(x["w"]) in KEY else WHITE) if j <= i else GREY
            parts.append(f"{{\\c{c}}}" + x["w"])
        ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,,0,0,0,,{'{\\fad(50,0)}' if i == 0 else ''}" + " ".join(parts))
open("work/captions.ass", "w").write(head + "\n".join(ev) + "\n")
print(len(chunks), "caption lines,", len(ev), "events")
