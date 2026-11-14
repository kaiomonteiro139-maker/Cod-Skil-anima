import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1080, 1920
bg = Image.open(sys.argv[1]).convert("RGB")
grad = Image.new("L", (W, H)); gd = ImageDraw.Draw(grad)
for y in range(H): gd.line([(0, y), (W, y)], fill=int(150 * max(0, 1 - y / 900)))
bg = Image.composite(Image.new("RGB", (W, H), (12, 14, 30)), bg, grad)
BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
def text(s, size, y, fill, maxw=980, stroke_k=0.11):
    f = ImageFont.truetype(BLACK, size)
    while f.getlength(s) > maxw: size -= 4; f = ImageFont.truetype(BLACK, size)
    sw = max(6, int(size * stroke_k))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((W // 2 + 8, y + 12), s, font=f, fill=(0, 0, 0, 170), anchor="mm", stroke_width=sw, stroke_fill=(0, 0, 0, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(10)); bg.paste(sh, (0, 0), sh)
    ImageDraw.Draw(bg).text((W // 2, y), s, font=f, fill=fill, anchor="mm", stroke_width=sw, stroke_fill="#140c16")
# small badge
d = ImageDraw.Draw(bg); fb = ImageFont.truetype(BLACK, 44); lab = "POV · 66 MILHÕES DE ANOS"; w = fb.getlength(lab)
d.rounded_rectangle((W / 2 - w / 2 - 30, 318, W / 2 + w / 2 + 30, 392), 37, fill="#e5483b", outline="#140c16", width=6)
d.text((W / 2, 356), lab, font=fb, fill="#ffffff", anchor="mm")
text("ACORDEI COM UM", 112, 490, "#ffffff")
text("T-REX", 300, 690, "#ffd23f", stroke_k=0.075)
text("NA MINHA CARA", 112, 890, "#ffffff")
bg.save(sys.argv[2], quality=93)
