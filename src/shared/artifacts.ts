import type { AmbitionTier, SpecialistSkill } from "./skillSystem.js";
import type { ExpressionContract, MobileBlueprint, MobileVerificationCheck, PageRegister, SourceStrategy, StructuralDelta, TransformationDepth } from "./types.js";

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
  verification: (string | VerificationCriterion)[];
  assets: PlanAsset[];
  status: DeliveryStatus;
  reason?: string;
}

export interface PlanPage {
  id: string;
  name: string;
  register?: PageRegister;
  sourceStrategy?: SourceStrategy;
  structuralDelta?: StructuralDelta;
  mobileBlueprint?: MobileBlueprint;
  expression?: ExpressionContract;
  intentionalCalm?: string;
  skills: SpecialistSkill[];
  sections: PlanSection[];
}

export interface VerificationCriterion {
  id: string;
  claim: string;
  kind: "visual" | "interaction" | "responsive" | "preservation" | "structural-depth";
  pageId: string;
  sectionId?: string;
  viewports: ("desktop" | "mobile" | "narrow-mobile" | "non-visual")[];
}

export interface MultiPageCoherence {
  globalVisualLanguage: string;
  globalInteractionLanguage: string;
  sharedPrimitives: string[];
  pageSpecificCompositions: { pageId: string; register: PageRegister; taskModel: string; expressionLevel: "calm" | "authored" }[];
  crossPageContinuity: string[];
  prohibitedRepeatedShells: string[];
}

export interface DirectDesignPlan {
  /** v2 remains readable as legacy; new artifacts must write v3. */
  version: 2 | 3;
  doctrineVersion?: 2 | 3;
  request: string;
  createdAt: string;
  tier: AmbitionTier;
  depth: TransformationDepth;
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
  coherence?: MultiPageCoherence;
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
  kind?: "visual" | "interaction" | "responsive" | "preservation" | "structural-depth";
  criterionId?: string;
  pageId?: string;
  sectionId?: string;
  viewportClass?: "desktop" | "mobile" | "narrow-mobile" | "non-visual";
  mobileChecks?: MobileVerificationCheck[];
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
  version: 1 | 2;
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

function concreteList(value: unknown, minimum = 1): value is string[] {
  return Array.isArray(value) && value.length >= minimum && value.every((item) => nonEmpty(item) && !/^(improve|modernize|make better|n\/a|none)$/i.test(item.trim()));
}

function validateV3Page(page: PlanPage, prefix: string, depth: TransformationDepth, tier: AmbitionTier): string[] {
  const errors: string[] = [];
  const validRegisters: PageRegister[] = ["marketing-storytelling", "discovery-browse", "task-transaction", "account-status", "administration", "data-dense-utility", "authentication", "system-state"];
  if (!page.register || !validRegisters.includes(page.register)) errors.push(`${prefix}.register is required`);
  const expectedStrategy: SourceStrategy = depth === "restyle" ? "patch" : depth === "relayout" ? "recompose" : "rebuild-from-contracts";
  if (page.sourceStrategy !== expectedStrategy) errors.push(`${prefix}.sourceStrategy must be ${expectedStrategy} for ${depth}`);
  const delta = page.structuralDelta;
  if (!delta) errors.push(`${prefix}.structuralDelta is required`);
  else {
    for (const key of ["existingModel", "proposedModel", "existingParadigm", "proposedParadigm", "depthHonesty"] as const) {
      if (!nonEmpty(delta[key]) || /^(old|new|modern|expressive|same|n\/a)( layout| design)?$/i.test(delta[key].trim())) errors.push(`${prefix}.structuralDelta.${key} must be concrete and page-specific`);
    }
    if (!concreteList(delta.materialChanges)) errors.push(`${prefix}.structuralDelta.materialChanges cannot be empty or generic`);
    if (!Array.isArray(delta.survivingBoundaries) || !Array.isArray(delta.rebuiltBoundaries) || !concreteList(delta.preservedContracts) || !Array.isArray(delta.retainedPatterns) || !concreteList(delta.forbiddenCarryovers))
      errors.push(`${prefix}.structuralDelta requires boundaries, preservation, retained-pattern rationale, and forbidden carryovers`);
    if (delta.retainedPatterns?.some((item) => !nonEmpty(item.pattern) || !nonEmpty(item.rationale))) errors.push(`${prefix}.structuralDelta retained patterns need rationale`);
    const structural = [delta.proposedModel, delta.proposedParadigm, ...delta.materialChanges].join(" ");
    if ((depth === "restructure" || depth === "reimagine") && !/\b(architect|component|boundary|workflow|navigation|interaction|model|task|rebuild|replace|merge|remove|reorder|hierarchy|workspace)\b/i.test(structural))
      errors.push(`${prefix}: ${depth} cannot be satisfied by stylesheet, token, typography, card, or animation changes alone`);
    if ((depth === "restructure" || depth === "reimagine") && /\b(same (sections|layout)|only (colou?r|font|style)|new (colou?r|font|shadow|radius))\b/i.test(structural))
      errors.push(`${prefix}: structural delta contradicts selected depth ${depth}`);
  }
  const mobile = page.mobileBlueprint;
  if (!mobile) errors.push(`${prefix}.mobileBlueprint is required`);
  else {
    const fields = [mobile.primaryTask, mobile.firstViewportPurpose, mobile.safeArea, mobile.navigationModel, mobile.mobileOnlyComposition, mobile.mediaStrategy, mobile.motionStrategy, mobile.keyboardAndForms, mobile.composition390, mobile.fallback320, mobile.stackingRejection];
    if (fields.some((field) => !nonEmpty(field)) || !concreteList(mobile.contentOrder, 2) || !concreteList(mobile.beforeFirstScroll) || !nonEmpty(mobile.primaryThumbAction?.action) || !nonEmpty(mobile.primaryThumbAction?.placement))
      errors.push(`${prefix}.mobileBlueprint must specify task, order, first viewport, thumb action, safe areas, navigation, media, motion, forms, 390px, and 320px behavior`);
    if (/^\s*stack(?:ed)?(?:\s+vertically)?[.!]?\s*$/i.test(mobile.mobileOnlyComposition) || /^\s*stack(?:ed)?(?:\s+vertically)?[.!]?\s*$/i.test(mobile.stackingRejection))
      errors.push(`${prefix}.mobileBlueprint cannot be only “stack vertically”`);
    if (!mobile.desktopTranslation || !Array.isArray(mobile.desktopTranslation.retained) || !Array.isArray(mobile.desktopTranslation.translated) || !Array.isArray(mobile.desktopTranslation.removed) || !Array.isArray(mobile.desktopTranslation.replaced))
      errors.push(`${prefix}.mobileBlueprint must classify retained, translated, removed, and replaced desktop features`);
    if (!Array.isArray(mobile.verificationChecks) || mobile.verificationChecks.length < 13) errors.push(`${prefix}.mobileBlueprint must include the complete mobile verification checklist`);
  }
  if (tier === "expressive" || tier === "award") {
    if (!page.expression && !nonEmpty(page.intentionalCalm)) errors.push(`${prefix} needs an expression contract or a documented intentional-calm rationale`);
    if (page.expression) {
      const expression = page.expression;
      if ([expression.mechanism, expression.communicates, expression.projectFit, expression.location, expression.mobileTranslation, expression.reducedMotion, expression.fallback, expression.verification].some((field) => !nonEmpty(field)))
        errors.push(`${prefix}.expression is incomplete`);
      if (/\b(fade|slide|stagger|hover|scale|gradient|large typography)\b/i.test(expression.mechanism) && !/\b(content|state|progress|selection|navigation|transform|spatial|relationship)\b/i.test(expression.communicates))
        errors.push(`${prefix}.expression is decorative-only`);
    }
  }
  return errors;
}

export function validatePlan(value: unknown): string[] {
  const errors: string[] = [];
  const plan = value as Partial<DirectDesignPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  if (plan.version !== 2 && plan.version !== 3) errors.push("plan.version must be 2 (legacy) or 3");
  if (plan.version === 3 && plan.doctrineVersion !== 3) errors.push("plan.doctrineVersion must be 3 for v3 plans");
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
    if (plan.version === 3 && plan.depth && plan.tier) errors.push(...validateV3Page(page, pagePrefix, plan.depth, plan.tier));
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
      if (plan.version === 3) {
        for (const [criterionIndex, criterion] of (section.verification ?? []).entries()) {
          const criterionPrefix = `${prefix}.verification[${criterionIndex}]`;
          if (typeof criterion === "string") errors.push(`${criterionPrefix} must be a typed verification criterion`);
          else if (!nonEmpty(criterion.id) || !nonEmpty(criterion.claim) || !criterion.kind || criterion.pageId !== page.id || (criterion.sectionId !== undefined && criterion.sectionId !== section.id) || !Array.isArray(criterion.viewports) || criterion.viewports.length === 0)
            errors.push(`${criterionPrefix} must associate id, claim, kind, page, section, and viewports`);
        }
      }
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
        if ((plan.doctrineVersion === 2 || plan.doctrineVersion === 3) && (!asset.importance || !asset.preparation))
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
  if (plan.version === 3) {
    if (!plan.coherence || !nonEmpty(plan.coherence.globalVisualLanguage) || !nonEmpty(plan.coherence.globalInteractionLanguage) || !concreteList(plan.coherence.sharedPrimitives) || !concreteList(plan.coherence.crossPageContinuity) || !concreteList(plan.coherence.prohibitedRepeatedShells))
      errors.push("plan.coherence must define global languages, shared primitives, continuity, and prohibited repeated shells");
    if (!Array.isArray(plan.coherence?.pageSpecificCompositions) || plan.coherence.pageSpecificCompositions.length !== (plan.pages?.length ?? 0))
      errors.push("plan.coherence.pageSpecificCompositions must cover every page");
    if ((plan.tier === "expressive" || plan.tier === "award") && !(plan.pages ?? []).some((page) => page.expression))
      errors.push(`${plan.tier} multi-page plans require at least one authored expression mechanism across the product`);
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
  if (report.version !== 1 && report.version !== 2) errors.push("verification report version must be 1 (legacy) or 2");
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
    if (report.version === 2) {
      if (!item.kind || !["visual", "interaction", "responsive", "preservation", "structural-depth"].includes(item.kind)) errors.push(`verification.evidence[${index}].kind is required`);
      if (!nonEmpty(item.criterionId) || !nonEmpty(item.pageId) || !item.viewportClass) errors.push(`verification.evidence[${index}] must associate criterionId, pageId, and viewportClass`);
      if (item.viewportClass !== "non-visual" && !item.proof?.viewport) errors.push(`verification.evidence[${index}] visual/responsive evidence requires an exact viewport`);
      if (item.viewportClass === "desktop" && item.proof?.viewport && item.proof.viewport.width < 1200) errors.push(`verification.evidence[${index}] desktop evidence must be at least 1200px wide`);
      if (item.viewportClass === "mobile" && item.proof?.viewport && (item.proof.viewport.width < 375 || item.proof.viewport.width > 430)) errors.push(`verification.evidence[${index}] mobile evidence must be approximately 390px wide`);
      if (item.viewportClass === "narrow-mobile" && item.proof?.viewport && item.proof.viewport.width > 340) errors.push(`verification.evidence[${index}] narrow-mobile evidence must be approximately 320px wide`);
      if ((item.viewportClass === "mobile" || item.viewportClass === "narrow-mobile") && (!Array.isArray(item.mobileChecks) || item.mobileChecks.length === 0)) errors.push(`verification.evidence[${index}] mobile evidence must name the checks it proves`);
    }
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
