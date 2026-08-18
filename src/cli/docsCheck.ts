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
  // Showcase and the evaluator handoff were lifted out of SKILL.md on 2026-08-16 so
  // that Recommended and Efficient runs stop paying to read them. The contracts are
  // unchanged; only the file that has to hold them moved.
  const showcase = contents.get("references/SHOWCASE.md") ?? "";
  const evaluation = contents.get("references/EVALUATION_HANDOFF.md") ?? "";
  const refinement = contents.get("references/VISUAL_REFINEMENT.md") ?? "";
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
  requireText(findings, "references/SHOWCASE.md", showcase, /shared-state continuity[\s\S]*authored-sequence continuity[\s\S]*before\/peak\/after/i, "must support state or authored-sequence Showcase continuity");
  requireText(findings, "references/SHOWCASE.md", showcase, /Recommended baseline[\s\S]*two perceptible[\s\S]*media opportunities/i, "Showcase must bind its delta and product-native media decision");
  requireText(findings, "references/SHOWCASE.md", showcase, /journey[\s\S]*scroll-authored\s+choreography only when[\s\S]*Smooth scrolling[\s\S]*does not qualify/i, "journey-style Showcase must use scroll choreography only when the treatment requires it");
  requireText(findings, "SKILL.md", skill, /exemplars\/SLOP\.md/, "must route the visual system through the slop catalogue");
  requireText(findings, "SKILL.md", skill, /exemplars\/PRINCIPLES\.md/, "must route the visual system through positive principles, not only the slop catalogue");
  requireText(findings, "SKILL.md", skill, /calmer and faster|damaged by it/i, "must allow restraint as a first-class direction");
  requireText(findings, "references/SHOWCASE.md", showcase, /desktop[\s\S]*390px[\s\S]*320px mobile[\s\S]*text[\s\S]*collisions/i, "Showcase must exercise desktop, 390px, and 320px mechanisms and sample collisions");
  requireText(findings, "SKILL.md", skill, /hero, Peak, and[\s\S]*post-Peak[\s\S]*external media[\s\S]*procedural/i, "Showcase must make external-first focal asset decisions across the route");
  // Fabricated product imagery was the sharpest single complaint in blind
  // review, in both arms. "Evaluate external media" is only actionable if the
  // builder is told where to look.
  requireText(findings, "SKILL.md", skill, /Go and look at real pages, and at real images and icons[\s\S]*whole pages, not components[\s\S]*godly\.website/i, "must send scouting at whole shipped pages rather than component galleries");
  requireText(findings, "SKILL.md", skill, /MEDIA_SOURCES\.md/, "must route focal media to concrete sources rather than only requiring that external options be evaluated");
  requireText(findings, "references/MEDIA_SOURCES.md", contents.get("references/MEDIA_SOURCES.md") ?? "", /router, not a library[\s\S]*no bundled assets/i, "media sources must stay a router; bundling assets recreates the averaging failure");
  requireText(findings, "references/MEDIA_SOURCES.md", contents.get("references/MEDIA_SOURCES.md") ?? "", /licence covers your use[\s\S]*subject is truthful[\s\S]*attribute it/i, "media sources must require licence, truthfulness, and attribution checks before use");
  // A realistic subject faked out of gradients has cost more verdicts than any
  // other single defect, and it is the failure the 3D specialist exists to route
  // around rather than dress up.
  requireText(findings, "exemplars/SLOP.md", contents.get("exemplars/SLOP.md") ?? "", /## \d+\. The fabricated prop[\s\S]*does not read as the thing it is named/i, "the slop catalogue must name the fabricated realistic prop");
  const threeD = contents.get("skills/3d.md") ?? "";
  requireText(findings, "skills/3d.md", threeD, /Where the object comes from[\s\S]*licensed or CC0 model[\s\S]*MEDIA_SOURCES\.md/i, "the 3D specialist must route the object to a real source before geometry");
  requireText(findings, "skills/3d.md", threeD, /Lighting and material are the work/i, "the 3D specialist must treat lighting and material as the actual difficulty");
  // Was: assert the file says "prefer pre-rendered, reserve live WebGL". That
  // pinned a default into a build gate, so the one file meant to enable
  // ambitious spatial work could only ever argue against it. The property worth
  // holding is that the two mediums are presented as a decision with stated
  // costs — not which way the decision goes. (2026-08-17)
  requireText(findings, "skills/3d.md", threeD, /Choosing live or pre-rendered[\s\S]*Neither is the safe choice/i, "the 3D specialist must present live and pre-rendered as a deliberate choice, not a default");
  requireText(findings, "skills/3d.md", threeD, /Photo-to-3D reconstruction is not an available capability/i, "the 3D specialist must name photo-to-3D as a capability gap rather than an attempt");
  requireText(findings, "SKILL.md", skill, /reference mode[\s\S]*none[\s\S]*supplied[\s\S]*scout[\s\S]*traceable/i, "Showcase reference scouting must be explicit and traceable");
  requireText(findings, "references/SHOWCASE.md", showcase, /identity channel[\s\S]*visible media or a computed[\s\S]*distinct rendered values/i, "focal product identity must bind to rendered uniqueness evidence");
  // Positive requirements. The one that survived the 2026-08-16 cut is the
  // interaction baseline: it is the only one a blind reviewer ever responded to.
  requireText(findings, "SKILL.md", skill, /## Distinctiveness[\s\S]*could not be lifted onto a competitor/i, "must keep distinctiveness as a goal the builder owns");
  requireText(findings, "SKILL.md", skill, /## Distinctiveness[\s\S]*This is a goal, not a quota/i, "distinctiveness must not become a quota again");
  requireText(findings, "SKILL.md", skill, /## Motion[\s\S]*interaction baseline is required on every profile, Efficient included/i, "must require the pervasive interaction baseline on every profile");
  requireText(findings, "SKILL.md", skill, /## Motion[\s\S]*Reveals must complete while the region is on screen/i, "must require reveals to resolve inside the viewport");
  requireText(findings, "SKILL.md", skill, /## Ambition is resolution, not element count[\s\S]*delete one and see whether the section got worse/i, "must price density without measuring it");
  requireText(findings, "SKILL.md", skill, /There are no taste advisories left/i, "must state that the taste-advisory tier is gone");
  requireText(findings, "SKILL.md", skill, /## Ambition is capped by what you can verify[\s\S]*executed\s+wrong loses to a plain one executed right/i, "must cap ambition by what the build can actually verify");
  requireText(findings, "SKILL.md", skill, /A check earns its place only[\s\S]*had not been used to invent the check/i, "must keep the enforcement freeze that ended the loophole-closing loop");
  requireText(findings, "references/SHOWCASE.md", showcase, /no field for\s*your own account of your process[\s\S]*non-empty string is not evidence/i, "must state that builder-authored prose is not evidence");
  requireText(findings, "SKILL.md", skill, /VISUAL_REFINEMENT\.md/, "must route completion through the rendered screenshot correction loop");
  requireText(findings, "references/VISUAL_REFINEMENT.md", refinement, /preflight --probe-browser.*preview-url/i, "must require launch plus preview-navigation evidence before browser verification");
  requireText(findings, "SKILL.md", skill, /\.dreative\/context\.json/, "must preserve durable project memory");
  requireText(findings, "SKILL.md", skill, /\.dreative\/evaluation\/README\.md/, "must preserve opt-in evaluator routing");
  requireText(findings, "references/EVALUATION_HANDOFF.md", evaluation, /never hidden chain-of-thought/i, "must keep evaluator records free of hidden reasoning");
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
  requireText(findings, "PLAN.md", plan, /Stage 3: removed[\s\S]*Do not reintroduce a section-table gate/i, "must record that the Experience Map gate was removed, not quietly drop it");
  requireText(findings, "PLAN.md", plan, /Do not generate another\s+approval or contract gate/i, "must avoid a second approval gate");
  for (const choice of ["References", "Treatments", "Sourced images", "Generated images", "Packages", "Prototype", "Review depth", "Fast", "Lean", "Full Audit"])
    requireText(findings, "PLAN.md", plan, new RegExp(`\\b${choice}\\b`, "i"), `detailed planning is missing ${choice}`);
  requireText(findings, "PLAN.md", plan, /no minimum technology\s+count/i, "Showcase must not use a technology-count proxy");
  requireText(findings, "PLAN.md", plan, /connected experience system[\s\S]*non-adjacent regions[\s\S]*pre-peak[\s\S]*central peak[\s\S]*post-peak/i, "Showcase must require shared continuity around the central peak");
  requireText(findings, "PLAN.md", plan, /visibly and structurally distinct from Recommended/i, "Showcase must remain visibly distinct from Recommended");
  requireText(findings, "PLAN.md", plan, /Showcase implementation attempted:[\s\S]*Independent visual verdict:\s*awaiting user review[\s\S]*ask the user/i, "Showcase must reserve the visual verdict for the user");
  requireText(findings, "PLAN.md", plan, /Not pursued:/i, "Showcase must disclose material rejected or replaced treatments");
  requireText(findings, "references/SHOWCASE.md", showcase, /Triggers may be scroll[\s\S]*time[\s\S]*media playback[\s\S]*route transition/i, "cinematic mechanisms must support honest non-interactive triggers");
  requireText(findings, "references/SHOWCASE.md", showcase, /When the route compares items[\s\S]*reads as repeated cards/i, "comparison verification must be explicitly conditional");
  requireText(findings, "SKILL.md", skill, /DOGFOOD_LESSONS\.md[\s\S]*never promote a same-run proposal to validated/i, "dogfood changes must preserve the persistent learning protocol");
  requireText(findings, "references/DOGFOOD_LESSONS.md", contents.get("references/DOGFOOD_LESSONS.md") ?? "", /proposed[\s\S]*validated[\s\S]*rejected[\s\S]*superseded/i, "dogfood lessons must preserve explicit evidence states");
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
