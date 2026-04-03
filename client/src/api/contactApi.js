import axiosInstance from './axiosInstance';

export const contactApi = {
  submit: (data) => axiosInstance.post('/api/contact', data),
};