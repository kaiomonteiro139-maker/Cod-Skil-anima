# usage: python3 tts.py <reel_dir>   — lines.json [[id, text, pause_after, (length_scale)]] → work/voice.wav + work/spans.json
# Voice: Piper pt_BR "cadu", lively and a bit fast (length 0.93), +1 semitone, light brightness, gentle compression.
import json, subprocess, sys, os, wave, re, difflib, numpy as np
from faster_whisper import WhisperModel
ASR = WhisperModel("small", device="cpu", compute_type="int8")
norm = lambda x: re.sub(r"[^a-zà-ú ]", "", x.lower().replace("pra ", "para ").replace("pras ", "para as ")).split()
def score(p, txt):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; got = " ".join(s.text for s in ASR.transcribe(a, language="pt")[0])
    return difflib.SequenceMatcher(None, norm(txt), norm(got)).ratio(), got
D = sys.argv[1]; os.makedirs(f"{D}/work/vo", exist_ok=True); SR = 44100
lines = json.load(open(f"{D}/lines.json"))
SAY = {"Pix": "Píquis", "zebra": "zzebra", "Pras ": "Para as "}   # pronunciation fixes (captions keep the written form)
def load(p): w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
out, spans, t = [np.zeros(int(0.12 * SR))], [], 0.12
for ln in lines:
    lid, txt, pause = ln[0], ln[1], ln[2]; ls = ln[3] if len(ln) > 3 else 0.9
    raw, p = f"{D}/work/vo/{lid}_raw.wav", f"{D}/work/vo/{lid}.wav"
    say = txt.replace("'", "").replace('"', "")
    for a, b in SAY.items(): say = say.replace(a, b)
    best = (-1, None)
    for take in range(6):
        tp = f"{D}/work/vo/{lid}_t{take}.wav"
        subprocess.run(["piper", "-m", "/root/voices/pt_BR-cadu-medium.onnx", "--length-scale", str(ls), "--noise-scale", "0.6", "--noise-w-scale", "0.7", "--sentence-silence", "0.12", "-f", raw], input=say.encode(), capture_output=True, check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "highpass=f=70,afftdn=nr=14:nf=-48,aresample=44100,asetrate=44100*1.0595,aresample=44100,atempo=0.9439,equalizer=f=2800:t=q:w=1.2:g=3,highshelf=f=5000:g=3,acompressor=threshold=0.25:ratio=2.5:attack=5:release=80,lowpass=f=12000,agate=threshold=0.012:ratio=6:attack=3:release=150", "-ac", "1", tp], check=True)
        sc, got = score(tp, txt)
        if sc > best[0]: best = (sc, tp, got)
        if sc >= 0.999: break
    os.replace(best[1], p); print(f"  {lid}: take score {best[0]:.2f}  [{best[2].strip()}]", flush=True)
    x = load(p); nz = np.where(np.abs(x) > 0.01)[0]; x = x[max(0, nz[0] - 400): nz[-1] + 1500] if len(nz) else x
    spans.append({"id": lid, "text": txt, "s": round(t, 3), "e": round(t + len(x) / SR, 3)}); out.append(x); t += len(x) / SR
    out.append(np.zeros(int(pause * SR))); t += pause
v = np.concatenate(out); v = v / np.abs(v).max() * 0.89
w = wave.open(f"{D}/work/voice.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((v * 32767).astype(np.int16).tobytes()); w.close()
json.dump(spans, open(f"{D}/work/spans.json", "w"), ensure_ascii=False, indent=0)
print(f"voice {len(v) / SR:.2f} s"); [print(f"  {s['id']:>4} {s['s']:6.2f}-{s['e']:6.2f}  {s['text']}") for s in spans]
