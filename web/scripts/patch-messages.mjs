import fs from 'fs'

const path = 'src/i18n/messages.js'
let s = fs.readFileSync(path, 'utf8')

function setKeyInLocale(src, locale, key, value) {
  const messagesIdx = src.indexOf('export const messages')
  const markers = [`'${locale}': {`, `${locale}: {`]
  let locIdx = -1
  for (const m of markers) {
    const i = src.indexOf(m, messagesIdx)
    if (i >= 0) {
      locIdx = i
      break
    }
  }
  const nextMarkers =
    locale === 'zh-CN'
      ? ["'zh-TW':"]
      : locale === 'zh-TW'
        ? ['\n  en:', '\r\n  en:']
        : locale === 'en'
          ? ['\n  ja:', '\r\n  ja:']
          : locale === 'ja'
            ? ['\n  ko:', '\r\n  ko:']
            : ['\n}']

  let end = src.length
  for (const marker of nextMarkers) {
    const i = src.indexOf(marker, locIdx + 8)
    if (i > locIdx && i < end) end = i
  }

  let block = src.slice(locIdx, end)
  const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  // Support single-line and "key:\\n  'value'" forms
  const re = new RegExp(`(\\n\\s*${key}:\\s*)(?:\\r?\\n\\s*)?'([^']*)'`)
  if (!re.test(block)) {
    if (!block.includes('navAria:')) {
      throw new Error(`missing ${key} in ${locale} (block ${block.length})`)
    }
    block = block.replace(/(\n\s*navAria:)/, `\n    ${key}: '${escaped}',$1`)
  } else {
    block = block.replace(re, `$1'${escaped}'`)
  }
  return src.slice(0, locIdx) + block + src.slice(end)
}

const patches = JSON.parse(fs.readFileSync('scripts/patches.json', 'utf8'))

for (const [locale, map] of Object.entries(patches)) {
  for (const [key, val] of Object.entries(map)) {
    s = setKeyInLocale(s, locale, key, val)
  }
}
fs.writeFileSync(path, s)
console.log('patched ok')
