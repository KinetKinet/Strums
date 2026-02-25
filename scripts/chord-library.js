
const chordPatterns = {
  'C-Major': { frets: [-1, 3, 2, 0, 1, 0], fingers: ['x', '3', '2', '0', '1', '0'], barre: {fret: 1, strings:[] } },
  'C-Minor': { frets: [-1, 3, 5, 5, 4, 3], fingers: ['x', '1', '3', '4', '2', '1'], barre: { fret: 3, strings: [1, 5] } },
  'C-5': { frets: [-1, 3, 5, 5, -1, -1], fingers: ['x', '1', '3', '4', 'x', 'x'], barre: {fret: 3, strings:[] } },
  'C-7': { frets: [-1, 3, 2, 3, 1, -1], fingers: ['x', '3', '2', '4', '1', 'x'], barre: {fret: 1, strings:[] } },
  'C-Major7': { frets: [-1, 3, 2, 0, 0, 0], fingers: ['x', '2', '1', '0', '0', '0'], barre: {fret: 1, strings:[] } },
  'C-Minor7': { frets: [-1, 3, 5, -2, 4, 3], fingers: ['x', '1', '3', '1', '2', '1'], barre: {fret: 3, strings:[1, 5] } },
  'C-Sus4': { frets: [-1, 3, 5, 5, 6, 3], fingers: ['x', '1', '2', '3', '4', '1'], barre: {fret: 3, strings:[1, 5] } },
  'C-Sus2': { frets: [-1, 3, 5, 5, -2, 3], fingers: ['x', '1', '3', '4', '0', '1'], barre: {fret: 3, strings:[1, 5] } },
  'C-Add9': { frets: [-1, 3, 2, 0, 3, 0], fingers: ['x', '2', '1', '0', '3', '0'], barre: {fret: 1, strings:[] } },
  'C-9': { frets: [-1, 3, 2, 3, 3, -1], fingers: ['x', '2', '1', '3', '4', '0'], barre: {fret: 2, strings:[] } },
  
  'C#-Major': { frets: [-1, 4, 3, 1, 2, 1], fingers: ['x', '4', '3', '1', '2', '1'], barre: { fret: 1, strings: [3, 5] } },
  'C#-Minor': { frets: [-1, 4, 6, 6, 5, 4], fingers: ['x', '1', '3', '4', '2', '1'], barre: { fret: 4, strings: [1, 5] } },
  'C#-5': { frets: [-1, 4, 6, 6, -1, -1], fingers: ['x', '1', '3', '4', 'x', 'x'], barre: {fret: 4, strings:[] } },
  'C#-7': { frets: [-1, 4, 3, 4, 2, -1], fingers: ['x', '3', '2', '4', '1', 'x'], barre: {fret: 2, strings:[] } },
  'C#-Major7': { frets: [-1, 4, 3, 1, -2, 1], fingers: ['x', '4', '3', '1', '1', '1'], barre: {fret: 1, strings:[3, 5] } },
  'C#-Minor7': { frets: [-1, 4, 6, -2, 5, 4], fingers: ['x', '1', '3', '1', '2', '1'], barre: {fret: 4, strings:[1, 5] } },
  'C#-Sus4': { frets: [-1, 4, 6, 6, 7, 4], fingers: ['x', '1', '2', '3', '4', '1'], barre: {fret: 4, strings:[1, 5] } },
  'C#-Sus2': { frets: [-1, 4, 6, 6, -2, 4], fingers: ['x', '1', '3', '4', '1', '1'], barre: {fret: 4, strings:[1, 5] } },
  'C#-Add9': { frets: [-1, -1, 11, 10, 9, 11], fingers: ['x', 'x', '3', '2', '1', '4'], barre: {fret: 9, strings:[] } },
  'C#-9': { frets: [-1, 4, 3, 4, 4, -1], fingers: ['x', '2', '1', '3', '4', 'x'], barre: {fret: 3, strings:[] } },

  'D-Major': { frets: [-1, -1, 0, 2, 3, 2], fingers: ['x', 'x', '0', '1', '3', '2'], barre: {fret: 1, strings:[] } },
  'D-Minor': { frets: [-1, -1, 0, 2, 3, 1], fingers: ['x', 'x', '0', '2', '3', '1'], barre: {fret: 1, strings:[] } },
  'D-5': { frets: [-1, -1, 0, 2, 3, -1], fingers: ['x', 'x', '0', '1', '2', 'x'], barre: {fret: 1, strings:[] } },
  'D-7': { frets: [-1, -1, 0, 2, 1, 2], fingers: ['x', 'x', '0', '2', '1', '3'], barre: {fret: 1, strings:[] } },
  'D-Major7': { frets: [-1, -1, 0, 2, 2, 2], fingers: ['x', 'x', '0', '1', '1', '1'], barre: {fret: 1, strings:[] } },
  'D-Minor7': { frets: [-1, -1, 0, 2, 1, 1], fingers: ['x', 'x', '0', '2', '1', '1'], barre: {fret: 1, strings:[4, 5] } },
  'D-Sus4': { frets: [-1, -1, 0, 2, 3, 3], fingers: ['x', 'x', '0', '1', '2', '3'], barre: {fret: 1, strings:[] } },
  'D-Sus2': { frets: [-1, -1, 0, 2, 3, 0], fingers: ['x', 'x', '0', '1', '2', '0'], barre: {fret: 1, strings:[] } },
  'D-Add9': { frets: [-1, -1, 12, 11, 10, 12], fingers: ['x', 'x', '3', '2', '1', '4'], barre: {fret: 10, strings:[] } },
  'D-9': { frets: [-1, 5, 4, 5, 5, -1], fingers: ['x', '2', '1', '3', '4', 'x'], barre: {fret: 4, strings:[] } },

  'D#-Major': { frets: [-1, -1, 1, 3, 4, 3], fingers: ['x', 'x', '1', '2', '4', '3'], barre: {fret: 1, strings:[] } },
  'D#-Minor': { frets: [-1, -1, 1, 3, 4, 2], fingers: ['x', 'x', '1', '2', '3', '4'], barre: {fret: 1, strings:[] } },
  'D#-5': { frets: [-1, -1, 1, 3, 4, -1], fingers: ['x', 'x', '1', '3', '4', 'x'], barre: {fret: 1, strings:[] } },
  'D#-7': { frets: [-1, -1, 1, 3, 2, 3], fingers: ['x', 'x', '1', '3', '2', '4'], barre: {fret: 1, strings:[] } },
  'D#-Major7': { frets: [-1, -1, 1, 3, 3, 3], fingers: ['x', 'x', '1', '2', '3', '4'], barre: {fret: 1, strings:[] } },
  'D#-Minor7': { frets: [-1, -1, 1, 3, 2, 2], fingers: ['x', 'x', '1', '4', '2', '3'], barre: {fret: 1, strings:[] } },
  'D#-Sus4': { frets: [-1, -1, 1, 3, 4, 4], fingers: ['x', 'x', '1', '2', '3', '4'], barre: {fret: 1, strings:[] } },
  'D#-Sus2': { frets: [-1, -1, 1, 3, 4, 1], fingers: ['x', 'x', '1', '3', '4', '1'], barre: {fret: 1, strings:[2, 5] } },
  'D#-Add9': { frets: [-1, -1, 13, 12, 11, 13], fingers: ['x', 'x', '3', '2', '1', '4'], barre: {fret: 11, strings:[] } },
  'D#-9': { frets: [-1, -1, 1, 0, 2, 1], fingers: ['x', 'x', '1', '0', '3', '2'], barre: {fret: 1, strings:[] } },
  
  'E-Major': { frets: [0, 2, 2, 1, 0, 0], fingers: ['0', '2', '3', '1', '0', '0'], barre: {fret: 1, strings:[] } },
  'E-Minor': { frets: [0, 2, 2, 0, 0, 0], fingers: ['0', '2', '3', '0', '0', '0'], barre: {fret: 1, strings:[] } },
  'E-5': { frets: [0, 2, 2, -1, -1, -1], fingers: ['0', '2', '3', 'x', 'x', 'x'], barre: {fret: 1, strings:[] } },
  'E-7': { frets: [0, 2, 0, 1, 0, 0], fingers: ['0', '2', '0', '1', '0', '0'], barre: {fret: 1, strings:[] } },
  'E-Major7': { frets: [0, 2, 1, 1, 0, -1], fingers: ['0', '3', '1', '2', '0', 'x'], barre: {fret: 1, strings:[] } },
  'E-Minor7': { frets: [0, 2, 0, 0, 0, 0], fingers: ['0', '1', '0', '0', '0', '0'], barre: {fret: 1, strings:[] } },
  'E-Sus4': { frets: [0, 2, 2, 2, 0, 0], fingers: ['0', '1', '2', '3', '0', '0'], barre: {fret: 1, strings:[] } },
  'E-Sus2': { frets: [-1, -1, 2, 4, 5, 2], fingers: ['x', 'x', '1', '3', '4', '1'], barre: {fret: 2, strings:[2, 5] } },
  'E-Add9': { frets: [-1, -1, 2, 1, 0, 2], fingers: ['x', 'x', '2', '1', '0', '3'], barre: {fret: 1, strings:[] } },
  'E-9': { frets: [-1, -1, 2, 1, 3, 2], fingers: ['x', 'x', '2', '1', '4', '3'], barre: {fret: 1, strings:[] } },

  'F-Major': { frets: [1, 3, 3, 2, -2, 1], fingers: ['1', '3', '4', '2', '1', '1'], barre: { fret: 1, strings: [0, 5] } },
  'F-Minor': { frets: [1, 3, 3, -2, -2, 1], fingers: ['1', '3', '4', '1', '1', '1'], barre: { fret: 1, strings: [0, 5] } },
  'F-5': { frets: [1, 3, 3, -1, -1, -1], fingers: ['1', '3', '4', 'x', 'x', 'x'], barre: { fret: 1, strings: [] } },
  'F-7': { frets: [1, 3, -2, 2, -2, 1], fingers: ['1', '3', '1', '2', '1', '1'], barre: { fret: 1, strings: [0, 5] } },
  'F-Major7': { frets: [-1, -1, 3, 2, 1, 0], fingers: ['x', 'x', '3', '2', '1', '0'], barre: { fret: 1, strings: [] } },
  'F-Minor7': { frets: [1, 3, -2, -2, -2, 1], fingers: ['1', '3', '1', '1', '1', '1'], barre: { fret: 1, strings: [0, 5] } },
  'F-Sus4': { frets: [1, 3, 3, 3, -2, 1], fingers: ['1', '2', '3', '4', '1', '1'], barre: { fret: 1, strings: [0, 5] } },
  'F-Sus2': { frets: [-1, -1, 3, 5, 6, 3], fingers: ['x', 'x', '1', '3', '4', '1'], barre: { fret: 3, strings: [2, 5] } },
  'F-Add9': { frets: [-1, -1, 3, 2, 1, 3], fingers: ['1', '3', '3', '2', '1', '4'], barre: { fret: 1, strings: [] } },
  'F-9': { frets: [-1, -1, 3, 2, 4, 3], fingers: ['x', 'x', '2', '1', '3', '4'], barre: { fret: 2, strings: [] } },

  'F#-Major': { frets: [2, 4, 4, 3, -2, 2], fingers: ['1', '3', '4', '2', '1', '1'], barre: { fret: 2, strings: [0, 5] } },
  'F#-Minor': { frets: [2, 4, 4, -2, -2, 2], fingers: ['1', '3', '4', '1', '1', '1'], barre: { fret: 2, strings: [0, 5] } },
  'F#-5': { frets: [2, 4, 4, -1, -1, -1], fingers: ['1', '3', '4', 'x', 'x', 'x'], barre: { fret: 2, strings: [] } },
  'F#-7': { frets: [2, 4, -2, 3, -2, 2], fingers: ['1', '3', '1', '2', '1', '1'], barre: { fret: 2, strings: [0, 5] } },
  'F#-Major7': { frets: [-1, -1, 4, 3, 2, 1], fingers: ['x', 'x', '4', '3', '2', '1'], barre: { fret: 1, strings: [] } },
  'F#-Minor7': { frets: [2, 4, -2, -2, -2, 2], fingers: ['1', '3', '1', '1', '1', '1'], barre: { fret: 2, strings: [0, 5] } },
  'F#-Sus4': { frets: [2, 4, 4, 4, -2, 2], fingers: ['1', '2', '3', '4', '1', '1'], barre: { fret: 2, strings: [0, 5] } },
  'F#-Sus2': { frets: [-1, -1, 4, 6, 7, 4], fingers: ['x', 'x', '1', '3', '4', '1'], barre: { fret: 4, strings: [2, 5] } },
  'F#-Add9': { frets: [-1, -1, 4, 3, 2, 4], fingers: ['x', 'x', '3', '2', '1', '4'], barre: { fret: 2, strings: [] } },
  'F#-9': { frets: [-1, -1, 4, 3, 5, 4], fingers: ['x', 'x', '2', '1', '4', '3'], barre: { fret: 3, strings: [] } },
  
  'G-Major': { frets: [3, 2, 0, 0, 0, 3], fingers: ['2', '1', '0', '0', '0', '3'], barre: {fret: 1, strings:[] } },
  'G-Minor': { frets: [3, 5, 5, -2, -2, 3], fingers: ['1', '3', '4', '1', '1', '1'], barre: {fret: 3, strings:[0, 5] } },
  'G-5': { frets: [3, 5, 5, -1, -1, -1], fingers: ['1', '3', '4', 'x', 'x', 'x'], barre: {fret: 3, strings:[] } },
  'G-7': { frets: [3, 5, -2, 4, -2, 3], fingers: ['1', '3', '1', '2', '1', '1'], barre: {fret: 3, strings:[0, 5] } },
  'G-Major7': { frets: [-1, -1, 5, 4, 3, 2], fingers: ['x', 'x', '4', '3', '2', '1'], barre: {fret: 2, strings:[] } },
  'G-Minor7': { frets: [3, 5, -2, -2, -2, 3], fingers: ['1', '3', '1', '1', '1', '1'], barre: {fret: 3, strings:[0, 5] } },
  'G-Sus4': { frets: [3, 5, 5, 5, -2, 3], fingers: ['1', '2', '3', '4', '1', '1'], barre: {fret: 3, strings:[0, 5] } },
  'G-Sus2': { frets: [-1, -1, 5, 7, 8, 5], fingers: ['x', 'x', '1', '3', '4', '1'], barre: { fret: 5, strings: [2, 5] } },
  'G-Add9': { frets: [-1, -1, 5, 4, 3, 5], fingers: ['x', 'x', '3', '2', '1', '4'], barre: {fret: 3, strings:[] } },
  'G-9': { frets: [-1, -1, 5, 4, 6, 5], fingers: ['x', 'x', '2', '1', '4', '3'], barre: {fret: 4, strings:[] } },

  'G#-Major': { frets: [4, 6, 6, 5, -2, 4], fingers: ['1', '3', '4', '2', '1', '1'], barre: { fret: 4, strings: [0, 5] } },
  'G#-Minor': { frets: [4, 6, 6, -2, -2, 4], fingers: ['1', '3', '4', '1', '1', '1'], barre: { fret: 4, strings: [0, 5] } },
  'G#-5': { frets: [4, 6, 6, -1, -1, -1], fingers: ['1', '3', '4', 'x', 'x', 'x'], barre: {fret: 4, strings:[] } },
  'G#-7': { frets: [4, 6, -2, 5, -2, 4], fingers: ['1', '3', '1', '4', '1', '1'], barre: { fret: 4, strings: [0, 5] } },
  'G#-Major7': { frets: [-1, -1, 6, 5, 4, 3], fingers: ['x', 'x', '4', '3', '2', '1'], barre: { fret: 3, strings: [] } },
  'G#-Minor7': { frets: [4, 6, -2, -2, -2, 4], fingers: ['1', '3', '1', '1', '1', '1'], barre: { fret: 4, strings: [0, 5] } },
  'G#-Sus4': { frets: [4, 6, 6, 6, -2, 4], fingers: ['1', '2', '3', '4', '1', '1'], barre: { fret: 4, strings: [0, 5] } },
  'G#-Sus2': { frets: [-1, -1, 6, 8, 9, 6], fingers: ['x', 'x', '1', '3', '4', '1'], barre: { fret: 6, strings: [2, 5] } },
  'G#-Add9': { frets: [-1, -1, 6, 5, 4, 6], fingers: ['x', 'x', '3', '2', '1', '4'], barre: { fret: 4, strings: [] } },
  'G#-9': { frets: [-1, -1, 6, 5, 7, 6], fingers: ['x', 'x', '2', '1', '4', '3'], barre: { fret: 5, strings: [] } },

  'A-Major': { frets: [-1, 0, 2, 2, 2, 0], fingers: ['x', '0', '1', '2', '3', '0'], barre: {fret: 1, strings:[] } },
  'A-Minor': { frets: [-1, 0, 2, 2, 1, 0], fingers: ['x', '0', '2', '3', '1', '0'], barre: {fret: 1, strings:[] } },
  'A-5': { frets: [-1, 0, 2, 2, -1, -1], fingers: ['x', '0', '1', '2', 'x', 'x'], barre: {fret: 1, strings:[] } },
  'A-7': { frets: [-1, 0, 2, 0, 2, 0], fingers: ['x', '0', '1', '0', '2', '0'], barre: {fret: 1, strings:[] } },
  'A-Major7': { frets: [-1, 0, 2, 1, 2, 0], fingers: ['x', '0', '2', '1', '3', '0'], barre: {fret: 1, strings:[] } },
  'A-Minor7': { frets: [-1, 0, 2, 0, 1, 0], fingers: ['x', '0', '2', '0', '1', '0'], barre: {fret: 1, strings:[] } },
  'A-Sus4': { frets: [-1, 0, 2, 2, 3, 0], fingers: ['x', '0', '1', '2', '3', '0'], barre: {fret: 1, strings:[] } },
  'A-Sus2': { frets: [-1, 0, 2, 2, 0, 0], fingers: ['x', '0', '1', '2', '0', '0'], barre: {fret: 1, strings:[] } },
  'A-Add9': { frets: [-1, -1, 7, 6, 5, 7], fingers: ['x', 'x', '3', '2', '1', '4'], barre: {fret: 5, strings:[] } },
  'A-9': { frets: [-1, -1, 7, 6, 8, 7], fingers: ['x', 'x', '2', '1', '4', '3'], barre: {fret: 6, strings:[] } },
  
  'A#-Major': { frets: [-1, 1, 3, 3, 3, 1], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Minor': { frets: [-1, 1, 3, 3, 2, 1], fingers: ['x', '1', '3', '4', '2', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-5': { frets: [-1, 1, 3, 3, -1, -1], fingers: ['x', '1', '3', '4', 'x', 'x'], barre: { fret: 1, strings: [] } },
  'A#-7': { frets: [-1, 1, 3, -2, 3, 1], fingers: ['x', '1', '3', '1', '4', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Major7': { frets: [-1, 1, 3, 2, 3, 1], fingers: ['x', '1', '3', '2', '4', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Minor7': { frets: [-1, 1, 3, -2, 2, 1], fingers: ['x', '1', '3', '1', '2', '2'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Sus4': { frets: [-1, 1, 3, 3, 4, 1], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Sus2': { frets: [-1, 1, 3, 3, -2, 1], fingers: ['x', '1', '3', '4', '1', '1'], barre: { fret: 1, strings: [1, 5] } },
  'A#-Add9': { frets: [-1, -1, 8, 7, 6, 8], fingers: ['x', 'x', '3', '2', '1', '4'], barre: { fret: 6, strings:[] } },
  'A#-9': { frets: [-1, 1, 0, 1, 1, -1], fingers: ['x', '1', '0', '2', '3', 'x'], barre: { fret: 1, strings: [] } },

  'B-Major': { frets: [-1, 2, 4, 4, 4, 2], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Minor': { frets: [-1, 2, 4, 4, 3, 2], fingers: ['x', '1', '3', '4', '2', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-5': { frets: [-1, 2, 4, 4, -1, -1], fingers: ['x', '1', '3', '4', 'x', 'x'], barre: { fret: 2, strings: [] } },
  'B-7': { frets: [-1, 2, 1, 2, 0, -1], fingers: ['x', '2', '1', '3', '0', 'x'], barre: { fret: 1, strings: [] } },
  'B-Major7': { frets: [-1, 2, 4, 3, 4, 2], fingers: ['x', '1', '3', '2', '4', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Minor7': { frets: [-1, 2, 4, -2, 3, 2], fingers: ['x', '1', '3', '1', '2', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Sus4': { frets: [-1, 2, 4, 4, 5, 2], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Sus2': { frets: [-1, 2, 4, 4, -2, 2], fingers: ['x', '1', '3', '4', '1', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Add9': { frets: [-1, -1, 9, 8, 7, 9], fingers: ['x', 'x', '3', '2', '1', '4'], barre: { fret: 7, strings:[] } },
  'B-9': { frets: [-1, 2, 1, 2, 2, -1], fingers: ['x', '2', '1', '3', '4', 'x'], barre: { fret: 1, strings: [] } },
  
};

const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const types = ['Major', 'Minor', '5', '7', 'Major7', 'Minor7', 'Sus4', 'Sus2', 'Add9', '9'];
const strings = ['E', 'A', 'D', 'G', 'B', 'e'];

let selectedRoot = 'C';
let selectedType = 'Major';

function getChordPattern(root, type) {
  const key = `${root}-${type}`;
  return chordPatterns[key] || { 
    frets: [0, 0, 0, 0, 0, 0], 
    fingers: ['0', '0', '0', '0', '0', '0'],
    isPlaceholder: true 
  };
}

function updateChordName() {
  document.getElementById('currentChordName').textContent = `${selectedRoot} ${selectedType}`;
  setAudioSource();
}

// Audio handling: set audio src based on current selection and play
function getAudioFilePath(root, type) {
  const fileName = `${encodeURIComponent(root)}-${encodeURIComponent(type)}.mp3`;
  return `../assets/audio/${fileName}`;
}

function setAudioSource() {
  const audioEl = document.getElementById('chordAudio');
  if (!audioEl) return;
  audioEl.src = getAudioFilePath(selectedRoot, selectedType);
}

function playCurrentChord() {
  const audioEl = document.getElementById('chordAudio');
  if (!audioEl) return;
  // refresh src in case selection changed
  setAudioSource();
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {
    // ignore play errors (autoplay restrictions) — user can click again
  });
}

function renderDiagram() {
  const currentChord = getChordPattern(selectedRoot, selectedType);
  const diagramContainer = document.getElementById('chordDiagram');
  
  if (currentChord.isPlaceholder) {
    diagramContainer.innerHTML = `
      <div class="placeholder">
        <p>Chord pattern not available</p>
        <p>Try a different combination</p>
      </div>
    `;
    return;
  }

  // Determine starting fret based on barre chord
  let startingFret = 0;
  let hasBarre = false;
  if (currentChord.barre) {
    startingFret = currentChord.barre.fret;
    hasBarre = true;
  }

  let html = `
    <div class="diagram-wrapper">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map(s => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
  `;

  // Generate visible frets
  const fretRange = [];
  if (hasBarre) {
    // For bar chords, show 5 frets starting from the barre position
    for (let i = 0; i < 5; i++) {
      fretRange.push(startingFret + i);
    }
  } else {
    // For regular chords, show frets 1-5
    for (let i = 1; i <= 5; i++) {
      fretRange.push(i);
    }
  }

  // Display fret numbers
  fretRange.forEach((fretNum) => {
    html += `<div>${fretNum}</div>`;
  });

  html += `
          </div>
          <div class="fretboard">
  `;

  // Render each visible fret
  fretRange.forEach((fretNum, fretIdx) => {
    html += '<div class="fret">';
    
    // Add barre bar if this is the barre fret (for bar chords)
    if (hasBarre && fretNum === startingFret) {
      // Calculate barre bar position and width based on which strings have the barre
      const barreStrings = currentChord.barre.strings;
      const minString = Math.min(...barreStrings);
      const maxString = Math.max(...barreStrings);
      const barreWidth = (maxString - minString + 1) * 48; // 48px = 3rem width per string position
      const barreLeft = minString * 48;
      
      html += `<div class="barre-bar" style="left: ${barreLeft}px; width: ${barreWidth}px;"></div>`;
    }

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const chordFret = currentChord.frets[stringIndex];
      html += '<div class="string-position">';
      html += '<div class="string-line"></div>';
      
      // Show finger dot if this string is played at this fret
      if (chordFret === fretNum && fretNum > 0) {
        html += `
          <div class="finger-dot">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      }
      // Show barre dot for strings on the barre
      else if (hasBarre && fretNum === startingFret && currentChord.barre.strings.includes(stringIndex)) {
        html += `<div class="barre-dot">${currentChord.fingers[stringIndex]}</div>`;
      }
      
      // Show open string marker at the first fret position (appears above due to absolute positioning)
      if (chordFret === 0 && fretNum === fretRange[0]) {
        html += '<div class="open-string">O</div>';
      }
      
      // Show muted string marker at the first fret position (appears above due to absolute positioning)
      if (chordFret === -1 && fretNum === fretRange[0]) {
        html += '<div class="muted-string">×</div>';
      }
      
      html += '</div>';
    }
    html += '</div>';
  });

  html += `
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: .5rem; padding-right: 0.25rem;">
        </div>  
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot-open"></div>
            <span>Open</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot-fret"></div>
            <span>Fret</span>
          </div>
          <div class="legend-item">
            <span style="color: #dc2626; font-size: 1.25rem; font-weight: bold;">×</span>
            <span>Muted</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot-barre"></div>
            <span>Barre</span>
          </div>
        </div>
      </div>
    </div>
  `;

  diagramContainer.innerHTML = html;
}

function selectRoot(root) {
  selectedRoot = root;
  updateRootButtons();
  updateChordName();
  renderDiagram();
}

function selectType(type) {
  selectedType = type;
  updateTypeButtons();
  updateChordName();
  renderDiagram();
}

function updateRootButtons() {
  const buttons = document.querySelectorAll('#rootButtons button');
  buttons.forEach(btn => {
    if (btn.dataset.root === selectedRoot) {
      btn.classList.add('active-root');
    } else {
      btn.classList.remove('active-root');
    }
  });
}

function updateTypeButtons() {
  const buttons = document.querySelectorAll('#typeButtons button');
  buttons.forEach(btn => {
    if (btn.dataset.type === selectedType) {
      btn.classList.add('active-type');
    } else {
      btn.classList.remove('active-type');
    }
  });
}

function initializeRootButtons() {
  const container = document.getElementById('rootButtons');
  roots.forEach(root => {
    const btn = document.createElement('button');
    btn.className = 'slider-btn';
    btn.textContent = root;
    btn.dataset.root = root;
    btn.onclick = () => selectRoot(root);
    if (root === selectedRoot) {
      btn.classList.add('active-root');
    }
    container.appendChild(btn);
  });
}

function initializeTypeButtons() {
  const container = document.getElementById('typeButtons');
  types.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'slider-btn';
    btn.textContent = type;
    btn.dataset.type = type;
    btn.onclick = () => selectType(type);
    if (type === selectedType) {
      btn.classList.add('active-type');
    }
    container.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeRootButtons();
  initializeTypeButtons();
  renderDiagram();
  // ensure audio element has correct src for initial selection
  setAudioSource();

  const playBtn = document.getElementById('playChordBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      playCurrentChord();
    });
  }
});
