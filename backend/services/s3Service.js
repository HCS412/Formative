const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Try to load sharp, but don't fail if it's not available
let sharp = null;
try {
  sharp = require('sharp');
  console.log('Sharp image processing library loaded successfully');
} catch (err) {
  console.warn('Sharp not available - image processing will be disabled:', err.message);
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'formative-uploads-production';

// Upload paths
const UPLOAD_PATHS = {
  avatars: 'avatars/',
  assets: 'assets/',
  products: 'products/',
  messages: 'messages/',
};

// File validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ASSET_SIZE = 100 * 1024 * 1024; // 100MB

/**
 * Process avatar image - resize and optimize
 */
async function processAvatar(buffer) {
  if (!sharp) {
    // If sharp is not available, return original buffer
    console.warn('Sharp not available, skipping avatar processing');
    return buffer;
  }
  return sharp(buffer)
    .resize(400, 400, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 85,
      progressive: true
    })
    .toBuffer();
}

/**
 * Process general image - optimize without resizing
 */
async function processImage(buffer, options = {}) {
  if (!sharp) {
    // If sharp is not available, return original buffer
    console.warn('Sharp not available, skipping image processing');
    return buffer;
  }
  const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options;

  return sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({
      quality,
      progressive: true
    })
    .toBuffer();
}

/**
 * Generate thumbnail from image
 */
async function generateThumbnail(buffer, size = 300) {
  if (!sharp) {
    // If sharp is not available, return null (no thumbnail)
    console.warn('Sharp not available, skipping thumbnail generation');
    return null;
  }
  return sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 70,
      progressive: true
    })
    .toBuffer();
}

/**
 * Upload file to S3
 */
async function uploadFile(buffer, key, contentType, options = {}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: options.cacheControl || 'max-age=31536000',
    ...options.s3Options,
  });

  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
}

/**
 * Upload avatar with processing
 */
async function uploadAvatar(file, userId) {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
  }

  // Validate file size
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('File too large. Maximum size: 5MB');
  }

  // Process image (if sharp is available)
  const processedBuffer = await processAvatar(file.buffer);

  // Determine extension and content type based on whether sharp processed it
  const extension = sharp ? 'jpg' : path.extname(file.originalname).toLowerCase().slice(1) || 'jpg';
  const contentType = sharp ? 'image/jpeg' : file.mimetype;

  // Generate unique filename
  const key = `${UPLOAD_PATHS.avatars}${userId}/${uuidv4()}.${extension}`;

  // Upload to S3
  return uploadFile(processedBuffer, key, contentType);
}

/**
 * Upload asset file (image or video)
 */
async function uploadAssetFile(file, assetId, versionId, options = {}) {
  // Validate file size
  if (file.size > MAX_ASSET_SIZE) {
    throw new Error('File too large. Maximum size: 100MB');
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);

  if (!isImage && !isVideo) {
    throw new Error('Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP) or Videos (MP4, MOV, WebM)');
  }

  let buffer = file.buffer;
  let contentType = file.mimetype;
  let extension = path.extname(file.originalname).toLowerCase();

  // Process images (but not videos)
  if (isImage && options.processImage !== false) {
    buffer = await processImage(file.buffer, options);
    contentType = 'image/jpeg';
    extension = '.jpg';
  }

  // Generate unique filename
  const key = `${UPLOAD_PATHS.assets}${assetId}/${versionId}/${uuidv4()}${extension}`;

  // Upload main file
  const url = await uploadFile(buffer, key, contentType);

  // Generate thumbnail for images
  let thumbnailUrl = null;
  if (isImage) {
    const thumbnail = await generateThumbnail(file.buffer);
    const thumbnailKey = `${UPLOAD_PATHS.assets}${assetId}/${versionId}/thumb_${uuidv4()}.jpg`;
    thumbnailUrl = await uploadFile(thumbnail, thumbnailKey, 'image/jpeg');
  }

  return {
    url,
    thumbnailUrl,
    key,
    contentType,
    size: buffer.length,
  };
}

/**
 * Upload product image
 */
async function uploadProductImage(file, productId) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('File too large. Maximum size: 5MB');
  }

  // Process image
  const processedBuffer = await processImage(file.buffer, { maxWidth: 1200, maxHeight: 1200 });

  // Generate unique filename
  const key = `${UPLOAD_PATHS.products}${productId}/${uuidv4()}.jpg`;

  return uploadFile(processedBuffer, key, 'image/jpeg');
}

/**
 * Upload message attachment
 */
async function uploadMessageAttachment(file, conversationId) {
  if (file.size > MAX_ASSET_SIZE) {
    throw new Error('File too large. Maximum size: 100MB');
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const key = `${UPLOAD_PATHS.messages}${conversationId}/${uuidv4()}${extension}`;

  return uploadFile(file.buffer, key, file.mimetype);
}

/**
 * Delete file from S3
 */
async function deleteFile(fileUrl) {
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Failed to delete file from S3:', error);
    return false;
  }
}

/**
 * Get signed download URL for private files
 */
async function getSignedDownloadUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Extract key from S3 URL
 */
function extractKeyFromUrl(fileUrl) {
  try {
    const url = new URL(fileUrl);
    return url.pathname.substring(1);
  } catch {
    return null;
  }
}

/**
 * Check if URL is an S3 URL for our bucket
 */
function isS3Url(url) {
  return url && url.includes(BUCKET_NAME) && url.includes('s3.');
}

module.exports = {
  uploadAvatar,
  uploadAssetFile,
  uploadProductImage,
  uploadMessageAttachment,
  uploadFile,
  deleteFile,
  getSignedDownloadUrl,
  extractKeyFromUrl,
  isS3Url,
  processAvatar,
  processImage,
  generateThumbnail,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_AVATAR_SIZE,
  MAX_ASSET_SIZE,
  UPLOAD_PATHS,
};
