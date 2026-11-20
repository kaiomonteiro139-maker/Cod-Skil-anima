# Reel 1 score + SFX: tense plucked pulse → stop at the twist → hopeful tip → end card riser.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L10"]["e"]; DUR = VEND + 2.0
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
Am, F, C, G, Dm, E7 = [45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [50, 57, 62, 65], [40, 56, 59, 64]
beat = 60 / 112 / 2; t = 0.0; k = 0
twist = wt("o", L["L8"] + 0.6)
while t < twist - 0.1:                                   # tense pluck ostinato in A minor
    ch = [Am, Am, F, E7][(k // 8) % 4]; place(mus, pluck(ch[1 + k % 3] + 12, 0.5, 0.6), t)
    if k % 8 == 0: place(mus, sub(ch[0] - 12, 8 * beat, 0.5), t)
    if k % 4 == 0 and t > L["L6"]: place(mus, kick(0.5), t)
    if k % 2 == 1 and t > L["L6"]: place(mus, hat(0.25), t)
    t += beat; k += 1
place(mus, pad([45, 52, 57], twist - L["L6"], 0.35), L["L6"])
place(mus, boom(), twist, 0.9)                           # the twist: everything drops
place(mus, pad([41, 48, 57, 60], L["L9"] - twist + 0.6, 0.4), twist)
t = L["L9"]; k = 0
while t < DUR - 0.3:                                     # tip + end card: hopeful
    ch = [C, G, Am, F][(k // 4) % 4]; place(mus, piano(ch[1 + k % 3] + 12, 1.6, 0.5), t)
    if k % 4 == 0: place(mus, piano(ch[0] - 12, 2.5, 0.5), t)
    t += 60 / 100; k += 1
mus[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
# sfx
place(sfx, coin(), 0.35, 1.0); place(sfx, whoosh(0.4, 400, 3000), 0.2, 0.5)
for tt in [L["L3"] + 0.7, wt("era", L["L4"]) - 0.1, wt("era", L["L4"]) + 1.3, wt("hora", L["L5"]) + 0.3]: place(sfx, ding(1320) * 0.6, tt)
place(sfx, whoosh(0.3, 800, 5000), wt("devolve", L["L5"]) - 0.1, 0.6); place(sfx, ding(1760), wt("devolve", L["L5"]) + 0.2, 0.5)
place(sfx, ring(min(2.2, L["L7"] - L["L6"])), L["L6"], 0.5); place(sfx, buzz(0.3), L["L6"] + 0.1, 0.5); place(sfx, buzz(0.3), L["L6"] + 1.1, 0.5)
place(sfx, buzz(0.5), wt("contestado", L["L7"]) - 0.05, 0.9); place(sfx, thump(55, 0.6), wt("os", L["L7"]), 0.8)
for i in range(3): place(sfx, tap(), L["L8"] + 0.1 + i * 0.12, 0.6)
place(sfx, coin(), L["L9"] + 0.3, 0.6)
place(sfx, riser(0.9), L["L10"] - 0.9, 0.5); place(sfx, thump(90, 0.3), L["L10"], 0.6)
for i in range(3): place(sfx, ding(1046 + i * 262) * 0.5, L["L10"] + 0.2 + i * 0.2)
sfx += bp(rng.standard_normal(len(sfx)), 200, 1500) * 0.015
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
