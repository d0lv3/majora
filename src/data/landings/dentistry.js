/**
 * The dentistry write-up, as structured blocks rather than a markdown string.
 *
 * Same reasoning as the guides and the cybersecurity landing: the source was a
 * markdown document, and shipping it as one would mean a parser in the bundle
 * and every year, every term list and every arrow chain coming out as whatever
 * the parser's default happened to be.
 *
 * WHAT MOVED, AND WHY
 *
 * The source runs the five years as five headings of their own. They are one
 * section here, built from the `years` block the English guide already had —
 * the contents rail lists sections, and five entries reading "Year 1", "Year
 * 2" and so on would have been half the rail saying the same word.
 *
 * The source's emoji are gone. Nothing else on this site labels a heading with
 * one, and the gold numerals and diamonds already do that job.
 *
 * The "5 Years · Health & Medicine" line is gone too: the head of the page
 * states the length and the field a few centimetres above where it would sit.
 *
 * The years are told twice on purpose, once as cards and once as the
 * five-step recap, because the source tells them twice and the recap is the
 * part a reader deciding between majors will actually keep.
 */

export const DENTISTRY_LANDING = {
  sections: [
    /* ----------------------------- overview ----------------------------- */
    {
      id: 'overview',
      title: 'More than teeth',
      blocks: [
        {
          type: 'lede',
          text: 'Dentistry focuses on the mouth, teeth, jaws, and surrounding oral and facial structures.',
        },
        {
          type: 'text',
          text: 'It involves preventing, diagnosing, and treating conditions affecting these areas, while helping patients maintain **health, function, and appearance**.',
        },
        {
          type: 'text',
          text: 'Dentistry combines **medical science, clinical thinking, hands-on skills, and patient care**.',
        },
      ],
    },

    /* ------------------------- the clinical loop ------------------------ */
    {
      id: 'process',
      title: 'What does a dentist do?',
      blocks: [
        {
          type: 'text',
          text: 'Dentistry is more than treating a tooth. A dentist works through a clinical process:',
        },
        { type: 'flow', steps: ['Assess', 'Diagnose', 'Plan', 'Treat', 'Evaluate'] },
        {
          type: 'defs',
          items: [
            {
              term: 'Assess',
              text: 'Listen to the patient, take a history, and examine the mouth and surrounding structures.',
            },
            { term: 'Diagnose', text: 'Analyze the findings to identify the problem.' },
            {
              term: 'Plan',
              text: 'Choose an appropriate treatment based on the patient’s condition.',
            },
            {
              term: 'Treat',
              text: 'Perform procedures to treat disease and restore oral health and function.',
            },
            {
              term: 'Evaluate',
              text: 'Follow up, assess the result, and manage any further needs.',
            },
          ],
        },
      ],
    },

    /* ---------------------------- five years ---------------------------- */
    {
      id: 'study',
      title: 'What will you study?',
      blocks: [
        {
          type: 'text',
          text: 'The five years gradually move from **foundations and practical training to clinical practice**.',
        },
        {
          type: 'defs',
          items: [
            {
              term: 'Years 1–3',
              text: 'You combine **theoretical study with practical training**, building your scientific knowledge and hands-on skills.',
            },
            {
              term: 'Years 4–5',
              text: 'The focus shifts to **clinical training with real patients**, where you apply what you have learned to actual cases.',
            },
          ],
        },
        {
          type: 'years',
          studyLabel: 'You study',
          practiceLabel: 'You do',
          /* Procedures, not a sequence: you might perform any of them in any
             order, so they are listed rather than chained. */
          practiceAs: 'list',
          items: [
            {
              n: 'Year 1',
              title: 'Build the foundations',
              intro:
                'You start with the basic sciences needed to understand the human body and dentistry.',
              study: [
                'Anatomy',
                'Dental Anatomy',
                'Medical Chemistry',
                'Medical Physics',
                'Biology',
                'Microbiology',
              ],
              practice: [
                'Identify teeth',
                'Understand dental anatomy',
                'Study the skull',
                '**Carve teeth**',
              ],
              purpose:
                'You start by learning what you are looking at — and building your first practical dental skills.',
            },
            {
              n: 'Year 2',
              title: 'Build with your hands',
              intro:
                'You continue combining theory with practical work while moving closer to dental applications.',
              study: [
                'Anatomy',
                'Prosthodontics',
                'Dental Materials',
                'Histology',
                'Oral Histology',
                'Physiology',
              ],
              practice: ['Dental materials', 'Impressions', 'Wax', 'Acrylic', 'Prosthetic work'],
              purpose:
                'You start turning what you learn into things you can **build and handle yourself**. Knowledge starts becoming a physical skill.',
            },
            {
              n: 'Year 3',
              title: 'Apply what you know',
              intro:
                'You move further toward clinical dentistry while still combining theory and practical training.',
              studyLabel: 'You study areas such as',
              study: [
                'Radiology',
                'Operative Dentistry',
                'Fixed & Removable Prosthodontics',
                'Oral Surgery',
                'Pathology',
                'Pharmacology',
              ],
              practice: [
                '**Dental X-rays**',
                '**Phantom work**',
                'Restorative procedures',
                'Tooth preparation for procedures such as crowns and veneers',
                'Prosthetic work, including partial dentures',
              ],
              purpose:
                'You start connecting what you learned in the classroom to clinical problems.',
            },
            {
              n: 'Year 4',
              title: 'Treat real patients',
              intro:
                'Year 4 is a major shift into **clinical training with real patients**. Which procedures you perform depends on your clinical training.',
              studyLabel: 'You work across',
              study: [
                'Periodontics',
                'Operative Dentistry',
                'Endodontics',
                'Oral Surgery',
                'Prosthodontics',
              ],
              practiceLabel: 'You begin performing',
              practice: [
                'Restorations and fillings',
                'Root canal treatment',
                'Tooth extractions',
                'Periodontal procedures',
                'Removable prosthodontic treatment',
              ],
              purpose:
                'You are no longer only practicing a procedure — you are learning to provide care to a real patient.',
            },
            {
              n: 'Year 5',
              title: 'Manage the patient',
              intro:
                'Year 5 continues **clinical training with real patients**, while exposing you to a wider range of dental specialties. You also complete a **research project**.',
              studyLabel: 'You work across',
              study: [
                'Orthodontics',
                'Pedodontics',
                'Oral Surgery',
                'Prosthodontics',
                'Operative Dentistry',
                'Periodontics',
                'Oral Medicine',
              ],
              /* This one is a sequence — it is the clinical loop from the top
                 of the document, now run start to finish by the student. */
              practiceAs: 'flow',
              practiceLabel: 'You bring it together to',
              practice: ['Assess', 'Diagnose', 'Plan', 'Treat', 'Evaluate'],
              purpose:
                'You start seeing the patient as a whole rather than as a single tooth.',
            },
          ],
        },
      ],
    },

    /* ----------------------------- the arc ------------------------------ */
    {
      id: 'journey',
      title: 'Your five-year journey',
      lead: 'The same five years, as the five things you are being asked to do.',
      blocks: [
        {
          type: 'defs',
          items: [
            {
              term: 'Year 1 — Understand',
              text: 'Learn the foundations and start developing practical skills.',
            },
            {
              term: 'Year 2 — Build',
              text: 'Turn your knowledge into practical and laboratory skills.',
            },
            {
              term: 'Year 3 — Apply',
              text: 'Connect science and practical training to clinical problems.',
            },
            {
              term: 'Year 4 — Treat',
              text: 'Apply your skills to **real patients in clinical settings**.',
            },
            {
              term: 'Year 5 — Manage',
              text: 'Work with a wider range of cases and connect different areas of dentistry.',
            },
          ],
        },
      ],
    },

    /* ------------------------------ skills ------------------------------ */
    {
      id: 'skills',
      title: 'What skills will you build?',
      blocks: [
        {
          type: 'defs',
          items: [
            {
              term: 'Clinical thinking',
              text: 'Learn to assess information, identify problems and make treatment decisions.',
            },
            {
              term: 'Hands-on skills',
              text: 'Develop practical skills through carving, materials, prosthetic work and clinical procedures.',
            },
            {
              term: 'Observation',
              text: 'Learn to recognize important details in teeth, oral tissues, X-rays and clinical findings.',
            },
            {
              term: 'Patient communication',
              text: 'Listen to patients, ask relevant questions, explain procedures and understand their concerns.',
            },
            {
              term: 'Scientific thinking',
              text: 'Connect anatomy, physiology, pathology, pharmacology and microbiology to clinical dentistry.',
            },
          ],
        },
      ],
    },

    /* ---------------------------- the reality --------------------------- */
    {
      id: 'reality',
      title: 'What is dentistry really like?',
      blocks: [
        {
          type: 'text',
          text: 'Dentistry combines **science, practical work and patient care**. You learn about:',
        },
        {
          type: 'tags',
          items: [
            'The human body',
            'Teeth',
            'Mouth',
            'Jaws',
            'Facial structures',
            'Diseases',
            'Materials',
            'Medications',
            'Clinical care',
          ],
        },
        { type: 'text', text: 'So dentistry is not simply:' },
        { type: 'quote', text: '“Fixing teeth.”' },
        {
          type: 'text',
          text: 'It is about understanding and managing the **oral and maxillofacial region**, making clinical decisions, performing procedures, and caring for patients. A large part of the profession involves:',
        },
        {
          type: 'flow',
          steps: ['Listening', 'Thinking', 'Deciding', 'Communicating', 'Performing'],
        },
      ],
    },

    /* ----------------------------- careers ------------------------------ */
    {
      id: 'careers',
      title: 'Where can dentistry take you?',
      blocks: [
        {
          type: 'text',
          text: 'After the five-year degree, dentistry offers both **clinical and non-clinical career paths**.',
        },
        {
          type: 'defs',
          items: [
            {
              term: 'Clinical practice',
              text: 'Work in private dental clinics and healthcare settings. Graduates may also complete the required public-sector service before establishing independent practice according to local requirements.',
            },
            {
              term: 'Postgraduate specialization',
              text: 'Continue your education in areas such as maxillofacial surgery, community dentistry, periodontology, prosthodontics, orthodontics, pedodontics and oral medicine.',
            },
            {
              term: 'Public health & government',
              text: 'Work in hospitals, dental centers, government health services and public-health programs.',
            },
            {
              term: 'Education & research',
              text: 'Work in universities as clinical instructors, laboratory supervisors, lecturers or researchers.',
            },
            {
              term: 'Dental & pharmaceutical companies',
              text: 'Work in roles such as medical representation or technical consulting related to dental and pharmaceutical products.',
            },
            {
              term: 'Corporate & international organizations',
              text: 'Provide dental services through clinics within companies or organizations.',
            },
            {
              term: 'Forensic odontology',
              text: 'Use dental records and findings to help identify individuals in medico-legal investigations.',
            },
          ],
        },
      ],
    },

    /* -------------------------------- fit ------------------------------- */
    {
      id: 'fit',
      title: 'Does dentistry fit you?',
      blocks: [
        { type: 'text', text: 'Dentistry may be worth exploring if you enjoy:' },
        {
          type: 'list',
          items: [
            'Science and understanding how things work',
            'Practical, hands-on work',
            'Solving problems',
            'Paying attention to small details',
            'Working with people',
            'Combining science with practical work',
            'Making decisions based on evidence',
            'Working carefully with your hands',
          ],
        },
        {
          type: 'quote',
          text: 'If you like science but don’t want your work to stay inside a textbook, dentistry might be worth exploring.',
        },
      ],
    },

    /* ---------------------------- the last level ------------------------ */
    /* The simulation is the end of the curriculum above rather than a feature
       beside it, so it closes the document: five years of reading, and then
       the fifth year done rather than read. */
    {
      id: 'simulate',
      title: 'Year 5, played out',
      tag: 'Simulation',
      panel: true,
      blocks: [
        { type: 'lede', text: 'Don’t just read about it. Take the case yourself.' },
        {
          type: 'text',
          text: 'The last level of this curriculum is a Year 5 orthodontic case. One patient, followed across eighteen months and five visits: you talk to her, examine her, collect the records, trace the radiograph yourself, plan the treatment, and then watch what the body does with your plan and change it when it disagrees.',
        },
        {
          type: 'text',
          text: 'There is nothing to get right. Every choice has a clinical consequence instead of a score.',
        },
        {
          type: 'flow',
          steps: ['Listen', 'Examine', 'Record', 'Analyse', 'Plan', 'Monitor', 'Adapt'],
        },
        {
          type: 'action',
          label: 'Start the case',
          to: '/app/dentistry/simulation',
          note: 'The Journey of a Smile · about 15 minutes',
        },
      ],
    },
  ],
}
