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
  requireText(findings, "SKILL.md", skill, /DREATIVE_CHECKS_PASSED/, "must retain fail-closed deterministic checks");
  requireText(findings, "SKILL.md", skill, /visual smoke is mandatory for every/i, "must make visual smoke mandatory for substantial delivery");
  requireText(findings, "SKILL.md", skill, /shared state[\s\S]*source selector[\s\S]*affected region/i, "must require a connected Showcase state-continuity contract");
  requireText(findings, "SKILL.md", skill, /Recommended baseline[\s\S]*two perceptible[\s\S]*media opportunities/i, "Showcase must bind its delta and product-native media decision");
  requireText(findings, "SKILL.md", skill, /journey[\s\S]*scroll-authored[\s\S]*Smooth scrolling alone does not qualify/i, "journey-style Showcase must require substantive scroll choreography");
  requireText(findings, "SKILL.md", skill, /text, opacity, color, filter, or uniform scale[\s\S]*rejected/i, "Showcase must reject low-salience scroll-only state changes");
  requireText(findings, "SKILL.md", skill, /desktop[\s\S]*390px[\s\S]*320px mobile[\s\S]*text[\s\S]*collisions/i, "Showcase must exercise desktop, 390px, and 320px mechanisms and sample collisions");
  requireText(findings, "SKILL.md", skill, /hero, Peak, and[\s\S]*post-Peak[\s\S]*external media[\s\S]*procedural/i, "Showcase must make external-first focal asset decisions across the route");
  requireText(findings, "SKILL.md", skill, /full-page continuity storyboard[\s\S]*hero, Peak, and[\s\S]*post-Peak/i, "Showcase prototypes must expose full-page continuity");
  requireText(findings, "SKILL.md", skill, /production-like prototype[\s\S]*stop for explicit[\s\S]*acceptance or revision before integration/i, "the selected production prototype must have a separate user review gate");
  requireText(findings, "SKILL.md", skill, /reference mode[\s\S]*none[\s\S]*supplied[\s\S]*scout[\s\S]*traceable/i, "Showcase reference scouting must be explicit and traceable");
  requireText(findings, "SKILL.md", skill, /identity channels[\s\S]*visible media or a computed[\s\S]*distinct rendered values/i, "focal product identity must bind to rendered uniqueness evidence");
  requireText(findings, "SKILL.md", skill, /slow, normal, and rapid wheel[\s\S]*reverse[\s\S]*release cleanly/i, "Showcase scroll verification must cover perceptual completion and release");
  requireText(findings, "SKILL.md", skill, /VISUAL_REFINEMENT\.md/, "must route completion through the rendered screenshot correction loop");
  requireText(findings, "SKILL.md", skill, /preflight --probe-browser.*preview-url/i, "must require launch plus preview-navigation evidence before browser verification");
  requireText(findings, "SKILL.md", skill, /\.dreative\/context\.json/, "must preserve durable project memory");
  requireText(findings, "SKILL.md", skill, /\.dreative\/evaluation\/README\.md/, "must preserve opt-in evaluator routing");
  requireText(findings, "SKILL.md", skill, /never hidden chain-of-thought/i, "must keep evaluator records free of hidden reasoning");
  requireText(findings, "SKILL.md", skill, /Experience Map[\s\S]*more animated[\s\S]*change layout[\s\S]*keep static/i, "must expose plain-language section-level Experience Map controls");
  requireText(findings, "SKILL.md", skill, /input state[\s\S]*start and end states[\s\S]*mechanism owner[\s\S]*evidence target/i, "must compile Experience Map rows into implementation obligations");
  requireText(findings, "SKILL.md", skill, /experiential weight[\s\S]*advisory[\s\S]*visual inspection/i, "journey balance must prompt perceptual review without pretending to certify taste");
  requireText(findings, "PLAN.md", plan, /explicit request for a compact evaluator handoff/i, "must document the opt-in evaluator handoff");
  requireText(findings, "PLAN.md", plan, /exact branch and commit[\s\S]*stale untracked legacy/i, "evaluator handoff must identify source and reject stale legacy evidence");
  requireText(findings, "references/VISUAL_REFINEMENT.md", contents.get("references/VISUAL_REFINEMENT.md") ?? "", /capture full-page screenshots|inspect the pixels/i, "visual refinement must require screenshot inspection");
  const foundations = contents.get("systems/NATIVE_FOUNDATIONS.md") ?? "";
  requireText(findings, "systems/NATIVE_FOUNDATIONS.md", foundations, /twelve implementation-neutral foundations/i, "must expose a bounded native-foundation set");
  requireText(findings, "systems/NATIVE_FOUNDATIONS.md", foundations, /not preferred substitutes[\s\S]+Do not select a Native Foundation merely because it is[\s\S]+available or easier/i, "must prevent convenience-driven Native Foundation selection");
  requireText(findings, "SKILL.md", skill, /Native Foundations as baseline implementation skeletons[\s\S]+Do not select a foundation merely because it is[\s\S]+available[\s\S]+easier/i, "must choose foundations or mature runtimes by required outcome rather than convenience");
  requireText(findings, "SKILL.md", skill, /prominent decorative line[\s\S]+perceptible role[\s\S]+remove or redesign/i, "prominent decorative elements must have a perceptible product or continuity role");
  requireText(findings, "SKILL.md", skill, /reuse the same hero-grade image[\s\S]+visibly evolve in crop, state,[\s\S]+material, meaning, or interaction/i, "repeated hero-grade media must visibly transform or use a distinct composition");
  requireText(findings, "references/CREATIVE_DIRECTION.md", contents.get("references/CREATIVE_DIRECTION.md") ?? "", /independence test/i, "must include a reference-independence test");

  for (const choice of ["Recommended", "Efficient", "Showcase"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `missing concise ${choice} approach`);
  requireText(findings, "PLAN.md", plan, /show detailed plan/i, "must offer detail on request");
  requireText(findings, "PLAN.md", plan, /editable Experience Map[\s\S]*use Dreative's recommended approach/i, "must present and confirm the recommended section journey");
  requireText(findings, "PLAN.md", plan, /second approval/i, "must avoid a second approval gate");
  for (const choice of ["References", "Treatments", "Sourced images", "Generated images", "Packages", "Prototype", "Review depth", "Fast", "Lean", "Full Audit"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `detailed planning is missing ${choice}`);
  requireText(findings, "PLAN.md", plan, /no minimum technology\s+count/i, "Showcase must not use a technology-count proxy");
  requireText(findings, "PLAN.md", plan, /connected experience system[\s\S]*non-adjacent regions[\s\S]*pre-peak[\s\S]*central peak[\s\S]*post-peak/i, "Showcase must require shared continuity around the central peak");
  requireText(findings, "PLAN.md", plan, /visibly and structurally distinct from Recommended/i, "Showcase must remain visibly distinct from Recommended");
  requireText(findings, "PLAN.md", plan, /Showcase implementation attempted:[\s\S]*Independent visual verdict:\s*awaiting user review[\s\S]*ask the user/i, "Showcase must reserve the visual verdict for the user");
  requireText(findings, "PLAN.md", plan, /Not pursued:/i, "Showcase must disclose material rejected or replaced treatments");
  requireText(findings, "PLAN.md", plan, /cheap (?:visual|concept).+boards[\s\S]*production-like[\s\S]*second coded prototype only/i, "Showcase must select a cheap treatment before one production-like prototype and make a second coded build conditional");
  requireText(findings, "SKILL.md", skill, /DOGFOOD_LESSONS\.md[\s\S]*never promote a same-run proposal to validated/i, "dogfood changes must preserve the persistent learning protocol");
  requireText(findings, "references/DOGFOOD_LESSONS.md", contents.get("references/DOGFOOD_LESSONS.md") ?? "", /proposed[\s\S]*validated[\s\S]*rejected[\s\S]*superseded/i, "dogfood lessons must preserve explicit evidence states");
  requireText(findings, "PLAN.md", plan, /ask the user to\s+select one/i, "selected treatments must pause for explicit user selection");
  requireText(findings, "PLAN.md", plan, /selectedBy[\s\S]{0,24}user/i, "prototype evidence must record user selection");
  requireText(findings, "PLAN.md", plan, /Every substantial final handoff[\s\S]*human taste verdict:\s*awaiting user review/i, "substantial design work must reserve taste acceptance for the user");
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
