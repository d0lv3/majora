import { Link } from 'react-router-dom'
import logo from '../assets/visual-identity/logo-web.png'
import { FIELDS, MAJORS } from '../data/majors.js'
import { useAuth } from '../context/AuthContext.jsx'
import './Footer.css'

/** The landing page's footer. The app at /app deliberately has none. */
export default function Footer() {
  const { isAuthenticated } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__brand">
          <Link to="/" className="foot__lockup">
            <img src={logo} alt="" width="58" height="58" />
            <span>
              <strong>Majora</strong>
              <em>Discover Where You Fit</em>
            </span>
          </Link>
          <p className="foot__blurb">
            A guide to every university major in Kurdistan, Iraq, for students choosing one and
            for students already studying one.
          </p>
        </div>

        <nav className="foot__cols" aria-label="Footer">
          <div className="foot__col">
            <h2>Platform</h2>
            <ul>
              <li>
                <Link to="/#top">Home</Link>
              </li>
              <li>
                <Link to="/#about">About</Link>
              </li>
              <li>
                <Link to="/#contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="foot__col">
            <h2>Account</h2>
            <ul>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/app">Open the library</Link>
                  </li>
                  <li>
                    <Link to="/logout">Log out</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Log in</Link>
                  </li>
                  <li>
                    <Link to="/signup">Create an account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="foot__col foot__col--wide">
            <h2>
              Fields <span>{MAJORS.length} majors</span>
            </h2>
            <ul className="foot__fields">
              {FIELDS.map((field) => (
                <li key={field.id}>
                  <Link to="/app">{field.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell foot__bar">
        <span>© {year} Majora</span>
        <span className="foot__barDot" aria-hidden="true" />
        <span>Kurdistan, Iraq</span>
        <span className="foot__barSpacer" />
        <span className="foot__note">Front-end preview</span>
      </div>
    </footer>
  )
}
