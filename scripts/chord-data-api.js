import { apiJson } from './api-client.js';

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
  const rows = await apiJson('/api/chord-library');
  if (!Array.isArray(rows)) {
    throw new Error('Unexpected payload shape for chord library');
  }

  return normalizeChordRows(rows);
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
