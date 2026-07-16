import test from "node:test";
import assert from "node:assert/strict";
import { renderCompleteTreatmentReview, renderProposedTreatmentAllocation, renderTreatmentSummary } from "./treatments.js";

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

test("complete review discloses every treatment and resolves ownership overlaps", () => {
  const text = renderCompleteTreatmentReview(["ux", "mobile", "refined", "motion", "interaction", "media", "3d", "immersive", "cinematic", "experimental"], ["/coffee"]);
  for (const name of ["UX", "MOBILE", "REFINED", "MOTION", "INTERACTION", "MEDIA", "3D", "IMMERSIVE", "CINEMATIC", "EXPERIMENTAL"])
    assert.match(text, new RegExp(`${name} \\[SELECTED\\]`));
  for (const phrase of ["Meaning:", "Substantive delivery:", "Does not count:", "Proposed page/section allocation:", "Dependencies:", "Tensions/conflicts:", "Observable acceptance:", "Immersive owns full-route continuity", "Motion owns the single normalized scroll/timeline clock"])
    assert.match(text, new RegExp(phrase, "i"));
});
