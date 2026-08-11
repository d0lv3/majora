import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getMajor } from '../../data/majors.js'
import { price, schoolName } from '../../data/reach.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './reach.css'

/**
 * Reserving a meeting.
 *
 * A REQUEST, NOT A CHECKOUT. Nobody's card is taken here and nothing is booked
 * on anybody's calendar — the reader proposes a time and says what they want
 * to ask, and the person confirms it. That is not a limitation of the
 * prototype, it is the honest shape of the thing: these are real people with
 * their own timetables, and a form that sold a slot they had not agreed to
 * would be selling something we do not have. The copy at the end says so
 * plainly rather than implying a booking.
 *
 * <dialog> and showModal() rather than a div with a z-index: the browser gives
 * a focus trap, Escape, the inert background and the backdrop for free, and a
 * hand-rolled version of that is four bugs waiting.
 */

/* Baghdad time, which is what everyone on both ends of this call is on. Whole
   hours only: a list of fifteen-minute slots implies a calendar we can see. */
const SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00']

const twoDigits = (n) => String(n).padStart(2, '0')
const isoDay = (date) =>
  `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`

/** Tomorrow at the earliest — nobody confirms a call for this afternoon. */
function earliestDay() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return isoDay(d)
}

/**
 * Questions worth asking, drawn from the major's own entry in the library.
 *
 * Deliberately not from the person: writing "ask me about X" on somebody's
 * behalf is putting words in their mouth. These are the site's claims about
 * the subject, offered as a starting point the reader can edit or ignore.
 */
function questionsFor(slugs) {
  const major = getMajor(slugs[0])
  const base = [
    'What does a normal week actually look like?',
    'What surprised you most in the first year?',
    'What would you do differently if you started again?',
  ]
  if (!major) return base
  return [
    `Is ${major.name} what you expected it to be?`,
    ...base,
    /* Quoted, because a career is a noun phrase written for a list and reads
       as a grammatical accident the moment it is dropped mid-sentence. */
    major.careers?.[0] && `Is “${major.careers[0]}” realistic from where I am?`,
  ].filter(Boolean)
}

/**
 * Holds the page still behind the modal.
 *
 * A modal <dialog> makes the page inert but does not stop it scrolling, and a
 * background that slides around under a fixed panel reads as broken. The
 * padding is the other half: hiding the scrollbar takes its width out of the
 * layout and shifts the whole page sideways as the dialog opens.
 */
function useHeldPage(open) {
  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    const gap = window.innerWidth - root.clientWidth
    const prevOverflow = root.style.overflow
    const prevPad = root.style.paddingRight
    root.style.overflow = 'hidden'
    if (gap > 0) root.style.paddingRight = `${gap}px`
    return () => {
      root.style.overflow = prevOverflow
      root.style.paddingRight = prevPad
    }
  }, [open])
}

export default function ReachDialog({ person, onClose }) {
  const ref = useRef(null)
  const { user } = useAuth()
  const titleId = useId()

  const [minutes, setMinutes] = useState(person?.sessions[0]?.minutes ?? 30)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  useHeldPage(Boolean(person))

  /* Who was standing here before the dialog opened, so the keyboard is put
     back on the Reach button it came from rather than at the top of the
     document. A dialog closed with close() restores focus itself; this one is
     unmounted as well as closed, and an element removed from the page cannot
     hand anything back.

     A layout effect, and declared above the one that calls showModal: passive
     effects run in declaration order after this, so by the time showModal has
     moved focus into the panel it is too late to ask where focus was. */
  const opener = useRef(null)
  useLayoutEffect(() => {
    if (!person) return undefined
    opener.current = document.activeElement
    return () => {
      const back = opener.current
      if (back instanceof HTMLElement && document.contains(back)) back.focus()
    }
  }, [person])

  /* A different person in the same dialog is a different booking. Keyed on the
     id rather than reset on close, so the form is clean on the way in however
     it was left on the way out. */
  useEffect(() => {
    if (!person) return
    setMinutes(person.sessions[0]?.minutes ?? 30)
    setDay('')
    setTime('')
    setNote('')
    setSent(false)
  }, [person])

  /* No cleanup: an open dialog removed from the document leaves the top layer
     with it, so unmounting is already closing. Calling close() here would fire
     `close` at a detached node and bounce another dismissal at the parent. */
  useEffect(() => {
    const node = ref.current
    if (node && !node.open) node.showModal()
  }, [person])

  /**
   * The one way out, and it does both halves itself.
   *
   * The obvious version of this listens for the dialog's own `close` event and
   * lets the parent clear its state from there. That was the first version and
   * it is a trap: `close` is fired from a queued task rather than synchronously
   * from close(), and a page that is not being painted can leave that task
   * unrun — measurably, here, seconds later. The dialog then sits closed but
   * still mounted, with the page still held and the scrollbar still gone, and
   * pressing Reach again does nothing because the state never changed.
   *
   * So the element is told to close and the parent is told to forget, in that
   * order, by whoever is doing the dismissing. Nothing waits on an event.
   */
  const dismiss = useCallback(() => {
    ref.current?.close()
    onClose()
  }, [onClose])

  /* Escape, caught before the browser's own handling of it. The dialog would
     close itself and fire `cancel` — another event delivered from a task — and
     this is the one exit the reader can take that no button of ours is
     involved in. A keydown is a real input event and always lands. */
  useEffect(() => {
    if (!person) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      dismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [person, dismiss])

  const questions = useMemo(() => (person ? questionsFor(person.majors) : []), [person])

  if (!person) return null

  const session = person.sessions.find((s) => s.minutes === minutes) ?? person.sessions[0]
  const ready = Boolean(day && time)

  const submit = (event) => {
    event.preventDefault()
    if (!ready) return
    /* Where `POST /reach/requests` goes — { personId, minutes, day, time,
       note }, answered with a request id. Until there is one, the confirmation
       below is careful to describe a message that has been sent and not a
       meeting that has been booked. */
    setSent(true)
  }

  return (
    <dialog
      className="rdlg"
      ref={ref}
      aria-labelledby={titleId}
      /* Kept as a net rather than as the mechanism: if the browser closes this
         some way we have not handled, the parent still hears about it. Setting
         the same state to null twice costs nothing. */
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        dismiss()
      }}
      onClick={(event) => {
        /* A click that lands on the dialog element itself landed on the
           backdrop: everything inside is a child of the panel. */
        if (event.target === ref.current) dismiss()
      }}
    >
      <div className="rdlg__panel">
        <button type="button" className="rdlg__x" onClick={dismiss}>
          <span className="sr-only">Close</span>
          <span aria-hidden="true">×</span>
        </button>

        <header className="rdlg__head">
          <img className="rdlg__face" src={person.photo} alt="" width="720" height="900" />
          <div>
            <p className="rdlg__eyebrow">{sent ? 'Request sent' : 'Reach'}</p>
            <h2 className="rdlg__title" id={titleId}>
              {sent ? 'Now it is with them' : `Book time with ${person.name}`}
            </h2>
            <p className="rdlg__sub">
              {person.headline} · {schoolName(person.study[0])}
            </p>
          </div>
        </header>

        {sent ? (
          <div className="rdlg__done">
            <p className="rdlg__doneLead">
              {person.name.split(' ')[0]} has your request for{' '}
              <b>
                {new Date(`${day}T00:00:00`).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </b>{' '}
              at <b>{time}</b>, for {session.minutes} minutes.
            </p>
            {/* The honest part, and the reason it is set as its own block
                rather than buried in a paragraph: no money has moved and no
                meeting exists yet. */}
            <p className="rdlg__doneNote">
              Nothing has been charged. They confirm the time first — you will hear at{' '}
              <b>{user?.email ?? 'your account email'}</b> — and the {price(session.amount)} is
              settled after that. If the time does not suit them they will propose another.
            </p>
            <button type="button" className="rdlg__go" onClick={dismiss}>
              Done
            </button>
          </div>
        ) : (
          <form className="rdlg__form" onSubmit={submit}>
            <fieldset className="rdlg__field">
              <legend className="rdlg__label">How long</legend>
              <div className="rdlg__lengths">
                {person.sessions.map((s) => (
                  <button
                    type="button"
                    key={s.minutes}
                    className={`rdlg__length${s.minutes === minutes ? ' is-on' : ''}`}
                    aria-pressed={s.minutes === minutes}
                    onClick={() => setMinutes(s.minutes)}
                  >
                    <span className="rdlg__mins">{s.minutes} minutes</span>
                    <span className="rdlg__price">{price(s.amount)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="rdlg__when">
              <label className="rdlg__field">
                <span className="rdlg__label">Which day</span>
                <input
                  type="date"
                  className="rdlg__input"
                  value={day}
                  min={earliestDay()}
                  onChange={(e) => setDay(e.target.value)}
                  required
                />
              </label>

              <label className="rdlg__field">
                <span className="rdlg__label">What time</span>
                <select
                  className="rdlg__input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="">Choose a time</option>
                  {SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="rdlg__tz">Times are Baghdad time. They confirm before anything is set.</p>

            <div className="rdlg__field">
              <label className="rdlg__label" htmlFor={`${titleId}-note`}>
                What do you want to ask? <span className="rdlg__optional">Optional</span>
              </label>
              <ul className="rdlg__asks">
                {questions.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      className="rdlg__ask"
                      onClick={() => setNote((n) => (n ? `${n.trimEnd()}\n${q}` : q))}
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
              <textarea
                id={`${titleId}-note`}
                className="rdlg__note"
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything you want them to have thought about before the call."
              />
            </div>

            <div className="rdlg__foot">
              <p className="rdlg__total">
                <span className="rdlg__totalLabel">{session.minutes} minutes</span>
                <span className="rdlg__totalPrice">{price(session.amount)}</span>
              </p>
              <button type="submit" className="rdlg__go" disabled={!ready}>
                Send the request
              </button>
            </div>
            <p className="rdlg__small">
              You are not charged now. {person.name.split(' ')[0]} confirms the time first.
            </p>
          </form>
        )}
      </div>
    </dialog>
  )
}
