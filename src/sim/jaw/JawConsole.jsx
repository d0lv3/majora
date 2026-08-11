import { lazy, Suspense, useState } from 'react'

import BrandLoader from '../../components/BrandLoader.jsx'
import { ACTS, archOf, readFdi, sideOf } from './jawState.js'
import './jaw.css'

/**
 * The console: the jaw, and whatever the current act asks you to do with it.
 *
 * Four acts share one screen rather than becoming four screens, for the same
 * reason the network console does — the point is that it is the same jaw
 * throughout, and that the vocabulary lands on the thing you have already been
 * turning over in your hands. The panel beside the model changes; the model
 * does not, and neither does the reader's place in it.
 */

/**
 * The viewer arrives on its own, because three.js comes with it.
 *
 * Imported normally it lands in the chunk every simulation shares, and Macbeth
 * — which draws nothing but photographs — would pay for a 3D engine it never
 * calls. Split out, the renderer is fetched only by the one page that has a
 * model to show, and it downloads behind the same curtain as the model itself.
 */
const JawViewer = lazy(() => import('./JawViewer.jsx'))

/* ------------------------------- small parts ---------------------------- */

/** 1st, 2nd, 3rd, 4th — the counting only ever runs to eight. */
const ordinal = (n) => `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'}`

/** What the selected tooth is, in the model's own words plus the teaching. */
function ToothCard({ sim, fdi }) {
  const { position } = readFdi(fdi)
  const kind = sim.kinds[position]
  if (!kind) return null

  return (
    <div className="jawCard">
      <div className="jawCard__head">
        <span className="jawCard__fdi">{fdi}</span>
        <div>
          <p className="jawCard__type">{kind.type}</p>
          <p className="jawCard__where">
            {archOf(fdi) === 'upper' ? 'Upper' : 'Lower'} jaw · patient’s {sideOf(fdi)} ·{' '}
            {ordinal(position)} from the midline
          </p>
        </div>
      </div>

      <p className="jawCard__job">{kind.job}</p>
      <p className="jawCard__roots">{kind.roots}</p>
      <p className="jawCard__note">{kind.note}</p>

      {/* The number taken apart, every time, because this is the thing the
          whole simulation is trying to make automatic. */}
      <p className="jawCard__parse">
        <b>{String(fdi)[0]}</b> is the quadrant — {archOf(fdi)} {sideOf(fdi)}. <b>{String(fdi)[1]}</b> is the
        count outward, so this is the {ordinal(position)} tooth from the midline.
      </p>
    </div>
  )
}

/** The 32 boxes, in the order the numbering puts them. */
function Odontogram({ sim, marks, selected, onPick }) {
  const row = (arch) => (
    <ol className="jawChart__row">
      {sim.arches[arch].map((fdi) => {
        const mark = marks[fdi]
        return (
          <li key={fdi}>
            <button
              type="button"
              className={`jawChart__tooth${selected === fdi ? ' is-on' : ''}${mark ? ` is-${mark}` : ''}`}
              onClick={() => onPick(fdi)}
              aria-pressed={selected === fdi}
            >
              <span className="jawChart__n">{fdi}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )

  return (
    <div className="jawChart">
      <div className="jawChart__sides">
        <span>Patient’s right</span>
        <span>Patient’s left</span>
      </div>
      {row('upper')}
      <div className="jawChart__midline">
        <span>Upper</span>
        <span>Lower</span>
      </div>
      {row('lower')}
    </div>
  )
}

/* --------------------------------- the acts ------------------------------ */

function Look({ sim, state, dispatch, onNext }) {
  return (
    <>
      <header className="jawPanel__head">
        <p className="jawPanel__eyebrow">Look</p>
        <h2 className="jawPanel__title">{sim.look.title}</h2>
        <p className="jawPanel__sub">{sim.look.lede}</p>
      </header>

      {sim.look.text.map((t) => (
        <p className="jawPanel__text" key={t}>
          {t}
        </p>
      ))}

      <ul className="jawTry">
        {sim.look.prompts.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {state.selected ? (
        <ToothCard sim={sim} fdi={state.selected} />
      ) : (
        <p className="jawPanel__hint">Tap a tooth on the model and it will tell you what it is.</p>
      )}

      <div className="jawAct">
        <button type="button" className="jawAct__btn" onClick={onNext}>
          Why it is called 46
        </button>
        <p className="jawAct__count">{state.seen.length} of 32 looked at</p>
      </div>
    </>
  )
}

function Numbering({ sim, state, dispatch, onNext }) {
  const done = sim.number.finds.filter((f) => state.found.includes(f.fdi))

  return (
    <>
      <header className="jawPanel__head">
        <p className="jawPanel__eyebrow">The numbering</p>
        <h2 className="jawPanel__title">{sim.number.title}</h2>
        <p className="jawPanel__sub">{sim.number.lede}</p>
      </header>

      {sim.number.text.map((t) => (
        <p className="jawPanel__text" key={t}>
          {t}
        </p>
      ))}

      <ol className="jawQuads">
        {sim.number.quadrants.map((q) => (
          <li key={q.id}>
            <span className="jawQuads__n">{q.id}</span>
            <span className="jawQuads__label">{q.label}</span>
            <span className="jawQuads__range">{q.range}</span>
          </li>
        ))}
      </ol>

      {/* Not a quiz: the jaw is right there and the rule is written above it, so
          finding the tooth is the understanding. Nothing is marked and nothing
          is wrong — the prompt just stops asking once you have it. */}
      <div className="jawFinds">
        <p className="jawFinds__title">Find them on the model</p>
        {sim.number.finds.map((f) => {
          const got = state.found.includes(f.fdi)
          return (
            <div key={f.fdi} className={`jawFind${got ? ' is-done' : ''}`}>
              <span className="jawFind__mark" aria-hidden="true" />
              <span className="jawFind__ask">{f.ask}</span>
              {got && <span className="jawFind__got">found</span>}
            </div>
          )
        })}
      </div>

      {state.selected && <ToothCard sim={sim} fdi={state.selected} />}

      <div className="jawAct">
        <button type="button" className="jawAct__btn" onClick={onNext}>
          The sides of a tooth
        </button>
        <p className="jawAct__count">{done.length} of {sim.number.finds.length} found</p>
      </div>
    </>
  )
}

function Surfaces({ sim, state, dispatch, onNext }) {
  return (
    <>
      <header className="jawPanel__head">
        <p className="jawPanel__eyebrow">The surfaces</p>
        <h2 className="jawPanel__title">{sim.surface.title}</h2>
        <p className="jawPanel__sub">{sim.surface.lede}</p>
      </header>

      {sim.surface.text.map((t) => (
        <p className="jawPanel__text" key={t}>
          {t}
        </p>
      ))}

      <ul className="jawFaces">
        {sim.surface.faces.map((f) => {
          const on = state.face === f.id
          return (
            <li key={f.id}>
              <button
                type="button"
                className={`jawFace${on ? ' is-on' : ''}`}
                onClick={() => dispatch({ type: 'face', id: f.id })}
                aria-expanded={on}
              >
                <span className="jawFace__label">{f.label}</span>
                <span className="jawFace__gloss">{f.gloss}</span>
              </button>
              {on && <p className="jawFace__where">{f.where}</p>}
            </li>
          )
        })}
      </ul>

      <div className="jawAct">
        <button type="button" className="jawAct__btn" onClick={onNext}>
          Now read the chart
        </button>
      </div>
    </>
  )
}

function Chart({ sim, state, dispatch, onNext }) {
  const [mark, setMark] = useState('watch')
  const count = Object.keys(state.marks).length

  return (
    <>
      <header className="jawPanel__head">
        <p className="jawPanel__eyebrow">The chart</p>
        <h2 className="jawPanel__title">{sim.chart.title}</h2>
        <p className="jawPanel__sub">{sim.chart.lede}</p>
      </header>

      {sim.chart.text.map((t) => (
        <p className="jawPanel__text" key={t}>
          {t}
        </p>
      ))}

      <div className="jawMarks">
        {sim.chart.marks.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`jawMark jawMark--${m.tone}${mark === m.id ? ' is-on' : ''}`}
            onClick={() => setMark(m.id)}
            aria-pressed={mark === m.id}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="jawMarks__gloss">{sim.chart.marks.find((m) => m.id === mark)?.gloss}</p>

      <Odontogram
        sim={sim}
        marks={state.marks}
        selected={state.selected}
        onPick={(fdi) => {
          dispatch({ type: 'select', fdi })
          dispatch({ type: 'mark', fdi, mark })
        }}
      />

      {state.selected && <ToothCard sim={sim} fdi={state.selected} />}

      <div className="jawAct">
        <button type="button" className="jawAct__btn" onClick={onNext}>
          What you just did
        </button>
        <p className="jawAct__count">{count} marked</p>
      </div>
    </>
  )
}

function Close({ sim, dispatch }) {
  return (
    <>
      <header className="jawPanel__head">
        <p className="jawPanel__eyebrow">Complete</p>
        <h2 className="jawPanel__title">{sim.close.title}</h2>
      </header>
      {sim.close.text.map((t) => (
        <p className="jawPanel__text" key={t}>
          {t}
        </p>
      ))}
      <p className="jawPanel__close">{sim.close.close}</p>
      <button type="button" className="jawAct__btn" onClick={() => dispatch({ type: 'restart' })}>
        Start again
      </button>
    </>
  )
}

/* --------------------------------- shell -------------------------------- */

export default function JawConsole({ sim, state, dispatch }) {
  const [model, setModel] = useState({ ready: false, progress: 0, error: null })

  const go = (to) => dispatch({ type: 'act', to })
  const nextAct = () => {
    const i = ACTS.indexOf(state.act)
    go(i < ACTS.length - 1 ? ACTS[i + 1] : 'close')
  }

  /* A tooth picked on the model answers whichever find-the-tooth prompt was
     asking for it — see the note in jawState on why there is no confirm step. */
  const pick = (fdi) => {
    const solves = sim.number.finds.some((f) => f.fdi === fdi) ? fdi : null
    dispatch({ type: 'select', fdi, solves })
  }

  return (
    <div className="jawConsole">
      <div className="jawStage">
        <div className="jawStage__shell">
          {/* No fallback of its own: the curtain below is already up until the
              model reports itself ready, and it covers the chunk's arrival and
              the download that follows it as one wait. */}
          <Suspense fallback={null}>
            <JawViewer
              selected={state.selected}
              layer={state.layer}
              lifted={state.lifted}
              onPick={pick}
              onReady={(r) => setModel({ ready: !r.error, progress: 1, error: r.error ?? null })}
              onProgress={(p) => setModel((m) => (m.ready ? m : { ...m, progress: p.progress }))}
            />
          </Suspense>

          {/* The curtain sits inside the viewer rather than over the page: the
              reading panel beside it is ordinary HTML and is ready immediately,
              so there is no reason to hide it behind the model's wait. */}
          {!model.ready && !model.error && (
            <div className="jawStage__curtain">
              <BrandLoader
                inset
                label="Loading the jaw"
                progress={model.progress || null}
                detail="A scanned mandible and 32 teeth · about 1.2 MB"
              />
            </div>
          )}

          {model.error && (
            <div className="jawStage__curtain jawStage__curtain--bad">
              <p>{model.error}</p>
            </div>
          )}

          {state.selected && (
            <div className="jawStage__pill">
              <b>{state.selected}</b>
              {sim.kinds[readFdi(state.selected).position]?.type}
            </div>
          )}
        </div>

        <div className="jawTools">
          <div className="jawTools__group" role="group" aria-label="Layers">
            {['Gingiva', 'Bone', 'Teeth only'].map((label, i) => (
              <button
                key={label}
                type="button"
                className={`jawTool${state.layer === i ? ' is-on' : ''}`}
                onClick={() => dispatch({ type: 'layer', to: i })}
                aria-pressed={state.layer === i}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`jawTool${state.lifted ? ' is-on' : ''}`}
            onClick={() => dispatch({ type: 'lift' })}
            aria-pressed={state.lifted}
          >
            Lift the tooth
          </button>

          {state.selected && (
            <button type="button" className="jawTool" onClick={() => dispatch({ type: 'clear' })}>
              Put it back
            </button>
          )}
        </div>

        {/* The licence, and not in small print: the model is a real anatomical
            data set and CC BY-SA asks for the credit to travel with it. */}
        <p className="jawCredit">
          Model: {sim.model.source} · {sim.model.licence}. {sim.model.note}
        </p>
      </div>

      <section className="jawPanel">
        {state.act === 'look' && <Look sim={sim} state={state} dispatch={dispatch} onNext={nextAct} />}
        {state.act === 'number' && (
          <Numbering sim={sim} state={state} dispatch={dispatch} onNext={nextAct} />
        )}
        {state.act === 'surface' && (
          <Surfaces sim={sim} state={state} dispatch={dispatch} onNext={nextAct} />
        )}
        {state.act === 'chart' && <Chart sim={sim} state={state} dispatch={dispatch} onNext={nextAct} />}
        {state.act === 'close' && <Close sim={sim} dispatch={dispatch} />}
      </section>
    </div>
  )
}
