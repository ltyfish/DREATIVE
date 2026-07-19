import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./skill/dreative/systems",
  testMatch: "browser.spec.ts",
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4177",
    browserName: "chromium",
  },
  webServer: {
    command: "node scripts/serve-foundations-demo.mjs",
    port: 4177,
    reuseExistingServer: true,
  },
});
