# Simulation feedback → a Google Sheet

One question at the end of every simulation: a rating out of five and an
optional note. There is no API behind the site, so the answers go to a Google
Apps Script Web App, which writes them into a Sheet.

Nothing is collected that identifies a reader. The site knows the signed-in
email and does not send it.

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
var HEADERS = ['Received', 'Simulation', 'Title', 'Rating', 'Comment', 'Screen', 'Sent at'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
    if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(TAB);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    var rating = Number(data.rating);
    if (!(rating >= 1 && rating <= 5)) throw new Error('rating out of range');

    sheet.appendRow([
      new Date(),
      String(data.slug || '').slice(0, 80),
      String(data.title || '').slice(0, 200),
      rating,
      String(data.comment || '').slice(0, 1000),
      String(data.screen || '').slice(0, 20),
      String(data.at || '').slice(0, 40),
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** So that opening the URL in a browser says something rather than erroring. */
function doGet() {
  return ContentService.createTextOutput('Majora feedback endpoint. POST only.');
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

## What the request looks like, and why

```
POST <your web app url>
Content-Type: text/plain;charset=utf-8
mode: no-cors

{"slug":"the-jaw","title":"The Jaw, Read Properly","rating":4,
 "comment":"…","at":"2026-08-12T…","screen":"1440x900"}
```

Two things are doing work there, both because of the browser rather than
Google:

- **`text/plain` on a JSON body.** Any other content type makes this a
  preflighted request: the browser sends an `OPTIONS` first, Apps Script does
  not answer `OPTIONS`, and the real request never happens. `text/plain` keeps
  it simple and it goes straight out.
- **`no-cors`.** Apps Script cannot attach the header that would let the page
  read the reply, and asking to read it is exactly what gets the request
  blocked.

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
