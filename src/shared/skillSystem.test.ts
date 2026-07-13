import test from "node:test";
import assert from "node:assert/strict";
import { detectSpecialistSkills, resolveAmbitionTier, resolveSkillDependencies } from "./skillSystem.js";
import { validatePlan, validatePreservationManifest } from "./artifacts.js";

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
  assert.equal(resolveAmbitionTier({ variance: 3, motion: 2, aesthetic: "trust" }), "solid");
  assert.equal(resolveAmbitionTier({ variance: 7, motion: 7 }), "expressive");
  assert.equal(resolveAmbitionTier({ variance: 7, motion: 7, texts: ["Awwwards immersive world"] }), "award");
});

test("plan validator rejects unfinished sections", () => {
  const errors = validatePlan({
    version: 1,
    request: "Redesign",
    createdAt: new Date().toISOString(),
    tier: "premium",
    depth: "restructure",
    skills: ["ux", "mobile"],
    designRead: { register: "editorial", concept: "signal", signature: "rail" },
    preservationManifest: ".dreative/preservation.json",
    decisionLedger: ".dreative/ledger.json",
    sections: [
      {
        id: "hero",
        name: "Hero",
        layoutFamily: "split",
        skills: ["ux", "mobile"],
        interactions: [],
        mobile: "stack",
        fallback: "static",
        verification: ["Headline visible"],
        assets: [],
        status: "planned",
      },
    ],
  });
  assert.ok(errors.some((error) => error.includes("still planned")));
});

test("preservation validator requires reasons for intentional changes", () => {
  const errors = validatePreservationManifest({
    version: 1,
    createdAt: new Date().toISOString(),
    items: [{ id: "cta", kind: "link", file: "src/App.tsx", needle: "/buy", purpose: "Purchase", intentionallyChanged: true }],
  });
  assert.ok(errors.some((error) => error.includes("changeReason")));
});
