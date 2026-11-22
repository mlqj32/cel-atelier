exifr 7.1.3 (MIT), vendored from the official npm package via unpkg:

- https://www.npmjs.com/package/exifr/v/7.1.3
- https://unpkg.com/exifr@7.1.3/dist/full.umd.js
- https://unpkg.com/exifr@7.1.3/LICENSE
- Upstream: https://github.com/MikeKovarik/exifr

tools/build-metadata-runtime.cjs combines this local copy, the parser and worker handler into a self-contained string for a Blob Worker. It also embeds the original PNG sample. This avoids fetch/importScripts against file:// resources when opening the HTML directly; analysis uses no runtime CDN and sends no image bytes to a server. The generated file is committed, so readers need no build step. The content audit checks bundle freshness. EXIF dates are not revived into JavaScript Date values. EXIF and each XMP packet are parsed separately to retain source distinctions; repeated properties within a single packet and extended XMP are outside this tool's completeness guarantees. See reverse-metadata-core.js for explicit limits.

The core also traverses bounded Photoshop APP13 resources and selected IPTC IIM records, reads JPEG COM comments, recognizes XMP History events and PNG date aliases, and exposes a diagnostic inventory. IPTC date/time bytes are retained as strings rather than silently normalized. Runtime and parser versions are checked to reject stale-cache combinations. ExifTool is used only for independent development verification; it is not shipped to or executed by the web app.
