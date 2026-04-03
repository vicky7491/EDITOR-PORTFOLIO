import axiosInstance from './axiosInstance';

export const videoApi = {
  getAll: (params = {}) =>
    axiosInstance.get('/api/videos', { params }),

  getFeatured: (limit = 6) =>
    axiosInstance.get('/api/videos/featured', { params: { limit } }),

  getById: (id) =>
    axiosInstance.get(`/api/videos/${id}`),

  incrementView: (id) =>
    axiosInstance.patch(`/api/videos/${id}/view`),
};