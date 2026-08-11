import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import BrandLoader from '../components/BrandLoader.jsx'
import FieldGlyph from '../components/decor/FieldGlyph.jsx'
import { MAJORS, isAvailable, fieldLabel } from '../data/majors.js'
import { IRAQ_BOUNDS, collegesFor, isSampleMajor, mappedMajorSlugs } from '../data/mapData.js'
import './MajorMap.css'

/**
 * Where each major is actually taught.
 *
 * A major is a decision about a place as much as a subject: the same degree
 * in Duhok and in Basra is a different life. The library answers what a major
 * is; this answers where it is, and what it takes to get in.
 *
 * Only the majors that are written up are plottable, which is the same three
 * the library opens. The rest would put a pin on a page that does not exist.
 *
 * Leaflet is driven imperatively rather than through react-leaflet: one
 * dependency instead of two, and the marker layer is small enough that
 * rebuilding it on selection change is cheaper than reconciling it.
 */

/**
 * CARTO's Voyager basemap rather than standard OpenStreetMap tiles: blue
 * water, pale land and quiet roads, which is the look people mean by "like
 * Google Maps". Plain OSM paints its land a heavy beige and its parks a
 * strong green, and next to this page's near-white ground it read as a
 * brown rectangle dropped on the layout.
 *
 * Same OpenStreetMap data underneath, so both get credited. {r} is Leaflet's
 * retina token and pairs with detectRetina below.
 */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A pin drawn in CSS, so it inherits the brand rather than Leaflet's blue. */
function pinIcon(selected) {
  return L.divIcon({
    className: '',
    html: `<span class="pin${selected ? ' pin--on' : ''}"><i></i></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

export default function MajorMap() {
  const plottable = useMemo(() => {
    const slugs = new Set(mappedMajorSlugs())
    return MAJORS.filter((m) => isAvailable(m) && slugs.has(m.slug))
  }, [])

  // The picker groups by field, so a reader who knows they want something in
  // Computing can find it without reading past Health. Insertion order, which
  // is the order FIELDS declares — the same order the library filters use.
  const byField = useMemo(() => {
    const groups = new Map()
    for (const m of plottable) {
      if (!groups.has(m.field)) groups.set(m.field, [])
      groups.get(m.field).push(m)
    }
    return [...groups.entries()]
  }, [plottable])

  const [slug, setSlug] = useState(plottable[0]?.slug ?? '')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const major = useMemo(() => MAJORS.find((m) => m.slug === slug), [slug])
  const all = useMemo(() => (slug ? collegesFor(slug) : []), [slug])
  const sample = isSampleMajor(slug)
  /**
   * Which of this major's colleges the reader is asking about.
   *
   * Searched inside the chosen major rather than across the whole country:
   * the question this page answers is "who teaches dentistry", so narrowing it
   * to "who teaches dentistry in Duhok" is the same question with one more
   * word. A search that reached across majors would quietly change the subject.
   *
   * Four things match, because a student naming a college could mean any of
   * them: the university, the department inside it, the city, or the
   * governorate. The Arabic name is matched on the raw query rather than the
   * folded one — Arabic and Kurdish have no letter case to fold, and a student
   * typing جامعة بغداد should not have to know the English spelling first.
   */
  const colleges = useMemo(() => {
    const raw = query.trim()
    if (!raw) return all
    const q = raw.toLowerCase()
    return all.filter(
      (c) =>
        c.university.toLowerCase().includes(q) ||
        (c.universityAr ?? '').includes(raw) ||
        c.city.toLowerCase().includes(q) ||
        c.governorate.toLowerCase().includes(q) ||
        c.branches.some((b) =>
          `${b.department ?? ''} ${b.college ?? ''}`.toLowerCase().includes(q),
        ),
    )
  }, [all, query])

  const branchCount = useMemo(
    () => colleges.reduce((n, c) => n + c.branches.length, 0),
    [colleges],
  )
  // Read from the filtered set on purpose: a college the search has hidden
  // should not keep an open detail panel, nor hold the map at its coordinates.
  const selected = useMemo(
    () => colleges.find((c) => c.id === selectedId) ?? null,
    [colleges, selectedId],
  )

  const holderRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  /* Whether the basemap has actually arrived. Leaflet builds its panes
     immediately, so the map "exists" long before there is anything to look at
     — which is the difference between a map that is loading and the blank grey
     rectangle this page used to show while it did. */
  const [tiles, setTiles] = useState('loading')
  /* Bumped when the container is measured for the first time at a real size,
     to re-run the fit below against dimensions that mean something. */
  const [fitNonce, setFitNonce] = useState(0)
  const sizedRef = useRef(false)
  // Read inside Leaflet callbacks, which close over the state they were built
  // with; the ref is what lets a marker click see the current selection.
  const selectRef = useRef(setSelectedId)
  selectRef.current = setSelectedId

  /* ------------------------- the map, made once ------------------------ */
  useEffect(() => {
    if (!holderRef.current || mapRef.current) return undefined

    const map = L.map(holderRef.current, {
      // A wheel that zooms the map instead of scrolling the page is a trap on
      // a long page. Ctrl+wheel and the +/- control still zoom.
      scrollWheelZoom: false,
      // Leaflet puts +/- in the top-left, which is where the major's own tag
      // sits — the two overlapped, and the buttons won because Leaflet's
      // controls sit at z-index 1000. Moved rather than restyled: the tag
      // names what is on the map and wants that corner, and the buttons do
      // not care which corner they are in.
      zoomControl: false,
      attributionControl: true,
    })
    L.control.zoom({ position: 'topright' }).addTo(map)
    map.fitBounds(IRAQ_BOUNDS)

    /* The basemap is a third-party CDN, so it is the one part of this page
       that can be slow or simply not answer, and a reader should be told which
       rather than left looking at an empty frame wondering whether to wait.

       `load` is not "it worked" — it fires when every tile in view has
       finished, and a tile that 404s has finished. So the two are counted, and
       one tile arriving is enough to call the map usable: a patchy basemap is
       still a basemap, and only a total failure is worth a message. */
    let arrived = 0
    const tileLayer = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: 'abcd',
      detectRetina: true,
      maxZoom: 20,
    })
    tileLayer.on('tileload', () => {
      arrived += 1
    })
    tileLayer.on('load', () => setTiles(arrived > 0 ? 'ready' : 'error'))
    tileLayer.addTo(map)

    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  /* ------------------- markers follow the chosen major ----------------- */
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    layer.clearLayers()
    if (!colleges.length) return

    for (const college of colleges) {
      const marker = L.marker([college.lat, college.lng], {
        icon: pinIcon(college.id === selectedId),
        title: college.university,
        riseOnHover: true,
        keyboard: false,
      })
      marker.on('click', () => selectRef.current(college.id))
      marker.addTo(layer)
    }

    // selectedId, because the pins are redrawn to show which one is lit — and
    // for no other reason. Where the map looks is the next effect's business;
    // the two were one, and it meant every selection first flew out to fit the
    // whole major and then back in to the college, so choosing a second one
    // mid-flight read as the map zooming away from you.
  }, [colleges, selectedId, fitNonce])

  /* ---------------- the whole major, when the major changes ------------- */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !colleges.length) return
    map.fitBounds(
      colleges.map((c) => [c.lat, c.lng]),
      { padding: [48, 48], maxZoom: 8, animate: !prefersReducedMotion() },
    )
    // fitNonce, so that a fit computed against an unmeasured container is done
    // again once the container has been measured. See the ResizeObserver below.
  }, [colleges, fitNonce])

  /* --------------- selecting from the list moves the map --------------- */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected) return
    map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 9), {
      animate: !prefersReducedMotion(),
    })
  }, [selected])

  /**
   * Leaflet measures its container once, when it is made.
   *
   * That measurement is taken inside a grid that has not settled, and on a
   * cold navigation it can be taken against a container with no height at all
   * — at which point the fit above resolves against nothing, no tiles fall
   * inside the view, and the map sits there empty until something makes it
   * measure again. Reloading the page was the something.
   *
   * So: re-measure on every resize, and the first time the container has a
   * real size, re-run the fit as well. invalidateSize alone was not enough —
   * it corrects the frame the map is drawn in and leaves the view that was
   * computed for the wrong one.
   */
  useEffect(() => {
    const map = mapRef.current
    const holder = holderRef.current
    if (!map || !holder) return undefined

    const remeasure = () => {
      map.invalidateSize()
      if (sizedRef.current) return
      if (holder.clientWidth > 0 && holder.clientHeight > 0) {
        sizedRef.current = true
        setFitNonce((n) => n + 1)
      }
    }

    const observer = new ResizeObserver(remeasure)
    observer.observe(holder)

    /* And the same thing on a short timer, because the observer is not enough
       on its own: its callbacks are delivered with the rendering steps, so a
       tab that is not being painted — opened in the background, or behind
       another window — gets none of them, and the map that was built against
       an unmeasured container stays that way until something repaints it.
       Timers fire regardless. Both stop as soon as one of them succeeds. */
    const timers = [0, 120, 400, 900].map((ms) => window.setTimeout(remeasure, ms))

    return () => {
      observer.disconnect()
      timers.forEach(window.clearTimeout)
    }
  }, [])

  const onPick = (next) => {
    setSlug(next)
    setSelectedId(null)
    // A query typed against dentistry means nothing against cybersecurity, and
    // leaving it on would show an empty list as if the major had no colleges.
    setQuery('')
  }

  return (
    <div className="mapPage">
      <header className="mapPage__head shell">
        <span className="eyebrow eyebrow--dark">The map</span>
        <h1 className="mapPage__title">Where each major is taught</h1>
        <p className="mapPage__lede">
          Pick a major to see every college that runs it, then open one to see what it takes to
          get in. The same degree in Duhok and in Basra is a different life.
        </p>
      </header>

      {/* Per major, not per page: the researched majors say nothing here, and
          only the ones still running on invented figures carry a warning. */}
      {sample && (
        <div className="shell">
          <p className="mapPage__warning" role="note">
            <span className="mapPage__warningMark" aria-hidden="true" />
            <span>
              <strong>Sample figures, not real admission data.</strong> The universities and
              places are real. The rates and seat counts for {major?.name} are placeholders while
              we gather the real ones, so do not plan around them.
            </span>
          </p>
        </div>
      )}

      {/* Three grid children rather than a left column and a right one, so a
          phone can put the picker, then the map, then the list, without the
          picker being trapped at the top of the list's own column. */}
      <div className="shell mapPage__grid">
        <div className="mapControls">
          <label className="mapPick">
            <span className="mapPick__label">Major</span>
            <select
              className="mapPick__select"
              value={slug}
              onChange={(e) => onPick(e.target.value)}
            >
              {byField.map(([field, majors]) => (
                <optgroup key={field} label={fieldLabel(field)}>
                  {majors.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          {/* Search inside the chosen major, not across the library — the
              label says which, because a bare magnifier on a page with a map
              on it reads as "search anywhere". */}
          <div className="mapSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="mapSearch__icon">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={major ? `Find a college in ${major.name}…` : 'Find a college…'}
              aria-label={
                major
                  ? `Search the universities, departments and cities teaching ${major.name}`
                  : 'Search colleges'
              }
            />
            {query && (
              <button type="button" className="mapSearch__clear" onClick={() => setQuery('')}>
                Clear
              </button>
            )}
          </div>

          {major && (
            <p className="mapControls__count" aria-live="polite">
              {query.trim()
                ? `${colleges.length} of ${all.length} ${all.length === 1 ? 'university' : 'universities'}`
                : `${colleges.length} ${colleges.length === 1 ? 'university' : 'universities'}`}
              {branchCount > colleges.length && `, ${branchCount} departments`}
            </p>
          )}
        </div>

        {/* Nothing found is about the query, not about the major: the count
            above still says how many colleges teach it, so this only has to
            explain what did not match and offer the way back. */}
        {query.trim() && colleges.length === 0 ? (
          <div className="mapEmpty">
            <span className="mapEmpty__mark" aria-hidden="true" />
            <h2 className="mapEmpty__title">No college matches “{query.trim()}”</h2>
            <p className="mapEmpty__text">
              {all.length} {all.length === 1 ? 'university teaches' : 'universities teach'}{' '}
              {major?.name}. Try the university&rsquo;s name, its city or governorate, or the
              department itself.
            </p>
            <button type="button" className="btn btn--outline-dark" onClick={() => setQuery('')}>
              Show all {all.length}
            </button>
          </div>
        ) : (
          <ul className="clist">
            {colleges.map((college) => {
              const on = college.id === selectedId
              const best = college.branches[0]
              return (
                <li key={college.id}>
                  <button
                    type="button"
                    className={`crow${on ? ' crow--on' : ''}`}
                    aria-expanded={on}
                    onClick={() => setSelectedId(on ? null : college.id)}
                  >
                    <span className="crow__head">
                      <span className="crow__name">{college.university}</span>
                      <span className="crow__city">
                        {college.city}
                        {college.branches.length > 1 &&
                          ` · ${college.branches.length} departments`}
                      </span>
                    </span>
                    <span className="crow__meta">
                      {/* The cut-off, where this major has one. Nothing else
                          belongs in this slot: a number beside a college name
                          gets read as "what you need to get in", which is only
                          true of this one. */}
                      {best.minScore != null && (
                        <span className="crow__score">{best.minScore}%</span>
                      )}
                      <span className="crow__kind">{college.kind}</span>
                    </span>
                  </button>

                  {on && (
                    <div className="cdetail">
                      {college.branches.map((b, i) => (
                        <div className="cbranch" key={`${b.college}-${b.department ?? i}`}>
                          {/* Cybersecurity runs under five different names and
                              they are not interchangeable, so the department
                              leads and the college sits under it. */}
                          <p className="cdetail__dept">{b.department ?? b.college}</p>
                          {b.department && <p className="cdetail__in">{b.college}</p>}
                          <dl className="cdetail__facts">
                            {b.minScore != null && (
                              <div>
                                <dt>{college.sample ? 'Minimum score' : 'Cut-off 2025-26'}</dt>
                                <dd>{b.minScore}%</dd>
                              </div>
                            )}
                            {/* Absence is information: the department is real,
                                the cut-off simply is not published. */}
                            {!college.sample && b.minScore == null && b.track && (
                              <div>
                                <dt>Cut-off 2025-26</dt>
                                <dd className="cdetail__unknown">not on record</dd>
                              </div>
                            )}
                            {b.track && (
                              <div>
                                <dt>Degree track</dt>
                                <dd>{b.track}</dd>
                              </div>
                            )}
                            {b.acceptanceRate != null && (
                              <div>
                                <dt>Acceptance rate</dt>
                                <dd>{b.acceptanceRate}%</dd>
                              </div>
                            )}
                            {b.seats != null && (
                              <div>
                                <dt>Seats a year</dt>
                                <dd>{b.seats}</dd>
                              </div>
                            )}
                            <div>
                              <dt>Length</dt>
                              <dd>{b.years} years</dd>
                            </div>
                            {b.degree && (
                              <div>
                                <dt>Degree</dt>
                                <dd>{b.degree}</dd>
                              </div>
                            )}
                            {b.language && (
                              <div>
                                <dt>Taught in</dt>
                                <dd>{b.language}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      ))}

                      <p className="cdetail__where">
                        {college.governorate}
                        {college.system === 'krg' && ' · Kurdistan Region'}
                      </p>

                      <Link to={`/app/${slug}`} className="cdetail__link">
                        Read what {major.name} actually is
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <div className="mapStage">
          {major && (
            <div className="mapStage__tag">
              <FieldGlyph field={major.field} className="mapStage__glyph" />
              <span>
                <strong>{major.name}</strong>
                <em>{fieldLabel(major.field)}</em>
              </span>
            </div>
          )}
          <div className="mapStage__canvas" ref={holderRef} />

          {/* Over the map rather than over the page: the college list beside
              it is already readable, and covering it would be pretending the
              whole screen is waiting when one panel of it is. */}
          {tiles !== 'ready' && (
            <BrandLoader
              inset
              label={tiles === 'error' ? 'The basemap did not load' : 'Loading the map'}
              detail={
                tiles === 'error'
                  ? 'The universities and their details are all here; only the background is missing.'
                  : null
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
