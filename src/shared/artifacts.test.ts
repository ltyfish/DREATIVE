import test from "node:test";
import assert from "node:assert/strict";
import { validateDesignEquityBaseline, validatePlan, validateVerificationReport, validateVisualCheckpoint, type DirectDesignPlan, type VerificationReport, type VisualBlueprint } from "./artifacts.js";
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

function blueprint(): VisualBlueprint {
  return {
    viewportComposition: "An offset task rail occupies two fifths while live selection context owns the remaining field.", spatialRatios: "Two fifths task controls to three fifths persistent selection context.", primaryFocal: "The currently actionable delivery choice and its readiness state.", secondaryFocal: "A persistent summary that explains consequences of the active choice.", gridLogic: "A twelve-column grid breaks into five control columns and seven context columns.", typographyRoles: "A compact humanist display marks decisions while tabular body text carries operational detail.", materialRelationship: "Warm paper controls sit above an ink-toned context plane with state-colored seams.", brandMotif: "The checkout confirmation mark expands into a continuous route through each decision.", signatureLocation: "The route begins beside the first control and crosses into the persistent summary.", signatureRole: "It records completed choices and becomes the progress and validation system.", interactionDriver: "Field selection advances the route and rewrites the adjacent consequence summary.", motionStart: "The route rests at the first unresolved decision with later segments muted.", motionEnd: "The route connects every resolved choice to the enabled continuation action.", sectionHandoff: "The completed route terminates at the continuation control instead of resetting between sections.", mobileRecomposition: "The summary becomes a compact sticky status band above the thumb-reachable action.", reducedMotion: "Resolved route segments switch instantly with the same hierarchy and state labels.", commonTemplateRisk: "A generic checkout card stack would disconnect consequences from the current decision.", brandSpecificity: "The route uses this product's confirmation mark, terminology, and actual checkout states.",
  };
}

function v4Plan(kind: "from-scratch" | "redesign" = "redesign"): DirectDesignPlan {
  const plan = v3Plan();
  const approvedAt = "2026-07-14T00:10:00.000Z";
  plan.version = 4; plan.doctrineVersion = 4; plan.scope = "substantial"; plan.projectKind = kind;
  plan.implementationStartedAt = "2026-07-14T00:11:00.000Z";
  plan.approval = { status: "approved", approvedAt, transcriptReferences: ["chat:baseline", "chat:concept", "chat:plan"], approvedConcept: "A continuous decision route makes checkout consequences visible beside every active choice.", approvedTransformationDepth: "restructure", approvedTier: "solid", approvedTreatments: ["ux", "mobile"], selectedRecommendation: true, decisions: [
    ...(kind === "redesign" ? [{ kind: "baseline" as const, at: "2026-07-14T00:01:00.000Z", transcriptReference: "chat:baseline", choice: "Protect the existing directness while surpassing its weak hierarchy.", selectedRecommendation: true }] : []),
    { kind: "concept", at: "2026-07-14T00:05:00.000Z", transcriptReference: "chat:concept", choice: "Use the continuous decision route counterfactual.", selectedRecommendation: true },
    { kind: "final-plan", at: approvedAt, transcriptReference: "chat:plan", choice: "Approve the complete visual blueprint and checkpoint gate.", selectedRecommendation: true },
  ] };
  if (kind === "redesign") plan.designEquity = ".dreative/design-equity.json";
  plan.checkpoint = ".dreative/checkpoint.json"; plan.mockupStrategy = "straight-to-build";
  plan.creativeParity = { fromScratchConcept: "A continuous decision route treats checkout as one spatial instrument rather than stacked form cards.", reconciledConcept: "The spatial instrument retains every existing field and handler while the route exposes real product consequences.", reconciliationChanges: ["Mapped existing fields into route stations without restoring the old card stack."], reconciliationWeakenedIdea: false, retainedCreativeAmbition: "The signature still controls composition, state, motion, and mobile hierarchy.", compromises: [] };
  plan.executionBrief = { approvedDecisions: ["Use continuous route", "Keep solid tier"], baselineDesignEquity: kind === "redesign" ? ["Preserve direct task completion"] : [], selectedConcept: "A continuous decision route makes checkout one authored operational instrument.", preservationContracts: ["Keep every checkout field, handler, and route"], selectedTreatmentRules: ["Refined craft without a motion clamp"], checkpointRequirement: "Stop after hero, core task, mobile, and motion language for approval.", verificationCriteria: ["Signature is visible and existing strengths are retained or surpassed"] };
  plan.commonPatternReview = [];
  plan.pages[0].sections[0].visualBlueprint = blueprint();
  return plan;
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

test("v4 approval timing and redesign decision sequence are mandatory", () => {
  const plan = v4Plan();
  assert.deepEqual(validatePlan(plan), []);
  plan.implementationStartedAt = "2026-07-14T00:09:00.000Z";
  assert.ok(validatePlan(plan).some((error) => error.includes("later than final plan approval")));
  plan.implementationStartedAt = "2026-07-14T00:11:00.000Z";
  plan.approval!.decisions = plan.approval!.decisions.filter((decision) => decision.kind !== "baseline");
  assert.ok(validatePlan(plan).some((error) => error.includes("baseline decision")));
});

test("from-scratch substantial work requires approval but not redesign baseline artifacts", () => {
  const plan = v4Plan("from-scratch");
  delete plan.checkpoint;
  delete plan.creativeParity;
  assert.equal(plan.designEquity, undefined);
  assert.deepEqual(validatePlan(plan), []);
});

test("v4 rejects a prose-only signature blueprint", () => {
  const plan = v4Plan();
  plan.pages[0].sections[0].visualBlueprint!.signatureLocation = "signal rail";
  assert.ok(validatePlan(plan).some((error) => error.includes("signatureLocation")));
});

test("v4 rejects a fake restructure made of generic styling and entrance changes", () => {
  const plan = v4Plan();
  plan.creativeParity = { fromScratchConcept: "A split hero uses a new font and new color before feature cards below.", reconciledConcept: "The split hero keeps the new font, new color, feature cards, and entrance fade.", reconciliationChanges: ["Reordered the feature cards and retained the entrance fade."], reconciliationWeakenedIdea: false, retainedCreativeAmbition: "The split hero and feature cards remain after reconciliation.", compromises: [] };
  assert.ok(validatePlan(plan).some((error) => error.includes("fails creative parity")));
});

test("design-equity and straight-to-build checkpoint artifacts are typed", () => {
  const equity = { version: 1, capturedAt: "2026-07-14T00:00:00.000Z", baselineQuality: "polished", screenshots: { desktop: [".dreative/before-desktop.png"], mobile: [".dreative/before-mobile.png"] }, strongestVisualQualities: ["Distinctive editorial typography"], weakestVisualQualities: ["Mobile action becomes difficult to reach"], typographyCharacter: "A high-contrast italic serif supplies editorial identity and hierarchy.", colorMaterialCharacter: "Warm paper neutrals and ink lines make the interface tactile.", compositionalStrengths: ["Feature interaction controls pacing"], hierarchyAndPacing: "Tight authored clusters alternate with deliberate breathing room.", signatureVisualElements: ["Animated feature ledger"], animationInteractionInventory: ["Feature rows reveal contextual media"], mobileStrengthsAndFailures: ["Typography survives but the action drops too low"], distinctivePatterns: ["Editorial ledger interaction"], genericOrDatedPatterns: ["Conventional footer grid"], items: [{ id: "type", quality: "Distinctive editorial typography anchors the brand.", decision: "transform", rationale: "Keep equal character while changing the family.", replacementOrEvolution: "A new high-contrast family retains italic cadence and optical hierarchy.", successCriteria: ["Final hero has equivalent typographic character"], finalEvidenceIds: [] }] };
  assert.deepEqual(validateDesignEquityBaseline(equity), []);
  const checkpoint = { version: 1, capturedAt: "2026-07-14T00:20:00.000Z", implementation: { hero: true, coreSection: true, desktop: true, mobile: true, primaryMotionLanguage: true }, baselineScreenshotPaths: [".dreative/before-desktop.png"], screenshotPaths: { desktop: [".dreative/check-desktop.png"], mobile: [".dreative/check-mobile.png"] }, critique: Object.fromEntries(["distinctiveness", "hierarchy", "brandVisibility", "signatureLegibility", "equityRetention", "saasTemplateRisk", "brandSwapRisk", "mobileAuthorship", "motionPurpose", "counterfactualStrength"].map((key) => [key, `Concrete ${key} comparison against the rendered baseline identifies the observable result.`])), meaningfulWeaknessFound: true, refinements: [{ finding: "The route is too quiet", change: "Increased state contrast", evidenceIds: ["checkpoint-refined"] }], approval: { status: "approved", approvedAt: "2026-07-14T00:30:00.000Z", transcriptReferences: ["chat:checkpoint"] }, systemSpreadStartedAt: "2026-07-14T00:31:00.000Z" };
  assert.deepEqual(validateVisualCheckpoint(checkpoint), []);
});
