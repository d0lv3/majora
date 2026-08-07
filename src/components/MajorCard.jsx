import { Link } from 'react-router-dom'
import { fieldLabel, isAvailable } from '../data/majors.js'
import './MajorCard.css'

/**
 * One major, as a near-square tile. At rest it shows only the field and the
 * name — the grid should be scannable. Hover/focus brings up the one-line
 * summary so a student can triage without opening every page.
 *
 * Majors that are not written up yet render as a dimmed, non-interactive
 * tile rather than being hidden: the shelf keeps its real shape, and nobody
 * clicks through into an empty page.
 */
export default function MajorCard({ major, index = 0, to }) {
  const ready = isAvailable(major)

  const inner = (
    <>
      <span className="mcard__num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <svg className="mcard__glyph" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 6 L94 50 L50 94 L6 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 26 L74 50 L50 74 L26 50 Z" fill="currentColor" opacity="0.5" />
      </svg>

      <span className="mcard__field">{fieldLabel(major.field)}</span>

      <span className="mcard__body">
        <span className="mcard__name">{major.name}</span>
        <span className="mcard__tagline">{major.tagline}</span>
      </span>

      <span className="mcard__foot">
        <span className="mcard__years">{major.years} years</span>
        {ready ? (
          <span className="mcard__go" aria-hidden="true">
            →
          </span>
        ) : (
          <span className="mcard__soon">Coming soon</span>
        )}
      </span>
    </>
  )

  if (!ready) {
    return (
      <div className="mcard mcard--soon" aria-label={`${major.name}, coming soon`}>
        {inner}
      </div>
    )
  }

  return (
    <Link to={to ?? `/app/${major.slug}`} className="mcard" aria-label={`Open ${major.name}`}>
      {inner}
    </Link>
  )
}
