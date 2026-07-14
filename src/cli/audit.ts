import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateDecisionLedger,
  validateDesignEquityBaseline,
  validatePlan,
  validatePreservationManifest,
  validateVerificationReport,
  validateVisualCheckpoint,
  type DesignEquityBaseline,
  type DirectDesignPlan,
  type PreservationManifest,
  type VerificationReport,
  type VisualCheckpoint,
} from "../shared/artifacts.js";
import { resolveSkillDependencies, type SpecialistSkill } from "../shared/skillSystem.js";
import {
  validateRuleControls,
  type ReflexFontRegistry,
  type RuleRegistry,
} from "../shared/ruleSystem.js";

export interface AuditFinding {
  level: "error" | "warning";
  check: string;
  message: string;
}

export interface AuditReport {
  ok: boolean;
  findings: AuditFinding[];
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

const packagedSkillDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "skill", "dreative");

function loadRuleFiles(): { registry: RuleRegistry; reflexFonts: ReflexFontRegistry } {
  return {
    registry: readJson(path.join(packagedSkillDir, "references", "RULES.json")) as RuleRegistry,
    reflexFonts: readJson(path.join(packagedSkillDir, "references", "REFLEX_FONTS.json")) as ReflexFontRegistry,
  };
}

function finding(level: AuditFinding["level"], check: string, message: string): AuditFinding {
  return { level, check, message };
}

function checkArtifact(file: string, check: string, validate: (value: unknown) => string[]): AuditFinding[] {
  if (!fs.existsSync(file)) return [finding("error", check, `missing ${path.basename(file)}`)];
  try {
    return validate(readJson(file)).map((message) => finding("error", check, message));
  } catch (error) {
    return [finding("error", check, `cannot parse ${path.basename(file)}: ${String(error)}`)];
  }
}

function checkPreservation(projectDir: string, manifestFile: string): AuditFinding[] {
  const findings = checkArtifact(manifestFile, "preservation", validatePreservationManifest);
  if (findings.some((item) => item.level === "error")) return findings;
  const manifest = readJson(manifestFile) as PreservationManifest;
  for (const item of manifest.items) {
    if (item.intentionallyChanged) continue;
    const target = path.resolve(projectDir, item.file);
    if (!target.startsWith(path.resolve(projectDir) + path.sep)) {
      findings.push(finding("error", "preservation", `${item.id}: file escapes the project root`));
      continue;
    }
    if (!fs.existsSync(target)) {
      findings.push(finding("error", "preservation", `${item.id}: missing ${item.file}`));
      continue;
    }
    if (!fs.readFileSync(target, "utf-8").includes(item.needle))
      findings.push(finding("error", "preservation", `${item.id}: expected content is absent from ${item.file}`));
  }
  return findings;
}

function checkSkillClosure(plan: DirectDesignPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const requested = plan.skills as SpecialistSkill[];
  const missing = resolveSkillDependencies(requested).filter((skill) => !requested.includes(skill));
  if (missing.length) findings.push(finding("error", "skills", `missing required skill dependencies: ${missing.join(", ")}`));
  for (const page of plan.pages) {
    const pageMissing = resolveSkillDependencies(page.skills).filter((skill) => !page.skills.includes(skill));
    if (pageMissing.length)
      findings.push(finding("error", "skills", `${page.name} is missing dependencies: ${pageMissing.join(", ")}`));
  }
  return findings;
}

function checkAssets(projectDir: string, plan: DirectDesignPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  for (const page of plan.pages) {
    for (const section of page.sections) {
      for (const asset of section.assets) {
        if (asset.status !== "shipped") continue;
        const target = path.resolve(projectDir, asset.path);
        if (!target.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(target))
          findings.push(finding("error", "assets", `${page.name}/${section.name}/${asset.id}: shipped asset missing at ${asset.path}`));
      }
    }
  }
  return findings;
}

function checkAntiSlopPlan(plan: DirectDesignPlan): AuditFinding[] {
  if (plan.version !== 3 && plan.version !== 4) return [];
  const findings: AuditFinding[] = [];
  const signatures = new Map<string, string[]>();
  for (const page of plan.pages) {
    const signature = page.sections.map((section) => section.layoutFamily.trim().toLowerCase()).join(" > ");
    signatures.set(signature, [...(signatures.get(signature) ?? []), page.name]);
    const cardSections = page.sections.filter((section) => /\b(card|tile)\b/i.test(section.layoutFamily));
    if (cardSections.length > 2) findings.push(finding("warning", "anti-slop", `${page.name}: repeated card-family sections need an explicit page-specific rationale`));
    if (page.sections.some((section) => /^\s*stack(?:ed)?(?:\s+vertically)?[.!]?\s*$/i.test(section.mobile)))
      findings.push(finding("error", "anti-slop", `${page.name}: a section uses stack-only mobile translation`));
    if (page.register === "task-transaction") {
      const first = page.mobileBlueprint?.contentOrder?.[0] ?? "";
      if (/\b(promo|decorative|hero|story)\b/i.test(first)) findings.push(finding("error", "anti-slop", `${page.name}: promotional or decorative content precedes the primary mobile task`));
    }
    for (const section of page.sections) {
      if (/\b(testimonial|review)\b/i.test(section.name) && !/\b(state|task|concept|product|brand|evidence|decision)\b/i.test([section.layoutFamily, ...section.interactions].join(" ")))
        findings.push(finding("warning", "anti-slop", `${page.name}/${section.name}: generic social-proof section appears detached from the page concept`));
    }
  }
  for (const [signature, pages] of signatures) {
    if (signature && pages.length > 1) findings.push(finding("warning", "anti-slop", `${pages.join(", ")}: unrelated routes repeat the same section-layout shell (${signature})`));
  }
  const compositions = plan.coherence?.pageSpecificCompositions ?? [];
  if (compositions.length > 1 && new Set(compositions.map((item) => `${item.register}:${item.taskModel.trim().toLowerCase()}`)).size === 1)
    findings.push(finding("warning", "anti-slop", "all pages were assigned the same register and task model; verify that composition was not copied mechanically"));
  return findings;
}

const SOURCE_EXTENSIONS = new Set([".tsx", ".jsx", ".vue", ".svelte", ".html", ".css", ".scss"]);
const SKIP_DIRS = new Set([".git", ".dreative", "node_modules", "dist", "build", ".next", ".nuxt"]);

function collectSourceFiles(root: string, current = root): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...collectSourceFiles(root, absolute));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
}

function checkStaticQuality(projectDir: string, plan: DirectDesignPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const files = collectSourceFiles(projectDir);
  let combined = "";
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    combined += `\n${source}`;
    const relative = path.relative(projectDir, file);
    for (const match of source.matchAll(/<img\b([^>]*?)>/gis)) {
      const attributes = match[1];
      if (!/\balt\s*=/.test(attributes)) findings.push(finding("error", "accessibility", `${relative}: image is missing alt`));
      if (!/\b(width|height)\s*=/.test(attributes) && !/\baspect-/.test(attributes))
        findings.push(finding("warning", "layout", `${relative}: image has no explicit dimensions or aspect token`));
    }
    if (/<(?:div|span)\b[^>]*\bonClick\s*=/is.test(source) && !/\b(role|tabIndex|onKeyDown)\s*=/is.test(source))
      findings.push(finding("warning", "accessibility", `${relative}: non-semantic click target may lack keyboard support`));
    if (/outline\s*:\s*none|outline-none/.test(source) && !/focus-visible/.test(source))
      findings.push(finding("warning", "accessibility", `${relative}: focus outline is removed without a visible replacement`));
    if (/href\s*=\s*["']#["']/.test(source)) findings.push(finding("warning", "navigation", `${relative}: placeholder href="#" remains`));
  }
  if (plan.skills.some((skill) => ["motion", "3d", "immersive", "cinematic", "experimental"].includes(skill))) {
    if (!/prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(combined))
      findings.push(finding("error", "motion", "selected effects require an implemented reduced-motion path"));
  }
  return findings;
}

function checkVerificationProof(projectDir: string, verificationFile: string): AuditFinding[] {
  if (!fs.existsSync(verificationFile)) return [];
  let report: VerificationReport;
  try {
    report = readJson(verificationFile) as VerificationReport;
  } catch {
    return [];
  }
  const findings: AuditFinding[] = [];
  for (const item of report.evidence ?? []) {
    const proof = item.proof;
    if (!proof) continue;
    if (proof.artifactPath) {
      const target = path.resolve(projectDir, proof.artifactPath);
      if (!target.startsWith(path.resolve(projectDir) + path.sep))
        findings.push(finding("error", "verification", `${item.id}: artifact path escapes the project root`));
      else if (!fs.existsSync(target))
        findings.push(finding("error", "verification", `${item.id}: evidence artifact is missing at ${proof.artifactPath}`));
    }
    if (proof.viewport && (proof.viewport.width <= 0 || proof.viewport.height <= 0 || (proof.viewport.dpr ?? 1) <= 0))
      findings.push(finding("error", "verification", `${item.id}: viewport dimensions and DPR must be positive`));
    if (typeof proof.averageFps === "number" && proof.averageFps <= 0)
      findings.push(finding("error", "verification", `${item.id}: averageFps must be positive`));
    if (typeof proof.maxFrameTimeMs === "number" && proof.maxFrameTimeMs < 0)
      findings.push(finding("error", "verification", `${item.id}: maxFrameTimeMs cannot be negative`));
  }
  return findings;
}

export function checkVerificationCoverage(plan: DirectDesignPlan, report: VerificationReport): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (plan.version !== 3 && plan.version !== 4) return findings;
  if ((plan.version === 3 && report.version !== 2) || (plan.version === 4 && report.version !== 3)) return [finding("error", "migration", `${plan.version === 4 ? "v4" : "v3"} plans require verify.json version ${plan.version === 4 ? "3" : "2"}`)];
  const passing = report.evidence.filter((item) => item.status === "pass");
  for (const page of plan.pages) {
    for (const viewportClass of ["desktop", "mobile", "narrow-mobile"] as const) {
      if (!passing.some((item) => item.pageId === page.id && item.viewportClass === viewportClass && item.proof?.viewport))
        findings.push(finding("error", "verification", `${page.name}: missing passing ${viewportClass} evidence with an exact viewport`));
    }
    if ((plan.depth === "restructure" || plan.depth === "reimagine") && !passing.some((item) => item.pageId === page.id && item.kind === "structural-depth"))
      findings.push(finding("error", "verification", `${page.name}: missing structural-depth evidence against its structural delta`));
    if (!passing.some((item) => item.pageId === page.id && item.kind === "preservation"))
      findings.push(finding("error", "verification", `${page.name}: missing preservation evidence`));
    for (const check of page.mobileBlueprint?.verificationChecks ?? []) {
      if (!passing.some((item) => item.pageId === page.id && (item.viewportClass === "mobile" || item.viewportClass === "narrow-mobile") && item.mobileChecks?.includes(check)))
        findings.push(finding("error", "verification", `${page.name}: missing mobile evidence for ${check}`));
    }
    for (const section of page.sections) {
      for (const criterion of section.verification) {
        if (typeof criterion === "string") {
          findings.push(finding("error", "verification", `${page.name}/${section.name}: modern criteria must be typed objects, not strings`));
          continue;
        }
        for (const viewport of criterion.viewports) {
          const match = passing.find((item) =>
            item.criterionId === criterion.id &&
            item.pageId === criterion.pageId &&
            item.sectionId === criterion.sectionId &&
            item.kind === criterion.kind &&
            item.viewportClass === viewport);
          if (!match) findings.push(finding("error", "verification", `${page.name}/${section.name}: no passing ${viewport} evidence is associated with criterion ${criterion.id}`));
        }
      }
    }
  }
  return findings;
}

export function checkRedesignQualityArtifacts(projectDir: string, plan: DirectDesignPlan, report: VerificationReport | undefined): AuditFinding[] {
  if (plan.version !== 4 || plan.scope !== "substantial") return [];
  const findings: AuditFinding[] = [];
  if (!plan.approval || plan.approval.status !== "approved" || !plan.approval.approvedAt || !plan.implementationStartedAt || Date.parse(plan.implementationStartedAt) <= Date.parse(plan.approval.approvedAt))
    findings.push(finding("error", "approval", "substantial implementation began without final recorded approval, or implementationStartedAt is not later than approval"));
  if (plan.projectKind !== "redesign") return findings;
  const equityFile = path.resolve(projectDir, plan.designEquity ?? ".dreative/design-equity.json");
  findings.push(...checkArtifact(equityFile, "design-equity", validateDesignEquityBaseline));
  const checkpointFile = path.resolve(projectDir, plan.checkpoint ?? ".dreative/checkpoint.json");
  if (plan.depth === "restructure" || plan.depth === "reimagine") findings.push(...checkArtifact(checkpointFile, "checkpoint", validateVisualCheckpoint));
  if (findings.some((item) => item.level === "error")) return findings;
  const equity = readJson(equityFile) as DesignEquityBaseline;
  const checkpoint = (plan.depth === "restructure" || plan.depth === "reimagine") ? readJson(checkpointFile) as VisualCheckpoint : undefined;
  const evidence = new Map((report?.evidence ?? []).map((item) => [item.id, item]));
  for (const screenshot of [...equity.screenshots.desktop, ...equity.screenshots.mobile, ...(checkpoint ? [...checkpoint.baselineScreenshotPaths, ...checkpoint.screenshotPaths.desktop, ...checkpoint.screenshotPaths.mobile] : [])]) {
    const target = path.resolve(projectDir, screenshot);
    if (!target.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(target)) findings.push(finding("error", "visual-evidence", `referenced screenshot is missing: ${screenshot}`));
  }
  for (const item of equity.items) {
    if (item.finalEvidenceIds.length === 0) findings.push(finding("error", "design-equity", `${item.id}: final evidence is required`));
    for (const id of item.finalEvidenceIds) {
      const proof = evidence.get(id);
      if (!proof || proof.status !== "pass" || proof.kind !== "design-equity") findings.push(finding("error", "design-equity", `${item.id}: missing passing design-equity evidence ${id}`));
    }
    if (item.decision === "intentionally-remove" && !item.removalApprovalReference && item.finalEvidenceIds.length === 0)
      findings.push(finding("error", "design-equity", `${item.id}: removal needs a demonstrably stronger replacement or explicit approval`));
  }
  for (const refinement of checkpoint?.refinements ?? []) for (const id of refinement.evidenceIds) {
    const proof = evidence.get(id);
    if (!proof || proof.status !== "pass") findings.push(finding("error", "checkpoint", `checkpoint refinement references missing or failing evidence ${id}`));
  }
  if (!report || report.version !== 3 || !report.perceptualComparison) findings.push(finding("error", "perceptual-comparison", "redesigns require verify.json v3 with a grounded before/after perceptual comparison"));
  else {
    const comparison = report.perceptualComparison;
    for (const id of [...comparison.baselineEvidenceIds, ...comparison.finalEvidenceIds, ...comparison.signatureEvidenceIds]) {
      const proof = evidence.get(id);
      if (!proof || proof.status !== "pass") findings.push(finding("error", "perceptual-comparison", `missing passing comparison evidence ${id}`));
    }
    for (const id of [...comparison.baselineEvidenceIds, ...comparison.finalEvidenceIds]) {
      const proof = evidence.get(id);
      if (proof && (!proof.proof?.artifactPath || !["visual-regression", "perceptual-comparison"].includes(proof.kind ?? ""))) findings.push(finding("error", "perceptual-comparison", `${id}: before/after comparison evidence must reference an actual screenshot and use a perceptual evidence kind`));
    }
    if (!comparison.signatureEvidenceIds.some((id) => evidence.get(id)?.kind === "concept-fidelity")) findings.push(finding("error", "concept-fidelity", "the selected signature has no visible concept-fidelity evidence"));
    for (const item of equity.items) if (!comparison.equityDecisionEvidence.some((entry) => entry.equityId === item.id && entry.evidenceIds.length > 0)) findings.push(finding("error", "perceptual-comparison", `${item.id}: comparison does not associate final evidence`));
    if (comparison.weaknesses.length > 0 && comparison.refinementEvidenceIds.length === 0 && !comparison.explicitApprovalReference) findings.push(finding("error", "perceptual-comparison", "identified regressions must be refined or explicitly approved"));
  }
  if (checkpoint && report && Date.parse(checkpoint.capturedAt) >= Date.parse(report.generatedAt)) findings.push(finding("error", "checkpoint", "the visual checkpoint must occur before final verification"));
  return findings;
}

export function runDirectDesignAudit(projectDir: string): AuditReport {
  const root = path.join(projectDir, ".dreative");
  const planFile = path.join(root, "plan.json");
  const findings = checkArtifact(planFile, "plan", validatePlan);
  if (!fs.existsSync(planFile) || findings.some((item) => item.level === "error"))
    return { ok: false, findings };

  const plan = readJson(planFile) as DirectDesignPlan;
  const preservationFile = path.resolve(projectDir, plan.preservationManifest);
  const ledgerFile = path.resolve(projectDir, plan.decisionLedger);
  const verificationFile = path.join(root, "verify.json");
  findings.push(...checkPreservation(projectDir, preservationFile));
  findings.push(...checkArtifact(ledgerFile, "ledger", validateDecisionLedger));
  findings.push(...checkArtifact(verificationFile, "verification", validateVerificationReport));
  findings.push(...checkVerificationProof(projectDir, verificationFile));
  const verification = fs.existsSync(verificationFile) ? (readJson(verificationFile) as VerificationReport) : undefined;
  if (plan.version !== 4 || plan.doctrineVersion !== 4) {
    findings.push(finding("warning", "migration", "legacy v2/v3 plan accepted for compatibility only; migrate to plan v4 and verify v3 for approval, design-equity, creative-parity, checkpoint, and perceptual-comparison guarantees"));
  } else {
    try {
      const { registry, reflexFonts } = loadRuleFiles();
      for (const message of validateRuleControls(plan, registry, reflexFonts, verification))
        findings.push(finding("error", "rules", message));
    } catch (error) {
      findings.push(finding("error", "rules", `cannot load rule registries: ${String(error)}`));
    }
  }
  findings.push(...checkSkillClosure(plan));
  findings.push(...checkAssets(projectDir, plan));
  findings.push(...checkAntiSlopPlan(plan));
  findings.push(...checkStaticQuality(projectDir, plan));
  if (verification) findings.push(...checkVerificationCoverage(plan, verification));
  findings.push(...checkRedesignQualityArtifacts(projectDir, plan, verification));

  if (plan.version === 2) {
    const verifyText = verification ? JSON.stringify(verification) : "";
    for (const page of plan.pages) for (const section of page.sections) for (const criterion of section.verification) {
      const text = typeof criterion === "string" ? criterion : criterion.claim;
      if (!verifyText.includes(text)) findings.push(finding("warning", "verification", `${page.name}/${section.name}: no legacy evidence references criterion: ${text}`));
    }
  }
  return { ok: !findings.some((item) => item.level === "error"), findings };
}

export function printAudit(report: AuditReport, json: boolean) {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (report.findings.length === 0) console.log("Dreative audit passed with no findings.");
  for (const item of report.findings) console.log(`${item.level === "error" ? "ERROR" : "WARN "} [${item.check}] ${item.message}`);
  console.log(report.ok ? "Dreative audit passed." : "Dreative audit failed.");
}
