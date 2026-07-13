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
    motionComplexityBudget: {
      heroMoments: [{ sectionId: "hero", reason: "The archival specimen becomes the navigation system and establishes the living-catalog concept." }],
      calmSectionIds: [],
      sharedLanguage: "Archival sheets fold, align, and become structural boundaries across the journey.",
      deviceLimits: "Desktop uses the full pinned chapter while mobile shortens travel and removes continuous rendering.",
      progressiveEnhancement: "Semantic catalog content renders first; masks and synchronized motion enhance it when supported.",
      antiDefaultReview: {
        basicMotionAssessment: "The key specimen changes role and geometry rather than only fading, sliding, or scaling.",
        compositionHandoff: "The specimen edge becomes the next chapter's indexing rail instead of disappearing.",
        visualStateChange: "Loose sheets become navigation, a research surface, and then the closing mark.",
        conceptSpecificity: "The sheet behavior is derived from archival handling and would not fit an unrelated product.",
        memorableMoment: "Dragging the specimen reorganizes the complete catalog into the next chapter.",
      },
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
            motionTreatment: {
              class: "transformational",
              staticComposition: "A loose archival specimen sits beside the catalog index.",
              startState: "The specimen is centered and isolated as the page's primary subject.",
              endState: "The specimen unfolds into the structural rail for the next catalog chapter.",
              changes: ["The specimen mask expands and its edge becomes the next chapter rail."],
              pinnedElements: [],
              handoff: "The specimen edge persists as the indexing rail in the following composition.",
              purpose: "Turn passive archival viewing into active handling and establish continuity.",
              mechanism: "SVG mask migration synchronized with a GSAP scroll timeline.",
              mobile: "A shorter clip-path handoff preserves the specimen-to-rail transformation.",
              reducedMotion: "Render the specimen already aligned with the rail and use a direct section cut.",
            },
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
  const timelineStates = ["initial", "early", "mid-transition", "final", "handoff", "mobile", "reduced-motion"] as const;
  const timeline = timelineStates.map((timelineState) => ({
    id: `timeline-${timelineState}`,
    criterion: `Captured ${timelineState} visual state`,
    status: "pass" as const,
    evidence: "Captured the production build at the planned visual state.",
    timelineState,
    proof: { timestamp: started, testedUrl: "http://localhost:3000", consoleErrorCount: 0 },
  }));
  return {
    version: 1,
    generatedAt: started,
    evidence: [
      ...timeline,
      ...ids.map((id) => ({
        id,
        criterion: id,
        status: "pass" as const,
        evidence: "Captured runtime behavior in the production build.",
        proof: { timestamp: started, testedUrl: "http://localhost:3000", consoleErrorCount: 0 },
      })),
    ],
    refinement: {
      inspectedAt: started,
      findings: ["The mid-transition index was too compressed to read."],
      changes: ["Extended the mask handoff and delayed the rail compression."],
      evidenceIds: ["timeline-mid-transition"],
    },
  };
}

test("valid default award plan", () => {
  assert.deepEqual(validateRuleControls(basePlan(), registry, reflex, verification()), []);
});

test("valid key-asset substitution for a typography-only experience", () => {
  const plan = basePlan();
  plan.ruleExceptions = [
    {
      ruleId: "media.keyAssetTreatment",
      decision: "substituted",
      declaredAt: planned,
      reason: "The archive contains no raster key imagery; inventing photography would misrepresent the supplied typographic material.",
      alternative: "A persistent variable-type specimen becomes index, spatial architecture, and interactive control across the complete journey.",
      successCriteria: ["The specimen appears in materially different structural roles", "Pointer and scroll input visibly reshape the specimen"],
      evidenceIds: ["type-system-desktop", "type-system-mobile"],
    },
  ];
  assert.deepEqual(validateRuleControls(plan, registry, reflex, verification("type-system-desktop", "type-system-mobile")), []);
});

test("invalid vague creative-rule exception", () => {
  const plan = basePlan();
  plan.ruleExceptions = [
    {
      ruleId: "media.keyAssetTreatment",
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

test("invalid decorative-only expressive plan", () => {
  const plan = basePlan();
  plan.pages[0].sections[0].motionTreatment = {
    ...plan.pages[0].sections[0].motionTreatment!,
    class: "decorative",
    changes: ["The image fades upward and scales into view."],
    mechanism: "CSS opacity, translateY, and scale transitions on scroll reveal.",
  };
  const errors = validateRuleControls(plan, registry, reflex, verification());
  assert.ok(errors.some((error) => error.includes("decorative-only")));
});

test("expressive plan requires contextual motion budget", () => {
  const plan = basePlan("expressive");
  delete plan.motionComplexityBudget;
  assert.ok(validateRuleControls(plan, registry, reflex, verification()).some((error) => error.includes("motionComplexityBudget")));
});

test("award verification requires timeline states and a refinement pass", () => {
  const plan = basePlan();
  const report: VerificationReport = {
    version: 1,
    generatedAt: started,
    evidence: [
      {
        id: "initial-only",
        criterion: "Initial state",
        status: "pass",
        evidence: "Captured only the initial frame.",
        timelineState: "initial",
        proof: { timestamp: started, testedUrl: "http://localhost:3000", consoleErrorCount: 0 },
      },
    ],
  };
  const errors = validateRuleControls(plan, registry, reflex, report);
  assert.ok(errors.some((error) => error.includes("mid-transition")));
  assert.ok(errors.some((error) => error.includes("refinement pass")));
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
