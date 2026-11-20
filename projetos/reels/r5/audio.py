# Reel 5 score + SFX: market hum + tense pulse → heavy footsteps + heartbeat → sad piano at her look → end card.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L7"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
Am, F, C, G, Dm, E7 = [45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [50, 57, 62, 65], [40, 56, 59, 64]
t = 0.0; k = 0
while t < L["L4"] - 0.05:                                         # tense pluck, sparse
    place(mus, pluck([69, 72, 76, 72][k % 4], 0.5, 0.55), t)
    if k % 4 == 0: place(mus, sub(45 - 12, 1.8, 0.45), t)
    t += 60 / 96; k += 1
place(mus, pad([45, 52, 57], L["L4"] + 0.3, 0.3), 0)
t = L["L4"]
while t < L["L5"] - 0.05: place(mus, kick(0.75), t); place(mus, kick(0.55), t + 0.2); t += 60 / 112     # heartbeat
place(mus, pad([40, 47, 52, 56], L["L5"] - L["L4"] + 0.3, 0.4), L["L4"])
t = L["L5"]; k = 0
while t < DUR - 0.3:                                              # sad piano
    ch = [Am, F, C, E7, Am, Dm, E7, Am][(k // 4) % 8]; place(mus, piano(ch[1 + k % 3] + 12, 2.0, 0.5), t)
    if k % 4 == 0: place(mus, piano(ch[0] - 12, 3.0, 0.55), t); place(mus, pad(ch[1:], 60 / 72 * 2 + 0.6, 0.25), t)
    t += 60 / 72 / 2; k += 1
mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
# sfx: market hum, can, scanner beep, footsteps, tear, price
sfx += bp(rng.standard_normal(len(sfx)), 120, 600) * 0.05 + 0.02 * tone(120, DUR) * 0.3
place(sfx, thump(300, 0.12), 0.5, 0.5); place(sfx, bp(rng.standard_normal(int(0.3 * SR)), 800, 4000) * env(int(0.3 * SR), 0.01, 0.15), 1.9, 0.6)   # can grab + bag rustle
for x in [0.9, 2.2]: place(sfx, tone(2400, 0.12) * env(int(0.12 * SR), 0.002, 0.02), x, 0.25)      # scanner beeps from the checkout
place(sfx, thump(55, 0.6), L["L2"], 0.8)
i = 0; t = L["L4"] + 0.3
while t < L["L5"] - 0.2: place(sfx, thump(90 + (i % 2) * 15, 0.18), t, 0.8); t += 0.42; i += 1  # guard footsteps
place(sfx, whoosh(0.5, 300, 2000), L["L5"] - 0.1, 0.5)
place(sfx, ding(1046) * 0.6, wt("vinte", L["L6"]) - 0.05)
place(sfx, riser(0.9), L["L7"] - 0.9, 0.4); place(sfx, thump(90, 0.3), L["L7"], 0.6)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L7"] + 0.2 + i * 0.2)
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
