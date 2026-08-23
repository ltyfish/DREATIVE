import { test, expect } from "@playwright/test";
import { runVisualSmoke, validateMechanisms, type ShowcaseMechanismContract } from "./visualSmoke.js";

const base = "http://127.0.0.1:4181";

const contract: ShowcaseMechanismContract = {
  version: 3,
  experienceType: "interface",
  signature: {
    name: "Readiness instrument",
    selector: "#peak",
    productSubjectSelector: "svg",
    productSubject: "readiness instrument",
    whyOnlyThisProduct: "The instrument reads this product's own readiness scale; no competitor publishes it.",
  },
  referenceMode: "none",
  referenceAdoptions: [],
  assetCommitments: [
    { role: "Peak subject", decision: "use", targetSelector: "#peak svg", medium: "svg", sourceKind: "inline", sourceRef: "#peak svg", rights: "authored in repository", mobileFallback: "static compact instrument" },
  ],
  continuity: {
    mode: "shared-state",
    stateKey: "readiness",
    sourceSelector: "#before",
    sourceTrigger: "click",
    stateCount: 3,
    affectedRegions: [
      { selector: "#before", stage: "before", effect: "The control states the current readiness." },
      { selector: "#peak", stage: "peak", effect: "The instrument moves to the selected readiness." },
      { selector: "#after", stage: "after", effect: "The recommendation changes with readiness." },
    ],
  },
  mechanisms: [
    { name: "instrument-before", stage: "before", selector: "#before", primarySelector: ".box", primarySubject: "readiness control", trigger: "click", mediaMode: "dom-state", mobileTransformation: "stacked control", visibleChange: "The control block shifts to the selected stage.", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 2 },
    { name: "instrument-peak", stage: "peak", selector: "#peak", primarySelector: "svg", primarySubject: "readiness instrument", trigger: "click", mediaMode: "svg", mobileTransformation: "compact instrument", visibleChange: "The instrument redraws at the selected readiness.", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 2 },
    { name: "instrument-after", stage: "after", selector: "#after", primarySelector: ".product-a", primarySubject: "recommended product", trigger: "click", mediaMode: "spatial-layout", mobileTransformation: "single-column recommendation", visibleChange: "The recommended product changes position.", animationOwner: "native-js", ownedProperties: ["transform"], stateCount: 2 },
  ],
};

const scrollJourney: ShowcaseMechanismContract = {
  ...contract,
  experienceType: "journey",
  signature: { ...contract.signature, selector: "#scroll-story", productSubjectSelector: ".box", productSubject: "scrolling process block" },
  assetCommitments: [],
  continuity: {
    ...contract.continuity,
    affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#scroll-story" } : region),
  },
  mechanisms: contract.mechanisms.map((item) => item.stage === "peak"
    ? { ...item, selector: "#scroll-story", primarySelector: ".box", primarySubject: "scrolling process block", trigger: "scroll" as const, mediaMode: "dom-state" as const, stateCount: 3 }
    : item),
};

test("a healthy Showcase route passes every browser-measured check", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract });
  expect(result.blockers).toEqual([]);
});

// Motion is recorded and never blocked. A count of moving regions is not a defect
// reading — it rises with a uniform fade over every section and falls for one authored
// sequence — and as a gate it bought exactly the cheapest pass: add a reveal, clear the
// floor, leave the material alone, and spend a fix-and-recheck cycle doing it.
test("a route where nothing moves records the count and blocks nothing", async () => {
  const result = await runVisualSmoke(`${base}/static-route`, { profile: "recommended" });
  expect(result.checks.join("\n")).toContain("regions change state on approach");
  expect(result.blockers.join("\n")).not.toContain("nothing on this route moves");
  expect(result.advisories.join("\n")).not.toContain("motion");
});

test("a route with no <main> is still sampled rather than silently exempted", async () => {
  const result = await runVisualSmoke(`${base}/mainless`, { profile: "recommended" });
  expect(result.checks.join("\n")).not.toContain("motion: 0 of 0 regions");
});

test("a route that cannot be sampled says so in the checks instead of blocking", async () => {
  const result = await runVisualSmoke(`${base}/unsamplable`, { profile: "recommended" });
  expect(result.checks.join("\n")).toContain("motion: not sampled");
  expect(result.blockers.join("\n")).not.toContain("could not be measured");
});

test("Efficient records no motion line at all", async () => {
  const result = await runVisualSmoke(`${base}/static-route`, { profile: "efficient" });
  expect(result.blockers).toEqual([]);
  expect(result.checks.join("\n")).not.toContain("regions change state on approach");
});

test("motion breadth is not measured at all: no ratio blocks or advises", async () => {
  const result = await runVisualSmoke(`${base}/flat-route`, { profile: "recommended" });
  expect(result.blockers.join("\n")).not.toContain("change on approach");
  expect(result.advisories.join("\n")).not.toContain("change on approach");
});

// The one motion reading that survives as a blocker: a reveal that resolves only after
// the reader has scrolled past is broken the way a missing image is broken.
test("a late reveal still blocks", async () => {
  const result = await runVisualSmoke(`${base}/late-reveal`, { profile: "recommended" });
  expect(result.blockers.join("\n")).toContain("after the reader has scrolled past");
});

test("reveals that fire after the section has left the viewport are blocked", async () => {
  const result = await runVisualSmoke(`${base}/late-reveal`, { profile: "recommended" });
  expect(result.blockers.join("\n")).toContain("reveals fire after the reader has scrolled past them");
  expect((await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract })).blockers.join("\n"))
    .not.toContain("reveals fire after the reader has scrolled past them");
});

test("a route whose controls have no hover or focus state fails every profile", async () => {
  for (const profile of ["efficient", "recommended", "showcase"] as const) {
    const result = await runVisualSmoke(`${base}/no-affordance`, { profile, showcase: profile === "showcase" ? contract : undefined });
    expect(result.blockers.join("\n")).toContain("no interaction baseline");
  }
});

// Density and scannability were advisories with invented thresholds. They never
// stopped the cramming they were written for, and eighteen blind pairs showed no
// benefit from the tier, so nothing measures either one now.
test("an overloaded section is not measured", async () => {
  const result = await runVisualSmoke(`${base}/cramped`, { profile: "recommended" });
  expect(result.advisories.join("\n")).not.toContain("competing statistic blocks");
  expect(result.blockers.join("\n")).not.toContain("competing statistic blocks");
});

test("a signature component with no product media is neither advised nor blocked", async () => {
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: contract });
  expect(result.advisories.join("\n")).not.toContain("confirm the component is about");
  expect(result.blockers).toEqual([]);
});

test("the signature component must name a product subject that actually renders", () => {
  const unbound = { ...contract, signature: { ...contract.signature, productSubjectSelector: "" } };
  expect(validateMechanisms("showcase", unbound).join("\n")).toContain("the product subject it operates on");
});

test("an unscannable wall of prose is not measured", async () => {
  const result = await runVisualSmoke(`${base}/prose-wall`, { profile: "recommended" });
  expect(result.advisories.join("\n")).not.toContain("scannable breaks");
  expect(result.blockers.join("\n")).not.toContain("scannable breaks");
});

test("a missing or token signature component blocks Showcase", async () => {
  const missing = { ...contract, signature: { ...contract.signature, selector: "#nowhere" } };
  expect((await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: missing })).blockers.join("\n"))
    .toContain("signature component Readiness instrument selector #nowhere must resolve");
  // Size is not measured in either direction. A small component can still be the
  // thing you remember, and a viewport-area number is arrangeable.
  const tiny = { ...contract, signature: { ...contract.signature, selector: "#peak svg", productSubjectSelector: "rect" } };
  const tinyResult = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: tiny });
  expect(tinyResult.advisories.join("\n")).not.toContain("of the viewport");
  expect(tinyResult.blockers.join("\n")).not.toContain("of the viewport");
});

test("a decorative element cannot be declared the primary product subject", async () => {
  const result = await runVisualSmoke(`${base}/decorative-primary`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toContain("is aria-hidden decoration");
});

test("a declared medium must actually be present in its region", async () => {
  const lying = { ...contract, signature: { ...contract.signature, selector: "#lying-peak" }, assetCommitments: [], continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.map((region) => region.stage === "peak" ? { ...region, selector: "#lying-peak" } : region) }, mechanisms: contract.mechanisms.map((item) => item.stage === "peak" ? { ...item, selector: "#lying-peak", primarySelector: ".box" } : item) };
  const result = await runVisualSmoke(`${base}/lying-media`, { profile: "showcase", showcase: lying });
  expect(result.blockers.join("\n")).toContain("declares svg but its region contains no matching visible medium");
});

test("independent widgets do not satisfy shared-state continuity", async () => {
  const result = await runVisualSmoke(`${base}/isolated-widgets`, { profile: "showcase", showcase: contract });
  expect(result.blockers.join("\n")).toContain("did not propagate");
});

test("invisible data attributes and hidden text do not satisfy continuity", async () => {
  for (const route of ["/data-only-continuity", "/hidden-text-continuity"]) {
    const result = await runVisualSmoke(`${base}${route}`, { profile: "showcase", showcase: contract });
    expect(result.blockers.join("\n")).toContain("did not propagate");
  }
});

test("a tall static section cannot impersonate scroll-authored choreography", async () => {
  const result = await runVisualSmoke(`${base}/static-scroll-mechanism`, { profile: "showcase", showcase: scrollJourney });
  expect(result.blockers.join("\n")).toContain("produced no observable state change across the region");
});

test("a real scroll mechanism passes without dwell, reversal, or structural-transform demands", async () => {
  const result = await runVisualSmoke(`${base}/scroll-mechanism`, { profile: "showcase", showcase: scrollJourney });
  expect(result.blockers).toEqual([]);
});

test("desktop-only choreography fails the mobile Showcase equivalent", async () => {
  const result = await runVisualSmoke(`${base}/desktop-only-scroll-mechanism`, { profile: "showcase", showcase: scrollJourney });
  expect(result.blockers.join("\n")).toContain("mobile Showcase equivalent missing");
});

test("a comparison whose items render identically is reported as repeated cards", async () => {
  const comparison = {
    selector: "#after",
    itemSelector: ".box",
    identityAttribute: "data-product",
    identityChannels: [{ channel: "product colour", selector: "$self", uniqueProperty: "background-color" as const }],
  };
  const distinct = await runVisualSmoke(`${base}/regular-comparison-grid`, { profile: "showcase", showcase: { ...contract, comparison } });
  expect(distinct.blockers.join("\n")).not.toContain("repeated cards");
  const identical = await runVisualSmoke(`${base}/identical-comparison-grid`, { profile: "showcase", showcase: { ...contract, comparison } });
  expect(identical.blockers.join("\n")).toContain("reads as repeated cards");
});

test("layout, readability, and runtime failures still block any profile", async () => {
  expect((await runVisualSmoke(`${base}/collision`, { profile: "recommended" })).blockers.join("\n")).toContain("text collision detected during scroll");
  expect((await runVisualSmoke(`${base}/sticky`, { profile: "recommended" })).blockers.join("\n")).toContain("sticky clipping risk");
  expect((await runVisualSmoke(`${base}/empty`, { profile: "recommended" })).blockers.join("\n")).toContain("consecutive near-empty viewport samples");
  expect((await runVisualSmoke(`${base}/console`, { profile: "efficient" })).blockers.join("\n")).toContain("fixture exploded");
  expect((await runVisualSmoke(`${base}/asset`, { profile: "efficient" })).blockers.join("\n")).toContain("asset HTTP 404");
  expect((await runVisualSmoke(`${base}/broken`, { profile: "efficient" })).blockers.join("\n")).toContain("returned HTTP 404");
  expect((await runVisualSmoke(`${base}/fallback`, { profile: "efficient" })).blockers.join("\n")).toContain("indistinguishable 200 SPA fallback");
  expect((await runVisualSmoke(`${base}/reduced-overflow`, { profile: "efficient" })).blockers.join("\n")).toContain("wider than its viewport");
});

test("the Showcase contract is structural and only Showcase requires one", () => {
  expect(validateMechanisms("showcase", contract)).toEqual([]);
  expect(validateMechanisms("recommended")).toEqual([]);
  expect(validateMechanisms("showcase")).toEqual(["Showcase requires a version 3 connected-experience contract"]);
  expect(validateMechanisms("showcase", { ...contract, continuity: { ...contract.continuity, affectedRegions: contract.continuity.affectedRegions.slice(0, 2) } }).join("\n"))
    .toContain("continuity must span at least three regions");
});

test("the contract demands a signature component and cannot self-certify a verdict", () => {
  const unsigned = { ...contract, signature: undefined } as unknown as ShowcaseMechanismContract;
  expect(validateMechanisms("showcase", unsigned).join("\n")).toContain("requires one signature component");
  for (const field of ["classification", "prototypeEvidence", "prototypeFidelity", "productionFeasibility"])
    expect(field in contract).toBe(false);
});

test("a scout reference mode still needs traceable candidates", () => {
  expect(validateMechanisms("showcase", { ...contract, referenceMode: "scout", referenceAdoptions: [] }).join("\n"))
    .toContain("at least two traceable candidates");
});

test("a reference or asset source that does not resolve blocks the build", async () => {
  const bogus = {
    ...contract,
    referenceMode: "supplied" as const,
    referenceAdoptions: [{ source: "Missing board", sourceRef: "does/not/exist.png", rights: "unknown", principle: "Rhythm", decision: "reject" as const }],
  };
  const result = await runVisualSmoke(`${base}/`, { profile: "showcase", showcase: bogus });
  expect(result.blockers.join("\n")).toContain("reference source does not exist");
});
