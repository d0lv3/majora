/**
 * What the map draws, from two sources that are not equally trustworthy.
 *
 * English is researched: real departments from the ministry's 2025
 * classification and from the Kurdish universities themselves. Dentistry and
 * cybersecurity are still the placeholder set, invented so the page could be
 * built before any real figures existed.
 *
 * They are kept apart rather than blended so the page can say which is which.
 * A single `sample` flag per major drives the warning banner: it appears for
 * the majors that are still made up, and not for the one that is not. That is
 * the whole reason this module exists instead of the page reading both files.
 *
 * Both sources normalise to the same shape:
 *
 *   { id, university, city, governorate, kind, lat, lng, sample, system,
 *     branches: [ ... ] }
 *
 * `branches` is a list because one university can teach the same subject in
 * several colleges. Salahaddin runs English in three: Languages, Education
 * and Basic Education. A single-programme model would have hidden two of them.
 */

import { COLLEGES as SAMPLE_COLLEGES } from './colleges.js'
import { ENGLISH_COLLEGES, ENGLISH_SOURCES, ENGLISH_STATS } from './englishDepartments.js'

const ENGLISH_SLUG = 'english-language-literature'

/** Majors whose figures are researched rather than invented. */
const RESEARCHED = new Set([ENGLISH_SLUG])

export const isSampleMajor = (slug) => !RESEARCHED.has(slug)

export function sourcesFor(slug) {
  return slug === ENGLISH_SLUG ? ENGLISH_SOURCES : []
}

export function statsFor(slug) {
  return slug === ENGLISH_SLUG ? ENGLISH_STATS : null
}

/** Every university teaching this major, northernmost first. */
export function collegesFor(slug) {
  const rows =
    slug === ENGLISH_SLUG
      ? ENGLISH_COLLEGES.map((c) => ({ ...c, sample: false }))
      : SAMPLE_COLLEGES.filter((c) => c.programmes[slug]).map((c) => ({
          id: c.id,
          university: c.university,
          city: c.city,
          governorate: c.governorate,
          kind: c.kind,
          lat: c.lat,
          lng: c.lng,
          sample: true,
          system: null,
          branches: [{ ...c.programmes[slug] }],
        }))

  return rows.sort((a, b) => b.lat - a.lat)
}

/** The majors the map can plot at all. */
export function mappedMajorSlugs() {
  const slugs = new Set([ENGLISH_SLUG])
  for (const c of SAMPLE_COLLEGES) for (const s of Object.keys(c.programmes)) slugs.add(s)
  return [...slugs]
}

/** Roughly the country, used to frame the map before anything is selected. */
export const IRAQ_BOUNDS = [
  [28.5, 38.7],
  [37.4, 48.8],
]
