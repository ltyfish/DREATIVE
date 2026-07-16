import type { MechanismFinalStatus } from "./planGovernance.js";
import type { SpecialistSkill } from "./skillSystem.js";
import type { DesignAmbition } from "./workflow.js";

export type CriticVerdict = "PASS" | "PASS AFTER REVISION" | "MAJOR REVISION REQUIRED" | "INSUFFICIENT EVIDENCE";
export type CriticSeverity = "BLOCKER" | "MAJOR" | "MINOR" | "EXPERIMENT";
export type CriticCategory = "authorship" | "concept-fidelity" | "hierarchy-composition" | "mobile" | "brand-specificity" | "motion-interaction" | "baseline-regression" | "generic-template-risk" | "usability";
export type CriticEvidenceKind = "baseline-screenshot" | "final-screenshot" | "motion-recording" | "interaction-recording" | "state-capture" | "browser-trace" | "reduced-motion-capture" | "live-url";

export interface CriticEvidenceInput {
  id: string;
  kind: CriticEvidenceKind;
  description: string;
  artifactPath?: string;
  url?: string;
  pageId?: string;
  viewport?: { width: number; height: number };
  motionMomentId?: string;
  temporal?: {
    startTimestamp?: string;
    endTimestamp?: string;
    controlledProgress?: number | string;
    observedProperties?: string[];
  };
}

export interface CriticInput {
  version: 1;
  generatedAt: string;
  originalBrief: string;
  userConstraints: string[];
  approvedConcept: string;
  visualBlueprints: { pageId: string; sectionId: string; blueprint: string }[];
  intendedSignature: string;
  ambition?: DesignAmbition;
  selectedTreatments?: SpecialistSkill[];
  plannedPeaks?: {
    id: string; location: string; plannedBehaviour: string; startState: string; activeState: string;
    resolution: string; inputRelationship: string; mobileStrategy: string; fallbackState: string;
  }[];
  plannedMechanisms?: {
    id: string; location: string; primaryImplementation: string; primaryAcceptance: string[];
    fallbackImplementation: string; fallbackTrigger: string;
  }[];
  baselineAvailable: boolean;
  motionRequired?: boolean;
  motionMomentIds?: string[];
  verificationRunId?: string;
  buildIdentityHash?: string;
  evidence: CriticEvidenceInput[];
  contextPolicy: {
    firstPass: "objective-only";
    excluded: ("builder-self-review" | "implementation-rationale" | "quality-claims" | "difficulty-excuses" | "builder-score")[];
  };
}

export interface CriticFinding {
  id: string;
  severity: CriticSeverity;
  category: CriticCategory;
  location: string;
  observedIssue: string;
  whyItMatters: string;
  correctionDirection: string;
  evidenceIds: string[];
  blocksCompletion: boolean;
}

export interface CriticResolution {
  findingId: string;
  status: "resolved" | "partially-resolved" | "unresolved" | "intentionally-rejected";
  evidenceIds: string[];
  reason: string;
}

export interface VisualCriticReport {
  version: 1;
  reviewedAt: string;
  inputArtifact: string;
  contextIsolation: {
    mode: "fresh-subagent" | "fresh-context" | "isolated-prompt" | "best-effort";
    independentReadingRecordedAt: string;
    builderContextOpenedAt?: string;
    limitation: string;
  };
  reviewContext: {
    availableInputs: string[];
    missingInputs: string[];
    viewportsInspected: string[];
    pagesOrFlowsInspected: string[];
    motionInspected: boolean;
    limitations: string[];
  };
  independentReading: {
    perceivedConcept: string;
    perceivedSignature: string;
    perceivedBrandCharacter: string;
    perceivedMotionRole: string;
  };
  initialVerdict: CriticVerdict;
  verdict: CriticVerdict;
  strongestQualities: { location: string; quality: string; evidenceIds: string[] }[];
  findings: CriticFinding[];
  baselineRegressions: string[];
  conceptFidelityFindings: string[];
  mobileFindings: string[];
  motionFindings: string[];
  temporalAssessment?: {
    firstViewportResponsive: boolean;
    developsBeyondEntrances: boolean;
    crossSectionHandoffs: boolean;
    signatureDevelops: boolean;
    interactionPhysical: boolean;
    primarilyStaticStack: boolean;
    symbolicDowngrades: string[];
    evidenceIds: string[];
  };
  routeAssessment?: {
    heroRemovedStillSatisfies: boolean;
    fullRouteAuthored: boolean;
    mediaDiverse: boolean;
    ordinaryControlsSubstituteForExperience: boolean;
    selectedTreatmentVerdicts: { treatment: SpecialistSkill; verdict: "pass" | "fail" | "insufficient-evidence"; evidenceIds: string[]; observation: string }[];
    peakVerdicts: {
      peakId: string; plannedBehaviour: string; observedBehaviour: string; startState: string; activeState: string;
      resolution: string; inputRelationship: string; mobileStrategy: string; fallbackState: string;
      verdict: "pass" | "fail" | "insufficient-evidence"; evidenceIds: string[];
    }[];
    mechanismVerdicts: {
      mechanismId: string; observedImplementation: string; fallbackUsed: boolean; fallbackTriggerValid: boolean;
      finalStatus: MechanismFinalStatus; verdict: "pass" | "fail" | "insufficient-evidence"; evidenceIds: string[];
    }[];
    assetIntegrity: "pass" | "fail" | "insufficient-evidence";
    performanceRisk: string;
    reducedMotionTranslation: string;
  };
  requiredRevisionSet: string[];
  nonBlockingExperiments: string[];
  revision?: {
    iteration: 1;
    status: "complete";
    resolutions: CriticResolution[];
    recapturedEvidenceIds: string[];
    followUpReviewedAt: string;
  };
  dogfood?: {
    falsePositives: string[];
    vagueFindings: string[];
    humanMisses: string[];
    styleConvergenceRisk: string[];
    complexityBias: string[];
    motionEvidenceRisk: string[];
    experimentsForRecipes: string[];
  };
}

/** Canonical Lean critic artifact: objective input and its independent result. */
export interface CriticArtifact {
  version: 1;
  input: CriticInput;
  report?: VisualCriticReport;
}

function nonEmpty(value: unknown, min = 1): value is string {
  return typeof value === "string" && value.trim().length >= min;
}

function validDate(value: unknown): value is string {
  return nonEmpty(value) && !Number.isNaN(Date.parse(value));
}

function nonEmptyList(value: unknown, minimum = 1): value is string[] {
  return Array.isArray(value) && value.length >= minimum && value.every((item) => nonEmpty(item));
}

const REQUIRED_EXCLUSIONS: CriticInput["contextPolicy"]["excluded"] = ["builder-self-review", "implementation-rationale", "quality-claims", "difficulty-excuses", "builder-score"];
const TECHNIQUE_ABSENCE = /\b(?:no|lack(?:s|ing)?|missing|absence of|without)\b.{0,40}\b(?:3d|webgl|canvas|video|generated imagery|image editing|frame(?:-based)? animation|shader)\b/i;

export function validateCriticInput(value: unknown): string[] {
  const input = value as Partial<CriticInput> | null;
  if (!input || typeof input !== "object") return ["critic input must be an object"];
  const errors: string[] = [];
  if (input.version !== 1 || !validDate(input.generatedAt)) errors.push("critic input needs version 1 and generatedAt");
  if (!nonEmpty(input.originalBrief, 12) || !nonEmpty(input.approvedConcept, 12) || !nonEmpty(input.intendedSignature, 6)) errors.push("critic input requires the original brief, approved concept, and intended signature");
  if (!Array.isArray(input.userConstraints) || !Array.isArray(input.visualBlueprints) || input.visualBlueprints.length === 0) errors.push("critic input requires constraints and approved visual blueprints");
  for (const [index, item] of (input.visualBlueprints ?? []).entries()) if (!nonEmpty(item.pageId) || !nonEmpty(item.sectionId) || !nonEmpty(item.blueprint, 20)) errors.push(`critic input visualBlueprints[${index}] is incomplete`);
  if (!input.contextPolicy || input.contextPolicy.firstPass !== "objective-only" || REQUIRED_EXCLUSIONS.some((item) => !input.contextPolicy?.excluded?.includes(item))) errors.push("critic first pass must exclude builder review, rationale, quality claims, difficulty excuses, and scores");
  const ids = new Set<string>();
  for (const [index, item] of (input.evidence ?? []).entries()) {
    if (!nonEmpty(item.id) || !nonEmpty(item.description, 8) || !["baseline-screenshot", "final-screenshot", "motion-recording", "interaction-recording", "state-capture", "browser-trace", "reduced-motion-capture", "live-url"].includes(item.kind)) errors.push(`critic input evidence[${index}] is incomplete`);
    if (!item.artifactPath && !item.url) errors.push(`critic input evidence[${index}] needs artifactPath or url`);
    if (ids.has(item.id)) errors.push(`duplicate critic evidence id: ${item.id}`);
    ids.add(item.id);
  }
  const finals = input.evidence?.filter((item) => item.kind === "final-screenshot") ?? [];
  if (!finals.some((item) => (item.viewport?.width ?? 0) >= 1200)) errors.push("critic input requires a final desktop screenshot");
  if (!finals.some((item) => (item.viewport?.width ?? Infinity) >= 320 && (item.viewport?.width ?? 0) <= 430)) errors.push("critic input requires a final mobile screenshot");
  const baselines = input.evidence?.filter((item) => item.kind === "baseline-screenshot") ?? [];
  if (input.baselineAvailable && (!baselines.some((item) => (item.viewport?.width ?? 0) >= 1200) || !baselines.some((item) => (item.viewport?.width ?? Infinity) <= 430))) errors.push("redesign critic input requires desktop and mobile baseline screenshots");
  if (input.motionRequired) {
    const temporal = input.evidence?.filter((item) => ["motion-recording", "interaction-recording", "state-capture", "browser-trace"].includes(item.kind)) ?? [];
    if (!Array.isArray(input.motionMomentIds) || input.motionMomentIds.length === 0) errors.push("motion-required critic input must name motionMomentIds");
    if (temporal.length === 0) errors.push("motion evidence unavailable: critic verdict must be INSUFFICIENT EVIDENCE");
    for (const id of input.motionMomentIds ?? []) if (!temporal.some((item) => item.motionMomentId === id)) errors.push(`critic input has no temporal evidence for motion moment ${id}`);
    for (const item of temporal) {
      const recorded = ["motion-recording", "interaction-recording", "browser-trace"].includes(item.kind) && validDate(item.temporal?.startTimestamp) && validDate(item.temporal?.endTimestamp);
      const sampled = item.kind === "state-capture" && item.temporal?.controlledProgress !== undefined && nonEmptyList(item.temporal?.observedProperties);
      if (!recorded && !sampled) errors.push(`${item.id}: critic temporal evidence lacks timestamps or controlled-progress observations`);
    }
    if (!input.evidence?.some((item) => item.kind === "reduced-motion-capture")) errors.push("motion-required critic input needs reduced-motion evidence");
    if ((input.verificationRunId || input.buildIdentityHash) && (!nonEmpty(input.verificationRunId) || !nonEmpty(input.buildIdentityHash))) errors.push("critic run and build identity must appear together");
  }
  if (input.ambition === "award" || input.ambition === "experimental") {
    if (!nonEmptyList(input.selectedTreatments)) errors.push(`${input.ambition} critic input requires selected treatments`);
    if (!Array.isArray(input.plannedMechanisms) || input.plannedMechanisms.length === 0) errors.push(`${input.ambition} critic input requires planned primary/fallback mechanisms`);
  }
  if (input.ambition === "experimental" && (!Array.isArray(input.plannedPeaks) || input.plannedPeaks.length < 2 || input.plannedPeaks.length > 3))
    errors.push("Experimental critic input requires two or three planned peaks");
  return errors;
}

export function validateVisualCriticReport(value: unknown, input?: CriticInput): string[] {
  const report = value as Partial<VisualCriticReport> | null;
  if (!report || typeof report !== "object") return ["visual critic report must be an object"];
  const errors: string[] = [];
  if (report.version !== 1 || !validDate(report.reviewedAt)) errors.push("visual critic report needs version 1 and reviewedAt");
  if (!nonEmpty(report.inputArtifact)) errors.push("visual critic report must reference its input artifact");
  const isolation = report.contextIsolation;
  if (!isolation || !["fresh-subagent", "fresh-context", "isolated-prompt", "best-effort"].includes(String(isolation.mode)) || !validDate(isolation.independentReadingRecordedAt) || !nonEmpty(isolation.limitation)) errors.push("visual critic report requires documented context isolation");
  if (validDate(report.reviewedAt) && validDate(isolation?.independentReadingRecordedAt) && Date.parse(isolation.independentReadingRecordedAt) > Date.parse(report.reviewedAt)) errors.push("independent reading must be recorded before the critic review completes");
  if (isolation?.builderContextOpenedAt && (!validDate(isolation.builderContextOpenedAt) || Date.parse(isolation.builderContextOpenedAt) <= Date.parse(isolation.independentReadingRecordedAt))) errors.push("builder context may be opened only after the independent reading is recorded");
  if (!report.reviewContext || !Array.isArray(report.reviewContext.availableInputs) || !Array.isArray(report.reviewContext.missingInputs) || !nonEmptyList(report.reviewContext.viewportsInspected, 2) || !nonEmptyList(report.reviewContext.pagesOrFlowsInspected) || !Array.isArray(report.reviewContext.limitations)) errors.push("visual critic review context is incomplete");
  if (!report.independentReading || Object.values(report.independentReading).some((item) => !nonEmpty(item, 12))) errors.push("visual critic independent reading must record concept, signature, brand, and motion role");
  const verdicts: CriticVerdict[] = ["PASS", "PASS AFTER REVISION", "MAJOR REVISION REQUIRED", "INSUFFICIENT EVIDENCE"];
  if (!verdicts.includes(report.initialVerdict as CriticVerdict) || !verdicts.includes(report.verdict as CriticVerdict)) errors.push("visual critic verdict is invalid");
  if (!Array.isArray(report.findings) || !Array.isArray(report.strongestQualities) || !Array.isArray(report.baselineRegressions) || !Array.isArray(report.conceptFidelityFindings) || !Array.isArray(report.mobileFindings) || !Array.isArray(report.motionFindings) || !Array.isArray(report.requiredRevisionSet) || !Array.isArray(report.nonBlockingExperiments)) errors.push("visual critic report sections must be arrays");
  if ((report.requiredRevisionSet?.length ?? 0) > 5) errors.push("visual critic required revision set is limited to five changes");
  if ((report.requiredRevisionSet ?? []).some((item) => !nonEmpty(item, 12)) || new Set(report.requiredRevisionSet ?? []).size !== (report.requiredRevisionSet?.length ?? 0)) errors.push("visual critic required revision set must be concrete, unique, and priority-ordered");
  if (report.reviewContext?.motionInspected === false && (report.motionFindings?.length ?? 0) > 0) errors.push("motion findings require direct live or recorded inspection");
  const inputEvidence = new Set(input?.evidence.map((item) => item.id) ?? []);
  const categories: CriticCategory[] = ["authorship", "concept-fidelity", "hierarchy-composition", "mobile", "brand-specificity", "motion-interaction", "baseline-regression", "generic-template-risk", "usability"];
  for (const [index, item] of (report.findings ?? []).entries()) {
    if (!nonEmpty(item.id) || !["BLOCKER", "MAJOR", "MINOR", "EXPERIMENT"].includes(item.severity) || !categories.includes(item.category) || typeof item.blocksCompletion !== "boolean" || !nonEmpty(item.location, 8) || !nonEmpty(item.observedIssue, 20) || !nonEmpty(item.whyItMatters, 20) || !nonEmpty(item.correctionDirection, 20) || !nonEmptyList(item.evidenceIds)) errors.push(`visual critic finding[${index}] must be concrete and evidence-grounded`);
    if (item.severity === "EXPERIMENT" && item.blocksCompletion) errors.push(`${item.id}: experiments cannot block completion`);
    if (item.blocksCompletion && TECHNIQUE_ABSENCE.test(item.observedIssue)) errors.push(`${item.id}: technique absence cannot independently block completion`);
    if (input && item.evidenceIds.some((id) => !inputEvidence.has(id))) errors.push(`${item.id}: finding references unknown objective evidence`);
    if (item.category === "motion-interaction" && item.blocksCompletion && !report.reviewContext?.motionInspected) errors.push(`${item.id}: motion cannot block completion without direct motion evidence`);
  }
  if (input) for (const [index, item] of (report.strongestQualities ?? []).entries()) {
    if (!nonEmpty(item.location, 8) || !nonEmpty(item.quality, 12) || !nonEmptyList(item.evidenceIds) || item.evidenceIds.some((id) => !inputEvidence.has(id))) errors.push(`visual critic strongestQualities[${index}] must be specific and evidence-grounded`);
  }
  const blocking = (report.findings ?? []).filter((item) => item.blocksCompletion);
  const resolutions = new Map(report.revision?.resolutions?.map((item) => [item.findingId, item]) ?? []);
  const unresolved = blocking.filter((item) => !["resolved", "intentionally-rejected"].includes(resolutions.get(item.id)?.status ?? "unresolved"));
  if ((report.verdict === "PASS" || report.verdict === "PASS AFTER REVISION") && unresolved.length > 0) errors.push("passing critic verdict cannot retain unresolved blocking findings");
  if ((report.requiredRevisionSet?.length ?? 0) > 0 && !report.revision) errors.push("required critic revisions need one completed refinement pass");
  if (report.initialVerdict === "MAJOR REVISION REQUIRED" && (report.requiredRevisionSet?.length ?? 0) === 0) errors.push("major revision verdict requires a focused revision set");
  if (report.verdict === "PASS AFTER REVISION" && !report.revision) errors.push("PASS AFTER REVISION requires the evidence-backed revision record");
  if (report.revision) {
    if (report.revision.iteration !== 1 || report.revision.status !== "complete" || !validDate(report.revision.followUpReviewedAt) || !Array.isArray(report.revision.resolutions) || !nonEmptyList(report.revision.recapturedEvidenceIds)) errors.push("critic refinement is limited to one completed, evidence-backed iteration");
    if (report.verdict === "PASS") errors.push("a report that required revision must use PASS AFTER REVISION after resolution");
    for (const [index, resolution] of (report.revision.resolutions ?? []).entries()) if (!nonEmpty(resolution.findingId) || !["resolved", "partially-resolved", "unresolved", "intentionally-rejected"].includes(resolution.status) || !nonEmptyList(resolution.evidenceIds) || !nonEmpty(resolution.reason, 12)) errors.push(`critic revision resolution[${index}] is incomplete`);
  }
  if (input) {
    const hasMotionEvidence = input.evidence.some((item) => ["motion-recording", "interaction-recording", "state-capture", "browser-trace", "live-url"].includes(item.kind));
    if (input.motionRequired && !hasMotionEvidence && report.verdict !== "INSUFFICIENT EVIDENCE") errors.push("missing required motion evidence must produce INSUFFICIENT EVIDENCE");
    if (input.motionRequired && hasMotionEvidence && !report.reviewContext?.motionInspected) errors.push("motion-required work must be directly inspected by the critic");
    if (input.motionRequired && input.verificationRunId) {
      const temporal = report.temporalAssessment;
      if (!temporal || !nonEmptyList(temporal.evidenceIds) || !Array.isArray(temporal.symbolicDowngrades)) errors.push("motion-required critic report needs an evidence-grounded temporal assessment");
      else if ((temporal.primarilyStaticStack || !temporal.firstViewportResponsive || !temporal.developsBeyondEntrances || !temporal.signatureDevelops || temporal.symbolicDowngrades.length > 0) && (report.verdict === "PASS" || report.verdict === "PASS AFTER REVISION")) errors.push("critic cannot pass a static-feeling or symbolically downgraded ambitious runtime");
    }
    if (report.reviewContext?.motionInspected && !hasMotionEvidence) errors.push("motionInspected requires live or recorded interactive evidence");
    if (input.baselineAvailable === false && (report.baselineRegressions?.length ?? 0) > 0) errors.push("new builds without a baseline cannot claim baseline regressions");
    for (const resolution of report.revision?.resolutions ?? []) if (resolution.evidenceIds.some((id) => !inputEvidence.has(id))) errors.push(`${resolution.findingId}: resolution references unknown recaptured evidence`);
    for (const id of report.revision?.recapturedEvidenceIds ?? []) if (!inputEvidence.has(id)) errors.push(`critic revision references unknown recaptured evidence ${id}`);
    if (input.ambition === "award" || input.ambition === "experimental") {
      const route = report.routeAssessment;
      if (!route) errors.push(`${input.ambition} critic report requires a routeAssessment`);
      else {
        if (!route.heroRemovedStillSatisfies && !(report.findings ?? []).some((item) => item.blocksCompletion && /hero|route|authorship|ambition/i.test(`${item.location} ${item.observedIssue}`)))
          errors.push("hero-removed failure must create a blocking finding");
        for (const treatment of input.selectedTreatments ?? []) if (!route.selectedTreatmentVerdicts.some((item) => item.treatment === treatment)) errors.push(`critic route assessment is missing selected treatment ${treatment}`);
        for (const peak of input.plannedPeaks ?? []) if (!route.peakVerdicts.some((item) => item.peakId === peak.id)) errors.push(`critic route assessment is missing peak ${peak.id}`);
        for (const mechanism of input.plannedMechanisms ?? []) if (!route.mechanismVerdicts.some((item) => item.mechanismId === mechanism.id)) errors.push(`critic route assessment is missing mechanism ${mechanism.id}`);
        const failed = [
          ...route.selectedTreatmentVerdicts.filter((item) => item.verdict === "fail"),
          ...route.peakVerdicts.filter((item) => item.verdict === "fail"),
          ...route.mechanismVerdicts.filter((item) => item.verdict === "fail"),
        ];
        if (failed.length && (report.verdict === "PASS" || report.verdict === "PASS AFTER REVISION")) errors.push("critic cannot pass failed treatments, peaks or primary mechanisms");
        if (route.ordinaryControlsSubstituteForExperience && (report.verdict === "PASS" || report.verdict === "PASS AFTER REVISION")) errors.push("critic cannot pass ordinary controls substituted for the promised experience");
        if (!route.fullRouteAuthored && (report.verdict === "PASS" || report.verdict === "PASS AFTER REVISION")) errors.push("critic cannot pass a polished but hero-only route");
      }
    }
  }
  if (report.dogfood && Object.values(report.dogfood).some((item) => !Array.isArray(item))) errors.push("visual critic dogfood observability values must be arrays");
  return errors;
}

export function validateCriticArtifact(value: unknown): string[] {
  const artifact = value as Partial<CriticArtifact> | null;
  if (!artifact || typeof artifact !== "object" || artifact.version !== 1) return ["critic artifact needs version 1"];
  const errors = validateCriticInput(artifact.input);
  if (artifact.report) errors.push(...validateVisualCriticReport(artifact.report, artifact.input));
  return errors;
}

export function buildIndependentCriticPrompt(input: CriticInput): string {
  const errors = validateCriticInput(input);
  if (errors.length) throw new Error(errors.join("\n"));
  return [
    "You are Dreative's independent visual critic. Judge visible outcomes before seeing any builder explanation.",
    "Do not reward or penalize technologies. 3D, WebGL, canvas, video, generated media, and image editing are optional; only their visible results matter.",
    "Use the supplied desktop/mobile evidence and live or recorded interaction evidence when present. Do not infer motion quality from static screenshots.",
    "Ground every finding in an exact location or interaction and an evidence id. Experiments never block completion. Limit required revisions to five.",
    "Review authorship, concept fidelity, hierarchy/composition, mobile authorship, brand specificity, and generic-template risk. Ask whether another company could use the design unchanged after swapping logo and copy.",
    "Evaluate every planned experimental peak, selected treatment and primary mechanism independently. Reconcile any fallback against its declared trigger and evidence. Ordinary tabs, buttons or a basic carousel cannot substitute for a promised sequence or spatial interface.",
    "Apply the hero-removed test: if the hero were excluded, would the remaining route still visibly satisfy the approved ambition and allocated treatments? Award or Experimental must receive a blocking finding when the answer is no.",
    "Explicitly score and discuss ambition fidelity, concept fidelity, authorship/generic-template risk, static feeling, temporal development, selected-treatment perceptibility, media integrity, typography/hierarchy, mobile composition, interaction purpose, brand/product appropriateness, functional honesty, and visible regressions.",
    "For redesigns, compare the complete baseline journey with the final result and name lost equity or regressions. When motion is required, judge whether the page still feels static, composition change versus entrances, continuity and handoffs, pacing peaks and rests, brand relationship, signature development, media transformation, first-viewport movement, mobile authorship, and generic template risk. Missing temporal evidence requires INSUFFICIENT EVIDENCE.",
    "Return a VisualCriticReport v1 matching schemas/visual-critic.schema.json.",
    `OBJECTIVE INPUT:\n${JSON.stringify(input, null, 2)}`,
  ].join("\n\n");
}
