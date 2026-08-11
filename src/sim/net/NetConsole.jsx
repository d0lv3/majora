import { useMemo } from 'react'

import NetworkMap from './NetworkMap.jsx'
import { observationsAt, replay, stepAt, stepReady } from './netState.js'
import './net.css'

/**
 * The console: the map, and whatever the current phase asks you to do with it.
 *
 * Seven phases share one screen rather than becoming seven screens, because
 * the point of this simulation is that it is the same network throughout. The
 * panel beside the map changes; the map does not.
 */

/* ------------------------------- small parts ---------------------------- */

function Term({ term }) {
  return (
    <div className="netTerm">
      <p className="netTerm__name">{term.term}</p>
      <p className="netTerm__text">{term.text}</p>
    </div>
  )
}

function Assumption({ children }) {
  return (
    <p className="netAssume">
      <span className="netAssume__tag">The assumption</span>
      <span className="netAssume__text">“{children}”</span>
    </p>
  )
}

/* --------------------------------- recon -------------------------------- */

function Recon({ sim, state, dispatch, onDone }) {
  const node = sim.nodes.find((n) => n.id === state.selected)
  const reachable = state.reached.includes(state.selected)
  const obs = observationsAt(sim, state.selected, state.taken)
  const step = stepAt(sim, state.selected, state)
  const ready = step && stepReady(step, state.noticed)

  const takeStep = () => {
    const reveals = sim.terms.filter((t) => t.after === step.id).map((t) => t.id)
    dispatch({ type: 'take', step, reveals })
    if (step.ends) onDone()
  }

  const lastStep = sim.steps.find((s) => s.id === state.taken[state.taken.length - 1]) ?? null
  /* Where a step leaves you: the ground it opened, or the node it happened at
     when it opened nothing. The same rule netState uses to move the selection. */
  const landedOn = lastStep ? (lastStep.opens[0] ?? lastStep.at) : null

  const justNamed = sim.terms.filter(
    (t) => state.named.includes(t.id) && t.after === state.taken[state.taken.length - 1],
  )

  /* Taking a step opens new things to see on nodes the reader has already
     been to — the website tells you something new once you are on it — and
     without a signpost that reads as a dead end rather than a door. So the
     hint names the places with something unread on them. */
  const unread = sim.nodes.filter(
    (n) =>
      n.id !== state.selected &&
      state.reached.includes(n.id) &&
      observationsAt(sim, n.id, state.taken).some((o) => !state.noticed.includes(o.id)),
  )

  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">{reachable ? 'Reachable' : 'Out of reach'}</p>
        <h2 className="netPanel__title">{node.label}</h2>
        <p className="netPanel__sub">{node.sub}</p>
      </header>

      {!reachable && (
        <p className="netPanel__locked">
          You know it is there. You cannot talk to it from where you are — you would have to be on
          something that can.
        </p>
      )}

      {reachable && (
        <>
          <ul className="netObs">
            {obs.map((o) => {
              const seen = state.noticed.includes(o.id)
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    className={`netObs__btn${seen ? ' is-seen' : ''}`}
                    onClick={() => dispatch({ type: 'notice', id: o.id })}
                    aria-expanded={seen}
                  >
                    {seen ? o.text : 'Look closer'}
                  </button>
                  {seen && o.note && <p className="netObs__note">{o.note}</p>}
                </li>
              )
            })}
            {obs.length === 0 && (
              <li className="netObs__empty">Nothing here that you can see from outside.</li>
            )}
          </ul>

          {step && (
            <div className="netAct">
              <button
                type="button"
                className="netAct__btn"
                disabled={!ready}
                onClick={takeStep}
              >
                {step.label}
              </button>
              {!ready && (
                <p className="netAct__hint">
                  There is something to try here, and you have not seen enough yet to know what.
                  {unread.length > 0 && (
                    <>
                      {' '}
                      Something you have not looked at:{' '}
                      <b>{unread.map((n) => n.label).join(', ')}</b>.
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* What the last step did, and only where it did it. Taking a step drops
          the reader on the ground it opened, and the result belongs to that
          node — left unconditional it followed them around the map, so
          standing on the file server they were still being told they had just
          signed in to the website. */}
      {lastStep && state.selected === landedOn && (
        <div className="netResult">
          <p className="netResult__text">{lastStep.result}</p>
          <Assumption>{lastStep.assumption}</Assumption>
          {justNamed.map((t) => (
            <Term key={t.id} term={t} />
          ))}
        </div>
      )}
    </>
  )
}

/* --------------------------------- turn --------------------------------- */

function Turn({ sim, onNext }) {
  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">The turn</p>
        <h2 className="netPanel__title">{sim.turn.title}</h2>
        <p className="netPanel__sub">{sim.turn.lede}</p>
      </header>
      {sim.turn.text.map((t) => (
        <p className="netPanel__text" key={t}>
          {t}
        </p>
      ))}
      <ol className="netChain">
        {sim.steps.map((s, i) => (
          <li key={s.id}>
            <span className="netChain__n">{i + 1}</span>
            <span className="netChain__assume">“{s.assumption}”</span>
          </li>
        ))}
      </ol>
      <button type="button" className="netAct__btn" onClick={onNext}>
        Find out what you left behind
      </button>
    </>
  )
}

/* --------------------------------- hunt --------------------------------- */

function Hunt({ sim, state, dispatch, onNext }) {
  const mine = sim.hunt.lines.filter((l) => l.mine).map((l) => l.id)
  const allFound = mine.every((id) => state.marked.includes(id))
  const wrong = state.marked.filter((id) => !mine.includes(id))

  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">Investigate</p>
        <h2 className="netPanel__title">{sim.hunt.title}</h2>
        <p className="netPanel__sub">{sim.hunt.lede}</p>
      </header>

      <ul className="netLog">
        {sim.hunt.lines.map((l) => {
          const on = state.marked.includes(l.id)
          return (
            <li key={l.id}>
              <button
                type="button"
                className={`netLog__row${on ? ' is-marked' : ''}`}
                onClick={() => dispatch({ type: 'mark', id: l.id })}
                aria-pressed={on}
              >
                <span className="netLog__at">{l.at}</span>
                <span className="netLog__src">{l.src}</span>
                <span className="netLog__text">{l.text.replace('%EXT%', '188.51.204.7')}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Guidance whenever the marks are not yet exactly right — including
          when all three are found and a fourth is marked as well, which used
          to render nothing at all: no hint, no button, and nothing to say the
          way on was to unmark something. */}
      {(!allFound || wrong.length > 0) && (
        <p className="netAct__hint">
          {wrong.length > 0
            ? 'One of those is ordinary traffic — a backup, a printer, somebody arriving. Every night has some. Tap it again to put it back.'
            : state.marked.length === 0
              ? 'Three of these are yours. You made them less than ten minutes ago.'
              : `${state.marked.length} of 3.`}
        </p>
      )}

      {allFound && wrong.length === 0 && (
        <>
          <p className="netPanel__text">{sim.hunt.resolution}</p>
          <p className="netObs__note">{sim.hunt.note}</p>
          <button type="button" className="netAct__btn" onClick={onNext}>
            Decide what to fix
          </button>
        </>
      )}
    </>
  )
}

/* -------------------------------- harden -------------------------------- */

function Harden({ sim, state, dispatch, onNext }) {
  const left = sim.budget - state.fixes.length

  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">Defend</p>
        <h2 className="netPanel__title">Four fixes. Budget for two.</h2>
        <p className="netPanel__sub">
          Each of these is a quarter of somebody’s work and a cost to somebody else. You will not
          get all four signed off. Choose two.
        </p>
      </header>

      <ul className="netFixes">
        {sim.fixes.map((f) => {
          const on = state.fixes.includes(f.id)
          const full = !on && left === 0
          return (
            <li key={f.id}>
              <button
                type="button"
                className={`netFix${on ? ' is-on' : ''}`}
                aria-pressed={on}
                disabled={full}
                onClick={() => dispatch({ type: 'fix', id: f.id, budget: sim.budget })}
              >
                <span className="netFix__label">{f.label}</span>
                <span className="netFix__detail">{f.detail}</span>
                <span className="netFix__cost">
                  <span className="netFix__costTag">What it costs</span>
                  {f.cost}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="netAct">
        <button type="button" className="netAct__btn" disabled={left > 0} onClick={onNext}>
          Run it again
        </button>
        {left > 0 && (
          <p className="netAct__hint">
            {left === sim.budget ? 'Pick two.' : 'One more.'}
          </p>
        )}
      </div>
    </>
  )
}

/* -------------------------------- replay -------------------------------- */

function Replay({ sim, state, onNext }) {
  const results = useMemo(() => replay(sim, state.fixes), [sim, state.fixes])

  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">Replay</p>
        <h2 className="netPanel__title">The same two nights, against your network</h2>
      </header>

      {results.map((p) => (
        <div className="netPath" key={p.id}>
          <p className="netPath__label">{p.label}</p>
          {p.intro && <p className="netPath__intro">{p.intro}</p>}
          <ol className="netPath__steps">
            {p.steps.map((s) => (
              <li key={s.id} className={`is-${s.state}`}>
                <span className="netPath__mark" aria-hidden="true" />
                <span className="netPath__text">{s.text}</span>
                <span className="netPath__verdict">
                  {s.state === 'blocked' ? sim.outcomes.stopped : s.state === 'through' ? sim.outcomes.through : ''}
                </span>
              </li>
            ))}
          </ol>
          <p className={`netPath__end${p.reachedEnd ? ' is-bad' : ''}`}>
            {
              sim.outcomes.ends[
                `${p.reachedEnd ? 'through' : 'stopped'}${p.watching ? 'Seen' : 'Unseen'}`
              ]
            }
          </p>
        </div>
      ))}

      <button type="button" className="netAct__btn" onClick={onNext}>
        What you are left with
      </button>
    </>
  )
}

/* -------------------------------- debrief ------------------------------- */

function Debrief({ sim, state, dispatch }) {
  return (
    <>
      <header className="netPanel__head">
        <p className="netPanel__eyebrow">Complete</p>
        <h2 className="netPanel__title">{sim.debrief.title}</h2>
      </header>
      {sim.debrief.text.map((t) => (
        <p className="netPanel__text" key={t}>
          {t}
        </p>
      ))}

      <div className="netTerms">
        {sim.terms.map((t) => (
          <Term key={t.id} term={t} />
        ))}
      </div>

      <p className="netPanel__close">{sim.debrief.close}</p>

      <button type="button" className="netAct__btn" onClick={() => dispatch({ type: 'restart' })}>
        Start again
      </button>
    </>
  )
}

/* --------------------------------- shell -------------------------------- */

export default function NetConsole({ sim, state, dispatch }) {
  const go = (to) => dispatch({ type: 'phase', to })

  /* Marked on the map as well as named in the hint: a dot on a node is the
     cheapest way to say "there is something here you have not looked at",
     and without it the reader has to remember where they have been. */
  const unreadIds =
    state.phase === 'recon'
      ? sim.nodes
          .filter(
            (n) =>
              state.reached.includes(n.id) &&
              observationsAt(sim, n.id, state.taken).some((o) => !state.noticed.includes(o.id)),
          )
          .map((n) => n.id)
      : []

  const defending = ['turn', 'hunt', 'harden', 'replay', 'debrief'].includes(state.phase)

  /* Which head the reader is wearing, named on the map itself. The one sentence
     the cybersecurity page is built on is "think like an attacker… and then
     think like a defender", and this is that sentence turned into a state you
     can see you are in. The sub-label tracks the act so the ribbon says not
     just which side but what that side is doing right now. */
  const mode = defending
    ? { side: 'Defender', label: { turn: 'The turn', hunt: 'Investigation', harden: 'Hardening', replay: 'Replay', debrief: 'Debrief' }[state.phase] ?? '' }
    : { side: 'Attacker', label: ['Reconnaissance', 'Breaking in', 'Moving inward'][state.taken.length] ?? 'Moving inward' }
  /* Once the turn has happened the map stops being a place you are moving
     through and becomes the route you took, drawn. */
  const pathIds = defending ? ['you', 'web', 'office', 'admin', 'db'] : []
  const cutLinks = useMemo(() => {
    if (state.phase !== 'harden' && state.phase !== 'replay' && state.phase !== 'debrief') return []
    const cuts = []
    if (state.fixes.includes('vpn')) cuts.push(['you', 'web'])
    if (state.fixes.includes('tls')) cuts.push(['office', 'admin'])
    if (state.fixes.includes('auth')) cuts.push(['office', 'db'])
    return cuts
  }, [state.phase, state.fixes])

  return (
    <div className="netConsole">
      <NetworkMap
        sim={sim}
        state={state}
        onSelect={(id) => dispatch({ type: 'select', id })}
        unreadIds={unreadIds}
        pathIds={pathIds}
        cutLinks={cutLinks}
        defending={defending}
        mode={mode}
      />

      <section className="netPanel">
        {state.phase === 'recon' && (
          <Recon sim={sim} state={state} dispatch={dispatch} onDone={() => go('turn')} />
        )}
        {state.phase === 'turn' && <Turn sim={sim} onNext={() => go('hunt')} />}
        {state.phase === 'hunt' && (
          <Hunt sim={sim} state={state} dispatch={dispatch} onNext={() => go('harden')} />
        )}
        {state.phase === 'harden' && (
          <Harden sim={sim} state={state} dispatch={dispatch} onNext={() => go('replay')} />
        )}
        {state.phase === 'replay' && <Replay sim={sim} state={state} onNext={() => go('debrief')} />}
        {state.phase === 'debrief' && <Debrief sim={sim} state={state} dispatch={dispatch} />}
      </section>
    </div>
  )
}
