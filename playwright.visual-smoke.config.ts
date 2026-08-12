import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/cli",
  testMatch: "visualSmoke.browser.spec.ts",
  workers: 1,
  // Each case drives four viewports through motion, affordance, and density
  // sampling; the default 30s budget is no longer enough.
  timeout: 90_000,
  reporter: "line",
  webServer: { command: "node scripts/serve-visual-smoke-fixtures.mjs", port: 4181, reuseExistingServer: true },
});
