/**
 * The track test — the short thing a student meets straight after registering.
 *
 * It answers one question only: are you leaning Scientific (علمي) or
 * Literary/Humanities (أدبي)? That is the branch the school system actually
 * makes people choose, and it is the branch that decides which half of the
 * library is even reachable. It is deliberately not a "which major are you"
 * quiz: forty majors cannot be separated by eight questions, and pretending
 * otherwise is the exact thing this platform exists to argue against.
 *
 * Every question is a straight two-way choice between the same two habits of
 * mind, asked about a different corner of a student's week — a lesson, a free
 * afternoon, a group project, a news story. Nothing here asks how good you
 * are at a subject, because a mark measures the teaching as much as the
 * student. Each one can be skipped, and so can the whole test.
 */

export const TRACKS = {
  scientific: {
    id: 'scientific',
    name: 'Scientific',
    nameAr: 'علمي',
    subjects: 'mathematics, physics, chemistry and biology',
    text: 'You reach for the mechanism first — how a thing works, and whether the answer checks out. That is the habit the science track is built around.',
  },
  literary: {
    id: 'literary',
    name: 'Literary / Humanities',
    nameAr: 'أدبي',
    subjects: 'Arabic, history, geography, economics and the other humanities',
    text: 'You reach for the reasons first — why people and systems ended up this way, and how to argue it well. That is the habit the literary track is built around.',
  },
}

/** Eight questions, one screen each. `sci` and `lit` are the two answers. */
export const QUESTIONS = [
  {
    id: 'lesson',
    prompt: 'Which lesson do you actually look forward to?',
    sci: 'Maths, physics or chemistry',
    lit: 'Arabic, history or geography',
  },
  {
    id: 'problem',
    prompt: 'A problem feels more satisfying when…',
    sci: 'it has one right answer, and you can check it',
    lit: 'it can be argued well from more than one side',
  },
  {
    id: 'week',
    prompt: 'A free week, and something to make. You would rather…',
    sci: 'build something that works, or run an experiment',
    lit: 'write, film, or put together a debate',
  },
  {
    id: 'curious',
    prompt: 'Which question would you rather spend an hour on?',
    sci: 'Why does this bridge hold up?',
    lit: 'Why was this law written the way it was?',
  },
  {
    id: 'group',
    prompt: 'In a group project, you end up taking…',
    sci: 'the numbers, the measurements and the diagrams',
    lit: 'the research, the writing and the presenting',
  },
  {
    id: 'homework',
    prompt: 'Which homework would you start first?',
    sci: 'A page of equations',
    lit: 'An essay on a turning point in history',
  },
  {
    id: 'news',
    prompt: 'A new medicine is in the news. You read on to find out…',
    sci: 'how it actually works inside the body',
    lit: 'what it changes for people, prices and policy',
  },
  {
    id: 'work',
    prompt: 'Ten years from now, where would you rather spend the day?',
    sci: 'A lab, a clinic, or a site',
    lit: 'A courtroom, a classroom, or a newsroom',
  },
]

/**
 * Turn the answers into a leaning.
 *
 * `answers` maps a question id to 'scientific' or 'literary'; a question that
 * was skipped is simply absent, and the score is taken over the ones that were
 * answered rather than over eight. Somebody who answers two questions gets a
 * result honestly built from two.
 *
 * A margin inside one answer either way is reported as close rather than as a
 * verdict. Rounding a 4-3 split into "you are a science student" would be the
 * kind of confident nonsense that puts people in the wrong hall for four years.
 *
 * A dead tie returns no track at all, rather than breaking the tie towards
 * whichever side the comparison happens to favour. Four each way is a real
 * finding — it is just not this one.
 */
export function scoreTest(answers) {
  const values = Object.values(answers)
  const scientific = values.filter((v) => v === 'scientific').length
  const literary = values.filter((v) => v === 'literary').length
  const answered = scientific + literary

  if (answered === 0) return null

  const tied = scientific === literary
  return {
    scientific,
    literary,
    answered,
    // the share of answers pointing at the leader, for the bar on the result
    share: Math.round((Math.max(scientific, literary) / answered) * 100),
    track: tied ? null : scientific > literary ? 'scientific' : 'literary',
    // one answer in it is a leaning worth saying out loud, not a placement
    close: Math.abs(scientific - literary) <= 1,
    tied,
  }
}
