import { useEffect, useState } from 'react'
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

  /* ONE BEAT AT A TIME
     Every layout before this one lost the same argument: a scene is four or
     five paragraphs, the picture is the point, and the two cannot both have
     the screen. Paginating settles it. Text on a photograph is perfectly
     legible at three lines and unreadable at fifteen, so the scene is dealt out
     a paragraph at a time and the picture keeps everything the paragraph is not
     standing on. */
  const blocks = scene.blocks ?? []
  const [beat, setBeat] = useState(0)
  useEffect(() => setBeat(0), [scene.id])

  const last = Math.max(0, blocks.length - 1)
  const at = Math.min(beat, last)
  const more = beat < last
  /* The decision arrives with the final beat rather than after it, so the last
     thing said and the thing you do about it are on screen together. */
  const decided = !more

  /* A scene ends in exactly one of four ways. */
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

  /* Anywhere on the picture advances the text, the way it would in any game
     that reads like this — but only while there is text left, and never when
     the press landed on something that does its own job. */
  const advance = (event) => {
    if (!more) return
    if (event.target.closest('button, a')) return
    setBeat((b) => b + 1)
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

      {/* Everything from here down sits on the photograph. No card and no
          panel — only a gradient dark enough to read on, which is why the text
          has to stay short. */}
      <div
        className={`story__hud${more ? ' is-advancing' : ''}`}
        onClick={advance}
        role="presentation"
      >
        <header className="story__caption">
          <span className="story__eyebrow">{scene.visit}</span>
          <h2 className="story__title">{scene.title}</h2>
        </header>

        <div className="story__script">
          {scene.lede && at === 0 && <p className="story__lede">{scene.lede}</p>}

          {blocks.length > 0 && (
            <div className="story__beat" key={`${scene.id}-${at}`}>
              <Block block={blocks[at]} sim={sim} choices={choices} i={at} />
            </div>
          )}

          {more ? (
            <button type="button" className="story__next" onClick={() => setBeat((b) => b + 1)}>
              <span className="story__nextDots" aria-hidden="true">
                {blocks.map((_, i) => (
                  <span key={i} className={i <= at ? 'is-on' : ''} />
                ))}
              </span>
              Continue reading
              <span className="story__nextChevron" aria-hidden="true">
                ›
              </span>
            </button>
          ) : (
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
                    dispatch({
                      type: 'answer',
                      scene: scene.id,
                      id: o.id,
                      correct: Boolean(o.correct),
                    })
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
