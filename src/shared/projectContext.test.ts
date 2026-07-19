import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { emptyProjectContext, initializeProjectContext, readProjectContext, validateProjectContext } from "./projectContext.js";

test("project context is minimal working memory rather than evidence or approval state", () => {
  const context = emptyProjectContext();
  assert.equal(validateProjectContext(context).length, 0);
  assert.doesNotMatch(JSON.stringify(context), /approval|attestation|score|provenance|certif/i);
  context.status = "current";
  assert.ok(validateProjectContext(context).some((error) => /productPurpose/.test(error)));
});

test("context initialization is non-destructive and invalid existing JSON fails closed", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-context-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const first = initializeProjectContext(root);
  assert.equal(first.created, true);
  assert.equal(initializeProjectContext(root).created, false);
  assert.equal(readProjectContext(root).errors.length, 0);

  fs.writeFileSync(first.file, "{broken");
  assert.throws(() => initializeProjectContext(root), /not valid JSON/);
});
