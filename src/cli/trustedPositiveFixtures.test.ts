import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { approvePlan, createPlan, writePlan } from "../shared/planGovernance.js";
import { detectProjectPreflight } from "../shared/preflight.js";
import { runTrustedVerification } from "./verify.js";
import { installSkill } from "./installSkill.js";
import { runFinalize } from "./finalize.js";
import { runTrustedCritic } from "./criticRun.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;

function fixture(motion: boolean): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), motion ? "dreative-motion-positive-" : "dreative-minimal-positive-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({
    name: "trusted-positive",
    version: "1.0.0",
    scripts: { build: "node -e \"process.exit(0)\"" },
  }));
  fs.writeFileSync(path.join(root, "src", "App.js"), motion
    ? `addEventListener("scroll",()=>document.documentElement.style.setProperty("--progress",String(scrollY))); export const MotionRail="motion-rail";`
    : `export const Ready="ready-state";`);
  fs.writeFileSync(path.join(root, "index.html"), motion
    ? `<main><section style="height:120vh"><h1>Motion Rail</h1></section><section id="motion-rail" style="height:120vh;transform:translateX(calc(var(--progress,0)*.02px))">Resolved state</section></main><script>addEventListener("scroll",()=>document.documentElement.style.setProperty("--progress",scrollY))</script>`
    : `<main><h1>Ready</h1><button>Continue</button></main>`);
  const port = 42000 + Math.floor(Math.random() * 10000);
  fs.writeFileSync(path.join(root, "server.mjs"), `import http from "node:http";import fs from "node:fs";http.createServer((q,s)=>{s.setHeader("content-type","text/html");s.end(fs.readFileSync("index.html"))}).listen(${port},"127.0.0.1");`);
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: `http://127.0.0.1:${port}`, previewCommand: "node server.mjs", routeScope: { mode: "one-page", routes: ["/"] } },
    substantial: false, projectKind: "from-scratch", transformationDepth: "restyle",
    treatments: motion ? ["motion"] : [], treatmentDecisionExplicit: true,
  });
  plan.contract.scope.dependencyInstallationAllowed = false;
  plan.contract.scope.requiredFunctionality = [motion ? "Scroll changes the rail composition." : "The ready state and action render."];
  plan.contract.scope.successCriteria = [motion ? "The rail has captured start and progressed states." : "Ready is captured at desktop and mobile sizes."];
  plan.contract.creativeSources = { references: { preference: "none", urls: [], notes: [], antiReferences: [] }, generatedImages: "not-allowed", sourcedImages: "not-allowed", generatedVideo: "not-allowed", sourcedVideo: "not-allowed", threeDAssets: "not-allowed", suppliedImageAssets: [], suppliedVideoAssets: [], suppliedThreeDAssets: [], missingOrNeededAssets: [] };
  plan.contract.capabilityPreflight = detectProjectPreflight(root);
  plan.contract.selectedConcept = motion ? "A single editorial rail visibly changes composition with page progress." : "A direct utility state makes the primary action immediately clear.";
  plan.contract.blueprint = [{ pageId: "home", sectionId: "main", intent: motion ? "Transform the rail with progress." : "Present Ready and Continue." }];
  plan.contract.motionAndMediaStrategy = motion ? "Native scroll owns one structural rail transformation." : "No motion or primary media is required.";
  plan.contract.mobileTranslation = motion ? "The rail follows vertical progress at 390px." : "The direct hierarchy fits 390px.";
  for (const allocation of plan.contract.treatmentAllocation) {
    allocation.locations = ["home/main"]; allocation.contribution = `${allocation.treatment} keeps the fixture observable and usable.`;
    allocation.acceptance = [`${allocation.treatment} has trusted browser evidence.`];
  }
  plan.contract.requirementTraceability = [{
    id: motion ? "REQ-MOTION" : "REQ-MINIMAL", source: "fixture requirement",
    wording: motion ? "Scroll changes the rail composition." : "The ready state and action render.",
    plannedImplementation: motion ? "Native scroll updates the motion rail." : "Semantic main content renders Ready and Continue.",
    routeOrComponent: "home/main", browserTest: motion ? "Scroll to the midpoint." : "Open the route.",
    evidenceId: motion ? "motion-runtime" : "ready-runtime", status: "verified",
    actions: motion ? [{ action: "scroll", value: "600" }] : [{ action: "press", value: "Tab" }],
    assertions: motion
      ? [{ type: "visible", selector: "#motion-rail" }, { type: "mechanism-state", selector: "#motion-rail", expected: "matrix", mechanismId: "motion-rail" }]
      : [{ type: "text-contains", selector: "main", expected: "Ready" }, { type: "visible", selector: "button" }],
  }];
  plan.contract.verificationPlan = {
    viewports: [{ name: "desktop", width: 1280, height: 800 }, { name: "mobile", width: 390, height: 844 }],
    interactions: motion ? [{ id: "motion-midpoint", route: "/", action: "scroll", value: "600", mechanismId: "motion-rail" }] : [{ id: "open", route: "/", action: "press", value: "Tab" }],
    mechanismStates: motion ? ["start", "active", "resolved"] : ["ready"], mobileTests: ["No overflow"],
    reducedMotionTests: ["Content remains available"], accessibilityChecks: ["Keyboard focus"],
    performanceChecks: ["Navigation duration"], mediaNetworkChecks: ["No failed requests"],
    criticInputs: ["Desktop and mobile captures"], finalizationBlockers: ["Missing required browser evidence"],
  };
  if (motion) {
    plan.contract.mechanismContracts = [{
      id: "motion-rail", catalogueSourceOrCustomRationale: "Custom native scroll rail for a bounded fixture.", routeOrSection: "home/main",
      inputDriver: "scroll-progress", startState: "Rail begins aligned with the opening title.", activeState: "Rail translates as scroll progress advances.",
      endState: "Rail resolves in the second section.", reverseBehavior: "Reverse scroll restores the prior rail position.",
      rapidInputBehavior: "Native scroll remains clamped to document bounds.", refreshAtProgressBehavior: "Browser scroll restoration determines progress.",
      mobileBehavior: "Vertical touch scroll drives the same rail.", reducedMotionBehavior: "Content remains legible without relying on interpolation.",
      dependency: "Native browser scroll event.", performanceExpectation: "One CSS custom property update per scroll event.",
      approvedFallback: "Static resolved rail remains in normal document flow.", fallbackTrigger: "Scroll events unavailable in the trusted runner.",
      requiredCaptureStates: ["start", "active", "mobile", "reduced-motion"], successCriteria: ["Start and progressed screenshots differ."],
      failureCriteria: ["Rail never responds to scroll."],
    }];
    plan.execution.bindings.push({ id: "motion-binding", treatment: "motion", files: ["src/App.js"], selectors: ["#motion-rail"], mechanism: "native scroll rail", evidenceIds: ["motion-runtime"] });
    plan.execution.evidence.transformations = ["Rail translates with scroll progress."];
    plan.execution.evidence.sceneHandoffs = ["Opening section hands off to the resolved rail section."];
    plan.execution.evidence.motionVocabulary = ["structural-scroll-translation"];
    plan.execution.evidence.treatmentObservations.motion = { start: ["Rail aligned with title"], active: ["Rail advances across the viewport"], resolved: ["Rail settles in section two"], inputEffect: ["Scroll changes layout position"], mobile: ["Touch scroll drives rail"], fallback: ["Static resolved rail"] };
  }
  plan.execution.evidence.treatmentEvidence = motion
    ? { ux: ["motion-runtime"], mobile: ["motion-runtime"], motion: ["motion-runtime"] }
    : { ux: ["ready-runtime"], mobile: ["ready-runtime"] };
  writePlan(root, plan);
  approvePlan(root);
  installSkill({ sourceDir, projectDir: root, packageVersion, target: "claude", selected: plan.contract.selectedTreatments, explicitAll: false });
  return root;
}

function critic(root: string, motion: boolean, verificationManifestPath: string): void {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, verificationManifestPath), "utf8"));
  const desktop = manifest.artifacts.find((item: any) => item.type === "screenshot" && item.id.startsWith("desktop"));
  const mobile = manifest.artifacts.find((item: any) => item.type === "screenshot" && item.id.startsWith("mobile"));
  const reduced = manifest.artifacts.find((item: any) => item.id === "reduced-motion");
  const trace = manifest.artifacts.find((item: any) => item.type === "trace");
  const input: any = {
    version: 1, generatedAt: new Date().toISOString(), originalBrief: motion ? "Build a real scroll-driven motion fixture with trusted captures." : "Build a legitimate minimal fixture with trusted captures.",
    userConstraints: [], approvedConcept: motion ? "A single editorial rail visibly changes composition with page progress." : "A direct utility state makes the primary action immediately clear.",
    visualBlueprints: [{ pageId: "home", sectionId: "main", blueprint: motion ? "The editorial rail moves between opening and resolved document sections." : "The semantic ready state and primary action form one clear composition." }],
    intendedSignature: motion ? "Editorial motion rail" : "Direct ready state", baselineAvailable: false,
    evidence: [
      { id: "desktop", kind: "final-screenshot", description: "Trusted final desktop capture", artifactPath: desktop.path, viewport: { width: 1280, height: 800 } },
      { id: "mobile", kind: "final-screenshot", description: "Trusted final mobile capture", artifactPath: mobile.path, viewport: { width: 390, height: 844 } },
      ...(motion ? [
        { id: "trace", kind: "browser-trace", description: "Trusted scroll interaction trace", artifactPath: trace.path, motionMomentId: "motion-rail", temporal: { startTimestamp: manifest.startedAt, endTimestamp: manifest.finishedAt } },
        { id: "reduced", kind: "reduced-motion-capture", description: "Trusted reduced motion composition", artifactPath: reduced.path, viewport: { width: 390, height: 844 } },
      ] : []),
    ],
    contextPolicy: { firstPass: "objective-only", excluded: ["builder-self-review", "implementation-rationale", "quality-claims", "difficulty-excuses", "builder-score"] },
    independentCriticRequired: true,
    ...(motion ? { motionRequired: true, motionMomentIds: ["motion-rail"], verificationRunId: manifest.runId, buildIdentityHash: manifest.sourceHash } : {}),
  };
  fs.writeFileSync(path.join(root, ".dreative", "critic.json"), JSON.stringify({ version: 1, input }, null, 2));
  const now = new Date();
  const readAt = new Date(now.getTime() - 1000).toISOString();
  const report: any = {
    version: 1, reviewedAt: now.toISOString(), inputArtifact: ".dreative/runs/closed/critic-input.json",
    contextIsolation: { mode: "fresh-subagent", independentReadingRecordedAt: readAt, limitation: "The separate fixture critic used only the closed objective artifact." },
    reviewContext: { availableInputs: motion ? ["desktop", "mobile", "trace", "reduced motion"] : ["desktop", "mobile"], missingInputs: [], viewportsInspected: ["1280x800", "390x844"], pagesOrFlowsInspected: ["home"], motionInspected: motion, limitations: [] },
    independentReading: { perceivedConcept: motion ? "A compact editorial rail connects opening and resolved sections." : "A direct ready state presents one primary action.", perceivedSignature: motion ? "The rail responds to page progress." : "The ready state is the clear signature.", perceivedBrandCharacter: "The fixture is restrained, functional and intentionally composed.", perceivedMotionRole: motion ? "Motion provides the structural handoff between sections." : "Motion is not required for this minimal fixture." },
    initialVerdict: "PASS", verdict: "PASS", strongestQualities: [], findings: [], baselineRegressions: [], conceptFidelityFindings: [], mobileFindings: [], motionFindings: [], requiredRevisionSet: [], nonBlockingExperiments: [],
    ...(motion ? { temporalAssessment: { firstViewportResponsive: true, developsBeyondEntrances: true, crossSectionHandoffs: true, signatureDevelops: true, interactionPhysical: true, primarilyStaticStack: false, symbolicDowngrades: [], evidenceIds: ["trace"] } } : {}),
  };
  fs.writeFileSync(path.join(root, "critic-worker.mjs"), `import fs from "node:fs";fs.writeFileSync(process.env.DREATIVE_CRITIC_OUTPUT,${JSON.stringify(JSON.stringify(report))});`);
  const result = runTrustedCritic(root, "node critic-worker.mjs");
  assert.ok(fs.existsSync(path.join(root, result.manifestPath)));
}

for (const motion of [false, true]) test(`${motion ? "motion" : "minimal"} fixture finalizes with Dreative-owned real browser captures`, async () => {
  const root = fixture(motion);
  const run = await runTrustedVerification(root, { browserCommand: "node server.mjs", packageVersion });
  assert.ok(fs.existsSync(path.join(root, run.manifestPath)));
  critic(root, motion, run.manifestPath);
  const result = runFinalize(root, { target: "claude", sourceDir, packageVersion });
  assert.equal(result.ok, true, result.blockers.join("\n"));
});
