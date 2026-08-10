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
 * --noSheet, unlike the guide. A guide is its whole page, so a contents button
 * pinned to the corner of a narrow screen is always about what is under it.
 * This document is one band of a major page with related majors below it, and
 * the same button would follow the reader down into them still offering the
 * contents of something they had left. Narrow, the rail goes away and the
 * sections are read straight through.
 */

export default function MajorLanding({ landing }) {
  const sections = useMemo(() => landing.sections, [landing])
  const contents = useContentsNav(sections)

  return (
    <section className="section mland">
      <div
        className="shell contents contents--noSheet"
        data-open={contents.open ? 'true' : 'false'}
      >
        <ContentsRail sections={sections} id="landing-nav" {...contents} />
        <DocSections sections={sections} />
      </div>
    </section>
  )
}
