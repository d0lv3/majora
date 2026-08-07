import { Link } from 'react-router-dom'
import logo from '../assets/visual-identity/logo-web.png'
import { useAuth } from '../context/AuthContext.jsx'
import './AppNav.css'

/**
 * The header for the signed-in product at /app.
 *
 * Deliberately not the landing <Navbar />: no marketing anchors, no floating
 * pill bar — a plain sticky rail with the way back to the library, the way
 * out to the site, and the way out of the session.
 *
 * Log out is a link to /logout rather than a handler that clears the session
 * here: clearing it in place would trip this page's own auth guard first and
 * dump the reader on the login screen instead of the landing page.
 */
export default function AppNav() {
  const { user } = useAuth()

  const firstName = (user?.name || 'there').split(' ')[0]

  return (
    <header className="appnav">
      <div className="appnav__inner">
        <Link to="/app" className="appnav__brand" aria-label="The library">
          <span className="appnav__disc">
            <img src={logo} alt="" />
          </span>
          {/* no sub-label: the page's own h1 already names where you are */}
          <span className="appnav__word">
            <strong>Majora</strong>
          </span>
        </Link>

        <nav className="appnav__side" aria-label="Account">
          <Link to="/" className="appnav__link">
            Landing page
          </Link>
          <span className="appnav__who" title={user?.email}>
            {firstName}
          </span>
          <Link to="/logout" className="appnav__out">
            Log out
          </Link>
        </nav>
      </div>
    </header>
  )
}
