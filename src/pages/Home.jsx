import { Link, useNavigate } from 'react-router-dom'

import logo from '../assets/visual-identity/logo-web.png'
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
import { MAJORS, FIELDS, countByField, availableMajors } from '../data/majors.js'
import './Home.css'

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
  const startLabel = isAuthenticated ? 'Open the library' : 'Get Started'

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="home">
      {/* ============================ HERO ============================ */}
      <section className="hero" id="top">
        <CornerLines className="hero__lines" />

        <div className="shell hero__inner">
          <div className="hero__copy">
            <div className="hero__lockup">
              <img src={logo} alt="" className="hero__mark" aria-hidden="true" />
              <div className="hero__word">
                <h1 className="hero__title">Majora</h1>
                <span className="hero__rule" aria-hidden="true" />
                <p className="hero__tagline">Discover Where You Fit</p>
              </div>
            </div>

            <p className="hero__blurb">
              Every university major in Kurdistan, Iraq, explained in plain language — before you
              have to choose one.
            </p>

            <div className="hero__actions">
              <SpecularButton {...SB.gold} size="lg" onClick={() => navigate(startHref)}>
                {startLabel}
                <span className="sb-arrow" aria-hidden="true">
                  →
                </span>
              </SpecularButton>

              <SpecularButton {...SB.ghost} size="lg" onClick={() => scrollTo('how')}>
                How it works
              </SpecularButton>
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

        <button type="button" className="hero__cue" onClick={() => scrollTo('how')}>
          <span>Scroll</span>
          <span className="hero__cueLine" aria-hidden="true" />
        </button>
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
