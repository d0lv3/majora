import { Router } from 'express'
import mongoose from 'mongoose'

import authRoutes from './auth.routes.js'
import majorsRoutes from './majors.routes.js'
import fieldsRoutes from './fields.routes.js'
import contactRoutes from './contact.routes.js'

const router = Router()

/**
 * GET /api/health
 * Reports the database too: the process being up while Mongo is unreachable is
 * exactly the state worth distinguishing, and a bare 200 would hide it.
 */
router.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const db = states[mongoose.connection.readyState] ?? 'unknown'

  res.status(db === 'connected' ? 200 : 503).json({ ok: db === 'connected', db })
})

router.use('/auth', authRoutes)
router.use('/majors', majorsRoutes)
router.use('/fields', fieldsRoutes)
router.use('/contact', contactRoutes)

export default router
