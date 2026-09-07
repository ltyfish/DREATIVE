import fs from "node:fs";
import path from "node:path";

export interface DocsCheckFinding { check: string; file: string; message: string }
export interface DocsCheckReport { ok: boolean; findings: DocsCheckFinding[] }

// These names describe project-created artifacts, not packaged references.
const RUNTIME_MARKDOWN = new Set(["plan.md", "verify.md", "system.md", "ledger.md"]);
const REQUIRED = ["SKILL.md", "PLAN.md", "references/SHOWCASE.md", "references/VISUAL_REFINEMENT.md"];

function walk(root: string, current = root): string[] {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    return entry.isDirectory() ? walk(root, absolute) : [path.relative(root, absolute).split(path.sep).join("/")];
  });
}

function resolves(skillDir: string, from: string, reference: string): boolean {
  if (reference.includes("<") || reference.includes(">") || reference.includes(".dreative/")
    || path.isAbsolute(reference) || RUNTIME_MARKDOWN.has(path.basename(reference).toLowerCase())) return true;
  // Maintainer-only reference is deliberately absent from installed distributions.
  if (reference === "references/DOGFOOD_LESSONS.md" || reference === "DOGFOOD_LESSONS.md") return true;
  const candidates = [
    path.resolve(skillDir, path.dirname(from), reference),
    path.resolve(skillDir, reference),
  ];
  if (!reference.includes("/")) {
    candidates.push(path.resolve(skillDir, "skills", reference), path.resolve(skillDir, "references", reference));
  }
  return candidates.some((candidate) => fs.existsSync(candidate));
}

/** Package integrity only. Wording, taste, and workflow behavior need real review. */
export function runDocsCheck(skillDir: string): DocsCheckReport {
  const findings: DocsCheckFinding[] = [];
  if (!fs.existsSync(skillDir)) return { ok: false, findings: [{ check: "package", file: skillDir, message: "skill directory is missing" }] };
  for (const file of REQUIRED) {
    if (!fs.existsSync(path.join(skillDir, file)))
      findings.push({ check: "package", file, message: "required package resource is missing" });
  }
  for (const file of walk(skillDir).filter((file) => /\.(md|json)$/i.test(file))) {
    const content = fs.readFileSync(path.join(skillDir, file), "utf8").replace(/^\uFEFF/, "");
    if (/^(<<<<<<<|=======|>>>>>>>)/m.test(content))
      findings.push({ check: "merge-markers", file, message: "contains unresolved merge markers" });
    if (file.endsWith(".json")) {
      try { JSON.parse(content); }
      catch (error) { findings.push({ check: "json", file, message: `cannot parse JSON: ${String(error)}` }); }
    }
    if (file === "SKILL.md") {
      const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatter || !/^name:\s*dreative\s*$/m.test(frontmatter[1]) || !/^description:\s*\S.+/m.test(frontmatter[1]))
        findings.push({ check: "frontmatter", file, message: "requires name: dreative and a non-empty description" });
    }
    if (file.endsWith(".md")) {
      const references = new Set([
        ...Array.from(content.matchAll(/`([^`\n]+\.md)`/g), (match) => match[1]),
        ...Array.from(content.matchAll(/\]\(([^)\s]+\.md)(?:#[^)]*)?\)/g), (match) => match[1]),
      ]);
      for (const reference of references) {
        if (!/^https?:\/\//.test(reference) && !resolves(skillDir, file, reference))
          findings.push({ check: "references", file, message: `missing referenced file: ${reference}` });
      }
    }
  }
  return { ok: findings.length === 0, findings };
}

export function printDocsCheck(report: DocsCheckReport, json: boolean) {
  if (json) return void console.log(JSON.stringify(report, null, 2));
  for (const item of report.findings) console.log(`ERROR [${item.check}] ${item.file}: ${item.message}`);
  console.log(report.ok ? "Dreative docs check passed." : "Dreative docs check failed.");
}
