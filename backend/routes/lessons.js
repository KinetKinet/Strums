import express from "express";
import { query } from "../db/index.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const r = await query('SELECT id, chapter, tag, title, description, data, video_url, created_at, updated_at FROM lessons ORDER BY chapter ASC');
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT lesson by id (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { chapter, tag, title, description, data, videoUrl } = req.body;
    const q = `
      UPDATE lessons SET chapter=$1, tag=$2, title=$3, description=$4, data=$5, video_url=$6, updated_at=NOW()
      WHERE id=$7 RETURNING id, chapter, tag, title, description, data, video_url, created_at, updated_at`;
    const values = [chapter ?? null, tag ?? null, title ?? null, description ?? null, data ?? null, videoUrl ?? null, req.params.id];
    const r = await query(q, values);
    if (r.rowCount === 0) return res.status(404).json({ message: 'Lesson not found' });
    return res.json(r.rows[0]);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// POST create new lesson (admin only)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { chapter, tag, title, description, data, videoUrl } = req.body;
    const q = `
      INSERT INTO lessons (chapter, tag, title, description, data, video_url, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      RETURNING id, chapter, tag, title, description, data, video_url, created_at, updated_at`;
    const values = [chapter ?? null, tag ?? null, title ?? null, description ?? null, data ?? null, videoUrl ?? null];
    const r = await query(q, values);
    return res.status(201).json(r.rows[0]);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default router;