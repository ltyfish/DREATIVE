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
  requireText(findings, "SKILL.md", skill, /design-builder/i, "must define Dreative as a frontend design-builder");
  requireText(findings, "SKILL.md", skill, /CREATIVE_DIRECTION\.md/, "must route open-ended concept work through creative synthesis");
  requireText(findings, "SKILL.md", skill, /project-native|product truth/i, "must derive concepts from the real product");
  requireText(findings, "SKILL.md", skill, /do not narrate|not.*substitute/i, "must reject performative checklist compliance");
  requireText(findings, "SKILL.md", skill, /inspect.*(?:entire|full).*page/is, "must require inspection beyond the hero");
  requireText(findings, "SKILL.md", skill, /1440|desktop/i, "must require a desktop browser review");
  requireText(findings, "SKILL.md", skill, /390px/i, "must require an authored mobile browser review");
  requireText(findings, "SKILL.md", skill, /encoding|mojibake|broken glyphs/i, "must check visible text integrity");
  requireText(findings, "SKILL.md", skill, /DREATIVE_FINALIZED/, "must retain fail-closed finalization");
  requireText(findings, "SKILL.md", skill, /VISUAL_REFINEMENT\.md/, "must route completion through the rendered screenshot correction loop");
  requireText(findings, "SKILL.md", skill, /preflight --probe-browser.*preview-url/i, "must require launch plus preview-navigation evidence before browser verification");
  requireText(findings, "SKILL.md", skill, /\.dreative\/context\.json/, "must preserve durable project memory");
  requireText(findings, "references/VISUAL_REFINEMENT.md", contents.get("references/VISUAL_REFINEMENT.md") ?? "", /capture full-page screenshots|inspect the pixels/i, "visual refinement must require screenshot inspection");
  const foundations = contents.get("systems/NATIVE_FOUNDATIONS.md") ?? "";
  requireText(findings, "systems/NATIVE_FOUNDATIONS.md", foundations, /twelve implementation-neutral foundations/i, "must expose a bounded native-foundation set");
  requireText(findings, "systems/NATIVE_FOUNDATIONS.md", foundations, /not preferred substitutes[\s\S]+Do not select a Native Foundation merely because it is[\s\S]+available or easier/i, "must prevent convenience-driven Native Foundation selection");
  requireText(findings, "SKILL.md", skill, /Native Foundations as baseline implementation skeletons[\s\S]+Do not select a foundation merely because it is[\s\S]+available[\s\S]+easier/i, "must choose foundations or mature runtimes by required outcome rather than convenience");
  requireText(findings, "references/CREATIVE_DIRECTION.md", contents.get("references/CREATIVE_DIRECTION.md") ?? "", /independence test/i, "must include a reference-independence test");

  for (const choice of ["Recommended", "Efficient", "Showcase"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `missing concise ${choice} approach`);
  requireText(findings, "PLAN.md", plan, /show detailed plan/i, "must offer detail on request");
  requireText(findings, "PLAN.md", plan, /second approval/i, "must avoid a second approval gate");
  for (const choice of ["References", "Treatments", "Sourced images", "Generated images", "Packages", "Prototype", "Review depth", "Fast", "Lean", "Full Audit"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `detailed planning is missing ${choice}`);
  requireText(findings, "PLAN.md", plan, /no minimum treatment|select only those/i, "Showcase must select treatments by concept fit rather than count");
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

  for (const imitation of ["Unseen-style", "Unseen-like", "Lenis-style"]) {
    if (publicContract.toLowerCase().includes(imitation.toLowerCase()))
      findings.push({ check: "reference-imitation", file: publicContract.indexOf(imitation) < skill.length ? "SKILL.md" : "PLAN.md", message: `public workflow must not prescribe ${imitation}` });
  }

  return { ok: findings.length === 0, findings };
}

export function printDocsCheck(report: DocsCheckReport, json: boolean) {
  if (json) return void console.log(JSON.stringify(report, null, 2));
  for (const item of report.findings) console.log(`ERROR [${item.check}] ${item.file}: ${item.message}`);
  console.log(report.ok ? "Dreative docs check passed." : "Dreative docs check failed.");
}
