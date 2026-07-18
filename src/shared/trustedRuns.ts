import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assuranceAtLeast, resolveAssuranceProvider, type AssuranceLevel } from "./assurance.js";

export type TrustedArtifactType = "screenshot" | "recording" | "trace" | "capture-manifest" | "critic-report";
export interface TrustedArtifact {
  id: string;
  type: TrustedArtifactType;
  path: string;
  sha256: string;
  bytes: number;
}

export interface TrustedRunSeal {
  schemaVersion: 1;
  kind: "browser-verification" | "critic";
  runId: string;
  nonce: string;
  projectIdentity: string;
  manifestDigest: string;
  createdAt: string;
  assuranceLevel: AssuranceLevel;
  providerId: string;
}

export const sha256 = (value: Buffer | string): string => crypto.createHash("sha256").update(value).digest("hex");
const order = (value: unknown): unknown => Array.isArray(value)
  ? value.map(order)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, order(item)]))
    : value;
const canonical = (value: unknown): string => JSON.stringify(order(value));
export const projectIdentity = (projectDir: string): string => sha256(path.resolve(projectDir).toLowerCase());

export function ledgerDirectory(projectDir: string): string {
  const base = process.env.LOCALAPPDATA || path.join(os.homedir(), ".dreative");
  return path.join(base, "Dreative", "trust-ledger", projectIdentity(projectDir));
}

export function sealEvidenceRun(projectDir: string, kind: TrustedRunSeal["kind"], runId: string, nonce: string, manifest: unknown): TrustedRunSeal {
  const provider = resolveAssuranceProvider(projectDir);
  const claimed = (manifest as { assuranceLevel?: AssuranceLevel })?.assuranceLevel ?? "local";
  if (!assuranceAtLeast(provider.level, claimed))
    throw new Error(`ASSURANCE_OVERCLAIM: provider ${provider.id} is ${provider.level} and cannot issue ${claimed} evidence`);
  const seal: TrustedRunSeal = {
    schemaVersion: 1, kind, runId, nonce, projectIdentity: projectIdentity(projectDir),
    manifestDigest: sha256(canonical(manifest)), createdAt: new Date().toISOString(),
    assuranceLevel: claimed, providerId: provider.id,
  };
  const directory = ledgerDirectory(projectDir);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, `${kind}-${runId}.json`), JSON.stringify(seal, null, 2));
  return seal;
}

export function validateEvidenceRun(projectDir: string, kind: TrustedRunSeal["kind"], manifest: any): string[] {
  const errors: string[] = [];
  if (!manifest?.runId || !manifest?.nonce) return ["EVIDENCE_RUN_IDENTITY_MISSING: runId and random nonce are required"];
  const file = path.join(ledgerDirectory(projectDir), `${kind}-${manifest.runId}.json`);
  if (!fs.existsSync(file)) return [`EVIDENCE_${kind === "critic" ? "CRITIC" : "BROWSER"}_PROVENANCE_MISSING: no Dreative integrity record exists for ${manifest.runId}`];
  let seal: TrustedRunSeal;
  try { seal = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return [`EVIDENCE_${kind === "critic" ? "CRITIC" : "BROWSER"}_PROVENANCE_UNREADABLE: integrity record is unreadable`]; }
  if (seal.kind !== kind || seal.nonce !== manifest.nonce || seal.projectIdentity !== projectIdentity(projectDir))
    errors.push(`EVIDENCE_${kind === "critic" ? "CRITIC" : "BROWSER"}_IDENTITY_MISMATCH: run identity does not match the Dreative integrity record`);
  if (seal.manifestDigest !== sha256(canonical(manifest)))
    errors.push(`EVIDENCE_${kind === "critic" ? "CRITIC" : "RUN"}_EDITED_AFTER_GENERATION: canonical package no longer matches its integrity digest`);
  if ((manifest.assuranceLevel ?? "local") !== (seal.assuranceLevel ?? "local"))
    errors.push("EVIDENCE_ASSURANCE_MISMATCH: manifest and integrity record claim different assurance");
  const provider = resolveAssuranceProvider(projectDir);
  if (!assuranceAtLeast(provider.level, seal.assuranceLevel ?? "local"))
    errors.push(`EVIDENCE_ASSURANCE_UNAVAILABLE: current provider ${provider.id} cannot establish ${seal.assuranceLevel}`);
  return errors;
}

/** @deprecated Use sealEvidenceRun; local integrity records are not independently trusted. */
export const sealTrustedRun = sealEvidenceRun;
/** @deprecated Use validateEvidenceRun; validation establishes integrity, not independent trust. */
export const validateTrustedRun = validateEvidenceRun;

export function inspectTrustedArtifacts(projectDir: string, artifacts: TrustedArtifact[]): string[] {
  const errors: string[] = [];
  const extensions: Record<TrustedArtifactType, RegExp> = {
    screenshot: /\.(?:png|jpe?g|webp)$/i,
    recording: /\.(?:webm|mp4)$/i,
    trace: /\.zip$/i,
    "capture-manifest": /\.json$/i,
    "critic-report": /\.json$/i,
  };
  for (const artifact of artifacts ?? []) {
    if (!extensions[artifact.type]?.test(artifact.path)) {
      errors.push(`EVIDENCE_ARTIFACT_TYPE_MISMATCH: ${artifact.id} declares ${artifact.type} at ${artifact.path}`);
      continue;
    }
    const absolute = path.resolve(projectDir, artifact.path);
    if (!absolute.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      errors.push(`EVIDENCE_ARTIFACT_MISSING: ${artifact.id} at ${artifact.path}`);
      continue;
    }
    const bytes = fs.readFileSync(absolute);
    if (bytes.length !== artifact.bytes || sha256(bytes) !== artifact.sha256)
      errors.push(`EVIDENCE_ARTIFACT_HASH_MISMATCH: ${artifact.id} does not match actual artifact bytes`);
  }
  return errors;
}
