/**
 * The English Literature guide, as structured blocks rather than a markdown
 * string.
 *
 * The source was a markdown document, and it could have shipped as one — but
 * rendering it would have meant a markdown parser in the bundle for a single
 * page, and every table, arrow chain and term list would have come out as
 * whatever the parser's default happened to be. As data, the year cards look
 * like year cards and the career table is a real table, and adding the next
 * branch's guide costs no new machinery.
 *
 * Block types, all rendered by MajorGuide.jsx:
 *
 *   lede    the opening question, set large
 *   text    a paragraph; **bold** and *italic* are honoured, nothing else is
 *   flow    an arrow chain — Read -> Analyze -> Interpret
 *   facts   label/value pairs, for the at-a-glance panel
 *   defs    term + explanation rows, the workhorse of this document
 *   list    plain bullets
 *   years   one card per year of the degree
 *   table   head + rows, used once, for careers
 *   note    a quiet aside, for caveats about the sources
 *
 * Section ids are what the left-hand nav scrolls to, so they are stable names
 * rather than indexes: renumbering the document should not break a link.
 */

export const ENGLISH_LITERATURE = {
  title: 'English Literature',
  blurb:
    'Ever wondered why a story can mean more than what is written on the page? This is the degree that answers it.',

  sections: [
    /* --------------------------- introduction --------------------------- */
    {
      id: 'introduction',
      title: 'Introduction',
      blocks: [
        {
          type: 'lede',
          text: 'Ever wondered why a story can mean more than what is written on the page?',
        },
        {
          type: 'text',
          text: 'English Literature explores novels, poetry, plays, and other works in English, but instead of simply reading them, you learn to uncover the ideas, emotions, cultures, and messages hidden inside them. You will explore questions like: *Why did the writer make this choice? What does this character really reveal? How does language change the meaning?*',
        },
        { type: 'flow', label: 'In short', steps: ['Read', 'Analyze', 'Interpret', 'Communicate'] },
        {
          type: 'text',
          text: 'You are not just studying stories, poems, or plays. You are learning to look deeper, think critically, and understand how language can shape the way we see people, ideas, and the world around us.',
        },
        {
          type: 'facts',
          title: 'Quick information',
          items: [
            { label: 'Field', value: 'English / Humanities' },
            { label: 'Typical duration', value: '4 years' },
            {
              label: 'Main focus',
              value: 'Literature, critical analysis, language, research & communication',
            },
            { label: 'Common texts', value: 'Poetry, fiction, drama, novels, essays' },
            {
              label: 'Work focus',
              value:
                'Writing, analysis, research, communication, education, publishing, media & related fields',
            },
          ],
          note: 'The exact duration and modules depend on the university and the country.',
        },
        {
          type: 'flow',
          label: 'What you will gain',
          steps: ['Read', 'Analyze', 'Research', 'Write', 'Communicate', 'Apply'],
        },
      ],
    },

    /* ---------------------------- objectives ---------------------------- */
    {
      id: 'objectives',
      title: 'Objectives',
      lead: 'What is the degree designed to develop?',
      blocks: [
        {
          type: 'defs',
          items: [
            {
              term: 'Analyze',
              text: 'Understand how literary texts create meaning through language, structure, character, imagery, symbolism, and other techniques.',
            },
            {
              term: 'Think critically',
              text: 'Question ideas, compare interpretations, and form your own conclusions.',
            },
            { term: 'Write', text: 'Develop clear arguments and support them with evidence.' },
            { term: 'Research', text: 'Find, evaluate, and use relevant academic sources.' },
            {
              term: 'Communicate',
              text: 'Explain complex ideas clearly through writing, discussion, and presentations.',
            },
            {
              term: 'Understand perspectives',
              text: 'Explore different cultures, historical periods, experiences, and viewpoints through literature.',
            },
          ],
        },
      ],
    },

    /* -------------------------- responsibilities ------------------------- */
    {
      id: 'responsibilities',
      title: 'Responsibilities',
      lead: 'What will you actually be responsible for?',
      blocks: [
        {
          type: 'defs',
          items: [
            { term: 'Reading', text: 'Read assigned literary and academic texts.' },
            {
              term: 'Analysis',
              text: 'Examine how authors use language, characters, structure, themes, and literary techniques.',
            },
            {
              term: 'Writing',
              text: 'Complete essays, analyses, research papers, responses, and other assignments.',
            },
            { term: 'Research', text: 'Locate appropriate sources and use evidence correctly.' },
            {
              term: 'Participation',
              text: 'Contribute to discussions, seminars, presentations, and group activities.',
            },
            {
              term: 'Time management',
              text: 'Balance reading, assignments, research, projects, and deadlines.',
            },
            {
              term: 'Independent thinking',
              text: 'Develop and defend your own interpretation rather than simply repeating someone else’s.',
            },
          ],
        },
      ],
    },

    /* --------------------------- what you'll do -------------------------- */
    {
      id: 'what-you-will-do',
      title: 'What you will do',
      lead: 'Your university work will not just be reading.',
      blocks: [
        {
          type: 'defs',
          items: [
            {
              term: 'Read',
              text: 'Work with novels, short stories, poetry, plays, essays, and critical texts.',
            },
            {
              term: 'Analyze',
              text: 'Break texts down into characters, themes, setting, plot, conflict, language, imagery, symbolism, tone, and structure.',
            },
            {
              term: 'Write',
              text: 'Turn your analysis into essays, literary criticism, research papers, reviews, presentations, and other written projects.',
            },
            {
              term: 'Discuss',
              text: 'Explain your interpretation and respond to different viewpoints.',
            },
            {
              term: 'Research',
              text: 'Investigate authors, historical contexts, literary movements, theories, and critical perspectives.',
            },
          ],
        },
      ],
    },

    /* ---------------------------- year by year --------------------------- */
    {
      id: 'year-by-year',
      title: 'Year by year',
      lead: 'What the four years actually contain, and what each one is for.',
      blocks: [
        {
          type: 'years',
          items: [
            {
              n: 'Year 1',
              title: 'Build your foundation',
              study: [
                'Literature: introduction to literature, poetry, fiction, drama, introduction to literary analysis',
                'Academic skills: academic reading, academic writing, research basics',
              ],
              practice: ['Read', 'Understand', 'Basic analysis', 'Academic writing'],
              purpose: 'Build the foundation you need for more advanced literary study.',
            },
            {
              n: 'Year 2',
              title: 'Develop your literary knowledge',
              study: [
                'Poetry, short stories and fiction, drama, Shakespeare',
                'Literary periods, literary genres, further literary analysis',
              ],
              practice: ['Close reading', 'Interpretation', 'Comparison', 'Argument'],
              purpose:
                'Move beyond simply understanding a text and begin examining how and why it creates meaning.',
            },
            {
              n: 'Year 3',
              title: 'Critical & advanced study',
              study: [
                'Literary criticism, literary theory, research methods',
                'Shakespeare and Renaissance literature, modern literature, contemporary literature',
                'Sociocultural approaches to literature',
              ],
              practice: ['Interpret', 'Question', 'Compare', 'Research', 'Defend'],
              purpose:
                'Work with different critical perspectives and develop stronger independent arguments.',
            },
            {
              n: 'Year 4',
              title: 'Independent & specialized study',
              study: [
                'Advanced literary analysis, advanced critical studies',
                'Specialized literature modules, modern and contemporary literature',
                'Research project, dissertation',
              ],
              practice: ['Question', 'Research', 'Analyze', 'Write', 'Present'],
              purpose:
                'Apply everything you have learned to a substantial independent piece of academic work.',
            },
          ],
        },
      ],
    },

    /* ------------------------------- skills ------------------------------ */
    {
      id: 'skills',
      title: 'Skills you will build',
      lead: 'Your literature toolkit.',
      blocks: [
        {
          type: 'defs',
          items: [
            { term: 'Critical thinking', text: 'Evaluate ideas and different interpretations.' },
            {
              term: 'Analytical thinking',
              text: 'Break complex texts and ideas into meaningful parts.',
            },
            { term: 'Writing', text: 'Produce organized, clear, evidence-based writing.' },
            { term: 'Research', text: 'Find, evaluate, organize, and use information.' },
            { term: 'Communication', text: 'Explain and defend ideas clearly.' },
            {
              term: 'Editing',
              text: 'Identify problems with grammar, structure, clarity, and flow.',
            },
            {
              term: 'Audience awareness',
              text: 'Adapt communication according to the purpose and the audience.',
            },
            {
              term: 'Cultural awareness',
              text: 'Understand different perspectives and contexts.',
            },
          ],
        },
      ],
    },

    /* ------------------------------ careers ------------------------------ */
    {
      id: 'careers',
      title: 'Career paths',
      lead: 'Where can this take you?',
      blocks: [
        {
          type: 'note',
          text: 'English-degree career guidance identifies areas including publishing, writing, journalism, teaching, marketing and communications, and other roles where English graduates can apply transferable skills.',
        },
        {
          type: 'table',
          head: ['Field', 'Possible work', 'What you might do'],
          rows: [
            [
              'Education',
              'English teacher, tutor, educational content developer',
              'Teach English or literature, prepare lessons, create learning materials, assess student work, give feedback. May require additional qualifications.',
            ],
            [
              'Editing & publishing',
              'Editor, publishing assistant, editorial assistant',
              'Edit manuscripts, improve clarity and structure, check consistency, give feedback, prepare material for publication.',
            ],
            [
              'Writing & content',
              'Writer, content writer, copywriter, scriptwriter',
              'Write articles, create website content, develop scripts, produce informational content, adapt writing for different audiences.',
            ],
            [
              'Journalism & media',
              'Journalist, editorial assistant, media writer',
              'Research stories, gather information, write articles, interview sources, edit content.',
            ],
            [
              'Communications',
              'Communications assistant, content specialist, PR-related roles',
              'Write organizational content, create announcements, adapt messages for audiences, prepare communication materials.',
            ],
            [
              'Translation',
              'Translator, localization assistant, language specialist',
              'Translate written material, adapt expressions, consider cultural context, preserve meaning and tone.',
            ],
            [
              'Research',
              'Research assistant, academic researcher',
              'Develop research questions, find sources, analyze information, write reports, present findings.',
            ],
          ],
        },
      ],
    },

    /* ----------------------------- resources ----------------------------- */
    {
      id: 'resources',
      title: 'Resources',
      lead: 'Your study toolkit.',
      blocks: [
        {
          type: 'defs',
          items: [
            {
              term: 'Literary resources',
              text: 'Primary literary texts, poetry collections, novels, drama, Shakespeare.',
            },
            {
              term: 'Research resources',
              text: 'University library, academic journals, literary databases, encyclopedias, academic books.',
            },
            {
              term: 'Writing resources',
              text: 'Academic writing guides, essay structure, referencing guides, editing resources.',
            },
            {
              term: 'Shakespeare',
              text: 'For Shakespeare and *Macbeth*, the Folger Shakespeare Library is a reliable source for both the text and the teaching material around it.',
            },
          ],
        },
      ],
    },

    /* ------------------------------ sources ------------------------------ */
    {
      id: 'sources',
      title: 'Sources',
      blocks: [
        {
          type: 'list',
          items: [
            'University of Cambridge',
            'UCL — English BA',
            'Queen Mary — English BA, English Literature & Linguistics',
            'Prospects — What can I do with an English degree?',
            'Folger Shakespeare Library — Macbeth',
            'Supplied introduction to English Literature material',
          ],
        },
      ],
    },
  ],
}
