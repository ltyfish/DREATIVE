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

test("focused simulated workflow covers intake, edit, approval, drift, broken media and rejects manual finalization evidence", () => {
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
  plan.contract.projectDefinition = {
    purpose: "Present a living gallery journey.", targetAudience: "Visitors exploring the featured work.",
    primaryUserJourney: "Open the gallery, explore the rail through each chapter, and reach the final action.", routes: ["/"],
    requiredFunctionality: ["The primary route and controls remain operational."],
    extractedRequirements: ["The experience develops beyond the hero and primary media loads."], nonGoals: ["No account system."],
    preservedContentOrFunctionality: ["Existing route and controls."],
  };
  plan.contract.creativeDirection = {
    selectedConcept: plan.contract.selectedConcept, fitRationale: "A persistent gallery rail makes the portfolio journey coherent.",
    nonGenericQualities: "The same rail transforms media across multiple chapters.", visualLanguage: "Layered gallery frames and spatial media.",
    compositionStrategy: "Peaks alternate with quiet reading frames.", typographyStrategy: "Editorial display type resolves into utility labels.",
    mediaStrategy: "Layered images transform inside the persistent rail.", motionInteractionPhilosophy: "Scroll and drag cause structural media changes.",
    experienceProgression: "Open, transform, rest and resolve the gallery rail.",
  };
  plan.contract.sectionContracts = ["hero", "work", "finale"].map((id) => ({
    id, route: "/", narrativePurpose: `${id} advances the gallery journey.`, mainUserAction: "Explore the current gallery state.",
    visualRole: "Frame the persistent gallery rail.", mediaRole: "Present layered gallery media.", interactionRole: "Scroll and drag alter the rail.",
    entryState: "The previous rail state enters the chapter.", activeState: "Media and typography transform together.",
    resolvedState: "The rail settles into the next handoff.", handoff: "The same mounted rail persists onward.",
    mobileBehavior: "Swipe and vertical progress retain the gallery rail.", reducedMotionBehavior: "Authored still frames retain the sequence.",
    fallbackBehavior: "Semantic gallery states preserve content and actions.", verificationRequirement: `Capture ${id} start, active and resolved states.`,
  }));
  plan.contract.continuityContract = { owner: "GalleryRail", medium: "DOM", sourceOwner: "GalleryRail", sectionChanges: "One rail changes media and composition.", persistenceVerification: "Continuous trace proves one mounted owner.", breakConditions: "Duplicated independent images break continuity." };
  plan.contract.mechanismContracts = [{
    id: "gallery-rail", catalogueSourceOrCustomRationale: "Custom gallery rail based on shared-element handoff.", routeOrSection: "/ hero through finale",
    inputDriver: "scroll-progress", startState: "Rail opens beside the title.", activeState: "Rail media fragments and changes layout.",
    endState: "Rail resolves beside the final action.", reverseBehavior: "Reverse progress restores prior states.",
    rapidInputBehavior: "Progress clamps during rapid scroll.", refreshAtProgressBehavior: "Refresh restores the matching state.",
    mobileBehavior: "Vertical progress and swipe preserve the rail.", reducedMotionBehavior: "Authored still frames replace interpolation.",
    dependency: "Native browser scroll timeline.", performanceExpectation: "No blocking long tasks during progress.",
    approvedFallback: "Intersection-controlled semantic rail states.", fallbackTrigger: "Trusted prototype shows scroll timeline failure.",
    requiredCaptureStates: ["start", "active", "resolved", "reverse", "mobile", "reduced-motion"],
    successCriteria: ["One rail transforms across chapters."], failureCriteria: ["Buttons or duplicated images replace the rail."],
  }];
  plan.contract.requirementTraceability = [{ id: "REQ-1", source: "user prompt", wording: "The experience develops beyond the hero and primary media loads.", plannedImplementation: "GalleryRail transforms across work and finale.", routeOrComponent: "home/GalleryRail", browserTest: "Scroll and reverse through the complete route.", evidenceId: "gallery-runtime", status: "planned" }];
  plan.contract.packagePlan = { assets: ["Layered gallery images"], rightsAndSources: ["Commercial rights required"], placeholderRestrictions: ["No placeholder media"], derivatives: ["Mobile and desktop layers"], mobileAssetStrategy: "Compact mobile derivatives", mechanismPackages: ["native browser APIs"], installPermission: true, preflightResults: ["Dreative browser runner required"], prototypeProof: ["Prove scroll lifecycle"] };
  plan.contract.verificationPlan = { viewports: [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }], interactions: [{ id: "scroll", route: "/", action: "scroll", mechanismId: "gallery-rail" }], mechanismStates: ["start", "active", "resolved", "reverse"], mobileTests: ["Rail remains"], reducedMotionTests: ["Still states"], accessibilityChecks: ["Keyboard and focus"], performanceChecks: ["Long tasks"], mediaNetworkChecks: ["Images and requests"], criticInputs: ["Desktop, mobile, trace"], finalizationBlockers: ["Missing functionality or rail states"] };
  plan.contract.videoDeliveryDecision = {
    decision: "frame-sequence-or-prerendered-motion",
    reason: "A bounded image sequence supplies deterministic chapter timing without depending on original video generation.",
    processingRoute: "Install and verify ffmpeg-static or use a confirmed frame extraction provider.",
    mobileStrategy: "Ship a reduced-resolution bounded frame set with chapter-approach preloading.",
    reducedMotionStrategy: "Use authored opening, transformation and resolved still compositions.",
  };
  for (const allocation of plan.contract.treatmentAllocation) {
    allocation.locations = ["home/hero", "home/work"];
    allocation.contribution = `${allocation.treatment} materially supports the gallery rail.`;
    allocation.acceptance = [`${allocation.treatment} is perceptible in captured evidence.`];
    allocation.mechanismIds = ["gallery-rail"];
    allocation.mobileObligation = `${allocation.treatment} remains substantive in the mobile rail.`;
    allocation.reducedMotionObligation = `${allocation.treatment} remains substantive in authored still frames.`;
    allocation.failureCriteria = [`${allocation.treatment} fails when the rail contribution is absent.`];
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
  assert.equal(runPlanCommand(validRoot, ["init", "--tiny", "--ambition", "standard", "--execution", "fast", "--prototype", "skip", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "ux", ...resolvedCreativeArgs]), 0);
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
  assert.equal(runFinalize(validRoot, { target: "claude", sourceDir, packageVersion }).ok, false);
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
