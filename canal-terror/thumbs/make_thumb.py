# usage: python3 make_thumb.py <quadro.jpg> <saida.jpg> "LINHA 1" "LINHA 2" [--longo] [--baixo]  (--baixo: texto no rodapé)
# Thumbnail do canal: quadro do vídeo escurecido nas bordas + texto grande (branco/amarelo, contorno preto) + selo vermelho.
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
src, out, l1, l2 = sys.argv[1:5]; longo = "--longo" in sys.argv
W, H = (1280, 720) if longo else (1080, 1920)
im = Image.open(src).convert("RGB"); r = max(W / im.width, H / im.height); im = im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(1.25)).enhance(1.15)
vig = Image.new("L", (W, H), 0); d = ImageDraw.Draw(vig); d.ellipse((-W * 0.25, -H * 0.15, W * 1.25, H * 1.15), fill=255); vig = vig.filter(ImageFilter.GaussianBlur(W // 6))
im = Image.composite(im, Image.new("RGB", (W, H), (0, 0, 0)), vig)
dr = ImageDraw.Draw(im); F = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
def fit(txt, maxw, size):
    while size > 20:
        f = ImageFont.truetype(F, size)
        if dr.textlength(txt, font=f) <= maxw: return f
        size -= 4
    return ImageFont.truetype(F, size)
y = int(H * (0.08 if not longo else 0.06))
if "--baixo" in sys.argv: y = int(H * (0.62 if longo else 0.70))
for txt, col in ((l1, (255, 255, 255)), (l2, (255, 214, 40))):
    f = fit(txt, W * 0.9, int(H * (0.085 if not longo else 0.16))); tw = dr.textlength(txt, font=f)
    dr.text(((W - tw) / 2, y), txt, font=f, fill=col, stroke_width=max(6, f.size // 9), stroke_fill=(0, 0, 0)); y += int(f.size * 1.15)
im.save(out, quality=90); print(out, im.size)
