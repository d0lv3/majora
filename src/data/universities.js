/**
 * Every institution the map can place, in one registry.
 *
 * Shared so a subject file lists departments and nothing else. A university
 * teaching both English and cybersecurity is one record and one pin, and its
 * coordinates cannot drift between two copies.
 *
 * [name, nameLocal, city, governorate, kind, lat, lng]
 *
 * Coordinates are city level, or a main campus where that is well known.
 * Good enough for "where in the country is this taught", not for navigation.
 */
export const UNIVERSITIES = {
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
  /* ---------------- added for cybersecurity, federal ---------------- */
  nahrain: ['Al-Nahrain University', 'جامعة النهرين', 'Baghdad', 'Baghdad', 'public', 33.2612, 44.3789],
  technology: ['University of Technology', 'الجامعة التكنولوجية', 'Baghdad', 'Baghdad', 'public', 33.2725, 44.4179],
  karkh: ['Al-Karkh University of Science', 'جامعة الكرخ للعلوم', 'Baghdad', 'Baghdad', 'public', 33.34, 44.32],
  mtu: ['Middle Technical University', 'الجامعة التقنية الوسطى', 'Baghdad', 'Baghdad', 'public', 33.322, 44.43],
  ntumosul: ['Northern Technical University, Mosul', 'الجامعة التقنية الشمالية/الموصل', 'Mosul', 'Nineveh', 'public', 36.34, 43.13],
  ntukirkuk: ['Northern Technical University, Kirkuk', 'الجامعة التقنية الشمالية/كركوك', 'Kirkuk', 'Kirkuk', 'public', 35.4681, 44.3922],
  stuthiqar: ['Southern Technical University, Thi-Qar', 'الجامعة التقنية الجنوبية/ذي قار', 'Nasiriyah', 'Thi-Qar', 'public', 31.054, 46.257],
  shaab: ['Al-Shaab University', 'جامعة الشعب', 'Baghdad', 'Baghdad', 'private', 33.35, 44.4],
  iraqisciences: ['Iraqi University of Sciences (Baghdad College)', 'جامعة العلوم العراقية', 'Baghdad', 'Baghdad', 'private', 33.31, 44.37],
}
