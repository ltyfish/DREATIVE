import { test, expect } from "@playwright/test";
import { runVisualSmoke, validateMechanisms, type ShowcaseMechanismContract } from "./visualSmoke.js";
import type { ExperienceMap } from "../shared/experienceMap.js";

const base = "http://127.0.0.1:4181";
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
  prototypeEvidence: {
    boundedApproach: "Independent DOM controls.",
    higherCeilingApproach: "Connected SVG and spatial state system.",
    selectedApproach: "Connected SVG and spatial state system.",
    selectedBy: "user",
    boundedArtifact: "/prototype/bounded",
    higherCeilingArtifact: "/prototype/high-ceiling",
    boundedCaptures: { desktop: `${base}/capture/bounded-desktop.svg`, mobile: `${base}/capture/bounded-mobile.svg` },
    higherCeilingCaptures: { desktop: `${base}/capture/high-ceiling-desktop.svg`, mobile: `${base}/capture/high-ceiling-mobile.svg` },
    boundedRecordings: { desktop: `${base}/recording/bounded-desktop.mp4`, mobile: `${base}/recording/bounded-mobile.mp4` },
    higherCeilingRecordings: { desktop: `${base}/recording/high-ceiling-desktop.mp4`, mobile: `${base}/recording/high-ceiling-mobile.mp4` },
    builderSelectionRationale: "The connected system made the state transition visibly legible; this is a builder assertion, not an independent verdict.",
  },
  prototypeFidelity: {
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
  mechanisms: [
    { name: "readiness-control", stage: "before", selector: "#before", primarySelector: ".box", primarySubject: "readiness indicator", trigger: "click", experienceRole: "opens", ceilingContribution: "introduces tactile state", mediaMode: "dom-state", continuityConnection: "shared control state", mobileTransformation: "direct tap", recommendedDifference: "begins the connected instrument", meaningfulOutcome: "reveals increasing product readiness", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3 },
    { name: "instrument-peak", stage: "peak", selector: "#peak", primarySelector: "svg", primarySubject: "process instrument", trigger: "click", experienceRole: "transforms", ceilingContribution: "changes visual medium", mediaMode: "svg", continuityConnection: "shared control state", mobileTransformation: "bounded SVG", recommendedDifference: "creates the central visual transformation", meaningfulOutcome: "moves the product through three visible process stages", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3 },
    { name: "decision-resolution", stage: "after", selector: "#after", primarySelector: ".box:first-of-type", primarySubject: "decision layout", trigger: "click", experienceRole: "resolves", ceilingContribution: "closes the state arc", mediaMode: "spatial-layout", continuityConnection: "shared control state", mobileTransformation: "stacked resolution", recommendedDifference: "resolves the connected instrument", meaningfulOutcome: "recomposes the result into three decision states", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 3 },
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
    { id: "before", title: "Before", role: "orient", intensity: 3, inputState: "default", startState: "idle", endState: "ready", mechanismOwner: "native-js", connection: "feeds peak", desktop: "direct control", mobile: "direct tap", reducedMotion: "instant", evidenceTarget: "selected state" },
    { id: "peak", title: "Peak", role: "transform", intensity: 5, inputState: "ready", startState: "bounded", endState: "transformed", mechanismOwner: "native-js", connection: "feeds decision", desktop: "instrument", mobile: "bounded instrument", reducedMotion: "instant", evidenceTarget: "three states", selector: "#peak", trigger: "click", ownedProperties: ["transform"], meaningfulOutcome: "moves through three process states" },
    { id: "after", title: "After", role: "resolve", intensity: 3, inputState: "transformed", startState: "open", endState: "decided", mechanismOwner: "native-js", connection: "closes journey", desktop: "decision", mobile: "stacked", reducedMotion: "instant", evidenceTarget: "decision state" },
  ],
};

test("healthy responsive fixture and three real mechanisms pass", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract, experienceMap });
  expect(result.blockers).toEqual([]);
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
    prototypeFidelity: { ...contract.prototypeFidelity, integratedSubjectSelector: "#scroll-story .box" },
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
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

test("prototype fidelity and animation ownership are mandatory contract fields", () => {
  const missingFidelity = { ...contract, prototypeFidelity: undefined } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", missingFidelity).join("\n")).toContain("prototype-to-product fidelity contract");
  const missingOwner = { ...contract, mechanisms: contract.mechanisms.map((item, index) => index === 0 ? { ...item, animationOwner: undefined } : item) } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", missingOwner).join("\n")).toContain("requires one animationOwner");
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
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, boundedCaptures: captures } } });
  expect(result.blockers.join("\n")).toContain("must be a desktop-like image");
  expect(result.blockers.join("\n")).toContain("must be a mobile-like image");
});

test("prototype motion recordings are executable required evidence", async () => {
  const missing = { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, boundedRecordings: { desktop: "", mobile: `${base}/missing-recording.mp4` } } };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: missing });
  expect(result.blockers.join("\n")).toContain("desktop/mobile captures and motion recordings");
});

test("desktop and mobile prototype recordings must be distinct", async () => {
  const same = `${base}/recording/bounded-desktop.mp4`;
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: { ...contract, prototypeEvidence: { ...contract.prototypeEvidence, boundedRecordings: { desktop: same, mobile: same } } } });
  expect(result.blockers.join("\n")).toContain("bounded desktop and mobile recordings must be different files");
});

test("aria-hidden decoration cannot satisfy primary transformation salience", async () => {
  const result = await runVisualSmoke(`${base}/decorative-primary`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toContain("primary subject process instrument is aria-hidden decoration");
});

test("nonexistent continuity selectors and prototype evidence fail browser verification", async () => {
  const dishonest = {
    ...contract,
    prototypeEvidence: { ...contract.prototypeEvidence, boundedArtifact: "/missing-prototype", boundedCaptures: { ...contract.prototypeEvidence.boundedCaptures, desktop: `${base}/missing-capture.webp` } },
    continuity: { ...contract.continuity, sourceSelector: "#missing-source", affectedRegions: contract.continuity.affectedRegions.map((region) => ({ ...region, selector: `${region.selector}-missing` })) },
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
