import { chromium, type Browser, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { validateShowcaseExperienceMap, type ExperienceMap } from "../shared/experienceMap.js";

export type DeliveryProfile = "efficient" | "recommended" | "showcase";
export type MechanismTrigger = "scroll" | "click" | "hover" | "drag";
export type ShowcaseMediaMode = "dom-state" | "typography" | "image" | "video" | "svg" | "canvas" | "spatial-layout" | "3d";
export interface MechanismContractEntry {
  name: string;
  stage: "before" | "peak" | "after";
  selector: string;
  primarySelector: string;
  primarySubject: string;
  trigger: MechanismTrigger;
  mediaMode: ShowcaseMediaMode;
  mobileTransformation: string;
  productTruth: string;
  userCause: string;
  visibleChange: string;
  decisionConsequence: string;
  motionIntent: "deliberate-stepped" | "continuous-subject" | "state-transition" | "camera-only" | "none";
  temporalEvidence: "runtime-sampled" | "frame-analysis" | "user-accepted-limitation" | "none";
  motionEvidenceRef?: string;
  animationOwner: "css" | "gsap" | "motion" | "anime" | "react-state" | "native-js" | "other";
  ownedProperties: string[];
  stateCount: number;
  minimumDwellMs?: number;
  releaseSelector?: string;
}
export interface MotionAnalysisEvidence {
  version: 1;
  recording: string;
  recordingSha256: string;
  framesSampled: number;
  abruptReplacements: number;
  frozenIntervals: number;
  wholeFrameScaling: boolean;
  continuousSubjectMotion: boolean;
  method: string;
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
  referenceMode: "none" | "supplied" | "scout";
  referenceMinimum: number;
  referenceAdoptions: {
    source: string;
    sourceRef: string;
    rights: string;
    principle: string;
    decision: "use" | "reject";
    requiredBy: "direction" | "user";
    targetSelector?: string;
    visibleImplementation?: string;
    rationale: string;
    rejectionApprovedBy?: "user";
  }[];
  assetCommitments: {
    role: string;
    stage: "hero" | "peak" | "post-peak";
    subjectKind: "realistic-physical" | "graphic" | "interface" | "environmental";
    decision: "use" | "reject";
    requiredBy: "direction" | "user";
    targetSelector: string;
    medium: "image" | "video" | "svg" | "canvas" | "3d" | "none";
    productionSource: "supplied" | "sourced" | "generated" | "licensed-3d" | "pre-rendered-sequence" | "procedural" | "none";
    sourceKind: "local-file" | "remote-url" | "inline" | "generated-record" | "none";
    sourceRef: string;
    rights: string;
    treatment: string;
    crop: string;
    animationTechnique: string;
    mobileFallback: string;
    externalEvaluation: string;
    proceduralSuperiorityReason?: string;
    capabilityGap?: string;
    rationale: string;
    rejectionApprovedBy?: "user";
  }[];
  prototypeEvidence: {
    treatmentOptions: { name: string; frames: { stage: "input" | "change" | "reveal" | "outcome"; visual: string }[] }[];
    comparisonRequired: boolean;
    bestFitApproach: string;
    boldAlternativeApproach?: string;
    selectedApproach: string;
    bestFitArtifact: string;
    boldAlternativeArtifact?: string;
    bestFitCaptures: { desktop: string; mobile: string };
    boldAlternativeCaptures?: { desktop: string; mobile: string };
    bestFitRecordings: { desktop: string; mobile: string };
    boldAlternativeRecordings?: { desktop: string; mobile: string };
    fullPageContinuityStoryboards: {
      bestFit: { artifact: string; capture: string; heroSelector: string; peakSelector: string; postPeakSelector: string };
      boldAlternative?: { artifact: string; capture: string; heroSelector: string; peakSelector: string; postPeakSelector: string };
    };
    comparisonParity?: {
      bothFinalWorthy: true;
      sharedContent: true;
      sharedViewportCoverage: true;
      distinctInteractionModels: true;
    };
    prototypeReview: { status: "accepted"; acceptedBy: "user" };
    selectedBy: "user";
    builderSelectionRationale: string;
  };
  prototypeFidelity: {
    level: "treatment-board" | "animatic" | "production-like" | "integration-ready";
    limitations: string;
    selectedArtifact: string;
    prototypeSubjectSelector: string;
    integratedSubjectSelector: string;
    focalObject: string;
    copyBalance: string;
    controlPlacement: string;
    materialLighting: string;
    desktopFraming: string;
    mobileFraming: string;
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
  agencyChain: {
    controlSectionSelector: string;
    inputSelector: string;
    primaryResponseSelector: string;
    downstreamSelector: string;
    userAction: string;
    immediateResponse: string;
    decisionOutcome: string;
  };
  comparisonLayouts: {
    selector: string;
    itemSelector: string;
    identityAttribute: string;
    strategy: "fixed-grid" | "stable-rail" | "selected-stage" | "other";
    reorderMode: "none" | "selected-only" | "controlled";
    maxTravelViewportRatio: number;
    maxItemResizeRatio: number;
    gapTolerancePx: number;
    alignmentTolerancePx: number;
    selectedIdentity?: string;
    selectedItemMaxScale?: number;
    identityChannels: { channel: string; selector: string; uniqueProperty: "src" | "background-image" | "background-color" | "border-radius" | "clip-path" | "text" | "class" | `data-${string}` }[];
    assetStatus: "placeholder" | "production";
  }[];
  mechanisms: MechanismContractEntry[];
}
export interface VisualSmokeOptions { profile: DeliveryProfile; showcase?: ShowcaseMechanismContract; experienceMap?: ExperienceMap }
export interface VisualSmokeResult { ok: boolean; blockers: string[]; checks: string[] }

export function motionFidelityAdvisories(contract?: ShowcaseMechanismContract): string[] {
  if (!contract) return [];
  return contract.mechanisms.map((item) => {
    const properties = new Set(item.ownedProperties.map((value) => value.toLowerCase()));
    const wholeFrameOnly = [...properties].every((value) => /transform|opacity|filter|color|background/.test(value));
    if (item.mediaMode === "image")
      return `${item.name} motion fidelity: ${item.motionIntent}; discrete image sequence detected by contract; event/state coverage may pass, declared consequence and independent subject motion remain unverified; human review required`;
    if (item.mediaMode === "video")
      return `${item.name} motion fidelity: ${item.motionIntent}; continuous media candidate; event/state coverage may pass, declared consequence and independent subject choreography remain unverified; human review required`;
    if (wholeFrameOnly)
      return `${item.name} motion fidelity: ${item.motionIntent}; state transition dominated by whole-element style properties; event/state coverage may pass, declared consequence remains unverified; human review required`;
    return `${item.name} motion fidelity: ${item.motionIntent}; ${item.stateCount} observable states declared; consequence, temporal coherence, and taste unverified; human review required`;
  });
}

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

async function structuralMediaFingerprint(page: Page, entry: MechanismContractEntry): Promise<string> {
  return page.locator(entry.selector).evaluate((root, input) => {
    const primary = root.querySelector(input.primarySelector);
    if (!(primary instanceof HTMLElement || primary instanceof SVGElement)) return "missing-primary";
    const rootRect = primary.getBoundingClientRect();
    const all = [primary, ...Array.from(primary.querySelectorAll("*"))] as HTMLElement[];
    const mediaMode = input.mediaMode;
    const selector = mediaMode === "svg" ? "svg,svg *" : mediaMode === "image" ? "img,picture" : mediaMode === "video" ? "video" : mediaMode === "canvas" ? "canvas" : mediaMode === "3d" ? "canvas,[data-dreative-3d]" : "*";
    const nodes = mediaMode === "dom-state" || mediaMode === "typography" || mediaMode === "spatial-layout" ? all : all.filter((element) => element !== root && element.matches(selector));
    const meaningfulTransform = (value: string): string => {
      if (value === "none") return "none";
      const match = value.match(/^matrix\(([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)\)$/);
      if (!match) return value;
      const values = match.slice(1).map(Number);
      const [a, b, c, d, tx, ty] = values;
      return Math.abs(b) < .001 && Math.abs(c) < .001 && Math.abs(a - d) < .001 && Math.abs(tx) < 1 && Math.abs(ty) < 1 ? "uniform-scale" : value;
    };
    return JSON.stringify(nodes.slice(0, 60).map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const viewportPinned = style.position === "sticky" || style.position === "fixed";
      const layoutWidth = element.offsetWidth || Math.round(rect.width);
      const layoutHeight = element.offsetHeight || Math.round(rect.height);
      const source = element instanceof HTMLImageElement ? element.currentSrc : "";
      const media = element instanceof HTMLMediaElement ? element.currentTime.toFixed(2) : "";
      let canvas = "";
      if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
      return [element.tagName, viewportPinned ? null : Math.round(rect.x - rootRect.x), viewportPinned ? null : Math.round(rect.y - rootRect.y), layoutWidth, layoutHeight, meaningfulTransform(style.transform), style.clipPath, style.backgroundImage, source, media, canvas];
    }));
  }, { mediaMode: entry.mediaMode, primarySelector: entry.primarySelector });
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
  const structuralSignatures = new Set<string>();
  const orderedSignatures: string[] = [];
  let visibilityFailure: string | null = null;
  for (const fraction of [.1, .3, .5, .7, .9]) {
    const y = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * fraction - region.viewport / 2));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y);
    await twoFrames(page);
    const signature = await declaredMediaFingerprint(page, entry);
    signatures.add(signature);
    orderedSignatures.push(signature);
    structuralSignatures.add(await structuralMediaFingerprint(page, entry));
    const visibility = await page.locator(entry.selector).locator(entry.primarySelector).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
      const height = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      const visibleArea = width * height;
      return {
        subjectRatio: visibleArea / Math.max(1, rect.width * rect.height),
        viewportRatio: visibleArea / Math.max(1, innerWidth * innerHeight),
      };
    });
    if (!visibilityFailure && (visibility.subjectRatio < .35 || visibility.viewportRatio < .01))
      visibilityFailure = `${entry.name} primary subject ${entry.primarySubject} is materially clipped or absent at the ${Math.round(fraction * 100)}% scroll state`;
  }
  const required = Math.min(5, entry.stateCount);
  if (signatures.size < required) return `${entry.name} scroll mechanism ${entry.selector} produced ${signatures.size} distinct states; ${required} are declared`;
  if (visibilityFailure) return visibilityFailure;
  if (structuralSignatures.size < 2) return `${entry.name} scroll mechanism ${entry.selector} changes only text, opacity, color, filter, or uniform scale; Showcase requires a structural or media transformation`;

  const endY = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * .9 - region.viewport / 2));
  const startY = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * .1 - region.viewport / 2));
  for (const [label, steps] of [["slow", 12], ["normal", 4], ["rapid", 1]] as const) {
    await page.evaluate((scrollY) => scrollTo(0, scrollY), startY);
    await twoFrames(page);
    const delta = (endY - startY) / steps;
    for (let index = 0; index < steps; index += 1) {
      await page.mouse.wheel(0, delta);
      if (steps > 1) await twoFrames(page);
    }
    await page.waitForTimeout(100);
    await twoFrames(page);
    if (await declaredMediaFingerprint(page, entry) !== orderedSignatures.at(-1))
      return `${entry.name} ${label} wheel input did not settle on the final authored state`;
  }
  const dwellSignature = await declaredMediaFingerprint(page, entry);
  await page.waitForTimeout(entry.minimumDwellMs ?? 400);
  if (await declaredMediaFingerprint(page, entry) !== dwellSignature) return `${entry.name} key state did not remain stable long enough to read after scroll input settled`;

  for (const fraction of [.7, .5, .3, .1]) {
    const y = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * fraction - region.viewport / 2));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y);
    await twoFrames(page);
  }
  if (await declaredMediaFingerprint(page, entry) !== orderedSignatures[0]) return `${entry.name} reverse scroll did not restore the opening authored state`;

  const releaseY = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height - region.viewport));
  await page.evaluate((scrollY) => scrollTo(0, scrollY), releaseY);
  await twoFrames(page);
  const releaseTarget = page.locator(entry.releaseSelector ?? `${entry.selector} + *`);
  if (await releaseTarget.count() !== 1) return `${entry.name} release selector ${entry.releaseSelector} must resolve exactly once`;
  const releaseOverlap = await page.locator(entry.selector).evaluate((root, input) => {
    const { primarySelector, releaseSelector } = input;
    const primary = root.querySelector<HTMLElement>(primarySelector);
    const next = document.querySelector<HTMLElement>(releaseSelector);
    if (!primary || !next) return false;
    const subject = primary.getBoundingClientRect();
    const following = next.getBoundingClientRect();
    return following.top < innerHeight - 1 && subject.bottom > Math.max(0, following.top);
  }, { primarySelector: entry.primarySelector, releaseSelector: entry.releaseSelector ?? `${entry.selector} + *` });
  return releaseOverlap ? `${entry.name} primary subject overlaps the following section during release` : null;
}

async function stableRouteIdentity(page: Page): Promise<string> {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    const heading = main?.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const landmarks = Array.from(document.querySelectorAll("main,header,nav,footer,[role=main]"))
      .map((element) => `${element.tagName.toLowerCase()}:${element.getAttribute("role") ?? ""}:${element.id}`)
      .join("|");
    const text = (main?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 1600);
    return JSON.stringify({ title: document.title, heading, landmarks, text });
  });
}

async function exerciseMechanism(page: Page, entry: MechanismContractEntry): Promise<string | null> {
  const locator = page.locator(entry.selector);
  if (await locator.count() !== 1) return `${entry.name} selector ${entry.selector} must resolve to exactly one element`;
  const box = await locator.boundingBox();
  if (!box || box.width < 8 || box.height < 8) return `${entry.name} selector ${entry.selector} is hidden or zero-sized`;
  const primary = locator.locator(entry.primarySelector);
  if (await primary.count() !== 1) return `${entry.name} primary selector ${entry.primarySelector} must resolve to exactly one element inside ${entry.selector}`;
  const primaryProblem = await primary.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (element.getAttribute("aria-hidden") === "true") return "is aria-hidden decoration";
    if (rect.width < 24 || rect.height < 24 || rect.width * rect.height < innerWidth * innerHeight * .01) return "occupies less than 1% of the viewport";
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= .02) return "is not visibly rendered";
    return null;
  });
  if (primaryProblem) return `${entry.name} primary subject ${entry.primarySubject} ${primaryProblem}`;
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

async function verifyAdoptionAndAgency(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  for (const adoption of contract.referenceAdoptions) {
    if (/^https?:\/\//i.test(adoption.sourceRef)) {
      const response = await page.request.get(adoption.sourceRef);
      if (!response.ok()) errors.push(`reference source is not loadable: ${adoption.sourceRef}`);
    } else {
      const file = path.resolve(adoption.sourceRef);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`reference source does not exist: ${adoption.sourceRef}`);
    }
  }
  for (const adoption of contract.referenceAdoptions.filter((item) => item.decision === "use")) {
    const target = page.locator(adoption.targetSelector ?? "");
    if (await target.count() !== 1) {
      errors.push(`reference adoption target ${adoption.targetSelector} must resolve exactly once`);
      continue;
    }
    const visible = await target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width >= 24 && rect.height >= 24 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02;
    });
    if (!visible) errors.push(`reference adoption target ${adoption.targetSelector} must be visibly rendered and meaningfully sized`);
  }
  for (const asset of contract.assetCommitments.filter((item) => item.decision === "use")) {
    const target = page.locator(asset.targetSelector);
    if (await target.count() !== 1) {
      errors.push(`required asset target ${asset.targetSelector} must resolve exactly once`);
      continue;
    }
    const present = await target.evaluate((root, medium) => {
      const selector = medium === "image" ? "img,picture" : medium === "video" ? "video" : medium === "svg" ? "svg" : medium === "canvas" ? "canvas" : medium === "3d" ? "canvas,[data-dreative-3d]" : "";
      return selector ? Boolean(root.matches(selector) || root.querySelector(selector)) : false;
    }, asset.medium);
    if (!present) errors.push(`required ${asset.medium} asset is missing from ${asset.targetSelector}`);
    if (asset.sourceKind === "inline" && await page.locator(asset.sourceRef).count() !== 1)
      errors.push(`inline asset source ${asset.sourceRef} must resolve exactly once`);
    if (asset.sourceKind === "local-file") {
      const file = path.resolve(asset.sourceRef);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`local asset source does not exist: ${asset.sourceRef}`);
    }
    if (asset.sourceKind === "remote-url") {
      const response = await page.request.get(asset.sourceRef);
      if (!response.ok()) errors.push(`remote asset source is not loadable: ${asset.sourceRef}`);
    }
    if (asset.sourceKind === "generated-record") {
      const file = path.resolve(asset.sourceRef);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`generated asset record does not exist: ${asset.sourceRef}`);
    }
  }
  for (const selector of [contract.agencyChain.controlSectionSelector, contract.agencyChain.inputSelector, contract.agencyChain.primaryResponseSelector, contract.agencyChain.downstreamSelector]) {
    if (await page.locator(selector).count() !== 1) errors.push(`agency-chain selector ${selector} must resolve exactly once`);
  }
  const controlLocator = page.locator(contract.agencyChain.controlSectionSelector);
  const inputLocator = page.locator(contract.agencyChain.inputSelector);
  if (await controlLocator.count() === 1 && await inputLocator.count() === 1) {
    const controlOwnsInput = await controlLocator.evaluate((section, inputSelector) => {
      const input = document.querySelector(inputSelector);
      return Boolean(input && (section === input || section.contains(input)));
    }, contract.agencyChain.inputSelector);
    if (!controlOwnsInput) errors.push(`agency control section ${contract.agencyChain.controlSectionSelector} does not own input ${contract.agencyChain.inputSelector}`);
  }
  if (new Set([contract.agencyChain.inputSelector, contract.agencyChain.primaryResponseSelector, contract.agencyChain.downstreamSelector]).size < 3)
    errors.push("agency chain must connect distinct input, primary response, and downstream decision regions");
  return errors;
}

async function verifyComparisonLayouts(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  type LayoutItem = { id: string; x: number; y: number; width: number; height: number };
  const geometry = (items: LayoutItem[], selectedIdentity?: string) => {
    const horizontalGaps: number[] = [];
    const verticalGaps: number[] = [];
    const alignments: number[] = [];
    const candidates = items.filter((item) => item.id !== selectedIdentity);
    const groups = (axis: "row" | "column"): LayoutItem[][] => {
      const pending = [...candidates];
      const output: LayoutItem[][] = [];
      while (pending.length) {
        const seed = pending.shift()!;
        const group = [seed];
        for (let index = pending.length - 1; index >= 0; index -= 1) {
          const item = pending[index];
          const overlap = axis === "row"
            ? Math.max(0, Math.min(seed.y + seed.height, item.y + item.height) - Math.max(seed.y, item.y))
            : Math.max(0, Math.min(seed.x + seed.width, item.x + item.width) - Math.max(seed.x, item.x));
          const extent = axis === "row" ? Math.min(seed.height, item.height) : Math.min(seed.width, item.width);
          if (overlap >= extent * .5) group.push(...pending.splice(index, 1));
        }
        output.push(group);
      }
      return output;
    };
    for (const row of groups("row")) {
      const sorted = row.sort((a, b) => a.x - b.x);
      for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1], current = sorted[index];
        horizontalGaps.push(Math.max(0, current.x - (previous.x + previous.width)));
        alignments.push(Math.abs(current.y - previous.y));
      }
    }
    for (const column of groups("column")) {
      const sorted = column.sort((a, b) => a.y - b.y);
      for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1], current = sorted[index];
        verticalGaps.push(Math.max(0, current.y - (previous.y + previous.height)));
        alignments.push(Math.abs(current.x - previous.x));
      }
    }
    const spread = (values: number[]) => values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
    return {
      gapSpread: Math.max(spread(horizontalGaps), spread(verticalGaps)),
      alignmentDrift: alignments.length ? Math.max(...alignments) : 0,
    };
  };
  const snapshot = async (layout: ShowcaseMechanismContract["comparisonLayouts"][number]) => {
    const root = page.locator(layout.selector);
    if (await root.count() !== 1) return null;
    return root.locator(layout.itemSelector).evaluateAll((items, attribute) => items.map((item) => {
      const rect = item.getBoundingClientRect();
      return { id: item.getAttribute(attribute) ?? "", x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }), layout.identityAttribute);
  };
  for (const layout of contract.comparisonLayouts) {
    const before = await snapshot(layout);
    if (!before || before.length < 2) {
      errors.push(`comparison layout ${layout.selector} must resolve once and contain at least two ${layout.itemSelector} items`);
      continue;
    }
    if (before.some((item) => !item.id) || new Set(before.map((item) => item.id)).size !== before.length) {
      errors.push(`comparison layout ${layout.selector} requires unique ${layout.identityAttribute} identities`);
      continue;
    }
    const identityEvidence = await page.locator(layout.selector).locator(layout.itemSelector).evaluateAll((items, channels) => channels.map((channel) => {
      const values = items.map((item) => {
        const target = channel.selector === "$self" ? item : item.querySelector(channel.selector);
        if (!target) return "";
        if (channel.uniqueProperty === "src") return target instanceof HTMLImageElement ? target.currentSrc : target.getAttribute("src") ?? "";
        if (["background-image", "background-color", "border-radius", "clip-path"].includes(channel.uniqueProperty)) return getComputedStyle(target).getPropertyValue(channel.uniqueProperty);
        if (channel.uniqueProperty === "text") return target.textContent?.trim() ?? "";
        if (channel.uniqueProperty === "class") return target.getAttribute("class") ?? "";
        return target.getAttribute(channel.uniqueProperty) ?? "";
      });
      return { channel: channel.channel, values };
    }), layout.identityChannels);
    for (const evidence of identityEvidence) {
      if (evidence.values.some((value) => !value) || new Set(evidence.values).size < Math.min(2, evidence.values.length))
        errors.push(`comparison layout ${layout.selector} identity channel ${evidence.channel} does not render distinct values across products`);
    }
    const source = page.locator(contract.continuity.sourceSelector);
    if (await source.count() === 1) {
      await source.click();
      await twoFrames(page);
      const after = await snapshot(layout);
      if (!after || after.length !== before.length) {
        errors.push(`comparison layout ${layout.selector} changed its comparison item count`);
        continue;
      }
      const afterById = new Map(after.map((item) => [item.id, item]));
      const travel = before.map((item) => {
        const next = afterById.get(item.id);
        return next ? Math.hypot(next.x - item.x, next.y - item.y) / Math.max(1, page.viewportSize()?.width ?? 1) : Infinity;
      });
      const moved = travel.filter((distance) => distance > .02).length;
      if (travel.some((distance) => distance > layout.maxTravelViewportRatio))
        errors.push(`comparison layout ${layout.selector} moves an item beyond its declared viewport travel limit`);
      if (layout.reorderMode === "none" && moved > 0)
        errors.push(`comparison layout ${layout.selector} declares stable positions but moves ${moved} items`);
      if (layout.reorderMode === "selected-only" && moved > 1)
        errors.push(`comparison layout ${layout.selector} moves ${moved} items; selected-only permits one`);
      for (const item of before) {
        const next = afterById.get(item.id);
        if (!next) continue;
        const resize = Math.max(Math.abs(next.width / Math.max(1, item.width) - 1), Math.abs(next.height / Math.max(1, item.height) - 1));
        const limit = item.id === layout.selectedIdentity ? (layout.selectedItemMaxScale ?? 1) - 1 : layout.maxItemResizeRatio;
        if (resize > limit) errors.push(`comparison layout ${layout.selector} resizes ${item.id} beyond its declared limit`);
      }
      for (const [state, metrics] of [["before", geometry(before, layout.selectedIdentity)], ["after", geometry(after, layout.selectedIdentity)]] as const) {
        if (metrics.gapSpread > layout.gapTolerancePx)
          errors.push(`comparison layout ${layout.selector} has inconsistent ${state} gaps beyond ${layout.gapTolerancePx}px`);
        if (metrics.alignmentDrift > layout.alignmentTolerancePx)
          errors.push(`comparison layout ${layout.selector} has ${state} alignment drift beyond ${layout.alignmentTolerancePx}px`);
      }
    }
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

function recordingProblem(bytes: Buffer, contentType: string, source: string): string | null {
  if (bytes.length < 1024) return "is too small to be a usable motion recording";
  const mp4 = bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
  const webm = bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  if (!mp4 && !webm && !/video\/(mp4|webm)/i.test(contentType)) return `is not a recognized MP4 or WebM recording: ${source}`;
  return null;
}

async function verifyPrototypeEvidence(context: Awaited<ReturnType<Browser["newContext"]>>, url: string, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  const artifactFingerprints: string[] = [];
  const artifacts = contract.prototypeEvidence.comparisonRequired && contract.prototypeEvidence.boldAlternativeArtifact
    ? [["best-fit", contract.prototypeEvidence.bestFitArtifact], ["bold-alternative", contract.prototypeEvidence.boldAlternativeArtifact]] as const
    : [["selected", contract.prototypeEvidence.bestFitArtifact]] as const;
  for (const [label, artifact] of artifacts) {
    const page = await context.newPage();
    const target = new URL(artifact, url).href;
    const response = await page.goto(target, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) errors.push(`${label} prototype artifact did not load successfully: ${target}`);
    else artifactFingerprints.push(await visibleFingerprint(page, "body"));
    await page.close();
  }
  const storyboards = contract.prototypeEvidence.comparisonRequired && contract.prototypeEvidence.fullPageContinuityStoryboards.boldAlternative
    ? [["best-fit", contract.prototypeEvidence.fullPageContinuityStoryboards.bestFit], ["bold-alternative", contract.prototypeEvidence.fullPageContinuityStoryboards.boldAlternative]] as const
    : [["selected", contract.prototypeEvidence.fullPageContinuityStoryboards.bestFit]] as const;
  for (const [label, storyboard] of storyboards) {
    const storyboardPage = await context.newPage();
    const target = new URL(storyboard.artifact, url).href;
    const response = await storyboardPage.goto(target, { waitUntil: "domcontentloaded" });
    if (!response || response.status() >= 400) errors.push(`${label} full-page continuity storyboard did not load successfully`);
    else {
      const selectors = [storyboard.heroSelector, storyboard.peakSelector, storyboard.postPeakSelector];
      const regions = [];
      for (const selector of selectors) {
        const locator = storyboardPage.locator(selector);
        if (await locator.count() !== 1) { errors.push(`${label} storyboard region ${selector} must resolve exactly once`); continue; }
        regions.push(await locator.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return { top: rect.top + scrollY, visible: rect.width >= 32 && rect.height >= 32 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02 };
        }));
      }
      if (regions.some((region) => !region.visible)) errors.push(`${label} storyboard hero, peak, and post-peak regions must be visibly rendered`);
      if (regions.length === 3 && !(regions[0].top < regions[1].top && regions[1].top < regions[2].top))
        errors.push(`${label} storyboard must order hero → peak → post-peak consequence`);
    }
    await storyboardPage.close();
    const captureTarget = new URL(storyboard.capture, url).href;
    const captureResponse = await context.request.get(captureTarget);
    const contentType = captureResponse.headers()["content-type"] ?? "";
    if (!captureResponse.ok() || !/^image\//i.test(contentType)) errors.push(`${label} storyboard capture is not a loadable image`);
    else {
      const problem = captureProblem(Buffer.from(await captureResponse.body()), contentType, "desktop");
      if (problem) errors.push(`${label} storyboard capture ${problem}`);
    }
  }
  if (artifactFingerprints.length === 2 && artifactFingerprints[0] === artifactFingerprints[1]) errors.push("Best Fit and Bold Alternative prototype artifacts are indistinguishable");
  const capturesToCheck = contract.prototypeEvidence.comparisonRequired && contract.prototypeEvidence.boldAlternativeCaptures
    ? [["best-fit", contract.prototypeEvidence.bestFitCaptures], ["bold-alternative", contract.prototypeEvidence.boldAlternativeCaptures]] as const
    : [["selected", contract.prototypeEvidence.bestFitCaptures]] as const;
  for (const [label, captures] of capturesToCheck) {
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
  const recordingsToCheck = contract.prototypeEvidence.comparisonRequired && contract.prototypeEvidence.boldAlternativeRecordings
    ? [["best-fit", contract.prototypeEvidence.bestFitRecordings], ["bold-alternative", contract.prototypeEvidence.boldAlternativeRecordings]] as const
    : [["selected", contract.prototypeEvidence.bestFitRecordings]] as const;
  for (const [label, recordings] of recordingsToCheck) {
    const hashes: string[] = [];
    for (const viewport of ["desktop", "mobile"] as const) {
      const recording = recordings?.[viewport];
      if (!recording?.trim()) { errors.push(`${label} prototype requires a ${viewport} motion recording`); continue; }
      let bytes: Buffer | null = null;
      let contentType = "";
      if (/^https?:\/\//i.test(recording)) {
        const response = await context.request.get(recording);
        contentType = response.headers()["content-type"] ?? "";
        if (!response.ok()) errors.push(`${label} ${viewport} recording is not loadable: ${recording}`);
        else bytes = Buffer.from(await response.body());
      } else {
        const file = path.resolve(recording);
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`${label} ${viewport} recording does not exist: ${file}`);
        else { bytes = fs.readFileSync(file); contentType = path.extname(file); }
      }
      if (bytes) {
        const problem = recordingProblem(bytes, contentType, recording);
        if (problem) errors.push(`${label} ${viewport} recording ${problem}`);
        hashes.push(createHash("sha256").update(bytes).digest("hex"));
      }
    }
    if (hashes.length === 2 && hashes[0] === hashes[1]) errors.push(`${label} desktop and mobile recordings must be different files`);
  }
  return errors;
}

async function verifyPrototypeFidelity(page: Page, context: Awaited<ReturnType<Browser["newContext"]>>, url: string, contract: ShowcaseMechanismContract): Promise<string[]> {
  const fidelity = contract.prototypeFidelity;
  if (!fidelity) return ["Showcase requires a prototype-to-product fidelity contract"];
  const target = new URL(fidelity.selectedArtifact, url).href;
  const prototypePage = await context.newPage();
  const response = await prototypePage.goto(target, { waitUntil: "domcontentloaded" });
  await twoFrames(prototypePage);
  const errors: string[] = [];
  if (!response || response.status() >= 400) errors.push(`selected prototype artifact did not load successfully: ${target}`);
  const measure = async (targetPage: Page, selector: string) => {
    const locator = targetPage.locator(selector);
    if (await locator.count() !== 1) return null;
    await locator.scrollIntoViewIfNeeded();
    await twoFrames(targetPage);
    return locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { area: rect.width * rect.height / Math.max(1, innerWidth * innerHeight), visible: rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth };
    });
  };
  const prototype = await measure(prototypePage, fidelity.prototypeSubjectSelector);
  const integrated = await measure(page, fidelity.integratedSubjectSelector);
  if (!prototype) errors.push(`prototype subject ${fidelity.prototypeSubjectSelector} must resolve exactly once`);
  if (!integrated) errors.push(`integrated subject ${fidelity.integratedSubjectSelector} must resolve exactly once`);
  if (prototype && integrated) {
    const ratio = integrated.area / Math.max(.0001, prototype.area);
    if (ratio < .04 || ratio > 25)
      errors.push(`selected prototype focal scale was not preserved by ${fidelity.integratedSubjectSelector} (viewport-area ratio ${ratio.toFixed(2)})`);
  }
  await prototypePage.close();
  return errors;
}

async function verifyExperienceMapBindings(page: Page, map: ExperienceMap, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  for (const section of map.sections.filter((item) => item.agency !== "watch" || (item.trigger && item.trigger !== "none"))) {
    const mechanism = contract.mechanisms.find((item) => item.selector === section.selector);
    if (!mechanism) { errors.push(`Experience Map agency/transform section ${section.id} is not bound to a verified Showcase mechanism at ${section.selector}`); continue; }
    if (mechanism.trigger !== section.trigger) errors.push(`Experience Map section ${section.id} trigger ${section.trigger} does not match mechanism trigger ${mechanism.trigger}`);
    const missing = (section.ownedProperties ?? []).filter((property) => !mechanism.ownedProperties.includes(property));
    if (missing.length) errors.push(`Experience Map section ${section.id} owns properties not declared by its mechanism: ${missing.join(", ")}`);
    if (await page.locator(section.selector ?? "").count() !== 1) errors.push(`Experience Map section ${section.id} selector ${section.selector} must resolve exactly once`);
  }
  const controls = map.sections.filter((section) => section.agency === "control");
  if (!controls.some((section) => section.selector === contract.agencyChain.controlSectionSelector))
    errors.push(`Experience Map Control section must bind agency control section ${contract.agencyChain.controlSectionSelector}`);
  return errors;
}

async function inspectContext(browser: Browser, url: string, config: typeof contexts[number], contract?: ShowcaseMechanismContract, experienceMap?: ExperienceMap): Promise<VisualSmokeResult> {
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
  const collisionSamples = new Set<string>();
  for (let index = 0; index < sampleCount; index += 1) {
    const y = Math.round((audit.documentHeight - audit.viewportHeight) * index / Math.max(1, sampleCount - 1));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y); await twoFrames(page);
    const visible = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main p,main img,main svg,main canvas,main video,main button,main a")).filter((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return rect.bottom > 0 && rect.top < innerHeight && rect.width > 8 && rect.height > 8 && style.visibility !== "hidden" && Number(style.opacity) > .02; }).length);
    if (visible === 0) sparse.push(y);
    const collisions = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("main h1,main h2,main h3,main h4,main p,main li,main label,main button,main a"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return Boolean(element.innerText.trim()) && rect.bottom > 0 && rect.top < innerHeight && rect.width > 8 && rect.height > 8 && style.visibility !== "hidden" && Number(style.opacity) > .1;
        }).slice(0, 100);
      const name = (element: HTMLElement): string => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : element.classList.length ? `.${element.classList[0]}` : ""}`;
      const found: string[] = [];
      for (let left = 0; left < elements.length; left += 1) for (let right = left + 1; right < elements.length; right += 1) {
        const a = elements[left], b = elements[right];
        if (a.contains(b) || b.contains(a)) continue;
        const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
        const width = Math.max(0, Math.min(ar.right, br.right) - Math.max(ar.left, br.left));
        const height = Math.max(0, Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top));
        const overlap = width * height;
        const smaller = Math.min(ar.width * ar.height, br.width * br.height);
        if (overlap >= 64 && overlap / smaller >= .18) found.push(`${name(a)} overlaps ${name(b)}`);
      }
      return found.slice(0, 5);
    });
    for (const collision of collisions) collisionSamples.add(collision);
  }
  if (sparse.some((y, index) => index > 0 && y - sparse[index - 1] <= audit.viewportHeight * 1.25)) blockers.push(`${config.label}: consecutive near-empty viewport samples detected`);
  if (collisionSamples.size) blockers.push(`${config.label}: text collision detected during scroll: ${[...collisionSamples].join(", ")}`);

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
      blockers.push(...await verifyPrototypeFidelity(page, context, url, contract));
      blockers.push(...await verifyContinuity(page, contract));
      blockers.push(...await verifyAdoptionAndAgency(page, contract));
      blockers.push(...await verifyComparisonLayouts(page, contract));
      if (experienceMap) blockers.push(...await verifyExperienceMapBindings(page, experienceMap, contract));
    }
    await page.evaluate(() => scrollTo(0, 0)); await twoFrames(page);
    const rootIdentity = await stableRouteIdentity(page);
    for (const href of audit.links) {
      const routePage = await context.newPage();
      const routeResponse = await routePage.goto(href, { waitUntil: "domcontentloaded" }); await twoFrames(routePage);
      if (!routeResponse || routeResponse.status() >= 400) blockers.push(`production route ${new URL(href).pathname} returned HTTP ${routeResponse?.status() ?? "no response"}`);
      else {
        const mainCount = await routePage.locator("main").count();
        const routeIdentity = mainCount === 1 ? await stableRouteIdentity(routePage) : "missing-main";
        if (routePage.url() !== page.url() && routeIdentity === rootIdentity) blockers.push(`production route ${new URL(href).pathname} is an indistinguishable 200 SPA fallback by stable title, heading, landmarks, and route content`);
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
  } else if ((config.label === "mobile-390" || config.label === "mobile-320") && contract) {
    for (const mechanism of contract.mechanisms) {
      await page.goto(url, { waitUntil: "domcontentloaded" }); await twoFrames(page);
      const failure = await exerciseMechanism(page, mechanism);
      if (failure) blockers.push(`mobile Showcase equivalent missing: ${failure}`);
    }
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
  if (!Array.isArray(contract.referenceAdoptions)) errors.push("Showcase referenceAdoptions must be an array");
  if (!["none", "supplied", "scout"].includes(contract.referenceMode)) errors.push("Showcase referenceMode must be none, supplied, or scout");
  if (!Number.isInteger(contract.referenceMinimum) || contract.referenceMinimum < 0 || contract.referenceMinimum > 4) errors.push("Showcase referenceMinimum must be an integer from 0 to 4");
  if (contract.referenceMode === "none" && ((contract.referenceMinimum ?? 0) !== 0 || (contract.referenceAdoptions?.length ?? 0) !== 0)) errors.push("referenceMode none requires zero references");
  if (contract.referenceMode === "supplied" && (contract.referenceAdoptions?.length ?? 0) < Math.max(1, contract.referenceMinimum ?? 0)) errors.push("referenceMode supplied requires the configured number of traceable references");
  if (contract.referenceMode === "scout" && (contract.referenceAdoptions?.length ?? 0) < Math.max(2, contract.referenceMinimum ?? 0)) errors.push("referenceMode scout requires at least two traceable candidates or adoptions");
  for (const [index, item] of (contract.referenceAdoptions ?? []).entries()) {
    if (![item?.source, item?.sourceRef, item?.rights, item?.principle, item?.rationale].every((value) => typeof value === "string" && value.trim())
      || !["use", "reject"].includes(item?.decision) || !["direction", "user"].includes(item?.requiredBy))
      errors.push(`reference adoption ${index + 1} requires a traceable sourceRef, rights status, principle, decision, requiredBy, and rationale`);
    if (item?.decision === "use" && ![item.targetSelector, item.visibleImplementation].every((value) => typeof value === "string" && value.trim()))
      errors.push(`used reference adoption ${index + 1} requires targetSelector and visibleImplementation`);
    if (item?.decision === "reject" && item?.requiredBy === "user" && item?.rejectionApprovedBy !== "user")
      errors.push(`user-required reference ${index + 1} can be rejected only with explicit user approval`);
  }
  if (!Array.isArray(contract.assetCommitments) || contract.assetCommitments.length < 3) errors.push("Showcase requires focal asset commitments for hero, peak, and post-peak subjects");
  for (const [index, item] of (contract.assetCommitments ?? []).entries()) {
    if (![item?.role, item?.targetSelector, item?.sourceRef, item?.rights, item?.treatment, item?.crop, item?.animationTechnique, item?.mobileFallback, item?.externalEvaluation, item?.rationale].every((value) => typeof value === "string" && value.trim())
      || !["hero", "peak", "post-peak"].includes(item?.stage) || !["realistic-physical", "graphic", "interface", "environmental"].includes(item?.subjectKind)
      || !["use", "reject"].includes(item?.decision) || !["direction", "user"].includes(item?.requiredBy) || !["image", "video", "svg", "canvas", "3d", "none"].includes(item?.medium)
      || !["supplied", "sourced", "generated", "licensed-3d", "pre-rendered-sequence", "procedural", "none"].includes(item?.productionSource)
      || !["local-file", "remote-url", "inline", "generated-record", "none"].includes(item?.sourceKind))
      errors.push(`asset commitment ${index + 1} requires stage, subject kind, source provenance, rights, treatment, crop, animation, mobile fallback, external evaluation, and rationale`);
    if ((item?.productionSource === "none") !== (item?.medium === "none") || (item?.sourceKind === "none") !== (item?.medium === "none"))
      errors.push(`asset commitment ${index + 1} must keep productionSource, sourceKind, and medium none states consistent`);
    if (item?.productionSource === "licensed-3d" && item?.medium !== "3d")
      errors.push(`licensed-3d asset ${index + 1} must declare medium 3d`);
    if (item?.subjectKind === "realistic-physical" && item?.productionSource === "procedural" && !item?.proceduralSuperiorityReason?.trim())
      errors.push(`procedural realistic-physical asset ${index + 1} requires an artistic-superiority reason after external evaluation`);
    if (item?.decision === "reject" && item?.requiredBy === "user" && item?.rejectionApprovedBy !== "user")
      errors.push(`user-required asset ${index + 1} can be rejected only with explicit user approval`);
  }
  const assetStages = new Set((contract.assetCommitments ?? []).map((item) => item?.stage));
  for (const stage of ["hero", "peak", "post-peak"]) if (!assetStages.has(stage as "hero" | "peak" | "post-peak")) errors.push(`Showcase asset commitments are missing the ${stage} focal subject`);
  const prototype = contract.prototypeEvidence;
  if (!prototype || !Array.isArray(prototype.treatmentOptions) || prototype.treatmentOptions.length < 2 || prototype.treatmentOptions.length > 3 || prototype.treatmentOptions.some((item) => !item || typeof item.name !== "string" || !item.name.trim() || !Array.isArray(item.frames) || item.frames.length < 3 || item.frames.length > 8 || item.frames.some((frame) => !frame || !["input", "change", "reveal", "outcome"].includes(frame.stage) || typeof frame.visual !== "string" || !frame.visual.trim()) || !item.frames.some((frame) => frame.stage === "change") || !item.frames.some((frame) => frame.stage === "outcome")))
    errors.push("Showcase requires two or three concrete treatment boards, each with 3-8 visual frames including change and outcome");
  if (!prototype || [prototype.bestFitApproach, prototype.selectedApproach, prototype.bestFitArtifact, prototype.builderSelectionRationale].some((item) => typeof item !== "string" || !item.trim())
    || [prototype?.bestFitCaptures?.desktop, prototype?.bestFitCaptures?.mobile, prototype?.bestFitRecordings?.desktop, prototype?.bestFitRecordings?.mobile].some((item) => typeof item !== "string" || !item.trim()))
    errors.push("Showcase requires one artifact-backed production prototype with desktop/mobile captures and motion recordings");
  if (prototype?.comparisonRequired && ([prototype.boldAlternativeApproach, prototype.boldAlternativeArtifact, prototype?.boldAlternativeCaptures?.desktop, prototype?.boldAlternativeCaptures?.mobile, prototype?.boldAlternativeRecordings?.desktop, prototype?.boldAlternativeRecordings?.mobile].some((item) => typeof item !== "string" || !item.trim())
    || !prototype.comparisonParity || Object.values(prototype.comparisonParity).some((value) => value !== true)))
    errors.push("A declared unresolved decision requires a genuinely distinct, equally covered second coded prototype");
  const storyboards = prototype?.comparisonRequired
    ? [prototype?.fullPageContinuityStoryboards?.bestFit, prototype?.fullPageContinuityStoryboards?.boldAlternative]
    : [prototype?.fullPageContinuityStoryboards?.bestFit];
  if (!storyboards.every((item) => item && [item.artifact, item.capture, item.heroSelector, item.peakSelector, item.postPeakSelector].every((value) => typeof value === "string" && value.trim())))
    errors.push("Each coded Showcase prototype requires a full-page continuity storyboard");
  if (prototype?.selectedBy !== "user") errors.push("Showcase prototype selection must come from the user before full integration");
  if (prototype?.prototypeReview?.status !== "accepted" || prototype?.prototypeReview?.acceptedBy !== "user") errors.push("Showcase production-like prototype must be shown and explicitly accepted by the user before integration");
  const fidelity = contract.prototypeFidelity;
  if (!fidelity || !["production-like", "integration-ready"].includes(fidelity.level) || !fidelity.limitations?.trim() || [fidelity.selectedArtifact, fidelity.prototypeSubjectSelector, fidelity.integratedSubjectSelector, fidelity.focalObject, fidelity.copyBalance, fidelity.controlPlacement, fidelity.materialLighting, fidelity.desktopFraming, fidelity.mobileFraming].some((item) => typeof item !== "string" || !item.trim()))
    errors.push("Showcase requires a complete prototype-to-product fidelity contract");
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
  const agency = contract.agencyChain;
  if (!agency || ![agency.controlSectionSelector, agency.inputSelector, agency.primaryResponseSelector, agency.downstreamSelector, agency.userAction, agency.immediateResponse, agency.decisionOutcome].every((value) => typeof value === "string" && value.trim()))
    errors.push("Showcase requires a complete user-action → primary-response → downstream-decision agency chain");
  if (agency && continuity) {
    if (agency.inputSelector !== continuity.sourceSelector) errors.push("agency inputSelector must be the exercised continuity sourceSelector");
    const primary = affectedRegions.find((region) => region.selector === agency.primaryResponseSelector);
    const downstream = affectedRegions.find((region) => region.selector === agency.downstreamSelector);
    if (primary?.stage !== "peak") errors.push("agency primaryResponseSelector must be a verified peak continuity region");
    if (downstream?.stage !== "after") errors.push("agency downstreamSelector must be a verified after continuity region");
  }
  if (!Array.isArray(contract.comparisonLayouts) || contract.comparisonLayouts.length < 1) errors.push("Showcase requires at least one declared comparison layout");
  for (const [index, layout] of (contract.comparisonLayouts ?? []).entries()) {
    if (![layout?.selector, layout?.itemSelector, layout?.identityAttribute].every((value) => typeof value === "string" && value.trim())
      || !/^data-[a-z0-9-]+$/.test(layout?.identityAttribute ?? "")
      || !["fixed-grid", "stable-rail", "selected-stage", "other"].includes(layout?.strategy)
      || !["none", "selected-only", "controlled"].includes(layout?.reorderMode)
      || typeof layout?.maxTravelViewportRatio !== "number" || layout.maxTravelViewportRatio < 0 || layout.maxTravelViewportRatio > 1
      || typeof layout?.maxItemResizeRatio !== "number" || layout.maxItemResizeRatio < 0 || layout.maxItemResizeRatio > 2
      || typeof layout?.gapTolerancePx !== "number" || layout.gapTolerancePx < 0 || layout.gapTolerancePx > 48
      || typeof layout?.alignmentTolerancePx !== "number" || layout.alignmentTolerancePx < 0 || layout.alignmentTolerancePx > 48
      || !Array.isArray(layout?.identityChannels) || layout.identityChannels.length < 2 || layout.identityChannels.some((channel) => !channel || typeof channel.channel !== "string" || !channel.channel.trim() || typeof channel.selector !== "string" || !channel.selector.trim() || !/^(?:src|background-image|background-color|border-radius|clip-path|text|class|data-[a-z0-9-]+)$/.test(channel.uniqueProperty))
      || new Set((layout.identityChannels ?? []).map((channel) => `${channel.selector}::${channel.uniqueProperty}`)).size !== (layout.identityChannels?.length ?? 0)
      || !(layout.identityChannels ?? []).some((channel) => ["src", "background-image", "background-color", "border-radius", "clip-path"].includes(channel.uniqueProperty))
      || layout?.assetStatus !== "production"
      || (layout?.selectedIdentity && (typeof layout.selectedItemMaxScale !== "number" || layout.selectedItemMaxScale < 1 || layout.selectedItemMaxScale > 3)))
      errors.push(`comparison layout ${index + 1} requires stable production identity with at least two visual channels plus layout limits`);
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
    if (!item.primarySelector?.trim() || !item.primarySubject?.trim()) errors.push(`${item.name} mechanism requires a primarySelector and product-native primarySubject`);
    if (!["scroll", "click", "hover", "drag"].includes(item.trigger)) errors.push(`${item.name} mechanism has an invalid trigger`);
    if (!item.mobileTransformation?.trim()) errors.push(`${item.name} mechanism requires mobileTransformation`);
    for (const key of ["productTruth", "userCause", "visibleChange", "decisionConsequence"] as const)
      if (!item[key]?.trim()) errors.push(`${item.name} mechanism requires semantic-motion field ${key}`);
    if (!["deliberate-stepped", "continuous-subject", "state-transition", "camera-only", "none"].includes(item.motionIntent)) errors.push(`${item.name} mechanism requires a valid motionIntent`);
    if (!["runtime-sampled", "frame-analysis", "user-accepted-limitation", "none"].includes(item.temporalEvidence)) errors.push(`${item.name} mechanism requires a valid temporalEvidence classification`);
    if (item.motionIntent === "continuous-subject" && item.mediaMode === "image" && !["frame-analysis", "user-accepted-limitation"].includes(item.temporalEvidence))
      errors.push(`${item.name} promises continuous subject motion from images and requires frame-analysis evidence or explicit user-accepted limitation`);
    if (["frame-analysis", "user-accepted-limitation"].includes(item.temporalEvidence) && !item.motionEvidenceRef?.trim()) errors.push(`${item.name} temporalEvidence requires motionEvidenceRef`);
    if (!["css", "gsap", "motion", "anime", "react-state", "native-js", "other"].includes(item.animationOwner)) errors.push(`${item.name} mechanism requires one animationOwner`);
    if (!Array.isArray(item.ownedProperties) || item.ownedProperties.length < 1 || item.ownedProperties.some((property) => typeof property !== "string" || !property.trim())) errors.push(`${item.name} mechanism requires ownedProperties`);
    if (!Number.isInteger(item.stateCount) || item.stateCount < 2 || item.stateCount > 5) errors.push(`${item.name} mechanism stateCount must be an integer from 2 to 5`);
    if (item.trigger === "hover" && item.stateCount !== 2) errors.push(`${item.name} hover mechanism must declare exactly two states`);
    if (item.trigger === "scroll" && item.stateCount < 3) errors.push(`${item.name} scroll mechanism must declare at least three states`);
    if (item.trigger === "scroll" && (!Number.isInteger(item.minimumDwellMs) || (item.minimumDwellMs ?? 0) < 400 || (item.minimumDwellMs ?? 0) > 2000 || !item.releaseSelector?.trim()))
      errors.push(`${item.name} scroll mechanism requires a 400–2000ms minimumDwellMs and releaseSelector`);
    if (!["dom-state", "typography", "image", "video", "svg", "canvas", "spatial-layout", "3d"].includes(item.mediaMode)) errors.push(`${item.name} mechanism has an invalid mediaMode`);
  }
  const ownership = new Map<string, string>();
  for (const item of mechanisms) for (const property of item.ownedProperties ?? []) {
    const key = `${item.selector}::${property.trim().toLowerCase()}`;
    const existing = ownership.get(key);
    if (existing && existing !== item.animationOwner) errors.push(`animation ownership conflict for ${item.selector} ${property}: ${existing} and ${item.animationOwner}`);
    ownership.set(key, item.animationOwner);
  }
  return [...new Set(errors)];
}

export function validateMotionAnalysisEvidence(contract: ShowcaseMechanismContract, projectDir = process.cwd()): string[] {
  const errors: string[] = [];
  const submitted = new Set(Object.values(contract.prototypeEvidence.bestFitRecordings));
  if (contract.prototypeEvidence.comparisonRequired) for (const value of Object.values(contract.prototypeEvidence.boldAlternativeRecordings ?? {})) submitted.add(value);
  for (const mechanism of contract.mechanisms.filter((item) => item.temporalEvidence === "frame-analysis")) {
    const ref = mechanism.motionEvidenceRef ?? "";
    if (!ref || /^https?:\/\//i.test(ref) || path.isAbsolute(ref)) { errors.push(`${mechanism.name} frame analysis must reference a repository-relative JSON file`); continue; }
    const evidencePath = path.resolve(projectDir, ref);
    let evidence: MotionAnalysisEvidence;
    try { evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as MotionAnalysisEvidence; }
    catch { errors.push(`${mechanism.name} frame analysis is missing or invalid JSON: ${ref}`); continue; }
    if (evidence.version !== 1 || !submitted.has(evidence.recording) || !/^[a-f0-9]{64}$/i.test(evidence.recordingSha256 ?? "") || !Number.isInteger(evidence.framesSampled) || evidence.framesSampled < 12 || !Number.isInteger(evidence.abruptReplacements) || evidence.abruptReplacements < 0 || !Number.isInteger(evidence.frozenIntervals) || evidence.frozenIntervals < 0 || typeof evidence.wholeFrameScaling !== "boolean" || typeof evidence.continuousSubjectMotion !== "boolean" || !evidence.method?.trim())
      errors.push(`${mechanism.name} frame analysis must contain measured results and name one submitted recording`);
    const recordingPath = evidence.recording && !/^https?:\/\//i.test(evidence.recording) && !path.isAbsolute(evidence.recording) ? path.resolve(projectDir, evidence.recording) : "";
    if (!recordingPath || !fs.existsSync(recordingPath)) errors.push(`${mechanism.name} frame analysis recording must be a repository-local submitted recording`);
    else if (createHash("sha256").update(fs.readFileSync(recordingPath)).digest("hex") !== evidence.recordingSha256) errors.push(`${mechanism.name} frame analysis hash does not match ${evidence.recording}`);
  }
  return errors;
}

export async function runVisualSmoke(url: string, options: VisualSmokeOptions): Promise<VisualSmokeResult> {
  const contractErrors = validateMechanisms(options.profile, options.showcase);
  if (options.profile === "showcase" && options.showcase) contractErrors.push(...validateMotionAnalysisEvidence(options.showcase));
  if (options.profile === "showcase" && options.experienceMap) contractErrors.push(...validateShowcaseExperienceMap(options.experienceMap));
  if (contractErrors.length) return { ok: false, blockers: contractErrors, checks: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const config of contexts) results.push(await inspectContext(browser, url, config, options.showcase, options.experienceMap));
    const blockers = [...new Set(results.flatMap((result) => result.blockers))];
    return { ok: blockers.length === 0, blockers, checks: [...results.flatMap((result) => result.checks), ...motionFidelityAdvisories(options.showcase)] };
  } finally { await browser.close(); }
}
