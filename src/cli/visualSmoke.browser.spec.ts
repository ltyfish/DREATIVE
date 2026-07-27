import { test, expect } from "@playwright/test";
import { runVisualSmoke, validateMechanisms, type ShowcaseMechanismContract } from "./visualSmoke.js";

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
    boundedArtifact: "/prototype/bounded",
    higherCeilingArtifact: "/prototype/high-ceiling",
    boundedCaptures: { desktop: `${base}/capture/bounded-desktop.svg`, mobile: `${base}/capture/bounded-mobile.svg` },
    higherCeilingCaptures: { desktop: `${base}/capture/high-ceiling-desktop.svg`, mobile: `${base}/capture/high-ceiling-mobile.svg` },
    builderSelectionRationale: "The connected system made the state transition visibly legible; this is a builder assertion, not an independent verdict.",
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
    { name: "readiness-control", stage: "before", selector: "#before", trigger: "click", experienceRole: "opens", ceilingContribution: "introduces tactile state", mediaMode: "dom-state", continuityConnection: "shared control state", mobileTransformation: "direct tap", recommendedDifference: "begins the connected instrument", meaningfulOutcome: "reveals increasing product readiness", stateCount: 3 },
    { name: "instrument-peak", stage: "peak", selector: "#peak", trigger: "click", experienceRole: "transforms", ceilingContribution: "changes visual medium", mediaMode: "svg", continuityConnection: "shared control state", mobileTransformation: "bounded SVG", recommendedDifference: "creates the central visual transformation", meaningfulOutcome: "moves the product through three visible process stages", stateCount: 3 },
    { name: "decision-resolution", stage: "after", selector: "#after", trigger: "click", experienceRole: "resolves", ceilingContribution: "closes the state arc", mediaMode: "spatial-layout", continuityConnection: "shared control state", mobileTransformation: "stacked resolution", recommendedDifference: "resolves the connected instrument", meaningfulOutcome: "recomposes the result into three decision states", stateCount: 3 },
  ],
};

test("healthy responsive fixture and three real mechanisms pass", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toEqual([]);
});

test("declared media must exist in the mechanism region", async () => {
  const dishonest = { ...contract, mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#lying-peak" } : item) };
  const result = await runVisualSmoke(`${base}/lying-media`, { profile: "showcase", showcase: dishonest });
  expect(result.blockers).toContain("instrument-peak mechanism declares svg but its region contains no matching visible medium");
});

test("scroll-authored mechanisms must expose at least three sampled states", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toEqual([]);
});

test("a tall static section cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("instrument-peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("static sticky elements cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-sticky-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("instrument-peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("opacity and uniform scale cannot impersonate a Showcase transformation", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/scale-only-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers.join("\n")).toContain("changes only text, opacity, color, filter, or uniform scale");
});

test("desktop-only choreography fails the mobile Showcase equivalent", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region) },
    mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
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
