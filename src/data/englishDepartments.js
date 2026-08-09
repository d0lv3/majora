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
 * own site and are marked `system: 'krg'`.
 *
 * THE CLASSIFICATION SCORE IS NOT HERE, DELIBERATELY
 *
 * The ministry's table carries a rank and a quality score per department, and
 * this file used to carry both. They are gone. Every student who read one
 * read it as an admission chance, which is not what it measures — it rates
 * the department on the ministry's criteria and says nothing about who gets
 * in. A number that is wrong in the reader's head is worse than no number, so
 * the table is now used only for which departments exist and where.
 *
 * HOW GOOD THE COORDINATES ARE
 *
 * City level, not campus level, and kept in universities.js so English and
 * cybersecurity cannot disagree about where a university is.
 */

import { UNIVERSITIES } from './universities.js'

/**
 * Each English department, as [universityId, college, category].
 *
 * `category` is which of the ministry's three college types the department
 * belongs to — Arts, Education or Basic Education. They are genuinely
 * different degrees, not three names for one, so a university running English
 * in two of them shows two rows. Kurdistan Region rows omit it: the KRG does
 * not sort its colleges this way.
 */
const DEPARTMENTS = [
  /* ---- federal: Arts, اداب/اللغة الانكليزية (26) ---- */
  ['baghdad', 'College of Arts', 'Arts'],
  ['mustaqbal', 'College of Arts & Humanities', 'Arts'],
  ['iraqia', 'College of Arts', 'Arts'],
  ['esraa', 'College of Arts', 'Arts'],
  ['mosul', 'College of Arts', 'Arts'],
  ['kufa', 'College of Arts', 'Arts'],
  ['anbar', 'College of Arts', 'Arts'],
  ['mustansiriyah', 'College of Arts', 'Arts'],
  ['qadisiyah', 'College of Arts', 'Arts'],
  ['turath', 'College of Arts', 'Arts'],
  ['hadba', 'College of Arts', 'Arts'],
  ['tikrit', 'College of Arts', 'Arts'],
  ['dijlah', 'College of Arts', 'Arts'],
  ['hikma', 'College of Arts', 'Arts'],
  ['thiqar', 'College of Arts', 'Arts'],
  ['nisour', 'College of Arts', 'Arts'],
  ['biladrafidain', 'College of Arts', 'Arts'],
  ['farqadain', 'College of Arts', 'Arts'],
  ['salam', 'College of Arts', 'Arts'],
  ['yarmouk', 'College of Arts', 'Arts'],
  ['maaqal', 'College of Arts', 'Arts'],
  ['qalam', 'College of Arts', 'Arts'],
  ['mazaya', 'College of Arts', 'Arts'],
  ['basrah', 'College of Arts', 'Arts'],
  ['ahlbayt', 'College of Arts', 'Arts'],
  ['maaref', 'College of Arts', 'Arts'],

  /* ---- federal: Education, تربية/لغة انكليزية (34) ---- */
  ['baghdad', 'College of Education Ibn Rushd for Human Sciences', 'Education'],
  ['islamic', 'College of Education', 'Education'],
  ['baghdad', 'College of Education for Women', 'Education'],
  ['wasit', 'College of Education for Human Sciences', 'Education'],
  ['kitab', 'College of Education', 'Education'],
  ['alnoor', 'College of Education', 'Education'],
  ['basrah', 'College of Education for Human Sciences', 'Education'],
  ['anbar', 'College of Education for Human Sciences', 'Education'],
  ['tikrit', 'College of Education for Women', 'Education'],
  ['kerbala', 'College of Education for Human Sciences', 'Education'],
  ['samarra', 'College of Education', 'Education'],
  ['anbar', 'College of Education for Women', 'Education'],
  ['kirkuk', 'College of Education for Human Sciences', 'Education'],
  ['kufa', 'College of Education', 'Education'],
  ['tikrit', 'College of Education for Human Sciences', 'Education'],
  ['qadisiyah', 'College of Education', 'Education'],
  ['thiqar', 'College of Education for Human Sciences', 'Education'],
  ['hamdaniya', 'College of Education for Human Sciences', 'Education'],
  ['kufa', 'College of Education for Women', 'Education'],
  ['farahidi', 'College of Education', 'Education'],
  ['diyala', 'College of Education for Human Sciences', 'Education'],
  ['zahraa', 'College of Education', 'Education'],
  ['mosul', 'College of Education for Human Sciences', 'Education'],
  ['iraqia', 'College of Education for Women', 'Education'],
  ['muthanna', 'College of Education for Human Sciences', 'Education'],
  ['shattarab', 'College of Arts', 'Education'],
  ['kadhim', 'College of Education', 'Education'],
  ['babylon', 'College of Education for Human Sciences', 'Education'],
  ['basrah', 'College of Education, Qurna', 'Education'],
  ['mansour', 'College of Education', 'Education'],
  ['hilla', 'College of Education', 'Education'],
  ['mamoon', 'College of Education', 'Education'],
  ['misan', 'College of Education', 'Education'],
  ['sawa', 'College of Education', 'Education'],

  /* ---- federal: Basic Education, تربية اساسية/اللغة الانكليزية (7) ---- */
  ['babylon', 'College of Basic Education', 'Basic Education'],
  ['kirkuk', 'College of Basic Education', 'Basic Education'],
  ['tikrit', 'College of Basic Education, Shirqat', 'Basic Education'],
  ['diyala', 'College of Basic Education', 'Basic Education'],
  ['mosul', 'College of Basic Education', 'Basic Education'],
  ['misan', 'College of Basic Education', 'Basic Education'],
  ['mustansiriyah', 'College of Basic Education', 'Basic Education'],

  /* ---- Kurdistan Region: no ministry classification ---- */
  ['salahaddin', 'College of Languages'],
  ['salahaddin', 'College of Education'],
  ['salahaddin', 'College of Basic Education'],
  ['sulaimani', 'College of Languages'],
  ['sulaimani', 'College of Basic Education'],
  ['duhok', 'College of Languages'],
  ['duhok', 'College of Basic Education'],
  ['zakho', 'College of Humanities'],
  ['zakho', 'College of Basic Education'],
  ['koya', 'Faculty of Humanities & Social Sciences'],
  ['koya', 'Faculty of Education'],
  ['halabja', 'College of Basic Education'],
  ['raparin', 'College of Education'],
  ['garmian', 'College of Education'],
  ['charmo', 'College of Education'],
  ['soran', 'Faculty of Arts'],
  ['ukh', 'School of Arts & Sciences'],
  ['auis', 'Department of English'],
  ['tishk', 'Faculty of Education, ELT'],
  ['cihanerbil', 'College of Languages'],
  ['knowledge', 'College of Arts'],
  ['lfu', 'College of Arts'],
  ['nawroz', 'College of Arts'],
]

/** The Kurdish universities, which the ministry table does not cover. */
const KRG_IDS = new Set([
  'salahaddin', 'ukh', 'tishk', 'cihanerbil', 'knowledge', 'lfu', 'koya', 'soran',
  'sulaimani', 'auis', 'raparin', 'garmian', 'charmo', 'halabja', 'duhok', 'nawroz', 'zakho',
])

/** Expanded into one entry per university, each carrying its branches. */
export const ENGLISH_COLLEGES = (() => {
  const byUni = new Map()
  for (const [uniId, college, category = null] of DEPARTMENTS) {
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
    byUni.get(uniId).branches.push({ college, category, years: 4, degree: 'BA' })
  }
  // Left in the order the list gives them, which groups Arts, then Education,
  // then Basic Education. There is nothing left to sort them by: the ranking
  // that used to decide this was the ministry's, and it is gone.
  return [...byUni.values()]
})()

/**
 * Where the department list came from. Not read by any page — the map states
 * no figures that need attributing now — but kept so the next person to touch
 * this file knows which table these rows were transcribed out of.
 */
export const ENGLISH_SOURCES = [
  {
    label: 'Iraqi Ministry of Higher Education, 2025 departmental classification',
    href: 'https://iru.mohesr.gov.iq/dep',
    covers: 'Federal Iraq: which universities run an Arts, Education or Basic Education English department.',
  },
  {
    label: 'KRG universities, own published department pages',
    href: 'https://gov.krd/mohe-en/publications/universities/',
    covers:
      'Kurdistan Region: the ministry table does not list these, so each department comes from its own university.',
  },
]
