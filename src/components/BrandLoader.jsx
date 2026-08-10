import { useEffect, useState } from 'react'

import MajoraMark from './decor/MajoraMark.jsx'
import './BrandLoader.css'

/**
 * The site's loading screen, wherever the app has to wait.
 *
 * It is deliberately the same screen the reader met on the way in — the same
 * purple ground, the same mark drawing itself in the same order — because a
 * different animation at every wait is how a product starts to feel like
 * several products. Route chunks, map tiles and a simulation's scenes all wait
 * behind this now.
 *
 * WHERE THE ANIMATION COMES FROM
 *
 * index.html, and nowhere else. Its inline <style> defines .brandCurtain
 * beside #splash and keeps the .splash__* rules that drive the drawing, and
 * that block stays in the document long after the splash element is taken
 * down. So this component writes markup and owns no timings: change the draw
 * in index.html and every loading screen in the app changes with it.
 *
 * WHY IT REPEATS
 *
 * The splash draws once because it is covering a wait that ends. These waits
 * may not: a slow connection, a cold CDN. The sequence is 1.26s of drawing and
 * then it holds, so it replays on a cycle a little longer than that — the hold
 * is what stops it reading as a loop rather than a signature. Remounting the
 * mark is what restarts it, because the per-path delays are animation-delays
 * and a delay only means anything from the start of an element's life.
 *
 * WHY IT WAITS BEFORE APPEARING
 *
 * Most of these waits are over in under a tenth of a second, and a loading
 * screen that flashes up and vanishes is worse than one that never came. The
 * curtain fades in on a delay, so a fast load never shows it at all.
 */

/** 1.26s of drawing, then a beat, then again. */
const CYCLE_MS = 1900

export default function BrandLoader({ label, progress = null, detail = null, inset = false }) {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const id = window.setInterval(() => setCycle((c) => c + 1), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  const pct = progress === null ? null : Math.round(progress * 100)

  return (
    <div
      className={`brandCurtain brandCurtain--app${inset ? ' brandCurtain--inset' : ''}`}
      role="status"
      aria-live="polite"
    >
      {/* Remounted each cycle: see the note above on why a delay cannot be
          replayed any other way. */}
      <MajoraMark key={cycle} className="splash__mark" animated />
      <p className="splash__word">Majora</p>

      {label && <p className="brandCurtain__label">{label}</p>}

      {/* Only when the wait is genuinely measurable. A bar that crawls to 90%
          and sits there is the thing this is meant to avoid. */}
      {pct !== null && (
        <div
          className="brandCurtain__bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ?? 'Loading'}
        >
          <span className="brandCurtain__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
      )}

      {detail && <p className="brandCurtain__detail">{detail}</p>}
    </div>
  )
}
