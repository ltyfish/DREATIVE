import { test, expect } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { runVisualSmoke, validateMechanisms, validateMotionAnalysisEvidence, type ShowcaseMechanismContract } from "./visualSmoke.js";
import type { ExperienceMap } from "../shared/experienceMap.js";

const base = "http://127.0.0.1:4181";
const semanticMotion = {
  productTruth: "Readiness changes the usable product state.",
  userCause: "The visitor directly changes readiness.",
  visibleChange: "The primary product subject changes state.",
  decisionConsequence: "The visitor receives a different product decision.",
  motionIntent: "state-transition" as const,
  temporalEvidence: "runtime-sampled" as const,
};
const contract: ShowcaseMechanismContract = {
  version: 2,
  experienceType: "interface",
  classification: { implementation: "attempted" },
  recommendedBaseline: "Three direct state controls in an otherwise conventional page.",
  showcaseDelta: ["The controls form one continuous instrument.", "The peak changes the spatial composition."],
  mediaOpportunities: [
    { opportunity: "Product photography", decision: "reject", rationale: "The fixture has no product subject." },
    { opportunity: "Custom SVG instrument", decision: "use", rationale: "It supplies the peak visual mode." },
  ],
  referenceMode: "supplied",
  referenceMinimum: 1,
  referenceAdoptions: [
    { source: "fixture instrument", sourceRef: "scripts/serve-visual-smoke-fixtures.mjs", rights: "original test fixture", principle: "direct state legibility", decision: "use", requiredBy: "direction", targetSelector: "#peak", visibleImplementation: "the SVG instrument changes with readiness", rationale: "The reference principle is visible in the primary instrument." },
  ],
  assetCommitments: [
    { role: "hero readiness subject", stage: "hero", subjectKind: "interface", decision: "reject", requiredBy: "direction", targetSelector: "#before", medium: "none", productionSource: "none", sourceKind: "none", sourceRef: "fixture has no hero media", rights: "not applicable", treatment: "semantic control only", crop: "not applicable", animationTechnique: "native state", mobileFallback: "direct tap", externalEvaluation: "external media would not clarify this fixture", rationale: "The fixture tests state rather than art direction." },
    { role: "primary process instrument", stage: "peak", subjectKind: "graphic", decision: "use", requiredBy: "direction", targetSelector: "#peak", medium: "svg", productionSource: "procedural", sourceKind: "inline", sourceRef: "#peak svg", rights: "original fixture code", treatment: "direct state instrument", crop: "complete viewBox", animationTechnique: "native state changes", mobileFallback: "bounded SVG", externalEvaluation: "photography and 3D add no meaning to the abstract fixture", rationale: "The SVG is the semantic product subject." },
    { role: "post-peak decision subject", stage: "post-peak", subjectKind: "interface", decision: "reject", requiredBy: "direction", targetSelector: "#after", medium: "none", productionSource: "none", sourceKind: "none", sourceRef: "fixture decision boxes", rights: "not applicable", treatment: "semantic layout only", crop: "not applicable", animationTechnique: "native state", mobileFallback: "stacked decision", externalEvaluation: "external media would not clarify this fixture", rationale: "The post-peak fixture is an interface state." },
  ],
  prototypeEvidence: {
    treatmentOptions: [
      { name: "direct controls", frames: [{ stage: "input", visual: "Readiness control at rest" }, { stage: "change", visual: "Control changes the product state" }, { stage: "outcome", visual: "Decision result appears" }] },
      { name: "connected spatial instrument", frames: [{ stage: "input", visual: "Instrument receives readiness" }, { stage: "change", visual: "SVG geometry transforms" }, { stage: "outcome", visual: "Resolved product arrangement appears" }] },
    ],
    comparisonRequired: true,
    bestFitApproach: "Direct connected product controls.",
    boldAlternativeApproach: "Connected SVG and spatial state system.",
    selectedApproach: "Connected SVG and spatial state system.",
    selectedBy: "user",
    bestFitArtifact: "/prototype/bounded",
    boldAlternativeArtifact: "/prototype/high-ceiling",
    bestFitCaptures: { desktop: `${base}/capture/bounded-desktop.svg`, mobile: `${base}/capture/bounded-mobile.svg` },
    boldAlternativeCaptures: { desktop: `${base}/capture/high-ceiling-desktop.svg`, mobile: `${base}/capture/high-ceiling-mobile.svg` },
    bestFitRecordings: { desktop: `${base}/recording/bounded-desktop.mp4`, mobile: `${base}/recording/bounded-mobile.mp4` },
    boldAlternativeRecordings: { desktop: `${base}/recording/high-ceiling-desktop.mp4`, mobile: `${base}/recording/high-ceiling-mobile.mp4` },
    fullPageContinuityStoryboards: {
      bestFit: { artifact: "/prototype/bounded", capture: `${base}/capture/bounded-desktop.svg`, heroSelector: "#story-hero", peakSelector: "#story-peak", postPeakSelector: "#story-post" },
      boldAlternative: { artifact: "/prototype/high-ceiling", capture: `${base}/capture/high-ceiling-desktop.svg`, heroSelector: "#story-hero", peakSelector: "#story-peak", postPeakSelector: "#story-post" },
    },
    comparisonParity: { bothFinalWorthy: true, sharedContent: true, sharedViewportCoverage: true, distinctInteractionModels: true },
    prototypeReview: { status: "accepted", acceptedBy: "user" },
    builderSelectionRationale: "The connected system made the state transition visibly legible; this is a builder assertion, not an independent verdict.",
  },
  prototypeFidelity: {
    level: "production-like",
    limitations: "Fixture media is representative of the final interaction, not a taste verdict.",
    selectedArtifact: "/prototype/high-ceiling",
    prototypeSubjectSelector: "circle",
    integratedSubjectSelector: "#peak svg",
    focalObject: "the process instrument remains the primary object",
    copyBalance: "the instrument remains larger than supporting copy",
    controlPlacement: "controls remain attached to the instrument region",
    materialLighting: "the selected SVG material contrast remains legible",
    desktopFraming: "the complete instrument remains visible",
    mobileFraming: "the complete instrument remains visible at narrow widths",
  },
  continuity: {
    stateKey: "readiness",
    sourceSelector: "#before",
    sourceTrigger: "click",
    stateCount: 3,
    affectedRegions: [
      { selector: "#before", stage: "before", effect: "sets readiness" },
      { selector: "#peak", stage: "peak", effect: "transforms the instrument" },
      { selector: "#after", stage: "after", effect: "changes the final decision" },
    ],
  },
  agencyChain: {
    controlSectionSelector: "#before",
    inputSelector: "#before",
    primaryResponseSelector: "#peak",
    downstreamSelector: "#after",
    userAction: "change readiness",
    immediateResponse: "transform the process instrument",
    decisionOutcome: "change the final product decision",
  },
  comparisonLayouts: [
    { selector: "#after", itemSelector: ".box", identityAttribute: "data-product", strategy: "fixed-grid", reorderMode: "controlled", maxTravelViewportRatio: .1, maxItemResizeRatio: 0, gapTolerancePx: 1, alignmentTolerancePx: 1, identityChannels: [{ channel: "product id", selector: "$self", uniqueProperty: "data-product" }, { channel: "product colour", selector: "$self", uniqueProperty: "background-color" }], assetStatus: "production" },
  ],
  mechanisms: [
    { ...semanticMotion, name: "readiness-control", stage: "before", selector: "#before", primarySelector: ".box", primarySubject: "readiness indicator", trigger: "click", mediaMode: "dom-state", mobileTransformation: "direct tap", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3 },
    { ...semanticMotion, name: "instrument-peak", stage: "peak", selector: "#peak", primarySelector: "svg", primarySubject: "process instrument", trigger: "click", mediaMode: "svg", mobileTransformation: "bounded SVG", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3, minimumDwellMs: 400, releaseSelector: "#after" },
    { ...semanticMotion, name: "decision-resolution", stage: "after", selector: "#after", primarySelector: ".box:first-of-type", primarySubject: "decision layout", trigger: "click", mediaMode: "spatial-layout", mobileTransformation: "stacked resolution", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3 },
  ],
};

const experienceMap: ExperienceMap = {
  version: 1,
  direction: "showcase",
  route: "/",
  concept: "Connected readiness instrument",
  primaryPeak: "peak",
  recommendations: ["Keep the instrument as the peak."],
  sections: [
    { id: "before", title: "Before", role: "orient", intensity: 3, rhythm: "build", agency: "control", inputState: "default", startState: "idle", endState: "ready", mechanismOwner: "native-js", connection: "feeds peak", desktop: "direct control", mobile: "direct tap", reducedMotion: "instant", evidenceTarget: "selected state", selector: "#before", trigger: "click", ownedProperties: ["transform"], meaningfulOutcome: "sets readiness" },
    { id: "peak", title: "Peak", role: "transform", intensity: 5, rhythm: "peak", agency: "control", inputState: "ready", startState: "bounded", endState: "transformed", mechanismOwner: "native-js", connection: "feeds decision", desktop: "instrument", mobile: "bounded instrument", reducedMotion: "instant", evidenceTarget: "three states", selector: "#peak", trigger: "click", ownedProperties: ["transform"], meaningfulOutcome: "moves through three process states" },
    { id: "after", title: "After", role: "resolve", intensity: 3, rhythm: "release", agency: "influence", inputState: "transformed", startState: "open", endState: "decided", mechanismOwner: "native-js", connection: "closes journey", desktop: "decision", mobile: "stacked", reducedMotion: "instant", evidenceTarget: "decision state", selector: "#after", trigger: "click", ownedProperties: ["transform"], meaningfulOutcome: "changes the final decision" },
  ],
};

test("production identity rejects text and hidden identifiers without a visual channel", () => {
  const dishonest = structuredClone(contract);
  dishonest.comparisonLayouts[0].identityChannels = [
    { channel: "name", selector: "$self", uniqueProperty: "text" },
    { channel: "hidden id", selector: "$self", uniqueProperty: "data-product" },
  ];
  expect(validateMechanisms("showcase", dishonest).join("\n")).toContain("visual channels");
});

test("frame analysis is measured and hash-bound to a submitted recording", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-motion-"));
  const recording = "evidence/roast.webm";
  fs.mkdirSync(path.join(root, "evidence"));
  fs.writeFileSync(path.join(root, recording), "recording bytes");
  const analyzed = structuredClone(contract);
  analyzed.prototypeEvidence.bestFitRecordings = { desktop: recording, mobile: recording };
  analyzed.mechanisms[0].temporalEvidence = "frame-analysis";
  analyzed.mechanisms[0].motionEvidenceRef = "evidence/roast-motion.json";
  fs.writeFileSync(path.join(root, "evidence/roast-motion.json"), JSON.stringify({
    version: 1, recording,
    recordingSha256: createHash("sha256").update("recording bytes").digest("hex"),
    framesSampled: 30, abruptReplacements: 11, frozenIntervals: 12,
    wholeFrameScaling: true, continuousSubjectMotion: false,
    method: "Thirty evenly spaced frames compared for pixel and subject change.",
  }));
  expect(validateMotionAnalysisEvidence(analyzed, root)).toEqual([]);
  fs.writeFileSync(path.join(root, recording), "changed bytes");
  expect(validateMotionAnalysisEvidence(analyzed, root).join("\n")).toContain("hash does not match");
  fs.rmSync(root, { recursive: true, force: true });
});

test("healthy responsive fixture and three real mechanisms pass", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract, experienceMap });
  expect(result.blockers).toEqual([]);
  expect(result.checks.some((item) => item.includes("declared consequence") && item.includes("unverified") && item.includes("human review required"))).toBe(true);
});

test("declared media must exist in the mechanism region", async () => {
  const dishonest = { ...contract, mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#lying-peak" } : item) };
  const result = await runVisualSmoke(`${base}/lying-media`, { profile: "showcase", showcase: dishonest });
  expect(result.blockers).toContain("instrument-peak primary selector svg must resolve to exactly one element inside #lying-peak");
});

test("scroll-authored mechanisms must expose at least three sampled states", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    referenceAdoptions: contract.referenceAdoptions.map((item) => ({ ...item, targetSelector: "#scroll-story" })),
    assetCommitments: contract.assetCommitments.map((item) => ({ ...item, targetSelector: "#scroll-story", medium: "none" as const, productionSource: "none" as const, sourceKind: "none" as const, decision: "reject" as const })),
    prototypeFidelity: { ...contract.prototypeFidelity, integratedSubjectSelector: "#scroll-story .box" },
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    agencyChain: { ...contract.agencyChain, primaryResponseSelector: "#scroll-story" },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toEqual([]);
});

test("a tall static section cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    agencyChain: { ...contract.agencyChain, primaryResponseSelector: "#scroll-story" },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("instrument-peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("static sticky elements cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    agencyChain: { ...contract.agencyChain, primaryResponseSelector: "#scroll-story" },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-sticky-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("instrument-peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("opacity and uniform scale cannot impersonate a Showcase transformation", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    agencyChain: { ...contract.agencyChain, primaryResponseSelector: "#scroll-story" },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/scale-only-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers.join("\n")).toContain("changes only text, opacity, color, filter, or uniform scale");
});

test("desktop-only choreography fails the mobile Showcase equivalent", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    agencyChain: { ...contract.agencyChain, primaryResponseSelector: "#scroll-story" },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/desktop-only-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers.join("\n")).toContain("mobile Showcase equivalent missing");
});

test("text collisions are detected during viewport sampling", async () => {
  const result = await runVisualSmoke(`${base}/collision`, { profile: "recommended" });
  expect(result.blockers.join("\n")).toContain("text collision detected during scroll");
});

test("connected-experience contract is structural and mandatory for Showcase", () => {
  expect(validateMechanisms("showcase", contract)).toEqual([]);
  expect(validateMechanisms("showcase", { ...contract, continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.slice(0, 2) } })).toContain("Showcase requires one meaningful state to affect at least three non-adjacent regions");
  expect(validateMechanisms("recommended")).toEqual([]);
});

test("builder contract has no field for an independent visual verdict", () => {
  expect("independentVisualVerdict" in contract.classification).toBe(false);
});

test("single prototype acceptance and selected reference mode are enforced", () => {
  const unreviewed = { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, prototypeReview: undefined } } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", unreviewed).join("\n")).toContain("explicitly accepted by the user");
  const emptyScout = { ...contract, referenceMode: "scout" as const, referenceMinimum: 2, referenceAdoptions: [] };
  expect(validateMechanisms("showcase", emptyScout).join("\n")).toContain("at least two traceable candidates");
});

test("continuous image motion requires temporal proof or accepted limitation", () => {
  const dishonest = { ...contract, mechanisms: contract.mechanisms.map((item, index) => index === 1 ? { ...item, mediaMode: "image" as const, motionIntent: "continuous-subject" as const, temporalEvidence: "runtime-sampled" as const } : item) };
  expect(validateMechanisms("showcase", dishonest).join("\n")).toContain("frame-analysis evidence or explicit user-accepted limitation");
});

test("prototype fidelity and animation ownership are mandatory contract fields", () => {
  const missingFidelity = { ...contract, prototypeFidelity: undefined } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", missingFidelity).join("\n")).toContain("prototype-to-product fidelity contract");
  const missingOwner = { ...contract, mechanisms: contract.mechanisms.map((item, index) => index === 0 ? { ...item, animationOwner: undefined } : item) } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", missingOwner).join("\n")).toContain("requires one animationOwner");
});

test("conditional prototype parity, semantic motion, and agency are mandatory", () => {
  const strawman = { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, comparisonParity: { ...contract.prototypeEvidence.comparisonParity, bothFinalWorthy: false } } } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", strawman).join("\n")).toContain("genuinely distinct, equally covered second coded prototype");
  const decorative = { ...contract, mechanisms: contract.mechanisms.map((item, index) => index === 0 ? { ...item, decisionConsequence: "" } : item) };
  expect(validateMechanisms("showcase", decorative).join("\n")).toContain("semantic-motion field decisionConsequence");
  const passive = { ...contract, agencyChain: undefined } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", passive).join("\n")).toContain("downstream-decision agency chain");
});

test("Showcase requires external-first focal coverage and full-page prototype continuity", () => {
  const oneAsset = { ...contract, assetCommitments: contract.assetCommitments.slice(0, 1) };
  expect(validateMechanisms("showcase", oneAsset).join("\n")).toContain("hero, peak, and post-peak");
  const proceduralPhysical = {
    ...contract,
    assetCommitments: contract.assetCommitments.map((asset, index) => index === 1
      ? { ...asset, subjectKind: "realistic-physical" as const, productionSource: "procedural" as const, proceduralSuperiorityReason: undefined }
      : asset),
  };
  expect(validateMechanisms("showcase", proceduralPhysical).join("\n")).toContain("artistic-superiority reason");
  const noStoryboard = { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, fullPageContinuityStoryboards: undefined } } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", noStoryboard).join("\n")).toContain("full-page continuity storyboards");
});

test("comparison layouts require stable identity and bounded movement declarations", () => {
  const invalid = { ...contract, comparisonLayouts: [{ selector: "#after", itemSelector: ".box", identityAttribute: "class", strategy: "fixed-grid", reorderMode: "none", maxTravelViewportRatio: 2, maxItemResizeRatio: 3, gapTolerancePx: 60, alignmentTolerancePx: 60 }] } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", invalid).join("\n")).toContain("stable identity");
  expect(validateMechanisms("showcase", { ...contract, comparisonLayouts: [] }).join("\n")).toContain("at least one declared comparison layout");
});

test("asset provenance fields must agree with the observable medium", () => {
  const inconsistent = { ...contract, assetCommitments: contract.assetCommitments.map((asset, index) => index === 1 ? { ...asset, productionSource: "none" as const } : asset) };
  expect(validateMechanisms("showcase", inconsistent).join("\n")).toContain("none states consistent");
  const fakeModel = { ...contract, assetCommitments: contract.assetCommitments.map((asset, index) => index === 1 ? { ...asset, productionSource: "licensed-3d" as const } : asset) };
  expect(validateMechanisms("showcase", fakeModel).join("\n")).toContain("must declare medium 3d");
});

test("storyboards require visible ordered continuity regions and a rendered capture", async () => {
  const dishonest = {
    ...contract,
    prototypeEvidence: {
      ...contract.prototypeEvidence,
      fullPageContinuityStoryboards: {
        ...contract.prototypeEvidence.fullPageContinuityStoryboards,
        bestFit: { ...contract.prototypeEvidence.fullPageContinuityStoryboards.bestFit, postPeakSelector: "#missing-consequence" },
      },
    },
  };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: dishonest });
  expect(result.blockers.join("\n")).toContain("storyboard region #missing-consequence must resolve exactly once");
});

test("comparison smoke measures real gaps and alignment", async () => {
  const result = await runVisualSmoke(`${base}/unstable-comparison`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toMatch(/inconsistent before gaps|before alignment drift/);
});

test("a regular 3×2 comparison grid passes nearest-neighbour geometry", async () => {
  const result = await runVisualSmoke(`${base}/regular-comparison-grid`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toEqual([]);
});

test("a 3×2 grid with one altered gap and alignment fails", async () => {
  const result = await runVisualSmoke(`${base}/broken-comparison-grid`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toMatch(/inconsistent before gaps|before alignment drift/);
});

test("user-required references and assets require explicit rejection approval", () => {
  const rejectedReference = { ...contract, referenceAdoptions: [{ ...contract.referenceAdoptions[0], decision: "reject" as const, requiredBy: "user" as const, rejectionApprovedBy: undefined }] };
  expect(validateMechanisms("showcase", rejectedReference).join("\n")).toContain("user-required reference");
  const rejectedAsset = { ...contract, assetCommitments: [{ ...contract.assetCommitments[0], decision: "reject" as const, requiredBy: "user" as const, medium: "none" as const, rejectionApprovedBy: undefined }] };
  expect(validateMechanisms("showcase", rejectedAsset).join("\n")).toContain("user-required asset");
});

test("agency must use the exercised continuity path", () => {
  const detached = { ...contract, agencyChain: { ...contract.agencyChain, inputSelector: "#after" } };
  expect(validateMechanisms("showcase", detached).join("\n")).toContain("exercised continuity sourceSelector");
});

test("Showcase rejects a Recommended map and unbound intensity-5 peak", async () => {
  const recommended = { ...experienceMap, direction: "recommended" as const };
  const direction = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract, experienceMap: recommended });
  expect(direction.blockers.join("\n")).toContain("direction showcase");
  const unbound = {
    ...experienceMap,
    sections: experienceMap.sections.map((section) => section.id === "peak" ? { ...section, selector: "#not-a-mechanism" } : section),
  };
  const binding = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract, experienceMap: unbound });
  expect(binding.blockers.join("\n")).toContain("is not bound to a verified Showcase mechanism");
});

test("a journey requires scroll-authored choreography", () => {
  expect(validateMechanisms("showcase", { ...contract, experienceType: "journey" })).toContain("A Showcase journey requires at least one substantial scroll-authored mechanism");
});

test("a journey cannot use lightweight hover as its post-peak mechanism", () => {
  const journey = { ...contract, experienceType: "journey" as const, mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, trigger: "scroll" as const } : item.stage === "after" ? { ...item, trigger: "hover" as const, stateCount: 2 } : item) };
  expect(validateMechanisms("showcase", journey)).toContain("A Showcase journey cannot use hover alone as its post-peak mechanism");
});

test("Northwind v1 isolated-widget contract is rejected as an adversarial regression", () => {
  const northwind = { ...contract, version: 1 } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", northwind)).toContain("Showcase requires a version 2 connected-experience contract; legacy three-widget contracts are rejected");
});

test("valid v2 claims cannot hide Northwind-style isolated widgets", async () => {
  const result = await runVisualSmoke(`${base}/isolated-widgets`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through peak regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through after regions from #before");
});

test("invisible data attributes cannot impersonate visible continuity", async () => {
  const result = await runVisualSmoke(`${base}/data-only-continuity`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through before regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through peak regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through after regions from #before");
});

test("scrolling the source into view cannot impersonate continuity", async () => {
  const twoState = { ...contract, continuity: { ...contract.continuity, stateCount: 2 } };
  const result = await runVisualSmoke(`${base}/scroll-only-continuity`, { profile: "showcase", showcase: twoState });
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through before regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through peak regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through after regions from #before");
});

test("hidden descendant text cannot impersonate visible continuity", async () => {
  const result = await runVisualSmoke(`${base}/hidden-text-continuity`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through before regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through peak regions from #before");
  expect(result.blockers).toContain("Showcase shared state readiness did not propagate through after regions from #before");
});

test("tiny or viewport-inappropriate captures are rejected", async () => {
  const captures = { desktop: `${base}/capture/tiny-desktop.svg`, mobile: `${base}/capture/tiny-mobile.svg` };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, bestFitCaptures: captures } } });
  expect(result.blockers.join("\n")).toContain("must be a desktop-like image");
  expect(result.blockers.join("\n")).toContain("must be a mobile-like image");
});

test("prototype motion recordings are executable required evidence", async () => {
  const missing = { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, bestFitRecordings: { desktop: "", mobile: `${base}/missing-recording.mp4` } } };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: missing });
  expect(result.blockers.join("\n")).toContain("desktop/mobile captures and motion recordings");
});

test("desktop and mobile prototype recordings must be distinct", async () => {
  const same = `${base}/recording/bounded-desktop.mp4`;
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, bestFitRecordings: { desktop: same, mobile: same } } } });
  expect(result.blockers.join("\n")).toContain("best-fit desktop and mobile recordings must be different files");
});

test("aria-hidden decoration cannot satisfy primary transformation salience", async () => {
  const result = await runVisualSmoke(`${base}/decorative-primary`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toContain("primary subject process instrument is aria-hidden decoration");
});

test("nonexistent continuity selectors and prototype evidence fail browser verification", async () => {
  const dishonest = {
    ...contract,
    prototypeEvidence: { ...contract.prototypeEvidence, bestFitArtifact: "/missing-prototype", bestFitCaptures: { ...contract.prototypeEvidence.bestFitCaptures, desktop: `${base}/missing-capture.webp` } },
    continuity: { ...contract.continuity, sourceSelector: "#missing-source", affectedRegions: contract.continuity.affectedRegions.map((region) => ({ ...region, selector: `${region.selector}-missing` })) },
    agencyChain: { ...contract.agencyChain, inputSelector: "#missing-source", primaryResponseSelector: "#peak-missing", downstreamSelector: "#after-missing" },
  };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: dishonest });
  expect(result.blockers.join("\n")).toContain("prototype artifact did not load successfully");
  expect(result.blockers.join("\n")).toContain("capture is not a loadable image");
  expect(result.blockers.join("\n")).toContain("continuity source #missing-source must resolve to exactly one element");
});

test("malformed contract content fails closed instead of throwing", () => {
  const malformed = { ...contract, showcaseDelta: [1, null], mechanisms: [null] } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", malformed)).toContain("Showcase contract requires at least two perceptible differences from Recommended");
});

for (const [path, expected] of [
  ["sticky", "sticky clipping risk"],
  ["empty", "near-empty viewport"],
  ["broken", "returned HTTP 404"],
  ["fallback", "200 SPA fallback"],
] as const) test(`${path} fixture is blocked`, async () => {
  const result = await runVisualSmoke(`${base}/${path}`, { profile: "recommended" });
  expect(result.ok).toBe(false);
  expect(result.blockers.join("\n")).toContain(expected);
});

test("a transform-driven long section without an ID is recognised", async () => {
  const result = await runVisualSmoke(`${base}/no-id-transform`, { profile: "recommended" });
  expect(result.blockers.filter((item) => item.includes("long region"))).toEqual([]);
});

for (const [path, expected] of [
  ["console", "console: fixture exploded"],
  ["asset", "asset HTTP 404"],
  ["reduced-overflow", "mobile-390-reduced: document is"],
] as const) test(`${path} context failure is blocked`, async () => {
  const result = await runVisualSmoke(`${base}/${path}`, { profile: "efficient" });
  expect(result.blockers.join("\n")).toContain(expected);
});
