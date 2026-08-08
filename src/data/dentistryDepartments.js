/**
 * Dentistry colleges in Iraq. Researched August 2026.
 *
 * WHERE THIS COMES FROM
 *
 * Federal Iraq: the ministry's 2025 departmental classification,
 * https://iru.mohesr.gov.iq/dep, college طب اسنان, department اسنان/عام.
 * 50 colleges, which is the largest single department list on the portal and
 * more than half of them private.
 *
 * Kurdistan Region: absent from that table, as with English, because the
 * Region is administered separately. Gathered from the universities.
 *
 * THE ENTRY BAR, WHICH IS THE SAME FOR EVERYONE
 *
 * Dentistry does not work like cybersecurity, where each department has its
 * own published cut-off. Admission to a government dentistry college runs on
 * a single national minimum, 98% for 2025-2026, and seats are then allocated
 * by المفاضلة: applicants are ranked by grade, highest first, within each
 * channel and each governorate until the seats run out. So the number that
 * decides whether a student gets in is not per-university, and this file does
 * not pretend otherwise. `nationalMinimum` below carries it once.
 *
 * Private colleges sit lower and the ministry has ruled they move to 90% from
 * 2026-2027.
 *
 * The per-university figure here is the same kind as the English one: the
 * 2025 classification score, rating the college on the ministry's criteria.
 * It is not an entry grade. A student reading 0.00 next to a college is
 * reading a quality rating, not an open door.
 */

import { UNIVERSITIES } from './universities.js'

/** The one number that actually gates entry, for the whole country. */
export const DENTISTRY_ADMISSION = {
  governmentMinimum: 98,
  privateMinimum: null, // rising to 90 from 2026-2027; the current bar was not published in a source I could read
  note: 'Government dentistry takes a national minimum of 98% for 2025-26, then allocates seats by grade within each channel and governorate.',
}

/** [universityId, college, rank, score] — ministry 2025 classification. */
const DEPARTMENTS = [
  ['baghdad', 'College of Dentistry', 1, 85.35],
  ['mustansiriyah', 'College of Dentistry', 2, 74.12],
  ['kafeel', 'College of Dentistry', 3, 71.24],
  ['mosul', 'College of Dentistry', 4, 62.61],
  ['babylon', 'College of Dentistry', 5, 62.18],
  ['anbar', 'College of Dentistry', 6, 57.88],
  ['islamic', 'College of Dentistry', 7, 52.88],
  ['basrah', 'College of Dentistry', 8, 50.91],
  ['kirkuk', 'College of Dentistry', 9, 48.26],
  ['iraqia', 'College of Dentistry', 10, 48.18],
  ['tikrit', 'College of Dentistry', 11, 48.0],
  ['farahidi', 'College of Dentistry', 12, 47.52],
  ['kerbala', 'College of Dentistry', 13, 47.29],
  ['qadisiyah', 'College of Dentistry', 14, 47.09],
  ['uruk', 'College of Dentistry', 15, 47.0],
  ['kufa', 'College of Dentistry', 15, 47.0],
  ['wasit', 'College of Dentistry', 15, 47.0],
  ['ibnsina', 'College of Dentistry', 15, 47.0],
  ['kut', 'College of Dentistry', 16, 46.29],
  ['ainiraqia', 'College of Dentistry', 17, 45.86],
  ['bayan', 'College of Dentistry', 18, 45.0],
  ['biladrafidain', 'College of Dentistry', 19, 44.03],
  ['ameed', 'College of Dentistry', 20, 42.35],
  ['safwa', 'College of Dentistry', 21, 42.23],
  ['zahrawi', 'College of Dentistry', 22, 38.48],
  ['dijlah', 'College of Dentistry', 23, 36.0],
  ['mustaqbal', 'College of Dentistry', 24, 33.26],
  ['nust', 'College of Dentistry', 25, 33.12],
  ['kitab', 'College of Dentistry', 26, 26.51],
  ['rasheed', 'College of Dentistry', 27, 26.11],
  ['alnoor', 'College of Dentistry', 28, 25.88],
  ['muthanna', 'College of Dentistry', 29, 25.71],
  ['misan', 'College of Dentistry', 30, 25.09],
  ['yarmouk', 'College of Dentistry', 31, 24.75],
  ['thiqar', 'College of Dentistry', 32, 22.76],
  ['esraa', 'College of Dentistry', 33, 22.34],
  ['hadi', 'College of Dentistry', 34, 22.09],
  ['hilla', 'College of Dentistry', 34, 22.09],
  ['farabi', 'College of Dentistry', 35, 22.0],
  ['ashur', 'College of Dentistry', 35, 22.0],
  ['manara', 'College of Dentistry', 36, 15.65],
  ['hadba', 'College of Dentistry', 37, 8.8],
  ['usoolalilm', 'College of Dentistry', 38, 1.99],
  ['ahlbayt', 'College of Dentistry', 39, 0.59],
  ['maaqal', 'College of Dentistry', 40, 0.25],
  ['rafidainuc', 'College of Dentistry', 41, 0.18],
  ['mashreq', 'College of Dentistry', 42, 0.09],
  ['hikma', 'College of Dentistry', 43, 0.0],
  ['nukhba', 'College of Dentistry', 43, 0.0],
  ['kunooz', 'College of Dentistry', 43, 0.0],

  /* ---- Kurdistan Region: outside the federal table and its ranking ---- */
  ['hawlermedical', 'College of Dentistry', null, null],
  ['sulaimani', 'College of Dentistry', null, null],
  ['duhok', 'College of Dentistry', null, null],
  ['cihanerbil', 'College of Dentistry', null, null],
  ['auis', 'College of Dentistry', null, null],
  ['ukh', 'School of Medicine, BDS', null, null],
]

const KRG_IDS = new Set(['hawlermedical', 'sulaimani', 'duhok', 'cihanerbil', 'auis', 'ukh'])

export const DENTISTRY_COLLEGES = (() => {
  const byUni = new Map()
  for (const [uniId, college, rank, score] of DEPARTMENTS) {
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
    byUni.get(uniId).branches.push({
      college,
      rank,
      score,
      category: KRG_IDS.has(uniId) ? null : 'Dentistry',
      years: 5,
      degree: 'BDS',
    })
  }
  return [...byUni.values()]
})()

export const DENTISTRY_SOURCES = [
  {
    label: 'Iraqi Ministry of Higher Education, 2025 departmental classification',
    href: 'https://iru.mohesr.gov.iq/dep',
    covers: 'Federal Iraq: all 50 dentistry colleges, with rank and score.',
  },
  {
    label: 'Ministry ruling on dentistry and pharmacy admission limits',
    href: 'https://almadapaper.net/443099/',
    covers: 'The national admission minimum, and the move to 90% for private colleges from 2026-2027.',
  },
]

export const DENTISTRY_STATS = {
  departments: DEPARTMENTS.length,
  universities: DENTISTRY_COLLEGES.length,
  federal: DEPARTMENTS.filter(([id]) => !KRG_IDS.has(id)).length,
  krg: DEPARTMENTS.filter(([id]) => KRG_IDS.has(id)).length,
  publicCount: DENTISTRY_COLLEGES.filter((c) => c.kind === 'public').length,
  privateCount: DENTISTRY_COLLEGES.filter((c) => c.kind === 'private').length,
}
