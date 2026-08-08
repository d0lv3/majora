# Majora API

Node + Express + MongoDB. Serves the majors library, accounts, and the contact
form for the React app in the parent directory.

The React app is **not** wired to this yet — it still uses the localStorage
stand-in in `src/context/AuthContext.jsx` and imports majors straight from
`src/data/majors.js`. This server exists and works on its own; connecting the
two is a separate piece of work.

## Running it

MongoDB has to be reachable first. On Windows it usually runs as a service
already — check with `Get-Service MongoDB`.

```
cd server
npm install
cp .env.example .env      # then set JWT_SECRET
npm run seed              # loads the 46 majors into Mongo
npm run dev               # http://localhost:4000
```

`npm run dev` uses `node --watch`, so edits restart the server. `npm start` runs
it without the watcher.

### Environment

See `.env.example`. `JWT_SECRET` is the only one without a usable default —
production refuses to boot without it, development falls back to a throwaway and
warns. Generate one with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Routes

Everything is under `/api`. Errors are always `{ error, details? }`, where
`details` is keyed by field name so a form can render messages inline.

| Method | Path                | Auth | Notes                                        |
| ------ | ------------------- | ---- | -------------------------------------------- |
| GET    | `/api/health`       | –    | 503 if Mongo is unreachable                  |
| POST   | `/api/auth/signup`  | –    | `{ name, email, password, grade }` → 201     |
| POST   | `/api/auth/login`   | –    | `{ email, password }`                        |
| POST   | `/api/auth/logout`  | –    | Always succeeds                              |
| GET    | `/api/auth/me`      | ✓    | How the client rehydrates a session          |
| GET    | `/api/majors`       | –    | `?field=` `?available=` `?q=`                |
| GET    | `/api/majors/:slug` | –    | 404 on unknown slug                          |
| GET    | `/api/fields`       | –    | The 10 fields, each with a count             |
| POST   | `/api/contact`      | –    | `{ name, email, reason, message }` → 201     |

The catalogue is public on purpose. The landing page shows available majors and
field counts before anyone signs in, and a page arguing that students should
explore majors earlier should not refuse to show them any.

## Sessions

A JWT in an **httpOnly** cookie (`majora.session`), not a token the client
stores. Anything that can run a script on the page can read `localStorage`; it
cannot read an httpOnly cookie.

Two consequences for whoever wires up the front-end:

- Every request must send `credentials: 'include'`.
- The API only accepts origins listed in `CORS_ORIGIN`. Anything else gets a
  403 with no `Access-Control-Allow-Origin` header.

`requireAuth` re-reads the user from the database on each request rather than
trusting the token body, so a deleted account stops working immediately instead
of whenever its token happens to expire.

## Data

`src/data/majors.js` in the React app stays the source of truth. `npm run seed`
imports that file directly and upserts by slug, so the two cannot drift.

Re-running is safe: no duplicates, and edits to the file are pushed through.
It is not a strict no-op — Mongoose's `timestamps` bumps `updatedAt` on every
write, so a repeat run reports 46 "updated" while the content is unchanged.
Nothing is ever dropped, so a major added directly in Mongo survives a reseed.

## Not done yet

- **Contact messages are stored, not emailed.** Delivery needs an SMTP account
  and a decision about who receives them. `Message.handled` is there so they can
  be worked through, but nothing reads it yet.
- **No rate limiting.** `/api/auth/login` and `/api/contact` are both worth
  limiting before this is public.
- **No write routes for majors.** The library is read-only over HTTP; the seed
  script is the only way in.
- **No automated tests in the repo.** The API was verified with a throwaway
  smoke script covering all routes and their failure paths.
