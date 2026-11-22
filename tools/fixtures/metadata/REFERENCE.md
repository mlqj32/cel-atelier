# 元数据回归样本来源

这些图片以本站已有原创测试图为像素底图；附加元数据均为人为构造的测试声明，不是对应绘画软件的真实导出证明。

- reference-iptc.jpg：用官方 npm 包 exiftool-vendored.exe 13.63.0 所带 ExifTool 写入 IPTC OriginatingProgram=Reference Test Tool、ProgramVersion=26.0、DateCreated=2025:03:04、TimeCreated=12:34:56+08:00，以及明确标记测试用途的 JPEG 注释。该文件保留为独立写入器生成的二进制回归样本。
- history-xmp.jpg：test-reverse-metadata.cjs 构造标准 APP1 XMP History，测试 softwareAgent / when / action；用 ExifTool 交叉读取。
- date-aliases.png：测试 PNG date:create、date:modify 文本关键词的分类。
- app13-xmp.jpg：测试 Photoshop 资源块中的 XMP，以及 Pascal 名称的对齐。

运行 node tools/test-reverse-metadata.cjs 会重新生成除 reference-iptc.jpg 外的上述样本；测试不依赖安装 ExifTool。
