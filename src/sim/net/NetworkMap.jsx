import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

/**
 * The network, and the one component that never leaves the screen.
 *
 * It is the same drawing in every phase — that is the whole idea of the
 * simulation, and it only works if the reader can see it is the same map when
 * the job changes from getting in to keeping people out.
 *
 * WHAT THE DRAWING SAYS
 *
 *   dim      a node you know is there and cannot talk to yet
 *   lit      reachable
 *   taken    yours, in the attack phase
 *   path     part of the route you took, once the turn has happened
 *   fixed    a link a chosen fix has cut, in the defence phase
 *
 * Nodes are buttons rather than shapes with click handlers: they take focus,
 * they answer the keyboard, and a screen reader is told what each one is and
 * whether it is reachable instead of being handed a graphic.
 *
 * Positions are percentages, so the topology survives a phone rather than
 * being squashed into one — the layout is the meaning here.
 *
 * WHERE THE LINES GO
 *
 * A node's coordinate is the centre of the whole button — icon with its name
 * underneath — so a line drawn centre to centre leaves from the gap between the
 * two and crosses the icon and the label on its way out. That is what made them
 * look wrong. The lines are measured instead: they run icon centre to icon
 * centre and stop at the icon's edge, so a link touches the two machines it
 * joins and nothing else. See useWiring.
 */

/** Clear air between the icon's edge and where its wire starts, in pixels. */
const LEAD = 7

/**
 * Measure what the lines need and nothing more: how big the coordinate box is,
 * how far each icon's centre sits above its node's anchor point, and how wide
 * the icon is.
 *
 * All of it read from offset* rather than getBoundingClientRect, because the
 * selected node is scaled by a CSS transform and a measured rect would grow
 * with it — the wires would then shrink back every time you clicked something,
 * mid-transition. offsetWidth and offsetTop are layout, before transforms, so
 * this stays still.
 */
function useWiring(ref) {
  const [wiring, setWiring] = useState(null)
  const last = useRef('')

  const measure = useCallback(() => {
    const root = ref.current
    if (!root) return
    const layer = root.querySelector('.netMap__nodes')
    if (!layer) return
    const w = layer.clientWidth
    const h = layer.clientHeight
    if (!w || !h) return

    const nodes = {}
    layer.querySelectorAll('[data-node]').forEach((li) => {
      const button = li.querySelector('.netNode')
      const icon = li.querySelector('.netNode__icon')
      if (!button || !icon) return
      nodes[li.dataset.node] = {
        /* The anchor is the button's middle; the icon sits above it by however
           much the name underneath takes up. */
        lift: button.offsetHeight / 2 - (icon.offsetTop + icon.offsetHeight / 2),
        /* Two boxes around the icon's centre. The inner one is the icon, and it
           is what a line leaves from sideways or upward, so a wire touches the
           machine it joins. The outer one takes in the name underneath, and it
           is what a line leaves from when it is heading down — past where the
           name is written. */
        hx: icon.offsetWidth / 2,
        hxWide: button.offsetWidth / 2,
        hUp: icon.offsetHeight / 2,
        hDown: button.offsetHeight - (icon.offsetTop + icon.offsetHeight / 2),
      }
    })

    /* Only wake React when the answer actually moved. This is what lets the
       measurement run after every render without looping: the second pass
       computes the same numbers and stops here. */
    const next = { w, h, nodes }
    const key = JSON.stringify(next)
    if (key === last.current) return
    last.current = key
    setWiring(next)
  }, [ref])

  /* After every render, because a resize is not the only thing that moves an
     icon and not every host reports one: ResizeObserver and the resize event
     are both delivered on the frame loop, which a host is free to hold back.
     Re-checking on render costs a handful of offset reads and means the wires
     cannot stay wrong once anything at all has happened. */
  useLayoutEffect(measure)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    window.addEventListener('resize', measure)
    /* A label that wraps to two lines once the webfont lands moves the icon,
       so measure again when the fonts are in rather than wiring to Times. */
    document.fonts?.ready?.then(measure).catch(() => {})
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref, measure])

  return wiring
}

/**
 * How far from an icon's centre a wire pointing (ux, uy) should start.
 *
 * A ray out of the middle of a box leaves through whichever wall it reaches
 * first, which is the smaller of the two crossing distances. Downward rays are
 * measured against the wider box so they clear the name; everything else
 * against the icon, so a wire meets the machine and not the caption.
 */
function edgeOut(node, ux, uy) {
  /* "Down" has to mean properly down, not merely not-up. Two nodes on the same
     row still tilt a hair when one of their names wraps to a second line, and
     on any threshold near zero that hair was enough to trim the wire back to
     the width of the name — a level link leaving a wide gap for no visible
     reason. A ray this shallow leaves through the icon's side and is past the
     name's outer edge long before it has dropped as far as the name's first
     line, so the icon is the right box for it. */
  const down = uy > 0.3
  const hx = down ? node.hxWide : node.hx
  const hy = down ? node.hDown : node.hUp
  const toSide = Math.abs(ux) < 1e-6 ? Infinity : hx / Math.abs(ux)
  const toCap = Math.abs(uy) < 1e-6 ? Infinity : hy / Math.abs(uy)
  const out = Math.min(toSide, toCap)
  /* Both walls out of reach means the ray has no direction at all — two nodes
     measured to the same point, which is what a collapsed or not-yet-laid-out
     map gives. Infinity here would multiply a zero direction into NaN and put
     "NaN" in the attribute, so it stops at nothing instead. */
  return Number.isFinite(out) ? out : 0
}

/* The devices, as silhouettes. Identity is the shape — a real topology diagram
   names a machine by its outline, not its colour — so these stay stroked in
   currentColor and let the node's state (dim, lit, gold, taken) do the colour.
   Detailed enough to read as the thing they are: a rack with its units and a
   status light, a database as a stack of platters, a laptop with a prompt on
   the screen, the office as a switch with its ports, you as a globe. */
const ICONS = {
  you: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 2.6 3 15.4 0 18M12 3c-3 2.6-3 15.4 0 18" />
    </>
  ),
  server: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1.6" />
      <path d="M9 7.2h6M9 11h6" />
      <circle cx="15" cy="16.6" r="0.7" fill="currentColor" stroke="none" />
      <path d="M9 16.6h3" />
    </>
  ),
  network: (
    <>
      <rect x="3" y="8.5" width="18" height="7.5" rx="1.4" />
      <path d="M6.5 13.4v1.4M9.5 13.4v1.4M12.5 13.4v1.4M15.5 13.4v1.4" />
      <circle cx="6.5" cy="11" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="11" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="4.5" width="14" height="9.5" rx="1.3" />
      <path d="M8.3 7.6l2.2 1.7-2.2 1.7" />
      <path d="M12.5 11h3" />
      <path d="M2.5 18.5h19l-1.7-3H4.2z" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.6" />
      <path d="M5 5.5v12.5c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6V5.5" />
      <path d="M5 11.75c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6" />
    </>
  ),
}

export default function NetworkMap({ sim, state, onSelect, unreadIds = [], pathIds = [], cutLinks = [], defending = false, mode = null }) {
  /* Once the attack is over the panel stops listening to the map, so the nodes
     stop offering: disabled rather than silently inert, which also takes them
     out of the tab order instead of leaving six stops that do nothing. */
  const live = !defending
  const at = (id) => sim.nodes.find((n) => n.id === id)
  const reached = (id) => state.reached.includes(id)
  /* Yours, which is not the same as reachable. Taking the web server puts the
     file server within reach and gives you nothing on it, so `owns` is the one
     node a step hands over and `opens` is everything it lets you see. */
  const taken = (id) =>
    state.taken.some((t) => sim.steps.find((s) => s.id === t)?.owns === id)

  /** A link is on the route if both its ends are. */
  const onPath = (a, b) => pathIds.includes(a) && pathIds.includes(b)
  const isCut = (a, b) => cutLinks.some(([x, y]) => (x === a && y === b) || (x === b && y === a))

  const mapRef = useRef(null)
  const wiring = useWiring(mapRef)

  /**
   * Every link, as the segment between the two icons it joins.
   *
   * The maths is done in pixels — the coordinate box is stretched to the map's
   * shape, so a step sideways and a step down are different distances and a
   * trim applied in the 0–100 space would be lopsided — and handed back in the
   * same 0–100 units the viewBox is drawn in.
   */
  const wires = useMemo(() => {
    const out = {}
    sim.links.forEach(([a, b]) => {
      const A = at(a)
      const B = at(b)
      /* Before the first measurement, join the anchors. It is what the map did
         all along and it is only ever on screen for one frame. */
      if (!wiring?.nodes[a] || !wiring?.nodes[b]) {
        out[`${a}${b}`] = { x1: A.x, y1: A.y, x2: B.x, y2: B.y }
        return
      }
      const { w, h, nodes } = wiring
      const ax = (A.x / 100) * w
      const ay = (A.y / 100) * h - nodes[a].lift
      const bx = (B.x / 100) * w
      const by = (B.y / 100) * h - nodes[b].lift
      const span = Math.hypot(bx - ax, by - ay) || 1
      const ux = (bx - ax) / span
      const uy = (by - ay) / span
      /* Each end measured along its own outgoing direction — the far node's
         wire points back the way it came. */
      const head = edgeOut(nodes[a], ux, uy) + LEAD
      const tail = edgeOut(nodes[b], -ux, -uy) + LEAD
      /* Two icons closer together than their own radii would give a line that
         runs backwards; a short stub is the honest picture. */
      const reach = Math.max(span - head - tail, 1)
      const sx = ax + ux * head
      const sy = ay + uy * head
      const line = {
        x1: (sx / w) * 100,
        y1: (sy / h) * 100,
        x2: ((sx + ux * reach) / w) * 100,
        y2: ((sy + uy * reach) / h) * 100,
      }
      /* Whatever happens, an <svg> gets four numbers. A measurement taken while
         the map is collapsed can still work its way through the arithmetic, and
         the anchors are always drawable. */
      out[`${a}${b}`] = Object.values(line).every(Number.isFinite)
        ? line
        : { x1: A.x, y1: A.y, x2: B.x, y2: B.y }
    })
    return out
  }, [sim.links, sim.nodes, wiring])

  return (
    <div className={`netMap${defending ? ' netMap--defend' : ''}`} ref={mapRef}>
      {/* Which mindset you are in, said on the map. Gold while you are the one
          moving through the network, green once it is yours to hold. */}
      {mode && (
        <div className="netMap__mode">
          <span className="netMap__modeDot" aria-hidden="true" />
          <span className="netMap__modeSide">{mode.side}</span>
          {mode.label && <span className="netMap__modeLabel">{mode.label}</span>}
        </div>
      )}

      {/* The segments, behind everything. Drawn as HTML rather than in the
          stretched SVG so their labels are not squashed with the coordinate
          space — same inset as the nodes, so the boxes land around them. */}
      {sim.zones && (
        <div className="netMap__zones" aria-hidden="true">
          {sim.zones.map((z) => (
            <div
              key={z.id}
              className={`netZone netZone--${z.tone}`}
              /* Handed over as custom properties rather than as left/width
                 outright: a phone fits the same names into a third of the
                 pixels, so the two narrow segments have to be cut differently
                 there, and an inline left/width could not be overridden by a
                 media query. */
              style={{ '--zx': `${z.x}%`, '--zy': `${z.y}%`, '--zw': `${z.w}%`, '--zh': `${z.h}%` }}
            >
              <span className="netZone__label">{z.label}</span>
              {z.sub && <span className="netZone__sub">{z.sub}</span>}
            </div>
          ))}
        </div>
      )}

      {/* The wires get a wrapper because an <svg> is a replaced element: given
          insets and height:auto it takes its height from the viewBox's ratio
          instead of from the box it was given, so the line layer was 601 tall
          where the nodes were 384 and every line was drawn against a different
          vertical scale than the machines it joined. The wrapper has a definite
          height; the svg fills it. */}
      <div className="netMap__wires" aria-hidden="true">
        <svg className="netMap__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {sim.links.map(([a, b]) => {
          const cls = [
            'netMap__link',
            reached(a) && reached(b) ? 'is-live' : '',
            onPath(a, b) ? 'is-path' : '',
            isCut(a, b) ? 'is-cut' : '',
          ].filter(Boolean).join(' ')
          return <line key={`${a}${b}`} className={cls} {...wires[`${a}${b}`]} />
        })}

        {/* The traffic. A second line over each one that carries something —
            live links while you are moving, the route you took once the turn has
            happened — crawling with dots so the network reads as awake rather
            than drawn. Purely decorative, and gone under reduced motion. */}
        {sim.links.map(([a, b]) => {
          const live = reached(a) && reached(b) && !defending
          const path = onPath(a, b)
          if ((!live && !path) || isCut(a, b)) return null
          const cls = ['netMap__flow', live ? 'is-live' : '', path ? 'is-path' : '']
            .filter(Boolean)
            .join(' ')
          return (
            <line key={`flow${a}${b}`} className={cls} {...wires[`${a}${b}`]} pathLength="100" />
          )
        })}
        </svg>
      </div>

      <ul className="netMap__nodes">
        {sim.nodes.map((n) => {
          const cls = [
            'netNode',
            reached(n.id) ? 'is-lit' : 'is-dim',
            taken(n.id) ? 'is-taken' : '',
            pathIds.includes(n.id) ? 'is-path' : '',
            n.prize ? 'netNode--prize' : '',
            state.selected === n.id ? 'is-on' : '',
            unreadIds.includes(n.id) ? 'has-new' : '',
          ].filter(Boolean).join(' ')
          return (
            /* Custom properties for the same reason the segments use them: a
               phone has a third of the width for the same six names, and the
               two on the right have to stand further apart there. */
            <li key={n.id} data-node={n.id} style={{ '--nx': `${n.x}%`, '--ny': `${n.y}%` }}>
              <button
                type="button"
                className={cls}
                onClick={() => onSelect(n.id)}
                disabled={!live}
                aria-pressed={live ? state.selected === n.id : undefined}
              >
                <span className="netNode__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[n.kind] ?? ICONS.server}
                  </svg>
                </span>
                <span className="netNode__label">{n.label}</span>
                {unreadIds.includes(n.id) && (
                  <span className="netNode__new" aria-label="something here you have not looked at" />
                )}
                <span className="sr-only">
                  {reached(n.id) ? ' — reachable' : ' — not reachable from where you are'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
