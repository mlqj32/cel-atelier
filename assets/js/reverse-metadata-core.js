/* 本地元数据读取：容器按结构遍历；EXIF/XMP 使用 exifr 7.1.3（MIT）。 */
(function (root) {
  'use strict';
  var VERSION = 36, MAX_FILE = 32 * 1024 * 1024, MAX_TEXT = 1024 * 1024;
  var LIMITS = '支持 PNG 文本/tIME/eXIf、JPEG 标准 APP1 EXIF/XMP、Photoshop APP13 的 IPTC/XMP 与 COM 注释、WebP EXIF/XMP。识别 XMP 编辑历史和常见 PNG 日期别名。最多检查10000个块/段，单块1 MiB，累计4 MiB、200个展示字段；不读取 GPS、私有 MakerNote、ICC 内容或缩略图，不验证签名和完整图像解码；扩展 XMP、同一包内重复属性及其他未支持数据请用 ExifTool 复核。';
  var CAUTION = '字段可继承、改写或被清理；软件名可能来自后期/导出，日期不等于第一笔、最后一笔或劳动时长。本地文件修改时间也不能当绘制时间。';
  function ascii(b, a, z) { var s = ''; for (var i = a; i < z; i++) s += String.fromCharCode(b[i]); return s; }
  function decode(b, utf8) { return utf8 ? new TextDecoder('utf-8', { fatal: true }).decode(b) : ascii(b, 0, b.length); }
  function kindOf(name) {
    if (/^(Software|CreatorTool|ProcessingSoftware|Firmware|Producer|softwareAgent|OriginatingProgram|CreatorApplication)$/i.test(name)) return 'software';
    if (/^(Creation Time|CreationTime|CreateDate|CreationDate|ModifyDate|DateTime|DateTimeOriginal|DateTimeDigitized|MetadataDate|DateCreated|DigitalCreationDate|DigitalCreationTime|TimeCreated|tIME|OffsetTime.*|SubSecTime.*|date:create|date:modify|date:timestamp|Creation_Time|Modification Time)$/i.test(name)) return 'time';
    if (/^(Author|Artist|Creator|Copyright|Rights|OwnerName|By-line|CopyrightNotice|Credit)$/i.test(name)) return 'credit';
    if (/^(Title|Description|ImageDescription|Comment|Subject|DocumentName|Orientation|ColorSpace|ProfileDescription|ICC profile|ImageWidth|ImageHeight|ExifImageWidth|ExifImageHeight|XResolution|YResolution|ResolutionUnit|Make|Model|ProgramVersion)$/i.test(name)) return 'other';
    return null;
  }
  function meaning(name, kind, value) {
    if (/^ProgramVersion$/i.test(name)) return '程序版本声明，需与同组 OriginatingProgram 配对；版本号本身不能识别软件。';
    if (kind === 'software') return '文件声明的参与工具；可能是后期、编码或导出软件，不能确认最初绘画软件。';
    if (kind === 'credit') return '作者/权利相关声明，未经身份与权利验证；ICC版权通常属于配置文件。';
    if (kind !== 'time') return '现存描述字段，按原值展示；不是来源认证。';
    if (/OffsetTime/.test(name)) return 'EXIF对应日期的时区偏移，需与同组日期配对；不是独立事件。';
    if (/SubSecTime/.test(name)) return 'EXIF对应日期的秒小数补充；不是独立事件。';
    if(/^(DigitalCreationDate|DateCreated)$/.test(name)&&/^\d{8}$/.test(value))return 'IPTC日期声明，原值按YYYYMMDD保留；不是实际起笔日期，需与同组时间及来源核对。';
    if(/^(DigitalCreationTime|TimeCreated)$/.test(name)&&/^\d{6}/.test(value))return 'IPTC时间声明，原值按HHMMSS及可能的时区偏移保留；需与同组日期配对，不是工时。';
    var s = name === 'when' ? 'XMP 编辑历史中的事件日期；需结合同一历史项的动作和软件看待，不代表起笔或工时。' : /Original/.test(name) ? '原始图像生成日期声明，常用于拍摄；插画中不保证是起笔时刻。' :
      /tIME|Modify|DateTime$|date:modify|Modification Time/i.test(name) ? '图像修改/保存日期声明；不等于最后一笔。' :
      /MetadataDate/.test(name) ? '元数据更新时间声明；不代表画面内容绘制时间。' : '创建/生成日期声明；不代表真实作画起止或工时。';
    return s + (/Z$|[+-]\d{2}:?\d{2}$|[+-]\d{4}\b|\b(?:GMT|UTC)\b/.test(value) ? '原值包含时区标记，未进行自动换算。' : '原值未见明确时区，不能直接与其他时区排序。');
  }
  var crcTable;
  function crc32(b) {
    if (!crcTable) { crcTable = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c >>> 1 ^ (c & 1 ? 0xedb88320 : 0); crcTable[n] = c >>> 0; } }
    var crc = 0xffffffff; for (var i = 0; i < b.length; i++) crc = crc >>> 8 ^ crcTable[(crc ^ b[i]) & 255]; return (crc ^ 0xffffffff) >>> 0;
  }
  async function inflate(b) {
    if (typeof DecompressionStream === 'undefined') throw new Error('当前浏览器不支持压缩文本解压');
    var reader = new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate')).getReader(), parts = [], total = 0;
    try {
      while (true) { var next = await reader.read(); if (next.done) break; total += next.value.length; if (total > MAX_TEXT) throw new Error('解压文本超过1 MiB限制'); parts.push(next.value); }
    } finally { await reader.cancel().catch(function () {}); }
    var out = new Uint8Array(total), at = 0; parts.forEach(function (p) { out.set(p, at); at += p.length; }); return out;
  }
  async function analyze(bytes, library) {
    if (!(bytes instanceof Uint8Array)) bytes = new Uint8Array(bytes);
    if (bytes.length > MAX_FILE) throw new Error('文件超过32 MiB，请使用桌面工具检查大文件。');
    var diagnostics = { parserVersion:VERSION, containers:{}, attempts:[], skippedFields:0, state:'unsupported', summary:'' };
    var result = { format: '未识别', supported: false, fields: [], warnings: [], width: null, height: null, limits: LIMITS, diagnostics:diagnostics }, budget = 0, segments = 0;
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    function warn(s) { if (result.warnings.length < 30 && result.warnings.indexOf(s) < 0) result.warnings.push(s); }
    function add(source, tag, raw, forcedKind) {
      if (raw === undefined || raw === null || raw === '') return;
      var kind = forcedKind || kindOf(tag); if (!kind) return;
      var value = typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
      value = value.replace(/\u0000+$/g, ''); if (!value) return;
      if (value.length > 4000) { value = value.slice(0, 4000) + '…[展示截断]'; warn('部分长字段只展示前4000字符；报告同样截断。'); }
      if (result.fields.length >= 200) { warn('已达200字段展示上限。'); return; }
      result.fields.push({ source: source, tag: tag, value: value, kind: kind, explanation: meaning(tag, kind, value) });
    }
    function consume(n) { budget += n; if (n > MAX_TEXT || budget > MAX_TEXT * 4) { warn('元数据超过单块1 MiB或累计4 MiB限制，部分字段未解析。'); return false; } return true; }
    function container(type) { diagnostics.containers[type]=(diagnostics.containers[type]||0)+1; }
    function attempt(source, type, size) {
      var item={source:source,type:type,bytes:size,status:'detected',fields:0};
      if(diagnostics.attempts.length<200) diagnostics.attempts.push(item);
      return item;
    }
    var opts = { mergeOutput: false, reviveValues: false, translateValues: false, sanitize: true, tiff: true, xmp: false, gps: false, ifd1: false, makerNote: false, userComment: false, chunked: false };
    async function metadata(data, type, source) {
      var item=attempt(source,type.toUpperCase(),data.length), count=result.fields.length;
      if (!consume(data.length)) { item.status='limited'; return; }
      try {
        if (!library) throw new Error('元数据解析库未加载');
        var parsed = type === 'xmp' ? await library.sidecar(data, opts, 'xmp') : await library.parse(data, opts);
        function visit(obj, path, depth) {
          if (!obj || typeof obj !== 'object' || depth > 8) return;
          Object.keys(obj).forEach(function (key) {
            if (key === 'xmlns' || /gps/i.test(key)) return;
            if (key === 'errors') { warn(source + '：解析器报告异常，输出可能不完整。'); return; }
            var history=/(?:^|\.)History(?:\.|$)/.test(path);
            var value = obj[key], kind = key==='when' && history ? 'time' : key==='action'&&history ? 'other' : kindOf(key);
            if (kind) add(source + (path ? '/' + path : ''), key, value, kind);
            else if (value && typeof value === 'object') visit(value, path ? path + '.' + key : key, depth + 1);
            else diagnostics.skippedFields++;
          });
        }
        visit(parsed, '', 0);
        item.fields=result.fields.length-count; item.status='parsed';
      } catch (e) { item.status='failed'; warn(source + '：未能解析该元数据块，请用桌面工具复核。'); }
    }
    function iptc(data,source) {
      var item=attempt(source,'IPTC',data.length), count=result.fields.length, p=0, records=0, utf8=false;
      if(!consume(data.length)){item.status='limited';return;}
      var tags={5:'ObjectName',25:'Keywords',55:'DateCreated',60:'TimeCreated',62:'DigitalCreationDate',63:'DigitalCreationTime',65:'OriginatingProgram',70:'ProgramVersion',80:'By-line',105:'Title',110:'Credit',116:'CopyrightNotice',120:'Description'};
      try {
        // Charset record can occur after text records. First validate and collect offsets.
        var entries=[];
        while(p<data.length && ++records<=10000) {
          if(p+5>data.length || data[p]!==0x1c) throw new Error('IPTC记录头无效');
          var rec=data[p+1], tag=data[p+2], length=data[p+3]*256+data[p+4]; p+=5;
          if(length&0x8000) {
            var n=length&0x7fff; if(n<1||n>4||p+n>data.length)throw new Error('IPTC扩展长度无效');
            length=0; while(n--)length=length*256+data[p++];
          }
          if(p+length>data.length)throw new Error('IPTC记录被截断');
          if(rec===1&&tag===90)utf8=ascii(data,p,p+length)==='\x1b%G';
          if(rec===2) entries.push({tag:tag,start:p,length:length});
          p+=length;
        }
        if(records>10000)throw new Error('IPTC记录数超限');
        entries.forEach(function(entry){
          var tag=tags[entry.tag];
          if(!tag){diagnostics.skippedFields++;return;}
          var value=decode(data.subarray(entry.start,entry.start+entry.length),utf8);
          add(source,'ObjectName'===tag?'Title':tag,value,kindOf(tag)||'other');
        });
        item.fields=result.fields.length-count;item.status='parsed';
      }catch(e){item.status='failed';warn(source+'：'+e.message+'，请复核IPTC。');}
    }
    async function photoshop(data,source) {
      var item=attempt(source,'Photoshop资源',data.length), p=14, records=0, count=result.fields.length;
      if(!consume(data.length)){item.status='limited';return;}
      if(ascii(data,0,Math.min(14,data.length))!=='Photoshop 3.0\0'){item.status='unsupported';return;}
      try{
        while(p<data.length && ++records<=10000){
          if(p+7>data.length || ascii(data,p,p+4)!=='8BIM')throw new Error('Photoshop资源头无效');
          var id=data[p+4]*256+data[p+5], nameLength=data[p+6], nameSize=1+nameLength; p+=6+nameSize+(nameSize&1);
          if(p+4>data.length)throw new Error('Photoshop资源长度被截断');
          var length=new DataView(data.buffer,data.byteOffset+p,4).getUint32(0);p+=4;
          if(p+length+(length&1)>data.length)throw new Error('Photoshop资源超出边界');
          var part=data.subarray(p,p+length), label=source+'/resource-'+id+'#'+records;
          if(id===0x0404)iptc(part,label+'/IPTC');
          else if(id===0x0424)await metadata(part,'xmp',label+'/XMP');
          else diagnostics.skippedFields++;
          p+=length+(length&1);
        }
        if(records>10000)throw new Error('Photoshop资源数超限');
        item.fields=result.fields.length-count;item.status='parsed';
      }catch(e){item.status='failed';warn(source+'：'+e.message+'，后续资源未解析。');}
    }
    async function pngText(data, type, source) {
      var item=attempt(source,type,data.length),count=result.fields.length;
      if (!consume(data.length)) {item.status='limited';return;}
      var zero = data.indexOf(0); if (zero < 1 || zero > 79) { item.status='failed';warn(source + '：文本关键词无效。'); return; }
      var key = decode(data.subarray(0, zero)), text, payload = data.subarray(zero + 1);
      try {
        if (type === 'tEXt') text = decode(payload);
        else if (type === 'zTXt') { if (payload[0] !== 0) throw new Error('压缩方式无效'); text = decode(await inflate(payload.subarray(1))); }
        else {
          if (payload.length < 4 || payload[0] > 1 || payload[1] !== 0) throw new Error('iTXt头无效');
          var languageEnd = payload.indexOf(0, 2), translatedEnd = languageEnd >= 2 ? payload.indexOf(0, languageEnd + 1) : -1;
          if (translatedEnd < 0) throw new Error('iTXt分隔符缺失');
          var content = payload.subarray(translatedEnd + 1); text = decode(payload[0] ? await inflate(content) : content, true);
        }
        if (key === 'XML:com.adobe.xmp') await metadata(new TextEncoder().encode(text), 'xmp', source + '/XMP');
        else if (!/gps/i.test(key)) add(source, key, text, kindOf(key) || 'other');
        item.fields=result.fields.length-count;item.status='parsed';
      } catch (e) { item.status='failed';warn(source + '：' + e.message + '，未能读取文本。'); }
    }
    if (bytes.length >= 8 && ascii(bytes, 0, 8) === '\x89PNG\r\n\x1a\n') {
      result.format = 'PNG'; result.supported = true;
      var at = 8, ended = false;
      while (at < bytes.length && ++segments <= 10000) {
        if (at + 12 > bytes.length) { warn('PNG块头被截断。'); break; }
        var length = view.getUint32(at), type = ascii(bytes, at + 4, at + 8), end = at + 12 + length;
        if (!/^[a-z]{4}$/i.test(type) || end > bytes.length) { warn('PNG块类型或长度异常，后续未解析。'); break; }
        var data = bytes.subarray(at + 8, end - 4), source = 'PNG/' + type + '#' + segments;
        container(type);
        var relevant = /^(IHDR|tEXt|iTXt|zTXt|tIME|eXIf)$/.test(type);
        var validCRC = !relevant || length > MAX_TEXT || crc32(bytes.subarray(at + 4, end - 4)) === view.getUint32(end - 4);
        if (!validCRC) {warn(source + '：CRC不匹配；该块字段未采用。');attempt(source,type,length).status='failed';}
        if (validCRC && type === 'IHDR' && length === 13) { result.width = view.getUint32(at + 8); result.height = view.getUint32(at + 12); }
        if (validCRC && /^(tEXt|iTXt|zTXt)$/.test(type)) await pngText(data, type, source);
        if (validCRC && type === 'eXIf') await metadata(data, 'tiff', source + '/EXIF');
        if (validCRC && type === 'tIME') {
          var timeAttempt=attempt(source,'tIME',length),timeCount=result.fields.length;timeAttempt.status=length===7?'parsed':'failed';
          if (length === 7) {
            add(source, 'tIME', view.getUint16(at + 8) + '-' + String(data[2]).padStart(2, '0') + '-' + String(data[3]).padStart(2, '0') + 'T' + String(data[4]).padStart(2, '0') + ':' + String(data[5]).padStart(2, '0') + ':' + String(data[6]).padStart(2, '0') + 'Z');
            timeAttempt.fields=result.fields.length-timeCount;
            var year = view.getUint16(at + 8), month = data[2], day = data[3], leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
            var days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || data[4] > 23 || data[5] > 59 || data[6] > 60) warn(source + '：日期分量超出正常范围，已保留原始分量，请勿作为有效时间采用。');
          }
          else warn(source + '：tIME长度无效。');
        }
        if (type === 'iCCP') {attempt(source,'ICC',length).status='unsupported';add(source, 'ICC profile', '检测到色彩配置块；未解析配置名称及内容。');}
        at = end;
        if (type === 'IEND') { ended = true; if (length || at < bytes.length) warn('PNG结束块异常或存在尾随字节。'); break; }
      }
      if (!ended) warn('未读到PNG结束块，可能截断或达到块数上限。');
    } else if (bytes.length >= 2 && bytes[0] === 255 && bytes[1] === 216) {
      result.format = 'JPEG'; result.supported = true;
      var pos = 2, stopped = false;
      while (pos < bytes.length && ++segments <= 10000) {
        if (bytes[pos++] !== 255) { warn('JPEG段标记异常，后续未解析。'); break; }
        while (pos < bytes.length && bytes[pos] === 255) pos++;
        var marker = bytes[pos++];
        if (marker === 0xd9) { stopped = true; break; }
        if (marker >= 0xd0 && marker <= 0xd7 || marker === 1) continue;
        if (pos + 2 > bytes.length) { warn('JPEG段长度被截断。'); break; }
        var size = view.getUint16(pos), stop = pos + size;
        if (size < 2 || stop > bytes.length) { warn('JPEG段超出文件边界。'); break; }
        var part = bytes.subarray(pos + 2, stop), label = 'JPEG/APP1#' + segments;
        container(marker>=0xe0&&marker<=0xef?'APP'+(marker-0xe0):marker===0xfe?'COM':'marker-'+marker.toString(16));
        if (marker === 0xe1) {
          if (ascii(part, 0, Math.min(6, part.length)) === 'Exif\0\0') await metadata(part.subarray(6), 'tiff', label + '/EXIF');
          else if (ascii(part, 0, Math.min(29, part.length)) === 'http://ns.adobe.com/xap/1.0/\0') await metadata(part.subarray(29), 'xmp', label + '/XMP');
          else if (ascii(part, 0, Math.min(35, part.length)).indexOf('http://ns.adobe.com/xmp/extension/') === 0) {attempt(label,'扩展XMP',part.length).status='unsupported';warn('检测到扩展XMP，未解析其分片内容。');}
          else attempt(label,'未知APP1',part.length).status='unsupported';
        }
        if(marker===0xed) await photoshop(part,'JPEG/APP13#'+segments);
        if(marker===0xfe){var comment=attempt('JPEG/COM#'+segments,'注释',part.length),commentCount=result.fields.length;if(consume(part.length)){var text;try{text=decode(part,true);}catch(e){text=decode(part);}add(comment.source,'Comment',text,'other');comment.fields=result.fields.length-commentCount;comment.status='parsed';}else comment.status='limited';}
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].indexOf(marker) >= 0 && part.length >= 5) { result.height = part[1] * 256 + part[2]; result.width = part[3] * 256 + part[4]; }
        pos = stop; if (marker === 0xda) { stopped = true; break; }
      }
      if (!stopped) warn('JPEG未读到扫描起点或结束标记；可能截断或达到段数上限。');
    } else if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
      result.format = 'WebP'; result.supported = true;
      var declared = view.getUint32(4, true) + 8, boundary = Math.min(bytes.length, declared), p = 12;
      if (declared !== bytes.length) warn('WebP容器大小与文件字节数不一致。');
      while (p < boundary && ++segments <= 10000) {
        if (p + 8 > boundary) { warn('WebP块头被截断。'); break; }
        var ct = ascii(bytes, p, p + 4), len = view.getUint32(p + 4, true), next = p + 8 + len + (len & 1);
        if (next > boundary) { warn('WebP块超出容器边界。'); break; }
        var chunk = bytes.subarray(p + 8, p + 8 + len), src = 'WebP/' + ct.trim() + '#' + segments;
        container(ct.trim());
        if (ct === 'EXIF') await metadata(ascii(chunk, 0, Math.min(6, len)) === 'Exif\0\0' ? chunk.subarray(6) : chunk, 'tiff', src);
        if (ct === 'XMP ') await metadata(chunk, 'xmp', src);
        if (ct === 'ICCP') {attempt(src,'ICC',len).status='unsupported';add(src, 'ICC profile', '检测到色彩配置块；未解析配置名称及内容。');}
        if (ct === 'VP8X' && len >= 10) { result.width = 1 + chunk[4] + chunk[5] * 256 + chunk[6] * 65536; result.height = 1 + chunk[7] + chunk[8] * 256 + chunk[9] * 65536; }
        if (ct === 'VP8 ' && len >= 10 && ascii(chunk, 3, 6) === '\x9d\x01\x2a') { result.width = (chunk[6] + chunk[7] * 256) & 16383; result.height = (chunk[8] + chunk[9] * 256) & 16383; }
        if (ct === 'VP8L' && len >= 5 && chunk[0] === 47) { var bits = new DataView(chunk.buffer, chunk.byteOffset, chunk.length).getUint32(1, true); result.width = 1 + (bits & 16383); result.height = 1 + (bits >>> 14 & 16383); }
        p = next;
      }
      if (segments > 10000) warn('已达到WebP块数上限。');
    } else warn('只支持按实际签名识别的 PNG、JPEG、WebP。SVG、PSD、HEIC、AVIF 等请用桌面工具；不会执行未知文件。');
    diagnostics.scanned=segments;
    var incomplete=diagnostics.attempts.some(function(x){return /failed|limited|unsupported/.test(x.status);}) || result.warnings.length>0;
    diagnostics.state=!result.supported?'unsupported':incomplete?'partial':result.fields.length?'extracted':diagnostics.attempts.length?'metadata-empty':'no-metadata';
    diagnostics.summary=!result.supported?'该格式未解析，不能据此说没有元数据。':incomplete?'发现未解析内容或结构异常；当前结果可能不完整，请看下方诊断。':result.fields.length?'已成功读取 '+result.fields.length+' 项展示字段；软件和日期是否存在需分别查看。':diagnostics.attempts.length?'检测到信息块并完成支持范围内的解析，但没有读到选定展示字段。':'已检查容器结构，未发现本工具支持的附加元数据块；这不同于文件读取失败。';
    return result;
  }
  // Transparent triage rules, not a trained image classifier or calibrated probability.
  function guess(info, file, context) {
    context = context || {};
    var name = String(file.name || ''), fields = info.fields || [];
    var declared = fields.filter(function (f) { return f.kind === 'software'; });
    var dates = fields.filter(function (f) { return f.kind === 'time' && !/^(OffsetTime|SubSecTime)/i.test(f.tag); });
    var profile = context.profile || 'auto', device = context.device || 'unknown';
    var inferredProfile = false;
    if (profile === 'auto') {
      profile = /漫画|條漫|条漫|comic|manga/i.test(name) ? 'comic' : /立绘|立繪|赛璐璐|賽璐璐|二次元|头像|頭像|cel.shad/i.test(name) ? 'anime' : /厚涂|厚塗|paint study/i.test(name) ? 'paint' : 'general';
      inferredProfile = profile !== 'general';
    }
    var items = [
      {id:'csp',name:'Clip Studio Paint（CSP）',match:/(?:^|[^a-z0-9])(?:csp|clip[ _-]*studio(?:[ _-]*paint)?|优动漫|優動漫)(?:$|[^a-z0-9])/i, profiles:['anime','comic'], devices:['desktop','ipad','android']},
      {id:'sai2',name:'SAI / SAI2',match:/(?:^|[^a-z0-9])sai2?(?:$|[^a-z0-9])/i, profiles:['anime'], devices:['desktop']},
      {id:'ps',name:'Photoshop',match:/(?:^|[^a-z0-9])(?:photoshop|ps)(?:$|[^a-z0-9])/i, profiles:['paint'], devices:['desktop','ipad']},
      {id:'procreate',name:'Procreate',match:/procreate/i, profiles:[], devices:['ipad']},
      {id:'krita',name:'Krita',match:/krita/i, profiles:['paint'], devices:['desktop','android']},
      {id:'ibis',name:'爱笔思画（ibisPaint）',match:/ibis[ _-]*paint|爱笔思画|愛筆思畫/i, profiles:[], devices:['desktop','ipad','android']},
      {id:'medibang',name:'MediBang Paint',match:/medibang/i, profiles:['comic'], devices:['desktop','ipad','android']}
    ];
    var nameHint = false;
    items.forEach(function (item) {
      item.score = 0; item.reasons = [];
      if (item.match.test(name)) { nameHint = true; item.score += 10; item.reasons.push('文件名包含该工具名称；文件名可被任意修改，仅作弱线索。'); }
      if (item.profiles.indexOf(profile) >= 0) { item.score += 2; item.reasons.push((inferredProfile ? '文件名提示的用途' : '你选择的用途') + '与该工具的绘画功能相容，不代表软件指纹。'); }
      if (device !== 'unknown') {
        if (item.devices.indexOf(device) >= 0) { item.score += 3; item.reasons.push('该软件支持你选择的设备平台；不是实际安装或使用记录。'); }
        else { item.score -= 3; item.reasons.push('与所选设备的直接绘制流程不匹配，优先级降低；跨设备处理仍可能。'); }
      }
      if (!item.reasons.length) item.reasons.push('缺少能区分软件的线索，保留为同等候选。');
      delete item.match; delete item.profiles; delete item.devices;
    });
    items.sort(function (a,b) { return b.score - a.score; });
    var top = items.filter(function (x) { return x.score === items[0].score; });
    var software = {
      missing: !declared.length, candidates:items, top:top.map(function (x) { return x.name; }),
      confidence:'低', basis:nameHint ? '文件名包含工具名称，优先据此猜测；该名称可由任何人修改，仍需原始标签或工程核对。' : inferredProfile ? '按文件名中的用途词推测，未自动识别画风。' : profile !== 'general' || device !== 'unknown' ? '按你补充的用途与设备推测。' : '无区分线索，候选并列；不强行指定唯一软件。',
      note:'排序是公开规则下的优先核查顺序，没有统计概率；PNG/JPEG/WebP、尺寸和画风不能唯一识别软件。其他绘画工具、纸绘扫描、生成后编辑及多软件流程仍可能。'
    };
    var time = { missing:!dates.length, title:'候选日期待交叉核对', value:'没有可用日期锚点', confidence:'极低', basis:'可先猜测它经过导出、下载或转存；仅凭当前文件不能缩小实际绘制年月。' };
    if (!dates.length) {
      var match = name.match(/(?:^|\D)((?:19|20)\d{2})[-_.年]?([01]\d)[-_.月]?([0-3]\d)(?:日)?(?=\D|$)/);
      if (match) {
        var y=+match[1],m=+match[2],d=+match[3], check = new Date(Date.UTC(y,m-1,d));
        if (check.getUTCFullYear()===y && check.getUTCMonth()===m-1 && check.getUTCDate()===d && check.getTime()<=Date.now()) {
          time.value=match[1]+'-'+match[2]+'-'+match[3]; time.confidence='低';
          time.basis='文件名包含有效日期。优先猜测它是命名、导出或归档日期；只有作者按创作日期命名时，才可作为绘制日期候选。';
        }
      }
      var local = file.lastModified == null ? null : new Date(file.lastModified);
      if (time.value==='没有可用日期锚点' && local && Number.isFinite(local.getTime()) && local.getTime()<=Date.now()) {
        time.value=local.toISOString();
        time.basis=context.origin==='download' ? '你标记为下载、截图或转存：优先猜测此时刻对应文件获取或处理，也可能保留了来源文件的修改时间；不再用它猜绘制完成。实际绘制可能早很多，间隔没有依据。' : context.origin==='original' ? '你标记为原始导出：暂猜绘制完成接近此文件修改时刻；只有导出后未复制改写、修改时间被保留且画完随即导出时才成立。' : '暂以此本地修改时间作为条件候选：若文件刚画完即原始导出且时间未变，完成时间可能在附近；若为下载、截图、复制或同步文件，该假设不成立，绘制日期可能早很多。';
      }
    } else {
      time.value=dates[0].value; time.confidence='仅为字段声明';
      time.basis='现存日期按来源在下方展示；不将不同日期自动排序成绘制时间。';
    }
    return {software:software,time:time,context:{profile:context.profile||'auto',device:device,origin:context.origin||'unknown'}};
  }
  function report(info, file, context) {
    var lines = ['插画元数据检查报告', '文件：' + file.name, '字节数：' + file.size, '格式：' + info.format,
      '尺寸（容器声明）：' + (info.width && info.height ? info.width + ' × ' + info.height : '未读取到'),
      '真实绘制时间：无法仅凭此文件确定', '绘制工时：无法确定',
      '本地文件 lastModified：' + (file.lastModified == null ? '教学样本，未采用本地时间' : new Date(file.lastModified).toISOString()) + '；不是绘制时间证明',
      '检查时刻：' + new Date().toISOString() + '；不是图片创建时间', '工具：Cel Atelier 元数据检查器 v'+VERSION+' / exifr 7.1.3', '', '读取到的声明（仅含本工具展示字段）：'];
    info.fields.forEach(function (f) { lines.push('[' + f.source + '] ' + f.tag + ' = ' + f.value, '解释：' + f.explanation); });
    if (!info.fields.length) lines.push('未提取到展示范围内的字段；不代表从未存在元数据。');
    if(info.diagnostics){lines.push('','提取诊断：'+info.diagnostics.summary,'容器记录：'+JSON.stringify(info.diagnostics.containers),'解析记录：'+JSON.stringify(info.diagnostics.attempts),'未展示的字段/资源数：'+info.diagnostics.skippedFields);}
    if (info.supported) {
      var inferred=guess(info,file,context);
      if (inferred.software.missing || inferred.time.missing) {
        lines.push('', '缺失项的条件推测（与提取字段分开）：', '补充条件：'+JSON.stringify(inferred.context));
        if (inferred.software.missing) {
          lines.push('软件优先猜测（低置信）：'+inferred.software.top.join(' / '),inferred.software.basis);
          inferred.software.candidates.forEach(function (c) { lines.push('候选：'+c.name+'；依据：'+c.reasons.join(' ')); });
          lines.push(inferred.software.note);
        }
        if (inferred.time.missing) lines.push('时间条件候选（'+inferred.time.confidence+'）：'+inferred.time.value,inferred.time.basis,'该候选不是提取到的绘制日期；不估算无依据的工时。');
      }
    }
    lines.push('', '异常/范围提示：', info.warnings.join('\n') || '本次有限结构检查未报告异常，未验证完整有效性。', '', CAUTION, LIMITS,
      '下一步：保留原始附件，向作者索取阶段图、原生工程与可信发布/接收记录，交叉核对来源与时区。');
    return lines.join('\n');
  }
  root.REVERSE_METADATA = { VERSION:VERSION, analyze: analyze, guess: guess, report: report, kindOf: kindOf, meaning: meaning, crc32: crc32, MAX_FILE: MAX_FILE, LIMITS: LIMITS, CAUTION: CAUTION };
})(typeof self !== 'undefined' ? self : window);
