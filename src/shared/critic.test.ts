import test from "node:test";
import assert from "node:assert/strict";
import { buildIndependentCriticPrompt, validateCriticInput, validateVisualCriticReport, type CriticInput, type VisualCriticReport } from "./critic.js";

function input(baselineAvailable = true): CriticInput {
  return {
    version: 1, generatedAt: "2026-07-14T02:00:00.000Z",
    originalBrief: "Redesign the point-of-sale website with a distinctive editorial product story.",
    userConstraints: ["Keep checkout links and strong existing typography"],
    approvedConcept: "A receipt timeline becomes the compositional and interactive spine across the journey.",
    visualBlueprints: [{ pageId: "home", sectionId: "hero", blueprint: "The receipt timeline crosses an offset editorial hero and changes role as product states advance." }],
    intendedSignature: "Interactive receipt timeline",
    baselineAvailable,
    evidence: [
      ...(baselineAvailable ? [
        { id: "before-desktop", kind: "baseline-screenshot" as const, description: "Original desktop home", artifactPath: ".dreative/before-desktop.png", viewport: { width: 1440, height: 1000 } },
        { id: "before-mobile", kind: "baseline-screenshot" as const, description: "Original mobile home", artifactPath: ".dreative/before-mobile.png", viewport: { width: 390, height: 844 } },
      ] : []),
      { id: "final-desktop", kind: "final-screenshot", description: "Final desktop home", artifactPath: ".dreative/final-desktop.png", viewport: { width: 1440, height: 1000 } },
      { id: "final-mobile", kind: "final-screenshot", description: "Final mobile home", artifactPath: ".dreative/final-mobile.png", viewport: { width: 390, height: 844 } },
    ],
    contextPolicy: { firstPass: "objective-only", excluded: ["builder-self-review", "implementation-rationale", "quality-claims", "difficulty-excuses", "builder-score"] },
  };
}

function report(): VisualCriticReport {
  return {
    version: 1, reviewedAt: "2026-07-14T02:10:00.000Z", inputArtifact: ".dreative/critic-input.json",
    contextIsolation: { mode: "fresh-subagent", independentReadingRecordedAt: "2026-07-14T02:08:00.000Z", limitation: "Motion was not supplied, so motion quality is not judged." },
    reviewContext: { availableInputs: ["brief", "concept", "desktop", "mobile"], missingInputs: ["motion recording"], viewportsInspected: ["1440x1000", "390x844"], pagesOrFlowsInspected: ["home"], motionInspected: false, limitations: ["No direct motion evidence"] },
    independentReading: { perceivedConcept: "An editorial receipt timeline organizes the product story.", perceivedSignature: "The receipt spine is visible through the hero and feature transition.", perceivedBrandCharacter: "Operational precision is paired with warm editorial typography.", perceivedMotionRole: "Motion cannot be assessed from the supplied static screenshots." },
    initialVerdict: "PASS", verdict: "PASS", strongestQualities: [], findings: [], baselineRegressions: [], conceptFidelityFindings: [], mobileFindings: [], motionFindings: [], requiredRevisionSet: [], nonBlockingExperiments: [],
    dogfood: { falsePositives: [], vagueFindings: [], humanMisses: [], styleConvergenceRisk: [], complexityBias: [], motionEvidenceRisk: ["No motion evidence supplied"], experimentsForRecipes: [] },
  };
}

test("critic input requires objective desktop/mobile evidence and redesign baseline", () => {
  assert.deepEqual(validateCriticInput(input()), []);
  const missing = input(); missing.evidence = missing.evidence.filter((item) => item.id !== "final-mobile");
  assert.ok(validateCriticInput(missing).some((error) => error.includes("final mobile")));
});

test("new builds degrade gracefully without baseline evidence", () => {
  const fresh = input(false);
  assert.deepEqual(validateCriticInput(fresh), []);
  assert.deepEqual(validateVisualCriticReport(report(), fresh), []);
});

test("critic prompt includes approved objective context without builder rationale", () => {
  const prompt = buildIndependentCriticPrompt(input());
  assert.match(prompt, /receipt timeline/);
  assert.match(prompt, /final-desktop/);
  assert.doesNotMatch(prompt, /I worked hard|implementation was difficult|builder proposed score/);
});

test("first-pass context policy cannot omit builder-context exclusions", () => {
  const value = input(); value.contextPolicy.excluded = ["builder-self-review"];
  assert.ok(validateCriticInput(value).some((error) => error.includes("must exclude builder")));
});

test("builder context may open only after the independent reading is recorded", () => {
  const value = report(); value.contextIsolation.builderContextOpenedAt = "2026-07-14T02:07:00.000Z";
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("only after the independent reading")));
});

test("Full Audit and Dogfood cannot pass with best-effort or same-agent critic isolation", () => {
  const objective = input();
  objective.independentCriticRequired = true;
  const value = report();
  value.contextIsolation.mode = "best-effort";
  value.contextIsolation.limitation = "No fresh subagent was available, so the builder reviewed its own evidence.";
  assert.ok(validateVisualCriticReport(value, objective).some((error) => error.includes("fresh subagent")));
  value.contextIsolation.mode = "fresh-subagent";
  assert.equal(validateVisualCriticReport(value, objective).some((error) => error.includes("fresh subagent")), false);
});

test("motion claims are limited without live or recorded evidence", () => {
  const value = report(); value.reviewContext.motionInspected = true;
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("motionInspected")));
  value.reviewContext.motionInspected = false;
  value.findings = [{ id: "motion", severity: "BLOCKER", category: "motion-interaction", location: "Home scroll transition", observedIssue: "The transition materially obscures the product copy during the scroll sequence.", whyItMatters: "Visitors cannot read the core product explanation while the scene advances.", correctionDirection: "Keep the copy stable until the visual transition clears its reading area.", evidenceIds: ["final-desktop"], blocksCompletion: true }];
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("without direct motion evidence")));
});

test("motion critic input rejects desktop screenshots without temporal and reduced-motion evidence", () => {
  const value = input(false); value.motionRequired = true; value.motionMomentIds = ["hero-transform"];
  assert.ok(validateCriticInput(value).some((error) => error.includes("motion evidence unavailable")));
  value.evidence.push({ id: "motion", kind: "motion-recording", description: "Hero transformation recording", artifactPath: ".dreative/hero.webm", motionMomentId: "hero-transform", viewport: { width: 1440, height: 1000 } });
  assert.ok(validateCriticInput(value).some((error) => error.includes("reduced-motion evidence")));
});

test("technique absence cannot block and experiments are non-blocking", () => {
  const value = report();
  value.findings = [{ id: "tech", severity: "BLOCKER", category: "authorship", location: "Home hero composition", observedIssue: "The hero lacks WebGL and therefore does not deliver a sufficiently ambitious technical treatment.", whyItMatters: "This criticism incorrectly substitutes a technology preference for visible design evidence.", correctionDirection: "Judge the visible composition and concept fidelity instead of prescribing rendering technology.", evidenceIds: ["final-desktop"], blocksCompletion: true }];
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("technique absence")));
  value.findings[0].severity = "EXPERIMENT";
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("experiments cannot block")));
});

test("findings require concrete locations, observations, corrections, and evidence", () => {
  const value = report();
  value.findings = [{ id: "vague", severity: "MINOR", category: "hierarchy-composition", location: "hero", observedIssue: "Make it pop.", whyItMatters: "Looks weak.", correctionDirection: "Make premium.", evidenceIds: [], blocksCompletion: false }];
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("evidence-grounded")));
});

test("required revision set is prioritized and capped at five", () => {
  const value = report(); value.requiredRevisionSet = ["1", "2", "3", "4", "5", "6"];
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("limited to five")));
});

test("passing verdict cannot retain unresolved blockers", () => {
  const value = report();
  value.findings = [{ id: "generic", severity: "BLOCKER", category: "generic-template-risk", location: "Sections two through five", observedIssue: "Four consecutive sections repeat the same two-column composition with interchangeable card styling.", whyItMatters: "The approved editorial rhythm disappears after the hero and the page becomes brand-swappable.", correctionDirection: "Recompose the core sections around distinct roles of the approved receipt timeline.", evidenceIds: ["final-desktop"], blocksCompletion: true }];
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("unresolved blocking")));
});

test("one evidence-backed refinement can resolve blockers without an infinite loop", () => {
  const value = report();
  value.initialVerdict = "MAJOR REVISION REQUIRED"; value.verdict = "PASS AFTER REVISION"; value.requiredRevisionSet = ["Recompose repeated core sections"];
  value.findings = [{ id: "generic", severity: "BLOCKER", category: "generic-template-risk", location: "Sections two through five", observedIssue: "Four consecutive sections repeat the same two-column composition with interchangeable card styling.", whyItMatters: "The approved editorial rhythm disappears after the hero and the page becomes brand-swappable.", correctionDirection: "Recompose the core sections around distinct roles of the approved receipt timeline.", evidenceIds: ["final-desktop"], blocksCompletion: true }];
  value.revision = { iteration: 1, status: "complete", resolutions: [{ findingId: "generic", status: "resolved", evidenceIds: ["final-desktop"], reason: "Recaptured sections now give the timeline distinct index, comparison, and closure roles." }], recapturedEvidenceIds: ["final-desktop", "final-mobile"], followUpReviewedAt: "2026-07-14T02:20:00.000Z" };
  assert.deepEqual(validateVisualCriticReport(value, input()), []);
  (value.revision as { iteration: number }).iteration = 2;
  assert.ok(validateVisualCriticReport(value, input()).some((error) => error.includes("limited to one")));
});

test("reduced ambition is not judged against award-level technique expectations", () => {
  const value = report();
  value.nonBlockingExperiments = ["A future dogfood run could test frame-based image motion, but it is not required here."];
  assert.deepEqual(validateVisualCriticReport(value, input()), []);
});

test("Experimental critic rejects a polished hero-only route and missing primary mechanism", () => {
  const objective = input(false);
  objective.ambition = "experimental";
  objective.selectedTreatments = ["ux", "mobile", "motion", "interaction", "media", "experimental"];
  objective.plannedPeaks = [
    { id: "hero-fragments", location: "hero", plannedBehaviour: "Image reconstructs", startState: "intact", activeState: "fragmented", resolution: "rebuilt", inputRelationship: "scroll", mobileStrategy: "reduced fragments", fallbackState: "slices" },
    { id: "roast-sequence", location: "roast", plannedBehaviour: "Frames scrub", startState: "green", activeState: "roasting", resolution: "dark", inputRelationship: "scroll", mobileStrategy: "reduced frames", fallbackState: "semantic states" },
  ];
  objective.plannedMechanisms = objective.plannedPeaks.map((peak) => ({ id: peak.id, location: peak.location, primaryImplementation: peak.plannedBehaviour, primaryAcceptance: ["start active resolved"], fallbackImplementation: peak.fallbackState, fallbackTrigger: "measured runtime failure" }));
  const value = report();
  value.routeAssessment = {
    heroRemovedStillSatisfies: false, fullRouteAuthored: false, mediaDiverse: false, ordinaryControlsSubstituteForExperience: true,
    selectedTreatmentVerdicts: objective.selectedTreatments.map((treatment) => ({ treatment, verdict: "fail", evidenceIds: ["final-desktop"], observation: "Only selector-level or hero evidence exists." })),
    peakVerdicts: objective.plannedPeaks.map((peak) => ({ peakId: peak.id, plannedBehaviour: peak.plannedBehaviour, observedBehaviour: peak.id === "roast-sequence" ? "Three ordinary tabs" : "Hero fragments", startState: peak.startState, activeState: peak.activeState, resolution: peak.resolution, inputRelationship: peak.inputRelationship, mobileStrategy: peak.mobileStrategy, fallbackState: peak.fallbackState, verdict: peak.id === "roast-sequence" ? "fail" : "pass", evidenceIds: ["final-desktop"] })),
    mechanismVerdicts: objective.plannedMechanisms.map((mechanism) => ({ mechanismId: mechanism.id, observedImplementation: mechanism.id === "roast-sequence" ? "tabs" : "fragments", fallbackUsed: mechanism.id === "roast-sequence", fallbackTriggerValid: false, finalStatus: mechanism.id === "roast-sequence" ? "failed" : "primary-delivered", verdict: mechanism.id === "roast-sequence" ? "fail" : "pass", evidenceIds: ["final-desktop"] })),
    assetIntegrity: "fail", performanceRisk: "One large image is repeatedly reused.", reducedMotionTranslation: "No authored translation.",
  };
  assert.ok(validateVisualCriticReport(value, objective).some((error) => /hero-only|hero-removed|cannot pass/i.test(error)));
});
