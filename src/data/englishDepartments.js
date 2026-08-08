/**
 * Every English-language department in Iraq, as far as it can be established
 * from public sources. Researched August 2026.
 *
 * WHERE THIS COMES FROM
 *
 * Federal Iraq: the Ministry of Higher Education's 2025 departmental
 * classification, https://iru.mohesr.gov.iq/dep, read across its three
 * colleges that run an English department:
 *
 *     الاداب / اللغة الانكليزية              Arts, 26 departments
 *     التربية / لغة انكليزية                 Education, 34 departments
 *     التربية الاساسية / اللغة الانكليزية    Basic Education, 7 departments
 *
 * Kurdistan Region: not in that table at all. The Region's universities are
 * administered by the KRG Ministry of Higher Education rather than the
 * federal one, so the ministry list has no Salahaddin, no Sulaimani, no
 * Duhok. For a platform written for students in Kurdistan that is the more
 * important half, so those departments were gathered from each university's
 * own site and are marked `system: 'krg'`. They carry no ministry score,
 * because the KRG runs no equivalent classification.
 *
 * WHAT THE SCORE IS, AND IS NOT
 *
 * `score` is the department's 2025 classification score and `rank` its place
 * within its own college type. It measures the department, on the ministry's
 * own criteria. It is NOT an acceptance rate, NOT a minimum admission grade,
 * and NOT a fee. Nothing here says how hard a department is to get into.
 * Admission in federal Iraq runs on a central grade cut-off published
 * separately each year, and that number is not in this file.
 *
 * HOW GOOD THE COORDINATES ARE
 *
 * City level, not campus level, and kept in universities.js so English and
 * cybersecurity cannot disagree about where a university is.
 */

import { UNIVERSITIES } from './universities.js'

/**
 * Each English department, as [universityId, college, rank, score].
 *
 * `category` is which of the ministry's three college types the rank belongs
 * to. Ranks restart in each, so a department can be #1 in Arts while another
 * at the same university is #1 in Education; without the category, two rank-1
 * rows on one card look like a contradiction.
 *
 * `rank` and `score` are the ministry's 2025 classification, and are null for
 * the Kurdistan Region, which runs no equivalent. Ranks repeat where the
 * ministry ties departments on the same score.
 */
const DEPARTMENTS = [
  /* ---- federal: Arts, اداب/اللغة الانكليزية (26) ---- */
  ['baghdad', 'College of Arts', 1, 42.45, 'Arts'],
  ['mustaqbal', 'College of Arts & Humanities', 2, 37.91, 'Arts'],
  ['iraqia', 'College of Arts', 3, 28.36, 'Arts'],
  ['esraa', 'College of Arts', 4, 27.92, 'Arts'],
  ['mosul', 'College of Arts', 5, 27.91, 'Arts'],
  ['kufa', 'College of Arts', 6, 27.45, 'Arts'],
  ['anbar', 'College of Arts', 6, 27.45, 'Arts'],
  ['mustansiriyah', 'College of Arts', 7, 27.0, 'Arts'],
  ['qadisiyah', 'College of Arts', 7, 27.0, 'Arts'],
  ['turath', 'College of Arts', 7, 27.0, 'Arts'],
  ['hadba', 'College of Arts', 7, 27.0, 'Arts'],
  ['tikrit', 'College of Arts', 7, 27.0, 'Arts'],
  ['dijlah', 'College of Arts', 7, 27.0, 'Arts'],
  ['hikma', 'College of Arts', 8, 25.38, 'Arts'],
  ['thiqar', 'College of Arts', 9, 25.0, 'Arts'],
  ['nisour', 'College of Arts', 9, 25.0, 'Arts'],
  ['biladrafidain', 'College of Arts', 9, 25.0, 'Arts'],
  ['farqadain', 'College of Arts', 9, 25.0, 'Arts'],
  ['salam', 'College of Arts', 9, 25.0, 'Arts'],
  ['yarmouk', 'College of Arts', 10, 24.53, 'Arts'],
  ['maaqal', 'College of Arts', 11, 24.01, 'Arts'],
  ['qalam', 'College of Arts', 12, 17.32, 'Arts'],
  ['mazaya', 'College of Arts', 13, 3.46, 'Arts'],
  ['basrah', 'College of Arts', 14, 2.0, 'Arts'],
  ['ahlbayt', 'College of Arts', 15, 1.0, 'Arts'],
  ['maaref', 'College of Arts', 16, 0.0, 'Arts'],

  /* ---- federal: Education, تربية/لغة انكليزية (34) ---- */
  ['baghdad', 'College of Education Ibn Rushd for Human Sciences', 1, 76.5, 'Education'],
  ['islamic', 'College of Education', 2, 59.92, 'Education'],
  ['baghdad', 'College of Education for Women', 3, 52.0, 'Education'],
  ['wasit', 'College of Education for Human Sciences', 4, 47.0, 'Education'],
  ['kitab', 'College of Education', 4, 47.0, 'Education'],
  ['alnoor', 'College of Education', 4, 47.0, 'Education'],
  ['basrah', 'College of Education for Human Sciences', 5, 44.35, 'Education'],
  ['anbar', 'College of Education for Human Sciences', 6, 40.25, 'Education'],
  ['tikrit', 'College of Education for Women', 7, 37.0, 'Education'],
  ['kerbala', 'College of Education for Human Sciences', 7, 37.0, 'Education'],
  ['samarra', 'College of Education', 7, 37.0, 'Education'],
  ['anbar', 'College of Education for Women', 8, 36.4, 'Education'],
  ['kirkuk', 'College of Education for Human Sciences', 9, 36.24, 'Education'],
  ['kufa', 'College of Education', 10, 36.0, 'Education'],
  ['tikrit', 'College of Education for Human Sciences', 10, 36.0, 'Education'],
  ['qadisiyah', 'College of Education', 10, 36.0, 'Education'],
  ['thiqar', 'College of Education for Human Sciences', 10, 36.0, 'Education'],
  ['hamdaniya', 'College of Education for Human Sciences', 10, 36.0, 'Education'],
  ['kufa', 'College of Education for Women', 10, 36.0, 'Education'],
  ['farahidi', 'College of Education', 11, 35.42, 'Education'],
  ['diyala', 'College of Education for Human Sciences', 12, 35.0, 'Education'],
  ['zahraa', 'College of Education', 13, 32.42, 'Education'],
  ['mosul', 'College of Education for Human Sciences', 14, 30.64, 'Education'],
  ['iraqia', 'College of Education for Women', 15, 27.63, 'Education'],
  ['muthanna', 'College of Education for Human Sciences', 16, 27.0, 'Education'],
  ['shattarab', 'College of Arts', 17, 25.0, 'Education'],
  ['kadhim', 'College of Education', 18, 23.87, 'Education'],
  ['babylon', 'College of Education for Human Sciences', 19, 22.0, 'Education'],
  ['basrah', 'College of Education, Qurna', 20, 21.0, 'Education'],
  ['mansour', 'College of Education', 21, 17.38, 'Education'],
  ['hilla', 'College of Education', 22, 12.25, 'Education'],
  ['mamoon', 'College of Education', 23, 4.47, 'Education'],
  ['misan', 'College of Education', 24, 2.0, 'Education'],
  ['sawa', 'College of Education', 25, 1.11, 'Education'],

  /* ---- federal: Basic Education, تربية اساسية/اللغة الانكليزية (7) ---- */
  ['babylon', 'College of Basic Education', 1, 47.0, 'Basic Education'],
  ['kirkuk', 'College of Basic Education', 2, 37.4, 'Basic Education'],
  ['tikrit', 'College of Basic Education, Shirqat', 3, 37.0, 'Basic Education'],
  ['diyala', 'College of Basic Education', 4, 35.0, 'Basic Education'],
  ['mosul', 'College of Basic Education', 5, 29.35, 'Basic Education'],
  ['misan', 'College of Basic Education', 6, 26.0, 'Basic Education'],
  ['mustansiriyah', 'College of Basic Education', 7, 25.07, 'Basic Education'],

  /* ---- Kurdistan Region: no ministry classification ---- */
  ['salahaddin', 'College of Languages', null, null],
  ['salahaddin', 'College of Education', null, null],
  ['salahaddin', 'College of Basic Education', null, null],
  ['sulaimani', 'College of Languages', null, null],
  ['sulaimani', 'College of Basic Education', null, null],
  ['duhok', 'College of Languages', null, null],
  ['duhok', 'College of Basic Education', null, null],
  ['zakho', 'College of Humanities', null, null],
  ['zakho', 'College of Basic Education', null, null],
  ['koya', 'Faculty of Humanities & Social Sciences', null, null],
  ['koya', 'Faculty of Education', null, null],
  ['halabja', 'College of Basic Education', null, null],
  ['raparin', 'College of Education', null, null],
  ['garmian', 'College of Education', null, null],
  ['charmo', 'College of Education', null, null],
  ['soran', 'Faculty of Arts', null, null],
  ['ukh', 'School of Arts & Sciences', null, null],
  ['auis', 'Department of English', null, null],
  ['tishk', 'Faculty of Education, ELT', null, null],
  ['cihanerbil', 'College of Languages', null, null],
  ['knowledge', 'College of Arts', null, null],
  ['lfu', 'College of Arts', null, null],
  ['nawroz', 'College of Arts', null, null],
]

/** The Kurdish universities, which the ministry table does not cover. */
const KRG_IDS = new Set([
  'salahaddin', 'ukh', 'tishk', 'cihanerbil', 'knowledge', 'lfu', 'koya', 'soran',
  'sulaimani', 'auis', 'raparin', 'garmian', 'charmo', 'halabja', 'duhok', 'nawroz', 'zakho',
])

/** Expanded into one entry per university, each carrying its branches. */
export const ENGLISH_COLLEGES = (() => {
  const byUni = new Map()
  for (const [uniId, college, rank, score, category = null] of DEPARTMENTS) {
    const u = UNIVERSITIES[uniId]
    if (!u) continue
    const [name, nameAr, city, governorate, kind, lat, lng] = u
    if (!byUni.has(uniId)) {
      byUni.set(uniId, {
        id: uniId,
        university: name,
        universityAr: nameAr,
        city,
        governorate,
        kind,
        lat,
        lng,
        system: KRG_IDS.has(uniId) ? 'krg' : 'federal',
        branches: [],
      })
    }
    byUni.get(uniId).branches.push({ college, rank, score, category, years: 4, degree: 'BA' })
  }
  // best-ranked branch first, then the rest; unranked keep their given order
  for (const entry of byUni.values()) {
    entry.branches.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  }
  return [...byUni.values()]
})()

export const ENGLISH_SOURCES = [
  {
    label: 'Iraqi Ministry of Higher Education, 2025 departmental classification',
    href: 'https://iru.mohesr.gov.iq/dep',
    covers: 'Federal Iraq: Arts, Education and Basic Education English departments, with rank and score.',
  },
  {
    label: 'KRG universities, own published department pages',
    href: 'https://gov.krd/mohe-en/publications/universities/',
    covers:
      'Kurdistan Region: the ministry table does not list these, so each department comes from its own university. No classification score exists for them.',
  },
]

export const ENGLISH_STATS = {
  departments: DEPARTMENTS.length,
  universities: ENGLISH_COLLEGES.length,
  federal: DEPARTMENTS.filter(([id]) => !KRG_IDS.has(id)).length,
  krg: DEPARTMENTS.filter(([id]) => KRG_IDS.has(id)).length,
}
