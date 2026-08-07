import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import CornerLines from '../components/decor/CornerLines.jsx'
import { MAJORS, FIELDS } from '../data/majors.js'
import './About.css'

/**
 * The "why this exists" stretch of the landing page (#about).
 *
 * Reads as one argument, in order: the problem → why it persists → the
 * solution → what changes → how it works → what a major page holds → who we
 * are. It is a section, not a route, so it owns no CTA of its own; the page
 * closes with one shared call to action.
 */

const CONSEQUENCES = [
  {
    label: 'Uncertainty',
    text: 'The deadline arrives before the understanding does. Students pick under pressure, from a list of names they cannot picture.',
  },
  {
    label: 'Uninformed choices',
    text: 'A major gets chosen for its reputation, a relative’s advice, or the score it accepts, rarely for what studying it is actually like.',
  },
  {
    label: 'Unsuitable majors',
    text: 'Years, tuition and motivation go into a field that never fit. Switching late is expensive; finishing anyway can cost more.',
  },
]

const CAUSES = [
  {
    title: 'Exposure comes too late',
    text: 'Careers are discussed in the final year, if at all, long after subject choices have already narrowed the options.',
  },
  {
    title: 'Information is scattered',
    text: 'What exists is spread across university pages, PDFs and word of mouth, written for administrators rather than for teenagers.',
  },
  {
    title: 'Nobody describes the work',
    text: 'Course titles are public. What a student does all day for four to six years is not.',
  },
  {
    title: 'Advice is anecdotal',
    text: 'One cousin’s experience becomes the whole evidence base for a decade-long decision.',
  },
]

const PILLARS = [
  {
    title: 'A complete library, not a highlight reel',
    text: `All ${MAJORS.length} majors across ${FIELDS.length} fields get the same treatment. Medicine and Kurdish Literature are described with equal care, so nothing looks second-tier by omission.`,
  },
  {
    title: 'Written to be understood at 14',
    text: 'Plain language, no admissions jargon, no prestige signalling. If a middle school student cannot follow it, it gets rewritten.',
  },
  {
    title: 'Honest about the hard parts',
    text: 'Every major says who it suits and who it does not. A page that only sells the field is not preparation. It is marketing.',
  },
  {
    title: 'Built for this region',
    text: 'Scoped to programmes actually offered in Kurdistan, Iraq, and to the careers those degrees genuinely open here.',
  },
  {
    title: 'It keeps working after you have chosen',
    text: 'Choosing is only the first use. If you are already studying something, the same four answers tell you what the remaining years hold, which skills the degree is quietly building, and what it opens once you graduate. Plenty of students reach second year still unsure what their own major is for.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Open the library',
    text: 'Every major offered in the region, in one place, described in plain language instead of a prospectus.',
  },
  {
    n: '02',
    title: 'See the real work',
    text: 'What the four to six years actually contain: the subjects, the labs, the studio nights, the hospital shifts.',
  },
  {
    n: '03',
    title: 'Compare honestly',
    text: 'Put two majors side by side and see where they differ: workload, skills, and where each one leads.',
  },
  {
    n: '04',
    title: 'Decide with reasons',
    text: 'Arrive at the application form able to say why, not because of a score, a relative, or a rumour.',
  },
]

const INSIDE = [
  {
    title: 'What you will study',
    text: 'The actual subjects, year by year. Not a slogan, but the syllabus behind it.',
  },
  {
    title: 'Skills you will build',
    text: 'What you will be good at when you graduate, whether or not you stay in the field.',
  },
  {
    title: 'Where it leads',
    text: 'The jobs this degree opens here, and the ones that need a further qualification.',
  },
  {
    title: 'Whether it fits you',
    text: 'A blunt sentence about who thrives in it, and who quietly regrets choosing it.',
  },
]

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      {/* Names the landmark for assistive tech; the visible "About Majora"
          block closes the section rather than opening it. */}
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
                Middle school students and beyond in Kurdistan, Iraq struggle to choose the right
                major because they are{' '}
                <mark>not adequately prepared or exposed to different academic and career paths</mark>{' '}
                before graduation.
              </p>
              <footer>The problem statement, in full</footer>
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

      {/* ============================ CAUSES =========================== */}
      <div className="section causes">
        <div className="shell">
          <Reveal className="causes__head">
            <span className="eyebrow eyebrow--dark">Why it keeps happening</span>
            <h3 className="causes__title">
              The gap is not intelligence or effort. It is exposure.
            </h3>
          </Reveal>

          <div className="causes__grid">
            {CAUSES.map((cause, i) => (
              <Reveal className="cause" key={cause.title} delay={i * 80}>
                <span className="cause__mark" aria-hidden="true" />
                <h4 className="cause__title">{cause.title}</h4>
                <p className="cause__text">{cause.text}</p>
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
                Not a ranking. Not an aptitude quiz that hands you an answer. Majora is a library
                you can walk through for years before you ever fill in a form, where every major
                explains itself in the same four terms, so you can compare them honestly and end up
                somewhere that fits. It does not close once the choice is made. The page that helps
                you pick a major is the same one that shows you the rest of it.
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
              <li>You discover what the degree involves in the second semester.</li>
              <li>Changing course means losing a year, or more.</li>
            </ul>
          </Reveal>

          <span className="shift__arrow" aria-hidden="true">
            →
          </span>

          <Reveal className="shift__col shift__col--after" delay={140}>
            <span className="shift__tag shift__tag--gold">With Majora</span>
            <ul>
              <li>You have been reading about majors.</li>
              <li>You know which fields genuinely interest you, and why.</li>
              <li>You already know what the first two years contain.</li>
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
                moves that meeting forward, into middle school, into the years when there is still
                time to be curious, change your mind, and change it back.
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
              The same four questions, asked of Medicine and of Interior Design alike, so two
              majors can genuinely be compared instead of merely admired.
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

      {/* ========================= ABOUT MAJORA ======================== */}
      <div className="ahead">
        <CornerLines className="ahead__lines" stroke="rgba(255,255,255,0.16)" />
        <div className="shell ahead__inner">
          <span className="eyebrow">About Majora</span>
          <h3 className="ahead__title">
            A decision this big should not be made
            <br />
            on this little information.
          </h3>
          <p className="ahead__lede">
            Majora exists for one reason: students here are asked to choose a major before anyone
            has shown them what the majors are.
          </p>
        </div>
      </div>
    </section>
  )
}
