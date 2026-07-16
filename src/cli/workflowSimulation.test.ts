import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runPlanCommand } from "./plan.js";
import { approvePlan, readPlan, writePlan } from "../shared/planGovernance.js";
import { validateExperienceDelivery } from "../shared/experienceGates.js";
import { installSkill } from "./installSkill.js";
import { runFinalize } from "./finalize.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;
const resolvedCreativeArgs = [
  "--no-references",
  "--generated-images", "deny",
  "--sourced-images", "deny",
  "--generated-video", "deny",
  "--sourced-video", "deny",
  "--3d-assets", "not-allowed",
  "--package-install", "allow",
];

test("focused simulated workflow covers intake, edit, approval, drift, broken media and valid finalization", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-simulation-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "simulation", version: "1.0.0", scripts: { dev: "vite" }, dependencies: { vite: "^5" } }));
  fs.writeFileSync(path.join(root, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(root, "src", "App.tsx"), `export const App=()=> <main><img src="/hero.jpg" alt="Hero"/></main>`);
  assert.equal(runPlanCommand(root, ["init", "--ambition", "award", "--execution", "full-audit", "--prototype", "required", "--purpose", "dreative-dogfood", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "all", "--confirm-all", ...resolvedCreativeArgs]), 0);

  const plan = readPlan(root);
  plan.contract.scope.requiredFunctionality = ["The primary route and controls remain operational."];
  plan.contract.scope.dependencyInstallationAllowed = true;
  plan.contract.creativeSources = {
    references: { preference: "open-to-suggestions", urls: [], notes: [], antiReferences: [] },
    generatedImages: "allowed", sourcedImages: "allowed", generatedVideo: "ask-per-asset", sourcedVideo: "ask-per-asset",
    threeDAssets: "generation-and-sourcing-allowed", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
  };
  plan.contract.scope.successCriteria = ["The experience visibly develops beyond the hero and all primary media loads."];
  plan.contract.continuityOwner = "immersive";
  plan.contract.selectedConcept = "A living gallery rail transforms media and carries state through every chapter.";
  plan.contract.blueprint = [{ pageId: "home", sectionId: "hero", intent: "Open the gallery rail." }, { pageId: "home", sectionId: "work", intent: "Transform the rail downstream." }];
  plan.contract.experienceDistribution = [
    { pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "The gallery rail establishes the opening state." },
    { pageId: "home", sectionId: "work", order: 1, role: "transformation", continuityContribution: "The gallery rail transforms after the first viewport." },
    { pageId: "home", sectionId: "finale", order: 2, role: "peak", continuityContribution: "The gallery rail resolves as a second peak." },
  ];
  plan.contract.experienceArc = { openingState: "Quiet rail", firstTransformation: "Hero media fragments into the rail", sectionProgression: "Rail develops through three sections", peaksAndRests: "Transformations alternate with calm reading", persistentSystem: "Gallery rail persists", userControlledMoment: "Drag changes media state", mobileTranslation: "Swipe changes compact rail", finalResolution: "Rail resolves into final action" };
  plan.contract.motionAndMediaStrategy = "Mask and spatial states hand off between chapters.";
  plan.contract.mobileTranslation = "Swipe and tap replace pointer drag at 390px.";
  for (const allocation of plan.contract.treatmentAllocation) {
    allocation.locations = ["home/hero", "home/work"];
    allocation.contribution = `${allocation.treatment} materially supports the gallery rail.`;
    allocation.acceptance = [`${allocation.treatment} is perceptible in captured evidence.`];
  }
  writePlan(root, plan);
  assert.equal(runPlanCommand(root, ["validate"]), 0);
  approvePlan(root);

  const drift = readPlan(root);
  drift.contract.selectedConcept = "A changed concept that has not been approved.";
  writePlan(root, drift);
  assert.equal(runPlanCommand(root, ["diff"]), 1);

  const broken = readPlan(root);
  broken.execution.browserValidation = { checkedAt: new Date().toISOString(), visibleImages: [{ selector: "img", complete: true, naturalWidth: 0, primary: true }], failedRequests: [], unexpectedHttpErrors: [], emptyCanvases: [], webglDraws: [], consoleErrors: [], runtimeErrors: [], productionMediaMissing: [] };
  assert.ok(validateExperienceDelivery(broken).some((item) => item.check === "broken-media"));

  const validRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-simulation-valid-"));
  fs.mkdirSync(path.join(validRoot, "src")); fs.mkdirSync(path.join(validRoot, ".dreative"));
  fs.writeFileSync(path.join(validRoot, "package.json"), JSON.stringify({ name: "valid", version: "1.0.0" }));
  fs.writeFileSync(path.join(validRoot, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(validRoot, "src", "App.tsx"), `export const App=()=> <main>Ready</main>`);
  assert.equal(runPlanCommand(validRoot, ["init", "--ambition", "standard", "--execution", "fast", "--prototype", "skip", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "ux", ...resolvedCreativeArgs]), 0);
  const valid = readPlan(validRoot);
  valid.contract.scope.requiredFunctionality = ["Render the ready state."];
  valid.contract.scope.dependencyInstallationAllowed = false;
  valid.contract.creativeSources = {
    references: { preference: "none", urls: [], notes: [], antiReferences: [] },
    generatedImages: "not-allowed", sourcedImages: "not-allowed", generatedVideo: "not-allowed", sourcedVideo: "not-allowed",
    threeDAssets: "not-allowed", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
  };
  valid.contract.scope.successCriteria = ["Ready is visible at desktop and mobile sizes."];
  valid.contract.selectedConcept = "A direct ready state uses a clear, responsive hierarchy.";
  valid.contract.blueprint = [{ pageId: "home", sectionId: "hero", intent: "Show Ready." }];
  valid.contract.motionAndMediaStrategy = "No motion or primary media is required.";
  valid.contract.mobileTranslation = "The hierarchy remains direct at 390px.";
  for (const allocation of valid.contract.treatmentAllocation) {
    allocation.locations = ["home/hero"]; allocation.contribution = `${allocation.treatment} keeps Ready usable.`; allocation.acceptance = [`${allocation.treatment} passes.`];
  }
  valid.execution.evidence.treatmentEvidence = { ux: ["ready"], mobile: ["mobile"] };
  writePlan(validRoot, valid); approvePlan(validRoot);
  fs.writeFileSync(path.join(validRoot, ".dreative", "verify.json"), JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), evidence: [{ id: "ready", criterion: "Ready visible", status: "pass", evidence: "tested URL", proof: { timestamp: new Date().toISOString(), testedUrl: "http://localhost:4173" } }] }));
  installSkill({ sourceDir, projectDir: validRoot, packageVersion, target: "claude", selected: ["ux", "mobile"], explicitAll: false });
  assert.equal(runFinalize(validRoot, { target: "claude", sourceDir, packageVersion }).ok, true);
});

test("Experimental Dogfood intake discloses all ten and records truthful pending capability state", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-experimental-intake-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "experimental-intake", scripts: { dev: "vite" }, dependencies: { vite: "^5" } }));
  fs.writeFileSync(path.join(root, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(root, "capabilities.json"), JSON.stringify({ capabilities: [
    { id: "image-search", state: "available-through-confirmed-tool", provider: "rights-safe-image-search", verified: true },
    { id: "image-generation", state: "available-through-confirmed-tool", provider: "image-generation-tool", verified: true },
    { id: "video-generation", state: "unavailable", verified: true },
    { id: "3d-model-generation", state: "unavailable", verified: true },
  ] }));
  const args = ["init", "--ambition", "experimental", "--execution", "full-audit", "--prototype", "required", "--purpose", "dreative-dogfood",
    "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "all", "--confirm-all",
    "--suggest-references", "--generated-images", "allow", "--sourced-images", "allow", "--generated-video", "allow",
    "--sourced-video", "allow", "--3d-assets", "generation-and-sourcing-allowed", "--package-install", "allow",
    "--capabilities-file", "capabilities.json"];
  assert.equal(runPlanCommand(root, args), 0);
  const plan = readPlan(root);
  assert.equal(plan.version, 9);
  assert.equal(plan.contract.treatmentDecisions.length, 10);
  assert.equal(plan.contract.treatmentDecisions.every((item) => item.explicitlyDecided), true);
  assert.equal(plan.contract.selectedTreatments.length, 10);
  assert.deepEqual(plan.execution.mechanisms, []);
  const capabilities = new Map(plan.contract.capabilityPreflight?.creativeCapabilities.map((item) => [item.id, item]));
  assert.equal(capabilities.get("image-search")?.status, "available-through-confirmed-tool");
  assert.equal(capabilities.get("video-generation")?.status, "unavailable");
  assert.equal(capabilities.get("3d-model-generation")?.status, "unavailable");
  assert.equal(capabilities.get("webgl-runtime")?.status, "expected-browser-api-unverified");
});
