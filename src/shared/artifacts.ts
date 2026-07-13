import type { AmbitionTier, SpecialistSkill } from "./skillSystem.js";

export type DeliveryStatus = "planned" | "shipped" | "fallback" | "cut";

export interface PlanAsset {
  id: string;
  path: string;
  purpose: string;
  importance?: "supporting" | "key";
  preparation?: {
    decision: "flat" | "decompose" | "variants" | "sequence";
    derivatives: string[];
    rationale: string;
  };
  status: DeliveryStatus;
  reason?: string;
}

export interface MotionTreatment {
  class: "none" | "decorative" | "structural" | "transformational";
  staticComposition: string;
  startState: string;
  endState: string;
  changes: string[];
  pinnedElements: string[];
  handoff: string;
  purpose: string;
  mechanism: string;
  mobile: string;
  reducedMotion: string;
}

export interface PlanSection {
  id: string;
  name: string;
  layoutFamily: string;
  skills: SpecialistSkill[];
  interactions: string[];
  motionTreatment?: MotionTreatment;
  mobile: string;
  fallback: string;
  verification: string[];
  assets: PlanAsset[];
  status: DeliveryStatus;
  reason?: string;
}

export interface PlanPage {
  id: string;
  name: string;
  skills: SpecialistSkill[];
  sections: PlanSection[];
}

export interface DirectDesignPlan {
  version: 2;
  /** Omitted legacy v2 plans remain readable; new plans set 2. */
  doctrineVersion?: 2;
  request: string;
  createdAt: string;
  tier: AmbitionTier;
  depth: "restyle" | "relayout" | "restructure" | "reimagine";
  /** User-approved pool. Every selected treatment must appear on at least one page. */
  skills: SpecialistSkill[];
  skillPolicy: {
    mode: "hybrid";
    global: SpecialistSkill[];
    routingApproved: boolean;
    userAssignments: { pageId: string; skills: SpecialistSkill[] }[];
  };
  designRead: { register: string; concept: string; signature: string };
  implementationStartedAt?: string;
  ruleExceptions?: RuleException[];
  creativeStrategy?: CreativeStrategy;
  motionComplexityBudget?: MotionComplexityBudget;
  fontDecision?: FontDecision;
  experimentalPlan?: ExperimentalPlan;
  conceptExploration?: ConceptExploration;
  recipeAccess?: RecipeAccess[];
  pages: PlanPage[];
  preservationManifest: string;
  decisionLedger: string;
}

export interface MotionComplexityBudget {
  heroMoments: { sectionId: string; reason: string }[];
  calmSectionIds: string[];
  sharedLanguage: string;
  deviceLimits: string;
  progressiveEnhancement: string;
  antiDefaultReview: {
    basicMotionAssessment: string;
    compositionHandoff: string;
    visualStateChange: string;
    conceptSpecificity: string;
    memorableMoment: string;
  };
}

export interface RuleException {
  ruleId: string;
  decision: "substituted";
  declaredAt: string;
  reason: string;
  alternative: string;
  successCriteria: string[];
  evidenceIds: string[];
}

export type CreativeStrategy =
  | {
      path: "diversity";
      mechanisms: string[];
      drivers: string[];
    }
  | {
      path: "development";
      signatureMechanism: string;
      states: string[];
      secondaryMechanisms: string[];
      drivers: string[];
    };

export interface FontDecision {
  selected: string;
  candidates: { name: string; reflex: boolean; rationale: string }[];
  recentDisplayFonts: string[];
  reasonKinds?: string[];
  justification?: string;
  repeatJustification?: string;
}

export interface ExperimentalPlan {
  majorSectionIds: string[];
  candidates: { id: string; sectionId: string; idea: string; selected: boolean }[];
}

export interface ConceptExploration {
  recordedAt: string;
  concepts: { name: string; concept: string; brandConnection: string }[];
}

export interface RecipeAccess {
  file: string;
  loadedAt: string;
  purpose: "feasibility" | "implementation" | "performance" | "fallback" | "concept-repair";
}

export type PreservationKind =
  | "link"
  | "handler"
  | "form-field"
  | "visible-copy"
  | "state"
  | "analytics-hook"
  | "accessibility"
  | "route";

export interface PreservationItem {
  id: string;
  kind: PreservationKind;
  file: string;
  needle: string;
  purpose: string;
  intentionallyChanged?: boolean;
  changeReason?: string;
}

export interface PreservationManifest {
  version: 1;
  createdAt: string;
  items: PreservationItem[];
}

export interface DecisionEntry {
  at: string;
  request: string;
  tier: AmbitionTier;
  chosen: string[];
  rejected: string[];
  failures: { treatment: string; evidence: string; fallback: string }[];
  userPreferences: string[];
}

export interface DecisionLedger {
  version: 1;
  entries: DecisionEntry[];
}

export interface VerificationEvidence {
  id: string;
  criterion: string;
  status: "pass" | "fail" | "not-applicable";
  evidence: string;
  timelineState?:
    | "initial"
    | "early"
    | "mid-transition"
    | "final"
    | "handoff"
    | "pinned-midpoint"
    | "pinned-exit"
    | "mobile"
    | "reduced-motion";
  proof: {
    timestamp: string;
    artifactPath?: string;
    viewport?: { width: number; height: number; dpr?: number };
    command?: string;
    exitCode?: number;
    consoleErrorCount?: number;
    testedUrl?: string;
    averageFps?: number;
    maxFrameTimeMs?: number;
    playwrightTestId?: string;
  };
}

export interface VerificationReport {
  version: 1;
  generatedAt: string;
  evidence: VerificationEvidence[];
  refinement?: {
    inspectedAt: string;
    findings: string[];
    changes: string[];
    evidenceIds: string[];
  };
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validatePlan(value: unknown): string[] {
  const errors: string[] = [];
  const plan = value as Partial<DirectDesignPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  if (plan.version !== 2) errors.push("plan.version must be 2 (migrate legacy top-level sections into pages[])");
  if (!nonEmpty(plan.request)) errors.push("plan.request is required");
  if (!nonEmpty(plan.createdAt) || Number.isNaN(Date.parse(plan.createdAt))) errors.push("plan.createdAt must be an ISO date");
  if (!["solid", "premium", "expressive", "award"].includes(String(plan.tier))) errors.push("plan.tier is invalid");
  if (!["restyle", "relayout", "restructure", "reimagine"].includes(String(plan.depth))) errors.push("plan.depth is invalid");
  if (!Array.isArray(plan.skills) || !plan.skills.includes("ux") || !plan.skills.includes("mobile"))
    errors.push("plan.skills must include ux and mobile");
  if (
    !plan.skillPolicy ||
    plan.skillPolicy.mode !== "hybrid" ||
    plan.skillPolicy.routingApproved !== true ||
    !Array.isArray(plan.skillPolicy.global) ||
    !plan.skillPolicy.global.includes("ux") ||
    !plan.skillPolicy.global.includes("mobile")
  )
    errors.push("plan.skillPolicy must use approved hybrid routing with global ux and mobile");
  if (!plan.designRead || !nonEmpty(plan.designRead.register) || !nonEmpty(plan.designRead.concept) || !nonEmpty(plan.designRead.signature))
    errors.push("plan.designRead requires register, concept, and signature");
  if (!Array.isArray(plan.pages) || plan.pages.length === 0) errors.push("plan.pages must contain at least one page");
  const coveredSkills = new Set<SpecialistSkill>();
  for (const [pageIndex, page] of (plan.pages ?? []).entries()) {
    const pagePrefix = `pages[${pageIndex}]`;
    if (!nonEmpty(page.id) || !nonEmpty(page.name)) errors.push(`${pagePrefix} requires id and name`);
    if (!Array.isArray(page.skills) || !page.skills.includes("ux") || !page.skills.includes("mobile"))
      errors.push(`${pagePrefix}.skills must include ux and mobile`);
    for (const globalSkill of plan.skillPolicy?.global ?? []) {
      if (!page.skills?.includes(globalSkill)) errors.push(`${pagePrefix} is missing global skill ${globalSkill}`);
    }
    for (const skill of page.skills ?? []) {
      coveredSkills.add(skill);
      if (!plan.skills?.includes(skill)) errors.push(`${pagePrefix} uses unselected skill ${skill}`);
    }
    if (!Array.isArray(page.sections) || page.sections.length === 0) errors.push(`${pagePrefix}.sections cannot be empty`);
    for (const [sectionIndex, section] of (page.sections ?? []).entries()) {
      const prefix = `${pagePrefix}.sections[${sectionIndex}]`;
      if (!nonEmpty(section.id) || !nonEmpty(section.name) || !nonEmpty(section.layoutFamily)) errors.push(`${prefix} requires id, name, and layoutFamily`);
      if (!nonEmpty(section.mobile) || !nonEmpty(section.fallback)) errors.push(`${prefix} requires mobile and fallback treatments`);
      if (!Array.isArray(section.verification) || section.verification.length === 0) errors.push(`${prefix}.verification cannot be empty`);
      if (section.status === "planned") errors.push(`${prefix} is still planned`);
      if ((section.status === "fallback" || section.status === "cut") && !nonEmpty(section.reason)) errors.push(`${prefix}.reason is required for ${section.status}`);
      if (section.motionTreatment) {
        const treatment = section.motionTreatment;
        if (!["none", "decorative", "structural", "transformational"].includes(treatment.class))
          errors.push(`${prefix}.motionTreatment.class is invalid`);
        for (const [name, value] of Object.entries({
          staticComposition: treatment.staticComposition,
          startState: treatment.startState,
          endState: treatment.endState,
          handoff: treatment.handoff,
          purpose: treatment.purpose,
          mechanism: treatment.mechanism,
          mobile: treatment.mobile,
          reducedMotion: treatment.reducedMotion,
        })) {
          if (!nonEmpty(value)) errors.push(`${prefix}.motionTreatment.${name} is required`);
        }
        if (!Array.isArray(treatment.changes) || !Array.isArray(treatment.pinnedElements))
          errors.push(`${prefix}.motionTreatment changes and pinnedElements must be arrays`);
      }
      for (const skill of section.skills ?? []) {
        if (!page.skills?.includes(skill)) errors.push(`${prefix} uses skill ${skill} not assigned to its page`);
      }
      for (const asset of section.assets ?? []) {
        if (!nonEmpty(asset.id) || !nonEmpty(asset.path) || !nonEmpty(asset.purpose)) errors.push(`${prefix} contains an incomplete asset`);
        if (plan.doctrineVersion === 2 && (!asset.importance || !asset.preparation))
          errors.push(`${prefix} asset ${asset.id || "unknown"} needs importance and a preparation decision`);
        else if (asset.preparation) {
          if (!asset.importance || !["supporting", "key"].includes(asset.importance)) errors.push(`${prefix} asset ${asset.id} has invalid importance`);
          if (!["flat", "decompose", "variants", "sequence"].includes(asset.preparation.decision))
            errors.push(`${prefix} asset ${asset.id} has an invalid preparation decision`);
          if (!nonEmpty(asset.preparation.rationale)) errors.push(`${prefix} asset ${asset.id} needs a preparation rationale`);
          if (!Array.isArray(asset.preparation.derivatives)) errors.push(`${prefix} asset ${asset.id} preparation.derivatives must be an array`);
          if (asset.importance === "key" && asset.preparation.decision !== "flat" && asset.preparation.derivatives.length === 0)
            errors.push(`${prefix} key asset ${asset.id} promises preparation but names no derivatives`);
        }
        if ((asset.status === "fallback" || asset.status === "cut") && !nonEmpty(asset.reason)) errors.push(`${prefix} asset ${asset.id} needs a reason`);
      }
    }
  }
  for (const skill of plan.skills ?? []) {
    if (!coveredSkills.has(skill)) errors.push(`selected skill ${skill} is not assigned to any page`);
  }
  for (const assignment of plan.skillPolicy?.userAssignments ?? []) {
    const page = plan.pages?.find((candidate) => candidate.id === assignment.pageId);
    if (!page) {
      errors.push(`user assignment references unknown page ${assignment.pageId}`);
      continue;
    }
    for (const skill of assignment.skills) {
      if (!plan.skills?.includes(skill)) errors.push(`user assignment uses unselected skill ${skill}`);
      if (!page.skills.includes(skill)) errors.push(`user-pinned skill ${skill} is missing from page ${page.name}`);
    }
  }
  if (!nonEmpty(plan.preservationManifest) || !nonEmpty(plan.decisionLedger)) errors.push("plan must reference preservationManifest and decisionLedger");
  return errors;
}

export function validatePreservationManifest(value: unknown): string[] {
  const errors: string[] = [];
  const manifest = value as Partial<PreservationManifest> | null;
  if (!manifest || typeof manifest !== "object") return ["preservation manifest must be an object"];
  if (manifest.version !== 1) errors.push("preservation.version must be 1");
  if (!Array.isArray(manifest.items)) errors.push("preservation.items must be an array");
  const ids = new Set<string>();
  for (const [index, item] of (manifest.items ?? []).entries()) {
    if (!nonEmpty(item.id) || !nonEmpty(item.kind) || !nonEmpty(item.file) || !nonEmpty(item.needle) || !nonEmpty(item.purpose))
      errors.push(`preservation.items[${index}] is incomplete`);
    if (ids.has(item.id)) errors.push(`duplicate preservation id: ${item.id}`);
    ids.add(item.id);
    if (item.intentionallyChanged && !nonEmpty(item.changeReason)) errors.push(`${item.id} needs changeReason`);
  }
  return errors;
}

export function validateDecisionLedger(value: unknown): string[] {
  const ledger = value as Partial<DecisionLedger> | null;
  if (!ledger || typeof ledger !== "object") return ["decision ledger must be an object"];
  if (ledger.version !== 1) return ["decision ledger version must be 1"];
  if (!Array.isArray(ledger.entries)) return ["decision ledger entries must be an array"];
  return [];
}

export function validateVerificationReport(value: unknown): string[] {
  const report = value as Partial<VerificationReport> | null;
  if (!report || typeof report !== "object") return ["verification report must be an object"];
  const errors: string[] = [];
  if (report.version !== 1) errors.push("verification report version must be 1");
  if (!Array.isArray(report.evidence)) errors.push("verification evidence must be an array");
  if (report.refinement) {
    if (!nonEmpty(report.refinement.inspectedAt) || Number.isNaN(Date.parse(report.refinement.inspectedAt)))
      errors.push("verification refinement needs a valid inspectedAt timestamp");
    if (
      !Array.isArray(report.refinement.findings) ||
      report.refinement.findings.length === 0 ||
      !Array.isArray(report.refinement.changes) ||
      report.refinement.changes.length === 0 ||
      !Array.isArray(report.refinement.evidenceIds) ||
      report.refinement.evidenceIds.length === 0
    )
      errors.push("verification refinement needs findings, changes, and evidenceIds arrays");
  }
  if ((report.evidence ?? []).some((item) => item.status === "fail")) errors.push("verification report contains failing evidence");
  const timelineStates = new Set([
    "initial",
    "early",
    "mid-transition",
    "final",
    "handoff",
    "pinned-midpoint",
    "pinned-exit",
    "mobile",
    "reduced-motion",
  ]);
  for (const [index, item] of (report.evidence ?? []).entries()) {
    if (!nonEmpty(item.id) || !nonEmpty(item.criterion) || !nonEmpty(item.evidence)) errors.push(`verification.evidence[${index}] is incomplete`);
    if (item.timelineState && !timelineStates.has(item.timelineState)) errors.push(`verification.evidence[${index}].timelineState is invalid`);
    const proof = item.proof;
    if (!proof || !nonEmpty(proof.timestamp) || Number.isNaN(Date.parse(proof.timestamp))) {
      errors.push(`verification.evidence[${index}].proof requires a valid timestamp`);
      continue;
    }
    const hasConcreteProof =
      nonEmpty(proof.artifactPath) ||
      nonEmpty(proof.command) ||
      typeof proof.consoleErrorCount === "number" ||
      nonEmpty(proof.testedUrl) ||
      typeof proof.averageFps === "number" ||
      typeof proof.maxFrameTimeMs === "number" ||
      nonEmpty(proof.playwrightTestId);
    if (!hasConcreteProof) errors.push(`verification.evidence[${index}].proof needs a command, artifact, URL, runtime measurement, or test id`);
    if ((nonEmpty(proof.command) && typeof proof.exitCode !== "number") || (!nonEmpty(proof.command) && typeof proof.exitCode === "number"))
      errors.push(`verification.evidence[${index}] command and exitCode must appear together`);
    if (item.status === "pass" && typeof proof.exitCode === "number" && proof.exitCode !== 0)
      errors.push(`verification.evidence[${index}] cannot pass with exitCode ${proof.exitCode}`);
    if (item.status === "pass" && typeof proof.consoleErrorCount === "number" && proof.consoleErrorCount !== 0)
      errors.push(`verification.evidence[${index}] cannot pass with console errors`);
  }
  return errors;
}
