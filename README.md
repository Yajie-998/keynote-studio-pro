# KEYNOTE STUDIO PRO
跨平台通用 Agent Skill + Remotion / PptxGenJS 双引擎发布会演示工程。

## 核心原则
- 动态演示优先：Remotion 负责动画、镜头、音频、视频与最终 MP4。
- PPT 同步：PptxGenJS 根据同一份 `project.json` / `scenes.json` 生成 PPTX。
- 双重交付：`editable.pptx` 尽可能使用原生元素；`high_fidelity.pptx` 可将每个场景的渲染视频嵌入页面，以保留复杂动效。
- 诚实降级：PPTX 不保证复刻 Remotion 中的所有 WebGL / Three.js / 粒子效果；复杂场景应使用视频片段或静态关键帧。
- 屏幕适配：以设计画布为基准，按目标屏幕重新排版，不直接拉伸内容。

## 快速开始
需要 Node.js 20+、npm、FFmpeg。建议安装 Chromium 以支持 Remotion 浏览器渲染。

```bash
npm install
cp examples/ai-product-launch/project.json project.json
npm run validate -- project.json
npm run render:video -- project.json
npm run export:pptx -- project.json
```

输出默认位于 `dist/`：
- `keynote.mp4`
- `editable.pptx`
- `high_fidelity.pptx`（每页支持嵌入对应场景 MP4；未提供场景视频时会生成待补充提示页）
- `preview/` 场景预览帧

## 目录
- `SKILL.md`：Agent 主工作流与行为规范
- `references/`：创意、叙事、视觉、动效、音效、宽屏、PPT 与 QA 规则
- `templates/`：Apple 极简、Google 渐变、Samsung 未来、Tesla 工业、奢华、AI 未来模板
- `schemas/`：项目与场景 JSON Schema
- `src/remotion/`：动态渲染入口与场景组件
- `scripts/`：校验、Remotion 渲染、PPTX 导出
- `examples/`：可运行的 AI 产品发布会示例

## 项目数据模型
`project.json` 是单一事实来源。所有场景都定义在 `scenes` 数组中，使用秒作为时间单位。坐标采用 1920×1080 设计坐标系；渲染器按目标画布缩放。建议使用相对路径引用 `assets/` 下的素材。

场景元素支持：
- `text`：标题、正文、标签、数字
- `image`：产品图、背景图
- `shape`：矩形、圆形、线条
- `video`：视频片段
- `audio`：背景音乐或音效（可在场景级或事件级定义）
- `events`：时间点触发的视觉/音频事件

## 动态与 PPT 输出策略
1. Remotion 输出完整 MP4；所有时间轴以帧为单位计算，避免浮点时间漂移。
2. PPTX 可编辑模式将文本、图片、基础形状、图表尽量转成 PowerPoint 原生对象。
3. PPTX 高保真模式在每页嵌入对应场景 MP4；部分 PowerPoint 播放器需要用户点击或配置自动播放。
4. 需要现场无人值守自动播放时，建议另行交付 MP4 主文件，并在目标电脑上提前测试音频设备、视频解码与全屏输出。

## 注意事项
- 不要将 Apple、Google、Samsung、Tesla 的 Logo、专有字体或受版权保护的发布会素材直接复制到商业项目。只借鉴其设计原则，形成原创视觉。
- 使用有授权的音乐、音效、字体、图片与视频素材。
- 生成式 AI 产品图必须与真实产品规格区分，不能把概念图伪装成实拍。
- 大屏分辨率、LED 拼接映射、像素间距与处理器配置由现场 AV 团队最终确认。
