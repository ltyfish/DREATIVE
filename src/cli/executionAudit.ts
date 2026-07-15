import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { compareBuildIdentity, computeCurrentIdentity, type BuildIdentity } from "../shared/projectIdentity.js";
import type { DirectDesignPlan, VerificationEvidence, VerificationReport } from "../shared/artifacts.js";
import type { AuditFinding } from "./audit.js";

const error = (check: string, message: string): AuditFinding => ({ level: "error", check, message });
const warning = (check: string, message: string): AuditFinding => ({ level: "warning", check, message });
const hashFile = (file: string) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const safeFile = (root: string, relative: string) => {
  const absolute = path.resolve(root, relative);
  return absolute.startsWith(path.resolve(root) + path.sep) ? absolute : null;
};

function packageState(projectDir: string): { pkg: any; lock: string } {
  const packageFile = path.join(projectDir, "package.json");
  const pkg = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, "utf8")) : {};
  const lockfile = ["pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb", "package-lock.json"].find((name) => fs.existsSync(path.join(projectDir, name)));
  return { pkg, lock: lockfile ? fs.readFileSync(path.join(projectDir, lockfile), "utf8") : "" };
}

function sourceText(projectDir: string, relative: string): string {
  const file = safeFile(projectDir, relative);
  return file && fs.existsSync(file) && fs.statSync(file).isFile() ? fs.readFileSync(file, "utf8") : "";
}

export function checkExecutionContracts(projectDir: string, plan: DirectDesignPlan, verification?: VerificationReport): AuditFinding[] {
  if (plan.version !== 6) return [];
  const findings: AuditFinding[] = [];
  const { pkg, lock } = packageState(projectDir);
  const allDependencies = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) } as Record<string, string>;
  const owners = new Set([...(plan.runtimeBindings ?? []).map((item) => item.id), ...(plan.motionMoments ?? []).map((item) => item.id), ...(plan.mediaTransformations ?? []).map((item) => item.id)]);
  for (const stack of plan.runtimeStack ?? []) {
    if (!stack.mechanism || !stack.reason || stack.ownerIds.length === 0) findings.push(error("runtime-stack", "each runtime mechanism needs a reason and owner"));
    for (const owner of stack.ownerIds) if (!owners.has(owner)) findings.push(error("runtime-stack", `${stack.mechanism}: unknown owner ${owner}`));
    for (const dependency of stack.requiredPackages) {
      if (!pkg[dependency.dependencySection]?.[dependency.name]) findings.push(error("runtime-dependency", `${dependency.name} is absent from ${dependency.dependencySection}`));
      if (!lock.includes(dependency.name)) findings.push(error("runtime-dependency", `${dependency.name} is absent from the active lockfile`));
      const importingFiles = stack.integrationFiles.filter((file) => new RegExp(`(?:from\\s+|require\\(|import\\s*\\()?["']${dependency.name.replaceAll("/", "\\/")}`).test(sourceText(projectDir, file)));
      if (importingFiles.length === 0) findings.push(error("runtime-dependency", `${dependency.name} is installed but has no production import in its declared integration files`));
      if (allDependencies[dependency.name] && dependency.compatibleVersion && !compatible(allDependencies[dependency.name], dependency.compatibleVersion)) findings.push(error("runtime-dependency", `${dependency.name} ${allDependencies[dependency.name]} is incompatible with planned ${dependency.compatibleVersion}`));
    }
    if (stack.installationStatus !== "installed" && stack.requiredPackages.length > 0) findings.push(error("runtime-stack", `${stack.mechanism}: dependency installation is not complete`));
    if (stack.importUseStatus !== "used") findings.push(error("runtime-stack", `${stack.mechanism}: import/use is not proven`));
  }

  const selected = new Set(plan.skills);
  const coverage = new Map((plan.skillCoverage ?? []).map((entry) => [entry.skill, entry]));
  for (const skill of selected) {
    const item = coverage.get(skill);
    if (!item) { findings.push(error("skill-coverage", `selected skill ${skill} has no substantive owner`)); continue; }
    if (!item.pageIds.length || !item.sectionIds.length || !item.implementationFiles.length || !item.components.length || item.contribution.trim().length < 20 || !item.evidenceIds.length)
      findings.push(error("skill-coverage", `${skill} exists only as a label; concrete page, section, file, component, contribution, and evidence ownership are required`));
    for (const file of item.implementationFiles) if (!sourceText(projectDir, file)) findings.push(error("skill-coverage", `${skill}: owning file is missing: ${file}`));
    for (const id of item.relatedOwnerIds) if (!owners.has(id)) findings.push(error("skill-coverage", `${skill}: unknown implementation owner ${id}`));
  }
  if (plan.allSkillsExplicit) {
    const required = ["ux", "mobile", "refined", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"];
    for (const skill of required) if (!selected.has(skill as any)) findings.push(error("skill-coverage", `explicit all selection was silently pruned: ${skill}`));
  }

  for (const binding of plan.runtimeBindings ?? []) {
    const source = sourceText(projectDir, binding.sourceFile);
    if (!source) { findings.push(error("runtime-binding", `${binding.id}: source file missing at ${binding.sourceFile}`)); continue; }
    const selectorValue = binding.selector.replace(/^\[|\]$/g, "").split("=")[1]?.replace(/["']/g, "") ?? binding.selector.replace(/^[.#]/, "");
    if (!source.includes(selectorValue)) findings.push(error("runtime-binding", `${binding.id}: stable runtime selector is not emitted by ${binding.sourceFile}`));
    if (!source.includes(binding.component)) findings.push(error("runtime-binding", `${binding.id}: owning component ${binding.component} is not present`));
    for (const dependency of binding.dependencies) if (!allDependencies[dependency]) findings.push(error("runtime-binding", `${binding.id}: required package ${dependency} is not installed`));
    for (const asset of binding.assets) {
      const file = safeFile(projectDir, asset);
      if (!file || !fs.existsSync(file) || fs.statSync(file).size === 0) findings.push(error("runtime-asset", `${binding.id}: missing or empty runtime asset ${asset}`));
      else if (!source.includes(path.basename(asset)) && !source.includes(asset)) findings.push(error("runtime-asset", `${binding.id}: asset exists but is never loaded by its owner: ${asset}`));
    }
    if (/animation\s*:/i.test(source) && !/IntersectionObserver|whileInView|ScrollTrigger|useInView|animation-play-state/i.test(source) && binding.kind === "motion")
      findings.push(error("above-fold-trigger", `${binding.id}: CSS animation auto-runs without a visibility/runtime trigger and may finish offscreen`));
  }

  const ambitious = plan.configuration?.ambition === "award" || plan.configuration?.ambition === "experimental" || plan.tier === "award";
  if (ambitious) {
    if (!plan.foundation?.passed) findings.push(error("foundation", "ambitious implementation foundation has not passed"));
    if (plan.foundation && verification?.buildIdentity && plan.foundation.sourceRevisionHash !== verification.buildIdentity.sourceTreeHash) findings.push(error("foundation", "foundation evidence belongs to another source revision"));
    const journey = plan.awardJourney;
    if (!journey) findings.push(error("award", "observable Award journey is missing"));
    else {
      if (journey.structuralMomentIds.length < 2) findings.push(error("award", "Award requires at least two structural or transformational moments"));
      if (journey.persistentSectionIds.length < 2) findings.push(error("award", "the persistent signature must develop across at least two compositions"));
      if (Object.values(journey.temporalArc).some((value) => value.trim().length < 8)) findings.push(error("award", "setup, anticipation, transformation, rest, handoff, and resolution must be authored"));
      const momentById = new Map((plan.motionMoments ?? []).map((item) => [item.id, item]));
      for (const id of journey.structuralMomentIds) if (!['structural','transformational'].includes(momentById.get(id)?.class ?? "")) findings.push(error("award", `${id} is not structural or transformational`));
      for (const id of [journey.firstViewportMomentId, journey.finalResolutionMomentId]) if (!momentById.has(id)) findings.push(error("award", `journey moment is not implemented: ${id}`));
      const signature = momentById.get(journey.firstViewportMomentId);
      if (signature && /tiny|small pointer parallax|slow.*rotat|fade|translate.*opacity/i.test(`${signature.purpose} ${signature.renderingMechanism}`)) findings.push(error("award", `${signature.id}: decorative micro-motion cannot serve as the Award signature`));
    }
  }

  if (verification?.reconciliation) {
    const planned = new Set((plan.runtimeBindings ?? []).map((item) => item.id));
    for (const id of planned) if (!verification.reconciliation.planned.includes(id)) findings.push(error("runtime-reconciliation", `${id} was omitted from reconciliation`));
    for (const id of verification.reconciliation.missing) findings.push(error("runtime-reconciliation", `planned runtime element is missing: ${id}`));
    for (const item of verification.reconciliation.substituted) if (!item.approved) findings.push(error("runtime-reconciliation", `${item.plannedId} was silently substituted by ${item.observedId}`));
  }
  return findings;
}

export function checkLegacyAmbitiousRuntime(projectDir: string, plan: DirectDesignPlan, verification?: VerificationReport): AuditFinding[] {
  if (plan.version >= 6 || plan.tier !== "award") return [];
  const findings: AuditFinding[] = [];
  const { pkg, lock } = packageState(projectDir);
  const dependencies = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const files = collectProductionFiles(projectDir);
  const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const planText = JSON.stringify(plan);
  if (/\bgsap\b/i.test(planText) && (!dependencies.gsap || !lock.includes("gsap") || !/from\s+["']gsap|require\(["']gsap/i.test(source))) findings.push(error("runtime-dependency", "legacy Award plan claims GSAP but the package, lockfile, and production import are not all present"));
  if (plan.skills.includes("3d") && !/three|@react-three\/fiber/i.test(Object.keys(dependencies).join(" ")) && !/<canvas|WebGLRenderingContext|THREE\./i.test(source)) findings.push(error("runtime-dependency", "selected 3d has no installed/imported Three.js/R3F or demonstrable production canvas/WebGL owner"));
  for (const page of plan.pages) for (const section of page.sections) {
    const marker = new RegExp(`(?:id|data-dreative-(?:id|section))\\s*=\\s*["'{]+${escape(section.id)}`, "i");
    if (!marker.test(source)) findings.push(error("runtime-reconciliation", `${page.name}/${section.name}: planned shipped section is absent from the production runtime (${section.id})`));
    const interactions = section.interactions.join(" ");
    if (/drag|swipe/i.test(interactions) && !/onPointerDown|pointerdown|setPointerCapture|touchmove|onTouchMove/i.test(source)) findings.push(error("interaction", `${section.id}: planned drag/swipe is not implemented; hover/focus rows do not satisfy it`));
    if (/quote reel/i.test(`${section.name} ${section.layoutFamily}`) && /previous|next/i.test(interactions) && !/review[^\n]{0,80}(previous|next)|(previous|next)[^\n]{0,80}review/i.test(source)) findings.push(error("interaction", `${section.id}: planned quote reel controls are absent; static quote columns do not satisfy it`));
    if (/sticky/i.test(`${section.layoutFamily} ${interactions}`) && !new RegExp(`id\\s*=\\s*["']${escape(section.id)}["']`).test(source)) findings.push(error("runtime-reconciliation", `${section.id}: planned sticky journey is absent from runtime`));
  }
  if (plan.skills.length === 10) {
    const material = [/<canvas|WebGL|THREE\./i, /onPointerDown|setPointerCapture|touchmove/i, /video|picture|img|background-image/i, /prefers-reduced-motion|useReducedMotion/i];
    if (material.some((pattern) => !pattern.test(source))) findings.push(error("skill-coverage", "all specialist skills were selected but the runtime lacks material 3D, input, media, or reduced-motion ownership"));
  }
  if (!verification || verification.version < 4) findings.push(error("build-identity", "legacy Award verification has no current source/package/lock/public/build identity and cannot prove this runtime"));
  return findings;
}

function escape(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function collectProductionFiles(root: string): string[] {
  const result: string[] = [];
  const visit = (current: string) => {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (["node_modules", ".git", ".dreative", "dist", "build", ".next"].includes(entry.name)) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolute); else if (/\.(?:[jt]sx?|vue|svelte|html|css|scss)$/.test(entry.name)) result.push(absolute);
    }
  };
  visit(root); return result;
}

function compatible(installed: string, planned: string): boolean {
  const major = (value: string) => value.match(/\d+/)?.[0];
  return !major(installed) || !major(planned) || major(installed) === major(planned);
}

export function checkBuildFreshness(projectDir: string, verification?: VerificationReport): AuditFinding[] {
  if (!verification || verification.version !== 4 || !verification.buildIdentity) return verification?.version === 4 ? [error("build-identity", "verify v4 is missing build identity")] : [];
  const actual = computeCurrentIdentity(projectDir, verification.buildIdentity);
  return compareBuildIdentity(verification.buildIdentity, actual).map((message) => error("build-identity", message));
}

export function checkTemporalEvidence(projectDir: string, plan: DirectDesignPlan, verification?: VerificationReport): AuditFinding[] {
  if (plan.version !== 6 || !verification) return [];
  const findings: AuditFinding[] = [];
  const groups = new Map<string, VerificationEvidence[]>();
  for (const item of verification.evidence) {
    if (item.proof?.artifactPath) {
      const file = safeFile(projectDir, item.proof.artifactPath);
      if (!file || !fs.existsSync(file)) findings.push(error("evidence-hash", `${item.id}: artifact is missing`));
      else if (!item.proof.artifactHash || hashFile(file) !== item.proof.artifactHash) findings.push(error("evidence-hash", `${item.id}: artifact hash is missing or stale`));
    }
    if (["motion", "interaction", "media-transformation"].includes(item.kind ?? "")) {
      if (!item.proof?.captureSource || (!item.proof.recordingPath && !item.proof.tracePath && !item.proof.captureManifestPath)) findings.push(error("temporal-evidence", `${item.id}: visual motion needs browser-grounded recording, trace, or capture manifest`));
      const key = item.motionMomentId ?? item.mediaTransformationId ?? item.sectionId ?? "unbound";
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
  }
  for (const moment of plan.motionMoments ?? []) {
    const items = groups.get(moment.id) ?? [];
    const states = new Set(items.map((item) => item.timelineState));
    if (![...states].some((state) => state === "initial" || state === "early") || !states.has("mid-transition") || ![...states].some((state) => state === "final" || state === "handoff")) findings.push(error("temporal-evidence", `${moment.id}: grounded start, meaningful intermediate, and resolved states are required`));
    const observations = items.map((item) => JSON.stringify(item.proof?.observedProperties ?? [])).filter((value) => value !== "[]");
    if (observations.length < 3 || new Set(observations).size < 3) findings.push(error("temporal-evidence", `${moment.id}: start, midpoint, and end must have distinct observed runtime values`));
    const hashes = items.map((item) => item.proof?.artifactHash).filter(Boolean);
    if (hashes.length >= 2 && new Set(hashes).size !== hashes.length) findings.push(error("temporal-evidence", `${moment.id}: reused frame evidence has different timeline labels`));
  }
  return findings;
}

export interface CertificationRecord {
  version: 1;
  buildIdentity: BuildIdentity;
  commands: { command: string; exitCode: number }[];
  auditResult: "pass" | "fail";
  unresolvedWarnings: string[];
  criticVerdict: string;
  verificationResult: "pass" | "fail";
  ambition: string;
  tierSatisfied: boolean;
  completionStatus: "complete" | "incomplete";
}

export function checkPolicyRecords(projectDir: string, plan: DirectDesignPlan, verification?: VerificationReport): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const full = plan.configuration?.execution === "full-audit";
  const dogfood = plan.configuration?.purpose === "dreative-dogfood";
  const certificationFile = path.join(projectDir, ".dreative", "certification.json");
  if (full) {
    if (!fs.existsSync(certificationFile)) findings.push(error("certification", "Full Audit requires certification.json"));
    else {
      try {
        const record = JSON.parse(fs.readFileSync(certificationFile, "utf8")) as CertificationRecord;
        if (record.version !== 1 || record.auditResult !== "pass" || record.verificationResult !== "pass" || !record.tierSatisfied || record.completionStatus !== "complete") findings.push(error("certification", "certification does not record a passing, honestly satisfied current build"));
        if (!verification?.buildIdentity || record.buildIdentity.sourceTreeHash !== verification.buildIdentity.sourceTreeHash || record.buildIdentity.runId !== verification.buildIdentity.runId) findings.push(error("certification", "certification belongs to another build or verification run"));
        if (record.commands.some((item) => item.exitCode !== 0)) findings.push(error("certification", "certification contains failing commands"));
      } catch (cause) { findings.push(error("certification", `cannot parse certification.json: ${String(cause)}`)); }
    }
  }
  if (dogfood) {
    const file = path.join(projectDir, ".dreative", "behaviour-analysis.json");
    if (!fs.existsSync(file)) findings.push(error("behaviour-analysis", "Dreative Dogfood requires behaviour-analysis.json"));
    else try {
      const value = JSON.parse(fs.readFileSync(file, "utf8"));
      const keys = ["requestedVersusDeliveredAmbition", "selectedVersusUsedSkills", "plannedVersusObservedMechanisms", "fallbackAndDowngradeBehaviour", "staleEvidenceAttempts", "criticMisses", "falsePositives", "overhead", "inactiveDoctrine", "recommendations"];
      if (value.version !== 1 || keys.some((key) => !Array.isArray(value[key]))) findings.push(error("behaviour-analysis", "Dogfood behaviour analysis is incomplete"));
    } catch (cause) { findings.push(error("behaviour-analysis", `cannot parse behaviour analysis: ${String(cause)}`)); }
  }
  return findings;
}
