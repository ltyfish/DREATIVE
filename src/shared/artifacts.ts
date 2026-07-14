import type { AmbitionTier, SpecialistSkill } from "./skillSystem.js";
import type { ExpressionContract, MobileBlueprint, MobileVerificationCheck, PageRegister, SourceStrategy, StructuralDelta, TransformationDepth } from "./types.js";

export type DeliveryStatus = "planned" | "shipped" | "fallback" | "cut";
export type WorkScope = "tiny" | "substantial";
export type ProjectKind = "from-scratch" | "redesign";
export type VerificationKind = "visual" | "interaction" | "responsive" | "preservation" | "structural-depth" | "design-equity" | "concept-fidelity" | "perceptual-comparison" | "visual-regression";

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
  visualBlueprint?: VisualBlueprint;
}

export interface VisualBlueprint {
  viewportComposition: string;
  spatialRatios: string;
  primaryFocal: string;
  secondaryFocal: string;
  gridLogic: string;
  typographyRoles: string;
  materialRelationship: string;
  brandMotif: string;
  signatureLocation: string;
  signatureRole: string;
  interactionDriver: string;
  motionStart: string;
  motionEnd: string;
  sectionHandoff: string;
  mobileRecomposition: string;
  reducedMotion: string;
  commonTemplateRisk: string;
  brandSpecificity: string;
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
  kind: VerificationKind;
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
  /** v2/v3 remain readable as legacy; new artifacts must write v4. */
  version: 2 | 3 | 4;
  doctrineVersion?: 2 | 3 | 4;
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
  scope?: WorkScope;
  projectKind?: ProjectKind;
  approval?: ApprovalRecord;
  designEquity?: string;
  checkpoint?: string;
  mockupStrategy?: "mockup-first" | "straight-to-build";
  creativeParity?: CreativeParityContract;
  executionBrief?: ExecutionBrief;
  commonPatternReview?: CommonPatternReview[];
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

export interface ApprovalDecision {
  kind: "baseline" | "concept" | "final-plan";
  at: string;
  transcriptReference: string;
  choice: string;
  selectedRecommendation: boolean;
}

export interface ApprovalRecord {
  status: "pending" | "approved" | "rejected";
  approvedAt?: string;
  transcriptReferences: string[];
  approvedConcept: string;
  approvedTransformationDepth: TransformationDepth;
  approvedTier: AmbitionTier;
  approvedTreatments: SpecialistSkill[];
  selectedRecommendation: boolean;
  decisions: ApprovalDecision[];
}

export interface CreativeParityContract {
  fromScratchConcept: string;
  reconciledConcept: string;
  reconciliationChanges: string[];
  reconciliationWeakenedIdea: boolean;
  retainedCreativeAmbition: string;
  compromises: { compromise: string; reason: string }[];
}

export interface ExecutionBrief {
  approvedDecisions: string[];
  baselineDesignEquity: string[];
  selectedConcept: string;
  preservationContracts: string[];
  selectedTreatmentRules: string[];
  checkpointRequirement: string;
  verificationCriteria: string[];
}

export interface CommonPatternReview {
  pattern: string;
  decision: "use" | "revise";
  rationale: string;
  brandSpecificEvidence: string;
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
  kind?: VerificationKind;
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
  version: 1 | 2 | 3;
  generatedAt: string;
  evidence: VerificationEvidence[];
  refinement?: {
    inspectedAt: string;
    findings: string[];
    changes: string[];
    evidenceIds: string[];
  };
  perceptualComparison?: PerceptualComparison;
}

export interface PerceptualComparison {
  baselineEvidenceIds: string[];
  finalEvidenceIds: string[];
  observations: {
    distinctiveness: string;
    hierarchy: string;
    typography: string;
    colorMaterialIdentity: string;
    compositionalAuthorship: string;
    brandSpecificity: string;
    motionInteractionQuality: string;
    responsiveQuality: string;
    retainedOrSurpassedStrengths: string;
    conceptFidelity: string;
    genericTemplateRisk: string;
  };
  weaknesses: string[];
  refinementEvidenceIds: string[];
  explicitApprovalReference?: string;
  equityDecisionEvidence: { equityId: string; evidenceIds: string[] }[];
  signatureEvidenceIds: string[];
}

export interface DesignEquityItem {
  id: string;
  quality: string;
  decision: "preserve" | "transform" | "surpass" | "intentionally-remove";
  rationale: string;
  replacementOrEvolution: string;
  successCriteria: string[];
  finalEvidenceIds: string[];
  removalApprovalReference?: string;
}

export interface DesignEquityBaseline {
  version: 1;
  capturedAt: string;
  baselineQuality: "weak" | "ordinary" | "polished" | "exceptional";
  screenshots: { desktop: string[]; mobile: string[] };
  strongestVisualQualities: string[];
  weakestVisualQualities: string[];
  typographyCharacter: string;
  colorMaterialCharacter: string;
  compositionalStrengths: string[];
  hierarchyAndPacing: string;
  signatureVisualElements: string[];
  animationInteractionInventory: string[];
  mobileStrengthsAndFailures: string[];
  distinctivePatterns: string[];
  genericOrDatedPatterns: string[];
  items: DesignEquityItem[];
}

export interface VisualCheckpoint {
  version: 1;
  capturedAt: string;
  implementation: { hero: boolean; coreSection: boolean; desktop: boolean; mobile: boolean; primaryMotionLanguage: boolean };
  baselineScreenshotPaths: string[];
  screenshotPaths: { desktop: string[]; mobile: string[] };
  critique: Record<"distinctiveness" | "hierarchy" | "brandVisibility" | "signatureLegibility" | "equityRetention" | "saasTemplateRisk" | "brandSwapRisk" | "mobileAuthorship" | "motionPurpose" | "counterfactualStrength", string>;
  meaningfulWeaknessFound: boolean;
  refinements: { finding: string; change: string; evidenceIds: string[] }[];
  approval: { status: "pending" | "approved" | "rejected"; approvedAt?: string; transcriptReferences: string[] };
  systemSpreadStartedAt?: string;
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function concreteList(value: unknown, minimum = 1): value is string[] {
  return Array.isArray(value) && value.length >= minimum && value.every((item) => nonEmpty(item) && !/^(improve|modernize|make better|n\/a|none)$/i.test(item.trim()));
}

function validDate(value: unknown): value is string {
  return nonEmpty(value) && !Number.isNaN(Date.parse(value));
}

function specificText(value: unknown, minimum = 12): value is string {
  return nonEmpty(value) && value.trim().length >= minimum && !/^(modern|clean|premium|creative|unique|impressive|better|n\/a|none)$/i.test(value.trim());
}

const COMMON_PATTERN = /\b(split hero|left[- ]copy|right[- ]image|three[- ]column|2x2|two[- ]by[- ]two|feature cards?|stat(?:istic)? row|pale (?:logo )?box|hairline divider|dark rectangle|standard saas|hero.*features.*stats.*cta)\b/i;

function validateVisualBlueprint(blueprint: VisualBlueprint | undefined, prefix: string): string[] {
  if (!blueprint) return [`${prefix}.visualBlueprint is required for substantial v4 work`];
  const errors: string[] = [];
  for (const [key, value] of Object.entries(blueprint)) {
    if (!specificText(value)) errors.push(`${prefix}.visualBlueprint.${key} must be concrete and implementation-ready`);
  }
  if (/^(split hero|large logo|hairline rules?|feature grid)$/i.test(blueprint.viewportComposition.trim()))
    errors.push(`${prefix}.visualBlueprint.viewportComposition is a generic label, not a composition`);
  return errors;
}

function validateV4Controls(plan: Partial<DirectDesignPlan>): string[] {
  const errors: string[] = [];
  if (plan.doctrineVersion !== 4) errors.push("plan.doctrineVersion must be 4 for v4 plans");
  if (!plan.scope || !["tiny", "substantial"].includes(plan.scope)) errors.push("plan.scope must classify tiny or substantial work");
  if (!plan.projectKind || !["from-scratch", "redesign"].includes(plan.projectKind)) errors.push("plan.projectKind must classify from-scratch or redesign work");
  if (plan.scope !== "substantial") return errors;
  const approval = plan.approval;
  if (!approval || approval.status !== "approved" || !validDate(approval.approvedAt)) errors.push("substantial work requires an approved typed approval record");
  else {
    if (!concreteList(approval.transcriptReferences) || !specificText(approval.approvedConcept) || approval.approvedTransformationDepth !== plan.depth || approval.approvedTier !== plan.tier || !Array.isArray(approval.approvedTreatments))
      errors.push("approval must record transcripts, concept, transformation depth, tier, and treatments");
    const decisions = new Set((approval.decisions ?? []).map((item) => item.kind));
    for (const required of plan.projectKind === "redesign" ? ["baseline", "concept", "final-plan"] : ["concept", "final-plan"])
      if (!decisions.has(required as ApprovalDecision["kind"])) errors.push(`approval is missing the ${required} decision`);
    for (const [index, decision] of (approval.decisions ?? []).entries())
      if (!validDate(decision.at) || !specificText(decision.transcriptReference, 3) || !specificText(decision.choice)) errors.push(`approval.decisions[${index}] is incomplete`);
    const ordered = approval.decisions ?? [];
    if (ordered.some((decision, index) => index > 0 && Date.parse(decision.at) <= Date.parse(ordered[index - 1].at))) errors.push("approval decisions must be sequential and chronologically ordered");
    const finalDecision = ordered.find((decision) => decision.kind === "final-plan");
    if (finalDecision && Date.parse(finalDecision.at) !== Date.parse(approval.approvedAt!)) errors.push("approval.approvedAt must equal the final-plan decision timestamp");
    if (validDate(plan.createdAt) && Date.parse(plan.createdAt) > Date.parse(approval.approvedAt!)) errors.push("the plan must be created before final approval");
    if (plan.implementationStartedAt && (!validDate(plan.implementationStartedAt) || Date.parse(plan.implementationStartedAt) <= Date.parse(approval.approvedAt!)))
      errors.push("implementationStartedAt must be later than final plan approval");
  }
  if (plan.projectKind === "redesign" && !nonEmpty(plan.designEquity)) errors.push("substantial redesigns require a design-equity artifact reference");
  if (plan.projectKind === "redesign" && (plan.depth === "restructure" || plan.depth === "reimagine")) {
    if (!nonEmpty(plan.checkpoint)) errors.push(`${plan.depth} requires a visual checkpoint artifact reference`);
    const parity = plan.creativeParity;
    if (!parity || !specificText(parity.fromScratchConcept, 30) || !specificText(parity.reconciledConcept, 30) || !concreteList(parity.reconciliationChanges) || !specificText(parity.retainedCreativeAmbition, 20) || !Array.isArray(parity.compromises))
      errors.push(`${plan.depth} requires a concrete from-scratch creative-parity contract`);
    const implementationText = [parity?.fromScratchConcept, parity?.reconciledConcept, ...(parity?.reconciliationChanges ?? []), ...(plan.pages ?? []).flatMap((page) => page.sections.map((section) => `${section.layoutFamily} ${section.interactions.join(" ")} ${section.motionTreatment?.mechanism ?? ""}`))].join(" ");
    const fakeParts = [/(new|different) font/i, /(new|different) colou?r/i, /split hero/i, /feature cards?/i, /(entrance|fade)/i].filter((pattern) => pattern.test(implementationText)).length;
    if (fakeParts >= 4 && !/\b(custom|brand-derived|procedural|kinetic|editorial|spatial|interactive|asymmetric|choreograph|transform)\b/i.test(implementationText))
      errors.push(`${plan.depth} fails creative parity: font, color, split hero, cards, and entrance fades do not constitute an authored redesign`);
  }
  const brief = plan.executionBrief;
  if (!brief || !concreteList(brief.approvedDecisions, 2) || !specificText(brief.selectedConcept, 20) || !concreteList(brief.preservationContracts) || !concreteList(brief.selectedTreatmentRules) || !specificText(brief.checkpointRequirement) || !concreteList(brief.verificationCriteria))
    errors.push("substantial work requires a compact executable creative brief");
  if (!Array.isArray(plan.commonPatternReview)) errors.push("substantial work requires a common-pattern risk review");
  for (const [pageIndex, page] of (plan.pages ?? []).entries()) for (const [sectionIndex, section] of page.sections.entries())
    errors.push(...validateVisualBlueprint(section.visualBlueprint, `pages[${pageIndex}].sections[${sectionIndex}]`));
  const usedCommonPatterns = (plan.pages ?? []).flatMap((page) => page.sections).filter((section) => COMMON_PATTERN.test(`${section.layoutFamily} ${section.visualBlueprint?.viewportComposition ?? ""}`));
  for (const section of usedCommonPatterns) {
    const review = plan.commonPatternReview?.find((item) => normalizedPattern(item.pattern) === normalizedPattern(section.layoutFamily) || COMMON_PATTERN.test(item.pattern));
    if (!review || !specificText(review.rationale, 20) || !specificText(review.brandSpecificEvidence, 20)) errors.push(`${section.name}: common layout family requires project-specific rationale and brand evidence`);
  }
  return errors;
}

function normalizedPattern(value: string): string { return value.trim().toLowerCase(); }

function validateModernPage(page: PlanPage, prefix: string, depth: TransformationDepth, tier: AmbitionTier): string[] {
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
  if (plan.version !== 2 && plan.version !== 3 && plan.version !== 4) errors.push("plan.version must be 2/3 (legacy) or 4");
  if (plan.version === 3 && plan.doctrineVersion !== 3) errors.push("plan.doctrineVersion must be 3 for v3 plans");
  if (plan.version === 4) errors.push(...validateV4Controls(plan));
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
    if ((plan.version === 3 || plan.version === 4) && plan.depth && plan.tier) errors.push(...validateModernPage(page, pagePrefix, plan.depth, plan.tier));
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
      if (plan.version === 3 || plan.version === 4) {
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
  if (plan.version === 3 || plan.version === 4) {
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

export function validateDesignEquityBaseline(value: unknown): string[] {
  const baseline = value as Partial<DesignEquityBaseline> | null;
  if (!baseline || typeof baseline !== "object") return ["design equity baseline must be an object"];
  const errors: string[] = [];
  if (baseline.version !== 1) errors.push("design equity version must be 1");
  if (!validDate(baseline.capturedAt)) errors.push("design equity capturedAt must be a valid date");
  if (!baseline.baselineQuality || !["weak", "ordinary", "polished", "exceptional"].includes(baseline.baselineQuality)) errors.push("design equity baselineQuality is invalid");
  if (!concreteList(baseline.screenshots?.desktop) || !concreteList(baseline.screenshots?.mobile)) errors.push("design equity requires desktop and mobile baseline screenshots");
  for (const [name, value] of Object.entries({
    strongestVisualQualities: baseline.strongestVisualQualities, weakestVisualQualities: baseline.weakestVisualQualities,
    compositionalStrengths: baseline.compositionalStrengths, signatureVisualElements: baseline.signatureVisualElements,
    animationInteractionInventory: baseline.animationInteractionInventory, mobileStrengthsAndFailures: baseline.mobileStrengthsAndFailures,
    distinctivePatterns: baseline.distinctivePatterns, genericOrDatedPatterns: baseline.genericOrDatedPatterns,
  })) if (!concreteList(value)) errors.push(`design equity ${name} cannot be empty`);
  for (const [name, value] of Object.entries({ typographyCharacter: baseline.typographyCharacter, colorMaterialCharacter: baseline.colorMaterialCharacter, hierarchyAndPacing: baseline.hierarchyAndPacing }))
    if (!specificText(value)) errors.push(`design equity ${name} must be concrete`);
  if (!Array.isArray(baseline.items) || baseline.items.length === 0) errors.push("design equity requires at least one valuable-quality decision");
  for (const [index, item] of (baseline.items ?? []).entries()) {
    if (!nonEmpty(item.id) || !specificText(item.quality) || !["preserve", "transform", "surpass", "intentionally-remove"].includes(item.decision) || !specificText(item.rationale) || !specificText(item.replacementOrEvolution) || !concreteList(item.successCriteria) || !Array.isArray(item.finalEvidenceIds)) errors.push(`design equity item ${index} is incomplete`);
  }
  return errors;
}

export function validateVisualCheckpoint(value: unknown): string[] {
  const checkpoint = value as Partial<VisualCheckpoint> | null;
  if (!checkpoint || typeof checkpoint !== "object") return ["visual checkpoint must be an object"];
  const errors: string[] = [];
  if (checkpoint.version !== 1 || !validDate(checkpoint.capturedAt)) errors.push("visual checkpoint needs version 1 and a valid capturedAt");
  if (!checkpoint.implementation || Object.values(checkpoint.implementation).some((done) => done !== true)) errors.push("visual checkpoint must cover hero, core section, desktop, mobile, and primary motion language");
  if (!concreteList(checkpoint.baselineScreenshotPaths) || !concreteList(checkpoint.screenshotPaths?.desktop) || !concreteList(checkpoint.screenshotPaths?.mobile)) errors.push("visual checkpoint requires baseline, desktop, and mobile screenshots");
  const critiqueKeys = ["distinctiveness", "hierarchy", "brandVisibility", "signatureLegibility", "equityRetention", "saasTemplateRisk", "brandSwapRisk", "mobileAuthorship", "motionPurpose", "counterfactualStrength"];
  if (!checkpoint.critique || critiqueKeys.some((key) => !specificText(checkpoint.critique?.[key as keyof VisualCheckpoint["critique"]], 20))) errors.push("visual checkpoint critique must answer every perceptual question concretely");
  if (!Array.isArray(checkpoint.refinements) || (checkpoint.meaningfulWeaknessFound === true && checkpoint.refinements.length === 0)) errors.push("a meaningful checkpoint weakness requires at least one refinement");
  if (!checkpoint.approval || checkpoint.approval.status !== "approved" || !validDate(checkpoint.approval.approvedAt) || !concreteList(checkpoint.approval.transcriptReferences)) errors.push("visual checkpoint requires recorded user approval");
  if (checkpoint.systemSpreadStartedAt && (!validDate(checkpoint.systemSpreadStartedAt) || Date.parse(checkpoint.systemSpreadStartedAt) <= Date.parse(checkpoint.approval?.approvedAt ?? ""))) errors.push("systemSpreadStartedAt must be later than checkpoint approval");
  return errors;
}

export function validateVerificationReport(value: unknown): string[] {
  const report = value as Partial<VerificationReport> | null;
  if (!report || typeof report !== "object") return ["verification report must be an object"];
  const errors: string[] = [];
  if (report.version !== 1 && report.version !== 2 && report.version !== 3) errors.push("verification report version must be 1/2 (legacy) or 3");
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
    if (report.version === 2 || report.version === 3) {
      if (!item.kind || !["visual", "interaction", "responsive", "preservation", "structural-depth", "design-equity", "concept-fidelity", "perceptual-comparison", "visual-regression"].includes(item.kind)) errors.push(`verification.evidence[${index}].kind is required`);
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
  if (report.version === 3 && report.perceptualComparison) {
    const comparison = report.perceptualComparison;
    if (!concreteList(comparison.baselineEvidenceIds) || !concreteList(comparison.finalEvidenceIds) || !concreteList(comparison.signatureEvidenceIds) || !Array.isArray(comparison.equityDecisionEvidence)) errors.push("perceptual comparison requires baseline, final, signature, and equity evidence associations");
    if (!comparison.observations || Object.values(comparison.observations).some((value) => !specificText(value, 20))) errors.push("perceptual comparison observations must be concrete, not ‘looks better’");
    if (!Array.isArray(comparison.weaknesses) || !Array.isArray(comparison.refinementEvidenceIds)) errors.push("perceptual comparison must record weaknesses and refinement evidence");
    if (comparison.weaknesses.length > 0 && comparison.refinementEvidenceIds.length === 0 && !specificText(comparison.explicitApprovalReference, 3)) errors.push("perceptual weaknesses require refinement evidence or explicit approval");
  }
  return errors;
}
