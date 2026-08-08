import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import FieldGlyph from '../components/decor/FieldGlyph.jsx'
import { MAJORS, isAvailable, fieldLabel } from '../data/majors.js'
import {
  COLLEGES,
  DATA_IS_SAMPLE,
  IRAQ_BOUNDS,
  SAMPLE_NOTICE,
  collegesFor,
  mappedMajorSlugs,
} from '../data/colleges.js'
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

  const [slug, setSlug] = useState(plottable[0]?.slug ?? '')
  const [selectedId, setSelectedId] = useState(null)

  const major = useMemo(() => MAJORS.find((m) => m.slug === slug), [slug])
  const colleges = useMemo(() => (slug ? collegesFor(slug) : []), [slug])
  const selected = useMemo(
    () => colleges.find((c) => c.id === selectedId) ?? null,
    [colleges, selectedId],
  )

  const holderRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)
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
      zoomControl: true,
      attributionControl: true,
    })
    map.fitBounds(IRAQ_BOUNDS)
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: 'abcd',
      detectRetina: true,
      maxZoom: 20,
    }).addTo(map)

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

    map.fitBounds(
      colleges.map((c) => [c.lat, c.lng]),
      { padding: [48, 48], maxZoom: 8, animate: !prefersReducedMotion() },
    )
  }, [colleges, selectedId])

  /* --------------- selecting from the list moves the map --------------- */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected) return
    map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 9), {
      animate: !prefersReducedMotion(),
    })
  }, [selected])

  // Leaflet measures its container on creation. The container is inside a
  // grid that settles a frame later, and on a phone it changes shape when the
  // panel above it reflows, so the map is told to re-measure both times.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !holderRef.current) return undefined
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(holderRef.current)
    return () => observer.disconnect()
  }, [])

  const onPick = (next) => {
    setSlug(next)
    setSelectedId(null)
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

      {DATA_IS_SAMPLE && (
        <div className="shell">
          <p className="mapPage__warning" role="note">
            <span className="mapPage__warningMark" aria-hidden="true" />
            <span>
              <strong>Sample figures, not real admission data.</strong> The universities and
              places are real. The rates, scores and seat counts are placeholders while we
              gather the real ones, so do not plan around them.
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
              {plottable.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          {major && (
            <p className="mapControls__count" aria-live="polite">
              {colleges.length} {colleges.length === 1 ? 'college' : 'colleges'} run {major.name}
            </p>
          )}
        </div>

        <ul className="clist">
            {colleges.map((college) => {
              const p = college.programmes[slug]
              const on = college.id === selectedId
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
                      <span className="crow__city">{college.city}</span>
                    </span>
                    <span className="crow__meta">
                      <span className="crow__score">{p.minScore}%</span>
                      <span className="crow__kind">{college.kind}</span>
                    </span>
                  </button>

                  {on && (
                    <div className="cdetail">
                      <p className="cdetail__dept">{p.college}</p>
                      <dl className="cdetail__facts">
                        <div>
                          <dt>Minimum score</dt>
                          <dd>{p.minScore}%</dd>
                        </div>
                        <div>
                          <dt>Acceptance rate</dt>
                          <dd>{p.acceptanceRate}%</dd>
                        </div>
                        <div>
                          <dt>Seats a year</dt>
                          <dd>{p.seats}</dd>
                        </div>
                        <div>
                          <dt>Length</dt>
                          <dd>{p.years} years</dd>
                        </div>
                        <div>
                          <dt>Taught in</dt>
                          <dd>{p.language}</dd>
                        </div>
                        <div>
                          <dt>Governorate</dt>
                          <dd>{college.governorate}</dd>
                        </div>
                      </dl>
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
        </div>
      </div>
    </div>
  )
}
