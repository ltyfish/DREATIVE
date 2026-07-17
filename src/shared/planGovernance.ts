import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";
import { detectProjectPreflight, type ProjectPreflight } from "./preflight.js";
import { hashFiles, sourceFiles } from "./projectIdentity.js";
import type { SpecialistSkill } from "./skillSystem.js";
import { treatment } from "./treatments.js";
import type { DesignAmbition, EvaluationPurpose, ExecutionMode, PrototypePolicy, WorkflowConfiguration } from "./workflow.js";

export const PLAN_VERSION = 9;
export const PLAN_FILE = ".dreative/plan.yaml";
export const AMBITIONS: DesignAmbition[] = ["standard", "expressive", "award", "experimental"];
export const EXECUTIONS: ExecutionMode[] = ["fast", "lean", "full-audit"];
export const PROTOTYPES: PrototypePolicy[] = ["skip", "auto", "required"];
export const PURPOSES: EvaluationPurpose[] = ["project-delivery", "production-certification", "dreative-dogfood"];
export const TREATMENTS: SpecialistSkill[] = ["ux", "mobile", "refined", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"];

export interface PlanTarget {
  repoRoot: string;
  previewUrl: string | null;
  previewCommand: string | null;
  routeScope: { mode: "one-page" | "selected-routes" | "whole-site"; routes: string[] };
  baselineUrls: string[];
  packageManager: string;
  buildCommand: string | null;
  testCommand: string | null;
  framework: string;
  deploymentTarget: string | null;
  devicePriorities: { name: string; width: number }[];
}

export interface TreatmentAllocation {
  treatment: SpecialistSkill;
  priority: "primary" | "supporting" | "foundation";
  locations: string[];
  contribution: string;
  dependencies: SpecialistSkill[];
  acceptance: string[];
  routeRole: "peak" | "connective-tissue" | "foundation";
  mechanismIds?: string[];
  mobileObligation?: string;
  reducedMotionObligation?: string;
  failureCriteria?: string[];
}

export type TreatmentDecisionState = "foundational" | "recommended" | "selected" | "declined" | "not-applicable";
export interface TreatmentDecision {
  treatment: SpecialistSkill;
  state: TreatmentDecisionState;
  explicitlyDecided: boolean;
  reason: string;
}

export type ExperienceSectionRole = "peak" | "transformation" | "preparation" | "echo" | "rest" | "resolution" | "functional-utility";
export type SpatialAssetClassification = "model" | "spatial-cutout" | "layered-billboard" | "pre-rendered-angles" | "frame-sequence" | "webgl-media-plane" | "static-image";
export type MechanismExecutionStatus = "pending" | "in-progress" | "primary-delivered" | "fallback-triggered" | "approved-change" | "not-applicable" | "failed";
export type RuntimeMechanismFamily =
  | "frame-sequence" | "video-scrub" | "shader-media" | "particle-reconstruction" | "tile-slice-fold"
  | "depth-parallax" | "camera-travel" | "spatial-field" | "shared-element-handoff" | "kinetic-type"
  | "hold-charge-release" | "layout-transition" | "ordinary-control" | "rigid-media-plane" | "decorative-motion";
export type RuntimeInputDriver = "scroll-progress" | "velocity" | "pointer" | "drag" | "hold" | "time" | "audio" | "route" | "keyboard";
export type ApprovalMode = "human" | "pre-authorized-dogfood";
export type MechanismStatus = "not-started" | "prototype-passed" | "implemented" | "verified" | "failed" | "fallback-triggered" | "approved-change" | "removed";

export interface RequirementTrace {
  id: string;
  source: string;
  wording: string;
  plannedImplementation: string;
  routeOrComponent: string;
  browserTest: string;
  evidenceId: string;
  status: "planned" | "implemented" | "verified" | "failed" | "removed";
}

export interface SectionContract {
  id: string;
  route: string;
  narrativePurpose: string;
  mainUserAction: string;
  visualRole: string;
  mediaRole: string;
  interactionRole: string;
  entryState: string;
  activeState: string;
  resolvedState: string;
  handoff: string;
  mobileBehavior: string;
  reducedMotionBehavior: string;
  fallbackBehavior: string;
  verificationRequirement: string;
}

export interface MechanismContract {
  id: string;
  catalogueSourceOrCustomRationale: string;
  routeOrSection: string;
  inputDriver: RuntimeInputDriver | "click" | "media-progress";
  startState: string;
  activeState: string;
  endState: string;
  reverseBehavior: string;
  rapidInputBehavior: string;
  refreshAtProgressBehavior: string;
  mobileBehavior: string;
  reducedMotionBehavior: string;
  dependency: string;
  performanceExpectation: string;
  approvedFallback: string;
  fallbackTrigger: string;
  requiredCaptureStates: string[];
  successCriteria: string[];
  failureCriteria: string[];
}

export interface RuntimeStateSample {
  progress: 0 | 25 | 50 | 75 | 100;
  captureId: string;
  artifactHash: string;
  compositionStateHash: string;
  observedProperties: { property: string; value: string | number | boolean }[];
  channels: ("camera" | "media" | "type" | "light" | "sound" | "depth" | "layout" | "material")[];
  pixelDifferenceFromPrevious?: number;
  structuralDifferenceFromPrevious?: number;
  frameIndex?: number;
  mediaCurrentTime?: number;
  camera?: { position: [number, number, number]; rotation: [number, number, number]; fov: number };
  uniforms?: Record<string, number>;
  particleState?: { activeCount: number; spread: number; reassembly: number };
  maskProgress?: number;
}

export interface RuntimeMechanismObservation {
  id: string;
  sectionId: string;
  continuityOwner: string;
  implementationFile: string;
  componentOrSelector: string;
  mechanismFamily: RuntimeMechanismFamily;
  spatialClassification: SpatialAssetClassification;
  sourceAssets: string[];
  inputDrivers: RuntimeInputDriver[];
  samples: RuntimeStateSample[];
  postHero: boolean;
  assetTransformsInternally: boolean;
  pinnedOrControlledComposition: boolean;
  nonObviousBehavior: boolean;
  neutralStylingStillSpecial: boolean;
  handoff?: { targetMechanismId: string; persistedObjectOrState: string; ownerImplementation: string };
  mobile: { authored: boolean; mechanismFamily: RuntimeMechanismFamily; captureIds: string[]; disabled: boolean };
  reducedMotion: { authoredComposition: boolean; captureIds: string[] };
  reverse: { relevant: boolean; tested: boolean; result: "pass" | "fail" | "not-applicable"; evidenceIds: string[] };
  performance: { averageFps: number; worstFrameTimeMs: number; longTasks: number; transferredBytes: number; heavyChunkBytes: number };
  recordingIds: string[];
}

export interface SignatureMediaProductionPackage {
  id: string;
  sourceAssets: string[];
  derivatives: { path: string; role: string; bytes: number }[];
  implementationConsumers: string[];
  optimization: string[];
  temporalEvidenceIds: string[];
  mobileVariant: string;
  reducedMotionAsset: string;
}

export interface CapabilityActionRecord {
  capabilityId: string;
  action: "install" | "search" | "fallback" | "exemption-request";
  attemptedAt: string;
  commandOrProvider: string;
  result: "succeeded" | "failed" | "selected" | "pending-user-approval";
  evidenceIds: string[];
  selectedFallback: string;
  userReapprovalRequired: boolean;
}

export interface ExperienceDistributionEntry {
  pageId: string;
  sectionId: string;
  order: number;
  role: ExperienceSectionRole;
  continuityContribution: string;
  peakId?: string;
}

export interface MechanismFallbackContract {
  id: string;
  location: string;
  primaryImplementation: string;
  primaryAcceptance: string[];
  fallbackImplementation: string;
  fallbackTrigger: string;
  triggerEvidenceRequired: string[];
  userReapprovalRequired: boolean;
  allowedSubstitutions: string[];
  riskFamily: string;
  prototypePolicy: string;
}

export interface AssetStrategyEntry {
  id: string;
  intendedRole: string;
  requiredSubjectAndComposition: string;
  priority: "user-supplied" | "external-sourced" | "generated" | "procedural";
  sourcingPolicy: "external-first" | "generation-first-exemption" | "supplied-only" | "procedural";
  generationPolicy: "allowed-with-advantage" | "not-allowed" | "required-bespoke";
  generationRationale: string;
  classification: SpatialAssetClassification;
  rightsRequirements: string[];
  expectedFormatsAndVariants: string[];
  requiredLocations: string[];
  reusePolicy: string;
  suitableExternalMediaCouldExist: boolean;
  sizeBudgetBytes?: number;
}

export interface ExperimentalPeakContract {
  id: string;
  chapter: string;
  mechanismFamily: string;
  plannedBehaviour: string;
  startState: string;
  activeState: string;
  resolution: string;
  inputRelationship: string;
  mobileStrategy: string;
  reducedMotionStrategy: string;
  fallbackState: string;
  prototypeRiskFamily: string;
  acceptance: string[];
}

export interface PrototypeContract {
  id: string;
  riskFamily: string;
  mechanismId: string;
  required: boolean;
  uncertainty: string;
  acceptanceConditions: string[];
  maximumScope: string;
  failureImplications: string;
}

export interface ExperienceArc {
  openingState: string;
  firstTransformation: string;
  sectionProgression: string;
  peaksAndRests: string;
  persistentSystem: string;
  userControlledMoment: string;
  mobileTranslation: string;
  finalResolution: string;
}

export type MediaPermission = "allowed" | "not-allowed" | "ask-per-asset";

export interface CreativeSourcePolicy {
  references: {
    preference: "provided" | "none" | "open-to-suggestions" | null;
    urls: string[];
    notes: string[];
    antiReferences: string[];
  };
  generatedImages: MediaPermission | null;
  sourcedImages: MediaPermission | null;
  generatedVideo: MediaPermission | null;
  sourcedVideo: MediaPermission | null;
  threeDAssets: "not-allowed" | "supplied-only" | "external-sourcing-allowed" | "generation-and-sourcing-allowed" | "ask-per-asset" | null;
  suppliedImageAssets: string[];
  suppliedVideoAssets: string[];
  suppliedThreeDAssets: string[];
  missingOrNeededAssets: string[];
}

export interface PlanContract {
  createdAt?: string;
  sourceBaselineHashAtCreation?: string;
  projectDefinition?: {
    purpose: string; targetAudience: string; primaryUserJourney: string; routes: string[];
    requiredFunctionality: string[]; extractedRequirements: string[]; nonGoals: string[]; preservedContentOrFunctionality: string[];
  };
  creativeDirection?: {
    selectedConcept: string; fitRationale: string; nonGenericQualities: string; visualLanguage: string;
    compositionStrategy: string; typographyStrategy: string; mediaStrategy: string; motionInteractionPhilosophy: string;
    experienceProgression: string;
  };
  sectionContracts?: SectionContract[];
  continuityContract?: {
    owner: string; medium: "DOM" | "SVG" | "Canvas" | "WebGL" | "media" | "hybrid"; sourceOwner: string;
    sectionChanges: string; persistenceVerification: string; breakConditions: string;
  };
  mechanismContracts?: MechanismContract[];
  requirementTraceability?: RequirementTrace[];
  packagePlan?: {
    assets: string[]; rightsAndSources: string[]; placeholderRestrictions: string[]; derivatives: string[];
    mobileAssetStrategy: string; mechanismPackages: string[]; installPermission: boolean; preflightResults: string[];
    prototypeProof: string[];
  };
  verificationPlan?: {
    viewports: { width: number; height: number; name: string }[];
    interactions: { id: string; route: string; action: string; selector?: string; value?: string; mechanismId?: string }[];
    mechanismStates: string[]; mobileTests: string[]; reducedMotionTests: string[]; accessibilityChecks: string[];
    performanceChecks: string[]; mediaNetworkChecks: string[]; criticInputs: string[]; finalizationBlockers: string[];
  };
  target: PlanTarget;
  scope: {
    substantial: boolean;
    projectKind: "from-scratch" | "redesign";
    routes: string[];
    requiredFunctionality: string[];
    preservedContentAndBrand: string[];
    dependencyInstallationAllowed: boolean | null;
    performanceConstraints: string[];
    successCriteria: string[];
  };
  creativeSources: CreativeSourcePolicy;
  capabilityPreflight?: ProjectPreflight;
  workflow: WorkflowConfiguration;
  transformationDepth: "restyle" | "relayout" | "restructure" | "reimagine";
  selectedTreatments: SpecialistSkill[];
  treatmentDecisions: TreatmentDecision[];
  allTreatmentsExplicit: boolean;
  allTreatmentsConfirmed: boolean;
  treatmentAllocation: TreatmentAllocation[];
  continuityOwner: "immersive" | "cinematic" | "motion" | "none";
  preservationRequirements: string[];
  selectedConcept: string;
  blueprint: { pageId: string; sectionId: string; intent: string; signatureMoment?: string }[];
  experienceDistribution: ExperienceDistributionEntry[];
  experimentalPeaks: ExperimentalPeakContract[];
  prototypeContracts: PrototypeContract[];
  assetStrategy: AssetStrategyEntry[];
  experienceArc?: ExperienceArc;
  motionAndMediaStrategy: string;
  mobileTranslation: string;
  functionalTruthRequirements: string[];
  performanceBudget: string[];
  acceptanceCriteria: string[];
  mechanismFallbacks: MechanismFallbackContract[];
  videoDeliveryDecision?: {
    decision: "video" | "frame-sequence-or-prerendered-motion" | "approved-exemption";
    reason: string;
    processingRoute: string;
    mobileStrategy: string;
    reducedMotionStrategy: string;
    approvalReference?: string;
  };
  conceptExemptions: { gate: string; reason: string; approved: boolean }[];
  changeRequests: {
    id: string;
    requestedAt: string;
    status: "pending" | "approved" | "rejected";
    fields: string[];
    reason: string;
    consequence: string;
    alternative: string;
  }[];
}

export interface PlanApproval {
  status: "pending" | "approved" | "invalidated";
  revision: number;
  contractHash: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  approvalMode?: ApprovalMode;
  approvalOrigin?: "interactive-user" | "explicit-preauthorization";
  approvedSourceBaselineHash?: string | null;
  decisionHistory: { at: string; decision: string; contractHash: string | null; note?: string }[];
}

export interface PlanExecution {
  firstMaterialSourceChangeAt?: string | null;
  planSummaryShownAt?: string | null;
  currentPhase: string;
  phases: { id: string; status: "pending" | "in-progress" | "completed" | "failed"; completedAt?: string; error?: string }[];
  checkpoints: {
    mechanismPrototype?: { status: "not-required" | "pending" | "passed" | "failed"; scope: string; evidenceIds: string[] };
    conceptCheckpoint?: {
      status: "not-required" | "pending" | "passed" | "failed";
      actualHero: boolean;
      downstreamSection: boolean;
      realVisualSystem: boolean;
      mainTemporalOrMediaIdea: boolean;
      mobile390: boolean;
      reducedMotion: boolean;
      realApplication: boolean;
      reviewer: "user" | "independent-critic" | "none";
      evidenceIds: string[];
    };
    ambitionPrototype?: {
      status: "not-required" | "pending" | "passed" | "failed" | "approved-with-required-revisions";
      representativeFinalQualityMedia: boolean;
      completePostHeroPeak: boolean;
      trueAssetTransformation: boolean;
      recordingDurationSeconds: number;
      desktopAuthored: boolean;
      mobileAuthored: boolean;
      independentCritic: boolean;
      provisionalLimitations: string[];
      requiredRevisions: string[];
      evidenceIds: string[];
    };
    adaptiveSpread?: {
      status: "not-required" | "pending" | "passed" | "failed";
      approval: "none" | "internal" | "explicit";
      desktopEvidenceIds: string[];
      mobileEvidenceIds: string[];
      peakEvidence: { peakId: string; start: string[]; active: string[]; resolved: string[] }[];
      mechanismTableComplete: boolean;
      fallbackDisclosureComplete: boolean;
      sectionRoleCoverageComplete: boolean;
      continuousRecordingRequired: boolean;
      continuousRecordingEvidenceIds: string[];
      mobileRecordingRequired: boolean;
      mobileRecordingEvidenceIds: string[];
      reverseScrollRequired: boolean;
      reverseScrollEvidenceIds: string[];
      montageRequired: boolean;
      montageEvidenceIds: string[];
      approvedAt?: string;
    };
  };
  bindings: { id: string; treatment: SpecialistSkill; files: string[]; selectors: string[]; mechanism: string; evidenceIds: string[] }[];
  mechanisms: {
    id: string; status: MechanismExecutionStatus; finalReason: string; triggerObserved: boolean; triggerEvidenceIds: string[];
    observedImplementation: string; observedEvidenceIds: string[]; substitutionUsed: string | null; approvalReference: string | null;
    criticVerdict: "pending" | "pass" | "fail";
  }[];
  prototypes: {
    id: string; status: "pending" | "in-progress" | "passed" | "failed" | "skipped"; attemptCount: number; evidenceIds: string[];
    observedResults: string[]; correctiveIterations: string[]; implementationDecision: string;
  }[];
  prototypeGate?: {
    prototypeId: string;
    location: string;
    startedAt: string;
    verifiedAt: string | null;
    decidedAt: string | null;
    decision: "approved-for-integration" | "revise-prototype" | "fallback-approved" | "mechanism-declined" | null;
    sourceHash: string;
    verificationRunId: string | null;
  };
  assets: {
    id: string; sourcingAttempts: { provider: string; query: string; at: string; result: string }[]; preSearchExemption: string;
    candidatesFound: { url: string; rights: string }[]; selectedSource: string | null; generatedDetails: string;
    actualFiles: string[]; actualSizes: Record<string, number>; productionDerivatives: string[]; usageLocations: string[];
    browserObserved: boolean; survivedFinalImplementation: boolean; removedOrSubstituted: boolean; finalRightsRecord: string;
    shipping: boolean; mobileVariant?: string; poster?: string; loadingStrategy?: string;
  }[];
  capabilityActions: CapabilityActionRecord[];
  runtimeObservations: RuntimeMechanismObservation[];
  signatureMediaPackages: SignatureMediaProductionPackage[];
  evidence: {
    transformations: string[];
    sceneHandoffs: string[];
    meaningfulInteractions: string[];
    persistentSystemSections: string[];
    pacing: string[];
    mobileNative: string[];
    reducedMotion: string[];
    treatmentEvidence: Partial<Record<SpecialistSkill, string[]>>;
    motionVocabulary: string[];
    postFirstViewportEvents: string[];
    treatmentObservations: Partial<Record<SpecialistSkill, {
      start: string[];
      active: string[];
      resolved: string[];
      inputEffect: string[];
      mobile: string[];
      fallback: string[];
      assetClassifications?: SpatialAssetClassification[];
    }>>;
  };
  run?: {
    runId: string;
    contractHash: string;
    sourceHash: string;
    gitIdentity: string | null;
    createdAt: string;
    workflow: WorkflowConfiguration;
    planVersion: number;
    capabilityPreflightIdentity: string;
    contractTitle: string;
    evidenceFiles: string[];
    assetManifest: string[];
    approvedChangeRequests: string[];
    finalizationStatus: "pending" | "passed" | "failed";
  };
  assetObservation?: {
    manifestEntries: string[];
    filesOnDisk: string[];
    applicationReferences: string[];
    weights: Record<string, number>;
  };
  browserValidation?: {
    checkedAt: string;
    visibleImages: { selector: string; complete: boolean; naturalWidth: number; primary: boolean; altFallbackVisible?: boolean }[];
    failedRequests: { url: string; type: string; status?: number }[];
    unexpectedHttpErrors: { url: string; status: number }[];
    emptyCanvases: string[];
    webglDraws: { selector: string; drawCount: number }[];
    consoleErrors: string[];
    runtimeErrors: string[];
    productionMediaMissing: string[];
  };
  runtime?: {
    packageTransactions: { group: string; status: "pending" | "installed" | "rolled-back" | "failed"; packages: string[]; error?: string }[];
    tickerOwner: string | null;
    scrollOwner: string | null;
    competingOwners: string[];
  };
  critic?: {
    independence: "fresh-agent" | "fresh-context" | "degraded";
    approvedContractHash: string;
    firstPassInputs: string[];
    builderContextExcluded: boolean;
    recordings: { desktop: string[]; mobile: string[] };
    scores: Record<string, number>;
    blockers: string[];
    majorIssues: string[];
    verdict: "pass" | "pass-with-concerns" | "fail";
  };
  dogfood?: {
    questionsRequired: string[];
    questionsAsked: string[];
    incorrectlyDefaulted: string[];
    choicesAndRecommendationsShown: string[];
    treatmentExplanationsAndWarnings: string[];
    planCreatedAt: string;
    planApprovedAt: string | null;
    materialMutations: string[];
    prototypeResult: string;
    conceptCheckpointResult: string;
    failures: string[];
    fallbacks: string[];
    criticFindings: string[];
    auditFailuresAndCorrections: string[];
    staticRisk: string;
    falsePositiveRisk: string;
    verdict: "pass" | "pass-with-concerns" | "fail";
  };
  lastUpdatedAt: string;
}

export interface CanonicalPlan {
  version: 9;
  contract: PlanContract;
  approval: PlanApproval;
  execution: PlanExecution;
}

export interface IntakeResolution {
  target: PlanTarget;
  missing: string[];
}

const concrete = (value: unknown, minimum = 1): value is string => typeof value === "string" && value.trim().length >= minimum;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => concrete(item));
const PLACEHOLDER = /\b(?:tbd|todo|placeholder|lorem ipsum|fill (?:this|later)|unknown)\b/i;
const plannedText = (value: unknown, minimum = 8): value is string => concrete(value, minimum) && !PLACEHOLDER.test(value);
const now = () => new Date().toISOString();
const INVALID_GENERATION_RATIONALE = /\b(generation is easier|matches the concept|agent preferred|no need to search)\b/i;
const VALID_GENERATION_DETAIL = /\b(exact|brand|packag|transparent cutout|lighting|transformation states|frame sequence|surreal|impossible|negative space|rights|geographic|source results|consisten)/i;

export function validGenerationFirstRationale(value: string): boolean {
  return concrete(value, 30) && !INVALID_GENERATION_RATIONALE.test(value) && VALID_GENERATION_DETAIL.test(value);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
}

export function contractHash(contract: PlanContract): string {
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(contract))).digest("hex");
}

export function planPath(projectDir: string): string {
  return path.join(projectDir, PLAN_FILE);
}

export function readPlan(projectDir: string): CanonicalPlan {
  const file = planPath(projectDir);
  if (!fs.existsSync(file)) throw new Error(`missing ${PLAN_FILE}; run dreative plan init`);
  let value: unknown;
  try { value = parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`cannot parse ${PLAN_FILE}: ${String(error)}`); }
  const plan = value as Partial<CanonicalPlan> | null;
  if ([7, 8].includes(Number((plan as { version?: number } | null)?.version)))
    throw new Error(`${PLAN_FILE} is canonical v${String((plan as { version?: number }).version)}; migrate it explicitly to v${PLAN_VERSION} before implementation`);
  if (!plan || plan.version !== PLAN_VERSION || !plan.contract || !plan.approval || !plan.execution)
    throw new Error(`${PLAN_FILE} must contain canonical v${PLAN_VERSION} version, contract, approval and execution`);
  return value as CanonicalPlan;
}

export function writePlan(projectDir: string, plan: CanonicalPlan): void {
  const file = planPath(projectDir);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, stringify(plan, { lineWidth: 110, minContentWidth: 24 }));
}

export function resolveTarget(projectDir: string, supplied: Partial<PlanTarget> = {}): IntakeResolution {
  const preflight = detectProjectPreflight(projectDir);
  const scripts = preflight.scripts;
  const previewCommand = supplied.previewCommand ?? (scripts.dev ? `${preflight.packageManager} run dev` : scripts.start ? `${preflight.packageManager} run start` : scripts.preview ? `${preflight.packageManager} run preview` : null);
  const target: PlanTarget = {
    repoRoot: supplied.repoRoot ?? path.resolve(projectDir),
    previewUrl: supplied.previewUrl ?? null,
    previewCommand,
    routeScope: supplied.routeScope ?? { mode: "one-page", routes: [] },
    baselineUrls: supplied.baselineUrls ?? [],
    packageManager: supplied.packageManager ?? preflight.packageManager,
    buildCommand: supplied.buildCommand ?? (scripts.build ? `${preflight.packageManager} run build` : null),
    testCommand: supplied.testCommand ?? (scripts.test ? `${preflight.packageManager} test` : null),
    framework: supplied.framework ?? preflight.framework,
    deploymentTarget: supplied.deploymentTarget ?? null,
    devicePriorities: supplied.devicePriorities ?? [{ name: "desktop", width: 1440 }, { name: "mobile", width: 390 }],
  };
  const missing: string[] = [];
  if (!concrete(target.repoRoot)) missing.push("repository/project root");
  if (!target.previewUrl && !target.previewCommand) missing.push("preview URL or preview command");
  if (target.routeScope.routes.length === 0) missing.push("target route or route set");
  return { target, missing };
}

export function createPlan(projectDir: string, input: {
  workflow?: Partial<WorkflowConfiguration>;
  target?: Partial<PlanTarget>;
  substantial?: boolean;
  projectKind?: "from-scratch" | "redesign";
  transformationDepth?: PlanContract["transformationDepth"];
  treatments?: SpecialistSkill[];
  treatmentDecisionExplicit?: boolean;
  allTreatmentsExplicit?: boolean;
  allTreatmentsConfirmed?: boolean;
} = {}): CanonicalPlan {
  const resolved = resolveTarget(projectDir, input.target);
  const workflow = input.workflow as WorkflowConfiguration;
  const optional = [...new Set<SpecialistSkill>(input.treatments ?? [])].filter((item) => item !== "ux" && item !== "mobile");
  const selected: SpecialistSkill[] = input.treatmentDecisionExplicit || input.substantial === false
    ? [...new Set<SpecialistSkill>(["ux", "mobile", ...optional])]
    : [];
  const createdAt = now();
  return {
    version: PLAN_VERSION,
    contract: {
      createdAt,
      sourceBaselineHashAtCreation: hashFiles(projectDir, sourceFiles(projectDir)),
      target: resolved.target,
      scope: {
        substantial: input.substantial ?? true, projectKind: input.projectKind ?? "redesign", routes: resolved.target.routeScope.routes,
        requiredFunctionality: [], preservedContentAndBrand: [],
        dependencyInstallationAllowed: null, performanceConstraints: [], successCriteria: [],
      },
      creativeSources: {
        references: { preference: null, urls: [], notes: [], antiReferences: [] },
        generatedImages: null, sourcedImages: null, generatedVideo: null, sourcedVideo: null, threeDAssets: null,
        suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
      },
      workflow,
      transformationDepth: input.transformationDepth ?? "restructure",
      selectedTreatments: selected,
      treatmentDecisions: TREATMENTS.map((item) => ({
        treatment: item,
        state: selected.includes(item) ? (item === "ux" || item === "mobile" ? "foundational" : "selected") : "declined",
        explicitlyDecided: Boolean(input.treatmentDecisionExplicit || input.substantial === false),
        reason: selected.includes(item) ? (item === "ux" || item === "mobile" ? "Mandatory foundation after the explicit optional-treatment decision." : "Explicitly selected.") : "",
      })),
      allTreatmentsExplicit: input.allTreatmentsExplicit ?? false,
      allTreatmentsConfirmed: input.allTreatmentsConfirmed ?? false,
      treatmentAllocation: selected.map((treatment) => ({
        treatment, priority: treatment === "ux" || treatment === "mobile" ? "foundation" : treatment === "motion" || treatment === "interaction" || treatment === "media" || treatment === "immersive" || treatment === "experimental" ? "primary" : "supporting",
        locations: [], contribution: "", dependencies: treatment === "ux" ? [] : treatment === "mobile" ? ["ux"] : treatment === "refined" ? ["ux", "mobile"] : treatment === "motion" || treatment === "interaction" || treatment === "media" || treatment === "3d" ? ["ux", "mobile"] : ["motion", "interaction", "media", "ux", "mobile"],
        acceptance: [], routeRole: treatment === "ux" || treatment === "mobile" || treatment === "refined" ? "foundation" : treatment === "immersive" || treatment === "cinematic" ? "connective-tissue" : "peak",
      })),
      continuityOwner: "none",
      preservationRequirements: [], selectedConcept: "", blueprint: [], experienceDistribution: [], experimentalPeaks: [], prototypeContracts: [], assetStrategy: [], motionAndMediaStrategy: "", mobileTranslation: "",
      functionalTruthRequirements: [], performanceBudget: [], acceptanceCriteria: [], mechanismFallbacks: [], conceptExemptions: [], changeRequests: [],
    },
    approval: { status: "pending", revision: 0, contractHash: null, approvedAt: null, approvedBy: null, approvedSourceBaselineHash: null, decisionHistory: [{ at: createdAt, decision: "plan-created", contractHash: null }] },
    execution: {
      currentPhase: "intake",
      phases: ["intake", "planning", "approval", "prototype", "concept-checkpoint", "implementation", "critic", "audit", "finalization"].map((id) => ({ id, status: id === "intake" ? "in-progress" : "pending" })),
      checkpoints: {},
      bindings: [],
      mechanisms: [],
      prototypes: [],
      assets: [],
      capabilityActions: [],
      runtimeObservations: [],
      signatureMediaPackages: [],
      evidence: { transformations: [], sceneHandoffs: [], meaningfulInteractions: [], persistentSystemSections: [], pacing: [], mobileNative: [], reducedMotion: [], treatmentEvidence: {}, motionVocabulary: [], postFirstViewportEvents: [], treatmentObservations: {} },
      lastUpdatedAt: createdAt,
    },
  };
}

function validateCertificationPlan(contract: PlanContract): string[] {
  const errors: string[] = [];
  if (!concrete(contract.createdAt) || !concrete(contract.sourceBaselineHashAtCreation, 64))
    errors.push("IMPLEMENTATION_STARTED_BEFORE_PLAN_APPROVAL: plan creation timestamp and source baseline hash are required");
  const definition = contract.projectDefinition;
  if (!definition || !plannedText(definition.purpose) || !plannedText(definition.targetAudience) || !plannedText(definition.primaryUserJourney)
    || !definition.routes?.length || !definition.requiredFunctionality?.length || !definition.extractedRequirements?.length
    || !Array.isArray(definition.nonGoals) || !Array.isArray(definition.preservedContentOrFunctionality))
    errors.push("PLAN_MISSING_PRIMARY_JOURNEY: projectDefinition must cover purpose, audience, journey, routes, functionality, extracted requirements, non-goals and preservation");
  const direction = contract.creativeDirection;
  if (!direction || Object.values(direction).some((item) => !plannedText(item, 12)))
    errors.push("PLAN_MISSING_CREATIVE_DIRECTION: creativeDirection must define concept, fit, authorship, visual/composition/type/media/motion language and progression");
  if (!contract.sectionContracts?.length) errors.push("PLAN_MISSING_SECTION_STATE_CONTRACT: every major route or section needs a complete state contract");
  for (const section of contract.sectionContracts ?? []) {
    const required = [section.narrativePurpose, section.mainUserAction, section.visualRole, section.mediaRole, section.interactionRole,
      section.entryState, section.activeState, section.resolvedState, section.handoff, section.mobileBehavior,
      section.reducedMotionBehavior, section.fallbackBehavior, section.verificationRequirement];
    if (!concrete(section.id) || !plannedText(section.route, 1) || required.some((item) => !plannedText(item)))
      errors.push(`PLAN_MISSING_SECTION_STATE_CONTRACT: ${section.id || "unknown"} is incomplete`);
    if (!plannedText(section.mobileBehavior)) errors.push(`PLAN_MISSING_MOBILE_TRANSLATION: ${section.id || "unknown"}`);
    if (!plannedText(section.reducedMotionBehavior)) errors.push(`PLAN_MISSING_REDUCED_MOTION_TRANSLATION: ${section.id || "unknown"}`);
    if (!plannedText(section.fallbackBehavior)) errors.push(`PLAN_MISSING_FALLBACK: ${section.id || "unknown"}`);
    if (!plannedText(section.verificationRequirement)) errors.push(`PLAN_MISSING_VERIFICATION_BINDING: ${section.id || "unknown"}`);
    if (new Set(required.map((item) => item.trim().toLowerCase())).size < 8)
      errors.push(`PLAN_GENERIC_BOILERPLATE: ${section.id || "unknown"} repeats text instead of defining distinct section states`);
  }
  const contractedSections = new Set((contract.sectionContracts ?? []).map((item) => item.id));
  const plannedSections = new Set([...(contract.blueprint ?? []).map((item) => item.sectionId), ...(contract.experienceDistribution ?? []).map((item) => item.sectionId)].filter((item): item is string => concrete(item)));
  for (const id of plannedSections) if (!contractedSections.has(id)) errors.push(`PLAN_MISSING_SECTION_STATE_CONTRACT: ${id} has no section contract`);
  const continuity = contract.continuityContract;
  if (!continuity || [continuity.owner, continuity.sourceOwner, continuity.sectionChanges, continuity.persistenceVerification, continuity.breakConditions].some((item) => !plannedText(item)))
    errors.push("PLAN_MISSING_CONTINUITY_OWNER: define one source-owned persistent system and how continuity passes or breaks");
  const allocations = contract.treatmentAllocation ?? [];
  if (contract.selectedTreatments.some((item) => !allocations.some((allocation) => allocation.treatment === item && allocation.locations.length && allocation.acceptance.length)))
    errors.push("PLAN_MISSING_TREATMENT_ALLOCATION: every selected treatment needs locations, mechanisms and failure obligations");
  for (const allocation of allocations) {
    if (!allocation.mechanismIds?.length || !plannedText(allocation.mobileObligation) || !plannedText(allocation.reducedMotionObligation) || !allocation.failureCriteria?.length)
      errors.push(`PLAN_MISSING_TREATMENT_ALLOCATION: ${allocation.treatment} needs mechanism ids, mobile/reduced-motion obligations and failure criteria`);
  }
  for (const decision of contract.treatmentDecisions.filter((item) => item.state === "declined" || item.state === "not-applicable"))
    if (!plannedText(decision.reason)) errors.push(`PLAN_MISSING_TREATMENT_ALLOCATION: declined ${decision.treatment} needs a reason`);
  if (!contract.mechanismContracts?.length && contract.selectedTreatments.some((item) => ["motion", "interaction", "immersive", "cinematic", "experimental"].includes(item)))
    errors.push("PLAN_MISSING_MECHANISM_CONTRACT: selected creative treatments require mechanism contracts");
  for (const mechanism of contract.mechanismContracts ?? []) {
    const required = [mechanism.catalogueSourceOrCustomRationale, mechanism.routeOrSection, mechanism.startState, mechanism.activeState,
      mechanism.endState, mechanism.reverseBehavior, mechanism.rapidInputBehavior, mechanism.refreshAtProgressBehavior,
      mechanism.mobileBehavior, mechanism.reducedMotionBehavior, mechanism.dependency, mechanism.performanceExpectation,
      mechanism.approvedFallback, mechanism.fallbackTrigger];
    if (!concrete(mechanism.id) || required.some((item) => !plannedText(item)) || !mechanism.requiredCaptureStates?.length
      || !mechanism.successCriteria?.length || !mechanism.failureCriteria?.length)
      errors.push(`PLAN_MISSING_MECHANISM_CONTRACT: ${mechanism.id || "unknown"} is incomplete`);
  }
  const trace = contract.requirementTraceability;
  if (!trace?.length || (definition?.extractedRequirements.length ?? 0) > trace.length)
    errors.push("PLAN_MISSING_REQUIREMENT_TRACEABILITY: every meaningful prompt requirement needs implementation, browser test and evidence bindings");
  for (const requirement of trace ?? []) if (!concrete(requirement.id) || !concrete(requirement.evidenceId)
    || [requirement.source, requirement.wording, requirement.plannedImplementation,
      requirement.routeOrComponent, requirement.browserTest].some((item) => !plannedText(item)))
    errors.push(`PLAN_MISSING_REQUIREMENT_TRACEABILITY: ${requirement.id || "unknown"} is incomplete`);
  const verification = contract.verificationPlan;
  if (!verification || !verification.viewports?.length || !verification.interactions?.length || !verification.accessibilityChecks?.length
    || !verification.mediaNetworkChecks?.length || !verification.criticInputs?.length || !verification.finalizationBlockers?.length)
    errors.push("PLAN_MISSING_VERIFICATION_BINDING: verificationPlan must bind exact viewports, interactions, accessibility, media/network, critic and blockers");
  if (!contract.packagePlan || !contract.packagePlan.preflightResults.length || !contract.packagePlan.placeholderRestrictions.length)
    errors.push("PLAN_MISSING_ASSET_PACKAGE_PLAN: asset/package plan must record preflight and placeholder restrictions");
  if ((contract.workflow.ambition === "award" || contract.workflow.ambition === "experimental")
    && (contract.experimentalPeaks ?? []).some((peak) => /\b(?:tab|form|calculator|card grid|carousel|fade[- ]?in)\b/i.test(`${peak.mechanismFamily} ${peak.plannedBehaviour}`)))
    errors.push("PLAN_EXPERIMENTAL_PEAK_TOO_GENERIC: ordinary UI cannot satisfy a creative peak");
  return errors;
}

export function validateCanonicalPlan(value: unknown): string[] {
  const plan = value as Partial<CanonicalPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  const errors: string[] = [];
  if (plan.version !== PLAN_VERSION) errors.push(`plan.version must be ${PLAN_VERSION}; older canonical plans require explicit migration`);
  if (!plan.contract || typeof plan.contract !== "object") return [...errors, "plan.contract is required"];
  if (!plan.approval || typeof plan.approval !== "object") errors.push("plan.approval is required");
  if (!plan.execution || typeof plan.execution !== "object") errors.push("plan.execution is required");
  const contract = plan.contract;
  const workflow = contract.workflow;
  if (contract.scope?.substantial && workflow)
    errors.push(...validateCertificationPlan(contract));
  if (!workflow || !AMBITIONS.includes(workflow.ambition)) errors.push("contract.workflow.ambition must be standard, expressive, award, or experimental");
  if (!workflow || !EXECUTIONS.includes(workflow.execution)) errors.push("contract.workflow.execution is invalid");
  if (!workflow || !PROTOTYPES.includes(workflow.prototype)) errors.push("contract.workflow.prototype is invalid");
  if (!workflow || !PURPOSES.includes(workflow.purpose)) errors.push("contract.workflow.purpose is invalid");
  if (!contract.target || !concrete(contract.target.repoRoot)) errors.push("contract.target.repoRoot is required");
  if (!contract.target?.previewUrl && !contract.target?.previewCommand) errors.push("contract.target needs previewUrl or previewCommand before implementation");
  if (!strings(contract.target?.routeScope?.routes) || contract.target.routeScope.routes.length === 0) errors.push("contract.target.routeScope.routes must resolve the target route set");
  if (!Array.isArray(contract.selectedTreatments) || contract.selectedTreatments.some((item) => !TREATMENTS.includes(item))) errors.push("contract.selectedTreatments contains an invalid treatment");
  const decisions = contract.treatmentDecisions ?? [];
  if (decisions.length !== TREATMENTS.length || new Set(decisions.map((item) => item.treatment)).size !== TREATMENTS.length)
    errors.push("contract.treatmentDecisions must disclose all ten treatments exactly once");
  if (contract.scope?.substantial && decisions.some((item) => !item.explicitlyDecided))
    errors.push("substantial plans require an explicit decision record for every treatment; recommendations are not selections");
  for (const item of decisions) {
    const isSelected = contract.selectedTreatments.includes(item.treatment);
    if (isSelected !== ["foundational", "selected"].includes(item.state)) errors.push(`${item.treatment}: treatment decision state contradicts selectedTreatments`);
    if ((item.treatment === "ux" || item.treatment === "mobile") && contract.scope?.substantial && item.state !== "foundational")
      errors.push(`${item.treatment}: UX and Mobile become foundations only after an explicit optional-treatment decision`);
  }
  if (contract.allTreatmentsExplicit && !contract.allTreatmentsConfirmed) errors.push("explicit all-treatment selection requires one recorded confirmation");
  if (contract.allTreatmentsExplicit && TREATMENTS.some((item) => !contract.selectedTreatments.includes(item))) errors.push("explicit all-treatment selection cannot silently prune a treatment");
  const allocated = new Set((contract.treatmentAllocation ?? []).map((item) => item.treatment));
  for (const treatment of contract.selectedTreatments ?? []) if (!allocated.has(treatment)) errors.push(`selected treatment ${treatment} has no allocation`);
  for (const allocation of contract.treatmentAllocation ?? []) {
    const definition = treatment(allocation.treatment);
    if (!Array.isArray(allocation.dependencies) || definition.dependencies.some((dependency) => !allocation.dependencies.includes(dependency)))
      errors.push(`${allocation.treatment} allocation does not disclose required dependencies`);
    if (!["peak", "connective-tissue", "foundation"].includes(allocation.routeRole)) errors.push(`${allocation.treatment} allocation needs a route role`);
    if (!strings(allocation.locations) || allocation.locations.length === 0) errors.push(`${allocation.treatment} allocation needs concrete page or section locations`);
    if (!concrete(allocation.contribution, 12)) errors.push(`${allocation.treatment} allocation needs a substantive delivery contribution`);
    if (!strings(allocation.acceptance) || allocation.acceptance.length === 0) errors.push(`${allocation.treatment} allocation needs at least one observable acceptance condition`);
  }
  if ((contract.selectedTreatments.includes("immersive") || contract.selectedTreatments.includes("cinematic")) && contract.continuityOwner === "none")
    errors.push("Immersive or Cinematic selection requires one primary continuity owner");
  if (contract.continuityOwner !== "none" && !contract.selectedTreatments.includes(contract.continuityOwner))
    errors.push(`continuity owner ${contract.continuityOwner} is not selected`);
  if (contract.scope?.substantial) {
    if (!concrete(contract.selectedConcept, 12)) errors.push("substantial plan requires contract.selectedConcept");
    if (!Array.isArray(contract.blueprint) || contract.blueprint.length === 0) errors.push("substantial plan requires a page/section blueprint");
    if (!strings(contract.scope.requiredFunctionality)) errors.push("contract.scope.requiredFunctionality must be an array");
    if (contract.scope.dependencyInstallationAllowed === null) errors.push("dependency installation permission is unresolved");
    if (!contract.creativeSources || contract.creativeSources.references.preference === null) errors.push("reference preference is unresolved: provided, none, or open-to-suggestions");
    if (!contract.creativeSources || contract.creativeSources.generatedImages === null) errors.push("generated-image permission is unresolved");
    if (!contract.creativeSources || contract.creativeSources.sourcedImages === null) errors.push("externally sourced-image permission is unresolved");
    if (!contract.creativeSources || contract.creativeSources.generatedVideo === null) errors.push("generated-video permission is unresolved");
    if (!contract.creativeSources || contract.creativeSources.sourcedVideo === null) errors.push("externally sourced-video permission is unresolved");
    if (!contract.creativeSources || contract.creativeSources.threeDAssets === null) errors.push("3D asset/prop policy is unresolved");
    if (contract.creativeSources?.references.preference === "provided" && contract.creativeSources.references.urls.length === 0 && contract.creativeSources.references.notes.length === 0)
      errors.push("reference preference is provided but no reference URLs or notes are recorded");
    if (!strings(contract.scope.successCriteria) || contract.scope.successCriteria.length === 0) errors.push("success criteria must be recorded in the user's language");
    if (!contract.capabilityPreflight) errors.push("substantial planning requires creative capability preflight separate from permissions");
  }
  if (workflow && workflow.ambition !== "standard") {
    const arc = contract.experienceArc;
    if (!arc || Object.values(arc).some((item) => !concrete(item, 8))) errors.push(`${workflow.ambition} requires a complete experienceArc contract`);
  }
  if (workflow && ["expressive", "award", "experimental"].includes(workflow.ambition) && (contract.experienceDistribution ?? []).length === 0)
    errors.push(`${workflow.ambition} requires route-level experience distribution`);
  const distribution = contract.experienceDistribution ?? [];
  if (distribution.length > 0) {
    const orders = distribution.map((item) => item.order);
    if (new Set(distribution.map((item) => `${item.pageId}/${item.sectionId}`)).size !== distribution.length) errors.push("experience distribution contains duplicate sections");
    if (orders.some((order) => !Number.isInteger(order) || order < 0)) errors.push("experience distribution order must be non-negative integers");
    if (distribution.some((item) => !concrete(item.continuityContribution, item.role === "functional-utility" ? 1 : 12)))
      errors.push("every non-utility section needs a concrete continuity contribution");
  }
  if (workflow && (workflow.ambition === "award" || workflow.ambition === "experimental")) {
    if (!distribution.some((item) => item.order > 0 && ["peak", "transformation"].includes(item.role)))
      errors.push(`${workflow.ambition} requires a substantive experience event after the first viewport`);
  }
  if (workflow?.ambition === "experimental") {
    const peaks = contract.experimentalPeaks ?? [];
    if (peaks.length < 2 || peaks.length > 3) errors.push("Experimental requires two or three selected peaks");
    if (new Set(peaks.map((item) => item.chapter)).size < 2) errors.push("Experimental peaks must be distributed across more than the hero chapter");
    for (const peak of peaks) {
      if ([peak.plannedBehaviour, peak.startState, peak.activeState, peak.resolution, peak.inputRelationship, peak.mobileStrategy, peak.reducedMotionStrategy, peak.fallbackState].some((item) => !concrete(item, 12)))
        errors.push(`experimental peak ${peak.id || "unknown"} is incomplete`);
      if (!peak.acceptance?.length) errors.push(`experimental peak ${peak.id || "unknown"} needs observable acceptance conditions`);
    }
  }
  const videoRelevant = Boolean(workflow && (workflow.ambition === "experimental" || contract.allTreatmentsExplicit)
    && contract.selectedTreatments.includes("media")
    && (contract.selectedTreatments.includes("cinematic") || contract.selectedTreatments.includes("experimental"))
    && (contract.creativeSources?.generatedVideo === "allowed" || contract.creativeSources?.generatedVideo === "ask-per-asset"
      || contract.creativeSources?.sourcedVideo === "allowed" || contract.creativeSources?.sourcedVideo === "ask-per-asset"));
  if (videoRelevant) {
    const decision = contract.videoDeliveryDecision;
    if (!decision || !concrete(decision.reason, 20) || !concrete(decision.processingRoute, 12)
      || !concrete(decision.mobileStrategy, 12) || !concrete(decision.reducedMotionStrategy, 12))
      errors.push("Experimental/all-treatment Media + Cinematic work requires an explicit video, frame-sequence, or approved exemption decision");
    if (decision?.decision === "approved-exemption" && !concrete(decision.approvalReference))
      errors.push("video exemption requires an explicit user approval reference");
  }
  for (const mechanism of contract.mechanismFallbacks ?? []) {
    if (!concrete(mechanism.id) || !concrete(mechanism.location) || !concrete(mechanism.primaryImplementation, 12) || !mechanism.primaryAcceptance?.length || !concrete(mechanism.fallbackImplementation, 12) || !concrete(mechanism.fallbackTrigger, 12))
      errors.push(`mechanism fallback ${mechanism.id || "unknown"} is incomplete`);
    if (!Array.isArray(mechanism.allowedSubstitutions) || !concrete(mechanism.riskFamily) || !concrete(mechanism.prototypePolicy))
      errors.push(`${mechanism.id}: mechanism intent must declare substitutions, risk family and prototype policy`);
  }
  for (const asset of contract.assetStrategy ?? []) {
    if (asset.sourcingPolicy === "generation-first-exemption" && !validGenerationFirstRationale(asset.generationRationale))
      errors.push(`${asset.id}: generation-first exemption must be asset-specific and explain why sourcing is unsuitable`);
    if (!asset.requiredLocations?.length || !asset.expectedFormatsAndVariants?.length || !asset.rightsRequirements?.length)
      errors.push(`${asset.id}: asset intent must define locations, formats/variants and rights requirements`);
  }
  if (plan.approval?.status === "approved") {
    if (!concrete(plan.approval.contractHash) || plan.approval.contractHash !== contractHash(contract)) errors.push("approved contract hash does not match the current contract; approval is invalid");
    if (!concrete(plan.approval.approvedAt)) errors.push("approved plan requires approvedAt");
    if ((contract.changeRequests ?? []).some((item) => item.status === "pending")) errors.push("approved plan has a pending material change request");
  }
  return errors;
}

export function approvePlan(projectDir: string, options: string | { mode: ApprovalMode; origin: "interactive-user" | "explicit-preauthorization"; approvedBy?: string } = { mode: "human", origin: "interactive-user" }): CanonicalPlan {
  const plan = readPlan(projectDir);
  const errors = validateCanonicalPlan(plan).filter((item) => !item.startsWith("approved contract hash"));
  if (errors.length) throw new Error(`cannot approve invalid plan:\n${errors.join("\n")}`);
  const hash = contractHash(plan.contract);
  const approval = typeof options === "string"
    ? { mode: "human" as const, origin: "interactive-user" as const, approvedBy: options }
    : options;
  if (approval.mode === "human" && approval.origin !== "interactive-user") throw new Error("FAKE_HUMAN_APPROVAL: human approval must originate from an interactive user prompt");
  if (approval.mode === "pre-authorized-dogfood" && plan.contract.workflow.purpose !== "dreative-dogfood")
    throw new Error("pre-authorized-dogfood approval is only valid for Dreative Dogfood");
  const sourceAtApproval = hashFiles(projectDir, sourceFiles(projectDir));
  if (plan.contract.sourceBaselineHashAtCreation && sourceAtApproval !== plan.contract.sourceBaselineHashAtCreation)
    throw new Error("IMPLEMENTATION_STARTED_BEFORE_PLAN_APPROVAL: material application source changed after plan creation and before approval");
  plan.approval = {
    ...plan.approval, status: "approved", revision: plan.approval.revision + 1, contractHash: hash,
    approvedAt: now(), approvedBy: approval.approvedBy ?? (approval.mode === "human" ? "user" : "dogfood-preauthorization"),
    approvalMode: approval.mode, approvalOrigin: approval.origin,
    approvedSourceBaselineHash: sourceAtApproval,
    decisionHistory: [...plan.approval.decisionHistory, { at: now(), decision: `approved:${approval.mode}`, contractHash: hash }],
  };
  plan.execution.currentPhase = "approval";
  plan.execution.lastUpdatedAt = now();
  writePlan(projectDir, plan);
  return plan;
}

export function approvalStatus(plan: CanonicalPlan): { approved: boolean; drifted: boolean; currentHash: string; approvedHash: string | null } {
  const currentHash = contractHash(plan.contract);
  return { approved: plan.approval.status === "approved" && plan.approval.contractHash === currentHash, drifted: Boolean(plan.approval.contractHash && plan.approval.contractHash !== currentHash), currentHash, approvedHash: plan.approval.contractHash };
}

export function reconcileApproval(plan: CanonicalPlan): boolean {
  const status = approvalStatus(plan);
  if (!status.drifted || plan.approval.status === "invalidated") return false;
  invalidateApproval(plan, `contract changed from ${status.approvedHash} to ${status.currentHash}`);
  return true;
}

export function invalidateApproval(plan: CanonicalPlan, note: string): void {
  const old = plan.approval.contractHash;
  plan.approval.status = "invalidated";
  plan.approval.approvedAt = null;
  plan.approval.approvedBy = null;
  plan.approval.decisionHistory.push({ at: now(), decision: "approval-invalidated", contractHash: old, note });
}

function legacyAmbition(value: any): DesignAmbition {
  if (value?.configuration?.ambition && AMBITIONS.includes(value.configuration.ambition)) return value.configuration.ambition;
  if (value?.tier === "award") return "award";
  if (value?.tier === "expressive") return "expressive";
  if (value?.tier === "premium") {
    const evidence = JSON.stringify([value.motionMoments, value.motionComplexityBudget, value.pages]);
    return /\b(structural|transformational|handoff|persistent|scroll-progress|drag|webgl|canvas)\b/i.test(evidence) ? "expressive" : "standard";
  }
  return "standard";
}

export function migrateLegacyPlan(projectDir: string, legacy: any): { plan: CanonicalPlan; diagnostics: string[] } {
  if (![3, 4, 5, 6, 7, 8].includes(Number(legacy?.version))) throw new Error(`cannot migrate plan version ${String(legacy?.version)}; expected v3-v8`);
  if (Number(legacy?.version) === 8) return migrateCanonicalV8(projectDir, legacy);
  if (Number(legacy?.version) === 7) return migrateCanonicalV7(projectDir, legacy);
  const diagnostics: string[] = [];
  const ambition = legacyAmbition(legacy);
  if (legacy.tier === "solid") diagnostics.push("tier solid migrated to contract.workflow.ambition=standard");
  if (legacy.tier === "premium") diagnostics.push(`tier premium migrated to ${ambition}; legacy motion/variance evidence ${ambition === "expressive" ? "supported expressive" : "did not support expressive"}`);
  const routes = (legacy.pages ?? []).map((page: any) => page.id).filter(Boolean);
  const plan = createPlan(projectDir, {
    workflow: {
      ambition,
      execution: legacy.configuration?.execution ?? "lean",
      prototype: legacy.configuration?.prototype ?? "auto",
      purpose: legacy.configuration?.purpose ?? "project-delivery",
    },
    target: { routeScope: { mode: routes.length > 1 ? "selected-routes" : "one-page", routes } },
    substantial: legacy.scope !== "tiny",
    projectKind: legacy.projectKind ?? "redesign",
    transformationDepth: legacy.depth ?? "restructure",
    treatments: legacy.skills ?? ["ux", "mobile"],
    treatmentDecisionExplicit: true,
    allTreatmentsExplicit: Boolean(legacy.allSkillsExplicit),
    allTreatmentsConfirmed: Boolean(legacy.allSkillsExplicit),
  });
  plan.contract.selectedConcept = legacy.designRead?.concept ?? legacy.executionBrief?.selectedConcept ?? "";
  plan.contract.blueprint = (legacy.pages ?? []).flatMap((page: any) => (page.sections ?? []).map((section: any) => ({
    pageId: page.id, sectionId: section.id, intent: section.visualBlueprint?.viewportComposition ?? section.layoutFamily ?? section.name,
    signatureMoment: section.visualBlueprint?.signatureRole,
  })));
  plan.contract.preservationRequirements = legacy.executionBrief?.preservationContracts ?? [];
  plan.contract.scope.requiredFunctionality = legacy.executionBrief?.preservationContracts ?? [];
  plan.contract.scope.successCriteria = legacy.executionBrief?.verificationCriteria ?? ["Preserve required behavior and visibly deliver the approved concept."];
  plan.contract.scope.dependencyInstallationAllowed = true;
  plan.contract.creativeSources = {
    references: {
      preference: Array.isArray(legacy.references) && legacy.references.length ? "provided" : "open-to-suggestions",
      urls: Array.isArray(legacy.references) ? legacy.references : [],
      notes: [],
      antiReferences: Array.isArray(legacy.antiReferences) ? legacy.antiReferences : [],
    },
    generatedImages: "ask-per-asset",
    sourcedImages: "ask-per-asset",
    generatedVideo: "ask-per-asset",
    sourcedVideo: "ask-per-asset",
    threeDAssets: "ask-per-asset",
    suppliedImageAssets: [],
    suppliedVideoAssets: [],
    suppliedThreeDAssets: [],
    missingOrNeededAssets: [],
  };
  plan.contract.acceptanceCriteria = legacy.executionBrief?.verificationCriteria ?? [];
  plan.contract.motionAndMediaStrategy = legacy.motionComplexityBudget?.sharedLanguage ?? "Preserve the legacy motion and media intent during migration.";
  plan.contract.mobileTranslation = (legacy.pages ?? []).map((page: any) => page.mobileBlueprint?.composition390).filter(Boolean).join(" ");
  if (ambition !== "standard") plan.contract.experienceArc = {
    openingState: "Migrated opening state requires user review.", firstTransformation: "Migrated first transformation requires user review.",
    sectionProgression: "Legacy page order retained for user review.", peaksAndRests: "Legacy motion budget retained for user review.",
    persistentSystem: legacy.awardJourney?.persistentSystemId ?? "Legacy signature system requires user review.",
    userControlledMoment: legacy.awardJourney?.inputInteractionId ?? "Legacy interaction requires user review.",
    mobileTranslation: plan.contract.mobileTranslation || "Legacy mobile composition requires user review.",
    finalResolution: legacy.awardJourney?.finalResolutionMomentId ?? "Legacy final resolution requires user review.",
  };
  diagnostics.push(`migration created an unapproved v${PLAN_VERSION} contract; review .dreative/plan.yaml and approve it before implementation`);
  return { plan, diagnostics };
}

export function migrateCanonicalV7(projectDir: string, legacy: any): { plan: CanonicalPlan; diagnostics: string[] } {
  if (legacy?.version !== 7 || !legacy.contract) throw new Error("canonical v7 migration requires a v7 plan with contract");
  const plan = createPlan(projectDir, {
    workflow: legacy.contract.workflow,
    target: legacy.contract.target,
    substantial: legacy.contract.scope?.substantial,
    projectKind: legacy.contract.scope?.projectKind,
    transformationDepth: legacy.contract.transformationDepth,
    treatments: legacy.contract.selectedTreatments,
    treatmentDecisionExplicit: true,
    allTreatmentsExplicit: legacy.contract.allTreatmentsExplicit,
    allTreatmentsConfirmed: legacy.contract.allTreatmentsConfirmed,
  });
  plan.contract = {
    ...plan.contract,
    ...legacy.contract,
    capabilityPreflight: undefined,
    continuityOwner: legacy.contract.selectedTreatments?.includes("immersive") ? "immersive" : legacy.contract.selectedTreatments?.includes("cinematic") ? "cinematic" : "none",
    treatmentAllocation: (legacy.contract.treatmentAllocation ?? []).map((item: any) => ({
      ...item,
      routeRole: item.treatment === "ux" || item.treatment === "mobile" || item.treatment === "refined" ? "foundation" : item.treatment === "immersive" || item.treatment === "cinematic" ? "connective-tissue" : "peak",
    })),
    experienceDistribution: [],
    experimentalPeaks: [],
    prototypeContracts: [],
    assetStrategy: [],
    mechanismFallbacks: (legacy.contract.mechanismFallbacks ?? []).map((item: any, index: number) => ({
      id: item.id ?? `migrated-mechanism-${index + 1}`,
      location: item.location ?? "migration-review-required",
      primaryImplementation: item.mechanism ?? "Review the migrated primary implementation.",
      primaryAcceptance: [],
      fallbackImplementation: item.fallback ?? "Review the migrated fallback implementation.",
      fallbackTrigger: "Migration requires a newly evidenced trigger.",
      triggerEvidenceRequired: [],
      userReapprovalRequired: true,
      allowedSubstitutions: [],
      riskFamily: "migration-review-required",
      prototypePolicy: "review-required",
    })),
  };
  plan.approval = { ...plan.approval, status: "pending", decisionHistory: [...plan.approval.decisionHistory, { at: now(), decision: `migrated-v7-to-v${PLAN_VERSION}`, contractHash: null, note: "Capability preflight, route distribution, assets, mechanisms and run evidence require review." }] };
  return { plan, diagnostics: [`canonical v7 migrated to unapproved v${PLAN_VERSION}; complete capability preflight, route distribution, asset strategy, mechanism governance and current-run evidence before approval`] };
}

export function migrateCanonicalV8(projectDir: string, legacy: any): { plan: CanonicalPlan; diagnostics: string[] } {
  if (legacy?.version !== 8 || !legacy.contract || !legacy.execution) throw new Error("canonical v8 migration requires a v8 plan with contract and execution");
  const oldContractHash = contractHash(legacy.contract);
  const selected = legacy.contract.selectedTreatments ?? [];
  const plan = createPlan(projectDir, {
    workflow: legacy.contract.workflow, target: legacy.contract.target, substantial: legacy.contract.scope?.substantial,
    projectKind: legacy.contract.scope?.projectKind, transformationDepth: legacy.contract.transformationDepth,
    treatments: selected, treatmentDecisionExplicit: true, allTreatmentsExplicit: legacy.contract.allTreatmentsExplicit,
    allTreatmentsConfirmed: legacy.contract.allTreatmentsConfirmed,
  });
  const { prototypeContracts = [], assetStrategy = [], mechanismFallbacks = [], ...stable } = legacy.contract;
  plan.contract = {
    ...plan.contract,
    ...stable,
    treatmentDecisions: TREATMENTS.map((item) => ({
      treatment: item,
      state: selected.includes(item) ? (item === "ux" || item === "mobile" ? "foundational" : "selected") : "declined",
      explicitlyDecided: true,
      reason: selected.includes(item) ? "Preserved from the explicitly approved v8 treatment set." : "Preserved as declined during v8-to-v9 migration.",
    })),
    prototypeContracts: prototypeContracts.map((item: any) => ({
      id: item.id, riskFamily: item.riskFamily, mechanismId: item.mechanismId, required: item.required,
      uncertainty: item.validates || "Migrated prototype uncertainty requires review.",
      acceptanceConditions: item.validates ? [item.validates] : [], maximumScope: "Preserve the bounded v8 prototype scope.",
      failureImplications: item.limitations || "Use only an approved fallback or request a material change.",
    })),
    assetStrategy: assetStrategy.map((item: any) => ({
      id: item.id, intendedRole: item.intendedRole, requiredSubjectAndComposition: item.requiredSubjectAndComposition,
      priority: item.priority, sourcingPolicy: item.priority === "generated" ? "generation-first-exemption" : item.priority === "external-sourced" ? "external-first" : item.priority === "user-supplied" ? "supplied-only" : "procedural",
      generationPolicy: item.priority === "generated" ? "allowed-with-advantage" : "not-allowed",
      generationRationale: item.generationRationale ?? "", classification: item.classification,
      rightsRequirements: ["Preserve and verify v8 provenance and rights."],
      expectedFormatsAndVariants: item.productionDerivatives?.length ? item.productionDerivatives : ["migration-review-required"],
      requiredLocations: item.usedAt?.length ? item.usedAt : ["migration-review-required"],
      reusePolicy: "Review migrated reuse against the approved narrative role.",
      suitableExternalMediaCouldExist: item.priority === "generated", sizeBudgetBytes: item.sizeBudgetBytes,
    })),
    mechanismFallbacks: mechanismFallbacks.map((item: any) => ({
      id: item.id, location: item.location, primaryImplementation: item.primaryImplementation,
      primaryAcceptance: item.primaryAcceptance ?? [], fallbackImplementation: item.fallbackImplementation,
      fallbackTrigger: item.fallbackTrigger, triggerEvidenceRequired: item.triggerEvidenceRequired ?? [],
      userReapprovalRequired: item.userReapprovalRequired ?? true, allowedSubstitutions: [],
      riskFamily: "migrated-v8", prototypePolicy: "preserve-approved-prototype-policy",
    })),
  };
  plan.execution = {
    ...plan.execution, ...legacy.execution,
    mechanisms: mechanismFallbacks.map((item: any) => ({
      id: item.id, status: item.finalStatus ?? "pending", finalReason: item.finalReason ?? "",
      triggerObserved: item.finalStatus === "fallback-triggered", triggerEvidenceIds: item.finalStatus === "fallback-triggered" ? item.observedEvidenceIds ?? [] : [],
      observedImplementation: "", observedEvidenceIds: item.observedEvidenceIds ?? [], substitutionUsed: null, approvalReference: null, criticVerdict: "pending",
    })),
    prototypes: prototypeContracts.map((item: any) => ({
      id: item.id, status: item.status ?? "pending", attemptCount: item.status === "pending" ? 0 : 1,
      evidenceIds: item.evidenceIds ?? [], observedResults: item.validates ? [item.validates] : [],
      correctiveIterations: [], implementationDecision: item.limitations ?? "",
    })),
    assets: assetStrategy.map((item: any) => ({
      id: item.id, sourcingAttempts: item.sourcingAttempted ? [{ provider: "v8-record", query: item.requiredSubjectAndComposition ?? "", at: now(), result: "Migrated recorded attempt." }] : [],
      preSearchExemption: item.generationChosen ? item.generationRationale ?? "" : "", candidatesFound: item.candidateSources ?? [],
      selectedSource: item.sourcePath ?? null, generatedDetails: item.generationChosen ? item.generationRationale ?? "" : "",
      actualFiles: item.sourcePath ? [item.sourcePath] : [], actualSizes: {}, productionDerivatives: item.productionDerivatives ?? [],
      usageLocations: item.usedAt ?? [], browserObserved: false, survivedFinalImplementation: item.survivedFinalImplementation ?? false,
      removedOrSubstituted: false, finalRightsRecord: (item.candidateSources ?? []).map((candidate: any) => candidate.rights).filter(Boolean).join("; "),
      shipping: item.shipping ?? false, mobileVariant: item.mobileVariant, poster: item.poster, loadingStrategy: item.loadingStrategy,
    })),
  };
  const lineageExact = legacy.approval?.status === "approved" && legacy.approval?.contractHash === oldContractHash;
  const newHash = contractHash(plan.contract);
  plan.approval = {
    ...legacy.approval,
    status: lineageExact ? "approved" : "pending",
    contractHash: lineageExact ? newHash : null,
    approvedAt: lineageExact ? legacy.approval.approvedAt : null,
    approvedBy: lineageExact ? legacy.approval.approvedBy : null,
    decisionHistory: [...(legacy.approval?.decisionHistory ?? []), {
      at: now(), decision: "migrated-v8-to-v9", contractHash: lineageExact ? newHash : null,
      note: lineageExact ? `Approval lineage preserved from stable v8 intent hash ${oldContractHash}; mutable outcomes moved to execution.` : "Approval could not be safely reconstructed and remains pending.",
    }],
  };
  return { plan, diagnostics: [
    `source canonical v8 contract hash: ${oldContractHash}`,
    `target canonical v9 contract hash: ${newHash}`,
    lineageExact ? "approval lineage preserved because the source approval exactly matched stable v8 intent" : "approval invalidated because exact stable intent lineage could not be proven",
    "mechanism, prototype and asset outcomes moved from contract to execution",
  ] };
}

export function exportPlanJson(plan: CanonicalPlan): string {
  return `${JSON.stringify(plan, null, 2)}\n`;
}
