/**
 * The Way In — the cybersecurity simulation, as content.
 *
 * The third simulation on the site and the third kind. The orthodontics case is
 * a clinic: one path, twenty-five screens. Macbeth is a text: a scene graph
 * that bends. This one is a network, and a network is neither — it is a place
 * you poke at. So the shape is a console: one map that stays on screen from the
 * first minute to the last, and a phase that changes what you are doing to it.
 *
 * WHY THE SAME NETWORK TWICE
 *
 * Because that is the sentence already printed on the cybersecurity page:
 * "Sometimes you need to think like an attacker to understand how a system
 * could be compromised, and then think like a defender to protect it." The
 * simulation is that sentence, in order. You find the way in, and then you are
 * handed the same map and told to stop yourself.
 *
 * NOTHING HERE IS A TECHNIQUE
 *
 * Every step is an assumption somebody made, not a tool somebody ran. There is
 * no command in this file and nothing a reader could carry out of it — the
 * three ways in are an admin page left facing the internet, a password sent
 * across a wire in the clear, and a database that trusts whoever is already
 * inside. Those are the first three things any security course teaches, for
 * the same reason: they are what actually goes wrong, and understanding them
 * is entirely a defensive skill.
 *
 * THE HOUSE RULES, WHICH THIS FILE KEEPS
 *
 *   No right or wrong. The hardening phase cannot be won. You are given four
 *   fixes and the budget for two, every pair leaves something open, and the
 *   replay reports what happened rather than scoring it.
 *   No quiz. You inspect, you notice, you act. The one place with a correct
 *   answer is the log hunt, and it is correct the way arithmetic is: those
 *   lines are your own footprints and you made them ten minutes ago.
 *   Seeing before naming. Every term below is attached to a `namedAfter`
 *   moment. "Lateral movement" is two words for something the reader has
 *   already done twice by the time they read them.
 */

export const BREACH = {
  kind: 'network',
  slug: 'the-way-in',
  major: 'cybersecurity',
  title: 'The Way In',
  subtitle: 'One network, seen twice — as the attacker, then as the person who has to stop them.',
  eyebrow: 'Cybersecurity · Networks, cryptography & investigation',

  company: {
    name: 'Zagros Freight',
    blurb:
      'A shipping company in Erbil. Forty staff, one website, one database with every customer’s name, address and consignment on it.',
  },

  acts: [
    { id: 'recon', label: 'Look' },
    { id: 'entry', label: 'Get in' },
    { id: 'move', label: 'Move' },
    { id: 'turn', label: 'The turn' },
    { id: 'hunt', label: 'Investigate' },
    { id: 'harden', label: 'Defend' },
    { id: 'replay', label: 'Replay' },
  ],

  /* ------------------------------ the network ------------------------------
   * x/y are percentages of the map, so the drawing scales with the panel and
   * a phone gets the same topology rather than a squashed one. */
  nodes: [
    {
      id: 'you',
      label: 'You',
      sub: 'Somewhere on the internet',
      kind: 'you',
      x: 10,
      y: 50,
    },
    {
      id: 'web',
      label: 'Public website',
      sub: 'zagrosfreight.iq',
      kind: 'server',
      x: 33,
      y: 50,
    },
    {
      id: 'office',
      label: 'Office network',
      sub: 'Everything inside the building',
      kind: 'network',
      x: 56,
      y: 50,
    },
    {
      id: 'admin',
      label: 'IT laptop',
      sub: 'Kawa, who runs the systems',
      kind: 'laptop',
      x: 76,
      y: 22,
    },
    {
      id: 'files',
      label: 'File server',
      sub: 'Shared drives and the nightly backup',
      kind: 'server',
      x: 76,
      y: 78,
    },
    {
      id: 'db',
      label: 'Shipment records',
      sub: 'Every customer, every consignment',
      kind: 'database',
      x: 92,
      y: 50,
      prize: true,
    },
  ],

  links: [
    ['you', 'web'],
    ['web', 'office'],
    ['office', 'admin'],
    ['office', 'files'],
    ['office', 'db'],
  ],

  /* ------------------------------ observations -----------------------------
   * What a node tells you when you look at it. `after` gates a line behind a
   * step of the chain, so the network opens up as you move through it rather
   * than handing you everything on the first click — and so the reader never
   * sees a detail they could not yet have learned. */
  observations: {
    you: [
      {
        id: 'outside',
        text: 'You are outside the building, on the same internet as everybody else. From here exactly one thing belonging to Zagros Freight answers you: their website.',
        note: 'Everything else on this map you are guessing at. It is there because companies have those things, not because you can see it.',
      },
    ],
    web: [
      {
        id: 'admin-page',
        text: 'There is an /admin page, and it answers from the internet. Anyone who types the address gets a login box.',
        note: 'Nobody advertised this address. Nobody hid it either.',
      },
      {
        id: 'setup-guide',
        text: 'The software vendor’s setup guide is still sitting in the site’s docs folder, where it was left during installation. Page four lists the login the software ships with.',
        note: 'It was going to be changed before launch. Launch was in 2021.',
      },
      {
        id: 'plain-http',
        text: 'From inside, the admin page is served over plain HTTP. Whatever is typed into it crosses the office network as text.',
        after: 'in',
      },
    ],
    office: [
      {
        id: 'flat',
        text: 'Nothing inside the building is separated from anything else. The printer, the laptops, the file server and the records database all sit on one network — and so, it turns out, does the web server you just took.',
        after: 'in',
      },
      {
        id: 'morning-login',
        text: 'Every morning at about eight, one machine signs in to that admin page from inside the building.',
        after: 'in',
      },
      {
        id: 'kawa',
        text: 'The machine that signs in every morning belongs to Kawa, who administers all of it.',
        after: 'in',
      },
    ],
    files: [
      {
        id: 'backup',
        text: 'The nightly backup of the records database is here, and it is encrypted. The file is readable. The contents are not.',
        after: 'in',
        note: 'You can take this. It will not tell you anything.',
      },
    ],
    admin: [
      {
        id: 'mgmt',
        text: 'Kawa’s laptop sits on the management network, and the records database answers only to machines on it. From his laptop, it is one hop away.',
        after: 'listen',
      },
    ],
    db: [
      {
        id: 'no-auth',
        text: 'The records database accepts a connection from the management network and asks for nothing at all.',
        after: 'listen',
        note: 'It was set up that way so the nightly reporting job would not need a password.',
      },
    ],
  },

  /* ------------------------------- the chain -------------------------------
   * Three steps, each unlocked by what the reader noticed rather than by
   * arriving at a screen. `owns` is the one node the step actually gives you;
   * `opens` is everything it puts within reach, which is how the map grows.
   * They are not the same and the map draws them differently — taking the web
   * server makes the file server reachable, and reachable is not yours.
   * `assumption` is the point of the whole simulation. */
  steps: [
    {
      id: 'in',
      at: 'web',
      needs: ['admin-page', 'setup-guide'],
      label: 'Sign in to the admin page with the login from the guide',
      result:
        'It works, first try. You are administering the company website — and the machine it runs on is sitting on the office network with everything else.',
      assumption: 'Nobody will find the address, and we will change the password before launch.',
      owns: 'web',
      opens: ['office', 'files'],
      act: 'entry',
    },
    {
      id: 'listen',
      at: 'office',
      needs: ['plain-http', 'morning-login', 'kawa'],
      label: 'Wait for the morning, and read what crosses the wire',
      result:
        'At 08:12 Kawa signs in. Because the page is plain HTTP, his password crosses the network as text, and you are on the network. It is not the login from the guide — it is his own, the one he uses everywhere.',
      assumption: 'It is only the office network. Nobody is listening inside the building.',
      owns: 'admin',
      opens: ['admin', 'db'],
      act: 'move',
    },
    {
      id: 'take',
      at: 'db',
      needs: ['no-auth', 'mgmt'],
      label: 'Open a connection to the records database',
      result:
        'It does not ask who you are. Forty thousand consignments, every name and address attached to them.',
      assumption: 'If you are already inside, you are allowed.',
      owns: 'db',
      opens: [],
      act: 'move',
      ends: true,
    },
  ],

  /* Named only once the reader has done the thing. */
  terms: [
    {
      id: 'surface',
      term: 'Attack surface',
      after: 'in',
      text: 'Everything of yours that answers a stranger. The website was meant to be the surface. The admin page was on it by accident, and an accident on the surface is the whole of the surface.',
    },
    {
      id: 'crypto',
      term: 'Encryption in transit',
      after: 'listen',
      text: 'What TLS — the s in https — is for. Not secrecy for its own sake: it makes a password unreadable to everyone between the two ends, including everyone else in the building. You just did the thing it exists to stop, and you needed no tool to do it, only to be on the same network.',
    },
    {
      id: 'atrest',
      term: 'Encryption at rest',
      after: 'listen',
      text: 'The same idea applied to a file sitting still. It is why the backup on the file server was worth nothing to you: you had the file and not the key. Encryption is not the good side’s tool. It is a lock, and it works for whoever holds the key.',
    },
    {
      id: 'lateral',
      term: 'Lateral movement',
      after: 'take',
      text: 'Getting in somewhere unimportant and walking to somewhere that matters. You entered through a website that stores nothing and left with the customer database, and every step between the two was allowed.',
    },
    {
      id: 'trust',
      term: 'Implicit trust',
      after: 'take',
      text: 'A network where being inside is treated as being authorised. It is the assumption under the last step, and it is the one that turns a small mistake at the edge into all of it.',
    },
  ],

  /* -------------------------------- the turn ------------------------------ */
  turn: {
    title: 'Now stop yourself',
    lede: 'Same building. Same forty staff. Same map — except now it is yours to defend.',
    text: [
      'You got from the open internet to every customer record in three steps, and not one of them was clever. Each was an assumption somebody made for a good reason on a busy day.',
      'That is the job, and it is why the degree spends four years on it. What follows is the other half: find out what you did, decide what to fix, and discover that you cannot fix all of it.',
    ],
  },

  /* ------------------------------ the log hunt ----------------------------
   * The one place with a right answer, and it is right the way arithmetic is:
   * these are the reader's own footprints, made ten minutes ago. */
  hunt: {
    title: 'Find your own footprints',
    lede: 'Last night’s log, from the machines you touched. Three of these lines are you.',
    note: 'Every one of them was written at the time. Nobody read them.',
    lines: [
      { id: 1, at: '02:47', src: 'website', text: 'Admin sign-in succeeded — %EXT% (first sign-in from this address)', mine: true },
      { id: 2, at: '03:02', src: 'file server', text: 'Nightly backup completed, 4.2 GB written', mine: false },
      { id: 3, at: '03:09', src: 'website', text: 'Configuration read by admin session', mine: true },
      { id: 4, at: '06:30', src: 'office', text: 'Printer offline — out of paper', mine: false },
      { id: 5, at: '08:12', src: 'website', text: 'Admin sign-in succeeded — kawa (workstation KWA-01)', mine: false },
      { id: 6, at: '08:44', src: 'records db', text: 'Connection accepted from 10.0.4.19 — no credentials presented', mine: true },
      { id: 7, at: '09:01', src: 'office', text: 'Guest wifi: 3 devices joined', mine: false },
      { id: 8, at: '09:15', src: 'file server', text: 'Backup archive read by KWA-01', mine: false },
    ],
    resolution:
      'Three lines, on three different machines, none of them wrong on its own. The sign-in at 02:47 was the only one that was strange by itself — a first-ever sign-in from an address nobody knew, at three in the morning — and it sat in a file nobody opens.',
  },

  /* ------------------------------ the fixes ------------------------------
   * Four, and the budget for two. Each `blocks` a step of an attack path;
   * `detects` shortens the time to find out. Every pair leaves something. */
  budget: 2,
  fixes: [
    {
      id: 'vpn',
      label: 'Take the admin page off the internet',
      detail: 'It answers only from inside, or through a VPN.',
      blocks: ['in'],
      cost: 'The agency that updates the website loses its access. They need accounts, a VPN and an afternoon of training, and they will complain for a month.',
    },
    {
      id: 'tls',
      label: 'Encrypt the wire, and stop reusing that password',
      detail: 'TLS everywhere inside the building, and a password manager so Kawa’s login is his alone.',
      blocks: ['listen', 'phish-move'],
      cost: 'Certificates to buy and remember to renew. One label printer is too old to speak TLS and has to be replaced.',
    },
    {
      id: 'auth',
      label: 'Make the database ask who you are',
      detail: 'No connection without a credential, wherever it comes from.',
      blocks: ['take', 'phish-take'],
      cost: 'The nightly reporting job connects with no password and will stop working the moment this lands. Finance loses Monday’s report until someone rewrites it.',
    },
    {
      id: 'watch',
      label: 'Have somebody read the logs',
      detail: 'An alert on anything that has never happened before — a new sign-in address, a first-time connection.',
      blocks: [],
      detects: true,
      cost: 'Someone’s morning, every morning. And it prevents nothing: it only means you find out in hours instead of the eleven months these things usually take.',
    },
  ],

  /* ------------------------------- the replay -----------------------------
   * Two paths, because a network is not a corridor. The first is the reader's
   * own. The second is the one that exists whatever they do to the wiring:
   * somebody phones the office. */
  paths: [
    {
      id: 'yours',
      label: 'Your way in',
      steps: [
        { id: 'in', text: 'Sign in to the admin page from the internet' },
        { id: 'listen', text: 'Read Kawa’s password off the wire' },
        { id: 'take', text: 'Open the records database' },
      ],
    },
    {
      id: 'phone',
      label: 'The way in that has nothing to do with the wiring',
      intro:
        'An attacker who cannot reach the admin page phones the office and asks someone to open a document.',
      steps: [
        { id: 'phish', text: 'Someone in accounts opens the attachment', unblockable: true },
        { id: 'phish-move', text: 'The same password gets them to the file server' },
        { id: 'phish-take', text: 'The database asks them nothing either' },
      ],
    },
  ],

  outcomes: {
    stopped: 'stopped here',
    through: 'still works',
    /* Four endings rather than two clauses bolted together. "Stopped, and
       nobody was watching" reads as a complaint about a good outcome; the
       point is subtler and worth its own sentence — you held the door and you
       would never know anybody tried it. */
    ends: {
      throughSeen: 'The records went out the door — and somebody saw it happen the same morning.',
      throughUnseen:
        'The records went out the door, and nothing on this network would have told anyone for months.',
      stoppedSeen: 'Stopped before the records, and you would know somebody had tried.',
      stoppedUnseen:
        'Stopped before the records — though nobody would ever know it had been tried.',
    },
  },

  debrief: {
    title: 'What you are left with',
    text: [
      'You had four fixes and the budget for two, which is the most realistic thing in this simulation. There is no arrangement of them that closes everything, and there was never going to be.',
      'The second path is the reason. You can take the admin page off the internet, encrypt every wire in the building and put a password on the database, and someone can still telephone the office and be helpful to. That is not a hole in the network. It is a person doing their job, and it is why the work has an investigation half at all: some of it you prevent, and the rest you find out about.',
    ],
    close:
      'Four years of a cybersecurity degree is mostly this, at greater depth: how systems talk, what protects them, and how to find out what happened when something got through anyway.',
  },
}
