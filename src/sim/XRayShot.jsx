import { useEffect, useState } from 'react'

/**
 * Screen 8: the patient is positioned, the tube fires, the film comes up.
 *
 * Three stages driven by timers rather than by CSS alone, because the screen's
 * copy and its CTA change with them — the lesson about what imaging is for
 * belongs after the film exists, not beside an empty cassette.
 *
 * WHY THE MACHINE IS DRAWN THE WAY IT IS
 *
 * A lateral ceph is not a photograph taken from wherever the operator stood. It
 * is a reproducible measurement, and what makes it reproducible is the
 * cephalostat: two ear rods through the external auditory meati and a rest at
 * the bridge of the nose, holding the skull in the same position every time, at
 * a fixed distance from a fixed tube. Drawing the rods and the nasion rest is
 * the difference between a machine and a lamp pointed at a head — and it is
 * also the answer to the question the screen is really asking, which is why
 * this image can be compared with one taken eighteen months later.
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
        <svg
          className="xray__svg"
          viewBox="0 0 420 240"
          role="img"
          aria-label="Lateral cephalometric radiograph being taken in a cephalostat"
        >
          <defs>
            <linearGradient id="xrayBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(238,175,22,0.55)" />
              <stop offset="100%" stopColor="rgba(238,175,22,0.05)" />
            </linearGradient>
            <linearGradient id="xrayFilm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2c2740" />
              <stop offset="100%" stopColor="#14111f" />
            </linearGradient>
          </defs>

          {/* the head in profile, facing the cassette */}
          <g className="xray__head">
            <path d="M196 44q34 0 52 26 14 22 12 46-1 14 6 20 5 5-2 8l-10 4q-1 12-9 15-9 3-18-1 1 12-6 18-10 8-26 6l-1 22h-64V96q0-24 18-38 18-14 48-14z" />
            {/* neck and shoulder, so the head is attached to something */}
            <path className="xray__neck" d="M150 208v-26h64v26" />
          </g>

          {/* The cephalostat: the ear rod through the meatus and the rest at
              the bridge of the nose are what make the image repeatable. */}
          <g className="xray__stat">
            <path className="xray__post" d="M176 22v196" />
            <circle className="xray__rod" cx="176" cy="112" r="7" />
            <path className="xray__rodArm" d="M158 112h36" />
            <path className="xray__nasion" d="M254 100h16" />
            <circle className="xray__nasionTip" cx="252" cy="100" r="3.5" />
          </g>

          {/* the tube head and its collimator */}
          <g className="xray__tube">
            <rect x="26" y="86" width="42" height="56" rx="8" />
            <path className="xray__collimator" d="M68 98h16l6 14-6 14H68z" />
            <path className="xray__tubeStem" d="M47 142v46" />
          </g>

          {/* the beam, from the collimator to the cassette */}
          <g className="xray__beam" aria-hidden="true">
            <path d="M90 112 322 44v136z" fill="url(#xrayBeam)" />
          </g>

          {/* the cassette, and the film that comes up inside it */}
          <g className="xray__cassette">
            <rect className="xray__plate" x="322" y="40" width="20" height="144" rx="4" />
            <rect className="xray__film" x="326" y="46" width="12" height="132" rx="2" fill="url(#xrayFilm)" />
            <path className="xray__stand" d="M332 184v34" />
          </g>

          {/* the bench everything is standing on */}
          <path className="xray__floor" d="M14 218h392" />
        </svg>

        <p className="xray__stageLabel" role="status">
          {stage === 'position' && 'Positioning the patient in the cephalostat…'}
          {stage === 'pulse' && 'Exposure.'}
          {stage === 'film' && 'Lateral cephalometric radiograph'}
        </p>
      </div>
    </div>
  )
}
