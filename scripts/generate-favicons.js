const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

async function generate() {
  const src = path.join(__dirname, '..', 'static', 'img', 'favicon-monynha.svg');
  const out16 = path.join(__dirname, '..', 'static', 'img', 'favicon-monynha-16.png');
  const out32 = path.join(__dirname, '..', 'static', 'img', 'favicon-monynha-32.png');
  const outIco = path.join(__dirname, '..', 'static', 'img', 'favicon-monynha.ico');

  if (!fs.existsSync(src)) {
    console.error('Source SVG not found:', src);
    process.exit(1);
  }

  try {
    // Generate PNGs
    await sharp(src)
      .resize(32, 32)
      .png({ quality: 90 })
      .toFile(out32);

    await sharp(src)
      .resize(16, 16)
      .png({ quality: 90 })
      .toFile(out16);

    // Generate ICO from PNGs
    const icoBuffer = await pngToIco([out16, out32]);
    fs.writeFileSync(outIco, icoBuffer);

    console.log('Favicons generated:', out16, out32, outIco);
  } catch (err) {
    console.error('Failed to generate favicons:', err);
    process.exit(1);
  }
}

generate();
