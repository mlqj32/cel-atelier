(function () {
  'use strict';
  var ink = '#453957', pink = '#e58baf', blue = '#73bed0', gold = '#eac17f';
  function path(d, fill, stroke, extra) { return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + (stroke || ink) + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" ' + (extra || '') + '/>'; }
  function ellipse(x, y, rx, ry, fill, stroke) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + (fill || 'none') + '" stroke="' + (stroke || ink) + '" stroke-width="2.5"/>'; }
  function rect(x, y, w, h, fill, stroke) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="' + fill + '" stroke="' + (stroke || ink) + '" stroke-width="2"/>'; }
  function arrow(x, y, dx, dy, color) { return path('M' + x + ' ' + y + 'l' + dx + ' ' + dy, 'none', color) + ellipse(x, y, 5, 5, color, color); }
  function tick(x, y, c) { return path('M' + x + ' ' + y + 'l8 8l17 -21', 'none', c || ink, 'stroke-width="4"'); }
  function cross(x, y, c) { return path('M' + x + ' ' + y + 'l20 20m0 -20l-20 20', 'none', c || pink, 'stroke-width="4"'); }
  function paper(x, y, w, h) { return rect(x, y, w, h, '#fffdfa') + path('M' + (x+12) + ' ' + (y+22) + 'h' + (w-24) + 'm-' + (w-24) + ' 14h' + (w-34), 'none', '#a49ab2'); }
  function phone(x, y, w, h) { return rect(x, y, w, h, '#e7edf6') + rect(x+6, y+13, w-12, h-26, '#fffdfa', '#b6adbf') + path('M' + (x+w*.4) + ' ' + (y+7) + 'h' + (w*.2)); }
  function person(x, y, c) { return ellipse(x, y, 15, 18, '#ffe6da') + path('M' + (x-28) + ' ' + (y+57) + 'q0 -38 28 -38q28 0 28 38Z', c || '#cbb7e8'); }
  function lock(x, y) { return path('M' + (x-13) + ' ' + y + 'v-13a13 13 0 0 1 26 0v13', 'none', ink) + rect(x-22, y, 44, 35, '#b7d9de') + ellipse(x, y+14, 3, 4, ink, ink) + path('M' + x + ' ' + (y+17) + 'v8'); }
  function bubble(x, y, w, h, color) { return rect(x, y, w, h, color || '#d4c3e6') + path('M' + (x+12) + ' ' + (y+h) + 'v13l17 -13', color || '#d4c3e6'); }
  function folder(x, y, c) { return path('M' + x + ' ' + (y+15) + 'v-15h34l12 15h60v73h-106Z', c || '#f4d7bd'); }
  function glyph(x, y, t, color) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="700" fill="' + (color || ink) + '">' + t + '</text>'; }
  function sketch(type, n, description) {
    var s = '', i;
    if (type === 'head' || type === 'angle') {
      var shift = type === 'angle' ? n * 10 : 0;
      s = ellipse(120, 78, 53, 57, '#e9e1f6', '#b7a6ce');
      if (n > 0) s += path('M70 84L81 124L120 154L160 124L170 84', '#ffe6da') + path('M' + (120 + shift) + ' 30Q' + (120 + shift * 1.7) + ' 92 ' + (120 + shift) + ' 146', 'none', blue);
      if (n > 1) s += path('M73 91Q120 99 167 91M94 120L146 120', 'none', blue) + ellipse(100 + shift, 100, 14, 7, 'white') + ellipse(141 + shift * .5, 100, type === 'angle' ? 9 : 14, 7, 'white');
      if (n > 2) s += path('M67 85Q55 15 119 18Q183 16 176 83L150 55L137 82L122 49L95 80L88 60Z', '#cbb7e8') + path('M113 132Q122 137 131 131');
    } else if (type === 'hand') {
      s = path('M146 101L154 108L165 157L157 150Z', '#d3b2bb') + path('M93 157L157 150L165 157L101 164Z', '#e8c4b8') + path('M82 109L146 101L157 150L93 157Z', '#ffe6da') + path('M93 157L94 173M145 152L147 170', 'none', blue);
      if (n > 0) s += path('M82 109L77 57Q78 43 87 48L96 102M96 102L97 34Q100 22 108 32L113 101M114 101L119 31Q124 23 130 34L131 100M131 100L145 50Q153 41 157 53L146 102', '#ffe6da');
      if (n > 1) s += path('M147 125L173 92Q182 83 188 92Q192 99 183 109L156 151', '#ffd6c4') + ellipse(153, 132, 10, 15, 'none', pink);
      if (n > 2) s += path('M81 77L94 76M99 58L110 57M117 60L130 60M137 75L150 79M91 113Q122 121 146 106', 'none', blue);
    } else if (type === 'body') {
      s = path('M125 24Q95 77 125 117Q149 147 118 177', 'none', pink);
      if (n > 0) s += ellipse(122, 28, 16, 19, '#ffe6da') + path('M95 57L144 66L139 101L99 92Z', '#cbb7e8') + path('M107 114L142 105L155 131L116 141Z', '#abd8db');
      if (n > 1) s += path('M98 63L69 95L61 125M142 68L171 95L180 120M118 137L104 166L89 182M147 130L157 158L164 181', 'none', ink);
      if (n > 2) s += path('M62 185L180 185M127 49L127 185', 'none', blue, 'stroke-dasharray="5 5"') + ellipse(164, 185, 13, 4, gold, gold);
    } else if (type === 'hair') {
      s = ellipse(120, 95, 50, 61, '#ffe6da', '#baa5b4');
      if (n === 0) s += ellipse(120, 81, 65, 71, 'none', pink);
      if (n > 0) s += path('M55 125Q40 15 121 18Q198 12 185 145L160 165L153 66L126 90L112 52L82 103L82 165Z', '#cbb7e8');
      if (n > 1) s += path('M120 24Q92 39 80 99M120 24Q145 33 154 68M120 24Q170 25 180 144', 'none', blue);
      if (n > 2) s += path('M63 85Q85 54 100 60M129 57Q158 55 174 81', 'none', '#fff8ef', 'stroke-width="9"');
    } else if (type === 'eye') {
      s = ellipse(120, 100, 65, 56, '#ffe6da', '#cdb8bd');
      if (n > 0) s += path('M57 100Q112 40 183 96Q132 143 57 100Z', '#fffaf7') + ellipse(122, 96, 25, 34, '#ac8acb');
      if (n > 1) s += path('M57 100Q112 40 183 96', 'none', ink, 'stroke-width="6"') + ellipse(122, 96, 10, 20, ink);
      if (n > 2) s += ellipse(110, 80, 8, 9, '#fffaf7', '#fffaf7') + path('M67 54Q118 30 168 51', 'none', ink);
    } else if (type === 'cloth') {
      s = path('M65 34L173 34L191 157Q123 187 51 157Z', '#b9d6e4');
      if (n > 0) s += ellipse(75, 35, 6, 6, pink, pink) + ellipse(162, 35, 6, 6, pink, pink);
      if (n > 1) s += path('M75 40L86 143L116 170M162 40L145 141L131 173M75 40L118 117M162 40L124 117', 'none', ink);
      if (n > 2) s += path('M85 104L86 143L116 170L93 144ZM144 105L145 141L131 173L155 144Z', '#7d91bb', '#7d91bb');
    } else if (type === 'perspective') {
      s = path('M15 60L225 60', 'none', blue) + ellipse(20, 60, 5, 5, pink, pink);
      if (n < 2) {
        if (n > 0) s += path('M100 100L75 86L75 127.5L100 165Z', '#a897be') + path('M100 100L160 100L113 86L75 86Z', '#e9dced') + path('M20 60L160 100M20 60L100 165', 'none', pink, 'stroke-dasharray="5 5"');
        s += path('M100 100L160 100L160 165L100 165Z', '#d4c3e6');
      } else {
        s += ellipse(220, 60, 5, 5, gold, gold) + path('M120 90L65 73.5L65 107.25L120 165Z', '#d4c3e6') + path('M120 90L175 73.5L175 107.25L120 165Z', '#a897be') + path('M120 90L65 73.5L120 68.7L175 73.5Z', '#e9dced');
        if (n > 2) s += path('M20 60L120 90M20 60L120 165', 'none', pink, 'stroke-dasharray="5 5"') + path('M220 60L120 90M220 60L120 165', 'none', gold, 'stroke-dasharray="5 5"');
      }
    } else if (type === 'light' || type === 'material' || type === 'color') {
      var fill = type === 'color' ? ['#e6bd71','#b9c5ed','#d0e4c1','#e6a4b8'][n] : '#cbb7e8';
      s = ellipse(164, 161, 42, 10, '#c5c2d3', '#c5c2d3') + ellipse(126, 103, 55, 55, fill);
      if (n > 0) s += '<defs><clipPath id="ball-' + type + '-' + n + '"><circle cx="126" cy="103" r="54"/></clipPath></defs><g clip-path="url(#ball-' + type + '-' + n + ')">' + path('M145 51Q112 113 76 127Q105 172 155 148Q197 112 170 69Z', type === 'color' ? '#8e7aaa' : '#9181b0', 'none') + '</g>';
      if (n > 1) s += ellipse(108, 79, type === 'material' ? 7 : 15, type === 'material' ? 20 : 9, '#fff8ec', '#fff8ec');
      if (n > 2) s += path('M161 66Q184 104 164 137', 'none', blue, 'stroke-width="6"');
      s += arrow(45, 28, 23, 29, gold);
      if (type === 'light' && n === 3) s += arrow(212, 35, -24, 35, blue);
    } else if (type === 'line') {
      s = ellipse(40, 55, 4, 4, pink, pink) + ellipse(205, 55, 4, 4, blue, blue);
      s += path(n === 0 ? 'M40 55L55 60L69 48L79 58L91 51L105 61L120 50L136 59L153 51L173 60L188 51L205 55' : 'M40 55Q125 48 205 55', 'none', ink);
      if (n > 1) s += path('M35 119Q95 60 155 126T213 152', 'none', pink, 'stroke-width="5"');
      if (n > 2) s += path('M42 179L42 137L101 137L101 179M101 150L158 150L158 182', 'none', blue);
    } else if (type === 'layers') {
      for (i = 0; i <= n; i++) s += path('M40 ' + (110-i*22) + 'L120 ' + (142-i*22) + 'L202 ' + (110-i*22) + 'L120 ' + (78-i*22) + 'Z', ['#abd8db','#bca4dc','#e8aec5','#f5d9a8'][i]);
      s += path('M120 162L120 185', 'none', ink);
    } else if (type === 'workflow') {
      s = window.ART.portrait({ mode: ['line','flat','cel','cel'][n], deco: false, layers: { hi: n === 3, rim: false, ao: false } }).replace('<svg ', '<svg x="48" y="4" width="145" height="190" ');
      if (n === 3) s += '<g transform="translate(162 136) scale(.55)">' + folder(0, 0, '#b7d9de') + tick(37, 55, ink) + '</g>';
    } else if (type === 'curves') {
      s = path('M40 25L40 166L213 166', 'none', ink) + path('M40 166L205 32', 'none', '#b3aebc', 'stroke-dasharray="5 5"');
      s += path(['M40 166L205 32','M40 166Q100 65 205 32','M40 166C125 170 104 22 205 32','M40 154C120 158 113 40 205 43'][n], 'none', pink, 'stroke-width="4"');
      s += ellipse(122, [100,71,96,96][n], 5, 5, blue, blue);
    } else if (type === 'mesh') {
      s = path('M62 142Q44 35 120 34Q191 34 179 142L145 164L100 162Z', '#cbb7e8');
      if (n > 0) for (i = 0; i < 4; i++) s += path('M' + (65+i*31) + ' 53L' + (73+i*29+n*2) + ' 141M62 ' + (58+i*27) + 'L178 ' + (58+i*27), 'none', blue);
      if (n > 0) for (i = 0; i < 3; i++) for (var j = 0; j < 3; j++) s += path('M' + (65+i*31) + ' ' + (58+j*27) + 'L' + (73+(i+1)*29+n*2) + ' ' + (85+j*27), 'none', blue);
      if (n > 1) s += rect(44, 21, 151, 157, 'none', pink);
      if (n > 2) s += arrow(185, 171, 24, -35, gold);
    } else if (type === 'brief') {
      if (n === 0) s = bubble(18, 26, 83, 53) + path('M32 43h48m-48 14h31') + arrow(103, 93, 24, 0, blue) + paper(135, 33, 83, 133) + tick(153, 113) + tick(153, 145);
      if (n === 1) s = paper(35, 18, 125, 162) + ellipse(97, 88, 28, 33, '#ffe6da') + path('M67 138q30 -37 60 0', '#cbb7e8') + bubble(160, 52, 60, 43, '#b7d9de') + tick(174, 77);
      if (n === 2) s = paper(22, 30, 88, 139) + glyph(66, 109, '©') + arrow(112, 102, 28, 0, blue) + rect(150, 36, 70, 112, '#e9e1f6') + person(185, 68, '#b7d9de') + path('M146 164h76', 'none', pink, 'stroke-dasharray="5 5"');
      if (n === 3) s = folder(26, 47, '#b7d9de') + paper(139, 25, 78, 144) + tick(157, 105) + tick(157, 143);
    } else if (type === 'safety') {
      if (n === 0) s = person(45, 64) + bubble(86, 30, 116, 64) + glyph(116, 76, '♥', pink) + ellipse(168, 65, 15, 15, gold) + glyph(175, 157, '?', ink);
      if (n === 1) s = phone(30, 17, 86, 166) + path('M48 56l25 -18l25 18v34h-50Z', '#b7d9de') + tick(55, 135) + paper(144, 46, 74, 105) + cross(169, 105, pink);
      if (n === 2) s = paper(24, 26, 86, 142) + glyph(67, 106, '!', pink) + ellipse(165, 96, 43, 43, '#f8e0d8', pink) + cross(155, 86, pink) + path('M132 143l66 -93', 'none', pink, 'stroke-width="5"');
      if (n === 3) s = folder(22, 58, '#b7d9de') + paper(139, 32, 77, 134) + path('M158 127v-47l36 7l-36 14', '#e8aec5') + tick(155, 149);
    } else if (type === 'cyberbullying') {
      if (n === 0) s = rect(19, 25, 128, 132, '#fffdfa') + path('M19 48h128M31 37h53', 'none', blue) + bubble(32, 64, 99, 35, '#ead3df') + path('M110 69l-10 12h12l-9 12', 'none', pink) + path('M32 124h89m-89 17h62', 'none', '#a49ab2') + rect(150, 101, 72, 53, '#b7d9de') + ellipse(186, 128, 17, 17, '#fffdfa') + path('M167 101l6 -9h26l6 9') + path('M45 175h131m-96 -6v12m41 -12v12', 'none', gold);
      if (n === 1) s = phone(33, 17, 95, 166) + person(80, 66, '#cbb7e8') + lock(179, 92) + path('M141 50l49 0m-49 15h32', 'none', '#b6adbf') + ellipse(178, 165, 24, 14, '#fffdfa') + path('M156 182l44 -34', 'none', pink, 'stroke-width="4"');
      if (n === 2) s = rect(22, 24, 101, 136, '#fffdfa') + bubble(34, 45, 76, 46, '#ead3df') + path('M144 147v-98l55 15l-55 22', '#e8aec5') + paper(160, 105, 57, 71) + tick(172, 155);
      if (n === 3) s = person(56, 67, '#cbb7e8') + phone(98, 63, 42, 79) + person(184, 67, '#b7d9de') + bubble(92, 20, 61, 35, '#f4d7bd') + glyph(122, 47, '♥', pink) + path('M70 162h105m-67 -8v16m12 -16v16', 'none', gold);
    } else if (type === 'account-security') {
      if (n === 0) s = paper(20, 27, 93, 144) + path('M36 79h60m-60 24h60', 'none', blue) + glyph(68, 143, '•••') + phone(140, 29, 75, 145) + lock(178, 83);
      if (n === 1) s = rect(25, 27, 155, 100, '#e7edf6') + path('M15 143h177l-13 12h-151Z', '#cbb7e8') + path('M76 62a24 24 0 1 1 -1 36m-7 -31l9 -5l4 13', 'none', blue) + folder(126, 98, '#f4d7bd');
      if (n === 2) s = phone(24, 18, 88, 164) + path('M42 56l25 -19l25 19v28h-50Z', '#b7d9de') + tick(54, 125) + paper(141, 38, 76, 123) + tick(158, 118);
      if (n === 3) s = rect(23, 29, 135, 139, '#fffdfa') + person(89, 70) + path('M35 142h109', 'none', '#b6adbf') + path('M188 25C164 25 158 47 188 75C218 47 212 25 188 25Z', '#e9e1f6') + ellipse(188, 44, 7, 7, '#fffdfa') + path('M164 24l47 51', 'none', pink, 'stroke-width="4"') + lock(189, 120);
    } else if (type === 'review') {
      if (n === 0) s = paper(28, 27, 95, 140) + person(75, 73) + ellipse(174, 84, 35, 35, '#f4d7bd') + glyph(174, 96, '?') + path('M160 149v21m19 -21v21', 'none', pink, 'stroke-width="6"');
      if (n === 1) s = paper(28, 27, 95, 140) + glyph(75, 121, '©') + paper(137, 49, 78, 106) + tick(159, 119);
      if (n === 2) s = ellipse(76, 94, 43, 43, '#b7d9de') + ellipse(76, 94, 19, 43, 'none') + path('M34 94h84M42 71h68M42 117h68', 'none', ink) + paper(137, 36, 79, 130) + glyph(176, 126, '?');
      if (n === 3) s = paper(26, 25, 96, 142) + ellipse(174, 68, 35, 35, '#f8e0d8', pink) + path('M163 53v30m22 -30v30', 'none', pink, 'stroke-width="7"') + folder(131, 105, '#b7d9de');
    } else if (type === 'feedback') {
      if (n === 0) s = paper(31, 17, 112, 162) + ellipse(88, 92, 30, 36, '#ffe6da') + path('M69 91h13m15 8h13', 'none', ink) + rect(158, 110, 59, 61, '#b7d9de') + rect(169, 116, 37, 17, '#fffdfa') + rect(169, 145, 37, 26, '#e7edf6');
      if (n === 1) s = paper(24, 22, 111, 155) + ellipse(80, 92, 31, 38, '#ffe6da') + path('M60 88h12m14 13h14', 'none', ink) + ellipse(149, 83, 37, 37, '#fffdfa', pink) + path('M132 80h13m15 11h13M174 109l29 35', 'none', ink, 'stroke-width="4"');
      if (n === 2) s = paper(30, 20, 119, 159) + ellipse(90, 91, 32, 38, '#ffe6da') + path('M68 90h13m14 0h13', 'none', blue) + path('M145 127l45 -58l14 10l-45 58l-20 9Z', '#f4d7bd') + ellipse(99, 91, 16, 12, 'none', pink);
      if (n === 3) s = paper(18, 29, 92, 139) + ellipse(64, 94, 26, 33, '#ffe6da') + path('M46 89h10m12 10h10', 'none', '#b6adbf') + paper(128, 29, 92, 139) + ellipse(174, 94, 26, 33, '#ffe6da') + path('M156 89h10m12 0h10', 'none', blue) + tick(174, 152);
    } else if (type === 'tone') {
      var toneId = 'study-tone-' + n;
      s = rect(25, 28, 190, 145, '#fffdfa');
      if (n === 0) s += rect(39, 42, 162, 117, '#a6a6ad', '#a6a6ad');
      else {
        s += '<defs><pattern id="' + toneId + '" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="' + (n === 1 ? 2.3 : 4.3) + '" fill="#453957"/></pattern></defs>';
        if (n < 3) s += '<rect x="39" y="42" width="162" height="117" fill="url(#' + toneId + ')"/>';
        else s += ellipse(120, 101, 55, 56, '#fffdfa') + '<defs><clipPath id="' + toneId + '-clip"><circle cx="120" cy="101" r="54"/></clipPath></defs><path d="M142 47Q119 111 68 127L76 162H184V47Z" clip-path="url(#' + toneId + '-clip)" fill="url(#' + toneId + ')"/>';
      }
    } else {
      throw new Error('分镜缺少对应画面：' + type);
    }
    var label = String(description || (type + '：步骤' + (n+1))).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" role="img" aria-label="' + label + '"><rect width="240" height="200" rx="14" fill="#faf4e9"/>' + s + '</svg>';
  }
  var sets = {
    'line': ['投篮式画线：先瞄准，再落笔', '两点之间的控笔小实验', ['标好起点和终点，先看终点','空挥确认路径，再一笔连接','用C/S曲线训练连续转弯','两张卡片遮挡：前线连续，后线断开']],
    'head': ['小邮差的头部搭建', '从球和下颌，到五官与发型', ['先画颅球，保留头顶体积','补下颌与中线，确定脸朝向','眉线和眼线分开，摆眼框','最后包头发，头骨仍在里面']],
    'angle': ['转头不是移动贴纸', '简化示意；对照实际参考理解曲面与遮挡', ['固定观察位置，先找头部球体','把中线放到转向侧的弧面上','远侧眼框随转面压缩','加头发后回看中线与眼框，别让发型掩盖转向关系']],
    'eye': ['给玻璃珠戴上眼睑', '先理解包裹，再画神态', ['把眼球想成圆润体积','眼睑包住球，虹膜被上缘遮住','上眼睑加强，瞳孔保持共同视线','少量高光，眉眼一起表达情绪']],
    'hair': ['头发像宽纸带', '大外形、分组、方向、局部亮带', ['头骨外留蓬松体积','先分前、侧、后三个大组','用少量发流线解释方向','亮带顺着发片，避免整圈白线']],
    'body': ['搭一个站得住的小模特', '先趋势，再体块，最后检查支撑', ['一条趋势线先抓最大动作','胸腔与骨盆可以独立倾斜','接上四肢，避免两侧机械对称','静态站姿检查支撑范围和接地点']],
    'hand': ['把手套拆成手指', '先掌形，再四指，最后接拇指', ['手掌是有厚度的楔形','四指从有弧度的指根线伸出','拇指根接在手掌侧面','用关节方向线检查弯折与遮挡']],
    'cloth': ['让纸巾教你画衣褶', '用一块布比较支撑、张力与下垂', ['先保留布的完整外轮廓','标出两个支撑或拉扯点','主褶朝受力点组织，余量下垂','只给主要转折加阴影，不铺满碎线']],
    'perspective': ['把盒子放进街道', '消失点属于一组平行方向', ['视平线先决定观察者眼高','同一方向的边向共同消失点延伸','转动盒子，出现另一组空间方向','用两色线分别检查两组水平边']],
    'light': ['月光小球的四次观察', '先自身暗部，再投影与反射', ['底色和光源先保持固定','背光面合成大形，与桌面投影分开看','高光依材质与观察位置选择','额外边缘光需要额外光照依据']],
    'material': ['同一个球，换一种反射表现', '比较亮区集中程度与环境反射，不把亮边当固定公式', ['先固定体积与光位','保留主要背光形状','光滑表面用更集中的反射亮区','环境反射可改变边缘，非固定白描边']],
    'color': ['四种口味的月光糖', '示例配色，不是阴影公式', ['先用暖黄建立底色关系','冷色底也要单独配阴影','绿色底上比较亮部与暗部','换成粉色底，重新检查配色关系']],
    'layers': ['把颜色做成可修改的纸片', '图层顺序示意；不代表自动剪贴或软件菜单', ['先保留一张底色纸片','把阴影单独放在上层','需要时，再加独立的高光层','多层组合成预览，母版仍保留分层']],
    'workflow': ['同一角色的四个检查点', '用同一张线稿比较阶段变化；不代替各章完整工序', ['线稿阶段先检查结构与边缘','铺好底色，检查分区和漏白','加入主要阴影，再核对光源方向','按需要收尾，导出后重新打开检查']],
    'curves': ['曲线像一座亮度小桥', '横轴输入，纵轴输出；网站演示为简化映射', ['对角线：保持原有亮度','中点上移：提亮对应中间调','S形常加强对比，留意两端细节','压缩两端输出范围，再检查细节']],
    'mesh': ['给发片穿上网格外套', '网格与父变形器是不同层级；不是软件操作截图', ['补画完整的发片，是可变形的图像','用网格顶点覆盖发片，检查局部结构','外层变形器包住发片与网格','区分局部网格与整体控制，再测试形变']],
    'brief': ['一张委托单的闯关地图', '范围、节点、付款和交付都需确认', ['需求写成可核对的具体项','确认草图，记录变更和阶段款','授权逐项说明，不只写商用二字','交付前重开文件，保留必要记录']],
    'safety': ['假甲方的四次核验', '虚构交易场景；图示不构成绝对安全保证', ['赞美和预算不代表身份可信','到账在自己已知入口独立核对','遇到解冻费或陌生程序先停止','保存记录，通过官方渠道求助']],
    'cyberbullying': ['被网暴时：留证、隐私、举报与求助', '出现现实人身威胁时及时报警，不必等待时间节点；以下用虚构材料演练', ['保存原帖、链接与时间，整理事件时间线','收紧公开资料、评论和私信，减少继续接触','保留证据后，通过平台官方入口举报','联系可信的人获得支持，必要时报警或寻求专业帮助']],
    'account-security': ['账号、设备、支付与隐私分开检查', '四类风险分别核对；任何单项措施都不构成绝对安全保证', ['账号使用独立密码与双重验证，妥善保存恢复码','设备保持更新，重要文件另做可恢复备份','从已知官方入口核对真实订单与到账','检查公开资料，隐藏不必要的身份与位置线索']],
    'tone': ['同一块灰：用网点表达明暗', '点的覆盖率与连续灰色不同；图示仅用于比较，不是印刷参数', ['连续灰色块：整片铺色，没有独立网点','小网点、低覆盖：纸白保留更多','同样间距增大网点，覆盖更多、整体更暗','用范围限制网点，只让它出现在阴影区域']],
    'review': ['审稿不是只看一个标签', '非露骨情境；未知项暂停，自查不代替平台或法律判断', ['先核对年龄与语境，有疑义先暂停','核对素材、角色与委托用途的权利依据','再查发布渠道与当地规则，未知项标待核对','有疑义就暂停，保留依据与结论再处理']],
    'feedback': ['一次练习的四步复盘', '保留起点、定位差异、局部修改、对照复测', ['先保存同题起点，不追求完美','放大观察，圈定一处可修改的问题','在副本上只改这一处，保留修改痕迹','修改前后并排比较，再做同题复测']]
  };
  // Only attach a vignette where its actual drawings support the chapter exercise.
  // Keep these bindings with the artwork; learning.js derives its lookup from them.
  var bindings = {
    line: ['fundamentals/ch01','sai2/ch04','practice/ch02'],
    head: ['fundamentals/ch02','practice/ch03'],
    angle: ['fundamentals/ch03'], eye: ['fundamentals/ch04'], hair: ['fundamentals/ch06'],
    body: ['fundamentals/ch07','fundamentals/ch09','practice/ch04'], hand: ['fundamentals/ch08'],
    cloth: ['fundamentals/ch10'], perspective: ['fundamentals/ch11'],
    light: ['fundamentals/ch12','cel/ch01','cel/ch03','cel/ch04','myths/ch02','practice/ch05'],
    material: ['cel/ch06','cel/ch09'], color: ['cel/ch07'],
    layers: ['cel/ch08','ipad/ch04','sai2/ch05'],
    workflow: ['cel/ch10','cel/ch12','ipad/ch09','sai2/ch06','sai2/ch09','csp/ch10','practice/ch06'],
    curves: ['ps/ch04'], mesh: ['live2d/ch01','live2d/ch04'],
    brief: ['career/ch02','career/ch07','career/ch11'],
    safety: ['safety/ch01','safety/ch02','safety/ch03','safety/ch12'],
    cyberbullying: ['safety/ch09'], 'account-security': ['safety/ch11'], tone: ['csp/ch04'],
    review: ['r18/ch01','r18/ch03','r18/ch04','r18/ch09','r18/ch11'],
    feedback: ['start/ch08','fundamentals/ch13','myths/ch08','practice/ch01','practice/ch08']
  };
  window.LEARNING_VISUALS = { sketch: sketch };
  Object.keys(sets).forEach(function (key) {
    var v = sets[key];
    window.FIGURES['study-' + key] = { title: v[0], caption: v[1], chapters: bindings[key] || [], cards: v[2].map(function (caption, i) { return { svg: sketch(key, i, caption), caption: caption }; }) };
  });
})();
