/**
 * Iraq, with a pin where a few of the majors are actually taught.
 *
 * The outline is a simplified national border — enough vertices for the shape
 * to be recognised (the flat Saudi diagonal in the south-west, the point at
 * the Gulf) and no more, because this is a picture on a landing page rather
 * than the real map at /app/map. The cities are placed from their true
 * coordinates through the same projection as the outline, so the pins land
 * where they belong even though the coastline is approximate.
 *
 *   x = (lon - 38.5) * 22      y = (37.5 - lat) * 26
 *
 * The two scales differ because a degree of longitude is about 93 km at this
 * latitude against 111 km for a degree of latitude; equal scales would leave
 * the country noticeably squat.
 *
 * As with the library drawing, the static state is the finished one and the
 * keyframes only add motion, so reduced motion loses the animation and keeps
 * the map.
 */

const OUTLINE =
  'M84.7 10.4 94.6 5.2 110 6.5 127.6 11.7 138.6 7.8 151.8 26 156.2 44.2 167.2 59.8 ' +
  '162.8 75.4 167.2 101.4 189.2 106.6 202.4 117 195.8 132.6 202.4 148.2 205.7 169 ' +
  '209 182 222.2 193.7 209 196.3 202.4 192.4 187 195 177.1 218.4 136.4 215.8 79.2 166.4 ' +
  '41.8 145.6 15.4 139.1 6.4 107.4 48.4 80.6 59.4 70.2 61.6 29.9 Z'

/** The cities, north to south, already projected. */
const PINS = [
  { name: 'Duhok', x: 98.8, y: 16.4 },
  { name: 'Erbil', x: 121.2, y: 34.1 },
  { name: 'Sulaymaniyah', x: 152.5, y: 50.4 },
  { name: 'Mosul', x: 101.9, y: 30.2 },
  { name: 'Baghdad', x: 128.9, y: 108.9, big: true },
  { name: 'Najaf', x: 128, y: 142.2 },
  { name: 'Basra', x: 204.2, y: 181.7, big: true },
]

/* Three fields, tagged onto the map the way a college is: a disc on a leader,
   so the drawing says "different majors, different places" without a legend.
   All three sit outside the border — inside, a filled disc reads as a city
   that is somehow more important than the pins around it. */
const TAGS = [
  { x: 42, y: 42, to: [98.8, 16.4], d: 'M-8 0h4l2-4.5 3 9 2-4.5h5' },
  { x: 186, y: 78, to: [152.5, 50.4], d: 'M-3-6-9 0l6 6M3-6 9 0 3 6' },
  { x: 60, y: 200, to: [128, 142.2], d: 'M0-5.5v12M0-5.5C-2-7.4-5-8-8.5-8v11.6C-5 3.6-2 4.2 0 6.1M0-5.5C2-7.4 5-8 8.5-8v11.6C5 3.6 2 4.2 0 6.1' },
]

export default function IraqMapArt({ className = '' }) {
  return (
    <svg
      className={`mapArt ${className}`}
      viewBox="0 0 228 226"
      role="img"
      aria-label="A map of Iraq with pins on the cities where different majors are taught"
    >
      <path className="mapArt__fill" d={OUTLINE} />
      <path className="mapArt__border" d={OUTLINE} fill="none" />

      {TAGS.map((tag, i) => (
        <g className="mapArt__tag" key={tag.x} style={{ '--tag-i': i }}>
          <line
            className="mapArt__leader"
            x1={tag.x}
            y1={tag.y}
            x2={tag.to[0]}
            y2={tag.to[1]}
          />
          <g transform={`translate(${tag.x} ${tag.y})`}>
            <circle r="15" className="mapArt__tagDisc" />
            <path d={tag.d} className="mapArt__tagGlyph" fill="none" />
          </g>
        </g>
      ))}

      {/* Placed by attribute on the outer group, animated by CSS on the inner
          one: a CSS transform replaces the attribute instead of composing
          with it, so a single element would take every pin to the origin. */}
      {PINS.map((pin, i) => (
        <g key={pin.name} transform={`translate(${pin.x} ${pin.y})`}>
          <title>{pin.name}</title>
          <g className="mapArt__pin" style={{ '--pin-i': i }}>
            <circle r={pin.big ? 5.5 : 4} className="mapArt__pulse" />
            <circle r={pin.big ? 5.5 : 4} className="mapArt__dot" />
          </g>
        </g>
      ))}
    </svg>
  )
}
