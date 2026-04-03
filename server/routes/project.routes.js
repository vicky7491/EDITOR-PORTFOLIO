const express = require('express');
const router  = express.Router();

const {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  getProjectBySlug,
  incrementProjectViews,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} = require('../controllers/project.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const {
  validateCreateProject,
  validateUpdateProject,
} = require('../validations/project.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/projects            → all published projects (with filter/pagination)
router.get('/', getAllProjects);

// GET /api/projects/featured   → featured projects only
router.get('/featured', getFeaturedProjects);

router.get('/admin/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { Project } = require('../models/Project.model');
    const project = await Project.findById(req.params.id).select('-__v');
    if (!project) {
      return next(require('../utils/AppError')('Project not found', 404));
    }
    return require('../utils/apiResponse').sendSuccess(res, 200, 'Project retrieved', project);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/by-id/:id  (admin only)
router.get('/by-id/:id', protect, adminOnly, getProjectById);

// GET /api/projects/:slug      → single project by slug
router.get('/:slug', getProjectBySlug);

// PATCH /api/projects/:slug/view  → increment view counter (no auth needed)
router.patch('/:slug/view', incrementProjectViews);

// ─── Admin routes (protect + adminOnly) ───────────────────────────────────────

// POST /api/projects
router.post('/', protect, adminOnly, validateCreateProject, createProject);

// PUT /api/projects/:id
router.put('/:id', protect, adminOnly, validateUpdateProject, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', protect, adminOnly, deleteProject);

// PATCH /api/projects/reorder  → drag-and-drop order update
router.patch('/reorder/batch', protect, adminOnly, reorderProjects);

module.exports = router;