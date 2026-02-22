
const chordPatterns = {
  'C-Major': { frets: [0, 3, 2, 0, 1, 0], fingers: ['x', '3', '2', '0', '1', '0'] },
  'C-Minor': { frets: [-1, 3, 1, 0, 1, 3], fingers: ['x', '3', '1', '0', '1', '4'] },
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

  let html = `
    <div class="diagram-wrapper">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map(s => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </div>
          <div class="fretboard">
  `;

  for (let fret = 0; fret <= 4; fret++) {
    html += '<div class="fret">';
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      html += '<div class="string-position">';
      html += '<div class="string-line"></div>';
      
      if (currentChord.frets[stringIndex] === fret && fret > 0) {
        html += `
          <div class="finger-dot">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      }
      
      if (currentChord.frets[stringIndex] === 0 && fret === 0) {
        html += '<div class="open-string">O</div>';
      }
      
      if (currentChord.frets[stringIndex] === -1 && fret === 0) {
        html += '<div class="muted-string">×</div>';
      }
      
      html += '</div>';
    }
    html += '</div>';
  }

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
