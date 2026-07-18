import test from "node:test";
import assert from "node:assert/strict";
import { detectSpecialistSkills, resolveAmbitionTier, resolveSkillDependencies, routeSkillsAcrossPages } from "./skillSystem.js";

test("detects every previously un-routed specialist family", () => {
  assert.deepEqual(detectSpecialistSkills(["experimental mobile-first gallery with generated video"]), [
    "mobile",
    "media",
    "experimental",
  ]);
});

test("resolves universal and transitive skill dependencies", () => {
  assert.deepEqual(resolveSkillDependencies(["cinematic"]), ["ux", "mobile", "motion", "interaction", "media", "cinematic"]);
});

test("resolves ambition without forcing award tier", () => {
  assert.equal(resolveAmbitionTier({ variance: 3, motion: 2, aesthetic: "trust" }), "standard");
  assert.equal(resolveAmbitionTier({ variance: 7, motion: 7 }), "expressive");
  assert.equal(resolveAmbitionTier({ variance: 7, motion: 7, texts: ["Awwwards immersive world"] }), "award");
});

test("clean luxury creativity recommends expressive and additive treatments", () => {
  const prompt = "Redesign this existing website. Make it clean, luxury and minimalistic, but creative, unique and impressive. Use smooth animations. Avoid common AI fonts, oversized bold text, excessive rounded corners and AI-slop layouts. All design decisions are up to you.";
  const detected = detectSpecialistSkills([prompt]);
  assert.ok(detected.includes("refined"));
  assert.ok(detected.includes("motion"));
  assert.ok(detected.includes("interaction"));
  assert.ok(detected.includes("experimental"));
  assert.equal(resolveAmbitionTier({ variance: 5, motion: 3, aesthetic: "minimal", texts: [prompt] }), "expressive");
});

test("hybrid routing honors page pins and never activates unselected suggestions", () => {
  const routed = routeSkillsAcrossPages({
    pages: [
      { id: "home", texts: ["cinematic hero with a video loop and 3d globe"] },
      { id: "shop", texts: ["clean ecommerce catalog"] },
    ],
    selected: ["cinematic", "refined"],
    assignments: { shop: ["refined"] },
    autoRouteUnassigned: true,
  });
  assert.ok(routed.byPage.shop.includes("refined"));
  assert.ok(routed.byPage.home.includes("cinematic"));
  assert.ok(routed.byPage.home.includes("motion"));
  assert.ok(!routed.byPage.home.includes("3d"));
  assert.ok(!routed.byPage.shop.includes("3d"));
  assert.ok(routed.suggestions.home.includes("3d"));
});

test("select all covers all skills across the build without putting all on every page", () => {
  const all = ["ux", "mobile", "refined", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"] as const;
  const routed = routeSkillsAcrossPages({
    pages: [
      { id: "home", texts: ["cinematic immersive hero"] },
      { id: "product", texts: ["3d product"] },
      { id: "about", texts: ["experimental editorial"] },
    ],
    selected: [...all],
    autoRouteUnassigned: true,
  });
  const used = new Set(Object.values(routed.byPage).flat());
  assert.deepEqual([...all].filter((skill) => !used.has(skill)), []);
  assert.ok(Object.values(routed.byPage).some((skills) => skills.length < all.length));
});

test("routing can be disabled while waiting for explicit page assignments", () => {
  const routed = routeSkillsAcrossPages({
    pages: [{ id: "home", texts: ["animated landing page"] }],
    selected: ["motion"],
    autoRouteUnassigned: false,
  });
  assert.deepEqual(routed.unassigned, ["motion"]);
  assert.deepEqual(routed.byPage.home, ["ux", "mobile"]);
});
