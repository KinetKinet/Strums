function getApiCandidates() {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '';

  if (isLocalHost) {
    return ['http://localhost:5000', 'https://strums-backend.onrender.com'];
  }

  return [window.location.origin, 'https://strums-backend.onrender.com'];
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
  let response = null;
  let lastError = null;

  for (const base of candidates) {
    try {
      response = await fetch(`${base}/api/chord-library`);
      if (response.ok) {
        break;
      }
      lastError = new Error(`Request failed with status ${response.status} at ${base}`);
    } catch (err) {
      lastError = err;
    }
  }

  if (!response || !response.ok) {
    throw lastError || new Error('Failed to load chord library');
  }

  const rows = await response.json();
  const chordPatterns = {};
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

    if (root) roots.add(root);
    if (type) types.add(type);
  });

  return {
    chordPatterns,
    roots: Array.from(roots),
    types: Array.from(types),
    availableChords: Object.keys(chordPatterns),
  };
}
