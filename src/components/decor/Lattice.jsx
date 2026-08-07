/**
 * Faint diamond lattice lifted from the logo's centre shape. Used as a
 * background texture on dark panels. Decorative only.
 */
export default function Lattice({ className = '', size = 72, color = 'rgba(255,255,255,0.07)' }) {
  const id = `lattice-${size}`
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M${size / 2} 4 L${size - 4} ${size / 2} L${size / 2} ${size - 4} L4 ${size / 2} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
