/* ═══════════════════════════════════════════════════════════════
   DEMOS 3 · Live2D / 接稿 / 审稿 / 迷思 / 练习
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.DEMOS = window.DEMOS || {};
  function def(id, title, desc, tag, fn) { window.DEMOS[id] = { title: title, desc: desc, tag: tag, mount: fn }; }
  function q(root, s) { return root.querySelector(s); }
  function qa(root, s) { return Array.prototype.slice.call(root.querySelectorAll(s)); }

  /* ═══════════ 1. Live2D 参数面板 ═══════════ */
  def('live2d-params', 'Live2D 参数面板', '拖动角度、眼睛、嘴巴与呼吸，观察一个“平面角色”如何被参数驱动。', 'LIVE2D · PARAMS', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split rev">' +
      '<div class="demo-panel">' +
      '<h5>头部角度</h5>' +
      '<div class="ctl"><div class="ctl-label"><span>X 左右</span><b id="lp-x-v">0°</b></div><input type="range" id="lp-x" min="-30" max="30" value="0"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>Y 上下</span><b id="lp-y-v">0°</b></div><input type="range" id="lp-y" min="-25" max="25" value="0"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>Z 倾斜</span><b id="lp-z-v">0°</b></div><input type="range" id="lp-z" min="-20" max="20" value="0"></div>' +
      '<h5>表情</h5>' +
      '<div class="ctl"><div class="ctl-label"><span>左眼开合</span><b id="lp-el-v">100%</b></div><input type="range" id="lp-el" min="0" max="100" value="100"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>右眼开合</span><b id="lp-er-v">100%</b></div><input type="range" id="lp-er" min="0" max="100" value="100"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>嘴张开</span><b id="lp-m-v">12%</b></div><input type="range" id="lp-m" min="0" max="100" value="12"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>呼吸</span><b id="lp-b-v">50%</b></div><input type="range" id="lp-b" min="0" max="100" value="50"></div>' +
      '<div class="demo-toolbar"><button class="demo-btn primary" id="lp-blink">眨一次眼</button><button class="demo-btn" id="lp-reset">复位</button></div>' +
      '</div>' +
      '<div class="demo-stage" style="padding:8px">' +
      `<svg id="lp-svg" viewBox="0 0 520 500" style="width:100%;display:block">
<defs>
<linearGradient id="lp-hair" x1="0" y1="60" x2="0" y2="500" gradientUnits="userSpaceOnUse"><stop stop-color="#f5efff"/><stop offset=".35" stop-color="#d9c9f6"/><stop offset="1" stop-color="#a68fd6"/></linearGradient>
<linearGradient id="lp-skin" x1="0" y1="100" x2="0" y2="360" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe4d9"/><stop offset=".8" stop-color="#ffe4d9"/><stop offset="1" stop-color="#f3b7b2"/></linearGradient>
<linearGradient id="lp-iris" x1="0" y1="246" x2="0" y2="292" gradientUnits="userSpaceOnUse"><stop stop-color="#7a4ac4"/><stop offset=".55" stop-color="#7a4ac4"/><stop offset=".8" stop-color="#ff9cc4"/><stop offset="1" stop-color="#ff9cc4"/></linearGradient>
<linearGradient id="lp-cloth" x1="0" y1="400" x2="0" y2="500" gradientUnits="userSpaceOnUse"><stop stop-color="#414d80"/><stop offset=".4" stop-color="#2b3560"/><stop offset="1" stop-color="#1a2143"/></linearGradient>
</defs>
<g id="lp-body">
<path d="M110 500 C140 432 190 410 260 410 C330 410 380 432 410 500 Z" fill="url(#lp-cloth)"/>
<path d="M232 344 L232 420 C246 432 274 432 288 420 L288 344 Z" fill="#f3b7b2"/>
<path d="M236 404 C248 418 272 418 284 404 C280 424 272 432 260 432 C248 432 240 424 236 404 Z" fill="#c97d86" opacity=".35"/>
<path d="M238 406 C246 394 254 390 260 390 C266 390 274 394 282 406 C272 416 248 416 238 406 Z" fill="#f7f2ff"/>
<path d="M238 406 C246 394 254 390 260 390 C266 390 274 394 282 406" fill="none" stroke="#402c4c" stroke-opacity=".35" stroke-width="1.6"/>
</g>
<g id="lp-head">
<path d="M260 60 C190 60 144 116 140 196 C136 260 124 320 110 380 C100 422 108 458 140 482 L380 482 C412 458 420 422 410 380 C396 320 384 260 380 196 C376 116 330 60 260 60 Z" fill="url(#lp-hair)"/>
<path d="M260 74 C198 74 156 122 150 194 C146 248 136 304 124 360 C116 400 120 436 142 460 C200 478 320 478 378 460 C400 436 404 400 396 360 C384 304 374 248 370 194 C364 122 322 74 260 74 Z" fill="url(#lp-hair)" opacity=".55"/>
<ellipse cx="182" cy="246" rx="12" ry="26" fill="#f3b7b2"/>
<ellipse cx="338" cy="246" rx="12" ry="26" fill="#f3b7b2"/>
<path d="M260 108 C214 108 184 146 182 202 C180 250 190 290 212 320 C228 340 246 350 260 350 C274 350 292 340 308 320 C330 290 340 250 338 202 C336 146 306 108 260 108 Z" fill="url(#lp-skin)"/>
<path d="M180 216 C192 226 204 230 216 228 C228 226 240 228 252 234 C264 240 278 240 290 234 C302 228 316 226 328 230 C336 232 344 228 352 222 L356 238 C344 248 330 250 314 246 C302 243 290 246 280 252 C270 258 254 258 242 252 C230 246 216 244 204 248 C192 252 184 250 176 244 Z" fill="#f3b7b2" opacity=".85"/>
<path d="M260 86 C210 86 174 116 166 158 C160 188 164 218 172 242 L188 252 L202 242 L216 256 L234 246 L250 254 L266 244 L282 254 L300 244 L314 256 L330 242 L344 252 L356 240 C364 216 366 188 360 158 C350 116 310 86 260 86 Z" fill="url(#lp-hair)"/>
<path d="M236 96 C224 138 218 182 220 230" fill="none" stroke="#a68fd6" stroke-width="1.5" opacity=".4"/>
<path d="M260 90 L260 234" fill="none" stroke="#a68fd6" stroke-width="1.3" opacity=".3"/>
<path d="M284 96 C296 138 302 182 300 230" fill="none" stroke="#a68fd6" stroke-width="1.5" opacity=".4"/>
<path d="M210 112 C198 152 194 192 196 230" fill="none" stroke="#a68fd6" stroke-width="1.3" opacity=".3"/>
<path d="M310 112 C322 152 326 192 324 230" fill="none" stroke="#a68fd6" stroke-width="1.3" opacity=".3"/>
<path d="M286 74 C278 52 288 32 306 26 C296 44 298 58 308 70 C300 66 292 70 286 74 Z" fill="#f5efff"/>
<path d="M194 176 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#ffd79a"/>
<path d="M180 200 C168 262 164 332 168 402 C170 426 174 446 180 462 C192 470 206 466 214 456 C204 382 204 302 210 232 Z" fill="url(#lp-hair)"/>
<path d="M340 200 C352 262 356 332 352 402 C350 426 346 446 340 462 C328 470 314 466 306 456 C316 382 316 302 310 232 Z" fill="url(#lp-hair)"/>
<path d="M186 214 C182 258 181 300 185 336 C192 314 198 282 200 244 Z" fill="#a68fd6" opacity=".35"/>
<path d="M334 214 C338 258 339 300 335 336 C328 314 322 282 320 244 Z" fill="#a68fd6" opacity=".35"/>
<g id="lp-eyeL">
<path d="M190 268 C194 248 210 238 228 240 C242 242 250 252 252 268 C248 282 240 290 228 292 C212 294 196 284 190 268 Z" fill="#fff8fc"/>
<ellipse cx="218" cy="268" rx="16.5" ry="20" fill="url(#lp-iris)"/>
<ellipse cx="218" cy="262" rx="15" ry="10" fill="#2a1849" opacity=".38"/>
<ellipse cx="218" cy="270" rx="6.5" ry="8" fill="#2a1849"/>
<circle cx="212" cy="259" r="5" fill="#fff"/>
<circle cx="224" cy="278" r="2.4" fill="#fff" opacity=".85"/>
<path d="M188 266 C192 246 210 236 230 239 C244 241 252 250 254 266" fill="none" stroke="#402c4c" stroke-width="5.2" stroke-linecap="round"/>
<path d="M188 284 C196 292 208 296 220 294" fill="none" stroke="#402c4c" stroke-width="1.6" opacity=".4"/>
</g>
<g id="lp-eyeR">
<path d="M330 268 C326 248 310 238 292 240 C278 242 270 252 268 268 C272 282 280 290 292 292 C308 294 324 284 330 268 Z" fill="#fff8fc"/>
<ellipse cx="302" cy="268" rx="16.5" ry="20" fill="url(#lp-iris)"/>
<ellipse cx="302" cy="262" rx="15" ry="10" fill="#2a1849" opacity=".38"/>
<ellipse cx="302" cy="270" rx="6.5" ry="8" fill="#2a1849"/>
<circle cx="296" cy="259" r="5" fill="#fff"/>
<circle cx="308" cy="278" r="2.4" fill="#fff" opacity=".85"/>
<path d="M332 266 C328 246 310 236 290 239 C276 241 268 250 266 266" fill="none" stroke="#402c4c" stroke-width="5.2" stroke-linecap="round"/>
<path d="M332 284 C324 292 312 296 300 294" fill="none" stroke="#402c4c" stroke-width="1.6" opacity=".4"/>
</g>
<path d="M196 226 C210 218 228 217 242 223" fill="none" stroke="#7b64ae" stroke-width="3.4" stroke-linecap="round"/>
<path d="M324 226 C310 218 292 217 278 223" fill="none" stroke="#7b64ae" stroke-width="3.4" stroke-linecap="round"/>
<path d="M262 300 C265 306 268 309 272 310" fill="none" stroke="#c97d86" stroke-width="2" stroke-linecap="round" opacity=".6"/>
<g id="lp-mouth"><path d="M246 326 C252 332 266 332 274 324" fill="none" stroke="#b5626f" stroke-width="2.6" stroke-linecap="round"/><path d="M248 328 C254 340 266 340 272 326 Z" fill="#b5626f" opacity=".35"/></g>
<ellipse cx="200" cy="292" rx="17" ry="7" fill="#ff8fa8" opacity=".22"/>
<ellipse cx="320" cy="292" rx="17" ry="7" fill="#ff8fa8" opacity=".22"/>
<path d="M238 128 C226 144 220 166 222 188" fill="none" stroke="#a68fd6" stroke-width="1.4" opacity=".35"/>
<path d="M282 128 C294 144 300 166 298 188" fill="none" stroke="#a68fd6" stroke-width="1.4" opacity=".35"/>
<path d="M260 120 L260 210" fill="none" stroke="#a68fd6" stroke-width="1.2" opacity=".25"/>
</g>
<g id="lp-mesh" opacity="0" stroke="#5fe0d0" stroke-width=".8" fill="none">
<path d="M140 196 C200 230 320 230 380 196 M140 340 C200 370 320 370 380 340 M260 108 L260 350 M182 202 C210 250 310 250 338 202 M190 268 L330 268 M218 240 L218 296 M302 240 L302 296"/>
<path d="M190 180 L260 220 L330 180 L310 290 L260 310 L210 290 Z"/>
</g>
</svg>` + '</div>' +
      '</div></div>';
    var sl = {
      x: q(el, '#lp-x'), y: q(el, '#lp-y'), z: q(el, '#lp-z'),
      el: q(el, '#lp-el'), er: q(el, '#lp-er'), m: q(el, '#lp-m'), b: q(el, '#lp-b')
    };
    var head = q(el, '#lp-head'), body = q(el, '#lp-body');
    var eyeL = q(el, '#lp-eyeL'), eyeR = q(el, '#lp-eyeR'), mouth = q(el, '#lp-mouth');
    var mesh = q(el, '#lp-mesh');
    var t = 0, breathing = true, blinkT = -1;
    function render() {
      var ax = +sl.x.value, ay = +sl.y.value, az = +sl.z.value;
      var eL = +sl.el.value / 100, eR = +sl.er.value / 100, m = +sl.m.value / 100, br = +sl.b.value / 100;
      q(el, '#lp-x-v').textContent = ax + '°'; q(el, '#lp-y-v').textContent = ay + '°'; q(el, '#lp-z-v').textContent = az + '°';
      q(el, '#lp-el-v').textContent = Math.round(eL * 100) + '%'; q(el, '#lp-er-v').textContent = Math.round(eR * 100) + '%';
      q(el, '#lp-m-v').textContent = Math.round(m * 100) + '%'; q(el, '#lp-b-v').textContent = Math.round(br * 100) + '%';
      var breathY = Math.sin(t) * (2 + br * 4);
      head.setAttribute('transform', 'translate(' + (ax * .9) + ' ' + (ay * .4 + breathY * -.4) + ') rotate(' + (az * .35) + ' 260 300)');
      body.setAttribute('transform', 'translate(0 ' + (breathY * .5) + ')');
      var farL = ax > 0 ? 1 - ax / 90 : 1;
      var farR = ax < 0 ? 1 + ax / 90 : 1;
      eyeL.setAttribute('transform', 'translate(' + (ax * .45) + ' 0) translate(220 268) scale(' + farL + ' ' + Math.max(.02, eL) + ') translate(-220 -268)');
      eyeR.setAttribute('transform', 'translate(' + (ax * .45) + ' 0) translate(300 268) scale(' + farR + ' ' + Math.max(.02, eR) + ') translate(-300 -268)');
      mouth.setAttribute('transform', 'translate(0 ' + (m * 2) + ') translate(260 328) scale(1 ' + (.35 + m * 1.5) + ') translate(-260 -328)');
      [sl.x, sl.y, sl.z, sl.el, sl.er, sl.m, sl.b].forEach(function (s) {
        s.style.setProperty('--p', ((+s.value - +s.min) / (+s.max - +s.min) * 100) + '%');
      });
    }
    function tick() {
      if (!el.isConnected) return;
      t += .03;
      render();
      requestAnimationFrame(tick);
    }
    [sl.x, sl.y, sl.z, sl.el, sl.er, sl.m, sl.b].forEach(function (s) { s.addEventListener('input', render); });
    q(el, '#lp-blink').addEventListener('click', function () {
      var start = performance.now();
      function blink(now) {
        var p = (now - start) / 420;
        var v = p < .5 ? 1 - p * 2 : (p - .5) * 2;
        v = Math.max(.03, Math.min(1, v));
        sl.el.value = sl.er.value = Math.round(v * 100);
        render();
        if (p < 1) requestAnimationFrame(blink);
      }
      requestAnimationFrame(blink);
    });
    q(el, '#lp-reset').addEventListener('click', function () {
      sl.x.value = 0; sl.y.value = 0; sl.z.value = 0; sl.el.value = 100; sl.er.value = 100; sl.m.value = 12; sl.b.value = 50; render();
    });
    // mesh toggle via double click
    q(el, '#lp-svg').addEventListener('dblclick', function () {
      mesh.setAttribute('opacity', mesh.getAttribute('opacity') === '1' ? '0' : '1');
    });
    tick();
  });

  /* ═══════════ 2. Live2D 头发物理 ═══════════ */
  def('live2d-hair', '头发物理：惯性、阻尼与滞后', '拖动角色头部，观察发丝如何被“拖”着走。调刚度与阻尼，找到自然的摆动。', 'LIVE2D · PHYSICS', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-stage" style="padding:8px"><canvas id="lh-canvas" style="width:100%;height:360px;touch-action:none;cursor:grab;border-radius:10px"></canvas></div>' +
      '<div class="demo-panel">' +
      '<div class="ctl"><div class="ctl-label"><span>刚度</span><b id="lh-k-v">0.55</b></div><input type="range" id="lh-k" min="10" max="95" value="55"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>阻尼</span><b id="lh-d-v">0.06</b></div><input type="range" id="lh-d" min="1" max="30" value="6"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>重力</span><b id="lh-g-v">0.35</b></div><input type="range" id="lh-g" min="0" max="100" value="35"></div>' +
      '<div class="ctl"><div class="ctl-label"><span>风力</span><b id="lh-w-v">0.10</b></div><input type="range" id="lh-w" min="0" max="100" value="10"></div>' +
      '<div class="demo-toolbar"><button class="demo-btn primary" id="lh-shake">摇一摇</button><button class="demo-btn" id="lh-reset">复位</button></div>' +
      '<div class="demo-caption"><span class="dot"></span><span><b>原则：</b>发根跟随头部，发梢滞后；刚度越低越软，阻尼越低越晃。</span></div>' +
      '</div></div></div>';
    var cv = q(el, '#lh-canvas'), ctx = cv.getContext('2d');
    var kIn = q(el, '#lh-k'), dIn = q(el, '#lh-d'), gIn = q(el, '#lh-g'), wIn = q(el, '#lh-w');
    var W = 0, H = 0, dpr = 1;
    var headX = 320, targetX = 320, headY = 130, t = 0;
    var strands = [];
    function initStrands() {
      strands = [];
      var roots = [-56, -36, -16, 6, 28, 50];
      roots.forEach(function (dx, i) {
        var pts = [];
        for (var j = 0; j < 7; j++) pts.push({ x: 320 + dx, y: headY + 40 + j * 34, px: 320 + dx, py: headY + 40 + j * 34 });
        strands.push({ pts: pts, rootDx: dx, len: 36 + (i % 3) * 5, w: 10 - Math.abs(i - 2.5) * 1.3, col: i % 2 ? 'rgba(186,166,255,.75)' : 'rgba(217,201,246,.85)' });
      });
    }
    function fit() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var bg = ctx.createRadialGradient(W / 2, 90, 10, W / 2, 120, 300);
      bg.addColorStop(0, 'rgba(185,166,255,.08)'); bg.addColorStop(1, 'rgba(10,13,25,0)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // strands behind
      strands.forEach(function (s) {
        ctx.beginPath();
        ctx.moveTo(s.pts[0].x, s.pts[0].y);
        for (var i = 1; i < s.pts.length - 1; i++) {
          var mx = (s.pts[i].x + s.pts[i + 1].x) / 2, my = (s.pts[i].y + s.pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(s.pts[i].x, s.pts[i].y, mx, my);
        }
        ctx.strokeStyle = s.col; ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.globalAlpha = .65; ctx.stroke();
      });
      ctx.globalAlpha = 1;
      // head
      ctx.save(); ctx.translate(headX, headY);
      ctx.fillStyle = '#1a1f33'; ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 74, 88, 0, 0, 6.283); ctx.fill(); ctx.stroke();
      // face hint
      ctx.fillStyle = '#ffe4d9'; ctx.beginPath(); ctx.ellipse(0, 8, 54, 64, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#7a4ac4'; ctx.beginPath(); ctx.ellipse(-20, 12, 9, 12, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(20, 12, 9, 12, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-23, 7, 3, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(17, 7, 3, 0, 6.283); ctx.fill();
      ctx.strokeStyle = '#b5626f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 34, 10, .2, Math.PI - .2); ctx.stroke();
      // bangs
      ctx.fillStyle = '#d9c9f6'; ctx.beginPath(); ctx.ellipse(0, -26, 60, 40, 0, Math.PI, 0); ctx.fill();
      ctx.restore();
      // strands front (draw again thin highlights)
      strands.slice(0, 3).forEach(function (s) {
        ctx.beginPath(); ctx.moveTo(s.pts[0].x, s.pts[0].y);
        for (var i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
        ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2; ctx.stroke();
      });
      // drag hint
      ctx.fillStyle = 'rgba(154,164,196,.5)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('按住左右拖动头部', W / 2, H - 18);
    }
    function step() {
      if (!cv.isConnected) return;
      t += .016;
      var k = +kIn.value / 100, damp = +dIn.value / 100, grav = +gIn.value / 100, wind = +wIn.value / 100;
      headX += (targetX - headX) * .12;
      strands.forEach(function (s, si) {
        var pts = s.pts;
        pts[0].x = headX + s.rootDx; pts[0].y = headY + 42;
        pts[0].px = pts[0].x; pts[0].py = pts[0].y;
        for (var i = 1; i < pts.length; i++) {
          var p = pts[i];
          var vx = (p.x - p.px) * (1 - damp), vy = (p.y - p.py) * (1 - damp);
          p.px = p.x; p.py = p.y;
          p.x += vx + Math.sin(t * 1.6 + i * .5 + si) * wind * .32;
          p.y += vy + grav * (2.4 + i * .25);
        }
        for (var it = 0; it < 3; it++) {
          for (var j = 1; j < pts.length; j++) {
            var a = pts[j - 1], b = pts[j];
            var dx = b.x - a.x, dy = b.y - a.y;
            var d = Math.sqrt(dx * dx + dy * dy) || 1;
            var diff = (d - s.len) / d * (0.35 + k * .5);
            b.x -= dx * diff; b.y -= dy * diff;
          }
        }
      });
      draw();
      requestAnimationFrame(step);
    }
    var dragging = false, dragStart = 0;
    cv.addEventListener('pointerdown', function (e) { dragging = true; var r = cv.getBoundingClientRect(); dragStart = e.clientX - targetX; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) { if (!dragging) return; targetX = Math.max(80, Math.min(W - 80, e.clientX - dragStart)); });
    cv.addEventListener('pointerup', function () { dragging = false; });
    cv.addEventListener('pointercancel', function () { dragging = false; });
    q(el, '#lh-shake').addEventListener('click', function () {
      var start = performance.now(), base = targetX;
      function shake(now) {
        var p = (now - start) / 900;
        targetX = base + Math.sin(p * Math.PI * 6) * 90 * (1 - p);
        if (p < 1) requestAnimationFrame(shake); else targetX = base;
      }
      requestAnimationFrame(shake);
    });
    q(el, '#lh-reset').addEventListener('click', function () { targetX = headX = W / 2; initStrands(); });
    [kIn, dIn, gIn, wIn].forEach(function (s) {
      s.addEventListener('input', function () {
        q(el, '#lh-k-v').textContent = (+kIn.value / 100).toFixed(2);
        q(el, '#lh-d-v').textContent = (+dIn.value / 100).toFixed(2);
        q(el, '#lh-g-v').textContent = (+gIn.value / 100).toFixed(2);
        q(el, '#lh-w-v').textContent = (+wIn.value / 100).toFixed(2);
        s.style.setProperty('--p', ((+s.value - +s.min) / (+s.max - +s.min) * 100) + '%');
      });
    });
    window.addEventListener('resize', function () { fit(); initStrands(); });
    fit(); initStrands();
    targetX = headX = W / 2;
    step();
  });

  /* ═══════════ 3. 报价计算器 ═══════════ */
  def('pricing-calc', '报价计算器', '选类型、复杂度、用途与加急，观察报价构成。金额、系数、预付款和交期均为教学示例，不是市场统一标准。', 'COMMISSION', function (el) {
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-panel" style="gap:14px">' +
      '<h5>稿件类型</h5><div class="seg" id="pc-type">' +
      '<button data-v="400" data-n="头像" class="on">头像</button><button data-v="700" data-n="半身">半身</button><button data-v="1200" data-n="立绘">立绘</button><button data-v="1600" data-n="插画">插画</button></div>' +
      '<h5>复杂度</h5><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">' +
      '<label class="chk"><input type="checkbox" data-add="400">背景 +¥400</label>' +
      '<label class="chk"><input type="checkbox" data-mul="1.5">多人 ×1.5</label>' +
      '<label class="chk"><input type="checkbox" data-add="200">复杂道具 +¥200</label>' +
      '<label class="chk"><input type="checkbox" data-add="300">特效 +¥300</label></div>' +
      '<h5>授权范围</h5><div class="seg" id="pc-use">' +
      '<button data-v="1" class="on">个人</button><button data-v="2">商用 ×2</button><button data-v="4">买断 ×4</button></div>' +
      '<h5>其他</h5><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">' +
      '<label class="chk"><input type="checkbox" id="pc-rush">加急 +30%</label>' +
      '<label class="chk"><input type="checkbox" id="pc-rev">额外修改 +¥80</label></div>' +
      '</div>' +
      '<div class="demo-panel" style="align-content:start">' +
      '<h5>报价明细</h5><div id="pc-lines" style="display:grid;gap:8px;font-size:11px;color:var(--ink-3)"></div>' +
      '<div style="height:1px;background:var(--line);margin:4px 0"></div>' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between"><span style="font-size:11px;color:var(--ink-4)">总价</span><b id="pc-total" style="font-family:var(--serif);font-size:32px;color:var(--gold);font-weight:600">¥700</b></div>' +
      '<div class="stat-grid"><div class="stat"><small>预付款 30%</small><b id="pc-dep">¥210</b></div><div class="stat"><small>尾款</small><b id="pc-rest">¥490</b></div></div>' +
      '<details><summary>查看报价文案</summary><pre id="pc-preview" style="white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8"></pre></details>' +
      '<button class="demo-btn primary" id="pc-copy" style="justify-content:center">复制报价文案</button>' +
      '<div class="demo-caption"><span class="dot"></span><span>系数仅用于演算。授权需写具体范围；预付款不同于法律上的定金，取消规则另约。</span></div>' +
      '</div></div></div>';
    var base = 400, typeName = '头像', use = 1;
    function calc() {
      var adds = 0, mul = 1;
      qa(el, '[data-add]').forEach(function (c) { if (c.checked) adds += +c.getAttribute('data-add'); });
      qa(el, '[data-mul]').forEach(function (c) { if (c.checked) mul *= +c.getAttribute('data-mul'); });
      var sub = base * mul + adds;
      var rush = q(el, '#pc-rush').checked ? sub * .3 : 0;
      var rev = q(el, '#pc-rev').checked ? 80 : 0;
      var total = Math.round((sub + rush + rev) * use);
      var lines = [
        ['基础 · ' + typeName, '¥' + base],
        ['复杂度系数', '×' + mul.toFixed(2)],
        ['附加项', '+¥' + adds],
        ['加急', '+¥' + Math.round(rush)],
        ['额外修改', '+¥' + rev],
        ['授权', '×' + use]
      ];
      q(el, '#pc-lines').innerHTML = lines.map(function (l) {
        return '<div style="display:flex;justify-content:space-between"><span>' + l[0] + '</span><span style="color:var(--ink-2);font-family:var(--mono)">' + l[1] + '</span></div>';
      }).join('');
      q(el, '#pc-total').textContent = '¥' + total;
      q(el, '#pc-dep').textContent = '¥' + Math.round(total * .3);
      q(el, '#pc-rest').textContent = '¥' + Math.round(total * .7);
      q(el, '#pc-preview').textContent = quoteText(total);
      return { total: total, lines: lines };
    }
    function quoteText(total) {
      var scope = use === 1 ? '个人使用（具体范围待确认）' : use === 2 ? '商业使用（用途/媒介/期限/地域待确认）' : '独占许可或权利转让（逐项另约）';
      return '【教学报价示例，需按项目修改】\n类型：' + typeName + '\n总价：¥' + total + '（示例预付款 30%：¥' + Math.round(total * .3) + '）\n包含：草图/线稿/上色 三次确认\n修改：草稿阶段 2 次，线稿后 1 次（示例）\n交付：PNG + 分层 PSD，长边 3000px（待需求确认）\n授权：' + scope + '\n周期：待双方确认\n取消、阶段结算与退款：另行约定';
    }
    qa(el, '#pc-type button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#pc-type button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); base = +b.getAttribute('data-v'); typeName = b.getAttribute('data-n'); calc();
      });
    });
    qa(el, '#pc-use button').forEach(function (b) {
      b.addEventListener('click', function () {
        qa(el, '#pc-use button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); use = +b.getAttribute('data-v'); calc();
      });
    });
    qa(el, 'input[type=checkbox]').forEach(function (c) { c.addEventListener('change', calc); });
    q(el, '#pc-copy').addEventListener('click', function () {
      var r = calc();
      var txt = quoteText(r.total);
      var copyButton = q(el, '#pc-copy');
      if (!navigator.clipboard || !navigator.clipboard.writeText) { copyButton.textContent = '当前环境无法复制，请通过本地服务器打开'; return; }
      navigator.clipboard.writeText(txt).then(function () {
        copyButton.textContent = '已复制';
        setTimeout(function () { copyButton.textContent = '复制报价文案'; }, 1500);
      }).catch(function () { copyButton.textContent = '复制未成功，请检查浏览器权限'; });
    });
    calc();
  });

  /* ═══════════ 4. R18 审稿清单 ═══════════ */
  def('r18-check', 'R18 审稿清单', '逐项核对。红线项不过，就不进入制作；全部通过也不等于平台一定放行。', 'REVIEW', function (el) {
    var items = [
      { t: '角色设定明确为 18 岁以上成年人', red: true },
      { t: '画面中所有角色均成年，无幼态性征', red: true },
      { t: '不涉及真实人物、真人换脸或深度伪造', red: true },
      { t: '双方自愿，无胁迫、迷药、权力压迫的美化', red: true },
      { t: '不含未成年人、校园制服 + 性行为的组合', red: true },
      { t: '不承接课程拒稿边界中的极端性内容，并单独核对法律', red: true },
      { t: '已核对发布平台的成人内容政策', red: false },
      { t: '需要年龄门/内容警告的已正确标注', red: false },
      { t: '商用/委托已获得明确授权与用途说明', red: false },
      { t: '构图不越过平台“露骨”标准，遮挡有设计', red: false },
      { t: '保留沟通记录、版本文件与确认截图', red: false },
      { t: '如跨境发布，已核对当地法律差异', red: false }
    ];
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-panel" style="gap:7px">' + items.map(function (it, i) {
        return '<label class="chk" data-i="' + i + '"><input type="checkbox" data-red="' + (it.red ? 1 : 0) + '"><span>' + (it.red ? '<b style="color:var(--rose)">红线</b> · ' : '') + it.t + '</span></label>';
      }).join('') + '</div>' +
      '<div class="demo-panel" style="align-content:start">' +
      '<h5>审稿结论</h5>' +
      '<div style="text-align:center;padding:12px 0"><div id="rc-score" style="font-family:var(--serif);font-size:46px;color:var(--rose);line-height:1">0</div><div style="font-size:10px;letter-spacing:.16em;color:var(--ink-4)">PASS ITEMS</div></div>' +
      '<div class="meter"><i id="rc-bar" style="width:0%;background:var(--rose)"></i></div>' +
      '<div id="rc-verdict" class="demo-caption" style="margin-top:8px"><span class="dot"></span><span>先勾选左侧项目，系统给出结论。</span></div>' +
      '<div class="demo-note" style="border-top:1px solid var(--line);padding-top:10px">本清单是职业自查工具，不构成法律意见；最终以平台规则与所在地法律为准。</div>' +
      '</div></div></div>';
    function update() {
      var boxes = qa(el, 'input[type=checkbox]');
      var checked = boxes.filter(function (b) { return b.checked; }).length;
      var redMiss = boxes.some(function (b) { return b.getAttribute('data-red') === '1' && !b.checked; });
      q(el, '#rc-score').textContent = checked + '/' + boxes.length;
      q(el, '#rc-score').style.color = redMiss ? 'var(--rose)' : (checked === boxes.length ? 'var(--mint)' : 'var(--gold)');
      q(el, '#rc-bar').style.width = (checked / boxes.length * 100) + '%';
      q(el, '#rc-bar').style.background = redMiss ? 'var(--rose)' : (checked === boxes.length ? 'var(--mint)' : 'var(--gold)');
      var v = q(el, '#rc-verdict');
      if (redMiss) v.innerHTML = '<span class="dot" style="background:var(--rose);box-shadow:0 0 8px var(--rose)"></span><span><b style="color:var(--rose)">停止：红线未通过。</b>需要修改设定、构图或直接拒稿；不要抱着“应该没事”的心态交付。</span>';
      else if (checked < boxes.length) v.innerHTML = '<span class="dot" style="background:var(--gold);box-shadow:0 0 8px var(--gold)"></span><span><b style="color:var(--gold)">待补：</b>还有 ' + (boxes.length - checked) + ' 项未确认，补齐后再进入制作/发布。</span>';
      else v.innerHTML = '<span class="dot" style="background:var(--mint);box-shadow:0 0 8px var(--mint)"></span><span><b style="color:var(--mint)">可进入下一步：</b>红线与流程项均已确认；仍需平台复核与年龄门设置。</span>';
    }
    qa(el, 'input[type=checkbox]').forEach(function (b) {
      b.addEventListener('change', function () {
        b.closest('.chk').classList.toggle('on', b.checked); update();
      });
    });
    update();
  });

  /* ═══════════ 5. 迷思测验 ═══════════ */
  def('myth-quiz', '迷思测验', '10 个常见说法，判断真假。答错会给出解释，不扣分。', 'QUIZ', function (el) {
    var qs = [
      { q: '必须从传统素描练三年，才能开始画二次元。', a: false, e: '不必。观察、比较与空间可用多种练习训练；可画目标题材同时补缺口，具体路径按目标与条件选择。' },
      { q: '学插画必须买很多书。', a: false, e: '不必先买书。按当前问题选合法资源，试读、跟做并得到反馈；没有固定三本或两年够用的承诺。' },
      { q: '成年后开始，仍有可能通过学习与练习提升绘画能力。', a: true, e: '起点、练习、反馈与目标都会影响结果；不能用年龄或固定年限保证接稿。' },
      { q: '临摹一张图并发布，只要标注“临摹”就不算侵权。', a: false, e: '标注来源不等于获得授权。练习、发布与商业使用都应核对相应许可与规则；非商业或标注来源不是通用豁免。' },
      { q: '赛璐璐只能有平涂和一层阴影，不能增加其他层次。', a: false, e: '赛璐璐需要组织形状、边缘和层级；底色加一阴可以成立，也可按任务增加二阴、高光等，不是固定层数。' },
      { q: '所有场景的阴影色都可统一把底色变暗，不必考虑光源、环境或材质。', a: false, e: '阴影色由光源、环境、材质和设计共同决定。仅变暗可用于某些简化方案；偏色不是必选公式，先检查明暗分组与阴影形状。' },
      { q: 'Live2D 是画完之后才需要考虑的事。', a: false, e: '分层、遮挡、可动范围在画图阶段就要规划；画完再拆层，返工成本极高。' },
      { q: 'AI 出现后，学画画没有意义了。', a: false, e: '是否学习取决于目标。若希望独立观察、设计、绘制和修改，生成一张图不能代替这些能力的练习与验收。' },
      { q: '接稿报价应该按“市场最低价”来，才有单。', a: false, e: '低于可持续成本可能造成履约压力，但不能由报价推断客户品行。先算时薪与成本，再给三档报价。' },
      { q: 'R18 稿件只要角色设定写“18 岁”就安全了。', a: false, e: '年龄设定只是其中一项。存在未成年或儿童化性化表征时拒稿，有疑义就暂停；不能靠修改脸型、比例或服装来规避。还要核对具体法律与平台要求。' }
    ];
    el.innerHTML = '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-panel"><div style="font-size:10px;color:var(--ink-4);letter-spacing:.1em">QUESTION <span id="mq-idx">1</span> / ' + qs.length + '</div>' +
      '<div id="mq-q" style="font-size:15px;line-height:1.7;color:var(--ink);min-height:72px">' + qs[0].q + '</div>' +
      '<div class="quiz-opts"><button class="quiz-opt" data-a="1"><span class="qk">T</span>真的</button><button class="quiz-opt" data-a="0"><span class="qk">F</span>假的</button></div>' +
      '<div class="quiz-feedback" id="mq-fb">选择一个答案。</div>' +
      '<div class="demo-toolbar"><button class="demo-btn" id="mq-next" disabled>下一题</button><span class="badge" id="mq-score">0 / 0</span></div></div>' +
      '<div class="demo-panel"><h5>为什么</h5><div id="mq-exp" style="font-size:11.5px;line-height:1.85;color:var(--ink-3)">答完会显示解释。这个测验没有惩罚，只用来校准判断。</div>' +
      '<div class="demo-caption" style="margin-top:8px"><span class="dot"></span><span>全部答完后会给出一个总分与建议复习的模块。</span></div></div>' +
      '</div></div>';
    var i = 0, score = 0, answered = false;
    function render() {
      var cur = qs[i];
      q(el, '#mq-idx').textContent = i + 1;
      q(el, '#mq-q').textContent = cur.q;
      q(el, '#mq-fb').className = 'quiz-feedback';
      q(el, '#mq-fb').textContent = '选择一个答案。';
      q(el, '#mq-exp').textContent = '答完会显示解释。';
      q(el, '#mq-next').disabled = true;
      qa(el, '.quiz-opt').forEach(function (b) { b.classList.remove('right', 'wrong'); b.disabled = false; });
      answered = false;
    }
    qa(el, '.quiz-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        var val = b.getAttribute('data-a') === '1';
        var ok = val === qs[i].a;
        if (ok) score++;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) {
          var correct = qs[i].a ? 1 : 0;
          qa(el, '.quiz-opt').forEach(function (x) { if (x.getAttribute('data-a') === String(correct)) x.classList.add('right'); });
        }
        qa(el, '.quiz-opt').forEach(function (x) { x.disabled = true; });
        var fb = q(el, '#mq-fb');
        fb.className = 'quiz-feedback ' + (ok ? 'ok' : 'no');
        fb.textContent = ok ? '✓ 判断正确。' : '✗ 这次判断偏了。';
        q(el, '#mq-exp').textContent = qs[i].e;
        q(el, '#mq-score').textContent = score + ' / ' + (i + 1);
        q(el, '#mq-next').disabled = false;
        q(el, '#mq-next').textContent = i === qs.length - 1 ? '看结果' : '下一题';
      });
    });
    q(el, '#mq-next').addEventListener('click', function () {
      if (i < qs.length - 1) { i++; render(); }
      else {
        q(el, '#mq-q').textContent = '测验完成：' + score + ' / ' + qs.length;
        q(el, '#mq-fb').className = 'quiz-feedback ok';
        q(el, '#mq-fb').textContent = score >= 8 ? '判断很稳，可以去读接稿与 R18 模块了。' : score >= 5 ? '基础判断有了，建议复习「迷思」与「赛璐璐」模块。' : '建议从「迷思与真相」开始，把常见误区逐个拆掉。';
        q(el, '#mq-exp').textContent = '正确答案与解释已经在每题显示过。真正重要的是：遇到新说法时，先找证据，再下判断。';
        q(el, '.quiz-opts').style.display = 'none';
        q(el, '#mq-next').style.display = 'none';
      }
    });
    render();
  });

  /* ═══════════ 6. 30 天计划 ═══════════ */
  def('study-plan', '30 天练习计划', '每天点一下打卡。计划不是枷锁，是让你在没动力时也知道下一步做什么。', 'PRACTICE', function (el) {
    var KEY = 'cel-atelier-plan';
    var tasks = [
      '排线 10 分钟 + 画 5 个头', '结构速写 10 张', '临摹 1 张喜欢的线稿', '头部 3/4 视角 10 个', '手部速写 10 个',
      '人体动态 10 个', '衣褶临摹 5 组', '小幅上色 1 张', '赛璐璐色阶练习', '完整头像 1 张（草稿）',
      '完整头像 1 张（线稿）', '完整头像 1 张（上色 + 后期）', '复盘：找出 3 个问题', '重新画第 1 天的头', '人体比例 10 个',
      '动态速写 15 个', '头发分组练习 5 个', '眼睛专项 10 个', '衣服材质 3 种', '构图草图 5 张',
      '完整半身 1 张（草稿）', '完整半身 1 张（线稿）', '完整半身 1 张（底色）', '完整半身 1 张（一阴）', '完整半身 1 张（二阴 + 高光）',
      '完整半身 1 张（后期）', '对比第 10 天与第 26 天', '作品集排版 3 张', '写 100 字复盘', '制定下个月计划'
    ];
    var names = ['一', '二', '三', '四', '五', '六', '日'];
    function get() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
    function set(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
    var done = get();
    el.innerHTML = '<div class="demo-app">' +
      '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div style="font-size:11px;color:var(--ink-4)">打卡进度</div><div class="meter" style="flex:1;min-width:120px"><i id="sp-bar" style="width:0%;background:var(--grad)"></i></div><b id="sp-pct" style="font-family:var(--serif);font-size:20px;color:var(--gold)">0%</b>' +
      '<button class="demo-btn" id="sp-reset">重置</button></div>' +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:9px;color:var(--ink-4);text-align:center">' + names.map(function (n) { return '<div>周' + n + '</div>'; }).join('') + '</div>' +
      '<div class="plan-grid" id="sp-grid">' + tasks.map(function (t, i) { return '<div class="plan-cell" data-i="' + i + '" title="第 ' + (i + 1) + ' 天：' + t + '"><span>' + (i + 1) + '</span></div>'; }).join('') + '</div>' +
      '<div class="demo-caption"><span class="dot"></span><span id="sp-tip"><b>今天：</b>第 1 天 · 排线 10 分钟 + 画 5 个头。点方格打卡，进度自动保存。</span></div>' +
      '</div>';
    function render() {
      var n = 0;
      qa(el, '.plan-cell').forEach(function (c) {
        var i = +c.getAttribute('data-i');
        c.classList.toggle('done', !!done[i]);
        if (done[i]) n++;
      });
      var pct = Math.round(n / tasks.length * 100);
      q(el, '#sp-bar').style.width = pct + '%';
      q(el, '#sp-pct').textContent = pct + '%';
      var next = 0; while (done[next] && next < tasks.length) next++;
      q(el, '#sp-tip').innerHTML = '<b>下一步：</b>第 ' + (next + 1) + ' 天 · ' + (tasks[next] || '完成啦，去整理作品集吧。');
    }
    qa(el, '.plan-cell').forEach(function (c) {
      c.addEventListener('click', function () {
        var i = +c.getAttribute('data-i');
        done[i] = !done[i]; set(done); render();
      });
    });
    q(el, '#sp-reset').addEventListener('click', function () { done = {}; set(done); render(); });
    render();
  });


  /* ═══════════ 7. 接稿安全自检 ═══════════ */
  def('safety-check', '接稿安全自检', '逐项核对。红线项不过，停止交易；全部通过也不等于绝对安全，保留记录、保持警惕。', 'SAFETY', function (el) {
    var items = [
      { t: '所有交易都在有担保的平台内完成，没有转私下', red: false },
      { t: '甲方没有要求我扫码 / 下载未知 APP / 做任务才能收款', red: true },
      { t: '甲方没有要求我先垫付 / 充值 / 交保证金 / 手续费 / 解冻费', red: true },
      { t: '我没有共享屏幕 / 远程控制 / 提供验证码或银行卡密码', red: true },
      { t: '收款账户是甲方本人，不是第三方 / 加密货币 / 礼品卡', red: true },
      { t: '对方没有用“多付退款”或“投资 / 博彩 / 刷单”套路', red: true },
      { t: '需求、价格、修改次数、交付、授权已经写清', red: false },
      { t: '我没有透露住址 / 学校 / 身份证 / 银行卡照片', red: false },
      { t: '预览图带水印 / 低分辨率，尾款到账才发源文件', red: false },
      { t: '对方没有用亲密关系 / 情感勒索来施压', red: false },
      { t: '我知道平台举报、报警与心理求助渠道', red: false },
      { t: '我保留了订单 / 聊天 / 版本 / 交付记录', red: false }
    ];
    el.innerHTML =
      '<div class="demo-app"><div class="demo-split">' +
      '<div class="demo-panel" style="gap:7px">' + items.map(function (it, i) {
        return '<label class="chk" data-i="' + i + '"><input type="checkbox" data-red="' + (it.red ? 1 : 0) + '"><span>' + (it.red ? '<b style="color:var(--rose)">红线</b> · ' : '') + it.t + '</span></label>';
      }).join('') + '</div>' +
      '<div class="demo-panel" style="align-content:start">' +
      '<h5>自检结论</h5>' +
      '<div style="text-align:center;padding:12px 0"><div id="sc-score" style="font-family:var(--serif);font-size:46px;color:var(--rose);line-height:1">0</div><div style="font-size:10px;letter-spacing:.16em;color:var(--ink-4)">PASS ITEMS</div></div>' +
      '<div class="meter"><i id="sc-bar" style="width:0%;background:var(--rose)"></i></div>' +
      '<div id="sc-verdict" class="demo-caption" style="margin-top:8px"><span class="dot"></span><span>先勾选左侧项目，系统给出结论。</span></div>' +
      '<div class="demo-note" style="border-top:1px solid var(--line);padding-top:10px">这是一般性安全自查，不构成法律意见；遇到现实威胁，先报警/联系可信的人。</div>' +
      '</div></div></div>';
    function update() {
      var boxes = qa(el, 'input[type=checkbox]');
      var checked = boxes.filter(function (b) { return b.checked; }).length;
      var redMiss = boxes.some(function (b) { return b.getAttribute('data-red') === '1' && !b.checked; });
      q(el, '#sc-score').textContent = checked + '/' + boxes.length;
      q(el, '#sc-score').style.color = redMiss ? 'var(--rose)' : (checked === boxes.length ? 'var(--mint)' : 'var(--gold)');
      q(el, '#sc-bar').style.width = (checked / boxes.length * 100) + '%';
      q(el, '#sc-bar').style.background = redMiss ? 'var(--rose)' : (checked === boxes.length ? 'var(--mint)' : 'var(--gold)');
      var v = q(el, '#sc-verdict');
      if (redMiss) v.innerHTML = '<span class="dot" style="background:var(--rose);box-shadow:0 0 8px var(--rose)"></span><span><b style="color:var(--rose)">高风险：停止交易。</b>任何“扫码/下载/垫付/共享屏幕/第三方账户/多付退款”都是红线，不要抱着“应该没事”的心态继续。</span>';
      else if (checked < boxes.length) v.innerHTML = '<span class="dot" style="background:var(--gold);box-shadow:0 0 8px var(--gold)"></span><span><b style="color:var(--gold)">待补：</b>还有 ' + (boxes.length - checked) + ' 项未确认，补齐再继续。</span>';
      else v.innerHTML = '<span class="dot" style="background:var(--mint);box-shadow:0 0 8px var(--mint)"></span><span><b style="color:var(--mint)">相对安全：</b>所有项目已确认。仍要保留记录、设置边界；遇到新红旗随时停。</span>';
    }
    qa(el, 'input[type=checkbox]').forEach(function (b) {
      b.addEventListener('change', function () {
        b.closest('.chk').classList.toggle('on', b.checked); update();
      });
    });
    update();
  });
})();
