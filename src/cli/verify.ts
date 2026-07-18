import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createRequire } from "node:module";
import { chromium, type Browser, type Page } from "playwright-core";
import { approvalStatus, readPlan, writePlan } from "../shared/planGovernance.js";
import type { RequirementAssertion, RequirementTrace, RuntimeMechanismObservation, RuntimeMechanismFamily } from "../shared/planGovernance.js";
import { computeCurrentIdentity } from "../shared/projectIdentity.js";
import { sealEvidenceRun, sha256, type EvidenceArtifact } from "../shared/evidenceRuns.js";
import { resolveAssuranceProvider } from "../shared/assurance.js";
import { appendWorkflowEvent } from "../shared/workflowTrace.js";

const playwrightVersion = createRequire(import.meta.url)("playwright-core/package.json").version as string;

export interface VerifyOptions {
  browserCommand?: string;
  url?: string;
  packageVersion: string;
  browserExecutable?: string;
  prototypeId?: string;
  prototypeLocation?: string;
}

const relative = (root: string, file: string) => path.relative(root, file).replaceAll("\\", "/");
const artifact = (root: string, id: string, type: EvidenceArtifact["type"], file: string): EvidenceArtifact => {
  const bytes = fs.readFileSync(file);
  return { id, type, path: relative(root, file), sha256: sha256(bytes), bytes: bytes.length };
};

function browserCandidates(explicit?: string): string[] {
  return [
    explicit,
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter((item): item is string => Boolean(item && fs.existsSync(item)));
}

async function waitForUrl(url: string, timeoutMs = 45_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let last = "";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) return;
      last = `HTTP ${response.status}`;
    } catch (error) { last = String(error); }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`browser target did not become ready at ${url}: ${last}`);
}

function startServer(projectDir: string, command?: string): ChildProcess | null {
  if (!command) return null;
  return spawn(command, { cwd: projectDir, shell: true, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
}

function stopServer(child: ChildProcess | null): void {
  if (!child?.pid) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true });
  else child.kill("SIGTERM");
}

function runCommand(projectDir: string, command: string): void {
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", command], { cwd: projectDir, stdio: "inherit", windowsHide: true })
    : spawnSync(command, { cwd: projectDir, shell: true, stdio: "inherit" });
  if ((result.status ?? 1) !== 0) throw new Error(`production build failed: ${command} exited ${result.status ?? 1}`);
}

async function applyInteraction(page: Page, action: { action: string; selector?: string; value?: string }): Promise<void> {
  switch (action.action) {
    case "goto": await page.goto(action.value ?? "/", { waitUntil: "networkidle" }); break;
    case "click": if (!action.selector) throw new Error("click interaction needs selector"); await page.locator(action.selector).click(); break;
    case "fill": if (!action.selector) throw new Error("fill interaction needs selector"); await page.locator(action.selector).fill(action.value ?? ""); break;
    case "press": await page.keyboard.press(action.value ?? "Enter"); break;
    case "scroll": await page.evaluate((value) => window.scrollTo(0, Number(value) || document.documentElement.scrollHeight), action.value); break;
    case "reverse-scroll": await page.evaluate(() => window.scrollTo(0, 0)); break;
    case "rapid-scroll": await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); window.scrollTo(0, 0); window.scrollTo(0, document.documentElement.scrollHeight / 2); }); break;
    case "reload": await page.reload({ waitUntil: "networkidle" }); break;
    case "wait": await page.waitForTimeout(Number(action.value) || 150); break;
    case "escape": await page.keyboard.press("Escape"); break;
    default: throw new Error(`unsupported declared interaction action: ${action.action}`);
  }
  await page.waitForTimeout(150);
}

type RequirementRuntime = {
  requests: { url: string; status?: number }[];
  downloads: string[];
  initialCanvas: Record<string, string>;
  initialMedia: Record<string, number>;
};

async function initialRuntime(page: Page): Promise<Pick<RequirementRuntime, "initialCanvas" | "initialMedia">> {
  return page.evaluate(() => {
    const initialCanvas: Record<string, string> = {};
    const initialMedia: Record<string, number> = {};
    for (const [index, canvas] of [...document.querySelectorAll("canvas")].entries()) {
      try { initialCanvas[canvas.id || `canvas:${index}`] = canvas.toDataURL(); } catch { initialCanvas[canvas.id || `canvas:${index}`] = "unreadable"; }
    }
    for (const [index, media] of [...document.querySelectorAll("video,audio")].entries())
      initialMedia[(media as HTMLElement).id || `media:${index}`] = (media as HTMLMediaElement).currentTime;
    return { initialCanvas, initialMedia };
  });
}

async function assertionResult(page: Page, assertion: RequirementAssertion, runtime: RequirementRuntime): Promise<{ pass: boolean; observed: unknown }> {
  const locator = assertion.selector ? page.locator(assertion.selector).first() : null;
  switch (assertion.type) {
    case "visible": return { pass: Boolean(locator && await locator.isVisible()), observed: locator ? await locator.isVisible() : false };
    case "hidden": return { pass: Boolean(locator && await locator.isHidden()), observed: locator ? await locator.isHidden() : false };
    case "text-contains": {
      const observed = locator ? await locator.textContent() : null;
      return { pass: typeof observed === "string" && observed.includes(String(assertion.expected ?? "")), observed };
    }
    case "text-equals": {
      const observed = (locator ? await locator.textContent() : null)?.trim() ?? null;
      return { pass: observed === String(assertion.expected ?? ""), observed };
    }
    case "url-contains": return { pass: page.url().includes(String(assertion.expected ?? "")), observed: page.url() };
    case "url-equals": return { pass: page.url() === String(assertion.expected ?? ""), observed: page.url() };
    case "attribute-equals": {
      const observed = locator && assertion.attribute ? await locator.getAttribute(assertion.attribute) : null;
      return { pass: observed === String(assertion.expected ?? ""), observed };
    }
    case "input-value": {
      const observed = locator ? await locator.inputValue() : null;
      return { pass: observed === String(assertion.expected ?? ""), observed };
    }
    case "selected": {
      const observed = locator ? await locator.isChecked().catch(() => locator.getAttribute("aria-selected").then((value) => value === "true")) : false;
      return { pass: observed === (assertion.expected ?? true), observed };
    }
    case "dialog-open": {
      const observed = Boolean(locator && await locator.isVisible() && await locator.getAttribute("open") !== null);
      return { pass: observed, observed };
    }
    case "dialog-closed": {
      const observed = !locator || await locator.isHidden() || await locator.getAttribute("open") === null;
      return { pass: observed, observed };
    }
    case "form-invalid": {
      const observed = locator ? await locator.evaluate((element) => !(element as HTMLFormElement).checkValidity()) : false;
      return { pass: observed, observed };
    }
    case "form-valid": {
      const observed = locator ? await locator.evaluate((element) => (element as HTMLFormElement).checkValidity()) : false;
      return { pass: observed, observed };
    }
    case "network-request": {
      const observed = runtime.requests.filter((item) => item.url.includes(String(assertion.expected ?? "")));
      return { pass: observed.length > 0, observed };
    }
    case "network-success": {
      const observed = runtime.requests.filter((item) => item.url.includes(String(assertion.expected ?? "")));
      return { pass: observed.some((item) => item.status && item.status < 400), observed };
    }
    case "download": return { pass: runtime.downloads.length > 0, observed: runtime.downloads };
    case "canvas-changed": {
      const observed = await page.evaluate((selector) => {
        const canvas = document.querySelector(selector || "canvas") as HTMLCanvasElement | null;
        try { return canvas?.toDataURL() ?? null; } catch { return "unreadable"; }
      }, assertion.selector);
      const initial = runtime.initialCanvas[assertion.selector?.replace(/^#/, "") ?? "canvas:0"] ?? Object.values(runtime.initialCanvas)[0];
      return { pass: Boolean(observed && observed !== "unreadable" && observed !== initial), observed: { initialHash: initial ? sha256(initial) : null, finalHash: observed ? sha256(observed) : null } };
    }
    case "media-changed": {
      const observed = locator ? await locator.evaluate((element) => (element as HTMLMediaElement).currentTime) : 0;
      const initial = runtime.initialMedia[assertion.selector?.replace(/^#/, "") ?? "media:0"] ?? Object.values(runtime.initialMedia)[0] ?? 0;
      return { pass: observed !== initial, observed: { initial, final: observed } };
    }
    case "mechanism-state": {
      const observed = locator ? await locator.evaluate((element) => ({
        className: (element as HTMLElement).className,
        transform: getComputedStyle(element).transform,
        opacity: getComputedStyle(element).opacity,
        state: (element as HTMLElement).dataset.state,
      })) : null;
      return { pass: JSON.stringify(observed).includes(String(assertion.expected ?? "")), observed };
    }
  }
}

async function verifyRequirement(page: Page, requirement: RequirementTrace, routeUrl: string, runDir: string, projectDir: string,
  runId: string, finishedAt: string): Promise<{ evidence: any; artifact?: EvidenceArtifact }> {
  if (!requirement.actions?.length || !requirement.assertions?.length) {
    return { evidence: { id: requirement.evidenceId, criterionId: requirement.id, criterion: requirement.wording, kind: "interaction", status: "blocked",
      evidence: "Executable actions and assertions are missing.", verificationRunId: runId,
      proof: { timestamp: finishedAt, testedUrl: routeUrl, viewport: { width: page.viewportSize()?.width ?? 0, height: page.viewportSize()?.height ?? 0, dpr: 1 } } } };
  }
  const requests: RequirementRuntime["requests"] = [];
  const downloads: string[] = [];
  page.on("response", (response) => requests.push({ url: response.url(), status: response.status() }));
  page.on("download", (download) => downloads.push(download.suggestedFilename()));
  await page.goto(routeUrl, { waitUntil: "networkidle" });
  const initial = await initialRuntime(page);
  const observations: { assertion: RequirementAssertion; pass: boolean; observed: unknown }[] = [];
  let status: "pass" | "fail" | "blocked" = "pass";
  let failure = "";
  try {
    for (const action of requirement.actions) await applyInteraction(page, action);
    for (const assertion of requirement.assertions) {
      const result = await assertionResult(page, assertion, { requests, downloads, ...initial });
      observations.push({ assertion, ...result });
      if (!result.pass) status = "fail";
    }
  } catch (error) {
    status = "fail";
    failure = String(error);
  }
  const file = path.join(runDir, `requirement-${requirement.id.replace(/\W+/g, "-")}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const screenshot = artifact(projectDir, `requirement-${requirement.id}`, "screenshot", file);
  return { artifact: screenshot, evidence: {
    id: requirement.evidenceId, criterionId: requirement.id, criterion: requirement.wording, kind: "interaction",
    status, evidence: failure || JSON.stringify(observations), verificationRunId: runId,
    proof: { timestamp: finishedAt, artifactPath: screenshot.path, artifactHash: screenshot.sha256, testedUrl: page.url(),
      viewport: { width: page.viewportSize()?.width ?? 0, height: page.viewportSize()?.height ?? 0, dpr: 1 },
      captureSource: "playwright", observedProperties: observations.map((item, index) => ({
        property: `${item.assertion.type}:${item.assertion.selector ?? index}`,
        expected: String(item.assertion.expected ?? true),
        observed: JSON.stringify(item.observed),
      })) },
  } };
}

function deriveRuntimeObservations(plan: ReturnType<typeof readPlan>, observations: any[], artifacts: EvidenceArtifact[]): RuntimeMechanismObservation[] {
  const screenshotHash = new Map(artifacts.filter((item) => item.type === "screenshot").map((item) => [item.id, item.sha256]));
  const progressValues = [0, 25, 50, 75, 100] as const;
  return (plan.contract.mechanismContracts ?? []).map((mechanism) => {
    const selector = mechanism.selectors?.[0] ?? "";
    const states = observations.map((capture) => ({
      capture, state: (capture.mechanismStates ?? []).find((item: any) => item.selector === selector && item.present),
    })).filter((item) => item.state).slice(0, 5);
    const family: RuntimeMechanismFamily = mechanism.inputDriver === "media-progress" ? "frame-sequence"
      : mechanism.inputDriver === "pointer" ? "depth-parallax" : "layout-transition";
    const subjects = (plan.contract.subjectInventory ?? []).filter((item) => mechanism.subjectIds?.includes(item.id));
    const binding = plan.execution.bindings.find((item) => item.mechanism.includes(mechanism.id) || item.selectors.includes(selector));
    const samples = states.map(({ capture, state }, index) => {
      const previous = states[index - 1]?.state;
      const currentState = JSON.stringify(state);
      const previousState = previous ? JSON.stringify(previous) : currentState;
      return {
        progress: progressValues[Math.round(index * 4 / Math.max(1, states.length - 1))],
        captureId: capture.id,
        artifactHash: screenshotHash.get(capture.id) ?? sha256(currentState),
        compositionStateHash: sha256(currentState),
        observedProperties: Object.entries({
          transform: state.transform, opacity: state.opacity, x: state.box?.x ?? 0, y: state.box?.y ?? 0,
          width: state.box?.width ?? 0, height: state.box?.height ?? 0, scrollY: capture.scrollY,
        }).map(([property, value]) => ({ property, value: value as string | number | boolean })),
        channels: ["layout"] as ("layout")[],
        structuralDifferenceFromPrevious: currentState === previousState ? 0 : 1,
      };
    });
    const mobileCaptures = states.filter((item) => item.capture.viewport?.width <= 480).map((item) => item.capture.id);
    const performance = states.map((item) => item.capture.performance).filter(Boolean);
    return {
      id: mechanism.id, sectionId: mechanism.sectionId ?? mechanism.routeOrSection,
      continuityOwner: plan.contract.continuityContract?.owner ?? plan.contract.continuityOwner,
      implementationFile: binding?.files[0] ?? "runtime-owner-unresolved",
      componentOrSelector: selector || mechanism.runtimeOwner || mechanism.id,
      mechanismFamily: family,
      spatialClassification: subjects[0]?.fallbackClassification ?? "static-image",
      sourceAssets: subjects.flatMap((item) => item.assetIds),
      inputDrivers: mechanism.inputDriver === "click" || mechanism.inputDriver === "media-progress" ? [] : [mechanism.inputDriver],
      samples, postHero: (plan.contract.experienceDistribution.find((item) => item.sectionId === mechanism.sectionId)?.order ?? 0) > 0,
      assetTransformsInternally: mechanism.treatments?.includes("media") ?? false,
      pinnedOrControlledComposition: mechanism.inputDriver === "scroll-progress",
      nonObviousBehavior: mechanism.treatments?.includes("experimental") ?? false,
      neutralStylingStillSpecial: false,
      mobile: { authored: mobileCaptures.length > 0 && Boolean(mechanism.mobileTransformation), mechanismFamily: family, captureIds: mobileCaptures, disabled: false },
      reducedMotion: { authoredComposition: Boolean(mechanism.reducedMotionTransformation), captureIds: ["reduced-motion"] },
      reverse: { relevant: /reverse/i.test(mechanism.reverseBehavior), tested: (plan.contract.verificationPlan?.interactions ?? []).some((item) => item.action === "reverse-scroll"),
        result: (plan.contract.verificationPlan?.interactions ?? []).some((item) => item.action === "reverse-scroll") ? "pass" : "not-applicable", evidenceIds: [] },
      performance: {
        averageFps: performance.length ? Math.min(...performance.map((item) => item.averageFps ?? 0)) : 0,
        worstFrameTimeMs: performance.length ? Math.max(...performance.map((item) => item.worstFrameTimeMs ?? 0)) : 0,
        longTasks: performance.reduce((sum, item) => sum + (item.longTasks ?? 0), 0),
        transferredBytes: performance.reduce((sum, item) => sum + (item.transferredBytes ?? 0), 0),
        heavyChunkBytes: performance.length ? Math.max(...performance.map((item) => item.heavyChunkBytes ?? 0)) : 0,
      },
      recordingIds: artifacts.filter((item) => item.type === "trace").map((item) => item.id),
    };
  });
}

export async function runTrustedVerification(projectDir: string, options: VerifyOptions): Promise<{ runId: string; manifestPath: string }> {
  const plan = readPlan(projectDir);
  const approval = approvalStatus(plan);
  if (!approval.approved) throw new Error("verification requires an approved, non-drifted canonical plan");
  const provider = resolveAssuranceProvider(projectDir);
  const finalMode = plan.contract.workflow.execution === "full-audit"
    || plan.contract.workflow.purpose === "production-certification"
    || plan.contract.workflow.purpose === "dreative-dogfood";
  if (finalMode && !plan.contract.target.buildCommand) throw new Error("PRODUCTION_BUILD_COMMAND_MISSING: final verification requires contract.target.buildCommand");
  if (finalMode && !plan.contract.target.previewCommand && !options.browserCommand)
    throw new Error("PRODUCTION_PREVIEW_COMMAND_MISSING: final verification requires a production preview command");
  if (plan.contract.target.buildCommand) runCommand(projectDir, plan.contract.target.buildCommand);
  const url = options.url || plan.contract.target.previewUrl;
  if (!url) throw new Error("verification needs --url or contract.target.previewUrl");
  const runId = `verify-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const nonce = crypto.randomBytes(24).toString("hex");
  const runDir = path.join(projectDir, ".dreative", "runs", runId);
  fs.mkdirSync(runDir, { recursive: true });
  const serverStartedAt = new Date().toISOString();
  const server = startServer(projectDir, options.browserCommand || plan.contract.target.previewCommand || undefined);
  let browser: Browser | null = null;
  const startedAt = new Date().toISOString();
  appendWorkflowEvent(projectDir, { type: "verification-started", assuranceLevel: provider.level, data: { runId, finalMode } });
  try {
    await waitForUrl(url);
    const executablePath = browserCandidates(options.browserExecutable)[0];
    if (!executablePath) throw new Error("no trusted Chromium executable found; pass --browser-executable <path>");
    browser = await chromium.launch({ headless: true, executablePath });
    const browserVersion = browser.version();
    const artifacts: EvidenceArtifact[] = [];
    const observations: any[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: { url: string; failure: string }[] = [];
    const httpErrors: { url: string; status: number }[] = [];
    const viewports = plan.contract.verificationPlan?.viewports?.length
      ? plan.contract.verificationPlan.viewports
      : [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }];
    const interactions = plan.contract.verificationPlan?.interactions ?? [];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "no-preference" });
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
      const page = await context.newPage();
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), failure: request.failure()?.errorText ?? "unknown" }));
      page.on("response", (response) => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
      for (const route of plan.contract.target.routeScope.routes) {
        const testedUrl = new URL(route, url).toString();
        await page.goto(testedUrl, { waitUntil: "networkidle" });
        const applicable = interactions.filter((item) => item.route === route || item.route === "*");
        const captures: { id: string; interaction?: typeof applicable[number] }[] = [{ id: "initial" }, ...applicable.map((item) => ({ id: item.id, interaction: item }))];
        for (const capture of captures) {
          if (capture.interaction) await applyInteraction(page, capture.interaction);
          const id = `${viewport.name}-${route.replace(/\W+/g, "-") || "root"}-${capture.id}`;
          const file = path.join(runDir, `${id}.png`);
          await page.screenshot({ path: file, fullPage: true });
          artifacts.push(artifact(projectDir, id, "screenshot", file));
          const selectors = [...new Set((plan.contract.mechanismContracts ?? []).flatMap((item) => item.selectors ?? []))];
          const framePerformance = await page.evaluate(() => new Promise<{ averageFps: number; worstFrameTimeMs: number }>((resolve) => {
            const times: number[] = [];
            const tick = (time: number) => {
              times.push(time);
              if (times.length < 12) requestAnimationFrame(tick);
              else {
                const deltas = times.slice(1).map((value, index) => value - times[index]);
                resolve({ averageFps: 1000 / (deltas.reduce((sum, value) => sum + value, 0) / deltas.length), worstFrameTimeMs: Math.max(...deltas) });
              }
            };
            requestAnimationFrame(tick);
          }));
          observations.push(await page.evaluate(({ id, route, viewport, selectors, framePerformance }) => ({
            id, route, url: location.href, viewport, dpr: devicePixelRatio, capturedAt: new Date().toISOString(), scrollX, scrollY,
            documentHeight: document.documentElement.scrollHeight,
            images: [...document.images].map((image) => {
              const box = image.getBoundingClientRect(); const style = getComputedStyle(image);
              return { src: image.currentSrc || image.src, complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
                visible: box.width > 0 && box.height > 0 && style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) > 0,
                width: box.width, height: box.height };
            }),
            media: [...document.querySelectorAll("video,audio")].map((media) => {
              const item = media as HTMLMediaElement;
              return { src: item.currentSrc, readyState: item.readyState, networkState: item.networkState, currentTime: item.currentTime,
                duration: item.duration, paused: item.paused, error: item.error?.message ?? null };
            }),
            canvases: [...document.querySelectorAll("canvas")].map((canvas, index) => {
              const item = canvas as HTMLCanvasElement; let pixels = "unreadable";
              try { pixels = item.toDataURL(); } catch {}
              return { selector: item.id ? `#${item.id}` : `canvas:nth-of-type(${index + 1})`, width: item.width, height: item.height,
                pixelHash: pixels === "unreadable" ? pixels : pixels.slice(-128) };
            }),
            mechanismStates: selectors.map((selector) => {
              const element = document.querySelector(selector);
              if (!element) return { selector, present: false };
              const box = element.getBoundingClientRect(); const style = getComputedStyle(element);
              return { selector, present: true, visible: box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden",
                box: { x: box.x, y: box.y, width: box.width, height: box.height }, transform: style.transform, opacity: style.opacity,
                className: (element as HTMLElement).className, state: (element as HTMLElement).dataset.state ?? null };
            }),
            activeElement: document.activeElement?.tagName ?? null,
            bodyOverflowX: getComputedStyle(document.body).overflowX,
            performance: {
              navigationMs: performance.getEntriesByType("navigation")[0]?.duration ?? 0,
              resources: performance.getEntriesByType("resource").length,
              averageFps: framePerformance.averageFps, worstFrameTimeMs: framePerformance.worstFrameTimeMs,
              longTasks: performance.getEntriesByType("longtask").length,
              transferredBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
              heavyChunkBytes: Math.max(0, ...performance.getEntriesByType("resource").map((entry) => (entry as PerformanceResourceTiming).transferSize || 0)),
            },
          }), { id, route, viewport, selectors, framePerformance }));
        }
      }
      const traceFile = path.join(runDir, `${viewport.name}-trace.zip`);
      await context.tracing.stop({ path: traceFile });
      artifacts.push(artifact(projectDir, `${viewport.name}-trace`, "trace", traceFile));
      await context.close();
    }
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(url, { waitUntil: "networkidle" });
    const reducedFile = path.join(runDir, "reduced-motion.png");
    await reducedPage.screenshot({ path: reducedFile, fullPage: true });
    artifacts.push(artifact(projectDir, "reduced-motion", "screenshot", reducedFile));
    await reducedContext.close();
    const finishedAt = new Date().toISOString();
    const identity = computeCurrentIdentity(projectDir, {
      runId, dreativeVersion: options.packageVersion, schemaVersion: 5,
      framework: plan.contract.target.framework, packageManager: plan.contract.target.packageManager,
      buildCommand: plan.contract.target.buildCommand ?? "", serverCommand: options.browserCommand ?? plan.contract.target.previewCommand ?? "",
      testedOrigin: new URL(url).origin, testedUrl: url, serverStartedAt, verificationStartedAt: startedAt, verificationFinishedAt: finishedAt,
    });
    const capture = { schemaVersion: 2, runId, monitoringActive: true, routesOpened: plan.contract.target.routeScope.routes, observations, consoleErrors, failedRequests, httpErrors };
    const captureFile = path.join(runDir, "capture-manifest.json");
    fs.writeFileSync(captureFile, JSON.stringify(capture, null, 2));
    artifacts.push(artifact(projectDir, "capture-manifest", "capture-manifest", captureFile));
    const manifest = {
      verificationSchemaVersion: 5, runId, nonce, dreativeVersion: options.packageVersion, browserRunner: "dreative-playwright-core",
      browserRunnerVersion: playwrightVersion, browserName: "chromium", browserVersion, startedAt, finishedAt, testedUrl: url,
      approvedPlanHash: approval.currentHash, sourceHash: identity.sourceTreeHash, buildHash: identity.productionBuildHash,
      lockfileHash: identity.lockfileHash, assuranceLevel: provider.level, assuranceProvider: provider.id,
      verificationMode: finalMode ? "production" : "development-or-project-preview",
      viewports, interactionSequence: interactions, artifacts, captureManifest: relative(projectDir, captureFile),
    };
    const manifestFile = path.join(runDir, "trusted-verification.json");
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    sealEvidenceRun(projectDir, "browser-verification", runId, nonce, manifest);
    const requirements = plan.contract.requirementTraceability ?? [];
    const requirementContext = await browser.newContext({ viewport: { width: viewports[0].width, height: viewports[0].height } });
    const evidence: any[] = [];
    for (const requirement of requirements) {
      const page = await requirementContext.newPage();
      const route = plan.contract.target.routeScope.routes.find((item) => requirement.routeOrComponent.startsWith(item))
        ?? plan.contract.target.routeScope.routes[0] ?? "/";
      const result = await verifyRequirement(page, requirement, new URL(route, url).toString(), runDir, projectDir, runId, finishedAt);
      evidence.push({ ...result.evidence, pageId: requirement.routeOrComponent, viewportClass: "desktop", buildIdentityHash: identity.sourceTreeHash });
      if (result.artifact) artifacts.push(result.artifact);
      await page.close();
    }
    await requirementContext.close();
    if (!requirements.length) evidence.push({ id: "runtime", criterion: "Application opens", status: "blocked",
      evidence: "No requirement-specific actions and assertions were planned.", verificationRunId: runId });
    const planned = plan.contract.mechanismContracts?.map((item) => item.id) ?? [];
    const observed = [...new Set(interactions.map((item) => item.mechanismId).filter((item): item is string => Boolean(item)))];
    const verification = JSON.stringify({
      version: 4, generatedAt: finishedAt, runId, buildIdentity: identity, evidence,
      reconciliation: { planned, observed, missing: planned.filter((item) => !observed.includes(item)), substituted: [], extra: observed.filter((item) => !planned.includes(item)) },
    }, null, 2);
    const runVerificationFile = path.join(runDir, "verify.json");
    fs.writeFileSync(runVerificationFile, verification);
    if (options.prototypeId) {
      plan.execution.prototypeGate = {
        prototypeId: options.prototypeId, location: options.prototypeLocation ?? url,
        startedAt, verifiedAt: finishedAt, decidedAt: null, decision: null,
        sourceHash: identity.sourceTreeHash, verificationRunId: runId,
      };
      plan.execution.lastUpdatedAt = finishedAt;
      writePlan(projectDir, plan);
      return { runId, manifestPath: relative(projectDir, manifestFile) };
    }
    fs.writeFileSync(path.join(projectDir, ".dreative", "verify.json"), verification);
    plan.execution.run = {
      runId, contractHash: approval.currentHash, sourceHash: identity.sourceTreeHash, gitIdentity: identity.gitHead,
      createdAt: finishedAt, workflow: plan.contract.workflow, planVersion: plan.version,
      capabilityPreflightIdentity: sha256(JSON.stringify(plan.contract.capabilityPreflight ?? {})),
      contractTitle: plan.contract.selectedConcept,
      evidenceFiles: [relative(projectDir, manifestFile), relative(projectDir, captureFile), relative(projectDir, runVerificationFile)],
      assetManifest: artifacts.map((item) => item.path), approvedChangeRequests: plan.contract.changeRequests.filter((item) => item.status === "approved").map((item) => item.id),
      finalizationStatus: "pending",
      assuranceLevel: provider.level, verificationRunId: runId,
    };
    const imageObservations = observations.flatMap((item) => item.images ?? []);
    const canvasObservations = observations.flatMap((item) => item.canvases ?? []);
    const mediaObservations = observations.flatMap((item) => item.media ?? []);
    plan.execution.browserValidation = {
      checkedAt: finishedAt,
      visibleImages: imageObservations.map((item: any) => ({
        selector: item.src, complete: item.complete, naturalWidth: item.naturalWidth, primary: true,
      })),
      failedRequests: failedRequests.map((item) => ({ url: item.url, type: "request-failed" })),
      unexpectedHttpErrors: httpErrors,
      emptyCanvases: canvasObservations.filter((item: any) => !item.width || !item.height || item.pixelHash === "unreadable").map((item: any) => item.selector),
      webglDraws: [],
      consoleErrors,
      runtimeErrors: mediaObservations.filter((item: any) => item.error || item.readyState === 0).map((item: any) => `${item.src || "media"}: ${item.error || "not decoded"}`),
      productionMediaMissing: [
        ...imageObservations.filter((item: any) => !item.complete || !item.naturalWidth || !item.naturalHeight || !item.visible || item.width < 2 || item.height < 2).map((item: any) => item.src),
        ...mediaObservations.filter((item: any) => item.error || item.readyState === 0).map((item: any) => item.src || "media"),
      ],
    };
    plan.execution.runtimeObservations = deriveRuntimeObservations(plan, observations, artifacts);
    plan.execution.evidenceState = {
      verificationRunId: runId, verificationStatus: "current",
      criticRunId: null, criticStatus: "missing", certificationStatus: "stale",
      invalidatedAt: undefined, invalidationReason: undefined,
    };
    plan.execution.lastUpdatedAt = finishedAt;
    writePlan(projectDir, plan);
    appendWorkflowEvent(projectDir, { type: "verification-completed", assuranceLevel: provider.level,
      data: { runId, status: evidence.every((item) => item.status === "pass") ? "pass" : "fail", sourceHash: identity.sourceTreeHash, buildHash: identity.productionBuildHash } });
    return { runId, manifestPath: relative(projectDir, manifestFile) };
  } finally {
    await browser?.close().catch(() => {});
    stopServer(server);
  }
}
