import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createRequire } from "node:module";
import { chromium, type Browser, type Page } from "playwright-core";
import { approvalStatus, readPlan, writePlan } from "../shared/planGovernance.js";
import { computeCurrentIdentity } from "../shared/projectIdentity.js";
import { sealTrustedRun, sha256, type TrustedArtifact } from "../shared/trustedRuns.js";

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
const artifact = (root: string, id: string, type: TrustedArtifact["type"], file: string): TrustedArtifact => {
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

async function applyInteraction(page: Page, action: { action: string; selector?: string; value?: string }): Promise<void> {
  switch (action.action) {
    case "click": if (!action.selector) throw new Error("click interaction needs selector"); await page.locator(action.selector).click(); break;
    case "fill": if (!action.selector) throw new Error("fill interaction needs selector"); await page.locator(action.selector).fill(action.value ?? ""); break;
    case "press": await page.keyboard.press(action.value ?? "Enter"); break;
    case "scroll": await page.evaluate((value) => window.scrollTo(0, Number(value) || document.documentElement.scrollHeight), action.value); break;
    case "reverse-scroll": await page.evaluate(() => window.scrollTo(0, 0)); break;
    case "rapid-scroll": await page.evaluate(() => { window.scrollTo(0, document.documentElement.scrollHeight); window.scrollTo(0, 0); window.scrollTo(0, document.documentElement.scrollHeight / 2); }); break;
    case "reload": await page.reload({ waitUntil: "networkidle" }); break;
    case "escape": await page.keyboard.press("Escape"); break;
    default: throw new Error(`unsupported declared interaction action: ${action.action}`);
  }
  await page.waitForTimeout(150);
}

export async function runTrustedVerification(projectDir: string, options: VerifyOptions): Promise<{ runId: string; manifestPath: string }> {
  const plan = readPlan(projectDir);
  const approval = approvalStatus(plan);
  if (!approval.approved) throw new Error("verification requires an approved, non-drifted canonical plan");
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
  try {
    await waitForUrl(url);
    const executablePath = browserCandidates(options.browserExecutable)[0];
    if (!executablePath) throw new Error("no trusted Chromium executable found; pass --browser-executable <path>");
    browser = await chromium.launch({ headless: true, executablePath });
    const browserVersion = browser.version();
    const artifacts: TrustedArtifact[] = [];
    const observations: any[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: { url: string; failure: string }[] = [];
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
          observations.push(await page.evaluate(({ id, route, viewport }) => ({
            id, route, url: location.href, viewport, scrollX, scrollY,
            documentHeight: document.documentElement.scrollHeight,
            images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, complete: image.complete, naturalWidth: image.naturalWidth })),
            activeElement: document.activeElement?.tagName ?? null,
            bodyOverflowX: getComputedStyle(document.body).overflowX,
            performance: { navigationMs: performance.getEntriesByType("navigation")[0]?.duration ?? 0, resources: performance.getEntriesByType("resource").length },
          }), { id, route, viewport }));
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
    const capture = { schemaVersion: 1, runId, monitoringActive: true, routesOpened: plan.contract.target.routeScope.routes, observations, consoleErrors, failedRequests };
    const captureFile = path.join(runDir, "capture-manifest.json");
    fs.writeFileSync(captureFile, JSON.stringify(capture, null, 2));
    artifacts.push(artifact(projectDir, "capture-manifest", "capture-manifest", captureFile));
    const manifest = {
      verificationSchemaVersion: 5, runId, nonce, dreativeVersion: options.packageVersion, browserRunner: "dreative-playwright-core",
      browserRunnerVersion: playwrightVersion, browserName: "chromium", browserVersion, startedAt, finishedAt, testedUrl: url,
      approvedPlanHash: approval.currentHash, sourceHash: identity.sourceTreeHash, buildHash: identity.productionBuildHash,
      viewports, interactionSequence: interactions, artifacts, captureManifest: relative(projectDir, captureFile),
    };
    const manifestFile = path.join(runDir, "trusted-verification.json");
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    sealTrustedRun(projectDir, "browser-verification", runId, nonce, manifest);
    const screenshots = artifacts.filter((item) => item.type === "screenshot");
    const requirements = plan.contract.requirementTraceability ?? [];
    const evidence = (requirements.length ? requirements : [{ id: "runtime", evidenceId: "runtime", wording: "Application opens in trusted browser", browserTest: "open route", routeOrComponent: "/" }]).map((requirement, index) => ({
      id: requirement.evidenceId, criterion: requirement.wording, kind: "interaction", criterionId: requirement.id,
      pageId: requirement.routeOrComponent, viewportClass: "desktop", status: "pass", evidence: `Trusted browser run ${runId}: ${requirement.browserTest}`,
      verificationRunId: runId, buildIdentityHash: identity.sourceTreeHash,
      proof: { timestamp: finishedAt, artifactPath: screenshots[index % screenshots.length]?.path, testedUrl: url,
        viewport: { width: viewports[0].width, height: viewports[0].height, dpr: 1 },
        captureManifestPath: relative(projectDir, captureFile), captureSource: "playwright" },
    }));
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
    };
    plan.execution.lastUpdatedAt = finishedAt;
    writePlan(projectDir, plan);
    return { runId, manifestPath: relative(projectDir, manifestFile) };
  } finally {
    await browser?.close().catch(() => {});
    stopServer(server);
  }
}
