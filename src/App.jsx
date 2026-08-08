import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'

import Navbar from './components/Navbar.jsx'
import AppNav from './components/AppNav.jsx'
import Footer from './components/Footer.jsx'
import { useAuth } from './context/AuthContext.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Majors from './pages/Majors.jsx'
import MajorDetail from './pages/MajorDetail.jsx'

// Split off: Leaflet and its stylesheet are about 160 kB, and every visitor
// who never opens the map would otherwise download them to read the landing
// page. This is the only route that needs them.
const MajorMap = lazy(() => import('./pages/MajorMap.jsx'))
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

  // The auth screens are full-bleed split layouts — they bring their own chrome.
  const bareLayout = ['/login', '/signup'].includes(pathname)
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

          <Route
            path="/app"
            element={
              <RequireAuth>
                <Majors />
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
