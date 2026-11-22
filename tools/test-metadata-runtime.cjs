/* Offline transport regression: real bundled parser with network/file imports
 * disabled, plus resource/error/cancellation checks for the browser adapter. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
execFileSync(process.execPath, [path.join(__dirname, 'build-metadata-runtime.cjs'), '--check'], { stdio: 'inherit' });
const bundleContext = { window: {} }; vm.createContext(bundleContext);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/reverse-metadata-runtime.js'), 'utf8'), bundleContext);
const runtime = bundleContext.window.REVERSE_METADATA_RUNTIME;
const ioSource = fs.readFileSync(path.join(root, 'assets/js/reverse-metadata-io.js'), 'utf8');
function parserContext(deliver) {
  const c = { Uint8Array, DataView, ArrayBuffer, TextDecoder, TextEncoder, Blob, DecompressionStream,
    fetch() { throw new Error('Network is unavailable in this test'); },
    importScripts() { throw new Error('External script loading is unavailable in this test'); }, postMessage: deliver };
  c.self = c; vm.createContext(c); vm.runInContext(runtime.workerSource, c); return c;
}
function environment(mode = 'normal') {
  const blobs = new Map(), timers = new Map(), workers = []; let id = 0;
  class Reader {
    readAsArrayBuffer(file) { Promise.resolve().then(async () => { if (mode === 'read-error') { this.onerror(); return; } this.result = await file.arrayBuffer(); this.onload(); }); }
  }
  class Worker {
    constructor(url) {
      if (mode === 'blocked') { const e = new Error('local origin blocked'); e.name = 'SecurityError'; throw e; }
      this.sourceBlob = blobs.get(url); this.terminated = false; workers.push(this);
    }
    postMessage(buffer) {
      Promise.resolve().then(async () => {
        if (this.terminated || mode === 'timeout') return;
        if (mode === 'worker-error') { this.onerror({preventDefault(){}}); return; }
        if (mode === 'message-error') { this.onmessageerror(); return; }
        const source = await this.sourceBlob.text(); assert.equal(source, runtime.workerSource);
        this.parser = parserContext(data => { if (!this.terminated) this.onmessage({data}); });
        await this.parser.onmessage({data:buffer});
      });
    }
    terminate() { this.terminated = true; }
  }
  const c = { window: {REVERSE_METADATA_RUNTIME:runtime}, FileReader:Reader, Blob, Uint8Array, Worker,
    atob:s=>Buffer.from(s,'base64').toString('latin1'),
    URL:{createObjectURL(blob){const url='blob:offline-'+(++id); blobs.set(url,blob);return url;},revokeObjectURL(url){blobs.delete(url);}},
    setTimeout(fn){const n=++id;timers.set(n,fn);return n;},clearTimeout(n){timers.delete(n);} };
  vm.createContext(c); vm.runInContext(ioSource,c);
  return { io:c.window.REVERSE_METADATA_IO, c, blobs, timers, workers };
}
let count = 0;
async function test(name, run) { await run(); count++; console.log('PASS '+name); }
(async()=>{
  await test('teaching sample is byte-identical and needs no fetch',async()=>{
    const e=environment(); assert.deepEqual(Buffer.from(await e.io.sampleBlob().arrayBuffer()),fs.readFileSync(path.join(root,'assets/practice/reverse-sample.png')));
  });
  await test('bundled worker reads real PNG/JPEG/WebP EXIF/XMP with fetch and importScripts disabled',async()=>{
    for(const name of ['text-exif-xmp.png','exif-xmp.jpg','exif-xmp.webp','reference-iptc.jpg','history-xmp.jpg','date-aliases.png','app13-xmp.jpg']){
      const e=environment(),blob=new Blob([fs.readFileSync(path.join(__dirname,'fixtures/metadata',name))]);
      const buffer=await e.io.readBlob(blob),job=e.io.start(buffer),info=await job.promise;
      if(name!=='date-aliases.png')assert(info.fields.some(f=>f.kind==='software'),name);
      assert(info.fields.some(f=>f.kind==='time'),name);
      assert.equal(info.warnings.length,0);assert.equal(e.blobs.size,0);assert.equal(e.timers.size,0);assert(e.workers.every(w=>w.terminated));
    }
  });
  await test('blocked Worker construction has a startup error, not a file-read error',async()=>{
    const e=environment('blocked'); await assert.rejects(e.io.start(new ArrayBuffer(8)).promise,x=>x.name==='WorkerError'&&x.message.includes('启动')); assert.equal(e.blobs.size,0);
  });
  await test('asynchronous Worker failure revokes URLs and clears timers',async()=>{
    const e=environment('worker-error');await assert.rejects(e.io.start(new ArrayBuffer(8)).promise,{name:'WorkerError'});assert.equal(e.blobs.size,0);assert.equal(e.timers.size,0);assert(e.workers[0].terminated);
  });
  await test('actual file-read failure is separately identified',async()=>{
    const e=environment('read-error');await assert.rejects(e.io.readBlob(new Blob(['demo'])),{name:'ReadError'});assert.equal(e.workers.length,0);
  });
  await test('timeout terminates the worker and releases its source',async()=>{
    const e=environment('timeout'),job=e.io.start(new ArrayBuffer(8)),pending=assert.rejects(job.promise,{name:'TimeoutError'});assert.equal(e.timers.size,1);for(const fn of e.timers.values())fn();await pending;assert.equal(e.blobs.size,0);assert.equal(e.timers.size,0);assert(e.workers[0].terminated);
  });
  await test('cancelling an old job prevents stale output without leaking resources',async()=>{
    const e=environment(),old=e.io.start(new ArrayBuffer(8)),pending=assert.rejects(old.promise,{name:'AbortError'});old.cancel();await pending;
    const current=e.io.start(await e.io.sampleBlob().arrayBuffer()),info=await current.promise;assert(info.fields.some(f=>f.value==='Cel Atelier Demo Exporter'));assert.equal(e.blobs.size,0);assert.equal(e.timers.size,0);assert(e.workers.every(w=>w.terminated));
  });
  await test('message deserialization failures retain the correct error category',async()=>{
    const e=environment('message-error');await assert.rejects(e.io.start(new ArrayBuffer(8)).promise,{name:'ParseError'});assert.equal(e.blobs.size,0);
  });
  await test('missing local runtime has actionable component error',async()=>{
    const e=environment();e.c.window.REVERSE_METADATA_RUNTIME=null;assert.throws(()=>e.io.sampleBlob(),{name:'RuntimeError'});await assert.rejects(e.io.start(new ArrayBuffer(8)).promise,{name:'RuntimeError'});
  });
  await test('stale page or worker versions produce an explicit refresh error',async()=>{
    const page=environment();page.c.window.REVERSE_METADATA={VERSION:runtime.version-1};
    await assert.rejects(page.io.start(new ArrayBuffer(8)).promise,x=>x.name==='RuntimeError'&&x.message.includes('版本'));assert.equal(page.workers.length,0);
    const worker=environment();worker.c.window.REVERSE_METADATA_RUNTIME={...runtime,version:runtime.version+1};
    await assert.rejects(worker.io.start(await worker.io.sampleBlob().arrayBuffer()).promise,x=>x.name==='RuntimeError'&&x.message.includes('版本'));assert(worker.workers.every(w=>w.terminated));
  });
  console.log(JSON.stringify({checks:count,errors:[]}));
})().catch(error=>{console.error(error);process.exitCode=1;});
