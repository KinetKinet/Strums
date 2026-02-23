import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from './models/Lesson.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/strums';

const chapters = [
  {
    chapter: 1,
    tag: 'Chapter 1',
    title: 'Parts of the Guitar',
    description: "Before you start playing, it's important to know your instrument. Let's explore the anatomy of a guitar!",
    data: {
      infoCards: [
        { title: 'Headstock', text: 'Located at the top of the guitar, it holds the tuning pegs used to tune your strings.' },
        { title: 'Neck', text: 'The long part you wrap your hand around. Contains the fretboard where you press chords.' },
        { title: 'Body', text: 'The large part of the guitar. On acoustic guitars, this is where the sound resonates.' },
        { title: 'Strings', text: 'Standard guitars have 6 strings, numbered 1-6 from thinnest (high E) to thickest (low E).' }
      ],
      stringNames: 'From thickest to thinnest: E - A - D - G - B - e. A helpful way to remember: "Eddie Ate Dynamite, Good Bye Eddie"',
      keyTerms: [
        { term: 'Frets', text: 'The metal strips on the neck. Pressing behind a fret changes the pitch of the string.' },
        { term: 'Nut', text: 'The small piece at the top of the neck that keeps strings in place.' },
        { term: 'Soundhole', text: 'The circular opening on acoustic guitars that projects sound.' },
        { term: 'Bridge', text: 'Anchors the strings to the body at the bottom.' }
      ]
    }
  },
  {
    chapter: 2,
    tag: 'Chapter 2',
    title: 'Strumming Technique',
    description: "Good strumming technique is the foundation of rhythm guitar. Let's get your right hand moving!",
    data: {
      infoCards: [
        { title: 'Pick Hold', text: 'Hold the pick between your thumb and index finger. Keep a firm but relaxed grip.' },
        { title: 'Wrist Motion', text: 'Strum from your wrist, not your elbow. Small, fluid movements sound better.' },
        { title: 'Downstroke', text: 'Brush the strings downward from low E to high e. This is your basic strum.' },
        { title: 'Upstroke', text: 'Brush upward from high e to low E. Lighter than downstrokes — used for rhythm fills.' }
      ],
      pattern: 'Start with: D – D – U – D – U (D = Downstroke, U = Upstroke). Count it as: 1 – 2 – and – 3 – and',
      practice: ['Practice strumming open strings (no chords) to get the motion right.', 'Use a metronome or drum track at 60 BPM to keep steady time.', 'Add a simple chord like Em and strum along.', 'Gradually increase your speed as you get more comfortable.']
    }
  },
  {
    chapter: 3,
    tag: 'Chapter 3',
    title: 'Plucking Technique',
    description: "Fingerpicking adds a whole new dimension to your playing. Let's learn the basics of plucking individual strings!",
    data: {
      infoCards: [
        { title: 'Finger Position', text: 'Use your thumb (p), index (i), middle (m), and ring (a) fingers for different strings.' },
        { title: 'Thumb Role', text: 'Your thumb handles the bass strings (E, A, D). Keep it relaxed and slightly curved.' },
        { title: 'Rest Stroke', text: 'After plucking, your finger rests on the next string. Great for melody playing.' },
        { title: 'Free Stroke', text: 'After plucking, your finger moves away freely. Used for fingerpicking patterns.' }
      ],
      pattern: 'Try: Thumb (E) → Index (G) → Middle (B) → Ring (e) → Middle (B) → Index (G) — classic "Travis picking" pattern.',
      practice: ['Assign each finger to its string: Thumb=E/A/D, Index=G, Middle=B, Ring=e', 'Practice the pattern on open strings slowly without a chord.', 'Add a G chord and keep the pattern going.', 'Try switching chords (G to Cadd9) while maintaining the pattern.']
    }
  },
  {
    chapter: 4,
    tag: 'Chapter 4',
    title: '4 Chords to Start',
    description: "These 4 chords unlock hundreds of songs. Master these and you're officially a guitar player!",
    data: {
      chords: [
        { name: 'G', hint: 'Fingers: 2, 3, 4 — Frets: 3, 2, 3' },
        { name: 'C', hint: 'Fingers: 1, 2, 3 — Frets: 1, 2, 3' },
        { name: 'Em', hint: 'Fingers: 2, 3 — Frets: 2, 2' },
        { name: 'D', hint: 'Fingers: 1, 2, 3 — Frets: 2, 3, 2' }
      ],
      tips: ['Press your fingertips just behind the fret wire — not on top of it.', 'Keep your thumb behind the neck for better reach.', 'Pluck each string individually to check for buzzing or muted strings.', 'Practice switching between G and C until it feels smooth.'],
      challenge: 'Try playing G - Em - C - D in a loop.'
    }
  },
  {
    chapter: 5,
    tag: 'Chapter 5',
    title: 'Additional Chords',
    description: "Ready to expand your chord vocabulary? These chords will open up even more songs and styles!",
    data: {
      chords: [
        { name: 'Am', hint: 'Minor feel — Easy shape' },
        { name: 'F', hint: 'Barre chord — Intermediate' },
        { name: 'A', hint: 'Major — 3 finger shape' },
        { name: 'E', hint: 'Full & bright — Beginner-friendly' },
        { name: 'Dm', hint: 'Dark tone — Upper 4 strings' },
        { name: 'B7', hint: 'Transitions — to F & B' }
      ],
      progressions: ['Am - F - C - G', 'E - A - D - A', 'Dm - Am - Bb - C'],
      tip: "Don't try to learn all chords at once. Add 1-2 new chords per week and practice them in real songs you love!"
    }
  }
];

async function run() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    await Lesson.deleteMany({});
    await Lesson.insertMany(chapters);
    console.log('Seeded lessons successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

run();
