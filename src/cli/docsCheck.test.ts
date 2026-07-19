import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDocsCheck } from "./docsCheck.js";

test("packaged skill documents describe the streamlined delivery workflow", () => {
  const report = runDocsCheck(path.resolve("skill", "dreative"));
  assert.equal(report.ok, true, JSON.stringify(report.findings, null, 2));
});

test("docs-check rejects a return to planning ceremony", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-"));
  const skillDir = path.join(root, "dreative");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  fs.appendFileSync(path.join(skillDir, "PLAN.md"), "\n## Mandatory Executable Plan Review\nUse host-attested approval.\n");
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((finding) => finding.check === "obsolete-ceremony"));
});

test("docs-check rejects missing responsive and full-page quality requirements", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-quality-"));
  const skillDir = path.join(root, "dreative");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  const file = path.join(skillDir, "SKILL.md");
  const content = fs.readFileSync(file, "utf8")
    .replace(/inspect the entire page/ig, "inspect the page")
    .replace(/390/g, "small");
  fs.writeFileSync(file, content);
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((finding) => finding.check === "delivery-contract"));
});

test("docs-check rejects a detailed plan that hides source or execution controls", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-detail-"));
  const skillDir = path.join(root, "dreative");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  const file = path.join(skillDir, "PLAN.md");
  const content = fs.readFileSync(file, "utf8")
    .replaceAll("Sourced images", "External pictures")
    .replaceAll("Full Audit", "Deep check");
  fs.writeFileSync(file, content);
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((finding) => finding.check === "delivery-contract"));
});

test("docs-check rejects named-site imitation in the public workflow", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-imitation-"));
  const skillDir = path.join(root, "dreative");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  fs.appendFileSync(path.join(skillDir, "PLAN.md"), "\nBuild an Unseen-style transition.\n");
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((finding) => finding.check === "reference-imitation"));
});

test("docs-check rejects package-only browser verification", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-browser-"));
  const skillDir = path.join(root, "dreative");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), skillDir, { recursive: true });
  const file = path.join(skillDir, "SKILL.md");
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/preflight --probe-browser/g, "preflight"));
  const report = runDocsCheck(skillDir);
  assert.ok(report.findings.some((finding) => finding.check === "delivery-contract"));
});
