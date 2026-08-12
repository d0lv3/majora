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
 * IT IS ALWAYS THERE
 *
 * It used to take itself away when there was nothing in it, on the grounds that
 * a box announcing that nobody has written anything is worse than no box. That
 * is true of a page nobody is building, and false of this one: a section that
 * vanishes when empty is indistinguishable from a section that is broken, which
 * is exactly the confusion it caused. It also meant the first student to reach a
 * simulation was never told that writing something was a thing people do here.
 *
 * So it renders under every simulation whatever the answer is — a list when
 * there is one, and a line saying so when there is not. A request that fails
 * lands on the same line: reviews are a bonus on this page and never the point
 * of it, and no reader should be handed an error about a Sheet they have never
 * heard of. The reason goes to the console in dev instead.
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
    /* No endpoint is the one case that stays quiet. "Nobody has written about
       this yet" would be a claim about a Sheet this build cannot reach, and
       inventing a silence is worse than keeping one. */
    if (!feedbackEnabled()) return undefined
    let alive = true
    /* A failure is silence, not a message. The reader came for the simulation
       and an apology for a Sheet they have never heard of is noise.

       Silent to the reader is not the same as silent to whoever is building
       this. Silence in both directions is how a broken endpoint looks exactly
       like a simulation nobody has written about yet: nothing renders, nothing
       is logged, and there is no thread to pull. So in dev it says so, with
       the reason — in the build the reader gets, it says nothing at all. */
    loadReviews(slug)
      .then((list) => alive && setReviews(list))
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.warn(`[reviews] nothing to show under "${slug}": ${err.message}`)
        }
        if (alive) setReviews([])
      })
    return () => {
      alive = false
    }
  }, [slug])

  if (!feedbackEnabled()) return null

  /* Still asking. Held apart from "asked, and there is nothing" so the reader
     is not told nobody has written anything and then handed four reviews a
     second later. */
  const loading = reviews === null
  const list = reviews ?? []

  const rated = list.filter((r) => typeof r.rating === 'number' && r.rating >= 1)
  const written = list.filter((r) => (r.comment ?? '').trim() !== '')

  const average = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : null

  return (
    <section
      className="simSaid"
      aria-label={`What students said about ${sim.title}`}
      aria-busy={loading}
    >
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

      {loading ? (
        <p className="simSaid__none">Reading what people wrote…</p>
      ) : written.length ? (
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
      ) : (
        /* Two different nothings. Ratings and no words is a simulation people
           have judged and not discussed; nothing at all is one nobody has
           reached yet, and that reader is the one worth inviting. */
        <p className="simSaid__none">
          {rated.length
            ? 'Nobody has written anything yet — only the ratings above.'
            : 'Nobody has written about this one yet. You could be the first.'}
        </p>
      )}
    </section>
  )
}
