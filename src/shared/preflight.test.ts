import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  detectProjectPreflight,
  inspectBrowserInstallation,
  resolveCreativeCapabilities,
  resolveRuntimeRequirements,
  runBrowserWorkflowProbe,
  upgradeBrowserCapabilities,
  validateCapabilityInputs,
  validateCreativePermissions,
  type BrowserWorkflowProbeResult,
} from "./preflight.js";

test("project preflight detects framework, manager, scripts and existing capabilities", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-preflight-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ dependencies: { react: "^18", vite: "^6", gsap: "^3", motion: "^12", "pixi.js": "^8", "@rive-app/webgl2": "^2" }, scripts: { build: "vite build" } }));
  for (const name of ["gsap", "motion", "pixi.js", "@rive-app/webgl2"]) {
    const directory = path.join(root, "node_modules", name);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "package.json"), JSON.stringify({ name, main: "index.js" }));
    fs.writeFileSync(path.join(directory, "index.js"), "module.exports = {};");
  }
  fs.writeFileSync(path.join(root, "package-lock.json"), "{}");
  fs.writeFileSync(path.join(root, "src", "App.tsx"), "const reduced = matchMedia('(prefers-reduced-motion: reduce)')");
  const result = detectProjectPreflight(root);
  assert.equal(result.framework, "vite"); assert.equal(result.packageManager, "npm"); assert.ok(result.installedCapabilities.includes("gsap")); assert.equal(result.scripts.build, "vite build");
  assert.ok(result.installedCapabilities.includes("motion"));
  assert.ok(result.installedCapabilities.includes("pixi.js"));
  assert.ok(result.installedCapabilities.includes("@rive-app/webgl2"));
  assert.equal(result.creativeCapabilities.find((item) => item.id === "motion-runtime")?.status, "available");
  assert.equal(result.creativeCapabilities.find((item) => item.id === "pixi-runtime")?.status, "available");
  assert.equal(result.creativeCapabilities.find((item) => item.id === "rive-runtime")?.status, "available");
  assert.equal(result.creativeCapabilities.find((item) => item.id === "image-generation")?.status, "permission-unresolved");
});

test("declared but unresolvable packages are not reported as available", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-declared-only-"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ dependencies: { gsap: "^3", three: "^0.1" } }));
  const result = detectProjectPreflight(root, { permissions: { packageInstallationAllowed: false } });
  assert.deepEqual(result.declaredCapabilities.sort(), ["gsap", "three"]);
  assert.deepEqual(result.installedCapabilities, []);
  assert.equal(result.creativeCapabilities.find((item) => item.id === "gsap-runtime")?.status, "package-declared-unverified");
  assert.equal(result.creativeCapabilities.find((item) => item.id === "threejs-runtime")?.status, "package-declared-unverified");
});

test("runtime ownership requires a dependency, import, and actual initialization", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-runtime-owner-"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ dependencies: { lenis: "^1", gsap: "^3", "@playwright/test": "^1" } }));
  fs.writeFileSync(path.join(root, "src", "notes.ts"), "const docs = 'Lenis ScrollTrigger requestAnimationFrame';");
  let result = detectProjectPreflight(root, {
    browserInspection: { packageInstalled: true, packageProvider: "@playwright/test", executable: null },
  });
  assert.equal(result.scrollOwner, null);
  assert.equal(result.animationTicker, null);
  assert.equal(result.browserAutomationPackageInstalled, true);
  assert.equal(result.browserExecutableDetected, false);
  assert.equal(result.browserLaunchVerified, false);

  fs.writeFileSync(path.join(root, "src", "motion.ts"), [
    'import Lenis from "lenis";',
    'import gsap from "gsap";',
    "const lenis = new Lenis();",
    "const tick = () => requestAnimationFrame(tick);",
    "gsap.ticker.add(tick);",
  ].join("\n"));
  result = detectProjectPreflight(root, {
    browserInspection: { packageInstalled: true, packageProvider: "@playwright/test", executable: null },
  });
  assert.equal(result.scrollOwner, "lenis");
  assert.equal(result.animationTicker, "gsap");
  assert.equal(result.browserLaunchVerified, false);
});

test("browser verification capabilities preserve package, executable, workflow and failure states", () => {
  const permissions = {
    generatedImagesAllowed: false, externalImagesAllowed: false, generatedVideoAllowed: false, externalVideoAllowed: false,
    threeDPolicy: "not-allowed" as const, packageInstallationAllowed: false,
  };
  const status = (environment: Parameters<typeof resolveCreativeCapabilities>[3], id = "screenshot-capture") =>
    resolveCreativeCapabilities(["@playwright/test"], permissions, [], environment).find((item) => item.id === id);

  assert.equal(status({ browserPackageInstalled: true })?.status, "package-installed-unverified");
  assert.equal(status({ browserPackageInstalled: true, browserExecutableDetected: true })?.status, "browser-executable-detected-unverified");
  const verified = status({
    browserPackageInstalled: true, browserExecutableDetected: true, browserWorkflowVerified: true,
    browserEvidence: ["browser-workflow:test"],
  });
  assert.equal(verified?.status, "available");
  assert.equal(verified?.confidence, "verified");
  assert.deepEqual(verified?.verificationEvidence, ["browser-workflow:test"]);
  assert.equal(status({ browserPackageInstalled: true, browserExecutableDetected: true, browserProbeFailed: true })?.status, "runtime-verification-failed");
});

test("a successful workflow probe is the only automatic browser capability promotion", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-browser-state-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const probe: BrowserWorkflowProbeResult = {
    attempted: true,
    previewUrl: "http://127.0.0.1:4173/",
    packageInstalled: true,
    packageProvider: "@playwright/test",
    executable: "C:\\browser\\chromium.exe",
    launchVerified: true,
    previewNavigationVerified: true,
    httpStatus: 200,
    pageTitle: "Preview",
    evidenceId: "browser-workflow:test",
    error: null,
  };
  const preflight = detectProjectPreflight(root, { browserProbe: probe });
  assert.equal(preflight.browserPreflight.status, "workflow-verified");
  assert.equal(preflight.browserWorkflowVerified, true);
  assert.equal(preflight.creativeCapabilities.find((item) => item.id === "console-inspection")?.status, "available");
});

test("bounded probe fails truthfully when Playwright is unavailable", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-browser-probe-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const probe = runBrowserWorkflowProbe(root, "http://127.0.0.1:9", 2_000);
  assert.equal(probe.attempted, true);
  assert.equal(probe.previewNavigationVerified, false);
  assert.match(probe.error ?? "", /Playwright is not resolvable/);
});

test("installed browser package inspection is based on module resolution", () => {
  const inspection = inspectBrowserInstallation(process.cwd());
  assert.equal(inspection.packageInstalled, true);
  assert.ok(inspection.packageProvider);
});

test("explicit permissions override only their own unresolved defaults", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-permissions-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const preflight = detectProjectPreflight(root, { permissions: { generatedImagesAllowed: false, externalImagesAllowed: true } });
  const capability = (id: string) => preflight.creativeCapabilities.find((item) => item.id === id);
  assert.equal(capability("image-generation")?.status, "permission-denied");
  assert.equal(capability("image-search")?.status, "permitted-but-tool-unverified");
  assert.equal(capability("video-generation")?.status, "permission-unresolved");
  assert.equal(capability("3d-asset-search")?.status, "permission-unresolved");
});

test("permission JSON rejects unknown keys and non-boolean choices", () => {
  assert.throws(() => validateCreativePermissions({ generateImages: true }), /unknown permission/);
  assert.throws(() => validateCreativePermissions({ generatedImagesAllowed: "yes" }), /must be boolean/);
  assert.throws(() => validateCreativePermissions({ threeDPolicy: "always" }), /invalid/);
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
  assert.equal(status("3d-model-generation"), "permitted-but-tool-unverified");
  assert.equal(status("gsap-runtime"), "available");
  assert.equal(status("video-generation"), "permitted-but-tool-unverified");
  assert.equal(status("ffmpeg-processing"), "available");
});

test("model servers and Remotion remain unverified until real capability evidence exists", () => {
  const capabilities = resolveCreativeCapabilities(["remotion"], {
    generatedImagesAllowed: true, externalImagesAllowed: true, generatedVideoAllowed: true, externalVideoAllowed: true,
    threeDPolicy: "generation-and-sourcing-allowed", packageInstallationAllowed: true,
  });
  const status = (id: string) => capabilities.find((item) => item.id === id)?.status;
  assert.equal(status("remotion-renderer"), "permitted-but-tool-unverified");
  assert.equal(status("external-model-server"), "unavailable");
});

test("explicit future tool input is supported without MCP-name coupling", () => {
  const capabilities = resolveCreativeCapabilities([], {
    generatedImagesAllowed: true, externalImagesAllowed: false, generatedVideoAllowed: false, externalVideoAllowed: false,
    threeDPolicy: "supplied-only", packageInstallationAllowed: false,
  }, [{ id: "image-generation", state: "available-through-confirmed-tool", provider: "configured-capability-registry", verified: true }]);
  assert.equal(capabilities.find((item) => item.id === "image-generation")?.status, "available-through-confirmed-tool");
});

test("permission alone remains permitted but tool unverified", () => {
  const capabilities = resolveCreativeCapabilities([], {
    generatedImagesAllowed: true, externalImagesAllowed: true, generatedVideoAllowed: true, externalVideoAllowed: true,
    threeDPolicy: "generation-and-sourcing-allowed", packageInstallationAllowed: false,
  });
  assert.equal(capabilities.find((item) => item.id === "image-search")?.status, "permitted-but-tool-unverified");
  assert.equal(capabilities.find((item) => item.id === "image-generation")?.status, "permitted-but-tool-unverified");
});

test("missing system FFmpeg exposes an actionable package-backed processing route", () => {
  const capabilities = resolveCreativeCapabilities([], {
    generatedImagesAllowed: false, externalImagesAllowed: false, generatedVideoAllowed: true, externalVideoAllowed: true,
    threeDPolicy: "not-allowed", packageInstallationAllowed: true,
  }, [], { ffmpeg: false });
  for (const id of ["ffmpeg-processing", "video-transcoding", "frame-extraction"]) {
    const capability = capabilities.find((item) => item.id === id);
    assert.equal(capability?.status, "available-after-package-install");
    assert.equal(capability?.package, "ffmpeg-static");
    assert.equal(capability?.requiredAction, "install-or-select-fallback");
  }
});

test("Canvas and WebGL begin expected and browser evidence upgrades or fails them", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-browser-upgrade-"));
  fs.writeFileSync(path.join(root, "package.json"), "{}");
  const preflight = detectProjectPreflight(root);
  assert.equal(preflight.creativeCapabilities.find((item) => item.id === "canvas-runtime")?.status, "expected-browser-api-unverified");
  const upgraded = upgradeBrowserCapabilities(preflight, { verified: ["canvas-runtime"], failed: ["webgl-runtime"], evidenceIds: ["browser-trace"] });
  assert.equal(upgraded.creativeCapabilities.find((item) => item.id === "canvas-runtime")?.status, "available");
  assert.equal(upgraded.creativeCapabilities.find((item) => item.id === "webgl-runtime")?.status, "runtime-verification-failed");
});

test("contradictory capability declarations fail validation", () => {
  const errors = validateCapabilityInputs([
    { id: "image-search", state: "available-through-confirmed-tool", provider: "one", verified: true },
    { id: "image-search", state: "unavailable", verified: true },
  ]);
  assert.ok(errors.some((item) => item.includes("contradictory")));
});
