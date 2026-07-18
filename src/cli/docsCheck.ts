import fs from "node:fs";
import path from "node:path";

export interface DocsCheckFinding {
  check: string;
  file: string;
  message: string;
}

export interface DocsCheckReport {
  ok: boolean;
  findings: DocsCheckFinding[];
}

const RUNTIME_MARKDOWN = new Set(["plan.md", "verify.md", "system.md", "ledger.md"]);

function walk(root: string, current = root): string[] {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    return entry.isDirectory() ? walk(root, absolute) : [path.relative(root, absolute).split(path.sep).join("/")];
  });
}

function resolves(skillDir: string, from: string, reference: string): boolean {
  if (reference.includes("<") || reference.includes(">") || reference.includes(".dreative/")
    || path.isAbsolute(reference) || RUNTIME_MARKDOWN.has(path.basename(reference).toLowerCase())) return true;
  return [
    path.resolve(skillDir, path.dirname(from), reference),
    path.resolve(skillDir, reference),
    path.resolve(skillDir, "skills", path.basename(reference)),
    path.resolve(skillDir, "references", path.basename(reference)),
    path.resolve(skillDir, "recipes", path.basename(reference)),
  ].some((candidate) => fs.existsSync(candidate));
}

function requireText(
  findings: DocsCheckFinding[],
  file: string,
  content: string,
  pattern: RegExp,
  message: string,
) {
  if (!pattern.test(content)) findings.push({ check: "delivery-contract", file, message });
}

export function runDocsCheck(skillDir: string): DocsCheckReport {
  const findings: DocsCheckFinding[] = [];
  const files = walk(skillDir).filter((file) => /\.(md|json)$/i.test(file));
  const contents = new Map(files.map((file) => [file, fs.readFileSync(path.join(skillDir, file), "utf8")]));

  for (const [file, content] of contents) {
    if (/^(<<<<<<<|=======|>>>>>>>)/m.test(content))
      findings.push({ check: "merge-markers", file, message: "contains unresolved merge markers" });
    if (file.endsWith(".json")) {
      try { JSON.parse(content); }
      catch (error) { findings.push({ check: "json", file, message: `cannot parse JSON: ${String(error)}` }); }
    }
    if (file.endsWith(".md")) {
      for (const match of content.matchAll(/`([^`\n]+\.md)`/g)) {
        if (!resolves(skillDir, file, match[1]))
          findings.push({ check: "references", file, message: `missing referenced file: ${match[1]}` });
      }
    }
  }

  const skill = contents.get("SKILL.md") ?? "";
  const plan = contents.get("PLAN.md") ?? "";
  requireText(findings, "SKILL.md", skill, /never open.*editor|do not open.*editor/is, "must forbid opening the optional Dreative editor during frontend work");
  requireText(findings, "SKILL.md", skill, /inspect the entire page/i, "must require inspection beyond the hero");
  requireText(findings, "SKILL.md", skill, /1440|desktop/i, "must require a desktop browser review");
  requireText(findings, "SKILL.md", skill, /390px/i, "must require an authored mobile browser review");
  requireText(findings, "SKILL.md", skill, /encoding|mojibake/i, "must check visible text integrity");
  requireText(findings, "SKILL.md", skill, /DREATIVE_FINALIZED/, "must retain fail-closed finalization");

  for (const choice of ["Recommended", "Efficient", "Showcase"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `missing concise ${choice} approach`);
  requireText(findings, "PLAN.md", plan, /show detailed plan/i, "must offer detail on request");
  requireText(findings, "PLAN.md", plan, /second approval/i, "must avoid a second approval gate");
  for (const choice of ["References", "Treatments", "Sourced images", "Generated images", "Packages", "Prototype", "Review depth", "Fast", "Lean", "Full Audit"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `detailed planning is missing ${choice}`);
  requireText(findings, "PLAN.md", plan, /all ten/i, "Showcase must explicitly select all ten treatments");
  requireText(findings, "PLAN.md", plan, /token-.+efficient|least tokens/i, "Efficient must optimize token use");

  const publicContract = `${skill}\n${plan}`;
  for (const obsolete of [
    "Mandatory Creative Decision Brief",
    "Mandatory Executable Plan Review",
    "Dreative Dogfood",
    "host-attested",
    "externally-attested",
  ]) {
    if (publicContract.includes(obsolete))
      findings.push({ check: "obsolete-ceremony", file: publicContract.indexOf(obsolete) < skill.length ? "SKILL.md" : "PLAN.md", message: `public workflow still exposes ${obsolete}` });
  }

  return { ok: findings.length === 0, findings };
}

export function printDocsCheck(report: DocsCheckReport, json: boolean) {
  if (json) return void console.log(JSON.stringify(report, null, 2));
  for (const item of report.findings) console.log(`ERROR [${item.check}] ${item.file}: ${item.message}`);
  console.log(report.ok ? "Dreative docs check passed." : "Dreative docs check failed.");
}
