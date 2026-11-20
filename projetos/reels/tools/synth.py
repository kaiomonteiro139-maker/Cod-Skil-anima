# Small synth library for reel scores and SFX (mono 44.1 kHz). import with: sys.path.insert(0, ".../tools"); from synth import *
import numpy as np, wave
SR = 44100; rng = np.random.default_rng(7)
def buf(d): return np.zeros(int(d * SR))
def env(n, a=0.005, r=0.1):
    e = np.ones(n); na = max(1, min(n, int(a * SR))); nr = max(1, min(n, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(b, x, t0, g=1.0):
    i = int(t0 * SR); j = min(len(b), i + len(x))
    if j > i >= 0: b[i:j] += g * x[: j - i]
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4)); return np.fft.irfft(X, len(x))
def tone(f, d, kind="sine"):
    n = int(d * SR); ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, n).astype(float)) / SR; return np.sin(ph) if kind == "sine" else 2 * ((ph / (2 * np.pi)) % 1) - 1
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
def piano(m, d=2.5, v=1.0):
    n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.3 + k * 0.9)) for k, a in [(1, 1), (2, 0.4), (3, 0.18)]) * env(n, 0.004, 0.3)
def pluck(m, d=0.6, v=1.0):
    n = int(d * SR); t = np.arange(n) / SR; f = mid(m); return v * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.12) * env(n, 0.002, 0.05)
def pad(ms, d, v=1.0):
    n = int(d * SR); x = sum(tone(mid(m) * (1 + dt), d, "saw") for m in ms for dt in (-0.004, 0.004)); return v * bp(x, 80, 1400) / (2 * len(ms)) * env(n, min(1.2, d / 3), min(1.2, d / 3))
def sub(m, d, v=1.0): n = int(d * SR); return v * tone(mid(m), d) * env(n, 0.02, 0.3)
def kick(g=1.0):
    n = int(0.3 * SR); t = np.arange(n) / SR; return g * np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12)
def hat(g=1.0): n = int(0.05 * SR); return g * bp(rng.standard_normal(n), 6000, 12000) * np.exp(-np.arange(n) / SR / 0.012)
def snare(g=1.0): n = int(0.2 * SR); t = np.arange(n) / SR; return g * (bp(rng.standard_normal(n), 1200, 6000) * np.exp(-t / 0.05) + 0.5 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04))
def clap(g=1.0): n = int(0.25 * SR); t = np.arange(n) / SR; x = bp(rng.standard_normal(n), 900, 5000); e = sum(np.exp(-np.maximum(0, t - d) / 0.012) * (t >= d) for d in (0, 0.012, 0.024)) + np.exp(-t / 0.08) * 0.5; return g * x * e
# sfx
def thump(f=60, d=0.5, g=1.0):
    n = int(d * SR); t = np.arange(n) / SR; return g * (np.sin(2 * np.pi * np.cumsum(f + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.12) + 0.4 * bp(rng.standard_normal(n), 200, 1500) * np.exp(-t / 0.03))
def ding(f=1760): n = int(0.9 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.3) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t) * np.exp(-t / 0.25)
def coin(): return np.concatenate([ding(1976)[: int(0.08 * SR)], ding(2637)]) * 0.8
def buzz(d=0.35): return bp(tone(150, d, "saw"), 100, 1500) * env(int(d * SR), 0.01, 0.05)
def whoosh(d=0.5, lo=300, hi=2500): x = bp(rng.standard_normal(int(d * SR)), lo, hi); return x * np.sin(np.linspace(0, np.pi, len(x))) ** 2
def riser(d=1.5): n = int(d * SR); t = np.arange(n) / SR; return bp(rng.standard_normal(n), 400, 6000) * (t / d) ** 2 + 0.3 * tone(np.linspace(200, 900, n), d) * (t / d) ** 2
def boom(): return thump(38, 1.6, 1.0) + 0.3 * bp(rng.standard_normal(int(1.6 * SR)), 40, 300) * np.exp(-np.arange(int(1.6 * SR)) / SR / 0.4)
def ring(d=2.0):
    n = int(d * SR); t = np.arange(n) / SR; on = ((t % 1.0) < 0.5).astype(float); return (np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1100 * t)) * 0.4 * on * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * t)))
def tap(): n = int(0.03 * SR); return bp(rng.standard_normal(n), 1500, 6000) * np.exp(-np.arange(n) / SR / 0.006)
def typing(b, t0, t1, g=0.4):
    t = t0
    while t < t1: place(b, tap(), t, g * (0.6 + 0.4 * rng.random())); t += 0.08 + rng.random() * 0.1
def save(p, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9; w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
