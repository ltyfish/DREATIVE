import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("section")).toHaveCount(12);
});

test("native foundations render without runtime errors and expose meaningful primary states", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  await expect(page.locator("#persistent-object")).toBeHidden();
  await page.locator("#persistent-stage").scrollIntoViewIfNeeded();
  await expect(page.locator("#persistent-object")).toBeVisible();

  await page.locator("#scroll-progress").scrollIntoViewIfNeeded();
  await expect(page.locator("#scroll-progress output")).not.toHaveText("0%");

  const rail = page.locator("#drag-rail .rail");
  await rail.scrollIntoViewIfNeeded();
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  const spatial = page.locator("#spatial-gallery .field");
  await spatial.scrollIntoViewIfNeeded();
  await spatial.locator("[data-spatial-item]").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(spatial.locator("[data-spatial-item]").nth(1)).toHaveAttribute("data-selected", "true");

  const visualBaseline = await page.screenshot({
    type: "jpeg",
    quality: 78,
    clip: { x: 0, y: 0, width: 720, height: 360 },
  });
  expect(visualBaseline).toMatchSnapshot("native-foundations-header.jpeg");
  expect(errors).toEqual([]);
});

test("pinned, shared-element, and frame foundations exercise forward, reverse, fallback, and focus behavior", async ({ page }) => {
  const chapter = page.locator("#pinned-chapter");
  await chapter.scrollIntoViewIfNeeded();
  const firstState = await chapter.getAttribute("data-active-state");
  await page.evaluate(() => scrollBy(0, innerHeight * 0.8));
  await expect.poll(() => chapter.getAttribute("data-active-state")).not.toBe(firstState);
  await chapter.evaluate((element) => scrollTo(0, element.offsetTop - innerHeight + 1));
  await expect.poll(() => chapter.getAttribute("data-active-state")).toBe(firstState);
  await page.locator("#shared-element-handoff").evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect.poll(async () => {
    const box = await chapter.locator(".sticky").boundingBox();
    return box?.y ?? 0;
  }).toBeLessThan(0);

  const handoff = page.locator("#shared-element-handoff button");
  await handoff.focus();
  await handoff.click();
  await expect(handoff).toBeFocused();
  await expect(page.locator("[data-shared]")).toHaveCSS("view-transition-name", "dreative-subject");

  const canvas = page.locator("#frame-sequence canvas");
  await page.evaluate(() => globalThis.dreativeFixture.sequence.setProgress(0.5));
  await expect(canvas).toHaveAttribute("data-frame", "1");
  await page.evaluate(() => globalThis.dreativeFixture.sequence.setProgress(1));
  await expect(canvas).toHaveAttribute("data-frame", "2");
  await page.evaluate(async () => {
    const probe = document.createElement("canvas");
    probe.style.cssText = "width:100px;height:100px";
    document.body.appendChild(probe);
    globalThis.dreativeFixture.systems.mountFrameSequence(probe, {
      frames: ["data:image/png;base64,broken"],
      onMissing: () => { probe.dataset.missingCallback = "called"; },
    });
  });
  await expect(page.locator("canvas[data-missing-callback]")).toHaveAttribute("data-state", "missing");
});

test("adaptive canvas, video handoff, and media trail suspend, resolve, fail safely, and stay bounded", async ({ page }) => {
  const adaptive = page.locator("#adaptive-canvas canvas");
  await adaptive.scrollIntoViewIfNeeded();
  await expect(adaptive).toHaveAttribute("data-suspended", "false");
  await page.locator("header").scrollIntoViewIfNeeded();
  await expect(adaptive).toHaveAttribute("data-suspended", "true");

  const video = page.locator("#video-handoff video");
  const destination = page.locator("#video-handoff [data-destination]");
  await page.evaluate(() => {
    const element = document.querySelector("#video-handoff video");
    Object.defineProperty(element, "duration", { configurable: true, value: 1 });
    element.currentTime = 0.9;
    element.dispatchEvent(new Event("timeupdate"));
  });
  await expect(destination).toHaveAttribute("data-state", "visible");
  await page.evaluate(() => document.querySelector("#video-handoff video").dispatchEvent(new Event("error")));
  await expect(video).toHaveAttribute("data-state", "failed");
  await expect(destination).toHaveAttribute("data-state", "visible");

  const trail = page.locator("#media-trail");
  await trail.scrollIntoViewIfNeeded();
  const box = await trail.boundingBox();
  if (!box) throw new Error("media trail fixture has no bounds");
  for (let index = 0; index < 9; index += 1)
    await page.mouse.move(box.x + 15 + index * 85, box.y + 80);
  await expect(page.locator(".dreative-media-trail")).toHaveCount(6);
  await expect.poll(() => page.locator(".dreative-media-trail").count(), { timeout: 2_000 }).toBe(0);
});

test("mobile reduced-motion form is in-flow, readable, static, and cleanly disposable", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#kinetic-type h2")).toHaveAttribute("data-state", "resolved");
  await expect(page.locator("[data-observe]")).toHaveAttribute("data-state", "visible");
  await expect(page.locator("#pinned-chapter")).toHaveAttribute("data-active-state", "all");
  await expect(page.locator("#pinned-chapter [data-chapter-state]")).toHaveCount(3);
  await expect(page.locator("#persistent-object")).toBeHidden();
  await expect(page.locator("#persistent-stage [data-stage-fallback='visible']")).toHaveCount(3);
  await expect(page.locator("#spatial-gallery [data-spatial-item]").first()).toHaveCSS("position", "relative");
  await expect(page.locator("#spatial-gallery .field")).toHaveCSS("overflow-x", "auto");

  await page.locator("#media-trail").dispatchEvent("pointermove", { clientX: 100, clientY: 100 });
  await expect(page.locator(".dreative-media-trail")).toHaveCount(0);

  await page.evaluate(() => globalThis.dreativeFixture.destroy());
  await expect(page.locator("#kinetic-type h2")).toHaveText("Language remains the interface");
  await expect(page.locator("#persistent-stage [data-stage-fallback]")).toHaveCount(0);
  await expect(page.locator("#pinned-chapter")).not.toHaveAttribute("data-active-state", /.+/);
  await context.close();
});
