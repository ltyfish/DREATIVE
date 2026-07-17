import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, validateCanonicalPlan, writePlan, approvePlan } from "../shared/planGovernance.js";
import { inspectTrustedArtifacts, sealTrustedRun, validateTrustedRun } from "../shared/trustedRuns.js";
import { detectProjectPreflight } from "../shared/preflight.js";

function project(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-fail-closed-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  fs.writeFileSync(path.join(root, "src", "App.tsx"), "export const App=()=> <main>baseline</main>");
  return root;
}

test("certification planning rejects missing contracts, placeholders and fake peaks", () => {
  const root = project();
  const plan = createPlan(root, {
    workflow: { ambition: "experimental", execution: "full-audit", prototype: "required", purpose: "production-certification" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["motion", "experimental"], treatmentDecisionExplicit: true,
  });
  plan.contract.projectDefinition = {
    purpose: "TBD", targetAudience: "TBD", primaryUserJourney: "TBD", routes: ["/"], requiredFunctionality: [],
    extractedRequirements: [], nonGoals: [], preservedContentOrFunctionality: [],
  };
  plan.contract.experimentalPeaks = [{
    id: "cards", chapter: "after hero", mechanismFamily: "card grid", plannedBehaviour: "A normal card grid fades in.",
    startState: "Cards begin below the heading.", activeState: "Cards are visible in their grid.",
    resolution: "Cards remain visible in the grid.", inputRelationship: "A normal button changes the active card.",
    mobileStrategy: "Cards stack in one column on mobile.", reducedMotionStrategy: "Cards render without their entrance.",
    fallbackState: "Cards render as a standard semantic list.", prototypeRiskFamily: "none", acceptance: ["Cards are visible."],
  }];
  const errors = validateCanonicalPlan(plan).join("\n");
  assert.match(errors, /PLAN_MISSING_PRIMARY_JOURNEY/);
  assert.match(errors, /PLAN_MISSING_SECTION_STATE_CONTRACT/);
  assert.match(errors, /PLAN_MISSING_REQUIREMENT_TRACEABILITY/);
  assert.match(errors, /PLAN_EXPERIMENTAL_PEAK_TOO_GENERIC/);
});

test("approval records cannot claim a non-interactive human origin", () => {
  const root = project();
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    substantial: false, projectKind: "from-scratch", transformationDepth: "restyle", treatmentDecisionExplicit: true,
  });
  for (const allocation of plan.contract.treatmentAllocation) {
    allocation.locations = ["home"]; allocation.contribution = "Keeps the fixture usable and legible."; allocation.acceptance = ["Fixture remains usable."];
  }
  writePlan(root, plan);
  assert.throws(() => approvePlan(root, { mode: "human", origin: "explicit-preauthorization" }), /FAKE_HUMAN_APPROVAL/);
});

test("material source changes before approval are rejected", () => {
  const root = project();
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    substantial: false, projectKind: "from-scratch", transformationDepth: "restyle", treatmentDecisionExplicit: true,
  });
  plan.contract.scope.dependencyInstallationAllowed = false;
  plan.contract.scope.successCriteria = ["The baseline remains visible."];
  plan.contract.creativeSources = { references: { preference: "none", urls: [], notes: [], antiReferences: [] }, generatedImages: "not-allowed", sourcedImages: "not-allowed", generatedVideo: "not-allowed", sourcedVideo: "not-allowed", threeDAssets: "not-allowed", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [] };
  plan.contract.selectedConcept = "A direct utility fixture keeps the baseline clearly visible.";
  plan.contract.capabilityPreflight = detectProjectPreflight(root);
  plan.contract.blueprint = [{ pageId: "home", sectionId: "main", intent: "Show the baseline." }];
  for (const allocation of plan.contract.treatmentAllocation) {
    allocation.locations = ["home/main"]; allocation.contribution = "Keeps the fixture usable and legible."; allocation.acceptance = ["Fixture remains usable."];
  }
  writePlan(root, plan);
  fs.writeFileSync(path.join(root, "src", "App.tsx"), "export const App=()=> <main>fully implemented before approval</main>");
  assert.throws(() => approvePlan(root), /IMPLEMENTATION_STARTED_BEFORE_PLAN_APPROVAL/);
});

test("trusted evidence rejects JSON recordings, missing bytes, wrong hashes and edited manifests", () => {
  const root = project();
  const evidenceDir = path.join(root, ".dreative", "runs", "run");
  fs.mkdirSync(evidenceDir, { recursive: true });
  const json = path.join(evidenceDir, "recording.json");
  fs.writeFileSync(json, "{}");
  const artifactErrors = inspectTrustedArtifacts(root, [{ id: "recording", type: "recording", path: ".dreative/runs/run/recording.json", sha256: "0".repeat(64), bytes: 2 }]);
  assert.ok(artifactErrors.some((item) => item.includes("TYPE_MISMATCH")));
  const manifest: any = { runId: "run", nonce: "random-nonce", artifacts: [] };
  sealTrustedRun(root, "browser-verification", "run", "random-nonce", manifest);
  manifest.artifacts.push({ id: "fake" });
  assert.ok(validateTrustedRun(root, "browser-verification", manifest).some((item) => item.includes("EDITED_AFTER_GENERATION")));
  const critic: any = { runId: "critic-run", nonce: "critic-random-nonce", reportHash: "a".repeat(64) };
  sealTrustedRun(root, "critic", critic.runId, critic.nonce, critic);
  critic.reportHash = "b".repeat(64);
  assert.ok(validateTrustedRun(root, "critic", critic).some((item) => item.includes("CRITIC_EDITED_AFTER_GENERATION")));
});
