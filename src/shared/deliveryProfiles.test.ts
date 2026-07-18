import test from "node:test";
import assert from "node:assert/strict";
import { DELIVERY_PROFILES, deliveryProfile, renderDeliveryBrief } from "./deliveryProfiles.js";

test("the public planning surface contains exactly three friendly approaches", () => {
  assert.deepEqual(DELIVERY_PROFILES.map((profile) => profile.id), ["recommended", "efficient", "showcase"]);
  const brief = renderDeliveryBrief();
  assert.match(brief, /use recommended/);
  assert.match(brief, /show detailed plan/);
  assert.doesNotMatch(brief, /Full Audit|Dogfood|attestation|ten treatments/i);
});

test("the recommendation can be reordered without changing the available choices", () => {
  const brief = renderDeliveryBrief("efficient");
  assert.ok(brief.indexOf("Efficient — recommended") < brief.indexOf("Recommended"));
  assert.equal(deliveryProfile("showcase").verification.includes("performance and reduced motion"), true);
});
