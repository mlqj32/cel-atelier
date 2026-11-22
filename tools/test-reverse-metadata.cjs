/* Generated metadata below is fictional test data attached to original artwork. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict'), zlib = require('zlib');
const root = path.resolve(__dirname, '..'), dir = path.join(__dirname, 'fixtures/metadata');
const context = { window: {}, Uint8Array, DataView, TextDecoder, TextEncoder, Blob, DecompressionStream, Date };
vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/reverse-metadata-core.js'), 'utf8'), context);
const core = context.window.REVERSE_METADATA, exifr = require('../assets/js/vendor/exifr-7.1.3.umd.js');
const read = name => fs.readFileSync(path.join(dir, name));
function pngChunk(type, data) { const head = Buffer.alloc(8); head.writeUInt32BE(data.length); head.write(type, 4); const tail = Buffer.alloc(4); tail.writeUInt32BE(core.crc32(Buffer.concat([Buffer.from(type), data]))); return Buffer.concat([head, data, tail]); }
function png(...chunks) { const base = read('clean.png'); return Buffer.concat([base.subarray(0, 33), ...chunks, base.subarray(33)]); }
function text(key, value) { return pngChunk('tEXt', Buffer.from(key + '\0' + value, 'latin1')); }
function itxt(key, value, compressed = false) { const bytes = Buffer.from(value); return pngChunk('iTXt', Buffer.concat([Buffer.from(key + '\0'), Buffer.from([compressed ? 1 : 0, 0, 0, 0]), compressed ? zlib.deflateSync(bytes) : bytes])); }
function tiff(little = true) {
  const b = Buffer.alloc(512); b.write(little ? 'II' : 'MM');
  const u16 = (v, o) => little ? b.writeUInt16LE(v, o) : b.writeUInt16BE(v, o), u32 = (v, o) => little ? b.writeUInt32LE(v, o) : b.writeUInt32BE(v, o);
  u16(42, 2); u32(8, 4); let dataAt = 128;
  function ifd(at, entries) { u16(entries.length, at); entries.forEach(([tag, val], i) => { const p = at + 2 + i * 12; u16(tag, p); if (typeof val === 'number') { u16(4, p + 2); u32(1, p + 4); u32(val, p + 8); } else { const buf = Buffer.from(val + '\0'); u16(2, p + 2); u32(buf.length, p + 4); u32(dataAt, p + 8); buf.copy(b, dataAt); dataAt += buf.length; } }); u32(0, at + 2 + entries.length * 12); }
  ifd(8, [[0x131, 'Demo Painter A'], [0x132, '2021:02:03 04:05:06'], [0x13b, 'Demo Artist'], [0x8769, 64]]);
  ifd(64, [[0x9003, '2020:01:02 03:04:05'], [0x9011, '+08:00']]); return b.subarray(0, dataAt);
}
const xmp = Buffer.from('<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:tiff="http://ns.adobe.com/tiff/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmp:CreatorTool="Demo Exporter B" xmp:CreateDate="2022-04-05T06:07:08+08:00" xmp:ModifyDate="2022-04-04T23:07:08-07:00" tiff:Software="Demo Tool C"><dc:creator><rdf:Seq><rdf:li>教学作者小鹿</rdf:li></rdf:Seq></dc:creator></rdf:Description></rdf:RDF></x:xmpmeta>');
const historyXmp=Buffer.from('<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#"><xmpMM:History><rdf:Seq><rdf:li rdf:parseType="Resource"><stEvt:action>saved</stEvt:action><stEvt:softwareAgent>Reference History Tool</stEvt:softwareAgent><stEvt:when>2025-01-02T03:04:05+08:00</stEvt:when></rdf:li></rdf:Seq></xmpMM:History></rdf:Description></rdf:RDF></x:xmpmeta>');
function resource(id,data,name='') { const signature=Buffer.from('8BIM'),h=Buffer.alloc(2);h.writeUInt16BE(id);const n=Buffer.from(name),pascal=Buffer.concat([Buffer.from([n.length]),n,Buffer.alloc((n.length+1)&1)]),len=Buffer.alloc(4);len.writeUInt32BE(data.length);return Buffer.concat([signature,h,pascal,len,data,Buffer.alloc(data.length&1)]); }
function app(marker, data) { const h = Buffer.from([255, marker, 0, 0]); h.writeUInt16BE(data.length + 2, 2); return Buffer.concat([h, data]); }
function jpeg(...segments) { const b = read('clean.jpg'); return Buffer.concat([b.subarray(0, 2), ...segments, b.subarray(2)]); }
function riffChunk(type, data) { const h = Buffer.alloc(8); h.write(type); h.writeUInt32LE(data.length, 4); return Buffer.concat([h, data, Buffer.alloc(data.length & 1)]); }
function webp(...chunks) { const b = read('clean.webp'), vp8x = Buffer.alloc(10); vp8x[0] = 0x0c; vp8x.writeUIntLE(239, 4, 3); vp8x.writeUIntLE(179, 7, 3); const body = Buffer.concat([Buffer.from('WEBP'), riffChunk('VP8X', vp8x), b.subarray(12), ...chunks]); const h = Buffer.alloc(8); h.write('RIFF'); h.writeUInt32LE(body.length, 4); return Buffer.concat([h, body]); }
const fixtures = {
  'exif-xmp.jpg': jpeg(app(0xe1, Buffer.concat([Buffer.from('Exif\0\0'), tiff()])), app(0xe1, Buffer.concat([Buffer.from('http://ns.adobe.com/xap/1.0/\0'), xmp]))),
  'exif-big-endian.jpg': jpeg(app(0xe1, Buffer.concat([Buffer.from('Exif\0\0'), tiff(false)]))),
  'exif-xmp.webp': webp(riffChunk('EXIF', tiff()), riffChunk('XMP ', xmp)),
  'text-exif-xmp.png': png(text('Software', 'Demo PNG Tool'), pngChunk('eXIf', tiff()), itxt('XML:com.adobe.xmp', xmp.toString()), itxt('Author', '原创测试作者'), itxt('Description', '测试 UTF-8 压缩文本', true), pngChunk('zTXt', Buffer.concat([Buffer.from('Comment\0\0'), zlib.deflateSync(Buffer.from('Compressed Latin-1 text'))]))),
  'long-hostile.png': png(itxt('Software', '<img src=x onerror=alert(1)>' + '非常长的测试字段'.repeat(650))),
  'invalid.png': Buffer.from([137,80,78,71,13,10,26,10,255,255,255,255,116,69,88,116]),
  'unsupported.svg': Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
  'empty.png': Buffer.alloc(0)
};
fixtures['history-xmp.jpg']=jpeg(app(0xe1,Buffer.concat([Buffer.from('http://ns.adobe.com/xap/1.0/\0'),historyXmp])));
fixtures['date-aliases.png']=png(text('date:create','2025-01-02T03:04:05+08:00'),text('date:modify','2025-01-03T04:05:06+08:00'));
fixtures['other-only.png']=png(text('Description','Reference description only; no software or date declaration.'));
fixtures['app13-xmp.jpg']=jpeg(app(0xed,Buffer.concat([Buffer.from('Photoshop 3.0\0'),resource(0x0424,historyXmp,'test')])));
for (const [name, bytes] of Object.entries(fixtures)) fs.writeFileSync(path.join(dir, name), bytes);
let count = 0;
async function test(name, run) { await run(); count++; console.log('PASS ' + name); }
(async () => {
  await test('clean PNG/JPEG/WebP dimensions and honest missing fields', async () => { for (const name of ['clean.png', 'clean.jpg', 'clean.webp']) { const r = await core.analyze(read(name), exifr); assert.equal(r.width, 240); assert.equal(r.height, 180); assert.equal(r.fields.length, 0); assert.equal(r.warnings.length, 0); } });
  await test('original demo PNG software and internal dates', async () => { const r = await core.analyze(fs.readFileSync(path.join(root, 'assets/practice/reverse-sample.png')), exifr); assert(r.fields.some(f => f.value === 'Cel Atelier Demo Exporter')); assert(r.fields.some(f => f.tag === 'tIME' && f.value === '2026-11-15T04:00:00Z')); });
  await test('JPEG EXIF and XMP retain three distinct software sources', async () => { const r = await core.analyze(fixtures['exif-xmp.jpg'], exifr); const s = r.fields.filter(f => f.kind === 'software'); assert.equal(s.length, 3); assert.equal(new Set(s.map(f => f.source)).size, 3); assert(r.fields.some(f => f.tag === 'DateTimeOriginal' && f.value === '2020:01:02 03:04:05')); assert(r.fields.some(f => f.tag === 'OffsetTimeOriginal' && f.value === '+08:00')); assert(r.fields.some(f => f.value === '教学作者小鹿')); });
  await test('EXIF little/big endian and byteOffset subviews', async () => { const a = await core.analyze(fixtures['exif-xmp.jpg'], exifr), b = await core.analyze(fixtures['exif-big-endian.jpg'], exifr); assert.deepEqual(a.fields.filter(f => f.source.includes('/EXIF')), b.fields); const padded = Buffer.concat([Buffer.alloc(13), fixtures['exif-big-endian.jpg'], Buffer.alloc(7)]); assert.deepEqual((await core.analyze(padded.subarray(13, -7), exifr)).fields, b.fields); });
  await test('PNG tEXt/iTXt/zTXt/eXIf/XMP and compressed Unicode', async () => { const r = await core.analyze(fixtures['text-exif-xmp.png'], exifr); assert.equal(r.fields.filter(f => f.kind === 'software').length, 4); for (const value of ['原创测试作者', '测试 UTF-8 压缩文本', 'Compressed Latin-1 text']) assert(r.fields.some(f => f.value === value)); assert.equal(r.warnings.length, 0); });
  await test('WebP EXIF/XMP and RIFF size mismatch', async () => { const r = await core.analyze(fixtures['exif-xmp.webp'], exifr); assert.equal(r.fields.filter(f => f.kind === 'software').length, 3); assert.equal(r.width, 240); assert.equal(r.warnings.length, 0); const bad = Buffer.from(fixtures['exif-xmp.webp']); bad.writeUInt32LE(0xffffffff, 4); assert((await core.analyze(bad, exifr)).warnings.length > 0); });
  await test('conflicting dates and time zones remain verbatim, never sorted into drawing time', async () => { const r = await core.analyze(fixtures['exif-xmp.jpg'], exifr); const dates = r.fields.filter(f => f.kind === 'time'); assert(dates.some(f => f.value.endsWith('+08:00'))); assert(dates.some(f => f.value.endsWith('-07:00'))); assert(dates.some(f => f.tag === 'DateTimeOriginal' && f.explanation.includes('未见明确时区'))); const txt = core.report(r, {name:'demo.jpg',size:123,lastModified:1700000000000}); assert(txt.includes('真实绘制时间：无法仅凭此文件确定')); assert(txt.includes('绘制工时：无法确定')); assert(txt.includes('不是绘制时间证明')); assert(txt.includes('[JPEG/APP1#1/EXIF/ifd0]')); });
  await test('bad CRC metadata is rejected and truncated bounds are reported', async () => { const block = text('Software','bad'); block[block.length - 1] ^= 1; const r = await core.analyze(png(block), exifr); assert.equal(r.fields.length, 0); assert(r.warnings.some(x => x.includes('CRC'))); assert((await core.analyze(fixtures['invalid.png'], exifr)).warnings.some(x => /异常|截断/.test(x))); });
  await test('broken EXIF offsets do not abort other independent XMP', async () => { const bad = tiff(); bad.writeUInt32LE(0x7fffffff, 18); const r = await core.analyze(jpeg(app(0xe1, Buffer.concat([Buffer.from('Exif\0\0'), bad])), app(0xe1, Buffer.concat([Buffer.from('http://ns.adobe.com/xap/1.0/\0'), xmp]))), exifr); assert(r.fields.some(f => f.value === 'Demo Exporter B')); });
  await test('decompression bomb and oversized metadata are bounded', async () => { const b = png(itxt('Software', 'a'.repeat(1024 * 1024 + 1), true)); const r = await core.analyze(b, exifr); assert.equal(r.fields.length, 0); assert(r.warnings.some(x => x.includes('1 MiB'))); const big = await core.analyze(png(text('Software','a'.repeat(1024 * 1024))), exifr); assert.equal(big.fields.length, 0); assert(big.warnings.length); });
  await test('long hostile strings remain inert data and display is bounded', async () => { const r = await core.analyze(fixtures['long-hostile.png'], exifr); assert(r.fields[0].value.startsWith('<img')); assert(r.fields[0].value.length < 4100); assert(r.warnings.length); });
  await test('unsupported / empty files never execute or invent metadata', async () => { for (const name of ['unsupported.svg', 'empty.png']) { const r = await core.analyze(fixtures[name], exifr); assert.equal(r.supported, false); assert.equal(r.fields.length, 0); assert(r.warnings.length); } });
  await test('32 MiB file limit enforced', async () => { await assert.rejects(core.analyze(new Uint8Array(core.MAX_FILE + 1), exifr), /32 MiB/); });
  await test('ExifTool-authored APP13 IPTC and COM regression retains actual program, raw dates and comment', async () => {
    const r=await core.analyze(read('reference-iptc.jpg'),exifr);
    for(const [tag,value]of [['OriginatingProgram','Reference Test Tool'],['ProgramVersion','26.0'],['DateCreated','20250304'],['TimeCreated','123456+0800'],['Comment','REFERENCE TEST; not a genuine software export.']])assert(r.fields.some(f=>f.tag===tag&&f.value===value),tag);
    assert.equal(r.fields.length,5);assert.equal(r.warnings.length,0);assert.equal(r.diagnostics.state,'extracted');
    assert(r.diagnostics.attempts.some(x=>x.type==='IPTC'&&x.status==='parsed'&&x.fields===4));
  });
  await test('XMP history softwareAgent, event time and action are extracted even without CreatorTool', async () => {
    const r=await core.analyze(fixtures['history-xmp.jpg'],exifr);
    assert(r.fields.some(f=>f.tag==='softwareAgent'&&f.kind==='software'&&f.value==='Reference History Tool'));
    assert(r.fields.some(f=>f.tag==='when'&&f.kind==='time'&&f.value==='2025-01-02T03:04:05+08:00'));
    assert(r.fields.some(f=>f.tag==='action'&&f.value==='saved'));assert.equal(r.warnings.length,0);
  });
  await test('PNG date aliases are time fields rather than hidden in other descriptions',async()=>{
    const r=await core.analyze(fixtures['date-aliases.png'],exifr);
    assert.equal(r.fields.filter(f=>f.kind==='time').length,2);assert.equal(r.diagnostics.state,'extracted');
  });
  await test('APP13 XMP resource Pascal name and padding are parsed',async()=>{
    const r=await core.analyze(fixtures['app13-xmp.jpg'],exifr);assert(r.fields.some(f=>f.tag==='softwareAgent'));assert.equal(r.warnings.length,0);
  });
  await test('truncated Photoshop resource is reported as incomplete instead of metadata absent',async()=>{
    const bad=resource(0x0404,Buffer.from([0x1c,2,65,0,3,97,98,99]));bad.writeUInt32BE(0x7fffffff,8);
    const r=await core.analyze(jpeg(app(0xed,Buffer.concat([Buffer.from('Photoshop 3.0\0'),bad]))),exifr);
    assert.equal(r.diagnostics.state,'partial');assert(r.warnings.some(x=>x.includes('边界')));assert(r.diagnostics.attempts.some(x=>x.status==='failed'));
  });
  await test('diagnostic distinguishes no blocks, other metadata, excluded fields and parse failure',async()=>{
    const clean=await core.analyze(read('clean.png'),exifr);assert.equal(clean.diagnostics.state,'no-metadata');
    const other=await core.analyze(png(text('Description','just a description')),exifr);assert.equal(other.diagnostics.state,'extracted');assert.equal(other.fields[0].kind,'other');
    const broken=await core.analyze(png(pngChunk('eXIf',Buffer.from('broken'))),exifr);assert.equal(broken.diagnostics.state,'partial');
    const report=core.report(clean,{name:'clean.png',size:100,lastModified:null});assert(report.includes('提取诊断'));assert(report.includes('容器记录'));
  });
  await test('missing fields produce conditional candidates without changing extracted evidence', async () => {
    const info=await core.analyze(read('clean.png'),exifr), before=JSON.stringify(info);
    const r=core.guess(info,{name:'梦薇立绘原图.png',lastModified:1700000000000});
    assert.equal(r.software.missing,true); assert.equal(r.time.missing,true);
    assert(r.software.top.some(x=>x.includes('CSP'))); assert(r.software.top.some(x=>x.includes('SAI')));
    assert(r.time.basis.includes('假设不成立')); assert.equal(r.time.confidence,'极低');
    assert(core.guess(info,{name:'image.png',lastModified:1700000000000},{origin:'download'}).time.basis.includes('不再用它猜绘制完成'));
    assert.equal(JSON.stringify(info),before);
  });
  await test('no distinguishing clue preserves ties; format and size do not identify an app', async () => {
    const a=core.guess({fields:[],format:'PNG',width:100,height:200},{name:'image.png'});
    const b=core.guess({fields:[],format:'WebP',width:9999,height:9999},{name:'image.webp'});
    assert(a.software.top.length>1); assert.deepEqual(a.software.top,b.software.top);
    assert(a.software.basis.includes('并列')); assert.equal(a.time.value,'没有可用日期锚点');
  });
  await test('filename tool hint stays weak; device and manually supplied purpose update candidates', async () => {
    const info={fields:[]};
    assert(core.guess(info,{name:'portrait_CSP_final.png'}).software.top[0].includes('CSP'));
    assert(core.guess(info,{name:'portrait_CSP_final.png'}).software.candidates[0].reasons.some(x=>x.includes('任意修改')));
    assert(core.guess(info,{name:'portrait_CSP_final.png'}).software.basis.includes('文件名包含工具名称'));
    assert.equal(core.guess(info,{name:'image.png'},{device:'desktop'}).software.top.includes('Procreate'),false);
    const comic=core.guess(info,{name:'image.png'},{profile:'comic'});
    assert(comic.software.top.some(x=>x.includes('CSP')));assert(comic.software.top.some(x=>x.includes('MediBang')));
  });
  await test('filename dates validate calendar and override local conditional dates, without asserting drawing date', async () => {
    const info={fields:[]}, f={name:'立绘_2024-02-29.png',lastModified:1700000000000};
    const good=core.guess(info,f).time; assert.equal(good.value,'2024-02-29');assert(good.basis.includes('只有'));
    const bad=core.guess(info,{...f,name:'立绘_2023-02-29.png'}).time;assert.notEqual(bad.value,'2023-02-29');
    assert.equal(core.guess(info,{name:'image.png',lastModified:NaN}).time.value,'没有可用日期锚点');
  });
  await test('existing software and dates remain declarations; offset alone is not an event date', async () => {
    const info=await core.analyze(fixtures['exif-xmp.jpg'],exifr), g=core.guess(info,{name:'立绘.png'});
    assert.equal(g.software.missing,false);assert.equal(g.time.missing,false);
    const txt=core.report(info,{name:'立绘.png',size:123,lastModified:null});assert(!txt.includes('缺失项的条件推测'));
    assert.equal(core.guess({fields:[{kind:'time',tag:'OffsetTimeOriginal',value:'+08:00'}]},{name:'image.png'}).time.missing,true);
  });
  await test('export includes the same assumptions, candidates and user conditions as UI', async () => {
    const info=await core.analyze(read('clean.png'),exifr), f={name:'立绘_2024-01-02.png',size:123,lastModified:null};
    const txt=core.report(info,f,{device:'ipad',profile:'anime',origin:'original'});
    assert(txt.includes('软件优先猜测（低置信）'));assert(txt.includes('时间条件候选（低）：2024-01-02'));
    assert(txt.includes('"device":"ipad"'));assert(txt.includes('真实绘制时间：无法仅凭此文件确定'));
    assert.equal(info.fields.length,0);
  });
  await test('invalid PNG calendar components are flagged, not silently normalized', async () => { const r = await core.analyze(png(pngChunk('tIME', Buffer.from([7,234,2,30,25,0,0]))), exifr); assert(r.fields.some(f => f.value === '2026-02-30T25:00:00Z')); assert(r.warnings.some(x => x.includes('超出正常范围'))); });
  await test('200-field cap and selected privacy fields', async () => { const r = await core.analyze(png(...Array.from({length:210}, (_,i)=>text('Software','tool'+i))), exifr); assert.equal(r.fields.length, 200); assert(r.warnings.some(x => x.includes('200'))); const r2 = await core.analyze(png(itxt('XML:com.adobe.xmp', xmp.toString().replace('xmp:CreatorTool=', 'tiff:GPSLatitude="12.3456" xmp:CreatorTool='))), exifr); assert(!r2.fields.some(f => /gps/i.test(f.tag))); });
  console.log(JSON.stringify({checks:count,errors:[]}));
})().catch(error => { console.error(error); process.exitCode = 1; });
