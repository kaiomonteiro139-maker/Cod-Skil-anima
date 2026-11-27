# Clean score + the user's SFX library (Fahh opens the video). Writes work/mix.wav + work/master.wav.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L7"]["e"]; DUR = VEND + 2.2
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:…") == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
mus, fx = buf(DUR), buf(DUR)
C, G, Am, F = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]
t = 0.7; k = 0; b = 60 / 104 / 2
while t < DUR - 0.3:
    ch = [Am, F, C, G][(k // 8) % 4]; place(mus, pluck(ch[1 + k % 3] + 24, 0.5, 0.5), t)
    if k % 8 == 0: place(mus, pad(ch[1:], 8 * b + 0.5, 0.3), t)
    t += b; k += 1
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
for w, l in [("como", "L2"), ("ver", "L3"), ("apagar", "L4"), ("mil", "L5"), ("quinze", "L6")]: place(fx, ding(1568), wt(w, L[l]) - 0.08, 0.45)
for i in range(4): place(fx, lib("heartbeat"), wt("ver", L["L3"]) + i * 0.75, 0.5)
for i in range(12): place(fx, ding(2637) * 0.25, L["L5"] + 0.3 + i * 0.45)
place(fx, coin(), wt("segue", L["L7"]) - 0.05, 0.6)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-20 / 20) * gv / grms(mus)
fx *= 0.85 * np.abs(v).max() / np.abs(fx).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master")
