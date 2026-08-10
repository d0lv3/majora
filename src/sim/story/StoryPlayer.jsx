import { useNavigate } from 'react-router-dom'

import { resolve } from './storyState.js'
import { scenePhoto } from './scenePhotos.js'

/**
 * A branching story, played.
 *
 * One component for every scene, where the orthodontics case has twenty-five.
 * That is not laziness on this side — it is what the two kinds of simulation
 * actually are. A clinic screen is a different instrument each time: a mouth
 * you click, a radiograph you trace, a slider that moves a tooth. A story
 * scene is a picture, some prose, and a fork, every time. Written as twenty
 * components they would be twenty copies of the same four lines, and the
 * branching — the only genuinely difficult part — would be spread out where
 * nobody could see it whole.
 *
 * THE LAYOUT IS A FILM STILL, NOT A PAGE
 *
 * The photograph takes the screen and the prose sits under it, with the scene
 * title lying across the bottom of the picture where a caption would. Reading
 * about Macbeth on a white card with a thumbnail is a different experience
 * from watching a scene and then being asked what you would do, and the second
 * one is what this is for. It also means the pictures are worth the weight
 * they cost.
 *
 * The screens that are not scenes — the three literature questions and the
 * closing — keep the frame but wear it as a blurred band, so the film pauses
 * rather than cuts. Which picture they pause on is `backdrop` in the data.
 */

/* --------------------------------- parts -------------------------------- */

function Said({ who, lines }) {
  return (
    <figure className="simSay">
      <span className="simSay__who" aria-hidden="true">
        {who}
      </span>
      {lines.map((line) => (
        <blockquote className="simSay__line" key={line}>
          {line}
        </blockquote>
      ))}
    </figure>
  )
}

function Recap({ sim, choices }) {
  return (
    <ol className="simPath">
      {sim.recap.map((row) => {
        const made = choices[row.key]
        if (!made) return null
        return (
          <li key={row.key}>
            <span className="simPath__when">{row.label}</span>
            <span className="simPath__what">{row.values[made]}</span>
          </li>
        )
      })}
    </ol>
  )
}

function Block({ block, sim, choices, i }) {
  switch (block.type) {
    case 'text': {
      const text = block.by ? resolve(block, choices) : block.text
      return text ? <p className="simText">{text}</p> : null
    }

    case 'say': {
      const lines = block.by ? resolve(block, choices) : block.lines
      return lines?.length ? <Said who={block.who} lines={lines} /> : null
    }

    case 'lesson':
      return (
        <aside className="simLesson" key={i}>
          <span className="simLesson__tag">{block.tag ?? 'Why this matters'}</span>
          <p>{block.text}</p>
        </aside>
      )

    case 'recap':
      return <Recap sim={sim} choices={choices} />

    default:
      return null
  }
}

/* -------------------------------- the fork ------------------------------ */

function Choice({ choice, onPick }) {
  return (
    <div className="simFork">
      <p className="simFork__prompt">{choice.prompt}</p>
      <ul className="simFork__options">
        {choice.options.map((o) => (
          <li key={o.id}>
            <button type="button" className="simPick" onClick={() => onPick(o)}>
              <span className="simPick__label">{o.label}</span>
              <span className="simPick__text">{o.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The literature question.
 *
 * This one does have a right answer, unlike everything else in the file, and
 * it says so — but it never blocks the way forward and it never counts
 * anything up. A wrong answer is told what the term actually is and why, which
 * is the only useful thing to do with a wrong answer.
 */
function Question({ q, answered, onAnswer }) {
  const chosen = q.options.find((o) => o.id === answered?.id)
  return (
    <div className="simQuiz">
      <p className="simQuiz__prompt">{q.prompt}</p>
      <ul className="simQuiz__options">
        {q.options.map((o) => {
          const isChosen = answered?.id === o.id
          const reveal = answered && (isChosen || o.correct)
          return (
            <li key={o.id}>
              <button
                type="button"
                className={`simOpt${isChosen ? ' is-chosen' : ''}${
                  reveal ? (o.correct ? ' is-right' : ' is-wrong') : ''
                }`}
                onClick={() => !answered && onAnswer(o)}
                disabled={Boolean(answered)}
              >
                <span className="simOpt__label">{o.label}</span>
                {reveal && (
                  <span className="simOpt__mark" aria-hidden="true">
                    {o.correct ? '✓' : '✕'}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className="simQuiz__after">
          <p className="simQuiz__verdict">{chosen?.correct ? q.right : q.wrong}</p>
          <aside className="simLesson">
            <span className="simLesson__tag">Why this matters</span>
            <p>{q.lesson}</p>
          </aside>
        </div>
      )}
    </div>
  )
}

/* -------------------------------- the page ------------------------------ */

export default function StoryPlayer({ sim, state, dispatch }) {
  const navigate = useNavigate()
  const scene = sim.scenes.find((s) => s.id === state.sceneId) ?? sim.scenes[0]
  const { choices } = state

  const nextId = typeof scene.next === 'string' ? scene.next : resolve(scene.next, choices)
  const choice = scene.choice?.by ? resolve(scene.choice, choices) : scene.choice
  const answered = state.answers[scene.id]

  /* A scene shows its own photograph; a pause shows the one it is pausing on,
     blurred back. Either way the frame is there, so the page never jumps
     between two different shapes. */
  const paused = !scene.image && Boolean(scene.backdrop)
  const src = scenePhoto(scene.image ?? scene.backdrop)

  /* A scene ends in exactly one of four ways, and the footer follows: a fork
     has its buttons in the body, a question waits to be answered before it
     offers a way on, the last scene offers the way out, and everything else is
     a single continue. */
  const actions = []
  if (scene.restart) {
    actions.push({
      label: 'Play it again',
      primary: true,
      onClick: () => dispatch({ type: 'restart', sim }),
    })
    if (sim.exit) actions.push({ label: sim.exit.label, onClick: () => navigate(sim.exit.to) })
  } else if (scene.question) {
    actions.push({
      label: 'Continue',
      primary: true,
      disabled: !answered,
      onClick: () => dispatch({ type: 'go', to: nextId }),
    })
  } else if (!choice) {
    actions.push({
      label: scene.action ?? 'Continue',
      primary: true,
      onClick: () => dispatch({ type: 'go', to: nextId }),
    })
  }

  return (
    <article className="story">
      <div className={`story__frame${paused ? ' story__frame--paused' : ''}`}>
        {src && (
          <img
            className="story__img"
            src={src}
            /* A paused frame is the picture you have already looked at, so it
               is decoration the second time and describing it again would be
               noise in a screen reader. */
            alt={paused ? '' : (scene.imageAlt ?? '')}
            key={src}
          />
        )}
      </div>

      {/* The band. Everything the reader has to read or press is in here, in
          one strip along the foot of the picture, so the frame above it is
          never covered — including the scene title, which used to be a second
          overlay of its own. */}
      <div className="story__panel">
        <header className="story__caption">
          <span className="story__eyebrow">{scene.visit}</span>
          <h2 className="story__title">{scene.title}</h2>
          {scene.lede && <p className="story__lede">{scene.lede}</p>}
        </header>

        <div className="story__prose">
          {scene.blocks?.map((block, i) => (
            <Block block={block} sim={sim} choices={choices} i={i} key={`${scene.id}-${i}`} />
          ))}
        </div>

        {/* What you do about it, in its own column beside the prose: it keeps
            the band short, which is the whole point of a band. */}
        <div className="story__decide">
          {choice && (
            <Choice
              choice={choice}
              onPick={(o) => dispatch({ type: 'choose', set: o.set, to: nextId })}
            />
          )}

          {scene.question && (
            <Question
              q={scene.question}
              answered={answered}
              onAnswer={(o) =>
                dispatch({ type: 'answer', scene: scene.id, id: o.id, correct: Boolean(o.correct) })
              }
            />
          )}

          {actions.length > 0 && (
            <footer className="story__foot">
              <div className="story__actions">
                {actions.map((a) => (
                  <button
                    type="button"
                    key={a.label}
                    className={`simBtn${a.primary ? ' simBtn--primary' : ''}`}
                    onClick={a.onClick}
                    disabled={a.disabled}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              {scene.question && !answered && (
                <p className="story__footnote">
                  Choose an answer to carry on. Nothing is being scored.
                </p>
              )}
            </footer>
          )}
        </div>
      </div>
    </article>
  )
}

/** How far along the reader is, in acts. */
export function storyAct(sim, sceneId) {
  const scene = sim.scenes.find((s) => s.id === sceneId)
  return sim.acts.find((a) => a.id === scene?.act) ?? sim.acts[0]
}
