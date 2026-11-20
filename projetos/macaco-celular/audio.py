# Clean score + the user's SFX library (Fahh opens the video). Writes work/mix.wav + work/master.wav.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L8"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:…") == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
mus, fx = buf(DUR), buf(DUR)
C, G, Am, F, Dm, E7 = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60], [50, 57, 62, 65], [40, 56, 59, 64]
b = 60 / 120 / 2; t = 0.6; k = 0
while t < L["L5"] - 0.05:                                                    # upbeat "influencer" pop
    ch = [C, G, Am, F][(k // 8) % 4]; place(mus, pluck(ch[1 + k % 3] + 12, 0.3, 0.55), t)
    if k % 4 == 0: place(mus, sub(ch[0] - 12, 4 * b, 0.5), t); place(mus, kick(0.4), t)
    if k % 4 == 2: place(mus, clap(0.25), t)
    t += b; k += 1
t = L["L5"]; k = 0
while t < DUR - 0.3:                                                         # tension
    place(mus, pluck([45, 46][k % 2], 0.45, 0.8), t); 
    if k % 4 == 0: place(mus, pad([45, 52, 56], 4 * 0.42 + 0.4, 0.35), t)
    t += 0.42; k += 1
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
FAHH = lib("fahh")
tp = wt("postou", L["L2"]); n = int(0.06 * SR); tt = np.arange(n) / SR; place(fx, (np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt / 0.008) + np.sin(2 * np.pi * 900 * tt) * np.exp(-tt / 0.02)), tp - 0.02, 0.8)   # shutter
place(fx, ding(1568), wt("ganhou", L["L2"]), 0.5); place(fx, coin(), wt("mil", L["L3"]), 0.6)
place(fx, lib("bass_drop"), wt("milhão", L["L3"]) - 0.05, 0.8)
place(fx, ding(1320) * 0.8, wt("notificação", L["L5"]) - 0.1); place(fx, lib("vine_boom"), wt("leão", L["L5"]) - 0.05, 0.8)
for i in range(4): place(fx, lib("heartbeat"), L["L6"] + i * 0.62, 0.6)
place(fx, lib("dramatic_sting"), wt("seguindo", L["L7"]) - 0.1, 0.7)
nn = int(1.3 * SR); tt = np.arange(nn) / SR; roar = bp(tone(90 + 30 * np.sin(tt * 7), 1.3, "saw") + 0.5 * tone(140 + 40 * np.sin(tt * 11), 1.3, "saw"), 60, 1800) * env(nn, 0.05, 0.5)
place(fx, roar, wt("verdade", L["L7"]) - 0.1, 0.9); place(fx, lib("cartoon_boing"), wt("verdade", L["L7"]) + 0.3, 0.6)
place(fx, ding(1568), wt("segue", L["L8"]) - 0.1, 0.5)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-18 / 20) * gv / grms(mus)
fx *= 0.85 * np.abs(v).max() / np.abs(fx).max()                                     # effect peaks ~85% of the voice peak (clear but under the voice)
fx[: len(FAHH)] += FAHH / np.abs(FAHH).max() * 0.95 * np.abs(v).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master")
