# Synthesized suspense score + SFX stems for "A Última Corrida". Writes work/music.wav and work/sfx.wav (mono 44.1 kHz).
import numpy as np, wave
SR = 44100; DUR = 60.5; N = int(SR * DUR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def env(n, a=0.005, r=0.1):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(buf, x, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(x));
    if j > i: buf[i:j] += g * x[: j - i]
def lp(x, a):  # one-pole low-pass, a in (0,1): smaller = darker
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def lp_fast(x, cutoff):
    # FFT brick-ish low-pass (fast for long buffers)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x))
def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4)); return np.fft.irfft(X, len(x))
def tone(freq, d, kind="sine", decay=None):
    n = int(d * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(freq, n)) / SR if np.ndim(freq) else 2 * np.pi * freq * t
    if kind == "sine": x = np.sin(ph)
    elif kind == "saw": x = 2 * ((ph / (2 * np.pi)) % 1) - 1
    elif kind == "tri": x = 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1) - 1) - 1
    else: x = np.sign(np.sin(ph))
    if decay: x *= np.exp(-t / decay)
    return x
def noise(d): return rng.standard_normal(int(d * SR))

# ---------------- music ----------------
music = np.zeros(N)
STOP = 54.78  # "Senta" — the twist line: music cuts, low drone stays
BPM = 76; beat = 60 / BPM
# low drone (A1 + E2) with slow swell, all the way through
drone = 0.5 * tone(55, DUR, "saw") + 0.35 * tone(82.4, DUR, "saw") + 0.25 * tone(55.3, DUR, "saw")
drone = lp_fast(drone, 220) * (0.55 + 0.25 * np.sin(2 * np.pi * t_all / 9.0))
music += 0.5 * drone
# heartbeat kick pulse (lub-dub) from 7 s, speeding up a little inside the house
def kick(g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t / 0.03); return g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
tt = 7.0
while tt < STOP:
    bpm = 62 if tt < 28.5 else 70 if tt < 46.5 else 84
    place(music, kick(0.9), tt); place(music, kick(0.6), tt + 0.22)
    tt += 60 / bpm
# minor music-box arpeggio (A minor / F / E) — plucked, from 5 s
arp = [[220, 261.6, 329.6, 261.6], [174.6, 220, 261.6, 220], [164.8, 207.7, 246.9, 207.7], [220, 261.6, 329.6, 392]]
k = 0; tt = 5.0
while tt < STOP - 0.1:
    ch = arp[(k // 8) % 4]; f = ch[k % 4] * 2
    n = tone(f, 0.9, "tri", decay=0.25) * 0.5 + tone(f * 2, 0.9, "sine", decay=0.12) * 0.25
    place(music, n * env(len(n), 0.002, 0.2), tt, 0.32 if tt < 28.5 else 0.38)
    tt += beat / 2; k += 1
# rising tension string (inside the house)
n0 = int(28.5 * SR); n1 = int(STOP * SR); L = n1 - n0
fr = np.linspace(440, 560, L)
s = (tone(fr, L / SR, "saw") + tone(fr * 1.005, L / SR, "saw")) * np.linspace(0, 1, L) ** 1.5
music[n0:n1] += 0.16 * lp_fast(s, 2500)
# cut everything except the drone at STOP
cut = int(STOP * SR); keep = 0.5 * drone[cut:]
music[cut:] = keep * np.linspace(1.4, 1.0, N - cut)
# gentle clock tick on the poll
tt = 56.64
while tt < DUR - 0.2:
    tk = bp_fast(noise(0.04), 2000, 6000) * env(int(0.04 * SR), 0.001, 0.03); place(music, tk, tt, 0.35); tt += 0.5
music[: int(0.4 * SR)] *= np.linspace(0, 1, int(0.4 * SR))
music[-int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))

# ---------------- sfx ----------------
sfx = np.zeros(N)
def whoosh(d=0.6, lo=300, hi=2500):
    x = bp_fast(noise(d), lo, hi); e = np.sin(np.linspace(0, np.pi, len(x))) ** 2; return x * e
def engine(d, f0=42, f1=42, g=1.0):
    n = int(d * SR); f = np.linspace(f0, f1, n) * (1 + 0.04 * np.sin(2 * np.pi * 7 * np.arange(n) / SR))
    x = tone(f, d, "saw") + 0.5 * tone(f * 2, d, "sq"); return g * lp_fast(x, 380) * env(n, 0.2, 0.4)
def creak(d=0.7, f=180):
    n = int(d * SR); t = np.arange(n) / SR; ff = f * (1 + 0.3 * np.sin(2 * np.pi * 3 * t))
    x = tone(ff, d, "saw") * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 34 * t))); return bp_fast(x, 300, 2400) * env(n, 0.03, 0.2)
def thunk(f=90, d=0.35):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * np.cumsum(f + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.09) + 0.3 * lp_fast(noise(d), 1500) * np.exp(-t / 0.03))
def click():
    d = 0.12; n = int(d * SR); t = np.arange(n) / SR
    return bp_fast(noise(d), 1500, 7000) * np.exp(-t / 0.012) + 0.6 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.02)
def ting(f=1320, d=1.2): return (tone(f, d, "sine", 0.35) + 0.4 * tone(f * 2.76, d, "sine", 0.15))
def boom(d=2.5):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-t / 0.15)) / SR) * np.exp(-t / 0.9) + 0.4 * lp_fast(noise(d), 300) * np.exp(-t / 0.5)
def step(): return thunk(70, 0.18) * 0.5 + 0.2 * bp_fast(noise(0.08), 800, 3000)[: int(0.18 * SR)].copy().resize(int(0.18 * SR)) if False else thunk(70, 0.18) * 0.6
def pop():
    d = 0.18; n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(500 + 900 * t / d) / SR) * np.exp(-t / 0.05)

# ride: engine + passing lamps
place(sfx, engine(8.6, 46, 34, 0.9), 0.0)
for x in [1.2, 2.5, 3.9, 5.3, 6.6]: place(sfx, whoosh(0.7, 400, 3000), x - 0.35, 0.5)
place(sfx, ting(1760, 0.8) * 0.6 + ting(2217, 0.8) * 0.4, 6.1, 0.5)  # app ping on "Júlia"
place(sfx, engine(2.8, 30, 30, 0.45), 8.4)                         # idle at the gate
# wind ambience outside
w = bp_fast(noise(21.5), 200, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * np.arange(int(21.5 * SR)) / SR / 4.3) ** 2)
w *= env(len(w), 1.5, 1.5); place(sfx, w, 7.0, 0.55)
place(sfx, engine(6.8, 38, 38, 0.6), 11.0)                         # riding slowly down the street
place(sfx, creak(0.9, 140), 11.45, 0.6)                            # leaning lamp post
place(sfx, creak(0.8, 220), 12.85, 0.5)                            # roofless house beams
for i in range(5): place(sfx, ting(2600 + i * 90, 0.25) * 0.5, 14.15 + i * 0.07, 0.35)  # loose chain clinks
place(sfx, whoosh(1.0, 150, 800), 15.4, 0.6)
place(sfx, engine(1.6, 38, 20, 0.6), 16.4)                        # engine dies
for x in [18.14, 18.45]: place(sfx, tone(440, 0.22, "sq") * 0.6 + tone(554, 0.22, "sq") * 0.4, x, 0.35)  # horn bi-bi
place(sfx, creak(1.0, 120), 19.3, 0.8)                             # door opens by itself
place(sfx, thunk(55, 0.8), 20.6, 0.6)                              # silhouette appears
place(sfx, boom(1.6), 24.95, 0.5)                                  # "bonito demais"
for x in [27.6, 28.0, 28.4, 28.7, 29.1, 29.5, 29.85]: place(sfx, thunk(80, 0.16), x, 0.45)  # footsteps
hiss = bp_fast(noise(1.8), 2500, 8000) * env(int(1.8 * SR), 0.3, 0.8); place(sfx, hiss, 29.9, 0.18)
place(sfx, boom(2.5), 31.55, 0.55)                                 # "alguma coisa por baixo"
place(sfx, ting(990, 1.5), 34.1, 0.4)                              # helmets reveal
place(sfx, whoosh(0.9, 200, 1200), 36.6, 0.5); place(sfx, boom(1.8), 37.3, 0.55)
place(sfx, whoosh(0.5, 300, 2000), 41.3, 0.4)
for i, x in enumerate([42.26, 42.5, 42.74]): place(sfx, ting(1320 + 220 * i, 0.6), x, 0.3)
place(sfx, thunk(100, 0.4), 43.6, 0.9)                             # his bag lands on the table
place(sfx, thunk(70, 0.4), 44.14, 0.4)
buzz = np.concatenate([tone(150, 0.12, "sq") * 0.5, np.zeros(int(0.06 * SR)), tone(150, 0.12, "sq") * 0.5]); place(sfx, bp_fast(buzz, 200, 2000), 47.96, 0.7)
place(sfx, whoosh(0.35, 500, 4000), 49.45, 0.6)                    # whip to his face
place(sfx, thunk(60, 0.5), 49.5, 0.6)
place(sfx, click(), 50.5, 1.0); place(sfx, click(), 50.68, 0.9); place(sfx, thunk(120, 0.3), 50.7, 0.5)  # the key turns
fl = bp_fast(noise(1.4), 100, 400) * (np.sin(2 * np.pi * 60 * np.arange(int(1.4 * SR)) / SR) > 0) * env(int(1.4 * SR), 0.05, 0.2); place(sfx, fl, 52.2, 0.3)
for x in [51.8, 52.3, 52.8]: place(sfx, thunk(85, 0.16), x, 0.4)
scrape = bp_fast(noise(0.45), 300, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 45 * np.arange(int(0.45 * SR)) / SR)) * env(int(0.45 * SR), 0.02, 0.1)
place(sfx, scrape, 54.76, 0.8)                                     # chair pulled out
place(sfx, boom(3.0), 54.78, 1.0)                                  # twist sting
for x in [56.64, 57.4, 58.42, 59.0]: place(sfx, pop(), x, 0.6)

def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
save("work/music.wav", music); save("work/sfx.wav", sfx)
print("stems written", DUR, "s")
