import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CREATIVE_EXEMPLARS, CREATIVE_MECHANISMS, CREATIVE_PRIMITIVES, PACKAGE_PROFILES,
  allocateTreatmentHierarchy, renderAgentCatalogue, resolveCreativeStack, searchCreativeCatalog, validateCreativeCatalog,
  validateCreativeDelivery, validateExternalReference,
} from "./creativeCatalog.js";

test("creative catalogue is linked, unique, risk-aware and substantially broader than category doctrine", () => {
  assert.equal(validateCreativeCatalog().join("\n"), "");
  assert.ok(CREATIVE_MECHANISMS.length >= 100);
  assert.equal(new Set(CREATIVE_MECHANISMS.map((item) => item.id)).size, CREATIVE_MECHANISMS.length);
  assert.ok(PACKAGE_PROFILES.length >= 26);
  assert.equal(CREATIVE_PRIMITIVES.length, 16);
  assert.ok(CREATIVE_EXEMPLARS.length >= 10);
  for (const item of CREATIVE_MECHANISMS) {
    assert.ok(item.suitableAmbitions.length && item.suitableTreatments.length);
    assert.ok(item.semanticFallback && item.reducedMotionStrategy && item.mobileTranslation);
    assert.ok(item.requiredEvidence.length && item.references.every((reference) => reference.license));
  }
});

test("natural-language catalogue lookup maps ambitious phrases to executable records", () => {
  assert.equal(searchCreativeCatalog("image tornado")[0].id, "image-tornado");
  assert.equal(searchCreativeCatalog("photo reconstruction")[0].id, "image-reconstruction");
  assert.equal(searchCreativeCatalog("persistent product across sections")[0].id, "section-to-section-persistent-object");
  assert.match(renderAgentCatalogue("velocity distortion"), /dreative-velocity-material/);
});

test("resolver keeps native scroll by default and selects GSAP or Lenis only from mechanisms", () => {
  const simple = resolveCreativeStack(["grain"], { installationAllowed: true });
  assert.equal(simple.scrollOwner, "native"); assert.equal(simple.timelineEngine, "native");
  const pinned = resolveCreativeStack(["pinned-narrative-chapter"], { installationAllowed: true });
  assert.equal(pinned.scrollOwner, "native"); assert.equal(pinned.timelineEngine, "gsap");
  const velocity = resolveCreativeStack(["velocity-reactive-scene"], { installationAllowed: true });
  assert.equal(velocity.scrollOwner, "lenis"); assert.ok(velocity.packageProfiles.some((item) => item.id === "gsap-scrolltrigger"));
});

test("Remotion is capability-gated and package failure yields an explicit fallback", () => {
  const gated = resolveCreativeStack(["remotion-rendered-sequence"], { installationAllowed: true, capabilities: [] });
  assert.ok(gated.blockers.some((item) => /renderer/.test(item)));
  const denied = resolveCreativeStack(["scroll-controlled-frame-sequence"], { installationAllowed: false });
  assert.equal(denied.installCommands.length, 0); assert.ok(denied.fallbacks.length);
});

test("external references require licensing truth and at least three transformations", () => {
  const errors = validateExternalReference({
    source: "React Bits", sourceType: "repository", mechanism: "gallery", principleExtracted: "spatial selection",
    projectSpecificUse: "product archive", brandSpecificTransformation: "editorial monochrome system", plannedDifferences: ["composition"], packages: [],
    license: "verify-current", attributionRequired: true, performanceRisk: "medium", accessibilityRisk: "medium", originalityRisk: "high", transformations: ["content", "assets"],
  });
  assert.ok(errors.some((item) => /three dimensions/.test(item)));
});

test("delivery rejects React Bits-style component soup, hero-only/fade-only motion and unused advanced dependencies", () => {
  const findings = validateCreativeDelivery({ ambition: "award", heroSection: "hero", sectionMechanisms: [{ section: "hero", mechanisms: ["a", "b", "c", "d"], role: "peak" }],
    motionVocabulary: ["fade-up", "opacity"], installedAdvancedPackages: ["gsap", "three"], usedAdvancedPackages: ["gsap"], externalReferences: [] });
  assert.ok(findings.some((item) => /hero-only/.test(item)));
  assert.ok(findings.some((item) => /fade-only/.test(item)));
  assert.ok(findings.some((item) => /component soup/.test(item)));
  assert.ok(findings.some((item) => /unused: three/.test(item)));
});

test("React Bits remains a reference and is never a distributable package profile", () => {
  assert.equal(PACKAGE_PROFILES.some((item) => /react-bits/i.test(item.packageName)), false);
  assert.ok(CREATIVE_MECHANISMS.every((item) => item.references.some((reference) => /react-bits/.test(reference.source))));
  const rejected = validateExternalReference({ source: "react-bits", sourceType: "repository", mechanism: "gallery", principleExtracted: "spatial selection", projectSpecificUse: "archive", brandSpecificTransformation: "project composition", plannedDifferences: ["all visuals"], packages: [], license: "verified", attributionRequired: true, performanceRisk: "medium", accessibilityRisk: "medium", originalityRisk: "high", transformations: ["content", "composition", "motion"], redistributedWithDreative: true });
  assert.ok(rejected.some((item) => /must not be redistributed/.test(item)));
});

test("every registry recipe file and heading exists and the catalogue schema parses", () => {
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "skill", "dreative", "schemas", "creative-catalog.schema.json"), "utf8"));
  for (const item of CREATIVE_MECHANISMS) {
    const [relative, anchor] = item.recipe.split("#");
    const content = fs.readFileSync(path.join(process.cwd(), "skill", "dreative", relative), "utf8");
    assert.match(content.toLowerCase(), new RegExp(`^## ${anchor.replace(/-/g, "[ -]")}$`, "m"), item.id);
  }
});

test("all treatments are allocated through hierarchy and explicit tension resolution", () => {
  const selected = ["ux", "mobile", "refined", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"] as const;
  const hierarchy = allocateTreatmentHierarchy([...selected], ["hero", "handoff", "field", "reading", "finale"]);
  const allocated = new Set(hierarchy.sections.flatMap((item) => [...item.dominant, ...item.supporting]));
  assert.deepEqual([...selected].filter((item) => !allocated.has(item)), []);
  assert.ok(hierarchy.sections.every((item) => item.dominant.length <= 2));
  assert.equal(hierarchy.continuityOwner, "immersive");
  assert.ok(hierarchy.tensionResolutions.some((item) => /Refined.*Experimental/.test(item)));
  assert.ok(hierarchy.tensionResolutions.some((item) => /Lenis remains optional/.test(item)));
});
