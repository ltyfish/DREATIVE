import { chromium, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Look at the page you just built.
 *
 * `visual-smoke` answers "may this ship" and blocks only the zero cases. This answers a
 * different question — "what does it actually look like, and what is on it that I cannot see
 * from the source" — and blocks nothing at all. Both exist because a design agent writes CSS
 * and a reader sees a composition, and those are different worlds.
 *
 * Two tiers, and the difference is the whole point:
 *
 *   BROKEN   output that is invalid however you feel about it — a viewport-sized hole, text
 *            nobody can read, a page that scrolls sideways, an image that 404'd, a reveal
 *            that never fired. These are defects, not opinions.
 *   OBSERVED neutral fact about the rendered page — what changes across a scroll and what
 *            does not, what responds to a pointer. Offered because you cannot otherwise know
 *            it. Not defects. No thresholds, no targets, nothing to satisfy.
 *
 * Nothing here is a gate and nothing sets an exit code on a design judgement. An observation
 * that a section only fades in is not an instruction to add motion to it — a fade is right in
 * plenty of places. It is information you did not have while writing the code.
 */

export interface LookViewport {
  name: string;
  width: number;
  height: number;
}

export interface LookResult {
  broken: string[];
  observed: string[];
  screenshots: string[];
}

export const LOOK_VIEWPORTS: LookViewport[] = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

/** A page taller than this gets its tiles sampled evenly. Twelve images is a lot to study. */
const MAX_TILES = 12;

interface StaticFindings {
  blankBands: { from: number; to: number }[];
  tinyText: { tag: string; px: number; sample: string; count: number }[];
  brokenImages: string[];
  overflowX: { docWidth: number; viewport: number; widest: string[] } | null;
  unrevealed: string[];
  counts: { height: number; viewports: number; images: number; videos: number; canvases: number; text: number };
}

interface SectionFindings {
  id: string | null;
  cls: string | null;
  tag: string;
  heightVh: number;
  changed: string[];
}

/** Scroll the whole page once, remembering the highest opacity every large block reaches. */
async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const peak = new Map<Element, number>();
    const record = () => {
      for (const el of document.body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width < 100 || r.height < 60) continue;
        const o = Number(getComputedStyle(el).opacity);
        if (o > (peak.get(el) ?? 0)) peak.set(el, o);
      }
    };
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
      record();
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
    record();
    (window as unknown as { __lookPeak: Map<Element, number> }).__lookPeak = peak;
  });
}

async function inspectStatic(page: Page): Promise<StaticFindings> {
  return page.evaluate(async () => {
    const out: StaticFindings = {
      blankBands: [], tinyText: [], brokenImages: [], overflowX: null, unrevealed: [],
      counts: { height: 0, viewports: 0, images: 0, videos: 0, canvases: 0, text: 0 },
    };
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // A band taller than the viewport with almost nothing painted in it. This reads to a
    // person as "big empty spaces everywhere" and is nearly always an unclosed section or a
    // sticky element shorter than its own scroll track — not a spacing decision anyone made.
    const boxes: { top: number; bottom: number; area: number }[] = [];
    for (const el of document.body.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) continue;
      const paints = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 1);
      const isMedia = /^(IMG|VIDEO|CANVAS|SVG|PICTURE)$/.test(el.tagName);
      if (!paints && !isMedia && s.backgroundImage === "none") continue;
      boxes.push({ top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, area: r.width * r.height });
    }
    const step = Math.round(vh * 0.5);
    for (let y = 0; y < docH - vh * 0.5; y += step) {
      const band = boxes.filter((b) => b.bottom > y && b.top < y + vh);
      const covered = band.reduce((sum, b) => sum + b.area, 0);
      if (band.length <= 1 && covered < window.innerWidth * vh * 0.08) {
        const last = out.blankBands[out.blankBands.length - 1];
        if (last && y - last.to <= step) last.to = y + vh;
        else out.blankBands.push({ from: y, to: y + vh });
      }
    }

    // Text nobody can read — but not the screen-reader-only labels that are *supposed* to be
    // 1px and clipped. Flagging those buries every other finding under twenty lines of noise
    // and teaches the reader to skim the report, which costs more than the real hits are worth.
    const srOnly = (s: CSSStyleDeclaration, r: DOMRect) =>
      r.width <= 4 || r.height <= 4 ||
      /inset\(\s*50%/.test(s.clipPath) || s.clip === "rect(0px, 0px, 0px, 0px)" ||
      (s.position === "absolute" && (r.width <= 2 || r.height <= 2));

    const tiny = new Map<string, { tag: string; px: number; sample: string; count: number }>();
    for (const el of document.body.querySelectorAll("*")) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => (n.textContent ?? "").trim()).join(" ").trim();
      if (own.length < 2) continue;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none") continue;
      const size = parseFloat(s.fontSize);
      if (size >= 12) continue;
      if (srOnly(s, el.getBoundingClientRect())) continue;
      const key = `${el.tagName}@${size}`;
      if (!tiny.has(key)) tiny.set(key, { tag: el.tagName.toLowerCase(), px: size, sample: own.slice(0, 46), count: 0 });
      tiny.get(key)!.count++;
    }
    out.tinyText = [...tiny.values()].sort((a, b) => a.px - b.px);

    for (const img of document.images) {
      if (!img.complete || img.naturalWidth === 0) out.brokenImages.push(img.getAttribute("src") || "(no src)");
    }

    if (document.documentElement.scrollWidth > window.innerWidth + 2) {
      out.overflowX = {
        docWidth: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        widest: [...document.body.querySelectorAll("*")]
          .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 2).slice(0, 4)
          .map((el) => el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(/\s+/)[0] : "")),
      };
    }

    // Never visible at any point in a full scroll: a reveal that was wired up and never
    // fired. Measured against the high-water mark from the scroll pass and then confirmed
    // individually, with the element parked in view and given time — a reveal with a 700ms
    // transition is still near zero 180ms after a sweep went past it, and accusing working
    // effects of being broken is how an instrument earns being ignored.
    const peak = (window as unknown as { __lookPeak?: Map<Element, number> }).__lookPeak ?? new Map();
    const suspect: Element[] = [];
    for (const el of document.body.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width < 100 || r.height < 60) continue;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none") continue;
      if (Math.max(Number(s.opacity), peak.get(el) ?? 0) > 0.05) continue;
      suspect.push(el);
    }
    const stuck: string[] = [];
    for (const el of suspect.slice(0, 24)) {
      el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 900));
      if (Number(getComputedStyle(el).opacity) > 0.05) continue;
      stuck.push(el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(/\s+/)[0] : ""));
    }
    window.scrollTo(0, 0);
    out.unrevealed = [...new Set(stuck)].slice(0, 8);

    out.counts = {
      height: docH,
      viewports: Math.round((docH / vh) * 10) / 10,
      images: document.images.length,
      videos: document.querySelectorAll("video").length,
      canvases: document.querySelectorAll("canvas").length,
      text: document.body.innerText.trim().length,
    };
    return out;
  });
}

/**
 * What changes as each section is scrolled through. Reported, never scored.
 *
 * The distinction worth having is between a section whose subject changes and one that only
 * fades in. Those are identical in source and completely different to a reader, and no amount
 * of reading your own CSS will tell you which one you built.
 */
async function inspectSections(page: Page): Promise<SectionFindings[]> {
  return page.evaluate(async () => {
    const WATCHED = ["transform", "opacity", "clipPath", "filter", "backgroundPosition", "backgroundSize",
      "objectPosition", "borderRadius", "backgroundColor", "color", "maskImage", "translate", "rotate", "scale"];
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const sections = [...document.querySelectorAll("section, main > div, [data-section]")]
      .filter((el) => el.getBoundingClientRect().height > window.innerHeight * 0.4);

    const sample = (el: Element) =>
      [el, ...el.querySelectorAll("*")].slice(0, 60).map((n) => {
        const s = getComputedStyle(n);
        const r = n.getBoundingClientRect();
        const props: Record<string, string> = {};
        for (const p of WATCHED) props[p] = (s as unknown as Record<string, string>)[p];
        if (n.tagName === "VIDEO") props.__t = String(Math.round((n as HTMLVideoElement).currentTime * 4));
        if (n.tagName === "IMG") props.__src = (n as HTMLImageElement).currentSrc || (n as HTMLImageElement).src;
        if (n.tagName === "CANVAS") {
          try {
            const c = n as HTMLCanvasElement;
            props.__px = c.getContext("2d")?.getImageData(0, 0, Math.min(24, c.width), 1)?.data?.join(",") ?? "gl";
          } catch { props.__px = "gl"; }
        }
        props.__rect = `${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.left)}`;
        return props;
      });

    const results: SectionFindings[] = [];
    for (const el of sections) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const track = Math.max(el.getBoundingClientRect().height - window.innerHeight, 1);
      const frames = [];
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        window.scrollTo(0, Math.round(top + track * t));
        await wait(420);
        frames.push(sample(el));
      }
      const changed = new Set<string>();
      const width = Math.min(...frames.map((f) => f.length));
      for (let i = 0; i < width; i++) {
        for (const p of [...WATCHED, "__t", "__px", "__src", "__rect"]) {
          if (new Set(frames.map((f) => f[i]?.[p])).size > 1) changed.add(p);
        }
      }
      results.push({
        id: el.id || null,
        cls: String(el.className || "").split(/\s+/)[0] || null,
        tag: el.tagName.toLowerCase(),
        heightVh: Math.round((el.getBoundingClientRect().height / window.innerHeight) * 10) / 10,
        changed: [...changed],
      });
    }
    window.scrollTo(0, 0);
    await wait(200);
    return results;
  });
}

async function inspectHover(page: Page): Promise<{ tested: number; responded: number }> {
  return page.evaluate(async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let responded = 0, tested = 0;
    for (const sel of ["button", "a", '[role="button"]', "input", "article", ".card"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const before = getComputedStyle(el).cssText;
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      await wait(260);
      tested++;
      if (getComputedStyle(el).cssText !== before) responded++;
      el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
      el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    }
    return { tested, responded };
  });
}

const describe = (s: SectionFindings) =>
  `${s.id ? `#${s.id}` : s.cls ? `.${s.cls}` : `<${s.tag}>`} (${s.heightVh}vh)`;

export async function runLook(url: string, outDir: string): Promise<LookResult> {
  const broken: string[] = [];
  const observed: string[] = [];
  const screenshots: string[] = [];

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of LOOK_VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      page.on("pageerror", (e) => broken.push(`${vp.name}: uncaught page error — ${String(e.message).slice(0, 160)}`));
      page.on("console", (m) => { if (m.type() === "error") broken.push(`${vp.name}: console error — ${m.text().slice(0, 160)}`); });

      await page.goto(url, { waitUntil: "load", timeout: 30_000 });
      await page.waitForTimeout(1000);
      await page.evaluate(() => document.fonts?.ready).catch(() => {});
      await scrollThrough(page);

      const stat = await inspectStatic(page);
      if (stat.counts.text < 40) broken.push(`${vp.name}: the page renders almost no text (${stat.counts.text} characters)`);
      for (const b of stat.blankBands) {
        broken.push(`${vp.name}: nothing is painted between y=${b.from} and y=${b.to} — a viewport-sized hole in the page`);
      }
      if (stat.tinyText.length) {
        const total = stat.tinyText.reduce((n, t) => n + t.count, 0);
        broken.push(
          `${vp.name}: ${total} run(s) of text below 12px across ${stat.tinyText.length} kind(s) — too small to read. Smallest: ` +
            stat.tinyText.slice(0, 4).map((t) => `${t.px}px <${t.tag}> "${t.sample}"`).join(" · "),
        );
      }
      for (const src of stat.brokenImages.slice(0, 6)) broken.push(`${vp.name}: image failed to load — ${src}`);
      if (stat.overflowX) {
        broken.push(`${vp.name}: the page scrolls sideways (${stat.overflowX.docWidth}px of content in a ${stat.overflowX.viewport}px viewport) — widest: ${stat.overflowX.widest.join(", ")}`);
      }
      for (const el of stat.unrevealed) broken.push(`${vp.name}: ${el} is still fully transparent after a full scroll — a reveal that never fired`);

      observed.push(`${vp.name}: ${stat.counts.viewports} viewports tall · ${stat.counts.images} images, ${stat.counts.videos} video, ${stat.counts.canvases} canvas · ${stat.counts.text} characters`);

      if (vp.name === "desktop") {
        for (const s of await inspectSections(page)) {
          if (!s.changed.length) observed.push(`scroll · ${describe(s)} — nothing changes across it`);
          else if (s.changed.length === 1 && s.changed[0] === "opacity") observed.push(`scroll · ${describe(s)} — only opacity changes (a fade-in, not a transition)`);
          else {
            const visible = s.changed.filter((p) => !p.startsWith("__"));
            observed.push(`scroll · ${describe(s)} — changes: ${visible.join(", ")}${s.changed.some((p) => p.startsWith("__")) ? ", and the media itself" : ""}`);
          }
        }
        const hover = await inspectHover(page);
        observed.push(`hover · ${hover.responded} of ${hover.tested} probed controls change under the pointer`);
      }

      // Tiles, not one enormous full-page image: a 14000px screenshot scaled to fit is
      // unreadable, and the point of this is to actually see the page.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const bands = Math.max(1, Math.ceil(height / vp.height));
      const pick = bands <= MAX_TILES
        ? [...Array(bands).keys()]
        : [...Array(MAX_TILES).keys()].map((i) => Math.round((i * (bands - 1)) / (MAX_TILES - 1)));
      let n = 0;
      for (const b of pick) {
        await page.evaluate((y) => window.scrollTo(0, y), b * vp.height);
        await page.waitForTimeout(420);
        const file = path.join(outDir, `${vp.name}-${String(++n).padStart(2, "0")}.png`);
        await page.screenshot({ path: file });
        screenshots.push(file);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  return { broken, observed, screenshots };
}

export function renderLook(result: LookResult, outDir: string): string {
  const lines: string[] = ["", "=".repeat(78)];
  if (result.broken.length) {
    lines.push(`BROKEN — ${result.broken.length} thing(s) a reader would hit. These are not opinions.`, "");
    for (const b of result.broken) lines.push(`  x ${b}`);
  } else {
    lines.push("BROKEN — nothing. No holes, no unreadable text, no sideways scroll, no dead images.");
  }
  lines.push("", "-".repeat(78));
  lines.push("OBSERVED — neutral fact about the rendered page. Not defects, not a checklist.", "");
  for (const o of result.observed) lines.push(`  · ${o}`);
  lines.push("", "-".repeat(78));
  lines.push(`SCREENSHOTS — ${result.screenshots.length} tiles in ${outDir}. Open them:`, "");
  for (const f of result.screenshots) lines.push(`  ${f}`);
  lines.push("");
  lines.push("Read the screenshots. Most of what is wrong with a page is not in the list above:");
  lines.push("composition, whether the images belong to one another, whether a section earns its");
  lines.push("height, whether the thing being sold is actually shown. Only your own eye gets those.");
  lines.push("=".repeat(78), "");
  return lines.join("\n");
}
