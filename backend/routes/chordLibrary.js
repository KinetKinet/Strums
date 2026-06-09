import express from "express";
import { query } from "../db/index.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

function buildChordPayload(body = {}) {
  return {
    name: String(body.name || "").trim(),
    videoUrl: String(body.videoUrl || "").trim(),
    frets: Array.isArray(body.frets) ? body.frets : [],
    fingers: Array.isArray(body.fingers) ? body.fingers : [],
    barre: body.barre,
  };
}

function validateChordPayload(payload) {
  if (!payload.name) {
    return "Chord name is required";
  }

  if (!Array.isArray(payload.frets) || payload.frets.length !== 6 || payload.frets.some((value) => Number.isNaN(Number(value)))) {
    return "Frets must contain 6 numbers";
  }

  if (!Array.isArray(payload.fingers) || payload.fingers.length !== 6 || payload.fingers.some((value) => String(value).trim().length === 0)) {
    return "Fingers must contain 6 values";
  }

  if (payload.barre && payload.barre.fret && (!Array.isArray(payload.barre.strings) || payload.barre.strings.length === 0)) {
    return "Barre strings are required when barre fret is set";
  }

  return "";
}

// GET all Chord Patterns
router.get("/", async (req, res) => {
  try {
    const r = await query('SELECT id, name, video_url, frets, fingers, barre FROM chord_patterns ORDER BY name ASC');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST chord (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const payload = buildChordPayload(req.body);
    const validationError = validateChordPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const check = await query('SELECT 1 FROM chord_patterns WHERE name = $1', [payload.name]);
    if (check.rowCount > 0) return res.status(409).json({ message: 'A chord with that name already exists' });

    const insert = `INSERT INTO chord_patterns (name, video_url, frets, fingers, barre) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, video_url, frets, fingers, barre`;
    const r = await query(insert, [payload.name, payload.videoUrl || null, payload.frets, payload.fingers, payload.barre || null]);
    return res.status(201).json(r.rows[0]);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT chord by id (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const payload = buildChordPayload(req.body);
    const validationError = validateChordPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const dupCheck = await query('SELECT 1 FROM chord_patterns WHERE id <> $1 AND name = $2', [req.params.id, payload.name]);
    if (dupCheck.rowCount > 0) return res.status(409).json({ message: 'A chord with that name already exists' });

    const updateQ = `UPDATE chord_patterns SET name=$1, video_url=$2, frets=$3, fingers=$4, barre=$5 WHERE id=$6 RETURNING id, name, video_url, frets, fingers, barre`;
    const r = await query(updateQ, [payload.name, payload.videoUrl || null, payload.frets, payload.fingers, payload.barre || null, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ message: 'Chord pattern not found' });
    return res.json(r.rows[0]);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// DELETE chord by id (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const del = await query('DELETE FROM chord_patterns WHERE id = $1', [req.params.id]);
    if (del.rowCount === 0) return res.status(404).json({ message: 'Chord pattern not found' });
    return res.json({ message: 'Chord deleted', id: req.params.id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default router;