import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * A reader with an account.
 *
 * `grade` mirrors the chips on the signup screen ("Where are you right now?").
 * It is worth storing rather than discarding: a middle-school reader and a
 * graduate want different things from the same library, and it tells us who is
 * actually arriving years ahead of the decision, which is the whole premise.
 */

const STAGES = ['Middle school', 'Grade 10-11', 'Grade 12', 'Graduated', 'Parent or teacher']

const SALT_ROUNDS = 12

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tell us what to call you.'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'An email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      // Deliberately permissive: the strict-looking patterns reject valid
      // addresses, and a real check means sending mail to it.
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address.'],
    },
    passwordHash: {
      type: String,
      required: true,
      // Never leaves the database by accident — every query has to ask for it
      // explicitly with .select('+passwordHash').
      select: false,
    },
    grade: {
      type: String,
      enum: { values: STAGES, message: '{VALUE} is not one of the signup stages.' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      // The user object is handed straight to the client in auth responses, so
      // the shape here is the public shape. `joinedAt` matches what the
      // front-end AuthContext already stores.
      transform(_doc, ret) {
        return {
          id: ret._id.toString(),
          name: ret.name,
          email: ret.email,
          grade: ret.grade,
          joinedAt: ret.createdAt,
        }
      },
    },
  },
)

/** Hashes a plain password. Used at signup and on any password change. */
userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

/**
 * Compares a candidate against the stored hash.
 *
 * Returns false rather than throwing when passwordHash was not selected, so a
 * forgotten `.select('+passwordHash')` fails closed instead of erroring out
 * with something that looks like a server bug.
 */
userSchema.methods.verifyPassword = function verifyPassword(plain) {
  if (!this.passwordHash) return false
  return bcrypt.compare(plain, this.passwordHash)
}

export const SIGNUP_STAGES = STAGES

export const User = mongoose.model('User', userSchema)
