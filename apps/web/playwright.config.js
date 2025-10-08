require('dotenv').config();
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  testDir: './e2e-playwright',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
};
module.exports = config;
