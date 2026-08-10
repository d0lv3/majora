/**
 * The frame every screen of the simulation sits in.
 *
 * Header, title, an optional system banner, the screen's own body, and the
 * ways out along the bottom. Screens differ enormously in what they put in the
 * middle and barely at all around it, so the chrome is here and only the
 * middle is written twenty-five times.
 *
 * `actions` is a list rather than a next/back pair because a third of the
 * screens branch: screen 2 offers four ways to get to know a patient and no
 * single next step, and screen 5 offers four kinds of record.
 */
export default function Screen({ visit, title, lede, banner, children, actions = [], footnote }) {
  return (
    <div className="simScreen">
      <header className="simScreen__head">
        {visit && <p className="simScreen__visit">{visit}</p>}
        <h2 className="simScreen__title">{title}</h2>
        {lede && <p className="simScreen__lede">{lede}</p>}
      </header>

      {banner && (
        <p className="simBanner" role="status">
          <span className="simBanner__mark" aria-hidden="true" />
          <span>{banner}</span>
        </p>
      )}

      <div className="simScreen__body">{children}</div>

      {actions.length > 0 && (
        <footer className="simScreen__foot">
          <div className="simScreen__actions">
            {actions.map((a) => (
              <button
                type="button"
                key={a.label}
                className={`simBtn${a.primary ? ' simBtn--primary' : ''}`}
                onClick={a.onClick}
                disabled={a.disabled}
              >
                {a.label}
                {a.done && (
                  <span className="simBtn__done" aria-label="explored">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Why a locked action is locked, said plainly rather than left to be
              guessed at from a greyed-out button. */}
          {footnote && <p className="simScreen__footnote">{footnote}</p>}
        </footer>
      )}
    </div>
  )
}
