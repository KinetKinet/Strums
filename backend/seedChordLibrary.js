import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import ChordPattern from './models/ChordLibrary.js';
import { ALLOWED_CHORD_NAME_SET } from './config/allowedChordNames.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO = process.env.MONGO_URI;
const dataPath = path.join(__dirname, 'chordPatterns.json');

async function run() {
  try {
    const json = fs.readFileSync(dataPath, 'utf8');
    const chords = JSON.parse(json).filter((chord) => ALLOWED_CHORD_NAME_SET.has(chord?.name));

    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for chord seeding');

    await ChordPattern.deleteMany({});
    await ChordPattern.insertMany(chords);

    console.log(`Seeded ${chords.length} chord patterns successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Chord seeding error', err);
    process.exit(1);
  }
}

run();
