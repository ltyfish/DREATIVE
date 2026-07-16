import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { approvePlan, approvalStatus, contractHash, createPlan, migrateLegacyPlan, readPlan, validateCanonicalPlan, writePlan, type CanonicalPlan } from "./planGovernance.js";
import { runPlanCommand, unresolvedCreativeSourceQuestions } from "../cli/plan.js";
import { detectProjectPreflight } from "./preflight.js";

function root(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-plan-v7-"));
  fs.mkdirSync(path.join(dir, "src"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ scripts: { dev: "vite", build: "vite build", test: "node --test" }, dependencies: { vite: "^5" } }));
  fs.writeFileSync(path.join(dir, "package-lock.json"), "{}");
  return dir;
}

function completePlan(dir: string): CanonicalPlan {
  const plan = createPlan(dir, {
    workflow: { ambition: "award", execution: "full-audit", prototype: "required", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile", "motion", "interaction"],
  });
  plan.contract.scope.requiredFunctionality = ["Navigation and primary workflow remain operational."];
  plan.contract.scope.dependencyInstallationAllowed = true;
  plan.contract.creativeSources = {
    references: { preference: "open-to-suggestions", urls: [], notes: [], antiReferences: [] },
    generatedImages: "ask-per-asset", sourcedImages: "ask-per-asset", generatedVideo: "ask-per-asset", sourcedVideo: "ask-per-asset",
    threeDAssets: "ask-per-asset", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
  };
  plan.contract.scope.successCriteria = ["The experience feels authored and develops beyond the hero."];
  plan.contract.capabilityPreflight = detectProjectPreflight(dir);
  plan.contract.selectedConcept = "A living editorial instrument develops across the full route.";
  plan.contract.blueprint = [{ pageId: "home", sectionId: "hero", intent: "Opening instrument" }];
  plan.contract.experienceDistribution = [
    { pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "The editorial rail establishes the route state." },
    { pageId: "home", sectionId: "work", order: 1, role: "transformation", continuityContribution: "The rail changes role after the first viewport." },
    { pageId: "home", sectionId: "finale", order: 2, role: "peak", continuityContribution: "The rail resolves as a second authored peak." },
  ];
  plan.contract.experienceArc = {
    openingState: "The instrument begins quiet and grounded.", firstTransformation: "Media unfolds into a second composition.",
    sectionProgression: "The instrument persists through three chapters.", peaksAndRests: "Transformations alternate with calm reading space.",
    persistentSystem: "One editorial rail develops across sections.", userControlledMoment: "Drag changes the active media viewpoint.",
    mobileTranslation: "Tap and swipe replace fine pointer control at 390px.", finalResolution: "The rail resolves into the final action.",
  };
  plan.contract.motionAndMediaStrategy = "Structural media states hand off between chapters.";
  plan.contract.mobileTranslation = "The signature becomes a swipe-controlled compact instrument.";
  plan.contract.acceptanceCriteria = ["Observe start, midpoint, handoff and resolution."];
  for (const item of plan.contract.treatmentAllocation) {
    item.locations = ["home/hero"];
    item.contribution = `${item.treatment} contributes a visible, testable part of the concept.`;
    item.acceptance = [`${item.treatment} is perceptible in browser evidence.`];
  }
  return plan;
}

test("substantial plan init stops when Ambition is missing", () => {
  const dir = root();
  assert.equal(runPlanCommand(dir, ["init", "--execution", "full-audit", "--prototype", "required", "--purpose", "dreative-dogfood", "--preview-url", "http://localhost:4173", "--routes", "/"]), 2);
  assert.equal(fs.existsSync(path.join(dir, ".dreative", "plan.yaml")), false);
});

test("creative-source intake asks unresolved reference, media, 3D and package-permission questions", () => {
  const questions = unresolvedCreativeSourceQuestions(["--references", "https://example.com", "--generated-images", "allow", "--3d-assets", "supplied-only"]);
  assert.ok(!questions.some((item) => item.startsWith("References:")));
  assert.ok(!questions.some((item) => item.startsWith("Generated images:")));
  assert.ok(!questions.some((item) => item.startsWith("3D assets/props:")));
  assert.ok(questions.some((item) => item.startsWith("Sourced images:")));
  assert.ok(questions.some((item) => item.startsWith("Generated video:")));
  assert.ok(questions.some((item) => item.startsWith("Sourced video:")));
  assert.ok(questions.some((item) => item.startsWith("Package installation:")));
});

test("values supplied by the user are recorded without being replaced", () => {
  const dir = root();
  assert.equal(runPlanCommand(dir, ["init", "--ambition", "experimental", "--execution", "fast", "--prototype", "skip", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/work", "--references", "https://example.com/ref", "--generated-images", "ask", "--sourced-images", "allow", "--generated-video", "deny", "--sourced-video", "ask", "--3d-assets", "supplied-only", "--supplied-3d", "assets/product.glb"]), 0);
  const plan = readPlan(dir);
  assert.deepEqual(plan.contract.workflow, { ambition: "experimental", execution: "fast", prototype: "skip", purpose: "project-delivery" });
  assert.deepEqual(plan.contract.target.routeScope.routes, ["/work"]);
  assert.equal(plan.contract.creativeSources.references.preference, "provided");
  assert.deepEqual(plan.contract.creativeSources.references.urls, ["https://example.com/ref"]);
  assert.equal(plan.contract.creativeSources.generatedImages, "ask-per-asset");
  assert.equal(plan.contract.creativeSources.sourcedImages, "allowed");
  assert.equal(plan.contract.creativeSources.generatedVideo, "not-allowed");
  assert.equal(plan.contract.creativeSources.threeDAssets, "supplied-only");
  assert.deepEqual(plan.contract.creativeSources.suppliedThreeDAssets, ["assets/product.glb"]);
});

test("all treatments require confirmation and remain selected", () => {
  const dir = root();
  const args = ["init", "--ambition", "award", "--execution", "lean", "--prototype", "auto", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "all"];
  assert.equal(runPlanCommand(dir, args), 2);
  assert.equal(runPlanCommand(dir, [...args, "--confirm-all"]), 0);
  const plan = readPlan(dir);
  assert.equal(plan.contract.allTreatmentsExplicit, true);
  assert.equal(plan.contract.selectedTreatments.length, 10);
});

test("contract edits invalidate approval while execution updates do not", () => {
  const dir = root();
  const plan = completePlan(dir);
  writePlan(dir, plan);
  approvePlan(dir);
  const approved = readPlan(dir);
  const approvedHash = approved.approval.contractHash;
  approved.execution.currentPhase = "implementation";
  approved.execution.lastUpdatedAt = new Date().toISOString();
  writePlan(dir, approved);
  assert.equal(approvalStatus(readPlan(dir)).approved, true);
  const edited = readPlan(dir);
  edited.contract.selectedConcept = "A materially changed concept replaces the approved editorial instrument.";
  writePlan(dir, edited);
  assert.equal(approvalStatus(readPlan(dir)).drifted, true);
  assert.equal(approvedHash, contractHash(approved.contract));
});

test("v3-v6 plans migrate or produce precise diagnostics", () => {
  for (const version of [3, 4, 5, 6]) {
    const result = migrateLegacyPlan(root(), { version, tier: version === 3 ? "solid" : "premium", depth: "restructure", scope: "substantial", projectKind: "redesign", skills: ["ux", "mobile"], pages: [{ id: "home", sections: [{ id: "hero", layoutFamily: "split" }] }], designRead: { concept: "A migrated editorial route." } });
    assert.equal(result.plan.version, 8);
    assert.ok(result.diagnostics.some((item) => item.includes("unapproved v8")));
  }
  assert.throws(() => migrateLegacyPlan(root(), { version: 2 }), /expected v3-v7/);
});

test("canonical v7 migration produces clear v8 review guidance", () => {
  const dir = root();
  const current = completePlan(dir);
  const legacy = {
    version: 7,
    contract: {
      ...current.contract,
      treatmentAllocation: current.contract.treatmentAllocation.map(({ routeRole, ...item }) => item),
      mechanismFallbacks: [{ mechanism: "scroll roast sequence", fallback: "three semantic states", approved: true }],
    },
    approval: current.approval,
    execution: current.execution,
  };
  const result = migrateLegacyPlan(dir, legacy);
  assert.equal(result.plan.version, 8);
  assert.equal(result.plan.approval.status, "pending");
  assert.ok(result.diagnostics.some((item) => item.includes("capability preflight")));
  assert.equal(result.plan.contract.mechanismFallbacks[0].userReapprovalRequired, true);
});

test("validation rejects unresolved target and material intake", () => {
  const dir = root();
  const plan = createPlan(dir, { workflow: { ambition: "standard", execution: "lean", prototype: "auto", purpose: "project-delivery" } });
  plan.contract.target.previewUrl = null;
  plan.contract.target.previewCommand = null;
  const errors = validateCanonicalPlan(plan);
  assert.ok(errors.some((item) => item.includes("previewUrl or previewCommand")));
  assert.ok(errors.some((item) => item.includes("routeScope.routes")));
});
