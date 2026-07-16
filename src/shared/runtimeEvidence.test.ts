import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, type CanonicalPlan, type RuntimeMechanismObservation } from "./planGovernance.js";
import { assessStaticFeeling, validateAmbitiousRuntimeEvidence, validateRuntimeObservationGrounding } from "./runtimeEvidence.js";

function plan(): CanonicalPlan {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-runtime-evidence-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const value = createPlan(root, {
    workflow: { ambition: "experimental", execution: "full-audit", prototype: "required", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"],
    treatmentDecisionExplicit: true,
  });
  value.contract.experimentalPeaks = [
    { id: "fragment", chapter: "hero", mechanismFamily: "particle-reconstruction", plannedBehaviour: "Media fragments and reforms.", startState: "Whole image", activeState: "Fragments occupy depth", resolution: "Image reforms as a route object", inputRelationship: "Scroll velocity drives fragments", mobileStrategy: "Reduced fragment population", reducedMotionStrategy: "Three authored still states", fallbackState: "Sliced SVG reconstruction", prototypeRiskFamily: "particles", acceptance: ["Internal pixels and depth change"] },
    { id: "sequence", chapter: "story", mechanismFamily: "frame-sequence", plannedBehaviour: "Roast frames scrub through material change.", startState: "Green beans", activeState: "Roasting frames", resolution: "Dark roast", inputRelationship: "Scroll progress controls frame index", mobileStrategy: "Reduced bounded frame set", reducedMotionStrategy: "Opening and resolved stills", fallbackState: "Pre-rendered three-state dissolve", prototypeRiskFamily: "sequence", acceptance: ["Frame index and pixels progress"] },
    { id: "orbit", chapter: "products", mechanismFamily: "spatial-field", plannedBehaviour: "Products move through a shared camera field.", startState: "Wide field", activeState: "Dragged orbit", resolution: "Selected dossier", inputRelationship: "Drag changes camera and selection", mobileStrategy: "Swipe controls bounded orbit", reducedMotionStrategy: "Discrete viewpoints", fallbackState: "Pre-rendered angles", prototypeRiskFamily: "spatial", acceptance: ["Camera and occlusion visibly change"] },
  ];
  return value;
}

function observation(id: string, sectionId: string, family: RuntimeMechanismObservation["mechanismFamily"], postHero: boolean, target: string): RuntimeMechanismObservation {
  return {
    id, sectionId, continuityOwner: "SharedScene", implementationFile: `src/${id}.tsx`, componentOrSelector: `[data-id=${id}]`,
    mechanismFamily: family, spatialClassification: family === "spatial-field" ? "model" : family === "frame-sequence" ? "frame-sequence" : "layered-billboard",
    sourceAssets: [`${id}.webp`], inputDrivers: family === "spatial-field" ? ["drag"] : ["scroll-progress", "velocity"],
    samples: ([0, 25, 50, 75, 100] as const).map((progress, index) => ({
      progress, captureId: `${id}-${progress}`, artifactHash: `${id}-artifact-${progress}`, compositionStateHash: `${id}-state-${progress}`,
      observedProperties: [{ property: "progress", value: progress }], channels: ["camera", "media", "type", "depth"],
      pixelDifferenceFromPrevious: index ? 0.2 : undefined, structuralDifferenceFromPrevious: index ? 0.08 : undefined,
      frameIndex: family === "frame-sequence" ? index * 20 : undefined,
      particleState: family === "particle-reconstruction" ? { activeCount: 800, spread: index, reassembly: index / 4 } : undefined,
      camera: family === "spatial-field" ? { position: [index * 0.4, 0, 5 - index * 0.25], rotation: [0, index * 0.2, 0], fov: 45 } : undefined,
    })),
    postHero, assetTransformsInternally: true, pinnedOrControlledComposition: true, nonObviousBehavior: true, neutralStylingStillSpecial: true,
    handoff: { targetMechanismId: target, persistedObjectOrState: "shared product subject", ownerImplementation: "src/SharedScene.tsx" },
    mobile: { authored: true, mechanismFamily: family, captureIds: [`${id}-mobile`], disabled: false },
    reducedMotion: { authoredComposition: true, captureIds: [`${id}-reduced`] },
    reverse: { relevant: true, tested: true, result: "pass", evidenceIds: [`${id}-reverse`] },
    performance: { averageFps: 56, worstFrameTimeMs: 28, longTasks: 1, transferredBytes: 400000, heavyChunkBytes: 700000 },
    recordingIds: [`${id}-recording`],
  };
}

test("positive self-authored prose cannot satisfy ambitious runtime delivery", () => {
  const value = plan();
  value.execution.evidence.transformations = ["motion develops beyond entrances", "media changes substantially"];
  value.execution.evidence.sceneHandoffs = ["current-to-ledger handoff"];
  value.execution.evidence.motionVocabulary = ["cinematic", "immersive", "experimental"];
  value.execution.evidence.treatmentObservations = {
    media: { start: ["source"], active: ["transformed"], resolved: ["resolved"], inputEffect: ["scroll"], mobile: ["authored"], fallback: [] },
  };
  const result = assessStaticFeeling(value);
  assert.equal(result.score, 0);
  assert.ok(result.findings.some((item) => item.check === "static-feeling"));
  assert.ok(validateAmbitiousRuntimeEvidence(value).some((item) => item.check === "insufficient-experimental-peaks"));
});

test("ordinary carousel and rigid textured plane remain negative even with five labeled states", () => {
  const value = plan();
  const weak = observation("fragment", "hero", "rigid-media-plane", false, "sequence");
  weak.samples = weak.samples.map((sample, index) => ({
    ...sample, compositionStateHash: index < 3 ? "same-a" : "same-b", pixelDifferenceFromPrevious: index ? 0.01 : undefined,
    structuralDifferenceFromPrevious: index ? 0.001 : undefined, channels: ["media"], camera: { position: [0, 0, 5], rotation: [0, index * 0.05, 0], fov: 45 },
  }));
  weak.assetTransformsInternally = false; weak.pinnedOrControlledComposition = false; weak.nonObviousBehavior = false; weak.neutralStylingStillSpecial = false;
  value.execution.runtimeObservations = [weak, {
    ...observation("sequence", "reviews", "ordinary-control", true, "orbit"),
    nonObviousBehavior: false, neutralStylingStillSpecial: false, assetTransformsInternally: false,
  }];
  const checks = validateAmbitiousRuntimeEvidence(value).map((item) => item.check);
  assert.ok(checks.includes("3d-spatial-value"));
  assert.ok(checks.includes("insufficient-media-transformation"));
  assert.ok(checks.includes("insufficient-experimental-peaks"));
});

test("typed controlled states, transformations, continuity, mobile and performance proof can pass", () => {
  const value = plan();
  value.execution.runtimeObservations = [
    observation("fragment", "hero", "particle-reconstruction", false, "sequence"),
    observation("sequence", "story", "frame-sequence", true, "orbit"),
    observation("orbit", "products", "spatial-field", true, "fragment"),
  ];
  value.execution.signatureMediaPackages = [{
    id: "signature", sourceAssets: ["source.webp"], derivatives: [{ path: "atlas.avif", role: "frame atlas", bytes: 300000 }],
    implementationConsumers: ["src/sequence.tsx"], optimization: ["mobile atlas"], temporalEvidenceIds: ["sequence-recording"],
    mobileVariant: "atlas-mobile.avif", reducedMotionAsset: "sequence-still.webp",
  }];
  assert.equal(assessStaticFeeling(value).score, 100);
  assert.deepEqual(validateAmbitiousRuntimeEvidence(value), []);
});

test("typed observations still fail when their hashes and telemetry are not present in verify.json", () => {
  const value = plan();
  value.execution.runtimeObservations = [observation("fragment", "hero", "particle-reconstruction", false, "sequence")];
  const fake = {
    version: 4, generatedAt: new Date().toISOString(), evidence: value.execution.runtimeObservations[0].samples.map((sample) => ({
      id: sample.captureId, criterion: "controlled state", status: "pass", evidence: "self-authored JSON",
      proof: { timestamp: new Date().toISOString(), controlledProgress: sample.progress, artifactHash: "wrong", compositionStateHash: "wrong", observedProperties: [{ property: "progress", expected: String(sample.progress), observed: String(sample.progress) }] },
    })),
  } as any;
  const checks = validateRuntimeObservationGrounding(value, fake);
  assert.ok(checks.some((item) => item.message.includes("not browser/runtime grounded")));
  assert.ok(checks.some((item) => item.message.includes("artifact hash")));
  assert.ok(checks.some((item) => item.message.includes("particle telemetry")));
  assert.ok(checks.some((item) => item.message.includes("recording")));
});
