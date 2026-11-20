# Score + SFX for "Dinheiro fácil". Writes work/music.wav, work/sfx.wav (mono 44.1 kHz).
import numpy as np, wave, json
SR = 44100; DUR = 310.4; N = int(SR * DUR); rng = np.random.default_rng(9); T = np.arange(N) / SR
S = [s["s"] for s in json.load(open("work/sents.json"))]
def env(n, a=0.005, r=0.1):
    e = np.ones(n); na = max(1, min(n, int(a * SR))); nr = max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(b, x, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(x))
    if j > i: b[i:j] += g * x[: j - i]
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4)); return np.fft.irfft(X, len(x))
def tone(f, d, kind="sine"):
    n = int(d * SR); ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, n).astype(float)) / SR; return np.sin(ph) if kind == "sine" else 2 * ((ph / (2 * np.pi)) % 1) - 1
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
def piano(m, d=2.5, v=1.0):
    n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.3 + k * 0.9)) for k, a in [(1, 1), (2, 0.4), (3, 0.18)]) * env(n, 0.004, 0.3)
def pad(ms, d, v=1.0):
    n = int(d * SR); x = sum(tone(mid(m) * (1 + dt), d, "saw") for m in ms for dt in (-0.004, 0.004)); return v * bp(x, 80, 1400) / (2 * len(ms)) * env(n, min(1.5, d / 3), min(1.5, d / 3))
def kick(g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR; return g * np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12)
def hat(g=1.0): n = int(0.05 * SR); return g * bp(rng.standard_normal(n), 6000, 12000) * np.exp(-np.arange(n) / SR / 0.012)
mus = np.zeros(N)
Am, F, C, G, Dm, E = [45, 57, 60, 64], [41, 53, 57, 60], [48, 55, 60, 64], [43, 55, 59, 62], [50, 57, 62, 65], [40, 56, 59, 64]
def arp(chords, t0, t1, beat, v=0.5, bass=True):
    t = t0; k = 0
    while t < t1 - 0.05:
        ch = chords[(k // 8) % len(chords)]
        if bass and k % 8 == 0: place(mus, piano(ch[0] - 12, 3.0, v), t)
        place(mus, piano(ch[1 + k % 3] + 12, 1.8, v * 0.55), t); t += beat; k += 1
def pads(chords, t0, t1, each, v=0.3):
    t = t0; k = 0
    while t < t1 - 0.5: d = min(each + 0.8, t1 - t); place(mus, pad(chords[k % len(chords)][1:], d, v), t); t += each; k += 1
# sections (by sentence)
arp([Am, F, C, E], 0.0, S[23], 60 / 70 / 2, 0.45); pads([Am, F, C, E], 0.0, S[23], 3.4, 0.25)
tt = S[23]
while tt < S[31]: place(mus, kick(0.6), tt); place(mus, kick(0.4), tt + 0.22); tt += 60 / 96          # first day: heartbeat
pads([Am, Dm], S[23], S[31], 3.0, 0.3)
arp([C, G, Am, F], S[31], S[41], 60 / 92 / 2, 0.45); tt = S[31]
while tt < S[41]: place(mus, kick(0.5), tt); place(mus, hat(0.4), tt + 60 / 92 / 2); tt += 60 / 92     # the good life: light groove
pads([Dm, Am], S[41], S[49], 4.0, 0.3); place(mus, piano(33, 4.0, 0.7), S[45])                            # the news: dark, one low hit
arp([Am, F, Dm, E], S[49], S[64], 60 / 64 / 2, 0.38); pads([Am, Dm], S[53], S[64], 3.5, 0.3)
tt = S[53]
while tt < S[64]: place(mus, kick(0.35), tt); tt += 60 / 70                                              # paranoia pulse
pads([[40, 47, 52, 55]], S[64], S[83], 5.0, 0.35); tt = S[64]
while tt < S[71]: place(mus, kick(0.6), tt); place(mus, kick(0.45), tt + 0.2); tt += 60 / 110              # police
arp([Am, F, C, G], S[83], S[99], 60 / 62 / 2, 0.42); pads([Am, F, C, G], S[83], S[99], 3.9, 0.25)
arp([F, G, C, Am], S[99], DUR - 0.5, 60 / 68 / 2, 0.4); place(mus, pad([60, 64, 67], DUR - S[99], 0.3), S[99])
mus[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
# ---------------- sfx ----------------
sfx = np.zeros(N)
def thump(f=60, d=0.5, g=1.0):
    n = int(d * SR); t = np.arange(n) / SR; return g * (np.sin(2 * np.pi * np.cumsum(f + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.12) + 0.4 * bp(rng.standard_normal(n), 200, 1500) * np.exp(-t / 0.03))
def ding(f=1760): n = int(0.9 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.3) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t) * np.exp(-t / 0.25))
def buzz(d=0.35): return bp(tone(150, d, "saw"), 100, 1500) * env(int(d * SR), 0.01, 0.05)
def typing(t0, t1, g=0.4):
    t = t0
    while t < t1: n = int(0.03 * SR); place(sfx, bp(rng.standard_normal(n), 1500, 6000) * np.exp(-np.arange(n) / SR / 0.006), t, g * (0.6 + 0.4 * rng.random())); t += 0.08 + rng.random() * 0.1
for x in [S[2] + 0.3, S[6] + 0.3, S[8] + 0.3, S[19] + 1.4, S[59] + 0.3, S[78] + 0.1]: place(sfx, ding(1320) * 0.5, x, 0.5)   # phone notifications
place(sfx, ding(1568), S[9] + 0.1, 0.5)
typing(S[23], S[24], 0.35); typing(S[31], S[32], 0.35); typing(S[39], S[41], 0.3)
for x in [S[26] + 0.1, S[26] + 0.6]: place(sfx, buzz(), x, 0.8)                                       # phone vibrates
place(sfx, ding(2093) + ding(2637) * 0.6, S[27] - 0.1, 0.8)                                            # o dinheiro caiu
for k in range(4): place(sfx, ding(1760 + k * 220) * 0.4, S[35] + 0.4 + k * 0.6, 0.4)                  # shopping
jingle = sum(piano(m, 1.2, 0.5) for m in [72]); place(sfx, piano(72, 1.0, 0.6), S[41] + 0.2); place(sfx, piano(76, 1.0, 0.6), S[41] + 0.45); place(sfx, piano(79, 1.4, 0.6), S[41] + 0.7)   # TV news jingle
place(sfx, thump(40, 1.5, 1.0), S[45], 0.8)
for x in [S[64] + 3.0, S[64] + 3.35, S[64] + 3.7]: place(sfx, thump(70, 0.4), x, 1.2)                  # heavy knocks
place(sfx, bp(rng.standard_normal(int(0.7 * SR)), 300, 1800) * env(int(0.7 * SR), 0.05, 0.3), S[69], 0.5)  # bedroom door
place(sfx, thump(45, 1.2), S[69] + 0.4, 0.6)
for x in [S[71] + 0.5, S[71] + 1.6]: place(sfx, thump(110, 0.25), x, 0.5)                              # boxes, car doors
place(sfx, thump(40, 1.5), S[78], 0.6); place(sfx, ding(660) * 0.5, S[78] + 0.2, 0.6)
amb = bp(rng.standard_normal(N), 200, 1500) * 0.06; sfx += amb
def save(p, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9; w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
save("work/music.wav", mus); save("work/sfx.wav", sfx); print("stems ok")
