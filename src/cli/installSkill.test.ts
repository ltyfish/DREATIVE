import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { availableSkills, checkSkillInstallation, installSkill, installationDirectory, resolveSkillSelection } from "./installSkill.js";

const sourceDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "skill", "dreative");
const version = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "package.json"), "utf8")).version;
const temporary = () => fs.mkdtempSync(path.join(os.tmpdir(), "dreative-install-"));

test("explicit --skills all resolves every packaged specialist", () => {
  const available = availableSkills(sourceDir);
  assert.deepEqual(resolveSkillSelection("all", available), { selected: available, explicitAll: true });
});

test("interactive empty answer means all", () => {
  const available = availableSkills(sourceDir);
  assert.deepEqual(resolveSkillSelection("", available).selected, available);
});

test("all-skill installation writes and verifies the exact set", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  const manifest = installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true, installedAt: "2026-01-01T00:00:00.000Z" });
  assert.deepEqual(manifest.selectedSkills, selected);
  assert.deepEqual(checkSkillInstallation({ sourceDir, projectDir: root, packageVersion: version, target: "claude" }), []);
});

test("missing selected specialist fails installation check", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true });
  fs.rmSync(path.join(installationDirectory(root, "claude"), "skills", `${selected[0]}.md`));
  assert.ok(checkSkillInstallation({ sourceDir, projectDir: root, packageVersion: version, target: "claude" }).some((item) => item.includes("missing selected file")));
});

test("modified installed specialist fails installation check", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true });
  fs.appendFileSync(path.join(installationDirectory(root, "claude"), "skills", `${selected[0]}.md`), "modified");
  assert.ok(checkSkillInstallation({ sourceDir, projectDir: root, packageVersion: version, target: "claude" }).some((item) => item.includes("modified installed")));
});

test("older installer schema is detected", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "codex", selected, explicitAll: true });
  const manifestFile = path.join(installationDirectory(root, "codex"), ".dreative-install.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  manifest.schemaVersion = 1;
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  const errors = checkSkillInstallation({ sourceDir, projectDir: root, packageVersion: version, target: "codex" });
  assert.ok(errors.some((item) => item.includes("installer schema must be 2")));
});

test("reinstall removes obsolete unselected specialist files", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true });
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected: [selected[0]], explicitAll: false });
  assert.deepEqual(fs.readdirSync(path.join(installationDirectory(root, "claude"), "skills")), [`${selected[0]}.md`]);
});

test("repeated installation is content-idempotent", () => {
  const root = temporary(); const selected = availableSkills(sourceDir); const installedAt = "2026-01-01T00:00:00.000Z";
  const first = installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true, installedAt });
  const second = installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected, explicitAll: true, installedAt });
  assert.deepEqual(second, first);
});

test("Codex target installs exact files and one safe AGENTS pointer", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "codex", selected, explicitAll: true });
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "codex", selected, explicitAll: true });
  assert.deepEqual(checkSkillInstallation({ sourceDir, projectDir: root, packageVersion: version, target: "codex" }), []);
  const pointer = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
  assert.equal((pointer.match(/dreative-skill:start/g) ?? []).length, 1);
  assert.doesNotMatch(pointer, /Dogfood|Award|attest|provenance/i);
  assert.match(pointer, /command success only, not visual quality/i);
});

test("active installation contains only routed skill resources", () => {
  const root = temporary(); const selected = availableSkills(sourceDir);
  const manifest = installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "codex", selected, explicitAll: true });
  assert.equal(Object.keys(manifest.files).some((file) => file.startsWith("schemas/")), true);
  assert.equal(Object.keys(manifest.files).some((file) => file.startsWith("systems/")), true);
  assert.deepEqual(
    Object.keys(manifest.files).filter((file) => file.startsWith("references/")).sort(),
    ["references/ASSET_PIPELINES.md", "references/CREATIVE_DIRECTION.md", "references/CREATIVE_EXECUTION.md", "references/SKILL_CONTRACT.md", "references/VISUAL_REFINEMENT.md"],
  );
  for (const active of ["SKILL.md", "PLAN.md", "references/CREATIVE_DIRECTION.md", "references/CREATIVE_EXECUTION.md", "agents/openai.yaml"])
    assert.equal(Object.hasOwn(manifest.files, active), true, active);
});

test("Claude target does not create an AGENTS pointer", () => {
  const root = temporary();
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected: ["ux"], explicitAll: false });
  assert.equal(fs.existsSync(path.join(root, "AGENTS.md")), false);
});
