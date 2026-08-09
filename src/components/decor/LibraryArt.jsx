/**
 * The library, drawn: one major's page in the middle, the other fields ringed
 * around it, and a simulation running inside the page itself.
 *
 * Deliberately generic — it stands for "a major, and what it is actually
 * about" rather than for any one of the forty. The six glyphs are the same
 * line-drawings the major cards use for their fields, so the picture and the
 * product agree.
 *
 * Every animation here is decoration on top of a static drawing that already
 * reads correctly: the base styles are the finished state, and the keyframes
 * only add motion. That is what lets the reduced-motion rule in index.css
 * collapse them to nothing without leaving a half-drawn page behind.
 */

/* Each glyph is drawn in its own -10..10 box and translated onto its chip, so
   the six can be moved around the ring without redrawing any of them. */
const CHIPS = [
  // health — a trace across a monitor
  { x: 48, y: 52, d: 'M-8 0h4l2-4.5 3 9 2-4.5h5' },
  // computing — angle brackets
  { x: 48, y: 105, d: 'M-3-6-9 0l6 6M3-6 9 0 3 6' },
  // sciences — a flask
  { x: 48, y: 158, d: 'M-6-8h12M-4-8v5.5L-8 5a2.4 2.4 0 0 0 2.2 3.4h11.6A2.4 2.4 0 0 0 8 5L4-2.5V-8' },
  // humanities — an open book
  { x: 272, y: 52, d: 'M0-5.5v12M0-5.5C-2-7.4-5-8-8.5-8v11.6C-5 3.6-2 4.2 0 6.1M0-5.5C2-7.4 5-8 8.5-8v11.6C5 3.6 2 4.2 0 6.1' },
  // society — a set of scales
  { x: 272, y: 105, d: 'M0-8v14M-7 6h14M-8-4.5h16M-8-4.5l-3 5.5h6zM8-4.5l-3 5.5h6z' },
  // arts — a brush
  { x: 272, y: 158, d: 'M-7 8 5-4.5l3.5 3.5L-3.5 11.5l-4.6 1z' },
]

/* The three body lines on the page under the title. */
const LINES = [
  { y: 78, w: 88 },
  { y: 90, w: 74 },
  { y: 102, w: 82 },
]

export default function LibraryArt({ className = '' }) {
  return (
    <svg
      className={`libArt ${className}`}
      viewBox="0 0 320 210"
      role="img"
      aria-label="A major's page, with the other fields around it and a simulation running inside"
    >
      {/* the ring the chips sit on, so they read as one set rather than six
          marks scattered at the edges */}
      <path
        className="libArt__ring"
        d="M48 52a112 112 0 0 0 0 106M272 52a112 112 0 0 1 0 106"
        fill="none"
      />

      <g className="libArt__card">
        <rect x="100" y="24" width="120" height="162" rx="14" className="libArt__page" />

        {/* the field label and the major's name */}
        <rect x="114" y="40" width="42" height="7" rx="3.5" className="libArt__eyebrow" />
        <rect x="114" y="55" width="76" height="11" rx="5.5" className="libArt__title" />

        {LINES.map((line) => (
          <rect
            key={line.y}
            x="114"
            y={line.y}
            width={line.w}
            height="6"
            rx="3"
            className="libArt__line"
          />
        ))}

        {/* "not only in theory": the panel where the major is practised */}
        <g className="libArt__sim">
          <rect x="114" y="120" width="92" height="52" rx="9" className="libArt__simBox" />
          <path
            className="libArt__trace"
            d="M122 158c8 0 10-26 17-26s9 20 16 20 10-30 17-30 9 14 14 14"
            fill="none"
          />
          {/* the run, sweeping the panel left to right */}
          <rect x="114" y="120" width="2" height="52" className="libArt__scan" />
        </g>
      </g>

      {/* Two nested groups on purpose. The outer one is placed with the SVG
          `transform` attribute; the inner one is scaled by the keyframes. A
          CSS transform on the same element would replace the attribute rather
          than compose with it, and every chip would pile up at the origin. */}
      {CHIPS.map((chip, i) => (
        <g key={chip.x + chip.y} transform={`translate(${chip.x} ${chip.y})`}>
          <g className="libArt__chip" style={{ '--chip-i': i }}>
            <circle r="19" className="libArt__chipDisc" />
            <path d={chip.d} className="libArt__chipGlyph" fill="none" />
          </g>
        </g>
      ))}
    </svg>
  )
}
