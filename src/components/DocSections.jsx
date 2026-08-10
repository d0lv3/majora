import './DocSections.css'

/**
 * A numbered document: the thing that sits beside ContentsRail.
 *
 * Written for the branch guides and now shared with the majors written out on
 * their own page, because the second document wanted the same year cards, the
 * same term lists and the same arrow chains as the first, and a second copy of
 * them would have drifted apart.
 *
 * The section ids are what the rail scrolls to, so they belong to the content
 * rather than to this file; everything else here is presentation.
 *
 * Block types:
 *
 *   lede    the opening line of a section, set large
 *   text    a paragraph; **bold** and *italic* are honoured, nothing else is
 *   quote   a line the document wants to land on, ruled in gold
 *   note    a quiet aside, for caveats about the sources
 *   flow    an arrow chain — Read -> Analyze -> Interpret
 *   facts   label/value pairs, for an at-a-glance panel
 *   defs    term + explanation rows, the workhorse of both documents
 *   list    plain bullets
 *   tags    a row of chips, for naming a set without explaining each one
 *   years   one card per year of the degree
 *   table   head + rows
 *   action  the button a document ends on
 *
 * A section marked `panel: true` is painted as a call to action rather than
 * ruled off as more document.
 */

/**
 * The only markup the document data carries: **bold** and *italic*.
 *
 * Deliberately not a markdown parser. Returning React elements rather than
 * HTML means nothing in the content can inject markup, and the two things
 * actually used in the source documents are the two things supported.
 */
export function rich(text) {
  const parts = []
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      match[1] ? <strong key={match.index}>{match[1]}</strong> : <em key={match.index}>{match[2]}</em>,
    )
    last = pattern.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

/** An arrow chain: Read -> Analyze -> Interpret. */
function Flow({ label, steps }) {
  return (
    <div className="dflow">
      {label && <span className="dflow__label">{label}</span>}
      <ol className="dflow__steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'lede':
      return <p className="doc__lede">{rich(block.text)}</p>

    case 'text':
      return <p className="doc__text">{rich(block.text)}</p>

    case 'quote':
      return <p className="doc__quote">{rich(block.text)}</p>

    case 'note':
      return (
        <p className="doc__note">
          <span className="doc__noteMark" aria-hidden="true" />
          <span>{rich(block.text)}</span>
        </p>
      )

    case 'flow':
      return <Flow label={block.label} steps={block.steps} />

    case 'tags':
      return (
        <ul className="doc__tags">
          {block.items.map((item) => (
            <li className="doc__tag" key={item}>
              {item}
            </li>
          ))}
        </ul>
      )

    case 'facts':
      return (
        <div className="dfacts">
          {block.title && <h3 className="dfacts__title">{block.title}</h3>}
          <dl className="dfacts__list">
            {block.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{rich(item.value)}</dd>
              </div>
            ))}
          </dl>
          {block.note && <p className="dfacts__note">{rich(block.note)}</p>}
        </div>
      )

    case 'defs':
      return (
        <dl className="ddefs">
          {block.items.map((item) => (
            <div className="ddefs__row" key={item.term}>
              <dt>{item.term}</dt>
              <dd>{rich(item.text)}</dd>
            </div>
          ))}
        </dl>
      )

    case 'list':
      return (
        <ul className="doc__list">
          {block.items.map((item) => (
            <li key={item}>{rich(item)}</li>
          ))}
        </ul>
      )

    case 'years':
      /* Two things a year card lets its document decide, because two degrees
         do not describe a year the same way:

           the labels    one studies and practises; another studies for three
                         years and then works across departments for two
           practiceAs    a chain claims the steps happen in that order, which
                         is true of Read -> Analyze -> Interpret and false of
                         a list of procedures you might perform in any order

         Both fall back to the guide's originals, and a year may override the
         block: the last year of a five-year degree really does run in order. */
      return (
        <ol className="dyears">
          {block.items.map((year) => {
            const practiceLabel = year.practiceLabel ?? block.practiceLabel ?? 'You will practise'
            const asList = (year.practiceAs ?? block.practiceAs ?? 'flow') === 'list'
            return (
              <li className="dyear" key={year.n}>
                <span className="dyear__n">{year.n}</span>
                <h3 className="dyear__title">{year.title}</h3>
                {year.intro && <p className="dyear__intro">{rich(year.intro)}</p>}

                <p className="dyear__label">
                  {year.studyLabel ?? block.studyLabel ?? 'You may study'}
                </p>
                <ul className="dyear__list">
                  {year.study.map((line) => (
                    <li key={line}>{rich(line)}</li>
                  ))}
                </ul>

                {asList ? (
                  <>
                    <p className="dyear__label">{practiceLabel}</p>
                    <ul className="dyear__list">
                      {year.practice.map((line) => (
                        <li key={line}>{rich(line)}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Flow label={practiceLabel} steps={year.practice} />
                )}

                <p className="dyear__purpose">{rich(year.purpose)}</p>
              </li>
            )
          })}
        </ol>
      )

    case 'table':
      /* Wrapped, and the wrapper is what scrolls. Three columns of prose will
         not fit a phone at any type size worth reading, and a table that
         widens the page instead of scrolling itself takes the whole document
         sideways with it. */
      return (
        <div className="dtable" tabIndex="0" role="region" aria-label={block.label ?? 'Table'}>
          <table>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  <th scope="row">{rich(row[0])}</th>
                  {row.slice(1).map((cell, i) => (
                    <td key={i}>{rich(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'action':
      return (
        <div className="doc__action">
          {/* Nothing to link to yet. A gold button that does nothing when you
              press it is worse than one that says why, so it ships disabled
              with the reason beside it. */}
          <button type="button" className="btn doc__actionBtn" disabled={!block.ready}>
            {block.label}
          </button>
          {block.note && <span className="doc__actionNote">{block.note}</span>}
        </div>
      )

    default:
      return null
  }
}

export default function DocSections({ sections, children }) {
  return (
    <article className="contents__doc doc">
      {sections.map((section, i) => (
        <section
          className={`doc__section${section.panel ? ' doc__section--panel' : ''}`}
          id={section.id}
          key={section.id}
        >
          <span className="doc__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h2 className="doc__title">{section.title}</h2>
          {section.lead && <p className="doc__lead">{rich(section.lead)}</p>}
          {section.blocks.map((block, b) => (
            <Block block={block} key={b} />
          ))}
        </section>
      ))}

      {children}
    </article>
  )
}
