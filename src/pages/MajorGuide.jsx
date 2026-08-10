import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import Lattice from '../components/decor/Lattice.jsx'
import ContentsRail, { useContentsNav } from '../components/ContentsRail.jsx'
import DocSections from '../components/DocSections.jsx'
import { getMajor, isAvailable } from '../data/majors.js'
import { getBranch } from '../data/branches.js'
import { ENGLISH_LITERATURE } from '../data/guides/englishLiterature.js'
import './MajorGuide.css'

/**
 * A branch of a major, written out in full: contents down the left, the
 * document on the right.
 *
 * Both halves are shared with the majors written out on their own page —
 * ContentsRail and DocSections. What belongs to this file is the page around
 * them: the head, the way back out, and what to say about a branch nobody has
 * written yet.
 */

/** Branch slug -> its guide. One so far; the rest are still 'coming soon'. */
const GUIDES = {
  'english-literature': ENGLISH_LITERATURE,
}

export default function MajorGuide() {
  const { slug, branch: branchSlug } = useParams()
  const major = getMajor(slug)
  const branch = getBranch(slug, branchSlug)
  const guide = GUIDES[branchSlug] ?? null

  const sections = useMemo(() => guide?.sections ?? [], [guide])
  const contents = useContentsNav(sections)

  // A branch nobody has written yet, or a slug that does not exist.
  if (!major || !isAvailable(major) || !branch || !guide) {
    return (
      <div className="guide guide--missing">
        <div className="shell">
          <span className="eyebrow">{branch ? 'Coming soon' : 'Not found'}</span>
          <h1>
            {branch
              ? `${branch.name} is not written up yet.`
              : 'That part of the department is not in the library.'}
          </h1>
          <p className="guide__missingText">
            {branch
              ? 'It is listed because the department really does contain it, and leaving it out would make the degree look smaller than it is. The write-up is coming.'
              : 'Check the address, or go back and pick one of the branches listed there.'}
          </p>
          <Link to={major ? `/app/${slug}` : '/app'} className="btn btn--ghost">
            {major ? `Back to ${major.name}` : 'Back to the library'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="guide">
      <header className="guide__head">
        <Lattice className="guide__lattice" size={78} color="rgba(255,255,255,0.06)" />
        <div className="shell guide__headInner">
          <Link to={`/app/${slug}`} className="guide__back">
            ← {major.name}
          </Link>
          <span className="eyebrow">Inside {major.name}</span>
          <h1 className="guide__title">{guide.title}</h1>
          <p className="guide__blurb">{guide.blurb}</p>
        </div>
      </header>

      <div className="shell contents" data-open={contents.open ? 'true' : 'false'}>
        <ContentsRail sections={sections} id="guide-nav" {...contents} />

        <DocSections sections={sections}>
          <div className="doc__foot">
            <Link to={`/app/${slug}`} className="btn btn--outline-dark">
              Back to {major.name}
            </Link>
          </div>
        </DocSections>
      </div>
    </div>
  )
}
