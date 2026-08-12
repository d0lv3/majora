import { useCallback, useEffect, useReducer, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getMajor, isAvailable } from '../data/majors.js'
import { simulationFor } from '../data/simulations.js'
import { SCREENS, ACTS } from '../sim/Screens.jsx'
import { initialState, reducer, LAST_SCREEN } from '../sim/state.js'
import StoryPlayer, { storyAct } from '../sim/story/StoryPlayer.jsx'
import StoryLoader from '../sim/story/StoryLoader.jsx'
import StoryAudio from '../sim/story/StoryAudio.jsx'
import { initialStoryState, storyReducer } from '../sim/story/storyState.js'
import { useScenePreload } from '../sim/story/useScenePreload.js'
import NetConsole from '../sim/net/NetConsole.jsx'
import { actOf, initialNetState, netReducer } from '../sim/net/netState.js'
import JawConsole from '../sim/jaw/JawConsole.jsx'
import { initialJawState, jawReducer } from '../sim/jaw/jawState.js'
import SimFeedback from '../components/SimFeedback.jsx'
import './Simulation.css'

/**
 * The last level of a major's curriculum, played out.
 *
 * The page is a shell: a head that names the case, a rail showing which act
 * you are in, and whichever part of it the state says you are on. Everything
 * that makes it a simulation is in src/sim.
 *
 * There are two kinds, and the route picks between them here because they hold
 * genuinely different state and hooks may not be called conditionally:
 *
 *   screens  a fixed run of hand-built screens, numbered — the orthodontics
 *            clinic, where each screen is its own instrument
 *   story    a branching scene graph driven by choices — Macbeth, where the
 *            scenes are alike and only the path through them differs
 *   network  one map and a phase — The Way In, where the screen never changes
 *            and what you are being asked to do to it does
 *
 * Deliberately not the app's dark ground. The reader is inside the case rather
 * than reading about one; the surrounding chrome is a way back out and nothing
 * else.
 */
export default function Simulation() {
  const { slug, sim: simSlug } = useParams()
  const major = getMajor(slug)
  const sim = simulationFor(slug, simSlug)

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

  if (sim.kind === 'story') return <StoryRun slug={slug} major={major} sim={sim} />
  if (sim.kind === 'network') return <NetRun slug={slug} major={major} sim={sim} />
  if (sim.kind === 'jaw') return <JawRun slug={slug} major={major} sim={sim} />
  return <ScreensRun slug={slug} major={major} sim={sim} />
}

/* -------------------------------- the shell ----------------------------- */

/**
 * Head, progress rail, stage. `step` is whatever counts as "somewhere else"
 * for this kind of simulation — a screen number or a scene id — and changing
 * it puts the reader at the top of the new one.
 */
function SimShell({ slug, major, sim, step, acts, act, count, variant, railEnd, headExtra, children }) {
  const first = useRef(true)
  const stage = useRef(null)

  /* Each step is a page in its own right, so arriving at one should put you at
     the top of it. Not on the first render, though — jumping the window on
     load would fight the scroll position the route arrived with. */
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stage.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [step])

  return (
    <div className={`sim${variant ? ` sim--${variant}` : ''}`}>
      <header className="sim__head">
        <div className="shell sim__headInner">
          <Link to={`/app/${slug}`} className="sim__back">
            ← {major.name}
          </Link>
          <span className="eyebrow">{sim.eyebrow}</span>
          <h1 className="sim__title">{sim.title}</h1>
          <p className="sim__subtitle">{sim.subtitle}</p>
          {headExtra}
        </div>
      </header>

      {/* Where you are, in acts rather than in twenty-fifths — a reader does
          not need a step number, only roughly how far in they are and what
          this part of it is about. */}
      <nav className="shell sim__rail" aria-label="Progress">
        <ol className="simActs">
          {acts.map((a, i) => (
            <li
              key={a.label}
              className={a === act ? 'is-on' : i < acts.indexOf(act) ? 'is-done' : ''}
            >
              <span className="simActs__label">{a.label}</span>
            </li>
          ))}
        </ol>
        {count && <p className="sim__count">{count}</p>}
        {railEnd}
      </nav>

      <main className="shell sim__stage" ref={stage}>
        {children}

        {/* Under the simulation, on every screen of it, for everybody.
            It used to wait for the ending — four different endings, four
            conditions, one per run below — which meant the only readers who
            could say anything were the ones who had already got all the way
            through. The ones who gave up halfway are the ones worth hearing
            from, and they were the ones being shown nothing.

            Rendered here rather than in each run for the same reason: this is
            the one place that is "below the simulation" whichever kind it
            is. */}
        <SimFeedback sim={sim} majorName={major.name} />
      </main>
    </div>
  )
}

/* ------------------------------- the two runs --------------------------- */

function ScreensRun({ slug, major, sim }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const go = useCallback((screen) => dispatch({ type: 'go', screen }), [])

  const Current = SCREENS[state.currentScreen]
  const act = ACTS.find((a) => state.currentScreen >= a.from && state.currentScreen <= a.to)

  return (
    <SimShell
      slug={slug}
      major={major}
      sim={sim}
      step={state.currentScreen}
      acts={ACTS}
      act={act}
      count={`Screen ${state.currentScreen} of ${LAST_SCREEN}`}
    >
      <Current c={sim} state={state} dispatch={dispatch} go={go} />
    </SimShell>
  )
}

function StoryRun({ slug, major, sim }) {
  const [state, dispatch] = useReducer(storyReducer, sim, initialStoryState)
  const scenes = useScenePreload(sim)

  /* The curtain, and it replaces the page rather than sitting inside it: the
     header and the progress rail are part of the set, and raising them behind
     a loading bar would give away the shape of what is coming. */
  if (!scenes.ready) return <StoryLoader {...scenes} />

  return (
    <SimShell
      slug={slug}
      major={major}
      sim={sim}
      variant="story"
      step={state.sceneId}
      acts={sim.acts}
      act={storyAct(sim, state.sceneId)}
      railEnd={<StoryAudio name={sim.score} />}
    >
      <StoryPlayer sim={sim} state={state} dispatch={dispatch} />
    </SimShell>
  )
}

function JawRun({ slug, major, sim }) {
  const [state, dispatch] = useReducer(jawReducer, undefined, initialJawState)

  return (
    <SimShell
      slug={slug}
      major={major}
      sim={sim}
      variant="net"
      /* The act, and not the tooth: scrolling the page back to the top every
         time the reader picks a different tooth would fight the one thing this
         simulation is for. */
      step={state.act}
      acts={sim.acts}
      act={sim.acts.find((a) => a.id === state.act)}
    >
      <JawConsole sim={sim} state={state} dispatch={dispatch} />
    </SimShell>
  )
}

function NetRun({ slug, major, sim }) {
  const [state, dispatch] = useReducer(netReducer, undefined, initialNetState)
  const actId = actOf(sim, state)

  /* The target, named. It was in the content from the start and shown nowhere —
     and it is the whole reason any of this matters: forty people's customers on
     one database. A dossier in the head puts the stakes on screen before the
     reader touches the map. */
  const dossier = sim.company ? (
    <div className="netBrief">
      <span className="netBrief__tag">Target dossier</span>
      <p className="netBrief__name">{sim.company.name}</p>
      <p className="netBrief__blurb">{sim.company.blurb}</p>
    </div>
  ) : null

  return (
    <SimShell
      slug={slug}
      major={major}
      sim={sim}
      variant="net"
      step={`${state.phase}:${state.taken.length}`}
      acts={sim.acts}
      act={sim.acts.find((a) => a.id === actId)}
      headExtra={dossier}
    >
      <NetConsole sim={sim} state={state} dispatch={dispatch} />
    </SimShell>
  )
}
