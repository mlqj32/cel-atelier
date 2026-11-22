/* FileReader + a self-contained Blob Worker work without file:// fetches. */
(function () {
  'use strict';
  function error(name, message) { var e = new Error(message); e.name = name; return e; }
  function sampleBlob() {
    var runtime = window.REVERSE_METADATA_RUNTIME;
    if (!runtime || !runtime.sampleBase64) throw error('RuntimeError', '教学样本组件未加载，请刷新页面后重试。');
    var binary = atob(runtime.sampleBase64), bytes = new Uint8Array(binary.length);
    for (var i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'image/png' });
  }
  function readBlob(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(error('ReadError', '浏览器未能读取所选文件。请确认文件仍存在、未被占用，再重新选择。')); };
      reader.onabort = function () { reject(error('ReadError', '文件读取已取消，请重新选择图片。')); };
      try { reader.readAsArrayBuffer(file); }
      catch (e) { reject(error('ReadError', '浏览器无法访问所选文件，请重新选择可读取的本地图片。')); }
    });
  }
  function start(buffer) {
    var worker = null, url = null, timer = null, finish, settled = false;
    function cleanup() {
      clearTimeout(timer);
      if (worker) worker.terminate(); worker = null;
      if (url) URL.revokeObjectURL(url); url = null;
    }
    var promise = new Promise(function (resolve, reject) {
      finish = function (e, info) { if (settled) return; settled = true; cleanup(); if (e) reject(e); else resolve(info); };
      var runtime = window.REVERSE_METADATA_RUNTIME;
      if (!runtime || !runtime.workerSource) { finish(error('RuntimeError', '解析组件未加载，请刷新页面后重试。')); return; }
      if (window.REVERSE_METADATA && runtime.version !== window.REVERSE_METADATA.VERSION) { finish(error('RuntimeError', '页面与解析组件版本不一致。请按 Ctrl+F5 强制刷新，或关闭旧页面后重新打开。')); return; }
      try {
        url = URL.createObjectURL(new Blob([runtime.workerSource], { type: 'text/javascript' }));
        worker = new Worker(url);
        worker.onmessage = function (event) {
          var data = event.data;
          if (data && data.error) finish(error('ParseError', data.error));
          else if (data && data.info && Array.isArray(data.info.fields) && Array.isArray(data.info.warnings)) {
            if(!data.info.diagnostics || data.info.diagnostics.parserVersion!==runtime.version) finish(error('RuntimeError','解析器版本不一致，请按 Ctrl+F5 强制刷新后重试。'));
            else finish(null, data.info);
          }
          else finish(error('ParseError', '解析结果不完整，请换一张图片或使用 ExifTool 复核。'));
        };
        worker.onerror = function (event) { if (event.preventDefault) event.preventDefault(); finish(error('WorkerError', '浏览器未能启动本地解析。请刷新页面；若仍失败，可使用 Chrome/Edge 或通过 start-server.bat 打开本站。')); };
        worker.onmessageerror = function () { finish(error('ParseError', '解析结果传递失败，请重新选择图片。')); };
        timer = setTimeout(function () { finish(error('TimeoutError', '解析超过12秒，已停止。请换小样本或使用 ExifTool 复核。')); }, 12000);
        worker.postMessage(buffer, [buffer]);
      } catch (e) { finish(error('WorkerError', '浏览器阻止了本地解析启动。请使用 Chrome/Edge 重试，或通过 start-server.bat 打开本站。')); }
    });
    return { promise: promise, cancel: function () { finish(error('AbortError', '已取消上一次解析。')); } };
  }
  window.REVERSE_METADATA_IO = { sampleBlob: sampleBlob, readBlob: readBlob, start: start };
})();
