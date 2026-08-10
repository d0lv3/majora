import { useCallback, useEffect, useRef, useState } from 'react'

import { storyScore } from './storyAudio.js'

/**
 * The score, and the switch that turns it off.
 *
 * Three things about background audio on the web decide the shape of this
 * file, and none of them are negotiable:
 *
 *   A browser will not play sound until the reader has done something. So the
 *   first attempt is expected to fail, and the fallback is a one-shot listener
 *   on the first click anywhere — which, in this simulation, is the button
 *   that starts it.
 *
 *   Sound that starts on its own must be stoppable, immediately and obviously.
 *   The switch sits in the progress rail rather than behind a menu, and it is
 *   on the screen from the first scene to the last.
 *
 *   A reader who turned it off once meant it. The choice is remembered, so
 *   coming back to the simulation does not start the music again.
 *
 * The track is streamed rather than preloaded: it is ten minutes long, and the
 * curtain is already holding for nine photographs. Audio can start on the
 * first few seconds and fetch the rest while the reader reads, which is the
 * one thing images cannot do.
 */

const STORAGE_KEY = 'majora.sound'
const LEVEL = 0.32

const readStored = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export default function StoryAudio({ name }) {
  const src = storyScore(name)
  const ref = useRef(null)
  const fadeRef = useRef(0)
  const [on, setOn] = useState(readStored)

  /* Volume moved in steps rather than set outright. Music that snaps to full
     level the instant a scene opens is startling; over half a second it just
     arrives. */
  const fadeTo = useCallback((target, done) => {
    const el = ref.current
    if (!el) return
    clearInterval(fadeRef.current)
    const from = el.volume
    const steps = 20
    let i = 0
    fadeRef.current = setInterval(() => {
      i += 1
      const el2 = ref.current
      if (!el2) return clearInterval(fadeRef.current)
      el2.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)))
      if (i >= steps) {
        clearInterval(fadeRef.current)
        done?.()
      }
    }, 30)
  }, [])

  useEffect(() => () => clearInterval(fadeRef.current), [])

  useEffect(() => {
    const el = ref.current
    if (!el || !src) return undefined

    if (!on) {
      fadeTo(0, () => el.pause())
      return undefined
    }

    const start = () => {
      el.volume = 0
      el.play().then(
        () => fadeTo(LEVEL),
        // Blocked, which is the normal case on a first visit. The listener
        // below picks it up the moment the reader touches anything.
        () => {},
      )
    }

    start()
    document.addEventListener('pointerdown', start, { once: true })
    return () => document.removeEventListener('pointerdown', start)
  }, [on, src, fadeTo])

  const toggle = () => {
    setOn((v) => {
      const next = !v
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        /* private mode; the choice just does not outlive the visit */
      }
      return next
    })
  }

  if (!src) return null

  return (
    <div className="storySound">
      {/* No caption track: the score is instrumental, so there is no speech to
          caption and an empty track would be worse than none. */}
      <audio ref={ref} src={src} loop preload="auto" />
      <button
        type="button"
        className={`storySound__btn${on ? ' is-on' : ''}`}
        onClick={toggle}
        aria-pressed={on}
        title={on ? 'Turn the music off' : 'Turn the music on'}
      >
        <svg className="storySound__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.5 9.4h3L12 5.6v12.8l-4.5-3.8h-3z" />
          {on ? (
            <>
              <path d="M15.4 9.6a3.4 3.4 0 0 1 0 4.8" />
              <path d="M17.9 7.1a7 7 0 0 1 0 9.8" />
            </>
          ) : (
            <path d="m16 9.9 4.2 4.2M20.2 9.9 16 14.1" />
          )}
        </svg>
        <span className="storySound__label">{on ? 'Music on' : 'Music off'}</span>
      </button>
    </div>
  )
}
