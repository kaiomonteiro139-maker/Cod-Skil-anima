# Clean score + tonal SFX (no noise beds): emotional piano, soft strings at the CTA, hopeful lift on day 300, sting on "Por quê?".
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L13"]["e"]; DUR = VEND + 1.8
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
Am, F, C, G, Dm, E7 = [45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [50, 57, 62, 65], [40, 56, 59, 64]
def arp(chords, t0, t1, beat, v=0.5):
    t = t0; k = 0
    while t < t1 - 0.05:
        ch = chords[(k // 8) % len(chords)]
        if k % 8 == 0: place(mus, piano(ch[0] - 12, 3.0, v), t)
        place(mus, piano(ch[1 + k % 3] + 12, 1.8, v * 0.55), t); t += beat; k += 1
def pads(chords, t0, t1, each, v):
    t = t0; k = 0
    while t < t1 - 0.3: d = min(each + 0.8, t1 - t + 0.5); place(mus, pad(chords[k % len(chords)][1:], d, v), t); t += each; k += 1
arp([Am, F, C, G], 0, L["L8"], 60 / 76 / 2, 0.55); pads([Am, F, C, G], L["L4"], L["L8"], 60 / 76 * 4, 0.3)
pads([F, C, Dm, G], L["L8"], L["L9"], 1.4, 0.45)                                     # CTA: warm strings
arp([C, G, Am, F], L["L9"], L["L11"] + 1.0, 60 / 88 / 2, 0.55); pads([C, G, Am, F], L["L9"], L["L11"] + 1.0, 60 / 88 * 4, 0.3)   # hope
place(mus, piano(33, 4.0, 0.8), wt("latiu", L["L11"]) - 0.05); place(mus, pad([45, 52, 57, 60], 3.0, 0.4), wt("latiu", L["L11"]))
for i, m in enumerate([76, 75, 74]): place(mus, piano(m, 1.4, 0.55), L["L12"] + i * 0.18)   # sting
arp([Am, F, C, E7], L["L13"], DUR - 0.2, 60 / 92 / 2, 0.5)
mus[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
# tonal SFX
def woof(f0=520, d=0.22):
    n = int(d * SR); t = np.arange(n) / SR; f = f0 * (1 - 0.45 * t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(a * np.sin(k * ph) for k, a in [(1, 1), (2, 0.6), (3, 0.35), (4, 0.2)]); return bp(x, 250, 3500) * np.exp(-t / 0.07) * env(n, 0.008, 0.05)
def engine(d, f=55): n = int(d * SR); t = np.arange(n) / SR; return bp(tone(f + 6 * np.sin(t * 7), d, "saw"), 40, 400) * env(n, 0.3, 0.6)
def click(): n = int(0.05 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * 900 * t) * np.exp(-t / 0.008) + 0.6 * np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.005)
place(sfx, piano(84, 1.5, 0.35), 0.1)
place(sfx, engine(L["L3"] - L["L2"] + 0.5), L["L2"], 0.7)                               # car arrives
place(sfx, click(), wt("abriu", L["L3"]) - 0.05, 0.7); place(sfx, click(), wt("embora", L["L3"]) - 0.3, 0.7)
place(sfx, engine(2.5, 70), wt("embora", L["L3"]), 0.7)
for i in range(3): place(sfx, woof(600, 0.18), L["L4"] + 0.4 + i * 0.55, 0.5)          # little barks while chasing
for i in range(8): place(sfx, tone(330, 0.04) * np.exp(-np.arange(int(0.04 * SR)) / SR / 0.01), L["L4"] + i * 0.18, 0.25)   # paw taps
for x in [L["L6"] + 1.2, wt("o", L["L6"] + 0.6) + 1.2]: place(sfx, engine(1.6, 62), x, 0.6)
place(sfx, ding(1568) * 0.6, wt("segue", L["L8"]) - 0.1); place(sfx, coin(), wt("agora", L["L8"]) + 0.2, 0.8)   # follow pop + tap
place(sfx, engine(L["L10"] - L["L9"], 58), L["L9"], 0.7); place(sfx, click(), wt("porta", L["L10"]) - 0.1, 0.8)
tb = wt("latiu", L["L11"]); place(sfx, woof(500, 0.24), tb, 1.0); place(sfx, woof(470, 0.24), tb + 0.32, 1.0)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L13"] + 0.1 + i * 0.15)
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
