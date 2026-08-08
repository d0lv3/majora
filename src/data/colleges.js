/**
 * =====================================================================
 *  SAMPLE DATA. THE ADMISSION NUMBERS IN THIS FILE ARE INVENTED.
 * =====================================================================
 *
 * The universities and the cities are real, and the coordinates are real
 * city centres, so the map is a truthful map. Everything describing an
 * admission — acceptance rate, minimum score, seats — is made up, and so is
 * the claim that a given university runs a given department. None of it has
 * been checked against a ministry table or a university prospectus.
 *
 * It exists so the page can be built and reviewed before the real figures
 * arrive. Every screen that shows these numbers also says they are not real:
 * see SAMPLE_NOTICE below and the banner on the map page. Do not remove that
 * banner without replacing the numbers.
 *
 * Replacing it: keep the shape, drop `sample: true`, and delete the banner.
 * Admission in Iraq runs mostly on a central grade cut-off rather than a
 * per-university decision, so `minScore` is the number students actually
 * plan around; `acceptanceRate` is included because it is the number people
 * ask for.
 */

export const SAMPLE_NOTICE =
  'Sample figures, not real admission data. The universities and places are real; the rates, scores and seat counts are placeholders.'

/** Flip to false only when every number below has a source. */
export const DATA_IS_SAMPLE = true

/**
 * One entry per university. `programmes` is keyed by the major's slug, so a
 * university offering two of the three majors is still one pin on the map.
 */
export const COLLEGES = [
  /* ------------------------------- Baghdad ------------------------------ */
  {
    id: 'baghdad',
    university: 'University of Baghdad',
    city: 'Baghdad',
    governorate: 'Baghdad',
    kind: 'public',
    lat: 33.2726,
    lng: 44.3945,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.6,
        acceptanceRate: 4,
        seats: 190,
      },
    },
  },
  {
    id: 'technology',
    university: 'University of Technology',
    city: 'Baghdad',
    governorate: 'Baghdad',
    kind: 'public',
    lat: 33.2725,
    lng: 44.4179,
    programmes: {
      cybersecurity: {
        college: 'Department of Computer Sciences, Information Security branch',
        years: 4,
        language: 'English',
        minScore: 93.1,
        acceptanceRate: 11,
        seats: 90,
      },
    },
  },
  {
    id: 'nahrain',
    university: 'Al-Nahrain University',
    city: 'Baghdad',
    governorate: 'Baghdad',
    kind: 'public',
    lat: 33.2612,
    lng: 44.3789,
    programmes: {
      cybersecurity: {
        college: 'College of Information Engineering',
        years: 4,
        language: 'English',
        minScore: 94.8,
        acceptanceRate: 8,
        seats: 60,
      },
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.9,
        acceptanceRate: 3,
        seats: 110,
      },
    },
  },

  /* -------------------------------- North ------------------------------- */
  {
    id: 'salahaddin',
    university: 'Salahaddin University',
    city: 'Erbil',
    governorate: 'Erbil',
    kind: 'public',
    lat: 36.1901,
    lng: 44.0092,
    programmes: {
      cybersecurity: {
        college: 'College of Science, Computer Science department',
        years: 4,
        language: 'English',
        minScore: 88.2,
        acceptanceRate: 19,
        seats: 75,
      },
    },
  },
  {
    id: 'hawler-medical',
    university: 'Hawler Medical University',
    city: 'Erbil',
    governorate: 'Erbil',
    kind: 'public',
    lat: 36.1783,
    lng: 44.0093,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.8,
        acceptanceRate: 5,
        seats: 95,
      },
    },
  },
  {
    id: 'sulaimani',
    university: 'University of Sulaimani',
    city: 'Sulaymaniyah',
    governorate: 'Sulaymaniyah',
    kind: 'public',
    lat: 35.5606,
    lng: 45.4374,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.4,
        acceptanceRate: 6,
        seats: 85,
      },
    },
  },
  {
    id: 'auis',
    university: 'American University of Iraq, Sulaimani',
    city: 'Sulaymaniyah',
    governorate: 'Sulaymaniyah',
    kind: 'private',
    lat: 35.5327,
    lng: 45.3861,
    programmes: {
      cybersecurity: {
        college: 'Department of Information Technology',
        years: 4,
        language: 'English',
        minScore: 85.0,
        acceptanceRate: 24,
        seats: 45,
      },
    },
  },
  {
    id: 'duhok',
    university: 'University of Duhok',
    city: 'Duhok',
    governorate: 'Duhok',
    kind: 'public',
    lat: 36.8669,
    lng: 42.9883,
    programmes: {
      cybersecurity: {
        college: 'College of Science, Computer Science department',
        years: 4,
        language: 'English',
        minScore: 86.7,
        acceptanceRate: 22,
        seats: 65,
      },
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.1,
        acceptanceRate: 7,
        seats: 70,
      },
    },
  },
  {
    id: 'mosul',
    university: 'University of Mosul',
    city: 'Mosul',
    governorate: 'Nineveh',
    kind: 'public',
    lat: 36.3776,
    lng: 43.1601,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.1,
        acceptanceRate: 5,
        seats: 130,
      },
    },
  },
  {
    id: 'kirkuk',
    university: 'University of Kirkuk',
    city: 'Kirkuk',
    governorate: 'Kirkuk',
    kind: 'public',
    lat: 35.4681,
    lng: 44.3922,
    programmes: {
      cybersecurity: {
        college: 'College of Computer Science and Information Technology',
        years: 4,
        language: 'English',
        minScore: 84.3,
        acceptanceRate: 27,
        seats: 55,
      },
    },
  },
  {
    id: 'tikrit',
    university: 'Tikrit University',
    city: 'Tikrit',
    governorate: 'Salah al-Din',
    kind: 'public',
    lat: 34.6116,
    lng: 43.6786,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.6,
        acceptanceRate: 6,
        seats: 75,
      },
    },
  },
  {
    id: 'babylon',
    university: 'University of Babylon',
    city: 'Hilla',
    governorate: 'Babil',
    kind: 'public',
    lat: 32.4722,
    lng: 44.4333,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.9,
        acceptanceRate: 5,
        seats: 100,
      },
    },
  },
  {
    id: 'kufa',
    university: 'University of Kufa',
    city: 'Najaf',
    governorate: 'Najaf',
    kind: 'public',
    lat: 32.0282,
    lng: 44.3416,
    programmes: {
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.2,
        acceptanceRate: 4,
        seats: 105,
      },
    },
  },
  {
    id: 'basrah',
    university: 'University of Basrah',
    city: 'Basra',
    governorate: 'Basra',
    kind: 'public',
    lat: 30.5081,
    lng: 47.7835,
    programmes: {
      cybersecurity: {
        college: 'College of Computer Science and Information Technology',
        years: 4,
        language: 'English',
        minScore: 87.5,
        acceptanceRate: 20,
        seats: 70,
      },
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.0,
        acceptanceRate: 5,
        seats: 115,
      },
    },
  },
]

/** Every college that runs the given major, nearest the top of the map first. */
export function collegesFor(majorSlug) {
  return COLLEGES.filter((c) => Boolean(c.programmes[majorSlug])).sort(
    (a, b) => b.lat - a.lat,
  )
}

/** The majors this page can actually plot. */
export function mappedMajorSlugs() {
  const slugs = new Set()
  for (const college of COLLEGES) {
    for (const slug of Object.keys(college.programmes)) slugs.add(slug)
  }
  return [...slugs]
}

/** Roughly the country, used to frame the map before anything is selected. */
export const IRAQ_BOUNDS = [
  [28.5, 38.7],
  [37.4, 48.8],
]
