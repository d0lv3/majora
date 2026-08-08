/**
 * Brand presets for <SpecularButton />.
 *
 * The component paints its rim highlight in WebGL — one canvas per button —
 * so it is reserved for primary actions (hero CTAs, form submits, section
 * closers). Dense repeated controls (filter chips, card links) stay as plain
 * CSS buttons on purpose: a browser only keeps ~16 live WebGL contexts, and a
 * 45-card grid would blow straight through that.
 *
 * Spread a preset, then override anything per call site:
 *   <SpecularButton {...SB.gold} size="md">Get Started</SpecularButton>
 */

const shared = {
  radius: 999, // clamps to a pill, matching the nav and the rest of the system
  shineSize: 12,
  shineFade: 42,
  thickness: 1,
  proximity: 260,
}

export const SB = {
  /** The primary action. Brand gold — used for "Get Started". */
  gold: {
    ...shared,
    tint: '#eeaf16',
    tintOpacity: 1,
    textColor: '#1e1330',
    lineColor: '#ffffff',
    baseColor: '#c68f0a',
    intensity: 1.15,
  },

  /** Secondary action on a dark purple surface. */
  ghost: {
    ...shared,
    tint: '#ffffff',
    tintOpacity: 0.07,
    textColor: '#ffffff',
    lineColor: '#ffffff',
    baseColor: '#8a70ad',
    intensity: 1,
  },

  /** Primary action on a light surface. */
  purple: {
    ...shared,
    tint: '#412b63',
    tintOpacity: 1,
    textColor: '#ffffff',
    lineColor: '#eeaf16',
    baseColor: '#1e1330',
    intensity: 1.1,
  },

  /**
   * Secondary action on a light surface. The ghost preset above is built for
   * dark panels: its white rim and white label vanish on the pale hero, so
   * this one keeps the same glass construction but paints the label and the
   * specular line in brand purple over a near-white fill.
   */
  outline: {
    ...shared,
    tint: '#ffffff',
    tintOpacity: 0.86,
    textColor: '#412b63',
    lineColor: '#412b63',
    baseColor: '#b3a1cb',
    intensity: 0.9,
  },

  /** Near-black, for when gold would fight with the surrounding colour. */
  ink: {
    ...shared,
    tint: '#0b0810',
    tintOpacity: 1,
    textColor: '#ffffff',
    lineColor: '#eeaf16',
    baseColor: '#412b63',
    intensity: 1.05,
  },
}

export default SB
