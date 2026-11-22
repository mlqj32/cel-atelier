/* ═══════════════════════════════════════════════════════════════
   DIAGRAMS · 手绘 SVG 图解库
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.DIAGRAMS = window.DIAGRAMS || {};

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function D(w, h) {
    this.w = w; this.h = h; this.parts = [];
    this.parts.push('<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="#0a0d19"/>');
  }
  D.prototype.text = function (x, y, t, cls, opt) {
    opt = opt || {};
    this.parts.push('<text x="' + x + '" y="' + y + '" class="' + (cls || 'dg-label') + '"' +
      (opt.anchor ? ' text-anchor="' + opt.anchor + '"' : '') +
      (opt.fill ? ' fill="' + opt.fill + '"' : '') +
      (opt.size ? ' font-size="' + opt.size + '"' : '') +
      (opt.weight ? ' font-weight="' + opt.weight + '"' : '') + '>' + esc(t) + '</text>');
    return this;
  };
  D.prototype.rect = function (x, y, w, h, c, opt) {
    opt = opt || {};
    this.parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (opt.rx == null ? 12 : opt.rx) +
      '" fill="' + (opt.fill || c) + '" fill-opacity="' + (opt.fo == null ? .07 : opt.fo) +
      '" stroke="' + c + '" stroke-opacity="' + (opt.so == null ? .38 : opt.so) + '"' + (opt.dash ? ' stroke-dasharray="' + opt.dash + '"' : '') + '/>');
    return this;
  };
  D.prototype.box = function (x, y, w, h, o) {
    o = o || {};
    var c = o.c || '#7fe9ff';
    this.rect(x, y, w, h, c, { rx: o.rx == null ? 12 : o.rx, fo: o.fo });
    if (o.t) this.text(x + w / 2, y + (o.sub ? 24 : h / 2 + 4), (o.e ? o.e + ' ' : '') + o.t, 'dg-title', { anchor: 'middle', fill: o.tc || '#eef1ff' });
    if (o.sub) this.text(x + w / 2, y + (o.t ? 44 : h / 2 + 4), o.sub, 'dg-sub', { anchor: 'middle' });
    if (o.sub2) this.text(x + w / 2, y + 59, o.sub2, 'dg-sub', { anchor: 'middle' });
    return this;
  };
  D.prototype.chip = function (x, y, t, c, opt) {
    opt = opt || {};
    var w = opt.w || (t.length * 11 + 18);
    this.parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="22" rx="11" fill="' + c + '" fill-opacity=".1" stroke="' + c + '" stroke-opacity=".35"/>');
    this.text(x + w / 2, y + 15, t, 'dg-chip', { anchor: 'middle', fill: c });
    return this;
  };
  D.prototype.arrow = function (x1, y1, x2, y2, opt) {
    opt = opt || {};
    var c = opt.c || '#8b96bd';
    var a = Math.atan2(y2 - y1, x2 - x1);
    var hl = opt.head || 7;
    var ex = x2 - Math.cos(a) * hl, ey = y2 - Math.sin(a) * hl;
    this.parts.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + ex + '" y2="' + ey + '" stroke="' + c + '" stroke-opacity="' + (opt.op == null ? .65 : opt.op) + '" stroke-width="' + (opt.sw || 1.5) + '"' + (opt.dash ? ' stroke-dasharray="' + opt.dash + '"' : '') + '/>');
    var p1 = (a + Math.PI / 2), p2 = (a - Math.PI / 2);
    this.parts.push('<path d="M' + x2 + ' ' + y2 + ' L' + (x2 - Math.cos(a) * hl + Math.cos(p1) * hl * .55) + ' ' + (y2 - Math.sin(a) * hl + Math.sin(p1) * hl * .55) +
      ' L' + (x2 - Math.cos(a) * hl + Math.cos(p2) * hl * .55) + ' ' + (y2 - Math.sin(a) * hl + Math.sin(p2) * hl * .55) + ' Z" fill="' + c + '" fill-opacity="' + (opt.op == null ? .8 : opt.op) + '"/>');
    return this;
  };
  D.prototype.line = function (x1, y1, x2, y2, c, opt) {
    opt = opt || {};
    this.parts.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-opacity="' + (opt.op == null ? .5 : opt.op) + '" stroke-width="' + (opt.sw || 1) + '"' + (opt.dash ? ' stroke-dasharray="' + opt.dash + '"' : '') + '/>');
    return this;
  };
  D.prototype.done = function () {
    return '<svg viewBox="0 0 ' + this.w + ' ' + this.h + '" xmlns="http://www.w3.org/2000/svg" class="dg" style="--diagram-readable-width:calc(max(18px, var(--reading-size, 18px)) * ' + (this.w / 10) + ')">' +
      '<defs><style>.dg text{font-family:"Microsoft YaHei","PingFang SC","Hub Sans SC",sans-serif}.dg-title{fill:#f2f5ff;font-size:12.5px;font-weight:700}.dg-sub{fill:#c4cee4;font-size:9.5px}.dg-label{fill:#dbe3f4;font-size:10.5px}.dg-chip{font-size:9px}.dg-mono{font-family:Consolas,monospace;font-size:9.5px;fill:#ffafd4}.dg-serif{font-family:Georgia,serif;font-style:italic;fill:#a3e5f4;font-size:9px;letter-spacing:.12em}</style></defs>' + this.parts.join('') + '</svg>';
  };

  function diag(id, title, caption, w, h, fn) {
    var g = new D(w, h);
    var reading = fn(g);
    window.DIAGRAMS[id] = { title: title, caption: caption, svg: g.done(), reading: reading };
  }

  /* ───────────── 入门 ───────────── */
  diag('d-genres', '二次元插画的四个出口', '同一套造型能力，交付物完全不同：动画要“能被批量画”，漫画要“能被印刷”，插画要“单张完成度”，立绘要“能被动”。', 820, 300, function (g) {
    g.text(30, 36, 'ANIME ILLUSTRATION · 四个常见方向', 'dg-serif');
    var items = [
      { c: '#ff8fc7', t: '动画 Animation', s: '赛璐璐 / 24fps', s2: '关键是“可批量复制”' },
      { c: '#c0a4ff', t: '漫画 Manga', s: '黑白 / 网点 / 分镜', s2: '关键是“叙事与印刷”' },
      { c: '#7fe9ff', t: '插画 Illustration', s: '单张 / 高完成度', s2: '关键是“画面表达”' },
      { c: '#ffd79a', t: '游戏立绘 Stand', s: '分层 / 可动画', s2: '关键是“工程规范”' }
    ];
    items.forEach(function (it, i) {
      var x = 30 + i * 193;
      g.rect(x, 66, 176, 168, it.c, { rx: 14 });
      g.text(x + 88, 96, it.t, 'dg-title', { anchor: 'middle' });
      g.text(x + 88, 120, it.s, 'dg-sub', { anchor: 'middle' });
      g.text(x + 88, 150, it.s2, 'dg-label', { anchor: 'middle' });
      g.text(x + 88, 206, '0' + (i + 1), 'dg-serif', { anchor: 'middle', fill: it.c });
    });
    g.arrow(30, 258, 790, 258, { c: '#ff8fc7', op: .5 });
    g.text(410, 282, '共同底层：结构 / 光影 / 色彩 / 审美判断 —— 先练这些，再选出口', 'dg-label', { anchor: 'middle' });
  });

  diag('d-toolmap', '工具地图：别把五个软件混成一个', '先用一个主武器画完 10 张完整作品，再学第二个。工具是工序，不是知识点。', 820, 380, function (g) {
    g.text(30, 36, 'TOOL MAP · 每件工具负责什么', 'dg-serif');
    g.box(320, 148, 180, 74, { c: '#ff8fc7', t: '造型能力', sub: '线 / 结构 / 光 / 色', e: '✏️' });
    var tools = [
      { x: 30, y: 70, c: '#b9a6ff', t: 'iPad · Procreate', s: '随身草图 / 厚涂 / 动画辅助' },
      { x: 610, y: 70, c: '#8ef0cf', t: 'SAI2', s: '勾线 / 水彩 / 轻量上色' },
      { x: 30, y: 240, c: '#8fb8ff', t: 'CSP', s: '矢量线稿 / 网点 / 连载' },
      { x: 610, y: 240, c: '#a0a8ff', t: 'Photoshop', s: '后期 / 调色 / 合成' },
      { x: 300, y: 290, c: '#5fe0d0', t: 'Live2D', s: '分层 / 网格 / 参数 / 物理' }
    ];
    tools.forEach(function (t) {
      g.box(t.x, t.y, 180, 62, { c: t.c, t: t.t, sub: t.s, rx: 11 });
      var tx = t.x + (t.x < 300 ? 180 : 0), ty = t.y + 31;
      g.arrow(tx, ty, tx < 410 ? 320 : 500, 185, { c: t.c, dash: '3 4', op: .55 });
    });
    g.text(410, 346, '主武器 1 个 + 补位 1~2 个，足够接稿；贪多只会每把都不熟。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-canvas', '画布与导出：一开始就设对', '头像、半身、印刷、Live2D 的画布规格不同。尺寸设错，后期要么糊，要么文件大到打不开。', 820, 310, function (g) {
    g.text(30, 36, 'CANVAS SPEC · 常用规格', 'dg-serif');
    var cols = [
      { x: 30, c: '#ff8fc7', t: '接稿头像', s: '2000 × 2000 px', s2: 'sRGB · 按交付选格式' },
      { x: 300, c: '#7fe9ff', t: '半身 / 立绘', s: '3000 × 4000 px', s2: '保留原生分层母版' },
      { x: 570, c: '#ffd79a', t: '印刷 A4', s: '2480 × 3508 px', s2: '300 ppi示例 · 无出血' }
    ];
    cols.forEach(function (c) {
      g.rect(c.x, 70, 220, 150, c.c, { rx: 14 });
      g.text(c.x + 110, 102, c.t, 'dg-title', { anchor: 'middle' });
      g.text(c.x + 110, 132, c.s, 'dg-label', { anchor: 'middle', fill: c.c });
      g.text(c.x + 110, 160, c.s2, 'dg-sub', { anchor: 'middle' });
      g.text(c.x + 110, 190, '用途 / 交付需确认', 'dg-sub', { anchor: 'middle' });
    });
    g.text(30, 258, 'Live2D：按目标模型、纹理与绑定需求约定尺寸；PSD 部件分层并清晰命名。', 'dg-label');
    g.text(30, 280, '保留分层母版；屏幕看像素尺寸，印刷按成品尺寸与印厂要求计算像素。', 'dg-sub');
  });

  /* ───────────── 造型地基 ───────────── */
  diag('d-head', '头部十字线：先定位置，再画五官', '二次元的五官可以夸张，但位置必须服从颅骨。十字线是“位置”，不是“脸型”。', 760, 420, function (g) {
    g.text(30, 34, 'HEAD CONSTRUCTION · 正面', 'dg-serif');
    // head
    g.parts.push('<ellipse cx="250" cy="210" rx="118" ry="150" fill="#ffe4d9" fill-opacity=".08" stroke="#ffd79a" stroke-opacity=".5"/>');
    g.line(250, 62, 250, 360, '#ff8fc7', { dash: '4 5', op: .5 });
    g.line(138, 196, 362, 196, '#7fe9ff', { dash: '4 5', op: .5 });
    g.line(146, 250, 354, 250, '#7fe9ff', { dash: '4 5', op: .35 });
    g.line(146, 222, 354, 222, '#c0a4ff', { dash: '4 5', op: .5 });
    g.text(370, 223, '眼线（示例）', 'dg-label');
    g.text(370, 64, '颅顶', 'dg-label');
    g.text(370, 196, '眉线', 'dg-label');
    g.text(370, 252, '鼻底', 'dg-label');
    g.text(370, 360, '下巴', 'dg-label');
    g.text(250, 392, '眉眼分开定位；比例随风格调整', 'dg-sub', { anchor: 'middle' });
    // right notes
    g.box(500, 70, 230, 64, { c: '#c0a4ff', t: '三庭', sub: '发际—眉—鼻—下巴，约三等分' });
    g.box(500, 152, 230, 64, { c: '#7fe9ff', t: '眼距', sub: '两眼之间约一只眼的宽度' });
    g.box(500, 234, 230, 64, { c: '#ffd79a', t: '耳朵', sub: '上沿≈眉线，下沿≈鼻底' });
    g.box(500, 316, 230, 64, { c: '#ff8fc7', t: '二次元偏移', sub: '眼睛下移、加大；鼻子弱化' });
  });

  diag('d-eyes', '眼睛不是“圆 + 圆”，是三层结构', '眉、眼睑、眼球方向共同影响表情，高光表现反射。先画眼眶方向，再放眼球。', 760, 350, function (g) {
    g.text(30, 34, 'EYE STRUCTURE · 侧面与正面', 'dg-serif');
    // eye shape large
    g.parts.push('<path d="M120 190 C140 128 220 110 280 142 C310 158 322 186 322 206 C310 246 250 268 196 254 C154 244 126 224 120 190 Z" fill="#fff8fc" fill-opacity=".92" stroke="#402c4c" stroke-width="3"/>');
    g.parts.push('<ellipse cx="210" cy="192" rx="44" ry="52" fill="#7a4ac4"/>');
    g.parts.push('<ellipse cx="210" cy="192" rx="44" ry="52" fill="none" stroke="#2a1849" stroke-width="2"/>');
    g.parts.push('<ellipse cx="210" cy="206" rx="17" ry="22" fill="#2a1849"/>');
    g.parts.push('<circle cx="196" cy="170" r="12" fill="#fff"/>');
    g.parts.push('<circle cx="228" cy="216" r="5" fill="#fff" opacity=".8"/>');
    g.parts.push('<path d="M120 190 C140 128 220 110 280 142 C310 158 322 186 322 206" fill="none" stroke="#2a1849" stroke-width="9" stroke-linecap="round"/>');
    g.text(348, 150, '上眼睑：包裹眼球，线粗可设计', 'dg-label');
    g.text(348, 190, '虹膜：上深下浅，有渐变', 'dg-label');
    g.text(348, 230, '瞳孔：可用黑或深色概括', 'dg-label');
    g.text(348, 270, '高光：按表面、光源和视点判断', 'dg-label');
    g.parts.push('<path d="M110 300 C180 330 280 330 340 300" fill="none" stroke="#7fe9ff" stroke-opacity=".5" stroke-dasharray="3 4"/>');
    g.text(380, 306, '下眼睑画多少依风格，先看包裹关系', 'dg-sub');
  });

  diag('d-body', '头身比：设计尺度，不是年龄判断', '二次元常用 6~7 头身；Q 版 2~3 头身。先用头高做尺子，别一上来就抠肌肉。', 820, 380, function (g) {
    g.text(30, 34, 'HEAD UNITS · 6.5 头身', 'dg-serif');
    var x = 180, top = 60, u = 42;
    g.line(150, top, 150, top + u * 7.2, '#ff8fc7', { op: .35, dash: '3 4' });
    for (var i = 0; i <= 7; i++) {
      g.line(144, top + u * i, 156, top + u * i, '#ff8fc7', { op: .45 });
      if (i < 7) g.text(132, top + u * i + u / 2 + 3, String(i + 1), 'dg-sub', { anchor: 'end' });
    }
    // silhouette
    g.parts.push('<ellipse cx="' + x + '" cy="' + (top + u * .5) + '" rx="26" ry="30" fill="#ffd79a" fill-opacity=".12" stroke="#ffd79a" stroke-opacity=".5"/>');
    g.parts.push('<path d="M' + (x - 26) + ' ' + (top + u * .95) + ' C' + (x - 34) + ' ' + (top + u * 2.1) + ' ' + (x - 30) + ' ' + (top + u * 3) + ' ' + (x - 24) + ' ' + (top + u * 3.4) + ' L' + (x - 26) + ' ' + (top + u * 4.4) + ' L' + (x - 24) + ' ' + (top + u * 6.4) + ' L' + (x - 12) + ' ' + (top + u * 6.4) + ' L' + (x - 10) + ' ' + (top + u * 4.4) + ' L' + (x + 4) + ' ' + (top + u * 4.4) + ' L' + (x + 6) + ' ' + (top + u * 6.4) + ' L' + (x + 18) + ' ' + (top + u * 6.4) + ' L' + (x + 20) + ' ' + (top + u * 4.4) + ' L' + (x + 18) + ' ' + (top + u * 3.4) + ' C' + (x + 30) + ' ' + (top + u * 3) + ' ' + (x + 34) + ' ' + (top + u * 2.1) + ' ' + (x + 26) + ' ' + (top + u * .95) + ' Z" fill="#7fe9ff" fill-opacity=".07" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.line(x, top + u, x, top + u * 3.2, '#ff8fc7', { op: .4 });
    g.line(x - 40, top + u * 2.1, x + 40, top + u * 2.1, '#ff8fc7', { op: .35 });
    g.line(x - 30, top + u * 3.4, x + 30, top + u * 3.4, '#ff8fc7', { op: .35 });
    g.text(250, top + u * .8, '肩宽 ≈ 1.5~1.8 个头宽', 'dg-sub');
    g.text(250, top + u * 2.2, '肘 ≈ 腰线', 'dg-sub');
    g.text(250, top + u * 3.5, '腕 ≈ 裆部', 'dg-sub');
    g.text(250, top + u * 6.7, '膝位依参考比较，脚底为总高', 'dg-sub');
    // right small silhouettes
    [['Q版 2.5', 30, '#c6f27e'], ['设计 6', 90, '#b9a6ff'], ['设计 7.5', 150, '#ff8fc7']].forEach(function (it, i) {
      var hh = 40 + i * 38, bx = 560 + i * 80;
      g.parts.push('<circle cx="' + bx + '" cy="' + (300 - hh) + '" r="' + (11 + i * 4) + '" fill="' + it[2] + '" fill-opacity=".16" stroke="' + it[2] + '" stroke-opacity=".5"/>');
      g.line(bx, 300 - hh + (11 + i * 4), bx, 300, it[2], { op: .35 });
      g.text(bx, 324, it[0], 'dg-sub', { anchor: 'middle' });
    });
  });

  diag('d-perspective', '透视：先有地平线，再有人', '人物不是贴在纸上，而是站在空间里。先定视平线与消失点，再决定脚踩在哪。', 820, 400, function (g) {
    g.text(30, 34, 'PERSPECTIVE · 一点 / 两点 / 三点', 'dg-serif');
    // three mini panels
    var panels = [
      { x: 30, t: '一点透视', s: '正面走廊 / 平视' },
      { x: 300, t: '两点透视', s: '街角 / 3/4 建筑' },
      { x: 570, t: '三点透视', s: '仰视 / 俯视' }
    ];
    panels.forEach(function (p) {
      g.rect(p.x, 56, 220, 260, '#7fe9ff', { rx: 12, fo: .04 });
      g.line(p.x + 10, 150, p.x + 210, 150, '#9aa4c4', { op: .3, dash: '3 4' });
      g.text(p.x + 110, 80, p.t, 'dg-title', { anchor: 'middle' });
      g.text(p.x + 110, 98, p.s, 'dg-sub', { anchor: 'middle' });
    });
    // one point
    g.line(30 + 20, 150, 30 + 110, 150, '#ff8fc7', { op: .5 });
    g.line(30 + 110, 150, 30 + 200, 110, '#ff8fc7', { op: .5 });
    g.line(30 + 110, 150, 30 + 200, 190, '#ff8fc7', { op: .5 });
    g.parts.push('<circle cx="140" cy="150" r="3" fill="#ff8fc7"/>');
    g.box(75, 200, 60, 60, { c: '#ff8fc7', rx: 4, fo: .16 });
    // two point
    g.line(300 + 20, 110, 300 + 190, 110, '#c0a4ff', { op: .5 });
    g.line(300 + 20, 230, 300 + 190, 230, '#c0a4ff', { op: .5 });
    g.parts.push('<circle cx="300" cy="170" r="3" fill="#c0a4ff"/><circle cx="520" cy="170" r="3" fill="#c0a4ff"/>');
    g.box(370, 140, 70, 70, { c: '#c0a4ff', rx: 4, fo: .16 });
    // three point
    g.line(570 + 20, 200, 570 + 200, 200, '#ffd79a', { op: .5 });
    g.parts.push('<circle cx="680" cy="60" r="3" fill="#ffd79a"/>');
    g.line(570 + 20, 200, 680, 60, '#ffd79a', { op: .3, dash: '3 4' });
    g.line(570 + 200, 200, 680, 60, '#ffd79a', { op: .3, dash: '3 4' });
    g.box(640, 170, 55, 75, { c: '#ffd79a', rx: 4, fo: .16 });
    g.text(410, 356, '先画角色脚下的“地面投影”，再把人立起来；悬空姿势另用遮挡、尺度与动作交代空间。', 'dg-label', { anchor: 'middle' });
  });

  diag('d-anatomy', '体块：把人体拆成球、柱、箱', '不要背肌肉名字。先会用球（头/关节）、柱（四肢）、箱（胸腔/骨盆）搭出可转动的结构。', 760, 340, function (g) {
    g.text(30, 34, 'BLOCK CONSTRUCTION · 体块', 'dg-serif');
    g.parts.push('<circle cx="160" cy="150" r="46" fill="#ffd79a" fill-opacity=".12" stroke="#ffd79a" stroke-opacity=".6"/>');
    g.text(160, 155, '头', 'dg-title', { anchor: 'middle' });
    g.parts.push('<rect x="300" y="100" width="80" height="120" rx="10" fill="#7fe9ff" fill-opacity=".1" stroke="#7fe9ff" stroke-opacity=".5"/>');
    g.text(340, 165, '胸腔', 'dg-title', { anchor: 'middle' });
    g.parts.push('<rect x="300" y="238" width="80" height="60" rx="10" fill="#7fe9ff" fill-opacity=".1" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.text(340, 274, '骨盆', 'dg-title', { anchor: 'middle' });
    g.parts.push('<line x1="340" y1="196" x2="340" y2="238" stroke="#ff8fc7" stroke-opacity=".4" stroke-dasharray="3 4"/>');
    g.parts.push('<circle cx="455" cy="130" r="18" fill="#c0a4ff" fill-opacity=".18" stroke="#c0a4ff" stroke-opacity=".6"/>');
    g.line(455, 148, 455, 236, '#c0a4ff', { op: .5, sw: 10 });
    g.parts.push('<circle cx="455" cy="236" r="12" fill="#c0a4ff" fill-opacity=".18" stroke="#c0a4ff" stroke-opacity=".6"/>');
    g.text(500, 150, '球 = 关节', 'dg-sub');
    g.text(500, 190, '柱 = 四肢', 'dg-sub');
    g.box(590, 80, 140, 86, { c: '#ff8fc7', t: '先大后小', sub: '先定体块朝向，再抠轮廓' });
    g.box(590, 186, 140, 86, { c: '#8ef0cf', t: '先中后边', sub: '先画躯干，再接四肢' });
    g.text(30, 320, '所有复杂姿势，都可以还原成这几个体块的组合与透视。', 'dg-sub');
  });

  diag('d-light', '三大面五大调：先把球画对', '五大调常指亮调、灰调、明暗交界线、反光、投影；高光另指镜面反射。图为简化光照提示，不是每个物体的固定色带。', 760, 380, function (g) {
    g.text(30, 34, 'LIGHT & SHADOW · 球体', 'dg-serif');
    g.parts.push('<defs><radialGradient id="dg-ball" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff3dd"/><stop offset=".35" stop-color="#ffd79a"/><stop offset=".75" stop-color="#b06b62"/><stop offset="1" stop-color="#5a2f3a"/></radialGradient></defs>');
    g.parts.push('<circle cx="260" cy="190" r="110" fill="url(#dg-ball)"/>');
    g.parts.push('<ellipse cx="310" cy="306" rx="90" ry="18" fill="#000" opacity=".35"/>');
    g.parts.push('<circle cx="228" cy="146" r="18" fill="#fff" opacity=".5"/>');
    var notes = [
      ['高光', 228, 146], ['亮部', 250, 180], ['明暗交界线', 300, 225], ['暗部', 330, 250], ['反光', 348, 225], ['投影', 330, 316]
    ];
    notes.forEach(function (n) {
      g.parts.push('<circle cx="' + n[1] + '" cy="' + n[2] + '" r="3" fill="#7fe9ff"/>');
    });
    g.text(420, 110, '① 高光：另看表面、光源与视点', 'dg-label');
    g.text(420, 150, '② 亮/灰调：受光侧的层次', 'dg-label');
    g.text(420, 190, '③ 明暗交界线：亮暗转折附近', 'dg-label');
    g.text(420, 230, '④ 暗侧：可能接受环境照明', 'dg-label');
    g.text(420, 270, '⑤ 反光：地面/环境弹回的光', 'dg-label');
    g.text(420, 310, '⑥ 投影：物体挡住光形成的形', 'dg-label');
    g.text(420, 350, '赛璐璐可合并层次；不是只留高光与交界线。', 'dg-sub');
  });

  diag('d-drape', '衣褶：只画“被拉紧”和“堆起来”的地方', '衣褶不是随机线条，是布料在重力与张力下的结果。先找张力点（肩、肘、腰、膝），再画褶。', 760, 340, function (g) {
    g.text(30, 34, 'DRAPERY · 三种基本褶', 'dg-serif');
    // stretch folds
    g.parts.push('<path d="M70 90 C110 80 150 90 180 120 L180 250 C150 270 110 270 70 250 Z" fill="#7fe9ff" fill-opacity=".08" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.parts.push('<path d="M90 110 C120 150 130 200 125 245" fill="none" stroke="#7fe9ff" stroke-opacity=".55"/>');
    g.parts.push('<path d="M125 110 C145 155 150 200 148 245" fill="none" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.text(125, 292, '拉伸褶 · 从支点放射', 'dg-label', { anchor: 'middle' });
    // drop folds
    g.parts.push('<path d="M300 90 L430 90 L430 250 L300 250 Z" fill="#ffd79a" fill-opacity=".07" stroke="#ffd79a" stroke-opacity=".35"/>');
    g.parts.push('<path d="M320 110 C318 160 322 210 320 245" fill="none" stroke="#ffd79a" stroke-opacity=".5"/>');
    g.parts.push('<path d="M365 110 C370 160 368 210 372 245" fill="none" stroke="#ffd79a" stroke-opacity=".5"/>');
    g.parts.push('<path d="M410 110 C405 160 410 210 406 245" fill="none" stroke="#ffd79a" stroke-opacity=".4"/>');
    g.text(365, 292, '垂坠褶 · 竖直向下', 'dg-label', { anchor: 'middle' });
    // compression
    g.parts.push('<path d="M560 100 C590 80 640 80 670 100 L670 250 C640 270 590 270 560 250 Z" fill="#c0a4ff" fill-opacity=".08" stroke="#c0a4ff" stroke-opacity=".4"/>');
    g.parts.push('<path d="M575 150 C600 130 630 130 655 150 M575 180 C600 160 630 160 655 180 M575 210 C600 190 630 190 655 210" fill="none" stroke="#c0a4ff" stroke-opacity=".55"/>');
    g.text(615, 292, '挤压褶 · 关节处堆叠', 'dg-label', { anchor: 'middle' });
    g.text(380, 326, '口诀：支点放射、重力下垂、关节堆叠；其余地方尽量安静。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-composition', '构图：先安排“看哪里”，再画细节', '三分法、引导线、留白、大小对比。本练习先突出一个视觉中心；多焦点或均衡构图也可成立。', 760, 360, function (g) {
    g.text(30, 34, 'COMPOSITION · 三分与引导', 'dg-serif');
    g.rect(60, 64, 300, 240, '#7fe9ff', { rx: 8, fo: .03 });
    for (var i = 1; i < 3; i++) {
      g.line(60 + i * 100, 64, 60 + i * 100, 304, '#7fe9ff', { op: .25, dash: '3 4' });
      g.line(60, 64 + i * 80, 360, 64 + i * 80, '#7fe9ff', { op: .25, dash: '3 4' });
    }
    g.parts.push('<circle cx="260" cy="144" r="5" fill="#ff8fc7"/>');
    g.text(270, 138, '视觉中心', 'dg-label', { fill: '#ff8fc7' });
    g.line(90, 280, 260, 144, '#ff8fc7', { op: .3, dash: '4 4' });
    g.parts.push('<path d="M90 280 C140 250 180 230 230 220" fill="none" stroke="#ffd79a" stroke-opacity=".35" stroke-width="2"/>');
    g.text(410, 110, '① 三分交点：放眼睛 / 脸 / 关键道具', 'dg-label');
    g.text(410, 150, '② 引导线：用头发、手臂、道具把视线带过去', 'dg-label');
    g.text(410, 190, '③ 留白：让视觉中心有呼吸的空间', 'dg-label');
    g.text(410, 230, '④ 大小对比：按目标分主次，无固定面积线', 'dg-label');
    g.text(410, 286, '检验方法：眯眼 / 缩小到 200px，还能一眼看出主角吗？', 'dg-sub');
  });

  /* ───────────── 赛璐璐核心 ───────────── */
  diag('d-celstages', '赛璐璐色阶：按任务组织明暗', '底色 → 一阴 → 二阴 → 高光。层数不是越多越好；每一层都要有明确的“形状任务”。', 820, 380, function (g) {
    g.text(30, 34, 'CEL VALUE STAGES · 色阶', 'dg-serif');
    var stages = [
      { c: '#ffe4d9', t: '底色 Base', s: '受光面 / 固有色', n: '01' },
      { c: '#f3b7b2', t: '一阴 Shadow', s: '结构转折 / 大块', n: '02' },
      { c: '#c97d86', t: '二阴 Deep', s: '闭塞 / 最深处', n: '03' },
      { c: '#fff6ee', t: '高光 Light', s: '点 / 带 / 边缘', n: '04' }
    ];
    stages.forEach(function (s, i) {
      var x = 30 + i * 193;
      g.parts.push('<rect x="' + x + '" y="70" width="176" height="120" rx="12" fill="' + s.c + '"/>');
      g.text(x + 16, 208, s.t, 'dg-title');
      g.text(x + 16, 228, s.s, 'dg-sub');
      g.text(x + 160, 208, s.n, 'dg-serif', { anchor: 'end', fill: '#7fe9ff' });
      if (i < 3) g.arrow(x + 180, 130, x + 190, 130, { c: '#ff8fc7', op: .5 });
    });
    g.text(30, 270, '判断层数的方法：眯眼看，检查明暗分组是否服务结构与主体；有三档色不代表画面自动成立。', 'dg-label');
    g.text(30, 300, '检查形状、明度与环境是否协调；黑色、渐变或大暗面本身不等于错误。', 'dg-sub');
    g.text(30, 340, '赛璐璐的“干净”来自边界清楚，而不是颜色少。', 'dg-label', { fill: '#ffd79a' });
  });

  diag('d-celshape', '阴影形状：结合结构设计，再涂', '左边是“跟着结构描”，右边是“把阴影当成图形设计”。两者都要解释结构；图中比较的是碎边与概括，不是鼓励无视光照。', 820, 360, function (g) {
    g.text(30, 34, 'SHADOW SHAPE DESIGN · 设计 vs 描摹', 'dg-serif');
    // left messy
    g.rect(40, 60, 330, 250, '#ff9a9a', { rx: 12, fo: .04 });
    g.text(205, 86, '碎边过多：示例', 'dg-title', { anchor: 'middle', fill: '#ff9a9a' });
    g.parts.push('<ellipse cx="205" cy="180" rx="80" ry="90" fill="#ffe4d9" fill-opacity=".1" stroke="#ff9a9a" stroke-opacity=".4"/>');
    g.parts.push('<path d="M150 190 C160 170 180 180 190 200 C200 220 210 190 225 210 C240 230 250 200 260 220 C250 240 220 250 200 245 C175 240 150 220 150 190 Z" fill="#c97d86" fill-opacity=".55"/>');
    g.text(205, 292, '边缘碎、形状无节奏', 'dg-sub', { anchor: 'middle' });
    // right designed
    g.rect(420, 60, 330, 250, '#7fe9ff', { rx: 12, fo: .04 });
    g.text(585, 86, '先切成图形 ✓', 'dg-title', { anchor: 'middle', fill: '#7fe9ff' });
    g.parts.push('<ellipse cx="585" cy="180" rx="80" ry="90" fill="#ffe4d9" fill-opacity=".1" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.parts.push('<path d="M520 180 C540 150 565 145 585 155 C605 145 630 150 650 180 C630 200 610 205 585 198 C560 205 540 200 520 180 Z" fill="#f3b7b2" fill-opacity=".75"/>');
    g.parts.push('<path d="M585 198 C600 210 620 215 640 210 C630 226 610 232 596 226 C590 216 587 206 585 198 Z" fill="#c97d86" fill-opacity=".7"/>');
    g.text(585, 292, '边缘整、明暗有大小节奏', 'dg-sub', { anchor: 'middle' });
    g.arrow(380, 185, 410, 185, { c: '#ffd79a' });
    g.text(395, 340, '先画“阴影的形状”，再决定它贴不贴结构；大形对了，小结构可以省略。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-ao', '闭塞（AO）：只加在“光进不去”的缝里', 'AO 不是“更深的阴影”，而是环境光被挡住的位置。加对了体积立刻出来，加多了画面发脏。', 760, 360, function (g) {
    g.text(30, 34, 'AMBIENT OCCLUSION · 闭塞位置', 'dg-serif');
    g.parts.push('<ellipse cx="250" cy="180" rx="90" ry="105" fill="#ffe4d9" fill-opacity=".07" stroke="#ff8fc7" stroke-opacity=".35"/>');
    g.parts.push('<path d="M170 155 C190 130 230 128 250 140 C270 128 310 130 330 155 L330 175 C300 160 270 158 250 165 C230 158 200 160 170 175 Z" fill="#c97d86" fill-opacity=".35"/>');
    var pts = [
      ['发下', 250, 140], ['下巴下', 250, 286], ['鼻底', 270, 214], ['唇下', 250, 250], ['衣领', 200, 300]
    ];
    pts.forEach(function (p) {
      g.parts.push('<circle cx="' + p[1] + '" cy="' + p[2] + '" r="4" fill="#ffd79a"/>');
      g.parts.push('<circle cx="' + p[1] + '" cy="' + p[2] + '" r="9" fill="none" stroke="#ffd79a" stroke-opacity=".35"/>');
    });
    g.text(400, 120, '① 头发与额头之间', 'dg-label');
    g.text(400, 158, '② 下巴与脖子之间', 'dg-label');
    g.text(400, 196, '③ 鼻底 / 唇下 / 眼窝', 'dg-label');
    g.text(400, 234, '④ 衣领、袖口、裙摆内侧', 'dg-label');
    g.text(400, 272, '⑤ 两个物体接触的缝隙', 'dg-label');
    g.text(400, 316, '规则：AO 窄、深、贴着接触边；不要大面积铺。', 'dg-sub');
  });

  diag('d-rim', '边缘光：让角色从背景里“跳”出来', '在暗面轮廓加一条冷色光，是最便宜的“完成度”。注意光的方向要和主光源一致。', 760, 340, function (g) {
    g.text(30, 34, 'RIM LIGHT · 轮廓光', 'dg-serif');
    g.parts.push('<ellipse cx="250" cy="180" rx="95" ry="110" fill="#2a1849" fill-opacity=".5" stroke="#402c4c" stroke-opacity=".5"/>');
    g.parts.push('<path d="M330 110 C350 160 352 210 330 255 C318 280 300 295 285 302" fill="none" stroke="#9beeff" stroke-width="5" stroke-linecap="round" opacity=".9"/>');
    g.parts.push('<path d="M345 130 C362 180 360 230 342 268" fill="none" stroke="#9beeff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>');
    g.parts.push('<path d="M60 110 L120 110" stroke="#ffd79a" stroke-width="1.5"/><path d="M60 118 L110 118" stroke="#ffd79a" stroke-width="1" opacity=".5"/>');
    g.text(60, 100, '主光', 'dg-sub');
    g.text(380, 120, '轮廓光：冷色、细、只在一侧', 'dg-label');
    g.text(380, 158, '宽度 2~4px，别画成描边', 'dg-sub');
    g.text(380, 196, '与背景同色系时，加对比色', 'dg-sub');
    g.text(380, 234, '头发/肩/裙摆最容易出效果', 'dg-sub');
    g.text(380, 286, '先看后侧光源与表面朝向，再决定亮边位置。', 'dg-label', { fill: '#ffd79a' });
  });

  diag('d-hue', '阴影配色：明度优先，偏色按需', '以下只是三组配色示例。先保证明暗分组，再按光源、环境与风格决定色相；同色相也可成立。', 820, 340, function (g) {
    g.text(30, 34, 'HUE SHIFT · 阴影色相偏移', 'dg-serif');
    var rows = [
      { y: 70, t: '皮肤', base: '#ffe4d9', sh: '#f3b7b2', deep: '#c97d86', note: '偏红紫，饱和度略升' },
      { y: 150, t: '紫发', base: '#d9c9f6', sh: '#a68fd6', deep: '#7b64ae', note: '偏蓝紫，明度降' },
      { y: 230, t: '白衣', base: '#f7f2ff', sh: '#c9c6e8', deep: '#9a9ac4', note: '偏冷蓝，饱和度降' }
    ];
    rows.forEach(function (r) {
      g.text(30, r.y + 22, r.t, 'dg-title');
      [r.base, r.sh, r.deep].forEach(function (c, i) {
        g.parts.push('<rect x="' + (110 + i * 90) + '" y="' + r.y + '" width="76" height="48" rx="8" fill="' + c + '"/>');
        g.text(110 + i * 90 + 38, r.y + 66, c.toUpperCase(), 'dg-mono', { anchor: 'middle', fill: '#9aa4c4' });
      });
      g.text(410, r.y + 28, r.note, 'dg-label');
      g.arrow(380, r.y + 24, 400, r.y + 24, { c: '#ff8fc7', op: .4 });
    });
    g.text(30, 312, '检验：灰度下分组清楚；彩色下与环境协调。此处颜色不是通用公式。', 'dg-sub');
  });

  diag('d-layers', '赛璐璐图层结构：工业级分层', '常见参考结构：底色在下，线稿在上；阴影按底色限制范围。二阴、高光与后期按需添加，混合模式不是固定要求。', 780, 420, function (g) {
    g.text(30, 34, 'LAYER STACK · 分层逻辑', 'dg-serif');
    var layers = [
      { t: '后期 / 调色', s: '曲线 / 渐变映射 / 锐化', c: '#ffd79a', m: '正常' },
      { t: '线稿 / 边缘光', s: '按需分开建层', c: '#9beeff', m: '滤色' },
      { t: '高光', s: '点光 / 带光', c: '#fff6ee', m: '滤色' },
      { t: '二阴 / 闭塞', s: '只加深暗部', c: '#c97d86', m: '正片叠底' },
      { t: '一阴', s: '大块结构阴影', c: '#f3b7b2', m: '正片叠底' },
      { t: '底色', s: '固有色 / 分区', c: '#ffe4d9', m: '正常' },
      { t: '底层背景', s: '保留透明版时可关闭', c: '#8fa2b7', m: '正常' }
    ];
    layers.forEach(function (l, i) {
      var y = 62 + i * 44;
      g.rect(40, y, 420, 36, l.c, { rx: 8, fo: .08 });
      g.parts.push('<rect x="48" y="' + (y + 8) + '" width="20" height="20" rx="4" fill="' + l.c + '" fill-opacity=".5"/>');
      g.text(80, y + 23, l.t, 'dg-title');
      g.text(230, y + 23, l.s, 'dg-sub');
      g.text(430, y + 23, l.m, 'dg-sub', { anchor: 'end' });
    });
    g.text(500, 86, '① 线稿单独一层，随时可改色', 'dg-label');
    g.text(500, 128, '② 阴影层全部剪贴到底色', 'dg-label');
    g.text(500, 170, '③ 内部高光可剪贴，辉光另层', 'dg-label');
    g.text(500, 212, '④ 二阴只加在 AO 与交界', 'dg-label');
    g.text(500, 254, '⑤ 后期合并前另存一份', 'dg-label');
    g.text(500, 310, '命名规范：角色_部位_层性质_版本', 'dg-sub');
    g.text(500, 334, '例：Mika_hair_shadow_v03', 'dg-mono');
  });

  diag('d-eye-cel', '眼睛的赛璐璐画法：4 层就够', '底色 → 上睑阴影 → 虹膜渐变 → 高光。眼白与瞳孔可按画风选黑白或带色，不把某种色号当唯一答案。', 760, 340, function (g) {
    g.text(30, 34, 'CEL EYE · 四层', 'dg-serif');
    var steps = [
      { x: 40, t: '① 底色', s: '眼白 #fff8fc\n虹膜底色', c: '#7a4ac4' },
      { x: 220, t: '② 上睑阴影', s: '虹膜上半压深', c: '#2a1849' },
      { x: 400, t: '③ 虹膜渐变', s: '上深下浅 + 瞳孔', c: '#ff9cc4' },
      { x: 580, t: '④ 高光', s: '一大一小 + 反光', c: '#fff' }
    ];
    steps.forEach(function (s, i) {
      g.rect(s.x, 60, 160, 190, s.c, { rx: 12, fo: .05 });
      g.parts.push('<path d="M' + (s.x + 30) + ' 160 C' + (s.x + 50) + ' 110 ' + (s.x + 110) + ' 105 ' + (s.x + 130) + ' 150 C' + (s.x + 120) + ' 190 ' + (s.x + 70) + ' 205 ' + (s.x + 40) + ' 185 Z" fill="#fff8fc" fill-opacity=".9"/>');
      g.parts.push('<ellipse cx="' + (s.x + 82) + '" cy="152" rx="22" ry="27" fill="#7a4ac4"/>');
      if (i >= 1) g.parts.push('<ellipse cx="' + (s.x + 82) + '" cy="140" rx="21" ry="12" fill="#2a1849" opacity=".55"/>');
      if (i >= 2) { g.parts.push('<ellipse cx="' + (s.x + 82) + '" cy="164" rx="14" ry="9" fill="#ff9cc4" opacity=".6"/>'); g.parts.push('<ellipse cx="' + (s.x + 82) + '" cy="152" rx="7" ry="9" fill="#2a1849"/>'); }
      if (i >= 3) { g.parts.push('<circle cx="' + (s.x + 74) + '" cy="138" r="6" fill="#fff"/>'); g.parts.push('<circle cx="' + (s.x + 90) + '" cy="164" r="3" fill="#fff" opacity=".8"/>'); }
      g.text(s.x + 80, 276, s.t, 'dg-title', { anchor: 'middle' });
      g.text(s.x + 80, 296, s.s.split('\n')[0], 'dg-sub', { anchor: 'middle' });
    });
    g.text(380, 326, '高光按曲面与光源判断；线色、眼白与瞳孔可按画风选黑白或带色。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-workflow-cel', '一张赛璐璐成图的 7 道工序', '草稿 → 线稿 → 底色 → 一阴 → 二阴 → 高光/边缘光 → 后期。每道工序都有验收点。', 900, 220, function (g) {
    g.text(30, 34, 'CEL WORKFLOW · 7 STEPS', 'dg-serif');
    var steps = ['草稿', '线稿', '底色', '一阴', '二阴', '高光', '后期'];
    steps.forEach(function (s, i) {
      var x = 30 + i * 122;
      g.parts.push('<circle cx="' + (x + 50) + '" cy="120" r="26" fill="#ff8fc7" fill-opacity=".08" stroke="#ff8fc7" stroke-opacity=".45"/>');
      g.text(x + 50, 125, String(i + 1), 'dg-title', { anchor: 'middle' });
      g.text(x + 50, 172, s, 'dg-title', { anchor: 'middle' });
      if (i < 6) g.arrow(x + 78, 120, x + 120, 120, { c: '#ff8fc7', op: .45 });
    });
    g.text(450, 204, '验收点：草稿看构图 / 线稿看穿插 / 底色看分区 / 阴影看形状 / 高光看方向 / 后期看整体', 'dg-sub', { anchor: 'middle' });
  });

  /* ───────────── iPad ───────────── */
  diag('d-procreate-ui', 'Procreate 界面：先认位置，再查手势', '左侧主要调尺寸与不透明度；画笔、涂抹、橡皮、图层与颜色在右上。此图为区域示意，具体图标与手势按自己的版本设置核对。', 820, 420, function (g) {
    g.text(30, 34, 'PROCREATE UI · 区域示意', 'dg-serif');
    g.rect(30, 60, 510, 290, '#b9a6ff', { rx: 14 });
    g.rect(45, 76, 100, 30, '#ff8fc7', { rx: 6 });
    g.text(95, 96, '图库 / 操作 / 调整', 'dg-sub', { anchor: 'middle' });
    g.rect(280, 76, 244, 30, '#7fe9ff', { rx: 6 });
    g.text(402, 96, '画笔 · 涂抹 · 橡皮 · 图层 · 颜色', 'dg-sub', { anchor: 'middle' });
    g.rect(90, 120, 425, 212, '#7fe9ff', { rx: 4, fo: .02 });
    g.text(300, 235, '画布', 'dg-title', { anchor: 'middle' });
    g.line(62, 145, 62, 205, '#ff8fc7', { sw: 5 });
    g.line(62, 240, 62, 300, '#7fe9ff', { sw: 5 });
    g.text(570, 100, '左侧：尺寸 / 不透明度', 'dg-label');
    g.text(570, 148, '右上：工具 / 图层 / 颜色', 'dg-label');
    g.text(570, 196, '左上：操作 / 调整等', 'dg-label');
    g.text(570, 244, '默认：双指撤销', 'dg-label');
    g.text(570, 292, '手势可在设置中核对', 'dg-label');
    g.text(40, 390, '找不到某个按钮时，先核对版本、所处界面与手势控制设置，不背固定点击位置。', 'dg-sub');
  });

  diag('d-brushstudio', '笔刷工作室：先调 4 个参数', '先比较间距、抖动、锥度、压感；设备、延迟、稳定设置与笔刷形状也会影响手感。', 820, 360, function (g) {
    g.text(30, 34, 'BRUSH STUDIO · 四个关键参数', 'dg-serif');
    var params = [
      { y: 80, t: '间距 Spacing', s: '越高越“点状”，越低越顺滑', v: '勾线 3~8%', c: '#ff8fc7' },
      { y: 150, t: '抖动 Jitter', s: '形状/尺寸抖动，做纹理用', v: '勾线 0%', c: '#b9a6ff' },
      { y: 220, t: '锥度 Taper', s: '起笔/收笔变细，线条有呼吸', v: '两端 30~60%', c: '#7fe9ff' },
      { y: 290, t: '压感 Pressure', s: '尺寸/透明度随压力变化', v: '尺寸 80%', c: '#ffd79a' }
    ];
    params.forEach(function (p) {
      g.text(40, p.y, p.t, 'dg-title');
      g.text(40, p.y + 20, p.s, 'dg-sub');
      g.parts.push('<rect x="250" y="' + (p.y - 14) + '" width="300" height="6" rx="3" fill="#fff" fill-opacity=".1"/>');
      var pct = [.22, .04, .5, .8][params.indexOf(p)];
      g.parts.push('<rect x="250" y="' + (p.y - 14) + '" width="' + (300 * pct) + '" height="6" rx="3" fill="' + p.c + '"/>');
      g.parts.push('<circle cx="' + (250 + 300 * pct) + '" cy="' + (p.y - 11) + '" r="7" fill="#fff" stroke="' + p.c + '" stroke-width="2"/>');
      g.text(570, p.y - 8, p.v, 'dg-mono', { fill: p.c });
    });
    g.rect(640, 80, 150, 200, '#ff8fc7', { rx: 12, fo: .04 });
    g.text(715, 108, '推荐起手', 'dg-title', { anchor: 'middle' });
    g.text(715, 140, '勾线：硬圆 + 压感尺寸', 'dg-sub', { anchor: 'middle' });
    g.text(715, 168, '平涂：硬圆 + 0 抖动', 'dg-sub', { anchor: 'middle' });
    g.text(715, 196, '水彩：湿海绵 + 低间距', 'dg-sub', { anchor: 'middle' });
    g.text(715, 224, '噪点：颗粒 + 高抖动', 'dg-sub', { anchor: 'middle' });
    g.text(715, 252, '先复制官方笔刷再改', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-blend', '混合模式：绘画只需记住 4 个', '正片叠底做阴影，滤色做光，叠加做对比，颜色减淡做发光。', 820, 340, function (g) {
    g.text(30, 34, 'BLEND MODES · 四个够用', 'dg-serif');
    var modes = [
      { x: 30, t: '正片叠底', s: 'Multiply', d: '阴影 / 加深', c: '#ff8fc7' },
      { x: 225, t: '滤色', s: 'Screen', d: '光 / 提亮', c: '#7fe9ff' },
      { x: 420, t: '叠加', s: 'Overlay', d: '对比 / 染色', c: '#c0a4ff' },
      { x: 615, t: '颜色减淡', s: 'Color Dodge', d: '高光 / 发光', c: '#ffd79a' }
    ];
    modes.forEach(function (m, i) {
      g.rect(m.x, 60, 175, 210, m.c, { rx: 12, fo: .05 });
      // demo circles
      g.parts.push('<circle cx="' + (m.x + 55) + '" cy="130" r="34" fill="#4b3a8f" fill-opacity=".8"/>');
      g.parts.push('<circle cx="' + (m.x + 110) + '" cy="130" r="34" fill="#ff8fc7" fill-opacity=".55"/>');
      g.text(m.x + 88, 200, m.t, 'dg-title', { anchor: 'middle' });
      g.text(m.x + 88, 222, m.s, 'dg-serif', { anchor: 'middle', fill: m.c });
      g.text(m.x + 88, 248, m.d, 'dg-sub', { anchor: 'middle' });
    });
    g.text(410, 312, '正常图层同样能画阴影。混合模式会改变颜色结果，先小范围试，再比较明度与边界。', 'dg-sub', { anchor: 'middle' });
  });

  /* ───────────── SAI2 ───────────── */
  diag('d-sai-stabilizer', 'SAI2 防抖：手抖星人的救命参数', '防抖不是越高越好。S-7 适合勾线，S-10 以上会“拖笔”，细节反而难控制。', 820, 320, function (g) {
    g.text(30, 34, 'SAI2 · STABILIZER', 'dg-serif');
    g.rect(40, 60, 350, 210, '#8ef0cf', { rx: 12, fo: .03 });
    g.parts.push('<path d="M70 200 C90 150 110 220 130 170 C150 120 170 220 190 160 C210 100 230 210 250 150 C270 90 290 200 310 140 C330 80 350 190 370 130" fill="none" stroke="#ff9a9a" stroke-width="2" opacity=".7"/>');
    g.text(215, 246, '防抖 0：线条毛躁', 'dg-sub', { anchor: 'middle' });
    g.rect(430, 60, 350, 210, '#8ef0cf', { rx: 12, fo: .03 });
    g.parts.push('<path d="M460 200 C490 150 520 190 550 160 C580 130 610 180 640 150 C670 120 700 170 740 140" fill="none" stroke="#8ef0cf" stroke-width="3" opacity=".9"/>');
    g.text(605, 246, '防抖 S-7：顺滑但仍有手味', 'dg-sub', { anchor: 'middle' });
    g.text(30, 304, '设置：工具 → 防抖 → S-7；勾长线用 S-9，画短线/睫毛用 S-3~5。', 'dg-label');
  });

  diag('d-sai-watercolor', 'SAI2 水彩笔：边界与混色', '混色、拖拽、笔触边界与底图共同影响效果；参数名依构建而异。赛璐璐只需要轻微混色，不要糊成一片。', 760, 320, function (g) {
    g.text(30, 34, 'SAI2 · WATERCOLOR', 'dg-serif');
    g.rect(40, 60, 680, 200, '#8ef0cf', { rx: 12, fo: .03 });
    g.parts.push('<path d="M80 210 C140 140 180 230 240 170 C300 110 340 220 400 160 C460 100 500 210 560 150 C620 90 660 190 700 140" fill="none" stroke="#8ef0cf" stroke-width="26" stroke-linecap="round" opacity=".12"/>');
    g.parts.push('<path d="M80 210 C140 140 180 230 240 170 C300 110 340 220 400 160 C460 100 500 210 560 150 C620 90 660 190 700 140" fill="none" stroke="#8ef0cf" stroke-width="8" stroke-linecap="round" opacity=".5"/>');
    g.text(80, 92, '混色较强：边缘扩散、适合肤色过渡', 'dg-label');
    g.text(80, 116, '颜色拖拽较强：会把颜色拖进邻区，慎用', 'dg-sub');
    g.text(420, 286, '赛璐璐用法：水彩只用于阴影边缘的 1~2 笔，不要整张糊。', 'dg-sub');
  });

  /* ───────────── CSP ───────────── */
  diag('d-csp-vector', 'CSP 矢量线稿：可改路径与线宽', '矢量图层用控制点改线，线宽随笔压记录；适合需要反复修改的商稿与连载。', 760, 320, function (g) {
    g.text(30, 34, 'CSP · VECTOR LAYER', 'dg-serif');
    g.parts.push('<path d="M70 210 C130 120 210 240 280 150 C350 60 430 230 520 150 C590 90 650 180 700 120" fill="none" stroke="#8fb8ff" stroke-width="4" stroke-linecap="round"/>');
    [[70, 210], [280, 150], [520, 150], [700, 120]].forEach(function (p) {
      g.parts.push('<rect x="' + (p[0] - 5) + '" y="' + (p[1] - 5) + '" width="10" height="10" fill="#0a0d19" stroke="#8fb8ff" stroke-width="2"/>');
    });
    g.text(90, 90, '控制点：拖动即可改线形', 'dg-label');
    g.text(400, 270, '视图放大也会放大可见线宽；路径编辑不等于无限像素。', 'dg-sub');
    g.text(400, 296, '缺点：矢量笔刷表现力弱，厚涂仍要转普通图层。', 'dg-sub');
  });

  diag('d-csp-tone', 'CSP 网点：密度、线数、角度', '网点可用点覆盖率表达灰度；线数、角度、叠加与缩放会影响摩尔纹，不能随意错角就保证避免。', 760, 320, function (g) {
    g.text(30, 34, 'CSP · SCREENTONE', 'dg-serif');
    [['10%', 40, .1], ['30%', 150, .3], ['50%', 260, .5], ['70%', 370, .7]].forEach(function (t, i) {
      g.rect(40 + i * 110, 70, 90, 120, '#8fb8ff', { rx: 6, fo: .03 });
      // 方格周期10px，黑点面积/周期面积近似对应标注覆盖率。
      for (var yy = 0; yy < 11; yy++) for (var xx = 0; xx < 8; xx++) {
        var dotRadius = Math.sqrt(t[2] * 100 / Math.PI);
        g.parts.push('<circle cx="' + (50 + i * 110 + xx * 10) + '" cy="' + (80 + yy * 10) + '" r="' + dotRadius.toFixed(2) + '" fill="#8fb8ff"/>');
      }
      g.text(85 + i * 110, 214, t[0], 'dg-sub', { anchor: 'middle' });
      g.text(85 + i * 110, 236, '密度', 'dg-sub', { anchor: 'middle' });
    });
    g.rect(510, 70, 200, 120, '#8fb8ff', { rx: 6, fo: .03 });
    g.text(610, 110, '角度 45° / 15°', 'dg-label', { anchor: 'middle' });
    g.text(610, 140, '两套网点叠色时', 'dg-sub', { anchor: 'middle' });
    g.text(610, 164, '叠加后检查摩尔纹', 'dg-sub', { anchor: 'middle' });
    g.text(380, 286, '赛璐璐插画也可用网点做质感，但不要盖住阴影形状。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-csp-3d', 'CSP 3D 人偶：辅助姿态与空间', '把 3D 人偶摆到目标角度，再用它检查透视与关节位置；描摹许可允许的模型也可用于分析，但仍需检查动作意图与形体。', 760, 320, function (g) {
    g.text(30, 34, 'CSP · 3D DRAWING FIGURE', 'dg-serif');
    // simple 3d doll
    g.parts.push('<circle cx="250" cy="100" r="24" fill="#8fb8ff" fill-opacity=".15" stroke="#8fb8ff" stroke-opacity=".5"/>');
    g.parts.push('<rect x="228" y="128" width="44" height="70" rx="12" fill="#8fb8ff" fill-opacity=".1" stroke="#8fb8ff" stroke-opacity=".4"/>');
    g.line(232, 145, 195, 200, '#8fb8ff', { op: .5, sw: 10 });
    g.line(268, 145, 305, 200, '#8fb8ff', { op: .5, sw: 10 });
    g.line(238, 198, 225, 260, '#8fb8ff', { op: .5, sw: 12 });
    g.line(262, 198, 278, 260, '#8fb8ff', { op: .5, sw: 12 });
    [[195, 200], [305, 200], [225, 260], [278, 260]].forEach(function (p) {
      g.parts.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#8fb8ff" fill-opacity=".3" stroke="#8fb8ff"/>');
    });
    g.text(370, 90, '① 先把人偶摆到与构图一致的角度', 'dg-label');
    g.text(370, 128, '② 调关节，检查肩/肘/膝的透视', 'dg-label');
    g.text(370, 166, '③ 提取功能按版本/许可核对', 'dg-label');
    g.text(370, 204, '④ 检查模型比例与人体表现', 'dg-label');
    g.text(370, 250, '适合：复杂透视、双人互动、手部参考', 'dg-sub');
  });

  /* ───────────── PS 后期 ───────────── */
  diag('d-ps-stack', 'PS 后期：合并之后再开一层', '绘画层保持不动，后期用调整图层：曲线、色相/饱和度、渐变映射、Camera Raw。', 820, 380, function (g) {
    g.text(30, 34, 'PHOTOSHOP · POST LAYER STACK', 'dg-serif');
    var ls = [
      { t: 'Camera Raw 滤镜', s: '整体质感 / 颗粒', c: '#ffd79a' },
      { t: '锐化 / 降噪', s: '输出前最后一步', c: '#ff8fc7' },
      { t: '渐变映射', s: '统一色调 / 氛围', c: '#c0a4ff' },
      { t: '曲线 / 色阶', s: '对比 / 黑白场', c: '#7fe9ff' },
      { t: '色相 / 饱和度', s: '局部颜色修正', c: '#8ef0cf' },
      { t: '合并图层 (Ctrl+Alt+Shift+E)', s: '保留原绘画层', c: '#9aa4c4' }
    ];
    ls.forEach(function (l, i) {
      var y = 60 + i * 46;
      g.rect(40, y, 460, 38, l.c, { rx: 8, fo: .07 });
      g.text(58, y + 24, l.t, 'dg-title');
      g.text(360, y + 24, l.s, 'dg-sub');
    });
    g.text(540, 94, '原则：永远保留可回溯的绘画层', 'dg-label');
    g.text(540, 132, '调整图层顺序：先校色，再调氛围', 'dg-label');
    g.text(540, 170, '渐变映射用“柔光/叠加”降 opacity', 'dg-label');
    g.text(540, 208, '锐化放在最后，避免反复压缩', 'dg-label');
    g.text(540, 260, '导出：sRGB / PNG 24 / 长边 2000', 'dg-sub');
    g.text(540, 284, '印刷：尺寸/出血/ICC按印厂确认', 'dg-sub');
  });

  diag('d-curves', '曲线：一端黑场，一端白场，中间是性格', 'S 曲线加对比，反 S 曲线变柔和；阴影端点抬高会“发灰”。', 760, 340, function (g) {
    g.text(30, 34, 'CURVES · 曲线', 'dg-serif');
    g.rect(60, 60, 220, 220, '#7fe9ff', { rx: 8, fo: .03 });
    g.line(60, 280, 280, 60, '#9aa4c4', { op: .2, dash: '3 4' });
    g.parts.push('<path d="M60 280 C110 260 150 210 180 160 C210 110 250 80 280 60" fill="none" stroke="#7fe9ff" stroke-width="3"/>');
    [[60, 280], [180, 160], [280, 60]].forEach(function (p) { g.parts.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#0a0d19" stroke="#7fe9ff" stroke-width="2"/>'); });
    g.text(170, 306, '输入 → 输出', 'dg-sub', { anchor: 'middle' });
    g.text(330, 100, 'S 曲线：加对比，暗更暗、亮更亮', 'dg-label');
    g.text(330, 140, '反 S：降对比，适合柔和/回忆', 'dg-label');
    g.text(330, 180, '端点抬高：黑场不黑，画面发灰', 'dg-label');
    g.text(330, 220, '单通道曲线：依通道增减颜色', 'dg-label');
    g.text(330, 268, '赛璐璐后期：轻微 S + 暗部加紫 + 高光加暖', 'dg-sub');
  });

  diag('d-gradmap', '渐变映射：一键统一色调', '把黑白灰映射到一条渐变上，快速统一氛围；混合模式、不透明度与渐变都会改变细节对比，需前后检查。', 760, 320, function (g) {
    g.text(30, 34, 'GRADIENT MAP · 渐变映射', 'dg-serif');
    g.parts.push('<defs><linearGradient id="dg-gm" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#1b1440"/><stop offset=".45" stop-color="#7a4ac4"/><stop offset=".75" stop-color="#ff8fc7"/><stop offset="1" stop-color="#ffd79a"/></linearGradient></defs>');
    g.rect(50, 90, 420, 40, '#fff', { rx: 6, fo: .04 });
    g.parts.push('<rect x="52" y="92" width="416" height="36" rx="5" fill="url(#dg-gm)"/>');
    g.text(50, 76, '暗部 → 中间调 → 高光', 'dg-sub');
    g.text(50, 170, '↓ 映射到画面', 'dg-label');
    g.rect(50, 190, 420, 90, '#7fe9ff', { rx: 8, fo: .03 });
    g.parts.push('<ellipse cx="170" cy="235" rx="55" ry="35" fill="#7a4ac4" opacity=".7"/>');
    g.parts.push('<ellipse cx="300" cy="235" rx="55" ry="35" fill="#ff8fc7" opacity=".55"/>');
    g.parts.push('<ellipse cx="390" cy="220" rx="30" ry="22" fill="#ffd79a" opacity=".5"/>');
    g.text(540, 100, '① 新建渐变映射调整层', 'dg-label');
    g.text(540, 138, '② 选 3~4 个停靠点，不要彩虹', 'dg-label');
    g.text(540, 176, '③ 混合模式改“柔光”或“叠加”', 'dg-label');
    g.text(540, 214, '④ 不透明度 20~45%', 'dg-label');
    g.text(540, 260, '作用：统一夜景/落日/回忆滤镜', 'dg-sub');
  });

  /* ───────────── Live2D ───────────── */
  diag('d-l2d-parts', 'Live2D 分层：画的时候就为绑定做准备', '前发、后发、脸、眼白、虹膜、睫毛、眉毛、嘴、身体必须分开；遮挡关系要画完整。', 820, 380, function (g) {
    g.text(30, 34, 'LIVE2D · PART SEPARATION', 'dg-serif');
    var parts = [
      { x: 40, t: '后发', c: '#a68fd6' },
      { x: 160, t: '脸', c: '#ffe4d9' },
      { x: 280, t: '眼白', c: '#fff8fc' },
      { x: 400, t: '虹膜', c: '#7a4ac4' },
      { x: 520, t: '睫毛', c: '#402c4c' },
      { x: 640, t: '前发', c: '#d9c9f6' }
    ];
    parts.forEach(function (p, i) {
      g.rect(p.x, 70, 110, 160, p.c, { rx: 10, fo: .08 });
      g.text(p.x + 55, 258, p.t, 'dg-title', { anchor: 'middle' });
      g.text(p.x + 55, 278, '0' + (i + 1), 'dg-serif', { anchor: 'middle', fill: p.c });
    });
    g.text(410, 330, '每层都要画“被挡住的部分”，否则一动就穿帮；眼白与虹膜分开，才能做视线。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 356, '命名：角色_部位_左右_版本（Mika_eyeL_iris_v02）', 'dg-mono', { anchor: 'middle' });
  });

  diag('d-l2d-mesh', '网格与变形器：让平面“弯”起来', '先用自动网格，再手动加密眼角/嘴角；变形器按“大块→小块”分层，别一个网格拉全身。', 760, 360, function (g) {
    g.text(30, 34, 'LIVE2D · MESH & DEFORMER', 'dg-serif');
    g.rect(50, 60, 300, 250, '#5fe0d0', { rx: 12, fo: .03 });
    g.parts.push('<ellipse cx="200" cy="180" rx="90" ry="105" fill="#ffe4d9" fill-opacity=".1" stroke="#5fe0d0" stroke-opacity=".4"/>');
    for (var i = 1; i < 5; i++) {
      g.line(200 - 90 + i * 36, 85, 200 - 90 + i * 36, 275, '#5fe0d0', { op: .22 });
      g.line(115, 180 - 105 + i * 42, 285, 180 - 105 + i * 42, '#5fe0d0', { op: .22 });
    }
    g.text(200, 332, '原始网格', 'dg-sub', { anchor: 'middle' });
    g.rect(410, 60, 300, 250, '#5fe0d0', { rx: 12, fo: .03 });
    g.parts.push('<path d="M470 190 C470 110 530 75 610 90 C680 105 705 160 690 225 C675 285 610 310 550 290 C495 272 470 240 470 190 Z" fill="#ffe4d9" fill-opacity=".1" stroke="#5fe0d0" stroke-opacity=".5"/>');
    g.line(560, 90, 560, 300, '#5fe0d0', { op: .3 });
    g.line(470, 190, 690, 190, '#5fe0d0', { op: .3 });
    g.text(560, 332, '变形后（头部旋转）', 'dg-sub', { anchor: 'middle' });
    g.arrow(360, 190, 400, 190, { c: '#5fe0d0' });
  });

  diag('d-l2d-params', '参数：一个滑块，一条表情', '角度 X/Y/Z、眼睛开合、嘴形、呼吸、身体旋转。参数不是越多越好，要能组合。', 820, 340, function (g) {
    g.text(30, 34, 'LIVE2D · PARAMETERS', 'dg-serif');
    var ps = [
      { t: 'ParamAngleX', s: '头部左右 -30 ~ 30', c: '#ff8fc7' },
      { t: 'ParamAngleY', s: '头部上下 -30 ~ 30', c: '#c0a4ff' },
      { t: 'ParamAngleZ', s: '头部倾斜 -30 ~ 30', c: '#7fe9ff' },
      { t: 'ParamEyeLOpen', s: '左眼开合 0 ~ 1', c: '#8ef0cf' },
      { t: 'ParamMouthOpenY', s: '嘴张开 0 ~ 1', c: '#ffd79a' },
      { t: 'ParamBreath', s: '呼吸 0 ~ 1', c: '#5fe0d0' }
    ];
    ps.forEach(function (p, i) {
      var y = 66 + i * 40;
      g.rect(40, y, 420, 30, p.c, { rx: 7, fo: .05 });
      g.text(56, y + 20, p.t, 'dg-mono', { fill: p.c });
      g.text(250, y + 20, p.s, 'dg-sub');
      g.parts.push('<rect x="470" y="' + (y + 12) + '" width="220" height="5" rx="2.5" fill="#fff" fill-opacity=".1"/>');
      g.parts.push('<rect x="470" y="' + (y + 12) + '" width="' + (70 + i * 26) + '" height="5" rx="2.5" fill="' + p.c + '"/>');
      g.parts.push('<circle cx="' + (470 + 70 + i * 26) + '" cy="' + (y + 14.5) + '" r="6" fill="#fff" stroke="' + p.c + '" stroke-width="2"/>');
    });
    g.text(410, 322, '先做“中性脸”，再为每个参数建 2~3 个关键形态；不要一开始就拉满。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-l2d-physics', '物理演算：头发不是“飘”，是“滞后”', '把头发做成链式摆锤：根节点跟随头部，末端有惯性。输入角度、输出延迟与振幅。', 760, 340, function (g) {
    g.text(30, 34, 'LIVE2D · PHYSICS', 'dg-serif');
    g.parts.push('<circle cx="180" cy="90" r="22" fill="#ffe4d9" fill-opacity=".12" stroke="#5fe0d0" stroke-opacity=".5"/>');
    g.parts.push('<path d="M160 70 C130 140 120 220 140 290" fill="none" stroke="#d9c9f6" stroke-width="22" stroke-linecap="round" opacity=".35"/>');
    g.parts.push('<path d="M200 70 C225 140 235 220 215 290" fill="none" stroke="#d9c9f6" stroke-width="18" stroke-linecap="round" opacity=".25"/>');
    g.parts.push('<path d="M160 70 C130 140 120 220 140 290" fill="none" stroke="#5fe0d0" stroke-width="1.5" stroke-dasharray="4 5" opacity=".8"/>');
    [[160, 70], [140, 160], [135, 225], [140, 290]].forEach(function (p, i) {
      g.parts.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#0a0d19" stroke="#5fe0d0" stroke-width="2"/>');
    });
    g.text(330, 90, '① 输入：头部角度 / 身体旋转', 'dg-label');
    g.text(330, 128, '② 输出：头发摆动角度', 'dg-label');
    g.text(330, 166, '③ 延迟：越靠末端越慢', 'dg-label');
    g.text(330, 204, '④ 振幅：发梢最大，发根最小', 'dg-label');
    g.text(330, 242, '⑤ 阻尼：避免一直晃', 'dg-label');
    g.text(330, 292, '参数：角度 8~15°，延迟 0.6~1.2s，阻尼 0.7~0.9。', 'dg-sub');
  });

  /* ───────────── 接稿 ───────────── */
  diag('d-commission-flow', '接稿流程：每一步都要留痕', '应征 → 需求确认 → 草图 → 线稿 → 上色 → 成稿 → 交付。每一步确认后再进下一步。', 900, 220, function (g) {
    g.text(30, 34, 'COMMISSION FLOW · 7 STEPS', 'dg-serif');
    var steps = ['应征/报价', '需求确认', '草图', '线稿', '上色', '修改', '交付'];
    steps.forEach(function (s, i) {
      var x = 30 + i * 122;
      g.parts.push('<circle cx="' + (x + 50) + '" cy="112" r="26" fill="#ffb86b" fill-opacity=".08" stroke="#ffb86b" stroke-opacity=".45"/>');
      g.text(x + 50, 117, String(i + 1), 'dg-title', { anchor: 'middle' });
      g.text(x + 50, 164, s, 'dg-title', { anchor: 'middle' });
      if (i < 6) g.arrow(x + 78, 112, x + 120, 112, { c: '#ffb86b', op: .45 });
    });
    g.text(450, 200, '关键：需求文档 + 修改轮次 + 交付规格写进订单；口头承诺不算数。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-pricing', '报价：不是“我觉得值多少”', '基础价 × 复杂度 × 商用系数 + 加急 + 额外修改。先算成本，再谈市场。', 820, 340, function (g) {
    g.text(30, 34, 'PRICING MODEL · 报价构成', 'dg-serif');
    var rows = [
      { t: '基础价', s: '按类型：头像 / 半身 / 立绘', v: '¥300~800', c: '#ffb86b' },
      { t: '复杂度', s: '道具 / 背景 / 多人 / 特效', v: '×1.2~2.5', c: '#ff8fc7' },
      { t: '商用系数', s: '个人 / 商用 / 买断', v: '×1 / ×2~3 / ×5~8', c: '#c0a4ff' },
      { t: '加急', s: '压缩工期', v: '+30~100%', c: '#7fe9ff' },
      { t: '额外修改', s: '超出约定轮次', v: '按次/按小时', c: '#8ef0cf' }
    ];
    rows.forEach(function (r, i) {
      var y = 64 + i * 46;
      g.rect(40, y, 520, 38, r.c, { rx: 8, fo: .06 });
      g.text(58, y + 24, r.t, 'dg-title');
      g.text(180, y + 24, r.s, 'dg-sub');
      g.text(540, y + 24, r.v, 'dg-mono', { anchor: 'end', fill: r.c });
    });
    g.box(600, 64, 190, 90, { c: '#ffb86b', t: '先算时薪', sub: '画 10h × 时薪 60 = 600' });
    g.box(600, 168, 190, 90, { c: '#ff8fc7', t: '再看市场', sub: '同类型 3~5 个样本' });
    g.text(30, 310, '报价不要说“随便给”；给三档：基础 / 推荐 / 豪华，让甲方做选择题。', 'dg-sub');
  });

  diag('d-rights', '版权：你卖的是“使用权”，不是“孩子”', '署名权、商用权、买断、二创授权是四件事，分开报价。合同写不清，后面全是纠纷。', 820, 340, function (g) {
    g.text(30, 34, 'RIGHTS BUNDLE · 版权打包', 'dg-serif');
    var items = [
      { t: '署名权', s: '作者身份，通常不可转让', c: '#7fe9ff' },
      { t: '商用权', s: '用于产品/宣传，按范围定价', c: '#ffb86b' },
      { t: '买断', s: '明确独占许可或权利转让', c: '#ff8fc7' },
      { t: '二创授权', s: '允许甲方二次修改/衍生物', c: '#c0a4ff' }
    ];
    items.forEach(function (it, i) {
      var x = 40 + i * 190;
      g.rect(x, 70, 170, 140, it.c, { rx: 12 });
      g.text(x + 85, 108, it.t, 'dg-title', { anchor: 'middle' });
      g.text(x + 85, 140, it.s, 'dg-sub', { anchor: 'middle' });
      g.text(x + 85, 184, ['不可转让', '按范围', '独占', '可选'][i], 'dg-mono', { anchor: 'middle', fill: it.c });
    });
    g.text(40, 250, '常见坑：只写“商用”没写范围；买断没写“是否可二创”；修改轮次没写上限。', 'dg-label');
    g.text(40, 282, '建议：订单里写清「用途 / 媒介 / 期限 / 地域 / 是否独占 / 修改次数 / 交付格式」。', 'dg-sub');
    g.text(40, 314, 'R18 商稿额外确认：平台政策、年龄设定、发布渠道、是否可打码。', 'dg-sub');
  });

  diag('d-review', 'R18 审稿：四个象限，先看红线', '审稿不是“好不好看”，而是先判断合法性、同意、年龄与平台合规，再谈画面质量。', 820, 380, function (g) {
    g.text(30, 34, 'ADULT CONTENT REVIEW · 四象限', 'dg-serif');
    var qs = [
      { x: 40, y: 64, t: '① 拒稿与法律核对', s: '未成年 / 非自愿 / 真实人物', c: '#ff9a9a', items: ['年龄设定必须成年', '拒绝未成年表征', '拒绝非自愿与胁迫'] },
      { x: 420, y: 64, t: '② 平台规则', s: '发布渠道 / 打码 / 年龄门', c: '#ffb86b', items: ['米画师/画加禁 R18', 'Pixiv/Fanbox 分区', '平台差异要核对'] },
      { x: 40, y: 222, t: '③ 同意伦理', s: '虚构中的权力关系', c: '#c0a4ff', items: ['双方成年且自愿', '避免美化伤害', '标注内容警告'] },
      { x: 420, y: 222, t: '④ 画面质量', s: '人体 / 构图 / 遮挡', c: '#7fe9ff', items: ['结构不崩', '遮挡有设计', '不靠露骨撑画面'] }
    ];
    qs.forEach(function (q) {
      g.rect(q.x, q.y, 360, 140, q.c, { rx: 12 });
      g.text(q.x + 18, q.y + 28, q.t, 'dg-title', { fill: q.c });
      g.text(q.x + 18, q.y + 48, q.s, 'dg-sub');
      q.items.forEach(function (it, i) {
        g.text(q.x + 18, q.y + 78 + i * 20, '· ' + it, 'dg-label');
      });
    });
    g.text(410, 374, '顺序：先排除红线，再看平台，最后才是“画得好不好”。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-age', '年龄疑义：暂停制作，守住边界', '年龄文字不能消除外观与情境中的疑义。涉及未成年性化请求直接拒绝，不靠修改比例绕过边界。', 760, 320, function (g) {
    g.text(30, 34, 'BOUNDARIES · 有疑义先暂停', 'dg-serif');
    var cols = [
      { x: 40, t: '先停止', s: '不继续制作或传播', c: '#ff9a9a' },
      { x: 280, t: '明确拒绝', s: '不靠外观修改过审', c: '#ffb86b' },
      { x: 520, t: '安全练习', s: '仅用日常非性化案例', c: '#c0a4ff' }
    ];
    cols.forEach(function (c) {
      g.rect(c.x, 64, 200, 150, c.c, { rx: 12 });
      g.text(c.x + 100, 100, c.t, 'dg-title', { anchor: 'middle' });
      g.text(c.x + 100, 132, c.s, 'dg-sub', { anchor: 'middle' });
      g.text(c.x + 100, 176, '✓', 'dg-title', { anchor: 'middle', fill: c.c, size: 22 });
    });
    g.text(40, 252, '年龄文字、外观与情境有疑义时，不把修改脸型或比例当作解决办法。', 'dg-label');
    g.text(40, 284, '处理：暂停 → 拒稿与平台流程 → 如需日常肖像，重新确认独立需求。', 'dg-sub');
  });

  /* ───────────── 迷思 ───────────── */
  diag('d-book', '书怎么用：一本工具书配一个练习', '买书不是收藏。按当前问题试读、跟做、换题应用；次数不是掌握标准。', 820, 320, function (g) {
    g.text(30, 34, 'BOOKS · 按问题选资源', 'dg-serif');
    var bs = [
      { t: '结构 / 人体', s: '试读简化形体示范', c: '#7fe9ff', out: '检查：能解释体块朝向' },
      { t: '色彩 / 光', s: '色彩与光线、配色手册', c: '#ffd79a', out: '检查：能解释光色关系' },
      { t: '画集 / 风格', s: '喜欢的画师画集', c: '#ff8fc7', out: '检查：能说明视觉选择' }
    ];
    bs.forEach(function (b, i) {
      var x = 40 + i * 250;
      g.rect(x, 64, 220, 150, b.c, { rx: 12 });
      g.text(x + 110, 100, b.t, 'dg-title', { anchor: 'middle' });
      g.text(x + 110, 130, b.s, 'dg-sub', { anchor: 'middle' });
      g.text(x + 110, 176, b.out, 'dg-label', { anchor: 'middle' });
    });
    g.text(40, 250, '不必先买书；现有资源能解决问题，就先用它。', 'dg-label');
    g.text(40, 282, '合法借阅、公开教程可免费；二手与电子书不一定免费。', 'dg-sub');
  });

  diag('d-sketch', '素描与二次元：不是二选一', '素描练“观察与概括”，二次元练“符号与设计”。观察与设计可交替练，不要求人人先完成同一种传统素描课程。', 760, 340, function (g) {
    g.text(30, 34, 'SKETCH vs ANIME · 能力重叠', 'dg-serif');
    g.parts.push('<circle cx="250" cy="180" r="105" fill="#7fe9ff" fill-opacity=".08" stroke="#7fe9ff" stroke-opacity=".4"/>');
    g.parts.push('<circle cx="430" cy="180" r="105" fill="#ff8fc7" fill-opacity=".08" stroke="#ff8fc7" stroke-opacity=".4"/>');
    g.text(190, 170, '素描', 'dg-title', { anchor: 'middle', fill: '#7fe9ff' });
    g.text(190, 194, '观察 / 结构 / 光影', 'dg-sub', { anchor: 'middle' });
    g.text(490, 170, '二次元', 'dg-title', { anchor: 'middle', fill: '#ff8fc7' });
    g.text(490, 194, '符号 / 夸张 / 设计', 'dg-sub', { anchor: 'middle' });
    g.text(340, 176, '造型', 'dg-title', { anchor: 'middle', fill: '#ffd79a' });
    g.text(340, 198, '概括', 'dg-title', { anchor: 'middle', fill: '#ffd79a' });
    g.text(380, 312, '安排示例：目标作品与一次基础纠错交替；频率按时间和恢复调整。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-30day', '30 天冲刺：四週，一个可交付的循环', '第 1 週线条与头部，第 2 週人体与动态，第 3 週赛璐璐完整图，第 4 週复盘与作品集。', 900, 300, function (g) {
    g.text(30, 34, '30-DAY SPRINT · 四週', 'dg-serif');
    var ws = [
      { t: '第 1 週', s: '线条 + 头部', d: '每天 30 分钟排线 / 10 个头', c: '#7fe9ff' },
      { t: '第 2 週', s: '人体 + 动态', d: '每天 10 个速写 / 2 张动态', c: '#ffd79a' },
      { t: '第 3 週', s: '赛璐璐完整图', d: '1 张从草稿到后期', c: '#ff8fc7' },
      { t: '第 4 週', s: '复盘 + 作品集', d: '重画第 1 张 / 排版 3 张', c: '#c6f27e' }
    ];
    ws.forEach(function (w, i) {
      var x = 40 + i * 215;
      g.rect(x, 64, 190, 170, w.c, { rx: 12 });
      g.text(x + 95, 100, w.t, 'dg-title', { anchor: 'middle', fill: w.c });
      g.text(x + 95, 132, w.s, 'dg-title', { anchor: 'middle' });
      g.text(x + 95, 164, w.d, 'dg-sub', { anchor: 'middle' });
      g.text(x + 95, 206, '0' + (i + 1), 'dg-serif', { anchor: 'middle', fill: w.c });
      if (i < 3) g.arrow(x + 194, 150, x + 212, 150, { c: w.c, op: .5 });
    });
    g.text(450, 272, '时间与任务可调整；30天是复盘窗口，不是学会或接稿期限。', 'dg-sub', { anchor: 'middle' });
  });

  diag('d-feedback', '反馈闭环：画完不是结束', '画 → 对比 → 找错 → 改一张 → 再画。数量不等于掌握；用对比和修正检查重复练习是否有效。', 760, 320, function (g) {
    g.text(30, 34, 'FEEDBACK LOOP · 闭环', 'dg-serif');
    var steps = [
      { x: 60, y: 90, t: '画', c: '#ff8fc7' },
      { x: 260, y: 90, t: '对比', c: '#ffd79a' },
      { x: 460, y: 90, t: '找错', c: '#7fe9ff' },
      { x: 460, y: 210, t: '改', c: '#c6f27e' },
      { x: 260, y: 210, t: '再画', c: '#c0a4ff' }
    ];
    steps.forEach(function (s) {
      g.parts.push('<circle cx="' + (s.x + 40) + '" cy="' + (s.y + 30) + '" r="34" fill="' + s.c + '" fill-opacity=".08" stroke="' + s.c + '" stroke-opacity=".45"/>');
      g.text(s.x + 40, s.y + 36, s.t, 'dg-title', { anchor: 'middle', fill: s.c });
    });
    g.arrow(100, 90, 260, 90, { c: '#ff8fc7', op: .4 });
    g.arrow(300, 90, 460, 90, { c: '#ffd79a', op: .4 });
    g.arrow(500, 120, 500, 210, { c: '#7fe9ff', op: .4 });
    g.arrow(460, 240, 300, 240, { c: '#c6f27e', op: .4 });
    g.arrow(260, 240, 140, 130, { c: '#c0a4ff', op: .35 });
    g.text(580, 110, '对比：同一角度/同一光', 'dg-sub');
    g.text(580, 140, '找错：只挑 3 个最大问题', 'dg-sub');
    g.text(580, 170, '改：在原图上改，不重画', 'dg-sub');
    g.text(580, 200, '再画：下一张只改一个点', 'dg-sub');
  });


  /* ───────────── 版权边界 ───────────── */
  diag('d-trace', '描图 / 临摹 / 参考动作：三件事', '这三项描述制作方法；合法性另看具体表达、许可、用途与规则。网格辅助不自动等于描图，标注来源不代替授权。', 820, 360, function (g) {
    g.text(30, 34, 'TRACE vs COPY vs POSE REFERENCE', 'dg-serif');
    var panels = [
      { x: 30, c: '#ff9a9a', t: '描图 TRACE', lines: ['沿底图或投影描轮廓', '自有/许可资料也可使用', '复制的是线条与轮廓'], mark: '方法：描摹' },
      { x: 290, c: '#ffd79a', t: '临摹 COPY', lines: ['看着原图，自由手绘', '复制的是具体表达', '发布前另查许可与规则'], mark: '核对：资料权利' },
      { x: 550, c: '#7fe9ff', t: '参考动作 POSE REF', lines: ['只取动作逻辑', '自己重建体块 / 构图', '服装 / 光影 / 背景自定'], mark: '仍需：来源核对' }
    ];
    panels.forEach(function (p, i) {
      g.rect(p.x, 60, 240, 230, p.c, { rx: 14 });
      g.text(p.x + 120, 92, p.t, 'dg-title', { anchor: 'middle', fill: p.c });
      if (i === 0) {
        g.parts.push('<path d="M' + (p.x + 40) + ' 140 C' + (p.x + 80) + ' 110 ' + (p.x + 120) + ' 180 ' + (p.x + 170) + ' 135" fill="none" stroke="' + p.c + '" stroke-width="3" opacity=".8"/>');
        g.parts.push('<path d="M' + (p.x + 40) + ' 152 C' + (p.x + 80) + ' 122 ' + (p.x + 120) + ' 192 ' + (p.x + 170) + ' 147" fill="none" stroke="' + p.c + '" stroke-width="1.5" stroke-dasharray="3 4" opacity=".5"/>');
      } else if (i === 1) {
        g.parts.push('<rect x="' + (p.x + 70) + '" y="115" width="100" height="60" rx="4" fill="' + p.c + '" fill-opacity=".1" stroke="' + p.c + '" stroke-opacity=".4"/>');
        g.parts.push('<path d="M' + (p.x + 90) + ' 145 C' + (p.x + 100) + ' 130 ' + (p.x + 120) + ' 130 ' + (p.x + 128) + ' 145 C' + (p.x + 120) + ' 160 ' + (p.x + 100) + ' 160 ' + (p.x + 90) + ' 145 Z" fill="none" stroke="' + p.c + '" stroke-width="2"/>');
        g.parts.push('<circle cx="' + (p.x + 109) + '" cy="145" r="5" fill="' + p.c + '" fill-opacity=".5"/>');
      } else {
        g.parts.push('<circle cx="' + (p.x + 120) + '" cy="125" r="16" fill="' + p.c + '" fill-opacity=".2" stroke="' + p.c + '" stroke-opacity=".5"/>');
        g.parts.push('<line x1="' + (p.x + 120) + '" y1="141" x2="' + (p.x + 120) + '" y2="180" stroke="' + p.c + '" stroke-opacity=".5" stroke-width="8" stroke-linecap="round"/>');
        g.parts.push('<line x1="' + (p.x + 100) + '" y1="150" x2="' + (p.x + 140) + '" y2="150" stroke="' + p.c + '" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>');
        g.parts.push('<line x1="' + (p.x + 120) + '" y1="180" x2="' + (p.x + 105) + '" y2="210" stroke="' + p.c + '" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>');
        g.parts.push('<line x1="' + (p.x + 120) + '" y1="180" x2="' + (p.x + 135) + '" y2="210" stroke="' + p.c + '" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>');
      }
      p.lines.forEach(function (l, j) {
        g.text(p.x + 28, 212 + j * 20, '· ' + l, 'dg-label');
      });
      g.text(p.x + 120, 275, p.mark, 'dg-title', { anchor: 'middle', fill: p.c });
    });
    g.text(410, 324, '判断需结合受保护表达、许可、使用方式与适用法律。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 346, '普通姿态、具体照片与连续编排须分开看；换姿势或混合多图不是权利豁免。', 'dg-sub', { anchor: 'middle' });
  });

  /* ───────────── 互联网安全 ───────────── */
  diag('d-scam-flow', '画师骗局的六个阶段', '骗局不是“你太笨”，而是一条被设计过的流程：接触、建立信任、制造紧迫、转私下、假付款/任务、损失。在任何一个阶段停下来，都能止损。', 820, 320, function (g) {
    g.text(30, 34, 'SCAM FLOW · 六阶段', 'dg-serif');
    var steps = [
      ['01', '接触', '私信/评论/假平台'],
      ['02', '信任', '夸作品/高预算/秒回'],
      ['03', '紧迫', '今天必须/名额有限'],
      ['04', '转私下', '加微信/QQ/Telegram'],
      ['05', '假付款', '扫码/APP/做任务'],
      ['06', '损失', '垫付/信息/账号']
    ];
    steps.forEach(function (s, i) {
      var x = 30 + i * 128;
      g.rect(x, 70, 112, 110, i < 4 ? '#ff8a5c' : '#ff5f6d', { rx: 12 });
      g.text(x + 10, 92, s[0], 'dg-serif', { fill: i < 4 ? '#ff8a5c' : '#ff5f6d' });
      g.text(x + 56, 122, s[1], 'dg-title', { anchor: 'middle' });
      g.text(x + 56, 150, s[2], 'dg-sub', { anchor: 'middle' });
      if (i < 5) g.arrow(x + 114, 125, x + 124, 125, { c: '#ff8a5c', op: .5 });
    });
    g.text(410, 220, '在任何一步停下来：不扫码、不下载、不垫付、不转私下。', 'dg-label', { anchor: 'middle' });
    g.text(410, 252, '骗局利用的是“想接单/怕错过/信任对方”，不是你的智商。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 286, '越急越可疑；越要求离开平台越可疑；越要你先付钱越可疑。', 'dg-label', { anchor: 'middle', fill: '#ff8a5c' });
    return {
      kicker: '六个阶段 · 按编号顺序阅读',
      steps: steps.map(function (s, i) { return { title: s[1], body: [s[2]], color: i < 4 ? '#ffad88' : '#ff9ca9' }; }),
      notes: ['遇到陌生付款码、未知程序、垫付或绕过平台担保的要求，先暂停并独立核实。', '骗局利用信任和紧迫感，不应把受骗归咎于智商；越催促，越需要停下来核对。']
    };
  });

  diag('d-payment-redflags', '正常付款 vs 高危骗局', '正常接稿：平台下单 → 预付款 → 阶段确认 → 尾款 → 交付。骗局：高薪私信 → 转私下 → 扫码/下载 → 做任务/垫付 → 假截图/失联。', 820, 370, function (g) {
    g.text(30, 34, 'PAYMENT FLOW · 对比', 'dg-serif');
    // safe
    g.rect(30, 60, 370, 260, '#8ef0cf', { rx: 14 });
    g.text(215, 92, '正常接稿付款', 'dg-title', { anchor: 'middle', fill: '#8ef0cf' });
    var safe = ['平台内下单/担保', '预付款比例另行约定', '草图/线稿/上色分阶段确认', '尾款到账再发高清/源文件', '保留订单/聊天/版本记录'];
    safe.forEach(function (t, i) {
      g.parts.push('<circle cx="60" cy="' + (126 + i * 34) + '" r="4" fill="#8ef0cf"/>');
      g.text(76, 130 + i * 34, t, 'dg-label');
    });
    g.text(215, 300, '✓ 平台担保 + 分期 + 留痕', 'dg-label', { anchor: 'middle', fill: '#8ef0cf' });
    // scam
    g.rect(430, 60, 360, 260, '#ff5f6d', { rx: 14 });
    g.text(610, 92, '高危骗局', 'dg-title', { anchor: 'middle', fill: '#ff5f6d' });
    var bad = ['私信“高预算/秒付款”', '要求加微信/QQ/Telegram', '扫码/下载 APP/做任务', '先垫付/充值/解冻/保证金', '假付款截图 → 失联/勒索'];
    bad.forEach(function (t, i) {
      g.parts.push('<circle cx="460" cy="' + (126 + i * 34) + '" r="4" fill="#ff5f6d"/>');
      g.text(476, 130 + i * 34, t, 'dg-label');
    });
    g.text(610, 300, '✗ 离开平台 = 失去担保', 'dg-label', { anchor: 'middle', fill: '#ff5f6d' });
    g.text(410, 348, '记住：正规甲方不会要求你先付钱、扫码、下载未知 APP 才能给你稿费。', 'dg-sub', { anchor: 'middle' });
    return {
      kicker: '两种付款流程 · 对照核查',
      steps: [{ title: '正常接稿付款', body: safe, color: '#9be1cb' }, { title: '高危骗局信号', body: bad, color: '#ff9ca9' }],
      notes: ['通过自己已知的官方入口核对到账；付款截图不能代替到账记录。要求先充值、交解冻费或安装未知程序才能收款时，先停止操作。']
    };
  });

  diag('d-scam-chain', '电信诈骗园区：招募、话术与洗钱', '园区诈骗是一条犯罪产业链：虚假高薪招募 → 收护照/限制人身 → 话术培训 → 聊单/投资/博彩 → 跑分洗钱。很多“员工”本身也是受害者。', 820, 350, function (g) {
    g.text(30, 34, 'SCAM COMPOUND · 产业链', 'dg-serif');
    var items = [
      ['招募', '高薪/包机票/无要求', '#ff5f6d'],
      ['控制', '收护照/限制自由', '#ff8a5c'],
      ['培训', '话术/剧本/养号', '#ffd79a'],
      ['聊单', '投资/博彩/恋爱', '#c0a4ff'],
      ['洗钱', '跑分/虚拟币/水房', '#7fe9ff']
    ];
    items.forEach(function (it, i) {
      var x = 30 + i * 155;
      g.rect(x, 70, 140, 110, it[2], { rx: 12 });
      g.text(x + 70, 104, it[0], 'dg-title', { anchor: 'middle' });
      g.text(x + 70, 134, it[1], 'dg-sub', { anchor: 'middle' });
      if (i < 4) g.arrow(x + 142, 125, x + 152, 125, { c: it[2], op: .5 });
    });
    g.text(410, 220, '“高薪客服/打字/翻译/包机票”是常见招募话术。', 'dg-label', { anchor: 'middle' });
    g.text(410, 250, '护照被收或人身受控时，不要冒险对抗，应通过安全渠道求助。', 'dg-label', { anchor: 'middle', fill: '#ff9ca9' });
    g.text(410, 282, '不要用自己的银行账户/手机号/身份证帮任何人收款——那是“跑分”，可能构成犯罪。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 314, '如果你或朋友已经被困：优先联系家人、使领馆、当地警方与可信的公益组织，不要冒险自行对抗。', 'dg-sub', { anchor: 'middle' });
    return {
      kicker: '产业链示意 · 按编号顺序阅读',
      steps: items.map(function (it) { return { title: it[0], body: [it[1]], color: it[2] }; }),
      notes: [
        '“高薪客服、打字、翻译、包机票”可能被用于虚假招募；优先核验雇主与工作安排。',
        '不要出借银行账户、手机号或身份证帮助陌生人收转资金，可能涉及违法犯罪。',
        '已被限制人身自由时，以安全为先，通过安全渠道联系警方、使领馆、家人或可信救助组织，不要冒险自行对抗。'
      ]
    };
  });

  diag('d-cyberbullying', '被网暴后的 24 小时 / 7 天 / 30 天', '先保命，再保号，再保证据，最后才是解释。不要对骂、不要付费删帖、不要删除证据。', 820, 350, function (g) {
    g.text(30, 34, 'CYBERBULLYING · 行动表', 'dg-serif');
    var cols = [
      { x: 30, c: '#ff5f6d', t: '0~24 小时', items: ['停止回应/对骂', '截图/录屏/保存 URL', '锁评论/隐私/私信', '告诉一个信任的人', '有现实威胁 → 报警'] },
      { x: 290, c: '#ffd79a', t: '24~72 小时', items: ['平台举报/拉黑', '整理证据时间线', '涉及造谣/威胁 → 咨询律师', '必要时发一条简短声明', '不要付费删帖'] },
      { x: 550, c: '#7fe9ff', t: '7~30 天', items: ['清理个人信息', '开启 2FA/改密码', '心理支持/休息', '考虑暂时停更', '跟进平台/法律处理'] }
    ];
    cols.forEach(function (c) {
      g.rect(c.x, 60, 240, 230, c.c, { rx: 14 });
      g.text(c.x + 120, 92, c.t, 'dg-title', { anchor: 'middle', fill: c.c });
      c.items.forEach(function (t, i) {
        g.text(c.x + 20, 128 + i * 27, '· ' + t, 'dg-label');
      });
    });
    g.text(410, 316, '紧急：生命受到威胁/被勒索/被散布私密影像 → 立即报警，并告知家人/朋友，不要独自处理。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 340, '中国大陆可拨打 110；网络违法与不良信息举报 12377；心理援助热线以当地开通为准。', 'dg-sub', { anchor: 'middle' });
    return {
      kicker: '行动参考 · 紧急情况立即求助，不必等待时间节点',
      steps: cols.map(function (c) { return { title: c.t, body: c.items, color: c.c }; }),
      notes: ['有现实人身威胁、勒索或私密影像被散布时，及时报警并联系可信的人。中国大陆紧急报警可拨110；其他地区按当地渠道求助。']
    };
  });

  diag('d-platform-compare', 'X / Pixiv / Telegram：谁更适合常驻', 'Pixiv 当作品档案，X 当发现窗口，Telegram 只当辅助社群。不要把 Telegram 当接稿主战场。', 820, 390, function (g) {
    g.text(30, 34, 'PLATFORM FIT · 平台定位', 'dg-serif');
    var cols = [
      { x: 30, c: '#c0a4ff', t: 'X / Twitter', fit: '发现/曝光/海外触达', risk: '网暴/隐私/冒充', use: '作品+过程，锁私信，少暴露现实信息' },
      { x: 290, c: '#7fe9ff', t: 'Pixiv', fit: '作品档案/同好/约稿', risk: '语言/分区/年龄门', use: '主档案，R18 分区，FANBOX/BOOTH 变现' },
      { x: 550, c: '#8ef0cf', t: 'Telegram', fit: '私域社群/通知', risk: '诈骗/盗版/非法内容', use: '只做辅助，不进陌生群，不点陌生文件' }
    ];
    cols.forEach(function (c) {
      g.rect(c.x, 60, 240, 270, c.c, { rx: 14 });
      g.text(c.x + 120, 92, c.t, 'dg-title', { anchor: 'middle', fill: c.c });
      g.text(c.x + 20, 126, '适合：' + c.fit, 'dg-label');
      g.text(c.x + 20, 158, '风险：' + c.risk, 'dg-label');
      g.text(c.x + 20, 190, '建议：', 'dg-label');
      // wrap use text manually
      var use = c.use;
      var lines = use.length > 18 ? [use.slice(0, 18), use.slice(18)] : [use];
      lines.forEach(function (l, i) { g.text(c.x + 20, 214 + i * 20, l, 'dg-sub'); });
    });
    g.text(410, 360, '常驻组合：Pixiv 存档 + X 曝光 + Telegram 辅助；收款/约稿走平台担保。', 'dg-sub', { anchor: 'middle' });
    g.text(410, 382, '境外平台还要注意：年龄门、内容分级、税务、跨境法律与平台封禁风险。', 'dg-sub', { anchor: 'middle' });
    return {
      kicker: '平台定位 · 按自己的用途选择',
      steps: cols.map(function (c) { return { title: c.t, body: ['适合：' + c.fit, '风险：' + c.risk, '建议：' + c.use], color: c.c }; }),
      notes: ['发布、收款与约稿前，分别核对内容许可、年龄与分级、税务和当地法律。任何平台都不能单靠名字保证安全。']
    };
  });
})();
