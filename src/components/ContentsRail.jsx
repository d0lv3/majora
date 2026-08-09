import { useCallback, useEffect, useState } from 'react'
import './ContentsRail.css'

/**
 * Contents down the left, the document on the right.
 *
 * Written for the branch guides and now shared with the majors that are
 * written out on their own page, because there is one of these on the site and
 * two copies of it would have drifted apart the first time the breakpoint
 * moved.
 *
 * The nav is a table of contents rather than a set of tabs — every section is
 * on the page at once and clicking scrolls to it. A student reading about a
 * degree is not looking things up, they are reading the whole thing once, and
 * tabs would hide seven eighths of it behind a click.
 *
 * The sidebar toggles because it is worth different amounts at different
 * widths. Wide, it is open and sticky and the document keeps its measure
 * beside it. Narrow, there is no room for two columns, so it starts closed and
 * opens over the page as a sheet, closing again the moment a section is
 * chosen — unless the caller asks for `--noSheet`, which is right for a
 * document that is only part of its page. See MajorLanding.jsx.
 *
 * Use it as a pair: the hook holds the state, the component draws the rail,
 * and the caller owns the grid between them.
 *
 *   const contents = useContentsNav(sections)
 *   <div className="contents" data-open={contents.open ? 'true' : 'false'}>
 *     <ContentsRail sections={sections} {...contents} />
 *     <article className="contents__doc">…</article>
 *   </div>
 */

const WIDE = '(min-width: 1000px)'

export function useContentsNav(sections) {
  const [open, setOpen] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(WIDE).matches,
  )
  const [active, setActive] = useState(sections[0]?.id ?? '')

  /* The sidebar's default belongs to the viewport, not to the last thing the
     reader did on another screen size: rotating a phone into landscape should
     not leave a sheet open over the document. */
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const sync = (e) => setOpen(e.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  /**
   * Which section the reader is in front of.
   *
   * Measured on scroll rather than watched with an IntersectionObserver. An
   * observer only reports the moment an edge crosses a band, so the answer
   * depends on tuning that band against section heights nobody controls —
   * short sections can pass through without ever being the answer, and the
   * last one, sitting at the foot of the page, may never reach the band at
   * all. Reading positions directly is the same approach the landing nav
   * takes, and it cannot get stuck: the section whose top has most recently
   * passed the reading line is the one you are in, always.
   *
   * rAF-throttled, so a fast scroll costs one measurement per frame.
   */
  useEffect(() => {
    if (!sections.length) return undefined

    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current = sections[0].id
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= line) current = section.id
      }
      // At the very bottom the last section wins whatever the line says: it is
      // usually too short to reach it, and you are plainly reading it.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      setActive(atBottom ? sections[sections.length - 1].id : current)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sections])

  const goTo = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setActive(id)
    // On a phone the nav is a sheet over what you just chose, so choosing
    // closes it. On a desktop it is a column beside the text and stays put.
    if (!window.matchMedia(WIDE).matches) setOpen(false)
  }, [])

  return { open, setOpen, active, goTo }
}

export default function ContentsRail({ sections, open, setOpen, active, goTo, id = 'contents-nav' }) {
  return (
    <>
      {/* The toggle travels with the contents rather than sitting above
          them, so one sticky rail carries both: collapsed, the rail keeps a
          narrow gutter and the button stays exactly where it was. */}
      <div className="contents__rail">
        <button
          type="button"
          className="contents__toggle"
          aria-expanded={open}
          aria-controls={id}
          /* Icon-only, so the name has to come from the label rather than
             the text — and title gives the same words to a mouse. */
          aria-label={open ? 'Hide contents' : 'Show contents'}
          title={open ? 'Hide contents' : 'Show contents'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="contents__toggleIcon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4.5" width="18" height="15" rx="3.5" />
            <path d="M9.3 4.5v15" />
            {/* Points the way the panel is about to go: left to tuck it
                away, flipped right to bring it back. */}
            <path className="contents__toggleCaret" d="m16.6 9.3-2.7 2.7 2.7 2.7" />
          </svg>
        </button>

        {/* Rendered either way so the toggle animates rather than the list
            popping in, and hidden from assistive tech when it is closed. */}
        <nav className="contents__nav" id={id} aria-label="Sections" aria-hidden={!open}>
          <p className="contents__navTitle">Contents</p>
          <ol className="contents__navList">
            {sections.map((section, i) => (
              <li key={section.id}>
                <button
                  type="button"
                  className={`cnav${active === section.id ? ' is-on' : ''}`}
                  onClick={() => goTo(section.id)}
                  tabIndex={open ? 0 : -1}
                  aria-current={active === section.id ? 'true' : undefined}
                >
                  <span className="cnav__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cnav__label">{section.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Closes the sheet when it is tapped past, on narrow screens only. */}
      <button
        type="button"
        className="contents__scrim"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </>
  )
}
