import { useState } from 'react'

/**
 * The study cast of screen 7, turned and zoomed.
 *
 * Pseudo-3D, which is what the specification asks for: the arch is drawn flat
 * and the rotation is a horizontal squeeze plus a vertical shift, which is
 * what a real arch does on screen as it turns away from you. A real 3D model
 * would mean a WebGL context and a mesh for one screen of one simulation.
 *
 * The controls are a slider and buttons rather than a drag handler. A drag is
 * the obvious gesture and it is also the one that cannot be done from a
 * keyboard, fights the page scroll on a phone, and gives no indication that it
 * is available.
 */
export default function StudyModel() {
  const [angle, setAngle] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [arch, setArch] = useState('upper')

  const rad = (angle * Math.PI) / 180
  // Turning away from the viewer narrows the arch and lifts its far side.
  const squeeze = Math.cos(rad)
  const lift = Math.sin(rad) * 12

  const count = 10
  const teeth = Array.from({ length: count }, (_, i) => {
    const t = 180 + (180 * i) / (count - 1)
    const a = (t * Math.PI) / 180
    const x = 150 + 92 * Math.cos(a) * squeeze
    const y = 96 + 52 * Math.sin(a) + Math.cos(a) * lift
    return { i, x, y, w: (i > 2 && i < count - 3 ? 15 : 12) * (0.55 + 0.45 * Math.abs(squeeze)) }
  })

  return (
    <div className="model">
      <div className="model__stage">
        <svg className="model__svg" viewBox="0 0 300 200" role="img" aria-label={`Study model, ${arch} arch, rotated ${angle} degrees`}>
          <defs>
            <linearGradient id="plaster" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6f2ea" />
              <stop offset="100%" stopColor="#cfc6b8" />
            </linearGradient>
          </defs>
          <g transform={`translate(150 100) scale(${zoom}) translate(-150 -100)`}>
            {/* the plaster base the arch is cast on */}
            <ellipse cx="150" cy="112" rx={104 * Math.abs(squeeze) + 18} ry="56" fill="url(#plaster)" opacity="0.5" />
            {teeth.map((t) => (
              <rect
                key={t.i}
                x={t.x - t.w / 2}
                y={t.y - 16}
                width={t.w}
                height={arch === 'upper' ? 30 : 26}
                rx="4"
                fill="url(#plaster)"
                stroke="rgba(65,43,99,0.22)"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="model__controls">
        <div className="model__group" role="group" aria-label="Arch">
          <button
            type="button"
            className={`simChip${arch === 'upper' ? ' is-on' : ''}`}
            aria-pressed={arch === 'upper'}
            onClick={() => setArch('upper')}
          >
            Upper
          </button>
          <button
            type="button"
            className={`simChip${arch === 'lower' ? ' is-on' : ''}`}
            aria-pressed={arch === 'lower'}
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
