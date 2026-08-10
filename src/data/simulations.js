/**
 * The simulations, looked up by the major they belong to.
 *
 * One so far, and it is the last level of the dentistry curriculum rather than
 * a thing beside it — see the closing section of the dentistry landing, which
 * is where a reader is handed to it.
 *
 * Kept beside landings.js and branches.js so the three things a major page can
 * carry are found the same way.
 */

import { ORTHODONTICS } from './simulations/orthodontics.js'

const SIMULATIONS = {
  dentistry: ORTHODONTICS,
}

export const simulationFor = (majorSlug) => SIMULATIONS[majorSlug] ?? null
