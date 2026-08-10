/**
 * The intraoral view of screen 4: two arches and the bite between them.
 *
 * The teeth are generated rather than drawn. Twenty hand-written paths would be
 * twenty chances to make one crooked by accident, and the crowding on the upper
 * arch is the point — it is a deliberate offset applied to two named teeth, so
 * it reads as crowding rather than as a mistake.
 *
 * THE TEETH HAVE SHAPES, NOT WIDTHS
 *
 * A dental arch drawn as ten rounded rectangles is a diagram of an arch. What
 * makes it read as a mouth is that the tooth in each position is the shape that
 * tooth actually is: incisors end in a straight edge, canines come to a point,
 * premolars carry two cusps and molars four. `toothPath` builds each one around
 * its own origin so the arch code only has to say where it goes and which kind
 * it is.
 *
 * The gingiva is scalloped for the same reason. Gums meet teeth in a curve that
 * rises to a papilla between each pair, and a flat pink band behind the teeth
 * is the one thing that makes a drawing like this look printed rather than
 * photographed.
 *
 * The three regions are real buttons layered over the drawing rather than click
 * handlers on the SVG. Same hit area, but they take focus, they answer the
 * keyboard, and a screen reader is told what each one is instead of being shown
 * a graphic with a listener attached.
 */

/* Ten teeth per arch, counted from the midline out: central and lateral
   incisor, canine, two premolars. Mirrored, so the arch reads outward in both
   directions the way a real one does. */
const KINDS = ['molar', 'molar', 'premolar', 'canine', 'incisor', 'incisor', 'canine', 'premolar', 'molar', 'molar']

/** A tooth drawn around its own origin, seen from the front. */
function toothPath(kind, w, h) {
  const x = w / 2
  const y = h / 2
  switch (kind) {
    // Comes to a point. The one tooth whose silhouette is unmistakable.
    case 'canine':
      return `M${-x} ${-y} h${w} v${h * 0.42} q0 ${h * 0.3} ${-x * 0.55} ${h * 0.44} l${-x * 0.45} ${h * 0.24} l${-x * 0.45} ${-h * 0.24} q${-x * 0.55} ${-h * 0.14} ${-x * 0.55} ${-h * 0.44} z`
    // Two cusps, with the valley between them.
    case 'premolar':
      return `M${-x} ${-y} h${w} v${h * 0.5} q0 ${h * 0.26} ${-x * 0.5} ${h * 0.26} q${-x * 0.5} 0 ${-x * 0.5} ${-h * 0.12} q0 ${h * 0.12} ${-x * 0.5} ${h * 0.12} q${-x * 0.5} 0 ${-x * 0.5} ${-h * 0.26} z`
    // Broad, low, and squared off, with a fissure hinted at the edge.
    case 'molar':
      return `M${-x} ${-y} h${w} v${h * 0.54} q0 ${h * 0.22} ${-x * 0.42} ${h * 0.22} q${-x * 0.28} 0 ${-x * 0.28} ${-h * 0.1} q0 ${h * 0.1} ${-x * 0.3} ${h * 0.1} q${-x * 0.3} 0 ${-x * 0.3} ${-h * 0.1} q0 ${h * 0.1} ${-x * 0.28} ${-h * 0.1} q${-x * 0.42} 0 ${-x * 0.42} ${-h * 0.22} z`
    // A straight incisal edge with the corners just taken off it.
    default:
      return `M${-x} ${-y} h${w} v${h * 0.74} q0 ${h * 0.26} ${-w * 0.18} ${h * 0.26} h${-w * 0.64} q${-w * 0.18} 0 ${-w * 0.18} ${-h * 0.26} z`
  }
}

/** Positions on an arc, with the crowded pair pushed off it. */
function archTeeth(cx, cy, rx, ry, from, to, size, crowd) {
  return KINDS.map((kind, i) => {
    const t = from + ((to - from) * i) / (KINDS.length - 1)
    const rad = (t * Math.PI) / 180
    const off = crowd?.[i]
    return {
      i,
      kind,
      x: cx + rx * Math.cos(rad) + (off?.dx ?? 0),
      y: cy + ry * Math.sin(rad) + (off?.dy ?? 0),
      angle: t + 90 + (off?.rot ?? 0),
      w: size * (kind === 'incisor' ? 1 : kind === 'canine' ? 0.86 : kind === 'premolar' ? 0.9 : 1.05),
      h: size * (kind === 'incisor' ? 1.35 : kind === 'canine' ? 1.4 : 1.15),
    }
  })
}

/* The mild anterior crowding the finding describes: one lateral incisor
   rotated and standing forward of the arch, its neighbour tucked behind. */
const CROWD = {
  4: { dx: 1.5, dy: 5, rot: 11 },
  5: { dx: -1, dy: -4, rot: -8 },
}

function Arch({ teeth, seen, gumId, className }) {
  return (
    <g className={`mouth__arch${seen ? ' is-seen' : ''} ${className}`}>
      {/* Scalloped gingiva: one rounded papilla per tooth, drawn behind the
          crowns so only the margin between them shows. */}
      <g className="mouth__gum">
        {teeth.map((t) => (
          <ellipse
            key={`g${t.i}`}
            cx={t.x}
            cy={t.y}
            rx={t.w * 0.62}
            ry={t.h * 0.6}
            fill={`url(#${gumId})`}
            transform={`rotate(${t.angle} ${t.x} ${t.y})`}
          />
        ))}
      </g>

      {teeth.map((t) => (
        <g key={t.i} transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`}>
          <path className="mouth__tooth" d={toothPath(t.kind, t.w, t.h)} fill="url(#toothFace)" />
          {/* The wet highlight down the labial face. Enamel is the only thing
              in the mouth that catches the light like this. */}
          <path
            className="mouth__gloss"
            d={`M${-t.w * 0.26} ${-t.h * 0.3} q${t.w * 0.1} ${t.h * 0.34} 0 ${t.h * 0.56}`}
          />
        </g>
      ))}
    </g>
  )
}

export default function MouthView({ visited, onSelect }) {
  const upper = archTeeth(200, 142, 122, 66, 180, 360, 19, CROWD)
  const lower = archTeeth(200, 250, 107, 56, 180, 0, 17)

  const seen = (area) => visited.includes(area)

  return (
    <div className="mouth">
      <div className="mouth__stage">
        <svg
          className="mouth__svg"
          viewBox="0 0 400 375"
          role="img"
          aria-label="Intraoral view of the upper arch, lower arch and front bite"
        >
          <defs>
            <radialGradient id="mouthGum" cx="50%" cy="42%" r="68%">
              <stop offset="0%" stopColor="#8b3d5b" />
              <stop offset="70%" stopColor="#5d2740" />
              <stop offset="100%" stopColor="#3b1728" />
            </radialGradient>
            <radialGradient id="gingivaU" cx="50%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#c76e88" />
              <stop offset="100%" stopColor="#93475f" />
            </radialGradient>
            <radialGradient id="gingivaL" cx="50%" cy="70%" r="75%">
              <stop offset="0%" stopColor="#c06880" />
              <stop offset="100%" stopColor="#8a4058" />
            </radialGradient>
            <linearGradient id="toothFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdfcff" />
              <stop offset="55%" stopColor="#f2eef7" />
              <stop offset="100%" stopColor="#cfc8db" />
            </linearGradient>
            <radialGradient id="tongue" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#a84a5c" />
              <stop offset="100%" stopColor="#6d2a3a" />
            </radialGradient>
            {/* The dark of the throat, softened so it does not read as a hole
                cut in the drawing. */}
            <radialGradient id="cavity" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#1b0710" />
              <stop offset="100%" stopColor="#3a1524" />
            </radialGradient>
          </defs>

          {/* lips and cheeks, held back the way a retractor holds them */}
          <ellipse cx="200" cy="192" rx="188" ry="166" fill="url(#mouthGum)" />
          <ellipse cx="200" cy="196" rx="150" ry="120" fill="url(#cavity)" opacity="0.9" />

          {/* the palate, with the ridges that run across it */}
          <path
            className="mouth__palate"
            d="M96 140q104-58 208 0 4 44-14 74-90 26-180 0-18-30-14-74z"
          />
          <g className="mouth__rugae" aria-hidden="true">
            <path d="M168 116q32-9 64 0" />
            <path d="M164 130q36-9 72 0" />
            <path d="M168 144q32-8 64 0" />
          </g>

          {/* the tongue, filling the lower arch behind the teeth */}
          <ellipse className="mouth__tongue" cx="200" cy="268" rx="86" ry="52" fill="url(#tongue)" />
          <path className="mouth__tongueMid" d="M200 224v84" />

          <Arch teeth={upper} seen={seen('upper')} gumId="gingivaU" className="mouth__arch--upper" />
          <Arch teeth={lower} seen={seen('lower')} gumId="gingivaL" className="mouth__arch--lower" />

          {/* The bite band. Only drawn once it has been looked at, so the gap is
              discovered rather than labelled in advance. */}
          {seen('front') && (
            <g className="mouth__overjet">
              <line x1="152" y1="196" x2="248" y2="196" strokeDasharray="5 5" />
              <line x1="152" y1="186" x2="152" y2="206" />
              <line x1="248" y1="186" x2="248" y2="206" />
              <text x="200" y="181" textAnchor="middle">
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
