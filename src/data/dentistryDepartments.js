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
 * THE CLASSIFICATION SCORE IS NOT HERE, DELIBERATELY
 *
 * The ministry's table carries a rank and a quality score per college, and
 * this file used to carry both. They are gone, for the same reason as in the
 * English file: on a page about admission, every reader took the score for an
 * entry bar, and a student reading 0.00 next to a college was reading a
 * quality rating as a locked door. The table is now used only for which
 * colleges exist and where they are.
 */

import { UNIVERSITIES } from './universities.js'

/**
 * The one number that actually gates entry, for the whole country. Not shown
 * on the map any more — the note that carried it is gone — but kept because
 * it is the single fact a dentistry applicant most needs, and the next page
 * that wants to say it should not have to re-research it.
 */
export const DENTISTRY_ADMISSION = {
  governmentMinimum: 98,
  privateMinimum: null, // rising to 90 from 2026-2027; the current bar was not published in a source I could read
  note: 'Government dentistry takes a national minimum of 98% for 2025-26, then allocates seats by grade within each channel and governorate.',
}

/** [universityId, college] — which universities run one, from the ministry list. */
const DEPARTMENTS = [
  ['baghdad', 'College of Dentistry'],
  ['mustansiriyah', 'College of Dentistry'],
  ['kafeel', 'College of Dentistry'],
  ['mosul', 'College of Dentistry'],
  ['babylon', 'College of Dentistry'],
  ['anbar', 'College of Dentistry'],
  ['islamic', 'College of Dentistry'],
  ['basrah', 'College of Dentistry'],
  ['kirkuk', 'College of Dentistry'],
  ['iraqia', 'College of Dentistry'],
  ['tikrit', 'College of Dentistry'],
  ['farahidi', 'College of Dentistry'],
  ['kerbala', 'College of Dentistry'],
  ['qadisiyah', 'College of Dentistry'],
  ['uruk', 'College of Dentistry'],
  ['kufa', 'College of Dentistry'],
  ['wasit', 'College of Dentistry'],
  ['ibnsina', 'College of Dentistry'],
  ['kut', 'College of Dentistry'],
  ['ainiraqia', 'College of Dentistry'],
  ['bayan', 'College of Dentistry'],
  ['biladrafidain', 'College of Dentistry'],
  ['ameed', 'College of Dentistry'],
  ['safwa', 'College of Dentistry'],
  ['zahrawi', 'College of Dentistry'],
  ['dijlah', 'College of Dentistry'],
  ['mustaqbal', 'College of Dentistry'],
  ['nust', 'College of Dentistry'],
  ['kitab', 'College of Dentistry'],
  ['rasheed', 'College of Dentistry'],
  ['alnoor', 'College of Dentistry'],
  ['muthanna', 'College of Dentistry'],
  ['misan', 'College of Dentistry'],
  ['yarmouk', 'College of Dentistry'],
  ['thiqar', 'College of Dentistry'],
  ['esraa', 'College of Dentistry'],
  ['hadi', 'College of Dentistry'],
  ['hilla', 'College of Dentistry'],
  ['farabi', 'College of Dentistry'],
  ['ashur', 'College of Dentistry'],
  ['manara', 'College of Dentistry'],
  ['hadba', 'College of Dentistry'],
  ['usoolalilm', 'College of Dentistry'],
  ['ahlbayt', 'College of Dentistry'],
  ['maaqal', 'College of Dentistry'],
  ['rafidainuc', 'College of Dentistry'],
  ['mashreq', 'College of Dentistry'],
  ['hikma', 'College of Dentistry'],
  ['nukhba', 'College of Dentistry'],
  ['kunooz', 'College of Dentistry'],

  /* ---- Kurdistan Region: outside the federal table and its ranking ---- */
  ['hawlermedical', 'College of Dentistry'],
  ['sulaimani', 'College of Dentistry'],
  ['duhok', 'College of Dentistry'],
  ['cihanerbil', 'College of Dentistry'],
  ['auis', 'College of Dentistry'],
  ['ukh', 'School of Medicine, BDS'],
]

const KRG_IDS = new Set(['hawlermedical', 'sulaimani', 'duhok', 'cihanerbil', 'auis', 'ukh'])

export const DENTISTRY_COLLEGES = (() => {
  const byUni = new Map()
  for (const [uniId, college] of DEPARTMENTS) {
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
      category: KRG_IDS.has(uniId) ? null : 'Dentistry',
      years: 5,
      degree: 'BDS',
    })
  }
  return [...byUni.values()]
})()

/**
 * Where the college list came from. Not read by any page — the map states no
 * figures that need attributing now — but kept so the next person to touch
 * this file knows which table these rows were transcribed out of.
 */
export const DENTISTRY_SOURCES = [
  {
    label: 'Iraqi Ministry of Higher Education, 2025 departmental classification',
    href: 'https://iru.mohesr.gov.iq/dep',
    covers: 'Federal Iraq: which universities run a dentistry college, all 50 of them.',
  },
  {
    label: 'Ministry ruling on dentistry and pharmacy admission limits',
    href: 'https://almadapaper.net/443099/',
    covers: 'The national admission minimum, and the move to 90% for private colleges from 2026-2027.',
  },
]
