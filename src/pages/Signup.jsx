import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthAside from '../components/AuthAside.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import { useAuth } from '../context/AuthContext.jsx'
import { MAJORS } from '../data/majors.js'
import './Auth.css'

const STAGES = ['Middle school', 'Highschool', 'Graduated', 'Parent or teacher']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', password: '', grade: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Tell us what to call you.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.password.length < 6) next.password = 'Use at least 6 characters.'
    if (!values.grade) next.grade = 'Pick the closest one.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    await signup(values)
    // Straight into the track test rather than the library: it is eight
    // questions with a skip in the header, and this is the one moment a reader
    // has not yet started looking for something specific.
    navigate('/quiz', { replace: true })
  }

  return (
    <div className="auth">
      <AuthAside
        eyebrow="Create an account"
        title={`${MAJORS.length} majors, explained properly.`}
        text="Free, and built for students who still have years before they have to choose, which is exactly when this is worth reading."
      />

      <section className="auth__panel">
        <div className="auth__panelInner">
          <header className="auth__head">
            <h1 className="auth__title">Get started</h1>
            <p className="auth__sub">
              Already registered?{' '}
              <Link to="/login" className="linky auth__swap">
                Log in
              </Link>
            </p>
          </header>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={set('name')}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={set('email')}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={values.password}
                onChange={set('password')}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && <span className="field__error">{errors.password}</span>}
            </div>

            <fieldset className="field field--stage">
              <legend>Where are you right now?</legend>
              <div className="chips">
                {STAGES.map((stage) => (
                  <button
                    type="button"
                    key={stage}
                    className={`chip ${values.grade === stage ? 'is-on' : ''}`}
                    aria-pressed={values.grade === stage}
                    onClick={() => {
                      setValues((v) => ({ ...v, grade: stage }))
                      setErrors((e) => ({ ...e, grade: undefined }))
                    }}
                  >
                    {stage}
                  </button>
                ))}
              </div>
              {errors.grade && <span className="field__error">{errors.grade}</span>}
            </fieldset>

            <SpecularButton
              {...SB.gold}
              size="md"
              type="submit"
              disabled={busy}
              className="specular-button--block auth__submit"
            >
              {busy ? 'Setting things up…' : 'Get Started'}
              <span className="sb-arrow" aria-hidden="true">
                →
              </span>
            </SpecularButton>

            <p className="auth__note">
              Front-end preview. Your details stay in this browser, and nothing is sent anywhere.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
