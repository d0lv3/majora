import { useState } from 'react'

/**
 * The study cast of screen 7, turned and zoomed.
 *
 * Pseudo-3D, which is what the specification asks for: the arch is drawn flat
 * and the rotation is a horizontal squeeze plus a vertical shift, which is what
 * a real arch does on screen as it turns away from you. A real 3D model would
 * mean a WebGL context and a mesh for one screen of one simulation.
 *
 * WHAT MAKES IT READ AS PLASTER
 *
 * Seen from above, a tooth is not a rectangle — it is an outline with cusps on
 * it, and which cusps decide what tooth you are looking at. `occlusal` draws
 * each kind from above with its own fissure pattern, which is the difference
 * between a cast and a row of blocks.
 *
 * The light is fixed and the model turns under it, so the shading has to follow
 * the rotation rather than the tooth: the far side of the arch loses its
 * highlight as it goes away from you, and the shadow on the bench shears the
 * other way. That is most of what sells the turn.
 *
 * The controls are a slider and buttons rather than a drag handler. A drag is
 * the obvious gesture and it is also the one that cannot be done from a
 * keyboard, fights the page scroll on a phone, and gives no indication that it
 * is available.
 */

const KINDS = ['molar', 'molar', 'premolar', 'canine', 'incisor', 'incisor', 'canine', 'premolar', 'molar', 'molar']

/** A tooth seen from above: outline plus the fissures that name it. */
function occlusal(kind, w, h) {
  const x = w / 2
  const y = h / 2
  switch (kind) {
    case 'canine':
      // A single cusp, so the outline comes to a point toward the lip.
      return { d: `M0 ${-y} q${x} ${h * 0.28} ${x * 0.72} ${y} q${-x * 0.72} ${h * 0.3} ${-x * 1.44} 0 q${-x * 0.28} ${-h * 0.72} ${x * 0.72} ${-h}z`, fissures: [`M0 ${-y * 0.5}v${h * 0.55}`] }
    case 'premolar':
      // Two cusps, buccal and lingual, with the fissure running between them.
      return { d: `M${-x} ${-y * 0.55}q${x * 0.3} ${-h * 0.5} ${x} ${-h * 0.1}q${x * 0.7} ${-h * 0.4} ${x} ${h * 0.65}q${x * 0.15} ${h * 0.7} ${-x} ${h * 0.9}q${-x} ${h * 0.3} ${-x * 2} 0q${-x * 0.3} ${-h * 0.45} 0 ${-h * 0.9}z`, fissures: [`M${-x * 0.55} 0h${w * 0.55}`] }
    case 'molar':
      // Four cusps, and the cross-shaped fissure between them.
      return { d: `M${-x} ${-y * 0.7}q${x * 0.2} ${-h * 0.42} ${x} ${-h * 0.16}q${x * 0.8} ${-h * 0.3} ${x} ${h * 0.5}q${x * 0.2} ${h * 0.8} ${-x * 0.2} ${h * 1.1}q${-x * 0.9} ${h * 0.32} ${-x * 1.8} 0q${-x * 0.4} ${-h * 0.5} 0 ${-h * 1.44}z`, fissures: [`M${-x * 0.6} 0h${w * 0.6}`, `M0 ${-y * 0.6}v${h * 0.6}`] }
    default:
      // An incisor from above is an edge: wide across, almost nothing deep.
      return { d: `M${-x} ${-y * 0.5}q${x} ${-h * 0.5} ${w} 0q${x * 0.1} ${h * 0.8} ${-x * 0.15} ${h}q${-x * 0.85} ${h * 0.2} ${-x * 1.7} 0q${-x * 0.25} ${-h * 0.4} ${-x * 0.15} ${-h}z`, fissures: [] }
  }
}

export default function StudyModel() {
  const [angle, setAngle] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [arch, setArch] = useState('upper')

  const rad = (angle * Math.PI) / 180
  // Turning away from the viewer narrows the arch and lifts its far side.
  const squeeze = Math.cos(rad)
  const lift = Math.sin(rad) * 14
  const upper = arch === 'upper'

  const teeth = KINDS.map((kind, i) => {
    const t = 180 + (180 * i) / (KINDS.length - 1)
    const a = (t * Math.PI) / 180
    const depth = Math.cos(a) * Math.sin(rad)
    return {
      i,
      kind,
      x: 150 + 96 * Math.cos(a) * squeeze,
      y: (upper ? 96 : 104) + (upper ? 54 : 50) * Math.sin(a) + Math.cos(a) * lift,
      angle: t + 90,
      w: (kind === 'incisor' ? 15 : kind === 'canine' ? 13 : kind === 'premolar' ? 14 : 17) * (0.5 + 0.5 * Math.abs(squeeze)),
      h: kind === 'incisor' ? 9 : kind === 'canine' ? 12 : kind === 'premolar' ? 13 : 15,
      /* Away from the light on the far side of the turn, toward it on the
         near side. This is the whole of the 3D. */
      shade: Math.max(0, Math.min(0.42, 0.2 - depth * 0.35)),
    }
  })

  return (
    <div className="model">
      <div className="model__stage">
        <svg
          className="model__svg"
          viewBox="0 0 300 210"
          role="img"
          aria-label={`Study model, ${arch} arch, rotated ${angle} degrees`}
        >
          <defs>
            <linearGradient id="plaster" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#fbf8f2" />
              <stop offset="60%" stopColor="#eae2d4" />
              <stop offset="100%" stopColor="#c8bda9" />
            </linearGradient>
            <linearGradient id="plasterBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ded4c2" />
              <stop offset="100%" stopColor="#a99c85" />
            </linearGradient>
            <radialGradient id="benchShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(65,43,99,0.28)" />
              <stop offset="100%" stopColor="rgba(65,43,99,0)" />
            </radialGradient>
          </defs>

          {/* The cast is sitting on something, and the shadow shears with the
              turn rather than staying a symmetric blob under it. */}
          <ellipse
            cx={150 + lift * 0.9}
            cy="178"
            rx={104 * Math.abs(squeeze) + 26}
            ry="18"
            fill="url(#benchShadow)"
          />

          <g transform={`translate(150 104) scale(${zoom}) translate(-150 -104)`}>
            {/* The trimmed base: a cast is poured into a former, so it has a
                flat heel at the back rather than a round edge all the way. */}
            <path
              className="model__base"
              d={`M${150 - (100 * Math.abs(squeeze) + 20)} 118
                  q0 -46 ${100 * Math.abs(squeeze) + 20} -46
                  q${100 * Math.abs(squeeze) + 20} 0 ${100 * Math.abs(squeeze) + 20} 46
                  v20 h${-(100 * Math.abs(squeeze) + 20) * 2} z`}
              fill="url(#plasterBase)"
            />

            {teeth.map((t) => {
              const o = occlusal(t.kind, t.w, t.h)
              return (
                <g key={t.i} transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`}>
                  <path className="model__tooth" d={o.d} fill="url(#plaster)" />
                  {/* The turn, painted on: a wash that deepens as the tooth
                      goes away from the light. */}
                  <path d={o.d} fill="#3a2a1a" opacity={t.shade} />
                  {o.fissures.map((f) => (
                    <path key={f} className="model__fissure" d={f} />
                  ))}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className="model__controls">
        <div className="model__group" role="group" aria-label="Arch">
          <button
            type="button"
            className={`simChip${upper ? ' is-on' : ''}`}
            aria-pressed={upper}
            onClick={() => setArch('upper')}
          >
            Upper
          </button>
          <button
            type="button"
            className={`simChip${!upper ? ' is-on' : ''}`}
            aria-pressed={!upper}
            onClick={() => setArch('lower')}
          >
            Lower
          </button>
        </div>

        <label className="model__slider">
          <span>Rotate</span>
          <input
            type="range"
            min="-70"
            max="70"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>

        <label className="model__slider">
          <span>Zoom</span>
          <input
            type="range"
            min="0.8"
            max="1.8"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}
