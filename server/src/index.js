import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'

/**
 * Boot order matters: connect first, listen second.
 *
 * A server that accepts requests before the database is reachable answers them
 * with 500s that look like application bugs. Failing to connect should instead
 * be a clear message and a non-zero exit.
 */

async function main() {
  try {
    await connectDatabase()
  } catch (err) {
    console.error('[boot] could not reach MongoDB:', err.message)
    console.error(`[boot] tried ${env.mongoUri} — is mongod running?`)
    process.exit(1)
  }

  const server = createApp().listen(env.port, () => {
    console.log(`[boot] Majora API listening on http://localhost:${env.port}`)
    console.log(`[boot] allowing origins: ${env.corsOrigins.join(', ')}`)
  })

  // Close the HTTP server before the database so in-flight requests finish
  // against a live connection instead of erroring on the way out.
  const shutdown = async (signal) => {
    console.log(`\n[boot] ${signal} received, shutting down`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main()
