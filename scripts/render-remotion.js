import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectPath = process.argv[2] || "project.json";
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
const outDir = project.output?.directory || "dist";
fs.mkdirSync(outDir, { recursive: true });
const args = [
  "remotion", "render", "src/remotion/index.tsx", "Keynote",
  path.resolve(outDir, "keynote.mp4"),
  "--props", JSON.stringify({ project }),
  "--codec", "h264",
  "--fps", String(project.fps || 30),
  "--width", String(project.canvas.width),
  "--height", String(project.canvas.height)
];
const result = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status ?? 1);
