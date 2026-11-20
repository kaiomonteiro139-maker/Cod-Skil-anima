# Reel 2 score + SFX: warm café groove → ticking months → silence → ironic beach tune → hit → end card.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L9"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
C, G, Am, F = [48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]
t = 0.0; k = 0; b = 60 / 104 / 2
while t < L["L4"] - 0.1:                               # friendly café groove
    ch = [C, Am, F, G][(k // 8) % 4]; place(mus, piano(ch[1 + k % 3] + 12, 1.4, 0.5), t)
    if k % 8 == 0: place(mus, piano(ch[0] - 12, 2.5, 0.55), t)
    if k % 4 == 2: place(mus, clap(0.25), t)
    t += b; k += 1
t = L["L4"]                                              # months: clock ticks + low pulse
while t < L["L6"] - 0.1: place(mus, tap(), t, 0.9); place(mus, kick(0.45), t) if int((t - L["L4"]) / 0.5) % 2 == 0 else None; t += 0.5
place(mus, pad([45, 52, 57], L["L6"] - L["L4"], 0.35), L["L4"])
hit = wt("com", L["L7"]); t = L["L6"]; k = 0           # ironic tropical tune until the hit
while t < hit - 0.05:
    ch = [C, F, G, C][(k // 4) % 4]; place(mus, pluck(ch[1 + k % 3] + 24, 0.4, 0.55), t); place(mus, pluck(ch[(k + 1) % 3 + 1] + 19, 0.3, 0.3), t + b * 0.5)
    if k % 2 == 0: place(mus, kick(0.4), t)
    if k % 2 == 1: place(mus, clap(0.3), t)
    t += b * 2 * 0.75; k += 1
place(mus, boom(), hit, 0.9)
place(mus, pad([40, 47, 52, 55], L["L9"] - hit + 0.4, 0.45), hit)
t = L["L9"]; k = 0
while t < DUR - 0.2:
    ch = [Am, F, C, G][k % 4]; place(mus, piano(ch[0], 2.2, 0.5), t); place(mus, piano(ch[2] + 12, 1.6, 0.4), t + 0.3); t += 0.6; k += 1
mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
# sfx
place(sfx, bp(rng.standard_normal(int(DUR * SR)), 300, 3000) * 0.0, 0)
for c in [0.4, 1.4, 2.6]: place(sfx, ding(2200) * 0.15, c)                # café cups clink
place(sfx, coin(), wt("empresta", L["L3"]) + 0.1, 0.8); place(sfx, whoosh(0.5), wt("empresta", L["L3"]), 0.4)
for x in [L["L4"], L["L4b"], L["L4c"]]: place(sfx, thump(90, 0.3), x, 0.8); place(sfx, whoosh(0.25, 800, 5000), x - 0.15, 0.4); place(sfx, ding(1320) * 0.5, x + 0.15)
for i in range(4): place(sfx, tap(), L["L5"] + 0.15 + i * 0.1, 0.6)
place(sfx, whoosh(0.6, 400, 4000), L["L6"] + 0.2, 0.5)
place(sfx, ding(1760) * 0.6, L["L7"] + 0.1); place(sfx, ding(2093) * 0.5, L["L7"] + 0.25)
place(sfx, thump(45, 0.8), hit, 0.9)
place(sfx, ding(1320) * 0.6, wt("quem", L["L8"]) - 0.1)
place(sfx, riser(0.9), L["L9"] - 0.9, 0.5); place(sfx, thump(90, 0.3), L["L9"], 0.6)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L9"] + 0.2 + i * 0.2)
sfx += bp(rng.standard_normal(len(sfx)), 200, 1500) * 0.015
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
