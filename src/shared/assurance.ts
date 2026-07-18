import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ASSURANCE_LEVELS = ["local", "host-attested", "externally-attested"] as const;
export type AssuranceLevel = typeof ASSURANCE_LEVELS[number];

export const APPROVAL_AUTHORITIES = [
  "host-attested-user", "prompt-preauthorized", "user-origin-unverified", "internal", "none",
] as const;
export type ApprovalAuthority = typeof APPROVAL_AUTHORITIES[number];

export const PROVENANCE_SOURCE_TYPES = [
  "host-event", "signed-record", "prompt-file", "cli", "internal",
] as const;
export type ProvenanceSourceType = typeof PROVENANCE_SOURCE_TYPES[number];

export interface ProvenanceRecord {
  authority: ApprovalAuthority;
  sourceType: ProvenanceSourceType;
  sourceId?: string;
  contentHash?: string;
  filePath?: string;
  attestationProvider?: string;
  assuranceLevel: AssuranceLevel;
  scope: string[];
  recordedAt: string;
  contentRecordedBeforePlanning?: boolean;
}

export interface AssuranceProvider {
  id: string;
  level: AssuranceLevel;
  immutableEventIds: boolean;
  externallySigned: boolean;
}

export interface AssuranceProviderAdapter {
  provider: AssuranceProvider;
  validateEvent(sourceId: string, contentHash: string): boolean;
  validateRun(runId: string, manifestDigest: string): boolean;
}

const rank: Record<AssuranceLevel, number> = {
  local: 0,
  "host-attested": 1,
  "externally-attested": 2,
};

export function assuranceAtLeast(actual: AssuranceLevel, required: AssuranceLevel): boolean {
  return rank[actual] >= rank[required];
}

export function requiredAssurance(purpose: string): AssuranceLevel {
  return purpose === "production-certification" ? "host-attested" : "local";
}

export function resolveAssuranceProvider(_projectDir: string): AssuranceProvider {
  // The standalone CLI shares the builder's process and filesystem authority.
  // Environment variables and project-readable JSON therefore cannot elevate it.
  // A host integration must supply an AssuranceProviderAdapter at its own trust
  // boundary; until that integration exists, the CLI degrades honestly to local.
  return { id: "dreative-local-integrity", level: "local", immutableEventIds: false, externallySigned: false };
}

export function validateProvenance(record: ProvenanceRecord | undefined, planCreatedAt?: string): string[] {
  if (!record) return ["APPROVAL_PROVENANCE_MISSING: approval provenance is required"];
  const errors: string[] = [];
  if (!APPROVAL_AUTHORITIES.includes(record.authority)) errors.push("APPROVAL_AUTHORITY_INVALID");
  if (!PROVENANCE_SOURCE_TYPES.includes(record.sourceType)) errors.push("APPROVAL_SOURCE_TYPE_INVALID");
  if (!ASSURANCE_LEVELS.includes(record.assuranceLevel)) errors.push("APPROVAL_ASSURANCE_INVALID");
  if (!record.scope?.length) errors.push("APPROVAL_SCOPE_MISSING: record the decisions covered by approval");
  if (record.sourceType === "host-event" && (!record.sourceId || !record.contentHash))
    errors.push("HOST_EVENT_PROVENANCE_INCOMPLETE: immutable event ID and exact-content hash are required");
  if (record.sourceType === "prompt-file" && (!record.filePath || !record.contentHash))
    errors.push("PROMPT_FILE_PROVENANCE_INCOMPLETE: file path and original-byte hash are required");
  if (record.sourceType === "signed-record" && (!record.sourceId || !record.contentHash || !record.attestationProvider))
    errors.push("SIGNED_PROVENANCE_INCOMPLETE: record ID, content hash and provider are required");
  if (record.authority === "internal") errors.push("INTERNAL_APPROVAL_IS_NOT_USER_APPROVAL");
  if (record.authority === "host-attested-user" && !assuranceAtLeast(record.assuranceLevel, "host-attested"))
    errors.push("HOST_ATTESTED_USER_REQUIRES_HOST_ASSURANCE");
  if (record.authority === "prompt-preauthorized" && !record.contentRecordedBeforePlanning)
    errors.push("PREAUTHORIZATION_NOT_ESTABLISHED_BEFORE_PLANNING");
  if (record.authority === "prompt-preauthorized" && planCreatedAt && Date.parse(record.recordedAt) > Date.parse(planCreatedAt))
    errors.push("PREAUTHORIZATION_RECORDED_AFTER_PLANNING");
  return errors;
}

export function validateProvenanceSource(projectDir: string, record: ProvenanceRecord | undefined): string[] {
  if (!record) return ["APPROVAL_PROVENANCE_MISSING"];
  if (record.sourceType !== "prompt-file") return [];
  const file = record.filePath ? path.resolve(projectDir, record.filePath) : "";
  if (!file || !fs.existsSync(file)) return ["PROMPT_FILE_PROVENANCE_MISSING"];
  const current = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  return current === record.contentHash ? [] : ["PROMPT_FILE_PROVENANCE_CHANGED_AFTER_RECORDING"];
}

export function validateProvenanceAssurance(projectDir: string, record: ProvenanceRecord | undefined): string[] {
  if (!record) return ["APPROVAL_PROVENANCE_MISSING"];
  const provider = resolveAssuranceProvider(projectDir);
  const errors: string[] = [];
  if (!assuranceAtLeast(provider.level, record.assuranceLevel))
    errors.push(`APPROVAL_ASSURANCE_UNAVAILABLE: provider ${provider.id} is ${provider.level} and cannot establish ${record.assuranceLevel}`);
  if (record.assuranceLevel !== "local" && record.attestationProvider !== provider.id)
    errors.push(`APPROVAL_ATTESTATION_PROVIDER_MISMATCH: expected ${provider.id}`);
  if (record.sourceType === "host-event" && record.assuranceLevel !== "local" && !provider.immutableEventIds)
    errors.push("HOST_EVENT_PROVIDER_DOES_NOT_ESTABLISH_IMMUTABLE_IDS");
  if (record.sourceType === "signed-record" && record.assuranceLevel === "externally-attested" && !provider.externallySigned)
    errors.push("SIGNED_RECORD_PROVIDER_DOES_NOT_ESTABLISH_EXTERNAL_SIGNATURES");
  return errors;
}

export function assuranceLimitation(level: AssuranceLevel): string | null {
  if (level === "local") return "Evidence is integrity-linked locally but remains under the builder's filesystem and execution authority.";
  if (level === "host-attested") return "The host attests event or execution identity; this is not an external signature.";
  return null;
}
