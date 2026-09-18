import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

const configPath = join(process.cwd(), "ollama.config.json");
let localConfig = {};

try {
  localConfig = JSON.parse(await readFile(configPath, "utf8"));
} catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
    console.error(`Unable to read ${configPath}.`);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args[0] === "--") args.shift();

const inputPath = args[0];
if (!inputPath) {
  console.error("Usage: pnpm snippet:generate -- path/to/request.json [output.json]");
  process.exit(1);
}

const outputPath = args[1] ?? join(
  dirname(inputPath),
  `${basename(inputPath, extname(inputPath))}.delivery.json`,
);
const ollamaUrl = (
  process.env.OLLAMA_URL ?? localConfig.url ?? "http://127.0.0.1:11434"
).replace(/\/$/, "");
const model = process.env.OLLAMA_MODEL ?? localConfig.model ?? "qwen2.5-coder:7b";
const brief = JSON.parse(await readFile(inputPath, "utf8"));

const deliverySchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    files: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string" },
        },
        required: ["path", "content"],
      },
    },
    dependencies: { type: "array", items: { type: "string" } },
    usageInstructions: { type: "string" },
  },
  required: ["title", "description", "files", "dependencies", "usageInstructions"],
};

const prompt = `You are preparing a production-quality code delivery for My Company.
Generate only the requested ${brief.language} ${brief.category}.
Respect every supplied style and behavior preference. Use accessible markup, responsive design when requested, concise comments, and no placeholder prose.
For React, return self-contained TSX plus any required CSS files and list external packages in dependencies.
For HTML, return runnable HTML/CSS/JS files as needed.
For Python, return safe source code and do not include secrets.

Customer brief:
${JSON.stringify(brief, null, 2)}

Return data matching this JSON schema:
${JSON.stringify(deliverySchema)}`;

let response;
try {
  response = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      format: deliverySchema,
      stream: false,
      options: { temperature: 0.2 },
    }),
  });
} catch (error) {
  console.error(`Unable to reach Ollama at ${ollamaUrl}. Start Ollama and confirm OLLAMA_URL.`);
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

if (!response.ok) {
  console.error(`Ollama returned ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const payload = await response.json();
const delivery = JSON.parse(payload.response ?? "{}");
if (
  typeof delivery.title !== "string" ||
  typeof delivery.description !== "string" ||
  !Array.isArray(delivery.files) ||
  delivery.files.length < 1 ||
  !delivery.files.every((file) => typeof file?.path === "string" && typeof file?.content === "string") ||
  !Array.isArray(delivery.dependencies) ||
  typeof delivery.usageInstructions !== "string"
) {
  console.error("Ollama returned an invalid delivery payload.");
  process.exit(1);
}

await writeFile(outputPath, `${JSON.stringify(delivery, null, 2)}\n`, "utf8");
console.log(`Generated ${delivery.files.length} file(s) with ${model}.`);
console.log(`Review before importing: ${outputPath}`);
