# Clean score + the user's SFX library (Fahh opens the video). Writes work/mix.wav + work/master.wav.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L7"]["e"]; DUR = VEND + 1.8
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:…") == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
mus, fx = buf(DUR), buf(DUR)
C, G, Am, F, Dm, E7 = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60], [50, 57, 62, 65], [40, 56, 59, 64]
def marimba(m, d=0.5, v=1.0): n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)) * np.exp(-t / 0.18) * env(n, 0.002, 0.05)
b = 60 / 124 / 2; t = 0.6; k = 0; quiet = (L["L4"], L["L5"] + 1.5)
while t < DUR - 0.3:                                                    # sneaky comic pizzicato, stops when "nobody came"
    if not (quiet[0] <= t < quiet[1]):
        ch = [C, Am, F, G][(k // 8) % 4]; place(mus, pluck([ch[1], ch[2], ch[3], ch[2]][k % 4] + 12, 0.3, 0.55), t)
        if k % 4 == 0: place(mus, sub(ch[0] - 12, 4 * b, 0.5), t)
        if k % 8 == 4: place(mus, marimba(ch[3] + 12, 0.4, 0.4), t)
    t += b; k += 1
place(mus, pad([45, 52, 57], quiet[1] - quiet[0], 0.35), quiet[0])
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
FAHH = lib("fahh")
place(fx, lib("metal_pipe"), 0.3, 0.8)
place(fx, lib("cartoon_boing"), wt("pote", L["L2"]) + 0.2, 0.6); [place(fx, tone(900 + 80 * i, 0.04) * np.exp(-np.arange(int(0.04 * SR)) / SR / 0.01), wt("pote", L["L2"]) - 0.1 + i * 0.07, 0.3) for i in range(12)]
for w in ["uma", "dez", "cinquenta"]: place(fx, lib("metal_pipe"), wt(w, L["L3"]) - 0.05, 0.5); place(fx, ding(1568), wt(w, L["L3"]) + 0.1, 0.4)
place(fx, lib("suspense_hit"), wt("ninguém", L["L4"]) - 0.05, 0.7)
place(fx, lib("record_scratch"), wt("câmera", L["L5"]) - 0.25, 0.8)
place(fx, lib("bass_drop"), wt("viralizou", L["L6"]) - 0.05, 0.8)
for i in range(6): place(fx, ding(1046 * 2 ** (i / 6)) * 0.6, wt("viralizou", L["L6"]) + 0.3 + i * 0.18)
place(fx, ding(1568), L["L7"] + 0.1, 0.5)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-18 / 20) * gv / grms(mus)
fx *= 0.85 * np.abs(v).max() / np.abs(fx).max()                                     # effect peaks ~85% of the voice peak (clear but under the voice)
fx[: len(FAHH)] += FAHH / np.abs(FAHH).max() * 0.95 * np.abs(v).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master")
