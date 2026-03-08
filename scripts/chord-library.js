import { fetchChordLibrary } from './chord-data-api.js';
import { apiJson } from './api-client.js';
import { getAuthHeaders, isAdminLoggedIn } from './admin-auth.js';

const strings = ['E', 'A', 'D', 'G', 'B', 'e'];

let chordPatterns = {};
let rowsByName = {};
let roots = [];
let types = [];

let selectedRoot = 'C';
let selectedType = 'Major';

function getChordPattern(root, type) {
  const key = `${root}-${type}`;
  return chordPatterns[key] || {
    frets: [0, 0, 0, 0, 0, 0],
    fingers: ['0', '0', '0', '0', '0', '0'],
    isPlaceholder: true,
  };
}

function updateChordName() {
  const chordName = document.getElementById('currentChordName');
  if (chordName) {
    chordName.textContent = `${selectedRoot} ${selectedType}`;
  }
  setAudioSource();
  updateAdminEditor();
}

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

  setAudioSource();
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {
    // Ignore autoplay restrictions.
  });
}

function renderDiagram() {
  const diagramContainer = document.getElementById('chordDiagram');
  if (!diagramContainer) return;

  const currentChord = getChordPattern(selectedRoot, selectedType);

  if (currentChord.isPlaceholder) {
    diagramContainer.innerHTML = `
      <div class="placeholder">
        <p>Chord pattern not available</p>
        <p>Try a different combination</p>
      </div>
    `;
    return;
  }

  let startingFret = 0;
  let hasBarre = false;
  if (currentChord.barre && typeof currentChord.barre.fret === 'number') {
    startingFret = currentChord.barre.fret;
    hasBarre = Array.isArray(currentChord.barre.strings) && currentChord.barre.strings.length > 0;
  }

  let html = `
    <div class="diagram-wrapper">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map((s) => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
  `;

  const fretRange = [];
  if (hasBarre) {
    for (let i = 0; i < 5; i += 1) {
      fretRange.push(startingFret + i);
    }
  } else {
    for (let i = 1; i <= 5; i += 1) {
      fretRange.push(i);
    }
  }

  fretRange.forEach((fretNum) => {
    html += `<div>${fretNum}</div>`;
  });

  html += `
          </div>
          <div class="fretboard">
  `;

  fretRange.forEach((fretNum) => {
    html += '<div class="fret">';

    if (hasBarre && fretNum === startingFret) {
      const barreStrings = currentChord.barre.strings;
      const minString = Math.min(...barreStrings);
      const maxString = Math.max(...barreStrings);
      const barreWidth = (maxString - minString + 1) * 48;
      const barreLeft = minString * 48;

      html += `<div class="barre-bar" style="left: ${barreLeft}px; width: ${barreWidth}px;"></div>`;
    }

    for (let stringIndex = 0; stringIndex < 6; stringIndex += 1) {
      const chordFret = currentChord.frets[stringIndex];
      html += '<div class="string-position">';
      html += '<div class="string-line"></div>';

      if (chordFret === fretNum && fretNum > 0) {
        html += `
          <div class="finger-dot">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      } else if (hasBarre && fretNum === startingFret && currentChord.barre.strings.includes(stringIndex)) {
        html += `<div class="barre-dot">${currentChord.fingers[stringIndex]}</div>`;
      }

      if (chordFret === 0 && fretNum === fretRange[0]) {
        html += '<div class="open-string">O</div>';
      }

      if (chordFret === -1 && fretNum === fretRange[0]) {
        html += '<div class="muted-string">x</div>';
      }

      html += '</div>';
    }

    html += '</div>';
  });

  html += `
          </div>
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
            <span style="color: #dc2626; font-size: 1.25rem; font-weight: bold;">x</span>
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
  buttons.forEach((btn) => {
    if (btn.dataset.root === selectedRoot) {
      btn.classList.add('active-root');
    } else {
      btn.classList.remove('active-root');
    }
  });
}

function updateTypeButtons() {
  const buttons = document.querySelectorAll('#typeButtons button');
  buttons.forEach((btn) => {
    if (btn.dataset.type === selectedType) {
      btn.classList.add('active-type');
    } else {
      btn.classList.remove('active-type');
    }
  });
}

function initializeRootButtons() {
  const container = document.getElementById('rootButtons');
  if (!container) return;

  container.innerHTML = '';
  roots.forEach((root) => {
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
  if (!container) return;

  container.innerHTML = '';
  types.forEach((type) => {
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

function showLoadError() {
  const diagramContainer = document.getElementById('chordDiagram');
  if (!diagramContainer) return;

  diagramContainer.innerHTML = `
    <div class="placeholder">
      <p>Unable to load chord library data.</p>
      <p>Please try refreshing the page.</p>
    </div>
  `;
}

function getSelectedChordRow() {
  const key = `${selectedRoot}-${selectedType}`;
  return rowsByName[key] || null;
}

function parseNumberArray(input) {
  return input
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => Number(part));
}

function updateAdminEditor() {
  const panel = document.getElementById('adminChordEditor');
  if (!panel) return;

  if (!isAdminLoggedIn()) {
    panel.hidden = true;
    return;
  }

  const row = getSelectedChordRow();
  if (!row) {
    panel.hidden = false;
    panel.innerHTML = '<p class="admin-edit-msg">No database row found for selected chord.</p>';
    return;
  }

  const frets = Array.isArray(row.frets) ? row.frets.join(',') : '';
  const fingers = Array.isArray(row.fingers) ? row.fingers.join(',') : '';
  const barreFret = row.barre?.fret ?? '';
  const barreStrings = Array.isArray(row.barre?.strings) ? row.barre.strings.join(',') : '';

  panel.hidden = false;
  panel.innerHTML = `
    <h3>Admin Chord Editor</h3>
    <p>Editing: <strong>${row.name}</strong></p>
    <label>Name <input id="admin-chord-name" type="text" value="${row.name}" /></label>
    <label>Frets (comma-separated) <input id="admin-chord-frets" type="text" value="${frets}" /></label>
    <label>Fingers (comma-separated) <input id="admin-chord-fingers" type="text" value="${fingers}" /></label>
    <label>Barre Fret <input id="admin-chord-barre-fret" type="number" value="${barreFret}" /></label>
    <label>Barre Strings (comma-separated indexes) <input id="admin-chord-barre-strings" type="text" value="${barreStrings}" /></label>
    <div class="admin-edit-actions">
      <button id="admin-save-chord" type="button">Save Chord</button>
      <span id="admin-save-chord-msg" class="admin-edit-msg"></span>
    </div>
  `;

  const saveBtn = document.getElementById('admin-save-chord');
  saveBtn?.addEventListener('click', async () => {
    const msg = document.getElementById('admin-save-chord-msg');

    try {
      const updatedPayload = {
        name: document.getElementById('admin-chord-name').value.trim(),
        frets: parseNumberArray(document.getElementById('admin-chord-frets').value),
        fingers: document.getElementById('admin-chord-fingers').value.split(',').map((x) => x.trim()),
        barre: {
          fret: Number(document.getElementById('admin-chord-barre-fret').value || 0),
          strings: parseNumberArray(document.getElementById('admin-chord-barre-strings').value),
        },
      };

      await apiJson(`/api/chord-library/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedPayload),
      });

      if (msg) msg.textContent = 'Saved';

      const refreshed = await fetchChordLibrary();
      chordPatterns = refreshed.chordPatterns;
      rowsByName = refreshed.rowsByName || {};
      roots = refreshed.roots;
      types = refreshed.types;

      const parsed = updatedPayload.name.split('-');
      if (parsed.length >= 2) {
        selectedRoot = parsed[0];
        selectedType = parsed.slice(1).join('-');
      }

      initializeRootButtons();
      initializeTypeButtons();
      updateChordName();
      renderDiagram();
    } catch (err) {
      if (msg) msg.textContent = err.message || 'Save failed';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.getElementById('chordDiagram')) {
    return;
  }

  try {
    const data = await fetchChordLibrary();
    chordPatterns = data.chordPatterns;
    rowsByName = data.rowsByName || {};
    roots = data.roots;
    types = data.types;

    if (!roots.length || !types.length) {
      showLoadError();
      return;
    }

    selectedRoot = roots.includes('C') ? 'C' : roots[0];
    selectedType = types.includes('Major') ? 'Major' : types[0];

    initializeRootButtons();
    initializeTypeButtons();
    updateChordName();
    renderDiagram();
    updateAdminEditor();

    let adminEditor = document.getElementById('adminChordEditor');
    if (!adminEditor) {
      adminEditor = document.createElement('div');
      adminEditor.id = 'adminChordEditor';
      adminEditor.className = 'admin-editor-card';
      adminEditor.hidden = true;
      document.querySelector('.container')?.appendChild(adminEditor);
    }

    updateAdminEditor();

    const playBtn = document.getElementById('playChordBtn');
    if (playBtn) {
      playBtn.addEventListener('click', playCurrentChord);
    }
  } catch (error) {
    console.error(error);
    showLoadError();
  }
});
