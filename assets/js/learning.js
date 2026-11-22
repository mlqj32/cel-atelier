(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var safeGet = function (k, fallback) { try { return JSON.parse(localStorage.getItem(k)) || fallback; } catch (e) { return fallback; } };
  var safeSet = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var prefs = safeGet('cel-atelier-reader', { size: 18, paper: false, quiet: true });
  function applyPrefs() {
    document.documentElement.style.setProperty('--reading-size', ([16,18,20].indexOf(+prefs.size) >= 0 ? +prefs.size : 18) + 'px');
    document.body.classList.toggle('paper-reader', !!prefs.paper);
    document.body.classList.toggle('quiet-reader', !!prefs.quiet);
  }
  applyPrefs();
  var visualMap = {};
  Object.keys(window.FIGURES || {}).forEach(function (figureId) {
    (window.FIGURES[figureId].chapters || []).forEach(function (route) {
      var parts = route.split('/'), mod = window.CONTENT[parts[0]];
      if (!mod || !mod.chapters.some(function (ch) { return ch.id === parts[1]; })) throw new Error('分镜绑定了不存在的章节：' + route);
      if (visualMap[route]) throw new Error('同一章节重复绑定分镜：' + route);
      visualMap[route] = figureId;
    });
  });
  var prereq = {
    start:'不需要绘画经验，纸笔也可开始。',
    fundamentals:'先熟悉画线与保存；不会软件也可用纸笔。',
    cel:'先理解体块与基本明暗；也可用提供的线稿先练上色。',
    ipad:'准备兼容的iPad与笔；手势可在设置中自定义。',
    sai2:'准备能运行SAI2的电脑与绘图输入设备。',
    csp:'先能新建、保存画布；界面与许可按自己的版本核对。',
    ps:'准备一张可修改的练习图，先保留原件。',
    live2d:'先完成分层与补画，再做网格；绘画与绑定可分开练。',
    career:'先有可展示作品；以下示例均可用虚构订单演练。',
    safety:'不需接触真实可疑账户或链接，用虚构案例练习。',
    reverse:'先会保存与导出；使用自己的练习图，保留原件，在副本上观察。',
    r18:'只用非露骨案例学习职业边界，规则需按地区与平台核对。',
    myths:'先选与你当前困难有关的一章，不必一次读完。',
    practice:'先做起点小测，选择一个计划即可。'
  };
  var terms = {
    '体块':'把复杂形体简化为球、盒、柱等有朝向和厚度的体积。',
    '视平线':'观察者眼睛高度所对应的水平面在画面中的位置线。',
    '消失点':'空间里一组平行方向在透视画面中的汇聚位置。',
    '三庭':'常见正面比例辅助：发际到眉、眉到鼻底、鼻底到下巴。',
    '远侧':'相对于观察者更远的一侧，不固定等于画面左或右。',
    '负形':'主体或阴影周围留下的空间，本身也有可观察的轮廓。',
    '一阴':'流程中负责主要阴影的第一层颜色组织，不是物理定律。',
    'AO':'环境光在缝隙和接触处受遮挡的近似表现，常作小范围深暗。',
    '固有色':'用来描述物体自身颜色的绘画概念，实际显示仍受光照影响。',
    '色相':'红、黄、绿、蓝等颜色类别；需与明暗和饱和度一起判断。',
    '饱和度':'颜色鲜艳或接近灰的程度，不等于亮度。',
    '剪贴':'让上层只在其基底层已有不透明像素的范围显示。',
    '蒙版':'控制图层或效果的可见范围，可隐藏内容而不删除原像素。',
    '正片叠底':'将上下层颜色相乘的混合方式，通常用于加深。',
    'sRGB':'常见屏幕与网页工作流使用的一种RGB色彩空间。',
    'PSD':'常见分层交换文件；不同软件特性并不保证全部保留。',
    '关键形态':'在某个参数值记录的对象形状，中间值通过插值变化。',
    '变形器':'用于控制一组图像或子对象形变的父级控制对象。',
    '授权':'权利人允许某些用途的约定，范围需按项目明确。',
    '2FA':'除密码外增加第二种验证因素；恢复方式也要妥善保存。',
    '元数据':'附在文件或记录中的描述信息，例如尺寸、软件字段和时间；是否真实要另行验证。',
    'EXIF':'一组图像元数据标签及存储约定，最初常用于相机信息，也可能出现在其他图像中。',
    'XMP':'用于描述文件属性和工作流信息的元数据框架；字段可缺失、继承或被改写。',
    '哈希':'由字节计算出的摘要，可比较文件是否一致；本身不证明作者或绘制时间。',
    '量化':'把连续或高精度数值映射到有限档位，例如取整到0～255；不同输入可能合到同一输出。',
    '栅格化':'把路径、文字等图形描述变成指定分辨率的像素。',
    '矢量化':'用路径等图形近似表达像素图，不会自动恢复作者原来的笔触和图层。'
  };
  function fence(type, id) { return '\n\n```' + type + ':' + id + '\n```\n\n'; }
  Object.keys(window.TUTOR || {}).forEach(function (id) {
    var mod = window.CONTENT[id], rows = window.TUTOR[id];
    if (!mod || rows.length !== mod.chapters.length) throw new Error('课程补充数量不匹配：' + id);
    mod.chapters.forEach(function (ch, i) {
      var row = rows[i], quizId = 'knowledge-' + id + '-' + ch.id;
      ch.tutor = row;
      ch.prereq = prereq[id];
      ch.readMinutes = Math.max(3, Math.ceil((ch.content.length + row.join('').length) / 320));
      var intro = '## 先带着这个问题读\n\n' + row[4] + '\n\n' + row[0] + '\n\n';
      var visual = visualMap[id + '/' + ch.id];
      var old = ch.content.replace(/\n## 小结\n[\s\S]*$/, '').trim();
      var add = '\n\n## 跟着做：把原则变成动作\n\n' + row[1].map(function (step, j) { return (j+1) + '. ' + step; }).join('\n') +
        (visual ? fence('figure', visual) : '\n\n') +
        '\n## 卡住时，先查这里\n\n' + row[2] + '\n\n## 独立练习与验收\n\n' + row[3] + '\n\n先完成一个小产出，再与本章步骤对照。若尚不能独立完成，缩小题目并重做一次；不以阅读时长或打卡次数代替技能验收。' +
        '\n\n## 想一想，再看解释\n' + fence('demo', quizId);
      if ((id === 'cel' && (ch.id === 'ch10' || ch.id === 'ch12')) || (id === 'practice' && ch.id === 'ch05')) add += '\n## 下载小邮差练习包\n\n先用提供的线稿练习两色阶，之后再尝试自己的角色。底色、一阴和收尾图是同一角色的阶段参考；示例用正常图层配色，不是所有画风的唯一答案。' + fence('demo','practice-kit');
      ch.content = intro + old + '\n\n' + ((window.LESSON_CASES || {})[id + '/' + ch.id] || '') + add;
      ch.readMinutes = Math.max(3, Math.ceil(ch.content.length / 320));
      window.DEMOS[quizId] = { title:'本章判断小测', desc:'先选一个答案，再看原因；答对也不代替动手练习。', tag:'自测', kind:'checkpoint', mount:function (el) {
        var key = id + '/' + ch.id, attempts = safeGet('cel-atelier-checks', {}), previous = attempts[key];
        var options = i % 2 ? [row[6],row[5]] : [row[5],row[6]];
        el.innerHTML = '<div class="chapter-check"><p class="check-question">' + esc(row[4]) + '</p><div class="check-options">' + options.map(function (option) { return '<button type="button" class="check-option" aria-pressed="false">' + esc(option) + '</button>'; }).join('') + '</div><p class="check-result" role="status" aria-live="polite">' + (previous ? '上次已尝试。换一个新例子解释给自己听，再作答。' : '选择后显示解析。答错可以重新尝试。') + '</p></div>';
        Array.prototype.forEach.call(el.querySelectorAll('.check-option'), function (button) {
          button.addEventListener('click',function () {
            var correct = button.textContent === row[5];
            Array.prototype.forEach.call(el.querySelectorAll('.check-option'),function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); b.classList.remove('correct','retry'); });
            button.classList.add(correct ? 'correct' : 'retry');
            el.querySelector('.check-result').textContent = (correct ? '判断正确。' : '再想一步：') + row[7];
            attempts[key] = { correct:correct }; safeSet('cel-atelier-checks',attempts);
          });
        });
      } };
    });
  });
  window.DEMOS['practice-kit'] = {title:'月兔邮差 · 上色起步包',desc:'站内原创、透明线稿与分阶段参考，供课程学习和个人练习。',tag:'练习素材',kind:'resource',mount:function(el){
    el.innerHTML = '<div class="kit-preview">' + ['line','flat','shadow','finish'].map(function (stage,i) {return '<figure><img src="assets/practice/postal-' + stage + '.png" alt="月兔邮差' + ['透明线稿','底色阶段','一阴阶段','收尾阶段'][i] + '" loading="lazy"><figcaption>' + ['01 线稿','02 底色','03 一阴','04 收尾'][i] + '</figcaption></figure>';}).join('') + '</div><p class="kit-instruction">线稿导入后放在顶部并锁定，在下面新建底色层。第一次先跳过后期，完成底色与一阴即可。PNG可导入常见绘画软件；SVG用于查看和矢量编辑。</p><div class="kit-links"><a download href="assets/practice/cel-postal-practice.zip">下载完整练习包 ZIP</a><a download href="assets/practice/postal-line.png">下载透明线稿 PNG</a><a download href="assets/practice/postal-guide.html">下载跟练手册 HTML</a></div>';
  }};
  function renderFigure(d) {
    return '<section class="story-figure" aria-label="' + esc(d.title) + '"><div class="story-heading"><span class="story-tag">图解小剧场</span><strong>' + esc(d.title) + '</strong></div><div class="story-grid">' + d.cards.map(function (card,i) {return '<figure><div class="story-art">' + card.svg + '</div><figcaption><b>' + String(i+1).padStart(2,'0') + '</b><span>' + esc(card.caption) + '</span></figcaption></figure>';}).join('') + '</div><p class="story-note">' + esc(d.caption) + '</p></section>';
  }
  function init(root, mod, ch) {
    document.body.classList.add('reading-page');
    var tools = document.createElement('div'); tools.className = 'reader-tools';
    tools.setAttribute('aria-label','阅读设置');
    tools.innerHTML = '<label>字号 <select aria-label="正文字号"><option value="16">标准 · 16px</option><option value="18">舒适 · 18px</option><option value="20">大字 · 20px</option></select></label><button type="button" data-paper aria-pressed="' + !!prefs.paper + '">纸色阅读</button><button type="button" data-quiet aria-pressed="' + !!prefs.quiet + '">专注阅读</button><span>阅读约 ' + ch.readMinutes + ' 分钟 · 跟练另计</span>';
    root.querySelector('.doc-header').appendChild(tools);
    var selector = tools.querySelector('select'); selector.value = prefs.size;
    selector.addEventListener('change',function(){ prefs.size = +selector.value; applyPrefs(); safeSet('cel-atelier-reader',prefs); });
    ['paper','quiet'].forEach(function (name) { tools.querySelector('[data-' + name + ']').addEventListener('click',function(){prefs[name]=!prefs[name];this.setAttribute('aria-pressed',String(prefs[name]));applyPrefs();safeSet('cel-atelier-reader',prefs);}); });
    var start = document.createElement('div'); start.className = 'lesson-start';
    start.innerHTML = '<p class="lesson-label">这一章，先做一件小事</p><p>' + esc(ch.tutor[3]) + '</p><p class="lesson-hint">起步提示：' + esc(ch.prereq) + '</p>';
    var body = root.querySelector('.doc-body'); body.insertBefore(start,body.firstChild);
    var found = Object.keys(terms).filter(function (term) { return ch.content.indexOf(term) >= 0; }).slice(0,5);
    if (found.length) {
      var glossary = document.createElement('details'); glossary.className='chapter-glossary';
      glossary.innerHTML='<summary>遇到术语？展开随手查（' + found.length + ' 项）</summary><dl>' + found.map(function (term) {return '<dt>' + esc(term) + '</dt><dd>' + esc(terms[term]) + '</dd>';}).join('') + '</dl>';
      body.insertBefore(glossary,start.nextSibling);
    }
    var note = document.createElement('details'); note.className='practice-notes';
    note.innerHTML='<summary>记录一次练习：目标、问题与下一步</summary><label for="practice-reflection">今天完成了什么？哪一处改变最有效？下次只修什么？</label><textarea id="practice-reflection" maxlength="1600" rows="4" placeholder="例如：远侧眼过宽；缩窄眼框后转头更清楚；下次检查鼻梁遮挡。"></textarea><p class="note-state" role="status">记录仅保存在本浏览器，可复制后自行备份。</p>';
    body.appendChild(note);
    var text = note.querySelector('textarea'), noteKey='cel-atelier-note-' + mod.id + '-' + ch.id;
    text.value = safeGet(noteKey,'');
    text.addEventListener('input',function(){try{localStorage.setItem(noteKey,JSON.stringify(text.value));note.querySelector('.note-state').textContent='已保存到本浏览器。';}catch(e){note.querySelector('.note-state').textContent='浏览器存储不可用，请复制文字自行保存。';}});
  }
  window.LEARNING={init:init,renderFigure:renderFigure};
})();
