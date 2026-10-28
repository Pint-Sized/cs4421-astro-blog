// Use a compact, consistent date format for post cards and article metadata.
export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
