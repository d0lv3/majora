import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import PillNav from './ui/PillNav.jsx'
import logo from '../assets/visual-identity/logo-web.png'

/**
 * The header for the product at /app.
 *
 * Same bar as the landing page, carrying the app's own places instead of the
 * marketing anchors. It used to be a separate solid rail, which made opening
 * the library feel like arriving at a different product; the library already
 * moved onto the landing page's light ground, and this finishes that.
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
      { label: 'Reach', href: '/app/reach' },
    ],
    [],
  )

  // Library stays lit on a major's own page: /app/dentistry is somewhere
  // inside the library, not another destination. Only the two that have a
  // page of their own take the marker off it.
  const activeHref = ['/app/map', '/app/reach'].find((href) => pathname.startsWith(href)) ?? '/app'

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
