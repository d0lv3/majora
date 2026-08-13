import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * The reader's session — which every reader has, from the first page they open.
 *
 * There is no login and no registration: the library at /app and everything
 * under it is open, and this exists only to hold the little the app knows about
 * whoever is reading — the track test they took, and a name if one is ever
 * collected. Nothing here is secure and nothing leaves the browser.
 */

const STORAGE_KEY = 'majora.user'

const AuthContext = createContext(null)

/**
 * A reader who has not told us anything about themselves.
 *
 * The name and email are empty rather than invented: the two places that show
 * them already carry a fallback for a reader they cannot name — "Welcome,
 * there" in the library, "your account email" on a booking — and an honest
 * greeting beats a made-up one.
 */
function guest() {
  return {
    name: '',
    email: '',
    joinedAt: new Date().toISOString(),
    // The track test is offered rather than imposed, so a reader starts out
    // with no leaning and the test still open to them. Both are set by /quiz.
    track: null,
    trackTestDone: false,
  }
}

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    // Spread over a fresh guest so a session stored before a field existed
    // still has one, rather than reading as undefined halfway down a page.
    return raw ? { ...guest(), ...JSON.parse(raw) } : guest()
  } catch {
    return guest()
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [user])

  /**
   * Records the outcome of the track test.
   *
   * `track` is null when the reader skipped it, and `trackTestDone` is set
   * either way: a skip is an answer — "do not ask me again" — and storing it
   * as one is what stops the test from reappearing on every visit.
   */
  const completeTrackTest = useCallback((track = null) => {
    setUser((u) => ({ ...u, track, trackTestDone: true }))
  }, [])

  const value = useMemo(() => ({ user, completeTrackTest }), [user, completeTrackTest])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
