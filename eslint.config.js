import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

// Use Astro's recommended rules and TypeScript parsing, excluding generated output.
export default [
	{
		ignores: ['dist/**', '.astro/**', 'node_modules/**'],
	},
	...astro.configs['flat/recommended'],
	{
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
];
