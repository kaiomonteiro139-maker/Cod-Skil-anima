# Score + SFX for the lion fable: quiet savanna ambience, low tense music, kicks/shoves, night crickets, a soft growl.
import sys, json; sys.path.insert(0, "/root/shorts/reels/tools"); from synth import *
sp = {s["id"]: s for s in json.load(open("work/spans.json"))}; WT = json.load(open("work/words.json"))
L = {k: v["s"] for k, v in sp.items()}; VEND = sp["L19"]["e"]; DUR = VEND + 1.6
def wt(w, after=0): return next((x["s"] for x in WT if x["s"] >= after - 0.01 and x["w"].lower().strip(".,!?:") == w), after)
mus, sfx = buf(DUR), buf(DUR)
Dm, Bb, F, C, Am, Gm = [50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64], [45, 52, 57, 60], [43, 50, 55, 58]
# music: low pads + soft tom pulse; rises with the fights, sad at night, warm at the lesson
def pads(chords, t0, t1, each, v):
    t = t0; k = 0
    while t < t1 - 0.3: d = min(each + 1.0, t1 - t + 0.6); place(mus, pad(chords[k % len(chords)][1:], d, v), t); place(mus, sub(chords[k % len(chords)][0] - 12, d, v * 0.8), t); t += each; k += 1
pads([Dm, Bb, F, C], 0, L["L9"], 3.4, 0.45)
t = L["L5"]
while t < L["L9"]: place(mus, kick(0.35), t); t += 60 / 70
pads([Dm, Gm, Bb, Am], L["L9"], L["L11"], 2.4, 0.5); t = L["L9"]
while t < L["L11"]: place(mus, kick(0.6), t); place(mus, kick(0.35), t + 0.3); place(mus, snare(0.2), t + 0.6); t += 60 / 100 * 2
pads([Dm, Bb], L["L11"], L["L15"], 4.0, 0.4)
for i, m in enumerate([74, 72, 69, 65, 69, 72, 74, 77]): place(mus, piano(m, 2.5, 0.35), L["L11"] + 0.3 + i * 0.9)
pads([F, C, Dm, Bb], L["L15"], L["L17"], 3.0, 0.45)
pads([Bb, F, C, F], L["L17"], DUR, 2.6, 0.5)
for i, m in enumerate([65, 69, 72, 77]): place(mus, piano(m, 3.0, 0.45), L["L18"] + i * 0.35)
mus[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR))
# ambience: wind + insects by day, crickets at night
N = len(sfx); tt = np.arange(N) / SR
wind = bp(rng.standard_normal(N), 150, 900) * (0.6 + 0.4 * np.sin(tt * 0.4))
ins = bp(rng.standard_normal(N), 4000, 7000) * (0.5 + 0.5 * np.sin(tt * 2 * np.pi * 9)) * 0.25
night = ((tt > L["L11"]) & (tt < L["L13"])) | ((tt > L["L17"]) & (tt < L["L18"]))
crick = np.sin(2 * np.pi * 4300 * tt) * ((np.sin(2 * np.pi * 18 * tt) > 0.6) * (np.sin(2 * np.pi * 0.9 * tt) > 0)) * 0.35
sfx += wind * 0.5 + np.where(night, crick, ins)
# events
place(sfx, whoosh(0.6, 200, 2000), 0.0, 1.2)
place(sfx, thump(45, 1.0), wt("mordida", L["L2"]) - 0.05, 1.0)                                # jaw snap on nothing
place(sfx, bp(tone(np.linspace(90, 70, int(1.2 * SR)), 1.2, "saw"), 60, 700) * env(int(1.2 * SR), 0.2, 0.5), wt("mordida", L["L2"]) + 0.1, 1.2)   # weak growl
for i in range(6): place(sfx, thump(140, 0.1), L["L3"] + 0.2 + i * 0.5, 0.6)                 # tired paws
for i in range(24): place(sfx, thump(110 + (i % 3) * 20, 0.08), L["L4"] + i * 0.14, 0.35)     # hooves of the herd
for x in [L["L6"] + 1.4, L["L7"] + 0.4]: place(sfx, bp(rng.standard_normal(int(1.0 * SR)), 2500, 8000) * env(int(1.0 * SR), 0.2, 0.4), x, 0.8)   # whisper hiss
place(sfx, boom(), L["L8"], 0.8)
te = wt("empurrão", L["L9"]); place(sfx, thump(80, 0.4), te, 1.4); place(sfx, whoosh(0.4), te - 0.2, 0.8)
tk = wt("coice", L["L10"])
for i in range(4): place(sfx, thump(95, 0.25), tk + i * 0.46, 1.4); place(sfx, whoosh(0.25, 600, 4000), tk - 0.12 + i * 0.46, 0.6)
place(sfx, thump(40, 1.2), L["L13"], 0.7); place(sfx, thump(40, 1.2), L["L16"], 0.7)
place(sfx, bp(tone(np.linspace(75, 60, int(1.6 * SR)), 1.6, "saw"), 50, 600) * env(int(1.6 * SR), 0.3, 0.6), wt("derrota", L["L17"]) - 0.2, 1.4)   # low growl
place(sfx, whoosh(0.8, 300, 3000), L["L19"] - 0.3, 0.8)
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems", round(DUR, 2), "s")
