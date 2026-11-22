/* ═══════════════════════════════════════════════════════════════
   DEMOS · 核心：赛璐璐 / 配色 / 线条 / 头部 / 比例
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.DEMOS = window.DEMOS || {};
  function def(id, title, desc, tag, fn) { window.DEMOS[id] = { title: title, desc: desc, tag: tag, mount: fn }; }
  function q(root, s) { return root.querySelector(s); }
  function qa(root, s) { return Array.prototype.slice.call(root.querySelectorAll(s)); }

  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(100, s)); l = Math.max(0, Math.min(100, l));
    var c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l / 100 - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    function hex(v) { var n = Math.round((v + m) * 255); return ('0' + n.toString(16)).slice(-2); }
    return '#' + hex(r) + hex(g) + hex(b);
  }

  /* ═══════════ 1. 赛璐璐渲染台 ═══════════ */
  def('cel-stage', '赛璐璐渲染台', '同一张线稿，五种完成度。开关阴影/高光/边缘光，观察画面如何从“平”变“立”。', 'CORE DEMO', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" id="cs-stage" style="padding:10px"></div>' +
      '<div class="demo-panel">' +
      '<h5>渲染方式</h5>' +
      '<div class="seg" id="cs-mode">' +
      '<button data-v="line">线稿</button><button data-v="flat">平涂</button><button data-v="cel" class="on">赛璐璐</button><button data-v="grad">渐变</button><button data-v="paint">厚涂</button>' +
      '</div>' +
      '<h5>图层开关</h5>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 10px">' +
      '<label class="tgl"><input type="checkbox" checked data-layer="shade"><span class="track"></span>阴影</label>' +
      '<label class="tgl"><input type="checkbox" checked data-layer="hi"><span class="track"></span>高光</label>' +
      '<label class="tgl"><input type="checkbox" checked data-layer="rim"><span class="track"></span>边缘光</label>' +
      '<label class="tgl"><input type="checkbox" checked data-layer="ao"><span class="track"></span>闭塞</label>' +
      '</div>' +
      '<h5>光源方向</h5>' +
      '<div class="seg flat" id="cs-light"><button data-v="left" class="on">左上</button><button data-v="right">右上</button></div>' +
      '<h5>配色</h5>' +
      '<div class="sw-row" id="cs-pal">' +
      '<button class="sw" data-p="lavender" style="background:linear-gradient(135deg,#d9c9f6,#ff8fc7)" title="月紫"></button>' +
      '<button class="sw" data-p="sunset" style="background:linear-gradient(135deg,#ffbe86,#ff5f8f)" title="夕烧"></button>' +
      '<button class="sw" data-p="mint" style="background:linear-gradient(135deg,#b2e8dd,#7fe9ff)" title="青瓷"></button>' +
      '<button class="sw" data-p="night" style="background:linear-gradient(135deg,#93a3e4,#b9a6ff)" title="深宵"></button>' +
      '<button class="sw" data-p="sakura" style="background:linear-gradient(135deg,#ffd3e4,#ff8fc7)" title="樱染"></button>' +
      '</div>' +
      '<div class="stat-grid">' +
      '<div class="stat"><small>当前模式</small><b id="cs-mode-t">赛璐璐</b></div>' +
      '<div class="stat"><small>图层数</small><b id="cs-layers">4</b></div>' +
      '</div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>试试：</b>切到「平涂」再逐层打开阴影与高光，观察体积是如何被“加”出来的。</span></div>' +
      '</div></div></div>';

    var stage = q(el, '#cs-stage');
    var state = { mode: 'cel', palette: 'lavender', light: 'left', layers: { shade: true, hi: true, rim: true, ao: true } };
    var svg = null;
    function applyLayers() {
      if (!svg) return;
      svg.classList.toggle('hide-shade', !state.layers.shade);
      svg.classList.toggle('hide-hi', !state.layers.hi);
      svg.classList.toggle('hide-rim', !state.layers.rim);
      svg.classList.toggle('hide-ao', !state.layers.ao);
      var n = 1 + (state.layers.shade ? 1 : 0) + (state.layers.hi ? 1 : 0) + (state.layers.rim ? 1 : 0) + (state.layers.ao ? 1 : 0);
      q(el, '#cs-layers').textContent = n;
    }
    function render() {
      stage.innerHTML = ART.portrait({ mode: state.mode, palette: state.palette, light: state.light });
      svg = q(stage, 'svg');
      svg.style.maxHeight = '540px';
      svg.style.width = '100%';
      applyLayers();
      q(el, '#cs-mode-t').textContent = ART.modeLabels[state.mode] || state.mode;
    }
    qa(el, '#cs-mode button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#cs-mode button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); state.mode = b.getAttribute('data-v'); render();
      });
    });
    qa(el, '#cs-light button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#cs-light button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); state.light = b.getAttribute('data-v');
        if (svg) svg.classList.toggle('light-right', state.light === 'right');
      });
    });
    qa(el, '[data-p]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.palette = b.getAttribute('data-p');
        qa(el, '[data-p]').forEach(function (x) { x.style.outline = 'none'; });
        b.style.outline = '2px solid #fff'; b.style.outlineOffset = '2px';
        render();
      });
    });
    qa(el, '[data-layer]').forEach(function (c) {
      c.addEventListener('change', function () {
        state.layers[c.getAttribute('data-layer')] = c.checked; applyLayers();
      });
    });
    render();
  });

  /* ═══════════ 2. 阴影色相实验 ═══════════ */
  def('cel-palette', '阴影色相实验', '拖动色相与偏移滑块，观察“直接把颜色变黑”和“偏移色相”带来的通透度差异。', 'COLOR LAB', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" id="cp-stage" style="padding:8px"></div>' +
      '<div class="demo-panel">' +
      '<h5>发色色相 <b id="cp-h-v" style="font-family:var(--mono);font-size:10px;color:var(--pink)">265°</b></h5>' +
      '<input type="range" id="cp-h" min="0" max="360" value="265">' +
      '<h5>阴影色相偏移 <b id="cp-s-v" style="font-family:var(--mono);font-size:10px;color:var(--pink)">+26°</b></h5>' +
      '<input type="range" id="cp-s" min="-40" max="60" value="26">' +
      '<div class="sw-row" style="margin-top:2px">' +
      '<div class="sw" id="cp-sw1"><span>底色</span></div>' +
      '<div class="sw" id="cp-sw2"><span>一阴</span></div>' +
      '<div class="sw" id="cp-sw3"><span>二阴</span></div>' +
      '<div class="sw" id="cp-sw4"><span>高光</span></div>' +
      '</div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>原理：</b>阴影不是“同色变黑”。把色相往紫/蓝偏 20~35°，同时略降明度，颜色才有空气感。</span></div>' +
      '</div></div></div>';
    var stage = q(el, '#cp-stage');
    var hIn = q(el, '#cp-h'), sIn = q(el, '#cp-s');
    function palette(h, shift) {
      return {
        name: 'custom',
        skin: '#ffe4d9', skinSh: hsl(16 + shift * .3, 58, 80), skinDeep: hsl(12 + shift * .4, 52, 66),
        hair: hsl(h, 62, 79), hairSh: hsl(h + shift, 56, 64), hairDeep: hsl(h + shift, 48, 48), hairLt: hsl(h, 80, 93),
        cloth: hsl(h - 50, 32, 24), clothSh: hsl(h - 50, 32, 15), clothLt: hsl(h - 50, 30, 38),
        ribbon: hsl(h + 45, 82, 70), ribbonSh: hsl(h + 45, 70, 54),
        eye: hsl(h + 30, 85, 74), eye2: hsl(h + 80, 60, 52), eyeDeep: hsl(h + 60, 60, 20),
        line: hsl(h + 230, 30, 22), rim: hsl(h + 170, 90, 78), paper: '#f7f0e6', ac: hsl(h, 80, 72)
      };
    }
    var raf = 0;
    function render() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var h = +hIn.value, sh = +sIn.value;
        q(el, '#cp-h-v').textContent = h + '°';
        q(el, '#cp-s-v').textContent = (sh >= 0 ? '+' : '') + sh + '°';
        var p = palette(h, sh);
        stage.innerHTML = ART.portrait({ mode: 'cel', palette: p });
        var svg = q(stage, 'svg'); svg.style.maxHeight = '520px'; svg.style.width = '100%';
        var sws = [p.hair, p.hairSh, p.hairDeep, p.hairLt];
        ['#cp-sw1', '#cp-sw2', '#cp-sw3', '#cp-sw4'].forEach(function (id, i) {
          q(el, id).style.background = sws[i];
        });
        hIn.style.setProperty('--p', (h / 360 * 100) + '%');
        sIn.style.setProperty('--p', ((sh + 40) / 100 * 100) + '%');
      });
    }
    hIn.addEventListener('input', render); sIn.addEventListener('input', render);
    render();
  });

  /* ═══════════ 3. 配色轮与和谐方案 ═══════════ */
  def('color-harmony', '配色轮：先定主色，再选关系', '点击色轮选主色，切换互补 / 类似 / 三角 / 分裂互补，观察同一角色如何换气质。', 'COLOR WHEEL', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" id="ch-stage" style="padding:8px"></div>' +
      '<div class="demo-panel">' +
      '<div class="wheel-box" id="ch-wheel"><div class="wheel-pin" id="ch-pin"></div></div>' +
      '<div class="seg sm" id="ch-scheme" style="justify-content:center">' +
      '<button data-v="comp" class="on">互补</button><button data-v="analog">类似</button><button data-v="tri">三角</button><button data-v="split">分裂互补</button>' +
      '</div>' +
      '<div class="sw-row" id="ch-swatches" style="margin-top:4px"></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>主色</b>决定气质，<b>辅色</b>决定层次。赛璐璐里，阴影色通常来自主色邻近色区的深色。</span></div>' +
      '</div></div></div>';
    var stage = q(el, '#ch-stage');
    var wheel = q(el, '#ch-wheel'), pin = q(el, '#ch-pin');
    var hue = 320, scheme = 'comp';
    function schemeHues(h) {
      if (scheme === 'comp') return [h, h + 180];
      if (scheme === 'analog') return [h - 30, h, h + 30];
      if (scheme === 'tri') return [h, h + 120, h + 240];
      return [h, h + 150, h + 210];
    }
    function palette() {
      var hs = schemeHues(hue);
      return {
        name: 'harmony',
        skin: '#ffe4d9', skinSh: hsl(14, 55, 80), skinDeep: hsl(10, 50, 67),
        hair: hsl(hue, 62, 78), hairSh: hsl(hue + 25, 55, 62), hairDeep: hsl(hue + 30, 45, 46), hairLt: hsl(hue, 82, 93),
        cloth: hsl(hs[1] || hue + 180, 32, 23), clothSh: hsl(hs[1] || hue + 180, 32, 14), clothLt: hsl(hs[1] || hue + 180, 30, 36),
        ribbon: hsl(hs[1] || hue + 180, 78, 70), ribbonSh: hsl(hs[1] || hue + 180, 68, 54),
        eye: hsl(hs[2] || hue + 160, 82, 74), eye2: hsl(hs[2] || hue + 200, 55, 50), eyeDeep: hsl(hs[2] || hue + 220, 55, 20),
        line: hsl(hue + 230, 28, 22), rim: hsl(hs[2] || hue + 170, 85, 78), paper: '#f7f0e6', ac: hsl(hue, 80, 72)
      };
    }
    function render() {
      var p = palette();
      var hs = schemeHues(hue);
      stage.innerHTML = ART.portrait({ mode: 'cel', palette: p });
      var svg = q(stage, 'svg'); svg.style.maxHeight = '520px'; svg.style.width = '100%';
      var sw = q(el, '#ch-swatches');
      sw.innerHTML = hs.map(function (h) {
        return '<div class="sw" style="background:' + hsl(h, 70, 62) + '"><span>' + Math.round(((h % 360) + 360) % 360) + '°</span></div>';
      }).join('');
      var ang = hue * Math.PI / 180;
      pin.style.left = (50 + Math.cos(ang) * 38) + '%';
      pin.style.top = (50 + Math.sin(ang) * 38) + '%';
    }
    wheel.addEventListener('pointerdown', function (e) {
      function move(ev) {
        var r = wheel.getBoundingClientRect();
        var dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height / 2);
        hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
        render();
      }
      move(e);
      function up() { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    });
    qa(el, '#ch-scheme button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#ch-scheme button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); scheme = b.getAttribute('data-v'); render();
      });
    });
    render();
  });

  /* ═══════════ 4. 线条训练场 ═══════════ */
  def('line-drill', '线条训练场', '直接画。调平滑与抖动，感受“压感、锥度、防抖”对线条性格的影响。', 'DRAW HERE', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="ld-canvas" style="width:100%;height:360px;touch-action:none;cursor:crosshair;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<h5>笔触参数</h5>' +
      '<div class="ctl"><div class="ctl-label"><span>平滑 / 防抖</span><b id="ld-sm-v">35</b></div><input type="range" id="ld-sm" min="0" max="90" value="35"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>抖动</span><b id="ld-jit-v">0</b></div><input type="range" id="ld-jit" min="0" max="12" value="0"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>基础线宽</span><b id="ld-w-v">5</b></div><input type="range" id="ld-w" min="1" max="18" value="5"></div>' +
      '<label class="tgl"><input type="checkbox" id="ld-guide" checked><span class="track"></span>显示示范线</label>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="ld-clear">清空</button><span class="badge" id="ld-count">0 笔</span></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>练习：</b>沿着灰色 S 线描 5 遍，尽量一笔完成；收笔时抬腕，让线自然变细。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#ld-canvas'), ctx = cv.getContext('2d');
    var sm = q(el, '#ld-sm'), jit = q(el, '#ld-jit'), baseW = q(el, '#ld-w'), guide = q(el, '#ld-guide');
    var strokes = [], cur = null, last = null, lastT = 0, W = 0, H = 0, dpr = 1;
    function fit() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function guidePath() {
      ctx.save(); ctx.strokeStyle = 'rgba(168,183,255,.18)'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.moveTo(40, H * .7);
      ctx.bezierCurveTo(W * .3, H * .1, W * .55, H * .95, W - 40, H * .25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(60, H * .35);
      ctx.bezierCurveTo(W * .28, H * .18, W * .46, H * .3, W * .52, H * .42);
      ctx.stroke();
      ctx.restore();
    }
    function drawStroke(s) {
      if (s.pts.length < 2) return;
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,170,210,.92)';
      for (var i = 1; i < s.pts.length; i++) {
        var a = s.pts[i - 1], b = s.pts[i];
        var t = i / s.pts.length;
        var taper = Math.min(1, t * 4, (1 - t) * 5 + .22);
        ctx.lineWidth = Math.max(.6, s.w * taper * (b.p || 1));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(255,143,199,.035)'); g.addColorStop(1, 'rgba(127,233,255,.02)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (guide.checked) guidePath();
      strokes.forEach(drawStroke);
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    cv.addEventListener('pointerdown', function (e) {
      cv.setPointerCapture(e.pointerId);
      var p = pos(e); last = p; lastT = performance.now();
      cur = { pts: [{ x: p.x, y: p.y, p: 1 }], w: +baseW.value }; strokes.push(cur); draw();
      q(el, '#ld-count').textContent = strokes.length + ' 笔';
    });
    cv.addEventListener('pointermove', function (e) {
      if (!cur) return;
      var p = pos(e), now = performance.now();
      var dt = Math.max(8, now - lastT);
      var dist = Math.hypot(p.x - last.x, p.y - last.y);
      var speed = dist / dt * 16;
      var press = Math.max(.3, Math.min(1, 1.1 - speed * .035));
      var k = +sm.value / 100;
      var tx = last.x + (p.x - last.x) * (1 - k * .55);
      var ty = last.y + (p.y - last.y) * (1 - k * .55);
      var j = (+jit.value) * (Math.random() - .5);
      cur.pts.push({ x: tx + j, y: ty + j, p: press });
      last = { x: tx, y: ty }; lastT = now;
      draw();
    });
    function end() { cur = null; last = null; }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    q(el, '#ld-clear').addEventListener('click', function () { strokes = []; draw(); q(el, '#ld-count').textContent = '0 笔'; });
    function sync() {
      q(el, '#ld-sm-v').textContent = sm.value;
      q(el, '#ld-jit-v').textContent = jit.value;
      q(el, '#ld-w-v').textContent = baseW.value;
      sm.style.setProperty('--p', (sm.value / 90 * 100) + '%');
      jit.style.setProperty('--p', (jit.value / 12 * 100) + '%');
      baseW.style.setProperty('--p', ((baseW.value - 1) / 17 * 100) + '%');
      draw();
    }
    sm.addEventListener('input', sync); jit.addEventListener('input', sync); baseW.addEventListener('input', sync);
    guide.addEventListener('change', draw);
    window.addEventListener('resize', fit);
    fit(); sync();
  });

  /* ═══════════ 5. 头部角度 ═══════════ */
  def('head-angle', '头部角度实验', '拖动偏航与俯仰，观察五官如何随头部转向移动、压缩、变形。', 'FUNDAMENTALS', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split rev">' +
      '<div class="demo-panel">' +
      '<h5>头部旋转</h5>' +
      '<div class="ctl"><div class="ctl-label"><span>左右偏航 Yaw</span><b id="ha-y-v">0°</b></div><input type="range" id="ha-y" min="-45" max="45" value="0"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>上下俯仰 Pitch</span><b id="ha-p-v">0°</b></div><input type="range" id="ha-p" min="-30" max="30" value="0"></div>' +
      '<label class="tgl"><input type="checkbox" id="ha-guide" checked><span class="track"></span>显示十字线</label>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>观察：</b>转头时，远侧眼睛会变窄、眼距压缩；鼻梁与嘴的中线向转向侧偏移。</span></div>' +
      '</div>' +
      '<div class="demo-stage" style="padding:8px"><svg id="ha-svg" viewBox="0 0 520 440" style="width:100%;display:block"></svg></div>' +
      '</div></div>';
    var svg = q(el, '#ha-svg');
    var yIn = q(el, '#ha-y'), pIn = q(el, '#ha-p'), guide = q(el, '#ha-guide');
    function render() {
      var y = +yIn.value, p = +pIn.value;
      q(el, '#ha-y-v').textContent = y + '°'; q(el, '#ha-p-v').textContent = p + '°';
      yIn.style.setProperty('--p', ((y + 45) / 90 * 100) + '%');
      pIn.style.setProperty('--p', ((p + 30) / 60 * 100) + '%');
      var cx = 260 + y * .55, cy = 218 - p * .5;
      var rx = 104, ry = 132;
      var eyeY = cy + 6 - p * .35;
      var gap = 56 - Math.abs(y) * .12;
      var far = 1 - Math.abs(y) / 150;
      var lx = cx - gap, rxs = cx + gap;
      var lScale = y > 0 ? 1 : far, rScale = y < 0 ? 1 : far;
      var noseX = cx + y * .52 + 2, noseY = cy + 46 - p * .2;
      var mouthX = cx + y * .42, mouthY = cy + 76 - p * .15;
      var earL = cx - rx - 2, earR = cx + rx + 2;
      var hairShift = y * .35;
      var html = '<defs><linearGradient id="ha-skin" x1="0" y1="140" x2="0" y2="360" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe4d9"/><stop offset=".75" stop-color="#ffe4d9"/><stop offset="1" stop-color="#f3b7b2"/></linearGradient></defs>';
      // hair back
      html += '<path d="M' + (cx - 118 + hairShift * .4) + ' ' + (cy - 120) + ' C' + (cx - 150) + ' ' + (cy - 40) + ' ' + (cx - 150) + ' ' + (cy + 60) + ' ' + (cx - 120) + ' ' + (cy + 140) + ' L' + (cx + 120) + ' ' + (cy + 140) + ' C' + (cx + 150) + ' ' + (cy + 60) + ' ' + (cx + 150) + ' ' + (cy - 40) + ' ' + (cx + 118) + ' ' + (cy - 120) + ' Z" fill="#d9c9f6" opacity=".45"/>';
      // neck
      html += '<path d="M' + (cx - 30 + y * .2) + ' ' + (cy + 108) + ' L' + (cx - 32 + y * .2) + ' ' + (cy + 160) + ' L' + (cx + 32 + y * .2) + ' ' + (cy + 160) + ' L' + (cx + 30 + y * .2) + ' ' + (cy + 108) + ' Z" fill="#f3b7b2"/>';
      // face
      html += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#ha-skin)"/>';
      // ears
      html += '<ellipse cx="' + (earL + 4) + '" cy="' + (cy + 8) + '" rx="10" ry="24" fill="#f3b7b2" opacity="' + (y > 20 ? .4 : .9) + '"/>';
      html += '<ellipse cx="' + (earR - 4) + '" cy="' + (cy + 8) + '" rx="10" ry="24" fill="#f3b7b2" opacity="' + (y < -20 ? .4 : .9) + '"/>';
      // bangs
      html += '<path d="M' + (cx - 112 + hairShift) + ' ' + (cy - 12) + ' C' + (cx - 124 + hairShift) + ' ' + (cy - 96) + ' ' + (cx - 62 + hairShift) + ' ' + (cy - 132) + ' ' + cx + ' ' + (cy - 128) + ' C' + (cx + 62 + hairShift) + ' ' + (cy - 132) + ' ' + (cx + 124 + hairShift) + ' ' + (cy - 96) + ' ' + (cx + 112 + hairShift) + ' ' + (cy - 12) + ' C' + (cx + 96 + hairShift) + ' ' + (cy - 34) + ' ' + (cx + 72 + hairShift) + ' ' + (cy - 42) + ' ' + (cx + 52 + hairShift) + ' ' + (cy - 36) + ' C' + (cx + 30 + hairShift) + ' ' + (cy - 68) + ' ' + (cx - 18 + hairShift) + ' ' + (cy - 70) + ' ' + (cx - 38 + hairShift) + ' ' + (cy - 34) + ' C' + (cx - 62 + hairShift) + ' ' + (cy - 42) + ' ' + (cx - 96 + hairShift) + ' ' + (cy - 34) + ' ' + (cx - 112 + hairShift) + ' ' + (cy - 12) + ' Z" fill="#d9c9f6"/>';
      // side locks
      html += '<path d="M' + (cx - 116 + hairShift) + ' ' + (cy - 30) + ' C' + (cx - 132) + ' ' + (cy + 50) + ' ' + (cx - 132) + ' ' + (cy + 110) + ' ' + (cx - 126) + ' ' + (cy + 150) + ' L' + (cx - 100) + ' ' + (cy + 150) + ' L' + (cx - 104) + ' ' + (cy + 40) + ' Z" fill="#c9b6ee"/>';
      html += '<path d="M' + (cx + 116 + hairShift) + ' ' + (cy - 30) + ' C' + (cx + 132) + ' ' + (cy + 50) + ' ' + (cx + 132) + ' ' + (cy + 110) + ' ' + (cx + 126) + ' ' + (cy + 150) + ' L' + (cx + 100) + ' ' + (cy + 150) + ' L' + (cx + 104) + ' ' + (cy + 40) + ' Z" fill="#c9b6ee"/>';
      // guides
      if (guide.checked) {
        html += '<line x1="' + cx + '" y1="' + (cy - ry) + '" x2="' + cx + '" y2="' + (cy + ry) + '" stroke="#7fe9ff" stroke-opacity=".45" stroke-dasharray="4 5"/>';
        html += '<line x1="' + (cx - rx) + '" y1="' + eyeY + '" x2="' + (cx + rx) + '" y2="' + eyeY + '" stroke="#7fe9ff" stroke-opacity=".35" stroke-dasharray="4 5"/>';
      }
      // eyes
      function eye(ex, ey, sc, flip) {
        var w = 26 * sc, h = 19 * sc;
        var s = '<g>';
        s += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="' + w + '" ry="' + h + '" fill="#fff8fc"/>';
        s += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="' + (w * .55) + '" ry="' + (h * .95) + '" fill="#7a4ac4"/>';
        s += '<ellipse cx="' + ex + '" cy="' + ey + '" rx="' + (w * .22) + '" ry="' + (h * .45) + '" fill="#2a1849"/>';
        s += '<circle cx="' + (ex - w * .24) + '" cy="' + (ey - h * .32) + '" r="' + (w * .16) + '" fill="#fff"/>';
        s += '<path d="M' + (ex - w) + ' ' + (ey - h * .1) + ' C' + (ex - w * .4) + ' ' + (ey - h * 1.5) + ' ' + (ex + w * .6) + ' ' + (ey - h * 1.3) + ' ' + (ex + w) + ' ' + (ey - h * .2) + '" fill="none" stroke="#402c4c" stroke-width="' + (5 * sc) + '" stroke-linecap="round"/>';
        s += '<path d="M' + (ex - w * .7) + ' ' + (ey - h * 1.9) + ' C' + (ex - w * .3) + ' ' + (ey - h * 2.2) + ' ' + (ex + w * .3) + ' ' + (ey - h * 2.2) + ' ' + (ex + w * .7) + ' ' + (ey - h * 1.9) + '" fill="none" stroke="#a68fd6" stroke-width="3.4" stroke-linecap="round"/>';
        s += '</g>';
        return s;
      }
      html += eye(lx, eyeY, lScale, 1);
      html += eye(rxs, eyeY, rScale, -1);
      // nose + mouth
      html += '<path d="M' + (noseX - 3) + ' ' + (noseY - 8) + ' C' + noseX + ' ' + (noseY + 2) + ' ' + (noseX + 5) + ' ' + (noseY + 5) + ' ' + (noseX + 9) + ' ' + (noseY + 6) + '" fill="none" stroke="#c97d86" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>';
      html += '<path d="M' + (mouthX - 12) + ' ' + mouthY + ' C' + (mouthX - 3) + ' ' + (mouthY + 8) + ' ' + (mouthX + 8) + ' ' + (mouthY + 7) + ' ' + (mouthX + 14) + ' ' + mouthY + '" fill="none" stroke="#b5626f" stroke-width="2.4" stroke-linecap="round"/>';
      html += '<ellipse cx="' + (cx - 62 + y * .4) + '" cy="' + (cy + 44) + '" rx="16" ry="7" fill="#ff8fa8" opacity=".25"/>';
      html += '<ellipse cx="' + (cx + 62 + y * .4) + '" cy="' + (cy + 44) + '" rx="16" ry="7" fill="#ff8fa8" opacity=".25"/>';
      svg.innerHTML = html;
    }
    yIn.addEventListener('input', render); pIn.addEventListener('input', render); guide.addEventListener('change', render);
    render();
  });

  /* ═══════════ 6. 头身比 ═══════════ */
  def('proportion', '头身比实验', '拖动头数，观察同一角色从 Q 版到超模的骨架变化；换姿势时先换比例。', 'FUNDAMENTALS', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split rev">' +
      '<div class="demo-panel">' +
      '<h5>头身数</h5>' +
      '<div class="ctl"><div class="ctl-label"><span>全身高度</span><b id="pr-v">6.5 头</b></div><input type="range" id="pr-h" min="2" max="8" step="0.5" value="6.5"></div>' +
      '<div class="seg sm" id="pr-preset"><button data-v="2.5">Q 版</button><button data-v="6">少年</button><button data-v="6.5" class="on">少女</button><button data-v="7.5">成女</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>记法：</b>肘≈腰、腕≈裆、膝≈4.5 头。先量头，再画关节，最后才画肌肉。</span></div>' +
      '</div>' +
      '<div class="demo-stage" style="padding:8px"><svg id="pr-svg" viewBox="0 0 460 520" style="width:100%;display:block"></svg></div>' +
      '</div></div>';
    var svg = q(el, '#pr-svg'), hIn = q(el, '#pr-h');
    function render() {
      var heads = +hIn.value;
      q(el, '#pr-v').textContent = heads + ' 头';
      hIn.style.setProperty('--p', ((heads - 2) / 6 * 100) + '%');
      var top = 40, bottom = 490, headH = (bottom - top) / heads, headW = headH * .72;
      var cx = 230;
      var bodyTop = top + headH;
      var hip = top + headH * (heads * .52);
      var knee = top + headH * (heads * .78);
      var shoulder = top + headH * 1.35;
      var elbow = top + headH * (heads * .48);
      var wrist = top + headH * (heads * .62);
      var html = '';
      // ruler
      for (var i = 0; i <= Math.floor(heads); i++) {
        var y = top + headH * i;
        html += '<line x1="40" y1="' + y + '" x2="66" y2="' + y + '" stroke="#ff8fc7" stroke-opacity="' + (i === 0 || i === Math.floor(heads) ? .6 : .25) + '"/>';
        html += '<text x="32" y="' + (y + 4) + '" text-anchor="end" fill="#9aa4c4" font-size="10" font-family="Consolas,monospace">' + i + '</text>';
      }
      html += '<line x1="40" y1="' + top + '" x2="40" y2="' + bottom + '" stroke="#ff8fc7" stroke-opacity=".3" stroke-dasharray="3 4"/>';
      // head
      html += '<ellipse cx="' + cx + '" cy="' + (top + headH * .48) + '" rx="' + (headW / 2) + '" ry="' + (headH * .46) + '" fill="#ffe4d9" fill-opacity=".15" stroke="#ffd79a" stroke-opacity=".6"/>';
      html += '<path d="M' + (cx - headW * .42) + ' ' + (top + headH * .62) + ' C' + (cx - headW * .5) + ' ' + (top + headH * .9) + ' ' + (cx - headW * .3) + ' ' + (top + headH * 1.35) + ' ' + (cx - headW * .18) + ' ' + (top + headH * 1.6) + ' L' + (cx + headW * .18) + ' ' + (top + headH * 1.6) + ' C' + (cx + headW * .3) + ' ' + (top + headH * 1.35) + ' ' + (cx + headW * .5) + ' ' + (top + headH * .9) + ' ' + (cx + headW * .42) + ' ' + (top + headH * .62) + ' Z" fill="#d9c9f6" fill-opacity=".18" stroke="#d9c9f6" stroke-opacity=".4"/>';
      // torso
      html += '<path d="M' + (cx - headW * .55) + ' ' + shoulder + ' L' + (cx - headW * .38) + ' ' + hip + ' L' + (cx + headW * .38) + ' ' + hip + ' L' + (cx + headW * .55) + ' ' + shoulder + ' Z" fill="#7fe9ff" fill-opacity=".08" stroke="#7fe9ff" stroke-opacity=".4"/>';
      // limbs
      html += '<line x1="' + (cx - headW * .5) + '" y1="' + shoulder + '" x2="' + (cx - headW * .85) + '" y2="' + elbow + '" stroke="#b9a6ff" stroke-opacity=".5" stroke-width="' + Math.max(3, headH * .11) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx - headW * .85) + '" y1="' + elbow + '" x2="' + (cx - headW * .7) + '" y2="' + wrist + '" stroke="#b9a6ff" stroke-opacity=".4" stroke-width="' + Math.max(3, headH * .09) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx + headW * .5) + '" y1="' + shoulder + '" x2="' + (cx + headW * .85) + '" y2="' + elbow + '" stroke="#b9a6ff" stroke-opacity=".5" stroke-width="' + Math.max(3, headH * .11) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx + headW * .85) + '" y1="' + elbow + '" x2="' + (cx + headW * .7) + '" y2="' + wrist + '" stroke="#b9a6ff" stroke-opacity=".4" stroke-width="' + Math.max(3, headH * .09) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx - headW * .2) + '" y1="' + hip + '" x2="' + (cx - headW * .22) + '" y2="' + knee + '" stroke="#ff8fc7" stroke-opacity=".5" stroke-width="' + Math.max(3, headH * .13) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx - headW * .22) + '" y1="' + knee + '" x2="' + (cx - headW * .2) + '" y2="' + bottom + '" stroke="#ff8fc7" stroke-opacity=".4" stroke-width="' + Math.max(3, headH * .11) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx + headW * .2) + '" y1="' + hip + '" x2="' + (cx + headW * .22) + '" y2="' + knee + '" stroke="#ff8fc7" stroke-opacity=".5" stroke-width="' + Math.max(3, headH * .13) + '" stroke-linecap="round"/>';
      html += '<line x1="' + (cx + headW * .22) + '" y1="' + knee + '" x2="' + (cx + headW * .2) + '" y2="' + bottom + '" stroke="#ff8fc7" stroke-opacity=".4" stroke-width="' + Math.max(3, headH * .11) + '" stroke-linecap="round"/>';
      // joints
      [[cx - headW * .5, shoulder], [cx - headW * .85, elbow], [cx + headW * .5, shoulder], [cx + headW * .85, elbow], [cx, hip], [cx - headW * .21, knee], [cx + headW * .21, knee]].forEach(function (p) {
        html += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#0a0d19" stroke="#7fe9ff" stroke-opacity=".6" stroke-width="1.5"/>';
      });
      // labels
      html += '<text x="300" y="' + (shoulder - 8) + '" fill="#9aa4c4" font-size="10">肩 ' + (1.4).toFixed(1) + ' 头</text>';
      html += '<text x="300" y="' + (elbow - 8) + '" fill="#9aa4c4" font-size="10">肘 ' + (heads * .48).toFixed(1) + ' 头</text>';
      html += '<text x="300" y="' + (hip - 8) + '" fill="#9aa4c4" font-size="10">胯 ' + (heads * .52).toFixed(1) + ' 头</text>';
      html += '<text x="300" y="' + (knee - 8) + '" fill="#9aa4c4" font-size="10">膝 ' + (heads * .78).toFixed(1) + ' 头</text>';
      svg.innerHTML = html;
    }
    hIn.addEventListener('input', function () {
      qa(el, '#pr-preset button').forEach(function (x) { x.classList.remove('on'); });
      render();
    });
    qa(el, '#pr-preset button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#pr-preset button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); hIn.value = b.getAttribute('data-v'); render();
      });
    });
    render();
  });

})();
