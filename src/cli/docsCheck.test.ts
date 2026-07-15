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
