import { test, expect, chromium } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { captureMotionProfile, runMotionCapture } from "./motionCapture.js";

test("capture rejects invalid traversal budgets before launching", async () => {
  for (const steps of [0, 121, NaN, 2.5])
    await expect(runMotionCapture("http://127.0.0.1:4181/", "unused", steps)).rejects.toThrow("maxSteps");
});

test("capture exercises native wheel, keyboard and coarse touch with separate reduced motion", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-motion-"));
  const browser = await chromium.launch();
  try {
    for (const profile of ["desktop", "mobile", "reduced"] as const) {
      const result = await captureMotionProfile(browser, "http://127.0.0.1:4181/", out, profile, 5);
      expect(fs.statSync(result.video).size).toBeGreaterThan(1000);
      expect(result.samples.some((s) => s.y > 0)).toBeTruthy();
      expect(result.inputCoverage).toContain(profile === "mobile" ? "touch-reverse" : "keyboard-page-down");
      expect(result.screenshots.length).toBeGreaterThanOrEqual(3);
      expect(result.device?.coarsePointer).toBe(profile === "mobile");
      expect(result.device?.reducedMotion).toBe(profile === "reduced");
      expect(result.receivedEvents?.[profile === "mobile" ? "touchmove" : "wheel"]).toBeGreaterThan(0);
      if (profile !== "mobile") expect(result.receivedEvents?.keydown).toBeGreaterThan(0);
    }
  } finally { await browser.close(); fs.rmSync(out, { recursive: true, force: true }); }
});
