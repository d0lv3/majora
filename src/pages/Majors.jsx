import { useMemo, useState } from 'react'

import MajorCard from '../components/MajorCard.jsx'
import CornerLines from '../components/decor/CornerLines.jsx'
import students from '../assets/people_with_different_majors.png'
import { MAJORS, FIELDS, countByField, isAvailable } from '../data/majors.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Majors.css'

const READY_COUNT = MAJORS.filter(isAvailable).length

export default function Majors() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [field, setField] = useState('all')

  const counts = useMemo(() => countByField(), [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (
      MAJORS.filter((major) => {
        const matchesField = field === 'all' || major.field === field
        const matchesQuery =
          !q ||
          major.name.toLowerCase().includes(q) ||
          major.tagline.toLowerCase().includes(q) ||
          major.careers.some((c) => c.toLowerCase().includes(q))
        return matchesField && matchesQuery
      })
        // the majors you can actually open lead, so nobody has to hunt for them
        .sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)))
    )
  }, [query, field])

  const readyHere = results.filter(isAvailable).length
  const firstName = (user?.name || 'there').split(' ')[0]

  return (
    <div className="library">
      {/* the same route lines as the hero, in the same light-surface tint */}
      <CornerLines className="library__lines" stroke="rgba(65, 43, 99, 0.12)" />

      <header className="library__head shell">
        <span className="eyebrow eyebrow--dark">Welcome, {firstName}</span>
        <h1 className="library__title">The library</h1>
        <p className="library__lede">
          Every major, one card each. {READY_COUNT} are written up and open now; the rest are on
          the shelf so you can see the full picture while we fill them in.
        </p>
      </header>

      {/* The artwork gets the full width and its whole height rather than
          being cropped into a backdrop: it is a picture of people holding the
          tools of different majors, on the page that lists them, so it is
          worth seeing. The toolbar below rides up over its lower edge, the
          way the hero's feature bar sits on the hero art. */}
      <figure className="library__art">
        <img
          src={students}
          alt="Six students holding the tools of their majors, under icons for medicine, data, computing, law, engineering and art"
          width="1717"
          height="827"
        />
      </figure>

      {/* One card holding search and filters, built like the hero's feature
          bar: translucent white, so the artwork behind its top edge ghosts
          through it. */}
      <div className="shell">
        <div className="toolbar">
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="search__icon">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a major, or a job it leads to…"
              aria-label="Search majors"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')}>
                Clear
              </button>
            )}
          </div>

          <div className="filters" role="group" aria-label="Filter by field">
            <button
              type="button"
              className={`filter ${field === 'all' ? 'is-on' : ''}`}
              aria-pressed={field === 'all'}
              onClick={() => setField('all')}
            >
              All fields
              <span className="filter__count">{MAJORS.length}</span>
            </button>

            {FIELDS.map((f) => (
              <button
                type="button"
                key={f.id}
                className={`filter ${field === f.id ? 'is-on' : ''}`}
                aria-pressed={field === f.id}
                onClick={() => setField(f.id)}
              >
                {f.label}
                <span className="filter__count">{counts.find((c) => c.id === f.id)?.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <p className="library__count" aria-live="polite">
          {results.length} {results.length === 1 ? 'major' : 'majors'}
          {field !== 'all' && ` in ${FIELDS.find((f) => f.id === field)?.label}`}
          <span className="library__ready">
            {readyHere > 0 ? `${readyHere} open now` : 'none open yet'}
          </span>
        </p>

        {results.length > 0 ? (
          <ul className="library__grid">
            {results.map((major, i) => (
              // --card-i staggers the entrance; capped so card 40 does not
              // arrive a full two seconds after card 1
              <li key={major.slug} style={{ '--card-i': Math.min(i, 11) }}>
                <MajorCard major={major} index={i} tone="light" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="library__empty">
            <span className="library__emptyMark" aria-hidden="true" />
            <h2>Nothing matches “{query}”</h2>
            <p>
              Try a broader word: a subject you like, or the kind of work you imagine doing.
            </p>
            <button
              type="button"
              className="btn btn--outline-dark"
              onClick={() => {
                setQuery('')
                setField('all')
              }}
            >
              Reset the library
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
