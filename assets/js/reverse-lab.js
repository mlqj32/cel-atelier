/* 原创、局部运行的文件结构与信息损失实验。 */
(function () {
  'use strict';
  var demos = window.DEMOS = window.DEMOS || {};
  var diagrams = window.DIAGRAMS = window.DIAGRAMS || {};
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function mix8(base, mark, alpha) { return Math.round((1 - alpha) * base + alpha * mark); }
  function candidates(value, mark, alpha) {
    var result = [];
    for (var b = 0; b <= 255; b++) if (mix8(b, mark, alpha) === value) result.push(b);
    return result;
  }
  function slider(id, title, value, min, max, suffix) {
    return '<label class="rev-slider" for="' + id + '"><span>' + title + '</span><output id="' + id + '-value">' + value + (suffix || '') + '</output><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '"></label>';
  }
  function swatch(title, cls) { return '<div class="rev-result-card"><span>' + title + '</span><div class="rev-swatch ' + cls + '" aria-hidden="true"></div><strong class="' + cls + '-value"></strong></div>'; }

  demos['reverse-watermark'] = {
    title: '水印混合实验：两个底色怎样变成同一个输出',
    desc: '简化为8位灰度、普通混合与取整，不模拟所有软件的色彩管线。', tag: '可拖动',
    mount: function (el) {
      el.innerHTML = '<div class="rev-lab">' +
        '<div class="rev-controls">' + slider('rev-base', '底色 B', 101, 0, 255) + slider('rev-mark', '水印色 W', 240, 0, 255) + slider('rev-alpha', '水印不透明度 a', 50, 0, 100, '%') + '</div>' +
        '<div class="rev-result-grid">' + swatch('底色', 'rev-base-color') + swatch('水印色', 'rev-mark-color') + swatch('8位合成结果', 'rev-composite') + '</div>' +
        '<p class="rev-formula"></p><div class="rev-explanation" role="status" aria-live="polite"></div>' +
        '<p class="rev-small">候选计算只在此灰度模型内穷举。它说明多解，不是实际水印去除或原图还原工具。</p></div>';
      function render() {
        var b = +el.querySelector('#rev-base').value, w = +el.querySelector('#rev-mark').value, a = +el.querySelector('#rev-alpha').value / 100;
        var c = mix8(b, w, a), possible = candidates(c, w, a);
        [['rev-base', b], ['rev-mark', w], ['rev-alpha', Math.round(a * 100) + '%']].forEach(function (x) { el.querySelector('#' + x[0] + '-value').textContent = x[1]; });
        [['rev-base-color', b], ['rev-mark-color', w], ['rev-composite', c]].forEach(function (x) {
          el.querySelector('.' + x[0]).style.backgroundColor = 'rgb(' + x[1] + ',' + x[1] + ',' + x[1] + ')';
          el.querySelector('.' + x[0] + '-value').textContent = x[1];
        });
        el.querySelector('.rev-formula').textContent = 'C = round((1 − ' + a.toFixed(2) + ') × ' + b + ' + ' + a.toFixed(2) + ' × ' + w + ') = ' + c;
        el.querySelector('.rev-explanation').textContent = '已知 W、a 和输出 ' + c + '，仍有 ' + possible.length + ' 个底色候选：' + (possible.length > 12 ? possible.slice(0, 6).join('、') + ' … ' + possible.slice(-3).join('、') : possible.join('、')) + '。' + (a === 1 ? '完全覆盖时，所有底色得到同一输出。' : possible.length > 1 ? '成品无法在这些候选中唯一选回原底色。' : '此单通道样本在当前已知参数下只有一个候选，不代表整张真实图片都可逆。');
      }
      el.querySelectorAll('input').forEach(function (input) { input.addEventListener('input', render); }); render();
    }
  };

  demos['reverse-layers'] = {
    title: '同一像素，两种工程：合成相同，编辑不同', desc: '普通灰度合成的反例；不宣称是真实PSD图层解析。', tag: '多解实验',
    mount: function (el) {
      el.innerHTML = '<div class="rev-lab">' + slider('rev-layer-base', '方案B的底层灰度', 100, 0, 255) +
        '<div class="rev-compare"><section><h4>方案A：一层成品色</h4><div class="rev-layer-chip">单层 · 合成色</div><div class="rev-swatch rev-flat" aria-hidden="true"></div><p class="rev-flat-value"></p></section>' +
        '<section><h4>方案B：两层叠加</h4><div class="rev-layer-chip">上层200 · 透明度50%</div><div class="rev-layer-chip rev-layer-bottom"></div><div class="rev-swatch rev-stack" aria-hidden="true"></div><p class="rev-stack-value"></p></section></div>' +
        '<label class="rev-check"><input type="checkbox" checked>显示方案B的上层</label><p class="rev-explanation" role="status"></p></div>';
      function render() {
        var b = +el.querySelector('input[type="range"]').value, visible = el.querySelector('input[type="checkbox"]').checked;
        var baseline = mix8(b, 200, .5), composed = visible ? baseline : b;
        el.querySelector('#rev-layer-base-value').textContent = b;
        el.querySelector('.rev-layer-bottom').textContent = '底层' + b + ' · 不透明';
        [['rev-flat', baseline], ['rev-stack', composed]].forEach(function (x) {
          el.querySelector('.' + x[0]).style.backgroundColor = 'rgb(' + x[1] + ',' + x[1] + ',' + x[1] + ')';
          el.querySelector('.' + x[0] + '-value').textContent = '输出灰度：' + x[1];
        });
        el.querySelector('.rev-explanation').textContent = visible ? '当前两个结果相同，不能从成品唯一推断层数。试着关闭方案B上层：两个工程会表现出不同编辑行为。' : '隐藏上层后，B露出底色；A仍是单层成品色。静态外观相同，不保证图层结构和编辑行为相同。';
      }
      el.querySelectorAll('input').forEach(function (input) { input.addEventListener('input', render); }); render();
    }
  };

  demos['reverse-svg'] = {
    title: '一个圆的三种表示：矢量、包装与近似描摹', desc: '图形均为本站原创。路径拟合仅作理想圆的采样示意，不是自动描摹算法。', tag: '对象对照',
    mount: function (el) {
      var canvas = document.createElement('canvas'); canvas.width = canvas.height = 20;
      var ctx = canvas.getContext('2d'); ctx.fillStyle = '#172439'; ctx.fillRect(0, 0, 20, 20); ctx.fillStyle = '#7de2ca'; ctx.beginPath(); ctx.arc(10, 10, 7, 0, Math.PI * 2); ctx.fill();
      var uri = canvas.toDataURL('image/png');
      el.innerHTML = '<div class="rev-lab">' + slider('rev-nodes', '近似轮廓的采样顶点数', 6, 3, 48) +
        '<div class="rev-result-grid rev-svg-grid"><section><h4>矢量圆</h4><svg viewBox="0 0 100 100" role="img" aria-label="可重新渲染的矢量圆"><circle cx="50" cy="50" r="35" fill="#7de2ca"/></svg><p>circle对象<br>按目标分辨率重新渲染</p></section>' +
        '<section><h4>SVG包装位图</h4><svg viewBox="0 0 100 100" role="img" aria-label="SVG中嵌入的20像素位图"><image href="' + uri + '" width="100" height="100" style="image-rendering:pixelated"/></svg><p>image对象<br>原位图仍只有20×20像素</p></section>' +
        '<section><h4>近似描摹</h4><svg viewBox="0 0 100 100" role="img" aria-label="用有限顶点近似圆形"><path class="rev-trace" fill="#7de2ca"/></svg><p>新拟合的path<br>近似形状，未找回原圆对象</p></section></div>' +
        '<details class="rev-code"><summary>看对象描述</summary><pre></pre></details><p class="rev-small">位图使用像素化放大以突出采样格子；普通查看器可能采用平滑插值，但不会因此获得原矢量对象。</p></div>';
      function render() {
        var n = +el.querySelector('input').value, path = '';
        for (var i = 0; i < n; i++) { var angle = i * Math.PI * 2 / n; path += (i ? 'L' : 'M') + (50 + 35 * Math.cos(angle)).toFixed(2) + ' ' + (50 + 35 * Math.sin(angle)).toFixed(2) + ' '; }
        path += 'Z'; el.querySelector('.rev-trace').setAttribute('d', path); el.querySelector('output').textContent = n;
        el.querySelector('pre').textContent = '矢量圆：<circle cx="50" cy="50" r="35"/>\n位图包装：<image href="data:image/png;base64,…"/>\n近似轮廓：<path d="' + path + '"/>';
      }
      el.querySelector('input').addEventListener('input', render); render();
    }
  };

  function ascii(bytes, start, end) { return Array.prototype.map.call(bytes.subarray(start, end), function (b) { return String.fromCharCode(b); }).join(''); }
  function crc32(bytes) {
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) { crc ^= bytes[i]; for (var bit = 0; bit < 8; bit++) crc = crc >>> 1 ^ (crc & 1 ? 0xedb88320 : 0); }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function inspectBytes(bytes) {
    var result = { format: '未识别', summary: '只按有限签名判断，不表示文件有效。', chunks: [], fields: [], warnings: [] };
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every(function (b, i) { return bytes[i] === b; })) {
      result.format = 'PNG'; result.summary = '解析PNG块边界、IHDR与部分文本/时间；不解压图像、不完整解析元数据。';
      var offset = 8, ended = false;
      while (offset < bytes.length && result.chunks.length < 1000) {
        if (offset + 12 > bytes.length) { result.warnings.push('截断：剩余字节不足一个块头与CRC。'); break; }
        var len = view.getUint32(offset), type = ascii(bytes, offset + 4, offset + 8), next = offset + 12 + len;
        if (!/^[A-Za-z]{4}$/.test(type)) { result.warnings.push('块类型不是四个ASCII字母。'); break; }
        if (next > bytes.length) { result.warnings.push('截断或异常长度：' + type + '超出文件边界。'); break; }
        var correctCRC = crc32(bytes.subarray(offset + 4, offset + 8 + len)) === view.getUint32(offset + 8 + len);
        result.chunks.push({ offset: offset, type: type, length: len, crc: correctCRC });
        if (!correctCRC) result.warnings.push(type + '的CRC不匹配。');
        if (result.chunks.length === 1 && type !== 'IHDR') result.warnings.push('首块不是IHDR。');
        if (type === 'IHDR') {
          if (len !== 13) result.warnings.push('IHDR长度不是13。');
          else { result.width = view.getUint32(offset + 8); result.height = view.getUint32(offset + 12); result.bitDepth = bytes[offset + 16]; result.colorType = bytes[offset + 17]; }
        }
        if (type === 'tEXt') {
          var end = Math.min(offset + 8 + len, offset + 8 + 2048), part = bytes.subarray(offset + 8, end), zero = part.indexOf(0);
          if (zero >= 1 && zero <= 79) {
            var safeText = function (b) { return b >= 32 && b <= 126 ? String.fromCharCode(b) : '\\x' + b.toString(16).padStart(2, '0'); };
            result.fields.push({ name: ascii(part, 0, zero), value: Array.prototype.map.call(part.subarray(zero + 1), safeText).join('') + (len > 2048 ? '…[仅显示前2048字节]' : '') });
          } else result.warnings.push('tEXt关键词缺失、过长或未在显示范围内发现分隔符。');
        }
        if (type === 'tIME') {
          if (len === 7) {
            var at = offset + 8;
            result.fields.push({ name: 'tIME（图像修改时间声明，UTC）', value: view.getUint16(at) + '-' + String(bytes[at + 2]).padStart(2, '0') + '-' + String(bytes[at + 3]).padStart(2, '0') + 'T' + String(bytes[at + 4]).padStart(2, '0') + ':' + String(bytes[at + 5]).padStart(2, '0') + ':' + String(bytes[at + 6]).padStart(2, '0') + 'Z' });
          } else result.warnings.push('tIME长度不是7。');
        }
        offset = next;
        if (type === 'IEND') { ended = true; if (len !== 0) result.warnings.push('IEND长度不是0。'); if (next < bytes.length) result.warnings.push('IEND之后还有额外字节；本工具不解析。'); break; }
      }
      if (!ended) result.warnings.push('未读到IEND；可能截断，或超出1000块检查上限。');
    } else if (bytes.length >= 2 && bytes[0] === 255 && bytes[1] === 216) {
      result.format = 'JPEG（SOI签名）'; result.summary = '仅识别开头FF D8；未解析JPEG段、EXIF、XMP或图像数据，未验证完整性。';
    } else if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
      result.format = 'WebP（RIFF/WEBP）'; result.summary = '容器声明总字节数：' + (view.getUint32(4, true) + 8) + '。未解析内部VP8/VP8L与元数据。';
      if (view.getUint32(4, true) + 8 !== bytes.length) result.warnings.push('RIFF声明大小与文件字节数不一致。');
    } else if (bytes.length >= 6 && ascii(bytes, 0, 4) === '8BPS') {
      result.format = 'PSD/PSB签名'; var version = view.getUint16(4); result.summary = '版本字段：' + version + '（1=PSD，2=PSB）。未解析图层与资源。';
      if (version !== 1 && version !== 2) result.warnings.push('版本字段不是常见PSD/PSB版本。');
      if (bytes.length < 26) result.warnings.push('不足26字节标准头，可能截断。');
      else result.fields.push({ name: '头部参数（非图层数）', value: '通道数' + view.getUint16(12) + '，宽' + view.getUint32(18) + '，高' + view.getUint32(14) + '，每通道位深' + view.getUint16(22) + '，颜色模式代码' + view.getUint16(24) });
    }
    return result;
  }

  demos['reverse-inspector'] = {
    title: '本地文件放大镜：头字节、PNG块和摘要', desc: '上限16 MiB；文件留在浏览器，不上传。仅作有限结构检查。', tag: '本地实验室',
    mount: function (el) {
      el.innerHTML = '<div class="rev-lab"><div class="rev-file-actions"><button type="button" class="demo-btn primary" data-rev-sample>载入原创PNG样本</button><a href="assets/practice/reverse-sample.png" download>下载样本</a><label class="rev-file-label">选择自己的小文件<input type="file" aria-label="选择本地图片进行只读检查"></label></div><p class="rev-file-status" role="status" aria-live="polite">先载入样本；不需要上传私人文件。</p><div class="rev-file-output"></div></div>';
      var serial = 0, limit = 16 * 1024 * 1024;
      async function show(bytes, name, modified, token) {
        if (token !== serial) return;
        var info = inspectBytes(bytes), hex = Array.prototype.map.call(bytes.subarray(0, 64), function (b) { return b.toString(16).padStart(2, '0').toUpperCase(); }).join(' ');
        var out = el.querySelector('.rev-file-output');
        out.innerHTML = '<h4>' + esc(name) + '</h4><p>' + esc(info.format) + ' · ' + bytes.length + ' 字节' + (info.width !== undefined ? ' · ' + info.width + '×' + info.height + ' 像素 · 位深' + info.bitDepth + ' · 颜色类型' + info.colorType : '') + '</p><p>' + esc(info.summary) + '</p>' +
          (modified ? '<p>本地文件lastModified：' + esc(new Date(modified).toISOString()) + '（不是作画时刻证明）</p>' : '<p>本站原创技术样本；标签中的日期仅为演示声明。</p>') +
          '<h4>前64字节 · 十六进制</h4><pre class="rev-hex">' + hex + '</pre>' +
          (info.chunks.length ? '<h4>PNG数据块</h4><ol class="rev-chunks">' + info.chunks.map(function (c) { return '<li><strong>' + c.type + '</strong><span>偏移 ' + c.offset + ' · 数据 ' + c.length + ' 字节 · CRC ' + (c.crc ? '匹配' : '不匹配') + '</span></li>'; }).join('') + '</ol>' : '') +
          (info.fields.length ? '<h4>已解析的部分声明</h4><dl class="rev-fields">' + info.fields.map(function (f) { return '<dt>' + esc(f.name) + '</dt><dd>' + esc(f.value) + '</dd>'; }).join('') + '</dl>' : '') +
          '<p class="rev-explanation">' + esc(info.warnings.length ? info.warnings.join(' ') : '本次有限检查未发现上述边界或CRC异常；未验证完整解码、作者、制作工具或时间真实性。') + '</p><h4>整文件 SHA-256</h4><p class="rev-digest">计算中…</p>';
        el.querySelector('.rev-file-status').textContent = '读取完成。元数据声明需另外验证；没有显示的标签不等于不存在。';
        try {
          var digest = await crypto.subtle.digest('SHA-256', bytes);
          if (token === serial) out.querySelector('.rev-digest').textContent = Array.prototype.map.call(new Uint8Array(digest), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        } catch (e) { if (token === serial) out.querySelector('.rev-digest').textContent = '当前环境无法调用SHA-256，可用本章Get-FileHash命令复核。'; }
      }
      el.querySelector('[data-rev-sample]').addEventListener('click', async function () {
        var token = ++serial;
        try { var io = window.REVERSE_METADATA_IO; if (!io) throw new Error('样本组件未加载'); var bytes = new Uint8Array(await io.readBlob(io.sampleBlob())); await show(bytes, 'reverse-sample.png（原创教学样本）', null, token); }
        catch (e) { if (token === serial) el.querySelector('.rev-file-status').textContent = '教学样本组件未能加载，请刷新页面后重试。也可下载样本后用文件选择器读取。'; }
      });
      el.querySelector('input[type="file"]').addEventListener('change', async function () {
        var token = ++serial, file = this.files[0]; if (!file) return;
        el.querySelector('.rev-file-output').innerHTML = '';
        if (file.size > limit) { el.querySelector('.rev-file-status').textContent = '文件超过16 MiB，请换小样本或使用适合大文件的桌面工具。'; return; }
        el.querySelector('.rev-file-status').textContent = '正在本地读取…';
        try { await show(new Uint8Array(await file.arrayBuffer()), file.name, file.lastModified, token); }
        catch (e) { if (token === serial) el.querySelector('.rev-file-status').textContent = '未能读取文件；原文件未被修改。请换小样本或用桌面工具复核。'; }
      });
    }
  };

  function icon(kind, n) {
    var colors = ['#7de2ca', '#a7beff', '#ffd79a', '#ff9fbd'], c = colors[n % colors.length], art = '';
    if (kind === 'evidence') {
      if (n === 0) art = '<rect x="30" y="12" width="180" height="86" rx="9" fill="#21334a"/><circle cx="78" cy="40" r="12" fill="#ffd79a"/><path d="M45 84L95 48L130 72L160 42L195 84Z" fill="' + c + '"/>';
      if (n === 1) art = '<rect x="30" y="12" width="180" height="86" rx="9" fill="#21334a"/>' + [0, 1, 2, 3].map(function (r) { return [0, 1, 2, 3, 4, 5].map(function (i) { return '<rect x="' + (43 + i * 26) + '" y="' + (24 + r * 17) + '" width="17" height="8" rx="2" fill="' + ((r + i) % 3 ? c : '#61748e') + '"/>'; }).join(''); }).join('');
      if (n === 2) art = [2, 1, 0].map(function (i) { return '<rect x="' + (40 + i * 20) + '" y="' + (12 + i * 19) + '" width="120" height="42" rx="8" fill="#1c2a40" stroke="' + c + '" stroke-width="2"/>'; }).join('');
      if (n === 3) art = '<circle cx="70" cy="38" r="13" fill="' + c + '"/><circle cx="170" cy="73" r="13" fill="' + c + '"/><path d="M84 39H144Q170 39 170 59" fill="none" stroke="' + c + '" stroke-width="5" stroke-dasharray="7 6"/><path d="M160 52L170 64L180 52" fill="none" stroke="' + c + '" stroke-width="4"/>';
    } else if (kind === 'timeline') {
      art = '<path d="M22 64H218" stroke="#54667e" stroke-width="3"/>' + [0, 1, 2].map(function (i) { return '<circle cx="' + (45 + i * 75) + '" cy="64" r="' + (i === n % 3 ? 12 : 6) + '" fill="' + (i === n % 3 ? c : '#61748e') + '"/>'; }).join('');
      art += n === 3 ? '<path d="M46 30H194M46 22V38M194 22V38" stroke="' + c + '" stroke-width="3" stroke-dasharray="5 4"/>' : '<rect x="' + (26 + n * 75) + '" y="12" width="38" height="29" rx="5" fill="#21334a" stroke="' + c + '"/>';
    } else if (kind === 'png') {
      var widths = [38, 40, 102, 30], at = 15;
      art = widths.map(function (width, i) { var part = '<rect x="' + at + '" y="32" width="' + width + '" height="48" rx="5" fill="' + (i === n ? c : '#2b3a51') + '"/>'; at += width + 3; return part; }).join('');
      art += '<path d="M15 92H234" stroke="#61748e" stroke-width="2"/>';
    } else {
      art = '<path d="M53 55H187" stroke="#61748e" stroke-width="3"/>' + [0, 1, 2].map(function (i) { return '<rect x="' + (24 + i * 75) + '" y="25" width="47" height="60" rx="6" fill="#21334a" stroke="' + c + '" stroke-width="2"/><path d="M' + (35 + i * 75) + ' 43h24m-24 12h24m-24 12h16" stroke="' + c + '" stroke-width="2"/>'; }).join('');
      if (n === 3) art += '<path d="M100 90l12 12 27-28" fill="none" stroke="#7de2ca" stroke-width="5"/>';
    }
    return '<svg viewBox="0 0 240 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + art + '</svg>';
  }
  function diagram(id, title, kind, steps, notes) {
    var reading = { kicker: title + ' · 图形与文字对应阅读', steps: steps.map(function (x, i) { return { title: x[0], body: [x[1]], color: ['#7de2ca', '#a7beff', '#ffd79a', '#ff9fbd'][i], art: icon(kind, i) }; }), notes: notes };
    diagrams[id] = { title: title, caption: '', reading: reading, svg: function () {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 760" role="img" aria-label="' + esc(title) + '"><rect width="620" height="760" fill="#101725"/>' + reading.steps.map(function (s, i) {
        var y = 20 + i * 180, lines = s.body[0].match(/.{1,25}/g) || [];
        return '<g transform="translate(20 ' + y + ')"><rect width="580" height="164" rx="12" fill="#182338" stroke="' + s.color + '"/><text x="20" y="34" font-family="Microsoft YaHei,sans-serif" font-size="21" fill="#eff5ff">' + (i + 1) + ' · ' + esc(s.title) + '</text>' + lines.map(function (line, j) { return '<text x="20" y="' + (67 + j * 25) + '" font-family="Microsoft YaHei,sans-serif" font-size="18" fill="#c7d7e8">' + esc(line) + '</text>'; }).join('') + '</g>';
      }).join('') + '</svg>';
    } };
  }
  diagram('d-reverse-evidence', '图像、字节、工程与历史：四种不同信息', 'evidence', [
    ['画面像素', '可以观察轮廓与颜色；截图不等于拿到了原始文件。'],
    ['文件字节', '可以解析格式和现存标签；声明仍需来源验证。'],
    ['可编辑工程', '可以检查留存的层、路径与蒙版；未保存内容仍可能未知。'],
    ['过程与来源', '阶段记录和可信接收日志帮助约束时间；不由成品自动补齐。']
  ], ['多个流程可以生成相同成品。直接观察、解释假设与缺失证据分别记录。']);
  diagram('d-reverse-timeline', '一张图的时间，不止一个时刻', 'timeline', [
    ['开始绘制', '需要可靠起点记录；不能从本地创建时间直接得出。'],
    ['保存与导出', '工具可能写入内部日期，语义、时区与真实性需核对。'],
    ['接收与下载', '可信接收记录可约束某版本最晚已存在的时刻。'],
    ['劳动时长', '两个日期的间隔包含等待与休息，不能自动当作工时。']
  ], ['先问要确定哪一种时间；没有可靠证据时，保留未知。']);
  diagram('d-reverse-png', 'PNG数据块：长度、类型、数据、CRC', 'png', [
    ['长度 · 4字节', '大端序，表示数据部分字节数，不包含12字节结构开销。'],
    ['类型 · 4字节', '例如IHDR、IDAT、tEXt、IEND；各有不同语义与约束。'],
    ['数据 · 指定长度', 'IHDR保存参数，IDAT保存压缩数据；不是直接裸RGB。'],
    ['CRC · 4字节', '检测类型与数据的差错；可重新计算，不是作者签名。']
  ], ['开头还有8字节PNG签名。块结构检查通过，不代表图像完整有效或来源真实。']);
  diagram('d-reverse-custody', '证据链：原件、工作副本、记录、复核', 'custody', [
    ['原件留存', '保留原始接收字节与来源，不先转码或覆盖重存。'],
    ['副本分析', '记录工具版本、命令和范围，变换在工作副本进行。'],
    ['摘要与时间', '哈希核对字节，可信时间关联需另外建立。'],
    ['独立复核', '让他人能按记录重复观察，并看到同样的限制条件。']
  ], ['哈希、时间戳与签名分别回答不同问题，不能单凭一种机制认定作者与全部历史。']);

  window.REVERSE_LAB = { mix8: mix8, candidates: candidates, crc32: crc32, inspectBytes: inspectBytes };
})();
