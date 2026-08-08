import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errors.js'
import { ApiError } from './utils/ApiError.js'

/**
 * The Express app, built separately from the listening server so it can be
 * imported and exercised without binding a port.
 */

export function createApp() {
  const app = express()

  // Behind a proxy (most hosts), this is what makes `secure` cookies work and
  // req.ip report the real client rather than the load balancer.
  if (env.isProduction) app.set('trust proxy', 1)

  app.use(
    cors({
      // A allow-list, not a reflector: `credentials` plus an echoed origin
      // would let any site make authenticated requests on a reader's behalf.
      origin(origin, callback) {
        // No Origin header means curl, a health check, or a same-origin request.
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true)
        // An ApiError rather than a bare Error: a rejected origin is a refusal,
        // not a server fault, and a plain Error would surface as a 500 and be
        // logged as a bug on every probe.
        return callback(ApiError.forbidden(`Origin ${origin} is not allowed.`))
      },
      credentials: true,
    }),
  )

  // 100kb is generous for the largest thing anyone posts here (a contact
  // message) and small enough that a junk payload is rejected early.
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  app.use('/api', routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
