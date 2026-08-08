import { Router } from 'express'
import { z } from 'zod'

import { Message, CONTACT_REASONS } from '../models/Message.js'
import { validateBody } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * The contact form's destination.
 *
 * Messages are stored, not emailed. Delivery needs an SMTP account and a
 * decision about who receives them, and neither exists yet — writing them down
 * means nothing is lost in the meantime, and a mailer can be added later
 * without changing what the client sends.
 */

const router = Router()

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Tell us who you are.').max(80),
  email: z.string().trim().toLowerCase().regex(/^\S+@\S+\.\S+$/, 'Enter a valid email address.'),
  reason: z.enum(CONTACT_REASONS).default(CONTACT_REASONS[0]),
  message: z.string().trim().min(10, 'A sentence or two, at least.').max(5000),
})

/** POST /api/contact */
router.post(
  '/',
  validateBody(contactSchema),
  asyncHandler(async (req, res) => {
    const saved = await Message.create(req.body)

    // The id is enough for the client to show its thank-you state. The message
    // body is not echoed back — there is nothing useful to do with it, and it
    // keeps the reply small.
    res.status(201).json({ ok: true, id: saved.id })
  }),
)

export default router
