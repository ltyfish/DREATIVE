import fs from "node:fs";
import path from "node:path";
import { detectProjectPreflight } from "../shared/preflight.js";
import { PLAN_FILE, PLAN_VERSION, approvalStatus, readPlan, validateCanonicalPlan, writePlan } from "../shared/planGovernance.js";
import { detectCompetingOwners } from "../shared/runtimeReliability.js";
import { checkSkillInstallation } from "./installSkill.js";

export interface DoctorReport { ok: boolean; checks: { name: string; ok: boolean; detail: string }[]; }

export function runDoctor(projectDir: string, options: { sourceDir: string; packageVersion: string; target: "claude" | "codex" }): DoctorReport {
  const checks: DoctorReport["checks"] = [];
  const installation = checkSkillInstallation({ sourceDir: options.sourceDir, projectDir, packageVersion: options.packageVersion, target: options.target });
  checks.push({ name: "installed-skill-manifest", ok: installation.length === 0, detail: installation.join("; ") || "exact manifest verified" });
  try {
    const plan = readPlan(projectDir);
    const errors = validateCanonicalPlan(plan);
    checks.push({ name: "schema-and-plan", ok: errors.length === 0, detail: errors.join("; ") || `canonical v${PLAN_VERSION} plan valid` });
    const approval = approvalStatus(plan);
    checks.push({ name: "contract-approval", ok: approval.approved, detail: approval.drifted ? "approved contract drifted" : approval.approved ? "contract hash current" : "plan is not approved" });
  } catch (error) { checks.push({ name: "schema-and-plan", ok: false, detail: String(error) }); }
  const preflight = detectProjectPreflight(projectDir);
  checks.push({ name: "package-runtime", ok: Boolean(preflight.packageManager && preflight.framework), detail: `${preflight.framework} via ${preflight.packageManager}; lockfile ${preflight.lockfile ?? "missing"}` });
  const source = ["src", "app", "pages", "components"].flatMap((dir) => {
    const root = path.join(projectDir, dir);
    if (!fs.existsSync(root)) return [];
    const visit = (current: string): string[] => fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? visit(path.join(current, entry.name)) : [path.join(current, entry.name)]);
    return visit(root).filter((file) => /\.(?:[jt]sx?|vue|svelte)$/.test(file));
  }).map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const owners = detectCompetingOwners(source);
  checks.push({ name: "ticker-scroll-owner", ok: owners.length === 0, detail: owners.length ? `competing owners: ${owners.join(", ")}` : "no competing owner pattern detected" });
  checks.push({ name: "browser-capture", ok: preflight.browserVerification, detail: preflight.browserVerification ? "browser/capture capability detected" : "browser/capture capability not detected in the project" });
  const packageFile = path.join(projectDir, "package.json");
  let packageOk = fs.existsSync(packageFile);
  if (packageOk) try { JSON.parse(fs.readFileSync(packageFile, "utf8")); } catch { packageOk = false; }
  checks.push({ name: "source-lockfile-health", ok: packageOk && Boolean(preflight.lockfile), detail: packageOk ? `package.json valid; ${preflight.lockfile ?? "lockfile missing"}` : "package.json missing or invalid" });
  return { ok: checks.every((item) => item.ok), checks };
}

export function resumePlan(projectDir: string): string {
  const plan = readPlan(projectDir);
  const phases = plan.execution.phases;
  const failed = phases.find((item) => item.status === "failed");
  if (failed) {
    failed.status = "pending";
    delete failed.error;
  }
  const next = phases.find((item) => item.status !== "completed");
  if (!next) return "All recorded phases are complete.";
  for (const phase of phases) if (phase.status === "in-progress" && phase.id !== next.id) phase.status = "pending";
  next.status = "in-progress";
  plan.execution.currentPhase = next.id;
  plan.execution.lastUpdatedAt = new Date().toISOString();
  writePlan(projectDir, plan);
  return `Resume from phase ${next.id}; completed phases remain unchanged.`;
}

export function printDoctor(report: DoctorReport): void {
  report.checks.forEach((item) => console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}: ${item.detail}`));
  console.log(report.ok ? "Dreative doctor passed." : "Dreative doctor found blockers.");
}
