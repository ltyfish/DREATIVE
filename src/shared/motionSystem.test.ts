import test from "node:test";
import assert from "node:assert/strict";
import type { DirectDesignPlan, MediaTransformation, MotionExecutionMoment, SignatureMediaPackage, StaticFeelingReview, VerificationEvidence, VerificationReport, VisualCheckpoint } from "./artifacts.js";
import { validateVerificationReport } from "./artifacts.js";
import { validateMotionCheckpoint, validateMotionExecution, validateSignatureMediaPackage } from "./motionSystem.js";

const signaturePackage = (type: SignatureMediaPackage["type"]): SignatureMediaPackage => ({
  id: `hero-${type}`, type, pageId: "home", sectionId: "hero",
  purpose: "Reconstruct the source product into independently controlled narrative depth regions.",
  sourceAssets: ["assets/hero-master.webp"], derivatives: [{ path: "assets/hero-subject.webp", role: "subject" }],
  implementationFile: "src/hero.tsx", runtimeReferences: ["hero-subject.webp"],
  independentlyControlledElements: ["source-derived subject layer", "clean background and contact shadow state"],
  mobileFallback: "Mobile resolves fewer layers over a shorter transformation.", reducedMotionFallback: "The completed layered composition renders as a still.",
  performanceSafeguards: ["Pause rendering off-screen and cap device pixel ratio."], evidenceIds: ["hero-media-final"],
});

test("one Signature Media contract supports substantive package categories", () => {
  for (const type of ["layered-subject", "depth-separated", "fragment-reconstruction", "tile-atlas", "generated-states", "frame-sequence", "canvas", "webgl", "editorial-cut-up", "clean-plate"] as const)
    assert.deepEqual(validateSignatureMediaPackage(signaturePackage(type)), [], type);
});

test("Signature Media rejects flat-image tricks and missing delivery safeguards", () => {
  for (const description of ["one image scale", "one image clip", "one image parallax", "one image gradient noise"])
    assert.ok(validateSignatureMediaPackage({ ...signaturePackage("layered-subject"), purpose: `${description} provides a decorative reveal only.`, independentlyControlledElements: [description, "opacity transition"] }).some((error) => error.includes("flat-image")));
  assert.ok(validateSignatureMediaPackage({ ...signaturePackage("webgl"), performanceSafeguards: [] }).some((error) => error.includes("performance safeguards")));
  assert.ok(validateSignatureMediaPackage({ ...signaturePackage("canvas"), mobileFallback: "disabled on mobile" }).some((error) => error.includes("mobile")));
});

const states = ["initial", "early", "mid-transition", "final", "handoff", "reverse-interaction", "mobile", "reduced-motion"] as const;

function moment(mechanism = "SVG clip-path changes the archival sheet into the following section rail."): MotionExecutionMoment {
  return {
    id: "hero-fold", pageId: "home", sectionId: "hero", owner: "Hero archival sheet composition", class: "transformational", driver: "scroll-progress",
    staticComposition: "An archival sheet sits centered above a chapter rail.", startState: "The complete source sheet occupies the hero focal area.", intermediateState: "The sheet folds through a clipped diagonal while its edge aligns to the chapter grid.", endState: "The source sheet edge becomes the persistent rail of the next composition.", handoff: "The aligned edge persists as the next section's chapter rail.", purpose: "Turn archival handling into the navigation and storytelling structure.", renderingMechanism: mechanism, implementationFile: "src/hero.tsx", implementationComponent: "HeroFold", observedProperties: ["clip-path polygon points", "rail layout bounding box", "active chapter state"], desktop: "Scroll maps the full sheet-to-rail transformation across one viewport.", mobile: "A shorter tap-and-scroll fold changes the sheet into a top chapter band.", reducedMotion: "The sheet renders pre-folded into the rail with explicit chapter state.", primaryImplementation: "Drive the SVG mask and rail layout from normalized scroll progress.", runtimeFallback: "Swap directly between source sheet and aligned rail after recorded failure.", successCriteria: ["The source sheet visibly changes shape and becomes the following section rail."], requiredEvidenceIds: states.map((state) => `hero-${state}`), hero: true,
  };
}

function plan(item = moment(), tier: DirectDesignPlan["tier"] = "expressive"): DirectDesignPlan {
  return {
    version: 5, doctrineVersion: 5, request: "Build an authored archival motion experience", createdAt: "2026-01-01T00:00:00.000Z", tier, depth: "reimagine",
    skills: ["ux", "mobile", "motion", "interaction"], skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] }, designRead: { register: "archival", concept: "handled archive", signature: "folding document rail" },
    creativeStrategy: { path: "development", signatureMechanism: "A source document becomes the chapter rail.", states: ["A complete source document is presented for inspection.", "Its edge becomes navigation for the following chapter."], secondaryMechanisms: [], drivers: ["scroll-progress", "click"] },
    motionComplexityBudget: { heroMoments: [{ sectionId: "hero", reason: "The source document physically becomes the journey's navigation system." }], calmSectionIds: [], sharedLanguage: "Document edges become persistent boundaries and controls throughout the page.", deviceLimits: "Mobile shortens folding travel while preserving the document-to-navigation state change.", progressiveEnhancement: "Semantic content renders before SVG masks and scroll synchronization initialize.", antiDefaultReview: { basicMotionAssessment: "The source changes shape and structural role rather than fading into view.", compositionHandoff: "The source edge persists as the next chapter rail.", visualStateChange: "A complete document becomes a narrow navigation instrument.", conceptSpecificity: "Archival handling directly supplies the motion language.", memorableMoment: "The source document becomes the control used to continue reading." } },
    motionMoments: [item], pages: [{ id: "home", name: "Home", skills: ["ux", "mobile", "motion", "interaction"], sections: [{ id: "hero", name: "Hero", layoutFamily: "archival-stage", skills: ["ux", "mobile", "motion", "interaction"], interactions: ["click chapter rail"], motionTreatment: { class: "transformational", staticComposition: item.staticComposition, startState: item.startState, endState: item.endState, changes: item.observedProperties, pinnedElements: [], handoff: item.handoff, purpose: item.purpose, mechanism: item.renderingMechanism, mobile: item.mobile, reducedMotion: item.reducedMotion }, motionMomentIds: [item.id], mobile: item.mobile, fallback: item.runtimeFallback, verification: ["temporal motion proof"], assets: [], status: "shipped" }] }], preservationManifest: ".dreative/preservation.json", decisionLedger: ".dreative/ledger.json",
  };
}

function evidence(item = moment()): VerificationReport {
  const entries: VerificationEvidence[] = states.map((timelineState, index) => ({ id: `hero-${timelineState}`, criterion: `Observe ${timelineState} state`, criterionId: `criterion-${timelineState}`, pageId: "home", sectionId: "hero", kind: "motion", viewportClass: timelineState === "mobile" ? "mobile" : "desktop", mobileChecks: timelineState === "mobile" ? ["motion-media-translated"] : undefined, timelineState, motionMomentId: item.id, status: "pass", evidence: "Controlled progress sample from the production runtime.", proof: { timestamp: "2026-01-01T02:00:00.000Z", artifactPath: `.dreative/captures/hero-${timelineState}.png`, viewport: { width: timelineState === "mobile" ? 390 : 1440, height: 900 }, controlledProgress: index / (states.length - 1), observedProperties: [{ property: "clip-path", expected: `state ${index}`, observed: `state ${index}` }], expectedState: `The composition reaches the planned ${timelineState} state.`, observedState: `The rendered composition visibly matches the ${timelineState} state.` } }));
  return { version: 3, generatedAt: "2026-01-01T03:00:00.000Z", evidence: entries, staticFeelingReview: staticReview(entries.map((entry) => entry.id)) };
}

function staticReview(evidenceIds: string[]): StaticFeelingReview {
  const answer = (value: boolean, observation: string) => ({ answer: value, evidenceIds, observation });
  return {
    developsWithoutEntrances: answer(true, "The document visibly changes composition after entrance motion is excluded."),
    firstViewportMeaningfulResponse: answer(true, "The first viewport visibly responds by folding the source into navigation."),
    beyondOpacityAndPosition: answer(true, "The clip geometry and structural role change beyond opacity and position."),
    crossSectionInfluence: answer(true, "The folded edge persists into and controls the following section composition."),
    signatureDevelops: answer(true, "The signature document develops from source artifact into chapter control."),
    brandSpecificMotion: answer(true, "Archival handling visibly supplies a brand-specific folding motion language."),
    memorableSequence: answer(true, "The source-to-control transformation creates a distinct repeatable sequence."),
    primarilyStaticStack: answer(false, "Captured desktop and mobile states show a developing composition, not a static stack."),
  };
}

function checkpoint(report: VerificationReport): VisualCheckpoint {
  return {
    version: 1, capturedAt: "2026-01-01T01:00:00.000Z", implementation: { hero: true, coreSection: true, desktop: true, mobile: true, primaryMotionLanguage: true }, baselineScreenshotPaths: [".dreative/before.png"], screenshotPaths: { desktop: [".dreative/prototype-desktop.png"], mobile: [".dreative/prototype-mobile.png"] }, critique: Object.fromEntries(["distinctiveness", "hierarchy", "brandVisibility", "signatureLegibility", "equityRetention", "saasTemplateRisk", "brandSwapRisk", "mobileAuthorship", "motionPurpose", "counterfactualStrength"].map((key) => [key, `The rendered prototype provides a concrete ${key} comparison against the baseline.`])) as VisualCheckpoint["critique"], meaningfulWeaknessFound: false, refinements: [], approval: { status: "approved", approvedAt: "2026-01-01T02:30:00.000Z", transcriptReferences: ["chat:prototype-approved"] }, systemSpreadStartedAt: "2026-01-01T02:40:00.000Z", motionPrototype: { motionMomentIds: ["hero-fold"], firstViewport: true, importantComposition: true, structuralOrTransformationalTransition: true, interactionResponse: true, desktop: true, mobile: true, reducedMotion: true, realProject: true, representativeAssets: true, evidenceIds: report.evidence.map((entry) => entry.id), staticFeelingReview: staticReview(report.evidence.map((entry) => entry.id)) },
  };
}

for (const [name, mechanism] of [
  ["CSS/SVG structural transition", "CSS grid state and SVG clip-path turn the source sheet into a chapter rail."],
  ["GSAP pinned composition", "GSAP ScrollTrigger pins the source while foreground and background layers separate into the rail."],
  ["Motion layout and gesture transition", "Motion layout projection and drag velocity reorder the sheet before it settles as the chapter rail."],
  ["Canvas/WebGL media transformation", "Canvas pixels sample the source image and rebuild them into the next composition boundary."],
] as const) test(`accepts technology-neutral ${name}`, () => {
  const item = moment(mechanism); assert.deepEqual(validateMotionExecution(plan(item), evidence(item)), []);
});

test("rejects expressive work containing only fades slides and staggers", () => {
  const item = moment("Fade and translate the hero, then stagger the cards into view."); item.class = "decorative"; item.driver = "load";
  assert.ok(validateMotionExecution(plan(item)).some((error) => error.includes("structural or transformational")));
});

test("rejects structural claims supported only by basic transforms", () => {
  const item = moment("Translate, scale, and fade the composition on scroll."); item.class = "structural"; item.intermediateState = "The card translates and scales while opacity changes."; item.endState = "The card finishes translated, scaled, and fully opaque."; item.successCriteria = ["The card visibly translates, scales, and changes opacity during scroll."];
  assert.ok(validateMotionExecution(plan(item)).some((error) => error.includes("using only basic transforms")));
});

test("rejects motion plans with no temporal evidence", () => {
  assert.ok(validateMotionExecution(plan(), { version: 3, generatedAt: "2026-01-01T03:00:00.000Z", evidence: [] }).some((error) => error.includes("missing passing temporal evidence")));
});

test("rejects fake midpoint screenshots without controlled progress", () => {
  const report = evidence(); const middle = report.evidence.find((item) => item.timelineState === "mid-transition")!; middle.proof = { timestamp: middle.proof.timestamp, artifactPath: ".dreative/fake-middle.png", viewport: { width: 1440, height: 900 } };
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("lacks recording, trace, or grounded controlled-progress provenance")));
});

test("rejects controlled-progress evidence with no artifact, test, command, trace, or capture manifest", () => {
  const report = evidence(); for (const item of report.evidence) delete item.proof.artifactPath;
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("grounded controlled-progress provenance")));
});

test("rejects seven timeline states that all use the same progress value", () => {
  const report = evidence(); for (const item of report.evidence.slice(0, 7)) item.proof.controlledProgress = 0.5; report.evidence[7].proof.controlledProgress = 0.5;
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("three distinct progress values")));
});

test("rejects initial, mid-transition, and final evidence with identical observed values", () => {
  const report = evidence(); for (const state of ["initial", "mid-transition", "final"]) report.evidence.find((item) => item.timelineState === state)!.proof.observedProperties![0].observed = "identical rendered state";
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("distinct observed values")));
});

test("rejects prototype evidence captured after systemSpreadStartedAt", () => {
  const report = evidence(); const value = checkpoint(report); report.evidence[0].proof.timestamp = "2026-01-01T02:45:00.000Z";
  assert.ok(validateMotionCheckpoint(plan(), value, report).some((error) => error.includes("after system spread started")));
});

test("rejects prototype evidence that exists but is not temporal or passing", () => {
  const report = evidence(); const value = checkpoint(report); report.evidence[0].status = "fail"; report.evidence[1].kind = "visual";
  const errors = validateMotionCheckpoint(plan(), value, report);
  assert.ok(errors.some((error) => error.includes("must pass")) && errors.some((error) => error.includes("grounded temporal provenance")));
});

test("rejects staticFeelingReview containing nonexistent evidence IDs", () => {
  const report = evidence(); report.staticFeelingReview!.signatureDevelops.evidenceIds = ["made-up-evidence"];
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("references missing evidence made-up-evidence")));
});

test("rejects a recording whose end timestamp is not later than its start timestamp", () => {
  const report = evidence(); const proof = report.evidence[0].proof; proof.recordingPath = ".dreative/captures/hero.webm"; proof.startTimestamp = "2026-01-01T02:00:00.000Z"; proof.endTimestamp = proof.startTimestamp;
  assert.ok(validateVerificationReport(report).some((error) => error.includes("endTimestamp must be later")));
});

test("rejects shipped sections before required motion evidence exists", () => {
  const report = evidence(); report.evidence.pop();
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("section is shipped before motion evidence passes")));
});

test("rejects mobile motion that is simply removed", () => {
  const item = moment(); item.mobile = "disabled on mobile";
  assert.ok(validateMotionExecution(plan(item)).some((error) => error.includes("re-authored")));
});

test("rejects missing reverse-state verification", () => {
  const report = evidence(); report.evidence = report.evidence.filter((item) => item.timelineState !== "reverse-interaction");
  assert.ok(validateMotionExecution(plan(), report).some((error) => error.includes("missing reverse-interaction")));
});

test("rejects silent fallback substitution", () => {
  const value = plan(); value.pages[0].sections[0].status = "fallback"; value.pages[0].sections[0].reason = "The primary runtime failed.";
  assert.ok(validateMotionExecution(value).some((error) => error.includes("without a typed primary-attempt record")));
});

function transformation(family: "ai-states" | "sequence" | "realtime"): MediaTransformation {
  const mechanisms = { "ai-states": "hybrid composition", sequence: "image sequence", realtime: "WebGL shader" } as const;
  const candidates = [0, 1, 2].map((index) => ({ id: `candidate-${index}`, visitorExperience: index === 0 ? "The source photograph changes material state while preserving the subject and camera." : `The source photograph explores a distinct brand-derived material transformation family ${index}.`, brandRationale: "Archival conservation and handling supply the transformation's visual logic.", sourceAsset: "assets/source.webp", requiredDerivatives: ["state-a", "state-b"], execution: family === "realtime" ? "real-time" as const : family === "sequence" ? "pre-rendered" as const : "hybrid" as const, driver: "Continuous normalized scroll progress", startState: "The intact source photograph establishes the original archival condition.", intermediateState: "The actual source pixels separate into conservation layers while identity remains coherent.", endState: "The source pixels rebuild as the indexed state used by the next composition.", desktopFeasibility: "Desktop has sufficient decode and rendering budget for the complete transformation.", mobile: "Mobile uses separately composed states with a shorter but equivalent transformation.", reducedMotion: "The final coherent state replaces continuous travel while preserving the narrative change.", performanceRisk: "Decode memory and frame time are capped and sampled on target devices.", fallback: "An evidenced cross-state comparison preserves the same before and after meaning.", selected: index === 0, rejectionReason: index === 0 ? undefined : "This candidate makes the archival relationship less legible than the selected transformation." }));
  return {
    id: `media-${family}`, pageId: "home", sectionId: "hero", motionMomentId: "hero-fold", sourceAsset: "assets/source.webp", candidates, selectedCandidateId: "candidate-0",
    mechanismComparison: [{ mechanism: mechanisms[family], feasibility: "This mechanism can visibly transform the source while meeting the measured device budget.", decision: "selected", reason: "It is the simplest option that preserves the selected visitor-visible media change." }, { mechanism: "DOM/CSS", feasibility: "Basic DOM layers cannot alter the required source pixels with sufficient fidelity.", decision: "rejected", reason: "It would reduce the transformation to decoration over an unchanged source image." }],
    derivatives: [{ id: "source-state", path: "assets/source-state.webp", role: family === "realtime" ? "displacement-map" : family === "sequence" ? "rendered-animation-frame" : "edited-state-image", sourceAsset: "assets/source.webp", productionMethod: family === "ai-states" ? "AI-assisted edit followed by manual identity inspection" : "Deterministic renderer export", aiInstruction: family === "ai-states" ? "Preserve subject identity, camera, palette, and lighting while changing material state." : undefined, dimensions: "1600x1000 pixels", aspectRatio: "8:5 landscape", frameCount: family === "sequence" ? 48 : undefined, format: "WebP", expectedUse: "Drive the planned source-media transformation.", optimizationTarget: "Keep the complete treatment below the declared transfer budget.", implementationConsumer: "HeroFold media renderer", status: "shipped", evidenceIds: ["asset-inspection"] }],
    frameSequence: family === "sequence" ? { sourceMethod: "Offline render from three approved coherent key states.", keyStateCount: 3, targetFrameCount: 48, productionMethod: "Interpolate and inspect numbered WebP frames in deterministic order.", scrollRange: "Map one viewport of scroll to frames zero through forty-seven.", frameProgressMapping: "Clamp normalized progress and round to the nearest available frame.", preloadStrategy: "Load the first frame immediately and stage later frames before entry.", decodingStrategy: "Decode ahead in bounded batches without retaining duplicate bitmaps.", renderingStrategy: "Draw the selected decoded frame into one responsive Canvas 2D surface.", desktopDimensions: "Render at 1600 by 1000 source pixels with capped DPR.", mobileStrategy: "Use a separately composed twenty-four-frame mobile sequence.", format: "WebP", transferBudget: "Keep desktop below five megabytes and mobile below three megabytes.", droppedFrameHandling: "Reuse the last decoded frame while the requested frame finishes decoding.", fallback: "Use the approved poster and final state after evidenced sequence failure.", reducedMotion: "Render the approved final still with the same section handoff." } : undefined,
    consistencyInspection: "Inspection confirms stable subject identity, camera, palette, lighting direction, and composition across states.", prototypeEvidenceIds: ["prototype-media"], finalEvidenceIds: ["final-media"], implementationFile: "src/hero.tsx",
  };
}

for (const family of ["ai-states", "sequence", "realtime"] as const) test(`accepts media-transformation family ${family}`, () => {
  const value = plan(); const media = transformation(family); value.mediaTransformations = [media]; value.pages[0].sections[0].mediaTransformationIds = [media.id];
  assert.deepEqual(validateMotionExecution(value), []);
});
