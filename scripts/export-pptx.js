import fs from "node:fs";
import path from "node:path";
import pptxgen from "pptxgenjs";

const projectPath = process.argv[2] || "project.json";
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
const outDir = project.output?.directory || "dist";
fs.mkdirSync(outDir, { recursive: true });

const pptx = new pptxgen();
pptx.author = "KEYNOTE STUDIO PRO";
pptx.subject = "Product launch keynote";
pptx.title = project.title;
pptx.company = project.brand || "KEYNOTE STUDIO PRO";
pptx.lang = "zh-CN";
pptx.layout = "LAYOUT_WIDE";
pptx.defineLayout({ name: "CUSTOM", width: project.canvas.width / 120, height: project.canvas.height / 120 });
pptx.layout = "CUSTOM";
pptx.theme = {
  headFontFace: project.fonts?.heading || "Aptos Display",
  bodyFontFace: project.fonts?.body || "Aptos",
  lang: "zh-CN"
};
const scale = 1 / 120; // project coordinates are 1920x1080; 120 px per inch for 16:9 default
const theme = project.themeTokens || {};
const bgDefault = theme.background || "080D1C";

for (const scene of project.scenes) {
  const slide = pptx.addSlide();
  slide.background = { color: (scene.background || bgDefault).replace("#", "") };
  for (const el of scene.elements || []) {
    const x = (el.x || 0) * scale, y = (el.y || 0) * scale;
    const w = (el.w || 0) * scale, h = (el.h || 0) * scale;
    if (el.type === "text") {
      slide.addText(el.text || "", {
        x, y, w: Math.max(w, 0.2), h: Math.max(h, 0.2),
        fontFace: el.fontFace || project.fonts?.body || "Aptos",
        fontSize: el.fontSize || 28,
        color: (el.color || "FFFFFF").replace("#", ""),
        bold: !!el.bold,
        align: el.align || "left",
        valign: el.valign || "mid",
        margin: 0,
        breakLine: false,
        transparency: el.opacity == null ? 0 : Math.round((1 - el.opacity) * 100)
      });
    } else if (el.type === "shape") {
      const shape = el.shape === "ellipse" ? pptx.ShapeType.ellipse :
        el.shape === "line" ? pptx.ShapeType.line :
        el.shape === "roundRect" ? pptx.ShapeType.roundRect : pptx.ShapeType.rect;
      slide.addShape(shape, {
        x, y, w, h,
        line: { color: (el.lineColor || el.color || "FFFFFF").replace("#", ""), transparency: el.lineOpacity == null ? 100 : Math.round((1 - el.lineOpacity) * 100) },
        fill: { color: (el.fill || el.color || "FFFFFF").replace("#", ""), transparency: el.opacity == null ? 0 : Math.round((1 - el.opacity) * 100) }
      });
    } else if (el.type === "image" || el.type === "video") {
      const src = el.src && path.resolve(path.dirname(path.resolve(projectPath)), el.src);
      if (src && fs.existsSync(src) && el.type === "image") {
        slide.addImage({ path: src, x, y, w, h, transparency: el.opacity == null ? 0 : Math.round((1 - el.opacity) * 100) });
      } else if (el.type === "video") {
        // Video embedding is optional and depends on the PptxGenJS version / target PowerPoint.
        // For maximum reliability, keep the scene MP4 as a separate deliverable.
        slide.addText("[VIDEO SCENE — see keynote.mp4]", { x, y, w: Math.max(w, 2), h: Math.max(h, 0.35), color: "AAAAAA", fontSize: 12 });
      } else {
        slide.addText(`[Missing image: ${el.src || "asset"}]`, { x, y, w: Math.max(w, 1), h: Math.max(h, 0.35), color: "FF6666", fontSize: 12 });
      }
    }
  }
  if (scene.notes) slide.addNotes(scene.notes);
}
await pptx.writeFile({ fileName: path.resolve(outDir, "editable.pptx") });
console.log(`✓ Wrote ${path.resolve(outDir, "editable.pptx")}`);

// High-fidelity deck: one scene per slide. If a scene has `renderedVideo`,
// embed that MP4 as a full-slide video. Otherwise use the editable slide's
// visual primitives as a graceful fallback and report the missing scene render.
const hi = new pptxgen();
hi.author = "KEYNOTE STUDIO PRO";
hi.title = `${project.title} — High Fidelity`;
hi.defineLayout({ name: "CUSTOM", width: project.canvas.width / 120, height: project.canvas.height / 120 });
hi.layout = "CUSTOM";
const missingVideoScenes = [];
for (const scene of project.scenes) {
  const slide = hi.addSlide();
  slide.background = { color: (scene.background || bgDefault).replace("#", "") };
  const videoPath = scene.renderedVideo
    ? path.resolve(path.dirname(path.resolve(projectPath)), scene.renderedVideo)
    : null;
  if (videoPath && fs.existsSync(videoPath)) {
    slide.addMedia({ path: videoPath, type: "video", x: 0, y: 0, w: project.canvas.width / 120, h: project.canvas.height / 120 });
    slide.addText("若视频未自动播放，请在 PowerPoint 中点击播放。", {
      x: 0.15, y: 0.12, w: 4.8, h: 0.25, fontSize: 8, color: "FFFFFF",
      transparency: 35, margin: 0
    });
  } else {
    missingVideoScenes.push(scene.id);
    slide.addText(`${scene.id}\n高保真场景视频尚未生成；请配置 scene.renderedVideo 后重新导出。`, {
      x: 0.6, y: 2.4, w: project.canvas.width / 120 - 1.2, h: 1.2,
      fontSize: 20, color: "FFFFFF", align: "center", margin: 0.1
    });
  }
}
await hi.writeFile({ fileName: path.resolve(outDir, "high_fidelity.pptx") });
console.log(`✓ Wrote ${path.resolve(outDir, "high_fidelity.pptx")}`);
if (missingVideoScenes.length) {
  console.warn(`High-fidelity video missing for scenes: ${missingVideoScenes.join(", ")}`);
  console.warn("Render one MP4 per scene and set each scene.renderedVideo to its relative path to embed full-motion scenes.");
}
