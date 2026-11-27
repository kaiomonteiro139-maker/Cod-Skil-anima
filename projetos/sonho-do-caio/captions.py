# Word-synced burned-in captions (ASS): 1-3 words per line, current word highlighted.
import json, re, sys
words = json.load(open("work/words.json"))
FIX = {"julia": "Júlia"}
STOP_AT = float(sys.argv[1]) if len(sys.argv) > 1 else 1e9   # no captions once the on-screen poll text appears
ws = []
for w in words:
    t = w["w"]
    if t.startswith("-") and ws: ws[-1]["w"] += t; ws[-1]["e"] = w["e"]; continue
    ws.append(dict(w))
for w in ws:
    core = re.sub(r"[^\wÀ-ú-]", "", w["w"]).lower()
    if core in FIX: w["w"] = w["w"].lower().replace(core, FIX[core])
for i in range(len(ws) - 1):
    if ws[i]["w"].lower() == "a" and ws[i + 1]["w"].lower().startswith("meia"): ws[i]["w"] = "à"
ws = [w for w in ws if w["s"] < STOP_AT]
chunks, cur = [], []
for w in ws:
    if cur and len(" ".join(x["w"] for x in cur + [w])) > 16: chunks.append(cur); cur = []
    cur.append(w)
    if len(cur) == 3 or re.search(r"[.,?!]$", w["w"]): chunks.append(cur); cur = []
if cur: chunks.append(cur)
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h}:{m:02d}:{s:05.2f}"
def clean(t): return re.sub(r"[.,]", "", t).upper()
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,DejaVu Sans,84,&H00FFFFFF,&H00FFFFFF,&H00160C14,&H90000000,-1,0,0,0,100,100,1,0,1,9,4,2,60,60,520,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for ci, ch in enumerate(chunks):
    nxt = chunks[ci + 1][0]["s"] if ci + 1 < len(chunks) else ch[-1]["e"] + 0.6
    end = min(nxt, max(ch[-1]["e"] + 0.45, ch[-1]["s"] + 0.35))
    end = min(end, STOP_AT)
    for i, w in enumerate(ch):
        s = w["s"] if i else max(0, w["s"] - 0.04)
        e = ch[i + 1]["s"] if i + 1 < len(ch) else end
        if e <= s: continue
        parts = []
        for j, x in enumerate(ch):
            t = clean(x["w"])
            parts.append("{\\c&H3FD2FF&\\fscx108\\fscy108}" + t + "{\\c&HFFFFFF&\\fscx100\\fscy100}" if j == i else t)
        pop = "{\\fad(40,0)}" if i == 0 else ""
        ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,,0,0,0,,{pop}" + " ".join(parts))
open("work/captions.ass", "w").write(head + "\n".join(ev) + "\n")
print(len(chunks), "lines,", len(ev), "events")
for ch in chunks[:6]: print(" ", " ".join(clean(w["w"]) for w in ch))
