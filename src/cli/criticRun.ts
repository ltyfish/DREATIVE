import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";
import { approvalStatus, readPlan, writePlan } from "../shared/planGovernance.js";
import { hashFiles, sourceFiles } from "../shared/projectIdentity.js";
import { validateCriticArtifact, type CriticArtifact } from "../shared/critic.js";
import { sealEvidenceRun, sha256, type EvidenceArtifact } from "../shared/evidenceRuns.js";
import { resolveAssuranceProvider, type AssuranceLevel } from "../shared/assurance.js";
import { appendWorkflowEvent } from "../shared/workflowTrace.js";

export type CriticProviderClass = "project-local-advisory" | "host-isolated" | "externally-attested";
export interface CriticProviderOptions {
  providerClass?: CriticProviderClass;
  providerId?: string;
  assuranceLevel?: AssuranceLevel;
}

export function enforceCriticProviderPolicy(
  providerClass: CriticProviderClass,
  assuranceLevel: AssuranceLevel,
  certifyingMode: boolean,
): void {
  if (certifyingMode && providerClass === "project-local-advisory")
    throw new Error("ADVISORY_CRITIC_CANNOT_CERTIFY: Full Audit, Dogfood and Production Certification require an allowed host-isolated or externally-attested provider");
  if (providerClass !== "project-local-advisory")
    throw new Error(`CRITIC_PROVIDER_UNAVAILABLE: --command runs under project authority and cannot establish ${providerClass}; use a host/external adapter when one is available`);
  if (assuranceLevel !== "local")
    throw new Error("CRITIC_ASSURANCE_OVERCLAIM: project-local command critics are local advisory evidence");
}

export function runTrustedCritic(projectDir: string, command: string, inputPath = ".dreative/critic.json",
  providerOptions: CriticProviderOptions = {}): { runId: string; manifestPath: string } {
  if (!command.trim()) throw new Error("critic-run requires --command for a separate critic process");
  const plan = readPlan(projectDir);
  const approval = approvalStatus(plan);
  if (!approval.approved) throw new Error("critic-run requires an approved, non-drifted plan");
  const providerClass = providerOptions.providerClass ?? "project-local-advisory";
  const assuranceProvider = resolveAssuranceProvider(projectDir);
  const providerId = providerOptions.providerId ?? (providerClass === "project-local-advisory" ? "project-local-command" : assuranceProvider.id);
  const assuranceLevel = providerOptions.assuranceLevel ?? (providerClass === "externally-attested" ? "externally-attested" : providerClass === "host-isolated" ? "host-attested" : "local");
  const certifyingMode = plan.contract.workflow.execution === "full-audit"
    || plan.contract.workflow.purpose === "dreative-dogfood"
    || plan.contract.workflow.purpose === "production-certification";
  enforceCriticProviderPolicy(providerClass, assuranceLevel, certifyingMode);
  const inputFile = path.resolve(projectDir, inputPath);
  if (!inputFile.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(inputFile)) throw new Error(`missing critic input artifact: ${inputPath}`);
  const parsed = inputFile.endsWith(".yaml") ? parse(fs.readFileSync(inputFile, "utf8")) : JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const input = (parsed as CriticArtifact).input ?? parsed;
  const verificationFile = path.join(projectDir, ".dreative", "verify.json");
  if (!fs.existsSync(verificationFile)) throw new Error("critic-run requires a completed integrity-linked browser verification");
  const verification = JSON.parse(fs.readFileSync(verificationFile, "utf8"));
  if (!verification.runId || !verification.buildIdentity?.productionBuildHash) throw new Error("critic-run requires verification run and build identities");
  const runId = `critic-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const nonce = crypto.randomBytes(24).toString("hex");
  const runDir = path.join(projectDir, ".dreative", "runs", runId);
  fs.mkdirSync(runDir, { recursive: true });
  const closedInputFile = path.join(runDir, "critic-input.json");
  const outputFile = path.join(runDir, "critic-report.json");
  fs.writeFileSync(closedInputFile, JSON.stringify(input, null, 2));
  const startedAt = new Date().toISOString();
  appendWorkflowEvent(projectDir, { type: "critic-started", assuranceLevel, data: { runId, providerId, providerClass, verificationRunId: verification.runId } });
  const result = spawnSync(command, {
    cwd: projectDir, shell: true, encoding: "utf8", windowsHide: true,
    env: { ...process.env, DREATIVE_CRITIC_INPUT: closedInputFile, DREATIVE_CRITIC_OUTPUT: outputFile, DREATIVE_CRITIC_RUN_ID: runId },
  });
  if ((result.status ?? 1) !== 0) throw new Error(`critic process exited ${result.status ?? 1}: ${result.stderr || result.stdout}`);
  if (!fs.existsSync(outputFile)) throw new Error("critic process did not write DREATIVE_CRITIC_OUTPUT");
  const report = JSON.parse(fs.readFileSync(outputFile, "utf8"));
  const artifact: CriticArtifact = { version: 1, input, report };
  const errors = validateCriticArtifact(artifact);
  if (errors.length) throw new Error(`critic output is invalid:\n${errors.join("\n")}`);
  const finishedAt = new Date().toISOString();
  const reportBytes = fs.readFileSync(outputFile);
  const reportArtifact: EvidenceArtifact = {
    id: "critic-report", type: "critic-report", path: path.relative(projectDir, outputFile).replaceAll("\\", "/"),
    sha256: sha256(reportBytes), bytes: reportBytes.length,
  };
  const ambitious = plan.contract.workflow.ambition === "award" || plan.contract.workflow.ambition === "experimental";
  const scoreKeys = ["ambitionFidelity", "conceptFidelity", "authorship", "temporalDevelopment", "treatmentPerceptibility", "mobileComposition", "interactionPurpose"];
  const scoreFailures = ambitious
    ? scoreKeys.filter((key) => typeof report.scores?.[key] !== "number" || report.scores[key] < 7)
    : [];
  if (ambitious && (typeof report.scores?.staticFeeling !== "number" || report.scores.staticFeeling > 3)) scoreFailures.push("staticFeeling");
  if (ambitious && plan.contract.selectedTreatments.includes("media")
    && (typeof report.scores?.mediaIntegrity !== "number" || report.scores.mediaIntegrity < 7)) scoreFailures.push("mediaIntegrity");
  const blockers = (report.findings ?? []).filter((item: any) => item.severity === "BLOCKER" && item.blocksCompletion);
  const majors = (report.findings ?? []).filter((item: any) => item.severity === "MAJOR" && item.blocksCompletion);
  const manifest = {
    schemaVersion: 2, runId, nonce, runnerIdentity: sha256(command), processId: result.pid ?? null,
    providerId, providerClass, assuranceLevel,
    startedAt, finishedAt, approvedPlanHash: approval.currentHash,
    sourceHash: hashFiles(projectDir, sourceFiles(projectDir)), buildHash: verification.buildIdentity.productionBuildHash,
    verificationRunId: verification.runId,
    inputArtifactHashes: {
      criticInput: sha256(fs.readFileSync(closedInputFile)),
      ...Object.fromEntries((input.evidence ?? []).filter((item: any) => item.artifactPath).map((item: any) => {
        const file = path.resolve(projectDir, item.artifactPath);
        if (!file.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(file)) throw new Error(`critic input artifact is missing: ${item.artifactPath}`);
        return [item.id, sha256(fs.readFileSync(file))];
      })),
    },
    reportHash: sha256(JSON.stringify(report)),
    artifact: reportArtifact,
    computedResult: {
      pass: ["PASS", "PASS AFTER REVISION"].includes(report.verdict) && blockers.length === 0
        && (!certifyingMode || majors.length === 0) && scoreFailures.length === 0,
      criticVerdictAdvisoryOnly: true,
      blockers: blockers.length,
      majorFindings: majors.length,
      scoreFailures,
    },
  };
  const manifestFile = path.join(runDir, "trusted-critic.json");
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  sealEvidenceRun(projectDir, "critic", runId, nonce, manifest);
  fs.writeFileSync(path.join(projectDir, ".dreative", "critic.json"), JSON.stringify(artifact, null, 2));
  plan.execution.evidenceState = {
    ...(plan.execution.evidenceState ?? { verificationRunId: verification.runId, verificationStatus: "current", certificationStatus: "missing" }),
    verificationRunId: verification.runId, verificationStatus: "current",
    criticRunId: runId, criticStatus: "current", certificationStatus: "stale",
  };
  if (plan.execution.run) plan.execution.run.criticRunId = runId;
  plan.execution.lastUpdatedAt = finishedAt;
  writePlan(projectDir, plan);
  appendWorkflowEvent(projectDir, { type: "critic-completed", assuranceLevel,
    data: { runId, providerId, providerClass, verificationRunId: verification.runId, computedPass: manifest.computedResult.pass } });
  return { runId, manifestPath: path.relative(projectDir, manifestFile).replaceAll("\\", "/") };
}
