const Category = require('../models/Category.model');
const Project  = require('../models/Project.model');
const Video    = require('../models/Video.model');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all categories (public)
// @route   GET /api/categories
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort('order name')
      .select('-__v');

    // Attach project count to each category
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const projectCount = await Project.countDocuments({
          category: cat._id,
          status:   'published',
        });
        return { ...cat.toObject(), projectCount };
      })
    );

    return sendSuccess(res, 200, 'Categories retrieved', withCounts);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single category by slug (public)
// @route   GET /api/categories/:slug
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).select('-__v');
    if (!category) return next(new AppError('Category not found', 404));
    return sendSuccess(res, 200, 'Category retrieved', category);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create category (admin)
// @route   POST /api/categories
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return sendSuccess(res, 201, 'Category created', category);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update category (admin)
// @route   PUT /api/categories/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!category) return next(new AppError('Category not found', 404));
    return sendSuccess(res, 200, 'Category updated', category);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete category — nullifies refs in Projects and Videos (admin)
// @route   DELETE /api/categories/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    // Remove category reference from all projects and videos
    await Promise.all([
      Project.updateMany({ category: req.params.id }, { $unset: { category: '' } }),
      Video.updateMany(  { category: req.params.id }, { $unset: { category: '' } }),
    ]);

    await category.deleteOne();
    return sendSuccess(res, 200, 'Category deleted and references cleared');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Batch reorder categories
// @route   PATCH /api/categories/reorder/batch
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Items array is required', 400));
    }

    const bulkOps = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Category.bulkWrite(bulkOps);
    return sendSuccess(res, 200, 'Categories reordered');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
};