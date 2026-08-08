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
 * City level, not campus level. Each university sits on its city, or on its
 * main campus where that is well known. Good enough to answer "where in the
 * country is this taught"; not good enough to navigate to a gate.
 */

/** One record per institution. */
const UNIVERSITIES = {
  /* ------------------------- federal, Baghdad ------------------------- */
  baghdad: ['University of Baghdad', 'جامعة بغداد', 'Baghdad', 'Baghdad', 'public', 33.2726, 44.3945],
  mustansiriyah: ['Mustansiriyah University', 'الجامعة المستنصرية', 'Baghdad', 'Baghdad', 'public', 33.3775, 44.4283],
  iraqia: ['Iraqi University', 'الجامعة العراقية', 'Baghdad', 'Baghdad', 'public', 33.372, 44.356],
  turath: ['Al-Turath University', 'جامعة التراث', 'Baghdad', 'Baghdad', 'private', 33.3125, 44.345],
  dijlah: ['Dijlah University College', 'جامعة دجلة', 'Baghdad', 'Baghdad', 'private', 33.2585, 44.4104],
  mansour: ['Al-Mansour University College', 'كلية المنصور الجامعة', 'Baghdad', 'Baghdad', 'private', 33.322, 44.363],
  mamoon: ['Al-Mamoon University College', 'جامعة المامون', 'Baghdad', 'Baghdad', 'private', 33.308, 44.33],
  esraa: ['Al-Esraa University', 'جامعة الاسراء', 'Baghdad', 'Baghdad', 'private', 33.268, 44.439],
  nisour: ['Al-Nisour University', 'جامعة النسور', 'Baghdad', 'Baghdad', 'private', 33.34, 44.29],
  farahidi: ['Al-Farahidi University', 'جامعة الفراهيدي', 'Baghdad', 'Baghdad', 'private', 33.33, 44.44],
  hikma: ['Al-Hikma University College', 'كلية الحكمة الجامعة', 'Baghdad', 'Baghdad', 'private', 33.34, 44.42],
  salam: ['Al-Salam University College', 'كلية السلام الجامعة', 'Baghdad', 'Baghdad', 'private', 33.33, 44.39],
  kadhim: ['Imam Al-Kadhim College', 'كلية الامام الكاظم', 'Baghdad', 'Baghdad', 'private', 33.38, 44.34],

  /* --------------------------- federal, north -------------------------- */
  mosul: ['University of Mosul', 'جامعة الموصل', 'Mosul', 'Nineveh', 'public', 36.3776, 43.1601],
  hadba: ['Al-Hadba University College', 'جامعة الحدباء', 'Mosul', 'Nineveh', 'private', 36.34, 43.13],
  alnoor: ['Alnoor University', 'جامعة النور', 'Mosul', 'Nineveh', 'private', 36.35, 43.15],
  hamdaniya: ['Al-Hamdaniya University', 'جامعة الحمدانية', 'Bakhdida', 'Nineveh', 'public', 36.2717, 43.3789],
  kirkuk: ['University of Kirkuk', 'جامعة كركوك', 'Kirkuk', 'Kirkuk', 'public', 35.4681, 44.3922],
  kitab: ['Al-Kitab University', 'جامعة الكتاب', 'Altun Kupri', 'Kirkuk', 'private', 35.7581, 44.1442],
  qalam: ['Al-Qalam University College', 'جامعة القلم', 'Kirkuk', 'Kirkuk', 'private', 35.46, 44.4],
  tikrit: ['Tikrit University', 'جامعة تكريت', 'Tikrit', 'Salah al-Din', 'public', 34.6116, 43.6786],
  samarra: ['University of Samarra', 'جامعة سامراء', 'Samarra', 'Salah al-Din', 'public', 34.1959, 43.8742],
  anbar: ['University of Anbar', 'جامعة الانبار', 'Ramadi', 'Anbar', 'public', 33.4206, 43.3073],
  maaref: ['Al-Maaref University College', 'جامعة المعارف', 'Ramadi', 'Anbar', 'private', 33.43, 43.3],
  diyala: ['University of Diyala', 'جامعة ديالى', 'Baqubah', 'Diyala', 'public', 33.7444, 44.6439],
  biladrafidain: ['Bilad Alrafidain University', 'جامعة بلاد الرافدين', 'Baqubah', 'Diyala', 'private', 33.75, 44.64],
  yarmouk: ['Al-Yarmouk University College', 'كلية اليرموك الجامعة', 'Baqubah', 'Diyala', 'private', 33.74, 44.63],

  /* ------------------------- federal, mid & south ---------------------- */
  babylon: ['University of Babylon', 'جامعة بابل', 'Hilla', 'Babil', 'public', 32.4722, 44.4333],
  mustaqbal: ['Al-Mustaqbal University', 'جامعة المستقبل', 'Hilla', 'Babil', 'private', 32.4637, 44.4326],
  hilla: ['University of Hilla', 'جامعة الحلة', 'Hilla', 'Babil', 'private', 32.47, 44.42],
  kerbala: ['University of Kerbala', 'جامعة كربلاء', 'Karbala', 'Karbala', 'public', 32.616, 44.025],
  ahlbayt: ['Ahl Al Bayt University', 'جامعة اهل البيت', 'Karbala', 'Karbala', 'private', 32.61, 44.03],
  zahraa: ['Al-Zahraa University for Women', 'جامعة الزهراء للبنات', 'Karbala', 'Karbala', 'private', 32.62, 44.02],
  kufa: ['University of Kufa', 'جامعة الكوفة', 'Najaf', 'Najaf', 'public', 32.0282, 44.3416],
  islamic: ['Islamic University', 'الجامعة الاسلامية', 'Najaf', 'Najaf', 'private', 32.03, 44.34],
  qadisiyah: ['University of Al-Qadisiyah', 'جامعة القادسية', 'Diwaniyah', 'Al-Qadisiyah', 'public', 31.993, 44.926],
  wasit: ['University of Wasit', 'جامعة واسط', 'Kut', 'Wasit', 'public', 32.513, 45.818],
  muthanna: ['Al-Muthanna University', 'جامعة المثنى', 'Samawah', 'Muthanna', 'public', 31.318, 45.281],
  sawa: ['Sawa University', 'جامعة ساوة', 'Samawah', 'Muthanna', 'private', 31.32, 45.28],
  thiqar: ['University of Thi-Qar', 'جامعة ذي قار', 'Nasiriyah', 'Thi-Qar', 'public', 31.054, 46.257],
  mazaya: ['Al-Mazaya University College', 'كلية المزايا الجامعة', 'Nasiriyah', 'Thi-Qar', 'private', 31.05, 46.26],
  misan: ['University of Misan', 'جامعة ميسان', 'Amarah', 'Maysan', 'public', 31.836, 47.145],
  farqadain: ['Al-Farqadain University College', 'جامعة الفرقدين', 'Amarah', 'Maysan', 'private', 31.84, 47.15],
  basrah: ['University of Basrah', 'جامعة البصرة', 'Basra', 'Basra', 'public', 30.5081, 47.7835],
  maaqal: ['Al-Maaqal University', 'جامعة المعقل', 'Basra', 'Basra', 'private', 30.53, 47.79],
  shattarab: ['Shatt Al-Arab University', 'جامعة شط العرب', 'Basra', 'Basra', 'private', 30.52, 47.8],

  /* ----------------------------- Kurdistan ---------------------------- */
  salahaddin: ['Salahaddin University-Erbil', 'زانکۆی سەڵاحەددین', 'Erbil', 'Erbil', 'public', 36.1901, 44.0092],
  ukh: ['University of Kurdistan Hewlêr', 'زانکۆی کوردستان هەولێر', 'Erbil', 'Erbil', 'public', 36.1735, 44.0088],
  tishk: ['Tishk International University', 'زانکۆی تیشک', 'Erbil', 'Erbil', 'private', 36.2065, 44.0092],
  cihanerbil: ['Cihan University-Erbil', 'زانکۆی جیهان', 'Erbil', 'Erbil', 'private', 36.2229, 44.0146],
  knowledge: ['Knowledge University', 'زانکۆی نۆلیج', 'Erbil', 'Erbil', 'private', 36.2286, 44.0086],
  lfu: ['Lebanese French University', 'زانکۆی لوبنانی فەڕەنسی', 'Erbil', 'Erbil', 'private', 36.211, 44.009],
  koya: ['Koya University', 'زانکۆی کۆیە', 'Koya', 'Erbil', 'public', 36.0806, 44.6383],
  soran: ['Soran University', 'زانکۆی سۆران', 'Soran', 'Erbil', 'public', 36.6528, 44.5417],
  sulaimani: ['University of Sulaimani', 'زانکۆی سلێمانی', 'Sulaymaniyah', 'Sulaymaniyah', 'public', 35.5606, 45.4374],
  auis: ['American University of Iraq, Sulaimani', 'زانکۆی ئەمریکی', 'Sulaymaniyah', 'Sulaymaniyah', 'private', 35.5327, 45.3861],
  raparin: ['University of Raparin', 'زانکۆی ڕاپەڕین', 'Ranya', 'Sulaymaniyah', 'public', 36.2536, 44.8797],
  garmian: ['University of Garmian', 'زانکۆی گەرمیان', 'Kalar', 'Sulaymaniyah', 'public', 34.6288, 45.3222],
  charmo: ['Charmo University', 'زانکۆی چەرموو', 'Chamchamal', 'Sulaymaniyah', 'public', 35.5306, 44.8339],
  halabja: ['University of Halabja', 'زانکۆی هەڵەبجە', 'Halabja', 'Halabja', 'public', 35.1778, 45.9864],
  duhok: ['University of Duhok', 'زانکۆیا دهۆک', 'Duhok', 'Duhok', 'public', 36.8669, 42.9883],
  nawroz: ['Nawroz University', 'زانکۆیا نەورۆز', 'Duhok', 'Duhok', 'private', 36.86, 43.0],
  zakho: ['University of Zakho', 'زانکۆیا زاخۆ', 'Zakho', 'Duhok', 'public', 37.1436, 42.6816],
}

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
