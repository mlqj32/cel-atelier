/* ═══════════════════════════════════════════════════════════════
   CEL ATELIER · App
   路由 / 首页 / 模块页 / 章节页 / 搜索 / 进度 / 特效
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function interactiveIds(content) {
    var ids = [], re = /```demo:([\w-]+)/g, match;
    while ((match = re.exec(content || ''))) {
      if (window.DEMOS[match[1]] && !window.DEMOS[match[1]].kind && ids.indexOf(match[1]) < 0) ids.push(match[1]);
    }
    return ids;
  }

  /* ─────────── Icons ─────────── */
  var ICONS = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    map: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/><path d="M2 12h20"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.3 6.1-6.1 2.3 2.3-6.1 6.1-2.3z"/>',
    pencil: '<path d="M14.5 3.5l6 6L9 21H3v-6L14.5 3.5z"/><path d="M12 6l6 6"/>',
    layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
    tablet: '<rect x="4" y="2" width="16" height="20" rx="3"/><path d="M11 18h2"/>',
    brush: '<path d="M14.5 3.5l6 6-9.5 9.5c-1.6 1.6-4.2 1.6-5.8 0s-1.6-4.2 0-5.8L14.5 3.5z"/><path d="M6 21c-1.5 0-2.5-1-2.5-2.5S5 16 6 16"/>',
    vector: '<path d="M4 20L20 4"/><rect x="2" y="18" width="4" height="4" rx="1"/><rect x="18" y="2" width="4" height="4" rx="1"/><circle cx="12" cy="12" r="2.5"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    wave: '<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/><path d="M2 18c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity=".5"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7v.5"/><path d="M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    spark: '<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/>',
    play: '<path d="M5 3l14 9-14 9V3z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    palette: '<circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="16" cy="9" r="1.2"/><path d="M12 22c-2 0-3-1-3-2.5 0-1.5 2-2 2-3.5 0-1-1-2-2.5-2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    feather: '<path d="M20.2 3.8a6 6 0 0 0-8.5 0L4 11.5V20h8.5l7.7-7.7a6 6 0 0 0 0-8.5z"/><path d="M14 6l4 4M4 20L14 10"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
  };
  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"' +
      (size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '') + '>' + (ICONS[name] || ICONS.spark) + '</svg>';
  }

  /* ─────────── 模块元数据 ─────────── */
  var MOD_META = [
    { id: 'start', title: '入门前夜', en: 'BEFORE THE FIRST STROKE', icon: 'compass', color: '#ff8fc7',
      tagline: '先看清全貌，再落第一笔', minutes: '≈ 3 小时',
      description: '二次元插画的地图：风格分野、工具选型、文件规格、参考方法与学习路径。先把方向搞对，后面的每一笔都不白画。' },
    { id: 'fundamentals', title: '造型地基', en: 'FUNDAMENTALS', icon: 'pencil', color: '#7fe9ff',
      tagline: '线条、结构、透视与人体', minutes: '≈ 12 小时',
      description: '从一根有呼吸的线开始，练头骨、五官、头发、人体比例、动态、衣褶、构图和明暗。赛璐璐不是遮丑的滤镜，地基不稳，上色越干净越暴露问题。' },
    { id: 'cel', title: '赛璐璐专精', en: 'CEL SHADING', icon: 'layers', color: '#ffd79a',
      tagline: '把光切成可以练习的形状', minutes: '≈ 14 小时', core: true, feature: true,
      description: '全站核心：色阶系统、阴影形状、闭塞、高光、边缘光、色相偏移、图层结构、材质专项，以及一套从草稿到成图的完整工业流程。' },
    { id: 'ipad', title: 'iPad · Procreate', en: 'PROCREATE', icon: 'tablet', color: '#b9a6ff',
      tagline: '从 Apple Pencil Pro 到成图', minutes: '≈ 8 小时',
      description: '以最新款 iPad Pro 与 Apple Pencil Pro 为基准，讲透 Procreate 的手势、笔刷引擎、图层混合、选区变换、动画辅助与导出工作流。' },
    { id: 'sai2', title: 'SAI2', en: 'PAINT TOOL SAI 2', icon: 'brush', color: '#8ef0cf',
      tagline: '勾线与水彩的老派手感', minutes: '≈ 7 小时',
      description: 'SAI2 为什么仍是勾线神器：防抖、笔压曲线、水彩边界、剪贴蒙版与极轻的笔触延迟。含赛璐璐上色全流程与跨软件协作。' },
    { id: 'csp', title: 'Clip Studio Paint', en: 'CLIP STUDIO PAINT', icon: 'vector', color: '#8fb8ff',
      tagline: '矢量线稿与漫画工业', minutes: '≈ 9 小时',
      description: 'CSP 的版本选购、矢量图层、网点、3D 人偶、自动上色、动画时间轴与云协作。适合长期连载、商稿与需要反复修改的线稿。' },
    { id: 'ps', title: 'Photoshop 后期', en: 'POST PRODUCTION', icon: 'camera', color: '#a0a8ff',
      tagline: '把画面收成一张作品', minutes: '≈ 7 小时',
      description: '绘画向 PS：混合模式、曲线、色阶、渐变映射、Camera Raw、液化、锐化与纹理叠加。把软件里画完的图，变成能交付的成图。' },
    { id: 'live2d', title: 'Live2D', en: 'LIVE2D CUBISM', icon: 'wave', color: '#5fe0d0',
      tagline: '让角色呼吸起来', minutes: '≈ 9 小时',
      description: '从分层规范到网格变形、参数系统、物理演算、表情与口型，完整做一个会呼吸、会眨眼、能接 VTube Studio 的角色。' },
    { id: 'career', title: '接稿与商业', en: 'COMMISSION', icon: 'briefcase', color: '#ffb86b',
      tagline: '米画师 · 画加 · 报价与合同', minutes: '≈ 8 小时',
      description: '平台入驻、作品集、定价模型、稿件类型、合同版权、甲方沟通、修改轮次、交付规范与个人品牌。把画技变成可持续的收入。' },
    { id: 'safety', title: '互联网安全', en: 'SAFETY & FRAUD DEFENSE', icon: 'lock', color: '#ff8a5c',
      tagline: '接稿先保命，再谈稿费', minutes: '≈ 8 小时', feature: true,
      description: '画师接稿的防骗、隐私、网暴与境外平台生存指南：假甲方、假付款、扫码任务、私下交易、园区诈骗、网暴应对，以及 X / Pixiv / Telegram 的选择。' },
    { id: 'reverse', title: '逆向工程', en: 'IMAGE REVERSE ENGINEERING', icon: 'search', color: '#7de2ca', feature: true,
      tagline: '从像素、文件到可验证的证据',
      description: '拆解插画文件：软件识别、EXIF/XMP、时间追溯、PNG/JPEG/PSD 结构、水印与信息损失、SVG 转绘，以及成品能否重建分层工程。用小实验区分事实、线索和猜测。' },
    { id: 'r18', title: 'R18 审稿边界', en: 'ADULT CONTENT REVIEW', icon: 'shield', color: '#ff9a9a',
      tagline: '规则、同意与职业判断', minutes: '≈ 5 小时',
      description: '以审稿人与接稿人双视角，讲清 R18/R15/软色情的边界、平台政策、年龄表征、同意伦理、构图遮挡与商业风险，并给出 20 项检查清单。' },
    { id: 'myths', title: '迷思与真相', en: 'MYTHS & TRUTH', icon: 'help', color: '#c9a4ff',
      tagline: '买书、素描、童子功与天赋', minutes: '≈ 6 小时',
      description: '学插画要不要买书？要不要从传统素描开始？是不是童子功？报班还是自学？临摹算不算抄袭？AI 时代还值不值得学？给出条件、例子与可验证的做法。' },
    { id: 'practice', title: '练习体系', en: 'PRACTICE SYSTEM', icon: 'target', color: '#c6f27e',
      tagline: '30 天计划与反馈闭环', minutes: '≈ 6 小时',
      description: '诊断短板、线条 7 天、头部 14 天、人体 30 天、赛璐璐 21 天、完整作品 7 步法、30 天冲刺表与作品集构建。把知道变成会画。' }
  ];

  function meta(id) { for (var i = 0; i < MOD_META.length; i++) if (MOD_META[i].id === id) return MOD_META[i]; return null; }
  function mod(id) {
    var base = meta(id);
    var c = window.CONTENT && window.CONTENT[id];
    if (!base) return c || null;
    if (!c) return Object.assign({}, base, { chapters: [] });
    return Object.assign({}, base, c, { chapters: c.chapters || [] });
  }
  function allMods() { return MOD_META.map(function (m) { return mod(m.id); }).filter(Boolean); }
  function totalChapters() { return allMods().reduce(function (n, m) { return n + (m.chapters ? m.chapters.length : 0); }, 0); }

  /* ─────────── 进度存储 ─────────── */
  var KEY = 'cel-atelier-progress';
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } },
    set: function (k, v) { var d = this.get(); d[k] = v; try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    has: function (k) { return !!this.get()[k]; },
    count: function () { var d = this.get(), n = 0; for (var k in d) if (d[k]) n++; return n; }
  };
  function ck(m, c) { return m + '/' + c; }
  function modDone(m) {
    var n = 0; (m.chapters || []).forEach(function (c) { if (store.has(ck(m.id, c.id))) n++; }); return n;
  }

  /* ─────────── DOM refs ─────────── */
  var view = $('#view');
  var layout = $('#layout');
  var sidebar = $('#sidebar');

  /* ─────────── Topnav ─────────── */
  function closeModuleMenu() {
    var dd = $('#nav-dd'), btn = $('#nav-dd-btn');
    if (dd) dd.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  function positionModuleMenu() {
    var dd = $('#nav-dd'), btn = $('#nav-dd-btn'), menu = $('#nav-dd-menu');
    if (!dd || !btn || !menu || !dd.classList.contains('open')) return;
    if (!btn.getClientRects().length) { closeModuleMenu(); return; }
    var anchor = btn.getBoundingClientRect(), parent = dd.getBoundingClientRect();
    var viewport = document.documentElement.clientWidth;
    // Keep coordinates in the dropdown's containing block, including when the
    // fixed topbar uses backdrop-filter. Viewport centering detaches the menu.
    var left = Math.max(16, Math.min(anchor.left, viewport - menu.offsetWidth - 16));
    var top = anchor.bottom + 12;
    menu.style.left = (left - parent.left) + 'px';
    menu.style.top = (top - parent.top) + 'px';
    menu.style.maxHeight = Math.max(0, window.innerHeight - top - 16) + 'px';
  }
  var MODULE_GROUPS = [
      { title:'入门主线', hint:'按阶段推进', ids:['start','fundamentals','cel','practice'], badges:['01 起点','03 地基','04 成图','同步练习'] },
      { title:'02 软件上手', hint:'先选一个，不必全学', ids:['ipad','sai2','csp','ps'], badges:['iPad','电脑','电脑 / 平板','主绘 / 后期'] },
      { title:'准备接稿时', hint:'先有作品，再练交付', ids:['safety','career','r18'], badges:['先看防骗','交付流程','按需审稿'] },
      { title:'按目标选修', hint:'不作为入门前置', ids:['live2d','reverse','myths'], badges:['绑定动画','文件技术','随时查阅'] }
  ];
  function buildTopnav(active) {
    var el = $('#topnav');
    var links = [
      { href: '#/home', label: '首页', key: 'home' },
      { href: '#/roadmap', label: '学习路线', key: 'roadmap' }
    ];
    var html = links.map(function (l) {
      return '<a href="' + l.href + '" data-nav class="' + (active === l.key ? 'active' : '') + '">' + l.label + '</a>';
    }).join('');
    html += '<div class="nav-dd" id="nav-dd"><button type="button" class="nav-dd-btn" id="nav-dd-btn" aria-controls="nav-dd-menu" aria-expanded="false">' + icon('grid') + '<span>全部模块</span><svg class="nav-dd-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg></button><div class="nav-dd-menu" id="nav-dd-menu" aria-label="学习模块">';
    MODULE_GROUPS.forEach(function (group) {
      html += '<section class="dd-group"><h3>' + group.title + '</h3><p>' + group.hint + '</p>';
      group.ids.forEach(function (id,i) { var m=meta(id);
        html += '<a href="#/m/' + m.id + '" data-nav class="dd-item" style="--mc:' + m.color + '"><i></i><span>' + m.title + '</span><small>' + group.badges[i] + '</small></a>';
      });
      html += '</section>';
    });
    html += '<a href="#/atlas" data-nav class="dd-item wide"><i style="--mc:#ff8fc7"></i><span>图解与例图总览 · VISUAL ATLAS</span></a>';
    html += '</div></div>';
    el.innerHTML = html;

    var dd = $('#nav-dd');
    var btn = $('#nav-dd-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dd.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) positionModuleMenu();
      });
      document.addEventListener('click', closeModuleMenu);
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          positionModuleMenu();
          $('.dd-item', dd).focus();
        }
      });
      dd.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModuleMenu();
          btn.focus();
        }
      });
      dd.addEventListener('focusout', function (e) {
        if (!dd.contains(e.relatedTarget)) closeModuleMenu();
      });
      dd.addEventListener('click', function (e) { e.stopPropagation(); });
    }
  }

  /* ─────────── Sidebar ─────────── */
  function buildSidebar(m, activeCh) {
    if (!m) {
      layout.classList.add('no-sidebar');
      setSidebarOpen(false);
      $('#sidebar-head').innerHTML='<div class="sb-title">学习导航</div><div class="sb-tagline">主线按阶段，软件先选一个</div>';
      $('#sidebar-nav').innerHTML=MODULE_GROUPS.map(function(group){return '<section class="sb-module-group"><h3>'+group.title+'</h3><p>'+group.hint+'</p>'+group.ids.map(function(id,i){var m=meta(id);return '<a class="sb-item" href="#/m/'+id+'" data-nav><span>'+esc(m.title)+'</span><small>'+group.badges[i]+'</small></a>';}).join('')+'</section>';}).join('')+'<a class="sb-item" href="#/atlas" data-nav>图解与例图总览 →</a>';
      $('#sidebar-foot').innerHTML='<span class="kbd-hint">练习与主线同步进行，选修按目标学习。</span>';
      return;
    }
    layout.classList.remove('no-sidebar');
    document.documentElement.style.setProperty('--mod', m.color);
    var done = modDone(m);
    var pct = m.chapters.length ? Math.round(done / m.chapters.length * 100) : 0;
    $('#sidebar-head').innerHTML =
      '<div class="sb-mod-color">' + esc(m.en) + '</div>' +
      '<div class="sb-title">' + esc(m.title) + '</div>' +
      '<div class="sb-tagline">' + esc(m.tagline || '') + '</div>' +
      '<div class="sb-progress"><div class="bar"><div class="fill" style="width:' + pct + '%"></div></div>' +
      '<div class="txt">已完成 ' + done + ' / ' + m.chapters.length + ' 章 · ' + pct + '%</div></div>';
    var html = '';
    m.chapters.forEach(function (c, i) {
      var isDone = store.has(ck(m.id, c.id));
      html += '<a class="sb-item' + (c.id === activeCh ? ' active' : '') + (isDone ? ' done' : '') + '" href="#/m/' + m.id + '/' + c.id + '" data-nav>' +
        '<span class="sb-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span>' + esc(c.title) + '</span>' +
        '<span class="sb-check">' + icon('check', 13) + '</span></a>';
    });
    $('#sidebar-nav').innerHTML = html || '<div class="kbd-hint" style="padding:10px 4px">本章内容正在写入…</div>';
    $('#sidebar-foot').innerHTML = '<span class="kbd-hint">进度自动保存在本地浏览器 · 章节顶部可标记完成<br><kbd>Ctrl</kbd> + <kbd>K</kbd> 随时搜索</span>';
  }

  /* ─────────── Router ─────────── */
  var currentPage = '';
  function setTitle(t) { document.title = t ? (t + ' · 赛璐璐画室') : '赛璐璐画室 · Cel Atelier — 二次元插画完全修习手册'; }
  function route() {
    document.body.classList.remove('reading-page', 'module-page');
    var hash = location.hash || '#/home';
    var parts = hash.replace(/^#\//, '').split('/');
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeSearch();
    closeLightbox();
    setSidebarOpen(false);
    document.body.classList.remove('menu-open');
    if (parts[0] === 'home' || parts[0] === '') return pageHome();
    if (parts[0] === 'roadmap') return pageRoadmap();
    if (parts[0] === 'brushes') return pageBrushes(parts[1]);
    if (parts[0] === 'atlas') return pageAtlas();
    if (parts[0] === 'm') {
      var m = mod(parts[1]);
      if (m) {
        if (parts[2]) return pageChapter(m, parts[2]);
        return pageModule(m);
      }
    }
    return page404();
  }

  /* ─────────── 首页 ─────────── */
  function moduleCard(m, idx) {
    var done = modDone(m);
    var count = (m.chapters || []).length;
    var pct = count ? Math.round(done / count * 100) : 0;
    return '<a class="mod-card' + (m.core ? ' core' : '') + ' reveal" style="--mc:' + m.color + ';--d:' + (idx * 0.045) + 's" href="#/m/' + m.id + '" data-nav data-spotlight>' +
      '<span class="mod-bg-num">' + String(idx + 1).padStart(2, '0') + '</span>' +
      '<div class="mod-card-top">' +
      '<span class="mod-icon">' + icon(m.icon) + '</span>' +
      '<span class="mod-en">' + esc(m.en || '') + '</span>' +
      (m.core ? '<span class="badge gold" style="margin-left:auto">CORE</span>' : '<span class="mod-no">' + String(idx + 1).padStart(2, '0') + '</span>') +
      '</div>' +
      '<h3>' + esc(m.title) + '<small>' + esc(m.en) + '</small></h3>' +
      '<p class="mod-desc">' + esc(m.tagline) + '</p>' +
      '<div class="mod-meta"><span>' + count + ' 章</span><i class="dot"></i><span>' + '阅读约 ' + m.chapters.reduce(function(n,c){return n + (c.readMinutes || 3);},0) + ' 分钟' + '</span>' +
      (pct ? '<i class="dot"></i><span style="color:var(--mint)">' + pct + '%</span>' : '') +
      '<span class="mod-arrow">' + icon('arrow', 13) + '</span></div>' +
      '</a>';
  }

  function pageHome() {
    currentPage = 'home';
    setTitle('');
    buildTopnav('home');
    buildSidebar(null);
    view.className = 'view home';
    var mods = allMods();
    var chTotal = totalChapters();
    var demoCount = Object.keys(window.DEMOS || {}).filter(function (id) { return !window.DEMOS[id].kind; }).length;
    var diaCount = Object.keys(window.DIAGRAMS || {}).length + Object.keys(window.FIGURES || {}).length;

    var html = '' +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<div class="hero-kicker"><span class="kicker">ANIME ILLUSTRATION ATELIER</span><span class="hline"></span><span class="hero-year">2026 EDITION</span></div>' +
      '<h1><span class="line">把光，</span><span class="line">画成<span class="em grad-text">形状</span><span class="brush-underline">' +
      '<svg viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 C60 6 96 18 140 11 C186 4 226 16 296 8" fill="none" stroke="url(#hero-brush)" stroke-width="6" stroke-linecap="round" opacity=".85"/><defs><linearGradient id="hero-brush" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#ff8fc7"/><stop offset=".55" stop-color="#c0a4ff"/><stop offset="1" stop-color="#7fe9ff"/></linearGradient></defs></svg>' +
      '</span></span></h1>' +
      '<p class="hero-lead">零基础也能从第一根线开始。这里不堆术语，而是把<strong>阴影切成形状</strong>、把<strong>软件拆成工序</strong>：Procreate、SAI2、CSP、PS 后期、Live2D 各自独立成章，配 <span class="hl">可亲手拖动的示例</span> 与手绘图解。</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-primary" href="#/m/start" data-nav>' + icon('compass', 17) + '零基础从这里开始</a>' +
      '<a class="btn btn-ghost" href="#/roadmap" data-nav>' + icon('map', 17) + '看完整学习路线</a>' +
      '<span class="hero-note"><i></i>无需注册 · 进度本地保存</span>' +
      '</div>' +
      '<div class="hero-stats">' +
      '<div class="hstat"><b data-count="' + mods.length + '">0</b><small>独立模块</small></div>' +
      '<div class="hstat"><b data-count="' + chTotal + '">0</b><small>跟练章节</small></div>' +
      '<div class="hstat"><b data-count="' + demoCount + '">0</b><small>交互演示</small></div>' +
      '<div class="hstat"><b data-count="' + diaCount + '">0</b><small>图解 / 例图</small></div>' +
      '</div>' +
      '<div class="hero-scroll"><span class="line"></span>SCROLL TO PAINT</div>' +
      '</div>' +
      '<div class="hero-visual" id="hero-visual">' +
      '<div class="stage-glow"></div><div class="stage-ring"></div>' +
      '<div class="canvas-card" id="hero-canvas">' +
      '<div class="canvas-inner">' +
      '<div class="canvas-topbar"><i></i><i></i><i></i><span>cel_atelier_v03.psd</span></div>' +
      '<div class="canvas-art" id="hero-art"></div>' +
      '<div class="canvas-caption">CEL · 4H · LIGHT FROM UPPER LEFT</div>' +
      '</div>' +
      '<div class="float-panel layers-panel"><div class="panel-title">LAYERS <b>5</b></div>' +
      '<div class="layer-row"><span class="layer-thumb"></span><span>高光 / 边缘光</span><span class="layer-eye"></span></div>' +
      '<div class="layer-row"><span class="layer-thumb"></span><span>二阴 / 闭塞</span><span class="layer-eye"></span></div>' +
      '<div class="layer-row on"><span class="layer-thumb"></span><span>一阴 · 赛璐璐</span><span class="layer-eye"></span></div>' +
      '<div class="layer-row"><span class="layer-thumb"></span><span>底色</span><span class="layer-eye"></span></div>' +
      '<div class="layer-row"><span class="layer-thumb"></span><span>线稿</span><span class="layer-eye"></span></div>' +
      '</div>' +
      '<div class="float-panel swatch-panel"><div class="panel-title">PALETTE</div><div class="wheel"></div><div class="swatch-list"><i></i><i></i><i></i><i></i><i></i></div></div>' +
      '<div class="float-panel brush-panel"><div class="panel-title">BRUSH</div>' +
      '<div class="brush-line"><span class="brush-dot" style="background:#ff8fc7"></span><span class="brush-name">勾线</span><span class="brush-bar"><i style="width:82%;background:#ff8fc7"></i></span></div>' +
      '<div class="brush-line"><span class="brush-dot" style="background:#c0a4ff"></span><span class="brush-name">平涂</span><span class="brush-bar"><i style="width:64%;background:#c0a4ff"></i></span></div>' +
      '<div class="brush-line"><span class="brush-dot" style="background:#7fe9ff"></span><span class="brush-name">水彩</span><span class="brush-bar"><i style="width:45%;background:#7fe9ff"></i></span></div>' +
      '</div>' +
      '<svg class="hero-petal p1" viewBox="0 0 20 20"><path d="M10 1C16 4 19 9 17 15 13 18 7 17 4 13 1 8 4 4 10 1z" fill="url(#pg1)"/><defs><linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd0e4"/><stop offset="1" stop-color="#ff7fae"/></linearGradient></defs></svg>' +
      '<svg class="hero-petal p2" viewBox="0 0 20 20"><path d="M10 1C16 4 19 9 17 15 13 18 7 17 4 13 1 8 4 4 10 1z" fill="#ffc2de"/></svg>' +
      '<svg class="hero-petal p3" viewBox="0 0 20 20"><path d="M10 1C16 4 19 9 17 15 13 18 7 17 4 13 1 8 4 4 10 1z" fill="#c0a4ff" opacity=".8"/></svg>' +
      '<svg class="hero-petal p4" viewBox="0 0 20 20"><path d="M10 1C16 4 19 9 17 15 13 18 7 17 4 13 1 8 4 4 10 1z" fill="#7fe9ff" opacity=".7"/></svg>' +
      '</div>' +
      '</section>' +

      '<section class="sec sec-tight">' +
      '<div class="sec-head"><div class="sec-num">01 — WHY CEL</div><h2 class="sec-title">赛璐璐不是“平涂”，<br>而是一套<span class="grad-text">图形设计</span>方法</h2>' +
      '<p class="sec-sub">它看起来干净，不是因为颜色少，而是因为每一个阴影都被当成一个形状来设计：边界清楚、层级明确、信息可读。学会这套方法，你画厚涂也会更稳。</p></div>' +
      '<div class="intro-grid">' +
      '<div class="intro-card reveal" data-spotlight><span class="intro-idx">01 / SHAPE</span><h3>阴影是形状，不是涂抹</h3><p>先决定光从哪来、结构怎么转，再把阴影概括成有节奏的几何形。形状对了，颜色才有意义。</p><span class="intro-glyph">' + icon('layers') + '</span></div>' +
      '<div class="intro-card reveal" style="--d:.08s" data-spotlight><span class="intro-idx">02 / READ</span><h3>先读得懂，再谈好看</h3><p>眯眼时角色的轮廓、明暗大块、视觉中心是否成立？赛璐璐的每一步都在为“可读性”服务。</p><span class="intro-glyph">' + icon('eye') + '</span></div>' +
      '<div class="intro-card reveal" style="--d:.16s" data-spotlight><span class="intro-idx">03 / LOOP</span><h3>每一笔都有反馈</h3><p>站点里的示例都能拖动、切换、对比。看完立刻动手，把“知道”变成“手会”。</p><span class="intro-glyph">' + icon('spark') + '</span></div>' +
      '</div></section>' +

      '<section class="sec" id="mods">' +
      '<div class="sec-head"><div class="sec-head-row"><div class="sec-head-main"><div class="sec-num">02 — THE ATELIER</div><h2 class="sec-title">十四个房间，一步一步练</h2>' +
      '<p class="sec-sub">软件不混讲。iPad、SAI2、CSP、PS、Live2D 各自是一个独立模块，从界面到工作流完整走一遍；学完一个，再进下一个。</p></div>' +
      '<a class="sec-link" href="#/roadmap" data-nav>按顺序看路线 ' + icon('arrow', 14) + '</a></div></div>' +
      '<div class="mod-grid">' + mods.map(moduleCard).join('') + '</div>' +
      '</section>' +

      '<section class="sec">' +
      '<div class="sec-head"><div class="sec-num">03 — HANDS ON</div><h2 class="sec-title">先拖一下，再决定学不学</h2>' +
      '<p class="sec-sub">下面是课程里最基础的一台「赛璐璐渲染台」。切换渲染方式、开关阴影高光、改变光源方向——同一张线稿，会呈现完全不同的完成度。</p></div>' +
      '<div class="home-demo-wrap"><div class="home-demo-head"><span class="hd-dot"></span><h3>赛璐璐渲染台 · CEL RENDERER</h3><p>拖动右侧控件，观察同一张画的五种完成方式</p><span class="spacer"></span><span class="badge pink">LIVE DEMO</span></div>' +
      '<div style="padding:18px"><div class="demo-mount" data-demo="cel-stage"></div></div></div>' +
      '</section>' +

      '<section class="sec">' +
      '<div class="sec-head"><div class="sec-num">04 — ROADMAP</div><h2 class="sec-title">从第一根线，到第一笔稿费</h2>' +
      '<p class="sec-sub">六个阶段，按能力而不是按软件排序。你可以跳着学，但别跳过地基。</p></div>' +
      '<div class="road">' +
      roadItem('01', '造型地基', '线条控制、头部与五官、人体比例、动态与衣褶。决定你的画“像不像、稳不稳”。', ['fundamentals', 'start'], '#7fe9ff') +
      roadItem('02', '赛璐璐核心', '色阶、阴影形状、闭塞、高光、边缘光、色彩偏移与图层结构。全站的主线。', ['cel'], '#ffd79a') +
      roadItem('03', '软件工坊', 'Procreate / SAI2 / CSP / PS 分别成章，按你的设备与接稿类型选主武器。', ['ipad', 'sai2', 'csp', 'ps'], '#b9a6ff') +
      roadItem('04', '动态表现', 'Live2D 的分层、网格、参数与物理，把一张立绘变成会呼吸的角色。', ['live2d'], '#5fe0d0') +
      roadItem('05', '接稿与边界', '米画师/画加的流程、定价、合同、沟通；以及 R18 稿件的审稿标准与风险。', ['career', 'r18'], '#ffb86b') +
      roadItem('06', '长期主义', '买书、素描、童子功、天赋与 AI 的真相；用 30 天计划把练习变成习惯。', ['myths', 'practice'], '#c6f27e') +
      '</div></section>' +

      '<section class="sec">' +
      '<div class="sec-head"><div class="sec-num">05 — QUESTIONS</div><h2 class="sec-title">那些没人敢直接回答的问题</h2></div>' +
      '<div class="faq">' +
      faq('Q1', '学插画需要买书吗？', '零基础不用先买一堆书。可用图书馆、合法公开教程或已有书启动。按当前问题试读和跟做，厚薄不等于教学质量，伯里曼也不应按学习年份一刀切。书是工具，不是任务。', '#/m/myths') +
      faq('Q2', '需要从传统素描开始练吗？', '不必从石膏几何体练三年。但素描里的“观察—概括—比较”必须学。零基础可以直接画二次元，同时每周做 2 次结构素描或速写，把造型能力补上。', '#/m/myths') +
      faq('Q3', '到底是不是童子功？', '不是。学习受起点、练习、反馈、时间、健康与个体条件等影响，不能只按开始年龄判断。成年人也能提升；具体进度取决于起点、目标与反馈。接稿需要稳定作品和交付能力，不能由年限保证。', '#/m/myths') +
      faq('Q4', 'AI 都能画了，还学吗？', 'AI 降低了“出图”的门槛，但没有降低“判断”的门槛。构图、光影、角色设计、甲方沟通、版权与修改，仍然需要一个能做决定的人。学会画，是为了能指挥和验收。', '#/m/myths') +
      '</div></section>' +

      '<section class="sec sec-tight">' +
      '<div class="band reveal"><div><div class="kicker" style="margin-bottom:14px">START TODAY</div><h2>今天画一笔，<br>明天才有作品集。</h2><p>不用等设备到齐、不用等“有天赋”。打开一个 30 分钟计时器，从线条或一个头像开始。</p></div>' +
      '<div class="band-actions"><a class="btn btn-primary" href="#/m/practice" data-nav>' + icon('target', 17) + '进入 30 天计划</a><a class="btn btn-ghost" href="#/m/start" data-nav>先看学习地图</a></div></div>' +
      '</section>';

    view.innerHTML = html;
    mountDemos(view);
    mountDiagrams(view);
    mountFigures(view);
    initReveals(view);
    initSpotlights(view);
    initCounters(view);
    initHero();
    bindGlobal();
  }

  function roadItem(no, title, desc, ids, color) {
    var tags = ids.map(function (id) {
      var m = meta(id); if (!m) return '';
      return '<a href="#/m/' + id + '" data-nav>' + m.title + '</a>';
    }).join('');
    return '<div class="road-item reveal" style="--rc:' + color + '">' +
      '<div class="road-node">' + no + '</div>' +
      '<div class="road-body"><div><h4>' + title + '</h4><p>' + desc + '</p></div><div class="road-mods">' + tags + '</div></div></div>';
  }
  function faq(q, title, ans, href) {
    return '<details class="reveal"><summary><span class="q">' + q + '</span><span>' + title + '</span><span class="plus"></span></summary>' +
      '<div class="ans"><p>' + ans + ' <a href="' + href + '" data-nav>展开读 →</a></p></div></details>';
  }

  /* ─────────── Hero 初始化 ─────────── */
  function initHero() {
    var art = $('#hero-art');
    if (art && window.ART) art.innerHTML = ART.portrait({ mode: 'cel', palette: 'lavender', deco: true });
    var stage = $('#hero-visual');
    var card = $('#hero-canvas');
    if (!stage || !card) return;
    var raf = null, tx = 0, ty = 0;
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5;
      ty = (e.clientY - r.top) / r.height - .5;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        card.style.transform = 'translate(-50%,-50%) rotate(' + (2.5 + tx * 2.4) + 'deg) translate3d(' + (tx * 12) + 'px,' + (ty * 10) + 'px,0)';
      });
    });
    stage.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  }

  /* ─────────── 模块页 ─────────── */
  function pageModule(m) {
    currentPage = 'm/' + m.id;
    document.body.classList.add('module-page');
    setTitle(m.title);
    buildTopnav(m.id);
    buildSidebar(m, '');
    view.className = 'view mod-page';
    document.documentElement.style.setProperty('--mod', m.color);
    var demos = 0, done = modDone(m);
    var demoIds = [];
    m.chapters.forEach(function (c) { interactiveIds(c.content).forEach(function (id) { if (demoIds.indexOf(id) < 0) demoIds.push(id); }); });
    demos = demoIds.length;
    var pct = m.chapters.length ? Math.round(done / m.chapters.length * 100) : 0;

    var html = '<section class="mod-hero">' +
      '<div class="mod-hero-inner">' +
      '<div class="mod-hero-icon">' + icon(m.icon) + '</div>' +
      '<div class="mod-hero-copy">' +
      '<div class="mod-hero-en">' + esc(m.en) + ' · MODULE</div>' +
      '<h1>' + esc(m.title) + '</h1>' +
      '<div class="tagline">' + esc(m.tagline) + '</div>' +
      '<p class="desc">' + esc(m.description) + '</p></div></div>' +
      '<div class="mod-hero-stats">' +
      '<div><b>' + m.chapters.length + '</b>章节</div>' +
      '<div><b>' + m.chapters.reduce(function(n,c){return n + (c.readMinutes || 3);},0) + ' 分钟</b>阅读估算 · 跟练另计</div>' +
      '<div><b>' + demos + '</b>交互演示</div>' +
      '<div><b>' + pct + '%</b>已完成</div>' +
      '</div></section>' +
      (m.utility ? '<a class="mod-utility" href="#/m/' + esc(m.id) + '/' + esc(m.utility.chapter) + '" data-nav><div><span>实用小工具 · 图片不上传</span><h2>' + esc(m.utility.title) + '</h2><p>' + esc(m.utility.description) + '</p></div><strong>' + esc(m.utility.action) + ' →</strong></a>' : '') +
      '<div class="mod-intro">' +
      '<div class="mod-intro-main"><h3>这个模块怎么学</h3><p>' + esc(m.howto || '先按顺序读一遍，遇到演示就停下来动手；每章结束后用「标记完成」记录进度。不要追求一次看懂，第二遍带着练习回来，收获会翻倍。') + '</p></div>' +
      '<div class="mod-intro-side"><h4>学完你能</h4><ul>' + (m.outcomes || ['建立该模块的完整知识框架', '看懂并复现示范中的每一步', '用检查清单诊断自己的问题']).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '</div>' +
      '<div class="module-chapters-head"><h2>章节目录</h2><span>' + m.chapters.length + ' 章 · 建议按顺序学习</span></div>' +
      '<div class="ch-list">' +
      m.chapters.map(function (c, i) {
        var isDone = store.has(ck(m.id, c.id));
        return '<a class="ch-row' + (isDone ? ' done' : '') + '" href="#/m/' + m.id + '/' + c.id + '" data-nav>' +
          '<span class="ch-no">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div class="ch-main"><h4>' + esc(c.title) + '</h4><div class="ch-points">' + (c.points || []).slice(0, 4).map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('') + '</div></div>' +
          '<div class="ch-side"><span class="ch-done">' + icon('check', 12) + ' 已完成</span><span>' + icon('clock', 12) + ' 约 ' + (c.readMinutes || 3) + ' 分钟阅读</span><span class="ch-arrow">' + icon('arrow', 12) + '</span></div>' +
          '</a>';
      }).join('') || '<div class="demo-caption"><span class="dot"></span><span>章节内容正在写入。</span></div>' +
      '</div>';
    view.innerHTML = html;
    initReveals(view);
    bindGlobal();
  }

  /* ─────────── 章节页 ─────────── */
  function pageChapter(m, chId) {
    var idx = -1;
    m.chapters.forEach(function (c, i) { if (c.id === chId) idx = i; });
    if (idx < 0) { location.hash = '#/m/' + m.id; return; }
    var ch = m.chapters[idx];
    currentPage = 'm/' + m.id + '/' + chId;
    setTitle(ch.title + ' · ' + m.title);
    buildTopnav(m.id);
    buildSidebar(m, chId);
    view.className = 'view';
    document.documentElement.style.setProperty('--mod', m.color);
    try { localStorage.setItem('cel-atelier-last', '#/m/' + m.id + '/' + chId); } catch (e) {}
    var r = window.MD.render(ch.content || '');
    var prev = m.chapters[idx - 1], next = m.chapters[idx + 1];
    var isDone = store.has(ck(m.id, chId));
    var demoN = interactiveIds(ch.content).length;
    var diaN = ((ch.content || '').match(/diagram:/g) || []).length + ((ch.content || '').match(/figure:/g) || []).length;
    var processN = ((ch.content || '').match(/demo:process-/g) || []).length;

    var html = '<div class="doc-wrap"><article class="doc">' +
      '<header class="doc-header">' +
      '<div class="crumb"><a href="#/home" data-nav>首页</a><span class="sep">/</span><a href="#/m/' + m.id + '" data-nav>' + esc(m.title) + '</a><span class="sep">/</span><span>' + esc(ch.title) + '</span></div>' +
      '<div class="doc-kicker">' + String(idx + 1).padStart(2, '0') + ' / ' + String(m.chapters.length).padStart(2, '0') + ' · ' + esc(m.en) + '</div>' +
      '<h1 class="doc-title">' + esc(ch.title) + '</h1>' +
      '<div class="doc-meta">' +
      '<span class="meta-chip">' + icon('clock', 12) + ' 含动手练习 · 按完成度复测</span>' +
      (demoN ? '<span class="meta-chip">' + icon('spark', 12) + ' ' + demoN + ' 个交互演示</span>' : '') +
      (diaN ? '<span class="meta-chip">' + icon('grid', 12) + ' ' + diaN + ' 张图解</span>' : '') +
      (processN ? '<span class="meta-chip">' + icon('grid', 12) + ' ' + processN + ' 组分步例图</span>' : '') +
      '<button class="meta-chip' + (isDone ? ' is-done' : '') + '" id="btn-done">' + icon('check', 12) + ' <span id="btn-done-txt">' + (isDone ? '已完成' : '标记完成') + '</span></button>' +
      '</div></header>' +
      '<div class="doc-body">' + r.html + '</div>' +
      '<nav class="ch-pager">' +
      (prev ? '<a class="prev" href="#/m/' + m.id + '/' + prev.id + '" data-nav><span class="pg-label">← 上一章</span><span class="pg-title">' + esc(prev.title) + '</span></a>' : '<span class="pg-spacer"></span>') +
      (next ? '<a class="next" href="#/m/' + m.id + '/' + next.id + '" data-nav><span class="pg-label">下一章 →</span><span class="pg-title">' + esc(next.title) + '</span></a>' : '<span class="pg-spacer"></span>') +
      '</nav></article>' +
      '<aside class="toc-rail" id="toc-rail">' +
      '<div class="toc-title">本页目录 · ON THIS PAGE</div>' +
      '<div class="toc-list" id="toc-list">' + (r.toc.length ? r.toc.map(function (t) {
        return '<a href="#' + t.id + '" class="' + (t.level === 3 ? 'lv3' : '') + '">' + esc(t.text) + '</a>';
      }).join('') : '<span class="kbd-hint">本章暂无小节</span>') + '</div>' +
      '<div class="toc-progress">READ <b id="toc-pct">0</b>%</div>' +
      '</aside></div>';

    view.innerHTML = html;
    if (window.LEARNING) window.LEARNING.init(view, m, ch);
    mountDemos(view);
    mountDiagrams(view);
    mountFigures(view);
    bindCopy(view);
    initReveals(view);
    initTOC(m, r.toc, ch);
    bindGlobal();

    var btn = $('#btn-done');
    if (btn) btn.addEventListener('click', function () {
      var key = ck(m.id, chId);
      var now = !store.has(key);
      store.set(key, now);
      var t = $('#btn-done-txt');
      if (t) t.textContent = now ? '已完成' : '标记完成';
      btn.classList.toggle('is-done', now);
      buildSidebar(m, chId);
    });
  }

  /* ─────────── 路线 / 图鉴 / 404 ─────────── */
  function pageRoadmap() {
    currentPage = 'roadmap';
    setTitle('学习路线');
    buildTopnav('roadmap');
    buildSidebar(null);
    view.className = 'view roadmap-page';
    var stages = [
      { no: '01', color: '#7fe9ff', title: '入门：先确定设备与目标', en: 'START', desc: '读入门前夜，弄清想画头像、Q版还是立绘。验收：能说明自己的设备、主软件、练习目标，并保存一份练习文件。纸笔也可先练造型。', mods: ['start'] },
      { no: '02', color: '#b9a6ff', title: '软件：只选一个，先会基本操作', en: 'CHOOSE ONE', desc: 'iPad可选Procreate，电脑可选SAI2、CSP或Photoshop；CSP也有平板版。先看所选软件的界面、画笔和图层基础，复杂功能遇到再查。验收：能画线、新建层、撤销、保存工程、导出PNG，不要求先通读四套软件。', mods: ['ipad','sai2','csp','ps'] },
      { no: '03', color: '#7fe9ff', title: '造型地基 + 同步练习', en: 'DRAW AND REVIEW', desc: '边学线条、头部、透视、人体与明暗，边选练习体系中的一项计划。练习从现在开始，不等课程读完。验收：保留起点与同题重画，能指出一个具体错误并复测改进。', mods: ['fundamentals','practice'] },
      { no: '04', color: '#ffd79a', title: '赛璐璐：完成第一张小作品', en: 'FIRST FINISH', desc: '基础体块与明暗能看懂后，学底色、阴影形状、色阶、高光与材质。可先用练习包线稿练上色。验收：交出草稿、线稿、底色、一阴与成稿，能解释主要光源与阴影形状。', mods: ['cel'] },
      { no: '05', color: '#ffb86b', title: '准备接稿：安全、沟通与交付', en: 'WHEN READY', desc: '有稳定作品后，再练作品集、报价、合同和修改节点；接触陌生交易前先看安全模块。审稿边界按稿件需要学习。验收：用虚构订单走完需求、确认、修改、备份与交付；看完课程不等于具备接稿能力。', mods: ['safety','career','r18'] },
      { no: '选', color: '#7de2ca', title: '按目标选修，不必全部学完', en: 'OPTIONAL', desc: 'PS后期按成图需要穿插；Live2D在会分层、补画后再学绑定；逆向工程在会保存导出后再学。迷思与真相随时查，练习复盘一直做。', mods: ['ps','live2d','reverse','myths'] }
    ];
    var html = '<section class="mod-hero"><div class="mod-hero-inner"><div class="mod-hero-icon" style="color:#ff8fc7;background:rgba(255,143,199,.1);border-color:rgba(255,143,199,.35)">' + icon('map') + '</div>' +
      '<div class="mod-hero-copy"><div class="mod-hero-en">ROADMAP · 零基础主线 + 按需选修</div><h1>学习路线</h1>' +
      '<div class="tagline">按能力推进，而不是按软件堆叠。</div>' +
      '<p class="desc">入门 → 选一个软件上手 → 造型地基 → 赛璐璐成图 → 准备接稿。练习体系从第一天并行；菜单按用途分组，软件之间是选择关系，选修不算必经关卡。</p><a class="btn btn-ghost" href="#/brushes" data-nav>不知道用什么笔？按软件与稿件查笔刷 →</a></div></div></section>' +
      '<div class="road">' + stages.map(function (s, i) {
        var tags = s.mods.map(function (id) { var m = meta(id); return m ? '<a href="#/m/' + id + '" data-nav>' + m.title + '</a>' : ''; }).join('');
        return '<div class="road-item reveal" style="--rc:' + s.color + ';--d:' + (i * .05) + 's"><div class="road-node">' + s.no + '</div>' +
          '<div class="road-body"><div><h4>' + s.title + ' <span style="font-family:var(--serif);font-size:9px;letter-spacing:.2em;color:var(--ink-4);font-weight:400;margin-left:6px">' + s.en + '</span></h4><p>' + s.desc + '</p></div><div class="road-mods">' + tags + '</div></div></div>';
      }).join('') + '</div>' +
      '<div class="band reveal" style="margin-top:50px"><div><div class="kicker" style="margin-bottom:12px">SUGGESTED PACE</div><h2>每周 6 小时，<br>六个月能走到哪里？</h2><p>可以把线条、头部、人体、赛璐璐和软件工作流分成几个阶段，每两周用同题重画复测。月份只是安排示例；未通过验收就缩小题目、补练或延长阶段，作品与交付是否达标需要另外判断。</p></div><div class="band-actions"><a class="btn btn-primary" href="#/m/practice" data-nav>拿 30 天计划</a></div></div>';
    view.innerHTML = html;
    initReveals(view); bindGlobal();
  }

  function pageBrushes(software) {
    currentPage = 'brushes';
    setTitle('真实笔刷用法速查');
    buildTopnav('brushes'); buildSidebar(null);
    view.className='view brush-page';
    window.BRUSH_GUIDE.mount(view,software);
    bindGlobal();
  }

  function pageAtlas() {
    currentPage = 'atlas';
    setTitle('图解与例图总览');
    buildTopnav('atlas');
    buildSidebar(null);
    view.className = 'view';
    var dNames = Object.keys(window.DIAGRAMS || {});
    var fNames = Object.keys(window.FIGURES || {});
    var storyCount = fNames.filter(function (n) { return !!window.FIGURES[n].cards; }).length;
    var html = '<section class="mod-hero"><div class="mod-hero-inner"><div class="mod-hero-icon" style="color:#7fe9ff;background:rgba(127,233,255,.1);border-color:rgba(127,233,255,.3)">' + icon('grid') + '</div>' +
      '<div class="mod-hero-copy"><div class="mod-hero-en">VISUAL ATLAS</div><h1>图解与例图总览</h1>' +
      '<div class="tagline">' + (dNames.length + fNames.length) + ' 组图解与例图，含 ' + storyCount + ' 组四格分镜。</div>' +
      '<p class="desc">图解使用站内 SVG 示意，分镜说明放在图形下方，便于手机阅读。传统图解可横滑或点击放大；与课程正文使用同一套内容。</p></div></div></section>' +
      '<div style="display:grid;gap:18px">' + dNames.map(function (n) { return '<div class="diagram-mount" data-diagram="' + esc(n) + '"></div>'; }).join('') +
      fNames.map(function (n) { return '<div class="diagram-mount" data-figure="' + esc(n) + '"></div>'; }).join('') + '</div>';
    view.innerHTML = html;
    mountDiagrams(view); mountFigures(view); bindGlobal();
  }

  function page404() {
    currentPage = '404';
    setTitle('404 · 画布是空的');
    buildTopnav('');
    buildSidebar(null);
    view.className = 'view';
    view.innerHTML = '<div class="page-404"><div class="big">404</div><h1>这张画布还是空的</h1><p>地址可能写错了，或者章节还没写到这里。</p><p style="margin-top:24px"><a class="btn btn-primary" href="#/home" data-nav>回到画室</a></p></div>';
    bindGlobal();
  }

  /* ─────────── Mount demos / diagrams / figures ─────────── */
  function syncRangeProgress(input) {
    var min = input.min === '' ? 0 : +input.min;
    var max = input.max === '' ? 100 : +input.max;
    var progress = max > min ? (+input.value - min) / (max - min) : 0;
    input.style.setProperty('--p', (Math.max(0, Math.min(1, progress)) * 100) + '%');
  }
  function mountDemos(root) {
    $$('.demo-mount', root).forEach(function (el) {
      var id = el.getAttribute('data-demo');
      var d = window.DEMOS && window.DEMOS[id];
      if (!d) { el.innerHTML = '<div class="demo-caption"><span class="dot"></span><span>演示 <b>' + esc(id) + '</b> 尚未加载。</span></div>'; return; }
      var frame = document.createElement('div');
      frame.className = 'demo-frame';
      frame.innerHTML = '<div class="demo-frame-head"><span class="df-dot"></span><b>' + esc(d.title || id) + '</b><span>' + esc(d.desc || '') + '</span><span class="df-tag">' + esc(d.tag || 'INTERACTIVE') + '</span></div><div class="demo-frame-body"></div>';
      el.innerHTML = '';
      el.appendChild(frame);
      var body = $('.demo-frame-body', frame);
      try {
        if (typeof d.mount === 'function') d.mount(body);
        else if (d.html) body.innerHTML = d.html;
        // Initialize every demo, including ones without their own track styles.
        // Bubble after demo handlers so the final value determines the fill.
        var syncRanges = function () { $$('input[type="range"]', body).forEach(syncRangeProgress); };
        syncRanges();
        ['input', 'change'].forEach(function (event) {
          body.addEventListener(event, function (e) { if (e.target.matches('input[type="range"]')) syncRangeProgress(e.target); });
        });
        body.addEventListener('click', syncRanges);
      } catch (err) {
        body.innerHTML = '<div class="demo-caption"><span class="dot"></span><span>演示加载失败：' + esc(err.message) + '</span></div>';
        if (window.console) console.error(err);
      }
    });
  }

  function readableDiagram(d) {
    var r = d.reading;
    return '<div class="diagram-reading"><p class="diagram-kicker">' + esc(r.kicker || '') + '</p>' +
      '<ol class="diagram-steps" role="list">' + r.steps.map(function (s, i) {
        return '<li class="diagram-step" style="--step-color:' + esc(s.color || '#a3e5f4') + '">' +
          '<div class="diagram-step-heading"><span aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><strong>' + esc(s.title) + '</strong></div>' +
          (s.art ? '<div class="diagram-step-art">' + s.art + '</div>' : '') +
          '<ul' + (s.body.length === 1 ? ' class="is-summary"' : '') + '>' + s.body.map(function (line) { return '<li>' + esc(line) + '</li>'; }).join('') + '</ul></li>';
      }).join('') + '</ol>' +
      '<div class="diagram-reading-notes">' + (r.notes || []).map(function (note) { return '<p>' + esc(note) + '</p>'; }).join('') + '</div></div>';
  }

  function mountDiagrams(root) {
    $$('.diagram-mount[data-diagram]', root).forEach(function (el) {
      var id = el.getAttribute('data-diagram');
      var d = window.DIAGRAMS && window.DIAGRAMS[id];
      if (!d) { el.innerHTML = '<div class="demo-caption"><span class="dot"></span><span>图解 <b>' + esc(id) + '</b> 尚未加载。</span></div>'; return; }
      var svg = typeof d.svg === 'function' ? d.svg() : d.svg;
      el.innerHTML = '<div class="diagram-card diagram-overview"><div class="diagram-head"><b>' + esc(d.title || '') + '</b>' +
        (d.reading ? '' : '<button class="diagram-fit" type="button" aria-pressed="false">放大读字</button>') +
        '<button class="diagram-zoom" title="放大" aria-label="放大图解：' + esc(d.title || id) + '">' + icon('zoom', 12) + '</button></div>' +
        (d.reading ? readableDiagram(d) : '<div class="diagram-svg" tabindex="0" role="region" aria-label="' + esc(d.title || id) + '">' + svg + '</div><p class="diagram-scroll-note">默认显示完整图解；小字看不清时可点“放大读字”，或打开大图。</p>') +
        (d.caption ? '<div class="diagram-cap">' + esc(d.caption) + '</div>' : '') + '</div>';
      var z = $('.diagram-zoom', el);
      if (z) z.addEventListener('click', function () { openLightbox(svg); });
      var fit = $('.diagram-fit', el);
      if (fit) fit.addEventListener('click', function () {
        var overview = $('.diagram-card', el).classList.toggle('diagram-overview');
        fit.setAttribute('aria-pressed', String(!overview));
        fit.textContent = overview ? '放大读字' : '查看全图';
        $('.diagram-scroll-note', el).textContent = overview ? '默认显示完整图解；小字看不清时可点“放大读字”，或打开大图。' : '已放大至清晰字号，可左右滑动；点“查看全图”恢复完整布局。';
      });
    });
  }

  function mountFigures(root) {
    $$('.diagram-mount[data-figure]', root).forEach(function (el) {
      var id = el.getAttribute('data-figure');
      var d = window.FIGURES && window.FIGURES[id];
      if (!d) { el.innerHTML = '<div class="demo-caption"><span class="dot"></span><span>例图 <b>' + esc(id) + '</b> 尚未加载。</span></div>'; return; }
      if (d.cards && window.LEARNING) { el.innerHTML = window.LEARNING.renderFigure(d); return; }
      var svg = typeof d.svg === 'function' ? d.svg() : d.svg;
      el.innerHTML = '<div class="diagram-card diagram-overview"><div class="diagram-head"><b>' + esc(d.title || '') + '</b><span class="badge pink" style="margin-left:8px">例图</span>' +
        '<button class="diagram-zoom" title="放大" aria-label="放大例图：' + esc(d.title || id) + '">' + icon('zoom', 12) + '</button></div>' +
        '<div class="diagram-svg">' + svg + '</div>' +
        (d.caption ? '<div class="diagram-cap">' + esc(d.caption) + '</div>' : '') + '</div>';
      var z = $('.diagram-zoom', el);
      if (z) z.addEventListener('click', function () { openLightbox(svg); });
    });
  }

  function bindCopy(root) {
    $$('[data-copy]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.closest('.code-wrap');
        var code = $$('.code-tbl .cl', wrap).map(function (td) { return td.textContent; }).join('\n');
        try {
          navigator.clipboard.writeText(code).then(function () {
            var old = btn.innerHTML;
            btn.innerHTML = '已复制';
            setTimeout(function () { btn.innerHTML = old; }, 1400);
          });
        } catch (e) {}
      });
    });
  }

  /* ─────────── Lightbox ─────────── */
  function openLightbox(svg) {
    var lb = $('#lightbox'), inner = $('#lightbox-inner');
    inner.innerHTML = svg;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    var lb = $('#lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    $('#lightbox-inner').innerHTML = '';
    document.body.style.overflow = '';
  }

  /* ─────────── Reveal / spotlight / counters ─────────── */
  var io = null;
  function initReveals(root) {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal,.reveal-l', root).forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.reveal,.reveal-l', root).forEach(function (el) { io.observe(el); });
  }
  function initSpotlights(root) {
    $$('[data-spotlight]', root).forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }
  function initCounters(root) {
    $$('[data-count]', root).forEach(function (el) {
      var target = +el.getAttribute('data-count');
      if (!target) { el.textContent = '0'; return; }
      el.textContent = target;
      if (document.hidden) return;
      var start = performance.now();
      el.textContent = '0';
      var fallback = setTimeout(function () { if (el.textContent === '0') el.textContent = target; }, 1600);
      function tick(now) {
        var p = Math.min(1, (now - start) / 1100);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = target; clearTimeout(fallback); }
      }
      requestAnimationFrame(tick);
    });
  }

  /* ─────────── TOC / 阅读进度 ─────────── */
  function initTOC(m, toc, ch) {
    var links = $$('#toc-list a');
    var bar = $('#read-progress-bar');
    var pctEl = $('#toc-pct');
    var heads = toc.map(function (t) { return document.getElementById(t.id); }).filter(Boolean);
    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      if (bar) bar.style.width = p + '%';
      if (pctEl) pctEl.textContent = Math.round(p);
      var active = 0;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top <= 140) active = i;
      }
      links.forEach(function (a, i) { a.classList.toggle('active', i === active); });
    }
    window.removeEventListener('scroll', window.__scrollHandler || function () {});
    window.__scrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var el = document.getElementById(id);
        if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' }); }
      });
    });
  }

  /* ─────────── 搜索 ─────────── */
  var searchIndex = null;
  function buildSearchIndex() {
    var arr = [];
    allMods().forEach(function (m) {
      (m.chapters || []).forEach(function (c, i) {
        var plain = String(c.content || '')
          .replace(/```[\s\S]*?```/g, ' ')
          .replace(/[#>*`|_\-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        arr.push({
          m: m.id, mt: m.title, mc: m.color, c: c.id, title: c.title, no: i + 1,
          points: (c.points || []).join(' '),
          text: plain,
          url: '#/m/' + m.id + '/' + c.id
        });
      });
    });
    arr.push({m:'practice',mt:'笔刷用法速查',mc:'#7fe9ff',c:'brushes',title:'真实笔刷：按软件、稿件与练习选择',no:0,points:'笔刷 中文名称 练习 头像 Q版 立绘 漫画',text:Object.keys(window.BRUSH_GUIDE.software).map(function(id){var s=window.BRUSH_GUIDE.software[id];return s.name+' '+s.brushes.map(function(b){return b.name+' '+b.original+' '+b.use;}).join(' ');}).join(' '),url:'#/brushes'});
    searchIndex = arr;
  }
  function openSearch() {
    if (!searchIndex) buildSearchIndex();
    $('#search-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#search-input').focus(); }, 30);
  }
  function closeSearch() {
    var o = $('#search-overlay');
    if (!o) return;
    o.classList.remove('open');
    if (!document.body.classList.contains('menu-open')) document.body.style.overflow = '';
    var inp = $('#search-input'); if (inp) inp.value = '';
  }
  function runSearch(q) {
    var results = $('#search-results');
    var hint = $('#search-hint');
    q = q.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; hint.style.display = 'block'; return; }
    hint.style.display = 'none';
    var scored = [];
    searchIndex.forEach(function (it) {
      var score = 0;
      if (it.title.toLowerCase().indexOf(q) !== -1) score += 120;
      if (it.points.toLowerCase().indexOf(q) !== -1) score += 45;
      if (it.mt.toLowerCase().indexOf(q) !== -1) score += 30;
      var pos = it.text.toLowerCase().indexOf(q);
      if (pos !== -1) score += 12;
      if (score) scored.push({ it: it, score: score, pos: pos });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored.slice(0, 12);
    if (!top.length) { results.innerHTML = '<div class="sr-empty">没有找到「' + esc(q) + '」。试试更短的关键词，或直接浏览模块目录。</div>'; return; }
    results.innerHTML = top.map(function (x, i) {
      var snip = '';
      if (x.pos > -1) {
        var s = Math.max(0, x.pos - 40);
        snip = x.it.text.slice(s, s + 150);
        if (s > 0) snip = '…' + snip;
        snip += '…';
      } else snip = x.it.points;
      return '<a class="sr-item' + (i === 0 ? ' sel' : '') + '" href="' + x.it.url + '" data-nav>' +
        '<span class="sr-mod" style="--mc:' + x.it.mc + '">' + esc(x.it.mt) + '</span>' +
        '<span class="sr-main"><span class="sr-title">' + String(x.it.no).padStart(2, '0') + ' · ' + esc(x.it.title) + '</span>' +
        '<span class="sr-snip">' + esc(snip) + '</span></span></a>';
    }).join('');
  }
  function bindSearch() {
    var trigger = $('#search-trigger');
    var overlay = $('#search-overlay');
    var input = $('#search-input');
    if (trigger) trigger.addEventListener('click', openSearch);
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    if (input) {
      input.addEventListener('input', function () { runSearch(input.value); });
      input.addEventListener('keydown', function (e) {
        var items = $$('.sr-item', $('#search-results'));
        var sel = items.findIndex(function (x) { return x.classList.contains('sel'); });
        if (e.key === 'ArrowDown') { e.preventDefault(); if (!items.length) return; items.forEach(function (x) { x.classList.remove('sel'); }); sel = Math.min(items.length - 1, sel + 1); items[sel].classList.add('sel'); items[sel].scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (!items.length) return; items.forEach(function (x) { x.classList.remove('sel'); }); sel = Math.max(0, sel - 1); items[sel].classList.add('sel'); items[sel].scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'Enter') { if (items[sel >= 0 ? sel : 0]) { location.hash = items[sel >= 0 ? sel : 0].getAttribute('href'); closeSearch(); } }
      });
    }
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { closeSearch(); closeLightbox(); setSidebarOpen(false); }
    });
  }

  /* ─────────── 背景粒子 / 光标 / 滚动 ─────────── */
  var fx = { raf: 0, canvas: null, ctx: null, w: 0, h: 0, petals: [], dust: [], bokeh: [], bokehCanvas: null, last: 0 };
  function initFX() {
    var canvas = $('#fx-canvas');
    if (!canvas) return;
    fx.canvas = canvas; fx.ctx = canvas.getContext('2d');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { canvas.style.display = 'none'; return; }
    fx.bokehCanvas = document.createElement('canvas');
    resizeFX();
    window.addEventListener('resize', resizeFX);
    var off = false;
    try { off = localStorage.getItem('cel-atelier-fx') === 'off'; } catch (e) {}
    if (off) document.body.classList.add('fx-off');
    setFxBtn(!off);
    var btn = $('#fx-toggle');
    if (btn) btn.addEventListener('click', function () {
      var nowOff = !document.body.classList.contains('fx-off');
      document.body.classList.toggle('fx-off', nowOff);
      try { localStorage.setItem('cel-atelier-fx', nowOff ? 'off' : 'on'); } catch (e) {}
      setFxBtn(!nowOff);
      if (!nowOff) loop();
    });
    loop();
  }
  function setFxBtn(on) {
    var b = $('#fx-toggle');
    if (b) { b.classList.toggle('off', !on); b.title = on ? '关闭背景特效' : '开启背景特效'; }
  }
  function resizeFX() {
    var c = fx.canvas; if (!c) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    fx.w = window.innerWidth; fx.h = window.innerHeight;
    c.width = fx.w * dpr; c.height = fx.h * dpr;
    c.style.width = fx.w + 'px'; c.style.height = fx.h + 'px';
    fx.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedFX(); renderBokeh();
  }
  function seedFX() {
    fx.petals = []; fx.dust = []; fx.bokeh = [];
    var n = Math.min(16, Math.round(fx.w / 90));
    for (var i = 0; i < n; i++) fx.petals.push({
      x: Math.random() * fx.w, y: Math.random() * fx.h, s: 3 + Math.random() * 5,
      vy: .16 + Math.random() * .32, vx: -.12 + Math.random() * .24,
      rot: Math.random() * 6.28, vr: -.008 + Math.random() * .016,
      a: .16 + Math.random() * .3, ph: Math.random() * 6.28,
      col: Math.random() > .55 ? '255,143,199' : (Math.random() > .5 ? '192,164,255' : '255,215,154')
    });
    var nd = Math.min(48, Math.round(fx.w / 30));
    for (var d = 0; d < nd; d++) fx.dust.push({
      x: Math.random() * fx.w, y: Math.random() * fx.h, r: Math.random() * 1.3 + .3,
      a: .1 + Math.random() * .32, tw: Math.random() * 6.28, sp: .2 + Math.random() * .8
    });
    for (var b = 0; b < 4; b++) fx.bokeh.push({
      x: Math.random() * fx.w, y: Math.random() * fx.h, r: 90 + Math.random() * 150,
      a: .03 + Math.random() * .04,
      col: Math.random() > .5 ? '255,143,199' : '127,233,255'
    });
  }
  function renderBokeh() {
    var bc = fx.bokehCanvas; if (!bc) return;
    bc.width = Math.max(1, fx.w); bc.height = Math.max(1, fx.h);
    var c = bc.getContext('2d');
    fx.bokeh.forEach(function (b) {
      var g = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, 'rgba(' + b.col + ',' + b.a + ')');
      g.addColorStop(1, 'rgba(' + b.col + ',0)');
      c.fillStyle = g; c.beginPath(); c.arc(b.x, b.y, b.r, 0, 6.283); c.fill();
    });
  }
  function loop() {
    if (fx.raf) return;
    var c = fx.ctx; if (!c) return;
    var t = 0;
    function frame(now) {
      fx.raf = requestAnimationFrame(frame);
      if (document.body.classList.contains('fx-off')) { cancelAnimationFrame(fx.raf); fx.raf = 0; return; }
      if (now - fx.last < 33) return;
      fx.last = now;
      t += .033;
      c.clearRect(0, 0, fx.w, fx.h);
      if (fx.bokehCanvas) c.drawImage(fx.bokehCanvas, 0, 0, fx.w, fx.h);
      fx.dust.forEach(function (d) {
        d.y -= d.sp * .12; d.x += Math.sin(t + d.tw) * .08;
        if (d.y < -4) { d.y = fx.h + 4; d.x = Math.random() * fx.w; }
        c.fillStyle = 'rgba(220,230,255,' + (d.a * (.6 + .4 * Math.sin(t * 2 + d.tw))) + ')';
        c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.283); c.fill();
      });
      fx.petals.forEach(function (p) {
        p.y += p.vy; p.x += p.vx + Math.sin(t * .8 + p.ph) * .16; p.rot += p.vr;
        if (p.y > fx.h + 14) { p.y = -14; p.x = Math.random() * fx.w; }
        if (p.x < -20) p.x = fx.w + 20; if (p.x > fx.w + 20) p.x = -20;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
        c.fillStyle = 'rgba(' + p.col + ',' + p.a + ')';
        c.beginPath();
        c.moveTo(0, -p.s);
        c.bezierCurveTo(p.s * .8, -p.s * .45, p.s * .7, p.s * .5, 0, p.s);
        c.bezierCurveTo(-p.s * .7, p.s * .5, -p.s * .8, -p.s * .45, 0, -p.s);
        c.fill(); c.restore();
      });
    }
    fx.raf = requestAnimationFrame(frame);
  }
  
  function initCursor() {
    if (!window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;
    var glow = $('#cursor-glow'), ring = $('#cursor-ring');
    if (!glow || !ring) return;
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('cursor-on');
      glow.style.left = mx + 'px'; glow.style.top = my + 'px';
      var t = e.target.closest && e.target.closest('a,button,.mod-card,.intro-card,.lay,.seg button');
      document.body.classList.toggle('cursor-hot', !!t);
    });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on'); });
    (function follow() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(follow);
    })();
  }
  function initScroll() {
    var topbar = $('#topbar'), back = $('#backtop');
    var bar = $('#read-progress-bar');
    function onScroll() {
      var y = window.scrollY;
      topbar.classList.toggle('scrolled', y > 12);
      if (back) back.classList.toggle('show', y > 700);
      if (bar && currentPage.split('/').length < 3) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (back) back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
  function setSidebarOpen(open) {
    sidebar.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    var toggle = $('#menu-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
    }
  }
  function bindGlobal() {
    $$('#menu-toggle').forEach(function (b) {
      b.onclick = function () {
        setSidebarOpen(!sidebar.classList.contains('open'));
      };
    });
    var scrim = $('#sidebar-scrim');
    if (scrim) scrim.onclick = function () {
      setSidebarOpen(false);
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
    $$('[data-nav]').forEach(function (a) {
      if (a.__navBound) return;
      a.__navBound = true;
      a.addEventListener('click', function () {
        setSidebarOpen(false);
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─────────── Footer ─────────── */
  function buildFooter() {
    var fl = $('#footer-links');
    if (!fl) return;
    fl.innerHTML = '<a href="#/roadmap" data-nav>学习路线</a><a href="#/m/cel" data-nav>赛璐璐</a><a href="#/m/ipad" data-nav>Procreate</a><a href="#/m/csp" data-nav>CSP</a><a href="#/m/live2d" data-nav>Live2D</a><a href="#/m/career" data-nav>接稿</a><a href="#/m/safety" data-nav>防骗安全</a><a href="#/atlas" data-nav>图鉴</a>';
  }

  /* ─────────── Boot ─────────── */
  function boot() {
    initFX();
    initCursor();
    initScroll();
    bindSearch();
    buildFooter();
    window.addEventListener('hashchange', route);
    window.addEventListener('resize', positionModuleMenu);
    route();
    // keyboard: / focuses search
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); openSearch();
      }
    });
    // lightbox close
    var lc = $('#lightbox-close');
    if (lc) lc.addEventListener('click', closeLightbox);
    var lb = $('#lightbox');
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  }

  window.CEL = { MOD_META: MOD_META, mod: mod, route: route, openSearch: openSearch };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
