import posthog from 'posthog-js'

/**
 * PostHog project API key (phc_*) is a write-only public client token.
 * Override with VITE_POSTHOG_KEY / VITE_POSTHOG_HOST at build time if needed.
 */
const POSTHOG_KEY =
  import.meta.env.VITE_POSTHOG_KEY ||
  'phc_CZh2usKr9onzRNxGjbaWMg7cSbtxpUimcMQbcYa5wqTT'
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let ready = false

export function initWebAnalytics() {
  if (ready || typeof window === 'undefined') return
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    persistence: 'localStorage+',
    capture_pageview: true,
    capture_pageleave: false,
    person_profiles: 'identified_only',
  })
  posthog.register({
    product_surface: 'website',
  })
  ready = true
}

/** Locale / history path changes (SPA-style) — record another $pageview. */
export function capturePageview() {
  if (!ready) return
  posthog.capture('$pageview')
}

/**
 * @param {'win' | 'mac' | 'releases'} platform
 * @param {string} [url]
 */
export function captureDownloadClick(platform, url) {
  if (!ready) return
  posthog.capture('download_click', {
    product_surface: 'website',
    platform,
    download_url: url ? String(url).slice(0, 300) : undefined,
  })
}
