import {
  DEFAULT_LOCALE,
  applyI18n,
  localeFromPath,
  pathForLocale,
  t,
} from './i18n/index.js'
import {
  captureDownloadClick,
  capturePageview,
  initWebAnalytics,
} from './analytics.js'

initWebAnalytics()

const RELEASE_API =
  'https://api.github.com/repos/omlovelife/PetOS-Agent/releases/latest'

const FALLBACK_RELEASES_PAGE =
  'https://github.com/omlovelife/PetOS-Agent/releases/latest'

const LANG_STORAGE_KEY = 'petos-lang'
const LANG_MANUAL_KEY = 'petos-lang-manual'

/** @typedef {{ name: string, browser_download_url: string }} ReleaseAsset */
/** @typedef {{ tag_name?: string, assets?: ReleaseAsset[] }} ReleasePayload */

/** @type {ReleasePayload | null} */
let cachedRelease = null

const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

let currentLocale = resolveInitialLocale()
applyI18n(currentLocale)
syncHistoryPath(currentLocale, true)

/**
 * Priority:
 * 1. Explicit locale path (/en/, /ja/, …) when not root
 * 2. Manual choice from the language switcher
 * 3. Browser language
 */
function resolveInitialLocale() {
  const fromPath = localeFromPath(window.location.pathname)
  const pathIsRoot =
    window.location.pathname === '/' ||
    window.location.pathname === '' ||
    window.location.pathname === '/index.html'

  if (!pathIsRoot) return fromPath

  if (window.localStorage.getItem(LANG_MANUAL_KEY) === '1') {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY)
    if (saved) return saved
  }

  return detectPreferredLocale() || DEFAULT_LOCALE
}

/**
 * Only remember language after an explicit user choice.
 * @param {string} locale
 */
function persistManualLocale(locale) {
  window.localStorage.setItem(LANG_STORAGE_KEY, locale)
  window.localStorage.setItem(LANG_MANUAL_KEY, '1')
}

/**
 * @param {string} locale
 * @param {boolean} [replace]
 */
function syncHistoryPath(locale, replace = false) {
  const targetPath = pathForLocale(locale)
  const hash = window.location.hash || ''
  const nextUrl = `${targetPath}${hash}`
  const currentPath = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : `${window.location.pathname}/`
  const normalizedCurrent =
    currentPath === '//' || currentPath === '/index.html/' ? '/' : currentPath.replace(/\/index\.html\/?$/, '/')
  const normalizedTarget = targetPath

  if (normalizedCurrent === normalizedTarget && window.location.hash === hash) return

  if (replace) window.history.replaceState({ locale }, '', nextUrl)
  else window.history.pushState({ locale }, '', nextUrl)
}

/**
 * @param {string} locale
 * @param {{ push?: boolean, manual?: boolean }} [opts]
 */
function setLocale(locale, opts = {}) {
  const prev = currentLocale
  currentLocale = applyI18n(locale)
  if (opts.manual) persistManualLocale(currentLocale)
  if (opts.push !== false) syncHistoryPath(currentLocale, false)
  // Initial load already sends $pageview via posthog.init; only count real navigations here.
  if (opts.manual || (opts.push === false && prev !== currentLocale)) {
    capturePageview()
  }

  if (cachedRelease) applyRelease(cachedRelease)
  else {
    const status = document.getElementById('download-status')
    if (status) status.textContent = t('downloadLoading')
  }
}

const langSwitch = document.getElementById('lang-switch')
if (langSwitch instanceof HTMLSelectElement) {
  langSwitch.value = currentLocale
  langSwitch.addEventListener('change', () => {
    setLocale(langSwitch.value, { manual: true })
  })
}

window.addEventListener('popstate', () => {
  setLocale(localeFromPath(window.location.pathname), { push: false })
})

/**
 * @param {ReleaseAsset[]} assets
 * @returns {ReleaseAsset | undefined}
 */
function pickWinAsset(assets) {
  return (
    assets.find((a) => /\.exe$/i.test(a.name) && /setup/i.test(a.name)) ||
    assets.find((a) => /\.exe$/i.test(a.name))
  )
}

/**
 * @param {ReleaseAsset[]} assets
 * @returns {ReleaseAsset | undefined}
 */
function pickMacAsset(assets) {
  return (
    assets.find((a) => /\.dmg$/i.test(a.name) && /arm64/i.test(a.name)) ||
    assets.find((a) => /\.dmg$/i.test(a.name)) ||
    assets.find((a) => /\.zip$/i.test(a.name) && /(arm64|x64|darwin|mac)/i.test(a.name)) ||
    assets.find((a) => /\.zip$/i.test(a.name))
  )
}

/** @returns {'win' | 'mac' | 'other'} */
function detectPlatform() {
  const ua = navigator.userAgent || ''
  const platform = navigator.platform || ''
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return 'win'
  if (/Mac/i.test(platform) || /Macintosh|Mac OS X/i.test(ua)) return 'mac'
  return 'other'
}

/**
 * @param {HTMLAnchorElement} el
 * @param {string | undefined} url
 */
function armDownloadButton(el, url) {
  if (!url) {
    el.setAttribute('aria-disabled', 'true')
    el.classList.add('is-unavailable')
    el.href = FALLBACK_RELEASES_PAGE
    el.target = '_blank'
    el.rel = 'noopener noreferrer'
    return
  }
  el.href = url
  el.removeAttribute('aria-disabled')
  el.classList.remove('is-unavailable')
  el.removeAttribute('target')
  el.removeAttribute('rel')
}

/**
 * @param {string} url
 */
function startFileDownload(url) {
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', '')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * @param {string} version
 */
function setVersionLabels(version) {
  const label = version.startsWith('v') ? version : `v${version}`
  document.querySelectorAll('#footer-version, [data-version]').forEach((el) => {
    el.textContent = label
  })
}

/**
 * @param {ReleasePayload} release
 */
function applyRelease(release) {
  const assets = Array.isArray(release.assets) ? release.assets : []
  const win = pickWinAsset(assets)
  const mac = pickMacAsset(assets)
  const version = (release.tag_name || '').replace(/^v/i, '') || 'latest'
  const versionLabel = version.startsWith('v') ? version : `v${version}`

  setVersionLabels(version)

  const status = document.getElementById('download-status')
  if (status) {
    status.textContent =
      win || mac ? t('downloadReady', { version: versionLabel }) : t('downloadMissing')
  }

  document.querySelectorAll('[data-download="win"]').forEach((el) => {
    if (el instanceof HTMLAnchorElement) armDownloadButton(el, win?.browser_download_url)
  })
  document.querySelectorAll('[data-download="mac"]').forEach((el) => {
    if (el instanceof HTMLAnchorElement) armDownloadButton(el, mac?.browser_download_url)
  })

  const platform = detectPlatform()
  const btnWin = document.getElementById('btn-win')
  const btnMac = document.getElementById('btn-mac')
  if (btnWin && btnMac && platform !== 'other') {
    const primary = platform === 'win' ? btnWin : btnMac
    const secondary = platform === 'win' ? btnMac : btnWin
    primary.classList.add('btn-primary')
    primary.classList.remove('btn-secondary')
    secondary.classList.add('btn-secondary')
    secondary.classList.remove('btn-primary')
  }
}

async function loadLatestRelease() {
  const status = document.getElementById('download-status')
  try {
    const res = await fetch(RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    /** @type {ReleasePayload} */
    const data = await res.json()
    cachedRelease = data
    applyRelease(data)
  } catch {
    if (status) status.textContent = t('downloadFailed')
    document.querySelectorAll('[data-download]').forEach((el) => {
      if (el instanceof HTMLAnchorElement) armDownloadButton(el, undefined)
    })
  }
}

document.querySelectorAll('[data-download]').forEach((el) => {
  el.addEventListener('click', (event) => {
    if (!(el instanceof HTMLAnchorElement)) return
    const url = el.getAttribute('href') || ''
    const platformAttr = el.getAttribute('data-download')
    const platform =
      platformAttr === 'win' || platformAttr === 'mac' ? platformAttr : 'releases'
    if (!url || url.startsWith('#') || el.getAttribute('aria-disabled') === 'true') {
      event.preventDefault()
      return
    }
    captureDownloadClick(platform, url)
    if (url.includes('github.com') && url.includes('/releases/download/')) {
      event.preventDefault()
      startFileDownload(url)
    }
  })
})

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('pointerdown', () => {
    btn.style.setProperty('--press', '1')
  })
  btn.addEventListener('pointerup', () => {
    btn.style.removeProperty('--press')
  })
  btn.addEventListener('pointerleave', () => {
    btn.style.removeProperty('--press')
  })
})

const supportsViewTimeline =
  typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')

if (!supportsViewTimeline && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const nodes = document.querySelectorAll('.reveal')
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        io.unobserve(entry.target)
      }
    },
    { threshold: 0.18 }
  )
  nodes.forEach((node) => {
    node.classList.add('reveal-js')
    io.observe(node)
  })
}

/** @returns {string | null} */
function detectPreferredLocale() {
  const langs = navigator.languages?.length
    ? [...navigator.languages]
    : [navigator.language || '']
  if (navigator.language && !langs.includes(navigator.language)) {
    langs.unshift(navigator.language)
  }

  for (const raw of langs) {
    const tag = String(raw || '').toLowerCase().replace('_', '-')
    if (!tag) continue
    if (
      tag === 'zh-tw' ||
      tag === 'zh-hk' ||
      tag === 'zh-mo' ||
      tag.startsWith('zh-hant') ||
      tag === 'zh-cht'
    ) {
      return 'zh-TW'
    }
    if (tag.startsWith('zh')) return 'zh-CN'
    if (tag.startsWith('ja')) return 'ja'
    if (tag.startsWith('ko')) return 'ko'
    if (tag.startsWith('en')) return 'en'
  }
  return null
}

loadLatestRelease()
