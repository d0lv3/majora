import { Link } from 'react-router-dom'
import logo from '../assets/visual-identity/logo-web.png'
import CornerLines from './decor/CornerLines.jsx'
import Lattice from './decor/Lattice.jsx'

/**
 * The purple half of the login / signup split. Carries the brand lockup so the
 * auth screens still feel like the landing page even without the nav bar.
 */
export default function AuthAside({ eyebrow, title, text }) {
  return (
    <aside className="auth__aside">
      <Lattice className="auth__lattice" size={78} color="rgba(255,255,255,0.06)" />
      <CornerLines className="auth__lines" stroke="rgba(255,255,255,0.15)" />

      <Link to="/" className="auth__brand">
        <img src={logo} alt="" width="46" height="46" />
        <span>Majora</span>
      </Link>

      <div className="auth__asideBody">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="auth__asideTitle">{title}</h2>
        <p className="auth__asideText">{text}</p>
      </div>

      <Link to="/" className="auth__back">
        ← Back to site
      </Link>
    </aside>
  )
}
