import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { runDocsCheck } from "./docsCheck.js";

test("packaged skill documents are internally consistent", () => {
  const report = runDocsCheck(path.resolve("skill", "dreative"));
  assert.equal(report.ok, true, JSON.stringify(report.findings, null, 2));
});
