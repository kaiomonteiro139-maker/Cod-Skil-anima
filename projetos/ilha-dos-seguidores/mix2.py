# usage: python3 mix.py <reel_dir> — music ~17 dB under the voice's gated RMS, SFX ~10 dB under (peaks capped), → work/master.wav at -14 LUFS.
import numpy as np, wave, subprocess, sys, re
D = sys.argv[1]; SR = 44100
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
def grms(x, gate_db=-40):
    win = int(0.4 * SR); n = len(x) // win; b = x[: n * win].reshape(n, win); r = np.sqrt((b ** 2).mean(1)); keep = r[r > r.max() * 10 ** (gate_db / 20)]; return np.sqrt((keep ** 2).mean())
voice, music, sfx = load(f"{D}/work/voice.wav"), load(f"{D}/work/music.wav"), load(f"{D}/work/sfx.wav")
N = len(music); v = np.zeros(N); v[: min(N, len(voice))] = voice[:N]
gv = grms(v); music *= 10 ** (-18 / 20) * gv / grms(music); sfx *= 10 ** (-12 / 20) * gv / grms(sfx)
cap = 0.7 * np.abs(v).max(); pk = np.abs(sfx).max()
if pk > cap: sfx *= cap / pk
print(f"music {20*np.log10(grms(music)/gv):+.1f} dB vs voice | sfx {20*np.log10(grms(sfx)/gv):+.1f} dB vs voice")
mix = v + music + sfx
w = wave.open(f"{D}/work/mix.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{D}/work/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
L = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1])
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{D}/work/mix.wav", "-af", f"volume={-14 - L:.2f}dB,alimiter=limit=0.89:level=false", "-ar", "48000", f"{D}/work/master.wav"], check=True)
print(f"mix {L:.1f} LUFS → master (gain {-14 - L:+.1f} dB)")
