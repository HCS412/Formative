const multer = require('multer');
const { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, MAX_AVATAR_SIZE, MAX_ASSET_SIZE } = require('../services/s3Service');

// Use memory storage for processing before S3 upload
const storage = multer.memoryStorage();

/**
 * Avatar upload middleware
 * - Only images allowed
 * - Max 5MB
 */
const avatarUpload = multer({
  storage,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
  },
});

/**
 * Asset upload middleware
 * - Images and videos allowed
 * - Max 100MB
 */
const assetUpload = multer({
  storage,
  limits: {
    fileSize: MAX_ASSET_SIZE,
    files: 10, // Allow multiple files
  },
  fileFilter: (req, file, cb) => {
    const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: Images or Videos'), false);
    }
  },
});

/**
 * Product image upload middleware
 * - Only images allowed
 * - Max 5MB
 */
const productUpload = multer({
  storage,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
    files: 5, // Allow multiple product images
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP'), false);
    }
  },
});

/**
 * General file upload middleware
 * - Any file type
 * - Max 100MB
 */
const generalUpload = multer({
  storage,
  limits: {
    fileSize: MAX_ASSET_SIZE,
    files: 5,
  },
});

/**
 * Error handler middleware for multer
 */
function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'The uploaded file exceeds the size limit',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        message: 'You can only upload a limited number of files at once',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field',
        message: 'The file was uploaded to an unexpected field',
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message,
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: err.message,
    });
  }

  next(err);
}

module.exports = {
  avatarUpload,
  assetUpload,
  productUpload,
  generalUpload,
  handleUploadError,
};
