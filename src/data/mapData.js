/**
 * What the map draws.
 *
 * All three plotted majors are researched now — real departments, from the
 * ministry's list and from the Kurdish universities themselves. The `sample`
 * flag survives so that adding a fourth major on invented figures still shows
 * the warning banner rather than passing itself off as sourced.
 *
 * What the departments no longer carry is the ministry's classification rank
 * and score. They rated a college's quality and every reader took them for an
 * admission bar; on a page about where to apply, that is a number that misleads
 * by simply existing. Only the real admission cut-offs remain, and only for the
 * major that has them.
 *
 * All three normalise to the same shape:
 *
 *   { id, university, city, governorate, kind, lat, lng, sample, system,
 *     branches: [ ... ] }
 *
 * `branches` is a list because one university can teach the same subject in
 * several colleges. Salahaddin runs English in three: Languages, Education
 * and Basic Education. A single-programme model would have hidden two of them.
 */

import { UNIVERSITIES } from './universities.js'
import { ENGLISH_COLLEGES } from './englishDepartments.js'
import { CYBER_COLLEGES } from './cybersecurityDepartments.js'
import { DENTISTRY_COLLEGES } from './dentistryDepartments.js'

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
  [ENGLISH_SLUG]: { rows: ENGLISH_COLLEGES },
  [CYBER_SLUG]: { rows: CYBER_COLLEGES },
  [DENTISTRY_SLUG]: { rows: DENTISTRY_COLLEGES },
}

export const isSampleMajor = (slug) => !RESEARCHED[slug]

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
