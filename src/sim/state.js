/**
 * The simulation's state, and every way it is allowed to change.
 *
 * The specification hands over a state contract rather than a screen list,
 * which is the right way round: the screens read this object, and almost none
 * of them own anything of their own. What the reader has explored, what they
 * asked the patient, where they put each landmark and how the cooperation
 * conversation went are all here, so any screen can look back at any of it —
 * the dashboard on screen 10 reports the records that were actually collected,
 * and the final evaluation on screen 21 reflects a conversation from screen 16.
 *
 * A reducer rather than a dozen useStates, for one reason: the screens are a
 * graph, not a line. Screen 2 leads to four places, screen 5 to another four,
 * and both can be arrived at again from further on. Every transition being one
 * named action is what keeps that traversable.
 */

export const FIRST_SCREEN = 1
export const LAST_SCREEN = 25

export const initialState = () => ({
  currentScreen: FIRST_SCREEN,
  /* Where the reader has been, so a screen can be revisited without the
     journey resetting and so the nav can show how far along it is. */
  visited: [FIRST_SCREEN],

  patient: {
    chiefConcern: 'appearance of the upper front teeth',
    cooperationLevel: 'moderate',
    currentOverjetMM: 7.0,
    initialOverjetMM: 7.0,
  },

  exploredActions: {
    talkedToPatient: false,
    examinedMouth: false,
    viewedPhotos: false,
    viewedModels: false,
    requestedXRay: false,
    completedCephTracing: false,
  },

  conversationHistory: [],
  examinationAreasVisited: [],
  cephLandmarksPlaced: [],
  treatmentGoals: [],
  timelineNodesRead: [],
  investigationsRun: [],

  userInteractions: {
    cooperationStrategy: null,
    adaptedPlan: false,
  },

  timelineMonth: 0,
})

export function reducer(state, action) {
  switch (action.type) {
    case 'go': {
      const screen = Math.min(LAST_SCREEN, Math.max(FIRST_SCREEN, action.screen))
      return {
        ...state,
        currentScreen: screen,
        visited: state.visited.includes(screen) ? state.visited : [...state.visited, screen],
      }
    }

    /* One question of the interview. Recorded by id so screen 3 can show which
       are left without the screen having to remember anything itself. */
    case 'ask': {
      if (state.conversationHistory.includes(action.id)) return state
      return {
        ...state,
        conversationHistory: [...state.conversationHistory, action.id],
        exploredActions: { ...state.exploredActions, talkedToPatient: true },
      }
    }

    case 'examine': {
      const visited = state.examinationAreasVisited.includes(action.area)
        ? state.examinationAreasVisited
        : [...state.examinationAreasVisited, action.area]
      return {
        ...state,
        examinationAreasVisited: visited,
        exploredActions: { ...state.exploredActions, examinedMouth: true },
      }
    }

    case 'record': {
      // photos | models | xray | ceph -> the matching explored flag
      const key = {
        photos: 'viewedPhotos',
        models: 'viewedModels',
        xray: 'requestedXRay',
        ceph: 'completedCephTracing',
      }[action.id]
      if (!key) return state
      return { ...state, exploredActions: { ...state.exploredActions, [key]: true } }
    }

    case 'placeLandmark': {
      if (state.cephLandmarksPlaced.some((l) => l.id === action.landmark.id)) return state
      return { ...state, cephLandmarksPlaced: [...state.cephLandmarksPlaced, action.landmark] }
    }

    case 'goal': {
      const goals = state.treatmentGoals.includes(action.id)
        ? state.treatmentGoals
        : [...state.treatmentGoals, action.id]
      return { ...state, treatmentGoals: goals }
    }

    case 'timelineNode': {
      const read = state.timelineNodesRead.includes(action.id)
        ? state.timelineNodesRead
        : [...state.timelineNodesRead, action.id]
      return { ...state, timelineNodesRead: read }
    }

    /* The one branch in the simulation. It sets a clinical variable rather
       than a score, and screens 18 and 21 read it back. */
    case 'cooperation': {
      return {
        ...state,
        patient: { ...state.patient, cooperationLevel: action.level },
        userInteractions: { ...state.userInteractions, cooperationStrategy: action.strategy },
      }
    }

    case 'investigate': {
      const run = state.investigationsRun.includes(action.id)
        ? state.investigationsRun
        : [...state.investigationsRun, action.id]
      return { ...state, investigationsRun: run }
    }

    case 'adapt':
      return { ...state, userInteractions: { ...state.userInteractions, adaptedPlan: true } }

    /* The slider on screen 18. Month and overjet move together because they
       are the same fact seen two ways. */
    case 'month':
      return {
        ...state,
        timelineMonth: action.month,
        patient: { ...state.patient, currentOverjetMM: action.overjet },
      }

    case 'restart':
      return initialState()

    default:
      return state
  }
}

/** How many of the four record types have been collected. */
export const recordsCollected = (state) =>
  [
    state.exploredActions.viewedPhotos,
    state.exploredActions.viewedModels,
    state.exploredActions.requestedXRay,
    state.exploredActions.completedCephTracing,
  ].filter(Boolean).length
