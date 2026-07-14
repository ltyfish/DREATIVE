import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkCriticArtifacts, checkRedesignQualityArtifacts, checkVerificationCoverage, runDirectDesignAudit } from "./audit.js";
import type { DirectDesignPlan, VerificationReport } from "../shared/artifacts.js";

test("direct-design audit verifies artifacts and preservation needles", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-audit-"));
  try {
    fs.mkdirSync(path.join(root, ".dreative"));
    fs.mkdirSync(path.join(root, "src"));
    fs.writeFileSync(path.join(root, "src", "App.tsx"), 'export const App = () => <a href="/pricing">Pricing</a>;');
    fs.writeFileSync(
      path.join(root, ".dreative", "plan.json"),
      JSON.stringify({
        version: 2,
        request: "Polish pricing",
        createdAt: new Date().toISOString(),
        tier: "solid",
        depth: "restyle",
        skills: ["ux", "mobile"],
        skillPolicy: { mode: "hybrid", global: ["ux", "mobile"], routingApproved: true, userAssignments: [] },
        designRead: { register: "product", concept: "clear value", signature: "pricing rail" },
        preservationManifest: ".dreative/preservation.json",
        decisionLedger: ".dreative/ledger.json",
        pages: [
          {
            id: "pricing-page",
            name: "Pricing page",
            skills: ["ux", "mobile"],
            sections: [
              {
                id: "pricing",
                name: "Pricing",
                layoutFamily: "comparison",
                skills: ["ux", "mobile"],
                interactions: [],
                mobile: "stacked plans",
                fallback: "semantic table",
                verification: ["Pricing link remains"],
                assets: [],
                status: "shipped",
              },
            ],
          },
        ],
      }),
    );
    fs.writeFileSync(
      path.join(root, ".dreative", "preservation.json"),
      JSON.stringify({
        version: 1,
        createdAt: new Date().toISOString(),
        items: [{ id: "pricing-link", kind: "link", file: "src/App.tsx", needle: 'href="/pricing"', purpose: "Pricing navigation" }],
      }),
    );
    fs.writeFileSync(path.join(root, ".dreative", "ledger.json"), JSON.stringify({ version: 1, entries: [] }));
    fs.writeFileSync(
      path.join(root, ".dreative", "verify.json"),
      JSON.stringify({
        version: 1,
        generatedAt: new Date().toISOString(),
        evidence: [
          {
            id: "pricing-link",
            criterion: "Pricing link remains",
            status: "pass",
            evidence: "Clicked /pricing in production build",
            proof: { timestamp: new Date().toISOString(), testedUrl: "http://localhost:3000/pricing", consoleErrorCount: 0 },
          },
        ],
      }),
    );

    const report = runDirectDesignAudit(root);
    assert.equal(report.ok, true, JSON.stringify(report.findings));
    assert.ok(report.findings.some((item) => item.check === "migration" && item.level === "warning"));

    const verifyFile = path.join(root, ".dreative", "verify.json");
    const verify = JSON.parse(fs.readFileSync(verifyFile, "utf-8"));
    verify.evidence[0].proof.artifactPath = ".dreative/screenshots/missing.png";
    fs.writeFileSync(verifyFile, JSON.stringify(verify));
    const missingArtifact = runDirectDesignAudit(root);
    assert.equal(missingArtifact.ok, false);
    assert.ok(missingArtifact.findings.some((item) => item.message.includes("evidence artifact is missing")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("v3 audit associates criteria by id, page, section, kind, and viewport", () => {
  const criterion = { id: "depth", claim: "Architecture matches delta", kind: "structural-depth" as const, pageId: "outlets", sectionId: "workspace", viewports: ["desktop" as const] };
  const plan = {
    version: 3,
    doctrineVersion: 3,
    depth: "restructure",
    pages: [{ id: "outlets", name: "Outlets", mobileBlueprint: { verificationChecks: ["no-horizontal-overflow"] }, sections: [{ id: "workspace", name: "Workspace", verification: [criterion] }] }],
  } as DirectDesignPlan;
  const makeEvidence = (id: string, kind: "responsive" | "preservation" | "structural-depth", viewportClass: "desktop" | "mobile" | "narrow-mobile") => ({
    id,
    criterion: id,
    criterionId: id === "depth-proof" ? "depth" : id,
    pageId: "outlets",
    sectionId: id === "depth-proof" ? "workspace" : undefined,
    kind,
    viewportClass,
    mobileChecks: viewportClass === "desktop" ? undefined : ["no-horizontal-overflow" as const],
    status: "pass" as const,
    evidence: "Browser and test evidence",
    proof: { timestamp: new Date().toISOString(), viewport: { width: viewportClass === "desktop" ? 1280 : viewportClass === "mobile" ? 390 : 320, height: 844 }, artifactPath: `.dreative/${id}.png` },
  });
  const report: VerificationReport = {
    version: 2,
    generatedAt: new Date().toISOString(),
    evidence: [
      makeEvidence("desktop", "responsive", "desktop"),
      makeEvidence("mobile", "responsive", "mobile"),
      makeEvidence("narrow", "responsive", "narrow-mobile"),
      makeEvidence("preserved", "preservation", "desktop"),
      makeEvidence("depth-proof", "structural-depth", "desktop"),
    ],
  };
  assert.deepEqual(checkVerificationCoverage(plan, report), []);
  plan.pages[0].mobileBlueprint!.verificationChecks.push("touch-targets");
  assert.ok(checkVerificationCoverage(plan, report).some((item) => item.message.includes("touch-targets")));
  plan.pages[0].mobileBlueprint!.verificationChecks.pop();
  report.evidence[4].sectionId = "wrong-section";
  assert.ok(checkVerificationCoverage(plan, report).some((item) => item.message.includes("criterion depth")));
});

test("v4 redesign audit rejects removed design equity without stronger final evidence", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-equity-"));
  try {
    fs.mkdirSync(path.join(root, ".dreative"));
    for (const name of ["before-desktop.png", "before-mobile.png", "check-desktop.png", "check-mobile.png"]) fs.writeFileSync(path.join(root, ".dreative", name), "proof");
    const equity = { version: 1, capturedAt: "2026-07-14T00:00:00.000Z", baselineQuality: "exceptional", screenshots: { desktop: [".dreative/before-desktop.png"], mobile: [".dreative/before-mobile.png"] }, strongestVisualQualities: ["Distinctive animated feature ledger"], weakestVisualQualities: ["Dense footer on narrow screens"], typographyCharacter: "High-contrast serif italics establish an editorial brand voice.", colorMaterialCharacter: "Warm paper and deep ink produce a tactile editorial material system.", compositionalStrengths: ["Feature rows choreograph content and media together"], hierarchyAndPacing: "Tight typographic clusters alternate with active feature transitions.", signatureVisualElements: ["Animated feature ledger"], animationInteractionInventory: ["Feature selection transforms contextual media"], mobileStrengthsAndFailures: ["Headline remains distinctive while feature media compresses"], distinctivePatterns: ["Editorial ledger interaction"], genericOrDatedPatterns: ["Conventional footer columns"], items: [{ id: "ledger", quality: "Animated feature ledger is the recognizable interaction signature.", decision: "intentionally-remove", rationale: "The replacement is intended to carry the same product explanation.", replacementOrEvolution: "A new operational route should visibly surpass the ledger interaction.", successCriteria: ["Users can control an equally distinctive product explanation"], finalEvidenceIds: [] }] };
    fs.writeFileSync(path.join(root, ".dreative", "design-equity.json"), JSON.stringify(equity));
    const critique = Object.fromEntries(["distinctiveness", "hierarchy", "brandVisibility", "signatureLegibility", "equityRetention", "saasTemplateRisk", "brandSwapRisk", "mobileAuthorship", "motionPurpose", "counterfactualStrength"].map((key) => [key, `Concrete ${key} observation compares the checkpoint against the rendered baseline.`]));
    fs.writeFileSync(path.join(root, ".dreative", "checkpoint.json"), JSON.stringify({ version: 1, capturedAt: "2026-07-14T00:20:00.000Z", implementation: { hero: true, coreSection: true, desktop: true, mobile: true, primaryMotionLanguage: true }, baselineScreenshotPaths: [".dreative/before-desktop.png"], screenshotPaths: { desktop: [".dreative/check-desktop.png"], mobile: [".dreative/check-mobile.png"] }, critique, meaningfulWeaknessFound: false, refinements: [], approval: { status: "approved", approvedAt: "2026-07-14T00:25:00.000Z", transcriptReferences: ["chat:checkpoint"] }, systemSpreadStartedAt: "2026-07-14T00:26:00.000Z" }));
    const plan = { version: 4, doctrineVersion: 4, scope: "substantial", projectKind: "redesign", depth: "restructure", implementationStartedAt: "2026-07-14T00:11:00.000Z", approval: { status: "approved", approvedAt: "2026-07-14T00:10:00.000Z" }, designEquity: ".dreative/design-equity.json", checkpoint: ".dreative/checkpoint.json" } as DirectDesignPlan;
    const report = { version: 3, generatedAt: "2026-07-14T01:00:00.000Z", evidence: [], perceptualComparison: { baselineEvidenceIds: ["before"], finalEvidenceIds: ["after"], observations: {}, weaknesses: [], refinementEvidenceIds: [], equityDecisionEvidence: [], signatureEvidenceIds: ["signature"] } } as unknown as VerificationReport;
    const findings = checkRedesignQualityArtifacts(root, plan, report);
    assert.ok(findings.some((item) => item.message.includes("ledger: final evidence is required")));
    assert.ok(findings.some((item) => item.message.includes("removal needs a demonstrably stronger replacement or explicit approval")));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("v4 audit gate rejects implementation that predates approval", () => {
  const plan = { version: 4, doctrineVersion: 4, scope: "substantial", projectKind: "from-scratch", implementationStartedAt: "2026-07-14T00:09:00.000Z", approval: { status: "approved", approvedAt: "2026-07-14T00:10:00.000Z" } } as DirectDesignPlan;
  const findings = checkRedesignQualityArtifacts(process.cwd(), plan, undefined);
  assert.ok(findings.some((item) => item.check === "approval" && item.level === "error"));
});

test("v5 critic stage is required before completion and accepts an objective pass", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-critic-audit-"));
  try {
    fs.mkdirSync(path.join(root, ".dreative"));
    for (const name of ["desktop.png", "mobile.png"]) fs.writeFileSync(path.join(root, ".dreative", name), "proof");
    const input = { version: 1, generatedAt: "2026-07-14T02:00:00.000Z", originalBrief: "Create an authored editorial product website for this brand.", userConstraints: [], approvedConcept: "A product ledger controls composition and interaction across the story.", visualBlueprints: [{ pageId: "home", sectionId: "hero", blueprint: "An offset ledger connects the hero product state to later editorial chapters." }], intendedSignature: "Product ledger", baselineAvailable: false, evidence: [{ id: "desktop", kind: "final-screenshot", description: "Final desktop", artifactPath: ".dreative/desktop.png", viewport: { width: 1440, height: 900 } }, { id: "mobile", kind: "final-screenshot", description: "Final mobile", artifactPath: ".dreative/mobile.png", viewport: { width: 390, height: 844 } }], contextPolicy: { firstPass: "objective-only", excluded: ["builder-self-review", "implementation-rationale", "quality-claims", "difficulty-excuses", "builder-score"] } };
    fs.writeFileSync(path.join(root, ".dreative", "critic-input.json"), JSON.stringify(input));
    const report = { version: 1, reviewedAt: "2026-07-14T02:10:00.000Z", inputArtifact: ".dreative/critic-input.json", contextIsolation: { mode: "isolated-prompt", independentReadingRecordedAt: "2026-07-14T02:08:00.000Z", limitation: "The host did not expose fresh-subagent execution, so a closed isolated prompt was used." }, reviewContext: { availableInputs: ["brief", "concept", "desktop", "mobile"], missingInputs: ["motion"], viewportsInspected: ["1440x900", "390x844"], pagesOrFlowsInspected: ["home"], motionInspected: false, limitations: ["No motion evidence"] }, independentReading: { perceivedConcept: "An editorial ledger organizes the product narrative.", perceivedSignature: "The ledger visibly connects hero and content chapters.", perceivedBrandCharacter: "Precise operational structure meets editorial warmth.", perceivedMotionRole: "Motion was not directly available and is not judged." }, initialVerdict: "PASS", verdict: "PASS", strongestQualities: [], findings: [], baselineRegressions: [], conceptFidelityFindings: [], mobileFindings: [], motionFindings: [], requiredRevisionSet: [], nonBlockingExperiments: [], dogfood: { falsePositives: [], vagueFindings: [], humanMisses: [], styleConvergenceRisk: [], complexityBias: [], motionEvidenceRisk: ["No motion evidence"], experimentsForRecipes: [] } };
    fs.writeFileSync(path.join(root, ".dreative", "visual-critic.json"), JSON.stringify(report));
    const plan = { version: 5, doctrineVersion: 5, scope: "substantial", projectKind: "from-scratch", criticInput: ".dreative/critic-input.json", visualCritic: ".dreative/visual-critic.json" } as DirectDesignPlan;
    assert.deepEqual(checkCriticArtifacts(root, plan), []);
    assert.ok(checkCriticArtifacts(root, plan, { version: 3, generatedAt: "2026-07-14T02:05:00.000Z", evidence: [] }).some((item) => item.message.includes("before final verification")));
    report.verdict = "MAJOR REVISION REQUIRED";
    fs.writeFileSync(path.join(root, ".dreative", "visual-critic.json"), JSON.stringify(report));
    assert.ok(checkCriticArtifacts(root, plan).some((item) => item.message.includes("completion is blocked")));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
