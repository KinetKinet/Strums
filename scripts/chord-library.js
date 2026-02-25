
const chordPatterns = {
  'C-Major': { frets: [0, 3, 2, 0, 1, 0], fingers: ['0', '3', '2', '0', '1', '0'] },
  'C-Minor': { frets: [-1, 3, 1, 0, 1, 3], fingers: ['x', '3', '1', '0', '1', '4'], barre: { fret: 1, strings: [0, 4, 5] } },
  'C-7': { frets: [0, 3, 2, 3, 1, 0], fingers: ['x', '3', '2', '4', '1', '0'] },
  'C-Major7': { frets: [0, 3, 2, 0, 0, 0], fingers: ['x', '3', '2', '0', '0', '0'] },
  'C-Minor7': { frets: [-1, 3, 1, 3, 1, 3], fingers: ['x', '3', '1', '4', '1', '4'] },
  'C-Dim': { frets: [-1, 3, 1, 2, 1, 2], fingers: ['x', '4', '1', '3', '1', '2'] },
  'C-Aug': { frets: [-1, 3, 2, 1, 1, 0], fingers: ['x', '4', '3', '2', '1', '0'] },
  'C-Sus4': { frets: [-1, 3, 3, 0, 1, 1], fingers: ['x', '3', '4', '0', '1', '1'] },
  'C-Sus2': { frets: [-1, 3, 0, 0, 1, 3], fingers: ['x', '3', '0', '0', '1', '4'] },
  
  'G-Major': { frets: [3, 2, 0, 0, 0, 3], fingers: ['3', '2', '0', '0', '0', '4'] },
  'G-Minor': { frets: [3, 1, 0, 0, 3, 3], fingers: ['3', '1', '0', '0', '3', '4'] },
  'G-7': { frets: [3, 2, 0, 0, 0, 1], fingers: ['3', '2', '0', '0', '0', '1'] },
  'G-Major7': { frets: [3, 2, 0, 0, 0, 2], fingers: ['3', '2', '0', '0', '0', '4'] },
  'G-Minor7': { frets: [3, 1, 0, 0, 3, 1], fingers: ['3', '1', '0', '0', '4', '1'] },
  
  'D-Major': { frets: [-1, -1, 0, 2, 3, 2], fingers: ['x', 'x', '0', '1', '3', '2'] },
  'D-Minor': { frets: [-1, -1, 0, 2, 3, 1], fingers: ['x', 'x', '0', '2', '3', '1'] },
  'D-7': { frets: [-1, -1, 0, 2, 1, 2], fingers: ['x', 'x', '0', '2', '1', '3'] },
  'D-Major7': { frets: [-1, -1, 0, 2, 2, 2], fingers: ['x', 'x', '0', '1', '1', '1'] },
  
  'A-Major': { frets: [-1, 0, 2, 2, 2, 0], fingers: ['x', '0', '1', '2', '3', '0'] },
  'A-Minor': { frets: [-1, 0, 2, 2, 1, 0], fingers: ['x', '0', '2', '3', '1', '0'] },
  'A-7': { frets: [-1, 0, 2, 0, 2, 0], fingers: ['x', '0', '2', '0', '3', '0'] },
  'A-Major7': { frets: [-1, 0, 2, 1, 2, 0], fingers: ['x', '0', '2', '1', '3', '0'] },
  
  'E-Major': { frets: [0, 2, 2, 1, 0, 0], fingers: ['0', '2', '3', '1', '0', '0'] },
  'E-Minor': { frets: [0, 2, 2, 0, 0, 0], fingers: ['0', '2', '3', '0', '0', '0'] },
  'E-7': { frets: [0, 2, 0, 1, 0, 0], fingers: ['0', '2', '0', '1', '0', '0'] },
  'E-Major7': { frets: [0, 2, 1, 1, 0, 0], fingers: ['0', '2', '1', '3', '0', '0'] },
  
  'F-Major': { frets: [1, 3, 3, 2, 1, 1], fingers: ['1', '3', '3', '2', '1', '1'], barre: { fret: 1, strings: [0, 4, 5] } },
  'F-Minor': { frets: [1, 3, 3, 1, 1, 1], fingers: ['1', '3', '3', '1', '1', '1'], barre: { fret: 1, strings: [0, 3, 4, 5] } },
  'F-7': { frets: [1, 3, 1, 2, 1, 1], fingers: ['1', '3', '1', '2', '1', '1'], barre: { fret: 1, strings: [0, 4, 5] } },
  'F-Major7': { frets: [1, 3, 3, 2, 1, 0], fingers: ['1', '3', '3', '2', '1', '0'], barre: { fret: 1, strings: [0, 4, 5] } },
  
  'B-Major': { frets: [-1, 2, 4, 4, 4, 2], fingers: ['x', '1', '2', '3', '4', '1'], barre: { fret: 2, strings: [1, 5] } },
  'B-Minor': { frets: [2, 3, 4, 4, 3, 2], fingers: ['1', '2', '3', '4', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  'B-7': { frets: [2, 4, 2, 4, 3, 2], fingers: ['1', '3', '1', '4', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  'B-Major7': { frets: [2, 4, 4, 4, 3, 2], fingers: ['1', '3', '3', '3', '2', '1'], barre: { fret: 2, strings: [0, 5] } },
  
  'F#-Major': { frets: [2, 4, 4, 3, 2, 2], fingers: ['1', '3', '3', '2', '1', '1'], barre: { fret: 2, strings: [0, 4, 5] } },
  'F#-Minor': { frets: [2, 4, 4, 2, 2, 2], fingers: ['1', '3', '3', '1', '1', '1'], barre: { fret: 2, strings: [0, 3, 4, 5] } },
  
  'C#-Major': { frets: [4, 6, 6, 6, 6, 4], fingers: ['1', '3', '3', '3', '3', '1'], barre: { fret: 4, strings: [0, 1, 2, 3, 4, 5] } },
  'C#-Minor': { frets: [4, 5, 6, 6, 5, 4], fingers: ['1', '2', '3', '4', '2', '1'], barre: { fret: 4, strings: [0, 5] } },
};

const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const types = ['Major', 'Minor', '5', '7', 'Major7', 'Minor7', 'Dim', 'Aug', 'Sus4', 'Sus2'];
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
      if (chordFret === 0 && fretNum === fretRange[0] && !hasBarre) {
        html += '<div class="open-string">O</div>';
      }
      
      // Show muted string marker at the first fret position (appears above due to absolute positioning)
      if (chordFret === -1 && fretNum === fretRange[0] && !hasBarre) {
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
          ${hasBarre ? `
          <div class="legend-item">
            <div class="legend-dot-barre"></div>
            <span>Barre</span>
          </div>
          ` : ''}
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
