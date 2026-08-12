import { useEffect, useId, useState } from 'react'

import { alreadyAnswered, feedbackEnabled, rememberAnswered, sendFeedback } from '../lib/feedback.js'
import './SimFeedback.css'

/**
 * What the reader makes of the simulation, asked underneath it.
 *
 * Two ways to answer and neither is compulsory: a rating out of five, and a box
 * to write in. Either one on its own can be sent — the rating used to be the
 * price of the writing, with the Send button dead until a number was picked,
 * which left a student who had something to say and no view on a five-point
 * line with no way to say it.
 *
 * UNDER THE SIMULATION, ON EVERY SCREEN OF IT
 *
 * Not a dialog, and not held back until the ending. Both of those were tried.
 * Waiting for the last screen means the only people who can say anything are
 * the ones who already liked it enough to finish — and the reader who gave up
 * in the middle is the one worth hearing from. Putting it in front of them
 * instead of under them buys attention by taking the screen, which is a toll on
 * everybody to collect from the few.
 *
 * So it sits at the foot of the stage from the first screen to the last, in the
 * same place every time, and the copy is in the present tense because it is now
 * read by people in the middle of the thing as often as by people at the end of
 * it. It is offered and never in the way; scrolling past costs nothing.
 *
 * IT ASKS ONCE
 *
 * Answered ratings are remembered per simulation in this browser, so a reader
 * who has already said their piece is not asked again on the next screen, or on
 * a replay. That also means one reader can only rate a simulation once from one
 * browser, which is the right trade: a form that keeps asking gets ignored, and
 * a rating given twice is not worth more than a rating given once.
 */

const SCALE = [
  { value: 1, label: 'Not really' },
  { value: 2, label: '' },
  { value: 3, label: 'It was fine' },
  { value: 4, label: '' },
  { value: 5, label: 'Genuinely useful' },
]

/**
 * How long the thank-you stays before the card takes itself away.
 *
 * It has to go. This sits under the simulation on every screen, so a thank-you
 * that stayed would follow the reader through the rest of it — an
 * acknowledgement on the first pass and clutter on every screen after. Long
 * enough to read twice, then gone.
 */
const THANKS_MS = 4000

export default function SimFeedback({ sim, majorName }) {
  const slug = sim.slug
  const askId = useId()
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')
  const [state, setState] = useState('asking')
  /* Read once, at mount, and kept — so that answering now still shows the
     thank-you, while having answered on some earlier visit shows nothing at
     all. A card thanking you for something you no longer remember doing is just
     clutter under a simulation you came back to for another reason. */
  const [answeredBefore] = useState(() => alreadyAnswered(slug))

  useEffect(() => {
    if (state !== 'done') return undefined
    const id = window.setTimeout(() => setState('gone'), THANKS_MS)
    return () => window.clearTimeout(id)
  }, [state])

  /* Nothing to post to, so nothing to ask. A form that silently throws its
     answers away is worse than no form — see docs/feedback.md for the setup. */
  if (!feedbackEnabled()) return null
  if (state === 'gone') return null
  if (answeredBefore && state === 'asking') return null

  if (state === 'done') {
    return (
      <aside className="simRate simRate--done" aria-live="polite">
        <p className="simRate__thanks">Thank you — that helps more than you would think.</p>
      </aside>
    )
  }

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

  return (
    <aside className="simRate">
      <form onSubmit={submit}>
        {/* The simulation's own name, because the rating is its own too — one
            per simulation, remembered per simulation, sent with its slug. Two
            of them belong to the same major and the question below is written
            from the major's name, so without this the card under the jaw and
            the card under the clinic are word for word the same and the reader
            is asked to rate "Dentistry" twice. */}
        <p className="simRate__eyebrow">{sim.title}</p>
        <h2 className="simRate__title" id={`${askId}-title`}>
          What do you make of it?
        </h2>

        {/* The number is one answer and the writing is the other, and neither is
            the price of the other. */}
        <div className="simRate__block">
          {/* The major's name as it is written on its own page — sim.major
              holds the URL slug, and "what english-language-literature is like"
              is not a sentence anybody should be shown.

              A paragraph the scale points at rather than a <legend>: the
              question a screen reader announces for this group should be the
              one printed above it, and a legend's own box is awkward to place
              without a fieldset border to hang it on. */}
          <p className="simRate__ask" id={`${askId}-scale`}>
            {majorName
              ? `Is this a good way to see what ${majorName} is like?`
              : 'Is this a good way to see what the subject is like?'}
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
            placeholder="What is working, what is not, what confused you, what you wanted more of. Write as much or as little as you like."
          />
        </label>

        <div className="simRate__foot">
          <button type="submit" className="simRate__send" disabled={!canSend || state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send'}
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
    </aside>
  )
}
