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

import { UNIVERSITIES } from './universities.js'
import { ENGLISH_COLLEGES, ENGLISH_SOURCES, ENGLISH_STATS } from './englishDepartments.js'
import { CYBER_COLLEGES, CYBER_SOURCES, CYBER_STATS } from './cybersecurityDepartments.js'
import {
  DENTISTRY_ADMISSION,
  DENTISTRY_COLLEGES,
  DENTISTRY_SOURCES,
  DENTISTRY_STATS,
} from './dentistryDepartments.js'

const ENGLISH_SLUG = 'english-language-literature'
const CYBER_SLUG = 'cybersecurity'
const DENTISTRY_SLUG = 'dentistry'

/**
 * Every major the map plots is now researched. Nothing reads from colleges.js
 * any more, and the sample branch below is kept only so adding a fourth major
 * with placeholder data still shows the warning rather than passing itself off
 * as sourced.
 */
const RESEARCHED = {
  [ENGLISH_SLUG]: { rows: ENGLISH_COLLEGES, sources: ENGLISH_SOURCES, stats: ENGLISH_STATS },
  [CYBER_SLUG]: { rows: CYBER_COLLEGES, sources: CYBER_SOURCES, stats: CYBER_STATS },
  [DENTISTRY_SLUG]: {
    rows: DENTISTRY_COLLEGES,
    sources: DENTISTRY_SOURCES,
    stats: DENTISTRY_STATS,
    admission: DENTISTRY_ADMISSION,
  },
}

/** The national entry bar, where one exists instead of per-department cut-offs. */
export function admissionFor(slug) {
  return RESEARCHED[slug]?.admission ?? null
}

export const isSampleMajor = (slug) => !RESEARCHED[slug]

export function sourcesFor(slug) {
  return RESEARCHED[slug]?.sources ?? []
}

export function statsFor(slug) {
  return RESEARCHED[slug]?.stats ?? null
}

/** Every university teaching this major, northernmost first. */
export function collegesFor(slug) {
  const researched = RESEARCHED[slug]
  if (!researched) return []
  return researched.rows.map((c) => ({ ...c, sample: false })).sort((a, b) => b.lat - a.lat)
}

/** The majors the map can plot at all. */
export function mappedMajorSlugs() {
  return Object.keys(RESEARCHED)
}

/** university id -> the mapped majors it teaches. Built once, read many. */
const MAJORS_BY_UNIVERSITY = (() => {
  const byUni = new Map()
  for (const [slug, { rows }] of Object.entries(RESEARCHED)) {
    for (const row of rows) {
      if (!byUni.has(row.id)) byUni.set(row.id, [])
      byUni.get(row.id).push(slug)
    }
  }
  return byUni
})()

/**
 * Universities whose name matches a query, each with the mapped majors it
 * teaches.
 *
 * Searched against the full registry rather than against the three subjects
 * that have been researched, which matters for what the answer means. A
 * university teaching none of those three still matches, carrying an empty
 * list — because "on record, and we have not mapped it yet" is a different
 * answer from "no such place", and the library says which one it is. Reading
 * an empty list as "teaches nothing" would be the exact misreading this whole
 * data set has been built to avoid.
 *
 * Both names are searchable. A student looking for جامعة بغداد should not
 * have to know the English spelling first, so the local name is matched on
 * the raw query — Arabic and Kurdish have no letter case to fold.
 */
export function searchUniversities(query) {
  const raw = query.trim()
  // one or two letters match half the country and tell nobody anything
  if (raw.length < 3) return []
  const q = raw.toLowerCase()

  const hits = []
  for (const [id, [name, nameLocal]] of Object.entries(UNIVERSITIES)) {
    if (name.toLowerCase().includes(q) || nameLocal.includes(raw)) {
      const [, , city, governorate, kind] = UNIVERSITIES[id]
      hits.push({
        id,
        name,
        nameLocal,
        city,
        governorate,
        kind,
        majorSlugs: MAJORS_BY_UNIVERSITY.get(id) ?? [],
      })
    }
  }

  // the ones we can actually say something about first
  return hits.sort(
    (a, b) => b.majorSlugs.length - a.majorSlugs.length || a.name.localeCompare(b.name),
  )
}

/** Roughly the country, used to frame the map before anything is selected. */
export const IRAQ_BOUNDS = [
  [28.5, 38.7],
  [37.4, 48.8],
]
