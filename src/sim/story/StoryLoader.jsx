import BrandLoader from '../../components/BrandLoader.jsx'

/**
 * The curtain, held up while the scenes load.
 *
 * The site's own loading screen and not one of its own: the reader has just
 * left a page of Majora and is about to be somewhere that looks like nothing
 * else on the site, and the mark is what carries them across. It used to draw
 * that mark its own way, which meant the site had two loading animations and
 * the wrong one played at the moment the difference was most obvious.
 *
 * What it adds is the bar, because this is the one wait on the site that is
 * genuinely measurable — nine photographs, counted as they arrive. A fake bar
 * that crawls to 90% and sits there is the thing this is meant to avoid.
 */
export default function StoryLoader({ progress, loaded, total }) {
  return (
    <BrandLoader
      label="Loading simulation"
      progress={progress}
      detail={`${loaded} of ${total} scenes`}
    />
  )
}
