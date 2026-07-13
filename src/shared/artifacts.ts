import type { AmbitionTier, SpecialistSkill } from "./skillSystem.js";

export type DeliveryStatus = "planned" | "shipped" | "fallback" | "cut";

export interface PlanAsset {
  id: string;
  path: string;
  purpose: string;
  status: DeliveryStatus;
  reason?: string;
}

export interface PlanSection {
  id: string;
  name: string;
  layoutFamily: string;
  skills: SpecialistSkill[];
  interactions: string[];
  mobile: string;
  fallback: string;
  verification: string[];
  assets: PlanAsset[];
  status: DeliveryStatus;
  reason?: string;
}

export interface DirectDesignPlan {
  version: 1;
  request: string;
  createdAt: string;
  tier: AmbitionTier;
  depth: "restyle" | "relayout" | "restructure" | "reimagine";
  skills: SpecialistSkill[];
  designRead: { register: string; concept: string; signature: string };
  sections: PlanSection[];
  preservationManifest: string;
  decisionLedger: string;
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
}

export interface VerificationReport {
  version: 1;
  generatedAt: string;
  evidence: VerificationEvidence[];
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validatePlan(value: unknown): string[] {
  const errors: string[] = [];
  const plan = value as Partial<DirectDesignPlan> | null;
  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  if (plan.version !== 1) errors.push("plan.version must be 1");
  if (!nonEmpty(plan.request)) errors.push("plan.request is required");
  if (!nonEmpty(plan.createdAt) || Number.isNaN(Date.parse(plan.createdAt))) errors.push("plan.createdAt must be an ISO date");
  if (!["solid", "premium", "expressive", "award"].includes(String(plan.tier))) errors.push("plan.tier is invalid");
  if (!["restyle", "relayout", "restructure", "reimagine"].includes(String(plan.depth))) errors.push("plan.depth is invalid");
  if (!Array.isArray(plan.skills) || !plan.skills.includes("ux") || !plan.skills.includes("mobile"))
    errors.push("plan.skills must include ux and mobile");
  if (!plan.designRead || !nonEmpty(plan.designRead.register) || !nonEmpty(plan.designRead.concept) || !nonEmpty(plan.designRead.signature))
    errors.push("plan.designRead requires register, concept, and signature");
  if (!Array.isArray(plan.sections) || plan.sections.length === 0) errors.push("plan.sections must contain at least one section");
  for (const [index, section] of (plan.sections ?? []).entries()) {
    const prefix = `sections[${index}]`;
    if (!nonEmpty(section.id) || !nonEmpty(section.name) || !nonEmpty(section.layoutFamily)) errors.push(`${prefix} requires id, name, and layoutFamily`);
    if (!nonEmpty(section.mobile) || !nonEmpty(section.fallback)) errors.push(`${prefix} requires mobile and fallback treatments`);
    if (!Array.isArray(section.verification) || section.verification.length === 0) errors.push(`${prefix}.verification cannot be empty`);
    if (section.status === "planned") errors.push(`${prefix} is still planned`);
    if ((section.status === "fallback" || section.status === "cut") && !nonEmpty(section.reason)) errors.push(`${prefix}.reason is required for ${section.status}`);
    for (const asset of section.assets ?? []) {
      if (!nonEmpty(asset.id) || !nonEmpty(asset.path) || !nonEmpty(asset.purpose)) errors.push(`${prefix} contains an incomplete asset`);
      if ((asset.status === "fallback" || asset.status === "cut") && !nonEmpty(asset.reason)) errors.push(`${prefix} asset ${asset.id} needs a reason`);
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
  if ((report.evidence ?? []).some((item) => item.status === "fail")) errors.push("verification report contains failing evidence");
  for (const [index, item] of (report.evidence ?? []).entries()) {
    if (!nonEmpty(item.id) || !nonEmpty(item.criterion) || !nonEmpty(item.evidence)) errors.push(`verification.evidence[${index}] is incomplete`);
  }
  return errors;
}
