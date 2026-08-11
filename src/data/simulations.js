/**
 * The simulations, looked up by the major they belong to.
 *
 * Each one is the last level of its major's curriculum rather than a thing
 * beside it — see the closing section of the dentistry landing and of the
 * English Literature guide, which is where a reader is handed to them.
 *
 * They are different kinds, and the object says which: `screens` for a fixed
 * run of hand-built instruments, `story` for a branching scene graph,
 * `network` for a console you poke at, `jaw` for a specimen you turn over.
 * Simulation.jsx reads that field and nothing else has to care.
 *
 * A major may have more than one. Dentistry does: the anatomy bench, which is
 * the first weeks of the degree, and the Year 5 clinic, which is the whole of
 * it played out. They are listed in the order a reader should meet them — the
 * jaw first, because it teaches the language the clinic then speaks — and the
 * first is what /app/<major>/simulation opens. Both are linked by name from the
 * dentistry page, so nothing depends on which happens to be first.
 *
 * Kept beside landings.js and branches.js so the three things a major page can
 * carry are found the same way.
 */

import { ORTHODONTICS } from './simulations/orthodontics.js'
import { JAW } from './simulations/jaw.js'
import { MACBETH } from './simulations/macbeth.js'
import { BREACH } from './simulations/breach.js'

const SIMULATIONS = {
  dentistry: [JAW, ORTHODONTICS],
  'english-language-literature': [MACBETH],
  cybersecurity: [BREACH],
}

/**
 * One simulation, by major and — when a major has several — by its slug.
 *
 * Without a slug you get the major's first, which is what the bare
 * /app/<major>/simulation route asks for. With one that does not match you get
 * nothing rather than a silent fallback to the first, so a mistyped link shows
 * the "no simulation here" page instead of quietly opening the wrong one.
 */
export const simulationFor = (majorSlug, simSlug) => {
  const list = SIMULATIONS[majorSlug]
  if (!list?.length) return null
  if (!simSlug) return list[0]
  return list.find((s) => s.slug === simSlug) ?? null
}

/** Every simulation a major has, for a page that wants to offer the choice. */
export const simulationsFor = (majorSlug) => SIMULATIONS[majorSlug] ?? []
