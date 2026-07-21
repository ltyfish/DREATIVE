import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/cli",
  testMatch: "visualSmoke.browser.spec.ts",
  workers: 1,
  reporter: "line",
  webServer: { command: "node scripts/serve-visual-smoke-fixtures.mjs", port: 4181, reuseExistingServer: true },
});
