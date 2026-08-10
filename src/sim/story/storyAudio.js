/**
 * The score a story can play, looked up by file name.
 *
 * Globbed the same way the scene photographs are, and for the same reason: the
 * data names a track, the folder holds it, and swapping one for another is a
 * file drop rather than an edit in two places. A story that names a track that
 * is not there simply plays in silence.
 */

const files = import.meta.glob('../../assets/audio/*.{webm,ogg,mp3,m4a}', {
  eager: true,
  import: 'default',
})

const byName = {}
for (const [path, url] of Object.entries(files)) {
  byName[path.split('/').pop().replace(/\.[^.]+$/, '')] = url
}

export const storyScore = (name) => (name ? (byName[name] ?? null) : null)
