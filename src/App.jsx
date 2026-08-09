import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'

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
const Majors = lazy(() => import('./pages/Majors.jsx'))
const MajorMap = lazy(() => import('./pages/MajorMap.jsx'))
const MajorGuide = lazy(() => import('./pages/MajorGuide.jsx'))
import NotFound from './pages/NotFound.jsx'

/**
 * Two places, one router.
 *
 *   /      the landing page — everything public, on a single scroll, with the
 *          nav items as anchors into it (#top, #about, #contact).
 *   /app   the product — the majors library and its pages, behind the login.
 */

/** Honours the #hash on the landing page, and starts every other route at the top. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
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
                <Suspense fallback={<div className="routeWait">Opening the library…</div>}>
                  <Majors />
                </Suspense>
              </RequireAuth>
            }
          />
          {/* Before /app/:slug, which would otherwise match "map" as a slug
              and send the reader to a major that does not exist. */}
          <Route
            path="/app/map"
            element={
              <RequireAuth>
                <Suspense fallback={<div className="routeWait">Loading the map…</div>}>
                  <MajorMap />
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
          {/* A branch inside a major — English Literature inside the English
              department. Ranked more specific than /app/:slug, so the order
              here is for reading rather than for routing. */}
          <Route
            path="/app/:slug/:branch"
            element={
              <RequireAuth>
                <Suspense fallback={<div className="routeWait">Opening the guide…</div>}>
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
