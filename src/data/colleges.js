/**
 * =====================================================================
 *  SAMPLE DATA. THE ADMISSION NUMBERS IN THIS FILE ARE INVENTED.
 * =====================================================================
 *
 * All that is left here is dentistry. English and cybersecurity used to sit
 * alongside it and have both been replaced by researched data, in
 * englishDepartments.js and cybersecurityDepartments.js. This file is what
 * has not been done yet.
 *
 * The universities and cities are real. Every acceptance rate, minimum score
 * and seat count below is made up, and so is the claim that a given
 * university runs the department at all. The map shows a warning whenever a
 * major reads from here. Delete the entry, not the warning.
 */

export const SAMPLE_NOTICE =
  'Sample figures, not real admission data. The universities and places are real; the rates, scores and seat counts are placeholders.'

/** Only true while any major still reads from this file. */
export const DATA_IS_SAMPLE = true

export const COLLEGES = [
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
        seats: 190
      }
    }
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
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98.9,
        acceptanceRate: 3,
        seats: 110
      }
    }
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
        seats: 95
      }
    }
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
        seats: 85
      }
    }
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
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 97.1,
        acceptanceRate: 7,
        seats: 70
      }
    }
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
        seats: 130
      }
    }
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
        seats: 75
      }
    }
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
        seats: 100
      }
    }
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
        seats: 105
      }
    }
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
      dentistry: {
        college: 'College of Dentistry',
        years: 5,
        language: 'English',
        minScore: 98,
        acceptanceRate: 5,
        seats: 115
      }
    }
  }
]
