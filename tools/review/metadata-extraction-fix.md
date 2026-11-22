# 元数据漏解析修复 v36

日期：2026-11-15

## 已确认的问题

旧版扫描 JPEG 时只读取 APP1 EXIF/XMP，未处理 Photoshop APP13 的 IPTC/XMP 与 COM 注释；XMP History 的 softwareAgent、when 也被字段筛选丢弃。PNG date:create/date:modify 能读出文本，却归在其他字段中，导致软件/日期摘要都显示0。

独立复现：用 npm 官方包 exiftool-vendored.exe 13.63.0 中的 ExifTool 在原创测试 JPEG 上写入 IPTC 程序名、程序版本、创建日期、创建时间和 JPEG 注释。ExifTool 可读到5项；旧版返回 fields=[]、warnings=[]。修复后5项均被读取，保留IPTC原始日期/时间字符串，并说明格式。

这些是测试声明，不声称为 Photoshop 等绘画软件的真实导出；没有取得用户正在检查的原始立绘文件，不能认定其全部空结果均由同一缺陷引起。

## 修复范围

- 有边界检查的 Photoshop APP13 资源遍历，读取 IPTC IIM、XMP 与 JPEG COM。
- XMP History 软件、事件时间、动作；PNG 常见日期关键词的正确分类。
- 新增提取诊断：字段读取成功、支持范围内未发现块、块存在但无展示字段、解析失败/超限/未支持内容分别显示。列出容器类型、信息块来源和解析状态。
- 摘要显示总字段数，避免“没有软件日期”等同于“没有读到任何信息”。版本号单独归为其他字段，不把数字当软件身份。
- 页面、运行包和 Worker 版本核对；旧缓存混用时明确要求刷新，不静默给出空结果。
- 已有缺失项候选推测保留；诊断与实际字段位于推测之前，报告包含同样的诊断和依据。

## 验证

- 27项解析/推测回归、10项离线运行及版本回归通过；14模块154章和42项事实回归审计通过；脚本语法和运行包一致性检查通过。
- 与独立 ExifTool 对照4个测试文件、14个关键字段：程序/版本/日期/注释、XMP历史、PNG日期别名及EXIF/XMP软件字段一致。比较时仅为对照统一显示格式；工具结果保留原始字符串。记录：metadata-reference-comparison.json。
- 浏览器实际选取7个文件：IPTC JPEG提取5项，XMP History JPEG提取3项，日期别名PNG提取2项，EXIF/XMP/文本PNG提取14项，纯净PNG显示未检测到支持信息块，只有描述的PNG成功显示1项，损坏PNG明确提示不完整。
- 320/390/768/1280/1920px下诊断列表和提取字段无横向溢出。记录：metadata-extraction-browser-audit.json。
- 截图：metadata-extraction-fixed.jpg、metadata-extraction-mobile.jpg。

仍不支持所有私有变体、扩展XMP等；不从元数据推定真实绘制起止或工时。对用户具体原图需收到文件本身后再作独立交叉检查，不能用工具结果截图代替其内部字节。
