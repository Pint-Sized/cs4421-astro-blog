import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Check the core site routes and their primary page headings.
const pages = [
	{ path: '/', heading: '[Your name]' },
	{ path: '/cv', heading: 'Curriculum vitae' },
	{ path: '/portfolio', heading: 'Portfolio' },
	{ path: '/blog', heading: 'Blog' },
];

// Exercise layouts at representative phone and desktop dimensions.
const viewports = [
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'desktop', width: 1440, height: 1000 },
];

// Repeat content, navigation, overflow, and automated accessibility checks per viewport.
for (const viewport of viewports) {
	test.describe(`${viewport.name} core pages`, () => {
		test.use({ viewport });

		for (const { path, heading } of pages) {
			test(`${path} loads without horizontal overflow and passes accessibility checks`, async ({
				page,
			}) => {
				await page.goto(path);
				await expect(page.getByRole('main')).toBeVisible();
				await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
				const primaryNavigation = page.getByRole('navigation', { name: 'Primary' });
				for (const label of ['Home', 'CV', 'Portfolio', 'Blog', 'Contact']) {
					await expect(primaryNavigation.getByRole('link', { name: label, exact: true })).toBeVisible();
				}

				const hasHorizontalOverflow = await page.evaluate(
					() => document.documentElement.scrollWidth > document.documentElement.clientWidth,
				);
				expect(hasHorizontalOverflow, `${path} overflows at ${viewport.width}px`).toBe(false);

				const accessibility = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
					.analyze();
				expect(
					accessibility.violations.map(
						({ id, impact, description, nodes }) =>
							`${id} (${impact}): ${description}\n${nodes
								.map(({ target, failureSummary }) => `  ${target.join(', ')}: ${failureSummary}`)
								.join('\n')}`,
					),
					`Accessibility violations on ${path} at ${viewport.width}px`,
				).toEqual([]);
			});
		}
	});
}

// Confirm keyboard-only visitors can skip to content and navigate to a key page.
test('primary navigation is reachable and usable with the keyboard', async ({ page }) => {
	await page.goto('/');

	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator('header a.site-title')).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(
		page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }),
	).toBeFocused();
	const portfolioLink = page
		.getByRole('navigation', { name: 'Primary' })
		.getByRole('link', { name: 'Portfolio', exact: true });
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await expect(portfolioLink).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/portfolio$/);
	await expect(page.getByRole('heading', { name: 'Portfolio', exact: true })).toBeVisible();
});

// Guard the public CV download against broken or outdated page links.
test('CV page links to the downloadable PDF', async ({ page }) => {
	await page.goto('/cv');
	await expect(page.getByRole('link', { name: 'Download current CV as PDF' })).toHaveAttribute(
		'href',
		'/cv.pdf',
	);
});
