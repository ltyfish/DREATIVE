import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";
import { approvalStatus, readPlan } from "../shared/planGovernance.js";
import { hashFiles, sourceFiles } from "../shared/projectIdentity.js";
import { validateCriticArtifact, type CriticArtifact } from "../shared/critic.js";
import { sealTrustedRun, sha256, type TrustedArtifact } from "../shared/trustedRuns.js";

export function runTrustedCritic(projectDir: string, command: string, inputPath = ".dreative/critic.json"): { runId: string; manifestPath: string } {
  if (!command.trim()) throw new Error("critic-run requires --command for a separate critic process");
  const plan = readPlan(projectDir);
  const approval = approvalStatus(plan);
  if (!approval.approved) throw new Error("critic-run requires an approved, non-drifted plan");
  const inputFile = path.resolve(projectDir, inputPath);
  if (!inputFile.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(inputFile)) throw new Error(`missing critic input artifact: ${inputPath}`);
  const parsed = inputFile.endsWith(".yaml") ? parse(fs.readFileSync(inputFile, "utf8")) : JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const input = (parsed as CriticArtifact).input ?? parsed;
  const verificationFile = path.join(projectDir, ".dreative", "verify.json");
  if (!fs.existsSync(verificationFile)) throw new Error("critic-run requires a completed trusted browser verification");
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
  const reportArtifact: TrustedArtifact = {
    id: "critic-report", type: "critic-report", path: path.relative(projectDir, outputFile).replaceAll("\\", "/"),
    sha256: sha256(reportBytes), bytes: reportBytes.length,
  };
  const manifest = {
    schemaVersion: 1, runId, nonce, runnerIdentity: sha256(command), processId: result.pid ?? null,
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
  };
  const manifestFile = path.join(runDir, "trusted-critic.json");
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  sealTrustedRun(projectDir, "critic", runId, nonce, manifest);
  fs.writeFileSync(path.join(projectDir, ".dreative", "critic.json"), JSON.stringify(artifact, null, 2));
  return { runId, manifestPath: path.relative(projectDir, manifestFile).replaceAll("\\", "/") };
}
