# usage: python3 tts.py <reel_dir>   — lines.json [[id, text, pause_after, (length_scale)]] → work/voice.wav + work/spans.json
# Voice: Piper pt_BR "cadu", lively and a bit fast (length 0.93), +1 semitone, light brightness, gentle compression.
import json, subprocess, sys, os, wave, numpy as np
D = sys.argv[1]; os.makedirs(f"{D}/work/vo", exist_ok=True); SR = 44100
lines = json.load(open(f"{D}/lines.json"))
SAY = {"Pix": "Píquis"}   # pronunciation fixes (captions keep the written form)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
out, spans, t = [np.zeros(int(0.12 * SR))], [], 0.12
for ln in lines:
    lid, txt, pause = ln[0], ln[1], ln[2]; ls = ln[3] if len(ln) > 3 else 0.93
    raw, p = f"{D}/work/vo/{lid}_raw.wav", f"{D}/work/vo/{lid}.wav"
    say = txt.replace("'", "").replace('"', "")
    for a, b in SAY.items(): say = say.replace(a, b)
    subprocess.run(["piper", "-m", "/root/voices/pt_BR-cadu-medium.onnx", "--length-scale", str(ls), "--noise-scale", "0.7", "--noise-w-scale", "0.8", "--sentence-silence", "0.12", "-f", raw], input=say.encode(), capture_output=True, check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "aresample=44100,asetrate=44100*1.0595,aresample=44100,atempo=0.9439,highshelf=f=3000:g=3,acompressor=threshold=0.25:ratio=2.5:attack=5:release=80", "-ac", "1", p], check=True)
    x = load(p); nz = np.where(np.abs(x) > 0.01)[0]; x = x[max(0, nz[0] - 400): nz[-1] + 1500] if len(nz) else x
    spans.append({"id": lid, "text": txt, "s": round(t, 3), "e": round(t + len(x) / SR, 3)}); out.append(x); t += len(x) / SR
    out.append(np.zeros(int(pause * SR))); t += pause
v = np.concatenate(out); v = v / np.abs(v).max() * 0.89
w = wave.open(f"{D}/work/voice.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((v * 32767).astype(np.int16).tobytes()); w.close()
json.dump(spans, open(f"{D}/work/spans.json", "w"), ensure_ascii=False, indent=0)
print(f"voice {len(v) / SR:.2f} s"); [print(f"  {s['id']:>4} {s['s']:6.2f}-{s['e']:6.2f}  {s['text']}") for s in spans]
