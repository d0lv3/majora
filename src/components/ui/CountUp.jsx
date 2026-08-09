import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './CountUp.css'

/**
 * A number that counts up to its value the first time it scrolls into view.
 *
 * Driven by GSAP, which the nav already pulls in, rather than the framer-motion
 * spring React Bits' CountUp uses — the effect is the same and this costs
 * nothing extra in the bundle.
 *
 * Two details that separate a counter that looks built from one that looks
 * bolted on:
 *
 *   Only the digits animate. A percent sign lives in its own element, so it
 *   does not slide sideways when the number grows from one digit to two, and
 *   the digit box reserves its final width up front for the same reason.
 *
 *   Screen readers hear the value once, not sixty times a second. The ticking
 *   text is aria-hidden and a visually hidden copy carries the real number, so
 *   the accessible name is correct even mid-animation.
 */

const fmt = (n, decimals) => n.toFixed(decimals)

export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const digitsRef = useRef(null)

  // Layout effect, not effect: this either resets the digits to `from` or jumps
  // them to `to`, and doing that after paint would show the wrong number for a
  // frame in one direction or the other.
  useLayoutEffect(() => {
    const el = digitsRef.current
    if (!el) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.textContent = fmt(to, decimals)
      return undefined
    }

    el.textContent = fmt(from, decimals)

    const counter = { v: from }
    let tween

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        tween = gsap.to(counter, {
          v: to,
          duration,
          delay,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(counter.v, decimals)
          },
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      tween?.kill()
    }
  }, [to, from, duration, delay, decimals])

  return (
    <span className={`countup ${className}`.trim()}>
      <span className="sr-only">{`${prefix}${fmt(to, decimals)}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        <span
          className="countup__digits"
          ref={digitsRef}
          style={{ minWidth: `${fmt(to, decimals).length}ch` }}
        >
          {fmt(from, decimals)}
        </span>
        {suffix}
      </span>
    </span>
  )
}
