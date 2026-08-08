/**
 * Wraps an async route so a rejected promise reaches Express's error handler.
 *
 * Express 4 does not await handlers, so without this a thrown error inside an
 * async function becomes an unhandled rejection and the request hangs until it
 * times out — the failure mode that looks like the server is ignoring you.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
