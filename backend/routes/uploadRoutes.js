const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadSingleImage, handleMulterError } = require('../middlewares/uploadMiddleware');
const { uploadImage } = require('../config/cloudinary');
const AppError = require('../utils/appError');
const fs = require('fs');

// Upload image for TinyMCE editor
router.post('/image', protect, restrictTo('admin'), uploadSingleImage, handleMulterError, async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(new AppError('Please upload an image file', 400));
    }

    // Upload image to Cloudinary
    const result = await uploadImage(req.file.path, {
      folder: 'blog-images',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      url: result.secure_url,
      data: {
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    // Clean up the temporary file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Image upload error:', error);
    next(new AppError('Failed to upload image', 500));
  }
});

module.exports = router; 