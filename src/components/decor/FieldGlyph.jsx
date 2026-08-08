/**
 * One line-drawing per field, used as the large faint mark in the corner of
 * every major card. A card already names its field in words; this is so the
 * grid can be read by shape while scrolling, and so two majors in the same
 * field look like siblings before you have read either label.
 *
 * All ten share a 100x100 box, an unfilled stroke of the same weight, and
 * round caps, so they carry equal visual weight at the size the card renders
 * them. Anything with a solid fill would read as a heavier field.
 *
 * The subjects follow the ones in the students illustration on the library
 * page (stethoscope, code, bank, scales, gear, palette) so the two agree.
 */

const GLYPHS = {
  /* a heart with a trace across it */
  health: (
    <>
      <path d="M50 79C50 79 21 62 21 43c0-10 8-17 17-17 5 0 10 3 12 7 2-4 7-7 12-7 9 0 17 7 17 17 0 19-29 36-29 36Z" />
      <path d="M26 47h13l5-9 8 18 5-9h14" />
    </>
  ),

  /* a gear: hub, rim, and eight teeth */
  engineering: (
    <>
      <circle cx="50" cy="50" r="13" />
      <circle cx="50" cy="50" r="28" />
      <path d="M50 22V12M50 88V78M78 50h10M12 50h10M69.8 30.2l7.1-7.1M23.1 76.9l7.1-7.1M69.8 69.8l7.1 7.1M23.1 23.1l7.1 7.1" />
    </>
  ),

  /* angle brackets and a slash */
  computing: (
    <>
      <path d="M38 33 18 51l20 18M62 33l20 18-20 18" />
      <path d="M56 27 45 75" />
    </>
  ),

  /* an atom: nucleus and two crossed orbits */
  sciences: (
    <>
      <circle cx="50" cy="50" r="7" />
      <ellipse cx="50" cy="50" rx="34" ry="14" transform="rotate(30 50 50)" />
      <ellipse cx="50" cy="50" rx="34" ry="14" transform="rotate(-30 50 50)" />
    </>
  ),

  /* three columns rising off a baseline */
  business: (
    <>
      <path d="M18 80h64" />
      <path d="M30 80V58M50 80V44M70 80V30" />
      <path d="M28 46l20-12 22-14" />
    </>
  ),

  /* scales of justice */
  society: (
    <>
      <path d="M50 24v52M34 78h32M22 34h56" />
      <path d="M50 30v4" />
      <path d="M10 52a12 12 0 0 0 24 0M66 52a12 12 0 0 0 24 0" />
      <path d="M22 34 10 52M22 34l12 18M78 34 66 52M78 34l12 18" />
    </>
  ),

  /* an open book */
  humanities: (
    <>
      <path d="M50 33c-8-6-20-8-32-6v45c12-2 24 0 32 6 8-6 20-8 32-6V27c-12-2-24 0-32 6Z" />
      <path d="M50 33v45" />
    </>
  ),

  /* a mortarboard */
  education: (
    <>
      <path d="M50 25 87 42 50 59 13 42l37-17Z" />
      <path d="M28 50v17c0 5 44 5 44 0V50" />
      <path d="M87 42v20" />
    </>
  ),

  /* a painter's palette */
  arts: (
    <>
      <path d="M50 20c19 0 35 13 35 30 0 9-7 13-13 13-5 0-9 3-8 8 1 6-4 9-14 9-19 0-35-14-35-30S31 20 50 20Z" />
      <circle cx="36" cy="41" r="4" />
      <circle cx="52" cy="34" r="4" />
      <circle cx="67" cy="44" r="4" />
    </>
  ),

  /* a sprout */
  agriculture: (
    <>
      <path d="M50 84V44" />
      <path d="M50 58c-14 0-24-10-24-24 14 0 24 10 24 24Z" />
      <path d="M50 48c14 0 24-10 24-24-14 0-24 10-24 24Z" />
    </>
  ),
}

/* The old card mark, kept for any field id that has no drawing yet. Better a
   brand diamond than an empty corner. */
const FALLBACK = (
  <>
    <path d="M50 8 92 50 50 92 8 50Z" />
    <path d="M50 28 72 50 50 72 28 50Z" />
  </>
)

export default function FieldGlyph({ field, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[field] ?? FALLBACK}
    </svg>
  )
}

export { GLYPHS as FIELD_GLYPHS }
