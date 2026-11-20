# Cheerful clean island tune (plucked "ukulele" + marimba + soft bass/kick) and tonal SFX only — no noise.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L5"]["e"]; DUR = VEND + 4.2
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
C, G, Am, F = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]
def marimba(m, d=0.5, v=1.0): n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)) * np.exp(-t / 0.18) * env(n, 0.002, 0.05)
b = 60 / 116 / 2; t = 0.0; k = 0
while t < DUR - 0.3:
    ch = [C, G, Am, F][(k // 8) % 4]
    for j, m in enumerate(ch[1:]): place(mus, pluck(m + 12, 0.35, 0.45), t + j * 0.012) if k % 2 == 0 else None   # strum
    if k % 8 in (0, 3, 6): place(mus, marimba([72, 76, 79, 81, 79, 76, 74, 72][(k // 2) % 8] - (0 if ch is C else 2), 0.5, 0.5), t)
    if k % 4 == 0: place(mus, sub(ch[0] - 12, 4 * b, 0.55), t); place(mus, kick(0.35), t)
    t += b; k += 1
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
def boing(f0=300, d=0.35): n = int(d * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.8 * np.exp(-tt / 0.06))) / SR) * np.exp(-tt / 0.12)
def chime(t0, base=1568): [place(sfx, ding(base * 2 ** (i / 6)) * 0.5, t0 + i * 0.06) for i in range(5)]
def tick(): n = int(0.03 * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * 1200 * tt) * np.exp(-tt / 0.006)
place(sfx, boing(240), wt("zero", 0) - 0.05, 0.9)                                   # counter pops in
chime(wt("casinha", L["L3"]) - 0.05); place(sfx, boing(380), wt("casinha", L["L3"]), 0.7)    # house pops
place(sfx, ding(1568) * 0.6, wt("seguir", L["L3"]) - 0.1); place(sfx, coin(), wt("ganha", L["L3"]) + 0.25, 0.8)
place(sfx, ding(1046) * 0.5, L["L3b"] + 0.1)
for i in range(14): place(sfx, tick(), L["L4"] + 0.45 + i * 0.11, 0.5)              # typing the name
place(sfx, boing(320), wt("você", L["L4"]) - 0.15, 0.7)                             # bean appears
place(sfx, ding(1568) * 0.6, VEND + 0.5)
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
