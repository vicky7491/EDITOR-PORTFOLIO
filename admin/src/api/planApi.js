import axiosAdmin from '@/api/axiosAdmin';

export const getAdminPlans = ()         => axiosAdmin.get('/api/plans/all');
export const createPlan    = (data)     => axiosAdmin.post('/api/plans', data);
export const updatePlan    = (id, data) => axiosAdmin.put(`/api/plans/${id}`, data);
export const deletePlan    = (id)       => axiosAdmin.delete(`/api/plans/${id}`);