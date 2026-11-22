/* 实用检查器：选择图片、本地解析、按来源解释、复制/下载报告。 */
(function () {
  'use strict';
  var core = window.REVERSE_METADATA;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function diagnosticView(info) {
    var d=info.diagnostics;
    if(!d) return '<p class="rev-meta-notice">缺少提取诊断，请强制刷新后重试；不要把旧组件的空结果视为没有元数据。</p>';
    var labels={extracted:'提取成功',partial:'提取不完整，需复核','no-metadata':'未检测到支持的附加信息块','metadata-empty':'信息块已检查，未读到展示字段',unsupported:'当前格式未解析'};
    var states={parsed:'已解析',failed:'解析失败',limited:'达到解析限制',unsupported:'已发现，暂未解析',detected:'已发现'};
    return '<section class="rev-meta-diagnostic" aria-label="提取诊断"><span class="rev-meta-badge">提取诊断 · v'+esc(d.parserVersion)+'</span><h4>'+esc(labels[d.state]||d.state)+'</h4><p>'+esc(d.summary)+'</p><p>共展示 <strong>'+info.fields.length+'</strong> 项字段。软件、日期之外的信息可展开“作者、版权与其他现存描述”查看。</p><details><summary>查看已检查的信息块与解析状态</summary><p>容器记录：'+esc(Object.keys(d.containers).map(function(k){return k+' × '+d.containers[k];}).join(' · ')||'未读取到')+'</p>'+(d.attempts.length?'<ul>'+d.attempts.map(function(a){return '<li><strong>'+esc(a.type)+'</strong> · '+esc(states[a.status]||a.status)+'<br><span>'+esc(a.source)+' · '+a.bytes+' 字节</span></li>';}).join('')+'</ul>':'<p>未发现当前解析器支持的 EXIF、XMP、IPTC、文本等附加信息块。只能据此描述当前文件，不能证明它从未有过元数据。</p>')+'<p>未展示的字段 / 资源：'+d.skippedFields+' 项。未展示不等于不存在；支持范围见报告。</p></details></section>';
  }
  window.DEMOS = window.DEMOS || {};
  window.DEMOS['reverse-metadata'] = {
    title: '插画元数据检查器', desc: '先读真实标签，缺失项再给候选推测与依据。PNG / JPEG / WebP · 最大32 MiB · 图片不上传。', tag: '实用工具',
    mount: function (el) {
      el.innerHTML = '<div class="rev-lab rev-meta">' +
        '<div class="rev-meta-drop"><span class="rev-meta-badge">01 · 选择图片</span><h4>把插画放进“线索放大镜”</h4><p>拖入一张图片，或点击下方按钮。只读取文件，不修改原图。</p>' +
        '<div class="rev-file-actions"><label class="rev-meta-pick">选择插画<input type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" aria-label="选择插画读取元数据"></label>' +
        '<button class="demo-btn" type="button" data-meta-sample>先试教学样本</button></div></div>' +
        '<p class="rev-meta-status" role="status" aria-live="polite">等待选择。真实作画日期和工时无法仅凭一张成品确定。</p>' +
        '<div class="rev-meta-output"></div></div>';
      var serial = 0, job = null, activeURL = null, reportText = '';
      var output = el.querySelector('.rev-meta-output'), status = el.querySelector('.rev-meta-status'), picker = el.querySelector('input'), drop = el.querySelector('.rev-meta-drop');
      function cleanup() { if (job) job.cancel(); job = null; if (activeURL) URL.revokeObjectURL(activeURL); activeURL = null; }
      window.addEventListener('hashchange', function () { ++serial; cleanup(); }, { once: true });
      function fail(message, token) { if (token !== serial) return; cleanup(); status.textContent = message; output.innerHTML = ''; }
      function fieldList(info, kind, empty) {
        var rows = info.fields.filter(function (f) { return kind.indexOf(f.kind) >= 0; });
        return rows.length ? '<div class="rev-meta-fields">' + rows.map(function (f) {
          return '<article class="rev-meta-field"><span class="rev-meta-source">' + esc(f.source) + '</span><h5>' + esc(f.tag) + '</h5><p class="rev-meta-value" dir="auto">' + esc(f.value) + '</p><p class="rev-meta-help">' + esc(f.explanation) + '</p></article>';
        }).join('') + '</div>' : '<p class="rev-meta-empty">' + empty + '</p>';
      }
      function render(info, file, record, sample, token) {
        if (token !== serial) return;
        cleanup(); reportText = core.report(info, record);
        var software = info.fields.filter(function (f) { return f.kind === 'software'; }), times = info.fields.filter(function (f) { return f.kind === 'time'; });
        output.innerHTML = '<div class="rev-meta-overview"><figure class="rev-meta-preview"><span>预览准备中</span><img alt="所选插画的本地预览" hidden></figure><div><span class="rev-meta-badge">02 · 读取结果</span><h4>' + esc(record.name) + '</h4><p>' + esc(info.format) + ' · ' + (record.size / 1024).toFixed(1) + ' KiB' + (info.width && info.height ? ' · ' + info.width + ' × ' + info.height + ' 像素（容器声明）' : '') + '</p>' +
          (sample ? '<p class="rev-meta-notice">教学样本：软件与日期均为虚构演示声明。</p>' : '') + '<p>读取到 <strong>'+info.fields.length+'</strong> 项展示字段，其中 <strong>' + software.length + '</strong> 项软件线索、<strong>' + times.length + '</strong> 项时间相关字段。</p></div></div>' + diagnosticView(info) +
          '<div class="rev-meta-verdict"><section><span>真实绘制时间 / 工时</span><strong>尚未证实</strong><p>日期标签描述文件声明，不能还原绘制过程。缺失日期时，下方会给出有条件的时间候选。</p></section><section><span>软件线索</span><strong>' + (software.length ? '发现工具声明' : info.supported ? '未读到软件字段，已补候选' : '格式不受支持') + '</strong><p>' + (software.length ? '下方逐项保留原值。多个工具可能参与，也可能继承或改写标签。' : '请先看提取诊断：其他元数据可能已读取，也可能存在解析限制；候选猜测不代替标签。') + '</p></section></div>' +
          (info.supported ? '<section class="rev-meta-inference" aria-label="缺失线索的候选推测"><div class="rev-meta-inference-content" aria-live="polite"></div><details class="rev-meta-details rev-meta-context"><summary>补充已知情况，让猜测更有针对性</summary><p>以下是你手动提供的条件，工具没有自动识别画风或设备；切换后立即更新候选和报告。</p><div class="rev-meta-context-grid"><label>画面用途<select data-guess-profile aria-label="画面用途"><option value="auto">从文件名用途词推测</option><option value="general">不确定 / 通用插画</option><option value="anime">二次元头像、立绘、赛璐璐</option><option value="comic">黑白漫画、条漫</option><option value="paint">厚涂、绘画习作</option></select></label><label>已知绘制设备<select data-guess-device aria-label="已知绘制设备"><option value="unknown">不确定</option><option value="desktop">电脑</option><option value="ipad">iPad</option><option value="android">安卓平板 / 手机</option></select></label><label>文件来源<select data-guess-origin aria-label="文件来源"><option value="unknown">不确定</option><option value="original">作者的原始导出</option><option value="download">下载、截图或转存</option></select></label></div></details></section>' : '') +
          (info.warnings.length ? '<div class="rev-meta-notice"><strong>需要复核</strong><ul>' + info.warnings.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>' : '') +
          '<h4>软件 · 实际提取到的标签</h4>' + fieldList(info, ['software'], '未提取到软件声明。上方候选属于推测；索取原始导出文件后，可再核对 Software、CreatorTool。') +
          '<h4>日期 · 实际提取到的标签</h4>' + fieldList(info, ['time'], '未提取到内部日期。上方时间候选不是恢复的元数据，需用阶段图、发布记录或原生工程核对。') +
          '<div class="rev-meta-local"><strong>单独看：本地文件修改时间</strong><p>' + esc(record.lastModified == null ? '教学样本不采用本地文件时间。' : new Date(record.lastModified).toISOString()) + '</p><p>这是浏览器提供的 lastModified，可能受下载、复制、同步或改写影响；不是绘制时间，也不是本地创建时间。</p></div>' +
          '<details class="rev-meta-details"><summary>作者、版权与其他现存描述</summary>' + fieldList(info, ['credit', 'other'], '本工具未提取到这类展示字段。') + '</details>' +
          '<div class="rev-meta-next"><h4>下一步怎样追溯？</h4><ol><li>保留原始附件与来源。平台缩略图、截图可能已经丢失标签。</li><li>将上面的内部日期按来源记录，核对时区；不自动挑最早值当起笔时间。</li><li>向作者核对原生工程、阶段导出、可信发布或接收记录。多个不同日期可能描述不同事件。</li></ol></div>' +
          '<div class="rev-file-actions rev-meta-report-actions"><button class="demo-btn primary" data-meta-copy type="button">复制检查报告</button><button class="demo-btn" data-meta-save type="button">下载 TXT 报告</button><button class="demo-btn" data-meta-reset type="button">清空结果</button></div><p class="rev-meta-copy-status" role="status" aria-live="polite"></p>' +
          '<details class="rev-meta-details"><summary>查看报告文本与解析范围</summary><textarea class="rev-meta-report" readonly aria-label="可复制的元数据检查报告" rows="9"></textarea><p>' + esc(core.LIMITS) + '</p><p>报告只包含已展示的字段。未验证作者身份、时间真实性或 C2PA；原图不上传，报告由你自行决定是否分享。</p></details>';
        function updateInference() {
          var context = {profile:output.querySelector('[data-guess-profile]').value,device:output.querySelector('[data-guess-device]').value,origin:output.querySelector('[data-guess-origin]').value};
          var inferred=core.guess(info,record,context), s=inferred.software, t=inferred.time;
          var container=output.querySelector('.rev-meta-inference-content');
          if (!s.missing && !t.missing) {
            container.innerHTML='<h4>已有软件与日期声明</h4><p>先核对下方原始字段，无需用猜测替换；声明本身仍不等于创作过程证明。</p>';
            output.querySelector('.rev-meta-context').hidden=true;
          } else {
            container.innerHTML='<span class="rev-meta-badge">03 · 缺失项的最佳候选推测</span><h4>没有标签，也给你一个核查起点</h4><p>以下为条件假设，未写回图片，也不计入提取字段。没有区分依据时保留并列，不编造精确概率。</p>' +
              (s.missing ? '<article class="rev-meta-guess-card"><span class="rev-meta-guess-confidence">软件猜测 · '+esc(s.confidence)+'置信</span><h5>优先猜测：'+esc(s.top.join(' / '))+'</h5><p>'+esc(s.basis)+'</p><details><summary>查看全部候选与排序依据</summary><ul>'+s.candidates.map(function(c){return '<li><strong>'+esc(c.name)+'</strong>：'+esc(c.reasons.join(' '))+'</li>';}).join('')+'</ul></details><p class="rev-meta-help">'+esc(s.note)+'</p></article>' : '') +
              (t.missing ? '<article class="rev-meta-guess-card"><span class="rev-meta-guess-confidence">时间猜测 · '+esc(t.confidence)+'置信</span><h5>条件候选：'+esc(t.value)+'</h5><p>'+esc(t.basis)+'</p><p class="rev-meta-help">候选用于追溯核对，不是确认的绘制日期。单张成品也不足以推算工时；不以随意编造的天数或小时填空。</p></article>' : '');
          }
          reportText=core.report(info,record,context); output.querySelector('textarea').value=reportText;
          output.querySelector('.rev-meta-copy-status').textContent='';
        }
        if (info.supported) {
          updateInference();
          output.querySelectorAll('.rev-meta-context select').forEach(function(select){select.addEventListener('change',updateInference);});
        } else output.querySelector('textarea').value = reportText;
        var missingCandidate=!software.length || !times.some(function(f){return !/^(OffsetTime|SubSecTime)/i.test(f.tag);});
        status.textContent = info.supported ? info.diagnostics.summary+(missingCandidate?' 已为缺失的软件或日期补充候选推测。':'') : '当前格式不受支持，请用桌面工具复核。';
        var image = output.querySelector('img'), placeholder = output.querySelector('.rev-meta-preview span');
        if (info.supported && info.width > 0 && info.height > 0 && info.width * info.height <= 40000000) {
          var mime = { PNG: 'image/png', JPEG: 'image/jpeg', WebP: 'image/webp' }[info.format];
          activeURL = URL.createObjectURL(new Blob([file], { type: mime }));
          image.onload = function () { if (token !== serial) return; image.hidden = false; placeholder.hidden = true; if (activeURL) URL.revokeObjectURL(activeURL); activeURL = null; };
          image.onerror = function () { if (token !== serial) return; placeholder.textContent = '预览未能解码；标签读取不代表图像完整有效。'; if (activeURL) URL.revokeObjectURL(activeURL); activeURL = null; };
          image.src = activeURL;
        } else placeholder.textContent = info.supported ? '尺寸未读取或超过4000万像素，已跳过预览。' : '该格式不生成预览。';
        output.querySelector('[data-meta-copy]').addEventListener('click', async function () {
          var feedback = output.querySelector('.rev-meta-copy-status');
          try { await navigator.clipboard.writeText(reportText); if (token === serial) feedback.textContent = '报告已复制。包含作者等声明时，分享前请检查内容。'; }
          catch (e) { if (token !== serial) return; var area = output.querySelector('textarea'); area.closest('details').open = true; area.focus(); area.select(); feedback.textContent = '浏览器未允许自动复制，已选中报告；请按 Ctrl+C 或长按复制。'; }
        });
        output.querySelector('[data-meta-save]').addEventListener('click', function () {
          var url = URL.createObjectURL(new Blob(['\ufeff' + reportText], { type: 'text/plain;charset=utf-8' })), link = document.createElement('a');
          link.href = url; link.download = 'illustration-metadata-report.txt'; link.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        });
        output.querySelector('[data-meta-reset]').addEventListener('click', function () { ++serial; cleanup(); reportText = ''; picker.value = ''; output.innerHTML = ''; status.textContent = '已清空，可选择下一张插画。'; });
      }
      async function load(file, sample) {
        var token = ++serial; cleanup(); output.innerHTML = ''; reportText = '';
        if (!file) return;
        if (!core || !window.REVERSE_METADATA_IO) { fail('检查器组件未加载完整，请刷新页面后重试。', token); return; }
        if (file.size > core.MAX_FILE) { fail('文件超过32 MiB，请换较小的原始导出图，或用桌面工具检查。', token); return; }
        if (!file.size) { fail('这是空文件，请重新选择图片。', token); return; }
        status.textContent = '正在本地读取与解析…';
        var record = { name: sample ? 'reverse-sample.png（原创教学样本）' : file.name, size: file.size, lastModified: sample ? null : file.lastModified };
        var phase = 'read';
        try {
          var buffer = await window.REVERSE_METADATA_IO.readBlob(file); if (token !== serial) return;
          phase = 'parse'; job = window.REVERSE_METADATA_IO.start(buffer);
          var info = await job.promise; if (token !== serial) return;
          phase = 'render'; render(info, file, record, sample, token);
        } catch (e) {
          if (token !== serial || e.name === 'AbortError') return;
          var known = /^(ReadError|RuntimeError|WorkerError|ParseError|TimeoutError)$/.test(e.name);
          fail(known ? e.message : phase === 'read' ? '文件读取失败，请确认文件可访问后重新选择。' : phase === 'parse' ? '本地解析失败，请换一张图片或使用 ExifTool 复核。' : '结果展示失败，请刷新页面后重试；原文件未被修改。', token);
        }
      }
      picker.addEventListener('change', function () { if (this.files[0]) load(this.files[0], false); this.value = ''; });
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-dragging'); });
      drop.addEventListener('dragleave', function (e) { if (!drop.contains(e.relatedTarget)) drop.classList.remove('is-dragging'); });
      drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('is-dragging'); if (e.dataTransfer.files.length > 1) { ++serial; cleanup(); output.innerHTML = ''; status.textContent = '每次检查一张图片，请只拖入一个文件。'; } else if (e.dataTransfer.files[0]) load(e.dataTransfer.files[0], false); });
      el.querySelector('[data-meta-sample]').addEventListener('click', function () {
        try { load(window.REVERSE_METADATA_IO.sampleBlob(), true); }
        catch (e) { var token = ++serial; fail('教学样本组件未加载完整，请刷新页面后重试。', token); }
      });
    }
  };
})();
