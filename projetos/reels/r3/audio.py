# Reel 3 score + SFX: night suspense → cash hit → heartbeat → sad piano at the receipt → end card.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L9"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
Am, F, C, G, Dm, E7 = [45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [50, 57, 62, 65], [40, 56, 59, 64]
tCash = wt("cinquenta", L["L2"])
place(mus, pad([33, 40, 45], tCash + 0.2, 0.45), 0)                       # low night drone
for i, m in enumerate([69, 72, 76, 72, 69, 72]): place(mus, piano(m, 1.6, 0.45), 0.2 + i * 0.34)
place(mus, riser(tCash - L["L2"]), L["L2"], 0.6); place(mus, boom(), tCash, 0.7)
place(mus, pad([57, 61, 64, 69], 1.6, 0.4), tCash)                       # shiny major chord on the cash
t = L["L3"]
while t < L["L4"] - 0.2: place(mus, kick(0.7), t); place(mus, kick(0.5), t + 0.2); t += 60 / 100   # heartbeat
place(mus, pad([45, 52, 57], L["L4"] - L["L3"], 0.3), L["L3"])
t = L["L4"]; k = 0
while t < DUR - 0.3:                                                     # sad piano: Am F C E → ending
    ch = [Am, F, C, E7, Am, F, Dm, E7][(k // 4) % 8]; place(mus, piano(ch[1 + k % 3] + 12, 2.0, 0.5), t)
    if k % 4 == 0: place(mus, piano(ch[0] - 12, 3.0, 0.55), t); place(mus, pad(ch[1:], 60 / 76 * 4 * 0.5 + 0.6, 0.25), t)
    t += 60 / 76 / 2 * 1.0; k += 1
mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
# sfx: footsteps, zipper, coin, wind, paper
for i in range(int((L["L2"] - 0.4) / 0.42)): place(sfx, thump(150, 0.08), 0.15 + i * 0.42, 0.35)
place(sfx, bp(rng.standard_normal(int(0.5 * SR)), 2500, 8000) * np.abs(np.sin(np.linspace(0, 40, int(0.5 * SR)))), wt("e", L["L2"]) - 0.35, 0.6)   # zipper
place(sfx, coin(), tCash + 0.05, 0.9)
place(sfx, whoosh(1.2, 200, 1200), L["L3"] + 0.3, 0.5); place(sfx, whoosh(1.0, 200, 1200), wt("nenhuma", L["L3"]), 0.5)
place(sfx, bp(rng.standard_normal(int(0.4 * SR)), 1500, 7000) * env(int(0.4 * SR), 0.01, 0.2), L["L4"] + 0.1, 0.5)   # paper
place(sfx, thump(70, 0.5), L["L6"], 0.7)
place(sfx, riser(0.9), L["L9"] - 0.9, 0.4); place(sfx, thump(90, 0.3), L["L9"], 0.6)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L9"] + 0.2 + i * 0.2)
sfx += bp(rng.standard_normal(len(sfx)), 150, 900) * 0.03                 # night wind
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
