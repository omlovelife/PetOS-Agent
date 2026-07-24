import sharp from 'sharp'
import fs from 'fs'

const CELL_W = 192
const CELL_H = 208
const COLS = 8
const ROWS = 9
const scale = 0.75
const outW = Math.round(COLS * CELL_W * scale)
const outH = Math.round(ROWS * CELL_H * scale)
const cw = Math.round(CELL_W * scale)
const ch = Math.round(CELL_H * scale)

await sharp('public/pet-sprite-src.webp')
  .extract({ left: 0, top: 0, width: COLS * CELL_W, height: ROWS * CELL_H })
  .resize(outW, outH, { kernel: 'lanczos3' })
  .webp({ quality: 90, alphaQuality: 100, effort: 6 })
  .toFile('public/pet-sprite.webp')

console.log('sheet', outW, outH, (fs.statSync('public/pet-sprite.webp').size / 1024).toFixed(1) + 'KB')
console.log('cell', cw, ch)

await sharp('public/pet-sprite.webp')
  .extract({ left: 0, top: 0, width: cw, height: ch })
  .png()
  .toFile('public/_preview.png')

if (fs.existsSync('public/pet-sprite-src.webp')) fs.unlinkSync('public/pet-sprite-src.webp')
