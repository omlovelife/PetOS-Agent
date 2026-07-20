const VERSION = '0.1.0'

document.querySelectorAll('#version-label, #footer-version').forEach((el) => {
  el.textContent = VERSION
})

const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

/** Soft CTA press feedback for pointer devices */
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

/** Fallback reveal when scroll-driven animations unsupported */
const supportsViewTimeline =
  typeof CSS !== 'undefined' &&
  CSS.supports?.('animation-timeline: view()')

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
