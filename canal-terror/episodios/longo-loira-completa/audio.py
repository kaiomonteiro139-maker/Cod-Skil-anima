# Terror Short mix: calm dark pad (~21 dB under the voice), the user's horror SFX + clean tonal effects. No noise beds.
import sys, json, wave, subprocess, re; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; E = {k: v["e"] for k, v in sp.items()}; VEND = max(E.values()); DUR = VEND + 12
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and re.sub(r"[^a-zà-ú]", "", x["w"].lower()) == w), after)
def lib(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/Cod-Skil-anima/sfx/{name}.wav", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
def sweep(f0, f1, d, g=1.0): n = int(d * SR); f = np.linspace(f0, f1, n); return g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, n)) ** 2
def hum(d, f=100): n = int(d * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * 0.15
mus, fx = buf(DUR), buf(DUR)
# slow minor pad (Am – F – Dm – E), music-box notes every 2 bars
prog = [[45, 52, 57, 60], [41, 48, 53, 57], [38, 50, 53, 57], [40, 47, 52, 56]]
t = 0.0; k = 0
while t < DUR:
    ch = prog[k % 4]; place(mus, pad(ch, 4.4, 0.5), t)
    if k % 2 == 0: place(mus, pluck(ch[-1] + 24, 1.2, 0.35), t + 1.0); place(mus, pluck(ch[-2] + 24, 1.2, 0.3), t + 2.2)
    t += 4.0; k += 1
mus[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
place(fx, lib("suspense_hit"), 0.0, 0.7)
for a0, b0 in [(0, L["L3"]), (L["L11"], L["L20"]), (L["L22"], L["L24"]), (L["L30"], DUR - 1)]: place(fx, hum(b0 - a0, 100), a0, 0.2)
place(fx, sweep(700, 200, 1.4, 0.4), E["L2"] - 0.6)
for i in range(6): place(fx, ding(2637) * 0.25, L["L7"] + 0.3 + i * 0.55)
place(fx, lib("bass_drop"), wt("escorregou", L["L8"]) + 0.2, 0.6)
place(fx, sweep(900, 300, 1.6, 0.3), L["L10"] + 0.5)
for i in range(7): place(fx, ding(2349) * 0.3, L["L13"] + 0.4 + i * 0.9)
place(fx, lib("dramatic_sting"), L["L14"] - 0.1, 0.8)
for i in range(4): place(fx, thump(110, 0.1, 0.5), wt("puxa", L["L15"]) + i * 0.16)
place(fx, lib("suspense_hit"), wt("trancada", L["L15"]), 0.6)
for w, l in [("um", "L17"), ("dois", "L17"), ("três", "L18")]: place(fx, sweep(260, 180, 0.9, 0.5), wt(w, L[l]))
place(fx, sweep(500, 120, 1.2, 0.6), wt("descarga", L["L18"]))
for i in range(4): place(fx, lib("heartbeat"), L["L19"] + i * 0.75, 0.55)
place(fx, ding(392) * 0.5, L["L25"]); place(fx, pluck(76, 1.5, 0.5), L["L27"]); place(fx, pluck(81, 1.5, 0.4), L["L27"] + 0.25)
place(fx, sweep(500, 120, 1.2, 0.5), wt("descarga", L["L30"]))
place(fx, lib("suspense_hit"), E["L31"] + 0.3, 0.5)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
v = np.zeros(len(mus)); vv = load("work/voice.wav"); v[: min(len(v), len(vv))] = vv[: len(v)]
def grms(x): win = int(0.4 * SR); n = len(x) // win; r = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1)); keep = r[r > r.max() * 0.01]; return np.sqrt((keep ** 2).mean())
gv = grms(v); mus *= 10 ** (-21 / 20) * gv / grms(mus)
duck = np.ones(len(mus)); i0, i1 = int(L['L24'] * SR), int(L['L25'] * SR); duck[i0:i1] = 0.15; mus *= duck
fx *= 0.8 * np.abs(v).max() / np.abs(fx).max()
mix = v + mus + fx; w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", "work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; Lu = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "work/mix.wav", "-af", f"volume={-14 - Lu:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", "work/master.wav"], check=True); print(f"mix {Lu:.1f} LUFS → master, {DUR:.2f} s")
