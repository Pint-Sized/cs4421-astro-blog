import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import FormattedDate from './FormattedDate.astro';

describe('FormattedDate', () => {
	it('renders an accessible time element with a formatted date', async () => {
		const container = await AstroContainer.create();
		const html = await container.renderToString(FormattedDate, {
			props: { date: new Date(2024, 5, 1, 12) },
		});

		expect(html).toContain('<time datetime="');
		expect(html).toContain('>Jun 1, 2024</time>');
	});
});
