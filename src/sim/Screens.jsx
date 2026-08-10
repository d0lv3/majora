import { useState } from 'react'

import Screen from './Screen.jsx'
import MouthView from './MouthView.jsx'
import CephTracing, { cephReading } from './CephTracing.jsx'
import StudyModel from './StudyModel.jsx'
import XRayShot from './XRayShot.jsx'
import { recordsCollected } from './state.js'

/**
 * The twenty-five screens.
 *
 * One file, because they are one document: they share the chrome, they read
 * the same state object, and half of them are three paragraphs and a button.
 * Split across twenty-five files the shape of the journey — which screen leads
 * where, and what has to have happened first — would be spread too thin to
 * read.
 *
 * Every screen takes the same four things and owns no state that outlives it,
 * apart from the handful of local revealed/selected flags that genuinely do
 * not matter once you have left.
 *
 *   c         the content, from data/simulations/orthodontics.js
 *   state     the SimulationState
 *   dispatch  the reducer
 *   go        shorthand for dispatch({ type: 'go', screen })
 */

/* ------------------------------- helpers -------------------------------- */

function Patient({ children }) {
  return (
    <figure className="simSay">
      <span className="simSay__who" aria-hidden="true">
        Patient
      </span>
      <blockquote className="simSay__line">{children}</blockquote>
    </figure>
  )
}

function Lesson({ children }) {
  return (
    <aside className="simLesson">
      <span className="simLesson__tag">Why this matters</span>
      <p>{children}</p>
    </aside>
  )
}

/* -------------------------------- 01-05 --------------------------------- */

function Cover({ c, go }) {
  return (
    <Screen
      visit="Simulation"
      title={c.title}
      lede={c.subtitle}
      actions={[{ label: c.cover.action, primary: true, onClick: () => go(2) }]}
    >
      <p className="simLede">{c.cover.lede}</p>
      {c.cover.text.map((t) => (
        <p className="simText" key={t}>
          {t}
        </p>
      ))}
    </Screen>
  )
}

function MeetPatient({ c, state, go }) {
  const e = state.exploredActions
  const ready = e.talkedToPatient || e.examinedMouth

  return (
    <Screen
      visit="Visit 01 — First consultation"
      title="Meet your patient"
      banner={c.patient.banner}
      actions={[
        { label: 'Talk to patient', onClick: () => go(3), done: e.talkedToPatient },
        { label: 'Examine', onClick: () => go(4), done: e.examinedMouth },
        { label: 'View photographs', onClick: () => go(6), done: e.viewedPhotos },
        { label: 'Request imaging', onClick: () => go(8), done: e.requestedXRay },
        {
          label: 'She has a question for you',
          primary: true,
          disabled: !ready,
          onClick: () => go(5),
        },
      ]}
      footnote={ready ? null : 'Talk to her or examine her first — either one.'}
    >
      <div className="simChair">
        <div className="simChair__art" aria-hidden="true">
          <svg viewBox="0 0 240 180">
            <path className="simChair__seat" d="M40 150q0-58 42-70 24-7 46 0 42 12 42 70z" />
            <circle className="simChair__head" cx="120" cy="58" r="26" />
            <path className="simChair__arm" d="M36 150h168" />
          </svg>
        </div>
        <div className="simChair__copy">
          <p className="simMeta">
            {c.patient.name}, {c.patient.age}
          </p>
          <Patient>{c.patient.chiefConcern}</Patient>
        </div>
      </div>
    </Screen>
  )
}

function TalkToPatient({ c, state, dispatch, go }) {
  const asked = state.conversationHistory
  const all = asked.length === c.interview.questions.length

  return (
    <Screen
      visit="Conversation"
      title="Patient interview"
      actions={[{ label: 'Continue to examination', primary: true, onClick: () => go(4) }]}
      footnote={all ? null : 'You can ask as many or as few of these as you like.'}
    >
      <Patient>{c.interview.opening}</Patient>

      <ul className="simAsk">
        {c.interview.questions.map((q) => {
          const done = asked.includes(q.id)
          return (
            <li key={q.id}>
              <button
                type="button"
                className={`simAsk__q${done ? ' is-asked' : ''}`}
                onClick={() => dispatch({ type: 'ask', id: q.id })}
                aria-expanded={done}
              >
                “{q.ask}”
              </button>
              {done && <p className="simAsk__reply">{q.reply}</p>}
            </li>
          )
        })}
      </ul>

      {all && <Lesson>{c.interview.insight}</Lesson>}
    </Screen>
  )
}

function ExaminePatient({ c, state, dispatch, go }) {
  const seen = state.examinationAreasVisited
  const foundOverjet = seen.includes('front')

  return (
    <Screen
      visit="Clinical examination"
      title="Look in the mouth"
      banner={c.examination.banner}
      actions={[
        {
          label: 'She has a question for you',
          primary: true,
          disabled: seen.length === 0,
          onClick: () => go(5),
        },
      ]}
      footnote={foundOverjet ? null : 'The front bite is the one worth looking at closely.'}
    >
      <MouthView visited={seen} onSelect={(area) => dispatch({ type: 'examine', area })} />

      <ul className="simFindings">
        {['upper', 'lower', 'front'].map((area) => {
          const a = c.examination.areas[area]
          return (
            <li key={area} className={seen.includes(area) ? 'is-found' : ''}>
              <span className="simFindings__label">{a.label}</span>
              <span className="simFindings__text">
                {seen.includes(area) ? a.finding : 'Not yet examined.'}
              </span>
            </li>
          )
        })}
      </ul>

      {/* The term arrives only after the thing has been seen. */}
      {foundOverjet && (
        <div className="simTerm">
          <p className="simTerm__name">{c.examination.term.name}</p>
          <p className="simTerm__def">{c.examination.term.definition}</p>
          <p className="simTerm__note">{c.examination.term.note}</p>
        </div>
      )}
    </Screen>
  )
}

function TheQuestion({ c, state, go }) {
  const e = state.exploredActions
  const done = {
    photos: e.viewedPhotos,
    models: e.viewedModels,
    xray: e.requestedXRay,
    ceph: e.completedCephTracing,
  }

  return (
    <Screen
      visit="Clinical decision point"
      title="“So… do I need braces?”"
      banner={c.question.warning}
    >
      <Patient>{c.question.patient}</Patient>
      <p className="simText">{c.question.prompt}</p>

      <ul className="simRecords">
        {c.records.map((r) => (
          <li key={r.id}>
            <button type="button" className="simRecord" onClick={() => go(r.screen)}>
              <span className="simRecord__head">
                <span className="simRecord__label">{r.label}</span>
                {done[r.id] && <span className="simRecord__tag">Collected</span>}
              </span>
              <span className="simRecord__blurb">{r.blurb}</span>
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

/* -------------------------------- 06-09 --------------------------------- */

function Photographs({ c, dispatch, go }) {
  const [open, setOpen] = useState(null)
  return (
    <Screen
      visit="Records — 1 of 4"
      title="Photographs"
      actions={[
        {
          label: 'Next: dental models',
          primary: true,
          onClick: () => {
            dispatch({ type: 'record', id: 'photos' })
            go(7)
          },
        },
        { label: 'Back to records', onClick: () => go(5) },
      ]}
    >
      <ul className="simPhotos">
        {c.photographs.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`simPhoto${open === p.id ? ' is-open' : ''}`}
              onClick={() => setOpen(open === p.id ? null : p.id)}
            >
              <span className="simPhoto__frame" aria-hidden="true" data-kind={p.id} />
              <span className="simPhoto__label">{p.label}</span>
              {open === p.id && <span className="simPhoto__note">{p.note}</span>}
            </button>
          </li>
        ))}
      </ul>
      <Lesson>{c.records[0].lesson}</Lesson>
    </Screen>
  )
}

function Models({ c, dispatch, go }) {
  return (
    <Screen
      visit="Records — 2 of 4"
      title="Dental models"
      actions={[
        {
          label: 'Next: X-ray imaging',
          primary: true,
          onClick: () => {
            dispatch({ type: 'record', id: 'models' })
            go(8)
          },
        },
        { label: 'Back to records', onClick: () => go(5) },
      ]}
    >
      <StudyModel />
      <Lesson>{c.records[1].lesson}</Lesson>
    </Screen>
  )
}

function XRay({ c, dispatch, go }) {
  const [ready, setReady] = useState(false)
  return (
    <Screen
      visit="Records — 3 of 4"
      title="Radiology request"
      actions={[
        {
          label: 'Examine X-ray & start tracing',
          primary: true,
          disabled: !ready,
          onClick: () => {
            dispatch({ type: 'record', id: 'xray' })
            go(9)
          },
        },
        { label: 'Back to records', onClick: () => go(5) },
      ]}
      footnote={ready ? null : 'Taking the exposure…'}
    >
      <XRayShot onReady={() => setReady(true)} />
      {ready && <Lesson>{c.records[2].lesson}</Lesson>}
    </Screen>
  )
}

function Ceph({ c, state, dispatch, go }) {
  const placed = state.cephLandmarksPlaced
  const complete = placed.length === c.ceph.landmarks.length
  const reading = complete ? cephReading(placed) : null

  return (
    <Screen
      visit="Records — 4 of 4"
      title="Cephalometric tracing"
      banner={complete ? null : c.ceph.banner}
      actions={[
        {
          label: 'Build the case',
          primary: true,
          disabled: !complete,
          onClick: () => {
            dispatch({ type: 'record', id: 'ceph' })
            go(10)
          },
        },
      ]}
      footnote={complete ? null : `${placed.length} of ${c.ceph.landmarks.length} landmarks placed.`}
    >
      <CephTracing
        landmarks={c.ceph.landmarks}
        placed={placed}
        nudge={c.ceph.nudge}
        onPlace={(landmark) => dispatch({ type: 'placeLandmark', landmark })}
      />

      {complete && (
        <>
          <Lesson>{c.ceph.completion}</Lesson>
          <p className="simText">{c.ceph.reading[reading.skeletal]}</p>
        </>
      )}
    </Screen>
  )
}

/* -------------------------------- 10-13 --------------------------------- */

function BuildCase({ c, state, go }) {
  const e = state.exploredActions
  const reading = cephReading(state.cephLandmarksPlaced)
  const cards = [
    {
      label: 'Chief concern',
      value: c.patient.chiefConcern,
      got: e.talkedToPatient || e.examinedMouth,
    },
    {
      label: 'Clinical overjet',
      value: `Increased — ${state.patient.initialOverjetMM.toFixed(1)} mm`,
      got: state.examinationAreasVisited.includes('front'),
    },
    {
      label: 'Photographs & models',
      value: e.viewedPhotos && e.viewedModels ? 'Archived' : 'Partly collected',
      got: e.viewedPhotos && e.viewedModels,
    },
    {
      label: 'Cephalometrics',
      value: reading ? `${reading.label} skeletal relationship (ANB ${reading.anb}°)` : 'Not traced',
      got: Boolean(reading),
    },
  ]

  return (
    <Screen
      visit="Patient dashboard"
      title="Build the case"
      lede="Everything you have gathered, in one place. This is the file you plan from."
      actions={[{ label: 'Set treatment goals', primary: true, onClick: () => go(11) }]}
      footnote={
        recordsCollected(state) < 4
          ? 'Some records were not collected. A real case can be planned this way; it is just planned on less.'
          : null
      }
    >
      <ul className="simCards">
        {cards.map((card) => (
          <li key={card.label} className={card.got ? '' : 'is-thin'}>
            <span className="simCards__label">{card.label}</span>
            <span className="simCards__value">{card.value}</span>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function Goals({ c, state, dispatch, go }) {
  const [open, setOpen] = useState(null)
  const inspected = state.treatmentGoals.length

  return (
    <Screen
      visit="Treatment planning"
      title="What are we trying to achieve?"
      lede="Five goals, and they are not in competition. Open each one."
      actions={[{ label: 'Build the treatment journey', primary: true, onClick: () => go(12) }]}
      footnote={`${inspected} of ${c.goals.length} opened.`}
    >
      <ul className="simGoals">
        {c.goals.map((g) => {
          const isOpen = open === g.id
          return (
            <li key={g.id} className={state.treatmentGoals.includes(g.id) ? 'is-read' : ''}>
              <button
                type="button"
                className="simGoal"
                aria-expanded={isOpen}
                onClick={() => {
                  setOpen(isOpen ? null : g.id)
                  dispatch({ type: 'goal', id: g.id })
                }}
              >
                <span className="simGoal__label">{g.label}</span>
                <span className="simGoal__short">{g.short}</span>
              </button>
              {isOpen && <p className="simGoal__text">{g.text}</p>}
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}

function Journey({ c, state, dispatch, go }) {
  const [open, setOpen] = useState(c.timeline[0].id)
  const node = c.timeline.find((n) => n.id === open)

  return (
    <Screen
      visit="Timeline editor"
      title="Build the treatment journey"
      lede="The shape of the next eighteen months. Click a stage to see what happens in it."
      actions={[{ label: 'Start treatment (Visit 02)', primary: true, onClick: () => go(13) }]}
      footnote={`${state.timelineNodesRead.length} of ${c.timeline.length} stages opened.`}
    >
      <ol className="simTrack">
        {c.timeline.map((n, i) => (
          <li key={n.id}>
            <button
              type="button"
              className={`simTrack__node${open === n.id ? ' is-on' : ''}${
                state.timelineNodesRead.includes(n.id) ? ' is-read' : ''
              }`}
              onClick={() => {
                setOpen(n.id)
                dispatch({ type: 'timelineNode', id: n.id })
              }}
            >
              <span className="simTrack__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="simTrack__label">{n.label}</span>
            </button>
          </li>
        ))}
      </ol>
      {node && <p className="simTrack__note">{node.note}</p>}
    </Screen>
  )
}

function TreatmentStarts({ c, go }) {
  return (
    <Screen
      visit="Visit 02 — Treatment initiation"
      title="Treatment starts"
      actions={[
        { label: 'Fast-forward to month 3', primary: true, onClick: () => go(14) },
      ]}
    >
      <div className="simBraces" aria-hidden="true">
        <svg viewBox="0 0 320 90">
          <path className="simBraces__wire" d="M18 46q142 -30 284 0" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={26 + i * 34} y={34 - Math.sin((i / 8) * Math.PI) * 11} width="18" height="20" rx="4" />
          ))}
        </svg>
      </div>
      <p className="simText">{c.start.message}</p>
    </Screen>
  )
}

/* -------------------------------- 14-20 --------------------------------- */

function MonthThree({ c, go }) {
  return (
    <Screen
      visit="Visit 03 — Month 3 follow-up"
      title="What has actually moved?"
      actions={[{ label: 'Inspect the change', primary: true, onClick: () => go(15) }]}
    >
      <Patient>{c.monthThree.patient}</Patient>
      <div className="simCompare">
        <div>
          <span className="simCompare__when">Month 0</span>
          <span className="simCompare__mm">7.0 mm</span>
        </div>
        <span className="simCompare__arrow" aria-hidden="true">
          →
        </span>
        <div>
          <span className="simCompare__when">Month 3</span>
          <span className="simCompare__mm">5.2 mm</span>
        </div>
      </div>
    </Screen>
  )
}

function MonthThreeDetail({ c, go }) {
  const [seen, setSeen] = useState([])
  return (
    <Screen
      visit="Visit 03 — Month 3 follow-up"
      title="Exploration"
      lede="Three things to check before you talk to her. Open each."
      actions={[
        { label: 'Talk to her about cooperation', primary: true, onClick: () => go(16) },
      ]}
      footnote={`${seen.length} of ${c.monthThree.observations.length} checked.`}
    >
      <ul className="simObs">
        {c.monthThree.observations.map((o, i) => (
          <li key={o}>
            <button
              type="button"
              className={`simObs__btn${seen.includes(i) ? ' is-seen' : ''}`}
              onClick={() => setSeen((s) => (s.includes(i) ? s : [...s, i]))}
              aria-expanded={seen.includes(i)}
            >
              {seen.includes(i) ? o : `Check ${['the upper arch', 'the lower arch', 'the upper left segment'][i]}`}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function Cooperation({ c, dispatch, go }) {
  return (
    <Screen
      visit="Patient communication"
      title="A conversation, not a correction"
      actions={[]}
    >
      <Patient>{c.cooperation.patient}</Patient>
      <p className="simText">How do you respond?</p>
      <ul className="simChoices">
        {c.cooperation.options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              className="simChoice"
              onClick={() => {
                dispatch({ type: 'cooperation', strategy: o.id, level: o.level })
                go(17)
              }}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function CooperationResult({ c, state, go }) {
  const chosen = c.cooperation.options.find(
    (o) => o.id === state.userInteractions.cooperationStrategy,
  )
  return (
    <Screen
      visit="Patient communication"
      title="What follows from that"
      actions={[
        { label: 'Advance to month 9', primary: true, onClick: () => go(18) },
        { label: 'Take the conversation again', onClick: () => go(16) },
      ]}
    >
      {chosen && (
        <>
          <p className="simChosen">You chose: {chosen.label}</p>
          <p className="simText">{chosen.consequence}</p>
        </>
      )}
      <Lesson>{c.cooperation.note}</Lesson>
    </Screen>
  )
}

function Progress({ c, state, dispatch, go }) {
  const idx = Math.max(
    0,
    c.months.findIndex((m) => m.month === state.timelineMonth),
  )
  const current = c.months[idx]

  return (
    <Screen
      visit="Progress tracking"
      title="Month 9"
      lede="Drag through the treatment and watch the overjet you measured yourself come down."
      actions={[{ label: 'Continue to clinical update', primary: true, onClick: () => go(19) }]}
    >
      <div className="simProgress">
        <output className="simProgress__value">
          <span className="simProgress__mm">{current.overjet.toFixed(1)}</span>
          <span className="simProgress__unit">mm overjet</span>
        </output>

        <label className="simProgress__slider">
          <span className="sr-only">Month of treatment</span>
          <input
            type="range"
            min="0"
            max={c.months.length - 1}
            step="1"
            value={idx}
            onChange={(e) => {
              const m = c.months[Number(e.target.value)]
              dispatch({ type: 'month', month: m.month, overjet: m.overjet })
            }}
          />
        </label>

        <ol className="simProgress__stops" aria-hidden="true">
          {c.months.map((m) => (
            <li key={m.month} className={m.month === current.month ? 'is-on' : ''}>
              Month {m.month}
            </li>
          ))}
        </ol>

        <p className="simProgress__note">{current.note}</p>
      </div>
    </Screen>
  )
}

function Unexpected({ c, state, dispatch, go }) {
  const run = state.investigationsRun
  const enough = run.length >= 2

  return (
    <Screen
      visit="Month 12 — Adaptive planning"
      title="Something has stopped moving"
      banner={c.adaptation.guidance}
      actions={[
        {
          label: 'Change the plan',
          primary: true,
          disabled: !enough,
          onClick: () => go(20),
        },
      ]}
      footnote={enough ? null : 'Investigate at least two things before you change anything.'}
    >
      <p className="simText">{c.adaptation.situation}</p>
      <ul className="simObs">
        {c.adaptation.investigations.map((inv) => (
          <li key={inv.id}>
            <button
              type="button"
              className={`simObs__btn${run.includes(inv.id) ? ' is-seen' : ''}`}
              onClick={() => dispatch({ type: 'investigate', id: inv.id })}
              aria-expanded={run.includes(inv.id)}
            >
              {run.includes(inv.id) ? inv.finding : inv.label}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function Adaptation({ c, state, dispatch, go }) {
  const done = state.userInteractions.adaptedPlan
  return (
    <Screen
      visit="Month 12 — Adaptive planning"
      title="Change the wire, not the diagnosis"
      actions={[
        {
          label: done ? 'Proceed to final evaluation' : c.adaptation.resolution.label,
          primary: true,
          onClick: () => (done ? go(21) : dispatch({ type: 'adapt' })),
        },
      ]}
    >
      <p className="simText">{c.adaptation.resolution.text}</p>
      {done && (
        <>
          <div className="simDone">Plan adapted. The rotation begins to express over the next six weeks.</div>
          <Lesson>{c.adaptation.lesson}</Lesson>
        </>
      )}
    </Screen>
  )
}

/* -------------------------------- 21-25 --------------------------------- */

function FinalFollowUp({ c, state, go }) {
  const { before, after } = c.evaluation
  const strategy = state.userInteractions.cooperationStrategy
  const level = strategy ? c.cooperation.options.find((o) => o.id === strategy)?.level : null

  return (
    <Screen
      visit="Final follow-up"
      title="Treatment evaluation"
      actions={[{ label: 'Reveal summary', primary: true, onClick: () => go(22) }]}
    >
      <div className="simBoard">
        {[before, after].map((side, i) => (
          <div className={`simBoard__side${i ? ' simBoard__side--after' : ''}`} key={side.label}>
            <span className="simBoard__when">{side.label}</span>
            <span className="simBoard__mm">{side.overjet}</span>
            <ul>
              {side.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="simText">{c.evaluation.byCooperation[level ?? 'none']}</p>
    </Screen>
  )
}

function Reveal({ c, go }) {
  return (
    <Screen
      visit="Experience recap"
      title={c.recap.statement}
      actions={[{ label: 'Explore discovery cards', primary: true, onClick: () => go(23) }]}
    >
      <ol className="simSteps">
        {c.recap.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p className="simText">{c.recap.text}</p>
    </Screen>
  )
}

function Discovery({ c, go }) {
  const [open, setOpen] = useState([])
  return (
    <Screen
      visit="Reflection"
      title="What did you discover?"
      lede="Not a test. Turn each card over if you want the words for what you just did."
      actions={[{ label: 'Final message', primary: true, onClick: () => go(24) }]}
    >
      <ul className="simDeck">
        {c.discovery.map((d) => {
          const isOpen = open.includes(d.id)
          return (
            <li key={d.id}>
              <button
                type="button"
                className={`simFlip${isOpen ? ' is-open' : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== d.id) : [...o, d.id]))}
              >
                <span className="simFlip__term">{d.term}</span>
                <span className="simFlip__text">{isOpen ? d.text : 'Turn over'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}

function FinalMessage({ c, go }) {
  return (
    <Screen
      visit="Complete"
      title={c.closing.title}
      actions={[{ label: 'See where this sits in the degree', primary: true, onClick: () => go(25) }]}
    >
      {c.closing.text.map((t) => (
        <p className="simText" key={t}>
          {t}
        </p>
      ))}
    </Screen>
  )
}

function Roadmap({ c, dispatch }) {
  return (
    <Screen
      visit="Majora — dentistry"
      title="Where this sits in the degree"
      lede="The five years you read about on the dentistry page. You have just finished the last of them."
      actions={[
        { label: 'Restart simulation', onClick: () => dispatch({ type: 'restart' }) },
      ]}
    >
      <ol className="simRoad">
        {c.roadmap.map((r) => (
          <li key={r.year} className={r.done ? 'is-done' : ''}>
            <span className="simRoad__year">{r.year}</span>
            <span className="simRoad__label">{r.label}</span>
            {r.done && <span className="simRoad__tag">Completed</span>}
          </li>
        ))}
      </ol>
    </Screen>
  )
}

/* ------------------------------ the mapping ----------------------------- */

export const SCREENS = {
  1: Cover,
  2: MeetPatient,
  3: TalkToPatient,
  4: ExaminePatient,
  5: TheQuestion,
  6: Photographs,
  7: Models,
  8: XRay,
  9: Ceph,
  10: BuildCase,
  11: Goals,
  12: Journey,
  13: TreatmentStarts,
  14: MonthThree,
  15: MonthThreeDetail,
  16: Cooperation,
  17: CooperationResult,
  18: Progress,
  19: Unexpected,
  20: Adaptation,
  21: FinalFollowUp,
  22: Reveal,
  23: Discovery,
  24: FinalMessage,
  25: Roadmap,
}

/** The five acts, for the progress rail along the top. */
export const ACTS = [
  { label: 'Consultation', from: 1, to: 5 },
  { label: 'Records', from: 6, to: 9 },
  { label: 'Planning', from: 10, to: 13 },
  { label: 'Monitoring', from: 14, to: 20 },
  { label: 'Evaluation', from: 21, to: 25 },
]
