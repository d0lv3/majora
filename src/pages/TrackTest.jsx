import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CornerLines from '../components/decor/CornerLines.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import { useAuth } from '../context/AuthContext.jsx'
import { QUESTIONS, TRACKS, scoreTest } from '../data/trackTest.js'
import logo from '../assets/visual-identity/logo-web.png'
import './TrackTest.css'

/**
 * The track test, at /quiz — where a new account lands straight after signing
 * up, and the only thing standing between registering and the library.
 *
 * Which is why every screen carries a way out. "Skip for now" sits in the
 * header from the first question to the last, a single question can be passed
 * over without answering it, and skipping is recorded as a real answer rather
 * than left pending so the test does not ambush the reader again next visit.
 * A test you cannot leave is a wall, and this one is a suggestion.
 *
 * One question per screen on purpose: eight at once is a form, and a form is
 * something you fill in as fast as possible rather than think about.
 */
export default function TrackTest() {
  const navigate = useNavigate()
  const { user, completeTrackTest } = useAuth()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const total = QUESTIONS.length
  const question = QUESTIONS[step]
  const result = useMemo(() => (finished ? scoreTest(answers) : null), [finished, answers])
  const firstName = (user?.name || '').trim().split(' ')[0]

  /** Moves on, and finishes on the last question whether or not it was answered. */
  const advance = (next) => {
    if (step + 1 < total) {
      setStep(step + 1)
      return
    }
    setFinished(true)
    // Scored here rather than in an effect, so what gets stored is the same
    // object the result screen is about to render.
    const scored = scoreTest(next ?? answers)
    completeTrackTest(scored?.track ?? null)
  }

  const answer = (track) => {
    const next = { ...answers, [question.id]: track }
    setAnswers(next)
    advance(next)
  }

  const skipQuestion = () => {
    // A question already answered and then skipped on the way back through
    // should lose its answer, not keep the old one.
    const next = { ...answers }
    delete next[question.id]
    setAnswers(next)
    advance(next)
  }

  const skipAll = () => {
    completeTrackTest(null)
    navigate('/app', { replace: true })
  }

  const retake = () => {
    setAnswers({})
    setStep(0)
    setFinished(false)
  }

  // Null on a dead tie, which is a third outcome rather than a missing one.
  const track = result?.track ? TRACKS[result.track] : null
  const other = track
    ? TRACKS[track.id === 'scientific' ? 'literary' : 'scientific']
    : null

  return (
    <div className="quiz">
      <Lattice className="quiz__lattice" size={78} color="rgba(255,255,255,0.06)" />
      <CornerLines className="quiz__lines" stroke="rgba(255,255,255,0.14)" />

      <header className="quiz__bar">
        <Link to="/" className="quiz__brand">
          <img src={logo} alt="" width="40" height="40" />
          <span>Majora</span>
        </Link>

        {!finished && (
          <button type="button" className="quiz__skipAll" onClick={skipAll}>
            Skip for now
          </button>
        )}
      </header>

      <main className="quiz__stage">
        {!finished ? (
          <section className="quiz__card" aria-labelledby="quiz-prompt">
            <div className="quiz__progress">
              <p className="quiz__step">
                Question {step + 1} <span aria-hidden="true">/</span>
                <span className="sr-only">of</span> {total}
              </p>
              <div
                className="quiz__track"
                role="progressbar"
                aria-valuenow={step + 1}
                aria-valuemin={1}
                aria-valuemax={total}
                aria-label="Progress through the test"
              >
                <span
                  className="quiz__fill"
                  style={{ transform: `scaleX(${(step + 1) / total})` }}
                />
              </div>
            </div>

            {step === 0 && (
              <p className="quiz__intro">
                {firstName ? `${firstName}, one` : 'One'} short thing before the library. Eight
                questions, no marks, no right answers — it only points you at the branch you are
                already leaning towards.
              </p>
            )}

            <h1 className="quiz__prompt" id="quiz-prompt">
              {question.prompt}
            </h1>

            {/* Order alternates so the science answer is not always the first
                thing under the thumb — eight questions is long enough for a
                fixed side to become the habit rather than the choice. */}
            <div className="quiz__options">
              {(step % 2 === 0
                ? [
                    ['scientific', question.sci],
                    ['literary', question.lit],
                  ]
                : [
                    ['literary', question.lit],
                    ['scientific', question.sci],
                  ]
              ).map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  className={`quizOpt${answers[question.id] === id ? ' is-on' : ''}`}
                  onClick={() => answer(id)}
                >
                  <span className="quizOpt__mark" aria-hidden="true" />
                  <span className="quizOpt__label">{label}</span>
                </button>
              ))}
            </div>

            <div className="quiz__foot">
              {step > 0 ? (
                <button type="button" className="quiz__back" onClick={() => setStep(step - 1)}>
                  <span aria-hidden="true">←</span> Back
                </button>
              ) : (
                <span />
              )}
              <button type="button" className="quiz__pass" onClick={skipQuestion}>
                Skip this question
              </button>
            </div>
          </section>
        ) : (
          <section className="quiz__card quiz__card--result" aria-labelledby="quiz-result">
            <span className="eyebrow">Your result</span>

            {track ? (
              <>
                <h1 className="quiz__result" id="quiz-result">
                  <span className="quiz__resultEn">{track.name}</span>
                </h1>

                <div className="quiz__meter">
                  <span
                    className="quiz__meterFill"
                    style={{ transform: `scaleX(${result.share / 100})` }}
                  />
                </div>
                <p className="quiz__meterLabel">
                  {result.share}% of your {result.answered}{' '}
                  {result.answered === 1 ? 'answer' : 'answers'} pointed this way
                </p>

                <p className="quiz__text">{track.text}</p>
                <p className="quiz__text quiz__text--subjects">
                  That track leans on <strong>{track.subjects}</strong>.
                </p>

                {/* A near-tie is said out loud. Reporting 4-3 as a verdict is
                    how somebody ends up four years into the wrong hall. */}
                {result.close && (
                  <p className="quiz__caveat">
                    <span className="quiz__caveatMark" aria-hidden="true" />
                    <span>
                      It was close, though — one answer in it. Both branches are genuinely open to
                      you, so read a few majors on each side before you let this decide anything.
                    </span>
                  </p>
                )}
              </>
            ) : result ? (
              /* Even. Naming a winner off a tiebreak would be inventing a
                 result the answers did not give. */
              <>
                <h1 className="quiz__result" id="quiz-result">
                  <span className="quiz__resultEn">Evenly split</span>
                </h1>

                <div className="quiz__meter quiz__meter--even">
                  <span className="quiz__meterFill" style={{ transform: 'scaleX(0.5)' }} />
                </div>
                <p className="quiz__meterLabel">
                  {result.scientific} scientific, {result.literary} literary — dead even
                </p>

                <p className="quiz__text">
                  You answered as many one way as the other, so there is no leaning here to report.
                  That is not a failed test: plenty of people genuinely sit across both, and the
                  useful next step is reading what a few specific majors actually involve rather
                  than picking a branch first.
                </p>
                <p className="quiz__text quiz__text--subjects">
                  Scientific leans on <strong>{TRACKS.scientific.subjects}</strong>. Literary leans
                  on <strong>{TRACKS.literary.subjects}</strong>.
                </p>
              </>
            ) : (
              <>
                <h1 className="quiz__result" id="quiz-result">
                  <span className="quiz__resultEn">No answers, no verdict</span>
                </h1>
                <p className="quiz__text">
                  You skipped every question, which is a fair answer in itself. The library is open
                  either way — it is the part that actually tells you what a major is.
                </p>
              </>
            )}

            <div className="quiz__actions">
              <SpecularButton
                {...SB.gold}
                size="lg"
                onClick={() => navigate('/app', { replace: true })}
              >
                Open the library
                <span className="sb-arrow" aria-hidden="true">
                  →
                </span>
              </SpecularButton>
              <button type="button" className="quiz__retake" onClick={retake}>
                Take it again
              </button>
            </div>

            {other && (
              <p className="quiz__note">
                This is a leaning, not a placement. Nothing on Majora is locked to it, and the{' '}
                {other.name.toLowerCase()} majors stay open in the library.
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
