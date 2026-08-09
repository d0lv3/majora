import { Link, useParams, useNavigate } from 'react-router-dom'

import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import MajorCard from '../components/MajorCard.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import { MAJORS, getMajor, fieldLabel, isAvailable } from '../data/majors.js'
import { branchesFor } from '../data/branches.js'
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
  // Some majors are a department rather than one course; those list what is
  // inside them. Most have no branches and this whole section disappears.
  const branches = branchesFor(slug)
  const readyBranches = branches.filter((b) => b.ready).length

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

      {branches.length > 0 && (
        <section className="section mdetail__branches">
          <div className="shell">
            <Reveal>
              <span className="eyebrow eyebrow--dark">Inside the department</span>
              <h2 className="mdetail__branchesTitle">
                {major.name} is {branches.length} different courses wearing one name.
              </h2>
              <p className="mdetail__branchesLede">
                You apply to the department, then spend four years inside one of these. They lead
                to different work, so they are worth telling apart before you arrive.{' '}
                {readyBranches === 1
                  ? 'One is written up so far; the rest are listed because leaving them out would make the degree look smaller than it is.'
                  : `${readyBranches} are written up so far.`}
              </p>
            </Reveal>

            <ul className="branchList">
              {branches.map((b, i) =>
                b.ready ? (
                  <Reveal as="li" key={b.slug} delay={i * 60}>
                    <Link to={`/app/${slug}/${b.slug}`} className="branch branch--open">
                      <span className="branch__head">
                        <span className="branch__name">{b.name}</span>
                        <span className="branch__tag">Open</span>
                      </span>
                      <span className="branch__blurb">{b.blurb}</span>
                      <span className="branch__go">
                        Read the guide<span aria-hidden="true"> →</span>
                      </span>
                    </Link>
                  </Reveal>
                ) : (
                  <Reveal as="li" key={b.slug} delay={i * 60}>
                    {/* Not a link, and not styled like one: a card that looks
                        clickable and is not is worse than a plain panel. */}
                    <div className="branch branch--soon">
                      <span className="branch__head">
                        <span className="branch__name">{b.name}</span>
                        <span className="branch__tag branch__tag--soon">Coming soon</span>
                      </span>
                      <span className="branch__blurb">{b.blurb}</span>
                    </div>
                  </Reveal>
                ),
              )}
            </ul>
          </div>
        </section>
      )}

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
