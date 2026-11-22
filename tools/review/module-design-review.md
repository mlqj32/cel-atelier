# 模块首页排版与光晕检查

日期：2026-11-15。项目：D:/代码项目/cel-atelier。

## 修订

- 原标题区伪元素超出边界并使用模糊滤镜，被 overflow:hidden 裁切为直边。改用 inset:0 的 closest-side 椭圆渐变，透明度在边缘归零，取消滤镜和标题区裁切。此规则同时覆盖路线页、图鉴的共用标题区。
- 模块页增加独立 body 类，路由切换时清除；模块页背景改为稳定深色，关闭粒子、网格和鼠标光圈干扰。
- 模块标题桌面最大 40px、手机 30px；描述、学习说明、学习成果 16px；章节标题 17px；标签与阅读时间 13px。模块侧栏章节 14px。
- 学习说明与学习成果合为一张分栏面板，窄屏上下排布；统计独立对齐，手机使用两列；保留手机章节阅读时间。
- main.css 与 app.js 引用版本更新为 v27。

## 验收

- 13 个模块 × 8 个视口宽度（1740、1440、1201、1024、900、768、390、320）：104 项 DOM 布局检查，没有发现内容越界、受检测的文字裁切或页面横向溢出。
- 104 项同时检查模块路由类、16px 描述字号、装饰层隐藏、标题区无裁切及光晕无滤镜。
- 首页、路线、图鉴、CSP 第一章 × 桌面/手机：8 项回归检查通过，模块页 body 类均正确清除。
- 人工查看 CSP 桌面、390px 手机、320px 练习模块及手机目录抽屉截图；浏览器警告与错误记录为空。
- node --check assets/js/app.js 通过。node tools/audit-content.cjs 通过，13 模块、140 章、28 项事实回归检查无错误。

布局记录：module-design-audit.json、module-design-regression.json。
预览：module-design-desktop.jpg、module-design-mobile.jpg。

本轮备份：D:/DevTools/temp/cel-atelier-module-design-before-20261115。

自动检查覆盖 DOM 边界与所列样式，视觉结论以抽查截图为依据。
