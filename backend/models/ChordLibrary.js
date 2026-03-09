import mongoose from 'mongoose';

const { Schema } = mongoose;

const chordPatternSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
    trim: true,
  },
  frets: {
    type: [Number],
    required: true,
  },
  fingers: {
    type: [String],
    required: true,
  },
  barre: {
    type: {
      fret: Number,
      strings: [Number],
    },
  },
});

const ChordPattern = mongoose.model('ChordPattern', chordPatternSchema);
export default ChordPattern;