import api from './axiosInstance'; export const ping = () => api.get('/health');
