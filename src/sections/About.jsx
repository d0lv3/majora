import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import { MAJORS, FIELDS } from '../data/majors.js'
import './About.css'

/**
 * The "why this exists" stretch of the landing page (#about).
 *
 * Reads as one argument, in order: the problem → the solution → what changes →
 * how it works → what a major page holds. It is a section, not a route, so it
 * owns no CTA of its own; the page closes with one shared call to action.
 *
 * Kept deliberately short: the landing page earns a click, it does not have to
 * win the whole argument. Anything that only restates a point made above has
 * been cut rather than reworded.
 */

const CONSEQUENCES = [
  {
    label: 'Uncertainty',
    text: 'The deadline arrives before the understanding does, so the choice gets made under pressure.',
  },
  {
    label: 'Uninformed choices',
    text: 'A major gets picked for its reputation or the score it accepts, rarely for what studying it is like.',
  },
  {
    label: 'Unsuitable majors',
    text: 'Years, tuition and motivation go into a field that never fit, and switching late is expensive.',
  },
]

const PILLARS = [
  {
    title: 'A complete library, not a highlight reel',
    text: `All ${MAJORS.length} majors across ${FIELDS.length} fields get the same treatment, so nothing looks second-tier by omission.`,
  },
  {
    title: 'Written to be understood at 14',
    text: 'Plain language, no admissions jargon, no prestige signalling.',
  },
  {
    title: 'Honest about the hard parts',
    text: 'Every major says who it suits and who it does not. A page that only sells the field is marketing, not preparation.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Open the library',
    text: 'Every major offered in the region, in plain language instead of a prospectus.',
  },
  {
    n: '02',
    title: 'See the real work',
    text: 'What the four to six years actually contain: the subjects, the labs, the hospital shifts.',
  },
  {
    n: '03',
    title: 'Compare honestly',
    text: 'Two majors side by side: workload, skills, and where each one leads.',
  },
  {
    n: '04',
    title: 'Decide with reasons',
    text: 'Arrive at the application form able to say why.',
  },
]

const INSIDE = [
  {
    title: 'What you will study',
    text: 'The actual subjects, year by year — the syllabus, not the slogan.',
  },
  {
    title: 'Skills you will build',
    text: 'What you will be good at, whether or not you stay in the field.',
  },
  {
    title: 'Where it leads',
    text: 'The jobs this degree opens here, and the ones that need more.',
  },
  {
    title: 'Whether it fits you',
    text: 'Who thrives in it, and who quietly regrets choosing it.',
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
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* =========================== SOLUTION ========================== */}
      <div className="section solution">
        <Lattice className="solution__lattice" size={72} color="rgba(255,255,255,0.05)" />
        <div className="shell">
          <div className="solution__head">
            <Reveal>
              <span className="eyebrow">02 / The solution</span>
              <h3 className="solution__title">
                A platform dedicated to one job:{' '}
                <em>teaching you what each major actually is.</em>
              </h3>
            </Reveal>
            <Reveal delay={120}>
              <p className="solution__lede">
                Not a ranking, and not a quiz that hands you an answer. Every major explains itself
                in the same four terms, so you can compare them honestly — before you choose, and
                after, when you want to understand the one you are already in.
              </p>
            </Reveal>
          </div>

          <div className="pillars">
            {PILLARS.map((pillar, i) => (
              <Reveal className="pillar" key={pillar.title} delay={i * 90}>
                <span className="pillar__index" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="pillar__title">{pillar.title}</h4>
                  <p className="pillar__text">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
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

      {/* ============================== HOW ============================ */}
      <div className="section how" id="how">
        <Lattice className="how__lattice" size={84} color="rgba(255,255,255,0.05)" />
        <div className="shell">
          <div className="how__head">
            <Reveal>
              <span className="eyebrow">03 / How Majora works</span>
              <h3 className="how__title">
                The choice arrives on a form.{' '}
                <em>The preparation should arrive years earlier.</em>
              </h3>
            </Reveal>
            <Reveal delay={120} className="how__lede">
              <p>
                Most students meet a major for the first time in the week they apply for it. Majora
                moves that meeting forward, into the years when there is still time to change your
                mind.
              </p>
            </Reveal>
          </div>

          <ol className="steps">
            {STEPS.map((step, i) => (
              <Reveal as="li" className="step" key={step.n} delay={i * 90}>
                <span className="step__marker" aria-hidden="true">
                  <span className="step__diamond" />
                  {step.n}
                </span>
                <h4 className="step__title">{step.title}</h4>
                <p className="step__text">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      {/* ============================ INSIDE =========================== */}
      <div className="section inside">
        <div className="shell inside__grid">
          <Reveal className="inside__intro">
            <span className="eyebrow eyebrow--dark">04 / Inside a major page</span>
            <h3 className="inside__title">Four answers, for every single major in the library.</h3>
            <p className="inside__text">
              The same four questions, asked of Medicine and of Interior Design alike, so two majors
              can genuinely be compared.
            </p>
          </Reveal>

          <div className="inside__items">
            {INSIDE.map((item, i) => (
              <Reveal className="ipanel" key={item.title} delay={i * 80}>
                <span className="ipanel__index" aria-hidden="true">
                  0{i + 1}
                </span>
                <h4 className="ipanel__title">{item.title}</h4>
                <p className="ipanel__text">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
