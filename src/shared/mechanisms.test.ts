import test from "node:test";
import assert from "node:assert/strict";
import { EXPERIMENTAL_MECHANISMS, mechanismRecipe } from "./mechanisms.js";

test("experimental catalog covers every required high-ambition mechanism family", () => {
  assert.equal(new Set(EXPERIMENTAL_MECHANISMS.map((item) => item.family)).size, 7);
  for (const recipe of EXPERIMENTAL_MECHANISMS) {
    assert.ok(recipe.substantiveDelivery.length);
    assert.ok(recipe.insufficientDelivery.length);
    assert.ok(recipe.verificationStates.length >= 3);
    assert.ok(recipe.mobileStrategy.length > 20);
    assert.ok(recipe.reducedMotionStrategy.length > 20);
    assert.ok(recipe.prototypeRequirement.length > 20);
  }
});

test("frame sequence explicitly rejects tabs as a substitute", () => {
  assert.match(mechanismRecipe("scrubbed-frame-sequence").insufficientDelivery.join(" "), /tabs/i);
});

test("persistent spatial prop permits an honest cutout without calling it a model", () => {
  const recipe = mechanismRecipe("persistent-spatial-prop");
  assert.match(recipe.fallback, /spatial cutout|media plane/i);
  assert.doesNotMatch(recipe.fallback, /generated model/i);
});
