import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PillNav from './ui/PillNav.jsx'
import logo from '../assets/visual-identity/logo-web.png'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * The landing-page navigation, built on React Bits' <PillNav />.
 *
 * Everything public lives on one page, so Home/About/Contact are anchors into
 * it rather than routes — only the account item is a real destination. The
 * signed-in product at /app carries its own header instead of this one.
 *
 * The items array is memoised on purpose: PillNav re-runs its GSAP layout
 * whenever `items` changes identity, so a fresh array every render would
 * replay the reveal animation on each keystroke elsewhere in the tree.
 */

const SECTIONS = ['top', 'about', 'contact']

/** Which landing section the reader is currently in front of. */
function useActiveSection(enabled) {
  const [active, setActive] = useState(SECTIONS[0])

  useEffect(() => {
    if (!enabled) return undefined

    let frame = 0
    const measure = () => {
      frame = 0
      // The section whose top has passed the upper third of the viewport wins;
      // the intro sections between #top and #about keep Home lit, which is
      // what a reader coasting down the page expects.
      const line = window.innerHeight * 0.35
      let current = SECTIONS[0]
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled])

  return active
}

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  const onLanding = pathname === '/'
  const active = useActiveSection(onLanding)

  const items = useMemo(
    () => [
      { label: 'Home', href: '/#top' },
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
      isAuthenticated
        ? { label: 'Open app', href: '/app' }
        : { label: 'Login', href: '/login' },
    ],
    [isAuthenticated],
  )

  // Off the landing page the anchors are ordinary links home, so nothing is lit
  // unless the reader is on the account destination itself.
  const activeHref = onLanding ? `/#${active}` : pathname

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
