const Testimonial = require('../models/Testimonial.model');
const AppError    = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { deleteFromCloudinary } = require('../utils/cloudinaryHelpers');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all testimonials (public)
// @route   GET /api/testimonials
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .sort('order -createdAt')
      .select('-__v');
    return sendSuccess(res, 200, 'Testimonials retrieved', testimonials);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get featured testimonials (public)
// @route   GET /api/testimonials/featured
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getFeaturedTestimonials = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const testimonials = await Testimonial.find({ featured: true })
      .sort('order -createdAt')
      .limit(limit)
      .select('-__v');
    return sendSuccess(res, 200, 'Featured testimonials retrieved', testimonials);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single testimonial by ID (public)
// @route   GET /api/testimonials/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id).select('-__v');
    if (!testimonial) return next(new AppError('Testimonial not found', 404));
    return sendSuccess(res, 200, 'Testimonial retrieved', testimonial);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create testimonial (admin)
// @route   POST /api/testimonials
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    return sendSuccess(res, 201, 'Testimonial created', testimonial);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update testimonial (admin)
// @route   PUT /api/testimonials/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return next(new AppError('Testimonial not found', 404));

    // Delete old photo if replacing
    if (req.body.photo?.publicId &&
        testimonial.photo?.publicId &&
        req.body.photo.publicId !== testimonial.photo.publicId) {
      await deleteFromCloudinary(testimonial.photo.publicId, 'image');
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    return sendSuccess(res, 200, 'Testimonial updated', updated);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Toggle featured status
// @route   PATCH /api/testimonials/:id/featured
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const toggleFeatured = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return next(new AppError('Testimonial not found', 404));

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    return sendSuccess(
      res, 200,
      `Testimonial ${testimonial.featured ? 'marked as featured' : 'removed from featured'}`,
      testimonial
    );
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete testimonial (admin)
// @route   DELETE /api/testimonials/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return next(new AppError('Testimonial not found', 404));

    if (testimonial.photo?.publicId) {
      await deleteFromCloudinary(testimonial.photo.publicId, 'image');
    }

    await testimonial.deleteOne();
    return sendSuccess(res, 200, 'Testimonial deleted');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Batch reorder testimonials
// @route   PATCH /api/testimonials/reorder/batch
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const reorderTestimonials = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Items array is required', 400));
    }

    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Testimonial.bulkWrite(bulkOps);
    return sendSuccess(res, 200, 'Testimonials reordered');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleFeatured,
  reorderTestimonials,
};