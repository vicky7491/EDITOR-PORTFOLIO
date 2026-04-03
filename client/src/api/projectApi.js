import axiosInstance from './axiosInstance';

export const projectApi = {
  getAll: (params = {}) =>
    axiosInstance.get('/api/projects', { params }),

  getFeatured: (limit = 6) =>
    axiosInstance.get('/api/projects/featured', { params: { limit } }),

  getBySlug: (slug) =>
    axiosInstance.get(`/api/projects/${slug}`),

  incrementView: (slug) =>
    axiosInstance.patch(`/api/projects/${slug}/view`),
};