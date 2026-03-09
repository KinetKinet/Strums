import express from "express";
import ChordPattern from "../models/ChordLibrary.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// GET all Chord Patterns
router.get("/", async (req, res) => {
  try {
    const chordPatterns = await ChordPattern.find().sort({ name: 1 });
    res.json(chordPatterns);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

export default router;