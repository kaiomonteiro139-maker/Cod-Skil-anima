# Clean score + the user's SFX library (Fahh opens the video). Writes work/mix.wav + work/master.wav.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L6"]["e"]; DUR = VEND + 2.2
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:…") == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
mus, fx = buf(DUR), buf(DUR)
C, G, Am, F = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]
t = 0.7; k = 0; b = 60 / 100 / 2
while t < DUR - 0.3:                                                     # gentle music box (same feel as the fish video)
    ch = [Am, F, C, G][(k // 8) % 4]; place(mus, pluck(ch[1 + k % 3] + 24, 0.5, 0.5), t)
    if k % 8 == 0: place(mus, pad(ch[1:], 8 * b + 0.5, 0.3), t)
    t += b; k += 1
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
FAHH = lib("fahh")
for i in range(4): place(fx, lib("heartbeat"), 0.9 + i * 0.75, 0.6)
place(fx, lib("suspense_hit"), wt("demais", L["L2"]) - 0.1, 0.7)
place(fx, ding(1568), wt("onda", L["L3"]) - 0.1, 0.5)
tp = wt("seguiu", L["L4"]) + 0.05; place(fx, coin(), tp - 0.25, 0.8)
for i in range(5): place(fx, ding(1046 * 2 ** (i / 5)) * 0.5, tp + 0.05 + i * 0.08)
place(fx, lib("cartoon_boing"), tp + 0.1, 0.7); place(fx, lib("vine_boom"), tp + 1.35, 0.5)
place(fx, lib("dramatic_sting"), wt("mil", L["L5"]) - 0.1, 0.7)
place(fx, ding(1568), L["L6"] + 0.1, 0.5)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-20 / 20) * gv / grms(mus)
fx *= 0.85 * np.abs(v).max() / np.abs(fx).max()                                     # effect peaks ~85% of the voice peak (clear but under the voice)
fx[: len(FAHH)] += FAHH / np.abs(FAHH).max() * 0.95 * np.abs(v).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master")
