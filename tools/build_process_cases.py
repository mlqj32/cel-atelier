"""Build original, reproducible process illustrations. Pillow + numpy, no network assets.

The existing practice-kit drawing definitions are reused, without running its
export/ZIP code. These are teaching diagrams, never fabricated app screenshots.
"""
from pathlib import Path
import ast
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/process'
OUT.mkdir(exist_ok=True)
source = ROOT / 'tools/build_practice_kit.py'
tree = ast.parse(source.read_text(encoding='utf-8'))
definitions = []
for statement in tree.body:
    if isinstance(statement, ast.For):
        break  # All subsequent statements export the original kit; do not execute them.
    definitions.append(statement)
kit = {'__file__': str(source)}
exec(compile(ast.Module(body=definitions, type_ignores=[]), str(source), 'exec'), kit)
base, shadows, highs, render = [kit[k] for k in ('base', 'shadow', 'highlight', 'render')]
SIZE = (1200, 1400)
BG = '#f5efdf'
manifest = {}

def layer(shapes):
    return render(shapes)

def paper(im, bg=BG):
    result = Image.new('RGBA', im.size, bg)
    result.alpha_composite(im)
    return result.convert('RGB')

def stack(*images):
    result = Image.new('RGBA', SIZE)
    for im in images:
        result.alpha_composite(im)
    return result

def paint(drawfn):
    result = Image.new('RGBA', SIZE)
    drawfn(ImageDraw.Draw(result))
    return result

def crop(im, box):
    return im.crop(tuple(int(v * 2) for v in box))

def save(case, stages, box=None):
    paths = []
    for index, im in enumerate(stages):
        if box:
            im = crop(im, box)
        if im.mode == 'RGBA':
            im = paper(im)
        # Keep native pixel dimensions: browser zoom must not invent detail.
        target = OUT / f'{case}-{index + 1:02}.png'
        im.save(target, optimize=True)
        paths.append({'src': 'assets/process/' + target.name, 'width': im.width, 'height': im.height})
    manifest[case] = paths

flat = layer(base)
line = render(base, 'line')
def color_mask(colors):
    pixels = np.asarray(flat)
    selected = np.zeros(pixels.shape[:2], dtype=bool)
    for color in colors:
        selected |= (pixels[:,:,:3] == color).all(axis=2)
    return Image.fromarray((selected * 255).astype('uint8'))

skin_mask = color_mask([(255,230,218), (237,178,189)])
coat_mask = color_mask([(141,169,202)])
bag_mask = color_mask([(233,190,126), (242,208,157)])
def restrict(im, mask):
    im = im.copy()
    im.putalpha(ImageChops.multiply(im.getchannel('A'), mask))
    return im

# Preserve object boundaries: jacket shading must not cover the front strap/bag,
# and bag shading must not square off its rounded silhouette.
cloth_sh = restrict(layer(shadows[3:6]), coat_mask)
shadow = stack(restrict(layer(shadows[:3]), skin_mask), cloth_sh, restrict(layer(shadows[6:]), bag_mask))
shaded = stack(flat, shadow)
finish = stack(shaded, layer(highs))

# 1. Construction sketch: actual structural axes and big forms, not a blurred final.
sketch = Image.new('RGBA', SIZE)
d = ImageDraw.Draw(sketch)
for box in [(300, 436, 890, 970), (180, 310, 980, 1090), (305, 38, 465, 523), (704, 40, 865, 520)]:
    d.ellipse(box, outline='#b896ad', width=5)
d.line([(598, 415), (590, 1020)], fill='#8d9fb6', width=5)
d.line([(315, 707), (879, 707)], fill='#8d9fb6', width=5)
d.line([(330, 916), (205, 1318), (976, 1318), (855, 922)], fill='#b896ad', width=6)
d.line([(218, 1005), (137, 1195), (242, 1240)], fill='#b896ad', width=6)
d.line([(975, 1005), (1051, 1195), (944, 1240)], fill='#b896ad', width=6)
d.rounded_rectangle((643, 1130, 941, 1340), 30, outline='#b896ad', width=5)
d.ellipse((427, 700, 513, 780), outline='#8d9fb6', width=5)
d.ellipse((675, 700, 761, 780), outline='#8d9fb6', width=5)
save('workflow', [sketch, line, flat, shaded, finish])

# 2. The same contours, with selective silhouette reinforcement.
thin = render([(k, p, f, s, 1) for k, p, f, s, w in base], 'line')
heavy = render([(k, p, f, s, 10) for k, p, f, s, w in base], 'line')
alpha = flat.getchannel('A')
border = ImageChops.subtract(alpha.filter(ImageFilter.MaxFilter(13)), alpha)
ink = Image.new('RGBA', SIZE, '#453957')
ink.putalpha(border)
weighted = stack(ink, line)
save('line', [thin, line, heavy, weighted], (120, 210, 465, 490))

# 3. Transparent/white seam vs outside spill vs filled edge.
inset = flat.copy()
inset.putalpha(alpha.filter(ImageFilter.MinFilter(15)))
leak = paint(lambda d: d.ellipse((825, 820, 948, 960), fill='#ffe6da'))
save('fill', [line, stack(inset, line), stack(leak, flat), flat], (110, 285, 485, 485))

# 4. Separate shadow layer, isolated against the same paper, then combined.
save('shadow', [flat, shadow, shaded, finish], (135, 235, 458, 510))

# 5. Hair-specific shapes: this is a hair study, never a generic sphere.
hair_shape = [('polygon', [(146, 315), (174, 252), (190, 246), (174, 302), (210, 276), (223, 318), (240, 297), (273, 258), (299, 314), (335, 263), (373, 319), (400, 279), (442, 320), (427, 284), (402, 256), (438, 273), (461, 365), (388, 344), (310, 344), (212, 346)], '#aa8bc8', None, 0)]
# Restrict to the bangs polygon; rear hair is a separate mass.
hair_mask = layer([base[12]]).getchannel('A')
hair_shadow = layer(hair_shape)
hair_shadow.putalpha(ImageChops.multiply(hair_shadow.getchannel('A'), hair_mask))
hair_dark = layer([('polygon', [(174, 300), (171, 335), (208, 278), (222, 327), (234, 311), (211, 263)], '#79648f', None, 0)])
hair_dark.putalpha(ImageChops.multiply(hair_dark.getchannel('A'), hair_mask))
hair_hi = layer(highs[2:4])
hair2, hair3 = stack(flat, hair_shadow), stack(flat, hair_shadow, hair_dark)
save('hair', [flat, hair2, hair3, stack(hair3, hair_hi)], (125, 195, 466, 347))

# 6. Uniform jacket: large plane, tension folds and intentional simplification.
folds = paint(lambda d: (d.polygon([(345, 1060), (320, 1125), (355, 1098)], fill='#667da7'), d.polygon([(868, 1046), (845, 1090), (894, 1160)], fill='#667da7')))
noisy = stack(flat, cloth_sh, folds)
nd = ImageDraw.Draw(noisy)
for x in range(350, 590, 30):
    nd.line([(x, 1120), (x+10, 1210), (x-6, 1260)], fill='#453957', width=5)
save('cloth', [flat, stack(flat, cloth_sh), noisy, stack(flat, cloth_sh, folds)], (63, 449, 530, 675))

# 7. A new original metal postage badge, rendered at useful inspection size.
def badge(stage):
    im = Image.new('RGB', (900, 700), BG)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((150, 130, 750, 570), 58, fill='#c99c51', outline='#544666', width=12)
    if stage >= 1:
        d.rounded_rectangle((174, 154, 726, 546), 40, fill='#e5bd6a')
        d.polygon([(174, 400), (726, 245), (726, 410), (174, 545)], fill='#927253')
    if stage >= 2:
        d.polygon([(185, 284), (710, 160), (724, 184), (174, 327)], fill='#fff0bc')
        d.polygon([(177, 367), (725, 226), (725, 247), (177, 391)], fill='#fff7db')
    d.rounded_rectangle((267, 245, 635, 438), 22, outline='#6c5158', width=13)
    d.line([(278, 256), (451, 356), (622, 256)], fill='#6c5158', width=13)
    if stage >= 3:
        d.line([(183, 475), (183, 527), (226, 539)], fill='#fff0bc', width=8)
        d.line([(714, 192), (714, 230)], fill='#fffaf1', width=9)
        d.line([(640, 476), (667, 469)], fill='#6c5158', width=3)
    return im
save('metal', [badge(i) for i in range(4)])

# 8. Paint crossing objects -> a true binary visibility mask -> clipped paint.
# Visible jacket pixels only, so the strap and collar are protected too.
stroke = paint(lambda d: d.line([(175, 1070), (1065, 1240)], fill='#677da7', width=130))
clipped = stroke.copy()
clipped.putalpha(ImageChops.multiply(stroke.getchannel('A'), coat_mask))
mask_vis = Image.merge('RGB', (coat_mask, coat_mask, coat_mask))
save('clip', [flat, stack(flat, stroke), mask_vis, stack(flat, clipped)], (60, 445, 535, 680))

# 9. Pixel curves + mask: processing is real, not just a changed caption.
scene = paper(finish, '#544e70')
scene = ImageEnhance.Contrast(scene).enhance(.68)
scene = ImageEnhance.Brightness(scene).enhance(.78)
lut = np.interp(np.arange(256), [0, 64, 128, 192, 255], [0, 77, 162, 221, 255]).round().astype('uint8').tolist()
bright = scene.point(lut * 3)
subject = alpha.filter(ImageFilter.GaussianBlur(8))
masked = Image.composite(bright, scene, subject)
save('curves', [scene, bright, Image.merge('RGB', (subject, subject, subject)), masked])

# 10. Gradient map in NORMAL mode with an explicit, reproducible mix.
arr = np.asarray(scene).astype(float)
luma = np.round(arr[:, :, 0]*.2126 + arr[:, :, 1]*.7152 + arr[:, :, 2]*.0722).astype('uint8')
stops = [0, 128, 255]
colors = np.array([[38, 39, 81], [171, 115, 158], [255, 225, 173]])
mapped = Image.fromarray(np.stack([np.interp(luma, stops, colors[:, c]) for c in range(3)], axis=2).round().astype('uint8'))
mixed = Image.blend(scene, mapped, .2)
face_mask = Image.new('L', SIZE)
ImageDraw.Draw(face_mask).ellipse((320, 460, 875, 955), fill=255)
face_mask = face_mask.filter(ImageFilter.GaussianBlur(28))
protected = Image.composite(scene, mixed, face_mask)
save('map', [scene, mapped, mixed, protected])

# 11. Glow from an actual luminous badge only, using Screen (not normal blur).
emission = Image.new('RGB', SIZE, 'black')
ed = ImageDraw.Draw(emission)
ed.ellipse((768, 1175, 820, 1233), fill='#ffcd75')
ed.line([(786, 1160), (786, 1248)], fill='#ffe6a4', width=8)
ed.line([(751, 1204), (836, 1204)], fill='#ffe6a4', width=8)
glow = emission.filter(ImageFilter.GaussianBlur(32))
good = ImageChops.screen(masked, ImageEnhance.Brightness(glow).enhance(.7))
good = ImageChops.screen(good, emission)
wrong = ImageChops.screen(masked, ImageEnhance.Brightness(masked.filter(ImageFilter.GaussianBlur(24))).enhance(.75))
save('glow', [masked, wrong, emission, good])

# One continuous post-production chain, each operation applied to the last result.
ma = np.asarray(masked).astype(float)
ml = np.round(ma[:,:,0]*.2126 + ma[:,:,1]*.7152 + ma[:,:,2]*.0722).astype('uint8')
mm = Image.fromarray(np.stack([np.interp(ml, stops, colors[:,c]) for c in range(3)], axis=2).round().astype('uint8'))
unified = Image.composite(masked, Image.blend(masked, mm, .2), face_mask)
lit = ImageChops.screen(ImageChops.screen(unified, ImageEnhance.Brightness(glow).enhance(.7)), emission)
export = lit.resize((600,700), Image.Resampling.LANCZOS).filter(ImageFilter.UnsharpMask(radius=.65,percent=65,threshold=3))
save('post', [scene, masked, unified, lit, export])

# 12. Deliberately displaced eye group, then structural guidance and local repair.
eye_ids = [i for i, (kind, pts, fill, stroke_color, width) in enumerate(base)
           if (kind == 'ellipse' and pts[0] >= 337 and pts[0] <= 345 and pts[1] >= 350 and pts[1] <= 356)
           or (kind == 'line' and pts[0] == (337, 350))]
def translate(shape, dx, dy):
    k, pts, f, s, w = shape
    if k in ('ellipse', 'round'):
        x, y, x2, y2 = pts
        pts = (x+dx, y+dy, x2+dx, y2+dy)
    else:
        pts = [(x+dx, y+dy) for x, y in pts]
    return k, pts, f, s, w
bad = layer([translate(s, 0, -18) if i in eye_ids else s for i, s in enumerate(base)])
guide = stack(bad, paint(lambda d: (d.line([(390, 700), (800, 700)], fill='#e96668', width=4), d.line([(590, 470), (590, 940)], fill='#477ca7', width=4))))
wrong_warp = bad.resize((1350, 1400)).crop((75, 0, 1275, 1400))
save('eyes', [bad, guide, wrong_warp, flat], (150, 285, 440, 455))

# 13. Actual final-size rasterization + UnsharpMask. Identical nearest-neighbour
# inspection crops make white halos visible, without claiming detail restoration.
small = paper(finish).resize((360, 420), Image.Resampling.LANCZOS)
blurred = small.filter(ImageFilter.GaussianBlur(.55))
oversharp = blurred.filter(ImageFilter.UnsharpMask(radius=3, percent=320, threshold=0))
gentle = blurred.filter(ImageFilter.UnsharpMask(radius=.65, percent=65, threshold=3))
def inspection(im):
    return im.crop((87, 170, 263, 254)).resize((880, 420), Image.Resampling.NEAREST)
save('sharp', [inspection(blurred), inspection(oversharp), inspection(gentle), gentle.resize((720, 840), Image.Resampling.NEAREST)])
(OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(f'Built {len(manifest)} cases / {sum(map(len, manifest.values()))} original process images in {OUT}')
