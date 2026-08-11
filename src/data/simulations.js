/**
 * The simulations, looked up by the major they belong to.
 *
 * Each one is the last level of its major's curriculum rather than a thing
 * beside it — see the closing section of the dentistry landing and of the
 * English Literature guide, which is where a reader is handed to them.
 *
 * They are different kinds, and the object says which: `screens` for a fixed
 * run of hand-built instruments, `story` for a branching scene graph,
 * `network` for a console you poke at. Simulation.jsx reads that field and
 * nothing else has to care.
 *
 * Kept beside landings.js and branches.js so the three things a major page can
 * carry are found the same way.
 */

import { ORTHODONTICS } from './simulations/orthodontics.js'
import { MACBETH } from './simulations/macbeth.js'
import { BREACH } from './simulations/breach.js'

const SIMULATIONS = {
  dentistry: ORTHODONTICS,
  'english-language-literature': MACBETH,
  cybersecurity: BREACH,
}

export const simulationFor = (majorSlug) => SIMULATIONS[majorSlug] ?? null
