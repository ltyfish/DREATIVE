import fs from "node:fs";
import path from "node:path";
import { SKILL_DEFINITIONS, resolveSkillDependencies } from "../shared/skillSystem.js";

export interface DocsCheckFinding {
  check: string;
  file: string;
  message: string;
}

export interface DocsCheckReport {
  ok: boolean;
  findings: DocsCheckFinding[];
}

const UNIVERSAL_RULE = "Universal foundation: ux and baseline mobile apply to every web page.";
const UNIVERSAL_FILES = ["SKILL.md", "references/SKILL_CONTRACT.md", "skills/ux.md", "skills/mobile.md"];
const RUNTIME_MARKDOWN = new Set(["plan.md", "verify.md", "system.md", "ledger.md"]);

function walk(root: string, current = root): string[] {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    return entry.isDirectory() ? walk(root, absolute) : [path.relative(root, absolute).split(path.sep).join("/")];
  });
}

function add(findings: DocsCheckFinding[], check: string, file: string, message: string) {
  findings.push({ check, file, message });
}

function resolveReference(skillDir: string, from: string, reference: string): boolean {
  if (
    reference.includes("<") ||
    reference.includes(">") ||
    reference.includes(".dreative/") ||
    reference.includes(".dreative\\") ||
    path.isAbsolute(reference) ||
    RUNTIME_MARKDOWN.has(path.basename(reference))
  )
    return true;
  const candidates = [
    path.resolve(skillDir, path.dirname(from), reference),
    path.resolve(skillDir, reference),
    path.resolve(skillDir, "skills", path.basename(reference)),
    path.resolve(skillDir, "references", path.basename(reference)),
    path.resolve(skillDir, "frameworks", path.basename(reference)),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

export function runDocsCheck(skillDir: string): DocsCheckReport {
  const findings: DocsCheckFinding[] = [];
  const files = walk(skillDir).filter((file) => file.endsWith(".md") || file.endsWith(".json"));
  const contents = new Map(files.map((file) => [file, fs.readFileSync(path.join(skillDir, file), "utf-8")]));

  for (const [file, content] of contents) {
    if (/^(<<<<<<<|=======|>>>>>>>)/m.test(content)) add(findings, "merge-markers", file, "contains unresolved merge markers");
    if (/\bAskUserQuestion\b/.test(content)) add(findings, "obsolete-tool", file, "names AskUserQuestion instead of using tool-neutral wording");
    if (file.endsWith(".md")) {
      for (const match of content.matchAll(/`([^`\n]+\.md)`/g)) {
        if (!resolveReference(skillDir, file, match[1])) add(findings, "references", file, `missing referenced file: ${match[1]}`);
      }
    }
  }

  const schemaFile = "schemas/plan.schema.json";
  try {
    const schema = JSON.parse(contents.get(schemaFile) ?? "{}") as { properties?: { tier?: { enum?: string[] } } };
    const tiers = schema.properties?.tier?.enum ?? [];
    const expected = ["solid", "premium", "expressive", "award"];
    if (JSON.stringify(tiers) !== JSON.stringify(expected))
      add(findings, "tiers", schemaFile, `tier enum must be ${expected.join(" | ")}`);
    for (const file of ["SKILL.md", "PLAN.md", "references/ARTIFACTS.md", "references/TIERS.md"]) {
      const content = contents.get(file) ?? "";
      for (const tier of expected) {
        if (!new RegExp(`\\b${tier}\\b`, "i").test(content)) add(findings, "tiers", file, `does not mention canonical tier ${tier}`);
      }
    }
    const plan = contents.get("PLAN.md") ?? "";
    for (const tier of expected) {
      if (!plan.includes(`(\`${tier}\`)`)) add(findings, "tiers", "PLAN.md", `choice label must expose stored id (${tier})`);
    }
    if (/\*\*(safe|award-site)\*\*/i.test(plan)) add(findings, "tiers", "PLAN.md", "contains a legacy tier choice label");
  } catch (error) {
    add(findings, "tiers", schemaFile, `cannot parse tier schema: ${String(error)}`);
  }

  const main = contents.get("SKILL.md") ?? "";
  for (const definition of SKILL_DEFINITIONS) {
    const file = `skills/${definition.name}.md`;
    if (!contents.has(file)) add(findings, "skills", file, "specialist file is missing");
    if (!main.includes(`\`${definition.name}\``)) add(findings, "skills", "SKILL.md", `picker omits ${definition.name}`);
    for (const dependency of resolveSkillDependencies([definition.name])) {
      if (!SKILL_DEFINITIONS.some((candidate) => candidate.name === dependency))
        add(findings, "skills", file, `dependency ${dependency} has no definition`);
    }
  }

  for (const file of UNIVERSAL_FILES) {
    if (!(contents.get(file) ?? "").includes(UNIVERSAL_RULE))
      add(findings, "universal-rules", file, "universal ux/mobile rule differs from the canonical wording");
  }

  const design = contents.get("DESIGN.md") ?? "";
  const lines = design.split(/\r?\n/);
  const bannedTokens = new Set<string>();
  for (const line of lines) {
    if (/\b(banned|never)\b/i.test(line)) for (const match of line.matchAll(/`([^`]+)`/g)) bannedTokens.add(match[1]);
  }
  for (const token of bannedTokens) {
    const contradictory = lines.find(
      (line) => line.includes(`\`${token}\``) && /\b(allowed|valid|preferred|required|use|source)\b/i.test(line) && !/\b(banned|never|instead of|do not)\b/i.test(line),
    );
    if (contradictory) add(findings, "doctrine", "DESIGN.md", `implementation ${token} is both banned and presented positively`);
  }

  const phaseRule = "Run one short decision phase containing several sequential single-question";
  for (const file of ["SKILL.md", "PLAN.md"]) {
    if (!(contents.get(file) ?? "").includes(phaseRule)) add(findings, "questions", file, "decision-phase rule is inconsistent");
  }

  return { ok: findings.length === 0, findings };
}

export function printDocsCheck(report: DocsCheckReport, json: boolean) {
  if (json) return void console.log(JSON.stringify(report, null, 2));
  for (const item of report.findings) console.log(`ERROR [${item.check}] ${item.file}: ${item.message}`);
  console.log(report.ok ? "Dreative docs check passed." : "Dreative docs check failed.");
}
