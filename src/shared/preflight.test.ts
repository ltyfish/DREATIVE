import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { detectProjectPreflight, resolveRuntimeRequirements } from "./preflight.js";

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
