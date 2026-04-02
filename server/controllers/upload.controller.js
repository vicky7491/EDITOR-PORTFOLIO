const cloudinary = require('../config/cloudinary');
const AppError   = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { UPLOAD_FOLDERS } = require('../config/constants');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload image to Cloudinary
// @route   POST /api/admin/upload/image
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const uploadImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    // Multer-storage-cloudinary already uploaded to Cloudinary
    // req.file.path = secure_url, req.file.filename = public_id
    return sendSuccess(res, 200, 'Image uploaded successfully', {
      url:      req.file.path,
      publicId: req.file.filename,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload video to Cloudinary
// @route   POST /api/admin/upload/video
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const uploadVideoHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No video file provided', 400));
    }

    return sendSuccess(res, 200, 'Video uploaded successfully', {
      url:      req.file.path,
      publicId: req.file.filename,
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete media from Cloudinary
// @route   DELETE /api/admin/upload/:publicId
// @access  Admin
// The publicId in the URL is base64-encoded to handle forward slashes
// ─────────────────────────────────────────────────────────────────────────────
const deleteMediaHandler = async (req, res, next) => {
  try {
    // Decode the base64-encoded publicId
    const publicId      = Buffer.from(req.params.publicId, 'base64').toString('utf8');
    const resourceType  = req.body.resourceType || 'image';

    if (!publicId) {
      return next(new AppError('Public ID is required', 400));
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === 'not found') {
      return next(new AppError('Media not found in Cloudinary', 404));
    }

    return sendSuccess(res, 200, 'Media deleted from Cloudinary', { result });

  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImageHandler, uploadVideoHandler, deleteMediaHandler };