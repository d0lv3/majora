/**
 * The photographs a story scene can carry, looked up by file name.
 *
 * Globbed rather than imported one by one, for a workflow reason: the scenes
 * are written before the pictures exist, and the pictures arrive in a batch.
 * A glob means dropping `scene-03-forres-court.png` into src/assets/scenes is
 * the whole of the job — no import to add, no map to keep in step with the
 * folder, and no build failure in the window where a file is still missing.
 *
 * A scene naming a photo that is not there yet simply renders without one.
 * That is deliberate: the writing has to stand up on its own, and the story
 * stays playable while the images are still being made.
 */

const files = import.meta.glob('../../assets/scenes/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

const byName = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '')
  byName[name] = url
}

export const scenePhoto = (name) => (name ? (byName[name] ?? null) : null)
