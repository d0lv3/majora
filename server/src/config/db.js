import mongoose from 'mongoose'

import { env } from './env.js'

/**
 * The Mongo connection.
 *
 * Connecting is awaited before the HTTP server starts listening, so the API is
 * never up-but-broken: a request that arrives can always reach the database.
 */

export async function connectDatabase(uri = env.mongoUri) {
  // Mongoose 7+ throws on unknown query fields instead of ignoring them, which
  // turns a typo'd filter into an error rather than a silent full-collection read.
  mongoose.set('strictQuery', true)

  await mongoose.connect(uri, {
    // Fail fast rather than buffering commands for 30s when mongod is down —
    // the error message is what tells you to start it.
    serverSelectionTimeoutMS: 5000,
  })

  const { name, host, port } = mongoose.connection
  console.log(`[db] connected to ${host}:${port}/${name}`)

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message)
  })

  return mongoose.connection
}

export async function disconnectDatabase() {
  await mongoose.connection.close()
}
