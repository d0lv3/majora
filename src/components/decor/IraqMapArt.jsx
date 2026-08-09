/**
 * Iraq, with a pin where a few of the majors are actually taught.
 *
 * A picture on a landing page rather than the working map at /app/map, which
 * is Leaflet and real tiles. The border and the cities share one projection,
 * described with the outline below, so a pin lands where it belongs instead
 * of merely near it.
 *
 * As with the library drawing, the static state is the finished one and the
 * keyframes only add motion, so reduced motion loses the animation and keeps
 * the map.
 */

/**
 * The border, traced from src/assets/iraq_map.png.
 *
 * That file is a real Iraq silhouette, and this is it run through a marching-
 * squares contour trace and simplified to about 200 vertices — every previous
 * version of this outline was sampled by hand and looked it. The trace is kept
 * as a path rather than the bitmap being dropped in, because a path takes the
 * section's own colours, strokes itself on as the drawing animates, and costs
 * two kilobytes instead of two hundred.
 *
 * The silhouette's bounding box is Iraq's bounding box, so the pixels map onto
 * lon/lat and then through the same projection as the cities below:
 *
 *   x = (lon - 38.5) * 22      y = (37.5 - lat) * 26
 *
 * The two scales differ because a degree of longitude is about 93 km at this
 * latitude against 111 km for a degree of latitude; equal scales would leave
 * the country noticeably squat. As a check on the whole chain, the traced
 * outline encloses 440,800 km2 against Iraq's real 438,317.
 */
const OUTLINE =
  "M94.4 3 91.6 6.1 89.9 9.1 85.2 9.8 85 11.6 73.4 23.6 64.2 25.4 61.8 29.4 60.9 38 63.4 43.6 " +
  "63.4 48.6 61.1 52.7 61.1 55.5 60.1 58.3 59.9 70.7 55 80.1 53.3 81.1 46.2 83.2 6.5 107.5 " +
  "13 129.3 13 129.7 11.1 130.4 12.2 135 17 133.6 17.8 136.7 15.7 139.2 41.5 144.2 64.9 159.4 " +
  "78.4 165.9 137 216.1 171.4 219.4 175.7 219.4 177.5 218.6 180.7 215.7 186.2 207.4 191 196.2 " +
  "193 194.4 197.8 192.5 203.6 192.5 208.9 194.9 210.3 194.9 212.1 193.9 214.1 194 219.2 196.6 " +
  "221.7 196.9 221.7 193.3 220.2 191.3 220.9 190.6 220.8 189.9 217 185.8 215.2 186.2 " +
  "214.3 183.4 211.2 182.4 211.2 169.1 203.7 169.1 203.7 158.5 206.9 148.9 203.1 143.9 " +
  "202.9 142.6 201.7 141.7 201.7 140.7 200.4 139.6 199.1 139.4 198.9 138.8 199.6 138.1 " +
  "199.7 137 198.3 135.7 198.6 134.9 197.1 134.1 197.5 132.7 195.8 130.7 193.6 129.8 191.3 131 " +
  "189.9 130.5 182.4 123.8 175.1 118.9 171.5 117.8 168.8 118.4 167.4 117.7 167.4 116.9 " +
  "168.8 115.5 166.3 114.8 166.3 114.3 167.6 114.1 169.2 112.8 169.3 110.5 166.7 107.7 " +
  "165.3 104.1 162.5 104.5 164.3 102.5 163.1 101.3 163.2 100.8 161.1 100.9 160 101.7 " +
  "159.9 100.3 157.6 98.2 157.1 96.6 154.5 92.6 152.2 92 153.8 90.3 153.9 89 155.9 87.2 " +
  "155.6 85.5 156 83.2 154.7 81.7 153.9 82 153 79.9 153.2 78.8 154.2 78.9 154.8 78.2 154.6 76.1 " +
  "159.2 76.9 159.4 74.7 158.2 71.7 158.9 69.6 160.1 69.7 160.6 69.2 160.8 67.7 162.3 68 " +
  "162.4 66.9 163 66.5 162.6 64.1 163.7 64 163.7 63 166.7 64.1 167.2 63.2 168.5 63.2 169.5 62.2 " +
  "168.8 61.5 168.8 60.8 169.8 59.7 169 58.7 168.2 58.6 168.7 57.2 166.8 55.3 165.2 52.5 " +
  "165.8 51.4 164.9 50.4 166 50.4 165.8 47.3 168.6 47.3 169.5 46.6 171.2 46.4 172.5 45.3 " +
  "172.8 43.9 171.6 43.2 170 43.9 168.4 43.8 168.3 42.9 167.1 42.3 165.3 43.2 159.9 43.7 " +
  "158.2 41.1 155.5 39 153.8 38.6 152 39.5 151.1 39 151.6 36.6 150.5 35.4 149.9 31.9 149.1 31.2 " +
  "149.4 29 148.2 27.7 145.6 28.3 144.4 25.6 143.5 25.3 144.9 22.8 144 19.8 142.6 19.5 142 18.6 " +
  "139.7 18.6 141.2 16.8 141.2 12.6 138.7 11.1 138.1 10 138.9 9 134.9 8.1 132.2 10.7 128.9 11.6 " +
  "128.6 12.8 127.4 13.7 125.8 11.1 126.2 9.5 127.4 9 127.4 7.1 126.6 5.9 124.1 4.7 121.4 4.5 " +
  "120.8 5.4 120.1 5.4 119.4 6.9 117.3 7.6 116.1 6.9 113.2 7.2 111.8 6.3 110.2 6.6 107.2 4.5 " +
  "105.4 4.9 102.5 3.5 100 3.7 99.3 4.4 97.7 4.8 94.5 3Z"

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
