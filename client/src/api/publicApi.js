// All public API calls — no auth required

import axiosInstance from './axiosInstance';

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all published projects
 * @param {object} params - page, limit, category, featured, search, sort
 */
export const getProjects = (params = {}) =>
  axiosInstance.get('/api/projects', { params });

/**
 * Get featured projects
 * @param {number} limit
 */
export const getFeaturedProjects = (limit = 6) =>
  axiosInstance.get('/api/projects/featured', { params: { limit } });

/**
 * Get a single project by slug
 * @param {string} slug
 */
export const getProjectBySlug = (slug) =>
  axiosInstance.get(`/api/projects/${slug}`);

/**
 * Increment project view counter (fire-and-forget)
 * @param {string} slug
 */
export const incrementProjectView = (slug) =>
  axiosInstance.patch(`/api/projects/${slug}/view`);

// ─────────────────────────────────────────────────────────────────────────────
// Videos
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all videos
 * @param {object} params - page, limit, category, featured, search
 */
export const getVideos = (params = {}) =>
  axiosInstance.get('/api/videos', { params });

/**
 * Get featured videos
 * @param {number} limit
 */
export const getFeaturedVideos = (limit = 6) =>
  axiosInstance.get('/api/videos/featured', { params: { limit } });

/**
 * Get single video by ID
 * @param {string} id
 */
export const getVideoById = (id) =>
  axiosInstance.get(`/api/videos/${id}`);

/**
 * Increment video view counter (fire-and-forget)
 * @param {string} id
 */
export const incrementVideoView = (id) =>
  axiosInstance.patch(`/api/videos/${id}/view`);

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all categories with project counts
 */
export const getCategories = () =>
  axiosInstance.get('/api/categories');

/**
 * Get single category by slug
 * @param {string} slug
 */
export const getCategoryBySlug = (slug) =>
  axiosInstance.get(`/api/categories/${slug}`);

// ─────────────────────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all active services
 */
export const getServices = () =>
  axiosInstance.get('/api/services');

/**
 * Get single service by ID
 * @param {string} id
 */
export const getServiceById = (id) =>
  axiosInstance.get(`/api/services/${id}`);

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all testimonials
 */
export const getTestimonials = () =>
  axiosInstance.get('/api/testimonials');

/**
 * Get featured testimonials
 * @param {number} limit
 */
export const getFeaturedTestimonials = (limit = 6) =>
  axiosInstance.get('/api/testimonials/featured', { params: { limit } });

// ─────────────────────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submit the contact form
 * @param {object} data - name, email, phone, subject, message, budget, service
 */
export const submitContact = (data) =>
  axiosInstance.post('/api/contact', data);

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get public site settings (hero, stats, socials, SEO, etc.)
 */
export const getSiteSettings = () =>
  axiosInstance.get('/api/settings');