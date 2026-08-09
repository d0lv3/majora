/**
 * The written-out body of a major's page.
 *
 * A major page is generic: head, whatever the department contains, related
 * majors. Some majors also have a landing written for them — a few sections of
 * prose that answer what the subject is, what you study, what you get good at
 * and where it leads. Cybersecurity is the first.
 *
 * Kept beside branches.js and pointing into ./landings, so the pattern is the
 * one the guides already use: one file per document, and a lookup that returns
 * null for every major nobody has written yet.
 */

import { CYBERSECURITY_LANDING } from './landings/cybersecurity.js'

const LANDINGS = {
  cybersecurity: CYBERSECURITY_LANDING,
}

export const landingFor = (majorSlug) => LANDINGS[majorSlug] ?? null
