import { useState } from 'react'

/**
 * Screen 9, the key experience: landmarks placed on a lateral radiograph, and
 * the angles that fall out of them.
 *
 * GUIDED, AND STILL A PLACEMENT
 *
 * The reader clicks the radiograph wherever they think the landmark is. Inside
 * the tolerance it snaps to the anatomical point and locks; outside it, the
 * ring stays and the hint repeats. There is no failure state and no counter —
 * the specification forbids right and wrong, so a miss says where the point
 * lives, not that you were incorrect.
 *
 * The ring itself is a button. Clicking the image is a mouse gesture with no
 * keyboard equivalent, and the target being focusable is what stops the key
 * experience of the simulation being mouse-only.
 *
 * THE ANGLES ARE MEASURED, NOT WRITTEN DOWN
 *
 * SNA, SNB and ANB are computed from the points on screen. Because placement
 * snaps, they come out at the values the content file was authored around —
 * but they are arithmetic on the reader's own tracing rather than three
 * numbers printed underneath it, so the reading cannot drift from the drawing.
 */

const TOLERANCE = 34

/** The angle at `b`, in degrees, between the rays b->a and b->c. */
function angleAt(b, a, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y }
  const v2 = { x: c.x - b.x, y: c.y - b.y }
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y)
  if (!mag) return 0
  return (Math.acos(Math.min(1, Math.max(-1, dot / mag))) * 180) / Math.PI
}

export function cephReading(placed) {
  const at = (id) => placed.find((p) => p.id === id)
  const S = at('S')
  const N = at('N')
  const A = at('A')
  const B = at('B')
  if (!S || !N || !A || !B) return null

  const sna = angleAt(N, S, A)
  const snb = angleAt(N, S, B)
  const anb = sna - snb
  return {
    sna: sna.toFixed(1),
    snb: snb.toFixed(1),
    anb: anb.toFixed(1),
    skeletal: anb > 4 ? 'classII' : anb < 0 ? 'classIII' : 'classI',
    label: anb > 4 ? 'Class II' : anb < 0 ? 'Class III' : 'Class I',
  }
}

export default function CephTracing({ landmarks, placed, onPlace, nudge }) {
  const [missed, setMissed] = useState(false)
  const next = landmarks[placed.length] ?? null
  const has = (id) => placed.some((p) => p.id === id)
  const at = (id) => placed.find((p) => p.id === id)

  const place = () => {
    if (!next) return
    setMissed(false)
    onPlace({ id: next.id, name: next.name, x: next.x, y: next.y })
  }

  /* A click on the film. Inside the ring it counts; outside it the ring stays
     put and says so again. */
  const tryPlace = (event) => {
    if (!next) return
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 420
    const y = ((event.clientY - rect.top) / rect.height) * 400
    if (Math.hypot(x - next.x, y - next.y) <= TOLERANCE) place()
    else setMissed(true)
  }

  const line = (a, b, cls) => {
    const p = at(a)
    const q = at(b)
    if (!p || !q) return null
    return <line key={`${a}${b}`} className={cls} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />
  }

  return (
    <div className="ceph">
      <div className="ceph__filmWrap">
        <svg
          className="ceph__film"
          viewBox="0 0 420 400"
          onClick={tryPlace}
          role="img"
          aria-label="Lateral cephalometric radiograph"
        >
          <defs>
            <radialGradient id="cephGlow" cx="45%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#4a4560" />
              <stop offset="100%" stopColor="#12101c" />
            </radialGradient>
            <linearGradient id="cephBone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.16)" />
            </linearGradient>
          </defs>

          <rect width="420" height="400" fill="url(#cephGlow)" />

          {/* cranial vault */}
          <path
            className="ceph__bone"
            d="M62 186q-6-70 52-108 58-38 116-14 34 14 42 62 4 24 0 44"
            fill="none"
          />
          {/* soft-tissue profile: forehead, nose, lips, chin */}
          <path
            className="ceph__soft"
            d="M268 96q10 22 4 44l-2 8q14 26 30 44-6 8-22 10-4 10-2 20 12 6 14 16-4 10-16 12 8 8 8 20-2 14-14 22-6 16-14 26"
            fill="none"
          />
          {/* maxilla and the alveolar concavity that Point A sits in */}
          <path className="ceph__bone" d="M232 196q26 4 38 14 10 8 12 20-24 6-50 4" fill="none" />
          {/* mandible: symphysis, lower border, ramus */}
          <path
            className="ceph__bone"
            d="M246 252q14 6 18 20 4 16-8 34-8 12-20 18-34 8-70-2-30-8-42-30-8-16-6-38"
            fill="none"
          />
          {/* sella turcica — the saddle Sella sits in the middle of */}
          <path className="ceph__bone" d="M132 172q6-16 20-16t18 16" fill="none" />
          <ellipse cx="150" cy="160" rx="21" ry="15" className="ceph__sella" />

          {/* the teeth, faintly */}
          <g className="ceph__teeth">
            <rect x="254" y="208" width="9" height="22" rx="2" transform="rotate(14 258 219)" />
            <rect x="246" y="214" width="8" height="20" rx="2" transform="rotate(10 250 224)" />
            <rect x="248" y="238" width="8" height="20" rx="2" transform="rotate(-4 252 248)" />
          </g>
          <g className="ceph__spine">
            <rect x="78" y="250" width="34" height="20" rx="5" />
            <rect x="76" y="278" width="34" height="20" rx="5" />
            <rect x="74" y="306" width="34" height="20" rx="5" />
          </g>

          {/* tracing lines, drawn as their endpoints arrive */}
          <g className="ceph__lines">
            {line('S', 'N', 'ceph__line')}
            {line('N', 'A', 'ceph__line ceph__line--a')}
            {line('N', 'B', 'ceph__line ceph__line--b')}
            {line('B', 'Me', 'ceph__line ceph__line--me')}
          </g>

          {/* placed landmarks */}
          {placed.map((p) => (
            <g className="ceph__point" key={p.id}>
              <circle cx={p.x} cy={p.y} r="5.5" />
              <text x={p.x + 11} y={p.y + 4}>
                {p.id}
              </text>
            </g>
          ))}

          {/* the ring for whichever landmark is next */}
          {next && (
            <circle
              className={`ceph__target${missed ? ' is-missed' : ''}`}
              cx={next.x}
              cy={next.y}
              r={TOLERANCE}
            />
          )}
        </svg>

        {/* The keyboard's way in. Positioned over the ring, so it is the same
            target rather than a separate control that does the same thing. */}
        {next && (
          <button
            type="button"
            className="ceph__targetBtn"
            style={{ left: `${(next.x / 420) * 100}%`, top: `${(next.y / 400) * 100}%` }}
            onClick={(e) => {
              e.stopPropagation()
              place()
            }}
          >
            <span className="sr-only">{`Place ${next.name} (${next.id})`}</span>
          </button>
        )}
      </div>

      <aside className="ceph__side">
        <ol className="ceph__list">
          {landmarks.map((l) => (
            <li key={l.id} className={has(l.id) ? 'is-done' : l === next ? 'is-next' : ''}>
              <span className="ceph__abbr">{l.id}</span>
              <span className="ceph__name">{l.name}</span>
              {has(l.id) && (
                <span className="ceph__tick" aria-hidden="true">
                  ✓
                </span>
              )}
            </li>
          ))}
        </ol>

        {next ? (
          <div className="ceph__prompt">
            <p className="ceph__promptName">{next.name}</p>
            <p className="ceph__promptWhere">{next.where}</p>
            {missed && <p className="ceph__nudge">{nudge}</p>}
          </div>
        ) : (
          <Reading placed={placed} />
        )}
      </aside>
    </div>
  )
}

function Reading({ placed }) {
  const r = cephReading(placed)
  if (!r) return null
  return (
    <div className="ceph__reading">
      <p className="ceph__readingTitle">Your tracing measures</p>
      <dl className="ceph__angles">
        <div>
          <dt>SNA</dt>
          <dd>{r.sna}°</dd>
        </div>
        <div>
          <dt>SNB</dt>
          <dd>{r.snb}°</dd>
        </div>
        <div>
          <dt>ANB</dt>
          <dd>{r.anb}°</dd>
        </div>
      </dl>
      <p className="ceph__class">{r.label} skeletal relationship</p>
    </div>
  )
}
