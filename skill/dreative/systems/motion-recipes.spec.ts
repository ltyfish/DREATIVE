import { test, expect, type Page } from "@playwright/test";

// Verifies that the code printed in references/MOTION_RECIPES.md runs against real gsap/lenis builds.
async function open(page: Page, query = "?lenis=0", width = 1440) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/motion-recipes.html${query}`);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  return errors;
}
const top = (page: Page, selector: string) => page.evaluate((s) => document.querySelector(s)!.getBoundingClientRect().top + scrollY, selector);
async function scrollTo(page: Page, y: number) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
}

test("masked line reveal, clip reveal and parallax resolve on approach", async ({ page }) => {
  const errors = await open(page);
  const lines = page.locator("#r1 .line");
  expect(await lines.count()).toBeGreaterThan(1);
  await scrollTo(page, await top(page, "#r2") - 200);
  await page.waitForTimeout(1600);
  const ys = await lines.evaluateAll((els) => els.map((el) => new DOMMatrix(getComputedStyle(el).transform).m42));
  expect(ys.every((y) => Math.abs(y) < 0.5)).toBe(true);
  await scrollTo(page, await top(page, "#r3") - 100);
  await page.waitForTimeout(1800);
  await expect(page.locator("[data-clip]")).toHaveCSS("clip-path", /inset\(0(px|%)/);
  const before = await page.locator("[data-parallax] .plate").evaluate((el) => getComputedStyle(el).transform);
  await scrollTo(page, await top(page, "#r3") + 200);
  const after = await page.locator("[data-parallax] .plate").evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
  expect(errors).toEqual([]);
});

test("pinned aperture scene holds the viewport, opens, then releases", async ({ page }) => {
  await open(page);
  const start = await top(page, "#r4");
  await scrollTo(page, start + 400);
  await page.waitForTimeout(900);
  expect(Math.abs(await page.locator("#r4").evaluate((el) => el.getBoundingClientRect().top))).toBeLessThan(2);
  const mid = await page.locator("#r4 .aperture").evaluate((el) => getComputedStyle(el).clipPath);
  expect(mid).not.toBe("inset(32% 36%)");
  await scrollTo(page, start + 900 * 1.8 - 10);
  await page.waitForTimeout(900);
  await expect(page.locator("#r4 .aperture")).toHaveCSS("clip-path", /inset\(0(px|%)/);
  await expect(page.locator("#r4 .caption")).toHaveCSS("opacity", "1");
  await scrollTo(page, start + 900 * 1.8 + 600);
  expect(await page.locator("#r4").evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(-100);
});

test("horizontal rail pins on desktop and stays native scroll-snap on mobile", async ({ page }) => {
  await open(page);
  const start = await top(page, "#r5");
  await scrollTo(page, start + 500);
  await page.waitForTimeout(900);
  expect(await page.locator("#r5 .track").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(-200);
  await open(page, "?lenis=0", 390);
  await expect(page.locator("#r5")).toHaveCSS("overflow-x", "auto");
  expect(await page.locator("#r5 .track").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("shared-element handoff carries the same image into the dialog and back", async ({ page }) => {
  await open(page);
  await page.getByRole("button", { name: "Open Chore Jacket" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".detail .slot [data-flip-id='p2']")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Back to the collection" })).toBeFocused();
  await expect(page.locator("#detail-title")).toHaveText("Chore Jacket");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator("[data-item='2'] [data-flip-id='p2']")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Open Chore Jacket" })).toBeFocused();
});

test("lenis drives ScrollTrigger from wheel input and velocity reaches the marquee", async ({ page }) => {
  const errors = await open(page, "");
  expect(await page.evaluate(() => Boolean((window as any).__recipes.lenis))).toBe(true);
  await page.evaluate((y) => (window as any).__recipes.lenis.scrollTo(y, { immediate: true }), await top(page, "#r7") - 300);
  await page.mouse.move(700, 450);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);
  await page.waitForTimeout(120);
  const speed = await page.evaluate(() => (window as any).gsap.getTweensOf(document.querySelector("[data-marquee] .inner"))
    .find((t: any) => t.vars.repeat === -1).timeScale());
  expect(speed).toBeGreaterThan(1.2);
  expect(errors).toEqual([]);
});

test("reduced motion renders the resolved composition without pins or splits", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = await open(page, "");
  expect(await page.evaluate(() => (window as any).__recipes.lenis)).toBeNull();
  await expect(page.locator("#r1 .line")).toHaveCount(0);
  await expect(page.locator("#r4 .aperture")).toHaveCSS("clip-path", "none");
  expect(await page.locator(".pin-spacer").count()).toBe(0);
  await page.getByRole("button", { name: "Open Camp Short" }).click();
  await expect(page.locator(".detail .slot [data-flip-id='p3']")).toHaveCount(1);
  expect(errors).toEqual([]);
});
