import sys,glob
from PIL import Image,ImageDraw
fs=sorted(glob.glob(sys.argv[1]+"/*.jpg")); cols=int(sys.argv[3]) if len(sys.argv)>3 else 6
ims=[Image.open(f) for f in fs]; w,h=ims[0].size; s=0.32; tw,th=int(w*s),int(h*s)
rows=(len(ims)+cols-1)//cols; S=Image.new("RGB",(cols*tw,rows*th),"black"); d=ImageDraw.Draw(S)
for i,(f,im) in enumerate(zip(fs,ims)):
    x,y=(i%cols)*tw,(i//cols)*th; S.paste(im.resize((tw,th)),(x,y)); d.text((x+6,y+6),f.split('/')[-1][1:5],fill="yellow")
S.save(sys.argv[2],quality=88)
