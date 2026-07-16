import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlan, readPlan, writePlan } from "../shared/planGovernance.js";
import { resumePlan } from "./doctor.js";

test("resume continues from the last valid checkpoint without resetting completed phases", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-resume-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const plan = createPlan(root, {
    workflow: { ambition: "standard", execution: "fast", prototype: "skip", purpose: "project-delivery" },
    target: { previewUrl: "http://localhost:4173", routeScope: { mode: "one-page", routes: ["/"] } },
  });
  plan.execution.phases[0].status = "completed";
  plan.execution.phases[0].completedAt = new Date().toISOString();
  plan.execution.phases[1].status = "failed";
  plan.execution.phases[1].error = "browser unavailable";
  writePlan(root, plan);
  assert.match(resumePlan(root), /planning/);
  const resumed = readPlan(root);
  assert.equal(resumed.execution.phases[0].status, "completed");
  assert.equal(resumed.execution.phases[1].status, "in-progress");
  assert.equal(resumed.execution.phases[1].error, undefined);
});

