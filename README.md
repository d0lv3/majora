# Majora

> Discover Where You Fit.

A React + Vite front end for **Majora**, a platform that teaches students in
Kurdistan, Iraq what each university major actually is, years before they have
to choose one, and what their major holds if they are already studying it.

**The problem it exists for:** middle school students and beyond struggle to
choose the right major because they are not adequately prepared or exposed to
different academic and career paths before graduation. That produces
uncertainty, uninformed choices, and a higher likelihood of choosing an
unsuitable major.

This repository is the front end only. There is no backend yet.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

```bash
npm run build
```

## Shape of the site

Two places, one router.

| Route | What it is |
| --- | --- |
| `/` | The landing page. Everything public lives here on a single scroll |
| `/login` · `/signup` | Full-bleed split auth screens |
| `/logout` | Clears the session and returns home |
| `/app` | **Signed in.** The majors library: card grid, search, field filters |
| `/app/:slug` | **Signed in.** A single major |

The nav items are anchors into the landing page (`#top`, `#about`, `#contact`),
not routes. `/about`, `/contact` and `/majors/*` redirect to their current
homes so older links keep working.

The landing page reads in this order: hero, the problem, why it persists, the
solution, what changes, how Majora works, what a major page holds, about
Majora, the library preview, the fields index, contact, and a closing call to
action.

## Structure

```
src/
├─ assets/visual-identity/
│  ├─ logo.png              master, 5000x5000 (4.7 MB), not shipped
│  └─ logo-web.png          800x800 (120 KB), what the app imports
├─ components/
│  ├─ ui/                   React Bits components + brand presets
│  │  ├─ PillNav.jsx/.css       navigation (gsap)
│  │  ├─ SpecularButton.jsx/.css primary buttons (ogl / WebGL)
│  │  └─ buttonPresets.js       gold / ghost / purple / ink presets
│  ├─ decor/                CornerLines, Lattice, the geometric motifs
│  ├─ Navbar.jsx            configures PillNav for the landing page
│  ├─ AppNav.jsx            the signed-in header
│  ├─ Footer.jsx
│  ├─ MajorCard.jsx/.css    the near-square major tile
│  ├─ AuthAside.jsx         purple half of the auth split
│  └─ Reveal.jsx            scroll-triggered fade and lift
├─ sections/                landing-page sections (About, Contact)
├─ pages/                   one route each, with its own stylesheet
├─ context/AuthContext.jsx  front-end-only session (localStorage)
├─ data/majors.js           46 majors across 10 fields
└─ index.css                design tokens, reset, shared primitives
```

## The majors data

`src/data/majors.js` holds **46 majors across 10 fields**, scoped to programmes
actually offered in the region. Every entry answers the same four questions, so
two majors can be compared rather than just admired:

```js
{
  slug: 'cybersecurity',
  name: 'Cybersecurity',
  field: 'computing',
  years: 4,
  available: true,        // omit or set false for "coming soon"
  tagline: '...',
  studies: [...],         // what you will study
  skills: [...],          // skills you will build
  careers: [...],         // where it leads
  fitIf: '...',           // whether it fits you
}
```

**Three majors are written up and open:** Dentistry, Cybersecurity, and English
Language & Literature. The other 43 render as dimmed "coming soon" tiles rather
than being hidden, so the shelf shows its true shape while it is filled in.
`/app/:slug` refuses any major without `available: true`, so a typed URL cannot
reach an empty page.

To publish a major, write its five content fields and add `available: true`.

This is also the shape a `GET /majors` response should return.

## Design system

Tokens live at the top of `src/index.css`.

| Token | Value | Used for |
| --- | --- | --- |
| `--purple-600` | `#412b63` | brand purple: hero, headers, primary areas |
| `--gold-500` | `#eeaf16` | accents, active states, primary CTA |
| `--white` | `#ffffff` | type on dark, light surfaces |
| `--ink` | `#0b0810` | the nav bar and footer |

The purple and gold ramps are derived from the two brand hex values, so the
palette never leaves the three specified colours. Display type is Poppins, body
type is Inter. The recurring motif is the diamond from the centre of the logo:
it appears as the `Lattice` background texture, list bullets, row markers, the
active nav indicator, and the watermark on each major card.

## The two React Bits components

Both are vendored **verbatim** under `src/components/ui/`. Brand styling is
appended below a divider comment in each CSS file rather than edited into the
component's own rules, so the upstream source stays diffable.

- **PillNav** (`gsap`) is the nav bar, configured in `components/Navbar.jsx`:
  black bar, white type, oversized purple logo disc, gold sweep on hover. Its
  `items` array is memoised because PillNav rebuilds its GSAP timelines
  whenever that prop changes identity.
- **SpecularButton** (`ogl`) drives every primary action: the gold **Get
  Started** in the hero and closing band, the auth and contact submits, and the
  section CTAs. Spread a preset from `buttonPresets.js` and override per call
  site.

**Why not every button:** SpecularButton renders one WebGL canvas each, and
browsers only keep about 16 live contexts. Dense repeated controls (the 46-card
grid, the field filters, the signup stage chips) stay as plain CSS buttons on
purpose.

## Not real yet

- **Auth** is a stand-in. `AuthContext` validates format, stores a user object
  in `localStorage`, and gates `/app`. No network calls, no password handling.
- **The contact form** validates and shows its success state without sending
  anything.
- **43 of 46 majors** have their content written but are held behind
  `available`.

Both stand-ins are the seams where a backend plugs in.

## Research

A survey of 135 students and graduates informs the roadmap. Headline findings:
81.5% would use a platform like this, 45.2% understand two or fewer majors well
enough to choose between them, only 11.1% learned about majors at school, and
23.3% of those already in a major would not choose it again. The most requested
features are career paths (54.8%), major guides (48.1%), and salary data
(45.2%). The first two are what the product already does; salary and job-market
data is the largest gap in the current model.
