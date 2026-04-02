// Cloudinary delete helper — called when admin removes media

const cloudinary = require('../config/cloudinary');

/**
 * Delete a resource from Cloudinary
 * @param {string} publicId  - The Cloudinary public ID
 * @param {string} type      - 'image' or 'video'
 */
const deleteFromCloudinary = async (publicId, type = 'image') => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    return result;
  } catch (error) {
    console.error(`❌ Cloudinary delete failed for ${publicId}:`, error.message);
    return null;
  }
};

/**
 * Get a Cloudinary URL with transformations applied
 * Useful for generating optimized thumbnails server-side
 */
const getOptimizedImageUrl = (publicId, { width = 800, height = 600, crop = 'fill' } = {}) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
};

module.exports = { deleteFromCloudinary, getOptimizedImageUrl };