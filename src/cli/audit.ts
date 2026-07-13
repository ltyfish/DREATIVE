import fs from "node:fs";
import path from "node:path";
import {
  validateDecisionLedger,
  validatePlan,
  validatePreservationManifest,
  validateVerificationReport,
  type DirectDesignPlan,
  type PreservationManifest,
} from "../shared/artifacts.js";
import { resolveSkillDependencies, type SpecialistSkill } from "../shared/skillSystem.js";

export interface AuditFinding {
  level: "error" | "warning";
  check: string;
  message: string;
}

export interface AuditReport {
  ok: boolean;
  findings: AuditFinding[];
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function finding(level: AuditFinding["level"], check: string, message: string): AuditFinding {
  return { level, check, message };
}

function checkArtifact(file: string, check: string, validate: (value: unknown) => string[]): AuditFinding[] {
  if (!fs.existsSync(file)) return [finding("error", check, `missing ${path.basename(file)}`)];
  try {
    return validate(readJson(file)).map((message) => finding("error", check, message));
  } catch (error) {
    return [finding("error", check, `cannot parse ${path.basename(file)}: ${String(error)}`)];
  }
}

function checkPreservation(projectDir: string, manifestFile: string): AuditFinding[] {
  const findings = checkArtifact(manifestFile, "preservation", validatePreservationManifest);
  if (findings.some((item) => item.level === "error")) return findings;
  const manifest = readJson(manifestFile) as PreservationManifest;
  for (const item of manifest.items) {
    if (item.intentionallyChanged) continue;
    const target = path.resolve(projectDir, item.file);
    if (!target.startsWith(path.resolve(projectDir) + path.sep)) {
      findings.push(finding("error", "preservation", `${item.id}: file escapes the project root`));
      continue;
    }
    if (!fs.existsSync(target)) {
      findings.push(finding("error", "preservation", `${item.id}: missing ${item.file}`));
      continue;
    }
    if (!fs.readFileSync(target, "utf-8").includes(item.needle))
      findings.push(finding("error", "preservation", `${item.id}: expected content is absent from ${item.file}`));
  }
  return findings;
}

function checkSkillClosure(plan: DirectDesignPlan): AuditFinding[] {
  const requested = plan.skills as SpecialistSkill[];
  const resolved = resolveSkillDependencies(requested);
  const missing = resolved.filter((skill) => !requested.includes(skill));
  return missing.length
    ? [finding("error", "skills", `missing required skill dependencies: ${missing.join(", ")}`)]
    : [];
}

function checkAssets(projectDir: string, plan: DirectDesignPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  for (const section of plan.sections) {
    for (const asset of section.assets) {
      if (asset.status !== "shipped") continue;
      const target = path.resolve(projectDir, asset.path);
      if (!target.startsWith(path.resolve(projectDir) + path.sep) || !fs.existsSync(target))
        findings.push(finding("error", "assets", `${section.name}/${asset.id}: shipped asset missing at ${asset.path}`));
    }
  }
  return findings;
}

const SOURCE_EXTENSIONS = new Set([".tsx", ".jsx", ".vue", ".svelte", ".html", ".css", ".scss"]);
const SKIP_DIRS = new Set([".git", ".dreative", "node_modules", "dist", "build", ".next", ".nuxt"]);

function collectSourceFiles(root: string, current = root): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...collectSourceFiles(root, absolute));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
}

function checkStaticQuality(projectDir: string, plan: DirectDesignPlan): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const files = collectSourceFiles(projectDir);
  let combined = "";
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    combined += `\n${source}`;
    const relative = path.relative(projectDir, file);
    for (const match of source.matchAll(/<img\b([^>]*?)>/gis)) {
      const attributes = match[1];
      if (!/\balt\s*=/.test(attributes)) findings.push(finding("error", "accessibility", `${relative}: image is missing alt`));
      if (!/\b(width|height)\s*=/.test(attributes) && !/\baspect-/.test(attributes))
        findings.push(finding("warning", "layout", `${relative}: image has no explicit dimensions or aspect token`));
    }
    if (/<(?:div|span)\b[^>]*\bonClick\s*=/is.test(source) && !/\b(role|tabIndex|onKeyDown)\s*=/is.test(source))
      findings.push(finding("warning", "accessibility", `${relative}: non-semantic click target may lack keyboard support`));
    if (/outline\s*:\s*none|outline-none/.test(source) && !/focus-visible/.test(source))
      findings.push(finding("warning", "accessibility", `${relative}: focus outline is removed without a visible replacement`));
    if (/href\s*=\s*["']#["']/.test(source)) findings.push(finding("warning", "navigation", `${relative}: placeholder href="#" remains`));
  }
  if (plan.skills.some((skill) => ["motion", "3d", "immersive", "cinematic", "experimental"].includes(skill))) {
    if (!/prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(combined))
      findings.push(finding("error", "motion", "selected effects require an implemented reduced-motion path"));
  }
  return findings;
}

export function runDirectDesignAudit(projectDir: string): AuditReport {
  const root = path.join(projectDir, ".dreative");
  const planFile = path.join(root, "plan.json");
  const findings = checkArtifact(planFile, "plan", validatePlan);
  if (!fs.existsSync(planFile) || findings.some((item) => item.level === "error"))
    return { ok: false, findings };

  const plan = readJson(planFile) as DirectDesignPlan;
  const preservationFile = path.resolve(projectDir, plan.preservationManifest);
  const ledgerFile = path.resolve(projectDir, plan.decisionLedger);
  const verificationFile = path.join(root, "verify.json");
  findings.push(...checkPreservation(projectDir, preservationFile));
  findings.push(...checkArtifact(ledgerFile, "ledger", validateDecisionLedger));
  findings.push(...checkArtifact(verificationFile, "verification", validateVerificationReport));
  findings.push(...checkSkillClosure(plan));
  findings.push(...checkAssets(projectDir, plan));
  findings.push(...checkStaticQuality(projectDir, plan));

  const verify = fs.existsSync(verificationFile) ? JSON.stringify(readJson(verificationFile)) : "";
  for (const section of plan.sections) {
    for (const criterion of section.verification) {
      if (!verify.includes(criterion))
        findings.push(finding("warning", "verification", `${section.name}: no evidence references criterion: ${criterion}`));
    }
  }
  return { ok: !findings.some((item) => item.level === "error"), findings };
}

export function printAudit(report: AuditReport, json: boolean) {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  if (report.findings.length === 0) console.log("Dreative audit passed with no findings.");
  for (const item of report.findings) console.log(`${item.level === "error" ? "ERROR" : "WARN "} [${item.check}] ${item.message}`);
  console.log(report.ok ? "Dreative audit passed." : "Dreative audit failed.");
}
