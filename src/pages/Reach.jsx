import { useMemo, useState } from 'react'

import CornerLines from '../components/decor/CornerLines.jsx'
import ReachCard from '../components/reach/ReachCard.jsx'
import ReachDialog from '../components/reach/ReachDialog.jsx'
import { getMajor } from '../data/majors.js'
import { PEOPLE, majorsOf, schoolId, schoolsOf } from '../data/reach.js'
import './Reach.css'

/**
 * Reach — the people, and the two ways of narrowing them.
 *
 * The library's ground and the library's toolbar, because this is the same
 * product and the second place a reader lands in it. What it does not copy is
 * the search box: two filters over a handful of people is the whole of it, and
 * a search field on a page of six cards is a control that mostly returns
 * everything.
 *
 * Both filters are built from the people rather than from the registries. A
 * chip for a university nobody here studied at would be a chip that can only
 * ever empty the page.
 */

/* What was chosen, kept across a visit to somebody's major and back — the same
   reason the library keeps its own, and the same shape. See LEFT_AS there. */
const LEFT_AS = { major: 'all', school: 'all' }

export default function Reach() {
  const [major, setMajor] = useState(LEFT_AS.major)
  const [school, setSchool] = useState(LEFT_AS.school)
  /* The person being booked, or null. One dialog for the page rather than one
     per card: only ever one is open, and a modal per card is a modal per card
     to keep in step. */
  const [booking, setBooking] = useState(null)

  LEFT_AS.major = major
  LEFT_AS.school = school

  const majorCounts = useMemo(() => majorsOf(PEOPLE), [])
  const schools = useMemo(() => schoolsOf(PEOPLE), [])

  const results = useMemo(
    () =>
      PEOPLE.filter((person) => {
        const byMajor = major === 'all' || person.majors.includes(major)
        const bySchool = school === 'all' || person.study.some((s) => schoolId(s) === school)
        return byMajor && bySchool
      }),
    [major, school],
  )

  const chosenMajor = major === 'all' ? null : getMajor(major)
  const chosenSchool = school === 'all' ? null : schools.find((s) => s.id === school)

  return (
    <div className="reach">
      <CornerLines className="reach__lines" stroke="rgba(65, 43, 99, 0.12)" />

      <header className="reach__head shell">
        <span className="eyebrow eyebrow--dark">Reach</span>
        <h1 className="reach__title">Ask someone who is already in it.</h1>
        <p className="reach__lede">
          A write-up cannot be asked a follow-up. These are students and graduates of the majors in
          the library, and you can book time with one of them — a call, half an hour or an hour, to
          ask the things nobody puts in a prospectus.
        </p>
      </header>

      <div className="shell">
        <div className="toolbar reach__toolbar">
          <div className="reach__filterRow" role="group" aria-label="Filter by major">
            <span className="reach__filterLabel" id="reach-major">
              Major
            </span>
            <div className="filters reach__filters" aria-labelledby="reach-major">
              <button
                type="button"
                className={`filter ${major === 'all' ? 'is-on' : ''}`}
                aria-pressed={major === 'all'}
                onClick={() => setMajor('all')}
              >
                Everyone
                <span className="filter__count">{PEOPLE.length}</span>
              </button>
              {[...majorCounts].map(([slug, count]) => (
                <button
                  type="button"
                  key={slug}
                  className={`filter ${major === slug ? 'is-on' : ''}`}
                  aria-pressed={major === slug}
                  onClick={() => setMajor(slug)}
                >
                  {getMajor(slug)?.name ?? slug}
                  <span className="filter__count">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* A menu rather than chips, and the two filters are not the same
              shape for a reason: there are a handful of majors and there is one
              university per person in the country. Pills for that would be a
              wall of them, growing every time somebody joins from somewhere
              new, and a wall of pills is a list you have to read all of. */}
          <div className="reach__filterRow">
            <label className="reach__filterLabel" htmlFor="reach-school">
              University
            </label>
            <div className="reach__selectWrap">
              <select
                id="reach-school"
                className="reach__select"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option value="all">Anywhere</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.count})
                  </option>
                ))}
              </select>
              <svg className="reach__selectArrow" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m7 10 5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <p className="reach__count" aria-live="polite">
          {results.length} {results.length === 1 ? 'person' : 'people'}
          {chosenMajor && ` in ${chosenMajor.name}`}
          {chosenSchool && ` at ${chosenSchool.name}`}
        </p>

        {results.length > 0 ? (
          <ul className="reach__grid">
            {results.map((person, i) => (
              <li key={person.id} style={{ '--card-i': Math.min(i, 11) }}>
                <ReachCard person={person} index={i} onReach={setBooking} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="reach__empty">
            <span className="reach__emptyMark" aria-hidden="true" />
            <h2>Nobody here yet</h2>
            {/* Says which pair of filters emptied it, because with two of them
                the reader cannot tell which one to loosen. */}
            <p>
              {chosenMajor && chosenSchool
                ? `Nobody on Reach studied ${chosenMajor.name} at ${chosenSchool.name}. Loosen one of the two and there may well be somebody.`
                : 'Reach is new and small. As more students join, this page fills out.'}
            </p>
            <button
              type="button"
              className="btn btn--outline-dark"
              onClick={() => {
                setMajor('all')
                setSchool('all')
              }}
            >
              Show everyone
            </button>
          </div>
        )}

      </div>

      <ReachDialog person={booking} onClose={() => setBooking(null)} />
    </div>
  )
}
