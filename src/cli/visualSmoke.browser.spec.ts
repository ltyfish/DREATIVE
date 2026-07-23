import { test, expect } from "@playwright/test";
import { runVisualSmoke, validateMechanisms, type ShowcaseMechanismContract } from "./visualSmoke.js";

const base = "http://127.0.0.1:4181";
const contract: ShowcaseMechanismContract = {
  version: 1,
  experienceType: "interface",
  recommendedBaseline: "Three direct state controls in an otherwise conventional page.",
  showcaseDelta: ["The controls form one continuous instrument.", "The peak changes the spatial composition."],
  mediaOpportunities: [
    { opportunity: "Product photography", decision: "reject", rationale: "The fixture has no product subject." },
    { opportunity: "Custom SVG instrument", decision: "use", rationale: "It supplies the peak visual mode." },
  ],
  prototypeComparison: {
    boundedApproach: "Independent DOM controls.",
    higherCeilingApproach: "Connected SVG and spatial state system.",
    selectedApproach: "Connected SVG and spatial state system.",
    observedDecision: "The connected system made the state transition visibly legible.",
  },
  mechanisms: [
    { name: "before", selector: "#before", trigger: "click", experienceRole: "opens", ceilingContribution: "introduces tactile state", mediaMode: "dom-state", continuityConnection: "shared control state", mobileTransformation: "direct tap", recommendedDifference: "begins the connected instrument", meaningfulOutcome: "reveals increasing product readiness", stateCount: 3 },
    { name: "peak", selector: "#peak", trigger: "click", experienceRole: "transforms", ceilingContribution: "changes visual medium", mediaMode: "svg", continuityConnection: "shared control state", mobileTransformation: "bounded SVG", recommendedDifference: "creates the central visual transformation", meaningfulOutcome: "moves the product through three visible process stages", stateCount: 3 },
    { name: "after", selector: "#after", trigger: "click", experienceRole: "resolves", ceilingContribution: "closes the state arc", mediaMode: "spatial-layout", continuityConnection: "shared control state", mobileTransformation: "stacked resolution", recommendedDifference: "resolves the connected instrument", meaningfulOutcome: "recomposes the result into three decision states", stateCount: 3 },
  ],
};

test("healthy responsive fixture and three real mechanisms pass", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toEqual([]);
});

test("declared media must exist in the mechanism region", async () => {
  const dishonest = { ...contract, mechanisms: contract.mechanisms.map((item) => item.name === "peak" ? { ...item, selector: "#lying-peak" } : item) };
  const result = await runVisualSmoke(`${base}/lying-media`, { profile: "showcase", showcase: dishonest });
  expect(result.blockers).toContain("peak mechanism declares svg but its region contains no matching visible medium");
});

test("scroll-authored mechanisms must expose at least three sampled states", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    mechanisms: contract.mechanisms.map((item) => item.name === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toEqual([]);
});

test("a tall static section cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    mechanisms: contract.mechanisms.map((item) => item.name === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("static sticky elements cannot impersonate scroll-authored choreography", async () => {
  const journey = {
    ...contract,
    experienceType: "journey" as const,
    mechanisms: contract.mechanisms.map((item) => item.name === "peak" ? { ...item, selector: "#scroll-story", trigger: "scroll" as const, mediaMode: "dom-state" as const } : item),
  };
  const result = await runVisualSmoke(`${base}/static-sticky-scroll-mechanism`, { profile: "showcase", showcase: journey });
  expect(result.blockers).toContain("peak scroll mechanism #scroll-story produced 1 distinct states; 3 are declared");
});

test("mechanism contract is structural and mandatory for Showcase", () => {
  expect(validateMechanisms("showcase", contract)).toEqual([]);
  expect(validateMechanisms("showcase", { ...contract, mechanisms: contract.mechanisms.slice(0, 2) })).toContain("Showcase mechanism contract is missing after");
  expect(validateMechanisms("recommended")).toEqual([]);
});

test("three same-class widgets cannot satisfy Showcase", () => {
  const sameClass = { ...contract, mechanisms: contract.mechanisms.map((item) => ({ ...item, mediaMode: "dom-state" as const })) };
  expect(validateMechanisms("showcase", sameClass)).toContain("Showcase mechanisms must use at least two perceptibly different media modes");
});

test("a journey requires scroll-authored choreography", () => {
  expect(validateMechanisms("showcase", { ...contract, experienceType: "journey" })).toContain("A Showcase journey requires at least one substantial scroll-authored mechanism");
});

test("a journey cannot use lightweight hover as its post-peak mechanism", () => {
  const journey = { ...contract, experienceType: "journey" as const, mechanisms: contract.mechanisms.map((item) => item.name === "peak" ? { ...item, trigger: "scroll" as const } : item.name === "after" ? { ...item, trigger: "hover" as const, stateCount: 2 } : item) };
  expect(validateMechanisms("showcase", journey)).toContain("A Showcase journey cannot use hover alone as its post-peak mechanism");
});

test("Showcase requires depth beyond three binary effects", () => {
  const shallow = { ...contract, mechanisms: contract.mechanisms.map((item) => ({ ...item, stateCount: 2 })) };
  expect(validateMechanisms("showcase", shallow)).toContain("Showcase requires at least two multi-stage or directly manipulated mechanisms");
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
