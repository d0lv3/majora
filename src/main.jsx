import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

/**
 * Takes down the splash in index.html once there is an app behind it.
 *
 * The wait is a floor, not a delay: the mark takes about 880ms to draw itself,
 * and on a warm cache React is mounted long before that, so dismissing the
 * moment we can would show a logo caught halfway through being drawn. What is
 * deliberately *not* here is a ceiling — if the app is slower than the floor,
 * the splash simply stays until it is ready, which is what a loading screen is
 * for.
 *
 * performance.now() is already measured from the navigation, so it is the
 * elapsed time without anything having to record a start.
 */
function removeSplash() {
  const splash = document.getElementById('splash')
  if (!splash) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const floor = reduced ? 0 : 880
  const wait = Math.max(0, floor - performance.now())

  window.setTimeout(() => {
    splash.classList.add('is-done')
    // The class fades it; this clears it out of the accessibility tree and
    // stops it sitting over the page if the transition never fires — a tab in
    // the background does not always run one.
    window.setTimeout(() => splash.remove(), reduced ? 0 : 520)
  }, wait)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

removeSplash()
