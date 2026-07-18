import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { approvePlan, approvalStatus, contractHash, createPlan, migrateLegacyPlan, readPlan, validateCanonicalPlan, writePlan, type CanonicalPlan } from "./planGovernance.js";
import { runPlanCommand, unresolvedCreativeSourceQuestions } from "../cli/plan.js";
import { detectProjectPreflight } from "./preflight.js";

function root(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-plan-v7-"));
  fs.mkdirSync(path.join(dir, "src"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ scripts: { dev: "vite", build: "vite build", test: "node --test" }, dependencies: { vite: "^5" } }));
  fs.writeFileSync(path.join(dir, "package-lock.json"), "{}");
  return dir;
}

const resolvedCreativeArgs = [
  "--no-references",
  "--generated-images", "deny",
  "--sourced-images", "deny",
  "--generated-video", "deny",
  "--sourced-video", "deny",
  "--3d-assets", "not-allowed",
  "--package-install", "deny",
];

function completePlan(dir: string): CanonicalPlan {
  const plan = createPlan(dir, {
    workflow: { ambition: "award", execution: "full-audit", prototype: "required", purpose: "dreative-dogfood" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile", "motion", "interaction"],
    treatmentDecisionExplicit: true,
  });
  plan.contract.scope.requiredFunctionality = ["Navigation and primary workflow remain operational."];
  plan.contract.scope.dependencyInstallationAllowed = true;
  plan.contract.creativeSources = {
    references: { preference: "open-to-suggestions", urls: [], notes: [], antiReferences: [] },
    generatedImages: "ask-per-asset", sourcedImages: "ask-per-asset", generatedVideo: "ask-per-asset", sourcedVideo: "ask-per-asset",
    threeDAssets: "ask-per-asset", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [],
  };
  plan.contract.scope.successCriteria = ["The experience feels authored and develops beyond the hero."];
  plan.contract.capabilityPreflight = detectProjectPreflight(dir);
  plan.contract.selectedConcept = "A living editorial instrument develops across the full route.";
  plan.contract.blueprint = [{ pageId: "home", sectionId: "hero", intent: "Opening instrument" }];
  plan.contract.experienceDistribution = [
    { pageId: "home", sectionId: "hero", order: 0, role: "peak", continuityContribution: "The editorial rail establishes the route state." },
    { pageId: "home", sectionId: "work", order: 1, role: "transformation", continuityContribution: "The rail changes role after the first viewport." },
    { pageId: "home", sectionId: "finale", order: 2, role: "peak", continuityContribution: "The rail resolves as a second authored peak." },
  ];
  plan.contract.experienceArc = {
    openingState: "The instrument begins quiet and grounded.", firstTransformation: "Media unfolds into a second composition.",
    sectionProgression: "The instrument persists through three chapters.", peaksAndRests: "Transformations alternate with calm reading space.",
    persistentSystem: "One editorial rail develops across sections.", userControlledMoment: "Drag changes the active media viewpoint.",
    mobileTranslation: "Tap and swipe replace fine pointer control at 390px.", finalResolution: "The rail resolves into the final action.",
  };
  plan.contract.motionAndMediaStrategy = "Structural media states hand off between chapters.";
  plan.contract.mobileTranslation = "The signature becomes a swipe-controlled compact instrument.";
  plan.contract.acceptanceCriteria = ["Observe start, midpoint, handoff and resolution."];
  plan.contract.projectDefinition = {
    purpose: "Present an authored editorial product journey.", targetAudience: "Prospective customers comparing the product.",
    primaryUserJourney: "Open the route, explore the editorial rail, then complete the final action.", routes: ["/"],
    requiredFunctionality: ["Navigation and primary workflow remain operational."],
    extractedRequirements: ["The experience must develop beyond the hero."], nonGoals: ["No account dashboard."],
    preservedContentOrFunctionality: ["Existing navigation and primary workflow."],
  };
  plan.contract.creativeDirection = {
    selectedConcept: plan.contract.selectedConcept, fitRationale: "The editorial instrument makes comparison tactile and memorable.",
    nonGenericQualities: "One persistent rail changes roles across chapters.", visualLanguage: "Editorial frames with an evolving spatial rail.",
    compositionStrategy: "Alternating controlled peaks and calm reading states.", typographyStrategy: "Display titles hand off to compact utility labels.",
    mediaStrategy: "Layered product media changes state within the rail.", motionInteractionPhilosophy: "User input advances structural states rather than entrance effects.",
    experienceProgression: "Establish, transform, rest, and resolve the same authored system.",
  };
  plan.contract.sectionContracts = ["hero", "work", "finale"].map((id) => ({
    id, route: "/", narrativePurpose: `${id} advances the editorial narrative.`, mainUserAction: "Explore the active rail state.",
    visualRole: "Frame the persistent editorial instrument.", mediaRole: "Show the current layered product state.",
    interactionRole: "Scroll and drag advance the active composition.", entryState: "The rail enters in its prior resolved state.",
    activeState: "The rail and typography coordinate around the current chapter.", resolvedState: "The rail settles into a legible handoff.",
    handoff: "The same owned rail persists into the next chapter.", mobileBehavior: "Swipe and vertical progress preserve the central rail.",
    reducedMotionBehavior: "Authored still states preserve the narrative sequence.", fallbackBehavior: "Semantic states retain every action and message.",
    verificationRequirement: `Capture ${id} start, active and resolved states.`,
  }));
  plan.contract.continuityContract = {
    owner: "EditorialRail", medium: "DOM", sourceOwner: "EditorialRail",
    sectionChanges: "The same mounted rail changes media, framing and labels between chapters.",
    persistenceVerification: "A continuous trace proves one owner remains mounted through all chapters.",
    breakConditions: "Duplicated chapter images or remounting unrelated rails breaks continuity.",
  };
  plan.contract.mechanismContracts = [{
    id: "rail", catalogueSourceOrCustomRationale: "Catalogue shared-element handoff adapted to the editorial rail.", routeOrSection: "home/hero-work-finale",
    inputDriver: "scroll-progress", startState: "Rail and title occupy the opening frame.", activeState: "Rail transforms media and layout through progress.",
    endState: "Rail resolves beside the final action.", reverseBehavior: "Reverse scroll restores prior structural states.",
    rapidInputBehavior: "Rapid input clamps progress without orphaning pinned state.", refreshAtProgressBehavior: "Refresh restores the state matching current scroll.",
    mobileBehavior: "Vertical progress and swipe retain the same rail concept.", reducedMotionBehavior: "Three authored still compositions replace interpolation.",
    dependency: "Native scroll timeline owned by EditorialRail.", performanceExpectation: "No long task above fifty milliseconds during progress.",
    approvedFallback: "Three semantic rail states controlled by section intersection.", fallbackTrigger: "Measured scroll timeline failure in the trusted prototype.",
    requiredCaptureStates: ["start", "active", "resolved", "reverse", "mobile", "reduced-motion"],
    successCriteria: ["One rail visibly transforms across chapters."], failureCriteria: ["Buttons or duplicated images replace scroll progress."],
    sectionId: "work", subjectIds: ["editorial-rail"], treatments: ["motion", "interaction"], runtimeOwner: "EditorialRail",
    trigger: "Scroll progress crosses the work and finale chapters.", actions: [{ action: "scroll", value: "600" }],
    selectors: ["#editorial-rail"], assertions: [{ type: "mechanism-state", selector: "#editorial-rail", expected: "active", mechanismId: "rail" }],
    expectedResults: ["The rail reaches its active state and later resolves."],
    mobileTransformation: "Vertical touch progress preserves the controlled rail state.",
    reducedMotionTransformation: "Three authored still states replace interpolation.", fallbackId: "rail-fallback",
  }];
  plan.contract.subjectInventory = [{
    id: "editorial-rail", type: "primary-subject", recognizableAs: "the persistent editorial product rail",
    narrativeRole: "Carries product comparison from opening through resolution.", sectionIds: ["hero", "work", "finale"],
    sourceMethod: "procedural", assetIds: [], rightsRequirements: ["Project-authored DOM and CSS."], recurring: true,
    continuityPurpose: "Makes three chapters feel like one developing comparison instrument.",
    mobileRepresentation: "A compact vertical rail remains recognizable on touch screens.",
    reducedMotionRepresentation: "Three authored still rail compositions retain the narrative.",
    fallbackClassification: "static-image",
  }];
  plan.contract.requirementTraceability = [{
    id: "REQ-1", source: "user prompt", wording: "The experience must develop beyond the hero.",
    plannedImplementation: "EditorialRail transforms through work and finale chapters.", routeOrComponent: "home/EditorialRail",
    browserTest: "Scroll start to finale and reverse while capturing rail states.", evidenceId: "rail-runtime", status: "planned",
    actions: [{ action: "scroll", value: "600" }],
    assertions: [{ type: "visible", selector: "#editorial-rail" }, { type: "mechanism-state", selector: "#editorial-rail", expected: "active", mechanismId: "rail" }],
  }];
  plan.contract.packagePlan = {
    assets: ["Layered editorial product media."], rightsAndSources: ["Commercial rights must be recorded."],
    placeholderRestrictions: ["No placeholder media may ship."], derivatives: ["Desktop and mobile layers."],
    mobileAssetStrategy: "Serve compact derivatives at 390px.", mechanismPackages: ["native browser APIs"],
    installPermission: true, preflightResults: ["Browser verification available through Dreative runner."],
    prototypeProof: ["Prove scroll lifecycle and reduced motion before integration."],
  };
  plan.contract.verificationPlan = {
    viewports: [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }],
    interactions: [{ id: "rail-scroll", route: "/", action: "scroll", mechanismId: "rail" }],
    mechanismStates: ["start", "active", "resolved", "reverse"], mobileTests: ["Central rail remains present"],
    reducedMotionTests: ["Authored still states"], accessibilityChecks: ["Keyboard navigation and visible focus"],
    performanceChecks: ["Long tasks"], mediaNetworkChecks: ["Images load and requests succeed"],
    criticInputs: ["Desktop, mobile, reduced motion, trace"], finalizationBlockers: ["Missing rail states or required functionality"],
  };
  for (const decision of plan.contract.treatmentDecisions) if (decision.state === "declined") decision.reason = `${decision.treatment} is outside this bounded editorial rail scope.`;
  for (const item of plan.contract.treatmentAllocation) {
    item.locations = ["home/hero"];
    item.contribution = `${item.treatment} contributes a visible, testable part of the concept.`;
    item.acceptance = [`${item.treatment} is perceptible in browser evidence.`];
    item.mechanismIds = ["rail"];
    item.mobileObligation = `${item.treatment} remains substantive in the mobile rail composition.`;
    item.reducedMotionObligation = `${item.treatment} remains substantive in authored still states.`;
    item.failureCriteria = [`${item.treatment} fails when its rail contribution is missing.`];
  }
  return plan;
}

test("substantial plan init stops when Ambition is missing", () => {
  const dir = root();
  assert.equal(runPlanCommand(dir, ["init", "--execution", "full-audit", "--prototype", "required", "--purpose", "dreative-dogfood", "--preview-url", "http://localhost:4173", "--routes", "/"]), 2);
  assert.equal(fs.existsSync(path.join(dir, ".dreative", "plan.yaml")), false);
});

test("creative-source intake asks unresolved reference, media, 3D and package-permission questions", () => {
  const questions = unresolvedCreativeSourceQuestions(["--references", "https://example.com", "--generated-images", "allow", "--3d-assets", "supplied-only"]);
  assert.ok(!questions.some((item) => item.startsWith("References:")));
  assert.ok(!questions.some((item) => item.startsWith("Generated images:")));
  assert.ok(!questions.some((item) => item.startsWith("3D assets/props:")));
  assert.ok(questions.some((item) => item.startsWith("Sourced images:")));
  assert.ok(questions.some((item) => item.startsWith("Generated video:")));
  assert.ok(questions.some((item) => item.startsWith("Sourced video:")));
  assert.ok(questions.some((item) => item.startsWith("Package installation:")));
});

test("values supplied by the user are recorded without being replaced", () => {
  const dir = root();
  assert.equal(runPlanCommand(dir, ["init", "--ambition", "experimental", "--execution", "fast", "--prototype", "skip", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/work", "--treatments", "motion,interaction", "--references", "https://example.com/ref", "--generated-images", "ask", "--sourced-images", "allow", "--generated-video", "deny", "--sourced-video", "ask", "--3d-assets", "supplied-only", "--supplied-3d", "assets/product.glb", "--package-install", "allow"]), 0);
  const plan = readPlan(dir);
  assert.deepEqual(plan.contract.workflow, { ambition: "experimental", execution: "fast", prototype: "skip", purpose: "project-delivery" });
  assert.deepEqual(plan.contract.target.routeScope.routes, ["/work"]);
  assert.equal(plan.contract.creativeSources.references.preference, "provided");
  assert.deepEqual(plan.contract.creativeSources.references.urls, ["https://example.com/ref"]);
  assert.equal(plan.contract.creativeSources.generatedImages, "ask-per-asset");
  assert.equal(plan.contract.creativeSources.sourcedImages, "allowed");
  assert.equal(plan.contract.creativeSources.generatedVideo, "not-allowed");
  assert.equal(plan.contract.creativeSources.threeDAssets, "supplied-only");
  assert.deepEqual(plan.contract.creativeSources.suppliedThreeDAssets, ["assets/product.glb"]);
});

test("capabilities file records confirmed tools without converting permission into availability", () => {
  const dir = root();
  fs.writeFileSync(path.join(dir, "capabilities.json"), JSON.stringify({ capabilities: [
    { id: "image-search", state: "available-through-confirmed-tool", provider: "rights-safe-search", verified: true },
    { id: "video-generation", state: "unavailable", verified: true },
  ] }));
  assert.equal(runPlanCommand(dir, ["init", "--ambition", "standard", "--execution", "lean", "--prototype", "auto", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "refined", "--capabilities-file", "capabilities.json", "--no-references", "--generated-images", "allow", "--sourced-images", "allow", "--generated-video", "allow", "--sourced-video", "allow", "--3d-assets", "not-allowed", "--package-install", "deny"]), 0);
  const capabilities = new Map(readPlan(dir).contract.capabilityPreflight?.creativeCapabilities.map((item) => [item.id, item]));
  assert.equal(capabilities.get("image-search")?.status, "available-through-confirmed-tool");
  assert.equal(capabilities.get("video-generation")?.status, "unavailable");
  assert.equal(capabilities.get("image-generation")?.status, "permitted-but-tool-unverified");
});

test("all treatments require confirmation and remain selected", () => {
  const dir = root();
  const args = ["init", "--ambition", "award", "--execution", "lean", "--prototype", "auto", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "all", ...resolvedCreativeArgs];
  assert.equal(runPlanCommand(dir, args), 2);
  assert.equal(fs.existsSync(path.join(dir, ".dreative", "plan.yaml")), false);
  assert.equal(runPlanCommand(dir, [...args, "--confirm-all"]), 0);
  const plan = readPlan(dir);
  assert.equal(plan.contract.allTreatmentsExplicit, true);
  assert.equal(plan.contract.selectedTreatments.length, 10);
});

test("substantial plan without explicit treatments writes no contract", () => {
  const dir = root();
  const result = runPlanCommand(dir, ["init", "--ambition", "standard", "--execution", "lean", "--prototype", "auto", "--purpose", "project-delivery", "--preview-url", "http://localhost:4173", "--routes", "/", ...resolvedCreativeArgs]);
  assert.equal(result, 2);
  assert.equal(fs.existsSync(path.join(dir, ".dreative", "plan.yaml")), false);
});

test("unresolved creative capability intake never writes a contract", () => {
  const dir = root();
  const result = runPlanCommand(dir, ["init", "--ambition", "experimental", "--execution", "full-audit", "--prototype", "required", "--purpose", "dreative-dogfood", "--preview-url", "http://localhost:4173", "--routes", "/", "--treatments", "all"]);
  assert.equal(result, 2);
  assert.equal(fs.existsSync(path.join(dir, ".dreative", "plan.yaml")), false);
});

test("validation rejects placeholder treatment allocations", () => {
  const dir = root();
  const plan = createPlan(dir, {
    workflow: { ambition: "standard", execution: "lean", prototype: "auto", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
    treatments: ["ux", "mobile"],
    treatmentDecisionExplicit: true,
  });
  const errors = validateCanonicalPlan(plan);
  assert.ok(errors.some((item) => item.includes("concrete page or section locations")));
  assert.ok(errors.some((item) => item.includes("substantive delivery contribution")));
  assert.ok(errors.some((item) => item.includes("observable acceptance condition")));
});

test("direct canonical YAML cannot bypass all-ten treatment decisions", () => {
  const dir = root();
  const plan: any = completePlan(dir);
  plan.contract.treatmentDecisions = plan.contract.treatmentDecisions.slice(0, 5);
  const errors = validateCanonicalPlan(plan);
  assert.ok(errors.some((item) => item.includes("all ten treatments")));
});

test("contract edits invalidate approval while execution updates do not", () => {
  const dir = root();
  const plan = completePlan(dir);
  writePlan(dir, plan);
  approvePlan(dir);
  const approved = readPlan(dir);
  const approvedHash = approved.approval.contractHash;
  approved.execution.currentPhase = "implementation";
  approved.execution.lastUpdatedAt = new Date().toISOString();
  writePlan(dir, approved);
  assert.equal(approvalStatus(readPlan(dir)).approved, true);
  const edited = readPlan(dir);
  edited.contract.selectedConcept = "A materially changed concept replaces the approved editorial instrument.";
  writePlan(dir, edited);
  assert.equal(approvalStatus(readPlan(dir)).drifted, true);
  assert.equal(approvedHash, contractHash(approved.contract));
});

test("mechanism, prototype, evidence and asset execution updates keep the approved hash stable", () => {
  const dir = root();
  const plan = completePlan(dir);
  plan.contract.mechanismFallbacks = [{
    id: "rail", location: "home/work", primaryImplementation: "A scroll-controlled editorial rail transforms media.",
    primaryAcceptance: ["Distinct start, active and resolved states."], fallbackImplementation: "Three governed semantic states.",
    fallbackTrigger: "Verified runtime failure prevents the primary rail.", triggerEvidenceRequired: ["browser failure trace"],
    userReapprovalRequired: false, allowedSubstitutions: ["semantic-states"], riskFamily: "pinned-scroll", prototypePolicy: "required",
  }];
  plan.contract.prototypeContracts = [{
    id: "rail-prototype", riskFamily: "pinned-scroll", mechanismId: "rail", required: true,
    uncertainty: "Pin release and mobile lifecycle behavior.", acceptanceConditions: ["Pin releases without trapping scroll."],
    maximumScope: "One representative section.", failureImplications: "Use only the approved semantic-states fallback.",
  }];
  plan.contract.assetStrategy = [{
    id: "hero", intendedRole: "Editorial hero photograph", requiredSubjectAndComposition: "Coffee roasting with right-side negative space.",
    priority: "external-sourced", sourcingPolicy: "external-first", generationPolicy: "allowed-with-advantage", generationRationale: "",
    classification: "static-image", rightsRequirements: ["Commercial web use"], expectedFormatsAndVariants: ["AVIF desktop", "WebP mobile"],
    requiredLocations: ["home/hero"], reusePolicy: "Hero only.", suitableExternalMediaCouldExist: true,
  }];
  writePlan(dir, plan);
  approvePlan(dir);
  const approved = readPlan(dir);
  const hash = approved.approval.contractHash;
  approved.execution.mechanisms.push({ id: "rail", status: "pending", finalReason: "", triggerObserved: false, triggerEvidenceIds: [], observedImplementation: "", observedEvidenceIds: [], substitutionUsed: null, approvalReference: null, criticVerdict: "pending" });
  approved.execution.prototypes.push({ id: "rail-prototype", status: "passed", attemptCount: 1, evidenceIds: ["prototype"], observedResults: ["Pin releases."], correctiveIterations: [], implementationDecision: "Deliver primary." });
  approved.execution.assets.push({ id: "hero", sourcingAttempts: [{ provider: "confirmed-search", query: "coffee roast editorial", at: new Date().toISOString(), result: "candidates" }], preSearchExemption: "", candidatesFound: [{ url: "https://example.com", rights: "licensed" }], selectedSource: "https://example.com", generatedDetails: "", actualFiles: ["hero.webp"], actualSizes: { "hero.webp": 1000 }, productionDerivatives: ["hero.webp"], usageLocations: ["home/hero"], browserObserved: true, survivedFinalImplementation: true, removedOrSubstituted: false, finalRightsRecord: "licensed", shipping: true });
  approved.execution.evidence.transformations.push("rail transformation");
  writePlan(dir, approved);
  assert.equal(approvalStatus(readPlan(dir)).approved, true);
  assert.equal(contractHash(readPlan(dir).contract), hash);
});

test("Dogfood pre-authorization remains explicit and never claims human review", () => {
  const dir = root();
  const plan = completePlan(dir);
  writePlan(dir, plan);
  const approved = approvePlan(dir, { mode: "pre-authorized-dogfood", origin: "explicit-preauthorization", provenance: {
    authority: "prompt-preauthorized", sourceType: "host-event", sourceId: "event-before-plan",
    contentHash: "a".repeat(64), assuranceLevel: "local", scope: ["contract", "dogfood"],
    recordedAt: new Date(Date.parse(plan.contract.createdAt!) - 1000).toISOString(), contentRecordedBeforePlanning: true,
  } });
  assert.equal(approved.approval.approvalMode, "pre-authorized-dogfood");
  assert.equal(approved.approval.approvalOrigin, "explicit-preauthorization");
  assert.equal(approved.approval.approvedBy, "dogfood-preauthorization");
});

test("changing a primary mechanism or treatment allocation changes the contract hash", () => {
  const plan = completePlan(root());
  plan.contract.mechanismFallbacks = [{ id: "rail", location: "home", primaryImplementation: "Primary scroll rail transforms the route.", primaryAcceptance: ["Observable states"], fallbackImplementation: "Governed semantic states.", fallbackTrigger: "Verified runtime failure.", triggerEvidenceRequired: ["trace"], userReapprovalRequired: false, allowedSubstitutions: [], riskFamily: "scroll", prototypePolicy: "auto" }];
  const original = contractHash(plan.contract);
  plan.contract.mechanismFallbacks[0].primaryImplementation = "A different primary carousel replaces the rail.";
  assert.notEqual(contractHash(plan.contract), original);
  const second = contractHash(plan.contract);
  plan.contract.treatmentAllocation[0].locations.push("home/footer");
  assert.notEqual(contractHash(plan.contract), second);
});

test("v3-v6 plans migrate or produce precise diagnostics", () => {
  for (const version of [3, 4, 5, 6]) {
    const result = migrateLegacyPlan(root(), { version, tier: version === 3 ? "solid" : "premium", depth: "restructure", scope: "substantial", projectKind: "redesign", skills: ["ux", "mobile"], pages: [{ id: "home", sections: [{ id: "hero", layoutFamily: "split" }] }], designRead: { concept: "A migrated editorial route." } });
    assert.equal(result.plan.version, 9);
    assert.ok(result.diagnostics.some((item) => item.includes("unapproved v9")));
  }
  assert.throws(() => migrateLegacyPlan(root(), { version: 2 }), /expected v3-v8/);
});

test("canonical v7 migration produces clear v9 review guidance", () => {
  const dir = root();
  const current = completePlan(dir);
  const legacy = {
    version: 7,
    contract: {
      ...current.contract,
      treatmentAllocation: current.contract.treatmentAllocation.map(({ routeRole, ...item }) => item),
      mechanismFallbacks: [{ mechanism: "scroll roast sequence", fallback: "three semantic states", approved: true }],
    },
    approval: current.approval,
    execution: current.execution,
  };
  const result = migrateLegacyPlan(dir, legacy);
  assert.equal(result.plan.version, 9);
  assert.equal(result.plan.approval.status, "pending");
  assert.ok(result.diagnostics.some((item) => item.includes("capability preflight")));
  assert.equal(result.plan.contract.mechanismFallbacks[0].userReapprovalRequired, true);
});

test("v8 migration moves mutable outcomes into execution and preserves exact approval lineage", () => {
  const dir = root();
  const current = completePlan(dir);
  const legacy: any = JSON.parse(JSON.stringify(current));
  legacy.version = 8;
  delete legacy.contract.treatmentDecisions;
  legacy.contract.mechanismFallbacks = [{
    id: "rail", location: "home/work", primaryImplementation: "Scroll-controlled roast sequence.", primaryAcceptance: ["Distinct sequence states"],
    fallbackImplementation: "Three semantic still states.", fallbackTrigger: "Verified decode failure.", triggerEvidenceRequired: ["trace"],
    userReapprovalRequired: false, finalStatus: "primary-delivered", finalReason: "Observed.", observedEvidenceIds: ["rail-final"],
  }];
  legacy.contract.prototypeContracts = [{ id: "rail-prototype", riskFamily: "frame-sequence", mechanismId: "rail", required: true, status: "passed", validates: "Decode and scrub work.", limitations: "One browser only.", evidenceIds: ["prototype"] }];
  legacy.contract.assetStrategy = [{ id: "hero", intendedRole: "Hero image", requiredSubjectAndComposition: "Coffee bag cutout with exact lighting.", priority: "generated", sourcingAttempted: false, candidateSources: [], generationChosen: true, generationRationale: "Exact brand-specific packaging requires a transparent cutout with controlled lighting.", classification: "spatial-cutout", sourcePath: "hero.webp", productionDerivatives: ["hero.webp"], usedAt: ["home/hero"], survivedFinalImplementation: true, shipping: true }];
  legacy.approval = { ...legacy.approval, status: "approved", contractHash: contractHash(legacy.contract), approvedAt: new Date().toISOString(), approvedBy: "user" };
  const migrated = migrateLegacyPlan(dir, legacy);
  assert.equal(migrated.plan.version, 9);
  assert.equal(migrated.plan.approval.status, "approved");
  assert.equal(migrated.plan.contract.mechanismFallbacks[0] && "finalStatus" in migrated.plan.contract.mechanismFallbacks[0], false);
  assert.equal(migrated.plan.execution.mechanisms[0].status, "primary-delivered");
  assert.equal(migrated.plan.execution.prototypes[0].status, "passed");
  assert.equal(migrated.plan.execution.assets[0].survivedFinalImplementation, true);
  assert.equal(migrated.plan.approval.contractHash, contractHash(migrated.plan.contract));
});

test("ambiguous migration sources and mismatched visual direction are rejected", () => {
  const dir = root();
  fs.mkdirSync(path.join(dir, ".dreative", "runs", "night"), { recursive: true });
  const legacy: any = completePlan(dir);
  legacy.version = 8;
  delete legacy.contract.treatmentDecisions;
  legacy.execution.run = { contractTitle: "Night Shift", runId: "night" };
  fs.writeFileSync(path.join(dir, ".dreative", "plan.json"), JSON.stringify(legacy));
  fs.writeFileSync(path.join(dir, ".dreative", "runs", "night", "plan.json"), JSON.stringify(legacy));
  assert.throws(() => runPlanCommand(dir, ["migrate"]), /ambiguous/);
  assert.throws(() => runPlanCommand(dir, ["migrate", "--source-plan", ".dreative/plan.json"]), /lineage mismatch/);
});

test("validation rejects unresolved target and material intake", () => {
  const dir = root();
  const plan = createPlan(dir, { workflow: { ambition: "standard", execution: "lean", prototype: "auto", purpose: "project-delivery" } });
  plan.contract.target.previewUrl = null;
  plan.contract.target.previewCommand = null;
  const errors = validateCanonicalPlan(plan);
  assert.ok(errors.some((item) => item.includes("previewUrl or previewCommand")));
  assert.ok(errors.some((item) => item.includes("routeScope.routes")));
});

test("concise structurally complete planning passes without prose padding", () => {
  const errors = validateCanonicalPlan(completePlan(root()));
  assert.deepEqual(errors, []);
});

test("a verbose browser-test description cannot replace executable assertions", () => {
  const plan = completePlan(root());
  plan.contract.requirementTraceability![0].actions = [];
  plan.contract.requirementTraceability![0].assertions = [];
  plan.contract.requirementTraceability![0].browserTest = "Open every route and very carefully test that the complete premium cinematic responsive experience works exactly as intended.";
  assert.ok(validateCanonicalPlan(plan).some((item) => item.includes("PLAN_MISSING_EXECUTABLE_ASSERTIONS")));
});

test("aesthetic vocabulary is not a prose blacklist", () => {
  const plan = completePlan(root());
  plan.contract.selectedConcept = "A premium cinematic immersive rail enhances the responsive comparison journey.";
  plan.contract.creativeDirection!.selectedConcept = plan.contract.selectedConcept;
  assert.ok(!validateCanonicalPlan(plan).some((item) => /premium|cinematic|immersive|responsive|enhance/i.test(item)));
});

test("recurring subjects require a continuity purpose", () => {
  const plan = completePlan(root());
  plan.contract.subjectInventory![0].continuityPurpose = "";
  assert.ok(validateCanonicalPlan(plan).some((item) => item.includes("PLAN_RECURRING_SUBJECT_WITHOUT_PURPOSE")));
});
