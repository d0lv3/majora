import { useMemo } from 'react'

import ContentsRail, { useContentsNav } from './ContentsRail.jsx'
import DocSections from './DocSections.jsx'
import './MajorLanding.css'

/**
 * A major written out on its own page: contents down the left, the document
 * on the right, the same two components a branch guide is built from.
 *
 * What this file adds is the band they sit in — the pale ground the branch
 * list uses, because this is the part of the page you actually read and it
 * should not be more dark-on-dark beneath the header.
 *
 * The rail behaves the same way here as it does on a guide at every width,
 * narrow screens included: the toggle pins itself to the corner and the
 * contents open over the page as a sheet. This document is one band of a
 * longer page rather than the whole of it, so the button is also on screen
 * above the document and below it — which is the trade for a reader who can
 * reach the contents from anywhere on the page instead of scrolling back for
 * them.
 */

export default function MajorLanding({ landing }) {
  const sections = useMemo(() => landing.sections, [landing])
  const contents = useContentsNav(sections)

  return (
    <section className="section mland">
      <div className="shell contents" data-open={contents.open ? 'true' : 'false'}>
        <ContentsRail sections={sections} id="landing-nav" {...contents} />
        <DocSections sections={sections} />
      </div>
    </section>
  )
}
