import { useMemo } from 'react'

import ContentsRail, { useContentsNav } from './ContentsRail.jsx'
import './MajorLanding.css'

/**
 * A major written out on its own page: contents down the left, the document
 * on the right, the same way a branch guide is written out.
 *
 * The rail is the shared one, so this file is the document — five numbered
 * sections ending on the panel that invites you to try the subject rather
 * than read about it.
 *
 * It sits on the pale ground the branch list uses, and for the same reason:
 * it is the part of the page you actually read, and it should not be more
 * dark-on-dark beneath the header.
 *
 * --noSheet, unlike the guide. A guide is its whole page, so a contents button
 * pinned to the corner of a narrow screen is always about what is under it.
 * This document is one band of a major page with related majors below it, and
 * the same button would follow the reader down into them still offering the
 * contents of something they had left. Narrow, the rail goes away and the five
 * sections are read straight through.
 */

function Block({ block }) {
  switch (block.type) {
    case 'lede':
      return <p className="mland__lede">{block.text}</p>

    case 'text':
      return <p className="mland__text">{block.text}</p>

    case 'tags':
      return (
        <ul className="mland__tags">
          {block.items.map((item) => (
            <li className="mland__tag" key={item}>
              {item}
            </li>
          ))}
        </ul>
      )

    case 'flow':
      return (
        <ol className="mland__flow">
          {block.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )

    case 'action':
      return (
        <div className="mland__action">
          {/* Nothing to link to yet. A gold button that does nothing when you
              press it is worse than one that says why, so it ships disabled
              with the reason beside it. */}
          <button type="button" className="btn mland__actionBtn" disabled={!block.ready}>
            {block.label}
          </button>
          {block.note && <span className="mland__actionNote">{block.note}</span>}
        </div>
      )

    default:
      return null
  }
}

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

        <article className="contents__doc mdoc">
          {sections.map((section, i) => (
            <section
              className={`mdoc__section${section.panel ? ' mdoc__section--panel' : ''}`}
              id={section.id}
              key={section.id}
            >
              <span className="mdoc__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="mdoc__title">{section.title}</h2>
              {section.blocks.map((block, b) => (
                <Block block={block} key={b} />
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}
