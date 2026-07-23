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

function initializeGit(root: string): string {
  spawnSync("git", ["init"], { cwd: root, windowsHide: true });
  spawnSync("git", ["config", "user.email", "fixture@example.com"], { cwd: root, windowsHide: true });
  spawnSync("git", ["config", "user.name", "Fixture"], { cwd: root, windowsHide: true });
  spawnSync("git", ["add", "."], { cwd: root, windowsHide: true });
  spawnSync("git", ["commit", "-m", "fixture"], { cwd: root, windowsHide: true });
  return spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", windowsHide: true }).stdout.trim();
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
  initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), "- Commit: `deadbee`\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("not an implementation commit reachable")));
});

test("finalize reads only the explicit revision field", () => {
  const root = fixture();
  const head = initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), `Current checksum: ${head}\n\n- Commit: \`deadbee\`\n`);
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("revision deadbee is not an implementation commit reachable")));
});

test("finalize rejects tracked changes even when the evaluation cites HEAD", () => {
  const root = fixture();
  const head = initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), `- Commit or branch: \`fixture\` at \`${head}\`\n`);
  fs.appendFileSync(path.join(root, "package.json"), "\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("tracked changes")));
});

test("finalize requires an explicit revision field in Git-backed evaluations", () => {
  const root = fixture();
  initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), "Current checksum: deadbee\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("requires exactly one explicit")));
});

test("finalize accepts a tracked handoff commit after the implementation revision", () => {
  const root = fixture();
  const implementation = initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), `- Commit or branch: \`fixture\` at \`${implementation}\`\n`);
  spawnSync("git", ["add", ".dreative/evaluation/current-run.md"], { cwd: root, windowsHide: true });
  spawnSync("git", ["commit", "-m", "Add evaluation handoff"], { cwd: root, windowsHide: true });
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.equal(result.ok, true, result.blockers.join("\n"));
});

test("finalize rejects implementation changes committed after the evaluated revision", () => {
  const root = fixture();
  const implementation = initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), `- Commit: \`${implementation}\`\n`);
  fs.appendFileSync(path.join(root, "package.json"), "\n");
  spawnSync("git", ["add", ".dreative/evaluation/current-run.md", "package.json"], { cwd: root, windowsHide: true });
  spawnSync("git", ["commit", "-m", "Change implementation after evaluation"], { cwd: root, windowsHide: true });
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("implementation files changed after")));
});

test("finalize rejects an unexpected untracked source file", () => {
  const root = fixture();
  const implementation = initializeGit(root);
  const evaluation = path.join(root, ".dreative", "evaluation");
  fs.mkdirSync(evaluation, { recursive: true });
  fs.writeFileSync(path.join(evaluation, "current-run.md"), `- Commit: \`${implementation}\`\n`);
  spawnSync("git", ["add", ".dreative/evaluation/current-run.md"], { cwd: root, windowsHide: true });
  spawnSync("git", ["commit", "-m", "Add evaluation handoff"], { cwd: root, windowsHide: true });
  const source = path.join(root, "src");
  fs.mkdirSync(source, { recursive: true });
  fs.writeFileSync(path.join(source, "new-route.ts"), "export const route = true;\n");
  const result = runFinalize(root, { target: "codex", sourceDir, packageVersion });
  assert.ok(result.blockers.some((item) => item.includes("unexpected untracked files: src/new-route.ts")));
});
