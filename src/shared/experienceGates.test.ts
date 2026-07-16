import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, type CanonicalPlan } from "./planGovernance.js";
import { validateExperienceDelivery } from "./experienceGates.js";

function plan(): CanonicalPlan {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-gates-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const value = createPlan(root, {
    workflow: { ambition: "award", execution: "full-audit", prototype: "required", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"],
  });
  value.contract.experienceArc = { openingState: "Grounded opening", firstTransformation: "Media reconstructs", sectionProgression: "Three chapters develop", peaksAndRests: "Peaks alternate with rests", persistentSystem: "Rail persists across sections", userControlledMoment: "Drag changes viewpoint", mobileTranslation: "Swipe changes compact scene", finalResolution: "Scene resolves into action" };
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
  };
  value.execution.checkpoints.mechanismPrototype = { status: "passed", scope: "drag feasibility only", evidenceIds: ["prototype"] };
  value.execution.checkpoints.conceptCheckpoint = { status: "passed", actualHero: true, downstreamSection: true, realVisualSystem: true, mainTemporalOrMediaIdea: true, mobile390: true, reducedMotion: true, realApplication: true, reviewer: "independent-critic", evidenceIds: ["slice"] };
  value.execution.browserValidation = { checkedAt: new Date().toISOString(), visibleImages: [], failedRequests: [], unexpectedHttpErrors: [], emptyCanvases: [], webglDraws: [], consoleErrors: [], runtimeErrors: [], productionMediaMissing: [] };
  assert.deepEqual(validateExperienceDelivery(value), []);
});
