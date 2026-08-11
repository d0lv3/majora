/**
 * The state of a network console, and every way it is allowed to change.
 *
 * The third state model on the site, and it is a third shape because the
 * simulation is. The clinic keeps a case file. The story keeps a path through
 * a graph. This keeps a *position*: what you have looked at, what you noticed,
 * where you can reach, and — after the turn — what you chose to fix.
 *
 * Reach is the whole mechanic. It starts as the internet and nothing else, and
 * every step of the chain adds a node to it, which is what makes the map open
 * up as you go rather than being handed over at the start. The defence phase
 * reads the same field back to draw the path you took.
 */

export const PHASES = ['recon', 'turn', 'hunt', 'harden', 'replay', 'debrief']

export const initialNetState = () => ({
  phase: 'recon',
  /** Which node's inspector is open. */
  selected: 'web',
  /** Nodes you can talk to. The internet, and then whatever you take. */
  reached: ['you', 'web'],
  /** Observation ids the reader has actually read. */
  noticed: [],
  /** Step ids taken, in order. */
  taken: [],
  /** Term ids revealed, so a name is never given twice. */
  named: [],
  /** Log line ids the reader has marked as their own. */
  marked: [],
  huntDone: false,
  /** Fix ids chosen, capped by the budget in the content. */
  fixes: [],
})

export function netReducer(state, action) {
  switch (action.type) {
    case 'select':
      return { ...state, selected: action.id }

    case 'notice':
      return state.noticed.includes(action.id)
        ? state
        : { ...state, noticed: [...state.noticed, action.id] }

    /* A step of the chain. It records what was done, opens up whatever it
       reaches, and reveals any term that was waiting on it — one action,
       because a move and the ground it gains can never come apart. */
    case 'take': {
      if (state.taken.includes(action.step.id)) return state
      const reached = [
        ...state.reached,
        ...action.step.opens.filter((n) => !state.reached.includes(n)),
      ]
      const named = [...state.named, ...action.reveals.filter((t) => !state.named.includes(t))]
      return {
        ...state,
        taken: [...state.taken, action.step.id],
        reached,
        named,
        /* Follow the reader to the ground the step just opened, so the map
           moves with them instead of leaving them looking at where they were. */
        selected: action.step.opens[0] ?? state.selected,
      }
    }

    case 'phase':
      return { ...state, phase: action.to }

    case 'mark': {
      const marked = state.marked.includes(action.id)
        ? state.marked.filter((x) => x !== action.id)
        : [...state.marked, action.id]
      return { ...state, marked }
    }

    case 'huntDone':
      return { ...state, huntDone: true }

    /* Budget is enforced here rather than in the view, so there is one answer
       to "can I have another one" and the board only has to ask. */
    case 'fix': {
      if (state.fixes.includes(action.id)) {
        return { ...state, fixes: state.fixes.filter((f) => f !== action.id) }
      }
      if (state.fixes.length >= action.budget) return state
      return { ...state, fixes: [...state.fixes, action.id] }
    }

    case 'restart':
      return initialNetState()

    default:
      return state
  }
}

/** Whether every observation a step waits on has been read. */
export const stepReady = (step, noticed) => step.needs.every((n) => noticed.includes(n))

/** The step a node is offering, if it is offering one and has not been used. */
export const stepAt = (sim, nodeId, state) =>
  sim.steps.find((s) => s.at === nodeId && !state.taken.includes(s.id)) ?? null

/** Observations visible on a node: gated ones wait for the step that earns them. */
export const observationsAt = (sim, nodeId, taken) =>
  (sim.observations[nodeId] ?? []).filter((o) => !o.after || taken.includes(o.after))

/**
 * Which act the rail should light, derived rather than stored — the phase and
 * the chain between them already say where the reader is.
 */
export function actOf(sim, state) {
  if (state.phase === 'recon') {
    if (state.taken.length === 0) return 'recon'
    if (state.taken.length === 1) return 'entry'
    return 'move'
  }
  if (state.phase === 'turn') return 'turn'
  if (state.phase === 'hunt') return 'hunt'
  if (state.phase === 'harden') return 'harden'
  return 'replay'
}

/**
 * Run both attack paths against the chosen fixes.
 *
 * No score comes out of this on purpose. Each step is blocked or it is not,
 * and the reader is told which — the shape of what is left is the lesson, and
 * turning it into a mark out of ten would be the one thing the specification
 * for these simulations forbids.
 */
export function replay(sim, fixes) {
  const blocked = new Set(sim.fixes.filter((f) => fixes.includes(f.id)).flatMap((f) => f.blocks))
  const watching = sim.fixes.some((f) => fixes.includes(f.id) && f.detects)

  return sim.paths.map((path) => {
    let stoppedAt = null
    const steps = path.steps.map((s) => {
      if (stoppedAt) return { ...s, state: 'moot' }
      if (!s.unblockable && blocked.has(s.id)) {
        stoppedAt = s.id
        return { ...s, state: 'blocked' }
      }
      return { ...s, state: 'through' }
    })
    return {
      id: path.id,
      label: path.label,
      intro: path.intro,
      steps,
      reachedEnd: !stoppedAt,
      stoppedAt,
      watching,
    }
  })
}
