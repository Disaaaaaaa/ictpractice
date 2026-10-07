/**
 * Uploads mock exams from content/mocks/<key>.json (no generation — use after
 * editing a file). Figures come from content/mocks/figures/<key>/, original PDFs
 * from "specification-past papers/".
 *
 *   npm run mocks:apply -- [nis-2024-p2 …] [--draft]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { authoredMockSchema } from "../src/lib/content/schema";
import { pushMock } from "./lib/push-mock";

const ROOT = join(__dirname, "..");
const { values, positionals } = parseArgs({ allowPositionals: true, options: { draft: { type: "boolean", default: false } } });

async function main() {
  const keys = positionals.length
    ? positionals
    : readdirSync(join(ROOT, "content/mocks")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  for (const key of keys) {
    const mock = authoredMockSchema.parse(JSON.parse(readFileSync(join(ROOT, "content/mocks", `${key}.json`), "utf8")));
    const figDir = join(ROOT, "content/mocks/figures", key);
    const figures = existsSync(figDir)
      ? readdirSync(figDir).filter((f) => f.endsWith(".png")).map((f) => ({ file: join(figDir, f), path: `mocks/${key}/${f}` }))
      : [];
    const pdfs = mock.teacher_resources
      .map((r) => ({ file: join(ROOT, "specification-past papers", r.path.split("/").slice(1).join("/")), path: r.path }))
      .filter((p) => existsSync(p.file));
    const r = await pushMock({ mock, figures, pdfs, status: values.draft ? "draft" : "published" });
    console.log(`✓ ${key}: ${r.note}`);
  }
}

main().catch((e) => {
  console.error(`✗ ${(e as Error).message}`);
  process.exit(1);
});
