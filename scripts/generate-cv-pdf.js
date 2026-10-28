import { createWriteStream } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import PDFDocument from 'pdfkit';

const root = process.cwd();
const cvPath = resolve(root, 'src/data/cv.json');
const outputPath = resolve(root, 'public/cv.pdf');
const cv = JSON.parse(await readFile(cvPath, 'utf8'));

await mkdir(dirname(outputPath), { recursive: true });

const document = new PDFDocument({
	size: 'A4',
	margins: { top: 54, right: 58, bottom: 58, left: 58 },
	bufferPages: true,
	info: {
		Title: cv.title,
		Author: cv.name,
		Subject: 'Curriculum vitae',
	},
});

const output = createWriteStream(outputPath);

const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;
const bottomLimit = document.page.height - document.page.margins.bottom;

function ensureSpace(height) {
	if (document.y + height > bottomLimit) {
		document.addPage();
	}
}

function addParagraph(text, options = {}) {
	const { color = '#29263a', ...style } = {
		width: contentWidth,
		font: 'Helvetica',
		fontSize: 10.5,
		lineGap: 3,
		...options,
	};
	const height = document.heightOfString(text, style);
	ensureSpace(height + 8);
	document.font(style.font).fontSize(style.fontSize).fillColor(color);
	document.text(text, style);
	document.moveDown(0.55);
}

document.font('Helvetica-Bold').fontSize(25).fillColor('#171522').text(cv.title);
document.moveDown(0.35);
document.font('Helvetica-Bold').fontSize(17).fillColor('#5140ad').text(cv.name);
document.moveDown(0.2);
addParagraph(cv.contact, { fontSize: 9.5, color: '#55516a' });

addParagraph(cv.notice, {
	fontSize: 9,
	color: '#762953',
});

for (const section of cv.sections) {
	ensureSpace(44);
	document.moveDown(0.35);
	document
		.font('Helvetica-Bold')
		.fontSize(13)
		.fillColor('#5140ad')
		.text(section.title, { continued: false });
	document
		.moveTo(document.page.margins.left, document.y + 3)
		.lineTo(document.page.width - document.page.margins.right, document.y + 3)
		.strokeColor('#c9c3e8')
		.lineWidth(0.7)
		.stroke();
	document.moveDown(0.65);

	for (const paragraph of section.paragraphs ?? []) {
		addParagraph(paragraph);
	}

	for (const entry of section.entries ?? []) {
		ensureSpace(55);
		document.font('Helvetica-Bold').fontSize(11).fillColor('#29263a').text(entry.title);
		document.moveDown(0.1);
		addParagraph(`${entry.organization} · ${entry.dates}`, {
			font: 'Helvetica-Bold',
			fontSize: 9.5,
			color: '#5140ad',
		});
		addParagraph(entry.description);
	}
}

const pageRange = document.bufferedPageRange();
for (let index = 0; index < pageRange.count; index += 1) {
	document.switchToPage(index);
	document
		.font('Helvetica')
		.fontSize(8)
		.fillColor('#777386')
		.text(
			`${cv.name} · ${index + 1} / ${pageRange.count}`,
			document.page.margins.left,
			document.page.height - 36,
			{ width: contentWidth, align: 'right', lineBreak: false },
		);
}

await new Promise((resolvePromise, rejectPromise) => {
	output.once('finish', resolvePromise);
	output.once('error', rejectPromise);
	document.once('error', rejectPromise);
	document.pipe(output);
	document.end();
});
