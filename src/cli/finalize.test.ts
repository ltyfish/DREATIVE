import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { installSkill } from "./installSkill.js";
import { runFinalize } from "./finalize.js";
import { approvePlan, createPlan, writePlan } from "../shared/planGovernance.js";
import { detectProjectPreflight } from "../shared/preflight.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;

function validLegacyFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-finalize-"));
  fs.mkdirSync(path.join(root, ".dreative")); fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0" }));
  fs.writeFileSync(path.join(root, "src", "App.tsx"), `export const App=()=> <main><section id="hero">Ready</section></main>`);
  fs.writeFileSync(path.join(root, ".dreative", "plan.json"), JSON.stringify({
    version: 2, request: "Build a standard fixture", createdAt: new Date().toISOString(), tier: "solid", depth: "restyle", skills: ["ux", "mobile"],
    skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] }, designRead: { register: "product", concept: "clear utility", signature: "task rail" },
    pages: [{ id: "home", name: "Home", skills: ["ux", "mobile"], sections: [{ id: "hero", name: "Hero", layoutFamily: "task lead", skills: ["ux", "mobile"], interactions: [], mobile: "task first", fallback: "semantic content", verification: ["Ready visible"], assets: [], status: "shipped" }] }],
  }));
  fs.writeFileSync(path.join(root, ".dreative", "verify.json"), JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), evidence: [{ id: "ready", criterion: "Ready visible", status: "pass", evidence: "runtime URL", proof: { timestamp: new Date().toISOString(), testedUrl: "http://localhost:4173" } }] }));
  installSkill({ sourceDir, projectDir: root, packageVersion, target: "claude", selected: ["ux", "mobile"], explicitAll: false });
  return root;
}

test("finalize prints an eligible success result only when installation and audit pass", () => {
  const result = runFinalize(validLegacyFixture(), { target: "claude", sourceDir, packageVersion });
  assert.equal(result.ok, true);
  assert.deepEqual(result.blockers, []);
});

test("finalize fails closed after source/plan completion evidence is removed", () => {
  const root = validLegacyFixture(); fs.rmSync(path.join(root, ".dreative", "verify.json"));
  const result = runFinalize(root, { target: "claude", sourceDir, packageVersion });
  assert.equal(result.ok, false);
  assert.ok(result.blockers.some((item) => item.includes("verification")));
});

function validV9Fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-finalize-v7-"));
  fs.mkdirSync(path.join(root, ".dreative")); fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0" }));
  fs.writeFileSync(path.join(root, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(root, "src", "App.tsx"), `export const App=()=> <main><section id="hero">Ready</section></main>`);
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    projectKind: "from-scratch", transformationDepth: "restyle", treatments: ["ux", "mobile"],
    treatmentDecisionExplicit: true,
  });
  plan.contract.scope.requiredFunctionality = ["The page renders its primary content."];
  plan.contract.scope.dependencyInstallationAllowed = true;
  plan.contract.creativeSources = {
    references: { preference: "none", urls: [], notes: [], antiReferences: [] },
    generatedImages: "not-allowed", sourcedImages: "not-allowed", generatedVideo: "not-allowed", sourcedVideo: "not-allowed",
    threeDAssets: "not-allowed", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
  };
  plan.contract.scope.successCriteria = ["The user can read the ready state at desktop and mobile widths."];
  plan.contract.capabilityPreflight = detectProjectPreflight(root);
  plan.contract.selectedConcept = "A direct utility page makes the ready state immediately legible.";
  plan.contract.blueprint = [{ pageId: "home", sectionId: "hero", intent: "Present the ready state." }];
  plan.contract.motionAndMediaStrategy = "No motion or primary media is required.";
  plan.contract.mobileTranslation = "The same direct hierarchy fits 390px without horizontal overflow.";
  for (const item of plan.contract.treatmentAllocation) {
    item.locations = ["home/hero"];
    item.contribution = `${item.treatment} keeps the ready state usable and legible.`;
    item.acceptance = [`${item.treatment} evidence passes.`];
  }
  plan.execution.evidence.treatmentEvidence = { ux: ["ready-runtime"], mobile: ["ready-mobile"] };
  writePlan(root, plan);
  approvePlan(root);
  fs.writeFileSync(path.join(root, ".dreative", "verify.json"), JSON.stringify({
    version: 1, generatedAt: new Date().toISOString(),
    evidence: [{ id: "ready-runtime", criterion: "Ready state renders", status: "pass", evidence: "tested URL", proof: { timestamp: new Date().toISOString(), testedUrl: "http://localhost:4173" } }],
  }));
  installSkill({ sourceDir, projectDir: root, packageVersion, target: "claude", selected: ["ux", "mobile"], explicitAll: false });
  return root;
}

test("a valid v9 fixture can finalize successfully", () => {
  const result = runFinalize(validV9Fixture(), { target: "claude", sourceDir, packageVersion });
  assert.equal(result.ok, true, result.blockers.join("\n"));
});
