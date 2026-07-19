import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  CREATIVE_MECHANISMS,
  PACKAGE_PROFILES,
  renderAgentCatalogue,
  resolveCreativeStack,
  searchCreativeCatalog,
  validateCreativeCatalog,
  validateExternalReference,
} from "./creativeCatalog.js";

test("catalogue is constrained to executable native foundations", () => {
  assert.deepEqual(validateCreativeCatalog(), []);
  assert.ok(CREATIVE_MECHANISMS.length >= 12 && CREATIVE_MECHANISMS.length <= 20);
  assert.equal(new Set(CREATIVE_MECHANISMS.map((item) => item.id)).size, CREATIVE_MECHANISMS.length);
  for (const item of CREATIVE_MECHANISMS) {
    assert.equal(item.implementation, "systems/runtime.js");
    assert.ok(item.implementationExport && item.useWhen && item.rejectWhen);
    assert.ok(item.cleanup.length && item.performanceBudget.length && item.browserTest.length);
  }
});

test("natural-language lookup routes to a small system rather than an effect name", () => {
  assert.equal(searchCreativeCatalog("persistent product across sections")[0].id, "persistent-stage");
  assert.equal(searchCreativeCatalog("frame-by-frame product animation")[0].id, "frame-sequence");
  assert.equal(searchCreativeCatalog("3D gallery")[0].id, "spatial-gallery");
  assert.match(renderAgentCatalogue("image trail"), /mountMediaTrail/);
  assert.equal(searchCreativeCatalog("image tornado").some((item) => item.id === "image-tornado"), false);
});

test("package routing distinguishes Motion, GSAP, PixiJS, Rive, and Three", () => {
  assert.ok(PACKAGE_PROFILES.some((item) => item.id === "motion"));
  assert.ok(PACKAGE_PROFILES.some((item) => item.id === "pixi"));
  assert.ok(PACKAGE_PROFILES.some((item) => item.id === "rive"));
  const drag = resolveCreativeStack(["drag-rail"], { installationAllowed: true });
  assert.equal(drag.timelineEngine, "motion");
  const pinned = resolveCreativeStack(["pinned-chapter"], { installationAllowed: true });
  assert.equal(pinned.timelineEngine, "gsap");
  const native = resolveCreativeStack(["section-observer"], { installationAllowed: true });
  assert.equal(native.timelineEngine, "native");
});

test("external references require an adaptation and deliberate differences", () => {
  const errors = validateExternalReference({
    source: "reference.example",
    sourceType: "case study",
    principleExtracted: "velocity changes material clarity",
    adapt: "map reading speed to archive focus",
    deliberatelyDiffer: ["content only"],
    license: "reference only",
    attributionRequired: false,
  });
  assert.ok(errors.some((item) => /two concrete differences/.test(item)));
});

test("every native foundation export, guide heading, and visual anchor exists", async () => {
  const runtimePath = path.join(process.cwd(), "skill", "dreative", "systems", "runtime.js");
  const guide = fs.readFileSync(path.join(process.cwd(), "skill", "dreative", "systems", "NATIVE_FOUNDATIONS.md"), "utf8");
  const demo = fs.readFileSync(path.join(process.cwd(), "skill", "dreative", "systems", "demo.html"), "utf8");
  const runtime = await import(`${new URL(`file:///${runtimePath.replaceAll("\\", "/")}`).href}?test=${Date.now()}`);
  for (const item of CREATIVE_MECHANISMS) {
    assert.equal(typeof runtime[item.implementationExport], "function", item.implementationExport);
    assert.match(guide, new RegExp(`^## ${item.id}$`, "m"), item.id);
    assert.match(demo, new RegExp(`id=["']${item.id}["']`), item.id);
  }
});
