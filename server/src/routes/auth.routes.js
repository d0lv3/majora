import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { env } from '../config/env.js'
import { User, SIGNUP_STAGES } from '../models/User.js'
import { requireAuth, SESSION_COOKIE } from '../middleware/requireAuth.js'
import { validateBody } from '../middleware/validate.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Sessions, as an httpOnly cookie rather than a token the client stores.
 *
 * The front-end currently keeps its stand-in user in localStorage, which is
 * fine for a mock but not for a real credential: anything that manages to run
 * a script on the page can read localStorage, and cannot read an httpOnly
 * cookie. The trade-off is that the browser must send credentials explicitly
 * (`fetch(..., { credentials: 'include' })`) and the API has to name its
 * allowed origins, which is what CORS_ORIGIN is for.
 */

const router = Router()

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** Matches the inline copy the signup and login forms already show. */
const signupSchema = z.object({
  name: z.string().trim().min(2, 'Tell us what to call you.').max(80),
  email: z.string().trim().toLowerCase().regex(/^\S+@\S+\.\S+$/, 'Enter a valid email address.'),
  password: z.string().min(6, 'Use at least 6 characters.').max(200),
  grade: z.enum(SIGNUP_STAGES, { errorMap: () => ({ message: 'Pick the closest one.' }) }),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().regex(/^\S+@\S+\.\S+$/, 'Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    // Lax is enough here: the Vite app and the API share the "localhost" site
    // in development, and a deployment should put them on one domain too.
    sameSite: 'lax',
    secure: env.isProduction,
    maxAge: WEEK_MS,
    path: '/',
  })
}

/** POST /api/auth/signup */
router.post(
  '/signup',
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, grade } = req.body

    // Checked up front so the client gets a field-keyed message instead of the
    // generic duplicate-key 409 the unique index would otherwise produce. The
    // index is still what actually guarantees it under a race.
    const taken = await User.exists({ email })
    if (taken) {
      throw ApiError.conflict('That email already has an account.', {
        email: 'That email already has an account.',
      })
    }

    const user = await User.create({
      name,
      email,
      grade,
      passwordHash: await User.hashPassword(password),
    })

    issueSession(res, user)
    res.status(201).json({ user: user.toJSON() })
  }),
)

/** POST /api/auth/login */
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+passwordHash')

    // One message for "no such account" and for "wrong password", so the
    // response cannot be used to work out which emails are registered.
    const ok = user && (await user.verifyPassword(password))
    if (!ok) throw ApiError.unauthorized('That email and password do not match.')

    issueSession(res, user)
    res.json({ user: user.toJSON() })
  }),
)

/** POST /api/auth/logout — succeeds whether or not there was a session. */
router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
  res.json({ ok: true })
})

/** GET /api/auth/me — how the app rehydrates a session on load. */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toJSON() })
  }),
)

export default router
