const Project  = require('../models/Project.model');
const AppError = require('../utils/AppError');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');
const { deleteFromCloudinary } = require('../utils/cloudinaryHelpers');
const slugify = require('slugify');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all published projects (public)
// @route   GET /api/projects
// @access  Public
// Query params: page, limit, category, featured, search, sort
// ─────────────────────────────────────────────────────────────────────────────
const getAllProjects = async (req, res, next) => {
  try {
    const {
      page     = 1,
      limit    = 12,
      category,
      featured,
      search,
      sort     = '-createdAt',
    } = req.query;

    // Build filter — public always sees only published
    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title:            { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags:             { $regex: search, $options: 'i' } },
        { clientName:       { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    return sendSuccess(
      res, 200, 'Projects retrieved',
      projects,
      paginationMeta(total, page, limit)
    );

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get featured projects (public)
// @route   GET /api/projects/featured
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getFeaturedProjects = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const projects = await Project.find({ status: 'published', featured: true })
      .sort('order -createdAt')
      .limit(limit)
      .select('-__v');

    return sendSuccess(res, 200, 'Featured projects retrieved', projects);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single project by ID (admin — includes drafts)
// @route   GET /api/projects/by-id/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).select('-__v');
    if (!project) return next(new AppError('Project not found', 404));
    return sendSuccess(res, 200, 'Project retrieved', project);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single project by slug (public)
// @route   GET /api/projects/:slug
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug:   req.params.slug,
      status: 'published',
    }).select('-__v');

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    return sendSuccess(res, 200, 'Project retrieved', project);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Increment project view count
// @route   PATCH /api/projects/:slug/view
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const incrementProjectViews = async (req, res, next) => {
  try {
    await Project.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } }
    );
    return sendSuccess(res, 200, 'View counted');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a project (admin)
// @route   POST /api/projects
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const {
      title, shortDescription, description, category,
      softwareUsed, clientName, projectDate, tags,
      featured, order, externalLink, status,
      thumbnail, videoUrl, videoPublicId, beforeAfter,
    } = req.body;

    // Ensure slug uniqueness — append timestamp if duplicate
    let slug = slugify(title, { lower: true, strict: true });
    const existing = await Project.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const project = await Project.create({
      title, slug, shortDescription, description,
      category, softwareUsed, clientName, projectDate,
      tags, featured, order, externalLink, status,
      thumbnail, videoUrl, videoPublicId, beforeAfter,
    });

    return sendSuccess(res, 201, 'Project created', project);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a project (admin)
// @route   PUT /api/projects/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== project.title) {
      let newSlug = slugify(req.body.title, { lower: true, strict: true });
      const existing = await Project.findOne({ slug: newSlug, _id: { $ne: project._id } });
      if (existing) newSlug = `${newSlug}-${Date.now()}`;
      req.body.slug = newSlug;
    }

    // If thumbnail is being replaced, delete old one from Cloudinary
    if (req.body.thumbnail && project.thumbnail?.publicId &&
        req.body.thumbnail.publicId !== project.thumbnail.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId, 'image');
    }

    // If video is being replaced, delete old one
    if (req.body.videoPublicId && project.videoPublicId &&
        req.body.videoPublicId !== project.videoPublicId) {
      await deleteFromCloudinary(project.videoPublicId, 'video');
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    return sendSuccess(res, 200, 'Project updated', updated);

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a project (admin)
// @route   DELETE /api/projects/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new AppError('Project not found', 404));

    // Clean up Cloudinary assets
    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId, 'image');
    }
    if (project.videoPublicId) {
      await deleteFromCloudinary(project.videoPublicId, 'video');
    }
    if (project.beforeAfter?.before?.publicId) {
      await deleteFromCloudinary(project.beforeAfter.before.publicId, 'image');
    }
    if (project.beforeAfter?.after?.publicId) {
      await deleteFromCloudinary(project.beforeAfter.after.publicId, 'image');
    }

    await project.deleteOne();

    return sendSuccess(res, 200, 'Project deleted successfully');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Batch reorder projects (drag-and-drop)
// @route   PATCH /api/projects/reorder/batch
// @access  Admin
// Body: { items: [{ id, order }, ...] }
// ─────────────────────────────────────────────────────────────────────────────
const reorderProjects = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Items array is required', 400));
    }

    // Bulk write — one DB round trip for all updates
    const bulkOps = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));

    await Project.bulkWrite(bulkOps);

    return sendSuccess(res, 200, 'Projects reordered successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  getProjectBySlug,
  incrementProjectViews,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};