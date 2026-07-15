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
  assert.equal((fs.readFileSync(path.join(root, "AGENTS.md"), "utf8").match(/dreative-skill:start/g) ?? []).length, 1);
});

test("Claude target does not create an AGENTS pointer", () => {
  const root = temporary();
  installSkill({ sourceDir, projectDir: root, packageVersion: version, target: "claude", selected: ["ux"], explicitAll: false });
  assert.equal(fs.existsSync(path.join(root, "AGENTS.md")), false);
});
