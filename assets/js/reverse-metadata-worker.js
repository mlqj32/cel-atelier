/* Bundled after exifr and the core by tools/build-metadata-runtime.cjs.
 * No imports or file fetches are required inside this worker. */
self.onmessage = async function (event) {
  try { self.postMessage({ info: await self.REVERSE_METADATA.analyze(new Uint8Array(event.data), self.exifr) }); }
  catch (error) { self.postMessage({ error: error.message || '无法读取该文件。' }); }
};
