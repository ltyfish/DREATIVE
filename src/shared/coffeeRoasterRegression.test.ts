import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, type CanonicalPlan } from "./planGovernance.js";
import { validateExperienceDelivery } from "./experienceGates.js";

const peaks = [
  { id: "hero-fragments", chapter: "hero", mechanismFamily: "media-fragmentation-reconstruction", plannedBehaviour: "Beans fragment and reconstruct into the route trace.", startState: "Whole image", activeState: "Depth fragments", resolution: "Rebuilt trace", inputRelationship: "Scroll progress", mobileStrategy: "Reduced fragment grid", reducedMotionStrategy: "Three semantic still states", fallbackState: "Masked slices", prototypeRiskFamily: "webgl-shader", acceptance: ["Distinct start, midpoint and reconstruction"] },
  { id: "roast-sequence", chapter: "roast", mechanismFamily: "scroll-controlled-sequence", plannedBehaviour: "A frame sequence scrubs through roast transformation.", startState: "Green coffee", activeState: "Heat transformation", resolution: "Dark roast", inputRelationship: "Scroll progress", mobileStrategy: "Reduced mobile frame set", reducedMotionStrategy: "Green and roast stills", fallbackState: "Three governed semantic states", prototypeRiskFamily: "frame-sequence", acceptance: ["More than three coherent controlled states"] },
  { id: "product-constellation", chapter: "products", mechanismFamily: "spatial-product-exploration", plannedBehaviour: "Products orbit and the active bag enters a dossier.", startState: "Constellation", activeState: "Dragged orbit", resolution: "Selected dossier", inputRelationship: "Drag, swipe and keyboard", mobileStrategy: "Bounded swipe constellation", reducedMotionStrategy: "Discrete spatial positions", fallbackState: "Depth-based accessible list", prototypeRiskFamily: "spatial-selector", acceptance: ["Input changes viewpoint and active product position"] },
];

function runtimeObservation(id: string, sectionId: string, family: "particle-reconstruction" | "frame-sequence" | "spatial-field", postHero: boolean, target: string) {
  return {
    id, sectionId, continuityOwner: "RoastContinuitySystem", implementationFile: `src/experience/${id}.tsx`, componentOrSelector: `[data-mechanism=${id}]`,
    mechanismFamily: family, spatialClassification: family === "spatial-field" ? "model" as const : family === "frame-sequence" ? "frame-sequence" as const : "layered-billboard" as const,
    sourceAssets: [`assets/${id}.webp`], inputDrivers: family === "spatial-field" ? ["drag" as const, "keyboard" as const] : ["scroll-progress" as const, "velocity" as const],
    samples: ([0, 25, 50, 75, 100] as const).map((progress, index) => ({
      progress, captureId: `${id}-${progress}`, artifactHash: `${id}-artifact-${progress}`, compositionStateHash: `${id}-composition-${progress}`,
      observedProperties: [{ property: "progress", value: progress }, { property: "depth", value: index * 0.6 }],
      channels: ["media" as const, "depth" as const, "type" as const, "light" as const],
      pixelDifferenceFromPrevious: index ? 0.18 : undefined, structuralDifferenceFromPrevious: index ? 0.09 : undefined,
      frameIndex: family === "frame-sequence" ? index * 18 : undefined,
      camera: family === "spatial-field" ? { position: [index * 0.35, index * 0.1, 5 - index * 0.3] as [number, number, number], rotation: [0, index * 0.18, 0] as [number, number, number], fov: 45 + index } : undefined,
      particleState: family === "particle-reconstruction" ? { activeCount: 1200, spread: index <= 2 ? index * 0.5 : (4 - index) * 0.5, reassembly: index / 4 } : undefined,
    })),
    postHero, assetTransformsInternally: family !== "spatial-field" || true, pinnedOrControlledComposition: true,
    nonObviousBehavior: true, neutralStylingStillSpecial: true,
    handoff: { targetMechanismId: target, persistedObjectOrState: "shared roast subject and normalized chapter progress", ownerImplementation: "src/experience/RoastContinuitySystem.tsx" },
    mobile: { authored: true, mechanismFamily: family, captureIds: [`${id}-mobile-start`, `${id}-mobile-active`, `${id}-mobile-resolved`], disabled: false },
    reducedMotion: { authoredComposition: true, captureIds: [`${id}-reduced`] },
    reverse: { relevant: family !== "spatial-field", tested: true, result: "pass" as const, evidenceIds: [`${id}-reverse`] },
    performance: { averageFps: 55, worstFrameTimeMs: 28, longTasks: 1, transferredBytes: 420000, heavyChunkBytes: family === "spatial-field" ? 780000 : 180000 },
    recordingIds: [`${id}-recording`],
  };
}

function fixture(corrected: boolean): CanonicalPlan {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-coffee-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const plan = createPlan(root, {
    workflow: { ambition: "experimental", execution: "full-audit", prototype: "auto", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"],
    treatmentDecisionExplicit: true,
  });
  plan.contract.experimentalPeaks = peaks;
  plan.contract.experienceArc = { openingState: "Beans reconstruct in depth.", firstTransformation: "Fragments hand into roast states.", sectionProgression: "A roast trace travels through sourcing, selector and dispatch.", peaksAndRests: "Three peaks alternate with editorial rests.", persistentSystem: "The roast trace owns continuity.", userControlledMoment: "Scroll and drag alter media and viewpoint.", mobileTranslation: "Reduced frames and swipe preserve chapter roles.", finalResolution: "The trace closes around dispatch." };
  plan.contract.experienceDistribution = corrected ? [
    { pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "Fragment reconstruction establishes the roast trace.", peakId: "hero-fragments" },
    { pageId: "home", sectionId: "sourcing", order: 1, role: "rest", continuityContribution: "Lighting and residue carry into the sourcing rest." },
    { pageId: "home", sectionId: "roast", order: 2, role: "peak", continuityContribution: "A scrubbed sequence transforms green coffee.", peakId: "roast-sequence" },
    { pageId: "home", sectionId: "products", order: 3, role: "peak", continuityContribution: "A spatial constellation opens a product dossier.", peakId: "product-constellation" },
    { pageId: "home", sectionId: "dispatch", order: 4, role: "resolution", continuityContribution: "The trace resolves around checkout." },
  ] : [{ pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "One strong WebGL hero.", peakId: "hero-fragments" }];
  plan.contract.mechanismFallbacks = peaks.map((peak) => ({
    id: peak.id, location: peak.chapter, primaryImplementation: peak.plannedBehaviour, primaryAcceptance: peak.acceptance,
    fallbackImplementation: peak.fallbackState, fallbackTrigger: "Measured runtime, decode or accessibility failure",
    triggerEvidenceRequired: ["failure trace"], userReapprovalRequired: true,
    allowedSubstitutions: [], riskFamily: peak.prototypeRiskFamily, prototypePolicy: "auto",
  }));
  plan.execution.mechanisms = peaks.map((peak) => ({
    id: peak.id, status: corrected ? "primary-delivered" : peak.id === "hero-fragments" ? "primary-delivered" : "fallback-triggered",
    finalReason: corrected ? "Primary acceptance conditions observed." : "Reduced to ordinary controls for convenience.",
    triggerObserved: false, triggerEvidenceIds: [], observedImplementation: corrected ? peak.plannedBehaviour : "ordinary controls",
    observedEvidenceIds: corrected ? [`${peak.id}-start`, `${peak.id}-active`, `${peak.id}-resolved`] : [],
    substitutionUsed: corrected ? null : "ordinary controls", approvalReference: null, criticVerdict: corrected ? "pass" : "fail",
  }));
  plan.execution.evidence = {
    transformations: corrected ? ["fragment reconstruction", "roast sequence"] : ["hero reconstruction"],
    sceneHandoffs: corrected ? ["hero to sourcing", "roast to products"] : [],
    meaningfulInteractions: corrected ? ["drag changes product viewpoint"] : ["ordinary tab"],
    persistentSystemSections: corrected ? ["hero", "sourcing", "roast", "products", "dispatch"] : ["hero"],
    pacing: corrected ? ["peak", "rest", "peak", "peak", "resolution"] : ["peak"],
    mobileNative: corrected ? ["swipe constellation", "reduced frames"] : [],
    reducedMotion: corrected ? ["semantic states for all peaks"] : [],
    treatmentEvidence: corrected ? { ux: ["functional"], mobile: ["mobile"], motion: ["motion"], interaction: ["interaction"], media: ["media"], "3d": ["cutout"], immersive: ["trace"], cinematic: ["handoff"], experimental: ["hero", "roast", "products"] } : { ux: ["functional"], mobile: ["stack"], motion: ["hero"], interaction: ["tabs"], media: ["same-image"], "3d": ["hero"], immersive: ["hero"], cinematic: ["dark"], experimental: ["hero"] },
    motionVocabulary: corrected ? ["fragment-reconstruction", "frame-sequence", "scene-handoff"] : ["fade", "scale", "tab-switch"],
    postFirstViewportEvents: corrected ? ["roast sequence", "product constellation"] : [],
    treatmentObservations: corrected ? {
      motion: { start: ["intact"], active: ["fragmented"], resolved: ["trace"], inputEffect: ["scroll"], mobile: ["reduced"], fallback: [] },
      interaction: { start: ["constellation"], active: ["drag"], resolved: ["dossier"], inputEffect: ["drag changes viewpoint"], mobile: ["swipe"], fallback: [] },
      media: { start: ["green"], active: ["roasting"], resolved: ["dark"], inputEffect: ["scroll"], mobile: ["reduced frames"], fallback: [] },
      "3d": { start: ["near"], active: ["travelling"], resolved: ["integrated"], inputEffect: ["scroll"], mobile: ["capped DPR"], fallback: [], assetClassifications: ["spatial-cutout"] },
    } : {
      interaction: { start: ["tabs"], active: ["button"], resolved: ["tab"], inputEffect: ["ordinary tab"], mobile: ["buttons"], fallback: [] },
      media: { start: ["same image"], active: ["scaled image"], resolved: ["same image"], inputEffect: [], mobile: [], fallback: [] },
      "3d": { start: ["hero"], active: ["hero"], resolved: ["hero"], inputEffect: [], mobile: [], fallback: [], assetClassifications: ["webgl-media-plane"] },
    },
  };
  plan.execution.browserValidation = { checkedAt: new Date().toISOString(), visibleImages: [], failedRequests: [], unexpectedHttpErrors: [], emptyCanvases: [], webglDraws: [{ selector: "canvas", drawCount: 10 }], consoleErrors: [], runtimeErrors: [], productionMediaMissing: corrected ? [] : ["planned-video.mp4"] };
  plan.execution.assetObservation = corrected
    ? { manifestEntries: ["roast.webp", "bag.webp"], filesOnDisk: ["roast.webp", "bag.webp"], applicationReferences: ["roast.webp", "bag.webp"], weights: { "roast.webp": 200000, "bag.webp": 120000 } }
    : { manifestEntries: ["stale-stock.jpg", "hero.png"], filesOnDisk: ["hero.png"], applicationReferences: ["hero.png", "missing-generated.png"], weights: { "hero.png": 5000000 } };
  plan.execution.checkpoints.mechanismPrototype = { status: "passed", scope: "Hero WebGL only", evidenceIds: ["hero-prototype"] };
  plan.execution.checkpoints.conceptCheckpoint = { status: "passed", actualHero: true, downstreamSection: true, realVisualSystem: true, mainTemporalOrMediaIdea: true, mobile390: true, reducedMotion: true, realApplication: true, reviewer: "independent-critic", evidenceIds: ["slice"] };
  plan.execution.checkpoints.ambitionPrototype = corrected ? { status: "passed", representativeFinalQualityMedia: true, completePostHeroPeak: true, trueAssetTransformation: true, recordingDurationSeconds: 16, desktopAuthored: true, mobileAuthored: true, independentCritic: true, provisionalLimitations: ["Audio remains optional and is not required for acceptance."], requiredRevisions: [], evidenceIds: ["ambition-desktop-recording", "ambition-mobile-recording"] } : { status: "passed", representativeFinalQualityMedia: false, completePostHeroPeak: false, trueAssetTransformation: false, recordingDurationSeconds: 6, desktopAuthored: true, mobileAuthored: false, independentCritic: false, provisionalLimitations: [], requiredRevisions: [], evidenceIds: ["hero-only-proof"] };
  plan.execution.checkpoints.adaptiveSpread = { status: corrected ? "passed" : "failed", approval: "explicit", desktopEvidenceIds: ["desktop"], mobileEvidenceIds: ["mobile"], peakEvidence: corrected ? peaks.map((peak) => ({ peakId: peak.id, start: [`${peak.id}-start`], active: [`${peak.id}-active`], resolved: [`${peak.id}-resolved`] })) : [{ peakId: "hero-fragments", start: ["hero-start"], active: ["hero-active"], resolved: ["hero-end"] }], mechanismTableComplete: corrected, fallbackDisclosureComplete: corrected, sectionRoleCoverageComplete: corrected, continuousRecordingRequired: true, continuousRecordingEvidenceIds: corrected ? ["route-recording"] : [], mobileRecordingRequired: false, mobileRecordingEvidenceIds: [], reverseScrollRequired: false, reverseScrollEvidenceIds: [], montageRequired: false, montageEvidenceIds: [] };
  plan.approval.contractHash = "contract";
  plan.execution.runtimeObservations = corrected ? [
    runtimeObservation("hero-fragments", "hero", "particle-reconstruction", false, "roast-sequence"),
    runtimeObservation("roast-sequence", "roast", "frame-sequence", true, "product-constellation"),
    runtimeObservation("product-constellation", "products", "spatial-field", true, "hero-fragments"),
  ] : [{
    id: "hero-fragments", sectionId: "hero", continuityOwner: "HeroCanvas", implementationFile: "src/Hero.tsx", componentOrSelector: "canvas",
    mechanismFamily: "rigid-media-plane", spatialClassification: "webgl-media-plane", sourceAssets: ["bag.webp"], inputDrivers: ["pointer", "time"],
    samples: ([0, 25, 50, 75, 100] as const).map((progress, index) => ({
      progress, captureId: `hero-${progress}`, artifactHash: `hero-${progress}`, compositionStateHash: index < 3 ? "same-plane-a" : "same-plane-b",
      observedProperties: [{ property: "rotationY", value: index * 0.05 }, { property: "positionY", value: index % 2 ? 0.03 : 0 }],
      channels: ["media"], pixelDifferenceFromPrevious: index ? 0.012 : undefined, structuralDifferenceFromPrevious: index ? 0.002 : undefined,
      camera: { position: [0, 0, 5], rotation: [0, 0, 0], fov: 45 },
    })),
    postHero: false, assetTransformsInternally: false, pinnedOrControlledComposition: false, nonObviousBehavior: false, neutralStylingStillSpecial: false,
    mobile: { authored: false, mechanismFamily: "decorative-motion", captureIds: [], disabled: true },
    reducedMotion: { authoredComposition: true, captureIds: ["hero-still"] }, reverse: { relevant: false, tested: false, result: "not-applicable", evidenceIds: [] },
    performance: { averageFps: 58, worstFrameTimeMs: 24, longTasks: 0, transferredBytes: 900000, heavyChunkBytes: 980000 }, recordingIds: ["hero-recording"],
  }];
  plan.execution.signatureMediaPackages = corrected ? [{
    id: "roast-signature-media", sourceAssets: ["roaster-source.webp", "bag-source.webp"],
    derivatives: [{ path: "roast-frames.avif", role: "bounded frame sequence atlas", bytes: 320000 }, { path: "bean-particles.webp", role: "fragment source", bytes: 100000 }],
    implementationConsumers: ["src/experience/RoastSequence.tsx", "src/experience/HeroFragments.tsx"],
    optimization: ["AVIF atlas", "mobile half-resolution sequence", "chapter-approach preload"],
    temporalEvidenceIds: ["hero-fragments-recording", "roast-sequence-recording"], mobileVariant: "roast-frames-mobile.avif", reducedMotionAsset: "roast-resolved.webp",
  }] : [];
  plan.execution.run = { runId: "coffee-run", contractHash: "contract", sourceHash: "source", gitIdentity: null, createdAt: new Date().toISOString(), workflow: plan.contract.workflow, planVersion: 9, capabilityPreflightIdentity: "preflight", contractTitle: plan.contract.selectedConcept, evidenceFiles: [".dreative/runs/coffee-run/verify.json"], assetManifest: plan.execution.assetObservation.manifestEntries, approvedChangeRequests: [], finalizationStatus: corrected ? "passed" : "failed" };
  return plan;
}

test("coffee-roaster regression rejects hero-only static lower route and silent fallbacks", () => {
  const checks = validateExperienceDelivery(fixture(false)).map((item) => item.check);
  for (const required of ["static-feeling", "insufficient-media-transformation", "insufficient-cinematic-development", "insufficient-experimental-peaks", "insufficient-3d-spatial-value", "mobile-motion-downgrade", "experience-distribution", "hero-only", "fallback-governance", "asset-integrity", "adaptive-spread", "ambition-prototype"]) assert.ok(checks.includes(required), `missing ${required}`);
});

test("corrected coffee-roaster fixture proves multiple non-hero peaks and passes", () => {
  assert.deepEqual(validateExperienceDelivery(fixture(true)), []);
});
