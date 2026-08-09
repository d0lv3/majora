import Reveal from './Reveal.jsx'
import './MajorLanding.css'

/**
 * A major written out on its own page: the definition, then a numbered run of
 * sections, then the panel that invites you to try the subject rather than
 * read about it.
 *
 * On the pale ground the branch list uses, and for the same reason — it is the
 * part of the page you actually read, and it should not be more dark-on-dark
 * beneath the header.
 *
 * Sections are a two-column document on a wide screen: the number and the
 * question on the left, the answer beside it. Below 900px there is no room for
 * two columns of prose, so the heading sits above its own text.
 */

function Block({ block }) {
  switch (block.type) {
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

    default:
      return null
  }
}

export default function MajorLanding({ landing }) {
  const { cta } = landing

  return (
    <section className="section mland">
      <div className="shell">
        <Reveal>
          <span className="eyebrow eyebrow--dark">{landing.eyebrow}</span>
          <h2 className="mland__title">{landing.title}</h2>
          {landing.lede.map((line) => (
            <p className="mland__lede" key={line}>
              {line}
            </p>
          ))}
        </Reveal>

        <ol className="mland__sections">
          {landing.sections.map((section, i) => (
            <Reveal as="li" className="mland__section" key={section.id} delay={i * 60}>
              <div className="mland__sectionHead">
                <span className="mland__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mland__sectionTitle">{section.title}</h3>
              </div>
              <div className="mland__sectionBody">
                {section.blocks.map((block, b) => (
                  <Block block={block} key={b} />
                ))}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mland__cta">
          <span className="eyebrow">{cta.title}</span>
          <p className="mland__ctaLede">{cta.lede}</p>
          <p className="mland__ctaText">{cta.text}</p>

          <ol className="mland__flow">
            {cta.flow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {/* The simulations this points at are not built. A gold button that
              does nothing when you press it is worse than one that says so, so
              it ships disabled with the reason beside it. */}
          <div className="mland__ctaAction">
            <button type="button" className="btn mland__ctaBtn" disabled>
              {cta.action}
            </button>
            <span className="mland__ctaNote">{cta.note}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
