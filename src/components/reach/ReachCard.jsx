import { Link } from 'react-router-dom'

import { getMajor, isAvailable } from '../../data/majors.js'
import { schoolName } from '../../data/reach.js'
import './reach.css'

/**
 * One person you can book time with.
 *
 * A photograph first and large, because the whole proposition is that there is
 * a person on the other end of this — a card that led with a subject tag and
 * put a thumbnail in the corner would read as another entry in the library.
 *
 * The card itself is not a link and never becomes one. It carries three
 * different destinations — the major, LinkedIn, and the booking dialog — and a
 * clickable card wrapping three controls is a card where the reader cannot
 * predict what a tap does.
 */
export default function ReachCard({ person, index = 0, onReach }) {
  return (
    <article className="pcard">
      <div className="pcard__shot">
        <img
          className="pcard__photo"
          src={person.photo}
          alt={person.photoAlt}
          width="800"
          height="800"
          /* The first row is the page — a lazy photograph there is the largest
             thing on screen waiting for a frame before it starts loading.
             Everything past it can wait until it is scrolled to. */
          loading={index < 3 ? 'eager' : 'lazy'}
        />

        {/* The subject and the name, over the foot of the photograph rather
            than under it. Both belong to the person in the picture, and moving
            them onto it is what stops the card being a column: with a square
            photograph and three stacked blocks of type beneath it, the card was
            more than twice as tall as it was wide. */}
        <div className="pcard__over">
          <ul className="pcard__majors">
            {person.majors.map((slug) => {
              const major = getMajor(slug)
              if (!major) return null
              return (
                <li key={slug}>
                  {/* A link where the major is written up, plain text where it
                      is not: a tag that opens a "coming soon" page is worse
                      than a tag that opens nothing. */}
                  {isAvailable(major) ? (
                    <Link to={`/app/${slug}`} className="pcard__major pcard__major--open">
                      {major.name}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  ) : (
                    <span className="pcard__major">{major.name}</span>
                  )}
                </li>
              )
            })}
          </ul>
          <h2 className="pcard__name">{person.name}</h2>
        </div>
      </div>

      <div className="pcard__body">
        {/* Every degree, not the latest one. Somebody part way through a
            master's in another country is a different person to ask than an
            undergraduate, and flattening the two to one line throws away the
            reason to book them.

            The city is not repeated here. "University of Mosul · Mosul,
            Nineveh" is a line and a half saying one thing, and where a
            university is, is the map's job. Only somewhere the map does not
            cover says where it is — which is the part worth knowing. */}
        <ul className="pcard__study">
          {person.study.map((entry) => (
            <li key={`${entry.award}-${entry.uni ?? entry.place}`} className="pcard__degree">
              <span className="pcard__award">
                {entry.award}
                {entry.current && <span className="pcard__now">In progress</span>}
              </span>
              <span className="pcard__school">
                {schoolName(entry)}
                {entry.where && <span className="pcard__where"> · {entry.where}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pcard__foot">
        <a
          className="pcard__linkedin"
          href={person.linkedin}
          target="_blank"
          rel="noreferrer noopener"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.27-.02-2.9-1.8-2.9s-2.05 1.38-2.05 2.8V21h-4z"
            />
          </svg>
          {/* The name of the place, not "profile": the icon has already said
              which place, and a reader scanning three cards is looking for the
              word LinkedIn. */}
          LinkedIn
          <span className="sr-only"> — {person.name}, opens in a new tab</span>
        </a>

        <button type="button" className="pcard__reach" onClick={() => onReach(person)}>
          Reach
          <span className="pcard__reachArrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </article>
  )
}
