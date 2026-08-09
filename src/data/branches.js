/**
 * The sub-fields inside a major.
 *
 * Some majors in the library are really a department rather than a single
 * course. English Language & Literature is the clearest case: a student who
 * enrols spends four years choosing between literature, linguistics,
 * translation and teaching, and those are different working lives that happen
 * to share an entrance exam. A single page for the department cannot say what
 * any of them is actually like, which is the one thing this site exists to do.
 *
 * So a major can carry branches, and a branch can carry a full guide. Only
 * English Literature has one written so far; the rest are listed anyway,
 * because a student deciding needs to see the whole shape of the department,
 * not just the corner of it we have finished.
 *
 * Metadata only, deliberately. The guides themselves are large and live in
 * ./guides, loaded by the guide route rather than by anything that imports
 * this file — the library page reads these names on every render and has no
 * use for forty kilobytes of course content.
 */

const BRANCHES = {
  'english-language-literature': [
    {
      slug: 'english-literature',
      name: 'English Literature',
      ready: true,
      blurb:
        'Novels, poetry and plays read as arguments rather than stories — what the writer chose, and what the choice does.',
    },
    {
      slug: 'linguistics',
      name: 'Linguistics',
      blurb:
        'English as a system: sounds, grammar, meaning, and how any of it came to work the way it does.',
    },
    {
      slug: 'translation',
      name: 'Translation & Interpreting',
      blurb:
        'Carrying meaning between English, Kurdish and Arabic without quietly dropping part of it on the way.',
    },
    {
      slug: 'english-language-teaching',
      name: 'English Language Teaching',
      blurb:
        'How a language is actually taught and learned, which is the route most graduates of this department take.',
    },
    {
      slug: 'creative-writing',
      name: 'Creative Writing',
      blurb: 'Writing the thing rather than analysing it: fiction, poetry, script and the editing of both.',
    },
    {
      slug: 'comparative-literature',
      name: 'Comparative & World Literature',
      blurb:
        'English literature set beside Kurdish, Arabic and European writing, and read against them.',
    },
  ],
}

export const branchesFor = (majorSlug) => BRANCHES[majorSlug] ?? []

export const getBranch = (majorSlug, branchSlug) =>
  branchesFor(majorSlug).find((b) => b.slug === branchSlug) ?? null

/** Whether a major is a department worth breaking apart at all. */
export const hasBranches = (majorSlug) => branchesFor(majorSlug).length > 0
