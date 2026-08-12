# Simulation feedback → a Google Sheet

Under every simulation, on every screen of it, two ways to answer: a rating out
of five, and a box to write whatever the reader thinks. Either on its own is
enough to send, and it is asked once per simulation per browser. There is no API
behind the site, so the answers go to a Google Apps Script Web App, which writes
them into a Sheet.

Deliberately not held back until the ending. The reader who stops half way
through is the one worth hearing from, and waiting for the last screen is
exactly how you never hear from them.

**They are published.** Underneath the form, the site shows what other students
wrote about that simulation, with the average of the ratings. Which means the
Sheet is not a private inbox any more — see "Taking one down" below before you
open this to real readers.

Nothing is collected that identifies a reader. The site knows the signed-in
email and does not send it.

> **If you deployed this script before today, redeploy it.** Two things changed
> and neither works against the old one: it rejected any submission without a
> 1–5 rating (and the page cannot read the reply, so it would thank a student
> for a paragraph that was never written down), and it had no way to hand the
> reviews back, so the site has nothing to show. Paste the script below over the
> old one and deploy a **new version** — editing the code is not enough, Apps
> Script serves whichever version you deployed.
>
> **How to tell which one is deployed.** Open the `/exec` URL in a browser with
> `?sim=the-jaw` on the end. The current script answers with JSON —
> `{"ok":true,"reviews":[…]}`. The old one answers `Majora feedback endpoint.
> POST only.`, or a Google "page not found", and either of those means no
> reviews will appear under any simulation no matter how many students have
> written one. In `npm run dev` the browser console says the same thing in
> words, once per simulation, starting `[reviews]`.

---

## 1. Make the Sheet

New Google Sheet. Name the first tab **`feedback`**. Leave it empty — the
script writes the header row itself the first time something arrives.

## 2. Add the script

In that Sheet: **Extensions → Apps Script**. Delete whatever is in `Code.gs`
and paste this:

```javascript
/**
 * Majora — simulation feedback intake.
 *
 * The site posts a JSON string with Content-Type: text/plain, which is what
 * keeps it a "simple" cross-origin request that Apps Script will actually
 * receive. That is why the body is read raw and parsed here rather than coming
 * in through e.parameter.
 */

var TAB = 'feedback';
var HEADERS = ['Received', 'Simulation', 'Title', 'Rating', 'Comment', 'Screen', 'Sent at', 'Show'];

/** Most recent reviews returned to the site, per simulation. */
var MAX_REVIEWS = 40;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
    if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(TAB);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    // Either answer on its own is a real submission: a number, some words, or
    // both. The rating used to be compulsory here and the row was dropped
    // without one — which, because the reply is opaque to the page, meant a
    // student who wrote a paragraph and pressed Send was thanked and lost.
    var rating = Number(data.rating);
    var hasRating = rating >= 1 && rating <= 5;
    var comment = String(data.comment || '').trim().slice(0, 1000);
    if (!hasRating && !comment) throw new Error('nothing to record');

    sheet.appendRow([
      new Date(),
      String(data.slug || '').slice(0, 80),
      String(data.title || '').slice(0, 200),
      hasRating ? rating : '',
      comment,
      String(data.screen || '').slice(0, 20),
      String(data.at || '').slice(0, 40),
      // Shown on the site. Set this cell to FALSE to take one down.
      true,
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * What the site reads back: the reviews for one simulation, newest first.
 *
 * Only the three fields that get published — when, the number, the words. The
 * screen size and the raw sent-at stay in the Sheet; there is no reason to hand
 * them back out to every visitor.
 */
function doGet(e) {
  try {
    var slug = (e && e.parameter && e.parameter.sim) || '';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
    var out = [];

    if (sheet && sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
      // Backwards: the newest row is the last one, and the newest reviews are
      // the ones worth the reader's attention.
      for (var i = rows.length - 1; i >= 0 && out.length < MAX_REVIEWS; i--) {
        var row = rows[i];
        // Only FALSE hides a row. Blank means shown, so rows written before
        // this column existed keep working.
        if (row[7] === false) continue;
        if (slug && String(row[1]) !== slug) continue;
        out.push({
          at: row[0] ? new Date(row[0]).toISOString() : '',
          rating: row[3] === '' || row[3] === null ? null : Number(row[3]),
          comment: String(row[4] || ''),
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, reviews: out }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy it

**Deploy → New deployment → Select type → Web app.**

| Field | Value |
| --- | --- |
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — the visitor's browser posts directly and is not signed
in to your Google account. Google will ask you to authorise the script the
first time; the warning screen is expected for a personal script.

Copy the Web app URL. It looks like:

```
https://script.google.com/macros/s/AKfycb.../exec
```

## 4. Point the site at it

Create a `.env` file in the project root (it is gitignored — the URL is not a
secret, but it does not belong in the repo either):

```
VITE_FEEDBACK_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Restart `npm run dev`. Vite only reads env files at startup.

For the deployed site, set the same variable in the host's environment
settings — it is baked in at build time, so a rebuild is needed after changing
it.

---

## Taking one down

Anything a student writes appears under that simulation as soon as the site next
loads it. There is no queue and nothing to approve, which is the right default
for a handful of readers and the wrong one the day somebody types something
vile.

The switch is the **`Show`** column, the last one in the Sheet. Set a cell to
`FALSE` and that row stops being returned; leave it alone and it is published.
Blank counts as shown, so rows written before this column existed still appear.

Two things worth knowing about the delay:

- The site holds a simulation's reviews for the rest of the browsing session, so
  a reader already on the page keeps seeing what they had. A reload clears it.
- A new review does not appear to the person who just wrote it. It is in the
  Sheet immediately; the page they are on fetched its list before they typed.

If you want a queue rather than a switch — nothing visible until you approve it
— change the default in `doPost` from `true` to `false`. The site needs no
changes for that: it only ever shows what the script hands back.

---

## What the request looks like, and why

```
POST <your web app url>
Content-Type: text/plain;charset=utf-8
mode: no-cors

{"slug":"the-jaw","title":"The Jaw, Read Properly","rating":4,
 "comment":"…","at":"2026-08-12T…","screen":"1440x900"}
```

`rating` is `null` when the reader wrote something and did not pick a number,
and `comment` is `""` when they picked a number and did not write. Both at once
is the only combination the page will not send.

Two things are doing work there, both because of the browser rather than
Google:

- **`text/plain` on a JSON body.** Any other content type makes this a
  preflighted request: the browser sends an `OPTIONS` first, Apps Script does
  not answer `OPTIONS`, and the real request never happens. `text/plain` keeps
  it simple and it goes straight out.
- **`no-cors`.** Apps Script cannot attach the header that would let the page
  read the reply, and asking to read it is exactly what gets the request
  blocked.

### It does not wait for the reply

Apps Script is slow to wake — a cold endpoint took **fifteen seconds** in
testing. Fifteen seconds of a dead "Sending…" button is how somebody decides
the site is broken, and waiting buys nothing anyway, because the reply is
opaque and tells us no more than a request still in flight.

So the reader is thanked after 2.5 seconds and the request finishes in the
background. It is sent with `keepalive`, so the browser completes it even if
they close the tab a moment later. A real failure — offline, wrong address —
rejects in well under that and is still reported honestly.

### The honest limitation

Because the reply is opaque, **the site can tell that the request left, and
never that it arrived.** The thank-you means "sent", not "saved". If rows stop
appearing in the Sheet, the page will keep saying thank you.

So: after deploying, run one real submission and check the Sheet. And if the
script is ever re-deployed, note that a new deployment can issue a **new URL** —
the old one keeps accepting posts silently or starts failing silently, and
either way the site will not notice. Use **Manage deployments → edit the
existing deployment** to keep the same URL.

If you later want confirmed delivery, the fix is a real endpoint — this repo
already has a `server/` — and then the response can be read and the form can
tell the truth about failures.
