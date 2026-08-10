import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import MajorCard from '../components/MajorCard.jsx'
import CornerLines from '../components/decor/CornerLines.jsx'
import students from '../assets/people_with_different_majors.png'
import { MAJORS, FIELDS, countByField, isAvailable } from '../data/majors.js'
import { mappedMajorSlugs, searchUniversities } from '../data/mapData.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Majors.css'

const READY_COUNT = MAJORS.filter(isAvailable).length
const MAPPED_COUNT = mappedMajorSlugs().length

/**
 * What was typed and which field was chosen, kept outside the component.
 *
 * Opening a major unmounts this page, and a search that has to be retyped
 * every time a reader looks at one of its results is not a search — it is a
 * reason to stop looking. A module-level object rather than the URL because
 * the reader never asked for a shareable link to a filter, and rather than
 * sessionStorage because a genuine reload should hand back a clean library.
 *
 * ScrollManager in App.jsx does the other half: where the page was left.
 */
const LEFT_AS = { query: '', field: 'all' }

export default function Majors() {
  const { user } = useAuth()
  const [query, setQuery] = useState(LEFT_AS.query)
  const [field, setField] = useState(LEFT_AS.field)

  useEffect(() => {
    LEFT_AS.query = query
    LEFT_AS.field = field
  }, [query, field])

  const counts = useMemo(() => countByField(), [])

  // Universities are searched alongside majors rather than behind a mode
  // switch: nobody wants to declare what kind of thing they are about to
  // type. The two rarely collide, and where they do — "Technology" is both a
  // subject and a university — the union is what the reader wanted anyway.
  const universities = useMemo(() => searchUniversities(query), [query])

  const taughtHere = useMemo(
    () => new Set(universities.flatMap((u) => u.majorSlugs)),
    [universities],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (
      MAJORS.filter((major) => {
        const matchesField = field === 'all' || major.field === field
        const matchesQuery =
          !q ||
          major.name.toLowerCase().includes(q) ||
          major.tagline.toLowerCase().includes(q) ||
          major.careers.some((c) => c.toLowerCase().includes(q)) ||
          taughtHere.has(major.slug)
        return matchesField && matchesQuery
      })
        // the majors you can actually open lead, so nobody has to hunt for them
        .sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)))
    )
  }, [query, field, taughtHere])

  const readyHere = results.filter(isAvailable).length
  const named = universities[0]
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
              placeholder="Search a major, a job, or a university…"
              aria-label="Search majors, jobs and universities"
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
        {/* What a university match can and cannot answer, said before the
            cards rather than left to be inferred from them. Departments are
            on record for three subjects so far, so a short list here means
            "we have not mapped the rest yet" and never "this place teaches
            three things". */}
        {named && (
          <aside className="uniHit" aria-live="polite">
            <span className="uniHit__mark" aria-hidden="true" />
            <div className="uniHit__body">
              <p className="uniHit__name">
                {named.name}
                {universities.length > 1 && (
                  <span className="uniHit__more">
                    {' '}
                    +{universities.length - 1} more matching “{query.trim()}”
                  </span>
                )}
              </p>
              <p className="uniHit__meta">
                {named.nameLocal} · {named.city}, {named.governorate} ·{' '}
                {named.kind === 'public' ? 'Public' : 'Private'}
              </p>
              {/* Counted for whoever the sentence is about. With one match
                  that is the named university and its own total; with several
                  it is the set, because the union of three universities'
                  departments is not a claim any one of them can carry. */}
              <p className="uniHit__note">
                {universities.length === 1 ? (
                  named.majorSlugs.length > 0 ? (
                    <>
                      Teaching {named.majorSlugs.length} of the {MAPPED_COUNT} majors whose
                      departments we have mapped so far
                      {results.length > 0 && ', shown below'}. Where the other{' '}
                      {MAJORS.length - MAPPED_COUNT} are taught is not on record yet.
                    </>
                  ) : (
                    <>
                      On record as an institution, but none of the {MAPPED_COUNT} majors we have
                      mapped are taught here. That is a gap in our data, not a statement about the
                      university.
                    </>
                  )
                ) : taughtHere.size > 0 ? (
                  <>
                    Between them they teach {taughtHere.size} of the {MAPPED_COUNT} majors whose
                    departments we have mapped so far
                    {results.length > 0 && ', shown below'}. Where the other{' '}
                    {MAJORS.length - MAPPED_COUNT} are taught is not on record yet.
                  </>
                ) : (
                  <>
                    Between them they teach none of the {MAPPED_COUNT} majors we have mapped. That
                    is a gap in our data, not a statement about these universities.
                  </>
                )}{' '}
                <Link to="/app/map" className="uniHit__link">
                  See {universities.length === 1 ? 'it' : 'them'} on the map
                </Link>
              </p>
            </div>
          </aside>
        )}

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
            {/* A university can match and still leave the grid empty, and
                "nothing matches" would then contradict the card above it. */}
            {named && taughtHere.size > 0 ? (
              /* The university does teach mapped majors — the field filter is
                 what emptied the grid. Saying "nothing matches" here would
                 blame the search for the filter's doing. */
              <>
                <h2>Nothing in {FIELDS.find((f) => f.id === field)?.label} here</h2>
                <p>
                  {universities.length === 1
                    ? `${named.name} teaches`
                    : 'These universities teach'}{' '}
                  {taughtHere.size} of the majors we have mapped, but none of them sit in that
                  field. Clear the filter to see {taughtHere.size === 1 ? 'it' : 'them'}.
                </p>
              </>
            ) : named ? (
              /* Not reachable while the registry is built out of the
                 department lists, since every institution in it teaches
                 something. It is here so that adding a university on its own
                 says so, rather than reading as "no such place". */
              <>
                <h2>
                  We found the {universities.length === 1 ? 'university' : 'universities'}, not
                  their majors
                </h2>
                <p>
                  {universities.length === 1 ? `${named.name} is` : 'They are'} on record, but none
                  of the {MAPPED_COUNT} majors we have mapped are taught there yet. Try a subject
                  instead, or open the map to see the universities we do have departments for.
                </p>
              </>
            ) : (
              <>
                <h2>Nothing matches “{query}”</h2>
                <p>
                  Try a broader word: a subject you like, the kind of work you imagine doing, or a
                  university you are considering.
                </p>
              </>
            )}
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
