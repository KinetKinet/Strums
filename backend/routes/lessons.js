import express from "express";
import Lesson from "../models/Lesson.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ chapter: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT lesson by id (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        chapter: req.body.chapter,
        tag: req.body.tag,
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
        videoUrl: req.body.videoUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// POST create new lesson (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const created = await Lesson.create({
      chapter: req.body.chapter,
      tag: req.body.tag,
      title: req.body.title,
      description: req.body.description,
      data: req.body.data,
      videoUrl: req.body.videoUrl,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default router;