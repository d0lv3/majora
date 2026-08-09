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

/**
 * The border, clockwise from the Syria/Turkey tripoint in the north-west.
 *
 * Sampled closely enough that the four things which make Iraq recognisable
 * survive: the long straight Saudi diagonal running north-west out of the
 * desert, the western point where Jordan and Syria meet, the jagged Zagros
 * edge down the Iranian side, and the narrow throat to the Gulf with Kuwait
 * bitten out of it. The Syrian border is the piece that most needs the extra
 * vertices — it is a north-east diagonal from Abu Kamal, not the vertical it
 * collapses into when the outline is sampled coarsely.
 */
const OUTLINE =
  // Turkey, west to east, over the top of the Kurdistan Region
  'M84.9 10.1 89.1 7 94.2 4.7 101.2 3.4 111.1 6.5 121 4.7 127.2 6.5 133.1 7.8 138.4 9.4 ' +
  // Iran, down the Zagros
  '141.9 15.6 145.2 21.3 149.6 28.6 152.2 37.4 157.9 43.7 166.1 50.7 169.4 59.8 167.2 67.6 ' +
  '162.8 74.9 158.8 82.7 162.8 89.7 164.6 98.3 167.2 106.1 163.9 114.4 172.7 118.3 189.2 130.5 ' +
  '194.7 137.8 196.2 146.9 201.9 158.6 205.7 169 209.4 178.9 213.4 187.2 218.2 192.4 221.8 195.5 ' +
  // the Faw peninsula, the coast, then Kuwait cutting back inland
  '218.9 197.1 213.4 195.5 209 194.2 202.4 192.7 196.2 194.5 190.3 201.5 184.8 209.3 177.1 218.4 ' +
  // Saudi Arabia: flat along the south, then the long north-west diagonal
  '167.2 218.7 151.8 219.4 136.4 215.8 110 197.6 83.6 179.4 59.4 163.8 35.2 150.8 10.8 143 ' +
  // Jordan, up the western point
  '7 124.8 5.9 107.1 ' +
  // Syria, north-east from the Euphrates crossing back to the start
  '17.6 101.4 37.4 89.7 53.5 80.1 59.4 70.7 67.1 55.9 73.7 37.7 79.2 23.4 Z'

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
      {/* pathLength normalises the border to 1 unit, so the draw-on keyframes
          can dash it without anyone having to measure the path by hand — and
          without them silently breaking the next time a vertex moves. */}
      <path className="mapArt__border" d={OUTLINE} fill="none" pathLength="1" />

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
