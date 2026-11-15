"""Alinha o texto do roteiro (grafia correta) aos tempos de palavra do whisper.
uso: python3 align.py roteiro.md whisper.json saida_words.json"""
import json, re, sys, unicodedata, difflib

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)

md = open(sys.argv[1], encoding="utf-8").read()
narr = md.split("## Narração", 1)[1].split("\n---", 1)[0]
narr = "\n".join(l for l in narr.splitlines()[1:] if l.strip())
script = narr.split()
wh = [w for s in json.load(open(sys.argv[2])) for w in s["w"]]
A = [norm(w) for w in script]
B = [norm(w[2]) for w in wh]
times = [None] * len(script)
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            times[i1 + k] = [wh[j1 + k][0], wh[j1 + k][1]]
    elif tag == "replace" and j2 > j1:
        # espalha o trecho do roteiro sobre o trecho do whisper
        t0, t1 = wh[j1][0], wh[j2 - 1][1]
        n = i2 - i1
        for k in range(n):
            times[i1 + k] = [t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n]
# preenche palavras sem tempo por interpolação
for i, t in enumerate(times):
    if t is None:
        p = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
        q = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), p + 0.3)
        times[i] = [p, max(p + 0.05, q)]
out = [{"w": w, "s": round(t[0], 3), "e": round(t[1], 3)} for w, t in zip(script, times)]
json.dump(out, open(sys.argv[3], "w"), ensure_ascii=False, indent=0)
eq = sum(b.size for b in sm.get_matching_blocks())
print(f"{len(script)} palavras do roteiro, {eq} casadas exatamente com o áudio")
