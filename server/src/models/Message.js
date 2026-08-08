import mongoose from 'mongoose'

/**
 * A submission from the contact form.
 *
 * The point of that form is corrections — someone inside a field telling us a
 * major page does not match the reality of studying it. `handled` exists so
 * those can be worked through without a second system: unread, then dealt with.
 */

const REASONS = [
  'I am a student',
  'I teach or advise students',
  'I want to contribute a major',
  'Something else',
]

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address.'],
    },
    reason: { type: String, enum: REASONS, default: REASONS[0] },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },

    handled: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

export const CONTACT_REASONS = REASONS

export const Message = mongoose.model('Message', messageSchema)
