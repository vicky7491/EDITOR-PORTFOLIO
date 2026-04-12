// Media library controller — Cloudinary Admin API

const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/apiResponse");
const { UPLOAD_FOLDERS } = require("../config/constants");
const crypto = require("crypto");

// ── Folder map for display ────────────────────────────────────────────────────
const FOLDER_LABELS = {
  [UPLOAD_FOLDERS.THUMBNAILS]: "Thumbnails",
  [UPLOAD_FOLDERS.VIDEOS]: "Videos",
  [UPLOAD_FOLDERS.AVATARS]: "Avatars",
  [UPLOAD_FOLDERS.SERVICES]: "Services",
  [UPLOAD_FOLDERS.SITE_ASSETS]: "Site Assets",
  [UPLOAD_FOLDERS.BEFORE_AFTER]: "Before / After",
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    List media assets from Cloudinary
// @route   GET /api/admin/media
// @access  Admin
// Query: folder, resource_type (image|video), page, limit, search
// ─────────────────────────────────────────────────────────────────────────────
const listMedia = async (req, res, next) => {
  try {
    const {
      folder = "vickyvfx",
      resource_type = "image",
      page = 1,
      limit = 24,
      sort = "created_at",
      direction = "desc",
    } = req.query;

    const maxResults = Math.min(parseInt(limit), 100);
    const nextCursor = req.query.next_cursor || undefined;

    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type,
      prefix: folder,
      max_results: maxResults,
      next_cursor: nextCursor,
      direction,
      sort_by: sort === "created_at" ? "created_at" : "public_id",
      // Include asset metadata
      tags: true,
      context: true,
      image_metadata: resource_type === "image",
    });

    // Normalise resource list
    const assets = (result.resources || []).map((r) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      resourceType: r.resource_type,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      duration: r.duration, // videos
      createdAt: r.created_at,
      folder: r.folder,
      // Computed thumbnail URL for videos
      thumbnailUrl:
        r.resource_type === "video"
          ? cloudinary.url(r.public_id, {
              resource_type: "video",
              format: "jpg",
              transformation: [{ width: 400, height: 225, crop: "fill" }],
            })
          : null,
    }));

    return sendSuccess(res, 200, "Media retrieved", assets, {
      total: result.rate_limit_remaining, // Cloudinary doesn't give exact total
      nextCursor: result.next_cursor || null,
      folder,
      resourceType: resource_type,
    });
  } catch (error) {
    // Cloudinary 404 = folder doesn't exist yet — return empty
    if (error.http_code === 404) {
      return sendSuccess(res, 200, "No media yet", [], { nextCursor: null });
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Search media by filename/tag
// @route   GET /api/admin/media/search
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const searchMedia = async (req, res, next) => {
  try {
    const { q, resource_type = "image", limit = 24 } = req.query;

    if (!q || q.trim().length < 2) {
      return next(
        new AppError("Search query must be at least 2 characters", 400),
      );
    }

    const expression = `folder:vickyvfx* AND filename:*${q}* AND resource_type:${resource_type}`;

    const result = await cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(Math.min(parseInt(limit), 100))
      .with_field("tags")
      .with_field("context")
      .execute();

    const assets = (result.resources || []).map((r) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      resourceType: r.resource_type,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      createdAt: r.created_at,
      folder: r.folder,
    }));

    return sendSuccess(res, 200, "Search results", assets, {
      total: result.total_count,
      query: q,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete single asset
// @route   DELETE /api/admin/media/:publicId
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteMedia = async (req, res, next) => {
  try {
    // publicId is base64-encoded to handle forward slashes in the URL
    const publicId = Buffer.from(req.params.publicId, "base64").toString(
      "utf8",
    );
    const resourceType =
      req.query.resource_type || req.body?.resourceType || "image";

    if (!publicId) return next(new AppError("Public ID is required", 400));

    // Validate the asset belongs to our vickyvfx folder (security check)
    if (!publicId.startsWith("vickyvfx/")) {
      return next(
        new AppError("Cannot delete assets outside the vickyvfx folder", 403),
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true, // Purge CDN cache
    });

    if (result.result === "not found") {
      return next(new AppError("Asset not found in Cloudinary", 404));
    }

    return sendSuccess(res, 200, "Asset deleted", {
      publicId,
      result: result.result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Bulk delete assets
// @route   POST /api/admin/media/bulk-delete
// @access  Admin
// Body: { publicIds: string[], resourceType: 'image' | 'video' }
// ─────────────────────────────────────────────────────────────────────────────
const bulkDeleteMedia = async (req, res, next) => {
  try {
    const { publicIds, resourceType = "image" } = req.body;

    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return next(new AppError("publicIds array is required", 400));
    }

    if (publicIds.length > 100) {
      return next(
        new AppError("Cannot delete more than 100 assets at once", 400),
      );
    }

    // Security: ensure all IDs are within our folder
    const invalid = publicIds.filter((id) => !id.startsWith("vickyvfx/"));
    if (invalid.length > 0) {
      return next(
        new AppError("All publicIds must be within the vickyvfx folder", 403),
      );
    }

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      invalidate: true,
    });

    const deleted = Object.keys(result.deleted).filter(
      (k) => result.deleted[k] === "deleted",
    );
    const notFound = Object.keys(result.deleted).filter(
      (k) => result.deleted[k] === "not_found",
    );

    return sendSuccess(res, 200, `Deleted ${deleted.length} assets`, {
      deleted: deleted.length,
      notFound: notFound.length,
      failed: result.partial ? Object.keys(result.partial) : [],
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get storage usage stats
// @route   GET /api/admin/media/usage
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getMediaUsage = async (req, res, next) => {
  try {
    const usage = await cloudinary.api.usage();

    const formatBytes = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
      return `${(bytes / 1073741824).toFixed(2)} GB`;
    };

    const CLOUDINARY_FREE_STORAGE_LIMIT = 1 * 1024 * 1024 * 1024; // 1 GB in bytes

    const storageUsed = usage.storage?.usage || 0;
    const storageLimit = usage.storage?.limit || CLOUDINARY_FREE_STORAGE_LIMIT;
    const storagePercent = ((storageUsed / storageLimit) * 100).toFixed(1);

    return sendSuccess(res, 200, "Usage retrieved", {
      storage: {
        used: formatBytes(storageUsed),
        usedBytes: storageUsed,
        limit: formatBytes(storageLimit), // now shows "1.00 GB"
        limitBytes: storageLimit,
        percent: storagePercent,
      },
      bandwidth: {
        used: formatBytes(usage.bandwidth?.usage || 0),
        limit: formatBytes(usage.bandwidth?.limit || 0),
        percent:
          usage.bandwidth?.usage && usage.bandwidth?.limit
            ? ((usage.bandwidth.usage / usage.bandwidth.limit) * 100).toFixed(1)
            : 0,
      },
      resources: {
        images: usage.resources?.image || 0,
        videos: usage.resources?.video || 0,
      },
      transformations: usage.transformations?.usage || 0,
      plan: usage.plan || "free",
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Generate Cloudinary upload signature (for direct browser uploads)
// @route   GET /api/admin/media/signature
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getUploadSignature = (req, res, next) => {
  try {
    const { folder = "vickyvfx/thumbnails", resource_type = "image" } =
      req.query;
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { folder, timestamp };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET,
    );

    return sendSuccess(res, 200, "Signature generated", {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      resourceType: resource_type,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listMedia,
  searchMedia,
  deleteMedia,
  bulkDeleteMedia,
  getMediaUsage,
  getUploadSignature,
};
