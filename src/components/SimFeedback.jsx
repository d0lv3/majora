import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { alreadyAnswered, feedbackEnabled, rememberAnswered, sendFeedback } from '../lib/feedback.js'
import './SimFeedback.css'

/**
 * What the reader made of the simulation, asked the moment they finish it.
 *
 * Two ways to answer and neither is compulsory: a rating out of five, and a box
 * to write in. Either one on its own can be sent — the rating used to be the
 * price of the writing, with the Send button dead until a number was picked,
 * which left a student who had something to say and no view on a five-point
 * line with no way to say it.
 *
 * WHY IT IS A DIALOG AND NOT A CARD
 *
 * It sat under the closing screen before, where it was easy to never see: the
 * closing screen of three of the four simulations is a full stage, and the card
 * was below the fold at the end of a page nobody scrolls once they have
 * finished. Asking properly means asking in front of them.
 *
 * That makes it an interruption, so it behaves like one that respects you: it
 * arrives a beat after the ending rather than on top of it, the closing screen
 * stays readable behind it, Escape and the backdrop and the corner close it,
 * and closing it costs nothing — nothing here gates the simulation, which is
 * already over.
 *
 * IT ASKS ONCE
 *
 * Answered ratings are remembered per simulation in this browser, so replaying
 * Macbeth to see the other ending is not met with the same form again. That
 * also means one reader can only rate a simulation once from one browser, which
 * is the right trade: a nagging form gets closed, and a rating given twice is
 * not worth more than a rating given once.
 *
 * Closing it unanswered is not remembered, though. Dismissing is "not now" and
 * not "never" — but the only way back is to finish the simulation again, which
 * is deliberate enough that asking a second time is fair.
 */

const SCALE = [
  { value: 1, label: 'Not really' },
  { value: 2, label: '' },
  { value: 3, label: 'It was fine' },
  { value: 4, label: '' },
  { value: 5, label: 'Genuinely useful' },
]

/**
 * The beat between finishing and being asked.
 *
 * Long enough that the closing screen is on screen and read as the ending
 * rather than as something that flashed past behind a form — the last screen is
 * the payoff of the whole simulation and covering it instantly throws it away.
 * Short enough to still be the moment they finished.
 */
const OPEN_DELAY_MS = 1100

/** How long the thank-you stays up before the dialog takes itself away. */
const THANKS_MS = 1900

export default function SimFeedback({ sim, majorName }) {
  const slug = sim.slug
  const askId = useId()
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')
  const [state, setState] = useState('asking')
  const [open, setOpen] = useState(false)
  /* Read once, at mount: having answered on an earlier visit means never being
     asked again, and it must not change under the dialog while it is open. */
  const [answeredBefore] = useState(() => alreadyAnswered(slug))

  const dialog = useRef(null)
  const opener = useRef(null)

  const shouldAsk = feedbackEnabled() && !answeredBefore

  const close = useCallback(() => setOpen(false), [])

  /* Arrive a beat after the ending. Mounting is the completion — this component
     is only rendered once its simulation reports itself finished. */
  useEffect(() => {
    if (!shouldAsk) return undefined
    const id = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [shouldAsk])

  /* Thanked, then gone. Leaving a spent dialog on screen makes the reader
     dismiss a thank-you, which is a silly thing to ask anybody to do. */
  useEffect(() => {
    if (state !== 'done') return undefined
    const id = window.setTimeout(close, THANKS_MS)
    return () => window.clearTimeout(id)
  }, [state, close])

  /* While it is open it owns the keyboard and the scroll: focus moves into it,
     Tab cannot walk out the back of it into the page underneath, Escape closes
     it, and whatever was focused before gets it back afterwards. */
  useEffect(() => {
    if (!open) return undefined

    opener.current = document.activeElement
    const box = dialog.current
    box?.focus()

    const scrollLock = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
        return
      }
      if (event.key !== 'Tab' || !box) return
      const stops = box.querySelectorAll(
        'button:not(:disabled), textarea, [href], input, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!stops.length) return
      const first = stops[0]
      const last = stops[stops.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = scrollLock
      /* Only if it is still there — the closing screen may have been replaced
         by a restart while the dialog was up. */
      if (opener.current?.isConnected) opener.current.focus()
    }
  }, [open, close])

  if (!shouldAsk || !open) return null

  /* Something to send is a number or some words. Trimmed, so a textarea holding
     three spaces is not a message. */
  const canSend = rating !== null || comment.trim() !== ''

  const submit = async (event) => {
    event.preventDefault()
    if (!canSend || state === 'sending') return
    setState('sending')
    try {
      await sendFeedback({ slug, title: sim.title, rating, comment })
      rememberAnswered(slug)
      setState('done')
    } catch {
      setState('failed')
    }
  }

  return createPortal(
    /* Out to the body, because the simulations put this dialog on top of a
       sticky specimen, a WebGL canvas and a full-bleed photograph, and stacking
       above all three from inside their own layers is a fight not worth
       having. */
    <div
      className="simRate__veil"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        className="simRate"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${askId}-title`}
        ref={dialog}
        tabIndex={-1}
      >
        <button type="button" className="simRate__close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {state === 'done' ? (
          <p className="simRate__thanks" aria-live="polite">
            Thank you — that helps more than you would think.
          </p>
        ) : (
          <form onSubmit={submit}>
            {/* The simulation's own name, because the rating is its own too —
                one per simulation, remembered per simulation, sent with its
                slug. Two of them belong to the same major and the question
                below is written from the major's name, so without this the
                dialog at the end of the jaw and the one at the end of the
                clinic are word for word the same and the reader is asked to
                rate "Dentistry" twice. */}
            <p className="simRate__eyebrow">{sim.title}</p>
            <h2 className="simRate__title" id={`${askId}-title`}>
              What did you make of it?
            </h2>

            {/* The number is one answer and the writing is the other, and
                neither is the price of the other. */}
            <div className="simRate__block">
              {/* The major's name as it is written on its own page — sim.major
                  holds the URL slug, and "what english-language-literature is
                  like" is not a sentence anybody should be shown.

                  A paragraph the scale points at rather than a <legend>: the
                  question a screen reader announces for this group should be
                  the one printed above it, and a legend's own box is awkward to
                  place without a fieldset border to hang it on. */}
              <p className="simRate__ask" id={`${askId}-scale`}>
                {majorName
                  ? `Was this a good way to see what ${majorName} is like?`
                  : 'Was this a good way to see what the subject is like?'}
              </p>

              <div className="simRate__scale" role="group" aria-labelledby={`${askId}-scale`}>
                {SCALE.map((step) => (
                  <button
                    key={step.value}
                    type="button"
                    className={`simRate__step${rating === step.value ? ' is-on' : ''}`}
                    onClick={() => setRating(step.value)}
                    aria-pressed={rating === step.value}
                    aria-label={step.label || `${step.value} out of 5`}
                  >
                    <span className="simRate__n">{step.value}</span>
                    {step.label && <span className="simRate__word">{step.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            <label className="simRate__block simRate__field">
              <span className="simRate__ask">Tell them what you think</span>
              <textarea
                rows={4}
                value={comment}
                maxLength={1000}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What worked, what did not, what confused you, what you wanted more of. Write as much or as little as you like."
              />
            </label>

            <div className="simRate__foot">
              <button
                type="submit"
                className="simRate__send"
                disabled={!canSend || state === 'sending'}
              >
                {state === 'sending' ? 'Sending…' : 'Send'}
              </button>
              <button type="button" className="simRate__skip" onClick={close}>
                Not now
              </button>
              <p className="simRate__note">
                {canSend
                  ? 'Anonymous — your rating and your words, nothing that says who you are.'
                  : 'A number, a few sentences, or both — whichever you have.'}
              </p>
            </div>

            {state === 'failed' && (
              <p className="simRate__failed" role="alert">
                That did not go through. Check the connection and try again — nothing was lost.
              </p>
            )}
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
