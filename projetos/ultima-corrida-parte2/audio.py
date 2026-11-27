# Synthesized suspense score + SFX stems for "A Última Corrida" Parte 2. Writes work/music.wav and work/sfx.wav (mono 44.1 kHz).
import numpy as np, wave
SR = 44100; DUR = 38.0; N = int(SR * DUR)
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
STOP = 26.78  # "para de sorrir": music cuts, low drone stays
BPM = 76; beat = 60 / BPM
drone = 0.5 * tone(55, DUR, "saw") + 0.35 * tone(82.4, DUR, "saw") + 0.25 * tone(55.3, DUR, "saw")
drone = lp_fast(drone, 220) * (0.55 + 0.25 * np.sin(2 * np.pi * t_all / 9.0))
music += 0.5 * drone
def kick(g=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t / 0.03); return g * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
tt = 0.3
while tt < STOP:
    bpm = 80 if tt < 13 else 90 if tt < 20.6 else 100
    place(music, kick(0.9), tt); place(music, kick(0.6), tt + 0.22); tt += 60 / bpm
arp = [[220, 261.6, 329.6, 261.6], [174.6, 220, 261.6, 220], [164.8, 207.7, 246.9, 207.7], [220, 261.6, 329.6, 392]]
k = 0; tt = 0.2
while tt < STOP - 0.1:
    ch = arp[(k // 8) % 4]; f = ch[k % 4] * 2
    n = tone(f, 0.9, "tri", decay=0.25) * 0.5 + tone(f * 2, 0.9, "sine", decay=0.12) * 0.25
    place(music, n * env(len(n), 0.002, 0.2), tt, 0.36); tt += beat / 2; k += 1
n0 = 0; n1 = int(STOP * SR); L = n1 - n0
fr = np.linspace(440, 600, L)
st = (tone(fr, L / SR, "saw") + tone(fr * 1.005, L / SR, "saw")) * np.linspace(0.2, 1, L) ** 1.5
music[n0:n1] += 0.15 * lp_fast(st, 2500)
cut = int(STOP * SR); music[cut:] = 0.5 * drone[cut:] * np.linspace(1.4, 1.0, N - cut)
tt = 30.66
while tt < DUR - 0.2:
    tk = bp_fast(noise(0.04), 2000, 6000) * env(int(0.04 * SR), 0.001, 0.03); place(music, tk, tt, 0.35); tt += 0.5
music[: int(0.25 * SR)] *= np.linspace(0, 1, int(0.25 * SR))
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


place(sfx, pop(), 0.05, 0.7)                                         # SAI stamp
scrape = bp_fast(noise(0.45), 300, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 45 * np.arange(int(0.45 * SR)) / SR)) * env(int(0.45 * SR), 0.02, 0.1)
place(sfx, scrape, 1.45, 0.7)                                        # chair back as he stands
for x in [3.75, 4.2, 4.65, 5.1]: place(sfx, thunk(80, 0.16), x, 0.45) # footsteps to the door
for x in [5.66, 5.95, 6.25]: place(sfx, click(), x, 1.0); place(sfx, thunk(130, 0.2), x + 0.02, 0.6)  # locked knob rattle
place(sfx, whoosh(0.4, 400, 3000), 6.6, 0.5); place(sfx, boom(1.2), 6.72, 0.4)
bub = np.zeros(int(4.2 * SR))
for i in range(70):
    b = tone(300 + rng.random() * 500, 0.05, "sine", decay=0.015); j = int(rng.random() * (len(bub) - len(b))); bub[j:j + len(b)] += b * (0.4 + 0.6 * rng.random())
place(sfx, bub * env(len(bub), 0.3, 0.6), 9.1, 0.35)                 # pot bubbling
for x in np.arange(9.3, 10.9, 0.45): place(sfx, ting(2900 + rng.random() * 300, 0.25), x, 0.25)  # key jingle
place(sfx, whoosh(0.6, 500, 4000), 11.0, 0.6)                        # throw
spl = bp_fast(noise(0.6), 400, 5000) * np.exp(-np.arange(int(0.6 * SR)) / SR / 0.12); place(sfx, spl, 11.6, 0.9)
hiss = bp_fast(noise(1.5), 2500, 8000) * env(int(1.5 * SR), 0.05, 0.9); place(sfx, hiss, 11.65, 0.35)
buzz = np.concatenate([tone(150, 0.3, "sq") * 0.5, np.zeros(int(0.12 * SR)), tone(150, 0.3, "sq") * 0.5]); place(sfx, bp_fast(buzz, 120, 1800), 13.62, 0.8)
place(sfx, ting(1760, 0.8) * 0.6 + ting(2217, 0.8) * 0.4, 14.45, 0.5) # app ping "pedido entregue"
place(sfx, boom(1.8), 14.96, 0.45)
place(sfx, whoosh(0.9, 200, 1200), 19.3, 0.5); place(sfx, ting(990, 1.5), 19.6, 0.35)  # helmets
for x in [21.95, 22.3, 22.65]: place(sfx, thunk(58, 0.5), x, 1.0); place(sfx, lp_fast(noise(0.3), 400) * np.exp(-np.arange(int(0.3 * SR)) / SR / 0.05), x, 0.5)
place(sfx, boom(2.0), 23.75, 0.35)
place(sfx, boom(3.0), 26.78, 1.0)                                    # she stops smiling
fl = bp_fast(noise(1.0), 100, 400) * (np.sin(2 * np.pi * 60 * np.arange(int(1.0 * SR)) / SR) > 0) * env(int(1.0 * SR), 0.05, 0.2); place(sfx, fl, 27.9, 0.35)
for x in [30.66, 30.82, 32.24, 33.32, 34.3]: place(sfx, pop(), x, 0.6)
def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
save("work/music.wav", music); save("work/sfx.wav", sfx)
print("stems written", DUR, "s")
