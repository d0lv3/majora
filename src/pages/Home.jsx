import { Link, useNavigate } from 'react-router-dom'

import Reveal from '../components/Reveal.jsx'
import CornerLines from '../components/decor/CornerLines.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/visual-identity/logo-web.png'
import './Home.css'

/**
 * What the platform gives you, stated where the figures used to be. Counting
 * the library was a fact about our shelf; this is a promise about the reader's
 * decision, which is the thing they are actually weighing above the fold.
 *
 * Three of the four are not built yet. They describe the product, not the
 * current build, and the library preview further down is what is live today.
 */
const FEATURES = [
  {
    title: 'Detailed major information',
    text: 'What you study, the skills it builds, and where it leads.',
    icon: <path d="M6.5 3h7l4.5 4.5V21h-11.5V3Zm7 0v4.5H18M9.5 12.5h5M9.5 16.5h5" />,
  },
  {
    title: 'Acceptance rates',
    text: 'The scores each programme actually takes, not the rumour.',
    icon: <path d="M4 20V11m5 9V4m5 16v-6m5 6V8" />,
  },
  {
    title: 'Simulations',
    text: 'Try what a major is really like before you commit to it.',
    icon: <path d="M3.5 5.5h17v13h-17v-13Zm6.7 4 4.6 2.5-4.6 2.5v-5Z" />,
  },
  {
    title: 'A fit test',
    text: 'A short test that points to the majors worth your time.',
    icon: (
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    ),
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
            {/* The mark, for phones only. It rides in the nav bar on a desktop,
                but the nav is at the foot of the screen there and carries four
                destinations across it — so the brand opens the page instead,
                which is where you look first anyway. Decorative: the headline
                below it already says the name. */}
            <img className="hero__mark" src={logo} alt="" width="800" height="800" />

            <h1 className="hero__title">
              Majora - Discover
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

              {/* Both actions are SpecularButtons so the pair matches. Each one
                  paints its rim in a WebGL canvas and browsers keep only ~16
                  live, but the landing page runs three in total, so the pair is
                  affordable. The dense controls are still plain CSS. */}
              <SpecularButton {...SB.outline} size="lg" onClick={() => scrollTo('how')}>
                <span className="hero__glyph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {/* Lands on #how, which is now the "what Majora offers"
                    section — so the button says what it takes you to. */}
                What we offer
              </SpecularButton>
            </div>
          </div>

        </div>

        <div className="shell">
          <ul className="hero__features">
            {FEATURES.map((feature) => (
              <li className="feat" key={feature.title}>
                <span className="feat__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {feature.icon}
                  </svg>
                </span>
                <span className="feat__text">
                  <strong className="feat__title">{feature.title}</strong>
                  <span className="feat__desc">{feature.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ ABOUT =========================== */}
      <About />

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
