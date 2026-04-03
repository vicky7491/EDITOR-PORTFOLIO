import axiosInstance from './axiosInstance';

export const siteApi = {
  getSettings:     () => axiosInstance.get('/api/settings'),
  getCategories:   () => axiosInstance.get('/api/categories'),
  getServices:     () => axiosInstance.get('/api/services'),
  getTestimonials: () => axiosInstance.get('/api/testimonials'),
};