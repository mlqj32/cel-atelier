/* Curated real tools. Chinese names lead; original names disambiguate versions. */
(function () {
  'use strict';
  var sources = [
    { name: 'Procreate 官方中文画笔库手册', url: 'https://help.procreate.com/cn/procreate/handbook/brushes/brush-library', note: '核对 5.4 的经典库、分类及搜索入口。' },
    { name: 'Procreate 中文名称对照表', url: 'https://www.bishua.art/combination/procreate_brush.html', note: '第三方旧版名称对照，仅用于核对译名；不需下载本站笔刷包。' },
    { name: 'CSP 官方中文：线条或填充用工具', url: 'https://help.clip-studio.com/zh-tw/manual_tc/240_brushes/線條或填充用工具.htm', note: '核对官方界面图中的 G笔、铅笔、水彩圆笔、柔软；繁体名称转为简体。' },
    { name: 'SYSTEMAX 官方 SAI2 开发室', url: 'https://www.systemax.jp/en/sai/devdept.html', note: '核对官方2026-07-02b英文压缩包中的工具原名与历史记录；SAI 的中文汉化名称并不统一。' },
    { name: 'Adobe 官方：创建画笔并设置绘画选项', url: 'https://helpx.adobe.com/cn/photoshop/desktop/apply-painting-techniques/brushes-presets/create-brush-set-painting-options.html', note: '核对圆形笔尖与画笔设置入口；硬边圆、柔边圆也用参数定位。' },
    { name: 'Adobe 官方：添加画笔动态', url: 'https://helpx.adobe.com/cn/photoshop/desktop/apply-painting-techniques/fill-objects-selections-layers/brush-dynamics-settings.html', note: '尺寸压感与不透明度、流量压感是分别设置的。' }
  ];
  function brush(id, name, original, path, use, avoid) { return { id:id, name:name, original:original, path:path, use:use, avoid:avoid }; }
  var software = {
    ipad: {
      name:'Procreate', module:'ipad', lesson:'ch03',
      fit:'适合 iPad 上的头像、Q版、赛璐璐插画和质感小稿。要交可编辑 PSD 时，先导出小样检查分层与混合模式。',
      version:'以下使用真实的经典笔刷名称。5.3 在对应分组中找；5.4 先返回画笔库列表，进入“经典库”，再找分组。中文译名可能变化，括号内原名用于查找同一支笔。',
      fallback:'5.4 可在画笔库顶部下拉搜索原名，并查看其他库的结果。缺少经典库时先查官方帮助；不要从来历不明的整合包补齐。',
      sketch:'pc-pencil', line:'pc-studio', flat:'pc-hard', soft:'pc-soft', texture:'pc-water',
      brushes:[
        brush('pc-pencil','6B 铅笔','6B Pencil','经典库 → 素描 → 6B 铅笔','头部、人体、构图草稿；轻重线和排线习作。','颗粒线有空隙，干净赛璐璐底色不要只靠它围起来直接填色。'),
        brush('pc-studio','工作室笔','Studio Pen','经典库 → 着墨 → 工作室笔','有粗细变化的正式线稿、睫毛、硬边阴影修边。','别把稳定性拉满掩盖控笔问题；它不会自动修正结构。'),
        brush('pc-mono','单线','Monoline','经典库 → 书法 → 单线','等粗轮廓、Q版贴纸、封闭形状；固定粗细的轨迹练习。','默认等粗，不适合拿来验收“轻重压感产生粗细变化”。'),
        brush('pc-hard','硬画笔','Hard Brush','经典库 → 气笔修饰 → 硬画笔','平涂补漏、选区内铺色、赛璐璐一阴与小块高光。','若平涂重叠变深，检查实际不透明度和压力透明度；名称不保证参数没改过。'),
        brush('pc-soft','软画笔','Soft Brush','经典库 → 气笔修饰 → 软画笔','腮红、少量柔光、蒙版上的柔和过渡。','不要用它沿整张线稿描边，也不要把所有投影边缘喷糊。'),
        brush('pc-water','水彩','Watercolor','经典库 → 上漆 → 水彩','水彩质感小稿、背景色块、局部透明叠色。','不是物理水彩模拟，也不能保证复现另一软件的混色。')
      ], sources:[0,1]
    },
    sai2: {
      name:'SAI2', module:'sai2', lesson:'ch03',
      fit:'适合电脑与数位板上的线稿、头像、Q版和赛璐璐稿；水彩工具可用于局部混色。原生工程先保留，再测试 PSD 交换。',
      version:'SAI2 存在不同技术预览版本，第三方汉化用词也不同。本页用中文说明真实工具，并附英文原名；“铅笔/通常笔”不是声称官方有统一中文译名。',
      fallback:'中文名称对不上时，在绘画工具格的右键菜单核对 Pencil、Water Color、AirBrush。保留现有工具，在空工具格创建对应工具；不要求安装第三方笔刷。',
      sketch:'sai-pencil', line:'sai-pencil', flat:'sai-pencil', soft:'sai-air', texture:'sai-water',
      brushes:[
        brush('sai-pencil','铅笔（部分汉化称“通常笔”）','Pencil','绘画工具格 → Pencil 工具','草稿、压感勾线、平涂和硬边阴影；同一真实工具可复制后分别调参。','“通常笔”不是额外必须下载的笔刷；关闭混色后再做干净平涂。'),
        brush('sai-water','水彩笔','Water Color','绘画工具格 → Water Color 工具','半厚涂小稿、两色混合、皮肤或布料的局部过渡。','不是只能画软边；边缘和混色受参数影响，不要把整张赛璐璐揉成灰泥。'),
        brush('sai-air','喷枪','AirBrush','绘画工具格 → AirBrush 工具','少量腮红、环境色和软过渡。','不代替清晰的阴影形状，也不用于检查线条是否稳定。')
      ], sources:[3]
    },
    csp: {
      name:'Clip Studio Paint', module:'csp', lesson:'ch05',
      fit:'适合需反复改线的插画、头像、立绘、黑白漫画与条漫。矢量图层方便修线；平涂、混色与网点要使用相应图层或功能。',
      version:'按官方中文手册的真实默认子工具整理，繁体字转为简体。国际版 CSP、简约模式与优动漫 PAINT 的名称、分组和默认素材可能不同；这里不把它们当作完全相同的版本。',
      fallback:'先切到工作室模式查子工具。若误删默认工具，用子工具面板菜单“添加初始子工具”（界面译名可能不同）；旧版缺少新版子工具时使用本页的 G笔完成硬边练习，或从官方素材渠道查对应版本。',
      sketch:'csp-pencil', line:'csp-g', flat:'csp-g', soft:'csp-soft', texture:'csp-water',
      brushes:[
        brush('csp-pencil','铅笔','Pencil','草稿/铅笔工具 → 铅笔','结构、动态、头像构图及有铅笔质感的草稿。','不写成 Procreate 的“6B 铅笔”；不要用纹理边缘检查干净填色。'),
        brush('csp-g','G 笔','G-pen','沾水笔/钢笔工具 → G笔','压感线稿、漫画勾线、硬边修边；在栅格层上可做平涂补漏。','矢量层适合修线，底色另放栅格层；不要期待它自动填好闭合区域。'),
        brush('csp-water','水彩圆笔','Round watercolor brush','毛笔/画笔工具 → 水彩 → 水彩圆笔','水彩质感插画、透明色块与局部叠色；先在栅格层试混色。','不用于整块不透明的赛璐璐底色；不要默认每个旧版本都已安装。'),
        brush('csp-soft','柔软','Soft','喷枪工具 → 柔软','腮红、柔光和小范围软边处理。','黑白漫画的灰色喷涂不等于规范网点；网点使用图层属性等相应功能。')
      ], sources:[2]
    },
    ps: {
      name:'Photoshop', module:'ps', lesson:'ch02',
      fit:'可以直接绘制头像、赛璐璐及半厚涂，也适合后期和 PSD 分层交付。若已有主绘软件，可先只学调色、蒙版、导出。',
      version:'以桌面版为范围。“硬边圆/柔边圆”指真实的基础圆形画笔，中文预设标签可能因版本而异；下列同时给出可复现的笔尖参数，避免找不到某个标签。不是虚构的画师专用笔刷。',
      fallback:'打开“窗口 → 画笔/画笔设置”，在常规画笔中找基础圆形笔尖。硬边圆用硬度100%，柔边圆用硬度0%；关闭纹理、散布和双重画笔后画测试线。需要粗细压感，再在形状动态中设“笔压力”。',
      sketch:'ps-hard', line:'ps-hard', flat:'ps-hard', soft:'ps-soft', texture:'ps-hard',
      brushes:[
        brush('ps-hard','硬边圆画笔','Hard Round','画笔 → 常规画笔 → 硬边圆；或圆形笔尖 + 硬度100%','草稿、线稿、平涂、硬阴影与半厚涂色块。尺寸压感可单独开启。','平涂要检查不透明度、流量及其压力控制；100%硬度不等于二值无抗锯齿。'),
        brush('ps-soft','柔边圆画笔','Soft Round','画笔 → 常规画笔 → 柔边圆；或圆形笔尖 + 硬度0%','腮红、少量柔光；在蒙版上用黑白画柔和的隐藏/显示过渡。','不能恢复丢失细节；蒙版修饰时先确认选中的是蒙版缩略图。')
      ], sources:[4,5]
    }
  };
  var tasks = [
    {id:'line',name:'控笔与线条练习',roles:['line'],steps:['固定画布和缩放，先画10条等粗直线、10条C形、10条S形。','再开启或检查尺寸压感，画10条轻—重—轻的线；等粗练习与压感练习分别验收。','同一组线各做低稳定和中稳定两版，记录设置，比较跟手、转折和收笔。'],check:'看一笔完成率、转折和轻重变化；不用自动直线或极高防抖的结果冒充徒手控笔。',note:'建议起点：2000px 方画布、约4～10px的最终线宽，按输出观感校准。Procreate尺寸百分比不是像素。'},
    {id:'structure',name:'头部、人体与构图练习',roles:['sketch'],steps:['用一支笔画球、盒、柱和十字线，先分清前后与朝向。','头部练三视角；人体先画动态线和胸腔、骨盆，再加四肢。','降低草稿图层透明度，在新层重画一次结构，不靠反复涂黑掩盖定位。'],check:'验收比例、朝向、五官是否落在同一结构上；换笔刷不会自动解决这些问题。',note:'起稿可在低不透明度图层上画，不必让每一笔都半透明；先固定一支笔练两周。'},
    {id:'cel',name:'赛璐璐头像、半身与立绘',roles:['sketch','line','flat','soft'],steps:['草稿确认结构，用勾线笔画轮廓与五官，脸、发、衣服的线条分主次。','底色用填充工具或选区填色，硬边笔只补漏；底色和线稿分层。','一阴先用选区填充或硬边笔画清楚形状；小块高光也用硬边笔。','软笔仅少量画腮红或柔光。缩到交付尺寸，检查漏白、锯齿和模糊边。'],check:'提交草稿、线稿、底色、一阴、成稿五张阶段图；阴影形状明确，软过渡有具体用途。',note:'头像、半身和立绘主要差在复杂度与交付规格，不需要分别购买“头像笔刷”“立绘笔刷”。'},
    {id:'q',name:'Q版、贴纸与表情包',roles:['sketch','line','flat'],steps:['先画能在小尺寸看清的轮廓和表情，删掉无效细节。','想要等粗轮廓时，Procreate可用单线；其他软件可关闭基础硬边笔的尺寸压感。','用填充铺大色块，少量硬边阴影。按约定透明背景和实际输出大小导出。'],check:'按最终显示大小查看：表情可辨、轮廓不糊，透明边缘无白圈。',note:'同一套基础笔即可完成；是否等粗由风格决定，不是Q版必须使用单线。'},
    {id:'paint',name:'水彩感、半厚涂小稿',roles:['sketch','texture','soft'],steps:['先用硬边色块确定亮暗和大形，水彩感小稿也先定主色。','用推荐水彩笔局部叠色；Photoshop方案直接用硬边圆选中间色衔接，不需要假称为内置“水彩笔”。','保留焦点和转折处硬边，只在需要的区域混合；另存保留笔触的版本作对照。'],check:'缩小后体积和主体仍可读，颜色没有全揉成灰，软硬边有主次。',note:'水彩感与半厚涂不是同一种风格；这里给的是可开始的小稿方案。基础硬圆也能半厚涂，纹理不是深度的替代品。'},
    {id:'comic',name:'黑白漫画与条漫',roles:['line','flat'],steps:['漫画线稿优先用G笔或对应软件的硬边勾线笔；黑块用填充处理。','需要规范网点时优先使用CSP的网点功能，按最终分辨率检查摩尔纹；不是用一支“网点神笔”解决。','条漫按阅读方向检查气泡、分格、文字尺寸和导出切片；画笔只解决其中的笔迹。'],check:'按最终印刷或屏幕尺寸检查线稿和网点；彩色条漫还要检查文字可读性与色彩层级。',note:'漫画与条漫优先考虑CSP的分格、气泡、网点与页面功能；其他软件也能画线，但需另行安排排版与导出。'},
    {id:'live2d',name:'Live2D 分层原画',roles:['sketch','line','flat'],steps:['先和绑定方确定分层规范与PSD尺寸，画线稿和底色时就按部位组织图层。','头发、眼睛、嘴、衣服按约定拆分；把被遮住但运动时会露出的区域补画完整。','用硬边笔清理透明边缘，软光效果单独放层；先导出一个小样PSD给Cubism测试，再继续精修。'],check:'检查层名、透明边缘、遮挡补画，以及目标版本Cubism中的PSD导入结果；需要原生工程和导出对照。',note:'优先选择能满足分层与PSD交换要求的软件：CSP或Photoshop常方便检查工程；SAI2、Procreate也需先测试导出兼容性。Live2D Cubism负责绑定动画，不用它来挑选插画笔刷。'}
  ];
  var setup = {
    ipad:['先用默认工作室笔画轻重线；若一重就变透明，在画笔工作室检查Apple Pencil的透明度响应，先减少这项变化。','硬画笔做平涂时，用正常图层、不透明度100%起步并画交叉测试；检查压力是否还在改变覆盖。','勾线稳定性从默认或较低值开始；改流线时只改一项。尺寸百分比按实际笔迹校准，不照抄像素。'],
    sai2:['以官方2026-07-02b英文版的Pencil、AirBrush、Water Color原名核对，汉化里的“通常”只是可能的译名。','Pencil先用无纹理圆形笔尖、浓度100%测试；需要压感粗细时检查尺寸压力与最小尺寸，最小尺寸约10%可作为起点。','平涂不要混色；勾线不要照抄某个S级防抖到所有版本。从低档到中档各画5条S线，选能保住转折的一档。'],
    csp:['G笔先用不透明度100%，低到中等的修正/稳定设置；画10条轻重线确认尺寸压感有效。','需要可改线形时用矢量层勾线；底色另建栅格层，使用填充，G笔只补漏。','铅笔用于结构草稿，水彩圆笔用于质感叠色；柔软喷枪只处理少量软边，不替代所有阴影。'],
    ps:['硬边圆用圆形笔尖、圆度100%、硬度100%定位；关散布、纹理、双重画笔，间距约5%～10%可作测试起点。','勾线在“画笔设置→形状动态”把大小控制设为笔压力；平涂先用不透明度与流量100%，关闭二者的压力变化。','柔边圆用硬度0%定位，少量低不透明度用于腮红或蒙版；蒙版上用黑白时先确认选中蒙版。']
  };
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function find(s,id) { return s.brushes.filter(function(b){return b.id===id;})[0]; }
  var roleNames={sketch:'草稿',line:'线条',flat:'平涂与硬阴影',soft:'可选软过渡',texture:'局部上色'};
  function mount(el, initial) {
    var selected=software[initial]?initial:'ipad';
    el.innerHTML='<header class="brush-hero"><p class="brush-eyebrow">零基础工具卡 · 可查来源</p><h1>这张稿，用哪支笔？</h1><p>先选软件，再选练习或稿件。中文名称、真实入口、用途和验收放在一起；无需先买笔刷包。</p><a href="#/roadmap" data-nav>先看零基础学习路线 →</a></header><section class="brush-picker" aria-label="选择用笔方案"><label>你使用的软件<select id="brush-software">'+Object.keys(software).map(function(id){return '<option value="'+id+'"'+(id===selected?' selected':'')+'>'+software[id].name+'</option>';}).join('')+'</select></label><label>你要画什么<select id="brush-task">'+tasks.map(function(t){return '<option value="'+t.id+'">'+t.name+'</option>';}).join('')+'</select></label></section><div id="brush-recommendation"></div><section class="brush-section"><h2>先用三步，认清手里的笔</h2><ol><li>画一条轻—重—轻的线：观察尺寸是否变化；压感输入和尺寸映射要同时有效。</li><li>同色画两笔交叉：观察重叠是否加深；平涂要先排除不透明度、流量、混色和纹理的影响。</li><li>画一块硬阴影，再只软化一个小角：看清硬边笔与软笔各在解决什么问题。</li></ol><p>这里的用途和练习参数是本站教学建议，来源用于核对工具存在与功能。没有哪支笔是某类稿件唯一指定的答案。</p></section><section class="brush-section"><h2>来源与版本核对</h2><p>核对日期：2026-11-15。中文名称优先，英文原名只作查找依据。默认配置可被重命名、移动或删除；找不到时先核对库和版本。</p><div class="brush-sources">'+sources.map(function(s){return '<article><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.name)+' ↗</a><p>'+esc(s.note)+'</p></article>';}).join('')+'</div></section>';
    var sw=el.querySelector('#brush-software'), task=el.querySelector('#brush-task');
    function update() {
      var s=software[sw.value],t=tasks.filter(function(x){return x.id===task.value;})[0], seen={};
      if(sw.value==='ipad' && t.id==='q') s=Object.assign({},s,{line:'pc-mono'});
      var picks=t.roles.map(function(role){var b=find(s,s[role]); if(seen[b.id])return ''; seen[b.id]=true; return '<article class="brush-card"><p class="brush-role">'+esc(t.roles.filter(function(r){return s[r]===b.id;}).map(function(r){return roleNames[r];}).join(' / '))+'</p><h3>'+esc(b.name)+'</h3><p class="brush-original">原名：'+esc(b.original)+'</p><dl><dt>在哪里找</dt><dd>'+esc(b.path)+'</dd><dt>这次怎么用</dt><dd>'+esc(b.use)+'</dd></dl></article>';}).join('');
      el.querySelector('#brush-recommendation').innerHTML='<section class="brush-section brush-context"><h2>'+esc(s.name)+' · '+esc(t.name)+'</h2><p>'+esc(s.fit)+'</p><p class="brush-version">'+esc(s.version)+'</p></section><div class="brush-cards">'+picks+'</div><section class="brush-section"><h2>照着做一遍</h2><p>'+esc(t.note)+'</p><ol>'+t.steps.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><p class="brush-check"><strong>完成后检查：</strong>'+esc(t.check)+'</p><a href="#/m/'+s.module+'/'+s.lesson+'" data-nav>进入 '+esc(s.name)+' 软件课 →</a></section><section class="brush-section"><h2>'+esc(s.name)+' 的基础用笔清单</h2><p>以下都是实际工具。先保留默认笔，在副本中一次改一个参数；复制后自定的名字不当作官方预设。</p><div class="brush-catalog">'+s.brushes.map(function(b){return '<article><h3>'+esc(b.name)+'</h3><p class="brush-original">'+esc(b.original)+'</p><p><strong>入口：</strong>'+esc(b.path)+'</p><p><strong>适合：</strong>'+esc(b.use)+'</p><p><strong>别误用：</strong>'+esc(b.avoid)+'</p></article>';}).join('')+'</div><h3>起步设置：每次只改一项</h3><ol>'+setup[sw.value].map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol><h3>找不到怎么办？</h3><p>'+esc(s.fallback)+'</p><p class="brush-source-links">核对依据：'+s.sources.map(function(i){return '<a href="'+esc(sources[i].url)+'" target="_blank" rel="noopener">'+esc(sources[i].name)+'</a>';}).join(' · ')+'</p></section>';
    }
    sw.addEventListener('change',update); task.addEventListener('change',update); update();
  }
  // Put concrete names beside existing practice, before learning.js composes lessons.
  function insert(moduleId,chapterId,text) {
    var m=window.CONTENT[moduleId],c=m&&m.chapters.filter(function(x){return x.id===chapterId;})[0];
    if(c)c.content='## 开练前：这次用什么笔\n\n'+text+'\n\n'+c.content;
  }
  Object.keys(software).forEach(function(id){var s=software[id];insert(id,s.lesson,s.brushes.map(function(b){return '**'+b.name+'**：'+b.path+'；'+b.use;}).join('\n\n')+'\n\n'+s.version+'\n\n[按稿件查看用笔步骤、排错与来源](#/brushes/'+id+')。');});
  var common='Procreate用**工作室笔**（经典库→着墨）；SAI2用**铅笔**（Pencil，部分汉化称通常笔）；CSP用**G笔**；Photoshop用**硬边圆画笔**（圆形笔尖、硬度100%）。这是四选一，不必四套都练。';
  insert('fundamentals','ch01',common+'先做等粗轨迹，再做轻重压感线。Procreate的**单线**可练等粗轨迹，但默认不适合验收压感粗细。\n\n[查看具体入口和练法](#/brushes)。');
  insert('practice','ch02',common+'固定画布、笔刷和缩放，保存第一天样本；稳定器不要拉满。尺寸压感与不透明度压感分别检查。\n\n[打开控笔用笔指南](#/brushes)。');
  ['ch03','ch04'].forEach(function(ch){insert('practice',ch,'结构起稿：Procreate用**6B铅笔**（经典库→素描），SAI2用**铅笔**（Pencil），CSP用**铅笔**，Photoshop用**硬边圆画笔**。只选择你正在使用的软件；先看体块和朝向，再追求笔迹。\n\n[按软件查入口](#/brushes)。');});
  var flat='Procreate用**硬画笔**补色、**工作室笔**修线；SAI2用关闭混色的**铅笔**（Pencil）；CSP用**G笔**在栅格层补色；Photoshop用**硬边圆画笔**。大块底色和阴影先用填充或选区填色，软笔只留给少量腮红和柔光。\n\n[查看赛璐璐及立绘用笔步骤](#/brushes)。';
  insert('practice','ch05',flat); insert('cel','ch01',flat);
  insert('start','ch04','数字绘画先学会一个软件的新建、画线、保存、导出，再边练造型边查软件课；不必等学完所有理论才开软件。练习体系从第一天并行，软件模块四选一，Live2D与逆向工程留作按需选修。\n\n[查看完整零基础顺序](#/roadmap) · [查看真实笔刷用法](#/brushes)。');
  window.BRUSH_GUIDE={software:software,tasks:tasks,sources:sources,mount:mount};
})();
