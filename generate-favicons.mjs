import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_SVG = path.join(__dirname, 'static', 'img', 'favicon.svg');
const OUTPUT_DIR = path.join(__dirname, 'static', 'img');

const PNG_TARGETS = [
  {size: 128, file: 'favicon-128.png'},
  {size: 256, file: 'favicon-256.png'},
  {size: 512, file: 'favicon.png'},
];

const ICO_SIZES = [16, 32, 48];
const ICO_FILE = 'favicon.ico';

async function ensureSourceExists(svgPath) {
  try {
    await readFile(svgPath);
  } catch (error) {
    throw new Error(`Source SVG not found at ${svgPath}.`);
  }
}

async function generatePngs(svgBuffer) {
  await Promise.all(
    PNG_TARGETS.map(async ({size, file}) => {
      const buffer = await sharp(svgBuffer)
        .resize(size, size, {fit: 'contain'})
        .png({compressionLevel: 9, adaptiveFiltering: true})
        .toBuffer();
      await writeFile(path.join(OUTPUT_DIR, file), buffer);
    }),
  );
}

async function generateIco(svgBuffer) {
  const pngBuffers = await Promise.all(
    ICO_SIZES.map((size) =>
      sharp(svgBuffer)
        .resize(size, size, {fit: 'contain'})
        .png({compressionLevel: 9, adaptiveFiltering: true})
        .toBuffer(),
    ),
  );

  const icoBuffer = await pngToIco(pngBuffers);
  await writeFile(path.join(OUTPUT_DIR, ICO_FILE), icoBuffer);
}

async function run() {
  await mkdir(OUTPUT_DIR, {recursive: true});
  await ensureSourceExists(SOURCE_SVG);
  const svgBuffer = await readFile(SOURCE_SVG);

  await generatePngs(svgBuffer);
  await generateIco(svgBuffer);

  console.log('Favicons generated successfully.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
