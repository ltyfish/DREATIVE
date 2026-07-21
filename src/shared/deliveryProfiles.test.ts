import test from "node:test";
import assert from "node:assert/strict";
import {
  DELIVERY_PROFILES,
  deliveryProfile,
  renderConfigurationChoices,
  renderDeliveryBrief,
  renderDetailedPlanGuide,
} from "./deliveryProfiles.js";

test("direction planning exposes Recommended, Efficient, and Showcase", () => {
  assert.deepEqual(DELIVERY_PROFILES.map((profile) => profile.id), ["recommended", "efficient", "showcase"]);
  const brief = renderDeliveryBrief();
  assert.match(brief, /show detailed plan/);
  assert.match(brief, /Showcase/);
  assert.doesNotMatch(brief, /attestation|provenance|Dogfood/i);
});

test("direction meanings and adaptive defaults are fixed", () => {
  assert.match(deliveryProfile("recommended").promise, /specific product/);
  assert.match(deliveryProfile("efficient").promise, /token-efficient/);
  assert.match(deliveryProfile("showcase").treatments, /no minimum count/i);
  assert.match(deliveryProfile("showcase").promise, /visibly distinct from Recommended/i);
  assert.match(deliveryProfile("showcase").scope, /beyond one isolated spectacle/i);
  assert.deepEqual(
    DELIVERY_PROFILES.map(({ id, prototype, review }) => ({ id, prototype, review })),
    [
      { id: "recommended", prototype: "auto", review: "lean" },
      { id: "efficient", prototype: "skip", review: "fast" },
      { id: "showcase", prototype: "required", review: "full-audit" },
    ],
  );
});

test("default configuration asks the material choices after direction selection", () => {
  const recommended = renderConfigurationChoices("recommended");
  for (const field of ["Review depth", "References", "Sources", "Packages", "Prototype"])
    assert.match(recommended, new RegExp(field, "i"));
  assert.match(recommended, /Lean.+recommended/);
  assert.match(renderConfigurationChoices("showcase"), /Full Audit.+recommended/);
  assert.match(renderConfigurationChoices("efficient"), /Fast.+recommended/);
});

test("detailed planning is an adaptive Creative Decision Brief", () => {
  const detail = renderDetailedPlanGuide("showcase");
  for (const field of ["Current state", "Selected direction", "Reference synthesis", "Workflow", "Treatment guide", "section allocation", "Build architecture", "Risks"])
    assert.match(detail, new RegExp(field, "i"));
  assert.match(detail, /no minimum count/i);
  assert.match(detail, /Visible execution map.+experience arc.+mobile transformation/i);
  assert.match(detail, /Showcase ceiling delivered:/);
  assert.match(detail, /Not pursued:/);
  assert.doesNotMatch(detail, /approval hash|attestation|independent critic|provenance/i);
});
