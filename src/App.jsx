import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useLayoutEffect } from 'react'

import BrandLoader from './components/BrandLoader.jsx'
import Navbar from './components/Navbar.jsx'
import AppNav from './components/AppNav.jsx'
import Footer from './components/Footer.jsx'
import { useAuth } from './context/AuthContext.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import TrackTest from './pages/TrackTest.jsx'
import MajorDetail from './pages/MajorDetail.jsx'

// Split off, both for the same reason: a visitor reading the landing page
// should not download the signed-in half of the product to do it.
//
//   MajorMap   Leaflet and its stylesheet, about 160 kB.
//   Majors     the library searches universities, which needs the department
//              data — 40 kB of it — and this page is imported by no one else.
//
// Both import ./data/mapData.js, so that lands in a chunk of its own and is
// fetched once however the reader arrives.
//   MajorGuide a branch write-up and its course content — long, and read by
//              whoever opened that one branch, not by the library above it.
//   Simulation a whole interactive case — twenty-five screens and the drawings
//              that go with them. Opened by the reader who finished a major's
//              write-up and wanted to try the work, which is not most of them.
//   Reach      the people you can book time with, and the photographs of them.
const Majors = lazy(() => import('./pages/Majors.jsx'))
const MajorMap = lazy(() => import('./pages/MajorMap.jsx'))
const Reach = lazy(() => import('./pages/Reach.jsx'))
const MajorGuide = lazy(() => import('./pages/MajorGuide.jsx'))
const Simulation = lazy(() => import('./pages/Simulation.jsx'))
import NotFound from './pages/NotFound.jsx'

/**
 * Two places, one router.
 *
 *   /      the landing page — everything public, on a single scroll, with the
 *          nav items as anchors into it (#top, #about, #contact).
 *   /app   the product — the majors library and its pages, behind the login.
 */

/**
 * Where each page of the app was left.
 *
 * Keyed by path rather than by history entry, which is the whole point: a
 * reader who opens a major from half way down the library and comes back
 * should land where they were, and they may come back by the browser's back
 * button, by the "← The library" link, or by the Library pill in the nav.
 * Those are three different history entries and one intention.
 *
 * Scoped to /app. The landing page is a single scroll whose nav items are
 * anchors into it, so every link that arrives at "/" without a hash means the
 * top of it and nothing else.
 */
const LEFT_AT = new Map()

const remembersScroll = (pathname) => pathname === '/app' || pathname.startsWith('/app/')

/**
 * Honours the #hash on the landing page, puts the reader back where they were
 * on a page of the app they have already visited, and starts everything else
 * at the top.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  /* Where this page was when the reader left it, read on the way out.

     A layout effect, and that is the whole trick. The same cleanup as a plain
     effect records the wrong number: by the time passive effects run, React
     has swapped in the next page, and if that page is shorter the browser has
     already clamped the scroll to fit it. Leaving a 9616px major at 2500 for
     the 1876px library recorded 1156 — the library's own maximum — so coming
     back to the major landed there instead of where it was left.

     Layout cleanups run during the mutation phase, in tree order, and this
     component sits above the routes, so this runs before the page underneath
     it is replaced and window.scrollY is still the outgoing page's.

     Scroll events would work too, and only in a browser that is painting: they
     are dispatched during the rendering step, so a backgrounded tab records
     nothing. This needs no frames. */
  useLayoutEffect(() => {
    if (!remembersScroll(pathname)) return undefined
    return () => LEFT_AT.set(pathname, window.scrollY)
  }, [pathname])

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return undefined
      }
    }

    /* 'instant', not 'auto'. This page sets scroll-behavior: smooth on html
       for its anchor links, and 'auto' means "whatever the CSS says" rather
       than "immediately" — so every route change was quietly asking for an
       animated scroll, and arriving at a page by watching it slide there is
       not arriving at it. A restore has to be instant or it looks broken. */
    const target = remembersScroll(pathname) ? (LEFT_AT.get(pathname) ?? 0) : 0
    if (target === 0) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }

    /* The page has to be tall enough to hold the position before it can be
       restored, and on the frame the route changes it is not: the outgoing
       page is still what the document measures, so scrollTo clamps to the
       bottom of that instead — the library is 1876 tall and a major is 9616,
       and restoring 2500 into the first one lands at 1156 and stays there.
       Navigation is a transition here, so there is no one frame to wait for
       either.

       So it keeps asking until the answer sticks, and stops the moment it does
       — or when the reader scrolls, because at that point they have said where
       they want to be and it is not here, or after a second, because by then
       the page is as tall as it is going to get and something else is wrong. */
    let timer = 0
    const settle = () => {
      window.clearInterval(timer)
      window.removeEventListener('wheel', settle)
      window.removeEventListener('touchstart', settle)
      window.removeEventListener('keydown', settle)
    }
    const attempt = () => {
      window.scrollTo({ top: target, behavior: 'instant' })
      if (Math.abs(window.scrollY - target) < 2) settle()
    }

    attempt()
    timer = window.setInterval(attempt, 50)
    window.setTimeout(settle, 1000)
    window.addEventListener('wheel', settle, { passive: true })
    window.addEventListener('touchstart', settle, { passive: true })
    window.addEventListener('keydown', settle)

    return settle
  }, [pathname, hash, key])

  return null
}

/** Logging out is reachable as a URL, so it needs to be a real destination. */
function Logout() {
  const { logout } = useAuth()
  useEffect(() => {
    logout()
  }, [logout])
  return <Navigate to="/" replace />
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

export default function App() {
  const { pathname } = useLocation()

  // The auth screens are full-bleed split layouts — they bring their own
  // chrome. The track test joins them: it sits between registering and the
  // library, and a nav bar across it would be three more ways to leave a
  // screen that already offers one.
  const bareLayout = ['/login', '/signup', '/quiz'].includes(pathname)
  // The app is its own place: its header, and no marketing footer under it.
  const inApp = pathname === '/app' || pathname.startsWith('/app/')
  const landingChrome = !bareLayout && !inApp

  return (
    <>
      <ScrollManager />
      {landingChrome && <Navbar />}
      {inApp && <AppNav />}

      <main id="main" className={inApp ? 'main--app' : undefined}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          {/* Where /signup sends a new account. Guarded like the app itself,
              since it writes the result onto the signed-in user, and reachable
              again afterwards for anyone who wants to retake it. */}
          <Route
            path="/quiz"
            element={
              <RequireAuth>
                <TrackTest />
              </RequireAuth>
            }
          />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Opening the library" />}>
                  <Majors />
                </Suspense>
              </RequireAuth>
            }
          />
          {/* Both before /app/:slug, which would otherwise match "map" and
              "reach" as slugs and send the reader to majors that do not
              exist. */}
          <Route
            path="/app/map"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Loading the map" />}>
                  <MajorMap />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/app/reach"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Finding people" />}>
                  <Reach />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/app/:slug"
            element={
              <RequireAuth>
                <MajorDetail />
              </RequireAuth>
            }
          />
          {/* The last level of a major's curriculum. A static segment, so the
              router ranks it above /app/:slug/:branch and "simulation" is
              never mistaken for the name of a branch. */}
          <Route
            path="/app/:slug/simulation"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Preparing the simulation" />}>
                  <Simulation />
                </Suspense>
              </RequireAuth>
            }
          />
          {/* A major with more than one names which. The bare route above still
              opens that major's first, so every link written before a second
              one existed keeps working. */}
          <Route
            path="/app/:slug/simulation/:sim"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Preparing the simulation" />}>
                  <Simulation />
                </Suspense>
              </RequireAuth>
            }
          />
          {/* A branch inside a major — English Literature inside the English
              department. Ranked more specific than /app/:slug, so the order
              here is for reading rather than for routing. */}
          <Route
            path="/app/:slug/:branch"
            element={
              <RequireAuth>
                <Suspense fallback={<BrandLoader label="Opening the guide" />}>
                  <MajorGuide />
                </Suspense>
              </RequireAuth>
            }
          />

          {/* the shape this site used to have */}
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
          <Route path="/majors/*" element={<Navigate to="/app" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {landingChrome && <Footer />}
    </>
  )
}
