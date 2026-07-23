import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runFinalize } from "./finalize.js";
import { availableSkills, installSkill } from "./installSkill.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceDir = path.join(packageRoot, "skill", "dreative");
const packageVersion = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8")).version;

function fixture(scripts: Record<string, string> = { build: "node -e \"process.exit(0)\"" }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-finalize-"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "fixture", version: "1.0.0", scripts }));
  installSkill({ sourceDir, projectDir: root, packageVersion, target: "codex", selected: availableSkills(sourceDir), explicitAll: true });
  return root;
}

test("finalize rejects a missing skill installation", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-finalize-missing-"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ scripts: { build: "node -e \"process.exit(0)\"" } }));
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(result.ok, false);
  assert.ok(result.blockers.some((item) => item.includes("skill installation")));
});

test("finalize uses deterministic project and documentation checks without approval artifacts", () => {
  const root = fixture();
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(result.ok, true, result.blockers.join("\n"));
  assert.ok(result.commands.some((item) => item.command === "npm run build"));
  assert.ok(result.commands.some((item) => item.command === "dreative docs-check"));
});

test("finalize fails closed when the build fails", () => {
  const root = fixture({ build: "node -e \"process.exit(2)\"" });
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(result.ok, false);
  assert.ok(result.blockers.some((item) => item.includes("npm run build exited")));
});

test("finalize requires a build script", () => {
  const root = fixture({ test: "node -e \"process.exit(0)\"" });
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(result.ok, false);
  assert.ok(result.blockers.some((item) => item.includes("build script")));
});

test("finalize rejects self-authored reviewer passes in opted-in handoffs", () => {
  const root = fixture();
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), "## Reviewer verdict\n\n- Result: pass\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("self-authored reviewer pass")));
});

test("finalize rejects a stale evaluation revision", () => {
  const root = fixture();
  spawnSync("git", ["init"], { cwd: root, windowsHide: true });
  spawnSync("git", ["config", "user.email", "fixture@example.com"], { cwd: root, windowsHide: true });
  spawnSync("git", ["config", "user.name", "Fixture"], { cwd: root, windowsHide: true });
  spawnSync("git", ["add", "."], { cwd: root, windowsHide: true });
  spawnSync("git", ["commit", "-m", "fixture"], { cwd: root, windowsHide: true });
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), "- Commit: `deadbee`\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("does not match current HEAD")));
});
