// Cloudinary SDK configuration

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true, // Always use HTTPS
  timeout:    10 * 60 * 1000, // 10 minutes
});

module.exports = cloudinary;