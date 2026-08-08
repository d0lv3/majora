import { Router } from 'express'

import { Major, FIELDS } from '../models/Major.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * The ten fields, each with a count — what the landing page's field list needs.
 *
 * Its own router rather than a route on /majors, because /majors/fields would
 * have to be declared ahead of /majors/:slug to avoid being read as a slug, and
 * a rule that depends on declaration order is one somebody eventually breaks.
 */

const router = Router()

/** GET /api/fields */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const counts = await Major.aggregate([{ $group: { _id: '$field', count: { $sum: 1 } } }])
    const byField = new Map(counts.map((row) => [row._id, row.count]))

    // Driven by FIELDS, not by the aggregation, so a field with nothing in it
    // still appears with a count of 0 instead of vanishing from the list.
    res.json({
      fields: FIELDS.map((field) => ({ ...field, count: byField.get(field.id) ?? 0 })),
    })
  }),
)

export default router
