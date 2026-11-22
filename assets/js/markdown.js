/* ═══════════════════════════════════════════════════════════
   Mini-Markdown · CEL ATELIER edition
   支持：标题/代码/输出台/提示框/表格/嵌套列表/演示/图解/例图
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- inline ---------- */
  function inline(s) {
    var codes = [];
    var t = String(s).replace(/`([^`]+)`/g, function (_, c) {
      codes.push(c);
      return '\u0000C' + (codes.length - 1) + '\u0000';
    });
    t = esc(t);
    t = t.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, src) {
      if (!/^(https?:|assets\/|\.\/)/i.test(src)) return alt;
      return '<img src="' + src + '" alt="' + alt + '" loading="lazy" style="border-radius:12px;border:1px solid var(--line-2);margin:10px 0">';
    });
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, txt, url) {
      if (!/^(https?:|#|mailto:)/i.test(url)) return txt;
      return '<a href="' + url + '"' + (url.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"') + '>' + txt + '</a>';
    });
    t = t.replace(/\u0000C(\d+)\u0000/g, function (_, i) {
      return '<code class="inline">' + esc(codes[+i]) + '</code>';
    });
    return t;
  }

  /* ---------- code ---------- */
  var LANG_LABEL = {
    text: 'TEXT', plain: 'TEXT', shell: 'SHELL', bash: 'BASH', zsh: 'SHELL', powershell: 'POWERSHELL',
    json: 'JSON', js: 'JAVASCRIPT', javascript: 'JAVASCRIPT', css: 'CSS', html: 'HTML', xml: 'XML',
    yml: 'YAML', yaml: 'YAML', md: 'MARKDOWN', markdown: 'MARKDOWN', python: 'PYTHON', py: 'PYTHON',
    c: 'C', cpp: 'C++', java: 'JAVA', sql: 'SQL', diff: 'DIFF', ini: 'INI', toml: 'TOML'
  };

  function codeBlockHTML(code, lang, file) {
    var lines = code.replace(/\t/g, '    ').split('\n');
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    var rows = '';
    for (var i = 0; i < lines.length; i++) {
      var raw = lines[i];
      var html = (window.HL ? window.HL(raw, lang) : esc(raw)) || ' ';
      rows += '<tr><td class="ln">' + (i + 1) + '</td><td class="cl">' + html + '</td></tr>';
    }
    var label = LANG_LABEL[lang] || String(lang || 'text').toUpperCase();
    return '<div class="code-wrap">' +
      '<div class="code-head"><div class="code-dots"><i></i><i></i><i></i></div>' +
      '<span class="code-lang">' + esc(label) + '</span>' +
      (file ? '<span class="code-file">' + esc(file) + '</span>' : '') +
      '<button class="code-copy" data-copy><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>复制</button>' +
      '</div><div class="code-body"><table class="code-tbl">' + rows + '</table></div></div>';
  }

  function outputBlockHTML(text, standalone) {
    var lines = text.split('\n');
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    var body = lines.map(function (l) {
      return esc(l)
        .replace(/\[dim\](.*?)\[\/dim\]/g, '<span class="o-dim">$1</span>')
        .replace(/\[hl\](.*?)\[\/hl\]/g, '<span class="o-hl">$1</span>')
        .replace(/\[err\](.*?)\[\/err\]/g, '<span class="o-err">$1</span>')
        .replace(/\[key\](.*?)\[\/key\]/g, '<span class="o-key">$1</span>');
    }).join('\n');
    return '<div class="output-wrap' + (standalone ? ' standalone' : '') + '">' +
      '<div class="output-head"><span class="blink-dot"></span>OUTPUT · 示例结果</div>' +
      '<div class="output-body">' + body + '</div></div>';
  }

  /* ---------- callouts ---------- */
  var CI = {
    tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.6 1 2.5h6c0-.9.2-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    warn: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    danger: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    pitfall: '<path d="M3 20h18L12 4 3 20z"/><path d="M12 10v4M12 17h.01"/>',
    best: '<path d="M12 2l3 6.5 7 .8-5.2 4.7 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8L12 2z"/>',
    truth: '<path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="10"/>',
    practice: '<path d="M14.5 3.5l6 6L9 21H3v-6L14.5 3.5z"/><path d="M12 6l6 6"/>',
    story: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h5"/>',
    compare: '<path d="M12 3v18M5 7l-3 5h6L5 7zM19 7l-3 5h6l-3-5z"/>',
    money: '<circle cx="12" cy="12" r="10"/><path d="M9 7h6M9 12h6M12 7v10"/>'
  };
  var CN = {
    tip: '要点 · KEY POINT', warn: '注意 · WATCH OUT', danger: '红线 · RED LINE', info: '补充 · NOTE',
    pitfall: '踩坑现场 · PITFALL', best: '最佳实践 · BEST PRACTICE', truth: '真相 · TRUTH',
    practice: '动手 · PRACTICE', story: '场景 · STORY', compare: '对比 · COMPARE', money: '报价 · PRICING'
  };

  /* ---------- table ---------- */
  function splitRow(r) {
    var cells = [], cell = '', code = false;
    r = r.trim().replace(/^\||\|$/g, '');
    for (var k = 0; k < r.length; k++) {
      var ch = r[k];
      if (ch === '\\' && r[k + 1] === '|') { cell += '|'; k++; continue; }
      if (ch === '`') code = !code;
      if (ch === '|' && !code) { cells.push(cell.trim()); cell = ''; }
      else cell += ch;
    }
    cells.push(cell.trim());
    return cells;
  }

  /* ---------- main ---------- */
  function render(md) {
    var lines = String(md).split('\n');
    var html = '';
    var toc = [];
    var h2n = 0;
    var i = 0;
    var prevWasCode = false;

    function slug(text) {
      return 'sec-' + text.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 44) + '-' + (toc.length + 1);
    }

    while (i < lines.length) {
      var line = lines[i];

      if (line.trim() === '') { i++; prevWasCode = false; continue; }

      /* fence */
      var fence = line.match(/^```\s*([\w:.-]+)?\s*(.*)$/);
      if (fence) {
        var lang = (fence[1] || 'text').toLowerCase();
        var meta = (fence[2] || '').trim();
        var buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        var src = buf.join('\n');

        if (lang.indexOf('demo:') === 0) {
          html += '<div class="demo-mount" data-demo="' + esc(lang.slice(5)) + '"></div>';
        } else if (lang.indexOf('diagram:') === 0) {
          html += '<div class="diagram-mount" data-diagram="' + esc(lang.slice(8)) + '"></div>';
        } else if (lang.indexOf('figure:') === 0) {
          html += '<div class="diagram-mount" data-figure="' + esc(lang.slice(7)) + '"></div>';
        } else if (lang === 'output' || lang === 'console-out') {
          html += outputBlockHTML(src, !prevWasCode);
        } else {
          var file = null, fm = meta.match(/(?:file|f)[=:](\S+)/);
          if (fm) file = fm[1]; else if (meta) file = meta;
          html += codeBlockHTML(src, lang, file);
        }
        prevWasCode = (lang !== 'output' && lang !== 'console-out' && lang.indexOf('demo:') !== 0 && lang.indexOf('diagram:') !== 0 && lang.indexOf('figure:') !== 0);
        continue;
      }

      /* heading */
      var h = line.match(/^(#{2,4})\s+(.*)$/);
      if (h) {
        var level = h[1].length;
        var text = inline(h[2]);
        var id = slug(h[2]);
        if (level === 2) {
          h2n++;
          html += '<h2 id="' + id + '"><span class="h-idx">' + String(h2n).padStart(2, '0') + '</span>' + text + '</h2>';
          toc.push({ level: 2, id: id, text: h[2].replace(/\*\*/g, '').replace(/==/g, '') });
        } else if (level === 3) {
          html += '<h3 id="' + id + '">' + text + '</h3>';
          toc.push({ level: 3, id: id, text: h[2].replace(/\*\*/g, '').replace(/==/g, '') });
        } else {
          html += '<h4>' + text + '</h4>';
        }
        prevWasCode = false; i++;
        continue;
      }

      /* hr */
      if (/^---+\s*$/.test(line)) { html += '<hr>'; prevWasCode = false; i++; continue; }

      /* callout */
      if (/^>\s?/.test(line)) {
        var bufC = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { bufC.push(lines[i].replace(/^>\s?/, '')); i++; }
        var type = 'info', title = null;
        var cm = (bufC[0] || '').match(/^\[!(\w+)\]\s*(.*)$/);
        if (cm) {
          type = cm[1].toLowerCase();
          if (!CI[type]) type = 'info';
          title = cm[2].trim() || CN[type];
          bufC.shift();
        }
        if (!title) title = CN[type];
        var inner = render(bufC.join('\n')).html;
        html += '<div class="callout ' + type + '"><div class="callout-icon">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' + CI[type] + '</svg></div>' +
          '<div class="callout-body"><div class="callout-title">' + esc(title) + '</div>' + inner + '</div></div>';
        prevWasCode = false;
        continue;
      }

      /* table */
      if (/^\|.*\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
        var head = splitRow(lines[i]);
        i += 2;
        var body = [];
        while (i < lines.length && /^\|.*\|/.test(lines[i])) { body.push(splitRow(lines[i])); i++; }
        html += '<div class="tbl-wrap"><table><thead><tr>' +
          head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          body.map(function (row) {
            return '<tr>' + head.map(function (_, k) { return '<td>' + inline(row[k] || '') + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
        prevWasCode = false;
        continue;
      }

      /* list */
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        var ordered = /^\s*\d+\.\s+/.test(line);
        var items = [];
        while (i < lines.length) {
          var li = lines[i];
          if (/^\s*[-*]\s+/.test(li) || /^\s*\d+\.\s+/.test(li)) {
            var indent = (li.match(/^(\s*)/) || ['', ''])[1].length;
            items.push({ indent: indent, text: li.replace(/^\s*(?:[-*]|\d+\.)\s+/, '') });
            i++;
            while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*(?:[-*]|\d+\.)\s+/.test(lines[i]) && !/^\s*```/.test(lines[i]) && !/^\s*>/.test(lines[i])) {
              items[items.length - 1].text += ' ' + lines[i].trim();
              i++;
            }
          } else break;
        }
        var tag = ordered ? 'ol' : 'ul';
        var stack = 0;
        var out = '<' + tag + '>';
        for (var v = 0; v < items.length; v++) {
          var it = items[v];
          var lvl = it.indent >= 2 ? 1 : 0;
          if (lvl > stack) { out += '<' + tag + '>'; stack = lvl; }
          else if (lvl < stack) { out += '</li></' + tag + '>'; stack = lvl; }
          else if (v > 0) out += '</li>';
          out += '<li>' + inline(it.text);
        }
        while (stack > 0) { out += '</li></' + tag + '>'; stack--; }
        out += '</li></' + tag + '>';
        html += out;
        prevWasCode = false;
        continue;
      }

      /* paragraph */
      var pp = [line];
      i++;
      while (i < lines.length && lines[i].trim() !== '' &&
        !/^(#{2,4}\s|```|>|\||---+\s*$|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) {
        pp.push(lines[i]); i++;
      }
      html += '<p>' + pp.map(inline).join('<br>') + '</p>';
      prevWasCode = false;
    }

    return { html: html, toc: toc };
  }

  window.MD = { render: render, inline: inline };
})();
