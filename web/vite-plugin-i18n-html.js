import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  SITE_URL,
  getMessages,
} from './src/i18n/messages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Replace data-i18n text nodes for crawlers, inject SEO head for each locale page.
 * @returns {import('vite').Plugin}
 */
export function i18nHtmlPlugin() {
  let outDir = 'dist'

  return {
    name: 'petos-i18n-html',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const rootHtmlPath = join(outDir, 'index.html')
      const rootHtml = readFileSync(rootHtmlPath, 'utf8')

      for (const locale of LOCALES) {
        const html = renderLocaleHtml(rootHtml, locale)
        if (locale === DEFAULT_LOCALE) {
          writeFileSync(rootHtmlPath, html)
          continue
        }
        const dir = join(outDir, locale)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html)
      }

      writeFileSync(join(outDir, 'robots.txt'), buildRobots())
      writeFileSync(join(outDir, 'sitemap.xml'), buildSitemap())
    },
  }
}

/**
 * @param {string} html
 * @param {string} locale
 */
function renderLocaleHtml(html, locale) {
  const dict = getMessages(locale)
  const meta = LOCALE_META[locale]
  const canonical = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`

  let next = html
  next = next.replace(
    /<html\b[^>]*>/,
    `<html lang="${meta.htmlLang}" data-locale="${locale}" data-font="${meta.font}">`
  )
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(dict.metaTitle)}</title>`)
  next = replaceMeta(next, 'name', 'description', dict.metaDescription)
  next = replaceMeta(next, 'name', 'keywords', dict.metaKeywords)
  next = replaceMeta(next, 'property', 'og:title', dict.ogTitle)
  next = replaceMeta(next, 'property', 'og:description', dict.ogDescription)
  next = replaceMeta(next, 'property', 'og:locale', meta.ogLocale)
  next = replaceMeta(next, 'property', 'og:url', canonical)
  next = replaceMeta(next, 'name', 'twitter:title', dict.ogTitle)
  next = replaceMeta(next, 'name', 'twitter:description', dict.ogDescription)

  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`
  )

  // Fill visible copy from data-i18n so crawlers see translated HTML.
  next = next.replace(
    /(<[^>]*\sdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/[^>]+>)/g,
    (full, open, key, _inner, close) => {
      if (!(key in dict)) return full
      const value = dict[/** @type {keyof typeof dict} */ (key)]
      if (typeof value !== 'string') return full
      // Keep nested markup out of simple text replacements.
      if (open.includes('<') && /<(strong|span|a|em|code)\b/i.test(_inner)) return full
      return `${open}${escapeHtml(value)}${close}`
    }
  )

  next = next.replace(
    /data-i18n-aria="([^"]+)"([^>]*)aria-label="[^"]*"/g,
    (_m, key, rest) => {
      const value = dict[/** @type {keyof typeof dict} */ (key)]
      return `data-i18n-aria="${key}"${rest}aria-label="${escapeAttr(typeof value === 'string' ? value : key)}"`
    }
  )

  // Ensure language switcher selected option matches page locale.
  next = next.replace(
    /(<select[^>]*id="lang-switch"[^>]*>)([\s\S]*?)(<\/select>)/,
    (_m, open, options, close) => {
      const updated = options.replace(
        /<option([^>]*?)value="([^"]+)"([^>]*)>/g,
        (_om, pre, value, post) => {
          const cleaned = `${pre}${post}`.replace(/\sselected(="[^"]*")?/g, '')
          const selected = value === locale ? ' selected' : ''
          return `<option${cleaned} value="${value}"${selected}>`
        }
      )
      return `${open}${updated}${close}`
    }
  )

  // Asset paths from nested locales need absolute-from-root URLs (Vite already uses /assets).
  return next
}

/**
 * @param {string} html
 * @param {'name' | 'property'} attr
 * @param {string} key
 * @param {string} content
 */
function replaceMeta(html, attr, key, content) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = LOCALES.map((locale) => {
    const path = LOCALE_META[locale].path
    const loc = `${SITE_URL}${path === '/' ? '/' : path}`
    const alternates = LOCALES.map((alt) => {
      const altPath = LOCALE_META[alt].path
      const href = `${SITE_URL}${altPath === '/' ? '/' : altPath}`
      return `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[alt].hreflang}" href="${href}"/>`
    }).join('\n')
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${locale === DEFAULT_LOCALE ? '1.0' : '0.8'}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>
  </url>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * @param {string} value
 */
function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', '&quot;')
}
