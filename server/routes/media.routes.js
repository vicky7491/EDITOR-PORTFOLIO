// Media library routes — browse and manage all Cloudinary assets

const express = require('express');
const router  = express.Router();

const {
  listMedia,
  searchMedia,
  deleteMedia,
  bulkDeleteMedia,
  getMediaUsage,
  getUploadSignature,
} = require('../controllers/media.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

// All media routes are admin-only
router.use(protect, adminOnly);

// GET  /api/admin/media              → list all assets (paginated)
// Query: folder, resource_type, page, limit, search
router.get('/',              listMedia);

// GET  /api/admin/media/search       → search by filename
router.get('/search',        searchMedia);

// GET  /api/admin/media/usage        → stats — total storage, counts per folder
router.get('/usage',         getMediaUsage);

// GET  /api/admin/media/signature    → get a Cloudinary upload signature
//                                      (for direct browser uploads in future)
router.get('/signature',     getUploadSignature);

// DELETE /api/admin/media/:publicId  → delete single asset
// publicId is base64-encoded to handle slashes
router.delete('/:publicId',  deleteMedia);

// POST /api/admin/media/bulk-delete  → delete multiple assets
// Body: { publicIds: ['id1', 'id2'], resourceType: 'image' | 'video' }
router.post('/bulk-delete',  bulkDeleteMedia);

module.exports = router;