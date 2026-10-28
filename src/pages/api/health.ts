import type { APIRoute } from 'astro';

// Keep this endpoint server-rendered so it reports the live process state.
export const prerender = false;

// Expose a lightweight health response for deployment and uptime checks.
export const GET: APIRoute = () => {
	return new Response(
		JSON.stringify({
			status: 'ok',
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		},
	);
};
