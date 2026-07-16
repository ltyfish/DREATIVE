import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PLAN_VERSION } from "../shared/planGovernance.js";

export const INSTALLER_SCHEMA_VERSION = 1;
export const INSTALL_MANIFEST = ".dreative-install.json";
export const DREATIVE_AGENT_START = "<!-- dreative-skill:start -->";
export const DREATIVE_AGENT_END = "<!-- dreative-skill:end -->";

export interface InstallManifest {
  schemaVersion: 1;
  packageVersion: string;
  canonicalPlanVersion: number;
  target: "claude" | "codex";
  installedAt: string;
  selectedSkills: string[];
  explicitAll: boolean;
  files: Record<string, string>;
  manifestHash: string;
}

const hash = (value: Buffer | string) => crypto.createHash("sha256").update(value).digest("hex");
const canonical = (value: unknown) => JSON.stringify(value, Object.keys(value as object).sort());

export function availableSkills(sourceDir: string): string[] {
  const directory = path.join(sourceDir, "skills");
  return fs.existsSync(directory) ? fs.readdirSync(directory).filter((name) => name.endsWith(".md")).map((name) => name.slice(0, -3)).sort() : [];
}

export function resolveSkillSelection(value: string | undefined, available: string[]): { selected: string[]; explicitAll: boolean } {
  const normalized = value?.trim();
  if (!normalized || normalized.toLowerCase() === "all") return { selected: [...available], explicitAll: normalized?.toLowerCase() === "all" };
  const selected = [...new Set(normalized.split(",").map((item) => item.trim()).filter(Boolean))];
  const unknown = selected.filter((item) => !available.includes(item));
  if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(", ")} — available: ${available.join(", ")}`);
  return { selected, explicitAll: false };
}

function walk(root: string, current = root): string[] {
  return fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(current, entry.name);
    return entry.isDirectory() ? walk(root, absolute) : [path.relative(root, absolute).replaceAll("\\", "/")];
  });
}

function manifestDigest(manifest: Omit<InstallManifest, "manifestHash">): string { return hash(JSON.stringify(manifest)); }

export function installationDirectory(projectDir: string, target: "claude" | "codex"): string {
  return path.join(projectDir, target === "codex" ? ".codex" : ".claude", "skills", "dreative");
}

export function installSkill(options: { sourceDir: string; projectDir: string; packageVersion: string; target: "claude" | "codex"; selected: string[]; explicitAll: boolean; installedAt?: string }): InstallManifest {
  const available = availableSkills(options.sourceDir);
  const unknown = options.selected.filter((item) => !available.includes(item));
  if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(", ")}`);
  const destination = installationDirectory(options.projectDir, options.target);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });
  const selectedSet = new Set(options.selected);
  const files = walk(options.sourceDir).filter((relative) => relative !== INSTALL_MANIFEST && (!relative.startsWith("skills/") || selectedSet.has(path.basename(relative, ".md"))));
  const hashes: Record<string, string> = {};
  for (const relative of files) {
    const source = path.join(options.sourceDir, relative);
    const target = path.join(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    hashes[relative] = hash(fs.readFileSync(target));
  }
  const base = { schemaVersion: INSTALLER_SCHEMA_VERSION as 1, packageVersion: options.packageVersion, canonicalPlanVersion: PLAN_VERSION, target: options.target, installedAt: options.installedAt ?? new Date().toISOString(), selectedSkills: [...options.selected].sort(), explicitAll: options.explicitAll, files: hashes };
  const manifest: InstallManifest = { ...base, manifestHash: manifestDigest(base) };
  fs.writeFileSync(path.join(destination, INSTALL_MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  if (options.target === "codex") updateAgentsPointer(options.projectDir);
  return manifest;
}

export function checkSkillInstallation(options: { sourceDir: string; projectDir: string; packageVersion: string; target: "claude" | "codex" }): string[] {
  const destination = installationDirectory(options.projectDir, options.target);
  const manifestFile = path.join(destination, INSTALL_MANIFEST);
  if (!fs.existsSync(manifestFile)) return [`missing verified install manifest at ${manifestFile}`];
  let manifest: InstallManifest;
  try { manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8")); } catch { return ["install manifest is not valid JSON"]; }
  const errors: string[] = [];
  const { manifestHash, ...base } = manifest;
  if (manifest.schemaVersion !== INSTALLER_SCHEMA_VERSION) errors.push(`installer schema must be ${INSTALLER_SCHEMA_VERSION}`);
  if (manifest.packageVersion !== options.packageVersion) errors.push(`installed package ${manifest.packageVersion} does not match ${options.packageVersion}`);
  if (manifest.canonicalPlanVersion !== PLAN_VERSION) errors.push(`installed canonical plan v${String(manifest.canonicalPlanVersion)} does not match v${PLAN_VERSION}`);
  if (manifest.target !== options.target) errors.push(`manifest target ${manifest.target} does not match ${options.target}`);
  if (manifestHash !== manifestDigest(base)) errors.push("install manifest has been modified");
  const available = availableSkills(options.sourceDir);
  for (const skill of manifest.selectedSkills ?? []) if (!available.includes(skill)) errors.push(`manifest selects unavailable specialist ${skill}`);
  const expected = new Set(Object.keys(manifest.files ?? {}));
  const actual = new Set(fs.existsSync(destination) ? walk(destination).filter((file) => file !== INSTALL_MANIFEST) : []);
  for (const relative of expected) {
    const installed = path.join(destination, relative);
    const packaged = path.join(options.sourceDir, relative);
    if (!actual.has(relative)) errors.push(`missing selected file: ${relative}`);
    else if (hash(fs.readFileSync(installed)) !== manifest.files[relative]) errors.push(`modified installed file: ${relative}`);
    else if (!fs.existsSync(packaged) || hash(fs.readFileSync(packaged)) !== manifest.files[relative]) errors.push(`stale installed file: ${relative}`);
  }
  for (const relative of actual) if (!expected.has(relative)) errors.push(`obsolete installed file: ${relative}`);
  for (const skill of manifest.selectedSkills ?? []) if (!expected.has(`skills/${skill}.md`)) errors.push(`selected specialist is absent from manifest: ${skill}`);
  if (manifest.explicitAll && available.some((skill) => !manifest.selectedSkills.includes(skill))) errors.push("explicit all selection does not contain every packaged specialist");
  return errors;
}

export function updateAgentsPointer(projectDir: string): void {
  const file = path.join(projectDir, "AGENTS.md");
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const block = `${DREATIVE_AGENT_START}\n## Dreative fail-closed frontend delivery\nFor frontend work, read \`.codex/skills/dreative/SKILL.md\` first. Expressive, Award, Experimental, Full Audit, and Dogfood work is incomplete unless \`dreative finalize --codex\` succeeds against the current source and prints \`DREATIVE_FINALIZED\`. After any audit or finalization failure, report the build as incomplete and list the blockers; never claim completion.\n${DREATIVE_AGENT_END}`;
  const pattern = new RegExp(`\\n?${DREATIVE_AGENT_START}[\\s\\S]*?${DREATIVE_AGENT_END}\\n?`, "g");
  const legacy = /\n?<!-- dreative-skill -->[\s\S]*?(?=\n{2,}|$)/g;
  const stripped = existing.replace(pattern, "\n").replace(legacy, "\n").trimEnd();
  fs.writeFileSync(file, `${stripped}${stripped ? "\n\n" : ""}${block}\n`);
}
