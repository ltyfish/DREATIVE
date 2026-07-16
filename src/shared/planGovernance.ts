import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";
import { detectProjectPreflight, type ProjectPreflight } from "./preflight.js";
import type { SpecialistSkill } from "./skillSystem.js";
import { treatment } from "./treatments.js";
import type { DesignAmbition, EvaluationPurpose, ExecutionMode, PrototypePolicy, WorkflowConfiguration } from "./workflow.js";

export const PLAN_VERSION = 8;
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
}

export type ExperienceSectionRole = "peak" | "transformation" | "preparation" | "echo" | "rest" | "resolution" | "functional-utility";
export type SpatialAssetClassification = "model" | "spatial-cutout" | "layered-billboard" | "pre-rendered-angles" | "frame-sequence" | "webgl-media-plane" | "static-image";
export type MechanismFinalStatus = "primary-delivered" | "fallback-triggered" | "approved-change" | "not-applicable" | "failed";

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
  finalStatus: MechanismFinalStatus;
  finalReason: string;
  observedEvidenceIds: string[];
}

export interface AssetStrategyEntry {
  id: string;
  intendedRole: string;
  requiredSubjectAndComposition: string;
  priority: "user-supplied" | "external-sourced" | "generated" | "procedural";
  sourcingAttempted: boolean;
  candidateSources: { url: string; rights: string }[];
  generationChosen: boolean;
  generationRationale: string;
  classification: SpatialAssetClassification;
  sourcePath: string | null;
  productionDerivatives: string[];
  usedAt: string[];
  survivedFinalImplementation: boolean;
  shipping: boolean;
  sizeBudgetBytes?: number;
  mobileVariant?: string;
  poster?: string;
  loadingStrategy?: string;
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
  status: "pending" | "passed" | "failed" | "skipped";
  validates: string;
  limitations: string;
  evidenceIds: string[];
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
  decisionHistory: { at: string; decision: string; contractHash: string | null; note?: string }[];
}

export interface PlanExecution {
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
  version: 8;
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
const now = () => new Date().toISOString();

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
  if ((plan as { version?: number } | null)?.version === 7)
    throw new Error(`${PLAN_FILE} is canonical v7; migrate it to v8 before implementation so capability, route-distribution, asset and run-identity contracts can be reviewed`);
  if (!plan || plan.version !== 8 || !plan.contract || !plan.approval || !plan.execution)
    throw new Error(`${PLAN_FILE} must contain canonical v8 version, contract, approval and execution`);
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
  allTreatmentsExplicit?: boolean;
  allTreatmentsConfirmed?: boolean;
} = {}): CanonicalPlan {
  const resolved = resolveTarget(projectDir, input.target);
  const workflow = input.workflow as WorkflowConfiguration;
  const selected: SpecialistSkill[] = [...new Set<SpecialistSkill>(input.treatments ?? ["ux", "mobile"])];
  const createdAt = now();
  return {
    version: PLAN_VERSION,
    contract: {
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
    approval: { status: "pending", revision: 0, contractHash: null, approvedAt: null, approvedBy: null, decisionHistory: [{ at: createdAt, decision: "plan-created", contractHash: null }] },
    execution: {
      currentPhase: "intake",
      phases: ["intake", "planning", "approval", "prototype", "concept-checkpoint", "implementation", "critic", "audit", "finalization"].map((id) => ({ id, status: id === "intake" ? "in-progress" : "pending" })),
      checkpoints: {},
      bindings: [],
      evidence: { transformations: [], sceneHandoffs: [], meaningfulInteractions: [], persistentSystemSections: [], pacing: [], mobileNative: [], reducedMotion: [], treatmentEvidence: {}, motionVocabulary: [], postFirstViewportEvents: [], treatmentObservations: {} },
      lastUpdatedAt: createdAt,
    },
  };
}

export function validateCanonicalPlan(value: unknown): string[] {
  const plan = value as Partial<CanonicalPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  const errors: string[] = [];
  if (plan.version !== 8) errors.push("plan.version must be 8; canonical v7 plans require migration and renewed approval");
  if (!plan.contract || typeof plan.contract !== "object") return [...errors, "plan.contract is required"];
  if (!plan.approval || typeof plan.approval !== "object") errors.push("plan.approval is required");
  if (!plan.execution || typeof plan.execution !== "object") errors.push("plan.execution is required");
  const contract = plan.contract;
  const workflow = contract.workflow;
  if (!workflow || !AMBITIONS.includes(workflow.ambition)) errors.push("contract.workflow.ambition must be standard, expressive, award, or experimental");
  if (!workflow || !EXECUTIONS.includes(workflow.execution)) errors.push("contract.workflow.execution is invalid");
  if (!workflow || !PROTOTYPES.includes(workflow.prototype)) errors.push("contract.workflow.prototype is invalid");
  if (!workflow || !PURPOSES.includes(workflow.purpose)) errors.push("contract.workflow.purpose is invalid");
  if (!contract.target || !concrete(contract.target.repoRoot)) errors.push("contract.target.repoRoot is required");
  if (!contract.target?.previewUrl && !contract.target?.previewCommand) errors.push("contract.target needs previewUrl or previewCommand before implementation");
  if (!strings(contract.target?.routeScope?.routes) || contract.target.routeScope.routes.length === 0) errors.push("contract.target.routeScope.routes must resolve the target route set");
  if (!Array.isArray(contract.selectedTreatments) || contract.selectedTreatments.some((item) => !TREATMENTS.includes(item))) errors.push("contract.selectedTreatments contains an invalid treatment");
  if (contract.allTreatmentsExplicit && !contract.allTreatmentsConfirmed) errors.push("explicit all-treatment selection requires one recorded confirmation");
  if (contract.allTreatmentsExplicit && TREATMENTS.some((item) => !contract.selectedTreatments.includes(item))) errors.push("explicit all-treatment selection cannot silently prune a treatment");
  const allocated = new Set((contract.treatmentAllocation ?? []).map((item) => item.treatment));
  for (const treatment of contract.selectedTreatments ?? []) if (!allocated.has(treatment)) errors.push(`selected treatment ${treatment} has no allocation`);
  for (const allocation of contract.treatmentAllocation ?? []) {
    const definition = treatment(allocation.treatment);
    if (!Array.isArray(allocation.dependencies) || definition.dependencies.some((dependency) => !allocation.dependencies.includes(dependency)))
      errors.push(`${allocation.treatment} allocation does not disclose required dependencies`);
    if (!["peak", "connective-tissue", "foundation"].includes(allocation.routeRole)) errors.push(`${allocation.treatment} allocation needs a route role`);
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
  for (const mechanism of contract.mechanismFallbacks ?? []) {
    if (!concrete(mechanism.id) || !concrete(mechanism.location) || !concrete(mechanism.primaryImplementation, 12) || !mechanism.primaryAcceptance?.length || !concrete(mechanism.fallbackImplementation, 12) || !concrete(mechanism.fallbackTrigger, 12))
      errors.push(`mechanism fallback ${mechanism.id || "unknown"} is incomplete`);
    if (mechanism.finalStatus === "fallback-triggered" && mechanism.observedEvidenceIds.length === 0) errors.push(`${mechanism.id}: fallback-triggered requires observed trigger evidence`);
    if (mechanism.finalStatus === "approved-change" && !(contract.changeRequests ?? []).some((item) => item.status === "approved" && item.fields.some((field) => field.includes(mechanism.id))))
      errors.push(`${mechanism.id}: approved-change requires an approved material change request`);
    if (mechanism.finalStatus === "failed") errors.push(`${mechanism.id}: failed primary/fallback contract blocks approval`);
  }
  for (const asset of contract.assetStrategy ?? []) {
    if (asset.priority === "external-sourced" && !asset.sourcingAttempted) errors.push(`${asset.id}: external sourcing priority requires a recorded sourcing attempt`);
    if (asset.generationChosen && !concrete(asset.generationRationale, 20)) errors.push(`${asset.id}: generation choice requires a creative advantage rationale`);
    if (asset.shipping && !asset.survivedFinalImplementation) errors.push(`${asset.id}: shipping asset did not survive final implementation`);
  }
  if (plan.approval?.status === "approved") {
    if (!concrete(plan.approval.contractHash) || plan.approval.contractHash !== contractHash(contract)) errors.push("approved contract hash does not match the current contract; approval is invalid");
    if (!concrete(plan.approval.approvedAt)) errors.push("approved plan requires approvedAt");
    if ((contract.changeRequests ?? []).some((item) => item.status === "pending")) errors.push("approved plan has a pending material change request");
  }
  return errors;
}

export function approvePlan(projectDir: string, approvedBy = "user"): CanonicalPlan {
  const plan = readPlan(projectDir);
  const errors = validateCanonicalPlan(plan).filter((item) => !item.startsWith("approved contract hash"));
  if (errors.length) throw new Error(`cannot approve invalid plan:\n${errors.join("\n")}`);
  const hash = contractHash(plan.contract);
  plan.approval = {
    ...plan.approval, status: "approved", revision: plan.approval.revision + 1, contractHash: hash,
    approvedAt: now(), approvedBy, decisionHistory: [...plan.approval.decisionHistory, { at: now(), decision: "approved", contractHash: hash }],
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
  if (![3, 4, 5, 6, 7].includes(Number(legacy?.version))) throw new Error(`cannot migrate plan version ${String(legacy?.version)}; expected v3-v7`);
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
  diagnostics.push("migration created an unapproved v8 contract; review .dreative/plan.yaml and approve it before implementation");
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
      finalStatus: "not-applicable",
      finalReason: "Migrated from v7 and requires review.",
      observedEvidenceIds: [],
    })),
  };
  plan.approval = { ...plan.approval, status: "pending", decisionHistory: [...plan.approval.decisionHistory, { at: now(), decision: "migrated-v7-to-v8", contractHash: null, note: "Capability preflight, route distribution, assets, mechanisms and run evidence require review." }] };
  return { plan, diagnostics: ["canonical v7 migrated to unapproved v8; complete capability preflight, route distribution, asset strategy, mechanism governance and current-run evidence before approval"] };
}

export function exportPlanJson(plan: CanonicalPlan): string {
  return `${JSON.stringify(plan, null, 2)}\n`;
}
