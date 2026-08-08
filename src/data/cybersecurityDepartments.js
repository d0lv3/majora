/**
 * Cybersecurity departments in Iraq. Researched August 2026.
 *
 * WHY THIS IS NOT FROM THE SAME PLACE AS ENGLISH
 *
 * The ministry's 2025 departmental classification has no cybersecurity in it
 * at all. Every one of its 28 college types was checked, and the nearest
 * entries are Computer Science (علوم الحاسوب), Computer Engineering
 * (هندسة/الحاسوب), Information & Communications (هندسة/قسم المعلومات
 * والاتصالات) and Computer Techniques Engineering. The classification rates
 * established department types, and cybersecurity is too new to have earned
 * its own row. So an absence there is not evidence a department does not
 * exist; it only means the ministry does not yet rank it.
 *
 * WHAT THE NUMBER IS HERE
 *
 * `minScore` is the real thing this platform kept promising: the central
 * admission cut-off for 2025-2026, the grade a student actually needs. This
 * is a different quantity from the English file's `score`, which ranks a
 * department's quality. Do not average or compare them.
 *
 * Cut-offs for government universities are the published 2025-2026 minimums.
 * Where a department is confirmed to exist but its cut-off was not published
 * in a source I could read, `minScore` is null and the page says the cut-off
 * is not on record rather than inventing one.
 *
 * THE NAME VARIES, THE SUBJECT DOES NOT
 *
 * Iraqi universities run this under at least five names, and they are not
 * interchangeable: an engineering-technology degree and a science degree
 * differ in entry route and in what you graduate as. Each department keeps
 * the name its university uses.
 *
 *     الأمن السيبراني                    Cyber Security
 *     الشبكات والأمن السيبراني           Networks & Cyber Security
 *     هندسة الأمن السيبراني              Cyber Security Engineering
 *     هندسة تقنيات الأمن السيبراني       Cyber Security Technical Engineering
 *     علوم الأمن السيبراني               Cyber Security Science
 */

import { UNIVERSITIES } from './universities.js'

/**
 * [universityId, college, department, minScore, kindOfDegree]
 *
 * minScore null means the department is confirmed but the cut-off is not on
 * record, not that entry is unrestricted.
 */
const DEPARTMENTS = [
  /* -- government, with published 2025-2026 central admission cut-offs -- */
  ['nahrain', 'College of Information Engineering', 'Cyber Security', 96.46, 'Engineering'],
  ['iraqia', 'College of Engineering', 'Networks & Cyber Security', 94.43, 'Engineering'],
  ['technology', 'College of Engineering', 'Networks & Cyber Security', 94.29, 'Engineering'],
  ['muthanna', 'College of AI Engineering', 'Cyber Security', 90.71, 'Engineering'],
  ['karkh', 'College of Engineering', 'Cyber Security', 89.86, 'Engineering'],
  ['diyala', 'College of AI Engineering', 'Cyber Security', 89.57, 'Engineering'],
  ['mtu', 'College of Engineering, Baghdad', 'Cyber Security Technical Engineering', 87.29, 'Technical engineering'],
  ['ntukirkuk', 'College of Engineering, Kirkuk', 'Cyber Security Technical Engineering', 85.86, 'Technical engineering'],
  ['ntumosul', 'College of Engineering, Mosul', 'Cyber Security Technical Engineering', 85.29, 'Technical engineering'],
  ['stuthiqar', 'College of Engineering, Thi-Qar', 'Cyber Security Technical Engineering', 85.14, 'Technical engineering'],

  /* ---- government, department confirmed, cut-off not on record ---- */
  ['mosul', 'College of Computer Sciences & Mathematics', 'Cyber Security', null, 'Science'],
  ['basrah', 'College of Computer Science & IT', 'Cyber Security', null, 'Science'],

  /* ----------------------------- private ---------------------------- */
  ['mustaqbal', 'College of Engineering & Technologies', 'Cyber Security Technical Engineering', 57.0, 'Technical engineering'],
  ['esraa', 'College of Engineering', 'Cyber Security Engineering', null, 'Engineering'],
  ['esraa', 'College of Engineering', 'Cyber Security Technical Engineering', null, 'Technical engineering'],
  ['shaab', 'College of Engineering & Information Technology', 'Cyber Security Engineering', null, 'Engineering'],
  ['mamoon', 'Technical Engineering', 'Cyber Security Technical Engineering & Cloud Computing', null, 'Technical engineering'],
  ['iraqisciences', 'Baghdad College', 'Cyber Security Science', null, 'Science'],

  /* ---------------------------- Kurdistan --------------------------- */
  /* Outside the federal admission system, so no central cut-off exists. */
  ['ukh', 'School of Science & Engineering', 'Computer Science & Cyber Security', null, 'Science'],
]

const KRG_IDS = new Set(['ukh'])

export const CYBER_COLLEGES = (() => {
  const byUni = new Map()
  for (const [uniId, college, department, minScore, track] of DEPARTMENTS) {
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
      department,
      minScore,
      track,
      years: 4,
      degree: 'BSc',
    })
  }
  // hardest to get into first, then the ones with no published cut-off
  for (const entry of byUni.values()) {
    entry.branches.sort((a, b) => (b.minScore ?? -1) - (a.minScore ?? -1))
  }
  return [...byUni.values()]
})()

export const CYBER_SOURCES = [
  {
    label: 'Central admission cut-offs, government universities, 2025-2026',
    href: 'https://www.ahmed-aldaoody.com/2026/07/2025-2026_0773474016.html',
    covers: 'The published minimum grade for each government cybersecurity department.',
  },
  {
    label: 'University department pages',
    href: 'https://uomosul.edu.iq/computerscience/',
    covers:
      'Departments the cut-off list does not cover, including the private universities and the Kurdistan Region.',
  },
]

export const CYBER_STATS = {
  departments: DEPARTMENTS.length,
  universities: CYBER_COLLEGES.length,
  withCutoff: DEPARTMENTS.filter(([, , , s]) => s != null).length,
  withoutCutoff: DEPARTMENTS.filter(([, , , s]) => s == null).length,
}
