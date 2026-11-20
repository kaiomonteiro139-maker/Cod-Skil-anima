# Calm storytelling score + SFX for the full "E se... 2001" video. Writes work/music_full.wav and work/sfx_full.wav.
import numpy as np, wave, json
SR = 44100; DUR = 318.6; N = int(SR * DUR); rng = np.random.default_rng(5)
T = json.load(open("web/timing.json")); P = [p[0] for p in T["P"]]; E = [p[1] for p in T["P"]]; WP = T["WP"]
w = lambda i, k: WP[i][min(k, len(WP[i]) - 1)]
A = np.array(T["WARP"]); old2new = lambda t: float(np.interp(t, A[:, 1], A[:, 0]))
def env(n, a=0.005, r=0.1):
    e = np.ones(n); na, nr = min(n, max(1, int(a * SR))), min(n, max(1, int(r * SR))); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def place(b, x, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(x))
    if j > i and i >= 0: b[i:j] += g * x[: j - i]
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo: X *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: X *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X, len(x))
def tone(f, d, kind="sine", decay=None):
    n = int(d * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, n)) / SR if np.ndim(f) else 2 * np.pi * f * t
    x = {"sine": np.sin(ph), "sq": np.sign(np.sin(ph)), "saw": 2 * ((ph / 6.283) % 1) - 1}[kind]
    return x * np.exp(-t / decay) if decay else x
def noise(d): return rng.standard_normal(int(d * SR))
def piano(f, d=3.0, vel=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * h * t + h) * (0.6 ** (h - 1)) * np.exp(-t * (1.2 + 0.9 * h)) for h in range(1, 6))
    return vel * x * np.minimum(1, t / 0.004) * np.exp(-t * 0.6)

# ---------------- music ----------------
mus = np.zeros(N); b = 60 / 66
MAJOR = [[130.8, 196.0, 261.6, 329.6], [110.0, 164.8, 220.0, 261.6], [87.3, 130.8, 174.6, 220.0], [98.0, 146.8, 196.0, 246.9]]
MINOR = [[110.0, 164.8, 220.0, 261.6], [87.3, 130.8, 174.6, 220.0], [98.0, 146.8, 196.0, 246.9], [82.4, 123.5, 164.8, 207.7]]
MEL = {0: 659.3, 3: 587.3, 4: 523.3, 8: 523.3, 11: 493.9, 12: 440.0, 16: 440.0, 19: 523.3, 20: 587.3, 24: 587.3, 27: 523.3, 28: 493.9}
MELm = {0: 523.3, 4: 493.9, 8: 440.0, 12: 415.3, 16: 440.0, 20: 523.3, 24: 493.9, 28: 415.3}
def section(t0, t1, prog=MAJOR, mel=MEL, g=1.0, dens=2):
    t, k = t0, 0
    while t < t1 - 0.05:
        ch = prog[(k // 8) % 4]
        if k % 8 == 0:
            place(mus, piano(ch[0] / 2, 4.5, 0.9), t, g)
            pad = sum(tone(f, 8 * b / 2 + 0.6, "saw") for f in ch[1:]); place(mus, filt(pad, hi=700) * env(len(pad), 0.8, 0.8), t, 0.05 * g)
        if dens == 2 or k % 2 == 0: place(mus, piano(ch[[1, 2, 3, 2][k % 4]], 2.0, 0.5), t, g)
        if (k % 32) in mel and k >= 8: place(mus, piano(mel[k % 32], 3.0, 0.55), t + 0.01, g)
        t += b / 2; k += 1
    fade = int(0.8 * SR); i = int(t1 * SR); mus[i:i + fade] *= np.linspace(1, 0, fade)[: len(mus[i:i + fade])]
def silence(t0, t1): mus[int(t0 * SR):int(t1 * SR)] = 0
section(0.3, P[4] - 0.05)                                   # intro, pauses on "Só tem um problema"
section(P[6] - 0.3, P[40] - 0.3)                            # part A: light, curious
section(P[40] - 0.2, P[52] - 0.1, MINOR, MELm, 0.9)         # suspicion + battery draining
section(P[52], P[61], MINOR, MELm, 0.75, dens=1)            # the last command, sparse
# silence on the black screen, hope returns on "Mas você não fica parado"
section(P[63] - 0.1, P[72], MAJOR, MEL, 1.0)
section(E[72] + 0.2, DUR, MAJOR, MEL, 0.9, dens=1)         # ending, gentle
for a, c in [(P[4] - 0.05, P[6] - 0.3), (P[61], P[63] - 0.1), (P[72], E[72] + 0.2)]: silence(a + 0.8, c)
mus[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR)); mus[: int(0.6 * SR)] *= np.linspace(0, 1, int(0.6 * SR))
# a single reflective note under "quem ensinou quem?"
place(mus, piano(261.6, 4, 0.6) + piano(392.0, 4, 0.4) + piano(523.3, 4, 0.3), P[72] + 0.2, 1.0)

# ---------------- sfx ----------------
sfx = np.zeros(N)
def cue(x, t0, g=1.0): place(sfx, x, t0, g)
def click(): return filt(noise(0.03), 2000, 8000) * env(int(0.03 * SR), 0.001, 0.02)
def boom(d=1.8):
    n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t / 0.12)) / SR) * np.exp(-t / 0.6)
def chime(): return sum(tone(f, 1.6, "sine", 0.5) * a for f, a in [(523.3, 1), (659.3, 0.7), (784, 0.6), (1046.5, 0.4)])
def beep(f=1800, d=0.09): return tone(f, d, "sq") * env(int(d * SR), 0.002, 0.01)
def whoosh(d=0.6, lo=300, hi=2500): x = filt(noise(d), lo, hi); return x * np.sin(np.linspace(0, np.pi, len(x))) ** 2
def typing(t0, t1, g=0.35):
    t = t0
    while t < t1: cue(click(), t + rng.uniform(0, 0.02), g); t += rng.uniform(0.05, 0.11)
def dialup(t0, g=0.45):
    cue((tone(350, 0.35) + tone(440, 0.35)) * 0.4 * env(int(0.35 * SR)), t0, g)
    for i, (lo, hi) in enumerate([(697, 1209), (770, 1336), (852, 1477), (697, 1336), (941, 1336)]):
        cue((tone(lo, 0.08) + tone(hi, 0.08)) * 0.4 * env(int(0.08 * SR), 0.003, 0.01), t0 + 0.38 + i * 0.09, g)
    n = int(1.6 * SR); t = np.arange(n) / SR
    hs = tone(2100, 1.6) * (t < 0.35) + (tone(1650 + 600 * np.sign(np.sin(2 * np.pi * 15 * t)), 1.6, "sq") * 0.35 + filt(noise(1.6), 1000, 4000) * 0.5) * (t >= 0.35)
    cue(filt(hs, 300, 5000) * env(n, 0.01, 0.15), t0 + 0.85, g)
# intro (sample cues, through the warp)
cue(filt(noise(0.7), 150, 900) * np.sin(np.linspace(0, np.pi, int(0.7 * SR))) ** 2, 0.0, 0.6)
for i in range(4): cue(beep(), old2new(2.5) + i * 0.18, 0.25)
cue(filt(noise(1.5), 1500, 9000) * env(int(1.5 * SR), 0.05, 0.2), old2new(4.5), 0.2)
cue(boom(1.5), old2new(10.1), 0.45); cue(tone(1318, 0.8, "sine", 0.25), old2new(10.1), 0.3)
cue(chime(), old2new(13.35), 0.35); typing(old2new(13.65), old2new(14.1), 0.45); typing(old2new(15.3), old2new(16.85), 0.3)
for j, f in enumerate([523.3, 392.0, 311.1]): cue(piano(f, 2.0, 0.7), P[4] + 0.6 + j * 0.28, 0.9)
dialup(P[5] - 0.2)
# part A
for k in range(6): cue(beep(1200 + (k % 3) * 200, 0.06), w(7, 15) + k * 0.25, 0.2)   # snake game blips
cue(filt(noise(0.9), 1500, 9000) * env(int(0.9 * SR), 0.05, 0.2), P[8] - 0.1, 0.18); cue(tone(880, 0.4, "sine", 0.1), w(8, 3), 0.3)
cue(boom(1.4), w(10, 5), 0.4)
cue(chime(), P[16], 0.25); typing(w(17, 2), w(17, 2) + 1.4)
typing(P[19], P[19] + 1.6, 0.25); cue(tone(1046, 0.6, "sine", 0.15) + tone(1318, 0.6, "sine", 0.15), P[19] + 1.6, 0.4)
for k, i in enumerate([w(20, 0), w(20, 1), w(20, 2)]): cue(tone(880 + 220 * k, 0.3, "sine", 0.08), i - 0.1, 0.35)
dialup(P[22] + 0.4)
cue(filt(noise(1.2), 2000, 6000) * 0.3 * env(int(1.2 * SR), 0.1, 0.3), P[23], 0.3)
cue(filt(noise(0.06), 800, 3000) * env(int(0.06 * SR)), w(24, 3), 0.6)                  # handset lifted
cue(tone(440, 0.5, "sq") * 0.3 + tone(220, 0.5, "sq") * 0.3, P[25], 0.35)                 # error buzz
for i in range(3): cue(beep(1800), w(26, 30) + i * 0.18, 0.22)
dialup(w(26, 30) + 0.8, 0.3)
cue(filt(noise(2.0), 200, 1500) * 0.4 * env(int(2.0 * SR), 0.3, 0.6), P[27] - 0.1, 0.4)    # street ambience
cue(tone(1568, 0.5, "sine", 0.2) + tone(2093, 0.5, "sine", 0.15), P[28] - 0.1, 0.3)       # shop bell
for k in range(5): cue(filt(noise(0.12), 300, 2000) * env(int(0.12 * SR)), w(29, 4) + k * 0.16, 0.25)  # laugh shakes
cue(chime(), w(30, 4), 0.25); cue(boom(1.0), P[31], 0.35)
for k, i in enumerate([P[32], w(32, 5), w(32, 9), w(32, 15)]): cue(whoosh(0.5), i - 0.35, 0.4)
cue(tone(1318, 0.8, "sine", 0.3), w(33, 5), 0.35)
cue(tone(330, 1.6, "saw") * np.linspace(1, 0.3, int(1.6 * SR)) * 0.2, P[34] + 0.3, 0.3)    # sad slide
for k in range(6): cue(tone(1760 + 200 * (k % 3), 0.15, "sine", 0.05), w(35, 5) + 0.15 * k, 0.25)  # coins
cue(filt(noise(2.5), 400, 3000) * env(int(2.5 * SR), 0.4, 0.6), w(36, 9) - 0.2, 0.25)      # AC hum/wind
cue(boom(0.8) * 0.5, w(39, 1), 0.3)
# part B
cue(whoosh(0.8, 200, 1500), P[40] - 0.2, 0.3)
for i in [P[41], w(41, 6), w(41, 11)]: cue(tone(392, 0.3, "sine", 0.1), i - 0.05, 0.25)
for k in range(4): cue(filt(noise(0.1), 150, 900) * env(int(0.1 * SR)), P[42] + 0.3 + k * 0.4, 0.4)  # footsteps
for i, f in [(P[45], 880), (P[46], 740), (P[47], 622)]: cue(beep(f, 0.12), i, 0.3)
for i, f in [(P[50], 523), (P[52], 440), (P[60], 349)]: cue(beep(f, 0.18), i, 0.35); cue(beep(f, 0.18), i + 0.25, 0.35)
typing(w(57, 2), w(57, 2) + 5.0, 0.3)
for k in range(24): cue(click() * 0.6 + tone(3000, 0.03, "sine", 0.01) * 0.3, P[59] + k * (E[59] - P[59] + 0.3) / 24, 0.4)  # CDs clicking
cue(tone(196, 1.2, "sine", 0.4) * np.linspace(1, 0, int(1.2 * SR)), P[61], 0.6); cue(boom(2.0), P[61] + 0.1, 0.4)    # power down
cue(chime(), P[63], 0.3)
for i in [w(66, 3), w(66, 6), w(66, 9)]: cue(whoosh(0.4, 600, 4000), i - 0.25, 0.4); cue(filt(noise(0.08), 1000, 5000) * env(int(0.08 * SR)), i - 0.05, 0.4)
cue(tone(1318, 0.3, "sine", 0.08) + tone(1760, 0.3, "sine", 0.08), w(67, 7) - 0.1, 0.3)    # notification
cue(boom(1.6), P[68], 0.35)
cue(whoosh(1.4, 300, 2000), P[70], 0.3)
cue(boom(2.0), E[75] + 0.5, 0.45); cue(tone(880, 0.3, "sine", 0.08), E[75] + 0.9, 0.35)

def save(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    ww = wave.open(name, "wb"); ww.setnchannels(1); ww.setsampwidth(2); ww.setframerate(SR); ww.writeframes((x * 32767).astype(np.int16).tobytes()); ww.close()
save("work/music_full.wav", mus); save("work/sfx_full.wav", sfx); print("ok")
