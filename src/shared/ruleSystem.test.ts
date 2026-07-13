import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { DirectDesignPlan, VerificationReport } from "./artifacts.js";
import { validateRuleControls, type ReflexFontRegistry, type RuleRegistry } from "./ruleSystem.js";

const registry = JSON.parse(fs.readFileSync(path.resolve("skill/dreative/references/RULES.json"), "utf-8")) as RuleRegistry;
const reflex = JSON.parse(fs.readFileSync(path.resolve("skill/dreative/references/REFLEX_FONTS.json"), "utf-8")) as ReflexFontRegistry;
const planned = "2026-01-01T00:00:00.000Z";
const started = "2026-01-01T01:00:00.000Z";

function basePlan(tier: DirectDesignPlan["tier"] = "award"): DirectDesignPlan {
  return {
    version: 2,
    doctrineVersion: 2,
    request: "Create an ambitious archival experience",
    createdAt: planned,
    implementationStartedAt: started,
    tier,
    depth: "reimagine",
    skills: ["ux", "mobile", "motion", "media"],
    skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] },
    designRead: { register: "archival editorial", concept: "living catalog", signature: "transforming specimen" },
    fontDecision: {
      selected: "Source Serif 4",
      candidates: [
        { name: "Source Serif 4", reflex: false, rationale: "Variable optical sizes support the archival scale shifts." },
        { name: "Newsreader", reflex: false, rationale: "Editorial contrast supports document-led hierarchy." },
        { name: "Archivo", reflex: false, rationale: "Catalog labeling connects directly to the archival subject." },
      ],
      recentDisplayFonts: [],
    },
    creativeStrategy: {
      path: "diversity",
      mechanisms: ["variable-type morph", "depth-stack", "drag-inertia", "mask-dissolve"],
      drivers: ["scroll", "pointer", "time"],
    },
    pages: [
      {
        id: "home",
        name: "Home",
        skills: ["ux", "mobile", "motion", "media"],
        sections: [
          {
            id: "hero",
            name: "Hero",
            layoutFamily: "archival-index",
            skills: ["ux", "mobile", "motion", "media"],
            interactions: ["drag specimen"],
            mobile: "stacked specimen",
            fallback: "static catalog",
            verification: ["Signature responds to input"],
            assets: [],
            status: "shipped",
          },
        ],
      },
    ],
    preservationManifest: ".dreative/preservation.json",
    decisionLedger: ".dreative/ledger.json",
  };
}

function verification(...ids: string[]): VerificationReport {
  return {
    version: 1,
    generatedAt: started,
    evidence: ids.map((id) => ({
      id,
      criterion: id,
      status: "pass",
      evidence: "Captured runtime behavior in the production build.",
      proof: { timestamp: started, testedUrl: "http://localhost:3000", consoleErrorCount: 0 },
    })),
  };
}

test("valid default award plan", () => {
  assert.deepEqual(validateRuleControls(basePlan(), registry, reflex, verification()), []);
});

test("valid 3D substitution using spatial typography", () => {
  const plan = basePlan();
  plan.ruleExceptions = [
    {
      ruleId: "award.spatialSignature",
      decision: "substituted",
      declaredAt: planned,
      reason: "The archival concept has no physical subject, so a product-like prop would misrepresent the material.",
      alternative: "A persistent variable-type specimen becomes index, spatial architecture, and interactive control across four chapters.",
      successCriteria: ["The specimen appears in three materially different roles", "Pointer and scroll input visibly reshape its depth"],
      evidenceIds: ["spatial-type-desktop", "spatial-type-mobile"],
    },
  ];
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification("spatial-type-desktop", "spatial-type-mobile")), []);
});

test("invalid vague 3D exception", () => {
  const plan = basePlan();
  plan.ruleExceptions = [
    {
      ruleId: "award.spatialSignature",
      decision: "substituted",
      declaredAt: planned,
      reason: "It did not fit",
      alternative: "Typography felt better",
      successCriteria: ["Looks good", "Feels spatial"],
      evidenceIds: ["type"],
    },
  ];
  const errors = validateRuleControls(plan, registry, reflex, verification("type"));
  assert.ok(errors.some((error) => error.includes("vague")));
});

test("attempted hard-gate exception", () => {
  const plan = basePlan();
  plan.ruleExceptions = [
    {
      ruleId: "preservation.noLoss",
      decision: "substituted",
      declaredAt: planned,
      reason: "The old form was intentionally removed to simplify the new conversion route for this campaign.",
      alternative: "A replacement conversion control carries the same submitted data into the existing backend workflow.",
      successCriteria: ["Users can submit the same required fields", "The existing backend receives an equivalent payload"],
      evidenceIds: ["form"],
    },
  ];
  assert.ok(validateRuleControls(plan, registry, reflex, verification("form")).some((error) => error.includes("cannot be substituted")));
});

test("valid diversity plan", () => {
  const plan = basePlan("expressive");
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification()), []);
});

test("valid development plan", () => {
  const plan = basePlan();
  plan.creativeStrategy = {
    path: "development",
    signatureMechanism: "An archival sheet transforms across the complete journey",
    states: ["Loose sheets form a catalog index", "Sheets become a draggable research surface", "Sheets collapse into a spatial tunnel"],
    secondaryMechanisms: ["kinetic labels", "material lighting"],
    drivers: ["scroll", "pointer"],
  };
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification()), []);
});

test("invalid repeated-mechanism plan", () => {
  const plan = basePlan();
  plan.creativeStrategy = { path: "diversity", mechanisms: ["fade", "fade", "fade", "fade"], drivers: ["scroll", "scroll", "scroll"] };
  const errors = validateRuleControls(plan, registry, reflex, verification());
  assert.ok(errors.some((error) => error.includes("distinct mechanisms")));
});

test("valid reflex-font justification", () => {
  const plan = basePlan("premium");
  plan.fontDecision = {
    selected: "Inter",
    candidates: [
      { name: "Inter", reflex: true, rationale: "Existing authenticated product metrics and density depend on it." },
      { name: "Switzer", reflex: false, rationale: "Comparable product clarity with more character." },
      { name: "Source Sans 3", reflex: false, rationale: "Broad language support and efficient variable delivery." },
    ],
    recentDisplayFonts: [],
    reasonKinds: ["existing-brand", "design-system-metrics"],
    justification: "Inter is embedded throughout the authenticated product, preserves established density metrics, and avoids layout regressions across translated views.",
  };
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification()), []);
});

test("invalid generic font justification", () => {
  const plan = basePlan("premium");
  plan.fontDecision = {
    selected: "Inter",
    candidates: [
      { name: "Inter", reflex: true, rationale: "A familiar interface choice." },
      { name: "Switzer", reflex: false, rationale: "A product-oriented alternative." },
      { name: "Source Sans 3", reflex: false, rationale: "A broad-language alternative." },
    ],
    recentDisplayFonts: [],
    reasonKinds: [],
    justification: "Inter looks clean and modern for this interface.",
  };
  assert.ok(validateRuleControls(plan, registry, reflex, verification()).some((error) => error.includes("non-generic")));
});

test("experimental exploration selects only two shipped provocations", () => {
  const plan = basePlan("expressive");
  plan.skills.push("experimental");
  plan.pages[0].skills.push("experimental");
  plan.experimentalPlan = {
    majorSectionIds: ["hero", "archive", "closing"],
    candidates: [
      { id: "p1", sectionId: "hero", idea: "The title behaves as a physical catalog drawer opened by drag.", selected: true },
      { id: "p2", sectionId: "archive", idea: "Research sheets reorganize into a navigable spatial evidence wall.", selected: true },
      { id: "p3", sectionId: "closing", idea: "The final mark briefly assembles from all prior catalog coordinates.", selected: false },
    ],
  };
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification()), []);
});
