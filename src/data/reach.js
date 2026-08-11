import abdullah from '../assets/reach/abdullah-al-nuaimi.jpg'
import mohammed from '../assets/reach/mohammed-al-fatih.jpg'
import { UNIVERSITIES } from './universities.js'

/**
 * Reach — the people you can book time with.
 *
 * The rest of the site answers what a major is. This answers what it is like,
 * which is a question only somebody inside it can take: whether the timetable
 * leaves room for a job, what the labs are really equipped with, whether the
 * degree opened the door it was supposed to. A write-up cannot be asked a
 * follow-up. A person can.
 *
 * WHAT IS HERE AND WHAT IS NOT
 *
 * Everything on a card is either something the person told us — their name,
 * their photograph, what they studied and where, their LinkedIn — or something
 * about the product, like what a session costs. Nothing is inferred. There is
 * deliberately no "specialities" or "ask me about" field written on anyone's
 * behalf: the booking form suggests topics from the major's own entry in the
 * library instead, which is our claim about the subject rather than a claim
 * about them.
 *
 * Static for now — this is the shape a `GET /reach/people` response should
 * return. `photo` becomes a URL rather than an import when it does; everything
 * else already survives the move.
 */

/**
 * PRICES ARE PLACEHOLDERS. Every `sessions` block below is a guess at a
 * sensible number, not a rate anybody has agreed to. Set them, per person,
 * before this goes anywhere near a real reader.
 */
export const CURRENCY = 'IQD'

/** 15,000 → "15,000 IQD". Grouped, because six digits unbroken are unreadable. */
export const price = (amount) => `${amount.toLocaleString('en-US')} ${CURRENCY}`

export const PEOPLE = [
  {
    id: 'abdullah-al-nuaimi',
    name: 'Abdullah Al-Nuaimi',
    photo: abdullah,
    /* Written for somebody who cannot see it and is deciding whether to book a
       call, so it describes the person rather than the room. */
    photoAlt: 'Abdullah Al-Nuaimi speaking into a handheld microphone at a conference',
    /* The line under the name. The person's own words for what they are
       studying, not our tidied version of it. */
    headline: 'Cybersecurity Technical Engineering Undergraduate',
    /* Which library majors this person can speak to. Drives the filter and the
       suggested topics in the booking form. */
    majors: ['cybersecurity'],
    study: [
      {
        award: 'Cybersecurity Technical Engineering',
        level: 'Undergraduate',
        uni: 'mtu',
        current: true,
      },
    ],
    linkedin: 'https://www.linkedin.com/in/d0lv3/',
    sessions: [
      { minutes: 30, amount: 15000 },
      { minutes: 60, amount: 25000 },
    ],
  },

  {
    id: 'mohammed-al-fatih',
    name: 'Mohammed Al-Fatih',
    photo: mohammed,
    photoAlt: 'Mohammed Al-Fatih in a white shirt and tie, seated in front of a branded backdrop',
    headline: 'BA in Translation, MA in progress',
    majors: ['translation'],
    /* Two degrees, and the second is unfinished — which is worth showing
       rather than flattening, because "doing a master's abroad now" is exactly
       the thing a reader considering this major would want to ask about. */
    study: [
      {
        award: 'BA in Translation',
        level: 'College of Art',
        uni: 'mosul',
      },
      {
        award: 'MA in Translation',
        level: 'College of Art',
        /* Not in UNIVERSITIES: that registry is the map's, and the map is
           Iraq. An institution outside it carries its own name here. */
        uni: null,
        place: 'Al-Yarmouk University',
        where: 'Jordan',
        current: true,
      },
    ],
    linkedin: 'https://www.linkedin.com/in/mohammed-al-fatih-mowafaq-32855228a',
    sessions: [
      { minutes: 30, amount: 15000 },
      { minutes: 60, amount: 25000 },
    ],
  },
]

/* ------------------------------- lookups -------------------------------- */

/**
 * An institution's display name, wherever it came from.
 *
 * Registry first, so a university the map already knows is spelled the way the
 * map spells it and cannot drift; `place` for anywhere the map does not cover.
 */
export const schoolName = (entry) =>
  (entry.uni ? UNIVERSITIES[entry.uni]?.[0] : entry.place) ?? entry.place ?? 'Unknown'

/** The key a filter groups by — the registry id where there is one. */
export const schoolId = (entry) => entry.uni ?? `x:${entry.place}`

/** Every institution any of these people studied at, once each, A–Z. */
export function schoolsOf(people) {
  const seen = new Map()
  for (const person of people) {
    for (const entry of person.study) {
      const id = schoolId(entry)
      if (!seen.has(id)) seen.set(id, { id, name: schoolName(entry), count: 0 })
    }
  }
  /* Counted per person, not per degree: two degrees at one university is one
     person you can book, and a filter that said "2" would be lying about how
     many cards it is about to show. */
  for (const person of people) {
    for (const id of new Set(person.study.map(schoolId))) {
      const school = seen.get(id)
      if (school) school.count += 1
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** Every major any of these people can speak to, once each, with counts. */
export function majorsOf(people) {
  const seen = new Map()
  for (const person of people) {
    for (const slug of person.majors) {
      seen.set(slug, (seen.get(slug) ?? 0) + 1)
    }
  }
  return seen
}

export const getPerson = (id) => PEOPLE.find((p) => p.id === id)
