import test from "node:test";
import assert from "node:assert/strict";
import { validatePlan, validateVerificationReport, type DirectDesignPlan, type VerificationReport } from "./artifacts.js";
import { buildDesignPlan } from "./design.js";
import type { Page } from "./types.js";

const page: Page = {
  id: "checkout",
  name: "Checkout",
  status: "skeleton",
  canvasPos: { x: 0, y: 0 },
  layout: {
    id: "root", type: "column", label: "Checkout shell", children: [
      { id: "promo", type: "hero", label: "Promotional introduction" },
      { id: "form", type: "form", label: "Choose delivery and continue", children: [{ id: "continue", type: "button", label: "Continue", text: "Continue" }] },
      { id: "cards", type: "card-grid", label: "Delivery option cards" },
    ],
  },
};

function v3Plan(): DirectDesignPlan {
  const runtime = buildDesignPlan(page, { transformationDepth: "restructure", aesthetic: "trust", variance: 3, motion: 2 });
  return {
    version: 3,
    doctrineVersion: 3,
    request: "Restructure checkout without changing its contracts",
    createdAt: "2026-07-14T00:00:00.000Z",
    tier: "solid",
    depth: "restructure",
    skills: ["ux", "mobile"],
    skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] },
    designRead: { register: "task transaction", concept: "continuous checkout", signature: "selection carries forward" },
    coherence: {
      globalVisualLanguage: "A restrained operational language with one accent and consistent state markers.",
      globalInteractionLanguage: "Selections persist visibly and primary actions respond to readiness.",
      sharedPrimitives: ["state marker", "task action"],
      pageSpecificCompositions: [{ pageId: page.id, register: runtime.register, taskModel: runtime.mobileBlueprint.primaryTask, expressionLevel: "calm" }],
      crossPageContinuity: ["Selection state carries into the next route"],
      prohibitedRepeatedShells: ["Oversized headline plus decorative panel plus rounded card container"],
    },
    pages: [{
      id: page.id,
      name: page.name,
      register: runtime.register,
      sourceStrategy: runtime.sourceStrategy,
      structuralDelta: runtime.structuralDelta,
      mobileBlueprint: runtime.mobileBlueprint,
      skills: ["ux", "mobile"],
      sections: [{
        id: "task",
        name: "Checkout task",
        layoutFamily: "continuous decision workspace",
        skills: ["ux", "mobile"],
        interactions: ["select delivery"],
        mobile: "Task controls precede supporting content and keep the continuation action reachable.",
        fallback: "Semantic fieldset and submit action",
        verification: [{ id: "checkout-depth", claim: "Implemented checkout matches the approved task-first architecture", kind: "structural-depth", pageId: page.id, sectionId: "task", viewports: ["desktop", "mobile", "narrow-mobile"] }],
        assets: [],
        status: "shipped",
      }],
    }],
    preservationManifest: ".dreative/preservation.json",
    decisionLedger: ".dreative/ledger.json",
  };
}

test("v3 plan accepts independent solid ambition with restructure depth", () => {
  assert.deepEqual(validatePlan(v3Plan()), []);
});

test("v3 validator rejects stylesheet-only deep transformation", () => {
  const plan = v3Plan();
  plan.pages[0].structuralDelta = {
    ...plan.pages[0].structuralDelta!,
    proposedModel: "Same sections with modern expressive styling",
    proposedParadigm: "Same layout with new colors and fonts",
    materialChanges: ["New colors, fonts, card radii, shadows, and fade animations"],
  };
  assert.ok(validatePlan(plan).some((error) => error.includes("cannot be satisfied")));
});

test("v3 validator rejects stack-only mobile blueprint", () => {
  const plan = v3Plan();
  plan.pages[0].mobileBlueprint!.mobileOnlyComposition = "stack vertically";
  assert.ok(validatePlan(plan).some((error) => error.includes("stack vertically")));
});

test("verification v2 requires associated page, criterion, kind, and real mobile viewports", () => {
  const report: VerificationReport = {
    version: 2,
    generatedAt: "2026-07-14T00:00:00.000Z",
    evidence: [{
      id: "mobile-check",
      criterion: "Mobile task is usable",
      criterionId: "checkout-mobile",
      pageId: "checkout",
      kind: "responsive",
      viewportClass: "mobile",
      mobileChecks: ["no-horizontal-overflow"],
      status: "pass",
      evidence: "Browser screenshot and interaction run",
      proof: { timestamp: "2026-07-14T00:00:00.000Z", viewport: { width: 390, height: 844 }, artifactPath: ".dreative/screenshots/checkout-mobile.png" },
    }],
  };
  assert.deepEqual(validateVerificationReport(report), []);
  report.evidence[0].proof.viewport = { width: 768, height: 844 };
  assert.ok(validateVerificationReport(report).some((error) => error.includes("approximately 390px")));
});
