import MajoraMark from '../../components/decor/MajoraMark.jsx'

/**
 * The curtain, held up while the scenes load.
 *
 * Deliberately the site's own loading screen rather than a spinner: the reader
 * has just left a page of Majora and is about to be somewhere that looks like
 * nothing else on the site, and the mark is what carries them across.
 *
 * The bar is determinate because the wait is genuinely measurable — nine
 * photographs, counted as they arrive. A fake bar that crawls to 90% and sits
 * there is the thing this is meant to avoid.
 */
export default function StoryLoader({ progress, loaded, total }) {
  const pct = Math.round(progress * 100)

  return (
    <div className="storyLoad" role="status" aria-live="polite">
      <div className="storyLoad__inner">
        <MajoraMark className="storyLoad__mark" />
        <p className="storyLoad__word">Majora</p>

        <p className="storyLoad__label">Loading simulation</p>

        <div
          className="storyLoad__bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading simulation"
        >
          <span className="storyLoad__fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        {/* Said in scenes rather than in percent or megabytes: it is what the
            reader is waiting for, and it makes the wait finite. */}
        <p className="storyLoad__count">
          {loaded} of {total} scenes
        </p>
      </div>
    </div>
  )
}
