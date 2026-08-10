/**
 * The Majora mark, as a component.
 *
 * The same geometry the splash in index.html draws, lifted out so anything
 * inside the app can carry the logo without shipping a 120 kB PNG for a mark
 * that is forty lines of path data. The splash keeps its own copy on purpose —
 * it has to render before the bundle arrives, so it cannot import this.
 *
 * Every coordinate was measured off logo.png rather than eyeballed, which is
 * why the mark is centred on x=104.5 and not on 100: the artwork is composed
 * with the tassel hanging outside the frame, so the frame sits right of centre
 * and the whole thing balances.
 *
 * `animated` stamps the class names the splash's stylesheet already targets, so
 * the mark draws itself exactly as it does on the way into the site — same
 * order, same delays, same gold tassel swinging in last. Nothing about the
 * timing lives here; it lives in index.html, once. See BrandLoader.jsx.
 */
export default function MajoraMark({ className, strokeWidth = 9, animated = false }) {
  const stroke = (part) => (animated ? `splash__stroke splash__${part}` : undefined)
  const len = animated ? 1 : undefined

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The house frame, as one stroke. It starts where the tassel hangs, runs
          up over the peak, down the right side and back along the bottom. */}
      <path
        className={stroke('frame')}
        pathLength={len}
        d="M30.25 106.5V70Q30.25 65 34.5 62L100.5 16Q104.5 13 108.5 16L174.5 62Q178.65 65 178.65 70V157Q178.65 162.15 173.5 162.15H48"
      />

      {/* The open book, one page each: straight down, then breaking toward the
          spine and meeting below the frame, which is what dips the foot. */}
      <path className={stroke('book')} pathLength={len} d="M64.6 111V146Q90 153 104.5 177" />
      <path className={stroke('pages')} pathLength={len} d="M145.6 111V146Q119 153 104.5 177" />

      {/* The mortarboard: two subpaths, evenodd cutting the M out of the
          diamond rather than drawing it on top. */}
      <path
        className={animated ? 'splash__capFill' : undefined}
        fill="currentColor"
        stroke="none"
        fillRule="evenodd"
        d="M104.5 47.4L167 87.8L104.5 128.2L42.1 87.8Z M80.5 100V74H93L104.5 87.5L116 74H128.5V100H118.7V82L104.5 96.5L90.5 82V100Z"
      />

      <g className={animated ? 'splash__tassel' : undefined}>
        <ellipse
          className={animated ? 'splash__knot' : undefined}
          cx="30.2"
          cy="118.2"
          rx="7.2"
          ry="5.6"
          fill="currentColor"
          stroke="none"
        />
        <path
          className={animated ? 'splash__strands' : undefined}
          d="M26 125 22.9 149M30.2 125V154M34.4 125 37.4 149"
        />
      </g>
    </svg>
  )
}
