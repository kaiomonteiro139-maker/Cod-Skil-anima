# usage: python3 captions.py <reel_dir> <stop_at_s>  — word-synced CAPS captions (1-3 words, spoken word yellow, lower third), 1080x1920.
import json, re, sys
D, STOP = sys.argv[1], float(sys.argv[2])
ws = [w for w in json.load(open(f"{D}/work/words.json")) if w["s"] < STOP]
chunks, cur = [], []
for w in ws:
    if cur and len(" ".join(x["w"] for x in cur + [w])) > 16: chunks.append(cur); cur = []
    cur.append(w)
    if len(cur) == 3 or re.search(r"[.,?!:;…]['\"]?$", w["w"]): chunks.append(cur); cur = []
if cur: chunks.append(cur)
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h}:{m:02d}:{s:05.2f}"
def clean(t): return re.sub(r"[.,;:\"'…]", "", t).upper()
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,DejaVu Sans,72,&H00FFFFFF,&H00FFFFFF,&H00160C14,&H90000000,-1,0,0,0,100,100,1,0,1,9,4,2,120,120,90,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for ci, ch in enumerate(chunks):
    nxt = chunks[ci + 1][0]["s"] - 0.045 if ci + 1 < len(chunks) else ch[-1]["e"] + 0.6
    end = min(nxt, max(ch[-1]["e"] + 0.45, ch[-1]["s"] + 0.35), STOP)
    for i, w in enumerate(ch):
        s = w["s"] if i else max(0, w["s"] - 0.04)
        e = ch[i + 1]["s"] if i + 1 < len(ch) else end
        if e <= s: continue
        parts = [("{\\c&H3FD2FF&\\fscx108\\fscy108}" + clean(x["w"]) + "{\\c&HFFFFFF&\\fscx100\\fscy100}") if j == i else clean(x["w"]) for j, x in enumerate(ch)]
        pop = "{\\fad(40,0)}" if i == 0 else ""
        ev.append(f"Dialogue: 0,{ts(s)},{ts(e)},Cap,,0,0,0,," + pop + " ".join(parts))
open(f"{D}/work/captions.ass", "w").write(head + "\n".join(ev) + "\n")
print(len(chunks), "lines,", len(ev), "events"); [print("  ", " ".join(clean(w["w"]) for w in ch)) for ch in chunks[:5]]
