import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDocsCheck } from "./docsCheck.js";

function fixture(t: test.TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-docs-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(path.resolve("skill", "dreative"), root, { recursive: true });
  return root;
}

test("packaged references and metadata resolve", () => {
  const report = runDocsCheck(path.resolve("skill", "dreative"));
  assert.equal(report.ok, true, JSON.stringify(report.findings, null, 2));
});
test("missing package resources are reported", (t) => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, "PLAN.md"));
  assert.ok(runDocsCheck(root).findings.some((f) => f.check === "package"));
});
test("broken local links, malformed JSON and merge conflicts are reported", (t) => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, "SKILL.md"), "\n[missing](references/missing.md)\n<<<<<<< ours\n");
  fs.writeFileSync(path.join(root, "broken.json"), "{");
  const checks = runDocsCheck(root).findings.map((f) => f.check);
  for (const check of ["references", "merge-markers", "json"]) assert.ok(checks.includes(check));
});
test("frontmatter is required but equivalent prose is not rejected", (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, "SKILL.md"), "---\nname: dreative\ndescription: Build thoughtful frontends.\n---\nA concise alternative workflow.\n");
  assert.equal(runDocsCheck(root).ok, true);
  fs.writeFileSync(path.join(root, "SKILL.md"), "# No metadata");
  assert.ok(runDocsCheck(root).findings.some((f) => f.check === "frontmatter"));
});
test("maintainer-only lessons need not be installed", (t) => {
  const root = fixture(t);
  fs.unlinkSync(path.join(root, "references", "DOGFOOD_LESSONS.md"));
  assert.equal(runDocsCheck(root).ok, true);
});
