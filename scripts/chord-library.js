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

const fingerPlacementMeta = {
  '1': {
    label: 'Index',
    image: '../assets/images/FingerPlacement-index.png',
    colorClass: 'finger-color-index',
    guideClass: 'finger-placement-index',
  },
  '2': {
    label: 'Middle',
    image: '../assets/images/FingerPlacement-middle.png',
    colorClass: 'finger-color-middle',
    guideClass: 'finger-placement-middle',
  },
  '3': {
    label: 'Ring',
    image: '../assets/images/FingerPlacement-ring.png',
    colorClass: 'finger-color-ring',
    guideClass: 'finger-placement-ring',
  },
  '4': {
    label: 'Pinkie',
    image: '../assets/images/FingerPlacement-pinkie.png',
    colorClass: 'finger-color-pinkie',
    guideClass: 'finger-placement-pinkie',
  },
};

function getFingerPlacementMeta(fingerValue) {
  const fingerKey = String(fingerValue || '').trim();
  return fingerPlacementMeta[fingerKey] || null;
}

function getActiveFingerPlacements(currentChord) {
  const usedFingerNumbers = new Set(
    currentChord.fingers
      .map((value) => String(value).trim())
      .filter((value) => ['1', '2', '3', '4'].includes(value)),
  );

  return ['1', '2', '3', '4']
    .filter((fingerNumber) => usedFingerNumbers.has(fingerNumber))
    .map((fingerNumber) => ({ fingerNumber, ...fingerPlacementMeta[fingerNumber] }))
    .filter((placement) => placement.image);
}

function getSelectedChordKey() {
  return `${selectedRoot}-${selectedType}`;
}

function getAvailableChordNames() {
  return Object.keys(rowsByName);
}

function getAllAvailableRoots() {
  const allRoots = new Set();

  getAvailableChordNames().forEach((name) => {
    const [root] = name.split(/-(.+)/);
    if (root) {
      allRoots.add(root);
    }
  });

  return Array.from(allRoots).sort();
}

function getAvailableTypesForRoot(root) {
  const typesForRoot = new Set();

  getAvailableChordNames().forEach((name) => {
    const [chordRoot, chordType] = name.split(/-(.+)/);
    if (chordRoot === root && chordType) {
      typesForRoot.add(chordType);
    }
  });

  const preferredOrder = ['Major', 'Minor', '7'];
  return Array.from(typesForRoot).sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }

    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
}

function ensureValidSelection(preferredChordName = '') {
  if (preferredChordName && rowsByName[preferredChordName]) {
    syncSelectionToChordName(preferredChordName);
  }

  const allRoots = getAllAvailableRoots();
  if (!allRoots.length) {
    return;
  }

  if (!allRoots.includes(selectedRoot)) {
    selectedRoot = allRoots[0];
  }

  let availableTypes = getAvailableTypesForRoot(selectedRoot);
  if (!availableTypes.length) {
    const allNames = getAvailableChordNames();
    if (!allNames.length) {
      return;
    }

    syncSelectionToChordName(allNames[0]);
    availableTypes = getAvailableTypesForRoot(selectedRoot);
  }

  if (!availableTypes.includes(selectedType)) {
    selectedType = availableTypes[0];
  }
}

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
  hideVideoPlayer();
  updateAdminEditor();
}

function hideVideoPlayer() {
  const modal = document.getElementById('chordVideoModal');
  const video = document.getElementById('chordVideoPlayer');
  if (!modal || !video) return;

  modal.hidden = true;
  video.pause();
  video.removeAttribute('src');
  video.load();
}

function openVideoPlayer(videoUrl, chordNameText) {
  const modal = document.getElementById('chordVideoModal');
  const video = document.getElementById('chordVideoPlayer');
  const title = document.getElementById('chordVideoTitle');
  const msg = document.getElementById('playChordMsg');

  if (!modal || !video) return;

  if (!videoUrl) {
    if (msg) {
      msg.textContent = 'No video yet for this chord.';
    }
    return;
  }

  if (msg) msg.textContent = '';
  if (title) title.textContent = chordNameText || 'Chord Video';

  video.src = videoUrl;
  modal.hidden = false;
  video.currentTime = 0;
  video.play().catch(() => {
    // Ignore autoplay restrictions.
  });
}

function playCurrentChord() {
  const row = getSelectedChordRow();
  openVideoPlayer(row?.videoUrl || '', `${selectedRoot} ${selectedType}`);
}

function renderDiagram() {
  const diagramContainer = document.getElementById('chordDiagram');
  if (!diagramContainer) return;

  const currentChord = getChordPattern(selectedRoot, selectedType);
  const activeFingerPlacements = getActiveFingerPlacements(currentChord);

  if (currentChord.isPlaceholder) {
    diagramContainer.innerHTML = `
      <div class="placeholder">
        <p>Chord pattern not available</p>
        <p>Try a different combination</p>
      </div>
    `;
    return;
  }

  const frettedNotes = currentChord.frets.filter((fret) => fret > 0);
  const minFrettedNote = frettedNotes.length > 0 ? Math.min(...frettedNotes) : 1;
  let startingFret = minFrettedNote;
  let hasBarre = false;
  if (currentChord.barre && typeof currentChord.barre.fret === 'number') {
    startingFret = currentChord.barre.fret;
    hasBarre = Array.isArray(currentChord.barre.strings) && currentChord.barre.strings.length > 0;
  }

  let html = `
      <div class="diagram-wrapper diagram-wrapper-with-guide">
      <div class="diagram">
        <div class="string-labels">
          ${strings.map((s) => `<div class="string-label">${s}</div>`).join('')}
        </div>
        <div class="fretboard-container">
          <div class="fret-numbers">
  `;

  const fretRange = [];
  if (startingFret > 1) {
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
        const fingerMeta = getFingerPlacementMeta(currentChord.fingers[stringIndex]);
        html += `
          <div class="finger-dot ${fingerMeta?.colorClass || ''}">
            ${currentChord.fingers[stringIndex]}
          </div>
        `;
      } else if (hasBarre && fretNum === startingFret && currentChord.barre.strings.includes(stringIndex)) {
        const fingerMeta = getFingerPlacementMeta(currentChord.fingers[stringIndex]);
        html += `<div class="barre-dot ${fingerMeta?.colorClass || ''}">${currentChord.fingers[stringIndex]}</div>`;
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
      <div class="diagram-guide" aria-hidden="true">
        <div class="guide-hand-map" aria-hidden="true">
          <img class="diagram-guide-image" src="../assets/images/FingerPlacement.png" alt="">
          <div class="guide-finger-overlay" aria-hidden="true">
            ${activeFingerPlacements
              .map((placement) => `
                <div class="guide-finger-placement ${placement.colorClass} ${placement.guideClass}" data-finger="${placement.fingerNumber}">
                  <img class="guide-finger-card-image" src="${placement.image}" alt="">
                  <span class="guide-finger-number">${placement.fingerNumber}</span>
                </div>
              `)
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  diagramContainer.innerHTML = html;
}

function selectRoot(root) {
  selectedRoot = root;
  ensureValidSelection();
  initializeRootButtons();
  initializeTypeButtons();
  updateChordName();
  renderDiagram();
}

function selectType(type) {
  selectedType = type;
  ensureValidSelection();
  initializeRootButtons();
  initializeTypeButtons();
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
  getAllAvailableRoots().forEach((root) => {
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
  getAvailableTypesForRoot(selectedRoot).forEach((type) => {
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
  const key = getSelectedChordKey();
  return rowsByName[key] || null;
}

function parseNumberArray(input) {
  return input
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part) => Number(part));
}

function parseStringArray(input) {
  return input
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function buildBarrePayload(barreFretInput, barreStringsInput) {
  const fret = Number(barreFretInput || 0);
  const stringsList = parseNumberArray(barreStringsInput);

  if (!fret) {
    return undefined;
  }

  return {
    fret,
    strings: stringsList,
  };
}

function getEditorValues() {
  return {
    name: document.getElementById('admin-chord-name')?.value.trim() || '',
    frets: parseNumberArray(document.getElementById('admin-chord-frets')?.value || ''),
    fingers: parseStringArray(document.getElementById('admin-chord-fingers')?.value || ''),
    barre: buildBarrePayload(
      document.getElementById('admin-chord-barre-fret')?.value || '',
      document.getElementById('admin-chord-barre-strings')?.value || ''
    ),
  };
}

function validateChordEditorValues(values) {
  if (!values.name) {
    return 'Chord name is required.';
  }

  if (values.frets.length !== 6 || values.frets.some((value) => Number.isNaN(value))) {
    return 'Frets must contain exactly 6 numbers.';
  }

  if (values.fingers.length !== 6) {
    return 'Fingers must contain exactly 6 values.';
  }

  if (values.barre?.fret && values.barre.strings.length === 0) {
    return 'Add barre string indexes when a barre fret is set.';
  }

  return '';
}

function parseChordNameParts(name) {
  const firstDash = name.indexOf('-');
  if (firstDash === -1) {
    return { root: name, type: '' };
  }

  return {
    root: name.slice(0, firstDash),
    type: name.slice(firstDash + 1),
  };
}

function syncSelectionToChordName(name) {
  const parsed = parseChordNameParts(name);
  if (parsed.root) {
    selectedRoot = parsed.root;
  }
  selectedType = parsed.type || selectedType;
}

async function refreshChordLibraryState(preferredChordName = '') {
  const refreshed = await fetchChordLibrary();
  chordPatterns = refreshed.chordPatterns;
  rowsByName = refreshed.rowsByName || {};
  roots = refreshed.roots;
  types = refreshed.types;

  ensureValidSelection(preferredChordName);
  initializeRootButtons();
  initializeTypeButtons();
  updateChordName();
  renderDiagram();
}

function getUploadRouteFriendlyError(err) {
  const raw = String(err?.message || 'Upload failed');
  const missingUploadRoute = (
    raw.includes('status 404') && raw.includes('/api/cloudinary/upload-video')
  ) || raw.includes('Cannot POST /api/cloudinary/upload-video');
  const missingAdminToken = raw.toLowerCase().includes('missing admin token')
    || (raw.includes('status 401') && raw.includes('/api/cloudinary/upload-video'));
  const invalidAdminToken = raw.toLowerCase().includes('invalid token')
    || raw.toLowerCase().includes('jwt');
  const cloudinaryNotConfigured = raw.toLowerCase().includes('cloudinary is not configured')
    || raw.toLowerCase().includes('must supply api_key');

  if (missingUploadRoute) {
    return 'Upload is unavailable on the website right now. Backend needs redeploy to enable /api/cloudinary/upload-video.';
  }

  if (missingAdminToken || invalidAdminToken) {
    return 'Admin login expired or missing. Login again on index page, then return and retry upload.';
  }

  if (cloudinaryNotConfigured) {
    return 'Backend Cloudinary env is missing. Add Cloudinary keys in Render backend environment variables and redeploy.';
  }

  return raw;
}

function updateAdminEditor() {
  const panel = document.getElementById('adminChordEditor');
  if (!panel) return;

  if (!isAdminLoggedIn()) {
    panel.hidden = true;
    return;
  }

  const row = getSelectedChordRow();
  const chordKey = getSelectedChordKey();
  const frets = Array.isArray(row?.frets) ? row.frets.join(',') : '0,0,0,0,0,0';
  const fingers = Array.isArray(row?.fingers) ? row.fingers.join(',') : '0,0,0,0,0,0';
  const barreFret = row?.barre?.fret ?? '';
  const barreStrings = Array.isArray(row?.barre?.strings) ? row.barre.strings.join(',') : '';
  const hasVideo = Boolean(row?.videoUrl);
  const heading = row ? `Editing: <strong>${row.name}</strong>` : `New chord: <strong>${selectedRoot} ${selectedType}</strong>`;
  const description = row
    ? 'Save updates, add a new chord row, or delete this one from the database.'
    : 'This chord is not in the database yet. Fill in the pattern and add it.';

  panel.hidden = false;
  panel.innerHTML = `
    <h3>Admin Chord Editor</h3>
    <p>${heading}</p>
    <p class="admin-panel-note">${description}</p>
    <label>Name <input id="admin-chord-name" type="text" value="${row?.name || chordKey}" /></label>
    <p class="admin-edit-msg">Current Video: ${hasVideo ? 'Saved in Cloudinary' : 'None'}</p>
    <div class="admin-upload-row">
      <span class="admin-upload-label">Upload Video File</span>
      <input id="admin-chord-video-file" class="admin-file-input" type="file" accept="video/*" />
      <div class="admin-file-picker-row">
        <button id="admin-chord-video-pick" type="button" class="admin-file-pick-btn">Choose Video</button>
        <span id="admin-chord-video-file-name" class="admin-file-name">No file selected</span>
      </div>
    </div>
    <label>Frets (comma-separated) <input id="admin-chord-frets" type="text" value="${frets}" /></label>
    <label>Fingers (comma-separated) <input id="admin-chord-fingers" type="text" value="${fingers}" /></label>
    <label>Barre Fret <input id="admin-chord-barre-fret" type="number" value="${barreFret}" /></label>
    <label>Barre Strings (comma-separated indexes) <input id="admin-chord-barre-strings" type="text" value="${barreStrings}" /></label>
    <div class="admin-edit-actions">
      <button id="admin-save-chord" type="button" ${row ? '' : 'disabled'}>Save Chord</button>
      <button id="admin-add-chord" type="button" class="admin-secondary-btn">Add Chord</button>
      <button id="admin-delete-chord" type="button" class="admin-danger-btn" ${row ? '' : 'disabled'}>Delete Chord</button>
      <span id="admin-save-chord-msg" class="admin-edit-msg"></span>
    </div>
  `;

  const saveBtn = document.getElementById('admin-save-chord');
  const addBtn = document.getElementById('admin-add-chord');
  const deleteBtn = document.getElementById('admin-delete-chord');
  const pickBtn = document.getElementById('admin-chord-video-pick');

  pickBtn?.addEventListener('click', () => {
    const fileInput = document.getElementById('admin-chord-video-file');
    fileInput?.click();
  });

  const fileInput = document.getElementById('admin-chord-video-file');
  fileInput?.addEventListener('change', () => {
    const fileNameEl = document.getElementById('admin-chord-video-file-name');
    const selected = fileInput.files?.[0]?.name || 'No file selected';
    if (fileNameEl) fileNameEl.textContent = selected;
  });

  async function uploadVideoIfNeeded(currentVideoUrl) {
    const msg = document.getElementById('admin-save-chord-msg');
    const file = fileInput?.files?.[0];
    if (!file) {
      return currentVideoUrl;
    }

    if (msg) msg.textContent = 'Uploading video...';
    const formData = new FormData();
    formData.append('video', file);

    const uploaded = await apiJson('/api/cloudinary/upload-video', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!uploaded?.videoUrl) {
      throw new Error('Upload succeeded but no video URL was returned');
    }

    return uploaded.videoUrl;
  }

  function resetFilePicker() {
    if (fileInput) fileInput.value = '';
    const fileNameEl = document.getElementById('admin-chord-video-file-name');
    if (fileNameEl) fileNameEl.textContent = 'No file selected';
  }

  saveBtn?.addEventListener('click', async () => {
    const msg = document.getElementById('admin-save-chord-msg');

    try {
      const values = getEditorValues();
      const validationError = validateChordEditorValues(values);
      if (validationError) {
        if (msg) msg.textContent = validationError;
        return;
      }

      const nextVideoUrl = await uploadVideoIfNeeded(row?.videoUrl || '');

      if (msg) msg.textContent = 'Saving chord...';

      const updatedPayload = {
        name: values.name,
        videoUrl: nextVideoUrl,
        frets: values.frets,
        fingers: values.fingers,
        barre: values.barre,
      };

      await apiJson(`/api/chord-library/${row._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedPayload),
      });

      resetFilePicker();
      await refreshChordLibraryState(updatedPayload.name);
      const nextMsg = document.getElementById('admin-save-chord-msg');
      if (nextMsg) nextMsg.textContent = 'Saved.';
    } catch (err) {
      if (msg) msg.textContent = getUploadRouteFriendlyError(err);
    }
  });

  addBtn?.addEventListener('click', async () => {
    const msg = document.getElementById('admin-save-chord-msg');

    try {
      const values = getEditorValues();
      const validationError = validateChordEditorValues(values);
      if (validationError) {
        if (msg) msg.textContent = validationError;
        return;
      }

      const nextVideoUrl = await uploadVideoIfNeeded(row?.videoUrl || '');

      if (msg) msg.textContent = 'Adding chord...';

      await apiJson('/api/chord-library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: values.name,
          videoUrl: nextVideoUrl,
          frets: values.frets,
          fingers: values.fingers,
          barre: values.barre,
        }),
      });

      resetFilePicker();
      await refreshChordLibraryState(values.name);
      const nextMsg = document.getElementById('admin-save-chord-msg');
      if (nextMsg) nextMsg.textContent = 'Chord added.';
    } catch (err) {
      if (msg) msg.textContent = getUploadRouteFriendlyError(err);
    }
  });

  deleteBtn?.addEventListener('click', async () => {
    const msg = document.getElementById('admin-save-chord-msg');
    if (!row) {
      if (msg) msg.textContent = 'Select a saved chord to delete.';
      return;
    }

    if (!window.confirm(`Delete ${row.name} from the database?`)) {
      return;
    }

    try {
      if (msg) msg.textContent = 'Deleting chord...';

      await apiJson(`/api/chord-library/${row._id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });

      await refreshChordLibraryState();
      const nextMsg = document.getElementById('admin-save-chord-msg');
      if (nextMsg) nextMsg.textContent = 'Chord deleted.';
    } catch (err) {
      if (msg) msg.textContent = getUploadRouteFriendlyError(err);
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

    selectedRoot = rowsByName['C-Major'] ? 'C' : roots[0];
    selectedType = rowsByName['C-Major'] ? 'Major' : types[0];
    ensureValidSelection();

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

    const closeVideoBtn = document.getElementById('closeChordVideo');
    closeVideoBtn?.addEventListener('click', hideVideoPlayer);

    const videoBackdrop = document.getElementById('chordVideoModal');
    videoBackdrop?.addEventListener('click', (e) => {
      if (e.target === videoBackdrop) {
        hideVideoPlayer();
      }
    });
  } catch (error) {
    console.error(error);
    showLoadError();
  }
});
