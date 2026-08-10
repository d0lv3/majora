/**
 * The Journey of a Smile — the Year 5 orthodontics simulation, as content.
 *
 * Everything a writer would want to change lives here: what the patient says,
 * what each finding reads, what a landmark is and where it sits. What a
 * developer would want to change — how a landmark is placed, how the arch
 * responds to a click — lives in src/sim.
 *
 * THE THREE RULES THIS FILE IS WRITTEN UNDER
 *
 * They come from the specification and they shape the copy, not just the code:
 *
 *   No right or wrong. Nothing here congratulates or corrects. A choice has a
 *   consequence and the consequence is described clinically.
 *   No quiz. There is not one multiple-choice question in the file; the
 *   branching that exists is a conversation with a patient.
 *   Seeing comes before naming. Every term is defined only after the reader
 *   has looked at the thing — `overjet` is the clearest case, and its
 *   definition is deliberately unreachable until the bite has been clicked.
 *
 * THE CEPHALOMETRIC COORDINATES ARE NOT DECORATIVE
 *
 * The five landmarks sit at positions chosen so the angles measured between
 * them come out at SNA 82, SNB 76, ANB 6 — a Class II skeletal relationship,
 * which is what the dashboard reports two screens later. CephTracing measures
 * the points the reader actually placed rather than printing those numbers, so
 * moving a landmark here moves the reading. Keep them consistent.
 */

export const ORTHODONTICS = {
  slug: 'orthodontics',
  major: 'dentistry',
  title: 'The Journey of a Smile',
  subtitle: 'One patient. Multiple visits. A treatment journey.',
  eyebrow: 'Year 5 · Orthodontics',

  cover: {
    lede: 'You are entering Year 5. The patient in the chair is yours to follow, not to fix.',
    text: [
      'Orthodontics is not a single appointment. It is a relationship with one patient across months — looking, recording, planning, watching what the body does with the plan, and changing it when the body disagrees.',
      'Nothing here is a test. There are no right answers to find and nothing keeps score. You are here to see what the work is actually like.',
    ],
    action: 'Start journey',
  },

  patient: {
    name: 'Layla',
    age: 14,
    chiefConcern: 'I don’t like the way my front teeth look, and I feel like my bite isn’t right.',
    banner: 'You don’t know what’s happening yet. Start by getting to know the patient.',
  },

  /* ------------------------------ screen 03 ----------------------------- */
  interview: {
    opening: 'My front teeth don’t look straight.',
    questions: [
      { id: 1, ask: 'What bothers you the most?', reply: 'Mostly how my smile looks.' },
      {
        id: 2,
        ask: 'Do you have any difficulty biting?',
        reply: 'Sometimes I feel that my bite doesn’t come together properly.',
      },
      {
        id: 3,
        ask: 'When did you first notice this?',
        reply: 'I’ve noticed it for several years, but I never did anything about it.',
      },
    ],
    insight:
      'A consultation is not a list of measurements. What the patient came in for, what they have lived with, and what they expect to change are all part of the record — and they are the part that decides whether a finished case is judged a success by the person wearing it.',
  },

  /* ------------------------------ screen 04 ----------------------------- */
  examination: {
    banner: 'Look before you name anything. Click each area of the mouth.',
    areas: {
      upper: {
        label: 'Upper arch',
        finding: 'Upper front teeth appear positioned forward, with mild crowding.',
      },
      lower: {
        label: 'Lower arch',
        finding: 'Lower teeth are well aligned, but set back relative to the upper arch.',
      },
      front: {
        label: 'Front bite',
        finding:
          'The upper front teeth sit well ahead of the lower ones. There is a clear horizontal gap between them.',
      },
    },
    /* Named only once the front bite has been looked at. */
    term: {
      name: 'Overjet',
      definition:
        'The horizontal distance, in millimetres, between the upper and lower front teeth. You have just measured this patient’s: 7.0 mm.',
      note: 'A term you have seen before you were given the word for it is a term you keep.',
    },
  },

  /* ------------------------------ screen 05 ----------------------------- */
  question: {
    patient: 'So… do I need braces?',
    warning:
      'You still don’t have enough information to plan treatment. Before deciding what should happen, you need a clearer picture of the patient’s teeth and jaw relationships.',
    prompt: 'Records are how you get that picture. Collect what you need.',
  },

  /* ---------------------------- screens 06-09 --------------------------- */
  records: [
    {
      id: 'photos',
      screen: 6,
      label: 'Photographs',
      blurb: 'Extraoral profile, intraoral frontal, arch views.',
      lesson:
        'Photographs document where the patient started and let you compare against it later. In eighteen months, memory is not evidence.',
    },
    {
      id: 'models',
      screen: 7,
      label: 'Dental models',
      blurb: 'Study casts you can turn in your hands.',
      lesson:
        'A model gives you another way to understand the three-dimensional relationship between the teeth without relying on looking into a mouth.',
    },
    {
      id: 'xray',
      screen: 8,
      label: 'X-ray',
      blurb: 'Lateral cephalometric radiograph.',
      lesson:
        'Some information cannot be understood by looking at teeth from the outside. Imaging is what shows you bone and jaw position.',
    },
    {
      id: 'ceph',
      screen: 9,
      label: 'Cephalometric tracing',
      blurb: 'Landmarks, lines and angles on the radiograph.',
      lesson:
        'The radiograph is a picture until it is traced. Tracing turns it into measurements you can plan against.',
    },
  ],

  photographs: [
    { id: 'profile', label: 'Extraoral profile', note: 'Convex profile; lower lip trapped behind the upper incisors.' },
    { id: 'frontal', label: 'Intraoral frontal', note: 'Upper incisors ahead of the lower; mild rotation on the upper left.' },
    { id: 'upper', label: 'Upper arch', note: 'Mild crowding across the anterior segment.' },
    { id: 'lower', label: 'Lower arch', note: 'Well aligned, sound contacts.' },
  ],

  /* ------------------------------ screen 09 ----------------------------- */
  ceph: {
    banner: 'Place each landmark in turn. The ring shows you where to look.',
    landmarks: [
      {
        id: 'S',
        name: 'Sella',
        abbr: 'S',
        where: 'The centre of the sella turcica — the saddle of bone in the skull base.',
        x: 150,
        y: 160,
      },
      {
        id: 'N',
        name: 'Nasion',
        abbr: 'N',
        where: 'The most anterior point of the frontonasal suture, where the nose meets the forehead.',
        x: 270,
        y: 140,
      },
      {
        id: 'A',
        name: 'Subspinale',
        abbr: 'A',
        where: 'The deepest point on the concavity of the upper jaw, below the nasal spine.',
        x: 272,
        y: 225,
      },
      {
        id: 'B',
        name: 'Supramentale',
        abbr: 'B',
        where: 'The deepest point on the concavity of the lower jaw, above the chin.',
        x: 259,
        y: 275,
      },
      {
        id: 'Me',
        name: 'Menton',
        abbr: 'Me',
        where: 'The lowest point on the bony chin.',
        x: 252,
        y: 322,
      },
    ],
    nudge: 'Not there yet — the ring is where this one sits. Click inside it.',
    completion:
      'You just completed a simplified cephalometric tracing. This is one of the ways orthodontic records can be analysed when planning treatment.',
    reading: {
      /* What the measured angles mean, chosen by ANB. */
      classI: 'The jaws sit in balance with each other.',
      classII: 'The upper jaw sits ahead of the lower. This is a Class II skeletal relationship — and it is why the overjet you measured is 7 mm rather than 2.',
      classIII: 'The lower jaw sits ahead of the upper.',
    },
  },

  /* ------------------------------ screen 11 ----------------------------- */
  goals: [
    {
      id: 'alignment',
      label: 'Alignment',
      short: 'Straighten the crowded incisors.',
      text: 'The crowding is mild and anterior. Levelling and aligning the arch is the first mechanical job, and the one the patient will notice first.',
    },
    {
      id: 'bite',
      label: 'Bite',
      short: 'Correct the overjet and how the teeth meet.',
      text: 'Reducing 7 mm of overjet is not the same as straightening teeth. It asks how the arches relate to each other, which is a skeletal question as much as a dental one.',
    },
    {
      id: 'function',
      label: 'Function',
      short: 'Chewing and joint function.',
      text: 'A bite that looks corrected but loads the joint badly is not corrected. Function is judged over years, not at the debond appointment.',
    },
    {
      id: 'appearance',
      label: 'Appearance',
      short: 'The complaint the patient actually arrived with.',
      text: 'This is the goal the patient stated in the first two minutes. It is not the least important one — it is the one they will measure you against.',
    },
    {
      id: 'stability',
      label: 'Long-term stability',
      short: 'Hold the corrected bite afterwards.',
      text: 'Teeth move back. Retention is part of the treatment plan, not an afterthought once the appliance comes off.',
    },
  ],

  /* ------------------------------ screen 12 ----------------------------- */
  timeline: [
    {
      id: 'assessment',
      label: 'Initial assessment',
      note: 'Everything you have done so far: the conversation, the examination, the records and the analysis.',
    },
    {
      id: 'start',
      label: 'Treatment start',
      note: 'The appliance goes on. From here the biology does the work and you are monitoring it.',
    },
    {
      id: 'followup',
      label: 'Follow-up',
      note: 'Regular visits measuring what actually moved against what you expected to move.',
    },
    {
      id: 'adjustment',
      label: 'Adjustment',
      note: 'Where the plan meets a body that has its own opinion. Almost every case has one of these.',
    },
    {
      id: 'evaluation',
      label: 'Final evaluation',
      note: 'Comparing the finish against the records you took on day one — and planning retention.',
    },
  ],

  /* ------------------------------ screen 13 ----------------------------- */
  start: {
    message:
      'The treatment plan has been started. The patient now begins their orthodontic journey. This is not the end of treatment — it is the start of a biological process you will monitor over time.',
  },

  /* ---------------------------- screens 14-15 --------------------------- */
  monthThree: {
    patient: 'I feel like my teeth are changing, but I’m not sure if everything is going as planned.',
    observations: [
      'The upper incisors have begun to retract; the midline is holding.',
      'Lower arch is levelling as expected.',
      'Slight rotation remains on the upper left lateral incisor.',
    ],
  },

  /* ---------------------------- screens 16-17 --------------------------- */
  cooperation: {
    patient:
      'I haven’t always followed the instructions about the elastic bands. Sometimes I forget, and sometimes they just hurt.',
    options: [
      {
        id: 'listen',
        label: 'Listen and ask why',
        level: 'high',
        consequence:
          'She tells you the elastics catch on the bracket at the back and ache for the first hour after school. You change the hook configuration and agree she will put them in before dinner instead. Wear improves because the obstacle was real and you removed it.',
      },
      {
        id: 'explain',
        label: 'Explain why they matter',
        level: 'moderate',
        consequence:
          'She now understands what the elastics are for and wears them more often than she did. The discomfort you did not ask about is still there, so some days are still missed.',
      },
      {
        id: 'ignore',
        label: 'Repeat the instruction',
        level: 'low',
        consequence:
          'The instruction is restated and the appointment moves on. Nothing about her day has changed, so neither does the wear. The correction continues, but slower than the plan assumed.',
      },
    ],
    note: 'Cooperation is not a personality trait you are assigned. It is a clinical variable you can influence — and how you handle this conversation is the influence.',
  },

  /* ------------------------------ screen 18 ----------------------------- */
  months: [
    { month: 0, overjet: 7.0, note: 'Before treatment. The overjet you measured yourself.' },
    { month: 3, overjet: 5.2, note: 'Initial alignment. The incisors have started to come back.' },
    { month: 9, overjet: 3.1, note: 'Space closing; the bite is beginning to meet.' },
    { month: 18, overjet: 2.0, note: 'Within a normal range. Retention planning starts here.' },
  ],

  /* ---------------------------- screens 19-20 --------------------------- */
  adaptation: {
    situation:
      'At month 12 the upper left lateral incisor has stopped rotating. The rest of the arch is moving; this one tooth is not.',
    guidance: 'You need to investigate before changing the plan.',
    investigations: [
      {
        id: 'contact',
        label: 'Check the contact points',
        finding: 'The adjacent teeth are touching tightly. There is no room for the tooth to turn into.',
        useful: true,
      },
      {
        id: 'wire',
        label: 'Check the archwire',
        finding: 'The wire is fully engaged and undeformed. It is delivering what it was chosen to deliver.',
        useful: true,
      },
      {
        id: 'hygiene',
        label: 'Check oral hygiene',
        finding: 'Hygiene is good and the tissues are healthy. Nothing here explains a stalled rotation.',
        useful: false,
      },
    ],
    resolution: {
      label: 'Change the wire and the tie',
      text: 'A rotation needs a couple of forces acting in opposite directions, and it needs somewhere to rotate into. You place a rotation wedge on the tie and step down to a wire that can express it, having first opened the contact.',
    },
    lesson:
      'The plan was not wrong. A plan is a prediction, and this is what it looks like when a prediction meets one tooth that will not do what the others did.',
  },

  /* ------------------------------ screen 21 ----------------------------- */
  evaluation: {
    before: {
      label: 'Before',
      overjet: '7.0 mm',
      points: ['Increased overjet', 'Mild anterior crowding', 'Lower lip trapped behind the upper incisors'],
    },
    after: {
      label: 'After',
      overjet: '2.0 mm',
      points: ['Overjet within a normal range', 'Aligned anterior segment', 'Lips competent at rest'],
    },
    byCooperation: {
      high: 'Eighteen months, close to the original estimate. The elastic problem was solved early enough that it never cost time.',
      moderate: 'Nineteen months. The missed elastic days added a little, which is a normal amount of slippage for a real case.',
      low: 'Twenty-two months. The correction arrived, but four months later than planned — the ordinary cost of an obstacle nobody asked about.',
      none: 'Eighteen months from bonding to debond.',
    },
  },

  /* ------------------------------ screen 22 ----------------------------- */
  recap: {
    statement: 'You experienced the entire orthodontic lifecycle.',
    steps: [
      'Listening',
      'Examination',
      'Data collection',
      'Analysis',
      'Planning',
      'Monitoring',
      'Adaptation',
      'Final evaluation',
    ],
    text: 'Not one of those steps was a question with a correct answer. All of them were a decision with a consequence, which is what the work is.',
  },

  /* ------------------------------ screen 23 ----------------------------- */
  discovery: [
    {
      id: 'ortho',
      term: 'Orthodontics',
      text: 'The branch of dentistry that manages the relationship between teeth and jaws — where they sit, how they meet, and how to move them.',
    },
    {
      id: 'records',
      term: 'Records',
      text: 'Photographs, models and radiographs. Taken before anything is done, because everything afterwards is measured against them.',
    },
    {
      id: 'ceph',
      term: 'Cephalometric tracing',
      text: 'Landmarks placed on a lateral radiograph and the angles measured between them. It is how a skeletal relationship is described rather than guessed.',
    },
    {
      id: 'cooperation',
      term: 'Patient cooperation',
      text: 'The variable that decides whether a good plan becomes a good outcome — and the one most open to how you talk to someone.',
    },
  ],

  /* ------------------------------ screen 24 ----------------------------- */
  closing: {
    title: 'Your orthodontic journey is complete',
    text: [
      'You met a patient who did not like her front teeth, and you finished with a bite that meets, a profile that closes at rest, and a retention plan.',
      'Between those two things there was no single moment where the case was solved. There was planning, observing and adapting, repeated across eighteen months — which is what orthodontics is.',
    ],
  },

  /* ------------------------------ screen 25 ----------------------------- */
  roadmap: [
    { year: 'Year 1', label: 'Biological foundations' },
    { year: 'Year 2', label: 'Dental biomaterials' },
    { year: 'Year 3', label: 'Preclinical & clinical fundamentals' },
    { year: 'Year 4', label: 'General clinical case management' },
    {
      year: 'Year 5',
      label: 'Specialised care & orthodontic case lifecycles',
      done: true,
    },
  ],
}
