/**
 * The intraoral view of screen 4: two arches and the bite between them.
 *
 * The teeth are generated rather than drawn. Sixteen hand-written paths would
 * be sixteen chances to make one crooked by accident, and the crowding on the
 * upper arch is the point — it is a deliberate offset applied to two named
 * teeth, so it reads as crowding rather than as a mistake.
 *
 * The three regions are real buttons layered over the drawing rather than
 * click handlers on the SVG. Same hit area, but they take focus, they answer
 * the keyboard, and a screen reader is told what each one is instead of being
 * shown a graphic with a listener attached.
 */

/** Ten upper teeth on an arc, ten lower, with the arch a little wider up top. */
function archTeeth(cx, cy, rx, ry, from, to, count, size) {
  return Array.from({ length: count }, (_, i) => {
    const t = from + ((to - from) * i) / (count - 1)
    const rad = (t * Math.PI) / 180
    return {
      i,
      x: cx + rx * Math.cos(rad),
      y: cy + ry * Math.sin(rad),
      angle: t + 90,
      // Incisors are broad and flat, the teeth behind them narrower.
      w: size * (i > 2 && i < count - 3 ? 1 : 0.82),
      h: size * 1.25,
    }
  })
}

export default function MouthView({ visited, onSelect }) {
  const upper = archTeeth(160, 118, 96, 54, 180, 360, 10, 15)
  const lower = archTeeth(160, 196, 84, 46, 180, 0, 10, 13)

  const seen = (area) => visited.includes(area)

  return (
    <div className="mouth">
      <div className="mouth__stage">
        <svg className="mouth__svg" viewBox="0 0 320 300" role="img" aria-label="Intraoral view of the upper arch, lower arch and front bite">
          <defs>
            <radialGradient id="mouthGum" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#7d3550" />
              <stop offset="100%" stopColor="#4d1f33" />
            </radialGradient>
            <linearGradient id="toothFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dcd7e6" />
            </linearGradient>
          </defs>

          {/* the dark of the mouth behind everything */}
          <ellipse cx="160" cy="155" rx="140" ry="122" fill="url(#mouthGum)" />
          <ellipse cx="160" cy="158" rx="104" ry="74" fill="#2a0f1d" opacity="0.75" />

          <g className={`mouth__arch${seen('upper') ? ' is-seen' : ''}`}>
            {upper.map((t) => (
              <rect
                key={`u${t.i}`}
                x={t.x - t.w / 2}
                /* The two crowded teeth sit forward of the arc and rotated —
                   the mild anterior crowding the finding describes. */
                y={t.y - t.h / 2 + (t.i === 4 ? 4 : t.i === 5 ? -3 : 0)}
                width={t.w}
                height={t.h}
                rx="3.5"
                fill="url(#toothFace)"
                transform={`rotate(${t.angle + (t.i === 4 ? 9 : t.i === 5 ? -7 : 0)} ${t.x} ${t.y})`}
              />
            ))}
          </g>

          <g className={`mouth__arch${seen('lower') ? ' is-seen' : ''}`}>
            {lower.map((t) => (
              <rect
                key={`l${t.i}`}
                x={t.x - t.w / 2}
                y={t.y - t.h / 2}
                width={t.w}
                height={t.h}
                rx="3"
                fill="url(#toothFace)"
                transform={`rotate(${t.angle} ${t.x} ${t.y})`}
              />
            ))}
          </g>

          {/* The bite band. Only drawn once it has been looked at, so the gap
              is discovered rather than labelled in advance. */}
          {seen('front') && (
            <g className="mouth__overjet">
              <line x1="126" y1="150" x2="194" y2="150" strokeDasharray="4 4" />
              <line x1="126" y1="143" x2="126" y2="157" />
              <line x1="194" y1="143" x2="194" y2="157" />
              <text x="160" y="139" textAnchor="middle">
                7.0 mm
              </text>
            </g>
          )}
        </svg>

        {/* The three targets, over the drawing rather than in it. */}
        <button
          type="button"
          className={`mouth__zone mouth__zone--upper${seen('upper') ? ' is-seen' : ''}`}
          onClick={() => onSelect('upper')}
        >
          <span>Upper arch</span>
        </button>
        <button
          type="button"
          className={`mouth__zone mouth__zone--front${seen('front') ? ' is-seen' : ''}`}
          onClick={() => onSelect('front')}
        >
          <span>Front bite</span>
        </button>
        <button
          type="button"
          className={`mouth__zone mouth__zone--lower${seen('lower') ? ' is-seen' : ''}`}
          onClick={() => onSelect('lower')}
        >
          <span>Lower arch</span>
        </button>
      </div>
    </div>
  )
}
