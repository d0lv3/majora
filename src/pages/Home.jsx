import { Link, useNavigate } from 'react-router-dom'

import cast from '../assets/people_with_different_majors.png'
import Reveal from '../components/Reveal.jsx'
import MajorCard from '../components/MajorCard.jsx'
import CornerLines from '../components/decor/CornerLines.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { MAJORS, FIELDS, countByField, countCareers, availableMajors } from '../data/majors.js'
import './Home.css'

/**
 * The figures under the hero. Every one is derived from the library itself
 * rather than typed in, so none of them can quietly become a lie as majors are
 * added. "Four answers" is the fixed shape of a major page — what you study,
 * what you will be good at, where it leads, and whether it suits you.
 */
const STATS = [
  {
    value: MAJORS.length,
    label: 'University majors',
    icon: (
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5Zm4 2.6V15c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-3.9" />
    ),
  },
  {
    value: FIELDS.length,
    label: 'Fields of study',
    icon: <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />,
  },
  {
    value: countCareers(),
    label: 'Career paths',
    icon: <path d="M3 8.5h18V19H3V8.5Zm5.5 0V6.2A2.2 2.2 0 0 1 10.7 4h2.6a2.2 2.2 0 0 1 2.2 2.2v2.3M3 13h18" />,
  },
  {
    value: 4,
    label: 'Answers per major',
    icon: <path d="M4 6.5h9M4 12h9M4 17.5h9m3.5-11 2 2 4-4" />,
  },
]

/**
 * The landing page — the whole of it.
 *
 * Everything public lives here at "/": the nav items are anchors into these
 * sections (#top, #about, #contact) rather than routes. The signed-in product
 * is a separate place entirely, at /app.
 */

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const fields = countByField()
  // Show the majors that are actually open rather than teasing locked cards.
  const preview = availableMajors()

  // Signed in, the primary action opens the app; signed out, it creates the
  // account that unlocks it. /app itself bounces guests to the login screen.
  const startHref = isAuthenticated ? '/app' : '/signup'
  const startLabel = isAuthenticated ? 'Open the library' : 'Start Exploring'

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="home">
      {/* ============================ HERO ============================ */}
      <section className="hero" id="top">
        {/* The brand's sweeping route lines, kept but dialled right down: on a
            pale surface their default near-black reads as two hard strokes
            across the artwork. */}
        <CornerLines className="hero__lines" stroke="rgba(65, 43, 99, 0.12)" />

        <div className="shell hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              Discover
              <br />
              Where You Fit
            </h1>

            <p className="hero__blurb">
              Every university major in Kurdistan, Iraq, explained in plain language — before you
              have to choose one.
            </p>

            <div className="hero__actions">
              <SpecularButton {...SB.purple} size="lg" onClick={() => navigate(startHref)}>
                {startLabel}
                <span className="sb-arrow" aria-hidden="true">
                  →
                </span>
              </SpecularButton>

              {/* A plain CSS button, not a second SpecularButton: each one paints
                  its rim in WebGL with its own canvas, and those are rationed. */}
              <button type="button" className="btn btn--outline-dark" onClick={() => scrollTo('how')}>
                <span className="hero__glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                How it works
              </button>
            </div>
          </div>

          {/* Not eager-loaded by accident: this sits in the first viewport, so
              lazy would leave a hole in the hero on a slow connection.
              fetchpriority is lowercase because React 18 does not know the
              camelCase prop and warns; lowercase passes through to the DOM. */}
          <img
            src={cast}
            alt="Six students standing side by side, each dressed for a different field — medicine, computing, business, law, engineering and the arts — with icons for those subjects floating above them."
            className="hero__art"
            width="1717"
            height="916"
            decoding="async"
            fetchpriority="high"
          />
        </div>

        <div className="shell">
          <ul className="hero__stats">
            {STATS.map((stat) => (
              <li className="stat" key={stat.label}>
                <span className="stat__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {stat.icon}
                  </svg>
                </span>
                <span className="stat__text">
                  <strong className="stat__value">{stat.value}</strong>
                  <span className="stat__label">{stat.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ ABOUT =========================== */}
      <About />

      {/* =========================== PREVIEW ========================== */}
      <section className="section preview">
        <Lattice className="preview__lattice" size={64} color="rgba(255,255,255,0.045)" />
        <div className="shell">
          <div className="preview__head">
            <Reveal>
              <span className="eyebrow">The library</span>
              <h2 className="preview__title">
                {MAJORS.length} majors on the shelf. {preview.length} open now.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="preview__lede">
                {isAuthenticated
                  ? 'These three are written up in full. The rest open as we finish them.'
                  : 'These three are written up in full. Sign in to browse the whole shelf.'}
              </p>
            </Reveal>
          </div>

          <div className="preview__grid">
            {preview.map((major, i) => (
              <Reveal key={major.slug} delay={i * 70}>
                <MajorCard major={major} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal className="preview__cta">
            <SpecularButton {...SB.ghost} size="md" onClick={() => navigate('/app')}>
              Browse all {MAJORS.length} majors
              <span className="sb-arrow" aria-hidden="true">
                →
              </span>
            </SpecularButton>
          </Reveal>
        </div>
      </section>

      {/* ============================ FIELDS ========================== */}
      <section className="section fields">
        <div className="shell">
          <Reveal>
            <span className="eyebrow eyebrow--dark">{FIELDS.length} fields</span>
            <h2 className="fields__title">Start from what you already like.</h2>
          </Reveal>

          <ul className="fields__list">
            {fields.map((field, i) => (
              <Reveal as="li" key={field.id} delay={i * 45} className="fieldRow">
                <Link to="/app" className="fieldRow__link">
                  <span className="fieldRow__label">{field.label}</span>
                  <span className="fieldRow__count">
                    {field.count} {field.count === 1 ? 'major' : 'majors'}
                  </span>
                  <span className="fieldRow__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* =========================== CONTACT ========================== */}
      <Contact />

      {/* ============================= CTA ============================ */}
      <section className="closer">
        <CornerLines className="closer__lines" stroke="rgba(255,255,255,0.14)" />
        <div className="shell closer__inner">
          <Reveal>
            <h2 className="closer__title">
              Choose a major because you know it,<br />
              not because it was the score you got.
            </h2>
          </Reveal>
          <Reveal delay={120} className="closer__actions">
            <SpecularButton {...SB.gold} size="lg" onClick={() => navigate(startHref)}>
              {startLabel}
              <span className="sb-arrow" aria-hidden="true">
                →
              </span>
            </SpecularButton>
            {!isAuthenticated && (
              <Link to="/login" className="linky closer__alt">
                I already have an account
              </Link>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
