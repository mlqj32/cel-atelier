/* Binary parsing and information-loss regressions; runs without a browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/reverse-lab.js'), 'utf8'), context);
const { mix8, candidates, crc32, inspectBytes } = context.window.REVERSE_LAB;
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
check('CRC-32 known standard vector', () => assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926));
check('quantization really merges distinct source values', () => {
  assert.equal(mix8(101, 240, .5), 171);
  assert.equal(mix8(102, 240, .5), 171);
  assert.deepEqual(Array.from(candidates(171, 240, .5)), [101, 102]);
});
check('transparent and opaque limits', () => {
  assert.deepEqual(Array.from(candidates(101, 240, 0)), [101]);
  assert.equal(candidates(240, 240, 1).length, 256);
});
const sample = fs.readFileSync(path.join(root, 'assets/practice/reverse-sample.png'));
check('real sample chunks, dimensions and CRCs', () => {
  const r = inspectBytes(sample);
  assert.equal(r.format, 'PNG'); assert.equal(r.width, 128); assert.equal(r.height, 128);
  assert.equal(r.chunks[0].type, 'IHDR'); assert.equal(r.chunks[0].length, 13);
  assert.equal(r.chunks.at(-1).type, 'IEND'); assert.equal(r.warnings.length, 0);
  assert.ok(r.chunks.every(c => c.crc));
  assert.ok(r.fields.some(f => f.name === 'Software' && f.value === 'Cel Atelier Demo Exporter'));
  assert.ok(r.fields.some(f => f.name.startsWith('tIME') && f.value === '2026-11-15T04:00:00Z'));
});
check('typed-array subview respects byteOffset', () => {
  const padded = Buffer.concat([Buffer.alloc(19, 0xff), sample, Buffer.alloc(8)]);
  assert.equal(inspectBytes(padded.subarray(19, 19 + sample.length)).width, 128);
});
check('truncated PNG is reported without reading beyond buffer', () => {
  const r = inspectBytes(sample.subarray(0, 24));
  assert.ok(r.warnings.some(x => x.includes('超出文件边界')));
  assert.ok(r.warnings.some(x => x.includes('未读到IEND')));
});
check('corrupted chunk CRC is detected', () => {
  const damaged = Buffer.from(sample); damaged[20] ^= 1;
  assert.ok(inspectBytes(damaged).warnings.some(x => x.includes('CRC不匹配')));
});
check('hostile huge chunk length is bounded', () => {
  const damaged = Buffer.from(sample); damaged.writeUInt32BE(0xffffffff, 8);
  assert.ok(inspectBytes(damaged).warnings.some(x => x.includes('超出文件边界')));
});
check('trailing bytes after IEND are not silently validated', () => {
  assert.ok(inspectBytes(Buffer.concat([sample, Buffer.from('extra')])).warnings.some(x => x.includes('额外字节')));
});
check('JPEG recognition explicitly limits parsing scope', () => {
  const r = inspectBytes(Buffer.from([255, 216, 255, 217]));
  assert.ok(r.format.startsWith('JPEG')); assert.ok(r.summary.includes('未解析')); assert.equal(r.chunks.length, 0);
});
check('WebP length uses little endian RIFF convention', () => {
  const bytes = Buffer.alloc(20); bytes.write('RIFF'); bytes.writeUInt32LE(12, 4); bytes.write('WEBP', 8);
  const r = inspectBytes(bytes); assert.ok(r.format.startsWith('WebP')); assert.equal(r.warnings.length, 0);
  bytes.writeUInt32LE(100, 4); assert.equal(inspectBytes(bytes).warnings.length, 1);
});
check('PSD header does not confuse channel count with layers', () => {
  const bytes = Buffer.alloc(26); bytes.write('8BPS'); bytes.writeUInt16BE(1, 4); bytes.writeUInt16BE(3, 12);
  bytes.writeUInt32BE(480, 14); bytes.writeUInt32BE(640, 18); bytes.writeUInt16BE(8, 22); bytes.writeUInt16BE(3, 24);
  const r = inspectBytes(bytes); assert.ok(r.fields[0].value.includes('通道数3，宽640，高480')); assert.ok(r.fields[0].name.includes('非图层数'));
});
check('short and unknown files remain unrecognized', () => {
  for (const bytes of [Buffer.alloc(0), Buffer.from('PNG'), Buffer.from('not an image')]) assert.equal(inspectBytes(bytes).format, '未识别');
});
console.log(JSON.stringify({ checks, errors: [] }));
