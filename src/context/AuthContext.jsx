import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Front-end-only auth stand-in.
 *
 * Nothing here is secure and nothing leaves the browser — it exists so the
 * signed-in half of the product (the majors library) can be designed and
 * clicked through before a real backend exists. Swap the three functions
 * below for API calls when the backend lands.
 */

const STORAGE_KEY = 'majora.user'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async ({ email }) => {
    const nextUser = {
      email,
      name: email.split('@')[0].replace(/[._-]+/g, ' '),
      joinedAt: new Date().toISOString(),
    }
    setUser(nextUser)
    return nextUser
  }, [])

  const signup = useCallback(async ({ name, email, grade }) => {
    const nextUser = { name, email, grade, joinedAt: new Date().toISOString() }
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, signup, logout }),
    [user, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
