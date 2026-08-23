import { chromium, type Browser, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { validateShowcaseExperienceMap, type ExperienceMap } from "../shared/experienceMap.js";

export type DeliveryProfile = "efficient" | "recommended" | "showcase";
export type MechanismTrigger = "scroll" | "click" | "hover" | "drag" | "time" | "media" | "load" | "route" | "none";
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
  visibleChange: string;
  animationOwner: "css" | "gsap" | "motion" | "anime" | "react-state" | "native-js" | "other";
  ownedProperties: string[];
  stateCount: number;
}

/**
 * The signature component is the one element on the route that could not be
 * lifted onto a competitor's page. Blind A/B review repeatedly named its
 * absence as the reason a technically cleaner build lost, so it is a declared,
 * rendered obligation rather than a rule against generic components.
 *
 * `productSubjectSelector` was added after the 2026-08-11 round, where the
 * requirement was satisfied twice by an abstract readout — a roast graph and a
 * log stream on a page whose job was selling coffee. The reviewer called the
 * widget "confusing and not really an ecommerce website". Binding the subject
 * does not prove relevance, but it forces the builder to name what the
 * component is about and lets the browser confirm that subject renders.
 */
export interface SignatureComponent {
  name: string;
  selector: string;
  productSubjectSelector: string;
  productSubject: string;
  whyOnlyThisProduct: string;
}

export interface ShowcaseMechanismContract {
  version: 3;
  experienceType: "journey" | "interface";
  signature: SignatureComponent;
  referenceMode: "none" | "supplied" | "scout";
  referenceAdoptions: {
    source: string;
    sourceRef: string;
    rights: string;
    principle: string;
    decision: "use" | "reject";
    targetSelector?: string;
  }[];
  assetCommitments: {
    role: string;
    decision: "use" | "reject";
    targetSelector: string;
    medium: "image" | "video" | "svg" | "canvas" | "3d" | "none";
    sourceKind: "local-file" | "remote-url" | "inline" | "none";
    sourceRef: string;
    rights: string;
    mobileFallback: string;
  }[];
  continuity: {
    mode: "shared-state" | "authored-sequence";
    motif?: string;
    stateKey?: string;
    sourceSelector?: string;
    sourceTrigger?: "click" | "drag";
    stateCount?: number;
    affectedRegions: { selector: string; stage: "before" | "peak" | "after"; effect: string }[];
  };
  comparison?: {
    selector: string;
    itemSelector: string;
    identityAttribute: string;
    identityChannels: { channel: string; selector: string; uniqueProperty: "src" | "background-image" | "background-color" | "border-radius" | "clip-path" }[];
  };
  mechanisms: MechanismContractEntry[];
}

export interface VisualSmokeOptions { profile: DeliveryProfile; showcase?: ShowcaseMechanismContract; experienceMap?: ExperienceMap }
export interface VisualSmokeResult { ok: boolean; blockers: string[]; advisories: string[]; checks: string[] }

/**
 * Nothing below proves taste. These advisories exist so the final report says
 * out loud which promises the browser could not check, instead of letting a
 * green run read as an endorsement.
 */
export function motionFidelityAdvisories(contract?: ShowcaseMechanismContract): string[] {
  if (!contract) return [];
  return contract.mechanisms.map((item) =>
    `${item.name}: ${item.stateCount} observable states declared via ${item.animationOwner}; whether the change is meaningful, coherent, or tasteful is unverified and needs human review`);
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
      const source = element instanceof HTMLImageElement ? element.currentSrc : "";
      const media = element instanceof HTMLMediaElement ? `${element.currentTime.toFixed(2)}:${element.paused}` : "";
      let canvas = "";
      if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
      return [element.tagName, element.textContent?.trim().slice(0, 120), Math.round(rect.x - rootRect.x), Math.round(rect.y - rootRect.y), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.filter, style.clipPath, style.backgroundImage, source, media, canvas];
    }).filter(Boolean);
    return JSON.stringify(output);
  });
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

async function mechanismFingerprint(page: Page, entry: MechanismContractEntry): Promise<string> {
  return page.locator(entry.selector).evaluate((root, mediaMode) => {
    const rootRect = root.getBoundingClientRect();
    const all = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];
    const selector = mediaMode === "svg" ? "svg,svg *" : mediaMode === "image" ? "img,picture" : mediaMode === "video" ? "video" : mediaMode === "canvas" ? "canvas" : mediaMode === "3d" ? "canvas,[data-dreative-3d]" : mediaMode === "typography" ? "h1,h2,h3,h4,h5,h6,p,span,strong,em" : "*";
    const nodes = mediaMode === "dom-state" ? all : all.filter((element) => element !== root && element.matches(selector));
    return JSON.stringify(nodes.slice(0, 60).map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const pinned = style.position === "sticky" || style.position === "fixed";
      const source = element instanceof HTMLImageElement ? element.currentSrc : "";
      const media = element instanceof HTMLMediaElement ? element.currentTime.toFixed(2) : "";
      let canvas = "";
      if (element instanceof HTMLCanvasElement) try { canvas = element.toDataURL().slice(-160); } catch { canvas = "unreadable"; }
      return [element.tagName, element.textContent?.trim().slice(0, 120), pinned ? null : Math.round(rect.x - rootRect.x), pinned ? null : Math.round(rect.y - rootRect.y), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.filter, style.clipPath, style.backgroundImage, source, media, canvas];
    }));
  }, entry.mediaMode);
}

/**
 * Scroll mechanisms are sampled for real state change and for the subject
 * staying on screen while it happens. Earlier revisions also demanded a 400ms
 * dwell, a structural (non-opacity) transform, an exact reverse-scroll
 * restoration, and identical settling under three wheel speeds. Those encoded
 * one person's motion taste as pass/fail and rejected legitimate cross-fades,
 * so they are gone.
 */
async function exerciseScrollChoreography(page: Page, entry: MechanismContractEntry): Promise<string | null> {
  const region = await page.locator(entry.selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + scrollY, height: rect.height, viewport: innerHeight, pageHeight: document.documentElement.scrollHeight };
  });
  const signatures = new Set<string>();
  let visibilityFailure: string | null = null;
  for (const fraction of [.1, .3, .5, .7, .9]) {
    const y = Math.max(0, Math.min(region.pageHeight - region.viewport, region.top + region.height * fraction - region.viewport / 2));
    await page.evaluate((scrollY) => scrollTo(0, scrollY), y);
    await twoFrames(page);
    signatures.add(await mechanismFingerprint(page, entry));
    const visibility = await page.locator(entry.selector).locator(entry.primarySelector).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
      const height = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      return (width * height) / Math.max(1, rect.width * rect.height);
    });
    if (!visibilityFailure && visibility < .2)
      visibilityFailure = `${entry.name} primary subject ${entry.primarySubject} is materially clipped at the ${Math.round(fraction * 100)}% scroll state`;
  }
  if (signatures.size < 2) return `${entry.name} scroll mechanism ${entry.selector} produced no observable state change across the region`;
  return visibilityFailure;
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
    if (rect.width < 24 || rect.height < 24) return "is too small to read as the subject";
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= .02) return "is not visibly rendered";
    return null;
  });
  if (primaryProblem) return `${entry.name} primary subject ${entry.primarySubject} ${primaryProblem}`;
  await locator.scrollIntoViewIfNeeded();
  await twoFrames(page);
  const mediaFailure = await verifyDeclaredMedia(page, entry);
  if (mediaFailure) return mediaFailure;
  if (entry.trigger === "scroll") return exerciseScrollChoreography(page, entry);
  const before = await mechanismFingerprint(page, entry);
  const signatures = new Set<string>([before]);
  if (entry.trigger === "click") {
    for (let index = 1; index < entry.stateCount; index += 1) {
      await locator.click();
      await twoFrames(page);
      signatures.add(await mechanismFingerprint(page, entry));
    }
  }
  else if (entry.trigger === "hover") await locator.hover();
  else if (entry.trigger === "drag") { await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2, { steps: 8 }); await page.mouse.up(); }
  else if (entry.trigger === "time" || entry.trigger === "media") {
    if (entry.trigger === "media") {
      const media = locator.locator("video,audio");
      if (await media.count() === 1) await media.evaluate((element) => (element as HTMLMediaElement).play());
    }
    for (let index = 1; index < entry.stateCount; index += 1) {
      await page.waitForTimeout(250);
      signatures.add(await mechanismFingerprint(page, entry));
    }
  }
  await twoFrames(page);
  const after = await mechanismFingerprint(page, entry);
  signatures.add(after);
  if (["load", "route", "none"].includes(entry.trigger)) return null;
  return before === after && signatures.size < 2
    ? `${entry.name} mechanism ${entry.selector} did not visibly change its declared ${entry.mediaMode} medium after ${entry.trigger}`
    : null;
}

/**
 * A declared signature component is a promise the contract made, so it has to
 * resolve and render — that is a defect check. Whether the page ought to have
 * one at all is not checked any more: the requirement was removed on 2026-08-16
 * after four rounds in which it was satisfied by whatever passed.
 */
async function verifySignature(page: Page, signature: SignatureComponent): Promise<string[]> {
  const locator = page.locator(signature.selector);
  if (await locator.count() !== 1) return [`signature component ${signature.name} selector ${signature.selector} must resolve to exactly one element`];
  const visible = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02;
  });
  if (!visible) return [`signature component ${signature.name} is not visibly rendered`];

  const subject = locator.locator(signature.productSubjectSelector);
  if (await subject.count() !== 1)
    return [`signature component ${signature.name} product subject ${signature.productSubjectSelector} must resolve to exactly one element inside ${signature.selector}`];
  const subjectProblem = await subject.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (element.getAttribute("aria-hidden") === "true") return "is aria-hidden decoration";
    if (rect.width < 24 || rect.height < 24) return "is too small to read as the subject";
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= .02) return "is not visibly rendered";
    return null;
  });
  if (subjectProblem) return [`signature component ${signature.name} product subject ${signature.productSubject} ${subjectProblem}`];
  return [];
}

/**
 * The pervasive, deliberately unoriginal transition layer: hover, focus, and
 * press feedback on the things a user can touch. Blind review named this as the
 * reason the control "always seems smooth" — *"when i scroll, theres minimal but
 * still subtle clean transition… same goes with interacting where it changes
 * colour/background/shadow"* — while the Dreative arm spent its whole motion
 * budget on two signature moments and left everything else flat. Cheap and
 * uniform is the point; this layer is not where distinctiveness comes from.
 */
async function measureInteractionAffordance(page: Page): Promise<{ responding: number; total: number }> {
  const selectors = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>("main a[href],main button,main [role=button],main summary,main input,main select,main [tabindex]:not([tabindex='-1'])"))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width >= 16 && rect.height >= 12 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02;
    })
    .slice(0, 8)
    .map((element, index) => { const id = `affordance-${index}`; element.dataset.dreativeAffordanceId = id; return `[data-dreative-affordance-id=${JSON.stringify(id)}]`; }));
  const read = (selector: string): Promise<string> => page.locator(selector).evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return JSON.stringify([style.color, style.backgroundColor, style.backgroundImage, style.borderColor, style.borderWidth, style.boxShadow, style.outlineWidth, style.transform, style.opacity, style.filter, style.textDecorationLine, style.letterSpacing, Math.round(rect.width), Math.round(rect.height)]);
  });
  let responding = 0;
  for (const selector of selectors) {
    // Short explicit timeouts: an element that is not hoverable within a beat
    // is one this check simply skips, never one the whole run waits 30s on.
    const locator = page.locator(selector);
    await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => undefined);
    await twoFrames(page);
    const resting = await read(selector);
    await locator.hover({ timeout: 1500 }).catch(() => undefined);
    await page.waitForTimeout(60);
    if (await read(selector) !== resting) { responding += 1; await page.mouse.move(0, 0); continue; }
    await page.mouse.move(0, 0);
    await locator.focus({ timeout: 1500 }).catch(() => undefined);
    await page.waitForTimeout(60);
    if (await read(selector) !== resting) responding += 1;
    await locator.evaluate((element) => (element as HTMLElement).blur()).catch(() => undefined);
  }
  return { responding, total: selectors.length };
}

/**
 * Measures how much of the route actually moves, and whether the movement
 * happens where the reader can see it.
 *
 * Presence alone was the 2026-08-10 floor and it bought nothing: "lack of
 * animation" stayed the named weakness of the Dreative arm in every verdict of
 * the next round, including the one it won, because a single qualifying
 * transition cleared the check while *"everything outside the few signature
 * moments is still flat"*. Breadth is the variable the reviewer was actually
 * responding to, so it is measured separately from presence.
 *
 * `lateReveals` catches a defect the same round reported in plain words:
 * *"after i scroll pass section then there is scroll effects, so pretty weird
 * and bad ux"*. A region is late when its state is identical entering and
 * centred, and only differs once it has started leaving the viewport.
 */
async function measureMotion(page: Page, documentHeight: number, viewportHeight: number): Promise<{ moving: number; total: number; lateReveals: string[] }> {
  // The fallback is not cosmetic. A caliber-movement run shipped its whole page without a
  // <main>, so this matched nothing, `total` was 0, the guard below read 0 > 0 as false and
  // the floor never fired — a route escaped the motion check by its choice of wrapper
  // element. Sectioning is a structural decision the floor has no business rewarding.
  const regions = await page.evaluate(() => {
    const sample = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((element) => element.getBoundingClientRect().height > 80);
    const found = sample("main > *, main section, main header");
    return (found.length ? found : sample("body > *:not(script):not(style), body section, body header"))
    .slice(0, 24)
    .map((element, index) => {
      const id = `motion-${index}`;
      element.dataset.dreativeMotionId = id;
      return { id, name: element.id || element.className?.split(/\s+/)[0] || `${element.tagName.toLowerCase()}#${index}` };
    });
  });
  // Deliberately viewport-independent: every child is sampled with geometry
  // relative to the region, so scrolling a static page past the probe produces
  // an identical signature and is correctly reported as no motion.
  // Per element, so lateness can be judged for the elements the reader could
  // actually see: `onScreen` says whether this element was in the viewport at
  // this stop, `state` is its viewport-independent appearance.
  const signature = (selector: string): Promise<{ onScreen: boolean; state: string }[]> => page.locator(selector).evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    return Array.from(root.querySelectorAll<HTMLElement>("*")).slice(0, 40).map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const onScreenHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
      return {
        // Substantially on screen, not merely peeking past an edge: an element
        // at the very bottom of the viewport has not had its turn yet.
        onScreen: rect.width > 2 && rect.height > 2 && onScreenHeight / rect.height >= .6,
        state: JSON.stringify([Math.round(rect.x - rootRect.x), Math.round(rect.y - rootRect.y), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.filter, style.clipPath, style.backgroundImage, style.color, style.backgroundColor]),
      };
    });
  });
  let moving = 0;
  const lateReveals: string[] = [];
  for (const region of regions) {
    const selector = `[data-dreative-motion-id=${JSON.stringify(region.id)}]`;
    const top = await page.locator(selector).evaluate((element) => element.getBoundingClientRect().top + scrollY);
    // entering (region top near the viewport bottom), centred, then leaving.
    const stops: { y: number; elements: { onScreen: boolean; state: string }[] }[] = [];
    for (const offset of [viewportHeight * .9, viewportHeight * .3, -viewportHeight * .35]) {
      const y = Math.max(0, Math.min(documentHeight - viewportHeight, top - offset));
      await page.evaluate((scrollY) => scrollTo(0, scrollY), y);
      await twoFrames(page);
      await page.waitForTimeout(150);
      stops.push({ y, elements: await signature(selector) });
    }
    const [entering, centred, leaving] = stops;
    if (new Set(stops.map((stop) => stop.elements.map((element) => element.state).join("|"))).size > 1) moving += 1;
    // Only meaningful when the three stops are genuinely different scroll
    // positions; at the top or bottom of a short document they clamp together.
    const distinctStops = new Set(stops.map((stop) => stop.y)).size === 3;
    const sameLength = new Set(stops.map((stop) => stop.elements.length)).size === 1;
    // An element already on screen while the region is centred, still in the
    // same state it held before it had entered, that only changes once the
    // region has scrolled past. The element must have been off screen at the
    // entering stop: without that baseline there is no "approach state" to
    // compare against, and a reveal that simply un-reveals on exit would read
    // as a late one. An element that resolves as it enters is correct and is
    // never counted, which is why `onScreen` is required at the centred stop.
    if (distinctStops && sameLength && centred.elements.some((element, index) =>
      element.onScreen && !entering.elements[index].onScreen
      && element.state === entering.elements[index].state && element.state !== leaving.elements[index].state))
      lateReveals.push(region.name);
  }
  return { moving, total: regions.length, lateReveals };
}

/**
 * Page-absolute and unfiltered by the viewport, so a region that is simply
 * scrolled out of view is not mistaken for a region that changed.
 */
async function continuityFingerprint(page: Page, selector: string): Promise<string> {
  return page.locator(selector).evaluate((root) => JSON.stringify(Array.from(root.querySelectorAll("*")).slice(0, 60).map((node) => {
    const element = node as HTMLElement;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    // Hidden text and invisible data attributes are not a visible state change.
    if (rect.width < 2 || rect.height < 2 || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= .02) return null;
    const source = element instanceof HTMLImageElement ? element.currentSrc : "";
    return [element.tagName, element.innerText?.trim().slice(0, 120), Math.round(rect.x + scrollX), Math.round(rect.y + scrollY), Math.round(rect.width), Math.round(rect.height), style.transform, style.opacity, style.color, style.backgroundColor, style.backgroundImage, style.clipPath, source];
  }).filter(Boolean)));
}

async function verifyContinuity(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  const regions = contract.continuity.affectedRegions;
  const ordered: { stage: "before" | "peak" | "after"; y: number }[] = [];
  for (const region of regions) {
    const locator = page.locator(region.selector);
    if (await locator.count() !== 1) { errors.push(`continuity region ${region.selector} must resolve to exactly one element`); continue; }
    const box = await locator.boundingBox();
    if (!box || box.width < 8 || box.height < 8) errors.push(`continuity region ${region.selector} is hidden or zero-sized`);
    else ordered.push({ stage: region.stage, y: box.y });
  }
  if (errors.length) return errors;
  const stageY = (["before", "peak", "after"] as const).map((stage) => Math.min(...ordered.filter((item) => item.stage === stage).map((item) => item.y)));
  if (stageY.every(Number.isFinite) && !(stageY[0] < stageY[1] && stageY[1] < stageY[2]))
    errors.push("Showcase continuity regions must appear in before, peak, after document order");
  if (contract.continuity.mode !== "shared-state") return errors;

  const source = page.locator(contract.continuity.sourceSelector ?? "");
  if (await source.count() !== 1) return [...errors, `Showcase continuity source ${contract.continuity.sourceSelector} must resolve to exactly one element`];
  await source.scrollIntoViewIfNeeded();
  await twoFrames(page);
  const stateCount = contract.continuity.stateCount ?? 2;
  const signatures = regions.map(() => new Set<string>());
  for (let state = 0; state < stateCount; state += 1) {
    for (let index = 0; index < regions.length; index += 1) signatures[index].add(await continuityFingerprint(page, regions[index].selector));
    if (state === stateCount - 1) break;
    if (contract.continuity.sourceTrigger === "drag") {
      const box = await source.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * .2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2, { steps: 8 });
        await page.mouse.up();
      }
    } else await source.click();
    await twoFrames(page);
  }
  for (const stage of ["before", "peak", "after"] as const) {
    const indexes = regions.map((region, index) => region.stage === stage ? index : -1).filter((index) => index >= 0);
    if (indexes.length && !indexes.some((index) => signatures[index].size > 1))
      errors.push(`Showcase shared state ${contract.continuity.stateKey} did not propagate through ${stage} regions from ${contract.continuity.sourceSelector}`);
  }
  return errors;
}

/**
 * Reference and asset provenance is one of the few claims a build genuinely
 * cannot fake: the file has to exist, the URL has to answer, and the element
 * that claims to use it has to be on screen.
 */
async function verifySources(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const errors: string[] = [];
  for (const adoption of contract.referenceAdoptions) {
    if (/^https?:\/\//i.test(adoption.sourceRef)) {
      const response = await page.request.get(adoption.sourceRef);
      if (!response.ok()) errors.push(`reference source is not loadable: ${adoption.sourceRef}`);
    } else {
      const file = path.resolve(adoption.sourceRef);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) errors.push(`reference source does not exist: ${adoption.sourceRef}`);
    }
    if (adoption.decision !== "use" || !adoption.targetSelector) continue;
    const target = page.locator(adoption.targetSelector);
    if (await target.count() !== 1) { errors.push(`reference adoption target ${adoption.targetSelector} must resolve exactly once`); continue; }
    const visible = await target.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width >= 24 && rect.height >= 24 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02;
    });
    if (!visible) errors.push(`reference adoption target ${adoption.targetSelector} must be visibly rendered`);
  }
  for (const asset of contract.assetCommitments.filter((item) => item.decision === "use")) {
    const target = page.locator(asset.targetSelector);
    if (await target.count() !== 1) { errors.push(`required asset target ${asset.targetSelector} must resolve exactly once`); continue; }
    const present = await target.evaluate((root, medium) => {
      const selector = medium === "image" ? "img,picture" : medium === "video" ? "video" : medium === "svg" ? "svg" : medium === "canvas" ? "canvas" : medium === "3d" ? "canvas,[data-dreative-3d]" : "";
      return selector ? Boolean(root.matches(selector) || root.querySelector(selector)) : true;
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
  }
  return errors;
}

/**
 * All that survives of the old comparison-layout contract. Gap spread,
 * alignment drift, travel ratios and resize ceilings were measured to a
 * tolerance nobody reviewing the page could perceive; whether the items look
 * like different products is the part that actually decided verdicts.
 */
async function verifyComparisonIdentity(page: Page, contract: ShowcaseMechanismContract): Promise<string[]> {
  const comparison = contract.comparison;
  if (!comparison) return [];
  const root = page.locator(comparison.selector);
  if (await root.count() !== 1) return [`comparison region ${comparison.selector} must resolve exactly once`];
  const items = root.locator(comparison.itemSelector);
  if (await items.count() < 2) return [`comparison region ${comparison.selector} must contain at least two ${comparison.itemSelector} items`];
  const evidence = await items.evaluateAll((nodes, channels) => channels.map((channel) => ({
    channel: channel.channel,
    values: nodes.map((item) => {
      const target = channel.selector === "$self" ? item : item.querySelector(channel.selector);
      if (!target) return "";
      if (channel.uniqueProperty === "src") return target instanceof HTMLImageElement ? target.currentSrc : target.getAttribute("src") ?? "";
      return getComputedStyle(target).getPropertyValue(channel.uniqueProperty);
    }),
  })), comparison.identityChannels);
  return evidence
    .filter((item) => item.values.some((value) => !value) || new Set(item.values).size < 2)
    .map((item) => `comparison identity channel ${item.channel} renders the same value for every item; the collection reads as repeated cards`);
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

async function inspectContext(browser: Browser, url: string, config: typeof contexts[number], profile: DeliveryProfile, contract?: ShowcaseMechanismContract): Promise<VisualSmokeResult> {
  const blockers: string[] = [];
  const advisories: string[] = [];
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
    return { documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, documentHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight, stickyRisks, links, tinyMeaningfulText };
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

  if (config.label === "desktop") {
    // Every profile owes the route this layer, Efficient included: it is the
    // cheapest craft on the page and the control keeps winning smoothness with
    // nothing else.
    if (!config.reducedMotion) {
      const affordance = await measureInteractionAffordance(page);
      checks.push(`interaction baseline: ${affordance.responding} of ${affordance.total} interactive elements respond to hover or focus`);
      if (affordance.total >= 3 && affordance.responding === 0)
        blockers.push(`no interaction baseline: ${affordance.total} interactive elements were hovered and focused and none changed appearance. Every profile owes the route a designed hover, focus, and press state; this is the layer blind review reads as "smooth".`);
    }

    if (profile !== "efficient" && !config.reducedMotion) {
      const motion = await measureMotion(page, audit.documentHeight, audit.viewportHeight);
      // Recorded, never blocked. A count of moving regions is not a defect measurement:
      // it rises with one fade-up applied to every section — the thing this skill calls
      // slop — and falls for a single authored sequence that carries a whole page. Made a
      // gate, it teaches the cheapest possible pass: the builder adds a uniform reveal,
      // clears the floor, and never returns to the material. That is the opposite of the
      // work, and it costs a fix-and-recheck cycle to produce. The number stays because it
      // is worth knowing afterwards, on our side, about a build nobody is still editing.
      checks.push(
        motion.total === 0
          ? `motion: not sampled — no region taller than 80px under <main> or <body>`
          : `motion: ${motion.moving} of ${motion.total} regions change state on approach`,
      );
      // A late reveal is the exception, and stays a blocker because it is not a taste
      // reading: content sitting invisible while the reader is looking straight at it is
      // broken in the way a missing image is broken.
      if (motion.lateReveals.length)
        blockers.push(`reveals fire after the reader has scrolled past them in ${motion.lateReveals.join(", ")}: content already on screen while the region is centred is still in its approach state, and only resolves once the region has left. Trigger against the top of the viewport, not the bottom.`);
    }

    if (contract) {
      blockers.push(...await verifySignature(page, contract.signature));
      await page.goto(url, { waitUntil: "domcontentloaded" }); await twoFrames(page);
      blockers.push(...await verifyContinuity(page, contract));
      blockers.push(...await verifySources(page, contract));
      blockers.push(...await verifyComparisonIdentity(page, contract));
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
    for (const mechanism of contract?.mechanisms ?? []) {
      await page.goto(url, { waitUntil: "domcontentloaded" }); await twoFrames(page);
      const failure = await exerciseMechanism(page, mechanism);
      if (failure) blockers.push(failure);
    }
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
  return { ok: blockers.length === 0, blockers, advisories, checks };
}

/**
 * Structural validation only. Every field here is either exercised in a real
 * browser or is a short prompt a human reviewer reads. Prose fields the builder
 * writes about its own process — production rationales, prototype acceptance,
 * frame-analysis counts, procedural-superiority arguments — were removed: a
 * non-empty string is not evidence, and checking one only taught the builder to
 * write longer strings.
 */
export function validateMechanisms(profile: DeliveryProfile, contract?: ShowcaseMechanismContract): string[] {
  if (profile !== "showcase") return [];
  const errors: string[] = [];
  if (!contract || Array.isArray(contract) || contract.version !== 3) return ["Showcase requires a version 3 connected-experience contract"];
  if (!["journey", "interface"].includes(contract.experienceType)) errors.push("Showcase experienceType must be journey or interface");

  const signature = contract.signature;
  if (!signature || ![signature.name, signature.selector, signature.productSubjectSelector, signature.productSubject, signature.whyOnlyThisProduct].every((value) => typeof value === "string" && value.trim()))
    errors.push("Showcase requires one signature component with a name, selector, the product subject it operates on (selector and plain name), and the reason it could not appear on a competitor's page");

  if (!["none", "supplied", "scout"].includes(contract.referenceMode)) errors.push("Showcase referenceMode must be none, supplied, or scout");
  if (!Array.isArray(contract.referenceAdoptions)) errors.push("Showcase referenceAdoptions must be an array");
  else {
    if (contract.referenceMode === "none" && contract.referenceAdoptions.length) errors.push("referenceMode none requires zero references");
    if (contract.referenceMode === "scout" && contract.referenceAdoptions.length < 2) errors.push("referenceMode scout requires at least two traceable candidates");
    if (contract.referenceMode === "supplied" && !contract.referenceAdoptions.length) errors.push("referenceMode supplied requires the supplied references");
    for (const [index, item] of contract.referenceAdoptions.entries()) {
      if (![item?.source, item?.sourceRef, item?.rights, item?.principle].every((value) => typeof value === "string" && value.trim()) || !["use", "reject"].includes(item?.decision))
        errors.push(`reference adoption ${index + 1} requires a traceable sourceRef, rights status, principle, and use|reject decision`);
      if (item?.decision === "use" && !item.targetSelector?.trim()) errors.push(`used reference adoption ${index + 1} requires a targetSelector`);
    }
  }

  if (!Array.isArray(contract.assetCommitments)) errors.push("Showcase assetCommitments must be an array");
  else for (const [index, item] of contract.assetCommitments.entries()) {
    if (![item?.role, item?.targetSelector, item?.sourceRef, item?.rights, item?.mobileFallback].every((value) => typeof value === "string" && value.trim())
      || !["use", "reject"].includes(item?.decision)
      || !["image", "video", "svg", "canvas", "3d", "none"].includes(item?.medium)
      || !["local-file", "remote-url", "inline", "none"].includes(item?.sourceKind))
      errors.push(`asset commitment ${index + 1} requires a role, target, medium, source provenance, rights, and mobile fallback`);
    if ((item?.sourceKind === "none") !== (item?.medium === "none"))
      errors.push(`asset commitment ${index + 1} must keep sourceKind and medium none states consistent`);
  }

  const continuity = contract.continuity;
  const regions = Array.isArray(continuity?.affectedRegions) ? continuity.affectedRegions : [];
  if (!["shared-state", "authored-sequence"].includes(continuity?.mode)) errors.push("Showcase continuity mode must be shared-state or authored-sequence");
  if (continuity?.mode === "shared-state") {
    if (!continuity.stateKey?.trim() || !continuity.sourceSelector?.trim()) errors.push("Shared-state continuity requires a named state and source selector");
    if (!["click", "drag"].includes(continuity.sourceTrigger as string)) errors.push("Shared-state continuity sourceTrigger must be click or drag");
    if (!Number.isInteger(continuity.stateCount) || (continuity.stateCount ?? 0) < 2) errors.push("Shared-state continuity requires at least two states");
  }
  if (continuity?.mode === "authored-sequence" && !continuity.motif?.trim()) errors.push("Authored-sequence continuity requires a named motif");
  if (regions.length < 3) errors.push("Showcase continuity must span at least three regions");
  for (const stage of ["before", "peak", "after"]) if (!regions.some((region) => region?.stage === stage)) errors.push(`Showcase continuity is missing a ${stage} region`);
  if (new Set(regions.map((region) => region?.selector)).size !== regions.length) errors.push("Showcase continuity selectors must be unique");
  for (const [index, region] of regions.entries())
    if (!region?.selector?.trim() || !region?.effect?.trim() || !["before", "peak", "after"].includes(region?.stage))
      errors.push(`continuity region ${index + 1} requires selector, stage, and concrete effect`);

  const comparison = contract.comparison;
  if (comparison) {
    if (![comparison.selector, comparison.itemSelector, comparison.identityAttribute].every((value) => typeof value === "string" && value.trim()))
      errors.push("comparison region requires selector, itemSelector, and identityAttribute");
    if (!Array.isArray(comparison.identityChannels) || comparison.identityChannels.length < 1
      || comparison.identityChannels.some((channel) => !channel?.channel?.trim() || !channel?.selector?.trim() || !["src", "background-image", "background-color", "border-radius", "clip-path"].includes(channel?.uniqueProperty)))
      errors.push("comparison region requires at least one visually rendered identity channel");
  }

  const mechanisms = Array.isArray(contract.mechanisms) ? contract.mechanisms.filter((item) => item && typeof item === "object") : [];
  if (mechanisms.length < 1) errors.push("Showcase requires at least one executable signature mechanism");
  if (new Set(mechanisms.map((item) => item.name)).size !== mechanisms.length) errors.push("Showcase mechanism names must be unique");
  if (new Set(mechanisms.map((item) => item.selector)).size !== mechanisms.length) errors.push("Showcase mechanism selectors must be unique");
  for (const item of mechanisms) {
    if (!item.name?.trim()) errors.push("Showcase mechanism requires a name");
    if (!["before", "peak", "after"].includes(item.stage)) errors.push(`${item.name} mechanism requires a valid stage`);
    if (!item.selector?.trim()) errors.push(`${item.name} mechanism requires a selector`);
    if (!item.primarySelector?.trim() || !item.primarySubject?.trim()) errors.push(`${item.name} mechanism requires a primarySelector and product-native primarySubject`);
    if (!["scroll", "click", "hover", "drag", "time", "media", "load", "route", "none"].includes(item.trigger)) errors.push(`${item.name} mechanism has an invalid trigger`);
    if (!["dom-state", "typography", "image", "video", "svg", "canvas", "spatial-layout", "3d"].includes(item.mediaMode)) errors.push(`${item.name} mechanism has an invalid mediaMode`);
    if (!item.mobileTransformation?.trim()) errors.push(`${item.name} mechanism requires mobileTransformation`);
    if (!item.visibleChange?.trim()) errors.push(`${item.name} mechanism requires a concrete visibleChange`);
    if (!["css", "gsap", "motion", "anime", "react-state", "native-js", "other"].includes(item.animationOwner)) errors.push(`${item.name} mechanism requires one animationOwner`);
    if (!Array.isArray(item.ownedProperties) || !item.ownedProperties.length || item.ownedProperties.some((property) => typeof property !== "string" || !property.trim())) errors.push(`${item.name} mechanism requires ownedProperties`);
    const resolvedOnly = ["load", "route", "none"].includes(item.trigger);
    if (!Number.isInteger(item.stateCount) || item.stateCount < (resolvedOnly ? 1 : 2)) errors.push(`${item.name} mechanism stateCount must be ${resolvedOnly ? "1" : "at least 2"}`);
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

export async function runVisualSmoke(url: string, options: VisualSmokeOptions): Promise<VisualSmokeResult> {
  const contractErrors = validateMechanisms(options.profile, options.showcase);
  if (options.profile === "showcase" && options.experienceMap) contractErrors.push(...validateShowcaseExperienceMap(options.experienceMap));
  if (contractErrors.length) return { ok: false, blockers: contractErrors, advisories: [], checks: [] };
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const config of contexts) results.push(await inspectContext(browser, url, config, options.profile, options.showcase));
    const blockers = [...new Set(results.flatMap((result) => result.blockers))];
    return {
      ok: blockers.length === 0,
      blockers,
      advisories: [...new Set(results.flatMap((result) => result.advisories))],
      checks: [...results.flatMap((result) => result.checks), ...motionFidelityAdvisories(options.showcase)],
    };
  } finally { await browser.close(); }
}
