import { useCallback, useEffect, useReducer, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getMajor, isAvailable } from '../data/majors.js'
import { simulationFor } from '../data/simulations.js'
import { SCREENS, ACTS } from '../sim/Screens.jsx'
import { initialState, reducer, LAST_SCREEN } from '../sim/state.js'
import './Simulation.css'

/**
 * The last level of a major's curriculum, played out.
 *
 * The page is a shell: a head that names the case, a rail showing which act
 * you are in, and whichever of the twenty-five screens the state says you are
 * on. Everything that makes it a simulation is in src/sim.
 *
 * Deliberately not the app's dark ground. This is a clinic, and the reader is
 * inside a case rather than reading about one; the surrounding chrome is kept
 * to a way back out and nothing else.
 */
export default function Simulation() {
  const { slug } = useParams()
  const major = getMajor(slug)
  const sim = simulationFor(slug)

  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const go = useCallback((screen) => dispatch({ type: 'go', screen }), [])

  /* Each screen is a page in its own right, so arriving at one should put you
     at the top of it. Not on the first render, though — jumping the window on
     load would fight the scroll position the route arrived with. */
  const first = useRef(true)
  const stage = useRef(null)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stage.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [state.currentScreen])

  if (!major || !isAvailable(major) || !sim) {
    return (
      <div className="sim sim--missing">
        <div className="shell">
          <span className="eyebrow">Not found</span>
          <h1>There is no simulation here yet.</h1>
          <p className="sim__missingText">
            Simulations are written one major at a time, as the last level of that major’s
            curriculum. This one is not built.
          </p>
          <Link to={major ? `/app/${slug}` : '/app'} className="btn btn--outline-dark">
            {major ? `Back to ${major.name}` : 'Back to the library'}
          </Link>
        </div>
      </div>
    )
  }

  const Current = SCREENS[state.currentScreen]
  const act = ACTS.find((a) => state.currentScreen >= a.from && state.currentScreen <= a.to)

  return (
    <div className="sim">
      <header className="sim__head">
        <div className="shell sim__headInner">
          <Link to={`/app/${slug}`} className="sim__back">
            ← {major.name}
          </Link>
          <span className="eyebrow">{sim.eyebrow}</span>
          <h1 className="sim__title">{sim.title}</h1>
          <p className="sim__subtitle">{sim.subtitle}</p>
        </div>
      </header>

      {/* Where you are, in five acts rather than in twenty-fifths — a reader
          does not need to know a screen number, only roughly how far in they
          are and what this part of the case is about. */}
      <nav className="shell sim__rail" aria-label="Progress">
        <ol className="simActs">
          {ACTS.map((a) => (
            <li
              key={a.label}
              className={
                a === act ? 'is-on' : state.currentScreen > a.to ? 'is-done' : ''
              }
            >
              <span className="simActs__label">{a.label}</span>
            </li>
          ))}
        </ol>
        <p className="sim__count">
          Screen {state.currentScreen} of {LAST_SCREEN}
        </p>
      </nav>

      <main className="shell sim__stage" ref={stage}>
        <Current c={sim} state={state} dispatch={dispatch} go={go} />
      </main>
    </div>
  )
}
