import { useState } from 'react'

import Reveal from '../components/Reveal.jsx'
import Lattice from '../components/decor/Lattice.jsx'
import SpecularButton from '../components/ui/SpecularButton.jsx'
import SB from '../components/ui/buttonPresets.js'
import './Contact.css'

/** The contact stretch of the landing page (#contact). */

const REASONS = ['I am a student', 'I teach or advise students', 'I want to contribute a major', 'Something else']

const CHANNELS = [
  {
    label: 'For students',
    text: 'A major missing, or a page that does not match your experience of it? Corrections from inside the field are the fastest way this gets better.',
  },
  {
    label: 'For schools',
    text: 'Want your students exploring majors earlier? Tell us how your year is structured.',
  },
  {
    label: 'For universities',
    text: 'Departments are welcome to send their programme details themselves.',
  },
]

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', reason: REASONS[0], message: '' })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Tell us who you are.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.message.trim().length < 10) next.message = 'A sentence or two, at least.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
  }

  return (
    <section className="contact" id="contact">
      <header className="chead">
        <Lattice className="chead__lattice" size={80} color="rgba(255,255,255,0.06)" />
        <div className="shell chead__inner">
          <span className="eyebrow">Contact</span>
          <h2 className="chead__title">Tell us what we got wrong.</h2>
          <p className="chead__lede">
            Majora is only as good as the people who correct it. If a major is described in a way
            that does not match the reality of studying it, that is a bug.
          </p>
        </div>
      </header>

      <div className="section cbody">
        <div className="shell cbody__grid">
          <div className="cbody__side">
            {CHANNELS.map((channel, i) => (
              <Reveal className="channel" key={channel.label} delay={i * 90}>
                <h3 className="channel__label">
                  <span className="channel__diamond" aria-hidden="true" />
                  {channel.label}
                </h3>
                <p className="channel__text">{channel.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="cform" delay={100}>
            {sent ? (
              <div className="cform__done" role="status">
                <span className="cform__doneMark" aria-hidden="true" />
                <h3>Thank you, {values.name.split(' ')[0]}.</h3>
                <p>
                  Nothing was actually transmitted. This is the front-end preview, and the form is
                  not wired to a backend yet. Your message stayed in this browser.
                </p>
                <button
                  type="button"
                  className="btn btn--outline-dark"
                  onClick={() => {
                    setSent(false)
                    setValues({ name: '', email: '', reason: REASONS[0], message: '' })
                  }}
                >
                  Write another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input
                    id="c-name"
                    type="text"
                    value={values.name}
                    onChange={set('name')}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <span className="field__error">{errors.name}</span>}
                </div>

                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    value={values.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <span className="field__error">{errors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="c-reason">You are</label>
                  <select id="c-reason" value={values.reason} onChange={set('reason')}>
                    {REASONS.map((reason) => (
                      <option key={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    rows="5"
                    value={values.message}
                    onChange={set('message')}
                    placeholder="What should we fix, add, or explain better?"
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <span className="field__error">{errors.message}</span>}
                </div>

                <SpecularButton
                  {...SB.purple}
                  size="md"
                  type="submit"
                  className="specular-button--block"
                >
                  Send message
                  <span className="sb-arrow" aria-hidden="true">
                    →
                  </span>
                </SpecularButton>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
