import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const SESSION_COOKIE = 'majora.session'

/**
 * Reads the session cookie and attaches req.user.
 *
 * The user is re-read from the database on every request rather than trusted
 * from the token body. It costs a query, but it means a deleted account stops
 * working immediately instead of whenever its token happens to expire.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE]
  if (!token) throw ApiError.unauthorized()

  let payload
  try {
    payload = jwt.verify(token, env.jwtSecret)
  } catch {
    // Expired, tampered with, or signed with a secret that has since changed —
    // all the same thing from the client's side: sign in again.
    throw ApiError.unauthorized('Your session has expired. Please sign in again.')
  }

  const user = await User.findById(payload.sub)
  if (!user) throw ApiError.unauthorized('That account no longer exists.')

  req.user = user
  next()
})
