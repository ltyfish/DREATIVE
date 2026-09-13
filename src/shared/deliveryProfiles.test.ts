import test from "node:test";
import assert from "node:assert/strict";
import { DELIVERY_PROFILES, deliveryProfile, renderDeliveryBrief, renderConfigurationChoices, renderDetailedPlanGuide, type DeliveryProfileId } from "./deliveryProfiles.js";

test("delivery profile ids and execution defaults remain compatible", () => {
  assert.deepEqual(DELIVERY_PROFILES.map(({ id, prototype, review }) => ({ id, prototype, review })), [
    { id: "recommended", prototype: "auto", review: "lean" },
    { id: "efficient", prototype: "skip", review: "fast" },
    { id: "showcase", prototype: "required", review: "full-audit" },
  ]);
  for (const p of DELIVERY_PROFILES) assert.equal(deliveryProfile(p.id), p);
  assert.throws(() => deliveryProfile("missing" as DeliveryProfileId), /unknown delivery profile/);
});

test("CLI renderers support every profile and use Recommended by default", () => {
  assert.equal(renderDeliveryBrief(), renderDeliveryBrief("recommended"));
  for (const p of DELIVERY_PROFILES) {
    for (const render of [renderDeliveryBrief, renderConfigurationChoices, renderDetailedPlanGuide]) {
      const output = render(p.id);
      assert.ok(output.includes(p.label));
      assert.ok(!output.includes("undefined"));
      assert.throws(() => render("missing" as DeliveryProfileId), /unknown delivery profile/);
    }
  }
});
