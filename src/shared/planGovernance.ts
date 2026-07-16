import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";
import { detectProjectPreflight } from "./preflight.js";
import type { SpecialistSkill } from "./skillSystem.js";
import type { DesignAmbition, EvaluationPurpose, ExecutionMode, PrototypePolicy, WorkflowConfiguration } from "./workflow.js";

export const PLAN_VERSION = 7;
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

export interface PlanContract {
  target: PlanTarget;
  scope: {
    substantial: boolean;
    projectKind: "from-scratch" | "redesign";
    routes: string[];
    requiredFunctionality: string[];
    preservedContentAndBrand: string[];
    suppliedAssets: string[];
    missingAssets: string[];
    dependencyInstallationAllowed: boolean | null;
    externalMediaAllowed: boolean | null;
    performanceConstraints: string[];
    references: string[];
    antiReferences: string[];
    successCriteria: string[];
  };
  workflow: WorkflowConfiguration;
  transformationDepth: "restyle" | "relayout" | "restructure" | "reimagine";
  selectedTreatments: SpecialistSkill[];
  allTreatmentsExplicit: boolean;
  allTreatmentsConfirmed: boolean;
  treatmentAllocation: TreatmentAllocation[];
  preservationRequirements: string[];
  selectedConcept: string;
  blueprint: { pageId: string; sectionId: string; intent: string; signatureMoment?: string }[];
  experienceArc?: ExperienceArc;
  motionAndMediaStrategy: string;
  mobileTranslation: string;
  functionalTruthRequirements: string[];
  performanceBudget: string[];
  acceptanceCriteria: string[];
  mechanismFallbacks: { mechanism: string; fallback: string; approved: boolean }[];
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
  version: 7;
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
  if (!plan || plan.version !== 7 || !plan.contract || !plan.approval || !plan.execution)
    throw new Error(`${PLAN_FILE} must contain version, contract, approval and execution`);
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
        requiredFunctionality: [], preservedContentAndBrand: [], suppliedAssets: [], missingAssets: [],
        dependencyInstallationAllowed: null, externalMediaAllowed: null, performanceConstraints: [], references: [], antiReferences: [], successCriteria: [],
      },
      workflow,
      transformationDepth: input.transformationDepth ?? "restructure",
      selectedTreatments: selected,
      allTreatmentsExplicit: input.allTreatmentsExplicit ?? false,
      allTreatmentsConfirmed: input.allTreatmentsConfirmed ?? false,
      treatmentAllocation: selected.map((treatment) => ({
        treatment, priority: treatment === "ux" || treatment === "mobile" ? "foundation" : "supporting",
        locations: [], contribution: "", dependencies: [], acceptance: [],
      })),
      preservationRequirements: [], selectedConcept: "", blueprint: [], motionAndMediaStrategy: "", mobileTranslation: "",
      functionalTruthRequirements: [], performanceBudget: [], acceptanceCriteria: [], mechanismFallbacks: [], conceptExemptions: [], changeRequests: [],
    },
    approval: { status: "pending", revision: 0, contractHash: null, approvedAt: null, approvedBy: null, decisionHistory: [{ at: createdAt, decision: "plan-created", contractHash: null }] },
    execution: {
      currentPhase: "intake",
      phases: ["intake", "planning", "approval", "prototype", "concept-checkpoint", "implementation", "critic", "audit", "finalization"].map((id) => ({ id, status: id === "intake" ? "in-progress" : "pending" })),
      checkpoints: {},
      bindings: [],
      evidence: { transformations: [], sceneHandoffs: [], meaningfulInteractions: [], persistentSystemSections: [], pacing: [], mobileNative: [], reducedMotion: [], treatmentEvidence: {}, motionVocabulary: [] },
      lastUpdatedAt: createdAt,
    },
  };
}

export function validateCanonicalPlan(value: unknown): string[] {
  const plan = value as Partial<CanonicalPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  const errors: string[] = [];
  if (plan.version !== 7) errors.push("plan.version must be 7");
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
  if (contract.scope?.substantial) {
    if (!concrete(contract.selectedConcept, 12)) errors.push("substantial plan requires contract.selectedConcept");
    if (!Array.isArray(contract.blueprint) || contract.blueprint.length === 0) errors.push("substantial plan requires a page/section blueprint");
    if (!strings(contract.scope.requiredFunctionality)) errors.push("contract.scope.requiredFunctionality must be an array");
    if (contract.scope.dependencyInstallationAllowed === null) errors.push("dependency installation permission is unresolved");
    if (contract.scope.externalMediaAllowed === null) errors.push("generated or externally sourced media permission is unresolved");
    if (!strings(contract.scope.successCriteria) || contract.scope.successCriteria.length === 0) errors.push("success criteria must be recorded in the user's language");
  }
  if (workflow && workflow.ambition !== "standard") {
    const arc = contract.experienceArc;
    if (!arc || Object.values(arc).some((item) => !concrete(item, 8))) errors.push(`${workflow.ambition} requires a complete experienceArc contract`);
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
  if (![3, 4, 5, 6].includes(Number(legacy?.version))) throw new Error(`cannot migrate plan version ${String(legacy?.version)}; expected v3-v6`);
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
  plan.contract.scope.externalMediaAllowed = true;
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
  diagnostics.push("migration created an unapproved v7 contract; review .dreative/plan.yaml and approve it before implementation");
  return { plan, diagnostics };
}

export function exportPlanJson(plan: CanonicalPlan): string {
  return `${JSON.stringify(plan, null, 2)}\n`;
}
