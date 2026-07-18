import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDocsCheck } from "./docsCheck.js";

test("packaged skill documents are internally consistent", () => {
  const report = runDocsCheck(path.resolve("skill", "dreative"));
  assert.equal(report.ok, true, JSON.stringify(report.findings, null, 2));
});

test("packaged skill rejects silent configuration defaults in user-facing runs", (t) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-check-"));
  const skillDir = path.join(tempRoot, "dreative");
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });

  const planFile = path.join(skillDir, "PLAN.md");
  const plan = fs.readFileSync(planFile, "utf-8")
    .replace("A\nuser-facing task is interactive", "A\nplanning task is interactive")
    .replace("plain text", "a normal message")
    .replace("Never silently default", "Resolve");
  fs.writeFileSync(planFile, plan);

  const report = runDocsCheck(skillDir);
  assert.equal(report.ok, false);
  assert.ok(report.findings.some((finding) => finding.check === "workflow-choices" && finding.file === "PLAN.md"));
});

test("docs-check catches stale canonical creation instructions and permission confusion", (t) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-version-"));
  const skillDir = path.join(tempRoot, "dreative");
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  fs.appendFileSync(path.join(skillDir, "SKILL.md"), "\n## Current workflow\nWrite the contract as v7. External image permission means image search is available.\n");
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((item) => item.check === "canonical-version"));
  assert.ok(report.findings.some((item) => item.check === "capability-truth"));
});

test("docs-check rejects an incomplete or YAML-deferred creative approval brief", (t) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-brief-"));
  const skillDir = path.join(tempRoot, "dreative");
  t.after(() => fs.rmSync(tempRoot, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });

  const planFile = path.join(skillDir, "PLAN.md");
  const plan = fs.readFileSync(planFile, "utf-8")
    .replace("5. **Experience allocation.**", "5. **Section notes.**")
    .replace("recommendation is never recorded as the user's selection.", "recommendations may be selected automatically.")
    .replace("Dreative may not request approval while this block is non-empty.", "Dreative may request approval with remaining blockers.")
    .replace("do not scatter it across several messages", "it may be split across messages")
    .replace("do not make the user inspect raw\nYAML", "the user may inspect raw\nYAML");
  fs.writeFileSync(planFile, plan);

  const report = runDocsCheck(skillDir);
  assert.equal(report.ok, false);
  assert.ok(report.findings.some((finding) => finding.check === "approval-brief" && finding.file === "PLAN.md"));
  assert.ok(report.findings.some((finding) => finding.check === "treatment-choice" && finding.file === "PLAN.md"));
  assert.ok(report.findings.some((finding) => finding.check === "executable-plan-review" && finding.file === "PLAN.md"));
});

test("migration-labelled documentation may mention v7", () => {
  const report = runDocsCheck(path.resolve("skill", "dreative"));
  assert.equal(report.findings.some((item) => item.file === "references/ARTIFACTS.md" && item.check === "canonical-version"), false);
});
