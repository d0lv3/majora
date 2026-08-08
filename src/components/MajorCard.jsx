import { Link } from 'react-router-dom'
import FieldGlyph from './decor/FieldGlyph.jsx'
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
 *
 * `tone` picks the skin: "dark" (default) for the landing's purple sections,
 * "light" for the library, which sits on the hero's pale ground.
 */
export default function MajorCard({ major, index = 0, to, tone = 'dark' }) {
  const ready = isAvailable(major)
  const skin = tone === 'light' ? ' mcard--light' : ''

  const inner = (
    <>
      <span className="mcard__num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* the field's own drawing, so a run of cards in one field reads as a
          set before you have read a single label */}
      <FieldGlyph field={major.field} className="mcard__glyph" />

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
      <div className={`mcard mcard--soon${skin}`} aria-label={`${major.name}, coming soon`}>
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={to ?? `/app/${major.slug}`}
      className={`mcard${skin}`}
      aria-label={`Open ${major.name}`}
    >
      {inner}
    </Link>
  )
}
