/**
 * The cybersecurity landing copy, as structured blocks rather than a markdown
 * string.
 *
 * Same reasoning as the English Literature guide next door: the source was a
 * markdown document, and shipping it as one would mean a parser in the bundle
 * and every enumeration coming out as whatever the parser's default bullet
 * happens to be. As data, the lists of subjects and job titles are real chips
 * and the closing sequence is a real chain.
 *
 * The document runs: what is it -> what will I study -> what will I get good
 * at -> where does it lead -> try it. Five sections, and the opening and the
 * closing panel are two of them rather than loose copy either side, because
 * the contents rail beside the document lists sections and those two are as
 * worth reaching as the middle three.
 *
 * Block types, all rendered by MajorLanding.jsx:
 *
 *   lede    the opening line of a section, set large
 *   text    a paragraph
 *   tags    a row of chips — the subjects, the skills, the job titles
 *   flow    an arrow chain, used once, for the order the simulations come in
 *   action  the button the document ends on
 *
 * Section ids are what the rail scrolls to, so they are stable names rather
 * than indexes: renumbering the document should not break a link.
 */

export const CYBERSECURITY_LANDING = {
  sections: [
    /* ----------------------------- overview ----------------------------- */
    {
      id: 'overview',
      title: 'What is cybersecurity?',
      blocks: [
        { type: 'lede', text: 'Protect the digital world. Solve problems. Think like a defender.' },
        {
          type: 'text',
          text: 'Cybersecurity is the field of protecting computers, networks, applications, and information from people who try to access, damage, or misuse them.',
        },
        {
          type: 'text',
          text: 'Every time you send a message, connect to Wi-Fi, use an online bank, or log into an account, cybersecurity helps keep that information safe.',
        },
      ],
    },

    /* ------------------------------ study ------------------------------- */
    {
      id: 'study',
      title: 'What will you study?',
      blocks: [
        {
          type: 'text',
          text: 'During a cybersecurity degree, you learn how digital systems work and how to protect them. You will explore areas such as:',
        },
        {
          type: 'tags',
          items: [
            'Computer networks',
            'Network security',
            'Cryptography',
            'Ethical hacking',
            'Programming',
            'Operating systems',
            'Digital forensics',
            'Security management',
          ],
        },
        {
          type: 'text',
          text: 'You don’t just learn how attacks happen. You learn how to understand systems, find weaknesses, investigate suspicious activity, and design ways to make technology safer.',
        },
      ],
    },

    /* ------------------------------ skills ------------------------------ */
    {
      id: 'skills',
      title: 'Skills you’ll develop',
      blocks: [
        {
          type: 'text',
          text: 'Cybersecurity requires more than technical knowledge. You develop:',
        },
        {
          type: 'tags',
          items: [
            'Problem-solving',
            'Logical thinking',
            'Critical thinking',
            'Investigation',
            'Attention to detail',
            'Analytical skills',
          ],
        },
        {
          type: 'text',
          text: 'You also learn how to look at a problem from different perspectives. Sometimes you need to think like an attacker to understand how a system could be compromised, and then think like a defender to protect it.',
        },
      ],
    },

    /* ----------------------------- careers ------------------------------ */
    {
      id: 'careers',
      title: 'What can you do with it?',
      blocks: [
        {
          type: 'text',
          text: 'Cybersecurity can lead to many different career paths. You could work as:',
        },
        {
          type: 'tags',
          items: [
            'Cybersecurity Analyst',
            'Security Engineer',
            'Penetration Tester',
            'Digital Forensics Analyst',
            'Incident Responder',
            'Security Consultant',
            'Security Architect',
          ],
        },
        {
          type: 'text',
          text: 'The field also exists across many industries, including banking, healthcare, government, telecommunications, technology, and almost any organization that uses digital systems.',
        },
      ],
    },

    /* ---------------------------- experience ---------------------------- */
    /* `panel` paints the section as the closing call to action rather than
       more document.

       This panel promised networks, then cryptography, then investigation
       before any of it existed. The Way In is that promise kept, in that
       order: a network you find your way into, a wire that gives up a password
       because nothing encrypted it, and a log you read afterwards to find your
       own footprints in it. */
    {
      id: 'experience',
      title: 'Experience cybersecurity',
      panel: true,
      blocks: [
        { type: 'lede', text: 'Don’t just read about it. Try it yourself.' },
        {
          type: 'text',
          text: 'Explore interactive simulations that let you experience different parts of cybersecurity. Start by discovering how devices communicate in a network, then explore how information is protected through cryptography and how security professionals investigate suspicious activity.',
        },
        { type: 'flow', steps: ['Networks', 'Cryptography', 'Investigation'] },
        {
          type: 'action',
          label: 'Start Exploring',
          to: '/app/cybersecurity/simulation',
          note: 'The Way In · about 15 minutes',
        },
      ],
    },
  ],
}
