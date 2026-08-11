/**
 * The Jaw, Read Properly — the second dentistry simulation, as content.
 *
 * It came from a working clinical tool: a dental charting workbench with a real
 * anatomical jaw in it, the kind a dentist fills in while the patient is in the
 * chair. That tool assumes you already know what a 46 is, what "mesial" means,
 * and why anyone would write either down. A student does not, and being handed
 * a professional instrument with no key is how a subject looks impenetrable.
 *
 * So this is the same jaw with the assumptions unpacked. The chart is still
 * here at the end, but only after the two things that make it readable: the
 * numbering, and the words for the sides of a tooth.
 *
 * WHAT IT KEEPS FROM THE ORIGINAL
 *
 * The model, which is the whole reason it is worth doing — 32 separately
 * identified teeth on a real mandible and maxilla, from BodyParts3D, each one
 * carrying its own FDI number, arch, side and type. Nothing here is a diagram
 * of a tooth; it is a scan of one.
 *
 * WHAT IT DROPS
 *
 * The case sheet, the notes, the print and PDF export, and the thousand
 * pre-rendered surface images the tool shipped to draw its charts. Those are
 * for someone doing the job. A reader deciding whether they want the job needs
 * to be able to find tooth 46 and say why it is called that.
 *
 * THE HOUSE RULES, WHICH THIS FILE KEEPS
 *
 *   No score. The chart at the end records what you noticed. It is not marked,
 *   because a first-year cannot be wrong about what a tooth looks like to them.
 *   Seeing before naming. Every term below is attached to the thing it names,
 *   and the thing is on screen first. "Mesial" arrives while you are looking at
 *   the side of a tooth that faces the middle, not in a glossary.
 *   Nothing invented. The anatomy is the model's own metadata; the clinical
 *   notes are the ordinary teaching facts of a first-year dental course.
 */

/** The upper arch, patient's right to patient's left, as it is written. */
const UPPER = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28']
/** The lower arch, the same way round. */
const LOWER = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38']

/**
 * What each kind of tooth is for, and what it is like to be one.
 *
 * Keyed by the second digit of the FDI number, which is the position in the
 * quadrant — the same key the model's own `toothType` follows.
 */
const KINDS = {
  1: {
    type: 'Central incisor',
    job: 'Cutting. A chisel with one straight edge, and the first thing anybody sees when you speak.',
    note: 'The tooth most often broken in a fall or a fight, and the reason a great deal of dentistry is cosmetic whether or not anyone admits it.',
    roots: 'One root.',
  },
  2: {
    type: 'Lateral incisor',
    job: 'Cutting, beside the central. Slightly smaller, slightly rounder.',
    note: 'The tooth most likely to be missing from birth after the wisdom teeth — it simply never forms in a few per cent of people.',
    roots: 'One root.',
  },
  3: {
    type: 'Canine',
    job: 'Tearing. The longest root in the mouth, holding a single pointed cusp.',
    note: 'The corner of the arch, and the last tooth to be lost to gum disease. If you are keeping one tooth, keep this one.',
    roots: 'One root, and the longest of them.',
  },
  4: {
    type: 'First premolar',
    job: 'Crushing. Two cusps — the name bicuspid is the same tooth.',
    note: 'Routinely removed to make room when teeth are crowded, which is why an orthodontic plan so often begins here.',
    roots: 'Usually two roots in the upper jaw, one in the lower.',
  },
  5: {
    type: 'Second premolar',
    job: 'Crushing, behind the first.',
    note: 'Another tooth that fairly often never forms.',
    roots: 'Usually one root.',
  },
  6: {
    type: 'First molar',
    job: 'Grinding. The biggest working surface in the mouth and the one that does most of the chewing.',
    note: 'It arrives at about six years old, alongside the baby teeth rather than replacing one — so it is mistaken for a milk tooth, not cleaned properly, and is the most commonly decayed tooth in the human mouth.',
    roots: 'Three roots above, two below.',
  },
  7: {
    type: 'Second molar',
    job: 'Grinding, behind the first.',
    note: 'Arrives at about twelve. Far enough back that a toothbrush reaches it badly.',
    roots: 'Three roots above, two below.',
  },
  8: {
    type: 'Third molar',
    job: 'Grinding, in theory. The wisdom tooth.',
    note: 'Arrives late or never, and often with nowhere to go — which is why removing them is one of the commonest operations in dentistry. Some people never grow them at all.',
    roots: 'Variable, and often fused or hooked.',
  },
}

export const JAW = {
  kind: 'jaw',
  slug: 'the-jaw',
  major: 'dentistry',
  title: 'The Jaw, Read Properly',
  subtitle: 'A real scanned jaw, and the two things you need before a dental chart makes any sense.',
  eyebrow: 'Dentistry · Anatomy & the language of the mouth',

  /* The model, and where it came from. Not a footnote: the licence requires the
     attribution, and the fact that this is derived from a real cadaveric data
     set rather than drawn by an artist is worth a reader knowing. */
  model: {
    source: 'BodyParts3D, The Database Center for Life Science',
    licence: 'CC BY-SA 2.1 JP',
    note: '32 teeth, the mandible, both maxillae and the gingiva — each part separately identified.',
  },

  acts: [
    { id: 'look', label: 'Look' },
    { id: 'number', label: 'The numbering' },
    { id: 'surface', label: 'The surfaces' },
    { id: 'chart', label: 'The chart' },
  ],

  arches: { upper: UPPER, lower: LOWER },
  kinds: KINDS,

  /* ------------------------------- the acts ------------------------------ */

  look: {
    title: 'Turn it over',
    lede: 'Before any of the vocabulary: this is a real jaw, and you can move it.',
    text: [
      'Drag to rotate, scroll to zoom. Tap any tooth and it lifts out of the arch so you can see the whole of it — including the root, which is most of the tooth and the part nobody ever sees.',
      'The two toggles under the model take the gingiva back and then the bone, which is the only way to see what a tooth is actually standing in. A tooth is not sitting on the jaw. It is buried in it, and held by a ligament thinner than a sheet of paper.',
    ],
    prompts: [
      'Find the biggest tooth in the mouth. It is not at the front.',
      'Turn the jaw until you are looking at it from underneath, the way a dentist does.',
      'Take the bone away and look at how much of a canine is root.',
    ],
  },

  number: {
    title: 'Why a tooth is called 46',
    lede: 'Two digits. The first is which corner of the mouth, the second is how far back.',
    text: [
      'Dentists do not say "lower left first molar", because it is four words that can be misheard and because whose left is it — yours, or the patient\'s? So every tooth has a two-digit number, and the number is always read from the patient\'s point of view.',
      'The first digit is the quadrant, counted clockwise from the patient\'s upper right as you face them. Upper right is 1, upper left is 2, lower left is 3, lower right is 4.',
      'The second digit counts outward from the midline: the front tooth is 1, and the wisdom tooth at the back is 8.',
      'So 46 is quadrant 4 — the patient\'s lower right — and the sixth tooth from the front. The first molar. The one that decays more than any other tooth in the mouth.',
    ],
    quadrants: [
      { id: 1, label: 'Upper right', range: '11–18', hint: 'The patient’s right, which is on your left as you face them.' },
      { id: 2, label: 'Upper left', range: '21–28', hint: '' },
      { id: 3, label: 'Lower left', range: '31–38', hint: '' },
      { id: 4, label: 'Lower right', range: '41–48', hint: 'Clockwise from where you started, so the bottom row runs back the other way.' },
    ],
    /* Asked as a thing to find rather than a question with a mark attached —
       the reader has the whole jaw in front of them and the numbering rule
       above it, and finding the tooth IS the understanding. */
    finds: [
      { fdi: '46', ask: 'Find 46 — the tooth in the paragraph above.' },
      { fdi: '21', ask: 'Find 21. Upper left, first from the middle.' },
      { fdi: '38', ask: 'Find 38. A wisdom tooth, and the one most likely to be in trouble.' },
    ],
  },

  surface: {
    title: 'The five faces of a tooth',
    lede: 'A tooth is not a point on a chart. Decay happens on a side, and the side has a name.',
    text: [
      'A dentist never writes "there is a hole in tooth 46". They write which face of it, because that decides whether it can be filled, how, and from which direction they have to drill.',
      'The names are all relative to the mouth rather than to the tooth, which is why they take a moment: the same face of the same tooth is called something different in the upper jaw and the lower jaw.',
    ],
    faces: [
      { id: 'mesial', label: 'Mesial', gloss: 'The side facing the midline — towards the front teeth.', where: 'Between two teeth, where a brush never reaches and floss does.' },
      { id: 'distal', label: 'Distal', gloss: 'The side facing away from the midline — towards the back.', where: 'The other contact point, and the other place decay starts unseen.' },
      {
        id: 'occlusal',
        label: 'Occlusal / Incisal',
        gloss:
          'The biting surface. A table of grooves and pits on the molars and premolars, where it is called occlusal — and a single edge on the incisors and canines, where it is called incisal.',
        where:
          'The grooves are the classic site of a first filling; the edge is what chips when somebody opens a bottle with their teeth.',
      },
      { id: 'buccal', label: 'Buccal / Labial', gloss: 'The side facing the cheek — or the lip, at the front, where it is called labial.', where: 'The face you can see in a mirror, and where a brush actually reaches.' },
      { id: 'lingual', label: 'Lingual / Palatal', gloss: 'The side facing the tongue — or, in the upper jaw, the palate.', where: 'The side almost nobody brushes properly.' },
    ],
  },

  chart: {
    title: 'Now the chart makes sense',
    lede: 'This is the instrument a dentist actually fills in, and you can now read every part of it.',
    text: [
      'Thirty-two boxes in the order the numbering puts them: upper arch on top, lower underneath, the patient’s right on your left. Mark anything you noticed on the model — this records what you saw and nothing is scored.',
      'A real chart is filled in exactly like this, in about ninety seconds, at the start of every first appointment. It is the single most-used document in the profession.',
    ],
    marks: [
      { id: 'sound', label: 'Sound', tone: 'sound', gloss: 'Nothing wrong with it.' },
      { id: 'watch', label: 'Watch', tone: 'watch', gloss: 'Something to look at again next time.' },
      { id: 'decay', label: 'Caries', tone: 'decay', gloss: 'Decay. The disease, not the hole — the hole is what it leaves.' },
      { id: 'filled', label: 'Filled', tone: 'filled', gloss: 'Already treated, and worth knowing when it was.' },
      { id: 'missing', label: 'Missing', tone: 'missing', gloss: 'Not there. Extracted, or never formed.' },
    ],
  },

  close: {
    title: 'What you just did',
    text: [
      'You read a jaw the way the first weeks of a dental degree teach you to: the anatomy first, then the naming system, then the vocabulary for the parts, and only then the instrument that uses all three.',
      'That order is the whole of it. Dentistry is a manual craft built on top of a very exact language, and the language exists because two people have to be able to describe one square millimetre of somebody’s mouth to each other without being in the room at the same time.',
    ],
    close:
      'Five years of a dentistry degree is this, at depth, with a drill in your hand — anatomy, materials, disease, and a great many hours of doing it on a plastic head before anyone lets you near a person.',
  },
}
