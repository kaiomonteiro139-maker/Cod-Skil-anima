# Emotional score (piano + strings) and SFX stems for "O Sonho do Caio" Parte 1. Writes work/music.wav and work/sfx.wav.
import numpy as np, wave
SR = 44100; DUR = 62.0; N = int(SR * DUR); rng = np.random.default_rng(5); T = np.arange(N) / SR
def env(n, a=0.005, r=0.1):
    e = np.ones(n); na = max(1, min(n, int(a * SR))); nr = max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(buf, x, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(x))
    if j > i: buf[i:j] += g * x[: j - i]
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4)); return np.fft.irfft(X, len(x))
def lp(x, c): return bp(x, 1, c)
def noise(d): return rng.standard_normal(int(d * SR))
def tone(f, d, kind="sine"):
    n = int(d * SR); ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, n).astype(float)) / SR
    return np.sin(ph) if kind == "sine" else 2 * ((ph / (2 * np.pi)) % 1) - 1
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
def piano(m, d=2.2, v=1.0):
    f = mid(m); n = int(d * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * k * t * (1 + 0.0004 * k)) * np.exp(-t * (1.6 + k * 0.9)) for k, a in [(1, 1), (2, 0.45), (3, 0.22), (4, 0.1)])
    return v * x * env(n, 0.004, 0.3)
def strings(ms, d, v=1.0):
    n = int(d * SR); x = np.zeros(n)
    for m in ms:
        for dt in (-0.004, 0.0, 0.005): x += tone(mid(m) * (1 + dt) * (1 + 0.003 * np.sin(2 * np.pi * 5 * np.arange(n) / SR)), d, "saw")
    return v * lp(x, 1800) / (3 * len(ms)) * env(n, min(0.9, d / 3), min(1.2, d / 3))
music = np.zeros(N)
# chords (MIDI): C, G/B, Am, F  (hopeful)  and Am, F, C, G (bittersweet)
C, Gb, Am, F, G, Em = [48, 55, 60, 64, 67], [47, 55, 59, 62, 67], [45, 52, 57, 60, 64], [41, 53, 57, 60, 65], [43, 55, 59, 62, 67], [40, 52, 55, 59, 64]
def arp(chords, t0, t1, beat, v=0.5, pattern=(0, 2, 3, 4, 3, 2), bass=True):
    t = t0; i = 0; k = 0
    while t < t1 - 0.05:
        ch = chords[(k // len(pattern)) % len(chords)]; p = pattern[k % len(pattern)]
        if k % len(pattern) == 0 and bass: place(music, piano(ch[0] - 12, 3.0, v * 0.9), t)
        place(music, piano(ch[p % len(ch)] + 12, 1.8, v * 0.55), t); t += beat; k += 1
# 0–21.3: tender piano, I–V–vi–IV, 76 bpm eighths
arp([C, Gb, Am, F], 0.2, 21.3, 60 / 76 / 2, 0.5)
for i, ch in enumerate([C, Gb, Am, F, C, Gb, Am]): place(music, strings(ch[2:], 3.4, 0.16), 7.7 + i * 1.9)
# 21.3–35.8: the scout + dribble: more motion, soft pulse
arp([Am, F, C, G], 21.3, 28.6, 60 / 88 / 2, 0.5)
arp([C, G, Am, F], 28.6, 35.8, 60 / 100 / 2, 0.6, pattern=(0, 2, 4, 2, 3, 4, 3, 2))
def kick(g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR; return g * np.sin(2 * np.pi * np.cumsum(50 + 80 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12)
tt = 25.4
while tt < 35.8:
    place(music, kick(0.5 if tt < 28.6 else 0.7), tt); sh = bp(noise(0.06), 5000, 10000) * env(int(0.06 * SR), 0.002, 0.05); place(music, sh, tt + 60 / 100 / 2, 0.25); tt += 60 / (88 if tt < 28.6 else 100)
place(music, strings([60, 64, 67, 72], 7.3, 0.22), 28.6)
# 35.8–41.2: joy peak
arp([C, F, Am, G], 35.8, 41.2, 60 / 100 / 2, 0.65, pattern=(0, 2, 4, 2, 3, 4, 3, 2))
place(music, strings([60, 64, 67, 72, 76], 5.6, 0.3), 35.8)
# 41.2: the wallet — everything stops but one held note; 43.5 "doze reais" single low note
place(music, piano(64, 3.0, 0.5), 41.25); place(music, strings([57], 4.5, 0.1), 41.4)
place(music, piano(45, 3.5, 0.6), 43.55); place(music, piano(57, 3.0, 0.3), 43.55)
# 45.7–49.4: bittersweet minor
for i, ch in enumerate([Am, F, C, Em]): place(music, piano(ch[0] - 12, 2.5, 0.5), 45.7 + i * 0.92); place(music, strings(ch[2:], 1.4, 0.14), 45.7 + i * 0.92)
# 49.4–62: hope rises to the end card
arp([F, G, Am, C], 49.5, 61.0, 60 / 84 / 2, 0.55)
place(music, strings([53, 57, 60, 65], 3.0, 0.2), 49.5); place(music, strings([55, 59, 62, 67], 3.0, 0.22), 52.3); place(music, strings([57, 60, 64, 69], 3.0, 0.24), 55.1); place(music, strings([60, 64, 67, 72], 4.9, 0.28), 57.9)
place(music, piano(72, 3.5, 0.5), 58.2); place(music, piano(76, 3.5, 0.4), 58.2)
music[-int(1.6 * SR):] *= np.linspace(1, 0, int(1.6 * SR))

# ---------------- sfx ----------------
sfx = np.zeros(N)
def thump(f=110, d=0.18, g=1.0):
    n = int(d * SR); t = np.arange(n) / SR; return g * (np.sin(2 * np.pi * np.cumsum(f + 90 * np.exp(-t / 0.01)) / SR) * np.exp(-t / 0.05) + 0.3 * bp(noise(d), 300, 3000) * np.exp(-t / 0.015))
def whoosh(d=0.5, lo=300, hi=2500): x = bp(noise(d), lo, hi); return x * np.sin(np.linspace(0, np.pi, len(x))) ** 2
def ting(f=1320, d=1.0): t = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.3) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.12)
def rustle(d=0.4): return bp(noise(d), 1500, 7000) * env(int(d * SR), 0.02, 0.15) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 12, int(d * SR)))))
def pop():
    d = 0.16; n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(500 + 900 * t / d) / SR) * np.exp(-t / 0.05)
amb = bp(noise(DUR), 300, 2000) * 0.2 + bp(noise(DUR), 2500, 6000) * 0.06 * (0.6 + 0.4 * np.sin(2 * np.pi * T / 3))
for a, b, g in [(0, 13.8, 1), (21.3, 35.8, 1), (49.4, 62, 0.6)]:
    m = (T >= a) & (T < b); sfx[m] += amb[m] * g
for x in np.arange(0.0, 4.6, 0.72): place(sfx, thump(150, 0.15), x + 0.0, 0.6)          # juggling touches
for x in np.arange(7.8, 10.8, 0.42): place(sfx, thump(120, 0.12), x, 0.25)             # dribbling far
place(sfx, thump(90, 0.25), 12.35, 1.0); place(sfx, whoosh(0.5, 400, 3000), 12.4, 0.4)  # the kick through the flip-flops
for i, x in enumerate(np.arange(13.9, 15.9, 0.55)): place(sfx, thump(70, 0.15), x, 0.35)   # mother's steps
place(sfx, bp(noise(0.5), 600, 2400) * env(int(0.5 * SR), 0.02, 0.2), 16.0, 0.3)        # cupboard creak
for x in np.arange(28.6, 31.3, 0.27): place(sfx, thump(130, 0.12), x, 0.35)             # dribble touches
for x in [29.4, 30.0, 30.6]: place(sfx, thump(60, 0.35), x + 0.15, 0.8); place(sfx, whoosh(0.3, 500, 4000), x - 0.1, 0.5)
place(sfx, rustle(0.5), 31.5, 0.8); place(sfx, rustle(0.4), 32.65, 0.6)               # paper
for x in np.arange(35.9, 38.4, 0.21): place(sfx, thump(95, 0.12), x, 0.4)              # running up the stairs
place(sfx, bp(noise(0.6), 300, 1800) * env(int(0.6 * SR), 0.05, 0.3), 38.6, 0.4)       # door
for i, f in enumerate([1568, 1976, 2349, 3136]): place(sfx, ting(f, 0.8), 38.8 + i * 0.09, 0.25)  # joy sparkle
place(sfx, thump(200, 0.08), 41.6, 0.6); place(sfx, bp(noise(0.25), 800, 3000) * env(int(0.25 * SR), 0.01, 0.1), 41.65, 0.4)  # wallet snap
for i, x in enumerate([42.6, 42.75]): place(sfx, ting(3200 + i * 250, 0.5), x, 0.35)        # coins
bus = lp(tone(38 * (1 + 0.03 * np.sin(np.arange(int(3.8 * SR)) / SR * 2 * np.pi * 9)), 3.8, "saw"), 300) * env(int(3.8 * SR), 0.4, 0.6)
place(sfx, bus, 45.6, 0.5); place(sfx, bp(noise(3.8), 400, 3000) * env(int(3.8 * SR), 0.4, 0.6), 45.6, 0.12)
for x in [52.1, 52.6, 53.0, 55.0, 58.3]: place(sfx, pop(), x, 0.6)
def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    w = wave.open(name, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
save("work/music.wav", music); save("work/sfx.wav", sfx); print("stems ok")
