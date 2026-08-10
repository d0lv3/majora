/**
 * The state of a branching story, and every way it is allowed to change.
 *
 * Small on purpose. A story simulation only ever needs to know where you are,
 * what you have decided, and what you answered — everything else is content,
 * and content lives in data/simulations. Compare src/sim/state.js, which holds
 * a clinic's worth of findings because the orthodontics case genuinely has
 * them.
 *
 * `choices` is the interesting one. Scenes read it back through `by`/`variants`
 * to change what they say, so a decision made in the second scene is still
 * shaping the prose in the tenth. `answers` is kept per scene so a literature
 * question stays answered if the reader ever comes back to it.
 */

export const initialStoryState = (sim) => ({
  sceneId: sim.first,
  /* Where the reader has been. The journey branches, so this is a set of
     places rather than a high-water mark. */
  visited: [sim.first],
  choices: {},
  answers: {},
})

const arriveAt = (state, id) => ({
  ...state,
  sceneId: id,
  visited: state.visited.includes(id) ? state.visited : [...state.visited, id],
})

export function storyReducer(state, action) {
  switch (action.type) {
    case 'go':
      return action.to ? arriveAt(state, action.to) : state

    /* A story choice: record what it decided, then move. One action rather
       than two so a decision and its consequence can never come apart. */
    case 'choose':
      return arriveAt({ ...state, choices: { ...state.choices, ...action.set } }, action.to)

    case 'answer':
      return {
        ...state,
        answers: { ...state.answers, [action.scene]: { id: action.id, correct: action.correct } },
      }

    case 'restart':
      return initialStoryState(action.sim)

    default:
      return state
  }
}

/**
 * Resolve a value that may depend on an earlier choice.
 *
 * Data writes either the thing itself or `{ by: 'belief', variants: {...} }`,
 * and every reader of the content goes through here so the two forms are
 * interchangeable everywhere — prose, quoted lines, whole choice blocks, and
 * which scene comes next.
 */
export function resolve(value, choices) {
  if (!value || !value.by) return value
  return value.variants?.[choices[value.by]] ?? value.variants?.default ?? null
}
