# Bottom captions in the illustrated-story style: natural case, 2-4 words, spoken word in yellow. usage: python3 captions_ilustrado.py words.json out.ass
import json, re, sys
ws = json.load(open(sys.argv[1])); out = sys.argv[2]
clean = lambda t: re.sub(r"[.,!?…;:\"“”]", "", t)
chunks, cur = [], []
for w in ws:
    cur.append(w)
    if len(cur) == 4 or re.search(r"[.,!?…]$", w["w"]) or len(" ".join(clean(x["w"]) for x in cur)) > 22: chunks.append(cur); cur = []
if cur: chunks.append(cur)
ts = lambda x: f"{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}"
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,DejaVu Sans,66,&H00FFFFFF,&H00FFFFFF,&H00100C0A,&H80000000,1,0,0,0,100,100,0,0,1,5,2,2,80,80,150,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for ci, ch in enumerate(chunks):
    end_chunk = chunks[ci + 1][0]["s"] if ci + 1 < len(chunks) else ch[-1]["e"] + 0.4
    for k, w in enumerate(ch):
        a = w["s"]; b = ch[k + 1]["s"] if k + 1 < len(ch) else end_chunk
        txt = " ".join(("{\\c&H00E6FF&}" + clean(x["w"]) + "{\\c&HFFFFFF&}") if j == k else clean(x["w"]) for j, x in enumerate(ch))
        ev.append(f"Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{txt}")
open(out, "w").write(head + "\n".join(ev) + "\n"); print(len(chunks), "chunks", len(ev), "events")
