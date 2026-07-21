const RELEASE_API =
  'https://api.github.com/repos/omlovelife/PetOS-Agent/releases/latest'

const FALLBACK_RELEASES_PAGE =
  'https://github.com/omlovelife/PetOS-Agent/releases/latest'

/** @typedef {{ name: string, browser_download_url: string }} ReleaseAsset */
/** @typedef {{ tag_name?: string, assets?: ReleaseAsset[] }} ReleasePayload */

const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

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
 * Prefer Apple Silicon dmg, then any dmg, then zip.
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
 * Trigger file download without navigating to GitHub UI.
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

  setVersionLabels(version)

  const status = document.getElementById('download-status')
  if (status) {
    status.textContent =
      win || mac
        ? `已从 GitHub 获取最新 v${version}，点击直接下载安装包`
        : '暂未找到安装包，请稍后再试'
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
    applyRelease(data)
  } catch {
    if (status) status.textContent = '获取最新版本失败，将打开发布页作为备选'
    document.querySelectorAll('[data-download]').forEach((el) => {
      if (el instanceof HTMLAnchorElement) armDownloadButton(el, undefined)
    })
  }
}

document.querySelectorAll('[data-download]').forEach((el) => {
  el.addEventListener('click', (event) => {
    if (!(el instanceof HTMLAnchorElement)) return
    const url = el.getAttribute('href') || ''
    if (!url || url.startsWith('#') || el.getAttribute('aria-disabled') === 'true') {
      event.preventDefault()
      return
    }
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

loadLatestRelease()
