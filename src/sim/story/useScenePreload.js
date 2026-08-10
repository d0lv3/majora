import { useEffect, useMemo, useState } from 'react'

import { scenePhoto } from './scenePhotos.js'

/**
 * Load every photograph in a story before the story starts.
 *
 * These are large stills and each one now fills most of the screen, so
 * fetching them scene by scene means the reader watches a grey box resolve on
 * every single turn of the story. A play does not raise the curtain until the
 * set is up.
 *
 * The count is what the loading bar reads, so it has to move honestly — a
 * decode that fails still counts, because a bar that stops at eight of nine
 * and waits forever is worse than one that finishes and shows a scene without
 * a picture. The whole thing is warm from the browser cache on a second visit
 * and the loader is gone in one frame.
 */
export function useScenePreload(sim) {
  const urls = useMemo(() => {
    const names = new Set()
    for (const scene of sim.scenes) {
      if (scene.image) names.add(scene.image)
      if (scene.backdrop) names.add(scene.backdrop)
    }
    return [...names].map(scenePhoto).filter(Boolean)
  }, [sim])

  const [loaded, setLoaded] = useState(0)
  /* A floor on how briefly the loader can appear. Without it a cached run
     flashes the thing for two frames, which reads as a glitch rather than as
     the curtain going up. */
  const [floorPassed, setFloorPassed] = useState(false)

  useEffect(() => {
    setLoaded(0)
    setFloorPassed(false)

    const floor = setTimeout(() => setFloorPassed(true), 600)

    let alive = true
    let done = 0
    const bump = () => {
      done += 1
      if (alive) setLoaded(done)
    }

    const images = urls.map((url) => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = url
      return img
    })

    return () => {
      alive = false
      clearTimeout(floor)
      for (const img of images) {
        img.onload = null
        img.onerror = null
      }
    }
  }, [urls])

  const total = urls.length
  return {
    total,
    loaded: Math.min(loaded, total),
    progress: total === 0 ? 1 : Math.min(loaded, total) / total,
    ready: floorPassed && loaded >= total,
  }
}
