import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { detectCompetingOwners, installRuntimeGroup } from "./runtimeReliability.js";

test("failed runtime installation restores package and lockfile state", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-runtime-"));
  const packageFile = path.join(root, "package.json");
  const lockFile = path.join(root, "package-lock.json");
  fs.writeFileSync(packageFile, JSON.stringify({ dependencies: {} }, null, 2));
  fs.writeFileSync(lockFile, "original-lock");
  const packageBefore = fs.readFileSync(packageFile, "utf8");
  const result = installRuntimeGroup(root, "3d", ["three@^0.180.0"], ["npm run build"], (command) => {
    fs.writeFileSync(packageFile, JSON.stringify({ dependencies: { three: "^0.180.0" } }));
    fs.writeFileSync(lockFile, "changed-lock");
    return command.includes("build") ? 1 : 0;
  });
  assert.equal(result.rolledBack, true);
  assert.equal(fs.readFileSync(packageFile, "utf8"), packageBefore);
  assert.equal(fs.readFileSync(lockFile, "utf8"), "original-lock");
});

test("competing scroll, ticker and render owners are detected", () => {
  const owners = detectCompetingOwners("new Lenis(); ScrollTrigger.create({}); requestAnimationFrame(loop); renderer.setAnimationLoop(render)");
  assert.ok(owners.length >= 3);
});

