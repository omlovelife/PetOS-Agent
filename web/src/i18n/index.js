import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  SITE_URL,
  formatMessage,
  getMessages,
} from './messages.js'

/**
 * @param {string} pathname
 * @returns {string}
 */
export function localeFromPath(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/'
  if (clean === '/' || clean === '' || clean === '/index.html') return DEFAULT_LOCALE
  const segment = clean.split('/').filter(Boolean)[0]
  if (segment && LOCALES.includes(/** @type {any} */ (segment))) return segment
  return DEFAULT_LOCALE
}

/**
 * @param {string} locale
 * @returns {string}
 */
export function pathForLocale(locale) {
  return LOCALE_META[locale]?.path || '/'
}

/**
 * @param {string} locale
 * @param {string} hash
 */
export function urlForLocale(locale, hash = '') {
  const path = pathForLocale(locale)
  return `${path}${hash ? (hash.startsWith('#') ? hash : `#${hash}`) : ''}`
}

/**
 * @param {string} key
 * @param {Record<string, string>} [vars]
 */
export function t(key, vars) {
  const locale = document.documentElement.dataset.locale || DEFAULT_LOCALE
  const dict = getMessages(locale)
  const value = dict[/** @type {keyof typeof dict} */ (key)]
  if (typeof value !== 'string') return key
  return vars ? formatMessage(value, vars) : value
}

/**
 * @param {string} locale
 */
export function applyI18n(locale) {
  const safeLocale = LOCALES.includes(/** @type {any} */ (locale)) ? locale : DEFAULT_LOCALE
  const dict = getMessages(safeLocale)
  const meta = LOCALE_META[safeLocale]

  document.documentElement.lang = meta.htmlLang
  document.documentElement.dataset.locale = safeLocale
  document.documentElement.dataset.font = meta.font

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (!key || !(key in dict)) return
    const value = dict[/** @type {keyof typeof dict} */ (key)]
    if (typeof value !== 'string') return
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value
    } else {
      el.textContent = value
    }
  })

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria')
    if (!key || !(key in dict)) return
    el.setAttribute('aria-label', dict[/** @type {keyof typeof dict} */ (key)])
  })

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt')
    if (!key || !(key in dict)) return
    el.setAttribute('alt', dict[/** @type {keyof typeof dict} */ (key)])
  })

  document.title = dict.metaTitle
  setMeta('description', dict.metaDescription)
  setMeta('keywords', dict.metaKeywords)
  setMeta('og:title', dict.ogTitle, 'property')
  setMeta('og:description', dict.ogDescription, 'property')
  setMeta('og:locale', meta.ogLocale, 'property')
  setMeta('twitter:title', dict.ogTitle)
  setMeta('twitter:description', dict.ogDescription)

  const canonical = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`
  setLink('canonical', canonical)
  syncHreflang()

  const switcher = document.getElementById('lang-switch')
  if (switcher instanceof HTMLSelectElement) {
    switcher.value = safeLocale
  }

  return safeLocale
}

/**
 * @param {string} name
 * @param {string} content
 * @param {'name' | 'property'} [attr]
 */
function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * @param {string} rel
 * @param {string} href
 */
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function syncHreflang() {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove())
  for (const locale of LOCALES) {
    const meta = LOCALE_META[locale]
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = meta.hreflang
    link.href = `${SITE_URL}${meta.path === '/' ? '/' : meta.path}`
    document.head.appendChild(link)
  }
  const xDefault = document.createElement('link')
  xDefault.rel = 'alternate'
  xDefault.hreflang = 'x-default'
  xDefault.href = `${SITE_URL}/`
  document.head.appendChild(xDefault)
}

export { DEFAULT_LOCALE, LOCALES, LOCALE_META, SITE_URL, formatMessage, getMessages }
