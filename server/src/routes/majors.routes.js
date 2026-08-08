import { Router } from 'express'

import { Major, FIELDS } from '../models/Major.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * The library, read-only.
 *
 * Public on purpose. The landing page shows the available majors and the field
 * counts before anyone signs in, and locking the catalogue behind auth would
 * mean the page that argues students should explore majors earlier refuses to
 * show them any. Writes are a separate concern and are not exposed yet.
 */

const router = Router()

/**
 * GET /api/majors
 *   ?field=computing   one field only
 *   ?available=true    only the ones written up so far
 *   ?q=medicine        matches name and tagline
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { field, available, q } = req.query
    const filter = {}

    if (field) {
      if (!FIELDS.some((f) => f.id === field)) {
        throw ApiError.badRequest(`Unknown field "${field}".`)
      }
      filter.field = field
    }

    // Only the explicit strings count, so a stray ?available= does not silently
    // filter the whole catalogue down to nothing.
    if (available === 'true') filter.available = true
    else if (available === 'false') filter.available = false

    if (typeof q === 'string' && q.trim()) {
      // Escaped so a search for "C++" is a search, not a broken regex.
      const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const pattern = new RegExp(safe, 'i')
      filter.$or = [{ name: pattern }, { tagline: pattern }]
    }

    // Sorted by name so the shelf has a stable order across requests; Mongo
    // makes no promise about insertion order.
    const majors = await Major.find(filter).sort({ name: 1 })

    res.json({ count: majors.length, majors: majors.map((m) => m.toJSON()) })
  }),
)

/** GET /api/majors/:slug */
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const major = await Major.findOne({ slug: req.params.slug.toLowerCase() })
    if (!major) throw ApiError.notFound(`No major with the slug "${req.params.slug}".`)
    res.json({ major: major.toJSON() })
  }),
)

export default router
