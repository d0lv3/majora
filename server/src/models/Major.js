import mongoose from 'mongoose'

/**
 * One major in the library.
 *
 * The shape is taken from src/data/majors.js rather than invented here — that
 * file is what the React app already renders, and the seed script loads it
 * directly, so the two cannot drift. The four content arrays are the four
 * questions every major page answers: what you study, what you get good at,
 * where it leads, and whether it fits you.
 */

const FIELD_IDS = [
  'health',
  'engineering',
  'computing',
  'sciences',
  'business',
  'society',
  'humanities',
  'education',
  'arts',
  'agriculture',
]

const majorSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, required: true, trim: true },
    field: {
      type: String,
      required: true,
      enum: { values: FIELD_IDS, message: '{VALUE} is not a known field.' },
      index: true,
    },
    years: { type: Number, required: true, min: 1, max: 10 },
    tagline: { type: String, required: true, trim: true },

    studies: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    careers: { type: [String], default: [] },
    fitIf: { type: String, trim: true },

    /**
     * Only a handful are written up so far. The rest are listed but not
     * openable, so the shelf shows its full shape while it is being filled —
     * hence a default of false rather than a required flag.
     */
    available: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // Mongo's bookkeeping is not part of the contract the front-end reads.
        delete ret._id
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        return ret
      },
    },
  },
)

export const FIELDS = [
  { id: 'health', label: 'Health & Medicine' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'computing', label: 'Computing' },
  { id: 'sciences', label: 'Natural Sciences' },
  { id: 'business', label: 'Business & Economics' },
  { id: 'society', label: 'Law & Society' },
  { id: 'humanities', label: 'Languages & Humanities' },
  { id: 'education', label: 'Education' },
  { id: 'arts', label: 'Design & Arts' },
  { id: 'agriculture', label: 'Agriculture & Environment' },
]

export const Major = mongoose.model('Major', majorSchema)
