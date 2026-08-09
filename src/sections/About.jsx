import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import IraqMapArt from '../components/decor/IraqMapArt.jsx'
import LibraryArt from '../components/decor/LibraryArt.jsx'
import CountUp from '../components/ui/CountUp.jsx'
import logo from '../assets/visual-identity/logo-web.png'
import './About.css'

/**
 * The "why this exists" stretch of the landing page (#about).
 *
 * Reads as one argument, in order: the problem → the solution → what changes →
 * what the platform actually gives you. It is a section, not a route, so it
 * owns no CTA of its own; the page closes with one shared call to action.
 *
 * Kept deliberately short: the landing page earns a click, it does not have to
 * win the whole argument. Anything that only restates a point made above has
 * been cut rather than reworded.
 */

/**
 * The three results, each now carrying the survey figure that measures it.
 *
 * The populations differ — the first is school students, the other two are
 * students already at university — so each figure names its own, rather than
 * letting three numbers in a row imply one sample. The percentages are the
 * whole reason this section is an argument instead of an assertion, so they
 * are the loudest thing in the row.
 */
const CONSEQUENCES = [
  {
    label: 'Uncertainty',
    text: 'The deadline arrives before the understanding does, so the choice gets made under pressure.',
    stat: 83,
    caption: 'of school students say their guidance is not enough, or does not exist.',
  },
  {
    label: 'Uninformed choices',
    text: 'A major gets picked for its reputation or the score it accepts, rarely for what studying it is like.',
    stat: 70,
    caption: 'of university students began with little information about their major.',
  },
  {
    label: 'Unsuitable majors',
    text: 'Years, tuition and motivation go into a field that never fit, and switching late is expensive.',
    stat: 60,
    caption: 'of university students considered changing majors in year one or two.',
  },
]

/**
 * The two halves of the product, each drawn rather than described twice: the
 * library answers what a major is, the map answers where it is taught. Each
 * carries its own animated drawing, which is the only picture of either that
 * a visitor gets before signing in.
 */
const OFFERS = [
  {
    n: '01',
    title: 'Library',
    text: 'Full of all the majors you need. Pick whichever might interest you and learn what it actually is — not only in theory, but in practice, with hands-on simulations of the work itself.',
    art: LibraryArt,
  },
  {
    n: '02',
    title: 'Map',
    text: 'Find where your major is taught, university by university, and everything that comes with it: acceptance rates, entry scores, and what genuinely differs between one campus and the next.',
    art: IraqMapArt,
  },
]

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <h2 className="sr-only" id="about-heading">
        About Majora
      </h2>

      {/* =========================== PROBLEM =========================== */}
      <div className="section problem">
        <Lattice className="problem__lattice" size={90} color="rgba(255,255,255,0.05)" />
        <div className="shell">
          <Reveal className="problem__head">
            <span className="eyebrow">01 / The problem</span>
          </Reveal>

          <Reveal delay={100}>
            <blockquote className="statement">
              <p>
                Students in Kurdistan, Iraq struggle to choose the right major because they are{' '}
                <mark>not exposed to different academic and career paths</mark> before graduation.
              </p>
              <footer>The problem statement</footer>
            </blockquote>
          </Reveal>

          <Reveal delay={160} className="problem__bridge">
            <p>Which produces three results, every year, in the same order:</p>
          </Reveal>

          <div className="consequences">
            {CONSEQUENCES.map((item, i) => (
              <Reveal className="cons" key={item.label} delay={i * 110}>
                <span className="cons__num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="cons__label">{item.label}</h3>
                <p className="cons__text">{item.text}</p>
                <p className="cons__stat">
                  {/* Staggered on the same 110ms step as the rows' reveal, with
                      a head start so the fade is under way before the digits
                      begin moving. The two are not synchronised — each watches
                      the viewport on its own — so this is a look, not a lock. */}
                  <CountUp
                    className="cons__statValue"
                    to={item.stat}
                    suffix="%"
                    delay={0.35 + i * 0.11}
                  />
                  <span className="cons__statCaption">{item.caption}</span>
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <p className="consequences__source">
              Majora survey of 187 students and graduates across Kurdistan, Iraq, alongside
              interviews with four educators.
            </p>
          </Reveal>
        </div>
      </div>

      {/* =========================== SOLUTION ========================== */}
      <div className="section solution">
        <Lattice className="solution__lattice" size={72} color="rgba(255,255,255,0.05)" />
        <div className="shell">
          <div className="solution__head">
            <Reveal>
              <span className="eyebrow">02 / The solution</span>
            </Reveal>

            {/* The mark itself, at the size a logo is meant to be read at.
                Decorative: the sentence under it says the name. */}
            <Reveal delay={90} className="solution__brand">
              <img
                className="solution__logo"
                src={logo}
                alt=""
                width="800"
                height="800"
                loading="lazy"
              />
              <span className="solution__wordmark">Majora</span>
            </Reveal>

            <Reveal delay={160}>
              <p className="solution__statement">
                Majora is a platform dedicated to{' '}
                <mark>expose students to different majors</mark> and what they&rsquo;re all about,
                comprehensively.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ========================= BEFORE/AFTER ======================== */}
      <div className="section shift">
        <div className="shell shift__inner">
          <Reveal className="shift__col shift__col--before">
            <span className="shift__tag">Without it</span>
            <ul>
              <li>You hear the name of a major for the first time on the application form.</li>
              <li>Your score decides the field, and you adapt to it afterwards.</li>
              <li>Changing course means losing a year, or more.</li>
            </ul>
          </Reveal>

          <span className="shift__arrow" aria-hidden="true">
            →
          </span>

          <Reveal className="shift__col shift__col--after" delay={140}>
            <span className="shift__tag shift__tag--gold">With Majora</span>
            <ul>
              <li>You have been reading about majors for years.</li>
              <li>You know which fields genuinely interest you, and why.</li>
              <li>You choose once, deliberately, and can explain the reason.</li>
            </ul>
          </Reveal>
        </div>
      </div>

      {/* ============================= OFFERS ========================== */}
      {/* Still #how: the hero's second button points here, and this is what
          that button was always promising to explain. */}
      <div className="section offers" id="how">
        <Lattice className="offers__lattice" size={84} color="rgba(255,255,255,0.05)" />
        <div className="shell">
          <div className="offers__head">
            <Reveal>
              <span className="eyebrow">03 / What Majora Offers</span>
              <h3 className="offers__title">
                Two halves of the same answer.{' '}
                <em>What a major is, and where you would study it.</em>
              </h3>
            </Reveal>
          </div>

          <ol className="offers__list">
            {OFFERS.map((offer, i) => {
              const Art = offer.art
              return (
                <Reveal as="li" className="offer" key={offer.title} delay={i * 90}>
                  <div className="offer__copy">
                    <span className="offer__num" aria-hidden="true">
                      <span className="offer__diamond" />
                      {offer.n}
                    </span>
                    <h4 className="offer__title">{offer.title}</h4>
                    <p className="offer__text">{offer.text}</p>
                  </div>
                  <div className="offer__art">
                    <Art />
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
