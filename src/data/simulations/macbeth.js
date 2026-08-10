/**
 * Macbeth — Ambition or Fate? The English Literature simulation, as content.
 *
 * The second simulation on the site and the first of a different kind. The
 * orthodontics case is a clinic: one path, twenty-five screens, and the reader
 * does the work of a Year 5 student. This one is a text, and a text does not
 * have a procedure — it has a person at a fork. So the shape is a scene graph:
 * the reader decides what Macbeth is, the story bends, and the interpretation
 * they end with is theirs to defend.
 *
 * TWO KINDS OF QUESTION, AND THEY BEHAVE DIFFERENTLY
 *
 * The story choices have no right answer and nothing scores them. Macbeth has
 * been played as a man destroyed by fate and as a man who chose, by actors who
 * spent careers on the question, and a simulation that marked one of those
 * wrong would be teaching the opposite of the subject.
 *
 * The literature questions do have a right answer, because foreshadowing is
 * foreshadowing. They are asked immediately after the reader has watched the
 * device do its work, never before — the technique is named only once it has
 * been felt, which is the one rule this file shares with the dentistry case.
 *
 * THE QUOTED LINES ARE REAL
 *
 * Every line attributed to a character is Shakespeare's, from Act 1, lightly
 * modernised in spelling and nothing else. They are chosen so that each of the
 * four stances at Forres gets an aside the play actually gives him — which is
 * the point of that screen: all four readings are already in the text.
 *
 * The scene ids are stable names rather than numbers because the journey
 * branches; `next` may be a plain id or a fork keyed on an earlier choice.
 */

export const MACBETH = {
  kind: 'story',
  slug: 'macbeth',
  major: 'english-language-literature',
  title: 'Macbeth — Ambition or Fate?',
  subtitle: 'One soldier, three predictions, and the choices in between.',
  eyebrow: 'English Literature · Shakespeare',

  /* Where the reader is, in four acts rather than in fourteenths. */
  acts: [
    { id: 'prophecy', label: 'The prophecy' },
    { id: 'temptation', label: 'The temptation' },
    { id: 'night', label: 'The night' },
    { id: 'after', label: 'After' },
  ],

  first: 'cover',

  exit: {
    label: 'Back to the guide',
    to: '/app/english-language-literature/english-literature',
  },

  /* What the closing screen reads back. Every key here is set by a choice
     somewhere in the scenes below; keep the two in step. */
  recap: [
    {
      key: 'belief',
      label: 'On the road',
      values: {
        believe: 'You believed the prophecy.',
        question: 'You doubted the prophecy.',
      },
    },
    {
      key: 'stance',
      label: 'At Forres',
      values: {
        wait: 'You would let fate arrange it.',
        act: 'You would make it happen yourself.',
        loyal: 'You put the thought down.',
        explore: 'You let yourself work out what it would take.',
      },
    },
    {
      key: 'fate',
      label: 'At Inverness',
      values: {
        dies: 'You killed Duncan.',
        lives: 'You refused.',
      },
    },
  ],

  scenes: [
    /* ------------------------------- cover ------------------------------ */
    {
      id: 'cover',
      act: 'prophecy',
      visit: 'Before you begin',
      title: 'Macbeth — Ambition or Fate?',
      lede: 'You will make the decisions as Macbeth.',
      image: 'scene-00-return-from-battle',
      imageAlt: 'Two soldiers riding home across an empty moor under a heavy sky.',
      blocks: [
        {
          type: 'text',
          text: 'Macbeth is a Scottish soldier riding home from a battle he has won. On the road he and his friend Banquo meet three witches, who tell him two things about his future: he will become Thane of Cawdor, and after that he will be King of Scotland.',
        },
        {
          type: 'text',
          text: 'Within the hour the first one comes true — he is made Thane of Cawdor. And at almost the same moment, King Duncan names his own son Malcolm as the next king.',
        },
        {
          type: 'text',
          text: 'So Macbeth has a choice. He can wait, and let the future arrive on its own. Or he can act, and make it arrive.',
        },
        {
          type: 'lesson',
          tag: 'Your part in this',
          text: 'You decide what he does. The story bends to your choices and there is no correct path through it — what your choices show is how you read him, and how much of this you think is ambition rather than fate.',
        },
      ],
      action: 'Start simulation',
      next: 'heath',
    },

    /* ------------------------------ scene 1 ----------------------------- */
    {
      id: 'heath',
      act: 'prophecy',
      visit: 'Scene 1',
      title: 'Three strangers on the heath',
      image: 'scene-01-three-witches',
      imageAlt: 'Three cloaked figures standing in mist on an open moor.',
      blocks: [
        {
          type: 'text',
          text: 'The battle is won and you are riding home with Banquo. The land is empty in every direction. Then there are three figures on the road in front of you, and they already know your name.',
        },
        {
          type: 'say',
          who: 'The witches',
          lines: [
            'All hail, Macbeth! Hail to thee, Thane of Glamis.',
            'All hail, Macbeth! Hail to thee, Thane of Cawdor.',
            'All hail, Macbeth, that shalt be king hereafter.',
          ],
        },
        {
          type: 'text',
          text: 'The first is simply true: you have been Thane of Glamis for years. The second belongs to a living man. The third belongs to nobody but the king.',
        },
        {
          type: 'text',
          text: 'Banquo asks what they see for him. They tell him he will father kings although he will never be one. Then they are gone, and the road is empty again, and neither of you is sure anything happened.',
        },
      ],
      action: 'Ride on',
      next: 'cawdor',
    },

    /* ------------------------------ scene 2 ----------------------------- */
    {
      id: 'cawdor',
      act: 'prophecy',
      visit: 'Scene 2',
      title: 'The second one comes true',
      image: 'scene-02-thane-of-cawdor',
      imageAlt: "A king's messenger handing a sealed letter to a soldier on an open road.",
      blocks: [
        {
          type: 'text',
          text: 'Before you reach the castle a messenger from the king finds you. The Thane of Cawdor has been convicted of treason. The title is yours; Duncan has already granted it.',
        },
        {
          type: 'text',
          text: 'An hour ago this was a strange thing said by strangers. Now one of the three has happened and you are holding the proof of it.',
        },
        { type: 'text', text: 'Which leaves the third.' },
      ],
      choice: {
        prompt: 'What do you make of the prophecy now?',
        options: [
          {
            id: 'believe',
            label: 'Believe it',
            text: 'If one has come true the rest will follow. You start to think of yourself as a man who is going to be king.',
            set: { belief: 'believe' },
          },
          {
            id: 'question',
            label: 'Question it',
            text: 'A lucky guess is still a guess. You decide not to trust them and you carry on as you were.',
            set: { belief: 'question' },
          },
        ],
      },
      next: 'q-foreshadowing',
    },

    /* ---------------------------- the text 1 ---------------------------- */
    {
      id: 'q-foreshadowing',
      act: 'prophecy',
      visit: 'The text',
      title: 'What Shakespeare just did',
      backdrop: 'scene-02-thane-of-cawdor',
      question: {
        prompt:
          'The witches tell Macbeth something that may happen much later in the play. What is that technique called?',
        options: [
          { id: 'a', label: 'Foreshadowing — a hint about what is coming', correct: true },
          { id: 'b', label: 'Flashback — a scene from earlier, shown later' },
          { id: 'c', label: 'Simile — a comparison using “like” or “as”' },
        ],
        right: 'Foreshadowing. The prophecy is a hint dropped in the first scene that the rest of the play spends five acts paying off.',
        wrong:
          'This one is foreshadowing. A flashback goes backwards and a simile compares two things — here the line points forwards, at something that has not happened yet.',
        lesson:
          'Foreshadowing is why Macbeth feels uncertain the first time you read it and inevitable the second. Shakespeare tells you roughly how it ends before anything has happened, and you still watch Macbeth walk the whole way into it.',
      },
      next: 'forres',
    },

    /* ----------------------------- scene 3 ------------------------------ */
    {
      id: 'forres',
      act: 'temptation',
      visit: 'Scene 3',
      title: 'The king names his heir',
      image: 'scene-03-forres-court',
      imageAlt:
        'A king on a raised seat in a stone hall, resting a hand on a young man’s shoulder before a watching court.',
      blocks: [
        {
          type: 'text',
          text: 'At Forres, Duncan thanks you in front of the whole court. Then he names his son Malcolm Prince of Cumberland — the title that says plainly who will be king next.',
        },
        {
          type: 'text',
          by: 'belief',
          variants: {
            believe:
              'You believed the prophecy an hour ago. Now there is a name standing between you and it, and it is a name you are expected to applaud.',
            question:
              'You told yourself the witches were nothing. You applaud with everybody else. But you notice exactly where Malcolm is standing, and noticing is new.',
          },
        },
      ],
      choice: {
        by: 'belief',
        variants: {
          believe: {
            prompt: 'You believe you will be king. Malcolm is now in the way. What do you do?',
            options: [
              {
                id: 'wait',
                label: 'Wait for destiny',
                text: 'If fate means to crown you, fate can arrange it without your help. You will not lift a hand.',
                set: { stance: 'wait' },
              },
              {
                id: 'act',
                label: 'Take control of destiny',
                text: 'A prophecy is not a plan. If this is going to happen, something has to make it happen.',
                set: { stance: 'act' },
              },
            ],
          },
          question: {
            prompt: 'You do not trust the witches. But the thought is in the room now. What do you do with it?',
            options: [
              {
                id: 'loyal',
                label: 'Stay loyal to Duncan',
                text: 'He is your king and he has just honoured you in public. You put the thought down.',
                set: { stance: 'loyal' },
              },
              {
                id: 'explore',
                label: 'Explore the possibility',
                text: 'You do not act on anything. You only let yourself work out what it would take.',
                set: { stance: 'explore' },
              },
            ],
          },
        },
      },
      next: 'aside',
    },

    /* ----------------------------- scene 4 ------------------------------ */
    {
      id: 'aside',
      act: 'temptation',
      visit: 'Scene 4',
      title: 'A thought you do not say aloud',
      image: 'scene-04-the-aside',
      imageAlt:
        'A man standing half a pace out of a lit hall, face in shadow, turned away from the company behind him.',
      blocks: [
        {
          type: 'text',
          text: 'The court is still talking. You step half a pace out of it, and for a moment the audience hears something the people beside you do not.',
        },
        {
          type: 'say',
          who: 'Macbeth',
          by: 'stance',
          variants: {
            wait: ['If chance will have me king, why, chance may crown me, without my stir.'],
            act: [
              'The Prince of Cumberland! That is a step on which I must fall down, or else o’erleap.',
            ],
            loyal: ['This supernatural soliciting cannot be ill, cannot be good.'],
            explore: ['Stars, hide your fires; let not light see my black and deep desires.'],
          },
        },
        {
          type: 'text',
          text: 'Then you turn back into the room, and your face is the same face it was a second ago.',
        },
      ],
      action: 'Continue',
      next: 'q-aside',
    },

    /* ---------------------------- the text 2 ---------------------------- */
    {
      id: 'q-aside',
      act: 'temptation',
      visit: 'The text',
      title: 'What Shakespeare just did',
      backdrop: 'scene-04-the-aside',
      question: {
        prompt:
          'Macbeth says his thoughts where the audience can hear them but the other characters cannot. What is that called?',
        options: [
          { id: 'a', label: 'An aside — a line meant for the audience alone', correct: true },
          { id: 'b', label: 'A simile — a comparison using “like” or “as”' },
          {
            id: 'c',
            label: 'Personification — giving human qualities to something that is not human',
          },
        ],
        right: 'An aside. The court beside him hears nothing; you heard all of it.',
        wrong:
          'This one is an aside. A simile compares two things and personification gives human qualities to something that is not human — here the whole trick is who is allowed to hear.',
        lesson:
          'The aside is how a play does what a novel does with two words: “he thought”. It also splits Macbeth in two — the man the court can see and the man you are watching — and that gap is most of the character.',
      },
      next: 'inverness',
    },

    /* ----------------------------- scene 5 ------------------------------ */
    {
      id: 'inverness',
      act: 'night',
      visit: 'Scene 5',
      title: 'The king comes to your house',
      image: 'scene-05-duncan-arrives',
      imageAlt: 'A castle gate at dusk with torches lit and riders arriving in the courtyard.',
      blocks: [
        {
          type: 'text',
          text: 'Duncan rides to Inverness to spend the night as your guest. He arrives in good spirits and says the castle has a pleasant seat — that the air here is sweet.',
        },
        {
          type: 'text',
          text: 'He has come with almost no guard, because he is among friends. He is under your roof. He will be asleep by midnight. Every door in the building is one you control.',
        },
        {
          type: 'text',
          text: 'Lady Macbeth has read your letter about the witches. She has been waiting at the gate since it arrived.',
        },
      ],
      action: 'Go inside',
      next: 'ladymacbeth',
    },

    /* ----------------------------- scene 6 ------------------------------ */
    {
      id: 'ladymacbeth',
      act: 'night',
      visit: 'Scene 6',
      title: 'Lady Macbeth',
      image: 'scene-06-lady-macbeth',
      imageAlt:
        'A woman holding a candle in a dark stone corridor, speaking closely to a man whose face is turned from the light.',
      blocks: [
        {
          type: 'text',
          text: 'She does not think this is a chance. She thinks it is the chance, the only one either of you will get, and that hesitating now is the same as refusing.',
        },
        { type: 'say', who: 'Lady Macbeth', lines: ['When you durst do it, then you were a man.'] },
        {
          type: 'text',
          text: 'The plan is already made. The guards will be given wine until they cannot stand. Their own daggers will be left where anyone could pick them up. By morning there will be two men covered in blood and neither of them will be you.',
        },
        {
          type: 'text',
          by: 'stance',
          variants: {
            wait: 'You told yourself you would not lift a hand. She is asking for your hand.',
            act: 'You decided at Forres that something would have to make it happen. She is telling you what.',
            loyal:
              'You put the thought down in the hall at Forres. She has picked it up and put it back in your hand.',
            explore:
              'You only wanted to know what it would take. Now you know, and knowing turns out not to be a safe place to stand.',
          },
        },
        { type: 'text', text: 'She has thought of everything. The only part missing is you.' },
      ],
      choice: {
        prompt: 'This is the decision the whole play turns on.',
        options: [
          {
            id: 'kill',
            label: 'Kill Duncan',
            text: 'You choose the ambition. You take the daggers and go up the stairs.',
            set: { fate: 'dies' },
          },
          {
            id: 'refuse',
            label: 'Refuse',
            text: 'You choose loyalty. Whatever the witches saw, it will not be your hand that brings it about.',
            set: { fate: 'lives' },
          },
        ],
      },
      next: 'q-imagery',
    },

    /* ---------------------------- the text 3 ---------------------------- */
    {
      id: 'q-imagery',
      act: 'night',
      visit: 'The text',
      title: 'What Shakespeare just did',
      backdrop: 'scene-06-lady-macbeth',
      question: {
        prompt:
          'Darkness, a held candle, a sky with the stars put out — the scene is built out of these before anybody does anything. What is that called?',
        options: [
          { id: 'a', label: 'Imagery — language that builds a picture and a mood', correct: true },
          { id: 'b', label: 'Simile — a comparison using “like” or “as”' },
          { id: 'c', label: 'Repetition — the same word or phrase used again' },
        ],
        right: 'Imagery. Nothing has happened yet and the scene already feels as though it has.',
        wrong:
          'This one is imagery. A simile compares two things and repetition repeats them — here the work is being done by what you are made to picture.',
        lesson:
          'Macbeth is full of night, blood, and things that will not wash off. That imagery is not decoration laid over the story: on a bare stage, with no camera to do it for you, it is how the play makes an audience feel the murder before anyone commits it.',
      },
      next: { by: 'fate', variants: { dies: 'ending-dies', lives: 'ending-lives' } },
    },

    /* ---------------------------- ending: dies -------------------------- */
    {
      id: 'ending-dies',
      act: 'after',
      visit: 'Ending',
      title: 'You chose to kill Duncan',
      image: 'scene-07-ending-duncan-dies',
      imageAlt: 'A crowned man sitting alone on a throne in an empty hall, lit from one side.',
      blocks: [
        {
          type: 'text',
          text: 'Duncan is murdered in his sleep. His sons run, and running makes them look guilty. The crown comes to you, exactly as the witches said it would.',
        },
        {
          type: 'text',
          text: 'And then nothing is finished. You are king and you are afraid — of Banquo, who heard the same prophecy; of everyone who was in the hall that night; of anybody who might do to you what you did to Duncan.',
        },
        {
          type: 'text',
          text: 'So you order another death, and then another, and each one is easier than the last and none of them makes you safe. The prophecy came true. It did not make you a king who could sleep.',
        },
        {
          type: 'lesson',
          tag: 'What the play does with this',
          text: 'Shakespeare does not save the punishment for the last act as a surprise. It starts the moment Macbeth succeeds — most of the play is spent watching a man live with having got exactly what he wanted.',
        },
      ],
      action: 'Continue',
      next: 'q-lesson-dies',
    },

    /* ---------------------------- ending: lives ------------------------- */
    {
      id: 'ending-lives',
      act: 'after',
      visit: 'Ending',
      title: 'You chose not to kill Duncan',
      image: 'scene-08-ending-duncan-lives',
      imageAlt:
        'A man watching from a castle wall at first light as riders leave along the road below.',
      blocks: [
        {
          type: 'text',
          text: 'Duncan wakes, thanks you for the night, and rides out in the morning. He is still king. Malcolm is still his heir.',
        },
        {
          type: 'text',
          text: 'You are still Thane of Cawdor. You are still the man who won the battle. And the third prophecy is still sitting there unused, and you will think about it for the rest of your life.',
        },
        {
          type: 'text',
          text: 'This is not the play Shakespeare wrote. It is the one that stayed available to Macbeth right up to the last moment — and knowing it was there is a large part of why the real ending hurts.',
        },
        {
          type: 'lesson',
          tag: 'What the play does with this',
          text: 'The witches never tell Macbeth to kill anybody. They tell him what will be. Everything after that is his, which is why the play is still argued over four hundred years later: ambition, or fate?',
        },
      ],
      action: 'Continue',
      next: 'q-lesson-lives',
    },

    /* --------------------------- the lesson (a) ------------------------- */
    {
      id: 'q-lesson-dies',
      act: 'after',
      visit: 'The lesson',
      title: 'What the ending argues',
      backdrop: 'scene-07-ending-duncan-dies',
      question: {
        prompt: 'You took the crown by murder and it brought you no peace. What is the play driving at?',
        options: [
          {
            id: 'a',
            label: 'Bad choices bring bad results — including for the person who wins.',
            correct: true,
          },
          { id: 'b', label: 'Power always makes people happy.' },
          { id: 'c', label: 'You should always trust a prophecy.' },
        ],
        right: 'Yes. The tragedy is not that Macbeth fails to get the crown. It is that he gets it.',
        wrong:
          'The play argues the first one. Macbeth is not happy as king and the prophecy is what ruins him rather than what saves him — the cost lands on the person who won.',
        lesson:
          'Naming the moral is the easy half. The hard half, and the one a degree is spent on, is proving it from the text: which lines, which scenes, and why that reading beats the other one.',
      },
      next: 'closing',
    },

    /* --------------------------- the lesson (b) ------------------------- */
    {
      id: 'q-lesson-lives',
      act: 'after',
      visit: 'The lesson',
      title: 'What the ending argues',
      backdrop: 'scene-08-ending-duncan-lives',
      question: {
        prompt: 'You refused, and the disaster never happened. What is the play driving at?',
        options: [
          { id: 'a', label: 'A good choice can stop a bad result before it starts.', correct: true },
          { id: 'b', label: 'Getting power matters more than being good.' },
          { id: 'c', label: 'You should always do what other people tell you.' },
        ],
        right:
          'Yes. And notice what it costs him nothing to do — the whole tragedy was avoidable, right up to the stairs.',
        wrong:
          'The play argues the first one. Macbeth is pushed hard by his wife and by the prophecy, and the point is that neither of them actually takes the choice away from him.',
        lesson:
          'Naming the moral is the easy half. The hard half, and the one a degree is spent on, is proving it from the text: which lines, which scenes, and why that reading beats the other one.',
      },
      next: 'closing',
    },

    /* ------------------------------ closing ----------------------------- */
    {
      id: 'closing',
      act: 'after',
      visit: 'Complete',
      title: 'Your reading of Macbeth',
      backdrop: 'scene-00-return-from-battle',
      lede: 'Three decisions, and what they add up to.',
      blocks: [
        { type: 'recap' },
        {
          type: 'text',
          text: 'Nothing marked that. There is no score, and the path you took is not better or worse than the other one — Macbeth has been played as a man destroyed by fate and as a man who simply chose, by actors who gave their careers to the question.',
        },
        {
          type: 'text',
          text: 'What you just did is the actual work of the subject. A text puts a person at a fork; you decide what kind of person they are; and then you have to defend that reading with what is on the page. Four years of that is the degree.',
        },
        {
          type: 'lesson',
          tag: 'Where this sits in the degree',
          text: 'You met foreshadowing, the aside and imagery here as things you watched happen rather than as terms on a list. Year 1 is that, on longer texts. By Year 3 you are arguing for one reading of a play against another and being asked to prove it.',
        },
      ],
      restart: true,
    },
  ],
}
