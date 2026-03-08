import express from "express";
import ChordPattern from "../models/ChordLibrary.js";

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

export default router;