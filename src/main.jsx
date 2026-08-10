import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

/**
 * Where a reload lands.
 *
 * Left to itself the browser puts you back where you were, and it does it
 * after the app has rendered — so it wins the race against ScrollManager's
 * scroll to the top and a refresh half way down the landing page comes back
 * half way down, revealed by a splash lifting off the middle of the page.
 *
 * Manual, because this app has an opinion about where every navigation lands
 * and states it in one place. ScrollManager already scrolled to the top on
 * every route change, back and forward included; this only stops the browser
 * from overruling it on a reload.
 */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

/**
 * Waits for the splash to have finished drawing itself.
 *
 * The old version counted 1800ms from the navigation, which is only the right
 * answer when the mark starts drawing at the navigation — and it does not. The
 * animation starts at the first paint, and the first paint waits on whatever
 * the document is blocked by, so on a slow connection the count ran out with
 * the logo half traced and the splash lifted through the middle of its own
 * animation. That is the part that did not look smooth.
 *
 * Asking the animations when they are done needs no timetable and cannot drift
 * from the one in index.html. The breathing is filtered out because it repeats
 * for as long as the app takes and would never resolve.
 */
function drawn(splash) {
  // Older browsers fall back to the floor and the cap, which between them are
  // the schedule index.html is already keeping to.
  if (typeof splash.getAnimations !== 'function') return null

  const finite = splash
    .getAnimations({ subtree: true })
    .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)

  // An animation is cancelled if its element goes away; that is not a failure
  // to wait for, it just means there is nothing left to draw.
  return Promise.all(finite.map((a) => a.finished.catch(() => {})))
}

const after = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * Takes down the splash in index.html once there is an app behind it.
 *
 * Two things have to be true: the mark has drawn itself, and enough time has
 * passed that it was seen. The floor is a safety net rather than the schedule
 * — if `drawn()` comes back empty because the animations have not registered
 * yet, it is what stops the splash flashing past — and it is deliberately
 * shorter than the drawing it is backing up.
 *
 * The cap is the other safety net, and it is the reason waiting on the
 * animations is safe at all: a tab that is opened in the background, or behind
 * a window nobody is looking at, may not be given the frames to run them, and
 * `finished` would never settle. Four seconds is far past the 1.56s the mark
 * needs when it is actually being drawn, so it only ever fires when the
 * drawing is not happening — and a splash that will not leave is worse than
 * one that leaves early.
 */
function removeSplash() {
  const splash = document.getElementById('splash')
  if (!splash) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Nothing is drawn under reduced motion — the logo is simply already there,
  // so there is nothing to wait to finish and nothing to see it finish.
  const floor = reduced ? 0 : 900
  const cap = reduced ? 0 : 4000
  const beat = reduced ? 0 : 250

  Promise.all([Promise.race([drawn(splash), after(cap)]), after(floor)]).then(() => {
    window.setTimeout(() => {
      splash.classList.add('is-done')
      // The class fades it; this clears it out of the accessibility tree and
      // stops it sitting over the page if the transition never fires — a tab in
      // the background does not always run one.
      window.setTimeout(() => splash.remove(), reduced ? 0 : 520)
    }, beat)
  })
}

function mount() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )

  removeSplash()
}

/**
 * Mounts once the splash has had a frame to itself.
 *
 * The mark draws itself with stroke-dashoffset, which is not something the
 * compositor can run on its own — every frame of it is main-thread work, and
 * the first render of the app is the longest main-thread task on the page.
 * Back to back, the drawing stalls part way through and picks up again
 * somewhere else, which reads as a stutter rather than a pause.
 *
 * Two frames, because a callback passed to requestAnimationFrame runs *before*
 * that frame is painted; the second one is the first moment the splash is
 * actually on screen. The timeout is the safety net: a tab opened in the
 * background may never be given a frame, and an app that never mounts is a
 * worse bug than a stutter.
 */
let mounted = false
const mountOnce = () => {
  if (mounted) return
  mounted = true
  mount()
}

window.requestAnimationFrame(() => window.requestAnimationFrame(mountOnce))
window.setTimeout(mountOnce, 150)
