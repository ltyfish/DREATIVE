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
import { validateCriticArtifact, validateCriticInput, validateVisualCriticReport, type CriticArtifact, type CriticInput, type VisualCriticReport } from "../shared/critic.js";
import {
  validateRuleControls,
  type ReflexFontRegistry,
  type RuleRegistry,
} from "../shared/ruleSystem.js";
import { motionIsSelected, validateMotionCheckpoint, validateMotionExecution } from "../shared/motionSystem.js";
import { resolveWorkflowConfiguration, resolveWorkflowPolicy, shouldCreatePrototype, type InteractionRisk } from "../shared/workflow.js";
import { checkBuildFreshness, checkExecutionContracts, checkLegacyAmbitiousRuntime, checkPolicyRecords, checkTemporalEvidence } from "./executionAudit.js";
import { PLAN_FILE, approvalStatus, readPlan, validateCanonicalPlan, type CanonicalPlan } from "../shared/planGovernance.js";
import { validateExperienceDelivery } from "../shared/experienceGates.js";
import { validateRuntimeObservationGrounding } from "../shared/runtimeEvidence.js";
import { hashFiles, sourceFiles } from "../shared/projectIdentity.js";
import { inspectTrustedArtifacts, sha256, validateTrustedRun } from "../shared/trustedRuns.js";
import { assuranceAtLeast, requiredAssurance, validateProvenance, validateProvenanceAssurance, validateProvenanceSource } from "../shared/assurance.js";
import { deriveDogfoodReport, validateWorkflowTrace } from "../shared/workflowTrace.js";

export interface AuditFinding {
  level: "error" | "warning";
  check: string;
  message: string;
}

export interface AuditReport {
  ok: boolean;
  findings: AuditFinding[];
}

function findTrustedManifest(projectDir: string, name: "trusted-verification.json" | "trusted-critic.json", runId?: string): string | null {
  const runs = path.join(projectDir, ".dreative", "runs");
  if (!fs.existsSync(runs)) return null;
  if (runId) {
    const exact = path.join(runs, runId, name);
    return fs.existsSync(exact) ? exact : null;
  }
  const files = fs.readdirSync(runs, { withFileTypes: true })
    .filter((item) => item.isDirectory()).map((item) => path.join(runs, item.name, name)).filter((item) => fs.existsSync(item));
  return files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] ?? null;
}

function checkSourceContracts(projectDir: string, plan: CanonicalPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const source = sourceFiles(projectDir).filter((item) => /\.(?:[cm]?[jt]sx?|html|css|vue|svelte)$/i.test(item))
    .map((item) => fs.readFileSync(path.join(projectDir, item), "utf8")).join("\n");
  const runtimeSource = sourceFiles(projectDir).filter((item) => /\.(?:[cm]?[jt]sx?|html|vue|svelte)$/i.test(item))
    .map((item) => fs.readFileSync(path.join(projectDir, item), "utf8")).join("\n");
  const mechanisms = plan.contract.mechanismContracts ?? [];
  for (const mechanism of mechanisms) {
    if (mechanism.inputDriver === "scroll-progress" && !/\b(?:onscroll|addEventListener\(\s*["']scroll|IntersectionObserver|ScrollTrigger|useScroll|scrollYProgress|scrollTimeline)\b/.test(runtimeSource))
      findings.push(finding("error", "source-reconciliation", `PLANNED_SCROLL_MECHANISM_MISSING: ${mechanism.id} in ${PLAN_FILE} has no scroll, observer or timeline implementation in application source`));
    if (mechanism.inputDriver === "scroll-progress" && /\bonClick\b|addEventListener\(\s*["']click/.test(source) && !/\b(?:scroll|IntersectionObserver|ScrollTrigger|useScroll)\b/.test(source))
      findings.push(finding("error", "source-reconciliation", `MATERIAL_MECHANISM_SUBSTITUTION: ${mechanism.id} scroll progress was replaced with click/button state`));
    if (/\bGSAP\b|\bgsap\b/.test(mechanism.dependency) && !/\bgsap\b/.test(source))
      findings.push(finding("error", "source-reconciliation", `PLANNED_RUNTIME_MISSING: ${mechanism.id} declares GSAP but no production import/use exists`));
    if (/\bCanvas\b/i.test(mechanism.catalogueSourceOrCustomRationale + mechanism.dependency) && !/<canvas\b|getContext\(\s*["']2d/.test(source))
      findings.push(finding("error", "source-reconciliation", `PLANNED_CANVAS_MISSING: ${mechanism.id} has no Canvas implementation`));
    if (/\bWebGL|three(?:\.js)?\b/i.test(mechanism.catalogueSourceOrCustomRationale + mechanism.dependency) && !/\bWebGL|THREE\.|from\s+["']three/.test(source))
      findings.push(finding("error", "source-reconciliation", `PLANNED_WEBGL_MISSING: ${mechanism.id} has no WebGL implementation`));
    if (/\bvideo\b/i.test(mechanism.catalogueSourceOrCustomRationale + mechanism.dependency) && !/<video\b|createElement\(\s*["']video/.test(source))
      findings.push(finding("error", "source-reconciliation", `PLANNED_VIDEO_MISSING: ${mechanism.id} has no video element or runtime asset consumer`));
  }
  if (mechanisms.length === 0) for (const mechanism of plan.contract.mechanismFallbacks ?? []) {
    const scrollPlanned = /\bscroll(?:-controlled|-progress| timeline)?\b/i.test(`${mechanism.id} ${mechanism.primaryImplementation}`);
    if (scrollPlanned && !/\b(?:onscroll|addEventListener\(\s*["']scroll|IntersectionObserver|ScrollTrigger|useScroll|scrollYProgress|scrollTimeline)\b/.test(runtimeSource))
      findings.push(finding("error", "source-reconciliation", `PLANNED_SCROLL_MECHANISM_MISSING: ${mechanism.id} in ${PLAN_FILE} has no scroll/observer/timeline implementation in application source`));
    if (scrollPlanned && /\b(?:button|onClick|setState|useState)\b/.test(runtimeSource))
      findings.push(finding("error", "source-reconciliation", `MATERIAL_MECHANISM_SUBSTITUTION: ${mechanism.id} is implemented through button/click state without approved revision and reapproval`));
  }
  const owner = plan.contract.continuityContract;
  if (owner && !source.includes(owner.sourceOwner))
    findings.push(finding("error", "source-reconciliation", `CONTINUITY_OWNER_NOT_SOURCE_OWNED: ${owner.sourceOwner} is not present in application source`));
  const promptFile = ["PROMPT.md", "prompt.md"].map((item) => path.join(projectDir, item)).find((item) => fs.existsSync(item));
  const prompt = promptFile ? fs.readFileSync(promptFile, "utf8") : "";
  if (/specifications (?:view|download|action)|specifications download or view/i.test(prompt)
    && !/(?:href|download|onClick|<button)[^\n>]{0,120}specification|specification[^\n<]{0,80}(?:button|download|view)/i.test(runtimeSource))
    findings.push(finding("error", "requirements", "MISSING_REQUIRED_FUNCTIONALITY: specifications view/download action from the prompt is absent"));
  if (/close and reopen the form|Escape-key handling for modals/i.test(prompt)
    && !/<dialog\b|role\s*=\s*["']dialog|aria-modal|(?:Escape|keydown)[\s\S]{0,200}(?:close|open)|(?:close|open)[A-Z]\w*(?:Dialog|Modal|Reservation)/i.test(runtimeSource))
    findings.push(finding("error", "requirements", "MISSING_REQUIRED_FUNCTIONALITY: reservation close/reopen and Escape behavior from the prompt are absent"));
  return findings;
}

function checkCertificationTrust(projectDir: string, plan: CanonicalPlan, verificationFile: string): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const strict = plan.contract.scope.substantial;
  if (strict) {
    if (!plan.approval.approvalMode || !plan.approval.approvalOrigin)
      findings.push(finding("error", "approval", "FAKE_HUMAN_APPROVAL: certification requires a recorded human or pre-authorized-dogfood origin"));
    if (!plan.execution.planSummaryShownAt
      || plan.execution.planReviewContractHash !== approvalStatus(plan).currentHash
      || (plan.approval.approvedAt && Date.parse(plan.execution.planSummaryShownAt) > Date.parse(plan.approval.approvedAt)))
      findings.push(finding("error", "approval", "EXECUTABLE_PLAN_REVIEW_NOT_SHOWN: the complete executable plan review must be shown without blockers before approval"));
    if (plan.approval.approvalMode === "human" && plan.approval.approvalOrigin !== "interactive-user")
      findings.push(finding("error", "approval", "FAKE_HUMAN_APPROVAL: approvedBy text is not proof of user-originated approval"));
    if (plan.approval.approvalMode === "pre-authorized-dogfood" && plan.contract.workflow.purpose !== "dreative-dogfood")
      findings.push(finding("error", "approval", "pre-authorized-dogfood cannot certify a human-reviewed project"));
    if (!plan.contract.sourceBaselineHashAtCreation || !plan.approval.approvedSourceBaselineHash)
      findings.push(finding("error", "approval-order", "IMPLEMENTATION_STARTED_BEFORE_PLAN_APPROVAL: source baselines are missing"));
  }
  for (const message of validateProvenance(plan.approval.provenance, plan.contract.createdAt))
    findings.push(finding("error", "approval-provenance", message));
  for (const message of validateProvenanceSource(projectDir, plan.approval.provenance))
    findings.push(finding("error", "approval-provenance", message));
  for (const message of validateProvenanceAssurance(projectDir, plan.approval.provenance))
    findings.push(finding("error", "approval-provenance", message));
  const requiredLevel = requiredAssurance(plan.contract.workflow.purpose);
  if (!assuranceAtLeast(plan.approval.provenance?.assuranceLevel ?? "local", requiredLevel))
    findings.push(finding("error", "approval-provenance", `APPROVAL_ASSURANCE_BLOCKED: ${plan.contract.workflow.purpose} requires ${requiredLevel} approval provenance`));
  if (strict && plan.contract.workflow.prototype === "required") {
    const gate = plan.execution.prototypeGate;
    if (!gate || !gate.verificationRunId || !gate.decidedAt || !["approved-for-integration", "fallback-approved", "mechanism-declined"].includes(gate.decision ?? ""))
      findings.push(finding("error", "prototype", "PROTOTYPE_GATE_INCOMPLETE: required prototype needs integrity-linked verification and a decision before integration"));
    if (gate?.verificationRunId) {
      const prototypeManifestFile = findTrustedManifest(projectDir, "trusted-verification.json", gate.verificationRunId);
      if (!prototypeManifestFile) findings.push(finding("error", "prototype", `PROTOTYPE_PROVENANCE_MISSING: ${gate.prototypeId} has no sealed browser run ${gate.verificationRunId}`));
      else {
        const prototypeManifest = readJson(prototypeManifestFile) as any;
        for (const message of validateTrustedRun(projectDir, "browser-verification", prototypeManifest)) findings.push(finding("error", "prototype", message));
        for (const message of inspectTrustedArtifacts(projectDir, prototypeManifest.artifacts ?? [])) findings.push(finding("error", "prototype", message));
      }
    }
    if (!plan.execution.firstMaterialSourceChangeAt)
      findings.push(finding("error", "prototype-order", "PROTOTYPE_ORDER_UNPROVEN: first material application-source change was not recorded"));
    else if (gate?.decidedAt && Date.parse(plan.execution.firstMaterialSourceChangeAt) <= Date.parse(gate.decidedAt))
      findings.push(finding("error", "prototype-order", "PROTOTYPE_CREATED_AFTER_FULL_IMPLEMENTATION: prototype decision did not precede implementation"));
  }
  const verification = fs.existsSync(verificationFile) ? readJson(verificationFile) as any : null;
  const trustedFile = findTrustedManifest(projectDir, "trusted-verification.json", verification?.runId);
  if (!trustedFile) {
    findings.push(finding("error", "evidence-provenance", "UNTRUSTED_PLAYWRIGHT_PROVENANCE: verification was not generated by `dreative verify`"));
    const suppliedTelemetry = (verification?.evidence ?? []).some((item: any) => {
      const proof = item.proof ?? {};
      return ["pixelDifferenceFromPrevious", "structuralDifferenceFromPrevious", "averageFps", "maxFrameTimeMs", "worstFrameTimeMs", "longTaskCount", "controlledProgress", "frameIndex", "mediaCurrentTime", "shaderUniforms", "particleState", "maskProgress"].some((key) => proof[key] !== undefined);
    }) || (plan.execution.runtimeObservations ?? []).some((item) => item.samples?.some((sample) => sample.pixelDifferenceFromPrevious !== undefined || sample.structuralDifferenceFromPrevious !== undefined));
    if (suppliedTelemetry) findings.push(finding("error", "evidence-provenance", "MODEL_AUTHORED_TELEMETRY_REJECTED: visual differences, progress and performance values require a sealed Dreative runner observation"));
  }
  else {
    const manifest = readJson(trustedFile) as any;
    for (const message of validateTrustedRun(projectDir, "browser-verification", manifest)) findings.push(finding("error", "evidence-provenance", message));
    for (const message of inspectTrustedArtifacts(projectDir, manifest.artifacts ?? [])) findings.push(finding("error", "evidence-artifact", message));
    if (manifest.approvedPlanHash !== approvalStatus(plan).currentHash) findings.push(finding("error", "evidence-provenance", "EVIDENCE_PLAN_HASH_MISMATCH: evidence run belongs to another plan"));
    const currentSource = hashFiles(projectDir, sourceFiles(projectDir));
    if (manifest.sourceHash !== currentSource) findings.push(finding("error", "evidence-provenance", "EVIDENCE_SOURCE_HASH_MISMATCH: evidence run belongs to another source tree"));
    if (!manifest.artifacts?.some((item: any) => item.type === "trace" || item.type === "recording"))
      findings.push(finding("error", "evidence-artifact", "TRUSTED_TEMPORAL_ARTIFACT_MISSING: JSON manifests cannot satisfy recording or trace requirements"));
    if (!manifest.artifacts?.some((item: any) => item.type === "screenshot"))
      findings.push(finding("error", "evidence-artifact", "TRUSTED_SCREENSHOT_MISSING: browser run produced no real image capture"));
    if (!manifest.captureManifest) findings.push(finding("error", "evidence-provenance", "EMPTY_BROWSER_ARRAYS_ARE_NOT_EVIDENCE: route monitoring and inspection manifest is missing"));
    if ((plan.contract.workflow.execution === "full-audit" || plan.contract.workflow.purpose !== "project-delivery") && manifest.verificationMode !== "production")
      findings.push(finding("error", "production-verification", "DEVELOPMENT_VERIFICATION_CANNOT_CERTIFY: final workflows require the exact production build and preview"));
    if (!assuranceAtLeast(manifest.assuranceLevel ?? "local", requiredLevel))
      findings.push(finding("error", "evidence-assurance", `EVIDENCE_ASSURANCE_BLOCKED: ${plan.contract.workflow.purpose} requires ${requiredLevel} browser evidence`));
  }
  const evidenceIds = new Set((verification?.evidence ?? []).filter((item: any) => item.status === "pass").map((item: any) => item.id));
  for (const requirement of plan.contract.requirementTraceability ?? []) {
    if (requirement.status !== "verified" || !evidenceIds.has(requirement.evidenceId))
      findings.push(finding("error", "requirements", `MISSING_REQUIRED_FUNCTIONALITY: ${requirement.id} (${requirement.wording}) lacks passing integrity-linked browser evidence ${requirement.evidenceId}`));
  }
  const criticFile = findTrustedManifest(projectDir, "trusted-critic.json", plan.execution.evidenceState?.criticRunId ?? undefined);
  if (!criticFile) findings.push(finding("error", "critic-independence", "BUILDER_AUTHORED_CRITIC: no sealed separate critic invocation exists"));
  else {
    const manifest = readJson(criticFile) as any;
    for (const message of validateTrustedRun(projectDir, "critic", manifest)) findings.push(finding("error", "critic-independence", message));
    for (const message of inspectTrustedArtifacts(projectDir, manifest.artifact ? [manifest.artifact] : [])) findings.push(finding("error", "critic-independence", message));
    if (manifest.approvedPlanHash !== approvalStatus(plan).currentHash) findings.push(finding("error", "critic-independence", "CRITIC_PLAN_HASH_MISMATCH: critic reviewed another plan"));
    if (manifest.sourceHash !== hashFiles(projectDir, sourceFiles(projectDir))) findings.push(finding("error", "critic-independence", "CRITIC_SOURCE_HASH_MISMATCH: critic reviewed another source tree"));
    const trustedVerificationFile = findTrustedManifest(projectDir, "trusted-verification.json", verification?.runId);
    const trustedVerification = trustedVerificationFile ? readJson(trustedVerificationFile) as any : null;
    if (manifest.verificationRunId !== verification?.runId || manifest.buildHash !== trustedVerification?.buildHash)
      findings.push(finding("error", "critic-provenance", "CRITIC_INPUT_HASH_MISMATCH: critic did not inspect the current verification run/build"));
    const certifyingMode = plan.contract.workflow.execution === "full-audit"
      || plan.contract.workflow.purpose === "dreative-dogfood"
      || plan.contract.workflow.purpose === "production-certification";
    if (certifyingMode && manifest.providerClass === "project-local-advisory")
      findings.push(finding("error", "critic-provider", "ADVISORY_CRITIC_CANNOT_CERTIFY"));
    if (!assuranceAtLeast(manifest.assuranceLevel ?? "local", requiredLevel))
      findings.push(finding("error", "critic-assurance", `CRITIC_ASSURANCE_BLOCKED: ${plan.contract.workflow.purpose} requires ${requiredLevel}`));
    if (!manifest.computedResult?.pass) findings.push(finding("error", "critic-result", "Dreative-computed critic result is not passing"));
    const canonicalCritic = path.join(projectDir, ".dreative", "critic.json");
    if (fs.existsSync(canonicalCritic)) {
      const report = (readJson(canonicalCritic) as any).report;
      if (report && sha256(JSON.stringify(report)) !== manifest.reportHash)
        findings.push(finding("error", "critic-independence", "CRITIC_OUTPUT_HASH_MISMATCH: canonical critic report differs from the sealed process output"));
    }
  }
  findings.push(...checkSourceContracts(projectDir, plan));
  return findings;
}

function runCanonicalPlanAudit(projectDir: string): AuditReport {
  const findings: AuditFinding[] = [];
  let plan: CanonicalPlan;
  try { plan = readPlan(projectDir); }
  catch (error) { return { ok: false, findings: [finding("error", "plan", String(error))] }; }
  for (const message of validateCanonicalPlan(plan)) findings.push(finding("error", "plan", `${PLAN_FILE}: ${message}`));
  const approval = approvalStatus(plan);
  if (!approval.approved) findings.push(finding("error", "approval", approval.drifted
    ? `approved contract drifted (${approval.approvedHash} -> ${approval.currentHash}); record a change request and re-approve`
    : "substantial implementation requires an approved contract"));
  for (const item of validateExperienceDelivery(plan)) findings.push(finding("error", item.check, item.message));
  const root = path.resolve(projectDir) + path.sep;
  for (const binding of plan.execution.bindings) {
    if (!plan.contract.selectedTreatments.includes(binding.treatment)) findings.push(finding("error", "runtime-binding", `${binding.id}: binds unselected treatment ${binding.treatment}`));
    if (binding.files.length === 0 || binding.selectors.length === 0 || binding.evidenceIds.length === 0) findings.push(finding("error", "runtime-binding", `${binding.id}: files, stable selectors and evidence are required`));
    for (const relative of binding.files) {
      const file = path.resolve(projectDir, relative);
      if (!file.startsWith(root) || !fs.existsSync(file)) findings.push(finding("error", "runtime-binding", `${binding.id}: missing implementation file ${relative}`));
    }
  }
  for (const treatment of plan.contract.selectedTreatments) {
    const allocation = plan.contract.treatmentAllocation.find((item) => item.treatment === treatment);
    if (!allocation || allocation.locations.length === 0 || allocation.contribution.trim().length < 12 || allocation.acceptance.length === 0)
      findings.push(finding("error", "treatment-allocation", `${treatment} needs concept-led locations, substantive contribution and acceptance criteria`));
    if (!plan.execution.bindings.some((item) => item.treatment === treatment) && !["ux", "mobile", "refined"].includes(treatment))
      findings.push(finding("error", "treatment-allocation", `${treatment} has no real implementation binding`));
  }
  const capabilities = new Map(plan.contract.capabilityPreflight?.creativeCapabilities.map((item) => [item.id, item]) ?? []);
  if (plan.contract.assetStrategy.some((item) => item.priority === "generated" && item.classification !== "model") && !["available", "available-through-confirmed-tool"].includes(capabilities.get("image-generation")?.status ?? ""))
    findings.push(finding("error", "capability-preflight", "the plan promises generated imagery but image-generation authoring is not available"));
  if (plan.contract.assetStrategy.some((item) => item.priority === "generated" && /video|footage/i.test(item.intendedRole)) && !["available", "available-through-confirmed-tool"].includes(capabilities.get("video-generation")?.status ?? ""))
    findings.push(finding("error", "capability-preflight", "the plan promises generated video but original video-generation authoring is not available"));
  if (plan.contract.assetStrategy.some((item) => item.priority === "generated" && item.classification === "model") && !["available", "available-through-confirmed-tool"].includes(capabilities.get("3d-model-generation")?.status ?? ""))
    findings.push(finding("error", "capability-preflight", "the plan promises a generated 3D model but no model-generation authoring tool is available; use the disclosed fallback ladder"));
  if (capabilities.get("threejs-runtime")?.status === "available" && capabilities.get("3d-model-generation")?.status === "available" && capabilities.get("3d-model-generation")?.detectionSource === "package-preflight")
    findings.push(finding("error", "capability-preflight", "Three.js runtime availability cannot be used as 3D model-generation evidence"));
  if (capabilities.get("ffmpeg-processing")?.status === "available" && capabilities.get("video-generation")?.detectionSource === "environment")
    findings.push(finding("error", "capability-preflight", "FFmpeg editing cannot be used as original video-generation evidence"));
  if (plan.execution.runtime?.competingOwners.length) findings.push(finding("error", "runtime-owner", `competing ticker/scroll/render owners: ${plan.execution.runtime.competingOwners.join(", ")}`));
  if (plan.execution.runtime?.packageTransactions.some((item) => item.status === "failed")) findings.push(finding("error", "runtime-install", "a runtime package transaction failed without a completed rollback/recovery"));
  const spread = plan.execution.checkpoints.adaptiveSpread;
  if (spread?.continuousRecordingRequired && spread.continuousRecordingEvidenceIds.length === 0) findings.push(finding("error", "critic", "Adaptive Spread requires one representative continuity recording for this mechanism"));
  if (spread?.mobileRecordingRequired && spread.mobileRecordingEvidenceIds.length === 0) findings.push(finding("error", "critic", "Adaptive Spread requires mobile recording because mobile choreography materially differs"));
  if (spread?.reverseScrollRequired && spread.reverseScrollEvidenceIds.length === 0) findings.push(finding("error", "critic", "Adaptive Spread requires reverse-scroll evidence for the declared reversible or lifecycle-sensitive mechanism"));
  if (plan.contract.workflow.purpose === "dreative-dogfood") {
    for (const message of validateWorkflowTrace(projectDir)) findings.push(finding("error", "workflow-trace", message));
    const dogfood = deriveDogfoodReport(projectDir);
    if (dogfood.planBypassDetected || dogfood.incorrectDefaultingDetected || dogfood.falsePositiveRiskDetected || dogfood.selfCertificationDetected)
      findings.push(finding("error", "dogfood", "Trace-derived Dogfood safety findings block completion"));
  }
  if (plan.execution.run) {
    const currentSourceHash = hashFiles(projectDir, sourceFiles(projectDir));
    if (plan.execution.run.sourceHash !== currentSourceHash) findings.push(finding("error", "run-identity", `evidence source hash ${plan.execution.run.sourceHash} does not match current source ${currentSourceHash}`));
    const runRoot = path.resolve(projectDir, ".dreative", "runs", plan.execution.run.runId);
    for (const file of plan.execution.run.evidenceFiles) {
      const absolute = path.resolve(projectDir, file);
      if (!absolute.startsWith(runRoot + path.sep) || !fs.existsSync(absolute)) findings.push(finding("error", "run-identity", `missing or cross-run evidence file: ${file}`));
    }
  }
  const verificationFile = plan.execution.run
    ? path.join(projectDir, ".dreative", "runs", plan.execution.run.runId, "verify.json")
    : path.join(projectDir, ".dreative", "verify.json");
  if (!fs.existsSync(verificationFile)) findings.push(finding("error", "verification", "missing verify.json for the current implementation"));
  else {
    findings.push(...checkArtifact(verificationFile, "verification", validateVerificationReport));
    findings.push(...checkVerificationProof(projectDir, verificationFile));
    try {
      const verification = readJson(verificationFile) as VerificationReport;
      for (const item of validateRuntimeObservationGrounding(plan, verification))
        findings.push(finding("error", item.check, item.message));
    } catch {
      // Parsing errors are already reported by checkArtifact.
    }
  }
  findings.push(...checkCertificationTrust(projectDir, plan, verificationFile));
  return { ok: !findings.some((item) => item.level === "error"), findings };
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
  if (![3, 4, 5, 6].includes(plan.version)) return [];
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

export function checkVerificationProof(projectDir: string, verificationFile: string): AuditFinding[] {
  if (!fs.existsSync(verificationFile)) return [];
  let report: VerificationReport;
  try {
    report = readJson(verificationFile) as VerificationReport;
  } catch {
    return [];
  }
  const findings: AuditFinding[] = [];
  const checkTemporalArtifact = (itemId: string, artifactPath: string, label: string) => {
    const target = path.resolve(projectDir, artifactPath);
    if (!target.startsWith(path.resolve(projectDir) + path.sep)) {
      findings.push(finding("error", "motion-evidence", `${itemId}: ${label} path escapes the project root`));
      return;
    }
    if (!fs.existsSync(target)) {
      findings.push(finding("error", "motion-evidence", `${itemId}: ${label} is missing at ${artifactPath}`));
      return;
    }
    const stat = fs.statSync(target);
    if (!stat.isFile() || stat.size === 0) {
      findings.push(finding("error", "motion-evidence", `${itemId}: ${label} is empty or not a file at ${artifactPath}`));
      return;
    }
    const extension = path.extname(target).toLowerCase();
    if (label.includes("recording") && ![".webm", ".mp4"].includes(extension)) {
      findings.push(finding("error", "motion-evidence", `${itemId}: EVIDENCE_ARTIFACT_TYPE_MISMATCH recordingPath ${artifactPath} must be .webm or .mp4, not ${extension || "an extensionless file"}`));
      return;
    }
    if (label.includes("trace") && extension !== ".zip") {
      findings.push(finding("error", "motion-evidence", `${itemId}: EVIDENCE_ARTIFACT_TYPE_MISMATCH tracePath ${artifactPath} must be a supported .zip browser trace`));
      return;
    }
    const header = fs.readFileSync(target).subarray(0, 16);
    const validImage = extension === ".png" ? header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : [".jpg", ".jpeg"].includes(extension) ? header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
      : extension === ".webp" ? header.subarray(0, 4).toString() === "RIFF" && header.subarray(8, 12).toString() === "WEBP"
      : extension === ".gif" ? header.subarray(0, 4).toString() === "GIF8"
      : true;
    const validMedia = extension === ".mp4" ? header.subarray(4, 8).toString() === "ftyp"
      : extension === ".webm" ? header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
      : true;
    let validStructured = true;
    if ([".json", ".jsonl"].includes(extension)) {
      try { JSON.parse(fs.readFileSync(target, "utf-8")); } catch { validStructured = false; }
    }
    if (!validImage || !validMedia || !validStructured) findings.push(finding("error", "motion-evidence", `${itemId}: ${label} is obviously invalid at ${artifactPath}`));
  };
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
    const temporalPaths = [[proof.recordingPath, "recording artifact"], [proof.tracePath, "trace artifact"], [proof.captureManifestPath, "capture manifest"], [proof.controlledProgress !== undefined ? proof.artifactPath : undefined, "controlled-progress artifact"]] as const;
    for (const [temporalPath, label] of temporalPaths) if (temporalPath) checkTemporalArtifact(item.id, temporalPath, label);
    if (proof.viewport && (proof.viewport.width <= 0 || proof.viewport.height <= 0 || (proof.viewport.dpr ?? 1) <= 0))
      findings.push(finding("error", "verification", `${item.id}: viewport dimensions and DPR must be positive`));
    if (typeof proof.averageFps === "number" && proof.averageFps <= 0)
      findings.push(finding("error", "verification", `${item.id}: averageFps must be positive`));
    if (typeof proof.maxFrameTimeMs === "number" && proof.maxFrameTimeMs < 0)
      findings.push(finding("error", "verification", `${item.id}: maxFrameTimeMs cannot be negative`));
  }
  return findings;
}

function referencedAssetExists(projectDir: string, plan: DirectDesignPlan, reference: string): boolean {
  if (fs.existsSync(path.resolve(projectDir, reference))) return true;
  return plan.pages.some((page) => page.sections.some((section) => section.assets.some((asset) => asset.id === reference || asset.path === reference)));
}

export function checkMotionExecutionArtifacts(projectDir: string, plan: DirectDesignPlan, report?: VerificationReport): AuditFinding[] {
  if ((plan.version !== 5 && plan.version !== 6) || (plan.doctrineVersion !== 5 && plan.doctrineVersion !== 6)) return [];
  const findings = validateMotionExecution(plan, report).map((message) => finding("error", "motion-execution", message));
  const root = path.resolve(projectDir) + path.sep;
  for (const moment of plan.motionMoments ?? []) {
    const file = path.resolve(projectDir, moment.implementationFile);
    if (!file.startsWith(root) || !fs.existsSync(file)) findings.push(finding("error", "motion-execution", `${moment.id}: implementation file does not exist at ${moment.implementationFile}`));
  }
  for (const transformation of plan.mediaTransformations ?? []) {
    const file = path.resolve(projectDir, transformation.implementationFile);
    if (!file.startsWith(root) || !fs.existsSync(file)) findings.push(finding("error", "media-transformation", `${transformation.id}: implementation file does not exist at ${transformation.implementationFile}`));
    if (!referencedAssetExists(projectDir, plan, transformation.sourceAsset)) findings.push(finding("error", "media-transformation", `${transformation.id}: named source asset does not exist: ${transformation.sourceAsset}`));
    for (const derivative of transformation.derivatives) if (derivative.status === "shipped") {
      const derivativePath = path.resolve(projectDir, derivative.path);
      if (!derivativePath.startsWith(root) || !fs.existsSync(derivativePath)) findings.push(finding("error", "media-transformation", `${transformation.id}/${derivative.id}: shipped derivative is missing at ${derivative.path}`));
    }
  }
  if (plan.signatureMedia) {
    const item = plan.signatureMedia;
    const implementation = path.resolve(projectDir, item.implementationFile);
    if (!implementation.startsWith(root) || !fs.existsSync(implementation)) findings.push(finding("error", "signature-media", `${item.id}: implementation file is missing at ${item.implementationFile}`));
    const source = fs.existsSync(implementation) ? fs.readFileSync(implementation, "utf-8") : "";
    for (const asset of [...item.sourceAssets, ...item.derivatives.map((entry) => entry.path)]) {
      const target = path.resolve(projectDir, asset);
      if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).size === 0) findings.push(finding("error", "signature-media", `${item.id}: production asset is missing or empty at ${asset}`));
    }
    for (const reference of item.runtimeReferences) if (!source.includes(reference)) findings.push(finding("error", "signature-media", `${item.id}: runtime reference is not consumed by ${item.implementationFile}: ${reference}`));
    const evidence = new Map((report?.evidence ?? []).map((entry) => [entry.id, entry]));
    for (const id of item.evidenceIds) if (evidence.get(id)?.status !== "pass" || evidence.get(id)?.kind !== "media-transformation") findings.push(finding("error", "signature-media", `${item.id}: missing passing visible media evidence ${id}`));
  }
  for (const page of plan.pages) for (const section of page.sections) if (section.status === "fallback") {
    const record = (plan.fallbackExecutions ?? []).find((item) => item.sectionId === section.id);
    if (!record) findings.push(finding("error", "fallback", `${page.id}/${section.id}: fallback shipped without a typed primary-attempt record`));
  }
  const risks: InteractionRisk[] = (plan.motionMoments ?? []).map((moment) => /canvas|webgl|shader/i.test(moment.renderingMechanism) ? "canvas-webgl" : /frame sequence/i.test(moment.renderingMechanism) ? "frame-sequence" : /pin/i.test(`${moment.renderingMechanism} ${moment.handoff}`) ? "pinned-scroll" : "simple-motion");
  const prototypeRequired = plan.configuration
    ? shouldCreatePrototype(plan.configuration, risks)
    : motionIsSelected(plan) || plan.tier === "expressive" || plan.tier === "award";
  if (prototypeRequired) {
    const checkpointFile = path.resolve(projectDir, plan.checkpoint ?? ".dreative/checkpoint.json");
    findings.push(...checkArtifact(checkpointFile, "motion-prototype", validateVisualCheckpoint));
    if (fs.existsSync(checkpointFile)) {
      try {
        const checkpoint = readJson(checkpointFile) as VisualCheckpoint;
        findings.push(...validateMotionCheckpoint(plan, checkpoint, report).map((message) => finding("error", "motion-prototype", message)));
        const evidence = new Set((report?.evidence ?? []).map((item) => item.id));
        for (const id of checkpoint.motionPrototype?.evidenceIds ?? []) if (!evidence.has(id)) findings.push(finding("error", "motion-prototype", `prototype references missing verification evidence ${id}`));
        for (const id of checkpoint.motionPrototype?.motionMomentIds ?? []) if (!(plan.motionMoments ?? []).some((moment) => moment.id === id)) findings.push(finding("error", "motion-prototype", `approved prototype moment ${id} is absent from runtime plan`));
      } catch { /* checkArtifact reports parse failures */ }
    }
  }
  return findings;
}

export function checkVerificationCoverage(plan: DirectDesignPlan, report: VerificationReport): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (![3, 4, 5, 6].includes(plan.version)) return findings;
  if ((plan.version === 3 && report.version !== 2) || ((plan.version === 4 || plan.version === 5) && report.version !== 3) || (plan.version === 6 && report.version !== 4)) return [finding("error", "migration", `plan v${plan.version} requires verify.json v${plan.version === 3 ? 2 : plan.version === 6 ? 4 : 3}`)];
  const passing = report.evidence.filter((item) => item.status === "pass");
  const configuration = resolveWorkflowConfiguration(plan.configuration, { tier: plan.tier }).configuration;
  for (const page of plan.pages) {
    const narrowRisk = page.sections.some((section) => section.verification.some((criterion) => typeof criterion !== "string" && criterion.viewports.includes("narrow-mobile")));
    const viewports = resolveWorkflowPolicy(configuration, narrowRisk).representativeWidths.includes(320) ? ["desktop", "mobile", "narrow-mobile"] as const : ["desktop", "mobile"] as const;
    for (const viewportClass of viewports) {
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
  if (![4, 5, 6].includes(plan.version) || plan.scope !== "substantial") return [];
  const findings: AuditFinding[] = [];
  if (!plan.approval || plan.approval.status !== "approved" || !plan.approval.approvedAt || !plan.implementationStartedAt || Date.parse(plan.implementationStartedAt) <= Date.parse(plan.approval.approvedAt))
    findings.push(finding("error", "approval", "substantial implementation began without final recorded approval, or implementationStartedAt is not later than approval"));
  if (plan.projectKind !== "redesign") return findings;
  const configuration = resolveWorkflowConfiguration(plan.configuration, { tier: plan.tier }).configuration;
  if (plan.configuration && configuration.execution !== "full-audit" && configuration.purpose !== "dreative-dogfood") {
    if (!report?.perceptualComparison) findings.push(finding("error", "perceptual-comparison", "Lean redesigns require canonical before/after comparison evidence in verify.json"));
    return findings;
  }
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

function criticArtifactPath(projectDir: string, value: string | undefined, fallback: string): string {
  return path.resolve(projectDir, value ?? fallback);
}

export function checkCriticArtifacts(projectDir: string, plan: DirectDesignPlan, verification?: VerificationReport): AuditFinding[] {
  if ((plan.version !== 5 && plan.version !== 6) || plan.scope !== "substantial") return [];
  const findings: AuditFinding[] = [];
  const configuration = resolveWorkflowConfiguration(plan.configuration, { tier: plan.tier }).configuration;
  if (configuration.execution === "fast") return [];
  if (plan.configuration || plan.critic) {
    const criticFile = criticArtifactPath(projectDir, plan.critic, ".dreative/critic.json");
    findings.push(...checkArtifact(criticFile, "critic", validateCriticArtifact));
    if (findings.some((item) => item.level === "error")) return findings;
    const artifact = readJson(criticFile) as CriticArtifact;
    if (!artifact.report) return [...findings, finding("error", "critic", "critic.json is missing its context-isolated report")];
    if (plan.version === 6 && verification?.buildIdentity) {
      const input = artifact.input as CriticInput & { verificationRunId?: string; buildIdentityHash?: string };
      if (input.verificationRunId !== verification.runId || input.buildIdentityHash !== verification.buildIdentity.sourceTreeHash) findings.push(finding("error", "critic", "critic input belongs to another verification run or build"));
      if (!artifact.report.reviewContext.motionInspected && (plan.configuration?.ambition === "award" || plan.tier === "award")) findings.push(finding("error", "critic", "Award critic must inspect temporal evidence"));
    }
    if (artifact.report.verdict !== "PASS" && artifact.report.verdict !== "PASS AFTER REVISION") findings.push(finding("error", "critic", `completion is blocked by critic verdict ${artifact.report.verdict}`));
    if (configuration.purpose === "dreative-dogfood" && !artifact.report.dogfood) findings.push(finding("error", "critic", "Dreative Dogfood requires critic behavioural observations"));
    if (verification && Date.parse(artifact.report.revision?.followUpReviewedAt ?? artifact.report.reviewedAt) >= Date.parse(verification.generatedAt)) findings.push(finding("error", "critic", "critic review must complete before final verification"));
    return findings;
  }
  const inputFile = criticArtifactPath(projectDir, plan.criticInput, ".dreative/critic-input.json");
  const reportFile = criticArtifactPath(projectDir, plan.visualCritic, ".dreative/visual-critic.json");
  const projectRoot = path.resolve(projectDir) + path.sep;
  if (!inputFile.startsWith(projectRoot) || !reportFile.startsWith(projectRoot)) return [finding("error", "visual-critic", "critic artifact paths must stay inside the project root")];
  findings.push(...checkArtifact(inputFile, "critic-input", validateCriticInput));
  if (findings.some((item) => item.level === "error")) return findings;
  const input = readJson(inputFile) as CriticInput;
  const motionRequired = motionIsSelected(plan) || plan.tier === "expressive" || plan.tier === "award";
  if (motionRequired && !input.motionRequired) findings.push(finding("error", "visual-critic", "motion-related treatments require motionRequired critic input"));
  if (motionRequired && !(plan.motionMoments ?? []).every((moment) => input.motionMomentIds?.includes(moment.id))) findings.push(finding("error", "visual-critic", "critic input does not cover every planned motion moment"));
  if (!fs.existsSync(reportFile)) return [...findings, finding("error", "visual-critic", "missing visual-critic.json")];
  let report: VisualCriticReport;
  try {
    report = readJson(reportFile) as VisualCriticReport;
    const reportErrors = validateVisualCriticReport(report, input);
    findings.push(...reportErrors.map((message) => finding("error", "visual-critic", message)));
    if (reportErrors.length) return findings;
  } catch (error) {
    return [...findings, finding("error", "visual-critic", `cannot parse visual critic artifact: ${String(error)}`)];
  }
  if (path.resolve(projectDir, report.inputArtifact) !== inputFile) findings.push(finding("error", "visual-critic", "visual critic report does not reference the plan's objective input artifact"));
  const root = projectRoot;
  for (const item of input.evidence) if (item.artifactPath) {
    const target = path.resolve(projectDir, item.artifactPath);
    if (!target.startsWith(root) || !fs.existsSync(target)) findings.push(finding("error", "visual-critic", `${item.id}: objective critic evidence is missing at ${item.artifactPath}`));
  }
  if (plan.projectKind === "redesign" && !input.baselineAvailable) findings.push(finding("error", "visual-critic", "redesign critic input must include the available baseline rather than degrading as a new build"));
  if (report.verdict !== "PASS" && report.verdict !== "PASS AFTER REVISION") findings.push(finding("error", "visual-critic", `completion is blocked by critic verdict ${report.verdict}`));
  if (verification && Date.parse(report.revision?.followUpReviewedAt ?? report.reviewedAt) >= Date.parse(verification.generatedAt)) findings.push(finding("error", "visual-critic", "context-isolated critic and any focused follow-up must complete before final verification"));
  const resolutions = new Map(report.revision?.resolutions.map((item) => [item.findingId, item.status]) ?? []);
  for (const item of report.findings.filter((candidate) => candidate.blocksCompletion)) {
    const resolution = resolutions.get(item.id);
    if (resolution !== "resolved" && resolution !== "intentionally-rejected") findings.push(finding("error", "visual-critic", `${item.id}: blocking critic finding remains ${resolution ?? "unresolved"}`));
  }
  return findings;
}

export function runDirectDesignAudit(projectDir: string): AuditReport {
  const root = path.join(projectDir, ".dreative");
  if (fs.existsSync(path.join(projectDir, PLAN_FILE))) return runCanonicalPlanAudit(projectDir);
  const planFile = path.join(root, "plan.json");
  const findings = checkArtifact(planFile, "plan", validatePlan);
  if (!fs.existsSync(planFile)) return { ok: false, findings };
  let plan: DirectDesignPlan;
  try { plan = readJson(planFile) as DirectDesignPlan; }
  catch { return { ok: false, findings }; }
  const configuration = resolveWorkflowConfiguration(plan.configuration, { tier: plan.tier }).configuration;
  const policy = resolveWorkflowPolicy(configuration);
  const preservationFile = plan.preservationManifest ? path.resolve(projectDir, plan.preservationManifest) : undefined;
  const ledgerFile = plan.decisionLedger ? path.resolve(projectDir, plan.decisionLedger) : undefined;
  const verificationFile = path.join(root, "verify.json");
  if (preservationFile) findings.push(...checkPreservation(projectDir, preservationFile));
  else if (policy.artifacts.includes("preservation.json")) findings.push(finding("error", "preservation", "full-audit requires preservation.json"));
  if (ledgerFile) findings.push(...checkArtifact(ledgerFile, "ledger", validateDecisionLedger));
  else if (policy.artifacts.includes("ledger.json")) findings.push(finding("error", "ledger", "full-audit requires ledger.json"));
  findings.push(...checkArtifact(verificationFile, "verification", validateVerificationReport));
  findings.push(...checkVerificationProof(projectDir, verificationFile));
  const verification = fs.existsSync(verificationFile) ? (readJson(verificationFile) as VerificationReport) : undefined;
  if (plan.version !== 6 || plan.doctrineVersion !== 6) {
    findings.push(finding("warning", "migration", "legacy plan.json is accepted for compatibility only; migrate v3-v8 plans explicitly to canonical plan.yaml v9 and recapture current verification evidence"));
    if ((configuration.ambition === "award" || configuration.ambition === "experimental") && configuration.execution === "full-audit") findings.push(finding("error", "migration", "legacy plans cannot certify ambitious Full Audit completion; migrate to plan.yaml v9"));
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
  findings.push(...checkMotionExecutionArtifacts(projectDir, plan, verification));
  findings.push(...checkRedesignQualityArtifacts(projectDir, plan, verification));
  findings.push(...checkCriticArtifacts(projectDir, plan, verification));
  findings.push(...checkExecutionContracts(projectDir, plan, verification));
  findings.push(...checkLegacyAmbitiousRuntime(projectDir, plan, verification));
  findings.push(...checkBuildFreshness(projectDir, verification));
  findings.push(...checkTemporalEvidence(projectDir, plan, verification));
  findings.push(...checkPolicyRecords(projectDir, plan, verification));

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
