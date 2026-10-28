/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';

// Restrict Vitest discovery to source unit tests, excluding Playwright specs.
export default getViteConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
});
