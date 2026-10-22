import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: process.env.E2E_URL ?? "http://localhost:3000", launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined } },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: process.env.E2E_URL ? undefined : { command: "npm run build && npm run start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 180000 },
});
