import mongoose from 'mongoose'

import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

/** Anything that fell through the router is a 404, in the same JSON shape. */
export function notFound(req, _res, next) {
  next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}`))
}

/**
 * The single place a response gets written for a failure.
 *
 * Mongoose validation and duplicate-key errors are translated here rather than
 * in each route, so a model constraint automatically produces a sensible 400 or
 * 409 wherever it is hit. Everything unrecognised is a bug: logged in full,
 * reported as a bare 500, with the stack withheld outside development.
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
export function errorHandler(err, _req, res, _next) {
  let status = 500
  let message = 'Something went wrong on our end.'
  let details

  if (err instanceof ApiError) {
    status = err.status
    message = err.message
    details = err.details
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400
    message = 'Some fields need fixing.'
    details = Object.fromEntries(
      Object.entries(err.errors).map(([field, issue]) => [field, issue.message]),
    )
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400
    message = `${err.value} is not a valid ${err.path}.`
  } else if (err?.code === 11000) {
    status = 409
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'value'
    message = `That ${field} is already registered.`
    details = { [field]: `That ${field} is already registered.` }
  }

  if (status >= 500) {
    console.error('[error]', err)
  }

  res.status(status).json({
    error: message,
    ...(details ? { details } : {}),
    ...(env.isProduction || status >= 500 ? {} : { stack: err.stack }),
  })
}
