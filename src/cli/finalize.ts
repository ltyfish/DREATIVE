import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { runDirectDesignAudit } from "./audit.js";
import { checkSkillInstallation } from "./installSkill.js";
import { approvalStatus, readPlan, validateCanonicalPlan, writePlan } from "../shared/planGovernance.js";
import { computeCurrentIdentity } from "../shared/projectIdentity.js";
import { inspectEvidenceArtifacts, sha256, validateEvidenceRun } from "../shared/evidenceRuns.js";
import { assuranceAtLeast, assuranceLimitation, requiredAssurance, validateProvenance, validateProvenanceAssurance, validateProvenanceSource } from "../shared/assurance.js";
import { appendWorkflowEvent, deriveDogfoodReport, validateWorkflowTrace } from "../shared/workflowTrace.js";
import { reconcileEvidenceState } from "../shared/evidenceState.js";

export interface FinalizeResult { ok: boolean; commands: { command: string; exitCode: number }[]; blockers: string[]; }

const readJson = (file: string): any => JSON.parse(fs.readFileSync(file, "utf8"));
const runFile = (root: string, runId: string | null | undefined, name: string): string | null => {
  if (!runId) return null;
  const file = path.join(root, ".dreative", "runs", runId, name);
  return fs.existsSync(file) ? file : null;
};

function executeScripts(projectDir: string): { commands: { command: string; exitCode: number }[]; blockers: string[] } {
  const packageFile = path.join(projectDir, "package.json");
  const pkg = fs.existsSync(packageFile) ? readJson(packageFile) : {};
  const commands: { command: string; exitCode: number }[] = [];
  const blockers: string[] = [];
  for (const script of ["build", "test", "typecheck", "lint"] as const) {
    if (!pkg.scripts?.[script]) continue;
    const command = `npm run ${script}`;
    const result = process.platform === "win32"
      ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], { cwd: projectDir, stdio: "inherit", windowsHide: true })
      : spawnSync("npm", ["run", script], { cwd: projectDir, stdio: "inherit" });
    const exitCode = result.status ?? 1;
    commands.push({ command, exitCode });
    if (exitCode !== 0) blockers.push(`${command} exited ${exitCode}`);
  }
  return { commands, blockers };
}

export function runFinalize(projectDir: string, options: { target: "claude" | "codex"; sourceDir: string; packageVersion: string }): FinalizeResult {
  const blockers: string[] = [];
  const commands: { command: string; exitCode: number }[] = [];
  const planFile = path.join(projectDir, ".dreative", "plan.yaml");
  if (!fs.existsSync(planFile))
    return { ok: false, commands, blockers: [
      "migration: finalization requires canonical .dreative/plan.yaml; legacy evidence cannot certify completion",
      "verification provenance: finalization requires an integrity-linked `dreative verify` evidence run",
    ] };

  const plan = readPlan(projectDir);
  appendWorkflowEvent(projectDir, { type: "finalization-attempted", data: { contractHash: approvalStatus(plan).currentHash } });
  const staleReasons = reconcileEvidenceState(projectDir, plan);
  if (staleReasons.length) {
    appendWorkflowEvent(projectDir, { type: "verification-stale", data: { reasons: staleReasons } });
    writePlan(projectDir, plan);
  }
  blockers.push(...validateCanonicalPlan(plan).map((item) => `plan: ${item}`));
  const approval = approvalStatus(plan);
  if (!approval.approved) blockers.push("approval: current contract is not approved or has drifted");
  blockers.push(...validateProvenance(plan.approval.provenance, plan.contract.createdAt).map((item) => `approval provenance: ${item}`));
  blockers.push(...validateProvenanceSource(projectDir, plan.approval.provenance).map((item) => `approval provenance: ${item}`));
  blockers.push(...validateProvenanceAssurance(projectDir, plan.approval.provenance).map((item) => `approval provenance: ${item}`));
  blockers.push(...validateWorkflowTrace(projectDir).map((item) => `workflow trace: ${item}`));

  const requiredLevel = requiredAssurance(plan.contract.workflow.purpose);
  const approvalLevel = plan.approval.provenance?.assuranceLevel ?? "local";
  if (!assuranceAtLeast(approvalLevel, requiredLevel))
    blockers.push(`ASSURANCE_BLOCKED: ${plan.contract.workflow.purpose} requires ${requiredLevel} approval provenance; available=${approvalLevel}`);

  const state = plan.execution.evidenceState;
  if (state?.verificationStatus !== "current") blockers.push(`verification provenance: evidence is ${state?.verificationStatus ?? "missing"}; finalization requires an integrity-linked \`dreative verify\` run`);
  if (state?.criticStatus !== "current") blockers.push(`critic evidence is ${state?.criticStatus ?? "missing"}; run dreative critic-run with a qualifying provider`);

  const verificationManifestFile = runFile(projectDir, state?.verificationRunId, "trusted-verification.json");
  const verificationReportFile = runFile(projectDir, state?.verificationRunId, "verify.json");
  let verificationManifest: any = null;
  let verificationReport: any = null;
  if (!verificationManifestFile || !verificationReportFile) blockers.push("evidence provenance: current verification run files are missing");
  else {
    verificationManifest = readJson(verificationManifestFile);
    verificationReport = readJson(verificationReportFile);
    blockers.push(...validateEvidenceRun(projectDir, "browser-verification", verificationManifest));
    blockers.push(...inspectEvidenceArtifacts(projectDir, verificationManifest.artifacts ?? []));
    if (verificationManifest.approvedPlanHash !== approval.currentHash) blockers.push("verification contract hash is stale");
    if (verificationManifest.verificationMode !== "production"
      && (plan.contract.workflow.execution === "full-audit" || plan.contract.workflow.purpose !== "project-delivery"))
      blockers.push("DEVELOPMENT_VERIFICATION_CANNOT_CERTIFY");
    if (!assuranceAtLeast(verificationManifest.assuranceLevel ?? "local", requiredLevel))
      blockers.push(`browser evidence assurance ${verificationManifest.assuranceLevel ?? "local"} is below ${requiredLevel}`);
    if ((verificationReport.evidence ?? []).some((item: any) => item.status !== "pass"))
      blockers.push("one or more requirement-specific browser assertions did not pass");
    const actual = computeCurrentIdentity(projectDir, verificationReport.buildIdentity);
    for (const key of ["sourceTreeHash", "packageJsonHash", "lockfileHash", "publicAssetHash", "productionBuildHash"] as const)
      if (actual[key] !== verificationReport.buildIdentity[key]) blockers.push(`current ${key} differs from the verified production state`);
  }

  const criticManifestFile = runFile(projectDir, state?.criticRunId, "trusted-critic.json");
  let criticManifest: any = null;
  if (!criticManifestFile) blockers.push("critic provenance: current critic manifest is missing");
  else {
    criticManifest = readJson(criticManifestFile);
    blockers.push(...validateEvidenceRun(projectDir, "critic", criticManifest));
    blockers.push(...inspectEvidenceArtifacts(projectDir, criticManifest.artifact ? [criticManifest.artifact] : []));
    if (criticManifest.approvedPlanHash !== approval.currentHash) blockers.push("critic contract hash is stale");
    if (criticManifest.verificationRunId !== state?.verificationRunId) blockers.push("critic reviewed a different verification run");
    if (verificationManifest && criticManifest.buildHash !== verificationManifest.buildHash) blockers.push("critic reviewed a different production build");
    if (!criticManifest.computedResult?.pass) blockers.push("Dreative-computed critic result does not pass");
    const certifyingMode = plan.contract.workflow.execution === "full-audit"
      || plan.contract.workflow.purpose === "dreative-dogfood"
      || plan.contract.workflow.purpose === "production-certification";
    if (certifyingMode && criticManifest.providerClass === "project-local-advisory")
      blockers.push("ADVISORY_CRITIC_CANNOT_CERTIFY");
    if (!assuranceAtLeast(criticManifest.assuranceLevel ?? "local", requiredLevel))
      blockers.push(`critic assurance ${criticManifest.assuranceLevel ?? "local"} is below ${requiredLevel}`);
  }

  blockers.push(...checkSkillInstallation({ sourceDir: options.sourceDir, projectDir, packageVersion: options.packageVersion, target: options.target })
    .map((item) => `skill installation: ${item}`));

  if (blockers.length === 0) {
    const executed = executeScripts(projectDir);
    commands.push(...executed.commands);
    blockers.push(...executed.blockers);
  }
  if (blockers.length === 0) {
    const audit = runDirectDesignAudit(projectDir);
    blockers.push(...audit.findings.filter((item) => item.level === "error").map((item) => `${item.check}: ${item.message}`));
  }

  const unique = [...new Set(blockers)];
  if (unique.length) {
    if (plan.execution.run) plan.execution.run.finalizationStatus = "failed";
    plan.execution.lastUpdatedAt = new Date().toISOString();
    writePlan(projectDir, plan);
    return { ok: false, commands, blockers: unique };
  }

  const finalAssurance = [approvalLevel, verificationManifest.assuranceLevel ?? "local", criticManifest.assuranceLevel ?? "local"]
    .sort((a, b) => ["local", "host-attested", "externally-attested"].indexOf(a) - ["local", "host-attested", "externally-attested"].indexOf(b))[0];
  if (plan.contract.workflow.purpose === "dreative-dogfood") {
    fs.writeFileSync(path.join(projectDir, ".dreative", "behaviour-analysis.json"), JSON.stringify(deriveDogfoodReport(projectDir), null, 2));
  }
  const certification = {
    schemaVersion: 2,
    generatedBy: "dreative-finalize",
    generatedAt: new Date().toISOString(),
    completionStatus: "complete",
    contractHash: approval.currentHash,
    sourceHash: verificationManifest.sourceHash,
    lockfileHash: verificationManifest.lockfileHash,
    productionBuildHash: verificationManifest.buildHash,
    verificationRunId: state!.verificationRunId,
    criticRunId: state!.criticRunId,
    assuranceLevel: finalAssurance,
    assuranceLimitation: assuranceLimitation(finalAssurance),
    commands,
    workflowTraceHash: sha256(fs.readFileSync(path.join(projectDir, ".dreative", "workflow-trace.jsonl"))),
  };
  fs.writeFileSync(path.join(projectDir, ".dreative", "certification.json"), JSON.stringify(certification, null, 2));
  appendWorkflowEvent(projectDir, { type: "certification-generated", assuranceLevel: finalAssurance as any,
    data: { verificationRunId: state!.verificationRunId, criticRunId: state!.criticRunId } });
  if (plan.execution.run) plan.execution.run.finalizationStatus = "passed";
  plan.execution.evidenceState!.certificationStatus = "current";
  plan.execution.lastUpdatedAt = new Date().toISOString();
  writePlan(projectDir, plan);
  return { ok: true, commands, blockers: [] };
}
