/**
 * The state of the jaw console, and every way it is allowed to change.
 *
 * The fourth state model on the site. The clinic keeps a case file, the story
 * keeps a path through a graph, the network keeps a position. This keeps an
 * *examination*: which tooth is in your hand, how far through the layers you
 * have dug, and what you have written down about each tooth.
 *
 * The act is stored rather than derived, unlike the network console's, because
 * here the reader moves through the four acts deliberately — the numbering does
 * not follow from having rotated the model, it follows from being ready for it.
 */

export const ACTS = ['look', 'number', 'surface', 'chart']

export const initialJawState = () => ({
  act: 'look',
  /** The FDI number of the tooth being examined, or null. */
  selected: null,
  /** How much has been peeled back: 0 gingiva on, 1 gingiva off, 2 bone off. */
  layer: 0,
  /** Whether the selected tooth is lifted out of the arch. */
  lifted: true,
  /** FDI numbers the reader has selected at least once, for the "seen" count. */
  seen: [],
  /** Which of the numbering act's find-the-tooth prompts have been answered. */
  found: [],
  /** The face of a tooth currently being explained, in the surfaces act. */
  face: null,
  /** FDI -> mark id, the chart. */
  marks: {},
})

export function jawReducer(state, action) {
  switch (action.type) {
    /* Selecting is also how the "find 46" prompts are answered: there is no
       separate answer button, because finding the tooth is the whole of the
       task and a second click to confirm it would only be ceremony. */
    case 'select': {
      const seen = state.seen.includes(action.fdi) ? state.seen : [...state.seen, action.fdi]
      const found =
        action.solves && !state.found.includes(action.solves)
          ? [...state.found, action.solves]
          : state.found
      return { ...state, selected: action.fdi, seen, found }
    }

    case 'clear':
      return { ...state, selected: null }

    case 'layer':
      return { ...state, layer: Math.max(0, Math.min(2, action.to)) }

    case 'lift':
      return { ...state, lifted: !state.lifted }

    case 'face':
      return { ...state, face: state.face === action.id ? null : action.id }

    /* Marking is a toggle so a reader can take a mark back, and clearing to
       nothing is spelled as removing the key rather than storing a blank —
       the chart's "how many did you mark" count is then just its size. */
    case 'mark': {
      const marks = { ...state.marks }
      if (marks[action.fdi] === action.mark) delete marks[action.fdi]
      else marks[action.fdi] = action.mark
      return { ...state, marks }
    }

    case 'act':
      return { ...state, act: action.to, face: null }

    case 'restart':
      return initialJawState()

    default:
      return state
  }
}

/** The two digits of an FDI number, as the meaning each one carries. */
export const readFdi = (fdi) => ({
  quadrant: Number(String(fdi)[0]),
  position: Number(String(fdi)[1]),
})

/** Which arch a tooth is in, from its quadrant. */
export const archOf = (fdi) => (readFdi(fdi).quadrant <= 2 ? 'upper' : 'lower')

/** The patient's own side, which is the one the number is written from. */
export const sideOf = (fdi) => {
  const q = readFdi(fdi).quadrant
  return q === 1 || q === 4 ? 'right' : 'left'
}
