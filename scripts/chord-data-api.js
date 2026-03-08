function getApiCandidates() {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';

  if (isLocalHost) {
    return ['http://localhost:5000', 'https://strums-backend.onrender.com'];
  }

  return ['https://strums-backend.onrender.com', window.location.origin];
}

function parseChordName(name = '') {
  const firstDash = name.indexOf('-');
  if (firstDash === -1) {
    return { root: name, type: '' };
  }

  return {
    root: name.slice(0, firstDash),
    type: name.slice(firstDash + 1),
  };
}

export async function fetchChordLibrary() {
  const candidates = getApiCandidates();
  let lastError = null;

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}/api/chord-library`);
      if (!response.ok) {
        lastError = new Error(`Request failed with status ${response.status} at ${base}`);
        continue;
      }

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (!contentType.includes('application/json')) {
        lastError = new Error(`Non-JSON response returned from ${base}`);
        continue;
      }

      const rows = await response.json();
      if (!Array.isArray(rows)) {
        lastError = new Error(`Unexpected payload shape from ${base}`);
        continue;
      }

      return normalizeChordRows(rows);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to load chord library');
}

function normalizeChordRows(rows) {
  const chordPatterns = {};
  const rowsByName = {};
  const roots = new Set();
  const types = new Set();

  rows.forEach((row) => {
    if (!row?.name || !Array.isArray(row.frets) || !Array.isArray(row.fingers)) {
      return;
    }

    const { root, type } = parseChordName(row.name);
    chordPatterns[row.name] = {
      frets: row.frets,
      fingers: row.fingers,
      barre: row.barre || null,
    };
    rowsByName[row.name] = row;

    if (root) roots.add(root);
    if (type) types.add(type);
  });

  return {
    chordPatterns,
    rowsByName,
    roots: Array.from(roots),
    types: Array.from(types),
    availableChords: Object.keys(chordPatterns),
  };
}
