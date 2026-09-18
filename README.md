# 菲八工具箱官网

菲八工具箱官方网站，采用暖白与琥珀色液态玻璃视觉，展示图片超分、无水印解析和媒体工具箱等核心能力。

## 本地预览

在项目根目录运行：

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:8766/website/
```

## 文件结构

```text
website/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── image-upscale.png
├── watermark-parser.png
├── video-toolbox.png
└── appearance.png
```

## 说明

- 页面为纯静态 HTML、CSS 和 JavaScript，无构建步骤。
- 交互包括产品界面切换、移动端导航、滚动入场、指针高光与轻微 3D 倾斜。
- 已适配桌面、平板和手机尺寸，并支持 `prefers-reduced-motion`。
