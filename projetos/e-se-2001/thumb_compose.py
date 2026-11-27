import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 1920, 1080
bg = Image.open(src).convert("RGB").resize((W, H))
# darken right side for text legibility
grad = Image.new("L", (W, H))
gd = ImageDraw.Draw(grad)
for x in range(W):
    a = max(0, min(1, (x - 760) / 520)); gd.line([(x, 0), (x, H)], fill=int(175 * a))
bg = Image.composite(Image.new("RGB", (W, H), (10, 14, 34)), bg, grad)
d = ImageDraw.Draw(bg)
BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
MONO = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf"
def text(s, size, cx, y, fill, stroke=None, anchor="mm", maxw=860):
    f = ImageFont.truetype(BLACK, size)
    while f.getlength(s) > maxw: size -= 4; f = ImageFont.truetype(BLACK, size)
    stroke = None if stroke is None else max(8, int(stroke * size / 300))
    sw = stroke if stroke is not None else max(6, size // 9)
    # drop shadow
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((cx + 8, y + 10), s, font=f, fill=(0, 0, 0, 170), anchor=anchor, stroke_width=sw, stroke_fill=(0, 0, 0, 170))
    bg.paste(sh.filter(ImageFilter.GaussianBlur(8)), (0, 0), sh.filter(ImageFilter.GaussianBlur(8)))
    ImageDraw.Draw(bg).text((cx, y), s, font=f, fill=fill, anchor=anchor, stroke_width=sw, stroke_fill="#140c16")
CX = 1420
text("E SE VOCÊ", 118, CX, 190, "#ffffff")
text("ACORDASSE", 150, CX, 330, "#ffffff")
text("EM 2001?", 300, CX - 10, 560, "#ffd23f", stroke=22, maxw=1010)
# terminal panel
x0, y0, x1, y1 = 1000, 760, 1790, 1010
panel = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(panel)
pd.rounded_rectangle((x0 + 10, y0 + 14, x1 + 10, y1 + 14), 28, fill=(0, 0, 0, 150))
panel = panel.filter(ImageFilter.GaussianBlur(10)); bg.paste(panel, (0, 0), panel)
d = ImageDraw.Draw(bg)
d.rounded_rectangle((x0, y0, x1, y1), 28, fill="#14161c", outline="#140c16", width=8)
d.rounded_rectangle((x0 + 4, y0 + 4, x1 - 4, y0 + 62), 24, fill="#262a33")
d.rectangle((x0 + 4, y0 + 40, x1 - 4, y0 + 62), fill="#262a33")
for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]): d.ellipse((x0 + 34 + i * 44, y0 + 20, x0 + 62 + i * 44, y0 + 48), fill=c)
fm = ImageFont.truetype(MONO, 92)
d.text((x0 + 60, y0 + 155), "$", font=fm, fill="#7ee787", anchor="lm")
d.text((x0 + 140, y0 + 155), "claude", font=fm, fill="#ffffff", anchor="lm")
d.rectangle((x0 + 520, y0 + 110, x0 + 566, y0 + 200), fill="#ffd23f")
bg.save(out.replace(".jpg", "_1080.png"))
bg.resize((1280, 720), Image.LANCZOS).save(out, quality=92)
