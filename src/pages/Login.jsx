import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AuthAside from '../components/AuthAside.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/app'

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.password.length < 6) next.password = 'Passwords are at least 6 characters.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    await login({ email: values.email })
    navigate(from, { replace: true })
  }

  return (
    <div className="auth">
      <AuthAside
        eyebrow="Welcome back"
        title="The library is where you left it."
        text="Your saved majors, your comparisons, and the fields you were working through. All still here."
      />

      <section className="auth__panel">
        <div className="auth__panelInner">
          <header className="auth__head">
            <h1 className="auth__title">Log in</h1>
            <p className="auth__sub">
              New here?{' '}
              <Link to="/signup" className="linky auth__swap">
                Create an account
              </Link>
            </p>
          </header>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={set('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span className="field__error" id="email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="field">
              <div className="field__row">
                <label htmlFor="password">Password</label>
                <button type="button" className="field__aside">
                  Forgot?
                </button>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                onChange={set('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span className="field__error" id="password-error">
                  {errors.password}
                </span>
              )}
            </div>

            <SpecularButton
              {...SB.purple}
              size="md"
              type="submit"
              disabled={busy}
              className="specular-button--block auth__submit"
            >
              {busy ? 'Opening the library…' : 'Log in'}
              <span className="sb-arrow" aria-hidden="true">
                →
              </span>
            </SpecularButton>

            <p className="auth__note">
              Front-end preview. Credentials are kept in this browser only, and no account is
              created anywhere.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
