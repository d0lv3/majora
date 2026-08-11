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

const ICONS = {
  you: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 4.5 6.5 4.5 10S15 19 12 22c-3-3-4.5-6.5-4.5-10S9 5 12 2z" />,
  server: <path d="M4 5h16v6H4zM4 13h16v6H4zM7.5 8h.01M7.5 16h.01" />,
  network: <path d="M12 3v6M5 21v-4h14v4M5 17l7-8 7 8M12 9h.01" />,
  laptop: <path d="M5 5h14v10H5zM2 19h20l-2-4H4z" />,
  database: <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
}

export default function NetworkMap({ sim, state, onSelect, unreadIds = [], pathIds = [], cutLinks = [], defending = false }) {
  const at = (id) => sim.nodes.find((n) => n.id === id)
  const reached = (id) => state.reached.includes(id)
  /* A node is yours if a step you took opened it, or if it was the ground that
     step was taken from — both are places you ended up standing. */
  const taken = (id) =>
    state.taken.some((t) => {
      const step = sim.steps.find((s) => s.id === t)
      return step?.at === id || step?.opens?.includes(id)
    })

  /** A link is on the route if both its ends are. */
  const onPath = (a, b) => pathIds.includes(a) && pathIds.includes(b)
  const isCut = (a, b) => cutLinks.some(([x, y]) => (x === a && y === b) || (x === b && y === a))

  return (
    <div className={`netMap${defending ? ' netMap--defend' : ''}`}>
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
                aria-pressed={state.selected === n.id}
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
