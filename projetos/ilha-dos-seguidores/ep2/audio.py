# Clean score + the user's SFX library (Fahh opens the video). Writes work/mix.wav + work/master.wav.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L6"]["e"]; DUR = VEND + 3.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:…") == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
mus, fx = buf(DUR), buf(DUR)
C, G, Am, F = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]
def marimba(m, d=0.5, v=1.0): n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)) * np.exp(-t / 0.18) * env(n, 0.002, 0.05)
tr = wt("olha", L["L2"]); place(mus, pad([45, 52, 57], tr - 0.6, 0.35), 0.6)            # quiet, empty "yesterday"
b = 60 / 116 / 2; t = tr; k = 0
while t < DUR - 0.3:                                                                   # happy island tune from the reveal on
    ch = [C, G, Am, F][(k // 8) % 4]
    if k % 2 == 0: [place(mus, pluck(m + 12, 0.35, 0.45), t + j * 0.012) for j, m in enumerate(ch[1:])]
    if k % 8 in (0, 3, 6): place(mus, marimba([72, 76, 79, 81, 79, 76, 74, 72][(k // 2) % 8], 0.5, 0.5), t)
    if k % 4 == 0: place(mus, sub(ch[0] - 12, 4 * b, 0.55), t); place(mus, kick(0.35), t)
    t += b; k += 1
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
FAHH = lib("fahh")
place(fx, lib("bass_drop"), tr - 0.05, 0.9); place(fx, lib("cartoon_boing"), tr + 0.4, 0.5)
names = [("ana", L["L4"]), ("enzo", L["L4"]), ("adrian", L["L4"]), ("brainixx", L["L4"]), ("yzak", L["L4"]), ("ana", L["L4"] + 4.5), ("heitor", L["L4"]), ("valentim", L["L5"]), ("alexander", L["L5"]), ("lucas", L["L5"]), ("pedro", L["L5"]), ("pedro", L["L5"] + 3.2), ("kauan", L["L5"]), ("torador", L["L5"])]
for i, (w, a) in enumerate(names): place(fx, ding(1046 * 2 ** (i / 14)), wt(w, a) - 0.05, 0.4)
place(fx, lib("cartoon_boing"), wt("lote", L["L6"]) - 0.05, 0.6)
place(fx, coin(), wt("inscreve", L["L6"]) + 0.55, 0.8)
place(fx, ding(1568), wt("comenta", L["L6"]) - 0.1, 0.5)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-18 / 20) * gv / grms(mus)
fx *= 0.85 * np.abs(v).max() / np.abs(fx).max()                                     # effect peaks ~85% of the voice peak (clear but under the voice)
fx[: len(FAHH)] += FAHH / np.abs(FAHH).max() * 0.95 * np.abs(v).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master")
