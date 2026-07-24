/**
 * Landing companion aligned with desktop PetOS Codex atlas.
 * Drag to move; click zones for wave / review / jump + happy speech.
 * Idle uses uneven hold times so it breathes, not plays like a video.
 */

import { t } from './i18n/index.js'

const COLS = 8
const ROWS = 9
const DRAG_THRESHOLD = 8

/** @typedef {'idle'|'runRight'|'runLeft'|'wave'|'jump'|'failed'|'waiting'|'run'|'review'} CodexState */

/**
 * @typedef {{
 *   row: number,
 *   frames: number,
 *   loop: boolean,
 *   dwellMs: number,
 *   holds?: number[],
 *   cycleMs?: number,
 * }} AtlasRow
 */

/** @type {Record<CodexState, AtlasRow>} */
const ATLAS = {
  // Hold longest on rest frames so blinks feel sparse (desktop-like breathing).
  idle: {
    row: 0,
    frames: 6,
    loop: true,
    dwellMs: 4200,
    // Long rests on frames 0 & 5; blinks are brief so it doesn't feel like a video.
    holds: [2400, 160, 160, 180, 180, 1800],
  },
  runRight: { row: 1, frames: 8, cycleMs: 1400, loop: true, dwellMs: 1600 },
  runLeft: { row: 2, frames: 8, cycleMs: 1400, loop: true, dwellMs: 1600 },
  wave: { row: 3, frames: 4, cycleMs: 2400, loop: false, dwellMs: 1200 },
  jump: { row: 4, frames: 5, cycleMs: 1700, loop: false, dwellMs: 900 },
  failed: { row: 5, frames: 8, cycleMs: 3200, loop: true, dwellMs: 1600 },
  waiting: {
    row: 6,
    frames: 6,
    loop: true,
    dwellMs: 2400,
    holds: [900, 500, 500, 500, 500, 900],
  },
  run: { row: 7, frames: 6, cycleMs: 1400, loop: true, dwellMs: 1600 },
  review: { row: 8, frames: 6, cycleMs: 3200, loop: false, dwellMs: 1400 },
}

/** Prefer calm idle on most sections so page does not feel like a clip reel. */
const SECTION_IDLE = {
  top: 'idle',
  grow: 'idle',
  features: 'idle',
  start: 'idle',
  footer: 'waiting',
}

const CLICK_COOLDOWN_MS = 2800
const SCROLL_SETTLE_MS = 650
const BUBBLE_MS = 2600

/**
 * @returns {void}
 */
export function initPetCompanion() {
  const root = document.getElementById('pet-companion')
  const sprite = document.getElementById('pet-sprite')
  const hint = document.getElementById('pet-hint')
  const bubble = document.getElementById('pet-bubble')
  if (!(root instanceof HTMLElement) || !(sprite instanceof HTMLElement)) return

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    root.dataset.state = 'idle'
    setFrame(sprite, 0, 0)
    if (hint) hint.hidden = true
    // Still allow drag/tap below; skip intro wave only.
  }

  /** @type {CodexState} */
  let animName = 'idle'
  let frame = 0
  let lastTs = 0
  let accum = 0
  let sectionKey = 'top'
  let scrollActive = false
  let scrollTimer = 0
  let lastScrollY = window.scrollY
  /** @type {CodexState} */
  let settleAnim = 'idle'
  /** @type {CodexState | null} */
  let pendingOnce = 'wave'
  let stateStartedAt = performance.now()
  let clickReadyAt = 0
  let facing = 1
  let bubbleTimer = 0
  let dragged = false
  let dragPos = /** @type {{ x: number, y: number } | null} */ (null)

  const softForSection = () => SECTION_IDLE[sectionKey] || 'idle'

  /**
   * @param {CodexState} name
   * @param {{ force?: boolean, urgent?: boolean }} [opts]
   */
  const play = (name, opts = {}) => {
    const cfg = ATLAS[name]
    if (!cfg) return
    if (!opts.force && animName === name) return
    const elapsed = performance.now() - stateStartedAt
    const current = ATLAS[animName]
    const urgent = opts.urgent || name === 'wave' || name === 'jump' || name === 'review'
    if (!opts.force && !urgent && current && elapsed < current.dwellMs) return
    animName = name
    frame = 0
    accum = 0
    stateStartedAt = performance.now()
    root.dataset.state = name
    const face = name === 'runLeft' || name === 'runRight' ? 1 : facing
    root.style.setProperty('--pet-face', String(face))
  }

  const settle = () => {
    scrollActive = false
    const next = pendingOnce || settleAnim || softForSection()
    pendingOnce = null
    play(next, { force: true })
  }

  /**
   * @param {string} text
   */
  const showBubble = (text) => {
    if (!(bubble instanceof HTMLElement) || !text) return
    bubble.textContent = text
    bubble.hidden = false
    bubble.dataset.show = '1'
    if (hint) hint.hidden = true
    window.clearTimeout(bubbleTimer)
    bubbleTimer = window.setTimeout(() => {
      delete bubble.dataset.show
      window.setTimeout(() => {
        if (bubble.dataset.show !== '1') bubble.hidden = true
      }, 280)
    }, BUBBLE_MS)
  }

  /**
   * @param {'wave' | 'review' | 'jump'} kind
   */
  const happyLine = (kind) => {
    const key =
      kind === 'wave' ? 'petLinesWave' : kind === 'jump' ? 'petLinesPaw' : 'petLinesBody'
    const raw = t(key) || ''
    const parts = raw.split('|').map((s) => s.trim()).filter(Boolean)
    if (!parts.length) return ''
    return parts[Math.floor(Math.random() * parts.length)] || parts[0]
  }

  const onScrollActivity = () => {
    if (dragged || dragPos) return
    const y = window.scrollY
    const dy = y - lastScrollY
    lastScrollY = y
    const abs = Math.abs(dy)

    if (abs > 10) {
      scrollActive = true
      facing = dy > 0 ? 1 : -1
      play(abs > 36 ? 'run' : dy > 0 ? 'runRight' : 'runLeft', { force: true, urgent: true })
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(settle, SCROLL_SETTLE_MS)
    }
  }

  const markers = document.querySelectorAll('[data-pet-section]')
  const sectionIo = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible?.target) return
      const key = visible.target.getAttribute('data-pet-section') || 'top'
      if (key === sectionKey) return
      sectionKey = key
      settleAnim = softForSection()
      pendingOnce = key === 'top' ? 'wave' : null
      if (!scrollActive && !dragPos) settle()
    },
    { threshold: [0.28, 0.5], rootMargin: '-14% 0px -30% 0px' }
  )
  markers.forEach((el) => sectionIo.observe(el))

  let ticking = false
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        onScrollActivity()
      })
    },
    { passive: true }
  )

  /**
   * @param {AtlasRow} cfg
   */
  const frameHoldMs = (cfg) => {
    if (cfg.holds && cfg.holds[frame] != null) return cfg.holds[frame]
    if (cfg.cycleMs) return Math.max(220, cfg.cycleMs / cfg.frames)
    return 700
  }

  const tick = (ts) => {
    if (!lastTs) lastTs = ts
    const dt = ts - lastTs
    lastTs = ts
    const cfg = ATLAS[animName] || ATLAS.idle
    accum += dt
    // Recompute hold after each advance so idle rests stay long (not video-like).
    while (true) {
      const hold = frameHoldMs(cfg)
      if (accum < hold) break
      accum -= hold
      frame += 1
      if (frame >= cfg.frames) {
        if (!cfg.loop) {
          play(softForSection(), { force: true })
          break
        }
        frame = 0
      }
    }
    setFrame(sprite, cfg.row, Math.min(frame, cfg.frames - 1))
    requestAnimationFrame(tick)
  }

  /**
   * @param {PointerEvent} event
   */
  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    dragged = false
    const startX = event.clientX
    const startY = event.clientY
    const rect = root.getBoundingClientRect()
    const originLeft = rect.left
    const originTop = rect.top
    const width = rect.width
    const height = rect.height

    root.setPointerCapture?.(event.pointerId)

    /**
     * @param {PointerEvent} move
     */
    const onMove = (move) => {
      const dx = move.clientX - startX
      const dy = move.clientY - startY
      if (!dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      if (!dragged) {
        dragged = true
        root.dataset.dragging = '1'
        // Only leave CSS right/bottom anchoring once the user actually drags.
        root.style.right = 'auto'
        root.style.bottom = 'auto'
        root.style.left = `${originLeft}px`
        root.style.top = `${originTop}px`
        root.style.transform = 'none'
      }
      dragPos = { x: originLeft + dx, y: originTop + dy }
      const maxX = window.innerWidth - width - 8
      const maxY = window.innerHeight - height - 8
      const x = Math.min(maxX, Math.max(8, dragPos.x))
      const y = Math.min(maxY, Math.max(8, dragPos.y))
      root.style.left = `${x}px`
      root.style.top = `${y}px`
      play('jump', { force: true, urgent: true })
      frame = 0
      accum = 0
    }

    /**
     * @param {PointerEvent} up
     */
    const onUp = (up) => {
      root.releasePointerCapture?.(up.pointerId)
      delete root.dataset.dragging
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)

      if (dragged) {
        play('jump', { force: true, urgent: true })
        showBubble(happyLine('jump'))
        clickReadyAt = performance.now() + CLICK_COOLDOWN_MS
        dragPos = {
          x: parseFloat(root.style.left) || originLeft,
          y: parseFloat(root.style.top) || originTop,
        }
        return
      }

      // Click (not drag) — keep CSS right/bottom anchoring intact.
      const now = performance.now()
      if (now < clickReadyAt) return
      const localY = (up.clientY - originTop) / height
      /** @type {'wave' | 'review' | 'jump'} */
      let kind = 'wave'
      if (localY < 0.34) kind = 'wave'
      else if (localY > 0.72) kind = 'jump'
      else kind = 'review'
      pendingOnce = null
      play(kind, { force: true, urgent: true })
      showBubble(happyLine(kind))
      clickReadyAt = now + CLICK_COOLDOWN_MS
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  /** If inset CSS failed, static position can place the pet below the viewport. */
  const clampIntoViewport = () => {
    const rect = root.getBoundingClientRect()
    const offscreen =
      rect.bottom < 8 ||
      rect.top > window.innerHeight - 8 ||
      rect.right < 8 ||
      rect.left > window.innerWidth - 8 ||
      rect.width < 8 ||
      rect.height < 8
    if (!offscreen) return
    root.style.left = 'auto'
    root.style.top = 'auto'
    root.style.right = '12px'
    root.style.bottom = '12px'
    root.style.transform = ''
  }

  root.addEventListener('pointerdown', onPointerDown)
  root.setAttribute('role', 'img')
  root.setAttribute('aria-label', t('petAria') || '豆包，可拖动；点头招手、点身子开心、点爪子跳跃')
  root.removeAttribute('aria-hidden')

  requestAnimationFrame(() => {
    clampIntoViewport()
    if (reduceMotion) {
      play('idle', { force: true, urgent: true })
      setFrame(sprite, 0, 0)
    } else {
      play('wave', { force: true, urgent: true })
      showBubble(happyLine('wave'))
    }
    requestAnimationFrame(tick)
  })
}

/**
 * @param {HTMLElement} el
 * @param {number} row
 * @param {number} frame
 */
function setFrame(el, row, frame) {
  const safeRow = Math.max(0, Math.min(ROWS - 1, row))
  const safeFrame = Math.max(0, Math.min(COLS - 1, frame))
  const x = COLS === 1 ? 0 : (safeFrame / (COLS - 1)) * 100
  const y = ROWS === 1 ? 0 : (safeRow / (ROWS - 1)) * 100
  el.style.backgroundPosition = `${x}% ${y}%`
}
