/**
 * A drawing of the subject, behind the head of a major's page.
 *
 * Only the majors that are written up carry one — a motif on a page with
 * nothing behind it would be decoration promising depth that is not there — so
 * this returns null for everything else and the head keeps the lattice alone.
 *
 * Drawn to be cropped. Each one is composed to bleed off the top and bottom of
 * the header at the size it is rendered, so what the reader sees is a detail of
 * something larger rather than a small complete picture floating in a corner:
 * the tooth is cut by both edges, the shield runs past them, the open book runs
 * off the bottom. That is the whole reason the viewBox is square and the CSS
 * scales it well past the header's height.
 *
 * Stroked in currentColor at a low opacity set by the stylesheet, so the motif
 * belongs to the purple rather than sitting on it, and marked aria-hidden: it
 * repeats the name of the major, which is already an h1 two inches to the left.
 */

const MOTIFS = {
  /* A molar in section: crown, the enamel line across it, and two roots. */
  dentistry: (
    <>
      <path d="M100 24c-22 0-34 12-46 12S30 28 22 34c-10 8-10 26-6 44 5 22 8 34 10 52 2 16 4 34 12 42 6 6 14 4 17-6 4-13 5-30 7-44 2-11 5-18 12-18" />
      <path d="M100 24c22 0 34 12 46 12s24-8 32-2c10 8 10 26 6 44-5 22-8 34-10 52-2 16-4 34-12 42-6 6-14 4-17-6-4-13-5-30-7-44-2-11-5-18-12-18" />
      <path d="M40 78c14 6 26 9 60 9s46-3 60-9" opacity="0.55" />
      <path d="M74 132c8 10 12 26 13 42" opacity="0.4" />
      <path d="M126 132c-8 10-12 26-13 42" opacity="0.4" />
    </>
  ),

  /* A shield with a keyhole, and the circuit traces that make it this
     subject's shield rather than any other's. */
  cybersecurity: (
    <>
      <path d="M100 12 34 40v58c0 44 30 76 66 90 36-14 66-46 66-90V40z" />
      <path d="M100 34 52 54v44c0 34 22 58 48 69 26-11 48-35 48-69V54z" opacity="0.5" />
      <circle cx="100" cy="96" r="15" />
      <path d="M100 111v26" />
      <path d="M34 68H8M34 96H14M34 124h-18" opacity="0.45" />
      <path d="M166 68h26M166 96h20M166 124h18" opacity="0.45" />
      <circle cx="8" cy="68" r="4" opacity="0.45" />
      <circle cx="192" cy="124" r="4" opacity="0.45" />
    </>
  ),

  /* An open book, the spine down the middle, with the leaves of the pages
     running off the bottom edge. */
  'english-language-literature': (
    <>
      <path d="M100 46c-16-14-40-22-70-22v112c30 0 54 8 70 22 16-14 40-22 70-22V24c-30 0-54 8-70 22z" />
      <path d="M100 46v112" />
      <path d="M46 56c14 2 26 6 36 12M46 82c14 2 26 6 36 12M46 108c14 2 26 6 36 12" opacity="0.45" />
      <path d="M154 56c-14 2-26 6-36 12M154 82c-14 2-26 6-36 12M154 108c-14 2-26 6-36 12" opacity="0.45" />
      <path d="M18 158c30 0 60 8 82 26 22-18 52-26 82-26" opacity="0.5" />
      <path d="M8 178c34 0 68 8 92 28 24-20 58-28 92-28" opacity="0.3" />
    </>
  ),
}

export default function MajorMotif({ slug, className }) {
  const motif = MOTIFS[slug]
  if (!motif) return null

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {motif}
    </svg>
  )
}
