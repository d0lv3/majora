import mongoose from 'mongoose'

import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { Major } from '../models/Major.js'
// The front-end data file is the source of truth, imported rather than copied.
// A second hand-maintained list would drift from what the React app renders,
// and the drift would only show up as a page that disagrees with itself.
import { MAJORS } from '../../../src/data/majors.js'

/**
 * Seeds the library into MongoDB.
 *
 * Safe to re-run: an upsert keyed on slug, so a second run creates no
 * duplicates and an edit to majors.js is pushed through. It is not a strict
 * no-op — `timestamps` bumps updatedAt on every write, so a repeat run reports
 * 46 "updated" while the content stays identical. Nothing is dropped, so a
 * major added directly in the database survives a reseed.
 */

async function seed() {
  await connectDatabase()

  const operations = MAJORS.map((major) => ({
    updateOne: {
      filter: { slug: major.slug },
      update: {
        $set: {
          slug: major.slug,
          name: major.name,
          field: major.field,
          years: major.years,
          tagline: major.tagline,
          studies: major.studies ?? [],
          skills: major.skills ?? [],
          careers: major.careers ?? [],
          fitIf: major.fitIf,
          // The file omits the flag entirely for majors that are not written up
          // yet; the model defaults to false, and this keeps that explicit.
          available: major.available === true,
        },
      },
      upsert: true,
    },
  }))

  const result = await Major.bulkWrite(operations, { ordered: false })

  const total = await Major.countDocuments()
  const available = await Major.countDocuments({ available: true })

  console.log(
    `[seed] ${result.upsertedCount} added, ${result.modifiedCount} updated, ` +
      `${MAJORS.length - result.upsertedCount - result.modifiedCount} unchanged`,
  )
  console.log(`[seed] ${total} majors in the library, ${available} available`)
}

seed()
  .then(async () => {
    await disconnectDatabase()
    process.exit(0)
  })
  .catch(async (err) => {
    console.error('[seed] failed:', err.message)
    if (mongoose.connection.readyState === 1) await disconnectDatabase()
    process.exit(1)
  })
