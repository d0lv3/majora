import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import PillNav from './ui/PillNav.jsx'
import logo from '../assets/visual-identity/logo-web.png'

/**
 * The header for the signed-in product at /app.
 *
 * Same bar as the landing page, carrying the app's own places instead of the
 * marketing anchors. It used to be a separate solid rail, which made signing
 * in feel like arriving at a different product; the library already moved onto
 * the landing page's light ground, and this finishes that.
 *
 * Log out is a link to /logout rather than a handler that clears the session
 * here: clearing it in place would trip the route guard first and dump the
 * reader on the login screen instead of the landing page.
 *
 * The items array is memoised because PillNav re-runs its GSAP layout whenever
 * `items` changes identity, and a fresh array every render would replay the
 * reveal animation on every keystroke in the search box.
 */
export default function AppNav() {
  const { pathname } = useLocation()

  const items = useMemo(
    () => [
      { label: 'Library', href: '/app' },
      { label: 'Map', href: '/app/map' },
      { label: 'Site', href: '/', ariaLabel: 'Back to the public site' },
      { label: 'Log out', href: '/logout' },
    ],
    [],
  )

  // Library stays lit on a major's own page: /app/dentistry is somewhere
  // inside the library, not a fourth destination.
  const activeHref = pathname.startsWith('/app/map') ? '/app/map' : '/app'

  return (
    <PillNav
      logo={logo}
      logoAlt="Majora"
      items={items}
      activeHref={activeHref}
      className="majora-nav"
      ease="power3.easeOut"
      baseColor="#0b0810"
      pillColor="#0b0810"
      pillTextColor="#ffffff"
      hoveredPillTextColor="#1e1330"
      initialLoadAnimation
    />
  )
}
