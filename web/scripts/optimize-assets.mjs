import sharp from 'sharp'
import fs from 'fs'

const CELL_W = 192
const CELL_H = 208
const COLS = 8
const ROWS = 9
// Native cell size — display is ~9–11rem; half-res looked soft on desktop/retina.
const scale = 1
const outW = Math.round(COLS * CELL_W * scale)
const outH = Math.round(ROWS * CELL_H * scale)

const srcCandidates = [
  'D:/gitWorkSpace/PetOS/apps/desktop/resources/default-pets/ginger/sprite.webp',
  'public/pet-sprite.webp',
]
const src = srcCandidates.find((p) => fs.existsSync(p))
if (!src) throw new Error('no sprite source')

const tmp = 'public/pet-sprite.webp.tmp'
await sharp(src)
  .extract({ left: 0, top: 0, width: COLS * CELL_W, height: ROWS * CELL_H })
  .resize(outW, outH, { kernel: 'lanczos3' })
  .webp({ quality: 84, alphaQuality: 100, effort: 6 })
  .toFile(tmp)
fs.renameSync(tmp, 'public/pet-sprite.webp')

console.log(
  'pet-sprite',
  outW,
  outH,
  (fs.statSync('public/pet-sprite.webp').size / 1024).toFixed(1) + 'KB'
)

// Hero: ensure compact webp/jpg, drop giant png from public
{
  const heroSrc = fs.existsSync('public/hero-desk.png')
    ? 'public/hero-desk.png'
    : 'public/hero-desk.jpg'
  if (fs.existsSync(heroSrc)) {
    const buf = await sharp(heroSrc)
      .resize({ width: 1400, withoutEnlargement: true })
      .toBuffer()
    await sharp(buf).webp({ quality: 72, effort: 6 }).toFile('public/hero-desk.webp')
    await sharp(buf).jpeg({ quality: 74, mozjpeg: true }).toFile('public/hero-desk.jpg.tmp')
    fs.renameSync('public/hero-desk.jpg.tmp', 'public/hero-desk.jpg')
    if (fs.existsSync('public/hero-desk.png')) fs.unlinkSync('public/hero-desk.png')
    console.log(
      'hero webp',
      (fs.statSync('public/hero-desk.webp').size / 1024).toFixed(1) + 'KB',
      'jpg',
      (fs.statSync('public/hero-desk.jpg').size / 1024).toFixed(1) + 'KB'
    )
  }
}

for (const name of ['favicon.png']) {
  const p = `public/${name}`
  if (!fs.existsSync(p)) continue
  const out = p + '.tmp'
  await sharp(p)
    .resize({ width: 180, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toFile(out)
  fs.renameSync(out, p)
  console.log(name, (fs.statSync(p).size / 1024).toFixed(1) + 'KB')
}

if (fs.existsSync('public/og-cover.jpg')) {
  const out = 'public/og-cover.jpg.tmp'
  await sharp('public/og-cover.jpg')
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(out)
  fs.renameSync(out, 'public/og-cover.jpg')
  console.log('og', (fs.statSync('public/og-cover.jpg').size / 1024).toFixed(1) + 'KB')
}
