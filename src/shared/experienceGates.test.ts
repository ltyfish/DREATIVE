import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, type CanonicalPlan } from "./planGovernance.js";
import { validateExperienceDelivery } from "./experienceGates.js";
import { detectProjectPreflight } from "./preflight.js";

function observation(id: string, sectionId: string, postHero: boolean, target: string) {
  return {
    id, sectionId, continuityOwner: "JourneyClock", implementationFile: `src/${id}.tsx`, componentOrSelector: `[data-mechanism=${id}]`,
    mechanismFamily: "layout-transition" as const, spatialClassification: "static-image" as const, sourceAssets: [],
    inputDrivers: ["scroll-progress" as const],
    samples: ([0, 25, 50, 75, 100] as const).map((progress, index) => ({
      progress, captureId: `${id}-${progress}`, artifactHash: `${id}-artifact-${progress}`, compositionStateHash: `${id}-state-${Math.min(index, 3)}`,
      observedProperties: [{ property: "layoutProgress", value: progress }], channels: ["layout" as const, "type" as const, "light" as const],
      pixelDifferenceFromPrevious: index ? 0.12 : undefined, structuralDifferenceFromPrevious: index ? 0.06 : undefined,
    })),
    postHero, assetTransformsInternally: id !== "finale-resolution", pinnedOrControlledComposition: true,
    nonObviousBehavior: true, neutralStylingStillSpecial: true,
    handoff: { targetMechanismId: target, persistedObjectOrState: "journey rail progress", ownerImplementation: "src/JourneyClock.ts" },
    mobile: { authored: true, mechanismFamily: "layout-transition" as const, captureIds: [`${id}-mobile`], disabled: false },
    reducedMotion: { authoredComposition: true, captureIds: [`${id}-reduced`] },
    reverse: { relevant: true, tested: true, result: "pass" as const, evidenceIds: [`${id}-reverse`] },
    performance: { averageFps: 58, worstFrameTimeMs: 24, longTasks: 0, transferredBytes: 0, heavyChunkBytes: 0 },
    recordingIds: [`${id}-recording`],
  };
}

function plan(): CanonicalPlan {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-gates-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const value = createPlan(root, {
    workflow: { ambition: "award", execution: "full-audit", prototype: "required", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"],
    treatmentDecisionExplicit: true,
  });
  value.contract.experienceArc = { openingState: "Grounded opening", firstTransformation: "Media reconstructs", sectionProgression: "Three chapters develop", peaksAndRests: "Peaks alternate with rests", persistentSystem: "Rail persists across sections", userControlledMoment: "Drag changes viewpoint", mobileTranslation: "Swipe changes compact scene", finalResolution: "Scene resolves into action" };
  value.contract.experienceDistribution = [
    { pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "The rail establishes the first route state." },
    { pageId: "home", sectionId: "work", order: 1, role: "transformation", continuityContribution: "The rail becomes a product instrument." },
    { pageId: "home", sectionId: "finale", order: 2, role: "peak", continuityContribution: "The rail resolves as a second authored peak." },
  ];
  return value;
}

test("one rotating hero with static poster sections fails Award gates", () => {
  const value = plan();
  value.execution.evidence.motionVocabulary = ["rotate", "fade", "translate"];
  value.execution.evidence.meaningfulInteractions = ["hero drag"];
  const errors = validateExperienceDelivery(value).map((item) => item.message);
  assert.ok(errors.some((item) => item.includes("three sections")));
  assert.ok(errors.some((item) => item.includes("scene handoff")));
  assert.ok(errors.some((item) => item.includes("concept validation")));
});

test("selected 3D, Immersive, Cinematic and Media fail without perceptual runtime delivery", () => {
  const errors = validateExperienceDelivery(plan());
  assert.ok(errors.some((item) => item.check === "3d"));
  assert.ok(errors.some((item) => item.check === "immersive"));
  assert.ok(errors.some((item) => item.check === "cinematic"));
  assert.ok(errors.some((item) => item.check === "media"));
});

test("broken visible images block audit-quality delivery", () => {
  const value = plan();
  value.execution.browserValidation = {
    checkedAt: new Date().toISOString(),
    visibleImages: [{ selector: "#hero img", complete: true, naturalWidth: 0, primary: true, altFallbackVisible: true }],
    failedRequests: [], unexpectedHttpErrors: [], emptyCanvases: [], webglDraws: [{ selector: "canvas", drawCount: 2 }],
    consoleErrors: [], runtimeErrors: [], productionMediaMissing: [],
  };
  assert.ok(validateExperienceDelivery(value).some((item) => item.check === "broken-media"));
});

test("a real temporal Award fixture can satisfy the anti-static gates", () => {
  const value = plan();
  value.contract.selectedTreatments = ["ux", "mobile", "motion", "interaction"];
  value.execution.evidence = {
    transformations: ["hero media reconstructs into chapter rail"], sceneHandoffs: ["hero hands the rail into work"],
    meaningfulInteractions: ["drag changes viewpoint"], persistentSystemSections: ["hero", "work", "finale"],
    pacing: ["hero peak", "reading rest"], mobileNative: ["swipe instrument"], reducedMotion: ["three intentional static states"],
    treatmentEvidence: { ux: ["workflow"], mobile: ["390 capture"], motion: ["recording"], interaction: ["drag trace"] },
    motionVocabulary: ["mask-reconstruction", "scene-handoff"],
    postFirstViewportEvents: ["work section rail transformation"],
    treatmentObservations: { motion: { start: ["intact"], active: ["fragmented"], resolved: ["rail"], inputEffect: [], mobile: ["compact"], fallback: [] }, interaction: { start: ["rest"], active: ["drag"], resolved: ["selected"], inputEffect: ["drag changes viewpoint"], mobile: ["swipe"], fallback: [] } },
  };
  value.execution.checkpoints.mechanismPrototype = { status: "passed", scope: "drag feasibility only", evidenceIds: ["prototype"] };
  value.execution.checkpoints.conceptCheckpoint = { status: "passed", actualHero: true, downstreamSection: true, realVisualSystem: true, mainTemporalOrMediaIdea: true, mobile390: true, reducedMotion: true, realApplication: true, reviewer: "independent-critic", evidenceIds: ["slice"] };
  value.execution.checkpoints.ambitionPrototype = { status: "passed", representativeFinalQualityMedia: true, completePostHeroPeak: true, trueAssetTransformation: true, recordingDurationSeconds: 15, desktopAuthored: true, mobileAuthored: true, independentCritic: true, provisionalLimitations: [], requiredRevisions: [], evidenceIds: ["ambition-recording"] };
  value.execution.checkpoints.adaptiveSpread = { status: "passed", approval: "explicit", desktopEvidenceIds: ["desktop"], mobileEvidenceIds: ["mobile"], peakEvidence: [], mechanismTableComplete: true, fallbackDisclosureComplete: true, sectionRoleCoverageComplete: true, continuousRecordingRequired: false, continuousRecordingEvidenceIds: [], mobileRecordingRequired: false, mobileRecordingEvidenceIds: [], reverseScrollRequired: false, reverseScrollEvidenceIds: [], montageRequired: false, montageEvidenceIds: [] };
  value.execution.browserValidation = { checkedAt: new Date().toISOString(), visibleImages: [], failedRequests: [], unexpectedHttpErrors: [], emptyCanvases: [], webglDraws: [], consoleErrors: [], runtimeErrors: [], productionMediaMissing: [] };
  value.execution.assetObservation = { manifestEntries: [], filesOnDisk: [], applicationReferences: [], weights: {} };
  value.execution.runtimeObservations = [
    observation("hero-transform", "hero", false, "work-transform"),
    observation("work-transform", "work", true, "finale-resolution"),
    observation("finale-resolution", "finale", true, "hero-transform"),
  ];
  value.approval.contractHash = "";
  value.execution.run = { runId: "run-pass", contractHash: "", sourceHash: "source", gitIdentity: null, createdAt: new Date().toISOString(), workflow: value.contract.workflow, planVersion: 9, capabilityPreflightIdentity: "preflight", contractTitle: value.contract.selectedConcept, evidenceFiles: [".dreative/runs/run-pass/verify.json"], assetManifest: [], approvedChangeRequests: [], finalizationStatus: "passed" };
  assert.deepEqual(validateExperienceDelivery(value), []);
});

test("generic generated coffee media must attempt confirmed external sourcing", () => {
  const value = plan();
  const root = value.contract.target.repoRoot;
  value.contract.capabilityPreflight = detectProjectPreflight(root, {
    permissions: { externalImagesAllowed: true, generatedImagesAllowed: true },
    explicitCapabilities: [{ id: "image-search", state: "available-through-confirmed-tool", provider: "rights-safe-search", verified: true }],
  });
  value.contract.assetStrategy = [{
    id: "coffee-editorial", intendedRole: "Generic editorial coffee photograph", requiredSubjectAndComposition: "Roaster working beside a drum roaster.",
    priority: "generated", sourcingPolicy: "external-first", generationPolicy: "allowed-with-advantage", generationRationale: "",
    classification: "static-image", rightsRequirements: ["Commercial use"], expectedFormatsAndVariants: ["AVIF", "WebP mobile"],
    requiredLocations: ["home/story"], reusePolicy: "Single story section.", suitableExternalMediaCouldExist: true,
  }];
  value.execution.assets = [{ id: "coffee-editorial", sourcingAttempts: [], preSearchExemption: "", candidatesFound: [], selectedSource: null, generatedDetails: "Generated immediately.", actualFiles: ["coffee.webp"], actualSizes: {}, productionDerivatives: [], usageLocations: ["home/story"], browserObserved: true, survivedFinalImplementation: true, removedOrSubstituted: false, finalRightsRecord: "generated", shipping: true }];
  assert.ok(validateExperienceDelivery(value).some((item) => item.check === "external-first-sourcing"));
});

test("bespoke brand cutout generation-first exemption passes sourcing policy", () => {
  const value = plan();
  const root = value.contract.target.repoRoot;
  value.contract.capabilityPreflight = detectProjectPreflight(root, {
    permissions: { externalImagesAllowed: true, generatedImagesAllowed: true },
    explicitCapabilities: [{ id: "image-search", state: "available-through-confirmed-tool", provider: "rights-safe-search", verified: true }],
  });
  const rationale = "Exact brand-specific packaging requires a transparent cutout with controlled lighting and matching transformation states.";
  value.contract.assetStrategy = [{
    id: "brand-bag", intendedRole: "Persistent branded coffee bag prop", requiredSubjectAndComposition: "Exact package, transparent background and left-key lighting.",
    priority: "generated", sourcingPolicy: "generation-first-exemption", generationPolicy: "required-bespoke", generationRationale: rationale,
    classification: "spatial-cutout", rightsRequirements: ["Brand-owned design"], expectedFormatsAndVariants: ["WebP cutout", "mobile cutout"],
    requiredLocations: ["home/hero", "home/roast", "home/finale"], reusePolicy: "Persistent travelling prop owns narrative continuity.", suitableExternalMediaCouldExist: false,
  }];
  value.execution.assets = [{ id: "brand-bag", sourcingAttempts: [], preSearchExemption: rationale, candidatesFound: [], selectedSource: null, generatedDetails: "Generated exact package cutout.", actualFiles: ["bag.webp"], actualSizes: {}, productionDerivatives: [], usageLocations: ["home/hero", "home/roast", "home/finale"], browserObserved: true, survivedFinalImplementation: true, removedOrSubstituted: false, finalRightsRecord: "brand-owned", shipping: true }];
  assert.equal(validateExperienceDelivery(value).some((item) => item.check === "external-first-sourcing" || item.check === "asset-diversity"), false);
});
