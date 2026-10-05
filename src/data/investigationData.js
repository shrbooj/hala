/* ==========================================================================
   THE YOU INVESTIGATION — ALL CONTENT LIVES HERE
   Edit this one file to personalize the whole website.
   ========================================================================== */

/* -------------------------------------------------------------------------
   1. THE BASICS — change these first
   ------------------------------------------------------------------------- */
export const girl = {
  name: '[HALA BASSEL]',
  nickname: '[لولو]',
  investigatorName: '[Shrbooj]',
  favoriteThing: '[sleeping]',
  insideJoke: '[هفتانة]',
  // What she calls you (used in the evidence + quiz + game text)
  calledMe: 'اخي',
}

// Pronoun the investigator uses for himself in the case notes ("his phone")
const he = 'his'

/* -------------------------------------------------------------------------
   2. CASE META (the little details that make it feel official)
   ------------------------------------------------------------------------- */
export const caseMeta = {
  caseNumber: '001',
  caseId: 'CF-001-X',
  agency: 'Bureau of Suspiciously Good Conversations',
  clearance: 'LEVEL 4 — EYES ONLY',
  // Shown on the first screen. Leave blank ('') to use today's date automatically.
  openedOn: '',
}

/* -------------------------------------------------------------------------
   3. SCREEN 1 — CASE FILE
   ------------------------------------------------------------------------- */
export const intro = {
  stamp: 'CLASSIFIED',
  status: 'UNDER INVESTIGATION',
  line: 'An investigation has been opened regarding suspicious behavior.',
  button: 'BEGIN INVESTIGATION',
}

/* -------------------------------------------------------------------------
   4. SCREEN 2 — INVESTIGATION BRIEF
   ------------------------------------------------------------------------- */
export const brief = {
  title: 'Why are we here?',
  subtitle: 'After an extensive investigation, several suspicious patterns have been detected.',
  button: 'REVIEW EVIDENCE',
  cards: [
    {
      id: '01',
      text: 'Subject appears to be suspiciously easy to talk to.',
    },
    {
      id: '02',
      text: `Subject has caused investigator to check ${he} phone more than statistically reasonable.`,
    },
    {
      id: '03',
      text: "Subject has an alarming ability to randomly appear in the investigator's thoughts.",
    },
    {
      id: '04',
      text: 'Subject may be significantly more interesting than initially suspected.',
    },
  ],
}

/* -------------------------------------------------------------------------
   5. SCREEN 3 — EVIDENCE ROOM
   icon options: chat | audio | visual | behavior | joke | favorite
   Add an `image` (e.g. '/evidence1.jpg' — put the file in /public) to any
   card and it shows up when the card is opened. Leave it out for no image.
   ------------------------------------------------------------------------- */
export const evidenceRoom = {
  title: 'Evidence Room',
  subtitle: 'Tap any exhibit to open it. Handle with care.',
  button: 'RUN SUBJECT ANALYSIS',
  cards: [
    {
      id: 'EX-A',
      icon: 'chat',
      label: 'CHAT LOG',
      teaser: 'Exhibit A',
      reveal:
        'A conversation that was supposed to last 10 minutes somehow lasted 3 hours. Investigator has no explanation.',
      note: 'Time elapsed: unreasonable.',
      tilt: -2.2,
    },
    {
      id: 'EX-B',
      icon: 'audio',
      label: 'AUDIO EVIDENCE',
      teaser: 'Exhibit B',
      reveal: "Subject's voice has been classified as dangerously enjoyable.",
      note: 'Recommended listening: unsupervised.',
      tilt: 1.8,
    },
    {
      id: 'EX-C',
      icon: 'visual',
      label: 'VISUAL EVIDENCE',
      teaser: 'Exhibit C',
      reveal: 'Further investigation required.',
      note: 'Photo pending. Replace this with a real one (see README).',
       image: 'yourfile.jpeg',
      tilt: -1.4,
    },
    {
      id: 'EX-D',
      icon: 'behavior',
      label: 'BEHAVIORAL EVIDENCE',
      teaser: 'Exhibit D',
      reveal: 'Subject has demonstrated suspicious levels of chaos.',
      note: 'Chaos was not requested. Chaos was delivered.',
      tilt: 2.4,
    },
    {
      id: 'EX-E',
      icon: 'joke',
      label: 'RECURRING INCIDENT',
      teaser: 'Exhibit E',
      reveal: `Known incident: "${girl.insideJoke}". Investigator is still not over it.`,
      note: 'Witnesses: two. Both unreliable.',
      tilt: -1.6,
    },
    {
      id: 'EX-F',
      icon: 'favorite',
      label: 'PERSONAL EFFECTS',
      teaser: 'Exhibit F',
      reveal: `Subject has a documented weakness for ${girl.favoriteThing}. Investigator has taken notes.`,
      note: 'Notes were not requested either.',
      tilt: 1.5,
    },
    {
      id: 'EX-G',
      icon: 'verbal',
      label: 'VERBAL PATTERN',
      teaser: 'Exhibit G',
      reveal: `Subject refers to investigator as "${girl.calledMe}" at an alarming frequency. Investigator has been reclassified as a brother without his consent.`,
      note: 'Appeal filed. Appeal ignored.',
      tilt: -2,
    },
    {
      id: 'EX-H',
      icon: 'shy',
      label: 'REACTION REPORT',
      teaser: 'Exhibit H',
      reveal:
        'When flirted with, subject becomes visibly shy. Subject denies this. The evidence disagrees with the subject.',
      note: 'Denial logged. Denial overruled.',
      tilt: 1.7,
    },
    {
      id: 'EX-I',
      icon: 'temper',
      label: 'TEMPER ASSESSMENT',
      teaser: 'Exhibit I',
      reveal:
        'Subject has a short fuse and a long memory. Investigator proceeds anyway, which says something about investigator.',
      note: 'Handle with care. Handle with snacks.',
      tilt: -1.3,
    },
  ],
}

/* -------------------------------------------------------------------------
   6. SCREEN 4 — SUBJECT ANALYSIS (QUIZ)
   Each option adds points to the four meters:
     cute | chaotic | problematic | suspicious
   Final percentages are base + points, clamped to 3–100.
   Add, remove or reword questions freely (keep 2–6 options each).
   ------------------------------------------------------------------------- */
export const quiz = {
  title: 'SUBJECT ANALYSIS',
  subtitle: 'Answer honestly. The investigation depends on it.',
  // Every meter starts here before answers are added
  baseScore: 30,
  meters: [
    { key: 'cute', label: 'Cute' },
    { key: 'chaotic', label: 'Chaotic' },
    { key: 'problematic', label: 'Problematic' },
    { key: 'suspicious', label: 'Suspicious' },
  ],
  questions: [
    {
      prompt: 'Your ideal plan is:',
      options: [
        { text: 'Stay home', scores: { cute: 10, chaotic: 2, problematic: 4, suspicious: 6 } },
        { text: 'Go somewhere', scores: { cute: 8, chaotic: 8, problematic: 6, suspicious: 4 } },
        { text: 'Figure it out later', scores: { cute: 6, chaotic: 14, problematic: 8, suspicious: 6 } },
        { text: "Depends who's asking", scores: { cute: 9, chaotic: 6, problematic: 10, suspicious: 14 } },
      ],
    },
    {
      prompt: 'How often are you actually on your phone?',
      options: [
        { text: 'Never', scores: { cute: 4, chaotic: 4, problematic: 8, suspicious: 16 } },
        { text: 'Sometimes', scores: { cute: 8, chaotic: 4, problematic: 4, suspicious: 6 } },
        { text: 'Constantly', scores: { cute: 10, chaotic: 10, problematic: 8, suspicious: 4 } },
        { text: 'I refuse to answer', scores: { cute: 6, chaotic: 8, problematic: 12, suspicious: 18 } },
      ],
    },
    {
      prompt: 'Your biggest personality flaw is:',
      options: [
        { text: 'Being too nice', scores: { cute: 16, chaotic: 2, problematic: 2, suspicious: 8 } },
        { text: 'Being stubborn', scores: { cute: 6, chaotic: 8, problematic: 14, suspicious: 6 } },
        { text: 'Being chaotic', scores: { cute: 8, chaotic: 18, problematic: 8, suspicious: 4 } },
        { text: `"I don't have one"`, scores: { cute: 4, chaotic: 8, problematic: 18, suspicious: 12 } },
      ],
    },
    {
      prompt: 'A text arrives at 2 AM. You:',
      options: [
        { text: 'Reply instantly', scores: { cute: 10, chaotic: 12, problematic: 6, suspicious: 8 } },
        { text: 'Reply at 2 PM like nothing happened', scores: { cute: 4, chaotic: 8, problematic: 16, suspicious: 10 } },
        { text: 'Read it. Leave it. Think about it.', scores: { cute: 8, chaotic: 6, problematic: 10, suspicious: 18 } },
        { text: 'Who is texting me at 2 AM', scores: { cute: 6, chaotic: 10, problematic: 8, suspicious: 12 } },
      ],
    },
    {
      prompt: 'If someone says "trust me", you:',
      options: [
        { text: 'Trust them', scores: { cute: 14, chaotic: 8, problematic: 2, suspicious: 2 } },
        { text: 'Ask for details', scores: { cute: 6, chaotic: 2, problematic: 6, suspicious: 14 } },
        { text: 'Smile and not trust them', scores: { cute: 8, chaotic: 6, problematic: 14, suspicious: 16 } },
        { text: 'Immediately make it a bet', scores: { cute: 6, chaotic: 16, problematic: 12, suspicious: 6 } },
      ],
    },
    {
      prompt: 'Someone flirts with you. You:',
      options: [
        { text: 'Handle it like a professional', scores: { cute: 8, chaotic: 4, problematic: 8, suspicious: 12 } },
        { text: 'Get shy and deny everything', scores: { cute: 18, chaotic: 6, problematic: 6, suspicious: 10 } },
        { text: 'Change the subject. Fast.', scores: { cute: 12, chaotic: 10, problematic: 8, suspicious: 14 } },
        { text: `Say "${girl.calledMe}" and move on`, scores: { cute: 10, chaotic: 12, problematic: 14, suspicious: 8 } },
      ],
    },
    {
      prompt: 'Someone annoys you. You:',
      options: [
        { text: 'Stay calm and let it go', scores: { cute: 10, chaotic: 2, problematic: 4, suspicious: 12 } },
        { text: 'Get mad immediately', scores: { cute: 8, chaotic: 14, problematic: 16, suspicious: 4 } },
        { text: 'Get mad, then pretend I was never mad', scores: { cute: 12, chaotic: 10, problematic: 14, suspicious: 12 } },
        { text: 'Remember it forever', scores: { cute: 6, chaotic: 8, problematic: 18, suspicious: 16 } },
      ],
    },
  ],
  // Threat level is chosen from the average of chaotic + problematic + suspicious.
  // `min` = lowest average (0–100) that triggers the level. Highest matching wins.
  threatLevels: [
    { min: 0, label: 'LOW', icon: '🟢', verdict: 'Suspiciously well-behaved. We are not buying it.' },
    { min: 45, label: 'MODERATE', icon: '🟡', verdict: 'Some irregularities noted. Monitoring will continue.' },
    { min: 60, label: 'HIGH', icon: '⚠️', verdict: 'Further investigation is strongly recommended.' },
    { min: 75, label: 'EXTREME', icon: '🚨', verdict: 'Subject is a certified problem. Investigator is fine with it.' },
  ],
  resultTitle: 'SUBJECT ANALYSIS COMPLETE',
  button: 'COLLECT THE EVIDENCE',
}

/* -------------------------------------------------------------------------
   7. SCREEN 5 — MINI GAME: COLLECT THE EVIDENCE
   Tap real evidence. Avoid fake evidence (3 strikes = case dismissed, retry).
   ------------------------------------------------------------------------- */
export const game = {
  title: 'COLLECT THE EVIDENCE',
  subtitle: 'Tap the real evidence. Avoid the fake stuff. Credibility is on the line.',
  goal: 5, // how many real pieces she has to collect
  maxStrikes: 3,
  startButton: 'START COLLECTING',
  retryButton: 'TRY AGAIN',
  skipLabel: 'skip this part',
  winTitle: 'EVIDENCE COLLECTED.',
  winLine: 'Unfortunately, the evidence is becoming increasingly difficult to explain.',
  loseTitle: 'CASE DISMISSED.',
  loseLine: 'Too much fake evidence. Credibility has left the building.',
  button: 'FILE THE FINAL REPORT',
  real: [
    "You're actually funny.",
    "Okay fine, you're pretty.",
    'I like talking to you.',
    "Great taste. Mostly.",
    'Somehow always good company.',
    'Suspiciously easy to talk to.',
    'Makes bad days 20% better.',
    'Gets shy. Pretends she does not.',
    'Funny even when she is annoyed.',
  ],
  fake: [
    'She is always right.',
    'Never gets mad. Ever.',
    `Has never once said "${girl.calledMe}".`,
    'Takes teasing with zero reaction.',
    'Never loses an argument.',
    'Has never been late. Ever.',
    'Replies in under 2 seconds.',
    'Totally normal. Nothing to see.',
  ],
}

/* -------------------------------------------------------------------------
   8. SCREEN 6 — FINAL REPORT
   ------------------------------------------------------------------------- */
export const finalReport = {
  title: 'FINAL INVESTIGATION REPORT',
  caseStatus: 'INCONCLUSIVE',
  evidence: 'OVERWHELMING',
  threatLevel: 'HIGH',
  preConclusion: 'After careful investigation, we have reached one conclusion.',
  conclusion: "You're actually pretty cool.",
  followUp: "Don't let this website inflate your ego though.",

  secret: {
    buttonLabel: 'DO NOT CLICK',
    line1: 'Why did you click that?',
    line2: "Yeah... that's exactly what I expected.",
    leaveButton: 'Okay, you can leave now.',
    terminated: 'Investigation terminated.',
    reopened: '...or is it?',
  },

  offTheRecord: {
    title: 'OFF THE RECORD',
    lines: [
      "I made this because I thought you'd find it funny.",
      'Also because I had too much free time apparently.',
      "Anyway, don't get used to this.",
    ],
    signature: `— ${girl.investigatorName}`,
  },
}

/* -------------------------------------------------------------------------
   9. NAVIGATION LABELS (progress tracker)
   ------------------------------------------------------------------------- */
export const sections = [
  { id: 'case', label: 'CASE FILE' },
  { id: 'brief', label: 'BRIEFING' },
  { id: 'evidence', label: 'EVIDENCE ROOM' },
  { id: 'analysis', label: 'SUBJECT ANALYSIS' },
  { id: 'game', label: 'FIELD WORK' },
  { id: 'report', label: 'FINAL REPORT' },
]
