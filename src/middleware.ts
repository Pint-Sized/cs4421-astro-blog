import { defineMiddleware } from 'astro:middleware';

// Log the outcome and latency of each request, including requests that throw.
export const onRequest = defineMiddleware(async (context, next) => {
	const startedAt = performance.now();
	let statusCode = 500;

	// Preserve the original response or error while recording its final status.
	try {
		const response = await next();
		statusCode = response.status;
		return response;
	} finally {
		// Emit one structured log entry so hosting logs remain machine-readable.
		console.log(
			JSON.stringify({
				timestamp: new Date().toISOString(),
				level: statusCode >= 500 ? 'ERROR' : 'INFO',
				route: context.url.pathname,
				method: context.request.method,
				statusCode,
				latencyMs: Math.round(performance.now() - startedAt),
			}),
		);
	}
});
