/* ═══════════════════════════════════════════════════════════════
   FIGURES · 例图（基于 ART 渲染器）
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.FIGURES = window.FIGURES || {};

  function pbox(opts, x, y, w, h, crop) {
    var s = ART.portrait(opts);
    if (crop) s = s.replace('viewBox="0 0 520 680"', 'viewBox="118 108 304 320"');
    return s.replace('<svg ', '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" ');
  }
  function wrap(w, h, inner, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" class="dg">' +
      '<rect width="' + w + '" height="' + h + '" fill="#0a0d19"/>' + inner +
      (label ? '<text x="' + (w / 2) + '" y="' + (h - 10) + '" text-anchor="middle" fill="#6c7695" font-size="9" letter-spacing=".16em" font-family="Georgia,serif">' + label + '</text>' : '') +
      '</svg>';
  }
  function single(id, title, caption, opts, label) {
    window.FIGURES[id] = {
      title: title, caption: caption,
      svg: function () { return wrap(420, 540, pbox(opts, 20, 10, 380, 497, opts.crop), label); }
    };
  }

  single('fig-line', '线稿 · Lineart', '线稿阶段只看两件事：形体准不准、线条有没有穿插与粗细节奏。', { mode: 'line', deco: false }, 'LINEART · 520 × 680');
  single('fig-flat', '平涂 · Flat', '只有固有色，没有阴影。用来检查配色分区与整体是否“灰”。', { mode: 'flat', deco: false }, 'FLAT COLOR');
  single('fig-cel', '赛璐璐 · Cel', '底色 + 一阴 + 二阴 + 高光 + 边缘光。边缘清楚，形状可读。', { mode: 'cel', deco: false }, 'CEL SHADING · 4 LAYERS');
  single('fig-grad', '渐变赛璐璐 · Cel + Grad', '阴影边缘做轻微渐变，保留赛璐璐的形，增加空气感。', { mode: 'grad', deco: false }, 'CEL + GRADIENT');
  single('fig-paint', '厚涂 · Painterly', '线稿弱化、阴影软化。用于对比：同一张线稿的另一种完成方式。', { mode: 'paint', deco: false }, 'PAINTERLY');
  single('fig-closeup', '脸部特写 · 四层结构', '放大看：发影、面颊侧影、脖子投影、虹膜上深下浅。赛璐璐的“干净”来自边界。', { mode: 'cel', deco: false, crop: true }, 'FACE CLOSE-UP');
  single('fig-sunset', '夕烧配色 · 暖光', '同一套线稿，换成暖橙发色与酒红衣服，气质立刻从“月夜”变“黄昏”。', { mode: 'cel', palette: 'sunset', deco: true }, 'PALETTE · SUNSET');
  single('fig-night', '深宵配色 · 冷光', '冷色头发 + 深蓝衣服 + 青色边缘光，适合夜景与蓝调氛围。', { mode: 'cel', palette: 'night', deco: true }, 'PALETTE · NIGHT');

  window.FIGURES['fig-modes'] = {
    title: '五种完成度对照', caption: '同一张线稿：线稿 → 平涂 → 赛璐璐 → 渐变赛璐璐 → 厚涂。先决定“要哪种完成度”，再决定画多久。',
    svg: function () {
      var modes = ['line', 'flat', 'cel', 'grad', 'paint'];
      var labels = ['线稿', '平涂', '赛璐璐', '渐变', '厚涂'];
      var inner = '';
      modes.forEach(function (m, i) {
        var x = 24 + i * 192;
        inner += pbox({ mode: m, deco: false }, x, 22, 176, 230);
        inner += '<text x="' + (x + 88) + '" y="274" text-anchor="middle" fill="#eef1ff" font-size="12" font-weight="700" font-family="Hub Sans SC,sans-serif">' + labels[i] + '</text>';
      });
      return wrap(1000, 300, inner, 'SAME LINEART · FIVE FINISH LEVELS');
    }
  };

  window.FIGURES['fig-light'] = {
    title: '光源方向对照 · 左 vs 右', caption: '同一张画，只把阴影与边缘光镜像：光源在左上时，暗面在右下；换到右上，整个人的体积感与情绪都会变。',
    svg: function () {
      var inner = pbox({ mode: 'cel', deco: false }, 24, 20, 350, 458) +
        pbox({ mode: 'cel', light: 'right', decc: true, deco: false }, 410, 20, 350, 458) +
        '<text x="199" y="496" text-anchor="middle" fill="#7fe9ff" font-size="11" letter-spacing=".14em" font-family="Georgia,serif">LIGHT FROM UPPER LEFT</text>' +
        '<text x="585" y="496" text-anchor="middle" fill="#ff8fc7" font-size="11" letter-spacing=".14em" font-family="Georgia,serif">LIGHT FROM UPPER RIGHT</text>';
      return wrap(790, 520, inner);
    }
  };

  window.FIGURES['fig-palettes'] = {
    title: '配色对照 · 月紫 / 夕烧 / 青瓷', caption: '发色不是孤立的。它要和衣服、虹膜、边缘光一起构成一个色温系统。',
    svg: function () {
      var ps = [['lavender', '月紫 · LAVENDER'], ['sunset', '夕烧 · SUNSET'], ['mint', '青瓷 · MINT']];
      var inner = '';
      ps.forEach(function (p, i) {
        var x = 20 + i * 260;
        inner += pbox({ mode: 'cel', palette: p[0], deco: false }, x, 18, 230, 300);
        inner += '<text x="' + (x + 115) + '" y="344" text-anchor="middle" fill="#eef1ff" font-size="11" font-family="Hub Sans SC,sans-serif">' + p[1] + '</text>';
      });
      return wrap(800, 370, inner);
    }
  };
})();
