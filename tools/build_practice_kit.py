import base64
"""Build the original 月兔邮差 exercise kit. Requires Pillow; no network assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops
import html
import zipfile

OUT = Path(__file__).resolve().parents[1] / 'assets' / 'practice'
OUT.mkdir(parents=True, exist_ok=True)
S = 3
INK = '#453957'
base = []
shadow = []
highlight = []

def shape(kind, points, fill, layer=base, stroke=INK, width=4):
    layer.append((kind, points, fill, stroke, width))

# Broad, closed shapes keep this character approachable for first-time colouring.
shape('ellipse', (152, 18, 232, 262), '#cbb8e8')
shape('ellipse', (170, 41, 213, 216), '#efb5c7', stroke='#a98cb7', width=3)
shape('ellipse', (351, 20, 432, 260), '#cbb8e8')
shape('ellipse', (370, 42, 413, 213), '#efb5c7', stroke='#a98cb7', width=3)
shape('ellipse', (95, 157, 491, 543), '#cbb8e8')
shape('polygon', [(160, 463),(228, 436),(363, 436),(434, 467),(487, 662),(100, 662)], '#8da9ca')
shape('polygon', [(161, 465),(105, 506),(68, 598),(120, 623),(183, 528)], '#8da9ca')
shape('polygon', [(434, 469),(485, 506),(525, 592),(471, 622),(409, 529)], '#8da9ca')
shape('ellipse', (67, 580, 126, 644), '#ffe6da')
shape('ellipse', (468, 578, 526, 642), '#ffe6da')
shape('polygon', [(253, 435),(339, 435),(339, 495),(253, 495)], '#ffe6da')
shape('ellipse', (151, 225, 440, 480), '#ffe6da')
shape('polygon', [(143, 332),(169, 246),(224, 219),(291, 207),(367, 223),(425, 255),(449, 331),(400, 283),(373, 329),(338, 266),(299, 322),(274, 264),(223, 327),(209, 277),(171, 335)], '#dac9ed')
shape('polygon', [(240, 473),(295, 506),(265, 536),(218, 488)], '#f7e9d8')
shape('polygon', [(349, 473),(295, 506),(327, 536),(375, 489)], '#f7e9d8')
shape('polygon', [(267, 512),(295, 524),(324, 513),(313, 548),(295, 535),(279, 548)], '#e89db8')
shape('polygon', [(171, 485),(187, 475),(411, 648),(397, 660)], '#e9be7e')
shape('round', (320, 565, 470, 670), '#e9be7e')
shape('round', (331, 568, 460, 610), '#f2d09d')
shape('ellipse', (388, 596, 405, 615), '#896787', width=2)
shape('ellipse', (213, 350, 257, 391), '#fffaf5', width=3)
shape('ellipse', (337, 350, 381, 391), '#fffaf5', width=3)
shape('ellipse', (229, 352, 250, 389), '#82649c', width=2)
shape('ellipse', (342, 352, 363, 389), '#82649c', width=2)
shape('line', [(210, 350),(233, 343),(257, 350)], None, width=5)
shape('line', [(337, 350),(359, 343),(384, 350)], None, width=5)
shape('line', [(287, 411),(297, 417),(309, 410)], None, stroke='#a06b7a', width=3)
shape('line', [(290, 387),(296, 390)], None, stroke='#bd8e94', width=2)
shape('line', [(205, 328),(228, 322),(250, 325)], None, width=3)
shape('line', [(342, 325),(366, 323),(387, 330)], None, width=3)
shape('ellipse', (181, 398, 216, 411), '#edb2bd', stroke=None)
shape('ellipse', (373, 398, 410, 411), '#edb2bd', stroke=None)
shape('polygon', [(208, 264),(223, 327),(244, 302),(270, 319),(291, 331),(328, 285),(338, 315),(369, 346),(400, 301),(430, 333),(426, 353),(400, 323),(371, 368),(337, 335),(328, 310),(299, 352),(271, 340),(245, 320),(222, 347)], '#e6aeb0', shadow, stroke=None)
shape('polygon', [(402, 353),(438, 338),(439, 396),(419, 443),(383, 469),(348, 476),(376, 440),(393, 402)], '#e6aeb0', shadow, stroke=None)
shape('polygon', [(253, 465),(298, 481),(338, 466),(339, 493),(294, 504),(253, 482)], '#c78b9f', shadow, stroke=None)
shape('polygon', [(117, 510),(135, 504),(114, 593),(83, 605)], '#667da7', shadow, stroke=None)
shape('polygon', [(409, 530),(435, 509),(475, 590),(470, 611),(443, 595)], '#667da7', shadow, stroke=None)
shape('polygon', [(296, 540),(324, 557),(340, 564),(340, 662),(296, 662)], '#667da7', shadow, stroke=None)
shape('polygon', [(336, 628),(467, 628),(467, 670),(336, 670)], '#bc8d66', shadow, stroke=None)
shape('ellipse', (169, 73, 185, 160), '#f6eaff', highlight, stroke=None)
shape('ellipse', (370, 68, 386, 150), '#f6eaff', highlight, stroke=None)
shape('line', [(183, 258),(216, 242),(246, 240)], None, highlight, stroke='#fbf5ff', width=10)
shape('line', [(302, 231),(332, 235),(354, 245)], None, highlight, stroke='#fbf5ff', width=10)
shape('ellipse', (232, 356, 239, 365), '#fffaf5', highlight, stroke=None)
shape('ellipse', (345, 356, 352, 365), '#fffaf5', highlight, stroke=None)

def render(shapes, mode='normal'):
    im = Image.new('RGBA', (600*S, 700*S), (255,255,255,0))
    if mode == 'line': im.paste('white', (0,0,*im.size))
    d = ImageDraw.Draw(im)
    for kind, coords, fill, stroke, width in shapes:
        if mode == 'line':
            fill = 'white' if fill else None
            stroke = INK if stroke else None
        if kind in ('ellipse', 'round'):
            box = tuple(int(v*S) for v in coords)
            if kind == 'ellipse': d.ellipse(box, fill, stroke, max(1,int(width*S)))
            else: d.rounded_rectangle(box, 14*S, fill, stroke, max(1,int(width*S)))
        else:
            pts = [(int(x*S),int(y*S)) for x,y in coords]
            if kind == 'polygon':
                d.polygon(pts,fill=fill)
                if stroke: d.line(pts+[pts[0]],fill=stroke,width=width*S,joint='curve')
            elif stroke: d.line(pts,fill=stroke,width=width*S,joint='curve')
    im = im.resize((1200,1400),Image.Resampling.LANCZOS)
    if mode == 'line':
        # Convert the white masking canvas into transparent, coloured line art.
        alpha = im.convert('RGB').convert('L').point(lambda v: min(255,round((255-v)*1.35)))
        im = Image.new('RGBA',im.size,INK); im.putalpha(alpha)
    return im

def svg_group(name, shapes, line=False):
    out = [f'<g id="{name}">']
    for kind, coords, fill, stroke, width in shapes:
        if line: fill = 'white' if fill else None
        attr=f'fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"'
        if kind == 'ellipse':
            x,y,x2,y2=coords; out.append(f'<ellipse cx="{(x+x2)/2}" cy="{(y+y2)/2}" rx="{(x2-x)/2}" ry="{(y2-y)/2}" {attr}/>')
        elif kind == 'round':
            x,y,x2,y2=coords;out.append(f'<rect x="{x}" y="{y}" width="{x2-x}" height="{y2-y}" rx="14" {attr}/>')
        else: out.append(f'<{"polygon" if kind == "polygon" else "polyline"} points="'+' '.join(f'{x},{y}' for x,y in coords)+f'" {attr}/>')
    return ''.join(out)+'</g>'

flat = render(base)
def material_mask(colors):
    mask = Image.new('L', flat.size)
    for color in colors:
        channels = ImageChops.difference(flat.convert('RGB'), Image.new('RGB',flat.size,color)).split()
        difference = ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2])
        mask = ImageChops.lighter(mask,difference.point(lambda value: 255 if value == 0 else 0))
    return mask

shadow_image = Image.new('RGBA',flat.size)
material_groups = [('skin',shadow[:3],['#ffe6da','#edb2bd']),('coat',shadow[3:6],['#8da9ca']),('bag',shadow[6:],['#e9be7e','#f2d09d'])]
for name,shapes,colors in material_groups:
    piece=render(shapes)
    piece.putalpha(ImageChops.multiply(piece.getchannel('A'),material_mask(colors)))
    shadow_image.alpha_composite(piece)
shaded=flat.copy();shaded.alpha_composite(shadow_image)
finished=shaded.copy();finished.alpha_composite(render(highlight))
for stage,image in [('flat',flat),('shadow',shaded),('finish',finished)]:
    image.save(OUT/f'postal-{stage}.png')
render(base,'line').save(OUT/'postal-line.png')
shadow_image.save(OUT/'postal-shadow-layer.png')
render(highlight).save(OUT/'postal-highlight-layer.png')
defs=[];shadow_groups=[]
for name,shapes,colors in material_groups:
    # Render the same visible-object ownership as an SVG mask. Later objects
    # black out foreground straps, buttons and outlines instead of being shaded.
    mask_shapes=[(kind,coords,'white' if fill in colors else 'black' if fill else None,'black' if stroke else None,width) for kind,coords,fill,stroke,width in base]
    defs.append('<mask id="mask-'+name+'" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="700">'+svg_group('mask-shapes-'+name,mask_shapes)+'</mask>')
    shadow_groups.append('<g mask="url(#mask-'+name+')">'+svg_group('shadow-'+name,shapes)+'</g>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" role="img" aria-label="月兔邮差，原创上色练习角色"><defs>'+''.join(defs)+'</defs>'+svg_group('base',base)+'<g id="shadow">'+''.join(shadow_groups)+'</g>'+svg_group('highlight',highlight)+'</svg>'
(OUT/'postal-editable.svg').write_text(svg,encoding='utf-8')
instructions='''# 月兔邮差 · 起步上色包

这是赛璐璐画室的原创练习角色，不是接稿水平的评定标准。
允许下载用于个人学习、改色练习和带来源说明的练习展示。请勿把原始素材冒充自己的原画或单独打包出售。

## 文件怎么用
- postal-line.png：1200×1400透明线稿，导入后放在最上层并锁定。
- postal-flat.png：底色阶段参考，不是空白填色层。
- postal-shadow.png：加入一阴的阶段参考。
- postal-finish.png：加入少量高光的收尾参考。
- postal-shadow-layer.png / postal-highlight-layer.png：同尺寸透明叠加层，正常模式100%，用于比较阶段变化，不必第一次就直接叠上。
- postal-editable.svg：命名为base、shadow、highlight的分组矢量源文件。SVG不等同于PSD，不保证所有绘画软件可直接打开。

## 第一次：只完成底色与一阴（约30~90分钟，可分日）
1. 导入透明线稿，新建底色层放下面，先选择头发、皮肤、制服三个颜色。
2. 用硬边画笔铺色。放大检查漏白，缩小检查脸是否清楚。
3. 设左上为主光，在底色上方另建普通图层，用正常模式选择目标阴影色；有剪贴功能可分别剪贴到材质底色。
4. 先画发影、侧脸、下巴下方三处大暗形。每一处先说出为何在这里，再落笔。
5. 对照postal-shadow.png，圈出最大差异，只修一处。示例是风格化配色，不是物理模拟的唯一正确答案。
6. 保存原生分层工程，导出PNG。重新打开，确认没有意外白底、丢层与明显越界。

## 第二次：独立迁移
保持角色不动，改为右上光。不要水平翻转整个角色；重新判断发影、侧脸、下巴投影三处。高光可以暂不添加。

## 自查与参考判断
- 颜色超出轮廓：查当前图层、选区和剪贴底层是否有像素。
- 阴影很脏：先看明暗是否压得过低，面积是否过碎，不先加全局饱和度。
- 与参考色号相同却不同：查正常/正片叠底模式、透明度及底色差异。
- 不知道影放哪里：退回球体单光源练习；先做两色阶，不增加复杂光效。
- 通过标准：能保存可编辑工程；无明显漏色；能解释三处阴影；换光位时能独立重画。速度不是第一次的验收标准。
'''
(OUT/'README.md').write_text(instructions,encoding='utf-8')
blocks=[]
for block in instructions.split('\n\n'):
    lines=block.splitlines()
    if block.startswith('# '): continue
    if block.startswith('## '):
        title=lines[0][3:]
        blocks.append('<h2>'+html.escape(title)+'</h2>')
        lines=lines[1:]
    if not lines: continue
    if all(line.startswith('- ') for line in lines):
        blocks.append('<ul>'+''.join('<li>'+html.escape(line[2:])+'</li>' for line in lines)+'</ul>')
    elif all(len(line)>2 and line[0].isdigit() and '. ' in line[:4] for line in lines):
        blocks.append('<ol>'+''.join('<li>'+html.escape(line.split('. ',1)[1])+'</li>' for line in lines)+'</ol>')
    else: blocks.append('<p>'+'<br>'.join(html.escape(line) for line in lines)+'</p>')
body=''.join(blocks)
gallery=''.join(f'<figure><img src="data:image/png;base64,{base64.b64encode((OUT/f"postal-{stage}.png").read_bytes()).decode()}" alt="{title}"><figcaption>{title}</figcaption></figure>' for stage,title in [('line','01 线稿'),('flat','02 底色'),('shadow','03 一阴'),('finish','04 收尾')])
guide='<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>月兔邮差跟练手册</title><style>body{max-width:780px;margin:auto;padding:28px 20px;background:#f7f0e5;color:#42394d;font:17px/1.95 "Microsoft YaHei",sans-serif;overflow-wrap:anywhere}h1{font-size:clamp(26px,5vw,36px);line-height:1.5}h2{font-size:23px;line-height:1.6;margin-top:2em}li{margin:.7em 0}img{width:100%;height:auto}section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}figure{margin:0}figcaption{font-size:14px}nav a{color:#745071}nav{margin-bottom:24px}p{white-space:normal}@media print{body{background:white;color:black}figure{break-inside:avoid}}</style><h1>月兔邮差 · 上色跟练</h1><p>第一轮先完成底色与一阴。下方是同一角色的阶段对照，图片已包含在本手册中，下载后可离线阅读。</p><nav><a href="#steps">跳到跟练说明 ↓</a></nav><section>'+gallery+'</section><article id="steps">'+body+'</article></html>'
(OUT/'postal-guide.html').write_text(guide,encoding='utf-8')
with zipfile.ZipFile(OUT/'cel-postal-practice.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(OUT.iterdir()):
        if p.is_file() and p.suffix != '.zip': z.write(p,p.name)
print('Built',OUT)
