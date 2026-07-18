import fs from "node:fs";
import path from "node:path";
import { SKILL_DEFINITIONS, resolveSkillDependencies } from "../shared/skillSystem.js";
import type { ReflexFontRegistry, RuleRegistry } from "../shared/ruleSystem.js";
import { PLAN_VERSION } from "../shared/planGovernance.js";

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

  for (const [file, content] of contents) {
    if (!file.endsWith(".md")) continue;
    const sections = content.split(/(?=^#{1,6}\s)/m);
    for (const section of sections) {
      const heading = section.split(/\r?\n/, 1)[0];
      const legacy = /\b(migration|legacy|historical)\b/i.test(heading);
      if (!legacy && /\b(?:write|create|current schema|contract|plan(?:\.yaml)?)\b[^\n]{0,80}\bv7\b|\bv7\b[^\n]{0,80}\b(?:write|create|current schema|contract|plan(?:\.yaml)?)/i.test(section))
        add(findings, "canonical-version", file, "active workflow instructs creation or use of v7 outside a migration/legacy section");
    }
    if (/(?:permission|allowed).{0,40}(?:makes?|means?|provides?).{0,40}(?:available|capability)|available-through-sourcing\s*\(user-permission\)/i.test(content))
      add(findings, "capability-truth", file, "equates permission with detected capability");
    if (/three\.?js.{0,40}(?:generate|create).{0,20}(?:model|3d asset)|ffmpeg.{0,40}(?:generate|create).{0,20}(?:original )?video/i.test(content))
      add(findings, "capability-truth", file, "describes a runtime/processing package as creative authoring");
    if (/write (?:the )?plan directly.{0,80}(?:skip|bypass|omit)|only (?:show|disclose).{0,30}recommended treatments/i.test(content))
      add(findings, "treatment-selection", file, "allows direct-plan bypass or partial treatment disclosure");
    if (/(?:always|universally|every project).{0,60}(?:full recording|dual recording|montage)/i.test(content))
      add(findings, "adaptive-spread", file, "requires heavy recording universally instead of conditionally");
  }

  const schemaFile = "schemas/plan.schema.json";
  try {
    const schema = JSON.parse(contents.get(schemaFile) ?? "{}") as any;
    if (schema.properties?.version?.const !== PLAN_VERSION || !String(schema.title ?? "").includes(`v${PLAN_VERSION}`))
      add(findings, "canonical-version", schemaFile, `schema must declare canonical v${PLAN_VERSION}`);
    const ambitions = schema.properties?.contract?.properties?.workflow?.$ref
      ? schema.$defs?.workflow?.properties?.ambition?.enum ?? []
      : [];
    const expected = ["standard", "expressive", "award", "experimental"];
    if (JSON.stringify(ambitions) !== JSON.stringify(expected))
      add(findings, "ambition", schemaFile, `ambition enum must be ${expected.join(" | ")}`);
    for (const file of ["SKILL.md", "references/TIERS.md"]) {
      const content = contents.get(file) ?? "";
      for (const ambition of expected) {
        if (!new RegExp(`\\b${ambition}\\b`, "i").test(content)) add(findings, "ambition", file, `does not mention canonical ambition ${ambition}`);
      }
    }
  } catch (error) {
    add(findings, "ambition", schemaFile, `cannot parse ambition schema: ${String(error)}`);
  }

  for (const skill of ["media", "motion", "3d", "immersive", "cinematic"]) {
    const specialist = `skills/${skill}.md`;
    const recipe = `recipes/${skill}-recipes.md`;
    if (!contents.has(recipe)) add(findings, "recipes", recipe, "recipe reference is missing");
    if (!(contents.get(specialist) ?? "").includes(`../${recipe}`))
      add(findings, "recipes", specialist, "does not point to its progressively loaded recipe reference");
    if (/^## (?:\d+(?:\.\d+)*\.?\s+)?(?:implementation\s+)?recipes?(?:\s|$)/im.test(contents.get(specialist) ?? ""))
      add(findings, "recipes", specialist, "inline recipe catalog remains in the primary specialist file");
  }

  const planSchema = contents.get("schemas/plan.schema.json") ?? "";
  for (const field of ["contract", "target", "creativeSources", "generatedImages", "sourcedImages", "generatedVideo", "sourcedVideo", "threeDAssets", "workflow", "ambition", "execution", "prototype", "purpose", "transformationDepth", "selectedTreatments", "treatmentAllocation", "experienceArc", "approval", "contractHash", "changeRequests"]) {
    if (!planSchema.includes(`\"${field}\"`)) add(findings, "schema", "schemas/plan.schema.json", `missing creative-control field ${field}`);
  }
  for (const file of ["schemas/plan.schema.json", "schemas/verify.schema.json", "schemas/critic.schema.json", "schemas/critic-input.schema.json", "schemas/visual-critic.schema.json", "schemas/design-equity.schema.json", "schemas/checkpoint.schema.json", "schemas/creative-catalog.schema.json"]) {
    try { JSON.parse(contents.get(file) ?? ""); }
    catch (error) { add(findings, "schema", file, `cannot parse schema: ${String(error)}`); }
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

  try {
    const registry = JSON.parse(contents.get("references/RULES.json") ?? "{}") as RuleRegistry;
    const ids = new Set<string>();
    for (const rule of registry.rules ?? []) {
      if (!rule.id || ids.has(rule.id)) add(findings, "rules", "references/RULES.json", `missing or duplicate rule id: ${rule.id}`);
      ids.add(rule.id);
      if (!["hard-gate", "evidence-backed-default", "creative-provocation"].includes(rule.category))
        add(findings, "rules", "references/RULES.json", `${rule.id}: invalid category`);
      if (rule.category === "hard-gate" && rule.exceptionAllowed)
        add(findings, "rules", "references/RULES.json", `${rule.id}: hard gates cannot allow exceptions`);
      if (!rule.observedFailure || !rule.defaultRemedy || !rule.exceptionTest)
        add(findings, "rules", "references/RULES.json", `${rule.id}: missing history, remedy, or exception test`);
    }
    if (!registry.wordingPrinciple?.includes("measurable success criteria"))
      add(findings, "rules", "references/RULES.json", "missing bounded-exception wording principle");
  } catch (error) {
    add(findings, "rules", "references/RULES.json", `cannot parse registry: ${String(error)}`);
  }

  try {
    const reflex = JSON.parse(contents.get("references/REFLEX_FONTS.json") ?? "{}") as ReflexFontRegistry;
    if (!Array.isArray(reflex.fonts) || reflex.fonts.length === 0)
      add(findings, "fonts", "references/REFLEX_FONTS.json", "reflex font list is empty");
    if (!Array.isArray(reflex.validReasonKinds) || reflex.validReasonKinds.length === 0)
      add(findings, "fonts", "references/REFLEX_FONTS.json", "valid reason-kind list is empty");
    if (!Array.isArray(reflex.invalidGenericReasons) || reflex.invalidGenericReasons.length === 0)
      add(findings, "fonts", "references/REFLEX_FONTS.json", "generic-reason list is empty");
  } catch (error) {
    add(findings, "fonts", "references/REFLEX_FONTS.json", `cannot parse registry: ${String(error)}`);
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

  for (const file of ["SKILL.md", "PLAN.md"]) {
    const content = contents.get(file) ?? "";
    for (const control of ["ambition", "execution", "prototype", "purpose"]) if (!content.includes(control)) add(findings, "workflow-controls", file, `missing independent ${control} control`);
    if (/full (?:Q&A|conversation) transcript|verbatim conversation/i.test(content) && !/do not store|without storing/i.test(content)) add(findings, "artifacts", file, "requires a verbatim transcript");
  }
  const planning = contents.get("PLAN.md") ?? "";
  for (const choice of ["Lean (Recommended)", "Auto (Recommended)", "Project Delivery (Recommended)", "Fast", "Full Audit", "Skip", "Required", "Production Certification", "Dreative Dogfood"])
    if (!planning.includes(choice)) add(findings, "workflow-choices", "PLAN.md", `missing user-facing configuration choice: ${choice}`);
  if (!/non-interactive/i.test(planning) || !/contract\.workflow/.test(planning)) add(findings, "workflow-choices", "PLAN.md", "configuration choices must preserve explicit automation input and persist to contract.workflow");
  for (const block of [
    "Mandatory Creative Decision Brief",
    "Recommended direction",
    "Workflow choices",
    "Complete treatment decision guide",
    "Experience allocation",
    "Capability and source preflight",
    "Delivery risks and fallbacks",
    "One-line decision reply",
    "Mandatory Executable Plan Review",
    "Project and requirement contract",
    "Treatment decision and allocation contract",
    "Section contracts",
    "Mechanism and fallback contracts",
    "Package contract",
    "Prototype contract",
    "Subject, prop and asset contracts",
    "Reference contract",
    "Verification and completion contract",
    "Unresolved decisions and blockers",
  ]) {
    if (!planning.includes(block))
      add(findings, "approval-brief", "PLAN.md", `mandatory user-facing approval brief is missing block: ${block}`);
  }
  if (!/do not\s+scatter it across several messages/i.test(planning) || !/do not make the user inspect raw\s+YAML/i.test(planning))
    add(findings, "approval-brief", "PLAN.md", "approval brief must be self-contained in the conversation rather than deferred to raw YAML");
  if (!/recommendation is never recorded as the user's selection/i.test(planning) || !/select`, `decline` or `unsure`/i.test(planning))
    add(findings, "treatment-choice", "PLAN.md", "optional treatments must remain explicit user choices after their effects and tensions are disclosed");
  if (!/may not request approval while this block is non-empty/i.test(planning))
    add(findings, "executable-plan-review", "PLAN.md", "implementation approval must remain blocked while the executable review has unresolved decisions");
  for (const file of ["SKILL.md", "PLAN.md"]) {
    const content = contents.get(file) ?? "";
    if (!/user-facing task is interactive/i.test(content) || !/plain text/i.test(content) || !/never silently default/i.test(content))
      add(findings, "workflow-choices", file, "user-facing runs must ask configuration choices even without a structured question tool");
  }

  return { ok: findings.length === 0, findings };
}

export function printDocsCheck(report: DocsCheckReport, json: boolean) {
  if (json) return void console.log(JSON.stringify(report, null, 2));
  for (const item of report.findings) console.log(`ERROR [${item.check}] ${item.file}: ${item.message}`);
  console.log(report.ok ? "Dreative docs check passed." : "Dreative docs check failed.");
}
