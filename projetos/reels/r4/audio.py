# Reel 4 score + SFX: drum roll + balls → jackpot fanfare → sneaky pizzicato (family/friends) → record stop at the cousin → suspicious bass → end card.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L8"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
tWin = wt("quarenta", L["L1"])
t = 0.1
while t < tWin - 0.05: place(mus, snare(0.25 + 0.4 * t / tWin), t); t += 0.07              # drum roll
for i, m in enumerate([60, 64, 67, 72]): place(mus, piano(m, 2.5, 0.7), tWin + i * 0.09)    # fanfare
place(mus, pad([60, 64, 67, 72], 2.5, 0.5), tWin); place(mus, boom(), tWin, 0.5)
t = L["L2"]; k = 0
while t < L["L5"] - 0.1:                                                                   # sneaky pizzicato in D minor
    m = [62, 65, 69, 65, 64, 67, 70, 67][k % 8]; place(mus, pluck(m, 0.35, 0.7), t)
    if k % 4 == 0: place(mus, pluck(m - 24, 0.5, 0.8), t)
    if k % 2 == 1: place(mus, hat(0.25), t)
    t += 60 / 128; k += 1
t = L["L5"]; k = 0
while t < L["L6"] - 0.05: place(mus, pluck(50 - (k % 2), 0.45, 0.8), t); t += 0.36; k += 1   # creeping bass
stop = L["L6"]; place(sfx, tone(np.linspace(600, 60, int(0.4 * SR)), 0.4, "saw") * env(int(0.4 * SR), 0.005, 0.1) * 0.5, stop - 0.35, 0.7)   # record stop
t = L["L7"]; k = 0
while t < DUR - 0.3:
    ch = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 61]][(k // 4) % 4]; place(mus, pluck(ch[1 + k % 3] + 12, 0.4, 0.6), t)
    if k % 4 == 0: place(mus, sub(ch[0] - 12, 1.5, 0.5), t); place(mus, kick(0.5), t)
    t += 60 / 120; k += 1
mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
for i in range(6): place(sfx, thump(220, 0.12), 0.15 + (tWin - 0.35) * i / 6, 0.6)          # balls dropping
place(sfx, coin(), tWin + 0.02, 0.9); place(sfx, coin(), tWin + 0.3, 0.6)
place(sfx, bp(rng.standard_normal(int(0.5 * SR)), 1500, 7000) * env(int(0.5 * SR), 0.01, 0.2), L["L3"] + 0.6, 0.4)   # papers
place(sfx, ding(2200) * 0.2, L["L4"] + 0.3)
place(sfx, ding(1320) * 0.7, L["L6"] - 0.05); place(sfx, ding(1320) * 0.6, L["L6"] + 0.65)
place(sfx, thump(60, 0.4), L["L7"], 0.7)
place(sfx, riser(0.9), L["L8"] - 0.9, 0.4); place(sfx, thump(90, 0.3), L["L8"], 0.6)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L8"] + 0.2 + i * 0.2)
sfx += bp(rng.standard_normal(len(sfx)), 200, 1500) * 0.015
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
