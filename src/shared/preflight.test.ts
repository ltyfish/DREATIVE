import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { detectProjectPreflight, resolveCreativeCapabilities, resolveRuntimeRequirements } from "./preflight.js";

test("project preflight detects framework, manager, scripts and existing capabilities", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-preflight-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ dependencies: { react: "^18", vite: "^6", gsap: "^3" }, scripts: { build: "vite build" } }));
  fs.writeFileSync(path.join(root, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(root, "src", "App.tsx"), "const reduced = matchMedia('(prefers-reduced-motion: reduce)')");
  const result = detectProjectPreflight(root);
  assert.equal(result.framework, "vite"); assert.equal(result.packageManager, "npm"); assert.ok(result.installedCapabilities.includes("gsap")); assert.equal(result.scripts.build, "vite build");
});

test("runtime resolver installs only packages required by approved mechanisms", () => {
  const preflight = { packageManager: "npm" } as any;
  const result = resolveRuntimeRequirements(["CSS SVG structural mask", "GSAP pinned narrative", "Three.js stage"], preflight);
  assert.equal(result[0].packages.length, 0);
  assert.deepEqual(result[1].packages.map((item) => item.name), ["gsap"]);
  assert.deepEqual(result[2].packages.map((item) => item.name), ["three"]);
});

test("packages do not imply creative authoring capabilities", () => {
  const capabilities = resolveCreativeCapabilities(["three", "gsap"], {
    generatedImagesAllowed: true, externalImagesAllowed: true, generatedVideoAllowed: true, externalVideoAllowed: true,
    threeDPolicy: "generation-and-sourcing-allowed", packageInstallationAllowed: true,
  }, [], { ffmpeg: true });
  const status = (id: string) => capabilities.find((item) => item.id === id)?.status;
  assert.equal(status("threejs-runtime"), "available");
  assert.equal(status("3d-model-generation"), "unavailable");
  assert.equal(status("gsap-runtime"), "available");
  assert.equal(status("video-generation"), "unavailable");
  assert.equal(status("ffmpeg-editing"), "available");
});

test("explicit future tool input is supported without MCP-name coupling", () => {
  const capabilities = resolveCreativeCapabilities([], {
    generatedImagesAllowed: true, externalImagesAllowed: false, generatedVideoAllowed: false, externalVideoAllowed: false,
    threeDPolicy: "supplied-only", packageInstallationAllowed: false,
  }, [{ id: "image-generation", available: true, source: "configured-capability-registry" }]);
  assert.equal(capabilities.find((item) => item.id === "image-generation")?.status, "available");
});
