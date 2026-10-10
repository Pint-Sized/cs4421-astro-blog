import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
	it('formats a date with a short month, day, and year', () => {
		const date = new Date(2024, 5, 1, 12);

		expect(formatDate(date)).toBe('Jun 1, 2024');
	});
});
