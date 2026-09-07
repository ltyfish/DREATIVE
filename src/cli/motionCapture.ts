import fs from "node:fs";
import path from "node:path";
import { chromium, devices, type Browser } from "@playwright/test";

export interface MotionSample { input: string; y: number; height: number; elapsedMs: number }
export interface MotionCapture {
  profile: string; video: string; screenshots: string[]; samples: MotionSample[];
  errors: string[]; reachedEnd: boolean; inputCoverage: string[];
  device?: { coarsePointer: boolean; touchPoints: number; reducedMotion: boolean };
  receivedEvents?: Record<string, number>;
}

// Capture evidence, never a quality score. Touch gestures use Chromium's native
// input protocol rather than dispatching synthetic DOM events or scrollTo().
export async function captureMotionProfile(browser: Browser, url: string, outDir: string,
  profile: "desktop" | "mobile" | "reduced" = "desktop", maxSteps = 32): Promise<MotionCapture> {
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 120) throw new Error("maxSteps must be 1–120");
  fs.mkdirSync(outDir, { recursive: true });
  const mobile = profile === "mobile";
  const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };
  const context = await browser.newContext({
    ...(mobile ? devices["Pixel 7"] : {}), viewport,
    reducedMotion: profile === "reduced" ? "reduce" : "no-preference",
    recordVideo: { dir: outDir, size: viewport },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const events: Record<string, number> = {};
    Object.defineProperty(window, "__dreativeInputEvents", { value: events });
    for (const type of ["wheel", "touchstart", "touchmove", "keydown"])
      window.addEventListener(type, () => { events[type] = (events[type] ?? 0) + 1; }, { passive: true });
  });
  const video = page.video()!;
  const result: MotionCapture = { profile, video: "", screenshots: [], samples: [], errors: [], reachedEnd: false, inputCoverage: [] };
  page.on("pageerror", (e) => result.errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") result.errors.push(m.text()); });
  const started = Date.now();
  const sample = async (input: string) => {
    const position = await page.evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
    result.samples.push({ input, ...position, elapsedMs: Date.now() - started });
    if (!result.inputCoverage.includes(input)) result.inputCoverage.push(input);
    if (!input.startsWith("keyboard"))
      result.reachedEnd = position.y + viewport.height >= position.height - 4;
  };
  const shot = async (name: string) => {
    const file = path.join(outDir, `${profile}-${name}.png`);
    await page.screenshot({ path: file });
    result.screenshots.push(file);
  };
  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    if (!response || response.status() >= 400) throw new Error(`capture navigation failed: HTTP ${response?.status()}`);
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]));
    result.device = await page.evaluate(() => ({ coarsePointer: matchMedia("(pointer: coarse)").matches, touchPoints: navigator.maxTouchPoints, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches }));
    await page.waitForTimeout(500);
    await sample("entry"); await shot("entry");
    const cdp = mobile ? await context.newCDPSession(page) : null;
    const move = async (amount: number) => {
      if (!cdp) { await page.mouse.move(viewport.width * .5, viewport.height * .65); await page.mouse.wheel(0, amount); return; }
      const x = viewport.width * .5;
      const start = amount > 0 ? viewport.height * .8 : viewport.height * .2;
      const travel = Math.min(Math.abs(amount), viewport.height * .6) * Math.sign(amount);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: start }] });
      for (let i = 1; i <= 6; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: start - travel * i / 6 }] });
        await page.waitForTimeout(25);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    for (let i = 0; i < maxSteps; i++) {
      // Small inputs establish the behavior; larger inputs test fast traversal.
      const fast = i % 4 === 3;
      await move(viewport.height * (fast ? 1.6 : .45));
      await page.waitForTimeout(fast ? 150 : 320);
      await sample(mobile ? "touch-forward" : fast ? "wheel-fast" : "wheel-slow");
      if (i === 2) {
        await page.waitForTimeout(500); await sample("pause"); await shot("development");
        await move(-viewport.height * .5); await page.waitForTimeout(350);
        await sample(mobile ? "touch-reverse" : "wheel-reverse");
      }
      if (result.reachedEnd) break;
    }
    await shot("end");
    if (!mobile) {
      await page.keyboard.press("Home"); await page.waitForTimeout(250); await sample("keyboard-home");
      await page.keyboard.press("PageDown"); await page.waitForTimeout(350); await sample("keyboard-page-down");
      await page.keyboard.press("Tab"); await shot("keyboard-focus");
    }
    result.receivedEvents = await page.evaluate(() => (window as unknown as { __dreativeInputEvents: Record<string, number> }).__dreativeInputEvents);
  } catch (error) {
    result.errors.push(String(error));
    throw error;
  } finally {
    await context.close(); // Flush video even on navigation/input failure.
    result.video = path.join(outDir, `${profile}-motion.webm`);
    await video.saveAs(result.video);
    await video.delete();
    fs.writeFileSync(path.join(outDir, `${profile}-motion.json`), JSON.stringify(result, null, 2));
  }
  return result;
}

export async function runMotionCapture(url: string, outDir: string): Promise<MotionCapture[]> {
  const browser = await chromium.launch();
  try {
    const results: MotionCapture[] = [];
    for (const profile of ["desktop", "mobile", "reduced"] as const)
      results.push(await captureMotionProfile(browser, url, outDir, profile));
    return results;
  } finally { await browser.close(); }
}
