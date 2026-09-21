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

test("passage capture reaches a late destination without claiming full-route coverage", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-passage-"));
  const browser = await chromium.launch();
  try {
    for (const profile of ["desktop", "mobile", "reduced"] as const) {
      const result = await captureMotionProfile(browser, "http://127.0.0.1:4181/capture-passage", out, profile, 32,
        { from: "#departure", to: "#destination" });
      expect(result.passage?.startY).toBeGreaterThan(3000);
      expect(result.samples.find(s => s.input === "entry")!.y).toBeGreaterThan(3000);
      expect(result.passage?.reachedEnd).toBe(true);
      expect(result.reachedEnd).toBe(false);
      expect(result.inputCoverage).toContain(profile === "mobile" ? "touch-reverse" : "wheel-reverse");
      expect(result.screenshots.some(file => file.endsWith("passage-50.png"))).toBe(true);
      expect(result.receivedEvents?.[profile === "mobile" ? "touchmove" : "wheel"]).toBeGreaterThan(0);
      expect(result.device?.reducedMotion).toBe(profile === "reduced");
    }
    const incomplete = await captureMotionProfile(browser, "http://127.0.0.1:4181/capture-passage", out, "desktop", 1,
      { from: "#departure", to: "#destination" });
    expect(incomplete.passage?.reachedEnd).toBe(false);
  } finally { await browser.close(); fs.rmSync(out, { recursive: true, force: true }); }
});

test("passage capture rejects missing, ambiguous and reversed selectors", async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-passage-invalid-"));
  const browser = await chromium.launch();
  try {
    for (const passage of [
      { from: "#missing", to: "#destination" },
      { from: "section", to: "#destination" },
      { from: "#destination", to: "#departure" },
    ]) await expect(captureMotionProfile(browser, "http://127.0.0.1:4181/capture-passage", out, "desktop", 1, passage))
      .rejects.toThrow(/passage/);
  } finally { await browser.close(); fs.rmSync(out, { recursive: true, force: true }); }
});
