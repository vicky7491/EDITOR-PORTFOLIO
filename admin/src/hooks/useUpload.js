import { useState, useCallback } from 'react';
import axiosAdmin from '@/api/axiosAdmin';
import toast from 'react-hot-toast';

/**
 * Generic upload hook with progress tracking.
 *
 * Usage:
 *   const { upload, uploading, progress, error, reset } = useUpload();
 *
 *   const media = await upload(file, { type: 'image', folder: 'thumbnails' });
 *   // media = { url: '...', publicId: '...' } or null on failure
 */
const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState(null);

  /**
   * Upload a file to Cloudinary via the backend.
   * @param {File}   file
   * @param {object} options
   * @param {string} options.type   - 'image' | 'video'
   * @param {string} options.folder - Cloudinary sub-folder (e.g. 'thumbnails')
   * @returns {Promise<{url: string, publicId: string} | null>}
   */
  const upload = useCallback(async (file, { type = 'image', folder = 'thumbnails' } = {}) => {
    if (!file) return null;

    setUploading(true);
    setProgress(0);
    setError(null);

    const endpoint =
      type === 'video'
        ? '/api/admin/upload/video'
        : `/api/admin/upload/image?folder=${folder}`;

    const formData = new FormData();
    formData.append(type, file);

    try {
      const res = await axiosAdmin.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(pct);
          }
        },
      });

      setProgress(100);
      // Backend returns { url, publicId }
      return res.data.data;

    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(message);
      toast.error(message);
      return null;

    } finally {
      setUploading(false);
    }
  }, []);

  /**
   * Reset all state back to defaults.
   * Call this between uploads or on component unmount cleanup.
   */
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return { upload, uploading, progress, error, reset };
};

export default useUpload;