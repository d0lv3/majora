/**
 * Sending a line of feedback to a Google Apps Script, and remembering that it
 * was sent.
 *
 * There is no API of our own behind the simulations, so the one thing this site
 * needs to collect — did that teach you anything — goes to a Sheet instead. The
 * endpoint is a Web App deployed from Apps Script; see docs/feedback.md for the
 * script itself and how to deploy it.
 *
 * WHY THE REQUEST LOOKS ODD
 *
 * Two constraints, both of them the browser's rather than Google's:
 *
 *   The content type is text/plain even though the body is JSON. Anything else
 *   makes this a "preflighted" request, the browser sends an OPTIONS first, and
 *   Apps Script does not answer OPTIONS — so the real request is never made.
 *   text/plain keeps it a simple request that goes straight out. Apps Script
 *   reads the raw body out of e.postData.contents and parses it there.
 *
 *   The mode is no-cors, so the reply comes back opaque and unreadable. Apps
 *   Script cannot attach the header that would let us read it, and asking for a
 *   readable response is what turns this back into a blocked request.
 *
 * WHAT THAT COSTS, SAID PLAINLY
 *
 * We learn that the request left the building, and never that it arrived. A
 * resolved promise here means the network accepted it, not that a row was
 * written. So this reports "sent" and not "saved", nothing downstream waits on
 * it, and a failure loses one rating rather than blocking a reader who has
 * already finished the simulation.
 */

const ENDPOINT = import.meta.env.VITE_FEEDBACK_URL

/** Whether an endpoint has been configured at build time. */
export const feedbackEnabled = () => Boolean(ENDPOINT)

const seenKey = (slug) => `majora.feedback.${slug}`

/** Whether this browser has already answered for this simulation. */
export function alreadyAnswered(slug) {
  try {
    return window.localStorage.getItem(seenKey(slug)) !== null
  } catch {
    return false
  }
}

/** Remember that it answered, so a second run does not ask again. */
export function rememberAnswered(slug) {
  try {
    window.localStorage.setItem(seenKey(slug), new Date().toISOString())
  } catch {
    /* Private browsing, or storage full. Not worth a broken thank-you. */
  }
}

/**
 * Post one rating.
 *
 * Deliberately carries nothing that identifies a reader: which simulation, a
 * number, whatever they chose to type, and when. The site knows the signed-in
 * email and does not send it — a rating is more honest when it is not attached
 * to a name, and a Sheet is not the place to put one either way.
 */
export async function sendFeedback({ slug, title, rating, comment }) {
  if (!ENDPOINT) throw new Error('No feedback endpoint is configured.')

  const body = JSON.stringify({
    slug,
    title,
    rating,
    comment: (comment ?? '').slice(0, 1000),
    at: new Date().toISOString(),
    /* Coarse enough to tell a phone from a laptop and nothing finer. */
    screen: typeof window === 'undefined' ? '' : `${window.innerWidth}x${window.innerHeight}`,
  })

  await fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  })
}
