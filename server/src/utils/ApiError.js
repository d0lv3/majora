/**
 * An error with a status code the client is meant to see.
 *
 * Anything thrown that is *not* an ApiError is treated as a bug by the error
 * handler and reported as a generic 500 — so an accidental database or driver
 * message can never leak out through a route.
 */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (details) this.details = details
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details)
  }

  static unauthorized(message = 'You need to be signed in.') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'You do not have access to that.') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Not found.') {
    return new ApiError(404, message)
  }

  static conflict(message, details) {
    return new ApiError(409, message, details)
  }
}
