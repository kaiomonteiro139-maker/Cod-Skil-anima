"""Sintetiza a faixa de efeitos (audio/sfx.wav) alinhada às palavras da narração.
Todos os efeitos ficam abaixo da voz (o mix final aplica o volume).
uso: python3 tools/sons.py"""
import json, re, unicodedata, wave, numpy as np

SR = 44100
rng = np.random.default_rng(7)
W = json.load(open("audio/palavras.json", encoding="utf-8"))
C = json.load(open("cenas.json", encoding="utf-8"))
dur = C[-1]["t1"]
out = np.zeros(int(SR * (dur + 1)), np.float32)

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))

def word_t(word, after=0.0):
    for w in W:
        if w["s"] >= after and norm(w["w"]) == norm(word):
            return w["s"]
    raise SystemExit(f"palavra não encontrada: {word} depois de {after}")

def scene_t(n):
    return C[n - 1]["t0"]

def add(sig, t, gain=1.0):
    i = int(t * SR)
    j = min(len(out), i + len(sig))
    out[i:j] += sig[: j - i] * gain

def env(n, a=0.002, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def lp(x, cut):
    # passa-baixa de 1 polo, simples
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y

def boom(length=1.6, f0=55, f1=32):
    n = int(SR * length)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.45)
    click = lp(rng.standard_normal(n).astype(np.float32), 900) * env(n, 0.001, 0.03)
    return (s + 0.5 * click).astype(np.float32)

def heartbeat(beats=3, bpm=88):
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 50 * t) * env(n, 0.004, 0.06)
    sig = np.zeros(int(SR * beats * 60 / bpm + SR), np.float32)
    for b in range(beats):
        st = int(b * 60 / bpm * SR)
        sig[st:st + n] += thump
        sig[st + int(0.24 * SR):st + int(0.24 * SR) + n] += 0.7 * thump
    return sig

def buzz(length=0.9):
    n = int(SR * length)
    t = np.arange(n) / SR
    gate = ((t % 0.3) < 0.2).astype(np.float32)
    s = np.sign(np.sin(2 * np.pi * 160 * t)) * 0.5 + np.sin(2 * np.pi * 320 * t) * 0.3
    return lp((s * gate).astype(np.float32), 1800) * 0.8

def knock():
    n = int(SR * 0.18)
    nz = lp(rng.standard_normal(n).astype(np.float32), 500)
    return (nz * 3 + np.sin(2 * np.pi * 90 * np.arange(n) / SR)) * env(n, 0.001, 0.035)

def whoosh(length=0.7, rise=True):
    n = int(SR * length)
    t = np.linspace(0, 1, n)
    shape = np.sin(np.pi * t) ** 2
    nz = rng.standard_normal(n).astype(np.float32)
    # filtro que abre: mistura de passa-baixas
    a = lp(nz, 600)
    b = nz - lp(nz, 2500)
    mix = (a * (1 - t) + b * t) if rise else (a * t + b * (1 - t))
    return (mix * shape * 0.6).astype(np.float32)

def click():
    n = int(SR * 0.05)
    return (rng.standard_normal(n) * env(n, 0.0005, 0.006)).astype(np.float32) * 0.8

def pop_msg():
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    f = 600 + 700 * (t / t[-1])
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.06)).astype(np.float32) * 0.5

def sting():
    s = boom(2.2, 70, 30)
    n = int(SR * 2.2)
    t = np.arange(n) / SR
    ring = sum(np.sin(2 * np.pi * f * t) for f in (1244, 1318, 1975)) / 3 * env(n, 0.01, 0.6) * 0.25
    return (s + ring).astype(np.float32)

def chime():
    n = int(SR * 1.2)
    t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * g for f, g in ((880, 1), (1320, .5), (1760, .25))) * env(n, 0.002, 0.25) * 0.35).astype(np.float32)

# ---------------- cues ----------------
cues = []
cues.append(("boom de abertura", 0.0, boom(), 1.0))
cues.append(("swipe (feed da amiga)", scene_t(6) - 0.1, whoosh(0.45), 0.5))
cues.append(("clique de enviar", scene_t(13) + 0.05, click(), 0.9))
cues.append(("mensagem enviada", scene_t(13) + 0.12, pop_msg(), 0.8))
cues.append(("batida de coração", word_t("coração", 60) - 0.05, heartbeat(4), 0.9))
t_vib = word_t("vibra", 60)
cues.append(("vibração do celular", t_vib, buzz(), 0.6))
cues.append(("notificação (dinheiro caiu)", word_t("caiu", t_vib) - 0.25, chime(), 0.7))
cues.append(("whoosh (entra o luxo)", scene_t(25) - 0.3, whoosh(0.6), 0.55))
cues.append(("STING (reconhece o nome)", scene_t(33), sting(), 1.0))
cues.append(("flash (paranoia)", scene_t(38) - 0.35, whoosh(0.7), 0.6))
t_bate = word_t("bate", scene_t(46))
for k, dt in enumerate((0.0, 0.32, 0.64, 1.25, 1.55)):
    cues.append((f"batida na porta {k + 1}", t_bate + 0.15 + dt, knock(), 1.0))
cues.append(("boom (polícia)", scene_t(48), boom(1.4, 60, 30), 0.8))
cues.append(("whoosh montagem", scene_t(61) - 0.2, whoosh(0.5), 0.45))
cues.append(("whoosh recapitulação", scene_t(64) - 0.2, whoosh(0.5), 0.45))

for name, t, sig, g in cues:
    add(sig, max(0, t), g)
out = out[: int(SR * dur)]
peak = np.abs(out).max()
out = out / peak * 0.9
with wave.open("audio/sfx.wav", "wb") as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((out * 32767).astype("<i2").tobytes())
with open("audio/sfx_cues.txt", "w") as f:
    for name, t, _, _ in cues:
        f.write(f"{int(t // 60)}:{t % 60:05.2f}  {name}\n")
print(f"{len(cues)} efeitos -> audio/sfx.wav")
