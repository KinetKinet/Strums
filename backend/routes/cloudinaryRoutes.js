import express from 'express';
import multer from 'multer';
import { unlink } from 'node:fs/promises';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// Store file temporarily
const upload = multer({ dest: 'uploads/' });

router.post('/upload-video', requireAdmin, upload.single('video'), async (req, res) => {
  if (!isCloudinaryConfigured) {
    return res.status(500).json({
      message: 'Cloudinary is not configured on backend. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.',
    });
  }

  if (!req.file?.path) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video'
    });

    res.json({
      message: 'Upload successful',
      videoUrl: result.secure_url
    });

  } catch (error) {
    res.status(500).json({ message: error.message || 'Cloudinary upload failed' });
  } finally {
    try {
      await unlink(req.file.path);
    } catch (_err) {
      // Ignore cleanup errors for temp files.
    }
  }
});

export default router;