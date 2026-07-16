import fs from "node:fs";
import path from "node:path";
import {
  AMBITIONS,
  EXECUTIONS,
  PLAN_FILE,
  PROTOTYPES,
  PURPOSES,
  TREATMENTS,
  approvalStatus,
  approvePlan,
  createPlan,
  exportPlanJson,
  migrateLegacyPlan,
  planPath,
  readPlan,
  reconcileApproval,
  validateCanonicalPlan,
  writePlan,
  type CanonicalPlan,
  type PlanTarget,
} from "../shared/planGovernance.js";
import type { SpecialistSkill } from "../shared/skillSystem.js";
import { renderCompleteTreatmentReview } from "../shared/treatments.js";
import type { WorkflowConfiguration } from "../shared/workflow.js";
import { CAPABILITY_IDS, CAPABILITY_STATES, detectProjectPreflight, parseCapabilitiesFile, renderCreativeCapabilityPreflight, type CapabilityInput, type CreativeCapabilityId, type CapabilityStatus } from "../shared/preflight.js";
import { parse } from "yaml";

const value = (args: string[], flag: string) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const values = (raw: string | undefined) => raw?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

export const INTAKE_TEXT = `Before concept planning, Dreative resolves four independent controls:

Ambition
- Standard — strong professional design with restrained originality.
- Expressive — visibly authored composition with purposeful motion and interaction.
- Award — a distinctive experience with structural or transformational motion, media or spatial behaviour.
- Experimental — Award-level foundations plus a small number of unconventional provocations and higher creative variance.

Execution
- Fast — smallest safe workflow for early work.
- Lean — recommended quality workflow.
- Full Audit — broader traceability, performance and certification evidence. Full Audit controls evidence, not visual ambition.

Prototype
- Skip — build directly.
- Auto — recommended; prototype only uncertain mechanisms.
- Required — prototype the most technically uncertain mechanism before integration.

Purpose
- Project Delivery
- Production Certification
- Dreative Dogfood

Creative sources
- References — do you have reference URLs/files, no references, or want Dreative to suggest directions?
- Generated images — allowed, not allowed, or ask before each asset?
- Sourced images — may Dreative use externally sourced/licensed images, or ask first?
- Generated video — allowed, not allowed, or ask before each asset?
- Sourced video — may Dreative use externally sourced/licensed video, or ask first?
- 3D assets and props — not allowed, supplied only, external sourcing allowed, generation and sourcing allowed, or ask before each asset?
- Supplied assets — record image, video and 3D files separately, plus known missing or needed assets.`;

export function unresolvedCreativeSourceQuestions(args: string[]): string[] {
  const questions: string[] = [];
  if (!value(args, "--references") && !args.includes("--no-references") && !args.includes("--suggest-references"))
    questions.push("References: Do you have reference URLs/files, no references, or should Dreative suggest directions? Use --references, --no-references, or --suggest-references.");
  if (!value(args, "--generated-images")) questions.push("Generated images: allowed, not allowed, or ask before each asset? Use --generated-images allow|deny|ask.");
  if (!value(args, "--sourced-images")) questions.push("Sourced images: may Dreative use externally sourced/licensed images, or ask first? Use --sourced-images allow|deny|ask.");
  if (!value(args, "--generated-video")) questions.push("Generated video: allowed, not allowed, or ask before each asset? Use --generated-video allow|deny|ask.");
  if (!value(args, "--sourced-video")) questions.push("Sourced video: may Dreative use externally sourced/licensed video, or ask first? Use --sourced-video allow|deny|ask.");
  if (!value(args, "--3d-assets")) questions.push("3D assets/props: choose not-allowed, supplied-only, external-sourcing-allowed, generation-and-sourcing-allowed, or ask-per-asset with --3d-assets.");
  if (!value(args, "--package-install")) questions.push("Package installation: may Dreative install runtime packages? Use --package-install allow|deny. This does not grant media or authoring permission.");
  return questions;
}

function parseWorkflow(args: string[]): Partial<WorkflowConfiguration> {
  return {
    ambition: value(args, "--ambition") as WorkflowConfiguration["ambition"] | undefined,
    execution: value(args, "--execution") as WorkflowConfiguration["execution"] | undefined,
    prototype: value(args, "--prototype") as WorkflowConfiguration["prototype"] | undefined,
    purpose: value(args, "--purpose") as WorkflowConfiguration["purpose"] | undefined,
  };
}

function missingWorkflow(workflow: Partial<WorkflowConfiguration>): string[] {
  const missing: string[] = [];
  if (!workflow.ambition) missing.push("Ambition");
  if (!workflow.execution) missing.push("Execution");
  if (!workflow.prototype) missing.push("Prototype");
  if (!workflow.purpose) missing.push("Purpose");
  return missing;
}

function parseTreatments(args: string[], substantial: boolean): { treatments: SpecialistSkill[]; explicitAll: boolean; explicitDecision: boolean } {
  const raw = value(args, "--treatments");
  if (!raw) return { treatments: substantial ? [] : ["ux", "mobile"], explicitAll: false, explicitDecision: !substantial };
  if (raw.toLowerCase() === "all") return { treatments: [...TREATMENTS], explicitAll: true, explicitDecision: true };
  const treatments = values(raw) as SpecialistSkill[];
  const unknown = treatments.filter((item) => !TREATMENTS.includes(item));
  if (unknown.length) throw new Error(`unknown treatment(s): ${unknown.join(", ")}`);
  return { treatments: [...new Set<SpecialistSkill>(treatments)], explicitAll: false, explicitDecision: true };
}

function capabilityInputs(projectDir: string, args: string[]): CapabilityInput[] {
  const result: CapabilityInput[] = [];
  const file = value(args, "--capabilities-file");
  if (file) result.push(...parseCapabilitiesFile(path.resolve(projectDir, file)));
  for (let index = 0; index < args.length; index++) {
    if (args[index] !== "--capability") continue;
    const declaration = args[index + 1] ?? "";
    const [id, state] = declaration.split("=");
    if (!CAPABILITY_IDS.includes(id as CreativeCapabilityId)) throw new Error(`unknown capability id: ${id}`);
    if (!CAPABILITY_STATES.includes(state as CapabilityStatus)) throw new Error(`invalid capability state: ${state}`);
    result.push({
      id: id as CreativeCapabilityId, state: state as CapabilityStatus,
      provider: state === "available-through-confirmed-tool" ? value(args, `--capability-provider-${id}`) ?? "cli-declared-tool" : undefined,
      package: state === "available-after-package-install" ? value(args, `--capability-package-${id}`) ?? id : undefined,
      verified: ["available", "available-through-confirmed-tool", "unavailable", "permission-denied", "runtime-verification-failed"].includes(state),
    });
  }
  return result;
}

function permission(raw: string | undefined): "allowed" | "not-allowed" | "ask-per-asset" | null {
  if (!raw) return null;
  const aliases: Record<string, "allowed" | "not-allowed" | "ask-per-asset"> = {
    allow: "allowed", allowed: "allowed", yes: "allowed",
    deny: "not-allowed", denied: "not-allowed", no: "not-allowed", "not-allowed": "not-allowed",
    ask: "ask-per-asset", "ask-per-asset": "ask-per-asset",
  };
  if (!aliases[raw]) throw new Error(`invalid media permission: ${raw}; use allow, deny, or ask`);
  return aliases[raw];
}

function init(projectDir: string, args: string[]): number {
  const workflow = parseWorkflow(args);
  const missing = missingWorkflow(workflow);
  if (missing.length) {
    console.error(INTAKE_TEXT);
    console.error(`\nMissing required workflow control(s): ${missing.join(", ")}. A substantial user-facing run cannot silently default them.`);
    return 2;
  }
  for (const [key, allowed] of Object.entries({ ambition: AMBITIONS, execution: EXECUTIONS, prototype: PROTOTYPES, purpose: PURPOSES })) {
    const selected = workflow[key as keyof WorkflowConfiguration] as string;
    if (!(allowed as string[]).includes(selected)) throw new Error(`invalid ${key}: ${selected}`);
  }
  const routes = values(value(args, "--routes"));
  const target: Partial<PlanTarget> = {
    previewUrl: value(args, "--preview-url") ?? null,
    previewCommand: value(args, "--preview-command") ?? null,
    routeScope: { mode: routes.length > 1 ? "selected-routes" : "one-page", routes },
    baselineUrls: values(value(args, "--baseline-urls")),
  };
  const creativeQuestions = unresolvedCreativeSourceQuestions(args);
  if (creativeQuestions.length) {
    console.error("Unresolved creative-source intake blocks contract creation:");
    creativeQuestions.forEach((question) => console.log(`- ${question}`));
    console.error("No .dreative/plan.yaml was written. Resolve permission separately from runtime and authoring capability, then re-run planning.");
    return 2;
  }
  const substantial = !args.includes("--tiny");
  const treatmentSelection = parseTreatments(args, substantial);
  console.log(renderCompleteTreatmentReview(treatmentSelection.treatments, routes));
  if (!treatmentSelection.explicitDecision) {
    console.error("\nMissing explicit treatment selection. Recommendations are not approval, and UX/Mobile cannot silently substitute for an optional-treatment decision.");
    console.error("No .dreative/plan.yaml was written. Re-run with --treatments <comma-list> or --treatments all --confirm-all.");
    return 2;
  }
  const generatedImages = permission(value(args, "--generated-images"));
  const sourcedImages = permission(value(args, "--sourced-images"));
  const generatedVideo = permission(value(args, "--generated-video"));
  const sourcedVideo = permission(value(args, "--sourced-video"));
  const threeD = value(args, "--3d-assets");
  const allowed3d = ["not-allowed", "supplied-only", "external-sourcing-allowed", "generation-and-sourcing-allowed", "ask-per-asset"];
  if (threeD && !allowed3d.includes(threeD)) throw new Error(`invalid --3d-assets: ${threeD}`);
  const packagePermission = value(args, "--package-install");
  if (packagePermission && !["allow", "deny"].includes(packagePermission)) throw new Error("invalid --package-install: use allow or deny");
  const capabilityPreflight = detectProjectPreflight(projectDir, {
    permissions: {
      generatedImagesAllowed: generatedImages === "allowed",
      externalImagesAllowed: sourcedImages === "allowed",
      generatedVideoAllowed: generatedVideo === "allowed",
      externalVideoAllowed: sourcedVideo === "allowed",
      threeDPolicy: threeD === "ask-per-asset" ? "not-allowed" : threeD as "not-allowed" | "supplied-only" | "external-sourcing-allowed" | "generation-and-sourcing-allowed",
      packageInstallationAllowed: packagePermission === "allow",
    },
    explicitCapabilities: capabilityInputs(projectDir, args),
  });
  console.log(renderCreativeCapabilityPreflight(capabilityPreflight));
  if (treatmentSelection.explicitAll && !args.includes("--confirm-all")) {
    console.error("\nExplicit all-treatment selection requires confirmation after the complete allocation and capability preflight. No .dreative/plan.yaml was written. Re-run with --confirm-all.");
    return 2;
  }
  const plan = createPlan(projectDir, {
    workflow: workflow as WorkflowConfiguration,
    target,
    substantial,
    projectKind: args.includes("--from-scratch") ? "from-scratch" : "redesign",
    transformationDepth: (value(args, "--depth") as CanonicalPlan["contract"]["transformationDepth"]) ?? "restructure",
    treatments: treatmentSelection.treatments,
    treatmentDecisionExplicit: treatmentSelection.explicitDecision,
    allTreatmentsExplicit: treatmentSelection.explicitAll,
    allTreatmentsConfirmed: treatmentSelection.explicitAll && args.includes("--confirm-all"),
  });
  const references = values(value(args, "--references"));
  plan.contract.creativeSources.references.preference = args.includes("--no-references")
    ? "none"
    : references.length
      ? "provided"
      : args.includes("--suggest-references")
        ? "open-to-suggestions"
        : null;
  plan.contract.creativeSources.references.urls = references;
  plan.contract.creativeSources.references.notes = values(value(args, "--reference-notes"));
  plan.contract.creativeSources.references.antiReferences = values(value(args, "--anti-references"));
  plan.contract.creativeSources.generatedImages = generatedImages;
  plan.contract.creativeSources.sourcedImages = sourcedImages;
  plan.contract.creativeSources.generatedVideo = generatedVideo;
  plan.contract.creativeSources.sourcedVideo = sourcedVideo;
  plan.contract.creativeSources.threeDAssets = threeD as typeof plan.contract.creativeSources.threeDAssets ?? null;
  plan.contract.creativeSources.suppliedImageAssets = values(value(args, "--supplied-images"));
  plan.contract.creativeSources.suppliedVideoAssets = values(value(args, "--supplied-video"));
  plan.contract.creativeSources.suppliedThreeDAssets = values(value(args, "--supplied-3d"));
  plan.contract.creativeSources.missingOrNeededAssets = values(value(args, "--missing-assets"));
  plan.contract.scope.dependencyInstallationAllowed = packagePermission ? packagePermission === "allow" : null;
  plan.contract.capabilityPreflight = capabilityPreflight;
  writePlan(projectDir, plan);
  console.log(`Created editable plan at ${PLAN_FILE}.`);
  console.log(`Workflow: ${workflow.ambition} ambition, ${workflow.execution} execution, ${workflow.prototype} prototype, ${workflow.purpose}.`);
  console.log(`Treatments: ${treatmentSelection.treatments.join(", ")}.`);
  console.log("Capability preflight separates permissions, runtime packages, sourcing and authoring tools. Installing Three.js or GSAP does not add model, video or motion-authoring capability.");
  const errors = validateCanonicalPlan(plan);
  if (errors.length) {
    console.log("Planning intake remains incomplete:");
    errors.forEach((item) => console.log(`- ${item}`));
    console.log("Edit .dreative/plan.yaml, then run dreative plan validate. Approval is required before substantial source implementation.");
  }
  return 0;
}

function validate(projectDir: string): number {
  try {
    const plan = readPlan(projectDir);
    if (reconcileApproval(plan)) writePlan(projectDir, plan);
    const errors = validateCanonicalPlan(plan);
    if (errors.length) { errors.forEach((item) => console.error(`ERROR ${item}`)); return 1; }
    console.log(`${PLAN_FILE} is valid.`);
    return 0;
  } catch (error) { console.error(String(error)); return 1; }
}

function status(projectDir: string): number {
  const plan = readPlan(projectDir);
  if (reconcileApproval(plan)) writePlan(projectDir, plan);
  const status = approvalStatus(plan);
  console.log(JSON.stringify({
    file: PLAN_FILE, version: plan.version, workflow: plan.contract.workflow, routes: plan.contract.target.routeScope.routes,
    treatments: plan.contract.selectedTreatments, approval: plan.approval.status, contractHash: status.currentHash,
    approvedHash: status.approvedHash, drifted: status.drifted, currentPhase: plan.execution.currentPhase,
  }, null, 2));
  return status.approved ? 0 : 1;
}

function diff(projectDir: string): number {
  const plan = readPlan(projectDir);
  const drifted = approvalStatus(plan).drifted;
  if (reconcileApproval(plan)) writePlan(projectDir, plan);
  const status = approvalStatus(plan);
  if (!status.approvedHash) {
    console.log("No approved contract revision exists. The entire contract is pending approval.");
    return 1;
  }
  console.log(drifted
    ? `CONTRACT DRIFT: approved ${status.approvedHash}, current ${status.currentHash}. Write a material change request and re-approve before continuing.`
    : `No contract drift. Approved contract hash ${status.approvedHash}.`);
  return drifted ? 1 : 0;
}

function migrate(projectDir: string, args: string[]): number {
  const explicit = value(args, "--source-plan") ?? value(args, "--from");
  const candidates = [
    path.join(projectDir, ".dreative", "plan.yaml"),
    path.join(projectDir, ".dreative", "plan.json"),
    ...findRunPlans(path.join(projectDir, ".dreative", "runs")),
  ].filter((file) => fs.existsSync(file));
  if (!explicit && candidates.length !== 1) throw new Error(`migration source is ambiguous; candidates:\n${candidates.map((item) => `- ${item}`).join("\n")}\nUse --source-plan <path> or --run-id <id>.`);
  const runId = value(args, "--run-id");
  const selected = runId ? candidates.filter((item) => item.includes(`${path.sep}runs${path.sep}${runId}${path.sep}`)) : explicit ? [path.resolve(projectDir, explicit)] : candidates;
  if (selected.length !== 1) throw new Error(`migration source selection resolved ${selected.length} plans; use an exact --source-plan`);
  const source = selected[0];
  if (!source.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(source)) throw new Error(`missing legacy plan: ${source}`);
  let legacy: unknown;
  try { legacy = source.endsWith(".yaml") ? parse(fs.readFileSync(source, "utf8")) : JSON.parse(fs.readFileSync(source, "utf8")); }
  catch (error) { throw new Error(`source plan cannot be parsed: ${String(error)}`); }
  const sourcePlan = legacy as any;
  const sourceHash = sourcePlan?.approval?.contractHash ?? (sourcePlan?.contract ? "unapproved" : "legacy");
  const runTitle = sourcePlan?.execution?.run?.contractTitle;
  const direction = sourcePlan?.contract?.selectedConcept;
  if (runTitle && direction && runTitle !== direction) throw new Error(`migration lineage mismatch: run identity "${runTitle}" differs from contract direction "${direction}". Select the corresponding source plan explicitly; approval will not be fabricated.`);
  const result = migrateLegacyPlan(projectDir, legacy);
  writePlan(projectDir, result.plan);
  console.log(`MIGRATION source path: ${source}`);
  console.log(`MIGRATION source version: ${String(sourcePlan?.version)}`);
  console.log(`MIGRATION source direction: ${direction || "unknown"}`);
  console.log(`MIGRATION source contract hash: ${sourceHash}`);
  console.log(`MIGRATION target version: ${result.plan.version}`);
  result.diagnostics.forEach((item) => console.log(`MIGRATION ${item}`));
  console.log(`Wrote ${planPath(projectDir)}.`);
  return 0;
}

function findRunPlans(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) return findRunPlans(absolute);
    return /^plan\.(?:yaml|json)$/.test(entry.name) ? [absolute] : [];
  });
}

export function runPlanCommand(projectDir: string, args: string[]): number {
  const subcommand = args[0] ?? "status";
  switch (subcommand) {
    case "init": return init(projectDir, args.slice(1));
    case "validate": return validate(projectDir);
    case "status": return status(projectDir);
    case "diff": return diff(projectDir);
    case "approve": {
      const plan = approvePlan(projectDir, value(args, "--by") ?? "user");
      console.log(`Approved contract revision ${plan.approval.revision}: ${plan.approval.contractHash}`);
      return 0;
    }
    case "export-json": {
      const output = value(args, "--output");
      const json = exportPlanJson(readPlan(projectDir));
      if (output) fs.writeFileSync(path.resolve(projectDir, output), json); else console.log(json.trimEnd());
      return 0;
    }
    case "migrate": return migrate(projectDir, args.slice(1));
    default: throw new Error("usage: dreative plan init|validate|status|diff|approve|export-json|migrate");
  }
}
