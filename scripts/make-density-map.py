"""Regenerate public/images/portrait-density.png from a new photo (pip install pillow numpy).
Usage: python scripts/make-density-map.py photo.png
The person mask below (head ellipse + shoulders polygon) is tuned for the current photo;
adjust the coordinates if you use a different one."""
import sys, numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageDraw
im = Image.open(sys.argv[1]).convert("RGB")
m = Image.new("L", im.size, 0); d = ImageDraw.Draw(m)
d.ellipse((395, 115, 795, 645), fill=255)
d.polygon([(430,560),(250,650),(140,760),(125,1000),(140,1210),(720,1210),(900,1010),(965,930),(945,800),(800,680),(745,560)], fill=255)
m = m.filter(ImageFilter.GaussianBlur(10))
x0, y0, x1, y1 = 100, 150, 990, 1230
im = im.crop((x0, y0, x1, y1)); m = m.crop((x0, y0, x1, y1))
L = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1).filter(ImageFilter.UnsharpMask(radius=7, percent=220, threshold=1))
l = (np.asarray(L, dtype=np.float32) / 255) ** 0.5
e = np.clip(np.asarray(ImageOps.grayscale(im).filter(ImageFilter.GaussianBlur(1.2)).filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255 * 4.0, 0, 1)
H, W = l.shape; yy, xx = np.mgrid[0:H, 0:W]
face = np.exp(-(((xx - (595 - x0)) / 210) ** 2 + ((yy - (400 - y0)) / 270) ** 2))
dens = np.clip(0.62 * l + e + 0.35 * face, 0, 1)
dens = np.clip(dens * (0.72 + 0.5 * face), 0, 1) * (np.asarray(m, dtype=np.float32) / 255)
o = Image.fromarray((dens * 255).astype("uint8"), "L"); o.thumbnail((620, 900)); o.save("public/images/portrait-density.png")
