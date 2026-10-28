import { defineConfig, devices } from '@playwright/test';

// Run browser tests against the locally built preview using Chromium.
export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	outputDir: 'test-results',
	use: {
		// Share a stable local origin and retain diagnostic traces for failures.
		baseURL: 'http://127.0.0.1:4322',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
					? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
					: {},
			},
		},
	],
	webServer: {
		// Start the production preview before tests and reuse it during local runs.
		command: 'npm run preview -- --host 127.0.0.1 --port 4322',
		url: 'http://127.0.0.1:4322',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
