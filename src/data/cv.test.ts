import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import { beforeAll, describe, expect, it } from 'vitest';

import cv from './cv.json';

function extractTextArrays(pdf: Buffer): string[] {
	const source = pdf.toString('latin1');
	const decoder = new TextDecoder('windows-1252');
	const textArrays: string[] = [];
	let offset = 0;

	while ((offset = source.indexOf('stream\n', offset)) !== -1) {
		const start = offset + 'stream\n'.length;
		const end = source.indexOf('endstream', start);
		if (end === -1) throw new Error('Unterminated PDF stream');

		const dictionary = source.slice(source.lastIndexOf('<<', offset), offset);
		const stream = pdf.subarray(start, end - (source[end - 1] === '\r' ? 1 : 0));
		const content = dictionary.includes('/FlateDecode') ? inflateSync(stream) : stream;

		for (const match of content.toString('latin1').matchAll(/\[([\s\S]*?)\]\s*TJ/g)) {
			const text = [...match[1].matchAll(/<([\da-fA-F]+)>/g)]
				.map((part) => decoder.decode(Buffer.from(part[1], 'hex')))
				.join('');
			if (text) textArrays.push(text);
		}

		offset = end + 'endstream'.length;
	}

	return textArrays;
}

describe('generated CV PDF', () => {
	let pdfText: string;

	beforeAll(async () => {
		execFileSync(process.execPath, ['scripts/generate-cv-pdf.js']);
		const pdf = await readFile('public/cv.pdf');
		expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
		expect(pdf.subarray(-6).toString()).toContain('%%EOF');
		pdfText = extractTextArrays(pdf).join('\n');
	});

	it('contains each current CV field as selectable PDF text', () => {
		const currentCvText = [
			cv.notice,
			cv.title,
			cv.name,
			cv.contact,
			...cv.sections.flatMap((section) => [
				section.title,
				...(section.paragraphs ?? []),
				...(section.entries ?? []).flatMap((entry) => [
					entry.title,
					`${entry.organization} · ${entry.dates}`,
					entry.description,
				]),
			]),
		];

		for (const text of currentCvText) {
			expect(pdfText).toContain(text);
		}
	});

	it('includes generated page numbering', () => {
		expect(pdfText).toMatch(new RegExp(`${cv.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} · 1 / \\d+`));
	});
});
