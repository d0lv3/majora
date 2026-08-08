import { ApiError } from '../utils/ApiError.js'

/**
 * Validates req.body against a zod schema before the handler runs.
 *
 * Errors come back keyed by field name — { email: 'Enter a valid email address.' }
 * — because that is the shape the React forms already use for their inline
 * messages, so wiring them up later means reading `errors.email`, not parsing
 * a sentence.
 */
export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {})

  if (!result.success) {
    const fields = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0]
      // Keep the first problem per field; a form shows one message at a time.
      if (key && !fields[key]) fields[key] = issue.message
    }
    return next(ApiError.badRequest('Some fields need fixing.', fields))
  }

  // Hand the handler the parsed value: trimmed, coerced, and stripped of
  // anything the schema did not ask for.
  req.body = result.data
  return next()
}
