
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  reporter: [
    ['list'],
    ['allure-playwright', {
      resultsDir: './allure-results',
    }],
  ],

  use: {
    baseURL: 'https://www.weltonsantos.com.br',
    browserName: 'chromium',
    headless: false,
    viewport: null,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      args: ['--start-maximized'],
    },
  },
});
