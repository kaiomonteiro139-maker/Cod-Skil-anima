# Sound for the dinosaur POV: ambience, creature SFX, rising drone; mixed against the voice track (work/voice.wav).
import numpy as np, wave, json
SR = 44100; DUR = 87.0; N = int(SR * DUR); rng = np.random.default_rng(3); T = np.arange(N) / SR

def load(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    y = np.zeros(N); y[: min(N, len(x))] = x[:N]; return y
def save(p, x):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4)); return np.fft.irfft(X, len(x))
def lp(x, c): return bp(x, 1, c)
def env(n, a=0.01, r=0.1):
    e = np.ones(n); na = max(1, min(n, int(a * SR))); nr = max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(buf, x, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(x))
    if j > i: buf[i:j] += g * x[: j - i]
def tone(f, d, kind="sine"):
    n = int(d * SR); ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, n).astype(float)) / SR
    return np.sin(ph) if kind == "sine" else 2 * ((ph / (2 * np.pi)) % 1) - 1
def win(t0, t1, fade=0.3):
    m = np.zeros(N); i, j = int(t0 * SR), min(N, int(t1 * SR)); m[i:j] = 1; k = int(fade * SR)
    if k: m[i:i + k] *= np.linspace(0, 1, min(k, j - i)) if j - i >= k else 1; m[max(i, j - k):j] *= np.linspace(1, 0, j - max(i, j - k))
    return m
gated = lambda x: np.sqrt(np.mean(x[np.abs(x) > 0.02] ** 2)) if np.any(np.abs(x) > 0.02) else 1e-6

# ---------------- voice (with an echo on "Alô?! Tem alguém aí?!") ----------------
voice = load("work/voice.wav")
spans = {s["k"]: s for s in json.load(open("work/spans.json"))}
a, b = int((spans["L7"]["s"] - 0.05) * SR), int((spans["L7"]["e"] + 0.1) * SR); seg7 = voice[a:b].copy()
for d, g in [(0.42, 0.32), (0.84, 0.16), (1.26, 0.08)]: place(voice, lp(seg7, 2500), a / SR + d, g)
vr = gated(voice)

# ---------------- ambience ----------------
amb = np.zeros(N)
ins = bp(noise(DUR), 3500, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * T)) ; amb += 0.5 * ins * win(0.3, 40.9, 0.4)
wind = lp(noise(DUR), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * T / 7)); amb += 0.9 * wind * win(0.0, 40.9, 0.3)
for x in rng.uniform(13, 40, 14):  # distant bird / ptero calls
    d = 0.35; f = np.linspace(1800, 900, int(d * SR)) * (1 + 0.05 * np.sin(np.arange(int(d * SR)) / SR * 2 * np.pi * 30))
    place(amb, tone(f, d) * env(int(d * SR), 0.02, 0.2), x, 0.25)
crk = np.zeros(N)
for k in range(int(41.5 * 4), int(87 * 4)):
    t0 = k / 4 + rng.uniform(0, 0.05); place(crk, tone(4300, 0.05) * env(int(0.05 * SR), 0.005, 0.03) * (np.sin(2 * np.pi * 40 * np.arange(int(0.05 * SR)) / SR) > 0), t0, 0.5)
amb += crk * win(41.5, 87, 0.5) * np.where(T > 56, 0.6, 1.0)
amb *= np.where((T > 50.4) & (T < 51.0) | (T > 55.6) & (T < 56.0), 0.0, 1.0)
amb *= vr * 10 ** (-13.5 / 20) / gated(amb)

# ---------------- creature SFX ----------------
sfx = np.zeros(N)
def breath(d=0.9, g=1.0):
    n = int(d * SR); e = np.sin(np.linspace(0, np.pi, n)) ** 1.5; return g * lp(noise(d), 700) * e
def thump(f=45, d=0.6):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f + 60 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.18) + 0.4 * lp(noise(d), 300) * np.exp(-t / 0.08)
def roar(d=2.0):
    n = int(d * SR); t = np.arange(n) / SR; f0 = 70 + 50 * np.sin(np.pi * t / d) + 8 * np.sin(2 * np.pi * 9 * t)
    x = 0.6 * tone(f0, d, "saw") + 0.5 * tone(f0 * 1.51, d, "saw") + 0.4 * tone(f0 * 2.02, d, "saw") + 0.9 * bp(noise(d), 200, 2200)
    x = lp(x, 1600) * (0.75 + 0.25 * np.sin(2 * np.pi * 23 * t)); return x * env(n, 0.12, 0.6)
def squeak(f=2400, d=0.18):
    n = int(d * SR); fr = np.linspace(f, f * 1.4, n); return tone(fr, d) * env(n, 0.01, 0.08)
def chirp(d=0.12):
    n = int(d * SR); fr = np.linspace(1400, 2600, n); return (tone(fr, d) * 0.6 + bp(noise(d), 1500, 4000) * 0.4) * env(n, 0.005, 0.05)
def rustle(d=0.8): return bp(noise(d), 1500, 6000) * env(int(d * SR), 0.05, 0.3) * (0.5 + 0.5 * np.abs(np.sin(np.linspace(0, 18, int(d * SR)))))
for x in np.arange(0.0, 6.4, 1.45): place(sfx, breath(1.0), x, 0.7)          # hot breath on your face
place(sfx, lp(noise(0.35), 900) * env(int(0.35 * SR), 0.005, 0.25), 3.0, 1.6)  # snort
growl = lp(tone(52 + 4 * np.sin(np.arange(int(2.4 * SR)) / SR * 2 * np.pi * 6), 2.4, "saw"), 260) * env(int(2.4 * SR), 0.5, 0.6); place(sfx, growl, 4.2, 0.5)
place(sfx, roar(2.0), 6.95, 2.2)
for i, x in enumerate([10.6, 11.35, 12.1, 12.85, 13.6, 14.4, 15.2, 16.1, 17.0]): place(sfx, thump(), x, 1.5 * 0.82 ** i)
place(sfx, rustle(0.7), 12.8, 0.6); place(sfx, rustle(0.6), 17.3, 0.5)
d = 0.6; place(sfx, tone(np.linspace(2200, 1300, int(d * SR)), d) * env(int(d * SR), 0.02, 0.3), 22.6, 0.35)   # ptero screech
place(sfx, rustle(0.5), 30.4, 0.5); place(sfx, squeak(), 31.0, 0.5); place(sfx, squeak(2800), 33.6, 0.45); place(sfx, squeak(2600), 35.3, 0.4)
place(sfx, rustle(0.9), 35.2, 0.9)
for i in range(3):
    t0 = 36.0 + i * 0.75
    for k in range(14): place(sfx, thump(110, 0.12) * 0.5, t0 + k * 0.16, 0.5)
    for k in range(3): place(sfx, chirp(), t0 + 0.3 + k * 0.5 + rng.uniform(0, 0.1), 0.6)
for x in [40.9, 50.4, 55.6]: place(sfx, thump(38, 1.0), x, 1.0)                   # blackouts
place(sfx, tone(2640, 1.2) * np.exp(-np.arange(int(1.2 * SR)) / SR / 0.4) * 0.5 + tone(3960, 1.2) * np.exp(-np.arange(int(1.2 * SR)) / SR / 0.3) * 0.3, 45.6, 0.35)  # new star
for x in [71.6, 72.1, 72.7, 77.7, 78.1, 78.6, 79.0]: place(sfx, squeak(1900 + rng.uniform(0, 400), 0.22), x, 0.55)  # hatchling
place(sfx, rustle(0.6), 76.5, 0.4)
sfx *= 0.9 * np.abs(voice).max() / np.abs(sfx).max()

# ---------------- rising drone + heartbeat (from the third night) ----------------
dr = np.zeros(N)
base = 0.5 * tone(41.2, DUR, "saw") + 0.4 * tone(61.7, DUR, "saw") + 0.3 * tone(41.5, DUR, "saw") + 0.25 * tone(82.4 * (1 + 0.04 * np.clip((T - 56) / 26, 0, 1)), DUR, "saw")
base = lp(base, 300) + 0.5 * lp(noise(DUR), 120)
ramp = np.clip((T - 55.6) / 26.2, 0, 1) ** 1.3; ramp[T < 56.0] = 0
ramp = np.where(T > 81.6, np.maximum(0.25, 1 - (T - 81.6) / 1.0) * 1.0, ramp)
dr += base * ramp
tt = 64.0
while tt < 81.5:
    bpm = 70 + 60 * (tt - 64) / 17.5
    for o, g in [(0, 1.0), (0.22, 0.6)]: place(dr, thump(50, 0.35) * 0.6, tt + o, g)
    tt += 60 / bpm
mask = (T > 56.0) & (T < 81.6); dr *= vr * 10 ** (-2 / 20) / np.sqrt(np.mean(dr[(T > 78) & (T < 81.5)] ** 2))
for x in [82.0, 82.6, 83.1, 83.7]:
    n = int(0.15 * SR); place(sfx, tone(np.linspace(500, 1100, n), 0.15) * np.exp(-np.arange(n) / SR / 0.05) * 0.3, x, 1)

mix = voice + amb + sfx + dr
# ambience 11-13 dB under speech early; keep the drone just under the voice late
mix[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR)); mix[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
pk = np.abs(mix).max(); mix *= 0.95 / pk if pk > 0.95 else 1
save("work/mix.wav", mix)
print("voice gated", 20 * np.log10(vr), "dB | amb", 20 * np.log10(gated(amb) / vr), "| drone late", 20 * np.log10(np.sqrt(np.mean(dr[(T > 78) & (T < 81.5)] ** 2)) / vr))
