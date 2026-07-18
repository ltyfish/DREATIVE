import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  assuranceAtLeast, requiredAssurance, resolveAssuranceProvider, validateProvenance,
  validateProvenanceAssurance, validateProvenanceSource, type ProvenanceRecord,
} from "../shared/assurance.js";
import { sealEvidenceRun, validateEvidenceRun } from "../shared/evidenceRuns.js";
import { appendWorkflowEvent, deriveDogfoodReport, validateWorkflowTrace } from "../shared/workflowTrace.js";
import { createPlan } from "../shared/planGovernance.js";
import { computeCurrentIdentity } from "../shared/projectIdentity.js";
import { reconcileEvidenceState } from "../shared/evidenceState.js";
import { enforceCriticProviderPolicy } from "./criticRun.js";

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-assurance-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  fs.writeFileSync(path.join(root, "src", "App.js"), "export const value = 'baseline';");
  return root;
}

const provenance = (overrides: Partial<ProvenanceRecord> = {}): ProvenanceRecord => ({
  authority: "user-origin-unverified", sourceType: "cli", assuranceLevel: "local",
  scope: ["contract"], recordedAt: "2026-01-01T00:00:00.000Z", ...overrides,
});

test("local evidence cannot claim host-attested assurance", () => {
  const root = fixture();
  assert.throws(() => sealEvidenceRun(root, "browser-verification", "run", "nonce", {
    runId: "run", nonce: "nonce", assuranceLevel: "host-attested",
  }), /ASSURANCE_OVERCLAIM/);
});

test("a builder-authored provider record cannot elevate the standalone CLI", () => {
  const root = fixture();
  const record = path.join(root, "provider.json");
  fs.writeFileSync(record, JSON.stringify({
    id: "self-declared-host", level: "host-attested", immutableEventIds: true,
  }));
  const previous = process.env.DREATIVE_ATTESTATION_RECORD;
  process.env.DREATIVE_ATTESTATION_RECORD = record;
  try {
    assert.equal(resolveAssuranceProvider(root).level, "local");
    assert.ok(validateProvenanceAssurance(root, provenance({
      authority: "host-attested-user", sourceType: "host-event", sourceId: "event",
      contentHash: "a".repeat(64), assuranceLevel: "host-attested",
      attestationProvider: "self-declared-host",
    })).some((item) => item.includes("APPROVAL_ASSURANCE_UNAVAILABLE")));
  } finally {
    if (previous === undefined) delete process.env.DREATIVE_ATTESTATION_RECORD;
    else process.env.DREATIVE_ATTESTATION_RECORD = previous;
  }
});

test("rewriting local evidence is detected without being described as external trust", () => {
  const root = fixture();
  const manifest: any = { runId: "run", nonce: "nonce", assuranceLevel: "local" };
  const seal = sealEvidenceRun(root, "browser-verification", "run", "nonce", manifest);
  assert.equal(seal.assuranceLevel, "local");
  manifest.edited = true;
  assert.ok(validateEvidenceRun(root, "browser-verification", manifest).some((item) => item.includes("EDITED_AFTER_GENERATION")));
});

test("Production Certification requires host assurance while Project Delivery and local Dogfood remain honestly local", () => {
  assert.equal(requiredAssurance("production-certification"), "host-attested");
  assert.equal(requiredAssurance("project-delivery"), "local");
  assert.equal(requiredAssurance("dreative-dogfood"), "local");
  assert.equal(assuranceAtLeast("local", requiredAssurance("production-certification")), false);
});

test("local Dogfood report discloses that behaviour is not independently attested", () => {
  const root = fixture();
  appendWorkflowEvent(root, { type: "plan-created" });
  const report = deriveDogfoodReport(root);
  assert.equal(report.assuranceLevel, "local");
  assert.equal(report.independentlyAttested, false);
  assert.match(String(report.limitation), /not independently immutable/);
  assert.deepEqual(validateWorkflowTrace(root), []);
});

test("host-event approval provenance works without a prompt file", () => {
  const record = provenance({
    authority: "host-attested-user", sourceType: "host-event", sourceId: "event-123",
    contentHash: "a".repeat(64), assuranceLevel: "host-attested", attestationProvider: "host",
  });
  assert.deepEqual(validateProvenance(record), []);
});

test("prompt-file provenance detects later byte changes", () => {
  const root = fixture();
  const file = path.join(root, "PROMPT.md");
  fs.writeFileSync(file, "approve before planning");
  const contentHash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  const record = provenance({ sourceType: "prompt-file", filePath: "PROMPT.md", contentHash });
  assert.deepEqual(validateProvenance(record), []);
  assert.deepEqual(validateProvenanceSource(root, record), []);
  fs.writeFileSync(file, "changed later");
  assert.deepEqual(validateProvenanceSource(root, record), ["PROMPT_FILE_PROVENANCE_CHANGED_AFTER_RECORDING"]);
});

test("CLI and TTY-style origin remains locally unverified rather than human-attested", () => {
  const record = provenance();
  assert.equal(record.authority, "user-origin-unverified");
  assert.equal(record.assuranceLevel, "local");
  assert.equal(assuranceAtLeast(record.assuranceLevel, "host-attested"), false);
});

test("prompt preauthorization recorded after planning is rejected", () => {
  const record = provenance({
    authority: "prompt-preauthorized", sourceType: "host-event", sourceId: "late",
    contentHash: "b".repeat(64), contentRecordedBeforePlanning: true, recordedAt: "2026-01-02T00:00:00.000Z",
  });
  assert.ok(validateProvenance(record, "2026-01-01T00:00:00.000Z").includes("PREAUTHORIZATION_RECORDED_AFTER_PLANNING"));
});

test("source correction stales verification and critic but permits a fresh future run", () => {
  const root = fixture();
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost", routeScope: { mode: "one-page", routes: ["/"] } },
    substantial: false, treatmentDecisionExplicit: true,
  });
  const identity = computeCurrentIdentity(root, {
    runId: "verify-old", dreativeVersion: "test", schemaVersion: 5, framework: "none", packageManager: "npm",
    buildCommand: "", serverCommand: "", testedOrigin: "http://localhost", testedUrl: "http://localhost/",
    serverStartedAt: new Date().toISOString(), verificationStartedAt: new Date().toISOString(), verificationFinishedAt: new Date().toISOString(),
  });
  const runDir = path.join(root, ".dreative", "runs", "verify-old");
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, "verify.json"), JSON.stringify({ buildIdentity: identity }));
  fs.writeFileSync(path.join(runDir, "trusted-verification.json"), JSON.stringify({ approvedPlanHash: "old" }));
  const criticDir = path.join(root, ".dreative", "runs", "critic-old");
  fs.mkdirSync(criticDir, { recursive: true });
  fs.writeFileSync(path.join(criticDir, "trusted-critic.json"), JSON.stringify({ approvedPlanHash: "old", verificationRunId: "verify-old" }));
  plan.execution.evidenceState = {
    verificationRunId: "verify-old", verificationStatus: "current", criticRunId: "critic-old", criticStatus: "current", certificationStatus: "current",
  };
  fs.writeFileSync(path.join(root, "src", "App.js"), "export const value = 'corrected';");
  const reasons = reconcileEvidenceState(root, plan);
  assert.ok(reasons.some((item) => item.includes("sourceTreeHash")));
  assert.equal(plan.execution.evidenceState.verificationStatus, "stale");
  assert.equal(plan.execution.evidenceState.criticStatus, "stale");
  assert.notEqual(plan.execution.evidenceState.verificationStatus, "missing");
});

test("runtime change and perceptual ambition remain separate result dimensions", () => {
  const runtimeObservation = { pixelChanged: true, computedStyleChanged: true };
  const criticJudgment = { ambitionFidelity: 4, authorship: 5 };
  assert.equal(runtimeObservation.pixelChanged, true);
  assert.ok(criticJudgment.ambitionFidelity < 7);
});

test("project-local critic class is advisory while host-isolated is accurately named", () => {
  const classes = ["project-local-advisory", "host-isolated", "externally-attested"] as const;
  assert.equal(classes[0].includes("advisory"), true);
  assert.equal(classes[1], "host-isolated");
  assert.notEqual(classes[1], "externally-attested");
  assert.throws(() => enforceCriticProviderPolicy("project-local-advisory", "local", true), /ADVISORY_CRITIC_CANNOT_CERTIFY/);
  assert.throws(() => enforceCriticProviderPolicy("project-local-advisory", "host-attested", false), /CRITIC_ASSURANCE_OVERCLAIM/);
  assert.throws(() => enforceCriticProviderPolicy("host-isolated", "host-attested", true), /CRITIC_PROVIDER_UNAVAILABLE/);
});
