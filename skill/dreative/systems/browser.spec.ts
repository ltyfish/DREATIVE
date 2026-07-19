import { test, expect } from "@playwright/test";

test("golden systems fixture renders and exercises the primary interaction states", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("section")).toHaveCount(12);
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

  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot.byteLength).toBeGreaterThan(25_000);
  expect(errors).toEqual([]);
});

test("golden systems have an authored mobile and reduced-motion state", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#kinetic-type h2")).toHaveAttribute("data-state", "resolved");
  await expect(page.locator("[data-observe]")).toHaveAttribute("data-state", "visible");
  await expect(page.locator("#spatial-gallery [data-spatial-item]").first()).toHaveCSS("--spatial-z", "0px");
  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot.byteLength).toBeGreaterThan(15_000);
  await context.close();
});
