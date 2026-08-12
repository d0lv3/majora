import { useEffect, useState } from 'react'

import { feedbackEnabled, loadReviews } from '../lib/feedback.js'
import './SimReviews.css'

/**
 * What other students said about this simulation, under it.
 *
 * The other half of the card above: readers were being asked for an opinion and
 * then never shown anybody else's. The answers went into a Sheet and stopped
 * there, which makes the question feel like a survey rather than a place where
 * people say what they think.
 *
 * WHAT IS SHOWN AND WHAT IS NOT
 *
 * Only submissions that carry words. A bare 4-out-of-5 is worth counting and is
 * not worth a row of its own — so the numbers make the average and the writing
 * makes the list. Nothing that identifies anybody is sent in the first place, so
 * there is nothing here to attribute: no names, no avatars, and none of the
 * theatre of a review site.
 *
 * WHEN IT SHOWS NOTHING
 *
 * A simulation nobody has written about yet renders nothing at all rather than
 * an empty box announcing that nobody has written about it. Same for a request
 * that fails or an endpoint that is not configured: the page simply carries on.
 * Reviews are a bonus on this page, never the point of it, and a broken one must
 * cost the reader nothing.
 *
 * MODERATION LIVES IN THE SHEET
 *
 * The script only returns rows whose `Show` column is not FALSE, so hiding
 * something is one cell in the Sheet. That is the whole moderation story and it
 * is deliberately outside the code — see docs/feedback.md.
 */

const DAY = 86400000

/** Roughly when, which is all anybody needs of a review's date. */
function when(iso) {
  const at = new Date(iso)
  if (Number.isNaN(at.getTime())) return ''
  const days = Math.floor((Date.now() - at.getTime()) / DAY)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return 'last week'
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`
  return at.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function SimReviews({ sim }) {
  const slug = sim.slug
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    if (!feedbackEnabled()) return undefined
    let alive = true
    /* A failure is silence, not a message. The reader came for the simulation
       and an apology for a Sheet they have never heard of is noise. */
    loadReviews(slug)
      .then((list) => alive && setReviews(list))
      .catch(() => alive && setReviews([]))
    return () => {
      alive = false
    }
  }, [slug])

  if (!reviews?.length) return null

  const rated = reviews.filter((r) => typeof r.rating === 'number' && r.rating >= 1)
  const written = reviews.filter((r) => (r.comment ?? '').trim() !== '')
  if (!written.length) return null

  const average = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : null

  return (
    <section className="simSaid" aria-label={`What students said about ${sim.title}`}>
      <header className="simSaid__head">
        <h2 className="simSaid__title">What other students said</h2>
        {average && (
          <p className="simSaid__score">
            <span className="simSaid__avg">{average}</span>
            <span className="simSaid__outOf">out of 5</span>
            <span className="simSaid__count">
              {rated.length} {rated.length === 1 ? 'rating' : 'ratings'}
            </span>
          </p>
        )}
      </header>

      <ul className="simSaid__list">
        {written.map((r, i) => (
          <li className="simSaid__item" key={`${r.at}-${i}`}>
            <p className="simSaid__text">{r.comment}</p>
            <p className="simSaid__meta">
              {typeof r.rating === 'number' && r.rating >= 1 && (
                <span className="simSaid__stars" aria-label={`${r.rating} out of 5`}>
                  {'★'.repeat(r.rating)}
                  <span className="simSaid__starsOff" aria-hidden="true">
                    {'★'.repeat(5 - r.rating)}
                  </span>
                </span>
              )}
              <span className="simSaid__when">{when(r.at)}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
