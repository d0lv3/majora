import { Link, useParams, useNavigate } from 'react-router-dom'

import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import MajorCard from '../components/MajorCard.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import { MAJORS, getMajor, fieldLabel, isAvailable } from '../data/majors.js'
import './MajorDetail.css'

export default function MajorDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const major = getMajor(slug)

  // Unknown slug, or a major that is still being written: both dead-end here
  // rather than rendering a page with nothing on it.
  if (!major || !isAvailable(major)) {
    return (
      <div className="mdetail mdetail--missing">
        <div className="shell">
          <span className="eyebrow">{major ? 'Coming soon' : 'Not found'}</span>
          <h1>
            {major
              ? `${major.name} is not written up yet.`
              : 'That major is not in the library yet.'}
          </h1>
          <p className="mdetail__missingText">
            {major
              ? 'It is on the shelf, and it is next in line. In the meantime the majors that are open go into the same depth this one will.'
              : 'Check the spelling, or browse the shelf to find what you were after.'}
          </p>
          <Link to="/app" className="btn btn--ghost">
            Back to the library
          </Link>
        </div>
      </div>
    )
  }

  const related = MAJORS.filter((m) => m.field === major.field && m.slug !== major.slug).slice(0, 4)

  const blocks = [
    { key: 'studies', label: 'What you will study', items: major.studies },
    { key: 'skills', label: 'Skills you will build', items: major.skills },
    { key: 'careers', label: 'Where it leads', items: major.careers },
  ]

  return (
    <div className="mdetail">
      <header className="mdetail__head">
        <Lattice className="mdetail__lattice" size={78} color="rgba(255,255,255,0.06)" />

        <div className="shell mdetail__headInner">
          <Link to="/app" className="mdetail__back">
            ← The library
          </Link>

          <span className="eyebrow">{fieldLabel(major.field)}</span>
          <h1 className="mdetail__title">{major.name}</h1>
          <p className="mdetail__tagline">{major.tagline}</p>

          <dl className="mdetail__meta">
            <div>
              <dt>Length</dt>
              <dd>{major.years} years</dd>
            </div>
            <div>
              <dt>Field</dt>
              <dd>{fieldLabel(major.field)}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>Kurdistan, Iraq</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="section mdetail__body">
        <div className="shell mdetail__grid">
          {blocks.map((block, i) => (
            <Reveal className="mblock" key={block.key} delay={i * 90}>
              <h2 className="mblock__label">
                <span className="mblock__diamond" aria-hidden="true" />
                {block.label}
              </h2>
              <ul className="mblock__list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="shell">
          <Reveal className="fitcard">
            <span className="fitcard__tag">Is it for you?</span>
            <p className="fitcard__text">{major.fitIf}</p>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section mdetail__related">
          <div className="shell">
            <h2 className="mdetail__relatedTitle">
              Others in {fieldLabel(major.field)}
            </h2>
            <ul className="mdetail__relatedGrid">
              {related.map((m, i) => (
                <li key={m.slug}>
                  <MajorCard major={m} index={i} />
                </li>
              ))}
            </ul>

            <div className="mdetail__cta">
              <SpecularButton {...SB.ghost} size="md" onClick={() => navigate('/app')}>
                Back to all {MAJORS.length} majors
                <span className="sb-arrow" aria-hidden="true">
                  →
                </span>
              </SpecularButton>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
