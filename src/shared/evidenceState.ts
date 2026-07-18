import fs from "node:fs";
import path from "node:path";
import { approvalStatus, type CanonicalPlan } from "./planGovernance.js";
import { computeCurrentIdentity } from "./projectIdentity.js";

export function reconcileEvidenceState(projectDir: string, plan: CanonicalPlan): string[] {
  const state = plan.execution.evidenceState;
  if (!state) return [];
  const reasons: string[] = [];
  const staleVerification = (reason: string) => {
    if (!reasons.includes(reason)) reasons.push(reason);
    if (state.verificationRunId) state.verificationStatus = "stale";
    if (state.criticRunId) state.criticStatus = "stale";
    state.certificationStatus = "stale";
  };
  if (state.verificationRunId) {
    const runDir = path.join(projectDir, ".dreative", "runs", state.verificationRunId);
    const manifestFile = path.join(runDir, "trusted-verification.json");
    const reportFile = path.join(runDir, "verify.json");
    if (!fs.existsSync(manifestFile) || !fs.existsSync(reportFile)) staleVerification("current verification files are missing");
    else {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
      const report = JSON.parse(fs.readFileSync(reportFile, "utf8"));
      if (manifest.approvedPlanHash !== approvalStatus(plan).currentHash) staleVerification("contract changed after verification");
      const actual = computeCurrentIdentity(projectDir, report.buildIdentity);
      for (const key of ["sourceTreeHash", "packageJsonHash", "lockfileHash", "publicAssetHash", "productionBuildHash"] as const)
        if (actual[key] !== report.buildIdentity[key]) staleVerification(`${key} changed after verification`);
    }
  }
  if (state.criticRunId && state.criticStatus === "current") {
    const file = path.join(projectDir, ".dreative", "runs", state.criticRunId, "trusted-critic.json");
    if (!fs.existsSync(file)) {
      state.criticStatus = "stale";
      state.certificationStatus = "stale";
      reasons.push("current critic files are missing");
    } else {
      const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
      if (manifest.approvedPlanHash !== approvalStatus(plan).currentHash || manifest.verificationRunId !== state.verificationRunId) {
        state.criticStatus = "stale";
        state.certificationStatus = "stale";
        reasons.push("critic does not match the current contract or verification run");
      }
    }
  }
  if (reasons.length) {
    state.invalidatedAt = new Date().toISOString();
    state.invalidationReason = reasons.join("; ");
  }
  return reasons;
}
