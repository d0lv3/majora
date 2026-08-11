import { useState } from 'react'

import { alreadyAnswered, feedbackEnabled, rememberAnswered, sendFeedback } from '../lib/feedback.js'
import './SimFeedback.css'

/**
 * The one question asked at the end of a simulation.
 *
 * Placed after the closing screen rather than inside it, because the closing
 * screen is the last thing the simulation has to say and a form is not part of
 * it. By the time this appears the reader has finished; nothing here gates
 * anything, and skipping it costs them nothing.
 *
 * A white card on every ground. Three of the four simulations end on a dark
 * page and one on a light one, and a card that is always paper reads as the
 * site asking rather than the simulation continuing — the same trick the
 * network console's reading panel plays.
 *
 * IT ASKS ONCE
 *
 * Answered ratings are remembered per simulation in this browser, so replaying
 * Macbeth to see the other ending is not met with the same form again. That
 * also means one reader can only rate a simulation once from one browser, which
 * is the right trade: a nagging form gets closed, and a rating given twice is
 * not worth more than a rating given once.
 */

const SCALE = [
  { value: 1, label: 'Not really' },
  { value: 2, label: '' },
  { value: 3, label: 'It was fine' },
  { value: 4, label: '' },
  { value: 5, label: 'Genuinely useful' },
]

export default function SimFeedback({ sim, majorName }) {
  const slug = sim.slug
  const [rating, setRating] = useState(null)
  const [comment, setComment] = useState('')
  const [state, setState] = useState('asking')
  /* Read once, at mount, and kept — so that answering now still shows the
     thank-you, while having answered on some earlier visit shows nothing at
     all. A card thanking you for something you no longer remember doing is
     just clutter on a screen the reader came back to for another reason. */
  const [answeredBefore] = useState(() => alreadyAnswered(slug))

  /* Nothing to post to, so nothing to ask. A form that silently throws its
     answers away is worse than no form — see docs/feedback.md for the setup. */
  if (!feedbackEnabled()) return null
  if (answeredBefore && state === 'asking') return null

  if (state === 'done') {
    return (
      <aside className="simRate simRate--done" aria-live="polite">
        <p className="simRate__thanks">Thank you — that helps more than you would think.</p>
      </aside>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    if (rating === null || state === 'sending') return
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
        <p className="simRate__eyebrow">Before you go</p>
        {/* The major's name as it is written on its own page — sim.major holds
            the URL slug, and "what english-language-literature is like" is not
            a sentence anybody should be shown. */}
        <h2 className="simRate__title">
          {majorName
            ? `Was this a good way to see what ${majorName} is like?`
            : 'Was this a good way to see what the subject is like?'}
        </h2>

        <div className="simRate__scale" role="group" aria-label="Rating out of five">
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

        <label className="simRate__field">
          <span>Anything you would change? (optional)</span>
          <textarea
            rows={3}
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was confusing, what was missing, what you liked."
          />
        </label>

        <div className="simRate__foot">
          <button type="submit" className="simRate__send" disabled={rating === null || state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send'}
          </button>
          <p className="simRate__note">
            Anonymous — the rating and your note, nothing that says who you are.
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
