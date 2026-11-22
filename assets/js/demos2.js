/* ═══════════════════════════════════════════════════════════════
   DEMOS 2 · 软件工坊：Procreate / SAI2 / CSP / PS
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.DEMOS = window.DEMOS || {};
  function def(id, title, desc, tag, fn) { window.DEMOS[id] = { title: title, desc: desc, tag: tag, mount: fn }; }
  function q(root, s) { return root.querySelector(s); }
  function qa(root, s) { return Array.prototype.slice.call(root.querySelectorAll(s)); }

  function fitCanvas(cv, h) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = cv.clientWidth || 600;
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ═══════════ 1. Procreate 笔刷工作室 ═══════════ */
  def('procreate-brush', '笔刷工作室', '调间距、抖动、锥度、压感，直接在画布上试笔。本演示只模拟四个维度，不能代替应用笔刷或设备的实际测试。', 'PROCREATE LAB', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="pb-canvas" style="width:100%;height:330px;touch-action:none;cursor:crosshair;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<div class="seg sm" id="pb-shape"><button data-v="round" class="on">圆笔</button><button data-v="flat">扁笔</button><button data-v="grain">颗粒</button></div>' +
      '<div class="ctl"><div class="ctl-label"><span>间距 Spacing</span><b id="pb-sp-v">8%</b></div><input type="range" id="pb-sp" min="2" max="40" value="8"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>抖动 Jitter</span><b id="pb-jt-v">0%</b></div><input type="range" id="pb-jt" min="0" max="100" value="0"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>锥度 Taper</span><b id="pb-tp-v">55%</b></div><input type="range" id="pb-tp" min="0" max="100" value="55"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>压感 Size</span><b id="pb-ps-v">85%</b></div><input type="range" id="pb-ps" min="0" max="100" value="85"></div>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="pb-clear">清空画布</button><span class="badge pink" id="pb-tip">用鼠标画一笔</span></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>公式：</b>线宽 = 基础尺寸 × 压感 × 锥度；间距决定颗粒感，抖动做纹理。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#pb-canvas'), ctx = cv.getContext('2d');
    var sp = q(el, '#pb-sp'), jt = q(el, '#pb-jt'), tp = q(el, '#pb-tp'), ps = q(el, '#pb-ps');
    var shape = 'round', drawing = false, last = null, acc = 0, stampCount = 0, W = 0, H = 0, dpr = 1, raf = 0;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      drawBg();
    }
    function drawBg() {
      ctx.clearRect(0, 0, W, H);
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(185,166,255,.05)'); g.addColorStop(1, 'rgba(127,233,255,.02)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
      for (var x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }
    function stamp(x, y, size, alpha, angle) {
      var t = shape;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle || 0);
      if (t === 'grain') {
        for (var i = 0; i < 4; i++) {
          ctx.fillStyle = 'rgba(255,190,220,' + (alpha * .32) + ')';
          ctx.beginPath(); ctx.arc((Math.random() - .5) * size, (Math.random() - .5) * size, size * .28 * Math.random() + .4, 0, 6.283); ctx.fill();
        }
      } else {
        ctx.fillStyle = 'rgba(255,190,220,' + alpha + ')';
        ctx.beginPath();
        if (t === 'flat') ctx.ellipse(0, 0, size * .75, size * .22, 0, 0, 6.283);
        else ctx.arc(0, 0, size * .5, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,' + (alpha * .35) + ')';
        ctx.beginPath(); ctx.arc(-size * .12, -size * .12, size * .16, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }
    function params() {
      return { spacing: +sp.value / 100, jitter: +jt.value / 100, taper: +tp.value / 100, press: +ps.value / 100 };
    }
    function move(e) {
      if (!drawing) return;
      var r = cv.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var p = params();
      var pressure = (e.pressure && e.pressure > 0 && e.pressure !== .5) ? e.pressure : Math.max(.25, 1 - Math.hypot(x - last.x, y - last.y) / 90);
      var size = 8 + pressure * 34 * (.4 + p.press * .9);
      var dist = Math.hypot(x - last.x, y - last.y);
      var step = Math.max(1.2, size * p.spacing);
      var dx = x - last.x, dy = y - last.y;
      var n = Math.max(1, Math.ceil(dist / step));
      for (var i = 0; i < n; i++) {
        var t = i / n;
        var sx = last.x + dx * t + (Math.random() - .5) * p.jitter * 18;
        var sy = last.y + dy * t + (Math.random() - .5) * p.jitter * 18;
        var taper = Math.min(1, stampCount / (10 + p.taper * 20) + .18);
        var a = .16 + p.press * .3;
        stamp(sx, sy, Math.max(1, size * taper), a, Math.atan2(dy, dx));
        stampCount++;
      }
      last = { x: x, y: y };
      var tip = q(el, '#pb-tip'); if (tip) tip.textContent = stampCount + ' 个笔尖';
    }
    cv.addEventListener('pointerdown', function (e) {
      cv.setPointerCapture(e.pointerId);
      var r = cv.getBoundingClientRect();
      drawing = true; stampCount = 0; last = { x: e.clientX - r.left, y: e.clientY - r.top };
      var p = params(); stamp(last.x, last.y, 36, .2, 0);
    });
    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', function () { drawing = false; });
    cv.addEventListener('pointercancel', function () { drawing = false; });
    q(el, '#pb-clear').addEventListener('click', drawBg);
    qa(el, '#pb-shape button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#pb-shape button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); shape = b.getAttribute('data-v');
      });
    });
    function sync() {
      q(el, '#pb-sp-v').textContent = sp.value + '%';
      q(el, '#pb-jt-v').textContent = jt.value + '%';
      q(el, '#pb-tp-v').textContent = tp.value + '%';
      q(el, '#pb-ps-v').textContent = ps.value + '%';
      sp.style.setProperty('--p', ((sp.value - 2) / 38 * 100) + '%');
      jt.style.setProperty('--p', jt.value + '%');
      tp.style.setProperty('--p', tp.value + '%');
      ps.style.setProperty('--p', ps.value + '%');
    }
    [sp, jt, tp, ps].forEach(function (x) { x.addEventListener('input', sync); });
    window.addEventListener('resize', resize);
    resize(); sync();
  });

  /* ═══════════ 2. SAI2 水彩 ═══════════ */
  def('sai-watercolor', 'SAI2 水彩模拟', '低透明度叠色 + 边缘加深。水分越高，颜色越淡、扩散越明显。', 'SAI2 · WATER', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="sw-canvas" style="width:100%;height:330px;touch-action:none;cursor:crosshair;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<h5>颜色</h5><div class="sw-row" id="sw-colors">' +
      '<button class="sw" data-c="#ff8fc7" style="background:#ff8fc7"></button>' +
      '<button class="sw" data-c="#c0a4ff" style="background:#c0a4ff"></button>' +
      '<button class="sw" data-c="#7fe9ff" style="background:#7fe9ff"></button>' +
      '<button class="sw" data-c="#ffd79a" style="background:#ffd79a"></button>' +
      '<button class="sw" data-c="#8ef0cf" style="background:#8ef0cf"></button></div>' +
      '<div class="ctl"><div class="ctl-label"><span>水分</span><b id="sw-w-v">45%</b></div><input type="range" id="sw-w" min="5" max="95" value="45"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>笔刷大小</span><b id="sw-s-v">26</b></div><input type="range" id="sw-s" min="4" max="60" value="26"></div>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="sw-clear">换纸</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>要点：</b>水彩靠“叠”而不是“涂”。同一处叠加 2~3 次，边缘自然变深。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#sw-canvas'), ctx = cv.getContext('2d');
    var water = q(el, '#sw-w'), size = q(el, '#sw-s');
    var color = '#ff8fc7', drawing = false, last = null, W = 0, H = 0;
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0d101d'; ctx.fillRect(0, 0, W, H);
      // paper grain
      for (var i = 0; i < 900; i++) {
        ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * .022) + ')';
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.2, 1.2);
      }
    }
    function dab(x, y, p) {
      var r = +size.value * (.55 + p * .7);
      var a = (1 - +water.value / 100) * .18 + .015;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexA(color, a * 1.4));
      g.addColorStop(.55, hexA(color, a));
      g.addColorStop(.88, hexA(color, a * .55));
      g.addColorStop(1, hexA(color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }
    function hexA(hex, a) {
      var n = parseInt(hex.slice(1), 16);
      return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    cv.addEventListener('pointerdown', function (e) { cv.setPointerCapture(e.pointerId); drawing = true; last = pos(e); dab(last.x, last.y, .6); });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e), d = Math.hypot(p.x - last.x, p.y - last.y), n = Math.max(1, Math.ceil(d / 3));
      for (var i = 1; i <= n; i++) dab(last.x + (p.x - last.x) * i / n, last.y + (p.y - last.y) * i / n, .5 + Math.random() * .5);
      last = p;
    });
    cv.addEventListener('pointerup', function () { drawing = false; });
    cv.addEventListener('pointercancel', function () { drawing = false; });
    q(el, '#sw-clear').addEventListener('click', resize);
    qa(el, '#sw-colors .sw').forEach(function (b) {
      b.addEventListener('click', function () {
        color = b.getAttribute('data-c');
        qa(el, '#sw-colors .sw').forEach(function (x) { x.style.outline = 'none'; });
        b.style.outline = '2px solid #fff'; b.style.outlineOffset = '2px';
      });
    });
    function sync() {
      q(el, '#sw-w-v').textContent = water.value + '%';
      q(el, '#sw-s-v').textContent = size.value;
      water.style.setProperty('--p', ((water.value - 5) / 90 * 100) + '%');
      size.style.setProperty('--p', ((size.value - 4) / 56 * 100) + '%');
    }
    water.addEventListener('input', sync); size.addEventListener('input', sync);
    window.addEventListener('resize', resize);
    resize(); sync();
  });

  /* ═══════════ 3. SAI2 防抖 ═══════════ */
  def('sai-stabilizer', 'SAI2 防抖对照', '同一笔手抖输入：粉色是原始轨迹，绿色是防抖后的输出。拖动滑块感受延迟与顺滑的取舍。', 'SAI2 · STABILIZER', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="ss-canvas" style="width:100%;height:330px;touch-action:none;cursor:crosshair;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<div class="ctl"><div class="ctl-label"><span>防抖强度 S</span><b id="ss-v">7</b></div><input type="range" id="ss-s" min="0" max="10" value="7"></div>' +
      '<label class="tgl"><input type="checkbox" id="ss-raw" checked><span class="track"></span>显示原始轨迹</label>' +
      '<label class="tgl"><input type="checkbox" id="ss-out" checked><span class="track"></span>显示防抖输出</label>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="ss-clear">清空</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>取舍：</b>S 越高越顺滑，但笔尖会“追不上手”；勾长线 S-7~9，画睫毛 S-3~5。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#ss-canvas'), ctx = cv.getContext('2d');
    var sIn = q(el, '#ss-s'), showRaw = q(el, '#ss-raw'), showOut = q(el, '#ss-out');
    var raw = [], out = [], drawing = false, W = 0, H = 0, raf = 0;
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0d101d'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,.04)';
      for (var x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d101d'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,.04)';
      for (var x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      function line(pts, color, width, dash) {
        if (pts.length < 2) return;
        ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (dash) ctx.setLineDash(dash);
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke(); ctx.restore();
      }
      if (showRaw.checked) line(raw, 'rgba(255,143,199,.35)', 1.5, [3, 4]);
      if (showOut.checked) line(out, 'rgba(142,240,207,.95)', 3.2);
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    cv.addEventListener('pointerdown', function (e) {
      cv.setPointerCapture(e.pointerId);
      drawing = true; raw = []; out = [];
      var p = pos(e); raw.push(p); out.push(p); draw();
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e); raw.push(p);
      var k = +sIn.value / 10;
      var prev = out[out.length - 1] || p;
      var nx = prev.x + (p.x - prev.x) * (1 - k * .82);
      var ny = prev.y + (p.y - prev.y) * (1 - k * .82);
      out.push({ x: nx, y: ny });
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; draw(); });
    });
    function up() { drawing = false; }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    q(el, '#ss-clear').addEventListener('click', function () { raw = []; out = []; resize(); draw(); });
    sIn.addEventListener('input', function () {
      q(el, '#ss-v').textContent = sIn.value;
      sIn.style.setProperty('--p', (+sIn.value * 10) + '%');
      draw();
    });
    showRaw.addEventListener('change', draw); showOut.addEventListener('change', draw);
    window.addEventListener('resize', function () { resize(); draw(); });
    resize(); draw();
  });

  /* ═══════════ 4. CSP 矢量线稿 ═══════════ */
  def('csp-vector', 'CSP 矢量线稿', '拖动控制点改线形，再放大 4 倍：矢量依旧锐利，位图开始锯齿。', 'CSP · VECTOR', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:10px"><div class="vec-stage" id="cv-stage" style="position:relative;overflow:hidden;border-radius:10px;background:#0d101d;height:330px">' +
      '<svg id="cv-svg" viewBox="0 0 640 320" style="position:absolute;left:0;top:0;width:100%;height:100%">' +
      '<path id="cv-path" d="M60 240 C150 70 260 260 350 140 C440 20 520 240 590 100" fill="none" stroke="#8fb8ff" stroke-width="4" stroke-linecap="round"/>' +
      '<g id="cv-handles"></g></svg>' +
      '<canvas id="cv-bitmap" style="position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;display:none"></canvas>' +
      '<div class="cmp-tag l" id="cv-zoomtag">VECTOR · 100%</div>' +
      '</div></div>' +
      '<div class="demo-panel">' +
      '<div class="seg" id="cv-mode"><button data-v="vec" class="on">矢量</button><button data-v="bmp">位图</button></div>' +
      '<div class="ctl"><div class="ctl-label"><span>放大倍数</span><b id="cv-z-v">1.0×</b></div><input type="range" id="cv-z" min="1" max="4" step="0.1" value="1"></div>' +
      '<div class="demo-note">拖动蓝色方块改变曲线；这是SVG路径与位图的概念对照；视图放大时线宽也会放大，不代表CSP所有笔刷都无限清晰。</div>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="cv-reset">重置曲线</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>结论：</b>需要反复改线的商稿用矢量；厚涂与纹理仍用普通图层。</span></div>' +
      '</div></div></div>';
    var svg = q(el, '#cv-svg'), path = q(el, '#cv-path'), handles = q(el, '#cv-handles');
    var canvas = q(el, '#cv-bitmap'), stage = q(el, '#cv-stage'), z = q(el, '#cv-z');
    var pts = [{ x: 60, y: 240, h1x: 150, h1y: 70, h2x: 260, h2y: 260 }, { x: 350, y: 140, h1x: 440, h1y: 20, h2x: 520, h2y: 240 }, { x: 590, y: 100, h1x: 600, h1y: 90, h2x: 610, h2y: 80 }];
    var mode = 'vec';
    function pathD() {
      return 'M' + pts[0].x + ' ' + pts[0].y + ' C' + pts[0].h1x + ' ' + pts[0].h1y + ' ' + pts[0].h2x + ' ' + pts[0].h2y + ' ' + pts[1].x + ' ' + pts[1].y +
        ' C' + pts[1].h1x + ' ' + pts[1].h1y + ' ' + pts[1].h2x + ' ' + pts[1].h2y + ' ' + pts[2].x + ' ' + pts[2].y;
    }
    function renderHandles() {
      var h = '';
      pts.forEach(function (p, i) {
        h += '<circle data-i="' + i + '" data-k="p" cx="' + p.x + '" cy="' + p.y + '" r="7" fill="#0a0d19" stroke="#8fb8ff" stroke-width="2.5" style="cursor:move"/>';
        if (i < 2) {
          h += '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + p.h2x + '" y2="' + p.h2y + '" stroke="#8fb8ff" stroke-opacity=".3"/>';
          h += '<circle data-i="' + i + '" data-k="h2" cx="' + p.h2x + '" cy="' + p.h2y + '" r="5" fill="#8fb8ff" fill-opacity=".5" stroke="#8fb8ff" style="cursor:move"/>';
        }
        if (i > 0) {
          h += '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + p.h1x + '" y2="' + p.h1y + '" stroke="#8fb8ff" stroke-opacity=".3"/>';
          h += '<circle data-i="' + i + '" data-k="h1" cx="' + p.h1x + '" cy="' + p.h1y + '" r="5" fill="#8fb8ff" fill-opacity=".5" stroke="#8fb8ff" style="cursor:move"/>';
        }
      });
      handles.innerHTML = h;
      path.setAttribute('d', pathD());
    }
    function drawBitmap() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = stage.clientWidth, h = stage.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0d101d'; ctx.fillRect(0, 0, w, h);
      ctx.save(); ctx.scale(w / 640, h / 320);
      ctx.strokeStyle = '#8fb8ff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.bezierCurveTo(pts[0].h1x, pts[0].h1y, pts[0].h2x, pts[0].h2y, pts[1].x, pts[1].y);
      ctx.bezierCurveTo(pts[1].h1x, pts[1].h1y, pts[1].h2x, pts[1].h2y, pts[2].x, pts[2].y);
      ctx.stroke(); ctx.restore();
    }
    function applyZoom() {
      var zv = +z.value;
      stage.style.overflow = 'hidden';
      svg.style.transformOrigin = '0 0';
      canvas.style.transformOrigin = '0 0';
      if (mode === 'vec') {
        svg.style.transform = 'scale(' + zv + ')';
        svg.style.display = 'block'; canvas.style.display = 'none';
      } else {
        canvas.style.transform = 'scale(' + zv + ')';
        svg.style.display = 'none'; canvas.style.display = 'block';
      }
      q(el, '#cv-zoomtag').textContent = (mode === 'vec' ? 'VECTOR' : 'BITMAP') + ' · ' + Math.round(zv * 100) + '%';
      q(el, '#cv-z-v').textContent = zv.toFixed(1) + '×';
      q(el, '#cv-z').style.setProperty('--p', ((zv - 1) / 3 * 100) + '%');
    }
    var drag = null;
    handles.addEventListener('pointerdown', function (e) {
      var t = e.target;
      if (!t || t.tagName !== 'circle') return;
      drag = { i: +t.getAttribute('data-i'), k: t.getAttribute('data-k') };
      handles.setPointerCapture(e.pointerId);
    });
    handles.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * 640 / (+z.value);
      var y = (e.clientY - r.top) / r.height * 320 / (+z.value);
      var p = pts[drag.i];
      if (drag.k === 'p') { p.x = Math.max(10, Math.min(630, x)); p.y = Math.max(10, Math.min(310, y)); }
      if (drag.k === 'h1') { p.h1x = Math.max(0, Math.min(640, x)); p.h1y = Math.max(0, Math.min(320, y)); }
      if (drag.k === 'h2') { p.h2x = Math.max(0, Math.min(640, x)); p.h2y = Math.max(0, Math.min(320, y)); }
      renderHandles(); drawBitmap();
    });
    handles.addEventListener('pointerup', function () { drag = null; });
    qa(el, '#cv-mode button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#cv-mode button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); mode = b.getAttribute('data-v'); applyZoom();
      });
    });
    z.addEventListener('input', applyZoom);
    q(el, '#cv-reset').addEventListener('click', function () {
      pts = [{ x: 60, y: 240, h1x: 150, h1y: 70, h2x: 260, h2y: 260 }, { x: 350, y: 140, h1x: 440, h1y: 20, h2x: 520, h2y: 240 }, { x: 590, y: 100, h1x: 600, h1y: 90, h2x: 610, h2y: 80 }];
      renderHandles(); drawBitmap(); applyZoom();
    });
    renderHandles(); drawBitmap(); applyZoom();
  });

  /* ═══════════ 5. CSP 网点 ═══════════ */
  def('csp-tone', 'CSP 网点实验室', '密度与角度决定灰度与质感。两套网点叠色时，角度要错开，否则会“撞网”。', 'CSP · TONE', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:10px"><svg id="ct-svg" viewBox="0 0 640 330" style="width:100%;display:block;border-radius:10px;background:#0d101d">' +
      '<defs><pattern id="ct-pat" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2" cy="2" r="1.6" fill="#8fb8ff"/></pattern></defs>' +
      '<path d="M80 280 C90 150 160 80 250 90 C350 100 380 200 300 240 C230 278 140 300 80 280 Z" fill="url(#ct-pat)" stroke="#8fb8ff" stroke-opacity=".35"/>' +
      '<path d="M380 260 C390 150 450 90 530 100 C600 110 620 190 560 235 C510 272 430 280 380 260 Z" fill="url(#ct-pat)" stroke="#8fb8ff" stroke-opacity=".2" opacity=".6"/>' +
      '<text x="320" y="315" text-anchor="middle" fill="#9aa4c4" font-size="10">两套网点叠加：角度错开 30° 可避免摩尔纹</text>' +
      '</svg></div>' +
      '<div class="demo-panel">' +
      '<div class="ctl"><div class="ctl-label"><span>网点密度</span><b id="ct-d-v">50%</b></div><input type="range" id="ct-d" min="8" max="95" value="50"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>网点角度</span><b id="ct-a-v">45°</b></div><input type="range" id="ct-a" min="0" max="90" value="45"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>网点大小</span><b id="ct-r-v">1.6</b></div><input type="range" id="ct-r" min="5" max="30" value="16"></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>规则：</b>10% 网点做浅灰，30% 做中间调，50% 以上只用于强调；大面积 70% 会糊。</span></div>' +
      '</div></div></div>';
    var pat = q(el, '#ct-pat'), dIn = q(el, '#ct-d'), aIn = q(el, '#ct-a'), rIn = q(el, '#ct-r');
    function render() {
      var d = +dIn.value, a = +aIn.value, r = +rIn.value / 10;
      var step = 6 + (100 - d) / 100 * 14;
      pat.setAttribute('width', step); pat.setAttribute('height', step);
      pat.setAttribute('patternTransform', 'rotate(' + a + ')');
      var c = pat.querySelector('circle');
      c.setAttribute('cx', step * .2); c.setAttribute('cy', step * .2); c.setAttribute('r', r);
      q(el, '#ct-d-v').textContent = d + '%';
      q(el, '#ct-a-v').textContent = a + '°';
      q(el, '#ct-r-v').textContent = r.toFixed(1);
      dIn.style.setProperty('--p', ((d - 8) / 87 * 100) + '%'); aIn.style.setProperty('--p', (a / 90 * 100) + '%');
      rIn.style.setProperty('--p', ((r - .5) / 2.5 * 100) + '%');
    }
    [dIn, aIn, rIn].forEach(function (x) { x.addEventListener('input', render); });
    render();
  });

  /* ═══════════ 6. PS 曲线 ═══════════ */
  def('ps-curves', 'Photoshop 曲线', '拖动曲线上的点，实时改变成图对比。上凸提亮，下凹压暗；S 曲线加对比。', 'PS · CURVES', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="pc-canvas" style="width:auto;max-width:100%;max-height:430px;display:block;margin:0 auto;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<svg id="pc-graph" viewBox="0 0 200 200" style="width:100%;background:#0c0f1c;border:1px solid var(--line);border-radius:10px;touch-action:none">' +
      '<line x1="20" y1="180" x2="180" y2="180" stroke="#ffffff" stroke-opacity=".15"/><line x1="20" y1="20" x2="20" y2="180" stroke="#ffffff" stroke-opacity=".15"/>' +
      '<line x1="20" y1="180" x2="180" y2="20" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="3 4"/>' +
      '<path id="pc-curve" d="M20 180 L100 100 L180 20" fill="none" stroke="#7fe9ff" stroke-width="2.5"/>' +
      '<circle data-k="lo" cx="60" cy="150" r="6" fill="#0a0d19" stroke="#7fe9ff" stroke-width="2" style="cursor:ns-resize"/>' +
      '<circle data-k="mid" cx="100" cy="100" r="6" fill="#0a0d19" stroke="#7fe9ff" stroke-width="2" style="cursor:ns-resize"/>' +
      '<circle data-k="hi" cx="140" cy="50" r="6" fill="#0a0d19" stroke="#7fe9ff" stroke-width="2" style="cursor:ns-resize"/>' +
      '</svg>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="pc-reset">重置曲线</button><button class="demo-btn" id="pc-s">S 曲线</button><button class="demo-btn" id="pc-soft">柔和</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>读法：</b>左下是暗部，右上是高光。只动中间点 = 整体提亮/压暗；两端不动 = 保住黑白场。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#pc-canvas'), ctx = cv.getContext('2d');
    var graph = q(el, '#pc-graph'), curve = q(el, '#pc-curve');
    var pts = { lo: 150, mid: 100, hi: 50 };
    var img = null, base = null, W = 0, H = 0, dpr = 1;
    function load() {
      var svg = ART.portrait({ mode: 'cel', palette: 'lavender' });
      var data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      var im = new Image();
      im.onload = function () {
        img = im;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = 520; H = 680;
        cv.width = W * dpr; cv.height = H * dpr;
        cv.style.width = 'auto'; cv.style.maxWidth = '100%'; cv.style.maxHeight = '430px'; cv.style.display = 'block'; cv.style.margin = '0 auto';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        apply();
      };
      im.onerror = function () {
        cv.parentNode.innerHTML = '<div class="demo-caption"><span class="dot"></span><span>图像加载失败，请通过本地服务器打开本站。</span></div>';
      };
      im.src = data;
    }
    function lut() {
      var arr = new Uint8ClampedArray(256);
      function yAt(x) {
        if (x < 0.2) return 1 - (1 - pts.lo / 200) * (x / 0.2);
        if (x < 0.5) return 1 - (1 - pts.lo / 200) - ((pts.lo - pts.mid) / 200) * ((x - .2) / .3);
        if (x < 0.8) return 1 - (1 - pts.mid / 200) - ((pts.mid - pts.hi) / 200) * ((x - .5) / .3);
        return 1 - (1 - pts.hi / 200) - ((pts.hi - 20) / 200) * ((x - .8) / .2);
      }
      for (var i = 0; i < 256; i++) {
        var v = yAt(i / 255);
        arr[i] = Math.max(0, Math.min(255, v * 255));
      }
      return arr;
    }
    function apply() {
      if (!img) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      var d = ctx.getImageData(0, 0, W, H), data = d.data;
      var l = lut();
      for (var i = 0; i < data.length; i += 4) {
        data[i] = l[data[i]]; data[i + 1] = l[data[i + 1]]; data[i + 2] = l[data[i + 2]];
      }
      ctx.putImageData(d, 0, 0);
      // graph
      var gx = function (x) { return 20 + x * 160; };
      var gy = function (y) { return 180 - y * 160; };
      curve.setAttribute('d', 'M20 180 L' + gx(.2) + ' ' + gy(1 - pts.lo / 200) + ' L' + gx(.5) + ' ' + gy(1 - pts.mid / 200) + ' L' + gx(.8) + ' ' + gy(1 - pts.hi / 200) + ' L180 20');
      var cs = qa(graph, 'circle');
      cs.forEach(function (c) {
        var k = c.getAttribute('data-k');
        c.setAttribute('cy', k === 'lo' ? gy(1 - pts.lo / 200) : k === 'mid' ? gy(1 - pts.mid / 200) : gy(1 - pts.hi / 200));
      });
    }
    var drag = null;
    graph.addEventListener('pointerdown', function (e) {
      if (e.target.tagName === 'circle') { drag = e.target.getAttribute('data-k'); graph.setPointerCapture(e.pointerId); }
    });
    graph.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var r = graph.getBoundingClientRect();
      var y = (e.clientY - r.top) / r.height * 200;
      var v = Math.max(20, Math.min(180, y));
      pts[drag] = v; apply();
    });
    graph.addEventListener('pointerup', function () { drag = null; });
    q(el, '#pc-reset').addEventListener('click', function () { pts = { lo: 150, mid: 100, hi: 50 }; apply(); });
    q(el, '#pc-s').addEventListener('click', function () { pts = { lo: 175, mid: 100, hi: 25 }; apply(); });
    q(el, '#pc-soft').addEventListener('click', function () { pts = { lo: 135, mid: 95, hi: 60 }; apply(); });
    load();
  });

  /* ═══════════ 7. PS 渐变映射 ═══════════ */
  def('ps-gradmap', '渐变映射', '把黑白灰映射到一条渐变上，一键统一氛围。拖动三个色标，看画面气质如何变化。', 'PS · GRADIENT MAP', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="pg-canvas" style="width:auto;max-width:100%;max-height:430px;display:block;margin:0 auto;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<h5>渐变标尺</h5>' +
      '<div class="sw-row">' +
      '<label class="badge" style="gap:6px;padding:4px 8px">暗部 <input type="color" id="pg-c1" value="#1b1440" style="width:34px;height:22px"></label>' +
      '<label class="badge" style="gap:6px;padding:4px 8px">中间 <input type="color" id="pg-c2" value="#7a4ac4" style="width:34px;height:22px"></label>' +
      '<label class="badge" style="gap:6px;padding:4px 8px">高光 <input type="color" id="pg-c3" value="#ffd79a" style="width:34px;height:22px"></label>' +
      '</div>' +
      '<div class="ctl"><div class="ctl-label"><span>混合强度</span><b id="pg-o-v">75%</b></div><input type="range" id="pg-o" min="0" max="100" value="75"></div>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="pg-sunset">落日</button><button class="demo-btn" id="pg-night">深夜</button><button class="demo-btn" id="pg-mint">青瓷</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>用法：</b>渐变映射层放在最上方，混合模式选“柔光/叠加”，不透明度 30~60%。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#pg-canvas'), ctx = cv.getContext('2d');
    var c1 = q(el, '#pg-c1'), c2 = q(el, '#pg-c2'), c3 = q(el, '#pg-c3'), op = q(el, '#pg-o');
    var img = null, W = 520, H = 680, dpr = 1;
    function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function mapColor(v) {
      var a = hexRgb(c1.value), b = hexRgb(c2.value), c = hexRgb(c3.value);
      if (v < .5) return mix(a, b, v / .5);
      return mix(b, c, (v - .5) / .5);
    }
    function apply() {
      if (!img) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      var d = ctx.getImageData(0, 0, W, H), data = d.data;
      var strength = +op.value / 100;
      for (var i = 0; i < data.length; i += 4) {
        var l = (data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114) / 255;
        var m = mapColor(l);
        data[i] = data[i] + (m[0] - data[i]) * strength;
        data[i + 1] = data[i + 1] + (m[1] - data[i + 1]) * strength;
        data[i + 2] = data[i + 2] + (m[2] - data[i + 2]) * strength;
      }
      ctx.putImageData(d, 0, 0);
      q(el, '#pg-o-v').textContent = op.value + '%';
      op.style.setProperty('--p', op.value + '%');
    }
    [c1, c2, c3].forEach(function (c) { c.addEventListener('input', apply); });
    op.addEventListener('input', apply);
    q(el, '#pg-sunset').addEventListener('click', function () { c1.value = '#2a1440'; c2.value = '#d1568f'; c3.value = '#ffd79a'; apply(); });
    q(el, '#pg-night').addEventListener('click', function () { c1.value = '#0a1026'; c2.value = '#3d5a9e'; c3.value = '#9beeff'; apply(); });
    q(el, '#pg-mint').addEventListener('click', function () { c1.value = '#122530'; c2.value = '#3faac9'; c3.value = '#e4fff9'; apply(); });
    function load() {
      var svg = ART.portrait({ mode: 'cel', palette: 'lavender' });
      var data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      var im = new Image();
      im.onload = function () {
        img = im; dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = W * dpr; cv.height = H * dpr; cv.style.width = 'auto'; cv.style.maxWidth = '100%'; cv.style.maxHeight = '430px'; cv.style.display = 'block'; cv.style.margin = '0 auto';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); apply();
      };
      im.src = data;
    }
    load();
  });

})();
