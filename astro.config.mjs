// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import awsAmplify from 'astro-aws-amplify';
import node from '@astrojs/node';

// Use the deployment adapter only in Amplify builds; local builds use standalone Node.
const adapter = process.env.ASTRO_ADAPTER === 'amplify' ? awsAmplify() : node({ mode: 'standalone' });

// Configure server output, canonical site metadata, integrations, and the bundled local font.
export default defineConfig({
	output: 'server',
	adapter,
	site: process.env.SITE_URL || 'https://main.d1pviesf4yue6u.amplifyapp.com/',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
