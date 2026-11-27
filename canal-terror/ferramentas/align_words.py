# usage: python3 align_words.py voice.wav spans.json out_words.json (spans: [{text,s,e}])  — ASR word times aligned to the script text
import json, re, difflib, sys, subprocess, numpy as np
from faster_whisper import WhisperModel
voice, spans_p, out_p = sys.argv[1:4]
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", voice, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
m = WhisperModel("small", device="cpu", compute_type="int8")
asr = [{"w": w.word.strip(), "s": w.start, "e": w.end} for s in m.transcribe(a, language="pt", word_timestamps=True)[0] for w in s.words]
N2W = {"15": "quinze", "2": "dois", "12": "doze", "300": "trezentos", "1": "um"}
norm = lambda x: re.sub(r"[^\wÀ-ú]", "", x.lower())
out = []
for sp in json.load(open(spans_p)):
    sw = sp["text"].split(); aw = [w for w in asr if w["s"] >= sp["s"] - 0.3 and w["e"] <= sp["e"] + 0.3]
    an = [N2W.get(norm(w["w"]), norm(w["w"])) for w in aw]; sn = [norm(w) for w in sw]; T = [None] * len(sw)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, sn, an).get_opcodes():
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1): T[i1 + k] = (aw[j1 + k]["s"], aw[j1 + k]["e"])
    pts = [(-1, (sp["s"], sp["s"]))] + [(i, t) for i, t in enumerate(T) if t] + [(len(sw), (sp["e"], sp["e"]))]
    for (i0, t0), (i1, t1) in zip(pts, pts[1:]):
        n = i1 - i0
        for k in range(1, n): a0 = t0[1] + (t1[0] - t0[1]) * (k - 1) / n; T[i0 + k] = (a0, t0[1] + (t1[0] - t0[1]) * k / n)
    out += [{"w": w, "s": round(t[0], 3), "e": round(t[1], 3)} for w, t in zip(sw, T)]
json.dump(out, open(out_p, "w"), ensure_ascii=False, indent=0); print(len(out), "words")
