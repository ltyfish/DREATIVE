import { chromium, type Browser, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export type DeliveryProfile = "efficient" | "recommended" | "showcase";
export type MechanismTrigger = "scroll" | "click" | "hover" | "drag";
export type ShowcaseMediaMode = "dom-state" | "typography" | "image" | "video" | "svg" | "canvas" | "spatial-layout" | "3d";
export interface MechanismContractEntry {
  name: string;
  stage: "before" | "peak" | "after";
  selector: string;
  trigger: MechanismTrigger;
  experienceRole: string;
  ceilingContribution: string;
  mediaMode: ShowcaseMediaMode;
  continuityConnection: string;
  mobileTransformation: string;
  recommendedDifference: string;
  meaningfulOutcome: string;
  stateCount: number;
}
export interface ShowcaseMechanismContract {
  version: 2;
  experienceType: "journey" | "interface";
  classification: {
    implementation: "attempted";
  };
  recommendedBaseline: string;
  showcaseDelta: string[];
  mediaOpportunities: { opportunity: string; decision: "use" | "reject"; rationale: string }[];
  prototypeEvidence: {
    boundedApproach: string;
    higherCeilingApproach: string;
    selectedApproach: string;
    boundedArtifact: string;
    higherCeilingArtifact: string;
    boundedCaptures: { desktop: string; mobile: string };
    higherCeilingCaptures: { desktop: string; mobile: string };
    builderSelectionRationale: string;
  };
  continuity: {
    stateKey: string;
    sourceSelector: string;
    sourceTrigger: "click" | "drag";
    stateCount: number;
    affectedRegions: {
      selector: string;
      stage: "before" | "peak" | "after";
      effect: string;
    }[];
  };
  mechanisms: MechanismContractEntry[];
}
export interface VisualSmokeOptions { profile: DeliveryProfile; showcase?: ShowcaseMechanismContract }
export interface VisualSmokeResult { ok: boolean; blockers: string[]; checks: string[] }

const contexts = [
  { label: "desktop", width: 1440, height: 900, reducedMotion: false, samples: 20 },
  { label: "mobile-390", width: 390, height: 844, reducedMotion: false, samples: 10 },
  { label: "mobile-320", width: 320, height: 720, reducedMotion: false, samples: 8 },
  { label: "mobile-390-reduced", width: 390, height: 844, reducedMotion: true, samples: 8 },
] as const;

function twoFrames(page: Page): Promise<void> {
  return page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function visibleFingerprint(page: Page, selector: string): Promise<string> {
  return page.locator(selector).evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    const nodes = [root, ...Array.from(root.querySelectorAll("*"))].slice(0, 60);
    const output = nodes.map((node) => {
      const element = node as HTMLElement;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (rect.width < 2 || rect.height < 2 || rect.bottom < 0 || rect.top > innerHeight || style.visibility === "hidden") return null;
      const data = Array.from(element.attributes).filter((attr) => attr.name.startsWith("data-")).map((attr) => `${attr.name}=${attr.value}`).join(";");
      const media = element instanceof HTMLMediaElement ? `${element.currentTime.toFixed(2)}:${element.paused}:${element.readyState}` : "";
      const source = element instanceof HTMLImageElement ? element.currentSrc : "";
      let canvas = "";
      if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
      return [element.tagName, element.className, data, element.textContent?.trim().slice(0, 160), Math.round(rect.x - rootRect.x), Math.round(rect.y - rootRect.y), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.filter, style.clipPath, style.backgroundImage, source, media, canvas];
    }).filter(Boolean);
    return JSON.stringify(output);
  });
}

async function continuityFingerprint(page: Page, selector: string): Promise<string> {
  return page.locator(selector).evaluate((root) => JSON.stringify([root, ...Array.from(root.querySelectorAll("*"))].slice(0, 60).map((node) => {
    const element = node as Element;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (rect.width < 2 || rect.height < 2 || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= .02) return null;
    const renderedText = element instanceof HTMLElement ? element.innerText : element.textContent;
    const source = element instanceof HTMLImageElement ? element.currentSrc : "";
    const media = element instanceof HTMLMediaElement ? `${element.currentTime.toFixed(2)}:${element.paused}` : "";
    let canvas = "";
    if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
    return [element.tagName, renderedText?.trim().slice(0, 120), Math.round(rect.x + scrollX), Math.round(rect.y + scrollY), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.color, style.backgroundColor, style.filter, style.clipPath, style.backgroundImage, source, media, canvas];
  }).filter(Boolean)));
}

async function verifyDeclaredMedia(page: Page, entry: MechanismContractEntry): Promise<string | null> {
  if (entry.mediaMode === "dom-state") return null;
  const observation = await page.locator(entry.selector).evaluate((root, mediaMode) => {
    const elements = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];
    const visible = (element: Element): boolean => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width >= 8 && rect.height >= 8 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02;
    };
    const count = (selector: string): number => elements.filter((element) => element.matches(selector) && visible(element)).length;
    if (mediaMode === "svg") return count("svg") > 0;
    if (mediaMode === "image") return count("img,picture") > 0;
    if (mediaMode === "video") return count("video") > 0;
    if (mediaMode === "canvas") return count("canvas") > 0;
    if (mediaMode === "3d") return count("canvas,[data-dreative-3d]") > 0;
    if (mediaMode === "typography") return elements.some((element) => visible(element) && Boolean(element.textContent?.trim()));
    if (mediaMode === "spatial-layout") return elements.filter((element) => element !== root && visible(element)).length >= 2;
    return false;
  }, entry.mediaMode);
  return observation ? null : `${entry.name} mechanism declares ${entry.mediaMode} but its region contains no matching visible medium`;
}

async function declaredMediaFingerprint(page: Page, entry: MechanismContractEntry): Promise<string> {
  return page.locator(entry.selector).evaluate((root, mediaMode) => {
    const rootRect = root.getBoundingClientRect();
    const all = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];
    const selector = mediaMode === "svg" ? "svg,svg *" : mediaMode === "image" ? "img,picture" : mediaMode === "video" ? "video" : mediaMode === "canvas" ? "canvas" : mediaMode === "3d" ? "canvas,[data-dreative-3d]" : mediaMode === "typography" ? "h1,h2,h3,h4,h5,h6,p,span,strong,em" : "*";
    const nodes = mediaMode === "dom-state" ? all : all.filter((element) => element !== root && element.matches(selector));
    return JSON.stringify(nodes.slice(0, 60).map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const viewportPinned = style.position === "sticky" || style.position === "fixed";
      const relativeX = viewportPinned ? null : Math.round(rect.x - rootRect.x);
      const relativeY = viewportPinned ? null : Math.round(rect.y - rootRect.y);
      const media = element instanceof HTMLMediaElement ? [element.currentTime.toFixed(2), element.paused, element.readyState] : [];
      const source = element instanceof HTMLImageElement ? element.currentSrc : "";
      let canvas = "";
      if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
      return [element.tagName, element.className, element.textContent?.trim().slice(0, 120), relativeX, relativeY, Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.filter, style.clipPath, style.fontSize, style.fontWeight, source, media, canvas];
    }));
  }, entry.mediaMode);
}

async function spatialGeometry(page: Page, entry: MechanismContractEntry): Promise<string[]> {
  return page.locator(entry.selector).evaluate((root) => Array.from(root.querySelectorAll<HTMLElement>("*")).slice(0, 60).map((element) => {
    const rect = element.getBoundingClientRect();
    return `${Math.round(rect.x)}:${Math.round(rect.y)}:${Math.round(rect.width)}:${Math.round(rect.height)}:${getComputedStyle(element).transform}`;
  }));
}

async function exerciseScrollChoreography(page: Page, entry: MechanismContractEntry): Promise<string | null> {
  const region = await page.locator(entry.selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + scrollY, height: rect.height, viewport: innerHeight, pageHeight: document.documentElement.scrollHeight };
  });
  if (region.height < region.viewport * 1.5)
    return `${entry.name} scroll mechanism ${entry.selector} is too short to demonstrate multi-stage choreography`;
  const signatures = new Set<string>();
  for (const fraction of [.1, .3, .5, .7, .9]) {
    const y = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * fraction - region.viewport / 2));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y);
    await twoFrames(page);
    signatures.add(await declaredMediaFingerprint(page, entry));
  }
  const required = Math.min(5, entry.stateCount);
  return signatures.size >= required ? null : `${entry.name} scroll mechanism ${entry.selector} produced ${signatures.size} distinct states; ${required} are declared`;
}

async function exerciseMechanism(page: Page, entry: MechanismContractEntry): Promise<string | null> {
  const locator = page.locator(entry.selector);
  if (await locator.count() !== 1) return `${entry.name} selector ${entry.selector} must resolve to exactly one element`;
  const box = await locator.boundingBox();
  if (!box || box.width < 8 || box.height < 8) return `${entry.name} selector ${entry.selector} is hidden or zero-sized`;
  await locator.scrollIntoViewIfNeeded();
  await twoFrames(page);
  const mediaFailure = await verifyDeclaredMedia(page, entry);
  if (mediaFailure) return mediaFailure;
  if (entry.trigger === "scroll") return exerciseScrollChoreography(page, entry);
  const before = await declaredMediaFingerprint(page, entry);
  const spatialBefore = entry.mediaMode === "spatial-layout" ? await spatialGeometry(page, entry) : [];
  const signatures = new Set<string>([before]);
  if (entry.trigger === "click") {
    for (let index = 1; index < entry.stateCount; index += 1) {
      await locator.click();
      await twoFrames(page);
      signatures.add(await declaredMediaFingerprint(page, entry));
    }
  }
  else if (entry.trigger === "hover") await locator.hover();
  else { await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2, { steps: 8 }); await page.mouse.up(); }
  await twoFrames(page);
  const after = await declaredMediaFingerprint(page, entry);
  signatures.add(after);
  if (entry.mediaMode === "spatial-layout") {
    const spatialAfter = await spatialGeometry(page, entry);
    const changed = spatialAfter.filter((value, index) => value !== spatialBefore[index]).length;
    if (changed < 2) return `${entry.name} spatial-layout mechanism changed fewer than two element geometries`;
  }
  if (signatures.size < entry.stateCount) return `${entry.name} mechanism ${entry.selector} produced ${signatures.size} distinct states; ${entry.stateCount} are declared`;
  return before === after ? `${entry.name} mechanism ${entry.selector} did not visibly change its declared ${entry.mediaMode} medium after ${entry.trigger}` : null;
}

async function verifyContinuity(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  const source = page.locator(contract.continuity.sourceSelector);
  if (await source.count() !== 1) return [`Showcase continuity source ${contract.continuity.sourceSelector} must resolve to exactly one element`];
  await source.scrollIntoViewIfNeeded();
  await twoFrames(page);
  const sourceBox = await source.boundingBox();
  if (!sourceBox || sourceBox.width < 8 || sourceBox.height < 8) return [`Showcase continuity source ${contract.continuity.sourceSelector} is hidden or zero-sized`];
  const regions = contract.continuity.affectedRegions;
  const locators = regions.map((region) => page.locator(region.selector));
  for (let index = 0; index < locators.length; index += 1) {
    if (await locators[index].count() !== 1) errors.push(`continuity region ${regions[index].selector} must resolve to exactly one element`);
    else {
      const box = await locators[index].boundingBox();
      if (!box || box.width < 8 || box.height < 8) errors.push(`continuity region ${regions[index].selector} is hidden or zero-sized`);
    }
  }
  if (errors.length) return errors;
  const ordered: { stage: "before" | "peak" | "after"; y: number }[] = [];
  for (let index = 0; index < locators.length; index += 1) {
    const box = await locators[index].boundingBox();
    ordered.push({ stage: regions[index].stage, y: box?.y ?? 0 });
  }
  const stageY = ["before", "peak", "after"].map((stage) => Math.min(...ordered.filter((item) => item.stage === stage).map((item) => item.y)));
  if (!(stageY[0] < stageY[1] && stageY[1] < stageY[2])) errors.push("Showcase continuity regions must appear in before, peak, after document order");
  const viewportHeight = await page.evaluate(() => innerHeight);
  if (stageY[1] - stageY[0] < viewportHeight * .5 || stageY[2] - stageY[1] < viewportHeight * .5) errors.push("Showcase continuity stages must occupy meaningfully separated page regions");
  const signatures = regions.map(() => new Set<string>());
  for (let state = 0; state < contract.continuity.stateCount; state += 1) {
    for (let index = 0; index < regions.length; index += 1) signatures[index].add(await continuityFingerprint(page, regions[index].selector));
    if (state === contract.continuity.stateCount - 1) break;
    if (contract.continuity.sourceTrigger === "click") await source.click();
    else {
      const box = await source.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2, { steps: 8 });
        await page.mouse.up();
      }
    }
    await twoFrames(page);
  }
  for (const stage of ["before", "peak", "after"] as const) {
    const stageIndexes = regions.map((region, index) => region.stage === stage ? index : -1).filter((index) => index >= 0);
    if (!stageIndexes.some((index) => signatures[index].size >= contract.continuity.stateCount))
      errors.push(`Showcase shared state ${contract.continuity.stateKey} did not propagate through ${stage} regions from ${contract.continuity.sourceSelector}`);
  }
  return errors;
}

function imageDimensions(bytes: Buffer, contentType = ""): { width: number; height: number } | null {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (bytes.length >= 30 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP" && bytes.subarray(12, 16).toString("ascii") === "VP8X")
    return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
  if (bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 255) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 192 && marker <= 195) return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
      offset += Math.max(2, length + 2);
    }
  }
  if (/svg/i.test(contentType) || bytes.subarray(0, 256).toString("utf8").includes("<svg")) {
    const source = bytes.toString("utf8", 0, Math.min(bytes.length, 2048));
    const width = Number(source.match(/\bwidth=["']([\d.]+)/i)?.[1]);
    const height = Number(source.match(/\bheight=["']([\d.]+)/i)?.[1]);
    if (width > 0 && height > 0) return { width, height };
  }
  return null;
}

function captureProblem(bytes: Buffer, contentType: string, viewport: "desktop" | "mobile"): string | null {
  const dimensions = imageDimensions(bytes, contentType);
  if (!dimensions) return "is not a decodable PNG, JPEG, WebP, or dimensioned SVG";
  if (viewport === "desktop" && (dimensions.width < 1024 || dimensions.height < 600 || dimensions.width <= dimensions.height)) return `must be a desktop-like image of at least 1024×600; received ${dimensions.width}×${dimensions.height}`;
  if (viewport === "mobile" && (dimensions.width < 320 || dimensions.width > 600 || dimensions.height < 600 || dimensions.height <= dimensions.width)) return `must be a mobile-like image between 320–600px wide and at least 600px tall; received ${dimensions.width}×${dimensions.height}`;
  return null;
}

async function verifyPrototypeEvidence(context: Awaited<ReturnType<Browser["newContext"]>>, url: string, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  const artifactFingerprints: string[] = [];
  for (const [label, artifact] of [["bounded", contract.prototypeEvidence.boundedArtifact], ["higher-ceiling", contract.prototypeEvidence.higherCeilingArtifact]] as const) {
    const page = await context.newPage();
    const target = new URL(artifact, url).href;
    const response = await page.goto(target, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) errors.push(`${label} prototype artifact did not load successfully: ${target}`);
    else artifactFingerprints.push(await visibleFingerprint(page, "body"));
    await page.close();
  }
  if (artifactFingerprints.length === 2 && artifactFingerprints[0] === artifactFingerprints[1]) errors.push("bounded and higher-ceiling prototype artifacts are indistinguishable");
  for (const [label, captures] of [["bounded", contract.prototypeEvidence.boundedCaptures], ["higher-ceiling", contract.prototypeEvidence.higherCeilingCaptures]] as const) {
    const captureHashes: string[] = [];
    for (const viewport of ["desktop", "mobile"] as const) {
      const capture = captures?.[viewport];
      if (!capture?.trim()) { errors.push(`${label} prototype requires a ${viewport} capture`); continue; }
      if (/^https?:\/\//i.test(capture)) {
        const response = await context.request.get(capture);
        const contentType = response.headers()["content-type"] ?? "";
        if (!response.ok() || !/^image\//i.test(contentType)) errors.push(`${label} ${viewport} capture is not a loadable image: ${capture}`);
        else {
          const bytes = Buffer.from(await response.body());
          const problem = captureProblem(bytes, contentType, viewport);
          if (problem) errors.push(`${label} ${viewport} capture ${problem}: ${capture}`);
          captureHashes.push(createHash("sha256").update(bytes).digest("hex"));
        }
      } else {
        const file = path.resolve(capture);
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`${label} ${viewport} capture does not exist: ${file}`);
        else {
          const bytes = fs.readFileSync(file);
          const problem = captureProblem(bytes, path.extname(file), viewport);
          if (problem) errors.push(`${label} ${viewport} capture ${problem}: ${file}`);
          captureHashes.push(createHash("sha256").update(bytes).digest("hex"));
        }
      }
    }
    if (captureHashes.length === 2 && captureHashes[0] === captureHashes[1]) errors.push(`${label} desktop and mobile captures must be different images`);
  }
  return errors;
}

async function inspectContext(browser: Browser, url: string, config: typeof contexts[number], contract?: ShowcaseMechanismContract): Promise<VisualSmokeResult> {
  const blockers: string[] = [];
  const checks: string[] = [];
  const context = await browser.newContext({ viewport: { width: config.width, height: config.height }, reducedMotion: config.reducedMotion ? "reduce" : "no-preference" });
  const page = await context.newPage();
  const runtimeErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => { if (new URL(request.url()).origin === new URL(url).origin) runtimeErrors.push(`asset failed: ${request.url()}`); });
  page.on("response", (response) => { if (response.status() >= 400 && new URL(response.url()).origin === new URL(url).origin && response.request().resourceType() !== "document") runtimeErrors.push(`asset HTTP ${response.status()}: ${response.url()}`); });
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await twoFrames(page);
  if (!response || response.status() >= 400) blockers.push(`${config.label}: preview returned HTTP ${response?.status() ?? "no response"}`);

  const audit = await page.evaluate(() => {
    const stickyRisks: string[] = [];
    for (const element of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
      if (getComputedStyle(element).position !== "sticky") continue;
      let ancestor = element.parentElement;
      while (ancestor && ancestor !== document.body) {
        const style = getComputedStyle(ancestor);
        const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
        if (/hidden|clip/.test(overflow)) { stickyRisks.push(`${element.className || element.tagName} inside ${ancestor.className || ancestor.tagName} (${overflow})`); break; }
        ancestor = ancestor.parentElement;
      }
    }
    const longRegions = Array.from(document.querySelectorAll<HTMLElement>("main section, main header"))
      .filter((element) => element.getBoundingClientRect().height > innerHeight * 2.5)
      .map((element, index) => { const auditId = `region-${index}`; element.dataset.dreativeAuditId = auditId; return { auditId, name: element.id || element.className || element.tagName, height: Math.round(element.getBoundingClientRect().height) }; });
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .map((link) => link.href).filter((href) => href.startsWith(location.origin) && !new URL(href).hash && new URL(href).pathname !== location.pathname)
      .filter((href, index, all) => all.indexOf(href) === index);
    const tinyMeaningfulText = Array.from(document.querySelectorAll<HTMLElement>("button,a,label,input,textarea,select,[role=button],[role=tab],main p,main li,main dt,main dd"))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const hasMeaning = Boolean(element.textContent?.trim() || (element as HTMLInputElement).placeholder || element.getAttribute("aria-label"));
        const floor = element.matches("button,a,label,input,textarea,select,[role=button],[role=tab]") ? 11 : 10;
        return hasMeaning && rect.width > 2 && rect.height > 2 && style.display !== "none" && style.visibility !== "hidden" && Number.parseFloat(style.fontSize) < floor;
      })
      .slice(0, 8)
      .map((element) => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""} (${getComputedStyle(element).fontSize})`);
    return { documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, documentHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight, stickyRisks, longRegions, links, title: document.title, tinyMeaningfulText };
  });

  if (audit.documentWidth > audit.viewportWidth + 2) blockers.push(`${config.label}: document is ${audit.documentWidth - audit.viewportWidth}px wider than its viewport`);
  blockers.push(...audit.stickyRisks.map((risk) => `${config.label}: sticky clipping risk: ${risk}`));
  if (audit.tinyMeaningfulText.length) blockers.push(`${config.label}: meaningful text is below the readability floor: ${audit.tinyMeaningfulText.join(", ")}`);
  const sampleCount = Math.min(config.samples, Math.max(3, Math.ceil(audit.documentHeight / audit.viewportHeight)));
  const sparse: number[] = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const y = Math.round((audit.documentHeight - audit.viewportHeight) * index / Math.max(1, sampleCount - 1));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y); await twoFrames(page);
    const visible = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main p,main img,main svg,main canvas,main video,main button,main a")).filter((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.bottom > 0 && rect.top < innerHeight && rect.width > 8 && rect.height > 8 && style.visibility !== "hidden" && Number(style.opacity) > .02; }).length);
    if (visible === 0) sparse.push(y);
  }
  if (sparse.some((y, index) => index > 0 && y - sparse[index - 1] <= audit.viewportHeight * 1.25)) blockers.push(`${config.label}: consecutive near-empty viewport samples detected`);

  for (const region of audit.longRegions) {
    const selector = `[data-dreative-audit-id=${JSON.stringify(region.auditId)}]`;
    const locator = page.locator(selector);
    const regionTop = await locator.evaluate((element) => element.getBoundingClientRect().top + scrollY);
    const signatures = new Set<string>();
    for (const fraction of [.15, .5, .85]) { await page.evaluate((y) => scrollTo(0, y), Math.max(0, regionTop + region.height * fraction - audit.viewportHeight / 2)); await twoFrames(page); signatures.add(await visibleFingerprint(page, selector)); }
    if (signatures.size === 1) blockers.push(`${config.label}: long region ${region.name} (${region.height}px) showed no observable state change`);
  }

  if (config.label === "desktop") {
    if (contract) {
      blockers.push(...await verifyPrototypeEvidence(context, url, contract));
      await page.goto(url, { waitUntil: "domcontentloaded" }); await twoFrames(page);
      blockers.push(...await verifyContinuity(page, contract));
    }
    await page.evaluate(() => scrollTo(0, 0)); await twoFrames(page);
    const rootFingerprint = await visibleFingerprint(page, "main");
    for (const href of audit.links) {
      const routePage = await context.newPage();
      const routeResponse = await routePage.goto(href, { waitUntil: "domcontentloaded" }); await twoFrames(routePage);
      if (!routeResponse || routeResponse.status() >= 400) blockers.push(`production route ${new URL(href).pathname} returned HTTP ${routeResponse?.status() ?? "no response"}`);
      else {
        const mainCount = await routePage.locator("main").count();
        const routeFingerprint = mainCount === 1 ? await visibleFingerprint(routePage, "main") : "missing-main";
        if (routePage.url() !== page.url() && routeFingerprint === rootFingerprint && await routePage.title() === audit.title) blockers.push(`production route ${new URL(href).pathname} is an indistinguishable 200 SPA fallback`);
      }
      await routePage.close();
    }
    const mechanisms = contract?.mechanisms ?? [];
    if (mechanisms.length) {
      const positions: number[] = [];
      for (const mechanism of mechanisms) { const box = await page.locator(mechanism.selector).boundingBox(); if (box) positions.push(box.y); }
      if (positions.length >= 3 && positions.some((position, index) => index > 0 && position <= positions[index - 1])) blockers.push("Showcase mechanisms must follow their declared experience order");
    }
    for (const mechanism of mechanisms) { await page.goto(url, { waitUntil: "domcontentloaded" }); await twoFrames(page); const failure = await exerciseMechanism(page, mechanism); if (failure) blockers.push(failure); }
  }
  blockers.push(...runtimeErrors.map((error) => `${config.label}: ${error}`));
  checks.push(`${config.label} ${config.width}×${config.height}`, `${config.label}: ${sampleCount} viewport samples`);
  await context.close();
  return { ok: blockers.length === 0, blockers, checks };
}

export function validateMechanisms(profile: DeliveryProfile, contract?: ShowcaseMechanismContract): string[] {
  if (profile !== "showcase") return [];
  const errors: string[] = [];
  if (!contract || Array.isArray(contract) || contract.version !== 2) return ["Showcase requires a version 2 connected-experience contract; legacy three-widget contracts are rejected"];
  if (contract.classification?.implementation !== "attempted") errors.push("Showcase must be reported as an implementation attempt, not self-certified delivery");
  if (!['journey', 'interface'].includes(contract.experienceType)) errors.push("Showcase experienceType must be journey or interface");
  if (!contract.recommendedBaseline?.trim()) errors.push("Showcase contract requires the Recommended baseline");
  if (!Array.isArray(contract.showcaseDelta) || contract.showcaseDelta.filter((item) => typeof item === "string" && item.trim()).length < 2) errors.push("Showcase contract requires at least two perceptible differences from Recommended");
  if (!Array.isArray(contract.mediaOpportunities) || contract.mediaOpportunities.length < 2) errors.push("Showcase contract requires at least two product-native media opportunities");
  for (const [index, item] of (contract.mediaOpportunities ?? []).entries()) {
    if (typeof item?.opportunity !== "string" || !item.opportunity.trim() || !["use", "reject"].includes(item.decision) || typeof item.rationale !== "string" || !item.rationale.trim()) errors.push(`media opportunity ${index + 1} requires an opportunity, use|reject decision, and rationale`);
  }
  const prototype = contract.prototypeEvidence;
  if (!prototype || [prototype.boundedApproach, prototype.higherCeilingApproach, prototype.selectedApproach, prototype.boundedArtifact, prototype.higherCeilingArtifact, prototype.builderSelectionRationale].some((item) => typeof item !== "string" || !item.trim())
    || [prototype?.boundedCaptures?.desktop, prototype?.boundedCaptures?.mobile, prototype?.higherCeilingCaptures?.desktop, prototype?.higherCeilingCaptures?.mobile].some((item) => typeof item !== "string" || !item.trim()))
    errors.push("Showcase requires artifact-backed bounded and higher-ceiling prototypes with desktop and mobile captures");
  const continuity = contract.continuity;
  const affectedRegions = Array.isArray(continuity?.affectedRegions) ? continuity.affectedRegions : [];
  if (!continuity?.stateKey?.trim() || !continuity?.sourceSelector?.trim()) errors.push("Showcase requires a named shared state and source selector");
  if (!["click", "drag"].includes(continuity?.sourceTrigger)) errors.push("Showcase continuity sourceTrigger must be click or drag");
  if (!Number.isInteger(continuity?.stateCount) || continuity.stateCount < 2 || continuity.stateCount > 5) errors.push("Showcase continuity stateCount must be an integer from 2 to 5");
  if (affectedRegions.length < 3) errors.push("Showcase requires one meaningful state to affect at least three non-adjacent regions");
  const continuityStages = new Set(affectedRegions.map((region) => region?.stage));
  for (const stage of ["before", "peak", "after"]) if (!continuityStages.has(stage as "before" | "peak" | "after")) errors.push(`Showcase continuity is missing a ${stage} region`);
  if (new Set(affectedRegions.map((region) => region?.selector)).size !== affectedRegions.length) errors.push("Showcase continuity selectors must be unique");
  for (const [index, region] of affectedRegions.entries()) {
    if (!region?.selector?.trim() || !region?.effect?.trim() || !["before", "peak", "after"].includes(region?.stage)) errors.push(`continuity region ${index + 1} requires selector, stage, and concrete effect`);
  }
  const mechanisms = Array.isArray(contract.mechanisms) ? contract.mechanisms.filter((item) => item && typeof item === "object") : [];
  if (mechanisms.length < 1) errors.push("Showcase requires at least one executable signature mechanism");
  const names = mechanisms.map((item) => item.name);
  if (new Set(names).size !== names.length) errors.push("Showcase mechanism names must be unique");
  if (new Set(mechanisms.map((item) => item.selector)).size !== mechanisms.length) errors.push("Showcase mechanism selectors must be unique");
  if (contract.experienceType === "journey" && !mechanisms.some((item) => item.trigger === "scroll")) errors.push("A Showcase journey requires at least one substantial scroll-authored mechanism");
  if (contract.experienceType === "journey" && mechanisms.some((item) => item.stage === "after" && item.trigger === "hover")) errors.push("A Showcase journey cannot use hover alone as its post-peak mechanism");
  if (mechanisms.some((item) => item.stage === "peak" && item.trigger === "hover")) errors.push("A Showcase peak cannot be hover-only");
  for (const item of mechanisms) {
    if (!item.name?.trim()) errors.push("Showcase mechanism requires a name");
    if (!["before", "peak", "after"].includes(item.stage)) errors.push(`${item.name} mechanism requires a valid stage`);
    if (!item.selector?.trim()) errors.push(`${item.name} mechanism requires a selector`);
    if (!["scroll", "click", "hover", "drag"].includes(item.trigger)) errors.push(`${item.name} mechanism has an invalid trigger`);
    for (const key of ["experienceRole", "ceilingContribution", "continuityConnection", "mobileTransformation", "recommendedDifference"] as const)
      if (!item[key]?.trim()) errors.push(`${item.name} mechanism requires ${key}`);
    if (!item.meaningfulOutcome?.trim()) errors.push(`${item.name} mechanism requires meaningfulOutcome`);
    if (!Number.isInteger(item.stateCount) || item.stateCount < 2 || item.stateCount > 5) errors.push(`${item.name} mechanism stateCount must be an integer from 2 to 5`);
    if (item.trigger === "hover" && item.stateCount !== 2) errors.push(`${item.name} hover mechanism must declare exactly two states`);
    if (item.trigger === "scroll" && item.stateCount < 3) errors.push(`${item.name} scroll mechanism must declare at least three states`);
    if (!["dom-state", "typography", "image", "video", "svg", "canvas", "spatial-layout", "3d"].includes(item.mediaMode)) errors.push(`${item.name} mechanism has an invalid mediaMode`);
  }
  return [...new Set(errors)];
}

export async function runVisualSmoke(url: string, options: VisualSmokeOptions): Promise<VisualSmokeResult> {
  const contractErrors = validateMechanisms(options.profile, options.showcase);
  if (contractErrors.length) return { ok: false, blockers: contractErrors, checks: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const config of contexts) results.push(await inspectContext(browser, url, config, options.showcase));
    const blockers = [...new Set(results.flatMap((result) => result.blockers))];
    return { ok: blockers.length === 0, blockers, checks: results.flatMap((result) => result.checks) };
  } finally { await browser.close(); }
}
