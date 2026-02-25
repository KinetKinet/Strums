const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Store file temporarily
const upload = multer({ dest: "uploads/" });

router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video"
    });

    res.json({
      message: "Upload successful",
      videoUrl: result.secure_url
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;