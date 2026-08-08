import 'dotenv/config'

/**
 * Environment, read once and checked at boot.
 *
 * The rule here is that a misconfiguration should stop the process rather than
 * surface later as a confusing 500. The one concession is JWT_SECRET in
 * development: refusing to boot without it would mean nobody can clone the repo
 * and run it, so dev gets a throwaway and a warning loud enough to notice.
 */

const isProduction = process.env.NODE_ENV === 'production'

const DEV_SECRET = 'majora-development-secret-not-for-production'

function readSecret() {
  const secret = process.env.JWT_SECRET?.trim()
  if (secret) return secret

  if (isProduction) {
    throw new Error(
      'JWT_SECRET is required in production. Generate one with:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"',
    )
  }

  console.warn(
    '[env] JWT_SECRET is not set — using an insecure development default.\n' +
      '      Sessions will not survive a change of secret, and this must never reach production.',
  )
  return DEV_SECRET
}

export const env = {
  isProduction,
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/majora',
  jwtSecret: readSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  // Split on commas so a deployment can allow its preview URL alongside prod.
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}
