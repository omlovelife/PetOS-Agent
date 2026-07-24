import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const src = path.resolve(
  root,
  '..',
  '..',
  'Users',
  'oumingliang',
  '.cursor',
  'projects',
  'd-gitWorkSpace-PetOS-Agent',
  'assets',
  'c__Users_oumingliang_AppData_Roaming_Cursor_User_workspaceStorage_68561be9a2eae28887a594cc70e56597_images_spritesheet-01cb0c36-32f1-4e6d-b35e-594f0e0c3b0e.png'
)

const altSrc =
  'C:/Users/oumingliang/.cursor/projects/d-gitWorkSpace-PetOS-Agent/assets/c__Users_oumingliang_AppData_Roaming_Cursor_User_workspaceStorage_68561be9a2eae28887a594cc70e56597_images_spritesheet-01cb0c36-32f1-4e6d-b35e-594f0e0c3b0e.png'

const input = fs.existsSync(altSrc) ? altSrc : src
if (!fs.existsSync(input)) {
  console.error('missing spritesheet', input)
  process.exit(1)
}

const meta = await sharp(input).metadata()
console.log('size', meta.width, meta.height)

const COLS = 8
const ROWS = 11
const cellW = Math.round(meta.width / COLS)
const cellH = Math.round(meta.height / ROWS)
console.log('cell', cellW, cellH, 'sheet', cellW * COLS, cellH * ROWS)

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const w = info.width
const h = info.height
const ch = info.channels
const out = Buffer.from(data)

for (let i = 0; i < data.length; i += ch) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r < 26 && g < 26 && b < 26) {
    out[i + 3] = 0
  } else if (r < 52 && g < 52 && b < 52) {
    const maxc = Math.max(r, g, b)
    out[i + 3] = Math.min(255, Math.round((maxc / 52) * 255))
  }
}

const publicDir = path.join(root, 'public')
const raw = { width: w, height: h, channels: 4 }

await sharp(out, { raw })
  .webp({ quality: 80, alphaQuality: 90 })
  .toFile(path.join(publicDir, 'pet-sprite.webp'))

await sharp(out, { raw })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, 'pet-sprite.png'))

await sharp(out, { raw })
  .extract({ left: 0, top: 0, width: cellW, height: cellH })
  .webp({ quality: 88 })
  .toFile(path.join(publicDir, 'pet-sprite-preview.webp'))

console.log(
  'webp',
  (fs.statSync(path.join(publicDir, 'pet-sprite.webp')).size / 1024).toFixed(1) + 'KB'
)
console.log(
  'png',
  (fs.statSync(path.join(publicDir, 'pet-sprite.png')).size / 1024).toFixed(1) + 'KB'
)
console.log(JSON.stringify({ cols: COLS, rows: ROWS, cellW, cellH, sheetW: w, sheetH: h }))
