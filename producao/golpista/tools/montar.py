"""Monta o vídeo final a partir das cenas.

Para cada cena usa, nesta ordem:
  1. clipes/cena_NN.mp4  (clipe de IA)
  2. imagens/cena_NN.png|jpg|webp  (imagem parada -> zoom lento)
  3. cartão provisório (animatic) com o número e a descrição da cena

uso:
  python3 tools/montar.py                 -> saida/video_final.mp4 (1920x1080)
  python3 tools/montar.py --previa        -> saida/previa.mp4 (1280x720, mais rápido)
  python3 tools/montar.py --musica trilha.mp3   (trilha opcional, fica bem abaixo da voz)
"""
import argparse, json, os, subprocess, sys, textwrap, glob, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("--previa", action="store_true")
ap.add_argument("--musica")
ap.add_argument("--musica-db", type=float, default=-22, help="volume da trilha em relação à voz (dB)")
ap.add_argument("--sem-particulas", action="store_true")
args = ap.parse_args()

W, H = (1280, 720) if args.previa else (1920, 1080)
FPS = 30
TMP = "saida/tmp_previa" if args.previa else "saida/tmp_final"
os.makedirs(TMP, exist_ok=True)
C = json.load(open("cenas.json", encoding="utf-8"))
sys.path.insert(0, os.path.dirname(__file__))
from cenas import LUZES

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)); print(r.stderr[-2500:]); sys.exit(1)
    return r.stdout

def probe_dur(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))

ENC = ["-c:v", "libx264", "-preset", "veryfast" if args.previa else "medium", "-crf", "23" if args.previa else "17",
       "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
FIT = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS}"

# ---------- cartões provisórios ----------
COR = {"NOITE": ((18, 26, 52), (40, 70, 130)), "DIA": ((214, 190, 150), (245, 228, 196)),
       "APAGAO": ((5, 5, 8), (70, 52, 25)), "POR": ((120, 60, 40), (240, 150, 80)),
       "LUXO": ((150, 95, 60), (250, 205, 140)), "MANHA": ((150, 175, 200), (220, 232, 242)),
       "TV": ((10, 16, 30), (70, 100, 150)), "POLICIA": ((20, 30, 70), (150, 40, 60)),
       "FRIO": ((150, 170, 160), (215, 230, 220))}

def font(size, bold=True):
    for p in ("/usr/share/fonts/opentype/inter/Inter-Black.otf" if bold else "/usr/share/fonts/opentype/inter/Inter-Medium.otf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def cartao(c, path):
    a, b = COR[c["luz"]]
    g = np.linspace(0, 1, H)[:, None, None]
    img = (np.array(a)[None, None] * (1 - g) + np.array(b)[None, None] * g).repeat(W, 1).astype(np.uint8)
    im = Image.fromarray(img)
    d = ImageDraw.Draw(im)
    s = H / 1080
    dark = sum(b) < 450
    fg = (245, 245, 245) if dark else (25, 25, 30)
    d.text((80 * s, 70 * s), f"CENA {c['n']}", font=font(int(96 * s)), fill=fg)
    d.text((80 * s, 185 * s), f"{LUZES[c['luz']][0]}  ·  {c['camera']}", font=font(int(34 * s), False), fill=fg)
    y = 270 * s
    for line in textwrap.wrap(c["acao"], 58):
        d.text((80 * s, y), line, font=font(int(42 * s), False), fill=fg)
        y += 56 * s
    im.save(path)

def fonte_cena(n):
    for p in [f"clipes/cena_{n:02d}.mp4", f"clipes/cena_{n}.mp4"]:
        if os.path.exists(p):
            return "clipe", p
    for ext in ("png", "jpg", "jpeg", "webp"):
        for p in (f"imagens/cena_{n:02d}.{ext}", f"imagens/cena_{n}.{ext}"):
            if os.path.exists(p):
                return "imagem", p
    p = f"{TMP}/cartao_{n:02d}.png"
    cartao(C[n - 1], p)
    return "cartao", p

def segmento(n, dur, out, offset_frac=0.0, flash=False):
    """Gera um trecho de `dur` segundos da cena n."""
    kind, src = fonte_cena(n)
    frames = max(1, round(dur * FPS))
    fx = f",fade=t=in:st=0:d=0.25:color=white" if flash else ""
    if kind == "clipe":
        cd = probe_dur(src)
        start = 0.0
        if cd >= dur:
            start = min(cd - dur, max(0.0, (cd - dur) * offset_frac))
            vf = f"{FIT}{fx}"
        else:
            speed = max(cd / dur, 1 / 1.35)          # desacelera até 35%
            vf = f"setpts=PTS/{speed:.4f},{FIT},tpad=stop_mode=clone:stop_duration={dur}{fx}"
        run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{start:.3f}", "-i", src, "-vf", vf,
             "-frames:v", str(frames), *ENC, out])
    else:
        # imagem: zoom lento (push-in) de 100% a 108%
        big = f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,crop={W * 2}:{H * 2}"
        zp = (f"zoompan=z='1+0.08*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
              f"d={frames}:s={W}x{H}:fps={FPS}")
        run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", src, "-vf", f"{big},{zp},setsar=1{fx}",
             "-frames:v", str(frames), *ENC, out])

# ---------- 1. trechos de vídeo ----------
FLASH = {38, 46}
parts, stats = [], {"clipe": 0, "imagem": 0, "cartao": 0}
for c in C:
    n = c["n"]
    # o último trecho termina exatamente no fim do áudio; os outros arredondam para o quadro
    t0f, t1f = round(c["t0"] * FPS), round(c["t1"] * FPS)
    dur = (t1f - t0f) / FPS
    if c["reaproveita"]:
        srcs = c["reaproveita"]
        cut = np.linspace(0, t1f - t0f, len(srcs) + 1).round().astype(int)
        for k, s in enumerate(srcs):
            p = f"{TMP}/seg_{n:02d}_{k}.mp4"
            segmento(s, (cut[k + 1] - cut[k]) / FPS, p, offset_frac=0.5, flash=(k == 0 and n in FLASH))
            parts.append(p)
    else:
        p = f"{TMP}/seg_{n:02d}.mp4"
        segmento(n, dur, p, flash=n in FLASH)
        parts.append(p)
        stats[fonte_cena(n)[0]] += 1
    
with open(f"{TMP}/lista.txt", "w") as f:
    f.writelines(f"file '{os.path.abspath(p)}'\n" for p in parts)
video = f"{TMP}/video_sem_audio.mp4"
run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{TMP}/lista.txt", "-c", "copy", video])

# ---------- 2. partículas (poeira/neve caindo, loop de 10 s) ----------
part = f"{TMP}/particulas.mp4"
if not args.sem_particulas and not os.path.exists(part):
    rng = np.random.default_rng(3)
    N, L = 70, 10 * FPS
    x0 = rng.uniform(0, W, N); y0 = rng.uniform(0, H, N)
    laps = rng.integers(1, 4, N)                 # voltas inteiras em 10 s -> loop perfeito
    r = rng.uniform(1.2, 3.6, N) * H / 1080
    alpha = rng.uniform(90, 230, N)
    sway = rng.uniform(4, 18, N) * H / 1080; ph = rng.uniform(0, 6.28, N)
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", part],
                         stdin=subprocess.PIPE)
    for f in range(L):
        im = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(im)
        y = (y0 + laps * (H + 20) * f / L) % (H + 20) - 10
        x = x0 + sway * np.sin(ph + 2 * np.pi * f / L * laps)
        for i in range(N):
            d.ellipse([x[i] - r[i], y[i] - r[i], x[i] + r[i], y[i] + r[i]], fill=int(alpha[i]))
        im = im.filter(ImageFilter.GaussianBlur(0.8 * H / 1080))
        p.stdin.write(im.tobytes())
    p.stdin.close(); p.wait()

# ---------- 3. legenda ----------
run([sys.executable, os.path.join(os.path.dirname(__file__), "legenda.py"), str(W), str(H)])
shutil.copy("legenda.ass", f"{TMP}/legenda.ass")

# ---------- 4. áudio ----------
if not os.path.exists("audio/sfx.wav"):
    run([sys.executable, os.path.join(os.path.dirname(__file__), "sons.py")])
total = C[-1]["t1"]
a_inputs = ["-i", "audio/voz.mp3", "-i", "audio/sfx.wav"]
# voz a 0 dB; efeitos ~10 dB abaixo; trilha opcional em --musica-db
a_filter = "[VOZ]aformat=sample_rates=44100:channel_layouts=stereo[v];[SFX]volume=-10dB,aformat=sample_rates=44100:channel_layouts=stereo[s];"
mix_in = "[v][s]"
if args.musica:
    a_inputs += ["-stream_loop", "-1", "-i", args.musica]
    a_filter += (f"[MUS]aformat=sample_rates=44100:channel_layouts=stereo,loudnorm=I={-16 + args.musica_db}:TP=-6,"
                 f"atrim=0:{total},afade=t=out:st={total - 3}:d=3[m];")
    mix_in += "[m]"
n_in = 3 if args.musica else 2
a_filter += f"{mix_in}amix=inputs={n_in}:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=7[a]"

# ---------- 5. composição final ----------
os.makedirs("saida", exist_ok=True)
final = "saida/previa.mp4" if args.previa else "saida/video_final.mp4"
inputs = ["-i", video]
if not args.sem_particulas:
    inputs += ["-stream_loop", "-1", "-i", part]
inputs += a_inputs
ai = 2 if not args.sem_particulas else 1
a_filter = a_filter.replace("[VOZ]", f"[{ai}:a]").replace("[SFX]", f"[{ai + 1}:a]").replace("[MUS]", f"[{ai + 2}:a]")
ass_path = os.path.abspath(f"{TMP}/legenda.ass").replace(":", r"\:")
if not args.sem_particulas:
    vf = (f"[1:v]format=gbrp[p];[0:v]format=gbrp[b];[b][p]blend=all_mode=screen:all_opacity=0.55,"
          f"format=yuv420p,ass='{ass_path}'[vout]")
else:
    vf = f"[0:v]ass='{ass_path}'[vout]"
run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", vf + ";" + a_filter,
     "-map", "[vout]", "-map", "[a]", "-t", f"{total:.3f}",
     "-c:v", "libx264", "-preset", "veryfast" if args.previa else "slow", "-crf", "23" if args.previa else "17",
     "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", final])
print(f"pronto: {final}  ({probe_dur(final):.2f} s)  clipes={stats['clipe']} imagens={stats['imagem']} cartões={stats['cartao']}")
