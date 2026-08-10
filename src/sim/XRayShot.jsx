import { useEffect, useState } from 'react'

/**
 * Screen 8: the patient is positioned, the tube fires, the film comes up.
 *
 * Three stages driven by timers rather than by CSS alone, because the screen's
 * copy and its CTA change with them — the lesson about what imaging is for
 * belongs after the film exists, not beside an empty cassette.
 *
 * Under reduced motion the film is simply there. The stage sequence is the
 * whole animation, so skipping to the end is the honest reduction rather than
 * playing it faster.
 */
const STAGES = ['position', 'pulse', 'film']

export default function XRayShot({ onReady }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [stage, setStage] = useState(reduced ? 'film' : 'position')

  useEffect(() => {
    if (reduced) {
      onReady?.()
      return undefined
    }
    const timers = [
      window.setTimeout(() => setStage('pulse'), 1100),
      window.setTimeout(() => {
        setStage('film')
        onReady?.()
      }, 2000),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reduced, onReady])

  return (
    <div className={`xray is-${stage}`} data-stage={stage}>
      <div className="xray__room">
        <svg className="xray__svg" viewBox="0 0 320 200" role="img" aria-label="Cephalometric radiograph being taken">
          {/* the head, in position between tube and cassette */}
          <g className="xray__head">
            <circle cx="160" cy="98" r="42" />
            <path d="M196 84q12 10 10 24-8 6-16 4" fill="none" />
            <rect x="150" y="132" width="26" height="30" rx="8" />
          </g>
          {/* the cassette */}
          <rect className="xray__plate" x="228" y="44" width="14" height="110" rx="3" />
          {/* the tube head */}
          <g className="xray__tube">
            <rect x="60" y="76" width="30" height="44" rx="6" />
            <path d="M90 98h14" />
          </g>
          {/* the beam */}
          <g className="xray__beam" aria-hidden="true">
            <path d="M104 98 228 52v92z" />
          </g>
        </svg>

        <p className="xray__stageLabel" role="status">
          {stage === 'position' && 'Positioning the patient…'}
          {stage === 'pulse' && 'Exposure.'}
          {stage === 'film' && 'Lateral cephalometric radiograph'}
        </p>
      </div>
    </div>
  )
}
