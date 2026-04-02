const Video    = require('../models/Video.model');
const AppError = require('../utils/AppError');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');
const { deleteFromCloudinary } = require('../utils/cloudinaryHelpers');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all videos (public)
// @route   GET /api/videos
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllVideos = async (req, res, next) => {
  try {
    const {
      page     = 1,
      limit    = 12,
      category,
      featured,
      search,
      sort     = 'order -createdAt',
    } = req.query;

    const filter = {};
    if (category)           filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Video.countDocuments(filter);

    const videos = await Video.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    return sendSuccess(
      res, 200, 'Videos retrieved',
      videos,
      paginationMeta(total, page, limit)
    );

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get featured videos (public)
// @route   GET /api/videos/featured
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getFeaturedVideos = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const videos = await Video.find({ featured: true })
      .sort('order -createdAt')
      .limit(limit)
      .select('-__v');

    return sendSuccess(res, 200, 'Featured videos retrieved', videos);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get video by ID (public)
// @route   GET /api/videos/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).select('-__v');
    if (!video) return next(new AppError('Video not found', 404));
    return sendSuccess(res, 200, 'Video retrieved', video);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Increment video view count
// @route   PATCH /api/videos/:id/view
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const incrementVideoViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    return sendSuccess(res, 200, 'View counted');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create video (admin)
// @route   POST /api/videos
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);
    return sendSuccess(res, 201, 'Video created', video);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update video (admin)
// @route   PUT /api/videos/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(new AppError('Video not found', 404));

    // Delete old thumbnail from Cloudinary if replacing
    if (req.body.thumbnail?.publicId &&
        video.thumbnail?.publicId &&
        req.body.thumbnail.publicId !== video.thumbnail.publicId) {
      await deleteFromCloudinary(video.thumbnail.publicId, 'image');
    }

    // Delete old video from Cloudinary if replacing
    if (req.body.videoPublicId && video.videoPublicId &&
        req.body.videoPublicId !== video.videoPublicId) {
      await deleteFromCloudinary(video.videoPublicId, 'video');
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    return sendSuccess(res, 200, 'Video updated', updated);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete video (admin)
// @route   DELETE /api/videos/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(new AppError('Video not found', 404));

    if (video.videoPublicId) {
      await deleteFromCloudinary(video.videoPublicId, 'video');
    }
    if (video.thumbnail?.publicId) {
      await deleteFromCloudinary(video.thumbnail.publicId, 'image');
    }

    await video.deleteOne();
    return sendSuccess(res, 200, 'Video deleted successfully');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Batch reorder videos
// @route   PATCH /api/videos/reorder/batch
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const reorderVideos = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Items array is required', 400));
    }

    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Video.bulkWrite(bulkOps);
    return sendSuccess(res, 200, 'Videos reordered');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVideos,
  getFeaturedVideos,
  getVideoById,
  incrementVideoViews,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
};