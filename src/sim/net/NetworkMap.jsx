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
 */

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

  return (
    <div className={`netMap${defending ? ' netMap--defend' : ''}`}>
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
              style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
            >
              <span className="netZone__label">{z.label}</span>
              {z.sub && <span className="netZone__sub">{z.sub}</span>}
            </div>
          ))}
        </div>
      )}

      <svg className="netMap__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {sim.links.map(([a, b]) => {
          const A = at(a)
          const B = at(b)
          const cls = [
            'netMap__link',
            reached(a) && reached(b) ? 'is-live' : '',
            onPath(a, b) ? 'is-path' : '',
            isCut(a, b) ? 'is-cut' : '',
          ].filter(Boolean).join(' ')
          return <line key={`${a}${b}`} className={cls} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />
        })}

        {/* The traffic. A second line over each one that carries something —
            live links while you are moving, the route you took once the turn has
            happened — crawling with dots so the network reads as awake rather
            than drawn. Purely decorative, and gone under reduced motion. */}
        {sim.links.map(([a, b]) => {
          const live = reached(a) && reached(b) && !defending
          const path = onPath(a, b)
          if ((!live && !path) || isCut(a, b)) return null
          const A = at(a)
          const B = at(b)
          const cls = ['netMap__flow', live ? 'is-live' : '', path ? 'is-path' : '']
            .filter(Boolean)
            .join(' ')
          return (
            <line key={`flow${a}${b}`} className={cls} x1={A.x} y1={A.y} x2={B.x} y2={B.y} pathLength="100" />
          )
        })}
      </svg>

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
            <li key={n.id} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
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
