# Level-locked mix: music at 50 % (-6 dB) of the voice's gated RMS, SFX at 50 % with peaks capped at 0.7x the voice peak.
import numpy as np, wave, subprocess, sys
SR = 44100
def load_mp3(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float64) / 32768
def load_wav(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
def grms(x, gate_db=-40):
    win = int(0.4 * SR); n = len(x) // win; b = x[: n * win].reshape(n, win); r = np.sqrt((b ** 2).mean(1))
    top = r.max(); keep = r[r > top * 10 ** (gate_db / 20)]; return np.sqrt((keep ** 2).mean())
voice, music, sfx = load_mp3(sys.argv[1]), load_wav(sys.argv[2]), load_wav(sys.argv[3])
N = len(music); v = np.zeros(N); v[: min(N, len(voice))] = voice[:N]
MG, SG = 10 ** (-17 / 20), 10 ** (-10 / 20)
gv = grms(v); music *= MG * gv / grms(music)
sfx *= SG * gv / grms(sfx)
cap = 0.7 * np.abs(v).max()
pk = np.abs(sfx).max()
if pk > cap: sfx *= cap / pk
print(f"voice gated RMS {20*np.log10(gv):.1f} dBFS | music {20*np.log10(grms(music)/gv):+.1f} dB vs voice | sfx {20*np.log10(grms(sfx)/gv):+.1f} dB vs voice, peak {np.abs(sfx).max()/np.abs(v).max():.2f}x voice peak")
mix = v + music + sfx
w = wave.open("work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
