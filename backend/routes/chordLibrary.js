import express from "express";
import ChordPattern from "../models/ChordLibrary.js";
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
    const chordPatterns = await ChordPattern.find().sort({ name: 1 });
    res.json(chordPatterns);
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

    const existing = await ChordPattern.findOne({ name: payload.name });
    if (existing) {
      return res.status(409).json({ message: "A chord with that name already exists" });
    }

    const created = await ChordPattern.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// PUT chord by id (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await ChordPattern.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        videoUrl: req.body.videoUrl,
        frets: req.body.frets,
        fingers: req.body.fingers,
        barre: req.body.barre,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Chord pattern not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// DELETE chord by id (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await ChordPattern.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Chord pattern not found" });
    }

    return res.json({ message: "Chord deleted", id: req.params.id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default router;