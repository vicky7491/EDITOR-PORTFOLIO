import axiosAdmin from '@/api/axiosAdmin';

// List all assets in a folder
export const listMedia = (params = {}) =>
  axiosAdmin.get('/api/admin/media', { params });

// Search assets by filename
export const searchMedia = (q, resource_type = 'image') =>
  axiosAdmin.get('/api/admin/media/search', { params: { q, resource_type } });

// Get storage usage stats
export const getMediaUsage = () =>
  axiosAdmin.get('/api/admin/media/usage');

// Delete a single asset (publicId must be base64 encoded)
export const deleteAsset = (publicId, resource_type = 'image') => {
  const encoded = btoa(publicId);
  return axiosAdmin.delete(`/api/admin/media/${encoded}`, {
    params: { resource_type },
  });
};

// Bulk delete
export const bulkDeleteAssets = (publicIds, resourceType = 'image') =>
  axiosAdmin.post('/api/admin/media/bulk-delete', { publicIds, resourceType });

// Get upload signature (for direct browser uploads)
export const getUploadSignature = (folder, resource_type = 'image') =>
  axiosAdmin.get('/api/admin/media/signature', { params: { folder, resource_type } });