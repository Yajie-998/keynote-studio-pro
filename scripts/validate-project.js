import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";

const input = process.argv[2] || "project.json";
if (!fs.existsSync(input)) {
  console.error(`Project file not found: ${input}`);
  process.exit(1);
}
const project = JSON.parse(fs.readFileSync(input, "utf8"));
const base = path.dirname(path.resolve(input));
const ajv = new Ajv({ allErrors: true });
const projectSchema = JSON.parse(fs.readFileSync("schemas/project.schema.json", "utf8"));
const sceneSchema = JSON.parse(fs.readFileSync("schemas/scene.schema.json", "utf8"));
ajv.addSchema(sceneSchema, "scene.schema.json");
const validate = ajv.compile(projectSchema);
if (!validate(project)) {
  console.error(ajv.errorsText(validate.errors, { separator: "\n" }));
  process.exit(1);
}
const errors = [];
for (const [i, scene] of project.scenes.entries()) {
  if (scene.duration <= 0) errors.push(`Scene ${i}: duration must be > 0`);
  for (const [j, el] of scene.elements.entries()) {
    if (el.src && !/^https?:\/\//.test(el.src) && !fs.existsSync(path.resolve(base, el.src))) {
      errors.push(`Scene ${scene.id} element ${j}: asset not found: ${el.src}`);
    }
  }
  for (const event of scene.events || []) {
    if (event.time > scene.duration) errors.push(`Scene ${scene.id}: event at ${event.time}s exceeds scene duration`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`✓ Valid project: ${project.title} (${project.scenes.length} scenes)`);
