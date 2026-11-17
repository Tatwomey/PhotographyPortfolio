// Run with `node scripts/prepare-nat26-images.cjs`; requires local sharp.
// Generated JPEGs are committed, so production needs no image service or encoder.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
async function main() {
  const root = path.join(__dirname, '..', 'assets', 'nat26');
  const files = (await fs.readdir(path.join(root, 'originals'))).filter(f => f.endsWith('.jpg')).sort();
  for (const [variant, size, quality] of [['display', 2560, 82], ['small-web', 1600, 80]]) {
    await fs.mkdir(path.join(root, variant), { recursive: true });
    for (const file of files) {
      await sharp(path.join(root, 'originals', file)).rotate()
        .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
        .toColourspace('srgb').jpeg({ quality, mozjpeg: true })
        .toFile(path.join(root, variant, file));
    }
  }
  await fs.writeFile(path.join(__dirname, '..', 'data', 'nat26-files.json'), JSON.stringify(files, null, 2) + '\n');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
