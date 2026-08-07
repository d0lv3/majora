/**
 * The two sweeping strokes that frame the brand key visual — a route drawn
 * across the page. Purely decorative.
 */
export default function CornerLines({ className = '', stroke = 'var(--ink)', opacity = 1 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <path
        d="M-40 -60C40 120 96 236 120 420c22 168 -6 300 -60 480"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1480 960C1400 780 1344 664 1320 480c-22 -168 6 -300 60 -480"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
