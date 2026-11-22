/* ═══════════════════════════════════════════════════════════════
   ART ENGINE · 手绘 SVG 角色渲染器 v2
   同一套线稿 → 线稿 / 平涂 / 赛璐璐 / 渐变赛璐璐 / 厚涂
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ART = {};
  var N = 0;

  ART.palettes = {
    lavender: {
      name: '月紫',
      skin: '#ffe4d9', skinSh: '#f3b7b2', skinDeep: '#dd9098',
      hair: '#d9c9f6', hairSh: '#a68fd6', hairDeep: '#7b64ae', hairLt: '#f5efff',
      cloth: '#2b3560', clothSh: '#1a2143', clothLt: '#414d80',
      ribbon: '#ff7fae', ribbonSh: '#d24f86',
      eye: '#ff9cc4', eye2: '#7a4ac4', eyeDeep: '#2a1849',
      line: '#402c4c', rim: '#9beeff', paper: '#f7f0e6', ac: '#ff8fc7'
    },
    sunset: {
      name: '夕烧',
      skin: '#ffe2ca', skinSh: '#f0ac92', skinDeep: '#d47f74',
      hair: '#ffbe86', hairSh: '#d97f58', hairDeep: '#a8553c', hairLt: '#ffe8cd',
      cloth: '#40203f', clothSh: '#28122b', clothLt: '#603258',
      ribbon: '#ff5f8f', ribbonSh: '#c93a67',
      eye: '#ffd06e', eye2: '#d0602e', eyeDeep: '#4a1f18',
      line: '#4d2b33', rim: '#ffd9a0', paper: '#fbf1e4', ac: '#ffb27a'
    },
    mint: {
      name: '青瓷',
      skin: '#ffe5da', skinSh: '#eeb7b2', skinDeep: '#d89399',
      hair: '#b2e8dd', hairSh: '#6fbab6', hairDeep: '#4a8e91', hairLt: '#e4fff9',
      cloth: '#1f3a47', clothSh: '#122530', clothLt: '#34596b',
      ribbon: '#7fe9ff', ribbonSh: '#3faac9',
      eye: '#8ff0ff', eye2: '#3d8fc4', eyeDeep: '#173a52',
      line: '#26404d', rim: '#c7fff2', paper: '#f3f7f2', ac: '#7fe9ff'
    },
    night: {
      name: '深宵',
      skin: '#f4dbda', skinSh: '#d6a7ad', skinDeep: '#ba8090',
      hair: '#93a3e4', hairSh: '#57649a', hairDeep: '#3a4372', hairLt: '#dbe0ff',
      cloth: '#141a33', clothSh: '#0c1022', clothLt: '#283255',
      ribbon: '#b9a6ff', ribbonSh: '#7a63c9',
      eye: '#c0a4ff', eye2: '#5d47b0', eyeDeep: '#241a4a',
      line: '#2c2b4d', rim: '#9fd6ff', paper: '#eef1f7', ac: '#b9a6ff'
    },
    sakura: {
      name: '樱染',
      skin: '#ffe7df', skinSh: '#f3bab8', skinDeep: '#df959b',
      hair: '#ffd3e4', hairSh: '#e69ab9', hairDeep: '#b86d8f', hairLt: '#fff1f8',
      cloth: '#3a2340', clothSh: '#241228', clothLt: '#5a355e',
      ribbon: '#ff8fc7', ribbonSh: '#d1568f',
      eye: '#ff9cc4', eye2: '#a33f6b', eyeDeep: '#40172c',
      line: '#452b3c', rim: '#ffd7e9', paper: '#fcf2f4', ac: '#ff8fc7'
    }
  };

  /* ───────────── path 库 ───────────── */
  var P = {
    face: 'M270 150 C218 150 180 190 176 254 C172 306 182 350 208 382 C228 406 252 418 270 418 C288 418 312 406 332 382 C358 350 368 306 364 254 C360 190 322 150 270 150 Z',
    neck: 'M240 394 L240 468 C254 480 286 480 300 468 L300 394 Z',
    body: 'M150 490 C120 516 96 560 86 680 L454 680 C444 560 420 516 390 490 C360 466 316 458 270 458 C224 458 180 466 150 490 Z',
    backHair: 'M270 120 C212 120 168 162 160 226 C152 290 136 348 118 408 C100 466 100 534 128 588 C156 642 214 670 270 670 C326 670 384 642 412 588 C440 534 440 466 422 408 C404 348 388 290 380 226 C372 162 328 120 270 120 Z',

    fringe: 'M270 122 C220 122 180 152 171 204 C166 222 166 238 170 254 L187 264 L203 255 L219 266 L237 257 L253 264 L270 257 L287 264 L303 257 L321 266 L337 255 L353 264 L362 252 C366 236 366 220 361 204 C352 152 320 122 270 122 Z',
    sideL: 'M174 208 C162 268 158 340 160 410 C161 430 162 448 166 462 C178 472 194 470 204 460 C198 396 198 324 204 250 Z',
    sideR: 'M366 208 C378 268 382 340 380 410 C379 430 378 448 374 462 C362 472 346 470 336 460 C342 396 342 324 336 250 Z',
    ahoge: 'M286 126 C278 106 288 84 308 76 C298 94 300 108 312 120 C302 116 292 120 286 126 Z',

    bangsSh: 'M176 258 C192 264 206 268 220 272 C232 266 248 262 262 264 C276 266 292 264 306 260 C320 266 336 266 352 258 L352 270 C334 278 314 276 296 268 C282 262 264 262 250 270 C232 278 206 276 184 268 Z',
    sideSh: 'M340 258 C356 300 358 344 340 374 C328 392 310 410 292 418 C310 396 322 370 328 342 C334 310 332 284 324 262 Z',
    neckSh: 'M240 402 C254 420 286 420 300 402 L300 444 C286 458 254 458 240 444 Z',
    hairShL: 'M160 226 C152 290 136 348 118 408 C100 466 100 534 128 588 C136 560 140 522 150 486 C168 430 178 362 176 294 Z',
    hairShR: 'M380 226 C388 290 404 348 422 408 C440 466 440 534 412 588 C404 560 400 522 390 486 C372 430 362 362 364 294 Z',
    clothShL: 'M150 490 C122 516 100 560 90 680 L156 680 C158 596 170 534 190 500 Z',
    clothShR: 'M390 490 C418 516 440 560 450 680 L384 680 C382 596 370 534 350 500 Z',
    earL: 'M177 292 C165 284 155 298 158 314 C161 331 170 341 180 338 C176 324 176 306 177 292 Z',
    earR: 'M363 292 C375 284 385 298 382 314 C379 331 370 341 360 338 C364 324 364 306 363 292 Z',

    eyeL: 'M186 318 C190 296 208 284 228 286 C246 288 256 301 258 318 C254 332 245 341 232 344 C214 348 196 339 186 318 Z',
    eyeR: 'M354 318 C350 296 332 284 312 286 C294 288 284 301 282 318 C286 332 295 341 308 344 C326 348 344 339 354 318 Z',
    lashL: 'M186 318 C190 294 208 282 230 284 C244 286 254 294 258 306 L258 316 C250 306 238 300 226 302 C208 304 194 310 186 318 Z',
    lashR: 'M354 318 C350 294 332 282 310 284 C296 286 286 294 282 306 L282 316 C290 306 302 300 314 302 C332 304 346 310 354 318 Z',
    browL: 'M196 272 C212 264 234 262 250 269',
    browR: 'M344 272 C328 264 306 262 290 269',
    nose: 'M276 360 C279 366 282 369 286 370',
    mouth: 'M262 386 C268 392 276 392 282 385',
    lip: 'M264 388 C270 394 276 394 281 388 C274 398 267 398 264 388 Z',

    collarL: 'M236 468 C246 455 260 451 270 456 C267 473 263 489 262 506 C249 500 240 490 236 478 Z',
    collarR: 'M304 468 C294 455 280 451 270 456 C273 473 277 489 278 506 C291 500 300 490 304 478 Z',

    ribbonKnot: 'M270 504 C264 504 260 510 260 517 C260 524 264 529 270 529 C276 529 280 524 280 517 C280 510 276 504 270 504 Z',
    ribbonL: 'M264 510 C246 494 222 496 221 512 C220 529 244 534 266 521 Z',
    ribbonR: 'M276 510 C294 494 318 496 319 512 C320 529 296 534 274 521 Z',
    ribbonTailL: 'M262 527 C255 546 250 564 247 584 L264 575 C267 557 271 543 275 531 Z',
    ribbonTailR: 'M278 527 C285 546 290 564 293 584 L276 575 C273 557 269 543 265 531 Z'
  };

  var HAIR_HI = [
    'M194 214 C216 190 242 178 266 176',
    'M282 178 C306 184 326 198 338 214'
  ];

  function cssVars(p) {
    return [
      '--c-skin:' + p.skin, '--c-skin-sh:' + p.skinSh, '--c-skin-deep:' + p.skinDeep,
      '--c-hair:' + p.hair, '--c-hair-sh:' + p.hairSh, '--c-hair-deep:' + p.hairDeep,
      '--c-hair-lt:' + p.hairLt, '--c-cloth:' + p.cloth, '--c-cloth-sh:' + p.clothSh,
      '--c-cloth-lt:' + p.clothLt, '--c-ribbon:' + p.ribbon, '--c-ribbon-sh:' + p.ribbonSh,
      '--c-eye:' + p.eye, '--c-eye2:' + p.eye2, '--c-eye-deep:' + p.eyeDeep,
      '--c-line:' + p.line, '--c-rim:' + p.rim, '--c-paper:' + p.paper, '--c-ac:' + p.ac
    ].join(';');
  }

  ART.portrait = function (opts) {
    opts = opts || {};
    var p = typeof opts.palette === 'string' ? (ART.palettes[opts.palette] || ART.palettes.lavender) : (opts.palette || ART.palettes.lavender);
    var mode = opts.mode || 'cel';
    var id = 'ca' + (++N);
    var layers = opts.layers || {};
    var cls = ['ca-art', 'm-' + mode];
    if (layers.shade === false) cls.push('hide-shade');
    if (layers.hi === false) cls.push('hide-hi');
    if (layers.rim === false) cls.push('hide-rim');
    if (layers.ao === false) cls.push('hide-ao');
    if (opts.light === 'right') cls.push('light-right');
    if (opts.cls) cls.push(opts.cls);

    var style = '<style>' +
      '.ca-art .sk{fill:var(--c-skin)}.ca-art .sks{fill:var(--c-skin-sh)}.ca-art .skd{fill:var(--c-skin-deep)}' +
      '.ca-art .hr{fill:var(--c-hair)}.ca-art .hrs{fill:var(--c-hair-sh)}.ca-art .hrd{fill:var(--c-hair-deep)}' +
      '.ca-art .cl{fill:var(--c-cloth)}.ca-art .cls{fill:var(--c-cloth-sh)}.ca-art .cll{fill:var(--c-cloth-lt)}' +
      '.ca-art .rb{fill:var(--c-ribbon)}.ca-art .rbs{fill:var(--c-ribbon-sh)}' +
      '.ca-art .ln{stroke:var(--c-line);fill:none;stroke-linecap:round;stroke-linejoin:round}' +
      '.ca-art .ca-shade,.ca-art .ca-hi,.ca-art .ca-rim,.ca-art .ca-ao{transition:opacity .35s ease}' +
      '.ca-art .ca-shade{opacity:1}.ca-art .ca-hi{opacity:1}.ca-art .ca-rim{opacity:.95}.ca-art .ca-ao{opacity:1}' +
      '.ca-art.m-flat .ca-shade,.ca-art.m-flat .ca-hi,.ca-art.m-flat .ca-rim,.ca-art.m-flat .ca-ao{opacity:0}' +
      '.ca-art.m-line .ca-fill,.ca-art.m-line .ca-shade,.ca-art.m-line .ca-hi,.ca-art.m-line .ca-rim,.ca-art.m-line .ca-ao,.ca-art.m-line .ca-deco{opacity:0}' +
      '.ca-art.m-line .ca-paper{opacity:1}.ca-art.m-line .ca-line-art{opacity:1}' +
      '.ca-art .ca-paper{opacity:0;transition:opacity .3s}.ca-art .ca-line-art{opacity:0;transition:opacity .3s}' +
      '.ca-art.m-grad .ca-shade{opacity:.92;filter:url(#' + id + '-soft)}' +
      '.ca-art.m-grad .ca-line-art{opacity:.28}' +
      '.ca-art.m-paint .ca-shade{opacity:.94;filter:url(#' + id + '-blur)}' +
      '.ca-art.m-paint .ca-line-art{opacity:.14}' +
      '.ca-art.m-paint .ca-fill{filter:url(#' + id + '-paint)}' +
      '.ca-art.hide-shade .ca-shade,.ca-art.hide-hi .ca-hi,.ca-art.hide-rim .ca-rim,.ca-art.hide-ao .ca-ao{opacity:0}' +
      '.ca-art .ca-light{transition:transform .45s cubic-bezier(.2,.8,.2,1);transform-origin:270px 340px}' +
      '.ca-art.light-right .ca-light{transform:scaleX(-1)}' +
      '</style>';

    var defs = '<defs>' +
      '<linearGradient id="' + id + '-hair" x1="0" y1="100" x2="0" y2="680" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="var(--c-hair-lt)"/><stop offset=".34" stop-color="var(--c-hair)"/><stop offset="1" stop-color="var(--c-hair-sh)"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-skin" x1="0" y1="140" x2="0" y2="500" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="var(--c-skin)"/><stop offset=".72" stop-color="var(--c-skin)"/><stop offset="1" stop-color="var(--c-skin-sh)"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-iris" x1="0" y1="292" x2="0" y2="346" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="var(--c-eye2)"/><stop offset=".48" stop-color="var(--c-eye2)"/><stop offset=".78" stop-color="var(--c-eye)"/><stop offset="1" stop-color="var(--c-eye)"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-cloth" x1="0" y1="450" x2="0" y2="680" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="var(--c-cloth-lt)"/><stop offset=".3" stop-color="var(--c-cloth)"/><stop offset="1" stop-color="var(--c-cloth-sh)"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + '-ribbon" x1="220" y1="495" x2="320" y2="590" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="var(--c-ribbon)"/><stop offset="1" stop-color="var(--c-ribbon-sh)"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + id + '-halo" cx=".5" cy=".5" r=".5">' +
      '<stop offset="0" stop-color="var(--c-ac)" stop-opacity=".32"/><stop offset=".55" stop-color="var(--c-ac)" stop-opacity=".1"/><stop offset="1" stop-color="var(--c-ac)" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<radialGradient id="' + id + '-blush" cx=".5" cy=".5" r=".5">' +
      '<stop offset="0" stop-color="#ff7fa8" stop-opacity=".5"/><stop offset="1" stop-color="#ff7fa8" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="' + id + '-rim" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="var(--c-rim)" stop-opacity="0"/><stop offset=".55" stop-color="var(--c-rim)" stop-opacity=".9"/><stop offset="1" stop-color="var(--c-rim)" stop-opacity="0"/>' +
      '</linearGradient>' +
      '<filter id="' + id + '-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="' + id + '-blur" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="6.5"/></filter>' +
      '<filter id="' + id + '-paint" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>' +
      '<filter id="' + id + '-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>';

    var deco = opts.deco === false ? '' :
      '<g class="ca-deco">' +
      '<circle cx="292" cy="256" r="212" fill="url(#' + id + '-halo)"/>' +
      '<circle cx="292" cy="256" r="190" fill="none" stroke="var(--c-ac)" stroke-opacity=".16" stroke-width="1" stroke-dasharray="2 8"/>' +
      '<g fill="var(--c-ac)">' +
      '<path d="M92 190 l2.6 6.8 6.8 2.6 -6.8 2.6 -2.6 6.8 -2.6 -6.8 -6.8 -2.6 6.8 -2.6z" opacity=".6"/>' +
      '<path d="M430 132 l1.8 4.8 4.8 1.8 -4.8 1.8 -1.8 4.8 -1.8 -4.8 -4.8 -1.8 4.8 -1.8z" opacity=".45"/>' +
      '<circle cx="446" cy="348" r="2" opacity=".45"/><circle cx="88" cy="380" r="1.6" opacity=".35"/>' +
      '<circle cx="410" cy="500" r="1.5" opacity=".3"/><circle cx="120" cy="288" r="2.2" opacity=".4"/>' +
      '</g>' +
      '<path d="M66 320 c10 -15 25 -17 34 -8 c-13 3 -21 10 -26 20 c-3 -5 -5 -8 -8 -12z" fill="var(--c-ac)" opacity=".28"/>' +
      '<path d="M466 250 c-10 -13 -23 -15 -30 -7 c11 2 18 9 22 17 c3 -4 5 -7 8 -10z" fill="var(--c-rim)" opacity=".24"/>' +
      '</g>';

    /* 后发 */
    var backHair = '<g class="ca-fill ca-hair">' +
      '<path d="' + P.backHair + '" fill="url(#' + id + '-hair)"/>' +
      '<path d="M270 136 C216 136 176 176 166 232 C160 268 166 304 178 336 C166 300 164 262 170 230 C180 176 218 144 270 144 Z" fill="var(--c-hair-lt)" opacity=".15"/>' +
      '<path d="' + P.hairShL + '" fill="var(--c-hair-sh)" opacity=".55"/>' +
      '<path d="' + P.hairShR + '" fill="var(--c-hair-sh)" opacity=".55"/>' +
      '<g class="ln" style="stroke:var(--c-hair-deep)" stroke-width="1.4" opacity=".26">' +
      '<path d="M204 320 C190 402 178 492 168 586"/><path d="M232 350 C224 436 218 520 214 610"/>' +
      '<path d="M336 320 C350 402 362 492 372 586"/><path d="M308 350 C316 436 322 520 326 610"/>' +
      '</g>' +
      '<path d="M128 588 C156 640 212 668 270 668 C328 668 384 640 412 588 C400 620 372 646 336 660 C312 670 292 674 270 674 C248 674 228 670 204 660 C168 646 140 620 128 588 Z" fill="var(--c-hair-deep)" opacity=".3"/>' +
      '</g>';

    /* 身体 */
    var body = '<g class="ca-fill ca-body">' +
      '<path d="' + P.body + '" fill="url(#' + id + '-cloth)"/>' +
      '<path d="' + P.clothShL + '" fill="var(--c-cloth-sh)" opacity=".85"/>' +
      '<path d="' + P.clothShR + '" fill="var(--c-cloth-sh)" opacity=".55"/>' +
      '<path d="M270 500 C262 560 260 620 262 680 L280 680 C282 620 280 560 270 500 Z" fill="var(--c-cloth-lt)" opacity=".3"/>' +
      '<g class="ln" style="stroke:var(--c-cloth-lt)" stroke-width="1.3" opacity=".5">' +
      '<path d="M190 520 C180 568 174 624 172 680"/>' +
      '<path d="M350 520 C360 568 366 624 368 680"/>' +
      '<path d="M234 566 C230 608 230 646 232 680" opacity=".5"/>' +
      '<path d="M306 566 C310 608 310 646 308 680" opacity=".5"/>' +
      '</g>' +
      '<path d="M226 462 C242 451 298 451 314 462 L324 606 C300 622 240 622 216 606 Z" fill="var(--c-paper)"/>' +
      '<path d="M226 462 C236 478 243 500 245 526 L245 610 L216 606 Z" fill="var(--c-skin-sh)" opacity=".2"/>' +
      '<path d="M314 462 C304 478 297 500 295 526 L295 610 L324 606 Z" fill="var(--c-skin-sh)" opacity=".13"/>' +
      '<path d="M270 462 L270 620" stroke="var(--c-skin-sh)" stroke-width="1" opacity=".25"/>' +
      '<path d="M234 470 C248 462 292 462 306 470" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>' +
      '<path d="M226 452 C234 444 240 441 246 441 L243 612 L216 606 Z" fill="url(#' + id + '-cloth)"/>' +
      '<path d="M314 452 C306 444 300 441 294 441 L297 612 L324 606 Z" fill="url(#' + id + '-cloth)"/>' +
      '<path d="M246 441 L243 612" stroke="#f7f2ff" stroke-width="1.4" opacity=".4"/>' +
      '<path d="M294 441 L297 612" stroke="#f7f2ff" stroke-width="1.4" opacity=".4"/>' +
      '</g>';

    var neck = '<g class="ca-fill ca-neck"><path d="' + P.neck + '" fill="url(#' + id + '-skin)"/></g>';

    var face = '<g class="ca-fill ca-face">' +
      '<path d="' + P.face + '" fill="url(#' + id + '-skin)"/>' +
      '<path d="' + P.earL + '" class="sk"/><path d="' + P.earR + '" class="sk"/>' +
      '<path d="M174 288 C168 294 168 306 173 314" class="ln" stroke-width="1.3" opacity=".45"/>' +
      '<path d="M366 288 C372 294 372 306 367 314" class="ln" stroke-width="1.3" opacity=".45"/>' +
      '</g>';

    /* 眼睛 */
    var iris = function (cx) {
      return '<g>' +
        '<ellipse cx="' + cx + '" cy="318" rx="21.5" ry="25.5" fill="url(#' + id + '-iris)"/>' +
        '<ellipse cx="' + cx + '" cy="318" rx="21.5" ry="25.5" fill="none" stroke="var(--c-eye-deep)" stroke-width="1.2" opacity=".45"/>' +
        '<ellipse cx="' + cx + '" cy="303" rx="18" ry="9" fill="var(--c-eye-deep)" opacity=".35"/>' +
        '<ellipse cx="' + cx + '" cy="332" rx="14" ry="8" fill="var(--c-eye)" opacity=".55"/>' +
        '<ellipse cx="' + cx + '" cy="320" rx="7.5" ry="9.5" fill="var(--c-eye-deep)"/>' +
        '<ellipse cx="' + cx + '" cy="321" rx="3.8" ry="5" fill="#140b22" opacity=".9"/>' +
        '<circle cx="' + (cx - 7) + '" cy="307" r="6.2" fill="#fff" opacity=".96"/>' +
        '<circle cx="' + (cx + 8) + '" cy="332" r="3" fill="#fff" opacity=".8"/>' +
        '<circle cx="' + (cx + 5) + '" cy="300" r="1.8" fill="#fff" opacity=".65"/>' +
        '<path d="M' + (cx - 15) + ' 338 C' + (cx - 6) + ' 343 ' + (cx + 6) + ' 343 ' + (cx + 14) + ' 336" fill="none" stroke="#fff" stroke-width="1.6" opacity=".5"/>' +
        '</g>';
    };

    var eyes = '<g class="ca-fill ca-eyes">' +
      '<path d="' + P.eyeL + '" fill="#fff8fc"/>' +
      '<path d="' + P.eyeR + '" fill="#fff8fc"/>' +
      iris(226) + iris(314) +
      '<path d="M190 307 C202 293 224 289 246 297 C248 301 250 306 251 312 L251 318 C242 309 226 305 208 309 C200 311 194 315 190 318 Z" fill="#6e4a78" opacity=".16"/>' +
      '<path d="M350 307 C338 293 316 289 294 297 C292 301 290 306 289 312 L289 318 C298 309 314 305 332 309 C340 311 346 315 350 318 Z" fill="#6e4a78" opacity=".16"/>' +
      '<path d="' + P.lashL + '" fill="var(--c-line)"/>' +
      '<path d="' + P.lashR + '" fill="var(--c-line)"/>' +
      '<g class="ln" stroke-width="4">' +
      '<path d="M186 316 C179 310 175 302 174 292"/>' +
      '<path d="M192 300 C186 293 183 286 182 279"/>' +
      '<path d="M354 316 C361 310 365 302 366 292"/>' +
      '<path d="M348 300 C354 293 357 286 358 279"/>' +
      '</g>' +
      '<g class="ln" stroke-width="1.8" opacity=".42">' +
      '<path d="M190 332 C200 341 214 345 228 342"/>' +
      '<path d="M350 332 C340 341 326 345 312 342"/>' +
      '</g>' +
      '<g class="ln" stroke-width="1.4" opacity=".2">' +
      '<path d="M196 300 C210 289 230 286 246 293"/>' +
      '<path d="M344 300 C330 289 310 286 294 293"/>' +
      '</g>' +
      '</g>';

    var features = '<g class="ca-fill ca-features">' +
      '<path d="' + P.nose + '" class="ln" stroke-width="2" opacity=".55"/>' +
      '<path d="M283 366 C286 370 286 373 282 375" class="ln" stroke-width="1.2" opacity=".22"/>' +
      '<path d="' + P.mouth + '" class="ln" stroke-width="2.6"/>' +
      '<path d="' + P.lip + '" fill="#e57f97" opacity=".55"/>' +
      '<path d="M267 391 C272 394 277 394 281 391" class="ln" stroke-width="1" opacity=".3"/>' +
      '<ellipse cx="204" cy="356" rx="20" ry="9" fill="url(#' + id + '-blush)"/>' +
      '<ellipse cx="336" cy="356" rx="20" ry="9" fill="url(#' + id + '-blush)"/>' +
      '<g stroke="#ff8fa8" stroke-width="1.3" stroke-linecap="round" opacity=".5">' +
      '<path d="M196 352 l6 -2.5"/><path d="M198 358 l6 -2"/><path d="M202 364 l5 -1.5"/>' +
      '<path d="M344 352 l-6 -2.5"/><path d="M342 358 l-6 -2"/><path d="M338 364 l-5 -1.5"/>' +
      '</g></g>';

    /* 前发 */
    var frontHair = '<g class="ca-fill ca-fronthair">' +
      '<path d="' + P.fringe + '" fill="url(#' + id + '-hair)"/>' +
      '<path d="M292 140 C272 152 258 172 250 196 C262 180 278 168 296 160 Z" fill="var(--c-hair-lt)" opacity=".16"/>' +
      '<path d="' + P.sideL + '" fill="url(#' + id + '-hair)"/>' +
      '<path d="' + P.sideR + '" fill="url(#' + id + '-hair)"/>' +
      '<path d="M170 196 C158 222 156 252 160 282 C168 258 174 234 184 214 Z" fill="url(#' + id + '-hair)"/>' +
      '<path d="M370 196 C382 222 384 252 380 282 C372 258 366 234 356 214 Z" fill="url(#' + id + '-hair)"/>' +
      '<path d="M186 220 C180 250 178 280 181 308 C191 288 198 264 202 238 Z" fill="var(--c-hair-sh)" opacity=".85"/>' +
      '<path d="M354 220 C360 250 362 280 359 308 C349 288 342 264 338 238 Z" fill="var(--c-hair-sh)" opacity=".85"/>' +
      '<path d="' + P.ahoge + '" fill="url(#' + id + '-hair)"/>' +
      '<g class="ln" style="stroke:var(--c-hair-deep)" stroke-width="1.3" opacity=".28">' +
      '<path d="M236 140 C228 180 222 220 222 258"/>' +
      '<path d="M270 132 C264 176 262 216 264 256"/>' +
      '<path d="M304 140 C310 180 314 220 314 258"/>' +
      '<path d="M202 164 C192 196 186 228 186 258"/>' +
      '<path d="M338 166 C348 198 352 228 350 258"/>' +
      '<path d="M190 270 C186 330 186 392 190 444" opacity=".5"/>' +
      '<path d="M350 270 C354 330 354 392 350 444" opacity=".5"/>' +
      '</g>' +
      '</g>';

    /* 领与蝴蝶结 */
    var collar = '<g class="ca-fill ca-collar">' +
      '<path d="' + P.collarL + '" fill="#f7f2ff"/>' +
      '<path d="' + P.collarR + '" fill="#f7f2ff"/>' +
      '<path d="' + P.collarL + '" fill="none" stroke="var(--c-line)" stroke-width="2" opacity=".55"/>' +
      '<path d="' + P.collarR + '" fill="none" stroke="var(--c-line)" stroke-width="2" opacity=".55"/>' +
      '<path d="M252 474 C258 480 262 488 263 496" fill="none" stroke="var(--c-skin-sh)" stroke-width="1.2" opacity=".45"/>' +
      '<path d="M288 474 C282 480 278 488 277 496" fill="none" stroke="var(--c-skin-sh)" stroke-width="1.2" opacity=".45"/>' +
      '</g>';

    var ribbon = '<g class="ca-fill ca-ribbon">' +
      '<path d="' + P.ribbonTailL + '" fill="var(--c-ribbon-sh)"/>' +
      '<path d="' + P.ribbonTailR + '" fill="var(--c-ribbon-sh)"/>' +
      '<path d="' + P.ribbonL + '" fill="url(#' + id + '-ribbon)"/>' +
      '<path d="' + P.ribbonR + '" fill="url(#' + id + '-ribbon)"/>' +
      '<path d="' + P.ribbonKnot + '" fill="var(--c-ribbon-sh)"/>' +
      '<path d="M264 512 C250 502 232 504 227 515" class="ln" stroke-width="1.5" opacity=".4"/>' +
      '<path d="M276 512 C290 502 308 504 313 515" class="ln" stroke-width="1.5" opacity=".4"/>' +
      '<circle cx="270" cy="517" r="3" fill="#ffd79a" opacity=".9"/>' +
      '<circle cx="269" cy="516" r="1.2" fill="#fff" opacity=".8"/>' +
      '</g>';

    /* 肩前发丝 */
    var frontStrands = '<g class="ca-fill ca-strands">' +
      '<path d="M199 470 C194 510 192 550 196 588 C202 570 207 540 211 506 Z" fill="var(--c-hair-sh)"/>' +
      '<path d="M341 470 C346 510 348 550 344 588 C338 570 333 540 329 506 Z" fill="var(--c-hair-sh)"/>' +
      '<path d="M205 478 C201 514 200 546 203 576 C206 554 208 518 209 488 Z" fill="var(--c-hair-deep)" opacity=".35"/>' +
      '<path d="M335 478 C339 514 340 546 337 576 C334 554 332 518 331 488 Z" fill="var(--c-hair-deep)" opacity=".35"/>' +
      '<path d="M197 474 C195 512 195 548 199 578" fill="none" stroke="var(--c-hair-lt)" stroke-width="1.2" opacity=".35"/>' +
      '<path d="M343 474 C345 512 345 548 341 578" fill="none" stroke="var(--c-hair-lt)" stroke-width="1.2" opacity=".35"/>' +
      '</g>';

    /* 眉毛（阴影之后绘制，避免被发影盖住） */
    var brows = '<g class="ca-fill ca-brows">' +
      '<path d="' + P.browL + '" fill="none" style="stroke:var(--c-hair-deep)" stroke-width="4.8" stroke-linecap="round"/>' +
      '<path d="' + P.browR + '" fill="none" style="stroke:var(--c-hair-deep)" stroke-width="4.8" stroke-linecap="round"/>' +
      '</g>';

    /* 阴影组 */
    var shade = '<g class="ca-light">' +
      '<g class="ca-shade">' +
      '<path d="' + P.bangsSh + '" class="sks" opacity=".9"/>' +
      '<path d="' + P.sideSh + '" class="sks" opacity=".9"/>' +
      '<path d="' + P.neckSh + '" class="sks" opacity=".72"/>' +
      '<path d="' + P.sideL + '" fill="var(--c-hair-sh)" opacity=".4" transform="translate(8 0)"/>' +
      '<path d="' + P.sideR + '" fill="var(--c-hair-sh)" opacity=".4" transform="translate(-8 0)"/>' +
      '<path d="M312 146 C338 168 352 200 354 236 C346 206 334 182 318 166 Z" fill="var(--c-hair-sh)" opacity=".5"/>' +
      '<path d="M180 500 C198 522 206 552 206 582 C196 558 186 530 172 512 Z" fill="var(--c-skin-sh)" opacity=".3"/>' +
      '<path d="M240 468 C252 482 288 482 300 468 C296 486 286 496 270 496 C254 496 244 486 240 468 Z" fill="var(--c-cloth-sh)" opacity=".75"/>' +
      '<path d="M186 506 C206 490 232 482 256 480 C236 488 216 500 202 518 Z" fill="var(--c-cloth-sh)" opacity=".7"/>' +
      '<path d="M354 506 C334 490 308 482 284 480 C304 488 324 500 338 518 Z" fill="var(--c-cloth-sh)" opacity=".7"/>' +
      '</g>' +
      '<g class="ca-ao">' +
      '<path d="M240 410 C254 428 286 428 300 410 C298 428 288 438 270 438 C252 438 242 428 240 410 Z" class="skd" opacity=".5"/>' +
      '<path d="M260 531 C266 537 274 537 280 531 C277 545 272 550 270 550 C268 550 263 545 260 531 Z" fill="#0b0d18" opacity=".2"/>' +
      '<path d="M242 424 C250 434 260 438 268 439" fill="none" stroke="var(--c-skin-deep)" stroke-width="2" opacity=".28"/>' +
      '<path d="M298 424 C290 434 280 438 272 439" fill="none" stroke="var(--c-skin-deep)" stroke-width="2" opacity=".28"/>' +
      '</g>' +
      '<g class="ca-hi">' +
      '<g class="ln" style="stroke:var(--c-hair-lt)" stroke-width="9" opacity=".55" stroke-linecap="round">' +
      HAIR_HI.map(function (d) { return '<path d="' + d + '"/>'; }).join('') +
      '</g>' +
      '<g class="ln" stroke-width="2.6" opacity=".4" stroke-linecap="round" style="stroke:#fff">' +
      HAIR_HI.map(function (d) { return '<path d="' + d + '" transform="translate(0 3)"/>'; }).join('') +
      '</g>' +
      '<ellipse cx="272" cy="364" rx="3.6" ry="1.4" fill="#fff" opacity=".5"/>' +
      '<path d="M198 350 C202 346 208 345 213 347" class="ln" style="stroke:#fff" stroke-width="1.5" opacity=".4"/>' +
      '<path d="M248 486 C254 490 260 492 266 493" class="ln" style="stroke:var(--c-cloth-lt)" stroke-width="2.4" opacity=".5"/>' +
      '<path d="M292 486 C286 490 280 492 274 493" class="ln" style="stroke:var(--c-cloth-lt)" stroke-width="2.4" opacity=".5"/>' +
      '</g>' +
      '<g class="ca-rim">' +
      '<path d="M364 256 C374 304 366 350 340 380 C328 394 316 402 304 408" fill="none" stroke="url(#' + id + '-rim)" stroke-width="3.6" stroke-linecap="round" filter="url(#' + id + '-glow)"/>' +
      '<path d="M386 300 C392 372 408 444 420 512" fill="none" stroke="url(#' + id + '-rim)" stroke-width="3.2" stroke-linecap="round" opacity=".65" filter="url(#' + id + '-glow)"/>' +
      '<path d="M398 508 C414 556 422 616 424 668" fill="none" stroke="url(#' + id + '-rim)" stroke-width="2.8" stroke-linecap="round" opacity=".5"/>' +
      '</g>' +
      '</g>';

    /* 发饰 */
    var ornament = '<g class="ca-fill ca-orn">' +
      '<path d="M194 208 l3.2 8.6 8.6 3.2 -8.6 3.2 -3.2 8.6 -3.2 -8.6 -8.6 -3.2 8.6 -3.2z" fill="var(--c-ac)" opacity=".95"/>' +
      '<circle cx="194" cy="219" r="2.2" fill="#fff" opacity=".8"/>' +
      '<path d="M375 322 C367 328 367 342 376 348 C369 341 369 329 375 322 Z" fill="#ffd79a"/>' +
      '<circle cx="376" cy="350" r="2.2" fill="#ffd79a" opacity=".85"/>' +
      '</g>';

    /* 线稿覆盖 */
    var lineArt = '<g class="ca-line-art" fill="none" stroke="var(--c-line)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9">' +
      '<path d="' + P.face + '"/>' +
      '<path d="' + P.earL + '"/><path d="' + P.earR + '"/>' +
      '<path d="' + P.fringe + '"/>' +
      '<path d="' + P.sideL + '"/><path d="' + P.sideR + '"/>' +
      '<path d="' + P.ahoge + '"/>' +
      '<path d="' + P.lashL + '" stroke-width="1.6"/><path d="' + P.lashR + '" stroke-width="1.6"/>' +
      '<path d="' + P.browL + '" stroke-width="2.8"/><path d="' + P.browR + '" stroke-width="2.8"/>' +
      '<path d="' + P.nose + '" stroke-width="2"/><path d="' + P.mouth + '" stroke-width="2.4"/>' +
      '<path d="' + P.neck + '" opacity=".85"/>' +
      '<path d="' + P.body + '"/>' +
      '<path d="' + P.collarL + '"/><path d="' + P.collarR + '"/>' +
      '<path d="' + P.ribbonL + '"/><path d="' + P.ribbonR + '"/><path d="' + P.ribbonKnot + '"/>' +
      '<path d="' + P.ribbonTailL + '"/><path d="' + P.ribbonTailR + '"/>' +
      '</g>';

    var paper = '<rect class="ca-paper" x="0" y="0" width="520" height="680" fill="var(--c-paper)"/>';

    return '<svg viewBox="0 0 520 680" xmlns="http://www.w3.org/2000/svg" class="' + cls.join(' ') + '" style="' + cssVars(p) + '" role="img" aria-label="二次元角色示范插画">' +
      style + defs + paper + deco +
      backHair + body + neck + face + eyes + features + frontHair + collar + ribbon + shade + brows + ornament + lineArt +
      '</svg>';
  };

  ART.modeLabels = { line: '线稿', flat: '平涂', cel: '赛璐璐', grad: '渐变赛璐璐', paint: '厚涂' };
  window.ART = ART;
})();
