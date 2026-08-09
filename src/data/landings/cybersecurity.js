/**
 * The cybersecurity landing copy, as structured blocks rather than a markdown
 * string.
 *
 * Same reasoning as the English Literature guide next door: the source was a
 * markdown document, and shipping it as one would mean a parser in the bundle
 * and every enumeration coming out as whatever the parser's default bullet
 * happens to be. As data, the lists of subjects and job titles are real chips
 * and the closing flow is a real chain.
 *
 * The document runs: what is it -> what will I study -> what will I get good
 * at -> where does it lead -> try it. The head of the page already carries the
 * name, the field and the length, so this starts one step in, at the
 * definition.
 *
 * Block types, both rendered by MajorLanding.jsx:
 *
 *   text   a paragraph
 *   tags   a row of chips — the subjects, the skills, the job titles
 *
 * Two types because the document uses two. The guide file explains the same
 * choice at more length.
 */

export const CYBERSECURITY_LANDING = {
  eyebrow: 'What is cybersecurity?',
  title: 'Protect the digital world. Solve problems. Think like a defender.',
  lede: [
    'Cybersecurity is the field of protecting computers, networks, applications, and information from people who try to access, damage, or misuse them.',
    'Every time you send a message, connect to Wi-Fi, use an online bank, or log into an account, cybersecurity helps keep that information safe.',
  ],

  sections: [
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
  ],

  /**
   * The closing panel. `action` is the label the document ends on; the
   * simulations it points at are not built yet, so the page renders it as a
   * button that is plainly not ready rather than a link to nowhere.
   */
  cta: {
    title: 'Experience cybersecurity',
    lede: 'Don’t just read about it. Try it yourself.',
    text: 'Explore interactive simulations that let you experience different parts of cybersecurity. Start by discovering how devices communicate in a network, then explore how information is protected through cryptography and how security professionals investigate suspicious activity.',
    flow: ['Networks', 'Cryptography', 'Investigation'],
    action: 'Start Exploring',
    note: 'The simulations are being built.',
  },
}
