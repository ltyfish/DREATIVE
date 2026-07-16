import test from "node:test";
import assert from "node:assert/strict";
import { configurationFromArgs, resolveAdaptiveSpreadValidation, resolveWorkflowConfiguration, resolveWorkflowPolicy, selectPrototypeRisks, shouldCreatePrototype, verificationStatesFor, type WorkflowConfiguration } from "./workflow.js";

const configurations: WorkflowConfiguration[] = [
  { ambition: "award", execution: "lean", prototype: "skip", purpose: "project-delivery" },
  { ambition: "experimental", execution: "lean", prototype: "auto", purpose: "project-delivery" },
  { ambition: "expressive", execution: "fast", prototype: "skip", purpose: "project-delivery" },
];

test("ambition, execution, prototype and purpose resolve independently", () => {
  for (const expected of configurations) assert.deepEqual(resolveWorkflowConfiguration(expected).configuration, expected);
});

test("safe defaults and legacy flags resolve without interaction", () => {
  assert.deepEqual(resolveWorkflowConfiguration({}, { tier: "award" }).configuration, { ambition: "award", execution: "lean", prototype: "auto", purpose: "project-delivery" });
  assert.equal(resolveWorkflowConfiguration({}, { fullAudit: true }).configuration.execution, "full-audit");
  assert.equal(resolveWorkflowConfiguration({}, { prototype: true }).configuration.prototype, "required");
  assert.equal(resolveWorkflowConfiguration({}, { skipPrototype: true }).configuration.prototype, "skip");
  assert.equal(resolveWorkflowConfiguration({}, { dogfood: true }).configuration.purpose, "dreative-dogfood");
});

test("shared policy keeps Lean compact and separates Full Audit from Dogfood", () => {
  const lean = resolveWorkflowPolicy(configurations[0]);
  assert.deepEqual(lean.artifacts, ["plan.yaml", "critic.json", "verify.json"]);
  assert.deepEqual(lean.representativeWidths, [1440, 390]);
  const audit = resolveWorkflowPolicy({ ...configurations[0], execution: "full-audit", purpose: "production-certification" });
  assert.ok(audit.artifacts.includes("certification.json"));
  assert.equal(audit.collectBehaviourEvidence, false);
  const dogfood = resolveWorkflowPolicy({ ...configurations[0], purpose: "dreative-dogfood" });
  assert.ok(dogfood.artifacts.includes("behaviour-analysis.json"));
  assert.equal(dogfood.collectBehaviourEvidence, true);
});

test("prototype Auto and verification evidence are risk-based", () => {
  const auto = configurations[1];
  assert.equal(shouldCreatePrototype(auto, ["simple-motion"]), false);
  assert.equal(shouldCreatePrototype(auto, ["canvas-webgl"]), true);
  assert.equal(shouldCreatePrototype({ ...auto, prototype: "required" }, ["static"]), true);
  assert.equal(shouldCreatePrototype({ ...auto, prototype: "skip" }, ["canvas-webgl"]), false);
  assert.deepEqual(verificationStatesFor("simple-motion"), ["start", "midpoint", "end"]);
  assert.ok(!verificationStatesFor("static").includes("midpoint"));
  assert.ok(verificationStatesFor("canvas-webgl", true).includes("performance"));
});

test("CLI flags resolve non-interactively and legacy aliases stay explicit", () => {
  assert.deepEqual(configurationFromArgs(["--ambition", "award", "--execution", "lean", "--prototype", "skip", "--purpose", "project-delivery"]).configuration, configurations[0]);
  assert.equal(configurationFromArgs(["--full-audit"]).configuration.execution, "full-audit");
  assert.throws(() => configurationFromArgs(["--execution", "maximum"]), /invalid --execution/);
});

test("adaptive spread asks for recordings and reverse evidence only when relevant", () => {
  const configuration = { ambition: "experimental", execution: "full-audit", prototype: "auto", purpose: "dreative-dogfood" } as const;
  const staticProof = resolveAdaptiveSpreadValidation(configuration);
  assert.equal(staticProof.continuousRecording, false);
  assert.equal(staticProof.reverseScroll, false);
  assert.equal(staticProof.approval, "explicit");
  const persistent = resolveAdaptiveSpreadValidation(configuration, { persistentAcrossChapters: true, mobileChoreographyDiffers: true, reversible: true });
  assert.equal(persistent.continuousRecording, true);
  assert.equal(persistent.mobileRecording, true);
  assert.equal(persistent.reverseScroll, true);
});

test("lean delivery validates spread internally and prototypes one unresolved family", () => {
  const configuration = { ambition: "experimental", execution: "lean", prototype: "auto", purpose: "project-delivery" } as const;
  assert.equal(resolveAdaptiveSpreadValidation(configuration).approval, "internal");
  const selected = selectPrototypeRisks(configuration, [
    { id: "webgl", family: "webgl-shader", risk: "canvas-webgl", unresolved: true },
    { id: "sequence", family: "frame-sequence", risk: "frame-sequence", unresolved: true },
  ]);
  assert.deepEqual(selected.map((item) => item.id), ["webgl"]);
});
