import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import Lattice from '../components/decor/Lattice.jsx'
import ContentsRail, { useContentsNav } from '../components/ContentsRail.jsx'
import { getMajor, isAvailable } from '../data/majors.js'
import { getBranch } from '../data/branches.js'
import { ENGLISH_LITERATURE } from '../data/guides/englishLiterature.js'
import './MajorGuide.css'

/**
 * A branch of a major, written out in full: contents down the left, the
 * document on the right.
 *
 * The rail is ContentsRail, shared with the majors that are written out on
 * their own page; what belongs to this file is the document beside it — the
 * blocks the guides are made of, and the styles for them.
 */

/** Branch slug -> its guide. One so far; the rest are still 'coming soon'. */
const GUIDES = {
  'english-literature': ENGLISH_LITERATURE,
}

/**
 * The only markup the document data carries: **bold** and *italic*.
 *
 * Deliberately not a markdown parser. Returning React elements rather than
 * HTML means nothing in the content can inject markup, and the two things
 * actually used in the source document are the two things supported.
 */
function rich(text) {
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
    <div className="gflow">
      {label && <span className="gflow__label">{label}</span>}
      <ol className="gflow__steps">
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
      return <p className="gdoc__lede">{rich(block.text)}</p>

    case 'text':
      return <p className="gdoc__text">{rich(block.text)}</p>

    case 'note':
      return (
        <p className="gdoc__note">
          <span className="gdoc__noteMark" aria-hidden="true" />
          <span>{rich(block.text)}</span>
        </p>
      )

    case 'flow':
      return <Flow label={block.label} steps={block.steps} />

    case 'facts':
      return (
        <div className="gfacts">
          {block.title && <h3 className="gfacts__title">{block.title}</h3>}
          <dl className="gfacts__list">
            {block.items.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{rich(item.value)}</dd>
              </div>
            ))}
          </dl>
          {block.note && <p className="gfacts__note">{rich(block.note)}</p>}
        </div>
      )

    case 'defs':
      return (
        <dl className="gdefs">
          {block.items.map((item) => (
            <div className="gdefs__row" key={item.term}>
              <dt>{item.term}</dt>
              <dd>{rich(item.text)}</dd>
            </div>
          ))}
        </dl>
      )

    case 'list':
      return (
        <ul className="gdoc__list">
          {block.items.map((item) => (
            <li key={item}>{rich(item)}</li>
          ))}
        </ul>
      )

    case 'years':
      return (
        <ol className="gyears">
          {block.items.map((year) => (
            <li className="gyear" key={year.n}>
              <span className="gyear__n">{year.n}</span>
              <h3 className="gyear__title">{year.title}</h3>
              <p className="gyear__label">You may study</p>
              <ul className="gyear__list">
                {year.study.map((line) => (
                  <li key={line}>{rich(line)}</li>
                ))}
              </ul>
              <Flow label="You will practise" steps={year.practice} />
              <p className="gyear__purpose">{rich(year.purpose)}</p>
            </li>
          ))}
        </ol>
      )

    case 'table':
      /* Wrapped, and the wrapper is what scrolls. Three columns of prose will
         not fit a phone at any type size worth reading, and a table that
         widens the page instead of scrolling itself takes the whole document
         sideways with it. */
      return (
        <div className="gtable" tabIndex="0" role="region" aria-label="Career paths">
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

    default:
      return null
  }
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

        <article className="contents__doc gdoc">
          {sections.map((section, i) => (
            <section className="gdoc__section" id={section.id} key={section.id}>
              <span className="gdoc__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="gdoc__title">{section.title}</h2>
              {section.lead && <p className="gdoc__lead">{rich(section.lead)}</p>}
              {section.blocks.map((block, b) => (
                <Block block={block} key={b} />
              ))}
            </section>
          ))}

          <div className="gdoc__foot">
            <Link to={`/app/${slug}`} className="btn btn--outline-dark">
              Back to {major.name}
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
