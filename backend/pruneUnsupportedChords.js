import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ChordPattern from './models/ChordLibrary.js';
import { ALLOWED_CHORD_NAMES } from './config/allowedChordNames.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await ChordPattern.deleteMany({
      name: { $nin: ALLOWED_CHORD_NAMES },
    });

    const remaining = await ChordPattern.find({}, { name: 1 }).sort({ name: 1 }).lean();

    console.log(JSON.stringify({
      deletedCount: result.deletedCount,
      remaining: remaining.map((row) => row.name),
    }, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
