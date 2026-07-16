import test from "node:test";
import assert from "node:assert/strict";
import { renderProposedTreatmentAllocation, renderTreatmentSummary } from "./treatments.js";

test("treatment intake discloses substance, insufficiency, dependencies, tension, risk, role and acceptance", () => {
  const text = renderTreatmentSummary(["motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"], true);
  for (const phrase of ["Dependencies:", "Cost:", "Mobile/performance risk:", "Tensions:", "Substantive:", "Does not count:", "Proposed role:", "Acceptance example:", "no selected treatment may be silently pruned"]) assert.match(text, new RegExp(phrase, "i"));
});

test("proposed treatment allocation names routes and peak, connective or foundation roles", () => {
  const text = renderProposedTreatmentAllocation(["ux", "motion", "immersive", "experimental"], ["/coffee"]);
  assert.match(text, /\/coffee/);
  assert.match(text, /foundation/);
  assert.match(text, /connective tissue/);
  assert.match(text, /two or three selected peaks/);
});
